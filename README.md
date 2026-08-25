# Vineyard Virtuoso

Yes — I’ll keep the content and structure of the previous prompt, and only incorporate the additional requirements you supplied. I’ll also remove the user/profile area and settings, while keeping the sidebar navigation for the core functions.

Build an AI-Powered Winery Operations & Productivity Assistant

Create a polished, professional, fully responsive web application called Winery Operations & Productivity Assistant.

The application is a specialized AI productivity platform built specifically for winery owners, winery managers, tasting-room managers, hospitality managers, and winery operations teams.

The goal is to help winery professionals reduce repetitive administrative work, improve communication, organize tasks, summarize information, conduct research, and make better operational decisions.

The application must feel like a real professional business product, not a generic AI chatbot or basic prototype.

1. APPLICATION STRUCTURE

Build the application using a professional dashboard layout.

The application must contain:

Sidebar Navigation

Create a persistent left-hand sidebar on desktop and a collapsible/mobile navigation menu on smaller screens.

The sidebar must contain the following core functions:

Dashboard

Smart Email Generator

Meeting Notes Summarizer

Task Planner

Research Assistant

AI Winery Chatbot

The currently selected module should be visually highlighted.

Include appropriate icons for each navigation item.

Do NOT include:

User profile area

User account section

Settings navigation

Settings page

The sidebar should focus exclusively on the application's core productivity functions.

On mobile, convert the sidebar into a hamburger/collapsible navigation menu.

2. DASHBOARD

Create a professional dashboard landing page.

The dashboard should provide an overview of the user's winery productivity activities.

Include:

Welcome Section

Display a personalized welcome message such as:

"Good morning. Let's make today productive."

Subtitle:

"Your AI productivity partner for winery operations."

Productivity Overview

Display cards for:

Tasks Due Today

Completed Tasks

Emails Generated

Meetings Summarized

Research Requests

AI Assistant Sessions

Use realistic sample data initially.

Quick Actions

Provide prominent buttons for:

Generate an Email

Summarize Meeting Notes

Plan My Day

Research a Topic

Ask the AI Assistant

Recent Activity

Show recent AI activity such as:

Email generated

Meeting summarized

Task plan created

Research completed

Use realistic winery-specific sample content.

3. SMART EMAIL GENERATOR

Create a dedicated module accessible from the sidebar.

The page must contain a clear Input Section and AI Output Section.

Input Fields

Include:

Recipient Type dropdown

Customer

Wine Club Member

Supplier

Distributor

Staff Member

Event Client

Business Partner

Other

Email Purpose

Key Information

Desired Outcome

Tone dropdown:

Professional

Friendly

Persuasive

Apologetic

Firm but Respectful

Concise

Optional Additional Context field

Add a prominent:

Generate Email

button.

AI Output

Display:

Suggested Subject

Generated Email

Copy button

Regenerate button

Edit/Refine button

Show a loading animation/state while the AI generates the response.

4. MEETING NOTES SUMMARIZER

Create a dedicated Meeting Notes module.

Input Section

Include:

Meeting Title

Meeting Date

Attendees

Large text area for meeting notes

Add:

Summarize Meeting

button.

AI Output

Generate:

Meeting Summary

A concise summary of the meeting.

Key Decisions

Important decisions made.

Action Items

Display action items in a structured table:

TaskResponsible PersonDeadlinePriority

Outstanding Questions

List unresolved issues.

Recommended Follow-Up

Provide suggested next steps.

Include:

Copy

Regenerate

Export/Download where practical

Show a clear loading state while AI is processing.

5. AI TASK PLANNER

Create a dedicated Task Planner module.

The purpose is to help winery owners and managers organize daily and weekly responsibilities.

Input Fields

Include:

Planning Period:

Today

This Week

Custom

Winery/Department

Main Goals

Tasks/Responsibilities

Deadlines

Available Team Members

Additional Context

Add:

Generate Task Plan

button.

AI Output

Generate a prioritized task plan.

Categorize tasks:

Critical

High Priority

Medium Priority

Low Priority

Each generated task must include:

Task name

Description

Priority

Suggested deadline/time

Responsible person, when provided

Estimated duration, when appropriate

Task Completion

Every task must have a visible "Mark as Complete" checkbox next to it.

When the checkbox is selected:

Visually mark the task as completed

Strike through the completed task

Update the completed-task count

Preserve the task in the plan rather than deleting it

Include progress information such as:

4 of 7 tasks completed

and a visual progress bar.

Allow users to:

Add a task manually

Edit a task

Delete a task

Mark a task complete

Regenerate the plan

6. AI RESEARCH ASSISTANT

Create a dedicated Research Assistant module.

Input Section

Include:

Research Topic

Question/Objective

Additional Context

Desired Output Format dropdown:

Summary

Key Insights

