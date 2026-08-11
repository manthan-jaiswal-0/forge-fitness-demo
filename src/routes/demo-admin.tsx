import * as React from "react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarClock,
  Flame,
  Search,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DemoBadge, DemoNotice } from "@/components/demo-badge";
import {
  LEAD_STATUSES,
  formatDate,
  isSameOrBeforeToday,
  statusMeta,
  type Lead,
  type LeadStatus,
} from "@/lib/leads";
import { useLeads } from "@/lib/leads-store";
import { cn } from "@/lib/utils";

const title = "Demo dashboard — Gym Growth Platform";
const description =
  "Mock lead management dashboard: KPI cards, lead pipeline statuses, notes and follow-ups for a fictional Mumbai gym.";

export const Route = createFileRoute("/demo-admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DemoAdmin,
});

function DemoAdmin() {
  const { leads, setStatus, addNote, resetDemo } = useLeads();
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | LeadStatus>("ALL");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selected = leads.find((l) => l.id === selectedId) ?? null;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesQuery =
        !q ||
        [lead.name, lead.email, lead.phone, lead.goal, lead.id]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [leads, query, statusFilter]);

  const followUps = leads.filter(
    (l) => l.followUpOn && !["JOINED", "LOST"].includes(l.status),
  );

  const kpis = [
    { label: "Total leads", value: leads.length, icon: Users, hint: "All time (demo)" },
    {
      label: "New leads",
      value: leads.filter((l) => l.status === "NEW").length,
      icon: UserPlus,
      hint: "Awaiting first contact",
    },
    {
      label: "Trials booked",
      value: leads.filter((l) => l.status === "TRIAL_BOOKED").length,
      icon: CalendarClock,
      hint: "Scheduled sessions",
    },
    {
      label: "Joined",
      value: leads.filter((l) => l.status === "JOINED").length,
      icon: TrendingUp,
      hint: "Converted to members",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-ember">
              <Flame className="size-5 text-primary-foreground" aria-hidden="true" />
            </span>
            <div>
              <p className="flex items-center gap-2 text-display text-base leading-none">
                Gym Growth Platform <DemoBadge />
              </p>
              <p className="text-xs text-muted-foreground">Forge Fitness Mumbai · Lead desk</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetDemo}>
              Reset demo data
            </Button>
            <Button variant="outlineLight" size="sm" asChild>
              <Link to="/">
                <ArrowLeft aria-hidden="true" /> Website
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-6 px-5 py-8 md:px-8">
        <div>
          <h1 className="text-3xl text-display md:text-4xl">Lead dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every enquiry from the website lands here so the gym can work it to a decision.
          </p>
          <DemoNotice className="mt-4">
            All names, numbers and emails below are fictional demo records. Changes live in your
            browser only and reset on reload.
          </DemoNotice>
        </div>

        <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="border-border bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.label}
                </CardTitle>
                <kpi.icon className="size-4 text-primary" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl text-display">{kpi.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Tabs defaultValue="leads">
          <TabsList>
            <TabsTrigger value="leads">All leads</TabsTrigger>
            <TabsTrigger value="followups">Follow-ups ({followUps.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Label htmlFor="lead-search" className="sr-only">
                  Search leads
                </Label>
                <Input
                  id="lead-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, phone, email or goal"
                  className="pl-9"
                />
              </div>
              <div className="sm:w-56">
                <Label htmlFor="status-filter" className="sr-only">
                  Filter by status
                </Label>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v as "ALL" | LeadStatus)}
                >
                  <SelectTrigger id="status-filter" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All statuses</SelectItem>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusMeta[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <LeadTable leads={filtered} onSelect={setSelectedId} />
          </TabsContent>

          <TabsContent value="followups" className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Open leads with a scheduled follow-up. Overdue items are flagged.
            </p>
            {followUps.length === 0 ? (
              <EmptyState message="No follow-ups scheduled." />
            ) : (
              <ul className="space-y-3">
                {followUps.map((lead) => (
                  <li key={lead.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(lead.id)}
                      className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card/80 p-4 text-left transition-colors hover:border-primary/50"
                    >
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {lead.goal} · {lead.preferredTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={lead.status} />
                        <span
                          className={cn(
                            "text-xs",
                            isSameOrBeforeToday(lead.followUpOn)
                              ? "font-medium text-destructive"
                              : "text-muted-foreground",
                          )}
                        >
                          {isSameOrBeforeToday(lead.followUpOn) ? "Due " : "Follow up "}
                          {formatDate(lead.followUpOn!)}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <LeadDetailSheet
        lead={selected}
        onClose={() => setSelectedId(null)}
        onStatusChange={setStatus}
        onAddNote={addNote}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = statusMeta[status];
  return (
    <Badge variant="outline" className={cn("border", meta.className)}>
      {meta.label}
    </Badge>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function LeadTable({
  leads,
  onSelect,
}: {
  leads: Lead[];
  onSelect: (id: string) => void;
}) {
  if (leads.length === 0) return <EmptyState message="No leads match your filters." />;

  return (
    <>
      {/* Mobile list */}
      <ul className="space-y-3 md:hidden">
        {leads.map((lead) => (
          <li key={lead.id}>
            <button
              type="button"
              onClick={() => onSelect(lead.id)}
              className="w-full rounded-lg border border-border bg-card/80 p-4 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.phone}</p>
                </div>
                <StatusBadge status={lead.status} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {lead.goal} · {lead.trainingType}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {lead.id} · {formatDate(lead.createdAt)}
              </p>
            </button>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Demo leads</caption>
          <thead className="bg-surface/70 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Lead</th>
              <th scope="col" className="px-4 py-3 font-medium">Goal</th>
              <th scope="col" className="px-4 py-3 font-medium">Training</th>
              <th scope="col" className="px-4 py-3 font-medium">Received</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead.id} className="bg-card/50 hover:bg-accent/40">
                <td className="px-4 py-3">
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.phone} · {lead.email}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{lead.goal}</td>
                <td className="px-4 py-3 text-muted-foreground">{lead.trainingType}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.createdAt)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => onSelect(lead.id)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function LeadDetailSheet({
  lead,
  onClose,
  onStatusChange,
  onAddNote,
}: {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onAddNote: (id: string, body: string) => void;
}) {
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    setNote("");
  }, [lead?.id]);

  return (
    <Sheet open={!!lead} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {lead ? (
          <>
            <SheetHeader>
              <SheetTitle className="text-2xl text-display">{lead.name}</SheetTitle>
              <SheetDescription>
                {lead.id} · received {formatDate(lead.createdAt)} · {lead.source}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <Detail label="Phone" value={lead.phone} />
                <Detail label="Email" value={lead.email} />
                <Detail label="Goal" value={lead.goal} />
                <Detail label="Training" value={lead.trainingType} />
                <Detail label="Preferred time" value={lead.preferredTime} />
                <Detail
                  label="Follow-up"
                  value={lead.followUpOn ? formatDate(lead.followUpOn) : "Not set"}
                />
              </dl>

              {lead.message ? (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Message
                  </p>
                  <p className="mt-1 rounded-md border border-border bg-surface/60 p-3 text-sm">
                    {lead.message}
                  </p>
                </div>
              ) : null}

              <div>
                <Label htmlFor="lead-status">Status</Label>
                <Select
                  value={lead.status}
                  onValueChange={(v) => onStatusChange(lead.id, v as LeadStatus)}
                >
                  <SelectTrigger id="lead-status" className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusMeta[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-semibold">Notes</h3>
                <ul className="mt-3 space-y-2">
                  {lead.notes.length === 0 ? (
                    <li className="text-sm text-muted-foreground">No notes yet.</li>
                  ) : (
                    lead.notes.map((n) => (
                      <li
                        key={n.id}
                        className="rounded-md border border-border bg-surface/60 p-3 text-sm"
                      >
                        <p>{n.body}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {n.author} · {formatDate(n.createdAt)}
                        </p>
                      </li>
                    ))
                  )}
                </ul>

                <form
                  className="mt-3 space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!note.trim()) return;
                    onAddNote(lead.id, note.trim());
                    setNote("");
                  }}
                >
                  <Label htmlFor="new-note" className="sr-only">
                    Add a note
                  </Label>
                  <Textarea
                    id="new-note"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Log a call, a message or an outcome…"
                  />
                  <Button type="submit" variant="hero" size="sm" disabled={!note.trim()}>
                    Add note
                  </Button>
                </form>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words">{value}</dd>
    </div>
  );
}
