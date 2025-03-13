"use client"

import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner';
import SearchInput from '@/components/ui/SearchInput';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'


const Gallery = () => {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {/* Main Large Image */}
      <div className="relative col-span-2 row-span-2 md:col-span-2">
        <Image
          src="/website/assets/images/news/01.png"
          alt="Fashion News"
          width={800}
          height={500}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
          Fashion
        </div>
        <div className="absolute bottom-3 left-3 text-white text-xl font-bold">
          WordPress News Magazine Charts the Most Chic and Fashionable Women of New York City
        </div>
      </div>

      {/* Second Image */}
      <div className="relative">
        <Image
          src="/website/assets/images/news/02.png"
          alt="Gadgets"
          width={400}
          height={250}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
          Gadgets
        </div>
        <div className="absolute bottom-3 left-3 text-white text-lg font-bold">
          Discover the Most Magical Sunset in Santorini
        </div>
      </div>

      {/* Third Image */}
      <div className="relative">
        <Image
          src="/website/assets/images/news/03.png"
          alt="Interiors"
          width={400}
          height={250}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
          Interiors
        </div>
      </div>
    </div>
  );
};

const AllContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 ">
      <div className='md:col-span-6 col-span-12'>
        <Image
          src={"/website/assets/images/news/06.png"}
          width={1000}
          height={1000}
          className="w-full md:h-[450px] h-auto rounded-3xl object-cover"
        />

        <h4 className="text-2xl sm:text-3xl font-semibold mt-5">
          Interior Designer and Maude Interiors by Yvonne Designs
        </h4>

        <div className="flex items-center mt-4">
          <h5 className="text-xl sm:text-3xl font-bold text-red-500">Armin Vans</h5>
          <span className="text-gray-400 text-sm sm:text-base"> - August 7, 2019</span>
        </div>
      </div>

      {/* News List */}
      <div className="bg-[#d9d9d9] rounded-2xl p-6 md:col-span-6 col-span-12">
        {[...Array(4)].map((_, i) => (
          <Link href={"/news/1"} key={i}>
            <div key={i} className="flex md:flex-row flex-col gap-3 rounded-2xl overflow-hidden mb-5">
              <Image
                src={"/website/assets/images/news/05.png"}
                alt="card-img"
                width={1000}
                height={1000}
                className="h-32 md:w-32 object-cover"
              />
              <div>
                <h4 className="text-lg sm:text-xl font-semibold bg-white p-2 rounded-xl">
                  Have a look around this bold and colourful 1930s semi in London
                </h4>
                <p className="text-red-500 font-bold mt-2 text-sm sm:text-base">August 7, 2019</p>
              </div>
            </div>
          </Link>
        ))}
      </div>


    </div>

  );
};

const StyleHunterContent = () => {
  return (
    <div>
      <h1>Style Hunter Content</h1>
    </div>
  );
};

const VogueContent = () => {
  return (
    <div>
      <h1>Vogue Content</h1>
    </div>
  );
};

const HealthFitnessContent = () => {
  return (
    <div>
      <h1>Health & Fitness Content</h1>
    </div>
  );
};

const TravelContent = () => {
  return (
    <div>
      <h1>Travel Content</h1>
    </div>
  );
};

const GadgetsContent = () => {
  return (
    <div>
      <h1>Gadgets Content</h1>
    </div>
  );
};

const AllContentTwo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="rounded-2xl overflow-hidden space-y-4">
          {/* Main News Card */}
          <div className="bg-gray-300 rounded-2xl overflow-hidden">
            <Link href="/news/1">
              <Image
                src="/website/assets/images/news/05.png"
                alt="News Image"
                className="w-full h-52 md:h-64 object-cover rounded-2xl"
                width={1000}
                height={1000}
              />
            </Link>
            <div className="p-4">
              <h2 className="text-xl md:text-2xl font-semibold">
                <Link href="/news/1">Now Is the Time to Think About Your Small-Business Success</Link>
              </h2>
              <p className="text-red-600 text-lg md:text-xl font-bold mt-2">
                Armin Vans{" "}
                <span className="text-gray-600 text-sm font-light">- August 7, 2019</span>
              </p>
              <p className="text-gray-700 mt-2 text-sm md:text-base font-bold">
                We woke reasonably late following the feast and free-flowing wine the night before.
                After gathering ourselves and our packs, we headed down to...
              </p>
            </div>
          </div>

          {/* News List */}
          <div className="bg-gray-300 p-3 rounded-2xl shadow-md space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex space-x-3 p-2 rounded-lg shadow">
                <Link href="/news/1">
                  <Image
                    width={1000}
                    height={1000}
                    src="/website/assets/images/news/05.png"
                    alt="News Thumbnail"
                    className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
                  />
                </Link>
                <div>
                  <p className="text-sm md:text-lg font-semibold bg-white py-2 px-2 rounded-xl">
                    <Link href="/news/1">
                      Have a look around this bold and colourful 1930s semi in London
                    </Link>
                  </p>
                  <p className="text-red-600 text-xs md:text-sm font-bold mt-2 px-2">August 7, 2019</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>


  );
}



function TabMenu() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div>
      <div className="flex border-b md:flex-row flex-col items-center justify-between border-black">
        <div className='mb-5'>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 md:py-2 py-3 md:text-xl text-xs font-semibold ${activeTab === tab ? "text-red-500 border-b-2 border-red-500" : "text-gray-600"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <SearchInput />
      </div>

      <div className="p-4">{tabContent[activeTab] || <h1>No Content Available</h1>}</div>
    </div>
  );
}


