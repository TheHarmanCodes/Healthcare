"use server";

import { createSession, destroySession } from "@/lib/auth/rbac";

/**
 * Authenticates any valid Appwrite account and sets the HttpOnly session cookie.
 * Authorization is intentionally deferred to page/action guards that read Appwrite labels per request.
 */
export async function login(email: string, password: string) {
  try {
    await createSession(email, password);
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Unable to sign in with those credentials.",
    };
  }
}

/** Clears the Appwrite-backed PulseCare session cookie for the current browser. */
export async function logout() {
  await destroySession();
  return { success: true };
}

