"use client";

import React, { useState, useEffect, useRef } from "react";

const NuclearPhysicsCalculator = () => {
  const [mode, setMode] = useState("binding-energy");
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    protonNumber: "",
    neutronNumber: "",
    parentProtonNumber: "",
    parentNeutronNumber: "",
    kineticEnergy: "",
    targetProtonNumber: "",
    projectileProtonNumber: "",
    reducedMass: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const constants = {
    m_p: 938.272081, // Proton mass in MeV/c²
    m_n: 939.565413, // Neutron mass in MeV/c²
    m_alpha: 3727.379378, // Alpha particle mass in MeV/c²
    c: 2.99792458e8, // Speed of light in m/s
    hbar: 6.582119569e-22, // Reduced Planck constant in MeV·s
    e: 1.60217662e-19, // Elementary charge in C
    epsilon_0: 8.854187817e-12, // Permittivity of free space in F/m
    a_V: 15.8, // Volume term in MeV
    a_S: 18.3, // Surface term in MeV
    a_C: 0.72, // Coulomb term in MeV
    a_A: 23.2, // Asymmetry term in MeV
    a_P: 12, // Pairing term in MeV
    MeV_to_J: 1.60217662e-13, // MeV to J
    fm: 1e-15, // Femtometer to m
    MeV_c2_to_kg: 1.78266192e-30, // MeV/c² to kg
  };

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

  const nuclearMass = (Z, N) => {
    const A = Z + N;
    const volumeTerm = constants.a_V * A;
    const surfaceTerm = -constants.a_S * Math.pow(A, 2 / 3);
    const coulombTerm = (-constants.a_C * Z * (Z - 1)) / Math.pow(A, 1 / 3);
    const asymmetryTerm = (-constants.a_A * Math.pow(Z - N, 2)) / A;
    const pairingTerm =
      A % 2 === 0 && Z % 2 === 0
        ? constants.a_P / Math.pow(A, 1 / 2)
        : A % 2 === 0 && Z % 2 !== 0
        ? -constants.a_P / Math.pow(A, 1 / 2)
        : 0;
    const B = volumeTerm + surfaceTerm + coulombTerm + asymmetryTerm + pairingTerm;
    const M = Z * constants.m_p + N * constants.m_n - B;
    return { M, B, volumeTerm, surfaceTerm, coulombTerm, asymmetryTerm, pairingTerm };
  };

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculateNuclear = () => {
    try {
      const protonNumber = parseInt(inputs.protonNumber);
      const neutronNumber = parseInt(inputs.neutronNumber);
      const parentProtonNumber = parseInt(inputs.parentProtonNumber);
      const parentNeutronNumber = parseInt(inputs.parentNeutronNumber);
      const kineticEnergy = parseFloat(inputs.kineticEnergy);
      const targetProtonNumber = parseInt(inputs.targetProtonNumber);
      const projectileProtonNumber = parseInt(inputs.projectileProtonNumber);
      const reducedMass = parseFloat(inputs.reducedMass);
      const steps = [];

      let Z,
        N,
        E = kineticEnergy,
        Z_t = targetProtonNumber,
        Z_p = projectileProtonNumber,
        mu = reducedMass;
      if (unitSystem === "nuclear" && mode === "reaction-cross-section") {
        E *= constants.MeV_to_J;
        mu *= constants.MeV_c2_to_kg;
        steps.push("Converted kinetic energy (MeV to J), reduced mass (MeV/c² to kg).");
      } else {
        Z = mode === "binding-energy" ? protonNumber : parentProtonNumber;
        N = mode === "binding-energy" ? neutronNumber : parentNeutronNumber;
      }

      let result = { mode, unitSystem };

      if (mode === "binding-energy") {
        if (isNaN(Z) || Z < 0 || isNaN(N) || N < 0) {
          setResults(<p className="text-red-500">Non-negative Z and N required.</p>);
          return;
        }
        const A = Z + N;
        const { M, B, volumeTerm, surfaceTerm, coulombTerm, asymmetryTerm, pairingTerm } = nuclearMass(Z, N);
        const massDefect = Z * constants.m_p + N * constants.m_n - M;
        const bindingEnergy = B;
        const bindingPerNucleon = B / A;
        steps.push(`Mass number: A = Z + N = ${Z} + ${N} = ${A}`);
        steps.push(`Volume term: ${constants.a_V} × ${A} = ${volumeTerm.toFixed(2)} MeV`);
        steps.push(`Surface term: -${constants.a_S} × A^(2/3) = ${surfaceTerm.toFixed(2)} MeV`);
        steps.push(`Coulomb term: -${constants.a_C} × Z × (Z-1) / A^(1/3) = ${coulombTerm.toFixed(2)} MeV`);
        steps.push(`Asymmetry term: -${constants.a_A} × (Z-N)² / A = ${asymmetryTerm.toFixed(2)} MeV`);
        steps.push(`Pairing term: ${pairingTerm.toFixed(2)} MeV`);
        steps.push(`Binding energy: B = ${B.toFixed(2)} MeV`);
        steps.push(`Mass defect: Δm = Z m_p + N m_n - M = ${massDefect.toFixed(2)} MeV/c²`);
        steps.push(`Binding energy per nucleon: B/A = ${bindingPerNucleon.toFixed(2)} MeV`);
        result = {
          ...result,
          Z,
          N,
          A,
          massDefect: unitSystem === "si" ? massDefect * constants.MeV_c2_to_kg : massDefect,
          bindingEnergy: unitSystem === "si" ? bindingEnergy * constants.MeV_to_J : bindingEnergy,
          bindingPerNucleon: unitSystem === "si" ? bindingPerNucleon * constants.MeV_to_J : bindingPerNucleon,
        };
        setResults(
          <div>
            <p>Proton Number (Z): {result.Z}</p>
            <p>Neutron Number (N): {result.N}</p>
            <p>Mass Number (A): {result.A}</p>
            <p>
              Mass Defect (Δm): {result.massDefect.toFixed(2)} {unitSystem === "si" ? "kg" : "MeV/c²"}
            </p>
            <p>
              Binding Energy (B): {result.bindingEnergy.toFixed(2)} {unitSystem === "si" ? "J" : "MeV"}
            </p>
            <p>
              Binding Energy per Nucleon (B/A): {result.bindingPerNucleon.toFixed(2)}{" "}
              {unitSystem === "si" ? "J" : "MeV"}
            </p>
            <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
            {steps.map((step, idx) => (
              <p key={idx} className="text-sm text-gray-700 mb-2">
                {step}
              </p>
            ))}
          </div>
        );
      } else if (mode === "alpha-decay") {
        if (isNaN(Z) || Z < 2 || isNaN(N) || N < 2) {
          setResults(<p className="text-red-500">Z ≥ 2 and N ≥ 2 required for alpha decay.</p>);
          return;
        }
        const parent = nuclearMass(Z, N);
        const daughter = nuclearMass(Z - 2, N - 2);
        const Q = parent.M - daughter.M - constants.m_alpha;
        const isFeasible = Q > 0;
        steps.push(`Parent mass: M(Z=${Z}, N=${N}) = ${parent.M.toFixed(2)} MeV/c²`);
        steps.push(`Daughter mass: M(Z=${Z - 2}, N=${N - 2}) = ${daughter.M.toFixed(2)} MeV/c²`);
        steps.push(`Alpha particle mass: M_α = ${constants.m_alpha.toFixed(2)} MeV/c²`);
        steps.push(`Q-value: Q = ${Q.toFixed(2)} MeV`);
        steps.push(`Decay feasible: ${isFeasible ? "Yes" : "No"}`);
        result = {
          ...result,
          Z,
          N,
          Q: unitSystem === "si" ? Q * constants.MeV_to_J : Q,
          isFeasible,
          parentMass: unitSystem === "si" ? parent.M * constants.MeV_c2_to_kg : parent.M,
          daughterMass: unitSystem === "si" ? daughter.M * constants.MeV_c2_to_kg : daughter.M,
        };
        setResults(
          <div>
            <p>Parent Proton Number (Z): {result.Z}</p>
            <p>Parent Neutron Number (N): {result.N}</p>
            <p>
              Parent Mass: {result.parentMass.toFixed(2)} {unitSystem === "si" ? "kg" : "MeV/c²"}
            </p>
            <p>
              Daughter Mass: {result.daughterMass.toFixed(2)} {unitSystem === "si" ? "kg" : "MeV/c²"}
            </p>
            <p>
              Q-Value: {result.Q.toFixed(2)} {unitSystem === "si" ? "J" : "MeV"}
            </p>
            <p>Decay Feasible: {result.isFeasible ? "Yes" : "No"}</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
            {steps.map((step, idx) => (
              <p key={idx} className="text-sm text-gray-700 mb-2">
                {step}
              </p>
            ))}
          </div>
        );
      } else if (mode === "reaction-cross-section") {
        if (isNaN(E) || E <= 0 || isNaN(Z_t) || Z_t < 0 || isNaN(Z_p) || Z_p < 0 || isNaN(mu) || mu <= 0) {
          setResults(
            <p className="text-red-500">Positive E, non-negative Zₜ, Zₚ, and positive μ required.</p>
          );
          return;
        }
        const r = 1.2e-15 * (Math.pow(Z_t + Z_p, 1 / 3) + 1);
        const V_C = (Z_p * Z_t * constants.e * constants.e) / (4 * Math.PI * constants.epsilon_0 * r);
        const V_C_MeV = V_C / constants.MeV_to_J;
        const sigma = Math.PI * r * r;
        const sigma_barns = sigma / 1e-28;
        steps.push(`Nuclear radius: r = 1.2 fm × (Zₜ + Zₚ)^(1/3) + 1 = ${r.toFixed(2)} m`);
        steps.push(`Coulomb barrier: V_C = ${V_C.toFixed(2)} J = ${V_C_MeV.toFixed(2)} MeV`);
        steps.push(`Geometric cross-section: σ = ${sigma.toFixed(2)} m² = ${sigma_barns.toFixed(2)} barns`);
        result = {
          ...result,
          E,
          Z_t,
          Z_p,
          mu,
          V_C,
          sigma,
          V_C_MeV,
          sigma_barns,
        };
        if (unitSystem === "nuclear") {
          result.E /= constants.MeV_to_J;
          result.mu /= constants.MeV_c2_to_kg;
          result.V_C = result.V_C_MeV;
          result.sigma = result.sigma_barns;
          steps.push(
            "Converted outputs to nuclear units: energy (J to MeV), reduced mass (kg to MeV/c²), cross-section (m² to barns)."
          );
        }
        setResults(
          <div>
            <p>
              Projectile Kinetic Energy: {result.E.toFixed(2)} {unitSystem === "si" ? "J" : "MeV"}
            </p>
            <p>Target Proton Number (Zₜ): {result.Z_t}</p>
            <p>Projectile Proton Number (Zₚ): {result.Z_p}</p>
            <p>
              Reduced Mass (μ): {result.mu.toFixed(2)} {unitSystem === "si" ? "kg" : "MeV/c²"}
            </p>
            <p>
              Coulomb Barrier (V_C): {result.V_C.toFixed(2)} {unitSystem === "si" ? "J" : "MeV"}
            </p>
            <p>
              Cross-Section (σ): {result.sigma.toFixed(2)} {unitSystem === "si" ? "m²" : "barns"}
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
    ctx.fillText(`${result.mode} Visualization`, 10, 20);

    const cx = canvasRef.current.width / 2;
    const cy = canvasRef.current.height / 2;
    const plotWidth = canvasRef.current.width - 100;
    const plotHeight = canvasRef.current.height - 100;

    if (result.mode === "binding-energy") {
      const points = 100;
      const maxA = result.A * 2;
      const da = maxA / points;
      const maxBA = result.bindingPerNucleon * 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const A = i * da;
        const Z = Math.round(A / 2);
        const N = Math.round(A - Z);
        const { B } = nuclearMass(Z, N);
        const BA = B / A;
        const px = cx - plotWidth / 2 + (A / maxA) * plotWidth;
        const py = cy + plotHeight / 2 - (BA / maxBA) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx - plotWidth / 2 + (result.A / maxA) * plotWidth;
      const py = cy + plotHeight / 2 - (result.bindingPerNucleon / maxBA) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`A=${result.A}`, px + 10, py - 20);
      ctx.fillText(
        `B/A=${result.bindingPerNucleon.toFixed(2)} ${result.unitSystem === "si" ? "J" : "MeV"}`,
        px + 10,
        py
      );
      ctx.fillText("A", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText(
        `B/A (${result.unitSystem === "si" ? "J" : "MeV"})`,
        cx - plotWidth / 2 - 20,
        cy - plotHeight / 2
      );
    } else if (result.mode === "alpha-decay") {
      const parentLevel = cy - plotHeight / 4;
      const daughterLevel = cy + plotHeight / 4;
      ctx.beginPath();
      ctx.moveTo(cx - plotWidth / 4, parentLevel);
      ctx.lineTo(cx + plotWidth / 4, parentLevel);
      ctx.moveTo(cx - plotWidth / 4, daughterLevel);
      ctx.lineTo(cx + plotWidth / 4, daughterLevel);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`Parent (Z=${result.Z}, N=${result.N})`, cx + plotWidth / 4 + 10, parentLevel);
      ctx.fillText(
        `Daughter (Z=${result.Z - 2}, N=${result.N - 2}) + α`,
        cx + plotWidth / 4 + 10,
        daughterLevel
      );
      ctx.fillText(`Q=${result.Q.toFixed(2)} ${result.unitSystem === "si" ? "J" : "MeV"}`, cx, cy);
      ctx.beginPath();
      ctx.moveTo(cx, parentLevel);
      ctx.lineTo(cx, daughterLevel);
      ctx.strokeStyle = "#10b981";
      ctx.stroke();
    } else if (result.mode === "reaction-cross-section") {
      const points = 100;
      const maxE = result.E * 2;
      const dE = maxE / points;
      const maxSigma = result.sigma * 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const E = i * dE;
        const px = cx - plotWidth / 2 + (E / maxE) * plotWidth;
        const py = cy + plotHeight / 2 - (result.sigma / maxSigma) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const pxBarrier = cx - plotWidth / 2 + (result.V_C / maxE) * plotWidth;
      ctx.beginPath();
      ctx.moveTo(pxBarrier, cy + plotHeight / 2);
      ctx.lineTo(pxBarrier, cy - plotHeight / 2);
      ctx.strokeStyle = "#ef4444";
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(
        `V_C=${result.V_C.toFixed(2)} ${result.unitSystem === "si" ? "J" : "MeV"}`,
        pxBarrier + 10,
        cy - plotHeight / 2 + 20
      );

      const px = cx - plotWidth / 2 + (result.E / maxE) * plotWidth;
      const py = cy + plotHeight / 2 - (result.sigma / maxSigma) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillText(`E=${result.E.toFixed(2)} ${result.unitSystem === "si" ? "J" : "MeV"}`, px + 10, py - 20);
      ctx.fillText(
        `σ=${result.sigma.toFixed(2)} ${result.unitSystem === "si" ? "m²" : "barns"}`,
        px + 10,
        py
      );
      ctx.fillText(
        `E (${result.unitSystem === "si" ? "J" : "MeV"})`,
        cx + plotWidth / 2,
        cy + plotHeight / 2 + 20
      );
      ctx.fillText(
        `σ (${result.unitSystem === "si" ? "m²" : "barns"})`,
        cx - plotWidth / 2 - 20,
        cy - plotHeight / 2
      );
    }
  };

  const clearInputs = () => {
    setInputs({
      protonNumber: "",
      neutronNumber: "",
      parentProtonNumber: "",
      parentNeutronNumber: "",
      kineticEnergy: "",
      targetProtonNumber: "",
      projectileProtonNumber: "",
      reducedMass: "",
    });
    setResults(null);
    setHistory([]);
    if (ctxRef.current) ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const importFromParticlePhysics = () => {
    alert("Import from Particle Physics Calculator not implemented. Please enter parameters manually.");
  };

  const exportCSV = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const csv = [
      "Run,Mode,UnitSystem,Timestamp,Z,N,A,MassDefect,BindingEnergy,BindingPerNucleon,ParentMass,DaughterMass,Q,Feasible,E,Zt,Zp,Mu,VC,Sigma",
      ...history.map(
        (run, index) => `
        ${index + 1},${run.mode},${run.unitSystem},${run.timestamp},
        ${run.Z || ""},${run.N || ""},${run.A || ""},
        ${run.massDefect ? run.massDefect.toFixed(2) : ""},${
          run.bindingEnergy ? run.bindingEnergy.toFixed(2) : ""
        },
        ${run.bindingPerNucleon ? run.bindingPerNucleon.toFixed(2) : ""},
        ${run.parentMass ? run.parentMass.toFixed(2) : ""},${
          run.daughterMass ? run.daughterMass.toFixed(2) : ""
        },
        ${run.Q ? run.Q.toFixed(2) : ""},${run.isFeasible !== undefined ? run.isFeasible : ""},
        ${run.E ? run.E.toFixed(2) : ""},${run.Z_t || ""},${run.Z_p || ""},
        ${run.mu ? run.mu.toFixed(2) : ""},${run.V_C ? run.V_C.toFixed(2) : ""},${
          run.sigma ? run.sigma.toFixed(2) : ""
        }
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nuclear_physics_data.csv";
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
    a.download = "nuclear_physics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateNuclear();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className="min-h-screen bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-5xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Nuclear Physics Calculator</h1>
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
              <option value="binding-energy">Binding Energy</option>
              <option value="alpha-decay">Alpha Decay</option>
              <option value="reaction-cross-section">Reaction Cross-Section</option>
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
              <option value="nuclear">Nuclear (MeV, fm, s)</option>
            </select>
          </div>
        </div>
        {mode === "binding-energy" && (
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Binding Energy Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="proton-number" className="block text-sm font-medium text-gray-700 mb-2">
                  Proton Number (Z):
                </label>
                <input
                  type="text"
                  id="proton-number"
                  name="protonNumber"
                  value={inputs.protonNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 26"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Proton number"
                />
              </div>
              <div>
                <label htmlFor="neutron-number" className="block text-sm font-medium text-gray-700 mb-2">
                  Neutron Number (N):
                </label>
                <input
                  type="text"
                  id="neutron-number"
                  name="neutronNumber"
                  value={inputs.neutronNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Neutron number"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "alpha-decay" && (
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Alpha Decay Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="parent-proton-number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Parent Proton Number (Z):
                </label>
                <input
                  type="text"
                  id="parent-proton-number"
                  name="parentProtonNumber"
                  value={inputs.parentProtonNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 92"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Parent proton number"
                />
              </div>
              <div>
                <label
                  htmlFor="parent-neutron-number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Parent Neutron Number (N):
                </label>
                <input
                  type="text"
                  id="parent-neutron-number"
                  name="parentNeutronNumber"
                  value={inputs.parentNeutronNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 146"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Parent neutron number"
                />
              </div>
            </div>
          </div>
        )}
        {mode === "reaction-cross-section" && (
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Reaction Cross-Section Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="kinetic-energy" className="block text-sm font-medium text-gray-700 mb-2">
                  Projectile Kinetic Energy (MeV):
                </label>
                <input
                  type="text"
                  id="kinetic-energy"
                  name="kineticEnergy"
                  value={inputs.kineticEnergy}
                  onChange={handleInputChange}
                  placeholder="e.g., 10"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Projectile kinetic energy"
                />
              </div>
              <div>
                <label
                  htmlFor="target-proton-number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Target Proton Number (Zₜ):
                </label>
                <input
                  type="text"
                  id="target-proton-number"
                  name="targetProtonNumber"
                  value={inputs.targetProtonNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 26"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Target proton number"
                />
              </div>
              <div>
                <label
                  htmlFor="projectile-proton-number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Projectile Proton Number (Zₚ):
                </label>
                <input
                  type="text"
                  id="projectile-proton-number"
                  name="projectileProtonNumber"
                  value={inputs.projectileProtonNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Projectile proton number"
                />
              </div>
              <div>
                <label htmlFor="reduced-mass" className="block text-sm font-medium text-gray-700 mb-2">
                  Reduced Mass (MeV/c²):
                </label>
                <input
                  type="text"
                  id="reduced-mass"
                  name="reducedMass"
                  value={inputs.reducedMass}
                  onChange={handleInputChange}
                  placeholder="e.g., 1864"
                  className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                  aria-label="Reduced mass"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateNuclear}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={importFromParticlePhysics}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Import Decay Rates
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
                {run.mode === "binding-energy" && (
                  <>
                    <p>Proton Number (Z): {run.Z}</p>
                    <p>Neutron Number (N): {run.N}</p>
                    <p>Mass Number (A): {run.A}</p>
                    <p>
                      Mass Defect (Δm): {run.massDefect.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "kg" : "MeV/c²"}
                    </p>
                    <p>
                      Binding Energy (B): {run.bindingEnergy.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "J" : "MeV"}
                    </p>
                    <p>
                      Binding Energy per Nucleon (B/A): {run.bindingPerNucleon.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "J" : "MeV"}
                    </p>
                  </>
                )}
                {run.mode === "alpha-decay" && (
                  <>
                    <p>Parent Proton Number (Z): {run.Z}</p>
                    <p>Parent Neutron Number (N): {run.N}</p>
                    <p>
                      Parent Mass: {run.parentMass.toFixed(2)} {run.unitSystem === "si" ? "kg" : "MeV/c²"}
                    </p>
                    <p>
                      Daughter Mass: {run.daughterMass.toFixed(2)} {run.unitSystem === "si" ? "kg" : "MeV/c²"}
                    </p>
                    <p>
                      Q-Value: {run.Q.toFixed(2)} {run.unitSystem === "si" ? "J" : "MeV"}
                    </p>
                    <p>Decay Feasible: {run.isFeasible ? "Yes" : "No"}</p>
                  </>
                )}
                {run.mode === "reaction-cross-section" && (
                  <>
                    <p>
                      Projectile Kinetic Energy: {run.E.toFixed(2)} {run.unitSystem === "si" ? "J" : "MeV"}
                    </p>
                    <p>Target Proton Number (Zₜ): {run.Z_t}</p>
                    <p>Projectile Proton Number (Zₚ): {run.Z_p}</p>
                    <p>
                      Reduced Mass (μ): {run.mu.toFixed(2)} {run.unitSystem === "si" ? "kg" : "MeV/c²"}
                    </p>
                    <p>
                      Coulomb Barrier (V_C): {run.V_C.toFixed(2)} {run.unitSystem === "si" ? "J" : "MeV"}
                    </p>
                    <p>
                      Cross-Section (σ): {run.sigma.toFixed(2)} {run.unitSystem === "si" ? "m²" : "barns"}
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

export default NuclearPhysicsCalculator;
