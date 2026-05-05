"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoryLifeLesson({
  lesson,
}: {
  lesson: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/story/phase", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: 2 }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] overflow-hidden shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
      <div className="bg-gradient-to-r from-[#ffd700] to-[#ff8c00] px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Heart className="h-6 w-6" />
          The moral of the Story
        </h2>
      </div>
      <div className="p-6 space-y-5">
        <p className="text-[#4a148c] dark:text-[#c4a8e8] leading-relaxed">
          {lesson}
        </p>

        <Button
          className="w-full h-11 bg-gradient-to-r from-[#ff6b95] to-[#a855f7] text-white border-0 hover:from-[#ff527b] hover:to-[#9333ea] rounded-xl"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : <ArrowRight className="h-4 w-4 mr-1" />}
          {loading ? "Loading..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
