"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function AdvancedSequenceCalculator() {
  const [sequenceType, setSequenceType] = useState("arithmetic");
  const [calcType, setCalcType] = useState("terms");
  const [precision, setPrecision] = useState(2);
  const [firstTerm, setFirstTerm] = useState("");
  const [commonDiff, setCommonDiff] = useState("");
  const [commonRatio, setCommonRatio] = useState("");
  const [numTerms, setNumTerms] = useState("");
  const [fibStart, setFibStart] = useState("0");
  const [batchFile, setBatchFile] = useState(null);
  const [batchText, setBatchText] = useState("");
  const [variation, setVariation] = useState("");
  const [compareText, setCompareText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resultContent, setResultContent] = useState("");
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastResults, setLastResults] = useState([]);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("sequenceCalcHistory") || "[]").filter(
      (entry) =>
        entry &&
        typeof entry.date === "string" &&
        typeof entry.params === "string" &&
        typeof entry.result === "string"
    );
    setCalculationHistory(savedHistory);
  }, []);

  const calculateSequence = (seqType, calcType, params, precision) => {
    const { firstTerm, commonDiff, commonRatio, numTerms, fibStart, nth } = params;
    let terms = [],
      sum = 0,
      nthTerm = null,
      formula = "";

    if (seqType === "arithmetic") {
      if (isNaN(firstTerm) || isNaN(commonDiff) || (calcType !== "nth" && isNaN(numTerms))) {
        throw new Error("Invalid arithmetic sequence parameters");
      }
      if (numTerms < 1 || Math.floor(numTerms) !== numTerms) {
        throw new Error("Number of terms must be a positive integer");
      }
      if (calcType === "terms" || calcType === "sum") {
        terms = Array.from({ length: numTerms }, (_, i) => firstTerm + i * commonDiff);
        sum = (numTerms / 2) * (firstTerm + terms[terms.length - 1]);
        formula = `aₙ = ${firstTerm} + (n-1) * ${commonDiff}`;
      } else if (calcType === "nth") {
        if (isNaN(nth) || nth < 1 || Math.floor(nth) !== nth) {
          throw new Error("Nth term index must be a positive integer");
        }
        nthTerm = firstTerm + (nth - 1) * commonDiff;
        formula = `aₙ = ${firstTerm} + (n-1) * ${commonDiff}`;
      }
    } else if (seqType === "geometric") {
      if (isNaN(firstTerm) || isNaN(commonRatio) || (calcType !== "nth" && isNaN(numTerms))) {
        throw new Error("Invalid geometric sequence parameters");
      }
      if (numTerms < 1 || Math.floor(numTerms) !== numTerms) {
        throw new Error("Number of terms must be a positive integer");
      }
      if (calcType === "terms" || calcType === "sum") {
        terms = Array.from({ length: numTerms }, (_, i) => firstTerm * Math.pow(commonRatio, i));
        if (Math.abs(commonRatio) === 1) {
          sum = firstTerm * numTerms;
        } else if (Math.abs(commonRatio) < 1 && calcType === "sum") {
          sum = (firstTerm * (1 - Math.pow(commonRatio, numTerms))) / (1 - commonRatio);
          const infiniteSum = firstTerm / (1 - commonRatio);
          formula = `Finite Sum = a₁ * (1 - rⁿ)/(1 - r), Infinite Sum = a₁ / (1 - r)`;
          return {
            terms: terms.map((t) => Number(t.toFixed(precision))),
            sum: Number(sum.toFixed(precision)),
            infiniteSum: Number(infiniteSum.toFixed(precision)),
            formula,
          };
        } else {
          sum = (firstTerm * (1 - Math.pow(commonRatio, numTerms))) / (1 - commonRatio);
        }
        formula = `aₙ = ${firstTerm} * ${commonRatio}^(n-1)`;
      } else if (calcType === "nth") {
        if (isNaN(nth) || nth < 1 || Math.floor(nth) !== nth) {
          throw new Error("Nth term index must be a positive integer");
        }
        nthTerm = firstTerm * Math.pow(commonRatio, nth - 1);
        formula = `aₙ = ${firstTerm} * ${commonRatio}^(n-1)`;
      }
    } else if (seqType === "fibonacci") {
      if (isNaN(numTerms) || numTerms < 1 || Math.floor(numTerms) !== numTerms) {
        throw new Error("Number of terms must be a positive integer");
      }
      const start = fibStart === "0" ? 0 : 1;
      terms = [start];
      if (numTerms === 1) {
        formula = "F(n) = F(n-1) + F(n-2)";
        return { terms, sum: start, formula };
      }
      terms.push(start === 0 ? 1 : 1);
      for (let i = 2; i < numTerms; i++) {
        terms.push(terms[i - 1] + terms[i - 2]);
      }
      sum = terms.reduce((acc, val) => acc + val, 0);
      formula = "F(n) = F(n-1) + F(n-2)";
      if (calcType === "nth") {
        if (isNaN(nth) || nth < 1 || Math.floor(nth) !== nth) {
          throw new Error("Nth term index must be a positive integer");
        }
        terms = terms.slice(0, nth);
        nthTerm = terms[nth - 1];
      }
    } else {
      throw new Error("Invalid sequence type");
    }

    return {
      terms: terms.map((t) => Number(t.toFixed(precision))),
      sum: calcType === "sum" ? Number(sum.toFixed(precision)) : null,
      nthTerm: calcType === "nth" ? Number(nthTerm.toFixed(precision)) : null,
      formula,
    };
  };

  const calculate = async () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision);
      const isBatch = batchFile || batchText;
      let results = [];
      const params = {
        firstTerm: parseFloat(firstTerm),
        commonDiff: parseFloat(commonDiff),
        commonRatio: parseFloat(commonRatio),
        numTerms: parseInt(numTerms),
        fibStart,
        nth: calcType === "nth" ? parseInt(numTerms) : NaN,
      };

      if (!["arithmetic", "geometric", "fibonacci"].includes(sequenceType)) {
        throw new Error("Invalid sequence type selected");
      }
      if (!["terms", "sum", "nth"].includes(calcType)) {
        throw new Error("Invalid calculation type selected");
      }
      if (isNaN(precisionVal) || precisionVal < 0) {
        throw new Error("Precision must be a non-negative integer");
      }
      if (sequenceType !== "fibonacci" && isNaN(params.firstTerm)) {
        throw new Error("First term is required");
      }
      if (sequenceType === "arithmetic" && isNaN(params.commonDiff)) {
        throw new Error("Common difference is required");
      }
      if (sequenceType === "geometric" && isNaN(params.commonRatio)) {
        throw new Error("Common ratio is required");
      }
      if (
        calcType !== "nth" &&
        sequenceType !== "fibonacci" &&
        (isNaN(params.numTerms) || params.numTerms < 1)
      ) {
        throw new Error("Number of terms must be a positive integer");
      }
      if (calcType === "nth" && (isNaN(params.nth) || params.nth < 1)) {
        throw new Error("Nth term index must be a positive integer");
      }

      if (!isBatch) {
        const result = calculateSequence(sequenceType, calcType, params, precisionVal);
        results.push({ sequenceType, calcType, params, result });
        displayResults(results, false);
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
                  .filter((line) => line)
              );
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          datasets = batchText
            .split(";")
            .map((s) => s.trim())
            .filter((s) => s);
          if (datasets.length === 0) throw new Error("No valid datasets provided in batch text");
        }
        await processBatch(datasets, results, sequenceType, calcType, precisionVal);
        if (results.length === 0) throw new Error("No valid datasets in batch input");
        displayResults(results, true);
      }
      setSuccess("Calculation completed successfully");
    } catch (e) {
      console.error("Calculation error:", e);
      setError(e.message || "An unexpected error occurred during calculation");
    }
  };

  const processBatch = async (datasets, results, seqType, calcType, precision) => {
    for (const dataset of datasets) {
      try {
        const params = dataset.split(",").map((s) => s.trim());
        let parsedParams = {};
        if (seqType === "arithmetic") {
          if (params.length !== 3)
            throw new Error("Arithmetic batch requires first term, common difference, number of terms");
          parsedParams = {
            firstTerm: parseFloat(params[0]),
            commonDiff: parseFloat(params[1]),
            numTerms: parseInt(params[2]),
            nth: calcType === "nth" ? parseInt(params[2]) : NaN,
          };
        } else if (seqType === "geometric") {
          if (params.length !== 3)
            throw new Error("Geometric batch requires first term, common ratio, number of terms");
          parsedParams = {
            firstTerm: parseFloat(params[0]),
            commonRatio: parseFloat(params[1]),
            numTerms: parseInt(params[2]),
            nth: calcType === "nth" ? parseInt(params[2]) : NaN,
          };
        } else if (seqType === "fibonacci") {
          if (params.length !== 2)
            throw new Error("Fibonacci batch requires number of terms, start with (0 or 1)");
          parsedParams = {
            numTerms: parseInt(params[0]),
            fibStart: params[1],
            nth: calcType === "nth" ? parseInt(params[0]) : NaN,
          };
        }
        if (Object.values(parsedParams).some((v) => isNaN(v) && v !== "0" && v !== "1")) {
          throw new Error("Invalid batch parameters");
        }
        const result = calculateSequence(seqType, calcType, parsedParams, precision);
        results.push({ sequenceType: seqType, calcType, params: parsedParams, result });
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const displayResults = (results, isBatch) => {
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Parameters</th><th class="p-2">Result</th></tr></thead><tbody>';
      results.forEach((r) => {
        const params =
          r.sequenceType === "fibonacci"
            ? `n=${r.params.numTerms}, start=${r.params.fibStart}`
            : `a₁=${r.params.firstTerm}, ${r.sequenceType === "arithmetic" ? "d" : "r"}=${
                r.sequenceType === "arithmetic" ? r.params.commonDiff : r.params.commonRatio
              }, n=${r.params.numTerms}`;
        const resultText =
          r.calcType === "terms"
            ? `Terms: ${r.result.terms.join(", ")}`
            : r.calcType === "sum"
            ? `Sum: ${r.result.sum}${r.result.infiniteSum ? `, Infinite Sum: ${r.result.infiniteSum}` : ""}`
            : `Nth Term: ${r.result.nthTerm}`;
        output += `<tr><td class="p-2">${params}</td><td class="p-2">${resultText}<br>Formula: ${r.result.formula}</td></tr>`;
      });
      output += "</tbody></table>";
    } else {
      const r = results[0];
      output = `<strong>Results (Type: ${r.sequenceType}, Calc: ${r.calcType}, Precision: ${precision}):</strong><br>`;
      output += `Formula: ${r.result.formula}<br>`;
      if (r.calcType === "terms") {
        output += `Terms: ${r.result.terms.join(", ")}<br>`;
        output += `Sum: ${r.result.sum || "N/A"}`;
      } else if (r.calcType === "sum") {
        output += `Sum: ${r.result.sum}${
          r.result.infiniteSum ? `, Infinite Sum: ${r.result.infiniteSum}` : ""
        }`;
      } else {
        output += `Nth Term: ${r.result.nthTerm}`;
      }
    }

    setResultContent(output);
    const params = isBatch
      ? `Batch: ${results.length} sequences, Type: ${results[0].sequenceType}`
      : results[0].sequenceType === "fibonacci"
      ? `n=${results[0].params.numTerms}, start=${results[0].params.fibStart}`
      : `a₁=${results[0].params.firstTerm}, ${results[0].sequenceType === "arithmetic" ? "d" : "r"}=${
          results[0].sequenceType === "arithmetic"
            ? results[0].params.commonDiff
            : results[0].params.commonRatio
        }, n=${results[0].params.numTerms}`;
    saveToHistory(params, output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "...");
    setLastResults(results);
    updateVisualizations(results, isBatch);
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision);
      const variationVal = parseFloat(variation);
      const params = {
        firstTerm: parseFloat(firstTerm),
        commonDiff: parseFloat(commonDiff),
        commonRatio: parseFloat(commonRatio),
        numTerms: parseInt(numTerms),
        fibStart,
      };

      if (!["arithmetic", "geometric", "fibonacci"].includes(sequenceType)) {
        throw new Error("Invalid sequence type selected");
      }
      if (!["terms", "sum"].includes(calcType)) {
        throw new Error("Sensitivity analysis requires terms or sum calculation");
      }
      if (isNaN(precisionVal) || precisionVal < 0) {
        throw new Error("Precision must be a non-negative integer");
      }
      if (isNaN(variationVal)) {
        throw new Error("Variation value is required");
      }
      if (sequenceType !== "fibonacci" && isNaN(params.firstTerm)) {
        throw new Error("First term is required");
      }
      if (sequenceType === "arithmetic" && isNaN(params.commonDiff)) {
        throw new Error("Common difference is required");
      }
      if (sequenceType === "geometric" && isNaN(params.commonRatio)) {
        throw new Error("Common ratio is required");
      }
      if (isNaN(params.numTerms) || params.numTerms < 1) {
        throw new Error("Number of terms must be a positive integer");
      }

      const results = [];
      const variations = [
        { label: "Original", params },
        sequenceType !== "fibonacci"
          ? {
              label: "First Term + Variation",
              params: { ...params, firstTerm: params.firstTerm + variationVal },
            }
          : null,
        sequenceType === "arithmetic"
          ? {
              label: "Common Diff + Variation",
              params: { ...params, commonDiff: params.commonDiff + variationVal },
            }
          : sequenceType === "geometric"
          ? {
              label: "Common Ratio + Variation",
              params: { ...params, commonRatio: params.commonRatio + variationVal },
            }
          : null,
      ].filter((v) => v);

      for (const v of variations) {
        const result = calculateSequence(sequenceType, calcType, v.params, precisionVal);
        results.push({ ...v, result });
      }

      let output = `<strong>Sensitivity Analysis (Variation: ${variationVal}):</strong><br>`;
      output += results
        .map(
          (r) =>
            `${r.label}:<br>` +
            (calcType === "terms"
              ? `Terms: ${r.result.terms.join(", ")}<br>Sum: ${r.result.sum || "N/A"}`
              : `Sum: ${r.result.sum}${
                  r.result.infiniteSum ? `, Infinite Sum: ${r.result.infiniteSum}` : ""
                }`)
        )
        .join("<br><br>");

      setResultContent(output);
      saveToHistory(`Sensitivity (Variation: ${variationVal})`, output.replace(/<br>/g, "; "));
      updateSensitivityChart(results);
      setSuccess("Sensitivity analysis completed");
    } catch (e) {
      console.error("Sensitivity error:", e);
      setError(e.message || "Failed to compute sensitivity analysis");
    }
  };

  const compareSequences = () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision);
      if (!compareText.trim()) throw new Error("Comparison input is required");
      if (!["terms", "sum"].includes(calcType)) {
        throw new Error("Comparison requires terms or sum calculation");
      }
      if (isNaN(precisionVal) || precisionVal < 0) {
        throw new Error("Precision must be a non-negative integer");
      }

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
          if (sequenceType === "arithmetic") {
            if (params.length !== 3)
              throw new Error(
                "Arithmetic comparison requires first term, common difference, number of terms"
              );
            parsedParams = {
              firstTerm: parseFloat(params[0]),
              commonDiff: parseFloat(params[1]),
              numTerms: parseInt(params[2]),
            };
          } else if (sequenceType === "geometric") {
            if (params.length !== 3)
              throw new Error("Geometric comparison requires first term, common ratio, number of terms");
            parsedParams = {
              firstTerm: parseFloat(params[0]),
              commonRatio: parseFloat(params[1]),
              numTerms: parseInt(params[2]),
            };
          } else if (sequenceType === "fibonacci") {
            if (params.length !== 2)
              throw new Error("Fibonacci comparison requires number of terms, start with (0 or 1)");
            parsedParams = {
              numTerms: parseInt(params[0]),
              fibStart: params[1],
            };
          }
          if (Object.values(parsedParams).some((v) => isNaN(v) && v !== "0" && v !== "1")) {
            throw new Error("Invalid comparison parameters");
          }
          const result = calculateSequence(sequenceType, calcType, parsedParams, precisionVal);
          results.push({ sequenceType, calcType, params: parsedParams, result, dataset });
        } catch (e) {
          console.warn(`Skipping invalid comparison entry: ${e.message}`);
        }
      }

      if (results.length === 0) throw new Error("No valid sequences to compare");

      let output = `<strong>Sequence Comparison:</strong><br>`;
      output +=
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Parameters</th><th class="p-2">Result</th></tr></thead><tbody>';
      results.forEach((r) => {
        const params =
          r.sequenceType === "fibonacci"
            ? `n=${r.params.numTerms}, start=${r.params.fibStart}`
            : `a₁=${r.params.firstTerm}, ${r.sequenceType === "arithmetic" ? "d" : "r"}=${
                r.sequenceType === "arithmetic" ? r.params.commonDiff : r.params.commonRatio
              }, n=${r.params.numTerms}`;
        const resultText =
          r.calcType === "terms"
            ? `Terms: ${r.result.terms.join(", ")}`
            : `Sum: ${r.result.sum}${r.result.infiniteSum ? `, Infinite Sum: ${r.result.infiniteSum}` : ""}`;
        output += `<tr><td class="p-2">${params}</td><td class="p-2">${resultText}</td></tr>`;
      });
      output += "</tbody></table>";

      setResultContent(output);
      saveToHistory(
        `Comparison: ${results.length} sequences`,
        output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "..."
      );
      updateComparisonChart(results);
      setSuccess("Sequence comparison completed");
    } catch (e) {
      console.error("Compare sequences error:", e);
      setError(e.message || "Failed to compare sequences");
    }
  };

  const updateVisualizations = (results, isBatch) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();

    if (!isBatch && results.length === 1) {
      drawSequenceVisualization(results[0].result);
    } else if (svgRef.current) {
      svgRef.current.innerHTML =
        '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single sequence</text>';
    }

    updateLineChart(results);
    updateBarChart(results);
  };

  const drawSequenceVisualization = (result) => {
    if (!svgRef.current) return;
    svgRef.current.innerHTML = "";
    const width = 500;
    const height = 200;
    svgRef.current.setAttribute("width", width);
    svgRef.current.setAttribute("height", height);

    const terms = result.terms;
    if (!terms || terms.length === 0) return;

    const min = Math.min(...terms);
    const max = Math.max(...terms);
    const range = max - min || 1;
    const scaleX = (width - 60) / (terms.length - 1);
    const scaleY = (height - 60) / range;
    const offsetX = 30;
    const offsetY = height - 30;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = terms
      .map(
        (t, i) =>
          `${i === 0 ? "M" : "L"} ${(i * scaleX + offsetX).toFixed(2)},${(
            offsetY -
            (t - min) * scaleY
          ).toFixed(2)}`
      )
      .join(" ");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#ef4444");
    path.setAttribute("stroke-width", "2");
    svgRef.current.appendChild(path);

    terms.forEach((t, i) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", i * scaleX + offsetX);
      circle.setAttribute("cy", offsetY - (t - min) * scaleY);
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "#ef4444");
      svgRef.current.appendChild(circle);
    });
  };

  const updateLineChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (lineChartRef.current) {
      const datasets = results.map((r, i) => ({
        label: `Sequence ${i + 1}`,
        data: r.result.terms,
        borderColor: ["#ef4444", "#10b981", "#3b82f6"][i % 3],
        fill: false,
      }));
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: Array.from(
            { length: Math.max(...results.map((r) => r.result.terms.length)) },
            (_, i) => i + 1
          ),
          datasets,
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Value" } },
            x: { title: { display: true, text: "Term Number" } },
          },
          plugins: {
            title: { display: true, text: "Sequence Progression" },
          },
        },
      });
    }
  };

  const updateBarChart = (results) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      const values = results.flatMap((r) => r.result.terms);
      const freq = {};
      values.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
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
              backgroundColor: "rgba(239, 68, 68, 0.5)",
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
          plugins: {
            title: { display: true, text: "Term Frequency" },
          },
        },
      });
    }
  };

  const updateSensitivityChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (lineChartRef.current) {
      const datasets = results.map((r, i) => ({
        label: r.label,
        data: r.result.terms,
        borderColor: ["#ef4444", "#10b981", "#3b82f6"][i % 3],
        fill: false,
      }));
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: Array.from(
            { length: Math.max(...results.map((r) => r.result.terms.length)) },
            (_, i) => i + 1
          ),
          datasets,
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Value" } },
            x: { title: { display: true, text: "Term Number" } },
          },
          plugins: {
            title: { display: true, text: "Sensitivity Analysis" },
          },
        },
      });
    }
  };

  const updateComparisonChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (lineChartRef.current) {
      const datasets = results.map((r, i) => ({
        label: r.dataset,
        data: r.result.terms,
        borderColor: ["#ef4444", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"][i % 5],
        fill: false,
      }));
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: Array.from(
            { length: Math.max(...results.map((r) => r.result.terms.length)) },
            (_, i) => i + 1
          ),
          datasets,
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Value" } },
            x: { title: { display: true, text: "Term Number" } },
          },
          plugins: {
            title: { display: true, text: "Sequence Comparison" },
          },
        },
      });
    }
  };

  const clearInputs = () => {
    setFirstTerm("");
    setCommonDiff("");
    setCommonRatio("");
    setNumTerms("");
    setFibStart("0");
    setBatchText("");
    setBatchFile(null);
    setVariation("");
    setCompareText("");
    setPrecision(2);
    clearMessages();
    clearVisualizations();
    setResultContent("");
    setSuccess("Inputs cleared");
  };

  const clearVisualizations = () => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (svgRef.current) svgRef.current.innerHTML = "";
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
    const updatedHistory = [...calculationHistory, { date: new Date().toLocaleString(), params, result }];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("sequenceCalcHistory", JSON.stringify(updatedHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.params}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("sequence_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("sequence_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Sequence Calculation History", 10, 10);
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
    doc.save("sequence_history.pdf");
  };

  const downloadFile = (filename, type, content) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const renderInputFields = () => {
    return (
      <div className="input-group">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            First Term
            <span className="relative group inline-block ml-1 cursor-pointer">
              ?
              <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                First term of the sequence (a₁).
              </span>
            </span>
          </label>
          <input
            type="number"
            value={firstTerm}
            onChange={(e) => setFirstTerm(e.target.value)}
            className="p-3 border rounded-lg w-full"
            placeholder="e.g., 1"
          />
        </div>
        {sequenceType === "arithmetic" && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Common Difference
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Difference between consecutive terms (d).
                </span>
              </span>
            </label>
            <input
              type="number"
              value={commonDiff}
              onChange={(e) => setCommonDiff(e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 2"
            />
          </div>
        )}
        {sequenceType === "geometric" && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Common Ratio
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Ratio between consecutive terms (r).
                </span>
              </span>
            </label>
            <input
              type="number"
              value={commonRatio}
              onChange={(e) => setCommonRatio(e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 2"
            />
          </div>
        )}
        {(sequenceType !== "fibonacci" || sequenceType === "fibonacci") && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Number of Terms
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition group-hover:visible group-hover:opacity-1">
                  {calcType === "nth" ? "Index of term to find (n)" : "Number of terms to generate (n)"}
                </span>
              </span>
            </label>
            <input
              type="number"
              value={numTerms}
              onChange={(e) => setNumTerms(e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 10"
            />
          </div>
        )}
        {sequenceType === "fibonacci" && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Start With
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Start Fibonacci with 0 or 1.
                </span>
              </span>
            </label>
            <select
              value={fibStart}
              onChange={(e) => setFibStart(e.target.value)}
              className="p-3 border rounded-lg w-full"
            >
              <option value="0">0 (0, 1, 1, 2, ...)</option>
              <option value="1">1 (1, 1, 2, 3, ...)</option>
            </select>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Number Sequence Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="input-group">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Sequence Type
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Select the type of sequence to calculate.
                    </span>
                  </span>
                </label>
                <select
                  value={sequenceType}
                  onChange={(e) => setSequenceType(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="arithmetic">Arithmetic Sequence</option>
                  <option value="geometric">Geometric Sequence</option>
                  <option value="fibonacci">Fibonacci Sequence</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Calculation Type
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Choose what to calculate (terms, sum, nth term).
                    </span>
                  </span>
                </label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="terms">Generate Terms</option>
                  <option value="sum">Calculate Sum</option>
                  <option value="nth">Find Nth Term</option>
                </select>
              </div>
              <div>
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
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 2"
                />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Sequence Parameters</h3>
              {renderInputFields()}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV: a₁,d,n;...)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Upload CSV or enter sequences (e.g., 1,2,5;3,4,6).
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
                placeholder="e.g., 1,2,5;3,4,6"
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
                  Variation Value
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Value to vary parameters for sensitivity analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="e.g., 1"
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
                  Compare Sequences (CSV: a₁,d,n;...)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter sequences to compare (e.g., 1,2,5;3,4,6).
                    </span>
                  </span>
                </label>
                <textarea
                  value={compareText}
                  onChange={(e) => setCompareText(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  rows="4"
                  placeholder="e.g., 1,2,5;3,4,6"
                />
                <button
                  onClick={compareSequences}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Compare Sequences
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Sequences
          </button>

          {resultContent && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} className="text-gray-600 mb-4" />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Sequence Visualization</h3>
                <svg ref={svgRef} className="max-w-[500px] h-[200px] mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Term Progression</h3>
                <canvas ref={lineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Term Frequency</h3>
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
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Understanding Number Sequences</h2>
                <p className="text-gray-600 mb-4">
                  Number sequences are ordered lists of numbers following specific patterns, widely used in
                  mathematics, computer science, and finance.
                </p>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Sequence Types</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Arithmetic Sequence:</strong> Terms increase/decrease by a constant difference
                    (e.g., 2, 5, 8, ...; d=3).
                  </li>
                  <li>
                    <strong>Geometric Sequence:</strong> Terms are multiplied by a constant ratio (e.g., 3, 6,
                    12, ...; r=2).
                  </li>
                  <li>
                    <strong>Fibonacci Sequence:</strong> Each term is the sum of the two preceding ones (e.g.,
                    0, 1, 1, 2, 3, ...).
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Key Formulas</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Arithmetic:</strong> nth term = a₁ + (n-1)d; Sum = n/2 * (a₁ + aₙ)
                  </li>
                  <li>
                    <strong>Geometric:</strong> nth term = a₁ * r^(n-1); Sum = a₁ * (1 - r^n)/(1 - r) (finite)
                  </li>
                  <li>
                    <strong>Fibonacci:</strong> F(n) = F(n-1) + F(n-2); No simple closed-form sum.
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Applications</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Mathematics:</strong> Modeling patterns and series.
                  </li>
                  <li>
                    <strong>Finance:</strong> Calculating compound interest (geometric).
                  </li>
                  <li>
                    <strong>Computer Science:</strong> Algorithms and data structures (Fibonacci).
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>Enter parameters (first term, difference/ratio, number of terms).</li>
                  <li>Use batch input for multiple sequences.</li>
                  <li>Visualize sequences with charts and plots.</li>
                  <li>Check history for past calculations.</li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <a
                      href="https://www.khanacademy.org"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Khan Academy: Sequences
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.mathsisfun.com"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Math Is Fun: Sequences
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
