"use client";
import { useState, useEffect, useRef } from "react";
import { evaluate, log, log10, abs, median, std, max, mean, min, variance, quantileSeq } from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function AdvancedStatsCalculator() {
  const [calcType, setCalcType] = useState("basic");
  const [precision, setPrecision] = useState(2);
  const [dataInput, setDataInput] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [batchText, setBatchText] = useState("");
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resultContent, setResultContent] = useState("");
  const [statsContent, setStatsContent] = useState("");
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const histogramChartRef = useRef(null);
  const boxplotChartRef = useRef(null);
  const barChartRef = useRef(null);
  const histogramChartInstance = useRef(null);
  const boxplotChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const [lastResults, setLastResults] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("statCalcHistory") || "[]").filter(
      (entry) =>
        entry &&
        typeof entry.date === "string" &&
        typeof entry.params === "string" &&
        typeof entry.result === "string"
    );
    setCalculationHistory(savedHistory);
  }, []);

  const parseInput = (input) => {
    try {
      if (!input.trim()) throw new Error("Input cannot be empty");
      const value = evaluate(input);
      if (isNaN(value) || !isFinite(value)) throw new Error("Invalid numerical value");
      return value;
    } catch (e) {
      throw new Error("Invalid input: " + e.message);
    }
  };

  const calculateParameters = (data, calcType, precision) => {
    let results = {};
    data = data.map((d) => parseInput(d)).filter((d) => !isNaN(d));
    if (data.length === 0) throw new Error("No valid data provided");

    try {
      if (calcType === "basic" || calcType === "all") {
        results.mean = mean(data);
        results.median = median(data);
        const freq = {};
        data.forEach((d) => (freq[d] = (freq[d] || 0) + 1));
        const maxFreq = Math.max(...Object.values(freq));
        results.mode = Object.keys(freq)
          .filter((k) => freq[k] === maxFreq)
          .map(Number);
        if (results.mode.length === data.length) results.mode = ["No mode"];
        results.range = max(data) - min(data);
        results.midrange = (max(data) + min(data)) / 2;
      }

      if (calcType === "advanced" || calcType === "all") {
        results.variance = variance(data);
        results.stdDev = std(data);
        const sorted = [...data].sort((a, b) => a - b);
        results.q1 = quantileSeq(sorted, 0.25);
        results.q2 = quantileSeq(sorted, 0.5);
        results.q3 = quantileSeq(sorted, 0.75);
        results.iqr = results.q3 - results.q1;
        results.skewness =
          data.length >= 2 ? mean(data.map((x) => Math.pow((x - results.mean) / results.stdDev, 3))) || 0 : 0;
        results.kurtosis =
          data.length >= 2
            ? mean(data.map((x) => Math.pow((x - results.mean) / results.stdDev, 4))) - 3 || 0
            : 0;
        results.coefficientOfVariation = results.stdDev / results.mean;
      }

      results.data = data;
      results.frequency = {};
      data.forEach((d) => (results.frequency[d] = (results.frequency[d] || 0) + 1));

      return Object.fromEntries(
        Object.entries(results).map(([k, v]) => {
          if (typeof v === "number") return [k, Number(v).toFixed(precision)];
          if (Array.isArray(v) && k !== "data")
            return [k, v.map((x) => (typeof x === "number" ? Number(x).toFixed(precision) : x))];
          return [k, v];
        })
      );
    } catch (e) {
      throw new Error(`Calculation error: ${e.message}`);
    }
  };

  const computeCalculation = async (data, calcType, precision) => {
    try {
      const params = await calculateParameters(data, calcType, precision);
      params.calcType = calcType;
      return params;
    } catch (e) {
      throw new Error(`Invalid data: ${e.message}`);
    }
  };

  const processBatch = async (datasets, calcType, precision, results) => {
    for (const data of datasets) {
      try {
        if (data.length === 0) throw new Error("Empty dataset");
        const result = await computeCalculation(data, calcType, precision);
        results.push(result);
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const calculate = async () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision);
      const data = dataInput.trim();
      const isBatch = batchFile || batchText;

      let results = [];
      if (!isBatch) {
        if (!data) throw new Error("Data input is required");
        const dataArray = data.split(",").map((s) => s.trim());
        const result = await computeCalculation(dataArray, calcType, precisionVal);
        results.push(result);
        displayResults(results, calcType, precisionVal, isBatch);
      } else {
        let datasets = [];
        if (batchFile) {
          datasets = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = e.target.result;
              const parsed = text
                .split("\n")
                .map((line) => line.split(",").map((s) => s.trim()))
                .filter((d) => d.length > 0);
              resolve(parsed);
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          datasets = batchText.split(";").map((d) => d.split(",").map((s) => s.trim()));
        }
        await processBatch(datasets, calcType, precisionVal, results);
        if (results.length === 0) throw new Error("No valid datasets in batch input");
        displayResults(results, calcType, precisionVal, isBatch);
      }
      setSuccess("Calculation completed successfully");
      setLastResults(results);
    } catch (e) {
      console.error("Calculation error:", e);
      setError(e.message || "Invalid input");
    }
  };

  const displayResults = (results, calcType, precision, isBatch) => {
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Dataset</th><th class="p-2">Results</th></tr></thead><tbody>';
      results.forEach((r, i) => {
        const dataText = r.data.map((d) => Number(d).toFixed(precision)).join(", ");
        const resultText = Object.entries(r)
          .filter(([k]) => !["calcType", "data", "frequency"].includes(k))
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(", ");
        output += `<tr><td class="p-2">Dataset ${
          i + 1
        }: ${dataText}</td><td class="p-2">${resultText}</td></tr>`;
      });
      output += "</tbody></table>";
    } else {
      const r = results[0];
      output = `<strong>Results (Dataset: ${r.data
        .map((d) => Number(d).toFixed(precision))
        .join(", ")}):</strong><br>`;
      Object.entries(r).forEach(([k, v]) => {
        if (!["calcType", "data", "frequency"].includes(k)) {
          output += `${k}: ${Array.isArray(v) ? v.join(", ") : v}<br>`;
        }
      });
      output += `<br><strong>Frequency Table:</strong><br>`;
      output +=
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Value</th><th class="p-2">Frequency</th></tr></thead><tbody>';
      Object.entries(r.frequency).forEach(([value, freq]) => {
        output += `<tr><td class="p-2">${Number(value).toFixed(
          precision
        )}</td><td class="p-2">${freq}</td></tr>`;
      });
      output += "</tbody></table>";
    }

    let statsText = "";
    if (isBatch && results.length > 1) {
      const means = results.map((r) => parseFloat(r.mean)).filter((m) => !isNaN(m));
      if (means.length > 0) {
        const stats = {
          mean: mean(means),
          median: median(means),
          stdDev: std(means),
          min: Math.min(...means),
          max: Math.max(...means),
        };
        statsText = `
          <strong>Statistics (Means):</strong><br>
          Mean: ${Number(stats.mean).toFixed(precision)}<br>
          Median: ${Number(stats.median).toFixed(precision)}<br>
          Standard Deviation: ${Number(stats.stdDev).toFixed(precision)}<br>
          Min: ${Number(stats.min).toFixed(precision)}<br>
          Max: ${Number(stats.max).toFixed(precision)}
        `;
      }
    }

    setResultContent(output);
    setStatsContent(statsText);
    const params = isBatch
      ? `Batch: ${results.length} datasets, Type: ${calcType}`
      : `Dataset: ${results[0].data.map((d) => Number(d).toFixed(precision)).join(", ")}`;
    saveToHistory(params, output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "...");
    updateVisualizations(results, calcType, isBatch);
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const values = statInput
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      const precisionVal = parseInt(precision);

      if (values.length === 0) throw new Error("Invalid value list");

      const stats = {
        mean: mean(values),
        median: median(values),
        stdDev: std(values),
        min: Math.min(...values),
        max: Math.max(...values),
      };
      const statsText = `
        Mean: ${Number(stats.mean).toFixed(precisionVal)}<br>
        Median: ${Number(stats.median).toFixed(precisionVal)}<br>
        Standard Deviation: ${Number(stats.stdDev).toFixed(precisionVal)}<br>
        Min: ${Number(stats.min).toFixed(precisionVal)}<br>
        Max: ${Number(stats.max).toFixed(precisionVal)}
      `;
      const expression = `Stats(${values.join(", ")})`;

      setResultContent(`<strong>Statistical Analysis (Values):</strong><br>${statsText}`);
      setStatsContent("");
      const params = expression;
      saveToHistory(params, statsText.replace(/<br>/g, "; "));
      updateBarChart(values, true);
      setSuccess("Statistical analysis completed");
    } catch (e) {
      console.error("Stats error:", e);
      setError("Invalid statistical input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const variationVal = parseFloat(variation);
      const precisionVal = parseInt(precision);
      const data = dataInput.trim();

      if (!data) throw new Error("Data input is required");
      if (isNaN(variationVal) || variationVal <= 0) throw new Error("Invalid variation percentage");

      const dataArray = data.split(",").map((s) => parseInput(s.trim()));
      const results = [];
      const step = variationVal / 5;

      for (let v = -variationVal; v <= variationVal; v += step) {
        const variedData = dataArray.map((d) => d * (1 + v / 100));
        try {
          const calc = calculateParameters(variedData, calcType, precisionVal);
          results.push({
            variation: v,
            mean: parseFloat(calc.mean) || 0,
          });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      const resultText = results
        .map(
          (r) =>
            `Variation ${Number(r.variation).toFixed(2)}%: Mean = ${Number(r.mean).toFixed(precisionVal)}`
        )
        .join("<br>");

      setResultContent(`<strong>Sensitivity Analysis:</strong><br>${resultText}`);
      setStatsContent("");
      saveToHistory(`Sensitivity (±${variationVal}%)`, resultText.replace(/<br>/g, "; "));
      updateSensitivityChart(results);
      setSuccess("Sensitivity analysis completed");
    } catch (e) {
      console.error("Sensitivity error:", e);
      setError("Invalid sensitivity input: " + e.message);
    }
  };

  const updateVisualizations = (results, calcType, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (histogramChartInstance.current) histogramChartInstance.current.destroy();
    if (boxplotChartInstance.current) boxplotChartInstance.current.destroy();

    if (!isBatch && results.length === 1) {
      drawHistogram(results[0]);
      drawBoxPlot(results[0]);
    } else {
      if (histogramChartRef.current) {
        const ctx = histogramChartRef.current.getContext("2d");
        ctx.clearRect(0, 0, histogramChartRef.current.width, histogramChartRef.current.height);
        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";
        ctx.fillText("Histogram available for single dataset", 10, 50);
      }
      if (boxplotChartRef.current) {
        const ctx = boxplotChartRef.current.getContext("2d");
        ctx.clearRect(0, 0, boxplotChartRef.current.width, boxplotChartRef.current.height);
        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";
        ctx.fillText("Box plot available for single dataset", 10, 50);
      }
    }

    const means = results.map((r) => parseFloat(r.mean)).filter((m) => !isNaN(m));
    if (means.length > 0) {
      updateBarChart(means, isBatch);
    }
  };

  const updateBarChart = (values, isStats = false) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      const labels = isStats
        ? values.map((_, i) => `Value ${i + 1}`)
        : lastResults.map((_, i) => `Dataset ${i + 1}`);
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Mean",
              data: values,
              backgroundColor: "rgba(239, 68, 68, 0.5)",
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Mean" } },
            x: { title: { display: true, text: isStats ? "Values" : "Datasets" } },
          },
          plugins: {
            title: { display: true, text: isStats ? "Statistical Analysis" : "Mean Comparison" },
          },
        },
      });
    }
  };

  const updateSensitivityChart = (results) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "line",
        data: {
          labels: results.map((r) => `${Number(r.variation).toFixed(2)}%`),
          datasets: [
            {
              label: "Mean",
              data: results.map((r) => r.mean),
              borderColor: "#ef4444",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Mean" } },
            x: { title: { display: true, text: "Variation (%)" } },
          },
          plugins: {
            title: { display: true, text: "Sensitivity Analysis" },
          },
        },
      });
    }
  };

  const drawHistogram = (result) => {
    if (histogramChartInstance.current) histogramChartInstance.current.destroy();
    if (histogramChartRef.current) {
      try {
        const data = result.data.map(Number);
        const precisionVal = parseInt(precision);
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binCount = Math.ceil(Math.sqrt(data.length));
        const binWidth = (max - min) / binCount;
        const bins = Array(binCount).fill(0);
        data.forEach((d) => {
          const binIndex = Math.min(Math.floor((d - min) / binWidth), binCount - 1);
          bins[binIndex]++;
        });

        histogramChartInstance.current = new Chart(histogramChartRef.current, {
          type: "bar",
          data: {
            labels: bins.map(
              (_, i) =>
                `${(min + i * binWidth).toFixed(precisionVal)} - ${(min + (i + 1) * binWidth).toFixed(
                  precisionVal
                )}`
            ),
            datasets: [
              {
                label: "Frequency",
                data: bins,
                backgroundColor: "rgba(239, 68, 68, 0.5)",
                borderColor: "#b91c1c",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, title: { display: true, text: "Frequency" } },
              x: { title: { display: true, text: "Value Range" } },
            },
            plugins: {
              title: { display: true, text: "Data Histogram" },
            },
          },
        });
      } catch (e) {
        console.error("Histogram error:", e);
        const ctx = histogramChartRef.current.getContext("2d");
        ctx.clearRect(0, 0, histogramChartRef.current.width, histogramChartRef.current.height);
        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";
        ctx.fillText("Error rendering histogram", 10, 50);
      }
    }
  };

  const drawBoxPlot = (result) => {
    if (boxplotChartInstance.current) boxplotChartInstance.current.destroy();
    if (boxplotChartRef.current) {
      try {
        const ctx = boxplotChartRef.current.getContext("2d");
        boxplotChartRef.current.width = boxplotChartRef.current.offsetWidth;
        boxplotChartRef.current.height = 300;
        ctx.clearRect(0, 0, boxplotChartRef.current.width, boxplotChartRef.current.height);

        const data = result.data.map(Number);
        const q1 = parseFloat(result.q1) || quantileSeq(data, 0.25);
        const q2 = parseFloat(result.q2) || quantileSeq(data, 0.5);
        const q3 = parseFloat(result.q3) || quantileSeq(data, 0.75);
        const min = Math.min(...data);
        const max = Math.max(...data);
        const iqr = q3 - q1;
        const lowerWhisker = Math.max(min, q1 - 1.5 * iqr);
        const upperWhisker = Math.min(max, q3 + 1.5 * iqr);
        const precisionVal = parseInt(precision);

        const canvasWidth = boxplotChartRef.current.width;
        const canvasHeight = boxplotChartRef.current.height;
        const padding = 50;
        const dataRange = upperWhisker - lowerWhisker;
        const scaleY = (canvasHeight - 2 * padding) / dataRange;
        const boxWidth = canvasWidth / 4;
        const centerX = canvasWidth / 2;

        // Draw grid
        ctx.save();
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 0.5;
        const step = Math.max(20, 5);
        for (let x = 0; x <= canvasWidth; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvasHeight);
          ctx.stroke();
        }
        for (let y = 0; y <= canvasHeight; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvasWidth, y);
          ctx.stroke();
        }
        ctx.restore();

        // Draw box plot
        ctx.strokeStyle = "#b91c1c";
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.lineWidth = 2;

        const yMin = canvasHeight - padding - (lowerWhisker - lowerWhisker) * scaleY;
        const yQ1 = canvasHeight - padding - (q1 - lowerWhisker) * scaleY;
        const yQ2 = canvasHeight - padding - (q2 - lowerWhisker) * scaleY;
        const yQ3 = canvasHeight - padding - (q3 - lowerWhisker) * scaleY;
        const yMax = canvasHeight - padding - (upperWhisker - lowerWhisker) * scaleY;

        ctx.beginPath();
        ctx.moveTo(centerX, yMin);
        ctx.lineTo(centerX, yQ1);
        ctx.moveTo(centerX, yQ3);
        ctx.lineTo(centerX, yMax);
        ctx.stroke();

        ctx.fillRect(centerX - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);
        ctx.strokeRect(centerX - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);

        ctx.strokeStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(centerX - boxWidth / 2, yQ2);
        ctx.lineTo(centerX + boxWidth / 2, yQ2);
        ctx.stroke();

        ctx.strokeStyle = "#b91c1c";
        ctx.beginPath();
        ctx.moveTo(centerX - boxWidth / 4, yMin);
        ctx.lineTo(centerX + boxWidth / 4, yMin);
        ctx.moveTo(centerX - boxWidth / 4, yMax);
        ctx.lineTo(centerX + boxWidth / 4, yMax);
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.fillText(`Min: ${Number(lowerWhisker).toFixed(precisionVal)}`, centerX + boxWidth / 2 + 10, yMin);
        ctx.fillText(`Q1: ${Number(q1).toFixed(precisionVal)}`, centerX + boxWidth / 2 + 10, yQ1);
        ctx.fillText(`Median: ${Number(q2).toFixed(precisionVal)}`, centerX + boxWidth / 2 + 10, yQ2);
        ctx.fillText(`Q3: ${Number(q3).toFixed(precisionVal)}`, centerX + boxWidth / 2 + 10, yQ3);
        ctx.fillText(`Max: ${Number(upperWhisker).toFixed(precisionVal)}`, centerX + boxWidth / 2 + 10, yMax);
      } catch (e) {
        console.error("Box plot error:", e);
        const ctx = boxplotChartRef.current.getContext("2d");
        ctx.clearRect(0, 0, boxplotChartRef.current.width, boxplotChartRef.current.height);
        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";
        ctx.fillText("Error rendering box plot", 10, 50);
      }
    }
  };

  const clearInputs = () => {
    setDataInput("");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    clearMessages();
    clearCanvas();
    setResultContent("");
    setStatsContent("");
    setSuccess("Inputs cleared");
  };

  const clearCanvas = () => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (histogramChartInstance.current) histogramChartInstance.current.destroy();
    if (boxplotChartInstance.current) boxplotChartInstance.current.destroy();
    if (histogramChartRef.current) {
      const ctx = histogramChartRef.current.getContext("2d");
      ctx.clearRect(0, 0, histogramChartRef.current.width, histogramChartRef.current.height);
    }
    if (boxplotChartRef.current) {
      const ctx = boxplotChartRef.current.getContext("2d");
      ctx.clearRect(0, 0, boxplotChartRef.current.width, boxplotChartRef.current.height);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const saveCalculation = () => {
    if (!resultContent) {
      setError("No valid calculation to save");
      return;
    }
    setSuccess("Calculation saved to history");
  };

  const saveToHistory = (params, result) => {
    const entry = {
      date: new Date().toLocaleString(),
      params,
      result,
    };
    const updatedHistory = [...calculationHistory, entry];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("statCalcHistory", JSON.stringify(updatedHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.params}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("calculation_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("calculation_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Calculation History", 10, 10);
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
    doc.save("calculation_history.pdf");
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
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">
            Advanced Mean, Median, Mode, Range Calculator
          </h1>

          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Calculation Type
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Select the type of statistical calculation.
                    </span>
                  </span>
                </label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="basic">Basic (Mean, Median, Mode, Range)</option>
                  <option value="advanced">Advanced (Variance, Std Dev, Quartiles)</option>
                  <option value="all">All Statistics</option>
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
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Data Input (comma-separated numbers)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Enter numbers (e.g., 1,2,3,4,5).
                  </span>
                </span>
              </label>
              <textarea
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                className="p-3 border rounded-lg w-full"
                rows="4"
                placeholder="e.g., 1,2,3,4,5"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV: dataset1;dataset2;...)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Upload CSV or enter datasets (e.g., 1,2,3;4,5,6).
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
                placeholder="e.g., 1,2,3;4,5,6"
              />
            </div>
          </div>

          <div className="flex gap-4 mb-6">
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
                  Analyze Statistics (comma-separated means)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter means for statistical analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="e.g., 10,12,15"
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
                      Percentage variation for sensitivity analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                  className="w-full p-3 border rounded-lg"
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
            Learn About Statistics
          </button>

          {(resultContent || statsContent) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} className="text-gray-600 mb-4" />
              <div dangerouslySetInnerHTML={{ __html: statsContent }} className="text-gray-600 mb-4" />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Histogram</h3>
                <canvas ref={histogramChartRef} className="max-w-[500px] h-[300px] mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Box Plot</h3>
                <canvas ref={boxplotChartRef} className="max-w-[500px] h-[300px] mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Statistical Comparison</h3>
                <canvas ref={barChartRef} className="max-w-[500px] h-[300px] mx-auto" />
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
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Understanding Statistical Measures
                </h2>
                <p className="text-gray-600 mb-4">
                  Statistics summarize and describe datasets. Below are key measures and their formulas.
                </p>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Key Measures</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Mean:</strong> Arithmetic: (Σxᵢ)/n, Geometric: (x₁·x₂·…·xₙ)^(1/n), Harmonic:
                    n/(Σ(1/xᵢ))
                  </li>
                  <li>
                    <strong>Median:</strong> Middle value of sorted dataset; average of two middle values for
                    even n.
                  </li>
                  <li>
                    <strong>Mode:</strong> Most frequent value(s).
                  </li>
                  <li>
                    <strong>Range:</strong> max(xᵢ) - min(xᵢ)
                  </li>
                  <li>
                    <strong>Variance:</strong> σ² = (Σ(xᵢ - x̄)²)/n
                  </li>
                  <li>
                    <strong>Standard Deviation:</strong> σ = √σ²
                  </li>
                  <li>
                    <strong>Quartiles:</strong> Q1 (25th percentile), Q2 (median), Q3 (75th percentile).
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Applications</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Data Analysis:</strong> Summarize datasets.
                  </li>
                  <li>
                    <strong>Finance:</strong> Measure variability in returns.
                  </li>
                  <li>
                    <strong>Science:</strong> Analyze experimental data.
                  </li>
                  <li>
                    <strong>Education:</strong> Assess student performance.
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>Ensure valid numeric inputs.</li>
                  <li>Use batch input for multiple datasets.</li>
                  <li>Check sensitivity for data variations.</li>
                  <li>Visualize data with histograms and box plots.</li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
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
                      href="https://www.mathsisfun.com/data"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Math Is Fun: Statistics
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
