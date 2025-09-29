"use client";

import React, { useState, useRef, useEffect } from "react";

const FluidDynamicsCalculator = () => {
  const [solveFor, setSolveFor] = useState("velocity");
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    density: "",
    gravity: "",
    area1: "",
    velocity1: "",
    pressure1: "",
    height1: "",
    area2: "",
    velocity2: "",
    pressure2: "",
    height2: "",
    pipeDiameter: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 400;
    }
  }, []);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculateFluid = () => {
    const {
      density,
      gravity,
      area1,
      velocity1,
      pressure1,
      height1,
      area2,
      velocity2,
      pressure2,
      height2,
      pipeDiameter,
    } = inputs;
    const steps = [];

    let rho = parseFloat(density),
      g = parseFloat(gravity),
      A1 = parseFloat(area1),
      A2 = parseFloat(area2),
      v1 = parseFloat(velocity1),
      v2 = parseFloat(velocity2),
      P1 = parseFloat(pressure1),
      P2 = parseFloat(pressure2),
      h1 = parseFloat(height1),
      h2 = parseFloat(height2),
      d = parseFloat(pipeDiameter);

    // Unit conversions for imperial
    if (unitSystem === "imperial") {
      rho *= 0.062428; // kg/m³ to lbm/ft³
      g *= 3.28084; // m/s² to ft/s²
      A1 *= 10.7639; // m² to ft²
      A2 *= 10.7639;
      if (!isNaN(v1)) v1 *= 3.28084; // m/s to ft/s
      if (!isNaN(v2)) v2 *= 3.28084;
      if (!isNaN(P1)) P1 *= 0.000145038; // Pa to psi
      if (!isNaN(P2)) P2 *= 0.000145038;
      h1 *= 3.28084; // m to ft
      h2 *= 3.28084;
      d *= 3.28084;
      steps.push("Converted inputs to imperial: density, areas, velocities, pressures, heights, diameter.");
    }

    // Input validation
    if (isNaN(rho) || rho <= 0) {
      setResults(<p className="text-red-500">Density must be positive.</p>);
      return;
    }
    if (isNaN(g) || g <= 0) {
      setResults(<p className="text-red-500">Gravity must be positive.</p>);
      return;
    }
    if (isNaN(A1) || A1 <= 0 || isNaN(A2) || A2 <= 0) {
      setResults(<p className="text-red-500">Areas must be positive.</p>);
      return;
    }
    if (isNaN(h1) || isNaN(h2)) {
      setResults(<p className="text-red-500">Heights must be valid numbers.</p>);
      return;
    }
    if (isNaN(d) || d <= 0) {
      setResults(<p className="text-red-500">Pipe diameter must be positive.</p>);
      return;
    }

    let Q, v1_calc, v2_calc, P1_calc, P2_calc;

    // Continuity equation: A1 v1 = A2 v2
    if (solveFor === "velocity") {
      if (isNaN(v1) && isNaN(v2)) {
        setResults(<p className="text-red-500">At least one velocity must be provided.</p>);
        return;
      }
      if (!isNaN(v1)) {
        v2_calc = (A1 * v1) / A2;
        Q = A1 * v1;
        steps.push(
          `Continuity: A₁ v₁ = A₂ v₂ → v₂ = (${A1.toFixed(4)} × ${v1.toFixed(2)}) / ${A2.toFixed(
            4
          )} = ${v2_calc.toFixed(2)} ${unitSystem === "si" ? "m/s" : "ft/s"}`
        );
      } else {
        v1_calc = (A2 * v2) / A1;
        Q = A2 * v2;
        steps.push(
          `Continuity: A₁ v₁ = A₂ v₂ → v₁ = (${A2.toFixed(4)} × ${v2.toFixed(2)}) / ${A1.toFixed(
            4
          )} = ${v1_calc.toFixed(2)} ${unitSystem === "si" ? "m/s" : "ft/s"}`
        );
      }
    } else if (solveFor === "flow-rate") {
      if (isNaN(v1) && isNaN(v2)) {
        setResults(<p className="text-red-500">At least one velocity must be provided.</p>);
        return;
      }
      if (!isNaN(v1)) {
        Q = A1 * v1;
        v2_calc = Q / A2;
        steps.push(
          `Flow rate: Q = A₁ v₁ = ${A1.toFixed(4)} × ${v1.toFixed(2)} = ${Q.toFixed(2)} ${
            unitSystem === "si" ? "m³/s" : "ft³/s"
          }`
        );
        steps.push(
          `Velocity at point 2: v₂ = Q / A₂ = ${Q.toFixed(2)} / ${A2.toFixed(4)} = ${v2_calc.toFixed(2)} ${
            unitSystem === "si" ? "m/s" : "ft/s"
          }`
        );
      } else {
        Q = A2 * v2;
        v1_calc = Q / A1;
        steps.push(
          `Flow rate: Q = A₂ v₂ = ${A2.toFixed(4)} × ${v2.toFixed(2)} = ${Q.toFixed(2)} ${
            unitSystem === "si" ? "m³/s" : "ft³/s"
          }`
        );
        steps.push(
          `Velocity at point 1: v₁ = Q / A₁ = ${Q.toFixed(2)} / ${A1.toFixed(4)} = ${v1_calc.toFixed(2)} ${
            unitSystem === "si" ? "m/s" : "ft/s"
          }`
        );
      }
    } else if (solveFor === "pressure") {
      if (isNaN(P1) && isNaN(P2)) {
        setResults(<p className="text-red-500">At least one pressure must be provided.</p>);
        return;
      }
      if (isNaN(v1) && isNaN(v2)) {
        setResults(<p className="text-red-500">At least one velocity must be provided.</p>);
        return;
      }
      if (!isNaN(v1)) {
        v2_calc = (A1 * v1) / A2;
        Q = A1 * v1;
      } else {
        v1_calc = (A2 * v2) / A1;
        Q = A2 * v2;
      }
      steps.push(`Continuity: Q = A₁ v₁ = A₂ v₂ = ${Q.toFixed(2)} ${unitSystem === "si" ? "m³/s" : "ft³/s"}`);
    }

    // Assign final velocities
    v1 = !isNaN(v1) ? v1 : v1_calc;
    v2 = !isNaN(v2) ? v2 : v2_calc;

    // Bernoulli's equation
    if (solveFor === "pressure") {
      if (!isNaN(P1)) {
        P2_calc = P1 + 0.5 * rho * (v1 * v1 - v2 * v2) + rho * g * (h1 - h2);
        steps.push(`Bernoulli: P₂ = P₁ + ½ ρ (v₁² - v₂²) + ρ g (h₁ - h₂)`);
        steps.push(
          `P₂ = ${P1.toFixed(2)} + ½ × ${rho.toFixed(2)} × (${v1.toFixed(2)}^2 - ${v2.toFixed(
            2
          )}^2) + ${rho.toFixed(2)} × ${g.toFixed(2)} × (${h1.toFixed(2)} - ${h2.toFixed(
            2
          )}) = ${P2_calc.toFixed(2)} ${unitSystem === "si" ? "Pa" : "psi"}`
        );
      } else {
        P1_calc = P2 + 0.5 * rho * (v2 * v2 - v1 * v1) + rho * g * (h2 - h1);
        steps.push(`Bernoulli: P₁ = P₂ + ½ ρ (v₂² - v₁²) + ρ g (h₂ - h₁)`);
        steps.push(
          `P₁ = ${P2.toFixed(2)} + ½ × ${rho.toFixed(2)} × (${v2.toFixed(2)}^2 - ${v1.toFixed(
            2
          )}^2) + ${rho.toFixed(2)} × ${g.toFixed(2)} × (${h2.toFixed(2)} - ${h1.toFixed(
            2
          )}) = ${P1_calc.toFixed(2)} ${unitSystem === "si" ? "Pa" : "psi"}`
        );
      }
    }

    // Convert outputs back to SI for display if imperial
    if (unitSystem === "imperial") {
      Q /= 35.3147; // ft³/s to m³/s
      v1 /= 3.28084; // ft/s to m/s
      v2 /= 3.28084;
      P1 = !isNaN(P1) ? P1 / 0.000145038 : P1_calc / 0.000145038; // psi to Pa
      P2 = !isNaN(P2) ? P2 / 0.000145038 : P2_calc / 0.000145038;
      A1 /= 10.7639; // ft² to m²
      A2 /= 10.7639;
      h1 /= 3.28084; // ft to m
      h2 /= 3.28084;
      d /= 3.28084;
      rho /= 0.062428; // lbm/ft³ to kg/m³
      g /= 3.28084; // ft/s² to m/s²
      steps.push("Converted outputs back to SI for display.");
    }

    // Display results
    setResults(
      <div>
        <p>
          Flow Rate: {Q.toFixed(2)} {unitSystem === "si" ? "m³/s" : "ft³/s"}
        </p>
        <p>
          Velocity at Point 1: {v1.toFixed(2)} {unitSystem === "si" ? "m/s" : "ft/s"}
        </p>
        <p>
          Velocity at Point 2: {v2.toFixed(2)} {unitSystem === "si" ? "m/s" : "ft/s"}
        </p>
        <p>
          Pressure at Point 1: {P1.toFixed(2)} {unitSystem === "si" ? "Pa" : "psi"}
        </p>
        <p>
          Pressure at Point 2: {P2.toFixed(2)} {unitSystem === "si" ? "Pa" : "psi"}
        </p>
        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
        {steps.map((step, idx) => (
          <p key={idx} className="text-sm text-gray-700 mb-2">
            {step}
          </p>
        ))}
      </div>
    );

    // Add to history
    setHistory([
      ...history,
      {
        solveFor,
        unitSystem,
        density: rho,
        gravity: g,
        area1: A1,
        area2: A2,
        velocity1: v1,
        velocity2: v2,
        pressure1: P1,
        pressure2: P2,
        height1: h1,
        height2: h2,
        flowRate: Q,
        pipeDiameter: d,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Plot graph
    plotGraph(A1, A2, v1, v2, P1, P2, h1, h2, d);
  };

  const importFromVectorResolver = () => {
    alert("Import from Vector Resolver not implemented. Please enter forces manually.");
  };

  const plotGraph = (A1, A2, v1, v2, P1, P2, h1, h2, d) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#000000";
    ctx.fillText("Pipe Flow Visualization", 10, 20);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const pipeLength = 600;
    const maxRadius = 50;
    const scale = maxRadius / Math.sqrt(Math.max(A1, A2) / Math.PI);

    // Draw pipe (trapezoid shape)
    const r1 = Math.sqrt(A1 / Math.PI) * scale;
    const r2 = Math.sqrt(A2 / Math.PI) * scale;
    ctx.beginPath();
    ctx.moveTo(cx - pipeLength / 2, cy - r1);
    ctx.lineTo(cx + pipeLength / 2, cy - r2);
    ctx.lineTo(cx + pipeLength / 2, cy + r2);
    ctx.lineTo(cx - pipeLength / 2, cy + r1);
    ctx.closePath();
    ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
    ctx.fill();
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw flow arrows
    ctx.beginPath();
    ctx.moveTo(cx - pipeLength / 4, cy);
    ctx.lineTo(cx - pipeLength / 4 + 20, cy);
    ctx.moveTo(cx + pipeLength / 4 - 20, cy);
    ctx.lineTo(cx + pipeLength / 4, cy);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - pipeLength / 4 + 20, cy);
    ctx.lineTo(cx - pipeLength / 4 + 10, cy - 5);
    ctx.moveTo(cx - pipeLength / 4 + 20, cy);
    ctx.lineTo(cx - pipeLength / 4 + 10, cy + 5);
    ctx.moveTo(cx + pipeLength / 4, cy);
    ctx.lineTo(cx + pipeLength / 4 - 10, cy - 5);
    ctx.moveTo(cx + pipeLength / 4, cy);
    ctx.lineTo(cx + pipeLength / 4 - 10, cy + 5);
    ctx.stroke();

    // Annotate velocities and pressures
    ctx.fillStyle = "#000000";
    ctx.fillText(
      `v₁: ${v1.toFixed(2)} ${unitSystem === "si" ? "m/s" : "ft/s"}`,
      cx - pipeLength / 2,
      cy - r1 - 20
    );
    ctx.fillText(
      `P₁: ${P1.toFixed(2)} ${unitSystem === "si" ? "Pa" : "psi"}`,
      cx - pipeLength / 2,
      cy - r1 - 40
    );
    ctx.fillText(
      `v₂: ${v2.toFixed(2)} ${unitSystem === "si" ? "m/s" : "ft/s"}`,
      cx + pipeLength / 2,
      cy - r2 - 20
    );
    ctx.fillText(
      `P₂: ${P2.toFixed(2)} ${unitSystem === "si" ? "Pa" : "psi"}`,
      cx + pipeLength / 2,
      cy - r2 - 40
    );
  };

  const clearInputs = () => {
    setInputs({
      density: "",
      gravity: "",
      area1: "",
      velocity1: "",
      pressure1: "",
      height1: "",
      area2: "",
      velocity2: "",
      pressure2: "",
      height2: "",
      pipeDiameter: "",
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
      "Run,SolveFor,UnitSystem,Timestamp,Density,Gravity,Area1,Velocity1,Pressure1,Height1,Area2,Velocity2,Pressure2,Height2,FlowRate,PipeDiameter",
      ...history.map(
        (run, index) => `
        ${index + 1},${run.solveFor},${run.unitSystem},${run.timestamp},
        ${run.density.toFixed(2)},${run.gravity.toFixed(2)},
        ${run.area1.toFixed(4)},${run.velocity1.toFixed(2)},${run.pressure1.toFixed(2)},${run.height1.toFixed(
          2
        )},
        ${run.area2.toFixed(4)},${run.velocity2.toFixed(2)},${run.pressure2.toFixed(2)},${run.height2.toFixed(
          2
        )},
        ${run.flowRate.toFixed(2)},${run.pipeDiameter.toFixed(2)}
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fluid_dynamics_data.csv";
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
    a.download = "fluid_dynamics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateFluid();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className=" bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-5xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Fluid Dynamics Calculator</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="solve-for" className="block text-sm font-medium text-gray-700">
              Solve For:
            </label>
            <select
              id="solve-for"
              value={solveFor}
              onChange={(e) => setSolveFor(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Solve for"
            >
              <option value="velocity">Velocity</option>
              <option value="pressure">Pressure</option>
              <option value="flow-rate">Flow Rate</option>
            </select>
          </div>
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
              <option value="si">SI (m/s, Pa, m³/s)</option>
              <option value="imperial">Imperial (ft/s, psi, ft³/s)</option>
            </select>
          </div>
          <div>
            <label htmlFor="density" className="block text-sm font-medium text-gray-700">
              Fluid Density (kg/m³):
            </label>
            <input
              type="text"
              id="density"
              name="density"
              value={inputs.density}
              onChange={handleInputChange}
              placeholder="e.g., 1000"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Fluid density in kg/m³"
            />
          </div>
          <div>
            <label htmlFor="gravity" className="block text-sm font-medium text-gray-700">
              Gravity (m/s²):
            </label>
            <input
              type="text"
              id="gravity"
              name="gravity"
              value={inputs.gravity}
              onChange={handleInputChange}
              placeholder="e.g., 9.81"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Gravitational acceleration in m/s²"
            />
          </div>
        </div>
        <div className="p-4 bg-gray-200 rounded-lg mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Point 1 (Inlet)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="area1" className="block text-sm font-medium text-gray-700">
                Cross-Sectional Area (m²):
              </label>
              <input
                type="text"
                id="area1"
                name="area1"
                value={inputs.area1}
                onChange={handleInputChange}
                placeholder="e.g., 0.01"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Area at point 1 in m²"
              />
            </div>
            <div>
              <label htmlFor="velocity1" className="block text-sm font-medium text-gray-700">
                Velocity (m/s):
              </label>
              <input
                type="text"
                id="velocity1"
                name="velocity1"
                value={inputs.velocity1}
                onChange={handleInputChange}
                placeholder="e.g., 2"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Velocity at point 1 in m/s"
              />
            </div>
            <div>
              <label htmlFor="pressure1" className="block text-sm font-medium text-gray-700">
                Pressure (Pa):
              </label>
              <input
                type="text"
                id="pressure1"
                name="pressure1"
                value={inputs.pressure1}
                onChange={handleInputChange}
                placeholder="e.g., 101325"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Pressure at point 1 in Pa"
              />
            </div>
            <div>
              <label htmlFor="height1" className="block text-sm font-medium text-gray-700">
                Height (m):
              </label>
              <input
                type="text"
                id="height1"
                name="height1"
                value={inputs.height1}
                onChange={handleInputChange}
                placeholder="e.g., 0"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Height at point 1 in meters"
              />
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-200 rounded-lg mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Point 2 (Outlet)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="area2" className="block text-sm font-medium text-gray-700">
                Cross-Sectional Area (m²):
              </label>
              <input
                type="text"
                id="area2"
                name="area2"
                value={inputs.area2}
                onChange={handleInputChange}
                placeholder="e.g., 0.005"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Area at point 2 in m²"
              />
            </div>
            <div>
              <label htmlFor="velocity2" className="block text-sm font-medium text-gray-700">
                Velocity (m/s):
              </label>
              <input
                type="text"
                id="velocity2"
                name="velocity2"
                value={inputs.velocity2}
                onChange={handleInputChange}
                placeholder="e.g., 4"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Velocity at point 2 in m/s"
              />
            </div>
            <div>
              <label htmlFor="pressure2" className="block text-sm font-medium text-gray-700">
                Pressure (Pa):
              </label>
              <input
                type="text"
                id="pressure2"
                name="pressure2"
                value={inputs.pressure2}
                onChange={handleInputChange}
                placeholder="e.g., 100000"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Pressure at point 2 in Pa"
              />
            </div>
            <div>
              <label htmlFor="height2" className="block text-sm font-medium text-gray-700">
                Height (m):
              </label>
              <input
                type="text"
                id="height2"
                name="height2"
                value={inputs.height2}
                onChange={handleInputChange}
                placeholder="e.g., 1"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Height at point 2 in meters"
              />
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-200 rounded-lg mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Visualization</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="pipe-diameter" className="block text-sm font-medium text-gray-700">
                Pipe Diameter (m):
              </label>
              <input
                type="text"
                id="pipe-diameter"
                name="pipeDiameter"
                value={inputs.pipeDiameter}
                onChange={handleInputChange}
                placeholder="e.g., 0.1"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Pipe diameter in meters"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateFluid}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={importFromVectorResolver}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Import Forces
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
            {history.map((run, idx) => (
              <div key={idx} className="p-2 mb-2 bg-white rounded-lg shadow-sm">
                <p>
                  Run {idx + 1} ({run.solveFor}, {run.unitSystem}, {new Date(run.timestamp).toLocaleString()}
                  ):
                </p>
                <p>
                  Density: {run.density.toFixed(2)} {run.unitSystem === "si" ? "kg/m³" : "lbm/ft³"}
                </p>
                <p>
                  Point 1: A₁ = {run.area1.toFixed(4)} {run.unitSystem === "si" ? "m²" : "ft²"}, v₁ ={" "}
                  {run.velocity1.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "ft/s"}, P₁ ={" "}
                  {run.pressure1.toFixed(2)} {run.unitSystem === "si" ? "Pa" : "psi"}, h₁ ={" "}
                  {run.height1.toFixed(2)} {run.unitSystem === "si" ? "m" : "ft"}
                </p>
                <p>
                  Point 2: A₂ = {run.area2.toFixed(4)} {run.unitSystem === "si" ? "m²" : "ft²"}, v₂ ={" "}
                  {run.velocity2.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "ft/s"}, P₂ ={" "}
                  {run.pressure2.toFixed(2)} {run.unitSystem === "si" ? "Pa" : "psi"}, h₂ ={" "}
                  {run.height2.toFixed(2)} {run.unitSystem === "si" ? "m" : "ft"}
                </p>
                <p>
                  Flow Rate: {run.flowRate.toFixed(2)} {run.unitSystem === "si" ? "m³/s" : "ft³/s"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluidDynamicsCalculator;
