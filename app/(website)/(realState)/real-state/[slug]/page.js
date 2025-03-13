"use client"


import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner';
import RealStateFilter from '@/components/partials/RealStateFilter'
import { Icon } from '@iconify/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react'

// Define images
const images = [
    "/website/assets/images/ad/01.png",
    "/website/assets/images/ad/02.png",
    "/website/assets/images/ad/03.png",
];


const ImageSection = () => {
    const sliderRef = useRef(null);

    // Define images
    const images = [
        "/website/assets/images/ad/01.png",
        "/website/assets/images/ad/02.png",
        "/website/assets/images/ad/03.png",
    ];

    // State to store selected image
    const [selectedImage, setSelectedImage] = useState(images[0]);

    // Scroll functions
    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -100, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 100, behavior: "smooth" });
        }
    };

    return (
        <div className="mb-10">
            <div className="flex flex-col items-center space-y-4">
                {/* Large Image Display */}
                <div className="border-2 border-black rounded-3xl mb-4 w-full max-w-md">
                    <Image
                        src={selectedImage}
                        alt="Camera"
                        width={3000}
                        height={3000}
                        className="w-full h-auto rounded-2xl"
                    />
                </div>

                {/* Thumbnail Slider */}
                <div className="relative w-full max-w-lg flex items-center">
                    {/* Left Scroll Button */}
                    <button
                        className="absolute left-0 z-10 bg-gray-300 rounded-full p-2 shadow-md"
                        onClick={scrollLeft}
                    >
                        <Icon icon="lsicon:double-arrow-left-outline" width="30" height="30" />
                    </button>

                    {/* Thumbnail List */}
                    <div
                        ref={sliderRef}
                        className="flex items-center space-x-2 overflow-x-auto scroll-smooth w-full px-12 scrollbar-hide"
                    >
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className={`border-2 p-1 rounded-2xl cursor-pointer ${selectedImage === img ? "border-red-500" : "border-black"
                                    }`}
                                onClick={() => setSelectedImage(img)}
                            >
                                <Image
                                    src={img}
                                    alt="Camera Thumbnail"
                                    width={500}
                                    height={500}
                                    className="rounded-md h-auto w-24 sm:w-32"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        className="absolute right-0 z-10 bg-gray-300 rounded-full p-2 shadow-md"
                        onClick={scrollRight}
                    >
                        <Icon icon="lsicon:double-arrow-right-outline" width="30" height="30" />
                    </button>
                </div>
            </div>
        </div>
    );
};

function RealStateDetail() {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div>
            <AdBanner />
            <div className='container mx-auto md:px-44 px-4 py-8'>
                <div className='flex items-center gap-1 md:px-16 pb-5'>
                    <h6 className='text-red-500'>Home</h6>
                    /
                    <h6>Electronics</h6>
                    /
                    <h6>HD Camera 5100</h6>
                </div>

                <ImageSection />


                <div className="bg-gray-300 p-4 rounded-3xl flex flex-wrap gap-2 justify-center md:justify-between">
                    {[
                        { icon: "mdi:location", text: "Get Direction" },
                        { icon: "mdi:phone", text: "376548255xxx" },
                        { icon: "mynaui:link", text: "Website" },
                        { icon: "material-symbols-light:info-outline", text: "Report" },
                        { icon: "mdi-light:heart", text: "Bookmark" },
                        { icon: "akar-icons:file", text: "Claim listing" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white flex items-center gap-2 border w-full sm:w-auto px-4 py-2 border-black rounded-3xl justify-center"
                        >
                            <Icon icon={item.icon} width="24" height="24" />
                            <span className="truncate">{item.text}</span>
                        </div>
                    ))}
                </div>

                <div className='py-8'>
                    <HoverBanner />
                </div>

                <div className="border border-gray-400 rounded-lg bg-gray-300 w-full p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center bg-white p-6 sm:p-8 rounded-2xl">
                        {[
                            { icon: "mdi:ruler-square-compass", text: "4800 sq ft" },
                            { icon: "mdi:door", text: "3 rooms" },
                            { icon: "mdi:bed", text: "2 beds" },
                            { icon: "mdi:shower", text: "Bathrooms" },
                        ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Icon icon={item.icon} className="text-4xl sm:text-5xl" />
                                <span className="text-xl sm:text-2xl truncate">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='py-8'>
                    <HoverBanner />
                </div>

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

                    <div className='border border-black rounded-2xl w-full h-[500px] overflow-hidden'>
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
