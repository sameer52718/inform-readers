"use client";
import Script from "next/script";
import React from "react";

function AdBanner() {
  return (
    <div
      className="w-[728px] h-[90px] mx-auto my-4 border border-gray-200 text-white text-center "
      style={{ minHeight: "90px" }}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
        Loading Ad...
      </div>
      <Script id="ad-script-options" strategy="afterInteractive">
        {`
          atOptions = {
            'key' : '3601496aca75aa7c85a600dae63104d0',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `}
      </Script>

      <Script
        id="ad-script-load"
        src="//www.highperformanceformat.com/3601496aca75aa7c85a600dae63104d0/invoke.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

export default AdBanner;
