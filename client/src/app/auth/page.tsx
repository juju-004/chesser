"use client";

import React, { useContext, useState } from "react";
import Logo from "./components/Logo";
import FormInput from "./components/form-input";
import FormButton from "./components/form-button";
import { SessionContext } from "@/context/session";
import { login, register } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Mailsend from "./components/mailsend";
import { useToast } from "@/context/ToastContext";
import ForgotPass from "./components/ForgotPass";

function Login() {
  const session = useContext(SessionContext);
  const { toast } = useToast();
  const { push } = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [mail, setMail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const signin = async (formData: any) => {
    setDisabled(true);
    const password = formData.get("password");
    const email = formData.get("email");

    setTimeout(async () => {
      const user = await login(email, password);
      if (typeof user === "string") {
        toast(user, "error");
        setDisabled(false);
      } else if (user?.id) {
        session?.setUser(user);

        push("/");
      }
    }, 700);
  };

  const signup = async (formData: any) => {
    setDisabled(true);
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");

    setTimeout(async () => {
      const user = await register(username, password, email);

      if (typeof user === "string") {
        toast(user, "error");
      } else if (user?.email) {
        setMail(user.email);
      }
      setDisabled(false);
    }, 700);
  };

  return (
    <>
      <div className="mb-20 px-4">
        <ForgotPass checked={checked} onCheck={() => setChecked(!checked)} />
        <Logo />
        {mail ? (
          <Mailsend email={mail} />
        ) : (
          <div className="tabs tabs-border justify-center">
            <input
              type="radio"
              defaultChecked
              name="my_tabs_6"
              className="tab text-md w-1/3"
              aria-label="Login"
            />
            <div className="tab-content bg-base-100 border-base-300 rounded-3xl px-6 pb-6">
              <form action={signin} className="flex w-full flex-col pt-8">
                <FormInput name={"email"} placeholder={"Your email"} />
                <FormInput name={"password"} placeholder={"Your pasword"} />
                <FormButton text={"Sign in"} disabled={disabled} />
                <div className="mt-4 px-5 text-center opacity-70">
                  Forgotten password?{" "}
                  <label htmlFor="my_modal_7" onClick={() => setChecked(true)} className="text-c1">
                    Reset
                  </label>
                </div>
              </form>
            </div>

            <input
              type="radio"
              name="my_tabs_6"
              className="tab text-md w-1/3"
              aria-label="Register"
              disabled={disabled}
            />
            <div className="tab-content bg-base-100 border-base-300 rounded-3xl px-6 pb-6">
              <form action={signup} className="flex w-full flex-col pt-8">
                <FormInput name={"username"} placeholder={"Your username"} />
                <FormInput name={"email"} placeholder={"Your email"} />
                <FormInput name={"password"} placeholder={"Your pasword"} />
                <span className="mb-6 text-center">
                  <span className="opacity-70">By signing up you do consent to or</span>{" "}
                  <span className="text-c1">terms of service</span>{" "}
                  <span className="opacity-70">and</span>{" "}
                  <span className="text-c1">privacy policy</span>
                </span>
                <FormButton disabled={disabled} text={"Register"} />
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Login;
