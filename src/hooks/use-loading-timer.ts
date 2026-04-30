"use client";

import { useState, useEffect } from "react";

export function useLoadingTimer(loading: boolean, duration = 10) {
  const [timer, setTimer] = useState(duration);

  useEffect(() => {
    if (!loading) {
      setTimer(duration);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  return timer > 0 ? `${timer}s` : "waiting";
}
