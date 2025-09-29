"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [calcType, setCalcType] = useState("single");
  const [precision, setPrecision] = useState("2");
  const [singlePa, setSinglePa] = useState("");
  const [multiplePa, setMultiplePa] = useState("");
  const [multiplePb, setMultiplePb] = useState("");
  const [multiplePab, setMultiplePab] = useState("");
  const [conditionalPab, setConditionalPab] = useState("");
  const [conditionalPb, setConditionalPb] = useState("");
  const [bayesPagivenb, setBayesPagivenb] = useState("");
  const [bayesPa, setBayesPa] = useState("");
  const [bayesPbgivena, setBayesPbgivena] = useState("");
  const [bayesPb, setBayesPb] = useState("");
  const [normalMean, setNormalMean] = useState("");
  const [normalStd, setNormalStd] = useState("");
  const [normalX, setNormalX] = useState("");
  const [combinatorialN, setCombinatorialN] = useState("");
  const [combinatorialK, setCombinatorialK] = useState("");
  const [combinatorialType, setCombinatorialType] = useState("combination");
  const [batchFile, setBatchFile] = useState(null);
  const [batchText, setBatchText] = useState("");
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState({ content: "", stats: "", venn: null });
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  const vennCanvasRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);
  const lastResults = useRef([]);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("probCalcHistory");
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

  useEffect(() => {
    updateVennDiagram();
  }, [results.venn]);

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

  const calculateParameters = (calcType, params, precision) => {
    let results = {};
    params = params.map((p) => parseInput(p));

    try {
      if (calcType === "single") {
        const [pa] = params;
        if (pa < 0 || pa > 1) throw new Error("Probability must be between 0 and 1");
        results.pa = pa;
      } else if (calcType === "multiple") {
        const [pa, pb, pab] = params;
        if (pa < 0 || pa > 1 || pb < 0 || pb > 1 || pab < 0 || pab > Math.min(pa, pb)) {
          throw new Error("Invalid probabilities");
        }
        results.pa = pa;
        results.pb = pb;
        results.pab = pab;
        results.pa_or_b = pa + pb - pab;
        results.pa_given_b = pab / pb;
      } else if (calcType === "conditional") {
        const [pab, pb] = params;
        if (pb <= 0 || pab < 0 || pab > pb) throw new Error("Invalid probabilities");
        results.pa_given_b = pab / pb;
        results.pab = pab;
        results.pb = pb;
      } else if (calcType === "bayes") {
        const [pagivenb, pa, pbgivena, pb] = params;
        if (
          pa < 0 ||
          pa > 1 ||
          pb < 0 ||
          pb > 1 ||
          pagivenb < 0 ||
          pagivenb > 1 ||
          pbgivena < 0 ||
          pbgivena > 1
        ) {
          throw new Error("Invalid probabilities");
        }
        const pb_new = (pbgivena * pa) / pagivenb;
        results.pagivenb = pagivenb;
        results.pa = pa;
        results.pbgivena = pbgivena;
        results.pb = pb_new;
      } else if (calcType === "normal") {
        const [mean, std, x] = params;
        if (std <= 0) throw new Error("Standard deviation must be positive");
        const z = (x - mean) / std;
        const pdf = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
        const cdf = 0.5 * (1 + window.math.erf(z / Math.sqrt(2)));
        results.pdf = pdf;
        results.cdf = cdf;
        results.z = z;
      } else if (calcType === "combinatorial") {
        const [n, k] = params.map(Math.round);
        const type = combinatorialType;
        if (n < 0 || k < 0 || k > n) throw new Error("Invalid n or k");
        if (type === "combination") {
          results.value = window.math.combinations(n, k);
        } else {
          results.value = window.math.permutations(n, k);
        }
        results.n = n;
        results.k = k;
      }

      return Object.fromEntries(
        Object.entries(results).map(([k, v]) => [k, typeof v === "number" ? Number(v).toFixed(precision) : v])
      );
    } catch (e) {
      throw new Error(`Calculation error for ${calcType}: ${e.message}`);
    }
  };

  const paramInputs = {
    single: { pa: singlePa },
    multiple: { pa: multiplePa, pb: multiplePb, pab: multiplePab },
    conditional: { pab: conditionalPab, pb: conditionalPb },
    bayes: { pagivenb: bayesPagivenb, pa: bayesPa, pbgivena: bayesPbgivena, pb: bayesPb },
    normal: { mean: normalMean, std: normalStd, x: normalX },
    combinatorial: { n: combinatorialN, k: combinatorialK },
  };

  const updateInputs = () => {
    clearCanvas();
  };

  const calculate = async () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision);
      const isBatch = batchFile || batchText;
      let results = [];

      if (!isBatch) {
        const inputs = Object.values(paramInputs[calcType]).map((v) => v.trim());
        if (inputs.some((v) => !v)) throw new Error("All parameters are required");
        const result = await computeCalculation(calcType, inputs, precisionVal);
        results.push(result);
        displayResults(results, calcType, precisionVal, isBatch);
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
        await processBatch(calculations, calcType, precisionVal, results);
        if (results.length === 0) throw new Error("No valid calculations in batch input");
        displayResults(results, calcType, precisionVal, isBatch);
      }
    } catch (e) {
      console.error("Calculation error:", e);
      showError(e.message || "Invalid input");
    }
  };

  const computeCalculation = async (calcType, inputs, precision) => {
    try {
      const params = calculateParameters(calcType, inputs, precision);
      params.calcType = calcType;
      return params;
    } catch (e) {
      throw new Error(`Invalid parameters for ${calcType}: ${e.message}`);
    }
  };

  const processBatch = async (calculations, calcType, precision, results) => {
    for (const c of calculations) {
      try {
        const [type, ...params] = c;
        if (!paramInputs[type]) throw new Error("Invalid calculation type");
        if (params.length !== Object.keys(paramInputs[type]).length)
          throw new Error(`Incorrect number of parameters for ${type}`);
        const result = await computeCalculation(type, params, precision);
        results.push(result);
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const displayResults = (results, calcType, precision, isBatch) => {
    let output;
    if (isBatch) {
      output = (
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
                .map((name) => `${name}: ${r[name] || "N/A"}`)
                .join(", ");
              const resultText = Object.entries(r)
                .filter(([k]) => !["calcType", ...Object.keys(paramInputs[r.calcType])].includes(k))
                .map(([k, v]) => `${k}: ${v}`)
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
    } else {
      const r = results[0];
      output = (
        <div>
          <strong>Results ({r.calcType}):</strong>
          <br />
          {Object.entries(r)
            .filter(([k]) => !["calcType", ...Object.keys(paramInputs[r.calcType])].includes(k))
            .map(([k, v]) => (
              <div key={k}>
                {k}: {v}
                <br />
              </div>
            ))}
          <br />
          <strong>Parameters:</strong>
          <br />
          {Object.keys(paramInputs[r.calcType])
            .map((name) => `${name}: ${r[name] || "N/A"}`)
            .join(", ")}
        </div>
      );
    }

    let statsText = "";
    if (isBatch && results.length > 1) {
      const values = results
        .map((r) => {
          if (r.pa) return parseFloat(r.pa);
          if (r.pa_given_b) return parseFloat(r.pa_given_b);
          if (r.cdf) return parseFloat(r.cdf);
          return null;
        })
        .filter((v) => v !== null);
      if (values.length > 0) {
        const stats = {
          mean: window.math.mean(values),
          median: window.math.median(values),
          stdDev: window.math.std(values),
          min: Math.min(...values),
          max: Math.max(...values),
        };
        statsText = (
          <div>
            <strong>Statistics (Probabilities):</strong>
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

    setResults({
      content: output,
      stats: statsText,
      venn: !isBatch && calcType === "multiple" && results.length === 1 ? results[0] : null,
    });
    setShowResults(true);

    const params = isBatch
      ? `Batch: ${results.length} calculations, Type: ${calcType}`
      : `${results[0].calcType}: ${Object.keys(paramInputs[results[0].calcType])
          .map((name) => `${name}=${results[0][name] || "N/A"}`)
          .join(", ")}`;
    saveToHistory(
      params,
      JSON.stringify(results)
        .replace(/<[^>]+>/g, "; ")
        .substring(0, 100) + "..."
    );

    lastResults.current = results;
    updateVisualizations(results, calcType, isBatch);
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const probs = statInput
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      const precisionVal = parseInt(precision);

      if (probs.length === 0) throw new Error("Invalid probability list");
      if (probs.some((p) => p < 0 || p > 1)) throw new Error("Probabilities must be between 0 and 1");

      const stats = {
        mean: window.math.mean(probs),
        median: window.math.median(probs),
        stdDev: window.math.std(probs),
        min: Math.min(...probs),
        max: Math.max(...probs),
      };
      const statsText = (
        <div>
          Mean: {Number(stats.mean).toFixed(precisionVal)}
          <br />
          Median: {Number(stats.median).toFixed(precisionVal)}
          <br />
          Standard Deviation: {Number(stats.stdDev).toFixed(precisionVal)}
          <br />
          Min: {Number(stats.min).toFixed(precisionVal)}
          <br />
          Max: {Number(stats.max).toFixed(precisionVal)}
        </div>
      );
      const expression = `Stats(${probs.join(", ")})`;

      setResults({
        content: (
          <div>
            <strong>Statistical Analysis (Probabilities):</strong>
            <br />
            {statsText}
          </div>
        ),
        stats: "",
        venn: null,
      });
      setShowResults(true);

      saveToHistory(expression, JSON.stringify(stats).replace(/<br>/g, "; "));
      updateBarChart(probs, true);
    } catch (e) {
      console.error("Stats error:", e);
      showError("Invalid statistical input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const variationVal = parseFloat(variation);
      const precisionVal = parseInt(precision);
      let inputs = Object.values(paramInputs[calcType]).map((v) => v.trim());
      if (inputs.some((v) => !v)) throw new Error("All parameters required");
      if (isNaN(variationVal) || variationVal <= 0) throw new Error("Invalid variation percentage");

      const params = inputs.map((p) => parseInput(p));
      const results = [];
      const step = variationVal / 5;

      for (let v = -variationVal; v <= variationVal; v += step) {
        const variedParams = params.map((p) => p * (1 + v / 100));
        try {
          const calc = calculateParameters(calcType, variedParams, precisionVal);
          results.push({
            variation: v,
            value: calc.pa || calc.pa_given_b || calc.cdf || calc.value || 0,
          });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      const resultText = results.map((r) => (
        <div key={r.variation}>
          Variation {Number(r.variation).toFixed(2)}%: Probability = {Number(r.value).toFixed(precisionVal)}
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
        venn: null,
      });
      setShowResults(true);

      saveToHistory(`Sensitivity (±${variationVal}%)`, JSON.stringify(results).replace(/<br>/g, "; "));
      updateSensitivityChart(results);
    } catch (e) {
      console.error("Sensitivity error:", e);
      showError("Invalid sensitivity input: " + e.message);
    }
  };

  const updateVisualizations = (results, calcType, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();

    const values = results
      .map((r) => {
        if (r.pa) return parseFloat(r.pa);
        if (r.pa_given_b) return parseFloat(r.pa_given_b);
        if (r.cdf) return parseFloat(r.cdf);
        if (r.value) return parseFloat(r.value);
        return null;
      })
      .filter((v) => v !== null);
    if (values.length > 0) {
      updateBarChart(values, false);
    }

    if (isBatch && results.length > 1) {
      const typeCounts = {};
      results.forEach((r) => {
        typeCounts[r.calcType] = (typeCounts[r.calcType] || 0) + 1;
      });

      if (pieChartRef.current) {
        pieChartInstance.current = new window.Chart(pieChartRef.current, {
          type: "pie",
          data: {
            labels: Object.keys(typeCounts),
            datasets: [
              {
                data: Object.values(typeCounts),
                backgroundColor: [
                  "#3b82f6",
                  "#10b981",
                  "#f59e0b",
                  "#ef4444",
                  "#8b5cf6",
                  "#ec4899",
                  "#6b7280",
                ],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: "Result Distribution by Calculation Type" },
            },
          },
        });
      }
    }
  };

  const updateBarChart = (values, isStats = false) => {
    if (!barChartRef.current) return;
    if (barChartInstance.current) barChartInstance.current.destroy();

    const labels = isStats
      ? values.map((_, i) => `Probability ${i + 1}`)
      : lastResults.current.map((r) => r.calcType);
    barChartInstance.current = new window.Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Probability",
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
          y: { beginAtZero: true, title: { display: true, text: "Probability" } },
          x: { title: { display: true, text: isStats ? "Probabilities" : "Calculation Types" } },
        },
        plugins: {
          title: {
            display: true,
            text: isStats ? "Statistical Probability Analysis" : "Probability Comparison",
          },
        },
      },
    });
  };

  const updateSensitivityChart = (results) => {
    if (!barChartRef.current) return;
    if (barChartInstance.current) barChartInstance.current.destroy();

    barChartInstance.current = new window.Chart(barChartRef.current, {
      type: "line",
      data: {
        labels: results.map((r) => `${Number(r.variation).toFixed(2)}%`),
        datasets: [
          {
            label: "Probability",
            data: results.map((r) => r.value),
            borderColor: "#ef4444", // Primary color
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Probability" } },
          x: { title: { display: true, text: "Variation (%)" } },
        },
        plugins: {
          title: { display: true, text: "Sensitivity Analysis" },
        },
      },
    });
  };

  const updateVennDiagram = () => {
    const canvas = vennCanvasRef.current;
    if (!canvas || !results.venn) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
      const { pa, pb, pab, pa_or_b } = results.venn;
      const precisionVal = parseInt(precision);

      ctx.strokeStyle = "#b91c1c"; // Darker red for stroke
      ctx.lineWidth = 2;
      ctx.font = "12px Inter";

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const radius = Math.min(canvasWidth, canvasHeight) / 4;
      const centerA = { x: canvasWidth / 3, y: canvasHeight / 2 };
      const centerB = { x: (2 * canvasWidth) / 3, y: canvasHeight / 2 };
      const scale = 1;

      // Draw grid
      drawGrid(ctx, canvasWidth, canvasHeight, scale);

      // Draw circles
      ctx.beginPath();
      ctx.arc(centerA.x, centerA.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(239, 68, 68, 0.3)"; // Red-500 with opacity
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerB.x, centerB.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(239, 68, 68, 0.3)"; // Red-500 with opacity
      ctx.fill();
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#000";
      ctx.fillText(`P(A): ${Number(pa).toFixed(precisionVal)}`, centerA.x - 50, centerA.y - 50);
      ctx.fillText(`P(B): ${Number(pb).toFixed(precisionVal)}`, centerB.x + 20, centerB.y - 50);
      ctx.fillText(`P(A ∩ B): ${Number(pab).toFixed(precisionVal)}`, (centerA.x + centerB.x) / 2, centerA.y);
      ctx.fillText(
        `P(A ∪ B): ${Number(pa_or_b).toFixed(precisionVal)}`,
        canvasWidth / 2 - 40,
        canvasHeight - 20
      );

      // Interactive regions
      const interactiveRegions = [
        {
          type: "circle",
          label: `P(A): ${Number(pa).toFixed(precisionVal)}`,
          x: centerA.x,
          y: centerA.y,
          radius,
        },
        {
          type: "circle",
          label: `P(B): ${Number(pb).toFixed(precisionVal)}`,
          x: centerB.x,
          y: centerB.y,
          radius,
        },
        {
          type: "overlap",
          label: `P(A ∩ B): ${Number(pab).toFixed(precisionVal)}`,
          x: (centerA.x + centerB.x) / 2,
          y: centerA.y,
          radius: radius / 2,
        },
      ];

      // Handle mouse move for tooltips
      canvas.onmousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        let tooltipText = "";
        interactiveRegions.forEach((region) => {
          const dx = x - region.x;
          const dy = y - region.y;
          if (Math.sqrt(dx * dx + dy * dy) < region.radius) {
            tooltipText = region.label;
          }
        });

        if (tooltipText) {
          setTooltip({ visible: true, text: tooltipText, x: e.clientX + 10, y: e.clientY + 10 });
        } else {
          setTooltip({ visible: false, text: "", x: 0, y: 0 });
        }
      };

      canvas.onmouseout = () => {
        setTooltip({ visible: false, text: "", x: 0, y: 0 });
      };
    } catch (e) {
      console.error("Venn diagram error:", e);
      ctx.fillStyle = "#000";
      ctx.fillText("Error rendering Venn diagram", 10, 50);
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

  const clearInputs = () => {
    clearMessages();
    setSinglePa("");
    setMultiplePa("");
    setMultiplePb("");
    setMultiplePab("");
    setConditionalPab("");
    setConditionalPb("");
    setBayesPagivenb("");
    setBayesPa("");
    setBayesPbgivena("");
    setBayesPb("");
    setNormalMean("");
    setNormalStd("");
    setNormalX("");
    setCombinatorialN("");
    setCombinatorialK("");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setShowResults(false);
    setResults({ content: "", stats: "", venn: null });
    clearCanvas();
    showSuccess("Inputs cleared!");
  };

  const clearCanvas = () => {
    const canvas = vennCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();
  };

  const saveToHistory = (params, result) => {
    const newHistory = [...history, { date: new Date().toLocaleString(), params, result }];
    setHistory(newHistory);
    localStorage.setItem("probCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calculation_history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calculation_history.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
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

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">
            Advanced Probability Calculator
          </h1>
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
                    Select the type of probability calculation.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={calcType}
                  onChange={(e) => {
                    setCalcType(e.target.value);
                    updateInputs();
                  }}
                >
                  <option value="single">Single Event (P(A))</option>
                  <option value="multiple">Multiple Events (P(A and B), P(A or B))</option>
                  <option value="conditional">Conditional Probability (P(A|B))</option>
                  <option value="bayes">Bayes' Theorem</option>
                  <option value="normal">Normal Distribution</option>
                  <option value="combinatorial">Combinations/Permutations</option>
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
            {calcType === "single" && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">P(A)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0.4"
                      value={singlePa}
                      onChange={(e) => setSinglePa(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {calcType === "multiple" && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">P(A)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0.4"
                      value={multiplePa}
                      onChange={(e) => setMultiplePa(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">P(B)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0.3"
                      value={multiplePb}
                      onChange={(e) => setMultiplePb(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">P(A and B)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0.1"
                      value={multiplePab}
                      onChange={(e) => setMultiplePab(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {calcType === "conditional" && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">P(A and B)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0.1"
                      value={conditionalPab}
                      onChange={(e) => setConditionalPab(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">P(B)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0.3"
                      value={conditionalPb}
                      onChange={(e) => setConditionalPb(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {calcType === "bayes" && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">P(A|B)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0.9"
                      value={bayesPagivenb}
                      onChange={(e) => setBayesPagivenb(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">P(A)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0.01"
                      value={bayesPa}
                      onChange={(e) => setBayesPa(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">P(B|A)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0.95"
                      value={bayesPbgivena}
                      onChange={(e) => setBayesPbgivena(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">P(B)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0.1"
                      value={bayesPb}
                      onChange={(e) => setBayesPb(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {calcType === "normal" && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Mean (μ)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0"
                      value={normalMean}
                      onChange={(e) => setNormalMean(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Standard Deviation (σ)
                    </label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 1"
                      value={normalStd}
                      onChange={(e) => setNormalStd(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">X Value</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 1.5"
                      value={normalX}
                      onChange={(e) => setNormalX(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {calcType === "combinatorial" && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Total Items (n)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 10"
                      value={combinatorialN}
                      onChange={(e) => setCombinatorialN(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Selected Items (k)</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 5"
                      value={combinatorialK}
                      onChange={(e) => setCombinatorialK(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Type</label>
                    <select
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      value={combinatorialType}
                      onChange={(e) => setCombinatorialType(e.target.value)}
                    >
                      <option value="combination">Combination (C(n,k))</option>
                      <option value="permutation">Permutation (P(n,k))</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: type,param1,param2,...)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter calculations (e.g., single,0.4;multiple,0.4,0.3,0.1).
                </span>
              </label>
              <input
                type="file"
                accept=".csv"
                className="p-3 border rounded-lg w-full mb-2 bg-gray-200"
                onChange={(e) => setBatchFile(e.target.files[0])}
              />
              <textarea
                className="p-3 border rounded-lg w-full bg-gray-200"
                rows="4"
                placeholder="e.g., single,0.4;multiple,0.4,0.3,0.1"
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
                  Analyze Probabilities (comma-separated)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter probabilities for statistical analysis.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 0.4,0.3,0.5"
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
              <div className="mt-6 relative">
                <h3 className="text-md font-medium text-gray-700">Venn Diagram</h3>
                <canvas
                  ref={vennCanvasRef}
                  className="w-full max-w-[500px] h-[300px] border border-gray-300 bg-white mx-auto"
                />
                {tooltip.visible && (
                  <div
                    className="absolute bg-gray-600 text-white text-xs rounded p-2 pointer-events-none z-10"
                    style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, opacity: 1 }}
                  >
                    {tooltip.text}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Probability Comparison</h3>
                <canvas ref={barChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Result Distribution</h3>
                <canvas ref={pieChartRef} className="max-h-80" />
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
