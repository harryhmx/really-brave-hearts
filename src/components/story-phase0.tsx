"use client";

import { useState, useCallback } from "react";
import StoryContent from "@/components/story-content";
import StoryStartButton from "@/components/story-start-button";

export default function StoryPhase0({
  title,
  content,
  imageUrl,
  audioUrl,
  storyId,
  isConclusion = false,
}: {
  title: string;
  content: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  storyId: string;
  isConclusion?: boolean;
}) {
  const [mediaReady, setMediaReady] = useState(!!imageUrl && !!audioUrl);

  const handleMediaReady = useCallback(() => {
    setMediaReady(true);
  }, []);

  return (
    <div className="space-y-4">
      <StoryContent
        title={title}
        content={content}
        imageUrl={imageUrl}
        audioUrl={audioUrl}
        storyId={storyId}
        onMediaReady={handleMediaReady}
      />
      <StoryStartButton mediaReady={mediaReady} isConclusion={isConclusion} />
    </div>
  );
}
