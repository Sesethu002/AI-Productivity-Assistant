import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildMessages, mockResponse, type AiKind } from "./ai-prompts.server";

const AiInput = z.object({
  kind: z.enum(["email", "meeting", "plan", "research", "chat"]),
  input: z.record(z.any()).default({}),
  history: z.array(z.object({ role: z.string(), content: z.string() })).default([]),
});

export const runAi = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => AiInput.parse(data))
  .handler(async ({ data }) => {
    const kind = data.kind as AiKind;
    const key = process.env["LOVABLE_API_KEY"];

    if (!key) {
      return { data: mockResponse(kind, data.input), mock: true as boolean };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: buildMessages(kind, data.input, data.history),
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      if (res.status === 402 || res.status === 403) {
        return { data: mockResponse(kind, data.input), mock: true as boolean };
      }
      throw new Error(`AI request failed (${res.status})`);
    }

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content ?? "";
    const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    try {
      return { data: JSON.parse(cleaned), mock: false as boolean };
    } catch {
      if (kind === "chat" && cleaned) return { data: { reply: cleaned }, mock: false as boolean };
      throw new Error("AI returned an unreadable response");
    }
  });
