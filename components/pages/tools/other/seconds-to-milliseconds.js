"use client";

import { useState } from "react";

export default function Home() {
  const [seconds, setSeconds] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertSecondsToMilliseconds = () => {
    const value = parseFloat(seconds);
    if (!isNaN(value)) {
      const milliseconds = value * 1000;
      setResult(`Result: ${value} seconds = ${milliseconds.toFixed(2)} milliseconds`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-xs text-center">
        <h2 className="text-red-500 text-2xl mb-5">Seconds to Milliseconds</h2>
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          placeholder="Enter seconds"
          step="any"
          className="w-[85%] p-2 mb-4 border-2 border-red-500 rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertSecondsToMilliseconds}
          className="w-full p-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
