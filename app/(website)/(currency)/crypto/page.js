"use client";
import React, { useState, useEffect } from "react";
import { TrendingDown, Search, RefreshCw, TrendingUp, AlertCircle, Globe } from "lucide-react";
import axios from "axios";
import Loading from "@/components/ui/Loading";
import { useSelector } from "react-redux";
import Link from "next/link";

const CryptoTable = ({ rates, currency }) => {
  const { color } = useSelector((state) => state.config);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (value) => {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    }
    return value?.toLocaleString?.();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Cryptocurrency
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                1h Change
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                24h Change
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                7d Change
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Market Cap
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Volume (24h)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rates.map((coin) => {
              const isPositive = coin.price_change_24h >= 0;
              return (
                <tr key={coin.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8" />

                      <div>
                        <div className="font-medium text-gray-900">{coin.name}</div>
                        <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                    {formatCurrency(coin.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link href={`/crypto/minutely/${coin.id}`}>
                      <div
                        className={`flex items-center justify-end space-x-1 ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">{Math.abs(coin.price_change_1h).toFixed(2)}%</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link href={`/crypto/hourly/${coin.id}`}>
                      <div
                        className={`flex items-center justify-end space-x-1 ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">{Math.abs(coin.price_change_24h).toFixed(2)}%</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link href={`/crypto/daily/${coin.id}`}>
                      <div
                        className={`flex items-center justify-end space-x-1 ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">{Math.abs(coin.price_change_7d).toFixed(2)}%</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-700">
                    {formatLargeNumber(coin.market_cap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-700">
                    {formatLargeNumber(coin.volume_24h)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const fiatCurrencies = [
  { code: "usd", name: "US Dollar", symbol: "$" },
  { code: "eur", name: "Euro", symbol: "€" },
  { code: "gbp", name: "British Pound", symbol: "£" },
  { code: "jpy", name: "Japanese Yen", symbol: "¥" },
  { code: "inr", name: "Indian Rupee", symbol: "₹" },
];

function App() {
  const { color } = useSelector((state) => state.config);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState("usd");
  const [rates, setRates] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const fetchRates = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: 100,
          page: page,
          sparkline: false,
          price_change_percentage: "1h,7d,24h",
        },
      });
      console.log(response.data);

      const ratesData = response.data.map((coin) => ({
        id: coin.id,
        image: coin.image,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.current_price,
        market_cap: coin.market_cap,
        volume_24h: coin.total_volume,
        price_change_24h: coin.price_change_percentage_24h_in_currency,
        price_change_1h: coin.price_change_percentage_1h_in_currency,
        price_change_7d: coin.price_change_percentage_7d_in_currency,
      }));
      console.log(response.data[0]);

      setRates(ratesData);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch cryptocurrency data. Please try again later.");
      console.error("Error fetching rates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRates();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchRates();
  }, [currency, page]);

  const filteredRates = rates.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/news"
                className="text-sm font-medium text-gray-600 hover:text-${color}-600 transition-colors duration-200"
              >
                News
              </Link>
              <Link
                href="/exchange"
                className="text-sm font-medium text-gray-600 hover:text-${color}-600 transition-colors duration-200"
              >
                Exchange
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 text-gray-600 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>

              {lastUpdated && (
                <div className="text-sm text-gray-500">Updated: {lastUpdated.toLocaleTimeString()}</div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Currency Selector */}
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500 transition-colors duration-200 min-w-[140px]`}
              >
                {fiatCurrencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500 transition-colors duration-200 min-w-[240px]`}
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <Loading loading={isLoading}>
          {filteredRates.length > 0 ? (
            <div className="space-y-8">
              {/* Market Overview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Market Overview</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{filteredRates.length}</p>
                    <p className="text-sm text-gray-600">Cryptocurrencies</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {filteredRates.filter((coin) => coin.price_change_24h >= 0).length}
                    </p>
                    <p className="text-sm text-gray-600">Gainers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {filteredRates.filter((coin) => coin.price_change_24h < 0).length}
                    </p>
                    <p className="text-sm text-gray-600">Losers</p>
                  </div>
                </div>
              </div>
              <CryptoTable rates={filteredRates} currency={currency} />
              <div className="flex justify-center space-x-4">
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
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No cryptocurrencies found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search terms</p>
              </div>
            )
          )}
        </Loading>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Powered by CoinGecko API • Data updates every minute</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
