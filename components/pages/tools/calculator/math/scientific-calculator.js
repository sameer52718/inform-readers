"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState("deg");
  const [notationMode, setNotationMode] = useState("fixed");
  const [precision, setPrecision] = useState("2");
  const [statData, setStatData] = useState("");
  const [complexInput, setComplexInput] = useState("");
  const [matrixInput, setMatrixInput] = useState("");
  const [equationInput, setEquationInput] = useState("");
  const [functionInput, setFunctionInput] = useState("");
  const [functionX, setFunctionX] = useState("");
  const [unitType, setUnitType] = useState("length");
  const [unitValue, setUnitValue] = useState("");
  const [graphFunction, setGraphFunction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState("");
  const [history, setHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const graphChartRef = useRef(null);
  const statBarChartRef = useRef(null);
  const graphChartInstance = useRef(null);
  const statBarChartInstance = useRef(null);
  const userFunction = useRef(null);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("calculationHistory");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(
            parsed.filter(
              (entry) =>
                entry &&
                typeof entry.date === "string" &&
                typeof entry.expression === "string" &&
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

    // Keyboard input
    const handleKeydown = (e) => {
      const key = e.key;
      if (/[0-9]/.test(key)) appendToDisplay(key);
      else if (key === "+") appendToDisplay("+");
      else if (key === "-") appendToDisplay("-");
      else if (key === "*") appendToDisplay("*");
      else if (key === "/") appendToDisplay("/");
      else if (key === ".") appendToDisplay(".");
      else if (key === "(") appendToDisplay("(");
      else if (key === ")") appendToDisplay(")");
      else if (key === "Enter") calculate();
      else if (key === "Backspace") backspace();
      else if (key === "Escape") clearDisplay();
    };
    document.addEventListener("keydown", handleKeydown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      if (graphChartInstance.current) graphChartInstance.current.destroy();
      if (statBarChartInstance.current) statBarChartInstance.current.destroy();
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

  const appendToDisplay = (value) => {
    clearMessages();
    setDisplay((prev) =>
      prev === "0" && !["+", "-", "*", "/", "^", "(", "%"].includes(value) ? value : prev + value
    );
  };

  const clearDisplay = () => {
    clearMessages();
    setDisplay("0");
  };

  const backspace = () => {
    clearMessages();
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const memoryOperation = (op) => {
    clearMessages();
    try {
      const current = parseFloat(evaluateExpression(display));
      switch (op) {
        case "MC":
          setMemory(0);
          showSuccess("Memory cleared");
          break;
        case "M+":
          setMemory((prev) => prev + current);
          showSuccess(`Added ${current} to memory`);
          break;
        case "M-":
          setMemory((prev) => prev - current);
          showSuccess(`Subtracted ${current} from memory`);
          break;
        case "MR":
          setDisplay(memory.toString());
          showSuccess(`Recalled memory: ${memory}`);
          break;
        default:
          throw new Error("Invalid memory operation");
      }
    } catch (e) {
      showError("Invalid memory operation");
    }
  };

  const evaluateExpression = (expr) => {
    const precisionVal = parseInt(precision);
    let formattedExpr = expr.replace(/pi/g, "pi").replace(/e/g, "e").replace(/!/g, "!");

    const parser = window.math.parser();
    if (angleMode === "deg") {
      parser.evaluate("sin(x) = sin(x * pi / 180)");
      parser.evaluate("cos(x) = cos(x * pi / 180)");
      parser.evaluate("tan(x) = tan(x * pi / 180)");
      parser.evaluate("asin(x) = asin(x) * 180 / pi");
      parser.evaluate("acos(x) = acos(x) * 180 / pi");
      parser.evaluate("atan(x) = atan(x) * 180 / pi");
    }

    let result = parser.evaluate(formattedExpr);

    if (window.math.typeOf(result) === "Complex") {
      result = `${result.re}${result.im >= 0 ? "+" : ""}${result.im}i`;
    } else {
      result = Number(result.toFixed(precisionVal));
      if (notationMode === "scientific") {
        result = result.toExponential(precisionVal);
      } else if (notationMode === "engineering") {
        const exp = Math.floor(Math.log10(Math.abs(result)) / 3) * 3;
        result = (result / Math.pow(10, exp)).toFixed(precisionVal) + "e" + exp;
      } else {
        result = result.toFixed(precisionVal);
      }
    }
    return result;
  };

  const calculate = () => {
    clearMessages();
    try {
      const result = evaluateExpression(display);
      setDisplay(result);
      saveToHistory(display, result);
      updateHistoryTable();
    } catch (e) {
      showError("Invalid expression");
    }
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const data = statData
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n));
      if (data.length === 0) throw new Error("No valid data");
      const mean = window.math.mean(data).toFixed(2);
      const median = window.math.median(data).toFixed(2);
      const std = window.math.std(data).toFixed(2);
      const variance = window.math.variance(data).toFixed(2);
      const result = `Mean: ${mean}, Median: ${median}, Std Dev: ${std}, Variance: ${variance}`;
      setResults(result);
      saveToHistory(`Stats(${statData})`, result);
      updateHistoryTable();
      updateStatChart(data);
    } catch (e) {
      showError("Invalid statistical data");
    }
  };

  const calculateComplex = () => {
    clearMessages();
    try {
      const result = evaluateExpression(complexInput);
      setResults(`Result: ${result}`);
      saveToHistory(complexInput, result);
      updateHistoryTable();
    } catch (e) {
      showError("Invalid complex number expression");
    }
  };

  const calculateMatrix = () => {
    clearMessages();
    try {
      const result = window.math.evaluate(matrixInput);
      const formattedResult = JSON.stringify(result, null, 2);
      setResults(`Result: ${formattedResult}`);
      saveToHistory(matrixInput, formattedResult);
      updateHistoryTable();
    } catch (e) {
      showError("Invalid matrix expression");
    }
  };

  const solveEquation = () => {
    clearMessages();
    const input = equationInput.replace(/\s/g, "");
    try {
      let result;
      if (input.includes("x^2")) {
        const match = input.match(/([-]?\d*)x\^2([+-]?\d*)x([+-]?\d*)=0/);
        if (!match) throw new Error("Invalid quadratic");
        const a = parseFloat(match[1] || 1);
        const b = parseFloat(match[2] || 0);
        const c = parseFloat(match[3] || 0);
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
          result = "No real roots";
        } else {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          result = `x = ${x1.toFixed(2)}, ${x2.toFixed(2)}`;
        }
      } else {
        const match = input.match(/([-]?\d*)x([+-]?\d*)=([-]?\d*)/);
        if (!match) throw new Error("Invalid linear");
        const a = parseFloat(match[1] || 1);
        const b = parseFloat(match[2] || 0);
        const c = parseFloat(match[3] || 0);
        const x = (c - b) / a;
        result = `x = ${x.toFixed(2)}`;
      }
      setResults(`Solution: ${result}`);
      saveToHistory(input, result);
      updateHistoryTable();
    } catch (e) {
      showError("Invalid equation");
    }
  };

  const evaluateFunction = () => {
    clearMessages();
    try {
      const match = functionInput.match(/f\(x\)=(.*)/);
      if (!match) throw new Error("Invalid function");
      const expr = match[1];
      const xValue = parseFloat(functionX);
      if (isNaN(xValue)) throw new Error("Invalid x value");
      const result = window.math.evaluate(expr, { x: xValue });
      setResults(`f(${xValue}) = ${result.toFixed(2)}`);
      saveToHistory(`f(x)=${expr}, x=${xValue}`, result.toFixed(2));
      updateHistoryTable();
      userFunction.current = expr;
    } catch (e) {
      showError("Invalid function or x value");
    }
  };

  const convertUnits = () => {
    clearMessages();
    const value = parseFloat(unitValue);
    if (isNaN(value)) {
      showError("Invalid value");
      return;
    }
    let result, unit;
    switch (unitType) {
      case "length":
        result = (value * 0.621371).toFixed(2);
        unit = "mi";
        break;
      case "mass":
        result = (value * 2.20462).toFixed(2);
        unit = "lb";
        break;
      case "temp":
        result = ((value * 9) / 5 + 32).toFixed(2);
        unit = "°F";
        break;
      case "angle":
        result = ((value * Math.PI) / 180).toFixed(2);
        unit = "rad";
        break;
      default:
        throw new Error("Invalid unit type");
    }
    setResults(`${value} → ${result} ${unit}`);
    saveToHistory(`${value} ${unitType}`, `${result} ${unit}`);
    updateHistoryTable();
  };

  const plotGraph = () => {
    clearMessages();
    try {
      const xValues = [];
      const yValues = [];
      for (let x = -10; x <= 10; x += 0.1) {
        xValues.push(x);
        yValues.push(window.math.evaluate(graphFunction, { x }));
      }
      if (graphChartInstance.current) graphChartInstance.current.destroy();
      if (graphChartRef.current) {
        graphChartInstance.current = new window.Chart(graphChartRef.current, {
          type: "line",
          data: {
            labels: xValues,
            datasets: [
              {
                label: graphFunction,
                data: yValues,
                borderColor: "#ef4444",
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: { title: { display: true, text: "x" } },
              y: { title: { display: true, text: "y" } },
            },
            plugins: {
              title: { display: true, text: `Graph of ${graphFunction}` },
            },
          },
        });
      }
      saveToHistory(`Graph ${graphFunction}`, "Plotted");
      updateHistoryTable();
    } catch (e) {
      showError("Invalid function for graphing");
    }
  };

  const updateStatChart = (data) => {
    if (statBarChartInstance.current) statBarChartInstance.current.destroy();
    if (statBarChartRef.current && data.length > 0) {
      statBarChartInstance.current = new window.Chart(statBarChartRef.current, {
        type: "bar",
        data: {
          labels: data.map((_, i) => `Value ${i + 1}`),
          datasets: [
            {
              label: "Data",
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
            y: { title: { display: true, text: "Value" }, beginAtZero: true },
          },
          plugins: {
            title: { display: true, text: "Statistical Data" },
          },
        },
      });
    }
  };

  const saveToHistory = (expression, result) => {
    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        expression: String(expression || ""),
        result: String(result || ""),
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("calculationHistory", JSON.stringify(newHistory));
  };

  const updateHistoryTable = () => {
    // Handled in JSX rendering
  };

  const exportCSV = () => {
    const headers = ["Date", "Expression", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.expression}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calculator_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Scientific Calculator History", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    history.forEach((entry) => {
      doc.text(`Date: ${entry.date}, Expr: ${entry.expression}, Result: ${entry.result}`, 10, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.text("Note: Graphs and advanced results are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("calculator_history.pdf");
  };

  const buttons = [
    // Row 1
    { label: "C", onClick: clearDisplay, bg: "bg-red-500 text-white" },
    { label: "(", onClick: () => appendToDisplay("("), bg: "bg-gray-300" },
    { label: ")", onClick: () => appendToDisplay(")"), bg: "bg-gray-300" },
    { label: "%", onClick: () => appendToDisplay("%"), bg: "bg-gray-300" },
    { label: "MC", onClick: () => memoryOperation("MC"), bg: "bg-red-500 text-white" },
    // Row 2
    { label: "sin", onClick: () => appendToDisplay("sin("), bg: "bg-red-500 text-white" },
    { label: "cos", onClick: () => appendToDisplay("cos("), bg: "bg-red-500 text-white" },
    { label: "tan", onClick: () => appendToDisplay("tan("), bg: "bg-red-500 text-white" },
    { label: "√", onClick: () => appendToDisplay("sqrt("), bg: "bg-red-500 text-white" },
    { label: "M+", onClick: () => memoryOperation("M+"), bg: "bg-red-500 text-white" },
    // Row 3
    { label: "asin", onClick: () => appendToDisplay("asin("), bg: "bg-red-500 text-white" },
    { label: "acos", onClick: () => appendToDisplay("acos("), bg: "bg-red-500 text-white" },
    { label: "atan", onClick: () => appendToDisplay("atan("), bg: "bg-red-500 text-white" },
    { label: "∛", onClick: () => appendToDisplay("cbrt("), bg: "bg-red-500 text-white" },
    { label: "M-", onClick: () => memoryOperation("M-"), bg: "bg-red-500 text-white" },
    // Row 4
    { label: "ln", onClick: () => appendToDisplay("ln("), bg: "bg-red-500 text-white" },
    { label: "log", onClick: () => appendToDisplay("log("), bg: "bg-red-500 text-white" },
    { label: "e^x", onClick: () => appendToDisplay("exp("), bg: "bg-red-500 text-white" },
    { label: "^", onClick: () => appendToDisplay("^"), bg: "bg-gray-300" },
    { label: "MR", onClick: () => memoryOperation("MR"), bg: "bg-red-500 text-white" },
    // Row 5
    { label: "7", onClick: () => appendToDisplay("7"), bg: "bg-gray-200" },
    { label: "8", onClick: () => appendToDisplay("8"), bg: "bg-gray-200" },
    { label: "9", onClick: () => appendToDisplay("9"), bg: "bg-gray-200" },
    { label: "÷", onClick: () => appendToDisplay("/"), bg: "bg-gray-300" },
    { label: "π", onClick: () => appendToDisplay("pi"), bg: "bg-red-500 text-white" },
    // Row 6
    { label: "4", onClick: () => appendToDisplay("4"), bg: "bg-gray-200" },
    { label: "5", onClick: () => appendToDisplay("5"), bg: "bg-gray-200" },
    { label: "6", onClick: () => appendToDisplay("6"), bg: "bg-gray-200" },
    { label: "×", onClick: () => appendToDisplay("*"), bg: "bg-gray-300" },
    { label: "e", onClick: () => appendToDisplay("e"), bg: "bg-red-500 text-white" },
    // Row 7
    { label: "1", onClick: () => appendToDisplay("1"), bg: "bg-gray-200" },
    { label: "2", onClick: () => appendToDisplay("2"), bg: "bg-gray-200" },
    { label: "3", onClick: () => appendToDisplay("3"), bg: "bg-gray-200" },
    { label: "-", onClick: () => appendToDisplay("-"), bg: "bg-gray-300" },
    { label: "!", onClick: () => appendToDisplay("!"), bg: "bg-red-500 text-white" },
    // Row 8
    { label: "0", onClick: () => appendToDisplay("0"), bg: "bg-gray-200" },
    { label: ".", onClick: () => appendToDisplay("."), bg: "bg-gray-200" },
    { label: "=", onClick: calculate, bg: "bg-red-500 text-white" },
    { label: "+", onClick: () => appendToDisplay("+"), bg: "bg-gray-300" },
    { label: "←", onClick: backspace, bg: "bg-red-500 text-white" },
  ];

  return (
    <>
      <div className=" bg-white flex justify-center items-center p-4 font-inter">
        <div className="w-full max-w-4xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">
            Advanced Scientific Calculator
          </h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <div className="mb-4">
            <input
              id="display"
              type="text"
              readOnly
              className="w-full p-4 bg-gray-200 text-gray-800 rounded-lg font-mono text-right text-xl overflow-x-auto whitespace-nowrap"
              value={display}
            />
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Angle Mode
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Select degrees or radians for trigonometric functions.
                </span>
              </label>
              <select
                className="p-2 border rounded-lg w-full bg-gray-200"
                value={angleMode}
                onChange={(e) => setAngleMode(e.target.value)}
              >
                <option value="deg">Degrees</option>
                <option value="rad">Radians</option>
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Notation Mode
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Select output format: fixed, scientific, or engineering.
                </span>
              </label>
              <select
                className="p-2 border rounded-lg w-full bg-gray-200"
                value={notationMode}
                onChange={(e) => setNotationMode(e.target.value)}
              >
                <option value="fixed">Fixed</option>
                <option value="scientific">Scientific</option>
                <option value="engineering">Engineering</option>
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Precision
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Number of decimal places for output.
                </span>
              </label>
              <select
                className="p-2 border rounded-lg w-full bg-gray-200"
                value={precision}
                onChange={(e) => setPrecision(e.target.value)}
              >
                <option value="2">2 Decimals</option>
                <option value="4">4 Decimals</option>
                <option value="6">6 Decimals</option>
                <option value="8">8 Decimals</option>
                <option value="10">10 Decimals</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {buttons.map((btn, i) => (
              <button
                key={i}
                className={`p-2.5 text-lg rounded-lg ${btn.bg} hover:brightness-110`}
                onClick={btn.onClick}
              >
                {btn.label}
              </button>
            ))}
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Calculations</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Statistical Data (e.g., 1,2,3)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter numbers separated by commas.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="1,2,3"
                  value={statData}
                  onChange={(e) => setStatData(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={calculateStats}
                >
                  Calculate Statistics
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Complex Number Operation (e.g., (3+2i)+(1+4i))
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Use format (a+bi) for complex numbers.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="(3+2i)+(1+4i)"
                  value={complexInput}
                  onChange={(e) => setComplexInput(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={calculateComplex}
                >
                  Calculate Complex
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Matrix Operation (e.g., [[1,2],[3,4]]+[[5,6],[7,8]])
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter 2x2 or 3x3 matrices.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="[[1,2],[3,4]]+[[5,6],[7,8]]"
                  value={matrixInput}
                  onChange={(e) => setMatrixInput(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={calculateMatrix}
                >
                  Calculate Matrix
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Equation (e.g., 2x+3=7 or x^2-5x+6=0)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter linear or quadratic equations.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="2x+3=7"
                  value={equationInput}
                  onChange={(e) => setEquationInput(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={solveEquation}
                >
                  Solve Equation
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Define Function (e.g., f(x)=x^2+2x+1)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Define a function of x.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="f(x)=x^2+2x+1"
                  value={functionInput}
                  onChange={(e) => setFunctionInput(e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-600 mb-2 mt-2 relative group">
                  Evaluate at x<span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter value for x.
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="2"
                  value={functionX}
                  onChange={(e) => setFunctionX(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={evaluateFunction}
                >
                  Evaluate Function
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Unit Conversion
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select conversion type and value.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200 mb-2"
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                >
                  <option value="length">Length (km ↔ mi)</option>
                  <option value="mass">Mass (kg ↔ lb)</option>
                  <option value="temp">Temperature (°C ↔ °F)</option>
                  <option value="angle">Angle (deg ↔ rad)</option>
                </select>
                <input
                  type="number"
                  step="any"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="1"
                  value={unitValue}
                  onChange={(e) => setUnitValue(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={convertUnits}
                >
                  Convert
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Function to Graph (e.g., sin(x))
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter a function of x.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="sin(x)"
                  value={graphFunction}
                  onChange={(e) => setGraphFunction(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={plotGraph}
                >
                  Plot Graph
                </button>
              </div>
            </div>
          )}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
            <div className="text-gray-600 mb-4">{results}</div>
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
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-700">Function Graph</h3>
              <canvas ref={graphChartRef} className="max-h-80" />
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-700">Statistical Data</h3>
              <canvas ref={statBarChartRef} className="max-h-80" />
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
                onClick={exportPDF}
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
