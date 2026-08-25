import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BulletList,
  CopyButton,
  Field,
  InputPanel,
  OutputPanel,
  OutputSection,
  PageHeader,
  RegenerateButton,
  VerifyNote,
  priorityClass,
} from "@/components/ai/AiKit";
import { useAi } from "@/lib/use-ai";
import { Download } from "lucide-react";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Winery Operations Assistant" },
      {
        name: "description",
        content:
          "Turn winery meeting notes into a summary, key decisions, action items with owners and deadlines, and follow-ups.",
      },
      { property: "og:title", content: "Winery Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Summaries, decisions and structured action items from your cellar and tasting-room meetings.",
      },
    ],
  }),
  component: MeetingPage,
});

type ActionItem = { task: string; owner: string; deadline: string; priority: string };
type MeetingResult = {
  summary: string;
  decisions?: string[];
  actionItems?: ActionItem[];
  questions?: string[];
  followUps?: string[];
};

const EMPTY = { title: "", date: "", attendees: "", notes: "" };

function MeetingPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { generate, result, loading, error, isMock, reset } = useAi<MeetingResult>("meeting");

  const set = (k: keyof typeof EMPTY) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e["title"] = "Add a meeting title.";
    if (form.notes.trim().length < 20) e["notes"] = "Paste at least a few lines of meeting notes.";
    setErrors(e);
    if (Object.keys(e).length) return;
    generate(form);
  };

  const asText = (r: MeetingResult) =>
    [
      `${form.title || "Meeting"} — ${form.date || "date not set"}`,
      `Attendees: ${form.attendees || "not listed"}`,
      "",
      "SUMMARY",
      r.summary,
      "",
      "KEY DECISIONS",
      ...(r.decisions ?? []).map((d) => `- ${d}`),
      "",
      "ACTION ITEMS",
      ...(r.actionItems ?? []).map((a) => `- ${a.task} | ${a.owner} | ${a.deadline} | ${a.priority}`),
      "",
      "OUTSTANDING QUESTIONS",
      ...(r.questions ?? []).map((q) => `- ${q}`),
      "",
      "RECOMMENDED FOLLOW-UP",
      ...(r.followUps ?? []).map((f) => `- ${f}`),
      "",
      "AI-generated content may contain errors. Always verify critical information.",
    ].join("\n");

  const download = (r: MeetingResult) => {
    const blob = new Blob([asText(r)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(form.title || "meeting-summary").replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        eyebrow="Meeting Notes Summarizer"
        title="From raw notes to decisions and action items"
        description="Paste notes from a cellar, harvest, tasting-room or wine club meeting. The AI extracts only what your notes support."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <InputPanel onSubmit={submit}>
          <Field label="Meeting title" htmlFor="title" required error={errors["title"]}>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title")(e.target.value)}
              placeholder="Weekly tasting-room operations meeting"
            />
          </Field>

          <Field label="Meeting date" htmlFor="date">
            <Input id="date" type="date" value={form.date} onChange={(e) => set("date")(e.target.value)} />
          </Field>

          <Field label="Attendees" htmlFor="attendees" hint="Names or roles, comma separated.">
            <Input
              id="attendees"
              value={form.attendees}
              onChange={(e) => set("attendees")(e.target.value)}
              placeholder="Cellar lead, tasting-room manager, hospitality manager"
            />
          </Field>

          <Field label="Meeting notes" htmlFor="notes" required error={errors["notes"]}>
            <Textarea
              id="notes"
              rows={12}
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder="Discussed bottling window for the 2025 Chardonnay, weekend staffing, wine club allocation timing..."
            />
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Summarizing..." : "Summarize meeting"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm(EMPTY);
                setErrors({});
                reset();
              }}
            >
              Clear
            </Button>
          </div>
        </InputPanel>

        <OutputPanel
          hasContent={Boolean(result)}
          loading={loading}
          error={error}
          onRetry={submit}
          isMock={isMock}
          emptyHint="Your meeting summary, decisions and action items will appear here."
        >
          {result && (
            <>
              <OutputSection title="Meeting summary">
                <p className="whitespace-pre-wrap">{result.summary}</p>
              </OutputSection>

              <OutputSection title="Key decisions">
                <BulletList items={result.decisions} />
              </OutputSection>

              <OutputSection title="Action items">
                {result.actionItems?.length ? (
                  <div className="overflow-x-auto rounded-lg border border-border bg-card">
                    <table className="w-full min-w-[34rem] text-left text-sm">
                      <thead className="bg-secondary text-xs uppercase tracking-wide text-secondary-foreground">
                        <tr>
                          <th scope="col" className="px-3 py-2">
                            Task
                          </th>
                          <th scope="col" className="px-3 py-2">
                            Responsible person
                          </th>
                          <th scope="col" className="px-3 py-2">
                            Deadline
                          </th>
                          <th scope="col" className="px-3 py-2">
                            Priority
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {result.actionItems.map((a, i) => (
                          <tr key={i}>
                            <td className="px-3 py-2.5">{a.task}</td>
                            <td className="px-3 py-2.5 text-muted-foreground">{a.owner}</td>
                            <td className="px-3 py-2.5 text-muted-foreground">{a.deadline}</td>
                            <td className="px-3 py-2.5">
                              <span className={priorityClass(a.priority)}>{a.priority}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No action items identified.</p>
                )}
              </OutputSection>

              <OutputSection title="Outstanding questions">
                <BulletList items={result.questions} />
              </OutputSection>

              <OutputSection title="Recommended follow-up">
                <BulletList items={result.followUps} />
              </OutputSection>

              <div className="flex flex-wrap gap-2">
                <CopyButton text={asText(result)} label="Copy summary" />
                <RegenerateButton onClick={submit} disabled={loading} />
                <Button type="button" variant="outline" size="sm" onClick={() => download(result)}>
                  <Download className="size-4" aria-hidden="true" /> Download
                </Button>
              </div>

              <VerifyNote />
            </>
          )}
        </OutputPanel>
      </div>
    </>
  );
}
