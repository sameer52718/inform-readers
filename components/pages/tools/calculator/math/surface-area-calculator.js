"use client"
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function AdvancedSurfaceAreaCalculator() {
  const [shape, setShape] = useState("ball");
  const [unit, setUnit] = useState("meters");
  const [params, setParams] = useState({});
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const conversionFactors = {
    meters: 1,
    centimeters: 0.0001,
    feet: 0.092903,
    inches: 0.00064516,
  };

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("surfaceAreaCalcHistory") || "[]");
    setHistory(storedHistory);
    updateInputFields(shape);
  }, [shape]);

  const updateInputFields = (selectedShape) => {
    const newParams = {};
    if (selectedShape === "ball") newParams.r = "";
    else if (
      selectedShape === "cone" ||
      selectedShape === "cylinder" ||
      selectedShape === "capsule" ||
      selectedShape === "cap" ||
      selectedShape === "pyramid"
    ) {
      newParams.r = "";
      newParams.h = "";
    } else if (selectedShape === "cube") newParams.a = "";
    else if (selectedShape === "rectangular") {
      newParams.l = "";
      newParams.w = "";
      newParams.h = "";
    } else if (selectedShape === "frustum") {
      newParams.r1 = "";
      newParams.r2 = "";
      newParams.h = "";
    } else if (selectedShape === "ellipsoid") {
      newParams.a = "";
      newParams.b = "";
      newParams.c = "";
    }
    setParams(newParams);
  };

  const calculateSurfaceArea = (shape, params, unit) => {
    let area = 0,
      formula = "";
    if (shape === "ball") {
      if (isNaN(params.r) || params.r <= 0) throw new Error("Radius must be positive");
      area = 4 * Math.PI * params.r ** 2;
      formula = `A = 4π(${params.r})^2 = ${area.toFixed(3)} square meters`;
    } else if (shape === "cone") {
      if (isNaN(params.r) || params.r <= 0 || isNaN(params.h) || params.h <= 0)
        throw new Error("Radius and height must be positive");
      const s = Math.sqrt(params.h ** 2 + params.r ** 2);
      area = Math.PI * params.r * (params.r + s);
      formula = `A = π(${params.r})(${params.r} + √(${params.h}^2 + ${params.r}^2)) = ${area.toFixed(
        3
      )} square meters`;
    } else if (shape === "cube") {
      if (isNaN(params.a) || params.a <= 0) throw new Error("Side length must be positive");
      area = 6 * params.a ** 2;
      formula = `A = 6(${params.a})^2 = ${area.toFixed(3)} square meters`;
    } else if (shape === "cylinder") {
      if (isNaN(params.r) || params.r <= 0 || isNaN(params.h) || params.h <= 0)
        throw new Error("Radius and height must be positive");
      area = 2 * Math.PI * params.r * (params.r + params.h);
      formula = `A = 2π(${params.r})(${params.r} + ${params.h}) = ${area.toFixed(3)} square meters`;
    } else if (shape === "rectangular") {
      if (
        isNaN(params.l) ||
        params.l <= 0 ||
        isNaN(params.w) ||
        params.w <= 0 ||
        isNaN(params.h) ||
        params.h <= 0
      )
        throw new Error("Length, width, and height must be positive");
      area = 2 * (params.l * params.w + params.l * params.h + params.w * params.h);
      formula = `A = 2(${params.l}*${params.w} + ${params.l}*${params.h} + ${params.w}*${
        params.h
      }) = ${area.toFixed(3)} square meters`;
    } else if (shape === "capsule") {
      if (isNaN(params.r) || params.r <= 0 || isNaN(params.h) || params.h <= 0)
        throw new Error("Radius and height must be positive");
      area = 4 * Math.PI * params.r ** 2 + 2 * Math.PI * params.r * params.h;
      formula = `A = 4π(${params.r})^2 + 2π(${params.r})(${params.h}) = ${area.toFixed(3)} square meters`;
    } else if (shape === "cap") {
      if (isNaN(params.r) || params.r <= 0 || isNaN(params.h) || params.h <= 0 || params.h > 2 * params.r)
        throw new Error("Radius and height must be positive, and height must be less than diameter");
      area = 2 * Math.PI * params.r * params.h;
      formula = `A = 2π(${params.r})(${params.h}) = ${area.toFixed(3)} square meters`;
    } else if (shape === "frustum") {
      if (
        isNaN(params.r1) ||
        params.r1 <= 0 ||
        isNaN(params.r2) ||
        params.r2 <= 0 ||
        isNaN(params.h) ||
        params.h <= 0
      )
        throw new Error("Radii and height must be positive");
      const s = Math.sqrt((params.r1 - params.r2) ** 2 + params.h ** 2);
      area = Math.PI * (params.r1 + params.r2) * s + Math.PI * params.r1 ** 2 + Math.PI * params.r2 ** 2;
      formula = `A = π(${params.r1} + ${params.r2})√((${params.r1} - ${params.r2})^2 + ${params.h}^2) + π(${
        params.r1
      })^2 + π(${params.r2})^2 = ${area.toFixed(3)} square meters`;
    } else if (shape === "ellipsoid") {
      if (
        isNaN(params.a) ||
        params.a <= 0 ||
        isNaN(params.b) ||
        params.b <= 0 ||
        isNaN(params.c) ||
        params.c <= 0
      )
        throw new Error("Axes must be positive");
      const p = 1.6075;
      area =
        4 *
        Math.PI *
        ((params.a ** p * params.b ** p + params.a ** p * params.c ** p + params.b ** p * params.c ** p) /
          3) **
          (1 / p);
      formula = `A ≈ 4π((${params.a}^${p}*${params.b}^${p} + ${params.a}^${p}*${params.c}^${p} + ${
        params.b
      }^${p}*${params.c}^${p})/3)^(1/${p}) = ${area.toFixed(3)} square meters`;
    } else if (shape === "pyramid") {
      if (isNaN(params.a) || params.a <= 0 || isNaN(params.h) || params.h <= 0)
        throw new Error("Base side length and height must be positive");
      area = params.a ** 2 + 2 * params.a * Math.sqrt(params.a ** 2 / 4 + params.h ** 2);
      formula = `A = (${params.a})^2 + 2(${params.a})√((${params.a}^2/4) + ${params.h}^2) = ${area.toFixed(
        3
      )} square meters`;
    }
    area *= conversionFactors[unit] || 1;
    return { area, formula, params };
  };

  const calculate = async () => {
    setError("");
    setSuccess("");
    setResults([]);
    setIsLoading(true);
    try {
      let calcResults = [];
      const isBatch = batchFile || batchText;

      if (!isBatch) {
        const result = calculateSurfaceArea(shape, params, unit);
        calcResults.push({ shape, params, unit, result });
      } else {
        let datasets = [];
        if (batchFile) {
          const text = await batchFile.text();
          datasets = text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line && line.includes(","));
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
            if (shape === "ball") batchParams.r = values[0];
            else if (
              shape === "cone" ||
              shape === "cylinder" ||
              shape === "capsule" ||
              shape === "cap" ||
              shape === "pyramid"
            ) {
              batchParams.r = values[0];
              batchParams.h = values[1];
            } else if (shape === "cube") batchParams.a = values[0];
            else if (shape === "rectangular") {
              batchParams.l = values[0];
              batchParams.w = values[1];
              batchParams.h = values[2];
            } else if (shape === "frustum") {
              batchParams.r1 = values[0];
              batchParams.r2 = values[1];
              batchParams.h = values[2];
            } else if (shape === "ellipsoid") {
              batchParams.a = values[0];
              batchParams.b = values[1];
              batchParams.c = values[2];
            }
            const result = calculateSurfaceArea(shape, batchParams, unit);
            calcResults.push({ shape, params: batchParams, unit, result });
          } catch (e) {
            console.warn(`Skipping invalid batch entry: ${e.message}`);
          }
        }
      }
      if (calcResults.length === 0) throw new Error("No valid datasets found");
      setResults(calcResults);
      setSuccess("Calculation completed successfully");
      updateVisualization(calcResults);
      saveToHistory(
        calcResults[0].shape,
        isBatch
          ? `Batch: ${calcResults.length} calculations`
          : getParamsString(calcResults[0].shape, calcResults[0].result.params),
        calcResults[0].result.area.toFixed(3)
      );
    } catch (e) {
      setError(e.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const clearInputs = () => {
    updateInputFields(shape);
    setBatchText("");
    setBatchFile(null);
    setResults([]);
    setError("");
    setSuccess("");
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
  };

  const getParamsString = (shape, params) => {
    if (shape === "ball") return `r=${params.r}`;
    if (shape === "cone") return `r=${params.r}, h=${params.h}`;
    if (shape === "cube") return `a=${params.a}`;
    if (shape === "cylinder") return `r=${params.r}, h=${params.h}`;
    if (shape === "rectangular") return `l=${params.l}, w=${params.w}, h=${params.h}`;
    if (shape === "capsule") return `r=${params.r}, h=${params.h}`;
    if (shape === "cap") return `r=${params.r}, h=${params.h}`;
    if (shape === "frustum") return `r₁=${params.r1}, r₂=${params.r2}, h=${params.h}`;
    if (shape === "ellipsoid") return `a=${params.a}, b=${params.b}, c=${params.c}`;
    if (shape === "pyramid") return `a=${params.a}, h=${params.h}`;
    return "";
  };

  const saveToHistory = (shape, params, result) => {
    const newHistory = [...history, { date: new Date().toLocaleString(), shape, params, result }];
    setHistory(newHistory);
    localStorage.setItem("surfaceAreaCalcHistory", JSON.stringify(newHistory));
  };

  const updateVisualization = (results) => {
    if (chartInstance.current) chartInstance.current.destroy();
    const shape = results[0].shape;
    const params = results[0].result.params;
    let datasets = [];
    if (shape === "ball") {
      datasets.push({
        label: "Radius",
        data: [
          { x: 0, y: 0 },
          { x: params.r, y: 0 },
        ],
        borderColor: "#ef4444",
        borderWidth: 2,
        pointRadius: 5,
        showLine: true,
      });
    } else if (shape === "cone" || shape === "cylinder" || shape === "capsule") {
      datasets.push(
        {
          label: "Radius",
          data: [
            { x: -params.r, y: 0 },
            { x: params.r, y: 0 },
          ],
          borderColor: "#ef4444",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        },
        {
          label: "Height",
          data: [
            { x: 0, y: 0 },
            { x: 0, y: params.h },
          ],
          borderColor: "#dc2626",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        }
      );
    } else if (shape === "cube") {
      datasets.push({
        label: "Side",
        data: [
          { x: 0, y: 0 },
          { x: params.a, y: 0 },
        ],
        borderColor: "#ef4444",
        borderWidth: 2,
        pointRadius: 5,
        showLine: true,
      });
    } else if (shape === "rectangular") {
      datasets.push(
        {
          label: "Length",
          data: [
            { x: 0, y: 0 },
            { x: params.l, y: 0 },
          ],
          borderColor: "#ef4444",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        },
        {
          label: "Width",
          data: [
            { x: 0, y: 0 },
            { x: 0, y: params.w },
          ],
          borderColor: "#dc2626",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        },
        {
          label: "Height",
          data: [
            { x: 0, y: 0 },
            { x: 0, y: params.h },
          ],
          borderColor: "#b91c1c",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        }
      );
    } else if (shape === "cap") {
      datasets.push(
        {
          label: "Radius",
          data: [
            { x: -params.r, y: 0 },
            { x: params.r, y: 0 },
          ],
          borderColor: "#ef4444",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        },
        {
          label: "Cap Height",
          data: [
            { x: 0, y: 0 },
            { x: 0, y: params.h },
          ],
          borderColor: "#dc2626",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        }
      );
    } else if (shape === "frustum") {
      datasets.push(
        {
          label: "Top Radius",
          data: [
            { x: -params.r1, y: params.h },
            { x: params.r1, y: params.h },
          ],
          borderColor: "#ef4444",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        },
        {
          label: "Bottom Radius",
          data: [
            { x: -params.r2, y: 0 },
            { x: params.r2, y: 0 },
          ],
          borderColor: "#dc2626",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        },
        {
          label: "Height",
          data: [
            { x: 0, y: 0 },
            { x: 0, y: params.h },
          ],
          borderColor: "#b91c1c",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        }
      );
    } else if (shape === "ellipsoid") {
      datasets.push(
        {
          label: "Axis a",
          data: [
            { x: -params.a, y: 0 },
            { x: params.a, y: 0 },
          ],
          borderColor: "#ef4444",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        },
        {
          label: "Axis b",
          data: [
            { x: 0, y: -params.b },
            { x: 0, y: params.b },
          ],
          borderColor: "#dc2626",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        }
      );
    } else if (shape === "pyramid") {
      datasets.push(
        {
          label: "Base Side",
          data: [
            { x: -params.a / 2, y: 0 },
            { x: params.a / 2, y: 0 },
          ],
          borderColor: "#ef4444",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        },
        {
          label: "Height",
          data: [
            { x: 0, y: 0 },
            { x: 0, y: params.h },
          ],
          borderColor: "#dc2626",
          borderWidth: 2,
          pointRadius: 5,
          showLine: true,
        }
      );
    }
    chartInstance.current = new Chart(chartRef.current, {
      type: "scatter",
      data: { datasets },
      options: {
        responsive: true,
        scales: { x: { title: { display: true, text: "X" } }, y: { title: { display: true, text: "Y" } } },
        plugins: {
          title: { display: true, text: `${shape.charAt(0).toUpperCase() + shape.slice(1)} Dimensions` },
        },
      },
    });
  };

  const exportCSV = () => {
    const headers = ["Date", "Shape", "Parameters", "Result"];
    const rows = history.map((entry) => [
      `"${entry.date}"`,
      `"${entry.shape}"`,
      `"${entry.params}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("surface_area_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    downloadFile("surface_area_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Surface Area Calculation History", 10, 10);
    let y = 20;
    history.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Shape: ${entry.shape.charAt(0).toUpperCase() + entry.shape.slice(1)}`, 10, y + 10);
      doc.text(`Parameters: ${entry.params}`, 10, y + 20);
      doc.text(`Result: ${entry.result}`, 10, y + 30);
      y += 50;
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("surface_area_history.pdf");
  };

  const downloadFile = (filename, type, content) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const renderInputFields = () => {
    if (shape === "ball")
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Radius (r)</label>
          <input
            type="number"
            value={params.r || ""}
            onChange={(e) => setParams({ ...params, r: parseFloat(e.target.value) })}
            className="p-3 border rounded-lg w-full"
            placeholder="e.g., 5"
          />
        </div>
      );
    if (
      shape === "cone" ||
      shape === "cylinder" ||
      shape === "capsule" ||
      shape === "cap" ||
      shape === "pyramid"
    )
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {shape === "pyramid" ? "Base Side Length (a)" : "Radius (r)"}
            </label>
            <input
              type="number"
              value={shape === "pyramid" ? params.a || "" : params.r || ""}
              onChange={(e) =>
                setParams({ ...params, [shape === "pyramid" ? "a" : "r"]: parseFloat(e.target.value) })
              }
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (h)</label>
            <input
              type="number"
              value={params.h || ""}
              onChange={(e) => setParams({ ...params, h: parseFloat(e.target.value) })}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 4"
            />
          </div>
        </>
      );
    if (shape === "cube")
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Side Length (a)</label>
          <input
            type="number"
            value={params.a || ""}
            onChange={(e) => setParams({ ...params, a: parseFloat(e.target.value) })}
            className="p-3 border rounded-lg w-full"
            placeholder="e.g., 2"
          />
        </div>
      );
    if (shape === "rectangular")
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length (l)</label>
            <input
              type="number"
              value={params.l || ""}
              onChange={(e) => setParams({ ...params, l: parseFloat(e.target.value) })}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width (w)</label>
            <input
              type="number"
              value={params.w || ""}
              onChange={(e) => setParams({ ...params, w: parseFloat(e.target.value) })}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (h)</label>
            <input
              type="number"
              value={params.h || ""}
              onChange={(e) => setParams({ ...params, h: parseFloat(e.target.value) })}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 2"
            />
          </div>
        </>
      );
    if (shape === "frustum")
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Top Radius (r₁)</label>
            <input
              type="number"
              value={params.r1 || ""}
              onChange={(e) => setParams({ ...params, r1: parseFloat(e.target.value) })}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bottom Radius (r₂)</label>
            <input
              type="number"
              value={params.r2 || ""}
              onChange={(e) => setParams({ ...params, r2: parseFloat(e.target.value) })}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (h)</label>
            <input
              type="number"
              value={params.h || ""}
              onChange={(e) => setParams({ ...params, h: parseFloat(e.target.value) })}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 3"
            />
          </div>
        </>
      );
    if (shape === "ellipsoid")
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Axis a</label>
            <input
              type="number"
              value={params.a || ""}
              onChange={(e) => setParams({ ...params, a: parseFloat(e.target.value) })}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Axis b</label>
            <input
              type="number"
              value={params.b || ""}
              onChange={(e) => setParams({ ...params, b: parseFloat(e.target.value) })}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Axis c</label>
            <input
              type="number"
              value={params.c || ""}
              onChange={(e) => setParams({ ...params, c: parseFloat(e.target.value) })}
              className="p-3 border rounded-lg w-full"
              placeholder="e.g., 5"
            />
          </div>
        </>
      );
  };

  return (
    <>
      <div className=" bg-white flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-6xl w-full">
          <h1 className="text-3xl font-bold text-red-700 mb-6">Advanced Surface Area Calculator</h1>

          {error && <p className="text-red-500 text-sm mb-1">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-6">{success}</p>}

          {isLoading && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-3 px-5 rounded-lg animate-pulse">
              Processing...
            </div>
          )}

          <h2 className="text-xl font-semibold text-red-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                <select
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="ball">Ball (Sphere)</option>
                  <option value="cone">Cone</option>
                  <option value="cube">Cube</option>
                  <option value="cylinder">Cylindrical Tank</option>
                  <option value="rectangular">Rectangular Tank</option>
                  <option value="capsule">Capsule</option>
                  <option value="cap">Spherical Cap</option>
                  <option value="frustum">Conical Frustum</option>
                  <option value="ellipsoid">Ellipsoid</option>
                  <option value="pyramid">Square Pyramid</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="meters">Square Meters</option>
                  <option value="centimeters">Square Centimeters</option>
                  <option value="feet">Square Feet</option>
                  <option value="inches">Square Inches</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-medium text-red-700 mb-2">Parameters</h3>
              <div className="flex flex-wrap gap-4">{renderInputFields()}</div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Input (CSV File or Text)
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
                className="p-3 border rounded-lg w-full"
                rows="4"
                placeholder="e.g., 5;3,4"
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
            <button
              onClick={() => setSuccess("Calculation saved to history")}
              className="bg-red-500 text-white px-6 py-3 rounded-lg"
            >
              Save Calculation
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Surface Area Calculations
          </button>

          {results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-red-700 mb-4">Results</h2>
              {results.length === 1 ? (
                <div className="text-gray-700">
                  <p>
                    <strong>
                      Surface Area (Shape:{" "}
                      {results[0].shape.charAt(0).toUpperCase() + results[0].shape.slice(1)}, Unit:{" "}
                      {results[0].unit}):
                    </strong>
                  </p>
                  <p>Parameters: {getParamsString(results[0].shape, results[0].result.params)}</p>
                  <p>
                    Area: {results[0].result.area.toFixed(3)} {results[0].unit}
                  </p>
                  <p>Formula: {results[0].result.formula}</p>
                </div>
              ) : (
                <table className="w-full text-sm text-gray-700">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Shape</th>
                      <th className="p-2">Parameters</th>
                      <th className="p-2">Area</th>
                      <th className="p-2">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, index) => (
                      <tr key={index}>
                        <td className="p-2">{r.shape.charAt(0).toUpperCase() + r.shape.slice(1)}</td>
                        <td className="p-2">{getParamsString(r.shape, r.result.params)}</td>
                        <td className="p-2">{r.result.area.toFixed(3)}</td>
                        <td className="p-2">{r.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Shape Visualization</h3>
                <canvas ref={chartRef} className="max-w-[600px] h-[300px] mx-auto" />
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
                    {history.map((entry, index) => (
                      <tr key={index}>
                        <td className="p-2">{entry.date}</td>
                        <td className="p-2">{entry.shape.charAt(0).toUpperCase() + entry.shape.slice(1)}</td>
                        <td className="p-2">{entry.params}</td>
                        <td className="p-2">{entry.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
              <div className="bg-gray-100 p-5 rounded-lg max-w-[600px] w-[90%] relative">
                <span
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  &times;
                </span>
                <h2 className="text-xl font-semibold text-red-700 mb-4">
                  Understanding Surface Area Calculations
                </h2>
                <p className="mb-4 text-gray-700">
                  Surface area calculations determine the total area of the outer surface of 3D geometric
                  shapes, used in fields like engineering, architecture, and manufacturing.
                </p>
                <h3 className="text-md font-medium text-red-700 mb-2">Formulas</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>
                    <strong>Ball (Sphere):</strong> A = 4πr²
                  </li>
                  <li>
                    <strong>Cone:</strong> A = πr(r + √(h² + r²))
                  </li>
                  <li>
                    <strong>Cube:</strong> A = 6a²
                  </li>
                  <li>
                    <strong>Cylindrical Tank:</strong> A = 2πr(r + h)
                  </li>
                  <li>
                    <strong>Rectangular Tank:</strong> A = 2(lw + lh + wh)
                  </li>
                  <li>
                    <strong>Capsule:</strong> A = 4πr² + 2πrh
                  </li>
                  <li>
                    <strong>Spherical Cap:</strong> A = 2πrh
                  </li>
                  <li>
                    <strong>Conical Frustum:</strong> A = π(r₁ + r₂)√((r₁ - r₂)² + h²) + πr₁² + πr₂²
                  </li>
                  {/* <li><li><strong>Ellipsoid (Approximate):</strong> A ≈ 4π((a^{1.6}b^{1.6}b^{1.6} + a^{1.6}c^{1.6} + b^{1.6}c^{1.6})/3)^{1/1.6})</li> */}
                  <li>
                    <strong>Square Pyramid:</strong> A = a² + 2a√((a²/4) + h²)
                  </li>
                </ul>
                <h3 className="text-md font-medium text-red-700 mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>
                    <strong>Programing:</strong> Calculate material requirements for tanks or containers.
                  </li>
                  <li>
                    <strong>Architecture:</strong> Determine surface area for painting or cladding.
                  </li>
                  <li>
                    <strong>Manufacturing:</strong> Optimize packaging or coating processes.
                  </li>
                  <li>
                    <strong>Science:</strong> Model physical properties of objects.
                  </li>
                </ul>
                <h3 className="text-md font-medium text-red-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>Ensure all inputs are positive numbers.</li>
                  <li>Use consistent units for all parameters.</li>
                  <li>For batch inputs, follow the format specified for each shape.</li>
                  <li>
                    Ellipsoid calculations use an approximation; for high precision, consult specialized
                    tools.
                  </li>
                </ul>
                <h3 className="text-md font-medium text-gray-700 mb-4">Resources</h3>
                <ul className="list-disc pl-5 mb-4 text-blue-500">
                  <li>
                    <a
                      href="https://www.mathsisfun.com/geometry/surface-area.html"
                      target="_blank"
                      className="hover:underline"
                    >
                      Surface Area Formulas
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://en.wikipedia.org/wiki/Surface_area"
                      target="_blank"
                      className="hover:underline"
                    >
                      Wikipedia: Surface Area
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
