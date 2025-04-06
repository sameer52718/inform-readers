"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import WeatherFilter from "@/components/partials/WeatherFilter";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ReviewSection = () => {
  const totalReviews = 1;
  const ratings = [1, 0, 0, 0, 0];

  return (
    <div className="px-6 py-10 bg-white shadow-md rounded-lg mb-5">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
        {/* Rating Score Section */}
        <div className="col-span-full sm:col-span-2 border-r-0 sm:border-r-4 border-gray-200 text-center sm:text-left">
          <div className="flex sm:items-end justify-center sm:justify-start space-x-2">
            <span className="text-5xl md:text-6xl font-bold text-red-600">5.0</span>
            <span className="text-gray-500 text-lg">out of 5</span>
          </div>
          <div className="flex justify-center sm:justify-start my-2">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon="material-symbols-light:star-rounded"
                width="24"
                height="24"
                className="text-red-600 fill-red-600"
              />
            ))}
          </div>
        </div>

        {/* Rating Bars Section */}
        <div className="col-span-full sm:col-span-10 pl-0 sm:pl-4">
          <div className="space-y-1">
            {[...Array(5)].map((_, i) => (
              <div key={5 - i} className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, j) => (
                    <Icon
                      key={j}
                      icon="material-symbols-light:star-rounded"
                      width="24"
                      height="24"
                      className={j < 5 - i ? "text-red-600 fill-red-600" : "text-gray-300"}
                    />
                  ))}
                </div>
                <div className="w-full md:w-[80%] bg-gray-300 h-4 rounded-full">
                  {ratings[i] > 0 && (
                    <div
                      className="bg-red-600 h-4 rounded-full"
                      style={{ width: `${(ratings[i] / totalReviews) * 100}%` }}
                    ></div>
                  )}
                </div>
                <span className="text-gray-500">{ratings[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write a Review Button */}
      <div className="flex items-center justify-center">
        <button className="mt-4 w-fit px-6 py-3 rounded-3xl bg-red-600 text-white hover:bg-red-700 transition duration-300">
          Write a Review
        </button>
      </div>
    </div>
  );
};

