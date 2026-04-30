"use client";

import { useMemo } from "react";
import { renderMarkdown } from "@/lib/markdown";

export default function StoryContent({
  title,
  content,
  imageUrl,
  audioUrl,
}: {
  title: string;
  content: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
}) {
  const html = useMemo(() => (content ? renderMarkdown(content) : ""), [content]);

  return (
    <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] overflow-hidden shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
      <div className="bg-gradient-to-r from-[#ff6b95] to-[#a855f7] px-6 py-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      <div className="p-6 space-y-6">
        {imageUrl && (
          <div className="rounded-xl overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {audioUrl && (
          <div className="rounded-xl bg-pink-50 dark:bg-pink-900/10 p-4">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div
          className="prose prose-purple dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
