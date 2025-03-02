import AdBanner from '@/components/partials/AdBanner'
import Image from 'next/image'
import React from 'react'

function FlightDetail() {
    return (
        <div>
            <AdBanner />


            <div className="px-32 py-8">
                <div className="flex items-center gap-3 mt-6 pb-1 mb-8 border-black relative font-semibold border-b w-fit">
                    <span className="text-red-500">Home</span> / Today / Houly / Daily
                    <div className="absolute top-[28px] left-0 w-14 h-[3px] bg-red-500"></div>
                </div>

                <div className="text-center">
                    <h6 className="text-5xl font-bold mb-1">
                        Flight Departure & Arrival  in <span className="text-red-500">Pakistan</span>{" "}
                    </h6>
                    <p className="text-lg text-red-500 font-semibold">
                        Last Updated: 10th January 2025
                    </p>
                </div>

                <div>
                    <h4 className="text-2xl font-bold my-6">
                        Bahawalpur Airport BHV Flight Schedule, Status, Real-time Updates
                    </h4>

                    <div className='bg-[#d9d9d9] p-6 rounded-3xl border border-black'>
                        <div className='bg-white p-4'>
                            <p className='mb-4 text-xl font-semibold'>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            </p>

                            <p className='mb-4 text-xl font-semibold'>
                                the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            </p>
                        </div>
                    </div>


                </div>


                <div>
                    <h4 className="text-3xl font-bold my-10">
                        Bahawalpur Airport Flight Schedule & Status
                    </h4>

                    <div className='grid grid-cols-2 gap-14 px-14'>
                        <div className="col-span-1 border border-black bg-white rounded-xl overflow-hidden">
                            <div className='flex items-center justify-center my-6'>
                                <Image src={"/website/assets/images/flight/01.png"} width={1000} height={1000} alt={"flight detail"} className='w-36 h-36' />
                            </div>

                            <div className='bg-[#ff0000] p-4 font-bold text-white text-2xl text-center rounded-tl-lg rounded-tr-lg'>
                                Departure
                            </div>

                        </div>

                        <div className="col-span-1 border border-black bg-white rounded-xl overflow-hidden">
                            <div className='flex items-center justify-center my-6'>
                                <Image src={"/website/assets/images/flight/02.png"} width={1000} height={1000} alt={"flight detail"} className='w-36 h-36' />
                            </div>

                            <div className='bg-[#000] p-4 font-bold text-white text-2xl text-center rounded-tl-lg rounded-tr-lg'>
                                Arrival
                            </div>

                        </div>

                    </div>


                    <div className='mt-16'>
                        <h4 className='text-3xl font-bold mb-3'>
                            Bus Services in Pakistan
                        </h4>

                        <p className='mb-5 font-semibold'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                        </p>

                        <p className='mb-5 font-semibold'>
                            The printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </p>

                        <p className='mb-5 font-semibold'>
                            When an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </p>
                    </div>

                    <div className='mt-10'>
                        <Image src={"/website/assets/images/banner/01.png"} alt='banner' width={2000} height={2000} className='w-full h-[350px]' />
                    </div>

                </div>

            </div>
        </div>
    )
}

export default FlightDetail
