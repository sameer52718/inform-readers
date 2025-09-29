"use client";
import { useState, useEffect, useRef } from "react";
import BigNumber from "bignumber.js";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function LongDivisionCalculator() {
  const [dividend, setDividend] = useState("");
  const [divisor, setDivisor] = useState("");
  const [precision, setPrecision] = useState("5");
  const [divisionType, setDivisionType] = useState("decimal");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resultContent, setResultContent] = useState("");
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const quotientChartRef = useRef(null);
  const remainderChartRef = useRef(null);
  const quotientChartInstance = useRef(null);
  const remainderChartInstance = useRef(null);

  useEffect(() => {
    BigNumber.config({ DECIMAL_PLACES: 50, ROUNDING_MODE: BigNumber.ROUND_DOWN });
    const savedHistory = JSON.parse(localStorage.getItem("divisionCalcHistory") || "[]").filter(
      (entry) =>
        entry &&
        typeof entry.date === "string" &&
        typeof entry.operation === "string" &&
        typeof entry.input === "string" &&
        typeof entry.result === "string"
    );
    setCalculationHistory(savedHistory);
  }, []);

  const validateInputs = () => {
    if (!dividend.trim() || !divisor.trim()) throw new Error("Dividend and divisor are required");
    const dividendNum = new BigNumber(dividend);
    const divisorNum = new BigNumber(divisor);
    if (divisorNum.isZero()) throw new Error("Divisor cannot be zero");
    const precisionNum = parseInt(precision);
    if (isNaN(precisionNum) || precisionNum < 0 || precisionNum > 50)
      throw new Error("Precision must be between 0 and 50");
    return { dividendNum, divisorNum, precision: precisionNum };
  };

  const longDivision = (dividend, divisor, precision, isDecimal) => {
    dividend = new BigNumber(dividend).abs();
    divisor = new BigNumber(divisor).abs();
    const steps = [];
    let quotient = new BigNumber(0);
    let remainder = new BigNumber(dividend);
    const quotientDigits = [];
    const remainders = [];

    steps.push(`Initial: Dividend = ${remainder}, Divisor = ${divisor}`);
    if (remainder.gte(divisor)) {
      while (remainder.gte(divisor)) {
        remainder = new BigNumber(remainder);
        divisor = new BigNumber(divisor);
        const q = remainder.dividedToIntegerBy(divisor);
        const product = q.times(divisor);
        steps.push(`Divide ${remainder} by ${divisor}: Quotient = ${q}, Product = ${product}`);
        remainder = remainder.minus(product);
        steps.push(`Subtract ${product} from ${remainder.plus(product)}: Remainder = ${remainder}`);
        quotient = quotient.plus(q);
        quotientDigits.push(q.toNumber());
        remainders.push(remainder.toString());
      }
    } else {
      steps.push(`Dividend ${remainder} < Divisor ${divisor}, Quotient = 0`);
      quotientDigits.push(0);
      remainders.push(remainder.toString());
    }

    let decimalPart = "";
    if (isDecimal && precision > 0 && !remainder.isZero()) {
      decimalPart = ".";
      let decimalCount = 0;
      while (decimalCount < precision && !remainder.isZero()) {
        remainder = new BigNumber(remainder).times(10);
        steps.push(`Bring down 0: New dividend = ${remainder}`);
        remainder = new BigNumber(remainder);
        divisor = new BigNumber(divisor);
        const q = remainder.dividedToIntegerBy(divisor);
        const product = q.times(divisor);
        steps.push(`Divide ${remainder} by ${divisor}: Quotient digit = ${q}, Product = ${product}`);
        remainder = remainder.minus(product);
        steps.push(`Subtract ${product} from ${remainder.plus(product)}: Remainder = ${remainder}`);
        decimalPart += q.toString();
        quotientDigits.push(q.toNumber());
        remainders.push(remainder.toString());
        decimalCount++;
      }
      quotient = new BigNumber(quotient.toString() + decimalPart);
    }

    return {
      quotient: quotient.toString(),
      remainder: remainder.toString(),
      steps,
      quotientDigits,
      remainders,
    };
  };

  const primeFactorization = (num) => {
    num = new BigNumber(num).abs();
    const factors = {};
    const steps = [];
    let n = num;
    for (let i = new BigNumber(2); n.gt(1); i = i.plus(1)) {
      while (n.mod(i).isZero()) {
        factors[i.toString()] = (factors[i.toString()] || 0) + 1;
        steps.push(`Divide ${n} by ${i}: ${n.div(i)}`);
        n = n.div(i);
      }
    }
    if (!Object.keys(factors).length) {
      factors[num.toString()] = 1;
      steps.push(`${num} is prime`);
    }
    return { factors, steps };
  };

  const calculateDivision = () => {
    clearMessages();
    clearVisualizations();
    try {
      const { dividendNum, divisorNum, precision } = validateInputs();
      const isDecimal = divisionType === "decimal";
      const { quotient, remainder, steps, quotientDigits, remainders } = longDivision(
        dividendNum,
        divisorNum,
        precision,
        isDecimal
      );
      const output = `
        <strong>Dividend:</strong> ${dividendNum}<br>
        <strong>Divisor:</strong> ${divisorNum}<br>
        <strong>Quotient:</strong> ${quotient}<br>
        <strong>Remainder:</strong> ${remainder}<br>
        <strong>Steps:</strong><br>
        <table class="w-full text-sm text-gray-600 border-collapse">
          <thead><tr class="bg-gray-200"><th class="p-2 border">Step</th><th class="p-2 border">Description</th></tr></thead>
          <tbody>${steps
            .map((s, i) => `<tr><td class="p-2 border">${i + 1}</td><td class="p-2 border">${s}</td></tr>`)
            .join("")}</tbody>
        </table>
      `;
      displayResults({
        operation: "Long Division",
        input: `${dividendNum} ÷ ${divisorNum}`,
        result: `Quotient: ${quotient}, Remainder: ${remainder}`,
        output,
      });
      updateVisualizations(quotientDigits, remainders);
      setSuccess("Division calculated successfully");
    } catch (e) {
      setError(e.message || "Failed to calculate division");
    }
  };

  const calculateFactors = () => {
    clearMessages();
    clearVisualizations();
    try {
      const { dividendNum, divisorNum } = validateInputs();
      const dividendFactors = primeFactorization(dividendNum);
      const divisorFactors = primeFactorization(divisorNum);
      const output = `
        <strong>Dividend (${dividendNum}):</strong> ${Object.entries(dividendFactors.factors)
        .map(([p, c]) => `${p}^${c}`)
        .join(" × ")}<br>
        <strong>Steps:</strong><br>${dividendFactors.steps.join("<br>")}<br><br>
        <strong>Divisor (${divisorNum}):</strong> ${Object.entries(divisorFactors.factors)
        .map(([p, c]) => `${p}^${c}`)
        .join(" × ")}<br>
        <strong>Steps:</strong><br>${divisorFactors.steps.join("<br>")}
      `;
      displayResults({
        operation: "Prime Factorization",
        input: `${dividendNum}, ${divisorNum}`,
        result: `Dividend: ${Object.entries(dividendFactors.factors)
          .map(([p, c]) => `${p}^${c}`)
          .join(" × ")}, Divisor: ${Object.entries(divisorFactors.factors)
          .map(([p, c]) => `${p}^${c}`)
          .join(" × ")}`,
        output,
      });
      updateFactorVisualization([dividendFactors, divisorFactors], [dividendNum, divisorNum]);
      setSuccess("Prime factorization completed");
    } catch (e) {
      setError(e.message || "Failed to calculate prime factors");
    }
  };

  const displayResults = ({ operation, input, result, output }) => {
    setResultContent(output);
    saveToHistory(operation, input, result);
  };

  const updateVisualizations = (quotientDigits, remainders) => {
    if (quotientChartInstance.current) quotientChartInstance.current.destroy();
    if (remainderChartInstance.current) remainderChartInstance.current.destroy();

    if (quotientChartRef.current && quotientDigits.length) {
      quotientChartInstance.current = new Chart(quotientChartRef.current, {
        type: "bar",
        data: {
          labels: quotientDigits.map((_, i) => `Digit ${i + 1}`),
          datasets: [
            {
              label: "Quotient Digits",
              data: quotientDigits,
              backgroundColor: "#dc2626",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Value" } },
            x: { title: { display: true, text: "Digit Position" } },
          },
          plugins: { title: { display: true, text: "Quotient Digits" } },
        },
      });
    }

    if (remainderChartRef.current && remainders.length) {
      remainderChartInstance.current = new Chart(remainderChartRef.current, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Remainders",
              data: remainders.map((r, i) => ({ x: i + 1, y: new BigNumber(r).toNumber() })),
              backgroundColor: "#dc2626",
              pointRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Step" } },
            y: { title: { display: true, text: "Remainder" }, beginAtZero: true },
          },
          plugins: { title: { display: true, text: "Remainder Progression" } },
        },
      });
    }
  };

  const updateFactorVisualization = (factorizations, numbers) => {
    if (quotientChartInstance.current) quotientChartInstance.current.destroy();
    if (quotientChartRef.current) {
      const allPrimes = [...new Set(factorizations.flatMap((f) => Object.keys(f.factors)))];
      const datasets = factorizations.map((f, i) => ({
        label: `Number ${numbers[i]}`,
        data: allPrimes.map((prime) => f.factors[prime] || 0),
        backgroundColor: ["#dc2626", "#ef4444"][i % 2],
      }));
      quotientChartInstance.current = new Chart(quotientChartRef.current, {
        type: "bar",
        data: { labels: allPrimes, datasets },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Exponent" } },
            x: { title: { display: true, text: "Prime Factors" } },
          },
          plugins: { title: { display: true, text: "Prime Factorization" } },
        },
      });
    }
  };

  const clearInputs = () => {
    setDividend("");
    setDivisor("");
    setPrecision("5");
    setDivisionType("decimal");
    clearMessages();
    clearVisualizations();
    setResultContent("");
    setSuccess("Inputs cleared");
  };

  const clearVisualizations = () => {
    if (quotientChartInstance.current) quotientChartInstance.current.destroy();
    if (remainderChartInstance.current) remainderChartInstance.current.destroy();
    quotientChartInstance.current = null;
    remainderChartInstance.current = null;
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

  const saveToHistory = (operation, input, result) => {
    const entry = { date: new Date().toLocaleString(), operation, input, result };
    const updatedHistory = [...calculationHistory, entry];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("divisionCalcHistory", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setCalculationHistory([]);
    localStorage.removeItem("divisionCalcHistory");
    setSuccess("History cleared");
  };

  const exportCSV = () => {
    const headers = ["Date", "Operation", "Input", "Result"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.operation}"`,
      `"${entry.input}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("division_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("division_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Long Division Calculation History", 10, 10);
    let y = 20;
    calculationHistory.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Operation: ${entry.operation}`, 10, y + 10);
      doc.text(`Input: ${entry.input}`, 10, y + 20);
      doc.text(`Result: ${entry.result}`, 10, y + 30);
      y += 40;
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("division_history.pdf");
  };

  const downloadFile = (filename, type, content) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") calculateDivision();
      else if (e.key === "Escape") clearInputs();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dividend, divisor, precision, divisionType]);

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-4xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Long Division Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Enter Numbers</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Dividend
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Number to be divided
                  </span>
                </span>
              </label>
              <input
                type="number"
                step="any"
                value={dividend}
                onChange={(e) => setDividend(e.target.value)}
                placeholder="Dividend"
                className="p-3 border rounded-lg w-full"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Divisor
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Number to divide by
                  </span>
                </span>
              </label>
              <input
                type="number"
                step="any"
                value={divisor}
                onChange={(e) => setDivisor(e.target.value)}
                placeholder="Divisor"
                className="p-3 border rounded-lg w-full"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Decimal Precision
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Number of decimal places (0 for integer)
                  </span>
                </span>
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={precision}
                onChange={(e) => setPrecision(e.target.value)}
                placeholder="e.g., 5"
                className="p-3 border rounded-lg w-full"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Division Type
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Choose division type
                  </span>
                </span>
              </label>
              <select
                value={divisionType}
                onChange={(e) => setDivisionType(e.target.value)}
                className="p-3 border rounded-lg w-full"
              >
                <option value="decimal">Decimal Division</option>
                <option value="integer">Integer Division</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            <button onClick={calculateDivision} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Calculate Division
            </button>
            <button onClick={calculateFactors} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Prime Factors
            </button>
            <button onClick={clearInputs} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Clear
            </button>
            <button onClick={saveCalculation} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Save
            </button>
            <button onClick={clearHistory} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Clear History
            </button>
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

          {resultContent && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} className="text-gray-600 mb-4" />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Quotient Digits</h3>
                <canvas ref={quotientChartRef} className="max-w-[600px] h-[300px] mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Remainder Progression</h3>
                <canvas ref={remainderChartRef} className="max-w-[600px] h-[300px] mx-auto" />
              </div>
            </div>
          )}

          {calculationHistory.length > 0 && (
            <div className="mt-6 max-h-[200px] overflow-y-auto">
              <h3 className="text-md font-medium text-red-900">Calculation History</h3>
              <table className="w-full text-sm text-gray-600">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Date</th>
                    <th className="p-2">Operation</th>
                    <th className="p-2">Dividend/Divisor</th>
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

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            Learn More
          </button>

          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 rounded-lg max-w-[600px] w-full relative">
                <span
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Understanding Long Division</h2>
                <p className="text-gray-600 mb-4">
                  Long division is a method for dividing large numbers by breaking the process into smaller
                  steps.
                </p>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Dividend:</strong> The number to be divided.
                  </li>
                  <li>
                    <strong>Divisor:</strong> The number to divide by.
                  </li>
                  <li>
                    <strong>Quotient:</strong> The result of division (integer or decimal).
                  </li>
                  <li>
                    <strong>Remainder:</strong> The amount left over after division.
                  </li>
                  <li>
                    <strong>Decimal Division:</strong> Extends division to include decimal places.
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Applications</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Mathematics:</strong> Simplifying fractions, solving equations.
                  </li>
                  <li>
                    <strong>Computer Science:</strong> Algorithms, hash functions.
                  </li>
                  <li>
                    <strong>Education:</strong> Teaching arithmetic and number sense.
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>Ensure the divisor is not zero.</li>
                  <li>Use integer division for whole-number results.</li>
                  <li>Adjust decimal precision for detailed results.</li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <a
                      href="https://www.mathsisfun.com/long_division.html"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Long Division Explained
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://en.wikipedia.org/wiki/Long_division"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Wikipedia: Long Division
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
