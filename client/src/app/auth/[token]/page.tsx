"use client";

import { verifyMail } from "@/lib/auth";
import { IconMailCheck } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

function VerifyToken() {
  const pathName = usePathname();
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const split = pathName.split("/");
    const token = split[2].trim();

    const verify = async (token: string) => {
      const data = await verifyMail(token);

      if (typeof data === "string") {
        setStatus("error");
      } else if (data?.message) {
        setStatus("success");
      }
    };

    verify(token);
  }, []);

  if (status === null) {
    return (
      <div className="animate-fadein absolute inset-0 z-40">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loading text-c2 loading-spinner loading-xl"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="fx h-screen w-screen flex-col px-7 text-xl">
      {status === "success" ? (
        <>
          <span className="bg-success/5 fx mb-3 size-20 rounded-full">
            <IconMailCheck size={40} className="text-success" />
          </span>
          <h3 className="text-succe mb-3 text-lg">Email verified Successfully</h3>
          <Link className="btn rounded-xl font-light text-white/55" href={"/auth"}>
            back to login
          </Link>
        </>
      ) : (
        <>
          <h3 className="mb-2 text-7xl opacity-30">404</h3>
          Invalid Authentication String
        </>
      )}
    </div>
  );
}

export default VerifyToken;
