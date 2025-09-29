"use client";

import React, { useState, useEffect, useRef } from "react";

const PlasmaPhysicsCalculator = () => {
  const [mode, setMode] = useState("plasma-frequency");
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    electronDensityFreq: "",
    electronMass: "",
    electronCharge: "",
    electronTemperature: "",
    electronDensityDebye: "",
    ionCharge: "",
    plasmaTemperature: "",
    electronDensityConf: "",
    magneticField: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const epsilon_0 = 8.854187817e-12; // F/m
  const k_B = 1.380649e-23; // J/K
  const m_e = 9.1093837e-31; // kg
  const e = 1.60217662e-19; // C
  const mu_0 = 4 * Math.PI * 1e-7; // H/m
  const eV = 1.60217662e-19; // J
  const cm3_to_m3 = 1e6; // cm⁻³ to m⁻³

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && canvas.getContext("2d")) {
      canvas.width = Math.min(900, window.innerWidth - 40);
      canvas.height = 400;
      ctxRef.current = canvas.getContext("2d");
      ctxRef.current.font = "12px Inter";
      ctxRef.current.fillStyle = "#1f2937";
    }

    const resizeCanvas = () => {
      canvas.width = Math.min(900, window.innerWidth - 40);
      canvas.height = 400;
      ctxRef.current.font = "12px Inter";
      ctxRef.current.fillStyle = "#1f2937";
      plotGraph(history[history.length - 1]);
    };
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculatePlasma = () => {
    try {
      const electronDensityFreq = parseFloat(inputs.electronDensityFreq);
      const electronMass = parseFloat(inputs.electronMass) || m_e;
      const electronCharge = parseFloat(inputs.electronCharge) || e;
      const electronTemperature = parseFloat(inputs.electronTemperature);
      const electronDensityDebye = parseFloat(inputs.electronDensityDebye);
      const ionCharge = parseFloat(inputs.ionCharge);
      const plasmaTemperature = parseFloat(inputs.plasmaTemperature);
      const electronDensityConf = parseFloat(inputs.electronDensityConf);
      const magneticField = parseFloat(inputs.magneticField);
      const steps = [];

      let n_e_freq = electronDensityFreq,
        n_e_debye = electronDensityDebye,
        n_e_conf = electronDensityConf;
      let T_e = electronTemperature,
        T = plasmaTemperature;
      let m_e_val = electronMass,
        e_val = electronCharge,
        Z = ionCharge,
        B = magneticField;
      if (unitSystem === "plasma") {
        if (mode === "plasma-frequency") {
          n_e_freq *= cm3_to_m3;
          steps.push("Converted electron density (cm⁻³ to m⁻³).");
        } else if (mode === "debye-length") {
          n_e_debye *= cm3_to_m3;
          T_e *= eV / k_B;
          steps.push("Converted electron density (cm⁻³ to m⁻³), temperature (eV to K).");
        } else if (mode === "magnetic-confinement") {
          n_e_conf *= cm3_to_m3;
          T *= eV / k_B;
          steps.push("Converted electron density (cm⁻³ to m⁻³), temperature (eV to K).");
        }
      }

      let result = { mode, unitSystem };

      if (mode === "plasma-frequency") {
        if (
          isNaN(n_e_freq) ||
          n_e_freq <= 0 ||
          isNaN(m_e_val) ||
          m_e_val <= 0 ||
          isNaN(e_val) ||
          e_val <= 0
        ) {
          setResults(<p className="text-red-500">Positive n_e, m_e, and e required.</p>);
          return;
        }
        const omega_p = Math.sqrt((n_e_freq * e_val * e_val) / (m_e_val * epsilon_0));
        const T_p = (2 * Math.PI) / omega_p;
        steps.push(
          `Plasma frequency: ω_p = √(n_e e² / (m_e ε_0)) = √(${n_e_freq.toFixed(2)} × ${e_val.toFixed(
            2
          )}² / (${m_e_val.toFixed(2)} × ${epsilon_0.toFixed(2)})) = ${omega_p.toFixed(2)} rad/s`
        );
        steps.push(`Period: T_p = 2π / ω_p = 2π / ${omega_p.toFixed(2)} = ${T_p.toFixed(2)} s`);
        result = { ...result, n_e: n_e_freq, m_e: m_e_val, e: e_val, omega_p, T_p };
        if (unitSystem === "plasma") {
          result.n_e /= cm3_to_m3;
          steps.push("Converted outputs to plasma units: electron density (m⁻³ to cm⁻³).");
        }
        setResults(
          <div>
            <p>
              Electron Density (n_e): {result.n_e.toFixed(2)} {unitSystem === "si" ? "m⁻³" : "cm⁻³"}
            </p>
            <p>Electron Mass (m_e): {result.m_e.toFixed(2)} kg</p>
            <p>Electron Charge (e): {result.e.toFixed(2)} C</p>
            <p>Plasma Frequency (ω_p): {result.omega_p.toFixed(2)} rad/s</p>
            <p>Period (T_p): {result.T_p.toFixed(2)} s</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
            {steps.map((step, idx) => (
              <p key={idx} className="text-sm text-gray-700 mb-2">
                {step}
              </p>
            ))}
          </div>
        );
      } else if (mode === "debye-length") {
        if (isNaN(T_e) || T_e <= 0 || isNaN(n_e_debye) || n_e_debye <= 0 || isNaN(Z) || Z <= 0) {
          setResults(<p className="text-red-500">Positive T_e, n_e, and Z required.</p>);
          return;
        }
        const lambda_D = Math.sqrt((epsilon_0 * k_B * T_e) / (n_e_debye * e * e * Z));
        steps.push(
          `Debye length: λ_D = √(ε_0 k_B T_e / (n_e e² Z)) = √(${epsilon_0.toFixed(2)} × ${k_B.toFixed(
            2
          )} × ${T_e.toFixed(2)} / (${n_e_debye.toFixed(2)} × ${e.toFixed(2)}² × ${Z.toFixed(
            2
          )})) = ${lambda_D.toFixed(2)} m`
        );
        result = { ...result, T_e, n_e: n_e_debye, Z, lambda_D };
        if (unitSystem === "plasma") {
          result.n_e /= cm3_to_m3;
          result.T_e = (k_B * T_e) / eV;
          steps.push(
            "Converted outputs to plasma units: electron density (m⁻³ to cm⁻³), temperature (K to eV)."
          );
        }
        setResults(
          <div>
            <p>
              Electron Temperature (T_e): {result.T_e.toFixed(2)} {unitSystem === "si" ? "K" : "eV"}
            </p>
            <p>
              Electron Density (n_e): {result.n_e.toFixed(2)} {unitSystem === "si" ? "m⁻³" : "cm⁻³"}
            </p>
            <p>Ion Charge (Z): {result.Z.toFixed(2)}</p>
            <p>Debye Length (λ_D): {result.lambda_D.toFixed(2)} m</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
            {steps.map((step, idx) => (
              <p key={idx} className="text-sm text-gray-700 mb-2">
                {step}
              </p>
            ))}
          </div>
        );
      } else if (mode === "magnetic-confinement") {
        if (isNaN(T) || T <= 0 || isNaN(n_e_conf) || n_e_conf <= 0 || isNaN(B) || B <= 0) {
          setResults(<p className="text-red-500">Positive T, n_e, and B required.</p>);
          return;
        }
        const p = n_e_conf * k_B * T;
        const beta = (2 * mu_0 * p) / (B * B);
        steps.push(
          `Plasma pressure: p = n_e k_B T = ${n_e_conf.toFixed(2)} × ${k_B.toFixed(2)} × ${T.toFixed(
            2
          )} = ${p.toFixed(2)} Pa`
        );
        steps.push(
          `Beta: β = 2 μ_0 p / B² = 2 × ${mu_0.toFixed(2)} × ${p.toFixed(2)} / ${B.toFixed(
            2
          )}² = ${beta.toFixed(2)}`
        );
        result = { ...result, T, n_e: n_e_conf, B, p, beta };
        if (unitSystem === "plasma") {
          result.n_e /= cm3_to_m3;
          result.T = (k_B * T) / eV;
          steps.push(
            "Converted outputs to plasma units: electron density (m⁻³ to cm⁻³), temperature (K to eV)."
          );
        }
        setResults(
          <div>
            <p>
              Plasma Temperature (T): {result.T.toFixed(2)} {unitSystem === "si" ? "K" : "eV"}
            </p>
            <p>
              Electron Density (n_e): {result.n_e.toFixed(2)} {unitSystem === "si" ? "m⁻³" : "cm⁻³"}
            </p>
            <p>Magnetic Field (B): {result.B.toFixed(2)} T</p>
            <p>Plasma Pressure (p): {result.p.toFixed(2)} Pa</p>
            <p>Beta (β): {result.beta.toFixed(2)}</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
            {steps.map((step, idx) => (
              <p key={idx} className="text-sm text-gray-700 mb-2">
                {step}
              </p>
            ))}
          </div>
        );
      }

      result.timestamp = new Date().toISOString();
      setHistory([...history, result]);
      plotGraph(result);
    } catch (error) {
      setResults(<p className="text-red-500">Calculation failed. Check inputs and try again.</p>);
    }
  };

  const plotGraph = (result) => {
    const ctx = ctxRef.current;
    if (!ctx || !result) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillText(`${result.mode} Visualization`, 10, 20);

    const cx = canvasRef.current.width / 2;
    const cy = canvasRef.current.height / 2;
    const plotWidth = canvasRef.current.width - 100;
    const plotHeight = canvasRef.current.height - 100;

    if (result.mode === "plasma-frequency") {
      const points = 100;
      const maxT = result.T_p * 2;
      const dt = maxT / points;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const t = i * dt;
        const y = Math.sin(result.omega_p * t);
        const px = cx - plotWidth / 2 + (t / maxT) * plotWidth;
        const py = cy + plotHeight / 2 - (y / 2) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx - plotWidth / 2;
      const py = cy + plotHeight / 2;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`t=0`, px + 10, py - 20);
      ctx.fillText(`ω_p=${result.omega_p.toFixed(2)} rad/s`, px + 10, py);
      ctx.fillText("t (s)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText("sin(ω_p t)", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    } else if (result.mode === "debye-length") {
      const maxR = result.lambda_D * 2;
      const scale = plotWidth / (2 * maxR);
      ctx.beginPath();
      ctx.arc(cx, cy, result.lambda_D * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`λ_D=${result.lambda_D.toFixed(2)} m`, cx + 10, cy);
      ctx.fillText("r (m)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
    } else if (result.mode === "magnetic-confinement") {
      const points = 100;
      const maxB = result.B * 2;
      const dB = maxB / points;
      const maxBeta = (2 * mu_0 * result.p) / (result.B * result.B * 0.25);
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const B = i * dB;
        const beta = (2 * mu_0 * result.p) / (B * B || 1e-10);
        const px = cx - plotWidth / 2 + (B / maxB) * plotWidth;
        const py = cy + plotHeight / 2 - Math.min(beta / maxBeta, 1) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx - plotWidth / 2 + (result.B / maxB) * plotWidth;
      const py = cy + plotHeight / 2 - Math.min(result.beta / maxBeta, 1) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`B=${result.B.toFixed(2)} T`, px + 10, py - 20);
      ctx.fillText(`β=${result.beta.toFixed(2)}`, px + 10, py);
      ctx.fillText("B (T)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText("β", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    }
  };

  const clearInputs = () => {
    setInputs({
      electronDensityFreq: "",
      electronMass: "",
      electronCharge: "",
      electronTemperature: "",
      electronDensityDebye: "",
      ionCharge: "",
      plasmaTemperature: "",
      electronDensityConf: "",
      magneticField: "",
    });
    setResults(null);
    setHistory([]);
    if (ctxRef.current) ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const importFromElectromagnetism = () => {
    alert("Import from Electromagnetism Calculator not implemented. Please enter parameters manually.");
  };

  const exportCSV = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const csv = [
      "Run,Mode,UnitSystem,Timestamp,n_e,m_e,e,omega_p,T_p,T_e,Z,lambda_D,T,B,p,beta",
      ...history.map(
        (run, index) => `
        ${index + 1},${run.mode},${run.unitSystem},${run.timestamp},
        ${run.n_e ? run.n_e.toFixed(2) : ""},${run.m_e ? run.m_e.toFixed(2) : ""},${
          run.e ? run.e.toFixed(2) : ""
        },
        ${run.omega_p ? run.omega_p.toFixed(2) : ""},${run.T_p ? run.T_p.toFixed(2) : ""},
        ${run.T_e ? run.T_e.toFixed(2) : ""},${run.Z ? run.Z.toFixed(2) : ""},${
          run.lambda_D ? run.lambda_D.toFixed(2) : ""
        },
        ${run.T ? run.T.toFixed(2) : ""},${run.B ? run.B.toFixed(2) : ""},${run.p ? run.p.toFixed(2) : ""},
        ${run.beta ? run.beta.toFixed(2) : ""}
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plasma_physics_data.csv";
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
    a.download = "plasma_physics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculatePlasma();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className=" bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-5xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Plasma Physics Calculator</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-2">
              Calculation Mode:
            </label>
            <select
              id="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Calculation mode"
            >
              <option value="plasma-frequency">Plasma Frequency</option>
              <option value="debye-length">Debye Length</option>
              <option value="magnetic-confinement">Magnetic Confinement</option>
            </select>
          </div>
          <div>
            <label htmlFor="unit-system" className="block text-sm font-medium text-gray-700 mb-2">
              Unit System:
            </label>
            <select
              id="unit-system"
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Unit system"
            >
              <option value="si">SI (kg, m, s, J, T, C)</option>
              <option value="plasma">Plasma (eV, cm⁻³, T)</option>
            </select>
          </div>
        </div>
        {mode === "plasma-frequency" && (
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Plasma Frequency Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="electron-density-freq"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Electron Density ({unitSystem === "si" ? "m⁻³" : "cm⁻³"}):
                </label>
                <input
                  type="text"
                  id="electron-density-freq"
                  name="electronDensityFreq"
                  value={inputs.electronDensityFreq}
                  onChange={handleInputChange}
                  placeholder="e.g., 1e18"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Electron density"
                />
              </div>
              <div>
                <label htmlFor="electron-mass" className="block text-sm font-medium text-gray-700 mb-2">
                  Electron Mass (kg):
                </label>
                <input
                  type="text"
                  id="electron-mass"
                  name="electronMass"
                  value={inputs.electronMass}
                  onChange={handleInputChange}
                  placeholder="e.g., 9.11e-31"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Electron mass"
                />
              </div>
              <div>
                <label htmlFor="electron-charge" className="block text-sm font-medium text-gray-700 mb-2">
                  Electron Charge (C):
                </label>
                <input
                  type="text"
                  id="electron-charge"
                  name="electronCharge"
                  value={inputs.electronCharge}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.60e-19"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Electron charge"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "debye-length" && (
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Debye Length Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="electron-temperature"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Electron Temperature ({unitSystem === "si" ? "K" : "eV"}):
                </label>
                <input
                  type="text"
                  id="electron-temperature"
                  name="electronTemperature"
                  value={inputs.electronTemperature}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Electron temperature"
                />
              </div>
              <div>
                <label
                  htmlFor="electron-density-debye"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Electron Density ({unitSystem === "si" ? "m⁻³" : "cm⁻³"}):
                </label>
                <input
                  type="text"
                  id="electron-density-debye"
                  name="electronDensityDebye"
                  value={inputs.electronDensityDebye}
                  onChange={handleInputChange}
                  placeholder="e.g., 1e18"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Electron density"
                />
              </div>
              <div>
                <label htmlFor="ion-charge" className="block text-sm font-medium text-gray-700 mb-2">
                  Ion Charge (Z):
                </label>
                <input
                  type="text"
                  id="ion-charge"
                  name="ionCharge"
                  value={inputs.ionCharge}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Ion charge"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "magnetic-confinement" && (
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Magnetic Confinement Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="plasma-temperature" className="block text-sm font-medium text-gray-700 mb-2">
                  Plasma Temperature ({unitSystem === "si" ? "K" : "eV"}):
                </label>
                <input
                  type="text"
                  id="plasma-temperature"
                  name="plasmaTemperature"
                  value={inputs.plasmaTemperature}
                  onChange={handleInputChange}
                  placeholder="e.g., 1e4"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Plasma temperature"
                />
              </div>
              <div>
                <label
                  htmlFor="electron-density-conf"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Electron Density ({unitSystem === "si" ? "m⁻³" : "cm⁻³"}):
                </label>
                <input
                  type="text"
                  id="electron-density-conf"
                  name="electronDensityConf"
                  value={inputs.electronDensityConf}
                  onChange={handleInputChange}
                  placeholder="e.g., 1e20"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Electron density"
                />
              </div>
              <div>
                <label htmlFor="magnetic-field" className="block text-sm font-medium text-gray-700 mb-2">
                  Magnetic Field (T):
                </label>
                <input
                  type="text"
                  id="magnetic-field"
                  name="magneticField"
                  value={inputs.magneticField}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Magnetic field"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculatePlasma}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={importFromElectromagnetism}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Import Field Data
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
        <canvas ref={canvasRef} className="w-full h-96 bg-gray-100 rounded-lg border border-gray-200 mb-4" />
        <div className="p-4 bg-gray-200 rounded-lg mb-4">{results}</div>
        <div className="p-4 bg-gray-200 rounded-lg max-h-52 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Calculation History</h2>
          <div>
            {history.map((run, index) => (
              <div key={index} className="p-2 mb-2 bg-white rounded-lg shadow-sm">
                <p>
                  Run {index + 1} ({run.mode}, {run.unitSystem}, {new Date(run.timestamp).toLocaleString()}):
                </p>
                {run.mode === "plasma-frequency" && (
                  <>
                    <p>
                      Electron Density (n_e): {run.n_e.toFixed(2)} {run.unitSystem === "si" ? "m⁻³" : "cm⁻³"}
                    </p>
                    <p>Electron Mass (m_e): {run.m_e.toFixed(2)} kg</p>
                    <p>Electron Charge (e): {run.e.toFixed(2)} C</p>
                    <p>Plasma Frequency (ω_p): {run.omega_p.toFixed(2)} rad/s</p>
                    <p>Period (T_p): {run.T_p.toFixed(2)} s</p>
                  </>
                )}
                {run.mode === "debye-length" && (
                  <>
                    <p>
                      Electron Temperature (T_e): {run.T_e.toFixed(2)} {run.unitSystem === "si" ? "K" : "eV"}
                    </p>
                    <p>
                      Electron Density (n_e): {run.n_e.toFixed(2)} {run.unitSystem === "si" ? "m⁻³" : "cm⁻³"}
                    </p>
                    <p>Ion Charge (Z): {run.Z.toFixed(2)}</p>
                    <p>Debye Length (λ_D): {run.lambda_D.toFixed(2)} m</p>
                  </>
                )}
                {run.mode === "magnetic-confinement" && (
                  <>
                    <p>
                      Plasma Temperature (T): {run.T.toFixed(2)} {run.unitSystem === "si" ? "K" : "eV"}
                    </p>
                    <p>
                      Electron Density (n_e): {run.n_e.toFixed(2)} {run.unitSystem === "si" ? "m⁻³" : "cm⁻³"}
                    </p>
                    <p>Magnetic Field (B): {run.B.toFixed(2)} T</p>
                    <p>Plasma Pressure (p): {run.p.toFixed(2)} Pa</p>
                    <p>Beta (β): {run.beta.toFixed(2)}</p>
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

export default PlasmaPhysicsCalculator;
