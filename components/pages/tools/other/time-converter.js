"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("second [s]");
  const [toUnit, setToUnit] = useState("second [s]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "second [s]", toSecond: 1 },
    { name: "millisecond [ms]", toSecond: 0.001 },
    { name: "minute [min]", toSecond: 60 },
    { name: "hour [h]", toSecond: 3600 },
    { name: "day [d]", toSecond: 86400 },
    { name: "week", toSecond: 604800 },
    { name: "month", toSecond: 2628000 },
    { name: "year [y]", toSecond: 31557600 },
    { name: "decade", toSecond: 315576000 },
    { name: "century", toSecond: 3155760000 },
    { name: "millennium", toSecond: 31557600000 },
    { name: "microsecond [µs]", toSecond: 1.0e-6 },
    { name: "nanosecond [ns]", toSecond: 1.0e-9 },
    { name: "picosecond [ps]", toSecond: 1.0e-12 },
    { name: "femtosecond [fs]", toSecond: 1.0e-15 },
    { name: "attosecond [as]", toSecond: 1.0e-18 },
    { name: "shake", toSecond: 1.0e-8 },
    { name: "month (synodic)", toSecond: 2551443.84 },
    { name: "year (Julian)", toSecond: 31557600 },
    { name: "year (leap)", toSecond: 31622400 },
    { name: "year (tropical)", toSecond: 31556930 },
    { name: "year (sidereal)", toSecond: 31558149.54 },
    { name: "day (sidereal)", toSecond: 86164.09 },
    { name: "hour (sidereal)", toSecond: 3590.1704166667 },
    { name: "minute (sidereal)", toSecond: 59.8361736111 },
    { name: "second (sidereal)", toSecond: 0.9972695602 },
    { name: "fortnight", toSecond: 1209600 },
    { name: "septennial", toSecond: 220752000 },
    { name: "octennial", toSecond: 252288000 },
    { name: "novennial", toSecond: 283824000 },
    { name: "quindecennial", toSecond: 473040000 },
    { name: "quinquennial", toSecond: 157680000 },
    { name: "Planck time", toSecond: 5.39056e-44 },
  ];

  const convertTime = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Result: Please enter a valid number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    const second = value * fromUnitData.toSecond;
    const resultValue = second / toUnitData.toSecond;
    setResult(`Result: ${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Time Converter</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">
              Enter Value
            </label>
            <input
              type="number"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              step="any"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="fromUnit" className="block text-sm font-medium text-gray-700">
              From Unit
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit.name} value={unit.name}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="toUnit" className="block text-sm font-medium text-gray-700">
              To Unit
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit.name} value={unit.name}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={convertTime}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Convert
          </button>
          <div className="text-center text-lg font-medium text-gray-800 mt-4">{result}</div>
        </div>
      </div>
    </div>
  );
}
