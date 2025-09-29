"use client";

import React, { useState, useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const CarCrashCalculator = () => {
  const [collisionType, setCollisionType] = useState("elastic");
  const [forceUnit, setForceUnit] = useState("N");
  const [energyUnit, setEnergyUnit] = useState("J");
  const [accelUnit, setAccelUnit] = useState("m/s²");
  const [inputs, setInputs] = useState({
    mass: "",
    v_i: "",
    v_f: "",
    t: "",
  });
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("crashHistory")) || []
      : []
  );
  const [showCharts, setShowCharts] = useState(false);
  const forceChartRef = useRef(null);
  const energyChartRef = useRef(null);
  let forceChartInstance = null;
  let energyChartInstance = null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("crashHistory", JSON.stringify(history));
    }
  }, [history]);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const newErrors = {};
    const fields = [
      { id: "mass", label: "Mass", value: inputs.mass, positive: true },
      { id: "v_i", label: "Initial Velocity", value: inputs.v_i },
      { id: "v_f", label: "Final Velocity", value: inputs.v_f },
      { id: "t", label: "Time", value: inputs.t, positive: true },
    ];

    fields.forEach(({ id, label, value, positive }) => {
      if (value === "" || isNaN(value)) {
        newErrors[id] = `Please enter a valid number for ${label.toLowerCase()}`;
      } else if (positive && parseFloat(value) <= 0) {
        newErrors[id] = `${label} must be positive`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCrash = () => {
    if (!validateInputs()) return;

    const values = {
      mass: parseFloat(inputs.mass),
      v_i: parseFloat(inputs.v_i),
      v_f: parseFloat(inputs.v_f),
      t: parseFloat(inputs.t),
    };
    const units = { collisionType, forceUnit, energyUnit, accelUnit };

    let a = (values.v_f - values.v_i) / values.t;
    if (accelUnit === "ft/s²") a *= 3.28084;
    const gForce = Math.abs(a / 9.81);

    let force = values.mass * Math.abs(a);
    if (forceUnit === "kN") force /= 1000;

    let ke_i = 0.5 * values.mass * values.v_i * values.v_i;
    let ke_f =
      collisionType === "inelastic"
        ? 0
        : 0.5 * values.mass * values.v_f * values.v_f;
    if (energyUnit === "kJ") {
      ke_i /= 1000;
      ke_f /= 1000;
    }

    const warning =
      gForce > 50 ? "Warning: G-forces exceed safe human tolerance (>50g)" : "";

    const results = {
      force: force.toFixed(2),
      ke_i: ke_i.toFixed(2),
      ke_f: ke_f.toFixed(2),
      decel: a.toFixed(4),
      gForce: gForce.toFixed(2),
      warning,
    };

    setResults(results);
    setHistory([...history, { values, units, results, timestamp: new Date().toLocaleString() }]);
    renderCharts(values, units);
  };

  const renderCharts = (values, units) => {
    const { mass, t } = values;

    if (forceChartInstance) forceChartInstance.destroy();
    const times = Array.from({ length: 100 }, (_, i) => t * (0.1 + i * 0.01));
    const forces = times.map((tm) => {
      let f = mass * Math.abs((values.v_f - values.v_i) / tm);
      if (forceUnit === "kN") f /= 1000;
      return f;
    });

    forceChartInstance = new Chart(forceChartRef.current, {
      type: "line",
      data: {
        labels: [
          {
            label: `Force (${forceUnit})`,
            data: forces,
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
        labels: times,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: "Collision Time (s)" } },
          y: { title: { display: true, text: `Force (${forceUnit})` } },
        },
        plugins: { title: { display: true, text: "Impact Force vs. Collision Time" } },
      },
    });

    if (energyChartInstance) energyChartInstance.destroy();
    const keData = [
      {
        label: "Initial",
        value: (0.5 * mass * values.v_i * values.v_i * (units.energyUnit === "kJ" ? 1000 : 1)).toFixed(2),
      },
      {
        label: "Final",
        value: (units.collisionType === "inelastic" ? 0 : 0.5 * mass * values.v_f ** 2 / (units.energyUnit === "kJ" ? 1000 : 1)).toFixed(2),
      },
    ];

    energyChartInstance = new Chart(energyChartRef.current, {
      type: "bar",
      data: {
        labels: [
          {
            label: `Kinetic Energy (${energyUnit})`,
            data: keData.map(d => d.value),
            backgroundColor: ["#ef4444", "#f87171"],
            borderColor: ["white", "white"],
            borderWidth: [1,1],
          },
        ],
        labels: keData.map((d) => d.label),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: `Energy (${energyUnit})` } },
        },
        plugins: { title: { display: true, text: "Energy Before/After Crash" } },
      },
    });
  };

  const toggleChart = () => {
    setShowCharts(!showCharts);
  };

  const exportCharts = () => {
    if (!forceChartInstance || !energyChartInstance) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = forceChartRef.current.width;
    canvas.height = forceChartRef.current.height + energyChartRef.current.height + 20;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(forceChartRef.current, 0, 0);
    ctx.drawImage(energyChartRef.current, 0, forceChartRef.current.height + 20);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "crash_charts.png";
    a.click();
  };

  const exportHistory = () => {
    if (!history.length) return;
    const csv = [
      "Collision Type,Mass,Initial Velocity,Final Velocity,Time,Force,Force Unit,KE Initial,KE Final,Energy Unit,Deceleration,Accel Unit,Timestamp",
      ...history.map(
        (entry) =>
          `${entry.units.collisionType},${entry.values.mass},${entry.values.v_i},${entry.values.v_f},${entry.values.t},${entry.results.force},${entry.units.forceUnit},${entry.results.ke_i},${entry.results.ke_f},${entry.units.energyUnit},${entry.results.decel},${entry.units.accelUnit},${entry.timestamp}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crash_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("crashHistory");
    }
  };

  return (
    <div className=" bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Car Crash Calculator
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Collision Type
          </label>
          <select
            value={collisionType}
            onChange={(e) => setCollisionType(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          >
            <option value="elastic">Elastic</option>
            <option value="inelastic">Inelastic</option>
          </select>
        </div>

        <div className="space-y-4">
          {[
            { id: "mass", label: "Vehicle Mass (kg)", placeholder: "e.g., 1500" },
            {
              id: "v_i",
              label: "Initial Velocity (m/s)",
              placeholder: "e.g., 20",
            },
            { id: "v_f", label: "Final Velocity (m/s)", placeholder: "e.g., 0" },
            { id: "t", label: "Collision Time (s)", placeholder: "e.g., 0.1" },
          ].map(({ id, label, placeholder }) => (
            <div key={id}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type="number"
                name={id}
                value={inputs[id]}
                onChange={handleInputChange}
                placeholder={placeholder}
                step="any"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
              {errors[id] && (
                <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Force Unit
          </label>
          <select
            value={forceUnit}
            onChange={(e) => setForceUnit(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          >
            <option value="N">N</option>
            <option value="kN">kN</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Energy Unit
          </label>
          <select
            value={energyUnit}
            onChange={(e) => setEnergyUnit(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          >
            <option value="J">J</option>
            <option value="kJ">kJ</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Acceleration Unit
          </label>
          <select
            value={accelUnit}
            onChange={(e) => setAccelUnit(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          >
            <option value="m/s²">m/s²</option>
            <option value="ft/s²">ft/s²</option>
          </select>
        </div>

        <button
          onClick={calculateCrash}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Calculate
        </button>

        {results && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-lg font-semibold text-gray-900">
              Impact Force: {results.force} {forceUnit}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Initial Kinetic Energy: {results.ke_i} {energyUnit}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Final Kinetic Energy: {results.ke_f} {energyUnit}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Deceleration: {results.decel} {accelUnit} ({results.gForce}g)
            </p>
            {results.warning && (
              <p className="text-sm text-red-500 mt-2">{results.warning}</p>
            )}
          </div>
        )}

        <div className="mt-4 flex space-x-2">
          <button
            onClick={toggleChart}
            className="bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 transition"
          >
            {showCharts ? "Hide Charts" : "Show Charts"}
          </button>
          <button
            onClick={exportCharts}
            className={`bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 transition ${
              !showCharts ? "hidden" : ""
            }`}
          >
            Export Charts
          </button>
        </div>

        <div
          className={`mt-4 space-y-4 transition-max-height duration-300 ${
            showCharts ? "max-h-[600px]" : "max-h-0 overflow-hidden"
          }`}
        >
          <canvas ref={forceChartRef} className="w-full h-64" />
          <canvas ref={energyChartRef} className="w-full h-64" />
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Calculation History
          </h2>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.map((entry, idx) => (
              <div
                key={idx}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition"
              >
                <p className="text-sm">
                  <strong>Collision:</strong> {entry.units.collisionType}
                </p>
                <p className="text-sm">
                  <strong>Inputs:</strong> Mass={entry.values.mass}kg, v_i=
                  {entry.values.v_i}m/s, v_f={entry.values.v_f}m/s, t=
                  {entry.values.t}s
                </p>
                <p className="text-sm">
                  <strong>Force:</strong> {entry.results.force}{" "}
                  {entry.units.forceUnit}
                </p>
                <p className="text-sm">
                  <strong>Deceleration:</strong> {entry.results.decel}{" "}
                  {entry.units.accelUnit}
                </p>
                <p className="text-sm text-gray-500">{entry.timestamp}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex space-x-2">
            <button
              onClick={exportHistory}
              className="bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 transition"
            >
              Export History
            </button>
            <button
              onClick={clearHistory}
              className="bg-red-200 text-red-800 py-1 px-4 rounded hover:bg-red-300 transition"
            >
              Clear History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCrashCalculator;