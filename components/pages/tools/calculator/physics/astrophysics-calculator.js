"use client";

import React, { useState, useRef, useEffect } from "react";

const AstrophysicsCalculator = () => {
  const [mode, setMode] = useState("orbital-parameters");
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    centralMass: "",
    orbitalRadius: "",
    satelliteMass: "",
    centralMassEsc: "",
    radiusEsc: "",
    blackHoleMass: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const G = 6.6743e-11; // Gravitational constant (m³ kg⁻¹ s⁻²)
  const c = 2.99792458e8; // Speed of light (m/s)
  const M_sun = 1.989e30; // Solar mass (kg)
  const AU = 1.496e11; // Astronomical unit (m)
  const yr = 365.25 * 24 * 3600; // Year (s)

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 900;
    canvas.height = 400;
    toggleModeInputs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const toggleModeInputs = () => {
    document.getElementById("orbital-parameters-inputs").style.display =
      mode === "orbital-parameters" ? "block" : "none";
    document.getElementById("escape-velocity-inputs").style.display =
      mode === "escape-velocity" ? "block" : "none";
    document.getElementById("schwarzschild-radius-inputs").style.display =
      mode === "schwarzschild-radius" ? "block" : "none";
  };

  const calculateAstro = () => {
    const { centralMass, orbitalRadius, satelliteMass, centralMassEsc, radiusEsc, blackHoleMass } = inputs;
    const steps = [];

    let M,
      r,
      m = parseFloat(satelliteMass),
      R,
      M_bh;
    if (unitSystem === "astronomical") {
      if (mode === "orbital-parameters") {
        M = parseFloat(centralMass) * M_sun;
        r = parseFloat(orbitalRadius) * AU;
        if (!isNaN(m)) m *= M_sun;
        steps.push(
          "Converted to SI: central mass (M⊙ to kg), orbital radius (AU to m), satellite mass (M⊙ to kg)."
        );
      } else if (mode === "escape-velocity") {
        M = parseFloat(centralMassEsc) * M_sun;
        R = parseFloat(radiusEsc) * 1e3; // km to m
        steps.push("Converted to SI: central mass (M⊙ to kg), radius (km to m).");
      } else {
        M_bh = parseFloat(blackHoleMass) * M_sun;
        steps.push("Converted to SI: black hole mass (M⊙ to kg).");
      }
    } else {
      M = parseFloat(centralMass);
      r = parseFloat(orbitalRadius);
      R = parseFloat(radiusEsc);
      M_bh = parseFloat(blackHoleMass);
    }

    let result = { mode, unitSystem };

    if (mode === "orbital-parameters") {
      if (isNaN(M) || M <= 0 || isNaN(r) || r <= 0) {
        setResults(<p className="text-red-500">Positive central mass and orbital radius required.</p>);
        return;
      }
      const period = 2 * Math.PI * Math.sqrt(r ** 3 / (G * M));
      const velocity = Math.sqrt((G * M) / r);
      const energy = -(G * M) / (2 * r);
      steps.push(
        `Orbital period: T = 2π √(r³ / (G M)) = 2π √(${r.toFixed(2)}³ / (${G.toFixed(2)} × ${M.toFixed(
          2
        )})) = ${period.toFixed(2)} s`
      );
      steps.push(
        `Orbital velocity: v = √(G M / r) = √(${G.toFixed(2)} × ${M.toFixed(2)} / ${r.toFixed(
          2
        )}) = ${velocity.toFixed(2)} m/s`
      );
      steps.push(
        `Specific orbital energy: ε = - (G M) / (2 r) = - (${G.toFixed(2)} × ${M.toFixed(
          2
        )}) / (2 × ${r.toFixed(2)}) = ${energy.toFixed(2)} J/kg`
      );
      result = { ...result, M, r, m, T: period, v: velocity, energy };
    } else if (mode === "escape-velocity") {
      if (isNaN(M) || M <= 0 || isNaN(R) || R <= 0) {
        setResults(<p className="text-red-500">Positive central mass and radius required.</p>);
        return;
      }
      const v_esc = Math.sqrt((2 * G * M) / R);
      steps.push(
        `Escape velocity: v_esc = √(2 G M / R) = √(2 × ${G.toFixed(2)} × ${M.toFixed(2)} / ${R.toFixed(
          2
        )}) = ${v_esc.toFixed(2)} m/s`
      );
      result = { ...result, M, R, v_esc };
    } else {
      if (isNaN(M_bh) || M_bh <= 0) {
        setResults(<p className="text-red-500">Positive black hole mass required.</p>);
        return;
      }
      const R_s = (2 * G * M_bh) / c ** 2;
      steps.push(
        `Schwarzschild radius: R_s = (2 G M) / c² = (2 × ${G.toFixed(2)} × ${M_bh.toFixed(2)}) / ${c.toFixed(
          2
        )}² = ${R_s.toFixed(2)} m`
      );
      result = { ...result, M: M_bh, R_s };
    }

    if (unitSystem === "astronomical") {
      if (mode === "orbital-parameters") {
        result.M /= M_sun;
        result.r /= AU;
        if (!isNaN(result.m)) result.m /= M_sun;
        result.T /= yr;
        result.v /= 1e3;
        result.energy *= M_sun / AU;
        steps.push(
          "Converted outputs to astronomical units: mass (kg to M⊙), radius (m to AU), period (s to yr), velocity (m/s to km/s)."
        );
      } else if (mode === "escape-velocity") {
        result.M /= M_sun;
        result.R /= 1e3;
        result.v_esc /= 1e3;
        steps.push(
          "Converted outputs to astronomical units: mass (kg to M⊙), radius (m to km), velocity (m/s to km/s)."
        );
      } else {
        result.M /= M_sun;
        result.R_s /= 1e3;
        steps.push("Converted outputs to astronomical units: mass (kg to M⊙), radius (m to km).");
      }
    }

    let html = "";
    if (mode === "orbital-parameters") {
      html = `
        <p>Central Mass: ${result.M.toFixed(2)} ${unitSystem === "si" ? "kg" : "M⊙"}</p>
        <p>Orbital Radius: ${result.r.toFixed(2)} ${unitSystem === "si" ? "m" : "AU"}</p>
        ${
          !isNaN(result.m)
            ? `<p>Satellite Mass: ${result.m.toFixed(2)} ${unitSystem === "si" ? "kg" : "M⊙"}</p>`
            : ""
        }
        <p>Orbital Period: ${result.T.toFixed(2)} ${unitSystem === "si" ? "s" : "yr"}</p>
        <p>Orbital Velocity: ${result.v.toFixed(2)} ${unitSystem === "si" ? "m/s" : "km/s"}</p>
        <p>Specific Orbital Energy: ${result.energy.toFixed(2)} ${unitSystem === "si" ? "J/kg" : "M⊙/AU"}</p>
      `;
    } else if (mode === "escape-velocity") {
      html = `
        <p>Central Mass: ${result.M.toFixed(2)} ${unitSystem === "si" ? "kg" : "M⊙"}</p>
        <p>Radius: ${result.R.toFixed(2)} ${unitSystem === "si" ? "m" : "km"}</p>
        <p>Escape Velocity: ${result.v_esc.toFixed(2)} ${unitSystem === "si" ? "m/s" : "km/s"}</p>
      `;
    } else {
      html = `
        <p>Black Hole Mass: ${result.M.toFixed(2)} ${unitSystem === "si" ? "kg" : "M⊙"}</p>
        <p>Schwarzschild Radius: ${result.R_s.toFixed(2)} ${unitSystem === "si" ? "m" : "km"}</p>
      `;
    }

    setResults(
      <div>
        {html}
        <h2 className="text-red-400 text-xl mt-4 mb-2">Solution Steps</h2>
        {steps.map((step, idx) => (
          <p key={idx} className="text-sm mb-2">
            {step}
          </p>
        ))}
      </div>
    );

    result.timestamp = new Date().toISOString();
    setHistory([...history, result]);
    plotGraph(result);
  };

  const plotGraph = (result) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${result.mode} Visualization`, 10, 20);

    const cx = canvasRef.current.width / 2;
    const cy = canvasRef.current.height / 2;
    const scale = 50;

    if (result.mode === "orbital-parameters") {
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#ff5555";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`M=${result.M.toFixed(2)} ${unitSystem === "si" ? "kg" : "M⊙"}`, cx + 15, cy - 15);

      const rScaled = (result.r / (unitSystem === "si" ? 1e11 : 1)) * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, rScaled, 0, 2 * Math.PI);
      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + rScaled, cy, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#55ff55";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        `r=${result.r.toFixed(2)} ${unitSystem === "si" ? "m" : "AU"}`,
        cx + rScaled + 10,
        cy - 10
      );
      ctx.fillText(
        `v=${result.v.toFixed(2)} ${unitSystem === "si" ? "m/s" : "km/s"}`,
        cx + rScaled + 10,
        cy + 10
      );
    } else if (result.mode === "escape-velocity") {
      const RScaled = (result.R / (unitSystem === "si" ? 1e8 : 1e5)) * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, RScaled, 0, 2 * Math.PI);
      ctx.fillStyle = "#ff5555";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        `M=${result.M.toFixed(2)} ${unitSystem === "si" ? "kg" : "M⊙"}`,
        cx + RScaled + 10,
        cy - 15
      );
      ctx.fillText(`R=${result.R.toFixed(2)} ${unitSystem === "si" ? "m" : "km"}`, cx + RScaled + 10, cy);

      const vScaled = (result.v_esc / (unitSystem === "si" ? 1e4 : 10)) * scale;
      ctx.beginPath();
      ctx.moveTo(cx + RScaled, cy);
      ctx.lineTo(cx + RScaled + vScaled, cy);
      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillText(
        `v_esc=${result.v_esc.toFixed(2)} ${unitSystem === "si" ? "m/s" : "km/s"}`,
        cx + RScaled + vScaled + 10,
        cy
      );
    } else {
      const RsScaled = (result.R_s / (unitSystem === "si" ? 1e3 : 1)) * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, RsScaled, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fill();
      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        `M=${result.M.toFixed(2)} ${unitSystem === "si" ? "kg" : "M⊙"}`,
        cx + RsScaled + 10,
        cy - 15
      );
      ctx.fillText(
        `R_s=${result.R_s.toFixed(2)} ${unitSystem === "si" ? "m" : "km"}`,
        cx + RsScaled + 10,
        cy
      );
    }
  };

  const clearInputs = () => {
    setInputs({
      centralMass: "",
      orbitalRadius: "",
      satelliteMass: "",
      centralMassEsc: "",
      radiusEsc: "",
      blackHoleMass: "",
    });
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
      "Run,Mode,UnitSystem,Timestamp,CentralMass,OrbitalRadius,SatelliteMass,Radius,BlackHoleMass,Period,Velocity,Energy,EscapeVelocity,SchwarzschildRadius",
      ...history.map(
        (run, idx) =>
          `${idx + 1},${run.mode},${run.unitSystem},${run.timestamp},${run.M ? run.M.toFixed(2) : ""},${
            run.r ? run.r.toFixed(2) : ""
          },${run.m ? run.m.toFixed(2) : ""},${run.R ? run.R.toFixed(2) : ""},${
            run.mode === "schwarzschild-radius" && run.M ? run.M.toFixed(2) : ""
          },${run.T ? run.T.toFixed(2) : ""},${run.v ? run.v.toFixed(2) : ""},${
            run.energy ? run.energy.toFixed(2) : ""
          },${run.v_esc ? run.v_esc.toFixed(2) : ""},${run.R_s ? run.R_s.toFixed(2) : ""}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "astrophysics_data.csv";
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
    a.download = "astrophysics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromVectorResolver = () => {
    alert("Import from Vector Resolver not implemented. Please enter parameters manually.");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateAstro();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className="min-h-screen  flex justify-center items-center p-5"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="w-full max-w-4xl  border border-white/20 rounded-2xl p-6  shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-red-400 animate-glow">
          Astrophysics Calculator
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-2 text-gray-400">Calculation Mode:</label>
            <select
              id="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-2 bg-black/30 border border-red-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="orbital-parameters">Orbital Parameters</option>
              <option value="escape-velocity">Escape Velocity</option>
              <option value="schwarzschild-radius">Schwarzschild Radius</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2 text-gray-400">Unit System:</label>
            <select
              id="unit-system"
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value)}
              className="w-full p-2 bg-black/30 border border-red-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="si">SI (kg, m, s)</option>
              <option value="astronomical">Astronomical (M⊙, AU, yr)</option>
            </select>
          </div>
        </div>
        <div id="orbital-parameters-inputs" className="mb-4 p-4 bg-black/20 rounded-lg">
          <h2 className="text-red-400 text-xl mb-4">Orbital Parameters Inputs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-400">Central Mass (kg or M⊙):</label>
              <input
                type="text"
                name="centralMass"
                value={inputs.centralMass}
                onChange={handleInputChange}
                placeholder="e.g., 1.989e30"
                className="w-full p-2 bg-black/30 border border-red-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-400">Orbital Radius (m or AU):</label>
              <input
                type="text"
                name="orbitalRadius"
                value={inputs.orbitalRadius}
                onChange={handleInputChange}
                placeholder="e.g., 1.496e11"
                className="w-full p-2 bg-black/30 border border-red-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-400">Satellite Mass (kg, optional):</label>
              <input
                type="text"
                name="satelliteMass"
                value={inputs.satelliteMass}
                onChange={handleInputChange}
                placeholder="e.g., 5.972e24"
                className="w-full p-2 bg-black/30 border border-red-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>
        </div>
        <div id="escape-velocity-inputs" className="mb-4 p-4 bg-black/20 rounded-lg">
          <h2 className="text-red-400 text-xl mb-4">Escape Velocity Inputs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-400">Central Mass (kg or M⊙):</label>
              <input
                type="text"
                name="centralMassEsc"
                value={inputs.centralMassEsc}
                onChange={handleInputChange}
                placeholder="e.g., 1.989e30"
                className="w-full p-2 bg-black/30 border border-red-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-400">Radius (m or km):</label>
              <input
                type="text"
                name="radiusEsc"
                value={inputs.radiusEsc}
                onChange={handleInputChange}
                placeholder="e.g., 6.957e8"
                className="w-full p-2 bg-black/30 border border-red-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>
        </div>
        <div id="schwarzschild-radius-inputs" className="mb-4 p-4 bg-black/20 rounded-lg">
          <h2 className="text-red-400 text-xl mb-4">Schwarzschild Radius Inputs</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-400">Black Hole Mass (kg or M⊙):</label>
              <input
                type="text"
                name="blackHoleMass"
                value={inputs.blackHoleMass}
                onChange={handleInputChange}
                placeholder="e.g., 1.989e30"
                className="w-full p-2 bg-black/30 border border-red-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={calculateAstro}
            className="flex-1 min-w-[120px] p-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Calculate
          </button>
          <button
            onClick={importFromVectorResolver}
            className="flex-1 min-w-[120px] p-3 bg-green-400 text-[#0d1b2a] rounded-lg font-semibold hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Import Velocities
          </button>
          <button
            onClick={clearInputs}
            className="flex-1 min-w-[120px] p-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear
          </button>
          <button
            onClick={exportCSV}
            className="flex-1 min-w-[120px] p-3 bg-green-400 text-[#0d1b2a] rounded-lg font-semibold hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Export CSV
          </button>
          <button
            onClick={exportJSON}
            className="flex-1 min-w-[120px] p-3 bg-green-400 text-[#0d1b2a] rounded-lg font-semibold hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Export JSON
          </button>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full max-h-[400px] bg-black/40 rounded-xl border border-white/10 mb-4"
        />
        <div id="results" className="p-4 bg-black/40 rounded-xl mb-4">
          {results}
        </div>
        <div id="history" className="p-4 bg-black/40 rounded-xl max-h-[200px] overflow-y-auto">
          <h2 className="text-red-400 text-xl mb-4">Calculation History</h2>
          <div id="history-content">
            {history.map((run, idx) => (
              <div key={idx} className="p-2 mb-2 bg-white/5 rounded-lg">
                <p>
                  Run {idx + 1} ({run.mode}, {run.unitSystem}, {run.timestamp}):
                </p>
                {run.mode === "orbital-parameters" && (
                  <>
                    <p>
                      Central Mass: {run.M.toFixed(2)} {unitSystem === "si" ? "kg" : "M⊙"}
                    </p>
                    <p>
                      Orbital Radius: {run.r.toFixed(2)} {unitSystem === "si" ? "m" : "AU"}
                    </p>
                    {!isNaN(run.m) && (
                      <p>
                        Satellite Mass: {run.m.toFixed(2)} {unitSystem === "si" ? "kg" : "M⊙"}
                      </p>
                    )}
                    <p>
                      Orbital Period: {run.T.toFixed(2)} {unitSystem === "si" ? "s" : "yr"}
                    </p>
                    <p>
                      Orbital Velocity: {run.v.toFixed(2)} {unitSystem === "si" ? "m/s" : "km/s"}
                    </p>
                    <p>
                      Specific Orbital Energy: {run.energy.toFixed(2)}{" "}
                      {unitSystem === "si" ? "J/kg" : "M⊙/AU"}
                    </p>
                  </>
                )}
                {run.mode === "escape-velocity" && (
                  <>
                    <p>
                      Central Mass: {run.M.toFixed(2)} {unitSystem === "si" ? "kg" : "M⊙"}
                    </p>
                    <p>
                      Radius: {run.R.toFixed(2)} {unitSystem === "si" ? "m" : "km"}
                    </p>
                    <p>
                      Escape Velocity: {run.v_esc.toFixed(2)} {unitSystem === "si" ? "m/s" : "km/s"}
                    </p>
                  </>
                )}
                {run.mode === "schwarzschild-radius" && (
                  <>
                    <p>
                      Black Hole Mass: {run.M.toFixed(2)} {unitSystem === "si" ? "kg" : "M⊙"}
                    </p>
                    <p>
                      Schwarzschild Radius: {run.R_s.toFixed(2)} {unitSystem === "si" ? "m" : "km"}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes glow {
          from {
            text-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
          }
          to {
            text-shadow: 0 0 20px rgba(0, 255, 204, 0.8);
          }
        }
        #history::-webkit-scrollbar {
          width: 8px;
        }
        #history::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        #history::-webkit-scrollbar-thumb {
          background: #00ffcc;
          border-radius: 4px;
        }
        @media (max-width: 640px) {
          .container {
            padding: 1.5rem;
          }
          h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AstrophysicsCalculator;
