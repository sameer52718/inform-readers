"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

const FALLBACK_IMAGE = "/website/assets/images/fallback/news2.png";

function AdvertisementsList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter states
  const [advertiserName, setAdvertiserName] = useState(searchParams.get("advertiserName") || "");
  const [programName, setProgramName] = useState(searchParams.get("programName") || "");
  const [relationshipStatus, setRelationshipStatus] = useState(searchParams.get("relationshipStatus") || "");
  const [language, setLanguage] = useState(searchParams.get("language") || "");
  const [performanceIncentives, setPerformanceIncentives] = useState(
    searchParams.get("performanceIncentives") || ""
  );
  const [startDatetime, setStartDatetime] = useState(searchParams.get("startDatetime") || "");
  const [endDatetime, setEndDatetime] = useState(searchParams.get("endDatetime") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt");
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 12);

  // Data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [advertisements, setAdvertisements] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (advertiserName) params.set("advertiserName", advertiserName);
    if (programName) params.set("programName", programName);
    if (relationshipStatus) params.set("relationshipStatus", relationshipStatus);
    if (language) params.set("language", language);
    if (performanceIncentives) params.set("performanceIncentives", performanceIncentives);
    if (startDatetime) params.set("startDatetime", startDatetime);
    if (endDatetime) params.set("endDatetime", endDatetime);
    if (sort) params.set("sort", sort);
    if (order) params.set("order", order);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    return params.toString();
  }, [
    advertiserName,
    programName,
    relationshipStatus,
    language,
    performanceIncentives,
    startDatetime,
    endDatetime,
    sort,
    order,
    page,
    limit,
  ]);

  useEffect(() => {
    const url = `/coupons/advertisements?${queryString}`;
    router.replace(url, { scroll: false });
  }, [queryString, router]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axiosInstance.get(`/website/coupon/advertisement/filter`, {
          params: {
            advertiserName,
            programName,
            relationshipStatus,
            language,
            performanceIncentives,
            startDatetime,
            endDatetime,
            page,
            limit,
            sort,
            order,
          },
        });
        if (!active) return;
        if (!data.error) {
          setAdvertisements(Array.isArray(data.data) ? data.data : []);
          setPagination(data.pagination || { page: 1, limit, total: 0, totalPages: 0 });
        }
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load advertisements");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [queryString]);

  const onApplyFilters = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const onResetFilters = () => {
    setAdvertiserName("");
    setProgramName("");
    setRelationshipStatus("");
    setLanguage("");
    setPerformanceIncentives("");
    setStartDatetime("");
    setEndDatetime("");
    setSort("createdAt");
    setOrder("desc");
    setPage(1);
    setLimit(12);
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl text-white md:text-4xl font-bold">Advertisements</h1>
          <p className="text-white/90 mt-2">Browse and filter advertisements</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar filters */}
          <aside className="md:col-span-3 bg-white rounded-xl shadow-sm p-4 h-fit">
            <form onSubmit={onApplyFilters} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Advertiser Name</label>
                <input
                  type="text"
                  value={advertiserName}
                  onChange={(e) => setAdvertiserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  placeholder="Enter Advertiser Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Program Name</label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  placeholder="Enter Program Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Performance Incentives
                </label>
                <select
                  value={performanceIncentives}
                  onChange={(e) => setPerformanceIncentives(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDatetime}
                    onChange={(e) => setStartDatetime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDatetime}
                    onChange={(e) => setEndDatetime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="px-4 py-2 rounded-lg text-neutral-700 bg-gray-100 hover:bg-gray-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </aside>

          {/* Results grid */}
          <section className="md:col-span-9">
            {loading && <div className="text-center text-neutral-600">Loading advertisements...</div>}
            {error && <div className="text-center text-red-600">{error}</div>}

            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advertisements.map((ad) => (
                    <div key={ad._id} className="bg-white rounded-xl shadow-sm overflow-hidden border">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{ad.advertiserName}</h3>
                            <div className="text-sm text-red-600 font-medium">
                              {ad.primaryCategory?.parent} • {ad.primaryCategory?.child}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              ad.accountStatus === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {ad.accountStatus}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span>Network Rank:</span>
                            <span className="font-medium">{ad.networkRank || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <span>7 Day EPC:</span>
                            <span className="font-medium">${ad.sevenDayEpc}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>3 Month EPC:</span>
                            <span className="font-medium">${ad.threeMonthEpc}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex gap-2">
                            {ad.mobileTrackingCertified && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Mobile Certified
                              </span>
                            )}
                            {ad.cookielessTrackingEnabled && (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                Cookieless
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-6 text-end">
                          <a
                            href={ad.programUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-800 text-white hover:bg-red-700"
                          >
                            Visit Store
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="px-3 py-2 rounded-lg bg-gray-100 text-neutral-700 disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="text-sm text-neutral-600">
                      Page {page} / {pagination.totalPages}
                    </span>
                    <button
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-3 py-2 rounded-lg bg-gray-100 text-neutral-700 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default function AdvertisementsPage() {
  return (
    <Suspense>
      <AdvertisementsList />
    </Suspense>
  );
}
