import AdBanner from '@/components/partials/AdBanner'
import FlightFilter from '@/components/partials/FlightFilter'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import React from 'react'

function TravelPage() {
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

                <div className='mt-10 border border-black p-8 rounded-3xl bg-white'>
                    <h4 className='text-3xl font-bold'>Get inspired by our fave travel creators</h4>
                    <p className='text-xl font-semibold'>
                        Tried-and-true guidance to fuel your next big trip
                    </p>

                    <div className="grid grid-cols-3 gap-10 mt-5">
                        <div className="w-full border rounded-3xl  overflow-hidden bg-gray-200">
                            <div className="relative w-full h-56">
                                <Image
                                    src="/website/assets/images/travel/01.png" // Ensure this image exists in the public folder
                                    alt="Mexico City Workcation"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className=" p-3 text-center">
                                <p className="text-xl font-bold">By Eileen Ivette</p>
                                <p className="text-xl font-bold">The ultimate 'workcation' in Mexico City</p>
                            </div>
                        </div>
                        <div className="w-full border rounded-3xl  overflow-hidden bg-gray-200">
                            <div className="relative w-full h-56">
                                <Image
                                    src="/website/assets/images/travel/01.png" // Ensure this image exists in the public folder
                                    alt="Mexico City Workcation"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className=" p-3 text-center">
                                <p className="text-xl font-bold">By Eileen Ivette</p>
                                <p className="text-xl font-bold">The ultimate 'workcation' in Mexico City</p>
                            </div>
                        </div>
                        <div className="w-full border rounded-3xl  overflow-hidden bg-gray-200">
                            <div className="relative w-full h-56">
                                <Image
                                    src="/website/assets/images/travel/01.png" // Ensure this image exists in the public folder
                                    alt="Mexico City Workcation"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className=" p-3 text-center">
                                <p className="text-xl font-bold">By Eileen Ivette</p>
                                <p className="text-xl font-bold">The ultimate 'workcation' in Mexico City</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TravelPage
