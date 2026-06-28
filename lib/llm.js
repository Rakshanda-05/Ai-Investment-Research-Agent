
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const llm = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  temperature: 0.2,
  apiKey: process.env.GOOGLE_API_KEY,
  maxRetries: 3,
});

export const llmFast = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  temperature: 0.2,
  apiKey: process.env.GOOGLE_API_KEY,
  maxRetries: 3,
});