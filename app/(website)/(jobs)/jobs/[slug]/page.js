import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import React from 'react'

function JobDetail() {
    return (
        <div className=''>
            <AdBanner />
            <div className='px-44 container mx-auto'>
                <div className='flex items-center gap-1  py-6'>
                    <h6 className='text-red-500'>Home</h6>
                    /
                    <h6>Jobs</h6>
                </div>

                <div className='border border-black bg-white rounded-2xl px-32 py-9 flex gap-6 items-center'>
                    <Image src={"/website/assets/images/company/01.png"} width={500} height={500} alt="company-logo" className='w-52 h-auto object-cover' />

                    <div>
                        <div className='flex items-center gap-3'>
                            <div className='bg-red-500 py-1 px-2 text-xs rounded-md text-white w-fit'>Freelance</div>
                            <h4 className='text-4xl font-bold mb-3'>Need charted</h4>

                        </div>
                        <p className='text-red-500 font-semibold mb-1.5'>@Mix Digital Entertainmentposted 7 years agoin Automotive</p>
                        <p className='text-red-500 font-semibold mb-1.5 flex items-center gap-1'> <span className='text-black'><Icon icon="mdi:location" width="20" height="20" /> </span>Airmont, New York, United States</p>
                        <p className='text-red-500 font-semibold mb-1.5 flex items-center gap-1'> <Icon icon="solar:calendar-bold" width="20" height="20" className='text-black' />Post Date : December 3, 2017</p>
                    </div>
                </div>

                <div className='mt-5'>
                    <h4 className='text-4xl font-bold mb-3'>Job Detail</h4>

                    <div className='bg-white border border-black py-10 px-12 rounded-2xl grid grid-cols-3 gap-5'>
                        {[...Array(5)].map((_, i) => (
                            <div className='flex items-center gap-2 mb-4' key={i}>
                                <Image src={"/website/assets/images/jobs/07.png"} width={500} height={500} alt="company-logo" className='w-14 h-auto object-cover' />
                                <div>
                                    <h6 className='text-xl font-bold'>
                                        Jobs Id
                                    </h6>
                                    <p className='text-sm font-semibold'>
                                        334
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
                <HoverBanner padding='0px' />

                <div>
                    <h4 className='text-3xl font-bold my-5'> Job Description</h4>

                    <p className='text-lg font-semibold mb-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>

                    <p className='text-lg font-semibold mb-4'>Has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.  </p>

                    <h4 className='text-3xl font-bold my-5'> What we can offer you</h4>

                    <p className='text-lg font-semibold mb-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>

                    <p className='text-lg font-semibold mb-4'>Has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.  </p>

                    <h4 className='text-3xl font-bold py-5'> Other jobs you may like</h4>

                    <div className='grid grid-cols-2 gap-5 pb-8'>
                        <div className='bg-white  py-3 px-5 rounded-2xl flex items-center gap-2'>
                            <Image src={"/website/assets/images/company/01.png"} width={500} height={500} alt="company-logo" className='w-52 h-auto object-cover' />
                            <div>
                                <h6 className='text-2xl font-bold'>Accountant For Early Audit Required</h6>
                                <div className='flex items-center gap-2 justify-between'>
                                    <p className='text-lg font-semibold'>Nelnons Hompathy</p>

                                    <button className='px-5 py-2 rounded-lg bg-red-500 text-white'>
                                        Full Time
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white  py-3 px-5 rounded-2xl flex items-center gap-2'>
                            <Image src={"/website/assets/images/company/01.png"} width={500} height={500} alt="company-logo" className='w-52 h-auto object-cover' />
                            <div>
                                <h6 className='text-2xl font-bold'>Accountant For Early Audit Required</h6>
                                <div className='flex items-center gap-2 justify-between'>
                                    <p className='text-lg font-semibold'>Nelnons Hompathy</p>

                                    <button className='px-5 py-2 rounded-lg bg-red-500 text-white'>
                                        Full Time
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <HoverBanner padding='0px' />
                </div>
            </div>

        </div>



    )
}

export default JobDetail
