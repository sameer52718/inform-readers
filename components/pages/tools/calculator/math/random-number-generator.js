"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [numberType, setNumberType] = useState("integer");
  const [precision, setPrecision] = useState("0");
  const [distribution, setDistribution] = useState("uniform");
  const [unique, setUnique] = useState(false);
  const [crypto, setCrypto] = useState(false);
  const [seed, setSeed] = useState("");
  const [outputFormat, setOutputFormat] = useState("list");
  const [sortOrder, setSortOrder] = useState("none");
  const [statInput, setStatInput] = useState("");
  const [bins, setBins] = useState("");
  const [sensitivityRange, setSensitivityRange] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState({ content: "", stats: "" });
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const histogramRef = useRef(null);
  const scatterChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const histogramInstance = useRef(null);
  const scatterChartInstance = useRef(null);
  const lineChartInstance = useRef(null);
  const lastGeneratedNumbers = useRef([]);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("randomNumberHistory");
      setHistory(stored ? JSON.parse(stored) : []);
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
      if (histogramInstance.current) histogramInstance.current.destroy();
      if (scatterChartInstance.current) scatterChartInstance.current.destroy();
      if (lineChartInstance.current) lineChartInstance.current.destroy();
    };
  }, []);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const showError = (message) => {
    clearMessages();
    setErrorMessage(message);
  };

  const showSuccess = (message) => {
    clearMessages();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const isCryptoAvailable =
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.getRandomValues === "function";

  const mulberry32 = (seed) => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const normalRandom = (mean, stdDev, seed) => {
    const u1 = seed ? mulberry32(seed++) : Math.random();
    const u2 = seed ? mulberry32(seed++) : Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  };

  const exponentialRandom = (lambda, seed) => {
    const u = seed ? mulberry32(seed) : Math.random();
    return -Math.log(1 - u) / lambda;
  };

  const generateNumbers = () => {
    clearMessages();
    try {
      const min = parseFloat(minValue);
      const max = parseFloat(maxValue);
      const qty = parseInt(quantity);
      const prec = parseInt(precision);

      if (isNaN(min) || isNaN(max) || isNaN(qty)) throw new Error("Invalid input values");
      if (min >= max) throw new Error("Minimum value must be less than maximum");
      if (qty < 1 || qty > 10000) throw new Error("Quantity must be between 1 and 10000");
      if (unique && numberType === "decimal") throw new Error("Unique numbers not supported for decimals");
      if (unique && max - min + 1 < qty && numberType === "integer") {
        throw new Error("Range too small for unique numbers");
      }
      if (crypto && !isCryptoAvailable) {
        showError("Cryptographic mode unavailable. Using Math.random() instead.");
      }

      let numbers = [];
      const seedValue = seed ? parseInt(seed, 36) : null;

      if (crypto && isCryptoAvailable && !seed) {
        const array = new Uint32Array(qty);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < qty; i++) {
          const rand = array[i] / (0xffffffff + 1);
          let num =
            numberType === "integer" ? Math.floor(rand * (max - min + 1)) + min : rand * (max - min) + min;
          numbers.push(num);
        }
      } else {
        for (let i = 0; i < qty; i++) {
          let rand = seedValue ? mulberry32(seedValue + i) : Math.random();
          let num;
          if (distribution === "normal") {
            const mean = (max + min) / 2;
            const stdDev = (max - min) / 6;
            num = normalRandom(mean, stdDev, seedValue ? seedValue + i : null);
            num = Math.max(min, Math.min(max, num));
          } else if (distribution === "exponential") {
            const lambda = 1 / ((max - min) / 2);
            num = min + exponentialRandom(lambda, seedValue ? seedValue + i : null);
            num = Math.max(min, Math.min(max, num));
          } else {
            num = rand * (max - min) + min;
          }
          if (numberType === "integer") num = Math.floor(num);
          numbers.push(num);
        }
      }

      if (unique && numberType === "integer") {
        const uniqueNumbers = new Set();
        while (uniqueNumbers.size < qty) {
          let rand =
            crypto && isCryptoAvailable && !seed
              ? Math.floor(
                  (window.crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * (max - min + 1)
                ) + min
              : Math.floor(
                  (seedValue ? mulberry32(seedValue + uniqueNumbers.size) : Math.random()) * (max - min + 1)
                ) + min;
          uniqueNumbers.add(rand);
        }
        numbers = Array.from(uniqueNumbers);
      }

      if (numberType === "decimal") {
        numbers = numbers.map((n) => parseFloat(n.toFixed(prec)));
      }

      if (sortOrder === "asc") {
        numbers.sort((a, b) => a - b);
      } else if (sortOrder === "desc") {
        numbers.sort((a, b) => b - a);
      }

      let output;
      switch (outputFormat) {
        case "csv":
          output = numbers.join(",");
          break;
        case "json":
          output = JSON.stringify(numbers, null, 2);
          break;
        case "text":
          output = numbers.join(" ");
          break;
        case "list":
        default:
          output = numbers.join("\n");
          break;
      }

      const stats = {
        mean: window.math.mean(numbers),
        median: window.math.median(numbers),
        stdDev: window.math.std(numbers),
        min: Math.min(...numbers),
        max: Math.max(...numbers),
      };
      const statsText = (
        <div>
          <strong>Statistics:</strong>
          <br />
          Mean: {stats.mean.toFixed(prec)}
          <br />
          Median: {stats.median.toFixed(prec)}
          <br />
          Standard Deviation: {stats.stdDev.toFixed(prec)}
          <br />
          Min: {stats.min}
          <br />
          Max: {stats.max}
        </div>
      );

      setResults({
        content: (
          <div>
            <strong>Generated Numbers:</strong>
            <br />
            <pre>{output}</pre>
          </div>
        ),
        stats: statsText,
      });
      setShowResults(true);

      const params = `Min: ${min}, Max: ${max}, Qty: ${qty}, Type: ${numberType}, Dist: ${distribution}, Unique: ${unique}, Crypto: ${crypto}, Seed: ${
        seed || "None"
      }`;
      saveToHistory(params, output);
      lastGeneratedNumbers.current = numbers;
      updateVisualizations(numbers);
    } catch (e) {
      showError(e.message || "Invalid input");
    }
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const numbers = statInput
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n));
      const prec = parseInt(precision);

      if (numbers.length === 0) throw new Error("Invalid number list");

      const stats = {
        mean: window.math.mean(numbers),
        median: window.math.median(numbers),
        stdDev: window.math.std(numbers),
        min: Math.min(...numbers),
        max: Math.max(...numbers),
      };
      const statsText = (
        <div>
          Mean: {stats.mean.toFixed(prec)}
          <br />
          Median: {stats.median.toFixed(prec)}
          <br />
          Standard Deviation: {stats.stdDev.toFixed(prec)}
          <br />
          Min: {stats.min}
          <br />
          Max: {stats.max}
        </div>
      );

      setResults({
        content: (
          <div>
            <strong>Statistical Analysis:</strong>
            <br />
            {statsText}
          </div>
        ),
        stats: "",
      });
      setShowResults(true);

      saveToHistory(`Stats(${numbers.join(", ")})`, statsText.props.children.join("; "));
      updateVisualizations(numbers);
    } catch (e) {
      showError("Invalid statistical input");
    }
  };

  const calculateFrequency = () => {
    clearMessages();
    try {
      if (lastGeneratedNumbers.current.length === 0) throw new Error("Generate numbers first");
      const binCount = parseInt(bins);
      const min = Math.min(...lastGeneratedNumbers.current);
      const max = Math.max(...lastGeneratedNumbers.current);

      if (isNaN(binCount) || binCount < 1 || binCount > 100) throw new Error("Invalid number of bins");

      const binSize = (max - min) / binCount;
      const frequency = new Array(binCount).fill(0);
      lastGeneratedNumbers.current.forEach((num) => {
        const binIndex = Math.min(Math.floor((num - min) / binSize), binCount - 1);
        frequency[binIndex]++;
      });

      const frequencyText = frequency.map((count, i) => {
        const binStart = (min + i * binSize).toFixed(2);
        const binEnd = (min + (i + 1) * binSize).toFixed(2);
        return (
          <div key={i}>
            Bin {binStart}-{binEnd}: {count}
          </div>
        );
      });

      setResults({
        content: (
          <div>
            <strong>Frequency Analysis:</strong>
            <br />
            {frequencyText}
          </div>
        ),
        stats: "",
      });
      setShowResults(true);

      saveToHistory(`Frequency (Bins: ${binCount})`, frequencyText.map((t) => t.props.children).join("; "));
      updateHistogram(frequency, min, binSize);
    } catch (e) {
      showError(e.message || "Invalid frequency input");
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const range = sensitivityRange.split("-").map(Number);
      const qty = parseInt(quantity);
      const prec = parseInt(precision);
      const seedValue = seed ? parseInt(seed, 36) : null;

      if (range.length !== 2 || isNaN(range[0]) || isNaN(range[1]) || range[0] >= range[1]) {
        throw new Error("Invalid range");
      }

      const [min, max] = range;
      const results = [];
      const step = (max - min) / 10;
      for (let currentMax = min; currentMax <= max; currentMax += step) {
        let numbers = [];
        for (let i = 0; i < qty; i++) {
          let rand = seedValue ? mulberry32(seedValue + i) : Math.random();
          let num;
          if (distribution === "normal") {
            const mean = (currentMax + min) / 2;
            const stdDev = (currentMax - min) / 6;
            num = normalRandom(mean, stdDev, seedValue ? seedValue + i : null);
            num = Math.max(min, Math.min(currentMax, num));
          } else if (distribution === "exponential") {
            const lambda = 1 / ((currentMax - min) / 2);
            num = min + exponentialRandom(lambda, seedValue ? seedValue + i : null);
            num = Math.max(min, Math.min(currentMax, num));
          } else {
            num = rand * (currentMax - min) + min;
          }
          if (numberType === "integer") num = Math.floor(num);
          numbers.push(num);
        }
        if (numberType === "decimal") {
          numbers = numbers.map((n) => parseFloat(n.toFixed(prec)));
        }
        results.push({ max: currentMax, mean: window.math.mean(numbers) });
      }

      const resultText = results.map((r) => (
        <div key={r.max}>
          Max = {r.max.toFixed(2)}: Mean = {r.mean.toFixed(prec)}
        </div>
      ));

      setResults({
        content: (
          <div>
            <strong>Sensitivity Analysis:</strong>
            <br />
            {resultText}
          </div>
        ),
        stats: "",
      });
      setShowResults(true);

      saveToHistory(`Sensitivity (Range: ${min}-${max})`, resultText.map((t) => t.props.children).join("; "));
      updateSensitivityChart(results);
    } catch (e) {
      showError("Invalid sensitivity input");
    }
  };

  const updateVisualizations = (numbers) => {
    if (histogramInstance.current) histogramInstance.current.destroy();
    if (scatterChartInstance.current) scatterChartInstance.current.destroy();
    if (lineChartInstance.current) lineChartInstance.current.destroy();

    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const bins = Math.min(20, Math.ceil(Math.sqrt(numbers.length)));
    const binSize = (max - min) / bins;
    const frequency = new Array(bins).fill(0);
    numbers.forEach((num) => {
      const binIndex = Math.min(Math.floor((num - min) / binSize), bins - 1);
      frequency[binIndex]++;
    });

    if (histogramRef.current) {
      histogramInstance.current = new window.Chart(histogramRef.current, {
        type: "bar",
        data: {
          labels: Array.from({ length: bins }, (_, i) => {
            const start = (min + i * binSize).toFixed(2);
            const end = (min + (i + 1) * binSize).toFixed(2);
            return `${start}-${end}`;
          }),
          datasets: [
            {
              label: "Frequency",
              data: frequency,
              backgroundColor: "#ef4444", // Primary color
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Frequency" }, beginAtZero: true },
            x: { title: { display: true, text: "Range" } },
          },
          plugins: {
            title: { display: true, text: "Number Distribution" },
          },
        },
      });
    }

    if (scatterChartRef.current) {
      scatterChartInstance.current = new window.Chart(scatterChartRef.current, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Numbers",
              data: numbers.map((n, i) => ({ x: i + 1, y: n })),
              backgroundColor: "#ef4444", // Primary color
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Index" } },
            y: { title: { display: true, text: "Value" } },
          },
          plugins: {
            title: { display: true, text: "Number Sequence" },
          },
        },
      });
    }
  };

  const updateHistogram = (frequency, min, binSize) => {
    if (histogramInstance.current) histogramInstance.current.destroy();
    if (histogramRef.current) {
      histogramInstance.current = new window.Chart(histogramRef.current, {
        type: "bar",
        data: {
          labels: Array.from({ length: frequency.length }, (_, i) => {
            const start = (min + i * binSize).toFixed(2);
            const end = (min + (i + 1) * binSize).toFixed(2);
            return `${start}-${end}`;
          }),
          datasets: [
            {
              label: "Frequency",
              data: frequency,
              backgroundColor: "#ef4444", // Primary color
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Frequency" }, beginAtZero: true },
            x: { title: { display: true, text: "Range" } },
          },
          plugins: {
            title: { display: true, text: "Number Distribution" },
          },
        },
      });
    }
  };

  const updateSensitivityChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (lineChartRef.current) {
      lineChartInstance.current = new window.Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: results.map((r) => r.max.toFixed(2)),
          datasets: [
            {
              label: "Mean Value",
              data: results.map((r) => r.mean),
              borderColor: "#ef4444", // Primary color
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Maximum Value" } },
            y: { title: { display: true, text: "Mean" } },
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
    setMinValue("");
    setMaxValue("");
    setQuantity("");
    setNumberType("integer");
    setPrecision("0");
    setDistribution("uniform");
    setUnique(false);
    setCrypto(false);
    setSeed("");
    setOutputFormat("list");
    setSortOrder("none");
    setStatInput("");
    setBins("");
    setSensitivityRange("");
    setShowResults(false);
    setResults({ content: "", stats: "" });
    lastGeneratedNumbers.current = [];
    if (histogramInstance.current) histogramInstance.current.destroy();
    if (scatterChartInstance.current) scatterChartInstance.current.destroy();
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    showSuccess("Inputs cleared!");
  };

  const saveToHistory = (params, result) => {
    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        params,
        result: result.length > 100 ? result.substring(0, 100) + "..." : result,
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("randomNumberHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Parameters", "Result"],
      ...history.map((h) => [`"${h.date}"`, `"${h.params}"`, `"${h.result}"`]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "random_number_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const jsonContent = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "random_number_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Random Number Generator History", 10, 10);
    doc.setFontSize(12);
    let y = 20;
    history.forEach((h) => {
      doc.text(`Date: ${h.date}, Params: ${h.params}, Result: ${h.result}`, 10, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.text("Note: Visualizations and full results are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("random_number_history.pdf");
  };

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">
            Advanced Random Number Generator
          </h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Generator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Minimum Value
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter the minimum value for random numbers.
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 1"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Maximum Value
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter the maximum value for random numbers.
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 100"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Quantity
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Number of random numbers to generate (1-10000).
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Number Type
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Choose between integers or decimals.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={numberType}
                  onChange={(e) => setNumberType(e.target.value)}
                >
                  <option value="integer">Integer</option>
                  <option value="decimal">Decimal</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Decimal Precision
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Decimal places for decimal numbers.
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
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Distribution
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select the distribution type.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={distribution}
                  onChange={(e) => setDistribution(e.target.value)}
                >
                  <option value="uniform">Uniform</option>
                  <option value="normal">Normal (Gaussian)</option>
                  <option value="exponential">Exponential</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Uniqueness
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Ensure numbers are unique (no duplicates).
                  </span>
                </label>
                <input
                  type="checkbox"
                  className="p-3"
                  checked={unique}
                  onChange={(e) => setUnique(e.target.checked)}
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Cryptographic Mode
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Use secure randomization for sensitive applications.
                  </span>
                </label>
                <input
                  type="checkbox"
                  className="p-3"
                  checked={crypto}
                  onChange={(e) => setCrypto(e.target.checked)}
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Seed (Optional)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter a seed for reproducible results.
                  </span>
                </label>
                <input
                  type="text"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 12345"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Output Format
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Choose how numbers are displayed.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                >
                  <option value="list">List</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="text">Plain Text</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Sort Order
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Sort the generated numbers.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="none">Unsorted</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mb-6">
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              onClick={generateNumbers}
            >
              Generate
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
              {showAdvanced ? "Hide Advanced Features" : "Show Advanced Features"}
            </button>
          </div>
          {showAdvanced && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Analyze Numbers (comma-separated)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter numbers for statistical analysis.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 1,2,3,4,5"
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
                  Number of Bins
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Number of bins for frequency analysis.
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 10"
                  value={bins}
                  onChange={(e) => setBins(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={calculateFrequency}
                >
                  Analyze Frequency
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Range for Sensitivity (e.g., 1-100)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter range for sensitivity analysis.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 1-100"
                  value={sensitivityRange}
                  onChange={(e) => setSensitivityRange(e.target.value)}
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Generation Results</h2>
              <div className="text-gray-600 mb-4">{results.content}</div>
              <div className="text-gray-600 mb-4">{results.stats}</div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Number Distribution</h3>
                <canvas ref={histogramRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Number Sequence</h3>
                <canvas ref={scatterChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Sensitivity Analysis</h3>
                <canvas ref={lineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 max-h-52 overflow-y-auto">
                <h3 className="text-md font-medium text-gray-700">Generation History</h3>
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
                      history.map((h, i) => (
                        <tr key={i}>
                          <td className="p-2">{h.date}</td>
                          <td className="p-2">{h.params}</td>
                          <td className="p-2">{h.result}</td>
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
