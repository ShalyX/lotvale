"use client";
import Link from "next/link";
export default function BusinessError({ reset }: { reset: () => void }) {
  return (
    <main className="business-shell">
      <h1>Your workspace couldn’t be loaded.</h1>
      <p>
        Your cloud purchases have not been replaced. Try loading the workspace
        again.
      </p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>
      <Link href="/app?sample=1">Open the sample purchase</Link>
    </main>
  );
}
