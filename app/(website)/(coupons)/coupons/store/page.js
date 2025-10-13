"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

const FALLBACK_IMAGE = "/website/assets/images/fallback/news2.png";

function Merchants() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [advertiserId, setAdvertiserId] = useState(searchParams.get("advertiserId") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt");
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 12);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (advertiserId) params.set("advertiserId", advertiserId);
    if (sort) params.set("sort", sort);
    if (order) params.set("order", order);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    return params.toString();
  }, [name, advertiserId, sort, order, page, limit]);

  useEffect(() => {
    const url = `/coupons/store?${queryString}`;
    router.replace(url, { scroll: false });
  }, [queryString, router]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axiosInstance.get(`/website/merchant`, {
          params: { name, advertiserId, sort, order, page, limit },
        });
        if (!active) return;
        setMerchants(Array.isArray(data.merchants) ? data.merchants : []);
        setPagination(data.pagination || { page: 1, limit, total: 0, totalPages: 0 });
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load merchants");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [name, advertiserId, sort, order, page, limit]);

  const onApplyFilters = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const onResetFilters = () => {
    setName("");
    setAdvertiserId("");
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
          <h1 className="text-white text-3xl md:text-4xl font-bold">Merchants</h1>
          <p className="text-white/90 mt-2">Browse and filter merchant partners</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar filters */}
          <aside className="md:col-span-3 bg-white rounded-xl shadow-sm p-4 h-fit">
            <form onSubmit={onApplyFilters} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Search by name"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Advertiser ID</label>
                <input
                  type="number"
                  value={advertiserId}
                  onChange={(e) => setAdvertiserId(e.target.value)}
                  placeholder="e.g. 815"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
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
                    <option value="name">Name</option>
                    <option value="advertiserId">Advertiser ID</option>
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
            {loading && <div className="text-center text-neutral-600">Loading merchants...</div>}
            {error && <div className="text-center text-red-600">{error}</div>}

            {!loading && !error && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-neutral-600">
                    Showing page {pagination.page} of {pagination.totalPages || 1} • {pagination.total} total
                  </p>
                </div>

                {merchants.length === 0 ? (
                  <div className="text-neutral-600">No merchants found.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {merchants.map((m) => (
                      <div key={m._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="relative h-40">
                          <Image
                            src={FALLBACK_IMAGE}
                            alt={m.name || "Merchant"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-semibold">{m.name}</h3>
                            {m.can_partner && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Can partner
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mb-3">{m.contact?.country || ""}</p>
                          {m.description && (
                            <p className="text-sm text-neutral-600 line-clamp-3 mb-4">{m.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-500">ID: {m.advertiserId}</span>
                            {m.url && (
                              <a
                                href={m.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-neutral-700 hover:bg-gray-200"
                              >
                                Visit Store
                              </a>
                            )}
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

export default function MerchantsPage() {
  return (
    <Suspense>
      <Merchants />
    </Suspense>
  );
}
