"use client"; // ✅ Correct placement, no export

import { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";

function NameFilter() {
    const [location, setLocation] = useState("");
    const [region, setRegion] = useState("");

    return (
        <div className="bg-gray-800 py-3 px-4 rounded-md  space-x-2 w-full grid grid-cols-12  ">
            
            <div className="col-span-12">
                <div className="flex w-full items-center justify-between space-x-1 bg-white  px-8 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-all">
                    <input type="text" placeholder="Find Your Name Meaning & Lucky Number..." className="w-full focus:outline-none bg-transparent py-4" />
                    {/* <Icon icon="mdi:magnify" width="20" height="20" className="text-blue-500" /> */}

                    <Image src={'/website/assets/images/icons/search.png'} width={1000} height={1000} alt="product" className="w-10  h-auto" />
                </div>
            </div>

           






        </div>
    );
}

export default NameFilter
