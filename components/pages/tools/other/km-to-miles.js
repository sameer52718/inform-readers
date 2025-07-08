"use client";

import { useState } from "react";

export default function Home() {
  const [km, setKm] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertKmToMiles = () => {
    const kmValue = parseFloat(km);
    if (!isNaN(kmValue)) {
      const miles = kmValue * 0.621371;
      setResult(`Result: ${kmValue} km = ${miles.toFixed(3)} miles`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">KM to Miles</h2>
        <input
          type="number"
          value={km}
          onChange={(e) => setKm(e.target.value)}
          placeholder="Enter kilometers"
          step="any"
          className="p-3 w-[80%] mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertKmToMiles}
          className="p-3 bg-red-500 text-white border-none rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
