"use client";
import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function AdvancedPermCombCalculator() {
  const [calcType, setCalcType] = useState("permutation");
  const [precision, setPrecision] = useState("2");
  const [n, setN] = useState("");
  const [r, setR] = useState("");
  const [multiset, setMultiset] = useState("");
  const [sequenceItems, setSequenceItems] = useState("");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [probType, setProbType] = useState("lottery");
  const [probN, setProbN] = useState("");
  const [probR, setProbR] = useState("");
  const [compareText, setCompareText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultContent, setResultContent] = useState("");
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const comparisonChartRef = useRef(null);
  const probabilityChartRef = useRef(null);
  const comparisonChartInstance = useRef(null);
  const probabilityChartInstance = useRef(null);
  const sequenceSvgRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("permCombCalcHistory") || "[]");
    setCalculationHistory(stored);
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const showError = (message) => {
    setError(String(message || "An unexpected error occurred"));
  };

  const showSuccess = (message) => {
    setSuccess(String(message || "Operation completed successfully"));
    setTimeout(() => setSuccess(""), 2000);
  };

  const ensureError = (err) => {
    if (err instanceof Error) return err;
    const error = new Error(String(err) || "Unknown error");
    error.stack = new Error().stack;
    return error;
  };

  const stirlingFirst = (n, k) => {
    if (k === 0 && n === 0) return 1;
    if (k === 0 || n === 0 || k > n) return 0;
    if (k === n) return 1;
    return stirlingFirst(n - 1, k - 1) + (n - 1) * stirlingFirst(n - 1, k);
  };

  const stirlingSecond = (n, k) => {
    if (k === 0 && n === 0) return 1;
    if (k === 0 || n === 0 || k > n) return 0;
    if (k === n) return 1;
    return k * stirlingSecond(n - 1, k) + stirlingSecond(n - 1, k - 1);
  };

  const generatePermutations = (items) => {
    if (items.length === 0) return [[]];
    const result = [];
    for (let i = 0; i < items.length; i++) {
      const current = items[i];
      const remaining = items.slice(0, i).concat(items.slice(i + 1));
      const subPerms = generatePermutations(remaining);
      for (const subPerm of subPerms) {
        result.push([current, ...subPerm]);
      }
    }
    return result;
  };

  const generateCombinations = (items, r) => {
    if (r === 0) return [[]];
    if (items.length < r) return [];
    const result = [];
    for (let i = 0; i <= items.length - r; i++) {
      const subCombs = generateCombinations(items.slice(i + 1), r - 1);
      for (const subComb of subCombs) {
        result.push([items[i], ...subComb]);
      }
    }
    return result;
  };

  const calculateCombinatorics = (calcType, n, r, multiset, precision) => {
    n = parseInt(n);
    if (isNaN(n) || n < 0) throw new Error("Total items (n) must be a non-negative integer");

    let result = {},
      formula = "";
    if (calcType === "permutation") {
      if (isNaN(r) || r < 0 || r > n) throw new Error("Selected items (r) must be between 0 and n");
      result.value = math.factorial(n) / math.factorial(n - r);
      formula = `P(${n},${r}) = ${n}! / (${n}-${r})! = ${result.value.toFixed(precision)}`;
    } else if (calcType === "combination") {
      if (isNaN(r) || r < 0 || r > n) throw new Error("Selected items (r) must be between 0 and n");
      result.value = math.combinations(n, r);
      formula = `C(${n},${r}) = ${n}! / (${r}! * (${n}-${r})!) = ${result.value.toFixed(precision)}`;
    } else if (calcType === "permutation-rep") {
      if (isNaN(r) || r < 0) throw new Error("Selected items (r) must be non-negative");
      result.value = Math.pow(n, r);
      formula = `P_rep(${n},${r}) = ${n}^${r} = ${result.value.toFixed(precision)}`;
    } else if (calcType === "combination-rep") {
      if (isNaN(r) || r < 0) throw new Error("Selected items (r) must be non-negative");
      result.value = math.combinations(n + r - 1, r);
      formula = `C_rep(${n},${r}) = C(${n}+${r}-1,${r}) = ${result.value.toFixed(precision)}`;
    } else if (calcType === "circular") {
      result.value = math.factorial(n - 1);
      formula = `Circular P(${n}) = (${n}-1)! = ${result.value.toFixed(precision)}`;
    } else if (calcType === "multiset") {
      if (!multiset) throw new Error("Multiset frequencies required");
      const frequencies = multiset
        .split(",")
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n));
      if (frequencies.length === 0 || frequencies.some((f) => f < 0))
        throw new Error("Invalid multiset frequencies");
      const sum = frequencies.reduce((a, b) => a + b, 0);
      result.value = math.factorial(sum) / frequencies.reduce((prod, f) => prod * math.factorial(f), 1);
      formula = `Multiset P = ${sum}! / (${frequencies.join("! * ")}!) = ${result.value.toFixed(precision)}`;
    } else if (calcType === "stirling-first") {
      if (isNaN(r) || r < 0 || r > n) throw new Error("Number of cycles (k) must be between 0 and n");
      result.value = stirlingFirst(n, r);
      formula = `S1(${n},${r}) = ${result.value.toFixed(precision)}`;
    } else if (calcType === "stirling-second") {
      if (isNaN(r) || r < 0 || r > n) throw new Error("Number of partitions (k) must be between 0 and n");
      result.value = stirlingSecond(n, r);
      formula = `S2(${n},${r}) = ${result.value.toFixed(precision)}`;
    } else if (calcType === "binomial") {
      if (isNaN(r) || r < 0 || r > n) throw new Error("Selected items (r) must be between 0 and n");
      result.value = math.combinations(n, r);
      formula = `Binomial(${n},${r}) = C(${n},${r}) = ${result.value.toFixed(precision)}`;
    } else {
      throw new Error("Invalid calculation type");
    }

    return { result, formula };
  };

  const calculate = async () => {
    clearMessages();
    setLoading(true);
    try {
      const prec = parseInt(precision) || 2;
      if (isNaN(prec) || prec < 0) throw new Error("Precision must be a non-negative integer");

      let results = [];
      const isBatch = batchFile || batchText;

      if (!isBatch) {
        const result = calculateCombinatorics(calcType, n, r, multiset, prec);
        results.push({ calcType, n, r, multiset, result });
        displayResults(results, false);
      } else {
        let pairs = [];
        if (batchFile) {
          pairs = await new Promise((resolve, reject) => {
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
          pairs = batchText
            .split(";")
            .map((s) => s.trim())
            .filter((s) => s && s.includes(","));
          if (pairs.length === 0) throw new Error("No valid pairs provided in batch text");
        }
        await processBatch(pairs, results, calcType, prec);
        if (results.length === 0) throw new Error("No valid pairs found in batch input");
        displayResults(results, true);
      }
      showSuccess("Calculation completed successfully");
    } catch (e) {
      console.error("Calculation error:", ensureError(e).stack);
      showError(e.message || "An unexpected error occurred during calculation");
    } finally {
      setLoading(false);
    }
  };

  const processBatch = async (pairs, results, calcType, precision) => {
    for (const pair of pairs) {
      try {
        const [n, r] = pair.split(",").map((s) => parseInt(s.trim()));
        if (isNaN(n)) throw new Error("Invalid n in batch entry");
        const result = calculateCombinatorics(calcType, n, r, "", precision);
        results.push({ calcType, n, r, multiset: "", result });
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`, { pair });
      }
    }
  };

  const generateSequences = () => {
    clearMessages();
    clearVisualizations();
    try {
      const items = sequenceItems
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      const prec = parseInt(precision) || 2;
      const nVal = parseInt(n);
      const rVal = parseInt(r) || nVal;

      if (!items.length) throw new Error("Sequence items required");
      if (items.length > 5) throw new Error("Sequence generation limited to 5 items for performance");
      if (calcType === "circular" && items.length !== nVal)
        throw new Error("Number of items must equal n for circular permutations");
      if (rVal > items.length) throw new Error("Selected items (r) cannot exceed number of sequence items");

      let sequences = [];
      if (["permutation", "permutation-rep"].includes(calcType)) {
        sequences = generatePermutations(items.slice(0, rVal));
      } else if (["combination", "combination-rep", "binomial"].includes(calcType)) {
        sequences = generateCombinations(items, rVal);
      } else {
        throw new Error("Sequence generation not supported for this calculation type");
      }

      if (!sequences.length) throw new Error("No sequences generated");

      const output = `<strong>Generated Sequences (${sequences.length}):</strong><br>${sequences
        .map((seq) => seq.join(", "))
        .join("<br>")}`;
      setResultContent(output);
      saveToHistory(
        `Sequences: ${items.join(", ")}`,
        output.replace(/<br>/g, "; ").substring(0, 100) + "..."
      );
      drawSequenceVisualization(sequences);
      showSuccess("Sequence generation completed");
    } catch (e) {
      console.error("Sequence generation error:", ensureError(e).stack);
      showError(e.message || "Failed to generate sequences");
    }
  };

  const calculateProbability = () => {
    clearMessages();
    clearVisualizations();
    try {
      const nVal = parseInt(probN);
      const rVal = parseInt(probR);
      const prec = parseInt(precision) || 2;

      if (isNaN(nVal) || nVal < 0) throw new Error("Total outcomes (n) must be non-negative");
      if (isNaN(rVal) || rVal < 0 || rVal > nVal)
        throw new Error("Desired outcomes (r) must be between 0 and n");

      let result, formula;
      if (probType === "lottery") {
        const favorable = math.combinations(nVal, rVal);
        result = { probability: 1 / favorable };
        formula = `P = 1 / C(${nVal},${rVal}) = ${result.probability.toFixed(prec)}`;
      } else {
        const favorable = math.combinations(nVal, rVal);
        const total = Math.pow(nVal, rVal);
        result = { probability: favorable / total };
        formula = `P = C(${nVal},${rVal}) / ${nVal}^${rVal} = ${result.probability.toFixed(prec)}`;
      }

      const output = `<strong>Probability (${probType}):</strong><br>Probability: ${result.probability.toFixed(
        prec
      )}<br>Formula: ${formula}`;
      setResultContent(output);
      saveToHistory(`Probability: n=${nVal}, r=${rVal}`, output.replace(/<br>/g, "; "));
      updateProbabilityChart(result.probability);
      showSuccess("Probability calculation completed");
    } catch (e) {
      console.error("Probability error:", ensureError(e).stack);
      showError(e.message || "Failed to calculate probability");
    }
  };

  const compareCalculations = () => {
    clearMessages();
    clearVisualizations();
    try {
      const prec = parseInt(precision) || 2;
      if (!compareText) throw new Error("Comparison input required");
      const entries = compareText
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s);
      if (entries.length === 0) throw new Error("No valid entries provided");

      const results = [];
      entries.forEach((entry) => {
        try {
          const [n, r, type] = entry.split(",").map((s) => s.trim());
          if (
            !["permutation", "combination", "permutation-rep", "combination-rep", "binomial"].includes(type)
          ) {
            throw new Error(`Invalid type in entry: ${entry}`);
          }
          const result = calculateCombinatorics(type, n, r, "", prec);
          results.push({ calcType: type, n, r, multiset: "", result });
        } catch (e) {
          console.warn(`Skipping invalid entry: ${e.message}`, { entry });
        }
      });

      if (results.length === 0) throw new Error("No valid entries to compare");

      let output = `<strong>Calculation Comparison:</strong><br>`;
      output +=
        '<table class="w-full text-sm text-gray-600 border-collapse border"><thead><tr class="bg-gray-200"><th class="p-2 border">Type</th><th class="p-2 border">n</th><th class="p-2 border">r</th><th class="p-2 border">Result</th></tr></thead><tbody>';
      results.forEach((r) => {
        output += `<tr><td class="p-2 border">${r.calcType}</td><td class="p-2 border">${
          r.n
        }</td><td class="p-2 border">${r.r}</td><td class="p-2 border">${r.result.result.value.toFixed(
          prec
        )}<br>Formula: ${r.result.formula}</td></tr>`;
      });
      output += "</tbody></table>";

      setResultContent(output);
      saveToHistory(
        `Comparison: ${results.length} entries`,
        output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "..."
      );
      updateComparisonChart(results);
      showSuccess("Comparison completed");
    } catch (e) {
      console.error("Compare calculations error:", ensureError(e).stack);
      showError(e.message || "Failed to compare calculations");
    }
  };

  const displayResults = (results, isBatch) => {
    const prec = parseInt(precision) || 2;
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600 border-collapse border"><thead><tr class="bg-gray-200"><th class="p-2 border">n</th><th class="p-2 border">r</th><th class="p-2 border">Result</th></tr></thead><tbody>';
      results.forEach((r) => {
        output += `<tr><td class="p-2 border">${r.n}</td><td class="p-2 border">${
          r.r || "-"
        }</td><td class="p-2 border">${r.result.result.value.toFixed(prec)}<br>Formula: ${
          r.result.formula
        }</td></tr>`;
      });
      output += "</tbody></table>";
    } else {
      const r = results[0];
      output = `<strong>Results (Type: ${r.calcType}, Precision: ${prec}):</strong><br>`;
      output += `Result: ${r.result.result.value.toFixed(prec)}<br>`;
      output += `Formula: ${r.result.formula}`;
    }

    setResultContent(output);
    const params = isBatch
      ? `Batch: ${results.length} pairs, Type: ${results[0].calcType}`
      : `n=${results[0].n}, r=${results[0].r || "-"}`;
    saveToHistory(params, output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "...");
    updateComparisonChart(results);
  };

  const drawSequenceVisualization = (sequences) => {
    try {
      const svg = sequenceSvgRef.current;
      if (!svg) throw new Error("Sequence visual SVG element not found");
      svg.innerHTML = "";

      if (!Array.isArray(sequences) || sequences.length === 0)
        throw new Error("No valid sequences provided for visualization");

      const width = 500;
      const height = Math.min(200, sequences.length * 20 + 20);
      svg.setAttribute("width", width);
      svg.setAttribute("height", height);

      const maxSequences = Math.min(sequences.length, 10);
      const yStep = height / (maxSequences + 1);

      sequences.slice(0, maxSequences).forEach((seq, i) => {
        if (!Array.isArray(seq)) throw new Error(`Invalid sequence at index ${i}: expected array`);
        const textContent = seq.map((item) => String(item).replace(/[<>&"]/g, "")).join(", ");
        if (!textContent) return;

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", "10");
        text.setAttribute("y", (i + 1) * yStep);
        text.setAttribute("fill", "#000");
        text.setAttribute("font-size", "14");
        text.textContent = textContent.length > 50 ? textContent.substring(0, 47) + "..." : textContent;
        svg.appendChild(text);
      });

      if (sequences.length > maxSequences) {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", "10");
        text.setAttribute("y", height - 10);
        text.setAttribute("fill", "#000");
        text.setAttribute("font-size", "12");
        text.textContent = `...and ${sequences.length - maxSequences} more`;
        svg.appendChild(text);
      }
    } catch (e) {
      console.error("Sequence visualization error:", ensureError(e).stack);
      if (sequenceSvgRef.current) {
        sequenceSvgRef.current.innerHTML =
          '<text x="10" y="50" fill="#ef4444" font-size="14">Error: Unable to render visualization</text>';
      }
      showError(`Failed to render sequence visualization: ${e.message}`);
    }
  };

  const updateComparisonChart = (results) => {
    if (comparisonChartInstance.current) comparisonChartInstance.current.destroy();
    if (comparisonChartRef.current) {
      comparisonChartInstance.current = new Chart(comparisonChartRef.current, {
        type: "bar",
        data: {
          labels: results.map((r, i) => `Calc ${i + 1} (${r.calcType})`),
          datasets: [
            {
              label: "Result",
              data: results.map((r) => r.result.result.value),
              backgroundColor: "#ef4444",
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Value" }, beginAtZero: true },
            x: { title: { display: true, text: "Calculation" } },
          },
          plugins: {
            title: { display: true, text: "Result Comparison" },
          },
        },
      });
    }
  };

  const updateProbabilityChart = (probability) => {
    if (probabilityChartInstance.current) probabilityChartInstance.current.destroy();
    if (probabilityChartRef.current) {
      probabilityChartInstance.current = new Chart(probabilityChartRef.current, {
        type: "pie",
        data: {
          labels: ["Success", "Failure"],
          datasets: [
            {
              data: [probability, 1 - probability],
              backgroundColor: ["#ef4444", "#dc2626"],
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: "Probability Distribution" },
          },
        },
      });
    }
  };

  const clearInputs = () => {
    setN("");
    setR("");
    setMultiset("");
    setSequenceItems("");
    setBatchText("");
    setBatchFile(null);
    setPrecision("2");
    setProbN("");
    setProbR("");
    setCompareText("");
    clearMessages();
    clearVisualizations();
    setResultContent("");
  };

  const clearVisualizations = () => {
    if (sequenceSvgRef.current) sequenceSvgRef.current.innerHTML = "";
    if (comparisonChartInstance.current) comparisonChartInstance.current.destroy();
    if (probabilityChartInstance.current) probabilityChartInstance.current.destroy();
    comparisonChartInstance.current = null;
    probabilityChartInstance.current = null;
  };

  const saveToHistory = (params, result) => {
    const newHistory = [...calculationHistory, { date: new Date().toLocaleString(), params, result }];
    setCalculationHistory(newHistory);
    localStorage.setItem("permCombCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.params}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("perm_comb_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("perm_comb_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Permutation & Combination Calculation History", 10, 10);
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
    doc.save("perm_comb_history.pdf");
  };

  const downloadFile = (filename, type, content) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const isMultiset = calcType === "multiset";
  const isCircular = calcType === "circular";
  const rLabel = ["stirling-first", "stirling-second"].includes(calcType)
    ? "Number of Cycles/Partitions (k)"
    : "Selected Items (r)";

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-6xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">
            Advanced Permutation & Combination Calculator
          </h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
          {loading && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg z-50">
              Processing...
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Calculation Type
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Select the type of combinatorial calculation.
                    </span>
                  </span>
                </label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="permutation">Permutation</option>
                  <option value="combination">Combination</option>
                  <option value="permutation-rep">Permutation with Repetition</option>
                  <option value="combination-rep">Combination with Repetition</option>
                  <option value="circular">Circular Permutation</option>
                  <option value="multiset">Multiset Permutation</option>
                  <option value="stirling-first">Stirling Number (First Kind)</option>
                  <option value="stirling-second">Stirling Number (Second Kind)</option>
                  <option value="binomial">Binomial Coefficient</option>
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
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 2"
                />
              </div>
            </div>

            <h3 className="text-md font-medium text-gray-700 mb-2">Parameters</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Total Items (n)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Total number of items.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  placeholder="e.g., 5"
                />
              </div>
              {!isMultiset && !isCircular && (
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {rLabel}
                    <span className="relative group inline-block ml-1 cursor-pointer">
                      ?
                      <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                        Number of items to select.
                      </span>
                    </span>
                  </label>
                  <input
                    type="number"
                    value={r}
                    onChange={(e) => setR(e.target.value)}
                    className="p-3 border rounded-lg w-full"
                    placeholder="e.g., 3"
                  />
                </div>
              )}
              {isMultiset && (
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Multiset Frequencies (Comma-Separated)
                    <span className="relative group inline-block ml-1 cursor-pointer">
                      ?
                      <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                        Frequencies of items (e.g., 2,3,1).
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={multiset}
                    onChange={(e) => setMultiset(e.target.value)}
                    className="p-3 border rounded-lg w-full"
                    placeholder="e.g., 2,3,1"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Generate Sequences
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Enter items to generate permutation/combination sequences.
                  </span>
                </span>
              </label>
              <input
                type="text"
                value={sequenceItems}
                onChange={(e) => setSequenceItems(e.target.value)}
                className="p-3 border rounded-lg w-full mb-2"
                placeholder="e.g., A,B,C"
              />
              <button onClick={generateSequences} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                Generate Sequences
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV File or Text: n,r;...)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Upload CSV or enter pairs (e.g., 5,3;4,2).
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
                placeholder="e.g., 5,3;4,2"
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
            <button
              onClick={() => showSuccess("Calculation saved to history")}
              className="bg-red-500 text-white px-6 py-3 rounded-lg"
            >
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Probability Scenario
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Calculate probability for real-world scenarios.
                    </span>
                  </span>
                </label>
                <select
                  value={probType}
                  onChange={(e) => setProbType(e.target.value)}
                  className="p-3 border rounded-lg w-full mb-2"
                >
                  <option value="lottery">Lottery Odds</option>
                  <option value="event">Event Probability</option>
                </select>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Total Outcomes (n)</label>
                    <input
                      type="number"
                      value={probN}
                      onChange={(e) => setProbN(e.target.value)}
                      className="p-3 border rounded-lg w-full"
                      placeholder="e.g., 49"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Desired Outcomes (r)
                    </label>
                    <input
                      type="number"
                      value={probR}
                      onChange={(e) => setProbR(e.target.value)}
                      className="p-3 border rounded-lg w-full"
                      placeholder="e.g., 6"
                    />
                  </div>
                </div>
                <button
                  onClick={calculateProbability}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Calculate Probability
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Compare Calculations (CSV: n,r,type;...)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter inputs to compare (e.g., 5,3,permutation;4,2,combination).
                    </span>
                  </span>
                </label>
                <textarea
                  value={compareText}
                  onChange={(e) => setCompareText(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                  rows="4"
                  placeholder="e.g., 5,3,permutation;4,2,combination"
                />
                <button
                  onClick={compareCalculations}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Compare Calculations
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Permutations & Combinations
          </button>

          {resultContent && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} className="text-gray-600 mb-4" />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Sequence Visualization</h3>
                <svg ref={sequenceSvgRef} className="w-full max-w-[500px] mx-auto block"></svg>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Result Comparison</h3>
                <canvas ref={comparisonChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Probability Distribution</h3>
                <canvas ref={probabilityChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 max-h-[200px] overflow-y-auto">
                <h3 className="text-md font-medium text-red-900">Calculation History</h3>
                <table className="w-full text-sm text-gray-600 border-collapse border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Parameters</th>
                      <th className="p-2 border">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationHistory.map((entry) => (
                      <tr key={entry.date}>
                        <td className="p-2 border">{entry.date}</td>
                        <td className="p-2 border">{entry.params}</td>
                        <td className="p-2 border">{entry.result}</td>
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

          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-[600px] w-[90%] relative">
                <span
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Understanding Permutations & Combinations
                </h2>
                <p className="mb-4 text-gray-600">
                  Permutations and combinations are fundamental concepts in combinatorics, used to count
                  arrangements and selections of items.
                </p>
                <h3 className="text-md font-medium text-gray-700 mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>
                    <strong>Permutation:</strong> Ordered arrangement of r items from n. Formula: P(n,r) = n!
                    / (n-r)!
                  </li>
                  <li>
                    <strong>Combination:</strong> Unordered selection of r items from n. Formula: C(n,r) = n!
                    / (r!(n-r)!)
                  </li>
                  <li>
                    <strong>Permutation with Repetition:</strong> Ordered arrangement allowing repeats.
                    Formula: n^r
                  </li>
                  <li>
                    <strong>Combination with Repetition:</strong> Unordered selection allowing repeats.
                    Formula: C(n+r-1,r)
                  </li>
                  <li>
                    <strong>Circular Permutation:</strong> Arrangements in a circle. Formula: (n-1)!
                  </li>
                  <li>
                    <strong>Multiset Permutation:</strong> Arrangements of items with repetitions. Formula: n!
                    / (n₁! n₂! ... nₖ!)
                  </li>
                  <li>
                    <strong>Stirling Numbers:</strong> Count partitions or permutations with specific
                    properties.
                  </li>
                  <li>
                    <strong>Binomial Coefficient:</strong> Same as combination, used in binomial theorem.
                    Formula: C(n,r)
                  </li>
                </ul>
                <h3 className="text-md font-medium text-gray-700 mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>
                    <strong>Probability:</strong> Calculate odds in games like lotteries.
                  </li>
                  <li>
                    <strong>Cryptography:</strong> Generate secure keys or codes.
                  </li>
                  <li>
                    <strong>Statistics:</strong> Analyze sample spaces.
                  </li>
                  <li>
                    <strong>Computer Science:</strong> Optimize algorithms for scheduling or sorting.
                  </li>
                </ul>
                <h3 className="text-md font-medium text-gray-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Ensure n ≥ r for permutations and combinations.</li>
                  <li>Use batch input for multiple calculations (e.g., "5,3;4,2").</li>
                  <li>Sequence generation is limited to small sets to avoid performance issues.</li>
                  <li>Check input formats for multiset or comparison modes.</li>
                </ul>
                <h3 className="text-md font-medium text-gray-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>
                    <a
                      href="https://www.khanacademy.org/math/statistics-probability/counting-permutations-and-combinations"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Khan Academy: Combinatorics
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://brilliant.org/wiki/permutations-and-combinations/"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Brilliant: Permutations & Combinations
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
