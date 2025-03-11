import AdBanner from '@/components/partials/AdBanner'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function FlightDetail() {
    return (
        <div className='container mx-auto'>
            <AdBanner />


            <div className="md:px-44 sm:px-6 px-4 py-8">
                <div className="px-4 sm:px-8 md:px-12 lg:px-16">
                    {/* Navigation */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6 pb-1 mb-8 border-black relative font-semibold border-b w-fit text-sm sm:text-base">
                        <span className="text-red-500">Home</span> / Today / Hourly / Daily
                        <div className="absolute top-[28px] left-0 w-10 sm:w-14 h-[3px] bg-red-500"></div>
                    </div>

                    {/* Heading Section */}
                    <div className="text-center">
                        <h6 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1">
                            Flight Departure & Arrival in <span className="text-red-500">Pakistan</span>
                        </h6>
                        <p className="text-sm sm:text-lg text-red-500 font-semibold">
                            Last Updated: 10th January 2025
                        </p>
                    </div>
                </div>


                <div className="px-4 sm:px-8 md:px-12 lg:px-16">
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold my-4 sm:my-6">
                        Bahawalpur Airport BHV Flight Schedule, Status, Real-time Updates
                    </h4>

                    <div className="bg-[#d9d9d9] p-4 sm:p-6 rounded-3xl border border-black">
                        <div className="bg-white p-3 sm:p-4 md:p-6">
                            <p className="mb-3 sm:mb-4 text-base sm:text-lg md:text-xl font-semibold">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            </p>
                            <p className="mb-3 sm:mb-4 text-base sm:text-lg md:text-xl font-semibold">
                                The industry's standard dummy text ever since the 1500s, when an unknown printer
                                took a galley of type and scrambled it to make a type specimen book.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-4 sm:px-8 md:px-12 lg:px-16">
                    <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold my-6 sm:my-10 text-center">
                        Bahawalpur Airport Flight Schedule & Status
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 md:gap-14 px-4 sm:px-8 md:px-14">
                        {/* Departure Card */}
                        <div className="border border-black bg-white rounded-xl overflow-hidden">
                            <Link href={"/flight-departure"}>
                                <div className="flex items-center justify-center my-4 sm:my-6">
                                    <Image
                                        src={"/website/assets/images/flight/01.png"}
                                        width={1000}
                                        height={1000}
                                        alt={"flight detail"}
                                        className="w-28 h-28 sm:w-36 sm:h-36"
                                    />
                                </div>

                                <div className="bg-[#ff0000] p-3 sm:p-4 font-bold text-white text-xl sm:text-2xl text-center rounded-tl-lg rounded-tr-lg">
                                    Departure
                                </div>
                            </Link>
                        </div>

                        {/* Arrival Card */}
                        <div className="border border-black bg-white rounded-xl overflow-hidden">
                            <Link href={"/flight-arrival"}>
                                <div className="flex items-center justify-center my-4 sm:my-6">
                                    <Image
                                        src={"/website/assets/images/flight/02.png"}
                                        width={1000}
                                        height={1000}
                                        alt={"flight detail"}
                                        className="w-28 h-28 sm:w-36 sm:h-36"
                                    />
                                </div>

                                <div className="bg-[#000] p-3 sm:p-4 font-bold text-white text-xl sm:text-2xl text-center rounded-tl-lg rounded-tr-lg">
                                    Arrival
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>


                <div className="px-4 sm:px-8 md:px-12 lg:px-16">
                    <div className="mt-10 sm:mt-16">
                        <h4 className="text-2xl sm:text-3xl font-bold mb-3 text-center sm:text-left">
                            Bus Services in Pakistan
                        </h4>

                        <p className="mb-4 sm:mb-5 font-medium text-sm sm:text-base leading-relaxed">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                            standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                            make a type specimen book. It has survived not only five centuries, but also the leap into electronic
                            typesetting, remaining essentially unchanged.
                        </p>

                        <p className="mb-4 sm:mb-5 font-medium text-sm sm:text-base leading-relaxed">
                            The printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
                            the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </p>

                        <p className="mb-4 sm:mb-5 font-medium text-sm sm:text-base leading-relaxed">
                            When an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </p>
                    </div>

                    <div className="mt-8 sm:mt-10">
                        <Image
                            src={"/website/assets/images/banner/01.png"}
                            alt="banner"
                            width={2000}
                            height={2000}
                            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[350px] object-cover rounded-lg"
                        />
                    </div>
                </div>


            </div>
        </div>
    )
}

export default FlightDetail