const ReviewTabSection = () => {
  const [selectedReviewTab, setSelectedReviewTab] = useState("all");
  const totalReviews = 1;
  const ratings = [1, 0, 0, 0, 0];

  return (
    <div className="p-6 rounded-lg bg-white shadow-md">
      {/* Tab Menu */}
      <div className="flex flex-wrap justify-center sm:justify-start border-b border-black mb-4 space-x-2 sm:space-x-4 pb-2">
        {["Show all", "Most Helpful", "Highest Rating", "Lowest Rating"].map((tab, index) => (
          <button
            key={index}
            className={`px-3 py-2 text-sm sm:text-lg font-semibold transition rounded-2xl ${
              selectedReviewTab === tab ? "text-red-600 bg-gray-300" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setSelectedReviewTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Review Section */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-2">
          <Image
            width={1000}
            height={1000}
            src="/user-avatar.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="text-center sm:text-left">
            <div className="flex justify-center sm:justify-start">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  icon="material-symbols-light:star-rounded"
                  width="24"
                  height="24"
                  className="text-red-600 fill-red-600"
                />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-500">supervendor - June 17, 2019</p>
          </div>
        </div>
        <p className="mt-2 text-gray-700 text-sm sm:text-base text-center sm:text-left">
          I think this is the best product ever.
        </p>
      </div>

      {/* Add Review Section */}
      <div className="border-t pt-4">
        <p className="font-bold text-center sm:text-left">Add a review</p>
        <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
          You must be <span className="text-red-600 cursor-pointer hover:underline">logged in</span> to post a
          review.
        </p>
      </div>
    </div>
  );
};

function PostalCodeDetail() {
  return (
    <div className="container mx-auto">
      <AdBanner />
      <div className=" py-8">
        <WeatherFilter />

        <h4 className="md:text-4xl text-2xl font-bold my-7 text-center">
          World <span className="text-red-500"> Zip/postal </span> Codes
        </h4>

        <div className="mb-5 py-5">
          <h6 className="md:text-3xl text-xl font-semibold mb-3 px-2">Popular Countries:</h6>
          <div className="bg-gray-200 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6">
            {[...Array(4)].map((_, i) => (
              <>
                <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Image
                    src="/website/assets/images/country/01.png"
                    width={500}
                    height={500}
                    alt="country"
                    className="h-auto w-10"
                  />
                  USA
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Image
                    src="/website/assets/images/country/02.png"
                    width={500}
                    height={500}
                    alt="country"
                    className="h-auto w-10"
                  />
                  UK
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Image
                    src="/website/assets/images/country/03.png"
                    width={500}
                    height={500}
                    alt="country"
                    className="h-auto w-10"
                  />
                  New Zealand
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Image
                    src="/website/assets/images/country/02.png"
                    width={500}
                    height={500}
                    alt="country"
                    className="h-auto w-10"
                  />
                  UK
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Image
                    src="/website/assets/images/country/03.png"
                    width={500}
                    height={500}
                    alt="country"
                    className="h-auto w-10"
                  />
                  New Zealand
                </div>
              </>
            ))}
          </div>
        </div>

        <HoverBanner />

        <div className="mt-8 flex flex-col sm:flex-row items-center sm:justify-between bg-red-600 text-white px-4 sm:px-6 py-3 text-sm font-bold mb-8 rounded-lg">
          {/* Title */}
          <h5 className="text-xl sm:text-3xl text-center sm:text-left mb-3 sm:mb-0">Dilraba Dilmurat</h5>

          {/* Social Icons */}
          <div className="flex flex-wrap justify-center sm:justify-end items-center space-x-3">
            {[
              { icon: "ic:baseline-share", href: "#" },
              { icon: "logos:whatsapp-icon", href: "#" },
              { icon: "skill-icons:instagram", href: "#" },
              { icon: "logos:facebook", href: "#" },
              { icon: "devicon:linkedin", href: "#" },
              { icon: "logos:twitter", href: "#" },
            ].map(({ icon, href }, index) => (
              <Link key={index} href={href} className="hover:opacity-80 transition">
                <Icon icon={icon} width="20" height="20" className="w-6 sm:w-8 h-6 sm:h-8 cursor-pointer" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gray-300 rounded-lg p-4 w-full">
          {[
            { label: "Country", value: "Pakistan", bg: "bg-white" },
            { label: "State/Religion/Province", value: "Sindh", bg: "bg-gray-100" },
            { label: "City/Area", value: "Karachi Cantt.", bg: "bg-white" },
            { label: "Postal Code", value: "75530", bg: "bg-gray-100" },
          ].map(({ label, value, bg }, index) => (
            <div key={index} className={`grid grid-cols-1 sm:grid-cols-5 ${bg} p-2 rounded-lg mb-1`}>
              <span className="font-bold text-lg sm:text-xl col-span-3">{label}</span>
              <span className="text-red-500 sm:text-xl underline col-span-2">{value}</span>
            </div>
          ))}
        </div>

        <div className="mb-5 py-5">
          <h6 className="text-3xl font-semibold mb-3 px-2">Regions</h6>
          <div className="bg-gray-300 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
              {[
                "Azad Jammu And Kashmir",
                "Federal Capital",
                "Balochistan",
                "Gilgit Baltistan",
                "Sindh",
                "Punjab",
                "Khyber Pakhtunkhwa",
              ].map((region, index) => (
                <div
                  key={index}
                  className="text-red-500 text-lg sm:text-xl font-bold flex items-center gap-2"
                >
                  <Icon icon="bi:dot" width="16" height="16" className="h-6 w-6" />
                  {region}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ReviewSection />
        <ReviewTabSection />
      </div>
    </div>
  );
}

export default PostalCodeDetail;
