import { ColumnDef } from "@tanstack/react-table";

import { Appointment } from "@/types/appwrite.types";
import StatusBadge from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import Image from "next/image";
import AppointmentModel from "@/components/AppointmentModel";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => (
      <p className="text-14-medium">{row.original.patient.name}</p>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-25">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-28.75">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },

  {
    accessorKey: "primaryPhysician",
    header: () => "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doc) => doc.name === row.original.primaryPhysician,
      );

      return (
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={doctor?.image ?? "/assets/icons/default-doctor.svg"}
            alt={doctor ? `Dr. ${doctor.name}` : "Doctor"}
            width={100}
            height={100}
            className="size-8 shrink-0"
          />
          <p className="min-w-0 whitespace-normal break-words leading-5 md:whitespace-nowrap">
            Dr. {doctor?.name}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
          <AppointmentModel
            type="schedule"
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
            description={"Please confirm the following details to scheduled"}
          />
          <AppointmentModel
            type="cancel"
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
            description={"Are you sure you want to cancel this appointment?"}
          />
        </div>
      );
    },
  },
];
