"use client";
import React, { Fragment } from "react";
import Card from "@/components/ui/Card";
import { Tab } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import SubmitButton from "@/components/ui/SubmitButton";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";

const schema = yup.object({
  name: yup.string().required("Name is Required").optional(),
  email: yup.string().required("Email is Required").optional(),
});

const Personal = () => {
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({ resolver: yupResolver(schema), mode: "all" });

  useEffect(() => {
    const { name, phone, email } = user;
    reset({ name, phone, email });
  }, []);

  const onSubmit = async (values) => {
    try {
      const { data } = await axiosInstance.post("/admin/profile", values);
      if (!data.error) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-2 md:p-4 ">
        <div className="input-area">
          <div className="input-item mb-3 md:mb-5 flex-1 ">
            <Textinput
              placeholder="Enter Your Name"
              label="Name"
              type="text"
              name={"name"}
              register={register}
              error={errors.name}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="input-item mb-3 md:mb-5 flex-1 ">
              <Textinput
                placeholder="Enter Your Email"
                label="Email"
                type="email"
                name={"email"}
                register={register}
                error={errors.email}
                disabled
              />
            </div>
            <div className="input-item mb-3 md:mb-5 flex-1 ">
              <Textinput
                placeholder="Enter Your Phone"
                label="Phone"
                type="number"
                name={"phone"}
                register={register}
                error={errors.phone}
              />
            </div>
          </div>
          <div className="signin-area mb-3.5">
            <div className="flex justify-end">
              <SubmitButton isSubmitting={isSubmitting}>Update</SubmitButton>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

const Passwordschema = yup.object({
  password: yup.string().required("Current password is Required"),
  newPassword: yup.string().required("New password is Required"),
  cpassword: yup.string().oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});

const Password = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({ resolver: yupResolver(Passwordschema), mode: "all" });

  const onSubmit = async (values) => {
    try {
      const { data } = await axiosInstance.post("/admin/profile/change-password", values);
      if (!data.error) {
        toast.success(data.message);
        reset();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-2 md:p-4 ">
      <div className="input-area">
        <div className="input-item mb-3 md:mb-5 flex-1 ">
          <Textinput
            placeholder="Enter Your Current Password"
            label="Current Password"
            type="password"
            name={"password"}
            register={register}
            error={errors.password}
            hasicon
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="input-item mb-3 md:mb-5 flex-1 ">
            <Textinput
              placeholder="Enter Your Password"
              label="New Password"
              type="password"
              name={"newPassword"}
              register={register}
              error={errors.newPassword}
              hasicon
            />
          </div>
          <div className="input-item mb-3 md:mb-5 flex-1">
            <Textinput
              placeholder="Confirm Your Password"
              label="Confirm Passoword"
              type="password"
              name={"cpassword"}
              register={register}
              error={errors.cpassword}
              hasicon
            />
          </div>
        </div>

        <div className="signin-area mb-3.5">
          <div className="flex justify-end">
            <SubmitButton isSubmitting={isSubmitting}>Update</SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
};

const newButtons = [
  {
    title: "Personal",
    icon: "heroicons-outline:home",
  },
  {
    title: "Password",
    icon: "heroicons-outline:user",
  },
];

const Setting = () => {
  return (
    <Card bodyClass="p-4 md:p-6" title="Settings">
      <Tab.Group>
        <div className="grid grid-cols-12 md:gap-10">
          <div className="lg:col-span-12 md:col-span-5 col-span-12">
            <Tab.List className="grid grid-cols-2 md:grid-cols-4 mb-5 gap-2">
              {newButtons.map((item, i) => (
                <Tab key={i} as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`md:w-full text-sm lg:text-base font-medium md:block inline-block  capitalize ring-0 foucs:ring-0 focus:outline-none px-2 md:px-6 rounded-md py-1 xs:py-2 transition duration-150
        ${
          selected
            ? "text-white bg-black-500 "
            : "text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300"
        }
      `}
                    >
                      {item.title}
                    </button>
                  )}
                </Tab>
              ))}
            </Tab.List>
          </div>
          <div className="lg:col-span-12 md:col-span-7 col-span-12">
            <Tab.Panels>
              <Tab.Panel>
                <Personal />
              </Tab.Panel>
              <Tab.Panel>
                <Password />
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </Card>
  );
};

export default Setting;
