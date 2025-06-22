"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [formData, setFormData] = useState({
    investmentType: "real-estate",
    currency: "USD",
    initialInvestment: "100000",
    finalValue: "150000",
    additionalCosts: "5000",
    holdingPeriod: "5",
    annualCashFlow: "3000",
    discountRate: "5",
    taxRate: "20",
    volatility: "10",
  });
  const [scenarios, setScenarios] = useState([
    { finalValue: "150000", cashFlow: "3000", holdingPeriod: "5" },
  ]);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const costPieChartRef = useRef(null);
  const cashflowLineChartRef = useRef(null);
  const roiBarChartRef = useRef(null);
  const npvAreaChartRef = useRef(null);
  const cashflowDonutChartRef = useRef(null);
  let costPieChart, cashflowLineChart, roiBarChart, npvAreaChart, cashflowDonutChart;

  useEffect(() => {
    if (costPieChartRef.current) {
      costPieChart = new Chart(costPieChartRef.current, {
        type: "pie",
        data: { labels: [], datasets: [] },
        options: { responsive: true },
      });
    }
    if (cashflowLineChartRef.current) {
      cashflowLineChart = new Chart(cashflowLineChartRef.current, {
        type: "line",
        data: { labels: [], datasets: [] },
        options: { responsive: true },
      });
    }
    if (roiBarChartRef.current) {
      roiBarChart = new Chart(roiBarChartRef.current, {
        type: "bar",
        data: { labels: [], datasets: [] },
        options: { responsive: true },
      });
    }
    if (npvAreaChartRef.current) {
      npvAreaChart = new Chart(npvAreaChartRef.current, {
        type: "line",
        data: { labels: [], datasets: [] },
        options: { responsive: true },
      });
    }
    if (cashflowDonutChartRef.current) {
      cashflowDonutChart = new Chart(cashflowDonutChartRef.current, {
        type: "doughnut",
        data: { labels: [], datasets: [] },
        options: { responsive: true },
      });
    }
    return () => {
      costPieChart?.destroy();
      cashflowLineChart?.destroy();
      roiBarChart?.destroy();
      npvAreaChart?.destroy();
      cashflowDonutChart?.destroy();
    };
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", PKR: "₨", INR: "₹" };
    return `${symbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  const convertCurrency = () => {
    setError("");
    const rates = { USD: 1, PKR: 277.95, INR: 83.95 };
    const currentCurrency = formData.currency;
    const newCurrency = currentCurrency === "USD" ? "PKR" : currentCurrency === "PKR" ? "INR" : "USD";
    const conversionFactor = rates[newCurrency] / rates[currentCurrency];

    setFormData((prev) => ({
      ...prev,
      currency: newCurrency,
      initialInvestment: (parseFloat(prev.initialInvestment) * conversionFactor).toFixed(2),
      finalValue: (parseFloat(prev.finalValue) * conversionFactor).toFixed(2),
      additionalCosts: (parseFloat(prev.additionalCosts) * conversionFactor).toFixed(2),
      annualCashFlow: (parseFloat(prev.annualCashFlow) * conversionFactor).toFixed(2),
    }));

    setScenarios(
      scenarios.map((scenario) => ({
        ...scenario,
        finalValue: (parseFloat(scenario.finalValue) * conversionFactor).toFixed(2),
        cashFlow: (parseFloat(scenario.cashFlow) * conversionFactor).toFixed(2),
      }))
    );
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setError("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([...scenarios, { finalValue: "150000", cashFlow: "3000", holdingPeriod: "5" }]);
  };

  const updateScenario = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = { ...newScenarios[index], [field]: value };
    setScenarios(newScenarios);
  };

  const calculateIRR = (cashFlows) => {
    const guess = 0.1;
    const maxIterations = 1000;
    const tolerance = 0.0001;
    let irr = guess;

    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let derivative = 0;
      for (let t = 0; t < cashFlows.length; t++) {
        npv += cashFlows[t] / Math.pow(1 + irr, t);
        derivative -= (t * cashFlows[t]) / Math.pow(1 + irr, t + 1);
      }
      if (Math.abs(npv) < tolerance) return irr * 100;
      irr -= npv / derivative;
    }
    return NaN;
  };

  const monteCarloSimulation = (roi, volatility, iterations = 1000) => {
    const returns = [];
    for (let i = 0; i < iterations; i++) {
      const randomFactor = 1 + ((Math.random() * 2 - 1) * volatility) / 100;
      returns.push(roi * randomFactor);
    }
    const avg = returns.reduce((sum, val) => sum + val, 0) / iterations;
    const min = Math.min(...returns);
    const max = Math.max(...returns);
    return { avg: avg.toFixed(2), min: min.toFixed(2), max: max.toFixed(2) };
  };

  const calculate = () => {
    setError("");
    const inputs = {
      initialInvestment: parseFloat(formData.initialInvestment),
      finalValue: parseFloat(formData.finalValue),
      additionalCosts: parseFloat(formData.additionalCosts),
      holdingPeriod: parseInt(formData.holdingPeriod),
      annualCashFlow: parseFloat(formData.annualCashFlow),
      discountRate: parseFloat(formData.discountRate),
      taxRate: parseFloat(formData.taxRate),
      volatility: parseFloat(formData.volatility),
      currency: formData.currency,
    };

    // Validation
    if (Object.values(inputs).some(isNaN)) {
      setError("Please provide valid inputs.");
      return;
    }
    if (inputs.initialInvestment <= 0) {
      setError("Initial investment must be positive.");
      return;
    }
    if (inputs.holdingPeriod < 1) {
      setError("Holding period must be at least 1 year.");
      return;
    }
    if (inputs.discountRate < 0 || inputs.taxRate < 0 || inputs.taxRate > 100 || inputs.volatility < 0) {
      setError("Invalid rates (negative or tax rate > 100%).");
      return;
    }

    // Calculations
    const totalCosts = inputs.initialInvestment + inputs.additionalCosts;
    const grossReturn = inputs.finalValue - totalCosts + inputs.annualCashFlow * inputs.holdingPeriod;
    const roi = ((grossReturn / inputs.initialInvestment) * 100).toFixed(2);
    const annualizedRoi = ((Math.pow(1 + roi / 100, 1 / inputs.holdingPeriod) - 1) * 100).toFixed(2);
    const taxOnGains = (grossReturn > 0 ? (grossReturn * inputs.taxRate) / 100 : 0).toFixed(2);
    const taxAdjustedRoi = (((grossReturn - taxOnGains) / inputs.initialInvestment) * 100).toFixed(2);

    // NPV
    let npv = -inputs.initialInvestment;
    for (let t = 1; t <= inputs.holdingPeriod; t++) {
      npv += inputs.annualCashFlow / Math.pow(1 + inputs.discountRate / 100, t);
    }
    npv += inputs.finalValue / Math.pow(1 + inputs.discountRate / 100, inputs.holdingPeriod);
    npv = npv.toFixed(2);

    // IRR
    const cashFlows = [
      -inputs.initialInvestment,
      ...Array(inputs.holdingPeriod - 1).fill(inputs.annualCashFlow),
      inputs.annualCashFlow + inputs.finalValue,
    ];
    const irr = calculateIRR(cashFlows).toFixed(2);

    // Payback Period
    let cumulativeCashFlow = -inputs.initialInvestment;
    let paybackPeriod = 0;
    for (let t = 1; t <= inputs.holdingPeriod; t++) {
      cumulativeCashFlow += inputs.annualCashFlow;
      if (cumulativeCashFlow >= 0 && paybackPeriod === 0) {
        paybackPeriod = t - 1 + (-cumulativeCashFlow + inputs.annualCashFlow) / inputs.annualCashFlow;
      }
    }
    if (cumulativeCashFlow < 0) {
      cumulativeCashFlow += inputs.finalValue;
      if (cumulativeCashFlow >= 0) {
        paybackPeriod =
          inputs.holdingPeriod -
          1 +
          (-cumulativeCashFlow + inputs.finalValue + inputs.annualCashFlow) /
            (inputs.finalValue + inputs.annualCashFlow);
      }
    }
    paybackPeriod = paybackPeriod > 0 ? paybackPeriod.toFixed(2) : "N/A";

    // Break-Even
    const breakEvenYears =
      roi > 0
        ? (
            totalCosts /
            (inputs.annualCashFlow + (inputs.finalValue - totalCosts) / inputs.holdingPeriod)
          ).toFixed(2)
        : "N/A";

    // Monte Carlo
    const monteCarlo = monteCarloSimulation(parseFloat(roi), inputs.volatility);

    // Optimizer and Risk Analysis
    const optimizer =
      roi < 10
        ? `To achieve ROI > 10%, consider increasing final value to ${formatCurrency(
            inputs.finalValue * 1.1,
            inputs.currency
          )} or annual cash flow by ${formatCurrency(inputs.annualCashFlow * 1.2, inputs.currency)}.`
        : `Strong investment with ${roi}% ROI; maintain current strategy.`;
    const riskAnalysis =
      inputs.volatility > 20 ? "High risk (volatility > 20%)" : "Low risk (volatility ≤ 20%)";

    // Sensitivity Analysis
    const sensitivity = [];
    for (let fv = inputs.finalValue * 0.9; fv <= inputs.finalValue * 1.1; fv += inputs.finalValue * 0.1) {
      const sRoi = (
        ((fv - totalCosts + inputs.annualCashFlow * inputs.holdingPeriod) / inputs.initialInvestment) *
        100
      ).toFixed(2);
      sensitivity.push({ finalValue: fv.toFixed(2), roi: sRoi });
    }

    // Scenario Analysis
    const scenarioResults = scenarios
      .map((scenario, index) => {
        const sFinalValue = parseFloat(scenario.finalValue);
        const sCashFlow = parseFloat(scenario.cashFlow);
        const sHoldingPeriod = parseInt(scenario.holdingPeriod);
        if (isNaN(sFinalValue) || isNaN(sCashFlow) || isNaN(sHoldingPeriod) || sHoldingPeriod < 1) {
          return null;
        }
        const sGrossReturn = sFinalValue - totalCosts + sCashFlow * sHoldingPeriod;
        const sRoi = ((sGrossReturn / inputs.initialInvestment) * 100).toFixed(2);
        const sAnnualizedRoi = ((Math.pow(1 + sRoi / 100, 1 / sHoldingPeriod) - 1) * 100).toFixed(2);
        const sTaxAdjustedRoi = (
          ((sGrossReturn - (sGrossReturn > 0 ? (sGrossReturn * inputs.taxRate) / 100 : 0)) /
            inputs.initialInvestment) *
          100
        ).toFixed(2);
        return {
          name: `Scenario ${index + 1}`,
          roi: sRoi,
          annualizedRoi: sAnnualizedRoi,
          taxAdjustedRoi: sTaxAdjustedRoi,
        };
      })
      .filter((s) => s !== null);

    setResults({
      roi: `${roi}%`,
      annualizedRoi: `${annualizedRoi}%`,
      taxAdjustedRoi: `${taxAdjustedRoi}%`,
      npv: formatCurrency(npv, inputs.currency),
      irr: isNaN(irr) ? "N/A" : `${irr}%`,
      paybackPeriod: `${paybackPeriod} years`,
      breakEvenYears,
      monteCarlo,
      optimizer,
      riskAnalysis,
      sensitivity,
      scenarios: scenarioResults,
    });

    setHistory([...history, { date: new Date().toLocaleString(), keyMetric: "ROI", value: `${roi}%` }]);

    // Update Charts
    costPieChart.data = {
      labels: ["Initial Investment", "Additional Costs", "Taxes"],
      datasets: [
        {
          data: [
            inputs.initialInvestment,
            inputs.additionalCosts,
            parseFloat(taxAdjustedRoi) < parseFloat(roi)
              ? ((parseFloat(roi) - parseFloat(taxAdjustedRoi)) * inputs.initialInvestment) / 100
              : 0,
          ],
          backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444"],
        },
      ],
    };
    costPieChart.options = {
      responsive: true,
      plugins: { legend: { position: "top" }, title: { display: true, text: "Cost Breakdown" } },
    };
    costPieChart.update();

    const years = Array.from({ length: inputs.holdingPeriod }, (_, i) => i + 1);
    const cashFlowsChart = years.map(() => inputs.annualCashFlow);
    const investmentValues = years.map(
      (i) =>
        inputs.initialInvestment + ((inputs.finalValue - inputs.initialInvestment) * i) / inputs.holdingPeriod
    );
    cashflowLineChart.data = {
      labels: years,
      datasets: [
        {
          label: `Annual Cash Flow (${inputs.currency})`,
          data: cashFlowsChart,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          yAxisID: "y",
        },
        {
          label: `Investment Value (${inputs.currency})`,
          data: investmentValues,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          yAxisID: "y1",
        },
      ],
    };
    cashflowLineChart.options = {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Year" } },
        y: { title: { display: true, text: `Cash Flow (${inputs.currency})` } },
        y1: {
          position: "right",
          title: { display: true, text: `Investment Value (${inputs.currency})` },
          grid: { drawOnChartArea: false },
        },
      },
      plugins: { title: { display: true, text: "Cash Flow & Value Over Time" } },
    };
    cashflowLineChart.update();

    roiBarChart.data = {
      labels: scenarioResults.map((s) => s.name),
      datasets: [
        { label: "ROI (%)", data: scenarioResults.map((s) => s.roi), backgroundColor: "#3b82f6" },
        {
          label: "Annualized ROI (%)",
          data: scenarioResults.map((s) => s.annualizedRoi),
          backgroundColor: "#10b981",
        },
        {
          label: "Tax-Adjusted ROI (%)",
          data: scenarioResults.map((s) => s.taxAdjustedRoi),
          backgroundColor: "#f59e0b",
        },
      ],
    };
    roiBarChart.options = {
      responsive: true,
      scales: { y: { title: { display: true, text: "Percentage (%)" } } },
      plugins: { title: { display: true, text: "ROI Metrics Comparison" } },
    };
    roiBarChart.update();

    const discountRates = [0, 2, 4, 6, 8, 10];
    const npvValues = discountRates.map((rate) => {
      let npv = -inputs.initialInvestment;
      for (let t = 1; t <= inputs.holdingPeriod; t++) {
        npv += inputs.annualCashFlow / Math.pow(1 + rate / 100, t);
      }
      npv += inputs.finalValue / Math.pow(1 + rate / 100, inputs.holdingPeriod);
      return npv;
    });
    npvAreaChart.data = {
      labels: discountRates,
      datasets: [
        {
          label: `NPV (${inputs.currency})`,
          data: npvValues,
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.4)",
          fill: true,
        },
      ],
    };
    npvAreaChart.options = {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Discount Rate (%)" } },
        y: { title: { display: true, text: `NPV (${inputs.currency})` } },
      },
      plugins: { title: { display: true, text: "NPV Sensitivity" } },
    };
    npvAreaChart.update();

    cashflowDonutChart.data = {
      labels: ["Cash Flows", "Final Value Gain"],
      datasets: [
        {
          data: [
            inputs.annualCashFlow * inputs.holdingPeriod,
            inputs.finalValue - inputs.initialInvestment - inputs.additionalCosts,
          ],
          backgroundColor: ["#10b981", "#3b82f6"],
        },
      ],
    };
    cashflowDonutChart.options = {
      responsive: true,
      plugins: { legend: { position: "top" }, title: { display: true, text: "Cash Flow Contributions" } },
    };
    cashflowDonutChart.update();
  };

  const saveCalculation = () => {
    if (!results) {
      setError("No valid calculation to save.");
      return;
    }
    setSuccess("Calculation saved to history!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Key Metric", "Value"],
      ...history.map((h) => [h.date, h.keyMetric, h.value]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roi_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced ROI Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    history.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text("Note: Visual charts (Pie, Line, Bar, Area, Donut) are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("roi_results.pdf");
  };

  const inputFields = [
    {
      id: "investmentType",
      label: "Investment Type",
      type: "select",
      options: ["real-estate", "stocks", "business", "custom"],
      tooltip: "Select the type of investment.",
    },
    {
      id: "currency",
      label: "Currency",
      type: "select",
      options: ["USD", "PKR", "INR"],
      tooltip: "Choose your currency.",
    },
    {
      id: "initialInvestment",
      label: "Initial Investment",
      type: "number",
      step: "0.01",
      min: "0",
      tooltip: "Total upfront investment amount.",
    },
    {
      id: "finalValue",
      label: "Final Value",
      type: "number",
      step: "0.01",
      min: "0",
      tooltip: "Investment value at end of period.",
    },
    {
      id: "additionalCosts",
      label: "Additional Costs",
      type: "number",
      step: "0.01",
      min: "0",
      tooltip: "Fees, maintenance, or other costs.",
    },
    {
      id: "holdingPeriod",
      label: "Holding Period (Years)",
      type: "number",
      step: "1",
      min: "1",
      tooltip: "Duration of investment.",
    },
    {
      id: "annualCashFlow",
      label: "Annual Cash Flow",
      type: "number",
      step: "0.01",
      min: "0",
      tooltip: "Yearly dividends, rent, or income.",
    },
    {
      id: "discountRate",
      label: "Discount Rate (%)",
      type: "number",
      step: "0.1",
      min: "0",
      tooltip: "Rate for NPV/IRR calculations.",
    },
    {
      id: "taxRate",
      label: "Capital Gains Tax Rate (%)",
      type: "number",
      step: "0.1",
      min: "0",
      max: "100",
      tooltip: "Tax rate on investment gains.",
    },
    {
      id: "volatility",
      label: "Return Volatility (%)",
      type: "number",
      step: "0.1",
      min: "0",
      tooltip: "Expected variability in returns.",
    },
  ];

  return (
    <>
      <div
        className={`bg-white min-h-screen flex items-center justify-center p-4 ${isDarkMode ? "dark" : ""}`}
      >
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-6xl w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-blue-100">Advanced ROI Calculator</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
            >
              Toggle Dark Mode
            </button>
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Investment Details</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Enter details to analyze your investment's return.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inputFields.map((field) => (
              <div key={field.id} className="relative">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  {field.label}
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute invisible bg-gray-500 text-white text-center rounded-lg p-2 -top-10 left-1/2 -translate-x-1/2 w-48 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    {field.tooltip}
                  </span>
                </label>
                {field.type === "select" ? (
                  <select
                    value={formData[field.id]}
                    onChange={(e) => updateFormData(field.id, e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "real-estate"
                          ? "Real Estate"
                          : opt === "stocks"
                          ? "Stocks"
                          : opt === "business"
                          ? "Business"
                          : opt === "custom"
                          ? "Custom"
                          : opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.id]}
                    onChange={(e) => updateFormData(field.id, e.target.value)}
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-4">
            Scenario Analysis
          </h2>
          {scenarios.map((scenario, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-blue-100 mb-2">
                Scenario {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Final Value
                  </label>
                  <input
                    type="number"
                    value={scenario.finalValue}
                    onChange={(e) => updateScenario(index, "finalValue", e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Annual Cash Flow
                  </label>
                  <input
                    type="number"
                    value={scenario.cashFlow}
                    onChange={(e) => updateScenario(index, "cashFlow", e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Holding Period (Years)
                  </label>
                  <input
                    type="number"
                    value={scenario.holdingPeriod}
                    onChange={(e) => updateScenario(index, "holdingPeriod", e.target.value)}
                    step="1"
                    min="1"
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addScenario}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4"
          >
            Add Scenario
          </button>
          <div className="flex gap-4 mt-6 flex-wrap">
            <button
              onClick={convertCurrency}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Convert Currency
            </button>
            <button
              onClick={calculate}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate
            </button>
            <button
              onClick={saveCalculation}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Save Calculation
            </button>
          </div>
          {results && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Investment Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  "roi",
                  "annualizedRoi",
                  "taxAdjustedRoi",
                  "npv",
                  "irr",
                  "paybackPeriod",
                  "breakEvenYears",
                  "monteCarlo",
                ].map((key) => (
                  <div key={key}>
                    <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">
                      {key === "monteCarlo"
                        ? "Monte Carlo ROI"
                        : key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </h3>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {key === "monteCarlo" ? `Avg: ${results[key].avg}%` : results[key]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">ROI</th>
                      <th className="p-2">Annualized ROI</th>
                      <th className="p-2">Tax-Adjusted ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarios.map((s) => (
                      <tr key={s.name}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.roi}%</td>
                        <td className="p-2">{s.annualizedRoi}%</td>
                        <td className="p-2">{s.taxAdjustedRoi}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Investment Optimizer</h3>
                <p className="text-gray-600 dark:text-gray-300">{results.optimizer}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Risk Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">{results.riskAnalysis}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Sensitivity Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  ROI ranges from {results.sensitivity[0].roi}% at{" "}
                  {formatCurrency(results.sensitivity[0].finalValue, formData.currency)} to{" "}
                  {results.sensitivity[results.sensitivity.length - 1].roi}% at{" "}
                  {formatCurrency(
                    results.sensitivity[results.sensitivity.length - 1].finalValue,
                    formData.currency
                  )}
                  .
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Cost Breakdown</h3>
                <canvas ref={costPieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">
                  Cash Flow & Value Over Time
                </h3>
                <canvas ref={cashflowLineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">
                  ROI Metrics Comparison
                </h3>
                <canvas ref={roiBarChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">NPV Sensitivity</h3>
                <canvas ref={npvAreaChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">
                  Cash Flow Contributions
                </h3>
                <canvas ref={cashflowDonutChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Calculation History</h3>
                <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-2">Date</th>
                      <th className="p-2">Key Metric</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.date}>
                        <td className="p-2">{h.date}</td>
                        <td className="p-2">{h.keyMetric}</td>
                        <td className="p-2">{h.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4 flex-wrap">
                <button
                  onClick={exportCSV}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
                >
                  Export CSV
                </button>
                <button
                  onClick={exportPDF}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
                >
                  Export PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .dark {
          background-color: #1f2937;
        }
        .relative:hover .absolute {
          visibility: visible;
          opacity: 1;
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
    </>
  );
}
