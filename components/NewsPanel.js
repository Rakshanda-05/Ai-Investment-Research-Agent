// components/NewsPanel.js
//
// WHAT THIS COMPONENT DOES:
// Displays the output of Agent 2 (News Analysis Agent) — a list of recent
// news headlines, each tagged with a sentiment color (green/gray/red).
//
// WHY SENTIMENT COLORS MATTER FOR UX:
// An investor scanning a dashboard quickly needs to spot bad news without
// reading every headline. Color-coding sentiment (instead of just text)
// lets someone scan the panel in 2 seconds and get the gist.

const SENTIMENT_STYLES = {
  positive: "bg-invest/15 text-invest",
  negative: "bg-pass/15 text-pass",
  neutral: "bg-line text-muted",
};

export default function NewsPanel({ news }) {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Recent News
        </p>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase ${
            SENTIMENT_STYLES[news.overallNewsSentiment]
          }`}
        >
          Overall: {news.overallNewsSentiment}
        </span>
      </div>

      {news.recentNews.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          No recent news was found for this company.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {news.recentNews.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 rounded-2xl bg-lilac/5 p-3"
            >
              <span
                className={`mt-0.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase shrink-0 ${
                  SENTIMENT_STYLES[item.sentiment]
                }`}
              >
                {item.sentiment}
              </span>
              <p className="text-sm text-ink/80">{item.headline}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}