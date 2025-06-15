"use client";

import React, { useState, useEffect, useRef } from "react";

const OpticsCalculator = () => {
  const [mode, setMode] = useState("lens");
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    focalLength: "",
    objectDistance: "",
    objectHeight: "",
    n1: "",
    n2: "",
    incidentAngle: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

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

  const calculateOptics = () => {
    try {
      const focalLength = parseFloat(inputs.focalLength);
      const objectDistance = parseFloat(inputs.objectDistance);
      const objectHeight = parseFloat(inputs.objectHeight);
      const n1 = parseFloat(inputs.n1);
      const n2 = parseFloat(inputs.n2);
      const incidentAngle = parseFloat(inputs.incidentAngle);
      const steps = [];

      let f = focalLength,
        do_ = objectDistance,
        ho = objectHeight;
      if (unitSystem === "imperial") {
        f *= 3.28084; // m to ft
        do_ *= 3.28084;
        ho *= 3.28084;
        steps.push("Converted lengths to imperial: focal length, object distance, object height.");
      }

      let result = { mode, unitSystem };

      if (mode === "lens" || mode === "mirror") {
        if (isNaN(f) || isNaN(do_) || do_ <= 0 || isNaN(ho) || ho < 0) {
          setResults(
            <p className="text-red-500">
              Focal length, positive object distance, and non-negative object height required.
            </p>
          );
          return;
        }
        let di = 1 / (1 / f - 1 / do_); // Lens/mirror formula
        let m = -di / do_;
        let hi = m * ho;
        let imageType = di > 0 ? "real" : "virtual";
        let orientation = m > 0 ? "upright" : "inverted";
        if (mode === "mirror" && di > 0 && f > 0) {
          imageType = "real"; // Concave mirror
        } else if (mode === "mirror" && f < 0) {
          imageType = "virtual"; // Convex mirror
        }
        steps.push(
          `${mode === "lens" ? "Lens" : "Mirror"} formula: 1/f = 1/d_o + 1/d_i → 1/${f.toFixed(
            2
          )} = 1/${do_.toFixed(2)} + 1/d_i`
        );
        steps.push(`Image distance: d_i = ${di.toFixed(2)} ${unitSystem === "si" ? "m" : "ft"}`);
        steps.push(`Magnification: m = -d_i/d_o = -${di.toFixed(2)}/${do_.toFixed(2)} = ${m.toFixed(2)}`);
        steps.push(
          `Image height: h_i = m × h_o = ${m.toFixed(2)} × ${ho.toFixed(2)} = ${hi.toFixed(2)} ${
            unitSystem === "si" ? "m" : "ft"
          }`
        );
        steps.push(`Image: ${imageType}, ${orientation}`);
        result = { ...result, f, do: do_, ho, di, hi, m, imageType, orientation };
        if (unitSystem === "imperial") {
          result.f /= 3.28084; // ft to m
          result.do /= 3.28084;
          result.ho /= 3.28084;
          result.di /= 3.28084;
          result.hi /= 3.28084;
          steps.push("Converted outputs back to SI for display.");
        }
        setResults(
          <div>
            <p>
              Focal Length: {result.f.toFixed(2)} {unitSystem === "si" ? "m" : "ft"}
            </p>
            <p>
              Object Distance: {result.do.toFixed(2)} {unitSystem === "si" ? "m" : "ft"}
            </p>
            <p>
              Object Height: {result.ho.toFixed(2)} {unitSystem === "si" ? "m" : "ft"}
            </p>
            <p>
              Image Distance: {result.di.toFixed(2)} {unitSystem === "si" ? "m" : "ft"}
            </p>
            <p>
              Image Height: {result.hi.toFixed(2)} {unitSystem === "si" ? "m" : "ft"}
            </p>
            <p>Magnification: {result.m.toFixed(2)}</p>
            <p>
              Image Type: {result.imageType}, {result.orientation}
            </p>
            <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
            {steps.map((step, idx) => (
              <p key={idx} className="text-sm text-gray-700 mb-2">
                {step}
              </p>
            ))}
          </div>
        );
      } else if (mode === "refraction") {
        if (
          isNaN(n1) ||
          n1 <= 0 ||
          isNaN(n2) ||
          n2 <= 0 ||
          isNaN(incidentAngle) ||
          incidentAngle < 0 ||
          incidentAngle > 90
        ) {
          setResults(<p className="text-red-500">Positive indices and incident angle (0–90°) required.</p>);
          return;
        }
        const theta1Rad = (incidentAngle * Math.PI) / 180;
        const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;
        let theta2 = null,
          criticalAngle = null;
        if (sinTheta2 > 1 && n1 > n2) {
          steps.push(
            `Total internal reflection: sin(θ₂) = (n₁ sin(θ₁))/n₂ = (${n1} × sin(${incidentAngle}°))/${n2} > 1`
          );
        } else {
          theta2 = (Math.asin(sinTheta2) * 180) / Math.PI;
          steps.push(
            `Snell’s law: n₁ sin(θ₁) = n₂ sin(θ₂) → ${n1} × sin(${incidentAngle}°) = ${n2} × sin(θ₂)`
          );
          steps.push(
            `Refracted angle: θ₂ = arcsin((${n1} × sin(${incidentAngle}°))/${n2}) = ${theta2.toFixed(2)}°`
          );
        }
        if (n1 > n2) {
          criticalAngle = (Math.asin(n2 / n1) * 180) / Math.PI;
          steps.push(
            `Critical angle: θ_c = arcsin(n₂/n₁) = arcsin(${n2}/${n1}) = ${criticalAngle.toFixed(2)}°`
          );
        }
        result = { ...result, n1, n2, theta1: incidentAngle, theta2, criticalAngle };
        setResults(
          <div>
            <p>Index of Refraction 1: {result.n1.toFixed(2)}</p>
            <p>Index of Refraction 2: {result.n2.toFixed(2)}</p>
            <p>Incident Angle: {result.theta1.toFixed(2)}°</p>
            {result.theta2 !== null ? (
              <p>Refracted Angle: {result.theta2.toFixed(2)}°</p>
            ) : (
              <p>Total Internal Reflection</p>
            )}
            {result.criticalAngle && <p>Critical Angle: {result.criticalAngle.toFixed(2)}°</p>}
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
    const scale = 100; // Pixels per meter

    if (result.mode === "lens" || result.mode === "mirror") {
      // Draw optic axis
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(canvasRef.current.width, cy);
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw lens/mirror
      const lensX = cx;
      ctx.beginPath();
      if (result.mode === "lens") {
        ctx.moveTo(lensX, cy - 50);
        ctx.lineTo(lensX, cy + 50);
      } else {
        ctx.arc(
          lensX - (result.f > 0 ? result.f * scale : -result.f * scale),
          cy,
          Math.abs(result.f * scale),
          -Math.PI / 2,
          Math.PI / 2
        );
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw object
      const objX = cx - result.do * scale;
      const objY = cy - result.ho * scale;
      ctx.beginPath();
      ctx.moveTo(objX, cy);
      ctx.lineTo(objX, objY);
      ctx.strokeStyle = "#f87171";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(
        `Object (d_o=${result.do.toFixed(2)}${
          result.unitSystem === "si" ? "m" : "ft"
        }, h_o=${result.ho.toFixed(2)}${result.unitSystem === "si" ? "m" : "ft"})`,
        objX - 20,
        objY - 10
      );

      // Draw image
      const imgX = cx + result.di * scale;
      const imgY = cy - result.hi * scale;
      ctx.beginPath();
      ctx.moveTo(imgX, cy);
      ctx.lineTo(imgX, imgY);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillText(
        `Image (d_i=${result.di.toFixed(2)}${
          result.unitSystem === "si" ? "m" : "ft"
        }, h_i=${result.hi.toFixed(2)}${result.unitSystem === "si" ? "m" : "ft"})`,
        imgX + 10,
        imgY - 10
      );

      // Draw principal rays
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(lensX, objY);
      ctx.lineTo(lensX + result.f * scale, cy);
      ctx.moveTo(objX, objY);
      ctx.lineTo(imgX, imgY);
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (result.mode === "refraction") {
      // Draw interface
      ctx.beginPath();
      ctx.moveTo(cx, 50);
      ctx.lineTo(cx, canvasRef.current.height - 50);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw normal
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy);
      ctx.lineTo(cx + 50, cy);
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw incident ray
      const theta1Rad = (result.theta1 * Math.PI) / 180;
      const r = 100;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - r * Math.cos(theta1Rad), cy - r * Math.sin(theta1Rad));
      ctx.strokeStyle = "#f87171";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`θ₁=${result.theta1.toFixed(2)}°`, cx - 50, cy - 50);

      // Draw refracted ray
      if (result.theta2 !== null) {
        const theta2Rad = (result.theta2 * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r * Math.cos(theta2Rad), cy + r * Math.sin(theta2Rad));
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillText(`θ₂=${result.theta2.toFixed(2)}°`, cx + 50, cy + 50);
      }
      ctx.fillText(`n₁=${result.n1.toFixed(2)}`, cx - 50, 60);
      ctx.fillText(`n₂=${result.n2.toFixed(2)}`, cx + 50, canvasRef.current.height - 60);
    }
  };

  const clearInputs = () => {
    setInputs({
      focalLength: "",
      objectDistance: "",
      objectHeight: "",
      n1: "",
      n2: "",
      incidentAngle: "",
    });
    setResults(null);
    setHistory([]);
    if (ctxRef.current) ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const importFromVectorResolver = () => {
    alert("Import from Vector Resolver not implemented. Please enter angles manually.");
  };

  const exportCSV = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const csv = [
      "Run,Mode,UnitSystem,Timestamp,FocalLength,ObjectDistance,ObjectHeight,ImageDistance,ImageHeight,Magnification,ImageType,Orientation,n1,n2,Theta1,Theta2,CriticalAngle",
      ...history.map(
        (run, index) => `
        ${index + 1},${run.mode},${run.unitSystem},${run.timestamp},
        ${run.f ? run.f.toFixed(2) : ""},${run.do ? run.do.toFixed(2) : ""},${
          run.ho ? run.ho.toFixed(2) : ""
        },
        ${run.di ? run.di.toFixed(2) : ""},${run.hi ? run.hi.toFixed(2) : ""},${
          run.m ? run.m.toFixed(2) : ""
        },
        ${run.imageType || ""},${run.orientation || ""},
        ${run.n1 ? run.n1.toFixed(2) : ""},${run.n2 ? run.n2.toFixed(2) : ""},
        ${run.theta1 ? run.theta1.toFixed(2) : ""},${run.theta2 ? run.theta2.toFixed(2) : ""},
        ${run.criticalAngle ? run.criticalAngle.toFixed(2) : ""}
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optics_data.csv";
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
    a.download = "optics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateOptics();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className="min-h-screen bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-5xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Optics Calculator</h1>
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
              <option value="lens">Thin Lens</option>
              <option value="mirror">Spherical Mirror</option>
              <option value="refraction">Refraction</option>
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
              <option value="si">SI (m, degrees)</option>
              <option value="imperial">Imperial (ft, degrees)</option>
            </select>
          </div>
        </div>
        {(mode === "lens" || mode === "mirror") && (
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Lens/Mirror Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="focal-length" className="block text-sm font-medium text-gray-700 mb-2">
                  Focal Length ({unitSystem === "si" ? "m" : "ft"}):
                </label>
                <input
                  type="text"
                  id="focal-length"
                  name="focalLength"
                  value={inputs.focalLength}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.2"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Focal length"
                />
              </div>
              <div>
                <label htmlFor="object-distance" className="block text-sm font-medium text-gray-700 mb-2">
                  Object Distance ({unitSystem === "si" ? "m" : "ft"}):
                </label>
                <input
                  type="text"
                  id="object-distance"
                  name="objectDistance"
                  value={inputs.objectDistance}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.4"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Object distance"
                />
              </div>
              <div>
                <label htmlFor="object-height" className="block text-sm font-medium text-gray-700 mb-2">
                  Object Height ({unitSystem === "si" ? "m" : "ft"}):
                </label>
                <input
                  type="text"
                  id="object-height"
                  name="objectHeight"
                  value={inputs.objectHeight}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.1"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Object height"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "refraction" && (
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Refraction Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="n1" className="block text-sm font-medium text-gray-700 mb-2">
                  Index of Refraction 1:
                </label>
                <input
                  type="text"
                  id="n1"
                  name="n1"
                  value={inputs.n1}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.0"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Index of refraction 1"
                />
              </div>
              <div>
                <label htmlFor="n2" className="block text-sm font-medium text-gray-700 mb-2">
                  Index of Refraction 2:
                </label>
                <input
                  type="text"
                  id="n2"
                  name="n2"
                  value={inputs.n2}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.5"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Index of refraction 2"
                />
              </div>
              <div>
                <label htmlFor="incident-angle" className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Angle (degrees):
                </label>
                <input
                  type="text"
                  id="incident-angle"
                  name="incidentAngle"
                  value={inputs.incidentAngle}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Incident angle"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateOptics}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={importFromVectorResolver}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Import Angles
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
                {(run.mode === "lens" || run.mode === "mirror") && (
                  <>
                    <p>
                      Focal Length: {run.f.toFixed(2)} {run.unitSystem === "si" ? "m" : "ft"}
                    </p>
                    <p>
                      Object Distance: {run.do.toFixed(2)} {run.unitSystem === "si" ? "m" : "ft"}
                    </p>
                    <p>
                      Object Height: {run.ho.toFixed(2)} {run.unitSystem === "si" ? "m" : "ft"}
                    </p>
                    <p>
                      Image Distance: {run.di.toFixed(2)} {run.unitSystem === "si" ? "m" : "ft"}
                    </p>
                    <p>
                      Image Height: {run.hi.toFixed(2)} {run.unitSystem === "si" ? "m" : "ft"}
                    </p>
                    <p>Magnification: {run.m.toFixed(2)}</p>
                    <p>
                      Image Type: {run.imageType}, {run.orientation}
                    </p>
                  </>
                )}
                {run.mode === "refraction" && (
                  <>
                    <p>Index of Refraction 1: {run.n1.toFixed(2)}</p>
                    <p>Index of Refraction 2: {run.n2.toFixed(2)}</p>
                    <p>Incident Angle: {run.theta1.toFixed(2)}°</p>
                    {run.theta2 !== null ? (
                      <p>Refracted Angle: {run.theta2.toFixed(2)}°</p>
                    ) : (
                      <p>Total Internal Reflection</p>
                    )}
                    {run.criticalAngle && <p>Critical Angle: {run.criticalAngle.toFixed(2)}°</p>}
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

export default OpticsCalculator;
