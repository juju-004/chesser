"use client";

import React, { useEffect, useRef } from "react";
import Nav from "./components/Nav";
import Wallet from "./components/Wallet";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Play from "./components/Play";

export default function HomePage() {
  const state = useRef<Number>(0);

  useEffect(() => {
    document.getElementById("main-container")?.scrollTo(1000, 0);
    state.current = 1000;
  }, []);

  const clicked = () => {
    if (!state.current) {
      document.getElementById("main-container")?.scrollTo(1000, 0);
      state.current = 1000;
    } else {
      document.getElementById("main-container")?.scrollTo(0, 0);
      state.current = 0;
    }
  };

  const clickedMain = () => {
    state.current === 0 && document.getElementById("main-container")?.scrollTo(1000, 0);
    state.current = 1000;
  };

  return (
    <div
      id="main-container"
      className="flex h-screen w-screen overflow-x-hidden overflow-y-hidden scroll-smooth"
    >
      <div className="flex h-screen w-[180vw]">
        <div className="bg-base-300 flex h-screen w-[80vw] flex-col">
          <Menu />
        </div>
        <div onClick={clickedMain} className="relative flex h-screen w-[100vw] flex-col">
          <Nav clicked={clicked} />
          <div className="flex h-screen w-[100vw] flex-col gap-4 overflow-x-hidden overflow-y-scroll">
            <Header text="Wallet" />
            <Wallet />
            <Header text="Play" />
            <Play />
          </div>
        </div>
      </div>
    </div>
  );
}
