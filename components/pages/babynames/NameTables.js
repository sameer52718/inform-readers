"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Search, ChevronRight, Users, Baby, Heart, BookOpen } from "lucide-react";
import Breadcrumb from "../specification/Breadcrumb";

const AlphabetSelector = ({ currentLetter, onLetterChange }) => {
  const alphabet = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {alphabet.map((letter) => (
        <button
          key={letter}
          onClick={() => onLetterChange(letter)}
          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
            currentLetter === letter
              ? "bg-red-600 text-white scale-110"
              : "bg-white hover:bg-red-50 text-gray-700 hover:text-red-600"
          }`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

const NameTable = ({ gender, searchQuery, searchTrigger }) => {
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 25,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLetter, setInitialLetter] = useState("A");

  const getData = async (loading = true, page = 1, initialLetter = "A") => {
    try {
      setLoading(loading);
      const { data } = await axiosInstance.get("/website/name", {
        params: { gender, initialLetter, page, limit: 25, search: searchQuery },
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
    getData(true, 1, initialLetter);
  }, [searchTrigger]);

  return (
    <section className="py-12">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-pink-500 p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            {gender === "MALE" ? (
              <>
                <Baby className="w-8 h-8" />
                Boy Names
              </>
            ) : (
              <>
                <Heart className="w-8 h-8" />
                Girl Names
              </>
            )}
          </h2>
          <p className="text-white/80 mt-2">
            Browse through our collection of beautiful {gender === "MALE" ? "boy" : "girl"} names
          </p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Select a letter to begin:</h3>
            <AlphabetSelector
              currentLetter={initialLetter}
              onLetterChange={(letter) => {
                setInitialLetter(letter);
                getData(true, 1, letter);
              }}
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full  divide-y divide-gray-200">
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
                        No data available.
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
                onClick={() => getData(true, Math.max(1, pagination.currentPage - 1), initialLetter)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  getData(true, Math.min(pagination.totalPages, pagination.currentPage + 1), initialLetter)
                }
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

export default function NameMeaning() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const [showAllReligions, setShowAllReligions] = useState(false);
  const visibleReligions = showAllReligions ? data : data.slice(0, 8);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get("/common/category", { params: { type: "Name" } });
        if (!data.error) {
          setData(data.categories || []);
        }
      } catch (error) {
        handleError(error);
      }
    };
    getData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTrigger((prev) => prev + 1);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Baby Names", href: "/baby-names" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find the Perfect Name for Your Baby
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Explore thousands of meaningful names from different cultures and traditions
            </p>

            {/* Search Bar */}
            <form className="max-w-2xl mx-auto" onSubmit={handleSearch}>
              <div className="relative">
                <button type="submit">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </button>
                <input
                  type="search"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Religion Categories */}
        <Breadcrumb items={breadcrumbItems} />
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-red-600" />
              Browse Names by Religion
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleReligions.map((item, index) => (
              <Link
                key={index}
                href={`/baby-names/religion/${item.slug}`}
                className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-6">
                  <BookOpen className="w-6 h-6 text-red-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 group-hover:text-red-600 text-xl transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Explore {item.name} names</p>
                </div>
              </Link>
            ))}
          </div>

          {data.length > 8 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllReligions(!showAllReligions)}
                className="text-red-600 font-semibold hover:underline"
              >
                {showAllReligions ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </section>

        {/* Name Tables */}
        <NameTable gender="MALE" searchQuery={searchQuery} searchTrigger={searchTrigger} />
        <NameTable gender="FEMALE" searchQuery={searchQuery} searchTrigger={searchTrigger} />
      </div>
    </div>
  );
}
