"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanType, setLoanType] = useState("fixed");
  const [rateAdjustment, setRateAdjustment] = useState("");
  const [extraPayment, setExtraPayment] = useState("");
  const [oneTimePayment, setOneTimePayment] = useState("");
  const [oneTimeYear, setOneTimeYear] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [amortizationData, setAmortizationData] = useState([]);
  const [history, setHistory] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [error, setError] = useState("");

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[curr]}${parseFloat(amount || 0).toFixed(2)}`;
  };

  const calculateMortgage = () => {
    setError("");
    setResults(null);
    setAmortizationData([]);
    setComparisonData([]);

    const parsedLoanAmount = parseFloat(loanAmount);
    const parsedLoanTerm = parseInt(loanTerm);
    const parsedInterestRate = parseFloat(interestRate) / 100;
    const parsedRateAdjustment = parseFloat(rateAdjustment) / 100 || 0;
    const parsedExtraPayment = parseFloat(extraPayment) || 0;
    const parsedOneTimePayment = parseFloat(oneTimePayment) || 0;
    const parsedOneTimeYear = parseInt(oneTimeYear) || 0;

    if (isNaN(parsedLoanAmount) || parsedLoanAmount <= 0) {
      setError("Please enter a valid loan amount");
      return;
    }
    if (isNaN(parsedLoanTerm) || parsedLoanTerm <= 0) {
      setError("Please enter a valid loan term");
      return;
    }
    if (isNaN(parsedInterestRate) || parsedInterestRate < 0) {
      setError("Please enter a valid interest rate");
      return;
    }
    if (
      parsedOneTimePayment > 0 &&
      (isNaN(parsedOneTimeYear) || parsedOneTimeYear < 1 || parsedOneTimeYear > parsedLoanTerm)
    ) {
      setError("Please enter a valid year for one-time payment");
      return;
    }

    const monthlyRate = parsedInterestRate / 12;
    const totalPayments = parsedLoanTerm * 12;
    const monthlyPayment =
      parsedLoanAmount *
      ((monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1));

    let standardBalance = parsedLoanAmount;
    let standardInterest = 0;
    const standardBalances = [standardBalance];
    const standardInterests = [];

    for (let month = 1; month <= totalPayments; month++) {
      const year = Math.ceil(month / 12);
      const currentRate =
        loanType === "adjustable" && year > 5
          ? parsedInterestRate + parsedRateAdjustment * Math.floor((year - 1) / 5)
          : parsedInterestRate;
      const monthlyCurrentRate = currentRate / 12;
      const interest = standardBalance * monthlyCurrentRate;
      const principal = monthlyPayment - interest;
      standardBalance -= principal;
      standardInterest += interest;
      if (month % 12 === 0) {
        standardBalances.push(standardBalance);
        standardInterests.push(interest * 12);
      }
      if (standardBalance <= 0) break;
    }

    let balance = parsedLoanAmount;
    let totalInterest = 0;
    let totalPaymentsMade = 0;
    let payoffMonths = 0;
    const newAmortizationData = [];
    const extraBalances = [balance];
    const extraInterests = [];
    let oneTimeApplied = false;

    for (let month = 1; month <= totalPayments; month++) {
      const year = Math.ceil(month / 12);
      const currentRate =
        loanType === "adjustable" && year > 5
          ? parsedInterestRate + parsedRateAdjustment * Math.floor((year - 1) / 5)
          : parsedInterestRate;
      const monthlyCurrentRate = currentRate / 12;
      const interest = balance * monthlyCurrentRate;
      const principal = monthlyPayment - interest;
      let extra = parsedExtraPayment;
      if (parsedOneTimePayment > 0 && Math.ceil(month / 12) === parsedOneTimeYear && !oneTimeApplied) {
        extra += parsedOneTimePayment;
        oneTimeApplied = true;
      }
      balance -= principal + extra;
      totalInterest += interest;
      totalPaymentsMade += monthlyPayment + extra;
      if (month % 12 === 0 || balance <= 0) {
        newAmortizationData.push({
          year,
          payment: (monthlyPayment + extra) * (month % 12 || 12),
          interest: interest * (month % 12 || 12),
          principal: (principal + extra) * (month % 12 || 12),
          balance: Math.max(balance, 0),
        });
        extraBalances.push(Math.max(balance, 0));
        extraInterests.push(interest * 12);
      }
      if (balance <= 0) {
        payoffMonths = month;
        break;
      }
    }

    const payoffYears = Math.ceil(payoffMonths / 12);
    const interestSavings = standardInterest - totalInterest;
    const totalCost = totalPaymentsMade;

    setResults({
      monthlyPayment,
      totalInterest,
      payoffYears,
      payoffMonths,
      interestSavings,
      totalCost,
    });
    setAmortizationData(newAmortizationData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      loanAmount: formatCurrency(parsedLoanAmount),
      loanTerm: `${parsedLoanTerm} years`,
      interestRate: `${(parsedInterestRate * 100).toFixed(2)}%`,
      loanType,
      rateAdjustment: loanType === "adjustable" ? `${(parsedRateAdjustment * 100).toFixed(2)}%` : "N/A",
      extraPayment: formatCurrency(parsedExtraPayment),
      oneTimePayment: formatCurrency(parsedOneTimePayment),
      oneTimeYear: parsedOneTimePayment > 0 ? parsedOneTimeYear : "N/A",
      monthlyPayment: formatCurrency(monthlyPayment),
      totalInterest: formatCurrency(totalInterest),
      payoffTime: `${payoffYears} years`,
      interestSavings: formatCurrency(interestSavings),
      totalCost: formatCurrency(totalCost),
    };
    setHistory([...history, calculation]);

    alert("Charts (Balance and Interest) not implemented in this demo.");
  };

  const compareScenarios = () => {
    const parsedLoanAmount = parseFloat(loanAmount);
    const parsedLoanTerm = parseInt(loanTerm);
    const parsedInterestRate = parseFloat(interestRate) / 100;
    const parsedRateAdjustment = parseFloat(rateAdjustment) / 100 || 0;
    const parsedExtraPayment = parseFloat(extraPayment) || 0;

    if (isNaN(parsedLoanAmount) || isNaN(parsedLoanTerm) || isNaN(parsedInterestRate)) {
      setError("Please calculate mortgage first");
      return;
    }

    const monthlyRate = parsedInterestRate / 12;
    const totalPayments = parsedLoanTerm * 12;
    const monthlyPayment =
      parsedLoanAmount *
      ((monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1));

    const scenarios = [
      { label: "No Extra Payments", extra: 0 },
      { label: "Current Extra Payment", extra: parsedExtraPayment },
      { label: "Double Extra Payment", extra: parsedExtraPayment * 2 },
      { label: "Higher Rate (+0.5%)", extra: parsedExtraPayment, rate: parsedInterestRate + 0.005 },
    ];

    const comparisonData = scenarios.map((scenario) => {
      let balance = parsedLoanAmount;
      let totalInterest = 0;
      let payoffMonths = 0;
      const scenarioRate = scenario.rate || parsedInterestRate;
      const monthlyScenarioRate = scenarioRate / 12;
      const scenarioMonthlyPayment = scenario.label.includes("Higher Rate")
        ? parsedLoanAmount *
          ((monthlyScenarioRate * Math.pow(1 + monthlyScenarioRate, totalPayments)) /
            (Math.pow(1 + monthlyScenarioRate, totalPayments) - 1))
        : monthlyPayment;

      for (let month = 1; month <= totalPayments; month++) {
        const year = Math.ceil(month / 12);
        const currentRate =
          loanType === "adjustable" && year > 5
            ? scenarioRate + parsedRateAdjustment * Math.floor((year - 1) / 5)
            : scenarioRate;
        const monthlyCurrentRate = currentRate / 12;
        const interest = balance * monthlyCurrentRate;
        const principal = scenarioMonthlyPayment - interest;
        balance -= principal + scenario.extra;
        totalInterest += interest;
        if (balance <= 0) {
          payoffMonths = month;
          break;
        }
      }

      const payoffYears = Math.ceil(payoffMonths / 12);
      return { label: scenario.label, payoffYears, totalInterest };
    });

    const standardInterest = comparisonData[0].totalInterest;
    const newComparisonData = comparisonData.map((item) => ({
      ...item,
      interestSavings: standardInterest - item.totalInterest,
    }));

    setComparisonData(newComparisonData);
  };

  const exportAmortization = () => {
    if (amortizationData.length === 0) {
      setError("No amortization data to export");
      return;
    }

    const csvContent = [
      "Year,Payment,Interest,Principal,Balance",
      ...amortizationData.map(
        (item) =>
          `${item.year},${item.payment.toFixed(2)},${item.interest.toFixed(2)},${item.principal.toFixed(
            2
          )},${item.balance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mortgage_amortization.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white min-h-screen flex justify-center items-center p-4">
      <div className="bg-gray-100 rounded-xl shadow-2xl p-6 max-w-5xl w-full flex gap-6 flex-col md:flex-row">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Advanced Mortgage Payoff Calculator
          </h1>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <div className="space-y-4">
            <div>
              <label htmlFor="loan-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Amount
              </label>
              <input
                id="loan-amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
                step="1000"
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                aria-label="Loan amount"
              />
            </div>
            <div>
              <label htmlFor="loan-term" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Term (Years)
              </label>
              <input
                id="loan-term"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="Enter loan term"
                step="1"
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                aria-label="Loan term"
              />
            </div>
            <div>
              <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700 mb-1">
                Annual Interest Rate (%)
              </label>
              <input
                id="interest-rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Enter interest rate"
                step="0.01"
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                aria-label="Interest rate"
              />
            </div>
            <div>
              <label htmlFor="loan-type" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Type
              </label>
              <select
                id="loan-type"
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                aria-label="Loan type"
              >
                <option value="fixed">Fixed-Rate</option>
                <option value="adjustable">Adjustable-Rate</option>
              </select>
            </div>
            {loanType === "adjustable" && (
              <div>
                <label htmlFor="rate-adjustment" className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Adjustment (% every 5 years)
                </label>
                <input
                  id="rate-adjustment"
                  type="number"
                  value={rateAdjustment}
                  onChange={(e) => setRateAdjustment(e.target.value)}
                  placeholder="Enter rate adjustment"
                  step="0.01"
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                  aria-label="Rate adjustment"
                />
              </div>
            )}
            <div>
              <label htmlFor="extra-payment" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Extra Payment
              </label>
              <input
                id="extra-payment"
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                placeholder="Enter extra payment"
                step="100"
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                aria-label="Extra payment"
              />
            </div>
            <div>
              <label htmlFor="one-time-payment" className="block text-sm font-medium text-gray-700 mb-1">
                One-Time Payment
              </label>
              <input
                id="one-time-payment"
                type="number"
                value={oneTimePayment}
                onChange={(e) => setOneTimePayment(e.target.value)}
                placeholder="Enter one-time payment"
                step="100"
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                aria-label="One-time payment"
              />
            </div>
            {parseFloat(oneTimePayment) > 0 && (
              <div>
                <label htmlFor="one-time-year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year of One-Time Payment
                </label>
                <input
                  id="one-time-year"
                  type="number"
                  value={oneTimeYear}
                  onChange={(e) => setOneTimeYear(e.target.value)}
                  placeholder="Enter year"
                  step="1"
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                  aria-label="Year of one-time payment"
                />
              </div>
            )}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                aria-label="Currency"
              >
                <option value="USD">$ USD</option>
                <option value="CAD">$ CAD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>
            <button
              onClick={calculateMortgage}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:scale-105 transition-transform"
              aria-label="Calculate payoff"
            >
              Calculate Payoff
            </button>
          </div>
          {results && (
            <div className="bg-gray-200 p-5 rounded-lg mt-6">
              <p>
                <strong>Monthly Payment:</strong> {formatCurrency(results.monthlyPayment)}
              </p>
              <p>
                <strong>Total Interest Paid:</strong> {formatCurrency(results.totalInterest)}
              </p>
              <p>
                <strong>Payoff Time:</strong>{" "}
                {`${results.payoffYears} years (${results.payoffMonths} months)`}
              </p>
              <p>
                <strong>Interest Savings:</strong> {formatCurrency(results.interestSavings)}
              </p>
              <p>
                <strong>Total Cost:</strong> {formatCurrency(results.totalCost)}
              </p>
            </div>
          )}
          <div className="mt-6">
            <p className="text-gray-600 text-center">Balance Chart not implemented in this demo.</p>
          </div>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Amortization & History</h1>
          {amortizationData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3 text-right">Year</th>
                  <th className="p-3 text-right">Payment</th>
                  <th className="p-3 text-right">Interest</th>
                  <th className="p-3 text-right">Principal</th>
                  <th className="p-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortizationData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="p-3 text-right">{item.year}</td>
                    <td className="p-3 text-right">{formatCurrency(item.payment)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.interest)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.principal)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-6 space-y-4">
            {history.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <p>
                  <strong>Date:</strong> {item.timestamp}
                </p>
                <p>
                  <strong>Loan Amount:</strong> {item.loanAmount}
                </p>
                <p>
                  <strong>Loan Term:</strong> {item.loanTerm}
                </p>
                <p>
                  <strong>Interest Rate:</strong> {item.interestRate}
                </p>
                <p>
                  <strong>Loan Type:</strong> {item.loanType}
                </p>
                <p>
                  <strong>Rate Adjustment:</strong> {item.rateAdjustment}
                </p>
                <p>
                  <strong>Extra Payment:</strong> {item.extraPayment}
                </p>
                <p>
                  <strong>One-Time Payment:</strong> {item.oneTimePayment}
                </p>
                <p>
                  <strong>One-Time Year:</strong> {item.oneTimeYear}
                </p>
                <p>
                  <strong>Monthly Payment:</strong> {item.monthlyPayment}
                </p>
                <p>
                  <strong>Total Interest:</strong> {item.totalInterest}
                </p>
                <p>
                  <strong>Payoff Time:</strong> {item.payoffTime}
                </p>
                <p>
                  <strong>Interest Savings:</strong> {item.interestSavings}
                </p>
                <p>
                  <strong>Total Cost:</strong> {item.totalCost}
                </p>
              </div>
            ))}
          </div>
          {comparisonData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden mt-6 text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3 text-right">Scenario</th>
                  <th className="p-3 text-right">Payoff Time</th>
                  <th className="p-3 text-right">Total Interest</th>
                  <th className="p-3 text-right">Interest Savings</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="p-3 text-right">{item.label}</td>
                    <td className="p-3 text-right">{item.payoffYears} years</td>
                    <td className="p-3 text-right">{formatCurrency(item.totalInterest)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.interestSavings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-6">
            <p className="text-gray-600 text-center">Interest Chart not implemented in this demo.</p>
          </div>
          <button
            onClick={exportAmortization}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 mt-6"
            aria-label="Export amortization as CSV"
          >
            Export Amortization (CSV)
          </button>
          <button
            onClick={compareScenarios}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 mt-4"
            aria-label="Compare scenarios"
          >
            Compare Scenarios
          </button>
        </div>
      </div>
      <style jsx>{`
        input:focus,
        select:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
        }
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
          }
          .max-h-[700px] {
            max-height: 500px;
          }
          table {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
