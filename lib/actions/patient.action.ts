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
      const existingUser = await users.list(
        {
          queries: [Query.equal("email", [user.email])],
        },
        // {Query.equal("email", [user.email]),}
      );
      return parseStringify(existingUser?.users[0]);
    }
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get({ userId });
    return parseStringify(user);
  } catch (err) {
    console.error("[getPatient] failed", err);
    throw err;
  }
};

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

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
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
    return parseStringify(newpatient);
  } catch (error) {
    console.error("[registerPatient] failed", error);
    throw error;
  }
};
