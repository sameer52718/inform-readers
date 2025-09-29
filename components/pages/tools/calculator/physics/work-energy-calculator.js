"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    force: "",
    distance: "",
    angle: "",
    mass: "",
    velocity: "",
    height: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const constants = {
    g_si: 9.81, // m/s²
    g_imperial: 32.174, // ft/s²
    ft_to_m: 0.3048, // ft to m
    lb_to_kg: 0.453592, // lb to kg
    lbf_to_N: 4.44822, // lbf to N
    mph_to_m_per_s: 0.44704, // mph to m/s
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 400;
    }
  }, []);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const calculate = () => {
    const { force, distance, angle, mass, velocity, height } = inputs;
    const parsed = {
      force: parseFloat(force),
      distance: parseFloat(distance),
      angle: parseFloat(angle) || 0,
      mass: parseFloat(mass),
      velocity: parseFloat(velocity),
      height: parseFloat(height),
    };
    const steps = [];
    let { g_si, g_imperial, ft_to_m, lb_to_kg, lbf_to_N, mph_to_m_per_s } = constants;

    let F = parsed.force,
      d = parsed.distance,
      m = parsed.mass,
      v = parsed.velocity,
      h = parsed.height,
      g = unitSystem === "si" ? g_si : g_imperial;

    if (unitSystem === "imperial") {
      if (!isNaN(F)) F *= lbf_to_N;
      if (!isNaN(d)) d *= ft_to_m;
      if (!isNaN(m)) m *= lb_to_kg;
      if (!isNaN(v)) v *= mph_to_m_per_s;
      if (!isNaN(h)) h *= ft_to_m;
      steps.push(
        "Converted force (lbf to N), distance (ft to m), mass (lb to kg), velocity (mph to m/s), height (ft to m)."
      );
    }

    if (isNaN(m) || m <= 0) {
      setResults({ error: "Positive mass required." });
      return;
    }

    let work = 0,
      ke = 0,
      pe = 0,
      total_energy = 0;
    if (!isNaN(F) && !isNaN(d)) {
      if (isNaN(parsed.angle) || parsed.angle < 0 || parsed.angle > 180) {
        setResults({ error: "Angle must be between 0 and 180 degrees." });
        return;
      }
      work = F * d * Math.cos((parsed.angle * Math.PI) / 180);
      steps.push(
        `Work: W = F d cos(θ) = ${F.toFixed(2)} × ${d.toFixed(2)} × cos(${parsed.angle.toFixed(
          2
        )}°) = ${work.toFixed(2)} J`
      );
    } else if (!isNaN(F) !== !isNaN(d)) {
      setResults({ error: "Both force and distance required for work calculation." });
      return;
    }

    if (!isNaN(v)) {
      ke = 0.5 * m * v * v;
      steps.push(
        `Kinetic energy: KE = (1/2) m v² = 0.5 × ${m.toFixed(2)} × ${v.toFixed(2)}² = ${ke.toFixed(2)} J`
      );
    }

    if (!isNaN(h)) {
      pe = m * g * h;
      steps.push(
        `Potential energy: PE = m g h = ${m.toFixed(2)} × ${g.toFixed(2)} × ${h.toFixed(2)} = ${pe.toFixed(
          2
        )} J`
      );
    }

    total_energy = ke + pe;
    steps.push(
      `Total mechanical energy: E = KE + PE = ${ke.toFixed(2)} + ${pe.toFixed(2)} = ${total_energy.toFixed(
        2
      )} J`
    );

    let work_display = work,
      ke_display = ke,
      pe_display = pe,
      total_energy_display = total_energy;
    let F_display = parsed.force,
      d_display = parsed.distance,
      m_display = parsed.mass,
      v_display = parsed.velocity,
      h_display = parsed.height;
    if (unitSystem === "imperial") {
      work_display /= lbf_to_N * ft_to_m;
      ke_display /= lbf_to_N * ft_to_m;
      pe_display /= lbf_to_N * ft_to_m;
      total_energy_display /= lbf_to_N * ft_to_m;
      steps.push("Converted energies (J to ft·lbf).");
    }

    const result = {
      unitSystem,
      force: F_display || 0,
      distance: d_display || 0,
      angle: parsed.angle || 0,
      mass: m_display,
      velocity: v_display || 0,
      height: h_display || 0,
      work: work_display,
      kineticEnergy: ke_display,
      potentialEnergy: pe_display,
      totalEnergy: total_energy_display,
      steps,
      timestamp: new Date().toISOString(),
    };

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
    ctx.fillText("Energy Bar Chart", 10, 20);

    const cx = canvas.width / 4;
    const cy = canvas.height - 50;
    const barWidth = 80;
    const maxHeight = 300;
    const scale = maxHeight / Math.max(result.kineticEnergy + result.potentialEnergy || 1, 1);

    ctx.beginPath();
    ctx.moveTo(cx - 50, cy);
    ctx.lineTo(cx + 300, cy);
    ctx.moveTo(cx - 50, cy - maxHeight);
    ctx.lineTo(cx - 50, cy);
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillText("Energy", cx - 80, cy - maxHeight + 20);
    ctx.fillText(unitSystem === "si" ? "J" : "ft·lbf", cx - 80, cy - maxHeight / 2);

    const energies = [
      { value: result.kineticEnergy, label: "KE", color: "#22c55e" },
      { value: result.potentialEnergy, label: "PE", color: "#3b82f6" },
      { value: result.totalEnergy, label: "Total", color: "#ef4444" },
    ];

    energies.forEach((energy, index) => {
      if (energy.value > 0) {
        const height = energy.value * scale;
        ctx.fillStyle = energy.color;
        ctx.fillRect(cx + index * (barWidth + 20), cy - height, barWidth, height);
        ctx.fillStyle = "#1f2937";
        ctx.fillText(energy.label, cx + index * (barWidth + 20) + barWidth / 2 - 10, cy - height - 10);
        ctx.fillText(
          `${energy.value.toFixed(2)}`,
          cx + index * (barWidth + 20) + barWidth / 2 - 20,
          cy - height + 20
        );
      }
    });
  };

  const clearInputs = () => {
    setInputs({
      force: "",
      distance: "",
      angle: "",
      mass: "",
      velocity: "",
      height: "",
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
      "Run,UnitSystem,Timestamp,Force,Distance,Angle,Mass,Velocity,Height,Work,KineticEnergy,PotentialEnergy,TotalEnergy",
      ...history.map((run, index) =>
        [
          index + 1,
          run.unitSystem,
          run.timestamp,
          run.force.toFixed(2),
          run.distance.toFixed(2),
          run.angle.toFixed(2),
          run.mass.toFixed(2),
          run.velocity.toFixed(2),
          run.height.toFixed(2),
          run.work.toFixed(2),
          run.kineticEnergy.toFixed(2),
          run.potentialEnergy.toFixed(2),
          run.totalEnergy.toFixed(2),
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "work_energy_data.csv";
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
    a.download = "work_energy_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculate();
      if (e.key === "c") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [inputs, unitSystem]);

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-4xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Work and Energy Calculator
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
                <option value="si">SI (m, kg, s)</option>
                <option value="imperial">Imperial (ft, lb, s)</option>
              </select>
            </div>
            <div>
              <label htmlFor="force" className="block text-sm font-medium text-gray-700 mb-1">
                Force (optional):
              </label>
              <input
                type="text"
                id="force"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder={`e.g., 100 (${unitSystem === "si" ? "N" : "lb"})`}
                value={inputs.force}
                onChange={(e) => handleInputChange("force", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
                Distance (optional):
              </label>
              <input
                type="text"
                id="distance"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder={`e.g., 10 (${unitSystem === "si" ? "m" : "ft"})`}
                value={inputs.distance}
                onChange={(e) => handleInputChange("distance", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="angle" className="block text-sm font-medium text-gray-700 mb-1">
                Angle (optional):
              </label>
              <input
                type="text"
                id="angle"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder="e.g., 0 (degrees)"
                value={inputs.angle}
                onChange={(e) => handleInputChange("angle", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="mass" className="block text-sm font-medium text-gray-700 mb-1">
                Mass:
              </label>
              <input
                type="text"
                id="mass"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder={`e.g., 50 (${unitSystem === "si" ? "kg" : "lb"})`}
                value={inputs.mass}
                onChange={(e) => handleInputChange("mass", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="velocity" className="block text-sm font-medium text-gray-700 mb-1">
                Velocity (optional):
              </label>
              <input
                type="text"
                id="velocity"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder={`e.g., 5 (${unitSystem === "si" ? "m/s" : "mph"})`}
                value={inputs.velocity}
                onChange={(e) => handleInputChange("velocity", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height (optional):
              </label>
              <input
                type="text"
                id="height"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder={`e.g., 2 (${unitSystem === "si" ? "m" : "ft"})`}
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculate}
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
                  <p>
                    Mass: {results.mass.toFixed(2)} {results.unitSystem === "si" ? "kg" : "lb"}
                  </p>
                  {results.work > 0 && (
                    <p>
                      Work: {results.work.toFixed(2)} {results.unitSystem === "si" ? "J" : "ft·lbf"}
                    </p>
                  )}
                  {results.kineticEnergy > 0 && (
                    <p>
                      Kinetic Energy: {results.kineticEnergy.toFixed(2)}{" "}
                      {results.unitSystem === "si" ? "J" : "ft·lbf"}
                    </p>
                  )}
                  {results.potentialEnergy > 0 && (
                    <p>
                      Potential Energy: {results.potentialEnergy.toFixed(2)}{" "}
                      {results.unitSystem === "si" ? "J" : "ft·lbf"}
                    </p>
                  )}
                  <p>
                    Total Mechanical Energy: {results.totalEnergy.toFixed(2)}{" "}
                    {results.unitSystem === "si" ? "J" : "ft·lbf"}
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
                <p>
                  Run {index + 1} ({run.unitSystem}, {new Date(run.timestamp).toLocaleString()}):
                </p>
                <p>
                  Mass: {run.mass.toFixed(2)} {run.unitSystem === "si" ? "kg" : "lb"}
                </p>
                {run.work > 0 && (
                  <p>
                    Work: {run.work.toFixed(2)} {run.unitSystem === "si" ? "J" : "ft·lbf"}
                  </p>
                )}
                {run.kineticEnergy > 0 && (
                  <p>
                    Kinetic Energy: {run.kineticEnergy.toFixed(2)} {run.unitSystem === "si" ? "J" : "ft·lbf"}
                  </p>
                )}
                {run.potentialEnergy > 0 && (
                  <p>
                    Potential Energy: {run.potentialEnergy.toFixed(2)}{" "}
                    {run.unitSystem === "si" ? "J" : "ft·lbf"}
                  </p>
                )}
                <p>
                  Total Mechanical Energy: {run.totalEnergy.toFixed(2)}{" "}
                  {run.unitSystem === "si" ? "J" : "ft·lbf"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
