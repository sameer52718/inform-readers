"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [expression, setExpression] = useState("");
  const [memory, setMemory] = useState(null);
  const [angleMode, setAngleMode] = useState("deg");
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Initialize BigNumber and history
    if (typeof window !== "undefined") {
      window.BigNumber.config({ DECIMAL_PLACES: 20, ROUNDING_MODE: window.BigNumber.ROUND_HALF_UP });
      setMemory(new window.BigNumber(0));
      try {
        const stored = localStorage.getItem("calcHistory");
        setHistory(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.error("Failed to load history:", e);
      }
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
      loadScript("https://cdn.jsdelivr.net/npm/bignumber.js@9.1.2/bignumber.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
    ]).catch((err) => console.error("Failed to load scripts:", err));

    // Keyboard support
    const handleKeyDown = (e) => {
      if (/\d/.test(e.key)) appendNumber(e.key);
      else if (e.key === ".") appendChar(".");
      else if (e.key === "+") appendChar("+");
      else if (e.key === "-") appendChar("-");
      else if (e.key === "*") appendChar("*");
      else if (e.key === "/") appendChar("/");
      else if (e.key === "(") appendChar("(");
      else if (e.key === ")") appendChar(")");
      else if (e.key === "Enter") calculate();
      else if (e.key === "Backspace") deleteChar();
      else if (e.key === "Escape") clearAll();
    };
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const appendNumber = (num) => {
    setExpression((prev) => prev + num);
  };

  const appendChar = (char) => {
    setExpression((prev) => prev + char);
  };

  const appendOperation = (op, isFunction) => {
    setExpression((prev) => prev + (isFunction ? `${op}(` : ` ${op} `));
  };

  const deleteChar = () => {
    setExpression((prev) => prev.trim().slice(0, -1));
  };

  const clearAll = () => {
    setExpression("");
    clearChart();
  };

  const memoryClear = () => {
    setMemory(new window.BigNumber(0));
    showError("Memory cleared");
  };

  const memoryAdd = () => {
    try {
      const result = evaluateExpression(expression);
      setMemory((prev) => prev.plus(result));
      showError(`Added to memory: ${memory.plus(result).toString()}`);
    } catch (e) {
      showError("Cannot add to memory: " + e.message);
    }
  };

  const memorySubtract = () => {
    try {
      const result = evaluateExpression(expression);
      setMemory((prev) => prev.minus(result));
      showError(`Subtracted from memory: ${memory.minus(result).toString()}`);
    } catch (e) {
      showError("Cannot subtract from memory: " + e.message);
    }
  };

  const memoryRecall = () => {
    setExpression((prev) => prev + memory.toString());
  };

  const toggleAngleMode = () => {
    setAngleMode((prev) => (prev === "deg" ? "rad" : "deg"));
    showError(`Angle mode: ${angleMode === "deg" ? "RAD" : "DEG"}`);
  };

  const evaluateExpression = (expr) => {
    try {
      let evalExpr = expr
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/pow\(([^,]+),\s*([^)]+)\)/g, "$1 ** $2")
        .replace(/mod/g, "%")
        .replace(/fact\(([^)]+)\)/g, (match, num) => {
          const n = parseInt(num);
          if (!Number.isInteger(n) || n < 0) throw new Error("Factorial requires non-negative integer");
          let result = new window.BigNumber(1);
          for (let i = 2; i <= n; i++) {
            result = result.times(i);
          }
          return result.toString();
        });

      if (angleMode === "deg") {
        evalExpr = evalExpr
          .replace(/Math.sin\(([^)]+)\)/g, "Math.sin($1 * Math.PI / 180)")
          .replace(/Math.cos\(([^)]+)\)/g, "Math.cos($1 * Math.PI / 180)")
          .replace(/Math.tan\(([^)]+)\)/g, "Math.tan($1 * Math.PI / 180)");
      }

      const result = new window.BigNumber(
        eval(evalExpr.replace(/[0-9.]+/g, (num) => `new window.BigNumber(${num})`))
      );
      if (!result.isFinite()) throw new Error("Result is not finite");
      return result;
    } catch (e) {
      throw new Error(e.message || "Invalid expression");
    }
  };

  const calculate = () => {
    try {
      const result = evaluateExpression(expression);
      const resultStr = result.toString();
      saveToHistory(expression, resultStr);
      setExpression(resultStr);
      updateChart(result.abs().toNumber());
    } catch (e) {
      showError(e.message);
    }
  };

  const saveToHistory = (expr, result) => {
    const entry = {
      date: new Date().toLocaleString(),
      expression: expr,
      result,
    };
    const newHistory = [...history, entry];
    setHistory(newHistory);
    localStorage.setItem("calcHistory", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calcHistory");
    showError("History cleared");
  };

  const updateChart = (value) => {
    if (!chartRef.current) return;
    setShowChart(true);
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new window.Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Result Magnitude"],
        datasets: [
          {
            label: "Value",
            data: [Math.min(value, 1e10)], // Cap for visualization
            backgroundColor: "#ef4444", // Primary color
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Magnitude" } },
        },
        plugins: { title: { display: true, text: "Result Magnitude" } },
      },
    });
  };

  const clearChart = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
    setShowChart(false);
  };

  const exportCSV = () => {
    const headers = ["Date", "Expression", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.expression}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calc_history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calc_history.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Calculation History", 10, 10);
    let y = 20;
    history.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Expression: ${entry.expression}`, 10, y + 10);
      doc.text(`Result: ${entry.result}`, 10, y + 20);
      y += 30;
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("calc_history.pdf");
  };

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-2xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">Big Number Calculator</h1>
          <div className="bg-gray-200 rounded-lg p-4 text-right text-xl mb-6 shadow-inner">
            {expression || "0"}
          </div>
          {errorMessage && <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>}
          <div className="grid grid-cols-5 gap-2 mb-6 sm:grid-cols-4">
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={clearAll}
            >
              C
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendChar("(")}
            >
              (
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendChar(")")}
            >
              )
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={deleteChar}
            >
              ⌫
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={memoryClear}
            >
              MC
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold relative group"
              onClick={() => appendOperation("sin", true)}
            >
              sin
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-12 left-0 z-10">
                Sine function (degrees/radians)
              </span>
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold relative group"
              onClick={() => appendOperation("cos", true)}
            >
              cos
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-12 left-0 z-10">
                Cosine function (degrees/radians)
              </span>
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold relative group"
              onClick={() => appendOperation("tan", true)}
            >
              tan
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-12 left-0 z-10">
                Tangent function (degrees/radians)
              </span>
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold relative group"
              onClick={() => appendOperation("sqrt", true)}
            >
              √
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-12 left-0 z-10">
                Square root
              </span>
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={memoryRecall}
            >
              MR
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendNumber("7")}
            >
              7
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendNumber("8")}
            >
              8
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendNumber("9")}
            >
              9
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold text-red-500"
              onClick={() => appendChar("/")}
            >
              ÷
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={memoryAdd}
            >
              M+
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendNumber("4")}
            >
              4
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendNumber("5")}
            >
              5
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendNumber("6")}
            >
              6
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold text-red-500"
              onClick={() => appendChar("*")}
            >
              ×
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={memorySubtract}
            >
              M-
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendNumber("1")}
            >
              1
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendNumber("2")}
            >
              2
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendNumber("3")}
            >
              3
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold text-red-500"
              onClick={() => appendChar("-")}
            >
              -
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold relative group"
              onClick={() => appendOperation("mod", false)}
            >
              mod
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-12 left-0 z-10">
                Modulus (remainder)
              </span>
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendNumber("0")}
            >
              0
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={() => appendChar(".")}
            >
              .
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold relative group"
              onClick={() => appendOperation("pow", false)}
            >
              xⁿ
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-12 left-0 z-10">
                Power (x raised to n)
              </span>
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold text-red-500"
              onClick={() => appendChar("+")}
            >
              +
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold relative group"
              onClick={() => appendOperation("fact", true)}
            >
              n!
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-12 left-0 z-10">
                Factorial
              </span>
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold relative group"
              onClick={() => appendOperation("log", true)}
            >
              log
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-12 left-0 z-10">
                Logarithm (base 10)
              </span>
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold relative group"
              onClick={() => appendOperation("ln", true)}
            >
              ln
              <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-12 left-0 z-10">
                Natural logarithm
              </span>
            </button>
            <button
              className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 active:shadow-inner font-bold"
              onClick={toggleAngleMode}
            >
              Deg/Rad
            </button>
            <button
              className="p-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 active:shadow-inner font-bold"
              onClick={calculate}
            >
              =
            </button>
          </div>
          <div className="flex gap-4 mb-6">
            <button
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 active:shadow-inner"
              onClick={clearHistory}
            >
              Clear History
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 active:shadow-inner"
              onClick={exportCSV}
            >
              Export CSV
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 active:shadow-inner"
              onClick={exportJSON}
            >
              Export JSON
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 active:shadow-inner"
              onClick={exportPDF}
            >
              Export PDF
            </button>
          </div>
          {showChart && (
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-700">Result Magnitude</h3>
              <canvas ref={chartRef} className="max-w-[600px] h-[300px] mx-auto" />
            </div>
          )}
          {history.length > 0 && (
            <div className="mt-6 max-h-52 overflow-y-auto">
              <h3 className="text-md font-medium text-gray-700">Calculation History</h3>
              <table className="w-full text-sm text-gray-600">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Date</th>
                    <th className="p-2">Expression</th>
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
                        <td className="p-2">{entry.expression}</td>
                        <td className="p-2">{entry.result}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
