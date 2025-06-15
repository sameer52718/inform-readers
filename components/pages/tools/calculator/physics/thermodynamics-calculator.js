"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [processType, setProcessType] = useState("isothermal");
  const [unitSystem, setUnitSystem] = useState("si");
  const [gasType, setGasType] = useState("monatomic");
  const [moles, setMoles] = useState("");
  const [cv, setCv] = useState("");
  const [cp, setCp] = useState("");
  const [pressure1, setPressure1] = useState("");
  const [volume1, setVolume1] = useState("");
  const [temperature1, setTemperature1] = useState("");
  const [pressure2, setPressure2] = useState("");
  const [volume2, setVolume2] = useState("");
  const [temperature2, setTemperature2] = useState("");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const R = 8.314; // Gas constant in J/mol·K

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 400;
    }
  }, []);

  const toggleCustomGas = () => gasType === "custom";

  const calculateThermo = () => {
    const values = {
      n: parseFloat(moles),
      Cv: parseFloat(cv),
      Cp: parseFloat(cp),
      P1: parseFloat(pressure1),
      V1: parseFloat(volume1),
      T1: parseFloat(temperature1),
      P2: parseFloat(pressure2),
      V2: parseFloat(volume2),
      T2: parseFloat(temperature2),
    };
    const steps = [];

    // Unit conversions for imperial
    let { n, P1, V1, T1, P2, V2, T2, Cv, Cp } = values;
    if (unitSystem === "imperial") {
      P1 *= 0.000145038; // Pa to psi
      P2 *= 0.000145038;
      V1 *= 35.3147; // m³ to ft³
      V2 *= 35.3147;
      T1 *= 1.8; // K to °R
      T2 *= 1.8;
      steps.push("Converted inputs to imperial: pressures, volumes, temperatures.");
    }

    // Gas properties
    if (gasType === "monatomic") {
      Cv = 1.5 * R;
      Cp = 2.5 * R;
      steps.push(
        `Monatomic gas: C_v = 1.5R = ${Cv.toFixed(2)} J/mol·K, C_p = 2.5R = ${Cp.toFixed(2)} J/mol·K`
      );
    } else if (gasType === "diatomic") {
      Cv = 2.5 * R;
      Cp = 3.5 * R;
      steps.push(
        `Diatomic gas: C_v = 2.5R = ${Cv.toFixed(2)} J/mol·K, C_p = 3.5R = ${Cp.toFixed(2)} J/mol·K`
      );
    } else {
      if (isNaN(Cv) || isNaN(Cp) || Cv <= 0 || Cp <= 0) {
        setResults({ error: "Custom C_v and C_p must be positive." });
        return;
      }
      steps.push(`Custom gas: C_v = ${Cv.toFixed(2)} J/mol·K, C_p = ${Cp.toFixed(2)} J/mol·K`);
    }

    // Input validation
    if (isNaN(n) || n <= 0) {
      setResults({ error: "Moles must be positive." });
      return;
    }
    if (isNaN(P1) || P1 <= 0 || isNaN(V1) || V1 <= 0 || isNaN(T1) || T1 <= 0) {
      setResults({ error: "Initial state must have positive pressure, volume, and temperature." });
      return;
    }

    // Verify initial state with ideal gas law: PV = nRT
    const idealGasCheck1 = Math.abs(P1 * V1 - n * R * T1) / (P1 * V1);
    if (idealGasCheck1 > 0.01) {
      setResults({ error: "Initial state violates ideal gas law (PV = nRT)." });
      return;
    }
    steps.push(
      `Initial state: PV = nRT → ${P1.toFixed(2)} × ${V1.toFixed(4)} ≈ ${n.toFixed(2)} × ${R.toFixed(
        2
      )} × ${T1.toFixed(2)}`
    );

    // Process calculations
    let W, Q, deltaU, deltaS, P2_calc, V2_calc, T2_calc;

    if (processType === "isothermal") {
      if (!isNaN(T2) && Math.abs(T2 - T1) > 0.01) {
        setResults({ error: "Isothermal process requires T₁ = T₂." });
        return;
      }
      T2 = T1;
      if (!isNaN(V2)) {
        P2_calc = (P1 * V1) / V2;
        steps.push(
          `Isothermal: P₁ V₁ = P₂ V₂ → P₂ = ${P1} × ${V1} / ${V2} = ${P2_calc.toFixed(2)} ${
            unitSystem === "si" ? "Pa" : "psi"
          }`
        );
      } else if (!isNaN(P2)) {
        V2_calc = (P1 * V1) / P2;
        steps.push(
          `Isothermal: P₁ V₁ = P₂ V₂ → V₂ = ${P1} × ${V1} / ${P2} = ${V2_calc.toFixed(4)} ${
            unitSystem === "si" ? "m³" : "ft³"
          }`
        );
      } else {
        setResults({ error: "Provide final volume or pressure." });
        return;
      }
      P2 = !isNaN(P2) ? P2 : P2_calc;
      V2 = !isNaN(V2) ? V2 : V2_calc;
      W = n * R * T1 * Math.log(V2 / V1);
      deltaU = 0;
      Q = W;
      deltaS = n * R * Math.log(V2 / V1);
      steps.push(
        `Work: W = nRT ln(V₂/V₁) = ${n} × ${R} × ${T1} × ln(${V2}/${V1}) = ${W.toFixed(2)} ${
          unitSystem === "si" ? "J" : "ft-lbf"
        }`
      );
      steps.push(`Internal energy: ΔU = 0 (isothermal)`);
      steps.push(
        `Heat: Q = ΔU + W = 0 + ${W.toFixed(2)} = ${Q.toFixed(2)} ${unitSystem === "si" ? "J" : "ft-lbf"}`
      );
      steps.push(
        `Entropy: ΔS = nR ln(V₂/V₁) = ${n} × ${R} × ln(${V2}/${V1}) = ${deltaS.toFixed(2)} ${
          unitSystem === "si" ? "J/K" : "ft-lbf/°R"
        }`
      );
    } else if (processType === "isobaric") {
      P2 = P1;
      if (!isNaN(V2)) {
        T2_calc = (T1 * V2) / V1;
        steps.push(
          `Isobaric: V₁/T₁ = V₂/T₂ → T₂ = ${T1} × ${V2} / ${V1} = ${T2_calc.toFixed(2)} ${
            unitSystem === "si" ? "K" : "°R"
          }`
        );
      } else if (!isNaN(T2)) {
        V2_calc = (V1 * T2) / T1;
        steps.push(
          `Isobaric: V₁/T₁ = V₂/T₂ → V₂ = ${V1} × ${T2} / ${T1} = ${V2_calc.toFixed(4)} ${
            unitSystem === "si" ? "m³" : "ft³"
          }`
        );
      } else {
        setResults({ error: "Provide final volume or temperature." });
        return;
      }
      V2 = !isNaN(V2) ? V2 : V2_calc;
      T2 = !isNaN(T2) ? T2 : T2_calc;
      W = P1 * (V2 - V1);
      deltaU = n * Cv * (T2 - T1);
      Q = n * Cp * (T2 - T1);
      deltaS = n * Cp * Math.log(T2 / T1);
      steps.push(
        `Work: W = P ΔV = ${P1} × (${V2} - ${V1}) = ${W.toFixed(2)} ${unitSystem === "si" ? "J" : "ft-lbf"}`
      );
      steps.push(
        `Internal energy: ΔU = n C_v ΔT = ${n} × ${Cv} × (${T2} - ${T1}) = ${deltaU.toFixed(2)} ${
          unitSystem === "si" ? "J" : "ft-lbf"
        }`
      );
      steps.push(
        `Heat: Q = n C_p ΔT = ${n} × ${Cp} × (${T2} - ${T1}) = ${Q.toFixed(2)} ${
          unitSystem === "si" ? "J" : "ft-lbf"
        }`
      );
      steps.push(
        `Entropy: ΔS = n C_p ln(T₂/T₁) = ${n} × ${Cp} × ln(${T2}/${T1}) = ${deltaS.toFixed(2)} ${
          unitSystem === "si" ? "J/K" : "ft-lbf/°R"
        }`
      );
    } else if (processType === "isochoric") {
      V2 = V1;
      if (!isNaN(P2)) {
        T2_calc = (T1 * P2) / P1;
        steps.push(
          `Isochoric: P₁/T₁ = P₂/T₂ → T₂ = ${T1} × ${P2} / ${P1} = ${T2_calc.toFixed(2)} ${
            unitSystem === "si" ? "K" : "°R"
          }`
        );
      } else if (!isNaN(T2)) {
        P2_calc = (P1 * T2) / T1;
        steps.push(
          `Isochoric: P₁/T₁ = P₂/T₂ → P₂ = ${P1} × ${T2} / ${T1} = ${P2_calc.toFixed(2)} ${
            unitSystem === "si" ? "Pa" : "psi"
          }`
        );
      } else {
        setResults({ error: "Provide final pressure or temperature." });
        return;
      }
      P2 = !isNaN(P2) ? P2 : P2_calc;
      T2 = !isNaN(T2) ? T2 : T2_calc;
      W = 0;
      deltaU = n * Cv * (T2 - T1);
      Q = deltaU;
      deltaS = n * Cv * Math.log(T2 / T1);
      steps.push(`Work: W = 0 (isochoric)`);
      steps.push(
        `Internal energy: ΔU = n C_v ΔT = ${n} × ${Cv} × (${T2} - ${T1}) = ${deltaU.toFixed(2)} ${
          unitSystem === "si" ? "J" : "ft-lbf"
        }`
      );
      steps.push(`Heat: Q = ΔU = ${deltaU.toFixed(2)} ${unitSystem === "si" ? "J" : "ft-lbf"}`);
      steps.push(
        `Entropy: ΔS = n C_v ln(T₂/T₁) = ${n} × ${Cv} × ln(${T2}/${T1}) = ${deltaS.toFixed(2)} ${
          unitSystem === "si" ? "J/K" : "ft-lbf/°R"
        }`
      );
    } else if (processType === "adiabatic") {
      if (!isNaN(P2) && !isNaN(V2)) {
        T2_calc = T1 * Math.pow(V1 / V2, Cp / Cv - 1);
        steps.push(
          `Adiabatic: T₁ V₁^(γ-1) = T₂ V₂^(γ-1) → T₂ = ${T1} × (${V1}/${V2})^(γ-1) = ${T2_calc.toFixed(2)} ${
            unitSystem === "si" ? "K" : "°R"
          }`
        );
      } else if (!isNaN(V2)) {
        P2_calc = P1 * Math.pow(V1 / V2, Cp / Cv);
        T2_calc = T1 * Math.pow(V1 / V2, Cp / Cv - 1);
        steps.push(
          `Adiabatic: P₁ V₁^γ = P₂ V₂^γ → P₂ = ${P1} × (${V1}/${V2})^γ = ${P2_calc.toFixed(2)} ${
            unitSystem === "si" ? "Pa" : "psi"
          }`
        );
        steps.push(
          `T₂ = ${T1} × (${V1}/${V2})^(γ-1) = ${T2_calc.toFixed(2)} ${unitSystem === "si" ? "K" : "°R"}`
        );
      } else if (!isNaN(P2)) {
        V2_calc = V1 * Math.pow(P1 / P2, Cv / Cp);
        T2_calc = T1 * Math.pow(P1 / P2, 1 - Cv / Cp);
        steps.push(
          `Adiabatic: V₂ = V₁ (P₁/P₂)^(1/γ) = ${V1} × (${P1}/${P2})^(1/γ) = ${V2_calc.toFixed(4)} ${
            unitSystem === "si" ? "m³" : "ft³"
          }`
        );
        steps.push(
          `T₂ = ${T1} × (${P1}/${P2})^(1-1/γ) = ${T2_calc.toFixed(2)} ${unitSystem === "si" ? "K" : "°R"}`
        );
      } else {
        setResults({ error: "Provide final pressure and/or volume." });
        return;
      }
      P2 = !isNaN(P2) ? P2 : P2_calc;
      V2 = !isNaN(V2) ? V2 : V2_calc;
      T2 = !isNaN(T2) ? T2 : T2_calc;
      deltaU = n * Cv * (T2 - T1);
      W = -deltaU;
      Q = 0;
      deltaS = 0;
      steps.push(
        `Internal energy: ΔU = n C_v ΔT = ${n} × ${Cv} × (${T2} - ${T1}) = ${deltaU.toFixed(2)} ${
          unitSystem === "si" ? "J" : "ft-lbf"
        }`
      );
      steps.push(`Work: W = -ΔU = ${W.toFixed(2)} ${unitSystem === "si" ? "J" : "ft-lbf"}`);
      steps.push(`Heat: Q = 0 (adiabatic)`);
      steps.push(`Entropy: ΔS = 0 (reversible adiabatic)`);
    }

    // Convert outputs back to SI for display if imperial
    if (unitSystem === "imperial") {
      P1 /= 0.000145038;
      P2 /= 0.000145038;
      V1 /= 35.3147;
      V2 /= 35.3147;
      T1 /= 1.8;
      T2 /= 1.8;
      W *= 1.35582;
      Q *= 1.35582;
      deltaU *= 1.35582;
      deltaS *= 0.2388459;
      steps.push("Converted outputs back to SI for display.");
    }

    // Verify final state
    const idealGasCheck2 = Math.abs(P2 * V2 - n * R * T2) / (P2 * V2);
    if (idealGasCheck2 > 0.01) {
      setResults({ error: "Final state violates ideal gas law (PV = nRT)." });
      return;
    }
    steps.push(
      `Final state: PV = nRT → ${P2.toFixed(2)} × ${V2.toFixed(4)} ≈ ${n.toFixed(2)} × ${R.toFixed(
        2
      )} × ${T2.toFixed(2)}`
    );

    // Store results
    const result = {
      P1,
      V1,
      T1,
      P2,
      V2,
      T2,
      W,
      Q,
      deltaU,
      deltaS,
      steps,
    };
    setResults(result);

    // Update history
    const historyEntry = {
      processType,
      unitSystem,
      gasType,
      moles: n,
      Cv,
      Cp,
      pressure1: P1,
      volume1: V1,
      temperature1: T1,
      pressure2: P2,
      volume2: V2,
      temperature2: T2,
      work: W,
      heat: Q,
      internalEnergy: deltaU,
      entropy: deltaS,
      timestamp: new Date().toISOString(),
    };
    setHistory([...history, historyEntry]);

    // Plot graph
    plotGraph(P1, V1, T1, P2, V2, T2);
  };

  const plotGraph = (P1, V1, T1, P2, V2, T2) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#1f2937";
    ctx.fillText(`P-V Diagram (${processType})`, 10, 20);

    const margin = 50;
    const graphWidth = canvas.width - 2 * margin;
    const graphHeight = canvas.height - 2 * margin;
    const maxP = Math.max(P1, P2) * 1.2;
    const maxV = Math.max(V1, V2) * 1.2;
    const scaleP = graphHeight / maxP;
    const scaleV = graphWidth / maxV;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillText(
      `V (${unitSystem === "si" ? "m³" : "ft³"})`,
      canvas.width - margin,
      canvas.height - margin + 20
    );
    ctx.fillText(`P (${unitSystem === "si" ? "Pa" : "psi"})`, margin - 30, margin);

    // Draw state points
    const x1 = margin + V1 * scaleV;
    const y1 = canvas.height - margin - P1 * scaleP;
    const x2 = margin + V2 * scaleV;
    const y2 = canvas.height - margin - P2 * scaleP;
    ctx.beginPath();
    ctx.arc(x1, y1, 5, 0, 2 * Math.PI);
    ctx.arc(x2, y2, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.fillStyle = "#1f2937";
    ctx.fillText(`(V₁=${V1.toFixed(4)}, P₁=${P1.toFixed(2)})`, x1 + 10, y1 - 10);
    ctx.fillText(`(V₂=${V2.toFixed(4)}, P₂=${P2.toFixed(2)})`, x2 + 10, y2 - 10);

    // Draw process path
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    if (processType === "isothermal") {
      const k = P1 * V1;
      for (let V = V1; V <= V2; V += (V2 - V1) / 100) {
        const P = k / V;
        ctx.lineTo(margin + V * scaleV, canvas.height - margin - P * scaleP);
      }
    } else if (processType === "isobaric") {
      ctx.lineTo(x2, y1);
    } else if (processType === "isochoric") {
      ctx.lineTo(x1, y2);
    } else if (processType === "adiabatic") {
      const gamma = Cp / Cv;
      const k = P1 * Math.pow(V1, gamma);
      for (let V = V1; V <= V2; V += (V2 - V1) / 100) {
        const P = k / Math.pow(V, gamma);
        ctx.lineTo(margin + V * scaleV, canvas.height - margin - P * scaleP);
      }
    }
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const clearInputs = () => {
    setMoles("");
    setCv("");
    setCp("");
    setPressure1("");
    setVolume1("");
    setTemperature1("");
    setPressure2("");
    setVolume2("");
    setTemperature2("");
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
      "Run,ProcessType,UnitSystem,GasType,Timestamp,Moles,Cv,Cp,Pressure1,Volume1,Temperature1,Pressure2,Volume2,Temperature2,Work,Heat,InternalEnergy,Entropy",
      ...history.map(
        (run, index) =>
          `${index + 1},${run.processType},${run.unitSystem},${run.gasType},${run.timestamp},` +
          `${run.moles.toFixed(2)},${run.Cv.toFixed(2)},${run.Cp.toFixed(2)},` +
          `${run.pressure1.toFixed(2)},${run.volume1.toFixed(4)},${run.temperature1.toFixed(2)},` +
          `${run.pressure2.toFixed(2)},${run.volume2.toFixed(4)},${run.temperature2.toFixed(2)},` +
          `${run.work.toFixed(2)},${run.heat.toFixed(2)},${run.internalEnergy.toFixed(
            2
          )},${run.entropy.toFixed(2)}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "thermodynamics_data.csv";
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
    a.download = "thermodynamics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculateThermo();
      if (e.key === "c") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    processType,
    unitSystem,
    gasType,
    moles,
    cv,
    cp,
    pressure1,
    volume1,
    temperature1,
    pressure2,
    volume2,
    temperature2,
  ]);

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-4xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Thermodynamics Calculator
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="process-type" className="block text-sm font-medium text-gray-700 mb-1">
                Process Type:
              </label>
              <select
                id="process-type"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={processType}
                onChange={(e) => setProcessType(e.target.value)}
              >
                <option value="isothermal">Isothermal</option>
                <option value="isobaric">Isobaric</option>
                <option value="isochoric">Isochoric</option>
                <option value="adiabatic">Adiabatic</option>
              </select>
            </div>
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
                <option value="si">SI (Pa, m³, K, J)</option>
                <option value="imperial">Imperial (psi, ft³, °R, ft-lbf)</option>
              </select>
            </div>
            <div>
              <label htmlFor="gas-type" className="block text-sm font-medium text-gray-700 mb-1">
                Gas Type:
              </label>
              <select
                id="gas-type"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={gasType}
                onChange={(e) => setGasType(e.target.value)}
              >
                <option value="monatomic">Monatomic (e.g., He)</option>
                <option value="diatomic">Diatomic (e.g., N₂)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label htmlFor="moles" className="block text-sm font-medium text-gray-700 mb-1">
                Moles (mol):
              </label>
              <input
                type="text"
                id="moles"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder="e.g., 1"
                value={moles}
                onChange={(e) => setMoles(e.target.value)}
              />
            </div>
          </div>
          {toggleCustomGas() && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Custom Gas Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">
                    Molar C_v (J/mol·K):
                  </label>
                  <input
                    type="text"
                    id="cv"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 12.47"
                    value={cv}
                    onChange={(e) => setCv(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="cp" className="block text-sm font-medium text-gray-700 mb-1">
                    Molar C_p (J/mol·K):
                  </label>
                  <input
                    type="text"
                    id="cp"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 20.79"
                    value={cp}
                    onChange={(e) => setCp(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Initial State</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="pressure1" className="block text-sm font-medium text-gray-700 mb-1">
                  Pressure ({unitSystem === "si" ? "Pa" : "psi"}):
                </label>
                <input
                  type="text"
                  id="pressure1"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 101325"
                  value={pressure1}
                  onChange={(e) => setPressure1(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="volume1" className="block text-sm font-medium text-gray-700 mb-1">
                  Volume ({unitSystem === "si" ? "m³" : "ft³"}):
                </label>
                <input
                  type="text"
                  id="volume1"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 0.0224"
                  value={volume1}
                  onChange={(e) => setVolume1(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="temperature1" className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature ({unitSystem === "si" ? "K" : "°R"}):
                </label>
                <input
                  type="text"
                  id="temperature1"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 273"
                  value={temperature1}
                  onChange={(e) => setTemperature1(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Final State</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="pressure2" className="block text-sm font-medium text-gray-700 mb-1">
                  Pressure ({unitSystem === "si" ? "Pa" : "psi"}):
                </label>
                <input
                  type="text"
                  id="pressure2"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 202650"
                  value={pressure2}
                  onChange={(e) => setPressure2(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="volume2" className="block text-sm font-medium text-gray-700 mb-1">
                  Volume ({unitSystem === "si" ? "m³" : "ft³"}):
                </label>
                <input
                  type="text"
                  id="volume2"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 0.0224"
                  value={volume2}
                  onChange={(e) => setVolume2(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="temperature2" className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature ({unitSystem === "si" ? "K" : "°R"}):
                </label>
                <input
                  type="text"
                  id="temperature2"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 273"
                  value={temperature2}
                  onChange={(e) => setTemperature2(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculateThermo}
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
                    Initial State: P₁ = {results.P1.toFixed(2)} {unitSystem === "si" ? "Pa" : "psi"}, V₁ ={" "}
                    {results.V1.toFixed(4)} {unitSystem === "si" ? "m³" : "ft³"}, T₁ = {results.T1.toFixed(2)}{" "}
                    {unitSystem === "si" ? "K" : "°R"}
                  </p>
                  <p>
                    Final State: P₂ = {results.P2.toFixed(2)} {unitSystem === "si" ? "Pa" : "psi"}, V₂ ={" "}
                    {results.V2.toFixed(4)} {unitSystem === "si" ? "m³" : "ft³"}, T₂ = {results.T2.toFixed(2)}{" "}
                    {unitSystem === "si" ? "K" : "°R"}
                  </p>
                  <p>
                    Work Done: {results.W.toFixed(2)} {unitSystem === "si" ? "J" : "ft-lbf"}
                  </p>
                  <p>
                    Heat Transfer: {results.Q.toFixed(2)} {unitSystem === "si" ? "J" : "ft-lbf"}
                  </p>
                  <p>
                    Internal Energy Change: {results.deltaU.toFixed(2)} {unitSystem === "si" ? "J" : "ft-lbf"}
                  </p>
                  <p>
                    Entropy Change: {results.deltaS.toFixed(2)} {unitSystem === "si" ? "J/K" : "ft-lbf/°R"}
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
                  Run {index + 1} ({run.processType}, {run.unitSystem}, {run.timestamp}):
                </p>
                <p>
                  Gas: {run.gasType}, Moles: {run.moles.toFixed(2)} mol
                </p>
                <p>
                  Initial: P₁ = {run.pressure1.toFixed(2)} {run.unitSystem === "si" ? "Pa" : "psi"}, V₁ ={" "}
                  {run.volume1.toFixed(4)} {run.unitSystem === "si" ? "m³" : "ft³"}, T₁ ={" "}
                  {run.temperature1.toFixed(2)} {run.unitSystem === "si" ? "K" : "°R"}
                </p>
                <p>
                  Final: P₂ = {run.pressure2.toFixed(2)} {run.unitSystem === "si" ? "Pa" : "psi"}, V₂ ={" "}
                  {run.volume2.toFixed(4)} {run.unitSystem === "si" ? "m³" : "ft³"}, T₂ ={" "}
                  {run.temperature2.toFixed(2)} {run.unitSystem === "si" ? "K" : "°R"}
                </p>
                <p>
                  Work: {run.work.toFixed(2)} {run.unitSystem === "si" ? "J" : "ft-lbf"}
                </p>
                <p>
                  Heat: {run.heat.toFixed(2)} {run.unitSystem === "si" ? "J" : "ft-lbf"}
                </p>
                <p>
                  ΔU: {run.internalEnergy.toFixed(2)} {run.unitSystem === "si" ? "J" : "ft-lbf"}
                </p>
                <p>
                  ΔS: {run.entropy.toFixed(2)} {run.unitSystem === "si" ? "J/K" : "ft-lbf/°R"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
