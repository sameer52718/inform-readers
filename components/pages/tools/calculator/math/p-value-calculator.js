"use client";
import { useState, useEffect, useRef } from "react";
import jStat from "jstat";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function AdvancedPValueCalculator() {
  const [testType, setTestType] = useState("z-test");
  const [tailType, setTailType] = useState("two-tailed");
  const [alpha, setAlpha] = useState("0.05");
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resultContent, setResultContent] = useState(null);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const distributionChartRef = useRef(null);
  const frequencyChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const distributionChartInstance = useRef(null);
  const frequencyChartInstance = useRef(null);
  const trendChartInstance = useRef(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("pValueCalcHistory") || "[]").filter(
        (entry) =>
          entry &&
          typeof entry.date === "string" &&
          typeof entry.test === "string" &&
          typeof entry.input === "string" &&
          typeof entry.pValue === "string"
      );
      setCalculationHistory(stored);
    } catch (e) {
      console.error("Failed to load history:", e);
    }
    updateInputFields();
  }, []);

  const updateInputFields = () => {
    if (testType === "z-test") {
      setInputs({
        sampleMean: "",
        popMean: "",
        popStd: "",
        sampleSize: "",
      });
    } else if (testType === "t-test") {
      setInputs({
        sampleData: "",
        popMean: "",
      });
    } else if (testType === "two-sample-t") {
      setInputs({
        sample1Data: "",
        sample2Data: "",
      });
    } else if (testType === "chi-square") {
      setInputs({
        observed: "",
        expected: "",
      });
    }
  };

  useEffect(() => {
    updateInputFields();
  }, [testType]);

  const validateInputs = () => {
    const alphaVal = parseFloat(alpha);
    if (isNaN(alphaVal) || alphaVal <= 0 || alphaVal >= 1) {
      throw new Error("Significance level must be between 0 and 1");
    }

    let validatedInputs = {};
    if (testType === "z-test") {
      const { sampleMean, popMean, popStd, sampleSize } = inputs;
      const sampleMeanVal = parseFloat(sampleMean);
      const popMeanVal = parseFloat(popMean);
      const popStdVal = parseFloat(popStd);
      const sampleSizeVal = parseInt(sampleSize);
      if (isNaN(sampleMeanVal) || isNaN(popMeanVal) || isNaN(popStdVal) || isNaN(sampleSizeVal)) {
        throw new Error("All z-test fields are required");
      }
      if (popStdVal <= 0) throw new Error("Population standard deviation must be positive");
      if (sampleSizeVal <= 0) throw new Error("Sample size must be positive");
      validatedInputs = {
        sampleMean: sampleMeanVal,
        popMean: popMeanVal,
        popStd: popStdVal,
        sampleSize: sampleSizeVal,
      };
    } else if (testType === "t-test") {
      const { sampleData, popMean } = inputs;
      if (!sampleData) throw new Error("Sample data is required");
      const sampleDataVal = sampleData
        .split(",")
        .map((x) => parseFloat(x.trim()))
        .filter((x) => !isNaN(x));
      const popMeanVal = parseFloat(popMean);
      if (sampleDataVal.length < 2) throw new Error("At least 2 sample values required");
      if (isNaN(popMeanVal)) throw new Error("Population mean required");
      validatedInputs = { sampleData: sampleDataVal, popMean: popMeanVal };
    } else if (testType === "two-sample-t") {
      const { sample1Data, sample2Data } = inputs;
      if (!sample1Data || !sample2Data) throw new Error("Both sample datasets are required");
      const sample1DataVal = sample1Data
        .split(",")
        .map((x) => parseFloat(x.trim()))
        .filter((x) => !isNaN(x));
      const sample2DataVal = sample2Data
        .split(",")
        .map((x) => parseFloat(x.trim()))
        .filter((x) => !isNaN(x));
      if (sample1DataVal.length < 2 || sample2DataVal.length < 2) {
        throw new Error("Each sample needs at least 2 values");
      }
      validatedInputs = { sample1Data: sample1DataVal, sample2Data: sample2DataVal };
    } else if (testType === "chi-square") {
      const { observed, expected } = inputs;
      if (!observed || !expected) throw new Error("Observed and expected frequencies are required");
      const observedVal = observed
        .split(",")
        .map((x) => parseFloat(x.trim()))
        .filter((x) => !isNaN(x));
      const expectedVal = expected
        .split(",")
        .map((x) => parseFloat(x.trim()))
        .filter((x) => !isNaN(x));
      if (observedVal.length < 2 || observedVal.length !== expectedVal.length) {
        throw new Error("Observed and expected frequencies must match and have at least 2 values");
      }
      if (observedVal.some((x) => x < 0) || expectedVal.some((x) => x <= 0)) {
        throw new Error("Frequencies must be non-negative (expected > 0)");
      }
      validatedInputs = { observed: observedVal, expected: expectedVal };
    }
    return { testType, tailType, alpha: alphaVal, inputs: validatedInputs };
  };

  const calculatePValue = () => {
    clearMessages();
    clearVisualizations();
    try {
      const { testType, tailType, alpha, inputs } = validateInputs();
      let result = {};
      let steps = [];

      if (testType === "z-test") {
        const { sampleMean, popMean, popStd, sampleSize } = inputs;
        const standardError = popStd / Math.sqrt(sampleSize);
        const z = (sampleMean - popMean) / standardError;
        let pValue;
        if (tailType === "two-tailed") {
          pValue = 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1));
        } else if (tailType === "left-tailed") {
          pValue = jStat.normal.cdf(z, 0, 1);
        } else {
          pValue = 1 - jStat.normal.cdf(z, 0, 1);
        }
        steps = [
          `Formula: Z = (Sample Mean - Population Mean) / (Population Std Dev / √Sample Size)`,
          `Standard Error = ${popStd} / √${sampleSize} = ${standardError.toFixed(4)}`,
          `Z = (${sampleMean} - ${popMean}) / ${standardError.toFixed(4)} = ${z.toFixed(4)}`,
          `P-value (${tailType}) = ${pValue.toFixed(4)}`,
        ];
        result = {
          testStatistic: z,
          pValue,
          df: null,
          criticalValue: jStat.normal.inv(1 - alpha / (tailType === "two-tailed" ? 2 : 1), 0, 1),
        };
      } else if (testType === "t-test") {
        const { sampleData, popMean } = inputs;
        const sampleMean = jStat.mean(sampleData);
        const sampleStd = jStat.stdev(sampleData, true);
        const n = sampleData.length;
        const standardError = sampleStd / Math.sqrt(n);
        const t = (sampleMean - popMean) / standardError;
        const df = n - 1;
        let pValue;
        if (tailType === "two-tailed") {
          pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));
        } else if (tailType === "left-tailed") {
          pValue = jStat.studentt.cdf(t, df);
        } else {
          pValue = 1 - jStat.studentt.cdf(t, df);
        }
        steps = [
          `Formula: T = (Sample Mean - Population Mean) / (Sample Std Dev / √Sample Size)`,
          `Sample Mean = ${sampleMean.toFixed(4)}, Sample Std Dev = ${sampleStd.toFixed(4)}`,
          `Standard Error = ${sampleStd} / √${n} = ${standardError.toFixed(4)}`,
          `T = (${sampleMean} - ${popMean}) / ${standardError.toFixed(4)} = ${t.toFixed(4)}`,
          `Degrees of Freedom = ${n} - 1 = ${df}`,
          `P-value (${tailType}) = ${pValue.toFixed(4)}`,
        ];
        result = {
          testStatistic: t,
          pValue,
          df,
          criticalValue: jStat.studentt.inv(1 - alpha / (tailType === "two-tailed" ? 2 : 1), df),
        };
      } else if (testType === "two-sample-t") {
        const { sample1Data, sample2Data } = inputs;
        const mean1 = jStat.mean(sample1Data);
        const mean2 = jStat.mean(sample2Data);
        const std1 = jStat.stdev(sample1Data, true);
        const std2 = jStat.stdev(sample2Data, true);
        const n1 = sample1Data.length;
        const n2 = sample2Data.length;
        const pooledVar = ((n1 - 1) * std1 * std1 + (n2 - 1) * std2 * std2) / (n1 + n2 - 2);
        const standardError = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));
        const t = (mean1 - mean2) / standardError;
        const df = n1 + n2 - 2;
        let pValue;
        if (tailType === "two-tailed") {
          pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));
        } else if (tailType === "left-tailed") {
          pValue = jStat.studentt.cdf(t, df);
        } else {
          pValue = 1 - jStat.studentt.cdf(t, df);
        }
        steps = [
          `Sample 1: Mean = ${mean1.toFixed(4)}, Std Dev = ${std1.toFixed(4)}, n = ${n1}`,
          `Sample 2: Mean = ${mean2.toFixed(4)}, Std Dev = ${std2.toFixed(4)}, n = ${n2}`,
          `Pooled Variance = ${(n1 - 1) * std1 * std1 + (n2 - 1) * std2 * std2} / (${
            n1 + n2 - 2
          }) = ${pooledVar.toFixed(4)}`,
          `Standard Error = √(${pooledVar.toFixed(4)} * (1/${n1} + 1/${n2})) = ${standardError.toFixed(4)}`,
          `T = (${mean1} - ${mean2}) / ${standardError.toFixed(4)} = ${t.toFixed(4)}`,
          `Degrees of Freedom = ${n1} + ${n2} - 2 = ${df}`,
          `P-value (${tailType}) = ${pValue.toFixed(4)}`,
        ];
        result = {
          testStatistic: t,
          pValue,
          df,
          criticalValue: jStat.studentt.inv(1 - alpha / (tailType === "two-tailed" ? 2 : 1), df),
        };
      } else if (testType === "chi-square") {
        const { observed, expected } = inputs;
        const chiSquare = observed.reduce((sum, obs, i) => {
          const exp = expected[i];
          const diff = obs - exp;
          return sum + (diff * diff) / exp;
        }, 0);
        const df = observed.length - 1;
        const pValue = 1 - jStat.chisquare.cdf(chiSquare, df);
        steps = [
          `Formula: Chi-square = Σ[(Observed - Expected)² / Expected]`,
          ...observed.map(
            (obs, i) =>
              `Category ${i + 1}: (${obs} - ${expected[i]})² / ${expected[i]} = ${(
                (obs - expected[i]) ** 2 /
                expected[i]
              ).toFixed(4)}`
          ),
          `Chi-square = ${chiSquare.toFixed(4)}`,
          `Degrees of Freedom = ${observed.length} - 1 = ${df}`,
          `P-value = ${pValue.toFixed(4)}`,
        ];
        result = {
          testStatistic: chiSquare,
          pValue,
          df,
          observed,
          expected,
          criticalValue: jStat.chisquare.inv(1 - alpha, df),
        };
      }

      const interpretation =
        result.pValue < alpha
          ? `P-value (${result.pValue.toFixed(4)}) < α (${alpha}): Reject the null hypothesis.`
          : `P-value (${result.pValue.toFixed(4)}) ≥ α (${alpha}): Fail to reject the null hypothesis.`;

      displayResults({ testType, tailType, alpha, result, steps, interpretation, inputs });
      updateVisualizations(testType, result, tailType, alpha);
      setSuccess("P-value calculated successfully");
    } catch (e) {
      console.error("Calculation error:", e);
      setError(e.message || "Failed to calculate p-value");
    }
  };

  const displayResults = ({ testType, tailType, alpha, result, steps, interpretation, inputs }) => {
    let inputSummary = "";
    if (testType === "z-test") {
      inputSummary = `Sample Mean: ${inputs.sampleMean}, Population Mean: ${inputs.popMean}, Population Std Dev: ${inputs.popStd}, Sample Size: ${inputs.sampleSize}`;
    } else if (testType === "t-test") {
      inputSummary = `Sample Data: ${inputs.sampleData.join(", ")}, Population Mean: ${inputs.popMean}`;
    } else if (testType === "two-sample-t") {
      inputSummary = `Sample 1 Data: ${inputs.sample1Data.join(
        ", "
      )}, Sample 2 Data: ${inputs.sample2Data.join(", ")}`;
    } else if (testType === "chi-square") {
      inputSummary = `Observed: ${inputs.observed.join(", ")}, Expected: ${inputs.expected.join(", ")}`;
    }
    const output = `
      <strong>Test:</strong> ${testType.replace("-", " ").toUpperCase()}<br>
      <strong>Tail:</strong> ${tailType.replace("-", " ").toUpperCase()}<br>
      <strong>Inputs:</strong> ${inputSummary}<br>
      <strong>Test Statistic:</strong> ${result.testStatistic.toFixed(4)}<br>
      ${result.df !== null ? `<strong>Degrees of Freedom:</strong> ${result.df}<br>` : ""}
      <strong>Critical Value:</strong> ${result.criticalValue.toFixed(4)}<br>
      <strong>P-value:</strong> ${result.pValue.toFixed(4)}<br>
      <strong>Significance Level (α):</strong> ${alpha}<br>
      <strong>Interpretation:</strong> ${interpretation}<br>
      <strong>Steps:</strong><br>
      <table class="w-full text-sm text-gray-600 border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2 border border-gray-300">Step</th>
            <th class="p-2 border border-gray-300">Description</th>
          </tr>
        </thead>
        <tbody>
          ${steps
            .map(
              (s, i) =>
                `<tr><td class="p-2 border border-gray-300">${
                  i + 1
                }</td><td class="p-2 border border-gray-300">${s}</td></tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;
    setResultContent(output);
    saveToHistory(testType, inputSummary, result.pValue.toFixed(4));
  };

  const updateVisualizations = (testType, result, tailType, alpha) => {
    if (distributionChartInstance.current) distributionChartInstance.current.destroy();
    if (frequencyChartInstance.current) frequencyChartInstance.current.destroy();
    if (trendChartInstance.current) trendChartInstance.current.destroy();

    // Distribution Chart
    if (distributionChartRef.current) {
      let xValues = [],
        pdfValues = [],
        shadedArea = [];
      const stat = result.testStatistic;
      const criticalValue = result.criticalValue;
      if (testType === "z-test") {
        xValues = Array.from({ length: 100 }, (_, i) => -5 + i * 0.1);
        pdfValues = xValues.map((x) => jStat.normal.pdf(x, 0, 1));
        if (tailType === "two-tailed") {
          shadedArea = xValues.map((x) => (Math.abs(x) >= Math.abs(stat) ? jStat.normal.pdf(x, 0, 1) : null));
        } else if (tailType === "left-tailed") {
          shadedArea = xValues.map((x) => (x <= stat ? jStat.normal.pdf(x, 0, 1) : null));
        } else {
          shadedArea = xValues.map((x) => (x >= stat ? jStat.normal.pdf(x, 0, 1) : null));
        }
      } else if (testType === "t-test" || testType === "two-sample-t") {
        xValues = Array.from({ length: 100 }, (_, i) => -5 + i * 0.1);
        pdfValues = xValues.map((x) => jStat.studentt.pdf(x, result.df));
        if (tailType === "two-tailed") {
          shadedArea = xValues.map((x) =>
            Math.abs(x) >= Math.abs(stat) ? jStat.studentt.pdf(x, result.df) : null
          );
        } else if (tailType === "left-tailed") {
          shadedArea = xValues.map((x) => (x <= stat ? jStat.studentt.pdf(x, result.df) : null));
        } else {
          shadedArea = xValues.map((x) => (x >= stat ? jStat.studentt.pdf(x, result.df) : null));
        }
      } else if (testType === "chi-square") {
        xValues = Array.from({ length: 100 }, (_, i) => i * 0.5);
        pdfValues = xValues.map((x) => jStat.chisquare.pdf(x, result.df));
        shadedArea = xValues.map((x) => (x >= stat ? jStat.chisquare.pdf(x, result.df) : null));
      }
      distributionChartInstance.current = new Chart(distributionChartRef.current, {
        type: "line",
        data: {
          labels: xValues,
          datasets: [
            {
              label: "Distribution",
              data: pdfValues,
              borderColor: "#ef4444",
              fill: false,
            },
            {
              label: "P-value Area",
              data: shadedArea,
              backgroundColor: "rgba(239, 68, 68, 0.3)",
              fill: true,
            },
            {
              label: "Test Statistic",
              data: xValues.map((x) => (Math.abs(x - stat) < 0.05 ? pdfValues[xValues.indexOf(x)] : null)),
              borderColor: "#b91c1c",
              borderWidth: 2,
              pointRadius: 5,
              type: "scatter",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Test Statistic" } },
            y: { title: { display: true, text: "Density" }, beginAtZero: true },
          },
          plugins: { title: { display: true, text: `${testType.toUpperCase()} Distribution` } },
        },
      });
    }

    // Frequency Chart (Chi-square only)
    if (frequencyChartRef.current && testType === "chi-square") {
      const labels = result.observed.map((_, i) => `Category ${i + 1}`);
      frequencyChartInstance.current = new Chart(frequencyChartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Observed",
              data: result.observed,
              backgroundColor: "rgba(239, 68, 68, 0.6)",
            },
            {
              label: "Expected",
              data: result.expected,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Frequency" } },
          },
          plugins: { title: { display: true, text: "Observed vs Expected Frequencies" } },
        },
      });
    }

    // Test Statistic Trend Chart (Z-test and T-tests)
    if (trendChartRef.current && testType !== "chi-square") {
      const criticalValue = result.criticalValue;
      const stat = result.testStatistic;
      const points = [
        { label: "Test Statistic", value: stat },
        { label: "Critical Value", value: tailType === "two-tailed" ? criticalValue : criticalValue },
      ];
      trendChartInstance.current = new Chart(trendChartRef.current, {
        type: "line",
        data: {
          labels: points.map((p) => p.label),
          datasets: [
            {
              label: "Value",
              data: points.map((p) => p.value),
              borderColor: "#ef4444",
              backgroundColor: "rgba(239, 68, 68, 0.5)",
              fill: false,
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Value" }, beginAtZero: false },
            x: { title: { display: true, text: "Metric" } },
          },
          plugins: { title: { display: true, text: "Test Statistic vs Critical Value" } },
        },
      });
    }
  };

  const clearInputs = () => {
    setTestType("z-test");
    setTailType("two-tailed");
    setAlpha("0.05");
    updateInputFields();
    clearMessages();
    clearVisualizations();
    setResultContent(null);
    setSuccess("Inputs cleared");
  };

  const clearVisualizations = () => {
    if (distributionChartInstance.current) {
      distributionChartInstance.current.destroy();
      distributionChartInstance.current = null;
    }
    if (frequencyChartInstance.current) {
      frequencyChartInstance.current.destroy();
      frequencyChartInstance.current = null;
    }
    if (trendChartInstance.current) {
      trendChartInstance.current.destroy();
      trendChartInstance.current = null;
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

  const saveToHistory = (testType, input, pValue) => {
    const entry = {
      date: new Date().toLocaleString(),
      test: testType,
      input,
      pValue,
    };
    const updatedHistory = [...calculationHistory, entry];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("pValueCalcHistory", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setCalculationHistory([]);
    localStorage.removeItem("pValueCalcHistory");
    setSuccess("History cleared");
  };

  const exportCSV = () => {
    const headers = ["Date", "Test", "Input", "P-value"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.test}"`,
      `"${entry.input}"`,
      `"${entry.pValue}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("pvalue_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("pvalue_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("P-value Calculation History", 10, 10);
    let y = 20;
    calculationHistory.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Test: ${entry.test}`, 10, y + 10);
      doc.text(`Input: ${entry.input}`, 10, y + 20);
      doc.text(`P-value: ${entry.pValue}`, 10, y + 30);
      y += 40;
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("pvalue_history.pdf");
  };

  const downloadFile = (filename, type, content) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const renderTestInputs = () => {
    if (testType === "z-test") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Sample Mean
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Mean of the sample
                </span>
              </span>
            </label>
            <input
              type="number"
              step="any"
              value={inputs.sampleMean || ""}
              onChange={(e) => handleInputChange("sampleMean", e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Population Mean
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Known population mean
                </span>
              </span>
            </label>
            <input
              type="number"
              step="any"
              value={inputs.popMean || ""}
              onChange={(e) => handleInputChange("popMean", e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Population Std Dev
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Known population standard deviation
                </span>
              </span>
            </label>
            <input
              type="number"
              step="any"
              value={inputs.popStd || ""}
              onChange={(e) => handleInputChange("popStd", e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Sample Size
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Number of observations
                </span>
              </span>
            </label>
            <input
              type="number"
              step="1"
              value={inputs.sampleSize || ""}
              onChange={(e) => handleInputChange("sampleSize", e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 30"
            />
          </div>
        </>
      );
    } else if (testType === "t-test") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Sample Data
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-3 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Enter comma-separated sample values (e.g., 1,2,3)
                </span>
              </span>
            </label>
            <input
              type="text"
              value={inputs.sampleData || ""}
              onChange={(e) => handleInputChange("sampleData", e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 1,2,3,4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Population Mean
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Hypothesized population mean
                </span>
              </span>
            </label>
            <input
              type="number"
              step="any"
              value={inputs.popMean || ""}
              onChange={(e) => handleInputChange("popMean", e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 0"
            />
          </div>
        </>
      );
    } else if (testType === "two-sample-t") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Sample 1 Data
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-12 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Enter first sample values (comma-separated)
                </span>
              </span>
            </label>
            <input
              type="text"
              value={inputs.sample1Data || ""}
              onChange={(e) => handleInputChange("sample1Data", e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 1,2,3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Sample 2 Data
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Enter second sample values (comma-separated)
                </span>
              </span>
            </label>
            <input
              type="text"
              value={inputs.sample2Data || ""}
              onChange={(e) => handleInputChange("sample2Data", e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 4,5,6"
            />
          </div>
        </>
      );
    } else if (testType === "chi-square") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Observed Frequencies
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-20 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Enter comma-separated observed counts (e.g., 10,20,30)
                </span>
              </span>
            </label>
            <input
              type="text"
              value={inputs.observed || ""}
              onChange={(e) => handleInputChange("observed", e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 10,20,30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Expected Frequencies
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Enter comma-separated expected counts (e.g., 15,15,30)
                </span>
              </span>
            </label>
            <input
              type="text"
              value={inputs.expected || ""}
              onChange={(e) => handleInputChange("expected", e.target.value)}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 15,15,30"
            />
          </div>
        </>
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        calculatePValue();
      } else if (e.key === "Escape") {
        clearInputs();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [inputs, testType, tailType, alpha]);

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-4xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">P-value Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Configure Test</h2>
          <div className="input-group flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Test Type
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Select statistical test
                  </span>
                </span>
              </label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="p-3 border rounded-lg w-full"
              >
                <option value="z-test">One-sample Z-test</option>
                <option value="t-test">One-sample T-test</option>
                <option value="two-sample-t">Two-sample T-test</option>
                <option value="chi-square">Chi-square Goodness-of-Fit</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Tail Type
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Select test direction
                  </span>
                </span>
              </label>
              <select
                value={tailType}
                onChange={(e) => setTailType(e.target.value)}
                className="p-3 border rounded-lg w-full"
              >
                <option value="two-tailed">Two-tailed</option>
                <option value="left-tailed">Left-tailed</option>
                <option value="right-tailed">Right-tailed</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Significance Level (α)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Threshold for statistical significance (e.g., 0.05)
                  </span>
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                value={alpha}
                onChange={(e) => setAlpha(e.target.value)}
                className="p-3 border rounded-lg w-full"
                placeholder="e.g., 0.05"
              />
            </div>
          </div>

          <div className="input-group flex flex-wrap gap-4 mb-6">{renderTestInputs()}</div>

          <div className="buttons grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <button onClick={calculatePValue} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Calculate P-value
            </button>
            <button onClick={clearInputs} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Clear
            </button>
            <button onClick={saveCalculation} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Save
            </button>
            <button onClick={clearHistory} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Clear History
            </button>
            <button onClick={exportCSV} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Export CSV
            </button>
            <button onClick={exportJSON} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Export JSON
            </button>
            <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Export PDF
            </button>
            <button onClick={() => setShowModal(true)} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Learn More
            </button>
          </div>

          {resultContent && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} className="text-gray-600 mb-4" />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Distribution</h3>
                <canvas ref={distributionChartRef} className="max-w-[600px] h-[300px] mx-auto" />
              </div>
              {testType === "chi-square" && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-red-900">Frequencies (Chi-square)</h3>
                  <canvas ref={frequencyChartRef} className="max-w-[600px] h-[300px] mx-auto" />
                </div>
              )}
              {testType !== "chi-square" && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-red-900">Test Statistic Trend</h3>
                  <canvas ref={trendChartRef} className="max-w-[600px] h-[300px] mx-auto" />
                </div>
              )}
            </div>
          )}

          {calculationHistory.length > 0 && (
            <div className="mt-6 max-h-[200px] overflow-y-auto">
              <h3 className="text-md font-medium text-red-900">Calculation History</h3>
              <table className="w-full text-sm text-gray-600 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border border-gray-300">Date</th>
                    <th className="p-2 border border-gray-300">Test</th>
                    <th className="p-2 border border-gray-300">Input</th>
                    <th className="p-2 border border-gray-300">P-value</th>
                  </tr>
                </thead>
                <tbody>
                  {calculationHistory.map((entry, index) => (
                    <tr key={index}>
                      <td className="p-2 border border-gray-300">{entry.date}</td>
                      <td className="p-2 border border-gray-300">{entry.test}</td>
                      <td className="p-2 border border-gray-300">{entry.input}</td>
                      <td className="p-2 border border-gray-300">{entry.pValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Understanding P-values</h2>
                <p className="text-gray-600 mb-4">
                  A p-value measures the probability of observing results as extreme as those in your data,
                  assuming the null hypothesis is true.
                </p>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>P-value:</strong> Probability of observing data given the null hypothesis (smaller
                    p-values suggest evidence against the null).
                  </li>
                  <li>
                    <strong>Significance Level (α):</strong> Threshold for rejecting the null (commonly 0.05).
                  </li>
                  <li>
                    <strong>Null Hypothesis:</strong> The default assumption (e.g., no difference between
                    means).
                  </li>
                  <li>
                    <strong>Test Statistic:</strong> A value computed from data to assess the null hypothesis.
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Supported Tests</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Z-test:</strong> Tests sample mean against population mean (known variance).
                  </li>
                  <li>
                    <strong>T-test:</strong> Tests sample mean against population mean or between two samples
                    (unknown variance).
                  </li>
                  <li>
                    <strong>Chi-square Test:</strong> Tests if observed frequencies match expected
                    frequencies.
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Interpretation</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>p {"<"} α:</strong> Reject the null hypothesis (significant result).
                  </li>
                  <li>
                    <strong>p ≥ α:</strong> Fail to reject the null (not significant).
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Enter comma-separated sample data for t-tests.</li>
                  <li>Ensure sample sizes are sufficient for reliable results.</li>
                  <li>Check assumptions (e.g., normality for t-tests).</li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>
                    <a
                      href="https://www.statsdirect.com/help/basics/p_values.htm"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      P-values Explained
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://en.wikipedia.org/wiki/P-value"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Wikipedia: P-value
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
