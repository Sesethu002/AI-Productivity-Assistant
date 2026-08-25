import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  InputPanel,
  OutputPanel,
  PageHeader,
  RegenerateButton,
  VerifyNote,
  priorityClass,
} from "@/components/ai/AiKit";
import { useAi } from "@/lib/use-ai";
import { Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Winery Operations Assistant" },
      {
        name: "description",
        content:
          "Build prioritized daily and weekly winery task plans across cellar, vineyard, tasting room and wine club, and track completion.",
      },
      { property: "og:title", content: "AI Task Planner for Winery Teams" },
      {
        property: "og:description",
        content: "Prioritized plans with owners, deadlines and completion tracking for winery operations.",
      },
    ],
  }),
  component: PlannerPage,
});

type Task = {
  id: string;
  name: string;
  description: string;
  priority: string;
  deadline: string;
  owner: string;
  duration: string;
  done: boolean;
};

type PlanResult = {
  tasks?: Omit<Task, "id" | "done">[];
  notes?: string;
};

const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const EMPTY = {
  period: "Today",
  customPeriod: "",
  department: "",
  goals: "",
  tasks: "",
  deadlines: "",
  team: "",
  context: "",
};

const uid = () => Math.random().toString(36).slice(2, 10);

function PlannerPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const { generate, loading, error, isMock, result } = useAi<PlanResult>("plan");

  const set = (k: keyof typeof EMPTY) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!form.goals.trim()) e["goals"] = "Add at least one main goal for this period.";
    if (form.period === "Custom" && !form.customPeriod.trim())
      e["customPeriod"] = "Describe the custom planning period.";
    setErrors(e);
    if (Object.keys(e).length) return;

    const res = await generate(form);
    if (res?.tasks?.length) {
      setTasks(
        res.tasks.map((t) => ({
          id: uid(),
          name: t.name,
          description: t.description,
          priority: t.priority || "Medium",
          deadline: t.deadline || "",
          owner: t.owner || "Unassigned",
          duration: t.duration || "",
          done: false,
        })),
      );
    }
  };

  const completed = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const grouped = PRIORITIES.map((p) => ({ priority: p, items: tasks.filter((t) => t.priority === p) })).filter(
    (g) => g.items.length,
  );

  const addManual = () => {
    const name = draft.trim();
    if (!name) return;
    setTasks((t) => [
      ...t,
      {
        id: uid(),
        name,
        description: "Added manually.",
        priority: "Medium",
        deadline: "",
        owner: "Unassigned",
        duration: "",
        done: false,
      },
    ]);
    setDraft("");
  };

  return (
    <>
      <PageHeader
        eyebrow="AI Task Planner"
        title="A prioritized plan for the cellar, vineyard and tasting room"
        description="Describe your goals and responsibilities for the period. The AI returns a prioritized plan you can edit, extend and tick off as work gets done."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <InputPanel onSubmit={submit}>
          <Field label="Planning period" htmlFor="period" required>
            <Select value={form.period} onValueChange={set("period")}>
              <SelectTrigger id="period" className="w-full">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {["Today", "This Week", "Custom"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {form.period === "Custom" && (
            <Field label="Custom period" htmlFor="customPeriod" required error={errors["customPeriod"]}>
              <Input
                id="customPeriod"
                value={form.customPeriod}
                onChange={(e) => set("customPeriod")(e.target.value)}
                placeholder="Crush week, 15–21 March"
              />
            </Field>
          )}

          <Field label="Winery / department" htmlFor="department">
            <Input
              id="department"
              value={form.department}
              onChange={(e) => set("department")(e.target.value)}
              placeholder="Cellar & production"
            />
          </Field>

          <Field label="Main goals" htmlFor="goals" required error={errors["goals"]}>
            <Textarea
              id="goals"
              rows={3}
              value={form.goals}
              onChange={(e) => set("goals")(e.target.value)}
              placeholder="Complete bottling prep for the 2025 Chardonnay and confirm wine club allocations."
            />
          </Field>

          <Field label="Tasks / responsibilities" htmlFor="tasks">
            <Textarea
              id="tasks"
              rows={4}
              value={form.tasks}
              onChange={(e) => set("tasks")(e.target.value)}
              placeholder="Check fermentation logs, respond to distributor emails, approve weekend roster."
            />
          </Field>

          <Field label="Deadlines" htmlFor="deadlines">
            <Textarea
              id="deadlines"
              rows={2}
              value={form.deadlines}
              onChange={(e) => set("deadlines")(e.target.value)}
              placeholder="Bottling line confirmation due Friday."
            />
          </Field>

          <Field label="Available team members" htmlFor="team" hint="The AI only assigns people you list here.">
            <Input
              id="team"
              value={form.team}
              onChange={(e) => set("team")(e.target.value)}
              placeholder="Cellar lead, tasting-room manager, hospitality manager"
            />
          </Field>

          <Field label="Additional context" htmlFor="context">
            <Textarea
              id="context"
              rows={2}
              value={form.context}
              onChange={(e) => set("context")(e.target.value)}
              placeholder="Rain forecast midweek; two staff on leave."
            />
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Planning..." : "Generate task plan"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm(EMPTY);
                setErrors({});
                setTasks([]);
              }}
            >
              Clear
            </Button>
          </div>
        </InputPanel>

        <OutputPanel
          hasContent={tasks.length > 0}
          loading={loading}
          error={error}
          onRetry={submit}
          isMock={isMock}
          emptyHint="Your prioritized task plan will appear here."
        >
          <div className="surface-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">
                {completed} of {tasks.length} tasks completed
              </p>
              <span className="text-xs text-muted-foreground">{pct}%</span>
            </div>
            <div
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Task completion progress"
            >
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {grouped.map((group) => (
            <div key={group.priority}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-primary">
                {group.priority} priority
              </h3>
              <ul className="mt-3 space-y-3">
                {group.items.map((t) => (
                  <li key={t.id} className="surface-card p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`task-${t.id}`}
                        checked={t.done}
                        onCheckedChange={(v) =>
                          setTasks((prev) =>
                            prev.map((x) => (x.id === t.id ? { ...x, done: Boolean(v) } : x)),
                          )
                        }
                        aria-label={`Mark "${t.name}" as complete`}
                        className="mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        {editingId === t.id ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <Input
                              value={t.name}
                              aria-label="Task name"
                              onChange={(e) =>
                                setTasks((prev) =>
                                  prev.map((x) => (x.id === t.id ? { ...x, name: e.target.value } : x)),
                                )
                              }
                              className="flex-1"
                            />
                            <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                              <Check className="size-4" aria-hidden="true" /> Save
                            </Button>
                          </div>
                        ) : (
                          <label
                            htmlFor={`task-${t.id}`}
                            className={cn(
                              "block cursor-pointer text-sm font-semibold",
                              t.done && "text-muted-foreground line-through",
                            )}
                          >
                            {t.name}
                          </label>
                        )}
                        <p
                          className={cn(
                            "mt-1 text-sm text-muted-foreground",
                            t.done && "line-through",
                          )}
                        >
                          {t.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className={priorityClass(t.priority)}>{t.priority}</span>
                          {t.deadline && <span>Due: {t.deadline}</span>}
                          {t.owner && <span>Owner: {t.owner}</span>}
                          {t.duration && <span>Est: {t.duration}</span>}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${t.name}`}
                          onClick={() => setEditingId(editingId === t.id ? null : t.id)}
                        >
                          {editingId === t.id ? (
                            <X className="size-4" aria-hidden="true" />
                          ) : (
                            <Pencil className="size-4" aria-hidden="true" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${t.name}`}
                          onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[12rem] flex-1">
              <Field label="Add a task manually" htmlFor="manual-task">
                <Input
                  id="manual-task"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Order additional labels for the vintage release"
                />
              </Field>
            </div>
            <Button type="button" variant="secondary" onClick={addManual} disabled={!draft.trim()}>
              <Plus className="size-4" aria-hidden="true" /> Add
            </Button>
            <RegenerateButton onClick={submit} disabled={loading} />
          </div>

          <VerifyNote>{result?.notes}</VerifyNote>
          <VerifyNote />
        </OutputPanel>
      </div>
    </>
  );
}
