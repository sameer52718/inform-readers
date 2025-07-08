"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("joule [J]");
  const [toUnit, setToUnit] = useState("joule [J]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "joule [J]", toJoule: 1 },
    { name: "kilojoule [kJ]", toJoule: 1000 },
    { name: "kilowatt-hour [kW*h]", toJoule: 3600000 },
    { name: "watt-hour [W*h]", toJoule: 3600 },
    { name: "calorie (nutritional)", toJoule: 4186.8 },
    { name: "horsepower (metric) hour", toJoule: 2647795.5 },
    { name: "Btu (IT) [Btu (IT), Btu]", toJoule: 1055.05585262 },
    { name: "Btu (th) [Btu (th)]", toJoule: 1054.3499999744 },
    { name: "gigajoule [GJ]", toJoule: 1000000000 },
    { name: "megajoule [MJ]", toJoule: 1000000 },
    { name: "millijoule [mJ]", toJoule: 0.001 },
    { name: "microjoule [µJ]", toJoule: 1.0e-6 },
    { name: "nanojoule [nJ]", toJoule: 1.0e-9 },
    { name: "attojoule [aJ]", toJoule: 1.0e-18 },
    { name: "megaelectron-volt [MeV]", toJoule: 1.6021766339999e-13 },
    { name: "kiloelectron-volt [keV]", toJoule: 1.6021766339999e-16 },
    { name: "electron-volt [eV]", toJoule: 1.6021766339999e-19 },
    { name: "erg", toJoule: 1.0e-7 },
    { name: "gigawatt-hour [GW*h]", toJoule: 3600000000000 },
    { name: "megawatt-hour [MW*h]", toJoule: 3600000000 },
    { name: "kilowatt-second [kW*s]", toJoule: 1000 },
    { name: "watt-second [W*s]", toJoule: 1 },
    { name: "newton meter [N*m]", toJoule: 1 },
    { name: "horsepower hour [hp*h]", toJoule: 2684519.5368856 },
    { name: "kilocalorie (IT) [kcal (IT)]", toJoule: 4186.8 },
    { name: "kilocalorie (th) [kcal (th)]", toJoule: 4184 },
    { name: "calorie (IT) [cal (IT), cal]", toJoule: 4.1868 },
    { name: "calorie (th) [cal (th)]", toJoule: 4.184 },
    { name: "mega Btu (IT) [MBtu (IT)]", toJoule: 1055055852.62 },
    { name: "ton-hour (refrigeration)", toJoule: 12660670.23144 },
    { name: "fuel oil equivalent @kiloliter", toJoule: 40197627984.822 },
    { name: "fuel oil equivalent @barrel (US)", toJoule: 6383087908.3509 },
    { name: "gigaton [Gton]", toJoule: 4.184e18 },
    { name: "megaton [Mton]", toJoule: 4.184e15 },
    { name: "kiloton [kton]", toJoule: 4184000000000 },
    { name: "ton (explosives)", toJoule: 4184000000 },
    { name: "dyne centimeter [dyn*cm]", toJoule: 1.0e-7 },
    { name: "gram-force meter [gf*m]", toJoule: 0.00980665 },
    { name: "gram-force centimeter", toJoule: 9.80665e-5 },
    { name: "kilogram-force centimeter", toJoule: 0.0980665 },
    { name: "kilogram-force meter", toJoule: 9.8066499997 },
    { name: "kilopond meter [kp*m]", toJoule: 9.8066499997 },
    { name: "pound-force foot [lbf*ft]", toJoule: 1.3558179483 },
    { name: "pound-force inch [lbf*in]", toJoule: 0.112984829 },
    { name: "ounce-force inch [ozf*in]", toJoule: 0.0070615518 },
    { name: "foot-pound [ft*lbf]", toJoule: 1.3558179483 },
    { name: "inch-pound [in*lbf]", toJoule: 0.112984829 },
    { name: "inch-ounce [in*ozf]", toJoule: 0.0070615518 },
    { name: "poundal foot [pdl*ft]", toJoule: 0.04214011 },
    { name: "therm", toJoule: 105505600 },
    { name: "therm (EC)", toJoule: 105505600 },
    { name: "therm (US)", toJoule: 105480400 },
    { name: "Hartree energy", toJoule: 4.3597482e-18 },
    { name: "Rydberg constant", toJoule: 2.1798741e-18 },
  ];

  const convertEnergy = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Result: Please enter a valid number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    const joule = value * fromUnitData.toJoule;
    const resultValue = joule / toUnitData.toJoule;
    setResult(`Result: ${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Energy Converter</h2>
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
            onClick={convertEnergy}
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
