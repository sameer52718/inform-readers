"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [velocity, setVelocity] = useState("");
  const [angle, setAngle] = useState("");
  const [height, setHeight] = useState("");
  const [gravity, setGravity] = useState("");
  const [drag, setDrag] = useState("0");
  const [animSpeed, setAnimSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const animTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 850;
      canvas.height = 500;
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const toggleAnimation = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      animate(trajectory, scale, t, results);
    }
  };

  const resetAnimation = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    setIsPaused(false);
    animTimeRef.current = 0;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setResults(null);
  };

  const clearAll = () => {
    resetAnimation();
    setVelocity("");
    setAngle("");
    setHeight("");
    setGravity("");
    setDrag("0");
    setAnimSpeed(1);
    setHistory([]);
  };

  const startVisualization = () => {
    const v0 = parseFloat(velocity);
    const theta = parseFloat(angle);
    const y0 = parseFloat(height) || 0;
    const g = parseFloat(gravity) || 9.81;
    const k = parseFloat(drag);

    // Validate inputs
    if (isNaN(v0) || isNaN(theta) || isNaN(y0) || v0 < 0 || theta < 0 || theta > 90 || y0 < 0) {
      setResults({ error: "Please enter valid inputs (velocity ≥ 0, 0 ≤ angle ≤ 90, height ≥ 0)." });
      return;
    }

    // Convert angle to radians
    const thetaRad = (theta * Math.PI) / 180;
    let vx = v0 * Math.cos(thetaRad);
    let vy = v0 * Math.sin(thetaRad);
    let x = 0;
    let y = y0;

    // Calculate approximate time of flight and range (without drag)
    const timeNoDrag = (vy + Math.sqrt(vy * vy + 2 * g * y0)) / g;
    const rangeNoDrag = vx * timeNoDrag;
    const maxHeightNoDrag = y0 + (vy * vy) / (2 * g);

    // Numerical integration for drag
    const dt = 0.01;
    let t = 0;
    const trajectory = [{ x: 0, y: y0, vx, vy }];
    let maxHeight = y0;
    let range = 0;

    if (k > 0) {
      while (y >= 0) {
        const ax = -k * vx;
        const ay = -g - k * vy;
        vx += ax * dt;
        vy += ay * dt;
        x += vx * dt;
        y += vy * dt;
        t += dt;
        trajectory.push({ x, y, vx, vy });
        maxHeight = Math.max(maxHeight, y);
        if (y >= 0) range = x;
      }
    } else {
      while (y >= 0) {
        x = vx * t;
        y = y0 + vy * t - 0.5 * g * t * t;
        t += dt;
        trajectory.push({ x, y, vx, vy: vy - g * t });
        maxHeight = Math.max(maxHeight, y);
        if (y >= 0) range = x;
      }
    }

    // Set results
    setResults({ time: t.toFixed(2), range: range.toFixed(2), maxHeight: maxHeight.toFixed(2) });

    // Add to history
    setHistory([
      ...history,
      { velocity: v0, angle: theta, height: y0, gravity: g, drag: k, time: t, range, maxHeight },
    ]);

    // Scale factors
    const scaleX = canvasRef.current.width / (range * 1.2);
    const scaleY = canvasRef.current.height / (maxHeight * 1.5);
    const scale = Math.min(scaleX, scaleY);

    // Reset animation
    resetAnimation();
    animate(trajectory, scale, t, {
      time: t.toFixed(2),
      range: range.toFixed(2),
      maxHeight: maxHeight.toFixed(2),
    });
  };

  const animate = (trajectory, scale, totalTime, results) => {
    if (isPaused || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const dt = 0.01;
    const animDt = dt * animSpeed;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw grid
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvasRef.current.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasRef.current.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvasRef.current.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasRef.current.width, i);
      ctx.stroke();
    }

    // Draw ground
    ctx.beginPath();
    ctx.moveTo(0, canvasRef.current.height - 20);
    ctx.lineTo(canvasRef.current.width, canvasRef.current.height - 20);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw trajectory
    ctx.beginPath();
    ctx.moveTo(0, canvasRef.current.height - 20 - (parseFloat(height) || 0) * scale);
    for (const point of trajectory) {
      if (point.y >= 0) {
        const px = point.x * scale;
        const py = canvasRef.current.height - 20 - point.y * scale;
        ctx.lineTo(px, py);
      }
    }
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw max height and range annotations
    ctx.fillStyle = "#1f2937";
    ctx.font = "12px Inter";
    ctx.fillText(`Max Height: ${results.maxHeight} m`, 10, 30);
    ctx.fillText(`Range: ${results.range} m`, canvasRef.current.width - 100, canvasRef.current.height - 30);

    // Draw projectile and vectors
    const index = Math.min(Math.floor(animTimeRef.current / dt), trajectory.length - 1);
    const { x: px, y: py, vx: pvx, vy: pvy } = trajectory[index];
    if (py >= 0) {
      const canvasX = px * scale;
      const canvasY = canvasRef.current.height - 20 - py * scale;

      // Projectile
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#dc2626";
      ctx.fill();

      // Velocity vector
      ctx.beginPath();
      ctx.moveTo(canvasX, canvasY);
      ctx.lineTo(canvasX + pvx * scale * 0.5, canvasY - pvy * scale * 0.5);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Acceleration vector
      const ax = parseFloat(drag) > 0 ? -parseFloat(drag) * pvx : 0;
      const ay = -(parseFloat(gravity) || 9.81) - (parseFloat(drag) > 0 ? parseFloat(drag) * pvy : 0);
      ctx.beginPath();
      ctx.moveTo(canvasX, canvasY);
      ctx.lineTo(canvasX + ax * scale * 0.5, canvasY - ay * scale * 0.5);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Update time
    animTimeRef.current += animDt;

    // Continue animation
    if (animTimeRef.current <= totalTime) {
      animationIdRef.current = requestAnimationFrame(() => animate(trajectory, scale, totalTime, results));
    }
  };

  const exportCSV = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const csv = [
      "Velocity (m/s),Angle (deg),Height (m),Gravity (m/s²),Drag,Time (s),Range (m),Max Height (m)",
      ...history.map(
        (item) =>
          `${item.velocity},${item.angle},${item.height},${item.gravity},${item.drag},${item.time.toFixed(
            2
          )},${item.range.toFixed(2)},${item.maxHeight.toFixed(2)}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projectile_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "trajectory_snapshot.png";
    a.click();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") startVisualization();
      if (e.key === "c") clearAll();
      if (e.key === "p") toggleAnimation();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [velocity, angle, height, gravity, drag, animSpeed]);

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-4xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Advanced Projectile Motion Visualizer
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="velocity" className="block text-sm font-medium text-gray-700 mb-1">
                Initial Velocity (m/s):
              </label>
              <input
                type="text"
                id="velocity"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder="e.g., 20"
                value={velocity}
                onChange={(e) => setVelocity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="angle" className="block text-sm font-medium text-gray-700 mb-1">
                Angle (degrees):
              </label>
              <input
                type="text"
                id="angle"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder="e.g., 45"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Initial Height (m):
              </label>
              <input
                type="text"
                id="height"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder="e.g., 0"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="gravity" className="block text-sm font-medium text-gray-700 mb-1">
                Gravity (m/s²):
              </label>
              <input
                type="text"
                id="gravity"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder="e.g., 9.81"
                value={gravity}
                onChange={(e) => setGravity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="drag" className="block text-sm font-medium text-gray-700 mb-1">
                Air Resistance:
              </label>
              <select
                id="drag"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={drag}
                onChange={(e) => setDrag(e.target.value)}
              >
                <option value="0">None</option>
                <option value="0.1">Light (k = 0.1)</option>
                <option value="0.5">Medium (k = 0.5)</option>
                <option value="1">Heavy (k = 1)</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="anim-speed" className="block text-sm font-medium text-gray-700 mb-1">
              Animation Speed: <span>{animSpeed}x</span>
            </label>
            <input
              type="range"
              id="anim-speed"
              min="0.5"
              max="3"
              step="0.1"
              value={animSpeed}
              onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={startVisualization}
            >
              Visualize
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={toggleAnimation}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={resetAnimation}
            >
              Reset
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={exportCSV}
            >
              Export CSV
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={exportPNG}
            >
              Export PNG
            </button>
            <button
              className="flex-1 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all focus:ring-2 focus:ring-gray-500"
              onClick={clearAll}
            >
              Clear
            </button>
          </div>
          <canvas
            ref={canvasRef}
            className="w-full max-h-[500px] bg-white border border-gray-200 rounded-lg mb-4"
          />
          {results && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              {results.error ? (
                <p className="text-red-500">{results.error}</p>
              ) : (
                <>
                  <p>Time of Flight: {results.time} s</p>
                  <p>Range: {results.range} m</p>
                  <p>Maximum Height: {results.maxHeight} m</p>
                </>
              )}
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Calculation History</h2>
            {history.map((item, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-lg mb-2 hover:bg-gray-200 transition-all">
                <p>
                  Run {index + 1}: v={item.velocity} m/s, θ={item.angle}°, h={item.height} m, g={item.gravity}{" "}
                  m/s², drag={item.drag}
                </p>
                <p>
                  Time: {item.time.toFixed(2)} s, Range: {item.range.toFixed(2)} m, Max Height:{" "}
                  {item.maxHeight.toFixed(2)} m
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
