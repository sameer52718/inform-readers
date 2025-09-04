"use client";

import Pagination from "@/components/ui/Pagination.js";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Navigation, Mail, Building2, MapPinned, Info, Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

function LocationTable({ data = [] }) {
  const { countryCode, region } = useParams();
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b bg-red-600">
              <th className="p-4 text-left text-sm font-medium text-white">Country</th>
              <th className="p-4 text-left text-sm font-medium text-white">Region/State/Province</th>
              <th className="p-4 text-left text-sm font-medium text-white">City/Area</th>
              <th className="p-4 text-left text-sm font-medium text-white">Postal Code</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.length > 0 ? (
              data.map((code) => (
                <tr key={code._id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm">{code?.countryId?.name}</td>
                  <td className="p-4 text-sm">{code?.state}</td>
                  <td className="p-4 text-sm">{code?.area || "---"}</td>
                  <td className="p-4">
                    <Link
                      href={`/postalcode/${countryCode}/${region}/${code?.slug}`}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PostalLanding() {
  const { countryCode, region } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 25,
  });

  const loadData = useCallback(
    async (loading = true, page = 1, search = "") => {
      try {
        setLoading(loading);
        const { data } = await axiosInstance.get("/website/postalCode", {
          params: { countryCode: countryCode, region, page, limit: 25, search },
        });
        if (!data.error) {
          console.log(data);

          setData(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    },
    [countryCode, region]
  );

  useEffect(() => {
    loadData(true, 1);
  }, [loadData]);

  const onPageChange = async (page) => {
    loadData(true, page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadData(true, 1, searchQuery);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 mb-4">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-center text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Postal Codes in {data?.country?.name}
          </h1>
          <p className="mx-auto my-6 max-w-2xl text-center text-lg text-white">
            Find postal codes for any location in {data?.country?.name}. Browse by region or search on the
            interactive map.
          </p>
          <form className="max-w-2xl mx-auto" onSubmit={handleSearch}>
            <div className="relative">
              <button type="submit">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </button>
              <input
                type="search"
                placeholder="Search for a code or city/area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Mail, title: "Total Areas", value: pagination.totalItems },
            { icon: Building2, title: "Regions", value: data?.regions?.length },
            { icon: MapPinned, title: "Cities", value: "350+" },
            { icon: Info, title: "Format", value: "#####" },
          ].map((stat, index) => (
            <div key={index} className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-3">
                  <stat.icon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Postal Codes Table */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">Postal Code Directory</h2>
        <LocationTable data={data?.postalCodes} />
        <div className="mt-8 flex justify-center">
          {/* Pagination */}
          {!loading && data?.postalCodes?.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      </div>
      {/* Regions Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">Regions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.regions?.map((region) => (
              <div
                key={region}
                className="flex transform items-center rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <div className="mr-4 rounded-full bg-red-100 p-2">
                  <Navigation className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-medium text-gray-900">{region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">About Postal Codes in {data?.country?.name}</h2>
            <div className="prose prose-lg">
              <p>
                Postal codes in {data?.country?.name} play a vital role in organizing and streamlining mail
                delivery across the nation. These unique identifiers help ensure accurate and efficient
                delivery of mail and packages to their intended destinations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900">Key Features of the Postal System</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>Five-digit numeric format (#####)</li>
                <li>First digit indicates the postal region or state</li>
                <li>Following digits specify districts and local post office areas</li>
                <li>Used by both domestic and international mail services</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900">Common Uses</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>Mail and package delivery</li>
                <li>Online shopping and e-commerce</li>
                <li>Geographic information systems</li>
                <li>Business registration and documentation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostalLanding;
