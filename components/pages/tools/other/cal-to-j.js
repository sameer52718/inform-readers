"use client";

import { useState } from "react";

export default function Home() {
  const [cal, setCal] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertCalToJ = () => {
    const value = parseFloat(cal);
    if (!isNaN(value)) {
      const joule = value * 4.1868;
      setResult(`Result: ${value} cal = ${joule.toFixed(2)} J`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-xs text-center">
        <h2 className="text-red-500 text-2xl mb-5">cal to J</h2>
        <input
          type="number"
          value={cal}
          onChange={(e) => setCal(e.target.value)}
          placeholder="Enter cal"
          step="any"
          className="w-[85%] p-2 mb-4 border-2 border-red-500 rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertCalToJ}
          className="w-full p-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
