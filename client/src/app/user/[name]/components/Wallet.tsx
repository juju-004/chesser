"use client";

import React from "react";

function Wallet() {
  return (
    <div className="bg-base-300 mx-auto w-[90%] px-5 pb-2 pt-3">
      <span className="text-xl font-bold">₦1000</span>
      <div className="flex justify-end">
        <button className="btn btn-ghost bg-base-200">+ Add money</button>
      </div>
    </div>
  );
}

export default Wallet;
