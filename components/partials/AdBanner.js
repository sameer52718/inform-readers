import Image from "next/image";
import React from "react";

function AdBanner() {
  return (
    <div className="py-6 border-b border-black ">
      <Image
        src={"/website/assets/images/banner/02.jpeg"}
        width={2000}
        height={2000}
        alt="ad-banner"
        className="md:px-32 h-auto px-2 mx-auto w-full "
      />
    </div>
  );
}

export default AdBanner;
