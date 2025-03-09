"use client"

import AdBanner from '@/components/partials/AdBanner'
import FlightFilter from '@/components/partials/FlightFilter'
import FlightSearchFilter from '@/components/partials/FlightSearchFilter'
import HoverBanner from '@/components/partials/HoverBanner'
import SearchInput from '@/components/ui/SearchInput'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import React, { useState } from 'react'



function FlightCard() {
    const flights = [
        {
            id: 1,
            airlineLogo: "/website/assets/images/flight/03.png",
            departureTime: "1:30 pm",
            arrivalTime: "3:15 pm",
            duration: "1h 45m",
            stops: "nonstop",
            price: "$157",
            class: "Economy",
            best: false,
            cheapest: false,
        },
        {
            id: 2,
            airlineLogo: "/website/assets/images/flight/03.png", // Replace with actual image source

            departureTime: "11:30 pm",
            arrivalTime: "6:15 pm",
            duration: "1h 45m",
            stops: "nonstop",
            price: "$157",
            class: "Economy",
            best: true,
            cheapest: true,
        },
    ];

    return (
        <div className="">
            {flights.map((flight) => (
                <div key={flight.id} className="bg-gray-200 p-4 mb-4 gap-2 rounded-lg grid grid-cols-12 border">
                    <div className='col-span-9'>
                        <div className="flex   items-center space-x-4  border-black py-5 px-5">
                            <input type="checkbox" className="cursor-pointer" />
                            <Image src={flight.airlineLogo} alt="Airline Logo" className="w-16 h-16" width={1000} height={1000} />
                            <div>
                                <p className="font-semibold">
                                    {flight.departureTime} — {flight.arrivalTime}
                                </p>
                                <p className="text-sm text-gray-500">{flight.stops} • {flight.duration}</p>
                            </div>
                            {flight.best && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Best</span>}
                            {flight.cheapest && <span className="bg-black text-white text-xs px-2 py-1 rounded">Cheapest</span>}
                        </div>
                        <div className='divider h-[2px] w-full bg-black'></div>
                        <div className="flex   items-center space-x-4  border-black py-5 px-5">
                            <input type="checkbox" className="cursor-pointer" />
                            <Image src={flight.airlineLogo} alt="Airline Logo" className="w-16 h-16" width={1000} height={1000} />
                            <div>
                                <p className="font-semibold">
                                    {flight.departureTime} — {flight.arrivalTime}
                                </p>
                                <p className="text-sm text-gray-500">{flight.stops} • {flight.duration}</p>
                            </div>
                            {flight.best && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Best</span>}
                            {flight.cheapest && <span className="bg-black text-white text-xs px-2 py-1 rounded">Cheapest</span>}
                        </div>
                    </div>

                    <div className="bg-gray-200 px-2 py-6  w-40 flex justify-between flex-col items-center space-y-3 border-l border-black">
                        <div className="flex space-x-2">
                            <div className="border-2 bg-white border-red-500 px-2 py-1 rounded-lg flex items-center space-x-1 text-sm font-semibold">
                                <Icon icon="mdi:suitcase" className="text-red-500" />
                                <span>1</span>
                            </div>
                            <div className="border-2 bg-white border-red-500 px-2 py-1 rounded-lg flex items-center space-x-1 text-sm font-semibold">
                                <Icon icon="mdi:suitcase" className="text-red-500" />
                                <span>0</span>
                            </div>
                        </div>
                        <div className="">
                            <p className="text-xl font-bold">$157</p>
                            <p className="text-gray-500 text-sm">Economy</p>
                            <button className="bg-red-500 text-white text-lg font-semibold px-6 py-2 w-full rounded-lg">Select</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}


function FlightListing() {
    const [activeTab, setActiveTab] = useState("Best");
    const tabs = ["Cheapest", "Best", "Quickest"];
    return (
        <div>
            <AdBanner />
            <div className='container mx-auto px-44 py-8'>
                <div className='flex items-center my-5 gap-10'>
                    <div className='text-xl flex items-center gap-2'>
                        <Icon icon="material-symbols:flights-and-hotels-outline" width="24" height="24" />
                        <span className='text-gray-500 font-bold'>
                            Flights
                        </span>
                    </div>
                    <div className='text-xl flex items-center gap-2'>
                        <Icon icon="material-symbols-light:bed" width="24" height="24" />
                        <span className='text-gray-500 font-bold'>
                            Hotels
                        </span>
                    </div>
                    <div className='text-xl flex items-center gap-2'>
                        <Icon icon="lucide:car" width="24" height="24" />
                        <span className='text-gray-500 font-bold'>
                            Rental Cars
                        </span>
                    </div>
                    <div className='text-xl flex items-center gap-2'>
                        <Icon icon="stash:search-solid" width="24" height="24" />
                        <span className='text-gray-500 font-bold'>
                            Jobs
                        </span>
                    </div>
                    <div className='text-xl flex items-center gap-2'>
                        <Icon icon="codicon:key" width="24" height="24" />
                        <span className='text-gray-500 font-bold'>
                            Real Estate
                        </span>
                    </div>
                </div>
                <FlightFilter />

                <div className='grid grid-cols-12 gap-10 mt-6'>
                    <div className="col-span-3">
                        <FlightSearchFilter />
                    </div>
                    <div className="col-span-9 px-10 py-2">
                        <div className="flex  border-b border-gray-300 relative">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={` px-4 text-start text-sm font-semibold transition-colors ${activeTab === tab ? "text-red-500" : "text-gray-600"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                            <div
                                className="absolute bottom-0 h-1 bg-red-500 transition-all"
                                style={{ left: `${tabs.indexOf(activeTab) * 100}px`, width: "50px" }}
                            ></div>
                            <div className="ml-auto px-2 flex items-center">
                                <SearchInput />
                            </div>
                        </div>
                        <div className='mt-5'>
                            <FlightCard />
                            <FlightCard />
                            <FlightCard />
                            <FlightCard />
                            <FlightCard />
                            <FlightCard />
                            <FlightCard />
                        </div>
                        <div className='flex items-center justify-center'>
                            <button className='bg-red-500 text-white text-lg font-semibold px-6 py-2 w-fit rounded-lg'>See More</button>
                        </div>

                        <div>
                            <h4 className='text-3xl font-semibold'>Stays near Dubai</h4>
                            <p className='text-gray-500'>Fri, Feb 7 - Fri, Feb 14</p>

                            <div className='grid grid-cols-3 gap-3 mt-6  mb-8'>
                                {[...Array(3)].map((item) => (
                                    <div className="border rounded-xl shadow-lg p-3  bg-white">
                                        <div className="rounded-xl overflow-hidden border">
                                            <Image
                                                src="/website/assets/images/news/06.png"
                                                alt="Hotel Image"
                                                className="w-full h-48 object-cover"
                                                width={1000}
                                                height={1000}
                                            />
                                        </div>
                                        <div className="p-2">
                                            <h3 className="text-sm font-semibold text-gray-800">Canopy by Hilton Dubai Al Seef</h3>
                                            <div className="flex items-center space-x-1 mt-1">
                                                <Icon icon="mdi:star" className="text-red-500 text-sm" />
                                                <Icon icon="mdi:star" className="text-red-500 text-sm" />
                                                <Icon icon="mdi:star" className="text-red-500 text-sm" />
                                                <Icon icon="mdi:star" className="text-red-500 text-sm" />
                                                <Icon icon="mdi:star-outline" className="text-red-500 text-sm" />
                                                <span className="text-xs text-gray-600">Very good 8.2</span>
                                            </div>
                                            <p className="text-red-600 font-semibold text-sm mt-1">Bur Dubai</p>
                                            <p className="text-black font-bold text-sm">
                                                $149<span className="text-gray-600 font-normal">/night</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className="col-span-12">
                        <HoverBanner padding='0px' />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default FlightListing
