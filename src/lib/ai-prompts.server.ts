export type AiKind = "email" | "meeting" | "plan" | "research" | "chat";

export const WINERY_SYSTEM = `You are the AI assistant inside "Winery Operations & Productivity Assistant", a professional productivity platform for winery owners, winery managers, tasting-room managers, hospitality managers and winery operations teams.

Domain context you understand deeply: harvest seasons, fermentation tracking, barrel aging, bottling schedules, compliance, wine labeling, alcohol laws, distributor relationships, wine club memberships, tasting-room operations, event planning, market trends, inventory management, production planning, hospitality, customer relationships, sales and marketing.

Common pain points: coordinating seasonal labour, supplier contracts, distributor inquiries, weather planning, tasting-room operations, events, wine club communication, competitive pricing, production deadlines, cross-department coordination.

Use winery terminology (vintage, varietal, terroir, crush, must, lees, Brix, pH, tannin structure, appellation, fermentation, barrel aging, cellar, bottling, vineyard, tasting room, wine club, allocation, blend, vintage release) naturally and accurately — never forced.

Responsible AI rules (mandatory):
- Never invent technical wine-production data, numbers, names, prices or business facts that were not supplied.
- Clearly flag assumptions and uncertainty instead of presenting them as fact.
- Never expose or fabricate personal customer or staff information.
- For legal, regulatory, financial, employment, tax, licensing, safety or compliance topics, explicitly recommend verification with a qualified human professional.
- Distinguish recommendations from confirmed facts.

Write in a calm, professional, business tone. Respond ONLY with valid minified JSON matching the requested schema — no markdown fences, no commentary.`;

const schemas: Record<AiKind, string> = {
  email: `{"subject":string,"body":string,"notes":string}`,
  meeting: `{"summary":string,"decisions":string[],"actionItems":[{"task":string,"owner":string,"deadline":string,"priority":"Critical"|"High"|"Medium"|"Low"}],"questions":string[],"followUps":string[]}`,
  plan: `{"tasks":[{"name":string,"description":string,"priority":"Critical"|"High"|"Medium"|"Low","deadline":string,"owner":string,"duration":string}],"notes":string}`,
  research: `{"executiveSummary":string,"keyInsights":string[],"wineryImplications":string[],"opportunities":string[],"risks":string[],"recommendedActions":string[],"verificationNote":string}`,
  chat: `{"reply":string}`,
};

const instructions: Record<AiKind, string> = {
  email: `Draft one winery email. "notes" should hold any caveats or items the user must verify (max 2 sentences). Keep the body ready to send, with greeting and sign-off placeholder [Your name].`,
  meeting: `Summarise the meeting notes. Only include decisions, action items, questions and follow-ups that are supported by the notes. Use "Unassigned" / "To be confirmed" instead of guessing owners or dates.`,
  plan: `Produce 6-9 prioritised tasks for the stated period. Assign owners only from the team members provided, otherwise "Unassigned". Deadlines should be relative and realistic (e.g. "Today 09:00", "Wed AM").`,
  research: `Provide analysis, clearly separating what was supplied from your reasoning. Never fabricate statistics; where data is required, say what should be sourced and verified.`,
  chat: `Answer conversationally as a winery management assistant. Use short paragraphs, and bullet lines starting with "- " where a list helps.`,
};

export function buildMessages(kind: AiKind, input: unknown, history: { role: string; content: string }[] = []) {
  const system = `${WINERY_SYSTEM}

Task: ${instructions[kind]}
JSON schema: ${schemas[kind]}`;

  if (kind === "chat") {
    return [
      { role: "system", content: system },
      ...history.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.role === "assistant" ? JSON.stringify({ reply: m.content }) : m.content,
      })),
    ];
  }

  return [
    { role: "system", content: system },
    { role: "user", content: `Inputs provided by the winery professional:\n${JSON.stringify(input, null, 2)}` },
  ];
}

