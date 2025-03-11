"use client";

import AdBanner from "@/components/partials/AdBanner";
import CategorySection from "@/components/partials/CategorySection";
import HoverBanner from "@/components/partials/HoverBanner";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import { homeCategory } from "@/constant/data";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ProfileCard = () => {
  return (
    <div className="bg-gray-300 mx-8 p-4 rounded-lg text-center mt-6 shadow-md">
      <Link href={"/biography/1"}>
        <Image
          src="/website/assets/images/biography/01.png"
          alt="Profile"
          width={1000}
          height={1000}
          className="w-full h-44 rounded-lg mx-auto mb-4"
        />
      </Link>

      <hr className="my-2 border-gray-400" />
      <p className="text-gray-800 font-semibold">Dislraba Dilmurat</p>
    </div>
  );
};

const FamousCelebrity = () => {
  const [activeTab, setActiveTab] = useState("popularity");
  return (
    <section className="md:px-48 pt-5 sm:px-6 px-4 mb-12">
      <h1 className="text-center md:text-5xl text-3xl font-bold text-[#ff0000] ">Famous Celebrity:</h1>
      <div className="mt-12">
        <div className="flex sm:flex-row flex-col-reverse items-center border-black ">
          <div className="mb-3 sm:mb-0">
            <span className=" md:text-xl text-sm font-semibold text-red-500 mr-6">Singer</span>
            <button
              className={`md:mr-4 text-sm  md:text-lg font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("showAll")}
            >
              Show All
            </button>
            <button
              className={` mr-4 md:text-lg text-sm font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </button>
            <button
              className={` mr-4 md:text-lg text-sm font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("bestRated")}
            >
              Best Rated
            </button>
          </div>

          <div className="md:ml-auto relative md:my-0 my-4">
            <SearchInput />
          </div>
        </div>

        <div className="divider h-[2px]  w-full bg-black">
          <div className="w-24 bg-[#ff0000] h-full"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-4 sm:grid-cols-2  mt-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="col-span-1">
            <ProfileCard />
          </div>
        ))}
      </div>
    </section>
  )
}

const Youtuber = () => {
  const [activeTab, setActiveTab] = useState("popularity");
  return (
    <section className="md:px-48 pt-5 sm:px-6 px-4 mb-12">
      <div className="mt-12">
        <div className="flex sm:flex-row flex-col-reverse items-center border-black ">
          <div className="my-3 sm:my-0">
            <span className=" md:text-xl text-sm font-semibold text-red-500 mr-6">Youtuber</span>
            <button
              className={`mr-4  md:text-lg text-sm font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("showAll")}
            >
              Show All
            </button>
            <button
              className={` mr-4 md:text-lg text-sm font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </button>
            <button
              className={` mr-4 md:text-lg text-sm font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("bestRated")}
            >
              Best Rated
            </button>
          </div>

          <div className="md:ml-auto relative">
            <SearchInput />
          </div>
        </div>

        <div className="divider h-[2px]  w-full bg-black">
          <div className="w-24 bg-[#ff0000] h-full"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-4 sm:grid-cols-2  mt-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="col-span-1">
            <ProfileCard />
          </div>
        ))}
      </div>
    </section>
  )
}

const Actor = () => {
  const [activeTab, setActiveTab] = useState("popularity");
  return (
    <section className="md:px-48 pt-5 sm:px-6 px-4 mb-12">
      <div className="mt-12">
        <div className="flex sm:flex-row flex-col-reverse items-center border-black ">
          <div className="my-3 sm:my-0">
            <span className=" md:text-xl text-sm font-semibold text-red-500 mr-6">Actor</span>
            <button
              className={`mr-4  md:text-lg text-sm font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("showAll")}
            >
              Show All
            </button>
            <button
              className={` mr-4 md:text-lg text-sm font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </button>
            <button
              className={` mr-4 md:text-lg text-sm font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("bestRated")}
            >
              Best Rated
            </button>
          </div>

          <div className="md:ml-auto relative">
            <SearchInput />
          </div>
        </div>

        <div className="divider h-[2px]  w-full bg-black">
          <div className="w-24 bg-[#ff0000] h-full"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-4 sm:grid-cols-2  mt-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="col-span-1">
            <ProfileCard />
          </div>
        ))}
      </div>
    </section>
  )
}
const Actresses = () => {
  const [activeTab, setActiveTab] = useState("popularity");
  return (
    <section className="md:px-48 pt-5 sm:px-6 px-4 mb-12">
      <div className="mt-12">
        <div className="flex sm:flex-row flex-col-reverse items-center border-black ">
          <div className="my-3 sm:my-0">
            <span className=" md:text-xl text-sm font-semibold text-red-500 mr-6">Actresses</span>
            <button
              className={`mr-4  md:text-lg text-sm font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("showAll")}
            >
              Show All
            </button>
            <button
              className={` mr-4 md:text-lg text-sm font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </button>
            <button
              className={` mr-4 md:text-lg text-sm font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("bestRated")}
            >
              Best Rated
            </button>
          </div>

          <div className="md:ml-auto relative">
            <SearchInput />
          </div>
        </div>

        <div className="divider h-[2px]  w-full bg-black">
          <div className="w-24 bg-[#ff0000] h-full"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-4 sm:grid-cols-2  mt-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="col-span-1">
            <ProfileCard />
          </div>
        ))}
      </div>
    </section>
  )
}


function Biography() {
  const [activeTab, setActiveTab] = useState("popularity");


  return (
    <div className="container mx-auto">
      <AdBanner />
      <CategorySection category={homeCategory} />
      <FamousCelebrity />
      <Youtuber />
      <div className="md:px-44 sm:px-12 px-2 py-8">
        <HoverBanner />
      </div>
      <Actor />
      <Actresses />
     
      <div className="flex justify-center py-5">
        <Pagination totalPages={10} />
      </div>

      <div className="md:px-44 sm:px-12 px-2 py-8">
        <HoverBanner />
      </div>
    </div>
  );
}

export default Biography;
