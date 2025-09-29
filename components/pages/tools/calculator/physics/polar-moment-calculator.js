"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";

export default function Home() {
  const [unitSystem, setUnitSystem] = useState("si");
  const [shape, setShape] = useState("circular");
  const [radius, setRadius] = useState("");
  const [outerRadius, setOuterRadius] = useState("");
  const [innerRadius, setInnerRadius] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const in_to_m = 0.0254; // in to m

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 400;
    }
  }, []);

  const updateInputs = () => {
    // Handled by conditional rendering in JSX
  };

  const calculate = () => {
    const steps = [];
    let r = parseFloat(radius);
    let r_o = parseFloat(outerRadius);
    let r_i = parseFloat(innerRadius);
    let w = parseFloat(width);
    let h = parseFloat(height);
    let J;

    if (unitSystem === "imperial") {
      r *= in_to_m;
      r_o *= in_to_m;
      r_i *= in_to_m;
      w *= in_to_m;
      h *= in_to_m;
      steps.push("Converted dimensions (in to m).");
    }

    if (shape === "circular") {
      if (isNaN(r) || r <= 0) {
        setResults({ error: "Positive radius required." });
        return;
      }
      J = (Math.PI * r ** 4) / 2;
      steps.push(`Polar moment: J = (π r⁴) / 2 = (π × ${r.toFixed(4)}⁴) / 2 = ${J.toFixed(6)} m⁴`);
    } else if (shape === "annular") {
      if (isNaN(r_o) || r_o <= 0 || isNaN(r_i) || r_i <= 0 || r_i >= r_o) {
        setResults({ error: "Positive r_o > r_i required." });
        return;
      }
      J = (Math.PI * (r_o ** 4 - r_i ** 4)) / 2;
      steps.push(
        `Polar moment: J = (π (r_o⁴ - r_i⁴)) / 2 = (π × (${r_o.toFixed(4)}⁴ - ${r_i.toFixed(
          4
        )}⁴)) / 2 = ${J.toFixed(6)} m⁴`
      );
    } else if (shape === "rectangular") {
      if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0) {
        setResults({ error: "Positive width and height required." });
        return;
      }
      J = (w * h * (w ** 2 + h ** 2)) / 12;
      steps.push(
        `Polar moment: J = (w h (w² + h²)) / 12 = (${w.toFixed(4)} × ${h.toFixed(4)} × (${w.toFixed(
          4
        )}² + ${h.toFixed(4)}²)) / 12 = ${J.toFixed(6)} m⁴`
      );
    }

    let J_display = J;
    let r_display = parseFloat(radius);
    let r_o_display = parseFloat(outerRadius);
    let r_i_display = parseFloat(innerRadius);
    let w_display = parseFloat(width);
    let h_display = parseFloat(height);
    if (unitSystem === "imperial") {
      J_display /= in_to_m ** 4;
      steps.push("Converted polar moment (m⁴ to in⁴).");
    }

    const result = {
      unitSystem,
      shape,
      radius: r_display,
      outerRadius: r_o_display,
      innerRadius: r_i_display,
      width: w_display,
      height: h_display,
      polarMoment: J_display,
      timestamp: new Date().toISOString(),
      steps,
    };

    setResults(result);
    setHistory([...history, result]);
    plotGraph(result);
  };

  const plotGraph = (result) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#000000";
    ctx.fillText("Cross-Section View", 10, 20);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const scale = 1000;

    const r = result.radius || 0;
    const r_o = result.outerRadius || 0;
    const r_i = result.innerRadius || 0;
    const w = result.width || 0;
    const h = result.height || 0;

    ctx.beginPath();
    if (result.shape === "circular") {
      ctx.arc(cx, cy, r * scale, 0, 2 * Math.PI);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
    } else if (result.shape === "annular") {
      ctx.arc(cx, cy, r_o * scale, 0, 2 * Math.PI);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, r_i * scale, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    } else if (result.shape === "rectangular") {
      ctx.rect(cx - (w * scale) / 2, cy - (h * scale) / 2, w * scale, h * scale);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
    }
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#22c55e";
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.fillText("Centroid", cx + 10, cy - 10);
  };

  const clearInputs = () => {
    setRadius("");
    setOuterRadius("");
    setInnerRadius("");
    setWidth("");
    setHeight("");
    setResults(null);
    setHistory([]);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const exportCSV = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const csv = [
      "Run,UnitSystem,Timestamp,Shape,Radius,OuterRadius,InnerRadius,Width,Height,PolarMoment",
      ...history.map(
        (run, index) => `
        ${index + 1},${run.unitSystem},${run.timestamp},${run.shape},
        ${run.radius ? run.radius.toFixed(4) : ""},${run.outerRadius ? run.outerRadius.toFixed(4) : ""},
        ${run.innerRadius ? run.innerRadius.toFixed(4) : ""},${run.width ? run.width.toFixed(4) : ""},
        ${run.height ? run.height.toFixed(4) : ""},${run.polarMoment.toFixed(6)}
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "polar_moment_data.csv";
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
    a.download = "polar_moment_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculate();
      if (e.key === "c") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [calculate, clearInputs]);

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-4xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Polar Moment of Inertia Calculator
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="unit-system">
                Unit System:
              </label>
              <select
                id="unit-system"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
                aria-label="Unit system"
              >
                <option value="si">SI (m)</option>
                <option value="imperial">Imperial (in)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="shape">
                Shape:
              </label>
              <select
                id="shape"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                aria-label="Shape"
              >
                <option value="circular">Circular</option>
                <option value="annular">Annular</option>
                <option value="rectangular">Rectangular</option>
              </select>
            </div>
            {shape === "circular" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="radius">
                  Radius:
                </label>
                <input
                  type="text"
                  id="radius"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 0.1 (m or in)"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  aria-label="Radius"
                />
              </div>
            )}
            {shape === "annular" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="outer-radius">
                    Outer Radius:
                  </label>
                  <input
                    type="text"
                    id="outer-radius"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.1 (m or in)"
                    value={outerRadius}
                    onChange={(e) => setOuterRadius(e.target.value)}
                    aria-label="Outer radius"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="inner-radius">
                    Inner Radius:
                  </label>
                  <input
                    type="text"
                    id="inner-radius"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.05 (m or in)"
                    value={innerRadius}
                    onChange={(e) => setInnerRadius(e.target.value)}
                    aria-label="Inner radius"
                  />
                </div>
              </>
            )}
            {shape === "rectangular" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="width">
                    Width:
                  </label>
                  <input
                    type="text"
                    id="width"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.2 (m or in)"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    aria-label="Width"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="height">
                    Height:
                  </label>
                  <input
                    type="text"
                    id="height"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.3 (m or in)"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    aria-label="Height"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              className="flex-1 min-w-[120px] p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculate}
            >
              Calculate
            </button>
            <button
              className="flex-1 min-w-[120px] p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all focus:ring-2 focus:ring-gray-500"
              onClick={clearInputs}
            >
              Clear
            </button>
            <button
              className="flex-1 min-w-[120px] p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={exportCSV}
            >
              Export CSV
            </button>
            <button
              className="flex-1 min-w-[120px] p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={exportJSON}
            >
              Export JSON
            </button>
          </div>
          <canvas
            ref={canvasRef}
            className="w-full max-h-[400px] bg-white border border-gray-200 rounded-lg mb-4"
          />
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            {results && (
              <>
                {results.error ? (
                  <p className="text-red-500">{results.error}</p>
                ) : (
                  <>
                    <p>Shape: {results.shape.charAt(0).toUpperCase() + results.shape.slice(1)}</p>
                    {results.shape === "circular" && (
                      <p>
                        Radius: {results.radius.toFixed(4)} {results.unitSystem === "si" ? "m" : "in"}
                      </p>
                    )}
                    {results.shape === "annular" && (
                      <>
                        <p>
                          Outer Radius: {results.outerRadius.toFixed(4)}{" "}
                          {results.unitSystem === "si" ? "m" : "in"}
                        </p>
                        <p>
                          Inner Radius: {results.innerRadius.toFixed(4)}{" "}
                          {results.unitSystem === "si" ? "m" : "in"}
                        </p>
                      </>
                    )}
                    {results.shape === "rectangular" && (
                      <>
                        <p>
                          Width: {results.width.toFixed(4)} {results.unitSystem === "si" ? "m" : "in"}
                        </p>
                        <p>
                          Height: {results.height.toFixed(4)} {results.unitSystem === "si" ? "m" : "in"}
                        </p>
                      </>
                    )}
                    <p>
                      Polar Moment of Inertia: {results.polarMoment.toFixed(6)}{" "}
                      {results.unitSystem === "si" ? "m⁴" : "in⁴"}
                    </p>
                    <h2 className="text-xl font-semibold text-red-500 mt-4">Solution Steps</h2>
                    {results.steps.map((step, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {step}
                      </p>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg max-h-[200px] overflow-y-auto">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Calculation History</h2>
            {history.map((run, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-lg mb-2">
                <p>
                  Run {index + 1} ({run.unitSystem}, {run.timestamp}):
                </p>
                <p>Shape: {run.shape.charAt(0).toUpperCase() + run.shape.slice(1)}</p>
                {run.shape === "circular" && (
                  <p>
                    Radius: {run.radius.toFixed(4)} {run.unitSystem === "si" ? "m" : "in"}
                  </p>
                )}
                {run.shape === "annular" && (
                  <>
                    <p>
                      Outer Radius: {run.outerRadius.toFixed(4)} {run.unitSystem === "si" ? "m" : "in"}
                    </p>
                    <p>
                      Inner Radius: {run.innerRadius.toFixed(4)} {run.unitSystem === "si" ? "m" : "in"}
                    </p>
                  </>
                )}
                {run.shape === "rectangular" && (
                  <>
                    <p>
                      Width: {run.width.toFixed(4)} {run.unitSystem === "si" ? "m" : "in"}
                    </p>
                    <p>
                      Height: {run.height.toFixed(4)} {run.unitSystem === "si" ? "m" : "in"}
                    </p>
                  </>
                )}
                <p>
                  Polar Moment of Inertia: {run.polarMoment.toFixed(6)}{" "}
                  {run.unitSystem === "si" ? "m⁴" : "in⁴"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
