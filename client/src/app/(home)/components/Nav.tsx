"use client";

import { IconUser } from "@tabler/icons-react";
import { IconMenuDeep } from "@tabler/icons-react";
import React from "react";

function Nav({ clicked }: { clicked: () => void }) {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <button
          onClick={(e) => {
            e.stopPropagation();
            clicked();
          }}
          className="btn btn-ghost btn-circle"
        >
          <IconMenuDeep />
        </button>
        {/* <div className="dropdown">
         
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Homepage</a>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div> */}
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Chesser</a>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <IconUser />
        </button>
      </div>
    </div>
  );
}

export default Nav;
