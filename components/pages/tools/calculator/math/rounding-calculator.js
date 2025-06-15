"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [method, setMethod] = useState("nearest");
  const [precision, setPrecision] = useState("2");
  const [numbers, setNumbers] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [batchText, setBatchText] = useState("");
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState([]);
  const [statsContent, setStatsContent] = useState("");
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const lastResults = useRef([]);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("roundingCalcHistory");
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
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
    ]).catch((err) => console.error("Failed to load scripts:", err));

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

  const parseInput = (input, isNumber = true) => {
    if (!input.trim()) throw new Error("Input cannot be empty");
    if (isNumber) {
      const value = window.math.evaluate(input);
      if (isNaN(value) || !isFinite(value)) throw new Error("Invalid number (NaN or Infinity not allowed)");
      if (Math.abs(value) > Number.MAX_SAFE_INTEGER) throw new Error("Number too large");
      return value;
    }
    return input.trim();
  };

  const roundNumber = (number, method, precision) => {
    let result;
    if (method === "nearest") {
      result = Math.round(number);
    } else if (method === "floor") {
      result = Math.floor(number);
    } else if (method === "ceil") {
      result = Math.ceil(number);
    } else if (method === "trunc") {
      result = Math.trunc(number);
    } else if (method === "decimal") {
      if (!Number.isInteger(precision) || precision < 0)
        throw new Error("Precision must be a non-negative integer");
      result = Number(number.toFixed(precision));
    } else if (method === "sigfig") {
      if (!Number.isInteger(precision) || precision <= 0)
        throw new Error("Precision must be a positive integer");
      if (number === 0) return 0;
      const magnitude = Math.floor(Math.log10(Math.abs(number))) + 1;
      const scale = Math.pow(10, precision - magnitude);
      result = Math.round(number * scale) / scale;
    } else {
      throw new Error("Invalid rounding method");
    }
    return {
      original: number,
      rounded: result,
      error: Math.abs(number - result),
    };
  };

  const calculateParameters = (numbers, method, precision) => {
    const validNumbers = numbers.filter((num) => isFinite(num) && !isNaN(num));
    if (validNumbers.length === 0) throw new Error("No valid numbers provided");
    const results = validNumbers.map((num) => roundNumber(num, method, precision));
    return {
      numbers: validNumbers,
      method,
      precision,
      results,
    };
  };

  const calculate = async () => {
    clearMessages();
    try {
      const isBatch = batchFile || batchText.trim();
      let calcResults = [];

      if (!isBatch) {
        if (!numbers) throw new Error("Numbers are required");
        const numberArray = numbers.split(",").map((s) => parseInput(s));
        const result = calculateParameters(numberArray, method, parseInt(precision));
        calcResults.push(result);
        displayResults(calcResults, false);
      } else {
        let calculations = [];
        if (batchFile) {
          calculations = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = e.target.result;
              if (!text.trim()) reject(new Error("Empty file provided"));
              const parsed = text
                .split("\n")
                .map((line) => line.split(",").map((s) => s.trim()))
                .filter((c) => c.length >= 1);
              resolve(parsed);
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          calculations = batchText
            .split(";")
            .map((c) => c.split(",").map((s) => s.trim()))
            .filter((c) => c.length >= 1);
        }
        await processBatch(calculations, calcResults);
        if (calcResults.length === 0) throw new Error("No valid calculations in batch input");
        displayResults(calcResults, true);
      }
      showSuccess("Calculation completed successfully");
    } catch (e) {
      console.error("Calculation error:", e);
      showError(e.message || "Invalid input");
    }
  };

  const processBatch = async (calculations, results) => {
    for (const [number, batchMethod = method, prec = precision] of calculations) {
      try {
        const numbers = [parseInput(number)];
        const precisionVal = parseInt(prec);
        const result = calculateParameters(numbers, batchMethod, precisionVal);
        results.push(result);
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const displayResults = (results, isBatch) => {
    let output = [];
    if (isBatch) {
      output.push(
        <table key="batch-table" className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Number</th>
              <th className="p-2">Method</th>
              <th className="p-2">Precision</th>
              <th className="p-2">Rounded</th>
              <th className="p-2">Error</th>
            </tr>
          </thead>
          <tbody>
            {results.flatMap((r, i) =>
              r.results.map((res, j) => (
                <tr key={`${i}-${j}`}>
                  <td className="p-2">{res.original}</td>
                  <td className="p-2">{r.method}</td>
                  <td className="p-2">{r.precision}</td>
                  <td className="p-2">{res.rounded}</td>
                  <td className="p-2">{res.error.toFixed(4)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      );
      const roundedValues = results
        .flatMap((r) => r.results.map((res) => res.rounded))
        .filter((v) => isFinite(v));
      if (roundedValues.length > 0) {
        const frequency = {};
        roundedValues.forEach((v) => (frequency[v] = (frequency[v] || 0) + 1));
        output.push(
          <div key="frequency-table" className="mt-4">
            <strong>Rounded Value Frequency Table:</strong>
            <br />
            <table className="w-full text-sm text-gray-600">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Rounded Value</th>
                  <th className="p-2">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(frequency).map(([v, freq], i) => (
                  <tr key={i}>
                    <td className="p-2">{v}</td>
                    <td className="p-2">{freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    } else {
      const r = results[0];
      output.push(
        <div key="single-result">
          <strong>
            Results ({r.method}, Precision: {r.precision}):
          </strong>
          <br />
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Original</th>
                <th className="p-2">Rounded</th>
                <th className="p-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {r.results.map((res, i) => (
                <tr key={i}>
                  <td className="p-2">{res.original}</td>
                  <td className="p-2">{res.rounded}</td>
                  <td className="p-2">{res.error.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    let statsText = "";
    if (isBatch && results.length > 1) {
      const roundedValues = results
        .flatMap((r) => r.results.map((res) => res.rounded))
        .filter((v) => isFinite(v));
      if (roundedValues.length > 0) {
        const stats = {
          mean: window.math.mean(roundedValues),
          median: window.math.median(roundedValues),
          stdDev: window.math.std(roundedValues),
          min: Math.min(...roundedValues),
          max: Math.max(...roundedValues),
        };
        statsText = (
          <div>
            <strong>Statistics (Rounded Values):</strong>
            <br />
            Mean: {stats.mean.toFixed(2)}
            <br />
            Median: {stats.median.toFixed(2)}
            <br />
            Standard Deviation: {stats.stdDev.toFixed(2)}
            <br />
            Min: {stats.min}
            <br />
            Max: {stats.max}
          </div>
        );
      }
    }

    setResults(output);
    setStatsContent(statsText);
    setShowResults(true);
    updateVisualizations(results, isBatch);

    const params = isBatch
      ? `Batch: ${results.length} calculations, Method: ${results[0].method}`
      : `Numbers: ${results[0].numbers.join(", ")}, Method: ${results[0].method}, Precision: ${
          results[0].precision
        }`;
    saveToHistory(
      params,
      output
        .map((o) => (typeof o === "string" ? o : o.props.children))
        .join("; ")
        .substring(0, 100) + "..."
    );
    lastResults.current = results;
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const values = statInput
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => isFinite(n));
      if (values.length === 0) throw new Error("Invalid value list");

      const stats = {
        mean: window.math.mean(values),
        median: window.math.median(values),
        stdDev: window.math.std(values),
        min: Math.min(...values),
        max: Math.max(...values),
      };
      const statsText = (
        <div>
          <strong>Statistical Analysis:</strong>
          <br />
          Mean: {stats.mean.toFixed(2)}
          <br />
          Median: {stats.median.toFixed(2)}
          <br />
          Standard Deviation: {stats.stdDev.toFixed(2)}
          <br />
          Min: {stats.min}
          <br />
          Max: {stats.max}
        </div>
      );
      const expression = `Stats(${values.join(", ")})`;

      setResults([statsText]);
      setStatsContent("");
      setShowResults(true);
      saveToHistory(expression, statsText.props.children.join("; "));
      updateBarChart(values, values, true);
      showSuccess("Statistics calculated successfully");
    } catch (e) {
      console.error("Stats error:", e);
      showError("Invalid statistical input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const variationValue = parseInt(variation);
      const numberArray = numbers.split(",").map((s) => parseInput(s));
      if (!numberArray.length) throw new Error("Numbers are required");
      if (isNaN(variationValue) || variationValue <= 0) throw new Error("Invalid variation");
      if (method !== "decimal" && method !== "sigfig")
        throw new Error("Sensitivity analysis requires decimal or sigfig method");

      const results = [];
      for (
        let v = Math.max(0, parseInt(precision) - variationValue);
        v <= parseInt(precision) + variationValue;
        v++
      ) {
        try {
          const calc = calculateParameters(numberArray, method, v);
          results.push({
            precision: v,
            values: calc.results.map((r) => r.rounded),
          });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      const resultText = results.map((r) => (
        <div key={r.precision}>
          Precision {r.precision}: {r.values.join(", ")}
        </div>
      ));

      setResults([
        <div key="sensitivity">
          <strong>Sensitivity Analysis (Precision):</strong>
          <br />
          {resultText}
        </div>,
      ]);
      setStatsContent("");
      setShowResults(true);
      saveToHistory(
        `Sensitivity (±${variationValue} Precision)`,
        resultText.map((r) => r.props.children).join("; ")
      );
      updateSensitivityChart(results);
      showSuccess("Sensitivity analysis completed");
    } catch (e) {
      console.error("Sensitivity error:", e);
      showError("Invalid sensitivity input: " + e.message);
    }
  };

  const updateVisualizations = (results, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    const svg = document.getElementById("rounding-visual");
    if (svg) {
      svg.innerHTML = "";
      if (!isBatch && results.length === 1) {
        drawRoundingVisualization(results[0].results, svg);
      } else {
        svg.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single calculation</text>';
      }
    }
    const roundedValues = results
      .flatMap((r) => r.results.map((res) => res.rounded))
      .filter((v) => isFinite(v));
    if (roundedValues.length > 0) {
      const originalValues = results
        .flatMap((r) => r.results.map((res) => res.original))
        .filter((v) => isFinite(v));
      updateBarChart(originalValues, roundedValues, isBatch);
    }
  };

  const drawRoundingVisualization = (results, svg) => {
    const width = 500;
    const height = 150;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    const validResults = results.filter((r) => isFinite(r.original) && isFinite(r.rounded));
    if (validResults.length === 0) {
      svg.innerHTML = '<text x="10" y="50" fill="#000" font-size="14">No valid numbers to visualize</text>';
      return;
    }

    const values = validResults.flatMap((r) => [r.original, r.rounded]);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    let range = maxVal - minVal;
    if (range === 0) range = Math.max(1, Math.abs(maxVal) || 1);

    const xScale = (width - 40) / range;
    const ySpacing = height / (validResults.length + 1);

    validResults.forEach((res, i) => {
      const y = (i + 1) * ySpacing;
      let xOrig = 20 + (res.original - minVal) * xScale;
      let xRound = 20 + (res.rounded - minVal) * xScale;

      xOrig = Math.max(20, Math.min(width - 20, xOrig));
      xRound = Math.max(20, Math.min(width - 20, xRound));

      svg.innerHTML += `<line x1="${xOrig}" y1="${y}" x2="${xRound}" y2="${y}" stroke="#3b82f6" stroke-width="2"/>`;
      svg.innerHTML += `<circle cx="${xOrig}" cy="${y}" r="5" fill="#ef4444"/>`;
      svg.innerHTML += `<circle cx="${xRound}" cy="${y}" r="5" fill="#10b981"/>`;
      svg.innerHTML += `<text x="10" y="${y - 10}" fill="#000" font-size="12">${res.original.toFixed(
        4
      )} → ${res.rounded.toFixed(4)}</text>`;
    });
  };

  const updateBarChart = (originalValues, roundedValues, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      const labels = isBatch
        ? roundedValues.map((_, i) => `Number ${i + 1}`)
        : lastResults.current[0].results.map((_, i) => `Number ${i + 1}`);
      barChartInstance.current = new window.Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Original",
              data: originalValues,
              backgroundColor: "#ef4444",
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
            {
              label: "Rounded",
              data: roundedValues,
              backgroundColor: "#3b82f6",
              borderColor: "#1e40af",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Value" } },
            x: { title: { display: true, text: "Numbers" } },
          },
          plugins: {
            title: { display: true, text: "Original vs Rounded Values" },
          },
        },
      });
    }
  };

  const updateSensitivityChart = (results) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      const labels = results.map((r) => `Precision ${r.precision}`);
      const datasets = results[0].values.map((_, i) => ({
        label: `Number ${i + 1}`,
        data: results.map((r) => r.values[i]),
        borderColor: "#ef4444",
        fill: false,
      }));
      barChartInstance.current = new window.Chart(barChartRef.current, {
        type: "line",
        data: {
          labels,
          datasets,
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Rounded Value" } },
            x: { title: { display: true, text: "Precision" } },
          },
          plugins: {
            title: { display: true, text: "Sensitivity Analysis" },
          },
        },
      });
    }
  };

  const clearInputs = () => {
    clearMessages();
    setNumbers("");
    setBatchFile(null);
    setBatchText("");
    setStatInput("");
    setVariation("");
    setPrecision("2");
    setShowResults(false);
    setResults([]);
    setStatsContent("");
    if (barChartInstance.current) barChartInstance.current.destroy();
    const svg = document.getElementById("rounding-visual");
    if (svg) svg.innerHTML = "";
    showSuccess("Inputs cleared!");
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
    localStorage.setItem("roundingCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rounding_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rounding_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Rounding Calculation History", 10, 10);
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
    doc.save("rounding_history.pdf");
  };

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">Advanced Rounding Calculator</h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Rounding Method
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select the method for rounding numbers.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="nearest">Round to Nearest</option>
                  <option value="floor">Floor</option>
                  <option value="ceil">Ceiling</option>
                  <option value="trunc">Truncation</option>
                  <option value="decimal">Round to Decimal Places</option>
                  <option value="sigfig">Round to Significant Figures</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Precision (Decimals/Sig Figs)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Number of decimal places or significant figures.
                  </span>
                </label>
                <input
                  type="number"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 2"
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Numbers</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                    Numbers (comma-separated)
                    <span className="ml-1 cursor-pointer">?</span>
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Enter numbers (e.g., 3.14159,2.71828,-1.414).
                    </span>
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 3.14159,2.71828,-1.414"
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: number,method,precision)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter numbers with method and precision (e.g.,
                  3.14159,decimal,2;2.71828,sigfig,3).
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
                placeholder="e.g., 3.14159,decimal,2;2.71828,sigfig,3"
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
              Reset
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
                  Analyze Values (comma-separated)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter rounded values for analysis.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 3.14,2.72,-1.41"
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
                  Precision Variation Range
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Range of decimal places or significant figures to test.
                  </span>
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 2"
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
          {showResults && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div className="text-gray-600 mb-4">{results}</div>
              <div className="text-gray-600 mb-4">{statsContent}</div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Rounding Visualization</h3>
                <svg id="rounding-visual" className="w-full max-w-[500px] h-[150px] block mx-auto"></svg>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Value Comparison</h3>
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
