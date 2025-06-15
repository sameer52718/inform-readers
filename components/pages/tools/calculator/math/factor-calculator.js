"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function FactorCalculator() {
  const [calcType, setCalcType] = useState("factors");
  const [numbers, setNumbers] = useState("");
  const [sliderValue, setSliderValue] = useState(12);
  const [batchText, setBatchText] = useState("");
  const [batchFile, setBatchFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState([]);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const primeFactorChartRef = useRef(null);
  const commonFactorsChartRef = useRef(null);
  const multiplesTimelineRef = useRef(null);
  const primeFactorChartInstance = useRef(null);
  const commonFactorsChartInstance = useRef(null);
  const multiplesTimelineInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("factorCalcHistory")) || [];
    setCalculationHistory(
      savedHistory.filter(
        (entry) =>
          entry &&
          typeof entry.date === "string" &&
          typeof entry.type === "string" &&
          typeof entry.numbers === "string" &&
          typeof entry.result === "string"
      )
    );
  }, []);

  const getFactors = (n) => {
    if (!Number.isInteger(n) || n <= 0) throw new Error("Number must be a positive integer");
    const factors = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) factors.push(n / i);
      }
    }
    return factors.sort((a, b) => a - b);
  };

  const primeFactors = (n) => {
    if (!Number.isInteger(n) || n <= 0) throw new Error("Number must be a positive integer");
    const factors = {};
    let num = n;
    let steps = [];
    for (let i = 2; i <= num; i++) {
      while (num % i === 0) {
        factors[i] = (factors[i] || 0) + 1;
        steps.push(`Divide ${num} by ${i} = ${num / i}`);
        num /= i;
      }
    }
    return { factors, steps };
  };

  const gcd = (a, b) => {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    let steps = [];
    while (b) {
      steps.push(`GCD(${a}, ${b}) → ${a} = ${Math.floor(a / b)} × ${b} + ${a % b}`);
      const temp = b;
      b = a % b;
      a = temp;
    }
    return { gcd: a, steps };
  };

  const lcm = (numbers) => {
    if (!numbers.every((n) => Number.isInteger(n) && n > 0)) {
      throw new Error("All numbers must be positive integers");
    }
    let result = numbers[0];
    let steps = [];
    for (let i = 1; i < numbers.length; i++) {
      const a = result,
        b = numbers[i];
      const { gcd: g, steps: gcdSteps } = gcd(a, b);
      result = (a * b) / g;
      steps.push(...gcdSteps, `LCM(${a}, ${b}) = (${a} * ${b}) / ${g} = ${result}`);
    }
    return { lcm: result, steps };
  };

  const calculateFactors = (numbers, type) => {
    if (!Array.isArray(numbers) || numbers.length === 0) {
      throw new Error("At least one number is required");
    }
    if (!numbers.every((n) => Number.isInteger(n) && n > 0)) {
      throw new Error("All numbers must be positive integers");
    }
    if (!["factors", "prime-factorization", "gcd", "lcm", "all"].includes(type)) {
      throw new Error("Invalid calculation type");
    }
    const results = {};
    if (type === "factors" || type === "all") {
      results.factors = numbers.map((n) => ({
        number: n,
        factors: getFactors(n),
      }));
    }
    if (type === "prime-factorization" || type === "all") {
      results.prime = numbers.map((n) => ({
        number: n,
        ...primeFactors(n),
      }));
    }
    if ((type === "gcd" || type === "all") && numbers.length > 1) {
      const g = numbers.reduce((a, b) => gcd(a, b).gcd);
      results.gcd = { value: g, steps: gcd(numbers[0], numbers[1]).steps };
    }
    if ((type === "lcm" || type === "all") && numbers.length > 1) {
      results.lcm = lcm(numbers);
    }
    if (numbers.length > 1) {
      results.commonFactors = numbers
        .map((n) => getFactors(n))
        .reduce((a, b) => a.filter((x) => b.includes(x)));
    }
    return results;
  };

  const calculate = async () => {
    clearMessages();
    clearVisualizations();
    try {
      let results = [];
      const isBatch = batchFile || batchText;
      if (!isBatch) {
        const parsedNumbers = numbers
          .split(",")
          .map((n) => parseInt(n.trim()))
          .filter((n) => !isNaN(n) && Number.isInteger(n) && n > 0);
        if (parsedNumbers.length === 0) throw new Error("Enter at least one positive integer");
        const result = calculateFactors(parsedNumbers, calcType);
        results.push({ numbers: parsedNumbers, type: calcType, result });
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
        for (const dataset of datasets) {
          try {
            const parsedNumbers = dataset
              .split(",")
              .map((n) => parseInt(n.trim()))
              .filter((n) => !isNaN(n) && Number.isInteger(n) && n > 0);
            if (parsedNumbers.length === 0) continue;
            const result = calculateFactors(parsedNumbers, calcType);
            results.push({ numbers: parsedNumbers, type: calcType, result });
          } catch (e) {
            console.warn(`Skipping invalid batch entry: ${e.message}`);
          }
        }
        if (results.length === 0) throw new Error("No valid datasets found");
      }
      displayResults(results, isBatch);
      setSuccess("Calculation completed successfully");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      showError(e.message || "An unexpected error occurred");
    }
  };

  const displayResults = (results, isBatch) => {
    let output = "";
    if (isBatch) {
      output =
        '<table class="w-full text-sm text-gray-600"><thead><tr class="bg-gray-200"><th class="p-2">Numbers</th><th class="p-2">Type</th><th class="p-2">Result</th></tr></thead><tbody>';
      for (const r of results) {
        let resultStr = "";
        if (r.result.factors)
          resultStr += `Factors: ${r.result.factors.map((f) => f.factors.join(", ")).join("; ")}`;
        if (r.result.prime)
          resultStr += `${resultStr ? "<br>" : ""}Prime: ${r.result.prime
            .map((p) =>
              Object.entries(p.factors)
                .map(([k, v]) => `${k}^${v}`)
                .join(" × ")
            )
            .join("; ")}`;
        if (r.result.gcd) resultStr += `${resultStr ? "<br>" : ""}GCD: ${r.result.gcd.value}`;
        if (r.result.lcm) resultStr += `${resultStr ? "<br>" : ""}LCM: ${r.result.lcm.lcm}`;
        output += `<tr>
          <td class="p-2">${r.numbers.join(", ")}</td>
          <td class="p-2">${r.type.replace("-", " ")}</td>
          <td class="p-2">${resultStr}</td>
        </tr>`;
      }
      output += "</tbody></table>";
    } else {
      const r = results[0];
      output = `<strong>Calculation (Type: ${r.type.replace("-", " ")}):</strong><br>`;
      output += `Numbers: ${r.numbers.join(", ")}<br>`;
      if (r.result.factors) {
        output += `<strong>Factors:</strong><br>`;
        r.result.factors.forEach((f) => {
          output += `${f.number}: ${f.factors.join(", ")}<br>`;
        });
      }
      if (r.result.prime) {
        output += `<strong>Prime Factorization:</strong><br>`;
        r.result.prime.forEach((p) => {
          const factors = Object.entries(p.factors)
            .map(([k, v]) => `${k}^${v}`)
            .join(" × ");
          output += `${p.number}: ${factors}<br>`;
          output += `Steps:<br>${p.steps.map((s) => `  ${s}`).join("<br>")}<br>`;
        });
      }
      if (r.result.gcd) {
        output += `GCD: ${r.result.gcd.value}<br>`;
        output += `Steps:<br>${r.result.gcd.steps.map((s) => `  ${s}`).join("<br>")}<br>`;
      }
      if (r.result.lcm) {
        output += `LCM: ${r.result.lcm.lcm}<br>`;
        output += `Steps:<br>${r.result.lcm.steps.map((s) => `  ${s}`).join("<br>")}<br>`;
      }
      if (r.result.commonFactors) {
        output += `Common Factors: ${r.result.commonFactors.join(", ") || "None"}<br>`;
      }
    }
    setResults([{ text: output }]);
    saveToHistory(results[0].type, results[0].numbers.join(", "), JSON.stringify(results[0].result));
    updateVisualizations(results);
  };

  const updateVisualizations = (results) => {
    const r = results[0].result;
    const numbers = results[0].numbers;

    if (primeFactorChartInstance.current) primeFactorChartInstance.current.destroy();
    if (r.prime && primeFactorChartRef.current) {
      const datasets = numbers.map((num, i) => ({
        label: `Number ${num}`,
        data: Object.entries(r.prime.find((p) => p.number === num)?.factors || {}).map(([prime, power]) => ({
          x: prime,
          y: power,
        })),
        backgroundColor: `hsl(${i * 60}, 70%, 50%)`,
      }));
      primeFactorChartInstance.current = new Chart(primeFactorChartRef.current, {
        type: "bar",
        data: { datasets },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Prime Factors" } },
            y: { title: { display: true, text: "Powers" }, beginAtZero: true },
          },
          plugins: { title: { display: true, text: "Prime Factorization" } },
        },
      });
    }

    if (commonFactorsChartInstance.current) commonFactorsChartInstance.current.destroy();
    if (r.commonFactors && numbers.length > 1 && commonFactorsChartRef.current) {
      const allFactors = numbers.map((n) => getFactors(n));
      const datasets = allFactors.map((factors, i) => ({
        label: `Factors of ${numbers[i]}`,
        data: factors.map((f) => ({ x: f, y: allFactors.every((fs) => fs.includes(f)) ? 2 : 1 })),
        backgroundColor: `hsl(${i * 60}, 70%, 50%)`,
        pointRadius: 5,
      }));
      commonFactorsChartInstance.current = new Chart(commonFactorsChartRef.current, {
        type: "scatter",
        data: { datasets },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Factors" } },
            y: { title: { display: true, text: "Common" }, min: 0, max: 3 },
          },
          plugins: { title: { display: true, text: "Common Factors" } },
        },
      });
    }

    if (multiplesTimelineInstance.current) multiplesTimelineInstance.current.destroy();
    if (r.lcm && multiplesTimelineRef.current) {
      const maxMultiple = r.lcm.lcm * 3;
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
    setNumbers("");
    setBatchText("");
    setBatchFile(null);
    setSliderValue(12);
    clearMessages();
    clearVisualizations();
    setResults([]);
    setSuccess("Inputs cleared");
    setTimeout(() => setSuccess(""), 2000);
  };

  const clearVisualizations = () => {
    if (primeFactorChartInstance.current) primeFactorChartInstance.current.destroy();
    if (commonFactorsChartInstance.current) commonFactorsChartInstance.current.destroy();
    if (multiplesTimelineInstance.current) multiplesTimelineInstance.current.destroy();
    primeFactorChartInstance.current = null;
    commonFactorsChartInstance.current = null;
    multiplesTimelineInstance.current = null;
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const showError = (message) => {
    setError(String(message || "An unexpected error occurred"));
    setTimeout(() => setError(""), 3000);
  };

  const saveCalculation = () => {
    if (results.length === 0) {
      showError("No results to save");
      return;
    }
    setSuccess("Calculation saved to history");
    setTimeout(() => setSuccess(""), 2000);
  };

  const saveToHistory = (type, numbers, result) => {
    const entry = {
      date: new Date().toLocaleString(),
      type: String(type || ""),
      numbers: String(numbers || ""),
      result: String(result || ""),
    };
    const updatedHistory = [...calculationHistory, entry];
    setCalculationHistory(updatedHistory);
    localStorage.setItem("factorCalcHistory", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setCalculationHistory([]);
    localStorage.removeItem("factorCalcHistory");
    setSuccess("History cleared");
    setTimeout(() => setSuccess(""), 2000);
  };

  const exportCSV = () => {
    const headers = ["Date", "Type", "Numbers", "Result"];
    const rows = calculationHistory.map((entry) => [
      `"${entry.date}"`,
      `"${entry.type}"`,
      `"${entry.numbers}"`,
      `"${entry.result}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile("factor_history.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify(calculationHistory, null, 2);
    downloadFile("factor_history.json", "application/json", json);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Factor Calculation History", 10, 10);
    let y = 20;
    calculationHistory.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Type: ${entry.type.replace("-", " ")}`, 10, y + 10);
      doc.text(`Numbers: ${entry.numbers}`, 10, y + 20);
      doc.text(`Result: ${entry.result}`, 10, y + 30);
      y += 50;
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("factor_history.pdf");
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
          <h1 className="text-2xl font-bold text-red-900 mb-6">Advanced Factor Calculator</h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Calculation Type
                  <span className="relative group inline-block ml-1 cursor-pointer">
                    ?
                    <span className="absolute invisible bg-gray-800 text-white text-center rounded-lg p-2 w-48 -ml-24 bottom-full opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      Select what to compute: factors, prime factors, GCD, or LCM.
                    </span>
                  </span>
                </label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="p-3 border rounded-lg w-full"
                >
                  <option value="factors">Factors</option>
                  <option value="prime-factorization">Prime Factorization</option>
                  <option value="gcd">Greatest Common Divisor (GCD)</option>
                  <option value="lcm">Least Common Multiple (LCM)</option>
                  <option value="all">All Calculations</option>
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
                  value={numbers}
                  onChange={(e) => setNumbers(e.target.value)}
                  placeholder="e.g., 12,18,24"
                  className="p-3 border rounded-lg w-full"
                />
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={sliderValue}
                  onChange={(e) => {
                    setSliderValue(e.target.value);
                    setNumbers(e.target.value);
                  }}
                  className="mt-2 w-full"
                />
                <span className="text-sm text-gray-600">{sliderValue}</span>
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
            Learn About Factors
          </button>

          {results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div dangerouslySetInnerHTML={{ __html: results[0].text }} />
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Prime Factorization Chart</h3>
                <canvas ref={primeFactorChartRef} className="max-w-[600px] h-80 mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Common Factors</h3>
                <canvas ref={commonFactorsChartRef} className="max-w-[600px] h-80 mx-auto" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-900">Multiples Timeline</h3>
                <canvas ref={multiplesTimelineRef} className="max-w-[600px] h-80 mx-auto" />
              </div>
              {calculationHistory.length > 0 && (
                <div className="mt-6 max-h-[200px] overflow-y-auto">
                  <h3 className="text-md font-medium text-red-900">Calculation History</h3>
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">Date</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Numbers</th>
                        <th className="p-2">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationHistory.map((entry, index) => (
                        <tr key={index}>
                          <td className="p-2">{entry.date}</td>
                          <td className="p-2">{entry.type.replace("-", " ")}</td>
                          <td className="p-2">{entry.numbers}</td>
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
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg max-w-[600px] w-[90%] relative">
                <span
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold mb-4">Understanding Factors and Related Concepts</h2>
                <p className="mb-4">
                  Factors are numbers that divide another number without leaving a remainder. This calculator
                  helps you explore factors, prime factorization, GCD, and LCM.
                </p>
                <h3 className="text-md font-medium mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Factors:</strong> All integers that divide a number evenly (e.g., factors of 12
                    are 1, 2, 3, 4, 6, 12).
                  </li>
                  <li>
                    <strong>Prime Factorization:</strong> Express a number as a product of prime numbers
                    (e.g., 12 = 2² × 3).
                  </li>
                  <li>
                    <strong>GCD:</strong> Greatest Common Divisor is the largest number that divides all input
                    numbers (computed via Euclidean algorithm).
                  </li>
                  <li>
                    <strong>LCM:</strong> Least Common Multiple is the smallest number divisible by all input
                    numbers (computed via GCD or prime factorization).
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Applications</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>Mathematics:</strong> Simplifying fractions, solving Diophantine equations.
                  </li>
                  <li>
                    <strong>Programming:</strong> Optimizing algorithms, resource allocation.
                  </li>
                  <li>
                    <strong>Engineering:</strong> Gear ratios, signal processing.
                  </li>
                  <li>
                    <strong>Education:</strong> Teaching number theory concepts.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Enter positive integers only.</li>
                  <li>Use batch input for multiple sets (e.g., "12,18;24,36").</li>
                  <li>Prime factorization is useful for understanding number structure.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Resources</h3>
                <p className="mb-4">For more information, visit:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <a
                      href="https://www.mathsisfun.com/numbers/factors-all-tool.html"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Factors Explained
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://en.wikipedia.org/wiki/Greatest_common_divisor"
                      target="_blank"
                      className="text-red-500 hover:underline"
                    >
                      Wikipedia: GCD
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
