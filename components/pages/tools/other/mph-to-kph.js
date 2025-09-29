"use client";

import { useState } from "react";

export default function MphToKphConverter() {
  const [mph, setMph] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertMphToKph = () => {
    const mphValue = parseFloat(mph);
    if (!isNaN(mphValue)) {
      const kph = mphValue * 1.609344;
      setResult(`Result: ${mphValue} mph = ${kph.toFixed(2)} kph`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">mph to kph</h2>
        <input
          type="number"
          value={mph}
          onChange={(e) => setMph(e.target.value)}
          placeholder="Enter mph"
          step="any"
          className="p-2 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertMphToKph}
          className="px-5 py-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
