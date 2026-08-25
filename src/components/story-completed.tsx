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
  projectId,
  projectSlug,
  score,
}: {
  userName: string;
  projectTitle: string;
  projectId: string;
  projectSlug?: string;
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
      window.location.href = projectSlug ? `/project/${projectSlug}` : "/dashboard";
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
        }),
      });
      if (!res.ok) {
        setNextLoading(false);
        return;
      }
      window.location.href = projectSlug ? `/project/${projectSlug}/learn` : "/story";
    } catch {
      setNextLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-md border border-rbh-ink/10 bg-rbh-panel/45">
      <div className="border-b border-rbh-ink/10 bg-rbh-header px-6 py-5">
        <h2 className="flex items-center gap-2 text-xl font-bold text-rbh-header-text">
          <Trophy className="h-6 w-6" />
          Story Completed!
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
            <h3 className="font-bold text-rbh-ink">{projectTitle}</h3>
              <p className="text-sm text-rbh-ink/65 mt-1">
              Great job, <strong className="text-rbh-coral">{displayName}</strong>! You just completed this story stage with a score of <strong>{score}</strong> points. {encouragement}
            </p>
          </div>

        <div className="flex items-center justify-center gap-2 text-rbh-gold">
          <span className="font-bold text-lg">Total Score: {score}</span>
        </div>

        <Button
          className="w-full h-11 rounded-md border-0 bg-rbh-coral text-white hover:brightness-95"
          onClick={handleNextStory}
          disabled={nextLoading || restartLoading}
        >
          {nextLoading ? <Loader2 className="animate-spin" /> : <ArrowRight className="h-4 w-4 mr-1" />}
          {nextLoading ? `Generating next story... (${nextCountdown})` : "Next Story"}
        </Button>

        <Button
          variant="outline"
          className="w-full h-11 rounded-md"
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
