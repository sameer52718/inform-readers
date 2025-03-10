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
    <div className=" bg-gray-300 p-8 rounded-2xl ">
      <table className="w-full border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-300 text-left text-sm">
            <th className="p-3 text-lg">Coin Name (Code)</th>
            <th className="p-3 text-lg">Price</th>
            <th className="p-3 text-lg">Change (24h)</th>
            <th className="p-3 text-lg">Market Cap</th>
            <th className="p-3 text-lg">Volume (24h)</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {cryptoData.map((coin, index) => (
            <tr key={index} className="bg-white border-t">
              <td className="p-3 text-lg flex items-center">
                <Icon icon={coin.icon} className="w-5 h-5 mr-2" />
                {coin.name} <span className="text-gray-500 text-xs ml-1">({coin.code})</span>
              </td>
              <td className="p-3 text-lg">{coin.price}</td>
              <td className="p-3 text-lg">{coin.change}</td>
              <td className="p-3 text-lg">{coin.marketCap}</td>
              <td className="p-3 text-lg">{coin.volume}</td>
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

      <div className='px-48 py-4 container mx-auto'>
        <div className='flex items-center gap-1 mb-3 '>
          <h6 className='text-red-500'>Home</h6>
          <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
          <h6>Crypto Currency  </h6>
        </div>

        <div className='mb-6'>
          <h4 className='text-2xl font-bold'>Cryptocurrency Prices in India Today: Compare Bitcoin, Ethereum, Dogecoin, Litecoin, Ripple Prices Across CoinSwitch, Coinbase, WazirX and Other Major Exchanges</h4>

          <div className="flex border border-black bg-gray-300 mt-4 items-center space-x-1 px-5 py-2  rounded-full w-fit ">
            <div className="p-2  cursor-pointer">
              <Icon icon="material-symbols:share" className='text-xl' />
            </div>

            <div className="flex  ">
              <a href="#" className="p-2 ">
                <Icon icon="logos:whatsapp-icon" className="text-green-500 text-xl" />
              </a>
              <a href="#" className="p-2 ">
                <Icon icon="skill-icons:instagram" className="text-pink-500 text-xl" />
              </a>
              <a href="#" className="p-2 ">
                <Icon icon="logos:facebook" className="text-blue-600 text-xl" />
              </a>
              <a href="#" className="p-2 ">
                <Icon icon="logos:linkedin-icon" className="text-blue-700 text-xl" />
              </a>
              <a href="#" className="p-2 ">
                <Icon icon="mdi:twitter" className="text-black text-xl" />
              </a>
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

        <HoverBanner padding='0px' />

        <div className='bg-white border border-black p-8 rounded-2xl '>
          <p className='text-lg font-bold mb-4'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
          <p className='text-lg font-bold mb-4'>
            Lorem Ipsum is simply dummy text of the printing of type and scrambled it to make a type specimen book.
          </p>
        </div>

        <div className='bg-[#d9d9d9] p-6 rounded-2xl mt-8'>
          {[...Array(3)].map((_, index) => (
            <Link href={"/news"} key={index}>
            <div key={index} className='flex items-center gap-4 bg-white p-3 mb-4 rounded-3xl'>
              <Image src="/website/assets/images/news/01.png" width={1000} height={1000} className='w-28 h-28 object-cover rounded-lg border border-red-500' />

              <h4 className='text-2xl font-semibold'>Bitcoin Price Drops for Third Consecutive Day Alongside Ether and Most Altcoins</h4>
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

        <div>
          <h4 className='text-3xl font-bold px-2 mb-2'>About Bitcoin</h4>
          <div className='bg-[#d9d9d9] border border-black p-8 rounded-2xl '>
            <p className='text-lg font-bold mb-4'>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
            <p className='text-lg font-bold mb-4'>
              Lorem Ipsum is simply dummy text of the printing of type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>
        <HoverBanner padding='0px' />

      </div>
    </div>
  )
}

export default CryptoCurrency
