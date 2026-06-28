// components/StrengthsRisks.js
//
// WHAT THIS COMPONENT DOES:
// Displays the output of Agent 3 (Risk Analysis Agent) as a two-column
// layout: strengths on the left, risks on the right.
//
// WHY SIDE-BY-SIDE LAYOUT:
// This mirrors how real investment memos and SWOT-style analyses are
// presented — putting pros and cons in direct visual comparison makes it
// faster for a reader to weigh them against each other, rather than
// scrolling between two separate sections.

export default function StrengthsRisks({ risk }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Strengths column */}
      <div className="rounded-3xl bg-card p-6 shadow-soft">
        <p className="text-xs font-medium uppercase tracking-wide text-invest">
          Strengths
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {risk.strengths.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-ink/80">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-invest/15 text-xs font-bold text-invest">
                +
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risks column */}
      <div className="rounded-3xl bg-card p-6 shadow-soft">
        <p className="text-xs font-medium uppercase tracking-wide text-pass">
          Risks
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {risk.risks.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-ink/80">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pass/15 text-xs font-bold text-pass">
                −
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}