"use client"

import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner';
import Pagination from '@/components/ui/Pagination';
import { Icon } from '@iconify/react'
import Image from 'next/image';
import React, { useState } from 'react'




const ReviewSection = () => {
    const totalReviews = 1;
    const ratings = [1, 0, 0, 0, 0];

    return (
        <div className="px-6 py-10 bg-white  rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Rating Section */}
                <div className="col-span-1 md:col-span-2   pb-4 md:pb-0">
                    <div className="flex items-end space-x-2">
                        <span className="text-4xl md:text-6xl font-bold text-red-600">5.0</span>
                        <span className="text-gray-500 text-lg">out of 5</span>
                    </div>
                    <div className="flex items-center my-2">
                        {[...Array(5)].map((_, i) => (
                            <Icon key={i} icon="material-symbols-light:star-rounded" width="24" height="24" className="text-red-600 fill-red-600" />
                        ))}
                    </div>
                </div>

                {/* Review Ratings Section */}
                <div className="col-span-1 md:col-span-10 pl-0 md:pl-4">
                    <div className="space-y-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={5 - i} className="flex items-center space-x-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, j) => (
                                        <Icon
                                            key={j}
                                            icon="material-symbols-light:star-rounded"
                                            width="24"
                                            height="24"
                                            className={j < 5 - i ? "text-red-600 fill-red-600" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                                <div className="w-full bg-gray-300 h-4 rounded-full">
                                    {ratings[i] > 0 && (
                                        <div
                                            className="bg-red-600 h-4 rounded-full"
                                            style={{ width: `${(ratings[i] / totalReviews) * 100}%` }}
                                        ></div>
                                    )}
                                </div>
                                <span className="text-gray-500">{ratings[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Write Review Button */}
            <div className="flex items-center justify-center mt-4">
                <button className="w-fit px-10 py-3 rounded-3xl bg-red-600 text-white hover:bg-red-700">Write a Review</button>
            </div>
        </div>

    );
}

const ReviewTabSection = () => {
    const [selectedReviewTab, setSelectedReviewTab] = useState("all");
    const totalReviews = 1;
    const ratings = [1, 0, 0, 0, 0];

    return (
        <div className="p-6 rounded-lg">
            {/* Tab Menu */}
            <div className="flex flex-wrap border-b border-black mb-4 space-x-4 pb-2">
                {["Show all", "Most Helpful", "Highest Rating", "Lowest Rating"].map((tab, index) => (
                    <button
                        key={index}
                        className={`
                        px-3 py-2 font-bold text-lg
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
                <div className="flex items-center space-x-2">
                    <Image
                        width={1000}
                        height={1000}
                        src="/user-avatar.png"
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <Icon key={i} icon="material-symbols-light:star-rounded" width="24" height="24" className="text-red-600 fill-red-600" />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">supervendor - June 17, 2019</p>
                    </div>
                </div>
                <p className="mt-2 text-gray-700">I think this is the best product ever</p>
            </div>

            {/* Add Review Section */}
            <div className="border-t pt-4">
                <p className="font-bold">Add a review</p>
                <p className="text-sm text-gray-500">
                    You must be <span className="text-red-600 cursor-pointer">logged in to post</span> a review.
                </p>
            </div>
        </div>

    );
}


const ImageGrid = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-100">
            <div className="sm:col-span-2">
                <Image
                    src="/website/assets/images/hotel/02.png"
                    alt="Bar Lounge"
                    width={600}
                    height={400}
                    className="rounded-lg w-full h-[300px] sm:h-[600px] object-cover"
                />
            </div>
            <div>
                <Image
                    src="/website/assets/images/hotel/02.png"
                    alt="Hotel Room"
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-[300px] object-cover"
                />
            </div>
            <div>
                <Image
                    src="/website/assets/images/hotel/02.png"
                    alt="Suite Living Room"
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-[300px] object-cover"
                />
            </div>
        </div>

    );
};

function HotelDetail() {
    return (
        <div>
            <AdBanner />
            <div className='container mx-auto md:px-44 py-8'>
                <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg w-full">
                    <div className="mb-4 sm:mb-0 sm:w-2/3">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-1">Sheraton Grand Hotel, Dubai</h2>
                        <p className="text-sm text-gray-600 mb-2">3 Sheikh Zayed Road, Dubai</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">8.6</span>
                            <span className="text-sm text-gray-700">Very good</span>
                            <span className="text-sm text-gray-500">2809 reviews</span>
                        </div>
                    </div>

                    <div className="sm:w-1/3 flex flex-col items-center sm:items-start">
                        <span className="text-xl sm:text-2xl mb-2 font-bold ">$164</span>
                        <div className="flex items-center gap-4">
                            <button className="text-gray-500 hover:text-red-500">
                                <Icon icon="mdi:heart-outline" width={22} />
                            </button>
                            <button className="text-gray-500 hover:text-blue-500">
                                <Icon icon="mdi:share-variant" width={22} />
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600">
                                View Deal
                            </button>
                        </div>
                    </div>
                </div>


                <ImageGrid />

                <div className="p-4">
                    {/* Rating Section */}
                    <div>
                        <h2 className="text-3xl mb-2 font-bold">Rating</h2>
                        <div className="flex items-center space-x-2">
                            <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">8.6</span>
                            <span className="font-semibold">Very good</span>
                        </div>
                        <p className="text-gray-600 text-sm">Based on 2809 verified guest reviews</p>
                        <button className="mt-2 bg-red-600 text-white px-3 py-1 text-sm rounded-md">
                            Read More
                        </button>
                    </div>

                    {/* Available Rates Section */}
                    <div className="mt-6">
                        <h2 className="text-lg font-bold">Available Rates</h2>
                        <div className="flex flex-wrap items-center space-x-2 mt-2">
                            <button className="flex items-center space-x-1 bg-gray-200 px-3 py-2 rounded-md mb-2 sm:mb-0">
                                <Icon icon="ic:baseline-calendar-today" className="text-lg" />
                                <span>Fri 2/7</span>
                            </button>
                            <button className="flex items-center space-x-1 bg-gray-200 px-3 py-2 rounded-md mb-2 sm:mb-0">
                                <Icon icon="ic:baseline-calendar-today" className="text-lg" />
                                <span>Fri 2/14</span>
                            </button>
                            <button className="flex items-center space-x-1 bg-gray-200 px-3 py-2 rounded-md mb-2 sm:mb-0">
                                <Icon icon="ic:baseline-person" className="text-lg" />
                                <span>2</span>
                            </button>
                            <button className="bg-red-600 text-white p-2 rounded-md">
                                <Icon icon="ic:baseline-search" className="text-lg" />
                            </button>
                        </div>
                    </div>

                    {/* Show Deals Section */}
                    <div className="mt-4 flex flex-wrap items-center space-x-4 text-sm text-gray-600">
                        <span>Show deals with</span>
                        <label className="flex items-center space-x-1">
                            <input type="checkbox" className="w-4 h-4" />
                            <span>Free breakfast</span>
                        </label>
                        <label className="flex items-center space-x-1">
                            <input type="checkbox" className="w-4 h-4" />
                            <span>Free cancellation</span>
                        </label>
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, index) => (
                        <div key={index} className="bg-gray-200 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold">Cheapest</h3>
                                    <p className="text-gray-600 text-sm">Deluxe room</p>
                                </div>
                                <p className="text-lg font-bold">$164</p>
                            </div>

                            <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                                <Icon icon="mdi:bed-outline" className="text-lg" />
                                <span>1 king bed</span>
                            </div>

                            <p className="text-red-600 text-sm mt-1">Free Cancellation</p>

                            <div className="flex justify-between  items-center mt-4">
                                <div className="flex items-center space-x-1">
                                    <Icon icon="logos:expedia" className="text-2xl" />
                                    <span className="text-gray-700 font-medium">Expedia</span>
                                </div>
                                <button className="bg-red-600 text-white px-4 py-2 text-sm rounded-lg">
                                    View Deal
                                </button>
                            </div>
                        </div>
                    ))}
                </div>


                {[...Array(2)].map((_, index) => (
                    <div key={index} className="bg-gray-200 p-4 rounded-lg mt-5">
                        {/* Room Header */}
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold">Deluxe Guest Room</h3>
                        </div>

                        {/* Room Details */}
                        <div className="flex flex-wrap justify-between text-gray-600 text-sm space-x-2 mb-3">
                            <span>Details</span>
                            <span>431 sq ft</span>
                            <span>Air-conditioned</span>
                            <span>TV</span>
                            <span>Tea/Coffee maker</span>
                            <span>Soundproofing</span>
                            <button className="text-red-500 font-medium">More</button>
                        </div>

                        {/* Room Image & Deals */}
                        <div className="flex flex-col lg:flex-row mt-3 space-y-4 lg:space-y-0 lg:space-x-4">
                            {/* Room Image */}
                            <Image
                                src="/website/assets/images/hotel/02.png" // Replace with actual image URL
                                alt="Deluxe Room"
                                className="w-full lg:w-60 h-60 object-cover rounded-lg"
                                width={1000}
                                height={1000}
                            />

                            {/* Deals List */}
                            <div className="w-full space-y-3">
                                {/* Expedia Deal */}
                                <div className="flex justify-between items-center border-b border-black pb-1">
                                    <span className="text-gray-600 text-sm">Free Cancellation</span>
                                    <div className="flex items-center space-x-2">
                                        <Icon icon="logos:expedia" className="text-2xl" />
                                        <span className="text-black font-bold">$164</span>
                                        <button className="bg-red-600 text-white px-3 py-1 text-sm rounded-lg">
                                            View Deal
                                        </button>
                                    </div>
                                </div>

                                {/* Hotels Deal */}
                                <div className="flex justify-between items-center border-b pb-1">
                                    <span className="text-gray-600 text-sm">Free Cancellation</span>
                                    <div className="flex items-center space-x-2">
                                        <Icon icon="simple-icons:hotelsdotcom" className="text-2xl" />
                                        <span className="text-black font-bold">$164</span>
                                        <button className="bg-red-600 text-white px-3 py-1 text-sm rounded-lg">
                                            View Deal
                                        </button>
                                    </div>
                                </div>

                                {/* Sheraton Deal */}
                                <div className="flex flex-col border-b pb-1">
                                    <span className="text-red-600 text-sm font-medium">
                                        Member Rate Available
                                    </span>
                                    <span className="text-gray-600 text-sm">
                                        Marriott Bonvoy Rate Available Free Sign-up
                                    </span>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-red-600 text-sm">Free Cancellation</span>
                                        <div className="flex items-center space-x-2">
                                            <Icon icon="simple-icons:sheraton" className="text-2xl" />
                                            <span className="text-black font-bold">$165</span>
                                            <button className="bg-red-600 text-white px-3 py-1 text-sm rounded-lg">
                                                View Deal
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Show More Deals */}
                                <button className="text-red-600 text-sm font-medium mt-2">
                                    Show 2 more deals
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

            <div className='container mx-auto md:px-44 py-8'>
                <h4 className='mt-5 font-bold text-3xl mb-3 pl-4 pr-2'>The neighborhood - Trade Centre</h4>
                <div className='w-full relative' style={{ paddingBottom: '56.25%' }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.05049102596!2d-74.30915197703663!3d40.697193370199564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1741550809193!5m2!1sen!2s"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className='absolute top-0 left-0 w-full h-full'
                    ></iframe>
                </div>
                <div className="p-6  text-black mt-10">
                    {/* Location and Nearby Places */}
                    <div className="mb-6">
                        <h2 className="text-red-600 font-bold text-lg">3 Sheikh Zayed Road, Dubai</h2>
                        <div className="grid grid-cols-2 text-sm mt-2 gap-4">
                            <ul className="list-disc list-inside">
                                <li>The Monarch Office Tower 0.06 mi</li>
                                <li>World Trade Centre Residence 0.23 mi</li>
                                <li>Dubai World Trade Center 0.29 mi</li>
                                <li>Dubai International Convention and Exhibition Centre 0.4 mi</li>
                                <li>Acico Twin Towers 0.49 mi</li>
                                <li>Trade Centre 10.5 mi</li>
                            </ul>
                            <ul className="list-disc list-inside">
                                <li>Sama Tower 0.09 mi</li>
                                <li>World Trade Centre Metro Station 0.29 mi</li>
                                <li>Elizkaat Tower 2.03 mi</li>
                                <li>Park Place 0.41 mi</li>
                                <li>Dubai Garden Glow 0.49 mi</li>
                                <li>Zabeel Park 0.64 mi</li>
                            </ul>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-gray-100 p-4 rounded-md">
                        <h3 className="text-2xl font-bold mb-3">Reviews</h3>
                        <div className="flex items-center">
                            <span className="text-3xl font-bold text-black">8.6</span>
                            <div className="ml-3">
                                <p className="text-lg font-semibold">Very good</p>
                                <p className="text-red-500 text-sm">2809 verified ratings</p>
                            </div>
                        </div>

                        {/* Rating Breakdown */}
                        <div className="mt-4">
                            {[
                                { label: "Wonderful", value: 1608 },
                                { label: "Very good", value: 430 },
                                { label: "Good", value: 310 },
                                { label: "Okay", value: 134 },
                                { label: "Fair", value: 81 },
                                { label: "Mediocre", value: 116 },
                                { label: "Poor", value: 131 },
                            ].map((rating, index) => (
                                <div key={index} className="flex items-center justify-between text-sm mb-1">
                                    <span className="w-20">{rating.label}</span>
                                    <div className="bg-gray-300 w-40 h-2 rounded-full overflow-hidden">
                                        <div className="bg-red-600 h-full" style={{ width: `${(rating.value / 1608) * 100}%` }}></div>
                                    </div>
                                    <span>{rating.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Guest Review Summary */}
                    <div className="bg-gray-200 p-4 rounded-md mt-4">
                        <h3 className="text-red-600 font-bold text-lg">Guests say</h3>
                        <p className="text-sm mt-2">
                            Guests had mixed experiences at the hotel. While many praised the cleanliness and overall value for the price, with several highlighting the good location as a positive aspect, there were notable complaints about the service and check-in process, which many found to be slow and unorganized. Despite these issues, some guests enjoyed their stay, particularly appreciating the friendly staff and spacious accommodations.
                        </p>
                    </div>
                </div>

                <HoverBanner padding='0px' />


                <div className="bg-gray-100 p-4 rounded-md ">
                    <h3 className="text-red-600 font-bold text-3xl mb-2">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:spa" className="text-2xl" />
                            <span>Spa and wellness center</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:glass-cocktail" className="text-2xl" />
                            <span>Bar/Lounge</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:silverware-fork-knife" className="text-2xl" />
                            <span>Restaurant</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:room-service" className="text-2xl" />
                            <span>Room service</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:coffee-outline" className="text-2xl" />
                            <span>Tea/coffee maker</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-200 p-6 rounded-md">
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        {/* Basics Section */}
                        <div>
                            <h3 className="font-bold text-lg mb-2">Basics</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Wi-Fi available in all areas</li>
                                <li>Internet</li>
                                <li>Fire extinguisher</li>
                                <li>Free toiletries</li>
                                <li>Smoke alarms</li>
                                <li>Heating</li>
                                <li>Air-conditioned</li>
                                <li>Free Wi-Fi</li>
                                <li>Linens</li>
                                <li>Towels</li>
                                <li>Shampoo</li>
                                <li>Adapter</li>
                                <li>Body soap</li>
                                <li>Trash cans</li>
                                <li>Conditioner</li>
                            </ul>
                        </div>

                        {/* Kitchen Section */}
                        <div>
                            <h3 className="font-bold text-lg mb-2">Kitchen</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Electric kettle</li>
                                <li>Kitchenware</li>
                                <li>Kitchen</li>
                                <li>Kitchenette</li>
                                <li>Dishwasher</li>
                                <li>Microwave</li>
                                <li>Stovetop</li>
                                <li>Tea/coffee maker</li>
                                <li>Refrigerator</li>
                                <li>Coffee machine</li>
                                <li>Dining area</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <ReviewSection />
                    <ReviewTabSection />
                </div>

                <div className='flex items-center justify-center'>
                    <Pagination currentPage={1} totalPages={10} />
                </div>


            </div>
        </div>
    )
}

export default HotelDetail
