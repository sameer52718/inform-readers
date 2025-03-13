import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import Image from 'next/image'
import React from 'react'

function BusArrival() {
    return (
        <div className='container mx-auto '>
            <AdBanner />
            <div className='md:px-56 sm:12 px-4 md:py-8 py-4'>
                <div className="flex flex-wrap items-center gap-3 mt-6 pb-1 mb-8 border-black relative font-semibold border-b w-fit text-sm sm:text-base">
                    <span className="text-red-500">Home</span> / Today / Hourly / Daily
                    <div className="absolute top-[28px] left-0 w-12 sm:w-14 h-[3px] bg-red-500"></div>
                </div>

                <div className="text-center px-4">
                    <h6 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                        Bus Services in <span className="text-red-500">Pakistan</span>
                    </h6>
                    <p className="text-sm sm:text-base text-red-500 font-semibold">
                        Last Updated: 10th January 2025
                    </p>
                </div>


                <h4 className="text-lg sm:text-xl font-bold my-6 text-center sm:text-left">
                    Daewoo Express Departure From Lahore Schedule
                </h4>

                <div className="bg-[#d9d9d9] py-6 sm:py-8 px-2 sm:px-8 md:px-4 rounded-3xl overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-300 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm sm:text-lg font-bold">Destination</th>
                                <th className="px-4 py-3 text-left text-sm sm:text-lg font-bold">Time</th>
                                <th className="px-4 py-3 text-left text-sm sm:text-lg font-bold">Price / Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array(7).fill().map((_, index) => (
                                <tr key={index} className="odd:bg-gray-100 even:bg-white">
                                    <td className="px-4 py-3 text-sm sm:text-lg font-bold">Lahore to Kashmore</td>
                                    <td className="px-4 py-3 text-sm sm:text-lg font-semibold text-black">
                                        05:00 PM / 10-01-2025
                                    </td>
                                    <td className="px-4 py-3 text-sm sm:text-lg font-semibold text-black">
                                        Rs. 2159 / Super Luxury
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

            <div className='md:px-56 sm:12 px-4 md:py-8 py-4'>

                <div className="bg-[#d9d9d9] py-6 sm:py-8 px-4 sm:px-8 md:px-4 rounded-3xl overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                        {/* Table Header */}
                        <thead className="bg-gray-300 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm sm:text-lg font-bold">Destination</th>
                                <th className="px-4 py-3 text-left text-sm sm:text-lg font-bold">Time</th>
                                <th className="px-4 py-3 text-left text-sm sm:text-lg font-bold">Price / Type</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {Array(7).fill().map((_, index) => (
                                <tr key={index} className="odd:bg-gray-100 even:bg-white">
                                    <td className="px-4 py-3 text-sm sm:text-lg font-bold">Lahore to Kashmore</td>
                                    <td className="px-4 py-3 text-sm sm:text-lg font-semibold text-black">
                                        05:00 PM / 10-01-2025
                                    </td>
                                    <td className="px-4 py-3 text-sm sm:text-lg font-semibold text-black">
                                        Rs. 2159 / Super Luxury
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="mt-8 px-4 sm:px-6 md:px-0">
                    <h4 className="text-2xl sm:text-3xl font-bold mb-3 text-center sm:text-left">
                        Bus Services in Pakistan
                    </h4>

                    <p className="mb-5 text-sm sm:text-base font-semibold text-gray-700 leading-relaxed">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    </p>

                    <p className="mb-5 text-sm sm:text-base font-semibold text-gray-700 leading-relaxed">
                        The printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>

                    <p className="mb-5 text-sm sm:text-base font-semibold text-gray-700 leading-relaxed">
                        When an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </div>


                <div className='mt-10'>
                    <Image src={"/website/assets/images/banner/01.png"} alt='banner' width={2000} height={2000} className='w-full h-[350px]' />
                </div>
            </div>
        </div>
    )
}

export default BusArrival
