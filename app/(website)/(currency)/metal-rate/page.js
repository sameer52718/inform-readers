// "use client";

// import { useState, useEffect } from "react";
// import axiosInstance from "@/lib/axiosInstance";

// export default function MetalConverter() {
//   const [currencies, setCurrencies] = useState([]);
//   const [metalPrices, setMetalPrices] = useState([]);
//   const [metalCurrency, setMetalCurrency] = useState("USD");
//   const [metalAmount, setMetalAmount] = useState(10);
//   const [metalFromCurrency, setMetalFromCurrency] = useState("USD");
//   const [selectedMetal, setSelectedMetal] = useState("XAU");
//   const [metalResult, setMetalResult] = useState(null);
//   const [metalMetadata, setMetalMetadata] = useState(null);
//   const [error, setError] = useState(null);
//   const [metalTable, setMetalTable] = useState([]);
//   const [fetchedAt, setFetchedAt] = useState(null);

//   // Fetch available currencies and metals on mount
//   useEffect(() => {
//     const fetchCurrenciesAndMetals = async () => {
//       try {
//         const [currencyResponse, metalResponse] = await Promise.all([
//           axiosInstance.get("/website/currency"),
//           axiosInstance.get("/website/metal", { params: { currency: metalCurrency } }),
//         ]);

//         if (currencyResponse.data.success) {
//           setCurrencies(currencyResponse.data.currencies);
//         } else {
//           setError("Failed to load currencies");
//         }

//         if (metalResponse.data.success) {
//           setMetalPrices(metalResponse.data.metalPrices);
//         } else {
//           setError("Failed to load metal prices");
//         }
//       } catch (err) {
//         setError("Error fetching currencies or metal prices");
//       }
//     };
//     fetchCurrenciesAndMetals();
//   }, []);

//   // Fetch metal prices when metalCurrency changes
//   useEffect(() => {
//     const fetchMetalPrices = async () => {
//       try {
//         const response = await axiosInstance.get("/website/metal", {
//           params: { currency: metalCurrency },
//         });
//         if (response.data.success) {
//           setMetalPrices(response.data.metalPrices);
//         } else {
//           setError("Failed to load metal prices");
//         }
//       } catch (err) {
//         setError("Error fetching metal prices");
//       }
//     };
//     if (metalCurrency) fetchMetalPrices();
//   }, [metalCurrency]);

//   // Fetch metal conversion when metalFromCurrency or selectedMetal changes
//   useEffect(() => {
//     const fetchMetalConversion = async () => {
//       if (!metalFromCurrency || !selectedMetal) return;

//       try {
//         const response = await axiosInstance.get("/website/metal/convert", {
//           params: { amount: metalAmount, currency: metalFromCurrency, metalCode: selectedMetal },
//         });
//         if (response.data.success) {
//           setMetalResult(response.data.result);
//           setMetalMetadata(response.data.metadata);
//           setFetchedAt(response.data.fetchedAt);
//           setError(null);
//           calculateMetalConversion(metalAmount, response.data.metadata);
//         } else {
//           setError(response.data.message || "Failed to fetch metal conversion");
//           setMetalResult(null);
//           setMetalMetadata(null);
//           setMetalTable([]);
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || "Error fetching metal conversion");
//         setMetalResult(null);
//         setMetalMetadata(null);
//         setMetalTable([]);
//       }
//     };
//     fetchMetalConversion();
//   }, [metalFromCurrency, selectedMetal]);

//   // Perform client-side metal conversion
//   const calculateMetalConversion = (amt, metadata) => {
//     if (isNaN(amt) || amt <= 0) {
//       setError("Please enter a valid amount for metal conversion");
//       setMetalResult(null);
//       setMetalTable([]);
//       return;
//     }

//     const price = parseFloat(metadata?.metal?.price);
//     if (!price || price === 0) {
//       setError(`Price for ${metadata?.metal?.code || "selected metal"} not available or zero`);
//       setMetalResult(null);
//       setMetalTable([]);
//       return;
//     }

//     const quantity = (amt / price).toFixed(6);
//     setMetalResult(quantity);
//     setError(null);

//     // Generate metal conversion table
//     const amounts = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];
//     const table = amounts.map((val) => ({
//       amount: val,
//       converted: price !== 0 ? (val / price).toFixed(6) : "N/A",
//     }));
//     setMetalTable(table);
//   };

