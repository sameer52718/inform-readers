"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

const FALLBACK_IMAGE = "/website/assets/images/fallback/news2.png";

function Offers() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [advertiserId, setAdvertiserId] = useState(searchParams.get("advertiserId") || "");
  const [advertiserName, setAdvertiserName] = useState(searchParams.get("advertiserName") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [startDatetime, setStartDatetime] = useState(searchParams.get("startDatetime") || "");
  const [endDatetime, setEndDatetime] = useState(searchParams.get("endDatetime") || "");
  const [isActive, setIsActive] = useState(searchParams.get("isActive") ?? "true");
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt");
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 12);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offers, setOffers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (advertiserId) params.set("advertiserId", advertiserId);
    if (advertiserName) params.set("advertiserName", advertiserName);
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (startDatetime) params.set("startDatetime", startDatetime);
    if (endDatetime) params.set("endDatetime", endDatetime);
    if (isActive !== "") params.set("isActive", String(isActive));
    if (sort) params.set("sort", sort);
    if (order) params.set("order", order);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    return params.toString();
  }, [
    advertiserId,
    advertiserName,
    status,
    type,
    startDatetime,
    endDatetime,
    isActive,
    sort,
    order,
    page,
    limit,
  ]);

  useEffect(() => {
    const url = `/coupons/offers?${queryString}`;
    router.replace(url, { scroll: false });
  }, [queryString, router]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axiosInstance.get(`/website/coupon/offer/filter`, {
          params: {
            advertiserId,
            advertiserName,
            status,
            type,
            startDatetime,
            endDatetime,
            isActive,
            page,
            limit,
            sort,
            order,
          },
        });
        if (!active) return;
        if (!data.error) {
          setOffers(Array.isArray(data.offers) ? data.offers : []);
          setPagination(data.pagination || { page: 1, limit, total: 0, totalPages: 0 });
        }
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load offers");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [
    advertiserId,
    advertiserName,
    status,
    type,
    startDatetime,
    endDatetime,
    isActive,
    page,
    limit,
    sort,
    order,
  ]);

  const onApplyFilters = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const onResetFilters = () => {
    setAdvertiserId("");
    setAdvertiserName("");
    setStatus("");
    setType("");
    setStartDatetime("");
    setEndDatetime("");
    setIsActive("true");
    setSort("createdAt");
    setOrder("desc");
    setPage(1);
    setLimit(12);
  };

  const canPrev = page > 1;
  const canNext = pagination.totalPages ? page < pagination.totalPages : false;

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-white text-3xl md:text-4xl font-bold">Offers</h1>
          <p className="text-white/90 mt-2">Filter current and upcoming offers</p>
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
                  placeholder="Search by advertiser name"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Advertiser ID</label>
                <input
                  type="number"
                  value={advertiserId}
                  onChange={(e) => setAdvertiserId(e.target.value)}
                  placeholder="e.g. 53905"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Start From</label>
                  <input
                    type="date"
                    value={startDatetime}
                    onChange={(e) => setStartDatetime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">End To</label>
                  <input
                    type="date"
                    value={endDatetime}
                    onChange={(e) => setEndDatetime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Per page</label>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Sort</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  >
                    <option value="createdAt">Created</option>
                    <option value="start_datetime">Start Date</option>
                    <option value="end_datetime">End Date</option>
                    <option value="name">Name</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Order</label>
                  <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
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
            {loading && <div className="text-center text-neutral-600">Loading offers...</div>}
            {error && <div className="text-center text-red-600">{error}</div>}

            {!loading && !error && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-neutral-600">
                    Showing page {pagination.page} of {pagination.totalPages || 1} • {pagination.total} total
                  </p>
                </div>

                {offers.length === 0 ? (
                  <div className="text-neutral-600">No offers found.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((o) => (
                      <div key={o._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="relative h-40">
                          <Image src={FALLBACK_IMAGE} alt={o.name || "Offer"} fill className="object-cover" />
                        </div>
                        <div className="p-5">
                          <div className="text-sm text-red-600 font-medium mb-1">{o.advertiser?.name}</div>
                          <h3 className="text-lg font-semibold mb-1">{o.name}</h3>
                          <p className="text-xs text-neutral-500 mb-2">
                            {o.type} • #{o.offer_number} • GOID {o.goid}
                          </p>
                          <p className="text-xs text-neutral-500 mb-3">
                            {o.status} • {o.advertiser?.network}
                          </p>
                          <p className="text-sm text-neutral-600 mb-4">
                            {o.start_datetime ? new Date(o.start_datetime).toLocaleDateString() : ""} - {""}
                            {o.end_datetime ? new Date(o.end_datetime).toLocaleDateString() : ""}
                          </p>
                          <div className="flex items-center justify-end">
                            <a
                              href={`https://rakutenadvertising.com/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-neutral-700 hover:bg-gray-200"
                            >
                              View More
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      disabled={!canPrev}
                      onClick={() => canPrev && setPage(page - 1)}
                      className="px-3 py-2 rounded-lg bg-gray-100 text-neutral-700 disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="text-sm text-neutral-600">
                      Page {page} / {pagination.totalPages}
                    </span>
                    <button
                      disabled={!canNext}
                      onClick={() => canNext && setPage(page + 1)}
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

export default function OffersPage() {
  return (
    <Suspense>
      <Offers />
    </Suspense>
  );
}
