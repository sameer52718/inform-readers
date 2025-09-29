"use client";

import { useState } from "react";

const units = [
  { name: "Decimal (Base-10)", base: 10 },
  { name: "Binary (Base-2)", base: 2 },
  { name: "Ternary (Base-3)", base: 3 },
  { name: "Base-4", base: 4 },
  { name: "Base-5", base: 5 },
  { name: "Base-6", base: 6 },
  { name: "Base-7", base: 7 },
  { name: "Octal (Base-8)", base: 8 },
  { name: "Base-9", base: 9 },
  { name: "Base-12", base: 12 },
  { name: "Base-13", base: 13 },
  { name: "Base-15", base: 15 },
  { name: "Hexadecimal (Base-16)", base: 16 },
  { name: "Base-20", base: 20 },
  { name: "Base-24", base: 24 },
  { name: "Base-32", base: 32 },
  { name: "Base-36", base: 36 },
  { name: "Base-60 (Sexagesimal)", base: 60 },
  { name: "Base-64", base: 64 },
  { name: "Gray Code", base: "gray" },
  { name: "BCD (Binary-Coded Decimal)", base: "bcd" },
  { name: "Roman Numerals", base: "roman" },
];

const base60Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export default function NumbersConverter() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState(units[0].name);
  const [toUnit, setToUnit] = useState(units[0].name);
  const [result, setResult] = useState("");

  const parseBase60 = (input) => {
    let result = 0;
    for (let char of input) {
      const value = base60Chars.indexOf(char);
      if (value === -1 || value >= 60) {
        throw new Error("Invalid Base-60 character");
      }
      result = result * 60 + value;
    }
    return result;
  };

  const decimalToBase60 = (decimal) => {
    if (decimal === 0) return "0";
    let result = "";
    while (decimal > 0) {
      result = base60Chars[decimal % 60] + result;
      decimal = Math.floor(decimal / 60);
    }
    return result;
  };

  const parseBase64 = (input) => {
    let result = 0;
    for (let char of input) {
      const value = base64Chars.indexOf(char);
      if (value === -1) {
        throw new Error("Invalid Base-64 character");
      }
      result = result * 64 + value;
    }
    return result;
  };

  const decimalToBase64 = (decimal) => {
    if (decimal === 0) return "A";
    let result = "";
    while (decimal > 0) {
      result = base64Chars[decimal % 64] + result;
      decimal = Math.floor(decimal / 64);
    }
    return result;
  };

  const grayToDecimal = (binary) => {
    let num = parseInt(binary, 2);
    if (isNaN(num)) {
      throw new Error("Invalid Gray Code input");
    }
    let decimal = num;
    while ((num >>= 1)) {
      decimal ^= num;
    }
    return decimal;
  };

  const decimalToGray = (decimal) => {
    return (decimal ^ (decimal >> 1)).toString(2);
  };

  const bcdToDecimal = (bcd) => {
    if (!/^[0-1]+$/.test(bcd) || bcd.length % 4 !== 0) {
      throw new Error("Invalid BCD input");
    }
    let result = 0;
    for (let i = 0; i < bcd.length; i += 4) {
      const digit = parseInt(bcd.slice(i, i + 4), 2);
      if (digit > 9) {
        throw new Error("Invalid BCD digit");
      }
      result = result * 10 + digit;
    }
    return result;
  };

  const decimalToBCD = (decimal) => {
    let num = decimal;
    let result = "";
    while (num > 0) {
      let digit = num % 10;
      let binary = digit.toString(2).padStart(4, "0");
      result = binary + result;
      num = Math.floor(num / 10);
    }
    return result || "0000";
  };

  const romanToDecimal = (roman) => {
    const romanValues = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };
    let result = 0;
    let prevValue = 0;

    for (let i = roman.length - 1; i >= 0; i--) {
      const currentValue = romanValues[roman[i]];
      if (!currentValue) {
        throw new Error("Invalid Roman numeral");
      }
      if (currentValue >= prevValue) {
        result += currentValue;
      } else {
        result -= currentValue;
      }
      prevValue = currentValue;
    }

    if (result < 1 || result > 3999) {
      throw new Error("Roman numerals valid for 1 to 3999");
    }
    return result;
  };

  const decimalToRoman = (decimal) => {
    const romanSymbols = [
      { value: 1000, symbol: "M" },
      { value: 900, symbol: "CM" },
      { value: 500, symbol: "D" },
      { value: 400, symbol: "CD" },
      { value: 100, symbol: "C" },
      { value: 90, symbol: "XC" },
      { value: 50, symbol: "L" },
      { value: 40, symbol: "XL" },
      { value: 10, symbol: "X" },
      { value: 9, symbol: "IX" },
      { value: 5, symbol: "V" },
      { value: 4, symbol: "IV" },
      { value: 1, symbol: "I" },
    ];

    let result = "";
    let num = decimal;

    for (const { value, symbol } of romanSymbols) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }

    return result;
  };

  const convertNumber = () => {
    const input = inputValue.trim().toUpperCase();
    if (!input) {
      setResult("Please enter a value");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    try {
      let decimalValue;
      if (fromUnitData.base === "roman") {
        decimalValue = romanToDecimal(input);
      } else if (fromUnitData.base === "gray") {
        decimalValue = grayToDecimal(input);
      } else if (fromUnitData.base === "bcd") {
        decimalValue = bcdToDecimal(input);
      } else if (fromUnitData.base === 60) {
        decimalValue = parseBase60(input);
      } else if (fromUnitData.base === 64) {
        decimalValue = parseBase64(input);
      } else {
        decimalValue = parseInt(input, fromUnitData.base);
      }

      if (isNaN(decimalValue) || decimalValue < 0) {
        setResult("Invalid input or negative number");
        return;
      }

      let result;
      if (toUnitData.base === "roman") {
        if (decimalValue < 1 || decimalValue > 3999) {
          setResult("Roman numerals valid for 1 to 3999");
          return;
        }
        result = decimalToRoman(decimalValue);
      } else if (toUnitData.base === "gray") {
        result = decimalToGray(decimalValue);
      } else if (toUnitData.base === "bcd") {
        result = decimalToBCD(decimalValue);
      } else if (toUnitData.base === 60) {
        result = decimalToBase60(decimalValue);
      } else if (toUnitData.base === 64) {
        result = decimalToBase64(decimalValue);
      } else {
        result = decimalValue.toString(toUnitData.base).toUpperCase();
      }

      setResult(`${input} ${fromUnit} = ${result} ${toUnit}`);
    } catch (error) {
      setResult(error.message || "Invalid input or conversion error");
    }
  };

  return (
    <div className=" bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center tty-gray-800 mb-6">Numbers Converter</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">
              Enter Value
            </label>
            <input
              type="text"
              id="inputValue"
              placeholder="Enter number"
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
            onClick={convertNumber}
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
