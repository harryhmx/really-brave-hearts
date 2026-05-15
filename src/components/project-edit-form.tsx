"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProjectEditForm({
  project,
}: {
  project: {
    id: string;
    title: string;
    description: string | null;
    systemPrompt: string | null;
    conclusionPrompt: string | null;
  };
}) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description ?? "");
  const [systemPrompt, setSystemPrompt] = useState(project.systemPrompt ?? "");
  const [conclusionPrompt, setConclusionPrompt] = useState(project.conclusionPrompt ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/project", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          title: title.trim(),
          description: description.trim() || null,
          systemPrompt: systemPrompt.trim() || null,
          conclusionPrompt: conclusionPrompt.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Update failed");
        setLoading(false);
        return;
      }
      window.location.href = "/story";
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={10}
          className="flex w-full rounded-xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]/30 resize-y font-mono"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="systemPrompt">System Prompt</Label>
        <textarea
          id="systemPrompt"
          rows={10}
          className="flex w-full rounded-xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]/30 resize-y font-mono"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conclusionPrompt">Conclusion Prompt</Label>
        <textarea
          id="conclusionPrompt"
          rows={10}
          className="flex w-full rounded-xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]/30 resize-y font-mono"
          value={conclusionPrompt}
          onChange={(e) => setConclusionPrompt(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-[#ff6b95] to-[#a855f7] text-white border-0 hover:from-[#ff527b] hover:to-[#9333ea] rounded-xl"
        disabled={loading || !title.trim()}
      >
        {loading && <Loader2 className="animate-spin" />}
        {loading ? "Saving..." : "Submit"}
      </Button>
    </form>
  );
}
