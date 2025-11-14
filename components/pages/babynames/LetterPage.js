"use client";

import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import Breadcrumb from "../specification/Breadcrumb";

const LetterTable = ({ searchQuery, searchTrigger }) => {
  const { letter } = useParams();
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 25,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async (loadingFlag = true, page = 1) => {
    try {
      setLoading(loadingFlag);
      const { data } = await axiosInstance.get("/website/name", {
        params: {
          initialLetter: letter.toUpperCase(),
          page,
          limit: 50,
          search: searchQuery,
        },
      });

      if (!data.error) {
        setData(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(true, 1);
  }, [letter, searchTrigger]);

  return (
    <section className="py-12">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-pink-500 p-6">
          <p className="text-white/80 mt-2">
            Browse baby names starting with <strong>{letter?.toUpperCase()}</strong>
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">NAME</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">MEANING</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-500">
                        No names found starting with "{letter?.toUpperCase()}"
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold mr-3">
                              {item?.name?.[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{item?.name}</p>
                              <p className="text-sm text-gray-500">{item?.origion || "Traditional"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600">{item?.shortMeaning || "---"}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/baby-names/${item?.slug}`}
                            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                          >
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {!loading && data.length > 0 && (
            <div className="mt-6 flex items-center justify-between px-4">
              <button
                onClick={() => getData(true, Math.max(1, pagination.currentPage - 1))}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => getData(true, Math.min(pagination.totalPages, pagination.currentPage + 1))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

function LetterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const { letter } = useParams();
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTrigger((prev) => prev + 1);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Baby Names", href: "/baby-names" },
    { label: `Names Starting with "${letter.toUpperCase()}"` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Baby Names Starting with Your Favorite Letter
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Explore meaningful names that start with any letter of your choice
            </p>

            {/* Search Bar */}
            <form className="max-w-2xl mx-auto" onSubmit={handleSearch}>
              <div className="relative">
                <button type="submit">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Search for a name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Letter Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={breadcrumbItems} />
        <LetterTable searchQuery={searchQuery} searchTrigger={searchTrigger} />
      </div>
    </div>
  );
}

export default LetterPage;
