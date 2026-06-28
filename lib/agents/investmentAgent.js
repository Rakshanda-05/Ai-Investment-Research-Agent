// lib/agents/investmentAgent.js
//
// AGENT 4 OF 4: INVESTMENT DECISION AGENT
//
// INPUT:  the combined outputs of Agents 1, 2, and 3 (research + news + risk)
// TOOL USED: none — this is the final reasoning/decision step
// OUTPUT: structured JSON matching investmentDecisionSchema
//         (investmentScore, confidenceScore, recommendation, reasoning)
//
// WHAT THIS AGENT DOES:
// This is the "decision maker" at the end of the pipeline. It looks at
// EVERYTHING the previous three agents found and makes the final call:
// a 0-100 investment score, a confidence score, and an INVEST/PASS verdict
// with a clear written explanation.
//
// WHY THIS IS THE LAST STEP (not the first):
// A good investment decision should never be made before research is done —
// that would be backwards (deciding first, justifying later). By putting
// this agent LAST and feeding it everything the earlier agents produced,
// the recommendation is actually grounded in the gathered evidence instead
// of being a guess the LLM pulls out of thin air.

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llm } from "../llm.js";
import { investmentDecisionSchema } from "../schemas.js";

const INVESTMENT_PROMPT = ChatPromptTemplate.fromTemplate(`
You are a senior investment analyst making a final call on whether to invest
in {companyName}. You must base your decision ONLY on the evidence below —
do not use any outside knowledge that contradicts it.

COMPANY OVERVIEW:
{overview}

INDUSTRY ANALYSIS:
{industryAnalysis}

NEWS SENTIMENT: {newsSentiment}

STRENGTHS:
{strengths}

RISKS:
{risks}

Instructions for scoring:
- investmentScore (0-100): how attractive this company is as an investment
  right now. 80-100 = strong buy signal, 50-79 = decent but with real
  caveats, 0-49 = weak/risky. Base this on the BALANCE of strengths vs risks
  and news sentiment, not just one factor.
- confidenceScore (0-100): how confident you are in this score. If the
  available information was thin, contradictory, or news was unavailable,
  your confidence should be LOWER even if the score itself seems decent.
- recommendation: "INVEST" if investmentScore >= 60, otherwise "PASS".
- reasoning: explain WHY in 4-6 sentences, explicitly referencing at least
  one strength, one risk, and the news sentiment. Be balanced and honest —
  do not oversell or undersell the company.
`);

export async function runInvestmentAgent({ research, news, risk }) {
  const strengthsText = risk.strengths.map((s) => `- ${s}`).join("\n");
  const risksText = risk.risks.map((r) => `- ${r}`).join("\n");

  const structuredLlm = llm.withStructuredOutput(investmentDecisionSchema, {
    name: "investment_decision",
  });

  const chain = INVESTMENT_PROMPT.pipe(structuredLlm);

  const result = await chain.invoke({
    companyName: research.companyName,
    overview: research.overview,
    industryAnalysis: research.industryAnalysis,
    newsSentiment: news.overallNewsSentiment,
    strengths: strengthsText,
    risks: risksText,
  });

  // Safety net: even though we instruct the LLM on the INVEST/PASS threshold,
  // LLMs can occasionally be inconsistent. We enforce the rule in code too,
  // so the recommendation ALWAYS matches the score exactly — no contradictions.
  const finalRecommendation = result.investmentScore >= 60 ? "INVEST" : "PASS";

  return {
    ...result,
    recommendation: finalRecommendation,
  };
}
