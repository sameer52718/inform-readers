import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function FlightPage() {
    return (
        <div>
            <AdBanner />

            <div className='px-32 py-8'>
                <div className='flex items-center gap-3 mt-6 pb-1 mb-8 border-black relative font-semibold border-b w-fit'>
                    <span className='text-red-500'>Home</span> /  Today  /  Houly  /  Daily
                    <div className="absolute top-[28px] left-0 w-14 h-[3px] bg-red-500"></div>
                </div>


                <div className='text-center'>
                    <h6 className='text-6xl font-bold mb-1'>Flight Timings in <span className='text-red-500'>Pakistan</span> </h6>
                    <p className='text-lg text-red-500 font-semibold'>Last Updated: 10th January 2025</p>
                </div>


                <div>
                    <h4 className='text-2xl font-bold my-6'>Today's Flight Timing In Pakistan</h4>

                    <div className='bg-[#d9d9d9]  justify-between py-8 px-12 rounded-3xl'>
                        <div className="grid grid-cols-3 mb-4">
                            <div className="col-span-1">
                                <h4 className='text-3xl font-bold'>
                                    Airport
                                </h4>
                            </div>
                            <div className="col-span-1">
                                <h4 className='text-3xl font-bold'>
                                    Code
                                </h4>
                            </div>
                            <div className="col-span-1">
                                <h4 className='text-3xl font-bold'>
                                    Schedule
                                </h4>

                            </div>
                        </div>
                        <div className='grid grid-cols-3 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-lg font-bold col-span-1'>Bhawalpur</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>BHV</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>
                                <Link href={''} className='underline'>
                                    Check Schedule
                                </Link>
                            </h5>
                        </div>
                        <div className='grid grid-cols-3 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-lg font-bold col-span-1'>Bhawalpur</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>BHV</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>
                                <Link href={''} className='underline'>
                                    Check Schedule
                                </Link>
                            </h5>
                        </div>

                        <div className='grid grid-cols-3 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-lg font-bold col-span-1'>Bhawalpur</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>BHV</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>
                                <Link href={''} className='underline'>
                                    Check Schedule
                                </Link>
                            </h5>
                        </div>

                        <div className='grid grid-cols-3 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-lg font-bold col-span-1'>Bhawalpur</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>BHV</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>
                                <Link href={''} className='underline'>
                                    Check Schedule
                                </Link>
                            </h5>
                        </div>

                        <div className='grid grid-cols-3 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-lg font-bold col-span-1'>Bhawalpur</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>BHV</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>
                                <Link href={''} className='underline'>
                                    Check Schedule
                                </Link>
                            </h5>
                        </div>
                    </div>

                    <HoverBanner padding='0px' />

                    <div className='bg-[#d9d9d9]  justify-between py-8 px-12 rounded-3xl'>
                        <div className="grid grid-cols-3 mb-4">
                            <div className="col-span-1">
                                <h4 className='text-3xl font-bold'>
                                    Airport
                                </h4>
                            </div>
                            <div className="col-span-1">
                                <h4 className='text-3xl font-bold'>
                                    Code
                                </h4>
                            </div>
                            <div className="col-span-1">
                                <h4 className='text-3xl font-bold'>
                                    Schedule
                                </h4>

                            </div>
                        </div>
                        <div className='grid grid-cols-3 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-lg font-bold col-span-1'>Bhawalpur</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>BHV</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>
                                <Link href={''} className='underline'>
                                    Check Schedule
                                </Link>
                            </h5>
                        </div>
                        <div className='grid grid-cols-3 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-lg font-bold col-span-1'>Bhawalpur</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>BHV</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>
                                <Link href={''} className='underline'>
                                    Check Schedule
                                </Link>
                            </h5>
                        </div>

                        <div className='grid grid-cols-3 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-lg font-bold col-span-1'>Bhawalpur</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>BHV</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>
                                <Link href={''} className='underline'>
                                    Check Schedule
                                </Link>
                            </h5>
                        </div>

                        <div className='grid grid-cols-3 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-lg font-bold col-span-1'>Bhawalpur</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>BHV</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>
                                <Link href={''} className='underline'>
                                    Check Schedule
                                </Link>
                            </h5>
                        </div>

                        <div className='grid grid-cols-3 w-full bg-white py-3 px-8 mb-3'>
                            <h5 className='text-lg font-bold col-span-1'>Bhawalpur</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>BHV</h5>
                            <h5 className='col-span-1 text-lg font-semibold text-black'>
                                <Link href={''} className='underline'>
                                    Check Schedule
                                </Link>
                            </h5>
                        </div>
                    </div>

                    <div>
                    <h4 className='text-2xl font-bold my-6'>Airlines Flight Status</h4>

                    <div className="grid grid-cols-3 w-full gap-x-8 gap-y-4 mb-16">
                        {["Air Arabic", "PIA", "TH", "Emirates", "Flydubai", "Air China", "American Airline", "Salam Air", 'Air Blue', "Kam Air", "Turkish Airlines", "Oman Air"].map((item, index) => (
                             <div key={index} className='col-span-1 border border-black bg-white py-4 rounded-xl text-2xl text-center font-bold '>
                             {item}
                             </div>
                        ))}
                       
                    </div>
                    </div>

                    <div className='mt-8'>
                        <h4 className='text-3xl font-bold mb-3'>
                        Airports in Pakistan
                        </h4>

                        <p className='mb-5 font-semibold'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
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

export default FlightPage
