"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [mode, setMode] = useState("time-dilation");
  const [unitSystem, setUnitSystem] = useState("si");
  const [properTime, setProperTime] = useState("");
  const [velocity, setVelocity] = useState("");
  const [properLength, setProperLength] = useState("");
  const [velocityLC, setVelocityLC] = useState("");
  const [objectVelocity, setObjectVelocity] = useState("");
  const [frameVelocity, setFrameVelocity] = useState("");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const c = 299792458; // Speed of light in m/s

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 400;
    }
  }, []);

  const calculateRelativity = () => {
    const t0 = parseFloat(properTime);
    const v = parseFloat(velocity);
    const L0 = parseFloat(properLength);
    const vLC = parseFloat(velocityLC);
    const u = parseFloat(objectVelocity);
    const vFrame = parseFloat(frameVelocity);
    const steps = [];

    // Unit conversions for relativistic units
    let v_val = v,
      vLC_val = vLC,
      u_val = u,
      vFrame_val = vFrame;
    if (unitSystem === "relativistic") {
      v_val = v * c;
      vLC_val = vLC * c;
      u_val = u * c;
      vFrame_val = vFrame * c;
      steps.push("Converted velocities to SI: v, u, vFrame (c units to m/s).");
    }

    let result = { mode, unitSystem };

    if (mode === "time-dilation") {
      if (isNaN(t0) || t0 < 0 || isNaN(v_val) || v_val >= c) {
        setResults({ error: "Non-negative proper time and velocity (v < c) required." });
        return;
      }
      const gamma = 1 / Math.sqrt(1 - (v_val * v_val) / (c * c));
      const t = t0 * gamma;
      steps.push(
        `Lorentz factor: γ = 1/√(1 - v²/c²) = 1/√(1 - ${v_val.toFixed(2)}²/${c.toFixed(
          2
        )}²) = ${gamma.toFixed(2)}`
      );
      steps.push(`Time dilation: t = t_0 × γ = ${t0.toFixed(2)} × ${gamma.toFixed(2)} = ${t.toFixed(2)} s`);
      result.t0 = t0;
      result.v = v_val;
      result.t = t;
      result.gamma = gamma;
    } else if (mode === "length-contraction") {
      if (isNaN(L0) || L0 < 0 || isNaN(vLC_val) || vLC_val >= c) {
        setResults({ error: "Non-negative proper length and velocity (v < c) required." });
        return;
      }
      const gamma = 1 / Math.sqrt(1 - (vLC_val * vLC_val) / (c * c));
      const L = L0 / gamma;
      steps.push(
        `Lorentz factor: γ = 1/√(1 - v²/c²) = 1/√(1 - ${vLC_val.toFixed(2)}²/${c.toFixed(
          2
        )}²) = ${gamma.toFixed(2)}`
      );
      steps.push(
        `Length contraction: L = L_0 / γ = ${L0.toFixed(2)} / ${gamma.toFixed(2)} = ${L.toFixed(2)} m`
      );
      result.L0 = L0;
      result.v = vLC_val;
      result.L = L;
      result.gamma = gamma;
    } else if (mode === "velocity-transformation") {
      if (isNaN(u_val) || Math.abs(u_val) >= c || isNaN(vFrame_val) || Math.abs(vFrame_val) >= c) {
        setResults({ error: "Velocities (|u|, |v| < c) required." });
        return;
      }
      const uPrime = (u_val - vFrame_val) / (1 - (u_val * vFrame_val) / (c * c));
      steps.push(`Velocity transformation: u' = (u - v)/(1 - uv/c²)`);
      steps.push(
        `u' = (${u_val.toFixed(2)} - ${vFrame_val.toFixed(2)})/(1 - ${u_val.toFixed(
          2
        )} × ${vFrame_val.toFixed(2)}/${c.toFixed(2)}²) = ${uPrime.toFixed(2)} m/s`
      );
      result.u = u_val;
      result.v = vFrame_val;
      result.uPrime = uPrime;
    }

    // Convert outputs back to relativistic units for display
    if (unitSystem === "relativistic") {
      if (mode === "time-dilation") {
        result.v /= c;
      } else if (mode === "length-contraction") {
        result.v /= c;
      } else if (mode === "velocity-transformation") {
        result.u /= c;
        result.v /= c;
        result.uPrime /= c;
      }
      steps.push("Converted velocities back to relativistic units (c = 1) for display.");
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

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const scale = 50; // Arbitrary scaling for visualization

    if (result.mode === "time-dilation") {
      ctx.beginPath();
      ctx.moveTo(cx - 200, cy + 200);
      ctx.lineTo(cx + 200, cy - 200);
      ctx.moveTo(cx - 200, cy - 200);
      ctx.lineTo(cx + 200, cy + 200);
      ctx.strokeStyle = "#d1d5db";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText("ct", cx - 220, cy - 180);
      ctx.fillText("x", cx + 180, cy + 220);

      ctx.beginPath();
      ctx.moveTo(cx, cy + 200);
      ctx.lineTo(cx, cy - 200);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText("Stationary", cx + 10, cy - 180);

      const beta = result.v / c;
      ctx.beginPath();
      ctx.moveTo(cx - 200, cy + 200);
      ctx.lineTo(cx + 200 * beta, cy - 200);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(
        `Moving (v=${(result.unitSystem === "si" ? result.v : result.v * c).toFixed(2)} ${
          result.unitSystem === "si" ? "m/s" : "c"
        })`,
        cx + 10,
        cy - 160
      );

      const t0Scaled = result.t0 * scale;
      const tScaled = result.t * scale;
      ctx.beginPath();
      ctx.arc(cx, cy - t0Scaled, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`t_0=${result.t0.toFixed(2)} s`, cx + 10, cy - t0Scaled);
      ctx.beginPath();
      ctx.arc(cx + 200 * beta, cy - tScaled, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#22c55e";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`t=${result.t.toFixed(2)} s`, cx + 10, cy - tScaled);
    } else if (result.mode === "length-contraction") {
      ctx.beginPath();
      ctx.moveTo(cx - result.L0 * scale, cy);
      ctx.lineTo(cx + result.L0 * scale, cy);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`L_0=${result.L0.toFixed(2)} m`, cx + result.L0 * scale + 10, cy);

      ctx.beginPath();
      ctx.moveTo(cx - result.L * scale, cy + 50);
      ctx.lineTo(cx + result.L * scale, cy + 50);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(
        `L=${result.L.toFixed(2)} m (v=${(result.unitSystem === "si" ? result.v : result.v * c).toFixed(2)} ${
          result.unitSystem === "si" ? "m/s" : "c"
        })`,
        cx + result.L * scale + 10,
        cy + 50
      );
    } else if (result.mode === "velocity-transformation") {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + (result.u * scale) / 1e7, cy);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(
        `u=${(result.unitSystem === "si" ? result.u : result.u * c).toFixed(2)} ${
          result.unitSystem === "si" ? "m/s" : "c"
        }`,
        cx + (result.u * scale) / 1e7 + 10,
        cy
      );

      ctx.beginPath();
      ctx.moveTo(cx, cy + 50);
      ctx.lineTo(cx + (result.uPrime * scale) / 1e7, cy + 50);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(
        `u'=${(result.unitSystem === "si" ? result.uPrime : result.uPrime * c).toFixed(2)} ${
          result.unitSystem === "si" ? "m/s" : "c"
        }`,
        cx + (result.uPrime * scale) / 1e7 + 10,
        cy + 50
      );

      ctx.fillStyle = "#1f2937";
      ctx.fillText(
        `Frame v=${(result.unitSystem === "si" ? result.v : result.v * c).toFixed(2)} ${
          result.unitSystem === "si" ? "m/s" : "c"
        }`,
        cx,
        cy - 20
      );
    }
  };

  const importFromVectorResolver = () => {
    alert("Import from Vector Resolver not implemented. Please enter velocities manually.");
  };

  const clearInputs = () => {
    setProperTime("");
    setVelocity("");
    setProperLength("");
    setVelocityLC("");
    setObjectVelocity("");
    setFrameVelocity("");
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
      "Run,Mode,UnitSystem,Timestamp,ProperTime,ProperLength,Velocity,ObjectVelocity,FrameVelocity,DilatedTime,ContractedLength,LorentzFactor,TransformedVelocity",
      ...history.map((run, index) => {
        return `${index + 1},${run.mode},${run.unitSystem},${run.timestamp},${
          run.t0 ? run.t0.toFixed(2) : ""
        },${run.L0 ? run.L0.toFixed(2) : ""},${run.v ? run.v.toFixed(2) : ""},${
          run.u ? run.u.toFixed(2) : ""
        },${run.v && run.mode === "velocity-transformation" ? run.v.toFixed(2) : ""},${
          run.t ? run.t.toFixed(2) : ""
        },${run.L ? run.L.toFixed(2) : ""},${run.gamma ? run.gamma.toFixed(2) : ""},${
          run.uPrime ? run.uPrime.toFixed(2) : ""
        }`;
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relativity_data.csv";
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
    a.download = "relativity_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculateRelativity();
      if (e.key === "c") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [properTime, velocity, properLength, velocityLC, objectVelocity, frameVelocity, mode, unitSystem]);

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-5xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Relativity Calculator
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
                <option value="time-dilation">Time Dilation</option>
                <option value="length-contraction">Length Contraction</option>
                <option value="velocity-transformation">Velocity Transformation</option>
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
                <option value="si">SI (m, s)</option>
                <option value="relativistic">Relativistic (c = 1)</option>
              </select>
            </div>
          </div>
          {mode === "time-dilation" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Time Dilation Inputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="proper-time" className="block text-sm font-medium text-gray-700 mb-1">
                    Proper Time (s):
                  </label>
                  <input
                    type="text"
                    id="proper-time"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1"
                    value={properTime}
                    onChange={(e) => setProperTime(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="velocity" className="block text-sm font-medium text-gray-700 mb-1">
                    Relative Velocity ({unitSystem === "si" ? "m/s" : "c"}):
                  </label>
                  <input
                    type="text"
                    id="velocity"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 2.4e8"
                    value={velocity}
                    onChange={(e) => setVelocity(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          {mode === "length-contraction" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Length Contraction Inputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="proper-length" className="block text-sm font-medium text-gray-700 mb-1">
                    Proper Length (m):
                  </label>
                  <input
                    type="text"
                    id="proper-length"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1"
                    value={properLength}
                    onChange={(e) => setProperLength(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="velocity-lc" className="block text-sm font-medium text-gray-700 mb-1">
                    Relative Velocity ({unitSystem === "si" ? "m/s" : "c"}):
                  </label>
                  <input
                    type="text"
                    id="velocity-lc"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 2.4e8"
                    value={velocityLC}
                    onChange={(e) => setVelocityLC(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          {mode === "velocity-transformation" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Velocity Transformation Inputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="object-velocity" className="block text-sm font-medium text-gray-700 mb-1">
                    Object Velocity in S ({unitSystem === "si" ? "m/s" : "c"}):
                  </label>
                  <input
                    type="text"
                    id="object-velocity"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1.5e8"
                    value={objectVelocity}
                    onChange={(e) => setObjectVelocity(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="frame-velocity" className="block text-sm font-medium text-gray-700 mb-1">
                    Frame Velocity ({unitSystem === "si" ? "m/s" : "c"}):
                  </label>
                  <input
                    type="text"
                    id="frame-velocity"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 2.4e8"
                    value={frameVelocity}
                    onChange={(e) => setFrameVelocity(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculateRelativity}
            >
              Calculate
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={importFromVectorResolver}
            >
              Import Velocities
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
                  {results.mode === "time-dilation" && (
                    <>
                      <p>Proper Time: {results.t0.toFixed(2)} s</p>
                      <p>
                        Relative Velocity: {results.v.toFixed(2)} {results.unitSystem === "si" ? "m/s" : "c"}
                      </p>
                      <p>Lorentz Factor (γ): {results.gamma.toFixed(2)}</p>
                      <p>Dilated Time: {results.t.toFixed(2)} s</p>
                    </>
                  )}
                  {results.mode === "length-contraction" && (
                    <>
                      <p>Proper Length: {results.L0.toFixed(2)} m</p>
                      <p>
                        Relative Velocity: {results.v.toFixed(2)} {results.unitSystem === "si" ? "m/s" : "c"}
                      </p>
                      <p>Lorentz Factor (γ): {results.gamma.toFixed(2)}</p>
                      <p>Contracted Length: {results.L.toFixed(2)} m</p>
                    </>
                  )}
                  {results.mode === "velocity-transformation" && (
                    <>
                      <p>
                        Object Velocity (u): {results.u.toFixed(2)}{" "}
                        {results.unitSystem === "si" ? "m/s" : "c"}
                      </p>
                      <p>
                        Frame Velocity (v): {results.v.toFixed(2)} {results.unitSystem === "si" ? "m/s" : "c"}
                      </p>
                      <p>
                        Transformed Velocity (u'): {results.uPrime.toFixed(2)}{" "}
                        {results.unitSystem === "si" ? "m/s" : "c"}
                      </p>
                    </>
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
                {run.mode === "time-dilation" && (
                  <>
                    <p>Proper Time: {run.t0.toFixed(2)} s</p>
                    <p>
                      Relative Velocity: {run.v.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "c"}
                    </p>
                    <p>Lorentz Factor: {run.gamma.toFixed(2)}</p>
                    <p>Dilated Time: {run.t.toFixed(2)} s</p>
                  </>
                )}
                {run.mode === "length-contraction" && (
                  <>
                    <p>Proper Length: {run.L0.toFixed(2)} m</p>
                    <p>
                      Relative Velocity: {run.v.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "c"}
                    </p>
                    <p>Lorentz Factor: {run.gamma.toFixed(2)}</p>
                    <p>Contracted Length: {run.L.toFixed(2)} m</p>
                  </>
                )}
                {run.mode === "velocity-transformation" && (
                  <>
                    <p>
                      Object Velocity (u): {run.u.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "c"}
                    </p>
                    <p>
                      Frame Velocity (v): {run.v.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "c"}
                    </p>
                    <p>
                      Transformed Velocity (u'): {run.uPrime.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "m/s" : "c"}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
