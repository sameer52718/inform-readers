import HoverBanner from '@/components/partials/HoverBanner'
import WeatherFilter from '@/components/partials/WeatherFilter'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'



const weatherData = [
    { name: "Multan", image: "/website/assets/images/weather/sky-1.png", temp: "30" },
    { name: "Karachi", image: "/website/assets/images/weather/sky-2.png", temp: "25" },
    { name: "Lahore", image: "/website/assets/images/weather/sky-3.png", temp: "28" },
    { name: "Islamabad", image: "/website/assets/images/weather/rainy-1.png", temp: "32" },
    { name: "Peshawar", image: "/website/assets/images/weather/rainy-2.png", temp: "35" },
    { name: "Quetta", image: "/website/assets/images/weather/extreme-weather-1.png", temp: "27" },
    { name: "Hyderabad", image: "/website/assets/images/weather/extreme-weather-2.png", temp: "18" },
    { name: "Lahore", image: "/website/assets/images/weather/extreme-weather-1.png", temp: "50" },
]

function WeatherPage() {
    return (
        <>
            <div className='md:px-44 px-4 py-8'>
                <WeatherFilter />

                <div className="bg-[#C1C1C1] flex flex-wrap items-center my-5 justify-between py-4 px-4 rounded-lg">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                        Pakistan Weather Radar
                    </h3>
                    <h6 className="text-gray-700 text-sm sm:text-base flex items-center">
                        <Link href={"#"}>
                            See More
                        </Link>
                        <Icon icon="lsicon:arrow-right-outline" width="20" height="20" className="ml-1" />
                    </h6>
                </div>



                <div className="border border-gray-600 mb-8 rounded-lg mt-4 w-full">
                    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                        {/* 16:9 Aspect Ratio for responsiveness */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.05049102596!2d-74.30915197703663!3d40.697193370199564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2snl!4v1740882334095!5m2!1sen!2snl"
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>

                <HoverBanner />


                <h4 className="text-3xl sm:text-4xl font-semibold px-3 mt-8 text-center sm:text-left">
                    Pakistan Weather Conditions
                </h4>

                <div className="border border-black grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8 bg-white md:p-2 px-3 py-3 sm:p-12 rounded-3xl gap-6 sm:gap-10">
                    {weatherData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#d4d4d4] flex items-center justify-between p-4 sm:p-5 rounded-xl"
                        >
                            <div className="text-xl sm:text-2xl  font-semibold">
                                {item.name}
                            </div>

                            <div className="flex items-center gap-4 sm:gap-2">
                                <Image
                                    src={item.image}
                                    width={1000}
                                    height={1000}
                                    className="h-12 w-12 sm:h-12 sm:w-12"
                                    alt={item.name}
                                />
                                <div className="text-xl sm:text-2xl p-1">
                                    {item.temp}°
                                </div>

                            </div>

                        </div>
                    ))}
                </div>


                <div className="mt-10 px-4">
                    <h4 className="text-3xl sm:text-4xl font-semibold mb-4 text-center sm:text-left">
                        Pakistan Weather Conditions
                    </h4>

                    <div className="bg-[#d4d4d4] p-4 sm:p-6 rounded-xl">
                        <div className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
                            <Image
                                src={"/website/assets/images/weather/01.png"}
                                width={1000}
                                height={1000}
                                className="w-28 sm:w-44 h-auto"
                                alt="Weather Icon"
                            />

                            <h6 className="text-xl sm:text-3xl text-black font-semibold text-center sm:text-left">
                                Bitcoin Price Drops for Third Consecutive Day Alongside Ether and Most Altcoins
                            </h6>
                        </div>
                    </div>
                </div>


                <div className="mt-10 px-4">
                    <h4 className="text-3xl sm:text-4xl font-semibold mb-4 text-center sm:text-left">
                        Pakistan Weather Conditions
                    </h4>

                    <div className="bg-[#d4d4d4] p-4 sm:p-6 rounded-xl">
                        <div className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
                            <Image
                                src={"/website/assets/images/weather/01.png"}
                                width={1000}
                                height={1000}
                                className="w-28 sm:w-44 h-auto"
                                alt="Weather Icon"
                            />

                            <h6 className="text-xl sm:text-3xl text-black font-semibold text-center sm:text-left">
                                Bitcoin Price Drops for Third Consecutive Day Alongside Ether and Most Altcoins
                            </h6>
                        </div>
                    </div>
                </div>

                <div className='mt-10'>
                    <h4 className='text-3xl sm:text-4xl font-semibold px-3 mb-4 text-center sm:text-left'>Weather News</h4>

                    <div className='bg-white p-6 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10'>
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="w-full bg-gray-300 rounded-3xl px-6 py-6 flex flex-col items-center">
                                {/* Image Section */}
                                <div className="w-full border-2 border-red-500 rounded-3xl overflow-hidden">
                                    <Image
                                        width={1000}
                                        height={1000}
                                        src="/website/assets/images/weather/01.png" // Replace with actual image URL
                                        alt="Wildfire Smoke"
                                        className="w-full h-48 object-cover rounded-3xl"
                                    />
                                </div>

                                {/* News Title */}
                                <p className="font-semibold text-lg mt-5 px-2 pt-2 border-t border-gray-700 text-center sm:text-left">
                                    Air quality concerns: The dangers of inhaling wildfire smoke
                                </p>
                            </div>
                        ))}
                    </div>
                </div>


                <div className='mt-10'>
                    <h4 className='text-3xl sm:text-4xl font-semibold px-3 mb-4 text-center sm:text-left'>Trending Today</h4>

                    <div className='bg-white p-6 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10'>
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="w-full bg-gray-300 rounded-3xl px-6 py-6 flex flex-col items-center">
                                {/* Image Section */}
                                <div className="w-full border-2 border-red-500 rounded-3xl overflow-hidden">
                                    <Image
                                        width={1000}
                                        height={1000}
                                        src="/website/assets/images/weather/01.png"
                                        alt="Trending News"
                                        className="w-full h-48 object-cover rounded-3xl"
                                    />
                                </div>

                                {/* News Title */}
                                <p className="font-semibold text-lg mt-5 px-2 pt-2 border-t border-gray-700 text-center sm:text-left">
                                    Air quality concerns: The dangers of inhaling wildfire smoke
                                </p>
                            </div>
                        ))}
                    </div>
                </div>


                <div className='mt-6'>
                    <HoverBanner />
                </div>
            </div>
        </>
    )
}

export default WeatherPage
