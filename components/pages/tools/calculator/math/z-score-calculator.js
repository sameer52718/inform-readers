"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import * as math from "mathjs";
import { jsPDF } from "jspdf";

export default function AdvancedZScoreCalculator() {
  const [calcType, setCalcType] = useState("zscore");
  const [precision, setPrecision] = useState("2");
  const [zscoreParams, setZscoreParams] = useState({ x: "", mean: "", std: "" });
  const [probabilityParams, setProbabilityParams] = useState({ z: "", tail: "left" });
  const [inverseParams, setInverseParams] = useState({ p: "", mean: "", std: "" });
  const [criticalParams, setCriticalParams] = useState({ confidence: "", tail: "two" });
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [results, setResults] = useState(null);
  const [statsContent, setStatsContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [history, setHistory] = useState([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const normalCurveCanvasRef = useRef(null);
  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("zscoreCalcHistory") || "[]");
    setHistory(storedHistory);
    updateTooltip();
  }, []);

  useEffect(() => {
    if (normalCurveCanvasRef.current && results && results.length === 1 && !results.isBatch) {
      drawNormalCurve(results[0]);
    } else {
      clearNormalCurve();
    }
  }, [results, calcType]);

  const parseInput = (input) => {
    try {
      if (!input.trim()) throw new Error("Input cannot be empty");
      const value = math.evaluate(input);
      if (isNaN(value) || !isFinite(value)) throw new Error("Invalid numerical value");
      return value;
    } catch (e) {
      throw new Error(`Invalid input: ${e.message}`);
    }
  };

  const calculateParameters = (type, params, prec) => {
    let results = {};
    params = params.map((p) =>
      typeof p === "string" && !["left", "right", "two"].includes(p) ? parseInput(p) : p
    );
    try {
      if (type === "zscore") {
        const [x, mean, std] = params;
        if (std <= 0) throw new Error("Standard deviation must be positive");
        const z = (x - mean) / std;
        const pdf = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
        const cdf = 0.5 * (1 + math.erf(z / Math.sqrt(2)));
        results = { z, pdf, cdf, x, mean, std };
      } else if (type === "probability") {
        const [z, tail] = params;
        const pdf = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
        const cdf = 0.5 * (1 + math.erf(z / Math.sqrt(2)));
        let prob;
        if (tail === "left") prob = cdf;
        else if (tail === "right") prob = 1 - cdf;
        else if (tail === "two") prob = 2 * (1 - cdf);
        else throw new Error("Invalid tail type");
        results = { z, pdf, cdf, probability: prob, tail };
      } else if (type === "inverse") {
        const [p, mean, std] = params;
        if (p <= 0 || p >= 1) throw new Error("Probability must be between 0 and 1");
        if (std <= 0) throw new Error("Standard deviation must be positive");
        const z = math.invErf(2 * p - 1) * Math.sqrt(2);
        const x = mean + z * std;
        results = { z, x, mean, std, p };
      } else if (type === "critical") {
        const [confidence, tail] = [params[0] / 100, params[1]];
        if (confidence <= 0 || confidence >= 1) throw new Error("Confidence level must be between 0 and 100");
        let p;
        if (tail === "two") p = (1 - confidence) / 2;
        else if (tail === "left" || tail === "right") p = 1 - confidence;
        else throw new Error("Invalid tail type");
        const z = Math.abs(math.invErf(2 * p - 1) * Math.sqrt(2));
        results = { z, confidence: confidence * 100, tail };
      }
      return Object.fromEntries(
        Object.entries(results).map(([k, v]) => [k, typeof v === "number" ? Number(v).toFixed(prec) : v])
      );
    } catch (e) {
      throw new Error(`Calculation error for ${type}: ${e.message}`);
    }
  };

  const paramInputs = {
    zscore: { x: "zscore-x", mean: "zscore-mean", std: "zscore-std" },
    probability: { z: "probability-z", tail: "probability-tail" },
    inverse: { p: "inverse-p", mean: "inverse-mean", std: "inverse-std" },
    critical: { confidence: "critical-confidence", tail: "critical-tail" },
  };

  const getInputValues = (type) => {
    const params =
      type === "zscore"
        ? zscoreParams
        : type === "probability"
        ? probabilityParams
        : type === "inverse"
        ? inverseParams
        : criticalParams;
    return Object.values(paramInputs[type]).map(
      (key) => params[Object.keys(paramInputs[type]).find((k) => paramInputs[type][k] === key)]
    );
  };

  const calculate = async () => {
    setError("");
    setSuccess("");
    setResults(null);
    try {
      const prec = parseInt(precision);
      let results = [];
      let isBatch = batchFile || batchText;

      if (!isBatch) {
        const inputs = getInputValues(calcType);
        if (inputs.some((v) => !v && v !== 0)) throw new Error("All parameters are required");
        const result = calculateParameters(calcType, inputs, prec);
        result.calcType = calcType;
        results.push(result);
        displayResults(results, calcType, prec, false);
      } else {
        let calculations = [];
        if (batchFile) {
          const text = await batchFile.text();
          calculations = text
            .split("\n")
            .map((line) => line.split(",").map((s) => s.trim()))
            .filter((c) => c.length > 1);
        } else if (batchText) {
          calculations = batchText.split(";").map((c) => c.split(",").map((s) => s.trim()));
        }
        for (const c of calculations) {
          try {
            const [type, ...params] = c;
            if (!paramInputs[type]) throw new Error("Invalid calculation type");
            if (params.length !== Object.keys(paramInputs[type]).length)
              throw new Error(`Incorrect number of parameters for ${type}`);
            const result = calculateParameters(type, params, prec);
            result.calcType = type;
            results.push(result);
          } catch (e) {
            console.warn(`Skipping invalid batch entry: ${e.message}`);
          }
        }
        if (results.length === 0) throw new Error("No valid calculations in batch input");
        displayResults(results, calcType, prec, true);
      }
    } catch (e) {
      setError(e.message || "Invalid input");
    }
  };

  const calculateStats = () => {
    setError("");
    setSuccess("");
    setResults(null);
    try {
      const zScores = statInput
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      const prec = parseInt(precision);
      if (zScores.length === 0) throw new Error("Invalid Z-score list");
      const stats = {
        mean: math.mean(zScores),
        median: math.median(zScores),
        stdDev: math.std(zScores),
        min: Math.min(...zScores),
        max: Math.max(...zScores),
      };
      const statsText = `Mean: ${Number(stats.mean).toFixed(prec)}\nMedian: ${Number(stats.median).toFixed(
        prec
      )}\nStandard Deviation: ${Number(stats.stdDev).toFixed(prec)}\nMin: ${Number(stats.min).toFixed(
        prec
      )}\nMax: ${Number(stats.max).toFixed(prec)}`;
      setResults({ type: "stats", content: statsText });
      setStatsContent("");
      saveToHistory(`Stats(${zScores.join(", ")})`, statsText.replace(/\n/g, "; "));
      updateBarChart(zScores, true);
      clearNormalCurve();
    } catch (e) {
      setError("Invalid statistical input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    setError("");
    setSuccess("");
    setResults(null);
    try {
      const variationVal = parseFloat(variation);
      const prec = parseInt(precision);
      const inputs = getInputValues(calcType);
      if (inputs.some((v) => !v && v !== 0)) throw new Error("All parameters required");
      if (isNaN(variationVal) || variationVal <= 0) throw new Error("Invalid variation percentage");
      const params = inputs.map((p) => (["left", "right", "two"].includes(p) ? p : parseInput(p)));
      const results = [];
      const step = variationVal / 5;
      for (let v = -variationVal; v <= variationVal; v += step) {
        let variedParams = params.map((p) => (typeof p === "number" ? p * (1 + v / 100) : p));
        if (calcType === "zscore") {
          variedParams[2] = Math.max(variedParams[2], 0.0001);
        } else if (calcType === "inverse") {
          variedParams[2] = Math.max(variedParams[2], 0.0001);
          variedParams[0] = Math.min(Math.max(variedParams[0], 0.0001), 0.9999);
        }
        try {
          const calc = calculateParameters(calcType, variedParams, prec);
          results.push({ variation: v, value: calc.z || calc.probability || calc.x || 0 });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }
      const resultText = results
        .map((r) => `Variation ${Number(r.variation).toFixed(2)}%: Value = ${Number(r.value).toFixed(prec)}`)
        .join("\n");
      setResults({ type: "sensitivity", content: resultText });
      setStatsContent("");
      saveToHistory(`Sensitivity (±${variationVal}%)`, resultText.replace(/\n/g, "; "));
      updateSensitivityChart(results);
      clearNormalCurve();
    } catch (e) {
      setError("Invalid sensitivity input: " + e.message);
    }
  };

  const displayResults = (results, type, prec, isBatch) => {
    let output = "";
    if (isBatch) {
      output = results.map((r) => {
        const paramText = Object.keys(paramInputs[r.calcType])
          .map((name) => `${name}: ${r[name] || "N/A"}`)
          .join(", ");
        const resultText = Object.entries(r)
          .filter(([k]) => !["calcType", ...Object.keys(paramInputs[r.calcType])].includes(k))
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
        return { type: r.calcType, params: paramText, results: resultText };
      });
      const zScores = results.map((r) => parseFloat(r.z)).filter((z) => !isNaN(z));
      let freqTable = "";
      if (zScores.length > 0) {
        const frequency = {};
        zScores.forEach((z) => (frequency[z] = (frequency[z] || 0) + 1));
        freqTable = Object.entries(frequency).map(([z, freq]) => ({ z: Number(z).toFixed(prec), freq }));
      }
      let statsText = "";
      if (results.length > 1 && zScores.length > 0) {
        const stats = {
          mean: math.mean(zScores),
          median: math.median(zScores),
          stdDev: math.std(zScores),
          min: Math.min(...zScores),
          max: Math.max(...zScores),
        };
        statsText = `Mean: ${Number(stats.mean).toFixed(prec)}\nMedian: ${Number(stats.median).toFixed(
          prec
        )}\nStandard Deviation: ${Number(stats.stdDev).toFixed(prec)}\nMin: ${Number(stats.min).toFixed(
          prec
        )}\nMax: ${Number(stats.max).toFixed(prec)}`;
      }
      setStatsContent(statsText);
      setResults({ type: "batch", content: output, frequency: freqTable, isBatch: true });
    } else {
      const r = results[0];
      const resultText = Object.entries(r)
        .filter(([k]) => !["calcType", ...Object.keys(paramInputs[r.calcType])].includes(k))
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      const paramText = Object.keys(paramInputs[r.calcType])
        .map((name) => `${name}: ${r[name] || "N/A"}`)
        .join(", ");
      setResults({ type: "single", content: { results: resultText, params: paramText }, isBatch: false });
      setStatsContent("");
    }
    const params = isBatch
      ? `Batch: ${results.length} calculations, Type: ${type}`
      : `${results[0].calcType}: ${Object.keys(paramInputs[results[0].calcType])
          .map((name) => `${name}=${results[0][name] || "N/A"}`)
          .join(", ")}`;
    saveToHistory(
      params,
      results
        .map((r) =>
          Object.entries(r)
            .filter(([k]) => !["calcType", ...Object.keys(paramInputs[r.calcType])].includes(k))
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")
        )
        .join("; ")
    );
    updateVisualizations(results, type, isBatch);
  };

  const updateVisualizations = (results, type, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (!isBatch && results.length === 1) {
      drawNormalCurve(results[0]);
    }
    const values = results.map((r) => parseFloat(r.z || r.probability || r.x)).filter((v) => !isNaN(v));
    if (values.length > 0) {
      updateBarChart(
        values,
        isBatch,
        results.map((r) => r.calcType)
      );
    }
  };

  const updateBarChart = (values, isStats, labels = []) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    barChartInstance.current = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels: isStats ? values.map((_, i) => `Z-score ${i + 1}`) : labels,
        datasets: [
          {
            label: isStats ? "Z-score" : "Value",
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
          y: { beginAtZero: false, title: { display: true, text: isStats ? "Z-score" : "Value" } },
          x: { title: { display: true, text: isStats ? "Z-scores" : "Calculation Types" } },
        },
        plugins: { title: { display: true, text: isStats ? "Z-score Analysis" : "Value Comparison" } },
      },
    });
  };

  const updateSensitivityChart = (results) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    barChartInstance.current = new Chart(barChartRef.current, {
      type: "line",
      data: {
        labels: results.map((r) => `${Number(r.variation).toFixed(2)}%`),
        datasets: [
          {
            label: "Value",
            data: results.map((r) => r.value),
            borderColor: "#ef4444",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: false, title: { display: true, text: "Value" } },
          x: { title: { display: true, text: "Variation (%)" } },
        },
        plugins: { title: { display: true, text: "Sensitivity Analysis" } },
      },
    });
  };

  const drawNormalCurve = (result) => {
    const canvas = normalCurveCanvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
      const prec = parseInt(precision);
      let z = parseFloat(result.z);
      let tail = result.tail || "left";
      let probability = parseFloat(result.probability || result.cdf);
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const padding = 50;
      const xMin = -4;
      const xMax = 4;
      const xRange = xMax - xMin;
      const scaleX = (canvasWidth - 2 * padding) / xRange;
      const scaleY = (canvasHeight - 2 * padding) / 0.5;

      drawGrid(ctx, canvasWidth, canvasHeight, 1);
      ctx.beginPath();
      ctx.strokeStyle = "#b91c1c";
      ctx.lineWidth = 2;
      for (let x = xMin; x <= xMax; x += 0.01) {
        const pdf = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
        const canvasX = padding + (x - xMin) * scaleX;
        const canvasY = canvasHeight - padding - pdf * scaleY;
        if (x === xMin) ctx.moveTo(canvasX, canvasY);
        else ctx.lineTo(canvasX, canvasY);
      }
      ctx.stroke();

      if (result.calcType === "probability" || result.calcType === "zscore") {
        ctx.beginPath();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        let startX = xMin;
        let endX = z;
        if (tail === "right") {
          startX = z;
          endX = xMax;
        } else if (tail === "two") {
          startX = -Math.abs(z);
          endX = Math.abs(z);
        }
        for (let x = startX; x <= endX; x += 0.01) {
          const pdf = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
          const canvasX = padding + (x - xMin) * scaleX;
          const canvasY = canvasHeight - padding - pdf * scaleY;
          if (x === startX) ctx.moveTo(canvasX, canvasHeight - padding);
          ctx.lineTo(canvasX, canvasY);
        }
        ctx.lineTo(padding + (endX - xMin) * scaleX, canvasHeight - padding);
        ctx.closePath();
        ctx.fill();
      }

      if (result.z && result.calcType !== "critical") {
        const canvasX = padding + (z - xMin) * scaleX;
        ctx.beginPath();
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.moveTo(canvasX, canvasHeight - padding);
        ctx.lineTo(
          canvasX,
          canvasHeight - padding - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z) * scaleY
        );
        ctx.stroke();
      }

      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";
      if (result.z) {
        ctx.fillText(
          `Z: ${Number(z).toFixed(prec)}`,
          padding + (z - xMin) * scaleX + 5,
          canvasHeight - padding - 20
        );
      }
      if (probability) {
        ctx.fillText(`P: ${Number(probability).toFixed(prec)}`, canvasWidth / 2 - 40, canvasHeight - 20);
      }

      ctx.beginPath();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.moveTo(padding, canvasHeight - padding);
      ctx.lineTo(canvasWidth - padding, canvasHeight - padding);
      ctx.moveTo(padding, canvasHeight - padding);
      ctx.lineTo(padding, padding);
      ctx.stroke();

      for (let x = xMin; x <= xMax; x += 1) {
        const canvasX = padding + (x - xMin) * scaleX;
        ctx.beginPath();
        ctx.moveTo(canvasX, canvasHeight - padding);
        ctx.lineTo(canvasX, canvasHeight - padding + 5);
        ctx.stroke();
        ctx.fillText(x.toFixed(0), canvasX - 5, canvasHeight - padding + 15);
      }
    } catch (e) {
      ctx.fillStyle = "#000";
      ctx.fillText("Error rendering normal curve", 10, 50);
    }
  };

  const drawGrid = (ctx, width, height, scale) => {
    ctx.save();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 0.5;
    const step = Math.max(20 / scale, 5);
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const updateTooltip = () => {
    if (!tooltipRef.current) {
      const tooltip = document.createElement("div");
      tooltip.className =
        "absolute bg-gray-800 text-white p-2 rounded text-xs pointer-events-none opacity-0 transition-opacity z-10";
      document.body.appendChild(tooltip);
      tooltipRef.current = tooltip;
    }
    const canvas = normalCurveCanvasRef.current;
    if (canvas) {
      const prec = parseInt(precision);
      canvas.onmousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const xMin = -4;
        const xMax = 4;
        const scaleX = (canvas.width - 100) / (xMax - xMin);
        const zValue = xMin + (x - 50) / scaleX;
        if (zValue >= xMin && zValue <= xMax) {
          const pdf = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * zValue * zValue);
          const cdf = 0.5 * (1 + math.erf(zValue / Math.sqrt(2)));
          tooltipRef.current.style.left = `${e.clientX + 10}px`;
          tooltipRef.current.style.top = `${e.clientY + 10}px`;
          tooltipRef.current.style.opacity = "1";
          tooltipRef.current.textContent = `Z: ${zValue.toFixed(prec)}\nPDF: ${pdf.toFixed(
            prec
          )}\nCDF: ${cdf.toFixed(prec)}`;
        } else {
          tooltipRef.current.style.opacity = "0";
        }
      };
      canvas.onmouseout = () => {
        tooltipRef.current.style.opacity = "0";
      };
    }
  };

  const clearInputs = () => {
    setZscoreParams({ x: "", mean: "", std: "" });
    setProbabilityParams({ z: "", tail: "left" });
    setInverseParams({ p: "", mean: "", std: "" });
    setCriticalParams({ confidence: "", tail: "two" });
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setError("");
    setSuccess("");
    setResults(null);
    setStatsContent("");
    clearNormalCurve();
    if (barChartInstance.current) barChartInstance.current.destroy();
  };

  const clearNormalCurve = () => {
    const canvas = normalCurveCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText("Normal curve available for single calculation", 10, 50);
  };

  const saveCalculation = () => {
    setError("");
    setSuccess("");
    if (results) {
      setSuccess("Calculation saved to history!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("No valid calculation to save.");
    }
  };

  const saveToHistory = (params, result) => {
    const newHistory = [...history, { date: new Date().toLocaleString(), params, result }];
    setHistory(newHistory);
    localStorage.setItem("zscoreCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("calculation_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    downloadFile("calculation_history.json", "application/json", json);
  };

  const exportPDF = () => {
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

  const downloadFile = (filename, type, content) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const renderInputs = () => {
    switch (calcType) {
      case "zscore":
        return (
          <div className="flex flex-wrap gap-4">
            {["x", "mean", "std"].map((key) => (
              <div key={key} className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {key === "x" ? "Value (x)" : key === "mean" ? "Mean (μ)" : "Standard Deviation (σ)"}
                </label>
                <input
                  type="text"
                  value={zscoreParams[key]}
                  onChange={(e) => setZscoreParams({ ...zscoreParams, [key]: e.target.value })}
                  className="p-3 border rounded-lg w-full"
                  placeholder={`e.g., ${key === "x" ? "75" : key === "mean" ? "70" : "5"}`}
                />
              </div>
            ))}
          </div>
        );
      case "probability":
        return (
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Z-score</label>
              <input
                type="text"
                value={probabilityParams.z}
                onChange={(e) => setProbabilityParams({ ...probabilityParams, z: e.target.value })}
                className="p-3 border rounded-lg w-full"
                placeholder="e.g., 1.96"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tail Type</label>
              <select
                value={probabilityParams.tail}
                onChange={(e) => setProbabilityParams({ ...probabilityParams, tail: e.target.value })}
                className="p-3 border rounded-lg w-full"
              >
                <option value="left">Left-tailed (P(Z {"<"} z))</option>
                <option value="right">Right-tailed (P(Z {">"} z))</option>
                <option value="two">Two-tailed (P(|Z| {">"} |z|))</option>
              </select>
            </div>
          </div>
        );
      case "inverse":
        return (
          <div className="flex flex-wrap gap-4">
            {["p", "mean", "std"].map((key) => (
              <div key={key} className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {key === "p" ? "Probability" : key === "mean" ? "Mean (μ)" : "Standard Deviation (σ)"}
                </label>
                <input
                  type="text"
                  value={inverseParams[key]}
                  onChange={(e) => setInverseParams({ ...inverseParams, [key]: e.target.value })}
                  className="p-3 border rounded-lg w-full"
                  placeholder={`e.g., ${key === "p" ? "0.975" : key === "mean" ? "70" : "5"}`}
                />
              </div>
            ))}
          </div>
        );
      case "critical":
        return (
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Level (%)</label>
              <input
                type="text"
                value={criticalParams.confidence}
                onChange={(e) => setCriticalParams({ ...criticalParams, confidence: e.target.value })}
                className="p-3 border rounded-lg w-full"
                placeholder="e.g., 95"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tail Type</label>
              <select
                value={criticalParams.tail}
                onChange={(e) => setCriticalParams({ ...criticalParams, tail: e.target.value })}
                className="p-3 border rounded-lg w-full"
              >
                <option value="two">Two-tailed</option>
                <option value="left">Left-tailed</option>
                <option value="right">Right-tailed</option>
              </select>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className=" bg-white flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full">
          <h1 className="text-2xl font-bold text-red-700 mb-6">Advanced Z-score Calculator</h1>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

          <h2 className="text-xl font-semibold text-red-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Type</label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="zscore">Z-score</option>
                  <option value="probability">Probability (CDF/PDF)</option>
                  <option value="inverse">Inverse Z-score</option>
                  <option value="critical">Critical Z-value</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Precision</label>
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
            <div className="mt-4">{renderInputs()}</div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Input (CSV: type,x,mean,std or type,z,tail,...)
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
                placeholder="e.g., zscore,75,70,5;probability,1.96,left"
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
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              {isAdvancedOpen ? "Hide Advanced Features" : "Show Advanced Features"}
            </button>
          </div>

          {isAdvancedOpen && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-red-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analyze Z-scores (comma-separated)
                </label>
                <input
                  type="text"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="e.g., 1.96,-1.96,0"
                />
                <button onClick={calculateStats} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
                  Calculate Statistics
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Variation Range (±%)</label>
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
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Z-scores
          </button>

          {results && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-red-700 mb-4">Calculation Results</h2>
              <div className="text-gray-700 mb-4">
                {results.type === "single" && (
                  <>
                    <strong>Results ({results.content.calcType}):</strong>
                    <br />
                    {results.content.results.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                    <br />
                    <strong>Parameters:</strong>
                    <br />
                    {results.content.params}
                  </>
                )}
                {results.type === "batch" && (
                  <>
                    <table className="w-full text-sm text-gray-700">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-2">Type</th>
                          <th className="p-2">Parameters</th>
                          <th className="p-2">Results</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.content.map((r, i) => (
                          <tr key={i}>
                            <td className="p-2">{r.type}</td>
                            <td className="p-2">{r.params}</td>
                            <td className="p-2">{r.results}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {results.frequency.length > 0 && (
                      <>
                        <br />
                        <strong>Z-score Frequency Table:</strong>
                        <br />
                        <table className="w-full text-sm text-gray-700">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="p-2">Z-score</th>
                              <th className="p-2">Frequency</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.frequency.map((f, i) => (
                              <tr key={i}>
                                <td className="p-2">{f.z}</td>
                                <td className="p-2">{f.freq}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </>
                )}
                {results.type === "stats" && (
                  <>
                    <strong>Statistical Analysis (Z-scores):</strong>
                    <br />
                    {results.content.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </>
                )}
                {results.type === "sensitivity" && (
                  <>
                    <strong>Sensitivity Analysis:</strong>
                    <br />
                    {results.content.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </>
                )}
              </div>
              {statsContent && (
                <div className="text-gray-700 mb-4">
                  <strong>Statistics (Z-scores):</strong>
                  <br />
                  {statsContent.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Normal Distribution Curve</h3>
                <canvas
                  ref={normalCurveCanvasRef}
                  className="w-full max-w-[500px] h-[300px] border border-gray-300 bg-white mx-auto"
                />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Z-score Comparison</h3>
                <canvas ref={barChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 max-h-[200px] overflow-y-auto">
                <h3 className="text-md font-medium text-red-700">Calculation History</h3>
                <table className="w-full text-sm text-gray-700">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Parameters</th>
                      <th className="p-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i}>
                        <td className="p-2">{h.date}</td>
                        <td className="p-2">{h.params}</td>
                        <td className="p-2">{h.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
              <div className="bg-gray-100 p-5 rounded-lg max-w-[600px] w-[90%] relative">
                <span
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold text-red-700 mb-4">Understanding Z-scores</h2>
                <p className="mb-4 text-gray-700">
                  A Z-score measures how many standard deviations a data point is from the mean in a normal
                  distribution. Below are key concepts and formulas.
                </p>
                <h3 className="text-md font-medium text-red-700 mb-2">Key Formulas</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>
                    <strong>Z-score:</strong> Z = (x - μ) / σ, where x is the value, μ is the mean, and σ is
                    the standard deviation.
                  </li>
                  <li>
                    <strong>PDF:</strong> f(z) = (1 / √(2π)) e^(-z²/2)
                  </li>
                  <li>
                    <strong>CDF:</strong> P(Z {"<"} z) = (1 / √(2π)) ∫(-∞ to z) e^(-t²/2) dt
                  </li>
                  <li>
                    <strong>Inverse Z-score:</strong> x = μ + Z * σ
                  </li>
                  <li>
                    <strong>Critical Z-value:</strong> Z-score for a given confidence level (e.g., 1.96 for
                    95% two-tailed).
                  </li>
                </ul>
                <h3 className="text-md font-medium text-red-700 mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>
                    <strong>Statistics:</strong> Compare data points across distributions.
                  </li>
                  <li>
                    <strong>Finance:</strong> Assess risk and returns.
                  </li>
                  <li>
                    <strong>Quality Control:</strong> Detect outliers in manufacturing.
                  </li>
                  <li>
                    <strong>Education:</strong> Standardize test scores.
                  </li>
                </ul>
                <h3 className="text-md font-medium text-red-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>Ensure standard deviation is positive.</li>
                  <li>Use batch input for multiple calculations.</li>
                  <li>Visualize probabilities with the normal curve.</li>
                  <li>Check sensitivity for mean and standard deviation variations.</li>
                </ul>
                <h3 className="text-md font-medium text-red-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 mb-4 text-blue-500">
                  <li>
                    <a
                      href="https://www.khanacademy.org/math/statistics-probability"
                      target="_blank"
                      className="hover:underline"
                    >
                      Khan Academy: Statistics
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.mathsisfun.com/data/standard-normal-distribution.html"
                      target="_blank"
                      className="hover:underline"
                    >
                      Math Is Fun: Standard Normal Distribution
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
