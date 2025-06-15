"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [x1, setX1] = useState("");
  const [y1, setY1] = useState("");
  const [x2, setX2] = useState("");
  const [y2, setY2] = useState("");
  const [calcType, setCalcType] = useState("all");
  const [precision, setPrecision] = useState("2");
  const [angleUnit, setAngleUnit] = useState("degrees");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState([]);
  const [statsContent, setStatsContent] = useState("");
  const [history, setHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const linePlotRef = useRef(null);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("slopeCalcHistory");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(
            parsed.filter(
              (entry) =>
                entry &&
                typeof entry.date === "string" &&
                typeof entry.params === "string" &&
                typeof entry.result === "string"
            )
          );
        }
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }

    // Load external scripts
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/mathjs@11.8.0/lib/browser/math.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/plotly.js@2.27.0/dist/plotly.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
    ]).catch((err) => console.error("Failed to load scripts:", err));

    // Initialize Plotly
    if (linePlotRef.current) {
      window.Plotly.newPlot(linePlotRef.current, [], { title: "Line Visualization" });
    }

    // Cleanup
    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, []);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const showError = (message) => {
    clearMessages();
    setErrorMessage(String(message || "An unexpected error occurred"));
  };

  const showSuccess = (message) => {
    clearMessages();
    setSuccessMessage(String(message || "Operation completed successfully"));
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const parseCoordinate = (input) => {
    try {
      if (!input.trim()) throw new Error("Input cannot be empty");
      if (input.includes("/")) {
        const [num, denom] = input.split("/").map((n) => parseFloat(n.trim()));
        if (denom === 0) throw new Error("Division by zero");
        return num / denom;
      }
      const value = window.math.evaluate(input);
      if (isNaN(value) || !isFinite(value)) throw new Error("Invalid number");
      return value;
    } catch (e) {
      throw new Error(`Invalid coordinate: ${e.message}`);
    }
  };

  const calculateParameters = (x1, y1, x2, y2, precision, angleUnit) => {
    x1 = parseCoordinate(x1);
    y1 = parseCoordinate(y1);
    x2 = parseCoordinate(x2);
    y2 = parseCoordinate(y2);

    let slope, equation, angle, distance, midpoint;

    // Slope
    if (x1 === x2) {
      slope = "undefined";
    } else if (y1 === y2) {
      slope = 0;
    } else {
      slope = (y2 - y1) / (x2 - x1);
    }

    // Line Equation
    if (slope === "undefined") {
      equation = `x = ${x1.toFixed(precision)}`;
    } else {
      const b = y1 - (slope * x1 || 0);
      const sign = b >= 0 ? "+" : "";
      equation = `y = ${slope.toFixed(precision)}x ${sign} ${b.toFixed(precision)}`;
    }

    // Angle
    if (slope === "undefined") {
      angle = angleUnit === "degrees" ? 90 : Math.PI / 2;
    } else {
      angle = Math.atan(slope);
      if (angleUnit === "degrees") {
        angle = (angle * 180) / Math.PI;
      }
    }

    // Distance
    distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // Midpoint
    midpoint = [(x1 + x2) / 2, (y1 + y2) / 2];

    return {
      slope: typeof slope === "number" ? slope.toFixed(precision) : slope,
      equation,
      angle: angle.toFixed(precision),
      angleUnit,
      distance: distance.toFixed(precision),
      midpoint: midpoint.map((v) => v.toFixed(precision)),
      x1,
      y1,
      x2,
      y2,
    };
  };

  const computeCalculation = (x1, y1, x2, y2, calcType, precision, angleUnit) => {
    const params = calculateParameters(x1, y1, x2, y2, precision, angleUnit);
    params.calcType = calcType;
    return params;
  };

  const calculate = async () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision);
      if (isNaN(precisionVal) || precisionVal < 0) throw new Error("Invalid precision");

      let calcResults = [];
      const isBatch = batchFile || batchText;

      if (!isBatch) {
        if (!x1.trim() || !y1.trim() || !x2.trim() || !y2.trim())
          throw new Error("All coordinates are required");
        const result = computeCalculation(x1, y1, x2, y2, calcType, precisionVal, angleUnit);
        calcResults.push(result);
        displayResults(calcResults, calcType, precisionVal, isBatch);
      } else {
        let points = [];
        if (batchFile) {
          points = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = e.target.result;
              const parsed = text
                .split("\n")
                .map((line) => line.split(",").map((s) => s.trim()))
                .filter((p) => p.length === 4);
              resolve(parsed);
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          points = batchText
            .split(";")
            .map((p) => p.split(",").map((s) => s.trim()))
            .filter((p) => p.length === 4);
        }
        await processBatch(points, calcResults);
        if (calcResults.length === 0) throw new Error("No valid points in batch input");
        displayResults(calcResults, calcType, precisionVal, isBatch);
      }
    } catch (e) {
      console.error("Calculation error:", e);
      showError(e.message || "Invalid input");
    }
  };

  const processBatch = async (points, calcResults) => {
    for (const [px1, py1, px2, py2] of points) {
      try {
        const result = computeCalculation(px1, py1, px2, py2, calcType, parseInt(precision), angleUnit);
        calcResults.push(result);
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const displayResults = (results, calcType, precision, isBatch) => {
    let output = [];
    if (isBatch) {
      output.push(
        <table key="batch-results" className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Point 1</th>
              <th className="p-2">Point 2</th>
              <th className="p-2">Slope</th>
              <th className="p-2">Equation</th>
              <th className="p-2">Angle</th>
              <th className="p-2">Distance</th>
              <th className="p-2">Midpoint</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td className="p-2">
                  ({r.x1.toFixed(precision)}, {r.y1.toFixed(precision)})
                </td>
                <td className="p-2">
                  ({r.x2.toFixed(precision)}, {r.y2.toFixed(precision)})
                </td>
                <td className="p-2">{r.slope}</td>
                <td className="p-2">{r.equation}</td>
                <td className="p-2">
                  {r.angle} {r.angleUnit}
                </td>
                <td className="p-2">{r.distance}</td>
                <td className="p-2">
                  ({r.midpoint[0]}, {r.midpoint[1]})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      const r = results[0];
      const items = [];
      if (calcType === "all" || calcType === "slope") items.push(`Slope: ${r.slope}`);
      if (calcType === "all" || calcType === "equation") items.push(`Line Equation: ${r.equation}`);
      if (calcType === "all" || calcType === "angle")
        items.push(`Angle of Inclination: ${r.angle} ${r.angleUnit}`);
      if (calcType === "all" || calcType === "distance") items.push(`Distance: ${r.distance}`);
      if (calcType === "all" || calcType === "midpoint")
        items.push(`Midpoint: (${r.midpoint[0]}, ${r.midpoint[1]})`);
      output.push(
        <div key="single-result">
          <strong>Results:</strong>
          <br />
          {items.map((item, i) => (
            <div key={i}>
              {item}
              <br />
            </div>
          ))}
          <br />
          <strong>Points:</strong>
          <br />
          Point 1: ({r.x1.toFixed(precision)}, {r.y1.toFixed(precision)})<br />
          Point 2: ({r.x2.toFixed(precision)}, {r.y2.toFixed(precision)})
        </div>
      );
    }

    let statsText = "";
    if (isBatch && results.length > 1) {
      const slopes = results.filter((r) => r.slope !== "undefined").map((r) => parseFloat(r.slope));
      if (slopes.length > 0) {
        const stats = {
          mean: window.math.mean(slopes),
          median: window.math.median(slopes),
          stdDev: window.math.std(slopes),
          min: Math.min(...slopes),
          max: Math.max(...slopes),
        };
        statsText = `
          <strong>Statistics (Slopes):</strong><br>
          Mean: ${stats.mean.toFixed(precision)}<br>
          Median: ${stats.median.toFixed(precision)}<br>
          Standard Deviation: ${stats.stdDev.toFixed(precision)}<br>
          Min: ${stats.min.toFixed(precision)}<br>
          Max: ${stats.max.toFixed(precision)}
        `;
      }
    }

    setResults(output);
    setStatsContent(statsText);

    const params = isBatch
      ? `Batch: ${results.length} calculations, Type: ${calcType}`
      : `P1: (${results[0].x1.toFixed(precision)}, ${results[0].y1.toFixed(
          precision
        )}), P2: (${results[0].x2.toFixed(precision)}, ${results[0].y2.toFixed(
          precision
        )}), Type: ${calcType}`;
    saveToHistory(
      params,
      output
        .map(
          (o) =>
            o.props.children
              .toString()
              .replace(/<[^>]+>/g, "; ")
              .substring(0, 100) + "..."
        )
        .join("; ")
    );
    updateVisualizations(results, calcType, isBatch);
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const slopes = statInput
        .split(",")
        .map((s) => parseCoordinate(s))
        .filter((n) => isFinite(n));
      const precisionVal = parseInt(precision);
      if (slopes.length === 0) throw new Error("Invalid slope list");

      const stats = {
        mean: window.math.mean(slopes),
        median: window.math.median(slopes),
        stdDev: window.math.std(slopes),
        min: Math.min(...slopes),
        max: Math.max(...slopes),
      };
      const statsText = `
        Mean: ${stats.mean.toFixed(precisionVal)}<br>
        Median: ${stats.median.toFixed(precisionVal)}<br>
        Standard Deviation: ${stats.stdDev.toFixed(precisionVal)}<br>
        Min: ${stats.min.toFixed(precisionVal)}<br>
        Max: ${stats.max.toFixed(precisionVal)}
      `;
      const expression = `Stats(${slopes.join(", ")})`;

      setResults([
        <div key="stats">
          <strong>Statistical Analysis (Slopes):</strong>
          <br dangerouslySetInnerHTML={{ __html: statsText }} />
        </div>,
      ]);
      setStatsContent("");
      saveToHistory(expression, statsText.replace(/<br>/g, "; "));
      updateBarChart(slopes, true);
    } catch (e) {
      console.error("Stats error:", e);
      showError("Invalid statistical input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const variationVal = parseFloat(variation);
      const precisionVal = parseInt(precision);
      if (isNaN(variationVal) || variationVal <= 0) throw new Error("Invalid variation percentage");
      if (!x1.trim() || !y1.trim() || !x2.trim() || !y2.trim()) throw new Error("All coordinates required");

      const coords = [parseCoordinate(x1), parseCoordinate(y1), parseCoordinate(x2), parseCoordinate(y2)];
      const sensResults = [];
      const step = variationVal / 5;

      for (let v = -variationVal; v <= variationVal; v += step) {
        const variedCoords = coords.map((c) => c * (1 + v / 100));
        const params = calculateParameters(...variedCoords, precisionVal, angleUnit);
        sensResults.push({
          variation: v,
          slope: params.slope,
          angle: params.angle,
        });
      }

      const resultText = sensResults
        .map(
          (r) => `Variation ${r.variation.toFixed(2)}%: Slope = ${r.slope}, Angle = ${r.angle} ${angleUnit}`
        )
        .join("<br>");

      setResults([
        <div key="sensitivity">
          <strong>Sensitivity Analysis:</strong>
          <br dangerouslySetInnerHTML={{ __html: resultText }} />
        </div>,
      ]);
      setStatsContent("");
      saveToHistory(`Sensitivity (±${variationVal}%)`, resultText.replace(/<br>/g, "; "));
      updateSensitivityChart(sensResults, angleUnit);
    } catch (e) {
      console.error("Sensitivity error:", e);
      showError("Invalid sensitivity input: " + e.message);
    }
  };

  const updateVisualizations = (results, calcType, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();

    // Line Plot (Single Calculation)
    if (!isBatch && results.length === 1 && linePlotRef.current) {
      const r = results[0];
      const xMin = Math.min(r.x1, r.x2) - 2;
      const xMax = Math.max(r.x1, r.x2) + 2;
      let xValues = [xMin, xMax];
      let yValues;
      if (r.slope === "undefined") {
        yValues = [r.y1 - 2, r.y1 + 2];
        xValues = [r.x1, r.x1];
      } else {
        yValues = xValues.map((x) => r.slope * x + (r.y1 - (r.slope * r.x1 || 0)));
      }

      const trace1 = {
        x: xValues,
        y: yValues,
        mode: "lines",
        name: "Line",
        line: { color: "#ef4444" },
      };
      const trace2 = {
        x: [r.x1, r.x2],
        y: [r.y1, r.y2],
        mode: "markers",
        name: "Points",
        marker: { size: 10, color: "#ef4444" },
      };
      const trace3 = {
        x: [r.midpoint[0]],
        y: [r.midpoint[1]],
        mode: "markers",
        name: "Midpoint",
        marker: { size: 10, color: "#ef4444" },
      };

      const layout = {
        title: "Line Visualization",
        xaxis: { title: "X" },
        yaxis: { title: "Y" },
        showlegend: true,
        margin: { t: 50, b: 50, l: 50, r: 50 },
      };

      window.Plotly.newPlot(linePlotRef.current, [trace1, trace2, trace3], layout);
    } else if (linePlotRef.current) {
      window.Plotly.newPlot(linePlotRef.current, [], {
        title: "Line Visualization (Single Calculation Only)",
      });
    }

    // Bar Chart (Slope Comparison)
    const slopes = results.filter((r) => r.slope !== "undefined").map((r) => parseFloat(r.slope));
    if (slopes.length > 0) {
      updateBarChart(slopes, isBatch);
    }
  };

  const updateBarChart = (slopes, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      barChartInstance.current = new window.Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: isBatch ? slopes.map((_, i) => `Calc ${i + 1}`) : ["Slope"],
          datasets: [
            {
              label: "Slope",
              data: slopes,
              backgroundColor: "#ef4444",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Slope" } },
            x: { title: { display: true, text: isBatch ? "Calculation" : "Result" } },
          },
          plugins: {
            title: { display: true, text: "Slope Comparison" },
          },
        },
      });
    }
  };

  const updateSensitivityChart = (results, angleUnit) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      barChartInstance.current = new window.Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: results.map((r) => r.variation.toFixed(2) + "%"),
          datasets: [
            {
              label: "Slope",
              data: results.map((r) => (r.slope === "undefined" ? 0 : r.slope)),
              backgroundColor: "#ef4444",
            },
            {
              label: `Angle (${angleUnit})`,
              data: results.map((r) => r.angle),
              backgroundColor: "#ef4444",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Value" } },
            x: { title: { display: true, text: "Variation (%)" } },
          },
          plugins: {
            title: { display: true, text: "Sensitivity Analysis" },
          },
        },
      });
    }
  };

  const clearInputs = () => {
    setX1("");
    setY1("");
    setX2("");
    setY2("");
    setCalcType("all");
    setPrecision("2");
    setAngleUnit("degrees");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    clearMessages();
    setResults([]);
    setStatsContent("");
    if (linePlotRef.current) {
      window.Plotly.newPlot(linePlotRef.current, [], { title: "Line Visualization" });
    }
    if (barChartInstance.current) barChartInstance.current.destroy();
  };

  const saveCalculation = () => {
    if (results.length > 0) {
      showSuccess("Calculation saved to history!");
    } else {
      showError("No valid calculation to save.");
    }
  };

  const saveToHistory = (params, result) => {
    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        params: String(params || ""),
        result: String(result || ""),
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("slopeCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "slope_calc_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "slope_calc_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Slope Calculator History", 10, 10);
    doc.setFontSize(12);
    let y = 20;
    history.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Parameters: ${entry.params}`, 10, y + 10);
      doc.text(`Result: ${entry.result}`, 10, y + 20);
      y += 40;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("slope_calc_history.pdf");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
      calculate();
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-white flex justify-center items-center p-4 font-inter"
        onKeyDown={handleKeyDown}
      >
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">Advanced Slope Calculator</h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Point 1 (x₁)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    X-coordinate of first point.
                  </span>
                </label>
                <input
                  type="text"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 1 or 1/2"
                  value={x1}
                  onChange={(e) => setX1(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Point 1 (y₁)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Y-coordinate of first point.
                  </span>
                </label>
                <input
                  type="text"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 2 or 3e-1"
                  value={y1}
                  onChange={(e) => setY1(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Point 2 (x₂)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    X-coordinate of second point.
                  </span>
                </label>
                <input
                  type="text"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 3 or 0.5"
                  value={x2}
                  onChange={(e) => setX2(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Point 2 (y₂)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Y-coordinate of second point.
                  </span>
                </label>
                <input
                  type="text"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 4 or 2/3"
                  value={y2}
                  onChange={(e) => setY2(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-end mt-4">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Calculation Type
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select the type of calculation.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                >
                  <option value="all">All (Slope, Equation, Angle, Distance, Midpoint)</option>
                  <option value="slope">Slope Only</option>
                  <option value="equation">Line Equation</option>
                  <option value="angle">Angle of Inclination</option>
                  <option value="distance">Distance Between Points</option>
                  <option value="midpoint">Midpoint</option>
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Precision
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Decimal places for results.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value)}
                >
                  <option value="0">0 Decimals</option>
                  <option value="2">2 Decimals</option>
                  <option value="4">4 Decimals</option>
                  <option value="6">6 Decimals</option>
                  <option value="8">8 Decimals</option>
                  <option value="10">10 Decimals</option>
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Angle Unit
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Unit for angle of inclination.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={angleUnit}
                  onChange={(e) => setAngleUnit(e.target.value)}
                >
                  <option value="degrees">Degrees</option>
                  <option value="radians">Radians</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: x₁,y₁,x₂,y₂)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter points (e.g., 1,2,3,4;5,6,7,8).
                </span>
              </label>
              <input
                type="file"
                accept=".csv"
                className="p-3 border rounded-lg w-full bg-gray-200 mb-2"
                onChange={(e) => setBatchFile(e.target.files[0])}
              />
              <textarea
                className="p-3 border rounded-lg w-full bg-gray-200"
                rows="4"
                placeholder="e.g., 1,2,3,4;5,6,7,8"
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4 mb-6">
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              onClick={calculate}
            >
              Calculate
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              onClick={clearInputs}
            >
              Clear
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              onClick={saveCalculation}
            >
              Save Calculation
            </button>
          </div>
          <div className="mb-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Features
            </button>
          </div>
          {showAdvanced && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Analyze Slopes (comma-separated)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter slopes for statistical analysis.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 2,0.5,-1"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={calculateStats}
                >
                  Calculate Statistics
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Variation Range (±%)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Percentage variation for sensitivity analysis.
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 5"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={calculateSensitivity}
                >
                  Analyze Sensitivity
                </button>
              </div>
            </div>
          )}
          {(results.length > 0 || statsContent) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div className="text-gray-600 mb-4">{results}</div>
              <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: statsContent }} />
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Line Visualization</h3>
                <div ref={linePlotRef} className="w-full h-[400px]" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Slope Comparison</h3>
                <canvas ref={barChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 max-h-52 overflow-y-auto">
                <h3 className="text-md font-medium text-gray-700">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Parameters</th>
                      <th className="p-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-2 text-center">
                          No history available
                        </td>
                      </tr>
                    ) : (
                      history.map((entry, i) => (
                        <tr key={i}>
                          <td className="p-2">{entry.date}</td>
                          <td className="p-2">{entry.params}</td>
                          <td className="p-2">{entry.result}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={exportCSV}
                >
                  Export CSV
                </button>
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={exportJSON}
                >
                  Export JSON
                </button>
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={exportPDF}
                >
                  Export PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
