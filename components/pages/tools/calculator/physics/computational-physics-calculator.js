"use client";

import React, { useState, useRef, useEffect } from "react";

const ComputationalPhysicsCalculator = () => {
  const [mode, setMode] = useState("monte-carlo");
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    numSamples: "",
    frequency: "",
    mass_mc: "",
    lowerBound: "",
    upperBound: "",
    numIntervals: "",
    mass1: "",
    mass2: "",
    gridPoints: "",
    timeSteps: "",
    spatialStep: "",
    timeStep: "",
    mass_fd: "",
    potentialType: "free",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const hbar = 1.054571817e-34; // J·s
  const G = 6.6743e-11; // m³ kg⁻¹ s⁻²
  const eV_to_J = 1.60217662e-19; // eV to J
  const nm_to_m = 1e-9; // nm to m
  const fs_to_s = 1e-15; // fs to s

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

  const calculateCompPhysics = () => {
    const {
      numSamples,
      frequency,
      mass_mc,
      lowerBound,
      upperBound,
      numIntervals,
      mass1,
      mass2,
      gridPoints,
      timeSteps,
      spatialStep,
      timeStep,
      mass_fd,
      potentialType,
    } = inputs;
    const steps = [];

    let omega = parseFloat(frequency),
      m_mc = parseFloat(mass_mc),
      a = parseFloat(lowerBound),
      b = parseFloat(upperBound),
      M = parseFloat(mass1),
      m = parseFloat(mass2),
      dx = parseFloat(spatialStep),
      dt = parseFloat(timeStep),
      m_fd_val = parseFloat(mass_fd);
    if (unitSystem === "natural") {
      if (mode === "monte-carlo") {
        m_mc *= eV_to_J / ((nm_to_m * nm_to_m) / fs_to_s / fs_to_s);
        omega *= fs_to_s;
        steps.push("Converted mass (eV/c² to kg), frequency (fs⁻¹ to s⁻¹).");
      } else if (mode === "numerical-integration") {
        a *= nm_to_m;
        b *= nm_to_m;
        M *= eV_to_J / ((nm_to_m * nm_to_m) / fs_to_s / fs_to_s);
        m *= eV_to_J / ((nm_to_m * nm_to_m) / fs_to_s / fs_to_s);
        steps.push("Converted distances (nm to m), masses (eV/c² to kg).");
      } else if (mode === "finite-difference") {
        dx *= nm_to_m;
        dt *= fs_to_s;
        m_fd_val *= eV_to_J / ((nm_to_m * nm_to_m) / fs_to_s / fs_to_s);
        steps.push("Converted spatial step (nm to m), time step (fs to s), mass (eV/c² to kg).");
      }
    }

    let result = { mode, unitSystem };

    if (mode === "monte-carlo") {
      const N = parseInt(numSamples);
      if (isNaN(N) || N <= 0 || isNaN(omega) || omega <= 0 || isNaN(m_mc) || m_mc <= 0) {
        setResults(<p className="text-red-500">Positive N, ω, and m required.</p>);
        return;
      }
      const sigma = Math.sqrt(hbar / (m_mc * omega));
      let sum_x2 = 0,
        sum_x2_sq = 0;
      const samples = [];
      for (let i = 0; i < N; i++) {
        const x = sigma * Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
        const x2 = x * x;
        samples.push(x2);
        sum_x2 += x2;
        sum_x2_sq += x2 * x2;
      }
      const x2_avg = sum_x2 / N;
      const variance = (sum_x2_sq / N - x2_avg * x2_avg) / N;
      const std_err = Math.sqrt(variance);
      steps.push(`Sampled ${N} points with σ = √(ħ/(m ω)) = ${sigma.toFixed(2)} m`);
      steps.push(`Computed <x²> = ${x2_avg.toFixed(2)} m²`);
      steps.push(`Standard error: ${std_err.toFixed(2)} m²`);
      result = { ...result, N, omega, m: m_mc, x2_avg, std_err, samples };
    } else if (mode === "numerical-integration") {
      const n = parseInt(numIntervals);
      if (isNaN(a) || isNaN(b) || a >= b || isNaN(n) || n <= 0 || isNaN(M) || M <= 0 || isNaN(m) || m <= 0) {
        setResults(<p className="text-red-500">Valid a &lt; b, positive n, M, and m required.</p>);
        return;
      }
      const dr = (b - a) / n;
      let sum = 0;
      for (let i = 0; i <= n; i++) {
        const r = a + i * dr;
        const weight = i === 0 || i === n ? 0.5 : 1;
        sum += weight * (1 / r);
      }
      const V = -G * M * m * sum * dr;
      steps.push(`Trapezoidal rule: dr = ${dr.toFixed(2)} m`);
      steps.push(`Summed 1/r: ${sum.toFixed(2)} m⁻¹`);
      steps.push(`Potential: V = ${V.toFixed(2)} J`);
      result = { ...result, a, b, n, M, m, V };
    } else if (mode === "finite-difference") {
      const N_x = parseInt(gridPoints),
        N_t = parseInt(timeSteps);
      if (
        isNaN(N_x) ||
        N_x <= 0 ||
        isNaN(N_t) ||
        N_t <= 0 ||
        isNaN(dx) ||
        dx <= 0 ||
        isNaN(dt) ||
        dt <= 0 ||
        isNaN(m_fd_val) ||
        m_fd_val <= 0
      ) {
        setResults(<p className="text-red-500">Positive N_x, N_t, Δx, Δt, and m required.</p>);
        return;
      }
      const psi = new Array(N_x).fill(0).map(() => ({ re: 0, im: 0 }));
      const psi_new = new Array(N_x).fill(0).map(() => ({ re: 0, im: 0 }));
      const x = new Array(N_x).fill(0);
      const prob = new Array(N_x).fill(0);
      const x0 = (N_x * dx) / 4;
      const sigma = dx * 10;
      const k0 = (2 * Math.PI) / (dx * 10);
      for (let i = 0; i < N_x; i++) {
        x[i] = i * dx;
        const arg = (x[i] - x0) / sigma;
        psi[i].re = Math.exp((-arg * arg) / 2) * Math.cos(k0 * x[i]);
        psi[i].im = Math.exp((-arg * arg) / 2) * Math.sin(k0 * x[i]);
      }
      const c = (dt * hbar) / (2 * m_fd_val * dx * dx);
      for (let t = 0; t < N_t; t++) {
        for (let i = 1; i < N_x - 1; i++) {
          psi_new[i].re = psi[i].re + c * (psi[i + 1].im + psi[i - 1].im - 2 * psi[i].im);
          psi_new[i].im = psi[i].im - c * (psi[i + 1].re + psi[i - 1].re - 2 * psi[i].re);
        }
        for (let i = 0; i < N_x; i++) {
          psi[i].re = psi_new[i].re;
          psi[i].im = psi_new[i].im;
          prob[i] = psi[i].re * psi[i].re + psi[i].im * psi[i].im;
        }
      }
      steps.push(`Initialized Gaussian wavepacket with σ = ${sigma.toFixed(2)} m`);
      steps.push(`Evolved wavefunction over ${N_t} steps`);
      result = { ...result, N_x, N_t, dx, dt, potential: potentialType, m: m_fd_val, prob, x };
    }

    if (unitSystem === "natural") {
      if (mode === "monte-carlo") {
        result.m /= eV_to_J / ((nm_to_m * nm_to_m) / fs_to_s / fs_to_s);
        result.omega /= fs_to_s;
        result.x2_avg *= nm_to_m * nm_to_m;
        result.std_err *= nm_to_m * nm_to_m;
        steps.push("Converted outputs to natural units.");
      } else if (mode === "numerical-integration") {
        result.a /= nm_to_m;
        result.b /= nm_to_m;
        result.M /= eV_to_J / ((nm_to_m * nm_to_m) / fs_to_s / fs_to_s);
        result.m /= eV_to_J / ((nm_to_m * nm_to_m) / fs_to_s / fs_to_s);
        result.V /= eV_to_J;
        steps.push("Converted outputs to natural units.");
      } else if (mode === "finite-difference") {
        result.dx /= nm_to_m;
        result.dt /= fs_to_s;
        result.m /= eV_to_J / ((nm_to_m * nm_to_m) / fs_to_s / fs_to_s);
        result.x = result.x.map((xi) => xi / nm_to_m);
        steps.push("Converted outputs to natural units.");
      }
    }

    setResults(
      <div>
        {mode === "monte-carlo" && (
          <>
            <p>Number of Samples (N): {result.N}</p>
            <p>
              Frequency (ω): {result.omega.toFixed(2)} {unitSystem === "si" ? "s⁻¹" : "fs⁻¹"}
            </p>
            <p>
              Mass (m): {result.m.toFixed(2)} {unitSystem === "si" ? "kg" : "eV/c²"}
            </p>
            <p>
              Expectation Value (&lt;x²&gt;): {result.x2_avg.toFixed(2)} {unitSystem === "si" ? "m²" : "nm²"}
            </p>
            <p>
              Standard Error: {result.std_err.toFixed(2)} {unitSystem === "si" ? "m²" : "nm²"}
            </p>
          </>
        )}
        {mode === "numerical-integration" && (
          <>
            <p>
              Lower Bound (a): {result.a.toFixed(2)} {unitSystem === "si" ? "m" : "nm"}
            </p>
            <p>
              Upper Bound (b): {result.b.toFixed(2)} {unitSystem === "si" ? "m" : "nm"}
            </p>
            <p>Number of Intervals (n): {result.n}</p>
            <p>
              Mass 1 (M): {result.M.toFixed(2)} {unitSystem === "si" ? "kg" : "eV/c²"}
            </p>
            <p>
              Mass 2 (m): {result.m.toFixed(2)} {unitSystem === "si" ? "kg" : "eV/c²"}
            </p>
            <p>
              Potential Energy (V): {result.V.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
            </p>
          </>
        )}
        {mode === "finite-difference" && (
          <>
            <p>Grid Points (N_x): {result.N_x}</p>
            <p>Time Steps (N_t): {result.N_t}</p>
            <p>
              Spatial Step (Δx): {result.dx.toFixed(2)} {unitSystem === "si" ? "m" : "nm"}
            </p>
            <p>
              Time Step (Δt): {result.dt.toFixed(2)} {unitSystem === "si" ? "s" : "fs"}
            </p>
            <p>Potential Type: {result.potential}</p>
            <p>
              Mass (m): {result.m.toFixed(2)} {unitSystem === "si" ? "kg" : "eV/c²"}
            </p>
            <p>Wavefunction computed at final time</p>
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

    if (result.mode === "monte-carlo") {
      const bins = 20;
      const x2_max = Math.max(...result.samples);
      const binWidth = x2_max / bins;
      const counts = new Array(bins).fill(0);
      result.samples.forEach((x2) => {
        const bin = Math.min(Math.floor(x2 / binWidth), bins - 1);
        counts[bin]++;
      });
      const maxCount = Math.max(...counts);
      ctx.beginPath();
      for (let i = 0; i < bins; i++) {
        const x = cx - plotWidth / 2 + (i / bins) * plotWidth;
        const height = ((counts[i] / maxCount) * plotHeight) / 2;
        ctx.rect(x, cy + plotHeight / 2 - height, plotWidth / bins, height);
      }
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(
        `<x²>=${result.x2_avg.toFixed(2)} ${result.unitSystem === "si" ? "m²" : "nm²"}`,
        cx - plotWidth / 2 + 10,
        cy - plotHeight / 2
      );
      ctx.fillText(
        `x² (${result.unitSystem === "si" ? "m²" : "nm²"})`,
        cx + plotWidth / 2,
        cy + plotHeight / 2 + 20
      );
      ctx.fillText("Count", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    } else if (result.mode === "numerical-integration") {
      const points = 100;
      const dr = (result.b - result.a) / points;
      const maxV = (G * result.M * result.m) / result.a;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const r = result.a + i * dr;
        const V = (-G * result.M * result.m) / r;
        const px = cx - plotWidth / 2 + (i / points) * plotWidth;
        const py = cy + plotHeight / 2 - (V / maxV) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      const px_a = cx - plotWidth / 2;
      const py_a = cy + plotHeight / 2 - ((-G * result.M * result.m) / result.a / maxV) * plotHeight;
      ctx.beginPath();
      ctx.arc(px_a, py_a, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(
        `a=${result.a.toFixed(2)} ${result.unitSystem === "si" ? "m" : "nm"}`,
        px_a + 10,
        py_a - 20
      );
      ctx.fillText(`V=${result.V.toFixed(2)} ${result.unitSystem === "si" ? "J" : "eV"}`, px_a + 10, py_a);
      ctx.fillText(
        `r (${result.unitSystem === "si" ? "m" : "nm"})`,
        cx + plotWidth / 2,
        cy + plotHeight / 2 + 20
      );
      ctx.fillText(
        `V (${result.unitSystem === "si" ? "J" : "eV"})`,
        cx - plotWidth / 2 - 20,
        cy - plotHeight / 2
      );
    } else if (result.mode === "finite-difference") {
      const maxProb = Math.max(...result.prob);
      ctx.beginPath();
      for (let i = 0; i < result.N_x; i++) {
        const px = cx - plotWidth / 2 + (i / (result.N_x - 1)) * plotWidth;
        const py = cy + plotHeight / 2 - (result.prob[i] / maxProb) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#000000";
      ctx.fillText(
        `|ψ(x, t)|² at t=${(result.N_t * result.dt).toFixed(2)} ${result.unitSystem === "si" ? "s" : "fs"}`,
        cx - plotWidth / 2 + 10,
        cy - plotHeight / 2
      );
      ctx.fillText(
        `x (${result.unitSystem === "si" ? "m" : "nm"})`,
        cx + plotWidth / 2,
        cy + plotHeight / 2 + 20
      );
      ctx.fillText("|ψ|²", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    }
  };

  const clearInputs = () => {
    setInputs({
      numSamples: "",
      frequency: "",
      mass_mc: "",
      lowerBound: "",
      upperBound: "",
      numIntervals: "",
      mass1: "",
      mass2: "",
      gridPoints: "",
      timeSteps: "",
      spatialStep: "",
      timeStep: "",
      mass_fd: "",
      potentialType: "free",
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
      "Run,Mode,UnitSystem,Timestamp,N,omega,m_mc,x2_avg,std_err,a,b,n,M,m,V,N_x,N_t,dx,dt,potential,m_fd",
      ...history.map(
        (run, idx) =>
          `${idx + 1},${run.mode},${run.unitSystem},${run.timestamp},${run.N || ""},${
            run.omega ? run.omega.toFixed(2) : ""
          },${run.m && run.mode === "monte-carlo" ? run.m.toFixed(2) : ""},${
            run.x2_avg ? run.x2_avg.toFixed(2) : ""
          },${run.std_err ? run.std_err.toFixed(2) : ""},${run.a ? run.a.toFixed(2) : ""},${
            run.b ? run.b.toFixed(2) : ""
          },${run.n || ""},${run.M ? run.M.toFixed(2) : ""},${
            run.m && run.mode === "numerical-integration" ? run.m.toFixed(2) : ""
          },${run.V ? run.V.toFixed(2) : ""},${run.N_x || ""},${run.N_t || ""},${
            run.dx ? run.dx.toFixed(2) : ""
          },${run.dt ? run.dt.toFixed(2) : ""},${run.potential || ""},${
            run.m && run.mode === "finite-difference" ? run.m.toFixed(2) : ""
          }`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "comp_physics_data.csv";
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
    a.download = "comp_physics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateCompPhysics();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Computational Physics Calculator
        </h1>
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
              <option value="monte-carlo">Monte Carlo Integration</option>
              <option value="numerical-integration">Numerical Integration</option>
              <option value="finite-difference">Finite Difference Method</option>
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
              <option value="si">SI (kg, m, s, J)</option>
              <option value="natural">Natural (eV, nm, fs, ℏ=1)</option>
            </select>
          </div>
        </div>
        {mode === "monte-carlo" && (
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Monte Carlo Integration Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Samples:</label>
                <input
                  type="text"
                  name="numSamples"
                  value={inputs.numSamples}
                  onChange={handleInputChange}
                  placeholder="e.g., 10000"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Number of samples"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency (s⁻¹):</label>
                <input
                  type="text"
                  name="frequency"
                  value={inputs.frequency}
                  onChange={handleInputChange}
                  placeholder="e.g., 1e15"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Frequency"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mass (kg):</label>
                <input
                  type="text"
                  name="mass_mc"
                  value={inputs.mass_mc}
                  onChange={handleInputChange}
                  placeholder="e.g., 9.11e-31"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Mass"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "numerical-integration" && (
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Numerical Integration Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Lower Bound (m):</label>
                <input
                  type="text"
                  name="lowerBound"
                  value={inputs.lowerBound}
                  onChange={handleInputChange}
                  placeholder="e.g., 1e-10"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Lower bound"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Upper Bound (m):</label>
                <input
                  type="text"
                  name="upperBound"
                  value={inputs.upperBound}
                  onChange={handleInputChange}
                  placeholder="e.g., 2e-10"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Upper bound"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Intervals:</label>
                <input
                  type="text"
                  name="numIntervals"
                  value={inputs.numIntervals}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Number of intervals"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mass 1 (kg):</label>
                <input
                  type="text"
                  name="mass1"
                  value={inputs.mass1}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.989e30"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Mass 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mass 2 (kg):</label>
                <input
                  type="text"
                  name="mass2"
                  value={inputs.mass2}
                  onChange={handleInputChange}
                  placeholder="e.g., 5.972e24"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Mass 2"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "finite-difference" && (
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Finite Difference Method Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Grid Points:</label>
                <input
                  type="text"
                  name="gridPoints"
                  value={inputs.gridPoints}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Grid points"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Steps:</label>
                <input
                  type="text"
                  name="timeSteps"
                  value={inputs.timeSteps}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Time steps"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Spatial Step (m):</label>
                <input
                  type="text"
                  name="spatialStep"
                  value={inputs.spatialStep}
                  onChange={handleInputChange}
                  placeholder="e.g., 1e-10"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Spatial step"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Step (s):</label>
                <input
                  type="text"
                  name="timeStep"
                  value={inputs.timeStep}
                  onChange={handleInputChange}
                  placeholder="e.g., 1e-18"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Time step"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Potential Type:</label>
                <select
                  name="potentialType"
                  value={inputs.potentialType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Potential type"
                >
                  <option value="free">Free</option>
                  <option value="harmonic">Harmonic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mass (kg):</label>
                <input
                  type="text"
                  name="mass_fd"
                  value={inputs.mass_fd}
                  onChange={handleInputChange}
                  placeholder="e.g., 9.11e-31"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Mass"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateCompPhysics}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={importFromQuantumMechanics}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Import Wavefunction
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
                {run.mode === "monte-carlo" && (
                  <>
                    <p>Number of Samples (N): {run.N}</p>
                    <p>
                      Frequency (ω): {run.omega.toFixed(2)} {run.unitSystem === "si" ? "s⁻¹" : "fs⁻¹"}
                    </p>
                    <p>
                      Mass: {run.m.toFixed(2)} {run.unitSystem === "si" ? "kg" : "eV/c²"}
                    </p>
                    <p>
                      Expectation Value (&lt;x²{x}&gt;): {run.x2_avg.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "m²" : "nm²"}
                    </p>
                    <p>
                      Standard Error: {run.std_err.toFixed(2)} {run.unitSystem === "si" ? "m²" : "nm²"}
                    </p>
                  </>
                )}
                {run.mode === "numerical-integration" && (
                  <>
                    <p>
                      Lower Bound (a): {run.a.toFixed(2)} {run.unitSystem === "si" ? "m" : "nm"}
                    </p>
                    <p>
                      Upper Bound (b): {run.b.toFixed(2)} {run.unitSystem === "si" ? "m" : "nm"}.
                    </p>
                    <p>Number of Intervals: (n): {run.n}</p>
                    <p>
                      Mass 1 (M): {run.M.toFixed(2)} {run.unitSystem === "si" ? "kg" : "eV/c²"}
                    </p>
                    <p>
                      Mass 2 (m): {run.m.toFixed(2)} {run.unitSystem === "si" ? "kg" : "eV/c²"}
                    </p>
                    <p>
                      Potential Energy: (V): {run.V.toFixed(2)} {run.unitSystem === "si" ? "J" : "eV"}.
                    </p>
                  </>
                )}
                {run.mode === "finite-difference" && (
                  <>
                    <p>Grid Points (N_x): {run.N_x}</p>
                    <p>Time Steps: N_t): {run.N_t}</p>
                    <p>
                      Spatial Step: (Δx): {run.dx.toFixed(2)} {run.unitSystem === "si" ? "m" : "nm"}.
                    </p>
                    <p>
                      Time Step: (Δt): {run.dt.toFixed(2)} {run.unitSystem === "si" ? "s" : "fs"}.
                    </p>
                    <p>Potential Type: {run.potential}</p>
                    <p>
                      Mass: (m): {run.m.toFixed(2)} {run.unitSystem === "si" ? "kg" : "eV/c²"}.
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

export default ComputationalPhysicsCalculator;
