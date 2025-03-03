import AdBanner from '@/components/partials/AdBanner'
import PriceFilter from '@/components/partials/PriceFilter'
import WeatherFilter from '@/components/partials/WeatherFilter'
import Pagination from '@/components/ui/Pagination'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const AdCard = () => {
  return (
    <div className='bg-white rounded-2xl flex  p-8 gap-8 mb-5'>
      <div>
        <Image src={"/website/assets/images/ad/01.png"} width={1000} height={1000} className="h-36 w-[500px]" />
      </div>
      <div className='relative flex gap-4'>
        <div>
          <h4 className='text-4xl font-semibold mb-2'>HD Camera 5100</h4>
          <p className='text-base font-semibold leading-7'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
        </div>

        <div className='pl-10  flex flex-col justify-end items-center'>
          <p className='text-2xl font-semibold mb-1'>
            $100
          </p>
          <button className='bg-red-500 text-white px-8 py-2 rounded-xl text-lg font-semibold'>
            <Link href={"ads/12"}>
              Detail
            </Link>
          </button>
        </div>

        <div className="absolute top-0 right-2 bg-red-500 px-4 rounded-md py-1 text-sm text-white">
          Featured
        </div>
      </div>
    </div>
  )
}

function AdLisiing() {
  return (
    <div>
      <AdBanner />
      <div className='px-32 py-8'>
        <WeatherFilter />

        <div className='grid grid-cols-12 gap-8 mt-10'>
          <div className="col-span-3">
            <PriceFilter />
          </div>
          <div className="col-span-9 bg-gray-200 p-6 h-fit rounded-md">
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
