"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [salesDetails, setSalesDetails] = useState({ amount: "", type: "product", structure: "flat" });
  const [rates, setRates] = useState([{ id: 1, threshold: "0", percentage: "", description: "Base Rate" }]);
  const [bonuses, setBonuses] = useState([{ id: 1, threshold: "", amount: "", description: "Q1 Bonus" }]);
  const [compareRate, setCompareRate] = useState("");
  const [results, setResults] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const commissionChartRef = useRef(null);
  const commissionChartInstance = useRef(null);

  useEffect(() => {
    if (commissionChartRef.current) {
      commissionChartInstance.current = new Chart(commissionChartRef.current, {
        type: "pie",
        data: {
          labels: [],
          datasets: [{ data: [], backgroundColor: ["#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#3b82f6"] }],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Commission Distribution" } },
        },
      });
    }
    return () => commissionChartInstance.current?.destroy();
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const addRate = () => {
    const newId = Math.max(...rates.map((r) => r.id)) + 1;
    setRates([...rates, { id: newId, threshold: "0", percentage: "", description: "Base Rate" }]);
  };

  const removeRate = (id) => {
    if (rates.length > 1) setRates(rates.filter((r) => r.id !== id));
  };

  const updateRate = (id, field, value) => {
    setRates(rates.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addBonus = () => {
    const newId = Math.max(...bonuses.map((b) => b.id)) + 1;
    setBonuses([...bonuses, { id: newId, threshold: "", amount: "", description: "Q1 Bonus" }]);
  };

  const removeBonus = (id) => {
    setBonuses(bonuses.filter((b) => b.id !== id));
  };

  const updateBonus = (id, field, value) => {
    setBonuses(bonuses.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const calculateCommission = () => {
    const salesAmount = parseFloat(salesDetails.amount) || 0;
    if (salesAmount <= 0) {
      setResults({ error: "Please provide a valid sales amount." });
      return;
    }
    if (rates.length === 0 || rates.every((r) => parseFloat(r.percentage) <= 0)) {
      setResults({ error: "Please provide at least one valid commission rate." });
      return;
    }

    let baseCommission = 0;
    let commissionBreakdown = [];

    if (salesDetails.structure === "flat") {
      const rate = parseFloat(rates[0].percentage) / 100;
      baseCommission = salesAmount * rate;
      commissionBreakdown.push({
        description: rates[0].description,
        threshold: parseFloat(rates[0].threshold),
        rate: parseFloat(rates[0].percentage),
        commission: baseCommission,
      });
    } else if (salesDetails.structure === "tiered") {
      const sortedRates = [...rates].sort((a, b) => parseFloat(a.threshold) - parseFloat(b.threshold));
      let remainingSales = salesAmount;
      for (const rate of sortedRates) {
        if (remainingSales <= 0) break;
        const threshold = parseFloat(rate.threshold);
        const applicableSales = Math.min(
          remainingSales,
          threshold ? salesAmount - threshold : remainingSales
        );
        if (applicableSales > 0 && salesAmount >= threshold) {
          const commission = applicableSales * (parseFloat(rate.percentage) / 100);
          baseCommission += commission;
          commissionBreakdown.push({
            description: rate.description,
            threshold,
            rate: parseFloat(rate.percentage),
            commission,
          });
          remainingSales -= applicableSales;
        }
      }
    } else if (salesDetails.structure === "sliding") {
      const sortedRates = [...rates].sort((a, b) => parseFloat(a.threshold) - parseFloat(b.threshold));
      let applicableRate = sortedRates[0];
      for (const rate of sortedRates) {
        if (salesAmount >= parseFloat(rate.threshold)) {
          applicableRate = rate;
        }
      }
      baseCommission = salesAmount * (parseFloat(applicableRate.percentage) / 100);
      commissionBreakdown.push({
        description: applicableRate.description,
        threshold: parseFloat(applicableRate.threshold),
        rate: parseFloat(applicableRate.percentage),
        commission: baseCommission,
      });
    }

    let bonusEarnings = 0;
    const bonusBreakdown = bonuses
      .filter((b) => salesAmount >= parseFloat(b.threshold))
      .map((b) => {
        const amount = parseFloat(b.amount);
        bonusEarnings += amount;
        return {
          description: b.description,
          threshold: parseFloat(b.threshold),
          rate: 0,
          commission: amount,
        };
      });

    const totalCommission = baseCommission + bonusEarnings;
    const compareCommission = compareRate ? salesAmount * (parseFloat(compareRate) / 100) : 0;
    const comparisonText = compareRate
      ? `Alternative Flat Rate (${parseFloat(compareRate).toFixed(
          2
        )}%):\n- Commission: $${compareCommission.toFixed(2)}\n- Difference: $${(
          totalCommission - compareCommission
        ).toFixed(2)}`
      : "No comparison provided.";
    const commissionRate = (totalCommission / salesAmount) * 100;
    let analysis;
    if (commissionRate > 10) {
      analysis = `Your commission rate (${commissionRate.toFixed(
        2
      )}% of sales) is highly competitive. Consider pushing for higher sales to maximize earnings.`;
    } else if (commissionRate > 5) {
      analysis = `Your commission rate (${commissionRate.toFixed(
        2
      )}% of sales) is moderate. Explore opportunities to hit higher tiers or bonuses.`;
    } else {
      analysis = `Your commission rate (${commissionRate.toFixed(
        2
      )}% of sales) is low. Negotiate better rates or focus on high-value sales.`;
    }

    setResults({
      totalCommission,
      baseCommission,
      bonusEarnings,
      commissionBreakdown,
      bonusBreakdown,
      comparisonText,
      analysis,
    });

    if (commissionChartInstance.current) {
      commissionChartInstance.current.data.labels = [
        ...commissionBreakdown.map((b) => b.description),
        ...bonusBreakdown.map((b) => b.description),
      ];
      commissionChartInstance.current.data.datasets[0].data = [
        ...commissionBreakdown.map((b) => b.commission),
        ...bonusBreakdown.map((b) => b.commission),
      ];
      commissionChartInstance.current.update();
    }
  };

  const saveCalculation = () => {
    const data = { salesDetails, rates, bonuses, compareRate };
    localStorage.setItem("commissionCalculation", JSON.stringify(data));
    setResults({ ...results, message: "Calculation saved!" });
  };

  const loadCalculation = () => {
    const saved = localStorage.getItem("commissionCalculation");
    if (saved) {
      const data = JSON.parse(saved);
      setSalesDetails(data.salesDetails);
      setRates(data.rates);
      setBonuses(data.bonuses);
      setCompareRate(data.compareRate);
      calculateCommission();
    } else {
      setResults({ error: "No saved calculation found." });
    }
  };

  const exportResults = () => {
    if (!results) return;
    const exportContent = `
Commission Calculator Results
============================
Total Commission: $${results.totalCommission.toFixed(2)}
Base Commission: $${results.baseCommission.toFixed(2)}
Bonus Earnings: $${results.bonusEarnings.toFixed(2)}

Sales Details:
- Total Sales Amount: $${salesDetails.amount}
- Sales Type: ${salesDetails.type}
- Commission Structure: ${salesDetails.structure}

Commission Breakdown:
${[...results.commissionBreakdown, ...results.bonusBreakdown]
  .map(
    (b) =>
      `${b.description}: Threshold $${b.threshold.toFixed(2)}, Rate ${
        b.rate ? b.rate.toFixed(2) + "%" : "Bonus"
      }, Commission $${b.commission.toFixed(2)}`
  )
  .join("\n")}

Commission Comparison:
${results.comparisonText}

Performance Analysis: ${results.analysis}
============================
Generated on: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "commission_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Commission Calculator Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text("Results:", 20, 40);
    doc.text(`Total Commission: $${results.totalCommission.toFixed(2)}`, 20, 50);
    doc.text(`Base Commission: $${results.baseCommission.toFixed(2)}`, 20, 60);
    doc.text(`Bonus Earnings: $${results.bonusEarnings.toFixed(2)}`, 20, 70);
    doc.text("Sales Details:", 20, 80);
    doc.text(`Total Sales Amount: $${salesDetails.amount}`, 20, 90);
    doc.text(`Sales Type: ${salesDetails.type}`, 20, 100);
    doc.text(`Commission Structure: ${salesDetails.structure}`, 20, 110);
    doc.text("Commission Breakdown:", 20, 120);
    let y = 130;
    [...results.commissionBreakdown, ...results.bonusBreakdown].forEach((row) => {
      doc.text(
        `${row.description}: Threshold $${row.threshold.toFixed(2)}, Rate ${
          row.rate ? row.rate.toFixed(2) + "%" : "Bonus"
        }, Commission $${row.commission.toFixed(2)}`,
        20,
        y
      );
      y += 10;
    });
    doc.text("Commission Comparison:", 20, y);
    doc.text(results.comparisonText || "No comparison provided.", 20, y + 10, { maxWidth: 160 });
    y += 30;
    doc.text("Performance Analysis:", 20, y);
    doc.text(results.analysis, 20, y + 10, { maxWidth: 160 });
    doc.save("commission_report.pdf");
  };

  return (
    <>
      <div
        className={`bg-white  flex items-center justify-center p-4 ${isDarkMode ? "dark" : ""}`}
      >
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Advanced Commission Calculator
            </h1>
            <button
              onClick={toggleDarkMode}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
            >
              Toggle Dark Mode
            </button>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Sales Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "amount", label: "Total Sales Amount ($)", type: "number", placeholder: "e.g., 10000" },
                {
                  id: "type",
                  label: "Sales Type",
                  type: "select",
                  options: [
                    { value: "product", label: "Product Sales" },
                    { value: "service", label: "Service Sales" },
                    { value: "real-estate", label: "Real Estate" },
                    { value: "other", label: "Other" },
                  ],
                },
                {
                  id: "structure",
                  label: "Commission Structure",
                  type: "select",
                  options: [
                    { value: "flat", label: "Flat Rate" },
                    { value: "tiered", label: "Tiered Rate" },
                    { value: "sliding", label: "Sliding Scale" },
                  ],
                },
              ].map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      value={salesDetails[field.id]}
                      onChange={(e) => setSalesDetails({ ...salesDetails, [field.id]: e.target.value })}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={salesDetails[field.id]}
                      onChange={(e) => setSalesDetails({ ...salesDetails, [field.id]: e.target.value })}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Commission Rates</h2>
            <div className="space-y-4">
              {rates.map((rate) => (
                <div key={rate.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                  {[
                    {
                      id: "threshold",
                      type: "number",
                      placeholder: "Threshold ($, 0 for flat)",
                      value: rate.threshold,
                    },
                    {
                      id: "percentage",
                      type: "number",
                      placeholder: "Rate (%)",
                      step: "0.01",
                      value: rate.percentage,
                    },
                    {
                      id: "description",
                      type: "text",
                      placeholder: "Description (e.g., Base Rate)",
                      value: rate.description,
                    },
                  ].map((field) => (
                    <input
                      key={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      step={field.step}
                      value={field.value}
                      onChange={(e) => updateRate(rate.id, field.id, e.target.value)}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                    />
                  ))}
                  <button
                    onClick={() => removeRate(rate.id)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                    disabled={rates.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addRate}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Add Rate
            </button>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Performance Bonuses
            </h2>
            <div className="space-y-4">
              {bonuses.map((bonus) => (
                <div key={bonus.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                  {[
                    {
                      id: "threshold",
                      type: "number",
                      placeholder: "Sales Threshold ($)",
                      value: bonus.threshold,
                    },
                    { id: "amount", type: "number", placeholder: "Bonus ($)", value: bonus.amount },
                    {
                      id: "description",
                      type: "text",
                      placeholder: "Description (e.g., Q1 Bonus)",
                      value: bonus.description,
                    },
                  ].map((field) => (
                    <input
                      key={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) => updateBonus(bonus.id, field.id, e.target.value)}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                    />
                  ))}
                  <button
                    onClick={() => removeBonus(bonus.id)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addBonus}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Add Bonus
            </button>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Compare Commission Structure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Alternative Flat Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 5"
                  value={compareRate}
                  onChange={(e) => setCompareRate(e.target.value)}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 mb-8">
            <button
              onClick={calculateCommission}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate Commission
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
            <div className="animate-fade-in">
              {results.error || results.message ? (
                <p className={`text-center ${results.error ? "text-red-500" : "text-green-500"}`}>
                  {results.error || results.message}
                </p>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Results</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "Total Commission", value: `$${results.totalCommission.toFixed(2)}` },
                      { label: "Base Commission", value: `$${results.baseCommission.toFixed(2)}` },
                      { label: "Bonus Earnings", value: `$${results.bonusEarnings.toFixed(2)}` },
                    ].map((item) => (
                      <div key={item.label}>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{item.label}</h3>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Commission Breakdown
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                        <thead>
                          <tr className="bg-red-500 text-white">
                            {["Description", "Threshold ($)", "Rate", "Commission ($)"].map((h) => (
                              <th key={h} className="p-2">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[...results.commissionBreakdown, ...results.bonusBreakdown].map((row, i) => (
                            <tr key={i} className="even:bg-gray-50 dark:even:bg-gray-700">
                              <td className="p-2">{row.description}</td>
                              <td className="p-2">${row.threshold.toFixed(2)}</td>
                              <td className="p-2">{row.rate ? `${row.rate.toFixed(2)}%` : "Bonus"}</td>
                              <td className="p-2">${row.commission.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Commission Distribution
                    </h3>
                    <canvas
                      ref={commissionChartRef}
                      className="max-h-80 border-2 border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Commission Comparison
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {results.comparisonText}
                    </p>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Performance Analysis
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{results.analysis}</p>
                  </div>
                  <div className="mt-6 flex gap-4">
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
                </>
              )}
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
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .progress-bar {
          height: 20px;
          background: #d1d5db;
          border-radius: 9999px;
          overflow: hidden;
        }
        .progress {
          height: 100%;
          background: #ef4444;
          transition: width 0.5s ease-in-out;
        }
        .dark .progress-bar {
          background: #4b5563;
        }
        .dark .progress {
          background: #60a5fa;
        }
      `}</style>
    </>
  );
}
