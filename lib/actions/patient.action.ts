"use server";

import {
  BUCKET_ID,
  DATABASE_ID,
  NEXT_PUBLIC_ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  tablesDB,
  users,
} from "@/lib/appwrite.config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { InputFile } from "node-appwrite/file";
import { CreateUserParams, RegisterUserParams } from "@/types";
import {
  assertTrustedOrigin,
  auditLog,
  AuthError,
  getCurrentUser,
} from "@/lib/auth/rbac";

/**
 * Public patient bootstrap action.
 * Creates or returns an Appwrite user record without assigning privileged labels.
 */
export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create({
      userId: ID.unique(),
      email: user.email,
      phone: user.phone,
      name: user.name,
    });
    return parseStringify(newUser);
  } catch (error: unknown) {
    const appwriteError = error as { code?: number };

    if (appwriteError.code === 409) {
      let existingUser = await users.list({
        queries: [Query.equal("email", [user.email])],
      });
      if (!existingUser?.users?.length && user.phone) {
        existingUser = await users.list({
          queries: [Query.equal("phone", [user.phone])],
        });
      }
      return parseStringify(existingUser?.users[0]);
    }
    throw error;
  }
};

/** Fetches an Appwrite user by id for the patient registration page. */
export const getUser = async (userId: string) => {
  try {
    const user = await users.get({ userId });
    return parseStringify(user);
  } catch (err) {
    console.error("[getPatient] failed", err);
    throw err;
  }
};

/** Looks up the patient profile row linked to an Appwrite user id. */
export const getPatient = async (userId: string) => {
  try {
    const patients = await tablesDB.listRows({
      databaseId: DATABASE_ID!,
      tableId: PATIENT_COLLECTION_ID!,
      queries: [Query.equal("userId", userId)],
    });

    if (!patients.rows.length) return null;
    return parseStringify(patients.rows[0]);
  } catch (err) {
    console.error("[getUser] failed", err);
    throw err;
  }
};

/**
 * Registers patient demographic/medical profile data.
 * This intentionally supports both public patient self-registration and admin-side walk-in registration;
 * doctors are blocked and the app never writes privileged Appwrite labels.
 */
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    await assertTrustedOrigin();
    const actor = await getCurrentUser();

    // This action intentionally serves both public patient self-registration
    // and admin-side walk-in registration; privileged labels are never written here.
    if (actor?.role === "doctor") {
      throw new AuthError("Doctors cannot register patients.", 403);
    }

    if (actor?.role === "patient" && actor.id !== patient.userId) {
      throw new AuthError(
        "Patients can only complete their own registration.",
        403,
      );
    }

    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument.get("blobFile") as Blob,
        identificationDocument.get("filename") as string,
      );
      file = await storage.createFile({
        bucketId: BUCKET_ID!,
        fileId: ID.unique(),
        file: inputFile,
      });
    }

    const newpatient = await tablesDB.createRow({
      databaseId: DATABASE_ID!,
      tableId: PATIENT_COLLECTION_ID!,
      rowId: ID.unique(),
      data: {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file
          ? `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      },
    });

    if (actor?.role === "super-admin" || actor?.role === "staff") {
      auditLog({
        actorId: actor.id,
        role: actor.role,
        action: "register-patient",
      });
    }

    return parseStringify(newpatient);
  } catch (error) {
    console.error("[registerPatient] failed", error);
    throw error;
  }
};
