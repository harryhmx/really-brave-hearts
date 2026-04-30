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

export default function ProjectCard({
  projectId,
  title,
  description,
}: {
  projectId: string;
  title: string;
  description: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedProjectId: projectId }),
      });
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={handleStart} disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Loading..." : "Start"}
        </Button>
      </CardContent>
    </Card>
  );
}
