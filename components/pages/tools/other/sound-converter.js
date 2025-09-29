"use client";

import { useState } from "react";

export default function SoundConverter() {
  const units = [
    { value: "dB", label: "Decibel (dB)" },
    { value: "B", label: "Bel (B)" },
    { value: "Np", label: "Neper (Np)" },
    { value: "Pa", label: "Pascal (Pa)" },
    { value: "sone", label: "Sone" },
    { value: "phon", label: "Phon" },
    { value: "Hz", label: "Hertz (Hz)" },
  ];

  const to_dB = {
    dB: (val) => val,
    B: (val) => val * 10,
    Np: (val) => val * 8.686,
    Pa: (val) => 20 * Math.log10(val / 20e-6),
    sone: (val) => 40 + 10 * Math.log2(val),
    phon: (val) => val,
  };

  const from_dB = {
    dB: (val) => val,
    B: (val) => val / 10,
    Np: (val) => val / 8.686,
    Pa: (val) => 20e-6 * Math.pow(10, val / 20),
    sone: (val) => Math.pow(2, (val - 40) / 10),
    phon: (val) => val,
  };

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("dB");
  const [toUnit, setToUnit] = useState("dB");
  const [result, setResult] = useState("");

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('<span className="text-red-500">Please enter a valid number</span>');
      return;
    }

    if (fromUnit === "Hz" || toUnit === "Hz") {
      setResult(
        '<span className="text-red-500">Hertz (Hz) cannot be converted to/from other units as it measures frequency.</span>'
      );
      return;
    }

    if (fromUnit === "sone" && value <= 0) {
      setResult('<span className="text-red-500">Sone value must be positive</span>');
      return;
    }

    if (!(fromUnit in to_dB) || !(toUnit in from_dB)) {
      setResult('<span className="text-red-500">Invalid unit selected</span>');
      return;
    }

    try {
      const valueIn_dB = to_dB[fromUnit](value);
      const resultValue = from_dB[toUnit](valueIn_dB);

      if (toUnit === "sone" && resultValue <= 0) {
        setResult('<span className="text-red-500">Resulting sone value is invalid (must be positive)</span>');
        return;
      }

      setResult(`${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
    } catch (error) {
      setResult('<span className="text-red-500">Conversion error</span>');
    }
  };

  return (
    <div className=" bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 p-5 rounded-lg max-w-md w-full shadow-lg">
        <h1 className="text-red-500 text-2xl text-center mb-5">Sound Converter</h1>
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
        <div className="text-red-500 text-xs text-center mt-2">
          Note: Hertz (Hz) measures frequency and cannot be converted to other units.
        </div>
      </div>
    </div>
  );
}
