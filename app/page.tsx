import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP verification | Pass Key Model */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container">
          <Image
            loading="eager"
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="pulsecare-logo"
            className="mb-12 h-15 w-fit"
          />
          <PatientForm />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2026 PulseCare
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/reception.png"
        loading="eager"
        alt="onboarding"
        height={1000}
        width={1000}
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
