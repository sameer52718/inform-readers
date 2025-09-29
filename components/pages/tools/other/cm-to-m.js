"use client";

import { useState } from "react";

export default function CmToMetersConverter() {
  const [cm, setCm] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertCmToMeters = () => {
    const cmValue = parseFloat(cm);
    if (!isNaN(cmValue)) {
      const meters = cmValue / 100;
      setResult(`Result: ${cmValue} cm = ${meters.toFixed(3)} meters`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">CM to Meters</h2>
        <input
          type="number"
          value={cm}
          onChange={(e) => setCm(e.target.value)}
          placeholder="Enter centimeters"
          step="any"
          className="p-2 w-11/12 mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertCmToMeters}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
