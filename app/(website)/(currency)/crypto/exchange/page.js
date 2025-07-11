"use client";

import { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import axios from "axios";

export default function Exchange() {
  const [exchanges, setExchanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get("https://api.coingecko.com/api/v3/exchanges", {
          params: { per_page: 100, page: page },
        });
        setExchanges(data);
      } catch (err) {
        setError("Failed to fetch exchange data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page]);

  return (
    <>
      <header className="backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Exchange Data</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        <Loading loading={isLoading}>
          {exchanges.length > 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Exchange
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Trust Score
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        24h Volume (BTC)
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Country
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {exchanges.map((exchange) => (
                      <tr key={exchange.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img src={exchange.image} alt={exchange.name} className="w-8 h-8" />
                            <div>
                              <div className="font-medium text-gray-900">{exchange.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-700">
                          {exchange.trust_score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-700">
                          {exchange.trade_volume_24h_btc.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-700">
                          {exchange.country || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center space-x-4 py-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <button onClick={() => setPage((p) => p + 1)} className="px-4 py-2 bg-gray-100 rounded-lg">
                  Next
                </button>
              </div>
            </div>
          ) : (
            !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No exchange data available</p>
              </div>
            )
          )}
        </Loading>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Powered by CoinGecko API</p>
          </div>
        </div>
      </footer>
    </>
  );
}
