import * as React from "react";
import { BookTrialDialog } from "@/components/site/book-trial-dialog";

const TrialDialogContext = React.createContext<{ openTrial: () => void } | null>(null);

export function TrialDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(() => ({ openTrial: () => setOpen(true) }), []);

  return (
    <TrialDialogContext.Provider value={value}>
      {children}
      <BookTrialDialog open={open} onOpenChange={setOpen} />
    </TrialDialogContext.Provider>
  );
}

export function useTrialDialog() {
  const ctx = React.useContext(TrialDialogContext);
  if (!ctx) throw new Error("useTrialDialog must be used inside <TrialDialogProvider>");
  return ctx;
}
