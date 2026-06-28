"use client";

import { useEffect, useState } from "react";

const AGENTS = [
  {
    label: "Research Agent",
    icon: "01",
    statusLines: [
      "Searching the web for company info...",
      "Reading sources...",
      "Extracting industry context...",
    ],
  },
  {
    label: "News Analysis Agent",
    icon: "02",
    statusLines: [
      "Pulling recent news...",
      "Scoring sentiment per headline...",
      "Summarizing overall mood...",
    ],
  },
  {
    label: "Risk Analysis Agent",
    icon: "03",
    statusLines: [
      "Comparing strengths vs. risks...",
      "Cross-checking news against fundamentals...",
      "Drafting risk list...",
    ],
  },
  {
    label: "Investment Decision Agent",
    icon: "04",
    statusLines: [
      "Weighing all evidence...",
      "Calculating investment score...",
      "Finalizing recommendation...",
    ],
  },
];

export default function AgentTrail({ currentStepIndex }) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-1 rounded-3xl bg-card p-6 shadow-soft">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Agent Pipeline
        </p>
        <p className="font-mono text-[11px] text-muted">
          step {Math.min(currentStepIndex + 1, 4)} / 4
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {AGENTS.map((agent, index) => {
          const isDone = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isQueued = !isDone && !isActive;

          return (
            <AgentRow
              key={agent.label}
              agent={agent}
              isDone={isDone}
              isActive={isActive}
              isQueued={isQueued}
            />
          );
        })}
      </div>
    </div>
  );
}

function AgentRow({ agent, isDone, isActive, isQueued }) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setStatusIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % agent.statusLines.length);
    }, 1600);
    return () => clearInterval(interval);
  }, [isActive, agent.statusLines.length]);

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-3 transition-colors ${
        isActive ? "bg-signal/10 border-glow scan-sweep" : ""
      }`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
          isDone
            ? "bg-invest text-white"
            : isActive
            ? "border-2 border-signal text-signal"
            : "border-2 border-line text-line"
        }`}
      >
        {isDone ? "✓" : isActive ? (
          <span className="spin-slow">◐</span>
        ) : (
          agent.icon
        )}
      </div>

      <div className="flex flex-col">
        <span
          className={`text-sm font-medium ${
            isActive ? "text-ink" : isDone ? "text-muted" : "text-line"
          }`}
        >
          {agent.label}
        </span>
        {isActive && (
          <span className="font-mono text-[11px] text-signal">
            {agent.statusLines[statusIndex]}
            <span className="blink-caret">▍</span>
          </span>
        )}
        {isQueued && (
          <span className="font-mono text-[11px] text-line">queued</span>
        )}
        {isDone && (
          <span className="font-mono text-[11px] text-invest/70">complete</span>
        )}
      </div>
    </div>
  );
}