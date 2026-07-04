"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { formSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import {createUser} from "@/lib/actions/patient.action";

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  async function onSubmit({ name, email, phone }: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError("");
    try {
      const userData = {name, email, phone};

      const user = await createUser(userData);
      if(user) {
        router.push(`/patients/${user.$id}/register`);
      } else {
        const message = "Failed to create user. Please try again.";
        setError(message);
        toast.error(message);
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

  return (
    <form
      id="patient-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-4"
    >
      <section className="mb-12 space-y-4">
        <h1 className="header">Hi there 👋</h1>
        <p className="text-dark-700">Schedule your first appointment.</p>
      </section>

      <CustomFormField
        control={form.control}
        name="name"
        fieldType={FormFieldType.INPUT}
        label="Full Name"
        placeholder="John Doe"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"
      />

      <CustomFormField
        control={form.control}
        name="email"
        fieldType={FormFieldType.INPUT}
        label="Email"
        placeholder="johndoe@example.com"
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"
      />

      <CustomFormField
        control={form.control}
        name="phone"
        fieldType={FormFieldType.PHONE_INPUT}
        label="Phone number"
        placeholder="(555) 123-456-7890"
      />
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  );
};

export default PatientForm;
