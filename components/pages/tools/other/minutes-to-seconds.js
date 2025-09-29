"use client";

import { useState } from "react";

export default function Home() {
  const [minutes, setMinutes] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertMinutesToSeconds = () => {
    const value = parseFloat(minutes);
    if (!isNaN(value)) {
      const seconds = value * 60;
      setResult(`Result: ${value} minutes = ${seconds.toFixed(2)} seconds`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-xs text-center">
        <h2 className="text-red-500 text-2xl mb-5">Minutes to Seconds</h2>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="Enter minutes"
          step="any"
          className="w-[85%] p-2 mb-4 border-2 border-red-500 rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertMinutesToSeconds}
          className="w-full p-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
