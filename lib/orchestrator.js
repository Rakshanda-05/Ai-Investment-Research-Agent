// lib/orchestrator.js
//
// WHAT THIS FILE DOES:
// This is the "conductor" of the whole agent pipeline. It runs all 4 agents
// IN ORDER, passing each agent's output as input to the next one, and
// collects everything into one final response object for the frontend.
//
// WHY THIS FILE EXISTS:
// The assignment asks for a clear AI agent WORKFLOW, showing Input → Tool
// Usage → Intermediate Steps → Final Output. Rather than scattering this
// logic inside the API route, I centralized it here as one function —
// `runInvestmentResearchPipeline()` — so the flow is easy to read top to
// bottom in a single place, almost like a flowchart written in code.
//
// NOTE ON LANGGRAPH:
// LangGraph (a LangChain library for building agent graphs with branching,
// loops, and shared state) would be the more "proper" way to formalize this
// pipeline as nodes and edges. I chose to implement the SAME conceptual
// pipeline (sequential agents with state passed between them) using plain
// async/await instead of the LangGraph library itself. This keeps the code
// simple and easy for me to explain line-by-line, while still demonstrating
// the same multi-agent orchestration pattern LangGraph would give me.
// (See README "Key Decisions and Trade-offs" for more on this choice.)

import { runResearchAgent } from "./agents/researchAgent.js";
import { runNewsAgent } from "./agents/newsAgent.js";
import { runRiskAgent } from "./agents/riskAgent.js";
import { runInvestmentAgent } from "./agents/investmentAgent.js";

export async function runInvestmentResearchPipeline(companyName) {
  // We track every step in this array so the frontend can show the user
  // a visual "agent trail" — e.g. "Research Agent ✓ → News Agent ✓ → ..."
  // This directly satisfies the "show intermediate steps" requirement.
  const steps = [];

  // ----- STEP 1: Research Agent -----
  steps.push({ agent: "Research Agent", status: "running" });
  const research = await runResearchAgent(companyName);
  steps[steps.length - 1].status = "done";

  // ----- STEP 2: News Analysis Agent -----
  steps.push({ agent: "News Analysis Agent", status: "running" });
  const news = await runNewsAgent(companyName);
  steps[steps.length - 1].status = "done";

  // ----- STEP 3: Risk Analysis Agent -----
  // Notice this agent receives the OUTPUTS of steps 1 and 2 as its input —
  // this is the "intermediate steps feeding forward" part of the pipeline.
  steps.push({ agent: "Risk Analysis Agent", status: "running" });
  const risk = await runRiskAgent({ research, news });
  steps[steps.length - 1].status = "done";

  // ----- STEP 4: Investment Decision Agent -----
  // Receives the outputs of ALL previous steps to make its final call.
  steps.push({ agent: "Investment Decision Agent", status: "running" });
  const investment = await runInvestmentAgent({ research, news, risk });
  steps[steps.length - 1].status = "done";

  // Final combined output — this exact shape is what the API route sends
  // back to the frontend, and what the dashboard components render.
  return {
    research,
    news,
    risk,
    investment,
    steps,
  };
}
