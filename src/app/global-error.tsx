"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

function getReadableMessage(error: Error & { digest?: string }) {
  const message = error?.message || "";

  if (message.includes("An error occurred in the Server Components render")) {
    return "A server error occurred while rendering the app. Please refresh and try again.";
  }

  return message || "A critical error occurred. Please refresh and try again.";
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  const message = getReadableMessage(error);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen items-center justify-center px-6 py-16">
          <div className="w-full max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm">
            <h1 className="text-3xl font-semibold">Something went wrong</h1>
            <p className="mt-3 text-sm text-muted-foreground">{message}</p>

            {error?.digest ? (
              <p className="mt-2 text-xs text-muted-foreground">Reference: {error.digest}</p>
            ) : null}

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button onClick={() => reset()}>Try again</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload app
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
