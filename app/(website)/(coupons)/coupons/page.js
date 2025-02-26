import AdBanner from '@/components/partials/AdBanner'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Coupons() {
    return (

        <>
            <AdBanner />

            <section className='px-32 bg-white'>
                <div className='flex items-center gap-1 px-32 py-4'>
                    <h6>Home</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Store Page</h6>
                </div>

                <div>
                    <h2 className='text-2xl font-semibold text-center mb-3'>A Cherry on Top Coupons & Promo Codes</h2>
                </div>
            </section>

            <section className='px-6'>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 gap-y-4 mt-6 px-6">
                    <div className="col-span-3 bg-[#acacac] p-4 rounded-2xl">
                        <div className='bg-white h-40 rounded-xl flex items-center justify-center'>
                            <Image src={'/website/assets/images/coupons/01.png'} alt='coupon' width={1000} height={1000} className='w-56 h-auto object-contain' />
                        </div>

                        <h6 className='text-lg mt-8 leading-6 font-semibold'>
                            When you buy through links on Informreaders <Link href={"#"} className='text-[#ff0000]'>  we  may earn commission.</Link>
                        </h6>


                        <h6 className='text-lg mt-8 leading-6 font-semibold'>
                            Today's top A Cherry on Top offers:
                        </h6>
                        <ul>
                            <li className='list-disc ml-4 mt-1 font-semibold'>Extra 10% Off Sitewide</li>
                            <li className='list-disc ml-4 mt-1 font-semibold'>Extra $5 Off Orders $25+</li>
                        </ul>

                        <h6 className='text-lg mt-3 mb-2 leading-6 font-semibold flex items-center justify-between'>
                            Total Offers
                            <span>0</span>
                        </h6>
                        <h6 className='text-lg mt-3 mb-2 leading-6 font-semibold flex items-center justify-between'>
                        Coupon Codes                      
                            <span>0</span>
                        </h6>
                        <h6 className='text-lg mt-3 mb-2 leading-6 font-semibold flex items-center justify-between'>
                        In-Store Coupons                                      
                            <span>0</span>
                        </h6>
                        <h6 className='text-lg mt-3 mb-2 leading-6 font-semibold flex items-center justify-between'>
                        Free Shipping Deals                              
                            <span>0</span>
                        </h6>

                    </div>
                    <div className="col-span-9 bg-blue-500 p-20"></div>
                </div>
            </section>

        </>

    )
}

export default Coupons
