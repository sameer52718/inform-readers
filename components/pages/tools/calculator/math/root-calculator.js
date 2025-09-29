"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [precision, setPrecision] = useState("2");
  const [number, setNumber] = useState("");
  const [degree, setDegree] = useState("");
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
      const stored = localStorage.getItem("rootCalcHistory");
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

  const parseInput = (input) => {
    if (!input.trim()) throw new Error("Input cannot be empty");
    const value = window.math.evaluate(input);
    if (isNaN(value) || !isFinite(value)) throw new Error("Invalid numerical value");
    return value;
  };

  const calculateRoot = (x, n, precision) => {
    if (n === 0) throw new Error("Degree cannot be zero");
    let result;
    let note = "";

    if (x < 0 && Number.isInteger(n)) {
      if (n % 2 === 0) throw new Error("Even root of negative number is undefined (imaginary)");
      result = -Math.pow(-x, 1 / n);
    } else if (x < 0) {
      note = "Negative base with non-integer degree may produce complex results; showing principal root";
      result = Math.pow(Math.abs(x), 1 / n) * (x < 0 ? -1 : 1);
    } else {
      result = Math.pow(x, 1 / n);
    }

    const inverse = Math.pow(result, n);
    const rounded = Math.round(result);
    const isExact = Math.abs(Math.pow(rounded, n) - x) < 1e-10;

    return {
      x,
      n,
      root: result.toFixed(precision),
      inverse: inverse.toFixed(precision),
      rounded,
      isExact,
      note,
    };
  };

  const newtonRaphsonRoot = (x, n, precision, maxIterations = 100, tolerance = 1e-10) => {
    if (x < 0 || n <= 0) throw new Error("Newton-Raphson requires positive x and n");
    let guess = x > 1 ? x / n : 1;
    let iterations = 0;
    let steps = [];

    while (iterations < maxIterations) {
      const fx = Math.pow(guess, n) - x;
      const dfx = n * Math.pow(guess, n - 1);
      if (Math.abs(fx) < tolerance) break;
      const nextGuess = guess - fx / dfx;
      steps.push({
        iteration: iterations + 1,
        guess: guess.toFixed(precision),
        fx: fx.toFixed(precision),
      });
      guess = nextGuess;
      iterations++;
    }

    return {
      root: guess.toFixed(precision),
      iterations,
      steps,
    };
  };

  const calculate = async () => {
    clearMessages();
    try {
      const isBatch = batchFile || batchText.trim();
      let calcResults = [];

      if (!isBatch) {
        if (!number || !degree) throw new Error("Number and degree are required");
        const x = parseInput(number);
        const n = parseInput(degree);
        const result = calculateRoot(x, n, parseInt(precision));
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
                .filter((c) => c.length >= 2);
              resolve(parsed);
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          calculations = batchText
            .split(";")
            .map((c) => c.split(",").map((s) => s.trim()))
            .filter((c) => c.length >= 2);
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
    for (const [x, n] of calculations) {
      try {
        const result = calculateRoot(parseInput(x), parseInput(n), parseInt(precision));
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
              <th className="p-2">Number (x)</th>
              <th className="p-2">Degree (n)</th>
              <th className="p-2">Root</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td className="p-2">{r.x}</td>
                <td className="p-2">{r.n}</td>
                <td className="p-2">{`√[${r.n}]{${r.x}} = ${r.root}${r.note ? ` (${r.note})` : ""}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
      const roots = results.map((r) => parseFloat(r.root)).filter((t) => !isNaN(t));
      if (roots.length > 0) {
        const frequency = {};
        roots.forEach((t) => {
          const key = Number(t).toFixed(parseInt(precision));
          frequency[key] = (frequency[key] || 0) + 1;
        });
        output.push(
          <div key="frequency-table" className="mt-4">
            <strong>Root Frequency Table:</strong>
            <br />
            <table className="w-full text-sm text-gray-600">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Root</th>
                  <th className="p-2">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(frequency).map(([t, freq], i) => (
                  <tr key={i}>
                    <td className="p-2">{t}</td>
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
          <strong>Result:</strong>
          <br />
          Number (x): {r.x}
          <br />
          Degree (n): {r.n}
          <br />
          Root: √[{r.n}]{r.x} = {r.root}
          <br />
          Inverse Check: ({r.root})^{r.n} = {r.inverse}
          <br />
          Rounded: {r.rounded} {r.isExact ? "(exact)" : ""}
          <br />
          {r.note && <div>Note: {r.note}</div>}
        </div>
      );
    }

    let statsText = "";
    if (isBatch && results.length > 1) {
      const roots = results.map((r) => parseFloat(r.root)).filter((t) => !isNaN(t));
      if (roots.length > 0) {
        const stats = {
          mean: window.math.mean(roots),
          median: window.math.median(roots),
          stdDev: window.math.std(roots),
          min: Math.min(...roots),
          max: Math.max(...roots),
        };
        statsText = (
          <div>
            <strong>Statistics (Roots):</strong>
            <br />
            Mean: {Number(stats.mean).toFixed(parseInt(precision))}
            <br />
            Median: {Number(stats.median).toFixed(parseInt(precision))}
            <br />
            Standard Deviation: {Number(stats.stdDev).toFixed(parseInt(precision))}
            <br />
            Min: {Number(stats.min).toFixed(parseInt(precision))}
            <br />
            Max: {Number(stats.max).toFixed(parseInt(precision))}
          </div>
        );
      }
    }

    setResults(output);
    setStatsContent(statsText);
    setShowResults(true);
    updateVisualizations(results, isBatch);

    const params = isBatch
      ? `Batch: ${results.length} calculations`
      : `x: ${results[0].x}, n: ${results[0].n}`;
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
        .filter((n) => !isNaN(n));
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
          Mean: {Number(stats.mean).toFixed(parseInt(precision))}
          <br />
          Median: {Number(stats.median).toFixed(parseInt(precision))}
          <br />
          Standard Deviation: {Number(stats.stdDev).toFixed(parseInt(precision))}
          <br />
          Min: {Number(stats.min).toFixed(parseInt(precision))}
          <br />
          Max: {Number(stats.max).toFixed(parseInt(precision))}
        </div>
      );
      const expression = `Stats(${values.join(", ")})`;

      setResults([statsText]);
      setStatsContent("");
      setShowResults(true);
      saveToHistory(expression, statsText.props.children.join("; "));
      updateBarChart(values, true);
      showSuccess("Statistics calculated successfully");
    } catch (e) {
      console.error("Stats error:", e);
      showError("Invalid statistical input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const variationValue = parseFloat(variation);
      const x = parseInput(number);
      const n = parseInput(degree);
      if (!x || !n) throw new Error("Number and degree are required");
      if (isNaN(variationValue) || variationValue <= 0) throw new Error("Invalid variation value");

      const results = [];
      const step = variationValue / 5;
      for (let v = -variationValue; v <= variationValue; v += step) {
        const variedN = n + v;
        if (variedN === 0) continue;
        try {
          const calc = calculateRoot(x, variedN, parseInt(precision));
          results.push({
            variation: v,
            value: parseFloat(calc.root),
          });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      const resultText = results.map((r) => (
        <div key={r.variation}>
          Degree Variation {Number(r.variation).toFixed(2)}: √[{(n + r.variation).toFixed(2)}]{x} ={" "}
          {Number(r.value).toFixed(parseInt(precision))}
        </div>
      ));

      setResults([
        <div key="sensitivity">
          <strong>Sensitivity Analysis (Degree):</strong>
          <br />
          {resultText}
        </div>,
      ]);
      setStatsContent("");
      setShowResults(true);
      saveToHistory(
        `Sensitivity (±${variationValue} Degree)`,
        resultText.map((r) => r.props.children).join("; ")
      );
      updateSensitivityChart(results);
      showSuccess("Sensitivity analysis completed");
    } catch (e) {
      console.error("Sensitivity error:", e);
      showError("Invalid sensitivity input: " + e.message);
    }
  };

  const calculateNewtonRaphson = () => {
    clearMessages();
    try {
      const x = parseInput(number);
      const n = parseInput(degree);
      const result = newtonRaphsonRoot(x, n, parseInt(precision));
      const output = (
        <div>
          <strong>Newton-Raphson Approximation:</strong>
          <br />
          Root: {result.root}
          <br />
          Iterations: {result.iterations}
          <br />
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Iteration</th>
                <th className="p-2">Guess</th>
                <th className="p-2">f(x)</th>
              </tr>
            </thead>
            <tbody>
              {result.steps.map((step, i) => (
                <tr key={i}>
                  <td className="p-2">{step.iteration}</td>
                  <td className="p-2">{step.guess}</td>
                  <td className="p-2">{step.fx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      setResults([output]);
      setStatsContent("");
      setShowResults(true);
      saveToHistory(
        `Newton-Raphson (x: ${x}, n: ${n})`,
        `Root: ${result.root}; Iterations: ${result.iterations}`
      );
      showSuccess("Newton-Raphson approximation completed");
    } catch (e) {
      console.error("Newton-Raphson error:", e);
      showError(e.message);
    }
  };

  const updateVisualizations = (results, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    const svg = document.getElementById("root-visual");
    if (svg) {
      svg.innerHTML = "";
      if (!isBatch && results.length === 1) {
        drawRootVisualization(results[0], svg);
      } else {
        svg.innerHTML =
          '<text x="10" y="100" fill="#000" font-size="14">Visualization available for single calculation</text>';
      }
    }
    const roots = results.map((r) => parseFloat(r.root)).filter((t) => !isNaN(t));
    if (roots.length > 0) {
      updateBarChart(roots, false);
    }
  };

  const drawRootVisualization = (result, svg) => {
    const width = 500;
    const height = 200;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    try {
      const n = result.n;
      const xMax = Math.max(10, Math.pow(result.x, 1 / n) * 2);
      const yMax = Math.pow(xMax, 1 / n);
      const xScale = width / xMax;
      const yScale = height / yMax;

      // Draw axes
      svg.innerHTML += `<line x1="0" y1="${height}" x2="${width}" y2="${height}" stroke="#000"/>`;
      svg.innerHTML += `<line x1="0" y1="0" x2="0" y2="${height}" stroke="#000"/>`;

      // Draw curve
      let pathD = "";
      for (let x = 0; x <= xMax; x += xMax / 100) {
        const y = Math.pow(x, 1 / n);
        const svgX = x * xScale;
        const svgY = height - y * yScale;
        pathD += (x === 0 ? "M" : "L") + `${svgX},${svgY}`;
      }
      svg.innerHTML += `<path d="${pathD}" stroke="#ef4444" fill="none"/>`;

      // Draw point
      const rootX = result.x;
      const rootY = parseFloat(result.root);
      const svgX = rootX * xScale;
      const svgY = height - rootY * yScale;
      svg.innerHTML += `<circle cx="${svgX}" cy="${svgY}" r="5" fill="#ef4444"/>`;

      // Add labels
      svg.innerHTML += `<text x="10" y="20" fill="#000" font-size="12">y = x^(1/${n})</text>`;
      svg.innerHTML += `<text x="10" y="40" fill="#000" font-size="12">√[${n}]{${result.x}} = ${result.root}</text>`;
    } catch (e) {
      console.error("Visualization error:", e);
      svg.innerHTML = '<text x="10" y="100" fill="#000" font-size="14">Error rendering visualization</text>';
    }
  };

  const updateBarChart = (values, isStats = false) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      const labels = isStats
        ? values.map((_, i) => `Value ${i + 1}`)
        : lastResults.current.map((_, i) => `Calc ${i + 1}`);
      barChartInstance.current = new window.Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: isStats ? "Value" : "Root",
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
            y: { beginAtZero: false, title: { display: true, text: isStats ? "Value" : "Root" } },
            x: { title: { display: true, text: isStats ? "Values" : "Calculations" } },
          },
          plugins: {
            title: { display: true, text: isStats ? "Value Analysis" : "Root Comparison" },
          },
        },
      });
    }
  };

  const updateSensitivityChart = (results) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      barChartInstance.current = new window.Chart(barChartRef.current, {
        type: "line",
        data: {
          labels: results.map((r) => `${Number(r.variation).toFixed(2)}`),
          datasets: [
            {
              label: "Root",
              data: results.map((r) => r.value),
              borderColor: "#ef4444",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: false, title: { display: true, text: "Root" } },
            x: { title: { display: true, text: "Degree Variation" } },
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
    setNumber("");
    setDegree("");
    setBatchFile(null);
    setBatchText("");
    setStatInput("");
    setVariation("");
    setShowResults(false);
    setResults([]);
    setStatsContent("");
    if (barChartInstance.current) barChartInstance.current.destroy();
    const svg = document.getElementById("root-visual");
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
    localStorage.setItem("rootCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calculation_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calculation_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Calculation History", 10, 10);
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
    doc.save("calculation_history.pdf");
  };

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">Advanced Root Calculator</h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
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
                  <option value="2">2 Decimals</option>
                  <option value="4">4 Decimals</option>
                  <option value="6">6 Decimals</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Root Parameters</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                    Number (x)
                    <span className="ml-1 cursor-pointer">?</span>
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Enter the number to find the root of.
                    </span>
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 16"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                    Degree (n)
                    <span className="ml-1 cursor-pointer">?</span>
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Enter the degree of the root (e.g., 2 for square root).
                    </span>
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 2"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-md font-medium text-gray-700 mb-2">Quick Roots</h3>
                <div className="flex gap-2">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => setDegree("2")}
                  >
                    Square Root
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => setDegree("3")}
                  >
                    Cube Root
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => setDegree("4")}
                  >
                    4th Root
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: number,degree)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter pairs (e.g., 16,2;8,3).
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
                placeholder="e.g., 16,2;8,3;27,3"
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
                    Enter root values for analysis.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 4,2,3"
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
                  Degree Variation Range (±)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Variation for degree (n).
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 1"
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
              <div className="mb-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={calculateNewtonRaphson}
                >
                  Approximate with Newton-Raphson
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
                <h3 className="text-md font-medium text-gray-700">Root Function Visualization</h3>
                <svg id="root-visual" className="w-full max-w-[500px] h-[200px] block mx-auto"></svg>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Values Comparison</h3>
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
