"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function AdvancedStdDevCalculator() {
  const [numbers, setNumbers] = useState("");
  const [isPopulation, setIsPopulation] = useState(false);
  const [results, setResults] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [history, setHistory] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("stdDevCalcHistory") || "[]");
    setHistory(storedHistory);
  }, []);

  const calculate = () => {
    const numArray = numbers
      .split(",")
      .map((num) => parseFloat(num.trim()))
      .filter((num) => !isNaN(num));

    if (numArray.length === 0) {
      alert("Please enter valid numbers.");
      return;
    }

    const mean = numArray.reduce((sum, num) => sum + num, 0) / numArray.length;
    const squaredDiffs = numArray.map((num) => (num - mean) ** 2);
    const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
    const variance = sumSquaredDiffs / (isPopulation ? numArray.length : numArray.length - 1);
    const stdDev = Math.sqrt(variance);
    const sum = numArray.reduce((sum, num) => sum + num, 0);
    const min = Math.min(...numArray);
    const max = Math.max(...numArray);
    const range = max - min;

    const resultData = {
      mean: mean.toFixed(2),
      variance: variance.toFixed(2),
      stdDev: stdDev.toFixed(2),
      count: numArray.length,
      sum: sum.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2),
      range: range.toFixed(2),
    };

    setResults(resultData);

    const steps = [
      `Data: [${numArray.join(", ")}], N = ${numArray.length}`,
      `Step 1: Calculate the Mean (μ or x̄)`,
      `Formula: Mean = (Sum of all numbers) / N`,
      `Sum = ${numArray.join(" + ")} = ${sum.toFixed(2)}`,
      `Mean = ${sum.toFixed(2)} / ${numArray.length} = ${mean.toFixed(2)}`,
      `Step 2: Calculate Squared Differences from Mean`,
      ...numArray.map(
        (num, i) =>
          `(${num.toFixed(2)} - ${mean.toFixed(2)})² = ${(num - mean).toFixed(2)}² = ${squaredDiffs[
            i
          ].toFixed(2)}`
      ),
      `Step 3: Sum of Squared Differences`,
      `Sum = ${squaredDiffs.map((d) => d.toFixed(2)).join(" + ")} = ${sumSquaredDiffs.toFixed(2)}`,
      `Step 4: Calculate Variance (${isPopulation ? "Population" : "Sample"})`,
      `Formula: Variance = (Sum of Squared Differences) / ${isPopulation ? "N" : "(N - 1)"}`,
      `Variance = ${sumSquaredDiffs.toFixed(2)} / ${
        isPopulation ? numArray.length : numArray.length - 1
      } = ${variance.toFixed(2)}`,
      `Step 5: Calculate Standard Deviation`,
      `Formula: Standard Deviation = √(Variance)`,
      `Standard Deviation = √(${variance.toFixed(2)}) = ${stdDev.toFixed(2)}`,
    ];

    setCalculationSteps(steps);

    const historyEntry = {
      input: numArray.join(", "),
      mean: mean.toFixed(2),
      stdDev: stdDev.toFixed(2),
      type: isPopulation ? "Population" : "Sample",
    };

    const updatedHistory = [...history, historyEntry];
    setHistory(updatedHistory);
    localStorage.setItem("stdDevCalcHistory", JSON.stringify(updatedHistory));

    updateChart(numArray, mean, stdDev);
  };

  const clearInput = () => {
    setNumbers("");
    setResults(null);
    setCalculationSteps([]);
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
  };

  const exportResults = () => {
    if (!results) {
      alert("No results to export.");
      return;
    }

    const resultText = Object.entries(results)
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join("\n");
    const stepsText = calculationSteps.join("\n");
    const content = `${resultText}\n\nCalculation Steps:\n${stepsText}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "standard_deviation_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const createHistogramData = (numbers) => {
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const binCount = Math.min(10, numbers.length);
    const binWidth = (max - min) / binCount;
    const bins = Array(binCount).fill(0);
    const labels = [];

    numbers.forEach((num) => {
      const binIndex = Math.min(Math.floor((num - min) / binWidth), binCount - 1);
      bins[binIndex]++;
    });

    for (let i = 0; i < binCount; i++) {
      const binStart = (min + i * binWidth).toFixed(1);
      const binEnd = (min + (i + 1) * binWidth).toFixed(1);
      labels.push(`${binStart}-${binEnd}`);
    }

    return { labels, frequencies: bins };
  };

  const updateChart = (numbers, mean, stdDev) => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const histogramData = createHistogramData(numbers);
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: histogramData.labels,
        datasets: [
          {
            label: "Frequency",
            data: histogramData.frequencies,
            backgroundColor: "rgba(239, 68, 68, 0.5)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
          x: { title: { display: true, text: "Value Bins" } },
        },
        plugins: {
          annotation: {
            annotations: {
              meanLine: {
                type: "line",
                xMin: mean,
                xMax: mean,
                borderColor: "#ef4444",
                borderWidth: 2,
                label: {
                  content: "Mean",
                  enabled: true,
                  position: "top",
                  backgroundColor: "rgba(239, 68, 68, 0.8)",
                  color: "#ffffff",
                },
              },
              stdDevLine1: {
                type: "line",
                xMin: mean - stdDev,
                xMax: mean - stdDev,
                borderColor: "#dc2626",
                borderWidth: 2,
                label: {
                  content: "-1 SD",
                  enabled: true,
                  position: "top",
                  backgroundColor: "rgba(220, 38, 38, 0.8)",
                  color: "#ffffff",
                },
              },
              stdDevLine2: {
                type: "line",
                xMin: mean + stdDev,
                xMax: mean + stdDev,
                borderColor: "#dc2626",
                borderWidth: 2,
                label: {
                  content: "+1 SD",
                  enabled: true,
                  position: "top",
                  backgroundColor: "rgba(220, 38, 38, 0.8)",
                  color: "#ffffff",
                },
              },
            },
          },
        },
      },
    });
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-red-900 text-center mb-8">
            Advanced Standard Deviation Calculator
          </h1>

          <div className="mb-6">
            <label htmlFor="numbers" className="block text-sm font-medium text-gray-700 mb-2">
              Enter numbers (comma-separated):
            </label>
            <input
              type="text"
              id="numbers"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              placeholder="e.g., 10, 20, 30, 40"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="population"
                checked={isPopulation}
                onChange={(e) => setIsPopulation(e.target.checked)}
                className="h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="population" className="ml-2 text-sm text-gray-700">
                Calculate Population Standard Deviation
              </label>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={calculate}
              className="flex-1 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
            >
              Calculate
            </button>
            <button
              onClick={clearInput}
              className="flex-1 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
            >
              Clear
            </button>
            <button
              onClick={exportResults}
              className="flex-1 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
            >
              Export
            </button>
          </div>

          {results && (
            <div className="mb-6 bg-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-red-900 mb-4">Results</h2>
              <p className="text-gray-700 mb-1">Mean: {results.mean}</p>
              <p className="text-gray-700 mb-1">Variance: {results.variance}</p>
              <p className="text-gray-700 mb-1">Standard Deviation: {results.stdDev}</p>
              <p className="text-gray-700 mb-1">Count: {results.count}</p>
              <p className="text-gray-700 mb-1">Sum: {results.sum}</p>
              <p className="text-gray-700 mb-1">Min: {results.min}</p>
              <p className="text-gray-700 mb-1">Max: {results.max}</p>
              <p className="text-gray-700 mb-1">Range: {results.range}</p>
            </div>
          )}

          {calculationSteps.length > 0 && (
            <div className="mb-6 bg-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-red-900 mb-4">Calculation Steps</h2>
              <ul className="list-decimal pl-5 text-gray-700">
                {calculationSteps.map((step, index) => (
                  <li key={index} className="mb-1">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6 bg-gray-200 p-4 rounded-lg">
            <canvas ref={chartRef} className="w-full h-64"></canvas>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-red-900 mb-4">Calculation History</h2>
            <div className="max-h-36 overflow-y-auto bg-gray-200 p-4 rounded-lg">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className="p-3 mb-2 bg-gray-100 rounded-lg hover:bg-red-100 transition transform hover:-translate-y-1"
                >
                  <p className="text-sm text-gray-700">Input: {entry.input}</p>
                  <p className="text-sm text-gray-700">Mean: {entry.mean}</p>
                  <p className="text-sm text-gray-700">
                    Std Dev: {entry.stdDev} ({entry.type})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
