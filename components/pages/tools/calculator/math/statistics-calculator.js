"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [calcType, setCalcType] = useState("descriptive");
  const [precision, setPrecision] = useState("2");
  const [dataInput, setDataInput] = useState("");
  const [data2Input, setData2Input] = useState("");
  const [confidence, setConfidence] = useState("");
  const [popMean, setPopMean] = useState("");
  const [popStd, setPopStd] = useState("");
  const [xValue, setXValue] = useState("");
  const [df, setDf] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [batchText, setBatchText] = useState("");
  const [outlierMethod, setOutlierMethod] = useState("iqr");
  const [variation, setVariation] = useState("");
  const [compareText, setCompareText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const histogramRef = useRef(null);
  const boxPlotRef = useRef(null);
  const histogramInstance = useRef(null);
  const boxPlotInstance = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("statsCalcHistory");
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
      if (histogramInstance.current) histogramInstance.current.destroy();
      if (boxPlotInstance.current) boxPlotInstance.current.destroy();
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

  const updateInputFields = () => {
    // Handled by conditional rendering in JSX
  };

  const calculateSkewness = (data, mean, std) => {
    const n = data.length;
    const sumCubed = data.reduce((sum, x) => sum + Math.pow(x - mean, 3), 0);
    return sumCubed / n / Math.pow(std, 3);
  };

  const calculateKurtosis = (data, mean, std) => {
    const n = data.length;
    const sumFourth = data.reduce((sum, x) => sum + Math.pow(x - mean, 4), 0);
    return sumFourth / n / Math.pow(std, 4) - 3;
  };

  const calculateCorrelation = (x, y) => {
    const meanX = window.math.mean(x);
    const meanY = window.math.mean(y);
    const n = x.length;
    const num = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
    const denX = Math.sqrt(x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0));
    const denY = Math.sqrt(y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0));
    return num / (denX * denY);
  };

  const calculateRegression = (x, y) => {
    const meanX = window.math.mean(x);
    const meanY = window.math.mean(y);
    const num = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
    const den = x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0);
    const slope = num / den;
    const intercept = meanY - slope * meanX;
    return { slope, intercept };
  };

  const calculateNormalProb = (z) => {
    return 0.5 * (1 + window.math.erf(z / Math.sqrt(2)));
  };

  const calculateTProb = (t, df) => {
    return 0.5 + t / Math.sqrt(df) / (1 + (t * t) / df);
  };

  const calculateTTestPValue = (t, df) => {
    return 2 * (1 - calculateTProb(Math.abs(t), df));
  };

  const calculateZTestPValue = (z) => {
    return 2 * (1 - calculateNormalProb(Math.abs(z)));
  };

  const calculateStatistics = (calcType, data, data2, params, precision) => {
    data = data.map(Number).filter((n) => !isNaN(n));
    if (data.length === 0) throw new Error("No valid data provided");

    let result = {},
      formula = "";
    if (calcType === "descriptive") {
      const mean = window.math.mean(data);
      const median = window.math.median(data);
      const mode =
        window.math.mode(data).length === data.length ? "No mode" : window.math.mode(data).join(", ");
      const variance = window.math.variance(data);
      const std = window.math.std(data);
      const min = Math.min(...data);
      const max = Math.max(...data);
      const midrange = (min + max) / 2;
      const cv = (std / mean) * 100;
      const quartiles = window.math.quantileSeq(data, [0.25, 0.5, 0.75]);
      const iqr = quartiles[2] - quartiles[0];
      const skewness = calculateSkewness(data, mean, std);
      const kurtosis = calculateKurtosis(data, mean, std);

      result = {
        count: data.length,
        mean,
        median,
        mode,
        variance,
        std,
        cv,
        min,
        max,
        midrange,
        q1: quartiles[0],
        q2: quartiles[1],
        q3: quartiles[2],
        iqr,
        skewness,
        kurtosis,
      };
      formula = `Mean: sum(x_i)/n = ${mean.toFixed(
        precision
      )}\nVariance: sum((x_i - mean)^2)/n = ${variance.toFixed(precision)}`;
    } else if (calcType === "confidence-interval") {
      const confidence = params.confidence / 100;
      const z = { 90: 1.645, 95: 1.96, 99: 2.576 }[params.confidence] || 1.96;
      const mean = window.math.mean(data);
      const std = window.math.std(data);
      const n = data.length;
      const margin = z * (std / Math.sqrt(n));
      result = { lower: mean - margin, upper: mean + margin };
      formula = `CI: ${mean.toFixed(precision)} ± ${z} * (${std.toFixed(
        precision
      )} / sqrt(${n})) = [${result.lower.toFixed(precision)}, ${result.upper.toFixed(precision)}]`;
    } else if (calcType === "t-test") {
      const mean = window.math.mean(data);
      const std = window.math.std(data);
      const n = data.length;
      const t = (mean - params.popMean) / (std / Math.sqrt(n));
      const df = n - 1;
      result = { t, df, pValue: calculateTTestPValue(t, df) };
      formula = `t = (${mean.toFixed(precision)} - ${params.popMean}) / (${std.toFixed(
        precision
      )} / sqrt(${n})) = ${t.toFixed(precision)}`;
    } else if (calcType === "z-test") {
      const mean = window.math.mean(data);
      const n = data.length;
      const z = (mean - params.popMean) / (params.popStd / Math.sqrt(n));
      result = { z, pValue: calculateZTestPValue(z) };
      formula = `z = (${mean.toFixed(precision)} - ${params.popMean}) / (${
        params.popStd
      } / sqrt(${n})) = ${z.toFixed(precision)}`;
    } else if (calcType === "normal-dist") {
      const mean = window.math.mean(data);
      const std = window.math.std(data);
      const z = (params.xValue - mean) / std;
      const prob = calculateNormalProb(z);
      result = { z, probability: prob };
      formula = `P(X ≤ ${params.xValue}) = P(Z ≤ (${params.xValue} - ${mean.toFixed(
        precision
      )}) / ${std.toFixed(precision)}) = ${prob.toFixed(precision)}`;
    } else if (calcType === "t-dist") {
      const t = params.xValue;
      const df = params.df;
      const prob = calculateTProb(t, df);
      result = { t, df, probability: prob };
      formula = `P(T ≤ ${t}) with df=${df} = ${prob.toFixed(precision)}`;
    } else if (["correlation", "regression"].includes(calcType)) {
      if (!data2 || data2.length !== data.length)
        throw new Error("Second dataset must match first dataset length");
      data2 = data2.map(Number).filter((n) => !isNaN(n));
      const correlation = calculateCorrelation(data, data2);
      result = { correlation };
      formula = `r = sum((x_i - x̄)(y_i - ȳ)) / sqrt(sum(x_i - x̄)^2 * sum(y_i - ȳ)^2) = ${correlation.toFixed(
        precision
      )}`;
      if (calcType === "regression") {
        const regression = calculateRegression(data, data2);
        result = { ...result, slope: regression.slope, intercept: regression.intercept };
        formula += `\ny = ${regression.slope.toFixed(precision)}x + ${regression.intercept.toFixed(
          precision
        )}`;
      }
    } else {
      throw new Error("Invalid calculation type");
    }

    const visData = [];
    if (["correlation", "regression"].includes(calcType)) {
      data.forEach((x, i) => visData.push({ x, y: data2[i] }));
    } else {
      data.forEach((x, i) => visData.push({ x: i + 1, y: x }));
    }

    return { result, formula, visualizationData: visData };
  };

  const calculate = async () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision) || 2;
      if (isNaN(precisionVal) || precisionVal < 0)
        throw new Error("Precision must be a non-negative integer");

      let results = [];
      const isBatch = batchFile || batchText;

      if (!isBatch) {
        if (!dataInput.trim()) throw new Error("No data provided");
        const data = dataInput
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== "");
        if (data.some(isNaN)) throw new Error("All data values must be numbers");

        let params = {};
        if (["confidence-interval", "t-test", "z-test"].includes(calcType)) {
          if (!confidence) throw new Error("Confidence level required");
          params.confidence = parseFloat(confidence);
          if (isNaN(params.confidence) || params.confidence <= 0 || params.confidence >= 100) {
            throw new Error("Invalid confidence level");
          }
          if (["t-test", "z-test"].includes(calcType)) {
            if (!popMean) throw new Error("Population mean required");
            params.popMean = parseFloat(popMean);
            if (isNaN(params.popMean)) throw new Error("Invalid population mean");
          }
          if (calcType === "z-test") {
            if (!popStd) throw new Error("Population standard deviation required");
            params.popStd = parseFloat(popStd);
            if (isNaN(params.popStd) || params.popStd <= 0)
              throw new Error("Invalid population standard deviation");
          }
        } else if (["normal-dist", "t-dist"].includes(calcType)) {
          if (!xValue) throw new Error("X value required");
          params.xValue = parseFloat(xValue);
          if (isNaN(params.xValue)) throw new Error("Invalid X value");
          if (calcType === "t-dist") {
            if (!df) throw new Error("Degrees of freedom required");
            params.df = parseInt(df);
            if (isNaN(params.df) || params.df <= 0) throw new Error("Invalid degrees of freedom");
          }
        }

        let data2 = null;
        if (["correlation", "regression"].includes(calcType)) {
          if (!data2Input) throw new Error("Second dataset required");
          data2 = data2Input
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== "");
          if (data2.length !== data.length) throw new Error("Datasets must have equal length");
          if (data2.some(isNaN)) throw new Error("All second dataset values must be numbers");
        }

        const result = calculateStatistics(calcType, data, data2, params, precisionVal);
        results.push({ calcType, data, data2, params, result });
        displayResults(results, isBatch);
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
          if (datasets.length === 0) throw new Error("No valid datasets provided");
        }
        await processBatch(datasets, results, calcType, precisionVal);
        if (results.length === 0) throw new Error("No valid datasets found in batch input");
        displayResults(results, isBatch);
      }
      showSuccess("Calculation completed successfully");
    } catch (e) {
      console.error("Calculation error:", e);
      showError(e.message || "An unexpected error occurred");
    }
  };

  const processBatch = async (datasets, results, calcType, precision) => {
    for (const dataset of datasets) {
      try {
        const data = dataset
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== "");
        if (data.length === 0) throw new Error("Empty dataset");
        if (data.some(isNaN)) throw new Error("All data values must be numbers");
        const result = calculateStatistics(calcType, data, null, {}, precision);
        results.push({ calcType, data, data2: null, params: {}, result });
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const formatResult = (calcType, result, precision) => {
    if (calcType === "descriptive") {
      return `
        Count: ${result.count}<br>
        Mean: ${result.mean.toFixed(precision)}<br>
        Median: ${result.median.toFixed(precision)}<br>
        Mode: ${result.mode}<br>
        Variance: ${result.variance.toFixed(precision)}<br>
        Std Dev: ${result.std.toFixed(precision)}<br>
        CV: ${result.cv.toFixed(precision)}%<br>
        Min: ${result.min.toFixed(precision)}<br>
        Max: ${result.max.toFixed(precision)}<br>
        Midrange: ${result.midrange.toFixed(precision)}<br>
        Q1: ${result.q1.toFixed(precision)}<br>
        Q3: ${result.q3.toFixed(precision)}<br>
        IQR: ${result.iqr.toFixed(precision)}<br>
        Skewness: ${result.skewness.toFixed(precision)}<br>
        Kurtosis: ${result.kurtosis.toFixed(precision)}
      `;
    } else if (calcType === "confidence-interval") {
      return `CI: [${result.lower.toFixed(precision)}, ${result.upper.toFixed(precision)}]`;
    } else if (calcType === "t-test") {
      return `T-Statistic: ${result.t.toFixed(precision)}, DF: ${result.df}, P-Value: ${result.pValue.toFixed(
        precision
      )}`;
    } else if (calcType === "z-test") {
      return `Z-Statistic: ${result.z.toFixed(precision)}, P-Value: ${result.pValue.toFixed(precision)}`;
    } else if (calcType === "normal-dist") {
      return `Z-Score: ${result.z.toFixed(precision)}, Probability: ${result.probability.toFixed(precision)}`;
    } else if (calcType === "t-dist") {
      return `T-Statistic: ${result.t.toFixed(precision)}, DF: ${
        result.df
      }, Probability: ${result.probability.toFixed(precision)}`;
    } else if (calcType === "correlation") {
      return `Correlation: ${result.correlation.toFixed(precision)}`;
    } else if (calcType === "regression") {
      return `Correlation: ${result.correlation.toFixed(precision)}<br>Slope: ${result.slope.toFixed(
        precision
      )}<br>Intercept: ${result.intercept.toFixed(precision)}`;
    }
    return JSON.stringify(result);
  };

  const displayResults = (results, isBatch) => {
    let output = [];
    if (isBatch) {
      output.push(
        <table key="batch-results" className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Dataset</th>
              <th className="p-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td className="p-2">{r.data.join(", ")}</td>
                <td
                  className="p-2"
                  dangerouslySetInnerHTML={{
                    __html: `${formatResult(r.calcType, r.result.result, parseInt(precision))}<br>Formula: ${
                      r.result.formula
                    }`,
                  }}
                />
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
            Results (Type: {r.calcType}, Precision: {precision}):
          </strong>
          <br />
          <div
            dangerouslySetInnerHTML={{
              __html: formatResult(r.calcType, r.result.result, parseInt(precision)),
            }}
          />
          <br />
          Formula: {r.result.formula}
        </div>
      );
    }

    setResults(output);
    const params = isBatch
      ? `Batch: ${results.length} datasets, Type: ${results[0].calcType}`
      : results[0].data.join(", ");
    saveToHistory(
      params,
      output
        .map((o) => (o.props.children?.toString() || o).replace(/<[^>]+>/g, "; ").substring(0, 100) + "...")
        .join("; ")
    );
    updateVisualizations(results, isBatch);
  };

  const detectOutliers = () => {
    clearMessages();
    try {
      if (!dataInput.trim()) throw new Error("No data provided");
      const data = dataInput
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      if (data.length === 0) throw new Error("No valid data provided");
      const precisionVal = parseInt(precision) || 2;

      let outliers = [];
      if (outlierMethod === "iqr") {
        const quartiles = window.math.quantileSeq(data, [0.25, 0.75]);
        const iqr = quartiles[1] - quartiles[0];
        const lowerBound = quartiles[0] - 1.5 * iqr;
        const upperBound = quartiles[1] + 1.5 * iqr;
        outliers = data.filter((x) => x < lowerBound || x > upperBound);
      } else if (outlierMethod === "z-score") {
        const mean = window.math.mean(data);
        const std = window.math.std(data);
        outliers = data.filter((x) => Math.abs((x - mean) / std) > 3);
      }

      const output =
        `<strong>Outlier Detection (${outlierMethod.toUpperCase()}):</strong><br>` +
        (outliers.length > 0
          ? `Outliers: ${outliers.map((x) => x.toFixed(precisionVal)).join(", ")}`
          : "No outliers detected");

      setResults([<div key="outliers" dangerouslySetInnerHTML={{ __html: output }} />]);
      saveToHistory(`Outlier Detection: ${data.join(", ")}`, output.replace(/<br>/g, "; "));
      showSuccess("Outlier detection completed");
    } catch (e) {
      console.error("Outlier detection error:", e);
      showError(e.message || "Failed to detect outliers");
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision) || 2;
      const variationVal = parseFloat(variation);
      if (!dataInput.trim()) throw new Error("No data provided");
      if (isNaN(variationVal)) throw new Error("Variation value required");

      const data = dataInput
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      if (data.length === 0) throw new Error("No valid data provided");

      const variedData = data.map((x) => x * (1 + variationVal / 100));
      const results = [
        { label: "Original", data, result: calculateStatistics(calcType, data, null, {}, precisionVal) },
        {
          label: `Varied (+${variationVal}%)`,
          data: variedData,
          result: calculateStatistics(calcType, variedData, null, {}, precisionVal),
        },
      ];

      const output =
        `<strong>Sensitivity Analysis (Variation: ${variationVal}%):</strong><br>` +
        results
          .map(
            (r) =>
              `${r.label}:<br>${formatResult(calcType, r.result.result, precisionVal)}<br>Formula: ${
                r.result.formula
              }`
          )
          .join("<br><br>");

      setResults([<div key="sensitivity" dangerouslySetInnerHTML={{ __html: output }} />]);
      saveToHistory(`Sensitivity: ${data.join(", ")}`, output.replace(/<br>/g, "; "));
      updateSensitivityChart(results);
      showSuccess("Sensitivity analysis completed");
    } catch (e) {
      console.error("Sensitivity error:", e);
      showError(e.message || "Failed to compute sensitivity analysis");
    }
  };

  const compareDatasets = () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision) || 2;
      if (!compareText.trim()) throw new Error("Comparison input required");
      const datasets = compareText
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s);
      if (datasets.length === 0) throw new Error("No valid datasets provided");

      const results = [];
      datasets.forEach((dataset, i) => {
        try {
          const data = dataset
            .split(",")
            .map((s) => parseFloat(s.trim()))
            .filter((n) => !isNaN(n));
          if (data.length === 0) throw new Error("Empty dataset");
          const result = calculateStatistics(calcType, data, null, {}, precisionVal);
          results.push({ calcType, data, result, dataset });
        } catch (e) {
          console.warn(`Skipping invalid dataset: ${e.message}`);
        }
      });

      if (results.length === 0) throw new Error("No valid datasets to compare");

      const output = [
        <div key="comparison">
          <strong>Dataset Comparison:</strong>
          <br />
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Dataset</th>
                <th className="p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td className="p-2">{r.dataset}</td>
                  <td
                    className="p-2"
                    dangerouslySetInnerHTML={{
                      __html: `${formatResult(r.calcType, r.result.result, precisionVal)}<br>Formula: ${
                        r.result.formula
                      }`,
                    }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      ];

      setResults(output);
      saveToHistory(
        `Comparison: ${results.length} datasets`,
        output[0].props.children
          .toString()
          .replace(/<[^>]+>/g, "; ")
          .substring(0, 100) + "..."
      );
      updateComparisonChart(results);
      showSuccess("Dataset comparison completed");
    } catch (e) {
      console.error("Compare datasets error:", e);
      showError(e.message || "Failed to compare datasets");
    }
  };

  const updateVisualizations = (results, isBatch) => {
    if (histogramInstance.current) histogramInstance.current.destroy();
    if (boxPlotInstance.current) boxPlotInstance.current.destroy();

    if (!isBatch && results.length === 1 && results[0].result.visualizationData.length > 0) {
      drawDataVisualization(results[0].result.visualizationData, results[0].calcType);
    } else if (svgRef.current) {
      svgRef.current.innerHTML =
        '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single calculation</text>';
    }

    updateHistogram(results);
    updateBoxPlot(results);
  };

  const drawDataVisualization = (data, calcType) => {
    if (!svgRef.current) return;
    svgRef.current.innerHTML = "";
    const width = 500;
    const height = 200;
    svgRef.current.setAttribute("width", width);
    svgRef.current.setAttribute("height", height);

    if (!data || data.length === 0) {
      svgRef.current.innerHTML = '<text x="10" y="50" fill="#000" font-size="14">No data to visualize</text>';
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
    svgRef.current.appendChild(path);

    data.forEach((point) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", (point.x - xMin) * scaleX + offsetX);
      circle.setAttribute("cy", offsetY - (point.y - yMin) * scaleY);
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "#ef4444");
      svgRef.current.appendChild(circle);
    });
  };

  const updateHistogram = (results) => {
    if (histogramInstance.current) histogramInstance.current.destroy();
    if (!histogramRef.current) return;

    const data = results.flatMap((r) => r.data);
    if (data.length === 0) {
      histogramRef.current
        .getContext("2d")
        .clearRect(0, 0, histogramRef.current.width, histogramRef.current.height);
      return;
    }

    const bins = Math.ceil(Math.sqrt(data.length));
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const binWidth = range / bins;
    const binData = Array(bins).fill(0);
    data.forEach((x) => {
      const bin = Math.min(bins - 1, Math.floor((x - min) / binWidth));
      binData[bin]++;
    });

    histogramInstance.current = new window.Chart(histogramRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels: Array.from({ length: bins }, (_, i) => (min + i * binWidth).toFixed(1)),
        datasets: [
          {
            label: "Frequency",
            data: binData,
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
          x: { title: { display: true, text: "Value" } },
        },
        plugins: {
          title: { display: true, text: "Data Histogram" },
        },
      },
    });
  };

  const updateBoxPlot = (results) => {
    if (boxPlotInstance.current) boxPlotInstance.current.destroy();
    if (!boxPlotRef.current) return;

    const datasets = results.map((r, i) => {
      const sorted = r.data.slice().sort((a, b) => a - b);
      const q1 = window.math.quantileSeq(sorted, 0.25);
      const q2 = window.math.quantileSeq(sorted, 0.5);
      const q3 = window.math.quantileSeq(sorted, 0.75);
      const iqr = q3 - q1;
      const lower = Math.max(sorted[0], q1 - 1.5 * iqr);
      const upper = Math.min(sorted[sorted.length - 1], q3 + 1.5 * iqr);
      return {
        label: `Dataset ${i + 1}`,
        data: [lower, q1, q2, q3, upper],
        backgroundColor: "#ef4444",
        borderColor: "#b91c1c",
        borderWidth: 1,
      };
    });

    boxPlotInstance.current = new window.Chart(boxPlotRef.current.getContext("2d"), {
      type: "boxplot",
      data: { datasets },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Value" } },
        },
        plugins: {
          title: { display: true, text: "Box Plot" },
        },
      },
    });
  };

  const updateSensitivityChart = (results) => {
    if (histogramInstance.current) histogramInstance.current.destroy();
    if (!histogramRef.current) return;

    const datasets = results.map((r, i) => ({
      label: r.label,
      data: r.data,
      backgroundColor: "#ef4444",
      borderColor: "#b91c1c",
      borderWidth: 1,
    }));

    histogramInstance.current = new window.Chart(histogramRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels: Array.from({ length: Math.max(...results.map((r) => r.data.length)) }, (_, i) => i + 1),
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Value" } },
          x: { title: { display: true, text: "Index" } },
        },
        plugins: {
          title: { display: true, text: "Sensitivity Analysis" },
        },
      },
    });
  };

  const updateComparisonChart = (results) => {
    if (histogramInstance.current) histogramInstance.current.destroy();
    if (!histogramRef.current) return;

    const datasets = results.map((r, i) => ({
      label: r.dataset,
      data: r.data,
      backgroundColor: "#ef4444",
      borderColor: "#b91c1c",
      borderWidth: 1,
    }));

    histogramInstance.current = new window.Chart(histogramRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels: Array.from({ length: Math.max(...results.map((r) => r.data.length)) }, (_, i) => i + 1),
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Value" } },
          x: { title: { display: true, text: "Index" } },
        },
        plugins: {
          title: { display: true, text: "Dataset Comparison" },
        },
      },
    });
  };

  const clearInputs = () => {
    setCalcType("descriptive");
    setPrecision("2");
    setDataInput("");
    setData2Input("");
    setConfidence("");
    setPopMean("");
    setPopStd("");
    setXValue("");
    setDf("");
    setBatchFile(null);
    setBatchText("");
    setOutlierMethod("iqr");
    setVariation("");
    setCompareText("");
    clearMessages();
    setResults([]);
    if (svgRef.current) svgRef.current.innerHTML = "";
    if (histogramInstance.current) histogramInstance.current.destroy();
    if (boxPlotInstance.current) boxPlotInstance.current.destroy();
  };

  const saveCalculation = () => {
    if (results.length > 0) {
      showSuccess("Calculation saved to history!");
    } else {
      showError("No valid calculation to save.");
    }
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
    localStorage.setItem("statsCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "statistics_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "statistics_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Statistics Calculation History", 10, 10);
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
    doc.save("statistics_history.pdf");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
      calculate();
    }
  };

  return (
    <>
      <div
        className=" bg-white flex justify-center items-center p-4 font-inter"
        onKeyDown={handleKeyDown}
      >
        <div className="w-full max-w-6xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">
            Advanced Statistics Calculator
          </h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Calculation Type
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select the type of statistical analysis.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={calcType}
                  onChange={(e) => {
                    setCalcType(e.target.value);
                    updateInputFields();
                  }}
                >
                  <option value="descriptive">Descriptive Statistics</option>
                  <option value="confidence-interval">Confidence Interval</option>
                  <option value="t-test">One-Sample T-Test</option>
                  <option value="z-test">One-Sample Z-Test</option>
                  <option value="normal-dist">Normal Distribution</option>
                  <option value="t-dist">T-Distribution</option>
                  <option value="correlation">Correlation</option>
                  <option value="regression">Linear Regression</option>
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
              <h3 className="text-md font-medium text-gray-700 mb-2">Data Input</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                    Values (Comma-Separated)
                    <span className="ml-1 cursor-pointer">?</span>
                    <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                      Enter values separated by commas (e.g., 1,2,3).
                    </span>
                  </label>
                  <input
                    type="text"
                    className="p-3 border rounded-lg w-full bg-gray-200"
                    placeholder="e.g., 1,2,3,4,5"
                    value={dataInput}
                    onChange={(e) => setDataInput(e.target.value)}
                  />
                </div>
                {["correlation", "regression"].includes(calcType) && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                      Second Dataset (Comma-Separated)
                      <span className="ml-1 cursor-pointer">?</span>
                      <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                        Enter second dataset for correlation/regression.
                      </span>
                    </label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 2,4,6,8,10"
                      value={data2Input}
                      onChange={(e) => setData2Input(e.target.value)}
                    />
                  </div>
                )}
                {["confidence-interval", "t-test", "z-test"].includes(calcType) && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                      Confidence Level (%)
                      <span className="ml-1 cursor-pointer">?</span>
                      <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                        Confidence level (e.g., 95).
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
                )}
                {["t-test", "z-test"].includes(calcType) && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                      Population Mean
                      <span className="ml-1 cursor-pointer">?</span>
                      <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                        Hypothesized population mean.
                      </span>
                    </label>
                    <input
                      type="number"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0"
                      value={popMean}
                      onChange={(e) => setPopMean(e.target.value)}
                    />
                  </div>
                )}
                {calcType === "z-test" && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                      Population Standard Deviation
                      <span className="ml-1 cursor-pointer">?</span>
                      <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                        Known population standard deviation.
                      </span>
                    </label>
                    <input
                      type="number"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 1"
                      value={popStd}
                      onChange={(e) => setPopStd(e.target.value)}
                    />
                  </div>
                )}
                {["normal-dist", "t-dist"].includes(calcType) && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                      X Value
                      <span className="ml-1 cursor-pointer">?</span>
                      <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                        Value to compute probability for.
                      </span>
                    </label>
                    <input
                      type="number"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 0"
                      value={xValue}
                      onChange={(e) => setXValue(e.target.value)}
                    />
                  </div>
                )}
                {calcType === "t-dist" && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                      Degrees of Freedom
                      <span className="ml-1 cursor-pointer">?</span>
                      <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                        Degrees of freedom for t-distribution.
                      </span>
                    </label>
                    <input
                      type="number"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder="e.g., 10"
                      value={df}
                      onChange={(e) => setDf(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV File or Text: dataset1;dataset2;...)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter datasets (e.g., 1,2,3;4,5,6).
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
                placeholder="e.g., 1,2,3;4,5,6"
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
              Clear
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              onClick={saveCalculation}
            >
              Save Calculation
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
                  Outlier Detection Method
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select method to detect outliers.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={outlierMethod}
                  onChange={(e) => setOutlierMethod(e.target.value)}
                >
                  <option value="iqr">IQR Method</option>
                  <option value="z-score">Z-Score Method</option>
                </select>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={detectOutliers}
                >
                  Detect Outliers
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Variation Value (%)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Percentage to vary data for sensitivity analysis.
                  </span>
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 10"
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
                  Compare Datasets (CSV: dataset1;dataset2;...)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter datasets to compare (e.g., 1,2,3;4,5,6).
                  </span>
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  rows="4"
                  placeholder="e.g., 1,2,3;4,5,6"
                  value={compareText}
                  onChange={(e) => setCompareText(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={compareDatasets}
                >
                  Compare Datasets
                </button>
              </div>
            </div>
          )}
          {results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div className="text-gray-600 mb-4">{results}</div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Data Trend Line</h3>
                <svg ref={svgRef} className="w-full max-w-[500px] h-[200px] mx-auto block" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Histogram</h3>
                <canvas ref={histogramRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Box Plot</h3>
                <canvas ref={boxPlotRef} className="max-h-80" />
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
