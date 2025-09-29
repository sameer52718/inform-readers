"use client";

import { useState } from "react";

export default function NewtonsToLbsConverter() {
  const [newtons, setNewtons] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertNewtonsToLbs = () => {
    const newtonsValue = parseFloat(newtons);
    if (isNaN(newtonsValue) || newtonsValue < 0) {
      setResult("Result: Please enter a valid non-negative number");
      return;
    }
    const lbs = newtonsValue / 4.4482216153;
    const formattedLbs = lbs.toFixed(6).replace(/\.?0+$/, "");
    setResult(`Result: ${newtonsValue} N = ${formattedLbs} lbf`);
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">Newtons to lbs</h2>
        <input
          type="number"
          value={newtons}
          onChange={(e) => setNewtons(e.target.value)}
          placeholder="Enter Newtons"
          step="any"
          min="0"
          className="p-2 w-11/12 mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertNewtonsToLbs}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
