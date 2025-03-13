"use client"

import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner';
import { Icon } from '@iconify/react'
import Image from 'next/image';
import React, { useState } from 'react'


function GoldRateCalculator() {
    const [city, setCity] = useState("Karachi");
    const [quantity, setQuantity] = useState(1);
    const [purity, setPurity] = useState("24K");
    const [price, setPrice] = useState(0);

    // Sample gold rates (can be fetched from an API)
    const goldRates = {
        Karachi: { "24K": 7952, "22K": 7300 },
        Lahore: { "24K": 7980, "22K": 7350 },
        Islamabad: { "24K": 8000, "22K": 7400 },
    };

    // Calculate Price
    const calculatePrice = () => {
        const rate = goldRates[city]?.[purity] || 0;
        setPrice(rate * quantity);
    };

    return (
        <>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3 px-2">Gold Rate Calculator</h2>
            <div className='p-4 bg-gray-200 rounded-lg shadow-md'>
                <div className="bg-white p-6 rounded-3xl">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 w-full bg-white">
                        {/* City Selection */}
                        <div className='sm:col-span-4'>
                            <label className="text-lg font-medium">City</label>
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="border p-2 rounded w-full"
                            >
                                <option value="Karachi">Karachi</option>
                                <option value="Lahore">Lahore</option>
                                <option value="Islamabad">Islamabad</option>
                            </select>
                        </div>

                        {/* Quantity Selection */}
                        <div className='sm:col-span-3'>
                            <label className="text-lg font-medium">Quantity (gram)</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        {/* Purity Selection */}
                        <div className='sm:col-span-3'>
                            <label className="text-lg font-medium">Purity</label>
                            <div className="flex space-x-2">
                                <label className="flex items-center space-x-1">
                                    <input
                                        type="radio"
                                        name="purity"
                                        value="24K"
                                        checked={purity === "24K"}
                                        onChange={() => setPurity("24K")}
                                    />
                                    <span>24 Carat</span>
                                </label>
                                <label className="flex items-center space-x-1">
                                    <input
                                        type="radio"
                                        name="purity"
                                        value="22K"
                                        checked={purity === "22K"}
                                        onChange={() => setPurity("22K")}
                                    />
                                    <span>22 Carat</span>
                                </label>
                            </div>
                        </div>

                        {/* Calculate Button */}
                        <div className='sm:col-span-2'>
                            <button
                                onClick={calculatePrice}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                            >
                                Calculate
                            </button>
                        </div>

                    </div>

                    {/* Price Display */}
                    <div className="text-2xl sm:text-3xl font-bold text-right mt-3">₹ {price.toLocaleString()}</div>
                </div>
            </div>
            .
        </>
    );
}


