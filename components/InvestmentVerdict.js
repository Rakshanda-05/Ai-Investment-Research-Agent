"use client";

import { useEffect, useState } from "react";

const VERDICT_STYLES = {
  INVEST: {
    text: "text-invest",
    glow: "#0F9D58",
  },
  PASS: {
    text: "text-pass",
    glow: "#D93025",
  },
};

export default function InvestmentVerdict({ investment }) {
  const style = VERDICT_STYLES[investment.recommendation];

  return (
    <div
      className="verdict-glow rounded-3xl bg-card p-7 shadow-soft"
      style={{ "--glow-color": style.glow }}
    >
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Final Recommendation
          </p>
          <p className={`mt-1 font-display text-4xl font-bold tracking-tight ${style.text}`}>
            {investment.recommendation}
          </p>
        </div>

        <div className="flex gap-4">
          <ScoreGauge label="Investment Score" value={investment.investmentScore} />
          <ScoreGauge label="Confidence" value={investment.confidenceScore} />
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Reasoning
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/80">
          {investment.reasoning}
        </p>
      </div>
    </div>
  );
}

function ScoreGauge({ label, value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    const duration = 800;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.round(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    }

    const frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-lilac/10 px-5 py-3 text-center">
      <p className="tabular-nums font-mono text-2xl font-bold text-lilac">
        {displayValue}
      </p>
      <p className="text-[10px] uppercase tracking-widest text-muted">
        {label}
      </p>
    </div>
  );
}