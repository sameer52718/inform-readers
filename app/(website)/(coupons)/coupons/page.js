"use client"; // For Next.js App Router

import AdBanner from '@/components/partials/AdBanner'
import CategoryBox from '@/components/partials/CategoryBox'
import HoverBanner from '@/components/partials/HoverBanner';
import SearchInput from '@/components/ui/SearchInput';
import { categories, couponData, shopData } from '@/constant/data'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useState } from "react";



const CouponListCard = ({ coupon }) => {

    return (
        <div className="bg-[#d9d9d9] pt-5 px-6 sm:px-8 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                <p className="text-red-500 text-xl sm:text-2xl font-bold text-center sm:text-left">
                    {coupon.discount} <br className="hidden sm:block" /> Off
                </p>
                <p className="font-semibold text-lg sm:text-2xl text-gray-600 text-center sm:text-left">
                    {coupon.details}
                </p>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto">
                    Reveal Code
                </button>
            </div>
            <div className="border-t border-black mt-4">
                <div className="grid grid-cols-1">
                    <div className="py-2">
                        <p className="flex justify-center items-center gap-1 text-center">
                            See Details
                            <Icon icon="mynaui:plus-solid" width="18" height="18" className="mt-[2px]" />
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
}


const coupons = [
    { discount: "10%", details: "Extra 10% Off Sitewide", code: "SAVE10" },
    { discount: "20%", details: "Extra 20% Off Sitewide", code: "SAVE20" },
    { discount: "20%", details: "Extra 20% Off Sitewide", code: "SAVE20" },
];





function Coupons() {
    const [activeTab, setActiveTab] = useState("popularity");
    return (
        <>
            <div className='container mx-auto'>
                <AdBanner />

            </div>

            <section className='md:px-32 bg-white'>
                <div className='flex items-center gap-1 md:px-32 px-4 py-4'>
                    <h6>Home</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Store Page</h6>
                </div>
                <h2 className='md:text-3xl text-xl font-bold text-center pb-6'>A Cherry on Top Coupons & Promo Codes</h2>
            </section>

            <div className='container mx-auto md:px-44' >
                <div className="grid grid-cols-12 gap-5 gap-y-4 mt-6 px-6">
                    <div className="md:col-span-3 col-span-12 bg-[#d9d9d9] p-4 rounded-2xl h-fit">
                        <div className='bg-white h-40 rounded-xl flex items-center justify-center'>
                            <Image src={'/website/assets/images/coupons/01.png'} alt='coupon' width={1000} height={1000} className='w-56 h-auto object-contain' />
                        </div>

                        <h6 className='text-lg mt-8 leading-6 font-semibold'>
                            When you buy through links on Informreaders <Link href={"#"} className='text-[#ff0000]'>  we  may earn commission.</Link>
                        </h6>


                        <h6 className='text-lg mt-8 leading-6 font-semibold'>
                            Today's top A Cherry on Top offers:
                        </h6>
                        <ul className='pb-2'>
                            <li className='list-disc ml-4 mt-1 font-semibold'>Extra 10% Off Sitewide</li>
                            <li className='list-disc ml-4 mt-1 font-semibold'>Extra $5 Off Orders $25+</li>
                        </ul>

                        <h6 className='text-lg mt-2 mb-0 leading-6 font-semibold flex items-center justify-between'>
                            Total Offers
                            <span>0</span>
                        </h6>
                        <h6 className='text-lg mt-2 mb-0 leading-6 font-semibold flex items-center justify-between'>
                            Coupon Codes
                            <span>0</span>
                        </h6>
                        <h6 className='text-lg mt-2 mb-0 leading-6 font-semibold flex items-center justify-between'>
                            In-Store Coupons
                            <span>0</span>
                        </h6>
                        <h6 className='text-lg mt-2 mb-0 leading-6 font-semibold flex items-center justify-between'>
                            Free Shipping Deals
                            <span>0</span>
                        </h6>

                        <div className='mt-10'>
                            <h5 className='text-2xl font-semibold pb-2'>Categories</h5>

                            <CategoryBox categories={categories} />
                        </div>

                        <div className='mt-10'>
                            <h5 className='text-2xl font-semibold pb-2'>Other Shops</h5>

                            <div className='grid grid-cols-3 gap-1'>
                                {shopData.map((item, index) => (
                                    <div key={index} className='bg-white py-0  mb-1  col-span-1'>
                                        <Image src={item.image} alt='coupon' width={1000} height={1000} className='w-full h-10 object-contain' />
                                    </div>
                                ))}

                            </div>

                        </div>
                    </div>
                    <div className="md:col-span-9 col-span-12">
                        <div className="md:p-4">
                            <div className="flex md:flex-row flex-col-reverse items-center border-b border-black ">
                                <div className='md:py-0 py-4'>
                                    <span className="text-gray-600 mr-2">SortBy:</span>
                                    <button
                                        className={`mr-4 pb-1 md:text-lg text-sm font-medium ${activeTab === "popularity" ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"
                                            }`}
                                        onClick={() => setActiveTab("popularity")}
                                    >
                                        Popularity
                                    </button>
                                    <button
                                        className={`pb-1 md:text-lg text-sm font-medium ${activeTab === "latest" ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"
                                            }`}
                                        onClick={() => setActiveTab("latest")}
                                    >
                                        Latest
                                    </button>
                                </div>

                                {/* Search Box */}
                                <div className="md:ml-auto relative">
                                    <SearchInput />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            {coupons.map((coupon, index) => (
                                <CouponListCard key={index} coupon={coupon} />
                            ))}
                        </div>

                        <div className=" py-8">
                            <HoverBanner />
                        </div>

                        <div className="mt-4 space-y-3">
                            {coupons.map((coupon, index) => (
                                <CouponListCard key={index} coupon={coupon} />
                            ))}
                        </div>

                        <div className=" py-8">
                            <HoverBanner />
                        </div>

                        <div className="mt-4 space-y-3">
                            {coupons.map((coupon, index) => (
                                <CouponListCard key={index} coupon={coupon} />
                            ))}
                        </div>

                        <div className='flex justify-center my-8'>
                            <button className='px-8 py-3  border  border-red-600 rounded-3xl text-red-600 bg-white'>
                                <Link href={"#"} className='flex items-center justify-center font-bold'>
                                    Show More
                                    <Image src={"/website/assets/images/icons/slider.png"} width={1000} height={1000} alt="product" className="w-7 h-auto ml-1 mt-1" />
                                </Link>

                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>
        </>

    )
}

export default Coupons
