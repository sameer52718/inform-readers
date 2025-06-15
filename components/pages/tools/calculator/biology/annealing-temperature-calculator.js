"use client";
import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [formData, setFormData] = useState({
    calcMethod: "basic",
    precision: 2,
    forwardPrimer: "ATGGCTAGCTAGCT",
    reversePrimer: "TAGCTAGCTAGCTA",
    saltConc: 50,
    primerConc: 200,
    batchText:
      "ATGGCTAGCTAGCT,TAGCTAGCTAGCTA,50,200;GCTAGCTAGCTAGC,CGATCGATCGATCG,50,200;AATTCCGGTTCCGG,TTAAGGCCAAGGCC,50,200",
    statInput: "",
    statType: "ta",
    variation: 10,
  });
  const [batchFile, setBatchFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [results, setResults] = useState([]);
  const [isBatch, setIsBatch] = useState(false);
  const barChartRef = useRef(null);
  const svgRef = useRef(null);
  let barChartInstance = useRef(null);

  const nnParams = {
    AA: { dH: -7.9, dS: -22.2 },
    AT: { dH: -7.2, dS: -20.4 },
    TA: { dH: -7.2, dS: -21.3 },
    AG: { dH: -7.8, dS: -21.0 },
    GA: { dH: -8.2, dS: -22.2 },
    AC: { dH: -8.4, dS: -22.4 },
    CA: { dH: -8.5, dS: -22.7 },
    GG: { dH: -8.0, dS: -19.9 },
    GC: { dH: -9.8, dS: -24.4 },
    CG: { dH: -10.6, dS: -27.2 },
    CC: { dH: -8.0, dS: -19.9 },
    GT: { dH: -8.4, dS: -22.4 },
    TG: { dH: -8.5, dS: -22.7 },
    CT: { dH: -7.8, dS: -21.0 },
    TC: { dH: -8.2, dS: -22.2 },
    TT: { dH: -7.9, dS: -22.2 },
  };
  const initiation = { dH: 0, dS: -10.8 };
  const terminalAT = { dH: 2.3, dS: 4.1 };
  const R = 1.987;
  const molWeights = { A: 313.21, T: 304.2, G: 329.21, C: 289.18 };
  const extCoeffs = { A: 15400, T: 8700, G: 11500, C: 7400 };

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("annealingCalcHistory")) || [];
    setCalculationHistory(savedHistory);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["saltConc", "primerConc", "variation"].includes(name) ? parseFloat(value) || "" : value,
    }));
  };

  const handleFileChange = (e) => {
    setBatchFile(e.target.files[0]);
  };

  const parseInput = (input, isSequence = false) => {
    try {
      if (!input.trim()) throw new Error("Input cannot be empty");
      if (isSequence) {
        const validBases = /^[ATGCatgc]+$/;
        if (!validBases.test(input)) throw new Error("Sequence must contain only A, T, G, C");
        return input.toUpperCase();
      }
      const value = math.evaluate(input);
      if (isNaN(value) || !isFinite(value)) throw new Error("Invalid numerical value");
      return value;
    } catch (e) {
      throw new Error(`Invalid input: ${e.message}`);
    }
  };

  const calculatePrimerProperties = (sequence, method, saltConc, primerConc, precision) => {
    const seq = sequence.toUpperCase();
    if (seq.length < 10 || seq.length > 50) throw new Error("Primer length must be 10–50 bases");

    const gcCount = (seq.match(/[GC]/gi) || []).length;
    const atCount = (seq.match(/[AT]/gi) || []).length;
    const gcContent = (gcCount / seq.length) * 100;
    const molWeight = Array.from(seq).reduce((sum, base) => sum + molWeights[base], 0);
    const extCoeff = Array.from(seq).reduce((sum, base) => sum + extCoeffs[base], 0);

    let tm;
    if (method === "basic") {
      tm = 4 * gcCount + 2 * atCount;
    } else {
      let dH = initiation.dH;
      let dS = initiation.dS;
      for (let i = 0; i < seq.length - 1; i++) {
        const pair = seq.slice(i, i + 2);
        if (nnParams[pair]) {
          dH += nnParams[pair].dH;
          dS += nnParams[pair].dS;
        }
      }
      if (["A", "T"].includes(seq[0])) {
        dH += terminalAT.dH;
        dS += terminalAT.dS;
      }
      if (["A", "T"].includes(seq[seq.length - 1])) {
        dH += terminalAT.dH;
        dS += terminalAT.dS;
      }
      const salt = saltConc / 1000;
      tm = (dH * 1000) / (dS + R * Math.log(salt)) - 273.15 + 16.6 * Math.log10(salt);
    }

    const taOffset = method === "basic" ? 5 : 3;
    const ta = tm - taOffset;

    const complement = seq.replace(/[ATGC]/g, (b) => ({ A: "T", T: "A", G: "C", C: "G" }[b]));
    const revComplement = complement.split("").reverse().join("");

    return {
      sequence: seq,
      length: seq.length,
      gcContent: gcContent.toFixed(precision),
      tm: tm.toFixed(precision),
      ta: ta.toFixed(precision),
      molWeight: molWeight.toFixed(precision),
      extCoeff: extCoeff.toFixed(precision),
      complement,
      revComplement,
    };
  };

  const calculateParameters = (forward, reverse, method, saltConc, primerConc, precision) => {
    if (saltConc <= 0 || saltConc > 1000) throw new Error("Salt concentration must be 0–1000 mM");
    if (primerConc <= 0 || primerConc > 10000) throw new Error("Primer concentration must be 0–10000 nM");

    const forwardProps = calculatePrimerProperties(forward, method, saltConc, primerConc, precision);
    const reverseProps = reverse
      ? calculatePrimerProperties(reverse, method, saltConc, primerConc, precision)
      : null;

    const results = { forward: forwardProps };
    if (reverseProps) {
      results.reverse = reverseProps;
      const taAvg = (parseFloat(forwardProps.ta) + parseFloat(reverseProps.ta)) / 2;
      const taDiff = Math.abs(parseFloat(forwardProps.ta) - parseFloat(reverseProps.ta));
      results.pair = {
        ta: taAvg.toFixed(precision),
        taRange: `${(taAvg - 2).toFixed(precision)}–${(taAvg + 2).toFixed(precision)}`,
        taDiff: taDiff.toFixed(precision),
        compatibility: taDiff <= 5 ? "Good" : "Poor (T_a difference > 5°C)",
      };
    }

    return results;
  };

  const computeCalculation = async (forward, reverse, method, saltConc, primerConc, precision) => {
    const params = calculateParameters(
      parseInput(forward, true),
      reverse ? parseInput(reverse, true) : "",
      method,
      saltConc,
      primerConc,
      precision
    );
    params.method = method;
    return params;
  };

  const processBatch = async (calculations, method, precision, results) => {
    for (const c of calculations) {
      try {
        const [forward, reverse = "", salt = 50, primer = 200] = c;
        const result = await computeCalculation(
          forward,
          reverse,
          method,
          parseInput(salt),
          parseInput(primer),
          precision
        );
        results.push(result);
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const calculate = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const { calcMethod, precision, forwardPrimer, reversePrimer, saltConc, primerConc, batchText } =
        formData;
      let results = [];
      let isBatch = batchFile || batchText;

      if (!isBatch) {
        if (!forwardPrimer) throw new Error("Forward primer is required");
        const result = await computeCalculation(
          forwardPrimer,
          reversePrimer,
          calcMethod,
          saltConc,
          primerConc,
          precision
        );
        results.push(result);
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
        await processBatch(calculations, calcMethod, precision, results);
        if (results.length === 0) throw new Error("No valid calculations in batch input");
      }

      setResults(results);
      setIsBatch(isBatch);
      displayResults(results, calcMethod, precision, isBatch);
    } catch (e) {
      setErrorMessage(e.message || "Invalid input");
    }
  };

  const displayResults = (results, method, precision, isBatch) => {
    let output = "";
    let statsText = "";
    if (isBatch) {
      output = `
        <table class="w-full text-sm text-gray-600">
          <thead><tr class="bg-gray-200"><th class="p-2">Forward</th><th class="p-2">Reverse</th><th class="p-2">Results</th></tr></thead>
          <tbody>
            ${results
              .map((r) => {
                const forwardText = `Seq: ${r.forward.sequence}, T_a: ${r.forward.ta}°C, GC: ${r.forward.gcContent}%`;
                const reverseText = r.reverse
                  ? `Seq: ${r.reverse.sequence}, T_a: ${r.reverse.ta}°C, GC: ${r.reverse.gcContent}%`
                  : "N/A";
                const pairText = r.pair
                  ? `Pair T_a: ${r.pair.ta}°C (${r.pair.taRange}°C), Compatibility: ${r.pair.compatibility}`
                  : "";
                return `<tr><td class="p-2">${forwardText}</td><td class="p-2">${reverseText}</td><td class="p-2">${pairText}</td></tr>`;
              })
              .join("")}
          </tbody>
        </table>
      `;
      const tas = results.map((r) => parseFloat(r.forward.ta)).filter((t) => !isNaN(t));
      if (tas.length > 0) {
        const frequency = {};
        tas.forEach((t) => (frequency[t] = (frequency[t] || 0) + 1));
        output += `<br><strong>T_a Frequency Table:</strong><br>
          <table class="w-full text-sm text-gray-600">
            <thead><tr class="bg-gray-200"><th class="p-2">T_a (°C)</th><th class="p-2">Frequency</th></tr></thead>
            <tbody>
              ${Object.entries(frequency)
                .map(
                  ([t, freq]) =>
                    `<tr><td class="p-2">${Number(t).toFixed(
                      precision
                    )}</td><td class="p-2">${freq}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
        `;
      }
      if (results.length > 1) {
        const tas = results.map((r) => parseFloat(r.forward.ta)).filter((t) => !isNaN(t));
        if (tas.length > 0) {
          const stats = {
            mean: math.mean(tas),
            median: math.median(tas),
            stdDev: math.std(tas),
            min: Math.min(...tas),
            max: Math.max(...tas),
          };
          statsText = `
            <strong>Statistics (Forward T_a):</strong><br>
            Mean: ${Number(stats.mean).toFixed(precision)}°C<br>
            Median: ${Number(stats.median).toFixed(precision)}°C<br>
            Standard Deviation: ${Number(stats.stdDev).toFixed(precision)}°C<br>
            Min: ${Number(stats.min).toFixed(precision)}°C<br>
            Max: ${Number(stats.max).toFixed(precision)}°C
          `;
        }
      }
    } else {
      const r = results[0];
      output = `<strong>Results (${method}):</strong><br>
        <strong>Forward Primer:</strong><br>
        Sequence: ${r.forward.sequence}<br>
        T_m: ${r.forward.tm}°C<br>
        T_a: ${r.forward.ta}°C<br>
        GC Content: ${r.forward.gcContent}%<br>
        Length: ${r.forward.length} bases<br>
        Molecular Weight: ${r.forward.molWeight} g/mol<br>
        Extinction Coefficient: ${r.forward.extCoeff} M⁻¹cm⁻¹<br>
        Complement: ${r.forward.complement}<br>
        Reverse Complement: ${r.forward.revComplement}<br>
      `;
      if (r.reverse) {
        output += `<br><strong>Reverse Primer:</strong><br>
          Sequence: ${r.reverse.sequence}<br>
          T_m: ${r.reverse.tm}°C<br>
          T_a: ${r.reverse.ta}°C<br>
          GC Content: ${r.reverse.gcContent}%<br>
          Length: ${r.reverse.length} bases<br>
          Molecular Weight: ${r.reverse.molWeight} g/mol<br>
          Extinction Coefficient: ${r.reverse.extCoeff} M⁻¹cm⁻¹<br>
          Complement: ${r.reverse.complement}<br>
          Reverse Complement: ${r.reverse.revComplement}<br>
          <br><strong>Primer Pair:</strong><br>
          Average T_a: ${r.pair.ta}°C<br>
          T_a Range: ${r.pair.taRange}°C<br>
          T_a Difference: ${r.pair.taDiff}°C<br>
          Compatibility: ${r.pair.compatibility}<br>
        `;
      }
    }

    const params = isBatch
      ? `Batch: ${results.length} primer pairs, Method: ${method}`
      : `Forward: ${results[0].forward.sequence}, Reverse: ${
          results[0].reverse ? results[0].reverse.sequence : "N/A"
        }, Salt: ${formData.saltConc}mM`;
    saveToHistory(params, output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "...");

    setResults(results);
    setShowResults(true);
    updateVisualizations(results, isBatch);
  };

  const calculateStats = () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const { statInput, statType, precision } = formData;
      const values = statInput
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      if (values.length === 0) throw new Error("Invalid value list");

      const stats = {
        mean: math.mean(values),
        median: math.median(values),
        stdDev: math.std(values),
        min: Math.min(...values),
        max: Math.max(...values),
      };
      const unit = statType === "gc" ? "%" : "°C";
      const statsText = `
        Mean: ${Number(stats.mean).toFixed(precision)}${unit}<br>
        Median: ${Number(stats.median).toFixed(precision)}${unit}<br>
        Standard Deviation: ${Number(stats.stdDev).toFixed(precision)}${unit}<br>
        Min: ${Number(stats.min).toFixed(precision)}${unit}<br>
        Max: ${Number(stats.max).toFixed(precision)}${unit}
      `;
      const expression = `Stats(${values.join(", ")}, ${statType})`;

      setResults([]);
      setShowResults(true);
      setResults([{ stats: statsText }]);
      saveToHistory(expression, statsText.replace(/<br>/g, "; "));
      updateBarChart(values, true);
    } catch (e) {
      setErrorMessage("Invalid statistical input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const { calcMethod, precision, forwardPrimer, reversePrimer, saltConc, primerConc, variation } =
        formData;
      if (!forwardPrimer) throw new Error("Forward primer is required");
      if (isNaN(variation) || variation <= 0) throw new Error("Invalid variation percentage");

      const results = [];
      const step = variation / 5;
      for (let v = -variation; v <= variation; v += step) {
        const variedSalt = saltConc * (1 + v / 100);
        if (variedSalt <= 0) continue;
        try {
          const calc = calculateParameters(
            forwardPrimer,
            reversePrimer,
            calcMethod,
            variedSalt,
            primerConc,
            precision
          );
          results.push({ variation: v, value: parseFloat(calc.forward.ta) });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      const resultText = results
        .map(
          (r) =>
            `Salt Variation ${Number(r.variation).toFixed(2)}%: T_a = ${Number(r.value).toFixed(precision)}°C`
        )
        .join("<br>");
      setResults([{ sensitivity: resultText }]);
      setShowResults(true);
      saveToHistory(`Sensitivity (±${variation}% Salt)`, resultText.replace(/<br>/g, "; "));
      updateSensitivityChart(results);
    } catch (e) {
      setErrorMessage("Invalid sensitivity input: " + e.message);
    }
  };

  const updateVisualizations = (results, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (!isBatch && results.length === 1) {
      drawPrimerVisualization(results[0].forward);
    } else {
      const svg = svgRef.current;
      if (svg) {
        svg.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single primer</text>';
      }
    }
    const tas = results.map((r) => parseFloat(r.forward?.ta)).filter((t) => !isNaN(t));
    if (tas.length > 0) {
      updateBarChart(tas, false);
    }
  };

  const drawPrimerVisualization = (primer) => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = "";
    const width = 500;
    const height = 100;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    try {
      const seq = primer.sequence;
      const boxWidth = Math.min(20, (width - 40) / seq.length);
      const xStart = (width - seq.length * boxWidth) / 2;
      const y = 50;

      Array.from(seq).forEach((base, i) => {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", xStart + i * boxWidth);
        rect.setAttribute("y", y - 20);
        rect.setAttribute("width", boxWidth);
        rect.setAttribute("height", 40);
        rect.setAttribute("fill", base === "G" || base === "C" ? "#10b981" : "#ef4444");
        rect.setAttribute("stroke", "#1e3a8a");
        rect.setAttribute("stroke-width", "1");
        svg.appendChild(rect);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", xStart + i * boxWidth + boxWidth / 2);
        text.setAttribute("y", y + 5);
        text.setAttribute("fill", "#fff");
        text.setAttribute("font-size", "12");
        text.setAttribute("text-anchor", "middle");
        text.textContent = base;
        svg.appendChild(text);
      });

      const labels = [
        { text: `T_a: ${primer.ta}°C`, x: 10, y: 20 },
        { text: `GC: ${primer.gcContent}%`, x: 100, y: 20 },
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
    } catch (e) {
      console.error("Visualization error:", e);
      svg.innerHTML = '<text x="10" y="50" fill="#000" font-size="14">Error rendering visualization</text>';
    }
  };

  const updateBarChart = (values, isStats = false) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    const ctx = barChartRef.current.getContext("2d");
    const labels = isStats
      ? values.map((_, i) => `Value ${i + 1}`)
      : results.map((_, i) => `Primer ${i + 1}`);
    barChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: isStats ? "Value" : "T_a (°C)",
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
          y: { beginAtZero: false, title: { display: true, text: isStats ? "Value" : "T_a (°C)" } },
          x: { title: { display: true, text: isStats ? "Values" : "Primers" } },
        },
        plugins: { title: { display: true, text: isStats ? "Value Analysis" : "T_a Comparison" } },
      },
    });
  };

  const updateSensitivityChart = (results) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    const ctx = barChartRef.current.getContext("2d");
    barChartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: results.map((r) => `${Number(r.variation).toFixed(2)}%`),
        datasets: [
          {
            label: "T_a (°C)",
            data: results.map((r) => r.value),
            borderColor: "#3b82f6",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: false, title: { display: true, text: "T_a (°C)" } },
          x: { title: { display: true, text: "Salt Variation (%)" } },
        },
        plugins: { title: { display: true, text: "Sensitivity Analysis" } },
      },
    });
  };

  const clearInputs = () => {
    setFormData({
      calcMethod: "basic",
      precision: 2,
      forwardPrimer: "",
      reversePrimer: "",
      saltConc: "",
      primerConc: "",
      batchText: "",
      statInput: "",
      statType: "ta",
      variation: "",
    });
    setBatchFile(null);
    setErrorMessage("");
    setSuccessMessage("");
    setShowResults(false);
    if (svgRef.current) svgRef.current.innerHTML = "";
    if (barChartInstance.current) barChartInstance.current.destroy();
  };

  const saveCalculation = () => {
    setSuccessMessage("Calculation saved to history");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const saveToHistory = (params, result) => {
    const newHistory = [...calculationHistory, { date: new Date().toLocaleString(), params, result }];
    setCalculationHistory(newHistory);
    localStorage.setItem("annealingCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.params}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("calculation_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("calculation_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Calculation History", 10, 10);
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
    doc.save("calculation_history.pdf");
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
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-5xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Advanced Annealing Temperature Calculator</h1>
          </div>
          {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-sm mt-1">{successMessage}</div>}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              {[
                {
                  label: "Calculation Method",
                  name: "calcMethod",
                  type: "select",
                  options: ["basic", "nearest"],
                  tooltip: "Select the method for T_m calculation.",
                },
                {
                  label: "Precision",
                  name: "precision",
                  type: "select",
                  options: [2, 4, 6],
                  tooltip: "Decimal places for results.",
                },
              ].map(({ label, name, type, options, tooltip }) => (
                <div key={name} className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {label}
                    {tooltip && (
                      <span className="tooltip ml-1">
                        ?<span className="tooltiptext">{tooltip}</span>
                      </span>
                    )}
                  </label>
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {name === "calcMethod"
                          ? opt === "basic"
                            ? "Basic Rule (4(G+C) + 2(A+T))"
                            : "Nearest Neighbor"
                          : `${opt} Decimals`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Primer Sequences</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                {[
                  {
                    label: "Forward Primer (5' to 3')",
                    name: "forwardPrimer",
                    type: "text",
                    value: formData.forwardPrimer,
                    placeholder: "e.g., ATGGCTAGCT",
                  },
                  {
                    label: "Reverse Primer (5' to 3')",
                    name: "reversePrimer",
                    type: "text",
                    value: formData.reversePrimer,
                    placeholder: "e.g., TAGCTAGCTA",
                  },
                ].map(({ label, name, type, value, placeholder }) => (
                  <div key={name} className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={value}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">PCR Conditions</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                {[
                  {
                    label: "Salt Concentration (mM)",
                    name: "saltConc",
                    type: "number",
                    value: formData.saltConc,
                    placeholder: "e.g., 50",
                    tooltip: "Total monovalent cation concentration (e.g., Na⁺, K⁺).",
                  },
                  {
                    label: "Primer Concentration (nM)",
                    name: "primerConc",
                    type: "number",
                    value: formData.primerConc,
                    placeholder: "e.g., 200",
                    tooltip: "Concentration of each primer.",
                  },
                ].map(({ label, name, type, value, placeholder, tooltip }) => (
                  <div key={name} className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {label}
                      {tooltip && (
                        <span className="tooltip ml-1">
                          ?<span className="tooltiptext">{tooltip}</span>
                        </span>
                      )}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={value}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV: forward,reverse,salt,primer_conc)
                <span className="tooltip ml-1">
                  ?
                  <span className="tooltiptext">
                    Upload CSV or enter primer pairs (e.g., ATGGCT,AGCTTA,50,200).
                  </span>
                </span>
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="p-3 border rounded-lg bg-white text-gray-900 w-full mb-2"
              />
              <textarea
                name="batchText"
                value={formData.batchText}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg bg-white text-gray-900"
                rows="4"
                placeholder="e.g., ATGGCT,AGCTTA,50,200"
              ></textarea>
            </div>
          </div>
          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              onClick={calculate}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate
            </button>
            <button
              onClick={clearInputs}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Clear
            </button>
            <button
              onClick={saveCalculation}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Save Calculation
            </button>
          </div>
          <div className="mb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Features
            </button>
          </div>
          {showAdvanced && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Analyze Values (comma-separated)
                  <span className="tooltip ml-1">
                    ?<span className="tooltiptext">Enter values (e.g., T_a, GC%) for analysis.</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="statInput"
                  value={formData.statInput}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  placeholder="e.g., 55,60,58"
                />
                <select
                  name="statType"
                  value={formData.statType}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 mt-2"
                >
                  <option value="ta">Annealing Temperature (T_a)</option>
                  <option value="gc">GC Content (%)</option>
                  <option value="tm">Melting Temperature (T_m)</option>
                </select>
                <button
                  onClick={calculateStats}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-2"
                >
                  Calculate Statistics
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Salt Variation Range (±%)
                  <span className="tooltip ml-1">
                    ?<span className="tooltiptext">Percentage variation for salt concentration.</span>
                  </span>
                </label>
                <input
                  type="number"
                  name="variation"
                  value={formData.variation}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  placeholder="e.g., 10"
                />
                <button
                  onClick={calculateSensitivity}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-2"
                >
                  Analyze Sensitivity
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mb-4"
          >
            Learn About Annealing Temperature
          </button>
          {showResults && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    results[0]?.stats ||
                    results[0]?.sensitivity ||
                    results
                      .map((r) => {
                        if (isBatch) return "";
                        const rText = `
                  <strong>Results (${formData.calcMethod}):</strong><br>
                  <strong>Forward Primer:</strong><br>
                  Sequence: ${r.forward.sequence}<br>
                  T_m: ${r.forward.tm}°C<br>
                  T_a: ${r.forward.ta}°C<br>
                  GC Content: ${r.forward.gcContent}%<br>
                  Length: ${r.forward.length} bases<br>
                  Molecular Weight: ${r.forward.molWeight} g/mol<br>
                  Extinction Coefficient: ${r.forward.extCoeff} M⁻¹cm⁻¹<br>
                  Complement: ${r.forward.complement}<br>
                  Reverse Complement: ${r.forward.revComplement}<br>
                  ${
                    r.reverse
                      ? `
                    <br><strong>Reverse Primer:</strong><br>
                    Sequence: ${r.reverse.sequence}<br>
                    T_m: ${r.reverse.tm}°C<br>
                    T_a: ${r.reverse.ta}°C<br>
                    GC Content: ${r.reverse.gcContent}%<br>
                    Length: ${r.reverse.length} bases<br>
                    Molecular Weight: ${r.reverse.molWeight} g/mol<br>
                    Extinction Coefficient: ${r.reverse.extCoeff} M⁻¹cm⁻¹<br>
                    Complement: ${r.reverse.complement}<br>
                    Reverse Complement: ${r.reverse.revComplement}<br>
                    <br><strong>Primer Pair:</strong><br>
                    Average T_a: ${r.pair.ta}°C<br>
                    T_a Range: ${r.pair.taRange}°C<br>
                    T_a Difference: ${r.pair.taDiff}°C<br>
                    Compatibility: ${r.pair.compatibility}<br>
                  `
                      : ""
                  }
                `;
                        return rText;
                      })
                      .join("") ||
                    "",
                }}
                className="text-gray-600 mb-4"
              />
              {isBatch && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: results
                      .map((r) => {
                        const forwardText = `Seq: ${r.forward.sequence}, T_a: ${r.forward.ta}°C, GC: ${r.forward.gcContent}%`;
                        const reverseText = r.reverse
                          ? `Seq: ${r.reverse.sequence}, T_a: ${r.reverse.ta}°C, GC: ${r.reverse.gcContent}%`
                          : "N/A";
                        const pairText = r.pair
                          ? `Pair T_a: ${r.pair.ta}°C (${r.pair.taRange}°C), Compatibility: ${r.pair.compatibility}`
                          : "";
                        return `<tr><td class="p-2">${forwardText}</td><td class="p-2">${reverseText}</td><td class="p-2">${pairText}</td></tr>`;
                      })
                      .join(""),
                  }}
                />
              )}
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Primer Visualization</h3>
                <svg ref={svgRef} className="w-full max-w-[500px] h-[100px] block mx-auto"></svg>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Values Comparison</h3>
                <canvas ref={barChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6 history-table">
                <h3 className="text-md font-medium text-gray-900">Calculation History</h3>
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
              <div className="flex gap-4 mt-4 flex-wrap">
                <button
                  onClick={exportCSV}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Export CSV
                </button>
                <button
                  onClick={exportJSON}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Export JSON
                </button>
                <button
                  onClick={exportPDF}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Export PDF
                </button>
              </div>
            </div>
          )}
          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-100 p-6 rounded-lg max-w-lg w-full">
                <span className="close text-2xl cursor-pointer" onClick={() => setShowModal(false)}>
                  ×
                </span>
                <h2 className="text-xl font-semibold mb-4">Understanding Annealing Temperature</h2>
                <p className="mb-4">
                  The annealing temperature (T_a) is critical in PCR for primer binding to the template DNA.
                  It is typically derived from the melting temperature (T_m) of primers.
                </p>
                <h3 className="text-md font-medium mb-2">Key Formulas</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Basic Rule:</strong> T_m = 4(G+C) + 2(A+T) (°C).
                  </li>
                  <li>
                    <strong>Nearest Neighbor:</strong> T_m = (ΔH / (ΔS + R ln([Na⁺]))) - 273.15 + 16.6
                    log₁₀([Na⁺]), where ΔH and ΔS are thermodynamic parameters.
                  </li>
                  <li>
                    <strong>Annealing Temperature:</strong> T_a = T_m - offset (typically 5°C below T_m).
                  </li>
                  <li>
                    <strong>GC Content:</strong> GC% = (G+C) / Length × 100.
                  </li>
                  <li>
                    <strong>Molecular Weight:</strong> Sum of nucleotide weights (e.g., A=313.21 g/mol).
                  </li>
                  <li>
                    <strong>Extinction Coefficient:</strong> Sum of nucleotide coefficients (e.g., A=15400
                    M⁻¹cm⁻¹).
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>PCR Optimization:</strong> Ensure specific primer binding.
                  </li>
                  <li>
                    <strong>Primer Design:</strong> Balance T_a for forward and reverse primers.
                  </li>
                  <li>
                    <strong>Molecular Biology:</strong> Amplify DNA for cloning, sequencing.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Use valid DNA sequences (A, T, G, C).</li>
                  <li>Keep primer lengths between 18–30 bases.</li>
                  <li>Adjust salt concentration for accurate T_m.</li>
                  <li>Use batch input for multiple primer pairs.</li>
                  <li>Visualize GC/AT distribution with the SVG diagram.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Resources</h3>
                <p className="mb-4">For more information, visit:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <a
                      href="https://www.thermofisher.com"
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      Thermo Fisher: PCR Basics
                    </a>
                  </li>
                  <li>
                    <a href="https://www.neb.com" target="_blank" className="text-blue-500 hover:underline">
                      NEB: Primer Design
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <style jsx>{`
            .tooltip {
              position: relative;
              display: inline-block;
              cursor: pointer;
            }
            .tooltip .tooltiptext {
              visibility: hidden;
              width: 200px;
              background-color: #555;
              color: #fff;
              text-align: center;
              border-radius: 6px;
              padding: 5px;
              position: absolute;
              z-index: 1;
              bottom: 125%;
              left: 50%;
              margin-left: -100px;
              opacity: 0;
              transition: opacity 0.3s;
            }
            .tooltip:hover .tooltiptext {
              visibility: visible;
              opacity: 1;
            }
            .animate-slide-in {
              animation: slideIn 0.5s ease-out;
            }
            @keyframes slideIn {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            .history-table {
              overflow-x: auto;
              max-height: 200px;
              overflow-y: auto;
            }
            .close {
              position: absolute;
              top: 10px;
              right: 15px;
              font-size: 20px;
              cursor: pointer;
            }
            @media (max-width: 640px) {
              .flex-wrap > div {
                min-width: 100%;
              }
              button {
                width: 100%;
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
