"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [mode, setMode] = useState("partition-function");
  const [unitSystem, setUnitSystem] = useState("si");
  const [systemType, setSystemType] = useState("two-state");
  const [temperature, setTemperature] = useState("");
  const [energy1, setEnergy1] = useState("");
  const [energy2, setEnergy2] = useState("");
  const [numParticles, setNumParticles] = useState("");
  const [numState1, setNumState1] = useState("");
  const [mass, setMass] = useState("");
  const [volume, setVolume] = useState("");
  const [numParticlesGas, setNumParticlesGas] = useState("");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const k = 1.380649e-23; // Boltzmann constant in J/K
  const h = 6.62607015e-34; // Planck constant in J·s
  const u = 1.660539e-27; // Atomic mass unit in kg
  const angstrom = 1e-10; // Ångström in m
  const eV = 1.60217662e-19; // eV to J

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 400;
    }
  }, []);

  const calculateStatMech = () => {
    const T = parseFloat(temperature);
    const E1 = parseFloat(energy1);
    const E2 = parseFloat(energy2);
    const N = parseInt(numParticles);
    const N1 = parseInt(numState1);
    const m = parseFloat(mass);
    const V = parseFloat(volume);
    const N_gas = parseInt(numParticlesGas);
    const steps = [];

    let result = { mode, systemType, unitSystem, T };
    let E1_conv = E1,
      E2_conv = E2,
      m_conv = m,
      V_conv = V;

    // Unit conversions for atomic units
    if (unitSystem === "atomic") {
      if (!isNaN(E1)) E1_conv *= eV; // eV to J
      if (!isNaN(E2)) E2_conv *= eV;
      if (!isNaN(m)) m_conv *= u; // u to kg
      if (!isNaN(V)) V_conv *= angstrom ** 3; // Å³ to m³
      steps.push("Converted inputs to SI: energies (eV to J), mass (u to kg), volume (Å³ to m³).");
    }

    if (isNaN(T) || T <= 0) {
      setResults({ error: "Positive temperature required." });
      return;
    }

    const beta = 1 / (k * T);

    if (mode === "partition-function") {
      if (systemType === "two-state") {
        if (isNaN(E1_conv) || isNaN(E2_conv)) {
          setResults({ error: "Valid energy levels required." });
          return;
        }
        const Z = Math.exp(-beta * E1_conv) + Math.exp(-beta * E2_conv);
        steps.push(`Partition function: Z = Σ e^(-β E_i) = e^(-β E_1) + e^(-β E_2)`);
        steps.push(`β = 1/(k T) = 1/(${k.toFixed(2)} × ${T.toFixed(2)}) = ${beta.toFixed(2)} J⁻¹`);
        steps.push(
          `Z = e^(-${beta.toFixed(2)} × ${E1_conv.toFixed(2)}) + e^(-${beta.toFixed(2)} × ${E2_conv.toFixed(
            2
          )}) = ${Z.toFixed(2)}`
        );
        result.E1 = E1;
        result.E2 = E2;
        result.Z = Z;
      } else if (systemType === "ideal-gas") {
        if (isNaN(m_conv) || m_conv <= 0 || isNaN(V_conv) || V_conv <= 0) {
          setResults({ error: "Positive mass and volume required." });
          return;
        }
        const lambda = Math.sqrt(h ** 2 / (2 * Math.PI * m_conv * k * T));
        const Z = V_conv / lambda ** 3;
        steps.push(`Thermal de Broglie wavelength: λ = √(h² / (2π m k T))`);
        steps.push(
          `λ = √(${h.toFixed(2)}² / (2π × ${m_conv.toFixed(2)} × ${k.toFixed(2)} × ${T.toFixed(
            2
          )})) = ${lambda.toFixed(2)} m`
        );
        steps.push(
          `Partition function (1 particle, 3D): Z = V / λ³ = ${V_conv.toFixed(2)} / ${lambda.toFixed(
            2
          )}³ = ${Z.toFixed(2)}`
        );
        result.m = m;
        result.V = V;
        result.Z = Z;
      }
    } else if (mode === "entropy") {
      if (systemType === "two-state") {
        if (isNaN(N) || N < 0 || isNaN(N1) || N1 < 0 || N1 > N) {
          setResults({ error: "Non-negative N and 0 ≤ N₁ ≤ N required." });
          return;
        }
        const Omega = factorial(N) / (factorial(N1) * factorial(N - N1));
        const S = k * Math.log(Omega);
        steps.push(
          `Multiplicity: Ω = N! / (N₁! (N - N₁)!) = ${N}! / (${N1}! (${N - N1})!) = ${Omega.toFixed(2)}`
        );
        steps.push(`Entropy: S = k ln Ω = ${k.toFixed(2)} × ln(${Omega.toFixed(2)}) = ${S.toFixed(2)} J/K`);
        result.N = N;
        result.N1 = N1;
        result.S = unitSystem === "atomic" ? S / eV : S;
      } else if (systemType === "ideal-gas") {
        if (isNaN(N_gas) || N_gas < 0 || isNaN(V_conv) || V_conv <= 0 || isNaN(m_conv) || m_conv <= 0) {
          setResults({ error: "Non-negative N, positive volume, and positive mass required." });
          return;
        }
        const lambda = Math.sqrt(h ** 2 / (2 * Math.PI * m_conv * k * T));
        const S = N_gas * k * (Math.log(V_conv / (N_gas * lambda ** 3)) + 5 / 2);
        steps.push(`Thermal de Broglie wavelength: λ = √(h² / (2π m k T)) = ${lambda.toFixed(2)} m`);
        steps.push(`Sackur-Tetrode (simplified): S = N k [ln(V / (N λ³)) + 5/2]`);
        steps.push(
          `S = ${N_gas.toFixed(2)} × ${k.toFixed(2)} × [ln(${V_conv.toFixed(2)} / (${N_gas.toFixed(
            2
          )} × ${lambda.toFixed(2)}³)) + 5/2] = ${S.toFixed(2)} J/K`
        );
        result.N = N_gas;
        result.V = V;
        result.m = m;
        result.S = unitSystem === "atomic" ? S / eV : S;
      }
    } else if (mode === "average-energy") {
      if (systemType === "two-state") {
        if (isNaN(E1_conv) || isNaN(E2_conv)) {
          setResults({ error: "Valid energy levels required." });
          return;
        }
        const Z = Math.exp(-beta * E1_conv) + Math.exp(-beta * E2_conv);
        const avgE = (E1_conv * Math.exp(-beta * E1_conv) + E2_conv * Math.exp(-beta * E2_conv)) / Z;
        steps.push(`Partition function: Z = e^(-β E_1) + e^(-β E_2) = ${Z.toFixed(2)}`);
        steps.push(`Average energy: ⟨E⟩ = (E_1 e^(-β E_1) + E_2 e^(-β E_2)) / Z`);
        steps.push(
          `⟨E⟩ = (${E1_conv.toFixed(2)} × e^(-${beta.toFixed(2)} × ${E1_conv.toFixed(2)}) + ${E2_conv.toFixed(
            2
          )} × e^(-${beta.toFixed(2)} × ${E2_conv.toFixed(2)})) / ${Z.toFixed(2)} = ${avgE.toFixed(2)} J`
        );
        result.E1 = E1;
        result.E2 = E2;
        result.avgE = unitSystem === "atomic" ? avgE / eV : avgE;
      } else if (systemType === "ideal-gas") {
        if (isNaN(m_conv) || m_conv <= 0 || isNaN(V_conv) || V_conv <= 0) {
          setResults({ error: "Positive mass and volume required." });
          return;
        }
        const avgE = (3 / 2) * k * T;
        steps.push(`Average energy (ideal gas, 3D): ⟨E⟩ = (3/2) k T`);
        steps.push(`⟨E⟩ = (3/2) × ${k.toFixed(2)} × ${T.toFixed(2)} = ${avgE.toFixed(2)} J`);
        result.m = m;
        result.V = V;
        result.avgE = unitSystem === "atomic" ? avgE / eV : avgE;
      }
    }

    result.timestamp = new Date().toISOString();
    setResults(result);
    setHistory([...history, result]);
    plotGraph(result);
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const plotGraph = (result) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#1f2937";
    ctx.fillText(`${result.mode} Visualization (${result.systemType})`, 10, 20);

    const cx = 50;
    const cy = canvas.height - 50;
    const plotWidth = canvas.width - 100;
    const plotHeight = canvas.height - 100;
    const beta = 1 / (k * result.T);

    if (result.mode === "partition-function") {
      if (result.systemType === "two-state") {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + plotWidth / 2,
          cy - (Math.exp(-beta * (result.E1 * (unitSystem === "atomic" ? eV : 1))) * plotHeight) / 2
        );
        ctx.moveTo(cx + plotWidth / 2, cy);
        ctx.lineTo(
          cx + plotWidth,
          cy - (Math.exp(-beta * (result.E2 * (unitSystem === "atomic" ? eV : 1))) * plotHeight) / 2
        );
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
          cx + plotWidth / 2,
          cy - (Math.exp(-beta * (result.E1 * (unitSystem === "atomic" ? eV : 1))) * plotHeight) / 2,
          5,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "#22c55e";
        ctx.fill();
        ctx.fillStyle = "#1f2937";
        ctx.fillText(
          `E₁=${result.E1.toFixed(2)} ${unitSystem === "si" ? "J" : "eV"}`,
          cx + plotWidth / 4,
          cy - 20
        );

        ctx.beginPath();
        ctx.arc(
          cx + plotWidth,
          cy - (Math.exp(-beta * (result.E2 * (unitSystem === "atomic" ? eV : 1))) * plotHeight) / 2,
          5,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "#22c55e";
        ctx.fill();
        ctx.fillStyle = "#1f2937";
        ctx.fillText(
          `E₂=${result.E2.toFixed(2)} ${unitSystem === "si" ? "J" : "eV"}`,
          cx + (3 * plotWidth) / 4,
          cy - 20
        );
      } else if (result.systemType === "ideal-gas") {
        const points = 100;
        const dT = (result.T * 2) / points;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const T = i * dT;
          const lambda = Math.sqrt(
            h ** 2 / (2 * Math.PI * (result.m * (unitSystem === "atomic" ? u : 1)) * k * T)
          );
          const Z = (result.V * (unitSystem === "atomic" ? angstrom ** 3 : 1)) / lambda ** 3;
          const px = cx + (i / points) * plotWidth;
          const py = cy - Math.min(Z / (result.Z * 2), 1) * plotHeight;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillText("T (K)", cx + plotWidth, cy + 20);
        ctx.fillText("Z", cx - 20, cy - plotHeight);
      }
    } else if (result.mode === "entropy") {
      if (result.systemType === "two-state") {
        const points = result.N + 1;
        ctx.beginPath();
        for (let N1 = 0; N1 <= result.N; N1++) {
          const Omega = factorial(result.N) / (factorial(N1) * factorial(result.N - N1));
          const S = k * Math.log(Omega);
          const px = cx + (N1 / result.N) * plotWidth;
          const py = cy - (S / (result.S * (unitSystem === "atomic" ? eV : 1) * 2)) * plotHeight;
          if (N1 === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();

        const px = cx + (result.N1 / result.N) * plotWidth;
        const py =
          cy -
          ((result.S * (unitSystem === "atomic" ? eV : 1)) /
            (result.S * (unitSystem === "atomic" ? eV : 1) * 2)) *
            plotHeight;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#22c55e";
        ctx.fill();
        ctx.fillStyle = "#1f2937";
        ctx.fillText(
          `N₁=${result.N1}, S=${result.S.toFixed(2)} ${unitSystem === "si" ? "J/K" : "eV/K"}`,
          px + 10,
          py - 10
        );
      } else if (result.systemType === "ideal-gas") {
        const points = 100;
        const dV = (result.V * (unitSystem === "atomic" ? angstrom ** 3 : 1) * 2) / points;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const V = i * dV;
          const lambda = Math.sqrt(
            h ** 2 / (2 * Math.PI * (result.m * (unitSystem === "atomic" ? u : 1)) * k * result.T)
          );
          const S = result.N * k * (Math.log(V / (result.N * lambda ** 3)) + 5 / 2);
          const px = cx + (i / points) * plotWidth;
          const py = cy - Math.min(S / (result.S * (unitSystem === "atomic" ? eV : 1) * 2), 1) * plotHeight;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillText(`V (${unitSystem === "si" ? "m³" : "Å³"})`, cx + plotWidth, cy + 20);
        ctx.fillText("S", cx - 20, cy - plotHeight);
      }
    } else if (result.mode === "average-energy") {
      if (result.systemType === "two-state") {
        const Z =
          Math.exp(-beta * (result.E1 * (unitSystem === "atomic" ? eV : 1))) +
          Math.exp(-beta * (result.E2 * (unitSystem === "atomic" ? eV : 1)));
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + plotWidth / 2,
          cy - (Math.exp(-beta * (result.E1 * (unitSystem === "atomic" ? eV : 1))) / Z) * plotHeight
        );
        ctx.moveTo(cx + plotWidth / 2, cy);
        ctx.lineTo(
          cx + plotWidth,
          cy - (Math.exp(-beta * (result.E2 * (unitSystem === "atomic" ? eV : 1))) / Z) * plotHeight
        );
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
          cx + plotWidth / 2,
          cy - (Math.exp(-beta * (result.E1 * (unitSystem === "atomic" ? eV : 1))) / Z) * plotHeight,
          5,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "#22c55e";
        ctx.fill();
        ctx.fillStyle = "#1f2937";
        ctx.fillText(
          `E₁=${result.E1.toFixed(2)} ${unitSystem === "si" ? "J" : "eV"}`,
          cx + plotWidth / 4,
          cy - 20
        );

        ctx.beginPath();
        ctx.arc(
          cx + plotWidth,
          cy - (Math.exp(-beta * (result.E2 * (unitSystem === "atomic" ? eV : 1))) / Z) * plotHeight,
          5,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "#22c55e";
        ctx.fill();
        ctx.fillStyle = "#1f2937";
        ctx.fillText(
          `E₂=${result.E2.toFixed(2)} ${unitSystem === "si" ? "J" : "eV"}`,
          cx + (3 * plotWidth) / 4,
          cy - 20
        );

        ctx.fillText(
          `⟨E⟩=${result.avgE.toFixed(2)} ${unitSystem === "si" ? "J" : "eV"}`,
          cx + 10,
          cy - plotHeight - 20
        );
      } else if (result.systemType === "ideal-gas") {
        const points = 100;
        const dT = (result.T * 2) / points;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const T = i * dT;
          const avgE = (3 / 2) * k * T;
          const px = cx + (i / points) * plotWidth;
          const py =
            cy - Math.min(avgE / (result.avgE * (unitSystem === "atomic" ? eV : 1) * 2), 1) * plotHeight;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillText("T (K)", cx + plotWidth, cy + 20);
        ctx.fillText(`⟨E⟩ (${unitSystem === "si" ? "J" : "eV"})`, cx - 20, cy - plotHeight);
      }
    }

    ctx.fillStyle = "#1f2937";
    ctx.fillText(`T=${result.T.toFixed(2)} K`, cx + 10, cy + 20);
  };

  const importFromQuantumMechanics = () => {
    alert("Import from Quantum Mechanics Calculator not implemented. Please enter energies manually.");
  };

  const clearInputs = () => {
    setTemperature("");
    setEnergy1("");
    setEnergy2("");
    setNumParticles("");
    setNumState1("");
    setMass("");
    setVolume("");
    setNumParticlesGas("");
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
      "Run,Mode,SystemType,UnitSystem,Timestamp,Temperature,Energy1,Energy2,NumParticles,NumState1,Mass,Volume,NumParticlesGas,PartitionFunction,Entropy,AverageEnergy",
      ...history.map((run, index) => {
        return `${index + 1},${run.mode},${run.systemType},${run.unitSystem},${run.timestamp},${run.T.toFixed(
          2
        )},${run.E1 ? run.E1.toFixed(2) : ""},${run.E2 ? run.E2.toFixed(2) : ""},${
          run.N && run.mode === "entropy" && run.systemType === "two-state" ? run.N : ""
        },${run.N1 ? run.N1 : ""},${run.m ? run.m.toFixed(2) : ""},${run.V ? run.V.toFixed(2) : ""},${
          run.N && run.systemType === "ideal-gas" ? run.N : ""
        },${run.Z ? run.Z.toFixed(2) : ""},${run.S ? run.S.toFixed(2) : ""},${
          run.avgE ? run.avgE.toFixed(2) : ""
        }`;
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "statistical_mechanics_data.csv";
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
    a.download = "statistical_mechanics_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculateStatMech();
      if (e.key === "c") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    temperature,
    energy1,
    energy2,
    numParticles,
    numState1,
    mass,
    volume,
    numParticlesGas,
    mode,
    unitSystem,
    systemType,
  ]);

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-5xl bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Statistical Mechanics Calculator
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
                <option value="partition-function">Partition Function</option>
                <option value="entropy">Entropy</option>
                <option value="average-energy">Average Energy</option>
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
                <option value="si">SI (J, kg, m)</option>
                <option value="atomic">Atomic (eV, u, Å³)</option>
              </select>
            </div>
            <div>
              <label htmlFor="system-type" className="block text-sm font-medium text-gray-700 mb-1">
                System Type:
              </label>
              <select
                id="system-type"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={systemType}
                onChange={(e) => setSystemType(e.target.value)}
              >
                <option value="two-state">Two-State System</option>
                <option value="ideal-gas">Ideal Gas</option>
              </select>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Common Inputs</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature (K):
                </label>
                <input
                  type="text"
                  id="temperature"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 300"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>
            </div>
          </div>
          {systemType === "two-state" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Two-State System Inputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="energy1" className="block text-sm font-medium text-gray-700 mb-1">
                    Energy Level 1 ({unitSystem === "si" ? "J" : "eV"}):
                  </label>
                  <input
                    type="text"
                    id="energy1"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 0"
                    value={energy1}
                    onChange={(e) => setEnergy1(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="energy2" className="block text-sm font-medium text-gray-700 mb-1">
                    Energy Level 2 ({unitSystem === "si" ? "J" : "eV"}):
                  </label>
                  <input
                    type="text"
                    id="energy2"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1.6e-19"
                    value={energy2}
                    onChange={(e) => setEnergy2(e.target.value)}
                  />
                </div>
                {mode === "entropy" && (
                  <>
                    <div>
                      <label htmlFor="num-particles" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Particles (N):
                      </label>
                      <input
                        type="text"
                        id="num-particles"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., 100"
                        value={numParticles}
                        onChange={(e) => setNumParticles(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="num-state1" className="block text-sm font-medium text-gray-700 mb-1">
                        Particles in State 1 (N₁):
                      </label>
                      <input
                        type="text"
                        id="num-state1"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., 50"
                        value={numState1}
                        onChange={(e) => setNumState1(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {systemType === "ideal-gas" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Ideal Gas Inputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mass" className="block text-sm font-medium text-gray-700 mb-1">
                    Particle Mass ({unitSystem === "si" ? "kg" : "u"}):
                  </label>
                  <input
                    type="text"
                    id="mass"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 6.646e-27"
                    value={mass}
                    onChange={(e) => setMass(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                    Volume ({unitSystem === "si" ? "m³" : "Å³"}):
                  </label>
                  <input
                    type="text"
                    id="volume"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1e-3"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                  />
                </div>
                {mode === "entropy" && (
                  <div>
                    <label
                      htmlFor="num-particles-gas"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Number of Particles (N):
                    </label>
                    <input
                      type="text"
                      id="num-particles-gas"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 1e20"
                      value={numParticlesGas}
                      onChange={(e) => setNumParticlesGas(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              onClick={calculateStatMech}
            >
              Calculate
            </button>
            <button
              className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
              onClick={importFromQuantumMechanics}
            >
              Import Energies
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
                  <p>Temperature: {results.T.toFixed(2)} K</p>
                  {results.systemType === "two-state" && (
                    <>
                      {results.mode === "partition-function" && (
                        <>
                          <p>
                            Energy Level 1: {results.E1.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
                          </p>
                          <p>
                            Energy Level 2: {results.E2.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
                          </p>
                          <p>Partition Function (Z): {results.Z.toFixed(2)}</p>
                        </>
                      )}
                      {results.mode === "entropy" && (
                        <>
                          <p>Number of Particles (N): {results.N}</p>
                          <p>Particles in State 1 (N₁): {results.N1}</p>
                          <p>
                            Entropy (S): {results.S.toFixed(2)} {unitSystem === "si" ? "J/K" : "eV/K"}
                          </p>
                        </>
                      )}
                      {results.mode === "average-energy" && (
                        <>
                          <p>
                            Energy Level 1: {results.E1.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
                          </p>
                          <p>
                            Energy Level 2: {results.E2.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
                          </p>
                          <p>
                            Average Energy (⟨E⟩): {results.avgE.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
                          </p>
                        </>
                      )}
                    </>
                  )}
                  {results.systemType === "ideal-gas" && (
                    <>
                      {results.mode === "partition-function" && (
                        <>
                          <p>
                            Mass: {results.m.toFixed(2)} {unitSystem === "si" ? "kg" : "u"}
                          </p>
                          <p>
                            Volume: {results.V.toFixed(2)} {unitSystem === "si" ? "m³" : "Å³"}
                          </p>
                          <p>Partition Function (Z): {results.Z.toFixed(2)}</p>
                        </>
                      )}
                      {results.mode === "entropy" && (
                        <>
                          <p>Number of Particles (N): {results.N}</p>
                          <p>
                            Mass: {results.m.toFixed(2)} {unitSystem === "si" ? "kg" : "u"}
                          </p>
                          <p>
                            Volume: {results.V.toFixed(2)} {unitSystem === "si" ? "m³" : "Å³"}
                          </p>
                          <p>
                            Entropy (S): {results.S.toFixed(2)} {unitSystem === "si" ? "J/K" : "eV/K"}
                          </p>
                        </>
                      )}
                      {results.mode === "average-energy" && (
                        <>
                          <p>
                            Mass: {results.m.toFixed(2)} {unitSystem === "si" ? "kg" : "u"}
                          </p>
                          <p>
                            Volume: {results.V.toFixed(2)} {unitSystem === "si" ? "m³" : "Å³"}
                          </p>
                          <p>
                            Average Energy (⟨E⟩): {results.avgE.toFixed(2)} {unitSystem === "si" ? "J" : "eV"}
                          </p>
                        </>
                      )}
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
                  Run {index + 1} ({run.mode}, {run.systemType}, {run.unitSystem}, {run.timestamp}):
                </p>
                <p>Temperature: {run.T.toFixed(2)} K</p>
                {run.systemType === "two-state" && (
                  <>
                    {run.mode === "partition-function" && (
                      <>
                        <p>
                          Energy Level 1: {run.E1.toFixed(2)} {run.unitSystem === "si" ? "J" : "eV"}
                        </p>
                        <p>
                          Energy Level 2: {run.E2.toFixed(2)} {run.unitSystem === "si" ? "J" : "eV"}
                        </p>
                        <p>Partition Function (Z): {run.Z.toFixed(2)}</p>
                      </>
                    )}
                    {run.mode === "entropy" && (
                      <>
                        <p>Number of Particles (N): {run.N}</p>
                        <p>Particles in State 1 (N₁): {run.N1}</p>
                        <p>
                          Entropy (S): {run.S.toFixed(2)} {run.unitSystem === "si" ? "J/K" : "eV/K"}
                        </p>
                      </>
                    )}
                    {run.mode === "average-energy" && (
                      <>
                        <p>
                          Energy Level 1: {run.E1.toFixed(2)} {run.unitSystem === "si" ? "J" : "eV"}
                        </p>
                        <p>
                          Energy Level 2: {run.E2.toFixed(2)} {run.unitSystem === "si" ? "J" : "eV"}
                        </p>
                        <p>
                          Average Energy (⟨E⟩): {run.avgE.toFixed(2)} {run.unitSystem === "si" ? "J" : "eV"}
                        </p>
                      </>
                    )}
                  </>
                )}
                {run.systemType === "ideal-gas" && (
                  <>
                    {run.mode === "partition-function" && (
                      <>
                        <p>
                          Mass: {run.m.toFixed(2)} {run.unitSystem === "si" ? "kg" : "u"}
                        </p>
                        <p>
                          Volume: {run.V.toFixed(2)} {run.unitSystem === "si" ? "m³" : "Å³"}
                        </p>
                        <p>Partition Function (Z): {run.Z.toFixed(2)}</p>
                      </>
                    )}
                    {run.mode === "entropy" && (
                      <>
                        <p>Number of Particles (N): {run.N}</p>
                        <p>
                          Mass: {run.m.toFixed(2)} {run.unitSystem === "si" ? "kg" : "u"}
                        </p>
                        <p>
                          Volume: {run.V.toFixed(2)} {run.unitSystem === "si" ? "m³" : "Å³"}
                        </p>
                        <p>
                          Entropy (S): {run.S.toFixed(2)} {run.unitSystem === "si" ? "J/K" : "eV/K"}
                        </p>
                      </>
                    )}
                    {run.mode === "average-energy" && (
                      <>
                        <p>
                          Mass: {run.m.toFixed(2)} {run.unitSystem === "si" ? "kg" : "u"}
                        </p>
                        <p>
                          Volume: {run.V.toFixed(2)} {run.unitSystem === "si" ? "m³" : "Å³"}
                        </p>
                        <p>
                          Average Energy (⟨E⟩): {run.avgE.toFixed(2)} {run.unitSystem === "si" ? "J" : "eV"}
                        </p>
                      </>
                    )}
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
