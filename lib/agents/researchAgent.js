

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llm } from "../llm.js";
import { searchWeb } from "../tavilyTool.js";
import { researchSchema } from "../schemas.js";

const RESEARCH_PROMPT = ChatPromptTemplate.fromTemplate(`
You are a financial research analyst. You have been given raw web search
results about a company. Your job is to extract a clean, factual summary.

Company being researched: {companyName}

Web search results:
{searchResults}

Instructions:
- Base your answer ONLY on the information in the search results above.
- If a piece of information (like founded year) isn't present, say "Unknown".
- Do not invent facts that are not supported by the search results.
- Keep the overview factual and neutral — save opinions for later analysis.
`);

export async function runResearchAgent(companyName) {
  // STEP 1: Tool usage — fetch live information from the web.
  // We run two targeted searches instead of one generic one, because a
  // single broad query tends to return shallow/duplicate results.
  const overviewResults = await searchWeb(
    `${companyName} company overview business model industry`,
    5
  );
  const detailsResults = await searchWeb(
    `${companyName} founded headquarters founded year`,
    3
  );

  const allResults = [...overviewResults, ...detailsResults];

  // If Tavily returned nothing at all (e.g. bad API key, network issue, or
  // a company name that genuinely doesn't exist), we fail early with a
  // clear error instead of letting GPT-4o hallucinate an entire company.
  if (allResults.length === 0) {
  console.log("No web search results found. Falling back to LLM knowledge.");

  allResults.push({
    title: companyName,
    url: "N/A",
    content: `${companyName} is a company. Use your existing knowledge to provide a research summary including business model, industry, headquarters, products, and market position.`,
  });
}

  // Format the search results into a readable block of text for the prompt.
  const searchResultsText = allResults
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.content}\nSource: ${r.url}`)
    .join("\n\n");

  // STEP 2 & 3: Build the prompt and call the LLM with structured output.
  // .withStructuredOutput(schema) is the key LangChain feature here —
  // it forces GPT-4o's response to match our researchSchema exactly.
  const structuredLlm = llm.withStructuredOutput(researchSchema, {
    name: "company_research_summary",
  });

  const chain = RESEARCH_PROMPT.pipe(structuredLlm);

  const result = await chain.invoke({
    companyName,
    searchResults: searchResultsText,
  });

  // STEP 4: Return both the structured result AND the raw sources,
  // so the frontend can show "sources used" for transparency/credibility.
  return {
    ...result,
    sources: allResults.map((r) => r.url).slice(0, 5),
  };
}
