"use client";

import { useState } from "react";

export default function Home() {
  const [squareFeet, setSquareFeet] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertSquareFeetToSquareMeter = () => {
    const value = parseFloat(squareFeet);
    if (!isNaN(value)) {
      const squareMeters = value * 0.09290304;
      setResult(`Result: ${value} square feet = ${squareMeters.toFixed(2)} square meters`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl w-full max-w-xs text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-5">Square Feet to Square Meter</h2>
        <input
          type="number"
          id="squareFeet"
          placeholder="Enter square feet"
          step="any"
          value={squareFeet}
          onChange={(e) => setSquareFeet(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertSquareFeetToSquareMeter}
          className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition"
        >
          Convert
        </button>
        <div className="mt-5 text-lg font-medium text-gray-800">{result}</div>
        <style jsx>{`
          input:focus {
            outline: none;
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
}
