// import Script from "next/script";
// import React from "react";

// function AdBanner() {
//   return (
//     <div className="w-[728px] h-[90px] mx-auto my-4">
//       <Script id="ad-script-options" strategy="afterInteractive">
//         {`
//           atOptions = {
//             'key' : '3601496aca75aa7c85a600dae63104d0',
//             'format' : 'iframe',
//             'height' : 90,
//             'width' : 728,
//             'params' : {}
//           };
//         `}
//       </Script>

//       <Script
//         id="ad-script-load"
//         src="//www.highperformanceformat.com/3601496aca75aa7c85a600dae63104d0/invoke.js"
//         strategy="afterInteractive"
//       />
//     </div>
//   );
// }

// export default AdBanner;

import { useEffect, useRef } from "react";

export default function Banner() {
  const banner = useRef(null);

  const atOptions = {
    key: "3601496aca75aa7c85a600dae63104d0",
    format: "iframe",
    height: 90,
    width: 728,
    params: {},
  };

  useEffect(() => {
    if (banner.current && !banner.current.firstChild) {
      const conf = document.createElement("script");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//www.highperformancedformats.com/${atOptions.key}/invoke.js`;
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

      banner.current.appendChild(conf);
      banner.current.appendChild(script);
    }
  }, []); // <-- No need to add [banner]

  return (
    <div
      className="mx-2 my-5 border border-gray-200 flex justify-center items-center text-white text-center"
      ref={banner}
    />
  );
}
