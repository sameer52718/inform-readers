import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner';
import Pagination from '@/components/ui/Pagination';
import Image from 'next/image';
import React from 'react'


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
        <div className="bg-gray-200 md:p-6 rounded-3xl border border-black mb-6">
            {newsData.map((news) => (
                <div
                    key={news.id}
                    className="flex flex-col sm:flex-row space-x-4 sm:space-x-6 p-4 rounded-xl mb-6"
                >
                    {/* Image */}
                    <div className="w-full sm:w-40 h-28 mb-4 sm:mb-0 px-4">
                        <Image
                            width={1000}
                            height={1000}
                            src={news.image}
                            alt="News Thumbnail"
                            className="w-full h-full rounded-xl object-cover"
                        />
                    </div>

                    {/* News Content */}
                    <div className="flex-1 bg-white p-5 rounded-3xl">
                        <h2 className="font-bold text-lg sm:text-xl">{news.title}</h2>
                        <p className="text-red-600 font-bold text-xl mt-1 mb-3">
                            {news.author} <span className='text-xs text-gray-600'>- August 7, 2019</span>
                        </p>
                        <p className="text-gray-700 bg-gray-300 px-3 py-5 text-lg font-semibold rounded-md">
                            {news.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>

    );
};


function NewsListing() {
    return (
        <div>
            <AdBanner />

            <div className='md:px-52 py-8'>
                <h4 className='font-bold text-4xl text-center md:mb-0 mb-5'><span className='text-red-500'>Fashion</span> News</h4>
                <Gallery />
            </div>

            <Image src={"/website/assets/images/banner/04.png"} width={2000} height={2000} alt="ad-banner" className=' h-auto  my-6' />

            <div className='md:px-52 py-8'>
                <NewsSection />
                <NewsSection />
            </div>

            <div className="md:px-52 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

            <div className='md:px-52 py-8'>
                <NewsSection />
                <NewsSection />
            </div>

            <Image src={"/website/assets/images/banner/04.png"} width={2000} height={2000} alt="ad-banner" className=' h-auto  my-6' />

            <div className='md:px-52 py-8'>
                <NewsSection />

                <div className='flex items-center justify-center'>
                    <Pagination currentPage={1} totalPages={10} />
                </div>
            </div>

        </div>
    )
}

export default NewsListing
