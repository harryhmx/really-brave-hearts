"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseQuestion, type ParsedQuestion } from "@/lib/question";
import { renderMarkdown } from "@/lib/markdown";
import { useLoadingTimer } from "@/hooks/use-loading-timer";

const MAX_RETRIES = 2;

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
  const [transitioning, setTransitioning] = useState(false);
  const countdown = useLoadingTimer(transitioning, 5);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parsed: ParsedQuestion | null = useMemo(
    () => parseQuestion(rcQuestion),
    [rcQuestion]
  );

  if (!parsed) {
    return (
      <div className="rounded-md border border-rbh-ink/10 bg-rbh-panel/45 p-6 text-center">
        <p className="text-muted-foreground">No RC question available.</p>
      </div>
    );
  }

  const advanceToCT = () => {
    setTransitioning(true);
    setTimeout(() => router.refresh(), 1500);
  };

  const handleSubmit = async () => {
    if (!selected || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/story/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "rc", answer: selected, retries }),
      });
      const data = await res.json();
      setResult({ correct: data.correct, score: data.score });

      if (data.correct) {
        advanceToCT();
      } else {
        const newRetries = retries + 1;
        setRetries(newRetries);

        if (newRetries >= MAX_RETRIES || data.advanceToCT) {
          advanceToCT();
        } else {
          retryTimerRef.current = setTimeout(() => {
            setSelected(null);
            setResult(null);
          }, 1000);
        }
      }
    } catch {
      setResult({ correct: false });
      retryTimerRef.current = setTimeout(() => {
        setSelected(null);
        setResult(null);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  if (transitioning) {
    return (
      <div className="rounded-md border border-rbh-ink/10 bg-rbh-panel/45 p-8 text-center">
        <div className="flex items-center justify-center gap-2 text-rbh-teal font-medium animate-pulse">
          <Sparkles className="h-6 w-6" />
          {result?.correct
            ? `Correct! +10 points — loading next question (${countdown})`
            : `Don't worry, keep practicing! — loading next question (${countdown})`}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-rbh-ink/10 bg-rbh-panel/45">
      <div className="border-b border-rbh-ink/10 bg-rbh-header px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rbh-gold">STORY CHECKPOINT</p>
        <h2 className="mt-2 text-xl font-bold text-rbh-header-text">Reading Comprehension</h2>
      </div>
      <div className="p-6 space-y-5">
        <div
          className="prose max-w-none text-rbh-ink prose-headings:text-rbh-ink prose-p:text-rbh-ink/80 prose-strong:text-rbh-ink"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(parsed.question) }}
        />

        <div className="space-y-2">
          {parsed.choices.map((c) => {
            const isSelected = selected === c.value;
            const isCorrectAnswer = c.value.toLowerCase() === rcAnswer?.toLowerCase();
            let borderClass =
              "border-rbh-ink/10 hover:border-rbh-teal/50";
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
              borderClass = "border-rbh-teal ring-2 ring-rbh-teal/30";
              bgClass = "bg-rbh-teal/10";
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
                <span className="font-medium text-rbh-ink">
                  {c.label}
                </span>
                {result && result.correct && isCorrectAnswer && (
                  <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-500" />
                )}
                {result && !result.correct && isSelected && (
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

        {result && !result.correct && retries < MAX_RETRIES && !transitioning && (
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <XCircle className="h-5 w-5" />
            Not quite! Try again.
          </div>
        )}

        <Button
          className="w-full h-11 rounded-md border-0 bg-rbh-coral text-white hover:brightness-95"
          onClick={handleSubmit}
          disabled={!selected || loading || !!result}
        >
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Checking..." : "Submit Answer"}
        </Button>
      </div>
    </div>
  );
}
