// app/api/research/route.js
//
// WHAT THIS FILE DOES:
// This is the BACKEND entry point. It's a Next.js API Route — meaning it
// runs on the server (Node.js), not in the browser. The frontend sends a
// POST request here with a company name, and this file kicks off the full
// 4-agent LangChain pipeline and sends back the final result as JSON.
//
// WHY THIS FILE EXISTS:
// We can't call OpenAI/Tavily directly from the browser — that would expose
// our secret API keys to anyone who opens dev tools. API routes solve this:
// the API keys stay safely on the server, and the browser only ever talks
// to OUR backend, which then talks to OpenAI/Tavily on its behalf.
//
// HOW IT WORKS:
// 1. Next.js automatically turns this file into the route POST /api/research
// 2. We read the company name from the request body
// 3. We validate it (basic input validation — don't trust client input blindly)
// 4. We run the agent pipeline (the actual AI work happens in lib/orchestrator.js)
// 5. We return the result as JSON, or a clean error message if anything fails

import { runInvestmentResearchPipeline } from "../../../lib/orchestrator.js";

export async function POST(request) {
  try {
    const body = await request.json();
    const companyName = body?.companyName?.trim();

    // Basic input validation — a surprisingly common interview question is
    // "what happens if the user submits an empty form?" This is the answer.
    if (!companyName || companyName.length === 0) {
      return Response.json(
        { error: "Please enter a company name." },
        { status: 400 }
      );
    }

    if (companyName.length > 100) {
      return Response.json(
        { error: "Company name is too long. Please enter a valid company name." },
        { status: 400 }
      );
    }

    // This is where the actual AI agent pipeline runs.
    const result = await runInvestmentResearchPipeline(companyName);

    return Response.json(result, { status: 200 });
  } catch (error) {
    // We log the FULL error on the server for our own debugging,
    // but we send back a SHORT, user-friendly message to the frontend.
    // (Never leak internal stack traces or API error details to the client.)
    console.error("Research pipeline failed:", error);

    return Response.json(
      {
        error:
          error.message?.includes("No search results")
            ? error.message
            : "Something went wrong while researching this company. Please try again.",
      },
      { status: 500 }
    );
  }
}
