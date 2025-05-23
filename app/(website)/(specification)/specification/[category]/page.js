"use client";

import HoverBanner from "@/components/partials/HoverBanner";
import PriceFilter from "@/components/partials/PriceFilter";
import Loading from "@/components/ui/Loading";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";
import Image from "next/image";
import { userTypes } from "@/constant/data";

const SpecificationCard = ({ product, category }) => {
  const { userType, user } = useSelector((state) => state.auth);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlist, setWishlist] = useState(product?.wishlist?.includes(user?._id) || false);

  const handleWislisht = async () => {
    try {
      if (userType !== userTypes.USER) {
        toast.warn("You Have to login first!");
        return;
      }

      setWishlist((prev) => !prev);
      await axiosInstance.post("/website/specification/wishlist", { id: product._id });
    } catch (error) {
      handleError(error);
    }
  };
  console.log(user);

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
            href={`/specification/${category}/${product._id}`}
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
          className="text-red-500 transition-colors"
          aria-label="Add to favorites"
          onClick={handleWislisht}
        >
          <Heart className="h-5 w-5" fill={wishlist ? "red" : "transparent"} />
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

function SpecificationList() {
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState("popularity");
  const { category } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 25,
  });

  const getData = useCallback(
    async (loading = true, page = 1, sortBy = "popularity") => {
      try {
        setIsLoading(loading);
        const { data } = await axiosInstance.get(`/website/specification/${category}`, {
          params: { page, sortBy },
        });
        if (!data.error) {
          setData((prev) => (page == 1 ? data.data : [...prev, ...data.data]));
          setPagination(data.pagination);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [category]
  );
  console.log(pagination);

  useEffect(() => {
    getData();
  }, [getData]);

  const onPageChange = async (page) => {
    setFetching(true);
    await getData(false, page, activeTab);
    setFetching(false);
  };

  const onSortByChange = async (value) => {
    if (activeTab == value) return;
    setActiveTab(value);
    await getData(true, 1, value);
  };

  return (
    <Loading loading={isLoading}>
      <section className="container mx-auto bg-white">
        <div className="flex items-center gap-1  py-4">
          <h6>Home</h6>
          <Icon icon="basil:caret-right-solid" className="mt-[2px]" width="18" height="18" />
          <h6>{category.replaceAll("_", " ").replaceAll("%20", " ")}</h6>
        </div>

        <div>
          <h2 className="text-3xl font-bold  pb-3">{category.replaceAll("_", " ").replaceAll("%20", " ")}</h2>
        </div>
      </section>

      {/* <section className="py-6">
        <div className="flex  gap-2 lg:px-64 md:px-24 px-4 mb-4">
          <div className="h-6 w-6 mt-2  rounded-full bg-white border-[6px] border-red-600"></div>
          <h6 className="w-fit text-lg text-gray-700">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis aut recusandae nemo iusto id ea
            ipsum aliquid quisquam atque consectetur voluptatem minima similique sapiente corrupti eius,
            voluptatum quam! Mollitia corrupti quidem neque enim, repellat omnis aperiam eius deleniti magni
            libero possimus temporibus doloremque voluptates molestias quae tenetur! Illo quibusdam, est
            praesentium architecto alias quidem? Totam dignissimos nesciunt dolores nihil corporis reiciendis
            aliquid obcaecati aut expedita perferendis! Sed nobis cumque porro excepturi temporibus nemo ipsa
            atque quos! Reiciendis vitae harum vero a, officiis rerum consectetur similique iste, eum, iusto
            magnam itaque laborum quidem inventore molestias? Dignissimos corporis fuga facere autem sit!
          </h6>
        </div>
        <div className="flex  gap-2 lg:px-64 md:px-24 px-4 mb-4">
          <div className="h-6 w-6 mt-2  rounded-full bg-white border-[6px] border-red-600"></div>
          <h6 className="w-fit text-lg text-gray-700">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
            the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially unchanged.
          </h6>
        </div>
      </section> */}

      <section className="container mx-auto">
        <div className="grid grid-cols-12  md:gap-10">
          <div className=" col-span-12 ">
            <div className="w-full overflow-x-auto py-3 mt-5">
              <div className="flex items-center justify-between border-black gap-4 sm:gap-6 min-w-max">
                {/* Sort By Label */}
                <span className="text-lg sm:text-xl font-semibold text-black whitespace-nowrap">Sort By</span>

                {/* Sorting Buttons */}
                <div className="flex overflow-x-auto gap-4">
                  {[
                    { key: "popularity", label: "Popularity" },
                    { key: "latest", label: "Latest" },
                    { key: "highToLowPrice", label: "High Price" },
                    { key: "LowToHighPrice", label: "Low Price" },
                    { key: "name", label: "Name" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      className={`text-sm sm:text-lg font-medium transition ${
                        activeTab === key ? "text-black" : "text-gray-500 hover:text-black"
                      } whitespace-nowrap`}
                      onClick={() => onSortByChange(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="divider h-[2px]  w-full bg-black">
              <div className="w-24 bg-[#ff0000] h-full"></div>
            </div>
            <div className="grid grid-cols-4">
              {data.map((item) => (
                <SpecificationCard product={item} category={category} />
              ))}
            </div>

            {/* <div className="mt-4">
              {data.map((item, index) => (
                <div key={item._id}>
                  <SpecificationCard item={item} />
                  {(index + 1) % 3 === 0 && <HoverBanner padding="0px" />}
                </div>
              ))}
            </div> */}
            <div className="flex items-center justify-center my-5">
              {pagination.totalPages > pagination.currentPage && (
                <button
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  className="bg-red-500 px-4 py-2 text-white rounded-md  font-bold"
                >
                  {fetching ? "Loading" : "Load More"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Loading>
  );
}

export default SpecificationList;
