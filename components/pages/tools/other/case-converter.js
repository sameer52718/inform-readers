"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [caseType, setCaseType] = useState("upper");
  const [result, setResult] = useState("Result: ");

  const convertCase = () => {
    if (!inputText.trim()) {
      setResult("Result: Please enter some text");
      return;
    }

    let converted;
    switch (caseType) {
      case "upper":
        converted = inputText.toUpperCase();
        break;
      case "lower":
        converted = inputText.toLowerCase();
        break;
      case "title":
      case "capitalized":
        converted = inputText.replace(
          /\w\S*/g,
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
        break;
      case "sentence":
        converted = inputText.replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase());
        break;
      case "inverse":
        converted = inputText
          .split("")
          .map((char) => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()))
          .join("");
        break;
      case "singleSpace":
        converted = inputText.replace(/\s+/g, " ").trim();
        break;
      case "doubleSpace":
        converted = inputText.replace(/\s+/g, "  ").trim();
        break;
      default:
        converted = inputText;
    }

    setResult(`Result: ${converted}`);
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Case Converter</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="inputText" className="block text-sm font-medium text-gray-700">
              Enter Text
            </label>
            <textarea
              id="inputText"
              placeholder="Enter your text here"
              rows="4"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
          <div>
            <label htmlFor="caseType" className="block text-sm font-medium text-gray-700">
              Select Case
            </label>
            <select
              id="caseType"
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="upper">UPPER CASE</option>
              <option value="lower">lower case</option>
              <option value="title">Title Case</option>
              <option value="sentence">Sentence case</option>
              <option value="capitalized">Capitalized Case</option>
              <option value="inverse">Inverse Case</option>
              <option value="singleSpace">Normalized with Single Space</option>
              <option value="doubleSpace">Normalized with Double Space</option>
            </select>
          </div>
          <button
            onClick={convertCase}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
          >
            Convert
          </button>
          <div className="text-center text-lg font-medium text-gray-800 mt-4 break-words">{result}</div>
        </div>
        <style jsx>{`
          textarea:focus,
          select:focus {
            outline: none;
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
}
