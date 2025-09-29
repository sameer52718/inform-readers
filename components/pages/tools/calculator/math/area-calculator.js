"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [shape, setShape] = useState("rectangle");
  const [unit, setUnit] = useState("meters");
  const [calcType, setCalcType] = useState("all");
  const [precision, setPrecision] = useState("2");
  const [angleUnit, setAngleUnit] = useState("degrees");
  const [triangleMethod, setTriangleMethod] = useState("base-height");
  const [inputs, setInputs] = useState({});
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [statInput, setStatInput] = useState("");
  const [variation, setVariation] = useState("");
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const shapeCanvasRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    // Initialize history from localStorage
    setHistory(JSON.parse(localStorage.getItem("areaCalcHistory")) || []);

    // Load external scripts dynamically
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
      loadScript("https://cdn.jsdelivr.net/npm/chart.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
    ]).catch((err) => console.error("Failed to load scripts:", err));

    // Cleanup Chart.js instances on unmount
    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (pieChartInstance.current) pieChartInstance.current.destroy();
    };
  }, []);

  // Parse input (decimal, fraction, scientific)
  const parseInput = (input) => {
    try {
      if (!input.trim()) throw new Error("Input cannot be empty");
      if (input.includes("/")) {
        const [num, denom] = input.split("/").map((n) => parseFloat(n.trim()));
        if (denom === 0) throw new Error("Division by zero");
        return num / denom;
      }
      const value = window.math.evaluate(input);
      if (isNaN(value) || !isFinite(value)) throw new Error("Invalid numerical value");
      return value;
    } catch (e) {
      throw new Error("Invalid input format: " + e.message);
    }
  };

  // Convert units
  const toMeters = (value, unit) => {
    switch (unit) {
      case "centimeters":
        return value / 100;
      case "inches":
        return value * 0.0254;
      case "feet":
        return value * 0.3048;
      default:
        return value; // meters
    }
  };

  const fromMeters = (value, unit) => {
    if (value === null || value === undefined || isNaN(value)) return null;
    switch (unit) {
      case "centimeters":
        return value * 100;
      case "inches":
        return value / 0.0254;
      case "feet":
        return value / 0.3048;
      default:
        return value;
    }
  };

  // Shape parameter inputs
  const paramInputs = {
    rectangle: { length: "rectangle-length", width: "rectangle-width" },
    triangle: {
      "base-height": { base: "triangle-base", height: "triangle-height" },
      "sides-angle": { sideA: "triangle-side-a", sideB: "triangle-side-b", angleC: "triangle-angle" },
      "three-sides": { sideA: "triangle-side1", sideB: "triangle-side2", sideC: "triangle-side3" },
    },
    trapezoid: { base1: "trapezoid-base1", base2: "trapezoid-base2", height: "trapezoid-height" },
    circle: { radius: "circle-radius" },
    sector: { radius: "sector-radius", angle: "sector-angle" },
    ellipse: { semiMajor: "ellipse-a", semiMinor: "ellipse-b" },
    parallelogram: { base: "parallelogram-base", height: "parallelogram-height" },
  };

  // Calculate area and properties
  const calculateParameters = (shape, params, unit, angleUnit, precision) => {
    let area = null,
      perimeter = null,
      properties = {};
    params = params.map((p) => parseInput(p));
    if (params.some((p) => p <= 0)) throw new Error("Parameters must be positive");

    // Convert to meters for calculations
    params = params.map((p) => toMeters(p, unit));
    let angle = params.find((_, i) =>
      ["sector-angle", "triangle-angle"].includes(Object.keys(paramInputs[shape])[i])
    );
    if (angle && angleUnit === "degrees") {
      angle = (angle * Math.PI) / 180;
    }

    try {
      if (shape === "rectangle") {
        const [length, width] = params;
        area = length * width;
        perimeter = 2 * (length + width);
        properties.shapeType = length === width ? "Square" : "Rectangle";
      } else if (shape === "triangle") {
        if (triangleMethod === "base-height") {
          const [base, height] = params;
          area = 0.5 * base * height;
          perimeter = "Requires side lengths";
          properties.note = "Perimeter requires side lengths";
        } else if (triangleMethod === "sides-angle") {
          const [a, b, angleC] = params;
          if (angleC <= 0 || angleC >= Math.PI) throw new Error("Angle must be between 0 and 180 degrees");
          area = 0.5 * a * b * Math.sin(angleC);
          if (isNaN(area) || !isFinite(area)) throw new Error("Invalid area calculation");
          perimeter = "Requires third side";
          properties.note = "Perimeter requires third side";
        } else {
          const [a, b, c] = params;
          if (a + b <= c || b + c <= a || a + c <= b) throw new Error("Invalid triangle sides");
          const s = (a + b + c) / 2;
          const areaCalc = Math.sqrt(s * (s - a) * (s - b) * (s - c));
          if (isNaN(areaCalc) || !isFinite(areaCalc)) throw new Error("Invalid area calculation");
          area = areaCalc;
          perimeter = a + b + c;
          properties.type =
            a === b && b === c ? "Equilateral" : a === b || b === c || a === c ? "Isosceles" : "Scalene";
        }
      } else if (shape === "trapezoid") {
        const [base1, base2, height] = params;
        area = ((base1 + base2) / 2) * height;
        perimeter = "Requires leg lengths";
        properties.note = "Perimeter requires leg lengths";
      } else if (shape === "circle") {
        const [radius] = params;
        area = Math.PI * radius * radius;
        perimeter = 2 * Math.PI * radius;
        properties.diameter = 2 * radius;
      } else if (shape === "sector") {
        const [radius, angle] = params;
        if (
          angle <= 0 ||
          (angleUnit === "degrees" && angle > 360) ||
          (angleUnit === "radians" && angle > 2 * Math.PI)
        ) {
          throw new Error("Invalid sector angle");
        }
        area =
          angleUnit === "degrees" ? (angle / 360) * Math.PI * radius * radius : 0.5 * angle * radius * radius;
        properties.arcLength =
          angleUnit === "degrees" ? (angle / 360) * 2 * Math.PI * radius : angle * radius;
      } else if (shape === "ellipse") {
        const [a, b] = params;
        if (a < b) throw new Error("Semi-major axis must be greater than or equal to semi-minor axis");
        area = Math.PI * a * b;
        perimeter = "Approximate (requires complex formula)";
        properties.eccentricity = a === b ? 0 : Math.sqrt(1 - (b * b) / (a * a));
      } else if (shape === "parallelogram") {
        const [base, height] = params;
        area = base * height;
        perimeter = "Requires side lengths";
        properties.note = "Perimeter requires side lengths";
      }

      // Convert back to input unit
      area = fromMeters(area, unit);
      area = area !== null ? (area ** 2).toFixed(precision) : "N/A";
      perimeter = typeof perimeter === "number" ? fromMeters(perimeter, unit) : perimeter;
      properties = Object.fromEntries(
        Object.entries(properties).map(([k, v]) => [
          k,
          typeof v === "number" ? (fromMeters(v, unit) || 0).toFixed(precision) : v,
        ])
      );

      return {
        shape,
        area,
        perimeter: typeof perimeter === "number" ? perimeter.toFixed(precision) : perimeter,
        properties,
        unit: `${unit}^2`,
        params: params.map((p) => fromMeters(p, unit) || 0),
        paramNames: Object.keys(paramInputs[shape]),
      };
    } catch (e) {
      throw new Error(`Calculation error for ${shape}: ${e.message}`);
    }
  };

  // Compute calculation
  const computeCalculation = (shape, inputs, unit, angleUnit, calcType, precision) => {
    const params = calculateParameters(shape, inputs, unit, angleUnit, precision);
    params.calcType = calcType;
    return params;
  };

  // Calculate
  const calculate = async () => {
    setErrorMessage("");
    try {
      const prec = parseInt(precision);
      const isBatch = batchFile || batchText;
      let calcResults = [];

      if (!isBatch) {
        let inputValues = [];
        if (shape === "triangle") {
          inputValues = Object.values(paramInputs.triangle[triangleMethod]).map((id) => inputs[id] || "");
        } else {
          inputValues = Object.values(paramInputs[shape]).map((id) => inputs[id] || "");
        }
        if (inputValues.some((v) => !v)) throw new Error("All parameters are required");
        const result = computeCalculation(shape, inputValues, unit, angleUnit, calcType, prec);
        calcResults.push(result);
      } else {
        let calculations = [];
        if (batchFile) {
          const text = await batchFile.text();
          calculations = text
            .split("\n")
            .map((line) => line.split(",").map((s) => s.trim()))
            .filter((c) => c.length > 1);
        } else if (batchText) {
          calculations = batchText.split(";").map((c) => c.split(",").map((s) => s.trim()));
        }
        for (const c of calculations) {
          try {
            const [s, ...params] = c;
            if (!paramInputs[s]) throw new Error("Invalid shape");
            if (params.length !== Object.keys(paramInputs[s]).length)
              throw new Error("Incorrect number of parameters");
            const result = computeCalculation(s, params, unit, angleUnit, calcType, prec);
            calcResults.push(result);
          } catch (e) {
            console.warn(`Skipping invalid batch entry: ${e.message}`);
          }
        }
        if (calcResults.length === 0) throw new Error("No valid calculations in batch input");
      }

      setResults(calcResults);
      displayResults(calcResults, calcType, prec, isBatch);
    } catch (e) {
      setErrorMessage(e.message || "Invalid input");
    }
  };

  // Display results
  const displayResults = (results, calcType, precision, isBatch) => {
    const params = isBatch
      ? `Batch: ${results.length} calculations, Type: ${calcType}`
      : `${results[0].shape}: ${results[0].paramNames
          .map(
            (name, i) => `${name}=${results[0].params[i] ? results[0].params[i].toFixed(precision) : "N/A"}`
          )
          .join(", ")}`;
    const resultText = isBatch
      ? results
          .map((r) => {
            const paramText = r.paramNames
              .map((name, i) => `${name}: ${r.params[i] ? r.params[i].toFixed(precision) : "N/A"}`)
              .join(", ");
            const propText = Object.entries(r.properties)
              .map(([k, v]) => (typeof v === "string" ? `${k}: ${v}` : `${k}: ${v.toFixed(precision)}`))
              .join(", ");
            return `Shape: ${r.shape}, Params: ${paramText}, Area: ${r.area} ${r.unit}, Perimeter: ${r.perimeter}, Properties: ${propText}`;
          })
          .join("; ")
      : `Shape: ${results[0].shape}, Area: ${results[0].area} ${results[0].unit}, Perimeter: ${
          results[0].perimeter
        }, Properties: ${Object.entries(results[0].properties)
          .map(([k, v]) => (typeof v === "string" ? `${k}: ${v}` : `${k}: ${v.toFixed(precision)}`))
          .join(", ")}`;
    saveToHistory(params, resultText);
    updateVisualizations(results, calcType, isBatch);
  };

  // Calculate statistics
  const calculateStats = () => {
    setErrorMessage("");
    try {
      const areas = statInput
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      const prec = parseInt(precision);

      if (areas.length === 0) throw new Error("Invalid area list");

      const stats = {
        mean: window.math.mean(areas),
        median: window.math.median(areas),
        stdDev: window.math.std(areas),
        min: Math.min(...areas),
        max: Math.max(...areas),
      };
      const statsText = `
        Mean: ${stats.mean.toFixed(prec)}<br>
        Median: ${stats.median.toFixed(prec)}<br>
        Standard Deviation: ${stats.stdDev.toFixed(prec)}<br>
        Min: ${stats.min.toFixed(prec)}<br>
        Max: ${stats.max.toFixed(prec)}
      `;
      const expression = `Stats(${areas.join(", ")})`;

      setResults([{ operation: "stats", statsText }]);
      saveToHistory(expression, statsText.replace(/<br>/g, "; "));
      updateBarChart(areas, true, unit);
    } catch (e) {
      setErrorMessage("Invalid statistical input: " + e.message);
    }
  };

  // Calculate sensitivity
  const calculateSensitivity = () => {
    setErrorMessage("");
    try {
      const varPercent = parseFloat(variation);
      const prec = parseInt(precision);
      let inputValues = [];
      if (shape === "triangle") {
        inputValues = Object.values(paramInputs.triangle[triangleMethod]).map((id) => inputs[id] || "");
      } else {
        inputValues = Object.values(paramInputs[shape]).map((id) => inputs[id] || "");
      }
      if (inputValues.some((v) => !v)) throw new Error("All parameters required");
      if (isNaN(varPercent) || varPercent <= 0) throw new Error("Invalid variation percentage");

      const params = inputValues.map((p) => parseInput(p));
      const calcResults = [];
      const step = varPercent / 5;

      for (let v = -varPercent; v <= varPercent; v += step) {
        const variedParams = params.map((p) => p * (1 + v / 100));
        try {
          const calc = calculateParameters(shape, variedParams, unit, angleUnit, prec);
          calcResults.push({
            variation: v,
            area: parseFloat(calc.area) || 0,
            perimeter: calc.perimeter,
          });
        } catch (e) {
          console.warn(`Skipping invalid variation: ${e.message}`);
        }
      }

      setResults(calcResults);
      const resultText = calcResults
        .map(
          (r) =>
            `Variation ${r.variation.toFixed(2)}%: Area = ${r.area.toFixed(prec)} ${unit}^2, Perimeter = ${
              typeof r.perimeter === "string" ? r.perimeter : r.perimeter.toFixed(prec)
            }`
        )
        .join("; ");
      saveToHistory(`Sensitivity (±${varPercent}%)`, resultText);
      updateSensitivityChart(calcResults, unit);
    } catch (e) {
      setErrorMessage("Invalid sensitivity input: " + e.message);
    }
  };

  // Update visualizations
  const updateVisualizations = (results, calcType, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();

    // Shape visualization (single calculation)
    if (!isBatch && results.length === 1 && results[0].operation !== "stats") {
      drawShape(results[0]);
    } else {
      const ctx = shapeCanvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillText("Shape visualization available for single calculations", 10, 50);
      }
    }

    // Bar chart (area comparison)
    const areas = results
      .filter((r) => r.operation !== "stats")
      .map((r) => parseFloat(r.area))
      .filter((a) => !isNaN(a));
    if (areas.length > 0) {
      updateBarChart(areas, isBatch, unit);
    }

    // Pie chart (area distribution by shape)
    if (isBatch && results.length > 1 && results[0].operation !== "stats") {
      const shapeCounts = {};
      results.forEach((r) => {
        shapeCounts[r.shape] = (shapeCounts[r.shape] || 0) + 1;
      });

      const ctx = pieChartRef.current?.getContext("2d");
      if (ctx) {
        pieChartInstance.current = new window.Chart(ctx, {
          type: "pie",
          data: {
            labels: Object.keys(shapeCounts),
            datasets: [
              {
                data: Object.values(shapeCounts),
                backgroundColor: [
                  "#ef4444",
                  "#10b981",
                  "#f59e0b",
                  "#3b82f6",
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
              title: { display: true, text: "Area Distribution by Shape" },
            },
          },
        });
      }
    }
  };

  // Draw shape
  const drawShape = (result) => {
    const canvas = shapeCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = 50; // Pixels per unit
    const offsetX = 50,
      offsetY = 50;

    ctx.font = "12px Arial";
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;

    const params = result.params;
    if (result.shape === "rectangle") {
      const [length, width] = params;
      ctx.beginPath();
      ctx.rect(offsetX, offsetY, length * scale, width * scale);
      ctx.stroke();
      ctx.fillText(`Length: ${length.toFixed(2)}`, offsetX + 10, offsetY - 10);
      ctx.fillText(`Width: ${width.toFixed(2)}`, offsetX - 40, offsetY + (width * scale) / 2);
    } else if (result.shape === "triangle") {
      if (triangleMethod === "base-height") {
        const [base, height] = params;
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY + height * scale);
        ctx.lineTo(offsetX + base * scale, offsetY + height * scale);
        ctx.lineTo(offsetX + (base * scale) / 2, offsetY);
        ctx.closePath();
        ctx.stroke();
        ctx.fillText(
          `Base: ${base.toFixed(2)}`,
          offsetX + (base * scale) / 2 - 20,
          offsetY + height * scale + 20
        );
        ctx.fillText(`Height: ${height.toFixed(2)}`, offsetX - 40, offsetY + (height * scale) / 2);
      } else {
        ctx.fillText("Visualization simplified for base-height method", 10, 50);
      }
    } else if (result.shape === "trapezoid") {
      const [base1, base2, height] = params;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + height * scale);
      ctx.lineTo(offsetX + base1 * scale, offsetY + height * scale);
      ctx.lineTo(offsetX + ((base1 - base2) * scale) / 2, offsetY);
      ctx.lineTo(offsetX + ((base1 + base2) * scale) / 2, offsetY);
      ctx.closePath();
      ctx.stroke();
      ctx.fillText(
        `Base1: ${base1.toFixed(2)}`,
        offsetX + (base1 * scale) / 2 - 20,
        offsetY + height * scale + 20
      );
      ctx.fillText(
        `Base2: ${base2.toFixed(2)}`,
        offsetX + ((base1 - base2) * scale) / 2 + (base2 * scale) / 2 - 20,
        offsetY - 10
      );
      ctx.fillText(`Height: ${height.toFixed(2)}`, offsetX - 40, offsetY + (height * scale) / 2);
    } else if (result.shape === "circle") {
      const [radius] = params;
      ctx.beginPath();
      ctx.arc(offsetX + radius * scale, offsetY + radius * scale, radius * scale, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillText(`Radius: ${radius.toFixed(2)}`, offsetX + radius * scale - 20, offsetY);
    } else if (result.shape === "sector") {
      const [radius, angle] = params;
      const rad = angleUnit === "degrees" ? (angle * Math.PI) / 180 : angle;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      ctx.arc(offsetX, offsetY, radius * scale, 0, rad);
      ctx.closePath();
      ctx.stroke();
      ctx.fillText(`Radius: ${radius.toFixed(2)}`, offsetX + (radius * scale) / 2, offsetY + 10);
      ctx.fillText(`Angle: ${angle.toFixed(2)}`, offsetX - 40, offsetY + (radius * scale) / 2);
    } else if (result.shape === "ellipse") {
      const [a, b] = params;
      ctx.beginPath();
      for (let t = 0; t < 2 * Math.PI; t += 0.01) {
        const x = offsetX + a * scale * Math.cos(t);
        const y = offsetY + b * scale * Math.sin(t);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fillText(`a: ${a.toFixed(2)}`, offsetX + a * scale + 10, offsetY);
      ctx.fillText(`b: ${b.toFixed(2)}`, offsetX, offsetY + b * scale + 20);
    } else if (result.shape === "parallelogram") {
      const [base, height] = params;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + height * scale);
      ctx.lineTo(offsetX + base * scale, offsetY + height * scale);
      ctx.lineTo(offsetX + base * scale - (height * scale) / 2, offsetY);
      ctx.lineTo(offsetX - (height * scale) / 2, offsetY);
      ctx.closePath();
      ctx.stroke();
      ctx.fillText(
        `Base: ${base.toFixed(2)}`,
        offsetX + (base * scale) / 2 - 20,
        offsetY + height * scale + 20
      );
      ctx.fillText(`Height: ${height.toFixed(2)}`, offsetX - 40, offsetY + (height * scale) / 2);
    }
  };

  // Update bar chart
  const updateBarChart = (areas, isBatch, unit) => {
    const ctx = barChartRef.current?.getContext("2d");
    if (!ctx) return;
    if (barChartInstance.current) barChartInstance.current.destroy();

    barChartInstance.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: isBatch ? areas.map((_, i) => `Calc ${i + 1}`) : ["Area"],
        datasets: [
          {
            label: `Area (${unit})`,
            data: areas,
            backgroundColor: "#ef4444",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: `Area (${unit})` }, beginAtZero: true },
          x: { title: { display: true, text: isBatch ? "Calculation" : "Result" } },
        },
        plugins: {
          title: { display: true, text: "Area Comparison" },
        },
      },
    });
  };

  // Update sensitivity chart
  const updateSensitivityChart = (results, unit) => {
    const ctx = barChartRef.current?.getContext("2d");
    if (!ctx) return;
    if (barChartInstance.current) barChartInstance.current.destroy();

    barChartInstance.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: results.map((r) => r.variation.toFixed(2) + "%"),
        datasets: [
          {
            label: `Area (${unit}^2)`,
            data: results.map((r) => r.area),
            backgroundColor: "#ef4444",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: `Area (${unit}^2)` }, beginAtZero: true },
          x: { title: { display: true, text: "Variation (%)" } },
        },
        plugins: {
          title: { display: true, text: "Sensitivity Analysis" },
        },
      },
    });
  };

  // Clear inputs
  const clearInputs = () => {
    setShape("rectangle");
    setUnit("meters");
    setCalcType("all");
    setPrecision("2");
    setAngleUnit("degrees");
    setTriangleMethod("base-height");
    setInputs({});
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setVariation("");
    setErrorMessage("");
    setResults([]);
    const ctx = shapeCanvasRef.current?.getContext("2d");
    if (ctx) ctx.clearRect(0, ctx.canvas.width, ctx.canvas.height);
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();
  };

  // Save to history
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
    localStorage.setItem("areaCalcHistory", JSON.stringify(newHistory));
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "area_calc_history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Export JSON
  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "area_calc_history.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Export PDF
  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Advanced Area Calculator History", 10, 10);
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
    doc.save("area_calc_history.pdf");
  };

  // Handle input change
  const handleInputChange = (id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  // Handle Enter key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.target.tagName === "INPUT") {
        calculate();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [calculate]);

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-4">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">Advanced Area Calculator</h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Shape
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Select the shape to calculate.
                    </span>
                  </span>
                </label>
                <select
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="triangle">Triangle</option>
                  <option value="trapezoid">Trapezoid</option>
                  <option value="circle">Circle</option>
                  <option value="sector">Sector</option>
                  <option value="ellipse">Ellipse</option>
                  <option value="parallelogram">Parallelogram</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Unit
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Unit for length inputs.
                    </span>
                  </span>
                </label>
                <select
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="meters">Meters</option>
                  <option value="centimeters">Centimeters</option>
                  <option value="inches">Inches</option>
                  <option value="feet">Feet</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Calculation Type
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Select the type of calculation.
                    </span>
                  </span>
                </label>
                <select
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                >
                  <option value="all">All (Area, Perimeter, Properties)</option>
                  <option value="area">Area Only</option>
                  <option value="perimeter">Perimeter/Circumference</option>
                  <option value="properties">Additional Properties</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Precision
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Decimal places for results.
                    </span>
                  </span>
                </label>
                <select
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value)}
                >
                  <option value="0">0 Decimals</option>
                  <option value="2">2 Decimals</option>
                  <option value="4">4 Decimals</option>
                  <option value="6">6 Decimals</option>
                  <option value="8">8 Decimals</option>
                  <option value="10">10 Decimals</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Angle Unit
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Unit for angle inputs.
                    </span>
                  </span>
                </label>
                <select
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={angleUnit}
                  onChange={(e) => setAngleUnit(e.target.value)}
                >
                  <option value="degrees">Degrees</option>
                  <option value="radians">Radians</option>
                </select>
              </div>
            </div>
            {shape === "triangle" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Method</label>
                <select
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  value={triangleMethod}
                  onChange={(e) => setTriangleMethod(e.target.value)}
                >
                  <option value="base-height">Base and Height</option>
                  <option value="sides-angle">Two Sides and Angle</option>
                  <option value="three-sides">Three Sides</option>
                </select>
              </div>
            )}
            <div className="flex flex-wrap gap-4 mb-4">
              {shape === "rectangle" &&
                ["length", "width"].map((key, i) => (
                  <div key={i} className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder={`e.g., 5 or 1/2`}
                      value={inputs[`rectangle-${key}`] || ""}
                      onChange={(e) => handleInputChange(`rectangle-${key}`, e.target.value)}
                    />
                  </div>
                ))}
              {shape === "triangle" &&
                Object.keys(paramInputs.triangle[triangleMethod]).map((key, i) => (
                  <div key={i} className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder={`e.g., ${i === 2 ? "60" : "5"}`}
                      value={inputs[`triangle-${paramInputs.triangle[triangleMethod][key]}`] || ""}
                      onChange={(e) =>
                        handleInputChange(
                          `triangle-${paramInputs.triangle[triangleMethod][key]}`,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              {shape === "trapezoid" &&
                ["base1", "base2", "height"].map((key, i) => (
                  <div key={i} className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder={`e.g., ${i < 2 ? "6" : "3"}`}
                      value={inputs[`trapezoid-${key}`] || ""}
                      onChange={(e) => handleInputChange(`trapezoid-${key}`, e.target.value)}
                    />
                  </div>
                ))}
              {shape === "circle" && (
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Radius</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 5"
                    value={inputs["circle-radius"] || ""}
                    onChange={(e) => handleInputChange("circle-radius", e.target.value)}
                  />
                </div>
              )}
              {shape === "sector" &&
                ["radius", "angle"].map((key, i) => (
                  <div key={i} className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder={`e.g., ${i === 0 ? "5" : "60"}`}
                      value={inputs[`sector-${key}`] || ""}
                      onChange={(e) => handleInputChange(`sector-${key}`, e.target.value)}
                    />
                  </div>
                ))}
              {shape === "ellipse" &&
                ["semiMajor", "semiMinor"].map((key, i) => (
                  <div key={i} className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {key === "semiMajor" ? "Semi-Major Axis" : "Semi-Minor Axis"}
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder={`e.g., ${i === 0 ? "5" : "3"}`}
                      value={inputs[`ellipse-${key === "semiMajor" ? "a" : "b"}`] || ""}
                      onChange={(e) =>
                        handleInputChange(`ellipse-${key === "semiMajor" ? "a" : "b"}`, e.target.value)
                      }
                    />
                  </div>
                ))}
              {shape === "parallelogram" &&
                ["base", "height"].map((key, i) => (
                  <div key={i} className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                      placeholder={`e.g., ${i === 0 ? "5" : "4"}`}
                      value={inputs[`parallelogram-${key}`] || ""}
                      onChange={(e) => handleInputChange(`parallelogram-${key}`, e.target.value)}
                    />
                  </div>
                ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV: shape,param1,param2,...)
                <span className="relative group cursor-pointer ml-1">
                  ?
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Upload CSV or enter calculations (e.g., rectangle,5,3;circle,4).
                  </span>
                </span>
              </label>
              <input
                type="file"
                accept=".csv"
                className="w-full p-3 border rounded-lg bg-white text-gray-900 mb-2"
                onChange={(e) => setBatchFile(e.target.files[0])}
              />
              <textarea
                className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                rows="4"
                placeholder="e.g., rectangle,5,3;circle,4"
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4 mb-6">
            <button
              className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
              onClick={calculate}
            >
              Calculate
            </button>
            <button
              className="flex-1 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
              onClick={clearInputs}
            >
              Clear
            </button>
          </div>
          <div className="mb-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Features
            </button>
          </div>
          {showAdvanced && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Analyze Areas (comma-separated)
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Enter areas for statistical analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 15,12.57,6"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                  onClick={calculateStats}
                >
                  Calculate Statistics
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Variation Range (±%)
                  <span className="relative group cursor-pointer ml-1">
                    ?
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Percentage variation for sensitivity analysis.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 5"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                  onClick={calculateSensitivity}
                >
                  Analyze Sensitivity
                </button>
              </div>
            </div>
          )}
          {results.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              {results[0]?.operation === "stats" ? (
                <div dangerouslySetInnerHTML={{ __html: results[0].statsText }} />
              ) : results[0]?.variation !== undefined ? (
                <div>
                  {results.map((r, i) => (
                    <p key={i}>
                      Variation {r.variation.toFixed(2)}%: Area = {r.area.toFixed(parseInt(precision))} {unit}
                      ^2, Perimeter ={" "}
                      {typeof r.perimeter === "string"
                        ? r.perimeter
                        : r.perimeter.toFixed(parseInt(precision))}
                    </p>
                  ))}
                </div>
              ) : (
                <>
                  {results.length === 1 ? (
                    <div>
                      <strong>
                        Results ({results[0].shape}, {results[0].unit}):
                      </strong>
                      {(calcType === "all" || calcType === "area") && (
                        <p>
                          Area: {results[0].area} {results[0].unit}
                        </p>
                      )}
                      {(calcType === "all" || calcType === "perimeter") && (
                        <p>Perimeter/Circumference: {results[0].perimeter}</p>
                      )}
                      {(calcType === "all" || calcType === "properties") && (
                        <p>
                          Properties:{" "}
                          {Object.entries(results[0].properties)
                            .map(([k, v]) => (typeof v === "string" ? `${k}: ${v}` : `${k}: ${v}`))
                            .join(", ")}
                        </p>
                      )}
                      <p>
                        <strong>Parameters:</strong>{" "}
                        {results[0].paramNames
                          .map(
                            (name, i) =>
                              `${name}: ${
                                results[0].params[i]
                                  ? results[0].params[i].toFixed(parseInt(precision))
                                  : "N/A"
                              }`
                          )
                          .join(", ")}
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-sm text-gray-600">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2">Shape</th>
                          <th className="p-2">Parameters</th>
                          <th className="p-2">Area</th>
                          <th className="p-2">Perimeter</th>
                          <th className="p-2">Properties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r, i) => (
                          <tr key={i}>
                            <td className="p-2">{r.shape}</td>
                            <td className="p-2">
                              {r.paramNames
                                .map(
                                  (name, j) =>
                                    `${name}: ${
                                      r.params[j] ? r.params[j].toFixed(parseInt(precision)) : "N/A"
                                    }`
                                )
                                .join(", ")}
                            </td>
                            <td className="p-2">
                              {r.area} {r.unit}
                            </td>
                            <td className="p-2">{r.perimeter}</td>
                            <td className="p-2">
                              {Object.entries(r.properties)
                                .map(([k, v]) => (typeof v === "string" ? `${k}: ${v}` : `${k}: ${v}`))
                                .join(", ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {results.length > 1 && (
                    <div className="mt-4">
                      <strong>Statistics (Areas):</strong>
                      {(() => {
                        const areas = results.map((r) => parseFloat(r.area)).filter((a) => !isNaN(a));
                        if (areas.length === 0) return null;
                        const stats = {
                          mean: window.math.mean(areas),
                          median: window.math.median(areas),
                          stdDev: window.math.std(areas),
                          min: Math.min(...areas),
                          max: Math.max(...areas),
                        };
                        return (
                          <>
                            <p>
                              Mean: {stats.mean.toFixed(parseInt(precision))} {results[0].unit}
                            </p>
                            <p>
                              Median: {stats.median.toFixed(parseInt(precision))} {results[0].unit}
                            </p>
                            <p>
                              Standard Deviation: {stats.stdDev.toFixed(parseInt(precision))}{" "}
                              {results[0].unit}
                            </p>
                            <p>
                              Min: {stats.min.toFixed(parseInt(precision))} {results[0].unit}
                            </p>
                            <p>
                              Max: {stats.max.toFixed(parseInt(precision))} {results[0].unit}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Shape Visualization</h3>
                <canvas ref={shapeCanvasRef} className="w-full h-[300px] border border-gray-300" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Area Comparison</h3>
                <canvas ref={barChartRef} className="max-h-80" />
              </div>
              {results.length > 1 && results[0]?.operation !== "stats" && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-700">Area Distribution</h3>
                  <canvas ref={pieChartRef} className="max-h-80" />
                </div>
              )}
              <div className="mt-6 overflow-x-auto max-h-52 overflow-y-auto">
                <h3 className="text-md font-medium text-gray-700">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Date</th>
                      <th className="p-2">Parameters</th>
                      <th className="p-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, i) => (
                      <tr key={i}>
                        <td className="p-2">{entry.date}</td>
                        <td className="p-2">{entry.params}</td>
                        <td className="p-2">{entry.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                  onClick={exportCSV}
                >
                  Export CSV
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                  onClick={exportJSON}
                >
                  Export JSON
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
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
