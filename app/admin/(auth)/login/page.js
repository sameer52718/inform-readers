"use client";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";
import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/ui/Checkbox";
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();
const Login2 = () => {
  const [isDark] = useDarkMode();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const router = useRouter();
  const onSubmit = (data) => {
    console.log(data);
  };

  const [checked, setChecked] = useState(false);
  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  <Link href="/">
                    <img
                      src={isDark ? "assets/images/logo/logo-white.svg" : "/assets/images/logo/logo.svg"}
                      alt=""
                      className="mx-auto"
                    />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="font-medium">Sign in</h4>
                  <div className="text-slate-500 dark:text-slate-400 text-base">
                    Sign in to your account to start using Admin Logo
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
                  <Textinput
                    name="email"
                    label="email"
                    type="email"
                    register={register}
                    error={errors?.email}
                  />
                  <Textinput
                    name="password"
                    label="passwrod"
                    type="password"
                    register={register}
                    error={errors.password}
                  />
                  <div className="flex justify-between">
                    <Checkbox
                      value={checked}
                      onChange={() => setChecked(!checked)}
                      label="Keep me signed in"
                    />
                    <Link
                      href="/admin/forgot-password"
                      className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
                    >
                      Forgot Password?{" "}
                    </Link>
                  </div>

                  <button className="btn btn-dark block w-full text-center">Sign in</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login2;
