import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import WeatherFilter from '@/components/partials/WeatherFilter'
import Image from 'next/image'
import React from 'react'


const WeatherHoutlyCard = () => {
    return (
        <div className='grid grid-cols-2 gap-10 mt-4 bg-white px-20 py-12 rounded-3xl border border-black'>
            <div className="col-span-1 flex  flex-col">
                <div className='flex items-center gap-4'>
                    <Image src={"/website/assets/images/weather/sky-1.png"} width={1000} height={1000} className='w-48 h-48' />
                    <div>
                        <h4 className='text-5xl font-semibold mb-2'>18°</h4>
                        <h6 className='text-gray-500 text-2xl'> Real Feel 19°</h6>
                    </div>
                </div>
                <div>
                    <h5 className='text-2xl font-semibold'>Hazy clouds</h5>
                    <h6 className='text-xl font-semibold'>More Details</h6>
                </div>
            </div>
            <div className="col-span-1">
                <h6 className='text-end text-xl mr-4 mb-2 font-bold'>02 PM</h6>
                <div className='bg-[#d1d1d1] px-10 py-5 rounded-2xl'>
                    <div className='flex items-center justify-between py-2  border-b border-black'>
                        <h5 className='text-2xl font-bold '>Wind</h5>
                        <h6 className='text-2xl font-bold'>0 Km/h</h6>
                    </div>
                    <div className='flex items-center justify-between py-2 border-b border-black'>
                        <h5 className='text-2xl font-bold'> Wind Gusts</h5>
                        <h6 className='text-2xl font-bold'>0 Km/h</h6>
                    </div>
                    <div className='flex items-center justify-between py-2 border-b border-black'>
                        <h5 className='text-2xl font-bold'> Air Quality</h5>
                        <h6 className='text-red-500 text-2xl font-bold' >Poor </h6>
                    </div>
                </div>
            </div>
        </div>
    )
}
function HourlyWeather() {
    return (
        <div>
            <AdBanner />
            <div className='px-32 py-8'>
                <WeatherFilter />

                <div className='flex items-center gap-3 mt-6 pb-1 mb-8 border-black relative font-semibold border-b w-fit'>
                    <span className='text-red-500'>Home</span> /  Today / Houly / Daily
                    <div className="absolute top-[28px] left-0 w-14 h-[3px] bg-red-500"></div>
                </div>

                <div className='mt-8 '>
                    <WeatherHoutlyCard />
                    <WeatherHoutlyCard />
                    <WeatherHoutlyCard />
                    <WeatherHoutlyCard />

                    <HoverBanner padding='0px' />

                    <WeatherHoutlyCard />
                    <WeatherHoutlyCard />
                    <WeatherHoutlyCard />
                    <WeatherHoutlyCard />

                    <HoverBanner padding='0px' />
                </div>
            </div>

        </div>
    )
}

export default HourlyWeather
