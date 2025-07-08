"use client";

import { useState } from "react";

const units = [
  { name: "watt [W]", toWatt: 1 },
  { name: "exawatt [EW]", toWatt: 1.0e18 },
  { name: "petawatt [PW]", toWatt: 1.0e15 },
  { name: "terawatt [TW]", toWatt: 1000000000000 },
  { name: "gigawatt [GW]", toWatt: 1000000000 },
  { name: "megawatt [MW]", toWatt: 1000000 },
  { name: "kilowatt [kW]", toWatt: 1000 },
  { name: "hectowatt [hW]", toWatt: 100 },
  { name: "dekawatt [daW]", toWatt: 10 },
  { name: "deciwatt [dW]", toWatt: 0.1 },
  { name: "centiwatt [cW]", toWatt: 0.01 },
  { name: "milliwatt [mW]", toWatt: 0.001 },
  { name: "microwatt [µW]", toWatt: 1.0e-6 },
  { name: "nanowatt [nW]", toWatt: 1.0e-9 },
  { name: "picowatt [pW]", toWatt: 1.0e-12 },
  { name: "femtowatt [fW]", toWatt: 1.0e-15 },
  { name: "attowatt [aW]", toWatt: 1.0e-18 },
  { name: "horsepower [hp, hp (UK)]", toWatt: 745.6998715823 },
  { name: "horsepower (550 ft*lbf/s)", toWatt: 745.6998715823 },
  { name: "horsepower (metric)", toWatt: 735.49875 },
  { name: "horsepower (boiler)", toWatt: 9809.5000000002 },
  { name: "horsepower (electric)", toWatt: 746 },
  { name: "horsepower (water)", toWatt: 746.043 },
  { name: "pferdestarke (ps)", toWatt: 735.49875 },
  { name: "Btu (IT)/hour [Btu/h]", toWatt: 0.2930710702 },
  { name: "Btu (IT)/minute [Btu/min]", toWatt: 17.5842642103 },
  { name: "Btu (IT)/second [Btu/s]", toWatt: 1055.05585262 },
  { name: "Btu (th)/hour [Btu (th)/h]", toWatt: 0.292875 },
  { name: "Btu (th)/minute", toWatt: 17.5724999996 },
  { name: "Btu (th)/second [Btu (th)/s]", toWatt: 1054.3499999744 },
  { name: "MBtu (IT)/hour [MBtu/h]", toWatt: 293071.07017222 },
  { name: "MBH", toWatt: 293.0710701722 },
  { name: "ton (refrigeration)", toWatt: 3516.8528420667 },
  { name: "kilocalorie (IT)/hour [kcal/h]", toWatt: 1.163 },
  { name: "kilocalorie (IT)/minute", toWatt: 69.78 },
  { name: "kilocalorie (IT)/second", toWatt: 4186.8 },
  { name: "kilocalorie (th)/hour", toWatt: 1.1622222222 },
  { name: "kilocalorie (th)/minute", toWatt: 69.7333333333 },
  { name: "kilocalorie (th)/second", toWatt: 4184 },
  { name: "calorie (IT)/hour [cal/h]", toWatt: 0.001163 },
  { name: "calorie (IT)/minute [cal/min]", toWatt: 0.06978 },
  { name: "calorie (IT)/second [cal/s]", toWatt: 4.1868 },
  { name: "calorie (th)/hour [cal (th)/h]", toWatt: 0.0011622222 },
  { name: "calorie (th)/minute", toWatt: 0.0697333333 },
  { name: "calorie (th)/second", toWatt: 4.184 },
  { name: "foot pound-force/hour", toWatt: 0.0003766161 },
  { name: "foot pound-force/minute", toWatt: 0.0225969658 },
  { name: "foot pound-force/second", toWatt: 1.3558179483 },
  { name: "pound-foot/hour [lbf*ft/h]", toWatt: 0.0003766161 },
  { name: "pound-foot/minute", toWatt: 0.0225969658 },
  { name: "pound-foot/second", toWatt: 1.3558179483 },
  { name: "erg/second [erg/s]", toWatt: 1.0e-7 },
  { name: "kilovolt ampere [kV*A]", toWatt: 1000 },
  { name: "volt ampere [V*A]", toWatt: 1 },
  { name: "newton meter/second", toWatt: 1 },
  { name: "joule/second [J/s]", toWatt: 1 },
  { name: "exajoule/second [EJ/s]", toWatt: 1.0e18 },
  { name: "petajoule/second [PJ/s]", toWatt: 1.0e15 },
  { name: "terajoule/second [TJ/s]", toWatt: 1000000000000 },
  { name: "gigajoule/second [GJ/s]", toWatt: 1000000000 },
  { name: "megajoule/second [MJ/s]", toWatt: 1000000 },
  { name: "kilojoule/second [kJ/s]", toWatt: 1000 },
  { name: "hectojoule/second [hJ/s]", toWatt: 100 },
  { name: "dekajoule/second [daJ/s]", toWatt: 10 },
  { name: "decijoule/second [dJ/s]", toWatt: 0.1 },
  { name: "centijoule/second [cJ/s]", toWatt: 0.01 },
  { name: "millijoule/second [mJ/s]", toWatt: 0.001 },
  { name: "microjoule/second [µJ/s]", toWatt: 1.0e-6 },
  { name: "nanojoule/second [nJ/s]", toWatt: 1.0e-9 },
  { name: "picojoule/second [pJ/s]", toWatt: 1.0e-12 },
  { name: "femtojoule/second [fJ/s]", toWatt: 1.0e-15 },
  { name: "attojoule/second [aJ/s]", toWatt: 1.0e-18 },
  { name: "joule/hour [J/h]", toWatt: 0.0002777778 },
  { name: "joule/minute [J/min]", toWatt: 0.0166666667 },
  { name: "kilojoule/hour [kJ/h]", toWatt: 0.2777777778 },
  { name: "kilojoule/minute [kJ/min]", toWatt: 16.6666666667 },
];

export default function PowerConverter() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState(units[0].name);
  const [toUnit, setToUnit] = useState(units[0].name);
  const [result, setResult] = useState("");

  const convertPower = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Please enter a valid number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    try {
      const watt = value * fromUnitData.toWatt;
      const resultValue = watt / toUnitData.toWatt;
      setResult(`${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
    } catch (error) {
      setResult("Conversion error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Power Converter</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">
              Enter Value
            </label>
            <input
              type="number"
              id="inputValue"
              placeholder="Enter value"
              step="any"
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
            onClick={convertPower}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Convert
          </button>
          <div className="text-center text-lg font-medium text-gray-800 mt-4">Result: {result}</div>
        </div>
      </div>
    </div>
  );
}
