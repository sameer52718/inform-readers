"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import Loading from "@/components/ui/Loading";
import SearchInput from "@/components/ui/SearchInput";
import axiosInstance from "@/lib/axiosInstance";
import formatDate from "@/lib/formatDate";
import handleError from "@/lib/handleError";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";


const products = [
  {
    id: 1,
    image: "/website/assets/images/product/01.png",
    title: "iQOO Neo 10R (8GB RAM, 128GB) - Raging dsa sdsad dsadsa asd",
    price: "₹26,998",
    discount: "Flat ₹2,000 Discount*",
    platform: "amazon",
  },
  {
    id: 2,
    image: "/website/assets/images/product/02.png",
    title: "Deals on Refrigerators Starting @ ₹65/Day",
    price: "No Cost EMI*",
    discount: "Extra 10% Discount*",
    platform: "amazon",
  },
  {
    id: 3,
    image: "/website/assets/images/product/03.png",
    title: "Affordable Deals on Best Window & Split ACs",
    price: "Starting ₹23,240",
    discount: "10% Instant Discount",
    platform: "amazon",
  },
  {
    id: 4,
    image: "/website/assets/images/product/04.png",
    title: "Nothing Phone 3a (8GB RAM, 128GB) - White",
    price: "₹24,999",
    platform: "flipkart",
  },
];

const SpecificationTable = ({ data = [] }) => {
  const specifications = [
    { label: "Brand", value: "Motorola" },
    { label: "Model", value: "65 Inch LED Ultra HD (4K) TV (65SAUHDM)" },
    { label: "Price", value: "₹57,999 (India)" },
    { label: "Model Name", value: "65SAUHDM" },
    { label: "Display Size", value: "65 inch" },
    { label: "Screen Type", value: "LED" },
    { label: "Color", value: "Black" },
    { label: "Resolution (pixels)", value: "3840×2160" },
    { label: "Resolution Standard", value: "4K" },
    { label: "3D", value: "No" },
    { label: "Smart TV", value: "Yes" },
    { label: "Curve TV", value: "No" },
    { label: "Launch Year", value: "2019" },
  ];

  return (
    <div className=" bg-white shadow-md rounded-lg p-6 border">
      <h2 className="text-lg font-semibold mb-4">General</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="odd:bg-gray-100 even:bg-white">
                <td className="px-4 py-2 font-medium">{item.name}</td>
                <td className="px-4 py-2">{item.value || "---"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReviewSection = () => {
  const totalReviews = 1;
  const ratings = [1, 0, 0, 0, 0];

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-10 bg-white shadow-md rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-0">
        {/* Left Section - Overall Rating */}
        <div className="sm:col-span-2 flex flex-col items-center sm:items-start sm:border-r-4 border-gray-200 pb-4 sm:pb-0">
          <div className="flex items-end space-x-2">
            <span className="text-5xl sm:text-6xl font-bold text-red-600">5.0</span>
            <span className="text-gray-500 text-base sm:text-lg">out of 5</span>
          </div>
          <div className="flex items-center my-2">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon="material-symbols-light:star-rounded"
                width="28"
                height="28"
                className="text-red-600 fill-red-600"
              />
            ))}
          </div>
        </div>

        {/* Right Section - Rating Distribution */}
        <div className="sm:col-span-10 pl-0 sm:pl-4">
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={5 - i} className="flex items-center space-x-2">
                {/* Stars */}
                <div className="flex">
                  {[...Array(5)].map((_, j) => (
                    <Icon
                      key={j}
                      icon="material-symbols-light:star-rounded"
                      width="24"
                      height="24"
                      className={j < 5 - i ? "text-red-600 fill-red-600" : "text-gray-300"}
                    />
                  ))}
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-300 h-3 sm:h-4 rounded-full">
                  {ratings[i] > 0 && (
                    <div
                      className="bg-red-600 h-3 sm:h-4 rounded-full"
                      style={{ width: `${(ratings[i] / totalReviews) * 100}%` }}
                    ></div>
                  )}
                </div>
                {/* Review Count */}
                <span className="text-gray-500 text-sm sm:text-base">{ratings[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write a Review Button */}
      <div className="flex items-center justify-center">
        <button className="mt-4 w-full sm:w-fit px-6 sm:px-10 py-2 sm:py-3 rounded-3xl bg-red-600 text-white hover:bg-red-700 transition">
          Write a Review
        </button>
      </div>
    </div>
  );
};

const InfoSections = ({ data, name }) => {
  return (
    <>
      <div className="py-10">
        <HoverBanner />
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 px-4 md:px-0 mt-6 gap-6">
        <div className="col-span-1"></div>
        <div className="md:col-span-2 col-span-1">
          <h5 className="text-gray-400 font-bold text-xl mb-4">{name}</h5>
          <SpecificationTable data={data} />
        </div>
      </div>
    </>
  );
};

