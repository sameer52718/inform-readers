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
        <div className="bg-gray-300 md:p-6 p-2 sm:p-8 rounded-lg shadow-md">
            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    {/* Table Header */}
                    <thead>
                        <tr className="text-left bg-gray-200">
                            <th className="p-2"></th>
                            {headers.map((currency) => (
                                <th key={currency.code} className="p-2 text-center whitespace-nowrap">
                                    <Icon icon={currency.flag} className="inline w-5 h-5" /> {currency.code}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {currencies.map((currency) => (
                            <tr key={currency.code} className="bg-white border-t">
                                <td className="p-4 flex items-center justify-center whitespace-nowrap">
                                    <Icon icon={currency.flag} className="w-5 h-5 mr-1" />
                                    {currency.code}
                                </td>
                                {currency.rates.map((rate, index) => (
                                    <td key={index} className="p-2 text-center whitespace-nowrap">{rate}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}



function CurrencyConverter() {
    const [amount, setAmount] = useState(1000);
    const exchangeRate = 278.7; // Example rate USD to PKR
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return (
        <div className="px-4 sm:px-5 py-6 sm:py-8 bg-gray-200 rounded-2xl">
            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-lg shadow">
                {/* Amount Input */}
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

                {/* Converted Amount Input */}
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

            {/* Responsive Buttons */}
            <div className="flex flex-col sm:flex-row justify-end mt-4 gap-3">
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold w-full sm:w-auto">
                    Track the exchange rate
                </button>
                <button className="bg-black text-white px-4 py-2 rounded-lg font-semibold w-full sm:w-auto">
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
            <div className='md:px-48 px-4 py-8 container mx-auto'>
                <div className='flex items-center gap-1  '>
                    <h6 className='text-red-500'>Home</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Currency Convertor  </h6>
                </div>

                <div className="relative py-6 sm:py-10 px-4">
                    {/* Responsive Heading */}
                    <h4 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold">
                        US dollars to <span className="text-red-500">Pakistani rupees</span> today
                    </h4>

                    {/* Responsive Social Icons */}
                    <div className="flex justify-center sm:justify-end sm:absolute sm:top-0 sm:right-0 items-center space-x-1 px-4 sm:px-5 py-2 rounded-full w-fit mt-4 sm:mt-0">
                        <div className="p-2 cursor-pointer">
                            <Icon icon="material-symbols:share" className="text-xl" />
                        </div>

                        <div className="flex">
                            <a href="#" className="p-2">
                                <Icon icon="logos:whatsapp-icon" className="text-green-500 text-xl" />
                            </a>
                            <a href="#" className="p-2">
                                <Icon icon="skill-icons:instagram" className="text-pink-500 text-xl" />
                            </a>
                            <a href="#" className="p-2">
                                <Icon icon="logos:facebook" className="text-blue-600 text-xl" />
                            </a>
                            <a href="#" className="p-2">
                                <Icon icon="logos:linkedin-icon" className="text-blue-700 text-xl" />
                            </a>
                            <a href="#" className="p-2">
                                <Icon icon="mdi:twitter" className="text-black text-xl" />
                            </a>
                        </div>
                    </div>
                </div>

                <CurrencyConverter />

                <div className="text-center py-8 sm:py-10 max-w-[800px] w-full mx-auto px-4">
                    <h4 className="text-xl sm:text-2xl font-bold mb-1">
                        Waiting on a better rate?
                    </h4>
                    <p className="text-base sm:text-lg font-semibold">
                        Set an alert now, and we’ll tell you when it gets better. And with our daily summaries,
                        you’ll never miss out on the latest news.
                    </p>
                </div>
            </div>
            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>
            <div className='md:px-48 px-4 py-8 container mx-auto'>
                <CurrencyTable />
                <div className="py-10 px-2 sm:px-8 max-w-[900px] ">
                    <h4 className="text-2xl sm:text-3xl font-bold mb-3">
                        Compare prices for sending money abroad
                    </h4>
                    <p className="text-base sm:text-lg font-semibold mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                    <p className="text-base sm:text-lg font-semibold ">
                        Ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </div>
            </div>

            <div className="md:px-56 sm:px-12 px-2 py-2">
                <HoverBanner />
            </div>
        </div>
    )
}

export default CurrencyRate
