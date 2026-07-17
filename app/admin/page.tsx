import React from "react";
import Link from "next/link";
import Image from "next/image";
import StatCard from "@/components/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.action";
import { DataTable } from "@/components/table/DataTable";
import { isNetworkError } from "@/lib/network";
import OfflineState from "@/components/offline-state";

const Admin = async () => {
  let appointments;

  try {
    appointments = await getRecentAppointmentList();
  } catch (error) {
    if (isNetworkError(error)) {
      return (
        <OfflineState
          title="Admin dashboard is offline"
          description="We could not reach Appwrite right now. Reconnect and try again to load the latest appointments."
        />
      );
    }
    throw error;
  }

  return (
    <div className="mx-auto flex flex-col max-w-7xl space-y-12">
      <div className="fixed top-0 left-0 right-0 h-5 z-10 backdrop-blur-sm bg-dark-300/75 pointer-events-none" />
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            loading="eager"
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="pulsecare-logo"
            className="h-10 md:h-12 w-fit"
          />
        </Link>
        <p className="text-sm md:text-lg leading-5 font-semibold">
          Admin Dashboard
        </p>
      </header>
      <main className="admin-main">
        <section className="w-full space-y-2">
          <h1 className="header text-3xl md:text-4xl">Welcome 👋</h1>
          <p className="text-dark-700 text-sm md:text-lg">
            Start day with managing new appointments
          </p>
        </section>
        <section className="admin-stat">
          <StatCard
            type="appointment"
            count={appointments.scheduledCount}
            label="Schedule appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>
        <DataTable data={appointments.rows} />
      </main>
    </div>
  );
};
export default Admin;
