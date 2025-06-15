"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import Three.js to avoid SSR issues
const Three = dynamic(() => import("three"), { ssr: false });

export default function Home() {
  const [mode, setMode] = useState("2d");
  const [unit, setUnit] = useState("m");
  const [angleUnit, setAngleUnit] = useState("deg");
  const [view, setView] = useState("2d");
  const [vectors, setVectors] = useState([
    { id: 1, magnitude: "", angleX: "", angleY: "", x: "", y: "", z: "" },
  ]);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const threeCanvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const colors = ["#22d3ee", "#ef4444", "#22c55e"];

  useEffect(() => {
    const canvas = canvasRef.current;
    const threeCanvas = threeCanvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 400;
    }
    if (threeCanvas) {
      threeCanvas.width = 900;
      threeCanvas.height = 400;
    }
  }, []);

  const addVector = () => {
    if (vectors.length >= 3) {
      alert("Maximum 3 vectors allowed.");
      return;
    }
    setVectors([
      ...vectors,
      {
        id: vectors.length + 1,
        magnitude: "",
        angleX: "",
        angleY: "",
        x: "",
        y: "",
        z: "",
      },
    ]);
  };

  const updateVector = (id, field, value) => {
    setVectors(vectors.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const initThreeJS = async () => {
    try {
      if (!Three) throw new Error("Three.js not loaded");
      const scene = new Three.Scene();
      const camera = new Three.PerspectiveCamera(75, 900 / 400, 0.1, 1000);
      const renderer = new Three.WebGLRenderer({ canvas: threeCanvasRef.current, antialias: true });
      renderer.setSize(900, 400);
      renderer.setClearColor(0xf3f4f6);

      camera.position.set(50, 50, 50);
      camera.lookAt(0, 0, 0);

      const axesHelper = new Three.AxesHelper(50);
      scene.add(axesHelper);

      const gridHelper = new Three.GridHelper(100, 10);
      scene.add(gridHelper);

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;

      return true;
    } catch (error) {
      console.error("Three.js init error:", error);
      setResults({ error: "3D mode failed to initialize. Try 2D view." });
      setView("2d");
      return false;
    }
  };

  const animate3D = () => {
    if (!rendererRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestAnimationFrame(animate3D);
  };

  const calculateVectors = async () => {
    const calculatedVectors = [];
    const steps = [];

    for (const v of vectors) {
      const vector = { id: v.id, color: colors[(v.id - 1) % colors.length], unit };
      const mag = parseFloat(v.magnitude);
      const thetaX = parseFloat(v.angleX);
      const thetaY = mode === "3d" ? parseFloat(v.angleY) : 0;
      const x = parseFloat(v.x);
      const y = parseFloat(v.y);
      const z = mode === "3d" ? parseFloat(v.z) : 0;

      if (!isNaN(x) && !isNaN(y) && (mode !== "3d" || !isNaN(z))) {
        vector.components = { x, y, z: mode === "3d" ? z : 0 };
        vector.magnitude = Math.sqrt(x * x + y * y + (mode === "3d" ? z * z : 0));
        vector.angleX = Math.atan2(y, x) * (angleUnit === "deg" ? 180 / Math.PI : 1);
        vector.angleY =
          mode === "3d" ? Math.acos(z / vector.magnitude) * (angleUnit === "deg" ? 180 / Math.PI : 1) : 0;
      } else if (!isNaN(mag) && !isNaN(thetaX) && (mode !== "3d" || !isNaN(thetaY))) {
        if (mag < 0) {
          setResults({ error: `Magnitude for Vector ${v.id} must be non-negative.` });
          return;
        }
        const radX = angleUnit === "deg" ? (thetaX * Math.PI) / 180 : thetaX;
        const radY = mode === "3d" && angleUnit === "deg" ? (thetaY * Math.PI) / 180 : thetaY;
        if (mode === "3d") {
          vector.components = {
            x: mag * Math.cos(radY) * Math.cos(radX),
            y: mag * Math.cos(radY) * Math.sin(radX),
            z: mag * Math.sin(radY),
          };
        } else {
          vector.components = {
            x: mag * Math.cos(radX),
            y: mag * Math.sin(radX),
            z: 0,
          };
        }
        vector.magnitude = mag;
        vector.angleX = thetaX;
        vector.angleY = thetaY;
      } else {
        setResults({
          error: `Provide magnitude and angles or components for Vector ${v.id}.`,
        });
        return;
      }
      calculatedVectors.push(vector);
      steps.push(
        `Vector ${v.id}: Magnitude = ${vector.magnitude.toFixed(2)} ${unit}, θx = ${vector.angleX.toFixed(
          2
        )} ${angleUnit}${
          mode === "3d" ? `, θy = ${vector.angleY.toFixed(2)} ${angleUnit}` : ""
        }, Components = (${vector.components.x.toFixed(2)}, ${vector.components.y.toFixed(2)}${
          mode === "3d" ? `, ${vector.components.z.toFixed(2)}` : ""
        })`
      );
    }

    if (!calculatedVectors.length) return;

    const resultant = {
      components: { x: 0, y: 0, z: 0 },
      unit,
    };
    calculatedVectors.forEach((v) => {
      resultant.components.x += v.components.x;
      resultant.components.y += v.components.y;
      resultant.components.z += v.components.z;
    });
    resultant.magnitude = Math.sqrt(
      resultant.components.x ** 2 + resultant.components.y ** 2 + resultant.components.z ** 2
    );
    resultant.angleX =
      Math.atan2(resultant.components.y, resultant.components.x) * (angleUnit === "deg" ? 180 / Math.PI : 1);
    resultant.angleY =
      mode === "3d"
        ? Math.acos(resultant.components.z / resultant.magnitude) * (angleUnit === "deg" ? 180 / Math.PI : 1)
        : 0;
    steps.push(
      `Resultant: Magnitude = ${resultant.magnitude.toFixed(2)} ${unit}, θx = ${resultant.angleX.toFixed(
        2
      )} ${angleUnit}${
        mode === "3d" ? `, θy = ${resultant.angleY.toFixed(2)} ${angleUnit}` : ""
      }, Components = (${resultant.components.x.toFixed(2)}, ${resultant.components.y.toFixed(2)}${
        mode === "3d" ? `, ${resultant.components.z.toFixed(2)}` : ""
      })`
    );

    const dotProduct = calculatedVectors.reduce(
      (sum, v) =>
        sum +
        v.components.x * resultant.components.x +
        v.components.y * resultant.components.y +
        v.components.z * resultant.components.z,
      0
    );
    steps.push(`Dot Product with Resultant: ${dotProduct.toFixed(2)} ${unit}²`);

    let crossProduct = null;
    if (mode === "3d" && calculatedVectors.length === 2) {
      crossProduct = {
        x:
          calculatedVectors[0].components.y * calculatedVectors[1].components.z -
          calculatedVectors[0].components.z * calculatedVectors[1].components.y,
        y:
          calculatedVectors[0].components.z * calculatedVectors[1].components.x -
          calculatedVectors[0].components.x * calculatedVectors[1].components.z,
        z:
          calculatedVectors[0].components.x * calculatedVectors[1].components.y -
          calculatedVectors[0].components.y * calculatedVectors[1].components.x,
      };
      steps.push(
        `Cross Product (V1 × V2): (${crossProduct.x.toFixed(2)}, ${crossProduct.y.toFixed(
          2
        )}, ${crossProduct.z.toFixed(2)}) ${unit}²`
      );
    }

    setResults({ vectors: calculatedVectors, resultant, dotProduct, crossProduct, steps });

    setHistory([
      ...history,
      {
        vectors: calculatedVectors,
        resultant,
        dotProduct,
        crossProduct,
        unit,
        angleUnit,
        mode,
      },
    ]);

    if (view === "3d") {
      canvasRef.current.style.display = "none";
      threeCanvasRef.current.style.display = "block";
      const initialized = await initThreeJS();
      if (initialized) {
        calculatedVectors.forEach((v) => {
          const geometry = new Three.BufferGeometry();
          geometry.setAttribute(
            "position",
            new Three.Float32BufferAttribute([0, 0, 0, v.components.x, v.components.y, v.components.z], 3)
          );
          const material = new Three.LineBasicMaterial({ color: v.color });
          const line = new Three.Line(geometry, material);
          sceneRef.current.add(line);
        });
        const geometry = new Three.BufferGeometry();
        geometry.setAttribute(
          "position",
          new Three.Float32BufferAttribute(
            [0, 0, 0, resultant.components.x, resultant.components.y, resultant.components.z],
            3
          )
        );
        const material = new Three.LineBasicMaterial({ color: "#1f2937" });
        const line = new Three.Line(geometry, material);
        sceneRef.current.add(line);
        animate3D();
      }
    } else {
      canvasRef.current.style.display = "block";
      threeCanvasRef.current.style.display = "none";
      plotGraph(calculatedVectors, resultant);
    }
  };

  const plotGraph = (vectors, resultant) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#1f2937";
    ctx.fillText("Vector Components (2D Projection)", 10, 20);

    const maxX = Math.max(
      ...vectors.map((v) => Math.abs(v.components.x)),
      Math.abs(vectors.reduce((sum, v) => sum + v.components.x, 0)),
      10
    );
    const maxY = Math.max(
      ...vectors.map((v) => Math.abs(v.components.y)),
      Math.abs(vectors.reduce((sum, v) => sum + v.components.y, 0)),
      10
    );
    const scale = Math.min((canvas.width - 100) / (2 * maxX), (canvas.height - 100) / (2 * maxY));

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(50, cy);
    ctx.lineTo(canvas.width - 50, cy);
    ctx.moveTo(cx, 50);
    ctx.lineTo(cx, canvas.height - 50);
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 1;
    ctx.stroke();

    vectors.forEach((v) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + v.components.x * scale, cy - v.components.y * scale);
      ctx.strokeStyle = v.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      const angle = Math.atan2(-v.components.y, v.components.x);
      ctx.beginPath();
      ctx.moveTo(cx + v.components.x * scale, cy - v.components.y * scale);
      ctx.lineTo(
        cx + v.components.x * scale - 10 * Math.cos(angle - Math.PI / 6),
        cy - v.components.y * scale + 10 * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(cx + v.components.x * scale, cy - v.components.y * scale);
      ctx.lineTo(
        cx + v.components.x * scale - 10 * Math.cos(angle + Math.PI / 6),
        cy - v.components.y * scale + 10 * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    });

    const rx = vectors.reduce((sum, v) => sum + v.components.x, 0);
    const ry = vectors.reduce((sum, v) => sum + v.components.y, 0);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + rx * scale, cy - ry * scale);
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 3;
    ctx.stroke();
    const angle = Math.atan2(-ry, rx);
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
  };

  const clearInputs = () => {
    setVectors([{ id: 1, magnitude: "", angleX: "", angleY: "", x: "", y: "", z: "" }]);
    setResults(null);
    setHistory([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    threeCanvasRef.current.style.display = "none";
    canvasRef.current.style.display = "block";
    if (sceneRef.current) {
      while (sceneRef.current.children.length > 0) {
        sceneRef.current.remove(sceneRef.current.children[0]);
      }
    }
  };

  const exportCSV = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const csv = [
      "Run,Mode,Vector,Magnitude,Unit,AngleX,AngleY,AngleUnit,X,Y,Z,ResultantMag,ResultantX,ResultantY,ResultantZ",
      ...history.flatMap((run, index) =>
        run.vectors.map(
          (v) =>
            `${index + 1},${run.mode},${v.id},` +
            `${v.magnitude.toFixed(2)},${v.unit},` +
            `${v.angleX.toFixed(2)},${run.mode === "3d" ? v.angleY.toFixed(2) : ""},${run.angleUnit},` +
            `${v.components.x.toFixed(2)},${v.components.y.toFixed(2)},${
              run.mode === "3d" ? v.components.z.toFixed(2) : ""
            },` +
            `${run.resultant.magnitude.toFixed(2)},` +
            `${run.resultant.components.x.toFixed(2)},${run.resultant.components.y.toFixed(2)},${
              run.mode === "3d" ? run.resultant.components.z.toFixed(2) : ""
            }`
        )
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vector_data.csv";
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
    a.download = "vector_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculateVectors();
      if (e.key === "c") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [vectors, mode, unit, angleUnit, view]);

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-4xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Super Advanced Vector Resolver
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
                Mode:
              </label>
              <select
                id="mode"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="2d">2D</option>
                <option value="3d">3D</option>
              </select>
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit:
              </label>
              <select
                id="unit"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="m">m</option>
                <option value="m/s">m/s</option>
                <option value="N">N</option>
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
              <label htmlFor="view" className="block text-sm font-medium text-gray-700 mb-1">
                View:
              </label>
              <select
                id="view"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={view}
                onChange={(e) => setView(e.target.value)}
              >
                <option value="2d">2D Canvas</option>
                <option value="3d">3D (Three.js)</option>
              </select>
            </div>
          </div>
          <div>
            {vectors.map((vector) => (
              <div key={vector.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                <h2 className="text-xl font-semibold text-red-500 mb-2">Vector {vector.id}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor={`magnitude-${vector.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Magnitude:
                    </label>
                    <input
                      type="text"
                      id={`magnitude-${vector.id}`}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 10"
                      value={vector.magnitude}
                      onChange={(e) => updateVector(vector.id, "magnitude", e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`angle-x-${vector.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Angle (θx):
                    </label>
                    <input
                      type="text"
                      id={`angle-x-${vector.id}`}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 30"
                      value={vector.angleX}
                      onChange={(e) => updateVector(vector.id, "angleX", e.target.value)}
                    />
                  </div>
                  {mode === "3d" && (
                    <div>
                      <label
                        htmlFor={`angle-y-${vector.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Angle (θy):
                      </label>
                      <input
                        type="text"
                        id={`angle-y-${vector.id}`}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., 0"
                        value={vector.angleY}
                        onChange={(e) => updateVector(vector.id, "angleY", e.target.value)}
                      />
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor={`x-${vector.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      x-component:
                    </label>
                    <input
                      type="text"
                      id={`x-${vector.id}`}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="Optional"
                      value={vector.x}
                      onChange={(e) => updateVector(vector.id, "x", e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`y-${vector.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      y-component:
                    </label>
                    <input
                      type="text"
                      id={`y-${vector.id}`}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="Optional"
                      value={vector.y}
                      onChange={(e) => updateVector(vector.id, "y", e.target.value)}
                    />
                  </div>
                  {mode === "3d" && (
                    <div>
                      <label
                        htmlFor={`z-${vector.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        z-component:
                      </label>
                      <input
                        type="text"
                        id={`z-${vector.id}`}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                        placeholder="Optional"
                        value={vector.z}
                        onChange={(e) => updateVector(vector.id, "z", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={addVector}
            >
              Add Vector
            </button>
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculateVectors}
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
            style={{ display: view === "2d" ? "block" : "none" }}
          />
          <canvas
            ref={threeCanvasRef}
            className="w-full max-h-[400px] bg-gray-50 border border-gray-200 rounded-lg mb-4"
            style={{ display: view === "3d" ? "block" : "none" }}
          />
          {results && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              {results.error ? (
                <p className="text-red-500">{results.error}</p>
              ) : (
                <>
                  {results.vectors.map((v) => (
                    <div key={v.id}>
                      <p>
                        Vector {v.id}: Magnitude = {v.magnitude.toFixed(2)} {unit}, θx = {v.angleX.toFixed(2)}{" "}
                        {angleUnit}
                        {mode === "3d" ? `, θy = ${v.angleY.toFixed(2)} ${angleUnit}` : ""}
                      </p>
                      <p>
                        Components = ({v.components.x.toFixed(2)}, {v.components.y.toFixed(2)}
                        {mode === "3d" ? `, ${v.components.z.toFixed(2)}` : ""}) {unit}
                      </p>
                    </div>
                  ))}
                  <p>
                    Resultant: Magnitude = {results.resultant.magnitude.toFixed(2)} {unit}, θx ={" "}
                    {results.resultant.angleX.toFixed(2)} {angleUnit}
                    {mode === "3d" ? `, θy = ${results.resultant.angleY.toFixed(2)} ${angleUnit}` : ""}
                  </p>
                  <p>
                    Components = ({results.resultant.components.x.toFixed(2)},{" "}
                    {results.resultant.components.y.toFixed(2)}
                    {mode === "3d" ? `, ${results.resultant.components.z.toFixed(2)}` : ""}) {unit}
                  </p>
                  <p>
                    Dot Product: {results.dotProduct.toFixed(2)} {unit}²
                  </p>
                  {results.crossProduct && (
                    <p>
                      Cross Product: ({results.crossProduct.x.toFixed(2)}, {results.crossProduct.y.toFixed(2)}
                      , {results.crossProduct.z.toFixed(2)}) {unit}²
                    </p>
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
                  Run {index + 1} ({run.mode}):
                </p>
                {run.vectors.map((v) => (
                  <p key={v.id}>
                    Vector {v.id}: Magnitude = {v.magnitude.toFixed(2)} {v.unit}, θx = {v.angleX.toFixed(2)}{" "}
                    {run.angleUnit}
                    {run.mode === "3d" ? `, θy = ${v.angleY.toFixed(2)} ${run.angleUnit}` : ""}, Components =
                    ({v.components.x.toFixed(2)}, {v.components.y.toFixed(2)}
                    {run.mode === "3d" ? `, ${v.components.z.toFixed(2)}` : ""})
                  </p>
                ))}
                <p>
                  Resultant: Magnitude = {run.resultant.magnitude.toFixed(2)} {run.resultant.unit}, θx ={" "}
                  {run.resultant.angleX.toFixed(2)} {run.angleUnit}
                  {run.mode === "3d" ? `, θy = ${run.resultant.angleY.toFixed(2)} ${run.angleUnit}` : ""},
                  Components = ({run.resultant.components.x.toFixed(2)},{" "}
                  {run.resultant.components.y.toFixed(2)}
                  {run.mode === "3d" ? `, ${run.resultant.components.z.toFixed(2)}` : ""})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
