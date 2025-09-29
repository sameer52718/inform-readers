"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const inputsMap = {
  velocity: [
    { id: "v_f", label: "Final Velocity (m/s)", placeholder: "e.g., 20" },
    { id: "v_i", label: "Initial Velocity (m/s)", placeholder: "e.g., 10" },
    { id: "t", label: "Time (s)", placeholder: "e.g., 5" },
  ],
  distance: [
    { id: "s", label: "Distance (m)", placeholder: "e.g., 100" },
    { id: "v_i", label: "Initial Velocity (m/s)", placeholder: "e.g., 0" },
    { id: "t", label: "Time (s)", placeholder: "e.g., 10" },
  ],
  force: [
    { id: "f", label: "Force (N)", placeholder: "e.g., 500" },
    { id: "m", label: "Mass (kg)", placeholder: "e.g., 50" },
  ],
};

export default function AccelerationCalculator() {
  const [method, setMethod] = useState("velocity");
  const [unit, setUnit] = useState("m/s²");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [chartVisible, setChartVisible] = useState(false);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("accelHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("accelHistory", JSON.stringify(history));
  }, [history]);

  const validate = () => {
    const errs = {};
    inputsMap[method].forEach(({ id }) => {
      const val = formData[id];
      if (val === undefined || val === "" || isNaN(val)) {
        errs[id] = "Please enter a valid number";
      } else if ((id === "t" || id === "m") && parseFloat(val) <= 0) {
        errs[id] = `${id === "t" ? "Time" : "Mass"} must be positive`;
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const calculate = () => {
    if (!validate()) return;

    const values = Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, parseFloat(v)]));

    let a;
    if (method === "velocity") a = (values.v_f - values.v_i) / values.t;
    else if (method === "distance") a = (2 * (values.s - values.v_i * values.t)) / values.t ** 2;
    else a = values.f / values.m;

    if (unit === "ft/s²") a *= 3.28084;

    const final = a.toFixed(2);
    setResult(final);
    const entry = {
      method,
      values,
      result: final,
      unit,
      timestamp: new Date().toLocaleString(),
    };
    setHistory((prev) => [...prev, entry]);
    renderChart(method, values, unit);
  };

  const renderChart = (method, values, unit) => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    let data = [],
      labels = [],
      label = "",
      title = "";

    if (method === "velocity") {
      labels = Array.from({ length: 10 }, (_, i) => ((i * values.t) / 9).toFixed(1));
      data = labels.map((x) => values.v_i + ((values.v_f - values.v_i) / values.t) * x);
      label = "Velocity (m/s)";
      title = "Velocity vs. Time";
    } else if (method === "distance") {
      const a = (2 * (values.s - values.v_i * values.t)) / values.t ** 2;
      labels = Array.from({ length: 10 }, (_, i) => ((i * values.t) / 9).toFixed(1));
      data = labels.map((x) => values.v_i * x + 0.5 * a * x * x);
      label = "Distance (m)";
      title = "Distance vs. Time";
    } else {
      labels = Array.from({ length: 10 }, (_, i) => (values.m * (0.5 + i * 0.1)).toFixed(1));
      data = labels.map((m) => (values.f / m).toFixed(2));
      label = `Acceleration (${unit})`;
      title = "Acceleration vs. Mass";
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: title } },
        scales: {
          x: { title: { display: true, text: method === "force" ? "Mass (kg)" : "Time (s)" } },
          y: { title: { display: true, text: label } },
        },
      },
    });
    setChartVisible(true);
  };

  return (
    <div className="  flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-6">Acceleration Calculator</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Calculation Method</label>
          <select
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="velocity">Velocity Difference</option>
            <option value="distance">Distance-Time</option>
            <option value="force">Force-Mass</option>
          </select>
        </div>

        {inputsMap[method].map(({ id, label, placeholder }) => (
          <div key={id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type="number"
              placeholder={placeholder}
              step="any"
              value={formData[id] || ""}
              onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            />
            {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          >
            <option value="m/s²">m/s²</option>
            <option value="ft/s²">ft/s²</option>
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-lg font-semibold text-red-900">
              Acceleration:{" "}
              <span>
                {result} {unit}
              </span>
            </p>
          </div>
        )}

        <button
          onClick={() => setChartVisible(!chartVisible)}
          className="mt-4 bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 transition"
        >
          {chartVisible ? "Hide Chart" : "Show Chart"}
        </button>

        {chartVisible && (
          <div className="mt-4">
            <canvas ref={canvasRef}></canvas>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Calculation History</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.map((entry, i) => (
              <div key={i} className="p-2 bg-red-100 rounded">
                <p className="text-sm">
                  <strong>Method:</strong> {entry.method}
                </p>
                <p className="text-sm">
                  <strong>Inputs:</strong> {JSON.stringify(entry.values)}
                </p>
                <p className="text-sm">
                  <strong>Result:</strong> {entry.result} {entry.unit}
                </p>
                <p className="text-sm text-gray-500">{entry.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
