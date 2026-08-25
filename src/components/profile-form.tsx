"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileForm() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [level, setLevel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const ageNum = Number(age);
    if (!age || ageNum < 5 || ageNum > 100) {
      setError("Please enter a valid age (5-100)");
      return;
    }
    if (!level.trim()) {
      setError("Please enter your Lexile Level");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age: ageNum, level: level.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
        setLoading(false);
      } else {
        router.refresh();
      }
    } catch {
      setError("Network error, please try again");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md animate-fade-in-up">
      <div className="rounded-md border border-rbh-ink/10 bg-rbh-panel/45 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rbh-teal/15">
            <UserCircle className="h-8 w-8 text-rbh-teal" />
          </div>
          <h2 className="text-2xl font-bold text-rbh-ink">
            Welcome!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tell us about yourself to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 p-3">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="age" className="text-rbh-ink">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              min={5}
              max={100}
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-rbh-ink">
              Lexile Level
            </Label>
            <Input
              id="level"
              type="text"
              placeholder='e.g. "550L", "BR", "1200L+"'
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-md border-0 bg-rbh-coral text-white hover:brightness-95"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Saving..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
