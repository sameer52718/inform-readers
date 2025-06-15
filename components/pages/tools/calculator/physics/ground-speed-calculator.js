"use client";

import React, { useState, useRef, useEffect } from "react";

const GroundSpeedCalculator = () => {
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    airspeed: "",
    windSpeed: "",
    windAngle: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const knot_to_m_per_s = 0.514444; // knots to m/s

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 400;
    }
  }, []);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const airspeed = parseFloat(inputs.airspeed);
    const windSpeed = parseFloat(inputs.windSpeed);
    const windAngle = parseFloat(inputs.windAngle);
    const steps = [];

    // Unit conversions
    let v_a = airspeed,
      v_w = windSpeed;
    if (unitSystem === "imperial") {
      v_a *= knot_to_m_per_s; // knots to m/s
      v_w *= knot_to_m_per_s; // knots to m/s
      steps.push("Converted airspeed and wind speed (knots to m/s).");
    }

    if (isNaN(v_a) || v_a <= 0 || isNaN(v_w) || v_w < 0 || isNaN(windAngle)) {
      setResults(<p className="text-red-500">Positive airspeed and non-negative wind speed required.</p>);
      return;
    }

    // Calculate ground speed
    const thetaRad = (windAngle * Math.PI) / 180;
    const v_g = Math.sqrt(v_a * v_a + v_w * v_w + 2 * v_a * v_w * Math.cos(thetaRad));
    const phi = (Math.asin((v_w * Math.sin(thetaRad)) / v_g) * 180) / Math.PI;
    steps.push(
      `Ground speed: v_g = √(v_a² + v_w² + 2 v_a v_w cos(θ)) = √(${v_a.toFixed(2)}² + ${v_w.toFixed(
        2
      )}² + 2 × ${v_a.toFixed(2)} × ${v_w.toFixed(2)} × cos(${windAngle.toFixed(2)}°)) = ${v_g.toFixed(
        2
      )} m/s`
    );
    steps.push(
      `Course deviation: φ = arcsin((v_w sin(θ)) / v_g) = arcsin((${v_w.toFixed(2)} × sin(${windAngle.toFixed(
        2
      )}°)) / ${v_g.toFixed(2)}) = ${phi.toFixed(2)}°`
    );

    // Convert back for display
    let v_a_display = airspeed,
      v_w_display = windSpeed,
      v_g_display = v_g;
    if (unitSystem === "imperial") {
      v_g_display /= knot_to_m_per_s; // m/s to knots
      steps.push("Converted ground speed (m/s to knots).");
    }

    const result = {
      unitSystem,
      airspeed: v_a_display,
      windSpeed: v_w_display,
      windAngle,
      groundSpeed: v_g_display,
      courseDeviation: phi,
      timestamp: new Date().toISOString(),
    };

    // Display results
    setResults(
      <div>
        <p>
          Airspeed: {v_a_display.toFixed(2)} {unitSystem === "si" ? "m/s" : "knots"}
        </p>
        <p>
          Wind Speed: {v_w_display.toFixed(2)} {unitSystem === "si" ? "m/s" : "knots"}
        </p>
        <p>Wind Angle: {windAngle.toFixed(2)}°</p>
        <p>
          Ground Speed: {v_g_display.toFixed(2)} {unitSystem === "si" ? "m/s" : "knots"}
        </p>
        <p>Course Deviation: {phi.toFixed(2)}°</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
        {steps.map((step, idx) => (
          <p key={idx} className="text-sm text-gray-700 mb-2">
            {step}
          </p>
        ))}
      </div>
    );

    // Add to history
    setHistory([...history, result]);

    // Plot graph
    plotGraph(result);
  };

  const plotGraph = (result) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#000000";
    ctx.fillText("Velocity Vector Diagram", 10, 20);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const scale = 2; // Pixels per unit (m/s or knots)

    // Convert to SI for calculations
    const v_a = result.unitSystem === "imperial" ? result.airspeed * knot_to_m_per_s : result.airspeed;
    const v_w = result.unitSystem === "imperial" ? result.windSpeed * knot_to_m_per_s : result.windSpeed;
    const v_g = result.unitSystem === "imperial" ? result.groundSpeed * knot_to_m_per_s : result.groundSpeed;
    const thetaRad = (result.windAngle * Math.PI) / 180;

    // Draw vectors
    const vectors = [
      { name: "v_a", x: v_a, y: 0, color: "#10b981" },
      { name: "v_w", x: v_w * Math.cos(thetaRad), y: v_w * Math.sin(thetaRad), color: "#ef4444" },
      { name: "v_g", x: v_a + v_w * Math.cos(thetaRad), y: v_w * Math.sin(thetaRad), color: "#3b82f6" },
    ];

    vectors.forEach((vec) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const px = cx + scale * vec.x;
      const py = cy - scale * vec.y;
      ctx.lineTo(px, py);
      ctx.strokeStyle = vec.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = vec.color;
      ctx.fillText(
        `${vec.name}: ${Math.hypot(vec.x, vec.y).toFixed(2)} ${result.unitSystem === "si" ? "m/s" : "knots"}`,
        px + 10,
        py
      );
    });
  };

  const clearInputs = () => {
    setInputs({
      airspeed: "",
      windSpeed: "",
      windAngle: "",
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
      "Run,UnitSystem,Timestamp,Airspeed,WindSpeed,WindAngle,GroundSpeed,CourseDeviation",
      ...history.map(
        (run, index) => `
        ${index + 1},${run.unitSystem},${run.timestamp},${run.airspeed.toFixed(2)},${run.windSpeed.toFixed(
          2
        )},
        ${run.windAngle.toFixed(2)},${run.groundSpeed.toFixed(2)},${run.courseDeviation.toFixed(2)}
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ground_speed_data.csv";
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
    a.download = "ground_speed_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculate();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className="min-h-screen bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-4xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Ground Speed Calculator</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
              <option value="si">SI (m/s)</option>
              <option value="imperial">Imperial (knots)</option>
            </select>
          </div>
          <div>
            <label htmlFor="airspeed" className="block text-sm font-medium text-gray-700 mb-2">
              Airspeed:
            </label>
            <input
              type="text"
              id="airspeed"
              name="airspeed"
              value={inputs.airspeed}
              onChange={handleInputChange}
              placeholder="e.g., 150 (m/s or knots)"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Airspeed"
            />
          </div>
          <div>
            <label htmlFor="wind-speed" className="block text-sm font-medium text-gray-700 mb-2">
              Wind Speed:
            </label>
            <input
              type="text"
              id="wind-speed"
              name="windSpeed"
              value={inputs.windSpeed}
              onChange={handleInputChange}
              placeholder="e.g., 20 (m/s or knots)"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Wind speed"
            />
          </div>
          <div>
            <label htmlFor="wind-angle" className="block text-sm font-medium text-gray-700 mb-2">
              Wind Angle (degrees):
            </label>
            <input
              type="text"
              id="wind-angle"
              name="windAngle"
              value={inputs.windAngle}
              onChange={handleInputChange}
              placeholder="e.g., 180 (0° = tailwind)"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Wind angle"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculate}
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
                  Run {index + 1} ({run.unitSystem}, {new Date(run.timestamp).toLocaleString()}):
                </p>
                <p>
                  Airspeed: {run.airspeed.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "knots"}
                </p>
                <p>
                  Wind Speed: {run.windSpeed.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "knots"}
                </p>
                <p>Wind Angle: {run.windAngle.toFixed(2)}°</p>
                <p>
                  Ground Speed: {run.groundSpeed.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "knots"}
                </p>
                <p>Course Deviation: {run.courseDeviation.toFixed(2)}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroundSpeedCalculator;
