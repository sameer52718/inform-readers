"use client";
import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function GCFCalculator() {
  const [calcMethod, setCalcMethod] = useState("euclidean");
  const [numbers, setNumbers] = useState("");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [statInput, setStatInput] = useState("");
  const [statType, setStatType] = useState("gcf");
  const [variation, setVariation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resultContent, setResultContent] = useState("");
  const [statsContent, setStatsContent] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [lastResults, setLastResults] = useState([]);
  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const factorSvgRef = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("gcfCalcHistory")) || [];
    setCalculationHistory(savedHistory);
  }, []);

  const parseInput = (input) => {
    if (!input.trim()) throw new Error("Input cannot be empty");
    const numbers = input.split(",").map((s) => {
      const num = math.evaluate(s.trim());
      if (!Number.isInteger(num) || num <= 0) throw new Error("Numbers must be positive integers");
      if (num > Number.MAX_SAFE_INTEGER) throw new Error("Number too large");
      return num;
    });
    if (numbers.length < 2) throw new Error("At least two numbers are required");
    return numbers;
  };

  const euclideanGCF = (a, b) => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const getPrimeFactors = (n) => {
    const factors = {};
    let num = n;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      while (num % i === 0) {
        factors[i] = (factors[i] || 0) + 1;
        num /= i;
      }
    }
    if (num > 1) factors[num] = 1;
    return factors;
  };

  const primeGCF = (numbers) => {
    const factorizations = numbers.map(getPrimeFactors);
    const commonPrimes = factorizations.reduce((common, factors) => {
      const result = {};
      for (const prime in common) {
        if (factors[prime]) {
          result[prime] = Math.min(common[prime], factors[prime]);
        }
      }
      return result;
    }, factorizations[0]);
    return Object.entries(commonPrimes).reduce((gcf, [prime, power]) => gcf * Math.pow(prime, power), 1);
  };

  const calculateGCF = (numbers, method) => {
    if (method === "euclidean") {
      return numbers.reduce((gcf, num) => euclideanGCF(gcf, num));
    } else {
      return primeGCF(numbers);
    }
  };

  const calculateLCM = (numbers, gcf) => {
    const product = numbers.reduce((prod, num) => prod * num, 1);
    return product / gcf;
  };

  const calculateParameters = (numbers, method) => {
    const gcf = calculateGCF(numbers, method);
    const lcm = calculateLCM(numbers, gcf);
    const factorizations = numbers.map((num) => ({
      number: num,
      factors: getPrimeFactors(num),
    }));
    return { numbers, gcf, lcm, factorizations };
  };

  const computeCalculation = (numbers, method) => {
    return calculateParameters(numbers, method);
  };

  const processBatch = async (calculations, method, results) => {
    for (const c of calculations) {
      try {
        const nums = c.map((s) => parseInput(s)[0]);
        if (nums.length >= 2) {
          const result = await computeCalculation(nums, method);
          results.push(result);
        }
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const calculate = async () => {
    clearMessages();
    setLoading(true);
    try {
      let results = [];
      let isBatch = batchFile || batchText;

      if (!isBatch) {
        if (!numbers) throw new Error("Numbers are required");
        const nums = parseInput(numbers);
        const result = await computeCalculation(nums, calcMethod);
        results.push(result);
        displayResults(results, calcMethod, isBatch);
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
                .filter((c) => c.length >= 2);
              resolve(parsed);
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          calculations = batchText.split(";").map((c) => c.split(",").map((s) => s.trim()));
        }
        await processBatch(calculations, calcMethod, results);
        if (results.length === 0) throw new Error("No valid calculations in batch input");
        displayResults(results, calcMethod, isBatch);
      }
    } catch (e) {
      setError(e.message || "Invalid input");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const displayResults = (results, method, isBatch) => {
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Numbers</th><th class="p-2">GCF</th><th class="p-2">LCM</th></tr></thead><tbody>';
      results.forEach((r) => {
        output += `<tr><td class="p-2">${r.numbers.join(", ")}</td><td class="p-2">${
          r.gcf
        }</td><td class="p-2">${r.lcm}</td></tr>`;
      });
      output += "</tbody></table>";
      const gcfs = results.map((r) => r.gcf).filter((g) => !isNaN(g));
      if (gcfs.length > 0) {
        const frequency = {};
        gcfs.forEach((g) => (frequency[g] = (frequency[g] || 0) + 1));
        output += `<br><strong>GCF Frequency Table:</strong><br>`;
        output +=
          '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">GCF</th><th class="p-2">Frequency</th></tr></thead><tbody>';
        Object.entries(frequency).forEach(([g, freq]) => {
          output += `<tr><td class="p-2">${g}</td><td class="p-2">${freq}</td></tr>`;
        });
        output += "</tbody></table>";
      }
    } else {
      const r = results[0];
      output = `<strong>Results (${method}):</strong><br>`;
      output += `Numbers: ${r.numbers.join(", ")}<br>`;
      output += `GCF: ${r.gcf}<br>`;
      output += `LCM: ${r.lcm}<br>`;
      output += `<br><strong>Prime Factorizations:</strong><br>`;
      r.factorizations.forEach((f) => {
        const factors = Object.entries(f.factors)
          .map(([prime, power]) => (power > 1 ? `${prime}^${power}` : prime))
          .join(" × ");
        output += `${f.number}: ${factors || "Prime"}<br>`;
      });
    }

    let statsText = "";
    if (isBatch && results.length > 1) {
      const gcfs = results.map((r) => r.gcf).filter((g) => !isNaN(g));
      if (gcfs.length > 0) {
        const stats = {
          mean: math.mean(gcfs),
          median: math.median(gcfs),
          stdDev: math.std(gcfs),
          min: Math.min(...gcfs),
          max: Math.max(...gcfs),
        };
        statsText = `
          <strong>Statistics (GCF):</strong><br>
          Mean: ${stats.mean.toFixed(2)}<br>
          Median: ${stats.median.toFixed(2)}<br>
          Standard Deviation: ${stats.stdDev.toFixed(2)}<br>
          Min: ${stats.min}<br>
          Max: ${stats.max}
        `;
      }
    }

    setResultContent(output);
    setStatsContent(statsText);
    const params = isBatch
      ? `Batch: ${results.length} number sets, Method: ${method}`
      : `Numbers: ${results[0].numbers.join(", ")}`;
    saveToHistory(params, output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "...");
    setLastResults(results);
    updateVisualizations(results, isBatch);
    setSuccess("Calculation completed");
    setTimeout(() => setSuccess(""), 2000);
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const values = statInput
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n) && Number.isInteger(n) && n > 0);
      if (values.length === 0) throw new Error("Invalid value list");
      const stats = {
        mean: math.mean(values),
        median: math.median(values),
        stdDev: math.std(values),
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
      const expression = `Stats(${values.join(", ")}, ${statType})`;
      setResultContent(`<strong>Statistical Analysis (${statType}):</strong><br>${statsText}`);
      setStatsContent("");
      saveToHistory(expression, statsText.replace(/<br>/g, "; "));
      updateBarChart(values, true);
      setSuccess("Statistics calculated");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError("Invalid statistical input: " + e.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const variationVal = parseInt(variation);
      const nums = parseInput(numbers);
      if (!nums) throw new Error("Numbers are required");
      if (isNaN(variationVal) || variationVal <= 0) throw new Error("Invalid variation");
      const results = [];
      for (let v = -variationVal; v <= variationVal; v++) {
        try {
          const variedNumbers = nums.map((n) => Math.max(1, n + v));
          const calc = calculateParameters(variedNumbers, calcMethod);
          results.push({ variation: v, value: calc.gcf });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }
      const resultText = results.map((r) => `Variation ${r.variation}: GCF = ${r.value}`).join("<br>");
      setResultContent(`<strong>Sensitivity Analysis (GCF):</strong><br>${resultText}`);
      setStatsContent("");
      saveToHistory(`Sensitivity (±${variationVal})`, resultText.replace(/<br>/g, "; "));
      updateSensitivityChart(results);
      setSuccess("Sensitivity analysis completed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError("Invalid sensitivity input: " + e.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const updateVisualizations = (results, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (!isBatch && results.length === 1) {
      drawFactorVisualization(results[0].factorizations);
    } else {
      if (factorSvgRef.current) {
        factorSvgRef.current.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single calculation</text>';
      }
    }
    const gcfs = results.map((r) => r.gcf).filter((g) => !isNaN(g));
    if (gcfs.length > 0) {
      updateBarChart(gcfs, false);
    }
  };

  const updateBarChart = (values, isStats) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      const labels = isStats
        ? values.map((_, i) => `Value ${i + 1}`)
        : lastResults.map((_, i) => `Set ${i + 1}`);
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: isStats ? "Value" : "GCF",
              data: values,
              backgroundColor: "#3b82f6",
              borderColor: "#1e40af",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: isStats ? "Value" : "GCF" } },
            x: { title: { display: true, text: isStats ? "Values" : "Number Sets" } },
          },
          plugins: {
            title: { display: true, text: isStats ? "Value Analysis" : "GCF Comparison" },
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
          labels: results.map((r) => `${r.variation}`),
          datasets: [
            {
              label: "GCF",
              data: results.map((r) => r.value),
              borderColor: "#3b82f6",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "GCF" } },
            x: { title: { display: true, text: "Variation" } },
          },
          plugins: {
            title: { display: true, text: "Sensitivity Analysis" },
          },
        },
      });
    }
  };

  const drawFactorVisualization = (factorizations) => {
    if (factorSvgRef.current) {
      factorSvgRef.current.innerHTML = "";
      const width = 500;
      const height = 150;
      factorSvgRef.current.setAttribute("width", width);
      factorSvgRef.current.setAttribute("height", height);
      const numCount = factorizations.length;
      const ySpacing = height / (numCount + 1);
      factorizations.forEach((f, i) => {
        const y = (i + 1) * ySpacing;
        const factors = Object.entries(f.factors)
          .map(([prime, power]) => (power > 1 ? `${prime}^${power}` : prime))
          .join(" × ");
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", 10);
        text.setAttribute("y", y);
        text.setAttribute("fill", "#000");
        text.setAttribute("font-size", "14");
        text.textContent = `${f.number}: ${factors || "Prime"}`;
        factorSvgRef.current.appendChild(text);
      });
    }
  };

  const clearInputs = () => {
    setNumbers("");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setResultContent("");
    setStatsContent("");
    clearMessages();
    if (factorSvgRef.current) factorSvgRef.current.innerHTML = "";
    if (barChartInstance.current) barChartInstance.current.destroy();
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
    localStorage.setItem("gcfCalcHistory", JSON.stringify(updatedHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.params}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("gcf_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("gcf_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("GCF Calculation History", 10, 10);
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
    doc.save("gcf_history.pdf");
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
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Greatest Common Factor Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
          {loading && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg z-50">
              Processing...
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Calculation Method
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Select the method for GCF calculation.
                    </span>
                  </span>
                </label>
                <select
                  value={calcMethod}
                  onChange={(e) => setCalcMethod(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="euclidean">Euclidean Algorithm</option>
                  <option value="prime">Prime Factorization</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Numbers</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Numbers (comma-separated)
                    <span className="relative group inline-block ml-1 cursor-pointer">
                      ?
                      <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                        Enter positive integers (e.g., 48,36,24).
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                    placeholder="e.g., 48,36,24"
                    className="p-3 border rounded-lg w-full"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV: numbers)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Upload CSV or enter number sets (e.g., 48,36,24;60,45,30).
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
                placeholder="e.g., 48,36,24;60,45,30"
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
                  Analyze Values (comma-separated)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter GCF or LCM values for analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                  placeholder="e.g., 12,6,18"
                  className="w-full p-3 border rounded-lg"
                />
                <select
                  value={statType}
                  onChange={(e) => setStatType(e.target.value)}
                  className="p-3 border rounded-lg w-full mt-2"
                >
                  <option value="gcf">GCF</option>
                  <option value="lcm">LCM</option>
                </select>
                <button onClick={calculateStats} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
                  Calculate Statistics
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Variation Range (±)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Number to vary inputs by.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
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
            Learn About GCF and LCM
          </button>

          {(resultContent || statsContent) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} />
              <div dangerouslySetInnerHTML={{ __html: statsContent }} />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Prime Factor Visualization</h3>
                <svg ref={factorSvgRef} className="w-full max-w-[500px] h-[150px] block mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">GCF Comparison</h3>
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
                <h2 className="text-xl font-semibold mb-4">Understanding GCF and LCM</h2>
                <p className="mb-4">
                  The Greatest Common Factor (GCF) is the largest number that divides two or more numbers
                  without a remainder. The Least Common Multiple (LCM) is the smallest number that is a
                  multiple of two or more numbers.
                </p>
                <h3 className="text-md font-medium mb-2">Key Formulas</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Euclidean Algorithm:</strong> GCF(a, b) = GCF(b, a mod b), repeat until remainder
                    is 0.
                  </li>
                  <li>
                    <strong>Prime Factorization:</strong> GCF is the product of common prime factors with the
                    lowest powers.
                  </li>
                  <li>
                    <strong>LCM:</strong> LCM(a, b) = (a · b) / GCF(a, b).
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Simplifying Fractions:</strong> Divide numerator and denominator by GCF.
                  </li>
                  <li>
                    <strong>Finding Common Denominators:</strong> Use LCM for adding fractions.
                  </li>
                  <li>
                    <strong>Problem Solving:</strong> GCF for dividing resources; LCM for scheduling or gear
                    ratios.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Enter positive integers only.</li>
                  <li>Use batch input for multiple number sets.</li>
                  <li>Visualize prime factors with the SVG diagram.</li>
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
                      Khan Academy: GCF and LCM
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.mathsisfun.com"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Math Is Fun: Number Theory
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
