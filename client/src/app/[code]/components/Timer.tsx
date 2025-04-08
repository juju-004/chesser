"use client";

// components/ChessTimer.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useChessSounds } from "./SoundManager";

interface ChessTimerProps {
  color: "white" | "black";
  initialTime: number;
  active: boolean;
  timerStarted: boolean;
  lowTimeThreshold?: number;
}

export const ChessTimer = ({
  color,
  initialTime,
  active,
  timerStarted,
  lowTimeThreshold = 30000
}: ChessTimerProps) => {
  const [time, setTime] = useState(initialTime);
  const [displayTime, setDisplayTime] = useState("5:00");
  const { playSound } = useChessSounds();
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef(Date.now());
  const lowtimeSound = useRef(false);
  const lastServerTimeRef = useRef(initialTime);
  const isMountedRef = useRef(true);

  // Format time for display
  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // Update the timer display
  const updateTimer = useCallback(() => {
    if (!isMountedRef.current || !timerStarted) return;

    const now = Date.now();
    const elapsed = now - lastUpdateRef.current;

    setTime((prev) => {
      const newTime = Math.max(0, prev - elapsed);
      setDisplayTime(formatTime(newTime));
      return newTime;
    });

    lastUpdateRef.current = now;
    animationRef.current = requestAnimationFrame(updateTimer);
  }, [timerStarted, formatTime]);

  // Handle timer start/stop
  useEffect(() => {
    if (active && timerStarted) {
      lastUpdateRef.current = Date.now();
      animationRef.current = requestAnimationFrame(updateTimer);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, timerStarted, updateTimer]);

  useEffect(() => {
    // Only update if server time differs significantly (>1s)
    if (Math.abs(initialTime - lastServerTimeRef.current) > 1000) {
      setTime(initialTime);
      setDisplayTime(formatTime(initialTime));
      lastUpdateRef.current = Date.now();
      lastServerTimeRef.current = initialTime;
    }

    setDisplayTime(formatTime(initialTime));
    lastServerTimeRef.current = initialTime;
    return () => {
      isMountedRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTime, formatTime]);

  useEffect(() => {
    if (time <= lowTimeThreshold && !lowtimeSound.current) {
      playSound("lowTime");
      lowtimeSound.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayTime]);

  return (
    <div
      className={`timer ${color} ${active && timerStarted ? "active" : ""} ${time <= lowTimeThreshold ? "low-time" : ""}`}
    >
      <div className="time-display">{displayTime}</div>
    </div>
  );
};
