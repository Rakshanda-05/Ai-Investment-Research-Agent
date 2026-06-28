# AI Investment Research Agent

A small AI product that researches a company and gives you an **INVEST / PASS** call, backed by live web research and a 4-step AI agent pipeline built with LangChain.js and GPT-4o.

Built as a project for the AI Engineer Intern role at InsideIIM, to demonstrate practical skills in React, Node.js, LangChain, and AI product development — not just theory.

---

## 1. Project Overview

You type a company name (e.g. "Tesla" or "Zomato") and hit **Research**. Behind the scenes, four AI agents run one after another:

1. **Research Agent** — searches the web and builds a factual company overview
2. **News Analysis Agent** — finds recent news and tags each item's sentiment
3. **Risk Analysis Agent** — synthesizes the above into strengths and risks
4. **Investment Decision Agent** — scores the company and gives a final INVEST/PASS verdict with reasoning

The result is shown on a dashboard with the company overview, recent news, strengths, risks, an investment score, a confidence score, and a written explanation of *why*.

This isn't meant to be real financial advice — it's a demonstration of how to design and build a multi-step AI agent product, end to end, with a real frontend and backend.

---

## 2. Architecture

```
┌─────────────┐      POST /api/research       ┌──────────────────────┐
│   Browser    │ ─────────────────────────────▶│   Next.js API Route   │
│ (React UI)   │                                │  app/api/research/    │
└─────────────┘ ◀───────────────────────────── │      route.js         │
       ▲             JSON result / error        └───────────┬──────────┘
       │                                                     │
       │                                          calls orchestrator
       │                                                     ▼
       │                                        ┌────────────────────────┐
       │                                        │   lib/orchestrator.js   │
       │                                        │  (runs agents in order) │
       │                                        └────────────┬───────────┘
       │                                                      │
       │              ┌───────────────┬───────────────┬───────┴────────┐
       │              ▼               ▼               ▼                ▼
       │      ┌───────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
       │      │ Research Agent │ │ News Agent  │ │ Risk Agent  │ │ Investment   │
       │      │ (uses Tavily)  │ │ (Tavily)    │ │ (reasoning) │ │ Agent        │
       │      └───────┬────────┘ └──────┬──────┘ └─────────────┘ └──────────────┘
       │              │                 │
       │              ▼                 ▼
       │      ┌──────────────────────────────┐
       │      │   Tavily Search API (web)     │
       │      └──────────────────────────────┘
       │
       │      All 4 agents call GPT-4o (via @langchain/openai)
       │      using structured output (Zod schemas) so every
       │      response comes back as predictable JSON.
       └────────────────────────────────────────────────────────
```

Each agent is a plain async function in `lib/agents/`. The `orchestrator.js` file calls them in sequence, passing each agent's output as input to the next — this is the "agent workflow" with intermediate steps the assignment asks for.

---

## 3. Features

