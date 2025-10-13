"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [offers, setOffers] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axiosInstance("/website/coupon/get/home");
        if (!data.error) {
          setCoupons(Array.isArray(data.coupons) ? data.coupons : []);
          setOffers(Array.isArray(data.offers) ? data.offers : []);
          setMerchants(Array.isArray(data.merchants) ? data.merchants : []);
          setAdvertisements(Array.isArray(data.advertisements) ? data.advertisements : []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const copyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const FALLBACK_IMAGE = "/website/assets/images/fallback/news2.png";

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCoupons = coupons.filter((c) => {
    if (!normalizedQuery) return true;
    return (
      (c.offerdescription || "").toLowerCase().includes(normalizedQuery) ||
      (c.advertisername || "").toLowerCase().includes(normalizedQuery) ||
      (c.couponcode || "").toLowerCase().includes(normalizedQuery)
    );
  });
  const filteredOffers = offers.filter((o) => {
    if (!normalizedQuery) return true;
    return (
      (o.name || "").toLowerCase().includes(normalizedQuery) ||
      ((o.advertiser && o.advertiser.name) || "").toLowerCase().includes(normalizedQuery) ||
      (o.type || "").toLowerCase().includes(normalizedQuery)
    );
  });
  const filteredMerchants = merchants.filter((m) => {
    if (!normalizedQuery) return true;
    return (
      (m.name || "").toLowerCase().includes(normalizedQuery) ||
      (m.description || "").toLowerCase().includes(normalizedQuery) ||
      ((m.contact && m.contact.country) || "").toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl text-white md:text-5xl font-bold mb-6">Latest Deals & Coupons</h1>
              <p className="text-xl text-white mb-8">
                Save money with our hand-picked deals and discount codes
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-neutral-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading && <div className="text-center text-neutral-600">Loading...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}

        {!loading && !error && (
          <>
            {/* Coupons */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Coupons</h2>
                <a
                  href="/coupons/list"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-neutral-700 hover:bg-neutral-200"
                >
                  View More
                </a>
              </div>
              {filteredCoupons.length === 0 ? (
                <div className="text-neutral-600">No coupons found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCoupons.map((c) => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="relative h-40">
                        <Image
                          src={FALLBACK_IMAGE}
                          alt={c.offerdescription || "Coupon"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-red-600 font-medium mb-2">{c.advertisername}</div>
                        <h3 className="text-lg font-semibold mb-2">{c.offerdescription}</h3>
                        <p className="text-neutral-500 text-sm mb-4">
                          {c.offerstartdate ? new Date(c.offerstartdate).toLocaleDateString() : ""} - {""}
                          {c.offerenddate ? new Date(c.offerenddate).toLocaleDateString() : ""}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          {c.couponcode ? (
                            <button
                              onClick={() => copyCode(c.couponcode)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              {copiedCode === c.couponcode ? "Copied!" : c.couponcode}
                            </button>
                          ) : (
                            <span className="text-sm text-neutral-500">No code needed</span>
                          )}
                          {c.clickurl && (
                            <a
                              href={c.clickurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-neutral-700 hover:bg-neutral-200"
                            >
                              View More
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {/* Offers */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Offers</h2>
                <Link
                  href="/coupons/offers"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-neutral-700 hover:bg-neutral-200"
                >
                  View More
                </Link>
              </div>
              {filteredOffers.length === 0 ? (
                <div className="text-neutral-600">No offers found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOffers.map((o) => (
                    <motion.div
                      key={o._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="relative h-40">
                        <Image src={FALLBACK_IMAGE} alt={o.name || "Offer"} fill className="object-cover" />
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-red-600 font-medium mb-2">{o.advertiser?.name}</div>
                        <h3 className="text-lg font-semibold mb-2">{o.name}</h3>
                        <p className="text-neutral-500 text-sm mb-4">
                          {o.type} • {o.offer_number}
                        </p>
                        <p className="text-neutral-500 text-sm mb-4">
                          {o.start_datetime ? new Date(o.start_datetime).toLocaleDateString() : ""} - {""}
                          {o.end_datetime ? new Date(o.end_datetime).toLocaleDateString() : ""}
                        </p>
                        <div className="flex items-center justify-end">
                          <a
                            href={`https://rakutenadvertising.com/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-neutral-700 hover:bg-neutral-200"
                          >
                            View More
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {/* Merchants */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Merchants</h2>
                <Link
                  href="/coupons/store"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-neutral-700 hover:bg-neutral-200"
                >
                  View More
                </Link>
              </div>
              {filteredMerchants.length === 0 ? (
                <div className="text-neutral-600">No merchants found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMerchants.map((m) => (
                    <motion.div
                      key={m._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="relative h-40">
                        <Image
                          src={FALLBACK_IMAGE}
                          alt={m.name || "Merchant"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-red-600 font-medium mb-2">
                          {m.contact?.country || ""}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{m.name}</h3>
                        {m.description && (
                          <p className="text-neutral-600 text-sm mb-4 line-clamp-3">{m.description}</p>
                        )}
                        <div className="flex items-center justify-end">
                          {m.url && (
                            <a
                              href={m.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-neutral-700 hover:bg-neutral-200"
                            >
                              Visit Store
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {/* Advertisements */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Featured Advertisements</h2>
                <Link
                  href="/coupons/advertisements"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-neutral-700 hover:bg-neutral-200"
                >
                  View More
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advertisements.map((ad) => (
                  <motion.div
                    key={ad._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{ad.advertiserName}</h3>
                          <div className="text-sm text-red-600 font-medium">
                            {ad.primaryCategory?.parent} • {ad.primaryCategory?.child}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ad.accountStatus === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ad.accountStatus}
                        </span>
                      </div>


                      <div className="text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span>Network Rank:</span>
                          <span className="font-medium">{ad.networkRank || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span>7 Day EPC:</span>
                          <span className="font-medium">${ad.sevenDayEpc}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>3 Month EPC:</span>
                          <span className="font-medium">${ad.threeMonthEpc}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          {ad.mobileTrackingCertified && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Mobile Certified
                            </span>
                          )}
                          {ad.cookielessTrackingEnabled && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              Cookieless
                            </span>
                          )}
                        </div>
                        <a
                          href={ad.programUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-red-800 text-white hover:bg-red-700"
                        >
                          Visit Store
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
