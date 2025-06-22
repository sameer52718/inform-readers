"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [loanAmount, setLoanAmount] = useState("200000");
  const [loanAmountSlider, setLoanAmountSlider] = useState("200000");
  const [interestRate, setInterestRate] = useState("7.5");
  const [interestRateSlider, setInterestRateSlider] = useState("7.5");
  const [loanTerm, setLoanTerm] = useState("15");
  const [loanTermSlider, setLoanTermSlider] = useState("15");
  const [downPayment, setDownPayment] = useState("40000");
  const [downPaymentType, setDownPaymentType] = useState("amount");
  const [propertyTax, setPropertyTax] = useState("2000");
  const [insurance, setInsurance] = useState("1000");
  const [hoa, setHoa] = useState("200");
  const [extraMonthly, setExtraMonthly] = useState("0");
  const [extraOneTime, setExtraOneTime] = useState("0");
  const [extraOneTimeMonth, setExtraOneTimeMonth] = useState("1");
  const [startDate, setStartDate] = useState("2025-05-01");
  const [currency, setCurrency] = useState("USD");
  const [income, setIncome] = useState("100000");
  const [dti, setDti] = useState("36");
  const [results, setResults] = useState(null);
  const [amortizationData, setAmortizationData] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState("dark");
  const [additionalCostsOpen, setAdditionalCostsOpen] = useState(false);
  const [extraPaymentsOpen, setExtraPaymentsOpen] = useState(false);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[curr]} ${parseFloat(amount || 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  };

  const calculateMortgage = () => {
    setError("");
    setStatus("");
    setResults(null);
    setAmortizationData([]);

    const parsedLoanAmount = parseFloat(loanAmount) || 0;
    const parsedInterestRate = parseFloat(interestRate) || 0;
    const parsedLoanTerm = parseInt(loanTerm) || 0;
    let parsedDownPayment = parseFloat(downPayment) || 0;
    const parsedPropertyTax = parseFloat(propertyTax) || 0;
    const parsedInsurance = parseFloat(insurance) || 0;
    const parsedHoa = parseFloat(hoa) || 0;
    const parsedExtraMonthly = parseFloat(extraMonthly) || 0;
    const parsedExtraOneTime = parseFloat(extraOneTime) || 0;
    const parsedExtraOneTimeMonth = parseInt(extraOneTimeMonth) || 1;
    const parsedStartDate = new Date(startDate || "2025-05-01");
    const parsedIncome = parseFloat(income) || 0;
    const parsedDti = parseFloat(dti) || 36;

    if (parsedLoanAmount < 1000) {
      setError("Loan amount must be at least 1000");
      return;
    }
    if (parsedInterestRate < 0.1 || parsedInterestRate > 20) {
      setError("Interest rate must be between 0.1% and 20%");
      return;
    }
    if (parsedLoanTerm < 1 || parsedLoanTerm > 40) {
      setError("Loan term must be between 1 and 40 years");
      return;
    }
    if (downPaymentType === "percent") {
      if (parsedDownPayment < 0 || parsedDownPayment > 100) {
        setError("Down payment percentage must be between 0% and 100%");
        return;
      }
      parsedDownPayment = (parsedDownPayment / 100) * parsedLoanAmount;
    }
    if (parsedDownPayment < 0) {
      setError("Down payment cannot be negative");
      return;
    }

    try {
      const monthlyRate = parsedInterestRate / 100 / 12;
      const totalMonths = parsedLoanTerm * 12;
      const principal = parsedLoanAmount - parsedDownPayment;
      const monthlyPI =
        principal *
        ((monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1));
      const monthlyTax = parsedPropertyTax / 12;
      const monthlyInsurance = parsedInsurance / 12;
      const monthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + parsedHoa;

      let remainingBalance = principal;
      let totalInterest = 0;
      const newAmortizationData = [];
      let currentDate = new Date(parsedStartDate);
      let monthsSaved = 0;

      for (let month = 1; month <= totalMonths && remainingBalance > 0; month++) {
        let extra = parsedExtraMonthly;
        if (month === parsedExtraOneTimeMonth) extra += parsedExtraOneTime;
        const interest = remainingBalance * monthlyRate;
        const principalPayment = monthlyPI - interest;
        remainingBalance -= principalPayment + extra;
        totalInterest += interest;
        if (remainingBalance < 0) remainingBalance = 0;
        newAmortizationData.push({
          month,
          date: new Date(currentDate),
          balance: remainingBalance,
          principal: principalPayment + extra,
          interest,
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
        if (remainingBalance <= 0) {
          monthsSaved = totalMonths - month;
          break;
        }
      }

      const payoffDate = newAmortizationData[newAmortizationData.length - 1].date;
      const totalCost =
        principal +
        totalInterest +
        (parsedPropertyTax + parsedInsurance) * parsedLoanTerm +
        parsedHoa * totalMonths;
      const affordability = (parsedIncome * (parsedDti / 100)) / 12;

      setResults({
        monthlyPayment,
        totalInterest,
        totalCost,
        payoffDate,
        monthsSaved,
        affordability,
      });
      setAmortizationData(newAmortizationData);
      setStatus("Mortgage calculated successfully");

      alert("Amortization chart not implemented in this demo.");
    } catch (err) {
      setError("Error calculating mortgage. Check console for details.");
      console.error("Calculation error:", err);
    }
  };

  const downloadAmortization = () => {
    if (amortizationData.length === 0) {
      setError("No amortization data to export");
      return;
    }

    let csv = "Month,Date,Balance,Principal,Interest\n";
    amortizationData.forEach((entry) => {
      csv += `${entry.month},${entry.date.toLocaleDateString("en-US")},${entry.balance.toFixed(
        2
      )},${entry.principal.toFixed(2)},${entry.interest.toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "amortization_schedule.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white min-h-screen flex justify-center items-center p-4 ${theme}`}>
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "☀️" : "🌙"} Toggle Theme
      </button>
      <div className={`bg-gray-100 rounded-xl shadow-2xl p-6 max-w-md w-full ${theme}`}>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Advanced Mortgage Calculator</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {status && <div className="text-yellow-500 text-center mb-4">{status}</div>}
        <div className="space-y-4">
          <div>
            <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount
            </label>
            <input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => {
                setLoanAmount(e.target.value);
                setLoanAmountSlider(e.target.value);
              }}
              min="1000"
              step="1000"
              className={`w-full p-3 rounded-lg border border-gray-300 ${
                theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
              } focus:ring-red-500 focus:border-red-500`}
              aria-label="Loan amount"
            />
            <input
              id="loanAmountSlider"
              type="range"
              min="1000"
              max="1000000"
              value={loanAmountSlider}
              step="1000"
              onChange={(e) => {
                setLoanAmountSlider(e.target.value);
                setLoanAmount(e.target.value);
              }}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Interest Rate (%)
            </label>
            <input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => {
                setInterestRate(e.target.value);
                setInterestRateSlider(e.target.value);
              }}
              min="0.1"
              max="20"
              step="0.1"
              className={`w-full p-3 rounded-lg border border-gray-300 ${
                theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
              } focus:ring-red-500 focus:border-red-500`}
              aria-label="Interest rate"
            />
            <input
              id="interestRateSlider"
              type="range"
              min="0.1"
              max="20"
              value={interestRateSlider}
              step="0.1"
              onChange={(e) => {
                setInterestRateSlider(e.target.value);
                setInterestRate(e.target.value);
              }}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term (Years)
            </label>
            <input
              id="loanTerm"
              type="number"
              value={loanTerm}
              onChange={(e) => {
                setLoanTerm(e.target.value);
                setLoanTermSlider(e.target.value);
              }}
              min="1"
              max="40"
              className={`w-full p-3 rounded-lg border border-gray-300 ${
                theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
              } focus:ring-red-500 focus:border-red-500`}
              aria-label="Loan term"
            />
            <input
              id="loanTermSlider"
              type="range"
              min="1"
              max="40"
              value={loanTermSlider}
              step="1"
              onChange={(e) => {
                setLoanTermSlider(e.target.value);
                setLoanTerm(e.target.value);
              }}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">
              Down Payment
            </label>
            <input
              id="downPayment"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              min="0"
              className={`w-full p-3 rounded-lg border border-gray-300 ${
                theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
              } focus:ring-red-500 focus:border-red-500`}
              aria-label="Down payment"
            />
            <select
              id="downPaymentType"
              value={downPaymentType}
              onChange={(e) => setDownPaymentType(e.target.value)}
              className={`w-full p-3 mt-2 rounded-lg border border-gray-300 ${
                theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
              } focus:ring-red-500 focus:border-red-500`}
              aria-label="Down payment type"
            >
              <option value="amount">Amount</option>
              <option value="percent">Percent (%)</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => setAdditionalCostsOpen(!additionalCostsOpen)}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 text-center"
              aria-label="Toggle additional costs"
            >
              Additional Costs
            </button>
            <div className={`space-y-4 mt-2 ${additionalCostsOpen ? "block" : "hidden"}`}>
              <div>
                <label htmlFor="propertyTax" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Tax (Annual)
                </label>
                <input
                  id="propertyTax"
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(e.target.value)}
                  min="0"
                  className={`w-full p-3 rounded-lg border border-gray-300 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
                  } focus:ring-red-500 focus:border-red-500`}
                  aria-label="Property tax"
                />
              </div>
              <div>
                <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
                  Home Insurance (Annual)
                </label>
                <input
                  id="insurance"
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  min="0"
                  className={`w-full p-3 rounded-lg border border-gray-300 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
                  } focus:ring-red-500 focus:border-red-500`}
                  aria-label="Insurance"
                />
              </div>
              <div>
                <label htmlFor="hoa" className="block text-sm font-medium text-gray-700 mb-1">
                  HOA Fees (Monthly)
                </label>
                <input
                  id="hoa"
                  type="number"
                  value={hoa}
                  onChange={(e) => setHoa(e.target.value)}
                  min="0"
                  className={`w-full p-3 rounded-lg border border-gray-300 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
                  } focus:ring-red-500 focus:border-red-500`}
                  aria-label="HOA fees"
                />
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => setExtraPaymentsOpen(!extraPaymentsOpen)}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 text-center"
              aria-label="Toggle extra payments"
            >
              Extra Payments
            </button>
            <div className={`space-y-4 mt-2 ${extraPaymentsOpen ? "block" : "hidden"}`}>
              <div>
                <label htmlFor="extraMonthly" className="block text-sm font-medium text-gray-700 mb-1">
                  Extra Monthly Payment
                </label>
                <input
                  id="extraMonthly"
                  type="number"
                  value={extraMonthly}
                  onChange={(e) => setExtraMonthly(e.target.value)}
                  min="0"
                  className={`w-full p-3 rounded-lg border border-gray-300 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
                  } focus:ring-red-500 focus:border-red-500`}
                  aria-label="Extra monthly payment"
                />
              </div>
              <div>
                <label htmlFor="extraOneTime" className="block text-sm font-medium text-gray-700 mb-1">
                  One-Time Extra Payment
                </label>
                <input
                  id="extraOneTime"
                  type="number"
                  value={extraOneTime}
                  onChange={(e) => setExtraOneTime(e.target.value)}
                  min="0"
                  className={`w-full p-3 rounded-lg border border-gray-300 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
                  } focus:ring-red-500 focus:border-red-500`}
                  aria-label="One-time extra payment"
                />
              </div>
              <div>
                <label htmlFor="extraOneTimeMonth" className="block text-sm font-medium text-gray-700 mb-1">
                  Month of One-Time Payment
                </label>
                <input
                  id="extraOneTimeMonth"
                  type="number"
                  value={extraOneTimeMonth}
                  onChange={(e) => setExtraOneTimeMonth(e.target.value)}
                  min="1"
                  className={`w-full p-3 rounded-lg border border-gray-300 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
                  } focus:ring-red-500 focus:border-red-500`}
                  aria-label="Month of one-time payment"
                />
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 text-center"
              aria-label="Toggle advanced options"
            >
              Advanced Options
            </button>
            <div className={`space-y-4 mt-2 ${advancedOptionsOpen ? "block" : "hidden"}`}>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full p-3 rounded-lg border border-gray-300 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
                  } focus:ring-red-500 focus:border-red-500`}
                  aria-label="Start date"
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
                  className={`w-full p-3 rounded-lg border border-gray-300 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
                  } focus:ring-red-500 focus:border-red-500`}
                  aria-label="Currency"
                >
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="INR">₹ INR</option>
                </select>
              </div>
              <div>
                <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Income
                </label>
                <input
                  id="income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  min="0"
                  className={`w-full p-3 rounded-lg border border-gray-300 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
                  } focus:ring-red-500 focus:border-red-500`}
                  aria-label="Income"
                />
              </div>
              <div>
                <label htmlFor="dti" className="block text-sm font-medium text-gray-700 mb-1">
                  Debt-to-Income Ratio (%)
                </label>
                <input
                  id="dti"
                  type="number"
                  value={dti}
                  onChange={(e) => setDti(e.target.value)}
                  min="0"
                  max="100"
                  className={`w-full p-3 rounded-lg border border-gray-300 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600 text-white"
                  } focus:ring-red-500 focus:border-red-500`}
                  aria-label="Debt-to-income ratio"
                />
              </div>
            </div>
          </div>
          <button
            onClick={calculateMortgage}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:scale-105 transition-transform"
            aria-label="Calculate mortgage"
          >
            Calculate Mortgage
          </button>
        </div>
        {results && (
          <table
            className={`w-full border-collapse rounded-lg overflow-hidden mt-4 ${
              theme === "light" ? "bg-gray-200" : "bg-gray-600"
            }`}
          >
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className={theme === "light" ? "bg-gray-100" : "bg-gray-700"}>
                <td className="p-2">Monthly Payment</td>
                <td className="p-2">{formatCurrency(results.monthlyPayment)}</td>
              </tr>
              <tr className={theme === "light" ? "bg-gray-200" : "bg-gray-600"}>
                <td className="p-2">Total Interest</td>
                <td className="p-2">{formatCurrency(results.totalInterest)}</td>
              </tr>
              <tr className={theme === "light" ? "bg-gray-100" : "bg-gray-700"}>
                <td className="p-2">Total Cost</td>
                <td className="p-2">{formatCurrency(results.totalCost)}</td>
              </tr>
              <tr className={theme === "light" ? "bg-gray-200" : "bg-gray-600"}>
                <td className="p-2">Payoff Date</td>
                <td className="p-2">{results.payoffDate.toLocaleDateString("en-US")}</td>
              </tr>
              <tr className={theme === "light" ? "bg-gray-100" : "bg-gray-700"}>
                <td className="p-2">Months Saved</td>
                <td className="p-2">{results.monthsSaved}</td>
              </tr>
              <tr className={theme === "light" ? "bg-gray-200" : "bg-gray-600"}>
                <td className="p-2">Affordable Payment</td>
                <td className="p-2">{formatCurrency(results.affordability)}</td>
              </tr>
            </tbody>
          </table>
        )}
        {amortizationData.length > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={downloadAmortization}
              className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
              aria-label="Download amortization schedule"
            >
              Download Amortization Schedule
            </button>
          </div>
        )}
        <div className="mt-4 text-center text-gray-600">Amortization chart not implemented in this demo.</div>
      </div>
      <style jsx>{`
        input:focus,
        select:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
        }
        input[type="range"] {
          accent-color: #ef4444;
        }
        .dark {
          --tw-bg-opacity: 1;
          background-color: rgb(26 32 44 / var(--tw-bg-opacity));
          --tw-text-opacity: 1;
          color: rgb(255 255 255 / var(--tw-text-opacity));
        }
        .dark .bg-gray-600 {
          --tw-bg-opacity: 1;
          background-color: rgb(75 85 99 / var(--tw-bg-opacity));
        }
        .dark .bg-gray-700 {
          --tw-bg-opacity: 1;
          background-color: rgb(55 65 81 / var(--tw-bg-opacity));
        }
      `}</style>
    </div>
  );
}
