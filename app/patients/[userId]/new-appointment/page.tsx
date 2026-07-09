import Image from "next/image";
import AppointmentForm from "@/components/forms/AppointmentForm";
import {getPatient} from "@/lib/actions/patient.action";
import {SearchParamProps} from "@/types";
import Link from "next/link";

export default async function NewAppointment({params}: SearchParamProps) {
    const {userId} = await params;
    const patient = await getPatient(userId);
    // console.log(patient);
    if (!patient) {
        // handle it later on
        return <div>Patient not found.</div>;
    }
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-225 flex-1 flex-col py-10">
                    <Link href="/">
                        <Image
                            src="/assets/icons/logo-full.svg"
                            height={1000}
                            width={1000}
                            alt="pulsecare-logo"
                            loading="eager"
                            className="mb-10 h-15 w-fit"
                        />
                    </Link>
                    <AppointmentForm
                        type="create"
                        userId={userId}
                        patientId={patient.$id}
                    />
                    <p className="mt-5 copyright text-sm text-dark-600">
                        © 2026 PulseCare
                    </p>
                </div>
            </section>
            <Image
                src="/assets/images/appointment-image.png"
                loading="eager"
                alt="appointment"
                height={1000}
                width={1000}
                className="side-img w-[30%] max-w-lg bg-bottom"
            />
        </div>
    );
}
