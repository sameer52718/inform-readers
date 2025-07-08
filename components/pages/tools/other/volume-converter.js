"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("cubic meter [m^3]");
  const [toUnit, setToUnit] = useState("cubic meter [m^3]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "cubic meter [m^3]", toCubicMeter: 1 },
    { name: "cubic kilometer [km^3]", toCubicMeter: 1000000000 },
    { name: "cubic centimeter [cm^3]", toCubicMeter: 1.0e-6 },
    { name: "cubic millimeter [mm^3]", toCubicMeter: 1.0e-9 },
    { name: "liter [L, l]", toCubicMeter: 0.001 },
    { name: "milliliter [mL]", toCubicMeter: 1.0e-6 },
    { name: "gallon (US) [gal (US)]", toCubicMeter: 0.0037854118 },
    { name: "quart (US) [qt (US)]", toCubicMeter: 0.0009463529 },
    { name: "pint (US) [pt (US)]", toCubicMeter: 0.0004731765 },
    { name: "cup (US)", toCubicMeter: 0.0002365882 },
    { name: "tablespoon (US)", toCubicMeter: 1.47868e-5 },
    { name: "teaspoon (US)", toCubicMeter: 4.92892159375e-6 },
    { name: "cubic mile [mi^3]", toCubicMeter: 4168181825.4406 },
    { name: "cubic yard [yd^3]", toCubicMeter: 0.764554858 },
    { name: "cubic foot [ft^3]", toCubicMeter: 0.0283168466 },
    { name: "cubic inch [in^3]", toCubicMeter: 1.63871e-5 },
    { name: "cubic decimeter [dm^3]", toCubicMeter: 0.001 },
    { name: "exaliter [EL]", toCubicMeter: 1.0e15 },
    { name: "petaliter [PL]", toCubicMeter: 1000000000000 },
    { name: "teraliter [TL]", toCubicMeter: 1000000000 },
    { name: "gigaliter [GL]", toCubicMeter: 1000000 },
    { name: "megaliter [ML]", toCubicMeter: 1000 },
    { name: "kiloliter [kL]", toCubicMeter: 1 },
    { name: "hectoliter [hL]", toCubicMeter: 0.1 },
    { name: "dekaliter [daL]", toCubicMeter: 0.01 },
    { name: "deciliter [dL]", toCubicMeter: 0.0001 },
    { name: "centiliter [cL]", toCubicMeter: 1.0e-5 },
    { name: "microliter [µL]", toCubicMeter: 1.0e-9 },
    { name: "nanoliter [nL]", toCubicMeter: 1.0e-12 },
    { name: "picoliter [pL]", toCubicMeter: 1.0e-15 },
    { name: "femtoliter [fL]", toCubicMeter: 1.0e-18 },
    { name: "attoliter [aL]", toCubicMeter: 1.0e-21 },
    { name: "cc [cc, cm^3]", toCubicMeter: 1.0e-6 },
    { name: "drop", toCubicMeter: 5.0e-8 },
    { name: "barrel (oil) [bbl (oil)]", toCubicMeter: 0.1589872949 },
    { name: "barrel (US) [bbl (US)]", toCubicMeter: 0.1192404712 },
    { name: "barrel (UK) [bbl (UK)]", toCubicMeter: 0.16365924 },
    { name: "gallon (UK) [gal (UK)]", toCubicMeter: 0.00454609 },
    { name: "quart (UK) [qt (UK)]", toCubicMeter: 0.0011365225 },
    { name: "pint (UK) [pt (UK)]", toCubicMeter: 0.0005682613 },
    { name: "cup (metric)", toCubicMeter: 0.00025 },
    { name: "cup (UK)", toCubicMeter: 0.0002841306 },
    { name: "fluid ounce (US) [fl oz (US)]", toCubicMeter: 2.95735e-5 },
    { name: "fluid ounce (UK) [fl oz (UK)]", toCubicMeter: 2.84131e-5 },
    { name: "tablespoon (metric)", toCubicMeter: 1.5e-5 },
    { name: "tablespoon (UK)", toCubicMeter: 1.77582e-5 },
    { name: "dessertspoon (US)", toCubicMeter: 9.8578431875e-6 },
    { name: "dessertspoon (UK)", toCubicMeter: 1.18388e-5 },
    { name: "teaspoon (metric)", toCubicMeter: 5.0e-6 },
    { name: "teaspoon (UK)", toCubicMeter: 5.9193880208333e-6 },
    { name: "gill (US) [gi]", toCubicMeter: 0.0001182941 },
    { name: "gill (UK) [gi (UK)]", toCubicMeter: 0.0001420653 },
    { name: "minim (US)", toCubicMeter: 6.1611519921875e-8 },
    { name: "minim (UK)", toCubicMeter: 5.9193880208333e-8 },
    { name: "ton register [ton reg]", toCubicMeter: 2.8316846592 },
    { name: "ccf", toCubicMeter: 2.8316846592 },
    { name: "hundred-cubic foot", toCubicMeter: 2.8316846592 },
    { name: "acre-foot [ac*ft]", toCubicMeter: 1233.4818375475 },
    { name: "acre-foot (US survey)", toCubicMeter: 1233.4892384682 },
    { name: "acre-inch [ac*in]", toCubicMeter: 102.790153129 },
    { name: "dekastere", toCubicMeter: 10 },
    { name: "stere [st]", toCubicMeter: 1 },
    { name: "decistere", toCubicMeter: 0.1 },
    { name: "cord [cd]", toCubicMeter: 3.6245563638 },
    { name: "tun", toCubicMeter: 0.9539237696 },
    { name: "hogshead", toCubicMeter: 0.2384809424 },
    { name: "board foot", toCubicMeter: 0.0023597372 },
    { name: "dram [dr]", toCubicMeter: 3.6966911953125e-6 },
    { name: "cor (Biblical)", toCubicMeter: 0.22 },
    { name: "homer (Biblical)", toCubicMeter: 0.22 },
    { name: "bath (Biblical)", toCubicMeter: 0.022 },
    { name: "hin (Biblical)", toCubicMeter: 0.0036666667 },
    { name: "cab (Biblical)", toCubicMeter: 0.0012222222 },
    { name: "log (Biblical)", toCubicMeter: 0.0003055556 },
    { name: "Taza (Spanish)", toCubicMeter: 0.0002365882 },
    { name: "Earth's volume", toCubicMeter: 1.083e21 },
  ];

  const convertVolume = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Result: Please enter a valid number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    const cubicMeters = value * fromUnitData.toCubicMeter;
    const resultValue = cubicMeters / toUnitData.toCubicMeter;
    setResult(`Result: ${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Volume Converter</h2>
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
            onClick={convertVolume}
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
