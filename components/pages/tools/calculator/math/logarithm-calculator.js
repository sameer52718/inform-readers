"use client";
import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function LogarithmCalculator() {
  const [calcType, setCalcType] = useState("basic");
  const [precision, setPrecision] = useState("2");
  const [value, setValue] = useState("");
  const [base, setBase] = useState("");
  const [exponent, setExponent] = useState("");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [variation, setVariation] = useState("");
  const [compareText, setCompareText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resultContent, setResultContent] = useState("");
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lastResults, setLastResults] = useState([]);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const svgRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("logCalcHistory")) || [];
    setCalculationHistory(
      savedHistory.filter(
        (entry) =>
          entry &&
          typeof entry.date === "string" &&
          typeof entry.params === "string" &&
          typeof entry.result === "string"
      )
    );
  }, []);

  const calculateLogarithm = (calcType, params, precision) => {
    let result = null,
      formula = "";
    if (calcType === "basic") {
      const { value, base } = params;
      if (isNaN(value) || isNaN(base)) throw new Error("Value and base are required");
      if (value <= 0) throw new Error("Value must be positive");
      if (base <= 0 || base === 1) throw new Error("Base must be positive and not 1");
      result = math.log(value, base);
      formula = `log_${base}(${value}) = ${result.toFixed(precision)}`;
    } else if (calcType === "natural") {
      const { value } = params;
      if (isNaN(value)) throw new Error("Value is required");
      if (value <= 0) throw new Error("Value must be positive");
      result = math.log(value);
      formula = `ln(${value}) = ${result.toFixed(precision)}`;
    } else if (calcType === "base10") {
      const { value } = params;
      if (isNaN(value)) throw new Error("Value is required");
      if (value <= 0) throw new Error("Value must be positive");
      result = math.log10(value);
      formula = `log_10(${value}) = ${result.toFixed(precision)}`;
    } else if (calcType === "inverse") {
      const { exponent, base } = params;
      if (isNaN(exponent) || isNaN(base)) throw new Error("Exponent and base are required");
      if (base <= 0 || base === 1) throw new Error("Base must be positive and not 1");
      result = math.pow(base, exponent);
      formula = `${base}^${exponent} = ${result.toFixed(precision)}`;
    } else {
      throw new Error("Invalid calculation type");
    }
    return {
      result: result ? Number(result.toFixed(precision)) : null,
      formula,
      visualizationData: generateVisualizationData(calcType, params),
    };
  };

  const generateVisualizationData = (calcType, params) => {
    const data = [];
    if (calcType === "basic") {
      const { base } = params;
      for (let x = 0.1; x <= 100; x += 0.5) {
        data.push({ x, y: math.log(x, base) });
      }
    } else if (calcType === "natural") {
      for (let x = 0.1; x <= 100; x += 0.5) {
        data.push({ x, y: math.log(x) });
      }
    } else if (calcType === "base10") {
      for (let x = 0.1; x <= 100; x += 0.5) {
        data.push({ x, y: math.log10(x) });
      }
    } else if (calcType === "inverse") {
      const { base } = params;
      for (let x = -2; x <= 2; x += 0.1) {
        data.push({ x, y: math.pow(base, x) });
      }
    }
    return data;
  };

  const processBatch = async (datasets, results, calcType, precision) => {
    for (const dataset of datasets) {
      try {
        const params = dataset.split(",").map((s) => s.trim());
        if (params.some((p) => p === "")) throw new Error("Dataset contains empty values");
        let parsedParams = {};
        if (calcType === "basic" || calcType === "inverse") {
          if (params.length !== 2)
            throw new Error(
              `${calcType === "basic" ? "Basic logarithm" : "Inverse logarithm"} requires exactly two values`
            );
          parsedParams =
            calcType === "basic"
              ? { value: parseFloat(params[0]), base: parseFloat(params[1]) }
              : { exponent: parseFloat(params[0]), base: parseFloat(params[1]) };
        } else {
          if (params.length !== 1)
            throw new Error(`${calcType === "natural" ? "Natural" : "Base-10"} logarithm requires one value`);
          parsedParams = { value: parseFloat(params[0]) };
        }
        if (Object.values(parsedParams).some((v) => isNaN(v))) throw new Error("Invalid batch parameters");
        const result = calculateLogarithm(calcType, parsedParams, precision);
        results.push({ calcType, params: parsedParams, result });
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const calculate = async () => {
    clearMessages();
    clearVisualizations();
    try {
      let results = [];
      let isBatch = batchFile || batchText;
      const parsedPrecision = parseInt(precision) || 2;

      if (!isBatch) {
        let params = {};
        if (calcType === "basic") {
          params = { value: parseFloat(value), base: parseFloat(base) };
          if (isNaN(params.value) || isNaN(params.base)) throw new Error("Value and base are required");
        } else if (calcType === "natural" || calcType === "base10") {
          params = { value: parseFloat(value) };
          if (isNaN(params.value)) throw new Error("Value is required");
        } else if (calcType === "inverse") {
          params = { exponent: parseFloat(exponent), base: parseFloat(base) };
          if (isNaN(params.exponent) || isNaN(params.base)) throw new Error("Exponent and base are required");
        }
        const result = calculateLogarithm(calcType, params, parsedPrecision);
        results.push({ calcType, params, result });
      } else {
        let datasets = [];
        if (batchFile) {
          datasets = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = e.target.result;
              if (!text.trim()) reject(new Error("Empty file provided"));
              resolve(
                text
                  .split("\n")
                  .map((line) => line.trim())
                  .filter((line) => line && line.includes(","))
              );
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          datasets = batchText
            .split(";")
            .map((s) => s.trim())
            .filter((s) => s && s.includes(","));
          if (datasets.length === 0) throw new Error("No valid datasets provided in batch text");
        }
        await processBatch(datasets, results, calcType, parsedPrecision);
        if (results.length === 0) throw new Error("No valid datasets found in batch input");
      }

      displayResults(results, isBatch);
      setSuccess("Calculation completed successfully");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError(e.message || "An unexpected error occurred during calculation");
      setTimeout(() => setError(""), 3000);
    }
  };

  const displayResults = (results, isBatch) => {
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Parameters</th><th class="p-2">Result</th></tr></thead><tbody>';
      results.forEach((r) => {
        const params =
          r.calcType === "basic"
            ? `a=${r.params.value}, b=${r.params.base}`
            : r.calcType === "inverse"
            ? `x=${r.params.exponent}, b=${r.params.base}`
            : `a=${r.params.value}`;
        output += `<tr><td class="p-2">${params}</td><td class="p-2">Result: ${r.result.result}<br>Formula: ${r.result.formula}</td></tr>`;
      });
      output += "</tbody></table>";
    } else {
      const r = results[0];
      output = `<strong>Results (Type: ${r.calcType}, Precision: ${precision}):</strong><br>`;
      output += `Result: ${r.result.result}<br>`;
      output += `Formula: ${r.result.formula}`;
    }
    setResultContent(output);
    const params = isBatch
      ? `Batch: ${results.length} calculations, Type: ${results[0].calcType}`
      : results[0].calcType === "basic"
      ? `a=${results[0].params.value}, b=${results[0].params.base}`
      : results[0].calcType === "inverse"
      ? `x=${results[0].params.exponent}, b=${results[0].params.base}`
      : `a=${results[0].params.value}`;
    saveToHistory(params, output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "...");
    setLastResults(results);
    updateVisualizations(results, isBatch);
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const parsedPrecision = parseInt(precision);
      const parsedVariation = parseFloat(variation);
      if (isNaN(parsedPrecision) || parsedPrecision < 0)
        throw new Error("Precision must be a non-negative integer");
      if (isNaN(parsedVariation)) throw new Error("Variation value is required");

      let params = {};
      if (calcType === "basic") {
        params = { value: parseFloat(value), base: parseFloat(base) };
        if (isNaN(params.value) || isNaN(params.base)) throw new Error("Value and base are required");
      } else if (calcType === "natural" || calcType === "base10") {
        params = { value: parseFloat(value) };
        if (isNaN(params.value)) throw new Error("Value is required");
      } else if (calcType === "inverse") {
        params = { exponent: parseFloat(exponent), base: parseFloat(base) };
        if (isNaN(params.exponent) || isNaN(params.base)) throw new Error("Exponent and base are required");
      }

      const results = [];
      const variations = [
        { label: "Original", params },
        calcType === "basic"
          ? { label: "Value + Variation", params: { ...params, value: params.value + parsedVariation } }
          : calcType === "inverse"
          ? {
              label: "Exponent + Variation",
              params: { ...params, exponent: params.exponent + parsedVariation },
            }
          : { label: "Value + Variation", params: { ...params, value: params.value + parsedVariation } },
        calcType === "basic"
          ? { label: "Base + Variation", params: { ...params, base: params.base + parsedVariation } }
          : calcType === "inverse"
          ? { label: "Base + Variation", params: { ...params, base: params.base + parsedVariation } }
          : { label: "No Base Variation", params },
      ];

      for (const v of variations) {
        try {
          const result = calculateLogarithm(calcType, v.params, parsedPrecision);
          results.push({ ...v, result });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      let output = `<strong>Sensitivity Analysis (Variation: ${parsedVariation}):</strong><br>`;
      output += results
        .map((r) => `${r.label}:<br>` + `Result: ${r.result.result}<br>` + `Formula: ${r.result.formula}`)
        .join("<br><br>");
      setResultContent(output);
      saveToHistory(`Sensitivity (Variation: ${parsedVariation})`, output.replace(/<br>/g, "; "));
      updateSensitivityChart(results);
      setSuccess("Sensitivity analysis completed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError(e.message || "Failed to compute sensitivity analysis");
      setTimeout(() => setError(""), 3000);
    }
  };

  const compareExpressions = () => {
    clearMessages();
    try {
      const parsedPrecision = parseInt(precision);
      if (!compareText) throw new Error("Comparison input is required");
      if (isNaN(parsedPrecision) || parsedPrecision < 0)
        throw new Error("Precision must be a non-negative integer");

      const datasets = compareText
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s);
      if (datasets.length === 0) throw new Error("No valid datasets provided");

      const results = [];
      for (const dataset of datasets) {
        try {
          const params = dataset.split(",").map((s) => s.trim());
          let parsedParams = {};
          if (calcType === "basic" || calcType === "inverse") {
            if (params.length !== 2)
              throw new Error(
                `${calcType === "basic" ? "Basic logarithm" : "Inverse logarithm"} requires two values`
              );
            parsedParams =
              calcType === "basic"
                ? { value: parseFloat(params[0]), base: parseFloat(params[1]) }
                : { exponent: parseFloat(params[0]), base: parseFloat(params[1]) };
          } else {
            if (params.length !== 1)
              throw new Error(
                `${calcType === "natural" ? "Natural" : "Base-10"} logarithm requires one value`
              );
            parsedParams = { value: parseFloat(params[0]) };
          }
          if (Object.values(parsedParams).some((v) => isNaN(v)))
            throw new Error("Invalid comparison parameters");
          const result = calculateLogarithm(calcType, parsedParams, parsedPrecision);
          results.push({ calcType, params: parsedParams, result, dataset });
        } catch (e) {
          console.warn(`Skipping invalid comparison entry: ${e.message}`);
        }
      }

      if (results.length === 0) throw new Error("No valid expressions to compare");

      let output = `<strong>Expression Comparison:</strong><br>`;
      output +=
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Parameters</th><th class="p-2">Result</th></tr></thead><tbody>';
      results.forEach((r) => {
        const params =
          r.calcType === "basic"
            ? `a=${r.params.value}, b=${r.params.base}`
            : r.calcType === "inverse"
            ? `x=${r.params.exponent}, b=${r.params.base}`
            : `a=${r.params.value}`;
        output += `<tr><td class="p-2">${params}</td><td class="p-2">Result: ${r.result.result}<br>Formula: ${r.result.formula}</td></tr>`;
      });
      output += "</tbody></table>";
      setResultContent(output);
      saveToHistory(
        `Comparison: ${results.length} expressions`,
        output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "..."
      );
      updateComparisonChart(results);
      setSuccess("Comparison completed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError(e.message || "Failed to compare expressions");
      setTimeout(() => setError(""), 3000);
    }
  };

  const updateVisualizations = (results, isBatch) => {
    clearVisualizations();
    if (!isBatch && results.length === 1 && results[0].result.visualizationData.length > 0) {
      drawLogVisualization(results[0].result.visualizationData);
    } else if (svgRef.current) {
      svgRef.current.innerHTML =
        '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single calculation</text>';
    }
    updateLineChart(results);
    updateBarChart(results);
  };

  const drawLogVisualization = (data) => {
    if (!svgRef.current || !data || data.length === 0) {
      if (svgRef.current)
        svgRef.current.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">Unable to render visualization</text>';
      return;
    }
    const width = 500;
    const height = 200;
    svgRef.current.setAttribute("width", width);
    svgRef.current.setAttribute("height", height);

    const xMin = Math.min(...data.map((d) => d.x));
    const xMax = Math.max(...data.map((d) => d.x));
    const yMin = Math.min(...data.map((d) => d.y));
    const yMax = Math.max(...data.map((d) => d.y));
    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;
    const scaleX = (width - 60) / xRange;
    const scaleY = (height - 60) / yRange;
    const offsetX = 30;
    const offsetY = height - 30;

    const pathData = data
      .map(
        (point, i) =>
          `${i === 0 ? "M" : "L"} ${((point.x - xMin) * scaleX + offsetX).toFixed(2)},${(
            offsetY -
            (point.y - yMin) * scaleY
          ).toFixed(2)}`
      )
      .join(" ");
    svgRef.current.innerHTML = `
      <path d="${pathData}" fill="none" stroke="#dc2626" stroke-width="2" />
      ${data
        .map((point, i) =>
          i % 20 === 0
            ? `
        <circle cx="${(point.x - xMin) * scaleX + offsetX}" cy="${
                offsetY - (point.y - yMin) * scaleY
              }" r="4" fill="#ef4444" />
      `
            : ""
        )
        .join("")}
    `;
  };

  const updateLineChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (!lineChartRef.current || !results.some((r) => r.result.visualizationData.length > 0)) return;
    const datasets = results.map((r, i) => ({
      label: `Calculation ${i + 1}`,
      data: r.result.visualizationData.map((d) => d.y),
      borderColor: ["#dc2626", "#10b981", "#ef4444"][i % 3],
      fill: false,
    }));
    lineChartInstance.current = new Chart(lineChartRef.current, {
      type: "line",
      data: {
        labels: results[0].result.visualizationData.map((d) => d.x.toFixed(1)),
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Value" } },
          x: { title: { display: true, text: "Input" } },
        },
        plugins: { title: { display: true, text: "Function Progression" } },
      },
    });
  };

  const updateBarChart = (results) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (!barChartRef.current) return;
    const values = results.map((r) => r.result.result).filter((v) => v !== null);
    if (values.length === 0) return;
    const freq = {};
    values.forEach((v) => {
      const rounded = Math.round(v * 100) / 100;
      freq[rounded] = (freq[rounded] || 0) + 1;
    });
    const labels = Object.keys(freq).sort((a, b) => a - b);
    const data = labels.map((l) => freq[l]);
    barChartInstance.current = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Frequency",
            data,
            backgroundColor: "#dc2626",
            borderColor: "#b91c1c",
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
        plugins: { title: { display: true, text: "Result Distribution" } },
      },
    });
  };

  const updateSensitivityChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (!lineChartRef.current || !results.some((r) => r.result.visualizationData.length > 0)) return;
    const datasets = results.map((r, i) => ({
      label: r.label,
      data: r.result.visualizationData.map((d) => d.y),
      borderColor: ["#dc2626", "#10b981", "#ef4444"][i % 3],
      fill: false,
    }));
    lineChartInstance.current = new Chart(lineChartRef.current, {
      type: "line",
      data: {
        labels: results[0].result.visualizationData.map((d) => d.x.toFixed(1)),
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Value" } },
          x: { title: { display: true, text: "Input" } },
        },
        plugins: { title: { display: true, text: "Sensitivity Analysis" } },
      },
    });
  };

  const updateComparisonChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (!lineChartRef.current || !results.some((r) => r.result.visualizationData.length > 0)) return;
    const datasets = results.map((r, i) => ({
      label: r.dataset,
      data: r.result.visualizationData.map((d) => d.y),
      borderColor: ["#dc2626", "#10b981", "#ef4444", "#f59e0b", "#6b7280"][i % 5],
      fill: false,
    }));
    lineChartInstance.current = new Chart(lineChartRef.current, {
      type: "line",
      data: {
        labels: results[0].result.visualizationData.map((d) => d.x.toFixed(1)),
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Value" } },
          x: { title: { display: true, text: "Input" } },
        },
        plugins: { title: { display: true, text: "Expression Comparison" } },
      },
    });
  };

  const clearInputs = () => {
    setValue("");
    setBase("");
    setExponent("");
    setBatchText("");
    setBatchFile(null);
    setVariation("");
    setCompareText("");
    setPrecision("2");
    clearMessages();
    clearVisualizations();
    setResultContent("");
    setSuccess("Inputs cleared");
    setTimeout(() => setSuccess(""), 2000);
  };

  const clearVisualizations = () => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (svgRef.current) svgRef.current.innerHTML = "";
    lineChartInstance.current = null;
    barChartInstance.current = null;
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const saveCalculation = () => {
    if (!resultContent) {
      setError("No valid calculation to save");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setSuccess("Calculation saved to history");
    setTimeout(() => setSuccess(""), 2000);
  };

  const saveToHistory = (params, result) => {
    const entry = {
      date: new Date().toLocaleString(),
      params,
      result,
    };
    const updatedHistory = [...calculationHistory, entry];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("logCalcHistory", JSON.stringify(updatedHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.params}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("log_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("log_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Logarithm Calculation History", 10, 10);
    let y = 20;
    calculationHistory.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Parameters: ${entry.params}`, 10, y + 10);
      doc.text(`Result: ${entry.result}`, 10, y + 20);
      y += 40;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("log_history.pdf");
  };

  const downloadFile = (filename, type, content) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Logarithm Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Calculation Type
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Select the type of logarithm calculation.
                    </span>
                  </span>
                </label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="basic">Basic Logarithm (log_b(a))</option>
                  <option value="natural">Natural Logarithm (ln)</option>
                  <option value="base10">Base-10 Logarithm (log10)</option>
                  <option value="inverse">Inverse Logarithm (b^x)</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Precision (Decimal Places)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Number of decimal places for output.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value)}
                  placeholder="e.g., 2"
                  className="p-3 border rounded-lg w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Parameters</h3>
              <div className="flex flex-wrap gap-4">
                {(calcType === "basic" || calcType === "natural" || calcType === "base10") && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Value (a)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          The argument of the logarithm.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="e.g., 100"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                )}
                {(calcType === "basic" || calcType === "inverse") && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Base (b)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Base of the {calcType === "basic" ? "logarithm" : "inverse logarithm"}.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={base}
                      onChange={(e) => setBase(e.target.value)}
                      placeholder="e.g., 10"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                )}
                {calcType === "inverse" && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Exponent (x)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          The exponent for inverse logarithm.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={exponent}
                      onChange={(e) => setExponent(e.target.value)}
                      placeholder="e.g., 2"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV: a,b;...)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Upload CSV or enter pairs (e.g., 100,10;8,2).
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
                rows="4"
                placeholder="e.g., 100,10;8,2"
                className="p-3 border rounded-lg w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button onClick={calculate} className="bg-red-500 text-white px-6 py-3 rounded-lg">
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
              {showAdvanced ? "Hide" : "Show"} Advanced Features
            </button>
          </div>
          {showAdvanced && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Variation Value
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Value to vary input or base for sensitivity analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                  placeholder="e.g., 1"
                  className="p-3 border rounded-lg w-full"
                />
                <button
                  onClick={calculateSensitivity}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Analyze Sensitivity
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Compare Expressions (CSV: a,b;...)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter expressions to compare (e.g., 100,10;8,2).
                    </span>
                  </span>
                </label>
                <textarea
                  value={compareText}
                  onChange={(e) => setCompareText(e.target.value)}
                  rows="4"
                  placeholder="e.g., 100,10;8,2"
                  className="p-3 border rounded-lg w-full"
                />
                <button
                  onClick={compareExpressions}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Compare Expressions
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Logarithms
          </button>

          {resultContent && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Logarithm Curve</h3>
                <svg ref={svgRef} className="w-full max-w-[500px] h-[200px] block mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Function Progression</h3>
                <canvas ref={lineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Result Distribution</h3>
                <canvas ref={barChartRef} className="max-h-80" />
              </div>
              {calculationHistory.length > 0 && (
                <div className="mt-6 max-h-[200px] overflow-y-auto">
                  <h3 className="text-md font-medium text-red-900">Calculation History</h3>
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">Date</th>
                        <th className="p-2">Parameters</th>
                        <th className="p-2">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationHistory.map((entry, index) => (
                        <tr key={index}>
                          <td className="p-2">{entry.date}</td>
                          <td className="p-2">{entry.params}</td>
                          <td className="p-2">{entry.result}</td>
                        </tr>
                      ))}
                    </tbody>
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
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 rounded-lg max-w-[600px] w-full relative">
                <span
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Understanding Logarithms</h2>
                <p className="text-gray-600 mb-4">
                  Logarithms are the inverse of exponentiation, used to solve for exponents in exponential
                  equations.
                </p>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Basic Logarithm:</strong> log_b(a) = x means b^x = a (e.g., log_10(100) = 2).
                  </li>
                  <li>
                    <strong>Natural Logarithm:</strong> ln(a) = log_e(a), where e ≈ 2.718.
                  </li>
                  <li>
                    <strong>Base-10 Logarithm:</strong> log_10(a), common in scientific calculations.
                  </li>
                  <li>
                    <strong>Inverse Logarithm:</strong> b^log_b(a) = a.
                  </li>
                  <li>
                    <strong>Properties:</strong>
                    <ul className="list-circle pl-5">
                      <li>Product: log_b(xy) = log_b(x) + log_b(y)</li>
                      <li>Quotient: log_b(x/y) = log_b(x) - log_b(y)</li>
                      <li>Power: log_b(x^n) = n log_b(x)</li>
                      <li>Change of Base: log_b(a) = log_c(a) / log_c(b)</li>
                    </ul>
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Applications</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Science:</strong> Measuring pH, sound intensity, earthquake magnitude.
                  </li>
                  <li>
                    <strong>Computing:</strong> Algorithm complexity (e.g., O(log n)).
                  </li>
                  <li>
                    <strong>Finance:</strong> Calculating compound interest rates.
                  </li>
                  <li>
                    <strong>Data Analysis:</strong> Log scales for visualization, normalizing data.
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>Ensure the value is positive and the base is positive and not 1.</li>
                  <li>Use batch input for multiple calculations (e.g., "100,10;8,2").</li>
                  <li>Adjust precision for desired decimal places.</li>
                  <li>Explore sensitivity analysis to understand parameter impacts.</li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <a
                      href="https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:logs"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Khan Academy: Logarithms
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.mathsisfun.com/algebra/logarithms.html"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Math Is Fun: Logarithms
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
