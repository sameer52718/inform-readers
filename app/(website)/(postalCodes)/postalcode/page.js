"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Globe2, MapPin, Navigation, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function PostalCode() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axiosInstance.get("/common/country", {
          params: { groupCountry: true },
        });
        setData(data.error ? [] : data.response.groupCountry);
      } catch (error) {
        handleError(error);
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdBanner />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <MapPin className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Global <span className="text-red-600">Postal Code</span> Directory
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Access postal codes and addressing formats for countries worldwide. Your comprehensive guide to
            international addressing systems.
          </p>
        </div>

        {/* Search Banner */}
        <div className="mt-12 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Find Postal Codes by Country</h2>
            <p className="mt-2 text-gray-300">
              Select your desired country below to explore its postal code system and format
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-16 space-y-16">
          {data?.map((item) => (
            <div key={item._id} className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{item._id}</h2>
                <div className="flex items-center gap-2">
                  <Globe2 className="h-5 w-5 text-red-600" />
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                    {item.countries?.length} Countries
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {item?.countries?.map((country) => (
                  <Link
                    href={`/postalcode/${country.countryCode}`}
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
                        <p className="text-sm text-gray-500">Format: {country.countryCode}-####</p>
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
              Understanding Postal Codes
            </h2>
            <p className="mt-4 text-lg text-red-100">
              Your guide to worldwide postal code systems and addressing formats
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Global Coverage",
                description: "Access postal codes and formats for countries worldwide.",
                icon: Globe2,
              },
              {
                title: "Accurate Navigation",
                description: "Precise location identification for efficient mail delivery.",
                icon: Navigation,
              },
              {
                title: "Easy Search",
                description: "Find postal codes and formats quickly with our intuitive interface.",
                icon: Search,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-xl bg-white/10 p-6 text-center backdrop-blur-lg"
              >
                <feature.icon className="h-8 w-8 text-white" />
                <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-red-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guide */}
        <div className="mt-24 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-center text-3xl font-bold text-gray-900">How to Use Postal Codes</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Find Your Area",
                description:
                  "Select your country and navigate to specific regions or cities to find the correct postal code.",
              },
              {
                title: "Verify Format",
                description:
                  "Check the correct format for your selected country to ensure proper mail delivery.",
              },
              {
                title: "Complete Address",
                description: "Use the postal code as part of a complete address for accurate mail routing.",
              },
            ].map((step, index) => (
              <div key={index} className="rounded-xl border border-gray-200 p-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
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
