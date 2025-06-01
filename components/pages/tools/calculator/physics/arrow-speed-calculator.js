"use client";

import React, { useRef, useState, useEffect } from "react";

const lbf_to_N = 4.44822;
const grain_to_kg = 6.479891e-5;
const inch_to_m = 0.0254;
const mps_to_fps = 3.28084;

export default function ArrowCalculator() {
  const canvasRef = useRef(null);
  const [unitSystem, setUnitSystem] = useState("si");
  const [drawWeight, setDrawWeight] = useState("");
  const [arrowMass, setArrowMass] = useState("");
  const [drawLength, setDrawLength] = useState("");
  const [efficiency, setEfficiency] = useState("");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [steps, setSteps] = useState([]);

  const parseInputs = () => {
    let F = parseFloat(drawWeight);
    let m = parseFloat(arrowMass);
    let d = parseFloat(drawLength);
    const eff = parseFloat(efficiency);
    const stepLog = [];

    if (unitSystem === "imperial") {
      stepLog.push("Converted imperial units to SI.");
      F *= lbf_to_N;
      m *= grain_to_kg;
      d *= inch_to_m;
    }

    if (isNaN(F) || isNaN(m) || isNaN(d) || isNaN(eff) || F <= 0 || m <= 0 || d <= 0 || eff < 0 || eff > 1) {
      return { valid: false };
    }

    const energy = eff * F * d;
    const speed = Math.sqrt((2 * energy) / m);
    stepLog.push(`Energy = η·F·d = ${eff}·${F.toFixed(2)}·${d.toFixed(2)} = ${energy.toFixed(2)} J`);
    stepLog.push(`Speed = √(2·E/m) = ${speed.toFixed(2)} m/s`);

    const displaySpeed = unitSystem === "imperial" ? speed * mps_to_fps : speed;
    if (unitSystem === "imperial") {
      stepLog.push("Converted speed to ft/s");
    }

    const result = {
      unitSystem,
      drawWeight: parseFloat(drawWeight),
      arrowMass: parseFloat(arrowMass),
      drawLength: parseFloat(drawLength),
      efficiency: eff,
      speed: displaySpeed,
      timestamp: new Date().toISOString(),
    };

    return { valid: true, result, steps: stepLog };
  };

  const calculate = () => {
    const parsed = parseInputs();
    if (!parsed.valid) return;
    setResults(parsed.result);
    setSteps(parsed.steps);
    setHistory((prev) => [...prev, parsed.result]);
  };

  const clear = () => {
    setDrawWeight("");
    setArrowMass("");
    setDrawLength("");
    setEfficiency("");
    setResults(null);
    setSteps([]);
    setHistory([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    if (!results || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 800, 400);
    const { drawWeight: F, drawLength: d, arrowMass: m, efficiency: eff, unitSystem } = results;

    const toSI = unitSystem === "imperial";
    const convertF = toSI ? F * lbf_to_N : F;
    const convertM = toSI ? m * grain_to_kg : m;
    const convertD = toSI ? d * inch_to_m : d;
    const convertSpeed = toSI ? mps_to_fps : 1;

    const maxF = convertF * 2;
    const points = 100;
    const plotWidth = 700;
    const plotHeight = 300;
    const offsetX = 50;
    const offsetY = 50;

    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const Fi = (i / points) * maxF;
      const Ei = eff * Fi * convertD;
      const vi = Math.sqrt((2 * Ei) / convertM) * convertSpeed;
      const x = offsetX + (Fi / maxF) * plotWidth;
      const y = offsetY + plotHeight - (vi / (vi * 1.2)) * plotHeight;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#00ffcc";
    ctx.stroke();
  }, [results]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl text-center font-bold text-red-500 animate-pulse mb-6">
          Arrow Speed Calculator
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label>Unit System:</label>
            <select
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value)}
              className="w-full mt-1 p-2 bg-black/30 border border-red-500 rounded-md"
            >
              <option value="si">SI (kg, m, s)</option>
              <option value="imperial">Imperial (lbf, grains, inches)</option>
            </select>
          </div>
          <div>
            <label>Draw Weight:</label>
            <input
              type="text"
              value={drawWeight}
              onChange={(e) => setDrawWeight(e.target.value)}
              placeholder="e.g., 200"
              className="w-full mt-1 p-2 bg-black/30 border border-red-500 rounded-md"
            />
          </div>
          <div>
            <label>Arrow Mass:</label>
            <input
              type="text"
              value={arrowMass}
              onChange={(e) => setArrowMass(e.target.value)}
              placeholder="e.g., 0.02"
              className="w-full mt-1 p-2 bg-black/30 border border-red-500 rounded-md"
            />
          </div>
          <div>
            <label>Draw Length:</label>
            <input
              type="text"
              value={drawLength}
              onChange={(e) => setDrawLength(e.target.value)}
              placeholder="e.g., 0.7"
              className="w-full mt-1 p-2 bg-black/30 border border-red-500 rounded-md"
            />
          </div>
          <div>
            <label>Bow Efficiency (0–1):</label>
            <input
              type="text"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              placeholder="e.g., 0.8"
              className="w-full mt-1 p-2 bg-black/30 border border-red-500 rounded-md"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={calculate}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Calculate
          </button>
          <button onClick={clear} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
            Clear
          </button>
        </div>

        {results && (
          <div className="bg-black/30 p-4 rounded-lg mb-4">
            <p>
              Arrow Speed:{" "}
              <strong>
                {results.speed.toFixed(2)} {unitSystem === "si" ? "m/s" : "ft/s"}
              </strong>
            </p>
            <h2 className="text-red-500 mt-2 font-bold">Steps:</h2>
            <ul className="list-disc pl-6">
              {steps.map((step, i) => (
                <li key={i} className="text-sm">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full rounded-lg border border-white/20 bg-black/30 mb-4"
        />

        {history.length > 0 && (
          <div className="max-h-48 overflow-y-auto bg-black/30 p-4 rounded-lg">
            <h2 className="text-red-500 font-semibold mb-2">Calculation History</h2>
            {history.map((h, i) => (
              <div key={i} className="mb-2 p-2 rounded bg-white/5">
                <p>
                  Run {i + 1}: {h.speed.toFixed(2)} {h.unitSystem === "si" ? "m/s" : "ft/s"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
