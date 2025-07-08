"use client";
import { useState } from "react";

export default function Home() {
  const units = [
    { name: "Bit [b]", bits: 1 },
    { name: "Nibble", bits: 4 },
    { name: "Byte [B]", bits: 8 },
    { name: "Character", bits: 8 },
    { name: "Word", bits: 16 },
    { name: "MAPM-word", bits: 32 },
    { name: "Quadruple-word", bits: 64 },
    { name: "Block", bits: 4096 },
    { name: "Kilobit [kb]", bits: 1024 },
    { name: "Kilobyte [kB]", bits: 8192 },
    { name: "Kilobyte (10^3 bytes)", bits: 8000 },
    { name: "Megabit [Mb]", bits: 1048576 },
    { name: "Megabyte [MB]", bits: 8388608 },
    { name: "Megabyte (10^6 bytes)", bits: 8000000 },
    { name: "Gigabit [Gb]", bits: 1073741824 },
    { name: "Gigabyte [GB]", bits: 8589934592 },
    { name: "Gigabyte (10^9 bytes)", bits: 8000000000 },
    { name: "Terabit [Tb]", bits: 1099511627776 },
    { name: "Terabyte [TB]", bits: 8796093022208 },
    { name: "Terabyte (10^12 bytes)", bits: 8000000000000 },
    { name: "Petabit [Pb]", bits: 1.1258999068426e15 },
    { name: "Petabyte [PB]", bits: 9.007199254741e15 },
    { name: "Petabyte (10^15 bytes)", bits: 8.0e15 },
    { name: "Exabit [Eb]", bits: 1.1529215046068e18 },
    { name: "Exabyte [EB]", bits: 9.2233720368548e18 },
    { name: "Exabyte (10^18 bytes)", bits: 8.0e18 },
    { name: 'Floppy Disk (3.5", DD)', bits: 5830656 },
    { name: 'Floppy Disk (3.5", HD)', bits: 11661312 },
    { name: 'Floppy Disk (3.5", ED)', bits: 23322624 },
    { name: 'Floppy Disk (5.25", DD)', bits: 2915328 },
    { name: 'Floppy Disk (5.25", HD)', bits: 9711616 },
    { name: "Zip 100", bits: 803454976 },
    { name: "Zip 250", bits: 2008637440 },
    { name: "Jaz 1GB", bits: 8589934592 },
    { name: "Jaz 2GB", bits: 17179869184 },
    { name: "CD (74 minute)", bits: 5448466432 },
    { name: "CD (80 minute)", bits: 5890233976 },
    { name: "DVD (1 layer, 1 side)", bits: 40372692582.4 },
    { name: "DVD (2 layer, 1 side)", bits: 73014444032 },
    { name: "DVD (1 layer, 2 side)", bits: 80745385164.8 },
    { name: "DVD (2 layer, 2 side)", bits: 146028888064 },
  ];

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState(units[0].name);
  const [toUnit, setToUnit] = useState(units[0].name);
  const [result, setResult] = useState("Result: ");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (!inputValue) {
      setResult("Result: Please enter a value");
      return;
    }
    if (isNaN(value) || value < 0) {
      setResult("Result: Please enter a valid non-negative number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    try {
      const bits = value * fromUnitData.bits;
      const converted = bits / toUnitData.bits;
      const formattedResult = converted.toFixed(6).replace(/\.?0+$/, "");
      setResult(`Result: ${value} ${fromUnit} = ${formattedResult} ${toUnit}`);
    } catch (error) {
      setResult("Result: Conversion error");
    }
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Data Storage Converter</h2>
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
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
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
              onClick={handleConvert}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Convert
            </button>
            <div className="text-center text-lg font-medium text-gray-800 mt-4">{result}</div>
          </div>
        </div>
      </div>
    </>
  );
}
