"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [calculatorType, setCalculatorType] = useState("us-cpi");
  const [amount, setAmount] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [projectionData, setProjectionData] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const cpiData = {
    1913: 9.9,
    1920: 20.0,
    1930: 16.7,
    1940: 14.0,
    1950: 24.1,
    1960: 29.6,
    1970: 38.8,
    1980: 82.4,
    1990: 130.7,
    2000: 172.2,
    2010: 218.1,
    2020: 258.8,
    2021: 270.9,
    2022: 292.7,
    2023: 304.7,
    2024: 316.0,
    2025: 325.5,
  };

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[curr]}${parseFloat(amount || 0).toFixed(2)}`;
  };

  const interpolateCPI = (year) => {
    const years = Object.keys(cpiData)
      .map(Number)
      .sort((a, b) => a - b);
    if (year <= years[0]) return cpiData[years[0]];
    if (year >= years[years.length - 1]) {
      const lastYear = years[years.length - 1];
      const secondLastYear = years[years.length - 2];
      const inflationRate = cpiData[lastYear] / cpiData[secondLastYear] - 1;
      return cpiData[lastYear] * Math.pow(1 + inflationRate, year - lastYear);
    }
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const cpi1 = cpiData[years[i]];
        const cpi2 = cpiData[years[i + 1]];
        return cpi1 + ((cpi2 - cpi1) * (year - years[i])) / (years[i + 1] - years[i]);
      }
    }
  };

  const calculateAvgInflationRate = (startYear, endYear) => {
    const years = Object.keys(cpiData)
      .map(Number)
      .filter((y) => y >= startYear && y <= endYear);
    let totalRate = 0;
    let count = 0;
    for (let i = 1; i < years.length; i++) {
      const cpiCurrent = cpiData[years[i]] || interpolateCPI(years[i]);
      const cpiPrevious = cpiData[years[i - 1]] || interpolateCPI(years[i - 1]);
      totalRate += (cpiCurrent / cpiPrevious - 1) * 100;
      count++;
    }
    return count > 0 ? totalRate / count : 0;
  };

  const calculateInflation = () => {
    setError("");
    const parsedAmount = parseFloat(amount);
    const parsedStartYear = parseInt(startYear);
    const parsedEndYear = parseInt(endYear);
    const parsedInflationRate = parseFloat(inflationRate) / 100 || 0;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (
      calculatorType !== "forward-flat" &&
      (isNaN(parsedStartYear) || parsedStartYear < 1913 || parsedStartYear > 2025)
    ) {
      setError("Please enter a valid start year (1913-2025)");
      return;
    }
    if (
      isNaN(parsedEndYear) ||
      parsedEndYear < 1913 ||
      (calculatorType === "us-cpi" && parsedEndYear > 2025)
    ) {
      setError("Please enter a valid end year (1913-2025 for U.S. CPI)");
      return;
    }
    if (parsedStartYear >= parsedEndYear && calculatorType !== "forward-flat") {
      setError("End year must be greater than start year");
      return;
    }
    if (
      (calculatorType === "forward-flat" || calculatorType === "backward-flat") &&
      (isNaN(parsedInflationRate) || parsedInflationRate < 0)
    ) {
      setError("Please enter a valid inflation rate");
      return;
    }

    let adjustedAmount, avgInflationRate, years, nominalValues, realValues;
    const newProjectionData = [];

    if (calculatorType === "us-cpi") {
      const cpiStart = cpiData[parsedStartYear] || interpolateCPI(parsedStartYear);
      const cpiEnd = cpiData[parsedEndYear] || interpolateCPI(parsedEndYear);
      adjustedAmount = parsedAmount * (cpiEnd / cpiStart);
      years = Array.from({ length: parsedEndYear - parsedStartYear + 1 }, (_, i) => parsedStartYear + i);
      nominalValues = years.map(() => parsedAmount);
      realValues = years.map((year) => parsedAmount * (cpiStart / (cpiData[year] || interpolateCPI(year))));
      avgInflationRate = calculateAvgInflationRate(parsedStartYear, parsedEndYear);
      for (let year = parsedStartYear; year <= parsedEndYear; year++) {
        const cpi = cpiData[year] || interpolateCPI(year);
        const yearAmount = parsedAmount * (cpi / cpiStart);
        const purchasingPower = parsedAmount * (cpiStart / cpi);
        const yearInflation =
          year > parsedStartYear
            ? ((cpiData[year] || interpolateCPI(year)) / (cpiData[year - 1] || interpolateCPI(year - 1)) -
                1) *
              100
            : 0;
        newProjectionData.push({ year, amount: yearAmount, inflationRate: yearInflation, purchasingPower });
      }
    } else if (calculatorType === "forward-flat") {
      const currentYear = 2025;
      years = Array.from({ length: parsedEndYear - currentYear + 1 }, (_, i) => currentYear + i);
      adjustedAmount = parsedAmount * Math.pow(1 + parsedInflationRate, parsedEndYear - currentYear);
      nominalValues = years.map(() => parsedAmount);
      realValues = years.map((_, i) => parsedAmount / Math.pow(1 + parsedInflationRate, i));
      avgInflationRate = parsedInflationRate * 100;
      for (let year = currentYear; year <= parsedEndYear; year++) {
        const yearAmount = parsedAmount * Math.pow(1 + parsedInflationRate, year - currentYear);
        const purchasingPower = parsedAmount / Math.pow(1 + parsedInflationRate, year - currentYear);
        newProjectionData.push({
          year,
          amount: yearAmount,
          inflationRate: avgInflationRate,
          purchasingPower,
        });
      }
    } else {
      years = Array.from({ length: parsedEndYear - parsedStartYear + 1 }, (_, i) => parsedStartYear + i);
      adjustedAmount = parsedAmount / Math.pow(1 + parsedInflationRate, parsedEndYear - parsedStartYear);
      nominalValues = years.map(() => parsedAmount);
      realValues = years.map(
        (_, i) => parsedAmount * Math.pow(1 + parsedInflationRate, parsedEndYear - parsedStartYear - i)
      );
      avgInflationRate = parsedInflationRate * 100;
      for (let year = parsedStartYear; year <= parsedEndYear; year++) {
        const yearAmount = parsedAmount / Math.pow(1 + parsedInflationRate, parsedEndYear - year);
        const purchasingPower = parsedAmount * Math.pow(1 + parsedInflationRate, parsedEndYear - year);
        newProjectionData.push({
          year,
          amount: yearAmount,
          inflationRate: avgInflationRate,
          purchasingPower,
        });
      }
    }

    const valueChange = adjustedAmount - parsedAmount;
    const purchasingPower =
      calculatorType === "forward-flat"
        ? parsedAmount / Math.pow(1 + avgInflationRate / 100, years.length - 1)
        : parsedAmount * (adjustedAmount / parsedAmount);

    setResults({
      initialAmount: formatCurrency(parsedAmount),
      adjustedAmount: formatCurrency(adjustedAmount),
      valueChange:
        valueChange >= 0
          ? `Increase: ${formatCurrency(valueChange)}`
          : `Decrease: ${formatCurrency(Math.abs(valueChange))}`,
      avgInflationRate: `${avgInflationRate.toFixed(2)}%`,
      purchasingPower: formatCurrency(purchasingPower),
    });
    setProjectionData(newProjectionData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      calculatorType,
      amount: formatCurrency(parsedAmount),
      startYear: calculatorType === "forward-flat" ? "N/A" : parsedStartYear,
      endYear: parsedEndYear,
      inflationRate: calculatorType === "us-cpi" ? "N/A" : `${(parsedInflationRate * 100).toFixed(2)}%`,
      adjustedAmount: formatCurrency(adjustedAmount),
      valueChange:
        valueChange >= 0
          ? `Increase: ${formatCurrency(valueChange)}`
          : `Decrease: ${formatCurrency(Math.abs(valueChange))}`,
      avgInflationRate: `${avgInflationRate.toFixed(2)}%`,
      purchasingPower: formatCurrency(purchasingPower),
    };
    setHistory((prev) => [...prev, calculation]);

    alert("Charts (Value Over Time and Inflation Trend) not implemented in this demo.");
  };

  const compareScenarios = () => {
    const parsedAmount = parseFloat(amount);
    const parsedStartYear = parseInt(startYear);
    const parsedEndYear = parseInt(endYear);
    const parsedInflationRate = parseFloat(inflationRate) / 100 || 0;

    if (
      isNaN(parsedAmount) ||
      isNaN(parsedEndYear) ||
      (calculatorType !== "forward-flat" && isNaN(parsedStartYear))
    ) {
      setError("Please calculate inflation first");
      return;
    }

    const scenarios = [
      { label: "Base Case", rate: parsedInflationRate },
      { label: "Higher Rate (+0.5%)", rate: parsedInflationRate + 0.005 },
      { label: "Lower Rate (-0.5%)", rate: Math.max(parsedInflationRate - 0.005, 0) },
    ];

    const comparisonData = scenarios.map((scenario) => {
      let adjustedAmount, avgInflationRate;
      if (calculatorType === "us-cpi") {
        const cpiStart = cpiData[parsedStartYear] || interpolateCPI(parsedStartYear);
        const cpiEnd = cpiData[parsedEndYear] || interpolateCPI(parsedEndYear);
        adjustedAmount = parsedAmount * (cpiEnd / cpiStart);
        avgInflationRate = calculateAvgInflationRate(parsedStartYear, parsedEndYear);
      } else if (calculatorType === "forward-flat") {
        adjustedAmount = parsedAmount * Math.pow(1 + scenario.rate, parsedEndYear - 2025);
        avgInflationRate = scenario.rate * 100;
      } else {
        adjustedAmount = parsedAmount / Math.pow(1 + scenario.rate, parsedEndYear - parsedStartYear);
        avgInflationRate = scenario.rate * 100;
      }
      const valueChange = adjustedAmount - parsedAmount;
      return { label: scenario.label, adjustedAmount, valueChange, avgInflationRate };
    });

    setResults((prev) => ({ ...prev, comparisonData }));
  };

  const exportProjections = () => {
    if (projectionData.length === 0) {
      setError("No projection data to export");
      return;
    }

    const csvContent = [
      "Year,Amount,Inflation Rate (%),Purchasing Power",
      ...projectionData.map(
        (item) =>
          `${item.year},${item.amount.toFixed(2)},${item.inflationRate.toFixed(
            2
          )},${item.purchasingPower.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inflation_projections.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        🌙 Toggle Theme
      </button>
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full flex gap-6 transition-transform hover:-translate-y-1">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Advanced Inflation Calculator</h1>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-700 mb-2">Calculator Type</label>
            <select
              value={calculatorType}
              onChange={(e) => setCalculatorType(e.target.value)}
              className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="us-cpi">U.S. CPI Data</option>
              <option value="forward-flat">Forward Flat Rate</option>
              <option value="backward-flat">Backward Flat Rate</option>
            </select>

            <label className="block text-sm font-bold text-gray-700 mt-4 mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              step="100"
              className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg focus:ring-red-500 focus:border-red-500"
            />

            {calculatorType !== "forward-flat" && (
              <>
                <label className="block text-sm font-bold text-gray-700 mt-4 mb-2">Start Year</label>
                <input
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  placeholder="Enter start year"
                  step="1"
                  className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </>
            )}

            <label className="block text-sm font-bold text-gray-700 mt-4 mb-2">End Year</label>
            <input
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              placeholder="Enter end year"
              step="1"
              className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg focus:ring-red-500 focus:border-red-500"
            />

            {calculatorType !== "us-cpi" && (
              <>
                <label className="block text-sm font-bold text-gray-700 mt-4 mb-2">
                  Annual Inflation Rate (%)
                </label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="Enter inflation rate"
                  step="0.01"
                  className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </>
            )}

            <label className="block text-sm font-bold text-gray-700 mt-4 mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="USD">$ USD</option>
              <option value="CAD">$ CAD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>

          <button
            onClick={calculateInflation}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:scale-105 transition-transform"
          >
            Calculate Inflation
          </button>

          {results && (
            <div className="bg-gray-200 p-5 rounded-lg mt-5">
              <p className="text-gray-700 my-2">
                <strong>Initial Amount:</strong> {results.initialAmount}
              </p>
              <p className="text-gray-700 my-2">
                <strong>Adjusted Amount:</strong> {results.adjustedAmount}
              </p>
              <p className="text-gray-700 my-2">
                <strong>Change in Value:</strong> {results.valueChange}
              </p>
              <p className="text-gray-700 my-2">
                <strong>Average Annual Inflation Rate:</strong> {results.avgInflationRate}
              </p>
              <p className="text-gray-700 my-2">
                <strong>Purchasing Power Change:</strong> {results.purchasingPower}
              </p>
            </div>
          )}

          <div className="mt-5">
            <p className="text-gray-600 text-center">Chart (Value Over Time) not implemented in this demo.</p>
          </div>
        </div>

        <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Projections & History</h1>

          {projectionData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden mt-5">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3 text-right">Year</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Inflation Rate</th>
                  <th className="p-3 text-right">Purchasing Power</th>
                </tr>
              </thead>
              <tbody>
                {projectionData.map((item, i) => (
                  <tr key={item.year} className={i % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="p-3 text-right text-gray-700">{item.year}</td>
                    <td className="p-3 text-right text-gray-700">{formatCurrency(item.amount)}</td>
                    <td className="p-3 text-right text-gray-700">{item.inflationRate.toFixed(2)}%</td>
                    <td className="p-3 text-right text-gray-700">{formatCurrency(item.purchasingPower)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {history.length > 0 && (
            <div className="mt-5">
              {history.map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-lg mb-3 shadow-sm">
                  <p className="text-gray-700">
                    <strong>Date:</strong> {item.timestamp}
                  </p>
                  <p className="text-gray-700">
                    <strong>Calculator Type:</strong> {item.calculatorType}
                  </p>
                  <p className="text-gray-700">
                    <strong>Initial Amount:</strong> {item.amount}
                  </p>
                  <p className="text-gray-700">
                    <strong>Start Year:</strong> {item.startYear}
                  </p>
                  <p className="text-gray-700">
                    <strong>End Year:</strong> {item.endYear}
                  </p>
                  <p className="text-gray-700">
                    <strong>Inflation Rate:</strong> {item.inflationRate}
                  </p>
                  <p className="text-gray-700">
                    <strong>Adjusted Amount:</strong> {item.adjustedAmount}
                  </p>
                  <p className="text-gray-700">
                    <strong>Change in Value:</strong> {item.valueChange}
                  </p>
                  <p className="text-gray-700">
                    <strong>Average Inflation Rate:</strong> {item.avgInflationRate}
                  </p>
                  <p className="text-gray-700">
                    <strong>Purchasing Power:</strong> {item.purchasingPower}
                  </p>
                </div>
              ))}
            </div>
          )}

          {results?.comparisonData && (
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden mt-5">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3 text-right">Scenario</th>
                  <th className="p-3 text-right">Adjusted Amount</th>
                  <th className="p-3 text-right">Change in Value</th>
                  <th className="p-3 text-right">Avg. Inflation</th>
                </tr>
              </thead>
              <tbody>
                {results.comparisonData.map((item, i) => (
                  <tr key={item.label} className={i % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="p-3 text-right text-gray-700">{item.label}</td>
                    <td className="p-3 text-right text-gray-700">{formatCurrency(item.adjustedAmount)}</td>
                    <td className="p-3 text-right text-gray-700">
                      {item.valueChange >= 0
                        ? formatCurrency(item.valueChange)
                        : `-${formatCurrency(Math.abs(item.valueChange))}`}
                    </td>
                    <td className="p-3 text-right text-gray-700">{item.avgInflationRate.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-5">
            <p className="text-gray-600 text-center">Chart (Inflation Trend) not implemented in this demo.</p>
          </div>

          <button
            onClick={exportProjections}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:scale-105 transition-transform mt-5"
          >
            Export Projections (CSV)
          </button>
          <button
            onClick={compareScenarios}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:scale-105 transition-transform mt-3"
          >
            Compare Scenarios
          </button>
        </div>
      </div>

      <style jsx>{`
        .transition-transform:hover {
          transform: translateY(-5px);
        }
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
          }
          .max-w-5xl {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