export function mockResponse(kind: AiKind, input: Record<string, unknown>): unknown {
  switch (kind) {
    case "email":
      return {
        subject: `Follow-up: ${String(input["purpose"] || "winery correspondence").slice(0, 60)}`,
        body: `Hello,\n\nThank you for your time this week. ${String(
          input["keyInfo"] || "Here is the information we discussed.",
        )}\n\nWe would like to confirm next steps so the release stays on schedule alongside our bottling window. ${String(
          input["outcome"] || "Could you confirm by end of week?",
        )}\n\nIf anything above needs adjusting, let me know and we will revise it before the allocation is finalised.\n\nKind regards,\n[Your name]\nWinery Operations`,
        notes:
          "Demo response (AI service unavailable). Verify names, dates, volumes and any pricing or compliance details before sending.",
      };
    case "meeting":
      return {
        summary:
          "Demo summary (AI service unavailable). The team reviewed tasting-room throughput, confirmed the bottling window for the 2025 Chardonnay, and agreed on wine club allocation messaging for the vintage release.",
        decisions: [
          "Proceed with the 2025 Chardonnay bottling in the second week of the month.",
          "Extend weekend tasting-room hours through the release period.",
          "Wine club allocation emails go out one week before public release.",
        ],
        actionItems: [
          { task: "Confirm bottling line booking", owner: "Cellar lead", deadline: "Friday", priority: "Critical" },
          { task: "Draft wine club allocation email", owner: "Hospitality manager", deadline: "Next Tuesday", priority: "High" },
          { task: "Update tasting-room staffing roster", owner: "Tasting-room manager", deadline: "Thursday", priority: "Medium" },
        ],
        questions: [
          "Is dry goods (labels and closures) stock confirmed for the full run?",
          "Do extended trading hours require a licence amendment?",
        ],
        followUps: [
          "Circulate the confirmed bottling schedule to all departments.",
          "Verify licensing and labelling requirements with a qualified compliance professional.",
        ],
      };
    case "plan":
      return {
        notes: "Demo plan (AI service unavailable). Adjust owners and deadlines to match your actual roster.",
        tasks: [
          { name: "Review overnight fermentation logs", description: "Check Brix and temperature trends across active tanks and flag anything outside range for the cellar team.", priority: "Critical", deadline: "Today 08:00", owner: "Cellar lead", duration: "30 min" },
          { name: "Confirm bottling line booking", description: "Lock the bottling window for the current vintage release and confirm dry goods availability.", priority: "Critical", deadline: "Today 10:00", owner: "Production", duration: "45 min" },
          { name: "Respond to distributor allocation queries", description: "Reply to outstanding allocation requests with confirmed case volumes only.", priority: "High", deadline: "Today 11:30", owner: "Sales", duration: "1 hr" },
          { name: "Approve tasting-room roster", description: "Sign off weekend staffing against expected walk-in and booked tasting volumes.", priority: "High", deadline: "Today 14:00", owner: "Tasting-room manager", duration: "30 min" },
          { name: "Draft wine club release note", description: "Prepare member-facing copy for the upcoming vintage release allocation.", priority: "Medium", deadline: "Today 15:00", owner: "Hospitality", duration: "45 min" },
          { name: "Review supplier contract renewals", description: "Flag contracts expiring this quarter; route anything legal to professional review.", priority: "Medium", deadline: "Tomorrow", owner: "Unassigned", duration: "1 hr" },
          { name: "Walk the cellar and tasting room", description: "Quick operational check on cleanliness, signage and stock facings.", priority: "Low", deadline: "Today 16:30", owner: "Unassigned", duration: "20 min" },
        ],
      };
    case "research":
      return {
        executiveSummary:
          "Demo analysis (AI service unavailable). Direct-to-consumer channels — wine club and tasting room — typically carry stronger margin than distributor volume, so protecting member retention is usually the highest-leverage move for a mid-sized winery.",
        keyInsights: [
          "Member retention generally outperforms new-member acquisition on cost per case.",
          "Tasting-room conversion is closely tied to staffing quality during peak windows.",
          "Allocation scarcity messaging supports pricing on limited vintage releases.",
        ],
        wineryImplications: [
          "Small retention gains in the wine club can offset softer distributor orders.",
          "Release timing should be coordinated with bottling and cellar capacity.",
        ],
        opportunities: [
          "Segment wine club communication by varietal preference.",
          "Bundle experiences with vintage release allocations.",
        ],
        risks: [
          "Weather variability affecting crush timing and yields.",
          "Over-committing allocation before volumes are confirmed.",
        ],
        recommendedActions: [
          "Confirm actual sales and retention figures from your own systems before acting.",
          "Model two release scenarios against confirmed cellar capacity.",
        ],
        verificationNote:
          "This is AI-assisted analysis, not verified market data. Confirm regulatory, tax and licensing matters with a qualified professional.",
      };
    case "chat":
      return {
        reply:
          "Demo response (AI service unavailable right now).\n\nHere is how I would approach it:\n- Start from confirmed figures in your own POS, wine club and cellar records.\n- Separate direct-to-consumer performance (tasting room, wine club) from distributor volume.\n- Note any assumptions explicitly so the team can verify them.\n\nFor compliance, labelling or employment questions, please confirm details with a qualified professional before acting.",
      };
  }
}
