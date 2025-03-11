import Image from "next/image";
import React from "react";

function HoverBanner({padding = "128px"}) {
    return (
        <section className={` overflow-hidden`}>
        <div className="mx-auto h-60 w-full px-3 relative overflow-hidden">
            <Image
                src={"/website/assets/images/banner/03.png"}
                width={2000}
                height={2000}
                alt="ad-banner"
                className="w-full h-full hover:scale-105 transition duration-500 ease-in-out"
            />
    
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex sm:justify-start  flex-col items-center" >
                <h1 className="text-white md:text-3xl font-semibold text-center"> General E-commerce Sale Banner</h1>
                <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded-md">
                    Shop Now
                </button>
            </div>
        </div>
    </section>
    
    );
}

export default HoverBanner;
