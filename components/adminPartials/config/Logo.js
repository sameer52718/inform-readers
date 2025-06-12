import React, { useRef, useState } from "react";
import SubmitButton from "@/components/ui/SubmitButton";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const WebsiteLogo = () => {
  const { logo } = useSelector((state) => state.config);
  const [profile, setProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef();

  const handleUpdate = async () => {
    try {
      if (!profile) {
        return;
      }
      setIsSubmitting(true);
      const { data } = await axiosInstance.post(
        `/admin/config`,
        { logo: profile },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(data.message);
      refetch();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title={"Shop Logo"}>
      <div className="relative mb-5">
        <div
          className="absolute bg-gray-100 h-8 w-8 rounded-full bottom-0 left-[70px] grid place-items-center cursor-pointer"
          onClick={() => inputRef.current.click()}
        >
          <Icon icon={"bx:edit"} />
          <input
            type="file"
            ref={inputRef}
            hidden
            onChange={(e) => setProfile(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className=" w-[100px] ">
          <img
            src={profile ? URL.createObjectURL(profile) : logo ? logo : ""}
            alt="Profile"
            className="h-full w-full object-cover "
          />
        </div>
      </div>
      <div className="flex justify-end">
        <SubmitButton isSubmitting={isSubmitting} type="button" onClick={handleUpdate} />
      </div>
    </Card>
  );
};

export default WebsiteLogo;
