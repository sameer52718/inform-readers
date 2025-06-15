"use client";
import { useState, useEffect, useRef } from "react";
import BigNumber from "bignumber.js";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function CommonFactorCalculator() {
  const [numbers, setNumbers] = useState(["", ""]);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState(null);
  const factorChartRef = useRef(null);
  const gcdLcmChartRef = useRef(null);
  const chartInstances = useRef({ factorChart: null, gcdLcmChart: null });

  useEffect(() => {
    BigNumber.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: BigNumber.ROUND_DOWN });
    const savedHistory = JSON.parse(localStorage.getItem("factorCalcHistory")) || [];
    setCalculationHistory(savedHistory);
  }, []);

  const addNumberInput = () => {
    if (numbers.length >= 10) {
      setError("Maximum 10 numbers allowed");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setNumbers([...numbers, ""]);
  };

  const removeNumberInput = () => {
    if (numbers.length <= 2) {
      setError("At least 2 numbers required");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setNumbers(numbers.slice(0, -1));
  };

  const getNumbers = () => {
    const validNumbers = numbers.map((value) => {
      if (!value || isNaN(value) || value.includes(".")) {
        throw new Error("All inputs must be positive integers");
      }
      const num = new BigNumber(value);
      if (num.isNegative() || !num.isInteger()) {
        throw new Error("All inputs must be positive integers");
      }
      return num;
    });
    if (validNumbers.length < 2) {
      throw new Error("At least 2 numbers required");
    }
    return validNumbers;
  };

  const gcd = (a, b) => {
    a = a.abs();
    b = b.abs();
    const steps = [];
    while (!b.isZero()) {
      const r = a.mod(b);
      steps.push(`GCD(${a}, ${b}) = GCD(${b}, ${r})`);
      a = b;
      b = r;
    }
    steps.push(`GCD(${a}, 0) = ${a}`);
    return { value: a, steps };
  };

  const gcdMultiple = (numbers) => {
    let result = numbers[0];
    const steps = [];
    for (let i = 1; i < numbers.length; i++) {
      const { value, steps: subSteps } = gcd(result, numbers[i]);
      steps.push(...subSteps);
      result = value;
    }
    return { value: result, steps };
  };

  const lcm = (a, b) => {
    const gcdResult = gcd(a, b);
    const value = a.times(b).abs().div(gcdResult.value);
    const steps = [...gcdResult.steps, `LCM(${a}, ${b}) = |${a} * ${b}| / GCD(${a}, ${b}) = ${value}`];
    return { value, steps };
  };

  const lcmMultiple = (numbers) => {
    let result = numbers[0];
    const steps = [];
    for (let i = 1; i < numbers.length; i++) {
      const { value, steps: subSteps } = lcm(result, numbers[i]);
      steps.push(...subSteps);
      result = value;
    }
    return { value: result, steps };
  };

  const primeFactorization = (num) => {
    num = num.abs();
    const factors = {};
    let n = num;
    const steps = [];
    for (let i = new BigNumber(2); n.gt(1); i = i.plus(1)) {
      while (n.mod(i).isZero()) {
        factors[i.toString()] = (factors[i.toString()] || 0) + 1;
        steps.push(`Divide ${n} by ${i}: ${n.div(i)}`);
        n = n.div(i);
      }
    }
    if (Object.keys(factors).length === 0) {
      factors[num.toString()] = 1;
      steps.push(`${num} is prime`);
    }
    return { factors, steps };
  };

  const calculateGCD = () => {
    clearMessages();
    clearVisualizations();
    try {
      const nums = getNumbers();
      const { value, steps } = gcdMultiple(nums);
      setResults({ operation: "GCD", numbers: nums, result: value.toString(), steps });
      updateVisualizations(nums, value, null);
      setSuccess("GCD calculated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.message || "Failed to calculate GCD");
      setTimeout(() => setError(""), 3000);
    }
  };

  const calculateLCM = () => {
    clearMessages();
    clearVisualizations();
    try {
      const nums = getNumbers();
      const { value, steps } = lcmMultiple(nums);
      setResults({ operation: "LCM", numbers: nums, result: value.toString(), steps });
      updateVisualizations(nums, null, value);
      setSuccess("LCM calculated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.message || "Failed to calculate LCM");
      setTimeout(() => setError(""), 3000);
    }
  };

  const calculateFactors = () => {
    clearMessages();
    clearVisualizations();
    try {
      const nums = getNumbers();
      const factorizations = nums.map((num) => primeFactorization(num));
      const output = factorizations
        .map((f, i) => {
          const factors = Object.entries(f.factors)
            .map(([prime, count]) => `${prime}^${count}`)
            .join(" * ");
          return `Number ${nums[i]}: ${factors}\nSteps:\n${f.steps.join("\n")}`;
        })
        .join("\n\n");
      setResults({
        operation: "Prime Factorization",
        numbers: nums,
        result: output,
        steps: factorizations.flatMap((f) => f.steps),
      });
      updateFactorVisualization(factorizations, nums);
      setSuccess("Prime factorization completed");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.message || "Failed to calculate prime factors");
      setTimeout(() => setError(""), 3000);
    }
  };

  const clearInputs = () => {
    setNumbers(["", ""]);
    clearMessages();
    clearVisualizations();
    setResults(null);
    setSuccess("Inputs cleared");
    setTimeout(() => setSuccess(""), 3000);
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const clearVisualizations = () => {
    if (chartInstances.current.factorChart) {
      chartInstances.current.factorChart.destroy();
      chartInstances.current.factorChart = null;
    }
    if (chartInstances.current.gcdLcmChart) {
      chartInstances.current.gcdLcmChart.destroy();
      chartInstances.current.gcdLcmChart = null;
    }
  };

  const saveToHistory = (operation, numbers, result) => {
    const entry = {
      date: new Date().toLocaleString(),
      operation,
      numbers,
      result,
    };
    const updatedHistory = [...calculationHistory, entry];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("factorCalcHistory", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setCalculationHistory([]);
    localStorage.removeItem("factorCalcHistory");
    setSuccess("History cleared");
    setTimeout(() => setSuccess(""), 3000);
  };

  const updateVisualizations = (numbers, gcd, lcm) => {
    const factorizations = numbers.map((num) => primeFactorization(num));
    const allPrimes = [...new Set(factorizations.flatMap((f) => Object.keys(f.factors)))];
    const datasets = factorizations.map((f, i) => ({
      label: `Number ${numbers[i]}`,
      data: allPrimes.map((prime) => f.factors[prime] || 0),
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
    }));
    if (factorChartRef.current) {
      chartInstances.current.factorChart = new Chart(factorChartRef.current, {
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

    if (gcd || lcm) {
      const data = [];
      if (gcd) data.push({ x: 0, y: gcd.toNumber(), label: "GCD" });
      if (lcm) data.push({ x: 1, y: Math.min(lcm.toNumber(), 1e10), label: "LCM" });
      numbers.forEach((num, i) => data.push({ x: 2 + i, y: num.toNumber(), label: `Number ${i + 1}` }));
      if (gcdLcmChartRef.current) {
        chartInstances.current.gcdLcmChart = new Chart(gcdLcmChartRef.current, {
          type: "scatter",
          data: {
            datasets: [
              {
                label: "Values",
                data: data.map((d) => ({ x: d.x, y: d.y })),
                backgroundColor: data.map(
                  () => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`
                ),
                pointRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: { title: { display: true, text: "Index" } },
              y: { title: { display: true, text: "Value" }, beginAtZero: true },
            },
            plugins: {
              title: { display: true, text: "GCD/LCM Comparison" },
              tooltip: {
                callbacks: { label: (ctx) => `${data[ctx.dataIndex].label}: ${data[ctx.dataIndex].y}` },
              },
            },
          },
        });
      }
    }
  };

  const updateFactorVisualization = (factorizations, numbers) => {
    const allPrimes = [...new Set(factorizations.flatMap((f) => Object.keys(f.factors)))];
    const datasets = factorizations.map((f, i) => ({
      label: `Number ${numbers[i]}`,
      data: allPrimes.map((prime) => f.factors[prime] || 0),
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
    }));
    if (factorChartRef.current) {
      chartInstances.current.factorChart = new Chart(factorChartRef.current, {
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

  const exportCSV = () => {
    const headers = ["Date", "Operation", "Numbers", "Result"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.operation}"`,
      `"${entry.numbers}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "factor_history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "factor_history.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Common Factor Calculation History", 10, 10);
    let y = 20;
    calculationHistory.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Operation: ${entry.operation}`, 10, y + 10);
      doc.text(`Numbers: ${entry.numbers}`, 10, y + 20);
      doc.text(`Result: ${entry.result}`, 10, y + 30);
      y += 40;
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("factor_history.pdf");
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-[900px] w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Common Factor Calculator</h1>

          {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm text-center mb-4">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Enter Numbers</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {numbers.map((num, index) => (
              <input
                key={index}
                type="number"
                value={num}
                onChange={(e) => {
                  const newNumbers = [...numbers];
                  newNumbers[index] = e.target.value;
                  setNumbers(newNumbers);
                }}
                placeholder={`Number ${index + 1}`}
                className="flex-1 min-w-[150px] p-3 border rounded-lg bg-gray-200"
              />
            ))}
          </div>
          <div className="flex gap-4 mb-4">
            <button onClick={addNumberInput} className="bg-red-500 text-white p-3 rounded-lg">
              Add Number
            </button>
            <button onClick={removeNumberInput} className="bg-red-500 text-white p-3 rounded-lg">
              Remove Number
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
            <button onClick={calculateGCD} className="bg-red-500 text-white p-3 rounded-lg relative group">
              Calculate GCD
              <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                Greatest Common Divisor
              </span>
            </button>
            <button onClick={calculateLCM} className="bg-red-500 text-white p-3 rounded-lg relative group">
              Calculate LCM
              <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                Least Common Multiple
              </span>
            </button>
            <button
              onClick={calculateFactors}
              className="bg-red-500 text-white p-3 rounded-lg relative group"
            >
              Prime Factors
              <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                Prime factorization of numbers
              </span>
            </button>
            <button onClick={clearInputs} className="bg-red-500 text-white p-3 rounded-lg">
              Clear
            </button>
            <button
              onClick={() => {
                saveToHistory(results?.operation || "N/A", numbers.join(", "), results?.result || "N/A");
                setSuccess("Calculation saved to history");
                setTimeout(() => setSuccess(""), 3000);
              }}
              className="bg-red-500 text-white p-3 rounded-lg"
            >
              Save
            </button>
            <button onClick={clearHistory} className="bg-red-500 text-white p-3 rounded-lg">
              Clear History
            </button>
            <button onClick={exportCSV} className="bg-red-500 text-white p-3 rounded-lg">
              Export CSV
            </button>
            <button onClick={exportJSON} className="bg-red-500 text-white p-3 rounded-lg">
              Export JSON
            </button>
            <button onClick={exportPDF} className="bg-red-500 text-white p-3 rounded-lg">
              Export PDF
            </button>
            <button onClick={() => setShowModal(true)} className="bg-red-500 text-white p-3 rounded-lg">
              Learn More
            </button>
          </div>

          {results && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: `
                  <strong>Operation: ${results.operation}</strong><br>
                  Numbers: ${results.numbers.join(", ")}<br>
                  <strong>Result:</strong><br>${results.result.replace(/\n/g, "<br>")}<br>
                  ${
                    results.steps.length
                      ? `<strong>Steps:</strong><br>${results.steps.map((s) => `  ${s}`).join("<br>")}`
                      : ""
                  }
                `,
                }}
              />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Prime Factorization</h3>
                <canvas ref={factorChartRef} className="max-w-[600px] h-[300px] mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">GCD/LCM Visualization</h3>
                <canvas ref={gcdLcmChartRef} className="max-w-[600px] h-[300px] mx-auto" />
              </div>
            </div>
          )}

          {calculationHistory.length > 0 && (
            <div className="max-h-[200px] overflow-y-auto mt-6">
              <h3 className="text-md font-medium text-red-900">Calculation History</h3>
              <table className="w-full text-sm text-gray-600">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Date</th>
                    <th className="p-2">Operation</th>
                    <th className="p-2">Numbers</th>
                    <th className="p-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {calculationHistory.map((entry, index) => (
                    <tr key={index}>
                      <td className="p-2">{entry.date}</td>
                      <td className="p-2">{entry.operation}</td>
                      <td className="p-2">{entry.numbers}</td>
                      <td className="p-2">{entry.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <h2 className="text-xl font-semibold mb-4">Understanding GCD and LCM</h2>
                <p className="mb-4">
                  The Greatest Common Divisor (GCD) and Least Common Multiple (LCM) are fundamental in number
                  theory.
                </p>
                <h3 className="text-md font-medium mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>GCD:</strong> The largest number that divides all input numbers without a
                    remainder. Computed using the Euclidean algorithm.
                  </li>
                  <li>
                    <strong>LCM:</strong> The smallest number that is a multiple of all input numbers.
                    Computed as LCM(a,b) = |a * b| / GCD(a,b).
                  </li>
                  <li>
                    <strong>Prime Factorization:</strong> Breaking a number into its prime factors, useful for
                    GCD and LCM.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Mathematics:</strong> Simplifying fractions, solving Diophantine equations.
                  </li>
                  <li>
                    <strong>Computer Science:</strong> Cryptography, scheduling algorithms.
                  </li>
                  <li>
                    <strong>Engineering:</strong> Gear ratios, signal processing.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Enter positive integers for accurate results.</li>
                  <li>Use GCD to simplify ratios or fractions.</li>
                  <li>LCM is useful for finding common periods or cycles.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Resources</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <a
                      href="https://www.mathsisfun.com/greatest-common-factor.html"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      GCD Explained
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.mathsisfun.com/least-common-multiple.html"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      LCM Explained
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
