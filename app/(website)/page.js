"use client";

import ContentCard from "@/components/card/ContentCard";
import AdBanner from "@/components/partials/AdBanner";
import CategorySection from "@/components/partials/CategorySection";
import HoverBanner from "@/components/partials/HoverBanner";
import SliderSection from "@/components/partials/SliderSection";
import { biographyData, homeCategory, mapData } from "@/constant/data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useRef } from "react";
import Image from "next/image";
import ProductCard from "../../components/card/ProductCard";
import JobsCard from "@/components/card/JobsCard";
import BiographyCard from "@/components/card/BiographyCard";
import NameMeaningCard from "@/components/card/NameMeaningCard";
import Link from "next/link";

export default function Home() {
  const swiperRef = useRef(null);

  return (
    <div className="container mx-auto">
      <AdBanner />
      <CategorySection category={homeCategory} />
      <HoverBanner />

      <section className="px-32 py-8">
        <SliderSection heading="Latest Gadget" />
        <ContentCard>
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
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full min-h-40"
            >
              {[...Array(7)].map((_, index) => (
                <SwiperSlide key={index}>
                  <ProductCard />
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
        </ContentCard>
      </section>

      <section className="px-32 py-8">
        <SliderSection heading="Jobs Opening" />
        <ContentCard>
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
              spaceBetween={80}
              slidesPerView={2}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full min-h-40"
            >
              {[...Array(7)].map((_, index) => (
                <SwiperSlide key={index}>
                  <JobsCard />
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
              spaceBetween={80}
              slidesPerView={2}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full min-h-40"
            >
              {[...Array(7)].map((_, index) => (
                <SwiperSlide key={index}>
                  <JobsCard />
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
        </ContentCard>
      </section>

      <HoverBanner />

      <section className="px-32 py-8">
        <SliderSection heading="Name Meaning" />
        <ContentCard>
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
              spaceBetween={80}
              slidesPerView={2}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full min-h-40"
            >
              {[...Array(7)].map((_, index) => (
                <SwiperSlide key={index}>
                  <NameMeaningCard />
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
        </ContentCard>
      </section>

      <section className="px-32 py-8">
        <SliderSection heading="Biography" />
        <ContentCard>
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
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full min-h-40"
            >
              {biographyData.map((item, index) => (
                <SwiperSlide key={index}>
                  <BiographyCard data={item} />
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
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full min-h-40"
            >
              {biographyData.map((item, index) => (
                <SwiperSlide key={index}>
                  <BiographyCard data={item} />
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
        </ContentCard>
      </section>

      <HoverBanner />

      <section className="px-32 py-8">
        <SliderSection heading="Cars" />
        <ContentCard>
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
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full min-h-40"
            >
              {[...Array(7)].map((_, index) => (
                <SwiperSlide key={index}>
                  <ProductCard />
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
        </ContentCard>
      </section>

      <section className="px-32 py-8">
        <SliderSection heading="Bikes" />
        <ContentCard>
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
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full min-h-40"
            >
              {[...Array(7)].map((_, index) => (
                <SwiperSlide key={index}>
                  <ProductCard />
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
        </ContentCard>
      </section>
      <section className="px-32 py-8">
        <SliderSection heading="Zip Codes" />
        <ContentCard>
          <div className="flex items-center gap-4 flex-wrap py-6 px-1">
            {mapData.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl bg-white px-6 py-1 border-2 border-black flex items-center w-fit"
              >
                <Link href={"/postal-code/1"} className="flex items-center gap-2">
                  <Image
                    src={item.image}
                    alt={item.image}
                    width={32}
                    height={20}
                    className="w-6 h-6 object-contain rounde-full"
                  />
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </ContentCard>
      </section>

      <HoverBanner />
    </div>
  );
}
