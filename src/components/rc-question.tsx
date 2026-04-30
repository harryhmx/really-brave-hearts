"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseQuestion, type ParsedQuestion } from "@/lib/question";
import { renderMarkdown } from "@/lib/markdown";
import { useMemo } from "react";

const MAX_RETRIES = 3;

export default function RCQuestion({
  rcQuestion,
  rcAnswer,
}: {
  rcQuestion: string | null;
  rcAnswer: string | null;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    correct: boolean;
    score?: number;
  } | null>(null);
  const [retries, setRetries] = useState(0);

  const parsed: ParsedQuestion | null = useMemo(
    () => parseQuestion(rcQuestion),
    [rcQuestion]
  );

  if (!parsed) {
    return (
      <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] p-6 text-center">
        <p className="text-muted-foreground">No RC question available.</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!selected || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/story/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "rc", answer: selected }),
      });
      const data = await res.json();
      setResult({ correct: data.correct, score: data.score });

      if (data.correct) {
        setTimeout(() => router.refresh(), 1500);
      } else {
        setRetries((prev) => prev + 1);
        if (retries + 1 >= MAX_RETRIES) {
          setTimeout(() => router.refresh(), 1500);
        }
      }
    } catch {
      setResult({ correct: false });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setResult(null);
  };

  const showRetry = result && !result.correct && retries < MAX_RETRIES;
  const showForceAdvance = result && !result.correct && retries >= MAX_RETRIES;

  return (
    <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] overflow-hidden shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
      <div className="bg-gradient-to-r from-[#a855f7] to-[#311b92] px-6 py-4">
        <h2 className="text-xl font-bold text-white">Reading Comprehension</h2>
      </div>
      <div className="p-6 space-y-5">
        <div
          className="prose prose-purple dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(parsed.question) }}
        />

        <div className="space-y-2">
          {parsed.choices.map((c) => {
            const isSelected = selected === c.value;
            const isCorrectAnswer = c.value.toLowerCase() === rcAnswer?.toLowerCase();
            let borderClass =
              "border-pink-100 dark:border-pink-900/30 hover:border-[#a855f7]/50";
            let bgClass = "";

            if (result && result.correct) {
              if (isCorrectAnswer) {
                borderClass = "border-green-400 dark:border-green-500";
                bgClass = "bg-green-50 dark:bg-green-900/20";
              }
            } else if (result && !result.correct) {
              if (isSelected) {
                borderClass = "border-red-400 dark:border-red-500";
                bgClass = "bg-red-50 dark:bg-red-900/20";
              }
            } else if (isSelected) {
              borderClass = "border-[#a855f7] ring-2 ring-[#a855f7]/30";
              bgClass = "bg-purple-50 dark:bg-purple-900/20";
            }

            return (
              <button
                key={c.value}
                onClick={() => {
                  if (!result) setSelected(c.value);
                }}
                disabled={!!result}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${borderClass} ${bgClass}`}
              >
                <span className="font-medium text-[#4a148c] dark:text-[#c4a8e8]">
                  {c.label}
                </span>
                {result && isCorrectAnswer && (
                  <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-500" />
                )}
                {result && isSelected && !result.correct && !isCorrectAnswer && (
                  <XCircle className="inline-block ml-2 h-4 w-4 text-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {result && result.correct && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
            <CheckCircle2 className="h-5 w-5" />
            Correct! +10 points
            {result.score !== undefined && (
              <span className="text-sm text-muted-foreground">
                (Total: {result.score})
              </span>
            )}
          </div>
        )}

        {showRetry && (
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <XCircle className="h-5 w-5" />
            Not quite! Try again.
          </div>
        )}

        {showForceAdvance && (
          <div className="text-muted-foreground">
            <p className="mb-2">Don't worry, keep practicing!</p>
            <Button variant="outline" onClick={() => router.refresh()} className="w-full">
              Continue
            </Button>
          </div>
        )}

        {!result && (
          <Button
            className="w-full h-11 bg-gradient-to-r from-[#ff6b95] to-[#a855f7] text-white border-0 hover:from-[#ff527b] hover:to-[#9333ea] rounded-xl"
            onClick={handleSubmit}
            disabled={!selected || loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Checking..." : "Submit Answer"}
          </Button>
        )}

        {showRetry && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleRetry}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
