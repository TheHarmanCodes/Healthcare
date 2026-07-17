export function isNetworkError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as {
    code?: string;
    message?: string;
    name?: string;
    cause?: unknown;
  };

  const cause = candidate.cause && typeof candidate.cause === "object"
    ? (candidate.cause as { code?: string; message?: string; name?: string })
    : undefined;

  const code = candidate.code ?? cause?.code;
  const message = `${candidate.name ?? ""} ${candidate.message ?? ""} ${cause?.message ?? ""}`.toLowerCase();

  return [
    "ENOTFOUND",
    "EAI_AGAIN",
    "ECONNRESET",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "EHOSTUNREACH",
    "ENETUNREACH",
    "UND_ERR_CONNECT_TIMEOUT",
  ].includes(code ?? "") ||
    message.includes("fetch failed") ||
    message.includes("networkerror") ||
    message.includes("getaddrinfo enotfound") ||
    message.includes("socket hang up");
}
