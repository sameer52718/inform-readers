"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      name: "Investment 1",
      initialInvestment: 10000,
      finalInvestment: 15000,
      timePeriod: 5,
      returns: [],
      weights: [],
      inflationRate: 2,
      riskFreeRate: 2,
      benchmarkReturn: 10,
      currency: "USD",
    },
  ]);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [showSections, setShowSections] = useState({ returnTable: false, charts: false });
  const cumulativeChartRef = useRef(null);
  const comparisonChartRef = useRef(null);
  const cumulativeChartInstance = useRef(null);
  const comparisonChartInstance = useRef(null);

  const exchangeRates = { USD: 1, EUR: 0.95, GBP: 0.8 };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("returnData"));
    if (savedData) {
      setScenarios(savedData.scenarios);
    }
  }, []);

  useEffect(() => {
    if (results && cumulativeChartRef.current && comparisonChartRef.current) {
      if (cumulativeChartInstance.current) cumulativeChartInstance.current.destroy();
      if (comparisonChartInstance.current) comparisonChartInstance.current.destroy();

      const chartData = results.table.reduce((acc, row) => {
        if (!acc[row.period - 1]) acc[row.period - 1] = { period: row.period, cumulative: 0 };
        acc[row.period - 1].cumulative += parseFloat(row.cumulative);
        return acc;
      }, []);

      cumulativeChartInstance.current = new Chart(cumulativeChartRef.current, {
        type: "line",
        data: {
          labels: Array.from({ length: Math.max(...results.table.map((r) => r.period)) }, (_, i) => i + 1),
          datasets: [
            {
              label: "Cumulative Return",
              data: chartData.map((d) => (d ? d.cumulative : 0)),
              borderColor: "#ef4444",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Period" } },
            y: { title: { display: true, text: "Cumulative Return (%)" } },
          },
        },
      });

      comparisonChartInstance.current = new Chart(comparisonChartRef.current, {
        type: "bar",
        data: {
          labels: ["Arithmetic", "Geometric", "Annualized", "Weighted", "Benchmark"],
          datasets: [
            {
              label: "Returns (%)",
              data: [
                results.summary["Arithmetic Mean (%)"],
                results.summary["Geometric Mean (%)"],
                results.summary["Annualized Return (%)"],
                results.summary["Weighted Return (%)"],
                results.summary["Benchmark Return (%)"],
              ],
              backgroundColor: ["#ef4444", "#10b981", "#e11d48", "#f59e0b", "#6b7280"],
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { title: { display: true, text: "Return (%)" } },
          },
        },
      });
    }
  }, [results]);

  const handleInputChange = (index, field, value) => {
    const newScenarios = [...scenarios];
    if (field === "returns" || field === "weights") {
      newScenarios[index][field] = value
        .split(",")
        .map((v) => parseFloat(v.trim()))
        .filter((v) => !isNaN(v));
    } else {
      newScenarios[index][field] =
        field === "name" || field === "currency" ? value : parseFloat(value) || value;
    }
    setScenarios(newScenarios);
  };

  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const returns = parseCSV(text);
        if (returns.length > 0) {
          const newScenarios = [...scenarios];
          newScenarios[index].returns = returns.map((r) => r.return);
          setScenarios(newScenarios);
        } else {
          setError("Invalid CSV format. Expected: Period,Return");
        }
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (text) => {
    const lines = text.trim().split("\n").slice(1);
    return lines
      .map((line) => {
        const [period, returnVal] = line.split(",").map((s) => s.trim());
        return { period: parseInt(period), return: parseFloat(returnVal) };
      })
      .filter((r) => !isNaN(r.return));
  };

  const addScenarioForm = () => {
    setScenarios([
      ...scenarios,
      {
        id: scenarios.length + 1,
        name: `Investment ${scenarios.length + 1}`,
        initialInvestment: 10000,
        finalInvestment: 15000,
        timePeriod: 5,
        returns: [],
        weights: [],
        inflationRate: 2,
        riskFreeRate: 2,
        benchmarkReturn: 10,
        currency: "USD",
      },
    ]);
  };

  const removeScenarioForm = (index) => {
    setScenarios(scenarios.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setScenarios([
      {
        id: 1,
        name: "Investment 1",
        initialInvestment: 10000,
        finalInvestment: 15000,
        timePeriod: 5,
        returns: [],
        weights: [],
        inflationRate: 2,
        riskFreeRate: 2,
        benchmarkReturn: 10,
        currency: "USD",
      },
    ]);
    setResults(null);
    setError("");
    localStorage.removeItem("returnData");
  };

  const validateInputs = () => {
    const errors = [];
    if (scenarios.length === 0) errors.push("Add at least one scenario.");
    scenarios.forEach((scenario, index) => {
      if (!scenario.name.trim()) errors.push(`Scenario ${index + 1}: Investment name is required.`);
      if (scenario.initialInvestment < 0 || isNaN(scenario.initialInvestment))
        errors.push(`Scenario ${index + 1}: Invalid initial investment.`);
      if (scenario.finalInvestment < 0 || isNaN(scenario.finalInvestment))
        errors.push(`Scenario ${index + 1}: Invalid final investment.`);
      if (scenario.timePeriod <= 0 || isNaN(scenario.timePeriod))
        errors.push(`Scenario ${index + 1}: Invalid time period.`);
      if (scenario.returns.some((r) => isNaN(r)))
        errors.push(`Scenario ${index + 1}: Invalid periodic returns.`);
      if (scenario.weights.length > 0) {
        const sumWeights = scenario.weights.reduce((sum, w) => sum + w, 0);
        if (Math.abs(sumWeights - 100) > 0.01)
          errors.push(`Scenario ${index + 1}: Weights must sum to 100%.`);
      }
      if (scenario.inflationRate < 0 || scenario.inflationRate > 10 || isNaN(scenario.inflationRate))
        errors.push(`Scenario ${index + 1}: Invalid inflation rate.`);
      if (scenario.riskFreeRate < 0 || scenario.riskFreeRate > 10 || isNaN(scenario.riskFreeRate))
        errors.push(`Scenario ${index + 1}: Invalid risk-free rate.`);
      if (scenario.benchmarkReturn < 0 || scenario.benchmarkReturn > 20 || isNaN(scenario.benchmarkReturn))
        errors.push(`Scenario ${index + 1}: Invalid benchmark return.`);
    });
    return errors;
  };

  const calculateArithmeticMean = (returns) => {
    return returns.length > 0 ? returns.reduce((sum, r) => sum + r, 0) / returns.length : 0;
  };

  const calculateGeometricMean = (returns) => {
    if (returns.length === 0) return 0;
    const product = returns.reduce((prod, r) => prod * (1 + r / 100), 1);
    return (Math.pow(product, 1 / returns.length) - 1) * 100;
  };

  const calculateAnnualizedReturn = (initial, final, years) => {
    return (Math.pow(final / initial, 1 / years) - 1) * 100;
  };

  const calculateWeightedReturn = (returns, weights) => {
    if (returns.length !== weights.length || returns.length === 0) return 0;
    return returns.reduce((sum, r, i) => sum + r * (weights[i] / 100), 0);
  };

  const calculateStandardDeviation = (returns) => {
    if (returns.length === 0) return 0;
    const mean = calculateArithmeticMean(returns);
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  };

  const calculateSharpeRatio = (returns, riskFreeRate) => {
    const meanReturn = calculateArithmeticMean(returns);
    const stdDev = calculateStandardDeviation(returns);
    return stdDev > 0 ? (meanReturn - riskFreeRate) / stdDev : 0;
  };

  const adjustForInflation = (returnRate, inflationRate) => {
    return ((1 + returnRate / 100) / (1 + inflationRate / 100) - 1) * 100;
  };

  const generateReturnSchedule = (scenario) => {
    const schedule = [];
    let cumulative = 100;
    scenario.returns.forEach((returnVal, index) => {
      cumulative *= 1 + returnVal / 100;
      schedule.push({
        scenarioId: scenario.id,
        period: index + 1,
        return: returnVal.toFixed(2),
        cumulative: (cumulative - 100).toFixed(2),
      });
    });
    return schedule;
  };

  const calculateReturns = () => {
    try {
      const errors = validateInputs();
      if (errors.length > 0) {
        setError(errors.join("<br>"));
        setResults(null);
        return;
      }
      setError("");

      localStorage.setItem("returnData", JSON.stringify({ scenarios }));

      const reportData = {};
      const schedules = [];
      scenarios.forEach((scenario) => {
        const arithmeticMean = calculateArithmeticMean(scenario.returns);
        const geometricMean = calculateGeometricMean(scenario.returns);
        const annualizedReturn = calculateAnnualizedReturn(
          scenario.initialInvestment,
          scenario.finalInvestment,
          scenario.timePeriod
        );
        const weightedReturn = calculateWeightedReturn(scenario.returns, scenario.weights);
        const stdDev = calculateStandardDeviation(scenario.returns);
        const sharpeRatio = calculateSharpeRatio(scenario.returns, scenario.riskFreeRate);
        const realArithmetic = adjustForInflation(arithmeticMean, scenario.inflationRate);
        const realGeometric = adjustForInflation(geometricMean, scenario.inflationRate);
        const realAnnualized = adjustForInflation(annualizedReturn, scenario.inflationRate);
        const schedule = generateReturnSchedule(scenario);

        schedules.push(schedule);

        reportData[scenario.id] = {
          arithmeticMean: arithmeticMean.toFixed(2),
          geometricMean: geometricMean.toFixed(2),
          annualizedReturn: annualizedReturn.toFixed(2),
          weightedReturn: weightedReturn.toFixed(2),
          realArithmetic: realArithmetic.toFixed(2),
          realGeometric: realGeometric.toFixed(2),
          realAnnualized: realAnnualized.toFixed(2),
          stdDev: stdDev.toFixed(2),
          sharpeRatio: sharpeRatio.toFixed(2),
          benchmarkReturn: scenario.benchmarkReturn.toFixed(2),
        };
      });

      reportData.summary = scenarios.reduce((acc, scenario) => {
        acc.arithmeticMean =
          (acc.arithmeticMean || 0) + reportData[scenario.id].arithmeticMean / scenarios.length;
        acc.geometricMean =
          (acc.geometricMean || 0) + reportData[scenario.id].geometricMean / scenarios.length;
        acc.annualizedReturn =
          (acc.annualizedReturn || 0) + reportData[scenario.id].annualizedReturn / scenarios.length;
        acc.weightedReturn =
          (acc.weightedReturn || 0) + reportData[scenario.id].weightedReturn / scenarios.length;
        acc.realArithmetic =
          (acc.realArithmetic || 0) + reportData[scenario.id].realArithmetic / scenarios.length;
        acc.realGeometric =
          (acc.realGeometric || 0) + reportData[scenario.id].realGeometric / scenarios.length;
        acc.realAnnualized =
          (acc.realAnnualized || 0) + reportData[scenario.id].realAnnualized / scenarios.length;
        acc.stdDev = (acc.stdDev || 0) + reportData[scenario.id].stdDev / scenarios.length;
        acc.sharpeRatio = (acc.sharpeRatio || 0) + reportData[scenario.id].sharpeRatio / scenarios.length;
        return acc;
      }, {});

      reportData.summary = {
        "Arithmetic Mean (%)": reportData.summary.arithmeticMean.toFixed(2),
        "Geometric Mean (%)": reportData.summary.geometricMean.toFixed(2),
        "Annualized Return (%)": reportData.summary.annualizedReturn.toFixed(2),
        "Weighted Return (%)": reportData.summary.weightedReturn.toFixed(2),
        "Real Arithmetic (%)": reportData.summary.realArithmetic.toFixed(2),
        "Real Geometric (%)": reportData.summary.realGeometric.toFixed(2),
        "Real Annualized (%)": reportData.summary.realAnnualized.toFixed(2),
        "Standard Deviation (%)": reportData.summary.stdDev.toFixed(2),
        "Sharpe Ratio": reportData.summary.sharpeRatio.toFixed(2),
        "Benchmark Return (%)": scenarios[0].benchmarkReturn.toFixed(2),
      };
      reportData.table = schedules.flat();

      setResults(reportData);
    } catch (e) {
      setError("An error occurred during calculation: " + e.message);
      setResults(null);
    }
  };

  const downloadReport = () => {
    if (!results) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Average Return Calculator Report", 20, 20);
    doc.setFontSize(12);
    let y = 30;
    Object.entries(results.summary).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 20, y);
      y += 10;
    });
    doc.addPage();
    doc.setFontSize(12);
    doc.text("Periodic Return Details", 20, 20);
    y = 30;
    results.table.forEach((row) => {
      doc.text(
        `Scenario ${row.scenarioId}, Period ${row.period}: Return ${row.return}%, Cumulative ${row.cumulative}%`,
        20,
        y
      );
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save("average_return_report.pdf");
  };

  const downloadCSV = () => {
    if (!results?.table) return;
    const headers = ["Scenario", "Period", "Return (%)", "Cumulative Return (%)"];
    const csv = [
      headers.join(","),
      ...results.table.map((row) => `${row.scenarioId},${row.period},${row.return},${row.cumulative}`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "average_return_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white  p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Advanced Average Return Calculator</h1>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Return Details</h2>
            {scenarios.map((scenario, index) => (
              <div key={scenario.id} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Scenario {scenario.id}</h3>
                  {scenarios.length > 1 && (
                    <button
                      onClick={() => removeScenarioForm(index)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Remove scenario"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Investment Name",
                      field: "name",
                      type: "text",
                      tooltip: "Name of investment or portfolio",
                    },
                    {
                      label: "Initial Investment",
                      field: "initialInvestment",
                      type: "number",
                      min: 0,
                      step: 100,
                      tooltip: "Initial investment amount",
                    },
                    {
                      label: "Final Investment",
                      field: "finalInvestment",
                      type: "number",
                      min: 0,
                      step: 100,
                      tooltip: "Final investment value",
                    },
                    {
                      label: "Time Period (Years)",
                      field: "timePeriod",
                      type: "number",
                      min: 0.1,
                      step: 0.1,
                      tooltip: "Investment duration in years",
                    },
                    {
                      label: "Periodic Returns (%)",
                      field: "returns",
                      type: "textarea",
                      placeholder: "Enter returns (e.g., 5.2, -2.1, 7.8)",
                      tooltip: "Comma-separated periodic returns in %",
                    },
                    {
                      label: "Weights (%)",
                      field: "weights",
                      type: "textarea",
                      placeholder: "Enter weights for portfolio (e.g., 50, 30, 20)",
                      tooltip: "Comma-separated weights summing to 100%",
                    },
                    {
                      label: "Inflation Rate (%)",
                      field: "inflationRate",
                      type: "number",
                      min: 0,
                      max: 10,
                      step: 0.01,
                      tooltip: "Annual inflation rate",
                      slider: { min: 0, max: 10, step: 0.1 },
                    },
                    {
                      label: "Risk-Free Rate (%)",
                      field: "riskFreeRate",
                      type: "number",
                      min: 0,
                      max: 10,
                      step: 0.01,
                      tooltip: "Risk-free rate for Sharpe ratio",
                    },
                    {
                      label: "Benchmark Return (%)",
                      field: "benchmarkReturn",
                      type: "number",
                      min: 0,
                      max: 20,
                      step: 0.01,
                      tooltip: "Benchmark annual return (e.g., S&P 500)",
                    },
                    {
                      label: "Currency",
                      field: "currency",
                      type: "select",
                      options: ["USD", "EUR", "GBP"],
                      tooltip: "Select currency for display",
                    },
                    {
                      label: "Upload Returns (CSV)",
                      field: "csv",
                      type: "file",
                      accept: ".csv",
                      tooltip: "Upload CSV with Period,Return columns",
                    },
                  ].map(({ label, field, type, min, max, step, tooltip, placeholder, options, accept }) => (
                    <div key={field} className="relative">
                      <label className="block text-sm font-medium text-gray-600">{label}</label>
                      {type === "select" ? (
                        <select
                          value={scenario[field]}
                          onChange={(e) => handleInputChange(index, field, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                          aria-label={label}
                        >
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt === "USD" ? "USD ($)" : opt === "EUR" ? "EUR (€)" : "GBP (£)"}
                            </option>
                          ))}
                        </select>
                      ) : type === "textarea" ? (
                        <textarea
                          value={scenario[field].join(", ")}
                          onChange={(e) => handleInputChange(index, field, e.target.value)}
                          placeholder={placeholder}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                          aria-label={label}
                        />
                      ) : type === "file" ? (
                        <input
                          type="file"
                          accept={accept}
                          onChange={(e) => handleFileUpload(index, e)}
                          className="mt-1 block w-full text-gray-600"
                          aria-label={label}
                        />
                      ) : (
                        <input
                          type={type}
                          value={scenario[field]}
                          min={min}
                          max={max}
                          step={step}
                          onChange={(e) => handleInputChange(index, field, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                          aria-label={label}
                        />
                      )}
                      <input
                        type="range"
                        value={scenario[field]}
                        onChange={(e) => handleInputChange(index, field, e.target.value)}
                        className="mt-2 w-full"
                        aria-label={`Adjust ${label.toLowerCase()}`}
                      />
                      <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8 z-10">
                        {tooltip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex space-x-4 mt-4">
              <button
                onClick={addScenarioForm}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                aria-label="Add another scenario"
              >
                Add Another Scenario
              </button>
              <button
                onClick={resetForm}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                aria-label="Reset form"
              >
                Reset Form
              </button>
            </div>
            <button
              onClick={calculateReturns}
              className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              aria-label="Calculate returns"
            >
              Calculate
            </button>
          </div>
          {results && (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
              {error && <div className="text-red-600 mb-4" dangerouslySetInnerHTML={{ __html: error }} />}
              <div className="mb-4">
                {Object.entries(results.summary).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setShowSections({ ...showSections, returnTable: !showSections.returnTable })}
                className="w-full text-left bg-gray-200 p-2 rounded-md mb-2"
                aria-label="Toggle return table"
              >
                Periodic Return Table
              </button>
              {showSections.returnTable && (
                <div className="mb-4 overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs uppercase bg-red-500 text-white">
                      <tr>
                        {["Scenario", "Period", "Return (%)", "Cumulative Return (%)"].map((header) => (
                          <th key={header} className="px-4 py-2">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.table.map((row, index) => (
                        <tr key={index} className="even:bg-gray-50">
                          <td className="px-4 py-2">{row.scenarioId}</td>
                          <td className="px-4 py-2">{row.period}</td>
                          <td className="px-4 py-2">{row.return}</td>
                          <td className="px-4 py-2">{row.cumulative}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button
                onClick={() => setShowSections({ ...showSections, charts: !showSections.charts })}
                className="w-full text-left bg-gray-200 p-2 rounded-md mb-2"
                aria-label="Toggle charts"
              >
                Return Charts
              </button>
              {showSections.charts && (
                <div className="mb-4">
                  <canvas ref={cumulativeChartRef} className="w-full mb-4"></canvas>
                  <canvas ref={comparisonChartRef} className="w-full"></canvas>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={downloadReport}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  aria-label="Download PDF report"
                >
                  Download PDF Report
                </button>
                <button
                  onClick={downloadCSV}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  aria-label="Download CSV"
                >
                  Download CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #ef4444;
          cursor: pointer;
          border-radius: 50%;
        }
        .relative:hover .tooltip {
          display: block;
        }
      `}</style>
    </>
  );
}