function PriceTable() {
    const goldPrices = [
        { grams: "1 gram", price: "₹ 7,762", change: "₹ 0" },
        { grams: "8 grams", price: "₹ 62,096", change: "₹ 0" },
        { grams: "10 grams", price: "₹ 77,620", change: "₹ 0" },
        { grams: "100 grams", price: "₹ 7,76,200", change: "₹ 0" },
    ];
    return (

        <div className='mt-4 pb-6'>
            <h4 className='text-2xl sm:text-3xl font-semibold mb-4 px-3'>24 Carat Gold Price in India Today</h4>
            <div className="md:p-6 p-2 bg-gray-200 rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-left">
                        <thead className="bg-gray-200">
                            <tr className=' sm:text-xl text-sm'>
                                <th className="p-2 border">Gram</th>
                                <th className="p-2 border">24K Gold Price</th>
                                <th className="p-2 border">Daily Price Change</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {goldPrices.map((item, index) => (
                                <tr key={index} className="border text-lg sm:text-xl font-bold mb-3 bg-white rounded-2xl">
                                    <td className="p-2 border">{item.grams}</td>
                                    <td className="p-2 border">{item.price}</td>
                                    <td className="p-2 border">{item.change}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}

const GoldRateTable = () => {
    return (
        <div className="overflow-x-auto">
            <table className="border border-gray-500 w-full text-center rounded-2xl overflow-hidden">
                <thead>
                    <tr className="bg-gray-500 text-white">
                        <th className="p-2 border border-gray-400">Gold Rate</th>
                        <th className="p-2 border border-gray-400">Gold Rate In Bhawalpur</th>
                        <th className="p-2 border border-gray-400">Gold Rate In Chakwal</th>
                        <th className="p-2 border border-gray-400">Gold Rate In Hyderabad</th>
                        <th className="p-2 border border-gray-400">Gold Rate In Lahore</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    <tr>
                        <td className="p-2 border border-gray-400">22 Carat</td>
                        <td className="p-2 border border-gray-400">
                            <div className="bg-gray-300 p-2 rounded-md">244,170</div>
                        </td>
                        <td className="p-2 border border-gray-400">
                            <div className="bg-gray-300 p-2 rounded-md">244,170</div>
                        </td>
                        <td className="p-2 border border-gray-400">
                            <div className="bg-gray-300 p-2 rounded-md">244,170</div>
                        </td>
                        <td className="p-2 border border-gray-400">
                            <div className="bg-gray-300 p-2 rounded-md">244,170</div>
                        </td>
                    </tr>
                    <tr>
                        <td className="p-2 border border-gray-400">24 Carat</td>
                        <td className="p-2 border border-gray-400">
                            <div className="bg-gray-300 p-2 rounded-md">223,823</div>
                        </td>
                        <td className="p-2 border border-gray-400">
                            <div className="bg-gray-300 p-2 rounded-md">223,823</div>
                        </td>
                        <td className="p-2 border border-gray-400">
                            <div className="bg-gray-300 p-2 rounded-md">223,823</div>
                        </td>
                        <td className="p-2 border border-gray-400">
                            <div className="bg-gray-300 p-2 rounded-md">223,823</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    );
};


function GoldComparisonTable() {
    return (
        <div className='py-8'>
            <h2 className="text-3xl font-bold  mb-4 px-2">
                24 Carat and 22 Carat Gold: Know the Difference
            </h2>
            <div className="  bg-gray-300 p-4 rounded-lg ">
                <table className="w-full border  text-left p-4 rounded-xl overflow-hidden">
                    <thead className="">
                        <tr>
                            <th className="p-3 border bg-white text-lg">24 Carat Gold</th>
                            <th className="p-3 border bg-white text-lg">22 Carat Gold</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        <tr className="border">
                            <td className="p-3 border">
                                It is the purest form of gold and contains 99.5% of the precious yellow metal.
                            </td>
                            <td className="p-3 border">
                                It has 91.6% parts of pure gold. Rest of the parts are metals such as silver, copper, or some others.
                            </td>
                        </tr>
                        <tr className="border">
                            <td className="p-3 border">It is quite soft, pliable, brittle, and bendable.</td>
                            <td className="p-3 border">It has a hard texture and thus cannot be easily moulded or bended.</td>
                        </tr>

                        <tr className="border">
                            <td className="p-3 border">
                                It is mostly used in medical and electrical equipment including computers, phones, and more.
                            </td>
                            <td className="p-3 border">
                                It is relatively inexpensive due to a lesser percentage of pure gold.
                            </td>
                        </tr>

                        <tr className="border">
                            <td className="p-3 border">This is the most expensive form of gold.</td>
                            <td className="p-3 border">
                                It is mostly used for making jewellery, bars, bullions, and coins.
                            </td>
                        </tr>

                        <tr className="border">
                            <td className="p-3 border">It is bright yellow in color.</td>
                            <td className="p-3 border">
                                It is usually tainted due to the presence of other metals.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}


function GoldRatesCitywise() {
    const cities = [
        ["Multan", "Jhelum", "Chakwal"],
        ["Quetta", "Rawalpindi", "Sialkot"],
        ["Islamabad", "Sargodha", "Nawabshah"],
        ["Lahore", "Karachi", "Gujrat"],
    ];

    return (
        <div className="p-6 bg-gray-300 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Gold Rates Citywise List</h2>

            <div className="space-y-3">
                {cities.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-3 rounded-lg shadow-sm">
                        {row.map((city, colIndex) => (
                            <label key={colIndex} className="flex items-center space-x-2">
                                <input type="checkbox" className="w-5 h-5 accent-gray-600" />
                                <span>{city}</span>
                            </label>
                        ))}
                    </div>
                ))}
            </div>
        </div>

    );
}


function GoldRate() {
    return (
        <div className=''>
            <AdBanner />
            <div className='md:px-48 px-4 py-8 container mx-auto'>
                <div className='flex items-center gap-1 flex-wrap'>
                    <h6 className='text-red-500'>Home</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Specification</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Product Name</h6>
                </div>


                <div className='relative py-10'>
                    <h4 className='md:text-5xl text-2xl md:mt-0 mt-10 text-center font-bold '>Gold Price in Pakistan</h4>
                    <div className="flex absolute top-5 -right-4 items-center space-x-1 px-5 py-2  rounded-full w-fit ">
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

                <div className='border border-black rounded-xl grid grid-cols-2 bg-white  '>
                    <div className='border-r border-black p-5 text-center'>
                        <h2 className='text-3xl mb-1 font-bold'>244,170</h2>
                        <p className='text-base font-semibold text-red-500'>24 Carat Gold Rate (10 grams)</p>
                    </div>
                    <div className='p-5 text-center'>
                        <h2 className='text-3xl mb-1 font-bold'>244,170</h2>
                        <p className='text-base font-semibold text-red-500'>24 Carat Gold Rate (10 grams)</p>
                    </div>
                </div>

                <div className='my-16'>
                    <h4 className='text-3xl font-bold mb-3'> Gold Rate Today in Pakistan</h4>
                    <GoldRateTable />
                    <p className='text-lg font-semibold mt-5 px-5'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                </div>
            </div>

            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>
            <div className='md:px-48 px-4 py-8 container mx-auto'>
                <PriceTable />
                <PriceTable />

            </div>


            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

            <div className='md:px-48 px-4 py-8 container mx-auto'>
                <PriceTable />
            </div>

            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

            <div className='md:px-48 px-4 py-8 container mx-auto'>
                <GoldRateCalculator />
                <div className='py-10'>
                    <h4 className='font-semibold text-3xl mb-4'>
                        Know About Gold Price
                    </h4>
                    <h6 className='text-xl mb-4 font-semibold '>24 Carat Gold</h6>
                    <p className='text-lg mb-4'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                    <h6 className='text-xl mb-4 font-semibold '>22 Carat Gold</h6>
                    <p className='text-lg mb-4'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </div>

                <Image src={"/website/assets/images/banner/01.png"} width={1000} height={1000} alt="banner" className="w-full h-[400px]" />

                <GoldComparisonTable />
                <div className='py-6'>
                    <h4 className='font-bold text-3xl mb-4'>
                        Know About Gold Price
                    </h4>

                    <p className='text-lg mb-4'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>

                </div>
            </div>

            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

            <div className='md:px-48 px-4 py-8 container mx-auto'>
                <GoldRatesCitywise />
                <div className='py-6'>
                    <h4 className='font-bold text-2xl sm:text-3xl mb-4'>
                        Gold Weight Conversion Table
                    </h4>
                    <p className='text-lg mb-4'>
                        Refer to the following table to find out the value of gold in different units. Gold is often measured in grams, kilograms, troy ounce, bhats, and tonnes.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(18)].map((_, i) => (
                            <div key={i} className='bg-white rounded-lg border py-3 border-black text-center font-bold'>
                                To Convert From
                            </div>
                        ))}
                    </div>
                    <button className='w-full py-4 text-white bg-red-500 rounded-xl mt-6 font-bold'>
                        See All
                    </button>
                </div>
            </div>

            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

        </div>
    )
}

export default GoldRate
