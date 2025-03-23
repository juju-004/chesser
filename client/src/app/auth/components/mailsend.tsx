"use client";

import { useToast } from "@/context/ToastContext";
import { resendMail } from "@/lib/auth";
import { IconSend } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

function Mailsend({ email }: { email: string | null }) {
  const [time, setTime] = useState<number>(60);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (time === 0) return; // Stop the timer when it reaches 0

    // Set up the interval to decrement the time every second
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const submitAction = async () => {
    setLoading(true);

    setTimeout(async () => {
      const mail = email as string;
      const data = await resendMail(mail);
      if (typeof data === "string") {
        toast(data, "error");
      } else if (data?.message) {
        toast(data.message, "success");

        setTime(60);
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fx bg-base-300/40 mt-12 w-full max-w-md flex-col rounded-3xl px-8 pb-6 text-center">
      <span className="fx text-success bg-success/15 h-16 w-16 -translate-y-1/2 rounded-2xl">
        <IconSend className="size-8" />
      </span>
      <div>
        Please click on the verification link sent to{" "}
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link text-sky-400"
        >
          {email}
        </a>{" "}
        to activate your account
      </div>

      <span className="mt-4 text-white/25">Didnt get one?</span>
      <button
        disabled={loading ? true : time ? true : false}
        className={`btn btn-soft btn-success fx disabled:btn-neutral mt-1 disabled:text-white/40`}
        onClick={submitAction}
      >
        {loading && <span className="loading loading-spinner loading-sm mr-0.5"></span>} Resend{" "}
        {time ? `in ${time}s` : ""}
      </button>
    </div>
  );
}

export default Mailsend;
