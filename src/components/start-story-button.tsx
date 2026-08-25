"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StartStoryButton({
  projectId,
  projectSlug,
  isAuthenticated,
  callbackUrl,
}: {
  projectId: string;
  projectSlug?: string;
  isAuthenticated: boolean;
  callbackUrl: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!isAuthenticated) {
      window.location.href = `/sms-verify?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (response.ok) {
        window.location.href = projectSlug ? `/project/${projectSlug}/learn` : "/story";
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Unable to start the story");
        setLoading(false);
      }
    } catch {
      setError("Network error, please try again");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <p role="alert" className="max-w-md rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}
      <Button type="button" onClick={handleStart} disabled={loading} className="h-12 rounded-md bg-rbh-coral px-6 text-white hover:brightness-95">
        {loading && <Loader2 className="animate-spin" />}
        {loading ? "Starting..." : "Start Story"}
      </Button>
    </div>
  );
}
