"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { ImageIcon, Volume2 } from "lucide-react";
import { useLoadingTimer } from "@/hooks/use-loading-timer";
import { renderMarkdown } from "@/lib/markdown";

interface StoryContentProps {
  title: string;
  content: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  storyId: string;
  onMediaReady?: () => void;
}

export default function StoryContent({
  title,
  content,
  imageUrl,
  audioUrl,
  storyId,
  onMediaReady,
}: StoryContentProps) {
  const html = useMemo(() => (content ? renderMarkdown(content) : ""), [content]);

  const [liveImageUrl, setLiveImageUrl] = useState<string | null>(imageUrl ?? null);
  const [liveAudioUrl, setLiveAudioUrl] = useState<string | null>(audioUrl ?? null);
  const [polling, setPolling] = useState(!imageUrl || !audioUrl);
  const [mediaLoading, setMediaLoading] = useState(false);
  const mediaCountdown = useLoadingTimer(mediaLoading, 60);
  const notifiedRef = useRef(false);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/story/status?storyId=${storyId}`);
      const data = await res.json();

      if (data.imageUrl) {
        setLiveImageUrl(data.imageUrl);
      }
      if (data.audioUrl) {
        setLiveAudioUrl(data.audioUrl);
      }

      if (data.imageReady && data.audioReady) {
        setPolling(false);
        setMediaLoading(false);
        if (!notifiedRef.current) {
          notifiedRef.current = true;
          onMediaReady?.();
        }
      }
    } catch {
      // keep polling
    }
  }, [storyId, onMediaReady]);

  useEffect(() => {
    if (!polling) return;
    const loadingTimer = window.setTimeout(() => setMediaLoading(true), 0);
    const interval = setInterval(checkStatus, 3000);
    const initialCheck = window.setTimeout(checkStatus, 0);
    return () => {
      window.clearTimeout(loadingTimer);
      window.clearTimeout(initialCheck);
      clearInterval(interval);
    };
  }, [polling, checkStatus]);

  return (
    <article className="overflow-hidden rounded-md border border-rbh-ink/10 bg-rbh-panel/45">
      <div className="border-b border-rbh-ink/10 bg-rbh-header px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rbh-gold">ADVENTURE ACADEMY</p>
        <h1 className="mt-2 text-2xl font-bold text-rbh-header-text">{title}</h1>
      </div>
      <div className="p-6 space-y-6">
        {liveImageUrl ? (
          <div className="rounded-xl overflow-hidden">
            <img
              src={liveImageUrl}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
        ) : (
          <ImagePlaceholder countdown={mediaCountdown} />
        )}

        {liveAudioUrl ? (
            <div className="rounded-md bg-rbh-teal/10 p-4">
            <audio controls className="w-full">
              <source src={liveAudioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <AudioPlaceholder countdown={mediaCountdown} />
        )}

        <div
          className="prose max-w-none text-rbh-ink prose-headings:text-rbh-ink prose-p:text-rbh-ink/80 prose-strong:text-rbh-ink"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  );
}

function ImagePlaceholder({ countdown }: { countdown: string }) {
  return (
    <div className="rounded-xl overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 space-y-3 animate-pulse bg-rbh-teal/10">
        <ImageIcon className="h-10 w-10 text-rbh-teal/60" />
        <p className="text-sm text-muted-foreground">Generating illustration... ({countdown})</p>
      </div>
    </div>
  );
}

function AudioPlaceholder({ countdown }: { countdown: string }) {
  return (
    <div className="rounded-md bg-rbh-teal/10 p-4">
      <div className="flex items-center justify-center gap-2 py-6 animate-pulse">
        <Volume2 className="h-5 w-5 text-rbh-teal/60" />
        <p className="text-sm text-muted-foreground">Generating audio... ({countdown})</p>
      </div>
    </div>
  );
}
