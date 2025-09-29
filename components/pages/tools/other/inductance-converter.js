"use client";

import { useState } from "react";

export default function InductanceConverter() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("H");
  const [toUnit, setToUnit] = useState("H");
  const [result, setResult] = useState("");

  const units = [
    { value: "H", label: "henry [H]" },
    { value: "EH", label: "exahenry [EH]" },
    { value: "PH", label: "petahenry [PH]" },
    { value: "TH", label: "terahenry [TH]" },
    { value: "GH", label: "gigahenry [GH]" },
    { value: "MH", label: "megahenry [MH]" },
    { value: "kH", label: "kilohenry [kH]" },
    { value: "hH", label: "hectohenry [hH]" },
    { value: "daH", label: "dekahenry [daH]" },
    { value: "dH", label: "decihenry [dH]" },
    { value: "cH", label: "centihenry [cH]" },
    { value: "mH", label: "millihenry [mH]" },
    { value: "µH", label: "microhenry [µH]" },
    { value: "nH", label: "nanohenry [nH]" },
    { value: "pH", label: "picohenry [pH]" },
    { value: "fH", label: "femtohenry [fH]" },
    { value: "aH", label: "attohenry [aH]" },
    { value: "Wb/A", label: "weber/ampere [Wb/A]" },
    { value: "abH", label: "abhenry [abH]" },
    { value: "EMU", label: "EMU of inductance" },
    { value: "stH", label: "stathenry [stH]" },
    { value: "ESU", label: "ESU of inductance" },
  ];

  const toHenry = {
    H: 1,
    EH: 1.0e18,
    PH: 1.0e15,
    TH: 1000000000000,
    GH: 1000000000,
    MH: 1000000,
    kH: 1000,
    hH: 100,
    daH: 10,
    dH: 0.1,
    cH: 0.01,
    mH: 0.001,
    µH: 1.0e-6,
    nH: 1.0e-9,
    pH: 1.0e-12,
    fH: 1.0e-15,
    aH: 1.0e-18,
    "Wb/A": 1,
    abH: 1.0e-9,
    EMU: 1.0e-9,
    stH: 898755200000,
    ESU: 898755200000,
  };

  const convert = () => {
    if (!inputValue.trim()) {
      setResult("Please enter a value");
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Please enter a valid number");
      return;
    }

    if (!(fromUnit in toHenry) || !(toUnit in toHenry)) {
      setResult("Invalid unit selected");
      return;
    }

    const resultValue = (value * toHenry[fromUnit]) / toHenry[toUnit];
    let formattedResult;
    if (Math.abs(resultValue) > 1e6 || (Math.abs(resultValue) < 1e-3 && resultValue !== 0)) {
      formattedResult = resultValue.toExponential(6);
    } else {
      formattedResult = resultValue.toFixed(6).replace(/\.?0+$/, "");
    }
    setResult(`${value} ${fromUnit} = ${formattedResult} ${toUnit}`);
  };

  return (
    <div className="flex justify-center items-center  bg-white p-4">
      <div className="bg-gray-100 rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-red-500 mb-5">Inductance Converter</h1>
        <div className="mb-4">
          <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          <input
            type="number"
            id="inputValue"
            step="any"
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="fromUnit" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="toUnit" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-red-500"
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
          className="w-full p-2 bg-red-500 text-white rounded-md font-bold hover:bg-red-600 transition duration-300"
        >
          Convert
        </button>
        <div className="mt-5 text-center text-base text-gray-800">{result}</div>
      </div>
    </div>
  );
}
