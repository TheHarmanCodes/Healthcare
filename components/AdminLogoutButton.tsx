"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth.action";
import { isNetworkError } from "@/lib/network";

/**
 * Logs out the current dashboard user by clearing the server-side Appwrite session cookie,
 * then returns the browser to the admin login entry point.
 */
const AdminLogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onLogout() {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      toast.error("You are offline. Reconnect to sign out.");
      return;
    }

    setIsLoading(true);

    try {
      await logout();
      router.replace("/?admin=true");
      router.refresh();
    } catch (err) {
      console.error(err);
      const message = isNetworkError(err)
        ? "Connection lost while signing out. Please reconnect and try again."
        : "Unable to sign out. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onLogout}
      disabled={isLoading}
      className="shad-gray-btn gap-2"
    >
      <LogOut className="size-4" />
      {isLoading ? "Signing Out..." : "Logout"}
    </Button>
  );
};

export default AdminLogoutButton;
