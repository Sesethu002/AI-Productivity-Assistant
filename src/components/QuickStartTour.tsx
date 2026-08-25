import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

const STORAGE_KEY = "winery-tour-complete";

const STEPS: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Dashboard",
    body: "Get an overview of your winery productivity activity and quickly access your most important tools.",
    icon: LayoutDashboard,
  },
  {
    title: "Smart Email Generator",
    body: "Create professional winery-related emails in seconds.",
    icon: Mail,
  },
  {
    title: "Meeting Notes",
    body: "Turn lengthy meeting notes into summaries, decisions, and action items.",
    icon: NotebookPen,
  },
  {
    title: "Task Planner",
    body: "Build prioritized daily or weekly plans and track completed tasks.",
    icon: ListChecks,
  },
  {
    title: "AI Winery Chatbot",
    body: "Ask your AI productivity partner questions and use suggested prompts to get started.",
    icon: MessageSquare,
  },
];

export function useQuickStartTour() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const close = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    setOpen(false);
  };

  return { open, close, restart: () => setOpen(true) };
}

export function QuickStartTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  if (!open) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const last = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      <div className="w-full max-w-lg surface-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Quick start tour · Step {step + 1} of {STEPS.length}
        </p>

        <div className="mt-4 flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="tour-title" className="text-xl">
              {current.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.body}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-1.5" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span
              key={s.title}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={onClose}>
            Skip tour
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            {last ? (
              <Button onClick={onClose}>Finish tour</Button>
            ) : (
              <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>Next</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
