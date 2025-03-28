"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

import { SessionContext } from "@/context/session";
import { fetchActiveGame } from "@/lib/game";
import { useToast } from "@/context/ToastContext";
import Button from "./button";

export default function JoinGame() {
  const session = useContext(SessionContext);
  const [disabled, setDisabled] = useState(false);
  const { toast } = useToast();

  const router = useRouter();

  function submitJoinGame(formData: any) {
    setDisabled(true);
    if (!session?.user?.id) return;

    let code = formData.get("code");

    if (!code) return;

    if (code.startsWith("localhost")) {
      code = "http://" + code;
    }
    if (code.startsWith("http")) {
      code = new URL(code).pathname.split("/")[1];
    }

    setTimeout(async () => {
      const game = await fetchActiveGame(code);

      if (game && game.code) {
        router.push(`/${game.code}`);
      } else {
        toast("No games found", "error");
        setDisabled(false);
      }
    }, 500);
  }

  return (
    <form action={submitJoinGame} className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-5 pt-5">
        <div className="mt-5 flex flex-col gap-1">
          <header className="opacity-60">Game Code</header>
          <input type="text" className="input w-full" name="code" placeholder={"https://"} />
        </div>
      </div>

      <Button disabled={disabled} text="Join" />
    </form>
  );
}
