"use client";

import { useState } from "react";

export default function FlowConverter() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Cubic meter/second [m³/s]");
  const [toUnit, setToUnit] = useState("Cubic meter/second [m³/s]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "Cubic meter/second [m³/s]", cubicMeterPerSecond: 1 },
    { name: "Cubic meter/day [m³/d]", cubicMeterPerSecond: 1.15741e-5 },
    { name: "Cubic meter/hour [m³/h]", cubicMeterPerSecond: 0.0002777778 },
    { name: "Cubic meter/minute [m³/min]", cubicMeterPerSecond: 0.0166666667 },
    { name: "Cubic centimeter/day [cm³/d]", cubicMeterPerSecond: 1.1574074074074e-11 },
    { name: "Cubic centimeter/hour [cm³/h]", cubicMeterPerSecond: 2.7777777777778e-10 },
    { name: "Cubic centimeter/minute [cm³/min]", cubicMeterPerSecond: 1.6666666666667e-8 },
    { name: "Cubic centimeter/second [cm³/s]", cubicMeterPerSecond: 1.0e-6 },
    { name: "Liter/day [L/d]", cubicMeterPerSecond: 1.1574074074074e-8 },
    { name: "Liter/hour [L/h]", cubicMeterPerSecond: 2.7777777777778e-7 },
    { name: "Liter/minute [L/min]", cubicMeterPerSecond: 1.66667e-5 },
    { name: "Liter/second [L/s]", cubicMeterPerSecond: 0.001 },
    { name: "Milliliter/day [mL/d]", cubicMeterPerSecond: 1.1574074074074e-11 },
    { name: "Milliliter/hour [mL/h]", cubicMeterPerSecond: 2.7777777777778e-10 },
    { name: "Milliliter/minute [mL/min]", cubicMeterPerSecond: 1.6666666666667e-8 },
    { name: "Milliliter/second [mL/s]", cubicMeterPerSecond: 1.0e-6 },
    { name: "Gallon (US)/day [gal (US)/d]", cubicMeterPerSecond: 4.3812636388889e-8 },
    { name: "Gallon (US)/hour [gal (US)/h]", cubicMeterPerSecond: 1.0515032733333e-6 },
    { name: "Gallon (US)/minute [gal (US)/min]", cubicMeterPerSecond: 6.30902e-5 },
    { name: "Gallon (US)/second [gal (US)/s]", cubicMeterPerSecond: 0.0037854118 },
    { name: "Gallon (UK)/day [gal (UK)/d]", cubicMeterPerSecond: 5.2616782407407e-8 },
    { name: "Gallon (UK)/hour [gal (UK)/h]", cubicMeterPerSecond: 1.2628027777778e-6 },
    { name: "Gallon (UK)/minute [gal (UK)/min]", cubicMeterPerSecond: 7.57682e-5 },
    { name: "Gallon (UK)/second [gal (UK)/s]", cubicMeterPerSecond: 0.00454609 },
    { name: "Kilobarrel (US)/day [kbbl (US)/d]", cubicMeterPerSecond: 0.0018401307 },
    { name: "Barrel (US)/day [bbl (US)/d]", cubicMeterPerSecond: 1.8401307283333e-6 },
    { name: "Barrel (US)/hour [bbl (US)/h]", cubicMeterPerSecond: 4.41631e-5 },
    { name: "Barrel (US)/minute [bbl (US)/min]", cubicMeterPerSecond: 0.0026497882 },
    { name: "Barrel (US)/second [bbl (US)/s]", cubicMeterPerSecond: 0.1589872949 },
    { name: "Acre-foot/year [ac·ft/y]", cubicMeterPerSecond: 3.91136e-5 },
    { name: "Acre-foot/day [ac·ft/d]", cubicMeterPerSecond: 0.0142764673 },
    { name: "Acre-foot/hour [ac·ft/h]", cubicMeterPerSecond: 0.3426352143 },
    { name: "Hundred-cubic foot/day [100 ft³/d]", cubicMeterPerSecond: 3.27741e-5 },
    { name: "Hundred-cubic foot/hour [100 ft³/h]", cubicMeterPerSecond: 0.0007865791 },
    { name: "Hundred-cubic foot/minute [100 ft³/min]", cubicMeterPerSecond: 0.0471947443 },
    { name: "Ounce/hour [oz/h]", cubicMeterPerSecond: 8.2148693229167e-9 },
    { name: "Ounce/minute [oz/min]", cubicMeterPerSecond: 4.92892159375e-7 },
    { name: "Ounce/second [oz/s]", cubicMeterPerSecond: 2.95735e-5 },
    { name: "Ounce (UK)/hour [oz (UK)/h]", cubicMeterPerSecond: 7.8925178504774e-9 },
    { name: "Ounce (UK)/minute [oz (UK)/min]", cubicMeterPerSecond: 4.7355107102865e-7 },
    { name: "Ounce (UK)/second [oz (UK)/s]", cubicMeterPerSecond: 2.84131e-5 },
    { name: "Cubic yard/hour [yd³/h]", cubicMeterPerSecond: 0.0002123763 },
    { name: "Cubic yard/minute [yd³/min]", cubicMeterPerSecond: 0.012742581 },
    { name: "Cubic yard/second [yd³/s]", cubicMeterPerSecond: 0.764554858 },
    { name: "Cubic foot/hour [ft³/h]", cubicMeterPerSecond: 7.86579072e-6 },
    { name: "Cubic foot/minute [ft³/min]", cubicMeterPerSecond: 0.0004719474 },
    { name: "Cubic foot/second [ft³/s]", cubicMeterPerSecond: 0.0283168466 },
    { name: "Cubic inch/hour [in³/h]", cubicMeterPerSecond: 4.5519622224454e-9 },
    { name: "Cubic inch/minute [in³/min]", cubicMeterPerSecond: 2.7311773333333e-7 },
    { name: "Cubic inch/second [in³/s]", cubicMeterPerSecond: 1.63871e-5 },
    { name: "Pound/second (Gasoline at 15.5°C) [lb/s]", cubicMeterPerSecond: 0.0006135189 },
    { name: "Pound/minute (Gasoline at 15.5°C) [lb/min]", cubicMeterPerSecond: 1.02253e-5 },
    { name: "Pound/hour (Gasoline at 15.5°C) [lb/h]", cubicMeterPerSecond: 1.704219244213e-7 },
    { name: "Pound/day (Gasoline at 15.5°C) [lb/d]", cubicMeterPerSecond: 7.1009135150463e-9 },
    { name: "Kilogram/second (Gasoline at 15.5°C) [kg/s]", cubicMeterPerSecond: 0.0013525777 },
    { name: "Kilogram/minute (Gasoline at 15.5°C) [kg/min]", cubicMeterPerSecond: 2.2543e-5 },
    { name: "Kilogram/hour (Gasoline at 15.5°C) [kg/h]", cubicMeterPerSecond: 3.7571602974537e-7 },
    { name: "Kilogram/day (Gasoline at 15.5°C) [kg/d]", cubicMeterPerSecond: 1.5654834571759e-8 },
  ];

  const convertFlow = () => {
    if (!inputValue.trim()) {
      setResult("Result: Please enter a value");
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      setResult("Result: Please enter a valid non-negative number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    try {
      const cubicMeterPerSecond = value * fromUnitData.cubicMeterPerSecond;
      const resultValue = cubicMeterPerSecond / toUnitData.cubicMeterPerSecond;
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
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Flow Converter</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">
              Enter Value
            </label>
            <input
              type="number"
              id="inputValue"
              step="any"
              min="0"
              placeholder="Enter value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
            onClick={convertFlow}
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
