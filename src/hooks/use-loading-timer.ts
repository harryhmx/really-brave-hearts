"use client";

import { useState, useEffect } from "react";

export function useLoadingTimer(loading: boolean, duration = 10) {
  const [timer, setTimer] = useState(duration);

  useEffect(() => {
    if (!loading) {
      const resetTimer = window.setTimeout(() => setTimer(duration), 0);
      return () => window.clearTimeout(resetTimer);
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, loading]);

  return timer > 0 ? `${timer}s` : "waiting";
}
