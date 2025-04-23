"use client";

import { useEffect, useState, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import Loading from "@/components/ui/Loading";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import HoverBanner from "@/components/partials/HoverBanner";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const HeroSection = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
          alt="Product specifications background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Product Specifications
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
            Explore detailed specifications for all our products. Compare features, specifications and prices
            to find the perfect match for your needs.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#categories"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium text-sm md:text-base shadow-lg transition-colors"
            >
              Browse Categories
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#featured"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium text-sm md:text-base backdrop-blur-sm transition-colors"
            >
              Featured Products
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const SpecificationCard = ({ product, category }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="relative p-3 pb-2">
        <Link href={`/specification/${category}/${product._id}`} className="block overflow-hidden rounded-lg">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-[4/3] w-full"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover rounded-lg"
              priority
            />
          </motion.div>
        </Link>

        <h3 className="mt-3 text-sm font-medium text-gray-800 line-clamp-2 h-10">
          <Link
            href={`/specification/${product.category}/${product._id}`}
            className="hover:text-red-600 transition-colors"
          >
            {product.name}
          </Link>
        </h3>
      </div>

      <div className="h-px w-full bg-gray-200" />

      <div className="p-3 pt-2 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Add to favorites"
        >
          <Heart className="h-5 w-5" />
        </motion.button>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-red-600 font-semibold text-sm md:text-base"
        >
          {product.price} {product.priceSymbal}
        </motion.div>
      </div>
    </motion.div>
  );
};

const SpecificationSection = ({ item }) => {
  const swiperRef = useRef(null);

  // Format category name for display
  const formatCategoryName = (name) => {
    return name?.replaceAll("_", " ").replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  };

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-4">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl md:text-2xl font-bold tracking-tight text-red-600"
        >
          {formatCategoryName(item?.categoryName)}
        </motion.h2>

        <Link
          href={`/specification/${item?.categoryName}`}
          className="text-sm md:text-base font-medium text-gray-600 hover:text-red-600 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="relative h-1 w-full bg-gray-200 mb-8">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "20%" }}
          transition={{ duration: 0.8 }}
          className="absolute left-0 top-0 h-full bg-red-600"
        />
      </div>

      <div className="relative w-full group mb-6">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous slide"
          className="absolute left-1 md:-left-10 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            540: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
            1440: { slidesPerView: 5, spaceBetween: 24 },
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="w-full pb-4"
        >
          {item?.specifications?.map((product, index) => (
            <SwiperSlide key={product._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpecificationCard product={product} category={item?.categoryName} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next slide"
          className="absolute right-1 md:-right-10 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <HoverBanner />
    </section>
  );
};

export default function Specification() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/website/specification");
        if (!data.error) {
          setData(data.data);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();

    return () => {
      setData([]);
    };
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Loading loading={isLoading}>
        <HeroSection />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-16 mt-8">
            {data.map((item) => (
              <SpecificationSection key={item.categoryId} item={item} />
            ))}
          </div>
        </div>
      </Loading>
    </div>
  );
}
