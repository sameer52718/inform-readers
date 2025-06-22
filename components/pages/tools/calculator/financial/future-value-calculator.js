"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [formData, setFormData] = useState({
    currency: "USD",
    initialInvestment: "10000",
    periods: "10",
    interestRate: "5",
    compounding: "annually",
    contributionType: "none",
    contributionAmount: "100",
    inflationRate: "2",
    investmentType: "savings",
    taxRate: "15",
    volatility: "10",
    growthRate: "2",
    targetFv: "20000",
    targetYear: "10",
  });
  const [scenarios, setScenarios] = useState([
    { id: 1, investment: "10000", contribution: "100", rate: "5" },
  ]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [theme, setTheme] = useState("light");
  const [history, setHistory] = useState([]);
  const fvPieChartRef = useRef(null);
  const growthLineChartRef = useRef(null);
  const contributionsAreaChartRef = useRef(null);
  const taxDonutChartRef = useRef(null);
  const metricsBarChartRef = useRef(null);
  let fvPieChart, growthLineChart, contributionsAreaChart, taxDonutChart, metricsBarChart;

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("futureValueHistory")) || [];
    setHistory(savedHistory);

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    if (fvPieChartRef.current) {
      fvPieChart = new Chart(fvPieChartRef.current, {
        type: "pie",
        data: { labels: [], datasets: [{ data: [], backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"] }] },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Future Value Breakdown" } },
        },
      });
    }
    if (growthLineChartRef.current) {
      growthLineChart = new Chart(growthLineChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Nominal Future Value",
              data: [],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              yAxisID: "y",
            },
            {
              label: "Real Future Value",
              data: [],
              borderColor: "#ef4444",
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              yAxisID: "y",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Year" } },
            y: { title: { display: true, text: "Amount" } },
          },
          plugins: { title: { display: true, text: "Future Value Growth" } },
        },
      });
    }
    if (contributionsAreaChartRef.current) {
      contributionsAreaChart = new Chart(contributionsAreaChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Contributions",
              data: [],
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.4)",
              fill: true,
              yAxisID: "y",
            },
            {
              label: "Interest Earned",
              data: [],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.4)",
              fill: true,
              yAxisID: "y",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Year" } },
            y: { title: { display: true, text: "Amount" } },
          },
          plugins: { title: { display: true, text: "Contributions vs. Interest" } },
        },
      });
    }
    if (taxDonutChartRef.current) {
      taxDonutChart = new Chart(taxDonutChartRef.current, {
        type: "doughnut",
        data: { labels: [], datasets: [{ data: [], backgroundColor: ["#3b82f6", "#f59e0b"] }] },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Tax Impact" } },
        },
      });
    }
    if (metricsBarChartRef.current) {
      metricsBarChart = new Chart(metricsBarChartRef.current, {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            { label: "Future Value", data: [], backgroundColor: "#3b82f6" },
            { label: "Interest Earned", data: [], backgroundColor: "#10b981" },
          ],
        },
        options: {
          responsive: true,
          scales: { y: { title: { display: true, text: "Amount" } } },
          plugins: { title: { display: true, text: "Scenario Metrics Comparison" } },
        },
      });
    }
    return () => {
      fvPieChart?.destroy();
      growthLineChart?.destroy();
      contributionsAreaChart?.destroy();
      taxDonutChart?.destroy();
      metricsBarChart?.destroy();
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const updateFormData = (field, value) => {
    let newFormData = { ...formData, [field]: value };
    if (field === "contributionType") {
      newFormData.contributionAmount = value === "none" ? "0" : "100";
    }
    if (field === "investmentType") {
      if (value === "savings") {
        newFormData.interestRate = "2";
        newFormData.volatility = "5";
      } else if (value === "fixed-deposit") {
        newFormData.interestRate = "4";
        newFormData.volatility = "3";
      } else if (value === "stocks") {
        newFormData.interestRate = "7";
        newFormData.volatility = "20";
      } else if (value === "bonds") {
        newFormData.interestRate = "3.5";
        newFormData.volatility = "8";
      }
    }
    setFormData(newFormData);
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setError("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([
      ...scenarios,
      { id: scenarios.length + 1, investment: "10000", contribution: "100", rate: "5" },
    ]);
  };

  const updateScenario = (id, field, value) => {
    setScenarios(scenarios.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const convertCurrency = () => {
    setError("");
    const rates = { USD: 1, PKR: 277.95, INR: 83.95 };
    const currentCurrency = formData.currency;
    const newCurrency = currentCurrency === "USD" ? "PKR" : currentCurrency === "PKR" ? "INR" : "USD";
    const fields = ["initialInvestment", "contributionAmount", "targetFv"];
    const newFormData = { ...formData, currency: newCurrency };
    fields.forEach((field) => {
      const value = parseFloat(formData[field]);
      if (!isNaN(value)) {
        newFormData[field] = ((value * rates[newCurrency]) / rates[currentCurrency]).toFixed(2);
      }
    });
    setFormData(newFormData);
    const newScenarios = scenarios.map((s) => ({
      ...s,
      investment: ((parseFloat(s.investment) * rates[newCurrency]) / rates[currentCurrency]).toFixed(2),
      contribution: ((parseFloat(s.contribution) * rates[newCurrency]) / rates[currentCurrency]).toFixed(2),
    }));
    setScenarios(newScenarios);
  };

  const calculateFutureValue = (pv, pmt, r, n, t, compounding, contributionType, growthRate) => {
    const periodsPerYear = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
    const nPerYear = periodsPerYear[compounding];
    const ratePerPeriod = r / 100 / nPerYear;
    const totalPeriods = t * nPerYear;

    let adjustedPmt = pmt;
    let fvContributions = 0;
    const contributionPeriods = { monthly: 12, quarterly: 4, annually: 1, none: 0 }[contributionType];
    if (contributionPeriods > 0) {
      for (let i = 0; i < t * contributionPeriods; i++) {
        const periodPmt = adjustedPmt * Math.pow(1 + growthRate / 100, Math.floor(i / contributionPeriods));
        const periodsToCompound = t * nPerYear - (i * nPerYear) / contributionPeriods;
        fvContributions += periodPmt * Math.pow(1 + ratePerPeriod, periodsToCompound);
      }
    }

    const fvInitial = pv * Math.pow(1 + ratePerPeriod, totalPeriods);
    return (fvInitial + fvContributions).toFixed(2);
  };

  const validateInputs = () => {
    const {
      initialInvestment,
      periods,
      interestRate,
      contributionAmount,
      inflationRate,
      taxRate,
      volatility,
      growthRate,
      targetFv,
      targetYear,
    } = formData;
    if (Object.values(formData).some((v) => v === "" || isNaN(parseFloat(v))))
      return "Please provide valid inputs.";
    if (
      parseFloat(initialInvestment) < 0 ||
      parseFloat(periods) < 1 ||
      parseFloat(periods) > 50 ||
      parseFloat(interestRate) < 0 ||
      parseFloat(contributionAmount) < 0 ||
      parseFloat(inflationRate) < 0 ||
      parseFloat(taxRate) < 0 ||
      parseFloat(taxRate) > 100 ||
      parseFloat(volatility) < 0 ||
      parseFloat(volatility) > 100 ||
      parseFloat(growthRate) < 0 ||
      parseFloat(targetFv) < 0 ||
      parseFloat(targetYear) < 1
    )
      return "Invalid input values (e.g., negative or out-of-range).";
    return null;
  };

  const calculate = () => {
    setError("");
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const parsedData = Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, parseFloat(v)]));
    const {
      currency,
      initialInvestment,
      periods,
      interestRate,
      compounding,
      contributionType,
      contributionAmount,
      inflationRate,
      investmentType,
      taxRate,
      volatility,
      growthRate,
      targetFv,
      targetYear,
    } = formData;

    // Future Value
    const fv = calculateFutureValue(
      parsedData.initialInvestment,
      parsedData.contributionAmount,
      parsedData.interestRate,
      compounding,
      parsedData.periods,
      compounding,
      contributionType,
      parsedData.growthRate
    );
    const realFv = (fv / Math.pow(1 + parsedData.inflationRate / 100, parsedData.periods)).toFixed(2);
    const periodsPerYear = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
    const contributionPeriods = { monthly: 12, quarterly: 4, annually: 1, none: 0 }[contributionType];
    let totalContributions = 0;
    if (contributionPeriods > 0) {
      for (let i = 0; i < parsedData.periods * contributionPeriods; i++) {
        totalContributions +=
          parsedData.contributionAmount *
          Math.pow(1 + parsedData.growthRate / 100, Math.floor(i / contributionPeriods));
      }
    }
    totalContributions = totalContributions.toFixed(2);
    const interestEarned = (fv - parsedData.initialInvestment - totalContributions).toFixed(2);
    const postTaxFv = (fv - (interestEarned * parsedData.taxRate) / 100).toFixed(2);
    const annualizedReturn = (
      (Math.pow(fv / parsedData.initialInvestment, 1 / parsedData.periods) - 1) *
      100
    ).toFixed(2);

    // Goal Planner
    let goalPlanner = "";
    if (parsedData.targetFv > 0) {
      const requiredRate =
        Math.pow(parsedData.targetFv / parsedData.initialInvestment, 1 / parsedData.periods) - 1;
      const requiredContribution =
        contributionPeriods > 0
          ? parsedData.targetFv /
            ((((Math.pow(
              1 + parsedData.interestRate / 100 / periodsPerYear[compounding],
              parsedData.periods * periodsPerYear[compounding]
            ) -
              1) /
              (parsedData.interestRate / 100 / periodsPerYear[compounding])) *
              (1 + parsedData.interestRate / 100 / periodsPerYear[compounding])) /
              contributionPeriods)
          : 0;
      goalPlanner =
        parsedData.targetFv > fv
          ? `To reach ${currency} ${parsedData.targetFv} in ${
              parsedData.periods
            } years, increase interest rate to ${(requiredRate * 100).toFixed(
              2
            )}% or monthly contribution to ${currency} ${(requiredContribution / 12).toFixed(2)}.`
          : `Target of ${currency} ${parsedData.targetFv} is achievable in ${parsedData.periods} years with current plan.`;
    }

    // Risk Analysis
    const riskAnalysis =
      parsedData.volatility > 15 || investmentType === "stocks"
        ? `High risk: ${investmentType} with ${parsedData.volatility}% volatility. Consider safer options like bonds.`
        : `Low risk: Stable ${investmentType} with ${parsedData.volatility}% volatility.`;

    // Sensitivity Analysis
    const sensitivity = [];
    for (
      let rate = Math.max(0, parsedData.interestRate - 1);
      rate <= parsedData.interestRate + 1;
      rate += 1
    ) {
      const sFv = calculateFutureValue(
        parsedData.initialInvestment,
        parsedData.contributionAmount,
        rate,
        compounding,
        parsedData.periods,
        compounding,
        contributionType,
        parsedData.growthRate
      );
      sensitivity.push({ rate: rate.toFixed(1), fv: sFv });
    }

    // Scenario Analysis
    const scenarioResults = scenarios
      .map((s, i) => {
        const sInvestment = parseFloat(s.investment);
        const sContribution = parseFloat(s.contribution);
        const sRate = parseFloat(s.rate);
        if (isNaN(sInvestment) || isNaN(sContribution) || isNaN(sRate)) return null;
        const sFv = calculateFutureValue(
          sInvestment,
          sContribution,
          sRate,
          compounding,
          parsedData.periods,
          compounding,
          contributionType,
          parsedData.growthRate
        );
        let sTotalContributions = 0;
        if (contributionPeriods > 0) {
          for (let i = 0; i < parsedData.periods * contributionPeriods; i++) {
            sTotalContributions +=
              sContribution * Math.pow(1 + parsedData.growthRate / 100, Math.floor(i / contributionPeriods));
          }
        }
        const sInterestEarned = (sFv - sInvestment - sTotalContributions).toFixed(2);
        const sAnnualizedReturn = ((Math.pow(sFv / sInvestment, 1 / parsedData.periods) - 1) * 100).toFixed(
          2
        );
        return {
          name: `Scenario ${i + 1}`,
          fv: sFv,
          interestEarned: sInterestEarned,
          annualizedReturn: sAnnualizedReturn,
        };
      })
      .filter((s) => s);

    const newResults = {
      futureValue: `${currency} ${fv}`,
      realFutureValue: `${currency} ${realFv}`,
      totalContributions: `${currency} ${totalContributions}`,
      interestEarned: `${currency} ${interestEarned}`,
      postTaxFv: `${currency} ${postTaxFv}`,
      annualizedReturn: `${annualizedReturn}%`,
      scenarios: scenarioResults,
      goalPlanner,
      riskAnalysis,
      sensitivity,
    };
    setResults(newResults);

    // Update Charts
    fvPieChart.data.labels = ["Initial Investment", "Contributions", "Interest Earned"];
    fvPieChart.data.datasets[0].data = [
      parsedData.initialInvestment,
      parsedData.contributionAmount > 0 ? parseFloat(totalContributions) : 0,
      parseFloat(interestEarned),
    ];
    fvPieChart.options.scales = { y: { title: { display: true, text: `Amount (${currency})` } } };
    fvPieChart.update();

    const years = Array.from({ length: parsedData.periods + 1 }, (_, i) => i);
    const fvValues = years.map((t) =>
      calculateFutureValue(
        parsedData.initialInvestment,
        parsedData.contributionAmount,
        parsedData.interestRate,
        compounding,
        t,
        compounding,
        contributionType,
        parsedData.growthRate
      )
    );
    const realFvValues = fvValues.map((fv) =>
      (fv / Math.pow(1 + parsedData.inflationRate / 100, years[fvValues.indexOf(fv)])).toFixed(2)
    );
    growthLineChart.data.labels = years;
    growthLineChart.data.datasets[0].data = fvValues;
    growthLineChart.data.datasets[1].data = realFvValues;
    growthLineChart.options.scales.y.title.text = `Amount (${currency})`;
    growthLineChart.update();

    const contributions = years.map((t) => {
      let total = 0;
      if (contributionPeriods > 0) {
        for (let i = 0; i < t * contributionPeriods; i++) {
          total +=
            parsedData.contributionAmount *
            Math.pow(1 + parsedData.growthRate / 100, Math.floor(i / contributionPeriods));
        }
      }
      return total.toFixed(2);
    });
    const interest = fvValues.map((fv, i) =>
      (fv - parsedData.initialInvestment - contributions[i]).toFixed(2)
    );
    contributionsAreaChart.data.labels = years;
    contributionsAreaChart.data.datasets[0].data = contributions;
    contributionsAreaChart.data.datasets[1].data = interest;
    contributionsAreaChart.options.scales.y.title.text = `Amount (${currency})`;
    contributionsAreaChart.update();

    taxDonutChart.data.labels = ["Pre-Tax FV", "Tax on Interest"];
    taxDonutChart.data.datasets[0].data = [parseFloat(postTaxFv), parseFloat(fv) - parseFloat(postTaxFv)];
    taxDonutChart.update();

    metricsBarChart.data.labels = scenarioResults.map((s) => s.name);
    metricsBarChart.data.datasets[0].data = scenarioResults.map((s) => s.fv);
    metricsBarChart.data.datasets[1].data = scenarioResults.map((s) => s.interestEarned);
    metricsBarChart.options.scales.y.title.text = `Amount (${currency})`;
    metricsBarChart.update();

    const newHistory = [
      ...history,
      { date: new Date().toLocaleString(), keyMetric: "Future Value", value: `${currency} ${fv}` },
    ];
    setHistory(newHistory);
    localStorage.setItem("futureValueHistory", JSON.stringify(newHistory));
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
    a.download = "future_value_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Future Value Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    history.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text("Note: Visual charts (Pie, Line, Area, Donut, Bar) are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("future_value_results.pdf");
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Advanced Future Value Calculator</h1>
            <button
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
            >
              Toggle Dark Mode
            </button>
          </div>
          <div
            className={`mb-4 ${error ? "text-red-500" : "text-green-500"} text-sm ${
              error || success ? "" : "hidden"
            }`}
          >
            {error || success}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Investment Details</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter details to calculate the future value of your investment or savings.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Currency",
                field: "currency",
                type: "select",
                options: ["USD", "PKR", "INR"],
                tooltip: "Choose your currency.",
              },
              {
                label: "Initial Investment",
                field: "initialInvestment",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Initial amount invested.",
              },
              {
                label: "Investment Period (Years)",
                field: "periods",
                type: "number",
                step: "1",
                min: "1",
                max: "50",
                tooltip: "Duration of investment (1-50 years).",
              },
              {
                label: "Interest Rate (%)",
                field: "interestRate",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Annual interest rate.",
              },
              {
                label: "Compounding Frequency",
                field: "compounding",
                type: "select",
                options: ["annually", "semi-annually", "quarterly", "monthly"],
                tooltip: "How often interest is compounded.",
              },
              {
                label: "Contribution Type",
                field: "contributionType",
                type: "select",
                options: ["none", "monthly", "quarterly", "annually"],
                tooltip: "Frequency of additional contributions.",
              },
              {
                label: "Contribution Amount",
                field: "contributionAmount",
                type: "number",
                step: "0.01",
                min: "0",
                disabled: formData.contributionType === "none",
                tooltip: "Amount contributed per period.",
              },
              {
                label: "Inflation Rate (%)",
                field: "inflationRate",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Annual inflation rate for real value.",
              },
              {
                label: "Investment Type",
                field: "investmentType",
                type: "select",
                options: ["savings", "fixed-deposit", "stocks", "bonds"],
                tooltip: "Type of investment for risk assessment.",
              },
              {
                label: "Tax Rate (%)",
                field: "taxRate",
                type: "number",
                step: "0.01",
                min: "0",
                max: "100",
                tooltip: "Tax rate on interest earned.",
              },
              {
                label: "Volatility (%)",
                field: "volatility",
                type: "number",
                step: "0.1",
                min: "0",
                max: "100",
                tooltip: "Investment risk volatility.",
              },
              {
                label: "Contribution Growth Rate (%)",
                field: "growthRate",
                type: "number",
                step: "0.1",
                min: "0",
                tooltip: "Annual growth in contributions.",
              },
            ].map((item) => (
              <div key={item.label} className="tooltip">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {item.label} <span>?</span>
                </label>
                {item.type === "select" ? (
                  <select
                    value={formData[item.field]}
                    onChange={(e) => updateFormData(item.field, e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  >
                    {item.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={item.type}
                    value={formData[item.field]}
                    onChange={(e) => updateFormData(item.field, e.target.value)}
                    step={item.step}
                    min={item.min}
                    max={item.max}
                    disabled={item.disabled}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  />
                )}
                <span className="tooltiptext">{item.tooltip}</span>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Goal Planning</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Target Future Value",
                field: "targetFv",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Desired future value (optional).",
              },
              {
                label: "Target Year",
                field: "targetYear",
                type: "number",
                step: "1",
                min: "1",
                tooltip: "Year to achieve target (optional).",
              },
            ].map((item) => (
              <div key={item.label} className="tooltip">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {item.label} <span>?</span>
                </label>
                <input
                  type={item.type}
                  value={formData[item.field]}
                  onChange={(e) => updateFormData(item.field, e.target.value)}
                  step={item.step}
                  min={item.min}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                />
                <span className="tooltiptext">{item.tooltip}</span>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Scenario Analysis</h2>
          {scenarios.map((s) => (
            <div key={s.id} className="border p-4 rounded-lg mb-4">
              <h3 className="text-md font-medium text-gray-900 mb-2">Scenario {s.id}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Initial Investment", field: "investment", value: s.investment },
                  { label: "Contribution Amount", field: "contribution", value: s.contribution },
                  { label: "Interest Rate (%)", field: "rate", value: s.rate },
                ].map((item) => (
                  <div key={item.label}>
                    <label className="block text-sm font-medium text-gray-600 mb-2">{item.label}</label>
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => updateScenario(s.id, item.field, e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    />
                  </div>
                ))}
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
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Save Calculation
            </button>
          </div>
          {results && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Future Value & Investment Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Future Value", value: results.futureValue },
                  { label: "Real Future Value", value: results.realFutureValue },
                  { label: "Total Contributions", value: results.totalContributions },
                  { label: "Interest Earned", value: results.interestEarned },
                  { label: "Post-Tax Future Value", value: results.postTaxFv },
                  { label: "Annualized Return", value: results.annualizedReturn },
                ].map((item) => (
                  <div key={item.label}>
                    <h3 className="text-md font-medium text-gray-900">{item.label}</h3>
                    <p className="text-xl font-bold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2">Scenario</th>
                        <th className="p-2">Future Value</th>
                        <th className="p-2">Interest Earned</th>
                        <th className="p-2">Annualized Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.scenarios.map((s) => (
                        <tr key={s.name}>
                          <td className="p-2">{s.name}</td>
                          <td className="p-2">
                            {formData.currency} {s.fv}
                          </td>
                          <td className="p-2">
                            {formData.currency} {s.interestEarned}
                          </td>
                          <td className="p-2">{s.annualizedReturn}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Goal Planner</h3>
                <p className="text-gray-600">{results.goalPlanner}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Risk Analysis</h3>
                <p className="text-gray-600">{results.riskAnalysis}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Sensitivity Analysis</h3>
                <p className="text-gray-600">{`Future value ranges from ${formData.currency} ${
                  results.sensitivity[0].fv
                } at ${results.sensitivity[0].rate}% interest rate to ${formData.currency} ${
                  results.sensitivity[results.sensitivity.length - 1].fv
                } at ${results.sensitivity[results.sensitivity.length - 1].rate}% interest rate.`}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Future Value Breakdown</h3>
                <canvas ref={fvPieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Future Value Growth</h3>
                <canvas ref={growthLineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Contributions vs. Interest</h3>
                <canvas ref={contributionsAreaChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Tax Impact</h3>
                <canvas ref={taxDonutChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Metrics Comparison</h3>
                <canvas ref={metricsBarChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-50">
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
        body {
          transition: background-color 0.3s, color 0.3s;
        }
        .tooltip {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        .tooltip .tooltiptext {
          visibility: hidden;
          width: 200px;
          background-color: #555;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          margin-left: -100px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .tooltip:hover .tooltiptext {
          visibility: visible;
          opacity: 1;
        }
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
        @media (max-width: 640px) {
          button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
