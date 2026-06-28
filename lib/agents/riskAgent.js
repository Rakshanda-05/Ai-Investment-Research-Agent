// lib/agents/riskAgent.js
//
// AGENT 3 OF 4: RISK ANALYSIS AGENT
//
// INPUT:  the OUTPUT of Agent 1 (research) AND Agent 2 (news) — NOT a tool call
// TOOL USED: none — this agent is pure reasoning over data the previous
//            two agents already collected. This is intentional and worth
//            explaining: not every agent in a pipeline needs to call a tool.
//            Some agents just REASON over already-gathered information.
// OUTPUT: structured JSON matching riskAnalysisSchema (strengths + risks)
//
// WHAT THIS AGENT DOES:
// Takes everything we know so far (company overview, industry context,
// recent news sentiment) and synthesizes it into a clear list of investment
// strengths and risks — the kind of pros/cons list a real analyst would
// write before making a recommendation.
//
// WHY THIS MATTERS FOR THE PIPELINE:
// This is the "connective tissue" agent. It doesn't gather NEW information —
// it makes sense of what's already been gathered. This mirrors how human
// analyst teams work: one team researches, another tracks news, and a third
// (often more senior) analyst synthesizes both into a risk assessment before
// it ever reaches an investment committee.

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llm } from "../llm.js";
import { riskAnalysisSchema } from "../schemas.js";

const RISK_PROMPT = ChatPromptTemplate.fromTemplate(`
You are a risk analyst at an investment firm. Use the information below to
identify concrete strengths and risks for {companyName}.

COMPANY OVERVIEW:
{overview}

INDUSTRY ANALYSIS:
{industryAnalysis}

RECENT NEWS SENTIMENT: {newsSentiment}
RECENT NEWS HEADLINES:
{newsHeadlines}

Instructions:
- List 3-5 concrete STRENGTHS (competitive advantages, good news, strong fundamentals).
- List 3-5 concrete RISKS (red flags, bad news, industry headwinds, uncertainty).
- Be specific. Avoid vague statements like "the company has some risks."
  Instead say what the actual risk is, e.g. "increased regulatory scrutiny in the EU market."
- If there isn't enough information for 3-5 items, list as many genuine ones as you can find
  rather than padding with generic statements.
`);

export async function runRiskAgent({ research, news }) {
  const newsHeadlinesText =
    news.recentNews.length > 0
      ? news.recentNews
          .map((n) => `- [${n.sentiment.toUpperCase()}] ${n.headline}`)
          .join("\n")
      : "No specific recent news was found.";

  const structuredLlm = llm.withStructuredOutput(riskAnalysisSchema, {
    name: "strengths_and_risks",
  });

  const chain = RISK_PROMPT.pipe(structuredLlm);

  const result = await chain.invoke({
    companyName: research.companyName,
    overview: research.overview,
    industryAnalysis: research.industryAnalysis,
    newsSentiment: news.overallNewsSentiment,
    newsHeadlines: newsHeadlinesText,
  });

  return result;
}
