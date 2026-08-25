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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Winery Operations Assistant" },
      {
        name: "description",
        content:
          "Draft professional winery emails for distributors, wine club members, suppliers and event clients in seconds.",
      },
      { property: "og:title", content: "Smart Email Generator for Wineries" },
      {
        property: "og:description",
        content: "Generate polished winery correspondence with the right tone and clear next steps.",
      },
    ],
  }),
  component: EmailPage,
});

type EmailResult = { subject: string; body: string; notes?: string };

const RECIPIENTS = [
  "Customer",
  "Wine Club Member",
  "Supplier",
  "Distributor",
  "Staff Member",
  "Event Client",
  "Business Partner",
  "Other",
];
const TONES = ["Professional", "Friendly", "Persuasive", "Apologetic", "Firm but Respectful", "Concise"];

const EMPTY = {
  recipient: "Distributor",
  purpose: "",
  keyInfo: "",
  outcome: "",
  tone: "Professional",
  context: "",
};

function EmailPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [refine, setRefine] = useState("");
  const { generate, result, loading, error, isMock, reset } = useAi<EmailResult>("email");

  const set = (k: keyof typeof EMPTY) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.purpose.trim()) e["purpose"] = "Tell the AI what this email is about.";
    if (!form.keyInfo.trim()) e["keyInfo"] = "Add the key information to include.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (extra?: string) => {
    if (!validate()) return;
    generate({ ...form, refinement: extra ?? undefined });
  };

  return (
    <>
      <PageHeader
        eyebrow="Smart Email Generator"
        title="Winery correspondence, drafted in seconds"
        description="Give the AI the recipient, purpose and key facts. It returns a subject line and a ready-to-review email in the tone you choose."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <InputPanel onSubmit={() => submit()}>
          <Field label="Recipient type" htmlFor="recipient" required>
            <Select value={form.recipient} onValueChange={set("recipient")}>
              <SelectTrigger id="recipient" className="w-full">
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                {RECIPIENTS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Email purpose" htmlFor="purpose" required error={errors["purpose"]}>
            <Input
              id="purpose"
              value={form.purpose}
              onChange={(e) => set("purpose")(e.target.value)}
              placeholder="Follow up on the 2025 Chardonnay allocation request"
            />
          </Field>

          <Field
            label="Key information"
            htmlFor="keyInfo"
            required
            error={errors["keyInfo"]}
            hint="Confirmed facts only — the AI will not invent volumes, dates or pricing."
          >
            <Textarea
              id="keyInfo"
              rows={4}
              value={form.keyInfo}
              onChange={(e) => set("keyInfo")(e.target.value)}
              placeholder="120 cases available, bottling completes in week 2, tasting samples already shipped."
            />
          </Field>

          <Field label="Desired outcome" htmlFor="outcome">
            <Input
              id="outcome"
              value={form.outcome}
              onChange={(e) => set("outcome")(e.target.value)}
              placeholder="Written confirmation of case volume by Friday"
            />
          </Field>

          <Field label="Tone" htmlFor="tone">
            <Select value={form.tone} onValueChange={set("tone")}>
              <SelectTrigger id="tone" className="w-full">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Additional context (optional)" htmlFor="context">
            <Textarea
              id="context"
              rows={3}
              value={form.context}
              onChange={(e) => set("context")(e.target.value)}
              placeholder="Long-standing account, previous vintage sold through quickly."
            />
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate email"}
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
          emptyHint="Your generated subject line and email will appear here."
        >
          {result && (
            <>
              <OutputSection title="Suggested subject">
                <p className="font-medium">{result.subject}</p>
              </OutputSection>
              <OutputSection title="Generated email">
                <p className="whitespace-pre-wrap">{result.body}</p>
              </OutputSection>

              <div className="flex flex-wrap gap-2">
                <CopyButton text={`Subject: ${result.subject}\n\n${result.body}`} label="Copy email" />
                <RegenerateButton onClick={() => submit()} disabled={loading} />
              </div>

              <div className="space-y-2 border-t border-gold/40 pt-4">
                <Field label="Edit / refine this draft" htmlFor="refine">
                  <Textarea
                    id="refine"
                    rows={2}
                    value={refine}
                    onChange={(e) => setRefine(e.target.value)}
                    placeholder="Make it shorter and add a request for a purchase order number."
                  />
                </Field>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={loading || !refine.trim()}
                  onClick={() => submit(`Revise the previous draft: ${refine}`)}
                >
                  Apply refinement
                </Button>
              </div>

              <VerifyNote>{result.notes}</VerifyNote>
              <VerifyNote />
            </>
          )}
        </OutputPanel>
      </div>
    </>
  );
}
