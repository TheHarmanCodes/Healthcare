"use server";

import {
  APPOINTMENT_COLLECTION_ID,
  BUCKET_ID,
  DATABASE_ID,
  NEXT_PUBLIC_ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  tablesDB,
} from "@/lib/appwrite.config";
import { ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { CreateAppointmentParams } from "@/types";
import { CreateAppointmentSchema } from "@/lib/validation";

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
