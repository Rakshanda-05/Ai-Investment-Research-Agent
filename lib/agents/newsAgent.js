// lib/agents/newsAgent.js
//
// AGENT 2 OF 4: NEWS ANALYSIS AGENT
//
// INPUT:  company name (string)
// TOOL USED: searchWeb() — this time specifically targeting recent news
// OUTPUT: structured JSON matching newsAnalysisSchema (headlines + sentiment)
//
// WHAT THIS AGENT DOES:
// Looks specifically for RECENT news about the company and judges whether
// each piece of news is good, bad, or neutral for the company.
// This matters for investing because a company can have a great business
// model on paper but be in the middle of a scandal, lawsuit, or leadership
// crisis RIGHT NOW — something a static company overview wouldn't catch.
//
// WHY A SEPARATE AGENT (instead of combining with Research Agent)?
// Separation of concerns. The Research Agent answers "what does this company
// do, historically?" — a fairly stable question. The News Agent answers
// "what's happening with this company RIGHT NOW?" — a fast-changing question.
// Keeping them separate means each agent has ONE clear job, which makes the
// whole pipeline easier to debug, test, and explain.

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmFast } from "../llm.js";
import { searchWeb } from "../tavilyTool.js";
import { newsAnalysisSchema } from "../schemas.js";

const NEWS_PROMPT = ChatPromptTemplate.fromTemplate(`
You are a financial news analyst. Below are recent web search results
about {companyName}'s recent news.

Search results:
{searchResults}

Instructions:
- Pick the 3-5 most relevant and recent news items.
- For EACH news item, label its sentiment as "positive", "neutral", or "negative"
  from an INVESTOR's perspective (e.g. a lawsuit is negative, a strong earnings
  report is positive, a routine product update is neutral).
- Then give an "overallNewsSentiment" that reflects the general mood across all the news.
- If the search results don't contain real news (e.g. just generic company info),
  say so honestly rather than inventing news.
`);

export async function runNewsAgent(companyName) {
  // Tool usage: search specifically for recent news, not general info.
  const newsResults = await searchWeb(`${companyName} latest news 2026`, 6);

  if (newsResults.length === 0) {
    // Graceful fallback: if there's truly no news found, we don't crash —
    // we return a neutral, low-confidence result and let the Investment
    // Decision agent factor in the lack of information later.
    return {
      recentNews: [],
      overallNewsSentiment: "neutral",
    };
  }

  const searchResultsText = newsResults
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.content}`)
    .join("\n\n");

  const structuredLlm = llmFast.withStructuredOutput(newsAnalysisSchema, {
    name: "news_sentiment_summary",
  });

  const chain = NEWS_PROMPT.pipe(structuredLlm);

  const result = await chain.invoke({
    companyName,
    searchResults: searchResultsText,
  });

  return result;
}
