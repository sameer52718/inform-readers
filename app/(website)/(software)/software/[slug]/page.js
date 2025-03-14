import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function SoftwareDetail() {
    return (
        <div className='container mx-auto'>
            <AdBanner />
            <div className='bg-[#f1f1f1]'>
                <div className='md:px-32  '>
                    <div className='flex items-center gap-1 md:px-32 px-4 py-6'>
                        <h6>Home</h6>
                        /
                        <h6>Electronics</h6>
                        /
                        <h6>HD Camera 5100</h6>
                    </div>
                    <div className='w-full mb-16 px-4'>
                        <h4 className='md:text-center  md:text-5xl text-2xl font-bold mb-5'>
                            Free <span className='text-red-500'>Software Download</span>
                        </h4>
                        <div className="bg-[#d9d9d9] p-4 sm:p-6 rounded-2xl flex flex-wrap items-center justify-between w-full gap-4">
                            {/* Software Info */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <Image
                                    src={"/website/assets/images/software/01.png"}
                                    alt="software-download"
                                    width={1000}
                                    height={1000}
                                    className="h-12 w-12 sm:h-16 sm:w-16"
                                />
                                <h4 className="text-lg sm:text-2xl font-bold">
                                    Avast Free Antivirus
                                    <span className="text-red-500 text-sm sm:text-base"> for Windows</span>
                                </h4>
                            </div>

                            <div className="bg-white p-3 sm:p-4 border border-black rounded-2xl flex items-center justify-between w-full sm:w-auto">
                                <ul className="mx-2 sm:mx-4">
                                    <li className="list-disc text-sm sm:text-lg font-semibold">Free-user Rating</li>
                                </ul>
                                <div className="flex gap-1 sm:gap-2">
                                    {[...Array(5)].map((_, index) => (
                                        <Icon key={index} icon="ic:baseline-star" width="20" height="20" className="text-[#ff0000] sm:w-6 sm:h-6" />
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='mb-16 md:px-0 px-4'>
                        <h4 className="md:text-3xl text-xl font-bold mb-5">
                            Key Details of Avast Free Antivirus
                        </h4>
                        <div className="bg-[#d9d9d9] md:p-10 p-4 rounded-3xl">
                            <ul className="list-disc pl-5 space-y-2">
                                <li className="text-lg font-semibold">
                                    Avast Free Antivirus works on Windows computers, including Windows 10. It also supports Android phones, iPhones, and Macs.
                                </li>
                                <li className="text-lg font-semibold">
                                    Avast is user-friendly, even for non-tech users. The interface is intuitive, with clear buttons and guided steps to help keep your computer secure.
                                </li>
                                <li className="text-lg font-semibold">
                                    It provides strong protection against viruses and hackers at no cost, making it an excellent security solution.
                                </li>
                            </ul>
                            <p className="text-lg font-semibold mt-4">
                                When you open Avast, it quickly assesses your computer's security status. Its straightforward design helps users monitor and maintain their device's health with ease. Using advanced technology, Avast detects and blocks new threats before they can cause harm. The interface also includes clear prompts that guide users through essential security decisions.
                            </p>
                        </div>
                    </div>
                    <div className='mb-12 md:px-0 px-4 '>
                        <h4 className="text-3xl font-bold mb-5">
                            Editors’ Review:
                        </h4>
                        <div className="bg-[#d9d9d9] md:p-10 p-5 rounded-3xl">
                            <ul className="list-disc pl-5 space-y-2">
                                <li className="text-lg font-semibold">
                                    Aggressively low pricing: If you do decide to order Avast Pro, you can do so from within the app, and Avast offers a one-year subscription for a reasonable $15, which is about half of its street price. If you change your mind, Avast offers a 60-day trial of Avast Internet Security, which was priced at $20 a year. Pro purports to add enhancements to online banking security and "a test space for checking suspicious apps." This latter function appears to be a sandbox, in which you can open an app and investigate its behavior without risking an infection.
                                </li>
                                <li className="text-lg font-semibold">
                                    Relatively muted sales pitch: Free antivirus apps have a reputation for being pretty pushy about paying for a subscription, but Avast is on the low-key end of the spectrum (and it has been for a number of years). There are a couple upgrade buttons on the main console, and a number of features (a firewall, URL safety verifier, and "Webcam Shield," among others) that redirect you to an order screen when you click on them, but nothing felt particularly tricky, and the sales pitch doesn't make ironclad claims about what the program can do.
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='flex items-center justify-center mb-12'>
                        <button className='bg-[#ff0000] text-3xl px-6 py-4 flex items-center gap-4 text-white rounded-2xl'>
                            Download Now
                            <div className='h-12 w-12 rounded-full bg-black flex items-center justify-center'>
                                <Icon icon="la:download" width="32" height="32" className='text-white' />
                            </div>
                        </button>
                    </div>
                    <div className="mb-12">
                        {/* Responsive Banner Image */}
                        <Image
                            src={"/website/assets/images/banner/01.png"}
                            width={1000}
                            height={1000}
                            className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover rounded-xl"
                        />

                        <div className="mt-8">
                            <h4 className="text-2xl sm:text-3xl font-bold text-red-500 mb-6 sm:mb-8">
                                Explore More
                            </h4>

                            {/* Responsive Grid */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {[...Array(16)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-[#d9d9d9] p-3 sm:p-4 rounded-lg flex items-center gap-3"
                                    >
                                        <Image
                                            src={"/website/assets/images/software/01.png"}
                                            width={100}
                                            height={100}
                                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                                        />

                                        <div>
                                            <h4 className="text-sm sm:text-lg font-semibold">
                                                <Link href={"/software/1"}>Avast Free Antivirus</Link>
                                            </h4>
                                            <p className="text-red-500 font-bold text-xs sm:text-sm">Free</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Responsive Button */}
                            <button className="p-3 sm:p-4 rounded-2xl text-white bg-red-500 w-full text-center mt-6 sm:mt-8 text-base sm:text-lg font-bold">
                                See All
                            </button>
                        </div>
                    </div>

                    <HoverBanner  />
                </div>
            </div>
        </div>
    )
}

export default SoftwareDetail
