'use client';

import { useState } from 'react';

export default function Home() {
  const units = [
    { name: 'Newton/meter [N/m]', newtonPerMeter: 1 },
    { name: 'Millinewton/meter [mN/m]', newtonPerMeter: 0.001 },
    { name: 'Gram-force/centimeter [gf/cm]', newtonPerMeter: 0.980665 },
    { name: 'Dyne/centimeter [dyn/cm]', newtonPerMeter: 0.001 },
    { name: 'Erg/square centimeter [erg/cm²]', newtonPerMeter: 0.001 },
    { name: 'Erg/square millimeter [erg/mm²]', newtonPerMeter: 0.1 },
    { name: 'Poundal/inch [pdl/in]', newtonPerMeter: 5.443108491 },
    { name: 'Pound-force/inch [lbf/in]', newtonPerMeter: 175.1268369864 }
  ];

  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState(units[0].name);
  const [toUnit, setToUnit] = useState(units[0].name);
  const [result, setResult] = useState('Result: ');

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (!inputValue) {
      setResult('Result: Please enter a value');
      return;
    }
    if (isNaN(value) || value < 0) {
      setResult('Result: Please enter a valid non-negative number');
      return;
    }

    const fromUnitData = units.find(unit => unit.name === fromUnit);
    const toUnitData = units.find(unit => unit.name === toUnit);

    try {
      const newtonPerMeter = value * fromUnitData.newtonPerMeter;
      const converted = newtonPerMeter / toUnitData.newtonPerMeter;
      let formattedResult;
      if (Math.abs(converted) > 1e6 || (Math.abs(converted) < 1e-3 && converted !== 0)) {
        formattedResult = converted.toExponential(6);
      } else {
        formattedResult = converted.toFixed(6).replace(/\.?0+$/, '');
      }
      setResult(`Result: ${value} ${fromUnit} = ${formattedResult} ${toUnit}`);
    } catch (error) {
      setResult('Result: Conversion error');
    }
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Surface Tension Converter
        </h2>
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
          <div className="text-center text-lg font-medium text-gray-800 mt-4">
            {result}
          </div>
        </div>
      </div>
    </div>
  );
}