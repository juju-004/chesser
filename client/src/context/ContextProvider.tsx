"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { fetchSession } from "@/lib/auth";
import { SessionContext } from "./session";

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(false);

  async function getSession() {
    const user = await fetchSession();

    setUser(user || null);
  }

  useEffect(() => {
    getSession();
  }, []);

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {user === false ? (
        <div className="animate-fadein absolute inset-0 z-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="loading text-c2 loading-spinner loading-xl"></span>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </SessionContext.Provider>
  );
}
