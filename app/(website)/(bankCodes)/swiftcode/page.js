"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Globe2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function fetchData() {
  try {
    const { data } = await axiosInstance.get("/common/country", {
      params: { groupCountry: true },
    });
    return data.error ? [] : data.response.groupCountry;
  } catch (error) {
    handleError(error);
    return [];
  }
}

export default async function PostalCode() {
  const data = await fetchData();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdBanner />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Globe2 className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            World <span className="text-red-600">Bank Swift</span> Codes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Access SWIFT codes for banks worldwide. Quick and easy international banking information at your
            fingertips.
          </p>
        </div>

        {/* Content */}
        <div className="mt-16 space-y-16">
          {data?.map((item) => (
            <div key={item._id} className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{item._id}</h2>
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                  {item.countries?.length} Countries
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {item?.countries?.map((country) => (
                  <Link
                    href={`/swiftcode/${country.countryCode}`}
                    key={country.countryCode}
                    className="group relative"
                  >
                    <div className="flex transform items-center rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                        <Image
                          src={country.flag}
                          alt={`${country.name} flag`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-red-600">{country.name}</p>
                        <p className="text-sm text-gray-500">{country.countryCode}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-24 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-12 sm:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why Use Our SWIFT Code Directory?
            </h2>
            <p className="mt-4 text-lg text-red-100">
              Everything you need to process international bank transfers, all in one place.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Comprehensive Coverage",
                description: "Access SWIFT codes for banks across multiple countries and territories.",
              },
              {
                title: "Always Updated",
                description: "Our database is regularly updated to ensure accuracy and reliability.",
              },
              {
                title: "Easy Navigation",
                description: "Find the SWIFT code you need quickly with our intuitive interface.",
              },
            ].map((feature, index) => (
              <div key={index} className="rounded-xl bg-white/10 p-6 text-center backdrop-blur-lg">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-red-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <HoverBanner />
        </div>
      </div>
    </div>
  );
}
