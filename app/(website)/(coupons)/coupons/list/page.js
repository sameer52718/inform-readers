"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

const FALLBACK_IMAGE = "/website/assets/images/fallback/news2.png";

function CouponsList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [subCategoryId, setSubCategoryId] = useState(searchParams.get("subCategoryId") || "");
  const [offerstartdate, setOfferstartdate] = useState(searchParams.get("offerstartdate") || "");
  const [offerenddate, setOfferenddate] = useState(searchParams.get("offerenddate") || "");
  const [advertiserid, setAdvertiserid] = useState(searchParams.get("advertiserid") || "");
  const [advertisername, setAdvertisername] = useState(searchParams.get("advertisername") || "");
  const [network, setNetwork] = useState(searchParams.get("network") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt");
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 12);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [copiedCode, setCopiedCode] = useState(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (subCategoryId) params.set("subCategoryId", subCategoryId);
    if (offerstartdate) params.set("offerstartdate", offerstartdate);
    if (offerenddate) params.set("offerenddate", offerenddate);
    if (advertiserid) params.set("advertiserid", advertiserid);
    if (advertisername) params.set("advertisername", advertisername);
    if (network) params.set("network", network);
    if (sort) params.set("sort", sort);
    if (order) params.set("order", order);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    return params.toString();
  }, [
    subCategoryId,
    offerstartdate,
    offerenddate,
    advertiserid,
    advertisername,
    network,
    sort,
    order,
    page,
    limit,
  ]);

  useEffect(() => {
    const url = `/coupons/list?${queryString}`;
    router.replace(url, { scroll: false });
  }, [queryString, router]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axiosInstance.get(`/website/coupon/filter`, {
          params: {
            subCategoryId,
            offerstartdate,
            offerenddate,
            advertiserid,
            advertisername,
            network,
            page,
            limit,
            sort,
            order,
          },
        });
        if (!active) return;
        if (!data.error) {
          setCoupons(Array.isArray(data.coupons) ? data.coupons : []);
          setPagination(data.pagination || { page: 1, limit, total: 0, totalPages: 0 });
        }
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load coupons");
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
    subCategoryId,
    offerstartdate,
    offerenddate,
    advertiserid,
    advertisername,
    network,
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
    setSubCategoryId("");
    setOfferstartdate("");
    setOfferenddate("");
    setAdvertiserid("");
    setAdvertisername("");
    setNetwork("");
    setSort("createdAt");
    setOrder("desc");
    setPage(1);
    setLimit(12);
  };

  const canPrev = page > 1;
  const canNext = pagination.totalPages ? page < pagination.totalPages : false;

  const copyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl text-white md:text-4xl font-bold">Coupons</h1>
          <p className="text-white/90 mt-2">Filter coupons and discount codes</p>
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
                  value={advertisername}
                  onChange={(e) => setAdvertisername(e.target.value)}
                  placeholder="e.g. Academy for Health and Fitness"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Advertiser ID</label>
                  <input
                    type="number"
                    value={advertiserid}
                    onChange={(e) => setAdvertiserid(e.target.value)}
                    placeholder="e.g. 53905"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Start From</label>
                  <input
                    type="date"
                    value={offerstartdate}
                    onChange={(e) => setOfferstartdate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">End To</label>
                  <input
                    type="date"
                    value={offerenddate}
                    onChange={(e) => setOfferenddate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Network</label>
                  <input
                    type="text"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    placeholder="e.g. UK Network"
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
                    <option value="offerstartdate">Start Date</option>
                    <option value="offerenddate">End Date</option>
                    <option value="advertisername">Advertiser</option>
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
            {loading && <div className="text-center text-neutral-600">Loading coupons...</div>}
            {error && <div className="text-center text-red-600">{error}</div>}

            {!loading && !error && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-neutral-600">
                    Showing page {pagination.page} of {pagination.totalPages || 1} • {pagination.total} total
                  </p>
                </div>

                {coupons.length === 0 ? (
                  <div className="text-neutral-600">No coupons found.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((c) => (
                      <div key={c._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="relative h-40">
                          <Image
                            src={FALLBACK_IMAGE}
                            alt={c.offerdescription || "Coupon"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-5">
                          <div className="text-sm text-red-600 font-medium mb-1">{c.advertisername}</div>
                          <h3 className="text-lg font-semibold mb-2">{c.offerdescription}</h3>
                          <p className="text-xs text-neutral-500 mb-2">{c.promotiontypes?.promotiontype}</p>
                          <p className="text-xs text-neutral-500 mb-3">
                            {c.offerstartdate ? new Date(c.offerstartdate).toLocaleDateString() : ""} - {""}
                            {c.offerenddate ? new Date(c.offerenddate).toLocaleDateString() : ""}
                          </p>
                          <div className="flex items-center justify-between">
                            {c.couponcode ? (
                              <button
                                onClick={() => copyCode(c.couponcode)}
                                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                {copiedCode === c.couponcode ? "Copied!" : c.couponcode}
                              </button>
                            ) : (
                              <span className="text-xs text-neutral-500">No code needed</span>
                            )}
                            {c.clickurl && (
                              <a
                                href={c.clickurl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-neutral-700 hover:bg-gray-200"
                              >
                                View
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

export default function CouponsListPage() {
  return (
    <Suspense>
      <CouponsList />
    </Suspense>
  );
}
