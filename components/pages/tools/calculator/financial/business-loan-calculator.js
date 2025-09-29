"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("standard");
  const [standard, setStandard] = useState({
    currency: "USD",
    loanAmount: "50000",
    interestRate: "5",
    term: "5",
    prepayment: "0",
    taxRate: "30",
    revenue: "100000",
    startDate: "2025-01-01",
  });
  const [loc, setLoc] = useState({
    currency: "USD",
    creditLimit: "100000",
    drawAmount: "50000",
    interestRate: "6",
    drawFrequency: "monthly",
    taxRate: "30",
    revenue: "100000",
    startDate: "2025-01-01",
  });
  const [sba, setSba] = useState({
    currency: "USD",
    loanAmount: "250000",
    interestRate: "4.5",
    term: "10",
    guaranteeFee: "2.5",
    collateral: "300000",
    taxRate: "30",
    revenue: "500000",
    startDate: "2025-01-01",
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [history, setHistory] = useState(
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loanHistory")) || [] : []
  );

  const switchTab = (tab) => {
    setActiveTab(tab);
    setResults(null);
    setError("");
    setSuccess("");
  };

  const convertCurrency = (type) => {
    setError("");
    const rates = { USD: 1, PKR: 277.95, INR: 83.95 };
    const state = type === "standard" ? standard : type === "loc" ? loc : sba;
    const setState = type === "standard" ? setStandard : type === "loc" ? setLoc : setSba;
    const newCurrency = state.currency === "USD" ? "PKR" : state.currency === "PKR" ? "INR" : "USD";
    const fields =
      type === "standard"
        ? ["loanAmount", "prepayment", "revenue"]
        : type === "loc"
        ? ["creditLimit", "drawAmount", "revenue"]
        : ["loanAmount", "collateral", "revenue"];
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

  const calculateStandard = () => {
    setError("");
    setSuccess("");
    const { currency, loanAmount, interestRate, term, prepayment, taxRate, revenue, startDate } = standard;
    const parsed = {
      loanAmount: parseFloat(loanAmount),
      interestRate: parseFloat(interestRate),
      term: parseInt(term),
      prepayment: parseFloat(prepayment),
      taxRate: parseFloat(taxRate),
      revenue: parseFloat(revenue),
      startDate: new Date(startDate),
    };

    if (
      isNaN(parsed.loanAmount) ||
      isNaN(parsed.interestRate) ||
      isNaN(parsed.term) ||
      isNaN(parsed.prepayment) ||
      isNaN(parsed.taxRate) ||
      isNaN(parsed.revenue)
    ) {
      showError("Please provide valid inputs.");
      return;
    }
    if (parsed.loanAmount <= 0 || parsed.revenue <= 0) {
      showError("Loan amount and revenue must be positive.");
      return;
    }
    if (parsed.interestRate < 0 || parsed.taxRate < 0 || parsed.prepayment < 0) {
      showError("Interest rate, tax rate, and prepayment cannot be negative.");
      return;
    }
    if (parsed.term < 1 || parsed.term > 30) {
      showError("Loan term must be between 1 and 30 years.");
      return;
    }
    if (parsed.taxRate > 100) {
      showError("Tax rate must be between 0 and 100%.");
      return;
    }

    const monthlyRate = parsed.interestRate / 100 / 12;
    const payments = parsed.term * 12;
    const monthlyPayment =
      (parsed.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1);
    let totalInterest = (monthlyPayment * payments - parsed.loanAmount).toFixed(2);
    let totalCost = (parseFloat(totalInterest) + parsed.loanAmount).toFixed(2);
    let balance = parsed.loanAmount;
    const schedule = [];

    for (let i = 0; i < payments && balance > 0; i++) {
      const interest = balance * monthlyRate;
      let principal = monthlyPayment - interest;
      if (i === 0 && parsed.prepayment > 0) balance -= parsed.prepayment;
      balance -= principal;
      if (balance < 0) {
        principal += balance;
        balance = 0;
      }
      const date = new Date(parsed.startDate);
      date.setMonth(date.getMonth() + i);
      schedule.push({
        date: date.toISOString().slice(0, 10),
        payment: monthlyPayment.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance.toFixed(2),
      });
    }

    if (parsed.prepayment > 0) {
      totalInterest = schedule.reduce((sum, s) => sum + parseFloat(s.interest), 0).toFixed(2);
      totalCost = (parseFloat(totalInterest) + parsed.loanAmount).toFixed(2);
    }

    const annualDebtService = monthlyPayment * 12;
    const dscr = (parsed.revenue * (1 - parsed.taxRate / 100)) / annualDebtService;
    const riskAnalysis = dscr < 1.25 ? "High default risk (DSCR < 1.25)" : "Low default risk (DSCR ≥ 1.25)";
    const optimizer =
      monthlyPayment > parsed.revenue * 0.1
        ? `Reduce loan amount by ${(parsed.loanAmount * 0.2).toFixed(2)} ${currency} or extend term to ${
            parsed.term + 2
          } years to lower monthly payments.`
        : `Current terms are optimal; monthly payment is ${((monthlyPayment / parsed.revenue) * 100).toFixed(
            2
          )}% of revenue.`;

    setResults({
      type: "standard",
      data: {
        monthlyPayment: `${currency} ${monthlyPayment.toFixed(2)}`,
        totalInterest: `${currency} ${totalInterest}`,
        totalCost: `${currency} ${totalCost}`,
        dscr: dscr.toFixed(2),
      },
      currency,
      schedule,
      optimizer,
      riskAnalysis,
    });

    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        type: "Standard Loan",
        keyMetric: "Monthly Payment",
        value: `${currency} ${monthlyPayment.toFixed(2)}`,
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("loanHistory", JSON.stringify(newHistory));
  };

  const calculateLOC = () => {
    setError("");
    setSuccess("");
    const { currency, creditLimit, drawAmount, interestRate, drawFrequency, taxRate, revenue, startDate } =
      loc;
    const parsed = {
      creditLimit: parseFloat(creditLimit),
      drawAmount: parseFloat(drawAmount),
      interestRate: parseFloat(interestRate),
      taxRate: parseFloat(taxRate),
      revenue: parseFloat(revenue),
    };

    if (
      isNaN(parsed.creditLimit) ||
      isNaN(parsed.drawAmount) ||
      isNaN(parsed.interestRate) ||
      isNaN(parsed.taxRate) ||
      isNaN(parsed.revenue)
    ) {
      showError("Please provide valid inputs.");
      return;
    }
    if (parsed.creditLimit <= 0 || parsed.drawAmount <= 0 || parsed.revenue <= 0) {
      showError("Credit limit, draw amount, and revenue must be positive.");
      return;
    }
    if (parsed.drawAmount > parsed.creditLimit) {
      showError("Draw amount cannot exceed credit limit.");
      return;
    }
    if (parsed.interestRate < 0 || parsed.taxRate < 0) {
      showError("Interest rate and tax rate cannot be negative.");
      return;
    }
    if (parsed.taxRate > 100) {
      showError("Tax rate must be between 0 and 100%.");
      return;
    }

    const dailyRate = parsed.interestRate / 100 / 365;
    const periods = drawFrequency === "monthly" ? 12 : drawFrequency === "quarterly" ? 4 : 1;
    const daysPerPeriod = drawFrequency === "monthly" ? 30 : drawFrequency === "quarterly" ? 90 : 365;
    let balance = parsed.drawAmount;
    let totalInterest = 0;
    const schedule = [];

    for (let i = 0; i < periods; i++) {
      const interest = balance * dailyRate * daysPerPeriod;
      totalInterest += interest;
      const date = new Date(startDate);
      date.setMonth(
        date.getMonth() + (drawFrequency === "monthly" ? i : drawFrequency === "quarterly" ? i * 3 : i * 12)
      );
      schedule.push({
        date: date.toISOString().slice(0, 10),
        payment: interest.toFixed(2),
        principal: "0.00",
        interest: interest.toFixed(2),
        balance: balance.toFixed(2),
      });
    }

    const utilizationRate = ((parsed.drawAmount / parsed.creditLimit) * 100).toFixed(2);
    const annualDebtService = totalInterest;
    const dscr = (parsed.revenue * (1 - parsed.taxRate / 100)) / annualDebtService;
    const riskAnalysis = dscr < 1.25 ? "High default risk (DSCR < 1.25)" : "Low default risk (DSCR ≥ 1.25)";
    const optimizer =
      utilizationRate > 80
        ? `Reduce draw amount by ${(parsed.drawAmount * 0.2).toFixed(
            2
          )} ${currency} to lower utilization below 80%.`
        : `Current draw is optimal; utilization rate is ${utilizationRate}%.`;

    setResults({
      type: "loc",
      data: {
        interestCost: `${currency} ${totalInterest.toFixed(2)}`,
        utilizationRate: `${utilizationRate}%`,
        dscr: dscr.toFixed(2),
      },
      currency,
      schedule,
      optimizer,
      riskAnalysis,
    });

    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        type: "Line of Credit",
        keyMetric: "Interest Cost",
        value: `${currency} ${totalInterest.toFixed(2)}`,
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("loanHistory", JSON.stringify(newHistory));
  };

  const calculateSBA = () => {
    setError("");
    setSuccess("");
    const {
      currency,
      loanAmount,
      interestRate,
      term,
      guaranteeFee,
      collateral,
      taxRate,
      revenue,
      startDate,
    } = sba;
    const parsed = {
      loanAmount: parseFloat(loanAmount),
      interestRate: parseFloat(interestRate),
      term: parseInt(term),
      guaranteeFee: parseFloat(guaranteeFee),
      collateral: parseFloat(collateral),
      taxRate: parseFloat(taxRate),
      revenue: parseFloat(revenue),
    };

    if (
      isNaN(parsed.loanAmount) ||
      isNaN(parsed.interestRate) ||
      isNaN(parsed.term) ||
      isNaN(parsed.guaranteeFee) ||
      isNaN(parsed.collateral) ||
      isNaN(parsed.taxRate) ||
      isNaN(parsed.revenue)
    ) {
      showError("Please provide valid inputs.");
      return;
    }
    if (parsed.loanAmount <= 0 || parsed.collateral <= 0 || parsed.revenue <= 0) {
      showError("Loan amount, collateral, and revenue must be positive.");
      return;
    }
    if (parsed.interestRate < 0 || parsed.taxRate < 0 || parsed.guaranteeFee < 0) {
      showError("Interest rate, tax rate, and guarantee fee cannot be negative.");
      return;
    }
    if (parsed.term < 1 || parsed.term > 25) {
      showError("Loan term must be between 1 and 25 years.");
      return;
    }
    if (parsed.taxRate > 100 || parsed.guaranteeFee > 5) {
      showError("Tax rate must be between 0 and 100%, guarantee fee up to 5%.");
      return;
    }

    const monthlyRate = parsed.interestRate / 100 / 12;
    const payments = parsed.term * 12;
    const monthlyPayment =
      (parsed.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1);
    const totalInterest = (monthlyPayment * payments - parsed.loanAmount).toFixed(2);
    const feeAmount = ((parsed.loanAmount * parsed.guaranteeFee) / 100).toFixed(2);
    const totalCost = (parseFloat(totalInterest) + parsed.loanAmount + parseFloat(feeAmount)).toFixed(2);
    let balance = parsed.loanAmount;
    const schedule = [];

    for (let i = 0; i < payments && balance > 0; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
      if (balance < 0) balance = 0;
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      schedule.push({
        date: date.toISOString().slice(0, 10),
        payment: monthlyPayment.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance.toFixed(2),
      });
    }

    const eligibility = parsed.collateral >= parsed.loanAmount * 0.5 ? "Eligible" : "Insufficient collateral";
    const annualDebtService = monthlyPayment * 12;
    const dscr = (parsed.revenue * (1 - parsed.taxRate / 100)) / annualDebtService;
    const riskAnalysis = dscr < 1.25 ? "High default risk (DSCR < 1.25)" : "Low default risk (DSCR ≥ 1.25)";
    const optimizer =
      monthlyPayment > parsed.revenue * 0.1
        ? `Reduce loan amount by ${(parsed.loanAmount * 0.2).toFixed(
            2
          )} ${currency} or increase collateral to ${parsed.loanAmount * 0.75}.`
        : `Current terms are optimal; SBA fees are ${parsed.guaranteeFee}%.`;

    setResults({
      type: "sba",
      data: {
        monthlyPayment: `${currency} ${monthlyPayment.toFixed(2)}`,
        totalInterest: `${currency} ${totalInterest}`,
        totalCost: `${currency} ${totalCost}`,
        eligibility,
      },
      currency,
      schedule,
      optimizer,
      riskAnalysis,
    });

    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        type: "SBA Loan",
        keyMetric: "Monthly Payment",
        value: `${currency} ${monthlyPayment.toFixed(2)}`,
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("loanHistory", JSON.stringify(newHistory));
  };

  const calculateComparison = (type, currency) => {
    if (type === "standard") {
      const loanAmount = 50000;
      const interestRate = 5;
      const term = 5;
      const monthlyRate = interestRate / 100 / 12;
      const payments = term * 12;
      const monthlyPayment =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
        (Math.pow(1 + monthlyRate, payments) - 1);
      const totalInterest = (monthlyPayment * payments - loanAmount).toFixed(2);
      const totalCost = (parseFloat(totalInterest) + loanAmount).toFixed(2);
      return {
        monthlyPayment: `${currency} ${monthlyPayment.toFixed(2)}`,
        totalInterest: `${currency} ${totalInterest}`,
        totalCost: `${currency} ${totalCost}`,
      };
    } else if (type === "loc") {
      const drawAmount = 50000;
      const interestRate = 6;
      const dailyRate = interestRate / 100 / 365;
      const totalInterest = (drawAmount * dailyRate * 365).toFixed(2);
      return {
        monthlyPayment: `${currency} N/A`,
        totalInterest: `${currency} ${totalInterest}`,
        totalCost: `${currency} ${totalInterest}`,
      };
    } else {
      const loanAmount = 250000;
      const interestRate = 4.5;
      const term = 10;
      const guaranteeFee = 2.5;
      const monthlyRate = interestRate / 100 / 12;
      const payments = term * 12;
      const monthlyPayment =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
        (Math.pow(1 + monthlyRate, payments) - 1);
      const totalInterest = (monthlyPayment * payments - loanAmount).toFixed(2);
      const feeAmount = ((loanAmount * guaranteeFee) / 100).toFixed(2);
      const totalCost = (parseFloat(totalInterest) + loanAmount + parseFloat(feeAmount)).toFixed(2);
      return {
        monthlyPayment: `${currency} ${monthlyPayment.toFixed(2)}`,
        totalInterest: `${currency} ${totalInterest}`,
        totalCost: `${currency} ${totalCost}`,
      };
    }
  };

  const saveCalculation = (type) => {
    if (results && results.type === type) {
      showSuccess("Calculation saved to history!");
    } else {
      showError("No valid calculation to save.");
    }
  };

  const exportCSV = () => {
    alert("CSV export not implemented in this demo.");
  };

  const exportPDF = () => {
    alert("PDF export not implemented in this demo.");
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Advanced Business Loan Calculator</h1>
        </div>
        <div className="flex border-b mb-6">
          {["standard", "loc", "sba"].map((tab) => (
            <div
              key={tab}
              className={`tab px-6 py-3 cursor-pointer border-b-2 ${
                activeTab === tab ? "border-red-500 text-red-500" : "border-transparent"
              }`}
              onClick={() => switchTab(tab)}
            >
              {tab === "standard" ? "Standard Loan" : tab === "loc" ? "Line of Credit" : "SBA Loan"}
            </div>
          ))}
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

        {activeTab === "standard" && (
          <div className="tab-content">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Standard Loan Calculator</h2>
            <p className="text-sm text-gray-600 mb-4">
              Calculate payments and costs for fixed-rate business loans.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Currency", key: "currency", type: "select", options: ["USD", "PKR", "INR"] },
                { label: "Loan Amount", key: "loanAmount", type: "number", step: "0.01", min: "0" },
                {
                  label: "Annual Interest Rate (%)",
                  key: "interestRate",
                  type: "number",
                  step: "0.01",
                  min: "0",
                },
                { label: "Loan Term (Years)", key: "term", type: "number", step: "1", min: "1" },
                { label: "Prepayment Amount", key: "prepayment", type: "number", step: "0.01", min: "0" },
                { label: "Tax Rate (%)", key: "taxRate", type: "number", step: "0.1", min: "0" },
                { label: "Annual Revenue", key: "revenue", type: "number", step: "0.01", min: "0" },
                { label: "Start Date", key: "startDate", type: "date" },
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
                      value={standard[key]}
                      onChange={(e) => setStandard({ ...standard, [key]: e.target.value })}
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
                      value={standard[key]}
                      onChange={(e) => setStandard({ ...standard, [key]: e.target.value })}
                      step={step}
                      min={min}
                      className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => convertCurrency("standard")}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Convert Currency
            </button>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={calculateStandard}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Calculate
              </button>
              <button
                onClick={() => saveCalculation("standard")}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                Save Calculation
              </button>
            </div>
          </div>
        )}

        {activeTab === "loc" && (
          <div className="tab-content">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Line of Credit Calculator</h2>
            <p className="text-sm text-gray-600 mb-4">
              Evaluate costs and flexibility of revolving credit lines.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Currency", key: "currency", type: "select", options: ["USD", "PKR", "INR"] },
                { label: "Credit Limit", key: "creditLimit", type: "number", step: "0.01", min: "0" },
                { label: "Draw Amount", key: "drawAmount", type: "number", step: "0.01", min: "0" },
                {
                  label: "Annual Interest Rate (%)",
                  key: "interestRate",
                  type: "number",
                  step: "0.01",
                  min: "0",
                },
                {
                  label: "Draw Frequency",
                  key: "drawFrequency",
                  type: "select",
                  options: ["monthly", "quarterly", "annually"],
                },
                { label: "Tax Rate (%)", key: "taxRate", type: "number", step: "0.1", min: "0" },
                { label: "Annual Revenue", key: "revenue", type: "number", step: "0.01", min: "0" },
                { label: "Start Date", key: "startDate", type: "date" },
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
                      value={loc[key]}
                      onChange={(e) => setLoc({ ...loc, [key]: e.target.value })}
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
                      value={loc[key]}
                      onChange={(e) => setLoc({ ...loc, [key]: e.target.value })}
                      step={step}
                      min={min}
                      className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => convertCurrency("loc")}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Convert Currency
            </button>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={calculateLOC}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Calculate
              </button>
              <button
                onClick={() => saveCalculation("loc")}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                Save Calculation
              </button>
            </div>
          </div>
        )}

        {activeTab === "sba" && (
          <div className="tab-content">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">SBA Loan Calculator</h2>
            <p className="text-sm text-gray-600 mb-4">Analyze SBA loans with fees and eligibility checks.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Currency", key: "currency", type: "select", options: ["USD", "PKR", "INR"] },
                { label: "Loan Amount", key: "loanAmount", type: "number", step: "0.01", min: "0" },
                {
                  label: "Annual Interest Rate (%)",
                  key: "interestRate",
                  type: "number",
                  step: "0.01",
                  min: "0",
                },
                { label: "Loan Term (Years)", key: "term", type: "number", step: "1", min: "1" },
                {
                  label: "SBA Guarantee Fee (%)",
                  key: "guaranteeFee",
                  type: "number",
                  step: "0.01",
                  min: "0",
                },
                { label: "Collateral Value", key: "collateral", type: "number", step: "0.01", min: "0" },
                { label: "Tax Rate (%)", key: "taxRate", type: "number", step: "0.1", min: "0" },
                { label: "Annual Revenue", key: "revenue", type: "number", step: "0.01", min: "0" },
                { label: "Start Date", key: "startDate", type: "date" },
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
                      value={sba[key]}
                      onChange={(e) => setSba({ ...sba, [key]: e.target.value })}
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
                      value={sba[key]}
                      onChange={(e) => setSba({ ...sba, [key]: e.target.value })}
                      step={step}
                      min={min}
                      className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => convertCurrency("sba")}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Convert Currency
            </button>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={calculateSBA}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Calculate
              </button>
              <button
                onClick={() => saveCalculation("sba")}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                Save Calculation
              </button>
            </div>
          </div>
        )}

        {results && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Loan Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.type === "standard" ? (
                <>
                  <div>
                    <h3 className="text-md font-medium text-red-500">Monthly Payment</h3>
                    <p className="text-xl font-bold text-gray-800">{results.data.monthlyPayment}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-red-500">Total Interest</h3>
                    <p className="text-xl font-bold text-gray-800">{results.data.totalInterest}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-red-500">DSCR</h3>
                    <p className="text-xl font-bold text-gray-800">{results.data.dscr}</p>
                  </div>
                </>
              ) : results.type === "loc" ? (
                <>
                  <div>
                    <h3 className="text-md font-medium text-red-500">Interest Cost</h3>
                    <p className="text-xl font-bold text-gray-800">{results.data.interestCost}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-red-500">Utilization Rate</h3>
                    <p className="text-xl font-bold text-gray-800">{results.data.utilizationRate}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-red-500">DSCR</h3>
                    <p className="text-xl font-bold text-gray-800">{results.data.dscr}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-md font-medium text-red-500">Monthly Payment</h3>
                    <p className="text-xl font-bold text-gray-800">{results.data.monthlyPayment}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-red-500">Total Cost</h3>
                    <p className="text-xl font-bold text-gray-800">{results.data.totalCost}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-red-500">Eligibility</h3>
                    <p className="text-xl font-bold text-gray-800">{results.data.eligibility}</p>
                  </div>
                </>
              )}
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Amortization Schedule</h3>
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
                    <tr key={i} className="border-b border-gray-300">
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
            <div className="mt-6 overflow-x-auto">
              <h3 className="text-md font-medium text-red-500">Loan Comparison</h3>
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
                  {["standard", "loc", "sba"].map((type) => {
                    const data =
                      results.type === type ? results.data : calculateComparison(type, results.currency);
                    return (
                      <tr key={type} className="border-b border-gray-300">
                        <td className="p-2">
                          {type === "standard"
                            ? "Standard Loan"
                            : type === "loc"
                            ? "Line of Credit"
                            : "SBA Loan"}
                        </td>
                        <td className="p-2">{data.monthlyPayment}</td>
                        <td className="p-2">{data.totalInterest}</td>
                        <td className="p-2">{data.totalCost}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Loan Optimizer</h3>
              <p className="text-gray-600">{results.optimizer}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Risk Analysis</h3>
              <p className="text-gray-600">{results.riskAnalysis}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Loan Cost Breakdown</h3>
              <p className="text-gray-600">Chart not implemented in this demo.</p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Balance Over Time</h3>
              <p className="text-gray-600">Chart not implemented in this demo.</p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Payment Comparison</h3>
              <p className="text-gray-600">Chart not implemented in this demo.</p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Calculation History</h3>
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
                    <tr key={i} className="border-b border-gray-300">
                      <td className="p-2">{h.date}</td>
                      <td className="p-2">{h.type}</td>
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
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Export CSV
              </button>
              <button
                onClick={exportPDF}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Export PDF
              </button>
            </div>
          </div>
        )}
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
  );
}
