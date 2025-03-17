"use client";
import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import Pagination from "@/components/ui/Pagination";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

function LocationTable({ data = [] }) {
  const { countryCode } = useParams();
  return (
    <div className="p-3 border border-black bg-gray-300 rounded-lg w-full overflow-x-auto">
      <table className="w-full min-w-max border-collapse">
        <thead>
          <tr className="bg-red-500 text-white text-sm sm:text-base">
            <th className="p-2 text-left">Bank</th>
            <th className="p-2 text-left">City</th>
            <th className="p-2 text-left">Branch</th>
            <th className="p-2 text-left">Swift Code</th>
          </tr>
        </thead>
        <tbody className="bg-gray-300 text-sm sm:text-base">
          {data.length > 0 ? (
            data.map((code, index) => (
              <tr key={index} className="even:bg-gray-200">
                <td className="p-2">{code?.bank}</td>
                <td className="p-2">{code?.city}</td>
                <td className="p-2">{code?.branch || "---"}</td>
                <td className="p-2 text-red-500 font-bold underline">
                  <Link href={`/swift-code/${countryCode}/${code?.swiftCode}`}>{code?.swiftCode}</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-600">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
    if (!search.trim()) {
      return;
    }
    console.log("submitted");

    loadData(true, 1, search);
  };

  return (
    <div>
      <AdBanner />
      <div className="container mx-auto md:px-44 px-4 py-8">
        <form className="bg-gray-800 px-2 p-2 rounded-md w-full flex gap-3" onSubmit={handleSubmit}>
          <div className="flex-1">
            <input
              type="search"
              className="w-full h-full rounded-md py-1 px-4"
              placeholder="Enter Bank name to Search"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <button className="flex w-full items-center justify-center sm:justify-between space-x-2 bg-white text-red-600 px-4 py-3 sm:py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-all">
              <span className="font-semibold">Search</span>
              <Image src="/website/assets/images/icons/search.png" width={24} height={24} alt="search icon" />
            </button>
          </div>
        </form>

        <div className="py-8">
          <HoverBanner />
        </div>

        {loading ? (
          <div className="text-center text-lg font-semibold py-8">Loading...</div>
        ) : (
          <LocationTable data={bankCodes} />
        )}

        <div className="flex items-center justify-center my-5">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>

        <div className="py-8">
          <HoverBanner />
        </div>
      </div>
    </div>
  );
}

export default PostalLanding;
