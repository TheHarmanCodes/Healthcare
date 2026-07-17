"use server";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite.config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { CreateAppointmentParams, UpdateAppointmentParams } from "@/types";
import { CreateAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
  appointment: CreateAppointmentParams,
) => {
  try {
    const validated = CreateAppointmentSchema.parse(appointment);
    const newAppointment = await tablesDB.createRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_COLLECTION_ID!,
      rowId: ID.unique(),
      data: { ...appointment, ...validated },
    });
    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await tablesDB.getRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_COLLECTION_ID!,
      rowId: appointmentId,
    });
    return parseStringify(appointment);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getRecentAppointmentList = async () => {
  try {
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

export const updateAppointment = async ({
  appointmentId,
  appointment,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await tablesDB.updateRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_COLLECTION_ID!,
      rowId: appointmentId,
      data: appointment,
    });

    if (!updatedAppointment) {
      return;
    }

    //SMS notification

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
