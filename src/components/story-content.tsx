"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { ImageIcon, Volume2 } from "lucide-react";
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

  const needImage = !imageUrl;
  const needAudio = !audioUrl;
  const [polling, setPolling] = useState(needImage || needAudio);
  const notifiedRef = useRef(false);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/story/status?storyId=${storyId}`);
      const data = await res.json();

      if (data.imageReady && data.audioReady) {
        setPolling(false);
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
    const interval = setInterval(checkStatus, 3000);
    checkStatus();
    return () => clearInterval(interval);
  }, [polling, checkStatus]);

  // If server already has both media, no polling needed
  useEffect(() => {
    if (imageUrl && audioUrl) {
      setPolling(false);
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        onMediaReady?.();
      }
    }
  }, [imageUrl, audioUrl, onMediaReady]);

  const showImagePlaceholder = polling && needImage;
  const showAudioPlaceholder = polling && needAudio;

  return (
    <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] overflow-hidden shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
      <div className="bg-gradient-to-r from-[#ff6b95] to-[#a855f7] px-6 py-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      <div className="p-6 space-y-6">
        {showImagePlaceholder ? (
          <ImagePlaceholder />
        ) : imageUrl ? (
          <div className="rounded-xl overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
        ) : null}

        {showAudioPlaceholder ? (
          <AudioPlaceholder />
        ) : audioUrl ? (
          <div className="rounded-xl bg-pink-50 dark:bg-pink-900/10 p-4">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : null}

        <div
          className="prose prose-purple dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

function ImagePlaceholder() {
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="flex flex-col items-center justify-center py-16 space-y-3 animate-pulse bg-pink-50 dark:bg-pink-900/10">
        <ImageIcon className="h-10 w-10 text-[#a855f7]/50" />
        <p className="text-sm text-muted-foreground">Generating illustration...</p>
      </div>
    </div>
  );
}

function AudioPlaceholder() {
  return (
    <div className="rounded-xl bg-pink-50 dark:bg-pink-900/10 p-4">
      <div className="flex items-center justify-center gap-2 py-6 animate-pulse">
        <Volume2 className="h-5 w-5 text-[#a855f7]/50" />
        <p className="text-sm text-muted-foreground">Generating audio...</p>
      </div>
    </div>
  );
}
