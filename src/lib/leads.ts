/**
 * Lead model + mock lead store for the demo admin dashboard.
 * Production will replace `mockLeads` with real persisted data.
 */

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "TRIAL_BOOKED",
  "JOINED",
  "LOST",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type LeadNote = {
  id: string;
  author: string;
  createdAt: string;
  body: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string | undefined;
  goal: string;
  trainingType: string;
  preferredTime: string;
  message?: string | undefined;
  status: LeadStatus;
  source: string;
  createdAt: string;
  updatedAt?: string | undefined;
  followUpOn?: string | undefined;
  lastContactedAt?: string | undefined;
  notes: LeadNote[];
};

export const statusMeta: Record<
  LeadStatus,
  { label: string; className: string }
> = {
  NEW: {
    label: "New",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  CONTACTED: {
    label: "Contacted",
    className: "bg-info/15 text-info border-info/30",
  },
  TRIAL_BOOKED: {
    label: "Trial booked",
    className: "bg-warning/15 text-warning border-warning/30",
  },
  JOINED: {
    label: "Joined",
    className: "bg-success/15 text-success border-success/30",
  },
  LOST: {
    label: "Lost",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(9, 30, 0, 0);
  return d.toISOString();
};

export const mockLeads: Lead[] = [
  {
    id: "LD-1041",
    name: "Aarav Demo",
    phone: "+91 90000 00011",
    email: "aarav.demo@example.com",
    goal: "Build muscle",
    trainingType: "Personal training",
    preferredTime: "Early morning (5:30 – 8:00)",
    message: "Looking to start next week if a coach is free.",
    status: "NEW",
    source: "Website — Book Free Trial",
    createdAt: day(0),
    followUpOn: day(1),
    notes: [],
  },
  {
    id: "LD-1040",
    name: "Neha Demo",
    phone: "+91 90000 00012",
    email: "neha.demo@example.com",
    goal: "Fat loss",
    trainingType: "Group classes",
    preferredTime: "Evening (16:00 – 20:00)",
    status: "CONTACTED",
    source: "Website — Book Free Trial",
    createdAt: day(-1),
    followUpOn: day(1),
    notes: [
      {
        id: "n1",
        author: "Front desk",
        createdAt: day(-1),
        body: "Called, asked to be contacted again after 6pm.",
      },
    ],
  },
  {
    id: "LD-1039",
    name: "Rohit Demo",
    phone: "+91 90000 00013",
    email: "rohit.demo@example.com",
    goal: "Get stronger",
    trainingType: "Small group strength",
    preferredTime: "Morning (8:00 – 12:00)",
    status: "TRIAL_BOOKED",
    source: "Instagram bio link",
    createdAt: day(-2),
    followUpOn: day(2),
    notes: [
      {
        id: "n2",
        author: "Coach A. Rane",
        createdAt: day(-2),
        body: "Trial booked for Saturday 09:00 small group session.",
      },
    ],
  },
  {
    id: "LD-1038",
    name: "Priya Demo",
    phone: "+91 90000 00014",
    email: "priya.demo@example.com",
    goal: "General fitness",
    trainingType: "Group classes",
    preferredTime: "Late evening (20:00 – 22:30)",
    status: "JOINED",
    source: "Website — Book Free Trial",
    createdAt: day(-5),
    notes: [
      {
        id: "n3",
        author: "Front desk",
        createdAt: day(-4),
        body: "Joined on the quarterly plan after the trial class.",
      },
    ],
  },
  {
    id: "LD-1037",
    name: "Imran Demo",
    phone: "+91 90000 00015",
    email: "imran.demo@example.com",
    goal: "Sport performance",
    trainingType: "Personal training",
    preferredTime: "Afternoon (12:00 – 16:00)",
    status: "LOST",
    source: "Walk-in",
    createdAt: day(-9),
    notes: [
      {
        id: "n4",
        author: "Front desk",
        createdAt: day(-7),
        body: "Chose a gym closer to home. Keep on the newsletter list.",
      },
    ],
  },
  {
    id: "LD-1036",
    name: "Sana Demo",
    phone: "+91 90000 00016",
    email: "sana.demo@example.com",
    goal: "Rehab / mobility",
    trainingType: "Not sure yet",
    preferredTime: "Morning (8:00 – 12:00)",
    message: "Recovering from a knee niggle, need a careful start.",
    status: "NEW",
    source: "Google search",
    createdAt: day(0),
    followUpOn: day(0),
    notes: [],
  },
  {
    id: "LD-1035",
    name: "Kabir Demo",
    phone: "+91 90000 00017",
    email: "kabir.demo@example.com",
    goal: "Fat loss",
    trainingType: "Gym floor only",
    preferredTime: "Evening (16:00 – 20:00)",
    status: "CONTACTED",
    source: "Referral",
    createdAt: day(-3),
    followUpOn: day(3),
    notes: [],
  },
  {
    id: "LD-1034",
    name: "Tanvi Demo",
    phone: "+91 90000 00018",
    email: "tanvi.demo@example.com",
    goal: "Build muscle",
    trainingType: "Small group strength",
    preferredTime: "Early morning (5:30 – 8:00)",
    status: "TRIAL_BOOKED",
    source: "Website — Book Free Trial",
    createdAt: day(-4),
    followUpOn: day(-1),
    notes: [],
  },
];

export function newLeadId(existing: Lead[]) {
  const max = existing.reduce((acc, l) => {
    const n = Number(l.id.replace(/\D/g, ""));
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 1000);
  return `LD-${max + 1}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function isSameOrBeforeToday(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return d.getTime() <= today.getTime();
}
