"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [operation, setOperation] = useState("simplify");
  const [precision, setPrecision] = useState("4");
  const [format, setFormat] = useState("fraction");
  const [inputs, setInputs] = useState("");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    // Initialize history from localStorage
    setHistory(JSON.parse(localStorage.getItem("fractionCalcHistory")) || []);

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
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
    };
  }, []);

  const parseInput = (input) => {
    try {
      input = input.trim();
      if (!input) throw new Error("Input cannot be empty");

      if (/^-?\d*\.?\d+$/.test(input)) {
        return { type: "decimal", value: parseFloat(input) };
      }

      if (/^-?\d+_\d+\/\d+$/.test(input)) {
        const [whole, frac] = input.split("_");
        const [num, den] = frac.split("/").map((n) => parseInt(n));
        if (den === 0) throw new Error("Denominator cannot be zero");
        const sign = input.startsWith("-") ? -1 : 1;
        const numerator = sign * (Math.abs(parseInt(whole)) * den + num);
        return { type: "fraction", numerator, denominator: den };
      }

      if (/^-?\d+\/\d+$/.test(input)) {
        const [num, den] = input.split("/").map((n) => parseInt(n));
        if (den === 0) throw new Error("Denominator cannot be zero");
        return { type: "fraction", numerator: num, denominator: den };
      }

      throw new Error("Invalid input: Use fraction (3/4), mixed number (3_1/2), or decimal (0.75)");
    } catch (e) {
      throw new Error("Invalid input: " + e.message);
    }
  };

  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  const simplifyFraction = (num, den) => {
    if (den === 0) throw new Error("Denominator cannot be zero");
    const g = gcd(num, den);
    return { numerator: num / g, denominator: den / g };
  };

  const toMixedNumber = (num, den) => {
    if (den === 0) throw new Error("Denominator cannot be zero");
    const { numerator, denominator } = simplifyFraction(num, den);
    const whole = Math.floor(numerator / denominator);
    const remainder = Math.abs(numerator % denominator);
    if (remainder === 0) return whole.toString();
    if (whole === 0) return `${numerator}/${denominator}`;
    return `${whole}_${remainder}/${denominator}`;
  };

  const decimalToFraction = (decimal, prec) => {
    if (!isFinite(decimal)) throw new Error("Invalid decimal");
    const frac = window.math.fraction(decimal);
    const tolerance = Math.pow(10, -prec);
    let num = frac.n,
      den = frac.d;
    if (Math.abs(decimal - num / den) > tolerance) {
      let x = decimal;
      let a = Math.floor(x);
      let h1 = 1,
        h2 = 0,
        k1 = 0,
        k2 = 1;
      while (x - a > tolerance) {
        x = 1 / (x - a);
        a = Math.floor(x);
        const h = a * h1 + h2;
        const k = a * k1 + k2;
        if (Math.abs(decimal - h / k) < tolerance || k > 10000) {
          num = h;
          den = k;
          break;
        }
        h2 = h1;
        h1 = h;
        k2 = k1;
        k1 = k;
      }
    }
    return simplifyFraction(num, den);
  };

  const fractionArithmetic = (fractions, op) => {
    if (fractions.length < 2) throw new Error("At least two fractions required");
    let result = fractions[0];
    for (let i = 1; i < fractions.length; i++) {
      const { numerator: n1, denominator: d1 } = result;
      const { numerator: n2, denominator: d2 } = fractions[i];
      let num, den;
      if (op === "add") {
        num = n1 * d2 + n2 * d1;
        den = d1 * d2;
      } else if (op === "subtract") {
        num = n1 * d2 - n2 * d1;
        den = d1 * d2;
      } else if (op === "multiply") {
        num = n1 * n2;
        den = d1 * d2;
      } else if (op === "divide") {
        if (n2 === 0) throw new Error("Division by zero");
        num = n1 * d2;
        den = d1 * n2;
      }
      result = simplifyFraction(num, den);
    }
    return result;
  };

  const compareFractions = (fractions) => {
    if (fractions.length < 2) throw new Error("At least two fractions required");
    const values = fractions.map((f) => f.numerator / f.denominator);
    const sorted = [...values].sort((a, b) => a - b);
    return fractions
      .map((f, i) => {
        const val = values[i];
        if (val === sorted[0]) return `${f.numerator}/${f.denominator} (Smallest)`;
        if (val === sorted[sorted.length - 1]) return `${f.numerator}/${f.denominator} (Largest)`;
        return `${f.numerator}/${f.denominator}`;
      })
      .join(", ");
  };

  const formatOutput = (result, op, fmt, prec) => {
    if (op === "fraction_to_decimal") {
      return Number((result.numerator / result.denominator).toFixed(prec));
    }
    if (op === "compare") return result;
    if (typeof result === "string") return result;
    const { numerator, denominator } = result;
    if (fmt === "decimal") {
      return Number((numerator / denominator).toFixed(prec));
    } else if (fmt === "mixed") {
      return toMixedNumber(numerator, denominator);
    } else {
      return `${numerator}/${denominator}`;
    }
  };

  const performOperation = (inputs, op, fmt, prec) => {
    if (!inputs.length) throw new Error("No valid inputs provided");
    const parsedInputs = inputs.map((inp) => {
      if (inp.type === "fraction") return inp;
      if (inp.type === "decimal" && op === "decimal_to_fraction") {
        return decimalToFraction(inp.value, prec);
      }
      throw new Error("Invalid input for operation");
    });

    let result;
    if (["simplify", "mixed", "improper"].includes(op)) {
      result = parsedInputs.map((f) => {
        if (op === "simplify") {
          return simplifyFraction(f.numerator, f.denominator);
        } else if (op === "mixed") {
          return { output: toMixedNumber(f.numerator, f.denominator) };
        } else {
          return f;
        }
      });
    } else if (op === "decimal_to_fraction") {
      result = parsedInputs.map((f) => f);
    } else if (op === "fraction_to_decimal") {
      result = parsedInputs.map((f) => ({
        output: f.numerator / f.denominator,
      }));
    } else if (["add", "subtract", "multiply", "divide"].includes(op)) {
      result = [fractionArithmetic(parsedInputs, op)];
    } else if (op === "compare") {
      result = [{ output: compareFractions(parsedInputs) }];
    } else {
      throw new Error("Invalid operation");
    }

    return result.map((r) => ({
      input: inputs
        .map((i) => (i.type === "decimal" ? i.value : `${i.numerator}/${i.denominator}`))
        .join(", "),
      output: formatOutput(r.output || r, op, fmt, prec),
      numerator: r.numerator,
      denominator: r.denominator,
    }));
  };

  const calculate = async () => {
    setErrorMessage("");
    try {
      const prec = parseInt(precision);
      if (!Number.isInteger(prec) || prec < 0) throw new Error("Precision must be a non-negative integer");

      let calcResults = [];
      const isBatch = batchFile || batchText;

      if (!isBatch) {
        if (!inputs) throw new Error("Inputs are required");
        const inputArray = inputs.split(",").map((s) => parseInput(s));
        const result = performOperation(inputArray, operation, format, prec);
        calcResults.push({ operation, format, precision: prec, inputs: inputArray, results: result });
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
            const op = c[c.length - 1] || operation;
            const inputArray = c.slice(0, c.length - 1).map((s) => parseInput(s));
            const result = performOperation(inputArray, op, format, prec);
            calcResults.push({ operation: op, format, precision: prec, inputs: inputArray, results: result });
          } catch (e) {
            console.warn(`Skipping invalid batch entry: ${e.message}`);
          }
        }
        if (calcResults.length === 0) throw new Error("No valid calculations in batch input");
      }

      setResults(calcResults);
      const params = isBatch
        ? `Batch: ${calcResults.length} calculations, Operation: ${calcResults[0].operation}`
        : `Inputs: ${calcResults[0].inputs
            .map((i) => (i.type === "decimal" ? i.value : `${i.numerator}/${i.denominator}`))
            .join(", ")}, Operation: ${calcResults[0].operation}`;
      const resultText = calcResults
        .flatMap((r) => r.results.map((res) => `Input: ${res.input}, Output: ${res.output}`))
        .join("; ");
      saveToHistory(params, resultText);
      updateVisualizations(calcResults, isBatch);
    } catch (e) {
      setErrorMessage(e.message || "Invalid input");
    }
  };

  const calculateStats = () => {
    setErrorMessage("");
    try {
      const inputArray = statInput.split(",").map((s) => parseInput(s));
      const fractions = inputArray
        .filter((i) => i.type === "fraction")
        .map((f) => ({ numerator: f.numerator, denominator: f.denominator }));
      if (fractions.length === 0) throw new Error("No valid fractions for analysis");

      const numerators = fractions.map((f) => f.numerator);
      const denominators = fractions.map((f) => f.denominator);
      const stats = {
        meanNum: window.math.mean(numerators),
        medianNum: window.math.median(numerators),
        meanDen: window.math.mean(denominators),
        medianDen: window.math.median(denominators),
      };
      const statsText = `
        Mean Numerator: ${stats.meanNum.toFixed(2)}<br>
        Median Numerator: ${stats.medianNum.toFixed(2)}<br>
        Mean Denominator: ${stats.meanDen.toFixed(2)}<br>
        Median Denominator: ${stats.medianDen.toFixed(2)}
      `;
      const expression = `Stats(${inputArray
        .map((i) => (i.type === "decimal" ? i.value : `${i.numerator}/${i.denominator}`))
        .join(", ")})`;

      setResults([{ operation: "stats", results: [{ output: statsText }] }]);
      saveToHistory(expression, statsText.replace(/<br>/g, "; "));
      updateBarChart(numerators, denominators, true);
    } catch (e) {
      setErrorMessage("Invalid statistical input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    setErrorMessage("");
    try {
      const varInput = parseInput(variation);
      const prec = parseInt(precision);
      const inputArray = inputs.split(",").map((s) => parseInput(s));

      if (!inputArray.length) throw new Error("Inputs are required");
      if (varInput.type !== "fraction") throw new Error("Variation must be a fraction");
      if (!["add", "subtract"].includes(operation))
        throw new Error("Sensitivity analysis requires add or subtract operation");

      const calcResults = [];
      const modifiedInputs = [
        [...inputArray],
        [...inputArray, varInput],
        [...inputArray.slice(0, -1)],
      ].filter((set) => set.length > 0);

      for (const set of modifiedInputs) {
        try {
          const result = performOperation(set, operation, format, prec);
          calcResults.push({
            set: set
              .map((i) => (i.type === "decimal" ? i.value : `${i.numerator}/${i.denominator}`))
              .join(", "),
            results: result,
          });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      setResults(calcResults);
      const resultText = calcResults
        .map((r) => `Inputs [${r.set}]: ${r.results.map((res) => `Output: ${res.output}`).join("; ")}`)
        .join("; ");
      saveToHistory(`Sensitivity (${varInput.numerator}/${varInput.denominator})`, resultText);
      updateSensitivityChart(calcResults);
    } catch (e) {
      setErrorMessage("Invalid sensitivity input: " + e.message);
    }
  };

  const clearInputs = () => {
    setInputs("");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setPrecision("4");
    setErrorMessage("");
    setResults(null);
    if (svgRef.current) svgRef.current.innerHTML = "";
    if (barChartInstance.current) barChartInstance.current.destroy();
  };

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
    localStorage.setItem("fractionCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "fraction_history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "fraction_history.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Fraction Calculation History", 10, 10);
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
    doc.save("fraction_history.pdf");
  };

  const updateVisualizations = (calcResults, isBatch) => {
    if (
      !isBatch &&
      calcResults.length === 1 &&
      calcResults[0].results.length === 1 &&
      calcResults[0].results[0].numerator !== undefined
    ) {
      drawFractionVisualization(calcResults[0].results);
    } else {
      if (svgRef.current) {
        svgRef.current.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single fraction result</text>';
      }
    }

    const numerators = calcResults
      .flatMap((r) => r.results.map((res) => res.numerator))
      .filter((n) => n !== undefined);
    const denominators = calcResults
      .flatMap((r) => r.results.map((res) => res.denominator))
      .filter((d) => d !== undefined);
    if (numerators.length > 0 || denominators.length > 0) {
      updateBarChart(numerators, denominators, isBatch);
    }
  };

  const drawFractionVisualization = (results) => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = "";
    const width = 500;
    const height = 150;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    try {
      const validResults = results.filter((r) => r.numerator !== undefined && r.denominator !== undefined);
      if (validResults.length === 0) {
        svg.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">No valid fractions to visualize</text>';
        return;
      }

      const fraction = validResults[0];
      const num = Math.abs(fraction.numerator);
      const den = fraction.denominator;
      const value = num / den;

      const barWidth = (width - 40) / den;
      for (let i = 0; i < den; i++) {
        const x = 20 + i * barWidth;
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", height - 50);
        rect.setAttribute("width", barWidth - 2);
        rect.setAttribute("height", 30);
        rect.setAttribute("fill", i < num ? "#ef4444" : "#e5e7eb");
        svg.appendChild(rect);
      }

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", 20);
      text.setAttribute("y", 30);
      text.setAttribute("fill", "#000");
      text.setAttribute("font-size", "14");
      text.textContent = `Fraction: ${fraction.numerator}/${fraction.denominator} = ${value.toFixed(2)}`;
      svg.appendChild(text);

      const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
      axis.setAttribute("x1", 20);
      axis.setAttribute("y1", height - 20);
      axis.setAttribute("x2", width - 20);
      axis.setAttribute("y2", height - 20);
      axis.setAttribute("stroke", "#000");
      axis.setAttribute("stroke-width", "1");
      svg.appendChild(axis);
    } catch (e) {
      svg.innerHTML =
        '<text x="10" y="50" fill="#000" font-size="14">Unable to render visualization: Invalid data</text>';
    }
  };

  const updateBarChart = (numerators, denominators, isBatch) => {
    const ctx = barChartRef.current?.getContext("2d");
    if (!ctx) return;
    if (barChartInstance.current) barChartInstance.current.destroy();

    const numFreq = {},
      denFreq = {};
    numerators.forEach((n) => (numFreq[n] = (numFreq[n] || 0) + 1));
    denominators.forEach((d) => (denFreq[d] = (denFreq[d] || 0) + 1));
    const labels = [...new Set([...Object.keys(numFreq), ...Object.keys(denFreq)])]
      .map(Number)
      .sort((a, b) => a - b);
    const numData = labels.map((n) => numFreq[n] || 0);
    const denData = labels.map((n) => denFreq[n] || 0);

    barChartInstance.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Numerator Frequency",
            data: numData,
            backgroundColor: "#ef4444",
            borderColor: "#b91c1c",
            borderWidth: 1,
          },
          {
            label: "Denominator Frequency",
            data: denData,
            backgroundColor: "#22c55e",
            borderColor: "#15803d",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Frequency" }, beginAtZero: true },
          x: { title: { display: true, text: "Value" } },
        },
        plugins: {
          title: { display: true, text: "Numerator/Denominator Frequency" },
        },
      },
    });
  };

  const updateSensitivityChart = (calcResults) => {
    const ctx = barChartRef.current?.getContext("2d");
    if (!ctx) return;
    if (barChartInstance.current) barChartInstance.current.destroy();

    const labels = ["Original", "Add Variation", "Remove Last"];
    const datasets = [
      {
        label: "Decimal Value",
        data: calcResults.map((r) => {
          const res = r.results[0];
          return res.numerator && res.denominator ? res.numerator / res.denominator : 0;
        }),
        backgroundColor: "#ef4444",
        borderColor: "#b91c1c",
        borderWidth: 1,
      },
    ];

    barChartInstance.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Decimal Value" }, beginAtZero: true },
          x: { title: { display: true, text: "Dataset" } },
        },
        plugins: {
          title: { display: true, text: "Sensitivity Analysis" },
        },
      },
    });
  };

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-4">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">Advanced Fraction Calculator</h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Operation
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Select the fraction operation.
                    </span>
                  </span>
                </label>
                <select
                  id="operation"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                >
                  <option value="simplify">Simplify Fraction</option>
                  <option value="mixed">Convert to Mixed Number</option>
                  <option value="improper">Convert to Improper Fraction</option>
                  <option value="decimal_to_fraction">Decimal to Fraction</option>
                  <option value="fraction_to_decimal">Fraction to Decimal</option>
                  <option value="add">Add Fractions</option>
                  <option value="subtract">Subtract Fractions</option>
                  <option value="multiply">Multiply Fractions</option>
                  <option value="divide">Divide Fractions</option>
                  <option value="compare">Compare Fractions</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Precision (Decimal Places)
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Number of decimal places for decimal outputs.
                    </span>
                  </span>
                </label>
                <input
                  id="precision"
                  type="number"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 4"
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
                  id="format"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="fraction">Fraction</option>
                  <option value="mixed">Mixed Number</option>
                  <option value="decimal">Decimal</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Inputs</h3>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Fraction(s) or Decimal (e.g., 1/2, 3_1/2, 0.75)
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Enter fractions, mixed numbers, or decimals (comma-separated).
                    </span>
                  </span>
                </label>
                <input
                  id="inputs"
                  type="text"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 1/2, 3_1/2, 0.75"
                  value={inputs}
                  onChange={(e) => setInputs(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV: input1,[input2,...],operation)
                <span className="relative group cursor-pointer ml-1">
                  ?
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Upload CSV or enter operations (e.g., 1/2,simplify;1/2,3/4,add).
                  </span>
                </span>
              </label>
              <input
                id="batch-input"
                type="file"
                accept=".csv"
                className="w-full p-3 border rounded-lg bg-white text-gray-900 mb-2"
                onChange={(e) => setBatchFile(e.target.files[0])}
              />
              <textarea
                id="batch-text"
                className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                rows="4"
                placeholder="e.g., 1/2,simplify;1/2,3/4,add"
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
                  Analyze Fractions (comma-separated)
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Enter fractions for statistical analysis.
                    </span>
                  </span>
                </label>
                <input
                  id="stat-input"
                  type="text"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 1/2,3/4,5/6"
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
                  Variation Fraction
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Fraction to add/subtract for sensitivity analysis.
                    </span>
                  </span>
                </label>
                <input
                  id="variation"
                  type="text"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 1/10"
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
          {results && (
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              {results[0]?.operation === "stats" ? (
                <div dangerouslySetInnerHTML={{ __html: results[0].results[0].output }} />
              ) : (
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Input</th>
                      <th className="p-2">{results.length > 1 ? "Operation" : "Output"}</th>
                      {results.length > 1 && <th className="p-2">Output</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {results.flatMap((r) =>
                      r.results.map((res, i) => (
                        <tr key={`${r.operation}-${i}`}>
                          <td className="p-2">{res.input}</td>
                          {results.length > 1 ? (
                            <>
                              <td className="p-2">{r.operation}</td>
                              <td className="p-2">{res.output}</td>
                            </>
                          ) : (
                            <td className="p-2">{res.output}</td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
              {results.length > 1 && (
                <>
                  <h3 className="text-md font-medium text-gray-700 mt-4">Numerator/Denominator Frequency</h3>
                  <table className="w-full text-sm text-gray-600 mt-2">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2">Type</th>
                        <th className="p-2">Value</th>
                        <th className="p-2">Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(
                        results
                          .flatMap((r) => r.results.map((res) => res.numerator))
                          .filter((n) => n !== undefined)
                          .reduce((acc, n) => ({ ...acc, [n]: (acc[n] || 0) + 1 }), {})
                      ).map(([n, freq]) => (
                        <tr key={`num-${n}`}>
                          <td className="p-2">Numerator</td>
                          <td className="p-2">{n}</td>
                          <td className="p-2">{freq}</td>
                        </tr>
                      ))}
                      {Object.entries(
                        results
                          .flatMap((r) => r.results.map((res) => res.denominator))
                          .filter((d) => d !== undefined)
                          .reduce((acc, d) => ({ ...acc, [d]: (acc[d] || 0) + 1 }), {})
                      ).map(([d, freq]) => (
                        <tr key={`den-${d}`}>
                          <td className="p-2">Denominator</td>
                          <td className="p-2">{d}</td>
                          <td className="p-2">{freq}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Fraction Visualization</h3>
                <svg ref={svgRef} className="w-full max-w-[500px] h-[150px] block mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Numerator/Denominator Frequency</h3>
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
