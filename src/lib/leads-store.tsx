import * as React from "react";
import {
  mockLeads,
  newLeadId,
  type Lead,
  type LeadNote,
  type LeadStatus,
} from "@/lib/leads";

/**
 * Client-side demo store. Trial enquiries submitted on the website show up in
 * the demo dashboard for the length of the session.
 * Production: replace with server functions + a real database.
 */

export type NewLeadInput = {
  name: string;
  phone: string;
  email: string;
  goal: string;
  trainingType: string;
  preferredTime: string;
  message?: string;
};

type LeadsContextValue = {
  leads: Lead[];
  addLead: (input: NewLeadInput) => Lead;
  setStatus: (id: string, status: LeadStatus) => void;
  addNote: (id: string, body: string) => void;
  resetDemo: () => void;
};

const LeadsContext = React.createContext<LeadsContextValue | null>(null);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = React.useState<Lead[]>(mockLeads);

  const value = React.useMemo<LeadsContextValue>(
    () => ({
      leads,
      addLead: (input) => {
        const lead: Lead = {
          id: newLeadId(leads),
          ...input,
          status: "NEW",
          source: "Website — Book Free Trial",
          createdAt: new Date().toISOString(),
          followUpOn: new Date().toISOString(),
          notes: [],
        };
        setLeads((prev) => [lead, ...prev]);
        return lead;
      },
      setStatus: (id, status) =>
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status } : l)),
        ),
      addNote: (id, body) =>
        setLeads((prev) =>
          prev.map((l) => {
            if (l.id !== id) return l;
            const note: LeadNote = {
              id: `${id}-${l.notes.length + 1}`,
              author: "Demo staff",
              createdAt: new Date().toISOString(),
              body,
            };
            return { ...l, notes: [...l.notes, note] };
          }),
        ),
      resetDemo: () => setLeads(mockLeads),
    }),
    [leads],
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
