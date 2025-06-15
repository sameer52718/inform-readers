"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [calcType, setCalcType] = useState("sample-size");
  const [precision, setPrecision] = useState("2");
  const [population, setPopulation] = useState("");
  const [confidence, setConfidence] = useState("");
  const [margin, setMargin] = useState("");
  const [proportion, setProportion] = useState("");
  const [sampleSize, setSampleSize] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [batchText, setBatchText] = useState("");
  const [variation, setVariation] = useState("");
  const [compareText, setCompareText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const lastResults = useRef([]);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("sampleSizeCalcHistory");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(
            parsed.filter(
              (entry) =>
                entry &&
                typeof entry.date === "string" &&
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
      if (lineChartInstance.current) lineChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
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

  const calculateSampleSize = (calcType, params, precision) => {
    const zScores = { 90: 1.645, 95: 1.96, 99: 2.576 };
    const confidence = params.confidence / 100;
    const z = zScores[params.confidence] || 1.96;
    const proportion = (params.proportion || 50) / 100;

    let result = null,
      formula = "";
    if (calcType === "sample-size") {
      const { population, margin } = params;
      const marginDecimal = margin / 100;
      if (margin <= 0 || margin >= 100) throw new Error("Margin of error must be between 0 and 100");
      if (proportion < 0 || proportion > 1) throw new Error("Proportion must be between 0 and 100");
      if (confidence <= 0 || confidence >= 100) throw new Error("Confidence level must be between 0 and 100");
      if (population && population <= 0) throw new Error("Population size must be positive");

      const n0 = (z * z * proportion * (1 - proportion)) / (marginDecimal * marginDecimal);
      result = population ? (n0 * population) / (n0 + (population - 1)) : n0;
      result = Math.ceil(result);
      formula = population
        ? `n = ceil((${z}^2 * ${proportion} * (1-${proportion}) * ${population}) / ((${z}^2 * ${proportion} * (1-${proportion})) + (${marginDecimal}^2 * (${population}-1)))) = ${result}`
        : `n = ceil((${z}^2 * ${proportion} * (1-${proportion})) / ${marginDecimal}^2) = ${result}`;
    } else if (calcType === "margin-error") {
      const { sampleSize } = params;
      if (sampleSize <= 0) throw new Error("Sample size must be positive");
      if (proportion < 0 || proportion > 1) throw new Error("Proportion must be between 0 and 100");
      if (confidence <= 0 || confidence >= 100) throw new Error("Confidence level must be between 0 and 100");

      result = z * Math.sqrt((proportion * (1 - proportion)) / sampleSize) * 100;
      formula = `E = ${z} * sqrt(${proportion} * (1-${proportion}) / ${sampleSize}) * 100 = ${result.toFixed(
        precision
      )}%`;
    } else if (calcType === "confidence-interval") {
      const { sampleSize } = params;
      if (sampleSize <= 0) throw new Error("Sample size must be positive");
      if (proportion < 0 || proportion > 1) throw new Error("Proportion must be between 0 and 100");
      if (confidence <= 0 || confidence >= 100) throw new Error("Confidence level must be between 0 and 100");

      const marginError = z * Math.sqrt((proportion * (1 - proportion)) / sampleSize);
      const lower = Math.max(0, proportion - marginError) * 100;
      const upper = Math.min(1, proportion + marginError) * 100;
      result = { lower, upper };
      formula = `${
        proportion * 100
      }% ± ${z} * sqrt(${proportion} * (1-${proportion}) / ${sampleSize}) = [${lower.toFixed(
        precision
      )}%, ${upper.toFixed(precision)}%]`;
    } else {
      throw new Error("Invalid calculation type");
    }

    return {
      result,
      formula,
      visualizationData: generateVisualizationData(calcType, params),
    };
  };

  const generateVisualizationData = (calcType, params) => {
    const data = [];
    const zScores = { 90: 1.645, 95: 1.96, 99: 2.576 };
    const z = zScores[params.confidence] || 1.96;
    const proportion = (params.proportion || 50) / 100;

    if (calcType === "sample-size") {
      for (let margin = 1; margin <= 10; margin += 0.5) {
        const marginDecimal = margin / 100;
        const n0 = (z * z * proportion * (1 - proportion)) / (marginDecimal * marginDecimal);
        const sampleSize = params.population ? (n0 * params.population) / (n0 + (params.population - 1)) : n0;
        data.push({ x: margin, y: Math.ceil(sampleSize) });
      }
    } else if (calcType === "margin-error") {
      for (let sampleSize = 100; sampleSize <= 1000; sampleSize += 50) {
        const marginError = z * Math.sqrt((proportion * (1 - proportion)) / sampleSize) * 100;
        data.push({ x: sampleSize, y: marginError });
      }
    } else if (calcType === "confidence-interval") {
      for (let sampleSize = 100; sampleSize <= 1000; sampleSize += 50) {
        const marginError = z * Math.sqrt((proportion * (1 - proportion)) / sampleSize);
        const upper = Math.min(1, proportion + marginError) * 100;
        data.push({ x: sampleSize, y: upper });
      }
    }
    return data;
  };

  const calculate = async () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision) || 2;
      if (isNaN(precisionVal) || precisionVal < 0)
        throw new Error("Precision must be a non-negative integer");
      if (!["sample-size", "margin-error", "confidence-interval"].includes(calcType))
        throw new Error("Invalid calculation type");

      const isBatch = batchFile || batchText.trim();
      let results = [];

      if (!isBatch) {
        let params = {};
        if (calcType === "sample-size") {
          params = {
            population: population ? parseFloat(population) : null,
            confidence: parseFloat(confidence),
            margin: parseFloat(margin),
            proportion: parseFloat(proportion),
          };
          if (isNaN(params.confidence) || isNaN(params.margin) || isNaN(params.proportion))
            throw new Error("All parameters are required");
        } else {
          params = {
            sampleSize: parseFloat(sampleSize),
            confidence: parseFloat(confidence),
            proportion: parseFloat(proportion),
          };
          if (isNaN(params.sampleSize) || isNaN(params.confidence) || isNaN(params.proportion))
            throw new Error("All parameters are required");
        }
        const result = calculateSampleSize(calcType, params, precisionVal);
        results.push({ calcType, params, result });
        displayResults(results, false);
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
        }
        await processBatch(datasets, results, calcType, precisionVal);
        if (results.length === 0) throw new Error("No valid datasets found in batch input");
        displayResults(results, true);
      }
      showSuccess("Calculation completed successfully");
    } catch (e) {
      console.error("Calculation error:", e);
      showError(e.message || "Invalid input");
    }
  };

  const processBatch = async (datasets, results, calcType, precision) => {
    for (const dataset of datasets) {
      try {
        const params = dataset.split(",").map((s) => s.trim());
        let parsedParams = {};
        if (calcType === "sample-size") {
          if (params.length !== 4) throw new Error("Sample size calculation requires four values");
          parsedParams = {
            population: params[0] ? parseFloat(params[0]) : null,
            confidence: parseFloat(params[1]),
            margin: parseFloat(params[2]),
            proportion: parseFloat(params[3]),
          };
        } else {
          if (params.length !== 3)
            throw new Error(
              `${
                calcType === "margin-error" ? "Margin of error" : "Confidence interval"
              } calculation requires three values`
            );
          parsedParams = {
            sampleSize: parseFloat(params[0]),
            confidence: parseFloat(params[1]),
            proportion: parseFloat(params[2]),
          };
        }
        if (Object.values(parsedParams).some((v) => v !== null && isNaN(v)))
          throw new Error("Invalid batch parameters");
        const result = calculateSampleSize(calcType, parsedParams, precision);
        results.push({ calcType, params: parsedParams, result });
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const displayResults = (results, isBatch) => {
    let output = [];
    if (isBatch) {
      output.push(
        <table key="batch-table" className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Parameters</th>
              <th className="p-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const params =
                r.calcType === "sample-size"
                  ? `N=${r.params.population || "∞"}, CL=${r.params.confidence}%, E=${r.params.margin}%, p=${
                      r.params.proportion
                    }%`
                  : `n=${r.params.sampleSize}, CL=${r.params.confidence}%, p=${r.params.proportion}%`;
              const resultText =
                r.calcType === "confidence-interval"
                  ? `CI: [${r.result.result.lower.toFixed(
                      parseInt(precision)
                    )}%, ${r.result.result.upper.toFixed(parseInt(precision))}%]`
                  : r.calcType === "sample-size"
                  ? `Sample Size: ${r.result.result}`
                  : `Margin of Error: ${r.result.result.toFixed(parseInt(precision))}%`;
              return (
                <tr key={i}>
                  <td className="p-2">{params}</td>
                  <td className="p-2">
                    {resultText}
                    <br />
                    Formula: {r.result.formula}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    } else {
      const r = results[0];
      output.push(
        <div key="single-result">
          <strong>
            Results (Type: {r.calcType}, Precision: {precision}):
          </strong>
          <br />
          {r.calcType === "confidence-interval"
            ? `Confidence Interval: [${r.result.result.lower.toFixed(
                parseInt(precision)
              )}%, ${r.result.result.upper.toFixed(parseInt(precision))}%]<br />`
            : r.calcType === "sample-size"
            ? `Sample Size: ${r.result.result}<br />`
            : `Margin of Error: ${r.result.result.toFixed(parseInt(precision))}%<br />`}
          Formula: {r.result.formula}
        </div>
      );
    }

    setResults(output);
    setShowResults(true);
    const params = isBatch
      ? `Batch: ${results.length} calculations, Type: ${results[0].calcType}`
      : results[0].calcType === "sample-size"
      ? `N=${results[0].params.population || "∞"}, CL=${results[0].params.confidence}%, E=${
          results[0].params.margin
        }%, p=${results[0].params.proportion}%`
      : `n=${results[0].params.sampleSize}, CL=${results[0].params.confidence}%, p=${results[0].params.proportion}%`;
    saveToHistory(
      params,
      output
        .map((o) => (typeof o === "string" ? o : o.props.children))
        .join("; ")
        .substring(0, 100) + "..."
    );
    lastResults.current = results;
    updateVisualizations(results, isBatch);
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision);
      const variationVal = parseFloat(variation);
      if (isNaN(precisionVal) || precisionVal < 0)
        throw new Error("Precision must be a non-negative integer");
      if (isNaN(variationVal)) throw new Error("Variation value is required");

      let params = {};
      if (calcType === "sample-size") {
        params = {
          population: population ? parseFloat(population) : null,
          confidence: parseFloat(confidence),
          margin: parseFloat(margin),
          proportion: parseFloat(proportion),
        };
        if (isNaN(params.confidence) || isNaN(params.margin) || isNaN(params.proportion))
          throw new Error("All parameters are required");
      } else {
        params = {
          sampleSize: parseFloat(sampleSize),
          confidence: parseFloat(confidence),
          proportion: parseFloat(proportion),
        };
        if (isNaN(params.sampleSize) || isNaN(params.confidence) || isNaN(params.proportion))
          throw new Error("All parameters are required");
      }

      const results = [];
      const variations = [
        { label: "Original", params },
        {
          label: "Confidence + Variation",
          params: { ...params, confidence: params.confidence + variationVal },
        },
        calcType === "sample-size"
          ? { label: "Margin + Variation", params: { ...params, margin: params.margin + variationVal } }
          : { label: "No Margin Variation", params },
        {
          label: "Proportion + Variation",
          params: { ...params, proportion: params.proportion + variationVal },
        },
      ];

      for (const v of variations) {
        try {
          const result = calculateSampleSize(calcType, v.params, precisionVal);
          results.push({ ...v, result, calcType });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      const output = [
        <div key="sensitivity">
          <strong>Sensitivity Analysis (Variation: {variation}):</strong>
          <br />
          {results.map((r, i) => (
            <div key={i}>
              {r.label}:<br />
              {r.calcType === "confidence-interval"
                ? `CI: [${r.result.result.lower.toFixed(precisionVal)}%, ${r.result.result.upper.toFixed(
                    precisionVal
                  )}%]<br />`
                : r.calcType === "sample-size"
                ? `Sample Size: ${r.result.result}<br />`
                : `Margin of Error: ${r.result.result.toFixed(precisionVal)}%<br />`}
              Formula: {r.result.formula}
              <br />
              <br />
            </div>
          ))}
        </div>,
      ];

      setResults(output);
      setShowResults(true);
      saveToHistory(
        `Sensitivity (Variation: ${variation})`,
        output
          .map((o) => o.props.children)
          .join("; ")
          .substring(0, 100) + "..."
      );
      updateSensitivityChart(results);
      showSuccess("Sensitivity analysis completed");
    } catch (e) {
      console.error("Sensitivity error:", e);
      showError(e.message || "Invalid sensitivity input");
    }
  };

  const compareParameters = () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision);
      if (isNaN(precisionVal) || precisionVal < 0)
        throw new Error("Precision must be a non-negative integer");
      if (!compareText.trim()) throw new Error("Comparison input is required");

      const datasets = compareText
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s && s.includes(","));
      if (datasets.length === 0) throw new Error("No valid datasets provided");

      const results = [];
      for (const dataset of datasets) {
        try {
          const params = dataset.split(",").map((s) => s.trim());
          let parsedParams = {};
          if (calcType === "sample-size") {
            if (params.length !== 4) throw new Error("Sample size comparison requires four values");
            parsedParams = {
              population: params[0] ? parseFloat(params[0]) : null,
              confidence: parseFloat(params[1]),
              margin: parseFloat(params[2]),
              proportion: parseFloat(params[3]),
            };
          } else {
            if (params.length !== 3)
              throw new Error(
                `${
                  calcType === "margin-error" ? "Margin of error" : "Confidence interval"
                } comparison requires three values`
              );
            parsedParams = {
              sampleSize: parseFloat(params[0]),
              confidence: parseFloat(params[1]),
              proportion: parseFloat(params[2]),
            };
          }
          if (Object.values(parsedParams).some((v) => v !== null && isNaN(v)))
            throw new Error("Invalid comparison parameters");
          const result = calculateSampleSize(calcType, parsedParams, precisionVal);
          results.push({ calcType, params: parsedParams, result, dataset });
        } catch (e) {
          console.warn(`Skipping invalid comparison entry: ${e.message}`);
        }
      }

      if (results.length === 0) throw new Error("No valid parameter sets to compare");

      const output = [
        <table key="comparison-table" className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Parameters</th>
              <th className="p-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const params =
                r.calcType === "sample-size"
                  ? `N=${r.params.population || "∞"}, CL=${r.params.confidence}%, E=${r.params.margin}%, p=${
                      r.params.proportion
                    }%`
                  : `n=${r.params.sampleSize}, CL=${r.params.confidence}%, p=${r.params.proportion}%`;
              const resultText =
                r.calcType === "confidence-interval"
                  ? `CI: [${r.result.result.lower.toFixed(precisionVal)}%, ${r.result.result.upper.toFixed(
                      precisionVal
                    )}%]`
                  : r.calcType === "sample-size"
                  ? `Sample Size: ${r.result.result}`
                  : `Margin of Error: ${r.result.result.toFixed(precisionVal)}%`;
              return (
                <tr key={i}>
                  <td className="p-2">{params}</td>
                  <td className="p-2">
                    {resultText}
                    <br />
                    Formula: {r.result.formula}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>,
      ];

      setResults(output);
      setShowResults(true);
      saveToHistory(
        `Comparison: ${results.length} parameter sets`,
        output
          .map((o) => o.props.children)
          .join("; ")
          .substring(0, 100) + "..."
      );
      updateComparisonChart(results);
      showSuccess("Parameter comparison completed");
    } catch (e) {
      console.error("Compare parameters error:", e);
      showError(e.message || "Invalid comparison input");
    }
  };

  const updateVisualizations = (results, isBatch) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();
    const svg = document.getElementById("sample-visual");
    if (svg) {
      svg.innerHTML = "";
      if (!isBatch && results.length === 1 && results[0].result.visualizationData.length > 0) {
        drawSampleVisualization(results[0].result.visualizationData, svg);
      } else {
        svg.innerHTML =
          '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single calculation</text>';
      }
    }
    updateLineChart(results);
    updateBarChart(results);
  };

  const drawSampleVisualization = (data, svg) => {
    const width = 500;
    const height = 200;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    if (!data || data.length === 0) {
      svg.innerHTML = '<text x="10" y="50" fill="#000" font-size="14">No data to visualize</text>';
      return;
    }

    const xMin = Math.min(...data.map((d) => d.x));
    const xMax = Math.max(...data.map((d) => d.x));
    const yMin = Math.min(...data.map((d) => d.y));
    const yMax = Math.max(...data.map((d) => d.y));
    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;
    const scaleX = (width - 60) / xRange;
    const scaleY = (height - 60) / yRange;
    const offsetX = 30;
    const offsetY = height - 30;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = data
      .map(
        (point, i) =>
          `${i === 0 ? "M" : "L"} ${((point.x - xMin) * scaleX + offsetX).toFixed(2)},${(
            offsetY -
            (point.y - yMin) * scaleY
          ).toFixed(2)}`
      )
      .join(" ");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#ef4444");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);

    data.forEach((point, i) => {
      if (i % 5 === 0) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", (point.x - xMin) * scaleX + offsetX);
        circle.setAttribute("cy", offsetY - (point.y - yMin) * scaleY);
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", "#10b981");
        svg.appendChild(circle);
      }
    });
  };

  const updateLineChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (lineChartRef.current && results.some((r) => r.result.visualizationData.length > 0)) {
      const datasets = results.map((r, i) => ({
        label: `Calculation ${i + 1}`,
        data: r.result.visualizationData.map((d) => d.y),
        borderColor: ["#ef4444", "#10b981", "#3b82f6"][i % 3],
        fill: false,
      }));
      lineChartInstance.current = new window.Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: results[0].result.visualizationData.map((d) => d.x.toFixed(1)),
          datasets,
        },
        options: {
          responsive: true,
          scales: {
            y: {
              title: {
                display: true,
                text: results[0].calcType === "sample-size" ? "Sample Size" : "Margin of Error (%)",
              },
            },
            x: {
              title: {
                display: true,
                text: results[0].calcType === "sample-size" ? "Margin of Error (%)" : "Sample Size",
              },
            },
          },
          plugins: {
            title: { display: true, text: "Margin of Error vs. Sample Size" },
          },
        },
      });
    }
  };

  const updateBarChart = (results) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (barChartRef.current) {
      const values = results
        .map((r) =>
          r.calcType === "confidence-interval"
            ? r.result.result.upper - r.result.result.lower
            : r.result.result
        )
        .filter((v) => v !== null);
      if (values.length === 0) return;
      const freq = {};
      values.forEach((v) => {
        const rounded = Math.round(v * 100) / 100;
        freq[rounded] = (freq[rounded] || 0) + 1;
      });
      const labels = Object.keys(freq).sort((a, b) => a - b);
      const data = labels.map((l) => freq[l]);
      barChartInstance.current = new window.Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Frequency",
              data,
              backgroundColor: "#ef4444",
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Frequency" }, beginAtZero: true },
            x: {
              title: {
                display: true,
                text:
                  results[0].calcType === "confidence-interval"
                    ? "CI Width (%)"
                    : results[0].calcType === "sample-size"
                    ? "Sample Size"
                    : "Margin of Error (%)",
              },
            },
          },
          plugins: {
            title: { display: true, text: "Result Distribution" },
          },
        },
      });
    }
  };

  const updateSensitivityChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (lineChartRef.current && results.some((r) => r.result.visualizationData.length > 0)) {
      const datasets = results.map((r, i) => ({
        label: r.label,
        data: r.result.visualizationData.map((d) => d.y),
        borderColor: ["#ef4444", "#10b981", "#3b82f6"][i % 3],
        fill: false,
      }));
      lineChartInstance.current = new window.Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: results[0].result.visualizationData.map((d) => d.x.toFixed(1)),
          datasets,
        },
        options: {
          responsive: true,
          scales: {
            y: {
              title: {
                display: true,
                text: results[0].calcType === "sample-size" ? "Sample Size" : "Margin of Error (%)",
              },
            },
            x: {
              title: {
                display: true,
                text: results[0].calcType === "sample-size" ? "Margin of Error (%)" : "Sample Size",
              },
            },
          },
          plugins: {
            title: { display: true, text: "Sensitivity Analysis" },
          },
        },
      });
    }
  };

  const updateComparisonChart = (results) => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (lineChartRef.current && results.some((r) => r.result.visualizationData.length > 0)) {
      const datasets = results.map((r, i) => ({
        label: r.dataset,
        data: r.result.visualizationData.map((d) => d.y),
        borderColor: ["#ef4444", "#10b981", "#3b82f6", "#f59e0b", "#6b7280"][i % 5],
        fill: false,
      }));
      lineChartInstance.current = new window.Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: results[0].result.visualizationData.map((d) => d.x.toFixed(1)),
          datasets,
        },
        options: {
          responsive: true,
          scales: {
            y: {
              title: {
                display: true,
                text: results[0].calcType === "sample-size" ? "Sample Size" : "Margin of Error (%)",
              },
            },
            x: {
              title: {
                display: true,
                text: results[0].calcType === "sample-size" ? "Margin of Error (%)" : "Sample Size",
              },
            },
          },
          plugins: {
            title: { display: true, text: "Parameter Comparison" },
          },
        },
      });
    }
  };

  const clearInputs = () => {
    clearMessages();
    setPopulation("");
    setConfidence("");
    setMargin("");
    setProportion("");
    setSampleSize("");
    setBatchFile(null);
    setBatchText("");
    setVariation("");
    setCompareText("");
    setPrecision("2");
    setShowResults(false);
    setResults([]);
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();
    const svg = document.getElementById("sample-visual");
    if (svg) svg.innerHTML = "";
    showSuccess("Inputs cleared!");
  };

  const saveToHistory = (params, result) => {
    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        params: String(params || ""),
        result: String(result || ""),
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("sampleSizeCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_size_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_size_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Sample Size Calculation History", 10, 10);
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
    doc.save("sample_size_history.pdf");
  };

  const renderInputFields = () => {
    if (calcType === "sample-size") {
      return (
        <>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Population Size
              <span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                Total population size (leave blank if unknown).
              </span>
            </label>
            <input
              type="number"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 10000"
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Confidence Level (%)
              <span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                Confidence level (e.g., 95 for 95%).
              </span>
            </label>
            <input
              type="number"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 95"
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Margin of Error (%)
              <span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                Desired margin of error (e.g., 5 for ±5%).
              </span>
            </label>
            <input
              type="number"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 5"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Proportion (%)
              <span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                Expected proportion (e.g., 50 for 50%).
              </span>
            </label>
            <input
              type="number"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 50"
              value={proportion}
              onChange={(e) => setProportion(e.target.value)}
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Sample Size
              <span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                Number of respondents in the sample.
              </span>
            </label>
            <input
              type="number"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 384"
              value={sampleSize}
              onChange={(e) => setSampleSize(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Confidence Level (%)
              <span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                Confidence level (e.g., 95 for 95%).
              </span>
            </label>
            <input
              type="number"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 95"
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
              Proportion (%)
              <span className="ml-1 cursor-pointer">?</span>
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                {calcType === "confidence-interval" ? "Observed proportion in sample" : "Sample proportion"}{" "}
                (e.g., 50 for 50%).
              </span>
            </label>
            <input
              type="number"
              className="p-3 border rounded-lg w-full bg-gray-200"
              placeholder="e.g., 50"
              value={proportion}
              onChange={(e) => setProportion(e.target.value)}
            />
          </div>
        </>
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">
            Advanced Sample Size Calculator
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
                    Select the type of calculation.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                >
                  <option value="sample-size">Sample Size</option>
                  <option value="margin-error">Margin of Error</option>
                  <option value="confidence-interval">Confidence Interval</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Precision (Decimal Places)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Number of decimal places for output.
                  </span>
                </label>
                <input
                  type="number"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 2"
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Parameters</h3>
              <div className="flex flex-wrap gap-4">{renderInputFields()}</div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: population,confidence,margin,proportion;...)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter sets (e.g., 10000,95,5,50;5000,90,3,40).
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
                placeholder="e.g., 10000,95,5,50;5000,90,3,40"
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
              {showAdvanced ? "Hide" : "Show"} Advanced Features
            </button>
          </div>
          {showAdvanced && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Variation Value
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Value to vary confidence, margin, or proportion for sensitivity analysis.
                  </span>
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 1"
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Compare Parameter Sets (CSV: population,confidence,margin,proportion;...)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter parameter sets to compare (e.g., 10000,95,5,50;5000,90,3,40).
                  </span>
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  rows="4"
                  placeholder="e.g., 10000,95,5,50;5000,90,3,40"
                  value={compareText}
                  onChange={(e) => setCompareText(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={compareParameters}
                >
                  Compare Parameters
                </button>
              </div>
            </div>
          )}
          {showResults && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div className="text-gray-600 mb-4">{results}</div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Sample Size Curve</h3>
                <svg id="sample-visual" className="w-full max-w-[500px] h-[200px] block mx-auto"></svg>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Margin of Error vs. Sample Size</h3>
                <canvas ref={lineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Result Distribution</h3>
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
                      history.map((entry, i) => (
                        <tr key={i}>
                          <td className="p-2">{entry.date}</td>
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
