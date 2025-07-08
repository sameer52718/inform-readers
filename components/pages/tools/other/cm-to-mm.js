"use client";

import { useState } from "react";

export default function Home() {
  const [cm, setCm] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertCmToMm = () => {
    const cmValue = parseFloat(cm);
    if (!isNaN(cmValue)) {
      const mm = cmValue * 10;
      setResult(`Result: ${cmValue} cm = ${mm.toFixed(3)} mm`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-gray-100 p-9 rounded-2xl shadow-2xl text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">CM to MM</h2>
        <input
          type="number"
          value={cm}
          onChange={(e) => setCm(e.target.value)}
          placeholder="Enter centimeters"
          step="any"
          className="p-3 w-[90%] mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertCmToMm}
          className="p-3 bg-red-500 text-white border-none rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
