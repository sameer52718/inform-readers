"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [displacement, setDisplacement] = useState("");
  const [initialVelocity, setInitialVelocity] = useState("");
  const [finalVelocity, setFinalVelocity] = useState("");
  const [acceleration, setAcceleration] = useState("");
  const [time, setTime] = useState("");
  const [displacementUnit, setDisplacementUnit] = useState("m");
  const [velocityUnit, setVelocityUnit] = useState("m/s");
  const [finalVelocityUnit, setFinalVelocityUnit] = useState("m/s");
  const [accelerationUnit, setAccelerationUnit] = useState("m/s²");
  const [timeUnit, setTimeUnit] = useState("s");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const conversionFactors = {
    m: 1,
    km: 1000,
    ft: 0.3048,
    "m/s": 1,
    "km/h": 1000 / 3600,
    "ft/s": 0.3048,
    "m/s²": 1,
    "ft/s²": 0.3048,
    s: 1,
    min: 60,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 300;
    }
  }, []);

  const convertToSI = (value, unit) => value * conversionFactors[unit];
  const convertFromSI = (value, unit) => value / conversionFactors[unit];

  const calculateSUVAT = () => {
    const values = {
      s: displacement ? convertToSI(parseFloat(displacement), displacementUnit) : null,
      u: initialVelocity ? convertToSI(parseFloat(initialVelocity), velocityUnit) : null,
      v: finalVelocity ? convertToSI(parseFloat(finalVelocity), finalVelocityUnit) : null,
      a: acceleration ? convertToSI(parseFloat(acceleration), accelerationUnit) : null,
      t: time ? convertToSI(parseFloat(time), timeUnit) : null,
    };
    const selectedUnits = {
      s: displacementUnit,
      u: velocityUnit,
      v: finalVelocityUnit,
      a: accelerationUnit,
      t: timeUnit,
    };
    const provided = Object.values(values).filter((v) => v !== null).length;

    if (provided < 3) {
      setResults({ error: "Please provide at least 3 variables." });
      return;
    }

    let solution = null;
    let steps = [];

    try {
      if (values.s !== null && values.u !== null && values.t !== null) {
        const a = (2 * (values.s - values.u * values.t)) / (values.t * values.t);
        const v = values.u + a * values.t;
        solution = { ...values, v, a };
        steps.push(
          `Given: s = ${convertFromSI(values.s, selectedUnits.s).toFixed(2)} ${
            selectedUnits.s
          }, u = ${convertFromSI(values.u, selectedUnits.u).toFixed(2)} ${
            selectedUnits.u
          }, t = ${convertFromSI(values.t, selectedUnits.t).toFixed(2)} ${selectedUnits.t}`
        );
        steps.push(`Use s = ut + ½at²: a = 2(s - ut) / t² = ${a.toFixed(2)} m/s²`);
        steps.push(`Use v = u + at: v = ${v.toFixed(2)} m/s`);
      } else if (values.s !== null && values.v !== null && values.t !== null) {
        const a = (2 * (values.v * values.t - values.s)) / (values.t * values.t);
        const u = values.v - a * values.t;
        solution = { ...values, u, a };
        steps.push(
          `Given: s = ${convertFromSI(values.s, selectedUnits.s).toFixed(2)} ${
            selectedUnits.s
          }, v = ${convertFromSI(values.v, selectedUnits.v).toFixed(2)} ${
            selectedUnits.v
          }, t = ${convertFromSI(values.t, selectedUnits.t).toFixed(2)} ${selectedUnits.t}`
        );
        steps.push(`Use s = vt - ½at²: a = 2(vt - s) / t² = ${a.toFixed(2)} m/s²`);
        steps.push(`Use v = u + at: u = v - at = ${u.toFixed(2)} m/s`);
      } else if (values.u !== null && values.v !== null && values.t !== null) {
        const a = (values.v - values.u) / values.t;
        const s = ((values.u + values.v) * values.t) / 2;
        solution = { ...values, s, a };
        steps.push(
          `Given: u = ${convertFromSI(values.u, selectedUnits.u).toFixed(2)} ${
            selectedUnits.u
          }, v = ${convertFromSI(values.v, selectedUnits.v).toFixed(2)} ${
            selectedUnits.v
          }, t = ${convertFromSI(values.t, selectedUnits.t).toFixed(2)} ${selectedUnits.t}`
        );
        steps.push(`Use v = u + at: a = (v - u) / t = ${a.toFixed(2)} m/s²`);
        steps.push(
          `Use s = (u + v)t / 2: s = ${(values.u + values.v).toFixed(2)} * ${values.t.toFixed(
            2
          )} / 2 = ${s.toFixed(2)} m`
        );
      } else if (values.u !== null && values.v !== null && values.a !== null) {
        const t = (values.v - values.u) / values.a;
        const s = ((values.u + values.v) * t) / 2;
        solution = { ...values, s, t };
        steps.push(
          `Given: u = ${convertFromSI(values.u, selectedUnits.u).toFixed(2)} ${
            selectedUnits.u
          }, v = ${convertFromSI(values.v, selectedUnits.v).toFixed(2)} ${
            selectedUnits.v
          }, a = ${convertFromSI(values.a, selectedUnits.a).toFixed(2)} ${selectedUnits.a}`
        );
        steps.push(`Use v = u + at: t = (v - u) / a = ${t.toFixed(2)} s`);
        steps.push(
          `Use s = (u + v)t / 2: s = ${(values.u + values.v).toFixed(2)} * ${t.toFixed(2)} / 2 = ${s.toFixed(
            2
          )} m`
        );
      } else if (values.s !== null && values.u !== null && values.a !== null) {
        const v = Math.sqrt(values.u * values.u + 2 * values.a * values.s);
        const t = (v - values.u) / values.a;
        solution = { ...values, v, t };
        steps.push(
          `Given: s = ${convertFromSI(values.s, selectedUnits.s).toFixed(2)} ${
            selectedUnits.s
          }, u = ${convertFromSI(values.u, selectedUnits.u).toFixed(2)} ${
            selectedUnits.u
          }, a = ${convertFromSI(values.a, selectedUnits.a).toFixed(2)} ${selectedUnits.a}`
        );
        steps.push(`Use v² = u² + 2as: v = √(u² + 2as) = ${v.toFixed(2)} m/s`);
        steps.push(`Use v = u + at: t = (v - u) / a = ${t.toFixed(2)} s`);
      } else if (values.s !== null && values.v !== null && values.a !== null) {
        const u = Math.sqrt(values.v * values.v - 2 * values.a * values.s);
        const t = (values.v - u) / values.a;
        solution = { ...values, u, t };
        steps.push(
          `Given: s = ${convertFromSI(values.s, selectedUnits.s).toFixed(2)} ${
            selectedUnits.s
          }, v = ${convertFromSI(values.v, selectedUnits.v).toFixed(2)} ${
            selectedUnits.v
          }, a = ${convertFromSI(values.a, selectedUnits.a).toFixed(2)} ${selectedUnits.a}`
        );
        steps.push(`Use v² = u² + 2as: u = √(v² - 2as) = ${u.toFixed(2)} m/s`);
        steps.push(`Use v = u + at: t = (v - u) / a = ${t.toFixed(2)} s`);
      }

      if (!solution) {
        setResults({ error: "Invalid combination of variables." });
        return;
      }

      if (solution.t < 0 || isNaN(solution.t)) {
        setResults({ error: "Solution results in negative or invalid time." });
        return;
      }

      const displaySolution = {
        s: convertFromSI(solution.s, selectedUnits.s),
        u: convertFromSI(solution.u, selectedUnits.u),
        v: convertFromSI(solution.v, selectedUnits.v),
        a: convertFromSI(solution.a, selectedUnits.a),
        t: convertFromSI(solution.t, selectedUnits.t),
      };

      solution.steps = steps;
      solution.selectedUnits = selectedUnits;
      solution.displaySolution = displaySolution;

      setResults(solution);
      setHistory([...history, solution]);
      plotGraph(solution);
    } catch (error) {
      console.error("Calculation error:", error);
      setResults({ error: "Error in calculation. Check inputs." });
    }
  };

  const plotGraph = (solution) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#1f2937";
    ctx.fillText("Position, Velocity, Acceleration vs Time", 10, 20);

    const maxT = solution.t;
    const maxS = Math.abs(solution.s) * 1.2;
    const maxV = Math.max(Math.abs(solution.u), Math.abs(solution.v)) * 1.2;
    const maxA = Math.abs(solution.a) * 1.2;
    const scaleX = (canvas.width - 100) / maxT;
    const scaleY = (canvas.height - 40) / Math.max(maxS, maxV, maxA);

    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 20);
    ctx.lineTo(canvas.width - 10, canvas.height - 20);
    ctx.moveTo(50, canvas.height - 20);
    ctx.lineTo(50, 10);
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 20 - solution.u * scaleY);
    for (let t = 0; t <= maxT; t += 0.01) {
      const s = solution.u * t + 0.5 * solution.a * t * t;
      const px = 50 + t * scaleX;
      const py = canvas.height - 20 - s * scaleY;
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 20 - solution.u * scaleY);
    for (let t = 0; t <= maxT; t += 0.01) {
      const v = solution.u + solution.a * t;
      const px = 50 + t * scaleX;
      const py = canvas.height - 20 - v * scaleY;
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 20 - solution.a * scaleY);
    for (let t = 0; t <= maxT; t += 0.01) {
      const px = 50 + t * scaleX;
      const py = canvas.height - 20 - solution.a * scaleY;
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const clearInputs = () => {
    setDisplacement("");
    setInitialVelocity("");
    setFinalVelocity("");
    setAcceleration("");
    setTime("");
    setDisplacementUnit("m");
    setVelocityUnit("m/s");
    setFinalVelocityUnit("m/s");
    setAccelerationUnit("m/s²");
    setTimeUnit("s");
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
      "Run,Displacement,Unit,Initial Velocity,Unit,Final Velocity,Unit,Acceleration,Unit,Time,Unit",
      ...history.map((run, index) => {
        return `${index + 1},${run.displaySolution.s.toFixed(2)},${
          run.selectedUnits.s
        },${run.displaySolution.u.toFixed(2)},${run.selectedUnits.u},${run.displaySolution.v.toFixed(2)},${
          run.selectedUnits.v
        },${run.displaySolution.a.toFixed(2)},${run.selectedUnits.a},${run.displaySolution.t.toFixed(2)},${
          run.selectedUnits.t
        }`;
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suvat_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const json = JSON.stringify(
      history.map((run) => ({
        values: run.values,
        selectedUnits: run.selectedUnits,
        solution: run.displaySolution,
        steps: run.steps,
      })),
      null,
      2
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suvat_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculateSUVAT();
      if (e.key === "c") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    displacement,
    initialVelocity,
    finalVelocity,
    acceleration,
    time,
    displacementUnit,
    velocityUnit,
    finalVelocityUnit,
    accelerationUnit,
    timeUnit,
  ]);

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-4xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Super Advanced SUVAT Calculator
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="displacement" className="block text-sm font-medium text-gray-700 mb-1">
                Displacement (s):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="displacement"
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 10"
                  value={displacement}
                  onChange={(e) => setDisplacement(e.target.value)}
                />
                <select
                  id="displacement-unit"
                  className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={displacementUnit}
                  onChange={(e) => setDisplacementUnit(e.target.value)}
                >
                  <option value="m">m</option>
                  <option value="km">km</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="initial-velocity" className="block text-sm font-medium text-gray-700 mb-1">
                Initial Velocity (u):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="initial-velocity"
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 0"
                  value={initialVelocity}
                  onChange={(e) => setInitialVelocity(e.target.value)}
                />
                <select
                  id="velocity-unit"
                  className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={velocityUnit}
                  onChange={(e) => setVelocityUnit(e.target.value)}
                >
                  <option value="m/s">m/s</option>
                  <option value="km/h">km/h</option>
                  <option value="ft/s">ft/s</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="final-velocity" className="block text-sm font-medium text-gray-700 mb-1">
                Final Velocity (v):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="final-velocity"
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 20"
                  value={finalVelocity}
                  onChange={(e) => setFinalVelocity(e.target.value)}
                />
                <select
                  id="final-velocity-unit"
                  className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={finalVelocityUnit}
                  onChange={(e) => setFinalVelocityUnit(e.target.value)}
                >
                  <option value="m/s">m/s</option>
                  <option value="km/h">km/h</option>
                  <option value="ft/s">ft/s</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="acceleration" className="block text-sm font-medium text-gray-700 mb-1">
                Acceleration (a):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="acceleration"
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 9.81"
                  value={acceleration}
                  onChange={(e) => setAcceleration(e.target.value)}
                />
                <select
                  id="acceleration-unit"
                  className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={accelerationUnit}
                  onChange={(e) => setAccelerationUnit(e.target.value)}
                >
                  <option value="m/s²">m/s²</option>
                  <option value="ft/s²">ft/s²</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time (t):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="time"
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 2"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <select
                  id="time-unit"
                  className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
                >
                  <option value="s">s</option>
                  <option value="min">min</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculateSUVAT}
            >
              Calculate
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
            className="w-full max-h-[300px] bg-white border border-gray-200 rounded-lg mb-4"
          />
          {results && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              {results.error ? (
                <p className="text-red-500">{results.error}</p>
              ) : (
                <>
                  <p>
                    s = {results.displaySolution.s.toFixed(2)} {results.selectedUnits.s}
                  </p>
                  <p>
                    u = {results.displaySolution.u.toFixed(2)} {results.selectedUnits.u}
                  </p>
                  <p>
                    v = {results.displaySolution.v.toFixed(2)} {results.selectedUnits.v}
                  </p>
                  <p>
                    a = {results.displaySolution.a.toFixed(2)} {results.selectedUnits.a}
                  </p>
                  <p>
                    t = {results.displaySolution.t.toFixed(2)} {results.selectedUnits.t}
                  </p>
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
                <p>Run {index + 1}:</p>
                <p>
                  s = {run.displaySolution.s.toFixed(2)} {run.selectedUnits.s}, u ={" "}
                  {run.displaySolution.u.toFixed(2)} {run.selectedUnits.u}, v ={" "}
                  {run.displaySolution.v.toFixed(2)} {run.selectedUnits.v}, a ={" "}
                  {run.displaySolution.a.toFixed(2)} {run.selectedUnits.a}, t ={" "}
                  {run.displaySolution.t.toFixed(2)} {run.selectedUnits.t}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
