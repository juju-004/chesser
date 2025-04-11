import Menu from "@/app/(home)/components/Menu";
import { IconMenuDeep } from "@tabler/icons-react";
import React, { ReactNode } from "react";

function MenuDrawer({ children }: { children: ReactNode }) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="bg-base-300/40 fixed top-0 z-50 flex w-full items-center px-2 py-2">
          <label htmlFor="my-drawer-3" aria-label="open sidebar" className="">
            <IconMenuDeep className="size-5" />
          </label>
          {/* <div cl>

          </div> */}
        </div>
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <Menu className="bg-base-200 w-[80vw]" />
      </div>
    </div>
  );
}

export default MenuDrawer;
