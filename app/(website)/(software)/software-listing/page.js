"use client"

import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner';
import PriceFilter from '@/components/partials/PriceFilter'
import Pagination from '@/components/ui/Pagination';
import SearchInput from '@/components/ui/SearchInput';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import React, { useState } from 'react'


const tabs = ["Windows", "Android", "Mac", "iOS"];

const appData = {
    Windows: [
        { name: "RAR Password Unlocker", type: "Trial version", img: "/website/assets/images/software/01.png" },
        { name: "Avast Free Antivirus", type: "Free", img: "/website/assets/images/software/02.png" },
        { name: "Password Cracker", type: "Free", img: "/website/assets/images/software/03.png" },
        { name: "Windows 12", type: "Paid", img: "/website/assets/images/software/04.png" },
        { name: "Windows 12", type: "Paid", img: "/website/assets/images/software/05.png" },
        { name: "RAR Password Unlocker", type: "Trial version", img: "/website/assets/images/software/01.png" },
        { name: "Avast Free Antivirus", type: "Free", img: "/website/assets/images/software/02.png" },
        { name: "Password Cracker", type: "Free", img: "/website/assets/images/software/03.png" },
        { name: "Windows 12", type: "Paid", img: "/website/assets/images/software/04.png" },
        { name: "Windows 12", type: "Paid", img: "/website/assets/images/software/05.png" },
        { name: "RAR Password Unlocker", type: "Trial version", img: "/website/assets/images/software/01.png" },
        { name: "Avast Free Antivirus", type: "Free", img: "/website/assets/images/software/02.png" },
    ],
    Android: [
        { name: "Android Cleaner", type: "Free", img: "/website/assets/images/software/06.png" },
        { name: "Android Security", type: "Paid", img: "/website/assets/images/software/07.png" },
    ],
    Mac: [
        { name: "Mac Cleaner", type: "Trial version", img: "/website/assets/images/software/08.png" },
        { name: "Mac Security", type: "Free", img: "/website/assets/images/software/09.png" },
    ],
    iOS: [
        { name: "iOS VPN", type: "Free", img: "/website/assets/images/software/10.png" },
        { name: "iOS Security", type: "Paid", img: "/website/assets/images/software/11.png" },
    ],
};



function TabMenu() {
    const [activeTab, setActiveTab] = useState("Windows");

    return (
        <div className="">
            {/* Tabs */}
            <div className="flex border-b-2 border-black justify-between">
                <div>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 text-xl font-semibold ${activeTab === tab
                                ? "text-red-500 border-b-2 border-red-500"
                                : "text-gray-600"
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div>
                    <SearchInput />
                </div>

            </div>

            {/* Content */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {appData[activeTab].map((app, index) => (
                    <div
                        key={index}
                        className="px-6 py-8 rounded-3xl border border-blackbg-white bg-white"
                    >
                        <div className='flex justify-center border-b border-black'>
                            <Image src={app.img} alt={app.name} className="w-24 h-24 mb-2" width={1000} height={1000} />
                        </div>
                        <p className="font-semibold text-xl">{app.name}</p>
                        <span className="text-sm text-gray-500">{app.type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


function SoftwareListing() {
    return (
        <div>
            <AdBanner />
            <div className='px-[260px] bg-white pb-6'>
                <div className='flex items-center gap-1  py-6'>
                    <h6>Home</h6>
                    /
                    <h6>Electronics</h6>
                    /
                    <h6>HD Camera 5100</h6>
                </div>

                <h4 className='text-3xl font-bold'>Windows Apps for Internet Software</h4>
            </div>
            <div className='px-40 py-8'>
                <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-3">
                        <PriceFilter />
                    </div>
                    <div className="col-span-9">
                        <TabMenu />
                        <HoverBanner padding='0px' />
                        <div>
                            <h4 className='text-2xl font-bold text-red-500 mb-4'>Best Games Software:</h4>
                            <TabMenu />
                            <div className='flex items-center justify-center mt-6'>
                                <button className='border border-red-500 bg-white font-bold text-red-500 px-7 py-2 rounded-2xl'>
                                    Show More <Icon icon="material-symbols:double-arrow-rounded" width="24" height="24" className="inline mr-1" />
                                </button>
                            </div>
                        </div>
                        <HoverBanner padding='0px' />
                        <div>
                            <h4 className='text-2xl font-bold text-red-500 mb-4'>Best Games Software:</h4>
                            <TabMenu />
                            <div className='flex items-center justify-center mt-6'>
                                <button className='border border-red-500 bg-white font-bold text-red-500 px-7 py-2 rounded-2xl'>
                                    Show More <Icon icon="material-symbols:double-arrow-rounded" width="24" height="24" className="inline mr-1" />
                                </button>
                            </div>
                        </div>
                        <HoverBanner padding='0px' />

                        <div className='flex items-center justify-center w-full'>
                            <Pagination currentPage={1} totalPages={10} />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default SoftwareListing
