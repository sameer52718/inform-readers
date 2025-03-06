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

            <div className='px-44 py-8'>
                <div className='flex items-center gap-3 mt-6 pb-1 mb-8 border-black relative font-semibold border-b w-fit'>
                    <span className='text-red-500'>Home</span> /  Today  /  Houly  /  Daily
                    <div className="absolute top-[28px] left-0 w-14 h-[3px] bg-red-500"></div>
                </div>

                <div className='text-center'>
                    <h6 className='text-6xl font-bold mb-1'>Bus Services  in <span className='text-red-500'>Pakistan</span> </h6>
                    <p className='text-lg text-red-500 font-semibold'>Last Updated: 10th January 2025</p>
                </div>

                <div>
                    <h4 className='text-3xl font-bold my-5'>Today's Bus Services In Pakistan</h4>

                    <div className='bg-[#d9d9d9]  justify-between py-8 px-12 rounded-3xl'>
                        <div className='grid grid-cols-2 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-2xl font-bold col-span-1'>Reservations Contact</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>https://daewoo.com.pk/</h5>
                        </div>
                        <div className='grid grid-cols-2 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-2xl font-bold col-span-1'>Reservations Contact</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>https://daewoo.com.pk/</h5>
                        </div>
                        <div className='grid grid-cols-2 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-2xl font-bold col-span-1'>Reservations Contact</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>https://daewoo.com.pk/</h5>
                        </div>
                        <div className='grid grid-cols-2 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-2xl font-bold col-span-1'>Reservations Contact</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>https://daewoo.com.pk/</h5>
                        </div>
                        <div className='grid grid-cols-2 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-2xl font-bold col-span-1'>Reservations Contact</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>https://daewoo.com.pk/</h5>
                        </div>
                        <div className='grid grid-cols-2 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-2xl font-bold col-span-1'>Reservations Contact</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>https://daewoo.com.pk/</h5>
                        </div>
                        <div className='grid grid-cols-2 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-2xl font-bold col-span-1'>Reservations Contact</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>https://daewoo.com.pk/</h5>
                        </div>
                        <div className='grid grid-cols-2 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-2xl font-bold col-span-1'>Reservations Contact</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>https://daewoo.com.pk/</h5>
                        </div>
                    </div>
                </div>

                <HoverBanner padding='0px' />

                <div>
                    <h4 className='text-3xl font-bold my-5'>Today's Bus Services In Pakistan</h4>

                    <div className='  justify-between py-5 px-4 rounded-3xl'>
                        {["Lahore", "Faisalabad", "Multan", "Karachi"].map(item => (
                            <div key={item} className='grid grid-cols-3 w-full bg-white py-3 px-8 mb-3'>
                                <h5 className='text-2xl font-bold col-span-2 flex items-center'><Icon icon="weui:location-filled" width="32" height="32" className='inline mr-2' />{item}</h5>
                                <div className='col-span-1 flex items-center justify-between'>
                                    <button className='bg-[#ff0000] text-white px-12 py-2 rounded-xl'>
                                        <Link href={"/bus-departure"} className='text-xl'>
                                            Departure
                                        </Link>
                                    </button>
                                    <button className='bg-[#000] text-white px-12 py-2 rounded-xl'>
                                        <Link href={"/bus-arrival"} className='text-xl'>
                                            Arrival
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='mt-8'>
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
    )
}

export default BusService
