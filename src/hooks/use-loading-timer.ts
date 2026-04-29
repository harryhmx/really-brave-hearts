"use client";

import { useState, useEffect } from "react";

export function useLoadingTimer(loading: boolean) {
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    if (!loading) {
      setTimer(10);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  return timer > 0 ? `${timer}s` : "waiting";
}
