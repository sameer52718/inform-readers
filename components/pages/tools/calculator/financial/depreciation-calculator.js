"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [currency, setCurrency] = useState("USD");
  const [assetCost, setAssetCost] = useState("50000");
  const [salvageValue, setSalvageValue] = useState("5000");
  const [usefulLife, setUsefulLife] = useState("5");
  const [method, setMethod] = useState("straight-line");
  const [taxRate, setTaxRate] = useState("30");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [partialYear, setPartialYear] = useState("1");
  const [totalUnits, setTotalUnits] = useState("100000");
  const [annualUnits, setAnnualUnits] = useState([]);
  const [results, setResults] = useState(null);
  const [comparison, setComparison] = useState({});
  const [history, setHistory] = useState(
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("depreciationHistory")) || [] : []
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (method === "units-of-production") {
      setAnnualUnits(Array(parseInt(usefulLife)).fill("20000"));
    } else {
      setAnnualUnits([]);
    }
  }, [method, usefulLife]);

  const formatCurrency = (amount) => `${currency} ${parseFloat(amount).toFixed(2)}`;

  const convertCurrency = () => {
    setError("");
    const rates = { USD: 1, PKR: 277.95, INR: 83.95 };
    const parsedAssetCost = parseFloat(assetCost);
    const parsedSalvageValue = parseFloat(salvageValue);
    if (isNaN(parsedAssetCost) || isNaN(parsedSalvageValue)) {
      setError("Please provide valid asset cost and salvage value.");
      return;
    }
    const newCurrency = currency === "USD" ? "PKR" : currency === "PKR" ? "INR" : "USD";
    setCurrency(newCurrency);
    setAssetCost(((parsedAssetCost * rates[newCurrency]) / rates[currency]).toFixed(2));
    setSalvageValue(((parsedSalvageValue * rates[newCurrency]) / rates[currency]).toFixed(2));
  };

  const calculateSchedule = (
    calcMethod,
    calcAssetCost,
    calcSalvageValue,
    calcUsefulLife,
    calcPartialYear,
    calcAnnualUnits
  ) => {
    let schedule = [];
    let accumulatedDepreciation = 0;
    let bookValue = calcAssetCost;
    const totalUnitsValue = parseFloat(totalUnits) || 100000;

    if (calcMethod === "straight-line") {
      const annualDepreciation = ((calcAssetCost - calcSalvageValue) / calcUsefulLife).toFixed(2);
      for (let i = 1; i <= calcUsefulLife; i++) {
        const yearDepreciation = (
          i === 1 ? annualDepreciation * calcPartialYear : annualDepreciation
        ).toFixed(2);
        accumulatedDepreciation += parseFloat(yearDepreciation);
        bookValue = Math.max(calcAssetCost - accumulatedDepreciation, calcSalvageValue).toFixed(2);
        schedule.push({
          year: i,
          depreciation: yearDepreciation,
          accumulated: accumulatedDepreciation.toFixed(2),
          bookValue,
        });
      }
    } else if (calcMethod === "double-declining") {
      const rate = 2 / calcUsefulLife;
      bookValue = calcAssetCost;
      for (let i = 1; i <= calcUsefulLife; i++) {
        const yearDepreciation = ((i === 1 ? calcPartialYear : 1) * Math.max(bookValue * rate, 0)).toFixed(2);
        accumulatedDepreciation += parseFloat(yearDepreciation);
        bookValue = Math.max(calcAssetCost - accumulatedDepreciation, calcSalvageValue).toFixed(2);
        schedule.push({
          year: i,
          depreciation: yearDepreciation,
          accumulated: accumulatedDepreciation.toFixed(2),
          bookValue,
        });
        if (bookValue <= calcSalvageValue) break;
      }
    } else if (calcMethod === "sum-of-years") {
      const sumYears = (calcUsefulLife * (calcUsefulLife + 1)) / 2;
      bookValue = calcAssetCost;
      for (let i = 1; i <= calcUsefulLife; i++) {
        const remainingLife = calcUsefulLife - i + 1;
        const yearDepreciation = (
          (i === 1 ? calcPartialYear : 1) *
          (remainingLife / sumYears) *
          (calcAssetCost - calcSalvageValue)
        ).toFixed(2);
        accumulatedDepreciation += parseFloat(yearDepreciation);
        bookValue = Math.max(calcAssetCost - accumulatedDepreciation, calcSalvageValue).toFixed(2);
        schedule.push({
          year: i,
          depreciation: yearDepreciation,
          accumulated: accumulatedDepreciation.toFixed(2),
          bookValue,
        });
      }
    } else if (calcMethod === "units-of-production") {
      const perUnitDepreciation = ((calcAssetCost - calcSalvageValue) / totalUnitsValue).toFixed(4);
      bookValue = calcAssetCost;
      for (let i = 1; i <= calcUsefulLife; i++) {
        const yearDepreciation = (
          (i === 1 ? calcPartialYear : 1) *
          (calcAnnualUnits[i - 1] * perUnitDepreciation)
        ).toFixed(2);
        accumulatedDepreciation += parseFloat(yearDepreciation);
        bookValue = Math.max(calcAssetCost - accumulatedDepreciation, calcSalvageValue).toFixed(2);
        schedule.push({
          year: i,
          depreciation: yearDepreciation,
          accumulated: accumulatedDepreciation.toFixed(2),
          bookValue,
        });
        if (bookValue <= calcSalvageValue) break;
      }
    }
    return schedule;
  };

  const calculateDepreciation = () => {
    setError("");
    const parsedAssetCost = parseFloat(assetCost);
    const parsedSalvageValue = parseFloat(salvageValue);
    const parsedUsefulLife = parseInt(usefulLife);
    const parsedTaxRate = parseFloat(taxRate);
    const parsedPartialYear = parseFloat(partialYear);
    const parsedTotalUnits = parseFloat(totalUnits);

    if (
      isNaN(parsedAssetCost) ||
      isNaN(parsedSalvageValue) ||
      isNaN(parsedUsefulLife) ||
      isNaN(parsedTaxRate) ||
      isNaN(parsedPartialYear)
    ) {
      setError("Please provide valid inputs.");
      return;
    }
    if (parsedAssetCost < parsedSalvageValue) {
      setError("Asset cost must be greater than salvage value.");
      return;
    }
    if (parsedSalvageValue < 0 || parsedAssetCost <= 0) {
      setError("Asset cost and salvage value must be non-negative.");
      return;
    }
    if (parsedUsefulLife < 1 || parsedUsefulLife > 50) {
      setError("Useful life must be between 1 and 50 years.");
      return;
    }
    if (parsedTaxRate < 0 || parsedTaxRate > 100) {
      setError("Tax rate must be between 0 and 100%.");
      return;
    }
    if (parsedPartialYear < 0 || parsedPartialYear > 1) {
      setError("Partial-year factor must be between 0 and 1.");
      return;
    }
    const maxCost = 10000000 * (currency === "USD" ? 1 : currency === "PKR" ? 277.95 : 83.95);
    if (parsedAssetCost > maxCost) {
      setError(`Asset cost too high (max ${currency} ${maxCost.toFixed(2)}).`);
      return;
    }
    if (method === "units-of-production") {
      if (isNaN(parsedTotalUnits) || parsedTotalUnits <= 0) {
        setError("Please provide valid total units.");
        return;
      }
      for (let i = 0; i < annualUnits.length; i++) {
        const units = parseFloat(annualUnits[i]);
        if (isNaN(units) || units < 0) {
          setError(`Please provide valid units for Year ${i + 1}.`);
          return;
        }
      }
      if (annualUnits.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) > parsedTotalUnits) {
        setError("Total annual units exceed expected units.");
        return;
      }
    }

    const startYear = new Date(startDate).getFullYear();
    const schedule = calculateSchedule(
      method,
      parsedAssetCost,
      parsedSalvageValue,
      parsedUsefulLife,
      parsedPartialYear,
      annualUnits
    );
    const accumulatedDepreciation = schedule
      .reduce((sum, row) => sum + parseFloat(row.depreciation), 0)
      .toFixed(2);
    const taxSavings = ((accumulatedDepreciation * parsedTaxRate) / 100).toFixed(2);

    const allSchedules = {
      "straight-line": calculateSchedule(
        "straight-line",
        parsedAssetCost,
        parsedSalvageValue,
        parsedUsefulLife,
        parsedPartialYear,
        annualUnits
      ),
      "double-declining": calculateSchedule(
        "double-declining",
        parsedAssetCost,
        parsedSalvageValue,
        parsedUsefulLife,
        parsedPartialYear,
        annualUnits
      ),
      "sum-of-years": calculateSchedule(
        "sum-of-years",
        parsedAssetCost,
        parsedSalvageValue,
        parsedUsefulLife,
        parsedPartialYear,
        annualUnits
      ),
      "units-of-production": calculateSchedule(
        "units-of-production",
        parsedAssetCost,
        parsedSalvageValue,
        parsedUsefulLife,
        parsedPartialYear,
        annualUnits
      ),
    };

    const taxSavingsByMethod = {
      "Straight-Line": (
        (allSchedules["straight-line"].reduce((sum, row) => sum + parseFloat(row.depreciation), 0) *
          parsedTaxRate) /
        100
      ).toFixed(2),
      "Double Declining": (
        (allSchedules["double-declining"].reduce((sum, row) => sum + parseFloat(row.depreciation), 0) *
          parsedTaxRate) /
        100
      ).toFixed(2),
      "Sum-of-Years": (
        (allSchedules["sum-of-years"].reduce((sum, row) => sum + parseFloat(row.depreciation), 0) *
          parsedTaxRate) /
        100
      ).toFixed(2),
      "Units of Production": (
        (allSchedules["units-of-production"].reduce((sum, row) => sum + parseFloat(row.depreciation), 0) *
          parsedTaxRate) /
        100
      ).toFixed(2),
    };
    const bestMethod = Object.entries(taxSavingsByMethod).reduce((a, b) =>
      parseFloat(a[1]) > parseFloat(b[1]) ? a : b
    )[0];

    setResults({
      schedule: schedule.map((row) => ({ ...row, year: startYear + row.year - 1 })),
      accumulatedDepreciation,
      taxSavings,
      optimizer: `Best Method: ${bestMethod}. It maximizes tax savings at ${currency} ${
        taxSavingsByMethod[bestMethod]
      }. Use ${
        bestMethod === "Double Declining" || bestMethod === "Sum-of-Years"
          ? "accelerated methods for early tax benefits"
          : "straight-line for consistent deductions"
      }.`,
    });
    setComparison(allSchedules);

    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        method,
        assetCost: formatCurrency(parsedAssetCost),
        annualDepreciation: formatCurrency(schedule[0].depreciation),
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("depreciationHistory", JSON.stringify(newHistory));

    alert("Charts not implemented in this demo.");
  };

  const saveCalculation = () => {
    if (results) {
      setSuccess("Calculation saved to history!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("No valid calculation to save.");
    }
  };

  const loadHistory = () => {
    if (history.length === 0) {
      setError("No saved calculations found.");
      return;
    }
    setResults(results || {});
  };

  const exportResults = () => {
    alert("Export not implemented in this demo.");
  };

  const handleAnnualUnitsChange = (index, value) => {
    const newUnits = [...annualUnits];
    newUnits[index] = value;
    setAnnualUnits(newUnits);
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4">
      <div
        className={`bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in ${
          isDarkMode ? "dark:bg-gray-800" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Advanced Depreciation Calculator</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
          >
            Toggle Dark Mode
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Enter Asset Details</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Calculate depreciation using multiple methods with detailed schedules and insights.
        </p>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Currency",
              type: "select",
              value: currency,
              onChange: setCurrency,
              options: ["USD", "PKR", "INR"],
              tooltip: "Choose your currency for calculations.",
            },
            {
              label: "Asset Cost",
              type: "number",
              value: assetCost,
              onChange: setAssetCost,
              step: "0.01",
              min: "0",
              tooltip: "Initial purchase price of the asset.",
            },
            {
              label: "Salvage Value",
              type: "range",
              value: salvageValue,
              onChange: setSalvageValue,
              min: "0",
              max: "500000",
              step: "1000",
              tooltip: "Residual value at end of useful life.",
              display: `${currency} ${salvageValue}`,
            },
            {
              label: "Useful Life (Years)",
              type: "range",
              value: usefulLife,
              onChange: setUsefulLife,
              min: "1",
              max: "20",
              step: "1",
              tooltip: "Expected useful life of the asset.",
              display: `${usefulLife} years`,
            },
            {
              label: "Depreciation Method",
              type: "select",
              value: method,
              onChange: setMethod,
              options: ["straight-line", "double-declining", "sum-of-years", "units-of-production"],
              tooltip: "Choose a depreciation method.",
            },
            {
              label: "Tax Rate (%)",
              type: "number",
              value: taxRate,
              onChange: setTaxRate,
              step: "0.1",
              tooltip: "Tax rate for calculating tax savings.",
            },
            {
              label: "Start Date",
              type: "date",
              value: startDate,
              onChange: setStartDate,
              tooltip: "Date asset is placed in service.",
            },
            {
              label: "Partial-Year Factor (0–1)",
              type: "number",
              value: partialYear,
              onChange: setPartialYear,
              step: "0.01",
              min: "0",
              max: "1",
              tooltip: "Fraction of first year in service (e.g., 0.5 for half-year).",
            },
            {
              label: "Total Expected Units",
              type: "number",
              value: totalUnits,
              onChange: setTotalUnits,
              hidden: method !== "units-of-production",
              tooltip: "Total units the asset will produce over its life.",
            },
          ].map(
            ({ label, type, value, onChange, options, step, min, max, tooltip, hidden, display }) =>
              !hidden && (
                <div key={label} className="relative">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    {label}
                    <span className="tooltip inline-block ml-1">
                      ?
                      <span className="tooltiptext absolute hidden bg-gray-600 text-white text-xs rounded p-2 w-48 -ml-24 -mt-10 z-10 group-hover:block">
                        {tooltip}
                      </span>
                    </span>
                  </label>
                  {type === "select" ? (
                    <select
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-red-500 focus:border-red-500"
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === "straight-line"
                            ? "Straight-Line"
                            : opt === "double-declining"
                            ? "Double Declining Balance"
                            : opt === "sum-of-years"
                            ? "Sum-of-Years’ Digits"
                            : opt === "units-of-production"
                            ? "Units of Production"
                            : opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      step={step}
                      min={min}
                      max={max}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                  {display && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{display}</div>}
                </div>
              )
          )}
        </div>
        {method === "units-of-production" && (
          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2">
              Annual Units Produced
            </h3>
            <div>
              {annualUnits.map((units, i) => (
                <div key={i} className="mb-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Year {i + 1} Units
                  </label>
                  <input
                    type="number"
                    value={units}
                    onChange={(e) => handleAnnualUnitsChange(i, e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-4 mt-4 flex-wrap">
          <button
            onClick={convertCurrency}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Convert Currency
          </button>
          <button
            onClick={calculateDepreciation}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Calculate Depreciation
          </button>
          <button
            onClick={saveCalculation}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Save Calculation
          </button>
          <button
            onClick={loadHistory}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            View History
          </button>
        </div>

        {results && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Depreciation Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-md font-medium text-red-500">Annual Depreciation</h3>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {formatCurrency(results.schedule[0].depreciation)}
                </p>
              </div>
              <div>
                <h3 className="text-md font-medium text-red-500">Accumulated Depreciation</h3>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {formatCurrency(results.accumulatedDepreciation)}
                </p>
              </div>
              <div>
                <h3 className="text-md font-medium text-red-500">Tax Savings</h3>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {formatCurrency(results.taxSavings)}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Depreciation Schedule</h3>
              <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2">Year</th>
                    <th className="p-2">Depreciation</th>
                    <th className="p-2">Accumulated</th>
                    <th className="p-2">Book Value</th>
                  </tr>
                </thead>
                <tbody>
                  {results.schedule.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="p-2">{row.year}</td>
                      <td className="p-2">{formatCurrency(row.depreciation)}</td>
                      <td className="p-2">{formatCurrency(row.accumulated)}</td>
                      <td className="p-2">{formatCurrency(row.bookValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 overflow-x-auto">
              <h3 className="text-md font-medium text-red-500">Method Comparison</h3>
              <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2">Year</th>
                    <th className="p-2">Straight-Line</th>
                    <th className="p-2">Double Declining</th>
                    <th className="p-2">Sum-of-Years</th>
                    <th className="p-2">Units of Production</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: parseInt(usefulLife) }, (_, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="p-2">{new Date(startDate).getFullYear() + i}</td>
                      <td className="p-2">
                        {formatCurrency(comparison["straight-line"][i]?.depreciation || 0)}
                      </td>
                      <td className="p-2">
                        {formatCurrency(comparison["double-declining"][i]?.depreciation || 0)}
                      </td>
                      <td className="p-2">
                        {formatCurrency(comparison["sum-of-years"][i]?.depreciation || 0)}
                      </td>
                      <td className="p-2">
                        {formatCurrency(comparison["units-of-production"][i]?.depreciation || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Method Optimizer</h3>
              <p className="text-gray-600 dark:text-gray-300">{results.optimizer}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Book Value Over Time</h3>
              <p className="text-gray-600">Chart not implemented in this demo.</p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Depreciation Comparison</h3>
              <p className="text-gray-600">Chart not implemented in this demo.</p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Asset Value Breakdown</h3>
              <p className="text-gray-600">Chart not implemented in this demo.</p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Calculation History</h3>
              <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2">Date</th>
                    <th className="p-2">Method</th>
                    <th className="p-2">Asset Cost</th>
                    <th className="p-2">Annual Depreciation</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="p-2">{h.date}</td>
                      <td className="p-2">
                        {h.method.charAt(0).toUpperCase() + h.method.slice(1).replace("-", " ")}
                      </td>
                      <td className="p-2">{h.assetCost}</td>
                      <td className="p-2">{h.annualDepreciation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={exportResults}
              className="mt-4 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Export Results
            </button>
          </div>
        )}

        <style jsx>{`
          .animate-slide-in {
            animation: slideIn 0.5s ease-out;
          }
          @keyframes slideIn {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .tooltip:hover .tooltiptext {
            display: block;
          }
          @media (max-width: 640px) {
            .flex-wrap {
              flex-direction: column;
            }
            button {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
