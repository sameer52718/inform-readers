"use client"; // ✅ Correct placement, no export

import { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";

const WeatherFilter = () => {
    const [location, setLocation] = useState("");
    const [region, setRegion] = useState("");

    return (
        <div className="bg-gray-800 px-2 p-2 rounded-md w-full grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-2">
            {/* Location Dropdown */}
            <div className="sm:col-span-4">
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 sm:py-4 border rounded-md focus:outline-none focus:ring-2"
                >
                    <option value="">Select Location...</option>
                    <option value="new-york">New York</option>
                    <option value="los-angeles">Los Angeles</option>
                    <option value="chicago">Chicago</option>
                </select>
            </div>

            {/* Region Dropdown */}
            <div className="sm:col-span-6">
                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 sm:py-4 border rounded-md focus:outline-none focus:ring-2"
                >
                    <option value="">Select Region / State / Province...</option>
                    <option value="california">California</option>
                    <option value="texas">Texas</option>
                    <option value="florida">Florida</option>
                </select>
            </div>

            {/* Search Button */}
            <div className="sm:col-span-2">
                <button className="flex w-full items-center justify-center sm:justify-between space-x-2 bg-white text-red-600 px-4 py-3 sm:py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-all">
                    <span className="font-semibold">Search</span>
                    <Image src={'/website/assets/images/icons/search.png'} width={1000} height={1000} alt="search icon" className="w-6 h-auto sm:w-10" />
                </button>
            </div>
        </div>

    );
};

export default WeatherFilter;
