"use client"; // 👈 Add this line at the top

import AdBanner from '@/components/partials/AdBanner'
import CategorySection from '@/components/partials/CategorySection'
import HoverBanner from '@/components/partials/HoverBanner'
import Pagination from '@/components/ui/Pagination'
import SearchInput from '@/components/ui/SearchInput'
import { couponData, homeCategory } from '@/constant/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'



const CouponCard = ({ data }) => {
    return (
        <div className='border rounded-2xl border-black p-4 flex items-center justify-center h-[270px] flex-col bg-white gap-3'>
            <Link href={"#"}>
                <Image src={data?.image} width={1000} height={1000} alt="product" className="h-28  w-32 rounded-2xl object-contain" />
            </Link>
            <div className='divider h-[1px] w-full bg-black'></div>
            <h6 className="text-lg text-gray-500 font-semibold line-clamp-2"><Link href={"#"}> {data?.name} </Link></h6>
            <button className='px-5 py-2 bg-[#ff0000] text-white rounded-3xl'>
                <Link href={"#"}>
                    Cash Back
                </Link>
            </button>
        </div>
    )
}

function BestCoupons() {
    return (
        <div>
            <AdBanner />
            <CategorySection category={homeCategory} />

            <section >
                <div className='px-32 py-6'>
                    <h4 className='text-[#ff0000] text-4xl font-bold text-center'> <span className='text-black'>Best</span> Coupons Deal & Cash Back</h4>

                    <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-12 ">
                            <h6 className="text-[#ff0000] font-bold text-xl ">
                                Coupons Code
                            </h6>

                            <div className="flex items-center gap-6">
                                <button>Show All</button>
                                <button>Popular </button>
                                {/* <button>Best Rated</button> */}
                            </div>
                        </div>
                        <div>
                            <SearchInput />
                        </div>
                    </div>

                    <div className="divider h-[3px]  w-full bg-black">
                        <div className="w-16 bg-[#ff0000] h-full"></div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 gap-y-4  mt-6 px-6'>
                        {couponData.map((data, index) => (
                            <div key={index} className="col-span-1">
                                <CouponCard data={data} />
                            </div>
                        ))}
                    </div>
                </div>


                <div className='flex justify-center'>
                    <button className='px-8 py-3  border  border-red-600 rounded-3xl text-red-600 bg-white'>
                        <Link href={"#"} className='flex items-center justify-center font-bold'>
                            Show More
                            <Image src={"/website/assets/images/icons/slider.png"} width={1000} height={1000} alt="product" className="w-7 h-auto ml-1 mt-1" />
                        </Link>

                    </button>
                </div>
                <HoverBanner />
            </section>

            <section >
                <div className='px-32 py-6'>
                    <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-12 ">
                            <h6 className="text-[#ff0000] font-bold text-xl">
                                Top Deals
                            </h6>

                            <div className="flex items-center gap-6">
                                <button>Show All</button>
                                <button>Popular </button>
                                {/* <button>Best Rated</button> */}
                            </div>
                        </div>
                        <div>
                            <SearchInput />
                        </div>
                    </div>

                    <div className="divider h-[3px]  w-full bg-black">
                        <div className="w-16 bg-[#ff0000] h-full"></div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 gap-y-4  mt-6 px-6'>
                        {couponData.map((data, index) => (
                            <div key={index} className="col-span-1">
                                <CouponCard data={data} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex justify-center'>
                    <button className='px-8 py-3  border  border-red-600 rounded-3xl text-red-600 bg-white'>
                        <Link href={"#"} className='flex items-center justify-center font-bold'>
                            Show More
                            <Image src={"/website/assets/images/icons/slider.png"} width={1000} height={1000} alt="product" className="w-7 h-auto ml-1 mt-1" />
                        </Link>

                    </button>
                </div>
                <HoverBanner />
            </section>
            <section >


                <div className='px-32 py-6'>
                    <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-12 ">
                            <h6 className="text-[#ff0000] font-bold text-xl  ">
                                Cash Back
                            </h6>

                            <div className="flex items-center gap-6">
                                <button>Show All</button>
                                <button>Popular </button>
                                {/* <button>Best Rated</button> */}
                            </div>
                        </div>
                        <div>
                            <SearchInput />
                        </div>
                    </div>

                    <div className="divider h-[3px]  w-full bg-black">
                        <div className="w-24 bg-[#ff0000] h-full"></div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 gap-y-4  mt-6 px-6'>
                        {couponData.map((data, index) => (
                            <div key={index} className="col-span-1">
                                <CouponCard data={data} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex justify-center'>
                    <button className='px-8 py-3  border  border-red-600 rounded-3xl text-red-600 bg-white'>
                        <Link href={"#"} className='flex items-center justify-center font-bold'>
                            Show More
                            <Image src={"/website/assets/images/icons/slider.png"} width={1000} height={1000} alt="product" className="w-7 h-auto ml-1 mt-1" />
                        </Link>

                    </button>
                </div>
                <HoverBanner />
            </section>

            <div className='flex items-center justify-center pb-4'>
                <Pagination totalPages={10} currentPage={1} />
            </div>



        </div>
    )
}

export default BestCoupons
