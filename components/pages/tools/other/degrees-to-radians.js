"use client";

import { useState } from "react";

export default function Home() {
  const [degrees, setDegrees] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertDegreesToRadians = () => {
    const value = parseFloat(degrees);
    if (!isNaN(value)) {
      const radians = value * 0.0174532925;
      setResult(`Result: ${value} ° = ${radians.toFixed(6)} rad`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl w-full max-w-xs text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-5">Degrees to Radians</h2>
        <input
          type="number"
          id="degrees"
          placeholder="Enter degrees"
          step="any"
          value={degrees}
          onChange={(e) => setDegrees(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertDegreesToRadians}
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
