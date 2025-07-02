"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Globe2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PostalCode() {
  const { t } = useTranslation(); // Empty namespace as instructed
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/common/country", {
          params: { groupCountry: true },
        });
        setData(data.error ? [] : data.response.groupCountry);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    }
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
            <Globe2 className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="text-red-600">{t("swiftcode.heroTitle")}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{t("swiftcode.heroDescription")}</p>
        </div>

        {/* Search Banner */}
        <div className="mt-12 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("swiftcode.searchTitle")}</h2>
            <p className="mt-2 text-gray-300">{t("swiftcode.searchDescription")}</p>
            <div className="mt-6 flex justify-center">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder={t("swiftcode.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-300 py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  aria-label={t("swiftcode.searchAriaLabel")}
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-6 max-w-3xl mx-auto">
              {isLoading ? (
                <p className="text-center text-gray-300">{t("swiftcode.loading")}</p>
              ) : filteredCountries.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {filteredCountries.map((country) => (
                    <Link
                      href={`/swiftcode/${country.countryCode}`}
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
                          <p className="text-sm text-gray-500">{country.countryCode}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-300">
                  {t("swiftcode.noResults").replace("{searchQuery}", searchQuery)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {!searchQuery && (
          <div className="mt-16 space-y-16">
            {isLoading ? (
              <p className="text-center text-gray-600">{t("swiftcode.loading")}</p>
            ) : (
              data?.map((item) => (
                <div key={item._id} className="rounded-3xl bg-white p-8 shadow-lg">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{item._id}</h2>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                      {t("swiftcode.countriesCount").replace("{count}", item.countries?.length)}
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
                            <p className="font-medium text-gray-900 group-hover:text-red-600">
                              {country.name}
                            </p>
                            <p className="text-sm text-gray-500">{country.countryCode}</p>
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
              {t("swiftcode.featuresTitle")}
            </h2>
            <p className="mt-4 text-lg text-red-100">{t("swiftcode.featuresDescription")}</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t("swiftcode.features", { returnObjects: true }).map((feature, index) => (
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
