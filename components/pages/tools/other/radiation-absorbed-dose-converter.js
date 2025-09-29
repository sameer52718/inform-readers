"use client";

import { useState } from "react";

export default function RadiationAbsorbedDoseConverter() {
  const units = [
    { value: "rd", label: "rad [rd]" },
    { value: "mrd", label: "millirad [mrd]" },
    { value: "J/kg", label: "joule/kilogram [J/kg]" },
    { value: "J/g", label: "joule/gram [J/g]" },
    { value: "J/cg", label: "joule/centigram [J/cg]" },
    { value: "J/mg", label: "joule/milligram [J/mg]" },
    { value: "Gy", label: "gray [Gy]" },
    { value: "EGy", label: "exagray [EGy]" },
    { value: "PGy", label: "petagray [PGy]" },
    { value: "TGy", label: "teragray [TGy]" },
    { value: "GGy", label: "gigagray [GGy]" },
    { value: "MGy", label: "megagray [MGy]" },
    { value: "kGy", label: "kilogray [kGy]" },
    { value: "hGy", label: "hectogray [hGy]" },
    { value: "daGy", label: "dekagray [daGy]" },
    { value: "dGy", label: "decigray [dGy]" },
    { value: "cGy", label: "centigray [cGy]" },
    { value: "mGy", label: "milligray [mGy]" },
    { value: "µGy", label: "microgray [µGy]" },
    { value: "nGy", label: "nanogray [nGy]" },
    { value: "pGy", label: "picogray [pGy]" },
    { value: "fGy", label: "femtogray [fGy]" },
    { value: "aGy", label: "attogray [aGy]" },
  ];

  const toRad = {
    rd: 1,
    mrd: 0.001,
    "J/kg": 100,
    "J/g": 100000,
    "J/cg": 10000000,
    "J/mg": 100000000,
    Gy: 100,
    EGy: 1.0e20,
    PGy: 1.0e17,
    TGy: 1.0e14,
    GGy: 100000000000,
    MGy: 100000000,
    kGy: 100000,
    hGy: 10000,
    daGy: 1000,
    dGy: 10,
    cGy: 1,
    mGy: 0.1,
    µGy: 0.0001,
    nGy: 1.0e-7,
    pGy: 1.0e-10,
    fGy: 1.0e-13,
    aGy: 1.0e-16,
  };

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("rd");
  const [toUnit, setToUnit] = useState("rd");
  const [result, setResult] = useState("");

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('<span className="text-red-500">Please enter a valid number</span>');
      return;
    }

    if (!(fromUnit in toRad) || !(toUnit in toRad)) {
      setResult('<span className="text-red-500">Invalid unit selected</span>');
      return;
    }

    const valueInRad = value * toRad[fromUnit];
    const resultValue = valueInRad / toRad[toUnit];
    setResult(`${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className=" bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 p-5 rounded-lg max-w-md w-full shadow-lg">
        <h1 className="text-red-500 text-2xl text-center mb-5">Radiation-Absorbed Dose Converter</h1>
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
