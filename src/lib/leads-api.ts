/**
 * Lead capture service layer.
 *
 * UI components never talk to a transport directly — they call `submitLead`.
 * Today this resolves locally (demo build, no backend). When the FastAPI
 * service exists, replace the body of `submitLead` with a real request:
 *
 *   const res = await fetch(`${API_BASE_URL}/api/leads`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(payload),
 *   });
 *   if (!res.ok) throw new LeadSubmissionError();
 *   return (await res.json()) as LeadResponse;
 *
 * The payload shape below is the intended request body for POST /api/leads.
 */

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

type SubmitOptions = {
  /** Demo hook: persists the lead into the in-session dashboard store. */
  persist: (payload: LeadPayload) => LeadResponse;
};

export async function submitLead(
  payload: LeadPayload,
  { persist }: SubmitOptions,
): Promise<LeadResponse> {
  // Simulated network latency so the loading state is demonstrable.
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!payload.name || !payload.phone || !payload.goal) {
    throw new LeadSubmissionError("Missing required fields");
  }

  return persist(payload);
}
