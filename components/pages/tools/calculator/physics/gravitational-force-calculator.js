"use client";

import React, { useState, useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const GravitationalForceCalculator = () => {
  const [preset, setPreset] = useState("custom");
  const [inputs, setInputs] = useState({ m1: "", m2: "", r: "" });
  const [unit, setUnit] = useState("N");
  const [errors, setErrors] = useState({ m1: "", m2: "", r: "" });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const orbitRef = useRef(null);

  const G = 6.6743e-11;
  const presets = {
    "earth-moon": { m1: 5.972e24, m2: 7.342e22, r: 3.844e8 },
    "sun-earth": { m1: 1.989e30, m2: 5.972e24, r: 1.496e11 },
  };

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem("gravHistory")) || [];
    setHistory(savedHistory);

    // Initialize chart canvas
    const canvas = chartRef.current;
    if (canvas) {
      canvas.width = 400;
      canvas.height = 300;
    }

    // Start orbit animation if values exist
    if (result) {
      animateOrbit(result.values);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [result]);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handlePresetChange = (e) => {
    const value = e.target.value;
    setPreset(value);
    if (presets[value]) {
      setInputs(presets[value]);
    } else {
      setInputs({ m1: "", m2: "", r: "" });
    }
  };

  const validateInputs = () => {
    const newErrors = { m1: "", m2: "", r: "" };
    let valid = true;
    const fields = [
      { key: "m1", value: inputs.m1, label: "Mass 1" },
      { key: "m2", value: inputs.m2, label: "Mass 2" },
      { key: "r", value: inputs.r, label: "Distance" },
    ];

    fields.forEach((field) => {
      if (field.value === "" || isNaN(field.value)) {
        newErrors[field.key] = `${field.label} must be a valid number`;
        valid = false;
      } else if (parseFloat(field.value) <= 0) {
        newErrors[field.key] = `${field.label} must be positive`;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const calculateForce = (values, unit) => {
    const { m1, m2, r } = values;
    let force = (G * (m1 * m2)) / (r * r);
    let warningMsg = "";

    // Unit conversion
    if (unit === "μN") force *= 1e6;
    else if (unit === "nN") force *= 1e9;

    // Warning for unrealistic values
    if (r < 1e3) warningMsg = "Warning: Distance is unrealistically small for gravitational calculations";
    else if (force > 1e20 && unit === "N")
      warningMsg = "Warning: Force is extremely large, consider using smaller masses or larger distance";

    return { force: force.toFixed(2), warning: warningMsg };
  };

  const renderChart = (values, unit) => {
    if (chartInstance.current) chartInstance.current.destroy();

    const { r } = values;
    const distances = Array.from({ length: 10 }, (_, i) => r * (0.5 + i * 0.1));
    const forces = distances.map((d) => {
      let f = (G * (values.m1 * values.m2)) / (d * d);
      if (unit === "μN") f *= 1e6;
      else if (unit === "nN") f *= 1e9;
      return f.toFixed(2);
    });

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: distances.map((d) => d.toExponential(2)),
        datasets: [
          {
            label: `Force (${unit})`,
            data: forces,
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Distance (m)" } },
          y: { title: { display: true, text: `Force (${unit})` } },
        },
        plugins: { title: { display: true, text: "Gravitational Force vs. Distance" } },
      },
    });

    setShowChart(true);
  };

  const animateOrbit = (values) => {
    const { m1, r } = values;
    const period = (2 * Math.PI * Math.sqrt(r ** 3 / (G * m1))) / 1000; // Simplified orbital period
    let t = 0;

    const update = () => {
      const angle = ((t % period) / period) * 2 * Math.PI;
      const x = 150 + 50 * Math.cos(angle);
      const y = 100 + 50 * Math.sin(angle);
      if (orbitRef.current) {
        orbitRef.current.setAttribute("cx", x);
        orbitRef.current.setAttribute("cy", y);
      }
      t += 0.05;
      requestAnimationFrame(update);
    };

    update();
  };

  const calculate = () => {
    if (!validateInputs()) return;

    const values = {
      m1: parseFloat(inputs.m1),
      m2: parseFloat(inputs.m2),
      r: parseFloat(inputs.r),
    };
    const results = calculateForce(values, unit);

    setResult({ values, unit, results });
    updateHistory(values, unit, results);
    renderChart(values, unit);
  };

  const updateHistory = (values, unit, results) => {
    const entry = { values, unit, results, timestamp: new Date().toLocaleString() };
    const newHistory = [...history, entry];
    setHistory(newHistory);
    localStorage.setItem("gravHistory", JSON.stringify(newHistory));
  };

  const exportHistory = () => {
    if (history.length === 0) return;
    const csv = [
      "Mass 1 (kg),Mass 2 (kg),Distance (m),Force,Unit,Timestamp",
      ...history.map(
        (entry) =>
          `${entry.values.m1},${entry.values.m2},${entry.values.r},${entry.results.force},${entry.unit},${entry.timestamp}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gravitational_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportChart = () => {
    if (!chartInstance.current) return;
    const a = document.createElement("a");
    a.href = chartInstance.current.toBase64Image();
    a.download = "gravitational_force_chart.png";
    a.click();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("gravHistory");
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-md text-gray-900">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Gravitational Force Calculator</h1>
        <div className="mb-4">
          <label htmlFor="preset" className="block text-sm font-medium text-gray-700 mb-2">
            Planetary Preset
          </label>
          <select
            id="preset"
            value={preset}
            onChange={handlePresetChange}
            className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="custom">Custom</option>
            <option value="earth-moon">Earth-Moon</option>
            <option value="sun-earth">Sun-Earth</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="m1" className="block text-sm font-medium text-gray-700 mb-2">
            Mass 1 (kg)
          </label>
          <input
            id="m1"
            name="m1"
            type="number"
            value={inputs.m1}
            onChange={handleInputChange}
            placeholder="e.g., 5.972e24"
            step="any"
            className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          <p className="text-red-500 text-xs mt-1">{errors.m1}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="m2" className="block text-sm font-medium text-gray-700 mb-2">
            Mass 2 (kg)
          </label>
          <input
            id="m2"
            name="m2"
            type="number"
            value={inputs.m2}
            onChange={handleInputChange}
            placeholder="e.g., 7.342e22"
            step="any"
            className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          <p className="text-red-500 text-xs mt-1">{errors.m2}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="r" className="block text-sm font-medium text-gray-700 mb-2">
            Distance (m)
          </label>
          <input
            id="r"
            name="r"
            type="number"
            value={inputs.r}
            onChange={handleInputChange}
            placeholder="e.g., 3.844e8"
            step="any"
            className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          <p className="text-red-500 text-xs mt-1">{errors.r}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
            Force Unit
          </label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="N">N</option>
            <option value="μN">μN</option>
            <option value="nN">nN</option>
          </select>
        </div>
        <button
          onClick={calculate}
          className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
        >
          Calculate
        </button>
        {result && (
          <div className="bg-gray-200 p-4 rounded-lg mb-4">
            <p className="text-lg text-gray-900">
              Gravitational Force: {result.results.force} {result.unit}
            </p>
            {result.results.warning && <p className="text-red-500 text-sm mt-2">{result.results.warning}</p>}
          </div>
        )}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setShowChart(!showChart);
            }}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {showChart ? "Hide Chart" : "Show Chart"}
          </button>
          <button
            onClick={exportChart}
            className={`flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              !showChart ? "hidden" : ""
            }`}
          >
            Export Chart
          </button>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${showChart ? "max-h-[400px]" : "max-h-0"}`}
        >
          <canvas
            ref={chartRef}
            className="w-full h-72 bg-gray-100 rounded-lg border border-gray-200"
          ></canvas>
        </div>
        <div className="mt-4 text-center">
          <svg id="orbit-svg" width="300" height="200" className="mx-auto">
            <circle cx="150" cy="100" r="20" fill="#f59e0b" />
            <circle ref={orbitRef} cx="200" cy="100" r="10" fill="#ef4444" id="orbiting-body" />
          </svg>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Calculation History</h2>
          <div className="max-h-52 overflow-y-auto">
            {history.map((entry, index) => (
              <div key={index} className="bg-gray-200 p-3 rounded-lg mb-2 hover:bg-gray-300">
                <p>
                  <strong>Masses:</strong> {entry.values.m1.toExponential(2)} kg,{" "}
                  {entry.values.m2.toExponential(2)} kg
                </p>
                <p>
                  <strong>Distance:</strong> {entry.values.r.toExponential(2)} m
                </p>
                <p>
                  <strong>Force:</strong> {entry.results.force} {entry.unit}
                </p>
                <p className="text-gray-600 text-sm">{entry.timestamp}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={exportHistory}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Export History
            </button>
            <button
              onClick={clearHistory}
              className="flex-1 py-2 px-4 bg-red-100 text-red-700 font-semibold rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Clear History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GravitationalForceCalculator;
