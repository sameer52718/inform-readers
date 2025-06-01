"use client";

import React, { useState, useRef, useEffect } from "react";

const CosmologyCalculator = () => {
  const [mode, setMode] = useState("hubble-law");
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    distance: "",
    hubbleConstantHubble: "",
    omegaMatter: "",
    omegaRadiation: "",
    omegaLambda: "",
    hubbleConstantFriedmann: "",
    scaleFactor: "",
    hubbleConstantCritical: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const G = 6.6743e-11; // m³ kg⁻¹ s⁻²
  const c = 2.99792458e8; // m/s
  const Mpc = 3.08568025e22; // Mpc in m

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 900;
    canvas.height = 400;
  }, []);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const toggleModeInputs = () => {
    // Handled by conditional rendering in JSX
  };

  const calculateCosmo = () => {
    const {
      distance,
      hubbleConstantHubble,
      omegaMatter,
      omegaRadiation,
      omegaLambda,
      hubbleConstantFriedmann,
      scaleFactor,
      hubbleConstantCritical,
    } = inputs;
    const steps = [];

    let d,
      H_0,
      Omega_m = parseFloat(omegaMatter),
      Omega_r = parseFloat(omegaRadiation),
      Omega_Lambda = parseFloat(omegaLambda),
      a = parseFloat(scaleFactor);

    if (unitSystem === "astronomical") {
      if (mode === "hubble-law") {
        d = parseFloat(distance) * Mpc;
        H_0 = (parseFloat(hubbleConstantHubble) * 1e3) / Mpc;
        steps.push("Converted distance (Mpc to m), Hubble constant (km/s/Mpc to s⁻¹).");
      } else if (mode === "friedmann-expansion") {
        H_0 = (parseFloat(hubbleConstantFriedmann) * 1e3) / Mpc;
        steps.push("Converted Hubble constant (km/s/Mpc to s⁻¹).");
      } else if (mode === "critical-density") {
        H_0 = (parseFloat(hubbleConstantCritical) * 1e3) / Mpc;
        steps.push("Converted Hubble constant (km/s/Mpc to s⁻¹).");
      }
    } else {
      d = parseFloat(distance);
      H_0 =
        mode === "hubble-law"
          ? parseFloat(hubbleConstantHubble)
          : mode === "friedmann-expansion"
          ? parseFloat(hubbleConstantFriedmann)
          : parseFloat(hubbleConstantCritical);
    }

    let result = { mode, unitSystem };

    if (mode === "hubble-law") {
      if (isNaN(d) || d < 0 || isNaN(H_0) || H_0 <= 0) {
        setResults(<p className="text-red-500">Non-negative distance and positive H₀ required.</p>);
        return;
      }
      const v = H_0 * d;
      const z = v / c;
      steps.push(`Recessional velocity: v = H₀ d = ${v.toFixed(2)} m/s`);
      steps.push(`Redshift (low z): z ≈ v/c = ${z.toFixed(2)}`);
      result = { ...result, d, H_0, v, z };
    } else if (mode === "friedmann-expansion") {
      if (
        isNaN(Omega_m) ||
        Omega_m < 0 ||
        isNaN(Omega_r) ||
        Omega_r < 0 ||
        isNaN(Omega_Lambda) ||
        Omega_Lambda < 0 ||
        isNaN(H_0) ||
        H_0 <= 0 ||
        isNaN(a) ||
        a <= 0
      ) {
        setResults(
          <p className="text-red-500">Non-negative Ωₘ, Ωᵣ, Ωₓ, positive H₀, and positive a required.</p>
        );
        return;
      }
      const Omega_k = 1 - Omega_m - Omega_r - Omega_Lambda;
      const H =
        H_0 *
        Math.sqrt(
          Omega_r * Math.pow(a, -4) + Omega_m * Math.pow(a, -3) + Omega_Lambda + Omega_k * Math.pow(a, -2)
        );
      const adot = a * H;
      steps.push(`Friedmann: H(a) = H₀ √(Ωᵣ a⁻⁴ + Ωₘ a⁻³ + Ωₓ + Ωₖ a⁻²)`);
      steps.push(`Ωₖ = ${Omega_k.toFixed(2)}`);
      steps.push(`H(a) = ${H.toFixed(2)} s⁻¹`);
      steps.push(`Expansion rate: ȧ = ${adot.toFixed(2)} m/s`);
      result = { ...result, Omega_m, Omega_r, Omega_Lambda, Omega_k, H_0, a, H, adot };
    } else if (mode === "critical-density") {
      if (isNaN(H_0) || H_0 <= 0) {
        setResults(<p className="text-red-500">Positive H₀ required.</p>);
        return;
      }
      const rho_c = (3 * H_0 * H_0) / (8 * Math.PI * G);
      steps.push(`Critical density: ρ_c = ${rho_c.toFixed(2)} kg/m³`);
      result = { ...result, H_0, rho_c };
    }

    if (unitSystem === "astronomical") {
      if (mode === "hubble-law") {
        result.d /= Mpc;
        result.H_0 = (H_0 * Mpc) / 1e3;
        result.v /= 1e3;
        steps.push("Converted outputs: distance (m to Mpc), H₀ (s⁻¹ to km/s/Mpc), velocity (m/s to km/s).");
      } else if (mode === "friedmann-expansion") {
        result.H_0 = (H_0 * Mpc) / 1e3;
        result.H = (H * Mpc) / 1e3;
        result.adot /= Mpc;
        steps.push("Converted outputs: H₀, H (s⁻¹ to km/s/Mpc), ȧ (m/s to Mpc/s).");
      } else if (mode === "critical-density") {
        result.H_0 = (H_0 * Mpc) / 1e3;
        steps.push("Converted outputs: H₀ (s⁻¹ to km/s/Mpc).");
      }
    }

    setResults(
      <div>
        {mode === "hubble-law" && (
          <>
            <p>
              Distance: {result.d.toFixed(2)} {unitSystem === "si" ? "m" : "Mpc"}
            </p>
            <p>
              Hubble Constant (H₀): {result.H_0.toFixed(2)} {unitSystem === "si" ? "s⁻¹" : "km/s/Mpc"}
            </p>
            <p>
              Recessional Velocity: {result.v.toFixed(2)} {unitSystem === "si" ? "m/s" : "km/s"}
            </p>
            <p>Redshift (z): {result.z.toFixed(2)}</p>
          </>
        )}
        {mode === "friedmann-expansion" && (
          <>
            <p>Matter Density Parameter (Ωₘ): {result.Omega_m.toFixed(2)}</p>
            <p>Radiation Density Parameter (Ωᵣ): {result.Omega_r.toFixed(2)}</p>
            <p>Dark Energy Parameter (Ωₓ): {result.Omega_Lambda.toFixed(2)}</p>
            <p>Curvature Parameter (Ωₖ): {result.Omega_k.toFixed(2)}</p>
            <p>
              Hubble Constant (H₀): {result.H_0.toFixed(2)} {unitSystem === "si" ? "s⁻¹" : "km/s/Mpc"}
            </p>
            <p>Scale Factor (a): {result.a.toFixed(2)}</p>
            <p>
              Hubble Parameter (H): {result.H.toFixed(2)} {unitSystem === "si" ? "s⁻¹" : "km/s/Mpc"}
            </p>
            <p>
              Expansion Rate (ȧ): {result.adot.toFixed(2)} {unitSystem === "si" ? "m/s" : "Mpc/s"}
            </p>
          </>
        )}
        {mode === "critical-density" && (
          <>
            <p>
              Hubble Constant (H₀): {result.H_0.toFixed(2)} {unitSystem === "si" ? "s⁻¹" : "km/s/Mpc"}
            </p>
            <p>Critical Density (ρ_c): {result.rho_c.toFixed(2)} kg/m³</p>
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

  const importFromAstrophysics = () => {
    alert("Import from Astrophysics Calculator not implemented.");
  };

  const plotGraph = (result) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#000000";
    ctx.fillText(`${result.mode} Visualization`, 10, 20);

    const cx = canvasRef.current.width / 2;
    const cy = canvasRef.current.height / 2;
    const plotWidth = canvasRef.current.width - 100;
    const plotHeight = canvasRef.current.height - 100;

    if (result.mode === "hubble-law") {
      const maxD = result.d * 2;
      const maxV = result.v * 2;
      ctx.beginPath();
      ctx.moveTo(cx - plotWidth / 2, cy + plotHeight / 2);
      ctx.lineTo(cx + plotWidth / 2, cy + plotHeight / 2 - (maxV / maxV) * plotHeight);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      const px = cx - plotWidth / 2 + (result.d / maxD) * plotWidth;
      const py = cy + plotHeight / 2 - (result.v / maxV) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(`d=${result.d.toFixed(2)} ${result.unitSystem === "si" ? "m" : "Mpc"}`, px + 10, py - 20);
      ctx.fillText(`v=${result.v.toFixed(2)} ${result.unitSystem === "si" ? "m/s" : "km/s"}`, px + 10, py);
      ctx.fillText(`z=${result.z.toFixed(2)}`, px + 10, py + 20);
      ctx.fillText(
        `d (${result.unitSystem === "si" ? "m" : "Mpc"})`,
        cx + plotWidth / 2,
        cy + plotHeight / 2 + 20
      );
      ctx.fillText(
        `v (${result.unitSystem === "si" ? "m/s" : "km/s"})`,
        cx - plotWidth / 2 - 20,
        cy - plotHeight / 2
      );
    } else if (result.mode === "friedmann-expansion") {
      const points = 100;
      const maxA = result.a * 2;
      const da = maxA / points;
      const maxH = result.H * 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const a = i * da;
        const H =
          result.H_0 *
          Math.sqrt(
            result.Omega_r * Math.pow(a, -4) +
              result.Omega_m * Math.pow(a, -3) +
              result.Omega_Lambda +
              result.Omega_k * Math.pow(a, -2)
          );
        const px = cx - plotWidth / 2 + (a / maxA) * plotWidth;
        const py = cy + plotHeight / 2 - (H / maxH) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      const px = cx - plotWidth / 2 + (result.a / maxA) * plotWidth;
      const py = cy + plotHeight / 2 - (result.H / maxH) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(`a=${result.a.toFixed(2)}`, px + 10, py - 20);
      ctx.fillText(
        `H=${result.H.toFixed(2)} ${result.unitSystem === "si" ? "s⁻¹" : "km/s/Mpc"}`,
        px + 10,
        py
      );
      ctx.fillText(
        `ȧ=${result.adot.toFixed(2)} ${result.unitSystem === "si" ? "m/s" : "Mpc/s"}`,
        px + 10,
        py + 20
      );
      ctx.fillText("a", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText(
        `H (${result.unitSystem === "si" ? "s⁻¹" : "km/s/Mpc"})`,
        cx - plotWidth / 2 - 20,
        cy - plotHeight / 2
      );
    } else if (result.mode === "critical-density") {
      const maxRho = result.rho_c * 2;
      const barWidth = plotWidth / 2;
      const barHeight = ((result.rho_c / maxRho) * plotHeight) / 2;
      ctx.beginPath();
      ctx.rect(cx - barWidth / 2, cy + plotHeight / 2 - barHeight, barWidth, barHeight);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#000000";
      ctx.fillText(`ρ_c=${result.rho_c.toFixed(2)} kg/m³`, cx + barWidth / 2 + 10, cy);
      ctx.fillText(
        `H₀=${result.H_0.toFixed(2)} ${result.unitSystem === "si" ? "s⁻¹" : "km/s/Mpc"}`,
        cx + barWidth / 2 + 10,
        cy - 20
      );
      ctx.fillText("Critical Density", cx, cy + plotHeight / 2 + 20);
    }
  };

  const clearInputs = () => {
    setInputs({
      distance: "",
      hubbleConstantHubble: "",
      omegaMatter: "",
      omegaRadiation: "",
      omegaLambda: "",
      hubbleConstantFriedmann: "",
      scaleFactor: "",
      hubbleConstantCritical: "",
    });
    setResults(null);
    setHistory([]);
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const exportCSV = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const csv = [
      "Run,Mode,UnitSystem,Timestamp,Distance,H0,Velocity,Redshift,OmegaMatter,OmegaRadiation,OmegaLambda,OmegaCurvature,ScaleFactor,H,Adot,CriticalDensity",
      ...history.map(
        (run, idx) =>
          `${idx + 1},${run.mode},${run.unitSystem},${run.timestamp},${run.d ? run.d.toFixed(2) : ""},${
            run.H_0 ? run.H_0.toFixed(2) : ""
          },${run.v ? run.v.toFixed(2) : ""},${run.z ? run.z.toFixed(2) : ""},${
            run.Omega_m ? run.Omega_m.toFixed(2) : ""
          },${run.Omega_r ? run.Omega_r.toFixed(2) : ""},${
            run.Omega_Lambda ? run.Omega_Lambda.toFixed(2) : ""
          },${run.Omega_k ? run.Omega_k.toFixed(2) : ""},${run.a ? run.a.toFixed(2) : ""},${
            run.H ? run.H.toFixed(2) : ""
          },${run.adot ? run.adot.toFixed(2) : ""},${run.rho_c ? run.rho_c.toFixed(2) : ""}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cosmology_data.csv";
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
    a.download = "cosmology_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateCosmo();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Cosmology Calculator</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Calculation Mode:</label>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                toggleModeInputs();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Calculation mode"
            >
              <option value="hubble-law">Hubble’s Law</option>
              <option value="friedmann-expansion">Friedmann Expansion</option>
              <option value="critical-density">Critical Density</option>
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
              <option value="si">SI (m, s, kg)</option>
              <option value="astronomical">Astronomical (Mpc, km/s, kg)</option>
            </select>
          </div>
        </div>
        {mode === "hubble-law" && (
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Hubble’s Law Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Distance (Mpc):</label>
                <input
                  type="text"
                  name="distance"
                  value={inputs.distance}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Distance to galaxy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hubble Constant (km/s/Mpc):</label>
                <input
                  type="text"
                  name="hubbleConstantHubble"
                  value={inputs.hubbleConstantHubble}
                  onChange={handleInputChange}
                  placeholder="e.g., 70"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Hubble constant"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "friedmann-expansion" && (
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Friedmann Expansion Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Matter Density Parameter (Ωₘ):
                </label>
                <input
                  type="text"
                  name="omegaMatter"
                  value={inputs.omegaMatter}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.3"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Matter density parameter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Radiation Density Parameter (Ωᵣ):
                </label>
                <input
                  type="text"
                  name="omegaRadiation"
                  value={inputs.omegaRadiation}
                  onChange={handleInputChange}
                  placeholder="e.g., 8.4e-5"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Radiation density parameter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dark Energy Parameter (Ωₓ):</label>
                <input
                  type="text"
                  name="omegaLambda"
                  value={inputs.omegaLambda}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.7"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Dark energy parameter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hubble Constant (km/s/Mpc):</label>
                <input
                  type="text"
                  name="hubbleConstantFriedmann"
                  value={inputs.hubbleConstantFriedmann}
                  onChange={handleInputChange}
                  placeholder="e.g., 70"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Hubble constant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Scale Factor (a, 1 today):</label>
                <input
                  type="text"
                  name="scaleFactor"
                  value={inputs.scaleFactor}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Scale factor"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "critical-density" && (
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Critical Density Inputs</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hubble Constant (km/s/Mpc):</label>
                <input
                  type="text"
                  name="hubbleConstantCritical"
                  value={inputs.hubbleConstantCritical}
                  onChange={handleInputChange}
                  placeholder="e.g., 70"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Hubble constant"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateCosmo}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={importFromAstrophysics}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Import Velocities
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
                {run.mode === "hubble-law" && (
                  <>
                    <p>
                      Distance: {run.d.toFixed(2)} {run.unitSystem === "si" ? "m" : "Mpc"}
                    </p>
                    <p>
                      Hubble Constant (H₀): {run.H_0.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "s⁻¹" : "km/s/Mpc"}
                    </p>
                    <p>
                      Recessional Velocity: {run.v.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "km/s"}
                    </p>
                    <p>Redshift (z): {run.z.toFixed(2)}</p>
                  </>
                )}
                {run.mode === "friedmann-expansion" && (
                  <>
                    <p>Matter Density Parameter (Ωₘ): {run.Omega_m.toFixed(2)}</p>
                    <p>Radiation Density Parameter (Ωᵣ): {run.Omega_r.toFixed(2)}</p>
                    <p>Dark Energy Parameter (Ωₓ): {run.Omega_Lambda.toFixed(2)}</p>
                    <p>Curvature Parameter (Ωₖ): {run.Omega_k.toFixed(2)}</p>
                    <p>
                      Hubble Constant (H₀): {run.H_0.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "s⁻¹" : "km/s/Mpc"}
                    </p>
                    <p>Scale Factor (a): {run.a.toFixed(2)}</p>
                    <p>
                      Hubble Parameter (H): {run.H.toFixed(2)} {run.unitSystem === "si" ? "s⁻¹" : "km/s/Mpc"}
                    </p>
                    <p>
                      Expansion Rate (ȧ): {run.adot.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "Mpc/s"}
                    </p>
                  </>
                )}
                {run.mode === "critical-density" && (
                  <>
                    <p>
                      Hubble Constant (H₀): {run.H_0.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "s⁻¹" : "km/s/Mpc"}
                    </p>
                    <p>Critical Density (ρ_c): {run.rho_c.toFixed(2)} kg/m³</p>
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

export default CosmologyCalculator;
