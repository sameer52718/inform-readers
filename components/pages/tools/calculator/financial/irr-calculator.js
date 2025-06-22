"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [cashflows, setCashflows] = useState([{ period: "Year 0", amount: "" }]);
  const [frequency, setFrequency] = useState("annual");
  const [discountRate, setDiscountRate] = useState(5);
  const [darkMode, setDarkMode] = useState(false);
  const [results, setResults] = useState(null);
  const cashflowChartRef = useRef(null);
  const sensitivityChartRef = useRef(null);
  let cashflowChart, sensitivityChart;

  useEffect(() => {
    if (cashflowChartRef.current) {
      cashflowChart = new Chart(cashflowChartRef.current, {
        type: "bar",
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Cash Flow Over Time" } },
          scales: { y: { beginAtZero: true } },
        },
      });
    }
    if (sensitivityChartRef.current) {
      sensitivityChart = new Chart(sensitivityChartRef.current, {
        type: "line",
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "NPV Sensitivity to Discount Rate" },
          },
          scales: { y: { beginAtZero: false } },
        },
      });
    }
    return () => {
      cashflowChart?.destroy();
      sensitivityChart?.destroy();
    };
  }, []);

  const addCashflow = () => {
    setCashflows([...cashflows, { period: `Year ${cashflows.length}`, amount: "" }]);
  };

  const removeCashflow = (index) => {
    if (cashflows.length > 1) {
      setCashflows(cashflows.filter((_, i) => i !== index));
    }
  };

  const updateCashflow = (index, field, value) => {
    const newCashflows = [...cashflows];
    newCashflows[index][field] = value;
    setCashflows(newCashflows);
  };

  const calculateIRRValue = (values) => {
    const maxIterations = 1000;
    const tolerance = 0.0001;
    let guess = 0.1;

    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let derivative = 0;
      values.forEach((cf, t) => {
        npv += cf / Math.pow(1 + guess, t);
        derivative -= (t * cf) / Math.pow(1 + guess, t + 1);
      });
      if (Math.abs(npv) < tolerance) return guess * 100;
      const newGuess = guess - npv / derivative;
      if (Math.abs(newGuess - guess) < tolerance) return guess * 100;
      guess = newGuess;
    }
    return NaN;
  };

  const calculateNPV = (values, rate) => {
    return values.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate / 100, t), 0);
  };

  const calculateIRR = () => {
    if (cashflows.length === 0 || cashflows.every((cf) => !cf.amount || parseFloat(cf.amount) === 0)) {
      alert("Please add at least one valid cash flow.");
      return;
    }
    const values = cashflows.map((cf) => parseFloat(cf.amount) || 0);
    const irr = calculateIRRValue(values);
    const npv = calculateNPV(values, discountRate);
    const totalCashflow = values.reduce((sum, cf) => sum + cf, 0);

    let analysis = "";
    if (isNaN(irr)) {
      analysis =
        "The IRR could not be calculated. Ensure cash flows include both negative (investment) and positive (returns) values.";
    } else if (irr > discountRate) {
      analysis = `The IRR (${irr.toFixed(
        2
      )}%) exceeds the discount rate (${discountRate}%), indicating a potentially profitable investment.`;
    } else if (irr > 0) {
      analysis = `The IRR (${irr.toFixed(
        2
      )}%) is positive but below the discount rate (${discountRate}%). Consider alternative investments with higher returns.`;
    } else {
      analysis = `The IRR (${irr.toFixed(
        2
      )}%) is negative, suggesting the investment may result in a loss. Re-evaluate the project.`;
    }

    setResults({ irr, npv, totalCashflow, analysis });

    cashflowChart.data = {
      labels: cashflows.map((cf) => cf.period),
      datasets: [
        {
          label: "Cash Flow ($)",
          data: values,
          backgroundColor: values.map((v) => (v >= 0 ? "#22c55e" : "#ef4444")),
        },
      ],
    };
    cashflowChart.update();

    const rates = Array.from({ length: 21 }, (_, i) => i - 10 + (irr || 0));
    const npvValues = rates.map((rate) => calculateNPV(values, rate));
    sensitivityChart.data = {
      labels: rates.map((r) => `${r.toFixed(2)}%`),
      datasets: [
        {
          label: "NPV ($)",
          data: npvValues,
          borderColor: "#3b82f6",
          fill: false,
          tension: 0.1,
        },
      ],
    };
    sensitivityChart.update();
  };

  const saveCalculation = () => {
    const data = { frequency, discountRate, cashflows };
    localStorage.setItem("irrCalculation", JSON.stringify(data));
    alert("Calculation saved!");
  };

  const loadCalculation = () => {
    const saved = localStorage.getItem("irrCalculation");
    if (saved) {
      const data = JSON.parse(saved);
      setFrequency(data.frequency);
      setDiscountRate(data.discountRate);
      setCashflows(data.cashflows);
      calculateIRR();
    } else {
      alert("No saved calculation found.");
    }
  };

  const exportResults = () => {
    if (!results) return;
    const exportContent = `
Internal Rate of Return (IRR) Calculator Results
==============================================
Internal Rate of Return: ${isNaN(results.irr) ? "Non-converging" : `${results.irr.toFixed(2)}%`}
Net Present Value: $${results.npv.toFixed(2)}
Total Cash Flow: $${results.totalCashflow.toFixed(2)}

Cash Flows:
${cashflows.map((cf) => `- ${cf.period}: $${(parseFloat(cf.amount) || 0).toFixed(2)}`).join("\n")}

Investment Analysis: ${results.analysis}
==============================================
Generated on: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "irr_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Internal Rate of Return (IRR) Calculator Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text("Results:", 20, 40);
    doc.text(
      `Internal Rate of Return: ${isNaN(results.irr) ? "Non-converging" : `${results.irr.toFixed(2)}%`}`,
      20,
      50
    );
    doc.text(`Net Present Value: $${results.npv.toFixed(2)}`, 20, 60);
    doc.text(`Total Cash Flow: $${results.totalCashflow.toFixed(2)}`, 20, 70);
    doc.text("Cash Flows:", 20, 80);
    let y = 90;
    cashflows.forEach((cf) => {
      doc.text(`${cf.period}: $${(parseFloat(cf.amount) || 0).toFixed(2)}`, 20, y);
      y += 10;
    });
    doc.text("Investment Analysis:", 20, y);
    doc.text(results.analysis, 20, y + 10, { maxWidth: 160 });
    doc.save("irr_report.pdf");
  };

  return (
    <>
      <div
        className={`bg-white min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
          darkMode ? "dark" : ""
        }`}
      >
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl w-full transition-colors duration-300">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-indigo-100">Advanced IRR Calculator</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
            >
              Toggle Dark Mode
            </button>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Cash Flows</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Cash Flow Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="annual">Annual</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="space-y-4">
              {cashflows.map((cf, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                  <input
                    type="text"
                    value={cf.period}
                    onChange={(e) => updateCashflow(index, "period", e.target.value)}
                    placeholder="Period (e.g., Year 0)"
                    required
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                  />
                  <input
                    type="number"
                    value={cf.amount}
                    onChange={(e) => updateCashflow(index, "amount", e.target.value)}
                    placeholder="Amount (e.g., -10000)"
                    required
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                  />
                  <button
                    onClick={() => removeCashflow(index)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addCashflow}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Add Cash Flow
            </button>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">NPV Discount Rate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Discount Rate (%)
                </label>
                <input
                  type="number"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 5)}
                  placeholder="e.g., 5"
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={calculateIRR}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate IRR
            </button>
            <button
              onClick={saveCalculation}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Save Calculation
            </button>
            <button
              onClick={loadCalculation}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Load Saved
            </button>
          </div>
          {results && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-indigo-100">
                    Internal Rate of Return
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {isNaN(results.irr) ? "Non-converging" : `${results.irr.toFixed(2)}%`}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-indigo-100">
                    Net Present Value
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    ${results.npv.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-indigo-100">Total Cash Flow</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    ${results.totalCashflow.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-indigo-100 mb-4">
                  Cash Flow Over Time
                </h3>
                <canvas ref={cashflowChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-indigo-100 mb-4">
                  Sensitivity Analysis
                </h3>
                <canvas ref={sensitivityChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-indigo-100 mb-4">
                  Investment Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{results.analysis}</p>
              </div>
              <div className="mt-6 flex gap-4 flex-wrap">
                <button
                  onClick={exportPDF}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
                >
                  Export as PDF
                </button>
                <button
                  onClick={exportResults}
                  className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600"
                >
                  Export as Text
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .hover\\:-translate-y-1:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}
