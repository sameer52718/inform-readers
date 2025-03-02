import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import NameFilter from '@/components/partials/NameFilter'
import NamePagination from '@/components/ui/NamePagination'
import { nameReligion } from '@/constant/data'
import Link from 'next/link'
import React from 'react'





function NameMeaning() {
    return (
        <div>
            <AdBanner />

            <div className='px-32 py-8'>
                <NameFilter />

                <div className="mt-8">
                    <h4 className=" font-semibold text-2xl">Search Baby Names By Religion:</h4>

                    <div className='bg-[#D9d9d9] p-5 rounded-xl border border-black mt-2 px-12 gap-3 py-4 flex items-center flex-wrap'>
                        {nameReligion.map((name, index) => (
                            <Link key={index} href={"#"} className='bg-white py-4  px-6  w-fit text-xl font-semibold rounded-2xl'>
                                {name}
                            </Link>
                        ))}
                    </div>
                </div>

                <HoverBanner padding='0px' />

                <div>
                    <h5 className='text-xl font-semibold '>Browse Boys Names by Alphabets</h5>
                    <div className='mt-4'>
                        <NamePagination totalPages={26} currentPage={1} />

                        <div className='grid grid-cols-3 gap-4  bg-red-600 rounded-lg mt-3 px-8'>
                            <div className="col-span-1  text-2xl py-3 text-white font-semibold border-r-2 border-white ">Names </div>
                            <div className="col-span-1  text-2xl py-3 text-white font-semibold border-r-2 border-white">Meaning</div>
                            <div className="col-span-1 text-center text-2xl py-3 text-white font-semibold ">Details</div>
                        </div>

                        <div className='py-8 px-8 bg-[#d9d9d9]  mt-5 rounded-xl  gap-4'>
                            <div className='grid grid-cols-3 mb-4'>
                                <div className="col-span-1 text-xl font-semibold">Ahmed</div>
                                <div className="col-span-1 text-xl font-semibold">Praiseworthy</div>
                                <div className="col-span-1 text-xl font-semibold underline text-red-500 text-center">
                                    <Link href={"#"}>
                                        View Detail
                                    </Link>
                                </div>
                            </div>
                            <div className='grid grid-cols-3 mb-4'>
                                <div className="col-span-1 text-xl font-semibold">Ahmed</div>
                                <div className="col-span-1 text-xl font-semibold">Praiseworthy</div>
                                <div className="col-span-1 text-xl font-semibold underline text-red-500 text-center">
                                    <Link href={"#"}>
                                        View Detail
                                    </Link>
                                </div>
                            </div>
                            <div className='grid grid-cols-3 mb-4'>
                                <div className="col-span-1 text-xl font-semibold">Ahmed</div>
                                <div className="col-span-1 text-xl font-semibold">Praiseworthy</div>
                                <div className="col-span-1 text-xl font-semibold underline text-red-500 text-center">
                                    <Link href={"#"}>
                                        View Detail
                                    </Link>
                                </div>
                            </div>



                        </div>

                    </div>
                </div>

                <HoverBanner padding='0px' />

                <div>
                    <h5 className='text-xl font-semibold '>Browse Girls Names by Alphabets</h5>
                    <div className='mt-4'>
                        <NamePagination totalPages={26} currentPage={1} />

                        <div className='grid grid-cols-3 gap-4  bg-red-600 rounded-lg mt-3 px-8'>
                            <div className="col-span-1  text-2xl py-3 text-white font-semibold border-r-2 border-white ">Names </div>
                            <div className="col-span-1  text-2xl py-3 text-white font-semibold border-r-2 border-white">Meaning</div>
                            <div className="col-span-1 text-center text-2xl py-3 text-white font-semibold ">Details</div>
                        </div>

                        <div className='py-8 px-8 bg-[#d9d9d9]  mt-5 rounded-xl  gap-4'>
                            <div className='grid grid-cols-3 mb-4'>
                                <div className="col-span-1 text-xl font-semibold">Aisha</div>
                                <div className="col-span-1 text-xl font-semibold">Praiseworthy</div>
                                <div className="col-span-1 text-xl font-semibold underline text-red-500 text-center">
                                    <Link href={"#"}>
                                        View Detail
                                    </Link>
                                </div>
                            </div>
                            <div className='grid grid-cols-3 mb-4'>
                                <div className="col-span-1 text-xl font-semibold">Aisha</div>
                                <div className="col-span-1 text-xl font-semibold">Praiseworthy</div>
                                <div className="col-span-1 text-xl font-semibold underline text-red-500 text-center">
                                    <Link href={"#"}>
                                        View Detail
                                    </Link>
                                </div>
                            </div>
                            <div className='grid grid-cols-3 mb-4'>
                                <div className="col-span-1 text-xl font-semibold">Aisha</div>
                                <div className="col-span-1 text-xl font-semibold">Praiseworthy</div>
                                <div className="col-span-1 text-xl font-semibold underline text-red-500 text-center">
                                    <Link href={"#"}>
                                        View Detail
                                    </Link>
                                </div>
                            </div>



                        </div>

                    </div>
                </div>

                <HoverBanner padding='0px' />


            </div>

        </div>
    )
}

export default NameMeaning
