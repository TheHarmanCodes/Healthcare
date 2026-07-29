"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { login } from "@/lib/actions/auth.action";
import { staffFormSchema } from "@/lib/validation";
import { z } from "zod";
import { toast } from "sonner";
import { isNetworkError } from "@/lib/network";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import SubmitButton from "./SubmitButton";

/**
 * Credential-only admin login modal.
 * It delegates authentication to the server action and never stores authorization state in browser storage.
 */
const StaffLogin = () => {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof staffFormSchema>>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  /** Submits credentials to the server; successful login redirects from the server action after the HttpOnly cookie is set. */

  const onSubmit = async ({
    email,
    password,
  }: z.infer<typeof staffFormSchema>) => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const message = "You are offline. Reconnect to continue.";
      setError(message);
      toast.error(message);
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const result = await login(email, password);

      if (result.success) {
        router.replace("/admin");
        return;
      }

      const message = result.error ?? "Unable to sign in with those credentials.";
      setError(message);
      toast.error(message);
    } catch (err) {
      console.error(err);
      const message = isNetworkError(err)
        ? "Connection lost while signing in. Please reconnect and try again."
        : "An unexpected error occurred. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-[95vw] max-w-sm sm:max-w-md lg:min-w-lg lg:max-w-none 2xl:min-w-xl space-y-5 bg-dark-400 border-0 p-5 sm:p-6 lg:p-8 shadow-none outline-none ring-0">
        <AlertDialogHeader>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-sm p-2 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-offset-2 sm:right-5 sm:top-5"
          >
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer"
            />
          </button>
          <div className="flex items-start justify-between">
            <AlertDialogTitle className="text-base sm:text-lg xl:text-2xl">
              Staff Sign In
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-xs sm:text-sm">
            Sign in with your PulseCare account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <CustomFormField
            control={form.control}
            name="email"
            fieldType={FormFieldType.INPUT}
            label="Email"
            placeholder="staff@pulsecare.com"
            iconSrc="/assets/icons/user-shield.svg"
            iconAlt="email"
          />

          <CustomFormField
            control={form.control}
            name="password"
            fieldType={FormFieldType.PASSWORD}
            label="Password"
            placeholder="Enter your password"
            iconSrc="/assets/icons/key-round.svg"
            iconAlt="password"
          />

          {error && (
            <p className="text-14-regular mt-4 flex justify-center text-red-500">
              {error}
            </p>
          )}

          <AlertDialogFooter className="border-t-0 bg-transparent px-0 pt-2">
            <SubmitButton
              isLoading={isLoading}
              className="w-full shad-primary-btn cursor-pointer py-4 mt-2 hover:shad-primary-btn-hover"
            >
              Sign In
            </SubmitButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StaffLogin;


