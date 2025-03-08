import HoverBanner from '@/components/partials/HoverBanner'
import WeatherFilter from '@/components/partials/WeatherFilter'
import { Icon } from '@iconify/react'
import Image from 'next/image'
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
            <div className='px-44 py-8'>
                <WeatherFilter />
            </div>

            <div className='px-44'>
                <div className='bg-[#C1C1C1] flex items-center justify-between py-4 px-4 rounded-lg'>
                    <h3 className='text-3xl font-semibold text-white'>Pakistan Weather Radar</h3>
                    <h6 className='text-gray-600'>See More <Icon icon="lsicon:arrow-right-outline" width="20" height="20" className='inline ml-0' /></h6>
                </div>


                <div className='border border-gray-600 rounded-lg mt-4 h-[550px] w-full'>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.05049102596!2d-74.30915197703663!3d40.697193370199564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2snl!4v1740882334095!5m2!1sen!2snl"
                        className='w-full h-full'
                        // height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

            <div className='px-44'>
                <HoverBanner padding="0px" />
                <h4 className='text-4xl font-semibold px-3'>Pakistan Weather Conditions</h4>
                <div className='border border-black grid grid-cols-12 mt-8 bg-white p-12 rounded-3xl gap-10'>
                    {weatherData.map((item, index) => (
                        <div key={index} className='bg-[#d4d4d4] col-span-6 flex items-center justify-between p-6 rounded-xl'>
                            <div className='text-3xl font-semibold'>{item.name}</div>
                            <div className='flex items-center gap-8 '>
                                <Image src={item.image} width={1000} height={1000} className='h-20 w-20' />
                                <div className='text-2xl relative p-1'>
                                    {item.temp}
                                    <div className='absolute top-1 -right-1 h-2 w-2 text-sm rounded-full  bg-[#d4d4d4] border border-black'></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='mt-10'>
                    <h4 className='text-4xl font-semibold px-3 mb-4'>Pakistan Weather Conditions</h4>
                    <div className='bg-[#d4d4d4] p-6 rounded-xl'>
                        <div className='bg-white rounded-2xl p-3 flex items-center gap-10'>
                            <Image src={"/website/assets/images/weather/01.png"} width={1000} height={1000} className='w-44 h-auto' />

                            <h6 className='text-3xl text-black font-semibold'>Bitcoin Price Drops for Third Consecutive Day Alongside Ether and Most Altcoins</h6>
                        </div>
                    </div>
                </div>

                <div className='mt-10'>
                    <h4 className='text-4xl font-semibold px-3 mb-4'>Winter Storm Alert</h4>
                    <div className='bg-[#d4d4d4] p-6 rounded-xl'>
                        <div className='bg-white rounded-2xl p-3 flex items-center gap-10'>
                            <Image src={"/website/assets/images/weather/01.png"} width={1000} height={1000} className='w-44 h-auto' />

                            <h6 className='text-3xl text-black font-semibold'>Bitcoin Price Drops for Third Consecutive Day Alongside Ether and Most Altcoins</h6>
                        </div>
                    </div>
                </div>

                <div className='mt-10'>
                    <h4 className='text-4xl font-semibold px-3 mb-4'>Weather News</h4>
                    <div className='bg-[#ffffff] p-6 rounded-xl grid grid-cols-3 gap-10'>
                        <div className="w-full bg-gray-300 rounded-3xl px-10  py-7  flex flex-col items-center col-span-1">
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

                            <p className=" font-semibold text-lg mt-5 px-2 pt-2  border-t border-gray-700">
                                Air quality concerns: The dangers of inhaling wildfire smoke
                            </p>
                        </div>
                        <div className="w-full bg-gray-300 rounded-3xl px-10  py-7  flex flex-col items-center col-span-1">
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

                            <p className=" font-semibold text-lg mt-5 px-2 pt-2  border-t border-gray-700">
                                Air quality concerns: The dangers of inhaling wildfire smoke
                            </p>
                        </div>
                        <div className="w-full bg-gray-300 rounded-3xl px-10  py-7  flex flex-col items-center col-span-1">
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

                            <p className=" font-semibold text-lg mt-5 px-2 pt-2  border-t border-gray-700">
                                Air quality concerns: The dangers of inhaling wildfire smoke
                            </p>
                        </div>
                    </div>
                </div>

                <div className='mt-10'>
                    <h4 className='text-4xl font-semibold px-3 mb-4'>Trending Today</h4>
                    <div className='bg-[#ffffff] p-6 rounded-xl grid grid-cols-3 gap-10'>
                        <div className="w-full bg-gray-300 rounded-3xl px-10  py-7  flex flex-col items-center col-span-1">
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

                            <p className=" font-semibold text-lg mt-5 px-2 pt-2  border-t border-gray-700">
                                Air quality concerns: The dangers of inhaling wildfire smoke
                            </p>
                        </div>
                        <div className="w-full bg-gray-300 rounded-3xl px-10  py-7  flex flex-col items-center col-span-1">
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

                            <p className=" font-semibold text-lg mt-5 px-2 pt-2  border-t border-gray-700">
                                Air quality concerns: The dangers of inhaling wildfire smoke
                            </p>
                        </div>
                        <div className="w-full bg-gray-300 rounded-3xl px-10  py-7  flex flex-col items-center col-span-1">
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

                            <p className=" font-semibold text-lg mt-5 px-2 pt-2  border-t border-gray-700">
                                Air quality concerns: The dangers of inhaling wildfire smoke
                            </p>
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <HoverBanner padding='0px' />
                </div>
            </div>
        </>
    )
}

export default WeatherPage
