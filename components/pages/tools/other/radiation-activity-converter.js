"use client";

import { useState } from "react";

export default function RadiationActivityConverter() {
  const units = [
    { value: "Bq", label: "becquerel [Bq]" },
    { value: "TBq", label: "terabecquerel [TBq]" },
    { value: "GBq", label: "gigabecquerel [GBq]" },
    { value: "MBq", label: "megabecquerel [MBq]" },
    { value: "kBq", label: "kilobecquerel [kBq]" },
    { value: "mBq", label: "millibecquerel [mBq]" },
    { value: "Ci", label: "curie [Ci]" },
    { value: "kCi", label: "kilocurie [kCi]" },
    { value: "mCi", label: "millicurie [mCi]" },
    { value: "µCi", label: "microcurie [µCi]" },
    { value: "nCi", label: "nanocurie [nCi]" },
    { value: "pCi", label: "picocurie [pCi]" },
    { value: "rutherford", label: "rutherford" },
    { value: "1/s", label: "one/second [1/s]" },
    { value: "dis/s", label: "disintegrations/second" },
    { value: "dis/min", label: "disintegrations/minute" },
  ];

  const toBecquerel = {
    Bq: 1,
    TBq: 1000000000000,
    GBq: 1000000000,
    MBq: 1000000,
    kBq: 1000,
    mBq: 0.001,
    Ci: 37000000000,
    kCi: 37000000000000,
    mCi: 37000000,
    µCi: 37000,
    nCi: 37,
    pCi: 0.037,
    rutherford: 1000000,
    "1/s": 1,
    "dis/s": 1,
    "dis/min": 0.0166666667,
  };

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Bq");
  const [toUnit, setToUnit] = useState("Bq");
  const [result, setResult] = useState("");

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('<span className="text-red-500">Please enter a valid number</span>');
      return;
    }

    if (!(fromUnit in toBecquerel) || !(toUnit in toBecquerel)) {
      setResult('<span className="text-red-500">Invalid unit selected</span>');
      return;
    }

    const valueInBecquerel = value * toBecquerel[fromUnit];
    const resultValue = valueInBecquerel / toBecquerel[toUnit];
    setResult(`${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 p-5 rounded-lg max-w-md w-full shadow-lg">
        <h1 className="text-red-500 text-2xl text-center mb-5">Radiation-Activity Converter</h1>
        <div className="mb-4">
          <label htmlFor="inputValue" className="block text-sm mb-1">
            Value
          </label>
          <input
            type="number"
            id="inputValue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="w-full p-2 bg-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="fromUnit" className="block text-sm mb-1">
              From
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="toUnit" className="block text-sm mb-1">
              To
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={convert}
          className="w-full p-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition"
        >
          Convert
        </button>
        <div className="mt-5 text-center text-base" dangerouslySetInnerHTML={{ __html: result }} />
      </div>
    </div>
  );
}
