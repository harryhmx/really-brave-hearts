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
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] p-8 shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b95] to-[#a855f7] flex items-center justify-center mb-4 shadow-md">
            <UserCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#311b92] dark:text-[#d4b8ff]">
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
            <Label htmlFor="age" className="text-[#4a148c] dark:text-[#c4a8e8]">
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
            <Label htmlFor="level" className="text-[#4a148c] dark:text-[#c4a8e8]">
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
            className="w-full h-11 bg-gradient-to-r from-[#ff6b95] to-[#a855f7] text-white border-0 hover:from-[#ff527b] hover:to-[#9333ea] shadow-md shadow-pink-200/50 dark:shadow-pink-900/30 rounded-xl"
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
