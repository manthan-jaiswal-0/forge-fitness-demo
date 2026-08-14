/**
 * Lead capture service layer.
 *
 * UI components never talk to a transport directly — they call `submitLead`.
 * This module calls the FastAPI backend at VITE_API_BASE_URL.
 *
 * The payload shape below matches POST /api/leads exactly.
 */

const API_BASE = import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:8000";

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string | undefined;
  goal: string;
  program?: string | undefined;
  preferredTime?: string | undefined;
  message?: string | undefined;
  source: string;
};

export type LeadResponse = {
  id: string;
  createdAt: string;
};

export class LeadSubmissionError extends Error {
  constructor(message = "Lead submission failed") {
    super(message);
    this.name = "LeadSubmissionError";
  }
}

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const res = await fetch(`${API_BASE}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new LeadSubmissionError(
      body?.detail ?? `Submission failed (${res.status})`,
    );
  }

  return (await res.json()) as LeadResponse;
}
