"use client";

import { useState } from "react";

export default function LitersToMlConverter() {
  const [liters, setLiters] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertLitersToMl = () => {
    const litersValue = parseFloat(liters);
    if (!isNaN(litersValue)) {
      const ml = litersValue * 1000;
      setResult(`Result: ${litersValue} liters = ${ml.toFixed(3)} ml`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">Liters to ML</h2>
        <input
          type="number"
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
          placeholder="Enter liters"
          step="any"
          className="p-2 w-11/12 mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertLitersToMl}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
