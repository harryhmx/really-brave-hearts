"use client";

import { useState } from "react";
import { Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoadingTimer } from "@/hooks/use-loading-timer";

export default function ProjectCard({
  projectId,
  title,
  description,
  isAuthenticated = true,
  callbackUrl = "/dashboard",
}: {
  projectId: string;
  title: string;
  description: string | null;
  isAuthenticated?: boolean;
  callbackUrl?: string;
}) {
  const [loading, setLoading] = useState(false);
  const countdown = useLoadingTimer(loading, 60);

  const handleStart = async () => {
    if (!isAuthenticated) {
      window.location.href = `/sms-verify?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      window.location.href = "/story";
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in-up">
      <div className="overflow-hidden rounded-md border border-rbh-ink/10 bg-rbh-panel/45">
        <div className="border-b border-rbh-ink/10 bg-rbh-header px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-rbh-teal/20">
              <BookOpen className="h-5 w-5 text-rbh-gold" />
            </div>
            <h3 className="text-xl font-bold text-rbh-header-text">{title}</h3>
          </div>
        </div>

        <div className="p-6">
          {description && (
            <p className="mb-6 leading-relaxed text-rbh-ink/70">
              {description}
            </p>
          )}

          <Button
            className="w-full h-11 rounded-md border-0 bg-rbh-coral text-white hover:brightness-95"
            onClick={handleStart}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? `Generating your story... (${countdown})` : "Start Story"}
          </Button>

          {loading && (
            <p className="text-xs text-muted-foreground mt-2 text-center animate-pulse">
              Generating a unique story with illustration and audio — this may take a moment
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
