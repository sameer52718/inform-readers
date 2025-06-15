"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [calcType, setCalcType] = useState("hypotenuse");
  const [precision, setPrecision] = useState("2");
  const [hypotenuseA, setHypotenuseA] = useState("");
  const [hypotenuseB, setHypotenuseB] = useState("");
  const [legA, setLegA] = useState("");
  const [legC, setLegC] = useState("");
  const [verifyA, setVerifyA] = useState("");
  const [verifyB, setVerifyB] = useState("");
  const [verifyC, setVerifyC] = useState("");
  const [triplesMax, setTriplesMax] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [batchText, setBatchText] = useState("");
  const [statInput, setStatInput] = useState("");
  const [statType, setStatType] = useState("hypotenuse");
  const [variation, setVariation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState({ content: "", stats: "" });
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const lastResults = useRef([]);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("pythagoreanCalcHistory");
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

  const calculateParameters = (calcType, params, precision) => {
    let results = {};
    params = params.map((p) => parseInput(p));

    try {
      if (calcType === "hypotenuse") {
        const [a, b] = params;
        if (a <= 0 || b <= 0) throw new Error("Legs must be positive");
        const c = Math.sqrt(a * a + b * b);
        results.a = a;
        results.b = b;
        results.c = c;
        results.area = 0.5 * a * b;
        results.perimeter = a + b + c;
        results.angleA = (Math.atan2(a, b) * 180) / Math.PI;
        results.angleB = (Math.atan2(b, a) * 180) / Math.PI;
        results.sinA = a / c;
        results.cosA = b / c;
        results.tanA = a / b;
        results.height = (a * b) / c;
      } else if (calcType === "leg") {
        const [a, c] = params;
        if (a <= 0 || c <= 0) throw new Error("Leg and hypotenuse must be positive");
        if (a >= c) throw new Error("Leg must be less than hypotenuse");
        const b = Math.sqrt(c * c - a * a);
        results.a = a;
        results.b = b;
        results.c = c;
        results.area = 0.5 * a * b;
        results.perimeter = a + b + c;
        results.angleA = (Math.atan2(a, b) * 180) / Math.PI;
        results.angleB = (Math.atan2(b, a) * 180) / Math.PI;
        results.sinA = a / c;
        results.cosA = b / c;
        results.tanA = a / b;
        results.height = (a * b) / c;
      } else if (calcType === "verify") {
        const [a, b, c] = params;
        if (a <= 0 || b <= 0 || c <= 0) throw new Error("Sides must be positive");
        const isRight = Math.abs(a * a + b * b - c * c) < 1e-6;
        results.a = a;
        results.b = b;
        results.c = c;
        results.isRight = isRight;
        if (isRight) {
          results.area = 0.5 * a * b;
          results.perimeter = a + b + c;
          results.angleA = (Math.atan2(a, b) * 180) / Math.PI;
          results.angleB = (Math.atan2(b, a) * 180) / Math.PI;
          results.sinA = a / c;
          results.cosA = b / c;
          results.tanA = a / b;
          results.height = (a * b) / c;
        }
      } else if (calcType === "triples") {
        const [maxMN] = params;
        if (maxMN <= 0 || !Number.isInteger(maxMN)) throw new Error("Max m,n must be a positive integer");
        const triples = [];
        for (let m = 2; m <= maxMN; m++) {
          for (let n = 1; n < m; n++) {
            if (window.math.gcd(m, n) === 1 && (m - n) % 2 === 1) {
              const a = m * m - n * n;
              const b = 2 * m * n;
              const c = m * m + n * n;
              triples.push([a, b, c]);
            }
          }
        }
        results.maxMN = maxMN;
        results.triples = triples;
      }

      return Object.fromEntries(
        Object.entries(results).map(([k, v]) => {
          if (typeof v === "number") return [k, Number(v).toFixed(precision)];
          if (Array.isArray(v) && k === "triples") return [k, v.map((t) => `(${t.join(", ")})`).join("; ")``];
          return [k, v];
        })
      );
    } catch (e) {
      throw new Error(`Calculation error for ${calcType}: ${e.message}`);
    }
  };

  const paramInputs = {
    hypotenuse: { a: hypotenuseA, b: hypotenuseB },
    leg: { a: legA, c: legC },
    verify: { a: verifyA, b: verifyB, c: verifyC },
    triples: { maxMN: triplesMax },
  };

  const updateInputs = () => {
    clearVisualizations();
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
      const hypotenuses = results.map((r) => parseFloat(r.c)).filter((c) => !isNaN(c));
      if (hypotenuses.length > 0) {
        const frequency = {};
        hypotenuses.forEach((c) => (frequency[c] = (frequency[c] || 0) + 1));
        output = (
          <div>
            {output}
            <br />
            <strong>Hypotenuse Frequency Table:</strong>
            <br />
            <table className="w-full text-sm text-gray-600">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Hypotenuse</th>
                  <th className="p-2">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(frequency).map(([c, freq]) => (
                  <tr key={c}>
                    <td className="p-2">{Number(c).toFixed(precision)}</td>
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
      const hypotenuses = results.map((r) => parseFloat(r.c)).filter((c) => !isNaN(c));
      if (hypotenuses.length > 0) {
        const stats = {
          mean: window.math.mean(hypotenuses),
          median: window.math.median(hypotenuses),
          stdDev: window.math.std(hypotenuses),
          min: Math.min(...hypotenuses),
          max: Math.max(...hypotenuses),
        };
        statsText = (
          <div>
            <strong>Statistics (Hypotenuses):</strong>
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
      const values = statInput
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      const precisionVal = parseInt(precision);

      if (values.length === 0) throw new Error("Invalid value list");

      let transformedValues = values;
      if (statType === "area") {
        transformedValues = values.map((c) => {
          const a = Math.sqrt((c * c) / 2);
          return 0.5 * a * a;
        });
      } else if (statType === "perimeter") {
        transformedValues = values.map((c) => {
          const a = Math.sqrt((c * c) / 2);
          return a + a + c;
        });
      }

      const stats = {
        mean: window.math.mean(transformedValues),
        median: window.math.median(transformedValues),
        stdDev: window.math.std(transformedValues),
        min: Math.min(...transformedValues),
        max: Math.max(...transformedValues),
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
      const expression = `Stats(${values.join(", ")}, ${statType})`;

      setResults({
        content: (
          <div>
            <strong>Statistical Analysis ({statType}):</strong>
            <br />
            {statsText}
          </div>
        ),
        stats: "",
      });
      setShowResults(true);

      saveToHistory(expression, JSON.stringify(stats).replace(/<br>/g, "; "));
      updateBarChart(transformedValues, true);
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
        if (variedParams.some((p) => p <= 0)) continue;
        try {
          const calc = calculateParameters(calcType, variedParams, precisionVal);
          let value;
          if (calcType === "hypotenuse") value = calc.c;
          else if (calcType === "leg") value = calc.b;
          else if (calcType === "verify") value = calc.isRight ? calc.area : 0;
          else if (calcType === "triples") value = 0;
          results.push({
            variation: v,
            value: parseFloat(value),
          });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      const resultText = results.map((r) => (
        <div key={r.variation}>
          Variation {Number(r.variation).toFixed(2)}%: Value = {Number(r.value).toFixed(precisionVal)}
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

      saveToHistory(`Sensitivity (±${variationVal}%)`, JSON.stringify(results).replace(/<br>/g, "; "));
      updateSensitivityChart(results);
    } catch (e) {
      console.error("Sensitivity error:", e);
      showError("Invalid sensitivity input: " + e.message);
    }
  };

  const updateVisualizations = (results, calcType, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();

    if (!isBatch && results.length === 1 && calcType !== "triples") {
      drawTriangleVisualization(results[0]);
    } else {
      const svg = document.getElementById("triangle-visual");
      if (svg) {
        svg.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single triangle</text>';
      }
    }

    const values = results
      .map((r) => {
        if (calcType === "hypotenuse" || calcType === "leg" || calcType === "verify")
          return parseFloat(r.c) || 0;
        return 0;
      })
      .filter((v) => v !== 0);
    if (values.length > 0) {
      updateBarChart(values, false);
    }
  };

  const updateBarChart = (values, isStats = false) => {
    if (!barChartRef.current) return;
    if (barChartInstance.current) barChartInstance.current.destroy();

    const labels = isStats
      ? values.map((_, i) => `Value ${i + 1}`)
      : lastResults.current.map((_, i) => `Calc ${i + 1}`);
    barChartInstance.current = new window.Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: isStats
              ? "Value"
              : calcType === "hypotenuse" || calcType === "leg" || calcType === "verify"
              ? "Hypotenuse"
              : "Value",
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
          y: { beginAtZero: true, title: { display: true, text: "Value" } },
          x: { title: { display: true, text: isStats ? "Values" : "Calculations" } },
        },
        plugins: {
          title: { display: true, text: isStats ? "Value Analysis" : "Calculation Comparison" },
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
            label: "Value",
            data: results.map((r) => r.value),
            borderColor: "#ef4444", // Primary color
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
        plugins: {
          title: { display: true, text: "Sensitivity Analysis" },
        },
      },
    });
  };

  const drawTriangleVisualization = (result) => {
    const svg = document.getElementById("triangle-visual");
    if (!svg) return;
    svg.innerHTML = "";
    const width = 300;
    const height = 300;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    try {
      const a = parseFloat(result.a);
      const b = parseFloat(result.b);
      const c = parseFloat(result.c);
      const precisionVal = parseInt(precision);

      const maxSide = Math.max(a, b, c);
      const scale = 200 / maxSide;
      const scaledA = a * scale;
      const scaledB = b * scale;

      const x1 = 50,
        y1 = height - 50; // Vertex C (right angle)
      const x2 = x1 + scaledB,
        y2 = y1; // Vertex B
      const x3 = x1,
        y3 = y1 - scaledA; // Vertex A

      // Draw triangle
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${x1},${y1} L ${x2},${y2} L ${x3},${y3} Z`);
      path.setAttribute("fill", "rgba(239, 68, 68, 0.3)"); // Red-500 with opacity
      path.setAttribute("stroke", "#b91c1c");
      path.setAttribute("stroke-width", "2");
      svg.appendChild(path);

      // Label sides
      const labels = [
        { text: `a=${Number(a).toFixed(precisionVal)}`, x: (x3 + x1) / 2 - 10, y: (y3 + y1) / 2 },
        { text: `b=${Number(b).toFixed(precisionVal)}`, x: (x1 + x2) / 2, y: y1 + 20 },
        { text: `c=${Number(c).toFixed(precisionVal)}`, x: (x2 + x3) / 2 + 10, y: (y2 + y3) / 2 },
      ];
      labels.forEach((label) => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", label.x);
        text.setAttribute("y", label.y);
        text.setAttribute("fill", "#000");
        text.setAttribute("font-size", "12");
        text.textContent = label.text;
        svg.appendChild(text);
      });

      // Draw right angle indicator
      const rightAngle = document.createElementNS("http://www.w3.org/2000/svg", "path");
      rightAngle.setAttribute("d", `M ${x1},${y1} h 20 v -20`);
      rightAngle.setAttribute("fill", "none");
      rightAngle.setAttribute("stroke", "#ef4444"); // Primary color
      rightAngle.setAttribute("stroke-width", "2");
      svg.appendChild(rightAngle);
    } catch (e) {
      console.error("Visualization error:", e);
      svg.innerHTML = '<text x="10" y="50" fill="#000" font-size="14">Error rendering visualization</text>';
    }
  };

  const clearInputs = () => {
    clearMessages();
    setHypotenuseA("");
    setHypotenuseB("");
    setLegA("");
    setLegC("");
    setVerifyA("");
    setVerifyB("");
    setVerifyC("");
    setTriplesMax("");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setShowResults(false);
    setResults({ content: "", stats: "" });
    clearVisualizations();
    showSuccess("Inputs cleared!");
  };

  const clearVisualizations = () => {
    const svg = document.getElementById("triangle-visual");
    if (svg) svg.innerHTML = "";
    if (barChartInstance.current) barChartInstance.current.destroy();
  };

  const saveToHistory = (params, result) => {
    const newHistory = [...history, { date: new Date().toLocaleString(), params, result }];
    setHistory(newHistory);
    localStorage.setItem("pythagoreanCalcHistory", JSON.stringify(newHistory));
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
      <div className="min-h-screen bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">
            Advanced Pythagorean Theorem Calculator
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
                    Select the type of Pythagorean calculation.
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
                  <option value="hypotenuse">Find Hypotenuse (a, b given)</option>
                  <option value="leg">Find Leg (a, c given)</option>
                  <option value="verify">Verify Right Triangle (a, b, c given)</option>
                  <option value="triples">Generate Pythagorean Triples</option>
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
            {calcType === "hypotenuse" && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Leg a</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 3"
                      value={hypotenuseA}
                      onChange={(e) => setHypotenuseA(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Leg b</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 4"
                      value={hypotenuseB}
                      onChange={(e) => setHypotenuseB(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {calcType === "leg" && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Leg a</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 3"
                      value={legA}
                      onChange={(e) => setLegA(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Hypotenuse c</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 5"
                      value={legC}
                      onChange={(e) => setLegC(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {calcType === "verify" && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Side a</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 3"
                      value={verifyA}
                      onChange={(e) => setVerifyA(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Side b</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 4"
                      value={verifyB}
                      onChange={(e) => setVerifyB(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Side c</label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 5"
                      value={verifyC}
                      onChange={(e) => setVerifyC(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {calcType === "triples" && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Max m,n (for triples)
                    </label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 10"
                      value={triplesMax}
                      onChange={(e) => setTriplesMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: type,a,b,... or type,a,b,c,...)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter calculations (e.g., hypotenuse,3,4;verify,3,4,5).
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
                placeholder="e.g., hypotenuse,3,4;verify,3,4,5"
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
                  Analyze Values (comma-separated)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter values (e.g., hypotenuses, areas) for analysis.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 5,13,25"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                />
                <select
                  className="p-3 border rounded-lg w-full mt-2 bg-gray-200"
                  value={statType}
                  onChange={(e) => setStatType(e.target.value)}
                >
                  <option value="hypotenuse">Hypotenuse</option>
                  <option value="area">Area</option>
                  <option value="perimeter">Perimeter</option>
                </select>
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
                <h3 className="text-md font-medium text-gray-700">Triangle Visualization</h3>
                <svg id="triangle-visual" className="w-full max-w-[300px] h-[300px] mx-auto"></svg>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Values Comparison</h3>
                <canvas ref={barChartRef} className="max-h-80" />
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
