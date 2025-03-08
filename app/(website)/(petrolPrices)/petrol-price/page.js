"use client";

import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner';
import { Icon } from '@iconify/react'
import Image from 'next/image';
import React from 'react'


function FuelPriceList() {

    const fuelPrices = [
        { city: "KOLKATA", today: "94.77 ₹/L", yesterday: "94.77 ₹/L", change: "0.00 ₹/L" },
        { city: "Chennai", today: "102.92 ₹/L", yesterday: "102.92 ₹/L", change: "0.00 ₹/L" },
        { city: "Banglore", today: "105.1 ₹/L", yesterday: "105.1 ₹/L", change: "+0.10 ₹/L" },
        { city: "New Delhi", today: "100.80 ₹/L", yesterday: "100.80 ₹/L", change: "0.00 ₹/L" },
        { city: "Noida", today: "95.25 ₹/L", yesterday: "95.25 ₹/L", change: "0.00 ₹/L" },
        { city: "Mumbai", today: "105.1 ₹/L", yesterday: "105.1 ₹/L", change: "-0.14 ₹/L" },
        { city: "14 January 2025", today: "95.25 ₹/L", yesterday: "95.25 ₹/L", change: "+0.10 ₹/L" },
    ];
    return (
        <div className=" bg-gray-300 p-4 rounded-3xl ">
            {/* Header */}
            <div className="flex justify-between bg-gray-300 p-3 font-semibold">
                <span className="w-1/4">City</span>
                <span className="w-1/4">Today Price</span>
                <span className="w-1/4">Yesterday Price</span>
                <span className="w-1/4">% Change</span>
            </div>

            {/* List Items */}
            {fuelPrices.map((row, index) => (
                <div key={index} className="flex justify-between bg-white p-3 border-t">
                    <span className="w-1/4">{row.city}</span>
                    <span className="w-1/4">{row.today}</span>
                    <span className="w-1/4">{row.yesterday}</span>
                    <span className={`w-1/4 ${row.change.includes('+') ? 'text-green-500' : row.change.includes('-') ? 'text-red-500' : ''}`}>
                        {row.change}
                    </span>
                </div>
            ))}
        </div>
    );
}

function PetrolPrice() {
    return (
        <div className=''>
            <AdBanner />
            <div className='px-48 py-6 container mx-auto'>
                <div className='flex items-center gap-1  '>
                    <h6 className='text-red-500'>Home</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Petrol Price</h6>
                    
                </div>

                <div className='relative py-10'>
                    <h4 className='text-5xl text-center font-bold '>Petrol Price in <span className='text-red-500'>Pakistan</span> </h4>
                    <p className='text-lg text-center text-red-500'>Last Updated: 10th January 2025</p>
                    <div className="flex absolute top-5 -right-4 items-center space-x-1 px-5 py-2  rounded-full w-fit ">
                        <div className="p-2  cursor-pointer">
                            <Icon icon="material-symbols:share" className='text-xl' />
                        </div>

                        <div className="flex  ">
                            <a href="#" className="p-2 ">
                                <Icon icon="logos:whatsapp-icon" className="text-green-500 text-xl" />
                            </a>
                            <a href="#" className="p-2 ">
                                <Icon icon="skill-icons:instagram" className="text-pink-500 text-xl" />
                            </a>
                            <a href="#" className="p-2 ">
                                <Icon icon="logos:facebook" className="text-blue-600 text-xl" />
                            </a>
                            <a href="#" className="p-2 ">
                                <Icon icon="logos:linkedin-icon" className="text-blue-700 text-xl" />
                            </a>
                            <a href="#" className="p-2 ">
                                <Icon icon="mdi:twitter" className="text-black text-xl" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className='mb-6'>
                    <h4 className='text-3xl px-2 mb-4'>Today's Petrol Prices In India Metro Cities</h4>
                    <FuelPriceList />
                </div>
                <div>
                    <h4 className='text-3xl px-2 mb-4'>Today's Petrol Prices In India Metro Cities</h4>
                    <FuelPriceList />
                </div>

                <HoverBanner padding='0px' />
                <div>
                    <h4 className='px-2 text-2xl font-bold '>Latest Fuel News</h4>
                    <div className='bg-[#d9d9d9] p-6 rounded-2xl mt-3'>
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className='flex items-center gap-4 bg-white p-3 mb-4 rounded-3xl'>
                                <Image src="/website/assets/images/news/01.png" width={1000} height={1000} className='w-28 h-28 object-cover rounded-lg border border-red-500' />

                                <h4 className='text-2xl font-semibold'>Climate Crisis: Fossil Fuel Plants That Power BTC Mining to Lose Permits in New York State</h4>
                            </div>
                        ))}

                    </div>

                    <div className='flex items-end justify-center w-full'>
                        <button className='py-3 mt-5 px-8 border border-red-500 bg-white rounded-2xl'>
                            Show More
                            <Icon icon="basil:caret-down-outline" width="24" height="24" className='inline' />
                        </button>
                    </div>
                </div>

                  <Image src={"/website/assets/images/banner/01.png"} width={2000} height={2000} alt="ad-banner" className=' h-auto  w-full my-10 ' />


            </div>

        </div>
    )
}

export default PetrolPrice
