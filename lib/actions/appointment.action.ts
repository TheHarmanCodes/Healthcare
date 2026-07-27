"use server";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  tablesDB,
} from "@/lib/appwrite.config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { AdminAppointmentUpdate, CreateAppointmentParams } from "@/types";
import {
  AdminAppointmentUpdateSchema,
  CreateAppointmentSchema,
} from "@/lib/validation";
import { Appointment, Patient } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import {
  assertTrustedOrigin,
  auditLog,
  AuthError,
  getCurrentUser,
  requireRole,
} from "@/lib/auth/rbac";

/** Enforces the only valid admin appointment status transitions: pending -> scheduled and pending/scheduled -> cancelled. */
function ensureAppointmentTransition(
  currentStatus: Appointment["status"],
  nextStatus: Appointment["status"],
) {
  const canSchedule = currentStatus === "pending" && nextStatus === "scheduled";
  const canCancel =
    (currentStatus === "pending" || currentStatus === "scheduled") &&
    nextStatus === "cancelled";

  if (!canSchedule && !canCancel) {
    throw new Error(
      `Invalid appointment transition: ${currentStatus} to ${nextStatus}`,
    );
  }
}

/** Loads the patient row so appointment ownership can be derived server-side instead of trusting client userId. */
async function getPatientRow(patientId: string) {
  const patient = await tablesDB.getRow({
    databaseId: DATABASE_ID!,
    tableId: PATIENT_COLLECTION_ID!,
    rowId: patientId,
  });

  return patient as unknown as Patient;
}

/**
 * Creates a pending appointment.
 * Public patient self-service is allowed only when the submitted userId matches the patient row owner;
 * logged-in doctors are blocked, while super-admin/staff may create appointments on a patient's behalf.
 */
export const createAppointment = async (
  appointment: CreateAppointmentParams,
) => {
  try {
    await assertTrustedOrigin();

    const currentUser = await getCurrentUser();
    const validated = CreateAppointmentSchema.parse(appointment);
    const patient = await getPatientRow(appointment.patient);

    if (!currentUser) {
      if (patient.userId !== appointment.userId) {
        throw new AuthError(
          "You cannot create appointments for another patient.",
          403,
        );
      }
    } else if (currentUser.role === "doctor") {
      throw new AuthError("Doctors cannot schedule appointments.", 403);
    } else if (
      currentUser.role === "patient" &&
      patient.userId !== currentUser.id
    ) {
      throw new AuthError(
        "You cannot create appointments for another patient.",
        403,
      );
    } else if (
      currentUser.role !== "patient" &&
      currentUser.role !== "super-admin" &&
      currentUser.role !== "staff"
    ) {
      throw new AuthError("You do not have permission for this action.", 403);
    }

    const userId =
      currentUser?.role === "patient" ? currentUser.id : patient.userId;

    const newAppointment = await tablesDB.createRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_COLLECTION_ID!,
      rowId: ID.unique(),
      data: {
        userId,
        patient: appointment.patient,
        primaryPhysician: validated.primaryPhysician,
        schedule: validated.schedule,
        reason: validated.reason,
        note: validated.note,
        status: "pending",
      },
    });

    if (currentUser) {
      auditLog({
        actorId: currentUser.id,
        role: currentUser.role,
        action: "create-appointment",
        appointmentId: newAppointment.$id,
        newStatus: "pending",
      });
    }

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Returns appointment details to privileged dashboard roles, the authenticated patient owner,
 * or the public success page when it supplies the route userId that owns the appointment.
 */
export const getAppointment = async (
  appointmentId: string,
  ownerUserId?: string,
) => {
  try {
    const currentUser = await getCurrentUser();
    const appointment = (await tablesDB.getRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_COLLECTION_ID!,
      rowId: appointmentId,
    })) as unknown as Appointment;

    if (
      currentUser?.role === "super-admin" ||
      currentUser?.role === "staff" ||
      currentUser?.role === "doctor" ||
      (currentUser?.role === "patient" &&
        appointment.userId === currentUser.id) ||
      (!currentUser && ownerUserId && appointment.userId === ownerUserId)
    ) {
      return parseStringify(appointment);
    }

    throw new AuthError(
      currentUser
        ? "You cannot view another patient's appointment."
        : "Authentication required.",
      currentUser ? 403 : 401,
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/** Lists all appointments for dashboard roles only: super-admin, staff, and doctor. */
export const getRecentAppointmentList = async () => {
  try {
    await requireRole(["super-admin", "staff", "doctor"]);

    const appointments = await tablesDB.listRows({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_COLLECTION_ID!,
      queries: [
        Query.orderDesc("$createdAt"),
        Query.select(["*", "patient.*"]),
      ],
    });

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.rows as unknown as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount += 1;
        } else if (appointment.status === "pending") {
          acc.pendingCount += 1;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount += 1;
        }
        return acc;
      },
      initialCounts,
    );

    const data = {
      totalCounts: appointments.total,
      ...counts,
      rows: appointments.rows,
    };
    return parseStringify(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Applies a strict admin schedule/cancel command.
 * The browser may send only the discriminated command payload; the server loads the existing row,
 * checks role and transition rules, then builds the Appwrite update object itself.
 */
export const updateAppointment = async (command: AdminAppointmentUpdate) => {
  try {
    await assertTrustedOrigin();
    const actor = await requireRole(["super-admin", "staff"]);
    const validated = AdminAppointmentUpdateSchema.parse(command);

    const existingAppointment = (await tablesDB.getRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_COLLECTION_ID!,
      rowId: validated.appointmentId,
    })) as unknown as Appointment;

    const nextStatus =
      validated.type === "schedule" ? "scheduled" : "cancelled";
    ensureAppointmentTransition(existingAppointment.status, nextStatus);

    const updateData =
      validated.type === "schedule"
        ? {
            primaryPhysician: validated.primaryPhysician,
            schedule: validated.schedule,
            status: nextStatus,
          }
        : {
            status: nextStatus,
            cancellationReason: validated.cancellationReason,
          };

    const updatedAppointment = await tablesDB.updateRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_COLLECTION_ID!,
      rowId: validated.appointmentId,
      data: updateData,
    });

    auditLog({
      actorId: actor.id,
      role: actor.role,
      action: `${validated.type}-appointment`,
      appointmentId: validated.appointmentId,
      previousStatus: existingAppointment.status,
      newStatus: nextStatus,
    });

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (err) {
    console.error(err);
    throw err;
  }
};


