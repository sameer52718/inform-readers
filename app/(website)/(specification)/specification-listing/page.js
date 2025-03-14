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
            <section className='md:px-44 bg-white'>
                <div className='flex items-center gap-1 md:px-32 px-4 py-4'>
                    <h6>Home</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Store Page</h6>
                </div>

                <div className='md:px-44 px-3'>
                    <h2 className='text-3xl font-bold  pb-3'>Games</h2>
                </div>
            </section>

            <section className='py-6'>
                <div className='flex  gap-2 lg:px-64 md:px-24 px-4 mb-4'>
                    <div className='h-6 w-6 mt-2  rounded-full bg-white border-[6px] border-red-600'>
                    </div>
                    <h6 className='w-fit text-lg text-gray-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis aut recusandae nemo iusto id ea ipsum aliquid quisquam atque consectetur voluptatem minima similique sapiente corrupti eius, voluptatum quam! Mollitia corrupti quidem neque enim, repellat omnis aperiam eius deleniti magni libero possimus temporibus doloremque voluptates molestias quae tenetur! Illo quibusdam, est praesentium architecto alias quidem? Totam dignissimos nesciunt dolores nihil corporis reiciendis aliquid obcaecati aut expedita perferendis! Sed nobis cumque porro excepturi temporibus nemo ipsa atque quos! Reiciendis vitae harum vero a, officiis rerum consectetur similique iste, eum, iusto magnam itaque laborum quidem inventore molestias? Dignissimos corporis fuga facere autem sit!</h6>
                </div>
                <div className='flex  gap-2 lg:px-64 md:px-24 px-4 mb-4'>
                    <div className='h-6 w-6 mt-2  rounded-full bg-white border-[6px] border-red-600'>
                    </div>
                    <h6 className='w-fit text-lg text-gray-700'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</h6>
                </div>
            </section>


            <section className='md:px-44'>
                <div className="grid grid-cols-12  md:gap-10">
                    <div className="md:col-span-3 col-span-12 px-4">
                        <PriceFilter />
                    </div>
                    <div className="md:col-span-9 col-span-12 px-4">
                        <div className="w-full overflow-x-auto py-3 mt-5">
                            <div className="flex items-center border-black gap-4 sm:gap-6 min-w-max">
                                {/* Sort By Label */}
                                <span className="text-lg sm:text-xl font-semibold text-black whitespace-nowrap">
                                    Sort By
                                </span>

                                {/* Sorting Buttons */}
                                <div className="flex overflow-x-auto gap-4">
                                    {[
                                        { key: "showAll", label: "Popularity" },
                                        { key: "latest", label: "Latest" },
                                        { key: "highPrice", label: "High Price" },
                                        { key: "lowPrice", label: "Low Price" },
                                        { key: "name", label: "Name" }
                                    ].map(({ key, label }) => (
                                        <button
                                            key={key}
                                            className={`text-sm sm:text-lg font-medium transition ${activeTab === key ? "text-black" : "text-gray-500 hover:text-black"
                                                } whitespace-nowrap`}
                                            onClick={() => setActiveTab(key)}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Search Box (Hidden on Small Screens) */}
                                <div className="ml-auto w-full sm:w-auto mt-2 sm:mt-0 hidden md:block">
                                    <SearchInput />
                                </div>
                            </div>
                        </div>


                        <div className="divider h-[2px]  w-full bg-black">
                            <div className="w-24 bg-[#ff0000] h-full"></div>
                        </div>
                        <div className='mt-4'>
                            <GameCard />
                            <GameCard />
                            <GameCard />

                            <HoverBanner padding='0px' />

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
