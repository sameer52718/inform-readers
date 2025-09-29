"use client";

import React, { useState, useRef, useEffect } from "react";

const BiophysicsCalculator = () => {
  const [mode, setMode] = useState("diffusion");
  const [unitSystem, setUnitSystem] = useState("si");
  const [inputs, setInputs] = useState({
    particleRadius: "",
    viscosity: "",
    temperatureDiffusion: "",
    time: "",
    dissociationConstant: "",
    ligandConcentration: "",
    temperatureBinding: "",
    membranePotential: "",
    temperatureIon: "",
    pk: "",
    pna: "",
    pcl: "",
    kIn: "",
    kOut: "",
    naIn: "",
    naOut: "",
    clIn: "",
    clOut: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const k_B = 1.380649e-23; // Boltzmann constant (J/K)
  const R = 8.314462618; // Gas constant (J/(mol·K))
  const F = 96485.33212; // Faraday constant (C/mol)
  const nm = 1e-9; // nm to m
  const nM = 1e-9; // nM to mol/L
  const mV = 1e-3; // mV to V
  const mM = 1e-3; // mM to mol/L

  useEffect(() => {
    if (!canvasRef.current) return;
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
    document.getElementById("diffusion-inputs").style.display = mode === "diffusion" ? "block" : "none";
    document.getElementById("binding-inputs").style.display = mode === "binding" ? "block" : "none";
    document.getElementById("ion-channel-inputs").style.display = mode === "ion-channel" ? "block" : "none";
  };

  const calculateBio = () => {
    const {
      particleRadius,
      viscosity,
      temperatureDiffusion,
      time,
      dissociationConstant,
      ligandConcentration,
      temperatureBinding,
      membranePotential,
      temperatureIon,
      pk,
      pna,
      pcl,
      kIn,
      kOut,
      naIn,
      naOut,
      clIn,
      clOut,
    } = inputs;
    const steps = [];

    let r = parseFloat(particleRadius),
      eta = parseFloat(viscosity),
      T_diff = parseFloat(temperatureDiffusion),
      t = parseFloat(time);
    let K_d = parseFloat(dissociationConstant),
      L = parseFloat(ligandConcentration),
      T_bind = parseFloat(temperatureBinding);
    let V_m = parseFloat(membranePotential),
      T_ion = parseFloat(temperatureIon),
      P_K_val = parseFloat(pk),
      P_Na_val = parseFloat(pna),
      P_Cl_val = parseFloat(pcl),
      K_in_val = parseFloat(kIn),
      K_out_val = parseFloat(kOut),
      Na_in_val = parseFloat(naIn),
      Na_out_val = parseFloat(naOut),
      Cl_in_val = parseFloat(clIn),
      Cl_out_val = parseFloat(clOut);

    if (unitSystem === "biophysical") {
      if (mode === "diffusion") {
        r *= nm;
        steps.push("Converted particle radius (nm to m).");
      } else if (mode === "binding") {
        K_d *= nM;
        L *= nM;
        steps.push("Converted concentrations (nM to mol/L).");
      } else {
        V_m *= mV;
        K_in_val *= mM;
        K_out_val *= mM;
        Na_in_val *= mM;
        Na_out_val *= mM;
        Cl_in_val *= mM;
        Cl_out_val *= mM;
        steps.push("Converted potential (mV to V), concentrations (mM to mol/L).");
      }
    }

    let result = { mode, unitSystem };

    if (mode === "diffusion") {
      if (isNaN(r) || r <= 0 || isNaN(eta) || eta <= 0 || isNaN(T_diff) || T_diff <= 0 || isNaN(t) || t < 0) {
        setResults(<p className="text-red-500">Positive r, η, T, and non-negative t required.</p>);
        return;
      }
      const D = (k_B * T_diff) / (6 * Math.PI * eta * r);
      const msd = 6 * D * t;
      steps.push(
        `Diffusion coefficient: D = k_B T / (6 π η r) = ${k_B.toFixed(2)} × ${T_diff.toFixed(
          2
        )} / (6 π × ${eta.toFixed(2)} × ${r.toFixed(2)}) = ${D.toFixed(2)} m²/s`
      );
      steps.push(
        `Mean squared displacement: <x²> = 6 D t = 6 × ${D.toFixed(2)} × ${t.toFixed(2)} = ${msd.toFixed(
          2
        )} m²`
      );
      result = { ...result, r, eta, T: T_diff, t, D, msd };
    } else if (mode === "binding") {
      if (isNaN(K_d) || K_d <= 0 || isNaN(L) || L < 0 || isNaN(T_bind) || T_bind <= 0) {
        setResults(<p className="text-red-500">Positive K_d, T, and non-negative [L] required.</p>);
        return;
      }
      const Delta_G = -R * T_bind * Math.log(1 / K_d);
      const theta = L / (L + K_d);
      steps.push(
        `Free energy: ΔG = -R T ln(1/K_d) = -${R.toFixed(2)} × ${T_bind.toFixed(2)} × ln(1 / ${K_d.toFixed(
          2
        )}) = ${Delta_G.toFixed(2)} J/mol`
      );
      steps.push(
        `Fraction bound: θ = [L] / ([L] + K_d) = ${L.toFixed(2)} / (${L.toFixed(2)} + ${K_d.toFixed(
          2
        )}) = ${theta.toFixed(2)}`
      );
      result = { ...result, K_d, L, T: T_bind, Delta_G, theta };
    } else {
      if (
        isNaN(V_m) ||
        isNaN(T_ion) ||
        T_ion <= 0 ||
        isNaN(P_K_val) ||
        P_K_val < 0 ||
        isNaN(P_Na_val) ||
        P_Na_val < 0 ||
        isNaN(P_Cl_val) ||
        P_Cl_val < 0 ||
        isNaN(K_in_val) ||
        K_in_val <= 0 ||
        isNaN(K_out_val) ||
        K_out_val <= 0 ||
        isNaN(Na_in_val) ||
        Na_in_val <= 0 ||
        isNaN(Na_out_val) ||
        Na_out_val <= 0 ||
        isNaN(Cl_in_val) ||
        Cl_in_val <= 0 ||
        isNaN(Cl_out_val) ||
        Cl_out_val <= 0
      ) {
        setResults(
          <p className="text-red-500">
            Valid V_m, positive T, non-negative permeabilities, and positive concentrations required.
          </p>
        );
        return;
      }
      const numerator = P_K_val * K_out_val + P_Na_val * Na_out_val + P_Cl_val * Cl_in_val;
      const denominator = P_K_val * K_in_val + P_Na_val * Na_in_val + P_Cl_val * Cl_out_val;
      const V_r = ((R * T_ion) / F) * Math.log(numerator / denominator);
      const I = 1e-6 * (V_m - V_r);
      steps.push(
        `Reversal potential: V_r = (R T / F) ln((P_K [K⁺]_out + P_Na [Na⁺]_out + P_Cl [Cl⁻]_in) / (P_K [K⁺]_in + P_Na [Na⁺]_in + P_Cl [Cl⁻]_out))`
      );
      steps.push(
        `V_r = (${R.toFixed(2)} × ${T_ion.toFixed(2)} / ${F.toFixed(2)}) × ln((${P_K_val.toFixed(
          2
        )} × ${K_out_val.toFixed(2)} + ${P_Na_val.toFixed(2)} × ${Na_out_val.toFixed(2)} + ${P_Cl_val.toFixed(
          2
        )} × ${Cl_in_val.toFixed(2)}) / (${P_K_val.toFixed(2)} × ${K_in_val.toFixed(2)} + ${P_Na_val.toFixed(
          2
        )} × ${Na_in_val.toFixed(2)} + ${P_Cl_val.toFixed(2)} × ${Cl_out_val.toFixed(2)}))) = ${V_r.toFixed(
          2
        )} V`
      );
      steps.push(
        `Current (scaled): I ∝ (V_m - V_r) = (${V_m.toFixed(2)} - ${V_r.toFixed(2)}) × 10⁻⁶ = ${I.toFixed(
          2
        )} A`
      );
      result = {
        ...result,
        V_m,
        T: T_ion,
        P_K: P_K_val,
        P_Na: P_Na_val,
        P_Cl: P_Cl_val,
        K_in: K_in_val,
        K_out: K_out_val,
        Na_in: Na_in_val,
        Na_out: Na_out_val,
        Cl_in: Cl_in_val,
        Cl_out: Cl_out_val,
        V_r,
        I,
      };
    }

    if (unitSystem === "biophysical") {
      if (mode === "diffusion") {
        result.r /= nm;
        result.D /= nm * nm;
        result.msd /= nm * nm;
        steps.push(
          "Converted outputs to biophysical units: radius (m to nm), diffusion coefficient (m²/s to nm²/s), MSD (m² to nm²)."
        );
      } else if (mode === "binding") {
        result.K_d /= nM;
        result.L /= nM;
        steps.push("Converted outputs to biophysical units: concentrations (mol/L to nM).");
      } else {
        result.V_m /= mV;
        result.V_r /= mV;
        result.K_in /= mM;
        result.K_out /= mM;
        result.Na_in /= mM;
        result.Na_out /= mM;
        result.Cl_in /= mM;
        result.Cl_out /= mM;
        steps.push(
          "Converted outputs to biophysical units: potentials (V to mV), concentrations (mol/L to mM)."
        );
      }
    }

    let html = "";
    if (mode === "diffusion") {
      html = `
        <p>Particle Radius (r): ${result.r.toFixed(2)} ${unitSystem === "si" ? "m" : "nm"}</p>
        <p>Viscosity (η): ${result.eta.toFixed(2)} Pa·s</p>
        <p>Temperature (T): ${result.T.toFixed(2)} K</p>
        <p>Time (t): ${result.t.toFixed(2)} s</p>
        <p>Diffusion Coefficient (D): ${result.D.toFixed(2)} ${unitSystem === "si" ? "m²/s" : "nm²/s"}</p>
        <p>Mean Squared Displacement (&lt;x²&gt;): ${result.msd.toFixed(2)} ${
        unitSystem === "si" ? "m²" : "nm²"
      }</p>
      `;
    } else if (mode === "binding") {
      html = `
        <p>Dissociation Constant (K_d): ${result.K_d.toFixed(2)} ${unitSystem === "si" ? "mol/L" : "nM"}</p>
        <p>Ligand Concentration ([L]): ${result.L.toFixed(2)} ${unitSystem === "si" ? "mol/L" : "nM"}</p>
        <p>Temperature (T): ${result.T.toFixed(2)} K</p>
        <p>Free Energy (ΔG): ${result.Delta_G.toFixed(2)} J/mol</p>
        <p>Fraction Bound (θ): ${result.theta.toFixed(2)}</p>
      `;
    } else {
      html = `
        <p>Membrane Potential (V_m): ${result.V_m.toFixed(2)} ${unitSystem === "si" ? "V" : "mV"}</p>
        <p>Temperature (T): ${result.T.toFixed(2)} K</p>
        <p>Permeability K⁺ (P_K): ${result.P_K.toFixed(2)}</p>
        <p>Permeability Na⁺ (P_Na): ${result.P_Na.toFixed(2)}</p>
        <p>Permeability Cl⁻ (P_Cl): ${result.P_Cl.toFixed(2)}</p>
        <p>K⁺ Inside ([K⁺]_in): ${result.K_in.toFixed(2)} ${unitSystem === "si" ? "mol/L" : "mM"}</p>
        <p>K⁺ Outside ([K⁺]_out): ${result.K_out.toFixed(2)} ${unitSystem === "si" ? "mol/L" : "mM"}</p>
        <p>Na⁺ Inside ([Na⁺]_in): ${result.Na_in.toFixed(2)} ${unitSystem === "si" ? "mol/L" : "mM"}</p>
        <p>Na⁺ Outside ([Na⁺]_out): ${result.Na_out.toFixed(2)} ${unitSystem === "si" ? "mol/L" : "mM"}</p>
        <p>Cl⁻ Inside ([Cl⁻]_in): ${result.Cl_in.toFixed(2)} ${unitSystem === "si" ? "mol/L" : "mM"}</p>
        <p>Cl⁻ Outside ([Cl⁻]_out): ${result.Cl_out.toFixed(2)} ${unitSystem === "si" ? "mol/L" : "mM"}</p>
        <p>Reversal Potential (V_r): ${result.V_r.toFixed(2)} ${unitSystem === "si" ? "V" : "mV"}</p>
        <p>Current (I, scaled): ${result.I.toFixed(2)} A</p>
      `;
    }

    setResults(
      <div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Solution Steps</h2>
        {steps.map((step, idx) => (
          <p key={idx} className="text-sm text-gray-700 mb-2">
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
    ctx.fillStyle = "#000000";
    ctx.fillText(`${result.mode} Visualization`, 10, 20);

    const cx = canvasRef.current.width / 2;
    const cy = canvasRef.current.height / 2;
    const plotWidth = canvasRef.current.width - 100;
    const plotHeight = canvasRef.current.height - 100;

    if (result.mode === "diffusion") {
      const points = 100;
      const maxT = result.t * 2;
      const dt = maxT / points;
      const maxMSD = 6 * result.D * maxT;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const t = i * dt;
        const msd = 6 * result.D * t;
        const px = cx - plotWidth / 2 + (t / maxT) * plotWidth;
        const py = cy + plotHeight / 2 - (msd / maxMSD) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx - plotWidth / 2 + (result.t / maxT) * plotWidth;
      const py = cy + plotHeight / 2 - (result.msd / maxMSD) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(`t=${result.t.toFixed(2)} s`, px + 10, py - 20);
      ctx.fillText(`<x²>=${result.msd.toFixed(2)} ${result.unitSystem === "si" ? "m²" : "nm²"}`, px + 10, py);
      ctx.fillText("t (s)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText(
        `<x²> (${result.unitSystem === "si" ? "m²" : "nm²"})`,
        cx - plotWidth / 2 - 20,
        cy - plotHeight / 2
      );
    } else if (result.mode === "binding") {
      const points = 100;
      const maxL = result.L * 2;
      const dL = maxL / points;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const L = i * dL;
        const theta = L / (L + result.K_d);
        const px = cx - plotWidth / 2 + (L / maxL) * plotWidth;
        const py = cy + plotHeight / 2 - theta * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx - plotWidth / 2 + (result.L / maxL) * plotWidth;
      const py = cy + plotHeight / 2 - result.theta * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(
        `[L]=${result.L.toFixed(2)} ${result.unitSystem === "si" ? "mol/L" : "nM"}`,
        px + 10,
        py - 20
      );
      ctx.fillText(`θ=${result.theta.toFixed(2)}`, px + 10, py);
      ctx.fillText(
        `[L] (${result.unitSystem === "si" ? "mol/L" : "nM"})`,
        cx + plotWidth / 2,
        cy + plotHeight / 2 + 20
      );
      ctx.fillText("θ", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    } else {
      const points = 100;
      const maxV = result.V_m * 2;
      const dV = (2 * maxV) / points;
      const maxI = 1e-6 * (maxV - result.V_r);
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const V = -maxV + i * dV;
        const I = 1e-6 * (V - result.V_r);
        const px = cx - plotWidth / 2 + (i / points) * plotWidth;
        const py = cy + plotHeight / 2 - (I / maxI) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx - plotWidth / 2 + ((result.V_m + maxV) / (2 * maxV)) * plotWidth;
      const py = cy + plotHeight / 2 - (result.I / maxI) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillText(
        `V_m=${result.V_m.toFixed(2)} ${result.unitSystem === "si" ? "V" : "mV"}`,
        px + 10,
        py - 20
      );
      ctx.fillText(`I=${result.I.toFixed(2)} A`, px + 10, py);
      ctx.fillText(
        `V_m (${result.unitSystem === "si" ? "V" : "mV"})`,
        cx + plotWidth / 2,
        cy + plotHeight / 2 + 20
      );
      ctx.fillText("I (A)", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    }
  };

  const clearInputs = () => {
    setInputs({
      particleRadius: "",
      viscosity: "",
      temperatureDiffusion: "",
      time: "",
      dissociationConstant: "",
      ligandConcentration: "",
      temperatureBinding: "",
      membranePotential: "",
      temperatureIon: "",
      pk: "",
      pna: "",
      pcl: "",
      kIn: "",
      kOut: "",
      naIn: "",
      naOut: "",
      clIn: "",
      clOut: "",
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
      "Run,Mode,UnitSystem,Timestamp,r,eta,T_diff,t,D,msd,K_d,L,T_bind,Delta_G,theta,V_m,T_ion,P_K,P_Na,P_Cl,K_in,K_out,Na_in,Na_out,Cl_in,Cl_out,V_r,I",
      ...history.map(
        (run, idx) =>
          `${idx + 1},${run.mode},${run.unitSystem},${run.timestamp},${run.r ? run.r.toFixed(2) : ""},${
            run.eta ? run.eta.toFixed(2) : ""
          },${run.T && run.mode === "diffusion" ? run.T.toFixed(2) : ""},${run.t ? run.t.toFixed(2) : ""},${
            run.D ? run.D.toFixed(2) : ""
          },${run.msd ? run.msd.toFixed(2) : ""},${run.K_d ? run.K_d.toFixed(2) : ""},${
            run.L ? run.L.toFixed(2) : ""
          },${run.T && run.mode === "binding" ? run.T.toFixed(2) : ""},${
            run.Delta_G ? run.Delta_G.toFixed(2) : ""
          },${run.theta ? run.theta.toFixed(2) : ""},${run.V_m ? run.V_m.toFixed(2) : ""},${
            run.T && run.mode === "ion-channel" ? run.T.toFixed(2) : ""
          },${run.P_K ? run.P_K.toFixed(2) : ""},${run.P_Na ? run.P_Na.toFixed(2) : ""},${
            run.P_Cl ? run.P_Cl.toFixed(2) : ""
          },${run.K_in ? run.K_in.toFixed(2) : ""},${run.K_out ? run.K_out.toFixed(2) : ""},${
            run.Na_in ? run.Na_in.toFixed(2) : ""
          },${run.Na_out ? run.Na_out.toFixed(2) : ""},${run.Cl_in ? run.Cl_in.toFixed(2) : ""},${
            run.Cl_out ? run.Cl_out.toFixed(2) : ""
          },${run.V_r ? run.V_r.toFixed(2) : ""},${run.I ? run.I.toFixed(2) : ""}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "biophysics_data.csv";
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
    a.download = "biophysics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromThermodynamics = () => {
    alert("Import from Thermodynamics Calculator not implemented. Please enter parameters manually.");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateBio();
    if (e.key === "c") clearInputs();
  };

  return (
    <div className=" bg-gray-50 py-12" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Biophysics Calculator</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Calculation Mode:</label>
              <select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                <option value="diffusion">Molecular Diffusion</option>
                <option value="binding">Protein-Ligand Binding</option>
                <option value="ion-channel">Ion Channel Current</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit System:</label>
              <select
                id="unit-system"
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                <option value="si">SI (m, kg, s, J, A, V)</option>
                <option value="biophysical">Biophysical (nm, Pa·s, K, s, nM, mV, mM)</option>
              </select>
            </div>
          </div>
          <div id="diffusion-inputs" className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Molecular Diffusion Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Particle Radius (nm):</label>
                <input
                  type="text"
                  name="particleRadius"
                  value={inputs.particleRadius}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Viscosity (Pa·s):</label>
                <input
                  type="text"
                  name="viscosity"
                  value={inputs.viscosity}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.001"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature (K):</label>
                <input
                  type="text"
                  name="temperatureDiffusion"
                  value={inputs.temperatureDiffusion}
                  onChange={handleInputChange}
                  placeholder="e.g., 298"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time (s):</label>
                <input
                  type="text"
                  name="time"
                  value={inputs.time}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
          <div id="binding-inputs" className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Protein-Ligand Binding Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Dissociation Constant (nM):</label>
                <input
                  type="text"
                  name="dissociationConstant"
                  value={inputs.dissociationConstant}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ligand Concentration (nM):</label>
                <input
                  type="text"
                  name="ligandConcentration"
                  value={inputs.ligandConcentration}
                  onChange={handleInputChange}
                  placeholder="e.g., 50"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature (K):</label>
                <input
                  type="text"
                  name="temperatureBinding"
                  value={inputs.temperatureBinding}
                  onChange={handleInputChange}
                  placeholder="e.g., 298"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
          <div id="ion-channel-inputs" className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ion Channel Current Inputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Membrane Potential (mV):</label>
                <input
                  type="text"
                  name="membranePotential"
                  value={inputs.membranePotential}
                  onChange={handleInputChange}
                  placeholder="e.g., -70"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature (K):</label>
                <input
                  type="text"
                  name="temperatureIon"
                  value={inputs.temperatureIon}
                  onChange={handleInputChange}
                  placeholder="e.g., 310"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Permeability K⁺:</label>
                <input
                  type="text"
                  name="pk"
                  value={inputs.pk}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Permeability Na⁺:</label>
                <input
                  type="text"
                  name="pna"
                  value={inputs.pna}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.04"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Permeability Cl⁻:</label>
                <input
                  type="text"
                  name="pcl"
                  value={inputs.pcl}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.45"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">K⁺ Inside (mM):</label>
                <input
                  type="text"
                  name="kIn"
                  value={inputs.kIn}
                  onChange={handleInputChange}
                  placeholder="e.g., 140"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">K⁺ Outside (mM):</label>
                <input
                  type="text"
                  name="kOut"
                  value={inputs.kOut}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Na⁺ Inside (mM):</label>
                <input
                  type="text"
                  name="naIn"
                  value={inputs.naIn}
                  onChange={handleInputChange}
                  placeholder="e.g., 10"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Na⁺ Outside (mM):</label>
                <input
                  type="text"
                  name="naOut"
                  value={inputs.naOut}
                  onChange={handleInputChange}
                  placeholder="e.g., 145"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cl⁻ Inside (mM):</label>
                <input
                  type="text"
                  name="clIn"
                  value={inputs.clIn}
                  onChange={handleInputChange}
                  placeholder="e.g., 110"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cl⁻ Outside (mM):</label>
                <input
                  type="text"
                  name="clOut"
                  value={inputs.clOut}
                  onChange={handleInputChange}
                  placeholder="e.g., 15"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={calculateBio}
              className="flex-1 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Calculate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiophysicsCalculator;
