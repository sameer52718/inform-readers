"use client";
import { useState, useEffect } from "react";

export default function HexCalculator() {
  const [hex1, setHex1] = useState("");
  const [hex2, setHex2] = useState("");
  const [operation, setOperation] = useState("add");
  const [hexToDec, setHexToDec] = useState("");
  const [decToHex, setDecToHex] = useState("");
  const [arithmeticResult, setArithmeticResult] = useState("");
  const [hexToDecResult, setHexToDecResult] = useState("");
  const [decToHexResult, setDecToHexResult] = useState("");
  const [steps, setSteps] = useState([]);
  const [history, setHistory] = useState([]);

  const calculate = () => {
    const hex1Val = hex1.trim().toUpperCase();
    const hex2Val = hex2.trim().toUpperCase();

    if (!hex1Val || !hex2Val) {
      alert("Please enter both hex numbers.");
      return;
    }

    if (!/^[0-9A-F]+$/i.test(hex1Val) || !/^[0-9A-F]+$/i.test(hex2Val)) {
      alert("Please enter valid hexadecimal numbers.");
      return;
    }

    const dec1 = parseInt(hex1Val, 16);
    const dec2 = parseInt(hex2Val, 16);
    let result;
    let calcSteps = [];

    switch (operation) {
      case "add":
        result = dec1 + dec2;
        calcSteps = [
          `Operation: ${hex1Val} + ${hex2Val}`,
          `Step 1: Convert to Decimal`,
          `${hex1Val} (hex) = ${dec1} (dec)`,
          `${hex2Val} (hex) = ${dec2} (dec)`,
          `Step 2: Perform Addition`,
          `${dec1} + ${dec2} = ${result}`,
          `Step 3: Convert Result to Hex`,
          `${result} (dec) = ${result.toString(16).toUpperCase()} (hex)`,
        ];
        break;
      case "subtract":
        result = dec1 - dec2;
        calcSteps = [
          `Operation: ${hex1Val} - ${hex2Val}`,
          `Step 1: Convert to Decimal`,
          `${hex1Val} (hex) = ${dec1} (dec)`,
          `${hex2Val} (hex) = ${dec2} (dec)`,
          `Step 2: Perform Subtraction`,
          `${dec1} - ${dec2} = ${result}`,
          `Step 3: Convert Result to Hex`,
          `${result} (dec) = ${result.toString(16).toUpperCase()} (hex)`,
        ];
        break;
      case "multiply":
        result = dec1 * dec2;
        calcSteps = [
          `Operation: ${hex1Val} × ${hex2Val}`,
          `Step 1: Convert to Decimal`,
          `${hex1Val} (hex) = ${dec1} (dec)`,
          `${hex2Val} (hex) = ${dec2} (dec)`,
          `Step 2: Perform Multiplication`,
          `${dec1} × ${dec2} = ${result}`,
          `Step 3: Convert Result to Hex`,
          `${result} (dec) = ${result.toString(16).toUpperCase()} (hex)`,
        ];
        break;
      case "divide":
        if (dec2 === 0) {
          alert("Division by zero is not allowed.");
          return;
        }
        result = Math.floor(dec1 / dec2);
        calcSteps = [
          `Operation: ${hex1Val} ÷ ${hex2Val}`,
          `Step 1: Convert to Decimal`,
          `${hex1Val} (hex) = ${dec1} (dec)`,
          `${hex2Val} (hex) = ${dec2} (dec)`,
          `Step 2: Perform Division (integer result)`,
          `${dec1} ÷ ${dec2} = ${result}`,
          `Step 3: Convert Result to Hex`,
          `${result} (dec) = ${result.toString(16).toUpperCase()} (hex)`,
        ];
        break;
    }

    setArithmeticResult(
      `Result: ${hex1Val} ${
        operation === "add" ? "+" : operation === "subtract" ? "-" : operation === "multiply" ? "×" : "÷"
      } ${hex2Val} = ${result.toString(16).toUpperCase()} (hex) = ${result} (dec)`
    );
    setSteps(calcSteps);
    setHistory([
      ...history,
      {
        type: "Arithmetic",
        operation: `${hex1Val} ${
          operation === "add" ? "+" : operation === "subtract" ? "-" : operation === "multiply" ? "×" : "÷"
        } ${hex2Val}`,
        result: `${result.toString(16).toUpperCase()} (hex)`,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  };

  const convert = () => {
    const hexToDecVal = hexToDec.trim().toUpperCase();
    const decToHexVal = decToHex.trim();
    let calcSteps = [];

    if (!hexToDecVal && !decToHexVal) {
      alert("Please enter a value for at least one conversion.");
      return;
    }

    if (hexToDecVal) {
      if (!/^[0-9A-F]+$/i.test(hexToDecVal)) {
        alert("Please enter a valid hexadecimal number for Hex to Decimal.");
        return;
      }
      const decValue = parseInt(hexToDecVal, 16);
      setHexToDecResult(`Hex to Decimal: ${hexToDecVal} (hex) = ${decValue} (dec)`);
      calcSteps.push(
        `Hex to Decimal Conversion: ${hexToDecVal}`,
        `Convert ${hexToDecVal} (hex) to decimal`,
        `${hexToDecVal} (hex) = ${decValue} (dec)`
      );
      setHistory([
        ...history,
        {
          type: "Conversion",
          operation: `Hex to Dec: ${hexToDecVal}`,
          result: `${decValue} (dec)`,
          timestamp: new Date().toLocaleString(),
        },
      ]);
    } else {
      setHexToDecResult("");
    }

    if (decToHexVal) {
      if (!/^\d+$/.test(decToHexVal)) {
        alert("Please enter a valid decimal number for Decimal to Hex.");
        return;
      }
      const decValue = parseInt(decToHexVal, 10);
      const hexValue = decValue.toString(16).toUpperCase();
      setDecToHexResult(`Decimal to Hex: ${decToHexVal} (dec) = ${hexValue} (hex)`);
      calcSteps.push(
        `Decimal to Hex Conversion: ${decToHexVal}`,
        `Convert ${decToHexVal} (dec) to hexadecimal`,
        `${decToHexVal} (dec) = ${hexValue} (hex)`
      );
      setHistory([
        ...history,
        {
          type: "Conversion",
          operation: `Dec to Hex: ${decToHexVal}`,
          result: `${hexValue} (hex)`,
          timestamp: new Date().toLocaleString(),
        },
      ]);
    } else {
      setDecToHexResult("");
    }

    setSteps(calcSteps);
  };

  const clearInput = () => {
    setHex1("");
    setHex2("");
    setHexToDec("");
    setDecToHex("");
    setArithmeticResult("");
    setHexToDecResult("");
    setDecToHexResult("");
    setSteps([]);
  };

  const exportResults = () => {
    if (!arithmeticResult && !hexToDecResult && !decToHexResult) {
      alert("No results to export.");
      return;
    }
    const results = [arithmeticResult, hexToDecResult, decToHexResult].filter(Boolean).join("\n");
    const stepsText = steps.join("\n");
    const content = `${results}\n\nCalculation Steps:\n${stepsText}`;
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "hex_calculator_results.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-red-900 text-center mb-8">Advanced Hex Calculator</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Hexadecimal Arithmetic</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">First Hex Number:</label>
                <input
                  type="text"
                  value={hex1}
                  onChange={(e) => setHex1(e.target.value)}
                  placeholder="e.g., A1F"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">Operation:</label>
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="add">Add (+)</option>
                  <option value="subtract">Subtract (-)</option>
                  <option value="multiply">Multiply (×)</option>
                  <option value="divide">Divide (÷)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">Second Hex Number:</label>
                <input
                  type="text"
                  value={hex2}
                  onChange={(e) => setHex2(e.target.value)}
                  placeholder="e.g., 1B3"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Number Conversion</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">Hex to Decimal:</label>
                <input
                  type="text"
                  value={hexToDec}
                  onChange={(e) => setHexToDec(e.target.value)}
                  placeholder="e.g., FF"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">Decimal to Hex:</label>
                <input
                  type="text"
                  value={decToHex}
                  onChange={(e) => setDecToHex(e.target.value)}
                  placeholder="e.g., 255"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button onClick={calculate} className="bg-red-500 text-white px-6 py-3 rounded-lg flex-1">
              Calculate
            </button>
            <button onClick={convert} className="bg-red-500 text-white px-6 py-3 rounded-lg flex-1">
              Convert
            </button>
            <button onClick={clearInput} className="bg-red-500 text-white px-6 py-3 rounded-lg flex-1">
              Clear
            </button>
            <button onClick={exportResults} className="bg-red-500 text-white px-6 py-3 rounded-lg flex-1">
              Export
            </button>
          </div>

          {(arithmeticResult || hexToDecResult || decToHexResult) && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
              <div className="bg-gray-200 p-4 rounded-lg">
                {arithmeticResult && <p className="text-gray-600">{arithmeticResult}</p>}
                {hexToDecResult && <p className="text-gray-600">{hexToDecResult}</p>}
                {decToHexResult && <p className="text-gray-600">{decToHexResult}</p>}
              </div>
            </div>
          )}

          {steps.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Steps</h2>
              <div className="bg-gray-200 p-4 rounded-lg">
                <ul className="list-decimal pl-5 text-gray-600">
                  {steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation History</h2>
            <div className="bg-gray-200 p-4 rounded-lg max-h-[150px] overflow-y-auto">
              {history.map((entry, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded-lg mb-2">
                  <p className="text-sm text-gray-600">
                    {entry.type}: {entry.operation}
                  </p>
                  <p className="text-sm text-gray-600">Result: {entry.result}</p>
                  <p className="text-sm text-gray-600">Time: {entry.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
