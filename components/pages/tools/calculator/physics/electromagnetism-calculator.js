"use client";

import React, { useState, useRef, useEffect } from "react";

const ElectromagnetismCalculator = () => {
  const [mode, setMode] = useState("electric-field");
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    charge: "",
    distance: "",
    xPos: "",
    yPos: "",
    voltage: "",
    resistance1: "",
    resistance2: "",
    circuitType: "series",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const k = 8.99e9; // Coulomb constant in N·m²/C²
  const mu0 = 4 * Math.PI * 1e-7; // Permeability of free space in T·m/A

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

  const calculateEM = () => {
    const { charge, distance, xPos, yPos, voltage, resistance1, resistance2, circuitType } = inputs;
    const steps = [];

    let q = parseFloat(charge),
      r = parseFloat(distance),
      x = parseFloat(xPos),
      y = parseFloat(yPos),
      V = parseFloat(voltage),
      R1 = parseFloat(resistance1),
      R2 = parseFloat(resistance2);

    // Unit conversions for CGS
    if (unitSystem === "imperial") {
      if (mode === "electric-field" || mode === "electric-potential") {
        q *= 3e9; // C to statC
        r *= 100; // m to cm
        x *= 100;
        y *= 100;
      } else if (mode === "magnetic-field") {
        q *= 10; // A to statA
        r *= 100; // m to cm
        x *= 100;
        y *= 100;
      } else if (mode === "circuit") {
        V *= 1 / 300; // V to statV
      }
      steps.push("Converted inputs to CGS: charge/current, distances, voltage.");
    }

    let result = { mode, unitSystem };

    if (mode === "electric-field") {
      if (isNaN(q) || isNaN(r) || r <= 0) {
        setResults(<p className="text-red-500">Charge and positive distance required.</p>);
        return;
      }
      let E = unitSystem === "si" ? (k * q) / (r * r) : q / (r * r); // N/C or dyn/statC
      let Ex = 0,
        Ey = 0;
      if (!isNaN(x) && !isNaN(y)) {
        const rVec = Math.sqrt(x * x + y * y);
        if (rVec === 0) {
          setResults(<p className="text-red-500">Position cannot be at origin.</p>);
          return;
        }
        E = unitSystem === "si" ? (k * q) / (rVec * rVec) : q / (rVec * rVec);
        Ex = E * (x / rVec);
        Ey = E * (y / rVec);
        steps.push(`Electric field at (x,y): E_x = E (x/r), E_y = E (y/r)`);
      }
      steps.push(
        `Electric field: E = ${unitSystem === "si" ? "k q / r²" : "q / r²"} = ${E.toFixed(2)} ${
          unitSystem === "si" ? "N/C" : "dyn/statC"
        }`
      );
      result = { ...result, E, Ex, Ey, q, r, x, y };
    } else if (mode === "electric-potential") {
      if (isNaN(q) || isNaN(r) || r <= 0) {
        setResults(<p className="text-red-500">Charge and positive distance required.</p>);
        return;
      }
      let V = unitSystem === "si" ? (k * q) / r : q / r; // J/C or erg/statC
      steps.push(
        `Electric potential: V = ${unitSystem === "si" ? "k q / r" : "q / r"} = ${V.toFixed(2)} ${
          unitSystem === "si" ? "J/C" : "erg/statC"
        }`
      );
      result = { ...result, V, q, r };
    } else if (mode === "magnetic-field") {
      if (isNaN(q) || isNaN(r) || r <= 0) {
        setResults(<p className="text-red-500">Current and positive distance required.</p>);
        return;
      }
      let B = unitSystem === "si" ? (mu0 * q) / (2 * Math.PI * r) : q / (2 * Math.PI * r); // T or G
      let Bx = 0,
        By = 0;
      if (!isNaN(x) && !isNaN(y)) {
        const rVec = Math.sqrt(x * x + y * y);
        if (rVec === 0) {
          setResults(<p className="text-red-500">Position cannot be at origin.</p>);
          return;
        }
        B = unitSystem === "si" ? (mu0 * q) / (2 * Math.PI * rVec) : q / (2 * Math.PI * rVec);
        Bx = -B * (y / rVec);
        By = B * (x / rVec);
        steps.push(`Magnetic field at (x,y): B_x = -B (y/r), B_y = B (x/r)`);
      }
      steps.push(
        `Magnetic field: B = ${unitSystem === "si" ? "μ₀ I / (2π r)" : "I / (2π r)"} = ${B.toFixed(2)} ${
          unitSystem === "si" ? "T" : "G"
        }`
      );
      result = { ...result, B, Bx, By, I: q, r, x, y };
    } else if (mode === "circuit") {
      if (isNaN(V) || V < 0 || isNaN(R1) || R1 <= 0 || isNaN(R2) || R2 <= 0) {
        setResults(<p className="text-red-500">Positive voltage and resistances required.</p>);
        return;
      }
      let Rtotal;
      if (circuitType === "series") {
        Rtotal = R1 + R2;
        steps.push(`Series: R_total = R₁ + R₂ = ${R1} + ${R2} = ${Rtotal.toFixed(2)} Ω`);
      } else {
        Rtotal = 1 / (1 / R1 + 1 / R2);
        steps.push(`Parallel: 1/R_total = 1/R₁ + 1/R₂ → R_total = ${Rtotal.toFixed(2)} Ω`);
      }
      let I = V / Rtotal;
      let P = I * I * Rtotal;
      steps.push(
        `Current: I = V / R_total = ${V} / ${Rtotal} = ${I.toFixed(2)} ${unitSystem === "si" ? "A" : "statA"}`
      );
      steps.push(
        `Power: P = I² R_total = ${I}^2 × ${Rtotal} = ${P.toFixed(2)} ${unitSystem === "si" ? "W" : "erg/s"}`
      );
      result = { ...result, circuitType, V, R1, R2, Rtotal, I, P };
    }

    // Convert outputs back to SI for display if CGS
    if (unitSystem === "imperial") {
      if (mode === "electric-field") {
        result.E /= 3e4; // dyn/statC to N/C
        result.Ex /= 3e4;
        result.Ey /= 3e4;
        result.q /= 3e9; // statC to C
        result.r /= 100; // cm to m
        result.x /= 100;
        result.y /= 100;
      } else if (mode === "electric-potential") {
        result.V /= 3e2; // erg/statC to J/C
        result.q /= 3e9;
        result.r /= 100;
      } else if (mode === "magnetic-field") {
        result.B *= 1e4; // G to T
        result.Bx *= 1e4;
        result.By *= 1e4;
        result.I /= 10; // statA to A
        result.r /= 100;
        result.x /= 100;
        result.y /= 100;
      } else if (mode === "circuit") {
        result.V *= 300; // statV to V
        result.I *= 3e9; // statA to A
        result.P *= 1e7; // erg/s to W
      }
      steps.push("Converted outputs back to SI for display.");
    }

    // Display results
    setResults(
      <div>
        {mode === "electric-field" && (
          <>
            <p>
              Electric Field: {result.E.toFixed(2)} {unitSystem === "si" ? "N/C" : "dyn/statC"}
            </p>
            {result.Ex && (
              <p>
                E_x: {result.Ex.toFixed(2)} {unitSystem === "si" ? "N/C" : "dyn/statC"}
              </p>
            )}
            {result.Ey && (
              <p>
                E_y: {result.Ey.toFixed(2)} {unitSystem === "si" ? "N/C" : "dyn/statC"}
              </p>
            )}
          </>
        )}
        {mode === "electric-potential" && (
          <p>
            Electric Potential: {result.V.toFixed(2)} {unitSystem === "si" ? "J/C" : "erg/statC"}
          </p>
        )}
        {mode === "magnetic-field" && (
          <>
            <p>
              Magnetic Field: {result.B.toFixed(2)} {unitSystem === "si" ? "T" : "G"}
            </p>
            {result.Bx && (
              <p>
                B_x: {result.Bx.toFixed(2)} {unitSystem === "si" ? "T" : "G"}
              </p>
            )}
            {result.By && (
              <p>
                B_y: {result.By.toFixed(2)} {unitSystem === "si" ? "T" : "G"}
              </p>
            )}
          </>
        )}
        {mode === "circuit" && (
          <>
            <p>Total Resistance: {result.Rtotal.toFixed(2)} Ω</p>
            <p>
              Current: {result.I.toFixed(2)} {unitSystem === "si" ? "A" : "statA"}
            </p>
            <p>
              Power: {result.P.toFixed(2)} {unitSystem === "si" ? "W" : "erg/s"}
            </p>
          </>
        )}
        <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Solution Steps</h2>
        {steps.map((step, idx) => (
          <p key={idx} className="text-sm text-gray-700 mb-2">
            {step}
          </p>
        ))}
      </div>
    );

    setHistory([...history, { ...result, timestamp: new Date().toISOString() }]);
    plotGraph(result);
  };

  const importFromVectorResolver = () => {
    alert("Import from Vector Resolver not implemented. Please enter forces manually.");
  };

  const plotGraph = (result) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#000000";
    ctx.fillText(`${result.mode} Visualization`, 10, 20);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const scale = 50; // Pixels per meter

    if (result.mode === "electric-field" || result.mode === "electric-potential") {
      // Draw charge at origin
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
      ctx.fillStyle = result.q > 0 ? "#ef4444" : "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(
        `q = ${result.q.toFixed(2)} ${result.unitSystem === "si" ? "C" : "statC"}`,
        cx + 10,
        cy - 10
      );

      // Draw field lines or equipotential
      if (result.mode === "electric-field") {
        for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 8) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          const rMax = 100;
          for (let r = 10; r < rMax; r += 5) {
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            ctx.lineTo(cx + x * scale, cy + y * scale);
          }
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        if (result.x && result.y) {
          const E = Math.sqrt(result.Ex * result.Ex + result.Ey * result.Ey);
          const Ex = (result.Ex / E) * 20;
          const Ey = (result.Ey / E) * 20;
          ctx.beginPath();
          ctx.moveTo(cx + result.x * scale, cy - result.y * scale);
          ctx.lineTo(cx + result.x * scale + Ex, cy - result.y * scale - Ey);
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillText(
            `E = ${result.E.toFixed(2)} ${result.unitSystem === "si" ? "N/C" : "dyn/statC"}`,
            cx + result.x * scale + 10,
            cy - result.y * scale - 10
          );
        }
      } else {
        for (let r = 20; r <= 100; r += 20) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, 2 * Math.PI);
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        if (result.r) {
          ctx.fillText(
            `V = ${result.V.toFixed(2)} ${result.unitSystem === "si" ? "J/C" : "erg/statC"}`,
            cx + result.r * scale + 10,
            cy
          );
        }
      }
    } else if (result.mode === "magnetic-field") {
      // Draw wire
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy);
      ctx.lineTo(cx + 50, cy);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#000000";
      ctx.fillText(`I = ${result.I.toFixed(2)} ${result.unitSystem === "si" ? "A" : "statA"}`, cx + 60, cy);

      // Draw circular field lines
      for (let r = 20; r <= 100; r += 20) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      if (result.x && result.y) {
        const B = Math.sqrt(result.Bx * result.Bx + result.By * result.By);
        const Bx = (result.Bx / B) * 20;
        const By = (result.By / B) * 20;
        ctx.beginPath();
        ctx.moveTo(cx + result.x * scale, cy - result.y * scale);
        ctx.lineTo(cx + result.x * scale + Bx, cy - result.y * scale - By);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillText(
          `B = ${result.B.toFixed(2)} ${result.unitSystem === "si" ? "T" : "G"}`,
          cx + result.x * scale + 10,
          cy - result.y * scale - 10
        );
      }
    } else if (result.mode === "circuit") {
      // Draw simple circuit diagram
      const x = cx - 100,
        y = cy;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 50, y); // Battery
      ctx.moveTo(x + 50, y - 20);
      ctx.lineTo(x + 50, y + 20);
      ctx.moveTo(x + 60, y - 10);
      ctx.lineTo(x + 60, y + 10);
      ctx.lineTo(x + 100, y); // R1
      ctx.lineTo(x + 100, y - 20);
      ctx.lineTo(x + 100, y + 20);
      ctx.lineTo(x + 150, y); // R2
      ctx.lineTo(x + 150, y - 20);
      ctx.lineTo(x + 150, y + 20);
      ctx.lineTo(x + 200, y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#000000";
      ctx.fillText(
        `V = ${result.V.toFixed(2)} ${result.unitSystem === "si" ? "V" : "statV"}`,
        x + 30,
        y - 30
      );
      ctx.fillText(`R₁ = ${result.R1.toFixed(2)} Ω`, x + 80, y - 30);
      ctx.fillText(`R₂ = ${result.R2.toFixed(2)} Ω`, x + 130, y - 30);
      ctx.fillText(
        `I = ${result.I.toFixed(2)} ${result.unitSystem === "si" ? "A" : "statA"}`,
        x + 180,
        y - 30
      );
    }
  };

  const clearInputs = () => {
    setInputs({
      charge: "",
      distance: "",
      xPos: "",
      yPos: "",
      voltage: "",
      resistance1: "",
      resistance2: "",
      circuitType: "series",
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
      "Run,Mode,UnitSystem,Timestamp,Charge,Current,Distance,X,Y,Voltage,R1,R2,CircuitType,E,Ex,Ey,V,B,Bx,By,Rtotal,I,P",
      ...history.map((run, index) => {
        return `${index + 1},${run.mode},${run.unitSystem},${run.timestamp},${
          run.q ? run.q.toFixed(2) : ""
        },${run.I ? run.I.toFixed(2) : ""},${run.r ? run.r.toFixed(2) : ""},${
          run.x ? run.x.toFixed(2) : ""
        },${run.y ? run.y.toFixed(2) : ""},${run.V ? run.V.toFixed(2) : ""},${
          run.R1 ? run.R1.toFixed(2) : ""
        },${run.R2 ? run.R2.toFixed(2) : ""},${run.circuitType || ""},${run.E ? run.E.toFixed(2) : ""},${
          run.Ex ? run.Ex.toFixed(2) : ""
        },${run.Ey ? run.Ey.toFixed(2) : ""},${
          run.V && run.mode === "electric-potential" ? run.V.toFixed(2) : ""
        },${run.B ? run.B.toFixed(2) : ""},${run.Bx ? run.Bx.toFixed(2) : ""},${
          run.By ? run.By.toFixed(2) : ""
        },${run.Rtotal ? run.Rtotal.toFixed(2) : ""},${
          run.I && run.mode === "circuit" ? run.I.toFixed(2) : ""
        },${run.P ? run.P.toFixed(2) : ""}`;
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "electromagnetism_data.csv";
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
    a.download = "electromagnetism_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateEM();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className="min-h-screen bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-5xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Electromagnetism Calculator</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Calculation Mode:</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Calculation mode"
            >
              <option value="electric-field">Electric Field</option>
              <option value="electric-potential">Electric Potential</option>
              <option value="magnetic-field">Magnetic Field</option>
              <option value="circuit">Circuit Analysis</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit System:</label>
            <select
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Unit system"
            >
              <option value="si">SI (C, A, V, Ω, T)</option>
              <option value="imperial">CGS (statC, statA, statV, Ω, G)</option>
            </select>
          </div>
        </div>
        {mode !== "circuit" && (
          <div className="p-4 bg-gray-200 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Field Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {mode === "magnetic-field" ? "Current (A)" : "Charge (C)"}
                </label>
                <input
                  type="text"
                  name="charge"
                  value={inputs.charge}
                  onChange={handleInputChange}
                  placeholder="e.g., 1e-6"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label={mode === "magnetic-field" ? "Current in Amperes" : "Charge in Coulombs"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Distance (m):</label>
                <input
                  type="text"
                  name="distance"
                  value={inputs.distance}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Distance in meters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">X Position (m):</label>
                <input
                  type="text"
                  name="xPos"
                  value={inputs.xPos}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="X position in meters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Y Position (m):</label>
                <input
                  type="text"
                  name="yPos"
                  value={inputs.yPos}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Y position in meters"
                  pukta
                />
              </div>
            </div>
          </div>
        )}
        {mode === "circuit" && (
          <div className="p-4 bg-gray-200 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Circuit Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Voltage (V):</label>
                <input
                  type="text"
                  name="voltage"
                  value={inputs.voltage}
                  onChange={handleInputChange}
                  placeholder="e.g., 12"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Voltage in volts"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Resistance 1 (Ω):</label>
                <input
                  type="text"
                  name="resistance1"
                  value={inputs.resistance1}
                  onChange={handleInputChange}
                  placeholder="e.g., 10"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Resistance 1 in ohms"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Resistance 2 (Ω):</label>
                <input
                  type="text"
                  name="resistance2"
                  value={inputs.resistance2}
                  onChange={handleInputChange}
                  placeholder="e.g., 20"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Resistance 2 in ohms"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Circuit Type:</label>
                <select
                  name="circuitType"
                  value={inputs.circuitType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Circuit type"
                >
                  <option value="series">Series</option>
                  <option value="parallel">Parallel</option>
                </select>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateEM}
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
                  Run {idx + 1} ({run.mode}, {run.unitSystem}, {new Date(run.timestamp).toLocaleString()}):
                </p>
                {run.mode === "electric-field" && (
                  <>
                    <p>
                      Charge: {run.q.toFixed(2)} {run.unitSystem === "si" ? "C" : "statC"}
                    </p>
                    <p>
                      Distance: {run.r.toFixed(2)} {run.unitSystem === "si" ? "m" : "cm"}
                    </p>
                    <p>
                      Electric Field: {run.E.toFixed(2)} {run.unitSystem === "si" ? "N/C" : "dyn/statC"}
                    </p>
                    {run.x && (
                      <p>
                        Position: ({run.x.toFixed(2)}, {run.y.toFixed(2)}){" "}
                        {run.unitSystem === "si" ? "m" : "cm"}
                      </p>
                    )}
                    {run.Ex && (
                      <p>
                        E_x: {run.Ex.toFixed(2)} {run.unitSystem === "si" ? "N/C" : "dyn/statC"}
                      </p>
                    )}
                    {run.Ey && (
                      <p>
                        E_y: {run.Ey.toFixed(2)} {run.unitSystem === "si" ? "N/C" : "dyn/statC"}
                      </p>
                    )}
                  </>
                )}
                {run.mode === "electric-potential" && (
                  <>
                    <p>
                      Charge: {run.q.toFixed(2)} {run.unitSystem === "si" ? "C" : "statC"}
                    </p>
                    <p>
                      Distance: {run.r.toFixed(2)} {run.unitSystem === "si" ? "m" : "cm"}
                    </p>
                    <p>
                      Electric Potential: {run.V.toFixed(2)} {run.unitSystem === "si" ? "J/C" : "erg/statC"}
                    </p>
                  </>
                )}
                {run.mode === "magnetic-field" && (
                  <>
                    <p>
                      Current: {run.I.toFixed(2)} {run.unitSystem === "si" ? "A" : "statA"}
                    </p>
                    <p>
                      Distance: {run.r.toFixed(2)} {run.unitSystem === "si" ? "m" : "cm"}
                    </p>
                    <p>
                      Magnetic Field: {run.B.toFixed(2)} {run.unitSystem === "si" ? "T" : "G"}
                    </p>
                    {run.x && (
                      <p>
                        Position: ({run.x.toFixed(2)}, {run.y.toFixed(2)}){" "}
                        {run.unitSystem === "si" ? "m" : "cm"}
                      </p>
                    )}
                    {run.Bx && (
                      <p>
                        B_x: {run.Bx.toFixed(2)} {run.unitSystem === "si" ? "T" : "G"}
                      </p>
                    )}
                    {run.By && (
                      <p>
                        B_y: {run.By.toFixed(2)} {run.unitSystem === "si" ? "T" : "G"}
                      </p>
                    )}
                  </>
                )}
                {run.mode === "circuit" && (
                  <>
                    <p>
                      Voltage: {run.V.toFixed(2)} {run.unitSystem === "si" ? "V" : "statV"}
                    </p>
                    <p>
                      R₁: {run.R1.toFixed(2)} Ω, R₂: {run.R2.toFixed(2)} Ω
                    </p>
                    <p>Total Resistance: {run.Rtotal.toFixed(2)} Ω</p>
                    <p>
                      Current: {run.I.toFixed(2)} {run.unitSystem === "si" ? "A" : "statA"}
                    </p>
                    <p>
                      Power: {run.P.toFixed(2)} {run.unitSystem === "si" ? "W" : "erg/s"}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectromagnetismCalculator;
