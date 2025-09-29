"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("fixed");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fixedCurrency, setFixedCurrency] = useState("USD");
  const [fixedLoanAmount, setFixedLoanAmount] = useState("10000");
  const [fixedInterestRate, setFixedInterestRate] = useState("6.5");
  const [fixedTerm, setFixedTerm] = useState("3");
  const [fixedPrepayment, setFixedPrepayment] = useState("0");
  const [fixedIncome, setFixedIncome] = useState("50000");
  const [fixedTaxRate, setFixedTaxRate] = useState("25");
  const [fixedStartDate, setFixedStartDate] = useState("2025-01-01");
  const [variableCurrency, setVariableCurrency] = useState("USD");
  const [variableLoanAmount, setVariableLoanAmount] = useState("10000");
  const [variableInterestRate, setVariableInterestRate] = useState("5");
  const [variableAdjustmentFrequency, setVariableAdjustmentFrequency] = useState("monthly");
  const [variableRateCap, setVariableRateCap] = useState("10");
  const [variableRateFloor, setVariableRateFloor] = useState("3");
  const [variableTerm, setVariableTerm] = useState("3");
  const [variableIncome, setVariableIncome] = useState("50000");
  const [variableTaxRate, setVariableTaxRate] = useState("25");
  const [variableStartDate, setVariableStartDate] = useState("2025-01-01");
  const [consolidationCurrency, setConsolidationCurrency] = useState("USD");
  const [consolidationInterestRate, setConsolidationInterestRate] = useState("5.5");
  const [consolidationTerm, setConsolidationTerm] = useState("4");
  const [consolidationIncome, setConsolidationIncome] = useState("50000");
  const [consolidationTaxRate, setConsolidationTaxRate] = useState("25");
  const [consolidationStartDate, setConsolidationStartDate] = useState("2025-01-01");
  const [debts, setDebts] = useState([{ id: 0, name: "", balance: "", interestRate: "", payment: "" }]);
  const [results, setResults] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [optimizer, setOptimizer] = useState("");
  const [riskAnalysis, setRiskAnalysis] = useState("");
  const [loanHistory, setLoanHistory] = useState([]);

  const formatCurrency = (amount, curr) =>
    `${curr === "USD" ? "$" : curr === "PKR" ? "₨" : "₹"}${parseFloat(amount || 0).toFixed(2)}`;

  const switchTab = (tab) => {
    setActiveTab(tab);
    setResults(null);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const addDebt = () => {
    setDebts([...debts, { id: debts.length, name: "", balance: "", interestRate: "", payment: "" }]);
  };

  const removeDebt = (id) => {
    if (debts.length > 1) {
      setDebts(debts.filter((debt) => debt.id !== id));
    } else {
      setErrorMessage("At least one debt is required.");
    }
  };

  const updateDebt = (id, field, value) => {
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, [field]: value } : debt)));
  };

  const convertCurrency = (type) => {
    setErrorMessage("");
    const rates = { USD: 1, PKR: 277.95, INR: 83.95 };
    let currentCurrency, setCurrency;
    if (type === "fixed") {
      currentCurrency = fixedCurrency;
      setCurrency = setFixedCurrency;
    } else if (type === "variable") {
      currentCurrency = variableCurrency;
      setCurrency = setVariableCurrency;
    } else {
      currentCurrency = consolidationCurrency;
      setCurrency = setConsolidationCurrency;
    }

    const newCurrency = currentCurrency === "USD" ? "PKR" : currentCurrency === "PKR" ? "INR" : "USD";
    setCurrency(newCurrency);

    if (type === "fixed") {
      const fields = [
        { value: fixedLoanAmount, setter: setFixedLoanAmount },
        { value: fixedPrepayment, setter: setFixedPrepayment },
        { value: fixedIncome, setter: setFixedIncome },
      ];
      fields.forEach(({ value, setter }) => {
        if (!isNaN(parseFloat(value))) {
          setter(((parseFloat(value) * rates[newCurrency]) / rates[currentCurrency]).toFixed(2));
        }
      });
    } else if (type === "variable") {
      const fields = [
        { value: variableLoanAmount, setter: setVariableLoanAmount },
        { value: variableIncome, setter: setVariableIncome },
      ];
      fields.forEach(({ value, setter }) => {
        if (!isNaN(parseFloat(value))) {
          setter(((parseFloat(value) * rates[newCurrency]) / rates[currentCurrency]).toFixed(2));
        }
      });
    } else {
      if (!isNaN(parseFloat(consolidationIncome))) {
        setConsolidationIncome(
          ((parseFloat(consolidationIncome) * rates[newCurrency]) / rates[currentCurrency]).toFixed(2)
        );
      }
      setDebts(
        debts.map((debt) => ({
          ...debt,
          balance: !isNaN(parseFloat(debt.balance))
            ? ((parseFloat(debt.balance) * rates[newCurrency]) / rates[currentCurrency]).toFixed(2)
            : debt.balance,
          payment: !isNaN(parseFloat(debt.payment))
            ? ((parseFloat(debt.payment) * rates[newCurrency]) / rates[currentCurrency]).toFixed(2)
            : debt.payment,
        }))
      );
    }
  };

  const calculateFixed = () => {
    setErrorMessage("");
    const currency = fixedCurrency;
    const loanAmount = parseFloat(fixedLoanAmount);
    const interestRate = parseFloat(fixedInterestRate);
    const term = parseInt(fixedTerm);
    const prepayment = parseFloat(fixedPrepayment);
    const income = parseFloat(fixedIncome);
    const taxRate = parseFloat(fixedTaxRate);
    const startDate = new Date(fixedStartDate);

    if (
      isNaN(loanAmount) ||
      isNaN(interestRate) ||
      isNaN(term) ||
      isNaN(prepayment) ||
      isNaN(income) ||
      isNaN(taxRate)
    ) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }
    if (loanAmount <= 0 || income <= 0) {
      setErrorMessage("Loan amount and income must be positive.");
      return;
    }
    if (interestRate < 0 || taxRate < 0 || prepayment < 0) {
      setErrorMessage("Interest rate, tax rate, and prepayment cannot be negative.");
      return;
    }
    if (term < 1 || term > 7) {
      setErrorMessage("Loan term must be between 1 and 7 years.");
      return;
    }
    if (taxRate > 100) {
      setErrorMessage("Tax rate must be between 0 and 100%.");
      return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const payments = term * 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1);
    let totalInterest = (monthlyPayment * payments - loanAmount).toFixed(2);
    let balance = loanAmount;
    let newSchedule = [];

    for (let i = 0; i < payments && balance > 0; i++) {
      const interest = balance * monthlyRate;
      let principal = monthlyPayment - interest;
      if (i === 0 && prepayment > 0) {
        balance -= prepayment;
      }
      balance -= principal;
      if (balance < 0) {
        principal += balance;
        balance = 0;
      }
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      newSchedule.push({
        date: date.toISOString().slice(0, 10),
        payment: monthlyPayment.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance.toFixed(2),
      });
    }

    if (prepayment > 0) {
      totalInterest = newSchedule.reduce((sum, s) => sum + parseFloat(s.interest), 0).toFixed(2);
    }

    const affordabilityRatio = monthlyPayment / (income / 12);
    const dti = (affordabilityRatio * 100).toFixed(2);
    const newRiskAnalysis = dti > 36 ? "High risk (DTI > 36%)" : "Low risk (DTI ≤ 36%)";
    const newOptimizer =
      affordabilityRatio > 0.3
        ? `Reduce loan amount by ${(loanAmount * 0.2).toFixed(2)} ${currency} or extend term to ${
            term + 1
          } years to improve affordability.`
        : `Current terms are affordable; payment is ${(affordabilityRatio * 100).toFixed(
            2
          )}% of monthly income.`;

    setResults({
      monthlyPayment: formatCurrency(monthlyPayment, currency),
      totalInterest: formatCurrency(totalInterest, currency),
      dti: `${dti}%`,
    });
    setSchedule(newSchedule);
    setOptimizer(newOptimizer);
    setRiskAnalysis(newRiskAnalysis);

    const newHistory = [
      ...loanHistory,
      {
        date: new Date().toLocaleString(),
        type: "Fixed-Rate Loan",
        keyMetric: "Monthly Payment",
        value: formatCurrency(monthlyPayment, currency),
      },
    ];
    setLoanHistory(newHistory);
    localStorage.setItem("personalLoanHistory", JSON.stringify(newHistory));

    alert("Charts and PDF export not implemented in this demo.");
  };

  const calculateVariable = () => {
    setErrorMessage("");
    const currency = variableCurrency;
    const loanAmount = parseFloat(variableLoanAmount);
    const initialRate = parseFloat(variableInterestRate);
    const rateCap = parseFloat(variableRateCap);
    const rateFloor = parseFloat(variableRateFloor);
    const term = parseInt(variableTerm);
    const income = parseFloat(variableIncome);
    const taxRate = parseFloat(variableTaxRate);
    const startDate = new Date(variableStartDate);

    if (
      isNaN(loanAmount) ||
      isNaN(initialRate) ||
      isNaN(rateCap) ||
      isNaN(rateFloor) ||
      isNaN(term) ||
      isNaN(income) ||
      isNaN(taxRate)
    ) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }
    if (loanAmount <= 0 || income <= 0) {
      setErrorMessage("Loan amount and income must be positive.");
      return;
    }
    if (initialRate < 0 || rateCap < 0 || rateFloor < 0 || taxRate < 0) {
      setErrorMessage("Interest rates and tax rate cannot be negative.");
      return;
    }
    if (term < 1 || term > 7) {
      setErrorMessage("Loan term must be between 1 and 7 years.");
      return;
    }
    if (taxRate > 100) {
      setErrorMessage("Tax rate must be between 0 and 100%.");
      return;
    }
    if (rateFloor > initialRate || rateCap < initialRate) {
      setErrorMessage("Initial rate must be between floor and cap.");
      return;
    }

    const payments = term * 12;
    let balance = loanAmount;
    let totalInterestBest = 0,
      totalInterestWorst = 0;
    let scheduleBest = [];

    let rate = rateFloor / 100 / 12;
    const monthlyPaymentBest =
      (loanAmount * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
    balance = loanAmount;
    for (let i = 0; i < payments && balance > 0; i++) {
      const interest = balance * rate;
      const principal = monthlyPaymentBest - interest;
      balance -= principal;
      if (balance < 0) balance = 0;
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      scheduleBest.push({
        date: date.toISOString().slice(0, 10),
        payment: monthlyPaymentBest.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance.toFixed(2),
      });
      totalInterestBest += interest;
    }

    rate = rateCap / 100 / 12;
    const monthlyPaymentWorst =
      (loanAmount * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
    balance = loanAmount;
    for (let i = 0; i < payments && balance > 0; i++) {
      const interest = balance * rate;
      totalInterestWorst += interest;
    }

    totalInterestBest = totalInterestBest.toFixed(2);
    totalInterestWorst = totalInterestWorst.toFixed(2);
    const affordabilityRatio = monthlyPaymentWorst / (income / 12);
    const dti = (affordabilityRatio * 100).toFixed(2);
    const newRiskAnalysis = dti > 36 ? "High risk (DTI > 36%)" : "Low risk (DTI ≤ 36%)";
    const newOptimizer =
      affordabilityRatio > 0.3
        ? `Reduce loan amount by ${(loanAmount * 0.2).toFixed(
            2
          )} ${currency} or choose a fixed-rate loan to avoid rate fluctuations.`
        : `Variable-rate loan is affordable; worst-case payment is ${(affordabilityRatio * 100).toFixed(
            2
          )}% of monthly income.`;

    setResults({
      monthlyPaymentBest: formatCurrency(monthlyPaymentBest, currency),
      monthlyPaymentWorst: formatCurrency(monthlyPaymentWorst, currency),
      totalInterest: `${formatCurrency(totalInterestBest, currency)} - ${formatCurrency(
        totalInterestWorst,
        currency
      )}`,
      dti: `${dti}%`,
    });
    setSchedule(scheduleBest);
    setOptimizer(newOptimizer);
    setRiskAnalysis(newRiskAnalysis);

    const newHistory = [
      ...loanHistory,
      {
        date: new Date().toLocaleString(),
        type: "Variable-Rate Loan",
        keyMetric: "Worst-Case Monthly Payment",
        value: formatCurrency(monthlyPaymentWorst, currency),
      },
    ];
    setLoanHistory(newHistory);
    localStorage.setItem("personalLoanHistory", JSON.stringify(newHistory));

    alert("Charts and PDF export not implemented in this demo.");
  };

  const calculateConsolidation = () => {
    setErrorMessage("");
    const currency = consolidationCurrency;
    const interestRate = parseFloat(consolidationInterestRate);
    const term = parseInt(consolidationTerm);
    const income = parseFloat(consolidationIncome);
    const taxRate = parseFloat(consolidationTaxRate);
    const startDate = new Date(consolidationStartDate);

    if (
      debts.some(
        (d) =>
          isNaN(parseFloat(d.balance)) || isNaN(parseFloat(d.interestRate)) || isNaN(parseFloat(d.payment))
      )
    ) {
      setErrorMessage("Please provide valid inputs for all debts.");
      return;
    }
    if (isNaN(interestRate) || isNaN(term) || isNaN(income) || isNaN(taxRate)) {
      setErrorMessage("Please provide valid new loan terms and income.");
      return;
    }
    if (debts.some((d) => parseFloat(d.balance) <= 0 || parseFloat(d.payment) <= 0) || income <= 0) {
      setErrorMessage("Debt balances, payments, and income must be positive.");
      return;
    }
    if (interestRate < 0 || taxRate < 0 || debts.some((d) => parseFloat(d.interestRate) < 0)) {
      setErrorMessage("Interest rates and tax rate cannot be negative.");
      return;
    }
    if (term < 1 || term > 7) {
      setErrorMessage("Loan term must be between 1 and 7 years.");
      return;
    }
    if (taxRate > 100) {
      setErrorMessage("Tax rate must be between 0 and 100%.");
      return;
    }

    const loanAmount = debts.reduce((sum, d) => sum + parseFloat(d.balance || 0), 0);
    const monthlyRate = interestRate / 100 / 12;
    const payments = term * 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1);
    const totalInterest = (monthlyPayment * payments - loanAmount).toFixed(2);
    let balance = loanAmount;
    let newSchedule = [];

    for (let i = 0; i < payments && balance > 0; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
      if (balance < 0) balance = 0;
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      newSchedule.push({
        date: date.toISOString().slice(0, 10),
        payment: monthlyPayment.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance.toFixed(2),
      });
    }

    const currentMonthlyPayments = debts.reduce((sum, d) => sum + parseFloat(d.payment || 0), 0);
    const savings = ((currentMonthlyPayments - monthlyPayment) * payments).toFixed(2);
    const affordabilityRatio = monthlyPayment / (income / 12);
    const dti = (affordabilityRatio * 100).toFixed(2);
    const newRiskAnalysis = dti > 36 ? "High risk (DTI > 36%)" : "Low risk (DTI ≤ 36%)";
    const newOptimizer =
      savings <= 0
        ? `Consider a lower interest rate (below ${interestRate}%) or shorter term to achieve savings.`
        : `Consolidation saves ${formatCurrency(savings, currency)}; new payment is ${(
            affordabilityRatio * 100
          ).toFixed(2)}% of monthly income.`;

    setResults({
      monthlyPayment: formatCurrency(monthlyPayment, currency),
      totalInterest: formatCurrency(totalInterest, currency),
      savings: formatCurrency(savings, currency),
      dti: `${dti}%`,
    });
    setSchedule(newSchedule);
    setOptimizer(newOptimizer);
    setRiskAnalysis(newRiskAnalysis);

    const newHistory = [
      ...loanHistory,
      {
        date: new Date().toLocaleString(),
        type: "Debt Consolidation",
        keyMetric: "Monthly Payment",
        value: formatCurrency(monthlyPayment, currency),
      },
    ];
    setLoanHistory(newHistory);
    localStorage.setItem("personalLoanHistory", JSON.stringify(newHistory));

    alert("Charts and PDF export not implemented in this demo.");
  };

  const calculateComparison = (type, currency) => {
    if (type === "fixed") {
      const loanAmount = 10000;
      const interestRate = 6.5;
      const term = 3;
      const monthlyRate = interestRate / 100 / 12;
      const payments = term * 12;
      const monthlyPayment =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
        (Math.pow(1 + monthlyRate, payments) - 1);
      const totalInterest = (monthlyPayment * payments - loanAmount).toFixed(2);
      const totalCost = (parseFloat(totalInterest) + loanAmount).toFixed(2);
      return {
        monthlyPayment: formatCurrency(monthlyPayment, currency),
        totalInterest: formatCurrency(totalInterest, currency),
        totalCost: formatCurrency(totalCost, currency),
      };
    } else if (type === "variable") {
      const loanAmount = 10000;
      const rateCap = 10;
      const term = 3;
      const monthlyRate = rateCap / 100 / 12;
      const payments = term * 12;
      const monthlyPayment =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
        (Math.pow(1 + monthlyRate, payments) - 1);
      const totalInterest = (monthlyPayment * payments - loanAmount).toFixed(2);
      const totalCost = (parseFloat(totalInterest) + loanAmount).toFixed(2);
      return {
        monthlyPayment: formatCurrency(monthlyPayment, currency),
        totalInterest: formatCurrency(totalInterest, currency),
        totalCost: formatCurrency(totalCost, currency),
      };
    } else {
      const loanAmount = 15000;
      const interestRate = 5.5;
      const term = 4;
      const monthlyRate = interestRate / 100 / 12;
      const payments = term * 12;
      const monthlyPayment =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
        (Math.pow(1 + monthlyRate, payments) - 1);
      const totalInterest = (monthlyPayment * payments - loanAmount).toFixed(2);
      const totalCost = (parseFloat(totalInterest) + loanAmount).toFixed(2);
      return {
        monthlyPayment: formatCurrency(monthlyPayment, currency),
        totalInterest: formatCurrency(totalInterest, currency),
        totalCost: formatCurrency(totalCost, currency),
      };
    }
  };

  const debtsTotal = () => debts.reduce((sum, d) => sum + parseFloat(d.balance || 0), 0);

  const saveCalculation = () => {
    if (results) {
      setSuccessMessage("Calculation saved to history!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } else {
      setErrorMessage("No valid calculation to save.");
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Loan Type", "Key Metric", "Value"],
      ...loanHistory.map((h) => [h.date, h.type, h.keyMetric, h.value]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "personal_loan_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-start">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Personal Loan Calculator</h1>
        </div>
        <div className="flex border-b mb-6">
          {["fixed", "variable", "consolidation"].map((tab) => (
            <div
              key={tab}
              className={`tab p-3 cursor-pointer border-b-2 ${
                activeTab === tab ? "border-red-500 text-red-500" : "border-transparent"
              }`}
              onClick={() => switchTab(tab)}
            >
              {tab === "fixed"
                ? "Fixed-Rate Loan"
                : tab === "variable"
                ? "Variable-Rate Loan"
                : "Debt Consolidation"}
            </div>
          ))}
        </div>
        {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 text-sm mt-2">{successMessage}</div>}
        {activeTab === "fixed" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Fixed-Rate Loan Calculator</h2>
            <p className="text-sm text-gray-600">
              Calculate payments and costs for fixed-rate personal loans.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Currency",
                  id: "fixed-currency",
                  value: fixedCurrency,
                  setter: setFixedCurrency,
                  type: "select",
                  options: ["USD", "PKR", "INR"],
                  tooltip: "Choose your currency.",
                },
                {
                  label: "Loan Amount",
                  id: "fixed-loan-amount",
                  value: fixedLoanAmount,
                  setter: setFixedLoanAmount,
                  type: "number",
                  step: "0.01",
                  min: "0",
                  tooltip: "Principal loan amount.",
                },
                {
                  label: "Annual Interest Rate (%)",
                  id: "fixed-interest-rate",
                  value: fixedInterestRate,
                  setter: setFixedInterestRate,
                  type: "number",
                  step: "0.01",
                  min: "0",
                  tooltip: "Annual interest rate.",
                },
                {
                  label: "Loan Term (Years)",
                  id: "fixed-term",
                  value: fixedTerm,
                  setter: setFixedTerm,
                  type: "number",
                  step: "1",
                  min: "1",
                  tooltip: "Duration of the loan.",
                },
                {
                  label: "Prepayment Amount",
                  id: "fixed-prepayment",
                  value: fixedPrepayment,
                  setter: setFixedPrepayment,
                  type: "number",
                  step: "0.01",
                  min: "0",
                  tooltip: "Extra payment to reduce loan.",
                },
                {
                  label: "Annual Income",
                  id: "fixed-income",
                  value: fixedIncome,
                  setter: setFixedIncome,
                  type: "number",
                  step: "0.01",
                  min: "0",
                  tooltip: "Income for affordability analysis.",
                },
                {
                  label: "Tax Rate (%)",
                  id: "fixed-tax-rate",
                  value: fixedTaxRate,
                  setter: setFixedTaxRate,
                  type: "number",
                  step: "0.1",
                  min: "0",
                  tooltip: "Tax rate for affordability.",
                },
                {
                  label: "Start Date",
                  id: "fixed-start-date",
                  value: fixedStartDate,
                  setter: setFixedStartDate,
                  type: "date",
                  tooltip: "Loan start date.",
                },
              ].map((field) => (
                <div key={field.id} className="relative">
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-600 mb-2">
                    {field.label}
                    <span className="tooltip ml-1">
                      ?<span className="tooltiptext">{field.tooltip}</span>
                    </span>
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.id}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      step={field.step}
                      min={field.min}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => convertCurrency("fixed")}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Convert Currency
            </button>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={calculateFixed}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Calculate
              </button>
              <button
                onClick={() => saveCalculation("fixed")}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                Save Calculation
              </button>
            </div>
          </div>
        )}
        {activeTab === "variable" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Variable-Rate Loan Calculator</h2>
            <p className="text-sm text-gray-600">Evaluate loans with fluctuating interest rates.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Currency",
                  id: "variable-currency",
                  value: variableCurrency,
                  setter: setVariableCurrency,
                  type: "select",
                  options: ["USD", "PKR", "INR"],
                  tooltip: "Choose your currency.",
                },
                {
                  label: "Loan Amount",
                  id: "variable-loan-amount",
                  value: variableLoanAmount,
                  setter: setVariableLoanAmount,
                  type: "number",
                  step: "0.01",
                  min: "0",
                  tooltip: "Principal loan amount.",
                },
                {
                  label: "Initial Interest Rate (%)",
                  id: "variable-interest-rate",
                  value: variableInterestRate,
                  setter: setVariableInterestRate,
                  type: "number",
                  step: "0.01",
                  min: "0",
                  tooltip: "Starting annual interest rate.",
                },
                {
                  label: "Rate Adjustment Frequency",
                  id: "variable-adjustment-frequency",
                  value: variableAdjustmentFrequency,
                  setter: setVariableAdjustmentFrequency,
                  type: "select",
                  options: ["monthly", "quarterly", "annually"],
                  tooltip: "How often rate changes.",
                },
                {
                  label: "Rate Cap (%)",
                  id: "variable-rate-cap",
                  value: variableRateCap,
                  setter: setVariableRateCap,
                  type: "number",
                  step: "0.01",
                  min: "0",
                  tooltip: "Maximum interest rate.",
                },
                {
                  label: "Rate Floor (%)",
                  id: "variable-rate-floor",
                  value: variableRateFloor,
                  setter: setVariableRateFloor,
                  type: "number",
                  step: "0.01",
                  min: "0",
                  tooltip: "Minimum interest rate.",
                },
                {
                  label: "Loan Term (Years)",
                  id: "variable-term",
                  value: variableTerm,
                  setter: setVariableTerm,
                  type: "number",
                  step: "1",
                  min: "1",
                  tooltip: "Duration of the loan.",
                },
                {
                  label: "Annual Income",
                  id: "variable-income",
                  value: variableIncome,
                  setter: setVariableIncome,
                  type: "number",
                  step: "0.01",
                  min: "0",
                  tooltip: "Income for affordability analysis.",
                },
                {
                  label: "Tax Rate (%)",
                  id: "variable-tax-rate",
                  value: variableTaxRate,
                  setter: setVariableTaxRate,
                  type: "number",
                  step: "0.1",
                  min: "0",
                  tooltip: "Tax rate for affordability.",
                },
                {
                  label: "Start Date",
                  id: "variable-start-date",
                  value: variableStartDate,
                  setter: setVariableStartDate,
                  type: "date",
                  tooltip: "Loan start date.",
                },
              ].map((field) => (
                <div key={field.id} className="relative">
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-600 mb-2">
                    {field.label}
                    <span className="tooltip ml-1">
                      ?<span className="tooltiptext">{field.tooltip}</span>
                    </span>
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.id}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      step={field.step}
                      min={field.min}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => convertCurrency("variable")}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Convert Currency
            </button>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={calculateVariable}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Calculate
              </button>
              <button
                onClick={() => saveCalculation("variable")}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                Save Calculation
              </button>
            </div>
          </div>
        )}
        {activeTab === "consolidation" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Debt Consolidation Calculator</h2>
            <p className="text-sm text-gray-600">Assess consolidating multiple debts into a single loan.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Currency",
                  id: "consolidation-currency",
                  value: consolidationCurrency,
                  setter: setConsolidationCurrency,
                  type: "select",
                  options: ["USD", "PKR", "INR"],
                  tooltip: "Choose your currency.",
                },
                {
                  label: "New Loan Interest Rate (%)",
                  id: "consolidation-interest-rate",
                  value: consolidationInterestRate,
                  setter: setConsolidationInterestRate,
                  type: "number",
                  step: "0.01",
                  min: "0",
                  tooltip: "Interest rate for consolidated loan.",
                },
                {
                  label: "New Loan Term (Years)",
                  id: "consolidation-term",
                  value: consolidationTerm,
                  setter: setConsolidationTerm,
                  type: "number",
                  step: "1",
                  min: "1",
                  tooltip: "Duration of the new loan.",
                },
                {
                  label: "Annual Income",
                  id: "consolidation-income",
                  value: consolidationIncome,
                  setter: setConsolidationIncome,
                  type: "number",
                  step: "0.01",
                  min: "0",
                  tooltip: "Income for affordability analysis.",
                },
                {
                  label: "Tax Rate (%)",
                  id: "consolidation-tax-rate",
                  value: consolidationTaxRate,
                  setter: setConsolidationTaxRate,
                  type: "number",
                  step: "0.1",
                  min: "0",
                  tooltip: "Tax rate for affordability.",
                },
                {
                  label: "Start Date",
                  id: "consolidation-start-date",
                  value: consolidationStartDate,
                  setter: setConsolidationStartDate,
                  type: "date",
                  tooltip: "Loan start date.",
                },
              ].map((field) => (
                <div key={field.id} className="relative">
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-600 mb-2">
                    {field.label}
                    <span className="tooltip ml-1">
                      ?<span className="tooltiptext">{field.tooltip}</span>
                    </span>
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.id}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      step={field.step}
                      min={field.min}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Debts to Consolidate</h3>
              {debts.map((debt) => (
                <div key={debt.id} className="debt-entry grid grid-cols-1 md:grid-cols-5 gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Debt Name"
                    value={debt.name}
                    onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Balance"
                    value={debt.balance}
                    onChange={(e) => updateDebt(debt.id, "balance", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Interest Rate (%)"
                    value={debt.interestRate}
                    onChange={(e) => updateDebt(debt.id, "interestRate", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Monthly Payment"
                    value={debt.payment}
                    onChange={(e) => updateDebt(debt.id, "payment", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addDebt}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Add Debt
            </button>
            <button
              onClick={() => convertCurrency("consolidation")}
              className="mt-2 ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Convert Currency
            </button>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={calculateConsolidation}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Calculate
              </button>
              <button
                onClick={() => saveCalculation("consolidation")}
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
              {activeTab === "fixed" && (
                <>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Monthly Payment</h3>
                    <p className="text-xl font-bold text-gray-800">{results.monthlyPayment}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Total Interest</h3>
                    <p className="text-xl font-bold text-gray-800">{results.totalInterest}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">DTI</h3>
                    <p className="text-xl font-bold text-gray-800">{results.dti}</p>
                  </div>
                </>
              )}
              {activeTab === "variable" && (
                <>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Monthly Payment (Best/Worst)</h3>
                    <p className="text-xl font-bold text-gray-800">{`${results.monthlyPaymentBest} / ${results.monthlyPaymentWorst}`}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Total Interest (Best/Worst)</h3>
                    <p className="text-xl font-bold text-gray-800">{results.totalInterest}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">DTI</h3>
                    <p className="text-xl font-bold text-gray-800">{results.dti}</p>
                  </div>
                </>
              )}
              {activeTab === "consolidation" && (
                <>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">New Monthly Payment</h3>
                    <p className="text-xl font-bold text-gray-800">{results.monthlyPayment}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Total Interest</h3>
                    <p className="text-xl font-bold text-gray-800">{results.totalInterest}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Savings</h3>
                    <p className="text-xl font-bold text-gray-800">{results.savings}</p>
                  </div>
                </>
              )}
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Amortization Schedule</h3>
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
                  {schedule.map((s, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="p-2">{s.date}</td>
                      <td className="p-2">
                        {formatCurrency(
                          s.payment,
                          activeTab === "fixed"
                            ? fixedCurrency
                            : activeTab === "variable"
                            ? variableCurrency
                            : consolidationCurrency
                        )}
                      </td>
                      <td className="p-2">
                        {formatCurrency(
                          s.principal,
                          activeTab === "fixed"
                            ? fixedCurrency
                            : activeTab === "variable"
                            ? variableCurrency
                            : consolidationCurrency
                        )}
                      </td>
                      <td className="p-2">
                        {formatCurrency(
                          s.interest,
                          activeTab === "fixed"
                            ? fixedCurrency
                            : activeTab === "variable"
                            ? variableCurrency
                            : consolidationCurrency
                        )}
                      </td>
                      <td className="p-2">
                        {formatCurrency(
                          s.balance,
                          activeTab === "fixed"
                            ? fixedCurrency
                            : activeTab === "variable"
                            ? variableCurrency
                            : consolidationCurrency
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 overflow-x-auto">
              <h3 className="text-md font-medium text-gray-900">Loan Comparison</h3>
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
                  {[
                    {
                      type: "Fixed-Rate Loan",
                      data:
                        activeTab === "fixed"
                          ? {
                              monthlyPayment: results.monthlyPayment,
                              totalInterest: results.totalInterest,
                              totalCost: formatCurrency(
                                parseFloat(results.totalInterest.replace(/[^0-9.]/g, "")) +
                                  parseFloat(fixedLoanAmount),
                                fixedCurrency
                              ),
                            }
                          : calculateComparison("fixed", fixedCurrency),
                    },
                    {
                      type: "Variable-Rate Loan",
                      data:
                        activeTab === "variable"
                          ? {
                              monthlyPayment: results.monthlyPaymentWorst,
                              totalInterest: results.totalInterest.split(" - ")[1],
                              totalCost: formatCurrency(
                                parseFloat(results.totalInterest.split(" - ")[1].replace(/[^0-9.]/g, "")) +
                                  parseFloat(variableLoanAmount),
                                variableCurrency
                              ),
                            }
                          : calculateComparison("variable", variableCurrency),
                    },
                    {
                      type: "Debt Consolidation",
                      data:
                        activeTab === "consolidation"
                          ? {
                              monthlyPayment: results.monthlyPayment,
                              totalInterest: results.totalInterest,
                              totalCost: formatCurrency(
                                parseFloat(results.totalInterest.replace(/[^0-9.]/g, "")) + debtsTotal(),
                                consolidationCurrency
                              ),
                            }
                          : calculateComparison("consolidation", consolidationCurrency),
                    },
                  ].map((d, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="p-2">{d.type}</td>
                      <td className="p-2">{d.data.monthlyPayment}</td>
                      <td className="p-2">{d.data.totalInterest}</td>
                      <td className="p-2">{d.data.totalCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Loan Optimizer</h3>
              <p className="text-gray-600">{optimizer}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Risk Analysis</h3>
              <p className="text-gray-600">{riskAnalysis}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Calculation History</h3>
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
                  {loanHistory.map((h, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
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
                onClick={() => alert("PDF export not implemented in this demo.")}
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
        input:focus,
        select:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
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
