"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import PriceFilter from "@/components/partials/PriceFilter";
import WeatherFilter from "@/components/partials/WeatherFilter";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState } from "react";

function JobsFoundCard() {
  const [sortOption, setSortOption] = useState("Most Recent");

  return (
    <div className="border rounded-2xl p-8 bg-gray-200 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">0 Jobs Found</h2>
        <div className="flex items-center space-x-2">
          <select
            className="border rounded px-2 py-1 text-sm focus:outline-none"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option>Most Recent</option>
            <option>Oldest</option>
          </select>
          <Icon icon="mdi:filter" className="text-xl text-gray-600" />
        </div>
      </div>
      <p className="text-sm">Displayed Here: 0 Jobs</p>
      <div className="bg-gray-50 p-4 rounded-lg  mt-3">
        <p className="font-bold">
          No Record <span className="text-red-500">Sorry!</span>
        </p>
        <p className="text-sm text-gray-600">
          Does not match record with your keyword. Change your filter keywords to resubmit.
        </p>
        <button className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Reset Filters
        </button>
      </div>
    </div>
  );
}

function JobCategory() {
  return (
    <div className="container mx-auto">
      <AdBanner />

      <div className=" ">
        <div className="flex flex-wrap justify-between gap-8 mb-5">
          <div className="flex items-center gap-2">
            <Icon icon="majesticons:airplane-flight-2" width="24" height="24" />
            <h1 className="text-lg font-semibold text-gray-400">Flights</h1>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="famicons:bed" width="24" height="24" />
            <h1 className="text-lg font-semibold text-gray-400">Hotels</h1>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="clarity:car-line" width="24" height="24" />
            <h1 className="text-lg font-semibold text-gray-400">Rental Cars</h1>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="majesticons:beach" width="24" height="24" />
            <h1 className="text-lg font-semibold text-gray-400">Packages</h1>
          </div>
        </div>

        <WeatherFilter />

        <div className="flex items-center gap-1 text-xl  py-6">
          <h6 className="text-red-500">Home</h6>/<h6>Jobs</h6>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Price Filter */}
          <div className="col-span-1 md:col-span-3">
            <PriceFilter />
          </div>
          {/* Job Cards Section */}
          <div className="col-span-1 md:col-span-9">
            <JobsFoundCard />

            {/* Job Listings */}
            <div className="grid grid-cols-1 gap-5 mt-6 p-4 rounded-2xl bg-gray-300">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white justify-center py-1 relative md:px-16 px-4 rounded-2xl flex md:flex-row flex-col items-center gap-2"
                >
                  <Image
                    src={"/website/assets/images/company/01.png"}
                    width={500}
                    height={500}
                    alt="company-logo"
                    className="w-52 h-auto object-cover"
                  />
                  <div className="flex-1">
                    <h6 className="text-2xl font-bold">Accountant For Early Audit Required</h6>
                    <div className="flex mt-3 gap-2 justify-between">
                      <p className="text-lg font-semibold">Nelnons Hompathy</p>
                      <button className="md:px-5 md:text-lg px-3 text-sm py-2 rounded-lg bg-red-500 text-white">
                        Full Time
                      </button>
                    </div>
                  </div>

                  {/* Heart Icon */}
                  <div className="absolute md:top-6 md:right-8 top-2 right-2 bg-gray-200 flex items-center justify-center w-10 h-10 rounded-full">
                    <Icon icon="mdi-light:heart" width="24" height="24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className=" py-8">
        <HoverBanner />
      </div>
    </div>
  );
}

export default JobCategory;
