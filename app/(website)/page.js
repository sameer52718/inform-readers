"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Globe2, Search } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import Loading from "@/components/ui/Loading";
import AdBanner from "@/components/partials/AdBanner";
import PageWrapper from "@/components/shared/PageWrapper";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/website/home");
        setData(data.data);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <Loading loading={isLoading}>
      <PageWrapper
        title={"Global Information Hub - All in One || Inform Readers"}
        description="Discover software, name meanings, postal & bank codes from around the world."
      >
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 text-white">
            <div className="container mx-auto px-4 py-16 md:py-24">
              <div className="max-w-3xl mx-auto text-center">
                <Globe2 className="w-16 h-16 mx-auto mb-6 text-red-100 animate-pulse" />
                <h1 className="text-4xl md:text-5xl text-white font-bold mb-4 leading-tight">
                  Global Information Hub
                </h1>
                <p className="text-lg md:text-xl text-red-100 mb-8">
                  Discover software, explore name meanings, and access postal & bank codes all in one place.
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 pb-16">
            {/* Software Section */}
            <section className="py-16">
              <div className="flex flex-col md:flex-row  justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Software</h2>
                  <p className="text-gray-600">Discover powerful tools for your digital needs</p>
                </div>
                <Link
                  href="/software"
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                >
                  View All Software
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.randomSoftware?.map((software) => (
                  <Link
                    href={`/software/${software._id}`}
                    key={software._id}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-100 transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="bg-gray-50 p-4 rounded-xl mb-5 w-24 h-24 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <Image
                          src={software.logo}
                          alt={software.name}
                          width={64}
                          height={64}
                          className="rounded-lg object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-center mb-3 text-gray-900">
                        {software.name}
                      </h3>
                      <p className="text-gray-600 text-center mb-4 line-clamp-2">{software.overview}</p>
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-full font-medium">
                          v{software.version}
                        </span>
                        {software.tag.slice(0, 2).map((t) => (
                          <span key={t} className="px-3 py-1 bg-gray-50 text-gray-700 text-sm rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* <AdBanner /> */}

            {/* Names Section */}
            <section className="py-16">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-pink-500 p-8">
                  <div className="flex flex-col md:flex-row  justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Name Meanings</h2>
                      <p className="text-red-100">Browse through our collection of beautiful names</p>
                    </div>
                    <Link
                      href="/name-meaning"
                      className="flex items-center gap-2 text-white hover:text-red-100 transition-colors duration-200"
                    >
                      View All Names
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                <div className="p-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">NAME</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">MEANING</th>
                          <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">
                            DETAILS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.randomNames?.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold mr-4">
                                  {item?.name?.[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{item?.name}</p>
                                  <p className="text-sm text-gray-500">{item?.origion || "Traditional"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <p className="text-gray-600">{item?.shortMeaning || "---"}</p>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <Link
                                href={`/name-meaning/${item?._id}`}
                                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium group"
                              >
                                View Details
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* <AdBanner /> */}

            {/* Postal Codes Section */}
            <section className="py-16">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex flex-col md:flex-row  justify-between items-center border-b border-gray-200 pb-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Postal Codes</h2>
                    <p className="text-gray-600">Find postal codes for countries worldwide</p>
                  </div>
                  <Link
                    href="/postalcode"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    View All Codes
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.postalCodeCountry?.map((country) => (
                    <Link
                      href={`/postalcode/${country.countryCode}`}
                      key={country.countryCode}
                      className="group"
                    >
                      <div className="flex items-center p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-red-100 transition-all duration-200">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                          <Image
                            src={country.flag}
                            alt={`${country.name} flag`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                            {country.name}
                          </p>
                          <p className="text-sm text-gray-500">Format: {country.countryCode}-####</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* <AdBanner /> */}

            {/* Bank Codes Section */}
            <section className="py-16">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex flex-col md:flex-row  justify-between items-center border-b border-gray-200 pb-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Bank Swift Codes</h2>
                    <p className="text-gray-600">Access international bank identification codes</p>
                  </div>
                  <Link
                    href="/swiftcode"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    View All Codes
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.bankCodeCountry?.map((country) => (
                    <Link
                      href={`/swiftcode/${country.countryCode}`}
                      key={country.countryCode}
                      className="group"
                    >
                      <div className="flex items-center p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-red-100 transition-all duration-200">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                          <Image
                            src={country.flag}
                            alt={`${country.name} flag`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                            {country.name}
                          </p>
                          <p className="text-sm text-gray-500">{country.countryCode}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            <AdBanner />
          </div>
        </div>
      </PageWrapper>
    </Loading>
  );
}
