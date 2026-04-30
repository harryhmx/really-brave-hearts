"use client";

import { useMemo } from "react";
import { renderMarkdown } from "@/lib/markdown";

export default function StoryContent({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  const html = useMemo(() => (content ? renderMarkdown(content) : ""), [content]);

  return (
    <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] overflow-hidden shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
      <div className="bg-gradient-to-r from-[#ff6b95] to-[#a855f7] px-6 py-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      <div
        className="p-6 prose prose-purple dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
