"use client";

import { useState } from "react";

export default function NmToFtlbConverter() {
  const [nm, setNm] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertNmToFtlb = () => {
    const nmValue = parseFloat(nm);
    if (!isNaN(nmValue)) {
      const ftlb = nmValue * 0.7375621493;
      setResult(`Result: ${nmValue} Nm = ${ftlb.toFixed(2)} ft lb`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">Nm to ft lb</h2>
        <input
          type="number"
          value={nm}
          onChange={(e) => setNm(e.target.value)}
          placeholder="Enter Nm"
          step="any"
          className="p-2 w-11/12 mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertNmToFtlb}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
