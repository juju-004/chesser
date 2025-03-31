"use client";

import { SessionContext } from "@/context/session";
import type { Game } from "@chessu/types";
import { useContext } from "react";

import GamePage from "./GamePage";
import { Session } from "@/types";

export default function GameAuthWrapper({ initialLobby }: { initialLobby: Game }) {
  const session: Session = useContext(SessionContext);

  if (!session?.user || !session.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-2xl font-bold">Loading</div>
        <div className="text-xl">Waiting for authentication...</div>
      </div>
    );
  }

  return <GamePage initialLobby={initialLobby} />;
}
