"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m3");
  const [toUnit, setToUnit] = useState("m3");
  const [result, setResult] = useState("");

  const toCubicMeter = {
    m3: 1,
    ft3: 0.0283168466,
    in3: 0.0000163871,
    boardFeet: 0.0023597372,
    thousandBoardFeet: 2.3597372158,
    cord: 3.6245563633,
    cord80: 2.2653477275,
    cordFeet: 0.4530695455,
    cunit: 2.8316846593,
    pallet: 0.0401155327,
    crossTie: 0.0943894886,
    switchTie: 0.1486634446,
    msf18: 0.294967152,
    msf14: 0.5899343039,
    msf38: 0.8849014561,
    msf12: 1.179868608,
    msf34: 1.7698029121,
  };

  const units = Object.keys(toCubicMeter);

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('<span className="text-red-500">Please enter a valid number</span>');
      return;
    }

    if (!(fromUnit in toCubicMeter) || !(toUnit in toCubicMeter)) {
      setResult('<span className="text-red-500">Invalid unit selected</span>');
      return;
    }

    const valueInCubicMeter = value * toCubicMeter[fromUnit];
    const resultValue = valueInCubicMeter / toCubicMeter[toUnit];
    setResult(`${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-5 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-red-500 text-2xl text-center mb-5">Volume - Lumber Converter</h1>
        <div className="mb-4">
          <label htmlFor="inputValue" className="block mb-1 text-sm">
            Value
          </label>
          <input
            type="number"
            id="inputValue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="w-full p-2 bg-gray-200 border-none rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="fromUnit" className="block mb-1 text-sm">
              From
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 border-none rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="toUnit" className="block mb-1 text-sm">
              To
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 border-none rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={convert}
          className="w-full p-2 bg-red-500 text-white font-bold border-none rounded-md cursor-pointer hover:bg-red-600"
        >
          Convert
        </button>
        <div
          className="mt-5 text-base text-gray-800 text-center"
          dangerouslySetInnerHTML={{ __html: result }}
        />
      </div>
    </div>
  );
}
