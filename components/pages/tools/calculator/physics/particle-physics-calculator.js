"use client";

import React, { useState, useEffect, useRef } from "react";

const ParticlePhysicsCalculator = () => {
  const [mode, setMode] = useState("decay-rate");
  const [unitSystem, setUnitSystem] = useState("si");
  const [interactionType, setInteractionType] = useState("rutherford");
  const [inputs, setInputs] = useState({
    initialParticles: "",
    decayConstant: "",
    time: "",
    projectileCharge: "",
    targetCharge: "",
    kineticEnergy: "",
    scatteringAngle: "",
    particleRadius: "",
    particleMass: "",
    momentum: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const hbar = 1.054571817e-34; // J·s
  const c = 2.99792458e8; // m/s
  const e = 1.60217662e-19; // C
  const epsilon_0 = 8.854187817e-12; // F/m
  const MeV = 1.60217662e-13; // MeV to J
  const fm = 1e-15; // fm to m
  const MeV_c2_to_kg = 1.78266192e-30; // MeV/c² to kg
  const MeV_c_to_kgms = MeV / c; // MeV/c to kg·m/s

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

  const calculateParticle = () => {
    try {
      const initialParticles = parseFloat(inputs.initialParticles);
      const decayConstant = parseFloat(inputs.decayConstant);
      const time = parseFloat(inputs.time);
      const projectileCharge = parseInt(inputs.projectileCharge);
      const targetCharge = parseInt(inputs.targetCharge);
      const kineticEnergy = parseFloat(inputs.kineticEnergy);
      const scatteringAngle = parseFloat(inputs.scatteringAngle);
      const particleRadius = parseFloat(inputs.particleRadius);
      const particleMass = parseFloat(inputs.particleMass);
      const momentum = parseFloat(inputs.momentum);
      const steps = [];

      let N_0 = initialParticles,
        lambda = decayConstant,
        t = time,
        Z_1 = projectileCharge,
        Z_2 = targetCharge,
        E = kineticEnergy,
        theta = scatteringAngle,
        r = particleRadius,
        m = particleMass,
        p = momentum;
      if (unitSystem === "particle") {
        if (mode === "cross-section" && interactionType === "rutherford") {
          E *= MeV;
          steps.push("Converted kinetic energy from MeV to J.");
        } else if (mode === "cross-section" && interactionType === "hard-sphere") {
          r *= fm;
          steps.push("Converted particle radius from fm to m.");
        } else if (mode === "relativistic-kinematics") {
          m *= MeV_c2_to_kg;
          p *= MeV_c_to_kgms;
          steps.push("Converted mass (MeV/c² to kg) and momentum (MeV/c to kg·m/s).");
        }
      }

      let result = { mode, unitSystem };

      if (mode === "decay-rate") {
        if (isNaN(N_0) || N_0 < 0 || isNaN(lambda) || lambda < 0 || isNaN(t) || t < 0) {
          setResults(<p className="text-red-500">Non-negative N₀, λ, and t required.</p>);
          return;
        }
        const N = N_0 * Math.exp(-lambda * t);
        const R = lambda * N;
        steps.push(
          `Number of particles: N(t) = N₀ e^(-λ t) = ${N_0.toFixed(2)} e^(-${lambda.toFixed(2)} × ${t.toFixed(
            2
          )}) = ${N.toFixed(2)}`
        );
        steps.push(`Decay rate: R = λ N = ${lambda.toFixed(2)} × ${N.toFixed(2)} = ${R.toFixed(2)} s⁻¹`);
        result = { ...result, N_0, lambda, t, N, R };
        setResults(
          <div>
            <p>Initial Particles (N₀): {result.N_0.toFixed(2)}</p>
            <p>Decay Constant (λ): {result.lambda.toFixed(2)} s⁻¹</p>
            <p>Time (t): {result.t.toFixed(2)} s</p>
            <p>Particles at t (N): {result.N.toFixed(2)}</p>
            <p>Decay Rate (R): {result.R.toFixed(2)} s⁻¹</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
            {steps.map((step, idx) => (
              <p key={idx} className="text-sm text-gray-700 mb-2">
                {step}
              </p>
            ))}
          </div>
        );
      } else if (mode === "cross-section") {
        if (interactionType === "rutherford") {
          if (isNaN(Z_1) || isNaN(Z_2) || isNaN(E) || E <= 0 || isNaN(theta) || theta <= 0 || theta >= 180) {
            setResults(
              <p className="text-red-500">{"Valid Z₁, Z₂, positive E, and 0 < θ < 180° required."}</p>
            );
            return;
          }
          const factor = (Z_1 * Z_2 * e * e) / (4 * Math.PI * epsilon_0 * 4 * E);
          const dSigma_dOmega = factor ** 2 / Math.sin((theta * Math.PI) / 360) ** 4;
          steps.push(
            `Rutherford differential cross-section: dσ/dΩ = [(Z₁ Z₂ e²) / (4π ε₀ 4 E)]² / sin⁴(θ/2)`
          );
          steps.push(
            `Factor = (Z₁ Z₂ e²) / (4π ε₀ 4 E) = (${Z_1} × ${Z_2} × ${e.toFixed(
              2
            )}²) / (4π × ${epsilon_0.toFixed(2)} × 4 × ${E.toFixed(2)}) = ${factor.toFixed(2)} m`
          );
          steps.push(
            `dσ/dΩ = (${factor.toFixed(2)}²) / sin⁴(${theta.toFixed(2)}/2) = ${dSigma_dOmega.toFixed(
              2
            )} m²/sr`
          );
          result = { ...result, Z_1, Z_2, E, theta, dSigma_dOmega, interactionType };
          if (unitSystem === "particle") {
            result.E /= MeV;
            result.dSigma_dOmega /= fm ** 2;
            steps.push("Converted outputs to particle units: energy (J to MeV), cross-section (m² to fm²).");
          }
          setResults(
            <div>
              <p>Projectile Charge (Z₁): {result.Z_1}</p>
              <p>Target Charge (Z₂): {result.Z_2}</p>
              <p>
                Kinetic Energy: {result.E.toFixed(2)} {unitSystem === "si" ? "J" : "MeV"}
              </p>
              <p>Scattering Angle (θ): {result.theta.toFixed(2)}°</p>
              <p>
                Differential Cross-Section (dσ/dΩ): {result.dSigma_dOmega.toFixed(2)}{" "}
                {unitSystem === "si" ? "m²/sr" : "fm²/sr"}
              </p>
              <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
              {steps.map((step, idx) => (
                <p key={idx} className="text-sm text-gray-700 mb-2">
                  {step}
                </p>
              ))}
            </div>
          );
        } else if (interactionType === "hard-sphere") {
          if (isNaN(r) || r <= 0) {
            setResults(<p className="text-red-500">Positive particle radius required.</p>);
            return;
          }
          const sigma = Math.PI * r * r;
          steps.push(`Hard sphere cross-section: σ = π r² = π × ${r.toFixed(2)}² = ${sigma.toFixed(2)} m²`);
          result = { ...result, r, sigma, interactionType };
          if (unitSystem === "particle") {
            result.r /= fm;
            result.sigma /= fm ** 2;
            steps.push("Converted outputs to particle units: radius (m to fm), cross-section (m² to fm²).");
          }
          setResults(
            <div>
              <p>
                Particle Radius: {result.r.toFixed(2)} {unitSystem === "si" ? "m" : "fm"}
              </p>
              <p>
                Total Cross-Section (σ): {result.sigma.toFixed(2)} {unitSystem === "si" ? "m²" : "fm²"}
              </p>
              <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
              {steps.map((step, idx) => (
                <p key={idx} className="text-sm text-gray-700 mb-2">
                  {step}
                </p>
              ))}
            </div>
          );
        }
      } else if (mode === "relativistic-kinematics") {
        if (isNaN(m) || m < 0 || isNaN(p)) {
          setResults(<p className="text-red-500">Non-negative mass and valid momentum required.</p>);
          return;
        }
        const E = Math.sqrt((p * c) ** 2 + (m * c * c) ** 2);
        const P0 = E / c;
        steps.push(
          `Energy: E = √((p c)² + (m c²)²) = √((${p.toFixed(2)} × ${c.toFixed(2)})² + (${m.toFixed(
            2
          )} × ${c.toFixed(2)}²)²) = ${E.toFixed(2)} J`
        );
        steps.push(
          `Four-momentum: Pμ = (E/c, p) = (${E.toFixed(2)}/${c.toFixed(2)}, ${p.toFixed(2)}) = (${P0.toFixed(
            2
          )}, ${p.toFixed(2)}) kg·m/s`
        );
        result = { ...result, m, p, E, P0 };
        if (unitSystem === "particle") {
          result.m /= MeV_c2_to_kg;
          result.p /= MeV_c_to_kgms;
          result.E /= MeV;
          result.P0 /= MeV_c_to_kgms;
          steps.push(
            "Converted outputs to particle units: mass (kg to MeV/c²), momentum (kg·m/s to MeV/c), energy (J to MeV)."
          );
        }
        setResults(
          <div>
            <p>
              Particle Mass: {result.m.toFixed(2)} {unitSystem === "si" ? "kg" : "MeV/c²"}
            </p>
            <p>
              Momentum: {result.p.toFixed(2)} {unitSystem === "si" ? "kg·m/s" : "MeV/c"}
            </p>
            <p>
              Energy (E): {result.E.toFixed(2)} {unitSystem === "si" ? "J" : "MeV"}
            </p>
            <p>
              Four-Momentum (Pμ): ({result.P0.toFixed(2)}, {result.p.toFixed(2)}){" "}
              {unitSystem === "si" ? "kg·m/s" : "MeV/c"}
            </p>
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
    ctx.fillText(
      `${result.mode} Visualization ${result.mode === "cross-section" ? `(${result.interactionType})` : ""}`,
      10,
      20
    );

    const cx = canvasRef.current.width / 2;
    const cy = canvasRef.current.height / 2;
    const plotWidth = canvasRef.current.width - 100;
    const plotHeight = canvasRef.current.height - 100;

    if (result.mode === "decay-rate") {
      const points = 100;
      const maxT = result.t * 2;
      const dt = maxT / points;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const t = i * dt;
        const N = result.N_0 * Math.exp(-result.lambda * t);
        const px = cx - plotWidth / 2 + (t / maxT) * plotWidth;
        const py = cy + plotHeight / 2 - ((N / result.N_0) * plotHeight) / 2;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx - plotWidth / 2 + (result.t / maxT) * plotWidth;
      const py = cy + plotHeight / 2 - ((result.N / result.N_0) * plotHeight) / 2;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`t=${result.t.toFixed(2)} s, N=${result.N.toFixed(2)}`, px + 10, py - 10);
      ctx.fillText("t (s)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText("N", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    } else if (result.mode === "cross-section") {
      if (result.interactionType === "rutherford") {
        const points = 100;
        const maxTheta = 180;
        const dTheta = maxTheta / points;
        const E_si = unitSystem === "particle" ? result.E * MeV : result.E;
        const factor = (result.Z_1 * result.Z_2 * e * e) / (4 * Math.PI * epsilon_0 * 4 * E_si);
        const maxSigma = factor ** 2 / Math.sin((5 * Math.PI) / 360) ** 4;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const theta = i * dTheta;
          const sinTheta2 = Math.sin((theta * Math.PI) / 360);
          const dSigma_dOmega = sinTheta2 > 0 ? factor ** 2 / sinTheta2 ** 4 : 0;
          const px = cx - plotWidth / 2 + (theta / maxTheta) * plotWidth;
          const py = cy + plotHeight / 2 - (Math.min(dSigma_dOmega / maxSigma, 1) * plotHeight) / 2;
          if (i === 0 || sinTheta2 === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();

        const px = cx - plotWidth / 2 + (result.theta / maxTheta) * plotWidth;
        const py =
          cy +
          plotHeight / 2 -
          (Math.min(
            (unitSystem === "particle" ? result.dSigma_dOmega * fm ** 2 : result.dSigma_dOmega) / maxSigma,
            1
          ) *
            plotHeight) /
            2;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#10b981";
        ctx.fill();
        ctx.fillStyle = "#1f2937";
        ctx.fillText(
          `θ=${result.theta.toFixed(2)}°, dσ/dΩ=${result.dSigma_dOmega.toFixed(2)} ${
            unitSystem === "si" ? "m²/sr" : "fm²/sr"
          }`,
          px + 10,
          py - 10
        );
        ctx.fillText("θ (°)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
        ctx.fillText("dσ/dΩ", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
      } else if (result.interactionType === "hard-sphere") {
        const rScaled = ((unitSystem === "particle" ? result.r * fm : result.r) / 1e-15) * 50;
        ctx.beginPath();
        ctx.arc(cx, cy, rScaled, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fill();
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#1f2937";
        ctx.fillText(
          `r=${result.r.toFixed(2)} ${unitSystem === "si" ? "m" : "fm"}`,
          cx + rScaled + 10,
          cy - 15
        );
        ctx.fillText(
          `σ=${result.sigma.toFixed(2)} ${unitSystem === "si" ? "m²" : "fm²"}`,
          cx + rScaled + 10,
          cy
        );
      }
    } else if (result.mode === "relativistic-kinematics") {
      const points = 100;
      const maxP = result.p * 2;
      const dp = maxP / points;
      const m_si = unitSystem === "particle" ? result.m * MeV_c2_to_kg : result.m;
      const p_si = unitSystem === "particle" ? result.p * MeV_c_to_kgms : result.p;
      const maxE = Math.sqrt(
        (maxP * (unitSystem === "particle" ? MeV_c_to_kgms : 1) * c) ** 2 + (m_si * c * c) ** 2
      );
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const p = i * dp * (unitSystem === "particle" ? MeV_c_to_kgms : 1);
        const E = Math.sqrt((p * c) ** 2 + (m_si * c * c) ** 2);
        const px = cx - plotWidth / 2 + ((i * dp) / maxP) * plotWidth;
        const py = cy + plotHeight / 2 - ((E / maxE) * plotHeight) / 2;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx - plotWidth / 2 + (result.p / maxP) * plotWidth;
      const py =
        cy +
        plotHeight / 2 -
        (((unitSystem === "particle" ? result.E * MeV : result.E) / maxE) * plotHeight) / 2;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`p=${result.p.toFixed(2)} ${unitSystem === "si" ? "kg·m/s" : "MeV/c"}`, px + 10, py - 10);
      ctx.fillText(`E=${result.E.toFixed(2)} ${unitSystem === "si" ? "J" : "MeV"}`, px + 10, py + 10);
      ctx.fillText(
        `p (${unitSystem === "si" ? "kg·m/s" : "MeV/c"})`,
        cx + plotWidth / 2,
        cy + plotHeight / 2 + 20
      );
      ctx.fillText(`E (${unitSystem === "si" ? "J" : "MeV"})`, cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    }
  };

  const clearInputs = () => {
    setInputs({
      initialParticles: "",
      decayConstant: "",
      time: "",
      projectileCharge: "",
      targetCharge: "",
      kineticEnergy: "",
      scatteringAngle: "",
      particleRadius: "",
      particleMass: "",
      momentum: "",
    });
    setResults(null);
    setHistory([]);
    if (ctxRef.current) ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const importFromQuantumMechanics = () => {
    alert("Import from Quantum Mechanics Calculator not implemented. Please enter parameters manually.");
  };

  const exportCSV = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const csv = [
      "Run,Mode,InteractionType,UnitSystem,Timestamp,InitialParticles,DecayConstant,Time,ProjectileCharge,TargetCharge,KineticEnergy,ScatteringAngle,ParticleRadius,ParticleMass,Momentum,Particles,DecayRate,DifferentialCrossSection,TotalCrossSection,Energy,FourMomentumP0",
      ...history.map(
        (run, index) => `
        ${index + 1},${run.mode},${run.interactionType || ""},${run.unitSystem},${run.timestamp},
        ${run.N_0 ? run.N_0.toFixed(2) : ""},${run.lambda ? run.lambda.toFixed(2) : ""},${
          run.t ? run.t.toFixed(2) : ""
        },
        ${run.Z_1 || ""},${run.Z_2 || ""},${run.E ? run.E.toFixed(2) : ""},${
          run.theta ? run.theta.toFixed(2) : ""
        },
        ${run.r ? run.r.toFixed(2) : ""},${run.m ? run.m.toFixed(2) : ""},${run.p ? run.p.toFixed(2) : ""},
        ${run.N ? run.N.toFixed(2) : ""},${run.R ? run.R.toFixed(2) : ""},
        ${run.dSigma_dOmega ? run.dSigma_dOmega.toFixed(2) : ""},${run.sigma ? run.sigma.toFixed(2) : ""},
        ${run.E && run.mode === "relativistic-kinematics" ? run.E.toFixed(2) : ""},${
          run.P0 ? run.P0.toFixed(2) : ""
        }
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "particle_physics_data.csv";
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
    a.download = "particle_physics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateParticle();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className="min-h-screen bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-5xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Particle Physics Calculator</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
              <option value="decay-rate">Decay Rate</option>
              <option value="cross-section">Cross-Section</option>
              <option value="relativistic-kinematics">Relativistic Kinematics</option>
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
              <option value="si">SI (kg, m, s, J)</option>
              <option value="particle">Particle (MeV, fm, s)</option>
            </select>
          </div>
          {mode === "cross-section" && (
            <div>
              <label htmlFor="interaction-type" className="block text-sm font-medium text-gray-700 mb-2">
                Interaction Type:
              </label>
              <select
                id="interaction-type"
                value={interactionType}
                onChange={(e) => setInteractionType(e.target.value)}
                className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Interaction type"
              >
                <option value="rutherford">Rutherford Scattering</option>
                <option value="hard-sphere">Hard Sphere</option>
              </select>
            </div>
          )}
        </div>
        {mode === "decay-rate" && (
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Decay Rate Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="initial-particles" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Particles (N₀):
                </label>
                <input
                  type="text"
                  id="initial-particles"
                  name="initialParticles"
                  value={inputs.initialParticles}
                  onChange={handleInputChange}
                  placeholder="e.g., 1e6"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Initial number of particles"
                />
              </div>
              <div>
                <label htmlFor="decay-constant" className="block text-sm font-medium text-gray-700 mb-2">
                  Decay Constant (s⁻¹):
                </label>
                <input
                  type="text"
                  id="decay-constant"
                  name="decayConstant"
                  value={inputs.decayConstant}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.01"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Decay constant"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time (s):
                </label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={inputs.time}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Time"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "cross-section" && (
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Cross-Section Inputs</h2>
            {interactionType === "rutherford" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="projectile-charge" className="block text-sm font-medium text-gray-700 mb-2">
                    Projectile Charge (Z₁):
                  </label>
                  <input
                    type="text"
                    id="projectile-charge"
                    name="projectileCharge"
                    value={inputs.projectileCharge}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    aria-label="Projectile charge number"
                  />
                </div>
                <div>
                  <label htmlFor="target-charge" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Charge (Z₂):
                  </label>
                  <input
                    type="text"
                    id="target-charge"
                    name="targetCharge"
                    value={inputs.targetCharge}
                    onChange={handleInputChange}
                    placeholder="e.g., 79"
                    className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    aria-label="Target charge number"
                  />
                </div>
                <div>
                  <label htmlFor="kinetic-energy" className="block text-sm font-medium text-gray-700 mb-2">
                    Kinetic Energy ({unitSystem === "si" ? "J" : "MeV"}):
                  </label>
                  <input
                    type="text"
                    id="kinetic-energy"
                    name="kineticEnergy"
                    value={inputs.kineticEnergy}
                    onChange={handleInputChange}
                    placeholder="e.g., 1.6e-13"
                    className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    aria-label="Kinetic energy"
                  />
                </div>
                <div>
                  <label htmlFor="scattering-angle" className="block text-sm font-medium text-gray-700 mb-2">
                    Scattering Angle (°):
                  </label>
                  <input
                    type="text"
                    id="scattering-angle"
                    name="scatteringAngle"
                    value={inputs.scatteringAngle}
                    onChange={handleInputChange}
                    placeholder="e.g., 90"
                    className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    aria-label="Scattering angle"
                  />
                </div>
              </div>
            )}
            {interactionType === "hard-sphere" && (
              <div className="grid grid-cols-1">
                <div>
                  <label htmlFor="particle-radius" className="block text-sm font-medium text-gray-700 mb-2">
                    Particle Radius ({unitSystem === "si" ? "m" : "fm"}):
                  </label>
                  <input
                    type="text"
                    id="particle-radius"
                    name="particleRadius"
                    value={inputs.particleRadius}
                    onChange={handleInputChange}
                    placeholder="e.g., 1e-15"
                    className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    aria-label="Particle radius"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {mode === "relativistic-kinematics" && (
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Relativistic Kinematics Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="particle-mass" className="block text-sm font-medium text-gray-700 mb-2">
                  Particle Mass ({unitSystem === "si" ? "kg" : "MeV/c²"}):
                </label>
                <input
                  type="text"
                  id="particle-mass"
                  name="particleMass"
                  value={inputs.particleMass}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.672e-27"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Particle mass"
                />
              </div>
              <div>
                <label htmlFor="momentum" className="block text-sm font-medium text-gray-700 mb-2">
                  Momentum ({unitSystem === "si" ? "kg·m/s" : "MeV/c"}):
                </label>
                <input
                  type="text"
                  id="momentum"
                  name="momentum"
                  value={inputs.momentum}
                  onChange={handleInputChange}
                  placeholder="e.g., 1e-19"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Momentum"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateParticle}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={importFromQuantumMechanics}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Import Probabilities
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
                  Run {index + 1} ({run.mode}
                  {run.mode === "cross-section" ? `, ${run.interactionType}` : ""}, {run.unitSystem},{" "}
                  {new Date(run.timestamp).toLocaleString()}):
                </p>
                {run.mode === "decay-rate" && (
                  <>
                    <p>Initial Particles (N₀): {run.N_0.toFixed(2)}</p>
                    <p>Decay Constant (λ): {run.lambda.toFixed(2)} s⁻¹</p>
                    <p>Time (t): {run.t.toFixed(2)} s</p>
                    <p>Particles at t (N): {run.N.toFixed(2)}</p>
                    <p>Decay Rate (R): {run.R.toFixed(2)} s⁻¹</p>
                  </>
                )}
                {run.mode === "cross-section" && run.interactionType === "rutherford" && (
                  <>
                    <p>Projectile Charge (Z₁): {run.Z_1}</p>
                    <p>Target Charge (Z₂): {run.Z_2}</p>
                    <p>
                      Kinetic Energy: {run.E.toFixed(2)} {run.unitSystem === "si" ? "J" : "MeV"}
                    </p>
                    <p>Scattering Angle (θ): {run.theta.toFixed(2)}°</p>
                    <p>
                      Differential Cross-Section (dσ/dΩ): {run.dSigma_dOmega.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "m²/sr" : "fm²/sr"}
                    </p>
                  </>
                )}
                {run.mode === "cross-section" && run.interactionType === "hard-sphere" && (
                  <>
                    <p>
                      Particle Radius: {run.r.toFixed(2)} {run.unitSystem === "si" ? "m" : "fm"}
                    </p>
                    <p>
                      Total Cross-Section (σ): {run.sigma.toFixed(2)} {run.unitSystem === "si" ? "m²" : "fm²"}
                    </p>
                  </>
                )}
                {run.mode === "relativistic-kinematics" && (
                  <>
                    <p>
                      Particle Mass: {run.m.toFixed(2)} {run.unitSystem === "si" ? "kg" : "MeV/c²"}
                    </p>
                    <p>
                      Momentum: {run.p.toFixed(2)} {run.unitSystem === "si" ? "kg·m/s" : "MeV/c"}
                    </p>
                    <p>
                      Energy (E): {run.E.toFixed(2)} {run.unitSystem === "si" ? "J" : "MeV"}
                    </p>
                    <p>
                      Four-Momentum (Pμ): ({run.P0.toFixed(2)}, {run.p.toFixed(2)}){" "}
                      {run.unitSystem === "si" ? "kg·m/s" : "MeV/c"}
                    </p>
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
export default ParticlePhysicsCalculator;
