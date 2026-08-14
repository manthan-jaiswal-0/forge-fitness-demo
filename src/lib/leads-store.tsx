import * as React from "react";
import type { Lead, LeadStatus } from "@/lib/leads";
import {
  fetchLeads,
  updateLeadStatus,
  type FetchLeadsParams,
  type FetchLeadsResult,
} from "@/lib/leads-admin-api";

/**
 * Leads store backed by the FastAPI backend.
 * Replaces the in-memory demo store. The `useLeads()` hook is the same
 * public interface consumed by the admin dashboard.
 */

type LeadsContextValue = {
  leads: Lead[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  setStatus: (id: string, status: LeadStatus) => Promise<void>;
  refresh: () => Promise<void>;
};

const LeadsContext = React.createContext<LeadsContextValue | null>(null);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const loadLeads = React.useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);
    try {
      const result = await fetchLeads({ pageSize: 200 });
      setLeads(result.leads);
      setTotal(result.total);
    } catch (err) {
      setIsError(true);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load leads",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load leads on mount (will fail with 401 if not logged in — that's expected)
  React.useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const setStatusFn = React.useCallback(
    async (id: string, status: LeadStatus) => {
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l)),
      );
      try {
        const updated = await updateLeadStatus(id, status);
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? updated : l)),
        );
      } catch {
        // Revert on failure — reload from server
        await loadLeads();
      }
    },
    [loadLeads],
  );

  const value = React.useMemo<LeadsContextValue>(
    () => ({
      leads,
      total,
      isLoading,
      isError,
      errorMessage,
      setStatus: setStatusFn,
      refresh: loadLeads,
    }),
    [leads, total, isLoading, isError, errorMessage, setStatusFn, loadLeads],
  );

  return (
    <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = React.useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used inside <LeadsProvider>");
  return ctx;
}
