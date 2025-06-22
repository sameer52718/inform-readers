"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [calcMode, setCalcMode] = useState("loan");
  const [loanType, setLoanType] = useState("personal");
  const [amount, setAmount] = useState("10000");
  const [interestRate, setInterestRate] = useState("5");
  const [term, setTerm] = useState("36");
  const [downPayment, setDownPayment] = useState("0");
  const [downPaymentType, setDownPaymentType] = useState("amount");
  const [fees, setFees] = useState("500");
  const [salesTax, setSalesTax] = useState("8");
  const [tradeIn, setTradeIn] = useState("0");
  const [propertyTax, setPropertyTax] = useState("2000");
  const [insurance, setInsurance] = useState("1000");
  const [hoa, setHoa] = useState("200");
  const [minPayment, setMinPayment] = useState("3");
  const [balanceTransfer, setBalanceTransfer] = useState("0");
  const [extraMonthly, setExtraMonthly] = useState("0");
  const [extraOneTime, setExtraOneTime] = useState("0");
  const [extraOneTimeMonth, setExtraOneTimeMonth] = useState("1");
  const [contribution, setContribution] = useState("100");
  const [compoundFreq, setCompoundFreq] = useState("monthly");
  const [goalAmount, setGoalAmount] = useState("20000");
  const [monthlyIncome, setMonthlyIncome] = useState("4000");
  const [fixedExpenses, setFixedExpenses] = useState("1500");
  const [variableExpenses, setVariableExpenses] = useState("1000");
  const [savingsRate, setSavingsRate] = useState("20");
  const [startDate, setStartDate] = useState("2025-05-01");
  const [currency, setCurrency] = useState("USD");
  const [income, setIncome] = useState("50000");
  const [dti, setDti] = useState("36");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [activeSections, setActiveSections] = useState({
    loanDetails: false,
    extraPayments: false,
    investmentSavings: false,
    budget: false,
    advanced: false,
  });

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[curr]} ${parseFloat(amount || 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  };

  const toggleSection = (section) => {
    setActiveSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (calcMode === "loan") {
      const loanSpecific = calcMode === "loan";
      const autoSpecific = loanType === "auto";
      const mortgageSpecific = loanType === "mortgage";
      const creditSpecific = loanType === "credit";
      setActiveSections((prev) => ({
        ...prev,
        loanDetails: loanSpecific && prev.loanDetails,
        extraPayments: loanSpecific && prev.extraPayments,
        investmentSavings: false,
        budget: false,
      }));
    } else {
      setActiveSections((prev) => ({
        ...prev,
        loanDetails: false,
        extraPayments: false,
        investmentSavings: ["investment", "savings"].includes(calcMode),
        budget: calcMode === "budget",
      }));
    }
  }, [calcMode, loanType]);

  const calculateFinance = () => {
    setError("");
    setStatus("");
    setResults(null);

    const parsed = {
      amount: parseFloat(amount) || 0,
      interestRate: parseFloat(interestRate) || 0,
      term: parseInt(term) || 0,
      downPayment: parseFloat(downPayment) || 0,
      fees: parseFloat(fees) || 0,
      salesTax: parseFloat(salesTax) || 0,
      tradeIn: parseFloat(tradeIn) || 0,
      propertyTax: parseFloat(propertyTax) || 0,
      insurance: parseFloat(insurance) || 0,
      hoa: parseFloat(hoa) || 0,
      minPayment: parseFloat(minPayment) || 3,
      balanceTransfer: parseFloat(balanceTransfer) || 0,
      extraMonthly: parseFloat(extraMonthly) || 0,
      extraOneTime: parseFloat(extraOneTime) || 0,
      extraOneTimeMonth: parseInt(extraOneTimeMonth) || 1,
      contribution: parseFloat(contribution) || 0,
      goalAmount: parseFloat(goalAmount) || 0,
      monthlyIncome: parseFloat(monthlyIncome) || 0,
      fixedExpenses: parseFloat(fixedExpenses) || 0,
      variableExpenses: parseFloat(variableExpenses) || 0,
      savingsRate: parseFloat(savingsRate) || 0,
      income: parseFloat(income) || 0,
      dti: parseFloat(dti) || 36,
    };

    if (parsed.amount < 100) {
      setError("Amount must be at least 100");
      return;
    }
    if (parsed.interestRate < 0.1 || parsed.interestRate > 30) {
      setError("Interest rate must be between 0.1% and 30%");
      return;
    }
    if (parsed.term < 1 || parsed.term > 360) {
      setError("Term must be between 1 and 360 months");
      return;
    }

    try {
      if (calcMode === "loan") {
        if (downPaymentType === "percent") {
          if (parsed.downPayment < 0 || parsed.downPayment > 100) {
            setError("Down payment percentage must be between 0% and 100%");
            return;
          }
          parsed.downPayment = (parsed.downPayment / 100) * parsed.amount;
        }
        if (
          parsed.downPayment < 0 ||
          parsed.fees < 0 ||
          parsed.tradeIn < 0 ||
          parsed.salesTax < 0 ||
          parsed.propertyTax < 0 ||
          parsed.insurance < 0 ||
          parsed.hoa < 0 ||
          parsed.balanceTransfer < 0
        ) {
          setError("Inputs cannot be negative");
          return;
        }
        if (parsed.salesTax > 20) {
          setError("Sales tax must be between 0% and 20%");
          return;
        }
        if (loanType === "credit" && parsed.minPayment < 1) {
          setError("Minimum payment must be at least 1%");
          return;
        }

        let principal = parsed.amount;
        if (loanType === "auto") {
          const taxableAmount = parsed.amount - parsed.tradeIn;
          const taxAmount = taxableAmount * (parsed.salesTax / 100);
          principal = parsed.amount + taxAmount + parsed.fees - parsed.downPayment - parsed.tradeIn;
        } else if (loanType === "mortgage") {
          principal = parsed.amount;
        } else if (loanType === "personal") {
          principal = parsed.amount + parsed.fees - parsed.downPayment;
        } else if (loanType === "credit") {
          principal = parsed.amount + parsed.balanceTransfer;
        }

        let monthlyPayment = 0;
        let totalInterest = 0;
        const amortization = [];
        let monthsSaved = 0;
        let currentDate = new Date(startDate);
        const monthlyRate = parsed.interestRate / 100 / 12;

        if (loanType === "credit") {
          let remainingBalance = principal;
          let month = 1;
          while (remainingBalance > 0 && month <= 360) {
            const interest = remainingBalance * monthlyRate;
            const minPaymentAmount = Math.max(remainingBalance * (parsed.minPayment / 100), 20);
            const payment = Math.max(minPaymentAmount, monthlyPayment + parsed.extraMonthly);
            const principalPayment = payment - interest;
            let extra = month === parsed.extraOneTimeMonth ? parsed.extraOneTime : 0;
            remainingBalance -= principalPayment + extra;
            totalInterest += interest;
            if (remainingBalance < 0) remainingBalance = 0;
            amortization.push({
              month,
              date: new Date(currentDate),
              payment: payment + extra,
              principal: principalPayment,
              interest,
              extra,
              balance: remainingBalance,
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
            if (remainingBalance <= 0) {
              monthsSaved = parsed.term - month;
              break;
            }
            month++;
          }
          monthlyPayment = amortization[0].payment - (amortization[0].extra || 0);
        } else {
          monthlyPayment =
            (principal * (monthlyRate * Math.pow(1 + monthlyRate, parsed.term))) /
            (Math.pow(1 + monthlyRate, parsed.term) - 1);
          let remainingBalance = principal;
          for (let month = 1; month <= parsed.term && remainingBalance > 0; month++) {
            let extra = parsed.extraMonthly + (month === parsed.extraOneTimeMonth ? parsed.extraOneTime : 0);
            const interest = remainingBalance * monthlyRate;
            const principalPayment = monthlyPayment - interest;
            remainingBalance -= principalPayment + extra;
            totalInterest += interest;
            if (remainingBalance < 0) remainingBalance = 0;
            amortization.push({
              month,
              date: new Date(currentDate),
              payment: monthlyPayment + extra,
              principal: principalPayment,
              interest,
              extra,
              balance: remainingBalance,
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
            if (remainingBalance <= 0) {
              monthsSaved = parsed.term - month;
              break;
            }
          }
        }

        if (loanType === "mortgage") {
          monthlyPayment += (parsed.propertyTax + parsed.insurance) / 12 + parsed.hoa;
          amortization.forEach((entry) => {
            entry.payment += (parsed.propertyTax + parsed.insurance) / 12 + parsed.hoa;
          });
        }

        const payoffDate = amortization[amortization.length - 1].date;
        const totalCost =
          principal +
          totalInterest +
          (loanType === "mortgage"
            ? (parsed.propertyTax + parsed.insurance) * (parsed.term / 12) + parsed.hoa * parsed.term
            : 0);
        const affordability = (parsed.income * (parsed.dti / 100)) / 12;

        setResults({
          summaryMetrics: [
            { label: "Monthly Payment", value: formatCurrency(monthlyPayment) },
            { label: "Total Interest", value: formatCurrency(totalInterest) },
            { label: "Total Cost", value: formatCurrency(totalCost) },
            { label: "Payoff Date", value: payoffDate.toLocaleDateString("en-US") },
            { label: "Months Saved", value: monthsSaved },
            { label: "Affordable Payment", value: formatCurrency(affordability) },
          ],
          detailedItems: amortization,
          detailedHeaders: [
            { label: "Month", type: "number" },
            { label: "Date", type: "date" },
            { label: "Payment", type: "currency" },
            { label: "Principal", type: "currency" },
            { label: "Interest", type: "currency" },
            { label: "Extra", type: "currency" },
            { label: "Balance", type: "currency" },
          ],
          csvData: amortization.map((entry) => ({
            Month: entry.month,
            Date: entry.date.toLocaleDateString("en-US"),
            Payment: entry.payment.toFixed(2),
            Principal: entry.principal.toFixed(2),
            Interest: entry.interest.toFixed(2),
            Extra: entry.extra.toFixed(2),
            Balance: entry.balance.toFixed(2),
          })),
          csvFilename: "amortization_schedule.csv",
        });

        alert("Chart not implemented in this demo.");
      } else if (calcMode === "investment") {
        const periodsPerYear = { monthly: 12, quarterly: 4, annually: 1 }[compoundFreq];
        const rate = parsed.interestRate / 100 / periodsPerYear;
        const periods = parsed.term * periodsPerYear;

        let futureValue = parsed.amount;
        let totalContributions = parsed.contribution * parsed.term;
        for (let i = 0; i < periods; i++) {
          futureValue = futureValue * (1 + rate) + parsed.contribution / periodsPerYear;
        }
        const interestEarned = futureValue - parsed.amount - totalContributions;

        setResults({
          summaryMetrics: [
            { label: "Future Value", value: formatCurrency(futureValue) },
            { label: "Total Contributions", value: formatCurrency(totalContributions) },
            { label: "Interest Earned", value: formatCurrency(interestEarned) },
          ],
          detailedItems: [],
          detailedHeaders: [],
          csvData: [],
          csvFilename: "",
        });

        alert("Chart not implemented in this demo.");
      } else if (calcMode === "savings") {
        const periodsPerYear = { monthly: 12, quarterly: 4, annually: 1 }[compoundFreq];
        const rate = parsed.interestRate / 100 / periodsPerYear;

        let monthsToGoal = 0;
        let currentValue = parsed.amount;
        while (currentValue < parsed.goalAmount && monthsToGoal < 360) {
          currentValue = currentValue * (1 + rate) + parsed.contribution / periodsPerYear;
          monthsToGoal++;
        }
        const yearsToGoal = monthsToGoal / 12;

        setResults({
          summaryMetrics: [
            { label: "Months to Goal", value: monthsToGoal },
            { label: "Years to Goal", value: yearsToGoal.toFixed(1) },
            { label: "Final Value", value: formatCurrency(currentValue) },
          ],
          detailedItems: [],
          detailedHeaders: [],
          csvData: [],
          csvFilename: "",
        });

        alert("Chart not implemented in this demo.");
      } else if (calcMode === "budget") {
        if (parsed.savingsRate < 0 || parsed.savingsRate > 100) {
          setError("Savings rate must be between 0% and 100%");
          return;
        }

        const savings = parsed.monthlyIncome * (parsed.savingsRate / 100);
        const totalExpenses = parsed.fixedExpenses + parsed.variableExpenses;
        const surplus = parsed.monthlyIncome - totalExpenses - savings;

        const expenses = [
          { category: "Fixed Expenses", amount: parsed.fixedExpenses },
          { category: "Variable Expenses", amount: parsed.variableExpenses },
          { category: "Savings", amount: savings },
        ];

        setResults({
          summaryMetrics: [
            { label: "Monthly Income", value: formatCurrency(parsed.monthlyIncome) },
            { label: "Total Expenses", value: formatCurrency(totalExpenses) },
            { label: "Savings", value: formatCurrency(savings) },
            { label: "Surplus/Deficit", value: formatCurrency(surplus) },
          ],
          detailedItems: expenses,
          detailedHeaders: [
            { label: "Category", type: "text" },
            { label: "Amount", type: "currency" },
          ],
          csvData: expenses.map((exp) => ({
            Category: exp.category,
            Amount: exp.amount.toFixed(2),
          })),
          csvFilename: "budget_breakdown.csv",
        });

        alert("Chart not implemented in this demo.");
      }
    } catch (error) {
      setError("Error calculating finance. Check console for details.");
      console.error("Calculation error:", error);
    }
  };

  const sortDetailedTable = (index) => {
    if (!results || !results.detailedItems.length) return;
    const header = results.detailedHeaders[index];
    const isAscending = results.sortOrder?.index === index && results.sortOrder?.direction === "asc";
    const direction = isAscending ? "desc" : "asc";
    const sortedItems = [...results.detailedItems].sort((a, b) => {
      let aValue, bValue;
      if (calcMode === "loan") {
        aValue = a[Object.keys(a)[index]];
        bValue = b[Object.keys(b)[index]];
      } else {
        aValue = a[header.label.toLowerCase()];
        bValue = b[header.label.toLowerCase()];
      }
      if (header.type === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      } else if (header.type === "date") {
        return direction === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      } else if (header.type === "currency") {
        const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ""));
        const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ""));
        return direction === "asc" ? aNum - bNum : bNum - aNum;
      } else {
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
    });
    setResults({
      ...results,
      detailedItems: sortedItems,
      sortOrder: { index, direction },
    });
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4 relative">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        🌙 Toggle Theme
      </button>
      <div
        className={`bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-xl w-full transition-transform hover:-translate-y-1 ${
          isDarkMode ? "dark:bg-gray-800" : ""
        }`}
      >
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Advanced Finance Calculator</h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {status && <div className="text-yellow-400 text-center mb-4">{status}</div>}

        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Calculation Mode
          </label>
          <select
            value={calcMode}
            onChange={(e) => setCalcMode(e.target.value)}
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          >
            <option value="loan">Loan Amortization</option>
            <option value="investment">Investment Growth</option>
            <option value="savings">Savings Goal</option>
            <option value="budget">Budget Planner</option>
          </select>

          {calcMode === "loan" && (
            <>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
                Loan Type
              </label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="personal">Personal Loan</option>
                <option value="auto">Auto Loan</option>
                <option value="mortgage">Mortgage</option>
                <option value="credit">Credit Card</option>
              </select>
            </>
          )}

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
            Amount (Loan, Investment, Savings)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="100"
            step="100"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />
          <input
            type="range"
            min="100"
            max="1000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="100"
            className="w-full mt-2 accent-red-500"
          />

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            min="0.1"
            max="30"
            step="0.1"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />
          <input
            type="range"
            min="0.1"
            max="30"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            step="0.1"
            className="w-full mt-2 accent-red-500"
          />

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
            Term (Months)
          </label>
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            min="1"
            max="360"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />
          <input
            type="range"
            min="1"
            max="360"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full mt-2 accent-red-500"
          />
        </div>

        {[
          {
            title: "Loan Details",
            section: "loanDetails",
            visible: calcMode === "loan",
            inputs: [
              {
                label: "Down Payment",
                value: downPayment,
                setter: setDownPayment,
                type: "number",
                min: "0",
              },
              {
                label: "Down Payment Type",
                value: downPaymentType,
                setter: setDownPaymentType,
                type: "select",
                options: ["amount", "percent"],
              },
              {
                label: "Fees (Origination, Processing)",
                value: fees,
                setter: setFees,
                type: "number",
                min: "0",
              },
              {
                label: "Sales Tax (%)",
                value: salesTax,
                setter: setSalesTax,
                type: "number",
                min: "0",
                max: "20",
                step: "0.1",
                visible: loanType === "auto",
              },
              {
                label: "Trade-In Value",
                value: tradeIn,
                setter: setTradeIn,
                type: "number",
                min: "0",
                visible: loanType === "auto",
              },
              {
                label: "Property Tax (Annual)",
                value: propertyTax,
                setter: setPropertyTax,
                type: "number",
                min: "0",
                visible: loanType === "mortgage",
              },
              {
                label: "Home Insurance (Annual)",
                value: insurance,
                setter: setInsurance,
                type: "number",
                min: "0",
                visible: loanType === "mortgage",
              },
              {
                label: "HOA Fees (Monthly)",
                value: hoa,
                setter: setHoa,
                type: "number",
                min: "0",
                visible: loanType === "mortgage",
              },
              {
                label: "Minimum Payment (% of Balance)",
                value: minPayment,
                setter: setMinPayment,
                type: "number",
                min: "1",
                max: "10",
                step: "0.1",
                visible: loanType === "credit",
              },
              {
                label: "Balance Transfer Fee",
                value: balanceTransfer,
                setter: setBalanceTransfer,
                type: "number",
                min: "0",
                visible: loanType === "credit",
              },
            ],
          },
          {
            title: "Extra Payments",
            section: "extraPayments",
            visible: calcMode === "loan",
            inputs: [
              {
                label: "Extra Monthly Payment",
                value: extraMonthly,
                setter: setExtraMonthly,
                type: "number",
                min: "0",
              },
              {
                label: "One-Time Extra Payment",
                value: extraOneTime,
                setter: setExtraOneTime,
                type: "number",
                min: "0",
              },
              {
                label: "Month of One-Time Payment",
                value: extraOneTimeMonth,
                setter: setExtraOneTimeMonth,
                type: "number",
                min: "1",
              },
            ],
          },
          {
            title: "Investment/Savings Details",
            section: "investmentSavings",
            visible: ["investment", "savings"].includes(calcMode),
            inputs: [
              {
                label: "Monthly Contribution",
                value: contribution,
                setter: setContribution,
                type: "number",
                min: "0",
              },
              {
                label: "Compounding Frequency",
                value: compoundFreq,
                setter: setCompoundFreq,
                type: "select",
                options: ["monthly", "quarterly", "annually"],
              },
              {
                label: "Savings Goal",
                value: goalAmount,
                setter: setGoalAmount,
                type: "number",
                min: "100",
                visible: calcMode === "savings",
              },
            ],
          },
          {
            title: "Budget Details",
            section: "budget",
            visible: calcMode === "budget",
            inputs: [
              {
                label: "Monthly Income",
                value: monthlyIncome,
                setter: setMonthlyIncome,
                type: "number",
                min: "0",
              },
              {
                label: "Fixed Expenses (Rent, Utilities)",
                value: fixedExpenses,
                setter: setFixedExpenses,
                type: "number",
                min: "0",
              },
              {
                label: "Variable Expenses (Food, Entertainment)",
                value: variableExpenses,
                setter: setVariableExpenses,
                type: "number",
                min: "0",
              },
              {
                label: "Savings Rate (%)",
                value: savingsRate,
                setter: setSavingsRate,
                type: "number",
                min: "0",
                max: "100",
              },
            ],
          },
          {
            title: "Advanced Options",
            section: "advanced",
            visible: true,
            inputs: [
              {
                label: "Start Date",
                value: startDate,
                setter: setStartDate,
                type: "date",
              },
              {
                label: "Currency",
                value: currency,
                setter: setCurrency,
                type: "select",
                options: ["USD", "EUR", "INR"],
              },
              {
                label: "Annual Income",
                value: income,
                setter: setIncome,
                type: "number",
                min: "0",
              },
              {
                label: "Debt-to-Income Ratio (%)",
                value: dti,
                setter: setDti,
                type: "number",
                min: "0",
                max: "100",
              },
            ],
          },
        ].map(
          ({ title, section, inputs, visible }) =>
            visible && (
              <div key={section} className="mb-4">
                <div
                  onClick={() => toggleSection(section)}
                  className="bg-red-500 text-white p-3 rounded-lg text-center cursor-pointer hover:bg-red-600"
                >
                  {title}
                </div>
                <div
                  className={`transition-all duration-300 ${activeSections[section] ? "block" : "hidden"}`}
                >
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mt-2">
                    {inputs.map(
                      ({ label, value, setter, type = "number", options, min, max, step, visible = true }) =>
                        visible && (
                          <div key={label} className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                              {label}
                            </label>
                            {type === "select" ? (
                              <select
                                value={value}
                                onChange={(e) => setter(e.target.value)}
                                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
                              >
                                {options.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt === "amount"
                                      ? "Amount"
                                      : opt === "percent"
                                      ? "Percent (%)"
                                      : opt === "USD"
                                      ? "$ USD"
                                      : opt === "EUR"
                                      ? "€ EUR"
                                      : opt === "INR"
                                      ? "₹ INR"
                                      : opt.charAt(0).toUpperCase() + opt.slice(1)}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={type}
                                value={value}
                                onChange={(e) => setter(e.target.value)}
                                min={min}
                                max={max}
                                step={step}
                                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
                              />
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            )
        )}

        <button
          onClick={calculateFinance}
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:scale-105 transition-transform"
        >
          Calculate
        </button>

        {results && (
          <div className="mt-6">
            <table className="w-full border-collapse bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3">Metric</th>
                  <th className="p-3">Value</th>
                </tr>
              </thead>
              <tbody>
                {results.summaryMetrics.map((metric, i) => (
                  <tr key={metric.label} className={i % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : ""}>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{metric.label}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{metric.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {results.detailedItems.length > 0 && (
              <table className="w-full border-collapse bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mt-6 max-h-80 overflow-y-auto block">
                <thead>
                  <tr className="bg-red-500 text-white">
                    {results.detailedHeaders.map((header, index) => (
                      <th
                        key={header.label}
                        onClick={() => sortDetailedTable(index)}
                        className="p-3 cursor-pointer hover:bg-red-600"
                      >
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.detailedItems.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : ""}>
                      {results.detailedHeaders.map((header, j) => (
                        <td key={j} className="p-3 text-gray-700 dark:text-gray-300">
                          {calcMode === "loan"
                            ? header.label === "Date"
                              ? item.date.toLocaleDateString("en-US")
                              : header.type === "currency"
                              ? formatCurrency(item[header.label.toLowerCase()])
                              : item[header.label.toLowerCase()]
                            : header.label === "Amount"
                            ? formatCurrency(item.amount)
                            : item.category}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-6">
              <p className="text-gray-600 dark:text-gray-300">Chart not implemented in this demo.</p>
            </div>

            {results.csvData.length > 0 && (
              <div className="mt-6 text-center">
                <a
                  href={`data:text/csv;charset=utf-8,${Object.keys(results.csvData[0]).join(
                    ","
                  )}\n${results.csvData.map((row) => Object.values(row).join(",")).join("\n")}`}
                  download={results.csvFilename}
                  className="text-red-500 hover:underline"
                >
                  Download {calcMode === "loan" ? "Amortization Schedule" : "Budget Breakdown"}
                </a>
              </div>
            )}
          </div>
        )}

        <style jsx>{`
          .transition-transform:hover {
            transform: translateY(-5px);
          }
          @media (max-width: 640px) {
            .max-w-xl {
              max-width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
