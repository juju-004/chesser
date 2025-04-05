"use client";

import { getWallet } from "@/lib/user";
import { IconEye } from "@tabler/icons-react";
import { IconEyeCancel } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

function Wallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [see, setSee] = useState(true);

  useEffect(() => {
    const getW = async () => {
      if (balance === null) {
        const data = await getWallet();

        setBalance(data?.wallet);
      }
    };

    getW();
  }, [balance]);

  return (
    <div className="bg-base-300 mx-auto flex w-[90%] flex-col items-start px-5 pb-2 pt-3">
      {balance === null ? (
        <span className="loading loading-spinner opacity-40"></span>
      ) : (
        <button
          onClick={() => setSee(!see)}
          className="btn btn-ghost flex items-center gap-4 bg-white/5 px-3 text-xl font-bold"
        >
          <span>
            {see ? (
              <>
                <span className="text-sm opacity-70">₦</span> {balance}
              </>
            ) : (
              "⁎⁎⁎⁎"
            )}
          </span>
          {see ? <IconEye className="opacity-40" /> : <IconEyeCancel className="opacity-40" />}
        </button>
      )}
      <div className="flex w-full justify-end">
        <button className="btn btn-ghost bg-base-200">+ Add money</button>
      </div>
    </div>
  );
}

export default Wallet;
