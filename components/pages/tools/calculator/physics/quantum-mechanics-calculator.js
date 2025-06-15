"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [mode, setMode] = useState("energy");
  const [unitSystem, setUnitSystem] = useState("si");
  const [mass, setMass] = useState("");
  const [boxLength, setBoxLength] = useState("");
  const [quantumNumber, setQuantumNumber] = useState("");
  const [position, setPosition] = useState("");
  const [observable, setObservable] = useState("position");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const hbar = 1.0545718e-34; // Reduced Planck constant in J·s
  const u = 1.660539e-27; // Atomic mass unit in kg
  const angstrom = 1e-10; // Ångström in m
  const eV = 1.60217662e-19; // eV to J

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 400;
    }
  }, []);

  const calculateQM = () => {
    const m = parseFloat(mass);
    const L = parseFloat(boxLength);
    const n = parseInt(quantumNumber);
    const x = parseFloat(position);
    const steps = [];

    // Unit conversions for atomic units
    let m_val = m,
      L_val = L,
      x_val = x;
    if (unitSystem === "atomic") {
      m_val *= u; // u to kg
      L_val *= angstrom; // Å to m
      if (!isNaN(x_val)) x_val *= angstrom;
      steps.push("Converted inputs to SI: mass (u to kg), length (Å to m).");
    }

    if (
      isNaN(m_val) ||
      m_val <= 0 ||
      isNaN(L_val) ||
      L_val <= 0 ||
      isNaN(n) ||
      n < 1 ||
      !Number.isInteger(n)
    ) {
      setResults({ error: "Positive mass, box length, and integer quantum number (n ≥ 1) required." });
      return;
    }

    let result = { mode, m: m_val, L: L_val, n, unitSystem };

    // Calculate energy
    const En = (n * n * Math.PI * Math.PI * hbar * hbar) / (2 * m_val * L_val * L_val); // in J
    const En_eV = En / eV; // in eV
    steps.push(
      `Energy: E_n = (n² π² ℏ²)/(2 m L²) = (${n}² π² ${hbar.toFixed(2)}²)/(2 × ${m_val.toFixed(
        2
      )} × ${L_val.toFixed(2)}²)`
    );
    steps.push(`E_${n} = ${En.toFixed(2)} J = ${En_eV.toFixed(2)} eV`);
    result.En = En;
    result.En_eV = En_eV;

    if (mode === "wavefunction") {
      if (isNaN(x_val) || x_val < 0 || x_val > L_val) {
        setResults({ error: "Position must be between 0 and box length." });
        return;
      }
      const psi = Math.sqrt(2 / L_val) * Math.sin((n * Math.PI * x_val) / L_val);
      const probDensity = psi * psi;
      steps.push(`Wave function: ψ(x) = √(2/L) sin(n π x / L)`);
      steps.push(
        `At x = ${x_val.toFixed(2)} m: ψ(x) = √(2/${L_val.toFixed(2)}) sin(${n} π ${x_val.toFixed(
          2
        )}/${L_val.toFixed(2)})`
      );
      steps.push(`Probability density: |ψ(x)|² = ${psi.toFixed(2)}² = ${probDensity.toFixed(4)} m⁻¹`);
      result.x = x_val;
      result.psi = psi;
      result.probDensity = probDensity;
    } else if (mode === "expectation") {
      const xExp = L_val / 2; // Symmetry of wave function
      const pExp = 0; // Symmetry of momentum
      steps.push(`Expectation value for ${observable}:`);
      if (observable === "position") {
        steps.push(`⟨x⟩ = L/2 (symmetric wave function) = ${L_val.toFixed(2)}/2 = ${xExp.toFixed(2)} m`);
      } else {
        steps.push(`⟨p⟩ = 0 (symmetric wave function, no net momentum)`);
      }
      result.observable = observable;
      result.expectation = observable === "position" ? xExp : pExp;
    }

    // Convert outputs back to atomic units for display
    if (unitSystem === "atomic") {
      result.m /= u; // kg to u
      result.L /= angstrom; // m to Å
      if (result.x) result.x /= angstrom;
      if (result.expectation && observable === "position") result.expectation /= angstrom;
      if (result.probDensity) result.probDensity *= angstrom; // m⁻¹ to Å⁻¹
      steps.push("Converted outputs back to atomic units for display.");
    }

    result.steps = steps;
    result.timestamp = new Date().toISOString();
    setResults(result);
    setHistory([...history, result]);
    plotGraph(result);
  };

  const plotGraph = (result) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#1f2937";
    ctx.fillText(`${result.mode} Visualization`, 10, 20);

    const cx = 50;
    const cy = canvas.height - 50;
    const boxWidth = canvas.width - 100;
    const scaleX = boxWidth / result.L;
    const scaleY = 100; // Arbitrary for wave function amplitude

    if (result.mode === "energy") {
      for (let i = 1; i <= Math.min(result.n, 5); i++) {
        const En = (i * i * Math.PI * Math.PI * hbar * hbar) / (2 * result.m * result.L * result.L);
        const En_eV = En / eV;
        const y = cy - i * 50;
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.lineTo(cx + boxWidth, y);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#1f2937";
        ctx.fillText(`E_${i} = ${En_eV.toFixed(2)} eV`, cx + boxWidth + 10, y + 5);
      }
    } else if (result.mode === "wavefunction" || result.mode === "expectation") {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - 150);
      ctx.moveTo(cx + boxWidth, cy);
      ctx.lineTo(cx + boxWidth, cy - 150);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.stroke();

      const points = 100;
      const dx = result.L / points;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let i = 0; i <= points; i++) {
        const x = i * dx;
        const psi = Math.sqrt(2 / result.L) * Math.sin((result.n * Math.PI * x) / result.L);
        const value = result.mode === "wavefunction" && !result.observable ? psi : psi * psi;
        const y = cy - value * scaleY * (result.mode === "wavefunction" && !result.observable ? 1 : 100);
        ctx.lineTo(cx + x * scaleX, y);
      }
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (result.x) {
        const psi = Math.sqrt(2 / result.L) * Math.sin((result.n * Math.PI * result.x) / result.L);
        const value = result.mode === "wavefunction" && !result.observable ? psi : psi * psi;
        const px = cx + result.x * scaleX;
        const py = cy - value * scaleY * (result.mode === "wavefunction" && !result.observable ? 1 : 100);
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.fillStyle = "#1f2937";
        ctx.fillText(
          `x = ${result.x.toFixed(2)} ${result.unitSystem === "si" ? "m" : "Å"}`,
          px + 10,
          py - 10
        );
      }

      if (result.expectation && result.observable === "position") {
        const px = cx + result.expectation * scaleX;
        ctx.beginPath();
        ctx.moveTo(px, cy);
        ctx.lineTo(px, cy - 150);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#1f2937";
        ctx.fillText(
          `⟨x⟩ = ${result.expectation.toFixed(2)} ${result.unitSystem === "si" ? "m" : "Å"}`,
          px + 10,
          cy - 160
        );
      }

      ctx.fillStyle = "#1f2937";
      ctx.fillText(
        `n = ${result.n}, L = ${result.L.toFixed(2)} ${result.unitSystem === "si" ? "m" : "Å"}`,
        cx + 10,
        cy + 20
      );
    }
  };

  const importFromVectorResolver = () => {
    alert("Import from Vector Resolver not implemented. Please enter parameters manually.");
  };

  const clearInputs = () => {
    setMass("");
    setBoxLength("");
    setQuantumNumber("");
    setPosition("");
    setResults(null);
    setHistory([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const exportCSV = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const csv = [
      "Run,Mode,UnitSystem,Timestamp,Mass,BoxLength,QuantumNumber,Energy_eV,Position,WaveFunction,ProbDensity,Observable,Expectation",
      ...history.map((run, index) => {
        return `${index + 1},${run.mode},${run.unitSystem},${run.timestamp},${run.m.toFixed(
          2
        )},${run.L.toFixed(2)},${run.n},${run.En_eV.toFixed(2)},${run.x ? run.x.toFixed(2) : ""},${
          run.psi ? run.psi.toFixed(4) : ""
        },${run.probDensity ? run.probDensity.toFixed(4) : ""},${run.observable || ""},${
          run.expectation ? run.expectation.toFixed(2) : ""
        }`;
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quantum_mechanics_data.csv";
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
    a.download = "quantum_mechanics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculateQM();
      if (e.key === "c") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mass, boxLength, quantumNumber, position, observable, mode, unitSystem]);

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-5xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Quantum Mechanics Calculator
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
                Calculation Mode:
              </label>
              <select
                id="mode"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="energy">Energy Levels</option>
                <option value="wavefunction">Wave Function</option>
                <option value="expectation">Expectation Values</option>
              </select>
            </div>
            <div>
              <label htmlFor="unit-system" className="block text-sm font-medium text-gray-700 mb-1">
                Unit System:
              </label>
              <select
                id="unit-system"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
              >
                <option value="si">SI (kg, m)</option>
                <option value="atomic">Atomic (u, Å)</option>
              </select>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Common Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="mass" className="block text-sm font-medium text-gray-700 mb-1">
                  Particle Mass ({unitSystem === "si" ? "kg" : "u"}):
                </label>
                <input
                  type="text"
                  id="mass"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 9.109e-31"
                  value={mass}
                  onChange={(e) => setMass(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="box-length" className="block text-sm font-medium text-gray-700 mb-1">
                  Box Length ({unitSystem === "si" ? "m" : "Å"}):
                </label>
                <input
                  type="text"
                  id="box-length"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 1e-9"
                  value={boxLength}
                  onChange={(e) => setBoxLength(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="quantum-number" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantum Number (n):
                </label>
                <input
                  type="text"
                  id="quantum-number"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 1"
                  value={quantumNumber}
                  onChange={(e) => setQuantumNumber(e.target.value)}
                />
              </div>
            </div>
          </div>
          {mode === "wavefunction" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Wave Function Inputs</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position ({unitSystem === "si" ? "m" : "Å"}):
                  </label>
                  <input
                    type="text"
                    id="position"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 5e-10"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          {mode === "expectation" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Expectation Value Inputs</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="observable" className="block text-sm font-medium text-gray-700 mb-1">
                    Observable:
                  </label>
                  <select
                    id="observable"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    value={observable}
                    onChange={(e) => setObservable(e.target.value)}
                  >
                    <option value="position">Position (x)</option>
                    <option value="momentum">Momentum (p)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculateQM}
            >
              Calculate
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={importFromVectorResolver}
            >
              Import Angles
            </button>
            <button
              className="flex-1 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all focus:ring-2 focus:ring-gray-500"
              onClick={clearInputs}
            >
              Clear
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={exportCSV}
            >
              Export CSV
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={exportJSON}
            >
              Export JSON
            </button>
          </div>
          <canvas
            ref={canvasRef}
            className="w-full max-h-[400px] bg-white border border-gray-200 rounded-lg mb-4"
          />
          {results && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              {results.error ? (
                <p className="text-red-500">{results.error}</p>
              ) : (
                <>
                  <p>
                    Energy Level E_{results.n}: {results.En_eV.toFixed(2)} eV ({results.En.toFixed(2)} J)
                  </p>
                  <p>
                    Mass: {results.m.toFixed(2)} {results.unitSystem === "si" ? "kg" : "u"}
                  </p>
                  <p>
                    Box Length: {results.L.toFixed(2)} {results.unitSystem === "si" ? "m" : "Å"}
                  </p>
                  <p>Quantum Number: {results.n}</p>
                  {results.mode === "wavefunction" && (
                    <>
                      <p>
                        Position: {results.x.toFixed(2)} {results.unitSystem === "si" ? "m" : "Å"}
                      </p>
                      <p>
                        Wave Function ψ(x): {results.psi.toFixed(4)}{" "}
                        {results.unitSystem === "si" ? "m⁻¹/²" : "Å⁻¹/²"}
                      </p>
                      <p>
                        Probability Density |ψ(x)|²: {results.probDensity.toFixed(4)}{" "}
                        {results.unitSystem === "si" ? "m⁻¹" : "Å⁻¹"}
                      </p>
                    </>
                  )}
                  {results.mode === "expectation" && (
                    <p>
                      Expectation Value ⟨{results.observable === "position" ? "x" : "p"}⟩:{" "}
                      {results.expectation.toFixed(2)}{" "}
                      {results.observable === "position"
                        ? results.unitSystem === "si"
                          ? "m"
                          : "Å"
                        : "kg·m/s"}
                    </p>
                  )}
                  <h2 className="text-xl font-semibold text-red-500 mt-4 mb-2">Solution Steps</h2>
                  {results.steps.map((step, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {step}
                    </p>
                  ))}
                </>
              )}
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg max-h-52 overflow-y-auto">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Calculation History</h2>
            {history.map((run, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-lg mb-2 hover:bg-gray-200 transition-all">
                <p>
                  Run {index + 1} ({run.mode}, {run.unitSystem}, {run.timestamp}):
                </p>
                <p>
                  Mass: {run.m.toFixed(2)} {run.unitSystem === "si" ? "kg" : "u"}
                </p>
                <p>
                  Box Length: {run.L.toFixed(2)} {run.unitSystem === "si" ? "m" : "Å"}
                </p>
                <p>Quantum Number: {run.n}</p>
                <p>
                  Energy E_{run.n}: {run.En_eV.toFixed(2)} eV
                </p>
                {run.mode === "wavefunction" && (
                  <>
                    <p>
                      Position: {run.x.toFixed(2)} {run.unitSystem === "si" ? "m" : "Å"}
                    </p>
                    <p>
                      Wave Function ψ(x): {run.psi.toFixed(4)} {run.unitSystem === "si" ? "m⁻¹/²" : "Å⁻¹/²"}
                    </p>
                    <p>
                      Probability Density |ψ(x)|²: {run.probDensity.toFixed(4)}{" "}
                      {run.unitSystem === "si" ? "m⁻¹" : "Å⁻¹"}
                    </p>
                  </>
                )}
                {run.mode === "expectation" && (
                  <p>
                    Expectation Value ⟨{run.observable === "position" ? "x" : "p"}⟩:{" "}
                    {run.expectation.toFixed(2)}{" "}
                    {run.observable === "position" ? (run.unitSystem === "si" ? "m" : "Å") : "kg·m/s"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
