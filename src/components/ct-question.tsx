"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoadingTimer } from "@/hooks/use-loading-timer";
import { parseQuestion, type ParsedQuestion } from "@/lib/question";
import { renderMarkdown } from "@/lib/markdown";

export default function CTQuestion({
  ctQuestion,
}: {
  ctQuestion: string | null;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const countdown = useLoadingTimer(loading, 60);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsed: ParsedQuestion | null = useMemo(
    () => parseQuestion(ctQuestion),
    [ctQuestion]
  );

  if (!parsed) {
    return (
      <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] p-6 text-center">
        <p className="text-muted-foreground">No CT question available.</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!selected || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/story/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ct", choice: selected }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Request failed (${res.status})`);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch {
      setError("Network error, please try again");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] p-8 text-center shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
        <div className="flex items-center justify-center gap-2 text-[#ff6b95] dark:text-[#ff9fbd] font-medium animate-pulse">
          <Sparkles className="h-6 w-6" />
          Great choice! Loading your next adventure...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] overflow-hidden shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
      <div className="bg-gradient-to-r from-[#ff6b95] to-[#a855f7] px-6 py-4">
        <h2 className="text-xl font-bold text-white">Critical Thinking</h2>
      </div>
      <div className="p-6 space-y-5">
        <div
          className="prose prose-purple dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(parsed.question) }}
        />

        <div className="space-y-2">
          {parsed.choices.map((c) => {
            const isSelected = selected === c.value;
            let borderClass =
              "border-pink-100 dark:border-pink-900/30 hover:border-[#ff6b95]/50";

            if (isSelected) {
              borderClass = "border-[#ff6b95] bg-pink-50 dark:bg-pink-900/20";
            }

            return (
              <button
                key={c.value}
                onClick={() => {
                  if (!loading) setSelected(c.value);
                }}
                disabled={loading}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${borderClass}`}
              >
                <span className="font-medium text-[#4a148c] dark:text-[#c4a8e8]">
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Button
          className="w-full h-11 bg-gradient-to-r from-[#ff6b95] to-[#a855f7] text-white border-0 hover:from-[#ff527b] hover:to-[#9333ea] rounded-xl"
          onClick={handleSubmit}
          disabled={!selected || loading}
        >
          {loading && <Loader2 className="animate-spin" />}
          {loading ? `Generating next chapter... (${countdown})` : "Choose Your Path"}
        </Button>

        {loading && (
          <p className="text-xs text-muted-foreground mt-2 text-center animate-pulse">
            Creating your next adventure with illustration and audio — this may take a moment
          </p>
        )}
      </div>
    </div>
  );
}
