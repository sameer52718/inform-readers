"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function LCMCalculator() {
  const [calcMethod, setCalcMethod] = useState("prime-factorization");
  const [numbersInput, setNumbersInput] = useState("");
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resultContent, setResultContent] = useState("");
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [lastResults, setLastResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const primeFactorChartRef = useRef(null);
  const multiplesTimelineRef = useRef(null);
  const primeFactorChartInstance = useRef(null);
  const multiplesTimelineInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("lcmCalcHistory")) || [];
    setCalculationHistory(
      savedHistory.filter(
        (entry) =>
          entry &&
          typeof entry.date === "string" &&
          typeof entry.method === "string" &&
          typeof entry.numbers === "string" &&
          typeof entry.lcm === "string"
      )
    );
  }, []);

  const gcd = (a, b) => {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const lcmEuclidean = (numbers) => {
    if (!numbers.every((n) => Number.isInteger(n) && n > 0)) {
      throw new Error("All numbers must be positive integers");
    }
    let steps = [];
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      const a = result,
        b = numbers[i];
      const g = gcd(a, b);
      result = (a * b) / g;
      steps.push(`GCD(${a}, ${b}) = ${g}; LCM = (${a} * ${b}) / ${g} = ${result}`);
    }
    return { lcm: result, steps };
  };

  const primeFactors = (n) => {
    if (!Number.isInteger(n) || n <= 0) throw new Error("Number must be a positive integer");
    const factors = {};
    let num = n;
    for (let i = 2; i <= num; i++) {
      while (num % i === 0) {
        factors[i] = (factors[i] || 0) + 1;
        num /= i;
      }
    }
    return factors;
  };

  const lcmPrimeFactorization = (numbers) => {
    if (!numbers.every((n) => Number.isInteger(n) && n > 0)) {
      throw new Error("All numbers must be positive integers");
    }
    const allFactors = numbers.map((n) => primeFactors(n));
    const primes = [...new Set(allFactors.flatMap((f) => Object.keys(f).map(Number)))].sort((a, b) => a - b);
    const maxPowers = {};
    primes.forEach((prime) => {
      maxPowers[prime] = Math.max(...allFactors.map((f) => f[prime] || 0));
    });
    let lcm = 1;
    const steps = [];
    for (const [prime, power] of Object.entries(maxPowers)) {
      lcm *= Math.pow(prime, power);
      steps.push(`${prime}^${power}`);
    }
    return { lcm, factors: allFactors, steps: [`LCM = ${steps.join(" * ")} = ${lcm}`] };
  };

  const calculateLCM = (numbers, method) => {
    if (!Array.isArray(numbers) || numbers.length < 2) {
      throw new Error("At least two numbers are required");
    }
    if (!numbers.every((n) => Number.isInteger(n) && n > 0)) {
      throw new Error("All numbers must be positive integers");
    }
    if (!["prime-factorization", "euclidean", "both"].includes(method)) {
      throw new Error("Invalid calculation method");
    }

    const results = {};
    if (method === "prime-factorization" || method === "both") {
      results.prime = lcmPrimeFactorization(numbers);
    }
    if (method === "euclidean" || method === "both") {
      results.euclidean = lcmEuclidean(numbers);
    }
    const lcm = (results.prime || results.euclidean).lcm;
    const gcdResult = numbers.reduce((a, b) => gcd(a, b));
    return {
      lcm,
      gcd: gcdResult,
      ratio: gcdResult !== 0 ? lcm / gcdResult : "undefined",
      ...results,
    };
  };

  const processBatch = async (datasets, results, method) => {
    for (const dataset of datasets) {
      try {
        const numbers = dataset
          .split(",")
          .map((n) => parseInt(n.trim()))
          .filter((n) => !isNaN(n) && Number.isInteger(n) && n > 0);
        if (numbers.length < 2) continue;
        const result = calculateLCM(numbers, method);
        results.push({ numbers, method, result });
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
    if (results.length === 0) {
      throw new Error("No valid batch entries processed");
    }
  };

  const calculate = async () => {
    clearMessages();
    clearVisualizations();
    try {
      let results = [];
      let isBatch = batchFile || batchText;

      if (!isBatch) {
        const numbers = numbersInput
          .split(",")
          .map((n) => parseInt(n.trim()))
          .filter((n) => !isNaN(n) && Number.isInteger(n) && n > 0);
        if (numbers.length < 2) throw new Error("Enter at least two positive integers");
        const result = calculateLCM(numbers, calcMethod);
        results.push({ numbers, method: calcMethod, result });
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
          if (datasets.length === 0) throw new Error("No valid datasets provided in batch text");
        }
        await processBatch(datasets, results, calcMethod);
        if (results.length === 0) throw new Error("No valid datasets found in batch input");
      }

      displayResults(results, isBatch);
      updateVisualizations(results);
      setSuccess("Calculation completed successfully");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError(e.message || "An unexpected error occurred during calculation");
      setTimeout(() => setError(""), 3000);
    }
  };

  const displayResults = (results, isBatch) => {
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Numbers</th><th class="p-2">Method</th><th class="p-2">LCM</th><th class="p-2">GCD</th></tr></thead><tbody>';
      for (const r of results) {
        output += `<tr>
          <td class="p-2">${r.numbers.join(", ")}</td>
          <td class="p-2">${r.method.replace("-", " ")}</td>
          <td class="p-2">${r.result.lcm}</td>
          <td class="p-2">${r.result.gcd}</td>
        </tr>`;
      }
      output += "</tbody></table>";
    } else {
      const r = results[0];
      output = `<strong>LCM Calculation (Method: ${r.method.replace("-", " ")}):</strong><br>`;
      output += `Numbers: ${r.numbers.join(", ")}<br>`;
      output += `LCM: ${r.result.lcm}<br>`;
      output += `GCD: ${r.result.gcd}<br>`;
      output += `LCM/GCD Ratio: ${
        Number.isFinite(r.result.ratio) ? r.result.ratio.toFixed(3) : "undefined"
      }<br>`;
      if (r.result.prime && Array.isArray(r.result.prime.steps)) {
        output += `<strong>Prime Factorization Steps:</strong><br>`;
        output += r.result.prime.steps.map((s) => `  ${s}`).join("<br>") + "<br>";
      }
      if (r.result.euclidean && Array.isArray(r.result.euclidean.steps)) {
        output += `<strong>Euclidean Algorithm Steps:</strong><br>`;
        output += r.result.euclidean.steps.map((s) => `  ${s}`).join("<br>") + "<br>";
      }
    }

    setResultContent(output);
    saveToHistory(results[0].method, results[0].numbers.join(", "), String(results[0].result.lcm));
    setLastResults(results);
  };

  const updateVisualizations = (results) => {
    if (primeFactorChartInstance.current) primeFactorChartInstance.current.destroy();
    if (multiplesTimelineInstance.current) multiplesTimelineInstance.current.destroy();

    const r = results[0].result;
    const numbers = results[0].numbers;

    if (primeFactorChartRef.current && r.prime) {
      const datasets = numbers.map((num, i) => ({
        label: `Number ${num}`,
        data: Object.entries(r.prime.factors[i] || {}).map(([prime, power]) => ({ x: prime, y: power })),
        backgroundColor: `hsl(${i * 60}, 70%, 50%)`,
      }));
      primeFactorChartInstance.current = new Chart(primeFactorChartRef.current, {
        type: "bar",
        data: { datasets },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Prime Factors" } },
            y: { title: { display: true, text: "Powers" }, beginAtZero: true, type: "linear" },
          },
          plugins: { title: { display: true, text: "Prime Factorization" } },
        },
      });
    }

    if (multiplesTimelineRef.current) {
      const maxMultiple = r.lcm * 3;
      const datasets = numbers.map((num, i) => ({
        label: `Multiples of ${num}`,
        data: Array.from({ length: Math.floor(maxMultiple / num) + 1 }, (_, j) => ({ x: j * num, y: i + 1 })),
        pointBackgroundColor: `hsl(${i * 60}, 70%, 50%)`,
        pointRadius: 5,
      }));
      multiplesTimelineInstance.current = new Chart(multiplesTimelineRef.current, {
        type: "scatter",
        data: { datasets },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Value" }, max: maxMultiple },
            y: { title: { display: true, text: "Number" }, min: 0, max: numbers.length + 1 },
          },
          plugins: { title: { display: true, text: "Multiples Timeline" } },
        },
      });
    }
  };

  const clearInputs = () => {
    setNumbersInput("");
    setBatchText("");
    setBatchFile(null);
    clearMessages();
    clearVisualizations();
    setResultContent("");
    setSuccess("Inputs cleared");
    setTimeout(() => setSuccess(""), 2000);
  };

  const clearVisualizations = () => {
    if (primeFactorChartInstance.current) primeFactorChartInstance.current.destroy();
    if (multiplesTimelineInstance.current) multiplesTimelineInstance.current.destroy();
    primeFactorChartInstance.current = null;
    multiplesTimelineInstance.current = null;
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
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

  const saveToHistory = (method, numbers, lcm) => {
    const entry = {
      date: new Date().toLocaleString(),
      method: String(method || ""),
      numbers: String(numbers || ""),
      lcm: String(lcm || ""),
    };
    const updatedHistory = [...calculationHistory, entry];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("lcmCalcHistory", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setCalculationHistory([]);
    localStorage.removeItem("lcmCalcHistory");
    setSuccess("History cleared");
    setTimeout(() => setSuccess(""), 2000);
  };

  const exportCSV = () => {
    const headers = ["Date", "Method", "Numbers", "LCM"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.method}"`,
      `"${entry.numbers}"`,
      `"${entry.lcm}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("lcm_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("lcm_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("LCM Calculation History", 10, 10);
    let y = 20;
    calculationHistory.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Method: ${entry.method.replace("-", " ")}`, 10, y + 10);
      doc.text(`Numbers: ${entry.numbers}`, 10, y + 20);
      doc.text(`LCM: ${entry.lcm}`, 10, y + 30);
      y += 50;
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("lcm_history.pdf");
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
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-6xl w-full">
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced LCM Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Calculation Method
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Select method to compute LCM.
                    </span>
                  </span>
                </label>
                <select
                  value={calcMethod}
                  onChange={(e) => setCalcMethod(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="prime-factorization">Prime Factorization</option>
                  <option value="euclidean">Euclidean Algorithm</option>
                  <option value="both">Both Methods</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Numbers (Comma-separated)
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Enter positive integers (e.g., 12,18,24).
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  value={numbersInput}
                  onChange={(e) => setNumbersInput(e.target.value)}
                  placeholder="e.g., 12,18,24"
                  className="p-3 border rounded-lg w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Batch Input (CSV File or Text: e.g., 12,18;24,36)
                <span className="relative group inline-block ml-1 cursor-pointer">
                  ?
                  <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    Upload CSV or enter number sets.
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
                placeholder="e.g., 12,18;24,36"
                className="p-3 border rounded-lg w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
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
            Learn About LCM
          </button>

          {resultContent && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: resultContent }} />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Prime Factorization Chart</h3>
                <canvas ref={primeFactorChartRef} className="max-w-[600px] h-[300px] mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Multiples Timeline</h3>
                <canvas ref={multiplesTimelineRef} className="max-w-[600px] h-[300px] mx-auto" />
              </div>
              {calculationHistory.length > 0 && (
                <div className="mt-6 max-h-[200px] overflow-y-auto">
                  <h3 className="text-md font-medium text-red-900">Calculation History</h3>
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">Date</th>
                        <th className="p-2">Method</th>
                        <th className="p-2">Numbers</th>
                        <th className="p-2">LCM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationHistory.map((entry, index) => (
                        <tr key={index}>
                          <td className="p-2">{entry.date}</td>
                          <td className="p-2">{entry.method.replace("-", " ")}</td>
                          <td className="p-2">{entry.numbers}</td>
                          <td className="p-2">{entry.lcm}</td>
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
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Understanding Least Common Multiple (LCM)
                </h2>
                <p className="text-gray-600 mb-4">
                  The Least Common Multiple (LCM) of two or more integers is the smallest positive integer
                  that is divisible by each of the numbers.
                </p>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Calculation Methods</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Prime Factorization:</strong> Decompose numbers into prime factors, take the
                    highest power of each prime, and multiply.
                  </li>
                  <li>
                    <strong>Euclidean Algorithm:</strong> Compute GCD using division, then use LCM = (a * b) /
                    GCD(a,b).
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Applications</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <strong>Fractions:</strong> Find a common denominator to add or subtract fractions.
                  </li>
                  <li>
                    <strong>Scheduling:</strong> Determine when events with different cycles align.
                  </li>
                  <li>
                    <strong>Engineering:</strong> Calculate gear ratios or signal frequencies.
                  </li>
                  <li>
                    <strong>Programming:</strong> Optimize loops or resource allocation.
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Tips</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>Ensure inputs are positive integers.</li>
                  <li>Use batch input for multiple sets (e.g., "12,18;24,36").</li>
                  <li>
                    Prime Factorization is intuitive for small numbers, while Euclidean is faster for large
                    ones.
                  </li>
                </ul>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Resources</h3>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>
                    <a
                      href="https://www.mathsisfun.com/least-common-multiple.html"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      LCM Explained
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://en.wikipedia.org/wiki/Least_common_multiple"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Wikipedia: LCM
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
