"use client";

import { useState, useEffect } from "react";
import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import {
  Globe2,
  MapPin,
  Navigation,
  Search,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// export const metadata = {
//   title: "Global Postal Code Directory | Country-wise ZIP & Format Guide",
//   description:
//     "Explore global postal codes and address formats. Find country-wise ZIP code systems for accurate international mail delivery.",
//   keywords: "postal codes, ZIP codes, address formats, country postal codes, international mailing",
//   openGraph: {
//     title: "Global Postal Code Directory",
//     description:
//       "Find postal codes and address formats for every country. Your ultimate guide to international ZIP code systems.",
//     url: "http://informreaders.com/postalcode",
//     siteName: "Global Postal Code Directory",
//     images: [
//       {
//         url: "http://informreaders.com/images/postal-code-og.jpg",
//         width: 1200,
//         height: 630,
//         alt: "World map with postal codes",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
// };

export default function PostalCode() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Client-side data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/common/country", {
          params: { groupCountry: true },
        });
        setData(res.data.error ? [] : res.data.response.groupCountry);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Flatten countries for search
  const allCountries = data.flatMap((item) => item.countries || []);

  // Filter countries based on search query
  const filteredCountries = allCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Enter a country name to explore its postal code system and format
            </p>
            <div className="mt-6 flex justify-center">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search for a country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-300 py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  aria-label="Search for a country by name"
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-6 max-w-3xl mx-auto">
              {isLoading ? (
                <p className="text-center text-gray-300">Loading...</p>
              ) : filteredCountries.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {filteredCountries.map((country) => (
                    <Link
                      href={`/postalcode/${country.countryCode}`}
                      key={country.countryCode}
                      className="group relative"
                    >
                      <div className="flex items-center rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
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
              ) : (
                <p className="text-center text-gray-300">No countries found matching "{searchQuery}"</p>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {!searchQuery && (
          <div className="mt-16 space-y-16">
            {isLoading ? (
              <p className="text-center text-gray-600">Loading countries...</p>
            ) : (
              data?.map((item) => (
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
                            <p className="font-medium text-gray-900 group-hover:text-red-600">
                              {country.name}
                            </p>
                            <p className="text-sm text-gray-500">Format: {country.countryCode}-####</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

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
