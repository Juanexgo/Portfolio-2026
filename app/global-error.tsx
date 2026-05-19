"use client";

// `global-error` replaces the root layout, so `next/link` can't be used here.
/* eslint-disable @next/next/no-html-link-for-pages */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#06080d",
          color: "#e6e8ec",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#9aa3b2",
            }}
          >
            Unexpected error
          </div>
          <h1
            style={{
              marginTop: 16,
              fontSize: 28,
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Something broke on this page.
          </h1>
          <p
            style={{
              marginTop: 12,
              color: "#9aa3b2",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            The error has been logged. You can try again, or head back to the
            homepage.
          </p>
          {error.digest ? (
            <div
              style={{
                marginTop: 16,
                fontFamily: "ui-monospace, monospace",
                fontSize: 11,
                color: "#6b7280",
              }}
            >
              ref: {error.digest}
            </div>
          ) : null}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 8,
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                background: "#5fb4f0",
                color: "#06080d",
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                background: "transparent",
                color: "#e6e8ec",
                fontWeight: 500,
                fontSize: 14,
                border: "1px solid #2a2f3a",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
