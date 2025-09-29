"use client";
import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function AdvancedPercentageCalculator() {
  const [phrase, setPhrase] = useState("percent_of");
  const [xValue, setXValue] = useState("");
  const [yValue, setYValue] = useState("");
  const [v1Diff, setV1Diff] = useState("");
  const [v2Diff, setV2Diff] = useState("");
  const [v1Change, setV1Change] = useState("");
  const [v2Change, setV2Change] = useState("");
  const [outputFormat, setOutputFormat] = useState("percent");
  const [precision, setPrecision] = useState("2");
  const [currency, setCurrency] = useState("none");
  const [batchInput, setBatchInput] = useState("");
  const [batchBase, setBatchBase] = useState("");
  const [sensitivityRange, setSensitivityRange] = useState("");
  const [sensitivityBase, setSensitivityBase] = useState("");
  const [statInput, setStatInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resultContent, setResultContent] = useState("");
  const [stepsContent, setStepsContent] = useState("");
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const lineChartInstance = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("percentageCalculationHistory") || "[]");
    setCalculationHistory(stored);
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

  const formatOutput = (value, format, precision, currency) => {
    let result;
    if (format === "decimal") {
      result = value.toFixed(precision);
    } else if (format === "fraction") {
      const frac = math.fraction(value / 100);
      result = `${frac.n}/${frac.d}`;
    } else {
      result = `${value.toFixed(precision)}%`;
    }
    if (currency !== "none" && !result.includes("%")) {
      result = currency === "USD" ? `$${result}` : `€${result}`;
    }
    return result;
  };

  const calculatePhrase = () => {
    clearMessages();
    try {
      const x = parseFloat(xValue);
      const y = parseFloat(yValue);
      if (isNaN(x) || (isNaN(y) && phrase !== "is_percent")) {
        throw new Error("Invalid input values");
      }

      let result,
        expression,
        steps = [];
      switch (phrase) {
        case "percent_of":
          result = (x / 100) * y;
          expression = `${x}% of ${y}`;
          steps.push(`(${x}/100) × ${y} = ${result}`);
          break;
        case "is_percent":
          result = (x / y) * 100;
          expression = `${x} is what percent of ${y}?`;
          steps.push(`(${x}/${y}) × 100 = ${result}%`);
          break;
        case "percent_what":
          result = x / (y / 100);
          expression = `${x} is ${y}% of what?`;
          steps.push(`${x} / (${y}/100) = ${result}`);
          break;
        case "increase":
          result = x * (1 + y / 100);
          expression = `Increase ${x} by ${y}%`;
          steps.push(`${x} × (1 + ${y}/100) = ${result}`);
          break;
        case "decrease":
          result = x * (1 - y / 100);
          expression = `Decrease ${x} by ${y}%`;
          steps.push(`${x} × (1 - ${y}/100) = ${result}`);
          break;
      }

      const formattedResult = formatOutput(result, outputFormat, parseInt(precision), currency);
      setResultContent(`Result: ${formattedResult}`);
      setStepsContent(`<strong>Steps:</strong><br>${steps.join("<br>")}`);
      saveToHistory(expression, formattedResult);
      updateVisualizations([{ value: result, label: expression }]);
    } catch (e) {
      showError(e.message || "Invalid input");
    }
  };

  const calculateDifference = () => {
    clearMessages();
    try {
      const v1 = parseFloat(v1Diff);
      const v2 = parseFloat(v2Diff);
      if (isNaN(v1) || isNaN(v2)) throw new Error("Invalid input values");
      if (v1 + v2 === 0) throw new Error("Average of values cannot be zero");

      const result = (Math.abs(v1 - v2) / ((v1 + v2) / 2)) * 100;
      const expression = `Difference between ${v1} and ${v2}`;
      const steps = [
        `|${v1} - ${v2}| = ${Math.abs(v1 - v2)}`,
        `(${v1} + ${v2})/2 = ${(v1 + v2) / 2}`,
        `(${Math.abs(v1 - v2)} / ${(v1 + v2) / 2}) × 100 = ${result}%`,
      ];

      const formattedResult = formatOutput(result, outputFormat, parseInt(precision), currency);
      setResultContent(`Percentage Difference: ${formattedResult}`);
      setStepsContent(`<strong>Steps:</strong><br>${steps.join("<br>")}`);
      saveToHistory(expression, formattedResult);
      updateVisualizations([
        { value: v1, label: "Value 1" },
        { value: v2, label: "Value 2" },
      ]);
    } catch (e) {
      showError(e.message || "Invalid input");
    }
  };

  const calculateChange = () => {
    clearMessages();
    try {
      const v1 = parseFloat(v1Change);
      const v2 = parseFloat(v2Change);
      if (isNaN(v1) || isNaN(v2)) throw new Error("Invalid input values");
      if (v1 === 0) throw new Error("Initial value cannot be zero");

      const result = ((v2 - v1) / Math.abs(v1)) * 100;
      const expression = `Change from ${v1} to ${v2}`;
      const steps = [
        `(${v2} - ${v1}) = ${v2 - v1}`,
        `|${v1}| = ${Math.abs(v1)}`,
        `(${v2 - v1} / ${Math.abs(v1)}) × 100 = ${result}%`,
      ];

      const formattedResult = formatOutput(result, outputFormat, parseInt(precision), currency);
      setResultContent(`Percentage Change: ${formattedResult}`);
      setStepsContent(`<strong>Steps:</strong><br>${steps.join("<br>")}`);
      saveToHistory(expression, formattedResult);
      updateVisualizations([
        { value: v1, label: "Initial" },
        { value: v2, label: "Final" },
      ]);
    } catch (e) {
      showError(e.message || "Invalid input");
    }
  };

  const calculateBatch = () => {
    clearMessages();
    try {
      const percentages = batchInput
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n));
      const base = parseFloat(batchBase);
      if (percentages.length === 0 || isNaN(base)) throw new Error("Invalid input values");

      const results = percentages.map((p) => ({
        percentage: p,
        result: (p / 100) * base,
      }));
      const formattedResults = results.map(
        (r) =>
          `${r.percentage}% of ${base} = ${formatOutput(
            r.result,
            outputFormat,
            parseInt(precision),
            currency
          )}`
      );
      const expression = `Batch: ${percentages.join(", ")}% of ${base}`;

      setResultContent(`Batch Results:<br>${formattedResults.join("<br>")}`);
      setStepsContent(
        `<strong>Steps:</strong><br>${results
          .map((r) => `(${r.percentage}/100) × ${base} = ${r.result}`)
          .join("<br>")}`
      );
      saveToHistory(expression, formattedResults.join("; "));
      updateVisualizations(results.map((r) => ({ value: r.result, label: `${r.percentage}%` })));
    } catch (e) {
      showError("Invalid batch input");
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const range = sensitivityRange.split("-").map(Number);
      const base = parseFloat(sensitivityBase);
      if (range.length !== 2 || isNaN(range[0]) || isNaN(range[1]) || isNaN(base)) {
        throw new Error("Invalid range or base value");
      }

      const [start, end] = range;
      const results = [];
      for (let p = start; p <= end; p += (end - start) / 10) {
        results.push({ percentage: p, result: (p / 100) * base });
      }
      const formattedResults = results.map(
        (r) =>
          `${r.percentage}% of ${base} = ${formatOutput(
            r.result,
            outputFormat,
            parseInt(precision),
            currency
          )}`
      );
      const expression = `Sensitivity: ${start}-${end}% of ${base}`;

      setResultContent(`Sensitivity Results:<br>${formattedResults.join("<br>")}`);
      setStepsContent(
        `<strong>Steps:</strong><br>${results
          .map((r) => `(${r.percentage}/100) × ${base} = ${r.result}`)
          .join("<br>")}`
      );
      saveToHistory(expression, formattedResults.join("; "));
      updateSensitivityChart(results);
    } catch (e) {
      showError("Invalid sensitivity input");
    }
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const percentages = statInput
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n));
      if (percentages.length === 0) throw new Error("Invalid percentage list");

      const mean = math.mean(percentages);
      const median = math.median(percentages);
      const result = `Mean: ${formatOutput(
        mean,
        outputFormat,
        parseInt(precision),
        currency
      )}, Median: ${formatOutput(median, outputFormat, parseInt(precision), currency)}`;
      const expression = `Stats(${percentages.join(", ")}%)`;

      setResultContent(result);
      setStepsContent(
        `<strong>Steps:</strong><br>Mean: (${percentages.join(" + ")}) / ${
          percentages.length
        } = ${mean}<br>Median: ${median}`
      );
      saveToHistory(expression, result);
      updateVisualizations(percentages.map((p, i) => ({ value: p, label: `Value ${i + 1}` })));
    } catch (e) {
      showError("Invalid statistical input");
    }
  };

  const updateVisualizations = (data) => {
    if (pieChartInstance.current) pieChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();

    if (pieChartRef.current) {
      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => Math.abs(d.value)),
              backgroundColor: ["#ef4444", "#dc2626", "#b91c1c", "#991b1b"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: "Percentage Proportions" },
            legend: { position: "top" },
          },
        },
      });
    }

    if (barChartRef.current) {
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            {
              label: "Value",
              data: data.map((d) => d.value),
              backgroundColor: "#ef4444",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Value" }, beginAtZero: true },
          },
          plugins: {
            title: { display: true, text: "Percentage Comparison" },
          },
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
          labels: results.map((r) => `${r.percentage}%`),
          datasets: [
            {
              label: "Result",
              data: results.map((r) => r.result),
              borderColor: "#ef4444",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Percentage" } },
            y: { title: { display: true, text: "Result" } },
          },
          plugins: {
            title: { display: true, text: "Sensitivity Analysis" },
          },
        },
      });
    }
  };

  const saveToHistory = (expression, result) => {
    const newHistory = [...calculationHistory, { date: new Date().toLocaleString(), expression, result }];
    setCalculationHistory(newHistory);
    localStorage.setItem("percentageCalculationHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Expression", "Result"],
      ...calculationHistory.map((h) => [h.date, h.expression, h.result]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    downloadFile("percentage_calculator_history.csv", "text/csv", csvContent);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Percentage Calculator History", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    calculationHistory.forEach((h) => {
      doc.text(`Date: ${h.date}, Expr: ${h.expression}, Result: ${h.result}`, 10, y);
      y += 10;
    });
    doc.text("Note: Visualizations and steps are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("percentage_calculator_history.pdf");
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
      if (e.key === "Enter") {
        const activeElement = e.target;
        if (activeElement.closest("#common-phrase")) calculatePhrase();
        else if (activeElement.closest("#difference")) calculateDifference();
        else if (activeElement.closest("#change")) calculateChange();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [xValue, yValue, v1Diff, v2Diff, v1Change, v2Change, phrase]);

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Percentage Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Percentage Calculator (Common Phrases)</h2>
          <div className="mb-6" id="common-phrase">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Phrase
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Choose a common percentage question.
                </span>
              </span>
            </label>
            <select
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="percent_of">What is X% of Y?</option>
              <option value="is_percent">X is what percent of Y?</option>
              <option value="percent_what">X is Y% of what number?</option>
              <option value="increase">Increase X by Y%</option>
              <option value="decrease">Decrease X by Y%</option>
            </select>
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">X</label>
                <input
                  type="number"
                  step="any"
                  value={xValue}
                  onChange={(e) => setXValue(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 25"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">Y</label>
                <input
                  type="number"
                  step="any"
                  value={yValue}
                  onChange={(e) => setYValue(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 100"
                />
              </div>
            </div>
            <button onClick={calculatePhrase} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Calculate
            </button>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Percentage Difference Calculator</h2>
          <div className="mb-6" id="difference">
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Value 1
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter the first value.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={v1Diff}
                  onChange={(e) => setV1Diff(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Value 2
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter the second value.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={v2Diff}
                  onChange={(e) => setV2Diff(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 120"
                />
              </div>
            </div>
            <button onClick={calculateDifference} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Calculate
            </button>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Percentage Change Calculator</h2>
          <div className="mb-6" id="change">
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Initial Value
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter the initial value.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={v1Change}
                  onChange={(e) => setV1Change(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Final Value
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter the final value.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={v2Change}
                  onChange={(e) => setV2Change(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 120"
                />
              </div>
            </div>
            <button onClick={calculateChange} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Calculate
            </button>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Settings</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Output Format
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Choose how results are displayed.
                  </span>
                </span>
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="p-3 border rounded-lg w-full"
              >
                <option value="percent">Percentage (e.g., 25%)</option>
                <option value="decimal">Decimal (e.g., 0.25)</option>
                <option value="fraction">Fraction (e.g., 1/4)</option>
              </select>
            </div>
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
                <option value="2">2 Decimals</option>
                <option value="4">4 Decimals</option>
                <option value="6">6 Decimals</option>
                <option value="8">8 Decimals</option>
                <option value="10">10 Decimals</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Currency
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Format results with currency.
                  </span>
                </span>
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="p-3 border rounded-lg w-full"
              >
                <option value="none">None</option>
                <option value="USD">$ (USD)</option>
                <option value="EUR">€ (EUR)</option>
              </select>
            </div>
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Calculations</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Batch Percentages (e.g., 10,20,30)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter percentages for batch calculation.
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  className="p-3 border rounded-lg w-full mb-2"
                  placeholder="10,20,30"
                />
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Base Value
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Base value for batch percentages.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={batchBase}
                  onChange={(e) => setBatchBase(e.target.value)}
                  className="p-3 border rounded-lg w-full mb-2"
                  placeholder="100"
                />
                <button onClick={calculateBatch} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Calculate Batch
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Sensitivity Analysis (Percent Range, e.g., 10-50)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter percentage range (start-end).
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  value={sensitivityRange}
                  onChange={(e) => setSensitivityRange(e.target.value)}
                  className="p-3 border rounded-lg w-full mb-2"
                  placeholder="10-50"
                />
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Base Value
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Base value for sensitivity analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={sensitivityBase}
                  onChange={(e) => setSensitivityBase(e.target.value)}
                  className="p-3 border rounded-lg w-full mb-2"
                  placeholder="100"
                />
                <button onClick={calculateSensitivity} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Analyze Sensitivity
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Percentage List (e.g., 25,50,75)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter percentages for statistical analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                  className="p-3 border rounded-lg w-full mb-2"
                  placeholder="25,50,75"
                />
                <button onClick={calculateStats} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Calculate Statistics
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Percentages
          </button>

          {(resultContent || stepsContent) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} className="text-gray-600 mb-4" />
              <div dangerouslySetInnerHTML={{ __html: stepsContent }} className="text-gray-600 mb-4" />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Percentage Proportions</h3>
                <canvas ref={pieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Percentage Comparison</h3>
                <canvas ref={barChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Sensitivity Analysis</h3>
                <canvas ref={lineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 max-h-[200px] overflow-y-auto">
                <h3 className="text-md font-medium text-red-900">Calculation History</h3>
                <table className="w-full text-sm text-gray-600 border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Expression</th>
                      <th className="p-2 border">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationHistory.map((h) => (
                      <tr key={h.date}>
                        <td className="p-2 border">{h.date}</td>
                        <td className="p-2 border">{h.expression}</td>
                        <td className="p-2 border">{h.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4">
                <button onClick={exportCSV} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Export CSV
                </button>
                <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Export PDF
                </button>
              </div>
            </div>
          )}

          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-[600px] w-[90%] relative">
                <span
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Understanding Percentages</h2>
                <p className="mb-4 text-gray-600">
                  Percentages represent a part per hundred, often used in finance, statistics, and everyday
                  calculations.
                </p>
                <h3 className="text-md font-medium text-gray-700 mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>
                    <strong>Percentage:</strong> A ratio expressed as a fraction of 100 (e.g., 25% = 25/100).
                  </li>
                  <li>
                    <strong>Common Phrases:</strong> Questions like "What is X% of Y?" or "X is Y% of what
                    number?".
                  </li>
                  <li>
                    <strong>Percentage Difference:</strong> Measures relative difference between two values.
                  </li>
                  <li>
                    <strong>Percentage Change:</strong> Measures change from initial to final value.
                  </li>
                </ul>
                <h3 className="text-md font-medium text-gray-700 mb-2">Formulas</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>
                    <strong>X% of Y:</strong> (X/100) × Y
                  </li>
                  <li>
                    <strong>X is what percent of Y?:</strong> (X/Y) × 100%
                  </li>
                  <li>
                    <strong>X is Y% of what?:</strong> X / (Y/100)
                  </li>
                  <li>
                    <strong>Percentage Difference:</strong> ((|V1 - V2|) / ((V1 + V2)/2)) × 100%
                  </li>
                  <li>
                    <strong>Percentage Change:</strong> ((V2 - V1) / |V1|) × 100%
                  </li>
                </ul>
                <h3 className="text-md font-medium text-gray-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Ensure non-zero denominators to avoid errors.</li>
                  <li>Use batch calculations for multiple percentages.</li>
                  <li>Visualizations help understand proportions and trends.</li>
                </ul>
                <h3 className="text-md font-medium text-gray-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>
                    <a
                      href="https://www.mathsisfun.com/percentage.html"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Math Is Fun: Percentages
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.khanacademy.org/math/pre-algebra/pre-algebra-ratios-rates/pre-algebra-percent-problems"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Khan Academy: Percentages
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
