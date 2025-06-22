"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [vehiclePrice, setVehiclePrice] = useState("30000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("60");
  const [downPayment, setDownPayment] = useState("6000");
  const [downPaymentType, setDownPaymentType] = useState("amount");
  const [tradeIn, setTradeIn] = useState("5000");
  const [salesTax, setSalesTax] = useState("8");
  const [fees, setFees] = useState("1000");
  const [extraMonthly, setExtraMonthly] = useState("0");
  const [extraOneTime, setExtraOneTime] = useState("0");
  const [extraOneTimeMonth, setExtraOneTimeMonth] = useState("1");
  const [startDate, setStartDate] = useState("2025-05-01");
  const [currency, setCurrency] = useState("USD");
  const [income, setIncome] = useState("60000");
  const [dti, setDti] = useState("36");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [collapsibleStates, setCollapsibleStates] = useState({
    additionalCosts: false,
    extraPayments: false,
    advancedOptions: false,
  });
  const amortizationChartRef = useRef(null);

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[currency]} ${parseFloat(amount).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  };

  const toggleCollapsible = (section) => {
    setCollapsibleStates((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateAutoLoan = () => {
    setError("");
    setResults(null);

    const parsedVehiclePrice = parseFloat(vehiclePrice) || 0;
    const parsedInterestRate = parseFloat(interestRate) || 0;
    const parsedLoanTerm = parseInt(loanTerm) || 0;
    let parsedDownPayment = parseFloat(downPayment) || 0;
    const parsedTradeIn = parseFloat(tradeIn) || 0;
    const parsedSalesTax = parseFloat(salesTax) || 0;
    const parsedFees = parseFloat(fees) || 0;
    const parsedExtraMonthly = parseFloat(extraMonthly) || 0;
    const parsedExtraOneTime = parseFloat(extraOneTime) || 0;
    const parsedExtraOneTimeMonth = parseInt(extraOneTimeMonth) || 1;
    const parsedStartDate = new Date(startDate || "2025-05-01");
    const parsedIncome = parseFloat(income) || 0;
    const parsedDti = parseFloat(dti) || 36;

    if (parsedVehiclePrice < 1000) {
      setError("Vehicle price must be at least 1000");
      return;
    }
    if (parsedInterestRate < 0.1 || parsedInterestRate > 20) {
      setError("Interest rate must be between 0.1% and 20%");
      return;
    }
    if (parsedLoanTerm < 12 || parsedLoanTerm > 84) {
      setError("Loan term must be between 12 and 84 months");
      return;
    }
    if (downPaymentType === "percent") {
      if (parsedDownPayment < 0 || parsedDownPayment > 100) {
        setError("Down payment percentage must be between 0% and 100%");
        return;
      }
      parsedDownPayment = (parsedDownPayment / 100) * parsedVehiclePrice;
    }
    if (parsedDownPayment < 0 || parsedTradeIn < 0 || parsedFees < 0) {
      setError("Down payment, trade-in, and fees cannot be negative");
      return;
    }
    if (parsedSalesTax < 0 || parsedSalesTax > 20) {
      setError("Sales tax must be between 0% and 20%");
      return;
    }

    try {
      const taxableAmount = parsedVehiclePrice - parsedTradeIn;
      const taxAmount = taxableAmount * (parsedSalesTax / 100);
      const principal = parsedVehiclePrice + taxAmount + parsedFees - parsedDownPayment - parsedTradeIn;
      const monthlyRate = parsedInterestRate / 100 / 12;
      const monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, parsedLoanTerm))) /
        (Math.pow(1 + monthlyRate, parsedLoanTerm) - 1);

      let remainingBalance = principal;
      let totalInterest = 0;
      const amortization = [];
      let currentDate = new Date(parsedStartDate);
      let monthsSaved = 0;

      for (let month = 1; month <= parsedLoanTerm && remainingBalance > 0; month++) {
        let extra = parsedExtraMonthly;
        if (month === parsedExtraOneTimeMonth) extra += parsedExtraOneTime;
        const interest = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interest;
        remainingBalance -= principalPayment + extra;
        totalInterest += interest;
        if (remainingBalance < 0) remainingBalance = 0;
        amortization.push({
          month,
          date: new Date(currentDate),
          balance: remainingBalance,
          principal: principalPayment + extra,
          interest,
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
        if (remainingBalance <= 0) {
          monthsSaved = parsedLoanTerm - month;
          break;
        }
      }

      const payoffDate = amortization[amortization.length - 1].date;
      const totalCost = principal + totalInterest;
      const affordability = (parsedIncome * (parsedDti / 100)) / 12;

      const metrics = [
        {
          label: "Monthly Payment",
          value: formatCurrency(monthlyPayment, currency),
        },
        { label: "Total Interest", value: formatCurrency(totalInterest, currency) },
        { label: "Total Cost", value: formatCurrency(totalCost, currency) },
        {
          label: "Payoff Date",
          value: payoffDate.toLocaleDateString("en-US"),
        },
        { label: "Months Saved", value: monthsSaved },
        {
          label: "Affordable Payment",
          value: formatCurrency(affordability, currency),
        },
      ];

      let csv = "Month,Date,Balance,Principal,Interest\n";
      amortization.forEach((entry) => {
        csv += `${entry.month},${entry.date.toLocaleDateString("en-US")},${entry.balance.toFixed(
          2
        )},${entry.principal.toFixed(2)},${entry.interest.toFixed(2)}\n`;
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const csvUrl = URL.createObjectURL(blob);

      setResults({ metrics, amortization, csvUrl, principal });
    } catch (error) {
      setError("Error calculating auto loan. Check console for details.");
      console.error("Calculation error:", error);
    }
  };

  useEffect(() => {
    if (results && amortizationChartRef.current) {
      const canvas = amortizationChartRef.current;
      canvas.width = 480;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#e5e7eb";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const maxBalance = results.principal;
      const step = canvas.width / Math.min(results.amortization.length, 84);
      results.amortization.forEach((entry, i) => {
        const x = i * step;
        const yPrincipal = canvas.height - (entry.principal / maxBalance) * canvas.height;
        const yInterest = canvas.height - (entry.interest / maxBalance) * canvas.height;
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(x, yPrincipal, step / 2, canvas.height - yPrincipal);
        ctx.fillStyle = "#f87171";
        ctx.fillRect(x + step / 2, yInterest, step / 2, canvas.height - yInterest);
      });
    }
  }, [results]);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Advanced Auto Loan Calculator</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Vehicle Price</label>
          <input
            type="number"
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(e.target.value)}
            min="1000"
            step="100"
            className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
          />
          <input
            type="range"
            min="1000"
            max="100000"
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(e.target.value)}
            step="100"
            className="w-full mt-2"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            min="0.1"
            max="20"
            step="0.1"
            className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
          />
          <input
            type="range"
            min="0.1"
            max="20"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            step="0.1"
            className="w-full mt-2"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Loan Term (Months)</label>
          <input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            min="12"
            max="84"
            className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
          />
          <input
            type="range"
            min="12"
            max="84"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full mt-2"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">
            Down Payment (Amount or %)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              min="0"
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
            />
            <select
              value={downPaymentType}
              onChange={(e) => setDownPaymentType(e.target.value)}
              className="p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
            >
              <option value="amount">Amount</option>
              <option value="percent">Percent (%)</option>
            </select>
          </div>
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Trade-In Value</label>
          <input
            type="number"
            value={tradeIn}
            onChange={(e) => setTradeIn(e.target.value)}
            min="0"
            className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
          />
        </div>
        <div
          className="cursor-pointer p-2 bg-red-500 text-white rounded-lg text-center mb-2"
          onClick={() => toggleCollapsible("additionalCosts")}
        >
          Additional Costs
        </div>
        {collapsibleStates.additionalCosts && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">Sales Tax (%)</label>
            <input
              type="number"
              value={salesTax}
              onChange={(e) => setSalesTax(e.target.value)}
              min="0"
              max="20"
              step="0.1"
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
            />
            <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">
              Fees (Registration, Documentation)
            </label>
            <input
              type="number"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              min="0"
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
            />
          </div>
        )}
        <div
          className="cursor-pointer p-2 bg-red-500 text-white rounded-lg text-center mb-2"
          onClick={() => toggleCollapsible("extraPayments")}
        >
          Extra Payments
        </div>
        {collapsibleStates.extraPayments && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">Extra Monthly Payment</label>
            <input
              type="number"
              value={extraMonthly}
              onChange={(e) => setExtraMonthly(e.target.value)}
              min="0"
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
            />
            <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">
              One-Time Extra Payment
            </label>
            <input
              type="number"
              value={extraOneTime}
              onChange={(e) => setExtraOneTime(e.target.value)}
              min="0"
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
            />
            <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">
              Month of One-Time Payment
            </label>
            <input
              type="number"
              value={extraOneTimeMonth}
              onChange={(e) => setExtraOneTimeMonth(e.target.value)}
              min="1"
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
            />
          </div>
        )}
        <div
          className="cursor-pointer p-2 bg-red-500 text-white rounded-lg text-center mb-2"
          onClick={() => toggleCollapsible("advancedOptions")}
        >
          Advanced Options
        </div>
        {collapsibleStates.advancedOptions && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
            />
            <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
            >
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="INR">₹ INR</option>
            </select>
            <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Annual Income</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              min="0"
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
            />
            <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">
              Debt-to-Income Ratio (%)
            </label>
            <input
              type="number"
              value={dti}
              onChange={(e) => setDti(e.target.value)}
              min="0"
              max="100"
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
            />
          </div>
        )}
        <button
          onClick={calculateAutoLoan}
          className="bg-red-500 text-white px-4 py-2 rounded-lg w-full mt-4 hover:bg-red-600"
        >
          Calculate Auto Loan
        </button>
        {results && (
          <>
            <table className="w-full border-collapse bg-white rounded-lg mt-4">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Metric</th>
                  <th className="p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {results.metrics.map((metric, i) => (
                  <tr key={i} className="border-b border-gray-300">
                    <td className="p-2">{metric.label}</td>
                    <td className="p-2">{metric.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <canvas ref={amortizationChartRef} className="mt-4 border-2 border-gray-200 rounded-lg"></canvas>
            <div className="mt-4 text-center">
              <a
                href={results.csvUrl}
                download="amortization_schedule.csv"
                className="text-red-500 hover:underline"
              >
                Download Amortization Schedule
              </a>
            </div>
          </>
        )}
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </div>
    </div>
  );
}