const ReviewTabSection = () => {
  const [selectedReviewTab, setSelectedReviewTab] = useState("all");
  const totalReviews = 1;
  const ratings = [1, 0, 0, 0, 0];

  return (
    <div className="p-4 sm:p-6 rounded-lg bg-white shadow">
      {/* Tab Menu */}
      <div className="flex overflow-x-auto sm:justify-start border-b border-black mb-4 space-x-2 sm:space-x-4 pb-2">
        {["Show all", "Most Helpful", "Highest Rating", "Lowest Rating"].map((tab, index) => (
          <button
            key={index}
            className={`whitespace-nowrap px-3 py-2 text-base sm:text-lg font-medium transition
            ${selectedReviewTab === tab
                ? "text-red-600 bg-gray-300 rounded-2xl"
                : "text-gray-500 hover:text-red-600"
              }`}
            onClick={() => setSelectedReviewTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Review Section */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Image
            width={40}
            height={40}
            src="/user-avatar.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  icon="material-symbols-light:star-rounded"
                  width="24"
                  height="24"
                  className="text-red-600 fill-red-600"
                />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-500">supervendor - June 17, 2019</p>
          </div>
        </div>
        <p className="mt-2 text-gray-700 text-sm sm:text-base">I think this is the best product ever</p>
      </div>

      {/* Add Review Section */}
      <div className="border-t pt-4">
        <p className="font-bold text-base sm:text-lg">Add a review</p>
        <p className="text-sm text-gray-500">
          You must be <span className="text-red-600 cursor-pointer hover:underline">logged in to post</span> a
          review.
        </p>
      </div>
    </div>
  );
};


const TabHeader = ({ onScrollShow }) => {
  const tabs = ["Overview", "Specifications", "Reviews", "FAQs"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (

    <div className={`z-50 fixed bg-white shadow-xl w-full top-0  duration-500  ${onScrollShow ? "translate-y-0" : "-translate-y-[100%]"}`}>
      <div className="px-32 py-4">
        <h1 className="z-50 text-3xl pb-3 ">Red Dead Redemption 2</h1>

        <div className="w-full">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={` text-lg font-medium focus:outline-none transition-all 
              ${activeTab === tab ? " border-red-500 text-red-500" : "text-gray-600"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

function SpecificationDetail() {
  const { id, category } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTabHeder, setActiveTabHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 500) {
        setActiveTabHeader(true);
      } else {
        setActiveTabHeader(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  console.log(activeTabHeder);
  

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/website/specification/${category}/${id}`);
        if (!data.error) {
          setData(data.specification);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [id, category]);

  // if (!isLoading && !data) {
  //   return <div>No Data Found</div>;
  // }


  const images = [
    { src: "/website/assets/images/product/01.png", type: "image" },
    { src: "/website/assets/images/product/02.png", type: "video" },
    { src: "/website/assets/images/product/03.png", type: "image" },
  ];

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );


  const [selectedImage, setSelectedImage] = useState(images[0].src);



  return (

    <>
      <TabHeader onScrollShow={activeTabHeder} />
      <div className="container mx-auto">
        <Loading loading={isLoading}>
          <AdBanner />
          <section className=" bg-white">
            <div className="flex items-center gap-1  py-4">
              <h6>Home</h6>
              <Icon icon="basil:caret-right-solid" className="mt-[2px]" width="18" height="18" />
              <h6>Specification</h6>
              <Icon icon="basil:caret-right-solid" className="mt-[2px]" width="18" height="18" />
              <h6>{category.replaceAll("_", " ")}</h6>
              <Icon icon="basil:caret-right-solid" className="mt-[2px]" width="18" height="18" />
              <h6>{data?.name}</h6>
            </div>

            <div>
              <h2 className="text-3xl font-bold  pb-3">{data?.name}</h2>
            </div>
          </section>

          <section className=" py-8">
            <div>
              <div className="flex items-center border-black md:pb-0 pb-4 sticky top-20">
                <span className=" md:text-xl text-sm font-semibold text-red-500 mr-6">Overview</span>
                <Link href={"#spec"} className={`mr-4 md:text-lg text-sm font-medium `}>
                  Specs
                </Link>

                <Link href={"#reviews"} className={`mr-4 md:text-lg text-sm font-medium `}>
                  User Reviews
                </Link>
              </div>

              <div className="divider h-[2px]  w-full bg-black">
                <div className="w-24 bg-[#ff0000] h-full"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-12 grid-cols-1 mt-6 gap-6 items-start">
              <div className="md:col-span-3  sticky top-40">
                <div className="flex gap-4 mb-8">
                  <div className="flex flex-col gap-2">
                    {images.map((item, index) => (
                      <div
                        key={index}
                        className="relative w-16 h-16 object-contain border rounded-lg overflow-hidden cursor-pointer hover:border-red-500"
                        onClick={() => setSelectedImage(item.src)}
                      >
                        <Image src={item.src} alt="Thumbnail" width={64} height={64} className="w-full h-full object-contain" />
                        {item.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="text-white text-lg">▶</span>
                          </div>
                        )}
                      </div>
                    ))}

                  </div>

                  <div className="w-64 h-64 border rounded-lg overflow-hidden">
                    <Image src={selectedImage} alt="Selected" width={256} height={256} className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="h-[250px] sm:h-[400px] w-full">
                  <Image
                    src={data?.image}
                    alt={data?.name}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="md:col-span-6  sm:p-0 p-4 ">
                <div className="bg-[#d9d9d9] px-4 pt-4 rounded-xl w-full mb-4 shadow-md">
                  <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-600 underline">
                    <Link href="#">Red Dead Redemption 2</Link>
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    {data?.data?.generalSpecs.slice(0, 6).map((spec, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Icon icon={"ic:baseline-play-arrow"} className="flex-none" />
                        <span className="text-gray-600 text-sm sm:text-base">
                          {spec.name}:{" "}
                          {spec.value
                            ? spec.value.length > 50
                              ? `${spec.value.slice(0, 50)}...`
                              : spec.value
                            : "---"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-black mx-4 mt-4">
                    <div className="flex flex-col items-center py-3">
                      <span className="text-black text-lg font-semibold">Listing Date</span>
                      <span className="text-gray-600 text-sm font-semibold">
                        {formatDate(data?.createdAt, "DD MMMM YYYY")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#d9d9d9] px-4 pt-4 rounded-xl w-full mb-4 shadow-md">
                  <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-600 underline">
                    <Link href="#">Red Dead Redemption 2</Link>
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    {data?.data?.generalSpecs.slice(0, 6).map((spec, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Icon icon={"ic:baseline-play-arrow"} className="flex-none" />
                        <span className="text-gray-600 text-sm sm:text-base">
                          {spec.name}:{" "}
                          {spec.value
                            ? spec.value.length > 50
                              ? `${spec.value.slice(0, 50)}...`
                              : spec.value
                            : "---"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-black mx-4 mt-4">
                    <div className="flex flex-col items-center py-3">
                      <span className="text-black text-lg font-semibold">Listing Date</span>
                      <span className="text-gray-600 text-sm font-semibold">
                        {formatDate(data?.createdAt, "DD MMMM YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 ">
                <div className=" bg-white border rounded-lg shadow-md p-4">
                  {/* Header */}
                  <div className="bg-red-600 text-white text-sm font-semibold p-2 rounded-t-lg text-center">
                    TRENDING PRODUCTS »
                  </div>

                  {/* Search Bar */}
                  <div className="relative mt-2">
                    <input
                      type="text"
                      placeholder="Search for X"
                      className="w-full border p-2 rounded-md outline-none"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="absolute right-3 top-3 text-gray-400">🔍</span>
                  </div>

                  {/* Product List */}
                  <div className="mt-4 space-y-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="flex gap-3 border p-2 rounded-md hover:bg-yellow-100">
                        <div className="w-16 h-16 flex-none">
                          <Image src={product.image} alt={product.title} width={64} height={64} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{product.title}</p>
                          <p className="text-black font-bold">{product.price}</p>
                          {product.discount && <p className="text-green-600 text-xs">{product.discount}</p>}
                          <div className="flex items-center gap-2 mt-1">
                            {product.platform === "amazon" ? (
                              <Image src="/images/amazon-logo.png" alt="Amazon" width={60} height={20} />
                            ) : (
                              <Image src="/images/flipkart-logo.png" alt="Flipkart" width={60} height={20} />
                            )}
                            <button className="bg-red-600 text-white text-xs px-3 py-1 rounded-md">BUY NOW</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>


            {data?.data &&
              Object.keys(data?.data).map((key) => {
                if (key === "_id") {
                  return null;
                }

                if (data.data[key].length === 0) {
                  return null;
                }

                return <InfoSections key={key} data={data.data[key]} name={data?.name} />;
              })}

            <div className="grid md:grid-cols-3 grid-cols-1 px-4 md:px-0 mt-6 gap-6">
              <div className="col-span-1"></div>
              {/* <div className="md:col-span-2">
              <CompetitorCard />
            </div> */}
              <div className="md:col-span-3" id="reviews">
                <ReviewSection />
              </div>
              <div className="md:col-span-3">
                <ReviewTabSection />
              </div>
            </div>
          </section>
        </Loading>
      </div>
    </>
  );
}

export default SpecificationDetail;
