import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorState, LoadingState, PageHeader, VerifyNote } from "@/components/ai/AiKit";
import { useAi } from "@/lib/use-ai";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Winery Chatbot | Winery Operations Assistant" },
      {
        name: "description",
        content:
          "Chat with an AI winery management assistant about sales performance, tasting-room events, wine club communication and daily operations.",
      },
      { property: "og:title", content: "AI Winery Chatbot" },
      {
        property: "og:description",
        content: "A conversational productivity partner that understands cellar, hospitality and wine club operations.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Summarize our Q1 sales performance",
  "Draft a social media post for our new Chardonnay release",
  "Create a checklist for an upcoming wine tasting event",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const { generate, loading, error, isMock } = useAi<{ reply: string }>("chat");
  const endRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || loading) return;
    setLastPrompt(prompt);
    const history: Message[] = [...messages, { role: "user", content: prompt }];
    setMessages(history);
    setInput("");
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    const res = await generate({}, history);
    if (res?.reply) {
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  };

  const retry = () => {
    setMessages((m) => (m.at(-1)?.role === "user" ? m.slice(0, -1) : m));
    void send(lastPrompt);
  };

  return (
    <>
      <PageHeader
        eyebrow="AI Winery Chatbot"
        title="Your winery management assistant"
        description="Ask about tasting-room operations, wine club communication, harvest coordination, distributor follow-ups or anything else on today's list."
      />

      <div className="surface-card flex h-[calc(100vh-20rem)] min-h-[26rem] flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-primary" aria-hidden="true" /> Winery assistant
            {isMock && (
              <span className="rounded-md bg-gold/40 px-2 py-0.5 text-[11px] font-semibold text-gold-foreground">
                Demo data
              </span>
            )}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
            disabled={!messages.length}
            aria-label="Clear conversation"
          >
            <Trash2 className="size-4" aria-hidden="true" /> Clear
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
          {messages.length === 0 && !loading && (
            <div className="mx-auto max-w-xl py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Start with one of these, or ask your own question.
              </p>
              <div className="mt-4 grid gap-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-xl border border-border bg-cream px-4 py-3 text-left text-sm font-medium transition-colors hover:border-primary/50 hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "ai-surface text-ai-foreground",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="max-w-md">
              <LoadingState />
            </div>
          )}
          {error && <ErrorState message={error} onRetry={retry} />}
          <div ref={endRef} />
        </div>

        <form
          className="flex items-center gap-2 border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            Message the winery assistant
          </label>
          <Input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about harvest planning, wine club comms, tasting-room events..."
            autoComplete="off"
          />
          <Button type="submit" disabled={loading || !input.trim()} aria-label="Send message">
            <Send className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </div>

      <div className="mt-4 max-w-3xl">
        <VerifyNote />
      </div>
    </>
  );
}
