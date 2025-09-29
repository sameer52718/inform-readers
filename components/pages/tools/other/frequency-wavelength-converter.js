"use client";

import { useState } from "react";

export default function FrequencyWavelengthConverter() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Hertz [Hz]");
  const [toUnit, setToUnit] = useState("Hertz [Hz]");
  const [result, setResult] = useState("Result: ");

  const c = 299792458; // Speed of light in m/s
  const units = [
    { name: "Hertz [Hz]", hertz: 1, isFrequency: true },
    { name: "Exahertz [EHz]", hertz: 1e18, isFrequency: true },
    { name: "Petahertz [PHz]", hertz: 1e15, isFrequency: true },
    { name: "Terahertz [THz]", hertz: 1e12, isFrequency: true },
    { name: "Gigahertz [GHz]", hertz: 1e9, isFrequency: true },
    { name: "Megahertz [MHz]", hertz: 1e6, isFrequency: true },
    { name: "Kilohertz [kHz]", hertz: 1e3, isFrequency: true },
    { name: "Hectohertz [hHz]", hertz: 1e2, isFrequency: true },
    { name: "Dekahertz [daHz]", hertz: 1e1, isFrequency: true },
    { name: "Decihertz [dHz]", hertz: 1e-1, isFrequency: true },
    { name: "Centihertz [cHz]", hertz: 1e-2, isFrequency: true },
    { name: "Millihertz [mHz]", hertz: 1e-3, isFrequency: true },
    { name: "Microhertz [µHz]", hertz: 1e-6, isFrequency: true },
    { name: "Nanohertz [nHz]", hertz: 1e-9, isFrequency: true },
    { name: "Picohertz [pHz]", hertz: 1e-12, isFrequency: true },
    { name: "Femtohertz [fHz]", hertz: 1e-15, isFrequency: true },
    { name: "Attohertz [aHz]", hertz: 1e-18, isFrequency: true },
    { name: "Cycle/second", hertz: 1, isFrequency: true },
    { name: "Wavelength in exametres", hertz: 2.99792458e-10, meters: 1e18, isFrequency: false },
    { name: "Wavelength in petametres", hertz: 2.99792458e-7, meters: 1e15, isFrequency: false },
    { name: "Wavelength in terametres", hertz: 0.0002997925, meters: 1e12, isFrequency: false },
    { name: "Wavelength in gigametres", hertz: 0.299792458, meters: 1e9, isFrequency: false },
    { name: "Wavelength in megametres", hertz: 299.792458, meters: 1e6, isFrequency: false },
    { name: "Wavelength in kilometres", hertz: 299792.458, meters: 1e3, isFrequency: false },
    { name: "Wavelength in hectometres", hertz: 2997924.58, meters: 1e2, isFrequency: false },
    { name: "Wavelength in dekametres", hertz: 29979245.8, meters: 1e1, isFrequency: false },
    { name: "Wavelength in metres [m]", hertz: 299792458, meters: 1, isFrequency: false },
    { name: "Wavelength in decimetres", hertz: 2997924580, meters: 1e-1, isFrequency: false },
    { name: "Wavelength in centimetres [cm]", hertz: 29979245800, meters: 1e-2, isFrequency: false },
    { name: "Wavelength in millimetres [mm]", hertz: 299792458000, meters: 1e-3, isFrequency: false },
    { name: "Wavelength in micrometres", hertz: 2.99792458e14, meters: 1e-6, isFrequency: false },
    { name: "Wavelength in nanometres [nm]", hertz: 2.99792458e17, meters: 1e-9, isFrequency: false },
    {
      name: "Electron Compton wavelength",
      hertz: 1.235589789993e20,
      meters: 2.42631023867e-12,
      isFrequency: false,
    },
    {
      name: "Proton Compton wavelength",
      hertz: 2.2687315327002e23,
      meters: 1.32140985539e-15,
      isFrequency: false,
    },
    {
      name: "Neutron Compton wavelength",
      hertz: 2.2718587447278e23,
      meters: 1.31959090626e-15,
      isFrequency: false,
    },
  ];

  const convertFrequencyWavelength = () => {
    if (!inputValue.trim()) {
      setResult("Result: Please enter a value");
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) {
      setResult("Result: Please enter a valid positive number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    try {
      let hertz;
      if (fromUnitData.isFrequency) {
        hertz = value * fromUnitData.hertz;
      } else {
        const wavelengthMeters = value * fromUnitData.meters;
        hertz = c / wavelengthMeters;
      }

      let resultValue;
      if (toUnitData.isFrequency) {
        resultValue = hertz / toUnitData.hertz;
      } else {
        const wavelengthMeters = c / hertz;
        resultValue = wavelengthMeters / toUnitData.meters;
      }

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
    <div className="flex justify-center items-center  bg-white p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Frequency Wavelength Converter</h2>
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
            onClick={convertFrequencyWavelength}
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
