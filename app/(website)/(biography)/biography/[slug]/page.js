"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { biographyCategories } from "@/constant/data";

function BiographyCard({ celebrity, categoryColor }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link href={`/biography/${celebrity.id}`}>
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

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {celebrity.popular && (
                <span className={`bg-red-600 text-white text-xs px-2 py-1 rounded-full`}>Popular</span>
              )}
              {celebrity.trending && (
                <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">Trending</span>
              )}
            </div>

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
                <p className="font-medium">{celebrity.role || "Celebrity"}</p>
                <p className="text-white/80 text-sm">View biography</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg text-neutral-900">{celebrity.name}</h3>
            <div className="mt-2 flex items-center">
              <div className={`w-10 h-0.5 bg-red-600 mr-3`} />
              <p className="text-neutral-600">{celebrity.role || "Celebrity"}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BiographyDetailPage({ params }) {
  const allCelebrities = biographyCategories.flatMap((category) => category.items);
  const celebrity = allCelebrities.find((c) => c.id === parseInt(params.slug));

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

  const category = biographyCategories.find((cat) => cat.items.some((item) => item.id === celebrity.id));

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
                <span>{category?.title}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{celebrity.name}</h1>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${category?.color}-500`} />
                  <span className="text-white/90">{celebrity.role}</span>
                </div>

                {celebrity.rating && (
                  <div className="flex items-center gap-2 text-white/90">
                    <span>★</span>
                    <span>{celebrity.rating.toFixed(1)} Rating</span>
                  </div>
                )}

                {celebrity.popular && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">Popular</span>
                )}

                {celebrity.trending && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-sm">
                    Trending
                  </span>
                )}
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>

                <h3 className="text-xl font-semibold mb-4">Early Life</h3>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                  laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                  architecto beatae vitae dicta sunt explicabo.
                </p>

                <h3 className="text-xl font-semibold mb-4">Career</h3>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                  consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                </p>
              </div>

              {/* Timeline */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6">Career Timeline</h3>
                <div className="space-y-8">
                  {[2018, 2019, 2020, 2021].map((year) => (
                    <div key={year} className="relative pl-8 border-l-2 border-neutral-200">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-red-500" />
                      <div className="mb-2">
                        <span className="text-lg font-semibold text-neutral-900">{year}</span>
                      </div>
                      <p className="text-neutral-600">
                        Notable achievement or milestone in {celebrity.name}'s career during {year}.
                      </p>
                    </div>
                  ))}
                </div>
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
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Born</span>
                    <span className="text-neutral-900">January 1, 1990</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Nationality</span>
                    <span className="text-neutral-900">American</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Occupation</span>
                    <span className="text-neutral-900">{celebrity.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Years active</span>
                    <span className="text-neutral-900">2010-present</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                <div className="space-y-3">
                  <button className="w-full py-2 px-4 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors text-sm">
                    Follow on Instagram
                  </button>
                  <button className="w-full py-2 px-4 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors text-sm">
                    Follow on Twitter
                  </button>
                  <button className="w-full py-2 px-4 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors text-sm">
                    Subscribe on YouTube
                  </button>
                </div>
              </div>

              {/* Awards */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Awards & Achievements</h3>
                <div className="space-y-4">
                  {[2021, 2020, 2019].map((year) => (
                    <div key={year} className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
                      <div className="text-sm text-neutral-500 mb-1">{year}</div>
                      <div className="text-neutral-900">Prestigious Award Name</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Celebrities */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar {category?.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category?.items
              .filter((item) => item.id !== celebrity.id)
              .slice(0, 4)
              .map((item) => (
                <BiographyCard celebrity={item} />
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
