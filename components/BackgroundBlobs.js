// components/BackgroundBlobs.js
//
// WHAT THIS COMPONENT DOES:
// This component is no longer used. It originally rendered floating
// lavender/pink decorative blobs for an earlier design direction, but the
// project moved to a clean white fintech-style background instead, so
// this component now intentionally renders nothing.
//
// WHY IT STILL EXISTS AS A FILE (instead of being deleted):
// Keeping the file in place with a harmless empty export means nothing
// breaks if it's still imported anywhere — it just renders null and has
// zero visual effect on the page.

export default function BackgroundBlobs() {
  return null;
}