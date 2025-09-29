"use client";

import React, { useState, useRef, useEffect } from "react";

const FreeFallAirResistanceCalculator = () => {
  const [unitSystem, setUnitSystem] = useState("si");
  const [plotType, setPlotType] = useState("position");
  const [inputs, setInputs] = useState({
    mass: "",
    dragCoefficient: "",
    area: "",
    airDensity: "",
    initialHeight: "",
    timeStep: "",
    numSteps: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const g = 9.81; // m/s²
  const lb_to_kg = 0.453592; // lb to kg
  const ft_to_m = 0.3048; // ft to m
  const ft2_to_m2 = 0.092903; // ft² to m²

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 400;
    }
  }, []);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const { mass, dragCoefficient, area, airDensity, initialHeight, timeStep, numSteps } = inputs;
    const steps = [];

    let m = parseFloat(mass),
      Cd = parseFloat(dragCoefficient),
      A = parseFloat(area),
      rho = parseFloat(airDensity) || 1.225,
      h = parseFloat(initialHeight),
      dt = parseFloat(timeStep),
      N = parseInt(numSteps);

    // Unit conversions
    if (unitSystem === "imperial") {
      m *= lb_to_kg; // lb to kg
      A *= ft2_to_m2; // ft² to m²
      h *= ft_to_m; // ft to m
      steps.push("Converted mass (lb to kg), area (ft² to m²), height (ft to m).");
    }

    // Input validation
    if (
      isNaN(m) ||
      m <= 0 ||
      isNaN(Cd) ||
      Cd <= 0 ||
      isNaN(A) ||
      A <= 0 ||
      isNaN(rho) ||
      rho <= 0 ||
      isNaN(h) ||
      h <= 0 ||
      isNaN(dt) ||
      dt <= 0 ||
      isNaN(N) ||
      N <= 0
    ) {
      setResults(<p className="text-red-500">Positive m, C_d, A, ρ, h, Δt, and N required.</p>);
      return;
    }

    // Numerical integration (Euler method)
    let y = h,
      v = 0,
      t = 0;
    const positions = [y],
      velocities = [v],
      times = [t];
    let groundTime = null;
    for (let i = 0; i < N; i++) {
      const drag = 0.5 * rho * Cd * A * v * v;
      const a = g - drag / m;
      v += a * dt;
      y -= v * dt;
      t += dt;
      positions.push(y);
      velocities.push(v);
      times.push(t);
      if (y <= 0 && groundTime === null) {
        groundTime = t;
      }
      if (y <= 0) break;
    }
    steps.push(`Initialized: y = ${h.toFixed(2)} m, v = 0 m/s, t = 0 s`);
    steps.push(`Euler method: a = g - (ρ C_d A v²)/(2m), v_{n+1} = v_n + a Δt, y_{n+1} = y_n - v_n Δt`);
    steps.push(`Simulated ${positions.length} steps with Δt = ${dt.toFixed(4)} s`);
    if (groundTime) {
      steps.push(`Ground reached at t ≈ ${groundTime.toFixed(2)} s`);
    } else {
      steps.push(`Ground not reached within ${N} steps`);
    }

    // Convert back for display
    let m_display = parseFloat(mass),
      A_display = parseFloat(area),
      h_display = parseFloat(initialHeight);
    const positions_display = positions.map((p) => (unitSystem === "imperial" ? p / ft_to_m : p));
    const velocities_display = velocities.map((v) => (unitSystem === "imperial" ? v / ft_to_m : v));
    if (unitSystem === "imperial") {
      steps.push("Converted positions (m to ft), velocities (m/s to ft/s).");
    }

    const result = {
      unitSystem,
      mass: m_display,
      dragCoefficient: Cd,
      area: A_display,
      airDensity: rho,
      initialHeight: h_display,
      timeStep: dt,
      numSteps: N,
      plotType,
      positions: positions_display,
      velocities: velocities_display,
      times,
      groundTime,
      timestamp: new Date().toISOString(),
    };

    // Display results
    setResults(
      <div>
        <p>
          Mass: {m_display.toFixed(2)} {unitSystem === "si" ? "kg" : "lb"}
        </p>
        <p>Drag Coefficient: {Cd.toFixed(2)}</p>
        <p>
          Cross-sectional Area: {A_display.toFixed(2)} {unitSystem === "si" ? "m²" : "ft²"}
        </p>
        <p>Air Density: {rho.toFixed(3)} kg/m³</p>
        <p>
          Initial Height: {h_display.toFixed(2)} {unitSystem === "si" ? "m" : "ft"}
        </p>
        <p>Time Step: {dt.toFixed(4)} s</p>
        <p>Number of Steps: {N}</p>
        <p>Ground Time: {groundTime ? groundTime.toFixed(2) + " s" : "Not reached"}</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
        {steps.map((step, idx) => (
          <p key={idx} className="text-sm text-gray-700 mb-2">
            {step}
          </p>
        ))}
      </div>
    );

    // Add to history
    setHistory([...history, result]);

    // Plot graph
    plotGraph(result);
  };

  const plotGraph = (result) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#000000";
    ctx.fillText(`${result.plotType === "position" ? "Position" : "Velocity"} vs Time`, 10, 20);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const plotWidth = canvas.width - 100;
    const plotHeight = canvas.height - 100;

    // Plot position or velocity vs time
    const maxT = Math.max(...result.times);
    const maxY = Math.max(...result.positions, result.initialHeight);
    const maxV = Math.max(...result.velocities);
    ctx.beginPath();
    for (let i = 0; i < result.times.length; i++) {
      const t = result.times[i];
      const value = result.plotType === "position" ? result.positions[i] : result.velocities[i];
      const maxValue = result.plotType === "position" ? maxY : maxV;
      const px = cx - plotWidth / 2 + (t / maxT) * plotWidth;
      const py = cy + plotHeight / 2 - (value / maxValue) * plotHeight;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Mark ground time if applicable
    if (result.groundTime) {
      const px = cx - plotWidth / 2 + (result.groundTime / maxT) * plotWidth;
      const py = cy + plotHeight / 2;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(`t=${result.groundTime.toFixed(2)} s`, px + 10, py - 20);
    }

    ctx.fillStyle = "#000000";
    ctx.fillText(`Time (s)`, cx + plotWidth / 2, cy + plotHeight / 2 + 20);
    ctx.fillText(
      `${
        result.plotType === "position"
          ? `Position (${result.unitSystem === "si" ? "m" : "ft"})`
          : `Velocity (${result.unitSystem === "si" ? "m/s" : "ft/s"})`
      }`,
      cx - plotWidth / 2 - 20,
      cy - plotHeight / 2
    );
  };

  const clearInputs = () => {
    setInputs({
      mass: "",
      dragCoefficient: "",
      area: "",
      airDensity: "",
      initialHeight: "",
      timeStep: "",
      numSteps: "",
    });
    setResults(null);
    setHistory([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const exportCSV = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const csv = [
      "Run,UnitSystem,Timestamp,Mass,DragCoefficient,Area,AirDensity,InitialHeight,TimeStep,NumSteps,GroundTime",
      ...history.map(
        (run, index) => `
        ${index + 1},${run.unitSystem},${run.timestamp},${run.mass.toFixed(2)},${run.dragCoefficient.toFixed(
          2
        )},
        ${run.area.toFixed(2)},${run.airDensity.toFixed(3)},${run.initialHeight.toFixed(2)},
        ${run.timeStep.toFixed(4)},${run.numSteps},${run.groundTime ? run.groundTime.toFixed(2) : "N/A"}
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "free_fall_air_resistance_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "free_fall_air_resistance_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculate();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className=" bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-4xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Free Fall with Air Resistance Calculator
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="unit-system" className="block text-sm font-medium text-gray-700">
              Unit System:
            </label>
            <select
              id="unit-system"
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Unit system"
            >
              <option value="si">SI (kg, m, s)</option>
              <option value="imperial">Imperial (lb, ft, s)</option>
            </select>
          </div>
          <div>
            <label htmlFor="mass" className="block text-sm font-medium text-gray-700">
              Mass:
            </label>
            <input
              type="text"
              id="mass"
              name="mass"
              value={inputs.mass}
              onChange={handleInputChange}
              placeholder="e.g., 80 (kg or lb)"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Mass"
            />
          </div>
          <div>
            <label htmlFor="drag-coefficient" className="block text-sm font-medium text-gray-700">
              Drag Coefficient:
            </label>
            <input
              type="text"
              id="drag-coefficient"
              name="dragCoefficient"
              value={inputs.dragCoefficient}
              onChange={handleInputChange}
              placeholder="e.g., 0.47"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Drag coefficient"
            />
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">
              Cross-sectional Area:
            </label>
            <input
              type="text"
              id="area"
              name="area"
              value={inputs.area}
              onChange={handleInputChange}
              placeholder="e.g., 0.7 (m² or ft²)"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Area"
            />
          </div>
          <div>
            <label htmlFor="air-density" className="block text-sm font-medium text-gray-700">
              Air Density (kg/m³):
            </label>
            <input
              type="text"
              id="air-density"
              name="airDensity"
              value={inputs.airDensity}
              onChange={handleInputChange}
              placeholder="e.g., 1.225"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Air density"
            />
          </div>
          <div>
            <label htmlFor="initial-height" className="block text-sm font-medium text-gray-700">
              Initial Height:
            </label>
            <input
              type="text"
              id="initial-height"
              name="initialHeight"
              value={inputs.initialHeight}
              onChange={handleInputChange}
              placeholder="e.g., 1000 (m or ft)"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Initial height"
            />
          </div>
          <div>
            <label htmlFor="time-step" className="block text-sm font-medium text-gray-700">
              Time Step (s):
            </label>
            <input
              type="text"
              id="time-step"
              name="timeStep"
              value={inputs.timeStep}
              onChange={handleInputChange}
              placeholder="e.g., 0.01"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Time step"
            />
          </div>
          <div>
            <label htmlFor="num-steps" className="block text-sm font-medium text-gray-700">
              Number of Steps:
            </label>
            <input
              type="text"
              id="num-steps"
              name="numSteps"
              value={inputs.numSteps}
              onChange={handleInputChange}
              placeholder="e.g., 1000"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Number of steps"
            />
          </div>
          <div>
            <label htmlFor="plot-type" className="block text-sm font-medium text-gray-700">
              Plot Type:
            </label>
            <select
              id="plot-type"
              value={plotType}
              onChange={(e) => setPlotType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Plot type"
            >
              <option value="position">Position vs Time</option>
              <option value="velocity">Velocity vs Time</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculate}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={clearInputs}
            className="flex-1 min-w-[120px] py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Clear
          </button>
          <button
            onClick={exportCSV}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Export CSV
          </button>
          <button
            onClick={exportJSON}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Export JSON
          </button>
        </div>
        <canvas ref={canvasRef} className="w-full h-96 bg-gray-100 rounded-lg mb-4 border border-gray-200" />
        <div className="p-4 bg-gray-100 rounded-lg mb-4">{results}</div>
        <div className="p-4 bg-gray-100 rounded-lg max-h-52 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Calculation History</h2>
          <div>
            {history.map((run, index) => (
              <div key={index} className="p-2 mb-2 bg-white rounded-lg shadow-sm">
                <p>
                  Run {index + 1} ({run.unitSystem}, {new Date(run.timestamp).toLocaleString()}):
                </p>
                <p>
                  Mass: {run.mass.toFixed(2)} {run.unitSystem === "si" ? "kg" : "lb"}
                </p>
                <p>Drag Coefficient: {run.dragCoefficient.toFixed(2)}</p>
                <p>
                  Area: {run.area.toFixed(2)} {run.unitSystem === "si" ? "m²" : "ft²"}
                </p>
                <p>Air Density: {run.airDensity.toFixed(3)} kg/m³</p>
                <p>
                  Initial Height: {run.initialHeight.toFixed(2)} {run.unitSystem === "si" ? "m" : "ft"}
                </p>
                <p>Time Step: {run.timeStep.toFixed(4)} s</p>
                <p>Number of Steps: {run.numSteps}</p>
                <p>Ground Time: {run.groundTime ? run.groundTime.toFixed(2) + " s" : "Not reached"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeFallAirResistanceCalculator;
