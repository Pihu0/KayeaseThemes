"use client";

// Root-layout error fallback. This REPLACES the root layout, so it must
// render its own <html>/<body> and import global styles itself.
// (Only used in the rare case the root layout/providers throw.)
import "./globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center bg-background px-4 text-center text-foreground">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
              aria-hidden
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mt-3 max-w-sm text-muted-foreground">
            A critical error occurred. Please reload the page to continue.
          </p>
          <button
            onClick={reset}
            className="mt-8 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
