import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarClock,
  CheckCircle2,
  Mail,
  NotebookPen,
  Search,
  MessageSquare,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickStartTour, useQuickStartTour } from "@/components/QuickStartTour";
import { VerifyNote } from "@/components/ai/AiKit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Winery Productivity Dashboard | Winery Operations Assistant" },
      {
        name: "description",
        content:
          "AI productivity dashboard for winery owners and managers: emails, meeting summaries, task plans, research and a winery chatbot.",
      },
      { property: "og:title", content: "Winery Operations & Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Reduce admin work across the cellar, tasting room and wine club with an AI productivity partner built for wineries.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Tasks Due Today", value: 7, icon: CalendarClock },
  { label: "Completed Tasks", value: 4, icon: CheckCircle2 },
  { label: "Emails Generated", value: 12, icon: Mail },
  { label: "Meetings Summarized", value: 3, icon: NotebookPen },
  { label: "Research Requests", value: 5, icon: Search },
  { label: "AI Assistant Sessions", value: 18, icon: MessageSquare },
];

const QUICK_ACTIONS = [
  { to: "/email", label: "Generate an Email", icon: Mail },
  { to: "/meeting-notes", label: "Summarize Meeting Notes", icon: NotebookPen },
  { to: "/task-planner", label: "Plan My Day", icon: ListChecks },
  { to: "/research", label: "Research a Topic", icon: Search },
  { to: "/chatbot", label: "Ask the AI Assistant", icon: MessageSquare },
] as const;

const ACTIVITY = [
  {
    title: "Email generated",
    detail: "Generated distributor follow-up email for 2025 Chardonnay allocation.",
    time: "18 min ago",
  },
  {
    title: "Meeting summarized",
    detail: "Summarized weekly tasting-room operations meeting.",
    time: "2 hours ago",
  },
  { title: "Task plan created", detail: "Created harvest preparation task plan.", time: "Yesterday" },
  {
    title: "Research completed",
    detail: "Analyzed Q1 wine club sales performance.",
    time: "Yesterday",
  },
];

function Dashboard() {
  const tour = useQuickStartTour();

  return (
    <>
      <QuickStartTour open={tour.open} onClose={tour.close} />

      <section className="surface-card relative overflow-hidden p-6 sm:p-9">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Dashboard</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Good morning. Let's make today productive.</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Your AI productivity partner for winery operations.
          </p>
          <Button variant="outline" size="sm" className="mt-5" onClick={tour.restart}>
            Restart quick start tour
          </Button>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="text-lg">
          Productivity overview
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="surface-card flex items-center gap-4 p-5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-2xl font-semibold">{value}</span>
                <span className="block text-sm text-muted-foreground">{label}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2" aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="text-lg">
            Quick actions
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
              <Button key={to} asChild variant="secondary" className="h-auto justify-between px-4 py-3.5">
                <Link to={to}>
                  <span className="flex items-center gap-3">
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ))}
          </div>
        </section>

        <section className="lg:col-span-3" aria-labelledby="activity-heading">
          <h2 id="activity-heading" className="text-lg">
            Recent activity
          </h2>
          <ul className="surface-card mt-4 divide-y divide-border">
            {ACTIVITY.map((item) => (
              <li key={item.detail} className="flex flex-col gap-1 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <VerifyNote>
              Sample activity shown for demonstration. AI recommendations are suggestions, not confirmed
              facts — verify compliance, licensing and financial details with a qualified professional.
            </VerifyNote>
          </div>
        </section>
      </div>
    </>
  );
}
