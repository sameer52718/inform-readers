"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [investments, setInvestments] = useState([
    {
      principal: "10000",
      rate: "5",
      time: "5",
      timeUnit: "years",
      extraPayment: "0",
      currency: "USD",
      id: 1,
    },
  ]);
  const [fdRate, setFdRate] = useState("4.5");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [results, setResults] = useState(null);
  const [amortizationSchedules, setAmortizationSchedules] = useState([]);
  const [showAmortization, setShowAmortization] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [error, setError] = useState("");
  const interestChartRef = useRef(null);
  const breakdownChartRef = useRef(null);
  let interestChart, breakdownChart;

  const exchangeRates = { USD: 1, EUR: 0.95, GBP: 0.8, INR: 83.5 };
  const currencySymbols = { USD: "$", EUR: "€", GBP: "£", INR: "₹" };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      setIsDarkMode(savedTheme === "dark");
      if (savedTheme === "dark") document.documentElement.classList.add("dark");

      const savedData = JSON.parse(localStorage.getItem("investmentData"));
      if (savedData) {
        setInvestments(savedData.investments.map((inv, index) => ({ ...inv, id: index + 1 })));
        setFdRate(savedData.otherInputs.fdRate);
      }
    }

    if (interestChartRef.current) {
      interestChart = new Chart(interestChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [{ label: "Monthly Interest", data: [], borderColor: "#4f46e5", fill: false }],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Month" } },
            y: { title: { display: true, text: "Interest" } },
          },
        },
      });
    }
    if (breakdownChartRef.current) {
      breakdownChart = new Chart(breakdownChartRef.current, {
        type: "pie",
        data: {
          labels: ["Principal", "Simple Interest"],
          datasets: [{ data: [0, 0], backgroundColor: ["#4f46e5", "#e11d48"] }],
        },
        options: { responsive: true, plugins: { legend: { position: "top" } } },
      });
    }
    return () => {
      interestChart?.destroy();
      breakdownChart?.destroy();
    };
  }, []);

  const formatCurrency = (amount, currency) => {
    return `${currencySymbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  const addInvestmentForm = () => {
    setInvestments([
      ...investments,
      {
        principal: "10000",
        rate: "5",
        time: "5",
        timeUnit: "years",
        extraPayment: "0",
        currency: "USD",
        id: investments.length + 1,
      },
    ]);
  };

  const removeInvestment = (id) => {
    setInvestments(investments.filter((inv) => inv.id !== id));
  };

  const updateInvestment = (id, field, value) => {
    setInvestments(investments.map((inv) => (inv.id === id ? { ...inv, [field]: value } : inv)));
  };

  const resetForm = () => {
    setInvestments([
      {
        principal: "10000",
        rate: "5",
        time: "5",
        timeUnit: "years",
        extraPayment: "0",
        currency: "USD",
        id: 1,
      },
    ]);
    setFdRate("4.5");
    setResults(null);
    setAmortizationSchedules([]);
    setError("");
    localStorage.removeItem("investmentData");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  const validateInputs = (investments, fdRate) => {
    const errors = [];
    if (investments.length === 0) errors.push("Add at least one investment.");
    investments.forEach((inv, index) => {
      if (parseFloat(inv.principal) <= 0 || isNaN(inv.principal))
        errors.push(`Investment ${index + 1}: Invalid principal amount.`);
      if (parseFloat(inv.rate) < 0 || isNaN(inv.rate))
        errors.push(`Investment ${index + 1}: Invalid interest rate.`);
      if (parseFloat(inv.time) <= 0 || isNaN(inv.time))
        errors.push(`Investment ${index + 1}: Invalid time period.`);
      if (parseFloat(inv.extraPayment) < 0 || isNaN(inv.extraPayment))
        errors.push(`Investment ${index + 1}: Invalid extra payment.`);
    });
    if (parseFloat(fdRate) < 0 || isNaN(fdRate)) errors.push("Invalid fixed deposit rate.");
    return errors;
  };

  const convertTimeToYears = (time, unit) => {
    if (unit === "months") return time / 12;
    if (unit === "days") return time / 365;
    return time;
  };

  const calculateSimpleInterest = (principal, rate, timeInYears) => {
    const interest = (principal * rate * timeInYears) / 100;
    return isFinite(interest) ? interest : 0;
  };

  const calculateCompoundInterest = (principal, rate, timeInYears, compoundsPerYear = 1) => {
    const amount = principal * Math.pow(1 + rate / 100 / compoundsPerYear, compoundsPerYear * timeInYears);
    const interest = amount - principal;
    return isFinite(interest) ? interest : 0;
  };

  const generateAmortizationSchedule = (investment, principal, timeInYears, exchangeRate) => {
    const schedule = [];
    let remainingPrincipal = principal;
    const months = Math.ceil(timeInYears * 12);
    const monthlyPayment = parseFloat(investment.extraPayment);

    if (monthlyPayment <= 0) return schedule;

    for (let month = 1; month <= months && remainingPrincipal > 0; month++) {
      const principalPaid = Math.min(monthlyPayment, remainingPrincipal);
      remainingPrincipal -= principalPaid;
      schedule.push({
        investmentId: investment.id,
        month,
        payment: (monthlyPayment / exchangeRate).toFixed(2),
        principalPaid: (principalPaid / exchangeRate).toFixed(2),
        remainingPrincipal: (remainingPrincipal / exchangeRate).toFixed(2),
      });
    }
    return schedule;
  };

  const calculateInterest = () => {
    const exchangeRate = investments[0]?.currency ? exchangeRates[investments[0].currency] : 1;
    const currencySymbol = currencySymbols[investments[0]?.currency] || "$";

    const errors = validateInputs(investments, fdRate);
    if (errors.length > 0) {
      setError(errors.join("<br>"));
      setResults(null);
      return;
    } else {
      setError("");
    }

    localStorage.setItem("investmentData", JSON.stringify({ investments, otherInputs: { fdRate } }));

    let totalSimpleInterest = 0;
    let totalAmount = 0;
    let totalCompoundInterest = 0;
    let totalFDInterest = 0;
    let totalPrincipal = investments.reduce((sum, inv) => sum + parseFloat(inv.principal), 0);
    const newSchedules = [];
    const chartData = { interest: [], months: [] };

    investments.forEach((investment) => {
      const timeInYears = convertTimeToYears(parseFloat(investment.time), investment.timeUnit);
      const simpleInterest = calculateSimpleInterest(
        parseFloat(investment.principal),
        parseFloat(investment.rate),
        timeInYears
      );
      const compoundInterest = calculateCompoundInterest(
        parseFloat(investment.principal),
        parseFloat(investment.rate),
        timeInYears
      );
      const fdInterest = calculateSimpleInterest(
        parseFloat(investment.principal),
        parseFloat(fdRate),
        timeInYears
      );

      totalSimpleInterest += simpleInterest;
      totalAmount += parseFloat(investment.principal) + simpleInterest;
      totalCompoundInterest += compoundInterest;
      totalFDInterest += fdInterest;

      const schedule = generateAmortizationSchedule(
        investment,
        parseFloat(investment.principal),
        timeInYears,
        exchangeRate
      );
      newSchedules.push(schedule);

      const months = Math.ceil(timeInYears * 12);
      for (let month = 1; month <= months; month++) {
        const monthlyInterest = simpleInterest / months;
        if (!chartData.interest[month - 1]) {
          chartData.interest[month - 1] = 0;
          chartData.months[month - 1] = month;
        }
        chartData.interest[month - 1] += monthlyInterest / exchangeRate;
      }
    });

    setResults({
      totalPrincipal: totalPrincipal / exchangeRate,
      totalSimpleInterest: totalSimpleInterest / exchangeRate,
      totalAmount: totalAmount / exchangeRate,
      monthlyInterest: totalSimpleInterest / exchangeRate / (parseFloat(investments[0].time) * 12 || 1),
      totalCompoundInterest: totalCompoundInterest / exchangeRate,
      totalFDInterest: totalFDInterest / exchangeRate,
    });
    setAmortizationSchedules(newSchedules);

    if (interestChart) {
      interestChart.data.labels = chartData.months;
      interestChart.data.datasets[0].data = chartData.interest;
      interestChart.options.scales.y.title.text = `Interest (${currencySymbol})`;
      interestChart.update();
    }
    if (breakdownChart) {
      breakdownChart.data.datasets[0].data = [
        totalPrincipal / exchangeRate,
        totalSimpleInterest / exchangeRate,
      ];
      breakdownChart.update();
    }
  };

  const downloadReport = () => {
    if (!results) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Simple Interest Calculator Report", 20, 20);
    doc.setFontSize(12);
    let y = 30;
    Object.entries(results).forEach(([key, value]) => {
      doc.text(
        `${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}: ${
          currencySymbols[investments[0].currency]
        }${value.toFixed(2)}`,
        20,
        y
      );
      y += 10;
    });
    doc.save("simple_interest_report.pdf");
  };

  const inputFields = [
    {
      id: "principal",
      label: "Principal Amount",
      type: "number",
      min: "0",
      step: "1",
      tooltip: "Initial investment or loan amount",
    },
    {
      id: "rate",
      label: "Annual Interest Rate (%)",
      type: "number",
      min: "0",
      max: "20",
      step: "0.01",
      tooltip: "Annual interest rate",
    },
    { id: "rateSlider", label: "", type: "range", min: "0", max: "20", step: "0.1", noLabel: true },
    {
      id: "time",
      label: "Time Period",
      type: "number",
      min: "0",
      step: "1",
      tooltip: "Duration of investment/loan",
    },
    {
      id: "timeUnit",
      label: "",
      type: "select",
      options: [
        { value: "years", label: "Years" },
        { value: "months", label: "Months" },
        { value: "days", label: "Days" },
      ],
      tooltip: "Unit of time",
      noLabel: true,
    },
    {
      id: "extraPayment",
      label: "Extra Monthly Payment",
      type: "number",
      min: "0",
      step: "1",
      tooltip: "Additional monthly payment to reduce principal",
    },
    {
      id: "currency",
      label: "Currency",
      type: "select",
      options: [
        { value: "USD", label: "USD ($)" },
        { value: "EUR", label: "EUR (€)" },
        { value: "GBP", label: "GBP (£)" },
        { value: "INR", label: "INR (₹)" },
      ],
      tooltip: "Select currency for display",
    },
  ];

  return (
    <>
      <div className={`bg-white  p-6 max-w-5xl mx-auto ${isDarkMode ? "dark" : ""}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Advanced Simple Interest Calculator
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Enter Details</h2>
          <div id="investmentForms" className="space-y-4">
            {investments.map((investment, index) => (
              <div key={investment.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Investment {index + 1}
                  </h3>
                  {investments.length > 1 && (
                    <button
                      onClick={() => removeInvestment(investment.id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Remove investment"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {inputFields.map(
                    (field) =>
                      !field.noLabel && (
                        <div key={field.id} className="relative">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {field.label}
                          </label>
                          {field.type === "select" ? (
                            <select
                              value={investment[field.id]}
                              onChange={(e) => updateInvestment(investment.id, field.id, e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                              aria-label={field.label}
                            >
                              {field.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <>
                              <input
                                type={field.type}
                                min={field.min}
                                max={field.max}
                                step={field.step}
                                value={investment[field.id]}
                                onChange={(e) => updateInvestment(investment.id, field.id, e.target.value)}
                                className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white ${
                                  field.type === "range" ? "mt-2" : ""
                                }`}
                                aria-label={field.label}
                              />
                              {field.id === "rate" && (
                                <input
                                  type="range"
                                  min="0"
                                  max="20"
                                  step="0.1"
                                  value={investment.rate}
                                  onChange={(e) => updateInvestment(investment.id, "rate", e.target.value)}
                                  className="mt-2 w-full"
                                  aria-label="Adjust interest rate"
                                />
                              )}
                            </>
                          )}
                          <span className="tooltip absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8 hidden">
                            {field.tooltip}
                          </span>
                        </div>
                      )
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={addInvestmentForm}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              aria-label="Add another investment"
            >
              Add Another Investment
            </button>
            <button
              onClick={resetForm}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              aria-label="Reset form"
            >
              Reset Form
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Compare with Fixed Deposit Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={fdRate}
                onChange={(e) => setFdRate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                aria-label="Fixed deposit rate"
              />
              <span className="tooltip absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8 hidden">
                Fixed deposit interest rate for comparison
              </span>
            </div>
          </div>
          <button
            onClick={calculateInterest}
            className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            aria-label="Calculate interest"
          >
            Calculate
          </button>
        </div>
        {results && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Results</h2>
            {error && (
              <div
                className="text-red-600 dark:text-red-400 mb-4"
                dangerouslySetInnerHTML={{ __html: error }}
              />
            )}
            <div className="mb-4">
              {Object.entries(results).map(([key, value]) => (
                <p key={key}>
                  <strong>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</strong>{" "}
                  {formatCurrency(value, investments[0].currency)}
                </p>
              ))}
            </div>
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full text-left bg-gray-100 dark:bg-gray-700 p-2 rounded-md mb-2"
              aria-label="Toggle amortization schedule"
            >
              Amortization Schedule
            </button>
            {showAmortization && (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-2">Investment</th>
                      <th className="px-4 py-2">Month</th>
                      <th className="px-4 py-2">Payment</th>
                      <th className="px-4 py-2">Principal Paid</th>
                      <th className="px-4 py-2">Remaining Principal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedules.flat().map((row, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">Investment {row.investmentId}</td>
                        <td className="px-4 py-2">{row.month}</td>
                        <td className="px-4 py-2">{formatCurrency(row.payment, investments[0].currency)}</td>
                        <td className="px-4 py-2">
                          {formatCurrency(row.principalPaid, investments[0].currency)}
                        </td>
                        <td className="px-4 py-2">
                          {formatCurrency(row.remainingPrincipal, investments[0].currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="w-full text-left bg-gray-100 dark:bg-gray-700 p-2 rounded-md mb-2"
              aria-label="Toggle charts"
            >
              Interest Charts
            </button>
            {showCharts && (
              <div className="mb-4">
                <canvas ref={interestChartRef} className="w-full mb-4" />
                <canvas ref={breakdownChartRef} className="w-full" />
              </div>
            )}
            <button
              onClick={downloadReport}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              aria-label="Download PDF report"
            >
              Download PDF Report
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        .tooltip {
          display: none;
        }
        .relative:hover .tooltip {
          display: block;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #4f46e5;
          cursor: pointer;
          border-radius: 50%;
        }
        @media (max-width: 768px) {
          .grid-cols-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
