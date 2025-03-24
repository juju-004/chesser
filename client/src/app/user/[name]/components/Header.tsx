import React from "react";

function Header({ text }: { text: string }) {
  return (
    <div className="mt-4 flex w-full items-center gap-2 text-sm opacity-25">
      <div className="h-0.5 w-[10%] rounded-full bg-white/25"></div>
      {text}
      <div className="h-0.5 w-[30%] rounded-full bg-white/25"></div>
    </div>
  );
}

export default Header;
