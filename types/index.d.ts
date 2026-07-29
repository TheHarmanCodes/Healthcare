import type { Appointment } from "./appwrite.types";

declare type SearchParamProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

declare type Gender = "Male" | "Female" | "Other";
declare type Status = "pending" | "scheduled" | "cancelled";
declare type type = "schedule" | "cancel";

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}

declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  primaryPhysician: string;
  reason: string;
  schedule: Date;
  status: Status;
  note: string | undefined;
};

/**
 * Narrow command payload accepted by updateAppointment.
 * Clients cannot submit userId, patient data, status, or full Appwrite documents.
 */
export type AdminAppointmentUpdate =
  | {
      type: "schedule";
      appointmentId: string;
      schedule: Date;
      primaryPhysician: string;
    }
  | {
      type: "cancel";
      appointmentId: string;
      cancellationReason: string;
    };

declare type AppointmentModelProps = {
  userId: string;
  type: "schedule" | "cancel";
  patientId: string;
  appointment: Appointment;
  description: string;
};


