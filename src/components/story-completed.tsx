"use client";

import { useState } from "react";
import { Trophy, ArrowRight, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoadingTimer } from "@/hooks/use-loading-timer";

const encouragements = [
  "Keep up the amazing work — every story makes you smarter!",
  "You're becoming a reading superstar!",
  "Well done! Your English skills are growing every day!",
  "Fantastic effort! Keep exploring new stories!",
  "You're on fire! Can't wait to see what you learn next!",
];

export default function StoryCompleted({
  userName,
  projectTitle,
  storyTitle,
  projectId,
  storyDepth,
  score,
}: {
  userName: string;
  projectTitle: string;
  storyTitle: string;
  projectId: string;
  storyDepth: number;
  score: number;
}) {
  const displayName = userName
    ? userName.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
    : "Brave Reader";
  const [encouragement] = useState(() => encouragements[Math.floor(Math.random() * encouragements.length)]);
  const [nextLoading, setNextLoading] = useState(false);
  const [restartLoading, setRestartLoading] = useState(false);
  const nextCountdown = useLoadingTimer(nextLoading, 60);
  const restartCountdown = useLoadingTimer(restartLoading, 60);

  const handleRestart = async () => {
    setRestartLoading(true);
    try {
      await fetch("/api/story/reset", { method: "POST" });
      window.location.href = "/dashboard";
    } catch {
      setRestartLoading(false);
    }
  };

  const handleNextStory = async () => {
    setNextLoading(true);
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          freshStory: true,
          depth: storyDepth + 1,
          parentStoryTitle: storyTitle,
        }),
      });
      if (!res.ok) {
        setNextLoading(false);
        return;
      }
      window.location.href = "/story";
    } catch {
      setNextLoading(false);
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
        <div>
            <h3 className="font-bold text-[#4a148c] dark:text-[#c4a8e8]">{projectTitle}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Great job, <strong className="text-[#ff6b95] dark:text-[#ff9ec5]">{displayName}</strong>! You just finished <strong>&ldquo;{storyTitle}&rdquo;</strong> with a score of <strong>{score}</strong> points. {encouragement}
            </p>
          </div>

        <div className="flex items-center justify-center gap-2 text-[#ffd700] dark:text-[#ffcc00]">
          <span className="font-bold text-lg">Total Score: {score}</span>
        </div>

        <Button
          className="w-full h-11 bg-gradient-to-r from-[#ff6b95] to-[#a855f7] text-white border-0 hover:from-[#ff527b] hover:to-[#9333ea] rounded-xl"
          onClick={handleNextStory}
          disabled={nextLoading || restartLoading}
        >
          {nextLoading ? <Loader2 className="animate-spin" /> : <ArrowRight className="h-4 w-4 mr-1" />}
          {nextLoading ? `Generating next story... (${nextCountdown})` : "Next Story"}
        </Button>

        <Button
          variant="outline"
          className="w-full h-11 rounded-xl"
          onClick={handleRestart}
          disabled={nextLoading || restartLoading}
        >
          {restartLoading ? <Loader2 className="animate-spin" /> : <RotateCcw className="h-4 w-4 mr-1" />}
          {restartLoading ? `Resetting... (${restartCountdown})` : "Restart Story"}
        </Button>
      </div>
    </div>
  );
}