//   // Perform client-side calculations when metalAmount changes
//   useEffect(() => {
//     if (metalMetadata) {
//       calculateMetalConversion(metalAmount, metalMetadata);
//     }
//   }, [metalAmount, metalMetadata]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <section className="relative py-20 bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500">
//         <div className="container mx-auto px-4 max-w-6xl">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Metal Converter</h1>
//             <p className="text-xl text-white max-w-3xl mx-auto">
//               Calculate metal quantities with our reliable tool
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Metal Converter Section */}
//       <section className="py-16">
//         <div className="container mx-auto px-4 max-w-6xl">
//           <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
//             <h2 className="text-2xl font-semibold mb-6 text-gray-800">Metal Converter</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700">Amount</label>
//                 <input
//                   type="number"
//                   value={metalAmount}
//                   onChange={(e) => setMetalAmount(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Enter amount"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700">Currency</label>
//                 <select
//                   value={metalFromCurrency}
//                   onChange={(e) => setMetalFromCurrency(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   {currencies.map((currency) => (
//                     <option key={currency.baseCurrency} value={currency.baseCurrency}>
//                       {currency.baseCurrency} - {currency.fullName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700">Metal</label>
//                 <select
//                   value={selectedMetal}
//                   onChange={(e) => setSelectedMetal(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   {metalPrices.map((metal) => (
//                     <option key={metal.metalCode} value={metal.metalCode}>
//                       {metal.symbol} {metal.metalCode} - {metal.fullName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             {error && <div className="text-red-500 text-center mb-4">{error}</div>}
//             {metalResult && metalMetadata && (
//               <div className="text-center">
//                 <h3 className="text-2xl font-bold text-gray-800">
//                   {metalAmount} {metalMetadata.currency.symbol} ({metalMetadata.currency.code}) ={" "}
//                   {metalResult} {metalMetadata.metal.unit} of {metalMetadata.metal.fullName}
//                 </h3>
//                 <p className="text-gray-500 mt-2">
//                   Price per {metalMetadata.metal.unit}: {metalMetadata.metal.price}{" "}
//                   {metalMetadata.currency.code}
//                   <br />
//                   Last updated:{" "}
//                   {fetchedAt
//                     ? new Date(fetchedAt).toLocaleString("en-US", { timeZone: "Asia/Karachi" })
//                     : "N/A"}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Metal Prices Section */}
//           <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800">Metal Prices</h3>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2 text-gray-700">Select Currency</label>
//               <select
//                 value={metalCurrency}
//                 onChange={(e) => setMetalCurrency(e.target.value)}
//                 className="w-full max-w-xs p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 {currencies.map((currency) => (
//                   <option key={currency.baseCurrency} value={currency.baseCurrency}>
//                     {currency.baseCurrency} - {currency.fullName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {metalPrices.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {metalPrices.map((metal) => (
//                   <div key={metal.metalCode} className="p-4 bg-gray-100 rounded-md">
//                     <h4 className="font-medium text-gray-700">
//                       {metal.fullName} ({metal.symbol})
//                     </h4>
//                     <p>
//                       Price: {metal.price} {metalCurrency} ({metal.unit})
//                     </p>
//                     <p>
//                       Last Updated:{" "}
//                       {new Date(metal.fetchedAt).toLocaleString("en-US", { timeZone: "Asia/Karachi" })}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500">No metal prices available.</p>
//             )}
//           </div>

//           {/* Metal Conversion Table */}
//           {metalResult && metalTable.length > 0 && (
//             <div className="bg-white rounded-lg p-4 shadow-lg">
//               <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
//                 Convert {metalMetadata.currency.code} to {metalMetadata.metal.fullName} (
//                 {metalMetadata.metal.unit})
//               </h3>
//               <table className="w-full text-center">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="p-2 border">{metalMetadata.currency.code}</th>
//                     <th className="p-2 border">
//                       {metalMetadata.metal.fullName} ({metalMetadata.metal.unit})
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {metalTable.map((row) => (
//                     <tr key={row.amount} className="border">
//                       <td className="p-2">
//                         {row.amount} {metalMetadata.currency.code}
//                       </td>
//                       <td className="p-2">
//                         {row.converted} {metalMetadata.metal.unit}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";
import React from "react";
import HeroSection from "@/components/pages/converters/metal/HeroSection";
import ConverterSection from "@/components/pages/converters/metal/ConverterSection";
import MetalPricesSection from "@/components/pages/converters/metal/MetalPricesSection";
import ConversionTable from "@/components/pages/converters/metal/ConversionTable";
import { useMetalConverter } from "@/hooks/useMetalConverter";

function App() {
  const {
    currencies,
    metalPrices,
    metalCurrency,
    setMetalCurrency,
    metalAmount,
    setMetalAmount,
    metalFromCurrency,
    setMetalFromCurrency,
    selectedMetal,
    setSelectedMetal,
    metalResult,
    metalMetadata,
    error,
    metalTable,
    fetchedAt,
    isLoading,
  } = useMetalConverter();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <HeroSection
        title="Precious Metal Converter"
        subtitle="Convert currencies to precious metals with real-time market rates. Get accurate gold, silver, platinum, and other metal conversions instantly."
      />

      <ConverterSection
        currencies={currencies}
        metalPrices={metalPrices}
        metalAmount={metalAmount}
        setMetalAmount={setMetalAmount}
        metalFromCurrency={metalFromCurrency}
        setMetalFromCurrency={setMetalFromCurrency}
        selectedMetal={selectedMetal}
        setSelectedMetal={setSelectedMetal}
        error={error}
        metalResult={metalResult}
        metalMetadata={metalMetadata}
        fetchedAt={fetchedAt}
        isLoading={isLoading}
      />

      <MetalPricesSection
        currencies={currencies}
        metalPrices={metalPrices}
        metalCurrency={metalCurrency}
        setMetalCurrency={setMetalCurrency}
        isLoading={isLoading}
      />

      <ConversionTable metalTable={metalTable} metalMetadata={metalMetadata} />
    </div>
  );
}

export default App;
