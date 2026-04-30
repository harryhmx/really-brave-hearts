"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoadingTimer } from "@/hooks/use-loading-timer";

export default function ProjectCard({
  projectId,
  title,
  description,
}: {
  projectId: string;
  title: string;
  description: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const countdown = useLoadingTimer(loading, 60);

  const handleStart = async () => {
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
      <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] overflow-hidden shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
        <div className="bg-gradient-to-r from-[#ff6b95] to-[#a855f7] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        </div>

        <div className="p-6">
          {description && (
            <p className="text-[#4a148c]/70 dark:text-[#c4a8e8]/60 mb-6 leading-relaxed">
              {description}
            </p>
          )}

          <Button
            className="w-full h-11 bg-gradient-to-r from-[#ff6b95] to-[#a855f7] text-white border-0 hover:from-[#ff527b] hover:to-[#9333ea] shadow-md shadow-pink-200/50 dark:shadow-pink-900/30 rounded-xl"
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
