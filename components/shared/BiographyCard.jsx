"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

function BiographyCard({ celebrity, category }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link href={`/biography/${celebrity.slug}`}>
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

export default BiographyCard;
