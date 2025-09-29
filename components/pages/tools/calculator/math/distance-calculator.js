"use client";
import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function DistanceCalculator() {
  const [calcType, setCalcType] = useState("2d");
  const [unit, setUnit] = useState("meters");
  const [params, setParams] = useState({});
  const [marginError, setMarginError] = useState("");
  const [sampleSD, setSampleSD] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("95");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState([]);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const distanceChartRef = useRef(null);
  const mapRef = useRef(null);
  const chartInstance = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("distanceCalcHistory")) || [];
    setCalculationHistory(savedHistory);
    updateInputFields(calcType);
    // Initialize Leaflet map
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);
    }
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const conversionFactors = {
    meters: { meters: 1, kilometers: 0.001, miles: 0.000621371, feet: 3.28084 },
    kilometers: { meters: 1000, kilometers: 1, miles: 0.621371, feet: 3280.84 },
    miles: { meters: 1609.34, kilometers: 1.60934, miles: 1, feet: 5280 },
    feet: { meters: 0.3048, kilometers: 0.0003048, miles: 0.000189394, feet: 1 },
    nautical_miles: { kilometers: 1.852, miles: 1.15078 },
  };

  const zScores = { 90: 1.645, 95: 1.96, 99: 2.576 };

  const updateInputFields = (type) => {
    const newParams = {};
    if (type === "2d") {
      newParams.x1 = "";
      newParams.y1 = "";
      newParams.x2 = "";
      newParams.y2 = "";
      setUnit("meters");
    } else if (type === "3d") {
      newParams.x1 = "";
      newParams.y1 = "";
      newParams.z1 = "";
      newParams.x2 = "";
      newParams.y2 = "";
      newParams.z2 = "";
      setUnit("meters");
    } else if (type === "geodesic") {
      newParams.lat1 = "";
      newParams.lon1 = "";
      newParams.lat2 = "";
      newParams.lon2 = "";
      setUnit("kilometers");
    }
    setParams(newParams);
  };

  const calculateDistance = (calcType, params, unit) => {
    let distance = 0,
      formula = "";
    if (calcType === "2d") {
      const { x1, y1, x2, y2 } = params;
      if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) throw new Error("Invalid 2D coordinates");
      distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      formula = `d = √((${x2} - ${x1})^2 + (${y2} - ${y1})^2) = ${distance.toFixed(3)} meters`;
    } else if (calcType === "3d") {
      const { x1, y1, z1, x2, y2, z2 } = params;
      if (isNaN(x1) || isNaN(y1) || isNaN(z1) || isNaN(x2) || isNaN(y2) || isNaN(z2))
        throw new Error("Invalid 3D coordinates");
      distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
      formula = `d = √((${x2} - ${x1})^2 + (${y2} - ${y1})^2 + (${z2} - ${z1})^2) = ${distance.toFixed(
        3
      )} meters`;
    } else if (calcType === "geodesic") {
      const { lat1, lon1, lat2, lon2 } = params;
      if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2))
        throw new Error("Invalid latitude/longitude");
      if (lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90)
        throw new Error("Latitude must be between -90 and 90 degrees");
      if (lon1 < -180 || lon1 > 180 || lon2 < -180 || lon2 > 180)
        throw new Error("Longitude must be between -180 and 180 degrees");
      const R = 6371; // Earth's radius in km
      const phi1 = math.unit(lat1, "deg").toNumber("rad");
      const phi2 = math.unit(lat2, "deg").toNumber("rad");
      const deltaPhi = math.unit(lat2 - lat1, "deg").toNumber("rad");
      const deltaLambda = math.unit(lon2 - lon1, "deg").toNumber("rad");
      const a =
        Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distance = R * c; // Distance in km
      formula = `d = ${R} * 2 * atan2(√(sin²((${lat2}-${lat1})/2) + cos(${lat1})*cos(${lat2})*sin²((${lon2}-${lon1})/2)), √(1-a)) = ${distance.toFixed(
        3
      )} km`;
      distance *= conversionFactors.kilometers[unit] || 1;
    } else {
      throw new Error("Invalid calculation type");
    }
    if (calcType !== "geodesic") {
      distance *= conversionFactors.meters[unit] || 1;
    }
    return { distance, formula, params };
  };

  const calculateSampleSize = () => {
    clearMessages();
    try {
      const margin = parseFloat(marginError);
      const sd = parseFloat(sampleSD);
      const cl = parseFloat(confidenceLevel);
      if (isNaN(margin) || margin <= 0) throw new Error("Margin of error must be positive");
      if (isNaN(sd) || sd <= 0) throw new Error("Standard deviation must be positive");
      if (isNaN(cl) || cl <= 0 || cl >= 100) throw new Error("Confidence level must be between 0 and 100");
      const z = zScores[Math.round(cl)] || 1.96;
      const n = Math.ceil(((z * sd) / margin) ** 2);
      const formula = `n = (${z.toFixed(3)} * ${sd} / ${margin})^2 = ${n}`;
      const output = `<strong>Sample Size Calculation:</strong><br>Required Sample Size: ${n}<br>Formula: ${formula}<br>Unit: ${unit}`;
      setResults([{ text: output }]);
      saveToHistory(`Sample Size: E=${margin}, SD=${sd}, CL=${cl}%`, output.replace(/<br>/g, "; "));
      setSuccess("Sample size calculation completed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      showError(e.message || "Failed to calculate sample size");
    }
  };

  const calculate = async () => {
    clearMessages();
    clearVisualizations();
    try {
      let results = [];
      const isBatch = batchFile || batchText;
      if (!isBatch) {
        const result = calculateDistance(calcType, params, unit);
        results.push({ calcType, params, unit, result });
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
            if (calcType === "2d" && values.length >= 4) {
              batchParams.x1 = values[0];
              batchParams.y1 = values[1];
              batchParams.x2 = values[2];
              batchParams.y2 = values[3];
            } else if (calcType === "3d" && values.length >= 6) {
              batchParams.x1 = values[0];
              batchParams.y1 = values[1];
              batchParams.z1 = values[2];
              batchParams.x2 = values[3];
              batchParams.y2 = values[4];
              batchParams.z2 = values[5];
            } else if (calcType === "geodesic" && values.length >= 4) {
              batchParams.lat1 = values[0];
              batchParams.lon1 = values[1];
              batchParams.lat2 = values[2];
              batchParams.lon2 = values[3];
            } else {
              throw new Error(`Invalid batch entry for ${calcType}`);
            }
            const result = calculateDistance(calcType, batchParams, unit);
            results.push({ calcType, params: batchParams, unit, result });
          } catch (e) {
            console.warn(`Skipping invalid batch entry: ${e.message}`);
          }
        }
      }
      if (results.length === 0) throw new Error("No valid datasets found");
      displayResults(results, isBatch);
      updateVisualization(results);
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
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Parameters</th><th class="p-2">Distance</th><th class="p-2">Unit</th></tr></thead><tbody>';
      results.forEach((r) => {
        const params =
          r.calcType === "2d"
            ? `(${r.result.params.x1},${r.result.params.y1}) to (${r.result.params.x2},${r.result.params.y2})`
            : r.calcType === "3d"
            ? `(${r.result.params.x1},${r.result.params.y1},${r.result.params.z1}) to (${r.result.params.x2},${r.result.params.y2},${r.result.params.z2})`
            : `(${r.result.params.lat1},${r.result.params.lon1}) to (${r.result.params.lat2},${r.result.params.lon2})`;
        output += `<tr><td class="p-2">${params}</td><td class="p-2">${r.result.distance.toFixed(
          3
        )}</td><td class="p-2">${r.unit}</td></tr>`;
      });
      output += "</tbody></table>";
    } else {
      const r = results[0];
      const params =
        r.calcType === "2d"
          ? `(${r.result.params.x1},${r.result.params.y1}) to (${r.result.params.x2},${r.result.params.y2})`
          : r.calcType === "3d"
          ? `(${r.result.params.x1},${r.result.params.y1},${r.result.params.z1}) to (${r.result.params.x2},${r.result.params.y2},${r.result.params.z2})`
          : `(${r.result.params.lat1},${r.result.params.lon1}) to (${r.result.params.lat2},${r.result.params.lon2})`;
      output = `<strong>Distance (Type: ${r.calcType}, Unit: ${
        r.unit
      }):</strong><br>Points: ${params}<br>Distance: ${r.result.distance.toFixed(3)} ${r.unit}<br>Formula: ${
        r.result.formula
      }`;
    }
    setResults([{ text: output }]);
    saveToHistory(
      isBatch ? `Batch: ${results.length} pairs` : results[0].calcType,
      output.replace(/<[^>]+>/g, "; ").substring(0, 100) + "..."
    );
  };

  const updateVisualization = (results) => {
    const calcType = results[0].calcType;
    if (calcType === "geodesic") {
      updateMap(results);
    } else {
      updateDistancePlot(results);
    }
  };

  const updateDistancePlot = (results) => {
    if (chartInstance.current) chartInstance.current.destroy();
    const calcType = results[0].calcType;
    const datasets = results.map((r, i) => ({
      label: `Distance ${i + 1}`,
      data:
        calcType === "2d"
          ? [
              { x: r.result.params.x1, y: r.result.params.y1 },
              { x: r.result.params.x2, y: r.result.params.y2 },
            ]
          : [
              { x: r.result.params.x1, y: r.result.params.y1 },
              { x: r.result.params.x2, y: r.result.params.y2 },
            ],
      backgroundColor: "#ef4444",
      borderColor: "#b91c1c",
      borderWidth: 2,
      pointRadius: 5,
      showLine: true,
    }));
    chartInstance.current = new Chart(distanceChartRef.current, {
      type: "scatter",
      data: { datasets },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "X" } },
          y: { title: { display: true, text: calcType === "2d" ? "Y" : "Y (Z ignored)" } },
        },
        plugins: { title: { display: true, text: `${calcType.toUpperCase()} Distance Plot` } },
      },
    });
  };

  const updateMap = (results) => {
    if (mapInstance.current) {
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) mapInstance.current.removeLayer(layer);
      });
    }
    const markers = [];
    const latlngs = [];
    results.forEach((r) => {
      const { lat1, lon1, lat2, lon2 } = r.result.params;
      markers.push(L.marker([lat1, lon1]).bindPopup(`Point 1 (${lat1}, ${lon1})`));
      markers.push(L.marker([lat2, lon2]).bindPopup(`Point 2 (${lat2}, ${lon2})`));
      latlngs.push([lat1, lon1], [lat2, lon2]);
    });
    markers.forEach((marker) => marker.addTo(mapInstance.current));
    L.polyline(latlngs, { color: "#ef4444" }).addTo(mapInstance.current);
    const group = L.featureGroup(markers);
    mapInstance.current.fitBounds(group.getBounds());
  };

  const clearInputs = () => {
    clearMessages();
    updateInputFields(calcType);
    setMarginError("");
    setSampleSD("");
    setConfidenceLevel("95");
    setBatchText("");
    setBatchFile(null);
    setResults([]);
    clearVisualizations();
    setSuccess("Inputs cleared");
    setTimeout(() => setSuccess(""), 2000);
  };

  const clearVisualizations = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
    if (mapInstance.current) {
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) mapInstance.current.removeLayer(layer);
      });
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const showError = (message) => {
    setError(String(message || "An unexpected error occurred"));
    setTimeout(() => setError(""), 3000);
  };

  const saveCalculation = () => {
    if (results.length > 0) {
      saveToHistory("Manual Save", results[0].text.replace(/<[^>]+>/g, "; ").substring(0, 100) + "...");
      setSuccess("Calculation saved to history");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      showError("No results to save");
    }
  };

  const saveToHistory = (params, result) => {
    const updatedHistory = [...calculationHistory, { date: new Date().toLocaleString(), params, result }];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("distanceCalcHistory", JSON.stringify(updatedHistory));
  };

  const exportCSV = () => {
    const csv = [
      ["Date", "Parameters", "Result"],
      ...calculationHistory.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    downloadFile("distance_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("distance_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Distance Calculation History", 10, 10);
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
    doc.save("distance_history.pdf");
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
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-6xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Distance Calculator</h1>

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
                    Select the type of distance calculation.
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
                <option value="2d">2D Distance</option>
                <option value="3d">3D Distance</option>
                <option value="geodesic">Geodesic Distance (Lat/Lon)</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Unit
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Select the unit for distance output.
                  </span>
                </span>
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="p-3 border rounded-lg w-full"
              >
                {calcType === "geodesic" ? (
                  <>
                    <option value="kilometers">Kilometers</option>
                    <option value="miles">Miles</option>
                    <option value="nautical_miles">Nautical Miles</option>
                  </>
                ) : (
                  <>
                    <option value="meters">Meters</option>
                    <option value="kilometers">Kilometers</option>
                    <option value="miles">Miles</option>
                    <option value="feet">Feet</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Coordinates</h3>
            <div className="flex flex-wrap gap-4">
              {calcType === "2d" ? (
                <>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 1: X₁
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          X-coordinate of first point.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.x1 || ""}
                      onChange={(e) => setParams({ ...params, x1: e.target.value })}
                      placeholder="e.g., 1"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 1: Y₁
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Y-coordinate of first point.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.y1 || ""}
                      onChange={(e) => setParams({ ...params, y1: e.target.value })}
                      placeholder="e.g., 2"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 2: X₂
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          X-coordinate of second point.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.x2 || ""}
                      onChange={(e) => setParams({ ...params, x2: e.target.value })}
                      placeholder="e.g., 3"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 2: Y₂
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Y-coordinate of second point.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.y2 || ""}
                      onChange={(e) => setParams({ ...params, y2: e.target.value })}
                      placeholder="e.g., 4"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                </>
              ) : calcType === "3d" ? (
                <>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 1: X₁
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          X-coordinate of first point.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.x1 || ""}
                      onChange={(e) => setParams({ ...params, x1: e.target.value })}
                      placeholder="e.g., 1"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 1: Y₁
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Y-coordinate of first point.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.y1 || ""}
                      onChange={(e) => setParams({ ...params, y1: e.target.value })}
                      placeholder="e.g., 2"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 1: Z₁
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Z-coordinate of first point.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.z1 || ""}
                      onChange={(e) => setParams({ ...params, z1: e.target.value })}
                      placeholder="e.g., 0"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 2: X₂
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          X-coordinate of second point.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.x2 || ""}
                      onChange={(e) => setParams({ ...params, x2: e.target.value })}
                      placeholder="e.g., 3"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 2: Y₂
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Y-coordinate of second point.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.y2 || ""}
                      onChange={(e) => setParams({ ...params, y2: e.target.value })}
                      placeholder="e.g., 4"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 2: Z₂
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Z-coordinate of second point.
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.z2 || ""}
                      onChange={(e) => setParams({ ...params, z2: e.target.value })}
                      placeholder="e.g., 5"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                </>
              ) : calcType === "geodesic" ? (
                <>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 1: Latitude (φ₁)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Latitude in decimal degrees (-90 to 90).
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.lat1 || ""}
                      onChange={(e) => setParams({ ...params, lat1: e.target.value })}
                      placeholder="e.g., 40.7128"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 1: Longitude (λ₁)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Longitude in decimal degrees (-180 to 180).
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.lon1 || ""}
                      onChange={(e) => setParams({ ...params, lon1: e.target.value })}
                      placeholder="e.g., -74.0060"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 2: Latitude (φ₂)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Latitude in decimal degrees (-90 to 90).
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.lat2 || ""}
                      onChange={(e) => setParams({ ...params, lat2: e.target.value })}
                      placeholder="e.g., 51.5074"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Point 2: Longitude (λ₂)
                      <span className="relative group inline-block ml-1 cursor-pointer">
                        ?
                        <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                          Longitude in decimal degrees (-180 to 180).
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={params.lon2 || ""}
                      onChange={(e) => setParams({ ...params, lon2: e.target.value })}
                      placeholder="e.g., -0.1278"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Sample Size for Distance Surveys</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Margin of Error (in selected unit)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Desired margin of error for distance measurements.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={marginError}
                  onChange={(e) => setMarginError(e.target.value)}
                  placeholder="e.g., 10"
                  className="p-3 border rounded-lg w-full"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Standard Deviation (in selected unit)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Estimated variability in distance measurements.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={sampleSD}
                  onChange={(e) => setSampleSD(e.target.value)}
                  placeholder="e.g., 50"
                  className="p-3 border rounded-lg w-full"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Confidence Level (%)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Confidence level for sample size calculation.
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
              <div className="flex-1 min-w-[150px] flex items-end">
                <button onClick={calculateSampleSize} className="bg-red-500 text-white p-3 rounded-lg w-full">
                  Calculate Sample Size
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Batch Input (CSV File or Text: x1,y1,x2,y2 for 2D; x1,y1,z1,x2,y2,z2 for 3D; lat1,lon1,lat2,lon2
              for geodesic)
              <span className="relative group inline-block ml-1 cursor-pointer">
                ?
                <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  Upload CSV or enter coordinate pairs (e.g., 1,2,3,4).
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
              placeholder="e.g., 1,2,3,4;0,0,5,5"
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
            <button onClick={saveCalculation} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Save Calculation
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Distance Calculations
          </button>

          {results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: results[0].text }} />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Distance Visualization</h3>
                <canvas
                  ref={distanceChartRef}
                  className={`max-w-[600px] h-80 mx-auto ${calcType !== "geodesic" ? "" : "hidden"}`}
                />
                <div
                  ref={mapRef}
                  className={`max-w-[600px] h-80 mx-auto ${calcType === "geodesic" ? "" : "hidden"}`}
                />
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
                <h2 className="text-xl font-semibold mb-4">Understanding Distance Calculations</h2>
                <p className="mb-4">
                  Distance calculations measure the shortest path between two points in various contexts, from
                  Euclidean spaces to Earth's surface.
                </p>
                <h3 className="text-md font-medium mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>2D Distance:</strong> Euclidean distance in a plane between (x₁, y₁) and (x₂, y₂).
                  </li>
                  <li>
                    <strong>3D Distance:</strong> Euclidean distance in 3D space between (x₁, y₁, z₁) and (x₂,
                    y₂, z₂).
                  </li>
                  <li>
                    <strong>Geodesic Distance:</strong> Great-circle distance on Earth's surface between two
                    latitude-longitude points.
                  </li>
                  <li>
                    <strong>Haversine Formula:</strong> Accounts for Earth's curvature in geodesic
                    calculations.
                  </li>
                  <li>
                    <strong>Unit Conversion:</strong> Convert distances between meters, kilometers, miles,
                    feet, or nautical miles.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Formulas</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>2D Distance:</strong> d = √((x₂ - x₁)² + (y₂ - y₁)²)
                  </li>
                  <li>
                    <strong>3D Distance:</strong> d = √((x₂ - x₁)² + (y₂ - y₁)² + (z₂ - z₁)²)
                  </li>
                  <li>
                    <strong>Geodesic Distance (Haversine):</strong>
                    <br />
                    a = sin²(Δφ/2) + cos(φ₁) · cos(φ₂) · sin²(Δλ/2)
                    <br />
                    c = 2 · atan2(√a, √(1-a))
                    <br />d = R · c, R = 6371 km
                  </li>
                  <li>
                    <strong>Sample Size:</strong> n = (zα/2 · σ/E)²
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Navigation:</strong> Calculate distances for aviation or maritime routes.
                  </li>
                  <li>
                    <strong>Surveying:</strong> Measure distances in construction or land planning.
                  </li>
                  <li>
                    <strong>GIS:</strong> Analyze geographic data for urban planning or logistics.
                  </li>
                  <li>
                    <strong>Physics:</strong> Compute distances in 3D space for simulations.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Ensure coordinates are in the correct format (decimal degrees for lat/lon).</li>
                  <li>Use batch input for multiple calculations (e.g., "1,2,3,4" for 2D).</li>
                  <li>Check unit consistency for sample size calculations.</li>
                  <li>
                    Geodesic calculations assume a spherical Earth; for higher precision, consider ellipsoidal
                    models.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Resources</h3>
                <p className="mb-4">For more information, visit:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <a
                      href="https://www.movable-type.co.uk/scripts/latlong.html"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Haversine Formula Explained
                    </a>
                  </li>
                  <li>
                    <a href="https://leafletjs.com/" target="_blank" className="text-red-500 hover:underline">
                      Leaflet: Interactive Maps
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
