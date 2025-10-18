import React from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink, Globe, Github } from "lucide-react";

// ✅ Generate Dynamic Metadata for SEO
export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return {
        title: "Cryptocurrency Not Found",
        description: "The requested cryptocurrency could not be found.",
      };
    }

    const coin = await res.json();
    const price = coin?.market_data?.current_price?.usd ?? "N/A";
    const change24h = coin?.market_data?.price_change_percentage_24h ?? 0;

    return {
      title: `${coin.name} (${coin.symbol.toUpperCase()}) Price, Chart & Market Cap | Live Crypto Data`,
      description: `${
        coin.name
      } (${coin.symbol.toUpperCase()}) live price is $${price.toLocaleString()} with ${change24h.toFixed(
        2
      )}% change in 24h. View market cap, volume, circulating supply and more.`,
      openGraph: {
        title: `${coin.name} (${coin.symbol.toUpperCase()}) - $${price.toLocaleString()}`,
        description: `Track ${coin.name} price, market cap, and key statistics. ${
          change24h >= 0 ? "📈" : "📉"
        } ${change24h.toFixed(2)}% (24h)`,
        images: [coin.image.large],
      },
      twitter: {
        card: "summary_large_image",
        title: `${coin.name} (${coin.symbol.toUpperCase()}) - $${price.toLocaleString()}`,
        description: `${change24h >= 0 ? "📈" : "📉"} ${change24h.toFixed(2)}% (24h)`,
        images: [coin.image.large],
      },
    };
  } catch (error) {
    return {
      title: "Cryptocurrency Information",
      description: "View detailed cryptocurrency information and statistics.",
    };
  }
}

