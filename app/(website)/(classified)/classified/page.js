import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import WeatherFilter from "@/components/partials/WeatherFilter";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React from "react";

const categories = [
  { name: "Bussiness & Industry", img: "/website/assets/images/classified/05.png" },
  { name: "Education", img: "/website/assets/images/classified/01.png" },
  { name: "Health & Beauty", img: "/website/assets/images/classified/04.png" },
  { name: "Appliances", img: "/website/assets/images/classified/03.png" },
  { name: "Electronics", img: "/website/assets/images/classified/06.png" },
  { name: "Property", img: "/website/assets/images/classified/02.png" },
];
const ads = [
  { name: "Ratherford Ave.", img: "/website/assets/images/classified/07.png", price: "2000" },
  { name: "Moon Point", img: "/website/assets/images/classified/08.png", price: "2000" },
  { name: "Azra Point", img: "/website/assets/images/classified/09.png", price: "2000" },
  { name: "Apartment for Rent", img: "/website/assets/images/classified/10.png", price: "2000" },
  { name: "Berlin", img: "/website/assets/images/classified/11.png", price: "2000" },
  { name: "Web Developer", img: "/website/assets/images/classified/12.png", price: "2000" },
];

const locations = [
  { name: "New Jersey", image: "/images/new-jersey.jpg" },
  { name: "Brooklyn", image: "/images/brooklyn.jpg" },
  { name: "Bloomfield", image: "/images/bloomfield.jpg" },
  { name: "Kansas", image: "/images/kansas.jpg" },
  { name: "California", image: "/images/california.jpg" },
];

function GridView() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-4 mt-10">
      <div className="flex items-center gap-3">
        <div className="w-[50%]">
          <Image
            src={"/website/assets/images/location/01.png"}
            width={500}
            height={500}
            alt="grid-image"
            className="w-full h-72 object-cover"
          />
        </div>
        <div className="w-[50%]">
          <Image
            src={"/website/assets/images/location/02.png"}
            width={500}
            height={500}
            alt="grid-image"
            className="w-full h-72 object-cover"
          />
        </div>
      </div>
      <div>
        <Image
          src={"/website/assets/images/location/03.png"}
          width={500}
          height={500}
          alt="grid-image"
          className="w-full h-72 object-cover"
        />
      </div>
      <div>
        <Image
          src={"/website/assets/images/location/04.png"}
          width={500}
          height={500}
          alt="grid-image"
          className="w-full h-72 object-cover"
        />
      </div>
      <div>
        <Image
          src={"/website/assets/images/location/05.png"}
          width={500}
          height={500}
          alt="grid-image"
          className="w-full h-72 object-cover"
        />
      </div>
    </div>
  );
}

function ClassifiedPage() {
  return (
    <div className="container mx-auto">
      <AdBanner />

      <div className=" py-8">
        <WeatherFilter />

        <div className="mt-10">
          <h4 className="text-3xl text-[#ff0000] text-center underline font-bold mb-8">POPULAR CATEGORIES</h4>

          <div className="bg-[#d9d9d9] p-8 grid grid-cols-3 gap-8 rounded-3xl">
            {categories.map((category, index) => (
              <div
                key={index}
                className="col-span-1 bg-white flex items-center justify-center flex-col p-8 rounded-2xl"
              >
                <h4 className="text-2xl  font-semibold mb-3">{category.name}</h4>
                <Image
                  src={category.img}
                  width={500}
                  height={500}
                  className="h-32 w-full object-contain"
                  alt="category-image"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <button className="rounded-2xl border text-center border-red-500 px-6 text-red-500 text-lg py-2 bg-white mt-8 font-semibold">
              Browse All Jobs{" "}
              <Icon icon="basil:caret-down-outline" width="24" height="24" className="inline" />
            </button>
          </div>

          <HoverBanner padding="0px" />
        </div>

        <div className="mt-10">
          <h4 className="text-3xl text-[#ff0000] text-center underline font-bold mb-8">Featured Ads</h4>

          <div className="bg-[#d9d9d9] py-8 px-20 grid grid-cols-3 gap-x-14 gap-y-6 rounded-3xl">
            {ads.map((ad, index) => (
              <div className="bg-[#fff] rounded-xl p-4">
                <Image
                  src={ad.img}
                  width={500}
                  height={500}
                  className="h-44 w-full object-cover rounded-xl mb-3"
                  alt="ad-image"
                />
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-center">{ad.name}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-xl text-red-500 font-bold ">${Number(ad.price).toFixed(2)}</p>
                    <p className="text-xl text-red-500 font-bold">Per month</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <button className="rounded-2xl border text-center border-red-500 px-6 text-red-500 text-lg py-2 bg-white mt-8 font-semibold">
              See All Sectors{" "}
              <Icon icon="basil:caret-down-outline" width="24" height="24" className="inline" />
            </button>
          </div>

          <GridView />

          <HoverBanner padding="0px" />
        </div>
      </div>
    </div>
  );
}

export default ClassifiedPage;
