"use client"

import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import WeatherFilter from '@/components/partials/WeatherFilter'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'


const ReviewSection = () => {
    const totalReviews = 1;
    const ratings = [1, 0, 0, 0, 0];

    return (
        <div className="px-6 py-10 bg-white shadow-md rounded-lg">
            <div className="grid grid-cols-12">
                <div className="col-span-2 border-r-4 border-gray-200">
                    <div className="flex items-end  space-x-2">
                        <span className="text-6xl font-bold text-red-600">5.0</span>
                        <span className="text-gray-500 text-lg ">out of 5</span>
                    </div>
                    <div className="flex items-center my-2">
                        {[...Array(5)].map((_, i) => (
                            <Icon icon="material-symbols-light:star-rounded" width="32" height="32" className="text-red-600 fill-red-600" />
                        ))}
                    </div>
                </div>
                <div className="col-span-10 pl-4">
                    <div className="space-y-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={5 - i} className="flex items-center space-x-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, j) => (
                                        <Icon icon="material-symbols-light:star-rounded" width="32" height="32" className={j < 5 - i ? "text-red-600 fill-red-600" : "text-gray-300"} />
                                    ))}
                                </div>
                                <div className="w-full bg-gray-300 h-4 rounded-full">
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
            <div className='flex items-center justify-center'>
                <button className="mt-4 w-fit px-10 py-3 rounded-3xl bg-red-600 text-white hover:bg-red-700">Write a Review</button>
            </div>
        </div>
    );
}

const ReviewTabSection = () => {
    const [selectedReviewTab, setSelectedReviewTab] = useState("all");
    const totalReviews = 1;
    const ratings = [1, 0, 0, 0, 0];

    return (
        <div className="p-6  rounded-lg">
            {/* Tab Menu */}
            <div className="flex border-b border-black mb-4 space-x-4 pb-2">
                {["Show all", "Most Helpful", "Highest Rating", "Lowest Rating"].map((tab, index) => (
                    <button
                        key={index}
                        className={`
                px-3 py-2 font-bold text-lg
                ${selectedReviewTab === tab ? "text-red-600 font-bold bg-gray-300  rounded-2xl " : "text-gray-500"}
              `}
                        onClick={() => setSelectedReviewTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Review Section */}
            <div className="mb-4">
                <div className="flex items-center space-x-2">
                    <Image
                        width={1000}
                        height={1000}
                        src="/user-avatar.png"
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Icon icon="material-symbols-light:star-rounded" width="32" height="32" className="text-red-600 fill-red-600" />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">supervendor - June 17, 2019</p>
                    </div>
                </div>
                <p className="mt-2 text-gray-700">I think this is the best product ever</p>
            </div>

            {/* Add Review Section */}
            <div className="border-t pt-4">
                <p className="font-bold">Add a review</p>
                <p className="text-sm text-gray-500">
                    You must be <span className="text-red-600 cursor-pointer">logged in to post</span> a review.
                </p>
            </div>
        </div>
    );
}


function PostalCodeDetail() {
    return (
        <div>
            <AdBanner />
            <div className='container mx-auto px-44 py-8'>

                <WeatherFilter />

                <h4 className='text-4xl font-bold my-7 text-center'>
                    World <span className='text-red-500'> Zip/postal </span> Codes
                </h4>

                <div className='mb-5 py-5'>
                    <h6 className='text-3xl font-semibold mb-3 px-2'>
                        Popular Countries:
                    </h6>
                    <div className='bg-gray-200 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6'>
                        {[...Array(4)].map((_, i) => (
                            <>
                                <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                    <Image src="/website/assets/images/country/01.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                    USA
                                </div>
                                <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                    <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                    UK
                                </div>
                                <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                    <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                    New Zealand
                                </div>
                                <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                    <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                    UK
                                </div>
                                <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                    <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                    New Zealand
                                </div>
                            </>
                        ))}

                    </div>
                </div>

                <HoverBanner padding='0px' />

                <div className=" mt-8 flex items-center justify-between bg-red-600 text-white px-6 py-3 text-sm font-bold mb-8">
                    <h5 className="ml-2 text-3xl">Dilraba Dilmurat</h5>
                    <div className="flex items-center space-x-2 mr-2">
                        <Link href={"#"}>
                            <Icon icon="ic:baseline-share" width="24" height="24" className="w-8 h-8 cursor-pointer" /></Link>
                        <Link href={"#"}>
                            <Icon icon="logos:whatsapp-icon" width="24" height="24" className="w-8 h-8 cursor-pointer" /></Link>
                        <Link href={"#"}>
                            <Icon icon="skill-icons:instagram" width="24" height="24" className="w-8 h-8 cursor-pointer" /></Link>
                        <Link href={"#"}>
                            <Icon icon="logos:facebook" width="15" height="15" className="w-8 h-8 cursor-pointer" />
                        </Link>
                        <Link href={"#"}>
                            <Icon icon="devicon:linkedin" width="24" height="24" className="w-8 h-8 cursor-pointer" />
                        </Link>
                        <Link href={"#"}>
                            <Icon icon="logos:twitter" width="24" height="24" className="w-8 h-8 cursor-pointer" />
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-300 rounded-lg p-4 w-full ">
                    <div className="grid grid-cols-5 bg-white p-2 rounded-lg mb-1">
                        <span className="font-bold text-xl col-span-3">Country</span>
                        <span className="text-red-500 text-xl underline col=spam-2 ">Pakistan</span>
                    </div>
                    <div className="grid grid-cols-5 bg-gray-100 p-2 rounded-lg mb-1">
                        <span className="font-bold text-xl col-span-3">State/Religion/Province</span>
                        <span className="text-red-500 text-xl underline  col-span-2">Sindh</span>
                    </div>
                    <div className="grid grid-cols-5 bg-white p-2 rounded-lg mb-1">
                        <span className="font-bold text-xl col-span-3">City/Area</span>
                        <span className=" col-span-2 text-xl">Karachi Cantt.</span>
                    </div>
                    <div className="grid grid-cols-5 bg-gray-100 p-2 rounded-lg">
                        <span className="font-bold text-xl col-span-3">Postal Code</span>
                        <span className=" col-span-2 text-xl">75530</span>
                    </div>
                </div>


                <div className='mb-5 py-5'>
                    <h6 className='text-3xl font-semibold mb-3 px-2'>
                        Regions
                    </h6>
                    <div className='bg-gray-300 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6'>
                        <div className='grid grid-cols-3 w-full'>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Azad Jammu And Kashmir</div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Fedral Capital </div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Balochistan</div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Gilgit Baltistan</div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Sindh</div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Punjab</div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Khyber Pakhtunkhwa</div>
                        </div>
                    </div>
                </div>

                <ReviewSection />
                <ReviewTabSection />

                

            </div>
        </div>
    )
}

export default PostalCodeDetail
