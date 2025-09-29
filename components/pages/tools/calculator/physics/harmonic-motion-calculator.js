"use client";

import React, { useState, useRef, useEffect } from "react";

const SimpleHarmonicMotionCalculator = () => {
  const [mode, setMode] = useState("spring");
  const [inputs, setInputs] = useState({
    amplitude: "",
    springConstant: "",
    length: "",
    mass: "",
    phase: "",
    time: "",
  });
  const [angleUnit, setAngleUnit] = useState("deg");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const g = 9.81; // Acceleration due to gravity (m/s^2)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 400;
    }
    updateInputs();
  }, [mode]);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const updateInputs = () => {
    // No need for DOM manipulation; React handles visibility via state
  };

  const calculateSHM = () => {
    const amplitude = parseFloat(inputs.amplitude);
    const springConstant = parseFloat(inputs.springConstant);
    const length = parseFloat(inputs.length);
    const mass = parseFloat(inputs.mass);
    const phase = parseFloat(inputs.phase);
    const time = parseFloat(inputs.time);
    const steps = [];

    // Input validation
    if (isNaN(amplitude) || amplitude < 0) {
      setResults(<p className="text-red-500">Amplitude must be non-negative.</p>);
      return;
    }
    if (isNaN(mass) || mass <= 0) {
      setResults(<p className="text-red-500">Mass must be positive.</p>);
      return;
    }
    if (mode === "spring" && (isNaN(springConstant) || springConstant <= 0)) {
      setResults(<p className="text-red-500">Spring constant must be positive.</p>);
      return;
    }
    if (mode === "pendulum" && (isNaN(length) || length <= 0)) {
      setResults(<p className="text-red-500">Pendulum length must be positive.</p>);
      return;
    }
    if (isNaN(phase)) {
      setResults(<p className="text-red-500">Phase angle is required.</p>);
      return;
    }
    if (isNaN(time) || time < 0) {
      setResults(<p className="text-red-500">Time must be non-negative.</p>);
      return;
    }

    // Convert phase to radians
    const phaseRad = angleUnit === "deg" ? (phase * Math.PI) / 180 : phase;

    // Calculate angular frequency
    let omega;
    if (mode === "spring") {
      omega = Math.sqrt(springConstant / mass);
      steps.push(`Angular frequency: ω = √(k/m) = √(${springConstant}/${mass}) = ${omega.toFixed(2)} rad/s`);
    } else {
      omega = Math.sqrt(g / length);
      steps.push(`Angular frequency: ω = √(g/L) = √(${g}/${length}) = ${omega.toFixed(2)} rad/s`);
    }

    // Calculate period
    const period = (2 * Math.PI) / omega;
    steps.push(`Period: T = 2π/ω = 2π/${omega.toFixed(2)} = ${period.toFixed(2)} s`);

    // Calculate displacement, velocity, acceleration
    const displacement = amplitude * Math.cos(omega * time + phaseRad);
    const velocity = -amplitude * omega * Math.sin(omega * time + phaseRad);
    const acceleration = -amplitude * omega * omega * Math.cos(omega * time + phaseRad);
    steps.push(
      `Displacement: x = A cos(ωt + φ) = ${amplitude} cos(${omega.toFixed(2)} × ${time} + ${phaseRad.toFixed(
        2
      )}) = ${displacement.toFixed(2)} m`
    );
    steps.push(
      `Velocity: v = -A ω sin(ωt + φ) = -${amplitude} × ${omega.toFixed(2)} sin(${omega.toFixed(
        2
      )} × ${time} + ${phaseRad.toFixed(2)}) = ${velocity.toFixed(2)} m/s`
    );
    steps.push(
      `Acceleration: a = -A ω² cos(ωt + φ) = -${amplitude} × ${omega.toFixed(2)}² cos(${omega.toFixed(
        2
      )} × ${time} + ${phaseRad.toFixed(2)}) = ${acceleration.toFixed(2)} m/s²`
    );

    // Calculate total mechanical energy
    let energy;
    if (mode === "spring") {
      energy = 0.5 * springConstant * amplitude * amplitude;
      steps.push(`Total energy: E = ½ k A² = ½ × ${springConstant} × ${amplitude}² = ${energy.toFixed(2)} J`);
    } else {
      const thetaMax = amplitude / length; // Amplitude as max angular displacement
      energy = 0.5 * mass * g * length * thetaMax * thetaMax;
      steps.push(
        `Total energy (small angles): E ≈ ½ m g L θ_max² = ½ × ${mass} × ${g} × ${length} × (${thetaMax.toFixed(
          2
        )})² = ${energy.toFixed(2)} J`
      );
    }

    // Display results
    setResults(
      <div>
        <p>Angular Frequency: {omega.toFixed(2)} rad/s</p>
        <p>Period: {period.toFixed(2)} s</p>
        <p>Displacement: {displacement.toFixed(2)} m</p>
        <p>Velocity: {velocity.toFixed(2)} m/s</p>
        <p>Acceleration: {acceleration.toFixed(2)} m/s²</p>
        <p>Total Energy: {energy.toFixed(2)} J</p>
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
        mode,
        amplitude,
        springConstant: mode === "spring" ? springConstant : null,
        length: mode === "pendulum" ? length : null,
        mass,
        phase,
        angleUnit,
        time,
        omega,
        period,
        displacement,
        velocity,
        acceleration,
        energy,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Plot graph
    plotGraph(omega, amplitude, phaseRad, period);
  };

  const plotGraph = (omega, amplitude, phaseRad, period) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#000000";
    ctx.fillText("SHM: Displacement, Velocity, Acceleration vs. Time", 10, 20);

    const steps = 100;
    const dt = period / steps;
    const maxY = Math.max(amplitude, amplitude * omega, amplitude * omega * omega);
    const scaleX = (canvas.width - 100) / period;
    const scaleY = (canvas.height - 100) / (2 * maxY);
    const cx = 50;
    const cy = canvas.height / 2;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(canvas.width - 50, cy);
    ctx.moveTo(cx, 50);
    ctx.lineTo(cx, canvas.height - 50);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw displacement (blue)
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const x = amplitude * Math.cos(omega * t + phaseRad);
      const px = cx + t * scaleX;
      const py = cy - x * scaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw velocity (red)
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const v = -amplitude * omega * Math.sin(omega * t + phaseRad);
      const px = cx + t * scaleX;
      const py = cy - v * scaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw acceleration (green)
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const a = -amplitude * omega * omega * Math.cos(omega * t + phaseRad);
      const px = cx + t * scaleX;
      const py = cy - a * scaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const clearInputs = () => {
    setInputs({
      amplitude: "",
      springConstant: "",
      length: "",
      mass: "",
      phase: "",
      time: "",
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
      "Run,Mode,Timestamp,Amplitude,Mass,SpringConstant,Length,Phase,AngleUnit,Time,Omega,Period,Displacement,Velocity,Acceleration,Energy",
      ...history.map(
        (run, index) => `
        ${index + 1},${run.mode},${run.timestamp},
        ${run.amplitude.toFixed(2)},${run.mass.toFixed(2)},
        ${run.mode === "spring" ? run.springConstant.toFixed(2) : ""},${
          run.mode === "pendulum" ? run.length.toFixed(2) : ""
        },
        ${run.phase.toFixed(2)},${run.angleUnit},${run.time.toFixed(2)},
        ${run.omega.toFixed(2)},${run.period.toFixed(2)},
        ${run.displacement.toFixed(2)},${run.velocity.toFixed(2)},${run.acceleration.toFixed(2)},
        ${run.energy.toFixed(2)}
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shm_data.csv";
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
    a.download = "shm_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateSHM();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className=" bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-5xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Simple Harmonic Motion Calculator
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-2">
              Mode:
            </label>
            <select
              id="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="SHM mode"
            >
              <option value="spring">Mass Spring</option>
              <option value="pendulum">Pendulum</option>
            </select>
          </div>
          <div>
            <label htmlFor="amplitude" className="block text-sm font-medium text-gray-700 mb-2">
              Amplitude (m):
            </label>
            <input
              type="text"
              id="amplitude"
              name="amplitude"
              value={inputs.amplitude}
              onChange={handleInputChange}
              placeholder="e.g., 0.1"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Amplitude in meters"
            />
          </div>
          {mode === "spring" && (
            <div>
              <label htmlFor="spring-constant" className="block text-sm font-medium text-gray-700 mb-2">
                Spring Constant (N/m):
              </label>
              <input
                type="text"
                id="spring-constant"
                name="springConstant"
                value={inputs.springConstant}
                onChange={handleInputChange}
                placeholder="e.g., 100"
                className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Spring constant in N/m"
              />
            </div>
          )}
          {mode === "pendulum" && (
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                Pendulum Length (m):
              </label>
              <input
                type="text"
                id="length"
                name="length"
                value={inputs.length}
                onChange={handleInputChange}
                placeholder="e.g., 1"
                className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Pendulum length in meters"
              />
            </div>
          )}
          <div>
            <label htmlFor="mass" className="block text-sm font-medium text-gray-700 mb-2">
              Mass (kg):
            </label>
            <input
              type="text"
              id="mass"
              name="mass"
              value={inputs.mass}
              onChange={handleInputChange}
              placeholder="e.g., 1"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Mass in kilograms"
            />
          </div>
          <div>
            <label htmlFor="phase" className="block text-sm font-medium text-gray-700 mb-2">
              Phase Angle:
            </label>
            <input
              type="text"
              id="phase"
              name="phase"
              value={inputs.phase}
              onChange={handleInputChange}
              placeholder="e.g., 0"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Phase angle"
            />
          </div>
          <div>
            <label htmlFor="angle-unit" className="block text-sm font-medium text-gray-700 mb-2">
              Angle Unit:
            </label>
            <select
              id="angle-unit"
              value={angleUnit}
              onChange={(e) => setAngleUnit(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Angle unit"
            >
              <option value="deg">Degrees</option>
              <option value="rad">Radians</option>
            </select>
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              Time (s):
            </label>
            <input
              type="text"
              id="time"
              name="time"
              value={inputs.time}
              onChange={handleInputChange}
              placeholder="e.g., 0"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Time in seconds"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateSHM}
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
        <div className="p-4 bg-gray-200 rounded-lg mb-4">{results}</div>
        <div className="p-4 bg-gray-200 rounded-lg max-h-52 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Calculation History</h2>
          <div>
            {history.map((run, index) => (
              <div key={index} className="p-2 mb-2 bg-white rounded-lg shadow-sm">
                <p>
                  Run {index + 1} ({run.mode}, {new Date(run.timestamp).toLocaleString()}):
                </p>
                <p>
                  Amplitude: {run.amplitude.toFixed(2)} m, Mass: {run.mass.toFixed(2)} kg, Phase:{" "}
                  {run.phase.toFixed(2)} {run.angleUnit}
                </p>
                {run.mode === "spring" ? (
                  <p>Spring Constant: {run.springConstant.toFixed(2)} N/m</p>
                ) : (
                  <p>Pendulum Length: {run.length.toFixed(2)} m</p>
                )}
                <p>
                  Time: {run.time.toFixed(2)} s, ω: {run.omega.toFixed(2)} rad/s, Period:{" "}
                  {run.period.toFixed(2)} s
                </p>
                <p>
                  Displacement: {run.displacement.toFixed(2)} m, Velocity: {run.velocity.toFixed(2)} m/s,
                  Acceleration: {run.acceleration.toFixed(2)} m/s²
                </p>
                <p>Energy: {run.energy.toFixed(2)} J</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHarmonicMotionCalculator;
