import React from "react";
import { ShinyButton, EnhancedButton } from "@/components/ui/shinyButton"; // Adjust import path as needed
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
  shiny?: boolean;
  variant?:
    | "default"
    | "shiny"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  loadingText?: string;
  loadingIcon?: string;
  iconSize?: number;
}

const SubmitButton = ({
  isLoading,
  className,
  children,
  shiny = false,
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
  type = "submit",
  loadingText = "Loading...",
  loadingIcon = "/assets/icons/gear-loader.svg",
  iconSize = 24,
}: SubmitButtonProps) => {
  const isDisabled = isLoading || disabled;

  const loadingContent = (
    <div className="flex items-center justify-center gap-3">
      <Image
        src={loadingIcon}
        alt="Loading"
        width={iconSize}
        height={iconSize}
        className="animate-spin"
      />
      <span>{loadingText}</span>
    </div>
  );

  const buttonProps = {
    type,
    disabled: isDisabled,
    onClick,
    className: cn(
      className,
      "w-full cursor-pointer",
      isLoading && "opacity-80 pointer-events-none",
    ),
  };

  if (shiny) {
    return (
      <ShinyButton {...buttonProps} variant="shiny" size={size}>
        {isLoading ? loadingContent : children}
      </ShinyButton>
    );
  }

  return (
    <EnhancedButton {...buttonProps} variant={variant} size={size}>
      {isLoading ? loadingContent : children}
    </EnhancedButton>
  );
};

export default SubmitButton;
