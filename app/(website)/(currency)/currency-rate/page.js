"use client"

import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner';
import { Icon } from '@iconify/react'
import React, { useState } from 'react'

function CurrencyTable() {

    const currencies = [
        { code: "INR", flag: "twemoji:flag-india", rates: [0.058, 0.058, 0.001, 0.001, 0.001] },
        { code: "JPY", flag: "twemoji:flag-japan", rates: [0.058, 0.058, 0.001, 0.001, 0.01] },
        { code: "CAD", flag: "twemoji:flag-canada", rates: [0.058, 0.058, 0.058, 0.058, 0.058] }
    ];

    const headers = [
        { code: "INR", flag: "twemoji:flag-india" },
        { code: "CNY", flag: "twemoji:flag-china" },
        { code: "GBP", flag: "twemoji:flag-united-kingdom" },
        { code: "CAD", flag: "twemoji:flag-canada" },
        { code: "JPY", flag: "twemoji:flag-japan" }
    ];
    return (
        <div className=" bg-gray-300 p-8 rounded-lg shadow-md">
            <table className="w-full border-collapse">
                <thead>
                    <tr className=" text-left">
                        <th className="p-2"></th>
                        {headers.map((currency) => (
                            <th key={currency.code} className="p-2 text-center">
                                <Icon icon={currency.flag} className="inline w-5 h-5" /> {currency.code}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {currencies.map((currency) => (
                        <tr key={currency.code} className="bg-white border-t rounded-xl  ">
                            <td className=" text-center flex items-center p-4">
                                <Icon icon={currency.flag} className="w-5 h-5 mr-1" />
                                {currency.code}
                            </td>
                            {currency.rates.map((rate, index) => (
                                <td key={index} className="p-2 text-center">{rate}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}



function CurrencyConverter() {
    const [amount, setAmount] = useState(1000);
    const exchangeRate = 278.7; // Example rate USD to PKR
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return (
        <div className=" px-5 py-8 bg-gray-200 rounded-2xl ">
            {/* <h2 className="text-lg font-bold mb-4 text-center">Currency Converter</h2> */}

            <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
                <div>
                    <label className="block font-semibold mb-1">Amount</label>
                    <div className="flex items-center border p-2 rounded-lg bg-gray-100">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-transparent outline-none text-lg"
                        />
                        <div className="flex items-center space-x-2">
                            <Icon icon="twemoji:flag-for-united-states" className="w-6 h-6" />
                            <span>USD</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        $1.00 USD = <span className="text-red-500 font-bold">Rs {exchangeRate} PKR</span>
                    </p>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Converted To</label>
                    <div className="flex items-center border p-2 rounded-lg bg-gray-100">
                        <input
                            type="text"
                            value={convertedAmount}
                            readOnly
                            className="w-full bg-transparent outline-none text-lg"
                        />
                        <div className="flex items-center space-x-2">
                            <Icon icon="twemoji:flag-for-pakistan" className="w-6 h-6" />
                            <span>PKR</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-4 gap-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                    Track the exchange rate
                </button>
                <button className="bg-black text-white px-4 py-2 rounded-lg font-semibold">
                    Send money
                </button>
            </div>
        </div>
    );
}

function CurrencyRate() {
    return (
        <div className=''>
            <AdBanner />
            <div className='px-48 py-8 container mx-auto'>
                <div className='flex items-center gap-1  '>
                    <h6 className='text-red-500'>Home</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Currency Convertor  </h6>
                </div>

                <div className='relative py-10'>
                    <h4 className='text-5xl text-center font-bold '>US dollars to <span className='text-red-500'> Pakistani rupees </span> today</h4>
                    <div className="flex absolute top-0 -right-10 items-center space-x-1 px-5 py-2  rounded-full w-fit ">
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
                <CurrencyConverter />

                <div className='text-center py-10 w-[800px] mx-auto'>
                    <h4 className='text-2xl font-bold mb-1'>Waiting on a better rate?</h4>
                    <p className='text-lg font-semibold'>
                        Set an alert now, and we’ll tell you when it gets better. And with our daily summaries, you’ll never miss out on the latest news.
                    </p>
                </div>

                <HoverBanner padding='0px' />
                <CurrencyTable />

                <div className='py-10'>
                    <h4 className='text-center text-3xl font-bold mb-3'>Compare prices for sending money abroad</h4>
                    <p className='text-lg font-semibold mb-4'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                    <p className='text-lg font-semibold mb-4'>
                        ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </div>

                <HoverBanner padding='0px' />
            </div>
        </div>
    )
}

export default CurrencyRate
