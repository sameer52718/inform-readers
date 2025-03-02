"use client";


import AdBanner from '@/components/partials/AdBanner'
import CategorySection from '@/components/partials/CategorySection'
import SearchInput from '@/components/ui/SearchInput'
import { homeCategory } from '@/constant/data'
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ProductCard from '@/components/card/ProductCard';
import HoverBanner from '@/components/partials/HoverBanner';
import { faker } from "@faker-js/faker";
import Link from 'next/link';



const SpecificationCard = ({ product }) => {

    return (
        <div className=" rounded-3xl p-4 h-60  bg-[#d4d4d4]" >
            <div className="flex items-center justify-center flex-col">
                <Link href={`specification/${product.productName}`}>
                    <Image src={product.productImage} width={300} height={300} alt={product.productAlt} className="w-20 h-32 mb-4" />
                </Link>
                <h4 className="text-[15px] leading-5 line-clamp-2 overflow-hidden">
                    <Link href={`specification/${product.productName}`}>
                        {product.productName}
                    </Link>
                </h4>

            </div>
            <div className="divider h-[1px] w-full bg-black"></div>
            <div className="py-2 px-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image
                        src={"/website/assets/images/icons/heart.png"}
                        width={1000}
                        height={1000}
                        alt="product"
                        className="w-5 h-auto"
                    />
                    <Image
                        src={"/website/assets/images/icons/share.png"}
                        width={1000}
                        height={1000}
                        alt="product"
                        className="w-5 h-auto"
                    />
                </div>
                <div>
                    <h6 className="text-[#ff0000]">${product.productPrice}</h6>
                </div>
            </div>
        </div>
    )
}


