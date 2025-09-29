"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [formData, setFormData] = useState({
    currency: "USD",
    initialInvestment: "100000",
    cashflowType: "uniform",
    periods: "10",
    discountRate: "5",
    reinvestmentRate: "3",
    operatingCosts: "5000",
    oneTimeCosts: "2000",
    salvageValue: "10000",
    volatility: "10",
    growthRate: "2",
    annualCashflow: "20000",
  });
  const [cashflows, setCashflows] = useState([{ year: 1, value: "20000" }]);
  const [scenarios, setScenarios] = useState([{ investment: "100000", cashflow: "20000", discount: "5" }]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [history, setHistory] = useState(
    JSON.parse(typeof window !== "undefined" ? localStorage.getItem("paybackHistory") : "[]") || []
  );
  const [darkMode, setDarkMode] = useState(false);
  const investmentPieChartRef = useRef(null);
  const cashflowLineChartRef = useRef(null);
  const growthAreaChartRef = useRef(null);
  const distributionDonutChartRef = useRef(null);
  const metricsBarChartRef = useRef(null);
  let investmentPieChart, cashflowLineChart, growthAreaChart, distributionDonutChart, metricsBarChart;

  useEffect(() => {
    if (investmentPieChartRef.current) {
      investmentPieChart = new Chart(investmentPieChartRef.current, {
        type: "pie",
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Initial Investment Breakdown" },
          },
        },
      });
    }
    if (cashflowLineChartRef.current) {
      cashflowLineChart = new Chart(cashflowLineChartRef.current, {
        type: "line",
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Year" } },
            y: { title: { display: true, text: `Amount` } },
          },
          plugins: { title: { display: true, text: "Cumulative Cash Flow" } },
        },
      });
    }
    if (growthAreaChartRef.current) {
      growthAreaChart = new Chart(growthAreaChartRef.current, {
        type: "line",
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Year" } },
            y: { title: { display: true, text: `Cash Flow` } },
            y1: {
              position: "right",
              title: { display: true, text: `Reinvested` },
              grid: { drawOnChartArea: false },
            },
          },
          plugins: { title: { display: true, text: "Cash Flow Growth & Reinvestment" } },
        },
      });
    }
    if (distributionDonutChartRef.current) {
      distributionDonutChart = new Chart(distributionDonutChartRef.current, {
        type: "doughnut",
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Cash Flow Distribution" } },
        },
      });
    }
    if (metricsBarChartRef.current) {
      metricsBarChart = new Chart(metricsBarChartRef.current, {
        type: "bar",
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          scales: { y: { title: { display: true, text: "Value" } } },
          plugins: { title: { display: true, text: "Scenario Metrics Comparison" } },
        },
      });
    }
    return () => {
      investmentPieChart?.destroy();
      cashflowLineChart?.destroy();
      growthAreaChart?.destroy();
      distributionDonutChart?.destroy();
      metricsBarChart?.destroy();
    };
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addCashFlow = () => {
    const periods = parseInt(formData.periods);
    if (cashflows.length >= periods) {
      setError("Cannot add more cash flows than the number of periods.");
      return;
    }
    setCashflows([...cashflows, { year: cashflows.length + 1, value: "20000" }]);
  };

  const removeCashFlow = (index) => {
    if (cashflows.length > 1) {
      setCashflows(cashflows.filter((_, i) => i !== index));
    } else {
      setError("At least one cash flow is required.");
    }
  };

  const updateCashFlow = (index, value) => {
    const newCashflows = [...cashflows];
    newCashflows[index].value = value;
    setCashflows(newCashflows);
  };

  const updateCashFlowTable = () => {
    const periods = parseInt(formData.periods);
    setCashflows((prev) => {
      let newCashflows = [...prev];
      while (newCashflows.length > periods) {
        newCashflows.pop();
      }
      while (newCashflows.length < Math.min(periods, 1)) {
        newCashflows.push({ year: newCashflows.length + 1, value: "20000" });
      }
      return newCashflows.map((cf, i) => ({ ...cf, year: i + 1 }));
    });
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setError("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([...scenarios, { investment: "100000", cashflow: "20000", discount: "5" }]);
  };

  const updateScenario = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index][field] = value;
    setScenarios(newScenarios);
  };

  const convertCurrency = () => {
    setError("");
    const rates = { USD: 1, PKR: 277.95, INR: 83.95 };
    const newCurrency = formData.currency === "USD" ? "PKR" : formData.currency === "PKR" ? "INR" : "USD";
    const factor = rates[newCurrency] / rates[formData.currency];

    setFormData((prev) => ({
      ...prev,
      currency: newCurrency,
      initialInvestment: (parseFloat(prev.initialInvestment) * factor).toFixed(2),
      operatingCosts: (parseFloat(prev.operatingCosts) * factor).toFixed(2),
      oneTimeCosts: (parseFloat(prev.oneTimeCosts) * factor).toFixed(2),
      salvageValue: (parseFloat(prev.salvageValue) * factor).toFixed(2),
      annualCashflow: (parseFloat(prev.annualCashflow) * factor).toFixed(2),
    }));

    setCashflows(cashflows.map((cf) => ({ ...cf, value: (parseFloat(cf.value) * factor).toFixed(2) })));
    setScenarios(
      scenarios.map((s) => ({
        ...s,
        investment: (parseFloat(s.investment) * factor).toFixed(2),
        cashflow: (parseFloat(s.cashflow) * factor).toFixed(2),
      }))
    );
  };

  const calculateIRR = (cashflows) => {
    const maxIterations = 100;
    const tolerance = 0.0001;
    let low = -0.5,
      high = 0.5;
    for (let i = 0; i < maxIterations; i++) {
      const mid = (low + high) / 2;
      const npv = cashflows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + mid, t), 0);
      if (Math.abs(npv) < tolerance) return (mid * 100).toFixed(2);
      if (npv > 0) low = mid;
      else high = mid;
    }
    return (((low + high) / 2) * 100).toFixed(2);
  };

  const calculate = () => {
    setError("");
    const parsedData = {
      initialInvestment: parseFloat(formData.initialInvestment),
      periods: parseInt(formData.periods),
      discountRate: parseFloat(formData.discountRate),
      reinvestmentRate: parseFloat(formData.reinvestmentRate),
      operatingCosts: parseFloat(formData.operatingCosts),
      oneTimeCosts: parseFloat(formData.oneTimeCosts),
      salvageValue: parseFloat(formData.salvageValue),
      volatility: parseFloat(formData.volatility),
      growthRate: parseFloat(formData.growthRate),
      annualCashflow: parseFloat(formData.annualCashflow),
    };

    let calcCashflows = [];
    if (formData.cashflowType === "uniform") {
      if (isNaN(parsedData.annualCashflow)) {
        setError("Please provide a valid annual cash flow.");
        return;
      }
      calcCashflows = Array(parsedData.periods).fill(parsedData.annualCashflow);
    } else {
      calcCashflows = cashflows.map((cf) => parseFloat(cf.value));
      if (calcCashflows.some(isNaN)) {
        setError("Please provide valid cash flows for all periods.");
        return;
      }
      if (calcCashflows.length < parsedData.periods) {
        setError("Please provide cash flows for all periods.");
        return;
      }
    }

    if (Object.values(parsedData).some(isNaN)) {
      setError("Please provide valid inputs.");
      return;
    }
    if (
      parsedData.initialInvestment <= 0 ||
      parsedData.periods < 1 ||
      parsedData.periods > 30 ||
      parsedData.discountRate < 0 ||
      parsedData.reinvestmentRate < 0 ||
      parsedData.operatingCosts < 0 ||
      parsedData.oneTimeCosts < 0 ||
      parsedData.salvageValue < 0 ||
      parsedData.volatility < 0 ||
      parsedData.volatility > 100 ||
      parsedData.growthRate < 0
    ) {
      setError("Invalid input values (e.g., negative or out-of-range).");
      return;
    }

    const adjustedCashflows = calcCashflows.map(
      (cf, i) => cf * Math.pow(1 + parsedData.growthRate / 100, i) - parsedData.operatingCosts
    );
    adjustedCashflows[0] -= parsedData.oneTimeCosts;
    adjustedCashflows[parsedData.periods - 1] += parsedData.salvageValue;

    let cumulativeCashflow = -parsedData.initialInvestment;
    let paybackPeriod = 0;
    for (let i = 0; i < parsedData.periods; i++) {
      cumulativeCashflow += adjustedCashflows[i];
      if (cumulativeCashflow >= 0) {
        paybackPeriod = i + (cumulativeCashflow - adjustedCashflows[i]) / adjustedCashflows[i];
        break;
      }
    }
    paybackPeriod =
      paybackPeriod > 0 && paybackPeriod < parsedData.periods ? paybackPeriod.toFixed(2) : "N/A";

    let discountedCumulative = -parsedData.initialInvestment;
    let discountedPayback = 0;
    const discountedCashflows = adjustedCashflows.map(
      (cf, i) => cf / Math.pow(1 + parsedData.discountRate / 100, i + 1)
    );
    for (let i = 0; i < parsedData.periods; i++) {
      discountedCumulative += discountedCashflows[i];
      if (discountedCumulative >= 0) {
        discountedPayback = i + (discountedCumulative - discountedCashflows[i]) / discountedCashflows[i];
        break;
      }
    }
    discountedPayback =
      discountedPayback > 0 && discountedPayback < parsedData.periods ? discountedPayback.toFixed(2) : "N/A";

    const npv = discountedCashflows.reduce((sum, cf) => sum + cf, -parsedData.initialInvestment).toFixed(2);
    const pi = (npv / parsedData.initialInvestment + 1).toFixed(2);
    const irr = calculateIRR([-parsedData.initialInvestment, ...adjustedCashflows]);
    const futureValue = adjustedCashflows
      .reduce(
        (sum, cf, i) =>
          sum + cf * Math.pow(1 + parsedData.reinvestmentRate / 100, parsedData.periods - i - 1),
        0
      )
      .toFixed(2);

    const sensitivity = [];
    for (
      let rate = Math.max(0, parsedData.discountRate - 2);
      rate <= parsedData.discountRate + 2;
      rate += 2
    ) {
      let tempCumulative = -parsedData.initialInvestment;
      let tempPayback = 0;
      const tempCashflows = adjustedCashflows.map((cf, i) => cf / Math.pow(1 + rate / 100, i + 1));
      for (let i = 0; i < parsedData.periods; i++) {
        tempCumulative += tempCashflows[i];
        if (tempCumulative >= 0) {
          tempPayback = i + (tempCumulative - tempCashflows[i]) / tempCashflows[i];
          break;
        }
      }
      sensitivity.push({
        rate: rate.toFixed(1),
        payback: tempPayback > 0 && tempPayback < parsedData.periods ? tempPayback.toFixed(2) : "N/A",
      });
    }

    const scenarioResults = scenarios
      .map((s, index) => {
        const sInvestment = parseFloat(s.investment);
        const sCashflow = parseFloat(s.cashflow);
        const sDiscount = parseFloat(s.discount);
        if (isNaN(sInvestment) || isNaN(sCashflow) || isNaN(sDiscount)) return null;
        let sCumulative = -sInvestment;
        let sPayback = 0;
        const sCashflows = Array(parsedData.periods).fill(sCashflow - parsedData.operatingCosts);
        sCashflows[0] -= parsedData.oneTimeCosts;
        sCashflows[parsedData.periods - 1] += parsedData.salvageValue;
        for (let i = 0; i < parsedData.periods; i++) {
          sCumulative += sCashflows[i] / Math.pow(1 + sDiscount / 100, i + 1);
          if (sCumulative >= 0) {
            sPayback =
              i +
              (sCumulative - sCashflows[i] / Math.pow(1 + sDiscount / 100, i + 1)) /
                (sCashflows[i] / Math.pow(1 + sDiscount / 100, i + 1));
            break;
          }
        }
        const sNpv = sCashflows
          .reduce((sum, cf, i) => sum + cf / Math.pow(1 + sDiscount / 100, i + 1), -sInvestment)
          .toFixed(2);
        const sIrr = calculateIRR([-sInvestment, ...sCashflows]);
        return {
          name: `Scenario ${index + 1}`,
          payback: sPayback > 0 && sPayback < parsedData.periods ? sPayback.toFixed(2) : "N/A",
          npv: sNpv,
          irr: sIrr,
        };
      })
      .filter((s) => s);

    const paybackOptimizer =
      paybackPeriod !== "N/A" && paybackPeriod > 3
        ? `To reduce payback to under 3 years, increase annual cash flow by ${(
            calcCashflows[0] * 1.2
          ).toFixed(2)} or reduce initial investment by ${(parsedData.initialInvestment * 0.1).toFixed(2)}.`
        : `Payback period of ${paybackPeriod} years is optimal.`;
    const riskAnalysis =
      parsedData.volatility > 20 || (paybackPeriod !== "N/A" && paybackPeriod > 5)
        ? `High risk: Volatile cash flows (${parsedData.volatility}%) or long payback (${paybackPeriod} years).`
        : `Low risk: Stable cash flows and reasonable payback period.`;

    setResults({
      paybackPeriod: `${paybackPeriod} years`,
      discountedPayback: `${discountedPayback} years`,
      npv: `${formData.currency} ${npv}`,
      irr: `${irr}%`,
      pi,
      futureValue: `${formData.currency} ${futureValue}`,
      breakEven: `${paybackPeriod}`,
      cashflows: adjustedCashflows,
      scenarios: scenarioResults,
      paybackOptimizer,
      riskAnalysis,
      sensitivity,
    });
  };

  const saveCalculation = () => {
    if (!results) {
      setError("No valid calculation to save.");
      return;
    }
    const newHistory = [
      ...history,
      { date: new Date().toLocaleString(), keyMetric: "Payback Period", value: results.paybackPeriod },
    ];
    setHistory(newHistory);
    if (typeof window !== "undefined") {
      localStorage.setItem("paybackHistory", JSON.stringify(newHistory));
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
    a.download = "payback_period_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Payback Period Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    history.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text("Note: Visual charts (Pie, Line, Area, Donut, Bar) are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("payback_period_results.pdf");
  };

  const updateCharts = () => {
    if (!results) return;
    const { cashflows, scenarios, currency } = results;
    const periods = parseInt(formData.periods);
    const years = Array.from({ length: periods }, (_, i) => i + 1);

    investmentPieChart.data = {
      labels: ["Initial Investment", "One-Time Costs"],
      datasets: [
        {
          data: [parseFloat(formData.initialInvestment), parseFloat(formData.oneTimeCosts)],
          backgroundColor: ["#3b82f6", "#f59e0b"],
        },
      ],
    };
    investmentPieChart.update();

    let cumulative = -parseFloat(formData.initialInvestment);
    const cumulativeCashflows = [cumulative];
    const discountedCumulative = [cumulative];
    const discountRate = parseFloat(formData.discountRate) / 100;
    for (let i = 0; i < periods; i++) {
      cumulative += cashflows[i];
      cumulativeCashflows.push(cumulative);
      discountedCumulative.push(discountedCumulative[i] + cashflows[i] / Math.pow(1 + discountRate, i + 1));
    }
    cashflowLineChart.data = {
      labels: years,
      datasets: [
        {
          label: `Cumulative Cash Flow (${currency})`,
          data: cumulativeCashflows,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          yAxisID: "y",
        },
        {
          label: `Discounted Cumulative (${currency})`,
          data: discountedCumulative,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          yAxisID: "y",
        },
      ],
    };
    cashflowLineChart.update();

    const reinvestmentRate = parseFloat(formData.reinvestmentRate) / 100;
    const growthRate = parseFloat(formData.growthRate) / 100;
    const grownCashflows = cashflows.map((cf, i) => cf * Math.pow(1 + growthRate, i));
    const reinvestedValues = cashflows.reduce((acc, cf, i) => {
      acc.push((acc[i] || 0) + cf * Math.pow(1 + reinvestmentRate, periods - i - 1));
      return acc;
    }, []);
    growthAreaChart.data = {
      labels: years,
      datasets: [
        {
          label: `Grown Cash Flows (${currency})`,
          data: grownCashflows,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.4)",
          fill: true,
          yAxisID: "y",
        },
        {
          label: `Reinvested Value (${currency})`,
          data: reinvestedValues,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.4)",
          fill: true,
          yAxisID: "y1",
        },
      ],
    };
    growthAreaChart.update();

    distributionDonutChart.data = {
      labels: years.map((y) => `Year ${y}`),
      datasets: [
        {
          data: cashflows,
          backgroundColor: [
            "#3b82f6",
            "#f59e0b",
            "#10b981",
            "#ef4444",
            "#8b5cf6",
            "#ec4899",
            "#f97316",
            "#22c55e",
            "#6b7280",
            "#14b8a6",
          ],
        },
      ],
    };
    distributionDonutChart.update();

    metricsBarChart.data = {
      labels: scenarios.map((s) => s.name),
      datasets: [
        {
          label: "Payback Period (Years)",
          data: scenarios.map((s) => (s.payback === "N/A" ? 0 : s.payback)),
          backgroundColor: "#3b82f6",
        },
        { label: `NPV (${currency})`, data: scenarios.map((s) => s.npv), backgroundColor: "#10b981" },
        { label: "IRR (%)", data: scenarios.map((s) => s.irr), backgroundColor: "#f59e0b" },
      ],
    };
    metricsBarChart.update();
  };

  useEffect(() => {
    if (results) {
      updateCharts();
    }
  }, [results]);

  useEffect(() => {
    updateCashFlowTable();
  }, [formData.periods]);

  return (
    <>
      <div className={`bg-white  flex items-center justify-center p-4 ${darkMode ? "dark" : ""}`}>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-blue-100">
              Advanced Payback Period Calculator
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
            >
              Toggle Dark Mode
            </button>
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Investment Details</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Enter details to calculate the payback period and investment metrics.
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
                tooltip: "Total upfront cost of the investment.",
              },
              {
                label: "Cash Flow Type",
                field: "cashflowType",
                type: "select",
                options: ["uniform", "non-uniform"],
                tooltip: "Uniform (same each period) or Non-Uniform (varies).",
              },
              {
                label: "Number of Periods (Years)",
                field: "periods",
                type: "number",
                step: "1",
                min: "1",
                max: "30",
                tooltip: "Duration of cash flows (1-30 years).",
              },
              {
                label: "Discount Rate (%)",
                field: "discountRate",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Rate for discounting cash flows.",
              },
              {
                label: "Reinvestment Rate (%)",
                field: "reinvestmentRate",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Rate for reinvesting cash flows.",
              },
              {
                label: "Annual Operating Costs",
                field: "operatingCosts",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Yearly operational expenses.",
              },
              {
                label: "One-Time Costs",
                field: "oneTimeCosts",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Additional setup or permit costs.",
              },
              {
                label: "Salvage Value",
                field: "salvageValue",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Residual value at end of project.",
              },
              {
                label: "Cash Flow Volatility (%)",
                field: "volatility",
                type: "number",
                step: "0.1",
                min: "0",
                max: "100",
                tooltip: "Variability in cash flows for risk assessment.",
              },
              {
                label: "Cash Flow Growth Rate (%)",
                field: "growthRate",
                type: "number",
                step: "0.1",
                min: "0",
                tooltip: "Annual growth in cash flows.",
              },
            ].map((item) => (
              <div key={item.label}>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  {item.label}
                  <span className="tooltip">
                    ?<span className="tooltiptext">{item.tooltip}</span>
                  </span>
                </label>
                {item.type === "select" ? (
                  <select
                    value={formData[item.field]}
                    onChange={(e) => updateFormData(item.field, e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                  >
                    {item.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
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
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                  />
                )}
              </div>
            ))}
          </div>
          <div className={`mt-6 ${formData.cashflowType === "uniform" ? "" : "hidden"}`}>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Uniform Cash Flow</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Annual Cash Flow
                  <span className="tooltip">
                    ?<span className="tooltiptext">Annual cash inflow from investment.</span>
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.annualCashflow}
                  onChange={(e) => updateFormData("annualCashflow", e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </div>
          </div>
          <div className={`mt-6 ${formData.cashflowType === "non-uniform" ? "" : "hidden"}`}>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Non-Uniform Cash Flow
            </h2>
            <div className="cashflow-table">
              <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-2">Year</th>
                    <th className="p-2">Cash Flow</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cashflows.map((cf, index) => (
                    <tr key={index}>
                      <td className="p-2">{cf.year}</td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={cf.value}
                          onChange={(e) => updateCashFlow(index, e.target.value)}
                          step="0.01"
                          className="w-full p-1 border rounded dark:bg-gray-700 dark:text-gray-200"
                        />
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => removeCashFlow(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={addCashFlow}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4"
            >
              Add Cash Flow
            </button>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-4">
            Scenario Analysis
          </h2>
          <div>
            {scenarios.map((scenario, index) => (
              <div key={index} className="border border-gray-200 p-4 mb-4 rounded-lg">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100 mb-2">
                  Scenario {index + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Initial Investment", field: "investment", step: "0.01", min: "0" },
                    { label: "Annual Cash Flow", field: "cashflow", step: "0.01", min: "0" },
                    { label: "Discount Rate (%)", field: "discount", step: "0.1", min: "0" },
                  ].map((item) => (
                    <div key={item.label}>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        {item.label}
                      </label>
                      <input
                        type="number"
                        value={scenario[item.field]}
                        onChange={(e) => updateScenario(index, item.field, e.target.value)}
                        step={item.step}
                        min={item.min}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
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
          </div>
          <div className="flex gap-4 mb-8 flex-wrap mt-6">
            <button
              onClick={convertCurrency}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Convert Currency
            </button>
            <button
              onClick={calculate}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
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
            <div className="mt-6 animate-slide-in">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Payback Period & Investment Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Payback Period", value: results.paybackPeriod },
                  { label: "Discounted Payback", value: results.discountedPayback },
                  { label: "NPV", value: results.npv },
                  { label: "IRR", value: results.irr },
                  { label: "Profitability Index", value: results.pi },
                  { label: "Future Value", value: results.futureValue },
                  { label: "Break-even Point", value: results.breakEven },
                ].map((item) => (
                  <div key={item.label}>
                    <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">{item.label}</h3>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 overflow-x-auto">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">Payback Period</th>
                      <th className="p-2">NPV</th>
                      <th className="p-2">IRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarios.map((s) => (
                      <tr key={s.name}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.payback} years</td>
                        <td className="p-2">
                          {formData.currency} {s.npv}
                        </td>
                        <td className="p-2">{s.irr}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Payback Optimizer</h3>
                <p className="text-gray-600 dark:text-gray-300">{results.paybackOptimizer}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Risk Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">{results.riskAnalysis}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Sensitivity Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Payback ranges from {results.sensitivity[0].payback} years at {results.sensitivity[0].rate}%
                  discount rate to {results.sensitivity[results.sensitivity.length - 1].payback} years at{" "}
                  {results.sensitivity[results.sensitivity.length - 1].rate}% discount rate.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">
                  Initial Investment Breakdown
                </h3>
                <canvas ref={investmentPieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Cumulative Cash Flow</h3>
                <canvas ref={cashflowLineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">
                  Cash Flow Growth & Reinvestment
                </h3>
                <canvas ref={growthAreaChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">
                  Cash Flow Distribution
                </h3>
                <canvas ref={distributionDonutChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">
                  Scenario Metrics Comparison
                </h3>
                <canvas ref={metricsBarChartRef} className="max-h-80" />
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
                    {history.map((h, index) => (
                      <tr key={index}>
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
        .cashflow-table {
          max-height: 300px;
          overflow-y: auto;
        }
        @media (max-width: 640px) {
          .flex-wrap {
            flex-direction: column;
            align-items: stretch;
          }
          button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