Recommendations

Opportunities & Risks

Executive Brief

Add:

Research

button.

AI Output

Display:

Executive Summary

Key Insights

Winery Implications

Explain what the information could mean for the winery.

Opportunities

Risks

Recommended Actions

Clearly distinguish between information provided by the user and AI-generated analysis.

Include loading, copy, regenerate, and refine functionality.

7. AI WINERY CHATBOT

Create a dedicated conversational AI interface.

The chatbot should feel like a professional winery management assistant.

Chat Interface

Include:

Conversation history

User messages

AI responses

Text input field

Send button

Clear conversation option

The chatbot should understand winery-specific context.

8. PREPOPULATED CHATBOT SUGGESTED PROMPTS

When the chatbot is opened and no conversation exists, display exactly these three suggested prompts as clickable cards/buttons:

Suggested Prompt 1

"Summarize our Q1 sales performance"

Suggested Prompt 2

"Draft a social media post for our new Chardonnay release"

Suggested Prompt 3

"Create a checklist for an upcoming wine tasting event"

When the user clicks one of these prompts, automatically place the prompt into the chat and generate the AI response.

9. WINERY-SPECIFIC AI CONTEXT

The AI must be specifically optimized for the winery industry.

Use the following context when generating responses.

Winery Operations

Wineries commonly deal with:

Harvest seasons

Fermentation tracking

Barrel aging

Bottling schedules

Compliance

Wine labeling

Alcohol laws and regulations

Distributor relationships

Wine club memberships

Tasting-room operations

Event planning

Market trend analysis

Inventory management

Production planning

Hospitality

Customer relationships

Sales and marketing

Common Winery Pain Points

The AI should understand common challenges such as:

Coordinating seasonal labor

Managing supplier contracts

Responding to distributor inquiries

Planning around weather

Managing tasting-room operations

Coordinating events

Managing wine club communication

Staying competitive on pricing

Managing production deadlines

Coordinating multiple departments

Winery Terminology

Use appropriate winery terminology naturally when relevant, including:

Vintage

Varietal

Terroir

Crush

Must

Lees

Brix

pH

Tannin structure

Appellation

Fermentation

Barrel aging

Cellar

Bottling

Vineyard

Tasting room

Wine club

Allocation

Blend

Vintage release

Do not force terminology into every response. Use it naturally and accurately.

Do not invent technical wine-production data.

10. RESPONSIVE DESIGN

The entire application must be fully responsive.

It must work professionally on:

Desktop

Full sidebar navigation

Multi-column dashboard

Spacious input/output layouts

Tablet

Adaptive sidebar

Responsive cards

Flexible content layouts

Mobile

Collapsible hamburger navigation

Single-column layouts

Touch-friendly buttons

Readable typography

Responsive tables/cards

Properly sized form fields

Chat interface optimized for mobile

No horizontal scrolling should be required.

11. INPUT AND OUTPUT DESIGN

Every AI module must clearly separate:

INPUT

Information provided by the winery professional.

and

AI OUTPUT

Information generated by the AI.

Use visually distinct cards, panels, or sections.

Every input form should have:

Clear labels

Helpful placeholder text

Appropriate validation

Required-field indicators where necessary

Clear primary action button

Reset/clear option

12. AI LOADING STATES

Every AI-powered module must show a clear loading state while generating.

Do not leave the interface blank during processing.

Use:

Loading spinner

Skeleton UI

"AI is analyzing..." message

Progress-style animation where appropriate

The user must always understand that the system is processing their request.

13. AI ERROR HANDLING

If the AI fails to generate a response:

Display a friendly error message such as:

"We couldn't generate your response right now. Please try again."

Provide a:

Try Again

button.

Do not display technical errors directly to the user.

14. AI INTEGRATION

Use Lovable's built-in AI API integration where available.

If the AI API is not configured, implement realistic mock AI responses using high-quality winery-specific sample data so that every feature remains demonstrable.

The UI and functionality should be structured so that real AI integration can easily replace the mock responses.

Do not make the application appear broken if an API key is unavailable.

15. QUICK START TOUR

On the user's first visit, automatically display a Quick Start Tour modal.

The tour should explain the application's core functions.

Include approximately five steps:

Step 1 — Dashboard

"Get an overview of your winery productivity activity and quickly access your most important tools."

Step 2 — Smart Email Generator

"Create professional winery-related emails in seconds."

Step 3 — Meeting Notes

"Turn lengthy meeting notes into summaries, decisions, and action items."

Step 4 — Task Planner

"Build prioritized daily or weekly plans and track completed tasks."

Step 5 — AI Winery Chatbot

"Ask your AI productivity partner questions and use suggested prompts to get started."

Include:

Next button

Back button

Skip Tour

Finish Tour

Do not display the tour again after the user has completed or skipped it unless they choose to restart it.

