// lib/schemas.js
//
// WHAT THIS FILE DOES:
// Defines the exact "shape" of JSON we expect back from each AI agent,
// using Zod (a schema validation library).
//
// WHY THIS FILE EXISTS:
// LLMs generate TEXT. If we just ask GPT-4o "give me the company's strengths"
// in plain English, it might respond in a paragraph, a bulleted list, or with
// random extra commentary — and our React UI would have no reliable way to
// display that. Structured output forces the LLM to respond in a fixed JSON
// shape we define ahead of time, so our frontend always knows exactly which
// fields to expect (company.name, score.value, etc).
//
// LangChain's `.withStructuredOutput()` method uses these Zod schemas to:
// 1. Tell the LLM (via function-calling under the hood) exactly what fields to fill in
// 2. Validate the LLM's response actually matches that shape
// 3. Give us back a clean JS object instead of a raw string we'd have to parse

import { z } from "zod";

// ---------- AGENT 1: Research Agent output ----------
export const researchSchema = z.object({
  companyName: z.string().describe("Official full name of the company"),
  industry: z.string().describe("The primary industry/sector the company operates in"),
  overview: z
    .string()
    .describe("A 3-4 sentence factual overview of what the company does"),
  industryAnalysis: z
    .string()
    .describe("2-3 sentences analyzing the industry's current trends and outlook"),
  foundedYear: z.string().describe("Year founded, or 'Unknown' if not found"),
  headquarters: z.string().describe("City/country of headquarters, or 'Unknown'"),
});

// ---------- AGENT 2: News Analysis Agent output ----------
export const newsAnalysisSchema = z.object({
  recentNews: z
    .array(
      z.object({
        headline: z.string().describe("A short, clear summary of the news item"),
        sentiment: z
          .enum(["positive", "neutral", "negative"])
          .describe("Overall sentiment of this news item for the company"),
      })
    )
    .describe("3-5 recent, relevant news items about the company"),
  overallNewsSentiment: z
    .enum(["positive", "neutral", "negative"])
    .describe("The combined sentiment across all recent news"),
});

// ---------- AGENT 3: Risk Analysis Agent output ----------
export const riskAnalysisSchema = z.object({
  strengths: z
    .array(z.string())
    .describe("3-5 concrete strengths/competitive advantages of the company"),
  risks: z
    .array(z.string())
    .describe("3-5 concrete risks or red flags for an investor to be aware of"),
});

// ---------- AGENT 4: Investment Decision Agent output ----------
export const investmentDecisionSchema = z.object({
  investmentScore: z
    .number()
    .min(0)
    .max(100)
    .describe("A score from 0-100 representing investment attractiveness"),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe("How confident the agent is in this score, based on data quality/availability"),
  recommendation: z
    .enum(["INVEST", "PASS"])
    .describe("Final investment recommendation"),
  reasoning: z
    .string()
    .describe(
      "A clear 4-6 sentence explanation of WHY this score and recommendation were given, referencing the strengths/risks/news"
    ),
});
