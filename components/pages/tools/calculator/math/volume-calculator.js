"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { median as takeMedian, mean as takeMean } from "mathjs";
import { jsPDF } from "jspdf";

export default function AdvancedVolumeCalculator() {
  const [shape, setShape] = useState("sphere");
  const [unit, setUnit] = useState("cm");
  const [precision, setPrecision] = useState("2");
  const [outputFormat, setOutputFormat] = useState("standard");
  const [params, setParams] = useState({});
  const [batchInput, setBatchInput] = useState("");
  const [batchParam, setBatchParam] = useState("");
  const [sensitivityRange, setSensitivityRange] = useState("");
  const [sensitivityParam, setSensitivityParam] = useState("");
  const [statInput, setStatInput] = useState("");
  const [results, setResults] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [history, setHistory] = useState([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shapeCanvasRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const lineChartInstance = useRef(null);

  const unitConversions = {
    cm: { toBase: (v) => v, fromBase: (v) => v, label: "cm³" },
    m: { toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6, label: "m³" },
    ft: { toBase: (v) => v * 28316.8466, fromBase: (v) => v / 28316.8466, label: "ft³" },
    liter: { toBase: (v) => v * 1000, fromBase: (v) => v / 1000, label: "liters" },
    gallon: { toBase: (v) => v * 3785.41178, fromBase: (v) => v / 3785.41178, label: "gallons" },
  };

  const shapes = {
    sphere: {
      params: [{ id: "radius", label: "Radius (r)", placeholder: "e.g., 5" }],
      formula: (r) => (4 / 3) * Math.PI * r ** 3,
      steps: (r, formattedVolume, unitLabel) => [
        `V = (4/3) × π × r³`,
        `V = (4/3) × π × ${r}³`,
        `V = ${formattedVolume} ${unitLabel}`,
      ],
      diagram: (ctx, params) => {
        ctx.beginPath();
        ctx.arc(100, 100, 50, 0, 2 * Math.PI);
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(`r = ${params.radius}`, 150, 100);
      },
    },
    cone: {
      params: [
        { id: "radius", label: "Radius (r)", placeholder: "e.g., 5" },
        { id: "height", label: "Height (h)", placeholder: "e.g., 10" },
      ],
      formula: (r, h) => (1 / 3) * Math.PI * r ** 2 * h,
      steps: (r, h, formattedVolume, unitLabel) => [
        `V = (1/3) × π × r² × h`,
        `V = (1/3) × π × ${r}² × ${h}`,
        `V = ${formattedVolume} ${unitLabel}`,
      ],
      diagram: (ctx, params) => {
        ctx.beginPath();
        ctx.moveTo(100, 50);
        ctx.lineTo(50, 150);
        ctx.lineTo(150, 150);
        ctx.closePath();
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(`r = ${params.radius}`, 50, 160);
        ctx.fillText(`h = ${params.height}`, 160, 100);
      },
    },
    cube: {
      params: [{ id: "side", label: "Side (a)", placeholder: "e.g., 5" }],
      formula: (a) => a ** 3,
      steps: (a, formattedVolume, unitLabel) => [
        `V = a³`,
        `V = ${a}³`,
        `V = ${formattedVolume} ${unitLabel}`,
      ],
      diagram: (ctx, params) => {
        ctx.beginPath();
        ctx.rect(50, 50, 100, 100);
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(`a = ${params.side}`, 160, 100);
      },
    },
    cylinder: {
      params: [
        { id: "radius", label: "Radius (r)", placeholder: "e.g., 5" },
        { id: "height", label: "Height (h)", placeholder: "e.g., 10" },
      ],
      formula: (r, h) => Math.PI * r ** 2 * h,
      steps: (r, h, formattedVolume, unitLabel) => [
        `V = π × r² × h`,
        `V = π × ${r}² × ${h}`,
        `V = ${formattedVolume} ${unitLabel}`,
      ],
      diagram: (ctx, params) => {
        ctx.beginPath();
        ctx.ellipse(100, 150, 50, 20, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();
        ctx.ellipse(100, 50, 50, 20, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.moveTo(50, 150);
        ctx.lineTo(50, 50);
        ctx.moveTo(150, 150);
        ctx.lineTo(150, 50);
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fillRect(50, 50, 100, 100);
        ctx.fillStyle = "black";
        ctx.fillText(`r = ${params.radius}`, 50, 160);
        ctx.fillText(`h = ${params.height}`, 160, 100);
      },
    },
    rectangular_tank: {
      params: [
        { id: "length", label: "Length (l)", placeholder: "e.g., 5" },
        { id: "width", label: "Width (w)", placeholder: "e.g., 4" },
        { id: "height", label: "Height (h)", placeholder: "e.g., 3" },
      ],
      formula: (l, w, h) => l * w * h,
      steps: (l, w, h, formattedVolume, unitLabel) => [
        `V = l × w × h`,
        `V = ${l} × ${w} × ${h}`,
        `V = ${formattedVolume} ${unitLabel}`,
      ],
      diagram: (ctx, params) => {
        ctx.beginPath();
        ctx.rect(50, 50, 120, 80);
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(`l = ${params.length}`, 50, 140);
        ctx.fillText(`w = ${params.width}`, 180, 100);
        ctx.fillText(`h = ${params.height}`, 130, 40);
      },
    },
    capsule: {
      params: [
        { id: "radius", label: "Radius (r)", placeholder: "e.g., 5" },
        { id: "cylinder_length", label: "Cylinder Length (a)", placeholder: "e.g., 10" },
      ],
      formula: (r, a) => Math.PI * r ** 2 * ((4 / 3) * r + a),
      steps: (r, a, formattedVolume, unitLabel) => [
        `V = π × r² × ((4/3)r + a)`,
        `V = π × ${r}² × ((4/3) × ${r} + ${a})`,
        `V = ${formattedVolume} ${unitLabel}`,
      ],
      diagram: (ctx, params) => {
        ctx.beginPath();
        ctx.arc(100, 50, 50, Math.PI / 2, (3 * Math.PI) / 2);
        ctx.arc(100, 150, 50, (3 * Math.PI) / 2, Math.PI / 2);
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fillRect(50, 50, 100, 100);
        ctx.fillStyle = "black";
        ctx.fillText(`r = ${params.radius}`, 50, 160);
        ctx.fillText(`a = ${params.cylinder_length}`, 160, 100);
      },
    },
    spherical_cap: {
      params: [
        { id: "radius", label: "Radius (r)", placeholder: "e.g., 5" },
        { id: "cap_height", label: "Cap Height (h)", placeholder: "e.g., 2" },
      ],
      formula: (r, h) => (1 / 3) * Math.PI * h ** 2 * (3 * r - h),
      steps: (r, h, formattedVolume, unitLabel) => [
        `V = (1/3) × π × h² × (3r - h)`,
        `V = (1/3) × π × ${h}² × (3 × ${r} - ${h})`,
        `V = ${formattedVolume} ${unitLabel}`,
      ],
      diagram: (ctx, params) => {
        ctx.beginPath();
        ctx.arc(100, 100, 50, 0, Math.PI);
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(`r = ${params.radius}`, 150, 100);
        ctx.fillText(`h = ${params.cap_height}`, 100, 50);
      },
    },
    conical_frustum: {
      params: [
        { id: "bottom_radius", label: "Bottom Radius (r₁)", placeholder: "e.g., 5" },
        { id: "top_radius", label: "Top Radius (r₂)", placeholder: "e.g., 3" },
        { id: "height", label: "Height (h)", placeholder: "e.g., 10" },
      ],
      formula: (r1, r2, h) => (1 / 3) * Math.PI * h * (r1 ** 2 + r2 ** 2 + r1 * r2),
      steps: (r1, r2, h, formattedVolume, unitLabel) => [
        `V = (1/3) × π × h × (r₁² + r₂² + r₁r₂)`,
        `V = (1/3) × π × ${h} × (${r1}² + ${r2}² + ${r1} × ${r2})`,
        `V = ${formattedVolume} ${unitLabel}`,
      ],
      diagram: (ctx, params) => {
        ctx.beginPath();
        ctx.moveTo(50, 150);
        ctx.lineTo(80, 50);
        ctx.lineTo(120, 50);
        ctx.lineTo(150, 150);
        ctx.closePath();
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(`r₁ = ${params.bottom_radius}`, 50, 160);
        ctx.fillText(`r₂ = ${params.top_radius}`, 80, 40);
        ctx.fillText(`h = ${params.height}`, 160, 100);
      },
    },
    ellipsoid: {
      params: [
        { id: "semi_axis_a", label: "Semi-axis a", placeholder: "e.g., 5" },
        { id: "semi_axis_b", label: "Semi-axis b", placeholder: "e.g., 4" },
        { id: "semi_axis_c", label: "Semi-axis c", placeholder: "e.g., 3" },
      ],
      formula: (a, b, c) => (4 / 3) * Math.PI * a * b * c,
      steps: (a, b, c, formattedVolume, unitLabel) => [
        `V = (4/3) × π × a × b × c`,
        `V = (4/3) × π × ${a} × ${b} × ${c}`,
        `V = ${formattedVolume} ${unitLabel}`,
      ],
      diagram: (ctx, params) => {
        ctx.beginPath();
        ctx.ellipse(100, 100, 60, 40, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(`a = ${params.semi_axis_a}`, 160, 100);
        ctx.fillText(`b = ${params.semi_axis_b}`, 100, 150);
      },
    },
    square_pyramid: {
      params: [
        { id: "base_side", label: "Base Side (a)", placeholder: "e.g., 5" },
        { id: "height", label: "Height (h)", placeholder: "e.g., 10" },
      ],
      formula: (a, h) => (1 / 3) * a ** 2 * h,
      steps: (a, h, formattedVolume, unitLabel) => [
        `V = (1/3) × a² × h`,
        `V = (1/3) × ${a}² × ${h}`,
        `V = ${formattedVolume} ${unitLabel}`,
      ],
      diagram: (ctx, params) => {
        ctx.beginPath();
        ctx.moveTo(100, 50);
        ctx.lineTo(50, 150);
        ctx.lineTo(150, 150);
        ctx.lineTo(100, 50);
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(`a = ${params.base_side}`, 50, 160);
        ctx.fillText(`h = ${params.height}`, 160, 100);
      },
    },
    tube: {
      params: [
        { id: "outer_radius", label: "Outer Radius (rₒ)", placeholder: "e.g., 5" },
        { id: "inner_radius", label: "Inner Radius (rᵢ)", placeholder: "e.g., 3" },
        { id: "height", label: "Height (h)", placeholder: "e.g., 10" },
      ],
      formula: (ro, ri, h) => Math.PI * (ro ** 2 - ri ** 2) * h,
      steps: (ro, ri, h, formattedVolume, unitLabel) => [
        `V = π × (rₒ² - rᵢ²) × h`,
        `V = π × (${ro}² - ${ri}²) × ${h}`,
        `V = ${formattedVolume} ${unitLabel}`,
      ],
      diagram: (ctx, params) => {
        ctx.beginPath();
        ctx.ellipse(100, 150, 50, 20, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();
        ctx.ellipse(100, 150, 30, 12, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.ellipse(100, 50, 50, 20, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.ellipse(100, 50, 30, 12, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.moveTo(50, 150);
        ctx.lineTo(50, 50);
        ctx.moveTo(150, 150);
        ctx.lineTo(150, 50);
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fillRect(50, 50, 100, 100);
        ctx.fillStyle = "black";
        ctx.fillText(`rₒ = ${params.outer_radius}`, 50, 160);
        ctx.fillText(`rᵢ = ${params.inner_radius}`, 80, 160);
        ctx.fillText(`h = ${params.height}`, 160, 100);
      },
    },
  };

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("volumeCalculationHistory") || "[]");
    setHistory(storedHistory);
    updateInputFields(shape);
  }, [shape]);

  const updateInputFields = (selectedShape) => {
    const newParams = {};
    shapes[selectedShape].params.forEach((param) => {
      newParams[param.id] = "";
    });
    setParams(newParams);
    setBatchParam(shapes[selectedShape].params[0]?.id || "");
    setSensitivityParam(shapes[selectedShape].params[0]?.id || "");
  };

  const calculateVolume = (shapeKey, inputParams, baseParams) => {
    let volume;
    switch (shapeKey) {
      case "sphere":
        volume = shapes[shapeKey].formula(baseParams.radius);
        break;
      case "cone":
      case "cylinder":
      case "square_pyramid":
        volume = shapes[shapeKey].formula(baseParams.radius || baseParams.base_side, baseParams.height);
        break;
      case "cube":
        volume = shapes[shapeKey].formula(baseParams.side);
        break;
      case "rectangular_tank":
        volume = shapes[shapeKey].formula(baseParams.length, baseParams.width, baseParams.height);
        break;
      case "capsule":
      case "spherical_cap":
        volume = shapes[shapeKey].formula(
          baseParams.radius,
          baseParams.cylinder_length || baseParams.cap_height
        );
        break;
      case "conical_frustum":
        volume = shapes[shapeKey].formula(baseParams.bottom_radius, baseParams.top_radius, baseParams.height);
        break;
      case "ellipsoid":
        volume = shapes[shapeKey].formula(
          baseParams.semi_axis_a,
          baseParams.semi_axis_b,
          baseParams.semi_axis_c
        );
        break;
      case "tube":
        volume = shapes[shapeKey].formula(
          baseParams.outer_radius,
          baseParams.inner_radius,
          baseParams.height
        );
        break;
    }
    const outputVolume = unitConversions[unit].fromBase(volume);
    const formattedVolume =
      outputFormat === "scientific"
        ? outputVolume.toExponential(parseInt(precision))
        : outputVolume.toFixed(parseInt(precision));
    return { volume: outputVolume, formattedVolume };
  };

  const calculate = () => {
    setError("");
    setSuccess("");
    setResults(null);
    try {
      const inputParams = {};
      shapes[shape].params.forEach((param) => {
        const value = parseFloat(params[param.id]);
        if (isNaN(value) || value <= 0) throw new Error(`${param.label} must be positive`);
        inputParams[param.id] = value;
      });

      if (shape === "tube" && inputParams.inner_radius >= inputParams.outer_radius) {
        throw new Error("Inner radius must be less than outer radius");
      }
      if (shape === "spherical_cap" && inputParams.cap_height > inputParams.radius) {
        throw new Error("Cap height must be less than or equal to radius");
      }

      const baseParams = {};
      Object.keys(inputParams).forEach((key) => {
        baseParams[key] = unitConversions[unit].toBase(inputParams[key]);
      });

      const { volume, formattedVolume } = calculateVolume(shape, inputParams, baseParams);
      const newSteps = shapes[shape].steps(
        ...Object.values(inputParams),
        formattedVolume,
        unitConversions[unit].label
      );
      setResults({ type: "single", volume: formattedVolume, unit: unitConversions[unit].label });
      setSteps(newSteps);

      const paramStr = Object.entries(inputParams)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      saveToHistory(shape, paramStr, `${formattedVolume} ${unitConversions[unit].label}`);
      updateVisualizations([{ value: volume, label: shape, params: inputParams }]);
      drawShapeDiagram(shape, inputParams);
    } catch (e) {
      setError(e.message || "Invalid input");
    }
  };

  const calculateBatch = () => {
    setError("");
    setSuccess("");
    setResults(null);
    try {
      const batchValues = batchInput
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n) && n > 0);
      if (batchValues.length === 0) throw new Error("Invalid batch input");

      const inputParams = {};
      shapes[shape].params.forEach((param) => {
        if (param.id !== batchParam) {
          const value = parseFloat(params[param.id]);
          if (isNaN(value) || value <= 0) throw new Error(`${param.label} must be positive`);
          inputParams[param.id] = value;
        }
      });

      const batchResults = batchValues.map((value) => {
        const currentParams = { ...inputParams, [batchParam]: value };
        if (shape === "tube" && currentParams.inner_radius >= currentParams.outer_radius)
          throw new Error("Inner radius must be less than outer radius");
        if (shape === "spherical_cap" && currentParams.cap_height > currentParams.radius)
          throw new Error("Cap height must be less than or equal to radius");

        const baseParams = {};
        Object.keys(currentParams).forEach(
          (key) => (baseParams[key] = unitConversions[unit].toBase(currentParams[key]))
        );
        const { volume, formattedVolume } = calculateVolume(shape, currentParams, baseParams);
        return { value, volume, formattedVolume };
      });

      setResults({ type: "batch", data: batchResults, param: batchParam, unit: unitConversions[unit].label });
      setSteps([`Calculated for ${batchParam} = ${batchValues.join(", ")}`]);

      const expression = `Batch ${batchParam}: ${batchValues.join(", ")} for ${shape}`;
      saveToHistory(shape, expression, batchResults.map((r) => r.formattedVolume).join("; "));
      updateVisualizations(
        batchResults.map((r) => ({
          value: r.volume,
          label: `${batchParam} = ${r.value}`,
          params: inputParams,
        }))
      );
      drawShapeDiagram(shape, inputParams);
    } catch (e) {
      setError(e.message || "Invalid batch input");
    }
  };

  const calculateSensitivity = () => {
    setError("");
    setSuccess("");
    setResults(null);
    try {
      const range = sensitivityRange.split("-").map(Number);
      if (range.length !== 2 || isNaN(range[0]) || isNaN(range[1]) || range[0] <= 0)
        throw new Error("Invalid range");

      const [start, end] = range;
      const inputParams = {};
      shapes[shape].params.forEach((param) => {
        if (param.id !== sensitivityParam) {
          const value = parseFloat(params[param.id]);
          if (isNaN(value) || value <= 0) throw new Error(`${param.label} must be positive`);
          inputParams[param.id] = value;
        }
      });

      const sensitivityResults = [];
      for (let value = start; value <= end; value += (end - start) / 10) {
        const currentParams = { ...inputParams, [sensitivityParam]: value };
        if (shape === "tube" && currentParams.inner_radius >= currentParams.outer_radius) continue;
        if (shape === "spherical_cap" && currentParams.cap_height > currentParams.radius) continue;

        const baseParams = {};
        Object.keys(currentParams).forEach(
          (key) => (baseParams[key] = unitConversions[unit].toBase(currentParams[key]))
        );
        const { volume, formattedVolume } = calculateVolume(shape, currentParams, baseParams);
        sensitivityResults.push({ value, volume, formattedVolume });
      }

      setResults({
        type: "sensitivity",
        data: sensitivityResults,
        param: sensitivityParam,
        unit: unitConversions[unit].label,
      });
      setSteps([`Calculated for ${sensitivityParam} from ${start} to ${end}`]);

      const expression = `Sensitivity ${sensitivityParam}: ${start}-${end} for ${shape}`;
      saveToHistory(shape, expression, sensitivityResults.map((r) => r.formattedVolume).join("; "));
      updateSensitivityChart(sensitivityResults, sensitivityParam, unitConversions[unit].label);
      drawShapeDiagram(shape, inputParams);
    } catch (e) {
      setError(e.message || "Invalid sensitivity input");
    }
  };

  const calculateStats = () => {
    setError("");
    setSuccess("");
    setResults(null);
    try {
      const volumes = statInput
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n) && n >= 0);
      if (volumes.length === 0) throw new Error("Invalid volume list");

      const mean = takeMean(volumes);
      const median = takeMedian(volumes);
      const formattedMean =
        outputFormat === "scientific"
          ? mean.toExponential(parseInt(precision))
          : mean.toFixed(parseInt(precision));
      const formattedMedian =
        outputFormat === "scientific"
          ? median.toExponential(parseInt(precision))
          : median.toFixed(parseInt(precision));
      const result = `Mean: ${formattedMean} ${unitConversions[unit].label}, Median: ${formattedMedian} ${unitConversions[unit].label}`;

      setResults({
        type: "stats",
        data: { mean: formattedMean, median: formattedMedian },
        unit: unitConversions[unit].label,
      });
      setSteps([`Mean: (${volumes.join(" + ")}) / ${volumes.length} = ${mean}`, `Median: ${median}`]);

      const expression = `Stats(${volumes.join(", ")})`;
      saveToHistory("Statistics", expression, result);
      updateVisualizations(volumes.map((v, i) => ({ value: v, label: `Volume ${i + 1}` })));
    } catch (e) {
      setError("Invalid statistical input");
    }
  };

  const saveToHistory = (shapeName, paramsStr, result) => {
    const newHistory = [
      ...history,
      { date: new Date().toLocaleString(), shape: shapeName, params: paramsStr, result },
    ];
    setHistory(newHistory);
    localStorage.setItem("volumeCalculationHistory", JSON.stringify(newHistory));
  };

  const drawShapeDiagram = (shapeKey, shapeParams) => {
    const ctx = shapeCanvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, shapeCanvasRef.current.width, shapeCanvasRef.current.height);
    shapes[shapeKey].diagram(ctx, shapeParams);
  };

  const updateVisualizations = (data) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    barChartInstance.current = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => d.label),
        datasets: [{ label: "Volume", data: data.map((d) => d.value), backgroundColor: "#ef4444" }],
      },
      options: {
        responsive: true,
        scales: { y: { title: { display: true, text: "Volume" }, beginAtZero: true } },
        plugins: { title: { display: true, text: "Volume Comparison" } },
      },
    });
  };

  const updateSensitivityChart = (results, param, unitLabel) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    lineChartInstance.current = new Chart(lineChartRef.current, {
      type: "line",
      data: {
        labels: results.map((r) => r.value),
        datasets: [
          {
            label: `Volume (${unitLabel})`,
            data: results.map((r) => parseFloat(r.volume)),
            borderColor: "#ef4444",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: param } },
          y: { title: { display: true, text: `Volume (${unitLabel})` } },
        },
        plugins: { title: { display: true, text: "Sensitivity Analysis" } },
      },
    });
  };

  const clearInputs = () => {
    setError("");
    setSuccess("");
    setResults(null);
    setSteps([]);
    updateInputFields(shape);
    setBatchInput("");
    setSensitivityRange("");
    setStatInput("");
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    const ctx = shapeCanvasRef.current?.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, shapeCanvasRef.current.width, shapeCanvasRef.current.height);
  };

  const saveCalculation = () => {
    setError("");
    setSuccess("");
    if (results) {
      setSuccess("Calculation saved to history!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("No valid calculation to save.");
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Shape", "Parameters", "Result"],
      ...history.map((h) => [h.date, h.shape, h.params, h.result]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "volume_calculator_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Volume Calculator History", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    history.forEach((h) => {
      doc.text(`Date: ${h.date}, Shape: ${h.shape}, Params: ${h.params}, Result: ${h.result}`, 10, y);
      y += 10;
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    });
    doc.text("Note: Visualizations and steps are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("volume_calculator_history.pdf");
  };

  const renderInputFields = () =>
    shapes[shape].params.map((param) => (
      <div key={param.id} className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-gray-700 mb-2">{param.label}</label>
        <input
          type="number"
          step="any"
          value={params[param.id] || ""}
          onChange={(e) => setParams({ ...params, [param.id]: e.target.value })}
          className="p-3 border rounded-lg w-full"
          placeholder={param.placeholder}
        />
      </div>
    ));

  return (
    <>
      <div className=" bg-white flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full">
          <h1 className="text-2xl font-bold text-red-700 mb-6">Advanced Volume Calculator</h1>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

          <h2 className="text-xl font-semibold text-red-700 mb-4">Select Shape</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="sphere">Sphere</option>
              <option value="cone">Cone</option>
              <option value="cube">Cube</option>
              <option value="cylinder">Cylinder</option>
              <option value="rectangular_tank">Rectangular Tank</option>
              <option value="capsule">Capsule</option>
              <option value="spherical_cap">Spherical Cap</option>
              <option value="conical_frustum">Conical Frustum</option>
              <option value="ellipsoid">Ellipsoid</option>
              <option value="square_pyramid">Square Pyramid</option>
              <option value="tube">Tube</option>
            </select>
          </div>

          <h2 className="text-xl font-semibold text-red-700 mb-4">Input Parameters</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">{renderInputFields()}</div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="cm">Centimeters (cm³)</option>
              <option value="m">Meters (m³)</option>
              <option value="ft">Feet (ft³)</option>
              <option value="liter">Liters</option>
              <option value="gallon">Gallons</option>
            </select>
          </div>

          <h2 className="text-xl font-semibold text-red-700 mb-4">Settings</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Precision</label>
              <select
                value={precision}
                onChange={(e) => setPrecision(e.target.value)}
                className="p-3 border rounded-lg w-full"
              >
                <option value="2">2 Decimals</option>
                <option value="4">4 Decimals</option>
                <option value="6">6 Decimals</option>
                <option value="8">8 Decimals</option>
                <option value="10">10 Decimals</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="p-3 border rounded-lg w-full"
              >
                <option value="standard">Standard</option>
                <option value="scientific">Scientific Notation</option>
              </select>
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
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              {isAdvancedOpen ? "Hide Advanced Features" : "Show Advanced Features"}
            </button>
          </div>

          {isAdvancedOpen && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-red-700 mb-4">Advanced Calculations</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Parameters (e.g., 5,10,15)
                </label>
                <input
                  type="text"
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="5,10,15"
                />
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Parameter to Vary</label>
                <select
                  value={batchParam}
                  onChange={(e) => setBatchParam(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  {shapes[shape].params.map((param) => (
                    <option key={param.id} value={param.id}>
                      {param.label}
                    </option>
                  ))}
                </select>
                <button onClick={calculateBatch} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
                  Calculate Batch
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sensitivity Range (e.g., 5-10)
                </label>
                <input
                  type="text"
                  value={sensitivityRange}
                  onChange={(e) => setSensitivityRange(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="5-10"
                />
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Parameter to Vary</label>
                <select
                  value={sensitivityParam}
                  onChange={(e) => setSensitivityParam(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  {shapes[shape].params.map((param) => (
                    <option key={param.id} value={param.id}>
                      {param.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={calculateSensitivity}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Analyze Sensitivity
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume List (e.g., 523.6,4188.8)
                </label>
                <input
                  type="text"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="523.6,4188.8"
                />
                <button onClick={calculateStats} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
                  Calculate Statistics
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Volume
          </button>

          {results && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-red-700 mb-4">Calculation Results</h2>
              <div className="text-gray-700 mb-4">
                {results.type === "single" && (
                  <p>
                    Volume: {results.volume} {results.unit}
                  </p>
                )}
                {results.type === "batch" && (
                  <>
                    <p>Batch Results:</p>
                    {results.data.map((r, i) => (
                      <p key={i}>
                        {results.param} = {r.value}: {r.formattedVolume} {results.unit}
                      </p>
                    ))}
                  </>
                )}
                {results.type === "sensitivity" && (
                  <>
                    <p>Sensitivity Results:</p>
                    {results.data.map((r, i) => (
                      <p key={i}>
                        {results.param} = {r.value}: {r.formattedVolume} {results.unit}
                      </p>
                    ))}
                  </>
                )}
                {results.type === "stats" && (
                  <p>
                    Mean: {results.data.mean} {results.unit}, Median: {results.data.median} {results.unit}
                  </p>
                )}
              </div>
              <div className="text-gray-700 mb-4">
                <strong>Steps:</strong>
                <br />
                {steps.map((step, i) => (
                  <p key={i}>{step}</p>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Shape Diagram</h3>
                <canvas ref={shapeCanvasRef} className="max-h-[200px] my-4" width="200" height="200" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Volume Comparison</h3>
                <canvas ref={barChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Sensitivity Analysis</h3>
                <canvas ref={lineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 max-h-[200px] overflow-y-auto">
                <h3 className="text-md font-medium text-red-700">Calculation History</h3>
                <table className="w-full text-sm text-gray-700">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Shape</th>
                      <th className="p-2">Parameters</th>
                      <th className="p-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i}>
                        <td className="p-2">{h.date}</td>
                        <td className="p-2">{h.shape}</td>
                        <td className="p-2">{h.params}</td>
                        <td className="p-2">{h.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4">
                <button onClick={exportCSV} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Export CSV
                </button>
                <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Export PDF
                </button>
              </div>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
              <div className="bg-gray-100 p-5 rounded-lg max-w-[600px] w-[90%] relative">
                <span
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold text-red-700 mb-4">Understanding Volume</h2>
                <p className="mb-4 text-gray-700">
                  Volume measures the amount of space a 3D object occupies, typically in cubic units (e.g.,
                  cm³, m³).
                </p>
                <h3 className="text-md font-medium text-red-700 mb-2">Shape Formulas</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>
                    <strong>Sphere:</strong> V = (4/3)πr³
                  </li>
                  <li>
                    <strong>Cone:</strong> V = (1/3)πr²h
                  </li>
                  <li>
                    <strong>Cube:</strong> V = a³
                  </li>
                  <li>
                    <strong>Cylinder:</strong> V = πr²h
                  </li>
                  <li>
                    <strong>Rectangular Tank:</strong> V = l × w × h
                  </li>
                  <li>
                    <strong>Capsule:</strong> V = πr²((4/3)r + a)
                  </li>
                  <li>
                    <strong>Spherical Cap:</strong> V = (1/3)πh²(3r - h)
                  </li>
                  <li>
                    <strong>Conical Frustum:</strong> V = (1/3)πh(r₁² + r₂² + r₁r₂)
                  </li>
                  <li>
                    <strong>Ellipsoid:</strong> V = (4/3)πabc
                  </li>
                  <li>
                    <strong>Square Pyramid:</strong> V = (1/3)a²h
                  </li>
                  <li>
                    <strong>Tube:</strong> V = π(rₒ² - rᵢ²)h
                  </li>
                </ul>
                <h3 className="text-md font-medium text-red-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>
                    Ensure all inputs are positive and valid (e.g., inner radius &lt; outer radius for tubes).
                  </li>
                  <li>Use unit conversion for consistent results across different scales.</li>
                  <li>Visualizations help understand shape dimensions and volume trends.</li>
                </ul>
                <h3 className="text-md font-medium text-red-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 mb-4 text-blue-500">
                  <li>
                    <a
                      href="https://www.mathsisfun.com/geometry/volume.html"
                      target="_blank"
                      className="hover:underline"
                    >
                      Math Is Fun: Volume
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.khanacademy.org/math/geometry/hs-geo-solids"
                      target="_blank"
                      className="hover:underline"
                    >
                      Khan Academy: Solids
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
