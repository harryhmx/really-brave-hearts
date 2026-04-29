"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useLoadingTimer } from "@/hooks/use-loading-timer";

export function LogoutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const timer = useLoadingTimer(loading);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`${className || ""} text-white/80 hover:text-white hover:bg-white/10 dark:text-[#311b92]/70 dark:hover:text-[#311b92] dark:hover:bg-[#311b92]/10`}
      disabled={loading}
      onClick={() => {
        setLoading(true);
        signOut({ callbackUrl: "/login" });
      }}
    >
      {loading && <Loader2 className="animate-spin" />}
      {loading ? `Logging out... (${timer})` : "Log Out"}
    </Button>
  );
}
