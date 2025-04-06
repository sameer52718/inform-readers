"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import Pagination from "@/components/ui/Pagination.js";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Building2, Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

function LocationTable({ data = [] }) {
  const { countryCode } = useParams();
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b bg-red-600">
              <th className="p-4 text-left text-sm font-medium text-white">Bank</th>
              <th className="p-4 text-left text-sm font-medium text-white">City</th>
              <th className="p-4 text-left text-sm font-medium text-white">Branch</th>
              <th className="p-4 text-left text-sm font-medium text-white">Swift Code</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.length > 0 ? (
              data.map((code, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 text-sm">{code?.bank}</td>
                  <td className="p-4 text-sm">{code?.city}</td>
                  <td className="p-4 text-sm">{code?.branch || "---"}</td>
                  <td className="p-4">
                    <Link
                      href={`/swiftcode/${countryCode}/${code?.swiftCode}`}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      {code?.swiftCode}
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
  const { countryCode } = useParams();
  const [bankCodes, setBankCodes] = useState([]);
  const [search, setSearch] = useState("");
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
        const { data } = await axiosInstance.get("/website/bankCode", {
          params: { countryCode: countryCode, page, limit: 25, search },
        });
        if (!data.error) {
          setBankCodes(data.bankCodes);
          setPagination(data.pagination);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    },
    [countryCode]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onPageChange = async (page) => {
    loadData(true, page);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    loadData(true, 1, search);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdBanner />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Building2 className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Bank Swift Codes Directory
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Search through our comprehensive database of bank SWIFT codes
          </p>
        </div>

        {/* Search Section */}
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="search"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Enter bank name to search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8">
          <HoverBanner />
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
                <span className="text-sm text-gray-500">
                  Showing {bankCodes.length} of {pagination.totalItems} results
                </span>
              </div>
              <LocationTable data={bankCodes} />
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && bankCodes.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-center text-2xl font-bold text-gray-900">Why Use Our SWIFT Code Directory?</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Comprehensive Database",
                description: "Access SWIFT codes for banks worldwide",
              },
              {
                title: "Real-time Updates",
                description: "Our database is regularly updated for accuracy",
              },
              {
                title: "Easy Search",
                description: "Find any bank's SWIFT code in seconds",
              },
            ].map((feature, index) => (
              <div key={index} className="rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <HoverBanner />
        </div>
      </div>
    </div>
  );
}

export default PostalLanding;
