"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingDown,
  DollarSign,
  Volume2,
  Search,
  RefreshCw,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Globe,
} from "lucide-react";
import axios from "axios";
import Loading from "@/components/ui/Loading";
import { useSelector } from "react-redux";

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
    return value.toLocaleString();
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
                24h Change
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
                      <div
                        className={`w-10 h-10 bg-gradient-to-br from-${color}-500 to-${color}-700 rounded-full flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {coin.symbol.charAt(0)}
                      </div>
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
                    <div
                      className={`flex items-center justify-end space-x-1 ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="font-medium">{Math.abs(coin.price_change_24h).toFixed(2)}%</span>
                    </div>
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

const CryptoCard = ({ coin, currency }) => {
  const { color } = useSelector((state) => state.config);

  const isPositive = coin.price_change_24h >= 0;
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
    return value.toLocaleString();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 bg-gradient-to-br from-${color}-500 to-${color}-700 rounded-full flex items-center justify-center text-white font-bold text-lg`}
          >
            {coin.symbol.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-base text-gray-900">{coin.name}</h3>
            <p className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</p>
          </div>
        </div>
        <div
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
            isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{Math.abs(coin.price_change_24h).toFixed(2)}%</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Price</span>
          </div>
          <span className="font-semibold text-gray-900">{formatCurrency(coin.price)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Market Cap</span>
          </div>
          <span className="font-medium text-gray-700">{formatLargeNumber(coin.market_cap)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">24h Volume</span>
          </div>
          <span className="font-medium text-gray-700">{formatLargeNumber(coin.volume_24h)}</span>
        </div>
      </div>
    </div>
  );
};

const cryptocurrencies = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "tether", name: "Tether", symbol: "USDT" },
  { id: "ripple", name: "Ripple", symbol: "XRP" },
  { id: "binancecoin", name: "Binance Coin", symbol: "BNB" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "tron", name: "TRON", symbol: "TRX" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "wrapped-bitcoin", name: "Wrapped Bitcoin", symbol: "WBTC" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK" },
  { id: "weth", name: "WETH", symbol: "WETH" },
  { id: "bitcoin-cash", name: "Bitcoin Cash", symbol: "BCH" },
  { id: "leo-token", name: "UNUS SED LEO", symbol: "LEO" },
  { id: "stellar", name: "Stellar", symbol: "XLM" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX" },
  { id: "shiba-inu", name: "Shiba Inu", symbol: "SHIB" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "monero", name: "Monero", symbol: "XMR" },
  { id: "uniswap", name: "Uniswap", symbol: "UNI" },
  { id: "aave", name: "Aave", symbol: "AAVE" },
  { id: "crypto-com-chain", name: "Cronos", symbol: "CRO" },
  { id: "near", name: "NEAR Protocol", symbol: "NEAR" },
  { id: "matic-network", name: "Polygon", symbol: "MATIC" },
  { id: "cosmos", name: "Cosmos", symbol: "ATOM" },
  { id: "fetch-ai", name: "Fetch.ai", symbol: "FET" },
  { id: "eos", name: "EOS Coin", symbol: "EOS" },
  { id: "floki", name: "Floki Inu", symbol: "FLOKI" },
  { id: "zcash", name: "Zcash", symbol: "ZEC" },
  { id: "bitcoin-sv", name: "Bitcoin SV", symbol: "BSV" },
  { id: "decentraland", name: "Decentraland", symbol: "MANA" },
  { id: "iota", name: "IOTA", symbol: "MIOTA" },
  { id: "elrond-erd-2", name: "Elrond", symbol: "EGLD" },
  { id: "neo", name: "NEO Coin", symbol: "NEO" },
  { id: "underdog", name: "Underdog", symbol: "DOG" },
  { id: "ftx-token", name: "FTX Token", symbol: "FTT" },
  { id: "flex-coin", name: "FLEX", symbol: "FLEX" },
  { id: "dash", name: "Dash", symbol: "DASH" },
  { id: "zilliqa", name: "Zilliqa", symbol: "ZIL" },
  { id: "qtum", name: "Qtum", symbol: "QTUM" },
  { id: "status", name: "Status", symbol: "SNT" },
  { id: "sushi", name: "SushiSwap", symbol: "SUSHI" },
  { id: "terra-luna", name: "Terra", symbol: "LUNA" },
  { id: "ardor", name: "Ardor", symbol: "ARDR" },
  { id: "spell-token", name: "Spell Token", symbol: "SPELL" },
  { id: "braintrust", name: "Braintrust", symbol: "BTRST" },
  { id: "binance-usd", name: "Binance USD", symbol: "BUSD" },
  { id: "cartesi", name: "Cartesi", symbol: "CTSI" },
  { id: "nem", name: "NEM", symbol: "XEM" },
  { id: "dia-data", name: "DIA", symbol: "DIA" },
  { id: "mobox", name: "Mobox", symbol: "MBOX" },
  { id: "doge-killer", name: "Doge Killer", symbol: "LEASH" },
  { id: "kishu-inu", name: "Kishu Inu", symbol: "KISHU" },
  { id: "augur", name: "Augur", symbol: "REP" },
  { id: "circuits-of-value", name: "Circuits of Value", symbol: "COVAL" },
  { id: "husky", name: "Husky", symbol: "HUSKY" },
  { id: "baby-doge-coin", name: "Baby Doge Coin", symbol: "BABYDOGE" },
  { id: "burger-swap", name: "BurgerCities", symbol: "BURGER" },
  { id: "dogefi", name: "DOGEFI", symbol: "DOGEFI" },
  { id: "usd-coin", name: "USD Coin", symbol: "USDC" },
  { id: "gas", name: "Gas", symbol: "GAS" },
  { id: "bitcoin-hedge", name: "Bitcoin Hedge", symbol: "BTCHG" },
  { id: "nano-dogecoin", name: "Nano Dogecoin", symbol: "INDC" },
];

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
  const [viewMode, setViewMode] = useState("table");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRates = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          ids: cryptocurrencies.map((c) => c.id).join(","),
          vs_currencies: currency,
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true,
        },
      });

      const ratesData = cryptocurrencies.map((crypto) => {
        const data = response?.data?.[crypto.id] || {};
        return {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          price: data?.[currency] ?? 0,
          market_cap: data?.[`${currency}_market_cap`] ?? 0,
          volume_24h: data?.[`${currency}_24h_vol`] ?? 0,
          price_change_24h: data?.[`${currency}_24h_change`] ?? 0,
        };
      });

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
  }, [currency]);

  const filteredRates = rates.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className=" backdrop-blur-sm border-b  sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div />

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

          {/* View Mode Toggle */}
          {/* <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === 'cards'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Table
            </button>
          </div> */}
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

              {/* Crypto Data */}
              {viewMode === "cards" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRates.map((coin) => (
                    <CryptoCard key={coin.id} coin={coin} currency={currency} />
                  ))}
                </div>
              ) : (
                <CryptoTable rates={filteredRates} currency={currency} />
              )}
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
