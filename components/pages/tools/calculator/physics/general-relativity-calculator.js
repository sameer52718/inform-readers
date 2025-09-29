"use client";

import React, { useState, useRef, useEffect } from "react";

const GeneralRelativityCalculator = () => {
  const [mode, setMode] = useState("geodesics");
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    blackHoleMassGeodesics: "",
    initialRadius: "",
    initialVelocity: "",
    blackHoleMass: "",
    mass1: "",
    mass2: "",
    orbitalSeparation: "",
    distance: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const G = 6.6743e-11; // Gravitational constant in m³ kg⁻¹ s⁻²
  const c = 2.99792458e8; // Speed of light in m/s
  const M_sun = 1.98847e30; // Solar mass in kg
  const Mpc = 3.085677581e22; // Megaparsec in m

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 400;
    }
    toggleModeInputs();
  }, [mode]);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const toggleModeInputs = () => {
    // Handled via CSS display in JSX
  };

  const calculateGR = () => {
    const {
      blackHoleMassGeodesics,
      initialRadius,
      initialVelocity,
      blackHoleMass,
      mass1,
      mass2,
      orbitalSeparation,
      distance,
    } = inputs;
    const steps = [];

    let M,
      r_0 = parseFloat(initialRadius),
      v_0 = parseFloat(initialVelocity),
      M_1 = parseFloat(mass1),
      M_2 = parseFloat(mass2),
      a = parseFloat(orbitalSeparation),
      d = parseFloat(distance);

    // Unit conversions
    if (unitSystem === "astronomical") {
      if (mode === "geodesics") {
        M = parseFloat(blackHoleMassGeodesics) * M_sun; // Solar masses to kg
        steps.push("Converted black hole mass (M☉ to kg).");
      } else if (mode === "black-hole") {
        M = parseFloat(blackHoleMass) * M_sun; // Solar masses to kg
        steps.push("Converted black hole mass (M☉ to kg).");
      } else if (mode === "gravitational-waves") {
        M_1 *= M_sun; // Solar masses to kg
        M_2 *= M_sun; // Solar masses to kg
        d *= Mpc; // Mpc to m
        steps.push("Converted masses (M☉ to kg), distance (Mpc to m).");
      }
    } else {
      M = mode === "geodesics" ? parseFloat(blackHoleMassGeodesics) : parseFloat(blackHoleMass);
      M_1 = parseFloat(mass1);
      M_2 = parseFloat(mass2);
      a = parseFloat(orbitalSeparation);
      d = parseFloat(distance);
    }

    let result = { mode, unitSystem };

    if (mode === "geodesics") {
      if (isNaN(M) || M <= 0 || isNaN(r_0) || r_0 <= 0 || isNaN(v_0)) {
        setResults(<p className="text-red-500">Positive M, r₀, and valid v₀ required.</p>);
        return;
      }
      const r_s = (2 * G * M) / (c * c);
      if (r_0 <= r_s) {
        setResults(<p className="text-red-500">Initial radius must be greater than Schwarzschild radius.</p>);
        return;
      }
      const L = r_0 * v_0; // Angular momentum per unit mass
      const E = 0.5 * v_0 * v_0 * (1 - r_s / r_0) + (G * M) / r_0; // Energy per unit mass (approximate)
      const period = 2 * Math.PI * Math.sqrt((r_0 * r_0 * r_0) / (G * M)); // Keplerian period (approximation)
      steps.push(
        `Schwarzschild radius: r_s = 2GM/c² = 2 × ${G.toFixed(2)} × ${M.toFixed(2)} / ${c.toFixed(
          2
        )}² = ${r_s.toFixed(2)} m`
      );
      steps.push(
        `Angular momentum: L = r₀ v₀ = ${r_0.toFixed(2)} × ${v_0.toFixed(2)} = ${L.toFixed(2)} m²/s`
      );
      steps.push(
        `Approximate orbital period: T = 2π √(r₀³ / GM) = 2π √(${r_0.toFixed(2)}³ / (${G.toFixed(
          2
        )} × ${M.toFixed(2)})) = ${period.toFixed(2)} s`
      );
      result.M = M;
      result.r_0 = r_0;
      result.v_0 = v_0;
      result.r_s = r_s;
      result.L = L;
      result.period = period;
    } else if (mode === "black-hole") {
      if (isNaN(M) || M <= 0) {
        setResults(<p className="text-red-500">Positive M required.</p>);
        return;
      }
      const r_s = (2 * G * M) / (c * c);
      const r_photon = (3 * G * M) / (c * c);
      steps.push(
        `Schwarzschild radius: r_s = 2GM/c² = 2 × ${G.toFixed(2)} × ${M.toFixed(2)} / ${c.toFixed(
          2
        )}² = ${r_s.toFixed(2)} m`
      );
      steps.push(
        `Photon sphere radius: r_photon = 3GM/c² = 3 × ${G.toFixed(2)} × ${M.toFixed(2)} / ${c.toFixed(
          2
        )}² = ${r_photon.toFixed(2)} m`
      );
      result.M = M;
      result.r_s = r_s;
      result.r_photon = r_photon;
    } else if (mode === "gravitational-waves") {
      if (isNaN(M_1) || M_1 <= 0 || isNaN(M_2) || M_2 <= 0 || isNaN(a) || a <= 0 || isNaN(d) || d <= 0) {
        setResults(<p className="text-red-500">Positive M₁, M₂, a, and d required.</p>);
        return;
      }
      const M_c = Math.pow(M_1 * M_2, 3 / 5) / Math.pow(M_1 + M_2, 1 / 5);
      const f = Math.sqrt(G * (M_1 + M_2)) / (Math.PI * Math.pow(a, 1.5));
      const h = (4 * Math.pow(G * M_c, 5 / 3) * Math.pow(Math.PI * f, 2 / 3)) / (Math.pow(c, 4) * d);
      steps.push(
        `Chirp mass: M_c = (M₁ M₂)³/⁵ / (M₁ + M₂)¹/⁵ = (${M_1.toFixed(2)} × ${M_2.toFixed(
          2
        )})³/⁵ / (${M_1.toFixed(2)} + ${M_2.toFixed(2)})¹/⁵ = ${M_c.toFixed(2)} kg`
      );
      steps.push(
        `Orbital frequency: f ≈ √(G (M₁ + M₂)) / (π a³/²) = √(${G.toFixed(2)} × (${M_1.toFixed(
          2
        )} + ${M_2.toFixed(2)})) / (π × ${a.toFixed(2)}³/²) = ${f.toFixed(2)} Hz`
      );
      steps.push(
        `Strain amplitude: h ≈ 4 (G M_c)⁵/³ (π f)²/³ / (c⁴ d) = 4 × (${G.toFixed(2)} × ${M_c.toFixed(
          2
        )})⁵/³ × (π × ${f.toFixed(2)})²/³ / (${c.toFixed(2)}⁴ × ${d.toFixed(2)}) = ${h.toFixed(2)}`
      );
      result.M_1 = M_1;
      result.M_2 = M_2;
      result.a = a;
      result.d = d;
      result.M_c = M_c;
      result.f = f;
      result.h = h;
    }

    // Convert outputs back to astronomical units for display if applicable
    if (unitSystem === "astronomical") {
      if (mode === "geodesics") {
        result.M /= M_sun; // kg to M☉
        steps.push("Converted outputs to astronomical units: mass (kg to M☉).");
      } else if (mode === "black-hole") {
        result.M /= M_sun; // kg to M☉
        steps.push("Converted outputs to astronomical units: mass (kg to M☉).");
      } else if (mode === "gravitational-waves") {
        result.M_1 /= M_sun; // kg to M☉
        result.M_2 /= M_sun; // kg to M☉
        result.d /= Mpc; // m to Mpc
        steps.push("Converted outputs to astronomical units: masses (kg to M☉), distance (m to Mpc).");
      }
    }

    // Display results
    let resultContent;
    if (mode === "geodesics") {
      resultContent = (
        <div>
          <p>
            Black Hole Mass (M): {result.M.toFixed(2)} {unitSystem === "si" ? "kg" : "M☉"}
          </p>
          <p>Initial Radial Distance (r₀): {result.r_0.toFixed(2)} m</p>
          <p>Initial Velocity (v₀): {result.v_0.toFixed(2)} m/s</p>
          <p>Schwarzschild Radius (r_s): {result.r_s.toFixed(2)} m</p>
          <p>Angular Momentum (L): {result.L.toFixed(2)} m²/s</p>
          <p>Approximate Orbital Period (T): {result.period.toFixed(2)} s</p>
        </div>
      );
    } else if (mode === "black-hole") {
      resultContent = (
        <div>
          <p>
            Black Hole Mass (M): {result.M.toFixed(2)} {unitSystem === "si" ? "kg" : "M☉"}
          </p>
          <p>Schwarzschild Radius (r_s): {result.r_s.toFixed(2)} m</p>
          <p>Photon Sphere Radius (r_photon): {result.r_photon.toFixed(2)} m</p>
        </div>
      );
    } else if (mode === "gravitational-waves") {
      resultContent = (
        <div>
          <p>
            Mass 1 (M₁): {result.M_1.toFixed(2)} {unitSystem === "si" ? "kg" : "M☉"}
          </p>
          <p>
            Mass 2 (M₂): {result.M_2.toFixed(2)} {unitSystem === "si" ? "kg" : "M☉"}
          </p>
          <p>Orbital Separation (a): {result.a.toFixed(2)} m</p>
          <p>
            Distance to Observer (d): {result.d.toFixed(2)} {unitSystem === "si" ? "m" : "Mpc"}
          </p>
          <p>
            Chirp Mass (M_c): {result.M_c.toFixed(2)} {unitSystem === "si" ? "kg" : "M☉"}
          </p>
          <p>Orbital Frequency (f): {result.f.toFixed(2)} Hz</p>
          <p>Strain Amplitude (h): {result.h.toFixed(2)}</p>
        </div>
      );
    }
    setResults(
      <div>
        {resultContent}
        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
        {steps.map((step, idx) => (
          <p key={idx} className="text-sm text-gray-700 mb-2">
            {step}
          </p>
        ))}
      </div>
    );

    // Add to history
    result.timestamp = new Date().toISOString();
    setHistory([...history, result]);

    // Plot graph
    plotGraph(result);
  };

  const importFromAstrophysics = () => {
    alert("Import from Astrophysics Calculator not implemented. Please enter parameters manually.");
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
    const plotWidth = canvas.width - 100;
    const plotHeight = canvas.height - 100;

    if (result.mode === "geodesics") {
      // Plot effective potential V_eff(r) vs r
      const points = 100;
      const maxR = result.r_0 * 2;
      const dr = maxR / points;
      const r_s = result.r_s;
      const L = result.L;
      let maxV = -Infinity,
        minV = Infinity;
      const V_eff = [];
      for (let i = 0; i <= points; i++) {
        const r = i * dr;
        if (r <= r_s) continue;
        const V = (1 - r_s / r) * (1 + (L * L) / (r * r * c * c)) - (G * result.M) / r;
        V_eff.push({ r, V });
        if (V > maxV) maxV = V;
        if (V < minV) minV = V;
      }
      const rangeV = maxV - minV;
      ctx.beginPath();
      V_eff.forEach(({ r, V }, i) => {
        if (r <= r_s) return;
        const px = cx - plotWidth / 2 + (r / maxR) * plotWidth;
        const py = cy + plotHeight / 2 - ((V - minV) / rangeV) * plotHeight;
        if (i === 0 || V_eff[i - 1].r <= r_s) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mark r_0
      const px = cx - plotWidth / 2 + (result.r_0 / maxR) * plotWidth;
      const V_0 =
        (1 - r_s / result.r_0) * (1 + (L * L) / (result.r_0 * result.r_0 * c * c)) -
        (G * result.M) / result.r_0;
      const py = cy + plotHeight / 2 - ((V_0 - minV) / rangeV) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(`r₀=${result.r_0.toFixed(2)} m`, px + 10, py - 20);
      ctx.fillText("r (m)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText("V_eff", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    } else if (result.mode === "black-hole") {
      // Plot radial diagram of event horizon and photon sphere
      const maxR = result.r_photon * 2;
      const scale = plotWidth / (2 * maxR);
      ctx.beginPath();
      ctx.arc(cx, cy, result.r_s * scale, 0, 2 * Math.PI);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, result.r_photon * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#000000";
      ctx.fillText(`Event Horizon: r_s=${result.r_s.toFixed(2)} m`, cx + 10, cy - 20);
      ctx.fillText(`Photon Sphere: r_photon=${result.r_photon.toFixed(2)} m`, cx + 10, cy);
    } else if (result.mode === "gravitational-waves") {
      // Plot h(t) vs t (sinusoidal approximation)
      const points = 100;
      const maxT = 1 / result.f;
      const dt = maxT / points;
      const maxH = result.h * 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const t = i * dt;
        const h_t = result.h * Math.sin(2 * Math.PI * result.f * t);
        const px = cx - plotWidth / 2 + (t / maxT) * plotWidth;
        const py = cy + plotHeight / 2 - (h_t / maxH) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mark t=0
      const px = cx - plotWidth / 2;
      const py = cy + plotHeight / 2;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(`t=0`, px + 10, py - 20);
      ctx.fillText(`h=${result.h.toFixed(2)}`, px + 10, py);
      ctx.fillText("t (s)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText("h", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    }
  };

  const clearInputs = () => {
    setInputs({
      blackHoleMassGeodesics: "",
      initialRadius: "",
      initialVelocity: "",
      blackHoleMass: "",
      mass1: "",
      mass2: "",
      orbitalSeparation: "",
      distance: "",
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
      "Run,Mode,UnitSystem,Timestamp,M,r_0,v_0,r_s,L,period,r_photon,M_1,M_2,a,d,M_c,f,h",
      ...history.map(
        (run, index) => `
        ${index + 1},${run.mode},${run.unitSystem},${run.timestamp},
        ${run.M ? run.M.toFixed(2) : ""},${run.r_0 ? run.r_0.toFixed(2) : ""},${
          run.v_0 ? run.v_0.toFixed(2) : ""
        },
        ${run.r_s ? run.r_s.toFixed(2) : ""},${run.L ? run.L.toFixed(2) : ""},${
          run.period ? run.period.toFixed(2) : ""
        },
        ${run.r_photon ? run.r_photon.toFixed(2) : ""},${run.M_1 ? run.M_1.toFixed(2) : ""},${
          run.M_2 ? run.M_2.toFixed(2) : ""
        },
        ${run.a ? run.a.toFixed(2) : ""},${run.d ? run.d.toFixed(2) : ""},${
          run.M_c ? run.M_c.toFixed(2) : ""
        },
        ${run.f ? run.f.toFixed(2) : ""},${run.h ? run.h.toFixed(2) : ""}
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "general_relativity_data.csv";
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
    a.download = "general_relativity_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateGR();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className=" bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-5xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">General Relativity Calculator</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
              Calculation Mode:
            </label>
            <select
              id="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Calculation mode"
            >
              <option value="geodesics">Geodesics</option>
              <option value="black-hole">Black Hole Properties</option>
              <option value="gravitational-waves">Gravitational Waves</option>
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
              <option value="si">SI (kg, m, s, J)</option>
              <option value="astronomical">Astronomical (M☉, m, s, J)</option>
            </select>
          </div>
        </div>
        <div className={`p-4 bg-gray-200 rounded-lg mb-4 ${mode !== "geodesics" ? "hidden" : ""}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Geodesics Inputs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="black-hole-mass-geodesics" className="block text-sm font-medium text-gray-700">
                Black Hole Mass (M☉):
              </label>
              <input
                type="text"
                id="black-hole-mass-geodesics"
                name="blackHoleMassGeodesics"
                value={inputs.blackHoleMassGeodesics}
                onChange={handleInputChange}
                placeholder="e.g., 10"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Black hole mass"
              />
            </div>
            <div>
              <label htmlFor="initial-radius" className="block text-sm font-medium text-gray-700">
                Initial Radial Distance (m):
              </label>
              <input
                type="text"
                id="initial-radius"
                name="initialRadius"
                value={inputs.initialRadius}
                onChange={handleInputChange}
                placeholder="e.g., 1e8"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Initial radial distance"
              />
            </div>
            <div>
              <label htmlFor="initial-velocity" className="block text-sm font-medium text-gray-700">
                Initial Velocity (m/s):
              </label>
              <input
                type="text"
                id="initial-velocity"
                name="initialVelocity"
                value={inputs.initialVelocity}
                onChange={handleInputChange}
                placeholder="e.g., 0"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Initial velocity"
              />
            </div>
          </div>
        </div>
        <div className={`p-4 bg-gray-200 rounded-lg mb-4 ${mode !== "black-hole" ? "hidden" : ""}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Black Hole Properties Inputs</h2>
          <div className="grid grid-cols-1">
            <div>
              <label htmlFor="black-hole-mass" className="block text-sm font-medium text-gray-700">
                Black Hole Mass (M☉):
              </label>
              <input
                type="text"
                id="black-hole-mass"
                name="blackHoleMass"
                value={inputs.blackHoleMass}
                onChange={handleInputChange}
                placeholder="e.g., 10"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Black hole mass"
              />
            </div>
          </div>
        </div>
        <div className={`p-4 bg-gray-200 rounded-lg mb-4 ${mode !== "gravitational-waves" ? "hidden" : ""}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Gravitational Waves Inputs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="mass1" className="block text-sm font-medium text-gray-700">
                Mass 1 (M☉):
              </label>
              <input
                type="text"
                id="mass1"
                name="mass1"
                value={inputs.mass1}
                onChange={handleInputChange}
                placeholder="e.g., 20"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Mass 1"
              />
            </div>
            <div>
              <label htmlFor="mass2" className="block text-sm font-medium text-gray-700">
                Mass 2 (M☉):
              </label>
              <input
                type="text"
                id="mass2"
                name="mass2"
                value={inputs.mass2}
                onChange={handleInputChange}
                placeholder="e.g., 20"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Mass 2"
              />
            </div>
            <div>
              <label htmlFor="orbital-separation" className="block text-sm font-medium text-gray-700">
                Orbital Separation (m):
              </label>
              <input
                type="text"
                id="orbital-separation"
                name="orbitalSeparation"
                value={inputs.orbitalSeparation}
                onChange={handleInputChange}
                placeholder="e.g., 1e9"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Orbital separation"
              />
            </div>
            <div>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                Distance to Observer (Mpc):
              </label>
              <input
                type="text"
                id="distance"
                name="distance"
                value={inputs.distance}
                onChange={handleInputChange}
                placeholder="e.g., 100"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Distance to observer"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateGR}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={importFromAstrophysics}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Import Orbital Data
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
                  Run {index + 1} ({run.mode}, {run.unitSystem}, {new Date(run.timestamp).toLocaleString()}):
                </p>
                {run.mode === "geodesics" && (
                  <>
                    <p>
                      Black Hole Mass (M): {run.M.toFixed(2)} {run.unitSystem === "si" ? "kg" : "M☉"}
                    </p>
                    <p>Initial Radial Distance (r₀): {run.r_0.toFixed(2)} m</p>
                    <p>Initial Velocity (v₀): {run.v_0.toFixed(2)} m/s</p>
                    <p>Schwarzschild Radius (r_s): {run.r_s.toFixed(2)} m</p>
                    <p>Angular Momentum (L): {run.L.toFixed(2)} m²/s</p>
                    <p>Approximate Orbital Period (T): {run.period.toFixed(2)} s</p>
                  </>
                )}
                {run.mode === "black-hole" && (
                  <>
                    <p>
                      Black Hole Mass (M): {run.M.toFixed(2)} {run.unitSystem === "si" ? "kg" : "M☉"}
                    </p>
                    <p>Schwarzschild Radius (r_s): {run.r_s.toFixed(2)} m</p>
                    <p>Photon Sphere Radius (r_photon): {run.r_photon.toFixed(2)} m</p>
                  </>
                )}
                {run.mode === "gravitational-waves" && (
                  <>
                    <p>
                      Mass 1 (M₁): {run.M_1.toFixed(2)} {run.unitSystem === "si" ? "kg" : "M☉"}
                    </p>
                    <p>
                      Mass 2 (M₂): {run.M_2.toFixed(2)} {run.unitSystem === "si" ? "kg" : "M☉"}
                    </p>
                    <p>Orbital Separation (a): {run.a.toFixed(2)} m</p>
                    <p>
                      Distance to Observer (d): {run.d.toFixed(2)} {run.unitSystem === "si" ? "m" : "Mpc"}
                    </p>
                    <p>
                      Chirp Mass (M_c): {run.M_c.toFixed(2)} {run.unitSystem === "si" ? "kg" : "M☉"}
                    </p>
                    <p>Orbital Frequency (f): {run.f.toFixed(2)} Hz</p>
                    <p>Strain Amplitude (h): {run.h.toFixed(2)}</p>
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

export default GeneralRelativityCalculator;
