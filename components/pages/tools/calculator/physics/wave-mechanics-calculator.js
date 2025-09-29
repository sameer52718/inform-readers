"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [mode, setMode] = useState("standing-waves");
  const [inputs, setInputs] = useState({
    amplitude: "",
    wavelength: "",
    frequency: "",
    position: "",
    time: "",
    wavelengthInt: "",
    pathDifference: "",
    wavelengthDiff: "",
    slitWidth: "",
    order: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 400;
    }
  }, []);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const toggleModeInputs = () => {
    // Handled by conditional rendering in JSX
  };

  const calculateWaves = () => {
    const {
      amplitude,
      wavelength,
      frequency,
      position,
      time,
      wavelengthInt,
      pathDifference,
      wavelengthDiff,
      slitWidth,
      order,
    } = inputs;
    const parsed = {
      amplitude: parseFloat(amplitude),
      wavelength: parseFloat(wavelength),
      frequency: parseFloat(frequency),
      position: parseFloat(position),
      time: parseFloat(time),
      wavelengthInt: parseFloat(wavelengthInt),
      pathDifference: parseFloat(pathDifference),
      wavelengthDiff: parseFloat(wavelengthDiff),
      slitWidth: parseFloat(slitWidth),
      order: parseInt(order),
    };
    const steps = [];
    let result = { mode };

    if (mode === "standing-waves") {
      if (
        isNaN(parsed.amplitude) ||
        parsed.amplitude < 0 ||
        isNaN(parsed.wavelength) ||
        parsed.wavelength <= 0 ||
        isNaN(parsed.frequency) ||
        parsed.frequency < 0 ||
        isNaN(parsed.position) ||
        isNaN(parsed.time)
      ) {
        setResults({
          error:
            "Non-negative amplitude, positive wavelength, non-negative frequency, and valid position/time required.",
        });
        return;
      }
      const k = (2 * Math.PI) / parsed.wavelength;
      const omega = 2 * Math.PI * parsed.frequency;
      const y = 2 * parsed.amplitude * Math.sin(k * parsed.position) * Math.cos(omega * parsed.time);
      steps.push(`Wave number: k = 2π/λ = 2π/${parsed.wavelength.toFixed(2)} = ${k.toFixed(2)} rad/m`);
      steps.push(
        `Angular frequency: ω = 2πf = 2π × ${parsed.frequency.toFixed(2)} = ${omega.toFixed(2)} rad/s`
      );
      steps.push(
        `Displacement: y(x,t) = 2A sin(kx) cos(ωt) = 2 × ${parsed.amplitude.toFixed(2)} × sin(${k.toFixed(
          2
        )} × ${parsed.position.toFixed(2)}) × cos(${omega.toFixed(2)} × ${parsed.time.toFixed(2)})`
      );
      steps.push(`y(${parsed.position.toFixed(2)}, ${parsed.time.toFixed(2)}) = ${y.toFixed(2)} m`);
      result = {
        ...result,
        amplitude: parsed.amplitude,
        wavelength: parsed.wavelength,
        frequency: parsed.frequency,
        position: parsed.position,
        time: parsed.time,
        k,
        omega,
        y,
      };
    } else if (mode === "interference") {
      if (isNaN(parsed.wavelengthInt) || parsed.wavelengthInt <= 0 || isNaN(parsed.pathDifference)) {
        setResults({ error: "Positive wavelength and valid path difference required." });
        return;
      }
      const phaseDiff = (2 * Math.PI * parsed.pathDifference) / parsed.wavelengthInt;
      const phaseDiffDeg = (phaseDiff * 180) / Math.PI;
      let interferenceType = "partial";
      if (
        Math.abs(phaseDiff % (2 * Math.PI)) < 0.01 ||
        Math.abs((phaseDiff % (2 * Math.PI)) - 2 * Math.PI) < 0.01
      ) {
        interferenceType = "constructive";
      } else if (Math.abs((phaseDiff % (2 * Math.PI)) - Math.PI) < 0.01) {
        interferenceType = "destructive";
      }
      steps.push(
        `Phase difference: φ = 2π Δx / λ = 2π × ${parsed.pathDifference.toFixed(
          2
        )} / ${parsed.wavelengthInt.toFixed(2)} = ${phaseDiff.toFixed(2)} rad`
      );
      steps.push(`φ = ${phaseDiffDeg.toFixed(2)}°`);
      steps.push(`Interference: ${interferenceType}`);
      result = {
        ...result,
        wavelength: parsed.wavelengthInt,
        pathDifference: parsed.pathDifference,
        phaseDiff,
        interferenceType,
      };
    } else if (mode === "diffraction") {
      if (
        isNaN(parsed.wavelengthDiff) ||
        parsed.wavelengthDiff <= 0 ||
        isNaN(parsed.slitWidth) ||
        parsed.slitWidth <= 0 ||
        isNaN(parsed.order) ||
        !Number.isInteger(parsed.order) ||
        parsed.order === 0
      ) {
        setResults({
          error: "Positive wavelength, slit width, and non-zero integer order required.",
        });
        return;
      }
      const sinTheta = (parsed.order * parsed.wavelengthDiff) / parsed.slitWidth;
      let theta = null;
      if (Math.abs(sinTheta) <= 1) {
        theta = (Math.asin(sinTheta) * 180) / Math.PI;
        steps.push(
          `Diffraction minima: sin(θ) = m λ / a = ${parsed.order} × ${parsed.wavelengthDiff.toFixed(
            2
          )} / ${parsed.slitWidth.toFixed(2)} = ${sinTheta.toFixed(2)}`
        );
        steps.push(`θ = arcsin(${sinTheta.toFixed(2)}) = ${theta.toFixed(2)}°`);
      } else {
        steps.push(
          `No diffraction minimum: |m λ / a| = |${parsed.order} × ${parsed.wavelengthDiff.toFixed(
            2
          )} / ${parsed.slitWidth.toFixed(2)}| = ${Math.abs(sinTheta).toFixed(2)} > 1`
        );
      }
      result = {
        ...result,
        wavelength: parsed.wavelengthDiff,
        slitWidth: parsed.slitWidth,
        order: parsed.order,
        theta,
      };
    }

    result.steps = steps;
    result.timestamp = new Date().toISOString();
    setResults(result);
    setHistory((prev) => [...prev, result]);
    plotGraph(result);
  };

  const plotGraph = (result) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#1f2937";
    ctx.fillText(`${result.mode.replace(/-/g, " ")} Visualization`, 10, 20);

    const cx = 50;
    const cy = canvas.height / 2;
    const plotWidth = canvas.width - 100;
    const scaleY = 100;

    if (result.mode === "standing-waves") {
      const points = 100;
      const dx = (result.wavelength * 2) / points;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const x = i * dx;
        const y = 2 * result.amplitude * Math.sin(result.k * x) * Math.cos(result.omega * result.time);
        const px = cx + (x / (result.wavelength * 2)) * plotWidth;
        const py = cy - y * scaleY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const yPos =
        2 * result.amplitude * Math.sin(result.k * result.position) * Math.cos(result.omega * result.time);
      const px = cx + (result.position / (result.wavelength * 2)) * plotWidth;
      const py = cy - yPos * scaleY;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#22c55e";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`x=${result.position.toFixed(2)} m, y=${yPos.toFixed(2)} m`, px + 10, py - 10);
    } else if (result.mode === "interference") {
      const points = 100;
      const dx = (result.wavelength * 2) / points;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const deltaX = i * dx;
        const phase = (2 * Math.PI * deltaX) / result.wavelength;
        const intensity = Math.cos(phase / 2) ** 2;
        const px = cx + (deltaX / (result.wavelength * 2)) * plotWidth;
        const py = cy - intensity * scaleY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx + (result.pathDifference / (result.wavelength * 2)) * plotWidth;
      const phase = result.phaseDiff;
      const intensity = Math.cos(phase / 2) ** 2;
      const py = cy - intensity * scaleY;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#22c55e";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`Δx=${result.pathDifference.toFixed(2)} m, ${result.interferenceType}`, px + 10, py - 10);
    } else if (result.mode === "diffraction") {
      const points = 100;
      const thetaMax = Math.PI / 4;
      const dTheta = (2 * thetaMax) / points;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const theta = -thetaMax + i * dTheta;
        const beta = (Math.PI * result.slitWidth * Math.sin(theta)) / result.wavelength;
        const intensity = beta === 0 ? 1 : (Math.sin(beta) / beta) ** 2;
        const px = cx + ((theta + thetaMax) / (2 * thetaMax)) * plotWidth;
        const py = cy - intensity * scaleY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (result.theta !== null) {
        const thetaRad = (result.theta * Math.PI) / 180;
        const px = cx + ((thetaRad + thetaMax) / (2 * thetaMax)) * plotWidth;
        const py = cy;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#22c55e";
        ctx.fill();
        ctx.fillText(`θ=${result.theta.toFixed(2)}° (m=${result.order})`, px + 10, py - 10);
      }
    }

    ctx.fillStyle = "#1f2937";
    if (result.wavelength) ctx.fillText(`λ=${result.wavelength.toFixed(2)} m`, cx + 10, canvas.height - 20);
  };

  const clearInputs = () => {
    setInputs({
      amplitude: "",
      wavelength: "",
      frequency: "",
      position: "",
      time: "",
      wavelengthInt: "",
      pathDifference: "",
      wavelengthDiff: "",
      slitWidth: "",
      order: "",
    });
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
      "Run,Mode,Timestamp,Amplitude,Wavelength,Frequency,Position,Time,WaveNumber,AngularFrequency,Displacement,PathDifference,PhaseDifference,InterferenceType,SlitWidth,Order,DiffractionAngle",
      ...history.map((run, index) => {
        return [
          index + 1,
          run.mode,
          run.timestamp,
          run.amplitude ? run.amplitude.toFixed(2) : "",
          run.wavelength ? run.wavelength.toFixed(2) : "",
          run.frequency ? run.frequency.toFixed(2) : "",
          run.position ? run.position.toFixed(2) : "",
          run.time ? run.time.toFixed(2) : "",
          run.k ? run.k.toFixed(2) : "",
          run.omega ? run.omega.toFixed(2) : "",
          run.y ? run.y.toFixed(2) : "",
          run.pathDifference ? run.pathDifference.toFixed(2) : "",
          run.phaseDiff ? ((run.phaseDiff * 180) / Math.PI).toFixed(2) : "",
          run.interferenceType || "",
          run.slitWidth ? run.slitWidth.toFixed(2) : "",
          run.order || "",
          run.theta ? run.theta.toFixed(2) : "",
        ].join(",");
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wave_mechanics_data.csv";
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
    a.download = "wave_mechanics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculateWaves();
      if (e.key === "c") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [inputs, mode]);

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-4xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Wave Mechanics Calculator
          </h1>
          <div className="mb-4">
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
              Calculation Mode:
            </label>
            <select
              id="mode"
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                toggleModeInputs();
              }}
            >
              <option value="standing-waves">Standing Waves</option>
              <option value="interference">Interference</option>
              <option value="diffraction">Single-Slit Diffraction</option>
            </select>
          </div>
          {mode === "standing-waves" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Standing Waves Inputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="amplitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Amplitude (m):
                  </label>
                  <input
                    type="text"
                    id="amplitude"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.1"
                    value={inputs.amplitude}
                    onChange={(e) => handleInputChange("amplitude", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="wavelength" className="block text-sm font-medium text-gray-700 mb-1">
                    Wavelength (m):
                  </label>
                  <input
                    type="text"
                    id="wavelength"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1"
                    value={inputs.wavelength}
                    onChange={(e) => handleInputChange("wavelength", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency (Hz):
                  </label>
                  <input
                    type="text"
                    id="frequency"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1"
                    value={inputs.frequency}
                    onChange={(e) => handleInputChange("frequency", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position (m):
                  </label>
                  <input
                    type="text"
                    id="position"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.5"
                    value={inputs.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time (s):
                  </label>
                  <input
                    type="text"
                    id="time"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0"
                    value={inputs.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          {mode === "interference" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Interference Inputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wavelength-int" className="block text-sm font-medium text-gray-700 mb-1">
                    Wavelength (m):
                  </label>
                  <input
                    type="text"
                    id="wavelength-int"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1"
                    value={inputs.wavelengthInt}
                    onChange={(e) => handleInputChange("wavelengthInt", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="path-difference" className="block text-sm font-medium text-gray-700 mb-1">
                    Path Difference (m):
                  </label>
                  <input
                    type="text"
                    id="path-difference"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.5"
                    value={inputs.pathDifference}
                    onChange={(e) => handleInputChange("pathDifference", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          {mode === "diffraction" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Single-Slit Diffraction Inputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="wavelength-diff" className="block text-sm font-medium text-gray-700 mb-1">
                    Wavelength (m):
                  </label>
                  <input
                    type="text"
                    id="wavelength-diff"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 5e-7"
                    value={inputs.wavelengthDiff}
                    onChange={(e) => handleInputChange("wavelengthDiff", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="slit-width" className="block text-sm font-medium text-gray-700 mb-1">
                    Slit Width (m):
                  </label>
                  <input
                    type="text"
                    id="slit-width"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1e-6"
                    value={inputs.slitWidth}
                    onChange={(e) => handleInputChange("slitWidth", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                    Order (m):
                  </label>
                  <input
                    type="text"
                    id="order"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1"
                    value={inputs.order}
                    onChange={(e) => handleInputChange("order", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculateWaves}
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
            className="w-full max-h-[400px] bg-white border border-gray-200 rounded-lg mb-4"
          />
          {results && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              {results.error ? (
                <p className="text-red-500">{results.error}</p>
              ) : (
                <>
                  {results.mode === "standing-waves" && (
                    <>
                      <p>Amplitude: {results.amplitude.toFixed(2)} m</p>
                      <p>Wavelength: {results.wavelength.toFixed(2)} m</p>
                      <p>Frequency: {results.frequency.toFixed(2)} Hz</p>
                      <p>Wave Number: {results.k.toFixed(2)} rad/m</p>
                      <p>Angular Frequency: {results.omega.toFixed(2)} rad/s</p>
                      <p>
                        Displacement at x={results.position.toFixed(2)} m, t=
                        {results.time.toFixed(2)} s: {results.y.toFixed(2)} m
                      </p>
                    </>
                  )}
                  {results.mode === "interference" && (
                    <>
                      <p>Wavelength: {results.wavelength.toFixed(2)} m</p>
                      <p>Path Difference: {results.pathDifference.toFixed(2)} m</p>
                      <p>Phase Difference: {((results.phaseDiff * 180) / Math.PI).toFixed(2)}°</p>
                      <p>Interference: {results.interferenceType}</p>
                    </>
                  )}
                  {results.mode === "diffraction" && (
                    <>
                      <p>Wavelength: {results.wavelength.toFixed(2)} m</p>
                      <p>Slit Width: {results.slitWidth.toFixed(2)} m</p>
                      <p>Order: {results.order}</p>
                      {results.theta !== null ? (
                        <p>Diffraction Angle: {results.theta.toFixed(2)}°</p>
                      ) : (
                        <p>No diffraction minimum (sin θ {">"} 1)</p>
                      )}
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
                  Run {index + 1} ({run.mode.replace(/-/g, " ")}, {new Date(run.timestamp).toLocaleString()}):
                </p>
                {run.mode === "standing-waves" && (
                  <>
                    <p>Amplitude: {run.amplitude.toFixed(2)} m</p>
                    <p>Wavelength: {run.wavelength.toFixed(2)} m</p>
                    <p>Frequency: {run.frequency.toFixed(2)} Hz</p>
                    <p>Wave Number: {run.k.toFixed(2)} rad/m</p>
                    <p>Angular Frequency: {run.omega.toFixed(2)} rad/s</p>
                    <p>
                      Displacement at x={run.position.toFixed(2)} m, t={run.time.toFixed(2)} s:{" "}
                      {run.y.toFixed(2)} m
                    </p>
                  </>
                )}
                {run.mode === "interference" && (
                  <>
                    <p>Wavelength: {run.wavelength.toFixed(2)} m</p>
                    <p>Path Difference: {run.pathDifference.toFixed(2)} m</p>
                    <p>Phase Difference: {((run.phaseDiff * 180) / Math.PI).toFixed(2)}°</p>
                    <p>Interference: {run.interferenceType}</p>
                  </>
                )}
                {run.mode === "diffraction" && (
                  <>
                    <p>Wavelength: {run.wavelength.toFixed(2)} m</p>
                    <p>Slit Width: {run.slitWidth.toFixed(2)} m</p>
                    <p>Order: {run.order}</p>
                    {run.theta !== null ? (
                      <p>Diffraction Angle: {run.theta.toFixed(2)}°</p>
                    ) : (
                      <p>No diffraction minimum</p>
                    )}
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
