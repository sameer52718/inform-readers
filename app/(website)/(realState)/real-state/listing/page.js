"use client"

import AdBanner from '@/components/partials/AdBanner'
import PriceFilter from '@/components/partials/PriceFilter'
import RealStateFilter from '@/components/partials/RealStateFilter'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import React, { useState } from 'react'





function RealStateListing() {


    return (
        <div>
            <AdBanner />
            <div className='container mx-auto px-44 py-8'>
                <RealStateFilter />

                <div className='grid grid-cols-12 gap-6 mt-12'>
                    <div className="col-span-3">
                        <PriceFilter />
                    </div>
                    <div className="col-span-9 bg-gray-200 p-4 rounded-2xl h-fit">
                        <div className='bg-white rounded-2xl p-4 flex items-center gap-4 mb-3'>
                            <Image src="/website/assets/images/real-state/01.png" width={500} height={500} alt="real-state" className='h-32 w-44 rounded-2xl' />

                            <div>
                                <h4 className='text-3xl font-bold mb-2'>
                                    House Market Experts.
                                </h4>

                                <p className='text-sm font-bold'>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                </p>
                            </div>
                        </div>
                        <div className='bg-white rounded-2xl p-4 flex items-center gap-4 mb-3'>
                            <Image src="/website/assets/images/real-state/01.png" width={500} height={500} alt="real-state" className='h-32 w-44 rounded-2xl' />

                            <div>
                                <h4 className='text-3xl font-bold mb-2'>
                                    House Market Experts.
                                </h4>

                                <p className='text-sm font-bold'>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                </p>
                            </div>
                        </div>
                        <div className='bg-white rounded-2xl p-4 flex items-center gap-4 mb-3'>
                            <Image src="/website/assets/images/real-state/01.png" width={500} height={500} alt="real-state" className='h-32 w-44 rounded-2xl' />

                            <div>
                                <h4 className='text-3xl font-bold mb-2'>
                                    House Market Experts.
                                </h4>

                                <p className='text-sm font-bold'>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                </p>
                            </div>
                        </div>
                        <div className='bg-white rounded-2xl p-4 flex items-center gap-4 mb-3'>
                            <Image src="/website/assets/images/real-state/01.png" width={500} height={500} alt="real-state" className='h-32 w-44 rounded-2xl' />

                            <div>
                                <h4 className='text-3xl font-bold mb-2'>
                                    House Market Experts.
                                </h4>

                                <p className='text-sm font-bold'>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                </p>
                            </div>
                        </div>
                        <div className='bg-white rounded-2xl p-4 flex items-center gap-4 mb-3'>
                            <Image src="/website/assets/images/real-state/01.png" width={500} height={500} alt="real-state" className='h-32 w-44 rounded-2xl' />

                            <div>
                                <h4 className='text-3xl font-bold mb-2'>
                                    House Market Experts.
                                </h4>

                                <p className='text-sm font-bold'>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


               
            </div>
        </div>
    )
}

export default RealStateListing
