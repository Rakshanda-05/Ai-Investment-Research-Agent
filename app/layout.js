import "./globals.css";

// Metadata for the browser tab title and SEO description.
// Next.js App Router reads this automatically — no need for a manual <head> tag.
export const metadata = {
  title: "AI Investment Research Agent",
  description:
    "An AI agent that researches companies and generates INVEST/PASS recommendations using LangChain and GPT-4o.",
};

// RootLayout wraps every single page in the app.
// In the App Router, this file is REQUIRED — it's where <html> and <body> live.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
