import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      className={
        className ?? "shad-primary-btn w-full cursor-pointer py-4 mt-2"
      }
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/gear-loader.svg"
            alt="loading"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
