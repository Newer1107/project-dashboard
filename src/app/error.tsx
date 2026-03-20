"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

function getReadableMessage(error: Error & { digest?: string }) {
  const message = error?.message || "";

  // Next.js masks server component errors in production.
  if (message.includes("An error occurred in the Server Components render")) {
    return "Something went wrong while loading this page. Please try again.";
  }

  return message || "Something went wrong. Please try again.";
}

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);

  const message = getReadableMessage(error);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">We hit an error</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>

        {error?.digest ? (
          <p className="mt-2 text-xs text-muted-foreground">Reference: {error.digest}</p>
        ) : null}

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.assign("/")}>Go Home</Button>
        </div>
      </div>
    </div>
  );
}
