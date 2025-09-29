"use client";

import { useState } from "react";

export default function CmToFeetConverter() {
  const [cm, setCm] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertCmToFeet = () => {
    const cmValue = parseFloat(cm);
    if (!isNaN(cmValue)) {
      const feet = cmValue * 0.0328084;
      setResult(`Result: ${cmValue} cm = ${feet.toFixed(3)} feet`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-9 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">CM to Feet</h2>
        <input
          type="number"
          value={cm}
          onChange={(e) => setCm(e.target.value)}
          placeholder="Enter centimeters"
          step="any"
          className="p-3 w-11/12 mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertCmToFeet}
          className="p-3 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