16. PROFESSIONAL UI/UX

The interface must look like a premium professional SaaS application designed specifically for the wine industry.

Color Palette

Use a wine-inspired palette consisting of:

Burgundy

Gold

Cream

Dark Charcoal

Use the colors professionally and sparingly.

The design should feel:

Elegant

Premium

Modern

Professional

Calm

Trustworthy

Avoid an overly decorative or stereotypical "wine bottle" aesthetic.

Prioritize usability over decoration.

17. TYPOGRAPHY

Use modern, highly readable typography.

Create a clear hierarchy between:

Page titles

Section headings

Form labels

Body text

AI responses

Buttons

Navigation items

Ensure sufficient contrast and readability.

18. FOOTER

Every page must include a footer.

The footer must contain the following disclaimer exactly as written:

"AI-generated content may contain errors. Always verify critical information."

Do not modify the wording.

The footer may also include:

Application name

Copyright

Version number

Do not add user profile, account, or settings controls to the footer.

19. RESPONSIBLE AI

Include responsible AI safeguards throughout the application.

The AI must:

Avoid presenting assumptions as facts

Identify uncertainty

Avoid fabricating business information

Encourage verification of critical information

Protect confidential winery information

Avoid exposing personal customer/staff information

Clearly distinguish AI recommendations from confirmed facts

For legal, regulatory, financial, employment, safety, or compliance matters, the application should recommend human/professional verification.

This is particularly important for winery compliance topics such as:

Alcohol regulations

Labeling requirements

Employment requirements

Tax

Licensing

Health and safety

Regulatory compliance

20. DATA VALIDATION

Before generating AI responses:

Validate required fields

Prevent empty submissions

Display helpful validation messages

Preserve user-entered information where possible

Do not silently discard user input.

21. DEMO DATA

Populate the application with realistic sample winery data so that the application looks functional immediately.

Example dashboard data:

7 Tasks Due Today

4 Tasks Completed

12 Emails Generated

3 Meetings Summarized

5 Research Requests

18 AI Assistant Sessions

Use realistic winery-related activity in the recent activity feed.

Example:

"Generated distributor follow-up email for 2025 Chardonnay allocation."

"Summarized weekly tasting-room operations meeting."

"Created harvest preparation task plan."

"Analyzed Q1 wine club sales performance."

22. NAVIGATION BEHAVIOUR

Each sidebar item must navigate to a fully functional module.

Do not create navigation items that lead to empty pages.

The user should be able to move between:

Dashboard → Email → Meeting Notes → Task Planner → Research → Chatbot

without losing the overall application state unnecessarily.

The navigation must remain focused on the core productivity functions.

Do not add:

Profile navigation

Account navigation

Settings navigation

Other unnecessary menu items

23. ACCESSIBILITY

Follow modern accessibility practices.

Include:

Proper form labels

Keyboard navigation

Accessible buttons

Appropriate contrast

Visible focus states

Descriptive icons/tooltips

Accessible checkbox controls

24. EXPECTED PROJECT STRUCTURE

The final application must include all of the following:

Dashboard Layout

Sidebar Navigation

Responsive Design for mobile and desktop

Input Sections

Output Sections

AI-generated responses

Professional UI/UX

Responsible AI disclaimer

Functional AI modules

Loading states

Error states

Interactive task completion

Quick Start Tour

Every core function must have appropriate input fields and a clearly defined AI-generated output area.

25. FINAL APPLICATION EXPERIENCE

The finished application should feel like a real AI productivity product for winery professionals.

A winery manager should be able to open the application and immediately understand:

What does this tool do?

How can it save me time?

Where do I start?

The core user journey should be:

Open Application → Quick Start Tour → Dashboard → Select Function → Enter Information → Generate AI Output → Review → Take Action

FINAL QUALITY REQUIREMENT

Before considering the application complete, verify that all of the following are present and functional:

Dashboard

Sidebar navigation

Six core navigation items

No user profile area

No settings area

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner

Input fields for the Task Planner

Mark-as-complete checkbox for every task

Task progress tracking

AI Research Assistant

AI Winery Chatbot

Three prepopulated chatbot prompts

Input fields for every AI function

AI output sections

Loading states for every AI function

Error handling

Mock AI responses if API is unavailable

Lovable AI integration structure

Quick Start Tour

Winery-specific terminology

Winery-specific sample data

Wine-inspired color palette

Professional UI/UX

Responsive desktop design

Responsive mobile design

Responsible AI safeguards

Required footer disclaimer

Accessibility considerations

The final result must be presentation-ready, polished, responsive, and demonstrably useful to winery owners and managers.

The application should clearly demonstrate that AI is being used to solve real-world workplace productivity problems within the winery industry.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/61fc0e18-5e33-4f49-bb68-7b82e36bf72a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
