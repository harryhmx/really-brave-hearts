"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProjectEditForm({
  project,
  redirectTo = "/dashboard",
}: {
  project: {
    id: string;
    title: string;
    description: string | null;
    systemPrompt: string | null;
    conclusionPrompt: string | null;
  };
  redirectTo?: string;
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
      window.location.href = redirectTo;
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
          className="flex w-full resize-y rounded-md border border-rbh-ink/15 bg-rbh-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rbh-teal/30 font-mono"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="systemPrompt">System Prompt</Label>
        <textarea
          id="systemPrompt"
          rows={10}
          className="flex w-full resize-y rounded-md border border-rbh-ink/15 bg-rbh-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rbh-teal/30 font-mono"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conclusionPrompt">Conclusion Prompt</Label>
        <textarea
          id="conclusionPrompt"
          rows={10}
          className="flex w-full resize-y rounded-md border border-rbh-ink/15 bg-rbh-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rbh-teal/30 font-mono"
          value={conclusionPrompt}
          onChange={(e) => setConclusionPrompt(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 rounded-md border-0 bg-rbh-coral text-white hover:brightness-95"
        disabled={loading || !title.trim()}
      >
        {loading && <Loader2 className="animate-spin" />}
        {loading ? "Saving..." : "Submit"}
      </Button>
    </form>
  );
}
