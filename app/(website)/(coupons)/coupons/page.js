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
        <div className=" bg-[#d9d9d9] pt-5 px-8 rounded-lg">
            <div className="flex items-center justify-between">
                <p className="text-red-500 text-2xl font-bold">{coupon.discount} <br /> Off</p>
                <p className=" font-semibold text-2xl text-gray-600">{coupon.details}</p>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">
                    Reveal Code
                </button>
            </div>
            <div className="border-t border-black  mt-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 border-r border-black py-2">
                        <p className='flex items-center gap-1'>See Details
                            <Icon icon="mynaui:plus-solid" width="18" height="18" className='mt-[2px]' />
                        </p>

                    </div>
                    <div className="col-span-2 px-20 flex items-center" >
                        <button className='bg-black px-6 py-1 rounded-2xl text-white w-fit'>
                            Code
                        </button>
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
            <AdBanner />

            <section className='px-32 bg-white'>
                <div className='flex items-center gap-1 px-32 py-4'>
                    <h6>Home</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Store Page</h6>
                </div>

                <div>
                    <h2 className='text-3xl font-bold text-center pb-3'>A Cherry on Top Coupons & Promo Codes</h2>
                </div>
            </section>

            <section className='px-6'>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 gap-y-4 mt-6 px-6">
                    <div className="col-span-3 bg-[#acacac] p-4 rounded-2xl h-fit">
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
                    <div className="col-span-9">
                        <div className="p-4">
                            {/* Sort By Tabs */}
                            <div className="flex items-center border-b border-black ">
                                <span className="text-gray-600 mr-2">SortBy:</span>
                                <button
                                    className={`mr-4 pb-1 text-lg font-medium ${activeTab === "popularity" ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"
                                        }`}
                                    onClick={() => setActiveTab("popularity")}
                                >
                                    Popularity
                                </button>
                                <button
                                    className={`pb-1 text-lg font-medium ${activeTab === "latest" ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"
                                        }`}
                                    onClick={() => setActiveTab("latest")}
                                >
                                    Latest
                                </button>
                                {/* Search Box */}
                                <div className="ml-auto relative">
                                    <SearchInput />
                                </div>
                            </div>

                            {/* Coupon Cards */}
                            <div className="mt-4 space-y-3">
                                {coupons.map((coupon, index) => (
                                    <CouponListCard key={index} coupon={coupon} />
                                ))}
                            </div>
                            <HoverBanner padding='0px' />

                            <div className="mt-4 space-y-3">
                                {coupons.map((coupon, index) => (
                                    <CouponListCard key={index} coupon={coupon} />
                                ))}
                            </div>

                            <HoverBanner padding='0px' />

                            <div className="mt-4 space-y-3">
                                {coupons.map((coupon, index) => (
                                    <CouponListCard key={index} coupon={coupon} />
                                ))}
                            </div>

                            <div className='flex justify-center mt-8'>
                                <button className='px-8 py-3  border  border-red-600 rounded-3xl text-red-600 bg-white'>
                                    <Link href={"#"} className='flex items-center justify-center font-bold'>
                                        Show More
                                        <Image src={"/website/assets/images/icons/slider.png"} width={1000} height={1000} alt="product" className="w-7 h-auto ml-1 mt-1" />
                                    </Link>

                                </button>
                            </div>
                        </div>


                    </div>

                    <div className="col-span-12">
                        <HoverBanner padding='0px'  />
                    </div>
                </div>
            </section>

        </>

    )
}

export default Coupons
