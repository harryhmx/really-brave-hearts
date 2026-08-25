"use client";

import { useState, useEffect, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
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
import { useLoadingTimer } from "@/hooks/use-loading-timer";
import { callbackHref, getSafeCallbackUrl } from "@/lib/auth-redirect";

const PHONE_REGEX = /^1[3-9]\d{9}$/;
const COUNTDOWN_SECONDS = 60;

export default function SmsVerifyPage() {
  const { status } = useSession();
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");
  const [redirectReady, setRedirectReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    queueMicrotask(() => {
      setCallbackUrl(getSafeCallbackUrl(params.get("callbackUrl")));
      setRedirectReady(true);
    });
  }, []);

  useEffect(() => {
    if (redirectReady && status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, redirectReady, router, status]);

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const verifyTimer = useLoadingTimer(verifyLoading);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = useCallback(async () => {
    setError("");
    const normalizedPhone = phone.replace(/\s+/g, "");
    if (!PHONE_REGEX.test(normalizedPhone)) {
      setError("Please enter a valid 11-digit phone number");
      return;
    }
    setSendLoading(true);
    try {
      const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: normalizedPhone }),
      });
      const data = await res.json();
      if (!res.ok || data.success !== true) {
        setError(data.message || "Failed to send code");
      } else {
        setCountdown(COUNTDOWN_SECONDS);
      }
    } catch {
      setError("Network error, please try again");
    } finally {
      setSendLoading(false);
    }
  }, [phone]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const normalizedPhone = phone.replace(/\s+/g, "");
    const normalizedCode = code.replace(/\s+/g, "");

    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }
    if (!PHONE_REGEX.test(normalizedPhone)) {
      setError("Please enter a valid 11-digit phone number");
      return;
    }
    if (!normalizedCode) {
      setError("Please enter the verification code");
      return;
    }

    setVerifyLoading(true);
    try {
      const res = await fetch("/api/sms/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: normalizedPhone, verify_code: normalizedCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Verification failed");
        setVerifyLoading(false);
        return;
      }

      const result = await signIn("sms", {
        username,
        phone_number: normalizedPhone,
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to create session");
        setVerifyLoading(false);
      } else {
        window.location.href = callbackUrl;
      }
    } catch {
      setError("Network error, please try again");
      setVerifyLoading(false);
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
            <CardTitle className="text-2xl">SMS Verify</CardTitle>
            <CardDescription>
              Sign in with your phone number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                className="border-rbh-ink/15 bg-white/80 dark:bg-rbh-header/45"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  type="text"
                  className="border-rbh-ink/15 bg-white/80 dark:bg-rbh-header/45"
                  placeholder="Enter verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={sendLoading || countdown > 0}
                  onClick={handleSendCode}
                  className="shrink-0"
                >
                  {sendLoading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : countdown > 0 ? (
                    `Resend (${countdown})`
                  ) : (
                    "Send Code"
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full rounded-md bg-rbh-coral text-white hover:brightness-95" disabled={verifyLoading}>
              {verifyLoading && <Loader2 className="animate-spin" />}
              {verifyLoading
                ? `Verifying... (${verifyTimer})`
                : "Verify"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Switch to password mode?{" "}
              <Link href={callbackHref("/login", callbackUrl)} className="text-primary hover:underline">
                Log In
              </Link>
            </p>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
