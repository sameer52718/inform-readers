"use client";

import { useState } from "react";

export default function LbsToNewtonsConverter() {
  const [lbs, setLbs] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertLbsToNewtons = () => {
    const lbsValue = parseFloat(lbs);
    if (isNaN(lbsValue) || lbsValue < 0) {
      setResult("Result: Please enter a valid non-negative number");
      return;
    }
    const newtons = lbsValue * 4.4482216153;
    const formattedNewtons = newtons.toFixed(6).replace(/\.?0+$/, "");
    setResult(`Result: ${lbsValue} lbf = ${formattedNewtons} N`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">lbs to Newtons</h2>
        <input
          type="number"
          value={lbs}
          onChange={(e) => setLbs(e.target.value)}
          placeholder="Enter lbs"
          step="any"
          min="0"
          className="p-2 w-11/12 mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertLbsToNewtons}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
