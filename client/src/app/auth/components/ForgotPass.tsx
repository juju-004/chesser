"use client";

import React, { useState } from "react";
import FormInput from "./form-input";
import FormButton from "./form-button";
import { sendForgotPassMail } from "@/lib/auth";
import { useToast } from "@/context/ToastContext";
import { IconSend } from "@tabler/icons-react";

const ForgotPass = ({ checked, onCheck }: { checked: boolean; onCheck: () => void }) => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const submitAction = (formData: any) => {
    setDisabled(true);
    const password = formData.get("password2");
    const email = formData.get("email2");

    setTimeout(async () => {
      const user = await sendForgotPassMail(email, password);
      if (typeof user === "string") {
        onCheck();
        setTimeout(() => {
          toast(user, "error");
        }, 500);
      } else if (user?.email) {
        setEmail(user.email);
      }
      setDisabled(false);
    }, 700);
  };
  return (
    <>
      <input type="checkbox" checked={checked} id="my_modal_7" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box rounded-t-3xl md:rounded-2xl">
          {email ? (
            <div className="flex w-full flex-col items-center justify-center">
              <span className="fx text-success bg-success/15 size-12 rounded-2xl">
                <IconSend className="size-8" />
              </span>
              <h3 className="mb-4 mt-1 text-lg opacity-60">Confirm your Email</h3>
              <span className="text-center">
                We have sent a password reset link to{" "}
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link text-sky-400"
                >
                  {email}
                </a>
              </span>
              <label
                onClick={onCheck}
                className="btn btn-lg fx font-jose-bold grad1 mt-5 w-full gap-2 rounded-xl font-light text-white disabled:opacity-75"
              >
                Close
              </label>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold">ForgotPassword</h3>
              <form action={submitAction} className="flex w-full flex-col pb-3 pt-8">
                <FormInput name={"email2"} type="email" placeholder={"Your email"} />
                <FormInput name={"password2"} type="password" placeholder={"New password"} />
                <FormButton disabled={disabled} text={"Submit"} />
              </form>
            </>
          )}
        </div>
        <label onClick={onCheck} className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </>
  );
};

export default ForgotPass;
