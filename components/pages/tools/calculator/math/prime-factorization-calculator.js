"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [operation, setOperation] = useState("factorize");
  const [format, setFormat] = useState("exponent");
  const [numbers, setNumbers] = useState("");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState({ content: "", stats: "", svg: "", chart: "" });
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const svgRef = useRef(null);
  const lastResults = useRef([]);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("primeFactorCalcHistory");
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
      if (chartInstance.current) chartInstance.current.destroy();
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

  const parseInput = (input) => {
    try {
      if (!input.trim()) throw new Error("Input cannot be empty");
      const value = window.math.evaluate(input);
      if (!Number.isInteger(value) || value <= 0) throw new Error("Input must be a positive integer");
      if (value > Number.MAX_SAFE_INTEGER) throw new Error("Number too large");
      return value;
    } catch (e) {
      throw new Error("Invalid input: " + e.message);
    }
  };

  const primeFactorize = (number) => {
    try {
      if (number === 1) return { factors: [], exponents: {} };
      const factors = [];
      const exponents = {};
      let n = number;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        while (n % i === 0) {
          factors.push(i);
          exponents[i] = (exponents[i] || 0) + 1;
          n /= i;
        }
      }
      if (n > 1) {
        factors.push(n);
        exponents[n] = (exponents[n] || 0) + 1;
      }
      return { factors, exponents };
    } catch (e) {
      throw new Error(`Factorization error: ${e.message}`);
    }
  };

  const gcd = (numbers) => {
    try {
      if (numbers.length < 2) throw new Error("At least two numbers required for GCD");
      const factorizations = numbers.map((n) => primeFactorize(n));
      const allPrimes = [...new Set(factorizations.flatMap((f) => Object.keys(f.exponents).map(Number)))];
      let result = 1;
      for (const prime of allPrimes) {
        const minExp = Math.min(...factorizations.map((f) => f.exponents[prime] || 0));
        if (minExp > 0) result *= Math.pow(prime, minExp);
      }
      return result;
    } catch (e) {
      throw new Error(`GCD error: ${e.message}`);
    }
  };

  const lcm = (numbers) => {
    try {
      if (numbers.length < 2) throw new Error("At least two numbers required for LCM");
      const factorizations = numbers.map((n) => primeFactorize(n));
      const allPrimes = [...new Set(factorizations.flatMap((f) => Object.keys(f.exponents).map(Number)))];
      let result = 1;
      for (const prime of allPrimes) {
        const maxExp = Math.max(...factorizations.map((f) => f.exponents[prime] || 0));
        result *= Math.pow(prime, maxExp);
      }
      return result;
    } catch (e) {
      throw new Error(`LCM error: ${e.message}`);
    }
  };

  const formatFactors = (factors, exponents, fmt) => {
    try {
      if (fmt === "exponent") {
        if (!Object.keys(exponents).length) return "1";
        return Object.entries(exponents)
          .map(([p, e]) => (e > 1 ? `${p}^${e}` : p))
          .join(" × ");
      } else {
        return `[${factors.join(", ")}]`;
      }
    } catch (e) {
      throw new Error(`Formatting error: ${e.message}`);
    }
  };

  const numberProperties = (factors, exponents) => {
    try {
      const numDivisors = Object.values(exponents).reduce((acc, e) => acc * (e + 1), 1);
      const sumDivisors = Object.entries(exponents).reduce(
        (acc, [p, e]) => (acc * (Math.pow(Number(p), e + 1) - 1)) / (Number(p) - 1),
        1
      );
      const totient = Object.entries(exponents).reduce(
        (acc, [p, e]) => acc * Math.pow(Number(p), e - 1) * (Number(p) - 1),
        1
      );
      return { numDivisors, sumDivisors, totient };
    } catch (e) {
      throw new Error(`Properties error: ${e.message}`);
    }
  };

  const performOperation = (nums, op, fmt) => {
    try {
      const validNumbers = nums.filter((n) => Number.isInteger(n) && n > 0);
      if (validNumbers.length === 0) throw new Error("No valid numbers provided");

      if (op === "factorize") {
        return validNumbers.map((num) => {
          const { factors, exponents } = primeFactorize(num);
          const props = numberProperties(factors, exponents);
          return {
            input: num,
            output: formatFactors(factors, exponents, fmt),
            factors,
            exponents,
            properties: props,
          };
        });
      } else if (op === "lcm" || op === "gcd") {
        if (validNumbers.length < 2) throw new Error(`At least two numbers required for ${op.toUpperCase()}`);
        const result = op === "lcm" ? lcm(validNumbers) : gcd(validNumbers);
        const { factors, exponents } = primeFactorize(result);
        return [
          {
            input: validNumbers,
            output: fmt === "exponent" ? formatFactors(factors, exponents, fmt) : result,
            factors,
            exponents,
          },
        ];
      } else {
        throw new Error("Invalid operation");
      }
    } catch (e) {
      throw new Error(`Operation error: ${e.message}`);
    }
  };

  const calculate = async () => {
    clearMessages();
    try {
      let calcResults = [];
      let isBatch = batchFile || batchText;

      if (!isBatch) {
        if (!numbers) throw new Error("Numbers are required");
        const nums = numbers.split(",").map((s) => parseInput(s));
        const result = performOperation(nums, operation, format);
        calcResults.push({ operation, format, numbers: nums, results: result });
        displayResults(calcResults, isBatch);
      } else {
        let calculations = [];
        if (batchFile) {
          calculations = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = e.target.result;
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
          calculations = batchText.split(";").map((c) => c.split(",").map((s) => s.trim()));
        }
        await processBatch(calculations, calcResults);
        if (calcResults.length === 0) throw new Error("No valid calculations in batch input");
        displayResults(calcResults, isBatch);
      }
    } catch (e) {
      console.error("Calculation error:", e);
      showError(e.message || "Invalid input");
    }
  };

  const processBatch = async (calculations, calcResults) => {
    for (const c of calculations) {
      try {
        const nums = c.slice(0, c.length - 1).map((n) => parseInput(n));
        const op = c[c.length - 1] || operation;
        const fmt = format;
        const result = performOperation(nums, op, fmt);
        calcResults.push({ operation: op, format: fmt, numbers: nums, results: result });
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const displayResults = (calcResults, isBatch) => {
    let output = "";
    if (isBatch) {
      output = (
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Input</th>
              <th className="p-2">Operation</th>
              <th className="p-2">Output</th>
            </tr>
          </thead>
          <tbody>
            {calcResults.flatMap((r) =>
              r.results.map((res, i) => (
                <tr key={`${r.operation}-${i}`}>
                  <td className="p-2">{Array.isArray(res.input) ? res.input.join(", ") : res.input}</td>
                  <td className="p-2">{r.operation}</td>
                  <td className="p-2">{res.output}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      );
      const allFactors = calcResults
        .flatMap((r) => r.results.flatMap((res) => res.factors || []))
        .filter((f) => f);
      if (allFactors.length > 0) {
        const frequency = {};
        allFactors.forEach((f) => (frequency[f] = (frequency[f] || 0) + 1));
        output = (
          <div>
            {output}
            <br />
            <strong>Prime Factor Frequency Table:</strong>
            <table className="w-full text-sm text-gray-600 mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Prime</th>
                  <th className="p-2">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(frequency).map(([p, freq]) => (
                  <tr key={p}>
                    <td className="p-2">{p}</td>
                    <td className="p-2">{freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    } else {
      const r = calcResults[0];
      output = (
        <div>
          <strong>
            Results ({r.operation}, Format: {r.format}):
          </strong>
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Input</th>
                <th className="p-2">Output</th>
                <th className="p-2">Divisors</th>
                <th className="p-2">Sum of Divisors</th>
                <th className="p-2">Totient</th>
              </tr>
            </thead>
            <tbody>
              {r.results.map((res, i) => (
                <tr key={i}>
                  <td className="p-2">{Array.isArray(res.input) ? res.input.join(", ") : res.input}</td>
                  <td className="p-2">{res.output}</td>
                  <td className="p-2">{res.properties?.numDivisors || "N/A"}</td>
                  <td className="p-2">{res.properties?.sumDivisors || "N/A"}</td>
                  <td className="p-2">{res.properties?.totient || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    let statsText = "";
    if (isBatch && calcResults.length > 1) {
      const allFactors = calcResults
        .flatMap((r) => r.results.flatMap((res) => res.factors || []))
        .filter((f) => f);
      if (allFactors.length > 0) {
        const stats = {
          mean: window.math.mean(allFactors),
          median: window.math.median(allFactors),
          stdDev: window.math.std(allFactors),
          min: Math.min(...allFactors),
          max: Math.max(...allFactors),
        };
        statsText = (
          <div>
            <strong>Statistics (Prime Factors):</strong>
            <br />
            Mean Prime: {stats.mean.toFixed(2)}
            <br />
            Median Prime: {stats.median.toFixed(2)}
            <br />
            Standard Deviation: {stats.stdDev.toFixed(2)}
            <br />
            Min Prime: {stats.min}
            <br />
            Max Prime: {stats.max}
          </div>
        );
      }
    }

    setResults((prev) => ({ ...prev, content: output, stats: statsText }));
    setShowResults(true);

    const params = isBatch
      ? `Batch: ${calcResults.length} calculations, Operation: ${calcResults[0].operation}`
      : `Numbers: ${calcResults[0].numbers.join(", ")}, Operation: ${calcResults[0].operation}, Format: ${
          calcResults[0].format
        }`;
    saveToHistory(params, JSON.stringify(calcResults).substring(0, 100) + "...");

    lastResults.current = calcResults;
    updateVisualizations(calcResults, isBatch);
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const nums = statInput
        .split(",")
        .map((s) => parseInput(s))
        .filter((n) => Number.isInteger(n) && n > 0);
      if (nums.length === 0) throw new Error("Invalid number list");

      const allFactors = nums.flatMap((n) => primeFactorize(n).factors);
      if (allFactors.length === 0) throw new Error("No prime factors found");

      const stats = {
        mean: window.math.mean(allFactors),
        median: window.math.median(allFactors),
        stdDev: window.math.std(allFactors),
        min: Math.min(...allFactors),
        max: Math.max(...allFactors),
      };
      const statsText = (
        <div>
          Mean Prime: {stats.mean.toFixed(2)}
          <br />
          Median Prime: {stats.median.toFixed(2)}
          <br />
          Standard Deviation: {stats.stdDev.toFixed(2)}
          <br />
          Min Prime: {stats.min}
          <br />
          Max Prime: {stats.max}
        </div>
      );
      const expression = `Stats(${nums.join(", ")})`;

      setResults({
        content: (
          <div>
            <strong>Statistical Analysis (Prime Factors):</strong>
            <br />
            {statsText}
          </div>
        ),
        stats: "",
      });
      setShowResults(true);

      saveToHistory(expression, JSON.stringify(stats).replace(/<br>/g, "; "));
      updateBarChart(allFactors, [], true);
    } catch (e) {
      console.error("Stats error:", e);
      showError("Invalid statistical input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const varNum = parseInt(variation);
      const nums = numbers.split(",").map((s) => parseInput(s));

      if (!nums.length) throw new Error("Numbers are required");
      if (isNaN(varNum) || varNum <= 0) throw new Error("Invalid variation");
      if (operation !== "factorize") throw new Error("Sensitivity analysis requires factorize operation");

      const sensResults = [];
      for (let num of nums) {
        for (let v = Math.max(1, num - varNum); v <= num + varNum; v++) {
          try {
            const result = performOperation([v], operation, format);
            sensResults.push({
              number: v,
              factors: result[0].output,
            });
          } catch (e) {
            console.warn(`Skipping sensitivity variation: ${e.message}`);
          }
        }
      }

      const resultText = sensResults.map((r) => (
        <div key={r.number}>
          Number {r.number}: {r.factors}
        </div>
      ));

      setResults({
        content: (
          <div>
            <strong>Sensitivity Analysis (Number ±{varNum}):</strong>
            <br />
            {resultText}
          </div>
        ),
        stats: "",
      });
      setShowResults(true);

      saveToHistory(`Sensitivity (±${varNum} Numbers)`, JSON.stringify(sensResults).replace(/<br>/g, "; "));
      updateSensitivityChart(sensResults);
    } catch (e) {
      console.error("Sensitivity error:", e);
      showError("Invalid sensitivity input: " + e.message);
    }
  };

  const updateVisualizations = (calcResults, isBatch) => {
    if (chartInstance.current) chartInstance.current.destroy();

    let svgContent = "";
    if (!isBatch && calcResults.length === 1 && calcResults[0].operation === "factorize") {
      svgContent = drawFactorVisualization(calcResults[0].results);
    } else {
      svgContent = (
        <text x="10" y="50" fill="#000" fontSize="14">
          Visualization available for single factorization
        </text>
      );
    }

    const allFactors = calcResults
      .flatMap((r) => r.results.flatMap((res) => res.factors || []))
      .filter((f) => f);
    if (allFactors.length > 0) {
      const frequency = {};
      allFactors.forEach((f) => (frequency[f] = (frequency[f] || 0) + 1));
      const primes = Object.keys(frequency)
        .map(Number)
        .sort((a, b) => a - b);
      const counts = primes.map((p) => frequency[p]);
      updateBarChart(primes, counts, isBatch);
    }

    setResults((prev) => ({ ...prev, svg: svgContent }));
  };

  const drawFactorVisualization = (res) => {
    const width = 500;
    const height = 150;

    try {
      const validResults = res.filter((r) => r.factors.length > 0 || r.input === 1);
      if (validResults.length === 0) {
        return (
          <text x="10" y="50" fill="#000" fontSize="14">
            No prime factors to visualize
          </text>
        );
      }

      const allPrimes = [...new Set(validResults.flatMap((r) => r.factors))].sort((a, b) => a - b);
      if (allPrimes.length === 0) {
        return (
          <text x="10" y="50" fill="#000" fontSize="14">
            Input is 1 (no prime factors)
          </text>
        );
      }

      const maxCount = Math.max(
        ...validResults.map((r) => Object.values(r.exponents).reduce((a, b) => a + b, 0))
      );
      const range = maxCount || 1;
      const xScale = (width - 40) / allPrimes.length;
      const yScale = (height - 40) / range;
      const yBase = height - 20;

      return (
        <>
          {validResults.map((r, i) => (
            <g key={i}>
              {Object.entries(r.exponents).map(([prime, count]) => {
                const primeIndex = allPrimes.indexOf(Number(prime));
                const x = 20 + primeIndex * xScale;
                const barHeight = count * yScale;
                return (
                  <g key={prime}>
                    <rect
                      x={x}
                      y={yBase - barHeight}
                      width={xScale * 0.4}
                      height={barHeight}
                      fill="#ef4444"
                    />
                    <text x={x} y={yBase - barHeight - 5} fill="#000" fontSize="12">
                      {count > 1 ? `${prime}^${count}` : prime}
                    </text>
                  </g>
                );
              })}
              <text x="10" y={20 + i * 20} fill="#000" fontSize="12">
                {r.input} = {r.output}
              </text>
            </g>
          ))}
          <line x1="20" y1={yBase} x2={width - 20} y2={yBase} stroke="#000" strokeWidth="1" />
          {allPrimes.map((prime, i) => (
            <text key={prime} x={20 + i * xScale} y={yBase + 15} fill="#000" fontSize="10">
              {prime}
            </text>
          ))}
        </>
      );
    } catch (e) {
      console.error("Visualization error:", e);
      return (
        <text x="10" y="50" fill="#000" fontSize="14">
          Unable to render visualization: Invalid data
        </text>
      );
    }
  };

  const updateBarChart = (primes, counts, isBatch) => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new window.Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: primes,
        datasets: [
          {
            label: "Prime Factor Frequency",
            data: counts,
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
          x: { title: { display: true, text: "Prime Factors" } },
        },
        plugins: { title: { display: true, text: "Prime Factor Frequency" } },
      },
    });
  };

  const updateSensitivityChart = (sensResults) => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const numbers = [...new Set(sensResults.map((r) => r.number))].sort((a, b) => a - b);
    const primes = [...new Set(sensResults.flatMap((r) => r.factors.match(/\d+/g) || []).map(Number))].sort(
      (a, b) => a - b
    );
    const datasets = primes.map((prime) => ({
      label: `Prime ${prime}`,
      data: numbers.map((n) => {
        const res = sensResults.find((r) => r.number === n);
        return res && res.factors.includes(prime)
          ? (res.factors.match(new RegExp(`${prime}\\^?\\d*`, "g")) || []).length
          : 0;
      }),
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fill: false,
    }));

    chartInstance.current = new window.Chart(chartRef.current, {
      type: "line",
      data: { labels: numbers, datasets },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Factor Count" }, beginAtZero: true },
          x: { title: { display: true, text: "Number" } },
        },
        plugins: { title: { display: true, text: "Sensitivity Analysis" } },
      },
    });
  };

  const clearInputs = () => {
    clearMessages();
    setNumbers("");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setShowResults(false);
    setResults({ content: "", stats: "", svg: "", chart: "" });
    lastResults.current = [];
    showSuccess("Inputs cleared!");
  };

  const saveToHistory = (params, result) => {
    const newHistory = [...history, { date: new Date().toLocaleString(), params, result }];
    setHistory(newHistory);
    localStorage.setItem("primeFactorCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "prime_factor_history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "prime_factor_history.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Prime Factorization Calculation History", 10, 10);
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
    doc.save("prime_factor_history.pdf");
  };

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">
            Advanced Prime Factorization Calculator
          </h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Operation
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select prime factorization or related operation.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                >
                  <option value="factorize">Prime Factorization</option>
                  <option value="lcm">LCM</option>
                  <option value="gcd">GCD</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Output Format
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Choose output display format.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="exponent">Exponent Form (2² × 5²)</option>
                  <option value="list">Factor List ([2, 2, 5, 5])</option>
                </select>
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
                      Enter positive integers (e.g., 100,360,48).
                    </span>
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 100,360,48"
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: number,operation)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter numbers with operation (e.g., 100,factorize;360,48,lcm).
                </span>
              </label>
              <input
                type="file"
                accept=".csv"
                className="p-3 border rounded-lg w-full mb-2 bg-gray-200"
                onChange={(e) => setBatchFile(e.target.files[0])}
              />
              <textarea
                className="p-3 border rounded-lg w-full bg-gray-200"
                rows="4"
                placeholder="e.g., 100,factorize;360,48,lcm"
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
              {showAdvanced ? "Hide Advanced Features" : "Show Advanced Features"}
            </button>
          </div>
          {showAdvanced && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Analyze Prime Factors (comma-separated numbers)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter numbers for factor analysis.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 100,360,48"
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
                  Number Variation Range
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Range of numbers to test (e.g., ±10).
                  </span>
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 10"
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
              <div className="text-gray-600 mb-4">{results.content}</div>
              <div className="text-gray-600 mb-4">{results.stats}</div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Prime Factor Visualization</h3>
                <svg ref={svgRef} width="500" height="150" className="block mx-auto">
                  {results.svg}
                </svg>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Prime Factor Frequency</h3>
                <canvas ref={chartRef} className="max-h-80" />
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
