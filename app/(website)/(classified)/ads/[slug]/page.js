"use client";

import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import React, { useState } from 'react'

const images = [
    "/website/assets/images/ad/01.png",
    "/website/assets/images/ad/02.png",
    "/website/assets/images/ad/03.png",
];

function AdDetail() {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className='container mx-auto'>
            <AdBanner />
            <div className='md:px-44 px-4 bg-white'>
                <div className="px-4 sm:px-10 md:px-20 lg:px-32 py-4 sm:py-6 flex flex-wrap items-center gap-1 text-sm sm:text-base">
                    <h6>Home</h6>
                    <span>/</span>
                    <h6>Electronics</h6>
                    <span>/</span>
                    <h6>HD Camera 5100</h6>
                </div>

                <div className="flex flex-wrap items-center py-3 md:py-0 justify-center sm:justify-end gap-3 mb-4 sm:mb-5">
                    <Icon icon="material-symbols:share-outline" width="24" height="24" />
                    <Icon icon="logos:whatsapp-icon" width="24" height="24" />
                    <Icon icon="skill-icons:instagram" width="24" height="24" />
                    <Icon icon="logos:facebook" width="24" height="24" />
                    <Icon icon="devicon:linkedin" width="24" height="24" />
                    <Icon icon="fa6-brands:square-x-twitter" width="24" height="24" />
                </div>


                <div>
                    <h4 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
                        HD Camera <span className="text-red-500">5100</span>
                    </h4>

                    <div className="mb-10">
                        <div className="flex flex-col items-center space-y-4">
                            {/* Large Image */}
                            <div className="border-2 border-black rounded-3xl mb-4">
                                <Image
                                    src={selectedImage}
                                    alt="Camera"
                                    width={3000}
                                    height={3000}
                                    className="w-[300px] sm:w-[350px] md:w-[400px] h-[250px] sm:h-[320px] md:h-[360px]"
                                />
                            </div>

                            {/* Thumbnail Carousel */}
                            <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-10 overflow-x-auto">
                                <button className="text-red-500 text-3xl sm:text-5xl md:text-6xl border rounded-full bg-[#d9d9d9] h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center">
                                    <Icon icon="lsicon:double-arrow-left-outline" width="30" />
                                </button>

                                <div className="flex gap-2 sm:gap-4">
                                    {images.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`border-2 p-1 rounded-2xl cursor-pointer ${selectedImage === img ? "border-red-500" : "border-black"}`}
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <Image
                                                src={img}
                                                alt="Camera Thumbnail"
                                                width={500}
                                                height={500}
                                                className="rounded-md h-20 w-20 sm:h-28 sm:w-28 md:h-40 md:w-40"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button className="text-red-500 text-3xl sm:text-5xl md:text-6xl border rounded-full bg-[#d9d9d9] h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center">
                                    <Icon icon="lsicon:double-arrow-right-outline" width="30" />
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="bg-gray-300 p-4 sm:p-6 rounded-xl">
                        <div className="bg-white p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-12 rounded-3xl gap-4 sm:gap-0">
                            {/* Seller Info */}
                            <div className="sm:col-span-9 flex flex-col sm:flex-row gap-4 sm:gap-3">
                                {/* Icon */}
                                <Image
                                    src="/website/assets/images/icons/image-circle.png"
                                    width={1000}
                                    height={1000}
                                    className="w-16 sm:w-auto h-16 sm:h-20 mx-auto sm:mx-0"
                                    alt="icon-1"
                                />
                                {/* Seller Details */}
                                <div className="text-center sm:text-left">
                                    <h4 className="text-xl sm:text-2xl font-bold mb-2">
                                        Seller Information
                                    </h4>
                                    <p className="text-lg font-bold mb-3">RadiusTheme</p>

                                    {/* Contact Info */}
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-x-16 sm:gap-y-4 flex-wrap">
                                        <p>
                                            <Icon icon="mdi:location" width="20" height="20" className="inline mr-1" />
                                            House#18, Road#07 Hutchinson, Kansas
                                        </p>
                                        <p>
                                            <Icon icon="ic:baseline-phone" width="20" height="20" className="inline mr-1" />
                                            376548255xxx
                                        </p>
                                        <p>
                                            <Icon icon="ic:outline-circle" width="20" height="20" className="inline mr-1" />
                                            Offline Now
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat & Email Buttons */}
                            <div className="sm:col-span-3 flex flex-col gap-2">
                                <button className="bg-red-500 text-white py-2 px-6 font-bold text-lg sm:text-2xl w-full rounded-lg flex items-center justify-center gap-2">
                                    <Icon icon="mage:we-chat" width="30" height="30" />
                                    Chat
                                </button>
                                <button className="bg-red-500 text-white py-2 px-6 font-bold text-lg sm:text-2xl w-full rounded-lg flex items-center justify-center gap-2">
                                    <Icon icon="dashicons:email" width="30" height="30" />
                                    Email to Seller
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-2 sm:gap-6 pb-2 pt-5 text-center sm:text-right">
                        <h4 className="text-lg font-bold">July 18, 2019 12:20 pm</h4>
                        <h4 className="text-lg font-bold flex items-center justify-center sm:justify-end">
                            <Icon icon="mdi:location" width="20" height="20" className="mr-1" />
                            Hutchinson, Kansas
                        </h4>
                    </div>
                </div>
            </div>


            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>


            <div className='md:px-44 px-4 bg-white'>
                <div>
                    <h4 className="text-3xl font-bold mb-5 text-center sm:text-left">Overview</h4>

                    <div className="bg-[#d9d9d9] border border-black p-5 rounded-3xl">
                        <div className="bg-white border border-black rounded-2xl py-6">
                            {/* Product Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 px-6 py-2 mb-3 text-center sm:text-left">
                                <div className="text-xl sm:text-2xl font-semibold">Brand:</div>
                                <div className="text-xl sm:text-2xl font-semibold">Other Brand</div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 px-6 py-2 mb-3 text-center sm:text-left">
                                <div className="text-xl sm:text-2xl font-semibold">Item Type:</div>
                                <div className="text-xl sm:text-2xl font-semibold">Digital Camera</div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 px-6 py-2 mb-3 text-center sm:text-left">
                                <div className="text-xl sm:text-2xl font-semibold">Condition:</div>
                                <div className="text-xl sm:text-2xl font-semibold">New</div>
                            </div>
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="mt-12 px-4 sm:px-0">
                        <p className="mb-4 font-semibold text-base sm:text-lg leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In eu mi bibendum neque egestas congue quisque.
                        </p>
                        <p className="mb-4 font-semibold text-base sm:text-lg leading-relaxed">
                            At urna condimentum mattis pellentesque id nibh tortor. Aliquam eleifend mi in nulla posuere. Sed sed risus pretium quam vulputate. Sit amet dictum sit amet justo donec enim diam vulputate.
                        </p>
                        <p className="mb-4 font-semibold text-base sm:text-lg leading-relaxed">
                            Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa.
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className="text-3xl font-bold mb-5 text-center sm:text-left">Location</h4>

                    <div className="bg-[#d9d9d9] border border-black h-[400px] sm:h-[500px] md:h-[550px] rounded-3xl overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.05049102596!2d-74.30915197703663!3d40.697193370199564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2snl!4v1741030403478!5m2!1sen!2snl"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="h-full w-full"
                        />
                    </div>
                </div>

                <div className='my-10'>
                    <Image src={"/website/assets/images/banner/01.png"} width={1000} height={1000} alt="banner" className='w-full h-auto' />
                </div>

            </div>
        </div >
    )
}

export default AdDetail
