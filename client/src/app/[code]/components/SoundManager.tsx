// components/SoundManager.tsx
import { useEffect, useRef } from "react";

type SoundType = "move" | "capture" | "notify" | "lowTime" | "select";

export const useChessSounds = () => {
  const sounds = useRef<Record<SoundType, HTMLAudioElement | null>>({
    move: null,
    capture: null,
    // check: null,
    notify: null,
    lowTime: null,
    select: null
  });

  // Load sounds on mount
  useEffect(() => {
    sounds.current.move = new Audio("/sound/Move.mp3");
    sounds.current.capture = new Audio("/sound/Capture.mp3");
    // sounds.current.check = new Audio("/sounds/check.mp3");
    sounds.current.notify = new Audio("/sound/GenericNotify.mp3");
    sounds.current.lowTime = new Audio("/sound/LowTime.mp3");
    sounds.current.select = new Audio("/sound/Select.mp3");

    // Preload sounds
    Object.values(sounds.current).forEach((sound) => {
      sound?.load();
    });

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(sounds.current).forEach((sound) => {
        sound?.remove();
      });
    };
  }, []);

  const playSound = (type: SoundType, isOpponent = false) => {
    if (!sounds.current[type]) return;

    // Clone the audio element to allow overlapping sounds
    const audio = sounds.current[type]!.cloneNode(true) as HTMLAudioElement;

    // if (isOpponent && type === "move") {
    //   audio.src = "/sounds/move-opponent.mp3";
    // }

    audio.volume = isOpponent ? 0.6 : 1.0;
    audio.play().catch((e) => console.log("Audio play failed:", e));
  };

  return { playSound };
};
