"use client";

import { useState } from "react";

export default function Home() {
  const [ml, setMl] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertMlToLiters = () => {
    const mlValue = parseFloat(ml);
    if (!isNaN(mlValue)) {
      const liters = mlValue / 1000;
      setResult(`Result: ${mlValue} ml = ${liters.toFixed(3)} liters`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">ML to Liters</h2>
        <input
          type="number"
          value={ml}
          onChange={(e) => setMl(e.target.value)}
          placeholder="Enter milliliters"
          step="any"
          className="p-3 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertMlToLiters}
          className="p-3 bg-red-500 text-white border-none rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
