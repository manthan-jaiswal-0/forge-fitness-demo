import * as React from "react";
import { AlertTriangle, CheckCircle2, Loader2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DemoBadge } from "@/components/demo-badge";
import { fitnessGoals, preferredTimes, programOptions, gym } from "@/lib/demo-data";
import { whatsappLink } from "@/lib/site-config";
import { useLeads } from "@/lib/leads-store";
import { submitLead, type LeadPayload } from "@/lib/leads-api";

type FieldKey = "name" | "phone" | "email" | "goal" | "program" | "preferredTime" | "message";
type Errors = Partial<Record<FieldKey, string>>;

const emptyForm: Record<FieldKey, string> = {
  name: "",
  phone: "",
  email: "",
  goal: "",
  program: "",
  preferredTime: "",
  message: "",
};

export function BookTrialDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addLead } = useLeads();
  const [form, setForm] = React.useState(emptyForm);
  const [errors, setErrors] = React.useState<Errors>({});
  const [state, setState] = React.useState<"form" | "sending" | "done" | "error">("form");
  const [reference, setReference] = React.useState("");
  const [submittedName, setSubmittedName] = React.useState("");

  const set = (key: FieldKey, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function validate(): boolean {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";

    const phone = form.phone.trim();
    const digits = phone.replace(/\D/g, "");
    if (!phone) next.phone = "Please enter a phone number.";
    else if (!/^[+0-9 ()-]+$/.test(phone) || digits.length < 8 || digits.length > 15)
      next.phone = "Enter a valid phone number (8–15 digits).";

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = "Enter a valid email address, or leave it blank.";

    if (!form.goal) next.goal = "Choose the goal closest to yours.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setState("sending");

    const payload: LeadPayload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      goal: form.goal,
      program: form.program || undefined,
      preferredTime: form.preferredTime || undefined,
      message: form.message.trim() || undefined,
      source: "Website — Book Free Trial",
    };

    try {
      const result = await submitLead(payload, {
        persist: (data) => {
          const lead = addLead({
            name: data.name,
            phone: data.phone,
            email: data.email ?? "",
            goal: data.goal,
            trainingType: data.program ?? "Not specified",
            preferredTime: data.preferredTime ?? "Flexible",
            message: data.message,
          });
          return { id: lead.id, createdAt: lead.createdAt };
        },
      });
      setSubmittedName(payload.name.split(" ")[0] ?? payload.name);
      setReference(result.id);
      setState("done");
    } catch {
      setState("error");
    }
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      window.setTimeout(() => {
        setForm(emptyForm);
        setErrors({});
        setState("form");
      }, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-lg">
        {state === "done" ? (
          <SuccessState
            name={submittedName}
            reference={reference}
            onClose={() => handleOpenChange(false)}
          />
        ) : state === "error" ? (
          <ErrorState onRetry={() => setState("form")} />
        ) : (
          <>
            <DialogHeader>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <DemoBadge />
                <span className="text-xs text-muted-foreground">
                  Sample enquiry — no data leaves your browser
                </span>
              </div>
              <DialogTitle className="text-2xl text-display">Book your free trial</DialogTitle>
              <DialogDescription>
                No payment required. Tell us your goal and a coach will call to confirm a time.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field id="name" label="Full name" required error={errors.name}>
                <Input
                  id="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  required
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="phone" label="Phone number" required error={errors.phone}>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    required
                  />
                </Field>
                <Field id="email" label="Email" hint="Optional" error={errors.email}>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </Field>
              </div>

              <Field id="goal" label="Fitness goal" required error={errors.goal}>
                <SelectField
                  id="goal"
                  placeholder="Select a goal"
                  value={form.goal}
                  options={[...fitnessGoals]}
                  onChange={(v) => set("goal", v)}
                  invalid={!!errors.goal}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="program" label="Preferred program" hint="Optional">
                  <SelectField
                    id="program"
                    placeholder="Select a program"
                    value={form.program}
                    options={programOptions}
                    onChange={(v) => set("program", v)}
                  />
                </Field>
                <Field id="preferredTime" label="Preferred time" hint="Optional">
                  <SelectField
                    id="preferredTime"
                    placeholder="Select a time"
                    value={form.preferredTime}
                    options={[...preferredTimes]}
                    onChange={(v) => set("preferredTime", v)}
                  />
                </Field>
              </div>

              <Field id="message" label="Message" hint="Optional">
                <Textarea
                  id="message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Anything we should know — injuries, schedule, questions."
                />
              </Field>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={state === "sending"}
              >
                {state === "sending" ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Sending request
                  </>
                ) : (
                  "Request my free trial"
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By submitting you agree to be contacted about your trial session.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SuccessState({
  name,
  reference,
  onClose,
}: {
  name: string;
  reference: string;
  onClose: () => void;
}) {
  return (
    <div className="py-4 text-center" role="status" aria-live="polite">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15">
        <CheckCircle2 className="size-8 text-success" aria-hidden="true" />
      </div>
      <DialogHeader className="mt-5">
        <DialogTitle className="text-center text-2xl text-display">
          Trial request received
        </DialogTitle>
        <DialogDescription className="text-center">
          Thanks{name ? `, ${name}` : ""} — a member of the {gym.shortName} team will contact you
          shortly to confirm your session.
        </DialogDescription>
      </DialogHeader>

      <dl className="mx-auto mt-5 max-w-xs space-y-2 rounded-lg border border-border bg-surface/60 p-4 text-left text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Reference</dt>
          <dd className="font-mono font-medium">{reference}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Status</dt>
          <dd className="font-medium text-primary">New enquiry</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Response time</dt>
          <dd className="font-medium">Within 24 hours</dd>
        </div>
      </dl>

      <p className="mx-auto mt-4 max-w-sm text-xs text-muted-foreground">
        Demo behaviour: this enquiry has been added to the demo dashboard so you can see how the
        gym would work the lead.
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button variant="hero" asChild>
          <a
            href={whatsappLink(
              `Hi ${gym.shortName}, I just requested a free trial (ref ${reference}).`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden="true" /> Continue on WhatsApp
          </a>
        </Button>
        <Button variant="outlineLight" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-4 text-center" role="alert">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/15">
        <AlertTriangle className="size-8 text-destructive" aria-hidden="true" />
      </div>
      <DialogHeader className="mt-5">
        <DialogTitle className="text-center text-2xl text-display">
          Something went wrong
        </DialogTitle>
        <DialogDescription className="text-center">
          Your request wasn’t submitted. Please try again, or contact us on WhatsApp and we’ll book
          your trial directly.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button variant="hero" onClick={onRetry}>
          Try again
        </Button>
        <Button variant="outlineLight" asChild>
          <a
            href={whatsappLink(`Hi ${gym.shortName}, I'd like to book a free trial.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden="true" /> WhatsApp us
          </a>
        </Button>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>
          {label}
          {required ? (
            <span className="text-primary" aria-hidden="true">
              *
            </span>
          ) : null}
        </Label>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  id,
  value,
  options,
  placeholder,
  onChange,
  invalid,
}: {
  id: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className="w-full"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
