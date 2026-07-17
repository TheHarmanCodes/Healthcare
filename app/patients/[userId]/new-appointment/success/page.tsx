import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchParamProps } from "@/types";
import { getAppointment } from "@/lib/actions/appointment.action";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import {isNetworkError} from "@/lib/network";
import OfflineState from "@/components/offline-state";

const Success = async ({ params, searchParams }: SearchParamProps) => {
  const { userId } = await params;
  const { appointmentId } = await searchParams;
  const id = Array.isArray(appointmentId) ? appointmentId[0] : appointmentId;
  if (!id) {
    notFound();
  }

  let appointment;
  try {
    appointment = await getAppointment(id);
  } catch (error) {
    if (isNetworkError(error)) {
      return (
        <OfflineState
          title="Appointment details are offline"
          description="We could not load the submitted appointment right now. Reconnect and refresh this page."
        />
      );
    }

    throw error;
  }

  if (!appointment) {
    notFound();
  }

  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician,
  );
  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            width={1000}
            height={1000}
            alt="PulseCare logo"
            loading="eager"
            className="h-15 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={300}
            alt="success"
          />
          <h2 className="header mb-6 text-center max-w-150">
            Your <span className="text-[#4ac97e]">appointment</span> request has
            been successfully submitted!
          </h2>
          <p>We will be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details:</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image ?? "/assets/icons/default-doctor.svg"}
              alt={doctor ? `Dr. ${doctor.name}` : "Doctor"}
              height={1000}
              width={1000}
              className="size-8"
            />
            <p className="whitespace-nowrap">
              {doctor?.name ?? "Unknown physician"}
            </p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>
        <Button variant={"outline"} className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
        <p className="copyright">© 2026 PulseCare</p>
      </div>
    </div>
  );
};
export default Success;
