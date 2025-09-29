"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [activeTab, setActiveTab] = useState("mortgage");
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    mortgage: {
      currency: "USD",
      currentBalance: "200000",
      currentRate: "4.5",
      currentTerm: "25",
      newAmount: "200000",
      newRate: "3.5",
      newTerm: "30",
      closingCosts: "5000",
      income: "100000",
      taxRate: "30",
    },
    auto: {
      currency: "USD",
      currentBalance: "15000",
      currentRate: "6",
      currentTerm: "3",
      newAmount: "15000",
      newRate: "4",
      newTerm: "3",
      prepaymentPenalty: "0",
      tradeIn: "0",
      income: "60000",
      taxRate: "25",
    },
    personal: {
      currency: "USD",
      currentBalance: "10000",
      currentRate: "7",
      currentTerm: "2",
      newAmount: "10000",
      newRate: "5",
      newTerm: "3",
      originationFee: "1",
      income: "50000",
      taxRate: "25",
    },
  });
  const costPieChartRef = useRef(null);
  const balanceLineChartRef = useRef(null);
  const paymentBarChartRef = useRef(null);
  let costPieChart, balanceLineChart, paymentBarChart;

  useEffect(() => {
    if (costPieChartRef.current) {
      costPieChart = new Chart(costPieChartRef.current, { type: "pie", data: {}, options: {} });
    }
    if (balanceLineChartRef.current) {
      balanceLineChart = new Chart(balanceLineChartRef.current, { type: "line", data: {}, options: {} });
    }
    if (paymentBarChartRef.current) {
      paymentBarChart = new Chart(paymentBarChartRef.current, { type: "bar", data: {}, options: {} });
    }
    setHistory(JSON.parse(localStorage.getItem("refinanceHistory")) || []);
    return () => {
      costPieChart?.destroy();
      balanceLineChart?.destroy();
      paymentBarChart?.destroy();
    };
  }, []);

  const updateFormData = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setResults(null);
    setError("");
    setSuccess("");
  };

  const convertCurrency = (type) => {
    setError("");
    const currency = formData[type].currency;
    const rates = { USD: 1, PKR: 277.95, INR: 83.95 };
    const newCurrency = currency === "USD" ? "PKR" : currency === "PKR" ? "INR" : "USD";
    const fields =
      type === "mortgage"
        ? ["currentBalance", "newAmount", "closingCosts", "income"]
        : type === "auto"
        ? ["currentBalance", "newAmount", "prepaymentPenalty", "tradeIn", "income"]
        : ["currentBalance", "newAmount", "income"];
    const newData = { currency: newCurrency };
    fields.forEach((field) => {
      const value = parseFloat(formData[type][field]);
      if (!isNaN(value)) {
        newData[field] = ((value * rates[newCurrency]) / rates[currency]).toFixed(2);
      }
    });
    setFormData((prev) => ({ ...prev, [type]: { ...prev[type], ...newData } }));
  };

  const calculateLoan = (type) => {
    setError("");
    const data = formData[type];
    const inputs = {
      currency: data.currency,
      currentBalance: parseFloat(data.currentBalance),
      currentRate: parseFloat(data.currentRate),
      currentTerm: parseInt(data.currentTerm),
      newAmount: parseFloat(data.newAmount),
      newRate: parseFloat(data.newRate),
      newTerm: parseInt(data.newTerm),
      income: parseFloat(data.income),
      taxRate: parseFloat(data.taxRate),
      ...(type === "mortgage" && { closingCosts: parseFloat(data.closingCosts) }),
      ...(type === "auto" && {
        prepaymentPenalty: parseFloat(data.prepaymentPenalty),
        tradeIn: parseFloat(data.tradeIn),
      }),
      ...(type === "personal" && { originationFee: parseFloat(data.originationFee) }),
    };

    if (Object.values(inputs).some((v) => isNaN(v))) {
      setError("Please provide valid inputs.");
      return;
    }
    if (inputs.currentBalance <= 0 || inputs.newAmount <= 0 || inputs.income <= 0) {
      setError("Loan balances and income must be positive.");
      return;
    }
    if (
      inputs.currentRate < 0 ||
      inputs.newRate < 0 ||
      inputs.taxRate < 0 ||
      inputs.closingCosts < 0 ||
      inputs.prepaymentPenalty < 0 ||
      inputs.tradeIn < 0 ||
      inputs.originationFee < 0
    ) {
      setError("Rates, costs, penalties, fees, and trade-in cannot be negative.");
      return;
    }
    if (
      type === "mortgage" &&
      (inputs.currentTerm < 1 || inputs.currentTerm > 30 || inputs.newTerm < 1 || inputs.newTerm > 30)
    ) {
      setError("Mortgage terms must be between 1 and 30 years.");
      return;
    }
    if (
      (type === "auto" || type === "personal") &&
      (inputs.currentTerm < 1 || inputs.currentTerm > 7 || inputs.newTerm < 1 || inputs.newTerm > 7)
    ) {
      setError("Loan terms must be between 1 and 7 years.");
      return;
    }
    if (inputs.taxRate > 100 || (type === "personal" && inputs.originationFee > 10)) {
      setError("Tax rate must be 0-100%, origination fee up to 10%.");
      return;
    }

    // Current Loan
    const currentMonthlyRate = inputs.currentRate / 100 / 12;
    const currentPayments = inputs.currentTerm * 12;
    const currentMonthlyPayment =
      (inputs.currentBalance * currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentPayments)) /
      (Math.pow(1 + currentMonthlyRate, currentPayments) - 1);
    const currentTotalInterest = currentMonthlyPayment * currentPayments - inputs.currentBalance;

    // New Loan
    const newMonthlyRate = inputs.newRate / 100 / 12;
    const newPayments = inputs.newTerm * 12;
    const newMonthlyPayment =
      (inputs.newAmount * newMonthlyRate * Math.pow(1 + newMonthlyRate, newPayments)) /
      (Math.pow(1 + newMonthlyRate, newPayments) - 1);
    const newTotalInterest = newMonthlyPayment * newPayments - inputs.newAmount;
    const feeAmount = type === "personal" ? (inputs.newAmount * inputs.originationFee) / 100 : 0;
    const newTotalCost =
      newTotalInterest +
      inputs.newAmount +
      (type === "mortgage"
        ? inputs.closingCosts
        : type === "auto"
        ? inputs.prepaymentPenalty - inputs.tradeIn
        : feeAmount);

    // Amortization Schedule
    let balance = inputs.newAmount;
    const schedule = [];
    for (let i = 0; i < newPayments && balance > 0; i++) {
      const interest = balance * newMonthlyRate;
      const principal = newMonthlyPayment - interest;
      balance -= principal;
      if (balance < 0) balance = 0;
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      schedule.push({
        date: date.toISOString().slice(0, 10),
        payment: newMonthlyPayment.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance.toFixed(2),
      });
    }

    // Savings and Analysis
    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    const breakEvenMonths =
      type === "mortgage" && monthlySavings > 0 ? (inputs.closingCosts / monthlySavings).toFixed(2) : "N/A";
    const totalSavings = (
      currentTotalInterest -
      newTotalInterest -
      (type === "mortgage"
        ? inputs.closingCosts
        : type === "auto"
        ? inputs.prepaymentPenalty - inputs.tradeIn
        : feeAmount)
    ).toFixed(2);
    const dti = ((newMonthlyPayment / (inputs.income / 12)) * 100).toFixed(2);
    const riskAnalysis = dti > 36 ? "High risk (DTI > 36%)" : "Low risk (DTI ≤ 36%)";
    const optimizer =
      totalSavings <= 0
        ? `Consider a lower interest rate (below ${inputs.newRate}%) or ${
            type === "auto"
              ? "higher trade-in value"
              : type === "personal"
              ? "lower origination fee"
              : "shorter term"
          } to achieve savings.`
        : `Refinancing saves ${inputs.currency} ${totalSavings}${
            type === "mortgage"
              ? `; break-even in ${breakEvenMonths} months`
              : `; new payment is ${((newMonthlyPayment / (inputs.income / 12)) * 100).toFixed(
                  2
                )}% of monthly income`
          }.`;

    const resultData = {
      newMonthlyPayment: `${inputs.currency} ${newMonthlyPayment.toFixed(2)}`,
      totalSavings: `${inputs.currency} ${totalSavings}`,
      ...(type === "mortgage" ? { breakEvenMonths } : { dti: `${dti}%` }),
    };

    setResults({ type, resultData, currency: inputs.currency, schedule, optimizer, riskAnalysis });
    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        type: `${type.charAt(0).toUpperCase() + type.slice(1)} Loan Refinance`,
        keyMetric: "Total Savings",
        value: `${inputs.currency} ${totalSavings}`,
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("refinanceHistory", JSON.stringify(newHistory));
  };

  const saveCalculation = () => {
    if (results) {
      setSuccess("Calculation saved to history!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("No valid calculation to save.");
    }
  };

  const exportCSV = () => {
    const csvContent = [
      "Date,Loan Type,Key Metric,Value",
      ...history.map((h) => `"${h.date}","${h.type}","${h.keyMetric}","${h.value}"`),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "refinance_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Refinance Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    history.forEach((h) => {
      doc.text(`Date: ${h.date}, Type: ${h.type}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y);
    doc.save("refinance_results.pdf");
  };

  const updateCharts = (type, resultData, currency, schedule) => {
    if (costPieChart) costPieChart.destroy();
    if (balanceLineChart) balanceLineChart.destroy();
    if (paymentBarChart) paymentBarChart.destroy();

    const pieData =
      type === "mortgage"
        ? {
            labels: ["Principal", "Interest", "Closing Costs"],
            datasets: [
              {
                data: [
                  parseFloat(formData.mortgage.newAmount),
                  parseFloat(resultData.newMonthlyPayment.replace(currency, "")) *
                    formData.mortgage.newTerm *
                    12 -
                    parseFloat(formData.mortgage.newAmount),
                  parseFloat(formData.mortgage.closingCosts),
                ],
                backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
              },
            ],
          }
        : type === "auto"
        ? {
            labels: ["Principal", "Interest", "Prepayment Penalty", "Trade-In (Credit)"],
            datasets: [
              {
                data: [
                  parseFloat(formData.auto.newAmount),
                  parseFloat(resultData.newMonthlyPayment.replace(currency, "")) *
                    formData.auto.newTerm *
                    12 -
                    parseFloat(formData.auto.newAmount),
                  parseFloat(formData.auto.prepaymentPenalty),
                  -parseFloat(formData.auto.tradeIn),
                ],
                backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
              },
            ],
          }
        : {
            labels: ["Principal", "Interest", "Origination Fee"],
            datasets: [
              {
                data: [
                  parseFloat(formData.personal.newAmount),
                  parseFloat(resultData.newMonthlyPayment.replace(currency, "")) *
                    formData.personal.newTerm *
                    12 -
                    parseFloat(formData.personal.newAmount),
                  (parseFloat(formData.personal.newAmount) * parseFloat(formData.personal.originationFee)) /
                    100,
                ],
                backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
              },
            ],
          };
    costPieChart = new Chart(costPieChartRef.current, {
      type: "pie",
      data: pieData,
      options: {
        responsive: true,
        plugins: { legend: { position: "top" }, title: { display: true, text: "Cost Breakdown" } },
      },
    });

    balanceLineChart = new Chart(balanceLineChartRef.current, {
      type: "line",
      data: {
        labels: schedule.map((s) => s.date),
        datasets: [
          {
            label: `Balance (${currency})`,
            data: schedule.map((s) => s.balance),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Date" } },
          y: { title: { display: true, text: `Balance (${currency})` } },
        },
        plugins: { legend: { display: false }, title: { display: true, text: "Balance Over Time" } },
      },
    });

    const calculateComparison = (t, curr) => {
      const data =
        t === "mortgage"
          ? { newAmount: 200000, newRate: 3.5, newTerm: 30, closingCosts: 5000 }
          : t === "auto"
          ? { newAmount: 15000, newRate: 4, newTerm: 3, prepaymentPenalty: 0, tradeIn: 0 }
          : { newAmount: 10000, newRate: 5, newTerm: 3, originationFee: 1 };
      const monthlyRate = data.newRate / 100 / 12;
      const payments = data.newTerm * 12;
      const monthlyPayment =
        (data.newAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
        (Math.pow(1 + monthlyRate, payments) - 1).toFixed(2);
      return monthlyPayment;
    };

    paymentBarChart = new Chart(paymentBarChartRef.current, {
      type: "bar",
      data: {
        labels: ["Mortgage", "Auto Loan", "Personal Loan"],
        datasets: [
          {
            label: `Monthly Payment (${currency})`,
            data: [
              type === "mortgage"
                ? parseFloat(resultData.newMonthlyPayment.replace(currency, ""))
                : calculateComparison("mortgage", currency),
              type === "auto"
                ? parseFloat(resultData.newMonthlyPayment.replace(currency, ""))
                : calculateComparison("auto", currency),
              type === "personal"
                ? parseFloat(resultData.newMonthlyPayment.replace(currency, ""))
                : calculateComparison("personal", currency),
            ],
            backgroundColor: "#3b82f6",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { title: { display: true, text: `Monthly Payment (${currency})` } } },
        plugins: { legend: { display: false }, title: { display: true, text: "Payment Comparison" } },
      },
    });
  };

  const renderInputs = (type) => {
    const fields =
      type === "mortgage"
        ? [
            {
              id: "currency",
              label: "Currency",
              type: "select",
              options: ["USD", "PKR", "INR"],
              tooltip: "Choose your currency.",
            },
            {
              id: "currentBalance",
              label: "Current Loan Balance",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Remaining balance on current mortgage.",
            },
            {
              id: "currentRate",
              label: "Current Interest Rate (%)",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Current annual interest rate.",
            },
            {
              id: "currentTerm",
              label: "Current Remaining Term (Years)",
              type: "number",
              step: "1",
              min: "1",
              tooltip: "Years left on current mortgage.",
            },
            {
              id: "newAmount",
              label: "New Loan Amount",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "New mortgage amount (including cash-out).",
            },
            {
              id: "newRate",
              label: "New Interest Rate (%)",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "New annual interest rate.",
            },
            {
              id: "newTerm",
              label: "New Loan Term (Years)",
              type: "number",
              step: "1",
              min: "1",
              tooltip: "Duration of new mortgage.",
            },
            {
              id: "closingCosts",
              label: "Closing Costs",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Fees for refinancing.",
            },
            {
              id: "income",
              label: "Annual Income",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Income for affordability analysis.",
            },
            {
              id: "taxRate",
              label: "Tax Rate (%)",
              type: "number",
              step: "0.1",
              min: "0",
              tooltip: "Tax rate for savings analysis.",
            },
          ]
        : type === "auto"
        ? [
            {
              id: "currency",
              label: "Currency",
              type: "select",
              options: ["USD", "PKR", "INR"],
              tooltip: "Choose your currency.",
            },
            {
              id: "currentBalance",
              label: "Current Loan Balance",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Remaining balance on current auto loan.",
            },
            {
              id: "currentRate",
              label: "Current Interest Rate (%)",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Current annual interest rate.",
            },
            {
              id: "currentTerm",
              label: "Current Remaining Term (Years)",
              type: "number",
              step: "1",
              min: "1",
              tooltip: "Years left on current auto loan.",
            },
            {
              id: "newAmount",
              label: "New Loan Amount",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "New auto loan amount.",
            },
            {
              id: "newRate",
              label: "New Interest Rate (%)",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "New annual interest rate.",
            },
            {
              id: "newTerm",
              label: "New Loan Term (Years)",
              type: "number",
              step: "1",
              min: "1",
              tooltip: "Duration of new auto loan.",
            },
            {
              id: "prepaymentPenalty",
              label: "Prepayment Penalty",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Fee for paying off current loan early.",
            },
            {
              id: "tradeIn",
              label: "Trade-In Value",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Value of vehicle trade-in.",
            },
            {
              id: "income",
              label: "Annual Income",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Income for affordability analysis.",
            },
            {
              id: "taxRate",
              label: "Tax Rate (%)",
              type: "number",
              step: "0.1",
              min: "0",
              tooltip: "Tax rate for savings analysis.",
            },
          ]
        : [
            {
              id: "currency",
              label: "Currency",
              type: "select",
              options: ["USD", "PKR", "INR"],
              tooltip: "Choose your currency.",
            },
            {
              id: "currentBalance",
              label: "Current Loan Balance",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Remaining balance on current personal loan.",
            },
            {
              id: "currentRate",
              label: "Current Interest Rate (%)",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Current annual interest rate.",
            },
            {
              id: "currentTerm",
              label: "Current Remaining Term (Years)",
              type: "number",
              step: "1",
              min: "1",
              tooltip: "Years left on current personal loan.",
            },
            {
              id: "newAmount",
              label: "New Loan Amount",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "New personal loan amount.",
            },
            {
              id: "newRate",
              label: "New Interest Rate (%)",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "New annual interest rate.",
            },
            {
              id: "newTerm",
              label: "New Loan Term (Years)",
              type: "number",
              step: "1",
              min: "1",
              tooltip: "Duration of new personal loan.",
            },
            {
              id: "originationFee",
              label: "Origination Fee (%)",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Fee for new loan origination.",
            },
            {
              id: "income",
              label: "Annual Income",
              type: "number",
              step: "0.01",
              min: "0",
              tooltip: "Income for affordability analysis.",
            },
            {
              id: "taxRate",
              label: "Tax Rate (%)",
              type: "number",
              step: "0.1",
              min: "0",
              tooltip: "Tax rate for savings analysis.",
            },
          ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {field.label}
              <span className="tooltip">
                ?<span className="tooltiptext">{field.tooltip}</span>
              </span>
            </label>
            {field.type === "select" ? (
              <select
                value={formData[type][field.id]}
                onChange={(e) => updateFormData(type, field.id, e.target.value)}
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800"
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={formData[type][field.id]}
                onChange={(e) => updateFormData(type, field.id, e.target.value)}
                step={field.step}
                min={field.min}
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800"
              />
            )}
          </div>
        ))}
        <button
          onClick={() => convertCurrency(type)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Convert Currency
        </button>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => calculateLoan(type)}
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
      </div>
    );
  };

  return (
    <>
      <div className={`bg-white  flex items-center justify-center p-4 ${darkMode ? "dark" : ""}`}>
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Advanced Refinance Calculator</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            >
              Toggle Dark Mode
            </button>
          </div>
          <div className="flex border-b mb-6">
            {["mortgage", "auto", "personal"].map((tab) => (
              <div
                key={tab}
                onClick={() => switchTab(tab)}
                className={`tab px-6 py-3 cursor-pointer border-b-2 ${
                  activeTab === tab ? "border-[#10b981] text-[#10b981]" : "border-transparent"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Loan Refinance
              </div>
            ))}
          </div>
          <div className={`text-sm ${error ? "text-[#ef4444]" : success ? "text-[#10b981]" : "hidden"} mb-4`}>
            {error || success}
          </div>
          <div className={activeTab === "mortgage" ? "" : "hidden"}>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Mortgage Refinance Calculator</h2>
            <p className="text-sm text-gray-600 mb-4">
              Compare your current mortgage with new refinancing terms.
            </p>
            {renderInputs("mortgage")}
          </div>
          <div className={activeTab === "auto" ? "" : "hidden"}>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Auto Loan Refinance Calculator</h2>
            <p className="text-sm text-gray-600 mb-4">
              Evaluate refinancing your auto loan for better terms.
            </p>
            {renderInputs("auto")}
          </div>
          <div className={activeTab === "personal" ? "" : "hidden"}>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal Loan Refinance Calculator</h2>
            <p className="text-sm text-gray-600 mb-4">
              Assess refinancing your personal loan for better terms.
            </p>
            {renderInputs("personal")}
          </div>
          {results && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Refinance Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800">New Monthly Payment</h3>
                  <p className="text-xl font-bold text-gray-800">{results.resultData.newMonthlyPayment}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-800">Total Savings</h3>
                  <p className="text-xl font-bold text-gray-800">{results.resultData.totalSavings}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-800">
                    {results.type === "mortgage" ? "Break-Even" : "DTI"}
                  </h3>
                  <p className="text-xl font-bold text-gray-800">
                    {results.type === "mortgage"
                      ? `${results.resultData.breakEvenMonths} months`
                      : results.resultData.dti}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Amortization Schedule (New Loan)</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Payment</th>
                      <th className="p-2">Principal</th>
                      <th className="p-2">Interest</th>
                      <th className="p-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.schedule.map((s, i) => (
                      <tr key={i}>
                        <td className="p-2">{s.date}</td>
                        <td className="p-2">
                          {results.currency} {s.payment}
                        </td>
                        <td className="p-2">
                          {results.currency} {s.principal}
                        </td>
                        <td className="p-2">
                          {results.currency} {s.interest}
                        </td>
                        <td className="p-2">
                          {results.currency} {s.balance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Refinance Comparison</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Loan Type</th>
                      <th className="p-2">Monthly Payment</th>
                      <th className="p-2">Total Interest</th>
                      <th className="p-2">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["mortgage", "auto", "personal"].map((t) => {
                      const monthlyPayment =
                        t === results.type
                          ? results.resultData.newMonthlyPayment
                          : `${results.currency} ${calculateComparison(t, results.currency)}`;
                      const totalInterest =
                        t === results.type
                          ? `${results.currency} ${(
                              parseFloat(results.resultData.newMonthlyPayment.replace(results.currency, "")) *
                                formData[t].newTerm *
                                12 -
                              parseFloat(formData[t].newAmount)
                            ).toFixed(2)}`
                          : `${results.currency} ${(
                              calculateComparison(t, results.currency) * formData[t].newTerm * 12 -
                              formData[t].newAmount
                            ).toFixed(2)}`;
                      const totalCost =
                        t === results.type
                          ? `${results.currency} ${(
                              parseFloat(results.resultData.newMonthlyPayment.replace(results.currency, "")) *
                                formData[t].newTerm *
                                12 +
                              (t === "mortgage"
                                ? parseFloat(formData[t].closingCosts)
                                : t === "auto"
                                ? parseFloat(formData[t].prepaymentPenalty) - parseFloat(formData[t].tradeIn)
                                : (parseFloat(formData[t].newAmount) *
                                    parseFloat(formData[t].originationFee)) /
                                  100)
                            ).toFixed(2)}`
                          : `${results.currency} ${(
                              calculateComparison(t, results.currency) * formData[t].newTerm * 12 +
                              (t === "mortgage" ? 5000 : t === "auto" ? 0 : (formData[t].newAmount * 1) / 100)
                            ).toFixed(2)}`;
                      return (
                        <tr key={t}>
                          <td className="p-2">{t.charAt(0).toUpperCase() + t.slice(1)} Loan Refinance</td>
                          <td className="p-2">{monthlyPayment}</td>
                          <td className="p-2">{totalInterest}</td>
                          <td className="p-2">{totalCost}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Refinance Optimizer</h3>
                <p className="text-gray-600">{results.optimizer}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Risk Analysis</h3>
                <p className="text-gray-600">{results.riskAnalysis}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Cost Breakdown</h3>
                <canvas ref={costPieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Balance Over Time</h3>
                <canvas ref={balanceLineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Payment Comparison</h3>
                <canvas ref={paymentBarChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Loan Type</th>
                      <th className="p-2">Key Metric</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i}>
                        <td className="p-2">{h.date}</td>
                        <td className="p-2">{h.type}</td>
                        <td className="p-2">{h.keyMetric}</td>
                        <td className="p-2">{h.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4">
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
        .dark {
          background-color: #1f2937;
        }
        .dark .bg-gray-100 {
          background-color: #374151;
        }
        .dark .text-gray-800 {
          color: #e5e7eb;
        }
        .dark .text-gray-600 {
          color: #9ca3af;
        }
        .dark .bg-gray-200 {
          background-color: #4b5563;
        }
        .dark .bg-gray-50 {
          background-color: #6b7280;
        }
        @media (max-width: 640px) {
          .flex {
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
