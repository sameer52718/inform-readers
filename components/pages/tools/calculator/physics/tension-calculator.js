"use client";
import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, Filler);

export default function Home() {
  const [config, setConfig] = useState("hanging");
  const [gravity, setGravity] = useState("9.81");
  const [unit, setUnit] = useState("N");
  const [inputValues, setInputValues] = useState({});
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(null);
  const svgRef = useRef(null);

  const inputs = {
    hanging: [{ id: "mass", label: "Mass (kg)", placeholder: "e.g., 10", type: "number" }],
    angled: [
      { id: "mass", label: "Mass (kg)", placeholder: "e.g., 10", type: "number" },
      { id: "theta1", label: "Angle 1 (degrees)", placeholder: "e.g., 30", type: "number" },
      { id: "theta2", label: "Angle 2 (degrees)", placeholder: "e.g., 45", type: "number" },
    ],
    pulley: [
      { id: "mass1", label: "Mass 1 (kg)", placeholder: "e.g., 5", type: "number" },
      { id: "mass2", label: "Mass 2 (kg)", placeholder: "e.g., 7", type: "number" },
    ],
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHistory(JSON.parse(localStorage.getItem("tensionHistory")) || []);
    }
  }, []);

  useEffect(() => {
    if (config === "pulley" && svgRef.current) {
      let t = 0;
      const update = () => {
        const offset = Math.sin(t) * 10;
        const rects = svgRef.current.querySelectorAll("rect");
        if (rects[0]) rects[0].setAttribute("y", 100 + offset);
        if (rects[1]) rects[1].setAttribute("y", 160 - offset);
        t += 0.05;
        requestAnimationFrame(update);
      };
      update();
    }
  }, [config, inputValues]);

  const validateInputs = () => {
    let valid = true;
    const newErrors = {};
    inputs[config].forEach((input) => {
      const value = inputValues[input.id] || "";
      if (value === "" || isNaN(value)) {
        newErrors[input.id] = `${input.label} must be a valid number`;
        valid = false;
      } else if (parseFloat(value) <= 0 && input.id.includes("mass")) {
        newErrors[input.id] = `${input.label} must be positive`;
        valid = false;
      } else if (input.id.includes("theta") && (value < 0 || value >= 90)) {
        newErrors[input.id] = `${input.label} must be between 0 and 90 degrees`;
        valid = false;
      } else {
        newErrors[input.id] = "";
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const calculateTension = () => {
    if (!validateInputs()) return;

    const g = parseFloat(gravity);
    let tensions = [];
    let warningMsg = "";

    if (config === "hanging") {
      const tension = inputValues.mass * g;
      tensions = [tension];
    } else if (config === "angled") {
      const { mass, theta1, theta2 } = inputValues;
      const rad1 = (theta1 * Math.PI) / 180;
      const rad2 = (theta2 * Math.PI) / 180;
      const t2 =
        (mass * g * Math.cos(rad1)) / (Math.sin(rad2) * Math.cos(rad1) + Math.sin(rad1) * Math.cos(rad2));
      const t1 = (mass * g - t2 * Math.sin(rad2)) / Math.sin(rad1);
      tensions = [t1, t2];
      if (t1 < 0 || t2 < 0) warningMsg = "Warning: Negative tensions indicate unstable configuration";
    } else {
      const { mass1, mass2 } = inputValues;
      const tension = Math.abs(mass1 - mass2) * g;
      tensions = [tension];
      if (mass1 === mass2) warningMsg = "Warning: Equal masses result in no net tension";
    }

    tensions = tensions.map((t) => (unit === "kN" ? t / 1000 : t).toFixed(2));
    const result = { tensions, warning: warningMsg };
    setResults(result);

    const historyEntry = {
      config,
      values: { ...inputValues },
      g,
      unit,
      results: result,
      timestamp: new Date().toLocaleString(),
    };
    const newHistory = [...history, historyEntry];
    setHistory(newHistory);
    localStorage.setItem("tensionHistory", JSON.stringify(newHistory));

    renderChart();
    animateTension();
  };

  const renderChart = () => {
    if (!chartRef.current) return;
    let labels, data, label, title;

    if (config === "angled") {
      labels = Array.from({ length: 10 }, (_, i) => (i * 9).toFixed(0));
      data = labels.map((theta) => {
        const rad = (theta * Math.PI) / 180;
        const t =
          (inputValues.mass * parseFloat(gravity) * Math.cos(rad)) /
          (Math.sin(rad) * Math.cos(rad) + Math.sin(rad) * Math.cos(rad));
        return (unit === "kN" ? t / 1000 : t).toFixed(2);
      });
      label = `Tension (${unit})`;
      title = "Tension vs. Angle";
    } else {
      const maxMass =
        config === "hanging" ? inputValues.mass * 2 : Math.max(inputValues.mass1, inputValues.mass2) * 2;
      labels = Array.from({ length: 10 }, (_, i) => (maxMass * (0.1 + i * 0.1)).toFixed(1));
      data = labels.map((m) => {
        let t =
          config === "hanging"
            ? m * parseFloat(gravity)
            : Math.abs(m - (config === "pulley" ? inputValues.mass2 : inputValues.mass1)) *
              parseFloat(gravity);
        return (unit === "kN" ? t / 1000 : t).toFixed(2);
      });
      label = `Tension (${unit})`;
      title = "Tension vs. Mass";
    }

    chartRef.current.data = {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
    chartRef.current.options = {
      responsive: true,
      scales: {
        x: { title: { display: true, text: config === "angled" ? "Angle (degrees)" : "Mass (kg)" } },
        y: { title: { display: true, text: label } },
      },
      plugins: { title: { display: true, text: title } },
    };
    chartRef.current.update();
    setShowChart(true);
  };

  const animateTension = () => {
    if (!svgRef.current) return;
    svgRef.current.innerHTML = "";
    if (config === "hanging") {
      svgRef.current.innerHTML = `
        <line x1="150" y1="20" x2="150" y2="100" stroke="#1f2937" stroke-width="2" />
        <rect x="140" y="100" width="20" height="20" fill="#ef4444" />
      `;
    } else if (config === "angled") {
      const rad1 = ((inputValues.theta1 || 45) * Math.PI) / 180;
      const rad2 = ((inputValues.theta2 || 45) * Math.PI) / 180;
      const x1 = 150 - 80 * Math.cos(rad1);
      const y1 = 20 + 80 * Math.sin(rad1);
      const x2 = 150 + 80 * Math.cos(rad2);
      const y2 = 20 + 80 * Math.sin(rad2);
      svgRef.current.innerHTML = `
        <line x1="150" y1="100" x2="${x1}" y2="${y1}" stroke="#1f2937" stroke-width="2" />
        <line x1="150" y1="100" x2="${x2}" y2="${y2}" stroke="#1f2937" stroke-width="2" />
        <rect x="140" y="100" width="20" height="20" fill="#ef4444" />
      `;
    } else {
      svgRef.current.innerHTML = `
        <circle cx="150" cy="20" r="10" fill="#4b5563" />
        <line x1="150" y1="30" x2="150" y2="100" stroke="#1f2937" stroke-width="2" />
        <line x1="150" y1="30" x2="150" y2="160" stroke="#1f2937" stroke-width="2" />
        <rect x="140" y="100" width="20" height="20" fill="#ef4444" />
        <rect x="140" y="160" width="20" height="20" fill="#f59e0b" />
      `;
    }
  };

  const exportHistory = () => {
    if (history.length === 0) return;
    const csv = [
      "Configuration,Inputs,Gravity,Tension,Unit,Timestamp",
      ...history.map(
        (entry) =>
          `${entry.config},"${JSON.stringify(entry.values)}",${entry.g},${entry.results.tensions.join(";")},${
            entry.unit
          },${entry.timestamp}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tension_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportChart = () => {
    if (!chartRef.current) return;
    const a = document.createElement("a");
    a.href = chartRef.current.toBase64Image();
    a.download = "tension_chart.png";
    a.click();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("tensionHistory");
  };

  const handleInputChange = (id, value) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-5">
        <div className="w-full max-w-lg bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-center text-red-500 mb-6 animate-pulse">
            Tension Calculator
          </h1>
          <div className="mb-4">
            <label htmlFor="config" className="block text-sm font-medium text-gray-700 mb-1">
              Configuration
            </label>
            <select
              id="config"
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
              value={config}
              onChange={(e) => {
                setConfig(e.target.value);
                setInputValues({});
                setErrors({});
                setResults(null);
                animateTension();
              }}
            >
              <option value="hanging">Hanging Mass</option>
              <option value="angled">Two Angled Ropes</option>
              <option value="pulley">Single Pulley</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="gravity" className="block text-sm font-medium text-gray-700 mb-1">
              Gravity Preset
            </label>
            <select
              id="gravity"
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
              value={gravity}
              onChange={(e) => setGravity(e.target.value)}
            >
              <option value="9.81">Earth (9.81 m/s²)</option>
              <option value="1.625">Moon (1.625 m/s²)</option>
              <option value="3.711">Mars (3.711 m/s²)</option>
            </select>
          </div>
          <div className="mb-4">
            {inputs[config].map((input) => (
              <div key={input.id} className="mb-2">
                <label htmlFor={input.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {input.label}
                </label>
                <input
                  id={input.id}
                  type={input.type}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder={input.placeholder}
                  step="any"
                  value={inputValues[input.id] || ""}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                />
                <p className={`text-red-500 text-xs mt-1 ${errors[input.id] ? "" : "invisible"}`}>
                  {errors[input.id] || " "}
                </p>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Tension Unit
            </label>
            <select
              id="unit"
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="N">N</option>
              <option value="kN">kN</option>
            </select>
          </div>
          <button
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500 mb-4"
            onClick={calculateTension}
          >
            Calculate
          </button>
          {results && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-lg text-gray-900">
                Tension:{" "}
                {config === "angled"
                  ? `${results.tensions[0]} ${unit}, ${results.tensions[1]} ${unit}`
                  : `${results.tensions[0]} ${unit}`}
              </p>
              {results.warning && <p className="text-red-500 text-sm mt-1">{results.warning}</p>}
            </div>
          )}
          <div className="flex gap-4 mb-4">
            <button
              className="flex-1 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all focus:ring-2 focus:ring-gray-500"
              onClick={() => {
                setShowChart(!showChart);
                if (!showChart && results) renderChart();
              }}
            >
              {showChart ? "Hide Chart" : "Show Chart"}
            </button>
            <button
              className={`flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500 ${
                !showChart ? "hidden" : ""
              }`}
              onClick={exportChart}
            >
              Export Chart
            </button>
          </div>
          {showChart && (
            <div className="mb-4">
              <canvas id="tension-chart" ref={chartRef}></canvas>
            </div>
          )}
          <div className="mb-4 text-center">
            <svg ref={svgRef} className="w-full max-w-[300px] h-[200px] mx-auto">
              <line x1="150" y1="20" x2="150" y2="100" stroke="#1f2937" strokeWidth="2" />
              <rect x="140" y="100" width="20" height="20" fill="#ef4444" />
            </svg>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg max-h-52 overflow-y-auto">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Calculation History</h2>
            {history.map((entry, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-lg mb-2 hover:bg-gray-200 transition-all">
                <p>
                  <strong>Config:</strong> {entry.config}
                </p>
                <p>
                  <strong>Inputs:</strong> {JSON.stringify(entry.values)}
                </p>
                <p>
                  <strong>Tension:</strong> {entry.results.tensions.join(", ")} {entry.unit}
                </p>
                <p className="text-gray-500 text-sm">{entry.timestamp}</p>
              </div>
            ))}
            <div className="flex gap-4 mt-4">
              <button
                className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all focus:ring-2 focus:ring-green-500"
                onClick={exportHistory}
              >
                Export History
              </button>
              <button
                className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
                onClick={clearHistory}
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
