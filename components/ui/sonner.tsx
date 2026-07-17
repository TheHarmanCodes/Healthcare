"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";
import type { CSSProperties } from "react";

const TOAST_STYLE: CSSProperties = {
  backgroundColor: "#1a1d21",
  color: "#e8e9e9",
  border: "1px solid #363a3d",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.45)",
};

/**
 * Shared Sonner wrapper.
 * Applies a consistent dark surface so notification toasts remain readable
 * across all app states, including offline and reconnect messages.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        style: TOAST_STYLE,
        classNames: {
          toast: "rounded-xl",
          description: "text-dark-700",
          title: "text-light-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
