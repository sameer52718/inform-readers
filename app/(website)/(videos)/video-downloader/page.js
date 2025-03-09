import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import VideoDownloaderSearch from '@/components/partials/VideoDownloaderSearch'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import React from 'react'

const images = [
    { img: "/website/assets/images/videodownloader/01.png" },
    { img: "/website/assets/images/videodownloader/02.png" },
]

const socialLinks = [
    { name: 'Facebook', icon: 'mdi:facebook', link: '#' },
    { name: 'Instagram', icon: 'mdi:instagram', link: '#' },
    { name: 'Youtube', icon: 'mdi:youtube', link: '#' },
    { name: 'Tiktok', icon: 'iconoir:tiktok-solid', link: '#' },
];

function VideoDownloader() {
    return (
        <div>
            <AdBanner />
            <div className='container mx-auto px-44 py-8'>
                <div className="flex space-x-6 text-gray-500 justify-center pb-10">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.link}
                            className="flex items-center space-x-2 hover:text-black"
                        >
                            <div className="bg-black text-white p-2 rounded-lg">
                                <Icon icon={social.icon} className="text-xl" />
                            </div>
                            <span>{social.name}</span>
                        </a>
                    ))}
                </div>

                <h4 className='text-4xl font-bold text-center mt-6 '>Video <span className='text-red-500'> Downloader </span></h4>
                <p className='text-lg text-center text-gray-400 mb-7'>Download Video Instagram, Photo, Reels, Stories</p>
                <VideoDownloaderSearch />
            </div>
            <AdBanner />

            <div className='container mx-auto px-44 py-8'>
                <h4 className='text-3xl font-bold text-center mt-6 mb-4'>
                    All Feature
                </h4>

                {images.map((image, index) => (
                    <div className="flex flex-col mb-8 md:flex-row items-center bg-white p-6 rounded-3xl border shadow-md">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                <Image
                                    src={image.img}
                                    alt="Instagram Post"
                                    className="w-full h-auto"
                                    width={1000}
                                    height={600}
                                />
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="w-full md:w-2/3 p-4">
                            <h3 className="text-3xl font-bold mb-2">Instagram video downloader</h3>
                            <p className="font-semibold mb-4 text-sm">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen book.
                            </p>
                            <p className="font-semibold mb-4">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen book.
                            </p>
                            <p className="font-semibold">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen book.
                            </p>
                        </div>
                    </div>
                ))}
                <HoverBanner padding='0px' />

                {images.map((image, index) => (
                    <div className="flex flex-col mb-8 md:flex-row items-center bg-white p-6 rounded-3xl border shadow-md">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                <Image
                                    src={image.img}
                                    alt="Instagram Post"
                                    className="w-full h-auto"
                                    width={1000}
                                    height={600}
                                />
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="w-full md:w-2/3 p-4">
                            <h3 className="text-3xl font-bold mb-2">Instagram video downloader</h3>
                            <p className="font-semibold mb-4 text-sm">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen book.
                            </p>
                            <p className="font-semibold mb-4">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen book.
                            </p>
                            <p className="font-semibold">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen book.
                            </p>
                        </div>
                    </div>
                ))}

            </div>



        </div >
    )
}

export default VideoDownloader
