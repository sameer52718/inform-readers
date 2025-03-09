"use client"


import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner';
import RealStateFilter from '@/components/partials/RealStateFilter'
import { Icon } from '@iconify/react';
import Image from 'next/image';
import React, { useState } from 'react'

const images = [
    "/website/assets/images/ad/01.png",
    "/website/assets/images/ad/02.png",
    "/website/assets/images/ad/03.png",
];

function RealStateDetail() {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div>
            <AdBanner />
            <div className='container mx-auto px-44 py-8'>
                <div className='flex items-center gap-1 px-16 pb-5'>
                    <h6 className='text-red-500'>Home</h6>
                    /
                    <h6>Electronics</h6>
                    /
                    <h6>HD Camera 5100</h6>
                </div>

                <div className='mb-10'>
                    <div className="flex flex-col items-center space-y-4">
                        {/* Large Image */}
                        <div className="border-2 border-black rounded-3xl mb-4">
                            <Image src={selectedImage} alt="Camera" width={3000} height={3000} className=" w-[400px] h-[360px]" />
                        </div>

                        {/* Thumbnail Carousel */}
                        <div className="flex items-center space-x-10">
                            <button className="text-red-500 text-6xl border rounded-full bg-[#d9d9d9] h-12 w-12 flex items-center justify-center"><Icon icon="lsicon:double-arrow-left-outline" width="40" height="40" /></button>
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`border-2 p-1 rounded-2xl cursor-pointer ${selectedImage === img ? "border-red-500" : "border-black"
                                        }`}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <Image src={img} alt="Camera Thumbnail" width={500} height={500} className="rounded-md h-40 w-40" />
                                </div>
                            ))}
                            <button className="text-red-500 text-6xl border rounded-full bg-[#d9d9d9] h-12 w-12 flex items-center justify-center"><Icon icon="lsicon:double-arrow-right-outline" width="40" height="40" /></button>
                        </div>
                    </div>
                </div>

                <div className='bg-gray-300 p-4 rounded-3xl flex flex-wrap gap-2 justify-between'>
                    <div className='bg-white flex items-center gap-2 border w-fit px-4 py-2 border-black rounded-3xl'>
                        <Icon icon="mdi:location" width="24" height="24" />
                        Get Direction
                    </div>
                    <div className='bg-white flex items-center gap-2 border w-fit px-4 py-2 border-black rounded-3xl'>
                        <Icon icon="mdi:phone" width="24" height="24" />
                        376548255xxx
                    </div>
                    <div className='bg-white flex items-center gap-2 border w-fit px-4 py-2 border-black rounded-3xl'>
                        <Icon icon="mynaui:link" width="24" height="24" />
                        Website
                    </div>
                    <div className='bg-white flex items-center gap-2 border w-fit px-4 py-2 border-black rounded-3xl'>
                        <Icon icon="material-symbols-light:info-outline" width="24" height="24" />
                        Report
                    </div>
                    <div className='bg-white flex items-center gap-2 border w-fit px-4 py-2 border-black rounded-3xl'>
                        <Icon icon="mdi-light:heart" width="24" height="24" />
                        Bookmark
                    </div>
                    <div className='bg-white flex items-center gap-2 border w-fit px-4 py-2 border-black rounded-3xl'>
                        <Icon icon="akar-icons:file" width="24" height="24" />
                        Claim listing
                    </div>
                </div>

                <HoverBanner padding='0px' />

                <div className="border border-gray-400 rounded-lg  inline-block bg-gray-300 w-full p-5">
                    <div className="grid grid-cols-2 gap-4 items-center bg-white p-8 rounded-2xl">
                        <div className="flex items-center space-x-2 mb-2">
                            <Icon icon="mdi:ruler-square-compass" className="text-5xl" />
                            <span className='text-2xl'>4800 sq ft</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Icon icon="mdi:door" className="text-5xl" />
                            <span className="text-2xl" s>3 rooms</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Icon icon="mdi:bed" className="text-5xl" />
                            <span className="text-2xl">2 beds</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Icon icon="mdi:shower" className="text-5xl" />
                            <span className="text-2xl">bathrooms</span>
                        </div>
                    </div>
                </div>

                <HoverBanner padding='0px' />

                <div>
                    <p className='text-lg font-semibold mb-5'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In eu mi bibendum neque egestas congue quisque. At urna condimentum mattis pellentesque id nibh tortor. Aliquam eleifend mi in nulla posuere. Sed sed risus pretium quam vulputate. Sit amet dictum sit amet justo donec enim diam vulputate. Condimentum lacinia quis vel eros donec ac odio. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Id interdum velit laoreet id. Enim diam vulputate ut pharetra sit. Dictum sit amet justo donec enim diam vulputate. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa.
                    </p>

                    <p className='text-lg font-semibold mb-5'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In eu mi bibendum neque egestas congue quisque. At urna condimentum mattis pellentesque id nibh tortor. Aliquam eleifend mi in nulla posuere. Sed sed risus pretium quam vulputate. Sit amet dictum sit amet justo donec enim diam vulputate.
                    </p>

                    <p className='text-lg font-semibold mb-5'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In eu mi bibendum neque egestas congue quisque. At urna condimentum mattis pellentesque id nibh tortor. Aliquam eleifend mi in nulla posuere. Sed sed risus pretium quam vulputate. Sit amet dictum sit amet justo donec enim diam vulputate. Condimentum lacinia quis vel eros donec ac odio. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Id interdum velit laoreet id. Enim diam vulputate ut pharetra sit. Dictum sit amet justo donec enim diam vulputate. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa.
                    </p>

                    <p className='text-lg font-semibold mb-5'>
                        Condimentum lacinia quis vel eros donec ac odio. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Id interdum velit laoreet id. Enim diam vulputate ut pharetra sit. Dictum sit amet justo donec enim diam vulputate. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa.
                    </p>


                    <h5 className='text-3xl font-bold my-5'>
                        Location
                    </h5>

                    <div className='border border-black rounded-2xl w-full h-[500px]'>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.05049102596!2d-74.30915197703663!3d40.697193370199564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1741520348326!5m2!1sen!2s"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className='w-full h-full'
                        ></iframe>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default RealStateDetail
