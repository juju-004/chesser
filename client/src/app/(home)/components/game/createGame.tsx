"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

import { SessionContext } from "@/context/session";
import { createGame } from "@/lib/game";
import Button from "./button";
import { useToast } from "@/context/ToastContext";

export default function CreateGame() {
  const session = useContext(SessionContext);
  const [disabled, setDisabled] = useState(false);
  const { toast } = useToast();

  const router = useRouter();

  async function submitCreateGame(formdata: any) {
    if (!session?.user?.id) return;

    const timeControl = parseFloat(`${formdata.get("minutes")}.${formdata.get("seconds")}`);
    const amount = formdata.get("amount");
    const side = formdata.get("side");

    setDisabled(true);

    setTimeout(async () => {
      const game = await createGame(side, timeControl, amount);

      console.log(game);

      if (typeof game === "string") {
        setDisabled(false);
        toast(game, "error");
      } else {
        router.push(`/${game.code}`);
        // TODO: Show error message
      }
    }, 700);
  }

  return (
    <form action={submitCreateGame} className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-5 pt-5">
        <div className="flex items-center justify-between">
          <header>Time</header>
          <div className="flex">
            <input
              type="text"
              className="input !w-12 flex-1"
              name="minutes"
              defaultValue={"03"}
              maxLength={2}
            />
            <input
              type="text"
              className="input !w-12 flex-1"
              name="seconds"
              defaultValue={"00"}
              maxLength={2}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="createStartingSide">
            <span className="label-text">Select your side</span>
          </label>
          <div>
            <select name="side" defaultValue="Random" className="select">
              <option>Random</option>
              <option>White</option>
              <option>Black</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="createStartingSide">
            <span className="label-text">Amount</span>
          </label>
          <div>
            <input
              type="text"
              className="input"
              placeholder="min 100."
              name="amount"
              defaultValue={"1000"}
            />
          </div>
        </div>
      </div>

      <Button disabled={disabled} text="Create" />
    </form>
  );
}
