import Script from "next/script";
import React from "react";

function AdBanner() {
  return (
    <div className=" h-[90px] mx-auto my-4">
      {/* <Script id="ad-script-options" strategy="afterInteractive">
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
      /> */}
    </div>
  );
}

export default AdBanner;
