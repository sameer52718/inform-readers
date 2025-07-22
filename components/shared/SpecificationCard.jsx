"use client";

import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
const SpecificationCard = ({ product, category, categoryId }) => {
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

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="relative p-3 pb-2">
        <Link
          href={`/specification/${categoryId}/${product._id}`}
          className="block overflow-hidden rounded-lg"
        >
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
            href={`/specification/${categoryId}/${product._id}`}
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
          {product.price} {product.priceSymbol}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SpecificationCard;
