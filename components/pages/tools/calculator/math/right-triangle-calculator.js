"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [inputMode, setInputMode] = useState("two-sides");
  const [lengthUnit, setLengthUnit] = useState("meters");
  const [angleUnit, setAngleUnit] = useState("degrees");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [angleA, setAngleA] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [batchText, setBatchText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const triangleChartRef = useRef(null);
  const triangleChartInstance = useRef(null);
  const lastResults = useRef([]);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("triangleCalcHistory");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(
            parsed.filter(
              (entry) =>
                entry &&
                typeof entry.date === "string" &&
                typeof entry.inputMode === "string" &&
                typeof entry.params === "string" &&
                typeof entry.result === "string"
            )
          );
        }
      }
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
      if (triangleChartInstance.current) triangleChartInstance.current.destroy();
    };
  }, []);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const showError = (message) => {
    clearMessages();
    setErrorMessage(String(message || "An unexpected error occurred"));
  };

  const showSuccess = (message) => {
    clearMessages();
    setSuccessMessage(String(message || "Operation completed successfully"));
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const lengthConversionFactors = {
    meters: 1,
    centimeters: 0.01,
    feet: 0.3048,
    inches: 0.0254,
  };

  const convertAngle = (value, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return value;
    if (fromUnit === "degrees" && toUnit === "radians") return (value * Math.PI) / 180;
    if (fromUnit === "radians" && toUnit === "degrees") return (value * 180) / Math.PI;
    return value;
  };

  const calculateTriangle = (inputMode, params, lengthUnit, angleUnit) => {
    let a, b, c, angleA, angleB, area, perimeter, sinA, cosA, tanA, sinB, cosB, tanB, height, medianC;
    const formulas = [];

    // Convert inputs to base units (meters, radians)
    if (inputMode === "two-sides") {
      a = params.a * lengthConversionFactors[lengthUnit];
      b = params.b * lengthConversionFactors[lengthUnit];
      if (isNaN(a) || a <= 0 || isNaN(b) || b <= 0) throw new Error("Legs must be positive");
      c = Math.sqrt(a ** 2 + b ** 2);
      angleA = Math.atan(a / b);
      angleB = Math.PI / 2 - angleA;
      formulas.push(`c = √(${a}^2 + ${b}^2) = ${c.toFixed(3)} m`);
      formulas.push(`∠A = arctan(${a}/${b}) = ${((angleA * 180) / Math.PI).toFixed(3)}°`);
    } else if (inputMode === "side-angle") {
      a = params.a * lengthConversionFactors[lengthUnit];
      angleA = convertAngle(params.angleA, angleUnit, "radians");
      if (isNaN(a) || a <= 0) throw new Error("Leg must be positive");
      if (isNaN(angleA) || angleA <= 0 || angleA >= Math.PI / 2)
        throw new Error("Angle must be between 0 and 90° (or π/2 radians)");
      b = a / Math.tan(angleA);
      c = a / Math.sin(angleA);
      angleB = Math.PI / 2 - angleA;
      formulas.push(`b = ${a}/tan(${params.angleA}) = ${b.toFixed(3)} m`);
      formulas.push(`c = ${a}/sin(${params.angleA}) = ${c.toFixed(3)} m`);
    } else if (inputMode === "hypotenuse-angle") {
      c = params.c * lengthConversionFactors[lengthUnit];
      angleA = convertAngle(params.angleA, angleUnit, "radians");
      if (isNaN(c) || c <= 0) throw new Error("Hypotenuse must be positive");
      if (isNaN(angleA) || angleA <= 0 || angleA >= Math.PI / 2)
        throw new Error("Angle must be between 0 and 90° (or π/2 radians)");
      a = c * Math.sin(angleA);
      b = c * Math.cos(angleA);
      angleB = Math.PI / 2 - angleA;
      formulas.push(`a = ${c}*sin(${params.angleA}) = ${a.toFixed(3)} m`);
      formulas.push(`b = ${c}*cos(${params.angleA}) = ${b.toFixed(3)} m`);
    } else {
      throw new Error("Invalid input mode");
    }

    // Calculate additional properties
    area = (a * b) / 2;
    perimeter = a + b + c;
    sinA = a / c;
    cosA = b / c;
    tanA = a / b;
    sinB = b / c;
    cosB = a / c;
    tanB = b / a;
    height = (a * b) / c;
    medianC = c / 2;

    formulas.push(`Area = (1/2)*${a}*${b} = ${area.toFixed(3)} m²`);
    formulas.push(`Perimeter = ${a} + ${b} + ${c} = ${perimeter.toFixed(3)} m`);
    formulas.push(`sin(A) = ${a}/${c} = ${sinA.toFixed(3)}`);
    formulas.push(`cos(A) = ${b}/${c} = ${cosA.toFixed(3)}`);
    formulas.push(`tan(A) = ${a}/${b} = ${tanA.toFixed(3)}`);
    formulas.push(`sin(B) = ${b}/${c} = ${sinB.toFixed(3)}`);
    formulas.push(`cos(B) = ${a}/${c} = ${cosB.toFixed(3)}`);
    formulas.push(`tan(B) = ${b}/${a} = ${tanB.toFixed(3)}`);
    formulas.push(`Height to c = (${a}*${b})/${c} = ${height.toFixed(3)} m`);
    formulas.push(`Median to c = ${c}/2 = ${medianC.toFixed(3)} m`);

    // Convert outputs to selected units
    a /= lengthConversionFactors[lengthUnit];
    b /= lengthConversionFactors[lengthUnit];
    c /= lengthConversionFactors[lengthUnit];
    area /= lengthConversionFactors[lengthUnit] ** 2;
    perimeter /= lengthConversionFactors[lengthUnit];
    height /= lengthConversionFactors[lengthUnit];
    medianC /= lengthConversionFactors[lengthUnit];
    angleA = convertAngle(angleA, "radians", angleUnit);
    angleB = convertAngle(angleB, "radians", angleUnit);

    return {
      a,
      b,
      c,
      angleA,
      angleB,
      area,
      perimeter,
      sinA,
      cosA,
      tanA,
      sinB,
      cosB,
      tanB,
      height,
      medianC,
      formulas,
      params,
    };
  };

  const getInputParams = () => {
    const params = {};
    if (inputMode === "two-sides") {
      params.a = parseFloat(a);
      params.b = parseFloat(b);
    } else if (inputMode === "side-angle") {
      params.a = parseFloat(a);
      params.angleA = parseFloat(angleA);
    } else if (inputMode === "hypotenuse-angle") {
      params.c = parseFloat(c);
      params.angleA = parseFloat(angleA);
    }
    return params;
  };

  const calculate = async () => {
    clearMessages();
    try {
      const isBatch = batchFile || batchText.trim();
      let calcResults = [];

      if (!isBatch) {
        const params = getInputParams();
        if (Object.values(params).some((v) => isNaN(v) || v === ""))
          throw new Error("All parameters are required");
        const result = calculateTriangle(inputMode, params, lengthUnit, angleUnit);
        calcResults.push({ inputMode, params, lengthUnit, angleUnit, result });
        displayResults(calcResults, false);
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
                  .filter((line) => line && line.includes(","))
              );
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          datasets = batchText
            .split(";")
            .map((s) => s.trim())
            .filter((s) => s && s.includes(","));
          if (datasets.length === 0) throw new Error("No valid datasets provided in batch text");
        }
        await processBatch(datasets, calcResults);
        if (calcResults.length === 0) throw new Error("No valid datasets found in batch input");
        displayResults(calcResults, true);
      }
      showSuccess("Calculation completed successfully");
    } catch (e) {
      console.error("Calculation error:", e);
      showError(e.message || "Invalid input");
    }
  };

  const processBatch = async (datasets, results) => {
    for (const dataset of datasets) {
      try {
        const params = {};
        const values = dataset.split(",").map((s) => parseFloat(s.trim()));
        if (inputMode === "two-sides") {
          if (values.length < 2) throw new Error("Invalid batch entry: expected a,b");
          params.a = values[0];
          params.b = values[1];
        } else if (inputMode === "side-angle") {
          if (values.length < 2) throw new Error("Invalid batch entry: expected a,angleA");
          params.a = values[0];
          params.angleA = values[1];
        } else if (inputMode === "hypotenuse-angle") {
          if (values.length < 2) throw new Error("Invalid batch entry: expected c,angleA");
          params.c = values[0];
          params.angleA = values[1];
        }
        const result = calculateTriangle(inputMode, params, lengthUnit, angleUnit);
        results.push({ inputMode, params, lengthUnit, angleUnit, result });
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const getParamsString = (inputMode, params) => {
    if (inputMode === "two-sides") return `a=${params.a}, b=${params.b}`;
    if (inputMode === "side-angle") return `a=${params.a}, ∠A=${params.angleA} ${angleUnit}`;
    if (inputMode === "hypotenuse-angle") return `c=${params.c}, ∠A=${params.angleA} ${angleUnit}`;
    return "";
  };

  const displayResults = (results, isBatch) => {
    let output = [];
    if (isBatch) {
      output.push(
        <table key="batch-table" className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Parameters</th>
              <th className="p-2">Sides</th>
              <th className="p-2">Angles</th>
              <th className="p-2">Area</th>
              <th className="p-2">Perimeter</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td className="p-2">{getParamsString(r.inputMode, r.result.params)}</td>
                <td className="p-2">{`a=${r.result.a.toFixed(3)}, b=${r.result.b.toFixed(
                  3
                )}, c=${r.result.c.toFixed(3)} ${lengthUnit}`}</td>
                <td className="p-2">{`A=${r.result.angleA.toFixed(3)}, B=${r.result.angleB.toFixed(
                  3
                )} ${angleUnit}`}</td>
                <td className="p-2">{`${r.result.area.toFixed(3)} ${lengthUnit}²`}</td>
                <td className="p-2">{`${r.result.perimeter.toFixed(3)} ${lengthUnit}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      const r = results[0];
      output.push(
        <div key="single-result">
          <strong>
            Right Triangle (Input Mode: {r.inputMode.replace("-", " ")}, Length Unit: {lengthUnit}, Angle
            Unit: {angleUnit}):
          </strong>
          <br />
          Parameters: {getParamsString(r.inputMode, r.result.params)}
          <br />
          Sides: a={r.result.a.toFixed(3)}, b={r.result.b.toFixed(3)}, c={r.result.c.toFixed(3)} {lengthUnit}
          <br />
          Angles: A={r.result.angleA.toFixed(3)}, B={r.result.angleB.toFixed(3)} {angleUnit}
          <br />
          Area: {r.result.area.toFixed(3)} {lengthUnit}²<br />
          Perimeter: {r.result.perimeter.toFixed(3)} {lengthUnit}
          <br />
          Trigonometric Ratios:
          <br />
          &nbsp;&nbsp;sin(A)={r.result.sinA.toFixed(3)}, cos(A)={r.result.cosA.toFixed(3)}, tan(A)=
          {r.result.tanA.toFixed(3)}
          <br />
          &nbsp;&nbsp;sin(B)={r.result.sinB.toFixed(3)}, cos(B)={r.result.cosB.toFixed(3)}, tan(B)=
          {r.result.tanB.toFixed(3)}
          <br />
          Height to Hypotenuse: {r.result.height.toFixed(3)} {lengthUnit}
          <br />
          Median to Hypotenuse: {r.result.medianC.toFixed(3)} {lengthUnit}
          <br />
          Formulas:
          <br />
          {r.result.formulas.map((f, i) => (
            <div key={i}>&nbsp;&nbsp;{f}</div>
          ))}
        </div>
      );
    }

    setResults(output);
    setShowResults(true);
    updateVisualization(results);

    const paramsStr = isBatch
      ? `Batch: ${results.length} triangles`
      : getParamsString(results[0].inputMode, results[0].result.params);
    saveToHistory(
      results[0].inputMode,
      paramsStr,
      output
        .map((o) => (typeof o === "string" ? o : o.props.children))
        .join("; ")
        .substring(0, 100) + "..."
    );
    lastResults.current = results;
  };

  const updateVisualization = (results) => {
    if (triangleChartInstance.current) triangleChartInstance.current.destroy();
    if (triangleChartRef.current && results.length > 0) {
      const r = results[0].result;
      triangleChartInstance.current = new window.Chart(triangleChartRef.current, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Triangle",
              data: [
                { x: 0, y: 0 }, // Vertex C (right angle)
                { x: r.b, y: 0 }, // Vertex B
                { x: 0, y: r.a }, // Vertex A
              ],
              borderColor: "#ef4444", // Primary color
              borderWidth: 2,
              pointRadius: 5,
              showLine: true,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: { display: true, text: `X (${results[0].lengthUnit})` },
              min: -r.b * 0.1,
              max: r.b * 1.1,
            },
            y: {
              title: { display: true, text: `Y (${results[0].lengthUnit})` },
              min: -r.a * 0.1,
              max: r.a * 1.1,
            },
          },
          plugins: {
            title: { display: true, text: "Right Triangle Diagram" },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const point = context.raw;
                  if (point.x === 0 && point.y === 0) return "C (0,0)";
                  if (point.x === r.b && point.y === 0) return `B (${r.b.toFixed(1)},0)`;
                  return `A (0,${r.a.toFixed(1)})`;
                },
              },
            },
          },
        },
      });
    }
  };

  const clearInputs = () => {
    clearMessages();
    setA("");
    setB("");
    setC("");
    setAngleA("");
    setBatchFile(null);
    setBatchText("");
    setShowResults(false);
    setResults([]);
    if (triangleChartInstance.current) triangleChartInstance.current.destroy();
    showSuccess("Inputs cleared!");
  };

  const saveToHistory = (inputMode, params, result) => {
    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        inputMode: String(inputMode || ""),
        params: String(params || ""),
        result: String(result || ""),
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("triangleCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Input Mode", "Parameters", "Result"];
    const rows = history.map((entry) => [
      `"${entry.date}"`,
      `"${entry.inputMode}"`,
      `"${entry.params}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "triangle_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "triangle_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Right Triangle Calculation History", 10, 10);
    let y = 20;
    history.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Input Mode: ${entry.inputMode.replace("-", " ")}`, 10, y + 10);
      doc.text(`Parameters: ${entry.params}`, 10, y + 20);
      doc.text(`Result: ${entry.result}`, 10, y + 30);
      y += 50;
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("triangle_history.pdf");
  };

  const renderInputFields = () => {
    if (inputMode === "two-sides") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Leg a<span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                Length of one leg.
              </span>
            </label>
            <input
              type="number"
              step="any"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 3"
              value={a}
              onChange={(e) => setA(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Leg b<span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                Length of the other leg.
              </span>
            </label>
            <input
              type="number"
              step="any"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 4"
              value={b}
              onChange={(e) => setB(e.target.value)}
            />
          </div>
        </>
      );
    } else if (inputMode === "side-angle") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Leg a<span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                Length of one leg.
              </span>
            </label>
            <input
              type="number"
              step="any"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 3"
              value={a}
              onChange={(e) => setA(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Angle A (opposite leg a)
              <span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                Angle opposite leg a.
              </span>
            </label>
            <input
              type="number"
              step="any"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 30"
              value={angleA}
              onChange={(e) => setAngleA(e.target.value)}
            />
          </div>
        </>
      );
    } else if (inputMode === "hypotenuse-angle") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Hypotenuse c<span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                Length of the hypotenuse.
              </span>
            </label>
            <input
              type="number"
              step="any"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 5"
              value={c}
              onChange={(e) => setC(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Angle A<span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                One acute angle.
              </span>
            </label>
            <input
              type="number"
              step="any"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 30"
              value={angleA}
              onChange={(e) => setAngleA(e.target.value)}
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-6xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">
            Advanced Right Triangle Calculator
          </h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Input Mode
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select how to specify the triangle.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={inputMode}
                  onChange={(e) => setInputMode(e.target.value)}
                >
                  <option value="two-sides">Two Sides</option>
                  <option value="side-angle">Side and Angle</option>
                  <option value="hypotenuse-angle">Hypotenuse and Angle</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Length Unit
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Unit for side lengths.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={lengthUnit}
                  onChange={(e) => setLengthUnit(e.target.value)}
                >
                  <option value="meters">Meters</option>
                  <option value="centimeters">Centimeters</option>
                  <option value="feet">Feet</option>
                  <option value="inches">Inches</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Angle Unit
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Unit for angles.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={angleUnit}
                  onChange={(e) => setAngleUnit(e.target.value)}
                >
                  <option value="degrees">Degrees</option>
                  <option value="radians">Radians</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Parameters</h3>
              <div className="flex flex-wrap gap-4">{renderInputFields()}</div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: e.g., a,b for Two Sides; a,angleA for Side and Angle; c,angleA for
                Hypotenuse and Angle)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter parameter sets (e.g., 3,4;5,30).
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
                placeholder="e.g., 3,4;5,30"
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
          {showResults && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div className="text-gray-600 mb-4">{results}</div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Triangle Visualization</h3>
                <canvas ref={triangleChartRef} className="max-w-[600px] h-[300px] mx-auto" />
              </div>
              <div className="mt-6 max-h-52 overflow-y-auto">
                <h3 className="text-md font-medium text-gray-700">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Input Mode</th>
                      <th className="p-2">Parameters</th>
                      <th className="p-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-2 text-center">
                          No history available
                        </td>
                      </tr>
                    ) : (
                      history.map((entry, i) => (
                        <tr key={i}>
                          <td className="p-2">{entry.date}</td>
                          <td className="p-2">{entry.inputMode.replace("-", " ")}</td>
                          <td className="p-2">{entry.params}</td>
                          <td className="p-2">{entry.result}</td>
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
