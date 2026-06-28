// lib/tavilyTool.js
//
// WHAT THIS FILE DOES:
// This is a thin wrapper around the Tavily Search API.
// Tavily is a search engine built specifically for AI agents — it returns
// clean, summarized snippets (instead of raw HTML like Google would),
// which makes it much easier for an LLM to read and use.
//
// WHY THIS FILE EXISTS:
// LLMs like GPT-4o/Gemini have a training cutoff — they don't know about a
// company's LATEST news, stock movement, or recent events. To make our
// agent's research actually current, we need to give it a "tool" that can
// fetch live information from the internet. This file IS that tool.

import { tavily } from "@tavily/core";

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function searchWeb(query, maxResults = 5) {
  try {
    const response = await tavilyClient.search(query, {
      max_results: maxResults,
      search_depth: "advanced",
      include_answer: false,
    });

    return response.results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.content,
    }));
  } catch (error) {
    console.error("Tavily search failed:", error.message);
    return [];
  }
}