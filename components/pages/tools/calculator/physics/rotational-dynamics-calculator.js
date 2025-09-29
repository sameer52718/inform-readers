"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [mode, setMode] = useState("scalar");
  const [angleUnit, setAngleUnit] = useState("deg");
  const [shape, setShape] = useState("point");
  const [mass, setMass] = useState("");
  const [angularVelocity, setAngularVelocity] = useState("");
  const [radius, setRadius] = useState("");
  const [inertia, setInertia] = useState("");
  const [forceMagnitude, setForceMagnitude] = useState("");
  const [forceAngle, setForceAngle] = useState("");
  const [forceX, setForceX] = useState("");
  const [forceY, setForceY] = useState("");
  const [positionMagnitude, setPositionMagnitude] = useState("");
  const [positionAngle, setPositionAngle] = useState("");
  const [positionX, setPositionX] = useState("");
  const [positionY, setPositionY] = useState("");
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

  const updateInputs = () => {
    // Handled by React's conditional rendering
  };

  const calculateRotational = () => {
    const m = parseFloat(mass);
    const omega = parseFloat(angularVelocity);
    const r = parseFloat(radius);
    const I_input = parseFloat(inertia);
    const F_mag = parseFloat(forceMagnitude);
    const theta_F = parseFloat(forceAngle);
    const r_mag = parseFloat(positionMagnitude);
    const theta_r = parseFloat(positionAngle);
    const Fx = parseFloat(forceX);
    const Fy = parseFloat(forceY);
    const rx = parseFloat(positionX);
    const ry = parseFloat(positionY);
    const steps = [];

    // Input validation
    if (isNaN(m) || m <= 0) {
      setResults({ error: "Mass must be positive." });
      return;
    }
    if (isNaN(omega)) {
      setResults({ error: "Angular velocity must be a valid number." });
      return;
    }
    if (shape !== "custom" && (isNaN(r) || r <= 0)) {
      setResults({ error: "Radius or length must be positive for selected shape." });
      return;
    }
    if (shape === "custom" && (isNaN(I_input) || I_input <= 0)) {
      setResults({ error: "Moment of inertia must be positive." });
      return;
    }

    let fx, fy, rx_val, ry_val;
    if (mode === "scalar") {
      if (isNaN(F_mag) || F_mag < 0 || isNaN(r_mag) || r_mag < 0 || isNaN(theta_F) || isNaN(theta_r)) {
        setResults({ error: "Force and position magnitudes and angles must be valid." });
        return;
      }
      const forceTheta = angleUnit === "deg" ? (theta_F * Math.PI) / 180 : theta_F;
      const positionTheta = angleUnit === "deg" ? (theta_r * Math.PI) / 180 : theta_r;
      fx = F_mag * Math.cos(forceTheta);
      fy = F_mag * Math.sin(forceTheta);
      rx_val = r_mag * Math.cos(positionTheta);
      ry_val = r_mag * Math.sin(positionTheta);
      steps.push(
        `Force components: F_x = ${F_mag} cos(${theta_F} ${angleUnit}) = ${fx.toFixed(
          2
        )} N, F_y = ${F_mag} sin(${theta_F} ${angleUnit}) = ${fy.toFixed(2)} N`
      );
      steps.push(
        `Position components: r_x = ${r_mag} cos(${theta_r} ${angleUnit}) = ${rx_val.toFixed(
          2
        )} m, r_y = ${r_mag} sin(${theta_r} ${angleUnit}) = ${ry_val.toFixed(2)} m`
      );
    } else {
      if (isNaN(Fx) || isNaN(Fy) || isNaN(rx) || isNaN(ry)) {
        setResults({ error: "Force and position components must be valid." });
        return;
      }
      fx = Fx;
      fy = Fy;
      rx_val = rx;
      ry_val = ry;
      steps.push(`Force components: F_x = ${fx.toFixed(2)} N, F_y = ${fy.toFixed(2)} N`);
      steps.push(`Position components: r_x = ${rx_val.toFixed(2)} m, r_y = ${ry_val.toFixed(2)} m`);
    }

    // Calculate moment of inertia
    let I;
    if (shape === "custom") {
      I = I_input;
      steps.push(`Moment of inertia: I = ${I.toFixed(2)} kg·m² (custom)`);
    } else if (shape === "point") {
      I = m * r * r;
      steps.push(`Moment of inertia (point mass): I = m r² = ${m} × ${r}² = ${I.toFixed(2)} kg·m²`);
    } else if (shape === "disk") {
      I = 0.5 * m * r * r;
      steps.push(`Moment of inertia (disk): I = ½ m r² = ½ × ${m} × ${r}² = ${I.toFixed(2)} kg·m²`);
    } else if (shape === "rod") {
      I = (1 / 12) * m * r * r;
      steps.push(
        `Moment of inertia (rod about center): I = (1/12) m L² = (1/12) × ${m} × ${r}² = ${I.toFixed(
          2
        )} kg·m²`
      );
    }

    // Calculate torque
    const torque = rx_val * fy - ry_val * fx;
    steps.push(
      `Torque: τ = r_x F_y - r_y F_x = ${rx_val.toFixed(2)} × ${fy.toFixed(2)} - ${ry_val.toFixed(
        2
      )} × ${fx.toFixed(2)} = ${torque.toFixed(2)} N·m`
    );

    // Calculate angular momentum
    const angularMomentum = I * omega;
    steps.push(
      `Angular momentum: L = I ω = ${I.toFixed(2)} × ${omega.toFixed(2)} = ${angularMomentum.toFixed(
        2
      )} kg·m²/s`
    );

    // Calculate angular acceleration
    const angularAcceleration = torque / I;
    steps.push(
      `Angular acceleration: α = τ / I = ${torque.toFixed(2)} / ${I.toFixed(
        2
      )} = ${angularAcceleration.toFixed(2)} rad/s²`
    );

    // Calculate rotational kinetic energy
    const rotationalKE = 0.5 * I * omega * omega;
    steps.push(
      `Rotational kinetic energy: KE = ½ I ω² = ½ × ${I.toFixed(2)} × ${omega.toFixed(
        2
      )}² = ${rotationalKE.toFixed(2)} J`
    );

    const result = {
      mode,
      angleUnit,
      shape,
      mass: m,
      radius: shape !== "custom" ? r : null,
      inertia: shape === "custom" ? I_input : I,
      angularVelocity: omega,
      force: { x: fx, y: fy },
      position: { x: rx_val, y: ry_val },
      torque,
      angularMomentum,
      angularAcceleration,
      rotationalKE,
      steps,
      timestamp: new Date().toISOString(),
    };
    setResults(result);
    setHistory([...history, result]);
    plotGraph(fx, fy, rx_val, ry_val, torque);
  };

  const plotGraph = (fx, fy, rx, ry, torque) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#1f2937";
    ctx.fillText(`Force and Position Vectors (Torque Direction: ${torque >= 0 ? "CCW" : "CW"})`, 10, 20);

    const maxX = Math.max(Math.abs(fx), Math.abs(rx), 1);
    const maxY = Math.max(Math.abs(fy), Math.abs(ry), 1);
    const scale = Math.min((canvas.width - 100) / (2 * maxX), (canvas.height - 100) / (2 * maxY));
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(50, cy);
    ctx.lineTo(canvas.width - 50, cy);
    ctx.moveTo(cx, 50);
    ctx.lineTo(cx, canvas.height - 50);
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw pivot point
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#ef4444";
    ctx.fill();

    // Draw position vector
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + rx * scale, cy - ry * scale);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();
    let angle = Math.atan2(-ry, rx);
    ctx.beginPath();
    ctx.moveTo(cx + rx * scale, cy - ry * scale);
    ctx.lineTo(
      cx + rx * scale - 10 * Math.cos(angle - Math.PI / 6),
      cy - ry * scale + 10 * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(cx + rx * scale, cy - ry * scale);
    ctx.lineTo(
      cx + rx * scale - 10 * Math.cos(angle + Math.PI / 6),
      cy - ry * scale + 10 * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Draw force vector (from end of position vector)
    ctx.beginPath();
    ctx.moveTo(cx + rx * scale, cy - ry * scale);
    ctx.lineTo(cx + rx * scale + fx * scale * 0.5, cy - ry * scale - fy * scale * 0.5);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();
    angle = Math.atan2(-fy, fx);
    ctx.beginPath();
    ctx.moveTo(cx + rx * scale + fx * scale * 0.5, cy - ry * scale - fy * scale * 0.5);
    ctx.lineTo(
      cx + rx * scale + fx * scale * 0.5 - 10 * Math.cos(angle - Math.PI / 6),
      cy - ry * scale - fy * scale * 0.5 + 10 * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(cx + rx * scale + fx * scale * 0.5, cy - ry * scale - fy * scale * 0.5);
    ctx.lineTo(
      cx + rx * scale + fx * scale * 0.5 - 10 * Math.cos(angle + Math.PI / 6),
      cy - ry * scale - fy * scale * 0.5 + 10 * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Draw torque direction (curved arrow)
    ctx.beginPath();
    const r = 30;
    const startAngle = torque >= 0 ? 0 : Math.PI;
    const endAngle = torque >= 0 ? Math.PI : 2 * Math.PI;
    ctx.arc(cx, cy, r, startAngle, endAngle, torque >= 0);
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.stroke();
    const arrowAngle = torque >= 0 ? Math.PI : 0;
    ctx.beginPath();
    ctx.moveTo(cx + r * Math.cos(arrowAngle), cy + r * Math.sin(arrowAngle));
    ctx.lineTo(
      cx + r * Math.cos(arrowAngle) - 10 * Math.cos(arrowAngle - Math.PI / 6),
      cy + r * Math.sin(arrowAngle) - 10 * Math.sin(arrowAngle - Math.PI / 6)
    );
    ctx.moveTo(cx + r * Math.cos(arrowAngle), cy + r * Math.sin(arrowAngle));
    ctx.lineTo(
      cx + r * Math.cos(arrowAngle) - 10 * Math.cos(arrowAngle + Math.PI / 6),
      cy + r * Math.sin(arrowAngle) - 10 * Math.sin(arrowAngle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const importFromVectorResolver = () => {
    alert("Import from Vector Resolver not implemented. Please enter force manually.");
  };

  const clearInputs = () => {
    setMass("");
    setAngularVelocity("");
    setRadius("");
    setInertia("");
    setForceMagnitude("");
    setForceAngle("");
    setPositionMagnitude("");
    setPositionAngle("");
    setForceX("");
    setForceY("");
    setPositionX("");
    setPositionY("");
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
      "Run,Shape,Timestamp,Mass,Radius,Inertia,AngularVelocity,ForceX,ForceY,PositionX,PositionY,Torque,AngularMomentum,AngularAcceleration,RotationalKE",
      ...history.map((run, index) => {
        return `${index + 1},${run.shape},${run.timestamp},${run.mass.toFixed(2)},${
          run.radius ? run.radius.toFixed(2) : ""
        },${run.inertia.toFixed(2)},${run.angularVelocity.toFixed(2)},${run.force.x.toFixed(
          2
        )},${run.force.y.toFixed(2)},${run.position.x.toFixed(2)},${run.position.y.toFixed(
          2
        )},${run.torque.toFixed(2)},${run.angularMomentum.toFixed(2)},${run.angularAcceleration.toFixed(
          2
        )},${run.rotationalKE.toFixed(2)}`;
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rotational_dynamics_data.csv";
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
    a.download = "rotational_dynamics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculateRotational();
      if (e.key === "c") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    mass,
    angularVelocity,
    radius,
    inertia,
    forceMagnitude,
    forceAngle,
    positionMagnitude,
    positionAngle,
    forceX,
    forceY,
    positionX,
    positionY,
    mode,
    angleUnit,
    shape,
  ]);

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-5xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Rotational Dynamics Calculator
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
                Input Mode:
              </label>
              <select
                id="mode"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="scalar">Scalar (Magnitude + Angle)</option>
                <option value="vector">Vector Components</option>
              </select>
            </div>
            <div>
              <label htmlFor="angle-unit" className="block text-sm font-medium text-gray-700 mb-1">
                Angle Unit:
              </label>
              <select
                id="angle-unit"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={angleUnit}
                onChange={(e) => setAngleUnit(e.target.value)}
              >
                <option value="deg">Degrees</option>
                <option value="rad">Radians</option>
              </select>
            </div>
            <div>
              <label htmlFor="shape" className="block text-sm font-medium text-gray-700 mb-1">
                Object Shape:
              </label>
              <select
                id="shape"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={shape}
                onChange={(e) => setShape(e.target.value)}
              >
                <option value="point">Point Mass</option>
                <option value="disk">Disk</option>
                <option value="rod">Rod (about center)</option>
                <option value="custom">Custom Inertia</option>
              </select>
            </div>
            <div>
              <label htmlFor="mass" className="block text-sm font-medium text-gray-700 mb-1">
                Mass (kg):
              </label>
              <input
                type="text"
                id="mass"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder="e.g., 2"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="angular-velocity" className="block text-sm font-medium text-gray-700 mb-1">
                Angular Velocity (rad/s):
              </label>
              <input
                type="text"
                id="angular-velocity"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder="e.g., 2"
                value={angularVelocity}
                onChange={(e) => setAngularVelocity(e.target.value)}
              />
            </div>
            {shape !== "custom" && (
              <div>
                <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                  Radius or Length (m):
                </label>
                <input
                  type="text"
                  id="radius"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 0.5"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                />
              </div>
            )}
            {shape === "custom" && (
              <div>
                <label htmlFor="inertia" className="block text-sm font-medium text-gray-700 mb-1">
                  Moment of Inertia (kg·m²):
                </label>
                <input
                  type="text"
                  id="inertia"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 0.25"
                  value={inertia}
                  onChange={(e) => setInertia(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Force</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === "scalar" && (
                <>
                  <div>
                    <label htmlFor="force-magnitude" className="block text-sm font-medium text-gray-700 mb-1">
                      Magnitude (N):
                    </label>
                    <input
                      type="text"
                      id="force-magnitude"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 10"
                      value={forceMagnitude}
                      onChange={(e) => setForceMagnitude(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="force-angle" className="block text-sm font-medium text-gray-700 mb-1">
                      Angle ({angleUnit}):
                    </label>
                    <input
                      type="text"
                      id="force-angle"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 30"
                      value={forceAngle}
                      onChange={(e) => setForceAngle(e.target.value)}
                    />
                  </div>
                </>
              )}
              {mode === "vector" && (
                <>
                  <div>
                    <label htmlFor="force-x" className="block text-sm font-medium text-gray-700 mb-1">
                      x-component (N):
                    </label>
                    <input
                      type="text"
                      id="force-x"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 8.66"
                      value={forceX}
                      onChange={(e) => setForceX(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="force-y" className="block text-sm font-medium text-gray-700 mb-1">
                      y-component (N):
                    </label>
                    <input
                      type="text"
                      id="force-y"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 5"
                      value={forceY}
                      onChange={(e) => setForceY(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Position Vector (from Pivot)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === "scalar" && (
                <>
                  <div>
                    <label
                      htmlFor="position-magnitude"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Magnitude (m):
                    </label>
                    <input
                      type="text"
                      id="position-magnitude"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 0.5"
                      value={positionMagnitude}
                      onChange={(e) => setPositionMagnitude(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="position-angle" className="block text-sm font-medium text-gray-700 mb-1">
                      Angle ({angleUnit}):
                    </label>
                    <input
                      type="text"
                      id="position-angle"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 0"
                      value={positionAngle}
                      onChange={(e) => setPositionAngle(e.target.value)}
                    />
                  </div>
                </>
              )}
              {mode === "vector" && (
                <>
                  <div>
                    <label htmlFor="position-x" className="block text-sm font-medium text-gray-700 mb-1">
                      x-component (m):
                    </label>
                    <input
                      type="text"
                      id="position-x"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 0.5"
                      value={positionX}
                      onChange={(e) => setPositionX(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="position-y" className="block text-sm font-medium text-gray-700 mb-1">
                      y-component (m):
                    </label>
                    <input
                      type="text"
                      id="position-y"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 0"
                      value={positionY}
                      onChange={(e) => setPositionY(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculateRotational}
            >
              Calculate
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={importFromVectorResolver}
            >
              Import from Vector Resolver
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
                  <p>
                    Force: ({results.force.x.toFixed(2)}, {results.force.y.toFixed(2)}) N
                  </p>
                  <p>
                    Position Vector: ({results.position.x.toFixed(2)}, {results.position.y.toFixed(2)}) m
                  </p>
                  <p>Moment of Inertia: {results.inertia.toFixed(2)} kg·m²</p>
                  <p>Torque: {results.torque.toFixed(2)} N·m</p>
                  <p>Angular Momentum: {results.angularMomentum.toFixed(2)} kg·m²/s</p>
                  <p>Angular Acceleration: {results.angularAcceleration.toFixed(2)} rad/s²</p>
                  <p>Rotational Kinetic Energy: {results.rotationalKE.toFixed(2)} J</p>
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
                  Run {index + 1} ({run.shape}, {run.timestamp}):
                </p>
                <p>
                  Mass: {run.mass.toFixed(2)} kg, Angular Velocity: {run.angularVelocity.toFixed(2)} rad/s
                </p>
                <p>
                  Force: ({run.force.x.toFixed(2)}, {run.force.y.toFixed(2)}) N
                </p>
                <p>
                  Position: ({run.position.x.toFixed(2)}, {run.position.y.toFixed(2)}) m
                </p>
                <p>Moment of Inertia: {run.inertia.toFixed(2)} kg·m²</p>
                <p>Torque: {run.torque.toFixed(2)} N·m</p>
                <p>Angular Momentum: {run.angularMomentum.toFixed(2)} kg·m²/s</p>
                <p>Angular Acceleration: {run.angularAcceleration.toFixed(2)} rad/s²</p>
                <p>Rotational KE: {run.rotationalKE.toFixed(2)} J</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
