"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import Loading from "@/components/ui/Loading";

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

export default function BiographyDetailPage() {
  const { slug } = useParams();
  const [celebrity, setCelebrity] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/website/biography/detail/${slug}`);
        if (!data.error) {
          setCelebrity(data?.biography);
          setRelated(data?.related);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();

    return () => {
      setIsLoading(true);
      setCelebrity(null);
      setRelated([]);
    };
  }, [slug]);

  if (isLoading) {
    return <Loading loading={true} />;
  }

  if (!celebrity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Biography not found</h1>
          <Link href="/biography" className="text-red-600 hover:text-red-700">
            Return to Biographies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image src={celebrity.image} alt={celebrity.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 text-white/80 mb-4">
                <Link href="/biography" className="hover:text-white">
                  Biographies
                </Link>
                <span>→</span>
                <span>{celebrity?.categoryId?.name}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{celebrity.name}</h1>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-red-500`} />
                  <span className="text-white/90">{celebrity?.categoryId?.name}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Biography</h2>
              <div className="prose max-w-none">
                <p className="text-neutral-600 leading-relaxed mb-6">
                  {celebrity?.description || "No Description Available"}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Quick Facts */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
                <div className="space-y-4">
                  {celebrity?.generalInformation?.map((item) => (
                    <div className="flex justify-between gap-4" key={item._id}>
                      <span className="text-neutral-500 whitespace-nowrap">{item?.name}</span>
                      <span className="text-neutral-900 text-end">{item?.value || "---"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Celebrities */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar {celebrity?.categoryId?.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.slice(0, 4).map((item) => (
              <BiographyCard celebrity={item} key={item?._id} category={celebrity?.categoryId?.name} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
