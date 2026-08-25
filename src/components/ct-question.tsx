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
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
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
      <div className="rounded-md border border-rbh-ink/10 bg-rbh-panel/45 p-6 text-center">
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
        body: JSON.stringify({ type: "ct", choice: selected, choiceLabel: selectedLabel }),
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
      <div className="rounded-md border border-rbh-ink/10 bg-rbh-panel/45 p-8 text-center">
        <div className="flex items-center justify-center gap-2 text-rbh-teal font-medium animate-pulse">
          <Sparkles className="h-6 w-6" />
          Great choice! Loading your next adventure...
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-rbh-ink/10 bg-rbh-panel/45">
      <div className="border-b border-rbh-ink/10 bg-rbh-header px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rbh-gold">STORY CHECKPOINT</p>
        <h2 className="mt-2 text-xl font-bold text-rbh-header-text">Critical Thinking</h2>
      </div>
      <div className="p-6 space-y-5">
        <div
          className="prose max-w-none text-rbh-ink prose-headings:text-rbh-ink prose-p:text-rbh-ink/80 prose-strong:text-rbh-ink"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(parsed.question) }}
        />

        <div className="space-y-2">
          {parsed.choices.map((c) => {
            const isSelected = selected === c.value;
            let borderClass =
              "border-rbh-ink/10 hover:border-rbh-coral/60";

            if (isSelected) {
              borderClass = "border-rbh-coral bg-rbh-coral/10";
            }

            return (
              <button
                key={c.value}
                onClick={() => {
                  if (!loading) {
                    setSelected(c.value);
                    setSelectedLabel(c.label);
                  }
                }}
                disabled={loading}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${borderClass}`}
              >
                <span className="font-medium text-rbh-ink">
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
          className="w-full h-11 rounded-md border-0 bg-rbh-coral text-white hover:brightness-95"
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
