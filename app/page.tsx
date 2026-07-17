import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";
import Link from "next/link";
import { SearchParamProps } from "@/types";
import PasskeyModal from "@/components/PasskeyModal";

export default async function Home({ searchParams }: SearchParamProps) {
  const { admin } = await searchParams;
  const isAdmin = admin === "true";

  return (
    <div className="flex min-h-dvh md:h-screen md:max-h-screen">
      {isAdmin && <PasskeyModal />}
      <section className="remove-scrollbar container sm:mt-2 md:my-auto pb-6 md:pb-0">
        <div className="sub-container">
          <Image
            loading="eager"
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="pulsecare-logo"
            className="mb-6 md:mb-12 h-15 w-fit"
          />
          <PatientForm />
          <div className="mt-6 flex justify-between text-14-regular  md:mb-2 ">
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
