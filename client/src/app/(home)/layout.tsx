"use client";

import { SessionContext } from "@/context/session";
import { Session } from "@/types";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import type { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  const session: Session = useContext(SessionContext);
  const { replace } = useRouter();

  if (!session?.user) {
    replace(`/auth`);
    return;
  }

  document.title = `${session.user?.name} | chesser`;

  return <>{children}</>;
}

export default Layout;
