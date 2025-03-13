import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import WeatherFilter from '@/components/partials/WeatherFilter'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Jobs() {
    return (
        <div>
            <AdBanner />

            <div className='container mx-auto md:px-44'>
                <h4 className='text-2xl text-center font-bold py-10'>
                    FIND LATEST <span>JOBS</span>
                </h4>

                <WeatherFilter />

                <div className="bg-[#D9D9D9] p-8 rounded-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
                    {[...Array(16)].map((_, i) => (
                        <Link key={i} href={"/jobs/1"}>
                            <div className="bg-white rounded-xl border border-black flex items-center gap-2 px-2 py-1">
                                <Image
                                    src="/website/assets/images/company/01.png"
                                    width={500}
                                    height={500}
                                    alt="company-logo"
                                    className="h-12 w-12"
                                />
                                <div>
                                    <h4 className="font-semibold line-clamp-1">McAfee Total Protection</h4>
                                    <p className="text-red-500 text-xs font-bold">Ladbrokesed Limited</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>


                <div className='flex items-end justify-center w-full'>
                    <button className='py-3 mt-5 px-8 border border-red-500 bg-white rounded-2xl'>
                        Show More
                        <Icon icon="basil:caret-down-outline" width="24" height="24" className='inline' />
                    </button>
                </div>
            </div>


            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

            <div className='container mx-auto md:px-44'>
                <h4 className="text-center md:text-5xl text-xl text-red-500 font-semibold">
                    POPULAR JOB CATEGORIES
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 bg-[#d9d9d9] rounded-3xl p-8">
                    <div>
                        <h4 className="text-2xl font-bold mb-3">Trending Job Types</h4>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white w-full p-4 mb-4 text-xl font-bold text-center rounded-lg">
                                Entry level
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4 className="text-2xl font-bold mb-3">Trending Job Types</h4>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white w-full p-4 mb-4 text-xl font-bold text-center rounded-lg">
                                Accounting
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4 className="text-2xl font-bold mb-3">Trending Job Types</h4>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white w-full p-4 mb-4 text-xl font-bold text-center rounded-lg">
                                Work From Home
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex items-end justify-center w-full'>
                    <button className='py-3 mt-5 px-8 border border-red-500 bg-white rounded-2xl'>
                        Browse All Jobs
                        <Icon icon="basil:caret-down-outline" width="24" height="24" className='inline' />
                    </button>
                </div>


                <h4 className='text-center md:text-5xl text-2xl text-red-500 font-semibold my-10'>
                    TOP SECTORS
                </h4>

                <div className="bg-[#d9d9d9] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-8 rounded-2xl">
                    <div className="bg-white rounded-xl flex items-center justify-center flex-col p-6">
                        <Image src={"/website/assets/images/jobs/01.png"} width={1000} height={1000} alt="sector-logo" className="h-28 w-28" />
                        <h6 className="text-xl font-bold">Sales</h6>
                    </div>
                    <div className="bg-white rounded-xl flex items-center justify-center flex-col p-6">
                        <Image src={"/website/assets/images/jobs/02.png"} width={1000} height={1000} alt="sector-logo" className="h-28 w-28" />
                        <h6 className="text-xl font-bold">Sales</h6>
                    </div>
                    <div className="bg-white rounded-xl flex items-center justify-center flex-col p-6">
                        <Image src={"/website/assets/images/jobs/03.png"} width={1000} height={1000} alt="sector-logo" className="h-28 w-28" />
                        <h6 className="text-xl font-bold">Sales</h6>
                    </div>
                    <div className="bg-white rounded-xl flex items-center justify-center flex-col p-6">
                        <Image src={"/website/assets/images/jobs/04.png"} width={1000} height={1000} alt="sector-logo" className="h-28 w-28" />
                        <h6 className="text-xl font-bold">Sales</h6>
                    </div>
                    <div className="bg-white rounded-xl flex items-center justify-center flex-col p-6">
                        <Image src={"/website/assets/images/jobs/05.png"} width={1000} height={1000} alt="sector-logo" className="h-28 w-28" />
                        <h6 className="text-xl font-bold">Sales</h6>
                    </div>
                    <div className="bg-white rounded-xl flex items-center justify-center flex-col p-6">
                        <Image src={"/website/assets/images/jobs/06.png"} width={1000} height={1000} alt="sector-logo" className="h-28 w-28" />
                        <h6 className="text-xl font-bold">Sales</h6>
                    </div>
                </div>

                <div className='flex items-end justify-center w-full'>
                    <button className='py-3 mt-5 px-8 border border-red-500 bg-white rounded-2xl'>
                        All Sector
                        <Icon icon="basil:caret-down-outline" width="24" height="24" className='inline' />
                    </button>
                </div>
            </div>
            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>
        </div>
    )
}

export default Jobs
