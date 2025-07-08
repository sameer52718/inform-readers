"use client";

import { useState } from "react";

export default function Home() {
  const [joule, setJoule] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertJToKj = () => {
    const value = parseFloat(joule);
    if (!isNaN(value)) {
      const kj = value * 0.001;
      setResult(`Result: ${value} J = ${kj.toFixed(6)} kJ`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-xs text-center">
        <h2 className="text-red-500 text-2xl mb-5">J to kJ</h2>
        <input
          type="number"
          value={joule}
          onChange={(e) => setJoule(e.target.value)}
          placeholder="Enter J"
          step="any"
          className="w-[85%] p-2 mb-4 border-2 border-red-500 rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertJToKj}
          className="w-full p-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
