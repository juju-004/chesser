"use client";
// TODO: restructure, i could use some help with this :>

import { IconChevronLeft, IconChevronRight, IconMenu } from "@tabler/icons-react";

import type { FormEvent, KeyboardEvent } from "react";

import { SessionContext } from "@/context/session";
import { useContext, useEffect, useReducer, useRef, useState } from "react";

import type { Message } from "@/types";
import type { Game } from "@chessu/types";

import type { Move, Square } from "chess.js";
import { Chess } from "chess.js";
import type { ClearPremoves } from "react-chessboard";
import { Chessboard } from "react-chessboard";

import { API_URL } from "@/config";
import { io } from "socket.io-client";

import { lobbyReducer, squareReducer } from "./reducers";
import { initSocket } from "./socketEvents";
import { syncPgn, syncSide } from "./utils";
import { IconMessage2 } from "@tabler/icons-react";
import { IconSend2 } from "@tabler/icons-react";
import { CopyLinkButton } from "./CopyLink";

const socket = io(API_URL, { withCredentials: true, autoConnect: false });

export default function GamePage({ initialLobby }: { initialLobby: Game }) {
  const session = useContext(SessionContext);

  const [lobby, updateLobby] = useReducer(lobbyReducer, {
    ...initialLobby,
    actualGame: new Chess(),
    side: "s"
  });

  const [customSquares, updateCustomSquares] = useReducer(squareReducer, {
    options: {},
    lastMove: {},
    rightClicked: {},
    check: {}
  });

  const [moveFrom, setMoveFrom] = useState<string | Square | null>(null);
  const [boardWidth, setBoardWidth] = useState(480);
  const chessboardRef = useRef<ClearPremoves>(null);

  const [navFen, setNavFen] = useState<string | null>(null);
  const [navIndex, setNavIndex] = useState<number | null>(null);

  const [playBtnLoading, setPlayBtnLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const chatListRef = useRef<HTMLUListElement>(null);
  const moveListRef = useRef<HTMLDivElement>(null);

  const [abandonSeconds, setAbandonSeconds] = useState(60);
  useEffect(() => {
    if (
      lobby.side === "s" ||
      lobby.endReason ||
      lobby.winner ||
      !lobby.pgn ||
      !lobby.white ||
      !lobby.black ||
      (lobby.white.id !== session?.user?.id && lobby.black.id !== session?.user?.id)
    )
      return;

    let interval: number;
    if (!lobby.white?.connected || !lobby.black?.connected) {
      setAbandonSeconds(60);
      interval = Number(
        setInterval(() => {
          if (abandonSeconds === 0 || (lobby.white?.connected && lobby.black?.connected)) {
            clearInterval(interval);
            return;
          }
          setAbandonSeconds((s) => s - 1);
        }, 1000)
      );
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobby.black, lobby.white, lobby.black?.disconnectedOn, lobby.white?.disconnectedOn]);

  useEffect(() => {
    if (!session?.user || !session.user?.id) return;
    socket.connect();

    window.addEventListener("resize", handleResize);
    handleResize();
    setBoardWidth(window.innerWidth);

    if (lobby.pgn && lobby.actualGame.pgn() !== lobby.pgn) {
      syncPgn(lobby.pgn, lobby, { updateCustomSquares, setNavFen, setNavIndex });
    }

    syncSide(session.user, undefined, lobby, { updateLobby });

    initSocket(session.user, socket, lobby, {
      updateLobby,
      addMessage,
      updateCustomSquares,
      makeMove,
      setNavFen,
      setNavIndex
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.removeAllListeners();
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto scroll down when new message is added
  useEffect(() => {
    const chatList = chatListRef.current;
    if (!chatList) return;
    chatList.scrollTop = chatList.scrollHeight;
  }, [chatMessages]);

  // auto scroll for moves
  useEffect(() => {
    const activeMoveEl = document.getElementById("activeNavMove");
    const moveList = moveListRef.current;
    if (!activeMoveEl || !moveList) return;
    moveList.scrollTop = activeMoveEl.offsetTop;
  });

  useEffect(() => {
    updateTurnTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobby]);

  function updateTurnTitle() {
    if (lobby.side === "s" || !lobby.white?.id || !lobby.black?.id) return;

    if (!lobby.endReason && lobby.side === lobby.actualGame.turn()) {
      document.title = "(your turn) chessu";
    } else {
      document.title = "chessu";
    }
  }

  function handleResize() {
    setBoardWidth(window.innerWidth);
    // if (window.innerWidth >= 1920) {
    //   setBoardWidth(580);
    // } else if (window.innerWidth >= 1536) {
    //   setBoardWidth(540);
    // } else if (window.innerWidth >= 768) {
    //   setBoardWidth(480);
    // } else {
    // }
  }

  // Chat start
  function addMessage(message: Message) {
    setChatMessages((prev) => [...prev, message]);
  }

  function sendChat(message: string) {
    if (!session?.user) return;

    socket.emit("chat", message);
    addMessage({ author: session.user, message });
  }

  function chatKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      if (!input.value || input.value.length == 0) return;
      sendChat(input.value);
      input.value = "";
    }
  }

  function chatClickSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const input = target.elements.namedItem("chatInput") as HTMLInputElement;
    if (!input.value || input.value.length == 0) return;
    sendChat(input.value);
    input.value = "";
  }
  // Chat end

  //
  function makeMove(m: { from: string; to: string; promotion?: string }) {
    try {
      const result = lobby.actualGame.move(m);

      if (result) {
        setNavFen(null);
        setNavIndex(null);
        updateLobby({
          type: "updateLobby",
          payload: { pgn: lobby.actualGame.pgn() }
        });
        updateTurnTitle();
        let kingSquare = undefined;
        if (lobby.actualGame.inCheck()) {
          const kingPos = lobby.actualGame.board().reduce((acc, row, index) => {
            const squareIndex = row.findIndex(
              (square) => square && square.type === "k" && square.color === lobby.actualGame.turn()
            );
            return squareIndex >= 0 ? `${String.fromCharCode(squareIndex + 97)}${8 - index}` : acc;
          }, "");
          kingSquare = {
            [kingPos]: {
              background: "radial-gradient(red, rgba(255,0,0,.4), transparent 70%)",
              borderRadius: "50%"
            }
          };
        }
        updateCustomSquares({
          lastMove: {
            [result.from]: { background: "rgba(255, 255, 0, 0.4)" },
            [result.to]: { background: "rgba(255, 255, 0, 0.4)" }
          },
          options: {},
          check: kingSquare
        });
        return true;
      } else {
        throw new Error("Invalid move");
      }
    } catch (err) {
      updateCustomSquares({
        options: {}
      });
      return false;
    }
  }

  function isDraggablePiece({ piece }: { piece: string }) {
    return piece.startsWith(lobby.side) && !lobby.endReason && !lobby.winner;
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (lobby.side === "s" || navFen || lobby.endReason || lobby.winner) return false;

    // premove
    if (lobby.side !== lobby.actualGame.turn()) return true;

    const moveDetails = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    };

    const move = makeMove(moveDetails);
    if (!move) return false; // illegal move
    socket.emit("sendMove", moveDetails);
    return true;
  }

  function getMoveOptions(square: Square) {
    const moves = lobby.actualGame.moves({
      square,
      verbose: true
    }) as Move[];
    if (moves.length === 0) {
      return;
    }

    const newSquares: {
      [square: string]: { background: string; borderRadius?: string };
    } = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          lobby.actualGame.get(move.to as Square) &&
          lobby.actualGame.get(move.to as Square)?.color !== lobby.actualGame.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%"
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)"
    };
    updateCustomSquares({ options: newSquares });
  }

  function onPieceDragBegin(_piece: string, sourceSquare: Square) {
    if (lobby.side !== lobby.actualGame.turn() || navFen || lobby.endReason || lobby.winner) return;

    getMoveOptions(sourceSquare);
  }

  function onPieceDragEnd() {
    updateCustomSquares({ options: {} });
  }

  function onSquareClick(square: Square) {
    updateCustomSquares({ rightClicked: {} });
    if (lobby.side !== lobby.actualGame.turn() || navFen || lobby.endReason || lobby.winner) return;

    function resetFirstMove(square: Square) {
      setMoveFrom(square);
      getMoveOptions(square);
    }

    // from square
    if (moveFrom === null) {
      resetFirstMove(square);
      return;
    }

    const moveDetails = {
      from: moveFrom,
      to: square,
      promotion: "q"
    };

    const move = makeMove(moveDetails);
    if (!move) {
      resetFirstMove(square);
    } else {
      setMoveFrom(null);
      socket.emit("sendMove", moveDetails);
    }
  }

  function onSquareRightClick(square: Square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    updateCustomSquares({
      rightClicked: {
        ...customSquares.rightClicked,
        [square]:
          customSquares.rightClicked[square] &&
          customSquares.rightClicked[square]?.backgroundColor === colour
            ? undefined
            : { backgroundColor: colour }
      }
    });
  }

  function clickPlay(e: FormEvent<HTMLButtonElement>) {
    setPlayBtnLoading(true);
    e.preventDefault();
    socket.emit("joinAsPlayer");
  }

  function getPlayerHtml(side: "top" | "bottom") {
    const blackHtml = (
      <div className="flex justify-between">
        <div className="flex w-full flex-col justify-center">
          <a
            className={
              (lobby.black?.name ? "font-bold" : "") +
              (typeof lobby.black?.id === "number" ? " text-primary link-hover" : " cursor-default")
            }
            href={typeof lobby.black?.id === "number" ? `/user/${lobby.black?.name}` : undefined}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lobby.black?.name || "(no one)"}
          </a>
          <span className="flex items-center gap-1 text-xs">
            black
            {lobby.black?.connected === false && (
              <span className="badge badge-xs badge-error">disconnected</span>
            )}
          </span>
        </div>
      </div>
    );
    const whiteHtml = (
      <div className="flex w-full flex-col justify-center">
        <a
          className={
            (lobby.white?.name ? "font-bold" : "") +
            (typeof lobby.white?.id === "number" ? " text-primary link-hover" : " cursor-default")
          }
          href={typeof lobby.white?.id === "number" ? `/user/${lobby.white?.name}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
        >
          {lobby.white?.name || "(no one)"}
        </a>
        <span className="flex items-center gap-1 text-xs">
          white
          {lobby.white?.connected === false && (
            <span className="badge badge-xs badge-error">disconnected</span>
          )}
        </span>
      </div>
    );

    if (lobby.black?.id === session?.user?.id) {
      return side === "top" ? whiteHtml : blackHtml;
    } else {
      return side === "top" ? blackHtml : whiteHtml;
    }
  }

  // function getMoveListHtml() {
  //   const history = lobby.actualGame.history({ verbose: true });
  //   const movePairs = history
  //     .slice(history.length / 2)
  //     .map((_, i) => history.slice((i *= 2), i + 2));

  //   return movePairs.map((moves, i) => {
  //     return (
  //       <tr className="flex w-full items-center gap-1" key={i + 1}>
  //         <td className="">{i + 1}.</td>
  //         <td
  //           className={
  //             "btn btn-ghost btn-xs h-full w-2/5 font-normal normal-case" +
  //             ((history.indexOf(moves[0]) === history.length - 1 && navIndex === null) ||
  //             navIndex === history.indexOf(moves[0])
  //               ? " btn-active pointer-events-none rounded-none"
  //               : "")
  //           }
  //           id={
  //             (history.indexOf(moves[0]) === history.length - 1 && navIndex === null) ||
  //             navIndex === history.indexOf(moves[0])
  //               ? "activeNavMove"
  //               : ""
  //           }
  //           onClick={() => navigateMove(history.indexOf(moves[0]))}
  //         >
  //           {moves[0].san}
  //         </td>
  //         {moves[1] && (
  //           <td
  //             className={
  //               "btn btn-ghost btn-xs h-full w-2/5 font-normal normal-case" +
  //               ((history.indexOf(moves[1]) === history.length - 1 && navIndex === null) ||
  //               navIndex === history.indexOf(moves[1])
  //                 ? " btn-active pointer-events-none rounded-none"
  //                 : "")
  //             }
  //             id={
  //               (history.indexOf(moves[1]) === history.length - 1 && navIndex === null) ||
  //               navIndex === history.indexOf(moves[1])
  //                 ? "activeNavMove"
  //                 : ""
  //             }
  //             onClick={() => navigateMove(history.indexOf(moves[1]))}
  //           >
  //             {moves[1].san}
  //           </td>
  //         )}
  //       </tr>
  //     );
  //   });
  // }

  function navigateMove(index: number | null | "prev") {
    const history = lobby.actualGame.history({ verbose: true });

    if (index === null || (index !== "prev" && index >= history.length - 1) || !history.length) {
      // last move
      setNavIndex(null);
      setNavFen(null);
      return;
    }

    if (index === "prev") {
      index = history.length - 2;
    } else if (index < 0) {
      index = 0;
    }

    chessboardRef.current?.clearPremoves(false);

    setNavIndex(index);
    setNavFen(history[index].after);
  }

  function getNavMoveSquares() {
    if (navIndex === null) return;
    const history = lobby.actualGame.history({ verbose: true });

    if (!history.length) return;

    return {
      [history[navIndex].from]: { background: "rgba(255, 255, 0, 0.4)" },
      [history[navIndex].to]: { background: "rgba(255, 255, 0, 0.4)" }
    };
  }

  function claimAbandoned(type: "win" | "draw") {
    if (
      lobby.side === "s" ||
      lobby.endReason ||
      lobby.winner ||
      !lobby.pgn ||
      abandonSeconds > 0 ||
      (lobby.black?.connected && lobby.white?.connected)
    ) {
      return;
    }
    socket.emit("claimAbandoned", type);
  }

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="ov flex min-h-[calc(100vh-70px)] w-full flex-col justify-center gap-6 py-4 lg:gap-10 2xl:gap-16">
          {getPlayerHtml("top")}
          <div className="relative h-min">
            {/* overlay */}
            {(!lobby.white?.id || !lobby.black?.id) && (
              <div className="absolute bottom-0 right-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/70">
                <div className="bg-base-200 flex w-full flex-col items-center justify-center gap-2 px-2 py-4">
                  {session?.user?.id !== lobby.white?.id &&
                  session?.user?.id !== lobby.black?.id ? (
                    <button
                      className={"btn grad1" + (playBtnLoading ? " btn-disabled" : "")}
                      onClick={clickPlay}
                    >
                      Play as {lobby.white?.id ? "black" : "white"}
                    </button>
                  ) : (
                    <>
                      Waiting for opponent.
                      <CopyLinkButton
                        className="bg-base-300 text-base-content fx h-8 gap-2 rounded-2xl px-3 font-mono text-xs active:opacity-60 sm:h-5 sm:text-sm"
                        link={`localhost:3000/${lobby.endReason ? `archive/${lobby.id}` : initialLobby.code}`}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            <Chessboard
              boardWidth={boardWidth}
              customDarkSquareStyle={{ backgroundColor: "#4b7399" }}
              customLightSquareStyle={{ backgroundColor: "#eae9d2" }}
              position={navFen || lobby.actualGame.fen()}
              boardOrientation={lobby.side === "b" ? "black" : "white"}
              isDraggablePiece={isDraggablePiece}
              onPieceDragBegin={onPieceDragBegin}
              onPieceDragEnd={onPieceDragEnd}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              arePremovesAllowed={!navFen}
              customSquareStyles={{
                ...(navIndex === null ? customSquares.lastMove : getNavMoveSquares()),
                ...(navIndex === null ? customSquares.check : {}),
                ...customSquares.rightClicked,
                ...(navIndex === null ? customSquares.options : {})
              }}
              ref={chessboardRef}
            />
          </div>
          {getPlayerHtml("bottom")}

          <>
            {(lobby.endReason ||
              (lobby.pgn &&
                lobby.white &&
                session?.user?.id === lobby.white?.id &&
                lobby.black &&
                !lobby.black?.connected) ||
              (lobby.pgn &&
                lobby.black &&
                session?.user?.id === lobby.black?.id &&
                lobby.white &&
                !lobby.white?.connected)) && (
              <div className="bg-neutral absolute top-0 w-full rounded-t-lg bg-opacity-95 p-2">
                {lobby.endReason ? (
                  <div>
                    {lobby.endReason === "abandoned"
                      ? lobby.winner === "draw"
                        ? `The game ended in a draw due to abandonment.`
                        : `The game was won by ${lobby.winner} due to abandonment.`
                      : lobby.winner === "draw"
                        ? "The game ended in a draw."
                        : `The game was won by checkmate (${lobby.winner}).`}{" "}
                    <br />
                    You can review the archived game at{" "}
                    <a
                      className="link"
                      href={`/archive/${lobby.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ches.su/archive/{lobby.id}
                    </a>
                    .
                  </div>
                ) : abandonSeconds > 0 ? (
                  `Your opponent has disconnected. You can claim the win or draw in ${abandonSeconds} second${
                    abandonSeconds > 1 ? "s" : ""
                  }.`
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span>Your opponent has disconnected.</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => claimAbandoned("win")}
                        className="btn btn-sm btn-primary"
                      >
                        Claim win
                      </button>
                      <button
                        onClick={() => claimAbandoned("draw")}
                        className="btn btn-sm btn-ghost"
                      >
                        Draw
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>

          <div className="dock dock-sm">
            <button>
              <IconMenu />
            </button>
            <button
              className={
                navIndex === 0 || lobby.actualGame.history().length <= 1
                  ? "btn-disabled disabled:opacity-50"
                  : ""
              }
              onClick={() => navigateMove(navIndex === null ? "prev" : navIndex - 1)}
            >
              <IconChevronLeft size={18} />
            </button>
            <button
              className={navIndex === null ? "btn-disabled disabled:opacity-50" : ""}
              onClick={() => navigateMove(navIndex === null ? null : navIndex + 1)}
            >
              <IconChevronRight size={18} />
            </button>

            <button>
              <label htmlFor="my-drawer-4" className="drawer-button">
                <IconMessage2 />
              </label>
            </button>
          </div>
        </div>
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

        {/* ! Chat */}
        <div className="bg-base-200 text-base-content flex min-h-full w-[90%] flex-col p-4">
          <header className="flex w-full justify-center gap-1 pb-3">
            Chat <IconMessage2 className="text-sky-600" />
          </header>
          <div className="bg-base-300 flex h-full w-full min-w-[64px] flex-1 flex-col overflow-y-scroll rounded-lg p-4 shadow-sm">
            <ul
              className="mb-4 flex h-full flex-col gap-1 overflow-y-scroll break-words"
              ref={chatListRef}
            >
              {chatMessages.map((m, i) => (
                <li
                  className={
                    "max-w-[30rem]" +
                    (!m.author.id && m.author.name === "server"
                      ? " bg-base-content text-base-300 p-2"
                      : "")
                  }
                  key={i}
                >
                  <span>
                    {m.author.id && (
                      <span>
                        <a
                          className={
                            "font-bold" +
                            (typeof m.author.id === "number"
                              ? " text-primary link-hover"
                              : " cursor-default")
                          }
                          href={
                            typeof m.author.id === "number" ? `/user/${m.author.name}` : undefined
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {m.author.name}
                        </a>
                        :{" "}
                      </span>
                    )}
                    <span>{m.message}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {lobby.observers && lobby.observers.length > 0 && (
            <div className="w-full px-2 text-xs md:px-0">
              Spectators: {lobby.observers?.map((o) => o.name).join(", ")}
            </div>
          )}
          <form className="mt-5 flex px-1" onSubmit={chatClickSend}>
            <input
              type="text"
              placeholder="Chat here..."
              className="input input-bordered flex-grow rounded-2xl"
              name="chatInput"
              id="chatInput"
              onKeyUp={chatKeyUp}
              required
            />
            <button className="btn btn-square ml-1 rounded-2xl bg-sky-600" type="submit">
              <IconSend2 />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
