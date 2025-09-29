"use client";

import React, { useState, useRef, useEffect } from "react";

const EnergyCalculator = () => {
  const [inputs, setInputs] = useState({
    mass: "",
    velocity: "",
    height: "",
    gravity: "9.81",
  });
  const [units, setUnits] = useState({
    mass: "kg",
    velocity: "m/s",
    height: "m",
    gravity: "m/s²",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const conversionFactors = {
    kg: 1,
    g: 0.001,
    "m/s": 1,
    "km/h": 1000 / 3600,
    "ft/s": 0.3048,
    m: 1,
    ft: 0.3048,
    "m/s²": 1,
    "ft/s²": 0.3048,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 300;
    }
  }, []);

  const convertToSI = (value, unit) => value * conversionFactors[unit];
  const convertFromSI = (value, unit) => value / conversionFactors[unit];

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleUnitChange = (e) => {
    setUnits({ ...units, [e.target.name]: e.target.value });
  };

  const calculateEnergy = () => {
    const values = {};
    const selectedUnits = { ...units };

    for (const key in inputs) {
      const value = parseFloat(inputs[key]);
      if (isNaN(value)) {
        setResults(<p className="text-red-500">Please provide valid number for {key}.</p>);
        return;
      }
      values[key] = convertToSI(value, units[key]);
    }

    if (values.mass <= 0) {
      setResults(<p className="text-red-500">Mass must be positive.</p>);
      return;
    }
    if (values.height < 0) {
      setResults(<p className="text-red-500">Height cannot be negative.</p>);
      return;
    }
    if (values.gravity <= 0) {
      setResults(<p className="text-red-500">Gravity must be positive.</p>);
      return;
    }

    try {
      const ke = 0.5 * values.mass * values.velocity * values.velocity;
      const pe = values.mass * values.gravity * values.height;
      const total = ke + pe;

      const displaySolution = {
        ke,
        pe,
        total,
        mass: convertFromSI(values.mass, selectedUnits.mass),
        velocity: convertFromSI(values.velocity, selectedUnits.velocity),
        height: convertFromSI(values.height, selectedUnits.height),
        gravity: convertFromSI(values.gravity, selectedUnits.gravity),
      };

      const steps = [
        `Given: m = ${displaySolution.mass.toFixed(2)} ${
          selectedUnits.mass
        }, v = ${displaySolution.velocity.toFixed(2)} ${
          selectedUnits.velocity
        }, h = ${displaySolution.height.toFixed(2)} ${
          selectedUnits.height
        }, g = ${displaySolution.gravity.toFixed(2)} ${selectedUnits.gravity}`,
        `Kinetic Energy: KE = ½mv² = 0.5 * ${values.mass.toFixed(2)} * (${values.velocity.toFixed(
          2
        )})² = ${ke.toFixed(2)} J`,
        `Potential Energy: PE = mgh = ${values.mass.toFixed(2)} * ${values.gravity.toFixed(
          2
        )} * ${values.height.toFixed(2)} = ${pe.toFixed(2)} J`,
        `Total Energy: E = KE + PE = ${ke.toFixed(2)} + ${pe.toFixed(2)} = ${total.toFixed(2)} J`,
      ];

      setResults(
        <div>
          <p>Kinetic Energy (KE) = {ke.toFixed(2)} J</p>
          <p>Potential Energy (PE) = {pe.toFixed(2)} J</p>
          <p>Total Energy (E) = {total.toFixed(2)} J</p>
          <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
          {steps.map((step, idx) => (
            <p key={idx} className="text-sm text-gray-700 mb-2">
              {step}
            </p>
          ))}
        </div>
      );

      setHistory([...history, { values, selectedUnits, solution: displaySolution, steps }]);
      plotGraph(displaySolution);
    } catch (error) {
      console.error("Calculation error:", error);
      setResults(<p className="text-red-500">Error in calculation. Check inputs.</p>);
    }
  };

  const importFromSUVAT = () => {
    alert("Import from SUVAT not implemented. Please enter velocity and height manually.");
  };

  const plotGraph = (solution) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#000000";
    ctx.fillText("Energy (J) vs Height (m)", 10, 20);

    const maxH = solution.height * 1.2;
    const maxE = solution.total * 1.2;
    const scaleX = (canvas.width - 100) / maxH;
    const scaleY = (canvas.height - 40) / maxE;

    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 20);
    ctx.lineTo(canvas.width - 10, canvas.height - 20);
    ctx.moveTo(50, canvas.height - 20);
    ctx.lineTo(50, 10);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 20 - solution.ke * scaleY);
    ctx.lineTo(50 + solution.height * scaleX, canvas.height - 20 - solution.ke * scaleY);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 20);
    ctx.lineTo(50 + solution.height * scaleX, canvas.height - 20 - solution.pe * scaleY);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 20 - solution.total * scaleY);
    ctx.lineTo(50 + solution.height * scaleX, canvas.height - 20 - solution.total * scaleY);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const clearInputs = () => {
    setInputs({ mass: "", velocity: "", height: "", gravity: "9.81" });
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
      "Run,Mass,Unit,Velocity,Unit,Height,Unit,Gravity,Unit,KE (J),PE (J),Total (J)",
      ...history.map(
        (run, index) => `
        ${index + 1},
        ${run.solution.mass.toFixed(2)},${run.selectedUnits.mass},
        ${run.solution.velocity.toFixed(2)},${run.selectedUnits.velocity},
        ${run.solution.height.toFixed(2)},${run.selectedUnits.height},
        ${run.solution.gravity.toFixed(2)},${run.selectedUnits.gravity},
        ${run.solution.ke.toFixed(2)},
        ${run.solution.pe.toFixed(2)},
        ${run.solution.total.toFixed(2)}
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "energy_data.csv";
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
    a.download = "energy_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateEnergy();
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
          Super Advanced Energy Calculator
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="mass" className="block text-sm font-medium text-gray-700">
              Mass (m):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="mass"
                name="mass"
                value={inputs.mass}
                onChange={handleInputChange}
                placeholder="e.g., 1"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Mass"
              />
              <select
                id="mass-unit"
                name="mass"
                value={units.mass}
                onChange={handleUnitChange}
                className="mt-1 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Mass unit"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="velocity" className="block text-sm font-medium text-gray-700">
              Velocity (v):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="velocity"
                name="velocity"
                value={inputs.velocity}
                onChange={handleInputChange}
                placeholder="e.g., 10"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Velocity"
              />
              <select
                id="velocity-unit"
                name="velocity"
                value={units.velocity}
                onChange={handleUnitChange}
                className="mt-1 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Velocity unit"
              >
                <option value="m/s">m/s</option>
                <option value="km/h">km/h</option>
                <option value="ft/s">ft/s</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
              Height (h):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="height"
                name="height"
                value={inputs.height}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Height"
              />
              <select
                id="height-unit"
                name="height"
                value={units.height}
                onChange={handleUnitChange}
                className="mt-1 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Height unit"
              >
                <option value="m">m</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="gravity" className="block text-sm font-medium text-gray-700">
              Gravity (g):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="gravity"
                name="gravity"
                value={inputs.gravity}
                onChange={handleInputChange}
                placeholder="e.g., 9.81"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Gravity"
              />
              <select
                id="gravity-unit"
                name="gravity"
                value={units.gravity}
                onChange={handleUnitChange}
                className="mt-1 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Gravity unit"
              >
                <option value="m/s²">m/s²</option>
                <option value="ft/s²">ft/s²</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateEnergy}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={importFromSUVAT}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Import from SUVAT
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
        <canvas ref={canvasRef} className="w-full h-72 bg-gray-100 rounded-lg mb-4 border border-gray-200" />
        <div className="p-4 bg-gray-100 rounded-lg mb-4">{results}</div>
        <div className="p-4 bg-gray-100 rounded-lg max-h-52 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Calculation History</h2>
          <div>
            {history.map((run, idx) => (
              <div key={idx} className="p-2 mb-2 bg-white rounded-lg shadow-sm">
                <p>Run {idx + 1}:</p>
                <p>
                  m = {run.solution.mass.toFixed(2)} {run.selectedUnits.mass}, v ={" "}
                  {run.solution.velocity.toFixed(2)} {run.selectedUnits.velocity}, h ={" "}
                  {run.solution.height.toFixed(2)} {run.selectedUnits.height}, g ={" "}
                  {run.solution.gravity.toFixed(2)} {run.selectedUnits.gravity}
                </p>
                <p>
                  KE = {run.solution.ke.toFixed(2)} J, PE = {run.solution.pe.toFixed(2)} J, E ={" "}
                  {run.solution.total.toFixed(2)} J
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyCalculator;
