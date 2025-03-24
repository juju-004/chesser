import { IconChessBishopFilled, IconChessKing } from "@tabler/icons-react";
import React from "react";

function Play() {
  const items = [
    {
      text: "Create game",
      icon: <IconChessBishopFilled className="size-[15vw] text-fuchsia-600" />
    },
    { text: "Join game", icon: <IconChessKing className="size-[15vw] text-cyan-500" /> }
  ];

  return (
    <div className="grid w-full grid-cols-2 grid-rows-2 flex-wrap gap-4 px-3">
      {items.map((item, key) => (
        <button key={key} className="fx row-span-1">
          <div className="active:bg-base-200/40 hover:bg-base-200/40 fx flex-col gap-4 rounded-2xl px-[5vw] py-2.5 duration-200">
            <div className="bg-base-300 fx size-[25vw] rounded-xl">{item.icon}</div>
            <span className="whitespace-nowrap">{item.text}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default Play;
