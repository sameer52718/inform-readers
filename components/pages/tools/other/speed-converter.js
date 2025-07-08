"use client";

import { useState } from "react";

export default function SpeedConverter() {
  const units = [
    { name: "meter/second [m/s]", toMeterSecond: 1 },
    { name: "kilometer/hour [km/h]", toMeterSecond: 0.2777777778 },
    { name: "mile/hour [mi/h]", toMeterSecond: 0.44704 },
    { name: "meter/hour [m/h]", toMeterSecond: 0.0002777778 },
    { name: "meter/minute [m/min]", toMeterSecond: 0.0166666667 },
    { name: "kilometer/minute [km/min]", toMeterSecond: 16.6666666667 },
    { name: "kilometer/second [km/s]", toMeterSecond: 1000 },
    { name: "centimeter/hour [cm/h]", toMeterSecond: 2.7777777777778e-6 },
    { name: "centimeter/minute [cm/min]", toMeterSecond: 0.0001666667 },
    { name: "centimeter/second [cm/s]", toMeterSecond: 0.01 },
    { name: "millimeter/hour [mm/h]", toMeterSecond: 2.7777777777778e-7 },
    { name: "millimeter/minute [mm/min]", toMeterSecond: 1.66667e-5 },
    { name: "millimeter/second [mm/s]", toMeterSecond: 0.001 },
    { name: "foot/hour [ft/h]", toMeterSecond: 8.46667e-5 },
    { name: "foot/minute [ft/min]", toMeterSecond: 0.00508 },
    { name: "foot/second [ft/s]", toMeterSecond: 0.3048 },
    { name: "yard/hour [yd/h]", toMeterSecond: 0.000254 },
    { name: "yard/minute [yd/min]", toMeterSecond: 0.01524 },
    { name: "yard/second [yd/s]", toMeterSecond: 0.9144 },
    { name: "mile/minute [mi/min]", toMeterSecond: 26.8224 },
    { name: "mile/second [mi/s]", toMeterSecond: 1609.344 },
    { name: "knot [kt, kn]", toMeterSecond: 0.5144444444 },
    { name: "knot (UK) [kt (UK)]", toMeterSecond: 0.5147733333 },
    { name: "Velocity of light in vacuum", toMeterSecond: 299792458 },
    { name: "Cosmic velocity - first", toMeterSecond: 7899.9999999999 },
    { name: "Cosmic velocity - second", toMeterSecond: 11200 },
    { name: "Cosmic velocity - third", toMeterSecond: 16670 },
    { name: "Earth's velocity", toMeterSecond: 29765 },
    { name: "Velocity of sound in pure water", toMeterSecond: 1482.6999999998 },
    { name: "Velocity of sound in sea water (20°C, 10 meter deep)", toMeterSecond: 1521.6 },
    { name: "Mach (20°C, 1 atm)", toMeterSecond: 343.6 },
    { name: "Mach (SI standard)", toMeterSecond: 295.0464000003 },
  ];

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState(units[0].name);
  const [toUnit, setToUnit] = useState(units[0].name);
  const [result, setResult] = useState("Result: ");

  const convertSpeed = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Result: Please enter a valid number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    try {
      const meterSecond = value * fromUnitData.toMeterSecond;
      const resultValue = meterSecond / toUnitData.toMeterSecond;
      let formattedResult;
      if (Math.abs(resultValue) > 1e6 || (Math.abs(resultValue) < 1e-3 && resultValue !== 0)) {
        formattedResult = resultValue.toExponential(6);
      } else {
        formattedResult = resultValue.toFixed(6).replace(/\.?0+$/, "");
      }
      setResult(`Result: ${value} ${fromUnit} = ${formattedResult} ${toUnit}`);
    } catch (error) {
      setResult("Result: Conversion error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Speed Converter</h2>
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
            onClick={convertSpeed}
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
