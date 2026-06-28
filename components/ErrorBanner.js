// components/ErrorBanner.js
//
// WHAT THIS COMPONENT DOES:
// A simple, reusable banner to show error messages (e.g. "company not found",
// "network error") in a consistent, non-scary way.
//
// WHY IT EXISTS:
// The assignment explicitly requires "Error Handling" as a feature. Beyond
// just catching errors in code, the UI needs to actually SHOW the user what
// went wrong instead of a blank screen or a browser console error they'll
// never see.

export default function ErrorBanner({ message }) {
  return (
    <div className="w-full max-w-2xl rounded-3xl bg-pass/10 p-5 shadow-soft">
      <p className="text-sm font-medium text-pass">⚠ {message}</p>
    </div>
  );
}