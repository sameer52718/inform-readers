"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Chart from "../../components/Chart";
import Loading from "@/components/ui/Loading";
import axios from "axios";

export default function HistoricalDaily() {
  const { coinId } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
          params: {
            vs_currency: currency,
            days: days,
            interval: interval,
          },
        });
        const historicalData = data.prices.map(([timestamp, price]) => ({ timestamp, price }));
        setData(historicalData);
      } catch (err) {
        setError("Failed to fetch historical data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [coinId]);

  return (
    <>
      <header className="backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              {coinId.toUpperCase()} Historical Data (Daily)
            </h1>
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
          {data.length > 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
              <Chart
                data={data}
                title={`${coinId.toUpperCase()} Price History (30 Days)`}
                label="Price (USD)"
              />
            </div>
          ) : (
            !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No historical data available</p>
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
