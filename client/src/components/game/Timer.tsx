import { useEffect, useState } from "react";

// Add this component above your GamePage component
export const ChessTimer = ({
  color,
  time,
  active
}: {
  color: "white" | "black";
  time: number;
  active: boolean;
}) => {
  const [displayTime, setDisplayTime] = useState("5:00");

  useEffect(() => {
    const formatTime = (ms: number) => {
      if (ms <= 0) return "0:00";
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    setDisplayTime(formatTime(time));
  }, [time]);

  return (
    <div className={`timer ${color} ${active ? "active" : ""} ${time <= 30000 ? "low-time" : ""}`}>
      <div className="time-display">{displayTime}</div>
    </div>
  );
};
