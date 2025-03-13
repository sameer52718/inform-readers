"use client"

import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import React, { useState } from 'react'


const ReviewSection = () => {
    const totalReviews = 1;
    const ratings = [1, 0, 0, 0, 0];

    return (
        <div className="px-6 py-10 bg-white shadow-md rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left Section - Overall Rating */}
                <div className="md:col-span-2 border-r-0 md:border-r-4 border-gray-200 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-end space-x-2">
                        <span className="text-5xl md:text-6xl font-bold text-red-600">5.0</span>
                        <span className="text-gray-500 text-lg">out of 5</span>
                    </div>
                    <div className="flex items-center my-2">
                        {[...Array(5)].map((_, i) => (
                            <Icon key={i} icon="material-symbols-light:star-rounded" width="24" height="24" className="text-red-600 fill-red-600" />
                        ))}
                    </div>
                </div>

                {/* Right Section - Rating Bars */}
                <div className="md:col-span-10 pl-0 md:pl-4">
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={5 - i} className="flex items-center space-x-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, j) => (
                                        <Icon key={j} icon="material-symbols-light:star-rounded" width="20" height="20" className={j < 5 - i ? "text-red-600 fill-red-600" : "text-gray-300"} />
                                    ))}
                                </div>
                                <div className="w-full bg-gray-300 h-3 md:h-4 rounded-full">
                                    {ratings[i] > 0 && (
                                        <div className="bg-red-600 h-3 md:h-4 rounded-full" style={{ width: `${(ratings[i] / totalReviews) * 100}%` }}></div>
                                    )}
                                </div>
                                <span className="text-gray-500 text-sm md:text-base">{ratings[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Centered Button */}
            <div className="flex items-center justify-center mt-6">
                <button className="px-6 md:px-10 py-2 md:py-3 rounded-3xl bg-red-600 text-white hover:bg-red-700 text-sm md:text-base">
                    Write a Review
                </button>
            </div>
        </div>

    );
}

const ReviewTabSection = () => {
    const [selectedReviewTab, setSelectedReviewTab] = useState("all");
    const totalReviews = 1;
    const ratings = [1, 0, 0, 0, 0];

    return (
        <div className="p-6 rounded-lg bg-white shadow-md mb-4">
            {/* Tab Menu */}
            <div className="flex flex-wrap border-b border-black mb-4 pb-2 gap-2">
                {["Show all", "Most Helpful", "Highest Rating", "Lowest Rating"].map((tab, index) => (
                    <button
                        key={index}
                        className={`px-3 py-2 font-bold text-base md:text-lg transition-all duration-200 
                ${selectedReviewTab === tab ? "text-red-600 font-bold bg-gray-300 rounded-2xl" : "text-gray-500"}
              `}
                        onClick={() => setSelectedReviewTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Review Section */}
            <div className="mb-4">
                <div className="flex items-center space-x-3">
                    <Image
                        width={1000}
                        height={1000}
                        src="/user-avatar.png"
                        alt="User Avatar"
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                    />
                    <div>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Icon key={i} icon="material-symbols-light:star-rounded" width="20" height="20" className="text-red-600 fill-red-600" />
                            ))}
                        </div>
                        <p className="text-xs md:text-sm text-gray-500">supervendor - June 17, 2019</p>
                    </div>
                </div>
                <p className="mt-2 text-gray-700 text-sm md:text-base">I think this is the best product ever</p>
            </div>

            {/* Add Review Section */}
            <div className="border-t pt-4 mb-4">
                <p className="font-bold text-base md:text-lg">Add a review</p>
                <p className="text-sm text-gray-500">
                    You must be <span className="text-red-600 cursor-pointer">logged in to post</span> a review.
                </p>
            </div>
        </div>

    );
}

