import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import * as sdk from "node-appwrite";
import { API_KEY, NEXT_PUBLIC_ENDPOINT, PROJECT_ID } from "@/lib/appwrite.config";

export type Role = "super-admin" | "doctor" | "staff" | "patient";

const SESSION_COOKIE = "pulsecare_session";
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

/** Error type used by server actions to distinguish unauthenticated (401) from unauthorized (403) RBAC failures. */
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status: 401 | 403,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Converts Appwrite user labels into the PulseCare role model.
 * Unlabeled users are treated as patients; privileged labels are assigned only in Appwrite Console.
 */
export function getRole(labels: string[] = []): Role {
  if (labels.includes("super-admin") || labels.includes("superAdmin")) return "super-admin";
  if (labels.includes("doctor")) return "doctor";
  if (labels.includes("staff")) return "staff";
  return "patient";
}

/** Builds a request-scoped Account client from the HttpOnly session cookie secret. */
function createAccountClient(sessionSecret?: string) {
  const client = new sdk.Client()
    .setEndpoint(NEXT_PUBLIC_ENDPOINT!)
    .setProject(PROJECT_ID!);

  if (sessionSecret) {
    client.setSession(sessionSecret);
  }

  return new sdk.Account(client);
}

/**
 * Builds the server-only Account client used for login.
 * Appwrite only returns Session.secret to API-key-authenticated server requests.
 */
function createSessionClient() {
  const client = new sdk.Client()
    .setEndpoint(NEXT_PUBLIC_ENDPOINT!)
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!);

  return new sdk.Account(client);
}

function getRequestIp(requestHeaders: Headers) {
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}

function getLoginKey(email: string, requestHeaders: Headers) {
  return `${getRequestIp(requestHeaders)}:${email.toLowerCase()}`;
}

/** Enforces a small in-memory login rate limit per IP/email pair. */
function assertLoginAllowed(key: string) {
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt || attempt.resetAt <= now) {
    loginAttempts.set(key, { count: 0, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }

  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    throw new AuthError(
      "Too many login attempts. Please try again later.",
      401,
    );
  }
}

/** Records a failed login and adds progressive delay to slow repeated attempts. */
async function recordFailedLogin(key: string) {
  const attempt = loginAttempts.get(key);
  const count = (attempt?.count ?? 0) + 1;

  loginAttempts.set(key, {
    count,
    resetAt: attempt?.resetAt ?? Date.now() + LOGIN_WINDOW_MS,
  });

  if (count > 1) {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.min((count - 1) * 500, 3000)),
    );
  }
}

function clearFailedLogins(key: string) {
  loginAttempts.delete(key);
}

/**
 * Reads the incoming session cookie and resolves the live Appwrite account.
 * Role is re-derived from Appwrite labels on every request, so Console label changes apply immediately.
 */
export async function getCurrentUser(): Promise<{
  id: string;
  role: Role;
} | null> {
  const cookieStore = await cookies();
  const sessionSecret = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionSecret) return null;

  try {
    const account = createAccountClient(sessionSecret);
    const user = await account.get();

    return {
      id: user.$id,
      role: getRole(user.labels),
    };
  } catch {
    return null;
  }
}

/**
 * Server-action guard for the RBAC matrix.
 * Throws AuthError(401) when logged out and AuthError(403) when the role is not allowed.
 */
export async function requireRole(
  allowed: Role[],
): Promise<{ id: string; role: Role }> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthError("Authentication required.", 401);
  }

  if (!allowed.includes(user.role)) {
    throw new AuthError("You do not have permission for this action.", 403);
  }

  return user;
}

/** Page-level guard that redirects unauthorized dashboard access back to the admin login modal. */
export async function requirePageRole(allowed: Role[]) {
  try {
    return await requireRole(allowed);
  } catch {
    redirect("/?admin=true");
  }
}

/**
 * Creates an Appwrite email/password session and stores its secret in an HttpOnly cookie.
 * The API key is used only on the server to obtain Session.secret; identity checks still use the cookie-scoped Account client.
 */
export async function createSession(email: string, password: string) {
  const requestHeaders = await headers();
  const key = getLoginKey(email, requestHeaders);

  assertLoginAllowed(key);

  try {
    const account = createSessionClient();
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });

    if (!session.secret) {
      throw new AuthError("Appwrite did not return a session secret.", 401);
    }

    const sessionAccount = createAccountClient(session.secret);
    const user = await sessionAccount.get();
    const role = getRole(user.labels);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(session.expire),
    });

    console.info("[auth] login session verified", {
      userId: user.$id,
      labels: user.labels,
      role,
      cookie: SESSION_COOKIE,
    });

    clearFailedLogins(key);
    return { id: user.$id, role };
  } catch (error) {
    await recordFailedLogin(key);
    console.error("[auth] login failed", error);
    throw error;
  }
}

/** Deletes the current Appwrite session when possible and always clears the local HttpOnly cookie. */
export async function destroySession() {
  const cookieStore = await cookies();
  const sessionSecret = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionSecret) {
    try {
      const account = createAccountClient(sessionSecret);
      await account.deleteSession("current");
    } catch {
      // The local cookie is still cleared when Appwrite has already expired it.
    }
  }

  cookieStore.delete(SESSION_COOKIE);
}

/** Rejects cross-origin sensitive mutations when Origin and Host are both present. */
export async function assertTrustedOrigin() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const host = requestHeaders.get("host");

  if (!origin || !host) return;

  if (new URL(origin).host !== host) {
    throw new AuthError("Invalid request origin.", 403);
  }
}

/** Emits a structured audit event without patient details or raw session secrets. */
export function auditLog(event: {
  actorId: string;
  role: Role;
  action: string;
  appointmentId?: string;
  previousStatus?: string;
  newStatus?: string;
}) {
  console.info("[audit]", {
    ...event,
    timestamp: new Date().toISOString(),
  });
}





