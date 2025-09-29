"use client";

import React, { useState, useRef, useEffect } from "react";

const CondensedMatterCalculator = () => {
  const [mode, setMode] = useState("band-structure");
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    latticeConstantBand: "",
    onsiteEnergy: "",
    hoppingParameter: "",
    latticeConstantPhonon: "",
    atomicMass: "",
    springConstant: "",
    densityOfStates: "",
    electronPhononCoupling: "",
    debyeTemperature: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const hbar = 6.582119569e-16; // eV·s
  const k_B = 8.617333262e-5; // eV/K
  const angstrom = 1e-10; // Å to m
  const amu = 1.6605390666e-27; // amu to kg
  const eV_to_J = 1.602176634e-19; // eV to J

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

  const calculateCondensed = () => {
    const {
      latticeConstantBand,
      onsiteEnergy,
      hoppingParameter,
      latticeConstantPhonon,
      atomicMass,
      springConstant,
      densityOfStates,
      electronPhononCoupling,
      debyeTemperature,
    } = inputs;
    const steps = [];

    let a,
      epsilon_0 = parseFloat(onsiteEnergy),
      t = parseFloat(hoppingParameter),
      M = parseFloat(atomicMass),
      k = parseFloat(springConstant),
      N_EF = parseFloat(densityOfStates),
      V = parseFloat(electronPhononCoupling),
      Theta_D = parseFloat(debyeTemperature);

    if (unitSystem === "condensed") {
      if (mode === "band-structure") {
        a = parseFloat(latticeConstantBand) * angstrom;
        steps.push("Converted lattice constant (Å to m).");
      } else if (mode === "phonon-dispersion") {
        a = parseFloat(latticeConstantPhonon) * angstrom;
        M *= amu;
        steps.push("Converted lattice constant (Å to m), atomic mass (amu to kg).");
      } else if (mode === "superconductivity") {
        // No conversion needed
      }
    } else {
      a = mode === "band-structure" ? parseFloat(latticeConstantBand) : parseFloat(latticeConstantPhonon);
      epsilon_0 *= eV_to_J;
      t *= eV_to_J;
      N_EF /= eV_to_J;
      V *= eV_to_J;
      steps.push("Converted energies (eV to J), density of states (states/eV to states/J).");
    }

    let result = { mode, unitSystem };

    if (mode === "band-structure") {
      if (isNaN(a) || a <= 0 || isNaN(epsilon_0) || isNaN(t)) {
        setResults(<p className="text-red-500">Positive lattice constant and valid energies required.</p>);
        return;
      }
      const bandwidth = 4 * Math.abs(t);
      steps.push(`Energy dispersion: E(k) = ε₀ + 2t cos(ka)`);
      steps.push(`Bandwidth: 4|t| = ${bandwidth.toFixed(2)} ${unitSystem === "si" ? "J" : "eV"}`);
      result = { ...result, a, epsilon_0, t, bandwidth };
    } else if (mode === "phonon-dispersion") {
      if (isNaN(a) || a <= 0 || isNaN(M) || M <= 0 || isNaN(k) || k <= 0) {
        setResults(<p className="text-red-500">Positive a, M, and k required.</p>);
        return;
      }
      const omega_max = 2 * Math.sqrt(k / M);
      steps.push(`Phonon dispersion: ω(k) = 2 √(k/M) |sin(ka/2)|`);
      steps.push(`Maximum frequency: ω_max = ${omega_max.toFixed(2)} rad/s`);
      result = { ...result, a, M, k, omega_max };
    } else if (mode === "superconductivity") {
      if (isNaN(N_EF) || N_EF <= 0 || isNaN(V) || V <= 0 || isNaN(Theta_D) || Theta_D <= 0) {
        setResults(<p className="text-red-500">Positive N(E_F), V, and Θ_D required.</p>);
        return;
      }
      const Tc = (1.14 * Theta_D) / Math.exp(1 / (N_EF * V));
      const Delta_0 = 1.76 * k_B * Tc;
      steps.push(`BCS T_c = ${Tc.toFixed(2)} K`);
      steps.push(`Energy gap Δ(0) = ${Delta_0.toFixed(2)} ${unitSystem === "si" ? "J" : "eV"}`);
      result = { ...result, N_EF, V, Theta_D, Tc, Delta_0 };
    }

    if (unitSystem === "condensed") {
      if (mode === "band-structure") {
        result.a /= angstrom;
        result.epsilon_0 /= eV_to_J;
        result.t /= eV_to_J;
        result.bandwidth /= eV_to_J;
        steps.push("Converted outputs to condensed units: lattice constant (m to Å), energies (J to eV).");
      } else if (mode === "phonon-dispersion") {
        result.a /= angstrom;
        result.M /= amu;
        steps.push("Converted outputs to condensed units: lattice constant (m to Å), mass (kg to amu).");
      } else if (mode === "superconductivity") {
        result.N_EF *= eV_to_J;
        result.V /= eV_to_J;
        result.Delta_0 /= eV_to_J;
        steps.push("Converted outputs to condensed units: density of states, coupling, gap (J to eV).");
      }
    }

    setResults(
      <div>
        {mode === "band-structure" && (
          <>
            <p>
              Lattice Constant (a): {result.a.toFixed(2)} {unitSystem === "si" ? "m" : "Å"}
            </p>
            <p>
              On-site Energy (ε₀): {result.epsilon_0.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
            </p>
            <p>
              Hopping Parameter (t): {result.t.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
            </p>
            <p>
              Bandwidth: {result.bandwidth.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
            </p>
          </>
        )}
        {mode === "phonon-dispersion" && (
          <>
            <p>
              Lattice Constant (a): {result.a.toFixed(2)} {unitSystem === "si" ? "m" : "Å"}
            </p>
            <p>
              Atomic Mass (M): {result.M.toFixed(2)} {unitSystem === "si" ? "kg" : "amu"}
            </p>
            <p>Spring Constant (k): {result.k.toFixed(2)} N/m</p>
            <p>Maximum Frequency (ω_max): {result.omega_max.toFixed(2)} rad/s</p>
          </>
        )}
        {mode === "superconductivity" && (
          <>
            <p>
              Density of States (N(E_F)): {result.N_EF.toFixed(2)}{" "}
              {unitSystem === "si" ? "states/J" : "states/eV"}
            </p>
            <p>
              Electron-Phonon Coupling (V): {result.V.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
            </p>
            <p>Debye Temperature (Θ_D): {result.Theta_D.toFixed(2)} K</p>
            <p>Critical Temperature (T_c): {result.Tc.toFixed(2)} K</p>
            <p>
              Energy Gap at T=0 (Δ(0)): {result.Delta_0.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
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

  const importFromQuantumMechanics = () => {
    alert("Import from Quantum Mechanics Calculator not implemented.");
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

    if (result.mode === "band-structure") {
      const points = 100;
      const maxK = Math.PI / result.a;
      const dk = (2 * maxK) / points;
      const maxE = result.epsilon_0 + 2 * Math.abs(result.t);
      const minE = result.epsilon_0 - 2 * Math.abs(result.t);
      const rangeE = maxE - minE;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const k = -maxK + i * dk;
        const E = result.epsilon_0 + 2 * result.t * Math.cos(k * result.a);
        const px = cx - plotWidth / 2 + (i / points) * plotWidth;
        const py = cy + plotHeight / 2 - ((E - minE) / rangeE) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      const px = cx;
      const py = cy + plotHeight / 2 - ((result.epsilon_0 - minE) / rangeE) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(`k=0`, px + 10, py - 20);
      ctx.fillText(
        `E=${result.epsilon_0.toFixed(2)} ${result.unitSystem === "si" ? "J" : "eV"}`,
        px + 10,
        py
      );
      ctx.fillText("k (1/m)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText(
        `E (${result.unitSystem === "si" ? "J" : "eV"})`,
        cx - plotWidth / 2 - 20,
        cy - plotHeight / 2
      );
    } else if (result.mode === "phonon-dispersion") {
      const points = 100;
      const maxK = Math.PI / result.a;
      const dk = (2 * maxK) / points;
      const maxOmega = result.omega_max;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const k = -maxK + i * dk;
        const omega = 2 * Math.sqrt(result.k / result.M) * Math.abs(Math.sin((k * result.a) / 2));
        const px = cx - plotWidth / 2 + (i / points) * plotWidth;
        const py = cy + plotHeight / 2 - (omega / maxOmega) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      const px = cx;
      const py = cy + plotHeight / 2;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(`k=0`, px + 10, py - 20);
      ctx.fillText(`ω=0 rad/s`, px + 10, py);
      ctx.fillText("k (1/m)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText("ω (rad/s)", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    } else if (result.mode === "superconductivity") {
      const points = 100;
      const maxT = result.Tc * 2;
      const dT = maxT / points;
      const maxDelta = result.Delta_0;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const T = i * dT;
        const Delta = T >= result.Tc ? 0 : result.Delta_0 * Math.sqrt(1 - Math.pow(T / result.Tc, 2));
        const px = cx - plotWidth / 2 + (T / maxT) * plotWidth;
        const py = cy + plotHeight / 2 - (Delta / maxDelta) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      const px = cx - plotWidth / 2 + (result.Tc / maxT) * plotWidth;
      const py = cy + plotHeight / 2;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(`T_c=${result.Tc.toFixed(2)} K`, px + 10, py - 20);
      ctx.fillText(`Δ=0 ${result.unitSystem === "si" ? "J" : "eV"}`, px + 10, py);
      ctx.fillText("T (K)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText(
        `Δ (${result.unitSystem === "si" ? "J" : "eV"})`,
        cx - plotWidth / 2 - 20,
        cy - plotHeight / 2
      );
    }
  };

  const clearInputs = () => {
    setInputs({
      latticeConstantBand: "",
      onsiteEnergy: "",
      hoppingParameter: "",
      latticeConstantPhonon: "",
      atomicMass: "",
      springConstant: "",
      densityOfStates: "",
      electronPhononCoupling: "",
      debyeTemperature: "",
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
      "Run,Mode,UnitSystem,Timestamp,a,epsilon_0,t,bandwidth,M,k,omega_max,N_EF,V,Theta_D,Tc,Delta_0",
      ...history.map(
        (run, idx) =>
          `${idx + 1},${run.mode},${run.unitSystem},${run.timestamp},${run.a ? run.a.toFixed(2) : ""},${
            run.epsilon_0 ? run.epsilon_0.toFixed(2) : ""
          },${run.t ? run.t.toFixed(2) : ""},${run.bandwidth ? run.bandwidth.toFixed(2) : ""},${
            run.M ? run.M.toFixed(2) : ""
          },${run.k ? run.k.toFixed(2) : ""},${run.omega_max ? run.omega_max.toFixed(2) : ""},${
            run.N_EF ? run.N_EF.toFixed(2) : ""
          },${run.V ? run.V.toFixed(2) : ""},${run.Theta_D ? run.Theta_D.toFixed(2) : ""},${
            run.Tc ? run.Tc.toFixed(2) : ""
          },${run.Delta_0 ? run.Delta_0.toFixed(2) : ""}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "condensed_matter_data.csv";
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
    a.download = "condensed_matter_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateCondensed();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className=" bg-gray-50 flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Condensed Matter Calculator</h1>
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
              <option value="band-structure">Band Structure</option>
              <option value="phonon-dispersion">Phonon Dispersion</option>
              <option value="superconductivity">Superconductivity</option>
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
              <option value="si">SI (m, kg, s, J)</option>
              <option value="condensed">Condensed Matter (Å, amu, eV, K)</option>
            </select>
          </div>
        </div>
        {mode === "band-structure" && (
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Band Structure Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Lattice Constant (Å):</label>
                <input
                  type="text"
                  name="latticeConstantBand"
                  value={inputs.latticeConstantBand}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.5"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Lattice constant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">On-site Energy (eV):</label>
                <input
                  type="text"
                  name="onsiteEnergy"
                  value={inputs.onsiteEnergy}
                  onChange={handleInputChange}
                  placeholder="e.g., 0"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="On-site energy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hopping Parameter (eV):</label>
                <input
                  type="text"
                  name="hoppingParameter"
                  value={inputs.hoppingParameter}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Hopping parameter"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "phonon-dispersion" && (
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Phonon Dispersion Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Lattice Constant (Å):</label>
                <input
                  type="text"
                  name="latticeConstantPhonon"
                  value={inputs.latticeConstantPhonon}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.5"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Lattice constant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Atomic Mass (amu):</label>
                <input
                  type="text"
                  name="atomicMass"
                  value={inputs.atomicMass}
                  onChange={handleInputChange}
                  placeholder="e.g., 12"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Atomic mass"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Spring Constant (N/m):</label>
                <input
                  type="text"
                  name="springConstant"
                  value={inputs.springConstant}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Spring constant"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "superconductivity" && (
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Superconductivity Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Density of States (states/eV):
                </label>
                <input
                  type="text"
                  name="densityOfStates"
                  value={inputs.densityOfStates}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.5"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Density of states"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Electron-Phonon Coupling (eV):
                </label>
                <input
                  type="text"
                  name="electronPhononCoupling"
                  value={inputs.electronPhononCoupling}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.2"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Electron-phonon coupling"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Debye Temperature (K):</label>
                <input
                  type="text"
                  name="debyeTemperature"
                  value={inputs.debyeTemperature}
                  onChange={handleInputChange}
                  placeholder="e.g., 400"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Debye temperature"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateCondensed}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={importFromQuantumMechanics}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Import Wavefunctions
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
                {run.mode === "band-structure" && (
                  <>
                    <p>
                      Lattice Constant (a): {run.a.toFixed(2)} {run.unitSystem === "si" ? "m" : "Å"}
                    </p>
                    <p>
                      On-site Energy (ε₀): {run.epsilon_0.toFixed(2)} {run.unitSystem === "si" ? "J" : "eV"}
                    </p>
                    <p>
                      Hopping Parameter (t): {run.t.toFixed(2)} {run.unitSystem === "si" ? "J" : "eV"}
                    </p>
                    <p>
                      Bandwidth: {run.bandwidth.toFixed(2)} {run.unitSystem === "si" ? "J" : "eV"}
                    </p>
                  </>
                )}
                {run.mode === "phonon-dispersion" && (
                  <>
                    <p>
                      Lattice Constant (a): {run.a.toFixed(2)} {run.unitSystem === "si" ? "m" : "Å"}
                    </p>
                    <p>
                      Atomic Mass (M): {run.M.toFixed(2)} {run.unitSystem === "si" ? "kg" : "amu"}
                    </p>
                    <p>Spring Constant (k): {run.k.toFixed(2)} N/m</p>
                    <p>Maximum Frequency (ω_max): {run.omega_max.toFixed(2)} rad/s</p>
                  </>
                )}
                {run.mode === "superconductivity" && (
                  <>
                    <p>
                      Density of States (N(E_F)): {run.N_EF.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "states/J" : "states/eV"}
                    </p>
                    <p>
                      Electron-Phonon Coupling (V): {run.V.toFixed(2)} {run.unitSystem === "si" ? "J" : "eV"}
                    </p>
                    <p>Debye Temperature (Θ_D): {run.Theta_D.toFixed(2)} K</p>
                    <p>Critical Temperature (T_c): {run.Tc.toFixed(2)} K</p>
                    <p>
                      Energy Gap at T=0 (Δ(0)): {run.Delta_0.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "J" : "eV"}
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

export default CondensedMatterCalculator;
