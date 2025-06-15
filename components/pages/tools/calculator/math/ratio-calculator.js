"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [calcType, setCalcType] = useState("simplify");
  const [precision, setPrecision] = useState("2");
  const [simplifyRatio, setSimplifyRatio] = useState("");
  const [convertRatio, setConvertRatio] = useState("");
  const [equivalentRatio, setEquivalentRatio] = useState("");
  const [equivalentCount, setEquivalentCount] = useState("");
  const [compareRatio1, setCompareRatio1] = useState("");
  const [compareRatio2, setCompareRatio2] = useState("");
  const [proportionRatio, setProportionRatio] = useState("");
  const [proportionTarget, setProportionTarget] = useState("");
  const [proportionPosition, setProportionPosition] = useState("");
  const [scaleRatio, setScaleRatio] = useState("");
  const [scaleFactor, setScaleFactor] = useState("");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState({ content: "", stats: "" });
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);
  const lastResults = useRef([]);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("ratioCalcHistory");
      setHistory(stored ? JSON.parse(stored) : []);
    } catch (e) {
      console.error("Failed to load history:", e);
    }

    // Load external scripts
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/mathjs@11.8.0/lib/browser/math.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
    ]).catch((err) => console.error("Failed to load scripts:", err));

    // Cleanup
    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (pieChartInstance.current) pieChartInstance.current.destroy();
    };
  }, []);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const showError = (message) => {
    clearMessages();
    setErrorMessage(message);
  };

  const showSuccess = (message) => {
    clearMessages();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const parseInput = (input) => {
    try {
      if (!input.trim()) throw new Error("Input cannot be empty");
      const value = window.math.evaluate(input);
      if (isNaN(value) || !isFinite(value)) throw new Error("Invalid numerical value");
      return value;
    } catch (e) {
      throw new Error("Invalid input: " + e.message);
    }
  };

  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const simplifyRatioF = (numbers) => {
    if (numbers.some((n) => n <= 0)) throw new Error("Ratio terms must be positive");
    const divisor = numbers.reduce(gcd);
    return numbers.map((n) => n / divisor);
  };

  const calculateParameters = (calcType, params, precision) => {
    let results = {};
    params = params.map((p) => (typeof p === "number" ? p : parseInput(p)));

    try {
      if (calcType === "simplify") {
        const ratio = simplifyRatioF(params);
        results.ratio = ratio;
        results.simplified = ratio.join(":");
      } else if (calcType === "convert") {
        const ratio = simplifyRatioF(params);
        const sum = ratio.reduce((a, b) => a + b, 0);
        results.ratio = ratio;
        results.simplified = ratio.join(":");
        results.fraction = ratio.length === 2 ? `${ratio[0]}/${ratio[1]}` : "N/A";
        results.decimal = ratio.length === 2 ? ratio[0] / ratio[1] : "N/A";
        results.percent = ratio.map((r) => (r / sum) * 100);
      } else if (calcType === "equivalent") {
        const [ratio, count] = [params.slice(0, -1), params[params.length - 1]];
        if (count <= 0 || !Number.isInteger(count))
          throw new Error("Number of equivalents must be a positive integer");
        const simplified = simplifyRatioF(ratio);
        const equivalents = [];
        for (let i = 1; i <= count; i++) {
          equivalents.push(simplified.map((n) => n * i));
        }
        results.ratio = simplified;
        results.simplified = simplified.join(":");
        results.equivalents = equivalents.map((eq) => eq.join(":"));
      } else if (calcType === "compare") {
        const [ratio1, ratio2] = [params.slice(0, params.length / 2), params.slice(params.length / 2)];
        if (ratio1.length !== ratio2.length) throw new Error("Ratios must have same number of terms");
        const simplified1 = simplifyRatioF(ratio1);
        const simplified2 = simplifyRatioF(ratio2);
        const isEquivalent = simplified1.every((n, i) => n === simplified2[i]);
        results.ratio1 = simplified1;
        results.ratio2 = simplified2;
        results.simplified1 = simplified1.join(":");
        results.simplified2 = simplified2.join(":");
        results.isEquivalent = isEquivalent;
      } else if (calcType === "proportion") {
        const [ratio, target, position] = [
          params.slice(0, -2),
          params[params.length - 2],
          params[params.length - 1],
        ];
        if (ratio.length !== 2) throw new Error("Proportion requires a two-term ratio");
        if (position !== 1 && position !== 2) throw new Error("Position must be 1 or 2");
        const simplified = simplifyRatioF(ratio);
        const x =
          position === 1
            ? (target * simplified[0]) / simplified[1]
            : (simplified[1] * target) / simplified[0];
        results.ratio = simplified;
        results.simplified = simplified.join(":");
        results.target = target;
        results.position = position;
        results.x = x;
      } else if (calcType === "scale") {
        const [ratio, factor] = [params.slice(0, -1), params[params.length - 1]];
        if (factor <= 0) throw new Error("Scale factor must be positive");
        const simplified = simplifyRatioF(ratio);
        const scaled = simplified.map((n) => n * factor);
        results.ratio = simplified;
        results.simplified = simplified.join(":");
        results.scaled = scaled;
        results.scaledSimplified = simplifyRatioF(scaled).join(":");
      }

      return Object.fromEntries(
        Object.entries(results).map(([k, v]) => {
          if (typeof v === "number") return [k, Number(v).toFixed(precision)];
          if (
            Array.isArray(v) &&
            k !== "ratio" &&
            k !== "equivalents" &&
            k !== "ratio1" &&
            k !== "ratio2" &&
            k !== "scaled"
          ) {
            return [k, v.map((x) => (typeof x === "number" ? Number(x).toFixed(precision) : x))];
          }
          return [k, v];
        })
      );
    } catch (e) {
      throw new Error(`Calculation error for ${calcType}: ${e.message}`);
    }
  };

  const paramInputs = {
    simplify: { ratio: () => simplifyRatio },
    convert: { ratio: () => convertRatio },
    equivalent: { ratio: () => equivalentRatio, count: () => equivalentCount },
    compare: { ratio1: () => compareRatio1, ratio2: () => compareRatio2 },
    proportion: {
      ratio: () => proportionRatio,
      target: () => proportionTarget,
      position: () => proportionPosition,
    },
    scale: { ratio: () => scaleRatio, factor: () => scaleFactor },
  };

  const calculate = async () => {
    clearMessages();
    try {
      const prec = parseInt(precision);
      const isBatch = batchFile || batchText.trim();

      let calcResults = [];
      if (!isBatch) {
        const inputs = Object.values(paramInputs[calcType]).map((getter) => getter());
        if (inputs.some((v) => !v && v !== "0")) throw new Error("All parameters are required");
        const parsedInputs = inputs.flatMap((input, i) => {
          if (Object.keys(paramInputs[calcType])[i].includes("ratio")) {
            return input.split(",").map((s) => s.trim());
          }
          return input;
        });
        const result = await computeCalculation(calcType, parsedInputs, prec);
        calcResults.push(result);
        displayResults(calcResults, calcType, prec, false);
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
                .filter((c) => c.length > 1);
              resolve(parsed);
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          calculations = batchText.split(";").map((c) => c.split(",").map((s) => s.trim()));
        }
        await processBatch(calculations, calcType, prec, calcResults);
        if (calcResults.length === 0) throw new Error("No valid calculations in batch input");
        displayResults(calcResults, calcType, prec, true);
      }
    } catch (e) {
      console.error("Calculation error:", e);
      showError(e.message || "Invalid input");
    }
  };

  const computeCalculation = async (type, inputs, precision) => {
    try {
      const params = calculateParameters(type, inputs, precision);
      params.calcType = type;
      return params;
    } catch (e) {
      throw new Error(`Invalid parameters for ${type}: ${e.message}`);
    }
  };

  const processBatch = async (calculations, calcType, precision, results) => {
    for (const c of calculations) {
      try {
        const [type, ...params] = c;
        if (!paramInputs[type]) throw new Error("Invalid calculation type");
        const parsedParams = params.flatMap((p, i) => {
          if (Object.keys(paramInputs[type])[i].includes("ratio")) {
            return p.split(",").map((s) => s.trim());
          }
          return p;
        });
        const result = await computeCalculation(type, parsedParams, precision);
        results.push(result);
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const displayResults = (results, calcType, precision, isBatch) => {
    let output = [];
    if (isBatch) {
      output.push(
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Type</th>
              <th className="p-2">Parameters</th>
              <th className="p-2">Results</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const paramText = Object.keys(paramInputs[r.calcType])
                .map((name) => {
                  if (name.includes("ratio")) {
                    return `${name}: ${r[name].map((n) => Number(n).toFixed(precision)).join(":")}`;
                  }
                  return `${name}: ${r[name]}`;
                })
                .join(", ");
              const resultText = Object.entries(r)
                .filter(([k]) => !["calcType", ...Object.keys(paramInputs[r.calcType])].includes(k))
                .map(([k, v]) => {
                  if (k === "equivalents") return `${k}: [${v.join("; ")}]`;
                  if (Array.isArray(v)) return `${k}: ${v.join(":")}`;
                  return `${k}: ${v}`;
                })
                .join(", ");
              return (
                <tr key={i}>
                  <td className="p-2">{r.calcType}</td>
                  <td className="p-2">{paramText}</td>
                  <td className="p-2">{resultText}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
      const ratioValues = results
        .filter((r) => r.ratio && r.ratio.length === 2)
        .map((r) => Number((r.ratio[0] / r.ratio[1]).toFixed(precision)));
      if (ratioValues.length > 0) {
        const frequency = {};
        ratioValues.forEach((v) => (frequency[v] = (frequency[v] || 0) + 1));
        output.push(
          <div key="freq">
            <strong>Ratio Value Frequency Table:</strong>
            <br />
            <table className="w-full text-sm text-gray-600">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Ratio Value</th>
                  <th className="p-2">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(frequency).map(([value, freq], i) => (
                  <tr key={i}>
                    <td className="p-2">{Number(value).toFixed(precision)}</td>
                    <td className="p-2">{freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    } else {
      const r = results[0];
      output.push(
        <div key="result">
          <strong>Results ({r.calcType}):</strong>
          <br />
          {Object.entries(r).map(([k, v], i) => {
            if (k !== "calcType" && !Object.keys(paramInputs[r.calcType]).includes(k)) {
              if (k === "equivalents")
                return (
                  <div key={i}>
                    {k}: [{v.join("; ")}]
                  </div>
                );
              if (Array.isArray(v))
                return (
                  <div key={i}>
                    {k}: {v.join(":")}
                  </div>
                );
              return (
                <div key={i}>
                  {k}: {v}
                </div>
              );
            }
            return null;
          })}
          <br />
          <strong>Parameters:</strong>
          <br />
          {Object.keys(paramInputs[r.calcType]).map((name, i) => {
            if (name.includes("ratio")) {
              return (
                <div key={i}>
                  {name}: {r[name].map((n) => Number(n).toFixed(precision)).join(":")}
                </div>
              );
            }
            return (
              <div key={i}>
                {name}: {r[name]}
              </div>
            );
          })}
        </div>
      );
    }

    let statsText = null;
    if (isBatch && results.length > 1) {
      const ratioValues = results
        .filter((r) => r.ratio && r.ratio.length === 2)
        .map((r) => r.ratio[0] / r.ratio[1]);
      if (ratioValues.length > 0) {
        const stats = {
          mean: window.math.mean(ratioValues),
          median: window.math.median(ratioValues),
          stdDev: window.math.std(ratioValues),
          min: Math.min(...ratioValues),
          max: Math.max(...ratioValues),
        };
        statsText = (
          <div>
            <strong>Statistics (Ratio Values):</strong>
            <br />
            Mean: {Number(stats.mean).toFixed(precision)}
            <br />
            Median: {Number(stats.median).toFixed(precision)}
            <br />
            Standard Deviation: {Number(stats.stdDev).toFixed(precision)}
            <br />
            Min: {Number(stats.min).toFixed(precision)}
            <br />
            Max: {Number(stats.max).toFixed(precision)}
          </div>
        );
      }
    }

    setResults({ content: output, stats: statsText });
    setShowResults(true);

    const params = isBatch
      ? `Batch: ${results.length} calculations, Type: ${calcType}`
      : `${results[0].calcType}: ${Object.keys(paramInputs[results[0].calcType])
          .map((name) => {
            if (name.includes("ratio")) {
              return `${name}=${results[0][name].map((n) => Number(n).toFixed(precision)).join(":")}`;
            }
            return `${name}=${results[0][name]}`;
          })
          .join(", ")}`;
    saveToHistory(
      params,
      output
        .map((o) => (typeof o === "string" ? o : o.props.children))
        .join("; ")
        .substring(0, 100) + "..."
    );
    lastResults.current = results;
    updateVisualizations(results, calcType, isBatch);
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const values = statInput
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      const prec = parseInt(precision);

      if (values.length === 0) throw new Error("Invalid ratio value list");

      const stats = {
        mean: window.math.mean(values),
        median: window.math.median(values),
        stdDev: window.math.std(values),
        min: Math.min(...values),
        max: Math.max(...values),
      };
      const statsText = (
        <div>
          Mean: {Number(stats.mean).toFixed(prec)}
          <br />
          Median: {Number(stats.median).toFixed(prec)}
          <br />
          Standard Deviation: {Number(stats.stdDev).toFixed(prec)}
          <br />
          Min: {Number(stats.min).toFixed(prec)}
          <br />
          Max: {Number(stats.max).toFixed(prec)}
        </div>
      );
      const expression = `Stats(${values.join(", ")})`;

      setResults({
        content: (
          <div>
            <strong>Statistical Analysis (Ratio Values):</strong>
            <br />
            {statsText}
          </div>
        ),
        stats: "",
      });
      setShowResults(true);

      saveToHistory(expression, statsText.props.children.join("; "));
      updateBarChart(values, true);
    } catch (e) {
      console.error("Stats error:", e);
      showError("Invalid statistical input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const variationValue = parseFloat(variation);
      const prec = parseInt(precision);
      const inputs = Object.values(paramInputs[calcType]).map((getter) => getter());

      if (inputs.some((v) => !v && v !== "0")) throw new Error("All parameters required");
      if (isNaN(variationValue) || variationValue <= 0) throw new Error("Invalid variation percentage");

      const parsedInputs = inputs.flatMap((input, i) => {
        if (Object.keys(paramInputs[calcType])[i].includes("ratio")) {
          return input.split(",").map((s) => s.trim());
        }
        return input;
      });
      const params = parsedInputs.map((p) => parseInput(p));
      const calcResults = [];
      const step = variationValue / 5;

      for (let v = -variationValue; v <= variationValue; v += step) {
        const variedParams = params.map((p) => p * (1 + v / 100));
        try {
          const calc = calculateParameters(calcType, variedParams, prec);
          let value;
          if (calcType === "convert" && calc.decimal !== "N/A") {
            value = parseFloat(calc.decimal);
          } else if (calcType === "proportion") {
            value = parseFloat(calc.x);
          } else if (calc.ratio && calc.ratio.length === 2) {
            value = calc.ratio[0] / calc.ratio[1];
          } else {
            value = 0;
          }
          calcResults.push({ variation: v, value });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      const resultText = calcResults.map((r) => (
        <div key={r.variation}>
          Variation {Number(r.variation).toFixed(2)}%: Value = {Number(r.value).toFixed(prec)}
        </div>
      ));

      setResults({
        content: (
          <div>
            <strong>Sensitivity Analysis:</strong>
            <br />
            {resultText}
          </div>
        ),
        stats: "",
      });
      setShowResults(true);

      saveToHistory(`Sensitivity (±${variationValue}%)`, resultText.map((t) => t.props.children).join("; "));
      updateSensitivityChart(calcResults);
    } catch (e) {
      console.error("Sensitivity error:", e);
      showError("Invalid sensitivity input: " + e.message);
    }
  };

  const updateVisualizations = (results, calcType, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();

    if (!isBatch && results.length === 1 && results[0].ratio) {
      drawBarChart(results[0]);
      drawPieChart(results[0]);
    } else {
      if (barChartRef.current) {
        const ctx = barChartRef.current.getContext("2d");
        ctx.clearRect(0, 0, barChartRef.current.width, barChartRef.current.height);
        ctx.fillStyle = "#000";
        ctx.font = "14px Inter";
        ctx.fillText("Bar chart available for single ratio", 10, 50);
      }
      if (pieChartRef.current) {
        const ctx = pieChartRef.current.getContext("2d");
        ctx.clearRect(0, 0, pieChartRef.current.width, pieChartRef.current.height);
        ctx.fillStyle = "#000";
        ctx.font = "14px Inter";
        ctx.fillText("Pie chart available for single ratio", 10, 50);
      }
      const values = results
        .filter((r) => r.ratio && r.ratio.length === 2)
        .map((r) => r.ratio[0] / r.ratio[1]);
      if (values.length > 0) {
        updateBarChart(values, false);
      }
    }
  };

  const drawBarChart = (result) => {
    if (barChartRef.current) {
      barChartInstance.current = new window.Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: result.ratio.map((_, i) => `Part ${i + 1}`),
          datasets: [
            {
              label: "Ratio Values",
              data: result.ratio,
              backgroundColor: "#ef4444", // Primary color
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Value" } },
            x: { title: { display: true, text: "Ratio Parts" } },
          },
          plugins: {
            title: { display: true, text: "Ratio Bar Chart" },
          },
        },
      });
    }
  };

  const drawPieChart = (result) => {
    if (pieChartRef.current) {
      pieChartInstance.current = new window.Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: result.ratio.map((_, i) => `Part ${i + 1}`),
          datasets: [
            {
              label: "Ratio Parts",
              data: result.ratio,
              backgroundColor: ["#ef4444", "#10b981", "#3b82f6", "#f59e0b"], // Primary + accent colors
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: "Ratio Pie Chart" },
            legend: { position: "bottom" },
          },
        },
      });
    }
  };

  const updateBarChart = (values, isStats = false) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      barChartInstance.current = new window.Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: isStats
            ? values.map((_, i) => `Value ${i + 1}`)
            : lastResults.current.map((_, i) => `Ratio ${i + 1}`),
          datasets: [
            {
              label: "Ratio Value",
              data: values,
              backgroundColor: "#ef4444", // Primary color
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Ratio Value" } },
            x: { title: { display: true, text: isStats ? "Values" : "Ratios" } },
          },
          plugins: {
            title: { display: true, text: isStats ? "Ratio Value Analysis" : "Ratio Comparison" },
          },
        },
      });
    }
  };

  const updateSensitivityChart = (results) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      barChartInstance.current = new window.Chart(barChartRef.current, {
        type: "line",
        data: {
          labels: results.map((r) => `${Number(r.variation).toFixed(2)}%`),
          datasets: [
            {
              label: "Ratio Value",
              data: results.map((r) => r.value),
              borderColor: "#ef4444", // Primary color
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: false, title: { display: true, text: "Ratio Value" } },
            x: { title: { display: true, text: "Variation (%)" } },
          },
          plugins: {
            title: { display: true, text: "Sensitivity Analysis" },
          },
        },
      });
    }
  };

  const clearInputs = () => {
    clearMessages();
    setSimplifyRatio("");
    setConvertRatio("");
    setEquivalentRatio("");
    setEquivalentCount("");
    setCompareRatio1("");
    setCompareRatio2("");
    setProportionRatio("");
    setProportionTarget("");
    setProportionPosition("");
    setScaleRatio("");
    setScaleFactor("");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setShowResults(false);
    setResults({ content: "", stats: "" });
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();
    showSuccess("Inputs cleared!");
  };

  const saveToHistory = (params, result) => {
    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        params,
        result,
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("ratioCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Parameters", "Result"],
      ...history.map((h) => [`"${h.date}"`, `"${h.params}"`, `"${h.result}"`]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calculation_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const jsonContent = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calculation_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Calculation History", 10, 10);
    let y = 20;
    history.forEach((h) => {
      doc.text(`Date: ${h.date}`, 10, y);
      doc.text(`Parameters: ${h.params}`, 10, y + 10);
      doc.text(`Result: ${h.result}`, 10, y + 20);
      y += 40;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("calculation_history.pdf");
  };

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">Advanced Ratio Calculator</h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Calculation Type
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select the type of ratio calculation.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                >
                  <option value="simplify">Simplify Ratio</option>
                  <option value="convert">Convert to Fraction/Decimal/Percent</option>
                  <option value="equivalent">Generate Equivalent Ratios</option>
                  <option value="compare">Compare Ratios</option>
                  <option value="proportion">Solve Proportion</option>
                  <option value="scale">Scale Ratio</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Precision
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Decimal places for results.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value)}
                >
                  <option value="2">2 Decimals</option>
                  <option value="4">4 Decimals</option>
                  <option value="6">6 Decimals</option>
                  <option value="8">8 Decimals</option>
                </select>
              </div>
            </div>
            {calcType === "simplify" && (
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Ratio (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 6,9"
                    value={simplifyRatio}
                    onChange={(e) => setSimplifyRatio(e.target.value)}
                  />
                </div>
              </div>
            )}
            {calcType === "convert" && (
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Ratio (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 2,3"
                    value={convertRatio}
                    onChange={(e) => setConvertRatio(e.target.value)}
                  />
                </div>
              </div>
            )}
            {calcType === "equivalent" && (
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Ratio (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 2,3"
                    value={equivalentRatio}
                    onChange={(e) => setEquivalentRatio(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Number of Equivalents
                  </label>
                  <input
                    type="number"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 5"
                    value={equivalentCount}
                    onChange={(e) => setEquivalentCount(e.target.value)}
                  />
                </div>
              </div>
            )}
            {calcType === "compare" && (
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    First Ratio (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 2,3"
                    value={compareRatio1}
                    onChange={(e) => setCompareRatio1(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Second Ratio (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 4,6"
                    value={compareRatio2}
                    onChange={(e) => setCompareRatio2(e.target.value)}
                  />
                </div>
              </div>
            )}
            {calcType === "proportion" && (
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Ratio (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 2,3"
                    value={proportionRatio}
                    onChange={(e) => setProportionRatio(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Target Value</label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 9"
                    value={proportionTarget}
                    onChange={(e) => setProportionTarget(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Position (1 or 2)</label>
                  <input
                    type="number"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 2"
                    value={proportionPosition}
                    onChange={(e) => setProportionPosition(e.target.value)}
                  />
                </div>
              </div>
            )}
            {calcType === "scale" && (
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Ratio (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 2,3"
                    value={scaleRatio}
                    onChange={(e) => setScaleRatio(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Scale Factor</label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 2"
                    value={scaleFactor}
                    onChange={(e) => setScaleFactor(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: type,ratio,... or type,ratio1,ratio2,...)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter calculations (e.g., simplify,6,9;compare,2,3,4,6).
                </span>
              </label>
              <input
                type="file"
                accept=".csv"
                className="p-3 border rounded-lg w-full bg-gray-200 mb-2"
                onChange={(e) => setBatchFile(e.target.files[0])}
              />
              <textarea
                className="p-3 border rounded-lg w-full bg-gray-200"
                rows="4"
                placeholder="e.g., simplify,6,9;compare,2,3,4,6"
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4 mb-6">
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              onClick={calculate}
            >
              Calculate
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              onClick={clearInputs}
            >
              Reset
            </button>
          </div>
          <div className="mb-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide Advanced Features" : "Show Advanced Features"}
            </button>
          </div>
          {showAdvanced && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Analyze Ratios (comma-separated decimals)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter ratio values (e.g., 0.667,1.333).
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 0.667,1.333"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={calculateStats}
                >
                  Calculate Statistics
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Variation Range (±%)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Percentage variation for sensitivity analysis.
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 5"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={calculateSensitivity}
                >
                  Analyze Sensitivity
                </button>
              </div>
            </div>
          )}
          {showResults && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div className="text-gray-600 mb-4">{results.content}</div>
              <div className="text-gray-600 mb-4">{results.stats}</div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Ratio Bar Chart</h3>
                <canvas ref={barChartRef} className="max-w-[500px] h-[300px] mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Ratio Pie Chart</h3>
                <canvas ref={pieChartRef} className="max-w-[500px] h-[300px] mx-auto" />
              </div>
              <div className="mt-6 max-h-52 overflow-y-auto">
                <h3 className="text-md font-medium text-gray-700">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Parameters</th>
                      <th className="p-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-2 text-center">
                          No history available
                        </td>
                      </tr>
                    ) : (
                      history.map((h, i) => (
                        <tr key={i}>
                          <td className="p-2">{h.date}</td>
                          <td className="p-2">{h.params}</td>
                          <td className="p-2">{h.result}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={exportCSV}
                >
                  Export CSV
                </button>
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={exportJSON}
                >
                  Export JSON
                </button>
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={exportPDF}
                >
                  Export PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
