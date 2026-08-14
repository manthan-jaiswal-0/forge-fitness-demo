/**
 * Leads admin API client — authenticated operations.
 *
 * Used by the admin dashboard to list, read, and update leads.
 * All requests include credentials (session cookie).
 */

import type { Lead, LeadNote, LeadStatus } from "@/lib/leads";

const API_BASE = import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// API response types (camelCase, matching the FastAPI Pydantic schemas)
// ---------------------------------------------------------------------------

type ApiLeadListItem = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  goal: string;
  trainingType: string | null;
  status: string;
  source: string;
  createdAt: string;
  followUpOn: string | null;
};

type ApiLeadRead = ApiLeadListItem & {
  gymId: string;
  preferredTime: string | null;
  message: string | null;
  updatedAt: string;
  lastContactedAt: string | null;
  notes: Array<{
    id: string;
    author: string;
    body: string;
    createdAt: string;
  }>;
};

type ApiLeadListResponse = {
  items: ApiLeadListItem[];
  total: number;
  page: number;
  pageSize: number;
};

// ---------------------------------------------------------------------------
// Convert API shapes to the frontend Lead type
// ---------------------------------------------------------------------------

function apiLeadToLead(item: ApiLeadListItem, notes: LeadNote[] = []): Lead {
  return {
    id: item.id,
    name: item.name,
    phone: item.phone,
    email: item.email ?? undefined,
    goal: item.goal,
    trainingType: item.trainingType ?? "Not specified",
    preferredTime: "",
    status: item.status as LeadStatus,
    source: item.source,
    createdAt: item.createdAt,
    followUpOn: item.followUpOn ?? undefined,
    notes,
  };
}

function apiLeadReadToLead(item: ApiLeadRead): Lead {
  return {
    id: item.id,
    name: item.name,
    phone: item.phone,
    email: item.email ?? undefined,
    goal: item.goal,
    trainingType: item.trainingType ?? "Not specified",
    preferredTime: item.preferredTime ?? "Flexible",
    message: item.message ?? undefined,
    status: item.status as LeadStatus,
    source: item.source,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    followUpOn: item.followUpOn ?? undefined,
    lastContactedAt: item.lastContactedAt ?? undefined,
    notes: item.notes.map((n) => ({
      id: n.id,
      author: n.author,
      body: n.body,
      createdAt: n.createdAt,
    })),
  };
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export type FetchLeadsParams = {
  q?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export type FetchLeadsResult = {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
};

export async function fetchLeads(
  params: FetchLeadsParams = {},
): Promise<FetchLeadsResult> {
  const url = new URL(`${API_BASE}/api/leads`);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.status && params.status !== "ALL")
    url.searchParams.set("status", params.status);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.pageSize) url.searchParams.set("pageSize", String(params.pageSize));

  const res = await fetch(url.toString(), { credentials: "include" });
  if (res.status === 401) throw new Error("Not authenticated");
  if (!res.ok) throw new Error(`Failed to fetch leads (${res.status})`);

  const data = (await res.json()) as ApiLeadListResponse;
  return {
    leads: data.items.map((item) => apiLeadToLead(item)),
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
  };
}

export async function fetchLead(id: string): Promise<Lead> {
  const res = await fetch(`${API_BASE}/api/leads/${id}`, {
    credentials: "include",
  });
  if (res.status === 401) throw new Error("Not authenticated");
  if (res.status === 404) throw new Error("Lead not found");
  if (!res.ok) throw new Error(`Failed to fetch lead (${res.status})`);

  return apiLeadReadToLead((await res.json()) as ApiLeadRead);
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<Lead> {
  const res = await fetch(`${API_BASE}/api/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Failed to update lead (${res.status})`);
  return apiLeadReadToLead((await res.json()) as ApiLeadRead);
}