function RelatedArticles() {

    const articles = [
        {
            id: 1,
            title: "Shop The Best Street Style From Paris Fashion Week Shows",
            author: "Armin Vans",
            date: "August 7, 2019",
            category: "Fashion",
            image: "/images/article1.jpg",
        },
        {
            id: 2,
            title: "Shop The Best Street Style From Paris Fashion Week Shows",
            author: "Armin Vans",
            date: "August 7, 2019",
            category: "Fashion",
            image: "/images/article2.jpg",
        },
    ];
    return (
        <>
            <h2 className="px-2 mt-10 text-xl sm:text-2xl font-bold mb-4">RELATED ARTICLES</h2>

            <div className="py-6 rounded-xl bg-white px-6 sm:px-10">
                {articles.map((article) => (
                    <div
                        key={article.id}
                        className="flex flex-col sm:flex-row border-b border-black overflow-hidden mb-6 gap-4"
                    >
                        {/* Image */}
                        <div className="w-full sm:w-28 flex-shrink-0">
                            <Image
                                width={1000}
                                height={1000}
                                src="/website/assets/images/news/01.png"
                                alt={article.title}
                                className="w-full sm:w-28 h-32 sm:h-24 object-cover rounded-lg"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-3 flex-1">
                            {/* Category */}
                            <span className="text-white text-xs bg-red-500 px-2 py-1 rounded-lg">
                                {article.category}
                            </span>

                            {/* Title */}
                            <h3 className="text-red-500 font-semibold text-sm mt-2 hover:underline cursor-pointer">
                                {article.title}
                            </h3>

                            {/* Author & Date */}
                            <p className="text-xs text-gray-600 mt-1">
                                <span className="font-bold">{article.author}</span> - {article.date}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}



function NewsDetail() {
    return (
        <>

            <AdBanner />
            <div className='container mx-auto md:px-56 px-4 py-8'>
                <h4 className='md:text-3xl text-2xl font-bold mb-6'><span className='text-red-500'> News Magazine </span> Charts the Most Chic and Fashionable Women of New York City</h4>

                <Image src="/website/assets/images/news/01.png" width={1000} height={1000} alt='feature-img' className='!w-full h-auto mb-10' />

                <p className='md:text-xl font-semibold mb-5'>
                    We woke reasonably late following the feast and free flowing wine the night before. After gathering ourselves and our packs, we headed down to our homestay family’s small dining room for breakfast.
                </p>
                <p className='md:text-xl font-semibold mb-5'>
                    Refreshingly, what was expected of her was the same thing that was expected of Lara Stone: to take a beautiful picture.
                </p>
                <p className='md:text-xl font-semibold mb-5'>
                    We were making our way to the Rila Mountains, where we were visiting the Rila Monastery where we enjoyed scrambled eggs, toast, mekitsi, local jam and peppermint tea.
                </p>

                <div className="py-8">
                    <HoverBanner />
                </div>

                <Image src="/website/assets/images/news/01.png" width={1000} height={1000} alt='feature-img' className='!w-full h-auto mb-8' />

                <p className='md:text-xl  font-semibold mb-5'>
                    We woke reasonably late following the feast and free flowing wine the night before. After gathering ourselves and our packs, we headed down to our homestay family’s small dining room for breakfast.
                </p>
                <p className='md:text-xl  font-semibold mb-5'>
                    Refreshingly, what was expected of her was the same thing that was expected of Lara Stone: to take a beautiful picture.
                </p>
                <p className='md:text-xl  font-semibold mb-5'>
                    We were making our way to the Rila Mountains, where we were visiting the Rila Monastery where we enjoyed scrambled eggs, toast, mekitsi, local jam and peppermint tea.
                </p>

                <div className="py-8">
                    <HoverBanner />
                </div>

                <p className='text-xl font-semibold mb-5'>
                    We were making our way to the Rila Mountains, where we were visiting the Rila Monastery where we enjoyed scrambled eggs, toast, mekitsi, local jam and peppermint tea.
                </p>

                <div className='grid md:grid-cols-3 grid-cols-1 gap-10'>
                    <div className="md:col-span-2">
                        <p className='text-xl font-semibold mb-5'>
                            I had low expectations about Sofia as a city, but after the walking tour I absolutely loved the place. This was an easy city to navigate, and it was a beautiful city – despite its ugly, staunch and stolid communist-built surrounds. Sofia has a very average facade as you enter the city, but once you lose yourself in the old town area, everything changes.
                        </p>
                        <p className='text-xl font-semibold mb-5'>
                            We were exhausted after a long day of travel, so we headed back to the hotel and crashed.
                        </p>
                    </div>
                    <div className="col-span-1">
                        <Image src="/website/assets/images/news/01.png" width={6000} height={6000} className='w-full h-[450px] object-cover' alt='feature-img' />
                    </div>
                </div>


                <div className='px-2'>
                    <h4 className='text-3xl text-center text-red-500 py-10 font-bold md:px-56 mx-auto'>
                        IF YOU HAVE IT, YOU CAN MAKE ANYTHING LOOK GOOD
                    </h4>

                    <p className='text-lg font-semibold'>
                        Clothes can transform your mood and confidence. Fashion moves so quickly that, unless you have a strong point of view, you can lose integrity. I like to be real. I don’t like things to be staged or fussy. I think I’d go mad if I didn’t have a place to escape to. You have to stay true to your heritage, that’s what your brand is about.
                    </p>

                    <div className="flex items-center space-x-4 px-5 py-2 bg-gray-200 rounded-full w-fit mt-6 mb-5 border border-black">
                        {/* Share Icon */}
                        <div className="p-2 bg-white rounded-full shadow-sm cursor-pointer">
                            <Icon icon="material-symbols:share" width="24" height="24" />
                        </div>

                        {/* Social Icons */}
                        <div className="flex space-x-2 ">
                            <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:bg-green-100">
                                <Icon icon="logos:whatsapp-icon" className="text-green-500 text-xl" />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:bg-pink-100">
                                <Icon icon="skill-icons:instagram" className="text-pink-500 text-xl" />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:bg-blue-100">
                                <Icon icon="logos:facebook" className="text-blue-600 text-xl" />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:bg-blue-200">
                                <Icon icon="logos:linkedin-icon" className="text-blue-700 text-xl" />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-300">
                                <Icon icon="mdi:twitter" className="text-black text-xl" />
                            </a>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="py-8">
                        <HoverBanner />
                    </div>
                    <ReviewSection />
                    <ReviewTabSection />

                    <div className="border rounded-xl px-6 py-6 flex flex-col sm:flex-row justify-between gap-6 sm:gap-8 bg-white shadow-md">
                        {/* Previous Article */}
                        <div className="flex flex-col items-center w-full sm:w-1/2">
                            <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold w-full text-sm sm:text-base">
                                Previous article
                            </button>
                            <div className="bg-gray-300 text-center mt-2 p-3 rounded-xl w-full border border-black">
                                <p className="text-sm sm:text-lg font-semibold">
                                    Now Is the Time to Think About Your Small-Business Success
                                </p>
                            </div>
                        </div>

                        {/* Next Article */}
                        <div className="flex flex-col items-center w-full sm:w-1/2">
                            <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold w-full text-sm sm:text-base">
                                Next article
                            </button>
                            <div className="bg-gray-300 text-center mt-2 p-3 sm:p-4 rounded-xl w-full border border-black">
                                <p className="text-sm sm:text-lg font-semibold">
                                    <span className="font-bold">Expert Advice:</span> The Best Retro Chic Fashion for All Ages
                                </p>
                            </div>
                        </div>
                    </div>


                    <RelatedArticles />
                    <div className="py-8">
                        <HoverBanner />
                    </div>
                </div>


            </div>

        </>
    )
}

export default NewsDetail
