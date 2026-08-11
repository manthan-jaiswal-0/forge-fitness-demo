import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

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
import { fitnessGoals, preferredTimes, trainingTypes, gym } from "@/lib/demo-data";
import { useLeads } from "@/lib/leads-store";

type Errors = Partial<Record<"name" | "phone" | "email" | "goal" | "trainingType" | "preferredTime", string>>;

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  goal: "",
  trainingType: "",
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
  const [state, setState] = React.useState<"form" | "sending" | "done">("form");
  const [reference, setReference] = React.useState("");

  const set = (key: keyof typeof emptyForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function validate(): boolean {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[+0-9 ()-]{8,}$/.test(form.phone.trim()))
      next.phone = "Enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (!form.goal) next.goal = "Choose a goal.";
    if (!form.trainingType) next.trainingType = "Choose a training type.";
    if (!form.preferredTime) next.preferredTime = "Choose a preferred time.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setState("sending");
    window.setTimeout(() => {
      const lead = addLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        goal: form.goal,
        trainingType: form.trainingType,
        preferredTime: form.preferredTime,
        message: form.message.trim() || undefined,
      });
      setReference(lead.id);
      setState("done");
    }, 900);
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
          <SuccessState reference={reference} onClose={() => handleOpenChange(false)} />
        ) : (
          <>
            <DialogHeader>
              <div className="mb-1 flex items-center gap-2">
                <DemoBadge />
                <span className="text-xs text-muted-foreground">
                  Sample enquiry — no data leaves your browser
                </span>
              </div>
              <DialogTitle className="text-2xl text-display">Book your free trial</DialogTitle>
              <DialogDescription>
                Tell us a little about you and the team will confirm a session time.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field id="name" label="Full name" error={errors.name}>
                <Input
                  id="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  placeholder="Your name"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="phone" label="Phone" error={errors.phone}>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    aria-invalid={!!errors.phone}
                    placeholder="+91 ..."
                  />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    placeholder="you@example.com"
                  />
                </Field>
              </div>

              <Field id="goal" label="Fitness goal" error={errors.goal}>
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
                <Field id="trainingType" label="Preferred training" error={errors.trainingType}>
                  <SelectField
                    id="trainingType"
                    placeholder="Select type"
                    value={form.trainingType}
                    options={[...trainingTypes]}
                    onChange={(v) => set("trainingType", v)}
                    invalid={!!errors.trainingType}
                  />
                </Field>
                <Field id="preferredTime" label="Preferred time" error={errors.preferredTime}>
                  <SelectField
                    id="preferredTime"
                    placeholder="Select time"
                    value={form.preferredTime}
                    options={[...preferredTimes]}
                    onChange={(v) => set("preferredTime", v)}
                    invalid={!!errors.preferredTime}
                  />
                </Field>
              </div>

              <Field id="message" label="Message (optional)">
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
                    Sending enquiry
                  </>
                ) : (
                  "Send my trial request"
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

function SuccessState({ reference, onClose }: { reference: string; onClose: () => void }) {
  return (
    <div className="py-4 text-center" role="status" aria-live="polite">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15">
        <CheckCircle2 className="size-8 text-success" aria-hidden="true" />
      </div>
      <DialogHeader className="mt-5">
        <DialogTitle className="text-center text-2xl text-display">
          Enquiry received
        </DialogTitle>
        <DialogDescription className="text-center">
          Thanks — your free trial request has reached the {gym.shortName} front desk.
          A coach will call you within one working day to confirm your slot.
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
        Demo behaviour: this enquiry has been added to the demo dashboard so you can see how
        the gym would work the lead.
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button variant="hero" onClick={onClose}>
          Done
        </Button>
        <Button variant="outlineLight" asChild>
          <a href="/demo-admin">Open demo dashboard</a>
        </Button>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
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
      <SelectTrigger id={id} aria-invalid={invalid} className="w-full">
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
