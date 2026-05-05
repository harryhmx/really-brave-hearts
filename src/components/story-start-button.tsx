"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoryStartButton({
  mediaReady = true,
  isConclusion = false,
}: {
  mediaReady?: boolean;
  isConclusion?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/story/phase", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: 1 }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        setError(data.error || `HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  const buttonText = isConclusion
    ? (loading ? "Loading..." : !mediaReady ? "Waiting for story to fully load..." : "Get Life Lesson")
    : (loading ? "Loading..." : !mediaReady ? "Waiting for story to fully load..." : "Answer Questions");

  return (
    <div className="space-y-2">
      <Button
        className="w-full h-11 bg-gradient-to-r from-[#ff6b95] to-[#a855f7] text-white border-0 hover:from-[#ff527b] hover:to-[#9333ea] shadow-md shadow-pink-200/50 dark:shadow-pink-900/30 rounded-xl"
        onClick={handleStart}
        disabled={loading || !mediaReady}
      >
        {loading && <Loader2 className="animate-spin" />}
        {buttonText}
      </Button>
      {!mediaReady && (
        <p className="text-xs text-muted-foreground text-center animate-pulse">
          Story media is being generated, please wait...
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
