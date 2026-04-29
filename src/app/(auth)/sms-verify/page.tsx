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
import { RBH_SKILLS_URL } from "@/lib/config";

const PHONE_REGEX = /^1[3-9]\d{9}$/;
const COUNTDOWN_SECONDS = 60;

export default function SmsVerifyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

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
    if (!PHONE_REGEX.test(phone)) {
      setError("Please enter a valid 11-digit phone number");
      return;
    }
    setSendLoading(true);
    try {
      const res = await fetch(`${RBH_SKILLS_URL}/api/auth/sms/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone }),
      });
      const data = await res.json();
      if (!res.ok) {
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

    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }
    if (!PHONE_REGEX.test(phone)) {
      setError("Please enter a valid 11-digit phone number");
      return;
    }
    if (!code.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setVerifyLoading(true);
    try {
      const res = await fetch(`${RBH_SKILLS_URL}/api/auth/sms/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone, verify_code: code }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Verification failed");
        setVerifyLoading(false);
        return;
      }

      const result = await signIn("sms", {
        username,
        phone_number: phone,
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to create session");
        setVerifyLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Network error, please try again");
      setVerifyLoading(false);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm">
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
            <Button type="submit" className="w-full" disabled={verifyLoading}>
              {verifyLoading && <Loader2 className="animate-spin" />}
              {verifyLoading
                ? `Verifying... (${verifyTimer})`
                : "Verify"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Switch to password mode?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
