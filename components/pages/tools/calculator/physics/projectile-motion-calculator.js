"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [velocity, setVelocity] = useState("");
  const [angle, setAngle] = useState("");
  const [height, setHeight] = useState("");
  const [results, setResults] = useState(null);
  const [steps, setSteps] = useState([]);
  const [history, setHistory] = useState([]);
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const trajectoryRef = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  const g = 9.81; // Acceleration due to gravity (m/s²)

  useEffect(() => {
    return () => {
      if (pieChartInstance.current) pieChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, []);

  const calculate = () => {
    const v0 = parseFloat(velocity.trim());
    const theta = parseFloat(angle.trim());
    const y0 = parseFloat(height.trim());

    // Input validation
    if (isNaN(v0) || isNaN(theta) || isNaN(y0)) {
      alert("Please enter valid numbers for velocity, angle, and height.");
      return;
    }
    if (v0 < 0) {
      alert("Initial velocity cannot be negative.");
      return;
    }
    if (theta < 0 || theta > 90) {
      alert("Launch angle must be between 0 and 90 degrees.");
      return;
    }
    if (y0 < 0) {
      alert("Initial height cannot be negative.");
      return;
    }

    // Convert angle to radians
    const thetaRad = (theta * Math.PI) / 180;

    // Calculate components of initial velocity
    const v0x = v0 * Math.cos(thetaRad);
    const v0y = v0 * Math.sin(thetaRad);

    // Calculate time to maximum height
    const tm = v0y / g;

    // Calculate maximum height
    const hmax = y0 + v0y * tm - 0.5 * g * tm * tm;

    // Calculate total time of flight
    const a = -0.5 * g;
    const b = v0y;
    const c = y0;
    const discriminant = b * b - 4 * a * c;
    const tf = (-b + Math.sqrt(discriminant)) / (2 * a);

    // Calculate range
    const range = v0x * tf;

    // Trajectory equation coefficients
    const A = -g / (2 * v0x * v0x);
    const B = Math.tan(thetaRad);
    const C = y0;

    // Energy calculations for pie chart
    const keHorizontal = 0.5 * v0x * v0x;
    const keVertical = 0.5 * v0y * v0y;
    const pe = y0 > 0 ? g * y0 : 0;

    // Prepare results
    const resultData = {
      range: range.toFixed(2),
      maxHeight: hmax.toFixed(2),
      timeOfFlight: tf.toFixed(2),
      trajectory: `y = ${A.toFixed(4)}x² + ${B.toFixed(4)}x + ${C.toFixed(2)}`,
    };

    // Step-by-step calculation
    const calcSteps = [
      `Inputs: v₀ = ${v0} m/s, θ = ${theta}°, y₀ = ${y0} m`,
      `Step 1: Convert angle to radians`,
      `θ_rad = ${theta} × π / 180 = ${thetaRad.toFixed(4)} rad`,
      `Step 2: Calculate velocity components`,
      `v₀x = v₀ × cos(θ_rad) = ${v0} × cos(${thetaRad.toFixed(4)}) = ${v0x.toFixed(2)} m/s`,
      `v₀y = v₀ × sin(θ_rad) = ${v0} × sin(${thetaRad.toFixed(4)}) = ${v0y.toFixed(2)} m/s`,
      `Step 3: Calculate time to maximum height`,
      `t_m = v₀y / g = ${v0y.toFixed(2)} / ${g} = ${tm.toFixed(2)} s`,
      `Step 4: Calculate maximum height`,
      `h_max = y₀ + v₀y × t_m - 0.5 × g × t_m²`,
      `h_max = ${y0} + ${v0y.toFixed(2)} × ${tm.toFixed(2)} - 0.5 × ${g} × (${tm.toFixed(
        2
      )})² = ${hmax.toFixed(2)} m`,
      `Step 5: Calculate time of flight`,
      `Solve: -0.5 × g × t² + v₀y × t + y₀ = 0`,
      `a = -0.5 × ${g} = ${a.toFixed(2)}, b = ${v0y.toFixed(2)}, c = ${y0}`,
      `Discriminant = b² - 4ac = (${v0y.toFixed(2)})² - 4 × (${a.toFixed(
        2
      )}) × ${y0} = ${discriminant.toFixed(2)}`,
      `t_f = (-b + √(discriminant)) / (2a) = ${tf.toFixed(2)} s`,
      `Step 6: Calculate range`,
      `R = v₀x × t_f = ${v0x.toFixed(2)} × ${tf.toFixed(2)} = ${range.toFixed(2)} m`,
      `Step 7: Trajectory equation`,
      `y = (-g / (2 × v₀x²))x² + tan(θ_rad)x + y₀`,
      `y = ${A.toFixed(4)}x² + ${B.toFixed(4)}x + ${C.toFixed(2)}`,
    ];

    setResults(resultData);
    setSteps(calcSteps);

    // Update history
    setHistory([
      ...history,
      {
        inputs: `v₀ = ${v0} m/s, θ = ${theta}°, y₀ = ${y0} m`,
        results: `R = ${resultData.range} m, h_max = ${resultData.maxHeight} m, t_f = ${resultData.timeOfFlight} s`,
        timestamp: new Date().toLocaleString(),
      },
    ]);

    // Update charts
    updatePieChart(keHorizontal, keVertical, pe);
    updateBarChart(range, hmax, tf);
    updateTrajectoryGraph(range, hmax, A, B, C);
  };

  const updatePieChart = (keHorizontal, keVertical, pe) => {
    const canvas = pieChartRef.current;
    if (!canvas) return;

    const total = keHorizontal + keVertical + pe;
    const data = [
      ((keHorizontal / total) * 100).toFixed(1),
      ((keVertical / total) * 100).toFixed(1),
      ((pe / total) * 100).toFixed(1),
    ].map((val) => parseFloat(val));

    if (pieChartInstance.current) pieChartInstance.current.destroy();
    pieChartInstance.current = new Chart(canvas, {
      type: "pie",
      data: {
        labels: ["Horizontal KE", "Vertical KE", "Potential Energy"],
        datasets: [
          {
            data,
            backgroundColor: ["#ef4444", "#f87171", "#22c55e"],
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { color: "#1f2937" } },
        },
      },
    });
  };

  const updateBarChart = (range, maxHeight, timeOfFlight) => {
    const canvas = barChartRef.current;
    if (!canvas) return;

    if (barChartInstance.current) barChartInstance.current.destroy();
    barChartInstance.current = new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["Range (m)", "Max Height (m)", "Time of Flight (s)"],
        datasets: [
          {
            label: "Metrics",
            data: [range, maxHeight, timeOfFlight],
            backgroundColor: ["#ef4444", "#f87171", "#22c55e"],
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#1f2937" },
            grid: { color: "rgba(0, 0, 0, 0.1)" },
          },
          x: { ticks: { color: "#1f2937" } },
        },
        plugins: { legend: { display: false } },
      },
    });
  };

  const updateTrajectoryGraph = (range, maxHeight, A, B, C) => {
    const canvas = trajectoryRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up scaling
    const padding = 40;
    const xMax = range * 1.1;
    const yMax = maxHeight * 1.1;
    const xScale = (canvas.width - 2 * padding) / xMax;
    const yScale = (canvas.height - 2 * padding) / yMax;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 2;
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // Draw trajectory
    ctx.beginPath();
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    for (let x = 0; x <= xMax; x += xMax / 100) {
      const y = A * x * x + B * x + C;
      if (y >= 0) {
        const canvasX = padding + x * xScale;
        const canvasY = canvas.height - padding - y * yScale;
        if (x === 0) ctx.moveTo(canvasX, canvasY);
        else ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

    // Label axes
    ctx.fillStyle = "#1f2937";
    ctx.font = "14px Inter";
    ctx.fillText("x (m)", canvas.width - padding, canvas.height - padding + 20);
    ctx.fillText("y (m)", padding - 20, padding);
  };

  const clearInput = () => {
    setVelocity("");
    setAngle("");
    setHeight("");
    setResults(null);
    setSteps([]);
    setHistory([]);
    if (pieChartInstance.current) pieChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();
    const canvas = trajectoryRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const exportResults = () => {
    if (!results) {
      alert("No results to export.");
      return;
    }
    const resultsText = `
Results:
Range: ${results.range} m
Maximum Height: ${results.maxHeight} m
Time of Flight: ${results.timeOfFlight} s
Trajectory Equation: ${results.trajectory}

Calculation Steps:
${steps.join("\n")}
    `;
    const blob = new Blob([resultsText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projectile_motion_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculate();
      if (e.key === "c") clearInput();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [velocity, angle, height]);

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-4xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Advanced Projectile Motion Calculator
          </h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Enter Projectile Parameters</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
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
              <div className="flex-1">
                <label htmlFor="angle" className="block text-sm font-medium text-gray-700 mb-1">
                  Launch Angle (degrees):
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
              <div className="flex-1">
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
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculate}
            >
              Calculate
            </button>
            <button
              className="flex-1 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all focus:ring-2 focus:ring-gray-500"
              onClick={clearInput}
            >
              Clear
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={exportResults}
            >
              Export
            </button>
          </div>
          {results && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Results</h2>
              <p>Range: {results.range} m</p>
              <p>Maximum Height: {results.maxHeight} m</p>
              <p>Time of Flight: {results.timeOfFlight} s</p>
              <p>Trajectory Equation: {results.trajectory}</p>
            </div>
          )}
          <div className="mb-4">
            <div className="bg-gray-50 p-4 rounded-lg h-64">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Energy Distribution</h2>
              <canvas ref={pieChartRef} />
            </div>
          </div>
          <div className="mb-4">
            <div className="bg-gray-50 p-4 rounded-lg h-64">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Key Metrics Comparison</h2>
              <canvas ref={barChartRef} />
            </div>
          </div>
          <div className="mb-4">
            <div className="bg-gray-50 p-4 rounded-lg h-64">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Trajectory Path</h2>
              <canvas ref={trajectoryRef} />
            </div>
          </div>
          {steps.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Calculation Steps</h2>
              <ul className="list-decimal ml-6 text-gray-600 text-sm">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Calculation History</h2>
            {history.map((entry, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-lg mb-2 hover:bg-gray-200 transition-all">
                <p>Inputs: {entry.inputs}</p>
                <p>Results: {entry.results}</p>
                <p>Time: {entry.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
