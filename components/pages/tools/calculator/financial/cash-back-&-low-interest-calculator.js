"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("cashback");
  const [cashback, setCashback] = useState({
    currency: "USD",
    spending: "1000",
    annualFee: "0",
    rewardType: "flat",
    flatRate: "2",
    groceriesSpending: "300",
    groceriesRate: "3",
    travelSpending: "200",
    travelRate: "5",
    tier1Spending: "1000",
    tier1Rate: "1",
    tier2Spending: "0",
    tier2Rate: "3",
  });
  const [loan, setLoan] = useState({
    currency: "USD",
    loanAmount: "50000",
    lowRate: "3",
    standardRate: "6",
    loanTerm: "5",
    prepayment: "0",
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [history, setHistory] = useState(
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("calculationHistory")) || [] : []
  );

  const switchTab = (tab) => {
    setActiveTab(tab);
    setResults(null);
    setError("");
    setSuccess("");
    document.getElementById("history-section")?.classList.add("hidden");
  };

  const updateCashBackInputs = () => {
    // Handled by conditional rendering
  };

  const convertCurrency = (type) => {
    setError("");
    const rates = { USD: 1, PKR: 277.95, INR: 83.95 };
    const state = type === "cashback" ? cashback : loan;
    const setState = type === "cashback" ? setCashback : setLoan;
    const newCurrency = state.currency === "USD" ? "PKR" : state.currency === "PKR" ? "INR" : "USD";
    const fields =
      type === "cashback"
        ? ["spending", "annualFee", "groceriesSpending", "travelSpending", "tier1Spending", "tier2Spending"]
        : ["loanAmount", "prepayment"];
    const updated = { ...state, currency: newCurrency };
    fields.forEach((field) => {
      const value = parseFloat(state[field]);
      if (!isNaN(value)) {
        updated[field] = ((value * rates[newCurrency]) / rates[state.currency]).toFixed(2);
      }
    });
    setState(updated);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 2000);
  };

  const calculateCashBack = () => {
    setError("");
    setSuccess("");
    const {
      currency,
      spending,
      annualFee,
      rewardType,
      flatRate,
      groceriesSpending,
      groceriesRate,
      travelSpending,
      travelRate,
      tier1Spending,
      tier1Rate,
      tier2Spending,
      tier2Rate,
    } = cashback;
    const parsed = {
      spending: parseFloat(spending),
      annualFee: parseFloat(annualFee),
      flatRate: parseFloat(flatRate),
      groceriesSpending: parseFloat(groceriesSpending),
      groceriesRate: parseFloat(groceriesRate),
      travelSpending: parseFloat(travelSpending),
      travelRate: parseFloat(travelRate),
      tier1Spending: parseFloat(tier1Spending),
      tier1Rate: parseFloat(tier1Rate),
      tier2Spending: parseFloat(tier2Spending),
      tier2Rate: parseFloat(tier2Rate),
    };

    if (isNaN(parsed.spending) || isNaN(parsed.annualFee) || parsed.spending < 0 || parsed.annualFee < 0) {
      showError("Please provide valid spending and annual fee.");
      return;
    }

    let totalCashBack = 0;
    let cashBackData = [];
    let optimizerText = "To maximize rewards: ";

    if (rewardType === "flat") {
      if (isNaN(parsed.flatRate) || parsed.flatRate < 0 || parsed.flatRate > 100) {
        showError("Please provide a valid cash back rate (0–100%).");
        return;
      }
      totalCashBack = ((parsed.spending * parsed.flatRate) / 100).toFixed(2);
      cashBackData = [{ category: "All Spending", amount: totalCashBack }];
      optimizerText += `Maintain consistent spending to benefit from the flat ${parsed.flatRate}% rate.`;
    } else if (rewardType === "category") {
      if (
        isNaN(parsed.groceriesSpending) ||
        isNaN(parsed.groceriesRate) ||
        isNaN(parsed.travelSpending) ||
        isNaN(parsed.travelRate) ||
        parsed.groceriesSpending < 0 ||
        parsed.groceriesRate < 0 ||
        parsed.travelSpending < 0 ||
        parsed.travelRate < 0 ||
        parsed.groceriesRate > 100 ||
        parsed.travelRate > 100
      ) {
        showError("Please provide valid category spending and rates (0–100%).");
        return;
      }
      if (parsed.groceriesSpending + parsed.travelSpending > parsed.spending) {
        showError("Category spending exceeds total spending.");
        return;
      }
      const groceriesCashBack = ((parsed.groceriesSpending * parsed.groceriesRate) / 100).toFixed(2);
      const travelCashBack = ((parsed.travelSpending * parsed.travelRate) / 100).toFixed(2);
      const otherSpending = parsed.spending - parsed.groceriesSpending - parsed.travelSpending;
      const otherCashBack = ((otherSpending * 1) / 100).toFixed(2); // 1% default for other
      totalCashBack = (
        parseFloat(groceriesCashBack) +
        parseFloat(travelCashBack) +
        parseFloat(otherCashBack)
      ).toFixed(2);
      cashBackData = [
        { category: "Groceries", amount: groceriesCashBack },
        { category: "Travel", amount: travelCashBack },
        { category: "Other", amount: otherCashBack },
      ];
      optimizerText +=
        parsed.groceriesRate > parsed.travelRate
          ? `Allocate more spending to groceries (${parsed.groceriesRate}% rate).`
          : `Allocate more spending to travel (${parsed.travelRate}% rate).`;
    } else {
      if (
        isNaN(parsed.tier1Spending) ||
        isNaN(parsed.tier1Rate) ||
        isNaN(parsed.tier2Spending) ||
        isNaN(parsed.tier2Rate) ||
        parsed.tier1Spending < 0 ||
        parsed.tier1Rate < 0 ||
        parsed.tier2Spending < 0 ||
        parsed.tier2Rate < 0 ||
        parsed.tier1Rate > 100 ||
        parsed.tier2Rate > 100
      ) {
        showError("Please provide valid tiered spending and rates (0–100%).");
        return;
      }
      if (parsed.tier1Spending + parsed.tier2Spending > parsed.spending) {
        showError("Tiered spending exceeds total spending.");
        return;
      }
      const tier1CashBack = ((parsed.tier1Spending * parsed.tier1Rate) / 100).toFixed(2);
      const tier2CashBack = ((parsed.tier2Spending * parsed.tier2Rate) / 100).toFixed(2);
      totalCashBack = (parseFloat(tier1CashBack) + parseFloat(tier2CashBack)).toFixed(2);
      cashBackData = [
        { category: "Tier 1 (≤5000)", amount: tier1CashBack },
        { category: "Tier 2 (>5000)", amount: tier2CashBack },
      ];
      optimizerText += `Spend more in Tier 2 (>5000) to get ${parsed.tier2Rate}% rate.`;
    }

    const netRewards = (totalCashBack - parsed.annualFee).toFixed(2);
    const effectiveRate = ((netRewards / parsed.spending) * 100).toFixed(2);
    const breakEven = parsed.annualFee > 0 ? (parsed.annualFee / (totalCashBack / 12)).toFixed(1) : "N/A";

    setResults({
      type: "cashback",
      data: {
        totalCashBack: `${currency} ${totalCashBack}`,
        netRewards: `${currency} ${netRewards}`,
        effectiveRate: `${effectiveRate}%`,
        breakEven: breakEven === "N/A" ? "No annual fee" : `Recover annual fee in ${breakEven} months`,
        optimizer: optimizerText,
      },
      cashBackData,
    });

    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        type: "Cash Back",
        details: `Spending: ${currency} ${parsed.spending}, Cash Back: ${currency} ${totalCashBack}, Net Rewards: ${currency} ${netRewards}`,
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("calculationHistory", JSON.stringify(newHistory));

    alert("Pie chart not implemented in this demo.");
  };

  const calculateLoan = () => {
    setError("");
    setSuccess("");
    const { currency, loanAmount, lowRate, standardRate, loanTerm, prepayment } = loan;
    const parsed = {
      loanAmount: parseFloat(loanAmount),
      lowRate: parseFloat(lowRate),
      standardRate: parseFloat(standardRate),
      loanTerm: parseFloat(loanTerm),
      prepayment: parseFloat(prepayment),
    };

    if (
      isNaN(parsed.loanAmount) ||
      isNaN(parsed.lowRate) ||
      isNaN(parsed.standardRate) ||
      isNaN(parsed.loanTerm) ||
      isNaN(parsed.prepayment) ||
      parsed.loanAmount < 0 ||
      parsed.lowRate < 0 ||
      parsed.standardRate < 0 ||
      parsed.loanTerm < 1 ||
      parsed.prepayment < 0
    ) {
      showError("Please provide valid loan details.");
      return;
    }
    if (parsed.lowRate > 15 || parsed.standardRate > 20) {
      showError("Interest rates seem unrealistic (max 15% low, 20% standard).");
      return;
    }
    const maxLoan = 1000000 * (currency === "USD" ? 1 : currency === "PKR" ? 277.95 : 83.95);
    if (parsed.loanAmount > maxLoan) {
      showError(`Loan amount too high (max ${currency} ${maxLoan}).`);
      return;
    }

    const months = parsed.loanTerm * 12;
    const monthlyLowRate = parsed.lowRate / 100 / 12;
    const monthlyStandardRate = parsed.standardRate / 100 / 12;

    const monthlyPayment =
      (parsed.loanAmount * monthlyLowRate * Math.pow(1 + monthlyLowRate, months)) /
      (Math.pow(1 + monthlyLowRate, months) - 1);
    if (!isFinite(monthlyPayment)) {
      showError("Invalid loan calculation. Check inputs.");
      return;
    }

    const standardPayment =
      (parsed.loanAmount * monthlyStandardRate * Math.pow(1 + monthlyStandardRate, months)) /
      (Math.pow(1 + monthlyStandardRate, months) - 1);

    const totalInterest = (monthlyPayment * months - parsed.loanAmount).toFixed(2);
    const totalStandardInterest = (standardPayment * months - parsed.loanAmount).toFixed(2);
    const interestSavings = (totalStandardInterest - totalInterest).toFixed(2);

    let balance = parsed.loanAmount;
    let monthsPaid = 0;
    const amortization = [];
    while (balance > 0 && monthsPaid < months) {
      const interest = balance * monthlyLowRate;
      const principal = monthlyPayment - interest;
      balance -= principal + parsed.prepayment;
      monthsPaid++;
      amortization.push({
        month: monthsPaid,
        payment: (monthlyPayment + parsed.prepayment).toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance: Math.max(balance, 0).toFixed(2),
      });
    }

    setResults({
      type: "loan",
      data: {
        monthlyPayment: `${currency} ${monthlyPayment.toFixed(2)}`,
        totalInterest: `${currency} ${totalInterest}`,
        interestSavings: `${currency} ${interestSavings}`,
        payoffTime: `Pay off in ${monthsPaid} months${
          parsed.prepayment > 0 ? ` (saved ${months - monthsPaid} months)` : ""
        }`,
      },
      amortization,
    });

    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        type: "Loan",
        details: `Loan: ${currency} ${parsed.loanAmount}, Monthly: ${currency} ${monthlyPayment.toFixed(
          2
        )}, Interest: ${currency} ${totalInterest}`,
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("calculationHistory", JSON.stringify(newHistory));

    alert("Line chart not implemented in this demo.");
  };

  const saveCalculation = (type) => {
    if (results && results.type === type) {
      showSuccess("Calculation saved to history!");
    } else {
      showError("No valid calculation to save.");
    }
  };

  const loadHistory = () => {
    if (history.length === 0) {
      showError("No saved calculations found.");
      return;
    }
    document.getElementById("history-section")?.classList.remove("hidden");
  };

  const exportResults = () => {
    alert("Export not implemented in this demo.");
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Cash Back & Low Interest Calculator</h1>
        </div>
        <div className="flex border-b mb-6">
          {["cashback", "loan"].map((tab) => (
            <div
              key={tab}
              className={`tab px-6 py-3 cursor-pointer border-b-2 ${
                activeTab === tab ? "border-red-500 text-red-500" : "border-transparent"
              }`}
              onClick={() => switchTab(tab)}
            >
              {tab === "cashback" ? "Cash Back Calculator" : "Low Interest Loan Calculator"}
            </div>
          ))}
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

        {activeTab === "cashback" && (
          <div className="tab-content">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Cash Back Calculator</h2>
            <p className="text-sm text-gray-600 mb-4">
              Estimate your cash back rewards based on spending and reward structure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Currency", key: "currency", type: "select", options: ["USD", "PKR", "INR"] },
                { label: "Total Spending", key: "spending", type: "number", step: "0.01", min: "0" },
                { label: "Annual Fee", key: "annualFee", type: "number", step: "0.01", min: "0" },
                {
                  label: "Reward Type",
                  key: "rewardType",
                  type: "select",
                  options: ["flat", "category", "tiered"],
                  onChange: (e) => setCashback({ ...cashback, rewardType: e.target.value }),
                },
              ].map(({ label, key, type, options, step, min, onChange }) => (
                <div key={key} className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {label}
                    <span className="tooltip ml-1">
                      ?<span className="tooltiptext">{`Enter ${label.toLowerCase()}.`}</span>
                    </span>
                  </label>
                  {type === "select" ? (
                    <select
                      value={cashback[key]}
                      onChange={onChange || ((e) => setCashback({ ...cashback, [key]: e.target.value }))}
                      className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === "flat" ? "Flat-Rate" : opt === "category" ? "Category-Based" : "Tiered"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      value={cashback[key]}
                      onChange={(e) => setCashback({ ...cashback, [key]: e.target.value })}
                      step={step}
                      min={min}
                      className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                    />
                  )}
                </div>
              ))}
              <div id="cashback-inputs">
                {cashback.rewardType === "flat" && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Cash Back Rate (%)
                      <span className="tooltip ml-1">
                        ?<span className="tooltiptext">Enter cash back rate.</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={cashback.flatRate}
                      onChange={(e) => setCashback({ ...cashback, flatRate: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                    />
                  </div>
                )}
                {cashback.rewardType === "category" && (
                  <>
                    {[
                      { label: "Groceries Spending", key: "groceriesSpending", step: "0.01" },
                      { label: "Groceries Rate (%)", key: "groceriesRate", step: "0.1" },
                      { label: "Travel Spending", key: "travelSpending", step: "0.01" },
                      { label: "Travel Rate (%)", key: "travelRate", step: "0.1" },
                    ].map(({ label, key, step }) => (
                      <div key={key} className="relative mb-2">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          {label}
                          <span className="tooltip ml-1">
                            ?<span className="tooltiptext">{`Enter ${label.toLowerCase()}.`}</span>
                          </span>
                        </label>
                        <input
                          type="number"
                          step={step}
                          value={cashback[key]}
                          onChange={(e) => setCashback({ ...cashback, [key]: e.target.value })}
                          className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                        />
                      </div>
                    ))}
                  </>
                )}
                {cashback.rewardType === "tiered" && (
                  <>
                    {[
                      { label: "Spending Tier 1 (≤5000)", key: "tier1Spending", step: "0.01" },
                      { label: "Tier 1 Rate (%)", key: "tier1Rate", step: "0.1" },
                      { label: "Spending Tier 2 (>5000)", key: "tier2Spending", step: "0.01" },
                      { label: "Tier 2 Rate (%)", key: "tier2Rate", step: "0.1" },
                    ].map(({ label, key, step }) => (
                      <div key={key} className="relative mb-2">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          {label}
                          <span className="tooltip ml-1">
                            ?<span className="tooltiptext">{`Enter ${label.toLowerCase()}.`}</span>
                          </span>
                        </label>
                        <input
                          type="number"
                          step={step}
                          value={cashback[key]}
                          onChange={(e) => setCashback({ ...cashback, [key]: e.target.value })}
                          className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => convertCurrency("cashback")}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Convert Currency
            </button>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={calculateCashBack}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Calculate Cash Back
              </button>
              <button
                onClick={() => saveCalculation("cashback")}
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
            {results && results.type === "cashback" && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-red-500 mb-4">Cash Back Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-700">Total Cash Back</h4>
                    <p className="text-xl font-bold text-gray-800">{results.data.totalCashBack}</p>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-700">Net Rewards</h4>
                    <p className="text-xl font-bold text-gray-800">{results.data.netRewards}</p>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-700">Effective Reward Rate</h4>
                    <p className="text-xl font-bold text-gray-800">{results.data.effectiveRate}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-md font-medium text-red-500">Break-Even Point</h4>
                  <p className="text-gray-600">{results.data.breakEven}</p>
                </div>
                <div className="mt-6">
                  <h4 className="text-md font-medium text-red-500">Reward Optimizer</h4>
                  <p className="text-gray-600">{results.data.optimizer}</p>
                </div>
                <div className="mt-6">
                  <h4 className="text-md font-medium text-red-500">Cash Back by Category</h4>
                  <p className="text-gray-600">Pie chart not implemented in this demo.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "loan" && (
          <div className="tab-content">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Low Interest Loan Calculator</h2>
            <p className="text-sm text-gray-600 mb-4">
              Calculate payments and savings for low-interest loans.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Currency", key: "currency", type: "select", options: ["USD", "PKR", "INR"] },
                { label: "Loan Amount", key: "loanAmount", type: "number", step: "0.01", min: "0" },
                { label: "Low Interest Rate (%)", key: "lowRate", type: "number", step: "0.1", min: "0" },
                {
                  label: "Standard Interest Rate (%)",
                  key: "standardRate",
                  type: "number",
                  step: "0.1",
                  min: "0",
                },
                { label: "Loan Term (Years)", key: "loanTerm", type: "number", step: "1", min: "1" },
                { label: "Extra Monthly Payment", key: "prepayment", type: "number", step: "0.01", min: "0" },
              ].map(({ label, key, type, options, step, min }) => (
                <div key={key} className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {label}
                    <span className="tooltip ml-1">
                      ?<span className="tooltiptext">{`Enter ${label.toLowerCase()}.`}</span>
                    </span>
                  </label>
                  {type === "select" ? (
                    <select
                      value={loan[key]}
                      onChange={(e) => setLoan({ ...loan, [key]: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      value={loan[key]}
                      onChange={(e) => setLoan({ ...loan, [key]: e.target.value })}
                      step={step}
                      min={min}
                      className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => convertCurrency("loan")}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Convert Currency
            </button>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={calculateLoan}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Calculate Loan
              </button>
              <button
                onClick={() => saveCalculation("loan")}
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
            {results && results.type === "loan" && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-red-500 mb-4">Loan Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-700">Monthly Payment</h4>
                    <p className="text-xl font-bold text-gray-800">{results.data.monthlyPayment}</p>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-700">Total Interest</h4>
                    <p className="text-xl font-bold text-gray-800">{results.data.totalInterest}</p>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-700">Interest Savings</h4>
                    <p className="text-xl font-bold text-gray-800">{results.data.interestSavings}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-md font-medium text-red-500">Payoff Time</h4>
                  <p className="text-gray-600">{results.data.payoffTime}</p>
                </div>
                <div className="mt-6">
                  <h4 className="text-md font-medium text-red-500">Amortization Schedule</h4>
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">Month</th>
                        <th className="p-2">Payment</th>
                        <th className="p-2">Principal</th>
                        <th className="p-2">Interest</th>
                        <th className="p-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.amortization.slice(0, 12).map((row, i) => (
                        <tr key={i} className="border-b border-gray-300">
                          <td className="p-2">{row.month}</td>
                          <td className="p-2">
                            {currency} {row.payment}
                          </td>
                          <td className="p-2">
                            {currency} {row.principal}
                          </td>
                          <td className="p-2">
                            {currency} {row.interest}
                          </td>
                          <td className="p-2">
                            {currency} {row.balance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6">
                  <h4 className="text-md font-medium text-red-500">Loan Balance Over Time</h4>
                  <p className="text-gray-600">Line chart not implemented in this demo.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div id="history-section" className="mt-6 hidden">
          <h3 className="text-lg font-medium text-red-500 mb-4">Calculation History</h3>
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Date</th>
                <th className="p-2">Type</th>
                <th className="p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b border-gray-300">
                  <td className="p-2">{h.date}</td>
                  <td className="p-2">{h.type}</td>
                  <td className="p-2">{h.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={exportResults}
            className="mt-4 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Export Results
          </button>
        </div>

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
      </div>
    </div>
  );
}
