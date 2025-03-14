"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import SearchInput from "@/components/ui/SearchInput";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const SpecificationTable = () => {
    const specifications = [
        { label: "Brand", value: "Motorola" },
        { label: "Model", value: "65 Inch LED Ultra HD (4K) TV (65SAUHDM)" },
        { label: "Price", value: "₹57,999 (India)" },
        { label: "Model Name", value: "65SAUHDM" },
        { label: "Display Size", value: "65 inch" },
        { label: "Screen Type", value: "LED" },
        { label: "Color", value: "Black" },
        { label: "Resolution (pixels)", value: "3840×2160" },
        { label: "Resolution Standard", value: "4K" },
        { label: "3D", value: "No" },
        { label: "Smart TV", value: "Yes" },
        { label: "Curve TV", value: "No" },
        { label: "Launch Year", value: "2019" },
    ];

    return (
        <div className=" bg-white shadow-md rounded-lg p-6 border">
            <h2 className="text-lg font-semibold mb-4">General</h2>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-gray-700">
                    <tbody>
                        {specifications.map((item, index) => (
                            <tr key={index} className="odd:bg-gray-100 even:bg-white">
                                <td className="px-4 py-2 font-medium">{item.label}</td>
                                <td className="px-4 py-2">{item.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CompetitorCard = () => {
    return (
        <div className=" bg-gray-200 shadow-md rounded-lg p-4 border border-black">
            <h2 className="text-lg font-semibold text-gray-700 text-center">
                Motorola 65 Inch LED Ultra HD (4K) TV (65SAUHDM) Competitors
            </h2>
            <div className="bg-white mt-4 p-4 rounded-lg flex justify-center items-center gap-6 border">
                <div className="grid grid-cols-3 items-center">
                    <div className="flex col-span-1 flex-col items-center border-r border-gray-300">
                        <Image
                            width={1000}
                            height={1000}
                            src="/images/tv.png"
                            alt="Motorola TV"
                            className="w-28 h-20 object-cover rounded"
                        />
                        <p className="text-xs text-center mt-2 font-medium">
                            Motorola 65 Inch LED Ultra HD (4K) TV (65SAUHDM)
                        </p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center h-full border-r border-gray-300">
                        <button className="w-12 h-12 flex items-center justify-center bg-gray-100 border border-black rounded-full text-gray-500 text-2xl">
                            <Icon icon="tabler:plus" width="24" height="24" />
                        </button>
                    </div>
                    <div className="col-span-1 flex items-center h-full justify-center">
                        <button className="w-12 h-12 flex items-center justify-center bg-gray-100 border border-black rounded-full text-gray-500 text-2xl">
                            <Icon icon="tabler:plus" width="24" height="24" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-center">
                <button className="bg-red-500 flex items-center  text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-red-600 transition">
                    Compare{" "}
                    <Icon
                        icon="basil:caret-right-solid"
                        width="24"
                        height="24"
                        className="mt-0.5"
                    />
                </button>
            </div>
        </div>
    );
};

const ReviewSection = () => {
    const totalReviews = 1;
    const ratings = [1, 0, 0, 0, 0];

    return (
        <div className="px-4 sm:px-6 py-6 sm:py-10 bg-white shadow-md rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-0">
                {/* Left Section - Overall Rating */}
                <div className="sm:col-span-2 flex flex-col items-center sm:items-start sm:border-r-4 border-gray-200 pb-4 sm:pb-0">
                    <div className="flex items-end space-x-2">
                        <span className="text-5xl sm:text-6xl font-bold text-red-600">
                            5.0
                        </span>
                        <span className="text-gray-500 text-base sm:text-lg">out of 5</span>
                    </div>
                    <div className="flex items-center my-2">
                        {[...Array(5)].map((_, i) => (
                            <Icon
                                key={i}
                                icon="material-symbols-light:star-rounded"
                                width="28"
                                height="28"
                                className="text-red-600 fill-red-600"
                            />
                        ))}
                    </div>
                </div>

                {/* Right Section - Rating Distribution */}
                <div className="sm:col-span-10 pl-0 sm:pl-4">
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={5 - i} className="flex items-center space-x-2">
                                {/* Stars */}
                                <div className="flex">
                                    {[...Array(5)].map((_, j) => (
                                        <Icon
                                            key={j}
                                            icon="material-symbols-light:star-rounded"
                                            width="24"
                                            height="24"
                                            className={
                                                j < 5 - i
                                                    ? "text-red-600 fill-red-600"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full bg-gray-300 h-3 sm:h-4 rounded-full">
                                    {ratings[i] > 0 && (
                                        <div
                                            className="bg-red-600 h-3 sm:h-4 rounded-full"
                                            style={{ width: `${(ratings[i] / totalReviews) * 100}%` }}
                                        ></div>
                                    )}
                                </div>
                                {/* Review Count */}
                                <span className="text-gray-500 text-sm sm:text-base">
                                    {ratings[i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Write a Review Button */}
            <div className="flex items-center justify-center">
                <button className="mt-4 w-full sm:w-fit px-6 sm:px-10 py-2 sm:py-3 rounded-3xl bg-red-600 text-white hover:bg-red-700 transition">
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
        <div className="p-4 sm:p-6 rounded-lg bg-white shadow">
            {/* Tab Menu */}
            <div className="flex overflow-x-auto sm:justify-start border-b border-black mb-4 space-x-2 sm:space-x-4 pb-2">
                {["Show all", "Most Helpful", "Highest Rating", "Lowest Rating"].map(
                    (tab, index) => (
                        <button
                            key={index}
                            className={`whitespace-nowrap px-3 py-2 text-base sm:text-lg font-medium transition
            ${selectedReviewTab === tab
                                    ? "text-red-600 bg-gray-300 rounded-2xl"
                                    : "text-gray-500 hover:text-red-600"
                                }`}
                            onClick={() => setSelectedReviewTab(tab)}
                        >
                            {tab}
                        </button>
                    )
                )}
            </div>

            {/* Review Section */}
            <div className="mb-4">
                <div className="flex items-center space-x-2">
                    <Image
                        width={40}
                        height={40}
                        src="/user-avatar.png"
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <div className="flex items-center">
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
                        <p className="text-xs sm:text-sm text-gray-500">
                            supervendor - June 17, 2019
                        </p>
                    </div>
                </div>
                <p className="mt-2 text-gray-700 text-sm sm:text-base">
                    I think this is the best product ever
                </p>
            </div>

            {/* Add Review Section */}
            <div className="border-t pt-4">
                <p className="font-bold text-base sm:text-lg">Add a review</p>
                <p className="text-sm text-gray-500">
                    You must be{" "}
                    <span className="text-red-600 cursor-pointer hover:underline">
                        logged in to post
                    </span>{" "}
                    a review.
                </p>
            </div>
        </div>

    );
};

function SpecificationDetail() {
    const [activeTab, setActiveTab] = useState("popularity");
    const [selectedImage, setSelectedImage] = useState(
        "/website/assets/images/specifacationCard/game/01.png"
    );
    const images = [
        { id: 1, src: "/images/big1.jpg", thumb: "/images/thumb1.jpg" },
        { id: 2, src: "/images/big2.jpg", thumb: "/images/thumb2.jpg" },
        { id: 3, src: "/images/big3.jpg", thumb: "/images/thumb3.jpg" },
    ];
    return (
        <div className="">
            <AdBanner />
            <section className="md:px-48 px-4 bg-white">
                <div className="flex items-center gap-1 md:px-32 py-4">
                    <h6>Home</h6>
                    <Icon
                        icon="basil:caret-right-solid"
                        className="mt-[2px]"
                        width="18"
                        height="18"
                    />
                    <h6>Specification</h6>
                    <Icon
                        icon="basil:caret-right-solid"
                        className="mt-[2px]"
                        width="18"
                        height="18"
                    />
                    <h6>Product Name</h6>
                </div>

                <div className="md:px-48">
                    <h2 className="text-3xl font-bold  pb-3">
                        Motorola 65 Inch LED Ultra HD (4K) TV (65SAUHDM)
                    </h2>
                </div>
            </section>

            <section className="md:px-48 py-8">
                <div className="md:px-48 px-4">
                    <div className="flex items-center border-black md:pb-0 pb-4">
                        <span className=" md:text-xl text-sm font-semibold text-red-500 mr-6">
                            Overview
                        </span>
                        <button
                            className={`mr-4  md:text-lg text-sm font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab("showAll")}
                        >
                            Specs
                        </button>
                        <button
                            className={` mr-4 md:text-lg text-sm font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab("popular")}
                        >
                            Comparisons
                        </button>
                        <button
                            className={` mr-4 md:text-lg text-sm font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab("bestRated")}
                        >
                            User Reviews
                        </button>
                        {/* Search Box */}
                        <div className="ml-auto relative md:block hidden">
                            <SearchInput />
                        </div>
                    </div>

                    <div className="divider h-[2px]  w-full bg-black">
                        <div className="w-24 bg-[#ff0000] h-full"></div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 grid-cols-1 mt-6 gap-6 items-center">
                    <div className="col-span-1">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Left Section - Small Images */}
                            <div className="flex sm:flex-col items-center sm:items-start justify-center gap-2 pt-4 sm:pt-7">
                                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border border-black p-2 sm:p-3">
                                    <Image
                                        src="/website/assets/images/specifacationCard/game/02.png"
                                        alt="spec-image"
                                        width={1000}
                                        height={1000}
                                        className="w-full h-full object-contain cursor-pointer"
                                        onClick={() =>
                                            setSelectedImage(
                                                "/website/assets/images/specifacationCard/game/02.png"
                                            )
                                        }
                                    />
                                </div>
                                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border border-black p-2 sm:p-3">
                                    <Image
                                        src="/website/assets/images/specifacationCard/game/01.png"
                                        alt="spec-image"
                                        width={1000}
                                        height={1000}
                                        className="w-full h-full object-contain cursor-pointer"
                                        onClick={() =>
                                            setSelectedImage(
                                                "/website/assets/images/specifacationCard/game/01.png"
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Right Section - Large Image */}
                            <div className="col-span-2 h-[250px] sm:h-[400px] w-full">
                                <Image
                                    src={selectedImage}
                                    alt="spec-image"
                                    width={1000}
                                    height={1000}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 col-span-1 p-4 sm:p-6">
                        <div className="bg-[#d9d9d9] px-4 pt-4 rounded-xl w-full mb-4 shadow-md">
                            {/* Game Title */}
                            <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-600 underline">
                                <Link href="#">Red Dead Redemption 2</Link>
                            </h2>

                            {/* Icons Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                                {[
                                    "/website/assets/images/specifacationCard/game/icon-2.png",
                                    "/website/assets/images/specifacationCard/game/icon-1.png",
                                    "/website/assets/images/specifacationCard/game/icon-3.png",
                                    "/website/assets/images/specifacationCard/game/icon-4.png",
                                    "/website/assets/images/specifacationCard/game/icon-4.png",
                                    "/website/assets/images/specifacationCard/game/icon-4.png",
                                ].map((icon, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Image
                                            src={icon}
                                            alt="icon"
                                            width={40}
                                            height={40}
                                            className="w-10 h-10"
                                        />
                                        <span className="text-gray-600 text-sm sm:text-base">
                                            Modes: Single-player, Multiplayer
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Release Date Section */}
                            <div className="border-t border-black mx-4 mt-4">
                                <div className="flex flex-col items-center py-3">
                                    <span className="text-black text-lg font-semibold">
                                        Release Date
                                    </span>
                                    <span className="text-gray-600 text-sm font-semibold">
                                        17th January 2024
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <HoverBanner padding="0px" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {/* Image Gallery Section */}
                    <div className="md:col-span-1 flex flex-col items-center">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {/* Small Image Thumbnails */}
                            {[
                                "/website/assets/images/specifacationCard/game/02.png",
                                "/website/assets/images/specifacationCard/game/01.png",
                            ].map((img, index) => (
                                <div
                                    key={index}
                                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border border-black p-2 cursor-pointer"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <Image
                                        src={img}
                                        alt="spec-image"
                                        width={1000}
                                        height={1000}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Large Image Display */}
                        <div className="mt-4 w-full max-w-md sm:max-w-lg md:max-w-none">
                            <Image
                                src={selectedImage}
                                alt="spec-image"
                                width={1000}
                                height={1000}
                                className="w-full h-64 sm:h-80 object-contain"
                            />
                        </div>
                    </div>

                    {/* Specifications Section */}
                    <div className="md:col-span-2">
                        <h5 className="text-gray-400 font-bold text-lg sm:text-xl mb-4">
                            Motorola 65 Inch LED Ultra HD (4K) TV (65SAUHDM) Full
                            Specifications
                        </h5>
                        <SpecificationTable />
                    </div>
                </div>

                <div className="py-10">
                    <HoverBanner />
                </div>

                <div className="grid md:grid-cols-3 grid-cols-1 px-4 md:px-0 mt-6 gap-6">
                    <div className="col-span-1"></div>
                    <div className="md:col-span-2 col-span-1">
                        <h5 className="text-gray-400 font-bold text-xl mb-4">
                            Motorola 65 Inch LED Ultra HD (4K) TV (65SAUHDM) Full
                            Specifications
                        </h5>
                        <SpecificationTable />
                    </div>
                </div>

                <div className="py-10">
                    <HoverBanner />
                </div>

                <div className="grid md:grid-cols-3 grid-cols-1 mt-6 px-4 md:px-0 gap-6">
                    <div className="col-span-1"></div>
                    <div className="col-span-2">
                        <h5 className="text-gray-400 font-bold text-xl mb-4">
                            Motorola 65 Inch LED Ultra HD (4K) TV (65SAUHDM) Full
                            Specifications
                        </h5>
                        <SpecificationTable />
                    </div>
                </div>

                <div className="py-10">
                    <HoverBanner />
                </div>

                <div className="grid md:grid-cols-3 grid-cols-1 px-4 md:px-0 mt-6 gap-6">
                    <div className="col-span-1"></div>
                    <div className="md:col-span-2">
                        <h5 className="text-gray-400 font-bold text-xl mb-4">
                            Motorola 65 Inch LED Ultra HD (4K) TV (65SAUHDM) Full
                            Specifications
                        </h5>
                        <SpecificationTable />
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <button className="px-8 py-3  border  border-red-600 rounded-3xl text-red-600 bg-white">
                        <Link
                            href={"#"}
                            className="flex items-center justify-center font-bold"
                        >
                            Load More
                            <Image
                                src={"/website/assets/images/icons/slider.png"}
                                width={1000}
                                height={1000}
                                alt="product"
                                className="w-7 h-auto ml-1 mt-1"
                            />
                        </Link>
                    </button>
                </div>

                <div className="py-10">
                    <HoverBanner />
                </div>

                <div className="grid md:grid-cols-3 grid-cols-1 px-4 md:px-0 mt-6 gap-6">
                    <div className="col-span-1"></div>
                    <div className="md:col-span-2">
                        <CompetitorCard />
                    </div>
                    <div className="md:col-span-3">
                        <ReviewSection />
                    </div>
                    <div className="md:col-span-3">
                        <ReviewTabSection />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SpecificationDetail;
