"use client";
import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function CircleCalculator() {
  const [calcType, setCalcType] = useState("basic");
  const [precision, setPrecision] = useState(2);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const chartRef = useRef(null);
  const svgRef = useRef(null);
  const inputsRef = useRef({
    basic: { value: "", type: "radius" },
    arc: { radius: "", angle: "", unit: "degrees" },
    sector: { radius: "", angle: "", unit: "degrees" },
    segment: { radius: "", angle: "", unit: "degrees" },
    chord: { radius: "", angle: "", unit: "degrees" },
    "from-area": { value: "" },
    "from-circumference": { value: "" },
    batchText: "",
    statInput: "",
    variation: "",
  });

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("circleCalcHistory")) || [];
    setCalculationHistory(savedHistory);
  }, []);

  const parseInput = (input) => {
    try {
      if (!input.trim()) throw new Error("Input cannot be empty");
      const value = math.evaluate(input);
      if (isNaN(value) || !isFinite(value)) throw new Error("Invalid numerical value");
      return value;
    } catch (e) {
      throw new Error("Invalid input: " + e.message);
    }
  };

  const toRadians = (angle, unit) => {
    return unit === "degrees" ? (angle * Math.PI) / 180 : angle;
  };

  const calculateParameters = (calcType, params, precision) => {
    let results = {};
    params = params.map((p) =>
      typeof p === "string" && !["degrees", "radians", "radius", "diameter"].includes(p) ? parseInput(p) : p
    );

    try {
      let radius;
      if (calcType === "basic") {
        const [value, type] = params;
        radius = type === "radius" ? value : value / 2;
        if (radius <= 0) throw new Error("Radius must be positive");
        results = {
          radius,
          diameter: 2 * radius,
          circumference: 2 * Math.PI * radius,
          area: Math.PI * radius * radius,
        };
      } else if (calcType === "arc") {
        const [r, angle, unit] = params;
        if (r <= 0) throw new Error("Radius must be positive");
        const theta = toRadians(angle, unit);
        if (theta <= 0 || theta >= 2 * Math.PI)
          throw new Error("Angle must be between 0 and 360° or 2π radians");
        results = { radius: r, angle, angleUnit: unit, arcLength: r * theta };
      } else if (calcType === "sector") {
        const [r, angle, unit] = params;
        if (r <= 0) throw new Error("Radius must be positive");
        const theta = toRadians(angle, unit);
        if (theta <= 0 || theta >= 2 * Math.PI)
          throw new Error("Angle must be between 0 and 360° or 2π radians");
        results = { radius: r, angle, angleUnit: unit, sectorArea: 0.5 * r * r * theta };
      } else if (calcType === "segment") {
        const [r, angle, unit] = params;
        if (r <= 0) throw new Error("Radius must be positive");
        const theta = toRadians(angle, unit);
        if (theta <= 0 || theta >= 2 * Math.PI)
          throw new Error("Angle must be between 0 and 360° or 2π radians");
        results = { radius: r, angle, angleUnit: unit, segmentArea: 0.5 * r * r * (theta - Math.sin(theta)) };
      } else if (calcType === "chord") {
        const [r, angle, unit] = params;
        if (r <= 0) throw new Error("Radius must be positive");
        const theta = toRadians(angle, unit);
        if (theta <= 0 || theta >= 2 * Math.PI)
          throw new Error("Angle must be between 0 and 360° or 2π radians");
        results = { radius: r, angle, angleUnit: unit, chordLength: 2 * r * Math.sin(theta / 2) };
      } else if (calcType === "from-area") {
        const [area] = params;
        if (area <= 0) throw new Error("Area must be positive");
        radius = Math.sqrt(area / Math.PI);
        results = { area, radius, diameter: 2 * radius, circumference: 2 * Math.PI * radius };
      } else if (calcType === "from-circumference") {
        const [circumference] = params;
        if (circumference <= 0) throw new Error("Circumference must be positive");
        radius = circumference / (2 * Math.PI);
        results = { circumference, radius, diameter: 2 * radius, area: Math.PI * radius * radius };
      }

      return Object.fromEntries(
        Object.entries(results).map(([k, v]) => [k, typeof v === "number" ? Number(v).toFixed(precision) : v])
      );
    } catch (e) {
      throw new Error(`Calculation error for ${calcType}: ${e.message}`);
    }
  };

  const handleCalculate = async () => {
    setError("");
    setSuccess("");
    try {
      const batchText = inputsRef.current.batchText;
      let results = [];
      let isBatch = inputsRef.current.batchFile || batchText;

      if (!isBatch) {
        const inputs = Object.values(inputsRef.current[calcType]);
        if (inputs.some((v) => !v && v !== 0)) throw new Error("All parameters are required");
        const result = calculateParameters(calcType, inputs, precision);
        result.calcType = calcType;
        results.push(result);
      } else {
        let calculations = [];
        if (inputsRef.current.batchFile) {
          const text = await inputsRef.current.batchFile.text();
          calculations = text
            .split("\n")
            .map((line) => line.split(",").map((s) => s.trim()))
            .filter((c) => c.length > 1);
        } else if (batchText) {
          calculations = batchText.split(";").map((c) => c.split(",").map((s) => s.trim()));
        }
        for (const c of calculations) {
          try {
            const [type, ...params] = c;
            if (!Object.keys(inputsRef.current).includes(type)) throw new Error("Invalid calculation type");
            if (params.length !== Object.keys(inputsRef.current[type]).length)
              throw new Error(`Incorrect number of parameters for ${type}`);
            const result = calculateParameters(type, params, precision);
            result.calcType = type;
            results.push(result);
          } catch (e) {
            console.warn(`Skipping invalid batch entry: ${e.message}`);
          }
        }
        if (results.length === 0) throw new Error("No valid calculations in batch input");
      }
      setResults(results);
      displayResults(results, isBatch);
    } catch (e) {
      setError(e.message || "Invalid input");
    }
  };

  const displayResults = (results, isBatch) => {
    const params = isBatch
      ? `Batch: ${results.length} calculations, Type: ${calcType}`
      : `${results[0].calcType}: ${Object.keys(inputsRef.current[results[0].calcType])
          .map((name) => `${name}=${results[0][name] || "N/A"}`)
          .join(", ")}`;
    const resultText = isBatch
      ? results
          .map((r) => {
            const paramText = Object.keys(inputsRef.current[r.calcType])
              .map((name) => `${name}: ${r[name] || "N/A"}`)
              .join(", ");
            const resultText = Object.entries(r)
              .filter(([k]) => !["calcType", ...Object.keys(inputsRef.current[r.calcType])].includes(k))
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ");
            return `<tr><td class="p-2">${r.calcType}</td><td class="p-2">${paramText}</td><td class="p-2">${resultText}</td></tr>`;
          })
          .join("")
      : Object.entries(results[0])
          .filter(([k]) => !["calcType", ...Object.keys(inputsRef.current[results[0].calcType])].includes(k))
          .map(([k, v]) => `${k}: ${v}`)
          .join("<br>");

    const historyEntry = {
      date: new Date().toLocaleString(),
      params,
      result: isBatch ? resultText : resultText.replace(/<br>/g, "; "),
    };
    const updatedHistory = [...calculationHistory, historyEntry];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("circleCalcHistory", JSON.stringify(updatedHistory));

    if (!isBatch && results.length === 1) {
      drawCircleVisualization(results[0]);
    }
    updateBarChart(results, isBatch);
  };

  const drawCircleVisualization = (result) => {
    const svg = svgRef.current;
    svg.innerHTML = "";
    const width = 300;
    const height = 300;
    const cx = width / 2;
    const cy = height / 2;
    let radius = parseFloat(result.radius);
    const maxRadius = 100;
    const scale = radius > 0 ? maxRadius / radius : 1;
    radius *= scale;

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#b91c1c");
    circle.setAttribute("stroke-width", "2");
    svg.appendChild(circle);

    if (["arc", "sector", "segment", "chord"].includes(result.calcType)) {
      let angle = parseFloat(result.angle);
      const unit = result.angleUnit;
      const theta = toRadians(angle, unit);
      const startAngle = 0;
      const endAngle = theta;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const largeArc = endAngle - startAngle <= Math.PI ? 0 : 1;

      if (result.calcType === "arc" || result.calcType === "sector" || result.calcType === "segment") {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d =
          result.calcType === "arc"
            ? `M ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2}`
            : `M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
        path.setAttribute("d", d);
        path.setAttribute("fill", result.calcType === "arc" ? "none" : "rgba(239, 68, 68, 0.3)");
        path.setAttribute("stroke", result.calcType === "arc" ? "#ef4444" : "none");
        path.setAttribute("stroke-width", "2");
        svg.appendChild(path);
      } else if (result.calcType === "chord") {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#ef4444");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
      }
    }

    const radiusLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    radiusLine.setAttribute("x1", cx);
    radiusLine.setAttribute("y1", cy);
    radiusLine.setAttribute("x2", cx + radius);
    radiusLine.setAttribute("y2", cy);
    radiusLine.setAttribute("stroke", "#10b981");
    radiusLine.setAttribute("stroke-width", "2");
    svg.appendChild(radiusLine);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", cx - 50);
    text.setAttribute("y", cy + 120);
    text.setAttribute("fill", "#000");
    text.setAttribute("font-size", "12");
    text.textContent = `Radius: ${Number(result.radius).toFixed(precision)}`;
    svg.appendChild(text);
  };

  const updateBarChart = (results, isBatch) => {
    if (chartRef.current) chartRef.current.destroy();
    const ctx = document.getElementById("bar-chart").getContext("2d");
    const values = results
      .map((r) => {
        if (calcType === "basic") return parseFloat(r.area);
        if (calcType === "arc") return parseFloat(r.arcLength);
        if (calcType === "sector") return parseFloat(r.sectorArea);
        if (calcType === "segment") return parseFloat(r.segmentArea);
        if (calcType === "chord") return parseFloat(r.chordLength);
        if (calcType === "from-area" || calcType === "from-circumference") return parseFloat(r.radius);
        return 0;
      })
      .filter((v) => !isNaN(v));
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: results.map((_, i) => `Calc ${i + 1}`),
        datasets: [
          {
            label:
              calcType === "basic"
                ? "Area"
                : calcType === "arc"
                ? "Arc Length"
                : calcType === "sector"
                ? "Sector Area"
                : calcType === "segment"
                ? "Segment Area"
                : calcType === "chord"
                ? "Chord Length"
                : "Radius",
            data: values,
            backgroundColor: "#ef4444",
            borderColor: "#b91c1c",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Value" } },
          x: { title: { display: true, text: "Calculations" } },
        },
        plugins: {
          title: { display: true, text: "Calculation Comparison" },
        },
      },
    });
  };

  const handleClear = () => {
    inputsRef.current = {
      basic: { value: "", type: "radius" },
      arc: { radius: "", angle: "", unit: "degrees" },
      sector: { radius: "", angle: "", unit: "degrees" },
      segment: { radius: "", angle: "", unit: "degrees" },
      chord: { radius: "", angle: "", unit: "degrees" },
      "from-area": { value: "" },
      "from-circumference": { value: "" },
      batchText: "",
      statInput: "",
      variation: "",
    };
    setError("");
    setSuccess("");
    setResults([]);
    if (chartRef.current) chartRef.current.destroy();
    svgRef.current.innerHTML = "";
  };

  const handleSave = () => {
    setSuccess("Calculation saved to history");
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.params}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calculation_history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calculation_history.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Calculation History", 10, 10);
    let y = 20;
    calculationHistory.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Parameters: ${entry.params}`, 10, y + 10);
      doc.text(`Result: ${entry.result}`, 10, y + 20);
      y += 40;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("calculation_history.pdf");
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Circle Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Calculation Type
                <span className="relative inline-block cursor-pointer ml-1">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Select the type of circle calculation.
                  </span>
                </span>
              </label>
              <select
                value={calcType}
                onChange={(e) => setCalcType(e.target.value)}
                className="p-3 border rounded-lg w-full"
              >
                <option value="basic">Basic Properties (Radius/Diameter)</option>
                <option value="arc">Arc Length</option>
                <option value="sector">Sector Area</option>
                <option value="segment">Segment Area</option>
                <option value="chord">Chord Length</option>
                <option value="from-area">Radius from Area</option>
                <option value="from-circumference">Radius from Circumference</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Precision
                <span className="relative inline-block cursor-pointer ml-1">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Decimal places for results.
                  </span>
                </span>
              </label>
              <select
                value={precision}
                onChange={(e) => setPrecision(parseInt(e.target.value))}
                className="p-3 border rounded-lg w-full"
              >
                <option value="2">2 Decimals</option>
                <option value="4">4 Decimals</option>
                <option value="6">6 Decimals</option>
                <option value="8">8 Decimals</option>
              </select>
            </div>
          </div>

          {calcType === "basic" && (
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">Radius or Diameter</label>
                <input
                  type="text"
                  value={inputsRef.current.basic.value}
                  onChange={(e) => (inputsRef.current.basic.value = e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 5"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">Input Type</label>
                <select
                  value={inputsRef.current.basic.type}
                  onChange={(e) => (inputsRef.current.basic.type = e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="radius">Radius</option>
                  <option value="diameter">Diameter</option>
                </select>
              </div>
            </div>
          )}

          {["arc", "sector", "segment", "chord"].includes(calcType) && (
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">Radius</label>
                <input
                  type="text"
                  value={inputsRef.current[calcType].radius}
                  onChange={(e) => (inputsRef.current[calcType].radius = e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 5"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">Angle</label>
                <input
                  type="text"
                  value={inputsRef.current[calcType].angle}
                  onChange={(e) => (inputsRef.current[calcType].angle = e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 90"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">Angle Unit</label>
                <select
                  value={inputsRef.current[calcType].unit}
                  onChange={(e) => (inputsRef.current[calcType].unit = e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="degrees">Degrees</option>
                  <option value="radians">Radians</option>
                </select>
              </div>
            </div>
          )}

          {["from-area", "from-circumference"].includes(calcType) && (
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {calcType === "from-area" ? "Area" : "Circumference"}
                </label>
                <input
                  type="text"
                  value={inputsRef.current[calcType].value}
                  onChange={(e) => (inputsRef.current[calcType].value = e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder={calcType === "from-area" ? "e.g., 78.54" : "e.g., 31.42"}
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Batch Input (CSV: type,value1,value2,...)
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Upload CSV or enter calculations (e.g., basic,5,radius;arc,5,90,degrees).
                </span>
              </span>
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => (inputsRef.current.batchFile = e.target.files[0])}
              className="p-3 border rounded-lg w-full mb-2"
            />
            <textarea
              value={inputsRef.current.batchText}
              onChange={(e) => (inputsRef.current.batchText = e.target.value)}
              className="p-3 border rounded-lg w-full"
              rows="4"
              placeholder="e.g., basic,5,radius;arc,5,90,degrees"
            />
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleCalculate}
              className="bg-red-500 text-white px-6 py-3 rounded-lg w-full sm:w-auto"
            >
              Calculate
            </button>
            <button
              onClick={handleClear}
              className="bg-red-500 text-white px-6 py-3 rounded-lg w-full sm:w-auto"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="bg-red-500 text-white px-6 py-3 rounded-lg w-full sm:w-auto"
            >
              Save Calculation
            </button>
          </div>

          <div className="mb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Features
            </button>
          </div>

          {showAdvanced && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Analyze Values (comma-separated)
                </label>
                <input
                  type="text"
                  value={inputsRef.current.statInput}
                  onChange={(e) => (inputsRef.current.statInput = e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 5,10,15"
                />
                <select
                  className="p-3 border rounded-lg w-full mt-2"
                  onChange={(e) => (inputsRef.current.statType = e.target.value)}
                >
                  <option value="radius">Radius</option>
                  <option value="area">Area</option>
                  <option value="circumference">Circumference</option>
                </select>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
                  Calculate Statistics
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Variation Range (±%)</label>
                <input
                  type="number"
                  step="any"
                  value={inputsRef.current.variation}
                  onChange={(e) => (inputsRef.current.variation = e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 5"
                />
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
                  Analyze Sensitivity
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Circles
          </button>

          {results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: results
                    .map((r) => {
                      const paramText = Object.keys(inputsRef.current[r.calcType])
                        .map((name) => `${name}: ${r[name] || "N/A"}`)
                        .join(", ");
                      const resultText = Object.entries(r)
                        .filter(
                          ([k]) => !["calcType", ...Object.keys(inputsRef.current[r.calcType])].includes(k)
                        )
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ");
                      return `<tr><td class="p-2">${r.calcType}</td><td class="p-2">${paramText}</td><td class="p-2">${resultText}</td></tr>`;
                    })
                    .join(""),
                }}
              />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Circle Visualization</h3>
                <svg ref={svgRef} className="w-full max-w-[300px] h-[300px] block mx-auto"></svg>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Values Comparison</h3>
                <canvas id="bar-chart" className="max-h-80"></canvas>
              </div>
              <div className="mt-6 overflow-x-auto max-h-[200px] overflow-y-auto">
                <h3 className="text-md font-medium text-red-900">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Parameters</th>
                      <th className="p-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationHistory.map((entry, index) => (
                      <tr key={index}>
                        <td className="p-2">{entry.date}</td>
                        <td className="p-2">{entry.params}</td>
                        <td className="p-2">{entry.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4">
                <button onClick={handleExportCSV} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Export CSV
                </button>
                <button onClick={handleExportJSON} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Export JSON
                </button>
                <button onClick={handleExportPDF} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Export PDF
                </button>
              </div>
            </div>
          )}

          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg max-w-[600px] w-[90%] relative">
                <span
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  &times;
                </span>
                <h2 className="text-xl font-semibold mb-4">Understanding Circles</h2>
                <p className="mb-4">
                  A circle is a round shape defined by its radius or diameter. Below are key formulas and
                  concepts.
                </p>
                <h3 className="text-md font-medium mb-2">Key Formulas</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Radius:</strong> \( r = \frac{d}
                    {2} \), where \( d \) is diameter.
                  </li>
                  <li>
                    <strong>Circumference:</strong> \( C = 2\pi r \).
                  </li>
                  <li>
                    <strong>Area:</strong> \( A = \pi r^2 \).
                  </li>
                  <li>
                    <strong>Arc Length:</strong> \( L = r \theta \), where \( \theta \) is in radians.
                  </li>
                  <li>
                    <strong>Sector Area:</strong> \( A = \frac{1}
                    {2} r^2 \theta \), where \( \theta \) is in radians.
                  </li>
                  <li>
                    <strong>Segment Area:</strong> \( A = \frac{1}
                    {2} r^2 (\theta - \sin\theta) \), where \( \theta \) is in radians.
                  </li>
                  <li>
                    <strong>Chord Length:</strong> \( c = 2r \sin\left(\frac\theta{2}\right) \), where \(
                    \theta \) is in radians.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Engineering:</strong> Design wheels, gears, and circular components.
                  </li>
                  <li>
                    <strong>Architecture:</strong> Create arches and domes.
                  </li>
                  <li>
                    <strong>Physics:</strong> Analyze rotational motion.
                  </li>
                  <li>
                    <strong>Geography:</strong> Calculate distances on circular paths.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Ensure positive values for radius, diameter, and area.</li>
                  <li>Use batch input for multiple calculations.</li>
                  <li>Visualize arcs and sectors with the SVG diagram.</li>
                  <li>Check sensitivity for radius variations.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Resources</h3>
                <p className="mb-4">For more information, visit:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <a
                      href="https://www.khanacademy.org/math/geometry-home"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Khan Academy: Geometry
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.mathsisfun.com/geometry/circle.html"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Math Is Fun: Circles
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
