"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CouponDetailPage() {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const FALLBACK_IMAGE = "/website/assets/images/fallback/news2.png";

  useEffect(() => {
    async function fetchCoupon() {
      try {
        const { data } = await axiosInstance.get(`/website/coupon/${id}`);
        if (data && !data.error) {
          setCoupon(data.coupon);
        } else {
          setError("Coupon not found");
        }
      } catch (err) {
        setError("Failed to load coupon details");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCoupon();
  }, [id]);

  const handleCopy = () => {
    if (!coupon?.couponcode) return;
    navigator.clipboard.writeText(coupon.couponcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-20">{error}</div>;
  if (!coupon) return null;

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-2xl overflow-hidden"
        >
          {/* Header Image */}
          <div className="relative w-full h-64">
            <Image
              src={coupon.impressionpixel || FALLBACK_IMAGE}
              alt={coupon.offerdescription || "Coupon"}
              fill
              className="object-cover"
              onError={(e) => (e.target.src = FALLBACK_IMAGE)}
            />
          </div>

          {/* Content */}
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4 text-neutral-900">
              {coupon.offerdescription || "No Description"}
            </h1>

            <p className="text-sm text-neutral-500 mb-6">
              {coupon.advertisername ? `By ${coupon.advertisername}` : ""}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-neutral-600">
                  Valid from{" "}
                  <span className="font-medium">
                    {coupon.offerstartdate
                      ? new Date(coupon.offerstartdate).toLocaleDateString()
                      : "N/A"}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {coupon.offerenddate
                      ? new Date(coupon.offerenddate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </p>
              </div>

              {/* Copy Code */}
              {coupon.couponcode && (
                <button
                  onClick={handleCopy}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
                >
                  {copied ? "Copied!" : `Copy Code: ${coupon.couponcode}`}
                </button>
              )}
            </div>

            {/* Optional link */}
            {coupon.clickurl && (
              <a
                href={coupon.clickurl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-red-600 hover:text-red-700 font-medium mb-6"
              >
                Visit Offer →
              </a>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-neutral-700">
              <div>
                <p>
                  <span className="font-semibold">Promotion Type:</span>{" "}
                  {coupon.promotiontypes?.promotiontype || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Advertiser ID:</span>{" "}
                  {coupon.advertiserid || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Language:</span>{" "}
                  {coupon.language || "N/A"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Reference:</span>{" "}
                  {coupon.refrence}
                </p>
                <p>
                  <span className="font-semibold">Targeted Countries:</span>{" "}
                  {coupon.targetedCountries || "Global"}
                </p>
                <p>
                  <span className="font-semibold">Commission:</span>{" "}
                  {coupon.saleCommission || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
