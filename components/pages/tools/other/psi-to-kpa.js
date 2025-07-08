"use client";

import { useState } from "react";

export default function PsiToKpaConverter() {
  const [psi, setPsi] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertPsiToKpa = () => {
    const psiValue = parseFloat(psi);
    if (!isNaN(psiValue)) {
      const kpa = psiValue * 6.8947572931783;
      setResult(`Result: ${psiValue} psi = ${kpa.toFixed(2)} kPa`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">PSI to kPa</h2>
        <input
          type="number"
          value={psi}
          onChange={(e) => setPsi(e.target.value)}
          placeholder="Enter psi"
          step="any"
          className="p-2 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertPsiToKpa}
          className="px-5 py-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
