"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoadingTimer } from "@/hooks/use-loading-timer";
import { callbackHref, getSafeCallbackUrl } from "@/lib/auth-redirect";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");
  const [redirectReady, setRedirectReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const safeCallbackUrl = getSafeCallbackUrl(params.get("callbackUrl"));
    queueMicrotask(() => {
      setCallbackUrl(safeCallbackUrl);
      setRedirectReady(true);
      if (params.get("mode") === "sms") {
        router.replace(callbackHref("/sms-verify", safeCallbackUrl));
      }
    });
  }, [router]);

  useEffect(() => {
    if (redirectReady && status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, redirectReady, router, status]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const timer = useLoadingTimer(loading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError("Invalid username or password");
    } else {
      window.location.href = callbackUrl;
    }
  };

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-rbh-paper px-6 py-12 text-rbh-ink">
      <Card className="w-full max-w-sm overflow-visible rounded-md border-0 bg-transparent p-0 ring-0">
        <div className="rounded-md bg-rbh-panel/60 py-4 ring-1 ring-rbh-ink/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Log In</CardTitle>
            <CardDescription>
              Enter your username and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                className="border-rbh-ink/15 bg-white/80 dark:bg-rbh-header/45"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="border-rbh-ink/15 bg-white/80 dark:bg-rbh-header/45"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full rounded-md bg-rbh-coral text-white hover:brightness-95" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {loading ? `Logging in... (${timer})` : "Log In"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Prefer phone number?{" "}
              <Link href={callbackHref("/sms-verify", callbackUrl)} className="text-primary hover:underline">
                SMS Verify
              </Link>
            </p>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
