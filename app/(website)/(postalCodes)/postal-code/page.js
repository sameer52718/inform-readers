import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import WeatherFilter from '@/components/partials/WeatherFilter'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function PostalCode() {
    return (
        <div>
            <AdBanner />
            <div className='container mx-auto md:px-44 px-4 py-8'>
                <WeatherFilter />

                <h4 className='md:text-4xl text-2xl font-bold my-7 text-center'>
                    World <span className='text-red-500'> Zip/postal </span> Codes
                </h4>

                <div>
                    <h6 className='md:text-2xl text-xl font-semibold mb-3 px-2'>
                        Popular Countries:
                    </h6>

                    <div className='bg-gray-200 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6'>
                        {[...Array(4)].map((_, i) => (
                            <>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/01.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        USA
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>

                            </>
                        ))}

                    </div>
                </div>

                <div className="py-8">
                    <HoverBanner />
                </div>

                <div className='mb-5'>
                    <h6 className='text-2xl font-semibold mb-3 px-2'>
                        Oceania
                    </h6>

                    <div className='bg-gray-200 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6'>
                        {[...Array(4)].map((_, i) => (
                            <>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/01.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        USA
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>

                            </>
                        ))}

                    </div>
                </div>

                <div className='mb-5'>
                    <h6 className='text-2xl font-semibold mb-3 px-2'>
                        Africa
                    </h6>

                    <div className='bg-gray-200 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6'>
                        {[...Array(4)].map((_, i) => (
                            <>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/01.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        USA
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>

                            </>
                        ))}

                    </div>
                </div>

                <div className='mb-5'>
                    <h6 className='text-2xl font-semibold mb-3 px-2'>
                        South America
                    </h6>

                    <div className='bg-gray-200 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6'>
                        {[...Array(4)].map((_, i) => (
                            <>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/01.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        USA
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>

                            </>
                        ))}

                    </div>
                </div>
                <div className='mb-5'>
                    <h6 className='text-2xl font-semibold mb-3 px-2'>
                        Europa
                    </h6>

                    <div className='bg-gray-200 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6'>
                        {[...Array(4)].map((_, i) => (
                            <>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/01.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        USA
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>

                            </>
                        ))}

                    </div>
                </div>

                <div className="py-8">
                    <HoverBanner />
                </div>

                <div className='mb-5'>
                    <h6 className='text-2xl font-semibold mb-3 px-2'>
                        Asia
                    </h6>

                    <div className='bg-gray-200 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6'>
                        {[...Array(4)].map((_, i) => (
                            <>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/01.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        USA
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>

                            </>
                        ))}

                    </div>
                </div>

                <div className='mb-5'>
                    <h6 className='text-2xl font-semibold mb-3 px-2'>
                        North America & Caribbean
                    </h6>

                    <div className='bg-gray-200 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6'>
                        {[...Array(4)].map((_, i) => (
                            <>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/01.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        USA
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/02.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        UK
                                    </div>
                                </Link>
                                <Link href={"/postal-code/1"}>
                                    <div className='bg-white px-4 py-2 rounded-2xl flex items-center gap-2'>
                                        <Image src="/website/assets/images/country/03.png" width={500} height={500} alt="country" className='h-auto w-10' />
                                        New Zealand
                                    </div>
                                </Link>

                            </>
                        ))}

                    </div>
                </div>

                <div className="py-8">
                    <HoverBanner />
                </div>



            </div>
        </div>

    )
}

export default PostalCode
