"use client";

import { useState } from "react";

export default function Home() {
  const [teaspoons, setTeaspoons] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertTeaspoonsToMl = () => {
    const teaspoonsValue = parseFloat(teaspoons);
    if (!isNaN(teaspoonsValue)) {
      const ml = teaspoonsValue * 4.92892;
      setResult(`Result: ${teaspoonsValue} teaspoons = ${ml.toFixed(3)} ml`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">Teaspoon to ML</h2>
        <input
          type="number"
          value={teaspoons}
          onChange={(e) => setTeaspoons(e.target.value)}
          placeholder="Enter teaspoons"
          step="any"
          className="p-3 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertTeaspoonsToMl}
          className="p-3 bg-red-500 text-white border-none rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
