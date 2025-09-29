"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function ConfidenceIntervalCalculator() {
  const [calcType, setCalcType] = useState("mean-known");
  const [confidenceLevel, setConfidenceLevel] = useState("95");
  const [params, setParams] = useState({});
  const [marginError, setMarginError] = useState("");
  const [sampleSD, setSampleSD] = useState("");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState(null);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const ciChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("ciCalcHistory")) || [];
    setCalculationHistory(savedHistory);
    updateInputFields(calcType);
  }, []);

  const zScores = { 90: 1.645, 95: 1.96, 99: 2.576 };

  const getTScore = (alpha, df) => {
    if (df <= 0) throw new Error("Degrees of freedom must be positive");
    const z = zScores[Math.round((1 - alpha) * 100)] || 1.96;
    if (df > 30) return z;
    return z * (1 + 1 / (4 * df));
  };

  const getCriticalValue = (confidenceLevel, df, useT = false) => {
    const alpha = (100 - confidenceLevel) / 100;
    if (useT) return getTScore(alpha / 2, df);
    return zScores[confidenceLevel] || 1.96;
  };

  const updateInputFields = (type) => {
    const newParams = {};
    if (type === "mean-known" || type === "mean-unknown") {
      newParams.mean = "";
      newParams.sd = "";
      newParams.n = "";
    } else if (type === "proportion") {
      newParams.p = "";
      newParams.n = "";
    } else if (type === "diff-means") {
      newParams.mean1 = "";
      newParams.mean2 = "";
      newParams.sd1 = "";
      newParams.sd2 = "";
      newParams.n1 = "";
      newParams.n2 = "";
    } else if (type === "diff-proportions") {
      newParams.p1 = "";
      newParams.p2 = "";
      newParams.n1 = "";
      newParams.n2 = "";
    }
    setParams(newParams);
  };

  const calculateConfidenceInterval = (calcType, params, confidenceLevel) => {
    const alpha = (100 - confidenceLevel) / 100;
    let result = {},
      formula = "";

    if (calcType === "mean-known") {
      const { mean, sd, n } = params;
      if (isNaN(mean) || isNaN(sd) || isNaN(n)) throw new Error("Invalid input parameters");
      if (sd <= 0) throw new Error("Standard deviation must be positive");
      if (n <= 0) throw new Error("Sample size must be positive");
      const z = getCriticalValue(confidenceLevel);
      const se = sd / Math.sqrt(n);
      const margin = z * se;
      result = { lower: mean - margin, upper: mean + margin, margin, se };
      formula = `CI = ${mean} ± ${z.toFixed(3)} * (${sd}/√${n}) = [${result.lower.toFixed(
        3
      )}, ${result.upper.toFixed(3)}]`;
    } else if (calcType === "mean-unknown") {
      const { mean, sd, n } = params;
      if (isNaN(mean) || isNaN(sd) || isNaN(n)) throw new Error("Invalid input parameters");
      if (sd <= 0) throw new Error("Standard deviation must be positive");
      if (n <= 1) throw new Error("Sample size must be greater than 1 for t-distribution");
      const t = getCriticalValue(confidenceLevel, n - 1, true);
      const se = sd / Math.sqrt(n);
      const margin = t * se;
      result = { lower: mean - margin, upper: mean + margin, margin, se };
      formula = `CI = ${mean} ± ${t.toFixed(3)} * (${sd}/√${n}) = [${result.lower.toFixed(
        3
      )}, ${result.upper.toFixed(3)}]`;
    } else if (calcType === "proportion") {
      const { p, n } = params;
      if (isNaN(p) || isNaN(n)) throw new Error("Invalid input parameters");
      if (p < 0 || p > 1) throw new Error("Proportion must be between 0 and 1");
      if (n <= 0) throw new Error("Sample size must be positive");
      const z = getCriticalValue(confidenceLevel);
      const se = Math.sqrt((p * (1 - p)) / n);
      const margin = z * se;
      result = { lower: Math.max(0, p - margin), upper: Math.min(1, p + margin), margin, se };
      formula = `CI = ${p} ± ${z.toFixed(3)} * √((${p} * (1-${p}))/${n}) = [${result.lower.toFixed(
        3
      )}, ${result.upper.toFixed(3)}]`;
    } else if (calcType === "diff-means") {
      const { mean1, mean2, sd1, sd2, n1, n2 } = params;
      if (isNaN(mean1) || isNaN(mean2) || isNaN(sd1) || isNaN(sd2) || isNaN(n1) || isNaN(n2))
        throw new Error("Invalid input parameters");
      if (sd1 <= 0 || sd2 <= 0) throw new Error("Standard deviations must be positive");
      if (n1 <= 0 || n2 <= 0) throw new Error("Sample sizes must be positive");
      const z = getCriticalValue(confidenceLevel);
      const se = Math.sqrt((sd1 * sd1) / n1 + (sd2 * sd2) / n2);
      const diff = mean1 - mean2;
      const margin = z * se;
      result = { lower: diff - margin, upper: diff + margin, margin, se };
      formula = `CI = (${mean1} - ${mean2}) ± ${z.toFixed(
        3
      )} * √((${sd1}^2/${n1}) + (${sd2}^2/${n2})) = [${result.lower.toFixed(3)}, ${result.upper.toFixed(3)}]`;
    } else if (calcType === "diff-proportions") {
      const { p1, p2, n1, n2 } = params;
      if (isNaN(p1) || isNaN(p2) || isNaN(n1) || isNaN(n2)) throw new Error("Invalid input parameters");
      if (p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1) throw new Error("Proportions must be between 0 and 1");
      if (n1 <= 0 || n2 <= 0) throw new Error("Sample sizes must be positive");
      const z = getCriticalValue(confidenceLevel);
      const se = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2);
      const diff = p1 - p2;
      const margin = z * se;
      result = { lower: diff - margin, upper: diff + margin, margin, se };
      formula = `CI = (${p1} - ${p2}) ± ${z.toFixed(
        3
      )} * √((${p1}(1-${p1})/${n1}) + (${p2}(1-${p2})/${n2})) = [${result.lower.toFixed(
        3
      )}, ${result.upper.toFixed(3)}]`;
    }
    return { result, formula };
  };

  const calculateSampleSize = () => {
    clearMessages();
    try {
      if (!marginError || marginError <= 0) throw new Error("Margin of error must be positive");
      if (!confidenceLevel || confidenceLevel <= 0 || confidenceLevel >= 100)
        throw new Error("Confidence level must be between 0 and 100");
      if (!sampleSD || sampleSD <= 0) throw new Error("Standard deviation or proportion must be positive");

      const z = getCriticalValue(parseFloat(confidenceLevel));
      let result, formula;
      if (calcType.includes("proportion")) {
        const p = sampleSD > 1 ? 0.5 : parseFloat(sampleSD);
        result = Math.ceil((z * z * p * (1 - p)) / (parseFloat(marginError) * parseFloat(marginError)));
        formula = `n = (${z.toFixed(3)}^2 * ${p} * (1-${p})) / ${marginError}^2 = ${result}`;
      } else {
        result = Math.ceil(((z * parseFloat(sampleSD)) / parseFloat(marginError)) ** 2);
        formula = `(( ${z.toFixed(3)} * ${sampleSD} ) / ${marginError} )^2 = ${result}`;
      }

      setResults({
        text: `<strong>Sample Size Calculation:</strong><br>Required Sample Size: ${result}<br>Formula: ${formula}`,
      });

      saveToHistory(`Sample Size: E=${marginError}, CL=${confidenceLevel}%`, `Sample Size: ${result}`);
      setSuccess("Sample size calculation completed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      showError(e.message || "Failed to calculate sample size");
    }
  };

  const calculate = async () => {
    clearMessages();
    try {
      if (isNaN(confidenceLevel) || confidenceLevel <= 0 || confidenceLevel >= 100)
        throw new Error("Confidence level must be between 0 and 100");

      let results = [];
      let isBatch = batchFile || batchText;

      if (!isBatch) {
        const result = calculateConfidenceInterval(calcType, params, parseFloat(confidenceLevel));
        results.push({ calcType, params, confidenceLevel: parseFloat(confidenceLevel), result });
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
            const batchParams = {};
            if (calcType === "mean-known" || calcType === "mean-unknown") {
              if (values.length < 3) continue;
              batchParams.n = values[0];
              batchParams.mean = values[1];
              batchParams.sd = values[2];
            } else if (calcType === "proportion") {
              if (values.length < 2) continue;
              batchParams.n = values[0];
              batchParams.p = values[1];
            }
            const result = calculateConfidenceInterval(calcType, batchParams, parseFloat(confidenceLevel));
            results.push({
              calcType,
              params: batchParams,
              confidenceLevel: parseFloat(confidenceLevel),
              result,
            });
          } catch (e) {
            console.warn(`Skipping invalid batch entry: ${e.message}`);
          }
        }
      }

      if (results.length === 0) throw new Error("No valid datasets found");

      displayResults(results, isBatch);
      updateCIPlot(results);
      setSuccess("Calculation completed successfully");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      showError(e.message || "An unexpected error occurred during calculation");
    }
  };

  const displayResults = (results, isBatch) => {
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Parameters</th><th class="p-2">CI</th><th class="p-2">Margin of Error</th></tr></thead><tbody>';
      results.forEach((r) => {
        const paramsStr = r.calcType.includes("proportion")
          ? `n=${r.params.n}, p=${r.params.p}`
          : `n=${r.params.n}, mean=${r.params.mean}, sd=${r.params.sd}`;
        output += `<tr><td class="p-2">${paramsStr}</td><td class="p-2">[${r.result.result.lower.toFixed(
          3
        )}, ${r.result.result.upper.toFixed(3)}]</td><td class="p-2">${r.result.result.margin.toFixed(
          3
        )}</td></tr>`;
      });
      output += "</tbody></table>";
    } else {
      const r = results[0];
      const paramsStr = r.calcType.includes("proportion")
        ? `n=${r.params.n}, p=${r.params.p}`
        : `n=${r.params.n}, mean=${r.params.mean}, sd=${r.params.result}`;
      output = `<strong>Confidence Interval (Type: ${r.calcType}, ${
        r.confidenceLevel
      }%):</strong><br>result:${paramsStr}<br>CI: [${r.result.result.lower.toFixed(
        3
      )}, ${r.result.result.upper.toFixed(3)}]<br>Margin: ${r.result.margin.toFixed(3)}<br>Formula: ${
        r.result.formula
      }`;
    }

    setResults(results.map((r) => output));
    saveToHistory(
      isBatch ? `Batch: ${results.length} datasets` : `${results[0].calcType}`,
      output.replace(/<[^>]+>/g, ";").substring(0, 100)
    );
  };

  const updateCIPlot = (results) => {
    if (chartInstance.current) chartInstance.current.destroy();
    const labels = results.map((r, i) => `CI ${i + 1} (${r.calcType})`);
    const data = results.map((r) => ({
      x: (r.result.result.lower + r.result.result.upper) / 2,
      xMin: r.result.result.lower,
      xMax: r.result.result.upper,
    }));

    chartInstance.current = new Chart(ciChartRef.current, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Confidence Interval",
            data: data,
            backgroundColor: "#f44336",
            borderColor: "#b71c1c",
            borderWidth: 1,
            errorBars: {
              x: {
                color: "#b71c1c",
                lineWidth: 2,
              },
            },
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Calculation" } },
          y: { title: { display: true, text: "Value" } },
        },
        plugins: {
          title: { display: true, text: "Confidence Interval Plot" },
        },
      },
    });
  };

  const clearInputs = () => {
    clearMessages();
    updateInputFields(calcType);
    setConfidenceLevel("95");
    setMarginError("");
    setSampleSD("");
    setBatchText("");
    setBatchFile(null);
    setResults(null);
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
    setSuccess("Calculation completed");
    setTimeout(() => setSuccess(""), 2000);
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const saveToHistory = (params, result) => {
    const updatedHistory = [...calculationHistory, { date: new Date().toLocaleString(), params, result }];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("ciCalcHistory", JSON.stringify(updatedHistory));
  };

  const exportCSV = () => {
    const csv = [
      ["Date", "Type", "Result", "Status"],
      ...calculationHistory.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ci_history.csv";
    link.click();
    URL.revokeObjectURL(blob);
  };

  const exportJSON = () => {
    const json = new Blob([JSON.stringify(calculationHistory, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(json);
    link.download = "ci_history.json";
    link.click();
    URL.revokeObjectURL(json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Confidence Interval Calculation History", 10, 10);
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
    doc.save("ci_history.pdf");
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-6xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Confidence Interval Calculator</h1>

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
                    Select the type of confidence interval.
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
                <option value="mean-known">Mean (Known Variance)</option>
                <option value="mean-unknown">Mean (Unknown Variance)</option>
                <option value="proportion">Proportion</option>
                <option value="diff-means">Difference in Means</option>
                <option value="diff-proportions">Difference in Proportions</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Confidence Level (%)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Percentage for confidence interval (e.g., 95).
                  </span>
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(e.target.value)}
                placeholder="e.g., 95"
                className="p-3 border rounded-lg w-full"
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Parameters</h3>
            <div className="flex flex-wrap gap-4">
              {calcType === "mean-known" || calcType === "mean-unknown" ? (
                <>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Mean
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Sample mean (x̄).
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.mean || ""}
                      onChange={(e) => setParams({ ...params, mean: e.target.value })}
                      placeholder="e.g., 50"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {calcType === "mean-known"
                        ? "Population Standard Deviation"
                        : "Sample Standard Deviation"}
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          {calcType === "mean-known" ? "Population SD (σ)" : "Sample SD (s)"}
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.sd || ""}
                      onChange={(e) => setParams({ ...params, sd: e.target.value })}
                      placeholder="e.g., 10"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Size (n)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Number of observations.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.n || ""}
                      onChange={(e) => setParams({ ...params, n: e.target.value })}
                      placeholder="e.g., 30"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                </>
              ) : calcType === "proportion" ? (
                <>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Proportion (p̂)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Proportion of successes (e.g., 0.4).
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max="1"
                      value={params.p || ""}
                      onChange={(e) => setParams({ ...params, p: e.target.value })}
                      placeholder="e.g., 0.4"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Size (n)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Number of observations.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.n || ""}
                      onChange={(e) => setParams({ ...params, n: e.target.value })}
                      placeholder="e.g., 100"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                </>
              ) : calcType === "diff-means" ? (
                <>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Mean 1 (x̄₁)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Mean of first sample.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.mean1 || ""}
                      onChange={(e) => setParams({ ...params, mean1: e.target.value })}
                      placeholder="e.g., 50"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Mean 2 (x̄₂)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Mean of second sample.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.mean2 || ""}
                      onChange={(e) => setParams({ ...params, mean2: e.target.value })}
                      placeholder="e.g., 45"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Standard Deviation 1 (σ₁ or s₁)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          SD of first sample.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.sd1 || ""}
                      onChange={(e) => setParams({ ...params, sd1: e.target.value })}
                      placeholder="e.g., 10"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Standard Deviation 2 (σ₂ or s₂)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          SD of second sample.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.sd2 || ""}
                      onChange={(e) => setParams({ ...params, sd2: e.target.value })}
                      placeholder="e.g., 8"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Size 1 (n₁)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Size of first sample.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.n1 || ""}
                      onChange={(e) => setParams({ ...params, n1: e.target.value })}
                      placeholder="e.g., 30"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Size 2 (n₂)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Size of second sample.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.n2 || ""}
                      onChange={(e) => setParams({ ...params, n2: e.target.value })}
                      placeholder="e.g., 25"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                </>
              ) : calcType === "diff-proportions" ? (
                <>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Proportion 1 (p̂₁)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Proportion of first sample.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max="1"
                      value={params.p1 || ""}
                      onChange={(e) => setParams({ ...params, p1: e.target.value })}
                      placeholder="e.g., 0.4"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Proportion 2 (p̂₂)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Proportion of second sample.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max="1"
                      value={params.p2 || ""}
                      onChange={(e) => setParams({ ...params, p2: e.target.value })}
                      placeholder="e.g., 0.3"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Size 1 (n₁)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Size of first sample.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.n1 || ""}
                      onChange={(e) => setParams({ ...params, n1: e.target.value })}
                      placeholder="e.g., 100"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Sample Size 2 (n₂)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Size of second sample.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={params.n2 || ""}
                      onChange={(e) => setParams({ ...params, n2: e.target.value })}
                      placeholder="e.g., 120"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Sample Size Calculator</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Margin of Error
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Desired margin of error (e.g., 0.05).
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={marginError}
                  onChange={(e) => setMarginError(e.target.value)}
                  placeholder="e.g., 0.05"
                  className="p-3 border rounded-lg w-full"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Standard Deviation (or p for Proportion)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Estimated SD or proportion (default 0.5 for proportion).
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={sampleSD}
                  onChange={(e) => setSampleSD(e.target.value)}
                  placeholder="e.g., 0.5"
                  className="p-3 border rounded-lg w-full"
                />
              </div>
              <div className="flex-1 min-w-[150px] flex items-end">
                <button onClick={calculateSampleSize} className="bg-red-500 text-white p-3 rounded-lg w-full">
                  Calculate Sample Size
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Batch Input (CSV File or Text: n,mean,sd,confidence_level;...)
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Upload CSV or enter datasets (e.g., 30,50,10,95).
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
              placeholder="e.g., 30,50,10,95;20,45,8,90"
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
            <button
              onClick={() => {
                saveToHistory("Manual Save", results ? results.text : "No results");
                setSuccess("Calculation saved to history");
                setTimeout(() => setSuccess(""), 2000);
              }}
              className="bg-red-500 text-white px-6 py-3 rounded-lg"
            >
              Save Calculation
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Confidence Intervals
          </button>

          {results && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: results.text || results[0] }} />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Confidence Interval Plot</h3>
                <canvas ref={ciChartRef} className="max-w-[600px] max-h-80 mx-auto" />
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
                <h2 className="text-xl font-semibold mb-4">Understanding Confidence Intervals</h2>
                <p className="mb-4">
                  A confidence interval (CI) is a range of values that likely contains the true population
                  parameter, estimated from sample data, with a specified confidence level (e.g., 95%).
                </p>
                <h3 className="text-md font-medium mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Confidence Level:</strong> Probability (e.g., 95%) that the CI contains the true
                    parameter.
                  </li>
                  <li>
                    <strong>Margin of Error:</strong> Half the width of the CI, determined by the critical
                    value and standard error.
                  </li>
                  <li>
                    <strong>Z-Score:</strong> Critical value from the standard normal distribution (e.g., 1.96
                    for 95%).
                  </li>
                  <li>
                    <strong>T-Score:</strong> Critical value from the t-distribution, used for small samples
                    or unknown variance.
                  </li>
                  <li>
                    <strong>Standard Error:</strong> Measure of sample statistic variability (e.g., σ/√n).
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Formulas</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Mean (Known Variance):</strong> x̄ ± zα/2 * σ/√n
                  </li>
                  <li>
                    <strong>Mean (Unknown Variance):</strong> x̄ ± tα/2,n-1 * s/√n
                  </li>
                  <li>
                    <strong>Proportion:</strong> p̂ ± zα/2 * √(p̂(1-p̂)/n)
                  </li>
                  <li>
                    <strong>Difference in Means:</strong> (x̄₁ - x̄₂) ± zα/2 * √(σ₁²/n₁ + σ₂²/n₂)
                  </li>
                  <li>
                    <strong>Difference in Proportions:</strong> (p̂₁ - p̂₂) ± zα/2 * √(p̂₁(1-p̂₁)/n₁ +
                    p̂₂(1-p̂₂)/n₂)
                  </li>
                  <li>
                    <strong>Sample Size (Mean):</strong> n = (zα/2 * σ/E)²
                  </li>
                  <li>
                    <strong>Sample Size (Proportion):</strong> n = zα/2² * p(1-p)/E²
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Statistics:</strong> Estimate population parameters (e.g., mean income).
                  </li>
                  <li>
                    <strong>Medical Research:</strong> Assess treatment effects.
                  </li>
                  <li>
                    <strong>Polling:</strong> Report survey results with margins of error.
                  </li>
                  <li>
                    <strong>Quality Control:</strong> Monitor production processes.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Ensure sample size is sufficient for reliable CIs.</li>
                  <li>Use t-distribution for small samples (n {"<"} 30) or unknown variance.</li>
                  <li>For proportions, n * p̂ ≥ 5 and n * (1-p̂) ≥ 5 for normality.</li>
                  <li>
                    Batch input format: "n,mean,sd,confidence_level" for means; "n,p,confidence_level" for
                    proportions.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Resources</h3>
                <p className="mb-4">For more information, visit:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <a
                      href="https://www.khanacademy.org/math/statistics-probability/confidence-intervals-one-sample"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Khan Academy: Confidence Intervals
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      NIST: Confidence Intervals
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
