"use client";

import { Button } from "@/components/ui/button";

export function LogoutButton({ className }: { className?: string }) {
  const handleLogout = () => {
    const secure = location.protocol === "https:";
    const name = secure ? "__Secure-authjs.session-token" : "authjs.session-token";
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    window.location.href = "/login";
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleLogout}
    >
      Log Out
    </Button>
  );
}
