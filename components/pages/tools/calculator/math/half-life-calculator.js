"use client";
import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function HalfLifeCalculator() {
  const [inputValue, setInputValue] = useState("");
  const [inputType, setInputType] = useState("half-life");
  const [timeUnit, setTimeUnit] = useState("seconds");
  const [initialQuantity, setInitialQuantity] = useState("");
  const [time, setTime] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("atoms");
  const [fraction, setFraction] = useState("");
  const [calcType, setCalcType] = useState("conversion");
  const [precision, setPrecision] = useState("2");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resultContent, setResultContent] = useState("");
  const [statsContent, setStatsContent] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [lastResults, setLastResults] = useState([]);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("halfLifeHistory")) || [];
    setCalculationHistory(savedHistory);

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.target.tagName === "INPUT") {
        calculate();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toSeconds = (value, unit) => {
    switch (unit) {
      case "minutes":
        return value * 60;
      case "hours":
        return value * 3600;
      case "days":
        return value * 86400;
      case "years":
        return value * 31557600;
      default:
        return value;
    }
  };

  const fromSeconds = (value, unit) => {
    switch (unit) {
      case "minutes":
        return value / 60;
      case "hours":
        return value / 3600;
      case "days":
        return value / 86400;
      case "years":
        return value / 31557600;
      default:
        return value;
    }
  };

  const calculateParameters = (input, inputType, timeUnit, precision) => {
    let halfLife, meanLifetime, decayConstant;
    input = toSeconds(parseFloat(input), timeUnit);
    if (input <= 0) throw new Error("Input must be positive");

    if (inputType === "half-life") {
      halfLife = input;
      decayConstant = Math.LN2 / halfLife;
      meanLifetime = 1 / decayConstant;
    } else if (inputType === "mean-lifetime") {
      meanLifetime = input;
      decayConstant = 1 / meanLifetime;
      halfLife = Math.LN2 / decayConstant;
    } else {
      decayConstant = input;
      halfLife = Math.LN2 / decayConstant;
      meanLifetime = 1 / decayConstant;
    }

    return {
      halfLife: fromSeconds(halfLife, timeUnit),
      meanLifetime: fromSeconds(meanLifetime, timeUnit),
      decayConstant: fromSeconds(decayConstant, timeUnit),
      timeUnit,
    };
  };

  const computeCalculation = (
    inputValue,
    inputType,
    timeUnit,
    initialQuantity,
    time,
    quantityUnit,
    fraction,
    calcType,
    precision
  ) => {
    if (!inputValue || isNaN(parseFloat(inputValue)) || parseFloat(inputValue) <= 0) {
      throw new Error("Invalid input value");
    }

    const params = calculateParameters(inputValue, inputType, timeUnit, precision);
    let result = { ...params };
    result.inputValue = parseFloat(inputValue);
    result.inputType = inputType;
    result.calcType = calcType;
    result.quantityUnit = quantityUnit;

    if (calcType === "activity" || calcType === "remaining" || calcType === "time-to-fraction") {
      if (!initialQuantity || isNaN(parseFloat(initialQuantity)) || parseFloat(initialQuantity) <= 0) {
        throw new Error("Initial quantity required");
      }
      result.initialQuantity = parseFloat(initialQuantity);
    }

    if (calcType === "activity") {
      const lambda = toSeconds(params.decayConstant, timeUnit);
      result.activity = lambda * result.initialQuantity;
      result.activityUnit = `${quantityUnit}/second`;
    } else if (calcType === "remaining") {
      if (!time || isNaN(parseFloat(time)) || parseFloat(time) < 0) {
        throw new Error("Time required for remaining quantity");
      }
      result.time = parseFloat(time);
      const t = toSeconds(result.time, timeUnit);
      const lambda = toSeconds(params.decayConstant, timeUnit);
      result.remainingQuantity = result.initialQuantity * Math.exp(-lambda * t);
    } else if (calcType === "time-to-fraction") {
      if (!fraction || isNaN(parseFloat(fraction)) || parseFloat(fraction) <= 0 || parseFloat(fraction) > 1) {
        throw new Error("Fraction must be between 0 and 1");
      }
      result.fraction = parseFloat(fraction);
      const lambda = toSeconds(params.decayConstant, timeUnit);
      result.timeToFraction = -Math.log(result.fraction) / lambda;
      result.timeToFraction = fromSeconds(result.timeToFraction, timeUnit);
    }

    return result;
  };

  const processBatch = (calculations, results) => {
    calculations.forEach((c) => {
      try {
        let [val, type, tUnit, n0 = "", t = "", qUnit = "atoms", frac = ""] = c.map((s) => s.trim());
        const result = computeCalculation(
          val,
          type,
          tUnit,
          n0,
          t,
          qUnit,
          frac,
          calcType,
          parseInt(precision)
        );
        results.push(result);
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    });
  };

  const calculate = async () => {
    clearMessages();
    try {
      let results = [];
      let isBatch = batchFile || batchText;

      if (!isBatch && !inputValue) {
        throw new Error("Input value is required");
      }

      if (isBatch) {
        let calculations = [];
        if (batchFile) {
          calculations = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = e.target.result;
              const parsed = text
                .split("\n")
                .map((line) => line.split(",").map((s) => s.trim()))
                .filter((c) => c.length >= 3);
              resolve(parsed);
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          calculations = batchText.split(";").map((c) => c.split(",").map((s) => s.trim()));
        }
        processBatch(calculations, results);
        if (results.length === 0) throw new Error("No valid calculations in batch input");
      } else {
        const result = computeCalculation(
          inputValue,
          inputType,
          timeUnit,
          initialQuantity,
          time,
          quantityUnit,
          fraction,
          calcType,
          parseInt(precision)
        );
        results.push(result);
      }

      displayResults(results, calcType, parseInt(precision), isBatch);
      setSuccess("Calculation completed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError(e.message || "Invalid input");
      setTimeout(() => setError(""), 3000);
    }
  };

  const displayResults = (results, calcType, precision, isBatch) => {
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Input</th><th class="p-2">Type</th><th class="p-2">Half-Life</th><th class="p-2">Mean Lifetime</th><th class="p-2">Decay Constant</th><th class="p-2">Result</th></tr></thead><tbody>';
      results.forEach((r) => {
        let resultText = "";
        if (r.calcType === "activity") {
          resultText = `Activity: ${r.activity.toFixed(precision)} ${r.activityUnit}`;
        } else if (r.calcType === "remaining") {
          resultText = `Remaining: ${r.remainingQuantity.toFixed(precision)} ${r.quantityUnit}`;
        } else if (r.calcType === "time-to-fraction") {
          resultText = `Time: ${r.timeToFraction.toFixed(precision)} ${r.timeUnit}`;
        } else {
          resultText = "Conversions";
        }
        output += `<tr><td class="p-2">${r.inputValue.toFixed(precision)} ${r.timeUnit}</td><td class="p-2">${
          r.inputType
        }</td><td class="p-2">${r.halfLife.toFixed(precision)}</td><td class="p-2">${r.meanLifetime.toFixed(
          precision
        )}</td><td class="p-2">${r.decayConstant.toFixed(
          precision
        )}</td><td class="p-2">${resultText}</td></tr>`;
      });
      output += "</tbody></table>";
    } else {
      const r = results[0];
      output = `
        <strong>Results (${r.timeUnit}${r.quantityUnit ? ", " + r.quantityUnit : ""}):</strong><br>
        Half-Life: ${r.halfLife.toFixed(precision)} ${r.timeUnit}<br>
        Mean Lifetime: ${r.meanLifetime.toFixed(precision)} ${r.timeUnit}<br>
        Decay Constant: ${r.decayConstant.toFixed(precision)} ${r.timeUnit}⁻¹<br>
      `;
      if (r.calcType === "activity") {
        output += `Activity: ${r.activity.toFixed(precision)} ${r.activityUnit}<br>`;
      } else if (r.calcType === "remaining") {
        output += `Remaining Quantity: ${r.remainingQuantity.toFixed(precision)} ${
          r.quantityUnit
        } after ${r.time.toFixed(precision)} ${r.timeUnit}<br>`;
      } else if (r.calcType === "time-to-fraction") {
        output += `Time to ${r.fraction * 100}%: ${r.timeToFraction.toFixed(precision)} ${r.timeUnit}<br>`;
      }
    }

    let statsText = "";
    if (isBatch && results.length > 1) {
      const values = results.map((r) => {
        if (r.calcType === "activity") return r.activity;
        if (r.calcType === "remaining") return r.remainingQuantity;
        if (r.calcType === "time-to-fraction") return r.timeToFraction;
        return r.halfLife;
      });
      const stats = {
        mean: math.mean(values),
        median: math.median(values),
        stdDev: math.std(values),
        min: Math.min(...values),
        max: Math.max(...values),
      };
      statsText = `
        <strong>Statistics (${calcType}):</strong><br>
        Mean: ${stats.mean.toFixed(precision)}<br>
        Median: ${stats.median.toFixed(precision)}<br>
        Standard Deviation: ${stats.stdDev.toFixed(precision)}<br>
        Min: ${stats.min.toFixed(precision)}<br>
        Max: ${stats.max.toFixed(precision)}
      `;
    }

    setResultContent(output);
    setStatsContent(statsText);
    const params = isBatch
      ? `Batch: ${results.length} calculations, Type: ${calcType}`
      : `Input: ${results[0].inputValue} ${results[0].timeUnit}, Type: ${results[0].inputType}, Calc: ${calcType}`;
    saveToHistory(params, output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "...");
    setLastResults(results);
    updateVisualizations(results, calcType, isBatch);
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const values = statInput
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n));
      if (values.length === 0) throw new Error("Invalid values list");
      const stats = {
        mean: math.mean(values),
        median: math.median(values),
        stdDev: math.std(values),
        min: Math.min(...values),
        max: Math.max(...values),
      };
      const statsText = `
        Mean: ${stats.mean.toFixed(parseInt(precision))}<br>
        Median: ${stats.median.toFixed(parseInt(precision))}<br>
        Standard Deviation: ${stats.stdDev.toFixed(parseInt(precision))}<br>
        Min: ${stats.min.toFixed(parseInt(precision))}<br>
        Max: ${stats.max.toFixed(parseInt(precision))}
      `;
      const expression = `Stats(${values.join(", ")})`;
      setResultContent(`<strong>Statistical Analysis:</strong><br>${statsText}`);
      setStatsContent("");
      saveToHistory(expression, statsText.replace(/<br>/g, "; "));
      updateBarChart(values, true);
      setSuccess("Statistics calculated");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError("Invalid statistical input");
      setTimeout(() => setError(""), 3000);
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const variationVal = parseFloat(variation);
      const inputVal = parseFloat(inputValue);
      if (isNaN(variationVal) || variationVal <= 0) throw new Error("Invalid variation percentage");
      if (isNaN(inputVal) || inputVal <= 0) throw new Error("Invalid input value");

      const results = [];
      const step = variationVal / 5;
      for (let v = -variationVal; v <= variationVal; v += step) {
        const variedInput = inputVal * (1 + v / 100);
        const params = calculateParameters(variedInput, inputType, timeUnit, parseInt(precision));
        results.push({
          variation: v,
          halfLife: params.halfLife,
          meanLifetime: params.meanLifetime,
          decayConstant: params.decayConstant,
        });
      }

      const resultText = results
        .map(
          (r) =>
            `Variation ${r.variation.toFixed(2)}%: T₁/₂ = ${r.halfLife.toFixed(
              parseInt(precision)
            )} ${timeUnit}, τ = ${r.meanLifetime.toFixed(
              parseInt(precision)
            )} ${timeUnit}, λ = ${r.decayConstant.toFixed(parseInt(precision))} ${timeUnit}⁻¹`
        )
        .join("<br>");

      setResultContent(`<strong>Sensitivity Analysis:</strong><br>${resultText}`);
      setStatsContent("");
      saveToHistory(`Sensitivity (±${variationVal}%)`, resultText.replace(/<br>/g, "; "));
      updateSensitivityChart(results, timeUnit);
      setSuccess("Sensitivity analysis completed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError("Invalid sensitivity input");
      setTimeout(() => setError(""), 3000);
    }
  };

  const updateVisualizations = (results, calcType, isBatch) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();

    if (results[0].remainingQuantity !== undefined || results[0].calcType === "remaining") {
      const r = results[0];
      const lambda = toSeconds(r.decayConstant, r.timeUnit);
      const maxTime = toSeconds(r.time || r.halfLife * 5, r.timeUnit);
      const times = Array.from({ length: 100 }, (_, i) => (i / 99) * maxTime);
      const quantities = times.map((t) => r.initialQuantity * Math.exp(-lambda * t));
      if (lineChartRef.current) {
        lineChartInstance.current = new Chart(lineChartRef.current, {
          type: "line",
          data: {
            labels: times.map((t) => fromSeconds(t, r.timeUnit).toFixed(2)),
            datasets: [
              {
                label: "Remaining Quantity",
                data: quantities,
                borderColor: "#3b82f6",
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: { title: { display: true, text: `Time (${r.timeUnit})` } },
              y: { title: { display: true, text: `Quantity (${r.quantityUnit})` }, beginAtZero: true },
            },
            plugins: { title: { display: true, text: "Decay Curve" } },
          },
        });
      }
    }

    const values = results.map((r) => {
      if (calcType === "activity") return r.activity;
      if (calcType === "remaining") return r.remainingQuantity;
      if (calcType === "time-to-fraction") return r.timeToFraction;
      return r.halfLife;
    });
    updateBarChart(values, isBatch, calcType, results[0].timeUnit);

    if (isBatch && results.length > 1) {
      const ranges = { Low: 0, Medium: 0, High: 0 };
      const maxVal = Math.max(...values);
      values.forEach((val) => {
        if (val < maxVal / 3) ranges["Low"]++;
        else if (val < (2 * maxVal) / 3) ranges["Medium"]++;
        else ranges["High"]++;
      });

      if (pieChartRef.current) {
        pieChartInstance.current = new Chart(pieChartRef.current, {
          type: "pie",
          data: {
            labels: Object.keys(ranges),
            datasets: [{ data: Object.values(ranges), backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"] }],
          },
          options: {
            responsive: true,
            plugins: { title: { display: true, text: "Result Distribution" } },
          },
        });
      }
    }
  };

  const updateBarChart = (values, isBatch, calcType, timeUnit) => {
    if (barChartRef.current) {
      const label =
        calcType === "activity"
          ? "Activity"
          : calcType === "remaining"
          ? "Remaining Quantity"
          : calcType === "time-to-fraction"
          ? "Time"
          : "Half-Life";
      const unit = calcType === "time-to-fraction" ? timeUnit : "";
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: isBatch ? values.map((_, i) => `Calc ${i + 1}`) : ["Result"],
          datasets: [{ label: `${label} (${unit})`, data: values, backgroundColor: "#3b82f6" }],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: `${label} (${unit})` }, beginAtZero: true },
            x: { title: { display: true, text: isBatch ? "Calculation" : "Result" } },
          },
          plugins: { title: { display: true, text: "Parameter Comparison" } },
        },
      });
    }
  };

  const updateSensitivityChart = (results, timeUnit) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (lineChartRef.current) {
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: results.map((r) => r.variation.toFixed(2) + "%"),
          datasets: [
            { label: "Half-Life", data: results.map((r) => r.halfLife), borderColor: "#3b82f6", fill: false },
            {
              label: "Mean Lifetime",
              data: results.map((r) => r.meanLifetime),
              borderColor: "#10b981",
              fill: false,
            },
            {
              label: "Decay Constant",
              data: results.map((r) => r.decayConstant),
              borderColor: "#f59e0b",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Variation (%)" } },
            y: { title: { display: true, text: `Value (${timeUnit})` } },
          },
          plugins: { title: { display: true, text: "Sensitivity Analysis" } },
        },
      });
    }
  };

  const clearInputs = () => {
    setInputValue("");
    setInputType("half-life");
    setTimeUnit("seconds");
    setInitialQuantity("");
    setTime("");
    setQuantityUnit("atoms");
    setFraction("");
    setCalcType("conversion");
    setPrecision("2");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setResultContent("");
    setStatsContent("");
    clearMessages();
    setLastResults([]);
    setSuccess("Inputs cleared");
    setTimeout(() => setSuccess(""), 2000);
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
    const updatedHistory = [...calculationHistory, { date: new Date().toLocaleString(), params, result }];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("halfLifeHistory", JSON.stringify(updatedHistory));
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Parameters", "Result"],
      ...calculationHistory.map((h) => [h.date, h.params, h.result]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    downloadFile("half_life_history.csv", "text/csv", csvContent);
  };

  const exportJSON = () => {
    const jsonContent = JSON.stringify(calculationHistory, null, 2);
    downloadFile("half_life_history.json", "application/json", jsonContent);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Half-Life Calculator History", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    calculationHistory.forEach((h) => {
      doc.text(`Date: ${h.date}, Params: ${h.params}, Result: ${h.result}`, 10, y);
      y += 10;
    });
    doc.text("Note: Visualizations and full results are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("half_life_history.pdf");
  };

  const downloadFile = (filename, type, content) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Half-Life Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Input Value
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter Half-Life, Mean Lifetime, or Decay Constant.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g., 5730"
                  className="p-3 border rounded-lg w-full"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Input Type
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Select the type of input.
                    </span>
                  </span>
                </label>
                <select
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="half-life">Half-Life</option>
                  <option value="mean-lifetime">Mean Lifetime</option>
                  <option value="decay-constant">Decay Constant</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Time Unit
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Select the unit for time inputs.
                    </span>
                  </span>
                </label>
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Initial Quantity (N₀)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Initial number of particles (optional).
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={initialQuantity}
                  onChange={(e) => setInitialQuantity(e.target.value)}
                  placeholder="e.g., 1000"
                  className="p-3 border rounded-lg w-full"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Time (t)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Time for decay calculation (optional).
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g., 11460"
                  className="p-3 border rounded-lg w-full"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Quantity Unit
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Unit for quantity (optional).
                    </span>
                  </span>
                </label>
                <select
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="atoms">Atoms</option>
                  <option value="moles">Moles</option>
                  <option value="grams">Grams</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Calculation Type
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Select the type of calculation.
                    </span>
                  </span>
                </label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="conversion">Conversions</option>
                  <option value="activity">Activity</option>
                  <option value="remaining">Remaining Quantity</option>
                  <option value="time-to-fraction">Time to Fraction</option>
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
                  <option value="0">0 Decimals</option>
                  <option value="2">2 Decimals</option>
                  <option value="4">4 Decimals</option>
                  <option value="6">6 Decimals</option>
                  <option value="8">8 Decimals</option>
                  <option value="10">10 Decimals</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Fraction (N(t)/N₀)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Remaining fraction for time calculation (0–1).
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  max="1"
                  value={fraction}
                  onChange={(e) => setFraction(e.target.value)}
                  placeholder="e.g., 0.25"
                  className="p-3 border rounded-lg w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV: Input,Type,TimeUnit,N₀,t,QuantityUnit,Fraction)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Upload CSV or enter calculations (e.g., 5730,half-life,years,1000,11460,atoms,0.25).
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
                placeholder="e.g., 5730,half-life,years,1000,11460,atoms,0.25"
                className="p-3 border rounded-lg w-full"
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
              {showAdvanced ? "Hide Advanced Features" : "Show Advanced Features"}
            </button>
          </div>

          {showAdvanced && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Analyze Results (comma-separated)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter results (e.g., remaining quantities) for statistical analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                  placeholder="e.g., 500,250,125"
                  className="w-full p-3 border rounded-lg"
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
                      Enter percentage variation for sensitivity analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full p-3 border rounded-lg"
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
            Learn About Radioactive Decay
          </button>

          {(resultContent || statsContent) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} />
              <div dangerouslySetInnerHTML={{ __html: statsContent }} />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Decay Curve</h3>
                <canvas ref={lineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Parameter Comparison</h3>
                <canvas ref={barChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Result Distribution</h3>
                <canvas ref={pieChartRef} className="max-h-80" />
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
                      {calculationHistory.map((entry, i) => (
                        <tr key={i}>
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
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg max-w-[600px] w-[90%] relative">
                <span
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold mb-4">Understanding Radioactive Decay</h2>
                <p className="mb-4">
                  Radioactive decay is the process by which an unstable atomic nucleus loses energy by
                  emitting radiation.
                </p>
                <h3 className="text-md font-medium mb-2">Key Parameters</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Half-Life (T₁/₂):</strong> Time for half the substance to decay.
                  </li>
                  <li>
                    <strong>Mean Lifetime (τ):</strong> Average time a particle exists before decaying.
                  </li>
                  <li>
                    <strong>Decay Constant (λ):</strong> Probability of decay per unit time.
                  </li>
                  <li>
                    <strong>Activity (A):</strong> Rate of decay, A = λN.
                  </li>
                  <li>
                    <strong>Remaining Quantity (N(t)):</strong> Amount left after time t.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Formulas</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>T₁/₂ = ln(2) / λ ≈ 0.693 / λ</li>
                  <li>τ = 1 / λ</li>
                  <li>λ = ln(2) / T₁/₂ ≈ 0.693 / T₁/₂</li>
                  <li>N(t) = N₀ e^(-λt) or N(t) = N₀ (1/2)^(t/T₁/₂)</li>
                  <li>t = -ln(N(t)/N₀) / λ</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Physics:</strong> Study radioactive isotopes.
                  </li>
                  <li>
                    <strong>Medicine:</strong> Radiotherapy and imaging.
                  </li>
                  <li>
                    <strong>Archaeology:</strong> Carbon-14 dating.
                  </li>
                  <li>
                    <strong>Education:</strong> Teach nuclear physics concepts.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Ensure positive inputs for accurate calculations.</li>
                  <li>Use batch input for multiple decay scenarios.</li>
                  <li>Check sensitivity to understand parameter variations.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Resources</h3>
                <p className="mb-4">For more information, visit:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <a
                      href="https://www.khanacademy.org/science/physics/quantum-physics/in-in-nuclei/a/radioactive-decay"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Khan Academy: Radioactive Decay
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.physicsclassroom.com/class/nuclear/Lesson-3/Decay-Rates"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Physics Classroom: Decay Rates
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
