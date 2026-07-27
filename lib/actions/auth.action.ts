"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/rbac";

/**
 * Authenticates any valid Appwrite account, sets the HttpOnly session cookie, then redirects to /admin.
 * Authorization is intentionally deferred to page/action guards that read Appwrite labels per request.
 */
export async function login(email: string, password: string) {
  try {
    const user = await createSession(email, password);
    console.info("[auth] login success", user);
  } catch {
    return {
      success: false,
      error: "Unable to sign in with those credentials.",
    };
  }

  redirect("/admin");
}

/** Clears the Appwrite-backed PulseCare session cookie for the current browser. */
export async function logout() {
  await destroySession();
  return { success: true };
}
