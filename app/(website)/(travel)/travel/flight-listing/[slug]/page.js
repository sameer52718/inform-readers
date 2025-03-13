import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import React from 'react'

function FlightDetail() {
    return (
        <div>
            <AdBanner />

            <div className='container px-44 py-8'>
                <h4 className='text-3xl mb-3  font-bold'>Step 1: Review what’s included in your fare</h4>
                <p className='text-lg font-semnibold '>
                    See baggage size and weight limit.Total prices may include estimated baggage fees and flexibility. Some options may require added baggage or flexibility when checking out. Check terms and conditions on the booking site.
                </p>

                <div className=" rounded-xl p-4 bg-white border border-black mt-4 ">
                    <h2 className="text-2xl font-semibold">Lite</h2>
                    <p className="text-gray-600 font-semibold">$380</p>
                    <hr className="my-2 text-black" />
                    <div className="space-y-2  grid grid-cols-2">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:check-circle" className="text-green-500 text-2xl" />
                            <span className='text-xl'>1 carry-on bag</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:currency-usd" className="text-black text-2xl" />
                            <span className='text-xl'> Checked bag for a fee</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:currency-usd" className="text-black text-2xl" />
                            <span className='text-xl'>Seat selection for a fee</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:currency-usd" className="text-black text-2xl" />
                            <span className='text-xl'>Extra legroom for a fee</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:close-circle" className="text-red-500 text-2xl" />
                            <span className='text-xl'>No ticket changes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:close-circle" className="text-red-500 text-2xl" />
                            <span className='text-xl'>No refunds</span>
                        </div>
                    </div>
                </div>

                <p className='text-xl  font-bold mt-7 '>
                    Fare and baggage fees apply to the entire trip.
                </p>

                <HoverBanner padding='0px' />


                <h4 className='text-3xl mb-3  font-bold'>Step 1: Review what’s included in your fare</h4>
                <p className='text-lg font-semnibold '>
                    See baggage size and weight limit.Total prices may include estimated baggage fees and flexibility. Some options may require added baggage or flexibility when checking out. Check terms and conditions on the booking site.
                </p>

                <div className="border rounded-3xl my-8  border-black px-16 py-6 flex items-center justify-between ">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/website/assets/images/icons/arrow-up.png" 
                            alt="Expedia Logo"
                            className="w-24 h-auto"
                            width={1000}
                            height={1000}
                        />
                        <span className="font-semibold text-2xl">Expedia</span>
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">5.5</span>
                    </div>

                    {/* Price & Button */}
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-2xl">$380</span>
                        <button className="bg-red-500 text-white px-4 py-1 rounded-full font-semibold">
                            Book
                        </button>
                    </div>
                </div>

                <h4 className='text-3xl mb-3  font-bold'>Multān to Dubai</h4>
                <p className='text-lg font-semnibold '>
                Round-trip, 1 Traveler
                </p>


                <div className="border rounded-xl p-6 mt-6 bg-white border-black">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <Image
                            src="/website/assets/images/icons/wave.png" 
                            alt="Airline Logo"
                            className="w-20 h-auto"
                            width={400}
                            height={400}
                        />
                        <div>
                            <h2 className="font-semibold">
                                MUX → DXB <span className="text-gray-500">Fri, Feb 7</span>
                            </h2>
                            <p className="text-sm text-gray-500">Nonstop • 3h 20m</p>
                        </div>
                    </div>

                    <hr className="my-2" />

                    {/* Flight Details */}
                    <div>
                        <p className="text-lg font-semibold">11:55 am - 3:30 pm <span className="text-gray-500">(2h 35m)</span></p>
                        <p className="text-gray-700">Multan (MUX) - Dubai Intl (DXB)</p>
                        <p className="text-gray-500 text-sm">flydubai 326</p>
                        <p className="text-gray-500 text-sm">Narrow-body jet</p>
                    </div>

                    {/* Plane Type */}
                    <div className="mt-2">
                        <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                            Boeing 737 MAX 8
                        </span>
                    </div>

                    {/* Icons */}
                    <div className="flex gap-4 mt-3 text-gray-600">
                        <Icon icon="mdi:battery" className="text-xl" />
                        <Icon icon="mdi:wifi" className="text-xl" />
                        <Icon icon="mdi:food" className="text-xl" />
                    </div>
                </div>

                <div className="border rounded-xl p-6 mt-6 bg-white border-black">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <Image
                            src="/website/assets/images/icons/wave.png" 
                            alt="Airline Logo"
                            className="w-20 h-auto"
                            width={400}
                            height={400}
                        />
                        <div>
                            <h2 className="font-semibold">
                                MUX → DXB <span className="text-gray-500">Fri, Feb 7</span>
                            </h2>
                            <p className="text-sm text-gray-500">Nonstop • 3h 20m</p>
                        </div>
                    </div>

                    <hr className="my-2" />

                    {/* Flight Details */}
                    <div>
                        <p className="text-lg font-semibold">11:55 am - 3:30 pm <span className="text-gray-500">(2h 35m)</span></p>
                        <p className="text-gray-700">Multan (MUX) - Dubai Intl (DXB)</p>
                        <p className="text-gray-500 text-sm">flydubai 326</p>
                        <p className="text-gray-500 text-sm">Narrow-body jet</p>
                    </div>

                    {/* Plane Type */}
                    <div className="mt-2">
                        <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                            Boeing 737 MAX 8
                        </span>
                    </div>

                    {/* Icons */}
                    <div className="flex gap-4 mt-3 text-gray-600">
                        <Icon icon="mdi:battery" className="text-xl" />
                        <Icon icon="mdi:wifi" className="text-xl" />
                        <Icon icon="mdi:food" className="text-xl" />
                    </div>
                </div>

                <HoverBanner padding='0px' />

            </div>
        </div>
    )
}

export default FlightDetail
