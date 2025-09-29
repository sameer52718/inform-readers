"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [averageType, setAverageType] = useState("all");
  const [precision, setPrecision] = useState("2");
  const [format, setFormat] = useState("decimal");
  const [numbers, setNumbers] = useState("");
  const [weights, setWeights] = useState("");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    // Initialize history from localStorage
    setHistory(JSON.parse(localStorage.getItem("averageCalcHistory")) || []);

    // Load external scripts dynamically
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
      loadScript("https://cdn.jsdelivr.net/npm/chart.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
    ]).catch((err) => console.error("Failed to load scripts:", err));

    // Cleanup Chart.js instance on unmount
    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, []);

  // Parse input
  const parseInput = (input, isNumber = true) => {
    try {
      if (!input.trim()) throw new Error("Input cannot be empty");
      if (isNumber) {
        const value = window.math.evaluate(input);
        if (isNaN(value) || !isFinite(value)) throw new Error("Invalid number");
        return value;
      }
      return input.trim();
    } catch (e) {
      throw new Error("Invalid input: " + e.message);
    }
  };

  // Calculate averages
  const calculateAverages = (numbers, weights = null, type = "all", precision) => {
    try {
      if (!numbers.length) throw new Error("No valid numbers provided");
      const validNumbers = numbers.filter((n) => isFinite(n));
      if (!validNumbers.length) throw new Error("No valid numbers provided");

      const results = {};
      if (type === "all" || type === "mean") {
        const mean = window.math.mean(validNumbers);
        results.mean = Number(mean.toFixed(precision));
      }
      if (type === "all" || type === "median") {
        const median = window.math.median(validNumbers);
        results.median = Number(median.toFixed(precision));
      }
      if (type === "all" || type === "mode") {
        const frequency = {};
        validNumbers.forEach((n) => (frequency[n] = (frequency[n] || 0) + 1));
        const maxFreq = Math.max(...Object.values(frequency));
        const modes = Object.keys(frequency)
          .filter((k) => frequency[k] === maxFreq)
          .map(Number);
        results.mode = modes.length === validNumbers.length ? "No mode" : modes.join(", ");
      }
      if (type === "all" || type === "midrange") {
        const midrange = (Math.min(...validNumbers) + Math.max(...validNumbers)) / 2;
        results.midrange = Number(midrange.toFixed(precision));
      }
      if (type === "all" || type === "geometric") {
        const positiveNumbers = validNumbers.filter((n) => n > 0);
        if (!positiveNumbers.length) {
          results.geometric = "N/A (requires positive numbers)";
        } else {
          const product = positiveNumbers.reduce((a, b) => a * b, 1);
          const geometric = Math.pow(product, 1 / positiveNumbers.length);
          results.geometric = Number(geometric.toFixed(precision));
        }
      }
      if (type === "all" || type === "harmonic") {
        const nonZeroNumbers = validNumbers.filter((n) => n !== 0);
        if (!nonZeroNumbers.length) {
          results.harmonic = "N/A (requires non-zero numbers)";
        } else {
          const reciprocalSum = nonZeroNumbers.reduce((a, b) => a + 1 / b, 0);
          const harmonic = nonZeroNumbers.length / reciprocalSum;
          results.harmonic = Number(harmonic.toFixed(precision));
        }
      }
      if (type === "weighted") {
        if (!weights || weights.length !== validNumbers.length)
          throw new Error("Weights must match number of values");
        const validWeights = weights.filter((w) => isFinite(w) && w >= 0);
        if (!validWeights.length) throw new Error("Invalid weights");
        const weightedSum = validNumbers.reduce((sum, n, i) => sum + n * validWeights[i], 0);
        const weightSum = validWeights.reduce((sum, w) => sum + w, 0);
        if (weightSum === 0) throw new Error("Sum of weights cannot be zero");
        results.weighted = Number((weightedSum / weightSum).toFixed(precision));
      }
      return results;
    } catch (e) {
      throw new Error(`Calculation error: ${e.message}`);
    }
  };

  // Format number
  const formatNumber = (value, format, precision) => {
    try {
      if (typeof value === "string") return value;
      if (format === "decimal") return value.toFixed(precision);
      if (format === "fraction") {
        const frac = window.math.fraction(value);
        return `${frac.n}/${frac.d}`;
      }
      return value;
    } catch (e) {
      return "N/A";
    }
  };

  // Perform operation
  const performOperation = (numbers, weights, type, format, precision) => {
    try {
      const averages = calculateAverages(numbers, weights, type, precision);
      return Object.entries(averages).map(([key, value]) => ({
        type: key,
        output: formatNumber(value, format, precision),
        rawValue: value,
      }));
    } catch (e) {
      throw new Error(`Operation error: ${e.message}`);
    }
  };

  // Calculate
  const calculate = async () => {
    setErrorMessage("");
    try {
      const prec = parseInt(precision);
      if (!Number.isInteger(prec) || prec < 0) throw new Error("Precision must be a non-negative integer");
      const isBatch = batchFile || batchText;
      let calcResults = [];

      if (!isBatch) {
        if (!numbers) throw new Error("Numbers are required");
        const numArray = numbers.split(",").map((s) => parseInput(s));
        const weightArray =
          weights && averageType === "weighted" ? weights.split(",").map((s) => parseInput(s)) : null;
        const result = performOperation(numArray, weightArray, averageType, format, prec);
        calcResults.push({
          type: averageType,
          format,
          precision: prec,
          numbers: numArray,
          weights: weightArray,
          results: result,
        });
      } else {
        let calculations = [];
        if (batchFile) {
          const text = await batchFile.text();
          calculations = text
            .split("\n")
            .map((line) => line.split(",").map((s) => s.trim()))
            .filter((c) => c.length >= 2);
        } else if (batchText) {
          calculations = batchText.split(";").map((c) => c.split(",").map((s) => s.trim()));
        }
        for (const c of calculations) {
          try {
            const type = c[c.length - 1] || averageType;
            let nums,
              weights = null;
            if (type === "weighted") {
              weights = c.slice(c.length - c.length / 2, c.length - 1).map((n) => parseInput(n));
              nums = c.slice(0, c.length - c.length / 2 - 1).map((n) => parseInput(n));
            } else {
              nums = c.slice(0, c.length - 1).map((n) => parseInput(n));
            }
            const result = performOperation(nums, weights, type, format, prec);
            calcResults.push({
              type,
              format,
              precision: prec,
              numbers: nums,
              weights,
              results: result,
            });
          } catch (e) {
            console.warn(`Skipping invalid batch entry: ${e.message}`);
          }
        }
        if (calcResults.length === 0) throw new Error("No valid calculations in batch input");
      }

      setResults(calcResults);
      displayResults(calcResults, isBatch);
    } catch (e) {
      setErrorMessage(e.message || "Invalid input");
    }
  };

  // Display results
  const displayResults = (results, isBatch) => {
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-100"><th class="p-2">Input</th><th class="p-2">Average Type</th><th class="p-2">Output</th></tr></thead><tbody>';
      results.forEach((r) => {
        r.results.forEach((res) => {
          const input = r.numbers.join(", ") + (r.weights ? ` (Weights: ${r.weights.join(", ")})` : "");
          output += `<tr><td class="p-2">${input}</td><td class="p-2">${res.type}</td><td class="p-2">${res.output}</td></tr>`;
        });
      });
      output += "</tbody></table>";
      const values = results.flatMap((r) => r.numbers).filter((v) => isFinite(v));
      if (values.length > 0) {
        const frequency = {};
        values.forEach((v) => (frequency[v] = (frequency[v] || 0) + 1));
        output += `<br><strong>Value Frequency Table:</strong><br>`;
        output +=
          '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-100"><th class="p-2">Value</th><th class="p-2">Frequency</th></tr></thead><tbody>';
        Object.entries(frequency).forEach(([v, freq]) => {
          output += `<tr><td class="p-2">${v}</td><td class="p-2">${freq}</td></tr>`;
        });
        output += "</tbody></table>";
      }
    } else {
      const r = results[0];
      output = `<strong>Results (Type: ${r.type}, Precision: ${r.precision}, Format: ${r.format}):</strong><br>`;
      output +=
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-100"><th class="p-2">Type</th><th class="p-2">Output</th></tr></thead><tbody>';
      r.results.forEach((res) => {
        output += `<tr><td class="p-2">${res.type}</td><td class="p-2">${res.output}</td></tr>`;
      });
      output += "</tbody></table>";
      const stats = calculateStatsForNumbers(r.numbers);
      output += `<br><strong>Statistics:</strong><br>`;
      output += `Variance: ${stats.variance.toFixed(r.precision)}<br>`;
      output += `Standard Deviation: ${stats.stdDev.toFixed(r.precision)}<br>`;
      output += `Range: ${stats.range.toFixed(r.precision)}<br>`;
      output += `Skewness: ${stats.skewness.toFixed(r.precision)}`;
    }

    const params = isBatch
      ? `Batch: ${results.length} datasets, Type: ${results[0].type}`
      : `Numbers: ${results[0].numbers.join(", ")}${
          results[0].weights ? `, Weights: ${results[0].weights.join(", ")}` : ""
        }, Type: ${results[0].type}`;
    saveToHistory(params, output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "...");
    updateVisualizations(results, isBatch);
  };

  // Calculate stats for numbers
  const calculateStatsForNumbers = (numbers) => {
    try {
      const validNumbers = numbers.filter((n) => isFinite(n));
      if (!validNumbers.length) return { variance: 0, stdDev: 0, range: 0, skewness: 0 };
      const variance = window.math.variance(validNumbers);
      const stdDev = window.math.std(validNumbers);
      const range = Math.max(...validNumbers) - Math.min(...validNumbers);
      const mean = window.math.mean(validNumbers);
      const skewness =
        validNumbers.reduce((sum, n) => sum + Math.pow(n - mean, 3), 0) /
          (validNumbers.length * Math.pow(stdDev, 3)) || 0;
      return { variance, stdDev, range, skewness };
    } catch (e) {
      return { variance: 0, stdDev: 0, range: 0, skewness: 0 };
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    setErrorMessage("");
    try {
      const nums = statInput
        .split(",")
        .map((s) => parseInput(s))
        .filter((n) => isFinite(n));
      if (nums.length === 0) throw new Error("Invalid number list");

      const stats = calculateStatsForNumbers(nums);
      const prec = parseInt(precision);
      const statsText = `
        Variance: ${stats.variance.toFixed(prec)}<br>
        Standard Deviation: ${stats.stdDev.toFixed(prec)}<br>
        Range: ${stats.range.toFixed(prec)}<br>
        Skewness: ${stats.skewness.toFixed(prec)}
      `;
      const expression = `Stats(${nums.join(", ")})`;

      setResults([{ operation: "stats", statsText }]);
      saveToHistory(expression, statsText.replace(/<br>/g, "; "));
      updateBarChart(nums, [], true);
    } catch (e) {
      setErrorMessage("Invalid statistical input: " + e.message);
    }
  };

  // Calculate sensitivity
  const calculateSensitivity = () => {
    setErrorMessage("");
    try {
      const varValue = parseFloat(variation);
      const prec = parseInt(precision);
      const nums = numbers.split(",").map((s) => parseInput(s));
      if (!nums.length) throw new Error("Numbers are required");
      if (isNaN(varValue)) throw new Error("Invalid variation");

      const calcResults = [];
      const modifiedSets = [
        [...nums], // Original
        [...nums, varValue], // Add variation
        nums.filter((_, i) => i !== nums.length - 1), // Remove last
      ].filter((set) => set.length > 0);

      for (const set of modifiedSets) {
        try {
          const result = performOperation(set, null, averageType, format, prec);
          calcResults.push({
            set: set.join(", "),
            results: result,
          });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      setResults(calcResults);
      const resultText = calcResults
        .map(
          (r) => `Dataset [${r.set}]:<br>` + r.results.map((res) => `${res.type}: ${res.output}`).join("<br>")
        )
        .join("<br><br>");
      saveToHistory(`Sensitivity (Variation: ${varValue})`, resultText.replace(/<br>/g, "; "));
      updateSensitivityChart(calcResults);
    } catch (e) {
      setErrorMessage("Invalid sensitivity input: " + e.message);
    }
  };

  // Update visualizations
  const updateVisualizations = (results, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();

    // Average comparison visualization
    if (!isBatch && results.length === 1 && results[0].type === "all" && results[0].operation !== "stats") {
      drawAverageVisualization(results[0].results);
    } else {
      const svg = svgRef.current;
      if (svg) {
        svg.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single "All Averages" calculation</text>';
      }
    }

    // Bar chart (value frequency)
    const values = results.flatMap((r) => r.numbers).filter((v) => isFinite(v));
    if (values.length > 0) {
      const frequency = {};
      values.forEach((v) => (frequency[v] = (frequency[v] || 0) + 1));
      const sortedValues = Object.keys(frequency)
        .map(Number)
        .sort((a, b) => a - b);
      const counts = sortedValues.map((v) => frequency[v]);
      updateBarChart(sortedValues, counts, isBatch);
    }
  };

  // Draw average visualization
  const drawAverageVisualization = (results) => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = "";
    const width = 500;
    const height = 150;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    try {
      const validResults = results.filter((r) => isFinite(r.rawValue));
      if (validResults.length === 0) {
        svg.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">No valid averages to visualize</text>';
        return;
      }

      const values = validResults.map((r) => r.rawValue);
      const maxVal = Math.max(...values, 0);
      const minVal = Math.min(...values, 0);
      let range = maxVal - minVal;
      if (range === 0) range = Math.max(1, Math.abs(maxVal) || 1);

      const xScale = (width - 40) / validResults.length;
      const yScale = (height - 40) / range;

      validResults.forEach((res, i) => {
        const x = 20 + i * xScale;
        const y = height - 20 - (res.rawValue - minVal) * yScale;

        // Draw point
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", "#ef4444"); // Primary color
        svg.appendChild(circle);

        // Label
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x - 20);
        text.setAttribute("y", y - 10);
        text.setAttribute("fill", "#000");
        text.setAttribute("font-size", "12");
        text.textContent = `${res.type}: ${res.output}`;
        svg.appendChild(text);
      });

      // Draw axis
      const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
      axis.setAttribute("x1", 20);
      axis.setAttribute("y1", height - 20);
      axis.setAttribute("x2", width - 20);
      axis.setAttribute("y2", height - 20);
      axis.setAttribute("stroke", "#000");
      axis.setAttribute("stroke-width", "1");
      svg.appendChild(axis);

      // Axis labels
      const minLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      minLabel.setAttribute("x", 20);
      minLabel.setAttribute("y", height - 5);
      minLabel.setAttribute("fill", "#000");
      minLabel.setAttribute("font-size", "10");
      minLabel.textContent = minVal.toFixed(1);
      svg.appendChild(minLabel);

      const maxLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      maxLabel.setAttribute("x", width - 30);
      maxLabel.setAttribute("y", height - 5);
      maxLabel.setAttribute("fill", "#000");
      maxLabel.setAttribute("font-size", "10");
      maxLabel.textContent = maxVal.toFixed(1);
      svg.appendChild(maxLabel);
    } catch (e) {
      svg.innerHTML =
        '<text x="10" y="50" fill="#000" font-size="14">Unable to render visualization: Invalid data</text>';
    }
  };

  // Update bar chart
  const updateBarChart = (values, counts, isBatch) => {
    const ctx = barChartRef.current?.getContext("2d");
    if (!ctx) return;
    if (barChartInstance.current) barChartInstance.current.destroy();

    barChartInstance.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: values,
        datasets: [
          {
            label: "Value Frequency",
            data: counts,
            backgroundColor: "#ef4444", // Primary color
            borderColor: "#dc2626",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Frequency" }, beginAtZero: true },
          x: { title: { display: true, text: "Values" } },
        },
        plugins: {
          title: { display: true, text: "Value Frequency" },
        },
      },
    });
  };

  // Update sensitivity chart
  const updateSensitivityChart = (results) => {
    const ctx = barChartRef.current?.getContext("2d");
    if (!ctx) return;
    if (barChartInstance.current) barChartInstance.current.destroy();

    const labels = ["Original", "Add Variation", "Remove Last"];
    const datasets = results[0].results.map((res) => ({
      label: res.type,
      data: results.map((r) => {
        const val = r.results.find((v) => v.type === res.type)?.rawValue;
        return isFinite(val) ? val : 0;
      }),
      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      borderWidth: 1,
    }));

    barChartInstance.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Average Value" }, beginAtZero: true },
          x: { title: { display: true, text: "Dataset" } },
        },
        plugins: {
          title: { display: true, text: "Sensitivity Analysis" },
        },
      },
    });
  };

  // Clear inputs
  const clearInputs = () => {
    setAverageType("all");
    setPrecision("2");
    setFormat("decimal");
    setNumbers("");
    setWeights("");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setErrorMessage("");
    setResults([]);
    const svg = svgRef.current;
    if (svg) svg.innerHTML = "";
    if (barChartInstance.current) barChartInstance.current.destroy();
  };

  // Save to history
  const saveToHistory = (params, result) => {
    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        params,
        result,
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("averageCalcHistory", JSON.stringify(newHistory));
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "average_history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Export JSON
  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "average_history.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Export PDF
  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Average Calculation History", 10, 10);
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
    doc.save("average_history.pdf");
  };

  // Handle Enter key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.target.tagName === "INPUT") {
        calculate();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [calculate]);

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-4">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">Advanced Average Calculator</h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Average Type
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Select the type of average to calculate.
                    </span>
                  </span>
                </label>
                <select
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={averageType}
                  onChange={(e) => setAverageType(e.target.value)}
                >
                  <option value="all">All Averages</option>
                  <option value="mean">Arithmetic Mean</option>
                  <option value="median">Median</option>
                  <option value="mode">Mode</option>
                  <option value="midrange">Midrange</option>
                  <option value="geometric">Geometric Mean</option>
                  <option value="harmonic">Harmonic Mean</option>
                  <option value="weighted">Weighted Mean</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Precision (Decimal Places)
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Number of decimal places for output.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 2"
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Output Format
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Choose output display format.
                    </span>
                  </span>
                </label>
                <select
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="decimal">Decimal</option>
                  <option value="fraction">Fraction</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Numbers</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Numbers (comma-separated)
                    <span className="relative group cursor-pointer ml-1">
                      ?
                      <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                        Enter numbers (e.g., 10,20,30.5,-5).
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 10,20,30.5,-5"
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                  />
                </div>
                {averageType === "weighted" && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Weights (comma-separated)
                      <span className="relative group cursor-pointer ml-1">
                        ?
                        <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                          Enter weights for weighted mean (e.g., 1,2,3).
                        </span>
                      </span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., 1,2,3"
                      value={weights}
                      onChange={(e) => setWeights(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV: numbers,average_type,weights)
                <span className="relative group cursor-pointer ml-1">
                  ?
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Upload CSV or enter datasets (e.g., 10,20,30,mean;5,10,15,weighted,1,2,3).
                  </span>
                </span>
              </label>
              <input
                type="file"
                accept=".csv"
                className="w-full p-3 border rounded-lg bg-white text-gray-900 mb-2"
                onChange={(e) => setBatchFile(e.target.files[0])}
              />
              <textarea
                className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                rows="4"
                placeholder="e.g., 10,20,30,mean;5,10,15,weighted,1,2,3"
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4 mb-6">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
              onClick={calculate}
            >
              Calculate
            </button>
            <button
              className="flex-1 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
              onClick={clearInputs}
            >
              Clear
            </button>
          </div>
          <div className="mb-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Features
            </button>
          </div>
          {showAdvanced && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Analyze Values (comma-separated)
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Enter values for statistical analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 10,20,30.5"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                  onClick={calculateStats}
                >
                  Calculate Statistics
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Variation Value
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Value to add/remove for sensitivity analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 5"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                  onClick={calculateSensitivity}
                >
                  Analyze Sensitivity
                </button>
              </div>
            </div>
          )}
          {results.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              {results[0]?.operation === "stats" ? (
                <div dangerouslySetInnerHTML={{ __html: results[0].statsText }} />
              ) : results[0]?.set ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: results
                      .map(
                        (r) =>
                          `Dataset [${r.set}]:<br>` +
                          r.results.map((res) => `${res.type}: ${res.output}`).join("<br>")
                      )
                      .join("<br><br>"),
                  }}
                />
              ) : results.length === 1 ? (
                <div>
                  <strong>
                    Results (Type: {results[0].type}, Precision: {results[0].precision}, Format:{" "}
                    {results[0].format}):
                  </strong>
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2">Type</th>
                        <th className="p-2">Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results[0].results.map((res, i) => (
                        <tr key={i}>
                          <td className="p-2">{res.type}</td>
                          <td className="p-2">{res.output}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br />
                  <strong>Statistics:</strong>
                  {(() => {
                    const stats = calculateStatsForNumbers(results[0].numbers);
                    return (
                      <>
                        <p>Variance: {stats.variance.toFixed(results[0].precision)}</p>
                        <p>Standard Deviation: {stats.stdDev.toFixed(results[0].precision)}</p>
                        <p>Range: {stats.range.toFixed(results[0].precision)}</p>
                        <p>Skewness: {stats.skewness.toFixed(results[0].precision)}</p>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <>
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2">Input</th>
                        <th className="p-2">Average Type</th>
                        <th className="p-2">Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.flatMap((r) =>
                        r.results.map((res, i) => (
                          <tr key={`${r.type}-${i}`}>
                            <td className="p-2">
                              {r.numbers.join(", ")}
                              {r.weights ? ` (Weights: ${r.weights.join(", ")})` : ""}
                            </td>
                            <td className="p-2">{res.type}</td>
                            <td className="p-2">{res.output}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {results.flatMap((r) => r.numbers).filter((v) => isFinite(v)).length > 0 && (
                    <div className="mt-4">
                      <strong>Value Frequency Table:</strong>
                      <table className="w-full text-sm text-gray-600">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-2">Value</th>
                            <th className="p-2">Frequency</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const values = results.flatMap((r) => r.numbers).filter((v) => isFinite(v));
                            const frequency = {};
                            values.forEach((v) => (frequency[v] = (frequency[v] || 0) + 1));
                            return Object.entries(frequency).map(([v, freq], i) => (
                              <tr key={i}>
                                <td className="p-2">{v}</td>
                                <td className="p-2">{freq}</td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Average Comparison</h3>
                <svg ref={svgRef} className="w-full max-w-[500px] h-[150px] mx-auto block"></svg>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Value Frequency</h3>
                <canvas ref={barChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 overflow-x-auto max-h-52 overflow-y-auto">
                <h3 className="text-md font-medium text-gray-700">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Date</th>
                      <th className="p-2">Parameters</th>
                      <th className="p-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, i) => (
                      <tr key={i}>
                        <td className="p-2">{entry.date}</td>
                        <td className="p-2">{entry.params}</td>
                        <td className="p-2">{entry.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                  onClick={exportCSV}
                >
                  Export CSV
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                  onClick={exportJSON}
                >
                  Export JSON
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
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
