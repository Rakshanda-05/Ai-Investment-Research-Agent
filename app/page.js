"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar.js";
import AgentTrail from "../components/AgentTrail.js";
import CompanyOverview from "../components/CompanyOverview.js";
import NewsPanel from "../components/NewsPanel.js";
import StrengthsRisks from "../components/StrengthsRisks.js";
import InvestmentVerdict from "../components/InvestmentVerdict.js";
import ErrorBanner from "../components/ErrorBanner.js";
import BackgroundBlobs from "../components/BackgroundBlobs.js";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  async function handleSearch(companyName) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);

    const stepTimers = [
      setTimeout(() => setCurrentStep(1), 4000),
      setTimeout(() => setCurrentStep(2), 9000),
      setTimeout(() => setCurrentStep(3), 13000),
    ];

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data);
      setCurrentStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      stepTimers.forEach(clearTimeout);
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center gap-8 px-4 py-12 sm:py-16">
      <BackgroundBlobs />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <div className="glass flex items-center gap-2 rounded-full px-4 py-1.5 shadow-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-invest pulse-dot" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            4-agent pipeline · live web research
          </span>
        </div>
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
          AI Investment Research Agent
        </h1>
        <p className="max-w-md text-sm text-muted">
          Enter a company name. Four AI agents will research it, analyze the
          news, weigh the risks, and give you an INVEST or PASS call.
        </p>
      </motion.div>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && <AgentTrail currentStepIndex={currentStep} />}

      {error && <ErrorBanner message={error} />}

      {result && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="flex w-full max-w-3xl flex-col gap-4"
        >
          {[
            <InvestmentVerdict key="verdict" investment={result.investment} />,
            <CompanyOverview key="overview" research={result.research} />,
            <NewsPanel key="news" news={result.news} />,
            <StrengthsRisks key="risk" risk={result.risk} />,
          ].map((child) => (
            <motion.div
              key={child.key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}