"use client";

import AdBanner from "@/components/partials/AdBanner";
import CategorySection from "@/components/partials/CategorySection";
import HoverBanner from "@/components/partials/HoverBanner";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import { homeCategory } from "@/constant/data";
import Image from "next/image";
import React, { useState } from "react";

const ProfileCard = () => {
  return (
    <div className="bg-gray-300 mx-8 p-4 rounded-lg text-center mt-6 shadow-md">
      <Image
        src="/website/assets/images/biography/01.png"
        alt="Profile"
        width={1000}
        height={1000}
        className="w-full h-44 rounded-lg mx-auto mb-4"
      />

      <hr className="my-2 border-gray-400" />
      <p className="text-gray-800 font-semibold">Dislraba Dilmurat</p>
    </div>
  );
};

function Biography() {
  const [activeTab, setActiveTab] = useState("popularity");

  return (
    <div className="container mx-auto">
      <AdBanner />
      <CategorySection category={homeCategory} />
      <h1 className="text-center text-5xl font-bold text-[#ff0000]">Famous Celebrity:</h1>

      <section className="px-48 pt-5 mb-12">
        <div className="mt-12">
          <div className="flex items-center border-black ">
            <span className=" text-xl font-semibold text-red-500 mr-6">Singer</span>
            <button
              className={`mr-4  text-lg font-medium ${
                activeTab === "showAll" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("showAll")}
            >
              Show All
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "popular" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("bestRated")}
            >
              Best Rated
            </button>
            {/* Search Box */}
            <div className="ml-auto relative">
              <SearchInput />
            </div>
          </div>

          <div className="divider h-[2px]  w-full bg-black">
            <div className="w-24 bg-[#ff0000] h-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-4  mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col-span-1">
              <ProfileCard />
            </div>
          ))}
        </div>
      </section>
      <section className="px-48 pt-5 mb-12">
        <div className="mt-12">
          <div className="flex items-center border-black ">
            <span className=" text-xl font-semibold text-red-500 mr-6">Youtuber</span>
            <button
              className={`mr-4  text-lg font-medium ${
                activeTab === "showAll" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("showAll")}
            >
              Show All
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "popular" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("bestRated")}
            >
              Best Rated
            </button>
            {/* Search Box */}
            <div className="ml-auto relative">
              <SearchInput />
            </div>
          </div>

          <div className="divider h-[2px]  w-full bg-black">
            <div className="w-24 bg-[#ff0000] h-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-4  mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col-span-1">
              <ProfileCard />
            </div>
          ))}
        </div>
      </section>

      <HoverBanner />

      <section className="px-48 pt-5 mb-12">
        <div className="mt-12">
          <div className="flex items-center border-black ">
            <span className=" text-xl font-semibold text-red-500 mr-6">Actor</span>
            <button
              className={`mr-4  text-lg font-medium ${
                activeTab === "showAll" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("showAll")}
            >
              Show All
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "popular" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("bestRated")}
            >
              Best Rated
            </button>
            {/* Search Box */}
            <div className="ml-auto relative">
              <SearchInput />
            </div>
          </div>

          <div className="divider h-[2px]  w-full bg-black">
            <div className="w-24 bg-[#ff0000] h-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-4  mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col-span-1">
              <ProfileCard />
            </div>
          ))}
        </div>
      </section>
      <section className="px-48 pt-5 mb-12">
        <div className="mt-12">
          <div className="flex items-center border-black ">
            <span className=" text-xl font-semibold text-red-500 mr-6">Actresses</span>
            <button
              className={`mr-4  text-lg font-medium ${
                activeTab === "showAll" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("showAll")}
            >
              Show All
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "popular" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("bestRated")}
            >
              Best Rated
            </button>
            {/* Search Box */}
            <div className="ml-auto relative">
              <SearchInput />
            </div>
          </div>

          <div className="divider h-[2px]  w-full bg-black">
            <div className="w-24 bg-[#ff0000] h-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-4  mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col-span-1">
              <ProfileCard />
            </div>
          ))}
        </div>
      </section>

      <HoverBanner />

      <section className="px-48 pt-5 mb-12">
        <div className="mt-12">
          <div className="flex items-center border-black ">
            <span className=" text-xl font-semibold text-red-500 mr-6">Actor</span>
            <button
              className={`mr-4  text-lg font-medium ${
                activeTab === "showAll" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("showAll")}
            >
              Show All
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "popular" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("bestRated")}
            >
              Best Rated
            </button>
            {/* Search Box */}
            <div className="ml-auto relative">
              <SearchInput />
            </div>
          </div>

          <div className="divider h-[2px]  w-full bg-black">
            <div className="w-24 bg-[#ff0000] h-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-4  mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col-span-1">
              <ProfileCard />
            </div>
          ))}
        </div>
      </section>
      <section className="px-48 pt-5 mb-12">
        <div className="mt-12">
          <div className="flex items-center border-black ">
            <span className=" text-xl font-semibold text-red-500 mr-6">Actresses</span>
            <button
              className={`mr-4  text-lg font-medium ${
                activeTab === "showAll" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("showAll")}
            >
              Show All
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "popular" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </button>
            <button
              className={` mr-4 text-lg font-medium ${
                activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("bestRated")}
            >
              Best Rated
            </button>
            {/* Search Box */}
            <div className="ml-auto relative">
              <SearchInput />
            </div>
          </div>

          <div className="divider h-[2px]  w-full bg-black">
            <div className="w-24 bg-[#ff0000] h-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-4  mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col-span-1">
              <ProfileCard />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center py-5">
        <Pagination totalPages={10} />
      </div>

      <HoverBanner />
    </div>
  );
}

export default Biography;
