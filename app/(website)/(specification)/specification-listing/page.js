"use client"


import GameCard from '@/components/card/GameCard'
import HoverBanner from '@/components/partials/HoverBanner'
import PriceFilter from '@/components/partials/PriceFilter'
import SearchInput from '@/components/ui/SearchInput'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import React, { useState } from 'react'

function SpecificationList() {
    const [activeTab, setActiveTab] = useState("popularity");
    return (
        <>
            <section className='px-32 bg-white'>
                <div className='flex items-center gap-1 px-32 py-4'>
                    <h6>Home</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Store Page</h6>
                </div>

                <div className='px-32'>
                    <h2 className='text-3xl font-bold  pb-3'>Games</h2>
                </div>
            </section>

            <section className='py-6'>
                <div className='flex  gap-2 px-64 mb-4'>
                    <div className='h-6 w-6 mt-2  rounded-full bg-white border-[6px] border-red-600'>
                    </div>
                    <h6 className='w-fit text-lg text-gray-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis aut recusandae nemo iusto id ea ipsum aliquid quisquam atque consectetur voluptatem minima similique sapiente corrupti eius, voluptatum quam! Mollitia corrupti quidem neque enim, repellat omnis aperiam eius deleniti magni libero possimus temporibus doloremque voluptates molestias quae tenetur! Illo quibusdam, est praesentium architecto alias quidem? Totam dignissimos nesciunt dolores nihil corporis reiciendis aliquid obcaecati aut expedita perferendis! Sed nobis cumque porro excepturi temporibus nemo ipsa atque quos! Reiciendis vitae harum vero a, officiis rerum consectetur similique iste, eum, iusto magnam itaque laborum quidem inventore molestias? Dignissimos corporis fuga facere autem sit!</h6>
                </div>
                <div className='flex  gap-2 px-64 mb-4'>
                    <div className='h-6 w-6 mt-2  rounded-full bg-white border-[6px] border-red-600'>
                    </div>
                    <h6 className='w-fit text-lg text-gray-700'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</h6>
                </div>
            </section>


            <section className='px-32'>
                <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-3">
                        <PriceFilter />
                    </div>
                    <div className="col-span-9">
                        <div className="flex items-center border-black ">
                            <span className=" text-xl font-semibold text-black mr-6">Sort By</span>
                            <button
                                className={`mr-4  text-lg font-medium ${activeTab === "showAll" ? "text-black-500" : "text-gray-500"
                                    }`}
                                onClick={() => setActiveTab("showAll")}
                            >
                                Popularity
                            </button>
                            <button
                                className={` mr-4 text-lg font-medium ${activeTab === "popular" ? "text-black-500" : "text-gray-500"
                                    }`}
                                onClick={() => setActiveTab("popular")}
                            >
                                latest
                            </button>
                            <button
                                className={` mr-4 text-lg font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                                    }`}
                                onClick={() => setActiveTab("bestRated")}
                            >
                                High Price
                            </button>
                            <button
                                className={` mr-4 text-lg font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                                    }`}
                                onClick={() => setActiveTab("bestRated")}
                            >
                                Low Price
                            </button>
                            <button
                                className={` mr-4 text-lg font-medium ${activeTab === "bestRated" ? "text-black-500" : "text-gray-500"
                                    }`}
                                onClick={() => setActiveTab("bestRated")}
                            >
                                Name
                            </button>
                            {/* Search Box */}
                            <div className="ml-auto relative">
                                <SearchInput />
                            </div>
                        </div>

                        <div className="divider h-[2px]  w-full bg-black">
                            <div className="w-24 bg-[#ff0000] h-full"></div>
                        </div>
                        <div className='mt-4'>
                        <GameCard />
                        <GameCard />
                        <GameCard />
                       
                       <HoverBanner  padding='0px'/>

                       <GameCard />
                        <GameCard />
                        <GameCard />

                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default SpecificationList
