"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, WifiOff } from "lucide-react";
import { isNetworkError } from "@/lib/network";

/**
 * Global app error boundary fallback.
 * Detects when the failure looks network-related so the user sees a clearer
 * reconnect message instead of a generic crash screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const offline = typeof navigator !== "undefined" && !navigator.onLine;
  const networkFailure = offline || isNetworkError(error);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-dark-200/90 p-8 shadow-2xl backdrop-blur-sm">
        {/* Picks an icon and message based on whether the failure is connectivity-related. */}
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-amber-500/15 p-3 text-[#FF3B30]">
            {networkFailure ? (
              <WifiOff className="size-6" />
            ) : (
              <RefreshCcw className="size-6" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-light-200">
              {networkFailure ? "Connection lost" : "Something went wrong"}
            </h1>
            <p className="text-dark-700">
              {networkFailure
                ? "We could not reach the server. Reconnect to continue, then try again."
                : "An unexpected error stopped this page from loading."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="shad-primary-btn" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
