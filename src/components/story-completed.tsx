"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoadingTimer } from "@/hooks/use-loading-timer";

export default function StoryCompleted({
  projectTitle,
  projectId,
  score,
}: {
  projectTitle: string;
  projectId: string;
  score: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const countdown = useLoadingTimer(loading, 60);

  const handleNextStory = async () => {
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
    <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] overflow-hidden shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
      <div className="bg-gradient-to-r from-[#ffd700] to-[#ffa500] px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Story Completed!
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffd700] to-[#ffa500] flex items-center justify-center flex-shrink-0">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#4a148c] dark:text-[#c4a8e8]">{projectTitle}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Congratulations! You have successfully completed this story. +20 bonus points!
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[#ffd700] dark:text-[#ffcc00]">
          <span className="font-bold text-lg">Total Score: {score}</span>
        </div>

        <Button
          className="w-full h-11 bg-gradient-to-r from-[#ff6b95] to-[#a855f7] text-white border-0 hover:from-[#ff527b] hover:to-[#9333ea] rounded-xl"
          onClick={handleNextStory}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : <ArrowRight className="h-4 w-4 mr-1" />}
          {loading ? `Generating next story... (${countdown})` : "Next Story"}
        </Button>
      </div>
    </div>
  );
}
