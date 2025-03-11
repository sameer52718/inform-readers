import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function BusService() {
    return (
        <div className='container mx-auto'>
            <AdBanner />

            <div className='md:px-44 sm:px-12 px-4 py-8'>
                <div className="mt-6 pb-1 mb-8 border-black relative font-semibold border-b w-fit flex flex-wrap items-center gap-3">
                    <span className="text-red-500">Home</span> / Today / Hourly / Daily
                    <div className="absolute top-[28px] left-0 w-14 h-[3px] bg-red-500"></div>
                </div>

                <div className="text-center px-4 sm:px-8">
                    <h6 className="text-4xl sm:text-6xl font-bold mb-1 leading-tight">
                        Bus Services in <span className="text-red-500">Pakistan</span>
                    </h6>
                    <p className="text-base sm:text-lg text-red-500 font-semibold">
                        Last Updated: 10th January 2025
                    </p>
                </div>

                <div className="px-4 sm:px-8 md:px-12">
                    <h4 className="text-2xl sm:text-3xl font-bold my-5 text-center sm:text-left">
                        Today's Bus Services In Pakistan
                    </h4>

                    <div className="bg-[#d9d9d9] py-6 sm:py-8 px-4 sm:px-8 md:px-4 rounded-3xl">
                        {Array(8).fill().map((_, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0 bg-white py-3 px-6 sm:px-8 mb-3 rounded-lg shadow">
                                <h5 className="text-lg sm:text-2xl font-bold">Reservations Contact</h5>
                                <h5 className="text-sm sm:text-lg font-semibold text-black break-all">
                                    <a href="https://daewoo.com.pk/" className="text-blue-600 underline">https://daewoo.com.pk/</a>
                                </h5>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

            <div className="px-4 sm:px-12 md:px-44 py-8">
                {/* Today's Bus Services */}
                <div>
                    <h4 className="text-2xl sm:text-3xl font-bold my-5 text-center sm:text-left">
                        Today's Bus Services In Pakistan
                    </h4>
                    <div className="py-5 px-4 rounded-3xl">
                        {["Lahore", "Faisalabad", "Multan", "Karachi"].map((item) => (
                            <div key={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white py-4 px-6 mb-3 rounded-lg shadow">
                                {/* Location */}
                                <h5 className="text-lg sm:text-2xl font-bold flex items-center col-span-2 sm:col-span-1">
                                    <Icon icon="weui:location-filled" width="28" height="28" className="inline mr-2" />
                                    {item}
                                </h5>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-5 col-span-2">
                                    <Link href={"/bus-arrival"}>
                                        <button className="bg-red-600 text-white w-full px-6 sm:px-12 py-2 rounded-xl text-lg">
                                            Departure
                                        </button>
                                    </Link>
                                    <Link href={"/bus-arrival"}>
                                        <button className="bg-black text-white w-full px-6 sm:px-12 py-2 rounded-xl text-lg">
                                            Arrival
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bus Services Description */}
                <div className="mt-8 text-center sm:text-left">
                    <h4 className="text-2xl sm:text-3xl font-bold mb-3">Bus Services in Pakistan</h4>

                    <p className="mb-5 text-sm sm:text-base font-semibold">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...
                    </p>

                    <p className="mb-5 text-sm sm:text-base font-semibold">
                        The printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...
                    </p>

                    <p className="mb-5 text-sm sm:text-base font-semibold">
                        When an unknown printer took a galley of type and scrambled it to make a type specimen book...
                    </p>
                </div>

                {/* Banner Image */}
                <div className="mt-10">
                    <Image src="/website/assets/images/banner/01.png" alt="banner" width={2000} height={2000} className="w-full h-[250px] sm:h-[350px] object-cover rounded-xl shadow-lg" />
                </div>
            </div>

        </div>
    )
}

export default BusService
