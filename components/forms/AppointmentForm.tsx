"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";

import { Doctors } from "@/constants";
import { SelectItem } from "@/components/ui/select";
import Image from "next/image";
import { Status } from "@/types";
import { createAppointment } from "@/lib/actions/appointment.action";

const AppointmentForm = ({
  userId,
  patientId,
  type,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    setError("");

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "canceled";
        break;
      default:
        status = "pending";
        break;
    }
    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);
        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`,
          );
        }
      }
    } catch (err) {
      console.error(err);
      const message = "An error occurred. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  let btnLabel;

  switch (type) {
    case "create":
      btnLabel = "Create Appointment";
      break;
    case "cancel":
      btnLabel = "Cancel Appointment";
      break;
    case "schedule":
      btnLabel = "Schedule Appointment";
      break;
  }

  return (
    <form
      id="patient-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <section className="mb-12 space-y-4">
        <h1 className="header">Hi there 👋</h1>
        <p className="text-dark-700">Request a new appointment in 10 seconds</p>
      </section>

      {type !== "cancel" && (
        <>
          {/*Primary Physician input dropdown*/}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            labelColor="text-[#9aa5ad]"
            label="Doctor"
            placeholder="Select a doctor"
          >
            {Doctors.map((doctor) => (
              <SelectItem
                value={doctor.name}
                key={doctor.name}
                className="shad-select-item-doctor data-highlighted:shad-select-item-doctor-highlighted data-[state=checked]:shad-select-item-doctor-selected cursor-pointer"
              >
                <div className="flex items-center gap-3 px-1 ">
                  <div className="shad-doctor-avatar-container">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={34}
                      height={34}
                      className="shad-doctor-avatar"
                    />
                    <div className="shad-doctor-online" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="shad-doctor-name">{doctor.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="shad-doctor-specialty">
                        {doctor.specialty}
                      </p>
                      <span className="w-1 h-1 bg-dark-500 rounded-full" />
                      <div className="shad-doctor-rating">
                        <span className="shad-doctor-rating-star">★</span>
                        <span>{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          {/*Appointment schedule date input*/}
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="schedule"
            label="Expected appointment date"
            showTimeSelect
            placeholder="DD/MM/YYYY - h:mm aa"
            dateFormat="dd/MM/yyyy - h:mm aa"
          />

          {/*Appointment Reason & additional notes input*/}
          <div className="flex flex-col gap-4 xl:flex-row ">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="reason"
              label="Reason for appointment "
              placeholder="ex: Annual montly check-up"
              controlClassName="h-25"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="note"
              label="Additional comments/notes"
              placeholder="ex: Prefer afternoon appointments, if possible"
              controlClassName="h-25"
            />
          </div>
        </>
      )}

      {type === "cancel" && (
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="cancellationReason"
          label="Reason for cancellation"
          placeholder="Enter reason for cancellation"
        />
      )}

      <SubmitButton
        isLoading={isLoading}
        className={`${type === "cancel" ? "shad-danger-brn" : "shad-primary-btn"} w-full py-4 mt-2 cursor-pointer`}
      >
        {btnLabel}
      </SubmitButton>

    </form>
  );
};

export default AppointmentForm;