// ✅ Server Component — SSR data fetch
export default async function CryptoDetailPage({ params }) {
  const { id } = params;

  // Fetch crypto details from CoinGecko (server-side)
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=true&developer_data=true`,
    {
      next: { revalidate: 300 }, // cache for 5 minutes
    }
  );

  if (!res.ok) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cryptocurrency Not Found</h2>
          <p className="text-gray-600 mb-6">
            The cryptocurrency you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/crypto"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Crypto Market
          </Link>
        </div>
      </div>
    );
  }

  const coin = await res.json();

  const price = coin?.market_data?.current_price?.usd ?? "N/A";
  const change24h = coin?.market_data?.price_change_percentage_24h ?? 0;
  const change7d = coin?.market_data?.price_change_percentage_7d ?? 0;
  const change30d = coin?.market_data?.price_change_percentage_30d ?? 0;
  const change1y = coin?.market_data?.price_change_percentage_1y ?? 0;
  const isPositive = change24h >= 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-red-100 mb-6">
            <Link href="/crypto" className="hover:text-white transition-colors">
              Cryptocurrency Market
            </Link>
            <span>›</span>
            <span className="text-white font-medium">{coin.name}</span>
          </nav>

          {/* Coin Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            <img
              src={coin.image.large}
              alt={coin.name}
              className="w-24 h-24 rounded-full shadow-2xl border-4 border-white"
            />
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h1 className="text-4xl md:text-5xl font-bold text-white">{coin.name}</h1>
                <span className="text-2xl font-semibold text-red-200">{coin.symbol.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                  Rank #{coin.market_cap_rank}
                </span>
                {coin.categories && coin.categories[0] && (
                  <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                    {coin.categories[0]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Price Card */}
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-2">Current Price (USD)</div>
                <div className="text-4xl md:text-5xl font-bold text-gray-800">
                  $
                  {typeof price === "number"
                    ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })
                    : price}
                </div>
              </div>
              <div className="flex gap-3">
                <div
                  className={`flex items-center px-4 py-2 rounded-xl text-lg font-semibold ${
                    isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-5 w-5 mr-2" />
                  ) : (
                    <TrendingDown className="h-5 w-5 mr-2" />
                  )}
                  {change24h.toFixed(2)}%<span className="text-xs ml-2 opacity-75">24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Price Changes Overview */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Price Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-xl p-4 border border-blue-100">
                <div className="text-sm text-gray-600 mb-1">24 Hours</div>
                <div className={`text-2xl font-bold ${change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {change24h >= 0 ? "+" : ""}
                  {change24h.toFixed(2)}%
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="text-sm text-gray-600 mb-1">7 Days</div>
                <div className={`text-2xl font-bold ${change7d >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {change7d >= 0 ? "+" : ""}
                  {change7d.toFixed(2)}%
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
                <div className="text-sm text-gray-600 mb-1">30 Days</div>
                <div className={`text-2xl font-bold ${change30d >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {change30d >= 0 ? "+" : ""}
                  {change30d.toFixed(2)}%
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="text-sm text-gray-600 mb-1">1 Year</div>
                <div className={`text-2xl font-bold ${change1y >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {change1y >= 0 ? "+" : ""}
                  {change1y.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Statistics */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Market Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">Market Cap</p>
                <p className="font-bold text-xl text-gray-800">
                  ${coin.market_data.market_cap.usd.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">24h Trading Volume</p>
                <p className="font-bold text-xl text-gray-800">
                  ${coin.market_data.total_volume.usd.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">Circulating Supply</p>
                <p className="font-bold text-xl text-gray-800">
                  {coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">Total Supply</p>
                <p className="font-bold text-xl text-gray-800">
                  {coin.market_data.total_supply ? coin.market_data.total_supply.toLocaleString() : "N/A"}{" "}
                  {coin.symbol.toUpperCase()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">Max Supply</p>
                <p className="font-bold text-xl text-gray-800">
                  {coin.market_data.max_supply ? coin.market_data.max_supply.toLocaleString() : "∞"}{" "}
                  {coin.symbol.toUpperCase()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">Fully Diluted Valuation</p>
                <p className="font-bold text-xl text-gray-800">
                  $
                  {coin.market_data.fully_diluted_valuation?.usd
                    ? coin.market_data.fully_diluted_valuation.usd.toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* All-Time High/Low */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-gray-800">All-Time High</h3>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                ${coin.market_data.ath.usd.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(coin.market_data.ath_date.usd).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="mt-3 text-sm">
                <span className="text-red-600 font-semibold">
                  {coin.market_data.ath_change_percentage.usd.toFixed(2)}% from ATH
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-gray-800">All-Time Low</h3>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">
                ${coin.market_data.atl.usd.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(coin.market_data.atl_date.usd).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="mt-3 text-sm">
                <span className="text-green-600 font-semibold">
                  +{coin.market_data.atl_change_percentage.usd.toFixed(2)}% from ATL
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Links & Resources */}
        {(coin.links?.homepage?.[0] ||
          coin.links?.blockchain_site?.[0] ||
          coin.links?.repos_url?.github?.[0]) && (
          <section className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-3xl">🔗</span>
                Official Links & Resources
              </h2>
              <div className="flex flex-wrap gap-3">
                {coin.links.homepage?.[0] && (
                  <a
                    href={coin.links.homepage[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <Globe className="w-5 h-5" />
                    Official Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {coin.links.blockchain_site?.[0] && (
                  <a
                    href={coin.links.blockchain_site[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Explorer
                  </a>
                )}
                {coin.links.repos_url?.github?.[0] && (
                  <a
                    href={coin.links.repos_url.github[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Description */}
        {coin.description.en && (
          <section className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                About {coin.name}
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: coin.description.en,
                }}
              />
            </div>
          </section>
        )}

        {/* Additional Info */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-gray-50 to-red-50 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Information</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              {coin.genesis_date && (
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎂</div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Genesis Date</div>
                    <div>{coin.genesis_date}</div>
                  </div>
                </div>
              )}
              {coin.hashing_algorithm && (
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔐</div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Hashing Algorithm</div>
                    <div>{coin.hashing_algorithm}</div>
                  </div>
                </div>
              )}
              {coin.market_data.market_cap_rank && (
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Market Cap Rank</div>
                    <div>#{coin.market_data.market_cap_rank}</div>
                  </div>
                </div>
              )}
              {coin.sentiment_votes_up_percentage && (
                <div className="flex items-start gap-3">
                  <div className="text-2xl">👍</div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Community Sentiment</div>
                    <div>{coin.sentiment_votes_up_percentage.toFixed(1)}% Positive</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Back to Market Button */}
        <div className="text-center">
          <Link
            href="/crypto"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Crypto Market
          </Link>
        </div>
      </div>
    </main>
  );
}
