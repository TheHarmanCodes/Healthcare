import Image from "next/image";
import { notFound } from "next/navigation";
import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.action";

const Register = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params;

  let user;
  try {
    user = await getUser(userId);
  } catch (error: unknown) {
    const appwriteError = error as { code?: number };
    if (appwriteError.code === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-[#131619]">
      {/* Left scrollable form panel */}
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-215 flex-1 flex-col py-10">
          {/* PulseCare Logo */}
          <Image
            loading="eager"
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="PulseCare"
            className="mb-10 h-15 w-fit"
          />

          <RegisterForm user={user} />
          <p className="mt-12 copyright text-sm text-gray-600">
            © 2026 PulseCare
          </p>
        </div>
      </section>

      {/* Right decorative image — hidden on small screens */}
      <div className="relative hidden w-[42%] max-w-lg shrink-0 lg:block">
        <Image
          src="/assets/images/register-img.png"
          fill
          alt=""
          className="object-cover object-left"
          priority
        />
      </div>
    </div>
  );
};

export default Register;
