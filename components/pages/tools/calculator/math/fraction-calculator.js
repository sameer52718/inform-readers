"use client";
import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function FractionCalculator() {
  const [whole1, setWhole1] = useState("");
  const [num1, setNum1] = useState("");
  const [den1, setDen1] = useState("");
  const [whole2, setWhole2] = useState("");
  const [num2, setNum2] = useState("");
  const [den2, setDen2] = useState("");
  const [operation, setOperation] = useState("add");
  const [exponent, setExponent] = useState("2");
  const [outputFormat, setOutputFormat] = useState("fraction");
  const [simplifyMode, setSimplifyMode] = useState("always");
  const [precision, setPrecision] = useState("2");
  const [decimalInput, setDecimalInput] = useState("");
  const [statData, setStatData] = useState("");
  const [cfNum, setCfNum] = useState("");
  const [cfDen, setCfDen] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resultContent, setResultContent] = useState("");
  const [stepsContent, setStepsContent] = useState("");
  const [calculationHistory, setCalculationHistory] = useState([]);
  const numberLineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const statBarChartRef = useRef(null);
  const numberLineChartInstance = useRef(null);
  const pieChartInstance = useRef(null);
  const statBarChartInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("fractionCalculationHistory")) || [];
    setCalculationHistory(savedHistory);
  }, []);

  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

  const simplifyFraction = (num, den) => {
    const g = gcd(num, den);
    return { num: num / g, den: den / g };
  };

  const toMixedNumber = (num, den) => {
    const whole = Math.floor(num / den);
    const remNum = num % den;
    if (remNum === 0) return whole;
    const simplified = simplifyFraction(remNum, den);
    return whole ? `${whole}_${simplified.num}/${simplified.den}` : `${simplified.num}/${simplified.den}`;
  };

  const fractionToDecimal = (num, den, precision) => (num / den).toFixed(precision);

  const decimalToFraction = (decimal, maxDen = 1000) => {
    let num = decimal;
    let den = 1;
    let factor = 1;
    while (Math.abs(num - Math.round(num)) > 1e-10 && den < maxDen) {
      num *= 10;
      den *= 10;
      factor *= 10;
    }
    num = Math.round(num);
    const g = gcd(num, den);
    return simplifyFraction(num / g, den / g);
  };

  const parseFraction = (whole, num, den) => {
    whole = parseInt(whole) || 0;
    num = parseInt(num) || 0;
    den = parseInt(den) || 1;
    if (den === 0) throw new Error("Denominator cannot be zero");
    const totalNum = whole * den + num;
    return simplifyFraction(totalNum, den);
  };

  const formatOutput = (num, den, format, precision) => {
    const simplified = simplifyFraction(num, den);
    if (format === "mixed" && simplified.num >= simplified.den) {
      return toMixedNumber(simplified.num, simplified.den);
    } else if (format === "decimal") {
      return fractionToDecimal(simplified.num, simplified.den, precision);
    } else {
      return `${simplified.num}/${simplified.den}`;
    }
  };

  const calculate = () => {
    clearMessages();
    try {
      const frac1 = parseFraction(whole1, num1, den1);
      const frac2 = operation !== "exponentiate" ? parseFraction(whole2, num2, den2) : { num: 1, den: 1 };
      let result,
        steps = [],
        expression;

      switch (operation) {
        case "add":
          const lcmDen = lcm(frac1.den, frac2.den);
          const num = frac1.num * (lcmDen / frac1.den) + frac2.num * (lcmDen / frac2.den);
          result = simplifyFraction(num, lcmDen);
          steps.push(`LCM(${frac1.den}, ${frac2.den}) = ${lcmDen}`);
          steps.push(`(${frac1.num}/${frac1.den}) = (${frac1.num * (lcmDen / frac1.den)}/${lcmDen})`);
          steps.push(`(${frac2.num}/${frac2.den}) = (${frac2.num * (lcmDen / frac2.den)}/${lcmDen})`);
          steps.push(
            `(${frac1.num * (lcmDen / frac1.den)}/${lcmDen}) + (${
              frac2.num * (lcmDen / frac2.den)
            }/${lcmDen}) = ${num}/${lcmDen}`
          );
          if (gcd(num, lcmDen) > 1) steps.push(`Simplify: ${num}/${lcmDen} = ${result.num}/${result.den}`);
          expression = `${frac1.num}/${frac1.den} + ${frac2.num}/${frac2.den}`;
          break;
        case "subtract":
          const lcmDenSub = lcm(frac1.den, frac2.den);
          const numSub = frac1.num * (lcmDenSub / frac1.den) - frac2.num * (lcmDenSub / frac2.den);
          result = simplifyFraction(numSub, lcmDenSub);
          steps.push(`LCM(${frac1.den}, ${frac2.den}) = ${lcmDenSub}`);
          steps.push(`(${frac1.num}/${frac1.den}) = (${frac1.num * (lcmDenSub / frac1.den)}/${lcmDenSub})`);
          steps.push(`(${frac2.num}/${frac2.den}) = (${frac2.num * (lcmDenSub / frac2.den)}/${lcmDenSub})`);
          steps.push(
            `(${frac1.num * (lcmDenSub / frac1.den)}/${lcmDenSub}) - (${
              frac2.num * (lcmDenSub / frac2.den)
            }/${lcmDenSub}) = ${numSub}/${lcmDenSub}`
          );
          if (gcd(numSub, lcmDenSub) > 1)
            steps.push(`Simplify: ${numSub}/${lcmDenSub} = ${result.num}/${result.den}`);
          expression = `${frac1.num}/${frac1.den} - ${frac2.num}/${frac2.den}`;
          break;
        case "multiply":
          result = simplifyFraction(frac1.num * frac2.num, frac1.den * frac2.den);
          steps.push(
            `(${frac1.num}/${frac1.den}) × (${frac2.num}/${frac2.den}) = (${frac1.num * frac2.num}/${
              frac1.den * frac2.den
            })`
          );
          if (gcd(frac1.num * frac2.num, frac1.den * frac2.den) > 1)
            steps.push(
              `Simplify: ${frac1.num * frac2.num}/${frac1.den * frac2.den} = ${result.num}/${result.den}`
            );
          expression = `${frac1.num}/${frac1.den} × ${frac2.num}/${frac2.den}`;
          break;
        case "divide":
          result = simplifyFraction(frac1.num * frac2.den, frac1.den * frac2.num);
          steps.push(
            `(${frac1.num}/${frac1.den}) ÷ (${frac2.num}/${frac2.den}) = (${frac1.num}/${frac1.den}) × (${frac2.den}/${frac2.num})`
          );
          steps.push(`= (${frac1.num * frac2.den}/${frac1.den * frac2.num})`);
          if (gcd(frac1.num * frac2.den, frac1.den * frac2.num) > 1)
            steps.push(
              `Simplify: ${frac1.num * frac2.den}/${frac1.den * frac2.num} = ${result.num}/${result.den}`
            );
          expression = `${frac1.num}/${frac1.den} ÷ ${frac2.num}/${frac2.den}`;
          break;
        case "compare":
          const cross1 = frac1.num * frac2.den;
          const cross2 = frac2.num * frac1.den;
          result = { num: 0, den: 1 };
          const comparison = cross1 > cross2 ? ">" : cross1 < cross2 ? "<" : "=";
          steps.push(`Cross-multiply: (${frac1.num}/${frac1.den}) vs (${frac2.num}/${frac2.den})`);
          steps.push(`${frac1.num} × ${frac2.den} = ${cross1}, ${frac2.num} × ${frac1.den} = ${cross2}`);
          steps.push(`${frac1.num}/${frac1.den} ${comparison} ${frac2.num}/${frac2.den}`);
          expression = `${frac1.num}/${frac1.den} vs ${frac2.num}/${frac2.den}`;
          break;
        case "exponentiate":
          result = simplifyFraction(Math.pow(frac1.num, exponent), Math.pow(frac1.den, exponent));
          steps.push(
            `(${frac1.num}/${frac1.den})^${exponent} = (${Math.pow(frac1.num, exponent)}/${Math.pow(
              frac1.den,
              exponent
            )})`
          );
          if (gcd(Math.pow(frac1.num, exponent), Math.pow(frac1.den, exponent)) > 1)
            steps.push(
              `Simplify: ${Math.pow(frac1.num, exponent)}/${Math.pow(frac1.den, exponent)} = ${result.num}/${
                result.den
              }`
            );
          expression = `(${frac1.num}/${frac1.den})^${exponent}`;
          break;
      }

      let finalResult;
      if (simplifyMode === "always" || operation === "compare") {
        finalResult = formatOutput(result.num, result.den, outputFormat, precision);
      } else if (simplifyMode === "improper") {
        finalResult = formatOutput(frac1.num * frac2.den, frac1.den * frac2.num, outputFormat, precision);
      } else {
        finalResult = formatOutput(result.num, result.den, "mixed", precision);
      }

      const resultText =
        operation === "compare"
          ? `${frac1.num}/${frac1.den} ${comparison} ${frac2.num}/${frac2.den}`
          : `Result: ${finalResult}`;
      setResultContent(resultText);
      setStepsContent(`<strong>Steps:</strong><br>${steps.join("<br>")}`);
      saveToHistory(expression, resultText);
      updateVisualizations(
        [
          { num: frac1.num, den: frac1.den, label: `${frac1.num}/${frac1.den}` },
          operation !== "exponentiate"
            ? { num: frac2.num, den: frac2.den, label: `${frac2.num}/${frac2.den}` }
            : null,
          operation !== "compare" ? { num: result.num, den: result.den, label: "Result" } : null,
        ].filter(Boolean)
      );
      setSuccess("Calculation completed successfully");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError(e.message || "Invalid input");
      setTimeout(() => setError(""), 3000);
    }
  };

  const decimalToFractionCalc = () => {
    clearMessages();
    try {
      const decimal = parseFloat(decimalInput);
      if (isNaN(decimal)) throw new Error("Invalid decimal");
      const result = decimalToFraction(decimal);
      const finalResult = formatOutput(result.num, result.den, outputFormat, precision);
      setResultContent(`Result: ${finalResult}`);
      saveToHistory(`${decimal}`, finalResult);
      updateVisualizations([{ num: result.num, den: result.den, label: `${decimal}` }]);
      setSuccess("Conversion completed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError("Invalid decimal input");
      setTimeout(() => setError(""), 3000);
    }
  };

  const calculateStats = () => {
    clearMessages();
    try {
      const fractions = statData.split(",").map((f) => {
        const match = f.match(/(\d+_\d+\/\d+)|(\d+\/\d+)/);
        if (!match) throw new Error("Invalid fraction format");
        if (match[1]) {
          const [whole, frac] = match[1].split("_");
          const [num, den] = frac.split("/").map(Number);
          return parseFraction(whole, num, den);
        } else {
          const [num, den] = match[2].split("/").map(Number);
          return parseFraction(0, num, den);
        }
      });
      const decimals = fractions.map((f) => f.num / f.den);
      const meanNum = math.mean(decimals);
      const meanFrac = decimalToFraction(meanNum);
      const sorted = decimals.slice().sort((a, b) => a - b);
      const medianNum =
        sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];
      const medianFrac = decimalToFraction(medianNum);
      const result = `Mean: ${meanFrac.num}/${meanFrac.den}, Median: ${medianFrac.num}/${medianFrac.den}`;
      setResultContent(result);
      saveToHistory(`Stats(${statData})`, result);
      updateStatChart(fractions);
      setSuccess("Statistics calculated");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError("Invalid statistical data");
      setTimeout(() => setError(""), 3000);
    }
  };

  const calculateContinuedFraction = () => {
    clearMessages();
    try {
      const num = parseInt(cfNum);
      const den = parseInt(cfDen);
      if (den === 0) throw new Error("Denominator cannot be zero");
      let a = num,
        b = den;
      const terms = [];
      while (b !== 0 && terms.length < 10) {
        terms.push(Math.floor(a / b));
        const temp = a % b;
        a = b;
        b = temp;
      }
      const result = `[${terms.join(";")}]`;
      setResultContent(`Continued Fraction: ${result}`);
      saveToHistory(`${num}/${den}`, result);
      updateVisualizations([{ num, den, label: `${num}/${den}` }]);
      setSuccess("Continued fraction calculated");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError("Invalid fraction");
      setTimeout(() => setError(""), 3000);
    }
  };

  const updateVisualizations = (fractions) => {
    if (numberLineChartInstance.current) numberLineChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();

    if (numberLineChartRef.current) {
      numberLineChartInstance.current = new Chart(numberLineChartRef.current, {
        type: "scatter",
        data: {
          datasets: fractions.map((f, i) => ({
            label: f.label,
            data: [{ x: f.num / f.den, y: 0 }],
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"][i % 3],
            pointRadius: 8,
          })),
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: { display: true, text: "Value" },
              min: Math.min(...fractions.map((f) => f.num / f.den)) - 1,
              max: Math.max(...fractions.map((f) => f.num / f.den)) + 1,
            },
            y: { display: false },
          },
          plugins: {
            title: { display: true, text: "Fractions on Number Line" },
            legend: { position: "top" },
          },
        },
      });
    }

    if (pieChartRef.current) {
      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: fractions.map((f) => f.label),
          datasets: [
            {
              data: fractions.map((f) => Math.abs(f.num / f.den)),
              backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: "Fraction Proportions" },
            legend: { position: "top" },
          },
        },
      });
    }
  };

  const updateStatChart = (fractions) => {
    if (statBarChartInstance.current) statBarChartInstance.current.destroy();
    if (statBarChartRef.current) {
      statBarChartInstance.current = new Chart(statBarChartRef.current, {
        type: "bar",
        data: {
          labels: fractions.map((f, i) => `Fraction ${i + 1}`),
          datasets: [
            {
              label: "Value",
              data: fractions.map((f) => f.num / f.den),
              backgroundColor: "#3b82f6",
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

  const clearInputs = () => {
    setWhole1("");
    setNum1("");
    setDen1("");
    setWhole2("");
    setNum2("");
    setDen2("");
    setExponent("2");
    setDecimalInput("");
    setStatData("");
    setCfNum("");
    setCfDen("");
    setResultContent("");
    setStepsContent("");
    clearMessages();
    setSuccess("Inputs cleared");
    setTimeout(() => setSuccess(""), 2000);
  };

  const saveCalculation = () => {
    if (!resultContent) {
      setError("No valid calculation to save");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setSuccess("Calculation saved to history");
    setTimeout(() => setSuccess(""), 2000);
  };

  const saveToHistory = (expression, result) => {
    const updatedHistory = [...calculationHistory, { date: new Date().toLocaleString(), expression, result }];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("fractionCalculationHistory", JSON.stringify(updatedHistory));
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Expression", "Result"],
      ...calculationHistory.map((h) => [h.date, h.expression, h.result]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fraction_calculator_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Fraction Calculator History", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    calculationHistory.forEach((h) => {
      doc.text(`Date: ${h.date}, Expr: ${h.expression}, Result: ${h.result}`, 10, y);
      y += 10;
    });
    doc.text("Note: Visualizations and steps are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("fraction_calculator_history.pdf");
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Fraction Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Fraction Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                First Fraction
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Enter as mixed number (e.g., 1_2/3) or fraction (e.g., 3/4).
                  </span>
                </span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={whole1}
                  onChange={(e) => setWhole1(e.target.value)}
                  placeholder="Whole"
                  className="p-2 border rounded-lg w-24"
                />
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(e.target.value)}
                  placeholder="Num"
                  className="p-2 border rounded-lg w-24"
                />
                <span className="text-gray-600">/</span>
                <input
                  type="number"
                  value={den1}
                  onChange={(e) => setDen1(e.target.value)}
                  placeholder="Den"
                  className="p-2 border rounded-lg w-24"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Second Fraction
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Enter as mixed number or fraction.
                  </span>
                </span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={whole2}
                  onChange={(e) => setWhole2(e.target.value)}
                  placeholder="Whole"
                  className="p-2 border rounded-lg w-24"
                />
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(e.target.value)}
                  placeholder="Num"
                  className="p-2 border rounded-lg w-24"
                />
                <span className="text-gray-600">/</span>
                <input
                  type="number"
                  value={den2}
                  onChange={(e) => setDen2(e.target.value)}
                  placeholder="Den"
                  className="p-2 border rounded-lg w-24"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Operation
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Select the operation to perform.
                  </span>
                </span>
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
                <option value="multiply">Multiply</option>
                <option value="divide">Divide</option>
                <option value="compare">Compare</option>
                <option value="exponentiate">Exponentiate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Exponent (for Exponentiate)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Exponent for the first fraction.
                  </span>
                </span>
              </label>
              <input
                type="number"
                value={exponent}
                onChange={(e) => setExponent(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Output Format
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Choose how results are displayed.
                  </span>
                </span>
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="p-3 border rounded-lg"
              >
                <option value="fraction">Fraction</option>
                <option value="mixed">Mixed Number</option>
                <option value="decimal">Decimal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Simplification
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Choose simplification preference.
                  </span>
                </span>
              </label>
              <select
                value={simplifyMode}
                onChange={(e) => setSimplifyMode(e.target.value)}
                className="p-3 border rounded-lg"
              >
                <option value="always">Always Simplify</option>
                <option value="improper">Keep Improper</option>
                <option value="mixed">Mixed Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Decimal Precision
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Decimal places for decimal output.
                  </span>
                </span>
              </label>
              <select
                value={precision}
                onChange={(e) => setPrecision(e.target.value)}
                className="p-3 border rounded-lg"
              >
                <option value="2">2 Decimals</option>
                <option value="4">4 Decimals</option>
                <option value="6">6 Decimals</option>
                <option value="8">8 Decimals</option>
                <option value="10">10 Decimals</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              {showAdvanced ? "Hide Advanced Features" : "Show Advanced Features"}
            </button>
          </div>

          {showAdvanced && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Calculations</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Decimal to Fraction
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Convert a decimal to a fraction.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={decimalInput}
                  onChange={(e) => setDecimalInput(e.target.value)}
                  placeholder="0.75"
                  className="w-full p-3 border rounded-lg"
                />
                <button
                  onClick={decimalToFractionCalc}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Convert
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Fraction List (e.g., 1/2,3/4)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter fractions separated by commas.
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  value={statData}
                  onChange={(e) => setStatData(e.target.value)}
                  placeholder="1/2,3/4,5/6"
                  className="w-full p-3 border rounded-lg"
                />
                <button onClick={calculateStats} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
                  Calculate Statistics
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Continued Fraction
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter a fraction for continued fraction representation.
                    </span>
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={cfNum}
                    onChange={(e) => setCfNum(e.target.value)}
                    placeholder="Num"
                    className="p-2 border rounded-lg w-24"
                  />
                  <span className="text-gray-600">/</span>
                  <input
                    type="number"
                    value={cfDen}
                    onChange={(e) => setCfDen(e.target.value)}
                    placeholder="Den"
                    className="p-2 border rounded-lg w-24"
                  />
                </div>
                <button
                  onClick={calculateContinuedFraction}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Calculate
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Learn About Fractions
          </button>

          <div className="flex gap-4 mb-4">
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

          {(resultContent || stepsContent) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} />
              <div dangerouslySetInnerHTML={{ __html: stepsContent }} />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Number Line</h3>
                <canvas ref={numberLineChartRef} className="max-h-40" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Fraction Proportions</h3>
                <canvas ref={pieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Statistical Data</h3>
                <canvas ref={statBarChartRef} className="max-h-80" />
              </div>
              {calculationHistory.length > 0 && (
                <div className="mt-6 max-h-[200px] overflow-y-auto">
                  <h3 className="text-md font-medium text-red-900">Calculation History</h3>
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">Date</th>
                        <th className="p-2">Expression</th>
                        <th className="p-2">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationHistory.map((h, i) => (
                        <tr key={i}>
                          <td className="p-2">{h.date}</td>
                          <td className="p-2">{h.expression}</td>
                          <td className="p-2">{h.result}</td>
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
                <h2 className="text-xl font-semibold mb-4">Understanding Fractions</h2>
                <p className="mb-4">
                  Fractions represent parts of a whole, expressed as a/b where a is the numerator and b is the
                  denominator.
                </p>
                <h3 className="text-md font-medium mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Proper Fraction:</strong> Numerator &lt; Denominator (e.g., 3/4).
                  </li>
                  <li>
                    <strong>Improper Fraction:</strong> Numerator ≥ Denominator (e.g., 7/4).
                  </li>
                  <li>
                    <strong>Mixed Number:</strong> Whole number + fraction (e.g., 1_3/4).
                  </li>
                  <li>
                    <strong>Simplification:</strong> Divide by GCD (e.g., 6/8 → 3/4).
                  </li>
                  <li>
                    <strong>LCM:</strong> Used for adding/subtracting fractions.
                  </li>
                  <li>
                    <strong>Continued Fractions:</strong> Represent fractions as [a;b,c,...].
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Operations</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Add/Subtract:</strong> Use LCM for common denominator.
                  </li>
                  <li>
                    <strong>Multiply:</strong> Multiply numerators and denominators.
                  </li>
                  <li>
                    <strong>Divide:</strong> Multiply by reciprocal.
                  </li>
                  <li>
                    <strong>Compare:</strong> Cross-multiply to compare.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Always simplify results for clarity.</li>
                  <li>Use mixed numbers for easier interpretation.</li>
                  <li>Check denominators are non-zero.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Resources</h3>
                <p className="mb-4">For more information, visit:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <a
                      href="https://www.mathsisfun.com/fractions.html"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Math Is Fun: Fractions
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.khanacademy.org/math/arithmetic/fraction-arithmetic"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Khan Academy: Fractions
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
