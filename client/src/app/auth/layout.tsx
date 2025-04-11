"use client";

import { SessionContext } from "@/context/session";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import type { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  const session = useContext(SessionContext);
  const { replace } = useRouter();

  if (session?.user) {
    replace("/");
    return;
  }

  return <div>{children}</div>;
}

export default Layout;
