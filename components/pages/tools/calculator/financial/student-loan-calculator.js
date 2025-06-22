"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [loans, setLoans] = useState([
    {
      loanAmount: "20000",
      interestRate: "6.53",
      loanTerm: "10",
      loanType: "federal",
      extraPayment: "0",
      gracePeriod: "6",
      id: 1,
    },
  ]);
  const [otherInputs, setOtherInputs] = useState({
    repaymentPlan: "standard",
    idrPlan: "none",
    annualIncome: "50000",
    refinanceRate: "5.0",
    currency: "USD",
    pslf: "no",
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [results, setResults] = useState(null);
  const [amortizationSchedules, setAmortizationSchedules] = useState([]);
  const [showAmortization, setShowAmortization] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [error, setError] = useState("");
  const balanceChartRef = useRef(null);
  const interestChartRef = useRef(null);
  let balanceChart, interestChart;

  const exchangeRates = { USD: 1, EUR: 0.95, GBP: 0.8 };
  const currencySymbols = { USD: "$", EUR: "€", GBP: "£" };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      setIsDarkMode(savedTheme === "dark");
      if (savedTheme === "dark") document.documentElement.classList.add("dark");

      const savedData = JSON.parse(localStorage.getItem("loanData"));
      if (savedData) {
        setLoans(savedData.loans.map((loan, index) => ({ ...loan, id: index + 1 })));
        setOtherInputs(savedData.otherInputs);
      }
    }

    if (balanceChartRef.current) {
      balanceChart = new Chart(balanceChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [{ label: "Loan Balance", data: [], borderColor: "#4f46e5", fill: false }],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Month" } },
            y: { title: { display: true, text: "Balance" } },
          },
        },
      });
    }
    if (interestChartRef.current) {
      interestChart = new Chart(interestChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [{ label: "Monthly Interest", data: [], borderColor: "#e11d48", fill: false }],
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
    return () => {
      balanceChart?.destroy();
      interestChart?.destroy();
    };
  }, []);

  const formatCurrency = (amount, currency) => {
    return `${currencySymbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  const addLoanForm = () => {
    setLoans([
      ...loans,
      {
        loanAmount: "20000",
        interestRate: "6.53",
        loanTerm: "10",
        loanType: "federal",
        extraPayment: "0",
        gracePeriod: "6",
        id: loans.length + 1,
      },
    ]);
  };

  const removeLoan = (id) => {
    setLoans(loans.filter((loan) => loan.id !== id));
  };

  const updateLoan = (id, field, value) => {
    setLoans(loans.map((loan) => (loan.id === id ? { ...loan, [field]: value } : loan)));
  };

  const updateOtherInput = (field, value) => {
    setOtherInputs((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  const validateInputs = (loans, repaymentPlan, idrPlan, annualIncome) => {
    const errors = [];
    if (loans.length === 0) errors.push("Add at least one loan.");
    loans.forEach((loan) => {
      if (parseFloat(loan.loanAmount) <= 0 || isNaN(loan.loanAmount))
        errors.push(`Loan ${loan.id}: Invalid loan amount.`);
      if (parseFloat(loan.interestRate) < 0 || isNaN(loan.interestRate))
        errors.push(`Loan ${loan.id}: Invalid interest rate.`);
      if (parseFloat(loan.loanTerm) <= 0 || isNaN(loan.loanTerm))
        errors.push(`Loan ${loan.id}: Invalid loan term.`);
      if (parseFloat(loan.extraPayment) < 0 || isNaN(loan.extraPayment))
        errors.push(`Loan ${loan.id}: Invalid extra payment.`);
      if (parseFloat(loan.gracePeriod) < 0 || isNaN(loan.gracePeriod))
        errors.push(`Loan ${loan.id}: Invalid grace period.`);
    });
    if (repaymentPlan === "idr" && idrPlan === "none")
      errors.push("Select an IDR plan for income-driven repayment.");
    if (repaymentPlan === "idr" && (parseFloat(annualIncome) <= 0 || isNaN(annualIncome)))
      errors.push("Enter a valid annual income for IDR.");
    return errors;
  };

  const calculateStandardPayment = (balance, monthlyRate, term) => {
    if (monthlyRate === 0) return balance / term;
    const payment = (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
    return isFinite(payment) && payment > 0 ? payment : 0;
  };

  const processGracePeriod = (loan, balance, monthlyRate) => {
    let graceInterest = 0;
    if (loan.loanType === "federal" && parseFloat(loan.gracePeriod) > 0) {
      graceInterest = balance * monthlyRate * parseFloat(loan.gracePeriod);
      balance += graceInterest;
    }
    return { balance, graceInterest };
  };

  const calculateMonthlyPayment = (
    loan,
    balance,
    monthlyRate,
    term,
    repaymentPlan,
    idrPlan,
    annualIncome
  ) => {
    let monthlyPayment = 0;
    let adjustedTerm = term;
    let graduatedFactor = 0.5;

    const standardPayment = calculateStandardPayment(balance, monthlyRate, term);

    if (repaymentPlan === "standard") {
      monthlyPayment = standardPayment;
    } else if (repaymentPlan === "graduated") {
      monthlyPayment = standardPayment * graduatedFactor;
      adjustedTerm = Math.min(term * 2, 360);
    } else if (repaymentPlan === "extended") {
      adjustedTerm = 300;
      monthlyPayment = calculateStandardPayment(balance, monthlyRate, adjustedTerm);
    } else if (repaymentPlan === "idr" && loan.loanType === "federal") {
      const discretionaryIncome = Math.max(parseFloat(annualIncome) - 15000, 0) * 0.15;
      if (idrPlan === "ibr") {
        monthlyPayment = Math.min((discretionaryIncome * 0.15) / 12, standardPayment);
      } else if (idrPlan === "paye" || idrPlan === "save") {
        monthlyPayment = Math.min((discretionaryIncome * 0.1) / 12, standardPayment);
      }
      adjustedTerm = idrPlan === "save" ? 240 : 300;
    } else {
      monthlyPayment = standardPayment;
    }

    return {
      monthlyPayment: isFinite(monthlyPayment) && monthlyPayment > 0 ? monthlyPayment : standardPayment,
      adjustedTerm,
    };
  };

  const generateAmortizationSchedule = (
    loan,
    balance,
    monthlyRate,
    monthlyPayment,
    term,
    repaymentPlan,
    pslf,
    exchangeRate,
    standardPayment
  ) => {
    const schedule = [];
    let month = 1;
    let loanInterest = 0;
    let graduatedFactor = 0.5;

    while (balance > 0.01 && month <= term) {
      const interest = balance * monthlyRate;
      let payment = monthlyPayment + parseFloat(loan.extraPayment);

      if (repaymentPlan === "graduated" && month % 24 === 1 && month > 1) {
        graduatedFactor += 0.25;
        monthlyPayment = standardPayment * graduatedFactor;
        payment = monthlyPayment + parseFloat(loan.extraPayment);
      }

      const principal = Math.min(payment - interest, balance);
      if (principal < 0) payment = interest + balance;
      balance -= principal;
      loanInterest += interest;

      schedule.push({
        loanId: loan.id,
        month,
        payment: (payment / exchangeRate).toFixed(2),
        principal: (principal / exchangeRate).toFixed(2),
        interest: (interest / exchangeRate).toFixed(2),
        balance: (balance / exchangeRate).toFixed(2),
      });

      if (pslf && loan.loanType === "federal" && month === 120) {
        balance = 0;
        schedule[schedule.length - 1].balance = "0.00";
      }

      month++;
      if (month > 1000) break;
    }

    return { schedule, loanInterest, months: month - 1 };
  };

  const calculateRefinancing = (loans, refinanceRate, exchangeRate) => {
    const totalLoanAmount = loans.reduce((sum, loan) => sum + parseFloat(loan.loanAmount), 0);
    const term = parseFloat(loans[0].loanTerm) * 12;
    const monthlyRate = parseFloat(refinanceRate) / 100 / 12;
    const refinancePayment =
      monthlyRate === 0
        ? totalLoanAmount / term
        : isFinite((totalLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term)))
        ? (totalLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term))
        : 0;
    let refinanceInterest = 0;
    let refinanceBalance = totalLoanAmount;

    for (let i = 1; i <= term; i++) {
      const interest = refinanceBalance * monthlyRate;
      refinanceBalance -= refinancePayment - interest;
      refinanceInterest += interest;
    }

    return {
      refinancePayment: refinancePayment / exchangeRate,
      refinanceInterest: refinanceInterest / exchangeRate,
    };
  };

  const calculateForgivenessTax = (schedules, repaymentPlan, idrPlan, pslf, exchangeRate) => {
    let forgivenessTax = 0;
    if (
      pslf &&
      schedules.some(
        (schedule) =>
          schedule[0]?.loanId && loans.find((loan) => loan.id === schedule[0].loanId)?.loanType === "federal"
      )
    ) {
      forgivenessTax = 0;
    } else if (repaymentPlan === "idr" && idrPlan !== "none") {
      const forgivenAmount = schedules.reduce(
        (sum, schedule) => sum + parseFloat(schedule[schedule.length - 1]?.balance || 0) * exchangeRate,
        0
      );
      forgivenessTax = forgivenAmount * 0.37;
    }
    return forgivenessTax / exchangeRate;
  };

  const calculateLoan = () => {
    const exchangeRate = exchangeRates[otherInputs.currency] || 1;
    const currencySymbol = currencySymbols[otherInputs.currency] || "$";
    const pslf = otherInputs.pslf === "yes";

    const errors = validateInputs(
      loans,
      otherInputs.repaymentPlan,
      otherInputs.idrPlan,
      otherInputs.annualIncome
    );
    if (errors.length > 0) {
      setError(errors.join("<br>"));
      setResults(null);
      return;
    } else {
      setError("");
    }

    localStorage.setItem("loanData", JSON.stringify({ loans, otherInputs }));

    let totalMonthlyPayment = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    let maxMonths = 0;
    const newSchedules = [];
    const chartData = { [otherInputs.repaymentPlan]: [] };

    loans.forEach((loan) => {
      let balance = parseFloat(loan.loanAmount);
      const monthlyRate = parseFloat(loan.interestRate) / 100 / 12;

      const { balance: newBalance, graceInterest } = processGracePeriod(loan, balance, monthlyRate);
      balance = newBalance;
      totalInterest += graceInterest;

      const { monthlyPayment, adjustedTerm } = calculateMonthlyPayment(
        loan,
        balance,
        monthlyRate,
        parseFloat(loan.loanTerm) * 12,
        otherInputs.repaymentPlan,
        otherInputs.idrPlan,
        parseFloat(otherInputs.annualIncome)
      );

      const standardPayment = calculateStandardPayment(balance, monthlyRate, parseFloat(loan.loanTerm) * 12);
      const { schedule, loanInterest, months } = generateAmortizationSchedule(
        loan,
        balance,
        monthlyRate,
        monthlyPayment,
        adjustedTerm,
        otherInputs.repaymentPlan,
        pslf,
        exchangeRate,
        standardPayment
      );

      totalMonthlyPayment += monthlyPayment + parseFloat(loan.extraPayment);
      totalInterest += loanInterest;
      totalPaid += loanInterest + parseFloat(loan.loanAmount);
      maxMonths = Math.max(maxMonths, months);
      newSchedules.push(schedule);

      schedule.forEach((row) => {
        if (!chartData[otherInputs.repaymentPlan][row.month - 1]) {
          chartData[otherInputs.repaymentPlan][row.month - 1] = { month: row.month, balance: 0, interest: 0 };
        }
        chartData[otherInputs.repaymentPlan][row.month - 1].balance += parseFloat(row.balance) * exchangeRate;
        chartData[otherInputs.repaymentPlan][row.month - 1].interest +=
          parseFloat(row.interest) * exchangeRate;
      });
    });

    const { refinancePayment, refinanceInterest } = calculateRefinancing(
      loans,
      parseFloat(otherInputs.refinanceRate),
      exchangeRate
    );
    const forgivenessTax = calculateForgivenessTax(
      newSchedules,
      otherInputs.repaymentPlan,
      otherInputs.idrPlan,
      pslf,
      exchangeRate
    );

    setResults({
      totalMonthlyPayment: totalMonthlyPayment / exchangeRate,
      totalInterest: totalInterest / exchangeRate,
      totalPaid: totalPaid / exchangeRate,
      payoffTime: `${maxMonths} months`,
      refinancePayment: refinancePayment,
      refinanceInterest: refinanceInterest,
      ...(forgivenessTax > 0 ? { estimatedForgivenessTax: forgivenessTax } : {}),
    });
    setAmortizationSchedules(newSchedules);

    if (balanceChart) {
      balanceChart.data.labels = Array.from({ length: maxMonths }, (_, i) => i + 1);
      balanceChart.data.datasets[0].data = chartData[otherInputs.repaymentPlan].map((d) =>
        d ? d.balance / exchangeRate : 0
      );
      balanceChart.options.scales.y.title.text = `Balance (${currencySymbol})`;
      balanceChart.update();
    }
    if (interestChart) {
      interestChart.data.labels = Array.from({ length: maxMonths }, (_, i) => i + 1);
      interestChart.data.datasets[0].data = chartData[otherInputs.repaymentPlan].map((d) =>
        d ? d.interest / exchangeRate : 0
      );
      interestChart.options.scales.y.title.text = `Interest (${currencySymbol})`;
      interestChart.update();
    }
  };

  const downloadReport = () => {
    if (!results) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Student Loan Calculator Report", 20, 20);
    doc.setFontSize(12);
    let y = 30;
    Object.entries(results).forEach(([key, value]) => {
      doc.text(
        `${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}: ${
          currencySymbols[otherInputs.currency]
        }${parseFloat(value).toFixed(2)}`,
        20,
        y
      );
      y += 10;
    });
    doc.save("loan_calculator_report.pdf");
  };

  const loanFields = [
    {
      id: "loanAmount",
      label: "Loan Amount ($)",
      type: "number",
      min: "0",
      tooltip: "Principal amount of the loan",
    },
    {
      id: "interestRate",
      label: "Interest Rate (%)",
      type: "number",
      min: "0",
      step: "0.01",
      tooltip: "Annual interest rate",
    },
    {
      id: "loanTerm",
      label: "Loan Term (Years)",
      type: "number",
      min: "1",
      tooltip: "Loan repayment period in years",
    },
    {
      id: "loanType",
      label: "Loan Type",
      type: "select",
      options: [
        { value: "federal", label: "Federal" },
        { value: "private", label: "Private" },
      ],
      tooltip: "Federal or Private loan type",
    },
    {
      id: "extraPayment",
      label: "Extra Monthly Payment ($)",
      type: "number",
      min: "0",
      tooltip: "Additional monthly payment to reduce loan term",
    },
    {
      id: "gracePeriod",
      label: "Grace Period (Months)",
      type: "number",
      min: "0",
      tooltip: "Interest accrual period before repayment starts",
    },
  ];

  const otherFields = [
    {
      id: "repaymentPlan",
      label: "Repayment Plan",
      type: "select",
      options: [
        { value: "standard", label: "Standard" },
        { value: "graduated", label: "Graduated" },
        { value: "extended", label: "Extended" },
        { value: "idr", label: "Income-Driven (Federal Only)" },
      ],
      tooltip: "Choose repayment strategy",
    },
    {
      id: "idrPlan",
      label: "IDR Plan (if applicable)",
      type: "select",
      options: [
        { value: "none", label: "None" },
        { value: "ibr", label: "Income-Based Repayment (IBR)" },
        { value: "paye", label: "Pay As You Earn (PAYE)" },
        { value: "save", label: "SAVE Plan" },
      ],
      tooltip: "Income-Driven Repayment plan for federal loans",
    },
    {
      id: "annualIncome",
      label: "Annual Income ($)",
      type: "number",
      min: "0",
      tooltip: "Annual income for IDR calculations",
    },
    {
      id: "refinanceRate",
      label: "Refinancing Interest Rate (%)",
      type: "number",
      min: "0",
      step: "0.01",
      tooltip: "Potential interest rate if refinanced",
    },
    {
      id: "currency",
      label: "Currency",
      type: "select",
      options: [
        { value: "USD", label: "USD ($)" },
        { value: "EUR", label: "EUR (€)" },
        { value: "GBP", label: "GBP (£)" },
      ],
      tooltip: "Select currency for display",
    },
    {
      id: "pslf",
      label: "Public Service Loan Forgiveness (PSLF)",
      type: "select",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes" },
      ],
      tooltip: "Eligible for PSLF after 120 qualifying payments",
    },
  ];

  return (
    <>
      <div className={`bg-white min-h-screen p-6 max-w-5xl mx-auto ${isDarkMode ? "dark" : ""}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Advanced Student Loan Calculator
          </h1>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Loan Details</h2>
          <div id="loanForms" className="space-y-4">
            {loans.map((loan, index) => (
              <div key={loan.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan {index + 1}</h3>
                  {loans.length > 1 && (
                    <button onClick={() => removeLoan(loan.id)} className="text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {loanFields.map((field) => (
                    <div key={field.id} className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          value={loan[field.id]}
                          onChange={(e) => updateLoan(loan.id, field.id, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                        >
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          min={field.min}
                          step={field.step}
                          value={loan[field.id]}
                          onChange={(e) => updateLoan(loan.id, field.id, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                        />
                      )}
                      <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                        {field.tooltip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addLoanForm}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Add Another Loan
          </button>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherFields.map((field) => (
              <div key={field.id} className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    value={otherInputs[field.id]}
                    onChange={(e) => updateOtherInput(field.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    min={field.min}
                    step={field.step}
                    value={otherInputs[field.id]}
                    onChange={(e) => updateOtherInput(field.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                )}
                <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                  {field.tooltip}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={calculateLoan}
            className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
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
                  {key === "payoffTime" ? value : formatCurrency(value, otherInputs.currency)}
                </p>
              ))}
            </div>
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full text-left bg-gray-100 dark:bg-gray-700 p-2 rounded-md mb-2"
            >
              Amortization Schedule
            </button>
            {showAmortization && (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-2">Loan</th>
                      <th className="px-4 py-2">Month</th>
                      <th className="px-4 py-2">Payment</th>
                      <th className="px-4 py-2">Principal</th>
                      <th className="px-4 py-2">Interest</th>
                      <th className="px-4 py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedules.flat().map((row, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">Loan {row.loanId}</td>
                        <td className="px-4 py-2">{row.month}</td>
                        <td className="px-4 py-2">{formatCurrency(row.payment, otherInputs.currency)}</td>
                        <td className="px-4 py-2">{formatCurrency(row.principal, otherInputs.currency)}</td>
                        <td className="px-4 py-2">{formatCurrency(row.interest, otherInputs.currency)}</td>
                        <td className="px-4 py-2">{formatCurrency(row.balance, otherInputs.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="w-full text-left bg-gray-100 dark:bg-gray-700 p-2 rounded-md mb-2"
            >
              Repayment Charts
            </button>
            {showCharts && (
              <div className="mb-4">
                <canvas ref={balanceChartRef} className="w-full mb-4" />
                <canvas ref={interestChartRef} className="w-full" />
              </div>
            )}
            <button
              onClick={downloadReport}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
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
        @media (max-width: 768px) {
          .grid-cols-3 {
            grid-template-columns: 1fr;
          }
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
