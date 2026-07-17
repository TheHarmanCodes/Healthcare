"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { WifiOff } from "lucide-react";

const BANNER_VISIBLE_MS = 3500;

/**
 * Global connectivity banner.
 * Tracks browser online/offline transitions, shows a short-lived banner when
 * the app drops offline, and fires a toast for both offline and recovery states.
 */
export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const hideTimerRef = useRef<number | null>(null);
  const lastStatusRef = useRef<"online" | "offline" | null>(null);

  useEffect(() => {
    // Clears the pending auto-hide timer so a stale banner cannot resurface.
    const clearHideTimer = () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    // Shows the banner briefly, then hides it automatically.
    const showOfflineBanner = () => {
      clearHideTimer();
      setIsOnline(false);
      hideTimerRef.current = window.setTimeout(() => {
        setIsOnline(true);
        hideTimerRef.current = null;
      }, BANNER_VISIBLE_MS);
    };

    const syncStatus = () => {
      const nextStatus: "online" | "offline" = navigator.onLine
        ? "online"
        : "offline";
      if (nextStatus === lastStatusRef.current) {
        return;
      }

      lastStatusRef.current = nextStatus;

      if (nextStatus === "offline") {
        toast.error("You are offline", {
          description:
            "We will keep the app open and retry once the connection returns.",
        });
        showOfflineBanner();
      } else {
        clearHideTimer();
        setIsOnline(true);
        toast.success("Back online", {
          description: "Your connection is restored.",
        });
      }
    };

    syncStatus();

    window.addEventListener("offline", syncStatus);
    window.addEventListener("online", syncStatus);

    return () => {
      clearHideTimer();
      window.removeEventListener("offline", syncStatus);
      window.removeEventListener("online", syncStatus);
    };
  }, []);

  return (
    <AnimatePresence initial={false}>
      {!isOnline && (
        <motion.div
          key="offline-banner"
          initial={{ opacity: 0, y: -18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed top-3 left-1/2 z-50 w-[calc(100%-2rem)] max-w-112.5 -translate-x-1/2 rounded-xl border border-amber-500/30 bg-dark-200/95 px-4 py-3 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-amber-500/15 p-2 text-[#FF3B30]">
              <WifiOff className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-light-200">
                You are offline
              </p>
              <p className="mt-1 text-xs text-dark-700 md:text-sm">
                Requests will pause until your connection comes back.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
