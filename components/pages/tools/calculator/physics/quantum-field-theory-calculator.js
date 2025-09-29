"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [mode, setMode] = useState("scattering-amplitude");
  const [unitSystem, setUnitSystem] = useState("natural");
  const [momentumP1, setMomentumP1] = useState("");
  const [momentumP2, setMomentumP2] = useState("");
  const [scatteringAngle, setScatteringAngle] = useState("");
  const [alpha, setAlpha] = useState("");
  const [cutoffMomentum, setCutoffMomentum] = useState("");
  const [scalarMassVacuum, setScalarMassVacuum] = useState("");
  const [couplingVacuum, setCouplingVacuum] = useState("");
  const [externalMomentum, setExternalMomentum] = useState("");
  const [scalarMassProp, setScalarMassProp] = useState("");
  const [couplingProp, setCouplingProp] = useState("");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const hbar = 1.054571817e-34; // Reduced Planck constant in J·s
  const c = 2.99792458e8; // Speed of light in m/s
  const alphaDefault = 1 / 137.036; // Fine-structure constant
  const GeV_to_J = 1.60217662e-10; // GeV to J
  const GeV_per_c_to_kgms = 5.344286e-28; // GeV/c to kg·m/s
  const GeV_per_c2_to_kg = 1.78266192e-27; // GeV/c² to kg

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 400;
    }
  }, []);

  const calculateQFT = () => {
    const steps = [];
    let p1_val = parseFloat(momentumP1);
    let p2_val = parseFloat(momentumP2);
    let theta_val = (parseFloat(scatteringAngle) * Math.PI) / 180;
    let alpha_val = parseFloat(alpha) || alphaDefault;
    let Lambda_val = parseFloat(cutoffMomentum);
    let m_vac_val = parseFloat(scalarMassVacuum);
    let lambda_vacuum = parseFloat(couplingVacuum);
    let p_val = parseFloat(externalMomentum);
    let m_prop_val = parseFloat(scalarMassProp);
    let lambda_prop = parseFloat(couplingProp);

    // Unit conversions
    if (unitSystem === "si") {
      if (mode === "scattering-amplitude") {
        p1_val *= GeV_per_c_to_kgms; // GeV/c to kg·m/s
        p2_val *= GeV_per_c_to_kgms;
        steps.push("Converted momenta (GeV/c to kg·m/s).");
      } else if (mode === "vacuum-energy") {
        Lambda_val *= GeV_per_c_to_kgms; // GeV/c to kg·m/s
        m_vac_val *= GeV_per_c2_to_kg; // GeV/c² to kg
        steps.push("Converted cutoff momentum (GeV/c to kg·m/s), mass (GeV/c² to kg).");
      } else if (mode === "propagator-correction") {
        p_val *= GeV_per_c_to_kgms; // GeV/c to kg·m/s
        m_prop_val *= GeV_per_c2_to_kg; // GeV/c² to kg
        steps.push("Converted external momentum (GeV/c to kg·m/s), mass (GeV/c² to kg).");
      }
    }

    let result = { mode, unitSystem };

    if (mode === "scattering-amplitude") {
      if (
        isNaN(p1_val) ||
        p1_val <= 0 ||
        isNaN(p2_val) ||
        p2_val <= 0 ||
        isNaN(theta_val) ||
        theta_val < 0 ||
        theta_val > Math.PI ||
        isNaN(alpha_val) ||
        alpha_val <= 0
      ) {
        setResults({ error: "Positive p₁, p₂, α, and θ between 0 and 180° required." });
        return;
      }
      const M = alpha_val / (2 * (1 - Math.cos(theta_val))); // Simplified amplitude
      const dsigma_dOmega = M * M; // Proportional to |M|²
      steps.push(
        `Scattering amplitude (simplified): M ∝ α / (2 (1 - cos(θ))) = ${alpha_val.toFixed(
          4
        )} / (2 (1 - cos(${theta_val.toFixed(2)}))) = ${M.toFixed(4)}`
      );
      steps.push(`Differential cross-section: dσ/dΩ ∝ |M|² = ${M.toFixed(4)}² = ${dsigma_dOmega.toFixed(4)}`);
      result.p1 = p1_val;
      result.p2 = p2_val;
      result.theta = (theta_val * 180) / Math.PI;
      result.alpha = alpha_val;
      result.M = M;
      result.dsigma_dOmega = dsigma_dOmega;
    } else if (mode === "vacuum-energy") {
      if (
        isNaN(Lambda_val) ||
        Lambda_val <= 0 ||
        isNaN(m_vac_val) ||
        m_vac_val < 0 ||
        isNaN(lambda_vacuum) ||
        lambda_vacuum < 0
      ) {
        setResults({ error: "Positive Λ, non-negative m, and λ required." });
        return;
      }
      const rho_vac =
        (Lambda_val * Lambda_val * Lambda_val * Lambda_val) / (16 * Math.PI * Math.PI) +
        (m_vac_val * m_vac_val * Lambda_val * Lambda_val) / (8 * Math.PI * Math.PI);
      steps.push(
        `Vacuum energy density (simplified): ρ_vac ≈ Λ⁴ / (16 π²) + m² Λ² / (8 π²) = (${Lambda_val.toFixed(
          2
        )}⁴ / (16 π²)) + (${m_vac_val.toFixed(2)}² × ${Lambda_val.toFixed(2)}² / (8 π²)) = ${rho_vac.toFixed(
          2
        )} GeV⁴`
      );
      result.Lambda = Lambda_val;
      result.m = m_vac_val;
      result.lambda = lambda_vacuum;
      result.rho_vac = rho_vac;
    } else if (mode === "propagator-correction") {
      if (isNaN(p_val) || isNaN(m_prop_val) || m_prop_val < 0 || isNaN(lambda_prop) || lambda_prop < 0) {
        setResults({ error: "Valid p, non-negative m, and λ required." });
        return;
      }
      const Sigma = (lambda_prop * m_prop_val * m_prop_val) / (16 * Math.PI * Math.PI);
      steps.push(
        `Self-energy (simplified): Σ(p) ≈ λ m² / (16 π²) = ${lambda_prop.toFixed(2)} × ${m_prop_val.toFixed(
          2
        )}² / (16 π²) = ${Sigma.toFixed(2)} GeV²`
      );
      result.p = p_val;
      result.m = m_prop_val;
      result.lambda = lambda_prop;
      result.Sigma = Sigma;
    }

    // Convert outputs back to SI units for display
    if (unitSystem === "si") {
      if (mode === "scattering-amplitude") {
        result.p1 /= GeV_per_c_to_kgms; // kg·m/s to GeV/c
        result.p2 /= GeV_per_c_to_kgms;
        steps.push("Converted outputs to SI units: momenta (kg·m/s to GeV/c).");
      } else if (mode === "vacuum-energy") {
        result.Lambda /= GeV_per_c_to_kgms; // kg·m/s to GeV/c
        result.m /= GeV_per_c2_to_kg; // kg to GeV/c²
        result.rho_vac *= Math.pow(GeV_to_J, 4) / Math.pow(hbar * c, 3); // GeV⁴ to J/m³
        steps.push(
          "Converted outputs to SI units: momentum (kg·m/s to GeV/c), mass (kg to GeV/c²), energy density (GeV⁴ to J/m³)."
        );
      } else if (mode === "propagator-correction") {
        result.p /= GeV_per_c_to_kgms; // kg·m/s to GeV/c
        result.m /= GeV_per_c2_to_kg; // kg to GeV/c²
        result.Sigma *= Math.pow(GeV_to_J, 2) / Math.pow(hbar * c, 2); // GeV² to J²/m²
        steps.push(
          "Converted outputs to SI units: momentum (kg·m/s to GeV/c), mass (kg to GeV/c²), self-energy (GeV² to J²/m²)."
        );
      }
    }

    result.steps = steps;
    result.timestamp = new Date().toISOString();
    setResults(result);
    setHistory([...history, result]);
    plotGraph(result);
  };

  const plotGraph = (result) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#1f2937";
    ctx.fillText(`${result.mode} Visualization`, 10, 20);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const plotWidth = canvas.width - 100;
    const plotHeight = canvas.height - 100;

    if (result.mode === "scattering-amplitude") {
      const points = 100;
      const maxTheta = 180;
      const dTheta = maxTheta / points;
      const max_dsigma = result.dsigma_dOmega * 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const theta_deg = i * dTheta;
        const theta_rad = (theta_deg * Math.PI) / 180;
        const M = result.alpha / (2 * (1 - Math.cos(theta_rad)));
        const dsigma = M * M;
        const px = cx - plotWidth / 2 + (theta_deg / maxTheta) * plotWidth;
        const py = cy + plotHeight / 2 - (dsigma / max_dsigma) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx - plotWidth / 2 + (result.theta / maxTheta) * plotWidth;
      const py = cy + plotHeight / 2 - (result.dsigma_dOmega / max_dsigma) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#22c55e";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(`θ=${result.theta.toFixed(2)}°`, px + 10, py - 20);
      ctx.fillText(`dσ/dΩ=${result.dsigma_dOmega.toFixed(4)}`, px + 10, py);
      ctx.fillText("θ (°)", cx + plotWidth / 2, cy + plotHeight / 2 + 20);
      ctx.fillText("dσ/dΩ", cx - plotWidth / 2 - 20, cy - plotHeight / 2);
    } else if (result.mode === "vacuum-energy") {
      const points = 100;
      const maxLambda = result.Lambda * 2;
      const dLambda = maxLambda / points;
      const maxRho =
        (maxLambda * maxLambda * maxLambda * maxLambda) / (16 * Math.PI * Math.PI) +
        (result.m * result.m * maxLambda * maxLambda) / (8 * Math.PI * Math.PI);
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const Lambda = i * dLambda;
        const rho =
          (Lambda * Lambda * Lambda * Lambda) / (16 * Math.PI * Math.PI) +
          (result.m * result.m * Lambda * Lambda) / (8 * Math.PI * Math.PI);
        const px = cx - plotWidth / 2 + (Lambda / maxLambda) * plotWidth;
        const py = cy + plotHeight / 2 - (rho / maxRho) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx - plotWidth / 2 + (result.Lambda / maxLambda) * plotWidth;
      const py = cy + plotHeight / 2 - (result.rho_vac / maxRho) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#22c55e";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(
        `Λ=${result.Lambda.toFixed(2)} ${result.unitSystem === "si" ? "kg·m/s" : "GeV/c"}`,
        px + 10,
        py - 20
      );
      ctx.fillText(
        `ρ_vac=${result.rho_vac.toFixed(2)} ${result.unitSystem === "si" ? "J/m³" : "GeV⁴"}`,
        px + 10,
        py
      );
      ctx.fillText(
        `Λ (${result.unitSystem === "si" ? "kg·m/s" : "GeV/c"})`,
        cx + plotWidth / 2,
        cy + plotHeight / 2 + 20
      );
      ctx.fillText(
        `ρ_vac (${result.unitSystem === "si" ? "J/m³" : "GeV⁴"})`,
        cx - plotWidth / 2 - 20,
        cy - plotHeight / 2
      );
    } else if (result.mode === "propagator-correction") {
      const points = 100;
      const maxP = result.p * 2;
      const dP = maxP / points;
      const maxSigma = result.Sigma * 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const p = i * dP;
        const Sigma = (result.lambda * result.m * result.m) / (16 * Math.PI * Math.PI);
        const px = cx - plotWidth / 2 + (p / maxP) * plotWidth;
        const py = cy + plotHeight / 2 - (Sigma / maxSigma) * plotHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = cx - plotWidth / 2 + (result.p / maxP) * plotWidth;
      const py = cy + plotHeight / 2 - (result.Sigma / maxSigma) * plotHeight;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#22c55e";
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.fillText(
        `p=${result.p.toFixed(2)} ${result.unitSystem === "si" ? "kg·m/s" : "GeV/c"}`,
        px + 10,
        py - 20
      );
      ctx.fillText(
        `Σ=${result.Sigma.toFixed(2)} ${result.unitSystem === "si" ? "J²/m²" : "GeV²"}`,
        px + 10,
        py
      );
      ctx.fillText(
        `p (${result.unitSystem === "si" ? "kg·m/s" : "GeV/c"})`,
        cx + plotWidth / 2,
        cy + plotHeight / 2 + 20
      );
      ctx.fillText(
        `Σ (${result.unitSystem === "si" ? "J²/m²" : "GeV²"})`,
        cx - plotWidth / 2 - 20,
        cy - plotHeight / 2
      );
    }
  };

  const importFromQuantumMechanics = () => {
    alert("Import from Quantum Mechanics Calculator not implemented. Please enter parameters manually.");
  };

  const clearInputs = () => {
    setMomentumP1("");
    setMomentumP2("");
    setScatteringAngle("");
    setAlpha("");
    setCutoffMomentum("");
    setScalarMassVacuum("");
    setCouplingVacuum("");
    setExternalMomentum("");
    setScalarMassProp("");
    setCouplingProp("");
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
      "Run,Mode,UnitSystem,Timestamp,p1,p2,theta,alpha,M,dsigma_dOmega,Lambda,m_vacuum,lambda_vacuum,rho_vac,p,m_prop,lambda_prop,Sigma",
      ...history.map((run, index) => {
        return `${index + 1},${run.mode},${run.unitSystem},${run.timestamp},${
          run.p1 ? run.p1.toFixed(2) : ""
        },${run.p2 ? run.p2.toFixed(2) : ""},${run.theta ? run.theta.toFixed(2) : ""},${
          run.alpha ? run.alpha.toFixed(4) : ""
        },${run.M ? run.M.toFixed(4) : ""},${run.dsigma_dOmega ? run.dsigma_dOmega.toFixed(4) : ""},${
          run.Lambda ? run.Lambda.toFixed(2) : ""
        },${run.m && run.mode === "vacuum-energy" ? run.m.toFixed(2) : ""},${
          run.lambda && run.mode === "vacuum-energy" ? run.lambda.toFixed(2) : ""
        },${run.rho_vac ? run.rho_vac.toFixed(2) : ""},${
          run.p && run.mode === "propagator-correction" ? run.p.toFixed(2) : ""
        },${run.m && run.mode === "propagator-correction" ? run.m.toFixed(2) : ""},${
          run.lambda && run.mode === "propagator-correction" ? run.lambda.toFixed(2) : ""
        },${run.Sigma ? run.Sigma.toFixed(2) : ""}`;
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qft_data.csv";
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
    a.download = "qft_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculateQFT();
      if (e.key === "c") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    momentumP1,
    momentumP2,
    scatteringAngle,
    alpha,
    cutoffMomentum,
    scalarMassVacuum,
    couplingVacuum,
    externalMomentum,
    scalarMassProp,
    couplingProp,
    mode,
    unitSystem,
  ]);

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-5xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Quantum Field Theory Calculator
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
                Calculation Mode:
              </label>
              <select
                id="mode"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="scattering-amplitude">Scattering Amplitude</option>
                <option value="vacuum-energy">Vacuum Energy</option>
                <option value="propagator-correction">Propagator Correction</option>
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
                <option value="natural">Natural (GeV, c=1, ℏ=1)</option>
                <option value="si">SI (kg, m, s, J)</option>
              </select>
            </div>
          </div>
          {mode === "scattering-amplitude" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Scattering Amplitude Inputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="momentum-p1" className="block text-sm font-medium text-gray-700 mb-1">
                    Momentum p₁ (GeV/c):
                  </label>
                  <input
                    type="text"
                    id="momentum-p1"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1"
                    value={momentumP1}
                    onChange={(e) => setMomentumP1(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="momentum-p2" className="block text-sm font-medium text-gray-700 mb-1">
                    Momentum p₂ (GeV/c):
                  </label>
                  <input
                    type="text"
                    id="momentum-p2"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1"
                    value={momentumP2}
                    onChange={(e) => setMomentumP2(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="scattering-angle" className="block text-sm font-medium text-gray-700 mb-1">
                    Scattering Angle (degrees):
                  </label>
                  <input
                    type="text"
                    id="scattering-angle"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 90"
                    value={scatteringAngle}
                    onChange={(e) => setScatteringAngle(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="alpha" className="block text-sm font-medium text-gray-700 mb-1">
                    Fine-Structure Constant (α):
                  </label>
                  <input
                    type="text"
                    id="alpha"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.007297"
                    value={alpha}
                    onChange={(e) => setAlpha(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          {mode === "vacuum-energy" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Vacuum Energy Inputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cutoff-momentum" className="block text-sm font-medium text-gray-700 mb-1">
                    Cutoff Momentum (GeV/c):
                  </label>
                  <input
                    type="text"
                    id="cutoff-momentum"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1000"
                    value={cutoffMomentum}
                    onChange={(e) => setCutoffMomentum(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="scalar-mass-vacuum"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Scalar Mass (GeV/c²):
                  </label>
                  <input
                    type="text"
                    id="scalar-mass-vacuum"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.125"
                    value={scalarMassVacuum}
                    onChange={(e) => setScalarMassVacuum(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="coupling-vacuum" className="block text-sm font-medium text-gray-700 mb-1">
                    Coupling Constant (λ):
                  </label>
                  <input
                    type="text"
                    id="coupling-vacuum"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.1"
                    value={couplingVacuum}
                    onChange={(e) => setCouplingVacuum(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          {mode === "propagator-correction" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Propagator Correction Inputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="external-momentum" className="block text-sm font-medium text-gray-700 mb-1">
                    External Momentum (GeV/c):
                  </label>
                  <input
                    type="text"
                    id="external-momentum"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1"
                    value={externalMomentum}
                    onChange={(e) => setExternalMomentum(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="scalar-mass-prop" className="block text-sm font-medium text-gray-700 mb-1">
                    Scalar Mass (GeV/c²):
                  </label>
                  <input
                    type="text"
                    id="scalar-mass-prop"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.125"
                    value={scalarMassProp}
                    onChange={(e) => setScalarMassProp(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="coupling-prop" className="block text-sm font-medium text-gray-700 mb-1">
                    Coupling Constant (λ):
                  </label>
                  <input
                    type="text"
                    id="coupling-prop"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0.1"
                    value={couplingProp}
                    onChange={(e) => setCouplingProp(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculateQFT}
            >
              Calculate
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={importFromQuantumMechanics}
            >
              Import Wavefunction
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
                  {results.mode === "scattering-amplitude" && (
                    <>
                      <p>
                        Momentum p₁: {results.p1.toFixed(2)}{" "}
                        {results.unitSystem === "si" ? "kg·m/s" : "GeV/c"}
                      </p>
                      <p>
                        Momentum p₂: {results.p2.toFixed(2)}{" "}
                        {results.unitSystem === "si" ? "kg·m/s" : "GeV/c"}
                      </p>
                      <p>Scattering Angle (θ): {results.theta.toFixed(2)} degrees</p>
                      <p>Fine-Structure Constant (α): {results.alpha.toFixed(4)}</p>
                      <p>Amplitude (M, simplified): {results.M.toFixed(4)}</p>
                      <p>Differential Cross-Section (dσ/dΩ): {results.dsigma_dOmega.toFixed(4)}</p>
                    </>
                  )}
                  {results.mode === "vacuum-energy" && (
                    <>
                      <p>
                        Cutoff Momentum (Λ): {results.Lambda.toFixed(2)}{" "}
                        {results.unitSystem === "si" ? "kg·m/s" : "GeV/c"}
                      </p>
                      <p>
                        Scalar Mass (m): {results.m.toFixed(2)}{" "}
                        {results.unitSystem === "si" ? "kg" : "GeV/c²"}
                      </p>
                      <p>Coupling Constant (λ): {results.lambda.toFixed(2)}</p>
                      <p>
                        Vacuum Energy Density (ρ_vac): {results.rho_vac.toFixed(2)}{" "}
                        {results.unitSystem === "si" ? "J/m³" : "GeV⁴"}
                      </p>
                    </>
                  )}
                  {results.mode === "propagator-correction" && (
                    <>
                      <p>
                        External Momentum (p): {results.p.toFixed(2)}{" "}
                        {results.unitSystem === "si" ? "kg·m/s" : "GeV/c"}
                      </p>
                      <p>
                        Scalar Mass (m): {results.m.toFixed(2)}{" "}
                        {results.unitSystem === "si" ? "kg" : "GeV/c²"}
                      </p>
                      <p>Coupling Constant (λ): {results.lambda.toFixed(2)}</p>
                      <p>
                        Self-Energy (Σ): {results.Sigma.toFixed(2)}{" "}
                        {results.unitSystem === "si" ? "J²/m²" : "GeV²"}
                      </p>
                    </>
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
                  Run {index + 1} ({run.mode}, {run.unitSystem}, {run.timestamp}):
                </p>
                {run.mode === "scattering-amplitude" && (
                  <>
                    <p>
                      Momentum p₁: {run.p1.toFixed(2)} {run.unitSystem === "si" ? "kg·m/s" : "GeV/c"}
                    </p>
                    <p>
                      Momentum p₂: {run.p2.toFixed(2)} {run.unitSystem === "si" ? "kg·m/s" : "GeV/c"}
                    </p>
                    <p>Scattering Angle (θ): {run.theta.toFixed(2)} degrees</p>
                    <p>Fine-Structure Constant (α): {run.alpha.toFixed(4)}</p>
                    <p>Amplitude (M, simplified): {run.M.toFixed(4)}</p>
                    <p>Differential Cross-Section (dσ/dΩ): {run.dsigma_dOmega.toFixed(4)}</p>
                  </>
                )}
                {run.mode === "vacuum-energy" && (
                  <>
                    <p>
                      Cutoff Momentum (Λ): {run.Lambda.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "kg·m/s" : "GeV/c"}
                    </p>
                    <p>
                      Scalar Mass (m): {run.m.toFixed(2)} {run.unitSystem === "si" ? "kg" : "GeV/c²"}
                    </p>
                    <p>Coupling Constant (λ): {run.lambda.toFixed(2)}</p>
                    <p>
                      Vacuum Energy Density (ρ_vac): {run.rho_vac.toFixed(2)}{" "}
                      {run.unitSystem === "si" ? "J/m³" : "GeV⁴"}
                    </p>
                  </>
                )}
                {run.mode === "propagator-correction" && (
                  <>
                    <p>
                      External Momentum (p): {run.p.toFixed(2)} {run.unitSystem === "si" ? "kg·m/s" : "GeV/c"}
                    </p>
                    <p>
                      Scalar Mass (m): {run.m.toFixed(2)} {run.unitSystem === "si" ? "kg" : "GeV/c²"}
                    </p>
                    <p>Coupling Constant (λ): {run.lambda.toFixed(2)}</p>
                    <p>
                      Self-Energy (Σ): {run.Sigma.toFixed(2)} {run.unitSystem === "si" ? "J²/m²" : "GeV²"}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
