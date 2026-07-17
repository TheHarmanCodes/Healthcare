"use client";
import React, {useState} from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {AppointmentModelProps} from "@/types";
import AppointmentForm from "@/components/forms/AppointmentForm";
import {XIcon} from "lucide-react";

const AppointmentModel = ({
                              type,
                              patientId,
                              userId,
                              appointment,
                              description,
                          }: AppointmentModelProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    disabled={appointment.status === "cancelled" && type !== "schedule"}
                    variant="ghost"
                    className={`capitalize hover:opacity-80 cursor-pointer ${type === "schedule" && "text-green-500"} ${type === "cancel" && "text-red-600"}`}
                >
                    {type}
                </Button>
            </DialogTrigger>
            <DialogContent
                className="shad-dialog p-8 max-w-md sm:min-w-87.5 md:max-w-lg ring-0 "
                showCloseButton={false}
            >
                <DialogHeader className="mb-4 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                        <DialogTitle className="flex-1 capitalize text-xl font-bold">
                            {type} Appointment
                        </DialogTitle>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon-sm" className="shrink-0">
                                <XIcon/>
                                <span className="sr-only">Close</span>
                            </Button>
                        </DialogClose>
                    </div>
                    <DialogDescription className="mt-1 text-dark-700">
                        {description}
                    </DialogDescription>

                    <AppointmentForm
                        userId={userId}
                        patientId={patientId}
                        type={type}
                        appointment={appointment}
                        setOpen={setOpen}
                    />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
export default AppointmentModel;
