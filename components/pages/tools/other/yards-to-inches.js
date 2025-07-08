"use client";

import { useState } from "react";

export default function Home() {
  const [yards, setYards] = useState("");
  const [result, setResult] = useState("");

  const convertYardsToInches = () => {
    const yardsValue = parseFloat(yards);
    if (!isNaN(yardsValue)) {
      const inches = yardsValue * 36;
      setResult(`${yardsValue} yards = ${inches.toFixed(3)} inches`);
    } else {
      setResult("Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">Yards to Inches</h2>
        <input
          type="number"
          value={yards}
          onChange={(e) => setYards(e.target.value)}
          placeholder="Enter yards"
          step="any"
          className="p-2 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertYardsToInches}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
