"use client";

import { useState } from "react";

export default function SearchBar({ onSearch, isLoading }) {
  const [companyName, setCompanyName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!companyName.trim()) return;
    onSearch(companyName.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-3">
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Enter a company name, e.g. Tesla, Infosys, Zomato..."
        disabled={isLoading}
        className="flex-1 rounded-lg border border-line bg-card px-4 py-3
                   text-sm text-ink placeholder-muted outline-none
                   transition-all duration-200
                   focus:border-accent focus:ring-2 focus:ring-accent/20
                   disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !companyName.trim()}
        className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white
                   transition-all hover:opacity-90 hover:shadow-soft
                   disabled:opacity-40 disabled:cursor-not-allowed
                   whitespace-nowrap"
      >
        {isLoading && (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        {isLoading ? "Researching..." : "Research"}
      </button>
    </form>
  );
}