"use client";
import AdBanner from "@/components/partials/AdBanner";
import CategorySection from "@/components/partials/CategorySection";
import { homeCategory } from "@/constant/data";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import HoverBanner from "@/components/partials/HoverBanner";
import Link from "next/link";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import Loading from "@/components/ui/Loading";

const SpecificationCard = ({ product }) => {
  return (
    <div className=" rounded-3xl p-4 h-60  bg-[#d4d4d4]">
      <div className="flex items-center justify-center flex-col">
        <Link href={`/specification/${product.category}/${product._id}`}>
          <Image
            src={product.image}
            width={300}
            height={300}
            alt={product.name}
            className="w-full h-32 mb-4 object-cover rounded-lg"
          />
        </Link>
        <h4 className="text-[15px] leading-5 line-clamp-2 overflow-hidden">
          <Link href={`/specification/${product.category}/${product._id}`}>{product.name}</Link>
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
        </div>
        <div>
          <h6 className="text-[#ff0000]">{product.price + " " + product.priceSymbal}</h6>
        </div>
      </div>
    </div>
  );
};

const Section = ({ item }) => {
  const swiperRef = useRef(null);

  return (
    <>
      <section className=" py-8">
        <div className="flex items-center justify-between border-black pb-3 md:pb-0">
          <span className=" md:text-xl text-sm font-semibold text-red-500 mr-6">
            {item?.category.replaceAll("_", " ")}
          </span>
          <Link
            href={`/specification/${item?.category}`}
            className={`mr-4  md:text-lg text-sm  font-medium text-gray-500`}
            onClick={() => {}}
          >
            Show All
          </Link>
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
            breakpoints={{
              0: { slidesPerView: 1.7 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1440: { slidesPerView: 5 },
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="w-full min-h-40"
          >
            {item?.specification?.map((data, index) => (
              <SwiperSlide key={index}>
                <SpecificationCard product={data} />
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
      <HoverBanner />
    </>
  );
};

function Specification() {
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
    <div className="bg-white container mx-auto my-8">
      <Loading loading={isLoading}>
        <AdBanner />
        <CategorySection category={homeCategory} />

        {data.map((item) => (
          <Section item={item} key={item.category} />
        ))}
      </Loading>
    </div>
  );
}

export default Specification;
