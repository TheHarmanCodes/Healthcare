"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";

interface OfflineStateProps {
  title: string;
  description: string;
}

/**
 * Generic offline fallback UI for route-level data fetches.
 * Use this when a page cannot render its server data because the API is
 * temporarily unreachable.
 */
export default function OfflineState({
  title,
  description,
}: OfflineStateProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-dark-200/90 p-8 shadow-2xl backdrop-blur-sm">
        {/* Keeps the failure state readable and recoverable without a full crash. */}
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-amber-500/15 p-3 text-[#FF3B30]">
            <WifiOff className="size-6" />
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-light-200">{title}</h1>
            <p className="text-dark-700">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            className="shad-primary-btn"
            onClick={() => router.refresh()}
          >
            Try again
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
