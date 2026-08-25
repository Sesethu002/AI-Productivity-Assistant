import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ai/AiKit";
import { useAi } from "@/lib/use-ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Winery Operations Assistant" },
      {
        name: "description",
        content:
          "Research winery topics — market trends, wine club performance, distributor strategy — with insights, opportunities, risks and recommended actions.",
      },
      { property: "og:title", content: "AI Research Assistant for Wineries" },
      {
        property: "og:description",
        content: "Executive briefs and winery implications, with clear separation of your inputs and AI analysis.",
      },
    ],
  }),
  component: ResearchPage,
});

type ResearchResult = {
  executiveSummary: string;
  keyInsights?: string[];
  wineryImplications?: string[];
  opportunities?: string[];
  risks?: string[];
  recommendedActions?: string[];
  verificationNote?: string;
};

const FORMATS = ["Summary", "Key Insights", "Recommendations", "Opportunities & Risks", "Executive Brief"];
const EMPTY = { topic: "", objective: "", context: "", format: "Executive Brief" };

function ResearchPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [refine, setRefine] = useState("");
  const { generate, result, loading, error, isMock, reset } = useAi<ResearchResult>("research");

  const set = (k: keyof typeof EMPTY) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (extra?: string) => {
    const e: Record<string, string> = {};
    if (!form.topic.trim()) e["topic"] = "Add a research topic.";
    if (!form.objective.trim()) e["objective"] = "What question should the AI answer?";
    setErrors(e);
    if (Object.keys(e).length) return;
    generate({ ...form, refinement: extra ?? undefined });
  };

  const asText = (r: ResearchResult) =>
    [
      `Research topic: ${form.topic}`,
      `Objective: ${form.objective}`,
      "",
      "EXECUTIVE SUMMARY",
      r.executiveSummary,
      "",
      "KEY INSIGHTS",
      ...(r.keyInsights ?? []).map((x) => `- ${x}`),
      "",
      "WINERY IMPLICATIONS",
      ...(r.wineryImplications ?? []).map((x) => `- ${x}`),
      "",
      "OPPORTUNITIES",
      ...(r.opportunities ?? []).map((x) => `- ${x}`),
      "",
      "RISKS",
      ...(r.risks ?? []).map((x) => `- ${x}`),
      "",
      "RECOMMENDED ACTIONS",
      ...(r.recommendedActions ?? []).map((x) => `- ${x}`),
      "",
      "AI-generated content may contain errors. Always verify critical information.",
    ].join("\n");

  return (
    <>
      <PageHeader
        eyebrow="AI Research Assistant"
        title="Turn a winery question into a decision-ready brief"
        description="Ask about market trends, wine club performance, distributor strategy, pricing or hospitality operations. Analysis is AI-generated and clearly separated from the information you supply."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <InputPanel onSubmit={() => submit()}>
          <Field label="Research topic" htmlFor="topic" required error={errors["topic"]}>
            <Input
              id="topic"
              value={form.topic}
              onChange={(e) => set("topic")(e.target.value)}
              placeholder="Direct-to-consumer wine club growth"
            />
          </Field>

          <Field label="Question / objective" htmlFor="objective" required error={errors["objective"]}>
            <Textarea
              id="objective"
              rows={3}
              value={form.objective}
              onChange={(e) => set("objective")(e.target.value)}
              placeholder="How should we structure allocations to improve member retention this vintage release?"
            />
          </Field>

          <Field
            label="Additional context"
            htmlFor="context"
            hint="Only include information you can verify. The AI will not invent figures."
          >
            <Textarea
              id="context"
              rows={4}
              value={form.context}
              onChange={(e) => set("context")(e.target.value)}
              placeholder="Mid-sized estate, three tiers of membership, tasting room open six days a week."
            />
          </Field>

          <Field label="Desired output format" htmlFor="format">
            <Select value={form.format} onValueChange={set("format")}>
              <SelectTrigger id="format" className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {FORMATS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Researching..." : "Research"}
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
          onRetry={() => submit()}
          isMock={isMock}
          emptyHint="Your executive summary, insights, opportunities and risks will appear here."
        >
          {result && (
            <>
              <div className="rounded-lg border border-border bg-card p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Provided by you
                </p>
                <p className="mt-2">
                  <span className="font-medium">Topic:</span> {form.topic}
                </p>
                <p>
                  <span className="font-medium">Objective:</span> {form.objective}
                </p>
              </div>

              <OutputSection title="Executive summary">
                <p className="whitespace-pre-wrap">{result.executiveSummary}</p>
              </OutputSection>
              <OutputSection title="Key insights">
                <BulletList items={result.keyInsights} />
              </OutputSection>
              <OutputSection title="Winery implications">
                <BulletList items={result.wineryImplications} />
              </OutputSection>
              <OutputSection title="Opportunities">
                <BulletList items={result.opportunities} />
              </OutputSection>
              <OutputSection title="Risks">
                <BulletList items={result.risks} />
              </OutputSection>
              <OutputSection title="Recommended actions">
                <BulletList items={result.recommendedActions} />
              </OutputSection>

              <div className="flex flex-wrap gap-2">
                <CopyButton text={asText(result)} label="Copy brief" />
                <RegenerateButton onClick={() => submit()} disabled={loading} />
              </div>

              <div className="space-y-2 border-t border-gold/40 pt-4">
                <Field label="Refine this research" htmlFor="refine">
                  <Textarea
                    id="refine"
                    rows={2}
                    value={refine}
                    onChange={(e) => setRefine(e.target.value)}
                    placeholder="Focus more on tasting-room conversion and less on distribution."
                  />
                </Field>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={loading || !refine.trim()}
                  onClick={() => submit(`Refine the previous analysis: ${refine}`)}
                >
                  Apply refinement
                </Button>
              </div>

              <VerifyNote>{result.verificationNote}</VerifyNote>
              <VerifyNote />
            </>
          )}
        </OutputPanel>
      </div>
    </>
  );
}
