import { IconChessBishopFilled, IconChessKing } from "@tabler/icons-react";
import React from "react";
import CreateGame from "./game/createGame";
import JoinGame from "./game/JoinGame";

function Play() {
  const items = [
    {
      text: "Create game",
      for: "my_modal_3",
      icon: (size = "size-[15vw]") => (
        <IconChessBishopFilled className={`${size} text-fuchsia-600`} />
      )
    },
    {
      text: "Join game",
      for: "my_modal_2",
      icon: (size = "size-[15vw]") => <IconChessKing className={`${size} text-cyan-500`} />
    }
  ];

  return (
    <div className="grid w-full grid-cols-2 grid-rows-2 flex-wrap gap-4 px-3">
      {items.map((item, key) => (
        <React.Fragment key={key}>
          <label htmlFor={item.for} className="fx row-span-1">
            <div className="active:bg-base-200/40 hover:bg-base-200/40 fx flex-col gap-4 rounded-2xl px-[5vw] py-2.5 duration-200">
              <div className="bg-base-300 fx size-[25vw] rounded-xl">{item.icon()}</div>
              <span className="whitespace-nowrap">{item.text}</span>
            </div>
          </label>

          <>
            <input type="checkbox" id={item.for} className="modal-toggle" />
            <div className="modal modal-bottom" role="dialog">
              <div className="modal-box flex !h-[calc(100vh-300px)] flex-col">
                <header className="bg-base-300 flex items-center py-1">
                  {item.icon("size-[10vw]")} <span className="text-xl">{item.text}</span>
                </header>
                {key ? <JoinGame /> : <CreateGame />}
              </div>
              <label className="modal-backdrop" htmlFor={item.for}>
                Close
              </label>
            </div>
          </>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Play;
