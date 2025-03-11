import AdBanner from '@/components/partials/AdBanner'
import PriceFilter from '@/components/partials/PriceFilter'
import WeatherFilter from '@/components/partials/WeatherFilter'
import Pagination from '@/components/ui/Pagination'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const AdCard = () => {
  return (
    <div className="bg-white rounded-2xl flex flex-col sm:flex-row p-6 sm:p-8 gap-6 sm:gap-8 mb-5">
    {/* Image Section */}
    <div className="flex justify-center sm:justify-start">
        <Image 
            src={"/website/assets/images/ad/01.png"} 
            width={1000} 
            height={1000} 
            className="h-36 w-full sm:w-[500px] object-cover"
            alt="Ad Image"
        />
    </div>

    {/* Content Section */}
    <div className="relative flex flex-col sm:flex-row gap-4 w-full">
        <div className="flex-1">
            <h4 className="text-2xl sm:text-4xl font-semibold mb-2">
                HD Camera 5100
            </h4>
            <p className="text-sm sm:text-base font-semibold leading-6 sm:leading-7">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>
        </div>

        {/* Price & Button Section */}
        <div className="sm:pl-10 flex flex-col justify-end items-center sm:items-start">
            <p className="text-xl sm:text-2xl font-semibold mb-1">
                $100
            </p>
            <Link href={"ads/12"}>
                <button className="bg-red-500 text-white px-6 sm:px-8 py-2 rounded-xl text-base sm:text-lg font-semibold">
                    Detail
                </button>
            </Link>
        </div>

        {/* Featured Tag */}
        <div className="absolute top-2 right-2 bg-red-500 px-3 sm:px-4 rounded-md py-1 text-xs sm:text-sm text-white">
            Featured
        </div>
    </div>
</div>

  )
}

function AdLisiing() {
  return (
    <div className='mx-auto container'>
      <AdBanner />
      <div className='md:px-44 py-8'>
        <WeatherFilter />

        <div className='grid grid-cols-12 gap-8 mt-10'>
          <div className="md:col-span-3 col-span-12">
            <PriceFilter />
          </div>
          <div className="md:col-span-9 col-span-12 bg-gray-200 p-6 h-fit rounded-md">
            {[1, 2, 3, 4, 5,].map((item, index) => (
              <AdCard key={index} />
            ))}
          </div>
        </div>
        <div className='flex justify-center'>
          <Pagination currentPage={1} totalPages={10} />

        </div>


      </div>
    </div>
  )
}

export default AdLisiing
