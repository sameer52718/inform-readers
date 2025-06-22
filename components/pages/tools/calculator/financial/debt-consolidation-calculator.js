"use client";

import { useState } from "react";

export default function Home() {
  const [balance, setBalance] = useState("5000");
  const [apr, setApr] = useState("18");
  const [minPayment, setMinPayment] = useState("2.5");
  const [loanAmount, setLoanAmount] = useState("0");
  const [loanApr, setLoanApr] = useState("7");
  const [loanTerm, setLoanTerm] = useState("3");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const formatCurrency = (amount) => {
    return `$ ${parseFloat(amount).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  };

  const calculateConsolidation = () => {
    setError("");
    setStatus("Calculating...");
    setResults(null);

    const parsedBalance = parseFloat(balance) || 0;
    const parsedApr = parseFloat(apr) / 100 || 0;
    const parsedMinPaymentPercent = parseFloat(minPayment) || 0;
    const parsedLoanAmount = parseFloat(loanAmount) || 0;
    const parsedLoanApr = parseFloat(loanApr) / 100 || 0;
    const parsedLoanTerm = parseInt(loanTerm) || 0;

    if (parsedBalance <= 0 || parsedMinPaymentPercent <= 0 || parsedApr < 0) {
      setError("Debt balance and minimum payment must be positive; APR must be non-negative");
      setStatus("");
      return;
    }
    if (
      parsedLoanAmount > 0 &&
      (parsedLoanAmount > parsedBalance || parsedLoanApr < 0 || parsedLoanTerm <= 0)
    ) {
      setError("Loan amount must not exceed debt balance, APR must be non-negative, term must be positive");
      setStatus("");
      return;
    }

    try {
      // Debt payoff (no consolidation)
      let debtBalance = parsedBalance;
      const debtMonthlyRate = parsedApr / 12;
      let debtInterest = 0;
      let debtMonths = 0;
      const debtSchedule = [];
      let minPaymentValue = Math.max(25, debtBalance * (parsedMinPaymentPercent / 100));

      while (debtBalance > 0 && debtMonths < 1200) {
        debtMonths++;
        const interest = debtBalance * debtMonthlyRate;
        minPaymentValue = Math.max(25, debtBalance * (parsedMinPaymentPercent / 100));
        const payment = Math.min(minPaymentValue, debtBalance + interest);
        debtBalance = Math.max(0, debtBalance + interest - payment);
        debtInterest += interest;
        debtSchedule.push({ month: debtMonths, payment, interest, balance: debtBalance });
      }

      if (debtMonths >= 1200) {
        setError("Debt payoff takes too long. Increase minimum payment.");
        setStatus("");
        return;
      }

      // Consolidation loan payoff
      let loanBalance = parsedLoanAmount;
      let loanInterest = 0;
      let loanMonths = 0;
      let totalBalance = parsedBalance;
      let totalInterest = debtInterest;
      let totalMonths = debtMonths;
      const loanSchedule = [];

      if (parsedLoanAmount > 0) {
        const loanMonthlyRate = parsedLoanApr / 12;
        const loanMonthsTotal = parsedLoanTerm * 12;
        const loanPayment =
          (loanBalance * (loanMonthlyRate * Math.pow(1 + loanMonthlyRate, loanMonthsTotal))) /
          (Math.pow(1 + loanMonthlyRate, loanMonthsTotal) - 1);
        debtBalance = parsedBalance - parsedLoanAmount; // Remaining debt after loan

        // Pay remaining debt
        let remainingMonths = 0;
        while (debtBalance > 0 && remainingMonths < 1200) {
          remainingMonths++;
          const interest = debtBalance * debtMonthlyRate;
          minPaymentValue = Math.max(25, debtBalance * (parsedMinPaymentPercent / 100));
          const payment = Math.min(minPaymentValue, debtBalance + interest);
          debtBalance = Math.max(0, debtBalance + interest - payment);
          loanInterest += interest;
          loanSchedule.push({
            month: remainingMonths,
            payment,
            interest,
            balance: debtBalance,
            type: "Debt",
          });
        }

        // Pay loan
        loanMonths = loanMonthsTotal;
        for (let i = 1; i <= loanMonths && loanBalance > 0; i++) {
          const interest = loanBalance * loanMonthlyRate;
          const payment = Math.min(loanPayment, loanBalance + interest);
          loanBalance = Math.max(0, loanBalance + interest - payment);
          loanInterest += interest;
          loanSchedule.push({ month: i, payment, interest, balance: loanBalance, type: "Loan" });
        }

        totalInterest = debtInterest + loanInterest;
        totalMonths = Math.max(remainingMonths, loanMonths);
      }

      // Progress bar
      const initialBalance = parsedBalance;
      const currentBalance = debtBalance + loanBalance;
      const percent = Math.max(0, 100 - (currentBalance / initialBalance) * 100);
      setProgress(percent);

      // Summary table
      const consolidationSavings = parsedLoanAmount > 0 ? debtInterest - totalInterest : 0;
      setResults([
        { label: "Total Balance", value: formatCurrency(totalBalance) },
        { label: "Payoff Timeline (Months)", value: totalMonths },
        { label: "Total Interest Paid", value: formatCurrency(totalInterest) },
        { label: "Consolidation Savings", value: formatCurrency(consolidationSavings) },
      ]);

      setStatus("Calculation complete!");
      alert("Chart not implemented in this demo.");
    } catch (error) {
      setError("Error in calculation. Check console for details.");
      setStatus("");
      console.error("Calculation error:", error);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-lg shadow-2xl p-6 max-w-md w-full animate-slide-in">
        <h1 className="text-xl font-bold text-red-500 mb-5 text-center">Debt Consolidation Calculator</h1>
        <div className="space-y-4">
          {[
            { label: "Debt Balance ($)", key: "balance", value: balance, onChange: setBalance, step: "100" },
            { label: "Debt APR (%)", key: "apr", value: apr, onChange: setApr, step: "0.1" },
            {
              label: "Minimum Payment (% of Balance)",
              key: "minPayment",
              value: minPayment,
              onChange: setMinPayment,
              step: "0.1",
            },
            {
              label: "Consolidation Loan Amount ($)",
              key: "loanAmount",
              value: loanAmount,
              onChange: setLoanAmount,
              step: "100",
            },
            { label: "Loan APR (%)", key: "loanApr", value: loanApr, onChange: setLoanApr, step: "0.1" },
            {
              label: "Loan Term (Years)",
              key: "loanTerm",
              value: loanTerm,
              onChange: setLoanTerm,
              step: "1",
            },
          ].map(({ label, key, value, onChange, step }) => (
            <div key={key} className="input-group">
              <label className="block text-xs font-bold text-gray-600 mb-1">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                step={step}
                min="0"
                className="w-full p-2 bg-white border rounded-md text-sm text-gray-800 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          ))}
        </div>
        <div className="progress-bar h-2 bg-gray-400 rounded-full mt-2 overflow-hidden">
          <div className="progress-fill h-full bg-red-500" style={{ width: `${progress}%` }}></div>
        </div>
        <button
          onClick={calculateConsolidation}
          className="w-full p-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 mt-4"
        >
          Calculate Consolidation
        </button>
        {results && (
          <table className="w-full text-sm text-gray-600 mt-4 bg-white rounded-md overflow-hidden">
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="p-2">Metric</th>
                <th className="p-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {results.map((metric, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="p-2">{metric.label}</td>
                  <td className="p-2">{metric.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-4 text-center text-gray-600">Balance chart not implemented in this demo.</div>
        <div className="mt-4 text-center">
          <a
            onClick={() => alert("CSV download not implemented in this demo.")}
            className="text-red-500 hover:underline cursor-pointer"
          >
            Download Payoff Schedule (CSV)
          </a>
        </div>
        {status && <div className="mt-4 text-center text-yellow-500">{status}</div>}
        {error && <div className="mt-4 text-center text-red-400">{error}</div>}

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
          .progress-fill {
            transition: width 0.5s ease;
          }
        `}</style>
      </div>
    </div>
  );
}
