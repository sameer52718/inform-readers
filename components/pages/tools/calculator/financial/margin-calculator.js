"use client";

import { useState } from "react";

export default function Home() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("30");
  const [loanType, setLoanType] = useState("amortized");
  const [paymentFrequency, setPaymentFrequency] = useState("monthly");
  const [extraPayment, setExtraPayment] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [amortizationData, setAmortizationData] = useState([]);
  const [history, setHistory] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [error, setError] = useState("");

  const frequencySettings = {
    monthly: { periodsPerYear: 12, label: "Month" },
    "bi-weekly": { periodsPerYear: 26, label: "Bi-Week" },
    weekly: { periodsPerYear: 52, label: "Week" },
    annually: { periodsPerYear: 1, label: "Year" },
  };

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[curr]}${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatPeriod = (periods, frequency) => {
    const periodsPerYear = frequencySettings[frequency].periodsPerYear;
    const years = Math.floor(periods / periodsPerYear);
    const remaining = periods % periodsPerYear;
    return years > 0
      ? `${years} years${remaining > 0 ? `, ${remaining} periods` : ""}`
      : `${remaining} periods`;
  };

  const calculateLoan = () => {
    setError("");
    setResults(null);
    setAmortizationData([]);
    setComparisonData([]);

    const parsedLoanAmount = parseFloat(loanAmount);
    const parsedInterestRate = parseFloat(interestRate) / 100;
    const parsedLoanTerm = parseInt(loanTerm);
    const parsedExtraPayment = parseFloat(extraPayment) || 0;

    if (isNaN(parsedLoanAmount) || parsedLoanAmount <= 0) {
      setError("Please enter a valid loan amount");
      return;
    }
    if (isNaN(parsedInterestRate) || parsedInterestRate < 0) {
      setError("Please enter a valid interest rate");
      return;
    }

    const { periodsPerYear, label } = frequencySettings[paymentFrequency];
    const totalPeriods = parsedLoanTerm * periodsPerYear;
    const ratePerPeriod = parsedInterestRate / periodsPerYear;

    let payment,
      principalPayment,
      interestPayment,
      totalInterestPaid = 0,
      totalPayments = 0;
    let balance = parsedLoanAmount;
    let periodsTaken = 0;
    const newAmortizationData = [];

    if (loanType === "amortized") {
      payment =
        parsedLoanAmount *
        ((ratePerPeriod * Math.pow(1 + ratePerPeriod, totalPeriods)) /
          (Math.pow(1 + ratePerPeriod, totalPeriods) - 1));

      for (let period = 1; balance > 0 && period <= totalPeriods; period++) {
        interestPayment = balance * ratePerPeriod;
        principalPayment = payment - interestPayment;
        let totalPayment = payment + parsedExtraPayment;
        let totalPrincipal = principalPayment + parsedExtraPayment;
        balance -= totalPrincipal;
        totalInterestPaid += interestPayment;
        totalPayments += totalPayment;
        newAmortizationData.push({
          period,
          payment: totalPayment,
          principal: principalPayment,
          interest: interestPayment,
          extraPayment: parsedExtraPayment,
          balance: Math.max(balance, 0),
        });
        periodsTaken = period;
        if (balance <= 0) break;
      }
    } else if (loanType === "interest-only") {
      payment = parsedLoanAmount * ratePerPeriod;
      for (let period = 1; period <= totalPeriods; period++) {
        interestPayment = balance * ratePerPeriod;
        principalPayment = parsedExtraPayment;
        let totalPayment = payment + parsedExtraPayment;
        balance -= principalPayment;
        totalInterestPaid += interestPayment;
        totalPayments += totalPayment;
        newAmortizationData.push({
          period,
          payment: totalPayment,
          principal: principalPayment,
          interest: interestPayment,
          extraPayment: parsedExtraPayment,
          balance: Math.max(balance, 0),
        });
        periodsTaken = period;
        if (balance <= 0) break;
      }
    } else if (loanType === "deferred") {
      payment = 0;
      let finalPayment = parsedLoanAmount * Math.pow(1 + ratePerPeriod, totalPeriods);
      totalInterestPaid = finalPayment - parsedLoanAmount;
      for (let period = 1; period <= totalPeriods; period++) {
        interestPayment = balance * ratePerPeriod;
        principalPayment = period === totalPeriods ? parsedLoanAmount : 0;
        let totalPayment = period === totalPeriods ? finalPayment : 0;
        balance = period === totalPeriods ? 0 : balance * (1 + ratePerPeriod);
        totalPayments += totalPayment;
        newAmortizationData.push({
          period,
          payment: totalPayment,
          principal: principalPayment,
          interest: interestPayment,
          extraPayment: 0,
          balance: Math.max(balance, 0),
        });
        periodsTaken = period;
      }
    } else if (loanType === "bond") {
      payment = parsedLoanAmount * ratePerPeriod;
      for (let period = 1; period <= totalPeriods; period++) {
        interestPayment = parsedLoanAmount * ratePerPeriod;
        principalPayment = period === totalPeriods ? parsedLoanAmount : 0;
        let totalPayment = payment + (period === totalPeriods ? parsedLoanAmount : 0) + parsedExtraPayment;
        balance -= period === totalPeriods ? parsedLoanAmount : parsedExtraPayment;
        totalInterestPaid += interestPayment;
        totalPayments += totalPayment;
        newAmortizationData.push({
          period,
          payment: totalPayment,
          principal: principalPayment,
          interest: interestPayment,
          extraPayment: parsedExtraPayment,
          balance: Math.max(balance, 0),
        });
        periodsTaken = period;
        if (balance <= 0) break;
      }
    }

    setResults({
      loanAmount: parsedLoanAmount,
      payment: payment + parsedExtraPayment,
      totalInterest: totalInterestPaid,
      totalPayments,
      payoffTime: formatPeriod(periodsTaken, paymentFrequency),
    });
    setAmortizationData(newAmortizationData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      loanAmount: formatCurrency(parsedLoanAmount),
      interestRate: `${(parsedInterestRate * 100).toFixed(2)}%`,
      loanTerm: `${parsedLoanTerm} years`,
      loanType,
      paymentFrequency,
      extraPayment: formatCurrency(parsedExtraPayment),
      payment: formatCurrency(payment + parsedExtraPayment),
      totalInterest: formatCurrency(totalInterestPaid),
      payoffTime: formatPeriod(periodsTaken, paymentFrequency),
    };
    setHistory([...history, calculation]);

    alert("Charts (Payment Breakdown and Balance Trend) not implemented in this demo.");
  };

  const compareScenarios = () => {
    const parsedLoanAmount = parseFloat(loanAmount);
    const parsedInterestRate = parseFloat(interestRate) / 100;
    const parsedLoanTerm = parseInt(loanTerm);
    if (isNaN(parsedLoanAmount) || isNaN(parsedInterestRate)) {
      setError("Please calculate a loan first");
      return;
    }

    const { periodsPerYear } = frequencySettings[paymentFrequency];
    const totalPeriods = parsedLoanTerm * periodsPerYear;

    const scenarios = [
      { label: "Base Case", rate: parsedInterestRate, extraPayment: 0 },
      { label: "Lower Rate (-0.5%)", rate: Math.max(parsedInterestRate - 0.005, 0), extraPayment: 0 },
      { label: "Higher Rate (+0.5%)", rate: parsedInterestRate + 0.005, extraPayment: 0 },
      { label: "Extra $100/Period", rate: parsedInterestRate, extraPayment: 100 },
    ];

    const newComparisonData = scenarios.map((scenario) => {
      let balance = parsedLoanAmount;
      let totalInterest = 0;
      let periodsTaken = 0;
      const ratePerPeriod = scenario.rate / periodsPerYear;
      const payment =
        parsedLoanAmount *
        ((ratePerPeriod * Math.pow(1 + ratePerPeriod, totalPeriods)) /
          (Math.pow(1 + ratePerPeriod, totalPeriods) - 1));

      for (let period = 1; balance > 0 && period <= totalPeriods; period++) {
        const interest = balance * ratePerPeriod;
        const principal = payment - interest;
        const totalPrincipal = principal + scenario.extraPayment;
        balance -= totalPrincipal;
        totalInterest += interest;
        periodsTaken = period;
        if (balance <= 0) break;
      }

      return {
        label: scenario.label,
        payment: payment + scenario.extraPayment,
        totalInterest,
        periodsTaken,
      };
    });

    setComparisonData(newComparisonData);
  };

  const exportAmortization = () => {
    if (amortizationData.length === 0) {
      setError("No amortization data to export");
      return;
    }

    const csvContent = [
      "Period,Payment,Principal,Interest,Extra Payment,Balance",
      ...amortizationData.map(
        (item) =>
          `${item.period},${item.payment.toFixed(2)},${item.principal.toFixed(2)},${item.interest.toFixed(
            2
          )},${item.extraPayment.toFixed(2)},${item.balance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loan_amortization.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white  flex justify-center items-center p-4">
      <div className="bg-gray-100 rounded-xl shadow-2xl p-6 max-w-5xl w-full flex gap-6 flex-col md:flex-row">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Advanced Loan Calculator</h1>
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
              <label htmlFor="loan-term" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Term (Years)
              </label>
              <select
                id="loan-term"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                aria-label="Loan term"
              >
                <option value="30">30 Years</option>
                <option value="20">20 Years</option>
                <option value="15">15 Years</option>
                <option value="10">10 Years</option>
                <option value="5">5 Years</option>
              </select>
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
                <option value="amortized">Amortized (Fixed-Rate)</option>
                <option value="interest-only">Interest-Only</option>
                <option value="deferred">Deferred Payment</option>
                <option value="bond">Bond</option>
              </select>
            </div>
            <div>
              <label htmlFor="payment-frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Frequency
              </label>
              <select
                id="payment-frequency"
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                aria-label="Payment frequency"
              >
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <div>
              <label htmlFor="extra-payment" className="block text-sm font-medium text-gray-700 mb-1">
                Extra Payment per Period
              </label>
              <input
                id="extra-payment"
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                placeholder="Enter extra payment (optional)"
                step="10"
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:ring-red-500 focus:border-red-500"
                aria-label="Extra payment"
              />
            </div>
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
              onClick={calculateLoan}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:scale-105 transition-transform"
              aria-label="Calculate loan"
            >
              Calculate Loan
            </button>
          </div>
          {results && (
            <div className="bg-gray-200 p-5 rounded-lg mt-6">
              <p>
                <strong>Loan Amount:</strong> {formatCurrency(results.loanAmount)}
              </p>
              <p>
                <strong>Payment Amount:</strong> {formatCurrency(results.payment)}
              </p>
              <p>
                <strong>Total Interest Paid:</strong> {formatCurrency(results.totalInterest)}
              </p>
              <p>
                <strong>Total Payments:</strong> {formatCurrency(results.totalPayments)}
              </p>
              <p>
                <strong>Payoff Time:</strong> {results.payoffTime}
              </p>
            </div>
          )}
          <div className="mt-6">
            <p className="text-gray-600 text-center">Payment Breakdown Chart not implemented in this demo.</p>
          </div>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Amortization & History</h1>
          {amortizationData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3 text-right">Period</th>
                  <th className="p-3 text-right">Payment</th>
                  <th className="p-3 text-right">Principal</th>
                  <th className="p-3 text-right">Interest</th>
                  <th className="p-3 text-right">Extra Payment</th>
                  <th className="p-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortizationData.slice(0, 60).map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="p-3 text-right">
                      {item.period} {frequencySettings[paymentFrequency].label}
                    </td>
                    <td className="p-3 text-right">{formatCurrency(item.payment)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.principal)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.interest)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.extraPayment)}</td>
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
                  <strong>Interest Rate:</strong> {item.interestRate}
                </p>
                <p>
                  <strong>Loan Term:</strong> {item.loanTerm}
                </p>
                <p>
                  <strong>Loan Type:</strong> {item.loanType}
                </p>
                <p>
                  <strong>Payment Frequency:</strong> {item.paymentFrequency}
                </p>
                <p>
                  <strong>Extra Payment:</strong> {item.extraPayment}
                </p>
                <p>
                  <strong>Payment:</strong> {item.payment}
                </p>
                <p>
                  <strong>Total Interest:</strong> {item.totalInterest}
                </p>
                <p>
                  <strong>Payoff Time:</strong> {item.payoffTime}
                </p>
              </div>
            ))}
          </div>
          {comparisonData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden mt-6 text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3 text-right">Scenario</th>
                  <th className="p-3 text-right">Payment</th>
                  <th className="p-3 text-right">Total Interest</th>
                  <th className="p-3 text-right">Payoff Time</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="p-3 text-right">{item.label}</td>
                    <td className="p-3 text-right">{formatCurrency(item.payment)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.totalInterest)}</td>
                    <td className="p-3 text-right">{formatPeriod(item.periodsTaken, paymentFrequency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-6">
            <p className="text-gray-600 text-center">Balance Trend Chart not implemented in this demo.</p>
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
            aria-label="Compare loan scenarios"
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
