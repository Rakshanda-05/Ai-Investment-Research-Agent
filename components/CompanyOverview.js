// components/CompanyOverview.js
//
// WHAT THIS COMPONENT DOES:
// Displays the output of Agent 1 (Research Agent) — company name, industry,
// founding info, overview paragraph, and industry analysis.
//
// WHY IT'S A SEPARATE COMPONENT:
// The dashboard has many distinct sections (overview, news, strengths, risks,
// score). Splitting each into its own component file keeps page.js clean and
// makes each section independently testable/reusable — a core React principle.

export default function CompanyOverview({ research }) {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">{research.companyName}</h2>
          <p className="mt-1 inline-block rounded-full bg-invest/10 px-3 py-0.5 text-sm text-invest">
            {research.industry}
          </p>
        </div>
        <div className="text-right text-xs text-muted">
          <p>Founded: {research.foundedYear}</p>
          <p>HQ: {research.headquarters}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Company Overview
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/80">
          {research.overview}
        </p>
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Industry Analysis
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/80">
          {research.industryAnalysis}
        </p>
      </div>

      {research.sources?.length > 0 && (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Sources
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {research.sources.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted underline hover:text-invest truncate block">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}