"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [steps, setSteps] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load history from localStorage
    try {
      const stored = localStorage.getItem("quadraticCalcHistory");
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  const calculate = () => {
    setError("");
    const aVal = parseFloat(a.trim());
    const bVal = parseFloat(b.trim());
    const cVal = parseFloat(c.trim());

    // Input validation
    if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal)) {
      setError("Please enter valid numbers for a, b, and c.");
      return;
    }
    if (aVal === 0) {
      setError("Coefficient a cannot be zero (not a quadratic equation).");
      return;
    }

    // Calculate discriminant
    const discriminant = bVal * bVal - 4 * aVal * cVal;
    let roots,
      rootType,
      steps = [];

    // Calculate roots based on discriminant
    if (discriminant > 0) {
      const root1 = (-bVal + Math.sqrt(discriminant)) / (2 * aVal);
      const root2 = (-bVal - Math.sqrt(discriminant)) / (2 * aVal);
      roots = `x₁ = ${root1.toFixed(4)}, x₂ = ${root2.toFixed(4)}`;
      rootType = "Two distinct real roots";
      steps = [
        `Equation: ${aVal}x² + ${bVal}x + ${cVal} = 0`,
        `Step 1: Calculate Discriminant (Δ)`,
        `Formula: Δ = b² - 4ac`,
        `Δ = (${bVal})² - 4(${aVal})(${cVal}) = ${bVal * bVal} - ${4 * aVal * cVal} = ${discriminant}`,
        `Since Δ > 0, there are two distinct real roots`,
        `Step 2: Apply Quadratic Formula`,
        `Formula: x = [-b ± √(Δ)] / (2a)`,
        `x₁ = [-${bVal} + √(${discriminant})] / (2(${aVal})) = ${root1.toFixed(4)}`,
        `x₂ = [-${bVal} - √(${discriminant})] / (2(${aVal})) = ${root2.toFixed(4)}`,
      ];
    } else if (discriminant === 0) {
      const root = -bVal / (2 * aVal);
      roots = `x = ${root.toFixed(4)}`;
      rootType = "One repeated real root";
      steps = [
        `Equation: ${aVal}x² + ${bVal}x + ${cVal} = 0`,
        `Step 1: Calculate Discriminant (Δ)`,
        `Formula: Δ = b² - 4ac`,
        `Δ = (${bVal})² - 4(${aVal})(${cVal}) = ${bVal * bVal} - ${4 * aVal * cVal} = ${discriminant}`,
        `Since Δ = 0, there is one repeated real root`,
        `Step 2: Apply Quadratic Formula`,
        `Formula: x = -b / (2a)`,
        `x = -(${bVal}) / (2(${aVal})) = ${root.toFixed(4)}`,
      ];
    } else {
      const realPart = (-bVal / (2 * aVal)).toFixed(4);
      const imagPart = (Math.sqrt(-discriminant) / (2 * aVal)).toFixed(4);
      roots = `x₁ = ${realPart} + ${imagPart}i, x₂ = ${realPart} - ${imagPart}i`;
      rootType = "Two complex conjugate roots";
      steps = [
        `Equation: ${aVal}x² + ${bVal}x + ${cVal} = 0`,
        `Step 1: Calculate Discriminant (Δ)`,
        `Formula: Δ = b² - 4ac`,
        `Δ = (${bVal})² - 4(${aVal})(${cVal}) = ${bVal * bVal} - ${4 * aVal * cVal} = ${discriminant}`,
        `Since Δ < 0, there are two complex conjugate roots`,
        `Step 2: Apply Quadratic Formula`,
        `Formula: x = [-b ± √(Δ)] / (2a)`,
        `Real part: -b / (2a) = -(${bVal}) / (2(${aVal})) = ${realPart}`,
        `Imaginary part: √(-Δ) / (2a) = √(${-discriminant}) / (2(${aVal})) = ${imagPart}`,
        `x₁ = ${realPart} + ${imagPart}i`,
        `x₂ = ${realPart} - ${imagPart}i`,
      ];
    }

    // Calculate vertex
    const vertexX = -bVal / (2 * aVal);
    const vertexY = aVal * vertexX * vertexX + bVal * vertexX + cVal;

    // Set results
    setResults({
      equation: `Equation: ${aVal}x² + ${bVal}x + ${cVal} = 0`,
      discriminant: `Discriminant (Δ): ${discriminant}`,
      rootType: `Root Type: ${rootType}`,
      roots: `Roots: ${roots}`,
      vertex: `Vertex: (${vertexX.toFixed(4)}, ${vertexY.toFixed(4)})`,
    });
    setSteps(steps);

    // Update history
    const historyEntry = {
      equation: `${aVal}x² + ${bVal}x + ${cVal} = 0`,
      roots: roots,
      timestamp: new Date().toLocaleString(),
    };
    const newHistory = [...history, historyEntry];
    setHistory(newHistory);
    try {
      localStorage.setItem("quadraticCalcHistory", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  const clearInput = () => {
    setA("");
    setB("");
    setC("");
    setError("");
    setResults(null);
    setSteps([]);
  };

  const exportResults = () => {
    if (!results) {
      setError("No results to export.");
      return;
    }
    const resultsText = Object.values(results).join("\n");
    const stepsText = `Calculation Steps\n${steps.join("\n")}`;
    const content = `${resultsText}\n\n${stepsText}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quadratic_formula_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-3xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 text-center">
            Advanced Quadratic Formula Calculator
          </h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Enter Quadratic Equation (ax² + bx + c = 0)
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">Coefficient a:</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 1"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">Coefficient b:</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., -5"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">Coefficient c:</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 6"
                  value={c}
                  onChange={(e) => setC(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={calculate}
            >
              Calculate
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={clearInput}
            >
              Clear
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={exportResults}
            >
              Export
            </button>
          </div>
          {results && (
            <div className="mb-6 bg-gray-100 p-4 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
              <p className="text-gray-600 mb-2">{results.equation}</p>
              <p className="text-gray-600 mb-2">{results.discriminant}</p>
              <p className="text-gray-600 mb-2">{results.rootType}</p>
              <p className="text-gray-600 mb-2">{results.roots}</p>
              <p className="text-gray-600">{results.vertex}</p>
            </div>
          )}
          {steps.length > 0 && (
            <div className="mb-6 bg-gray-100 p-4 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Steps</h2>
              <ul className="list-decimal pl-6 text-gray-600">
                {steps.map((step, index) => (
                  <li key={index} className="mb-2">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation History</h2>
            <div className="max-h-40 overflow-y-auto bg-gray-100 p-4 rounded-lg border border-gray-200">
              {history.length === 0 ? (
                <p className="text-gray-600 text-sm">No history available</p>
              ) : (
                history.map((entry, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-gray-200 mb-2 hover:bg-gray-300 transition-transform hover:-translate-y-1"
                  >
                    <p className="text-gray-600 text-sm">Equation: {entry.equation}</p>
                    <p className="text-gray-600 text-sm">Roots: {entry.roots}</p>
                    <p className="text-gray-600 text-sm">Time: {entry.timestamp}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
