"use client";

import { useState } from "react";

export default function Home() {
  const [inches, setInches] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertInchesToCm = () => {
    const inchesValue = parseFloat(inches);
    if (!isNaN(inchesValue)) {
      const cm = inchesValue * 2.54;
      setResult(`Result: ${inchesValue} inches = ${cm.toFixed(3)} cm`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-gray-100 p-6 rounded-lg shadow-xl text-center w-72">
        <h2 className="text-red-500 text-xl mb-4">Inches to CM</h2>
        <input
          type="number"
          value={inches}
          onChange={(e) => setInches(e.target.value)}
          placeholder="Enter inches"
          step="any"
          className="p-2 w-[85%] mb-3 border border-red-500 rounded text-sm"
        />
        <button
          onClick={convertInchesToCm}
          className="p-2 bg-red-500 text-white border-none rounded cursor-pointer text-sm hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-4 text-base text-gray-800">{result}</div>
      </div>
    </div>
  );
}
