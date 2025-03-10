"use client";

import AdBanner from '@/components/partials/AdBanner';
import RealStateFilter from '@/components/partials/RealStateFilter'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import HoverBanner from '@/components/partials/HoverBanner';
import Link from 'next/link';



function PropertySlider() {
  const properties = [
    {
      price: "$1,400 PER MONTH",
      title: "The Ledbury",
      image: "/website/assets/images/real-state/01.png",
      size: "850 sq ft",
      rooms: "2 Rooms",
      bathrooms: "2 Bathrooms",
    },
    {
      price: "$1,600 PER MONTH",
      title: "Moon Point",
      image: "/website/assets/images/real-state/01.png",
      size: "620 sq ft",
      rooms: "2 Rooms",
      bathrooms: "2 Bathrooms",
    },
    {
      price: "$1,800 PER MONTH",
      title: "Azra Point",
      image: "/website/assets/images/real-state/01.png",
      size: "480 sq ft",
      rooms: "1 Room",
      bathrooms: "1 Bathroom",
    },
    {
      price: "$1,800 PER MONTH",
      title: "Azra Point",
      image: "/website/assets/images/real-state/01.png",
      size: "480 sq ft",
      rooms: "1 Room",
      bathrooms: "1 Bathroom",
    },
  ];

  return (
    <div className="relative w-full p-8 bg-gray-300 mt-8 rounded-2xl property-card-slider">
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        className="relative"
      >
        {properties.map((property, index) => (
          <SwiperSlide key={index} className="bg-white rounded-lg shadow-lg overflow-hidden p-2">
            <Link href={"/real-state/1"}>
              <Image src={property.image} alt={property.title} className="w-full h-40 object-cover rounded-2xl" width={1000} height={1000} />
            </Link>
            <div className="p-4">
              {/* <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">{property.price}</span> */}
              <Link href={"/real-state/1"}>
                <h3 className="text-2xl font-semibold text-center">{property.title}</h3>
              </Link>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{property.size}</span>
                <span className="flex items-center gap-1"><Icon icon="solar:copy-linear" width="20" height="20" />{property.rooms}</span>
                <span className='flex items-center gap-1'> <Icon icon="fa:bath" width="20" height="20" />{property.bathrooms}</span>

              </div>

              <span className='flex items-center gap-1 mt-3 text-sm'> <Icon icon="material-symbols:bed-rounded" width="24" height="24" />{property.bathrooms}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="swiper-button-prev absolute !-left-12 !top-1/2 !h-12 !w-12 transform -translate-y-1/2 border border-red-500 bg-gray-300 p-2 rounded-full">
        <Icon icon="ri:arrow-left-double-line" width="24" height="24" className='text-red-500' />
      </button>
      <button className="swiper-button-next absolute border !-right-12 !top-1/2 transform -translate-y-1/2  text-white p-2 rounded-full border-red-500 bg-gray-300 !h-12 !w-12">
        <Icon icon="ri:arrow-right-double-fill" width="24" height="24" className='text-red-500' />
        {/* <Icon icon="ic:round-chevron-right" width="24"  className='!block'/> */}
      </button>
    </div>
  );
}



function PropertyGrid() {
  const properties = [
    {
      price: "$2,800 PER MONTH",
      title: "Sunny, Modern room in East Village!",
      address: "148 Iffley Road",
      image: "/website/assets/images/news/01.png",
    },
    {
      price: "$2,800 PER MONTH",
      title: "Sunny, Modern room in East Village!",
      address: "148 Iffley Road",
      image: "/website/assets/images/news/02.png",
    },
    {
      price: "$1,400 PER MONTH",
      title: "Bright studio apartment for rent",
      address: "11 Thurloe Pl",
      image: "/website/assets/images/news/03.png",
    },
    {
      price: "$850 PER MONTH",
      title: "Charming 1-bedroom flat for rent",
      address: "East Roof Terrace",
      image: "/website/assets/images/news/04.png",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {properties.map((property, index) => (
        <Link href={'/real-state/1'}>

          <div
            key={index}
            className="relative rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-25 p-4 -top-4 text-white">
              <span className=" px-6 border flex items-center justify-center w-fit py-4 text-sm font-semibold rounded-md">
                {property.price}
              </span>
            </div>

            <div className='absolute bottom-2 left-2'>
              <h4 className='text-xl font-semibold text-white'>Bright Studio Apartment for rent</h4>
              <p className='text-sm text-white'> 148 Iffley Road</p>
            </div>
          </div>
        </Link>

      ))}
    </div>
  );
}

function RealState() {
  return (
    <div>
      <AdBanner />
      <div className='container mx-auto px-44 py-8'>
        <RealStateFilter />
        <h4 className='text-4xl font-bold text-center mt-6'>Real <span className='text-red-500'> Estate </span></h4>
        <PropertyGrid />
        <HoverBanner padding='0px' />
        <h4 className='text-4xl font-bold text-center mt-6'>Looking for properties to rent </h4>
        <PropertySlider />
        <PropertySlider />
        <PropertySlider />
        {/* <PropertySlider /> */}
        <HoverBanner padding='0px' />

      </div>
    </div>
  )
}

export default RealState