function TabMenuTwo() {
  const [activeTabTwo, setActiveTabTwo] = useState("All");
  const [showMore, setShowMore] = useState(false);

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-black flex flex-wrap items-center justify-between md:px-4 px-4 py-2">
        <div className="flex md:space-x-4  space-x-1.5 max-w-full">
          {tabsTwo.map((tab) => (
            <button
              key={tab}
              className={`md:text-lg text-sm font-semibold whitespace-nowrap ${activeTabTwo === tab ? "text-red-500 border-b-2 border-red-500" : "text-gray-600"
                } px-2`}
              onClick={() => setActiveTabTwo(tab)}
            >
              {tab}
            </button>
          ))}

          {/* More Dropdown for Extra Tabs */}
          <div className="relative">
            <button
              className="md:text-lg text-sm font-semibold text-gray-600 flex items-center"
              onClick={() => setShowMore(!showMore)}
            >
              More <Icon icon="basil:caret-down-solid" width="24" height="24" />
            </button>

            {showMore && (
              <div className="absolute left-0 mt-2 bg-white border rounded shadow-lg w-40 z-50">
                {moreTabs.map((tab) => (
                  <button
                    key={tab}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => {
                      setActiveTabTwo(tab);
                      setShowMore(false);
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Input (Hidden on Small Screens) */}
        <div className="hidden md:block">
          <SearchInput />
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">{tabContentTwo[activeTabTwo] || <h1>No Content Available</h1>}</div>
    </div>

  );
}

const RedCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-red-600 rounded-2xl overflow-hidden shadow-lg">
          <div className="w-full h-48 sm:h-60">
            <Image
              width={1000}
              height={1000}
              src="/website/assets/images/news/05.png"
              alt="Modern Monochrome Home"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-white p-4">
            <p className="text-lg sm:text-xl font-semibold">
              Modern Monochrome Home with Calm and Cosy Terrace and Steps
            </p>
          </div>
        </div>
      ))}
    </div>


  );
};


const NewsSection = () => {
  const newsData = [
    {
      id: 1,
      image: "/website/assets/images/news/07.png",
      title: "KTM Marchetti Signs with Larranaga and Zanotti for Next Season",
      author: "Armin Vans",
      date: "August 7, 2019",
      description:
        "We woke reasonably late following the feast and free-flowing wine the night before. After gathering ourselves and our packs, we headed down to...",
    },
    {
      id: 2,
      image: "/website/assets/images/news/08.png",
      title: "KTM Marchetti Signs with Larranaga and Zanotti for Next Season",
      author: "Armin Vans",
      date: "August 7, 2019",
      description:
        "We woke reasonably late following the feast and free-flowing wine the night before. After gathering ourselves and our packs, we headed down to...",
    },
  ];

  return (
    <div className="bg-gray-200 md:p-6 rounded-xl">
      {newsData.map((news) => (
        <div
          key={news.id}
          className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-4 rounded-xl mb-6"
        >
          {/* Image */}
          <div className="w-full md:w-40 h-40 md:h-28">
            <Image
              width={1000}
              height={1000}
              src={news.image}
              alt="News Thumbnail"
              className="w-full h-full rounded-xl object-cover"
            />
          </div>

          {/* News Content */}
          <div className="flex-1 bg-white p-4 md:p-5 rounded-3xl">
            <h2 className="font-bold text-lg md:text-xl">{news.title}</h2>
            <p className="text-red-600 font-bold text-base md:text-xl mt-1 mb-3">
              {news.author} <span className="text-xs text-gray-600">- August 7, 2019</span>
            </p>

            <p className="text-gray-700 bg-gray-300 px-3 py-4 text-sm md:text-lg font-semibold rounded-md">
              {news.description}
            </p>
          </div>
        </div>
      ))}
    </div>

  );
};


const tabs = ["All", "Style Hunter", "Vogue", "Health & Fitness", "Travel", "Gadgets"];
const tabsTwo = ["All", "Music", "Health & Fitness", "Travel"];
const moreTabs = ["Fashion", "Technology", "Sports"];

const tabContent = {
  All: <AllContent />,
  "Style Hunter": <StyleHunterContent />,
  Vogue: <VogueContent />,
  "Health & Fitness": <HealthFitnessContent />,
  Travel: <TravelContent />,
  Gadgets: <GadgetsContent />,
};

const tabContentTwo = {
  All: <AllContentTwo />,
  "Style Hunter": <StyleHunterContent />,
  Music: <VogueContent />,
  "Health & Fitness": <HealthFitnessContent />,
  Travel: <TravelContent />,
};


function News() {
  return (
    <div className=''>
      <AdBanner />
      <div className="md:px-48 px-4 py-8">
        <Gallery />
      </div>
      <Image src={"/website/assets/images/banner/04.png"} width={2000} height={2000} alt="ad-banner" className=' h-auto  mb-3' />
      <div className='md:px-48 px-4 mt-12'>
        <TabMenu />

      </div>

      <div className="md:px-44 sm:px-12 px-2 py-8">
        <HoverBanner />
      </div>

      <div className='md:px-48  mt-12'>
        <TabMenuTwo />
      </div>

      <div className="md:px-44 sm:px-12 px-2 py-8">
        <HoverBanner />
      </div>

      <div className='md:px-48 px-4 mt-12'>
        <RedCard />
      </div>

      <div className="md:px-44 sm:px-12 px-2 py-8">
        <HoverBanner />
      </div>

      <div className='md:px-48 px-4 mt-12'>
        <NewsSection />
      </div>

      <Image src={"/website/assets/images/banner/04.png"} width={2000} height={2000} alt="ad-banner" className=' h-auto  my-10 ' />

      <div className='md:px-48 px-4'>
        <NewsSection />
      </div>

    </div>
  )
}

export default News
