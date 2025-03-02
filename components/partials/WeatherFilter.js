"use client"; // ✅ Correct placement, no export

import { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";

const WeatherFilter = () => {
    const [location, setLocation] = useState("");
    const [region, setRegion] = useState("");

    return (
        <div className="bg-gray-800 p-2 rounded-md  space-x-2 w-full grid grid-cols-12 ">
            <div className="col-span-4">
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className=" px-4 py-4 w-full border rounded-md focus:outline-none focus:ring-2 "
                >
                    <option value="">Select Location...</option>
                    <option value="new-york">New York</option>
                    <option value="los-angeles">Los Angeles</option>
                    <option value="chicago">Chicago</option>
                </select>
            </div>

            <div className="col-span-6">
                {/* Region Dropdown */}
                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className=" w-full px-4 py-4 border rounded-md focus:outline-none focus:ring-2 "
                >
                    <option value="">Select Regions / State / Province...</option>
                    <option value="california">California</option>
                    <option value="texas">Texas</option>
                    <option value="florida">Florida</option>
                </select>
            </div>
            <div className="col-span-2">
                <button className="flex w-full items-center justify-between space-x-1 bg-white text-red-600 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-all">
                    <span className="font-semibold">Search...</span>
                    {/* <Icon icon="mdi:magnify" width="20" height="20" className="text-blue-500" /> */}

                    <Image src={'/website/assets/images/icons/search.png'} width={1000} height={1000} alt="product" className="w-10  h-auto" />
                </button>
            </div>






        </div>
    );
};

export default WeatherFilter;
