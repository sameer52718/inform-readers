"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [operation, setOperation] = useState("add");
  const [leadingZeros, setLeadingZeros] = useState("0");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [statInput, setStatInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const lastResults = useRef([]);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("binaryCalcHistory");
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

    // Keyboard support
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.target.tagName === "INPUT") {
        calculate();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (chartInstance.current) chartInstance.current.destroy();
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

  const isValidBinary = (str) => /^[01]+$/.test(str);

  const isValidDecimal = (str) => /^\d+$/.test(str) && parseInt(str) >= 0;

  const padBinary = (bin, zeros) => bin.padStart(parseInt(zeros), "0");

  const binToDec = (bin) => parseInt(bin, 2);

  const decToBin = (dec, zeros) => padBinary(Number(dec).toString(2), zeros);

  const binaryAdd = (a, b, zeros) => {
    let steps = [];
    let maxLen = Math.max(a.length, b.length);
    a = a.padStart(maxLen, "0");
    b = b.padStart(maxLen, "0");
    let result = "";
    let carry = 0;
    for (let i = maxLen - 1; i >= 0; i--) {
      let sum = parseInt(a[i]) + parseInt(b[i]) + carry;
      result = (sum % 2) + result;
      carry = Math.floor(sum / 2);
      steps.push(
        `Bit ${maxLen - i}: ${a[i]} + ${b[i]} + ${carry ? "carry 1" : "carry 0"} = ${sum % 2}, carry ${carry}`
      );
    }
    if (carry) result = "1" + result;
    return { result: padBinary(result, zeros), steps: steps.reverse() };
  };

  const binarySubtract = (a, b, zeros) => {
    let steps = [];
    let maxLen = Math.max(a.length, b.length);
    a = a.padStart(maxLen, "0");
    b = b.padStart(maxLen, "0");
    let result = "";
    let borrow = 0;
    for (let i = maxLen - 1; i >= 0; i--) {
      let diff = parseInt(a[i]) - parseInt(b[i]) - borrow;
      if (diff < 0) {
        diff += 2;
        borrow = 1;
      } else {
        borrow = 0;
      }
      result = diff + result;
      steps.push(`Bit ${maxLen - i}: ${a[i]} - ${b[i]} - ${borrow ? "borrow 1" : "borrow 0"} = ${diff}`);
    }
    result = result.replace(/^0+/, "") || "0";
    return { result: padBinary(result, zeros), steps: steps.reverse() };
  };

  const binaryMultiply = (a, b, zeros) => {
    let steps = [];
    let decA = binToDec(a);
    let decB = binToDec(b);
    let result = decA * decB;
    let binResult = decToBin(result, 0);
    steps.push(`Convert to decimal: ${a} = ${decA}, ${b} = ${decB}`);
    steps.push(`Multiply: ${decA} × ${decB} = ${result}`);
    steps.push(`Convert to binary: ${result} = ${binResult}`);
    return { result: padBinary(binResult, zeros), steps };
  };

  const binaryDivide = (a, b, zeros) => {
    let steps = [];
    let decA = binToDec(a);
    let decB = binToDec(b);
    if (decB === 0) throw new Error("Division by zero");
    let quotient = Math.floor(decA / decB);
    let remainder = decA % decB;
    let binQuotient = decToBin(quotient, 0);
    let binRemainder = decToBin(remainder, 0);
    steps.push(`Convert to decimal: ${a} = ${decA}, ${b} = ${decB}`);
    steps.push(`Divide: ${decA} ÷ ${decB} = ${quotient}, remainder ${remainder}`);
    steps.push(`Convert to binary: Quotient = ${binQuotient}, Remainder = ${binRemainder}`);
    return { result: binQuotient, remainder: binRemainder, steps };
  };

  const computeOperation = (input1, input2, op, zeros) => {
    let steps = [];
    let result = "";
    let decimalResult = 0;
    let remainder = "";

    if (["bin-to-dec", "dec-to-bin"].includes(op)) {
      if (input2) throw new Error("Second input not required for conversion");
      if (op === "bin-to-dec") {
        if (!isValidBinary(input1)) throw new Error("Invalid binary input");
        result = binToDec(input1).toString();
        decimalResult = parseInt(result);
        steps.push(`Binary ${input1} = ${result} (decimal)`);
        for (let i = 0; i < input1.length; i++) {
          let bit = parseInt(input1[input1.length - 1 - i]);
          steps.push(`Bit ${i}: ${bit} × 2^${i} = ${bit * Math.pow(2, i)}`);
        }
      } else {
        if (!isValidDecimal(input1)) throw new Error("Invalid decimal input");
        result = decToBin(input1, zeros);
        decimalResult = parseInt(input1);
        steps.push(`Decimal ${input1} = ${result} (binary)`);
        let num = parseInt(input1);
        while (num > 0) {
          steps.push(`Divide ${num} by 2: Quotient = ${Math.floor(num / 2)}, Remainder = ${num % 2}`);
          num = Math.floor(num / 2);
        }
      }
    } else {
      if (!input2) throw new Error("Second input required for arithmetic");
      if (!isValidBinary(input1) || !isValidBinary(input2)) throw new Error("Invalid binary input");
      let opResult;
      switch (op) {
        case "add":
          opResult = binaryAdd(input1, input2, zeros);
          break;
        case "subtract":
          opResult = binarySubtract(input1, input2, zeros);
          break;
        case "multiply":
          opResult = binaryMultiply(input1, input2, zeros);
          break;
        case "divide":
          opResult = binaryDivide(input1, input2, zeros);
          remainder = opResult.remainder;
          break;
      }
      result = opResult.result;
      steps = opResult.steps;
      decimalResult = binToDec(result);
      if (op === "divide") {
        decimalResult = Math.floor(binToDec(input1) / binToDec(input2));
      }
    }

    return { input1, input2, operation: op, result, decimalResult, steps, remainder };
  };

  const calculate = () => {
    clearMessages();
    try {
      let calcResults = [];
      let isBatch = batchFile || batchText;

      if (!isBatch && !input1) {
        throw new Error("Input 1 is required");
      }

      if (isBatch) {
        let operations = [];
        if (batchFile) {
          const reader = new FileReader();
          reader.onload = (e) => {
            operations = e.target.result
              .split("\n")
              .map((line) => line.split(","))
              .filter((op) => op.length >= 2);
            processBatch(operations);
          };
          reader.readAsText(batchFile);
          return;
        } else if (batchText) {
          operations = batchText.split(";").map((op) => op.split(","));
        }
        processBatch(operations);
      } else {
        const result = computeOperation(input1, input2, operation, leadingZeros);
        calcResults.push(result);
        displayResults(calcResults, operation, isBatch);
      }

      function processBatch(operations) {
        operations.forEach((op) => {
          try {
            let [in1, in2, opType] = op.map((s) => s.trim());
            opType = opType || operation;
            const result = computeOperation(in1, in2 || "", opType, leadingZeros);
            calcResults.push(result);
          } catch (e) {
            // Skip invalid operations
          }
        });
        if (calcResults.length === 0) throw new Error("No valid operations in batch input");
        displayResults(calcResults, operation, isBatch);
      }
    } catch (e) {
      showError(e.message || "Invalid input");
    }
  };

  const displayResults = (calcResults, op, isBatch) => {
    let output = "";
    if (isBatch) {
      output = (
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Input 1</th>
              <th className="p-2">Input 2</th>
              <th className="p-2">Operation</th>
              <th className="p-2">Result</th>
              <th className="p-2">Decimal</th>
            </tr>
          </thead>
          <tbody>
            {calcResults.map((r, i) => (
              <tr key={i}>
                <td className="p-2">{r.input1}</td>
                <td className="p-2">{r.input2 || "-"}</td>
                <td className="p-2">{r.operation}</td>
                <td className="p-2">
                  {r.result}
                  {r.remainder ? `, Remainder: ${r.remainder}` : ""}
                </td>
                <td className="p-2">{r.decimalResult}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      const r = calcResults[0];
      output = (
        <div>
          <strong>Result:</strong>
          <br />
          Input 1: {r.input1}
          <br />
          {r.input2 && `Input 2: ${r.input2}`}
          <br />
          Operation: {r.operation}
          <br />
          Result: {r.result}
          {r.remainder ? `, Remainder: ${r.remainder}` : ""}
          <br />
          Decimal: {r.decimalResult}
          <br />
          <strong>Steps:</strong>
          <br />
          {r.steps.map((step, i) => (
            <div key={i}>{step}</div>
          ))}
        </div>
      );
    }

    let statsText = "";
    if (isBatch && calcResults.length > 1) {
      const decimals = calcResults.map((r) => r.decimalResult);
      const stats = {
        mean: window.math.mean(decimals),
        median: window.math.median(decimals),
        stdDev: window.math.std(decimals),
        min: Math.min(...decimals),
        max: Math.max(...decimals),
      };
      statsText = (
        <div>
          <strong>Statistics (Decimal Results):</strong>
          <br />
          Mean: {stats.mean.toFixed(2)}
          <br />
          Median: {stats.median.toFixed(2)}
          <br />
          Standard Deviation: {stats.stdDev.toFixed(2)}
          <br />
          Min: {stats.min}
          <br />
          Max: {stats.max}
        </div>
      );
    }

    setResults({ content: output, stats: statsText });
    setShowResults(true);

    const params = isBatch
      ? `Batch: ${calcResults.length} operations`
      : `Input1: ${calcResults[0].input1}, Input2: ${calcResults[0].input2 || "-"}, Op: ${
          calcResults[0].operation
        }`;
    saveToHistory(
      params,
      JSON.stringify(
        calcResults.map((r) => ({
          input1: r.input1,
          input2: r.input2,
          operation: r.operation,
          result: r.result,
          decimalResult: r.decimalResult,
        }))
      ).substring(0, 100) + "..."
    );

    lastResults.current = calcResults;
    updateVisualizations(calcResults, isBatch);
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const decimals = statInput
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n));
      if (decimals.length === 0) throw new Error("Invalid decimal list");

      const stats = {
        mean: window.math.mean(decimals),
        median: window.math.median(decimals),
        stdDev: window.math.std(decimals),
        min: Math.min(...decimals),
        max: Math.max(...decimals),
      };
      const statsText = (
        <div>
          Mean: {stats.mean.toFixed(2)}
          <br />
          Median: {stats.median.toFixed(2)}
          <br />
          Standard Deviation: {stats.stdDev.toFixed(2)}
          <br />
          Min: {stats.min}
          <br />
          Max: {stats.max}
        </div>
      );
      const expression = `Stats(${decimals.join(", ")})`;

      setResults({
        content: (
          <div>
            <strong>Statistical Analysis (Decimal):</strong>
            <br />
            {statsText}
          </div>
        ),
        stats: "",
      });
      setShowResults(true);

      saveToHistory(expression, JSON.stringify(stats).replace(/<br>/g, "; "));
      updateBarChart(decimals, true);
    } catch (e) {
      showError("Invalid statistical input");
    }
  };

  const updateVisualizations = (calcResults, isBatch) => {
    updateBarChart(
      calcResults.map((r) => r.decimalResult),
      isBatch
    );

    let stepTable = "";
    if (!isBatch && calcResults.length === 1) {
      const r = calcResults[0];
      if (["add", "subtract"].includes(r.operation)) {
        let maxLen = Math.max(r.input1.length, r.input2.length, r.result.length);
        if (r.operation === "add" && r.steps.some((s) => s.includes("carry 1"))) maxLen++;
        let carries =
          r.operation === "add" ? r.steps.map((s) => (s.includes("carry 1") ? "1" : "0")).reverse() : [];
        if (carries.length < maxLen) carries.unshift("0");
        stepTable = (
          <table className="w-full text-sm text-gray-600 font-mono text-center">
            <thead>
              <tr>
                <th>{r.operation === "add" ? "+" : "-"}</th>
                <th>{r.input1.padStart(maxLen, "0")}</th>
                <th>{r.input2.padStart(maxLen, "0")}</th>
                <th>= {r.result.padStart(maxLen, "0")}</th>
              </tr>
            </thead>
            <tbody>
              {r.operation === "add" && (
                <tr>
                  <td>Carry:</td>
                  <td colSpan="3">{carries.join("")}</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      } else {
        stepTable = <p>Step-by-step table available for addition and subtraction.</p>;
      }
    } else {
      stepTable = <p>Step table available for single arithmetic operations.</p>;
    }
    setResults((prev) => ({ ...prev, stepTable }));
  };

  const updateBarChart = (decimals, isBatch) => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new window.Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: isBatch ? decimals.map((_, i) => `Op ${i + 1}`) : ["Result"],
        datasets: [
          {
            label: "Decimal Value",
            data: decimals,
            backgroundColor: "#ef4444", // Primary color
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Decimal Value" }, beginAtZero: true },
          x: { title: { display: true, text: isBatch ? "Operation" : "Calculation" } },
        },
        plugins: { title: { display: true, text: "Decimal Values" } },
      },
    });
  };

  const clearInputs = () => {
    clearMessages();
    setInput1("");
    setInput2("");
    setOperation("add");
    setLeadingZeros("0");
    setBatchText("");
    setBatchFile(null);
    setStatInput("");
    setShowResults(false);
    setResults([]);
    lastResults.current = [];
    showSuccess("Inputs cleared!");
  };

  const saveToHistory = (params, result) => {
    const newHistory = [...history, { date: new Date().toLocaleString(), params, result }];
    setHistory(newHistory);
    localStorage.setItem("binaryCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const csvContent = [["Date", "Parameters", "Result"], ...history.map((h) => [h.date, h.params, h.result])]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "binary_calc_history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportJSON = () => {
    const jsonContent = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "binary_calc_history.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Binary Calculator History", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    history.forEach((h) => {
      doc.text(`Date: ${h.date}, Params: ${h.params}, Result: ${h.result}`, 10, y);
      y += 10;
    });
    doc.text("Note: Visualizations and full steps are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("binary_calc_history.pdf");
  };

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">Advanced Binary Calculator</h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Input 1<span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter binary or decimal number.
                  </span>
                </label>
                <input
                  type="text"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 101 or 5"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Input 2<span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter second binary number for arithmetic (optional).
                  </span>
                </label>
                <input
                  type="text"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 11"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Operation
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select arithmetic or conversion operation.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                >
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                  <option value="multiply">Multiply</option>
                  <option value="divide">Divide</option>
                  <option value="bin-to-dec">Binary to Decimal</option>
                  <option value="dec-to-bin">Decimal to Binary</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Leading Zeros
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Number of leading zeros for binary output.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={leadingZeros}
                  onChange={(e) => setLeadingZeros(e.target.value)}
                >
                  <option value="0">None</option>
                  <option value="4">4 Zeros</option>
                  <option value="8">8 Zeros</option>
                  <option value="16">16 Zeros</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: Input1,Input2,Operation)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter operations (e.g., 101,11,add;101,bin-to-dec).
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
                placeholder="e.g., 101,11,add;101,bin-to-dec"
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
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Analyze Decimal Values (comma-separated)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter decimal results for statistical analysis.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 5,10,15"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={calculateStats}
                >
                  Calculate Statistics
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
                <h3 className="text-md font-medium text-gray-700">Decimal Values</h3>
                <canvas ref={chartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Calculation Steps</h3>
                <div className="text-gray-600">{results.stepTable}</div>
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
