"use client";

import React, { useState, useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const AdvancedBallisticCoefficientCalculator = () => {
  const [inputs, setInputs] = useState({
    mass: "",
    area: "",
    dragCoefficient: "",
  });
  const [results, setResults] = useState(null);
  const [steps, setSteps] = useState([]);
  const [history, setHistory] = useState([]);
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  let pieChartInstance = null;
  let barChartInstance = null;

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const m = parseFloat(inputs.mass.trim());
    const A = parseFloat(inputs.area.trim());
    const C = parseFloat(inputs.dragCoefficient.trim());

    if (isNaN(m) || isNaN(A) || isNaN(C)) {
      alert("Please enter valid numbers for mass, area, and drag coefficient.");
      return;
    }
    if (m <= 0 || A <= 0) {
      alert("Mass and area must be positive.");
      return;
    }
    if (C < 0.1 || C > 1) {
      alert("Drag coefficient must be between 0.1 and 1.");
      return;
    }

    const B = m / (C * A);
    const steps = [
      `Inputs: m = ${m} kg, A = ${A} m², C = ${C}`,
      `Step 1: Calculate ballistic coefficient`,
      `B = m / (C × A)`,
      `B = ${m} / (${C} × ${A}) = ${B.toFixed(2)} kg/m²`,
    ];

    setResults(<p>Ballistic Coefficient: {B.toFixed(2)} kg/m²</p>);
    setSteps(steps);

    const historyEntry = {
      inputs: `m = ${m} kg, A = ${A} m², C = ${C}`,
      results: `B = ${B.toFixed(2)} kg/m²`,
      timestamp: new Date().toLocaleString(),
    };
    setHistory([...history, historyEntry]);

    updatePieChart(m, C * A);
    updateBarChart(m, A, C);
  };

  const updatePieChart = (mass, dragTerm) => {
    const ctx = pieChartRef.current.getContext("2d");
    const total = mass + dragTerm;
    const data = [((mass / total) * 100).toFixed(1), ((dragTerm / total) * 100).toFixed(1)].map((val) =>
      parseFloat(val)
    );

    if (pieChartInstance) pieChartInstance.destroy();
    pieChartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Mass Contribution", "Drag Contribution"],
        datasets: [
          {
            data: data,
            backgroundColor: ["#ef4444", "#f87171"],
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { color: "#1f2937" } },
        },
      },
    });
  };

  const updateBarChart = (mass, area, dragCoefficient) => {
    const ctx = barChartRef.current.getContext("2d");
    if (barChartInstance) barChartInstance.destroy();
    barChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Mass (kg)", "Area (m²)", "Drag Coefficient"],
        datasets: [
          {
            label: "Parameters",
            data: [mass, area, dragCoefficient],
            backgroundColor: ["#ef4444", "#f87171", "#fca5a5"],
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#1f2937" },
            grid: { color: "rgba(0, 0, 0, 0.1)" },
          },
          x: { ticks: { color: "#1f2937" } },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  };

  const clearInput = () => {
    setInputs({ mass: "", area: "", dragCoefficient: "" });
    setResults(null);
    setSteps([]);
    if (pieChartInstance) pieChartInstance.destroy();
    if (barChartInstance) barChartInstance.destroy();
  };

  const exportResults = () => {
    if (!results) {
      alert("No results to export.");
      return;
    }
    const content = `
      Results:
      ${results.props.children}
      
      Calculation Steps:
      ${steps.join("\n")}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ballistic_coefficient_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Advanced Ballistic Coefficient Calculator
          </h1>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Projectile Parameters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mass (kg):</label>
                <input
                  type="text"
                  name="mass"
                  value={inputs.mass}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cross-sectional Area (m²):</label>
                <input
                  type="text"
                  name="area"
                  value={inputs.area}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.0001"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Drag Coefficient:</label>
                <input
                  type="text"
                  name="dragCoefficient"
                  value={inputs.dragCoefficient}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.3"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={calculate}
              className="flex-1 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Calculate
            </button>
            <button
              onClick={clearInput}
              className="flex-1 py-2 px-4 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
            <button
              onClick={exportResults}
              className="flex-1 py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Export
            </button>
          </div>
          {results && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
              {results}
            </div>
          )}
          {steps.length > 0 && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Calculation Steps</h2>
              <ul className="list-decimal ml-6 text-gray-700">
                {steps.map((step, idx) => (
                  <li key={idx} className="mb-2">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-6">
            <div className={results ? "block" : "hidden"}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mass vs. Drag Contribution</h2>
              <div className="bg-white p-4 rounded-lg shadow">
                <canvas ref={pieChartRef} className="w-full h-64" />
              </div>
            </div>
            <div className={results ? "block" : "hidden"}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Input Parameters</h2>
              <div className="bg-white p-4 rounded-lg shadow">
                <canvas ref={barChartRef} className="w-full h-64" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Calculation History</h2>
            <div className="max-h-40 overflow-y-auto">
              {history.map((entry, idx) => (
                <div key={idx} className="p-3 mb-2 bg-white rounded-lg shadow hover:bg-gray-50 transition">
                  <p className="text-sm text-gray-700">Inputs: {entry.inputs}</p>
                  <p className="text-sm text-gray-700">Results: {entry.results}</p>
                  <p className="text-sm text-gray-500">Time: {entry.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedBallisticCoefficientCalculator;
