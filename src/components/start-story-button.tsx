"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StartStoryButton({
  projectId,
  isAuthenticated,
  callbackUrl,
}: {
  projectId: string;
  isAuthenticated: boolean;
  callbackUrl: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!isAuthenticated) {
      window.location.href = `/sms-verify?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (response.ok) {
        window.location.href = "/story";
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button type="button" onClick={handleStart} disabled={loading} className="h-12 rounded-md bg-rbh-coral px-6 text-white hover:brightness-95">
      {loading && <Loader2 className="animate-spin" />}
      {loading ? "Starting..." : "Start Story"}
    </Button>
  );
}
