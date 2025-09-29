"use client";
import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function AdvancedMatrixCalculator() {
  const [operation, setOperation] = useState("add");
  const [scalar, setScalar] = useState("");
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);
  const [matrixA, setMatrixA] = useState(
    Array(2)
      .fill()
      .map(() => Array(2).fill(0))
  );
  const [matrixB, setMatrixB] = useState(
    Array(2)
      .fill()
      .map(() => Array(2).fill(0))
  );
  const [batchFile, setBatchFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resultContent, setResultContent] = useState("");
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const heatmapChartRef = useRef(null);
  const eigenvalueChartRef = useRef(null);
  const heatmapChartInstance = useRef(null);
  const eigenvalueChartInstance = useRef(null);
  const [lastResults, setLastResults] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("matrixCalcHistory") || "[]").filter(
      (entry) =>
        entry &&
        typeof entry.date === "string" &&
        typeof entry.operation === "string" &&
        typeof entry.input === "string" &&
        typeof entry.result === "string"
    );
    setCalculationHistory(savedHistory);
  }, []);

  const sanitizeHTML = (str) => {
    const div = document.createElement("div");
    div.textContent = String(str || "");
    return div.innerHTML;
  };

  const updateMatrixInput = (matrixId, rows, cols) => {
    if (
      !Number.isInteger(rows) ||
      !Number.isInteger(cols) ||
      rows < 1 ||
      cols < 1 ||
      rows > 10 ||
      cols > 10
    ) {
      setError("Matrix dimensions must be integers between 1 and 10");
      return;
    }
    const newMatrix = Array(rows)
      .fill()
      .map(() => Array(cols).fill(0));
    if (matrixId === "a") setMatrixA(newMatrix);
    else setMatrixB(newMatrix);
  };

  const handleMatrixChange = (matrixId, row, col, value) => {
    const newMatrix = matrixId === "a" ? [...matrixA] : [...matrixB];
    newMatrix[row] = [...newMatrix[row]];
    newMatrix[row][col] = value === "" ? 0 : parseFloat(value);
    if (matrixId === "a") setMatrixA(newMatrix);
    else setMatrixB(newMatrix);
  };

  const validateMatrixOperation = (op, matA, matB) => {
    const rowsA = matA.length,
      colsA = matA[0].length;
    const rowsB = matB ? matB.length : 0,
      colsB = matB ? matB[0].length : 0;
    if (["add", "subtract"].includes(op) && (rowsA !== rowsB || colsA !== colsB)) {
      throw new Error("Matrices must have the same dimensions for addition/subtraction");
    }
    if (op === "multiply" && colsA !== rowsB) {
      throw new Error(
        "Number of columns in Matrix A must equal number of rows in Matrix B for multiplication"
      );
    }
    if (["determinant", "inverse", "eigenvalues"].includes(op) && rowsA !== colsA) {
      throw new Error("Matrix must be square for this operation");
    }
    if (op === "solve" && (rowsA !== colsA || rowsB !== rowsA || colsB !== 1)) {
      throw new Error("Matrix A must be square, and b must be a vector with length equal to rows of A");
    }
  };

  const performMatrixOperation = (op, matA, matB, scal) => {
    const result = {};
    switch (op) {
      case "add":
        result.value = math.add(matA, matB);
        result.steps = ["Element-wise addition of matrices"];
        break;
      case "subtract":
        result.value = math.subtract(matA, matB);
        result.steps = ["Element-wise subtraction of matrices"];
        break;
      case "multiply":
        result.value = math.multiply(matA, matB);
        result.steps = ["Matrix multiplication"];
        break;
      case "scalar-multiply":
        if (!Number.isFinite(scal)) throw new Error("Scalar must be a valid number");
        result.value = math.multiply(scal, matA);
        result.steps = [`Multiply each element by ${scal}`];
        break;
      case "determinant":
        result.value = math.det(matA);
        result.steps = ["Compute determinant using cofactor expansion"];
        break;
      case "inverse":
        result.value = math.inv(matA);
        result.steps = ["Compute inverse using adjugate and determinant"];
        break;
      case "transpose":
        result.value = math.transpose(matA);
        result.steps = ["Swap rows and columns"];
        break;
      case "rank":
        result.value = math.rank(matA);
        result.steps = ["Compute rank using Gaussian elimination"];
        break;
      case "trace":
        result.value = math.trace(matA);
        result.steps = ["Sum of diagonal elements"];
        break;
      case "eigenvalues":
        const eig = math.eigs(matA);
        result.value = { eigenvalues: eig.values, eigenvectors: eig.vectors };
        result.steps = ["Compute eigenvalues and eigenvectors"];
        break;
      case "lu":
        const lu = math.lup(matA);
        result.value = { L: lu.L, U: lu.U, P: lu.P };
        result.steps = ["LU decomposition with partial pivoting"];
        break;
      case "solve":
        result.value = math.lusolve(matA, matB);
        result.steps = ["Solve Ax = b using LU decomposition"];
        break;
      default:
        throw new Error("Invalid operation");
    }
    return result;
  };

  const calculate = async () => {
    clearMessages();
    clearVisualizations();
    try {
      const scal = parseFloat(scalar);
      let results = [];
      if (!batchFile) {
        const matB = ["add", "subtract", "multiply", "solve"].includes(operation) ? matrixB : null;
        validateMatrixOperation(operation, matrixA, matB);
        const result = performMatrixOperation(operation, matrixA, matB, scal);
        results.push({ operation, matrixA, matrixB: matB, scalar: scal, result });
      } else {
        const reader = new FileReader();
        const datasets = await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            const text = e.target.result;
            if (!text.trim()) reject(new Error("Empty file provided"));
            resolve(
              text
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line)
            );
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsText(batchFile);
        });
        for (const dataset of datasets) {
          try {
            const [matrixAStr, matrixBStr] = dataset.split(";");
            const matA = matrixAStr.split(",").map((row) => row.split(" ").map(Number));
            const matB =
              matrixBStr && ["add", "subtract", "multiply", "solve"].includes(operation)
                ? matrixBStr.split(",").map((row) => row.split(" ").map(Number))
                : null;
            if (!matA.every((row) => row.every(Number.isFinite)))
              throw new Error("Invalid matrix elements in batch");
            if (matB && !matB.every((row) => row.every(Number.isFinite)))
              throw new Error("Invalid matrix B elements in batch");
            validateMatrixOperation(operation, matA, matB);
            const result = performMatrixOperation(operation, matA, matB, scal);
            results.push({ operation, matrixA: matA, matrixB: matB, scalar: scal, result });
          } catch (e) {
            console.warn(`Skipping invalid batch entry: ${e.message}`, { dataset });
          }
        }
        if (results.length === 0) throw new Error("No valid batch entries processed");
      }
      displayResults(results, !!batchFile);
      updateVisualizations(results);
      setSuccess("Calculation completed successfully");
      setLastResults(results);
    } catch (e) {
      setError(e.message || "An unexpected error occurred during calculation");
    }
  };

  const displayResults = (results, isBatch) => {
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Operation</th><th class="p-2">Matrix A</th><th class="p-2">Matrix B</th><th class="p-2">Result</th></tr></thead><tbody>';
      for (const r of results) {
        const matrixAStr = r.matrixA.map((row) => row.join(", ")).join("; ");
        const matrixBStr = r.matrixB ? r.matrixB.map((row) => row.join(", ")).join("; ") : "N/A";
        let resultStr = "";
        if (Array.isArray(r.result.value)) {
          resultStr = r.result.value.map((row) => row.join(", ")).join("; ");
        } else if (r.result.value && typeof r.result.value === "object" && r.result.value.L) {
          resultStr = `L: ${r.result.value.L.map((row) => row.join(", ")).join(
            "; "
          )}<br>U: ${r.result.value.U.map((row) => row.join(", ")).join("; ")}<br>P: ${r.result.value.P.map(
            (row) => row.join(", ")
          ).join("; ")}`;
        } else if (r.result.value && typeof r.result.value === "object" && r.result.value.eigenvalues) {
          resultStr = `Eigenvalues: ${r.result.value.eigenvalues.join(
            ", "
          )}<br>Eigenvectors: ${r.result.value.eigenvectors.map((row) => row.join(", ")).join("; ")}`;
        } else {
          resultStr = String(r.result.value);
        }
        output += `<tr><td class="p-2">${sanitizeHTML(r.operation)}</td><td class="p-2">${sanitizeHTML(
          matrixAStr
        )}</td><td class="p-2">${sanitizeHTML(matrixBStr)}</td><td class="p-2">${sanitizeHTML(
          resultStr
        )}</td></tr>`;
      }
      output += "</tbody></table>";
      if (output.includes("<tbody></tbody>")) output = "<p>No valid results to display</p>";
    } else {
      const r = results[0];
      output = `<strong>Operation: ${sanitizeHTML(r.operation)}</strong><br>`;
      output += `Matrix A: ${sanitizeHTML(r.matrixA.map((row) => row.join(", ")).join("; "))}<br>`;
      if (r.matrixB)
        output += `Matrix B: ${sanitizeHTML(r.matrixB.map((row) => row.join(", ")).join("; "))}<br>`;
      if (r.scalar || r.scalar === 0) output += `Scalar: ${sanitizeHTML(String(r.scalar))}<br>`;
      output += `<strong>Result:</strong><br>`;
      if (Array.isArray(r.result.value)) {
        output += sanitizeHTML(r.result.value.map((row) => row.join(", ")).join("; "));
      } else if (r.result.value && typeof r.result.value === "object" && r.result.value.L) {
        output += `L: ${sanitizeHTML(r.result.value.L.map((row) => row.join(", ")).join("; "))}<br>`;
        output += `U: ${sanitizeHTML(r.result.value.U.map((row) => row.join(", ")).join("; "))}<br>`;
        output += `P: ${sanitizeHTML(r.result.value.P.map((row) => row.join(", ")).join("; "))}<br>`;
      } else if (r.result.value && typeof r.result.value === "object" && r.result.value.eigenvalues) {
        output += `Eigenvalues: ${sanitizeHTML(r.result.value.eigenvalues.join(", "))}<br>`;
        output += `Eigenvectors: ${sanitizeHTML(
          r.result.value.eigenvectors.map((row) => row.join(", ")).join("; ")
        )}<br>`;
      } else {
        output += sanitizeHTML(String(r.result.value));
      }
      if (r.result.steps)
        output += `<br><strong>Steps:</strong><br>${r.result.steps
          .map((s) => `  ${sanitizeHTML(s)}`)
          .join("<br>")}`;
    }
    setResultContent(output);
    const firstResult = results[0];
    saveToHistory(
      firstResult.operation,
      JSON.stringify({
        matrixA: firstResult.matrixA,
        matrixB: firstResult.matrixB,
        scalar: firstResult.scalar,
      }),
      JSON.stringify(firstResult.result)
    );
  };

  const isValidMatrix = (value) => {
    if (!Array.isArray(value) || value.length === 0) return false;
    const rowLength = value[0].length;
    return value.every(
      (row) => Array.isArray(row) && row.length === rowLength && row.every((val) => Number.isFinite(val))
    );
  };

  const isValidEigenvalueData = (value) => {
    return (
      value &&
      typeof value === "object" &&
      Array.isArray(value.eigenvalues) &&
      value.eigenvalues.every((val) => Number.isFinite(val)) &&
      isValidMatrix(value.eigenvectors)
    );
  };

  const updateVisualizations = (results) => {
    if (!results.length || !results[0].result || !results[0].operation) return;
    const r = results[0].result;
    const op = results[0].operation;
    if (["determinant", "rank", "trace"].includes(op)) return;

    if (heatmapChartInstance.current) heatmapChartInstance.current.destroy();
    if (eigenvalueChartInstance.current) eigenvalueChartInstance.current.destroy();

    let matrixToVisualize = null;
    if (isValidMatrix(r.value)) {
      matrixToVisualize = r.value;
    } else if (op === "lu" && r.value && typeof r.value === "object") {
      if (isValidMatrix(r.value.L)) matrixToVisualize = r.value.L;
      else if (isValidMatrix(r.value.U)) matrixToVisualize = r.value.U;
      else if (isValidMatrix(r.value.P)) matrixToVisualize = r.value.P;
    } else if (op === "eigenvalues" && r.value && isValidMatrix(r.value.eigenvectors)) {
      matrixToVisualize = r.value.eigenvectors;
    }

    if (heatmapChartRef.current && matrixToVisualize) {
      const data = matrixToVisualize.flatMap((row, i) =>
        row.map((val, j) => ({ x: j, y: i, v: Number.isFinite(val) ? val : 0 }))
      );
      const maxAbsValue = Math.max(...data.map((d) => Math.abs(d.v)), 1) || 1;
      heatmapChartInstance.current = new Chart(heatmapChartRef.current, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Matrix Values",
              data,
              backgroundColor: data.map((d) => {
                const alpha = Math.abs(d.v) / maxAbsValue;
                return `rgba(220, 38, 38, ${Math.min(alpha, 1)})`;
              }),
              pointRadius: 10,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: "linear",
              title: { display: true, text: "Columns" },
              min: -0.5,
              max: matrixToVisualize[0].length - 0.5,
            },
            y: {
              type: "linear",
              title: { display: true, text: "Rows" },
              min: -0.5,
              max: matrixToVisualize.length - 0.5,
              reverse: true,
            },
          },
          plugins: {
            title: { display: true, text: `Matrix Heatmap (${op})` },
            tooltip: { callbacks: { label: (ctx) => `Value: ${ctx.raw.v.toFixed(2)}` } },
          },
        },
      });
    }

    if (eigenvalueChartRef.current && op === "eigenvalues" && isValidEigenvalueData(r.value)) {
      const data = r.value.eigenvalues.map((val, i) => ({ x: i, y: Number.isFinite(val) ? val : 0 }));
      eigenvalueChartInstance.current = new Chart(eigenvalueChartRef.current, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Eigenvalues",
              data,
              backgroundColor: "rgba(220, 38, 38, 1)",
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Index" } },
            y: { title: { display: true, text: "Eigenvalue" } },
          },
          plugins: { title: { display: true, text: "Eigenvalue Distribution" } },
        },
      });
    }
  };

  const clearInputs = () => {
    setOperation("add");
    setScalar("");
    setRowsA(2);
    setColsA(2);
    setRowsB(2);
    setColsB(2);
    setMatrixA(
      Array(2)
        .fill()
        .map(() => Array(2).fill(0))
    );
    setMatrixB(
      Array(2)
        .fill()
        .map(() => Array(2).fill(0))
    );
    setBatchFile(null);
    clearMessages();
    clearVisualizations();
    setResultContent("");
    setSuccess("Inputs cleared");
  };

  const clearVisualizations = () => {
    if (heatmapChartInstance.current) heatmapChartInstance.current.destroy();
    if (eigenvalueChartInstance.current) eigenvalueChartInstance.current.destroy();
    heatmapChartInstance.current = null;
    eigenvalueChartInstance.current = null;
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const saveCalculation = () => {
    if (!resultContent) {
      setError("No valid calculation to save");
      return;
    }
    setSuccess("Calculation saved to history");
  };

  const saveToHistory = (op, input, result) => {
    const entry = {
      date: new Date().toLocaleString(),
      operation: String(op || ""),
      input: String(input || ""),
      result: String(result || ""),
    };
    const updatedHistory = [...calculationHistory, entry];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("matrixCalcHistory", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setCalculationHistory([]);
    localStorage.removeItem("matrixCalcHistory");
    setSuccess("History cleared");
  };

  const exportCSV = () => {
    const headers = ["Date", "Operation", "Input", "Result"];
    const rows = calculationHistory.map((entry) => [
      `"${sanitizeHTML(entry.date)}"`,
      `"${sanitizeHTML(entry.operation)}"`,
      `"${sanitizeHTML(entry.input)}"`,
      `"${sanitizeHTML(entry.result)}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("matrix_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("matrix_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Matrix Calculation History", 10, 10);
    let y = 20;
    calculationHistory.forEach((entry) => {
      doc.text(`Date: ${sanitizeHTML(entry.date)}`, 10, y);
      doc.text(`Operation: ${sanitizeHTML(entry.operation)}`, 10, y + 10);
      doc.text(`Input: ${sanitizeHTML(entry.input)}`, 10, y + 20);
      doc.text(`Result: ${sanitizeHTML(entry.result)}`, 10, y + 30);
      y += 50;
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("matrix_history.pdf");
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
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Matrix Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Matrix Input</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Operation
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Select the matrix operation to perform.
                    </span>
                  </span>
                </label>
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                  <option value="multiply">Multiply</option>
                  <option value="scalar-multiply">Scalar Multiply</option>
                  <option value="determinant">Determinant</option>
                  <option value="inverse">Inverse</option>
                  <option value="transpose">Transpose</option>
                  <option value="rank">Rank</option>
                  <option value="trace">Trace</option>
                  <option value="eigenvalues">Eigenvalues/Eigenvectors</option>
                  <option value="lu">LU Decomposition</option>
                  <option value="solve">Solve Ax = b</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Scalar (for Scalar Multiply)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter a scalar value for scalar multiplication.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={scalar}
                  onChange={(e) => setScalar(e.target.value)}
                  placeholder="e.g., 2"
                  className="p-3 border rounded-lg w-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Matrix A (Rows × Columns)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Enter dimensions and values for Matrix A.
                  </span>
                </span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rowsA}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setRowsA(val);
                      updateMatrixInput("a", val, colsA);
                    }
                  }}
                  className="p-3 border rounded-lg w-20"
                />
                <span className="text-gray-600">×</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={colsA}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setColsA(val);
                      updateMatrixInput("a", rowsA, val);
                    }
                  }}
                  className="p-3 border rounded-lg w-20"
                />
              </div>
              <div className={`grid gap-2 mb-4`} style={{ gridTemplateColumns: `repeat(${colsA}, 60px)` }}>
                {matrixA.map((row, i) =>
                  row.map((val, j) => (
                    <input
                      key={`a-${i}-${j}`}
                      type="number"
                      step="any"
                      value={val}
                      onChange={(e) => handleMatrixChange("a", i, j, e.target.value)}
                      className="p-2 border rounded text-center w-full"
                    />
                  ))
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Matrix B or Vector b (Rows × Columns)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Enter dimensions and values for Matrix B or vector b.
                  </span>
                </span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rowsB}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setRowsB(val);
                      updateMatrixInput("b", val, colsB);
                    }
                  }}
                  className="p-3 border rounded-lg w-20"
                />
                <span className="text-gray-600">×</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={colsB}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setColsB(val);
                      updateMatrixInput("b", rowsB, val);
                    }
                  }}
                  className="p-3 border rounded-lg w-20"
                />
              </div>
              <div className={`grid gap-2 mb-4`} style={{ gridTemplateColumns: `repeat(${colsB}, 60px)` }}>
                {matrixB.map((row, i) =>
                  row.map((val, j) => (
                    <input
                      key={`b-${i}-${j}`}
                      type="number"
                      step="any"
                      value={val}
                      onChange={(e) => handleMatrixChange("b", i, j, e.target.value)}
                      className="p-2 border rounded text-center w-full"
                    />
                  ))
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV File)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Upload a CSV file with matrices (e.g., "1,2;3,4" for 2x2).
                  </span>
                </span>
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setBatchFile(e.target.files[0])}
                className="p-3 border rounded-lg w-full"
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
            <button onClick={saveCalculation} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Save Calculation
            </button>
            <button onClick={clearHistory} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Clear History
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Matrices
          </button>

          {resultContent && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} className="text-gray-600 mb-4" />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Matrix Heatmap</h3>
                <canvas ref={heatmapChartRef} className="max-w-[600px] h-[300px] mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Eigenvalue Plot</h3>
                <canvas ref={eigenvalueChartRef} className="max-w-[600px] h-[300px] mx-auto" />
              </div>
              {calculationHistory.length > 0 && (
                <div className="mt-6 max-h-[200px] overflow-y-auto">
                  <h3 className="text-md font-medium text-red-900">Calculation History</h3>
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">Date</th>
                        <th className="p-2">Operation</th>
                        <th className="p-2">Input</th>
                        <th className="p-2">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationHistory.map((entry, index) => (
                        <tr key={index}>
                          <td className="p-2">{entry.date}</td>
                          <td className="p-2">{entry.operation}</td>
                          <td className="p-2">{entry.input}</td>
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
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 rounded-lg max-w-[600px] w-full relative">
                <span
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Understanding Matrix Operations</h2>
                <p className="text-gray-600 mb-4">
                  Matrices are rectangular arrays of numbers used in mathematics, physics, and computer
                  science. This calculator supports a wide range of matrix operations.
                </p>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Key Operations</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Add/Subtract:</strong> Element-wise addition or subtraction of matrices.
                  </li>
                  <li>
                    <strong>Multiply:</strong> Matrix multiplication (rows × columns).
                  </li>
                  <li>
                    <strong>Determinant:</strong> Scalar value for square matrices, used in inverses.
                  </li>
                  <li>
                    <strong>Inverse:</strong> Matrix that, when multiplied, yields the identity matrix.
                  </li>
                  <li>
                    <strong>Transpose:</strong> Swap rows and columns.
                  </li>
                  <li>
                    <strong>Eigenvalues:</strong> Scalars λ where A v = λ v for some vector v.
                  </li>
                  <li>
                    <strong>LU Decomposition:</strong> Factorize matrix into lower and upper triangular
                    matrices.
                  </li>
                  <li>
                    <strong>Solve Ax = b:</strong> Find x such that Ax = b.
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Applications</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Linear Algebra:</strong> Solving systems of equations.
                  </li>
                  <li>
                    <strong>Computer Graphics:</strong> Transformations (rotation, scaling).
                  </li>
                  <li>
                    <strong>Machine Learning:</strong> Data processing, neural networks.
                  </li>
                  <li>
                    <strong>Engineering:</strong> Structural analysis, circuit design.
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>Ensure matrix dimensions are compatible for operations.</li>
                  <li>Use CSV files for batch input (e.g., "1,2;3,4" for 2x2).</li>
                  <li>Check for square matrices for determinant, inverse, and eigenvalues.</li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <a
                      href="https://www.mathsisfun.com/algebra/matrix-introduction.html"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Matrices Explained
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://en.wikipedia.org/wiki/Matrix_(mathematics)"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Wikipedia: Matrices
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
