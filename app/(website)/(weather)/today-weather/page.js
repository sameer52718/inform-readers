import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import WeatherFilter from '@/components/partials/WeatherFilter'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const weatherData = [
    { name: "Today", image: "/website/assets/images/weather/sky-1.png", temp: "30", num: "1/12" },
    { name: "Mon", image: "/website/assets/images/weather/sky-2.png", temp: "25", num: "1/15" },
    { name: "Tue", image: "/website/assets/images/weather/sky-3.png", temp: "28", num: "1/11" },
    { name: "Wed", image: "/website/assets/images/weather/rainy-1.png", temp: "32", num: "1/19" },
    { name: "Thu", image: "/website/assets/images/weather/rainy-2.png", temp: "35", num: "1/17" },
    { name: "Fri", image: "/website/assets/images/weather/extreme-weather-1.png", temp: "27", num: "1/14" },
    { name: "Sat", image: "/website/assets/images/weather/extreme-weather-2.png", temp: "18", num: "1/18" },
    { name: "Sun", image: "/website/assets/images/weather/extreme-weather-1.png", temp: "50", num: "1/13" },
]

function TodayWeather() {
    return (
        <div className='container mx-auto'>
            <AdBanner />

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




                <div className='border-black border rounded-lg py-6 px-6 sm:px-10 lg:px-16 bg-white mt-4'>
                    {/* Daytime Weather */}
                    <div className='border-b border-black pb-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left'>
                        <Image src={"/website/assets/images/weather/02.png"} width={1000} height={1000} className='w-16 sm:w-20 h-16 sm:h-20' />
                        <h5 className='text-xl sm:text-2xl font-semibold'>
                            Hazy sun <span className="block sm:inline">Hi 24°</span>
                        </h5>
                    </div>

                    {/* Nighttime Weather */}
                    <div className='flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left mt-4'>
                        <Image src={"/website/assets/images/weather/03.png"} width={1000} height={1000} className='w-16 sm:w-20 h-16 sm:h-20' />
                        <h5 className='text-xl sm:text-2xl font-semibold'>
                            Tonight: Mostly cloudy <span className="block sm:inline">Lo: 9°</span>
                        </h5>
                    </div>
                </div>


                <div className='mt-8'>
                    <h4 className='text-2xl sm:text-3xl font-semibold text-center sm:text-left'>Current Weather</h4>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mt-4 bg-white px-6 sm:px-12 lg:px-20 py-8 sm:py-12 rounded-3xl border border-black'>
                        {/* Weather Info */}
                        <div className="flex flex-col items-center sm:items-start">
                            <div className='flex items-center gap-4'>
                                <Image src={"/website/assets/images/weather/sky-1.png"} width={1000} height={1000} className='w-32 sm:w-48 h-32 sm:h-48' />
                                <div>
                                    <h4 className='text-4xl sm:text-5xl font-semibold mb-2'>18°</h4>
                                    <h6 className='text-gray-500 text-lg sm:text-2xl'>Real Feel 19°</h6>
                                </div>
                            </div>
                            <div className='text-center sm:text-left mt-4'>
                                <h5 className='text-lg sm:text-2xl font-semibold'>Hazy clouds</h5>
                                <h6 className='text-base sm:text-xl font-semibold text-blue-600 cursor-pointer'>More Details</h6>
                            </div>
                        </div>

                        {/* Weather Stats */}
                        <div>
                            <div className='bg-[#d1d1d1] px-6 sm:px-10 py-5 rounded-2xl'>
                                <div className='flex items-center justify-between py-2 border-b border-black'>
                                    <h5 className='text-lg sm:text-2xl font-bold'>Wind</h5>
                                    <h6 className='text-lg sm:text-2xl font-bold'>0 Km/h</h6>
                                </div>
                                <div className='flex items-center justify-between py-2 border-b border-black'>
                                    <h5 className='text-lg sm:text-2xl font-bold'>Wind Gusts</h5>
                                    <h6 className='text-lg sm:text-2xl font-bold'>0 Km/h</h6>
                                </div>
                                <div className='flex items-center justify-between py-2 border-b border-black'>
                                    <h5 className='text-lg sm:text-2xl font-bold'>Air Quality</h5>
                                    <h6 className='text-red-500 text-lg sm:text-2xl font-bold'>Poor</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-8'>
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


                    <div className='border border-gray-600 rounded-lg mt-4 w-full h-[300px] sm:h-[450px] lg:h-[600px]'>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.05049102596!2d-74.30915197703663!3d40.697193370199564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2snl!4v1740882334095!5m2!1sen!2snl"
                            className='w-full h-full'
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                </div>

                <div className='my-8 bg-[#d4d4d4] flex flex-wrap justify-between lg:justify-center items-center p-4 rounded-3xl gap-4'>
                    <div className='flex items-center py-4 px-4'>
                        <Image
                            src={"/website/assets/images/weather/01.png"}
                            width={1000}
                            height={1000}
                            alt='weather-image'
                            className='h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-full'
                        />
                        <h5 className='text-2xl sm:text-3xl lg:text-4xl font-bold ml-2 text-white'>Clouds</h5>
                    </div>
                    <div className='flex items-center py-4 px-4'>
                        <Image
                            src={"/website/assets/images/weather/01.png"}
                            width={1000}
                            height={1000}
                            alt='weather-image'
                            className='h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-full'
                        />
                        <h5 className='text-2xl sm:text-3xl lg:text-4xl font-bold ml-2 text-white'>Temperature</h5>
                    </div>
                </div>


                <HoverBanner padding='0px' />

                <div className='mt-8'>
                    <h4 className='text-2xl sm:text-3xl font-bold'>10-Day Weather Forecast</h4>
                    <div className='border border-black grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 mt-8 bg-white p-4 sm:p-6 lg:p-12 rounded-3xl gap-4 sm:gap-6 lg:gap-10'>
                        {weatherData.map((item, index) => (
                            <div key={index} className='bg-[#d4d4d4] col-span-1 sm:col-span-1 lg:col-span-6 flex items-center justify-between p-4 sm:p-6 rounded-xl'>
                                <div>
                                    <div className='text-xl sm:text-2xl uppercase font-semibold'>{item.name}</div>
                                    <p className='mt-1 text-gray-700 text-sm sm:text-base'>{item.num}</p>
                                </div>
                                <div className='flex items-center gap-4 sm:gap-6 lg:gap-8'>
                                    <Image src={item.image} width={1000} height={1000} className='h-16 w-16 sm:h-20 sm:w-20' />
                                    <div className='text-xl sm:text-2xl relative p-1'>
                                        {item.temp}
                                        <div className='absolute top-1 -right-1 h-2 w-2 text-sm rounded-full bg-[#d4d4d4] border border-black'></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                <div className='my-8'>
                    <h4 className='text-2xl sm:text-3xl font-semibold'>Current Weather</h4>

                    {/* First Section */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 mt-4 bg-gray-300 p-4 sm:p-8 lg:p-12 rounded-3xl border border-black'>
                        <div className="col-span-1 flex flex-col">
                            <div className='flex items-center gap-4'>
                                <Image src={"/website/assets/images/weather/04.png"} width={1000} height={1000} className='w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48' />
                                <div>
                                    <h6 className='text-lg sm:text-xl lg:text-2xl text-black font-bold'>10 hrs 23 mins</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 flex flex-col items-center sm:items-end justify-center">
                            <div>
                                <h5 className='font-bold text-lg sm:text-xl lg:text-2xl'>7:09 AM</h5>
                                <h6 className='font-bold text-lg sm:text-xl lg:text-2xl'> <span className='text-[#ff0000]'>Set</span> 5:32 PM</h6>
                            </div>
                        </div>
                    </div>

                    {/* Second Section */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 mt-4 bg-gray-300 p-4 sm:p-8 lg:p-12 rounded-3xl border border-black'>
                        <div className="col-span-1 flex flex-col">
                            <div className='flex items-center gap-4'>
                                <Image src={"/website/assets/images/weather/05.png"} width={1000} height={1000} className='w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48' />
                                <div>
                                    <h6 className='text-lg sm:text-xl lg:text-2xl text-black font-bold'>Waxing Gibbous</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 flex flex-col items-center sm:items-end justify-center">
                            <div>
                                <h5 className='font-bold text-lg sm:text-xl lg:text-2xl'>7:09 AM</h5>
                                <h6 className='font-bold text-lg sm:text-xl lg:text-2xl'> <span className='text-[#ff0000]'>Set</span> 5:32 PM</h6>
                            </div>
                        </div>
                    </div>
                </div>


                <HoverBanner />
            </div>


        </div>
    )
}

export default TodayWeather
