"use client";
import BackButton from "@/components/ui/BackButton";
import Loading from "@/components/ui/Loading";
import { useState } from "react";
import WebsiteLogo from "@/components/adminPartials/config/Logo";
// import ShopSettings from "./ShopSetting";
// import ShopSocial from "./ShopSocial";
// import ShopLogo from "./ShopLogo";
// import ShopExtraInfo from "./ShopExtra";
// import PaymentServiceFees from "./PaymentServiceFees";

const Shop = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Loading loading={isLoading}>
      <div className="">
        <div className=" my-4 flex justify-between ">
          <h3 className="text-2xl font-bold font-inter">Website Settings</h3>
          <BackButton />
        </div>
        <div className="space-y-6">
          <WebsiteLogo />
          {/* <ShopInfo /> */}
          {/* <ShopSettings /> */}
          {/* <PaymentServiceFees/> */}
          {/* <ShopSocial /> */}
          {/* <ShopExtraInfo /> */}
        </div>
      </div>
    </Loading>
  );
};

const ShopSettingPage = () => {
  return <Shop />;
};

export default ShopSettingPage;