function Specification() {
    const [activeTab, setActiveTab] = useState("popularity");
    const swiperRef = useRef(null);
    const [products, setProducts] = useState([]);
    console.log(products);


    // Generate fake product data using Faker.js

    useEffect(() => {
        const generatedProducts = Array.from({ length: 50 }, () => ({
            productName: faker.commerce.productName(),
            productPrice: faker.commerce.price(100, 2000),
            productImage: faker.image.urlLoremFlickr({ category: "product", height: 300, width: 300 }),
            productAlt: `${faker.commerce.productName()} image`,
        }));

        setProducts(generatedProducts);
    }, []);
    console.log(products);

    return (
        <div className='bg-white'>
            <AdBanner />
            <CategorySection category={homeCategory} />

            <section className='px-32 py-8'>
                <div className="flex items-center border-black ">
                    <span className=" text-xl font-semibold text-red-500 mr-6">Latest Gadget</span>
                    <button
                        className={`mr-4  text-lg font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("showAll")}
                    >
                        Show All
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("popular")}
                    >
                        Popular
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("bestRated")}
                    >
                        Best Rated
                    </button>
                    {/* Search Box */}
                    <div className="ml-auto relative">
                        <SearchInput />
                    </div>
                </div>

                <div className="divider h-[2px]  w-full bg-black">
                    <div className="w-24 bg-[#ff0000] h-full"></div>
                </div>


                <div className="relative w-full mt-8   h-fit">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute left-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain rotate-180"
                        />
                    </button>
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={40}
                        slidesPerView={5}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        className="w-full min-h-40"
                    >
                        {products.map((item, index) => (
                            <SwiperSlide key={index}>
                                <SpecificationCard product={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute right-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain "
                        />
                    </button>
                </div>
            </section>

            <section className='px-32 py-8'>
                <div className="flex items-center border-black ">
                    <span className=" text-xl font-semibold text-red-500 mr-6">Latest Mobile</span>
                    <button
                        className={`mr-4  text-lg font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("showAll")}
                    >
                        Show All
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("popular")}
                    >
                        Popular
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("bestRated")}
                    >
                        Best Rated
                    </button>
                    {/* Search Box */}
                    <div className="ml-auto relative">
                        <SearchInput />
                    </div>
                </div>

                <div className="divider h-[2px]  w-full bg-black">
                    <div className="w-24 bg-[#ff0000] h-full"></div>
                </div>


                <div className="relative w-full mt-8   h-fit">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute left-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain rotate-180"
                        />
                    </button>
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={40}
                        slidesPerView={5}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        className="w-full min-h-40"
                    >
                        {products.map((item, index) => (
                            <SwiperSlide key={index}>
                                <SpecificationCard product={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute right-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain "
                        />
                    </button>
                </div>
            </section>

            <HoverBanner padding='100px' />
            <section className='px-32 py-8'>
                <div className="flex items-center border-black ">
                    <span className=" text-xl font-semibold text-red-500 mr-6">Latest Laptopm</span>
                    <button
                        className={`mr-4  text-lg font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("showAll")}
                    >
                        Show All
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("popular")}
                    >
                        Popular
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("bestRated")}
                    >
                        Best Rated
                    </button>
                    {/* Search Box */}
                    <div className="ml-auto relative">
                        <SearchInput />
                    </div>
                </div>

                <div className="divider h-[2px]  w-full bg-black">
                    <div className="w-24 bg-[#ff0000] h-full"></div>
                </div>


                <div className="relative w-full mt-8   h-fit">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute left-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain rotate-180"
                        />
                    </button>
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={40}
                        slidesPerView={5}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        className="w-full min-h-40"
                    >
                        {products.map((item, index) => (
                            <SwiperSlide key={index}>
                                <SpecificationCard product={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute right-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain "
                        />
                    </button>
                </div>
            </section>


            <section className='px-32 py-8'>
                <div className="flex items-center border-black ">
                    <span className=" text-xl font-semibold text-red-500 mr-6">Latest Smart Watches</span>
                    <button
                        className={`mr-4  text-lg font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("showAll")}
                    >
                        Show All
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("popular")}
                    >
                        Popular
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("bestRated")}
                    >
                        Best Rated
                    </button>
                    {/* Search Box */}
                    <div className="ml-auto relative">
                        <SearchInput />
                    </div>
                </div>

                <div className="divider h-[2px]  w-full bg-black">
                    <div className="w-24 bg-[#ff0000] h-full"></div>
                </div>


                <div className="relative w-full mt-8   h-fit">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute left-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain rotate-180"
                        />
                    </button>
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={40}
                        slidesPerView={5}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        className="w-full min-h-40"
                    >
                        {products.map((item, index) => (
                            <SwiperSlide key={index}>
                                <SpecificationCard product={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute right-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain "
                        />
                    </button>
                </div>
            </section>

            <HoverBanner padding='100px' />


            <section className='px-32 py-8'>
                <div className="flex items-center border-black ">
                    <span className=" text-xl font-semibold text-red-500 mr-6">Latest Tablet</span>
                    <button
                        className={`mr-4  text-lg font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("showAll")}
                    >
                        Show All
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("popular")}
                    >
                        Popular
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("bestRated")}
                    >
                        Best Rated
                    </button>
                    {/* Search Box */}
                    <div className="ml-auto relative">
                        <SearchInput />
                    </div>
                </div>

                <div className="divider h-[2px]  w-full bg-black">
                    <div className="w-24 bg-[#ff0000] h-full"></div>
                </div>


                <div className="relative w-full mt-8   h-fit">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute left-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain rotate-180"
                        />
                    </button>
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={40}
                        slidesPerView={5}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        className="w-full min-h-40"
                    >
                        {products.map((item, index) => (
                            <SwiperSlide key={index}>
                                <SpecificationCard product={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute right-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain "
                        />
                    </button>
                </div>
            </section>


            <section className='px-32 py-8'>
                <div className="flex items-center border-black ">
                    <span className=" text-xl font-semibold text-red-500 mr-6">Latest AC</span>
                    <button
                        className={`mr-4  text-lg font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("showAll")}
                    >
                        Show All
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("popular")}
                    >
                        Popular
                    </button>
                    <button
                        className={` mr-4 text-lg font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("bestRated")}
                    >
                        Best Rated
                    </button>
                    {/* Search Box */}
                    <div className="ml-auto relative">
                        <SearchInput />
                    </div>
                </div>

                <div className="divider h-[2px]  w-full bg-black">
                    <div className="w-24 bg-[#ff0000] h-full"></div>
                </div>


                <div className="relative w-full mt-8   h-fit">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute left-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain rotate-180"
                        />
                    </button>
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={40}
                        slidesPerView={5}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        className="w-full min-h-40"
                    >
                        {products.map((item, index) => (
                            <SwiperSlide key={index}>
                                <SpecificationCard product={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute right-[-55px] bg-[#d1d1d1] top-1/2 transform -translate-y-1/2 border border-[#ff0000] flex items-center justify-center text-white p-1 rounded-full object-contain z-10"
                    >
                        <Image
                            src={"/website/assets/images/icons/slider.png"}
                            alt="prev-icon"
                            width={1000}
                            height={1000}
                            className="h-7 w-7 object-contain "
                        />
                    </button>
                </div>
            </section>

            <HoverBanner padding='100px' />

        </div>
    )
}

export default Specification
