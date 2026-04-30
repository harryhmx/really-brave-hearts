"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome!</CardTitle>
        <CardDescription>
          Tell us about yourself to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min={5}
              max={100}
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Lexile Level</Label>
            <Input
              id="level"
              type="text"
              placeholder='e.g. "550L", "BR", "1200L+"'
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Saving..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
