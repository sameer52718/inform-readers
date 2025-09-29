"use client";
import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function AdvancedPercentErrorCalculator() {
  const [expValue, setExpValue] = useState("");
  const [theoValue, setTheoValue] = useState("");
  const [unit, setUnit] = useState("");
  const [precision, setPrecision] = useState("2");
  const [errorType, setErrorType] = useState("percent");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState([]);
  const [statsContent, setStatsContent] = useState("");
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const barChartRef = useRef(null);
  const scatterChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const scatterChartInstance = useRef(null);
  const lineChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("percentErrorHistory") || "[]");
    setCalculationHistory(stored);
    updateHistoryTable();
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const showError = (message) => {
    setError(message);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 2000);
  };

  const computeError = (exp, theo, unit, precision, errorType) => {
    const absoluteError = Math.abs(exp - theo);
    const relativeError = absoluteError / Math.abs(theo);
    const percentError = relativeError * 100;
    let resultValue;
    switch (errorType) {
      case "absolute":
        resultValue = absoluteError;
        break;
      case "relative":
        resultValue = relativeError;
        break;
      case "percent":
      default:
        resultValue = percentError;
        break;
    }
    return {
      experimental: exp,
      theoretical: theo,
      absoluteError,
      relativeError,
      percentError,
      resultValue: parseFloat(resultValue.toFixed(precision)),
      unit,
    };
  };

  const calculateError = async () => {
    clearMessages();
    try {
      const isBatch = batchFile || batchText;
      let pairs = [];

      if (!isBatch && (!expValue || !theoValue)) {
        throw new Error("Enter experimental and theoretical values for single calculation");
      }

      if (isBatch) {
        if (batchFile) {
          const text = await batchFile.text();
          pairs = text
            .split("\n")
            .map((line) => line.split(",").map(Number))
            .filter((pair) => pair.length === 2 && !pair.some(isNaN));
        } else if (batchText) {
          pairs = batchText
            .split(";")
            .map((pair) => pair.split(",").map(Number))
            .filter((pair) => pair.length === 2 && !pair.some(isNaN));
        }
        if (pairs.length === 0) throw new Error("Invalid batch input");
      } else {
        const exp = parseFloat(expValue);
        const theo = parseFloat(theoValue);
        if (isNaN(exp) || isNaN(theo)) throw new Error("Invalid input values");
        if (theo === 0) throw new Error("Theoretical value cannot be zero");
        pairs = [[exp, theo]];
      }

      const results = pairs
        .map(([exp, theo]) => {
          if (theo === 0) return null;
          return computeError(exp, theo, unit, parseInt(precision), errorType);
        })
        .filter((r) => r);

      if (results.length === 0) throw new Error("No valid pairs in batch input");

      displayResults(results, isBatch);
    } catch (e) {
      showError(e.message || "Invalid input");
    }
  };

  const displayResults = (results, isBatch) => {
    let output = "";
    if (isBatch) {
      output = `
        <table class="w-full text-sm text-gray-600 border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="p-2 border">Experimental</th>
              <th class="p-2 border">Theoretical</th>
              <th class="p-2 border">Absolute Error</th>
              <th class="p-2 border">Relative Error</th>
              <th class="p-2 border">Percent Error (%)</th>
            </tr>
          </thead>
          <tbody>
            ${results
              .map(
                (r) => `
              <tr>
                <td class="p-2 border">${r.experimental.toFixed(precision)}</td>
                <td class="p-2 border">${r.theoretical.toFixed(precision)}</td>
                <td class="p-2 border">${r.absoluteError.toFixed(precision)}</td>
                <td class="p-2 border">${r.relativeError.toFixed(precision)}</td>
                <td class="p-2 border">${r.percentError.toFixed(precision)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
    } else {
      const r = results[0];
      output = `
        <strong>Results${r.unit ? ` (${r.unit})` : ""}:</strong><br>
        Experimental Value: ${r.experimental.toFixed(precision)}<br>
        Theoretical Value: ${r.theoretical.toFixed(precision)}<br>
        Absolute Error: ${r.absoluteError.toFixed(precision)}<br>
        Relative Error: ${r.relativeError.toFixed(precision)}<br>
        Percent Error: ${r.percentError.toFixed(precision)}%
      `;
    }

    let statsText = "";
    if (isBatch && results.length > 1) {
      const percentErrors = results.map((r) => r.percentError);
      const stats = {
        mean: math.mean(percentErrors),
        median: math.median(percentErrors),
        stdDev: math.std(percentErrors),
        min: Math.min(...percentErrors),
        max: Math.max(...percentErrors),
      };
      statsText = `
        <strong>Statistics (Percent Error):</strong><br>
        Mean: ${stats.mean.toFixed(precision)}%<br>
        Median: ${stats.median.toFixed(precision)}%<br>
        Standard Deviation: ${stats.stdDev.toFixed(precision)}%<br>
        Min: ${stats.min.toFixed(precision)}%<br>
        Max: ${stats.max.toFixed(precision)}%
      `;
    }

    setResults(results);
    setStatsContent(statsText);

    const params = isBatch
      ? `Batch: ${results.length} pairs, Error Type: ${errorType}${unit ? `, Unit: ${unit}` : ""}`
      : `Exp: ${results[0].experimental}, Theo: ${results[0].theoretical}, Error Type: ${errorType}${
          unit ? `, Unit: ${unit}` : ""
        }`;
    saveToHistory(params, output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "...");
    updateVisualizations(results, isBatch);
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const errors = statInput
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n));
      if (errors.length === 0) throw new Error("Invalid percent error list");

      const stats = {
        mean: math.mean(errors),
        median: math.median(errors),
        stdDev: math.std(errors),
        min: Math.min(...errors),
        max: Math.max(...errors),
      };
      const statsText = `
        <strong>Statistical Analysis (Percent Error):</strong><br>
        Mean: ${stats.mean.toFixed(precision)}%<br>
        Median: ${stats.median.toFixed(precision)}%<br>
        Standard Deviation: ${stats.stdDev.toFixed(precision)}%<br>
        Min: ${stats.min.toFixed(precision)}%<br>
        Max: ${stats.max.toFixed(precision)}%
      `;
      const expression = `Stats(${errors.join(", ")}%)`;

      setResults([]);
      setStatsContent(statsText);
      saveToHistory(expression, statsText.replace(/<br>/g, "; "));
      updateBarChart(errors, true);
    } catch (e) {
      showError("Invalid statistical input");
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const variationVal = parseFloat(variation);
      const expVal = parseFloat(expValue);
      const theoVal = parseFloat(theoValue);
      if (isNaN(variationVal) || variationVal <= 0) throw new Error("Invalid variation percentage");
      if (isNaN(expVal) || isNaN(theoVal)) throw new Error("Enter experimental and theoretical values");
      if (theoVal === 0) throw new Error("Theoretical value cannot be zero");

      const results = [];
      const step = variationVal / 5;
      for (let v = -variationVal; v <= variationVal; v += step) {
        const expVar = expVal * (1 + v / 100);
        const theoVar = theoVal * (1 + v / 100);
        const percentErrorExp = computeError(
          expVar,
          theoVal,
          unit,
          parseInt(precision),
          "percent"
        ).percentError;
        const percentErrorTheo = computeError(
          expVal,
          theoVar,
          unit,
          parseInt(precision),
          "percent"
        ).percentError;
        results.push({ variation: v, percentErrorExp, percentErrorTheo });
      }

      const resultText = results
        .map(
          (r) =>
            `Variation ${r.variation.toFixed(2)}%: Exp = ${r.percentErrorExp.toFixed(
              precision
            )}%, Theo = ${r.percentErrorTheo.toFixed(precision)}%`
        )
        .join("<br>");

      setResults([]);
      setStatsContent(`<strong>Sensitivity Analysis:</strong><br>${resultText}`);
      saveToHistory(`Sensitivity (±${variationVal}%)`, resultText.replace(/<br>/g, "; "));
      updateSensitivityChart(results);
    } catch (e) {
      showError("Invalid sensitivity input");
    }
  };

  const updateVisualizations = (results, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (scatterChartInstance.current) scatterChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();

    const percentErrors = results.map((r) => r.percentError);

    if (barChartRef.current) {
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: isBatch ? percentErrors.map((_, i) => `Pair ${i + 1}`) : ["Result"],
          datasets: [
            {
              label: "Percent Error (%)",
              data: percentErrors,
              backgroundColor: "#ef4444",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Percent Error (%)" }, beginAtZero: true },
            x: { title: { display: true, text: isBatch ? "Data Pair" : "Calculation" } },
          },
          plugins: { title: { display: true, text: "Percent Error Distribution" } },
        },
      });
    }

    if (isBatch && scatterChartRef.current) {
      scatterChartInstance.current = new Chart(scatterChartRef.current, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Values",
              data: results.map((r) => ({ x: r.theoretical, y: r.experimental })),
              backgroundColor: "#ef4444",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Theoretical Value" } },
            y: { title: { display: true, text: "Experimental Value" } },
          },
          plugins: { title: { display: true, text: "Experimental vs. Theoretical" } },
        },
      });
    }

    if (isBatch && results.length > 1 && pieChartRef.current) {
      const ranges = { "<1%": 0, "1-5%": 0, "5-10%": 0, ">10%": 0 };
      percentErrors.forEach((pe) => {
        if (pe < 1) ranges["<1%"]++;
        else if (pe < 5) ranges["1-5%"]++;
        else if (pe < 10) ranges["5-10%"]++;
        else ranges[">10%"]++;
      });

      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: Object.keys(ranges),
          datasets: [
            {
              data: Object.values(ranges),
              backgroundColor: ["#ef4444", "#dc2626", "#b91c1c", "#991b1b"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { title: { display: true, text: "Error Range Distribution" } },
        },
      });
    }
  };

  const updateBarChart = (percentErrors, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: isBatch ? percentErrors.map((_, i) => `Pair ${i + 1}`) : ["Result"],
          datasets: [
            {
              label: "Percent Error (%)",
              data: percentErrors,
              backgroundColor: "#ef4444",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Percent Error (%)" }, beginAtZero: true },
            x: { title: { display: true, text: isBatch ? "Data Pair" : "Calculation" } },
          },
          plugins: { title: { display: true, text: "Percent Error Distribution" } },
        },
      });
    }
  };

  const updateSensitivityChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (lineChartRef.current) {
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: results.map((r) => r.variation.toFixed(2) + "%"),
          datasets: [
            {
              label: "Varying Experimental",
              data: results.map((r) => r.percentErrorExp),
              borderColor: "#ef4444",
              fill: false,
            },
            {
              label: "Varying Theoretical",
              data: results.map((r) => r.percentErrorTheo),
              borderColor: "#dc2626",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Variation (%)" } },
            y: { title: { display: true, text: "Percent Error (%)" } },
          },
          plugins: { title: { display: true, text: "Sensitivity Analysis" } },
        },
      });
    }
  };

  const clearInputs = () => {
    clearMessages();
    setExpValue("");
    setTheoValue("");
    setUnit("");
    setPrecision("2");
    setErrorType("percent");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setResults([]);
    setStatsContent("");
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (scatterChartInstance.current) scatterChartInstance.current.destroy();
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();
  };

  const saveCalculation = () => {
    clearMessages();
    if (results.length || statsContent) {
      showSuccess("Calculation saved to history!");
    } else {
      showError("No valid calculation to save.");
    }
  };

  const saveToHistory = (params, result) => {
    const newHistory = [...calculationHistory, { date: new Date().toLocaleString(), params, result }];
    setCalculationHistory(newHistory);
    localStorage.setItem("percentErrorHistory", JSON.stringify(newHistory));
  };

  const updateHistoryTable = () => {
    return calculationHistory.map((h) => (
      <tr key={h.date}>
        <td className="p-2 border">{h.date}</td>
        <td className="p-2 border">{h.params}</td>
        <td className="p-2 border">{h.result}</td>
      </tr>
    ));
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Parameters", "Result"],
      ...calculationHistory.map((h) => [h.date, h.params, h.result]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    downloadFile("percent_error_history.csv", "text/csv", csvContent);
  };

  const exportJSON = () => {
    const jsonContent = JSON.stringify(calculationHistory, null, 2);
    downloadFile("percent_error_history.json", "application/json", jsonContent);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Percent Error Calculator History", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    calculationHistory.forEach((h) => {
      doc.text(`Date: ${h.date}, Params: ${h.params}, Result: ${h.result}`, 10, y);
      y += 10;
    });
    doc.text("Note: Visualizations and full results are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("percent_error_history.pdf");
  };

  const downloadFile = (filename, type, content) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.target.tagName === "INPUT") {
        calculateError();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [expValue, theoValue, unit, precision, errorType, batchText, batchFile]);

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Percent Error Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Experimental Value
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter the observed or measured value.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={expValue}
                  onChange={(e) => setExpValue(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 95"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Theoretical Value
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter the expected or true value.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={theoValue}
                  onChange={(e) => setTheoValue(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 100"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Unit (Optional)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Specify the unit (e.g., meters, kg).
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., meters"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Precision
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Decimal places for results.
                    </span>
                  </span>
                </label>
                <select
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="0">0 Decimals</option>
                  <option value="2">2 Decimals</option>
                  <option value="4">4 Decimals</option>
                  <option value="6">6 Decimals</option>
                  <option value="8">8 Decimals</option>
                  <option value="10">10 Decimals</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Error Type
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Choose the type of error to display.
                    </span>
                  </span>
                </label>
                <select
                  value={errorType}
                  onChange={(e) => setErrorType(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="percent">Percent Error</option>
                  <option value="absolute">Absolute Error</option>
                  <option value="relative">Relative Error</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV: Experimental,Theoretical)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Upload a CSV file or enter pairs (e.g., 95,100;90,100).
                  </span>
                </span>
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setBatchFile(e.target.files[0])}
                className="p-3 border rounded-lg w-full mb-2"
              />
              <textarea
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                className="p-3 border rounded-lg w-full"
                rows="4"
                placeholder="e.g., 95,100;90,100"
              />
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button onClick={calculateError} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Calculate
            </button>
            <button onClick={clearInputs} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Clear
            </button>
            <button onClick={saveCalculation} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Save Calculation
            </button>
          </div>

          <div className="mb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              {showAdvanced ? "Hide Advanced Features" : "Show Advanced Features"}
            </button>
          </div>

          {showAdvanced && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Analyze Percent Errors (comma-separated)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter percent errors for statistical analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 5,10,15"
                />
                <button onClick={calculateStats} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
                  Calculate Statistics
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Variation Range (±%)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter percentage variation for sensitivity analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 5"
                />
                <button
                  onClick={calculateSensitivity}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Analyze Sensitivity
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Percent Error
          </button>

          {(results.length > 0 || statsContent) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div
                dangerouslySetInnerHTML={{ __html: results.length > 0 ? results[0].output || "" : "" }}
                className="text-gray-600 mb-4"
              />
              <div dangerouslySetInnerHTML={{ __html: statsContent }} className="text-gray-600 mb-4" />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Percent Error Distribution</h3>
                <canvas ref={barChartRef} className="max-h-80" />
              </div>
              {results.length > 1 && (
                <>
                  <div className="mt-6">
                    <h3 className="text-md font-medium text-red-900">Experimental vs. Theoretical</h3>
                    <canvas ref={scatterChartRef} className="max-h-80" />
                  </div>
                  <div className="mt-6">
                    <h3 className="text-md font-medium text-red-900">Error Range Distribution</h3>
                    <canvas ref={pieChartRef} className="max-h-80" />
                  </div>
                </>
              )}
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Sensitivity Analysis</h3>
                <canvas ref={lineChartRef} className="max-h-80" />
              </div>
              {calculationHistory.length > 0 && (
                <div className="mt-6 max-h-[200px] overflow-y-auto">
                  <h3 className="text-md font-medium text-red-900">Calculation History</h3>
                  <table className="w-full text-sm text-gray-600 border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Parameters</th>
                        <th className="p-2 border">Result</th>
                      </tr>
                    </thead>
                    <tbody>{updateHistoryTable()}</tbody>
                  </table>
                </div>
              )}
              <div className="flex gap-4 mt-4">
                <button onClick={exportCSV} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Export CSV
                </button>
                <button onClick={exportJSON} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Export JSON
                </button>
                <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Export PDF
                </button>
              </div>
            </div>
          )}

          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-[600px] w-full relative">
                <span
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Understanding Percent Error</h2>
                <p className="mb-4 text-gray-600">
                  Percent error measures the accuracy of an experimental value compared to a theoretical
                  (true) value, expressed as a percentage.
                </p>
                <h3 className="text-md font-medium text-gray-700 mb-2">Formula</h3>
                <p className="mb-4 text-gray-600">
                  Percent Error = | (Experimental - Theoretical) / Theoretical | × 100%
                </p>
                <h3 className="text-md font-medium text-gray-700 mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>
                    <strong>Absolute Error:</strong> The absolute difference between experimental and
                    theoretical values.
                  </li>
                  <li>
                    <strong>Relative Error:</strong> Absolute error divided by the theoretical value.
                  </li>
                  <li>
                    <strong>Percent Error:</strong> Relative error multiplied by 100%.
                  </li>
                </ul>
                <h3 className="text-md font-medium text-gray-700 mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>
                    <strong>Science:</strong> Evaluate experimental accuracy in physics, chemistry, etc.
                  </li>
                  <li>
                    <strong>Engineering:</strong> Assess measurement precision in design and testing.
                  </li>
                  <li>
                    <strong>Education:</strong> Teach students about measurement and error analysis.
                  </li>
                </ul>
                <h3 className="text-md font-medium text-gray-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Ensure theoretical value is non-zero to avoid division errors.</li>
                  <li>Use batch input for analyzing multiple experiments.</li>
                  <li>Check sensitivity to understand input variations.</li>
                </ul>
                <h3 className="text-md font-medium text-gray-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>
                    <a
                      href="https://www.khanacademy.org/math/statistics-probability"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Khan Academy: Statistics
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.physicsclassroom.com/class/1DKin/Lesson-1/Accuracy-and-Precision"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Physics Classroom: Accuracy and Precision
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
