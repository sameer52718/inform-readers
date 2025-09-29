"use client";

import React, { useState, useRef, useEffect } from "react";

const CarJumpDistanceCalculator = () => {
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    velocity: "",
    angle: "",
    height: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const g = 9.81; // m/s²
  const ft_to_m = 0.3048; // ft to m
  const mph_to_m_per_s = 0.44704; // mph to m/s

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 400;
  }, []);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const { velocity, angle, height } = inputs;
    const v = parseFloat(velocity);
    const theta = parseFloat(angle);
    const h = parseFloat(height);
    const steps = [];

    let v_si = v,
      h_si = h;
    if (unitSystem === "imperial") {
      v_si *= mph_to_m_per_s;
      h_si *= ft_to_m;
      steps.push("Converted velocity (mph to m/s), height (ft to m).");
    }

    if (isNaN(v_si) || v_si <= 0 || isNaN(theta) || theta < 0 || theta >= 90 || isNaN(h_si) || h_si < 0) {
      setResults(<p className="text-red-500">Positive v, h, and θ (0–90°) required.</p>);
      return;
    }

    const thetaRad = (theta * Math.PI) / 180;
    const v_x = v_si * Math.cos(thetaRad);
    const v_y = v_si * Math.sin(thetaRad);
    const a = -0.5 * g;
    const b = v_y;
    const c = h_si;
    const discriminant = b * b - 4 * a * c;
    const t = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x = v_x * t;
    const maxHeight = h_si + (v_y * v_y) / (2 * g);
    steps.push(
      `Initial velocities: v_x = v cos(θ) = ${v_si.toFixed(2)} × cos(${theta.toFixed(2)}°) = ${v_x.toFixed(
        2
      )} m/s`
    );
    steps.push(`v_y = v sin(θ) = ${v_si.toFixed(2)} × sin(${theta.toFixed(2)}°) = ${v_y.toFixed(2)} m/s`);
    steps.push(`Time of flight: Solve 0 = h + v_y t - (1/2) g t^2 => t = ${t.toFixed(2)} s`);
    steps.push(`Horizontal distance: x = v_x t = ${v_x.toFixed(2)} × ${t.toFixed(2)} = ${x.toFixed(2)} m`);
    steps.push(
      `Maximum height: h_max = h + v_y^2/(2g) = ${h_si.toFixed(2)} + ${v_y.toFixed(2)}^2/(2 × ${g.toFixed(
        2
      )}) = ${maxHeight.toFixed(2)} m`
    );

    let x_display = x,
      maxHeight_display = maxHeight;
    if (unitSystem === "imperial") {
      x_display /= ft_to_m;
      maxHeight_display /= ft_to_m;
      steps.push("Converted distance and height (m to ft).");
    }

    const result = {
      unitSystem,
      velocity: v,
      angle: theta,
      height: h,
      distance: x_display,
      timeOfFlight: t,
      maxHeight: maxHeight_display,
      timestamp: new Date().toISOString(),
    };

    setResults(
      <div>
        <p>
          Initial Velocity: {v.toFixed(2)} {unitSystem === "si" ? "m/s" : "mph"}
        </p>
        <p>Ramp Angle: {theta.toFixed(2)}°</p>
        <p>
          Ramp Height: {h.toFixed(2)} {unitSystem === "si" ? "m" : "ft"}
        </p>
        <p>
          Horizontal Distance: {x_display.toFixed(2)} {unitSystem === "si" ? "m" : "ft"}
        </p>
        <p>Time of Flight: {t.toFixed(2)} s</p>
        <p>
          Maximum Height: {maxHeight_display.toFixed(2)} {unitSystem === "si" ? "m" : "ft"}
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Solution Steps</h2>
        {steps.map((step, idx) => (
          <p key={idx} className="text-sm text-gray-700 mb-2">
            {step}
          </p>
        ))}
      </div>
    );

    setHistory([...history, result]);
    plotGraph(result);
  };

  const plotGraph = (result) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#000000";
    ctx.fillText("Trajectory (x vs y)", 10, 20);

    const cx = canvasRef.current.width / 2;
    const cy = canvasRef.current.height / 2;
    const plotWidth = canvasRef.current.width - 100;
    const plotHeight = canvasRef.current.height - 100;

    const v_si = unitSystem === "imperial" ? result.velocity * mph_to_m_per_s : result.velocity;
    const h_si = unitSystem === "imperial" ? result.height * ft_to_m : result.height;
    const x_si = unitSystem === "imperial" ? result.distance * ft_to_m : result.distance;
    const maxH_si = unitSystem === "imperial" ? result.maxHeight * ft_to_m : result.maxHeight;
    const thetaRad = (result.angle * Math.PI) / 180;
    const v_x = v_si * Math.cos(thetaRad);
    const v_y = v_si * Math.sin(thetaRad);

    const points = 100;
    const dt = result.timeOfFlight / points;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const t = i * dt;
      const x = v_x * t;
      const y = h_si + v_y * t - 0.5 * g * t * t;
      const px = cx - plotWidth / 2 + (x / x_si) * plotWidth;
      const py = cy + plotHeight / 2 - (y / maxH_si) * plotHeight;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    const px = cx - plotWidth / 2 + plotWidth;
    const py = cy + plotHeight / 2;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#10b981";
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.fillText(`x=${result.distance.toFixed(2)} ${unitSystem === "si" ? "m" : "ft"}`, px - 100, py - 20);
    ctx.fillText(
      `Distance (${unitSystem === "si" ? "m" : "ft"})`,
      cx + plotWidth / 2,
      cy + plotHeight / 2 + 20
    );
    ctx.fillText(
      `Height (${unitSystem === "si" ? "m" : "ft"})`,
      cx - plotWidth / 2 - 20,
      cy - plotHeight / 2
    );
  };

  const clearInputs = () => {
    setInputs({ velocity: "", angle: "", height: "" });
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
      "Run,UnitSystem,Timestamp,Velocity,Angle,Height,Distance,TimeOfFlight,MaxHeight",
      ...history.map(
        (run, idx) =>
          `${idx + 1},${run.unitSystem},${run.timestamp},${run.velocity.toFixed(2)},${run.angle.toFixed(
            2
          )},${run.height.toFixed(2)},${run.distance.toFixed(2)},${run.timeOfFlight.toFixed(
            2
          )},${run.maxHeight.toFixed(2)}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "car_jump_distance_data.csv";
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
    a.download = "car_jump_distance_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculate();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className=" bg-gray-50 flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Car Jump Distance Calculator</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit System:</label>
            <select
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Unit system"
            >
              <option value="si">SI (m, m/s)</option>
              <option value="imperial">Imperial (ft, mph)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Initial Velocity:</label>
            <input
              type="text"
              name="velocity"
              value={inputs.velocity}
              onChange={handleInputChange}
              placeholder={`e.g., 20 (${unitSystem === "si" ? "m/s" : "mph"})`}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Initial velocity"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ramp Angle (degrees):</label>
            <input
              type="text"
              name="angle"
              value={inputs.angle}
              onChange={handleInputChange}
              placeholder="e.g., 30"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Ramp angle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ramp Height:</label>
            <input
              type="text"
              name="height"
              value={inputs.height}
              onChange={handleInputChange}
              placeholder={`e.g., 2 (${unitSystem === "si" ? "m" : "ft"})`}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Ramp height"
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
        <div className="p-4 bg-gray-100 rounded-lg mb-4">{results}</div>
        <div className="p-4 bg-gray-100 rounded-lg max-h-52 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Calculation History</h2>
          <div>
            {history.map((run, idx) => (
              <div key={idx} className="p-2 mb-2 bg-white rounded-lg shadow-sm">
                <p>
                  Run {idx + 1} ({run.unitSystem}, {new Date(run.timestamp).toLocaleString()}):
                </p>
                <p>
                  Initial Velocity: {run.velocity.toFixed(2)} {run.unitSystem === "si" ? "m/s" : "mph"}
                </p>
                <p>Ramp Angle: {run.angle.toFixed(2)}°</p>
                <p>
                  Ramp Height: {run.height.toFixed(2)} {run.unitSystem === "si" ? "m" : "ft"}
                </p>
                <p>
                  Horizontal Distance: {run.distance.toFixed(2)} {run.unitSystem === "si" ? "m" : "ft"}
                </p>
                <p>Time of Flight: {run.timeOfFlight.toFixed(2)} s</p>
                <p>
                  Maximum Height: {run.maxHeight.toFixed(2)} {run.unitSystem === "si" ? "m" : "ft"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarJumpDistanceCalculator;
