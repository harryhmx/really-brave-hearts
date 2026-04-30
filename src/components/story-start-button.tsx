"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoryStartButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await fetch("/api/story/phase", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: 1 }),
      });
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      className="w-full h-11 bg-gradient-to-r from-[#ff6b95] to-[#a855f7] text-white border-0 hover:from-[#ff527b] hover:to-[#9333ea] shadow-md shadow-pink-200/50 dark:shadow-pink-900/30 rounded-xl"
      onClick={handleStart}
      disabled={loading}
    >
      {loading && <Loader2 className="animate-spin" />}
      {loading ? "Loading..." : "Answer Questions"}
    </Button>
  );
}
