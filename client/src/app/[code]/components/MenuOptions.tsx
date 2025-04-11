"use client";

import { useToast } from "@/context/ToastContext";
import { Lobby, Session } from "@/types";
import { IconCirclePlus, IconHome } from "@tabler/icons-react";
import { IconProgressX } from "@tabler/icons-react";
import { IconFlag2 } from "@tabler/icons-react";
import { IconMath1Divide2 } from "@tabler/icons-react";
import { IconMenu } from "@tabler/icons-react";
import Link from "next/link";
import React, { useState } from "react";
import { Socket } from "socket.io-client";

interface Menu {
  lobby: Lobby;
  socket: Socket;
  draw?: boolean;
  setDraw?: Function;
}

export function MenuAlert({ socket, lobby, draw, setDraw }: Menu) {
  function declineDrawOffer() {
    const side = lobby.side === "b" ? "black" : "white";
    socket.emit("chat", `${side} declines draw`, true);
    setDraw && setDraw(false);
  }

  function acceptDrawOffer() {
    const side = lobby.side === "b" ? "black" : "white";
    socket.emit("drawoffer", lobby.code, side, true);
    setDraw && setDraw(false);
  }

  return (
    <div className="fixed inset-x-0 top-0">
      {draw && (
        <div role="alert" className="alert alert-vertical">
          <span className="pt-3">Your opponent offers a draw</span>
          <div className="flex gap-3">
            <button onClick={acceptDrawOffer} className="btn btn-sm btn-success btn-soft">
              Accept
            </button>
            <button className="btn btn-sm" onClick={declineDrawOffer}>
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuOptions({ lobby, socket }: Menu) {
  const [resign, setResign] = useState("");
  const { toast } = useToast();

  function abortGame(type?: string) {
    socket.emit("abort", lobby.code, type);
  }

  function sendDrawOffer() {
    const side = lobby.side === "b" ? "black" : "white";
    socket.emit("drawoffer", lobby.code, side, false);

    toast("Draw offer sent", "info");
  }

  function resignClick() {
    if (resign.length) {
      setResign("");
      abortGame("r");
    } else {
      setResign("???");
    }
  }

  return (
    <>
      <div className="fx h-auto">
        <div className="dropdown dropdown-top">
          <div tabIndex={0} role="button" className="m-2">
            <IconMenu />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 gap-3 p-2 shadow-sm"
          >
            <li>
              <Link href={"/"}>
                <IconHome className="size-4" />
                Home
              </Link>
            </li>
            {lobby.endReason && (
              <li>
                <a className="text-success/80">
                  <IconCirclePlus className="size-4" /> New game
                </a>
              </li>
            )}
            {lobby.status === "inPlay" && !lobby.endReason && (
              <>
                <li>
                  <a onClick={sendDrawOffer} className="text-white/50">
                    <IconMath1Divide2 className="size-4" /> Offer Draw
                  </a>
                </li>
                <li>
                  <a onClick={resignClick} className="text-error">
                    <IconFlag2 className="size-4" /> Resign {resign}
                  </a>
                </li>
              </>
            )}
            {lobby.status === "started" && !lobby.endReason && (
              <li>
                <a onClick={() => abortGame("l")} className="text-white/50">
                  <IconProgressX className="size-4" /> Abort
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default MenuOptions;
