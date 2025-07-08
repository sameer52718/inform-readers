"use client";

import { useState } from "react";

export default function KjToJConverter() {
  const [kj, setKj] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertKjToJ = () => {
    const kjValue = parseFloat(kj);
    if (!isNaN(kjValue)) {
      const joule = kjValue * 1000;
      setResult(`Result: ${kjValue} kJ = ${joule.toFixed(2)} J`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">kJ to J</h2>
        <input
          type="number"
          value={kj}
          onChange={(e) => setKj(e.target.value)}
          placeholder="Enter kJ"
          step="any"
          className="p-2 w-11/12 mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertKjToJ}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
