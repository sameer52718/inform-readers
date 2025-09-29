"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function ExponentCalculator() {
  const [calcType, setCalcType] = useState("basic");
  const [baseType, setBaseType] = useState("custom");
  const [precision, setPrecision] = useState("2");
  const [params, setParams] = useState({ base: "", exponent: "" });
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [variation, setVariation] = useState("");
  const [compareText, setCompareText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState([]);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const svgRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("exponentCalcHistory")) || [];
    setCalculationHistory(savedHistory);
    updateInputFields(calcType);
  }, []);

  const updateInputFields = (type) => {
    let newParams = {};
    if (type === "basic" || type === "log" || type === "derivative" || type === "integral") {
      newParams = { base: "", exponent: "" };
    } else if (type === "compound") {
      newParams = { principal: "", rate: "", compounds: "", time: "" };
    } else if (type === "growth") {
      newParams = { initial: "", rate: "", time: "" };
    }
    setParams(newParams);
  };

  const calculateExponent = (calcType, params, precision, baseType) => {
    let result = null,
      formula = "",
      logForm = "",
      derivative = "",
      integral = "";
    const e = Math.E;
    if (calcType === "basic") {
      let { base, exponent } = params;
      if (isNaN(base) || isNaN(exponent)) throw new Error("Base and exponent are required");
      if (baseType === "e") base = e;
      else if (baseType === "10") base = 10;
      if (base === 0 && exponent <= 0) throw new Error("Zero raised to a non-positive exponent is undefined");
      result = Math.pow(base, exponent);
      formula = `${baseType === "e" ? "e" : baseType === "10" ? "10" : base}^${exponent} = ${result.toFixed(
        precision
      )}`;
      logForm = `log_${base}(${result.toFixed(precision)}) = ${exponent}`;
    } else if (calcType === "compound") {
      const { principal, rate, compounds, time } = params;
      if (isNaN(principal) || isNaN(rate) || isNaN(compounds) || isNaN(time)) {
        throw new Error("All compound interest parameters are required");
      }
      if (principal < 0 || rate < 0 || compounds < 1 || time < 0) {
        throw new Error("Invalid compound interest parameters");
      }
      result = principal * Math.pow(1 + rate / compounds, compounds * time);
      formula = `A = ${principal} * (1 + ${rate}/${compounds})^(${compounds}*${time}) = ${result.toFixed(
        precision
      )}`;
    } else if (calcType === "growth") {
      const { initial, rate, time } = params;
      if (isNaN(initial) || isNaN(rate) || isNaN(time)) {
        throw new Error("All growth/decay parameters are required");
      }
      result = initial * Math.exp(rate * time);
      formula = `A = ${initial} * e^(${rate}*${time}) = ${result.toFixed(precision)}`;
    } else if (calcType === "log") {
      let { base, exponent } = params;
      if (isNaN(base) || isNaN(exponent)) throw new Error("Base and exponent are required");
      if (baseType === "e") base = e;
      else if (baseType === "10") base = 10;
      if (base <= 0 || base === 1) throw new Error("Base must be positive and not 1 for logarithm");
      result = Math.pow(base, exponent);
      logForm = `log_${base}(${result.toFixed(precision)}) = ${exponent}`;
      formula = `${base}^${exponent} = ${result.toFixed(precision)}`;
    } else if (calcType === "derivative") {
      let { base, exponent } = params;
      if (isNaN(base) || isNaN(exponent)) throw new Error("Base and exponent are required");
      if (baseType === "e") base = e;
      else if (baseType === "10") base = 10;
      if (base <= 0) throw new Error("Base must be positive for derivative");
      result = Math.pow(base, exponent);
      derivative = `${base}^${exponent} * ln(${base})`;
      formula = `d/dx (${base}^x) = ${derivative}`;
    } else if (calcType === "integral") {
      let { base, exponent } = params;
      if (isNaN(base) || isNaN(exponent)) throw new Error("Base and exponent are required");
      if (baseType === "e") base = e;
      else if (baseType === "10") base = 10;
      if (base <= 0 || base === 1) throw new Error("Base must be positive and not 1 for integral");
      result = Math.pow(base, exponent);
      integral = `${base}^x / ln(${base}) + C`;
      formula = `∫ ${base}^x dx = ${integral}`;
    } else {
      throw new Error("Invalid calculation type");
    }
    return {
      result: result ? Number(result.toFixed(precision)) : null,
      formula,
      logForm: logForm || null,
      derivative: derivative || null,
      integral: integral || null,
      visualizationData: generateVisualizationData(calcType, params, baseType),
    };
  };

  const generateVisualizationData = (calcType, params, baseType) => {
    const data = [];
    if (calcType === "basic" || calcType === "log" || calcType === "derivative" || calcType === "integral") {
      let { base } = params;
      if (baseType === "e") base = Math.E;
      else if (baseType === "10") base = 10;
      for (let x = -5; x <= 5; x += 0.1) {
        data.push({ x, y: Math.pow(base, x) });
      }
    } else if (calcType === "compound") {
      const { principal, rate, compounds, time } = params;
      for (let t = 0; t <= time; t += 0.1) {
        data.push({ x: t, y: principal * Math.pow(1 + rate / compounds, compounds * t) });
      }
    } else if (calcType === "growth") {
      const { initial, rate, time } = params;
      for (let t = 0; t <= time; t += 0.1) {
        data.push({ x: t, y: initial * Math.exp(rate * t) });
      }
    }
    return data;
  };

  const calculate = async () => {
    clearMessages();
    clearVisualizations();
    try {
      let results = [];
      const isBatch = batchFile || batchText;
      if (!isBatch) {
        if (Object.values(params).some((v) => v === "")) throw new Error("All parameters must be filled");
        const parsedParams = Object.fromEntries(
          Object.entries(params).map(([k, v]) => [k, k === "compounds" ? parseInt(v) : parseFloat(v)])
        );
        if (Object.values(parsedParams).some((v) => isNaN(v)))
          throw new Error("All parameters must be valid numbers");
        const result = calculateExponent(calcType, parsedParams, parseInt(precision), baseType);
        results.push({ calcType, baseType, params: parsedParams, result });
      } else {
        let datasets = [];
        if (batchFile) {
          datasets = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              resolve(
                e.target.result
                  .split("\n")
                  .map((line) => line.trim())
                  .filter((line) => line && line.includes(","))
              );
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          datasets = batchText
            .split(";")
            .map((s) => s.trim())
            .filter((s) => s && s.includes(","));
        }
        for (const dataset of datasets) {
          try {
            const values = dataset.split(",").map((s) => parseFloat(s.trim()));
            let batchParams = {};
            if (
              calcType === "basic" ||
              calcType === "log" ||
              calcType === "derivative" ||
              calcType === "integral"
            ) {
              if (values.length !== 2) throw new Error("Basic calculation requires two values");
              batchParams = { base: values[0], exponent: values[1] };
            } else if (calcType === "compound") {
              if (values.length !== 4) throw new Error("Compound calculation requires four values");
              batchParams = {
                principal: values[0],
                rate: values[1],
                compounds: parseInt(values[2]),
                time: values[3],
              };
            } else if (calcType === "growth") {
              if (values.length !== 3) throw new Error("Growth calculation requires three values");
              batchParams = { initial: values[0], rate: values[1], time: values[2] };
            }
            if (Object.values(batchParams).some((v) => isNaN(v))) throw new Error("Invalid batch parameters");
            const result = calculateExponent(calcType, batchParams, parseInt(precision), baseType);
            results.push({ calcType, baseType, params: batchParams, result });
          } catch (e) {
            console.warn(`Skipping invalid batch entry: ${e.message}`);
          }
        }
        if (results.length === 0) throw new Error("No valid datasets found");
      }
      displayResults(results, isBatch);
      setSuccess("Calculation completed successfully");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      showError(e.message || "An unexpected error occurred");
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      if (!["basic", "compound", "growth"].includes(calcType))
        throw new Error("Sensitivity analysis only for basic, compound, or growth");
      if (isNaN(parseInt(precision)) || parseInt(precision) < 0)
        throw new Error("Precision must be non-negative");
      if (isNaN(parseFloat(variation))) throw new Error("Variation value is required");
      if (Object.values(params).some((v) => v === "")) throw new Error("All parameters must be filled");
      const parsedParams = Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, k === "compounds" ? parseInt(v) : parseFloat(v)])
      );
      if (Object.values(parsedParams).some((v) => isNaN(v)))
        throw new Error("All parameters must be valid numbers");
      const results = [
        { label: "Original", params: parsedParams },
        calcType === "basic"
          ? {
              label: "Base + Variation",
              params: { ...parsedParams, base: parsedParams.base + parseFloat(variation) },
            }
          : calcType === "compound"
          ? {
              label: "Rate + Variation",
              params: { ...parsedParams, rate: parsedParams.rate + parseFloat(variation) },
            }
          : {
              label: "Rate + Variation",
              params: { ...parsedParams, rate: parsedParams.rate + parseFloat(variation) },
            },
        calcType === "basic"
          ? {
              label: "Exponent + Variation",
              params: { ...parsedParams, exponent: parsedParams.exponent + parseFloat(variation) },
            }
          : calcType === "compound"
          ? {
              label: "Time + Variation",
              params: { ...parsedParams, time: parsedParams.time + parseFloat(variation) },
            }
          : {
              label: "Time + Variation",
              params: { ...parsedParams, time: parsedParams.time + parseFloat(variation) },
            },
      ].map((v) => ({ ...v, result: calculateExponent(calcType, v.params, parseInt(precision), baseType) }));
      let output = `<strong>Sensitivity Analysis (Variation: ${variation}):</strong><br>`;
      output += results
        .map((r) => `${r.label}:<br>Result: ${r.result.result}<br>Formula: ${r.result.formula}`)
        .join("<br><br>");
      setResults([{ text: output }]);
      saveToHistory(`Sensitivity (Variation: ${variation})`, output.replace(/<br>/g, "; "));
      updateSensitivityChart(results);
      setSuccess("Sensitivity analysis completed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      showError(e.message || "Failed to compute sensitivity analysis");
    }
  };

  const compareExpressions = () => {
    clearMessages();
    try {
      if (!compareText) throw new Error("Comparison input is required");
      if (!["basic", "compound", "growth"].includes(calcType))
        throw new Error("Comparison only for basic, compound, or growth");
      if (isNaN(parseInt(precision)) || parseInt(precision) < 0)
        throw new Error("Precision must be non-negative");
      const datasets = compareText
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s && s.includes(","));
      if (datasets.length === 0) throw new Error("No valid datasets provided");
      const results = datasets
        .map((dataset) => {
          try {
            const values = dataset.split(",").map((s) => parseFloat(s.trim()));
            let parsedParams = {};
            if (calcType === "basic") {
              if (values.length !== 2) throw new Error("Basic comparison requires two values");
              parsedParams = { base: values[0], exponent: values[1] };
            } else if (calcType === "compound") {
              if (values.length !== 4) throw new Error("Compound comparison requires four values");
              parsedParams = {
                principal: values[0],
                rate: values[1],
                compounds: parseInt(values[2]),
                time: values[3],
              };
            } else if (calcType === "growth") {
              if (values.length !== 3) throw new Error("Growth comparison requires three values");
              parsedParams = { initial: values[0], rate: values[1], time: values[2] };
            }
            if (Object.values(parsedParams).some((v) => isNaN(v)))
              throw new Error("Invalid comparison parameters");
            const result = calculateExponent(calcType, parsedParams, parseInt(precision), baseType);
            return { calcType, baseType, params: parsedParams, result, dataset };
          } catch (e) {
            console.warn(`Skipping invalid comparison entry: ${e.message}`);
            return null;
          }
        })
        .filter((r) => r);
      if (results.length === 0) throw new Error("No valid expressions to compare");
      let output = `<strong>Expression Comparison:</strong><br><table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Parameters</th><th class="p-2">Result</th></tr></thead><tbody>`;
      results.forEach((r) => {
        const paramsStr =
          calcType === "basic"
            ? `a=${r.params.base}, b=${r.params.exponent}`
            : calcType === "compound"
            ? `P=${r.params.principal}, r=${r.params.rate}, n=${r.params.compounds}, t=${r.params.time}`
            : `A₀=${r.params.initial}, k=${r.params.rate}, t=${r.params.time}`;
        output += `<tr><td class="p-2">${paramsStr}</td><td class="p-2">Result: ${r.result.result}<br>Formula: ${r.result.formula}</td></tr>`;
      });
      output += "</tbody></table>";
      setResults([{ text: output }]);
      saveToHistory(
        `Comparison: ${results.length} expressions`,
        output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "..."
      );
      updateComparisonChart(results);
      setSuccess("Comparison completed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      showError(e.message || "Failed to compare expressions");
    }
  };

  const displayResults = (results, isBatch) => {
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Parameters</th><th class="p-2">Result</th></tr></thead><tbody>';
      results.forEach((r) => {
        const paramsStr =
          calcType === "basic" || calcType === "log" || calcType === "derivative" || calcType === "integral"
            ? `a=${r.params.base}, b=${r.params.exponent}`
            : calcType === "compound"
            ? `P=${r.params.principal}, r=${r.params.rate}, n=${r.params.compounds}, t=${r.params.time}`
            : `A₀=${r.params.initial}, k=${r.params.rate}, t=${r.params.time}`;
        let resultText = "";
        if (calcType === "basic" || calcType === "compound" || calcType === "growth") {
          resultText = `Result: ${r.result.result}<br>Formula: ${r.result.formula}`;
        } else if (calcType === "log") {
          resultText = `Log Form: ${r.result.logForm}<br>Formula: ${r.result.formula}`;
        } else if (calcType === "derivative") {
          resultText = `Derivative: ${r.result.derivative}<br>Formula: ${r.result.formula}`;
        } else if (calcType === "integral") {
          resultText = `Integral: ${r.result.integral}<br>Formula: ${r.result.formula}`;
        }
        output += `<tr><td class="p-2">${paramsStr}</td><td class="p-2">${resultText}</td></tr>`;
      });
      output += "</tbody></table>";
    } else {
      const r = results[0];
      output = `<strong>Results (Type: ${r.calcType}, Base: ${r.baseType}, Precision: ${precision}):</strong><br>`;
      if (calcType === "basic" || calcType === "compound" || calcType === "growth") {
        output += `Result: ${r.result.result}<br>Formula: ${r.result.formula}<br>`;
        if (calcType === "basic") output += `Log Form: ${r.result.logForm || "N/A"}`;
      } else if (calcType === "log") {
        output += `Log Form: ${r.result.logForm}<br>Formula: ${r.result.formula}`;
      } else if (calcType === "derivative") {
        output += `Derivative: ${r.result.derivative}<br>Formula: ${r.result.formula}`;
      } else if (calcType === "integral") {
        output += `Integral: ${r.result.integral}<br>Formula: ${r.result.formula}`;
      }
    }
    setResults([{ text: output }]);
    const paramsStr = isBatch
      ? `Batch: ${results.length} calculations, Type: ${results[0].calcType}`
      : calcType === "basic" || calcType === "log" || calcType === "derivative" || calcType === "integral"
      ? `a=${results[0].params.base}, b=${results[0].params.exponent}`
      : calcType === "compound"
      ? `P=${results[0].params.principal}, r=${results[0].params.rate}, n=${results[0].compounds}, t=${results[0].params.time}`
      : `A₀=${results[0].params.initial}, k=${results[0].params.rate}, t=${results[0].params.time}`;
    saveToHistory(paramsStr, output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "...");
    updateVisualizations(results, isBatch);
  };

  const updateVisualizations = (results, isBatch) => {
    if (!isBatch && results.length === 1 && results[0].result.visualizationData.length > 0) {
      drawExponentVisualization(results[0].result.visualizationData);
    } else if (svgRef.current) {
      svgRef.current.innerHTML =
        '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single calculation</text>';
    }
    updateLineChart(results);
    updateBarChart(results);
  };

  const drawExponentVisualization = (data) => {
    if (!svgRef.current) return;
    svgRef.current.innerHTML = "";
    const width = 500;
    const height = 200;
    svgRef.current.setAttribute("width", width);
    svgRef.current.setAttribute("height", height);
    if (!data.length) return;
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
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = data
      .map(
        (point, i) =>
          `${i === 0 ? "M" : "L"} ${((point.x - xMin) * scaleX + offsetX).toFixed(2)},${(
            offsetY -
            (point.y - yMin) * scaleY
          ).toFixed(2)}`
      )
      .join(" ");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#ef4444");
    path.setAttribute("stroke-width", "2");
    svgRef.current.appendChild(path);
    data.forEach((point, i) => {
      if (i % 10 === 0) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", (point.x - xMin) * scaleX + offsetX);
        circle.setAttribute("cy", offsetY - (point.y - yMin) * scaleY);
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", "#ef4444");
        svgRef.current.appendChild(circle);
      }
    });
  };

  const updateLineChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (!results.some((r) => r.result.visualizationData.length > 0)) return;
    const datasets = results.map((r, i) => ({
      label: `Calculation ${i + 1}`,
      data: r.result.visualizationData.map((d) => d.y),
      borderColor: ["#ef4444", "#10b981", "#3b82f6"][i % 3],
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
    const values = results.map((r) => r.result.result).filter((v) => v !== null);
    if (!values.length) return;
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
            backgroundColor: "#ef4444",
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
    if (!results.some((r) => r.result.visualizationData.length > 0)) return;
    const datasets = results.map((r, i) => ({
      label: r.label,
      data: r.result.visualizationData.map((d) => d.y),
      borderColor: ["#ef4444", "#10b981", "#3b82f6"][i % 3],
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
    if (!results.some((r) => r.result.visualizationData.length > 0)) return;
    const datasets = results.map((r, i) => ({
      label: r.dataset,
      data: r.result.visualizationData.map((d) => d.y),
      borderColor: ["#ef4444", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"][i % 5],
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
    clearMessages();
    updateInputFields(calcType);
    setPrecision("2");
    setBatchText("");
    setBatchFile(null);
    setVariation("");
    setCompareText("");
    setResults([]);
    clearVisualizations();
    setSuccess("Inputs cleared");
    setTimeout(() => setSuccess(""), 2000);
  };

  const clearVisualizations = () => {
    if (svgRef.current) svgRef.current.innerHTML = "";
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();
    lineChartInstance.current = null;
    barChartInstance.current = null;
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const showError = (message) => {
    setError(String(message || "An unexpected error occurred"));
    setTimeout(() => setError(""), 3000);
  };

  const saveCalculation = () => {
    if (results.length === 0) {
      showError("No results to save");
      return;
    }
    setSuccess("Calculation saved to history");
    setTimeout(() => setSuccess(""), 2000);
  };

  const saveToHistory = (params, result) => {
    const updatedHistory = [...calculationHistory, { date: new Date().toLocaleString(), params, result }];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("exponentCalcHistory", JSON.stringify(updatedHistory));
  };

  const exportCSV = () => {
    const csv = [
      ["Date", "Parameters", "Result"],
      ...calculationHistory.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    downloadFile("exponent_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("exponent_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Exponent Calculation History", 10, 10);
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
    doc.save("exponent_history.pdf");
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
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Exponent Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Calculation Type
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Select the type of exponentiation calculation.
                  </span>
                </span>
              </label>
              <select
                value={calcType}
                onChange={(e) => {
                  setCalcType(e.target.value);
                  updateInputFields(e.target.value);
                }}
                className="p-3 border rounded-lg w-full"
              >
                <option value="basic">Basic Exponentiation (a^b)</option>
                <option value="compound">Compound Interest</option>
                <option value="growth">Exponential Growth/Decay</option>
                <option value="log">Logarithmic Conversion</option>
                <option value="derivative">Derivative</option>
                <option value="integral">Integral</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Base Type
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Select the base (e.g., custom, e, 10).
                  </span>
                </span>
              </label>
              <select
                value={baseType}
                onChange={(e) => setBaseType(e.target.value)}
                className="p-3 border rounded-lg w-full"
              >
                <option value="custom">Custom</option>
                <option value="e">e (≈2.718)</option>
                <option value="10">10</option>
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
              {calcType === "basic" ||
              calcType === "log" ||
              calcType === "derivative" ||
              calcType === "integral" ? (
                <>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Base (a)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Base of the exponentiation.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.base}
                      onChange={(e) => setParams({ ...params, base: e.target.value })}
                      placeholder="e.g., 2"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Exponent (b)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Exponent of the calculation.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.exponent}
                      onChange={(e) => setParams({ ...params, exponent: e.target.value })}
                      placeholder="e.g., 3"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                </>
              ) : calcType === "compound" ? (
                <>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Principal (P)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Initial investment amount.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.principal}
                      onChange={(e) => setParams({ ...params, principal: e.target.value })}
                      placeholder="e.g., 1000"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Rate (r, decimal)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Annual interest rate (e.g., 0.05 for 5%).
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.rate}
                      onChange={(e) => setParams({ ...params, rate: e.target.value })}
                      placeholder="e.g., 0.05"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Compounds per Year (n)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Number of times interest is compounded per year.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.compounds}
                      onChange={(e) => setParams({ ...params, compounds: e.target.value })}
                      placeholder="e.g., 12"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Time (t, years)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Time period in years.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.time}
                      onChange={(e) => setParams({ ...params, time: e.target.value })}
                      placeholder="e.g., 5"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                </>
              ) : calcType === "growth" ? (
                <>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Initial Amount (A₀)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Initial quantity.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.initial}
                      onChange={(e) => setParams({ ...params, initial: e.target.value })}
                      placeholder="e.g., 100"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Rate (k)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Growth/decay rate (positive for growth, negative for decay).
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.rate}
                      onChange={(e) => setParams({ ...params, rate: e.target.value })}
                      placeholder="e.g., 0.1"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Time (t)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Time period.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.time}
                      onChange={(e) => setParams({ ...params, time: e.target.value })}
                      placeholder="e.g., 2"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Batch Input (CSV: a,b;...)
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Upload CSV or enter pairs (e.g., 2,3;4,0.5).
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
              placeholder="e.g., 2,3;4,0.5"
              className="p-3 border rounded-lg w-full"
            />
          </div>

          <div className="flex gap-4 mb-6 mt-6">
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
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Variation Value
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Value to vary base/exponent for sensitivity analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                  placeholder="e.g., 1"
                  className="p-3 border rounded-lg w-full mb-2"
                />
                <button onClick={calculateSensitivity} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Analyze Sensitivity
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Compare Expressions (CSV: a,b;...)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter expressions to compare (e.g., 2,3;4,0.5).
                    </span>
                  </span>
                </label>
                <textarea
                  value={compareText}
                  onChange={(e) => setCompareText(e.target.value)}
                  rows="4"
                  placeholder="e.g., 2,3;4,0.5"
                  className="p-3 border rounded-lg w-full mb-2"
                />
                <button onClick={compareExpressions} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Compare Expressions
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Exponents
          </button>

          {results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: results[0].text }} />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Exponential Curve</h3>
                <svg ref={svgRef} className="max-w-[500px] h-52 mx-auto" />
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
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg max-w-[600px] w-[90%] relative">
                <span
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold mb-4">Understanding Exponents</h2>
                <p className="mb-4">
                  Exponents represent repeated multiplication and are fundamental in mathematics, science, and
                  finance.
                </p>
                <h3 className="text-md font-medium mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Basic Exponentiation:</strong> a^b means multiplying a by itself b times (e.g.,
                    2^3 = 8).
                  </li>
                  <li>
                    <strong>Negative Exponents:</strong> a^(-b) = 1/a^b (e.g., 2^(-2) = 1/4).
                  </li>
                  <li>
                    <strong>Fractional Exponents:</strong> a^(1/n) = nth root of a (e.g., 4^0.5 = 2).
                  </li>
                  <li>
                    <strong>Power Rules:</strong> (a^b)^c = a^(b*c), a^b * a^c = a^(b+c), a^b / a^c = a^(b-c).
                  </li>
                  <li>
                    <strong>Exponential Functions:</strong> f(x) = a^x models growth or decay.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Finance:</strong> Compound interest A = P(1 + r/n)^(nt).
                  </li>
                  <li>
                    <strong>Science:</strong> Exponential growth/decay A = A₀ e^(kt).
                  </li>
                  <li>
                    <strong>Computer Science:</strong> Algorithm complexity (e.g., O(2^n)).
                  </li>
                  <li>
                    <strong>Mathematics:</strong> Logarithms, calculus (derivatives/integrals).
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Calculus</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Derivative:</strong> d/dx (a^x) = a^x ln(a).
                  </li>
                  <li>
                    <strong>Integral:</strong> ∫ a^x dx = a^x / ln(a) + C.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Enter base and exponent for basic calculations.</li>
                  <li>Use batch input for multiple calculations.</li>
                  <li>Visualize exponential functions with charts.</li>
                  <li>Check history for past calculations.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Resources</h3>
                <p className="mb-4">For more information, visit:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <a
                      href="https://www.khanacademy.org"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Khan Academy: Exponents
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.mathsisfun.com"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Math Is Fun: Exponents
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
