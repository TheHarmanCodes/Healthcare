"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { registerPatient } from "@/lib/actions/patient.action";
import { PatientFormValidation } from "@/lib/validation";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { SelectItem } from "@/components/ui/select";
import FileUploader from "@/components/FileUploader";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    try {
      if (!user?.$id) {
        throw new Error("Missing user id on register form");
      }

      let identificationDocument: FormData | undefined;

      if (
        values.identificationDocument &&
        values.identificationDocument.length > 0
      ) {
        const file = values.identificationDocument[0];
        const blobFile = new Blob([file], { type: file.type });

        identificationDocument = new FormData();
        identificationDocument.append("blobFile", blobFile);
        identificationDocument.append("filename", file.name);
      }

      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument,
      };

      const patient = await registerPatient(patientData);

      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (err) {
      console.error("[RegisterForm] submit failed", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      id="patient-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-1 flex-col gap-6 "
    >
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Welcome 👋
        </h1>
        <p className="text-sm text-gray-400">
          Let us know more about yourself.
        </p>
      </section>

      <section className="space-y-6 lg:mb-2">
        <div className="space-y-1">
          <h2 className="sub-header">Personal Information</h2>
        </div>
      </section>

      <CustomFormField
        control={form.control}
        name="name"
        fieldType={FormFieldType.INPUT}
        labelColor="text-[#9aa5ad]"
        label="Full Name"
        placeholder="John Doe"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"
      />

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="email"
            fieldType={FormFieldType.INPUT}
            labelColor="text-[#9aa5ad]"
            label="Email"
            placeholder="johndoe@example.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
        </div>
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="phone"
            fieldType={FormFieldType.PHONE_INPUT}
            labelColor="text-[#9aa5ad]"
            label="Phone number"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="birthDate"
            fieldType={FormFieldType.DATE_PICKER}
            labelColor="text-[#9aa5ad]"
            label="Date of Birth"
            placeholder="DD-MMMM-YYYY"
            iconSrc="/assets/icons/calendar.svg"
            iconAlt="calendar"
            dateFormat="dd-MMMM-yyyy"
          />
        </div>
        <div className="flex-1">
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            labelColor="text-[#9aa5ad]"
            label="Gender"
            renderSkeleton={(field) => (
              <RadioGroup
                className="flex h-11 gap-6 xl:justify-between w-fit"
                onValueChange={field.onChange}
                value={field.value}
              >
                {GenderOptions.map((option, i) => (
                  <div
                    key={option + i}
                    className="flex items-center gap-2 rounded-md border border-dashed border-gray-700 px-4 py-2 has-checked:border-blue-500 has-checked:bg-blue-500/10"
                  >
                    <RadioGroupItem
                      value={option}
                      id={option}
                      className="cursor-pointer"
                    />
                    <Label
                      htmlFor={option}
                      className="cursor-pointer text-sm text-white"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="address"
            fieldType={FormFieldType.INPUT}
            labelColor="text-[#9aa5ad]"
            label="Address"
            placeholder="ex: 14th Street, India, Pin-6104"
          />
        </div>
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="occupation"
            fieldType={FormFieldType.INPUT}
            labelColor="text-[#9aa5ad]"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="emergencyContactName"
            fieldType={FormFieldType.INPUT}
            labelColor="text-[#9aa5ad]"
            label="Emergency Contact Name"
            placeholder="Guardian’s name"
          />
        </div>
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="emergencyContactNumber"
            fieldType={FormFieldType.PHONE_INPUT}
            labelColor="text-[#9aa5ad]"
            label="Emergency Phone Number"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <section className="space-y-6 mt-9 lg:mb-2">
        <div className="space-y-1">
          <h2 className="sub-header">Medical Information</h2>
        </div>
      </section>

      <CustomFormField
        control={form.control}
        name="primaryPhysician"
        fieldType={FormFieldType.SELECT}
        labelColor="text-[#9aa5ad]"
        label="Primary Physician"
        placeholder="Select a physician"
      >
        {Doctors.map((doctor) => (
          <SelectItem value={doctor.name} key={doctor.name}>
            <div className="flex cursor-pointer items-center gap-2">
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={34}
                height={34}
                className="rounded-full border border-dark-500"
              />
              <p>{doctor.name}</p>
            </div>
          </SelectItem>
        ))}
      </CustomFormField>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="insuranceProvider"
            fieldType={FormFieldType.INPUT}
            labelColor="text-[#9aa5ad]"
            label="Insurance provider"
            placeholder="ex: BlueCross"
          />
        </div>
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="insurancePolicyNumber"
            fieldType={FormFieldType.INPUT}
            labelColor="text-[#9aa5ad]"
            label="Insurance policy number"
            placeholder="ex: AB-12345678-90"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="allergies"
            fieldType={FormFieldType.TEXTAREA}
            labelColor="text-[#9aa5ad]"
            label="Allergies (if any)"
            placeholder="ex: Peanuts, Penicilin, Pollen"
          />
        </div>
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="currentMedication"
            fieldType={FormFieldType.TEXTAREA}
            labelColor="text-[#9aa5ad]"
            label="Current Medications"
            placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="familyMedicalHistory"
            fieldType={FormFieldType.TEXTAREA}
            labelColor="text-[#9aa5ad]"
            label="Family Medical History (if relevant)"
            placeholder="ex: Mother had diabetes"
          />
        </div>
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            name="pastMedicalHistory"
            fieldType={FormFieldType.TEXTAREA}
            labelColor="text-[#9aa5ad]"
            label="Past Medical History"
            placeholder="ex: Asthma diagnosis in childhood"
          />
        </div>
      </div>

      <section className="space-y-6 mt-9  lg:mb-2">
        <div className="space-y-1">
          <h2 className="sub-header">Identification and Verification</h2>
        </div>
      </section>

      <CustomFormField
        control={form.control}
        name="identificationType"
        fieldType={FormFieldType.SELECT}
        labelColor="text-[#9aa5ad]"
        label="Identification Type"
        placeholder="Select an identification type"
      >
        {IdentificationTypes.map((type) => (
          <SelectItem value={type} key={type}>
            <div className="flex cursor-pointer gap-2 ">
              <p>{type}</p>
            </div>
          </SelectItem>
        ))}
      </CustomFormField>

      <CustomFormField
        control={form.control}
        name="identificationNumber"
        fieldType={FormFieldType.INPUT}
        labelColor="text-[#9aa5ad]"
        label="Identification Number"
        placeholder="ex: 12345678"
      />

      <div className="flex-1">
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          labelColor="text-[#9aa5ad]"
          label="Scanned Copy of Identification Document"
          renderSkeleton={(field) => (
            <FileUploader files={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <section className="space-y-6 mt-9  lg:mb-2">
        <div className="space-y-1">
          <h2 className="sub-header">Consent and Privacy</h2>
        </div>
      </section>

      <CustomFormField
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="treatmentConsent"
        label="I consent to receive treatment for my health condition."
      />
      <CustomFormField
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="disclosureConsent"
        label="I consent to the use and disclosure of my health information for treatment purposes."
      />
      <CustomFormField
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="privacyConsent"
        label="I acknowledge that I have reviewed and agree to the privacy policy"
      />

      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  );
};

export default RegisterForm;
