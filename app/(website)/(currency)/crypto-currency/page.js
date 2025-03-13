import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner';
import { Icon } from '@iconify/react'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'


function CryptoTable() {

  const cryptoData = [
    { name: "Bitcoin", code: "BTC", price: "₹ 81,50,725", change: "+1.45%", marketCap: "₹ 161.8T", volume: "₹ 5.3T", icon: "cryptocurrency:btc" },
    { name: "Ethereum", code: "ETH", price: "₹ 81,50,725", change: "+1.45%", marketCap: "₹ 161.8T", volume: "₹ 5.3T", icon: "cryptocurrency:eth" },
    { name: "Binance Coin", code: "BNB", price: "₹ 81,50,725", change: "+1.45%", marketCap: "₹ 161.8T", volume: "₹ 5.3T", icon: "cryptocurrency:bnb" },
    { name: "Tether", code: "USDT", price: "₹ 81,50,725", change: "+1.45%", marketCap: "₹ 161.8T", volume: "₹ 5.3T", icon: "cryptocurrency:usdt" },
    { name: "Cardano", code: "ADA", price: "₹ 81,50,725", change: "+1.45%", marketCap: "₹ 161.8T", volume: "₹ 5.3T", icon: "cryptocurrency:ada" },
    { name: "Solana", code: "SOL", price: "₹ 81,50,725", change: "+1.45%", marketCap: "₹ 161.8T", volume: "₹ 5.3T", icon: "cryptocurrency:sol" },
    { name: "Ripple", code: "XRP", price: "₹ 81,50,725", change: "+1.45%", marketCap: "₹ 161.8T", volume: "₹ 5.3T", icon: "cryptocurrency:xrp" },
    { name: "Polkadot", code: "DOT", price: "₹ 81,50,725", change: "+1.45%", marketCap: "₹ 161.8T", volume: "₹ 5.3T", icon: "cryptocurrency:dot" },
    { name: "Dogecoin", code: "DOGE", price: "₹ 81,50,725", change: "+1.45%", marketCap: "₹ 161.8T", volume: "₹ 5.3T", icon: "cryptocurrency:doge" },
    { name: "USD Coin", code: "USDC", price: "₹ 81,50,725", change: "+1.45%", marketCap: "₹ 161.8T", volume: "₹ 5.3T", icon: "cryptocurrency:usdc" },
    { name: "Stellar", code: "XLM", price: "₹ 81,50,725", change: "+1.45%", marketCap: "₹ 161.8T", volume: "₹ 5.3T", icon: "cryptocurrency:xlm" }
  ];
  return (
    <div className="bg-gray-300 p-3 md:p-8 rounded-2xl overflow-x-auto">
      <table className="w-full border-collapse block md:table">
        {/* Table Header */}
        <thead className="hidden md:table-header-group">
          <tr className="bg-gray-300 text-left text-sm">
            <th className="p-2 md:p-3 text-sm md:text-lg">Coin Name (Code)</th>
            <th className="p-2 md:p-3 text-sm md:text-lg">Price</th>
            <th className="p-2 md:p-3 text-sm md:text-lg">Change (24h)</th>
            <th className="p-2 md:p-3 text-sm md:text-lg">Market Cap</th>
            <th className="p-2 md:p-3 text-sm md:text-lg">Volume (24h)</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="block md:table-row-group">
          {cryptoData.map((coin, index) => (
            <tr key={index} className="bg-white border-t block md:table-row mb-4 md:mb-0">
              {/* Coin Name */}
              <td className="p-2 md:p-3 text-sm md:text-lg  block md:table-cell">
                <div className='flex items-center'>
                  <Icon icon={coin.icon} className="w-5 h-5 mr-2" />
                  {coin.name} <span className="text-gray-500 text-xs ml-1">({coin.code})</span>
                </div>

              </td>

              {/* Price */}
              <td className="p-2 md:p-3 text-sm md:text-lg block md:table-cell">
                <span className="md:hidden font-semibold">Price: </span>{coin.price}
              </td>

              {/* Change (24h) */}
              <td className="p-2 md:p-3 text-sm md:text-lg block md:table-cell">
                <span className="md:hidden font-semibold">Change (24h): </span>{coin.change}
              </td>

              {/* Market Cap */}
              <td className="p-2 md:p-3 text-sm md:text-lg block md:table-cell">
                <span className="md:hidden font-semibold">Market Cap: </span>{coin.marketCap}
              </td>

              {/* Volume (24h) */}
              <td className="p-2 md:p-3 text-sm md:text-lg block md:table-cell">
                <span className="md:hidden font-semibold">Volume (24h): </span>{coin.volume}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}

function CryptoCurrency() {
  return (
    <div>
      <AdBanner />

      <div className='md:px-48 px-4 py-4 container mx-auto'>
        <div className="px-4">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-1 mb-3 text-sm sm:text-base">
            <h6 className="text-red-500">Home</h6>
            <Icon icon="basil:caret-right-solid" className="mt-[2px]" width="18" height="18" />
            <h6 className="whitespace-nowrap">Crypto Currency</h6>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h4 className="text-xl sm:text-2xl font-bold leading-tight">
              Cryptocurrency Prices in India Today: Compare Bitcoin, Ethereum, Dogecoin, Litecoin,
              Ripple Prices Across CoinSwitch, Coinbase, WazirX, and Other Major Exchanges
            </h4>

            {/* Social Share Section */}
            <div className="flex flex-wrap items-center border border-black bg-gray-300 mt-4 space-x-2 sm:space-x-3 px-4 sm:px-5 py-2 rounded-full w-fit">
              <div className="p-2 cursor-pointer">
                <Icon icon="material-symbols:share" className="text-lg sm:text-xl" />
              </div>

              <div className="flex flex-wrap gap-1 sm:gap-2">
                <a href="#" className="p-2">
                  <Icon icon="logos:whatsapp-icon" className="text-green-500 text-lg sm:text-xl" />
                </a>
                <a href="#" className="p-2">
                  <Icon icon="skill-icons:instagram" className="text-pink-500 text-lg sm:text-xl" />
                </a>
                <a href="#" className="p-2">
                  <Icon icon="logos:facebook" className="text-blue-600 text-lg sm:text-xl" />
                </a>
                <a href="#" className="p-2">
                  <Icon icon="logos:linkedin-icon" className="text-blue-700 text-lg sm:text-xl" />
                </a>
                <a href="#" className="p-2">
                  <Icon icon="mdi:twitter" className="text-black text-lg sm:text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <CryptoTable />
          <div className='flex items-end justify-center w-full'>
            <button className='py-3 mt-5 px-8 border border-red-500 bg-white rounded-2xl'>
              Show More
              <Icon icon="basil:caret-down-outline" width="24" height="24" className='inline' />
            </button>
          </div>

        </div>
      </div>
      <div className="md:px-56 sm:px-12 px-2 py-8">
        <HoverBanner />
      </div>


      <div className='md:px-48 px-4 py-4 container mx-auto'>
        <div className='bg-white border border-black p-8 rounded-2xl '>
          <p className='text-lg font-bold mb-4'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
          <p className='text-lg font-bold mb-4'>
            Lorem Ipsum is simply dummy text of the printing of type and scrambled it to make a type specimen book.
          </p>
        </div>

        <div className="bg-[#d9d9d9] p-4 sm:p-6 rounded-2xl mt-8">
          {[...Array(3)].map((_, index) => (
            <Link href="/news" key={index}>
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 sm:p-4 mb-4 rounded-3xl">
                {/* Responsive Image */}
                <Image
                  src="/website/assets/images/news/01.png"
                  width={1000}
                  height={1000}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border border-red-500"
                  alt="News Image"
                />

                {/* Responsive Heading */}
                <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-center sm:text-left">
                  Bitcoin Price Drops for Third Consecutive Day Alongside Ether and Most Altcoins
                </h4>
              </div>
            </Link>
          ))}
        </div>


        <div className='flex items-end justify-center w-full'>
          <button className='py-3 mt-5 px-8 border border-red-500 bg-white rounded-2xl'>
            Show More
            <Icon icon="basil:caret-down-outline" width="24" height="24" className='inline' />
          </button>
        </div>


        <Image src={"/website/assets/images/banner/01.png"} width={2000} height={2000} alt="ad-banner" className=' h-auto  w-full my-10 ' />

        <div className="px-4">
          {/* Responsive Heading */}
          <h4 className="text-2xl sm:text-3xl font-bold px-2 mb-2">About Bitcoin</h4>

          {/* Responsive Container */}
          <div className="bg-[#d9d9d9] border border-black p-4 sm:p-6 md:p-8 rounded-2xl">
            <p className="text-base sm:text-lg font-bold mb-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
              make a type specimen book.
            </p>
            <p className="text-base sm:text-lg font-bold mb-4">
              Lorem Ipsum is simply dummy text of the printing of type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>


      </div>

      <div className="md:px-56 sm:px-12 px-2 py-8">
        <HoverBanner />
      </div>
    </div>
  )
}

export default CryptoCurrency
