/**
 * Auth API client.
 *
 * Manages session-based authentication with the FastAPI backend.
 * Credentials are stored in an HTTP-only cookie — never in JS.
 */

const API_BASE = import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:8000";

export type AuthUser = {
  id: string;
  email: string;
  gymId: string;
};

export class AuthError extends Error {
  constructor(
    message = "Authentication failed",
    public status: number = 401,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/** Log in with email + password. Sets an HTTP-only session cookie. */
export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new AuthError(body?.detail ?? "Invalid credentials", res.status);
  }

  return (await res.json()) as AuthUser;
}

/** Returns the current authenticated user, or null if not logged in. */
export async function getMe(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    return (await res.json()) as AuthUser;
  } catch {
    return null;
  }
}

/** Clears the session cookie. */
export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
