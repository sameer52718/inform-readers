"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import Loading from "@/components/ui/Loading";

function SearchBanner() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "actor", name: "Actors" },
    { id: "actress", name: "Actresses" },
    { id: "singer", name: "Singers" },
    { id: "youtuber", name: "YouTubers" },
    { id: "athlete", name: "Athletes" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 shadow-lg overflow-hidden"
    >
      <div className="px-6 py-8 md:p-10">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">Find Your Favorite Celebrity</h2>
          <p className="text-white/80">
            Search through thousands of biographies of famous personalities from around the world
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-4 top-3.5 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 text-neutral-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="md:w-1/3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 text-neutral-800 appearance-none bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.5rem",
                }}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button className="bg-neutral-900 hover:bg-black text-white py-3 px-6 rounded-lg font-medium transition-colors">
              Search
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <button className="text-white/80 hover:text-white text-sm py-1 px-3 rounded-full border border-white/30 hover:border-white/60 transition-colors">
              Most Popular
            </button>
            <button className="text-white/80 hover:text-white text-sm py-1 px-3 rounded-full border border-white/30 hover:border-white/60 transition-colors">
              Recent Updates
            </button>
            <button className="text-white/80 hover:text-white text-sm py-1 px-3 rounded-full border border-white/30 hover:border-white/60 transition-colors">
              Academy Award Winners
            </button>
            <button className="text-white/80 hover:text-white text-sm py-1 px-3 rounded-full border border-white/30 hover:border-white/60 transition-colors">
              Grammy Winners
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredCelebrities = [
    {
      id: 1,
      name: "Emma Stone",
      role: "Actress",
      image:
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      quote: "Award-winning actress known for her versatile performances",
    },
    {
      id: 2,
      name: "Idris Elba",
      role: "Actor",
      image:
        "https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      quote: "From television breakthrough to Hollywood stardom",
    },
    {
      id: 3,
      name: "Taylor Swift",
      role: "Singer",
      image:
        "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      quote: "The voice of a generation with record-breaking achievements",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCelebrities.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/90 to-neutral-900/60 z-10" />

      {featuredCelebrities.map((celebrity, index) => (
        <div
          key={celebrity.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={celebrity.image} alt={celebrity.name} fill priority className="object-cover" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
            <span className="text-red-500">Famous</span> Celebrity Biographies
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8">
            Explore the lives and achievements of the world's most influential personalities
          </p>

          {/* <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-red-600 hover:bg-red-700 transition-colors text-white px-8 py-3 rounded-full font-medium text-lg">
              Explore Categories
            </button>
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white border border-white/30 px-8 py-3 rounded-full font-medium text-lg">
              Featured Biographies
            </button>
          </div> */}
        </motion.div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {featuredCelebrities.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide ? "bg-red-600 w-8" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BiographySection({ category, className = "" }) {
  console.log(category);

  return (
    <section className={`py-10 ${className}`}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-bold mb-1">
            <span className={`text-red-600`}>{category.categoryName}</span>
          </h2>
        </div>
      </div>

      <div className="h-1 w-full bg-neutral-200 mb-8">
        <div className={`h-1 w-24 bg-red-600`} />
      </div>

      {category?.biographies?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {category?.biographies.map((item) => (
            <BiographyCard key={item.name} celebrity={item} category={category.categoryName} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-500 text-lg">No biographies found matching your criteria.</p>
        </div>
      )}

      {category?.biographies?.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href={`/biography/listing?category=${category?._id}`}
            className={`text-red-600 hover:text-red-700 font-medium`}
          >
            View All {category.categoryName} →
          </Link>
        </div>
      )}
    </section>
  );
}

function BiographyCard({ celebrity, category }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link href={`/biography/${celebrity._id}`}>
        <div
          className="group relative rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl bg-white"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={celebrity.image}
              alt={celebrity.name}
              fill
              className={`object-cover transition-transform duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            {/* Rating */}
            {celebrity.rating && (
              <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-amber-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-xs font-medium text-neutral-900">
                  {celebrity.rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Hover Info */}
            <div
              className={`absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            >
              <div className="text-white">
                <p className="font-medium">{category}</p>
                <p className="text-white/80 text-sm">View biography</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg text-neutral-900">{celebrity.name}</h3>
            <div className="mt-2 flex items-center">
              <div className={`w-10 h-0.5 bg-red-600 mr-3`} />
              <p className="text-neutral-600">{category}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BiographyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/website/biography");
        if (!data.error) {
          setData(data.categories || []);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50">
      <HeroSection />
      <Loading loading={isLoading}>
        <div className="container mx-auto px-4 py-12">
          <SearchBanner />

          {data.map((category, index) => (
            <React.Fragment key={category._id}>
              <BiographySection category={category} className={index % 2 === 0 ? "" : "bg-neutral-100"} />
            </React.Fragment>
          ))}

          {/* <div className="mt-12 flex justify-center">
          <nav className="flex items-center">
            <button className="h-10 w-10 flex items-center justify-center rounded-l-lg border border-neutral-300 hover:bg-neutral-100 transition-colors">
              <span className="sr-only">Previous</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`h-10 w-10 flex items-center justify-center border-t border-b border-neutral-300 ${
                  page === 1 ? "bg-red-600 text-white" : "hover:bg-neutral-100 transition-colors"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="h-10 w-10 flex items-center justify-center rounded-r-lg border border-neutral-300 hover:bg-neutral-100 transition-colors">
              <span className="sr-only">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div> */}
        </div>
      </Loading>
    </main>
  );
}
