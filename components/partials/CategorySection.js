"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

function CategorySection({ category }) {
  return (
    <section className=" px-4 py-10">
      <Swiper
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 3, spaceBetween: 20 },
          640: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 6, spaceBetween: 20 },
        }}
      >
        {category.map((cate, index) => (
          <SwiperSlide key={index}>
            <div className="flex items-center justify-center flex-col">
              <div className="h-20 w-20 border-[1px] border-black rounded-lg mb-3">
                <Link href={cate.url}>
                  <Image
                    width={1000}
                    height={1000}
                    src={cate.image}
                    alt={cate.name}
                    className="h-full w-full object-contain"
                  />
                </Link>
              </div>
              <h3 className="font-semibold">
                <Link href={cate.url}> {cate.name}</Link>{" "}
              </h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className=" bg-[#d9d9d9] mt-10 w-full h-2 md:mx-8 sm:mx-4 mx-2">
        <div className="w-40 h-full bg-[#FF0000] "></div>
      </div>
    </section>
  );
}

export default CategorySection;