- Company search with a clean input + Research button
- 4-agent AI pipeline (Research → News → Risk → Investment Decision)
- Live web search via Tavily (not just GPT's static training data)
- Structured, predictable JSON output from every agent (via Zod schemas)
- Investment Score (0–100) and a separate Confidence Score
- Final INVEST / PASS recommendation, computed deterministically from the score
- Written reasoning explaining the verdict
- Visual agent pipeline tracker (shows which step is currently running)
- Source links shown for transparency
- Error handling for empty input, bad company names, and API failures
- Dark, dashboard-style UI built with Tailwind CSS

---

## 4. Workflow (step by step)

1. User types a company name and clicks **Research**
2. Frontend sends a `POST` request to `/api/research` with `{ companyName }`
3. The API route validates the input and calls `runInvestmentResearchPipeline()`
4. **Research Agent** searches Tavily for company info → asks GPT-4o to extract a structured overview
5. **News Analysis Agent** searches Tavily for recent news → asks GPT-4o-mini to tag sentiment per headline
6. **Risk Analysis Agent** takes the outputs of steps 4 & 5 → asks GPT-4o to list strengths and risks
7. **Investment Decision Agent** takes everything so far → asks GPT-4o for a score, confidence, and reasoning
8. The recommendation (INVEST/PASS) is **recalculated in plain code** from the score, so it's never inconsistent with the number
9. The full result is sent back as JSON and rendered across the dashboard components

---

## 5. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js (App Router) + React | Modern standard, server + client components |
| Styling | Tailwind CSS | Fast to build a custom dark dashboard UI |
| Backend | Next.js API Routes (Node.js) | Keeps API keys server-side, no separate backend needed |
| AI orchestration | LangChain.js (`@langchain/core`, `@langchain/openai`) | Prompt templates, structured output, composable chains |
| LLM | OpenAI GPT-4o / GPT-4o-mini | Reasoning + structured JSON generation |
| Web research | Tavily Search API | Clean, LLM-friendly search results (not raw HTML) |
| Validation | Zod | Defines and enforces the JSON shape of every agent's output |
| Deployment | Vercel | Native Next.js hosting, zero-config |

---

## 6. Setup Instructions

### Prerequisites
- Node.js 18+ installed
- An OpenAI API key ([platform.openai.com](https://platform.openai.com/api-keys))
- A Tavily API key ([tavily.com](https://tavily.com) — free tier is enough for testing)

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd ai-investment-research-agent

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# then open .env.local and paste in your real API keys

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and try searching a company.

---

## 7. API Keys Required

| Key | Where to get it | Used for |
|---|---|---|
| `OPENAI_API_KEY` | platform.openai.com | All 4 agents' LLM calls (GPT-4o / GPT-4o-mini) |
| `TAVILY_API_KEY` | tavily.com | Live web search for Research & News agents |

Both go in `.env.local` (never commit this file — it's already in `.gitignore`).

---

## 8. Running Locally

```bash
npm run dev
```

Runs on `http://localhost:3000` with hot reload. Try a well-known company first (like "Apple" or "Infosys") since they have more web coverage for Tavily to find.

---

## 9. Deployment on Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import your GitHub repo
3. Vercel auto-detects Next.js — no build config needed
4. Add your environment variables in **Project Settings → Environment Variables**:
   - `OPENAI_API_KEY`
   - `TAVILY_API_KEY`
5. Click Deploy

That's it — Vercel handles the build and gives you a live URL.

---

## 10. Sample Output

**Input:** `Tesla`

**Output (abridged):**

> **Recommendation:** INVEST
> **Investment Score:** 74 / 100
> **Confidence Score:** 68 / 100
>
> **Reasoning:** Tesla maintains a strong position in the EV market with continued growth in deliveries and energy storage. Recent news sentiment is mixed — leadership commentary has drawn both support and criticism, and increased EV competition from Chinese manufacturers is a genuine risk. However, its brand strength, charging network, and diversification into energy products support a positive outlook, balanced against valuation concerns and regulatory scrutiny in some markets.

(Actual output will vary by run since it depends on live news at the time of the search.)

---

## 11. Key Decisions and Trade-offs

**Why 4 separate agents instead of 1 big prompt?**
Each agent has one clear job (research, news, risk, decision). This makes the system easier to debug — if the final score looks wrong, I can check each step's output individually instead of guessing what went wrong inside one giant prompt.

**Why plain async/await instead of the LangGraph library?**
LangGraph is built for graphs with branching, loops, and shared state — useful when an agent needs to make decisions about its own next step (e.g., "if confidence is low, re-search"). My pipeline is strictly linear (always Research → News → Risk → Decision), so a simple orchestrator function gives the same multi-agent structure without an abstraction I'd have to defend without using its real benefits. If I extend this project, LangGraph is the natural next step — see Future Improvements.

**Why recompute the INVEST/PASS label in code instead of trusting the LLM's own label?**
LLMs generate the score and the recommendation as separate pieces of text — there's no guarantee they're always consistent (e.g., it could say 72 but write "PASS"). Recomputing `recommendation` from the numeric score in plain JavaScript removes that risk entirely.

**Why two different models (GPT-4o and GPT-4o-mini)?**
Not every step needs the most powerful model. News sentiment tagging is a simpler task than deep company analysis, so I used the cheaper, faster `gpt-4o-mini` there and reserved full `gpt-4o` for the Research and Investment Decision agents, where more careful reasoning matters.

**Why Zod + structured output instead of asking the LLM to "return JSON" in plain text?**
Asking an LLM to "respond in JSON" in plain text still risks malformed output (trailing commas, extra commentary, etc.). LangChain's `.withStructuredOutput()` uses OpenAI's function-calling under the hood, which is far more reliable than string-parsing a hope-it's-valid JSON blob.

**Why is the agent progress tracker simulated with timers instead of truly live?**
The backend currently runs all 4 agents in a single request/response cycle for simplicity. A fully "live" progress bar would need streaming (Server-Sent Events or similar) from the backend. I chose the simpler approach since the full pipeline only takes 15-20 seconds, and noted this as a clear next improvement below.

---

## 12. Future Improvements

- Stream real-time progress from the backend (SSE) instead of simulating it on the frontend
- Migrate the orchestrator to LangGraph once the pipeline needs branching (e.g., re-running research if confidence is too low)
- Add a "compare two companies" mode
- Cache recent results (e.g. in Redis or Vercel KV) so re-searching the same company within an hour doesn't re-call the LLM/Tavily
- Add basic financial data (stock price, market cap) via a finance API like Alpha Vantage, alongside the qualitative analysis
- Add automated tests for the agent functions using mocked LLM responses

---

## 13. Challenges Faced

- Getting the LLM's output to reliably match a fixed JSON shape took some trial and error before I used Zod + `withStructuredOutput()` instead of just asking for JSON in plain text.
- Balancing how much raw search content to feed into each prompt — too much and it gets expensive/slow, too little and the agent doesn't have enough to work with. I settled on a fixed number of search results per agent (5-6) as a practical middle ground.
- Making sure the final recommendation always matched the numeric score, which is why I moved that specific piece of logic out of the LLM and into plain code.

---

## 14. Learnings

This project taught me that "AI engineering" is less about prompting and more about **system design around an LLM** — deciding what each agent's job is, how data flows between them, how to handle a tool (Tavily) failing gracefully, and how to make an inherently unpredictable text generator produce something a frontend can render reliably. The actual prompts were the easy part; the architecture around them was where most of the thinking went.

---

## Project Structure

```
ai-investment-research-agent/
├── app/
│   ├── api/research/route.js      # Backend API endpoint
│   ├── layout.js                  # Root layout (App Router requirement)
│   ├── page.js                    # Homepage — all UI state lives here
│   └── globals.css                # Tailwind + global styles
├── components/
│   ├── SearchBar.js                # Company input + Research button
│   ├── AgentTrail.js               # Visual pipeline progress tracker
│   ├── CompanyOverview.js          # Agent 1 output display
│   ├── NewsPanel.js                # Agent 2 output display
│   ├── StrengthsRisks.js           # Agent 3 output display
│   ├── InvestmentVerdict.js        # Agent 4 output display (hero section)
│   └── ErrorBanner.js              # Error message UI
├── lib/
│   ├── agents/
│   │   ├── researchAgent.js        # Agent 1
│   │   ├── newsAgent.js            # Agent 2
│   │   ├── riskAgent.js            # Agent 3
│   │   └── investmentAgent.js      # Agent 4
│   ├── orchestrator.js             # Runs all 4 agents in sequence
│   ├── llm.js                      # Shared GPT-4o / GPT-4o-mini setup
│   ├── schemas.js                  # Zod schemas for structured output
│   └── tavilyTool.js               # Web search tool wrapper
├── .env.example                    # Template for required API keys
├── tailwind.config.js
├── next.config.js
└── package.json
```
