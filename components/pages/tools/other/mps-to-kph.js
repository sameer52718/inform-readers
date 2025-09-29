"use client";

import { useState } from "react";

export default function MpsToKphConverter() {
  const [mps, setMps] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertMpsToKph = () => {
    const mpsValue = parseFloat(mps);
    if (!isNaN(mpsValue)) {
      const kph = mpsValue * 3.6;
      setResult(`Result: ${mpsValue} m/s = ${kph.toFixed(2)} kph`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">m/s to kph</h2>
        <input
          type="number"
          value={mps}
          onChange={(e) => setMps(e.target.value)}
          placeholder="Enter m/s"
          step="any"
          className="p-2 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertMpsToKph}
          className="px-5 py-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
