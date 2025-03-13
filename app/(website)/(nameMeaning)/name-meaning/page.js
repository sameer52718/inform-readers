import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import NameFilter from '@/components/partials/NameFilter'
import NamePagination from '@/components/ui/NamePagination'
import { nameReligion } from '@/constant/data'
// import { _ } from '@faker-js/faker/dist/airline-BcEu2nRk'
import Link from 'next/link'
import React from 'react'





function NameMeaning() {
    return (
        <div className='container mx-auto'>
            <AdBanner />

            <div className='md:px-44 px-4 py-8'>
                <NameFilter />

                <div className="mt-8">
                    <h4 className="font-semibold text-2xl">Search Baby Names By Religion:</h4>

                    <div className='bg-[#D9d9d9] md:p-5 rounded-xl border border-black mt-2 px-2 sm:px-12 md:gap-3 gap-2 py-4 flex flex-wrap'>
                        {nameReligion.map((name, index) => (
                            <Link key={index} href={"#"} className='bg-white md:py-4 p-3 md:px-6 w-fit md:text-xl text-sm font-semibold rounded-2xl mb-3 sm:mb-0'>
                                {name}
                            </Link>
                        ))}
                    </div>
                </div>

            </div>


            <div className="md:px-48 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>


            <div className='md:px-44 px-4 py-8'>
                <div>
                    <h5 className='text-xl font-semibold '>Browse Boys Names by Alphabets</h5>
                    <div className='mt-4'>
                        <NamePagination totalPages={26} currentPage={1} />

                        {/* Table for names, meaning, and details */}
                        <div className='overflow-x-auto'>
                            <table className='min-w-full bg-red-600 text-white rounded-lg mt-3'>
                                <thead>
                                    <tr>
                                        <th className="py-3 md:text-2xl text-base font-semibold border-b-2">Names</th>
                                        <th className="py-3 md:text-2xl text-base font-semibold border-b-2">Meaning</th>
                                        <th className="py-3 md:text-2xl text-base font-semibold border-b-2 text-center">Details</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-[#d9d9d9]'>
                                    {[...Array(3)].map((item, index) => (
                                        <tr key={index} className='border-b-2'>
                                            <td className="py-4 md:text-xl text-sm px-3 text-black font-semibold">Ahmed</td>
                                            <td className="py-4 md:text-xl text-sm px-3 text-black font-semibold">Praiseworthy</td>
                                            <td className="py-4 md:text-xl text-sm px-3 text-black font-semibold text-center">
                                                <Link href={"/name-meaning/1"} className='underline text-red-500'>
                                                    View Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <div className="md:px-48 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

            <div className='md:px-44 px-4 py-8'>
                <div>
                    <h5 className='text-xl font-semibold'>Browse Boys Names by Alphabets</h5>
                    <div className='mt-4'>
                        <NamePagination totalPages={26} currentPage={1} />

                        {/* Table Header */}
                        <div className='overflow-x-auto mt-3 bg-red-600 rounded-lg'>
                            <table className='min-w-full table-auto'>
                                <thead>
                                    <tr>
                                        <th className='md:text-2xl text-lg py-3 text-white font-semibold border-b-2 sm:border-r-2 sm:border-white text-center sm:text-left'>
                                            Names
                                        </th>
                                        <th className='md:text-2xl text-lg py-3 text-white font-semibold border-b-2 sm:border-r-2 sm:border-white text-center sm:text-left'>
                                            Meaning
                                        </th>
                                        <th className='text-center md:text-2xl text-lg py-3 text-white font-semibold border-b-2 sm:border-none'>
                                            Details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(3)].map((item, index) => (
                                        <tr key={index} className='bg-[#d9d9d9]'>
                                            <td className="md:text-xl text-sm px-4 font-semibold py-3">{`Ahmed`}</td>
                                            <td className="md:text-xl text-sm px-4 font-semibold py-3">{`Praiseworthy`}</td>
                                            <td className="md:text-xl text-sm px-4 font-semibold py-3 text-center">
                                                <Link href={"/name-meaning/1"} className="underline text-red-500">
                                                    View Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>
        </div>
    )
}

export default NameMeaning
