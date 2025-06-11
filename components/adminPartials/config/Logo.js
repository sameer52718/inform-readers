import React, { useRef, useState } from "react";
import { Card, Icon, SubmitButton } from "../../../components/ui";
import { useShop } from "./ShopProvider";
import NoProfile from "../../../assets/images/avatar/NoProfile.webp";
import { handleError } from "../../../utils/functions";
import axiosInstance from "../../../configs/axios.config";
import { toast } from "react-toastify";
const ShopLogo = () => {
  const [profile, setProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef();
  const { shop, refetch } = useShop();

  const handleUpdate = async () => {
    try {
      if (!profile) {
        return;
      }
      setIsSubmitting(true);
      const { data } = await axiosInstance.patch(
        `/shop/update-shop-logo`,
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
        <div className="h-[100px] w-[100px] ">
          <img
            src={profile ? URL.createObjectURL(profile) : shop.logo.url ? shop.logo.url : NoProfile}
            alt="Profile"
            className="h-full w-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <SubmitButton isSubmitting={isSubmitting} type="button" onClick={handleUpdate} />
      </div>
    </Card>
  );
};

export default ShopLogo;
