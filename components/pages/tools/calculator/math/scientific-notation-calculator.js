"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [operation, setOperation] = useState("convert");
  const [precision, setPrecision] = useState("3");
  const [format, setFormat] = useState("scientific");
  const [numbers, setNumbers] = useState("");
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
  const svgRef = useRef(null);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("sciNotationCalcHistory");
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
    try {
      if (!input.trim()) throw new Error("Input cannot be empty");
      if (isNumber) {
        const value = window.math.evaluate(input);
        if (isNaN(value) || !isFinite(value)) throw new Error("Invalid number (NaN or Infinity not allowed)");
        if (Math.abs(value) > Number.MAX_SAFE_INTEGER) throw new Error("Number too large");
        return value;
      }
      return input.trim();
    } catch (e) {
      throw new Error("Invalid input: " + e.message);
    }
  };

  const toScientificNotation = (number, precision) => {
    try {
      if (number === 0) return { coefficient: 0, exponent: 0 };
      const absNum = Math.abs(number);
      const exponent = Math.floor(Math.log10(absNum));
      const coefficient = number / Math.pow(10, exponent);
      const rounded = Number(coefficient.toFixed(precision - 1));
      return { coefficient: rounded, exponent };
    } catch (e) {
      throw new Error(`Conversion error: ${e.message}`);
    }
  };

  const formatNumber = (number, format, precision, sciObj = null) => {
    try {
      if (!isFinite(number)) return "N/A";
      if (format === "scientific") {
        const { coefficient, exponent } = sciObj || toScientificNotation(number, precision);
        if (coefficient === 0) return "0";
        return `${coefficient} × 10^${exponent}`;
      } else if (format === "e-notation") {
        const { coefficient, exponent } = sciObj || toScientificNotation(number, precision);
        if (coefficient === 0) return "0";
        return `${coefficient}e${exponent}`;
      } else {
        return Number(number.toFixed(precision));
      }
    } catch (e) {
      throw new Error(`Formatting error: ${e.message}`);
    }
  };

  const performOperation = (numbers, operation, precision, format) => {
    try {
      let result,
        error = 0;
      const validNumbers = numbers.filter((n) => isFinite(n));
      if (validNumbers.length === 0) throw new Error("No valid numbers provided");

      if (operation === "convert") {
        return validNumbers.map((num) => {
          const sci = toScientificNotation(num, precision);
          return {
            input: num,
            output: formatNumber(num, format, precision, sci),
            sciObj: sci,
          };
        });
      } else if (operation === "decimal") {
        return validNumbers.map((num) => ({
          input: num,
          output: formatNumber(num, "decimal", precision),
          sciObj: null,
        }));
      } else {
        if (validNumbers.length < 2) throw new Error("At least two numbers required for arithmetic");
        let calc;
        if (operation === "add") {
          calc = validNumbers.reduce((a, b) => a + b, 0);
        } else if (operation === "subtract") {
          calc = validNumbers.reduce((a, b) => a - b);
        } else if (operation === "multiply") {
          calc = validNumbers.reduce((a, b) => a * b, 1);
        } else if (operation === "divide") {
          if (validNumbers.slice(1).includes(0)) throw new Error("Division by zero");
          calc = validNumbers.reduce((a, b) => a / b);
        } else {
          throw new Error("Invalid operation");
        }
        const sci = toScientificNotation(calc, precision);
        error = validNumbers.length > 1 ? Math.abs(calc - validNumbers[0]) : 0;
        return [
          {
            input: validNumbers,
            output: formatNumber(calc, format, precision, sci),
            sciObj: sci,
            error,
          },
        ];
      }
    } catch (e) {
      throw new Error(`Operation error: ${e.message}`);
    }
  };

  const calculate = async () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision);
      if (!Number.isInteger(precisionVal) || precisionVal <= 0)
        throw new Error("Precision must be a positive integer");

      let calcResults = [];
      const isBatch = batchFile || batchText;

      if (!isBatch) {
        if (!numbers.trim()) throw new Error("Numbers are required");
        const numArray = numbers.split(",").map((s) => parseInput(s));
        const result = performOperation(numArray, operation, precisionVal, format);
        calcResults.push({ operation, precision: precisionVal, format, numbers: numArray, results: result });
        displayResults(calcResults, false);
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
        displayResults(calcResults, true);
      }
    } catch (e) {
      console.error("Calculation error:", e);
      showError(e.message || "Invalid input");
    }
  };

  const processBatch = async (calculations, calcResults) => {
    for (const c of calculations) {
      try {
        const [number1, number2, op = operation, prec = precision, fmt = format] = c;
        const numbers = [parseInput(number1)];
        if (number2 && op !== "convert" && op !== "decimal") numbers.push(parseInput(number2));
        const precisionVal = parseInt(prec);
        if (!Number.isInteger(precisionVal) || precisionVal <= 0) throw new Error("Invalid precision");
        const result = performOperation(numbers, op, precisionVal, fmt);
        calcResults.push({ operation: op, precision: precisionVal, format: fmt, numbers, results: result });
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const displayResults = (calcResults, isBatch) => {
    let output = [];
    if (isBatch) {
      output.push(
        <table key="batch-results" className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Input</th>
              <th className="p-2">Operation</th>
              <th className="p-2">Precision</th>
              <th className="p-2">Output</th>
              <th className="p-2">Error</th>
            </tr>
          </thead>
          <tbody>
            {calcResults.flatMap((r) =>
              r.results.map((res, i) => {
                const input = Array.isArray(res.input) ? res.input.join(", ") : res.input;
                const error = res.error ? res.error.toFixed(4) : "N/A";
                return (
                  <tr key={`${r.operation}-${i}`}>
                    <td className="p-2">{input}</td>
                    <td className="p-2">{r.operation}</td>
                    <td className="p-2">{r.precision}</td>
                    <td className="p-2">{res.output}</td>
                    <td className="p-2">{error}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      );
      const outputs = calcResults
        .flatMap((r) => r.results.map((res) => res.output))
        .filter((v) => v !== "N/A");
      if (outputs.length > 0) {
        const frequency = {};
        outputs.forEach((v) => (frequency[v] = (frequency[v] || 0) + 1));
        output.push(
          <div key="frequency">
            <strong className="block mt-4">Output Frequency Table:</strong>
            <table className="w-full text-sm text-gray-600">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Output</th>
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
      const r = calcResults[0];
      output.push(
        <div key="single-result">
          <strong>
            Results ({r.operation}, Precision: {r.precision}, Format: {r.format}):
          </strong>
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Input</th>
                <th className="p-2">Output</th>
                <th className="p-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {r.results.map((res, i) => {
                const input = Array.isArray(res.input) ? res.input.join(", ") : res.input;
                const error = res.error ? res.error.toFixed(4) : "N/A";
                return (
                  <tr key={i}>
                    <td className="p-2">{input}</td>
                    <td className="p-2">{res.output}</td>
                    <td className="p-2">{error}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    let statsText = "";
    if (isBatch && calcResults.length > 1) {
      const values = calcResults
        .flatMap((r) => r.results.map((res) => (Array.isArray(res.input) ? res.input[0] : res.input)))
        .filter((v) => isFinite(v));
      if (values.length > 0) {
        const stats = {
          mean: window.math.mean(values),
          median: window.math.median(values),
          stdDev: window.math.std(values),
          min: Math.min(...values),
          max: Math.max(...values),
        };
        statsText = `
          <strong>Statistics (Input Values):</strong><br>
          Mean: ${stats.mean.toFixed(2)}<br>
          Median: ${stats.median.toFixed(2)}<br>
          Standard Deviation: ${stats.stdDev.toFixed(2)}<br>
          Min: ${stats.min}<br>
          Max: ${stats.max}
        `;
      }
    }

    setResults(output);
    setStatsContent(statsText);

    const params = isBatch
      ? `Batch: ${calcResults.length} calculations, Operation: ${calcResults[0].operation}`
      : `Numbers: ${calcResults[0].numbers.join(", ")}, Operation: ${calcResults[0].operation}, Precision: ${
          calcResults[0].precision
        }`;
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
    updateVisualizations(calcResults, isBatch);
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const values = statInput
        .split(",")
        .map((s) => parseInput(s))
        .filter((n) => isFinite(n));
      if (values.length === 0) throw new Error("Invalid value list");

      const stats = {
        mean: window.math.mean(values),
        median: window.math.median(values),
        stdDev: window.math.std(values),
        min: Math.min(...values),
        max: Math.max(...values),
      };
      const statsText = `
        Mean: ${stats.mean.toFixed(2)}<br>
        Median: ${stats.median.toFixed(2)}<br>
        Standard Deviation: ${stats.stdDev.toFixed(2)}<br>
        Min: ${stats.min}<br>
        Max: ${stats.max}
      `;
      const expression = `Stats(${values.join(", ")})`;

      setResults([
        <div key="stats">
          <strong>Statistical Analysis:</strong>
          <br dangerouslySetInnerHTML={{ __html: statsText }} />
        </div>,
      ]);
      setStatsContent("");
      saveToHistory(expression, statsText.replace(/<br>/g, "; "));
      updateBarChart(values, [], true);
    } catch (e) {
      console.error("Stats error:", e);
      showError("Invalid statistical input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const variationVal = parseInt(variation);
      const precisionVal = parseInt(precision);
      const numArray = numbers.split(",").map((s) => parseInput(s));

      if (!numArray.length) throw new Error("Numbers are required");
      if (isNaN(variationVal) || variationVal <= 0) throw new Error("Invalid variation");
      if (operation !== "convert" && operation !== "decimal")
        throw new Error("Sensitivity analysis requires convert or decimal operation");

      const sensResults = [];
      for (let v = Math.max(1, precisionVal - variationVal); v <= precisionVal + variationVal; v++) {
        try {
          const result = performOperation(numArray, operation, v, format);
          sensResults.push({
            precision: v,
            values: result.map((r) => r.output),
          });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      const resultText = sensResults
        .map((r) => `Precision ${r.precision}: ${r.values.join(", ")}`)
        .join("<br>");

      setResults([
        <div key="sensitivity">
          <strong>Sensitivity Analysis (Precision):</strong>
          <br dangerouslySetInnerHTML={{ __html: resultText }} />
        </div>,
      ]);
      setStatsContent("");
      saveToHistory(`Sensitivity (±${variationVal} Precision)`, resultText.replace(/<br>/g, "; "));
      updateSensitivityChart(sensResults);
    } catch (e) {
      console.error("Sensitivity error:", e);
      showError("Invalid sensitivity input: " + e.message);
    }
  };

  const updateVisualizations = (calcResults, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();

    if (
      !isBatch &&
      calcResults.length === 1 &&
      (calcResults[0].operation === "convert" || calcResults[0].operation === "decimal")
    ) {
      drawExponentVisualization(calcResults[0].results);
    } else {
      if (svgRef.current) {
        svgRef.current.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single conversion</text>';
      }
    }

    const inputValues = calcResults
      .flatMap((r) => r.results.map((res) => (Array.isArray(res.input) ? res.input[0] : res.input)))
      .filter((v) => isFinite(v));
    const outputValues = calcResults
      .flatMap((r) =>
        r.results.map((res) => {
          if (res.sciObj) return res.sciObj.coefficient * Math.pow(10, res.sciObj.exponent);
          return parseFloat(res.output) || 0;
        })
      )
      .filter((v) => isFinite(v));
    if (inputValues.length > 0) {
      updateBarChart(inputValues, outputValues, isBatch);
    }
  };

  const updateBarChart = (inputValues, outputValues, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current && inputValues.length > 0) {
      const labels = isBatch
        ? inputValues.map((_, i) => `Number ${i + 1}`)
        : results.length > 0
        ? results[0].props.children[0].props.children.map((_, i) => `Number ${i + 1}`)
        : [];
      barChartInstance.current = new window.Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Input",
              data: inputValues,
              backgroundColor: "#ef4444",
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
            {
              label: "Output",
              data: outputValues,
              backgroundColor: "#ef4444",
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Value (Log Scale)" }, type: "logarithmic" },
            x: { title: { display: true, text: "Numbers" } },
          },
          plugins: {
            title: { display: true, text: "Input vs Output Values" },
          },
        },
      });
    }
  };

  const updateSensitivityChart = (sensResults) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current && sensResults.length > 0) {
      const labels = sensResults.map((r) => `Precision ${r.precision}`);
      const datasets = sensResults[0].values.map((_, i) => ({
        label: `Number ${i + 1}`,
        data: sensResults.map((r) => {
          const val = r.values[i];
          return val.includes("e")
            ? parseFloat(val)
            : parseFloat(val.split(" × ")[0]) * Math.pow(10, parseInt(val.split("^")[1])) || 0;
        }),
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
            y: { title: { display: true, text: "Output Value" } },
            x: { title: { display: true, text: "Precision" } },
          },
          plugins: {
            title: { display: true, text: "Sensitivity Analysis" },
          },
        },
      });
    }
  };

  const drawExponentVisualization = (visResults) => {
    if (!svgRef.current) return;
    svgRef.current.innerHTML = "";
    const width = 500;
    const height = 150;
    svgRef.current.setAttribute("width", width);
    svgRef.current.setAttribute("height", height);

    try {
      const validResults = visResults.filter((r) => r.sciObj && isFinite(r.sciObj.exponent));
      if (validResults.length === 0) {
        console.warn("No valid exponents for visualization");
        svgRef.current.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">No valid exponents to visualize</text>';
        return;
      }

      const exponents = validResults.map((r) => r.sciObj.exponent);
      const maxExp = Math.max(...exponents, 0);
      const minExp = Math.min(...exponents, 0);
      let range = maxExp - minExp;
      if (range === 0) range = Math.max(1, Math.abs(maxExp) || 1);

      const xScale = (width - 40) / range;
      const ySpacing = height / (validResults.length + 1);

      validResults.forEach((res, i) => {
        const y = (i + 1) * ySpacing;
        const x = 20 + (res.sciObj.exponent - minExp) * xScale;
        const cappedX = Math.max(20, Math.min(width - 20, x));

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cappedX);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", "#ef4444");
        svgRef.current.appendChild(circle);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", 10);
        text.setAttribute("y", y - 10);
        text.setAttribute("fill", "#000");
        text.setAttribute("font-size", "12");
        text.textContent = `${res.input} → ${res.output}`;
        svgRef.current.appendChild(text);
      });

      const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
      axis.setAttribute("x1", 20);
      axis.setAttribute("y1", height - 20);
      axis.setAttribute("x2", width - 20);
      axis.setAttribute("y2", height - 20);
      axis.setAttribute("stroke", "#000");
      axis.setAttribute("stroke-width", "1");
      svgRef.current.appendChild(axis);

      const minLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      minLabel.setAttribute("x", 20);
      minLabel.setAttribute("y", height - 5);
      minLabel.setAttribute("fill", "#000");
      minLabel.setAttribute("font-size", "10");
      minLabel.textContent = minExp;
      svgRef.current.appendChild(minLabel);

      const maxLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      maxLabel.setAttribute("x", width - 30);
      maxLabel.setAttribute("y", height - 5);
      maxLabel.setAttribute("fill", "#000");
      maxLabel.setAttribute("font-size", "10");
      maxLabel.textContent = maxExp;
      svgRef.current.appendChild(maxLabel);
    } catch (e) {
      console.error("Visualization error:", e);
      svgRef.current.innerHTML =
        '<text x="10" y="50" fill="#000" font-size="14">Unable to render visualization: Invalid data</text>';
    }
  };

  const clearInputs = () => {
    setNumbers("");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setPrecision("3");
    clearMessages();
    setResults([]);
    setStatsContent("");
    if (svgRef.current) svgRef.current.innerHTML = "";
    if (barChartInstance.current) barChartInstance.current.destroy();
  };

  const saveCalculation = () => {
    showSuccess("Calculation saved to history");
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
    localStorage.setItem("sciNotationCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sci_notation_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sci_notation_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Scientific Notation Calculation History", 10, 10);
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
    doc.save("sci_notation_history.pdf");
  };

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">
            Advanced Scientific Notation Calculator
          </h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Operation
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select conversion or arithmetic operation.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                >
                  <option value="convert">Convert to Scientific Notation</option>
                  <option value="decimal">Convert to Decimal</option>
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                  <option value="multiply">Multiply</option>
                  <option value="divide">Divide</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Precision (Sig Figs)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Number of significant figures for output.
                  </span>
                </label>
                <input
                  type="number"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 3"
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value)}
                />
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
                  <option value="scientific">Scientific (1.23 × 10⁴)</option>
                  <option value="e-notation">E-Notation (1.23e4)</option>
                  <option value="decimal">Decimal</option>
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
                      Enter numbers (e.g., 1234,5.67e-2,-1.23e4).
                    </span>
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 1234,5.67e-2,-1.23e4"
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: number1,number2,operation,precision)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter numbers with operation and precision (e.g.,
                  1234,convert,3;5.67e-2,add,4).
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
                placeholder="e.g., 1234,convert,3;5.67e-2,add,4"
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
                  Analyze Values (comma-separated)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter values for analysis.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 1.23e4,5.67e-2"
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
                    Range of significant figures to test.
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
          {(results.length > 0 || statsContent) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div className="text-gray-600 mb-4">{results}</div>
              <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: statsContent }} />
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Exponent Visualization</h3>
                <svg ref={svgRef} className="w-full max-w-[500px] h-[150px] block mx-auto" />
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
