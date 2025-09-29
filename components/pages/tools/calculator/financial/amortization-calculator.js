"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    loanType: "personal",
    loanAmount: 10000,
    interestRate: 5,
    loanTerm: 36,
    downPayment: 0,
    downPaymentType: "amount",
    fees: 500,
    salesTax: 8,
    tradeIn: 0,
    propertyTax: 2000,
    insurance: 1000,
    hoa: 200,
    minPayment: 3,
    balanceTransfer: 0,
    extraMonthly: 0,
    extraOneTime: 0,
    extraOneTimeMonth: 1,
    startDate: "2025-05-01",
    currency: "USD",
    income: 50000,
    dti: 36,
  });
  const [summary, setSummary] = useState([]);
  const [amortization, setAmortization] = useState([]);
  const [error, setError] = useState("");
  const [showSections, setShowSections] = useState({
    additionalCosts: false,
    extraPayments: false,
    advancedOptions: false,
  });
  const chartRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "loanAmount",
        "interestRate",
        "loanTerm",
        "downPayment",
        "fees",
        "salesTax",
        "tradeIn",
        "propertyTax",
        "insurance",
        "hoa",
        "minPayment",
        "balanceTransfer",
        "extraMonthly",
        "extraOneTime",
        "extraOneTimeMonth",
        "income",
        "dti",
      ].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSliderChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[currency]} ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  };

  const calculateAmortization = () => {
    setError("");
    setSummary([]);
    setAmortization([]);
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    }

    const {
      loanType,
      loanAmount,
      interestRate,
      loanTerm,
      downPayment,
      downPaymentType,
      fees,
      salesTax,
      tradeIn,
      propertyTax,
      insurance,
      hoa,
      minPayment,
      balanceTransfer,
      extraMonthly,
      extraOneTime,
      extraOneTimeMonth,
      startDate,
      currency,
      income,
      dti,
    } = formData;

    if (loanAmount < 100) {
      setError("Loan amount must be at least 100");
      return;
    }
    if (interestRate < 0.1 || interestRate > 30) {
      setError("Interest rate must be between 0.1% and 30%");
      return;
    }
    if (loanTerm < 1 || loanTerm > 360) {
      setError("Loan term must be between 1 and 360 months");
      return;
    }
    let finalDownPayment = downPayment;
    if (downPaymentType === "percent") {
      if (downPayment < 0 || downPayment > 100) {
        setError("Down payment percentage must be between 0% and 100%");
        return;
      }
      finalDownPayment = (downPayment / 100) * loanAmount;
    }
    if (
      finalDownPayment < 0 ||
      fees < 0 ||
      tradeIn < 0 ||
      salesTax < 0 ||
      propertyTax < 0 ||
      insurance < 0 ||
      hoa < 0 ||
      balanceTransfer < 0
    ) {
      setError("Inputs cannot be negative");
      return;
    }
    if (salesTax > 20) {
      setError("Sales tax must be between 0% and 20%");
      return;
    }
    if (loanType === "credit" && minPayment < 1) {
      setError("Minimum payment must be at least 1%");
      return;
    }

    try {
      let principal = loanAmount;
      if (loanType === "auto") {
        const taxableAmount = loanAmount - tradeIn;
        const taxAmount = taxableAmount * (salesTax / 100);
        principal = loanAmount + taxAmount + fees - finalDownPayment - tradeIn;
      } else if (loanType === "mortgage") {
        principal = loanAmount - finalDownPayment + fees;
      } else if (loanType === "personal") {
        principal = loanAmount + fees - finalDownPayment;
      } else if (loanType === "credit") {
        principal = loanAmount + balanceTransfer;
      }

      let monthlyPayment = 0;
      let totalInterest = 0;
      const amortizationData = [];
      let monthsSaved = 0;
      let currentDate = new Date(startDate);
      const monthlyRate = interestRate / 100 / 12;

      if (loanType === "credit") {
        let remainingBalance = principal;
        let month = 1;
        while (remainingBalance > 0 && month <= 360) {
          const interest = remainingBalance * monthlyRate;
          const minPaymentAmount = Math.max(remainingBalance * (minPayment / 100), 20);
          const payment = Math.max(minPaymentAmount, monthlyPayment + extraMonthly);
          const principalPayment = payment - interest;
          let extra = month === extraOneTimeMonth ? extraOneTime : 0;
          remainingBalance -= principalPayment + extra;
          totalInterest += interest;
          if (remainingBalance < 0) remainingBalance = 0;
          amortizationData.push({
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
            monthsSaved = loanTerm - month;
            break;
          }
          month++;
        }
        monthlyPayment = amortizationData[0]?.payment - (amortizationData[0]?.extra || 0) || 0;
      } else {
        monthlyPayment =
          (principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm))) /
          (Math.pow(1 + monthlyRate, loanTerm) - 1);
        let remainingBalance = principal;
        for (let month = 1; month <= loanTerm && remainingBalance > 0; month++) {
          let extra = extraMonthly + (month === extraOneTimeMonth ? extraOneTime : 0);
          const interest = remainingBalance * monthlyRate;
          const principalPayment = monthlyPayment - interest;
          remainingBalance -= principalPayment + extra;
          totalInterest += interest;
          if (remainingBalance < 0) remainingBalance = 0;
          amortizationData.push({
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
            monthsSaved = loanTerm - month;
            break;
          }
        }
      }

      if (loanType === "mortgage") {
        monthlyPayment += (propertyTax + insurance) / 12 + hoa;
        amortizationData.forEach((entry) => {
          entry.payment += (propertyTax + insurance) / 12 + hoa;
        });
      }

      const payoffDate = amortizationData[amortizationData.length - 1]?.date || new Date();
      const totalCost =
        principal +
        totalInterest +
        (loanType === "mortgage" ? (propertyTax + insurance) * (loanTerm / 12) + hoa * loanTerm : 0);
      const affordability = (income * (dti / 100)) / 12;

      setSummary([
        { label: "Monthly Payment", value: formatCurrency(monthlyPayment, currency) },
        { label: "Total Interest", value: formatCurrency(totalInterest, currency) },
        { label: "Total Cost", value: formatCurrency(totalCost, currency) },
        { label: "Payoff Date", value: payoffDate.toLocaleDateString("en-US") },
        { label: "Months Saved", value: monthsSaved },
        { label: "Affordable Payment", value: formatCurrency(affordability, currency) },
      ]);

      setAmortization(amortizationData);

      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        chartRef.current.width = 580;
        chartRef.current.height = 200;
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(0, 0, chartRef.current.width, chartRef.current.height);
        const maxBalance = principal;
        const step = chartRef.current.width / Math.min(amortizationData.length, 360);
        amortizationData.forEach((entry, i) => {
          const x = i * step;
          const yPrincipal =
            chartRef.current.height - (entry.principal / maxBalance) * chartRef.current.height;
          const yInterest = chartRef.current.height - (entry.interest / maxBalance) * chartRef.current.height;
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(x, yPrincipal, step / 2, chartRef.current.height - yPrincipal);
          ctx.fillStyle = "#f87171";
          ctx.fillRect(x + step / 2, yInterest, step / 2, chartRef.current.height - yInterest);
        });
      }
    } catch (error) {
      setError("Error calculating amortization. Check console for details.");
      console.error("Calculation error:", error);
    }
  };

  const toggleSection = (section) => {
    setShowSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const sortTable = (index, isAscending) => {
    const sorted = [...amortization].sort((a, b) => {
      const aValue =
        index === 0
          ? a.month
          : index === 1
          ? a.date
          : index === 5 || index === 6
          ? a[["extra", "balance"][index - 5]]
          : a[["payment", "principal", "interest"][index - 2]];
      const bValue =
        index === 0
          ? b.month
          : index === 1
          ? b.date
          : index === 5 || index === 6
          ? b[["extra", "balance"][index - 5]]
          : b[["payment", "principal", "interest"][index - 2]];
      if (index === 0 || index === 5 || index === 6) {
        return isAscending ? aValue - bValue : bValue - aValue;
      } else if (index === 1) {
        return isAscending ? aValue - bValue : bValue - aValue;
      } else {
        return isAscending ? aValue - bValue : bValue - aValue;
      }
    });
    setAmortization(sorted);
  };

  const exportCSV = () => {
    if (amortization.length === 0) return;
    let csv = "Month,Date,Payment,Principal,Interest,Extra,Balance\n";
    amortization.forEach((entry) => {
      csv += `${entry.month},${entry.date.toLocaleDateString("en-US")},${entry.payment.toFixed(
        2
      )},${entry.principal.toFixed(2)},${entry.interest.toFixed(2)},${entry.extra.toFixed(
        2
      )},${entry.balance.toFixed(2)}\n`;
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
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-xl w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Advanced Amortization Calculator
          </h1>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          <div className="mb-4">
            {[
              {
                label: "Loan Type",
                name: "loanType",
                type: "select",
                options: ["personal", "auto", "mortgage", "credit"],
              },
              { label: "Loan Amount", name: "loanAmount", type: "number", min: 100, step: 100 },
              { label: "", name: "loanAmount", type: "range", min: 100, max: 1000000, step: 100 },
              {
                label: "Annual Interest Rate (%)",
                name: "interestRate",
                type: "number",
                min: 0.1,
                max: 30,
                step: 0.1,
              },
              { label: "", name: "interestRate", type: "range", min: 0.1, max: 30, step: 0.1 },
              { label: "Loan Term (Months)", name: "loanTerm", type: "number", min: 1, max: 360 },
              { label: "", name: "loanTerm", type: "range", min: 1, max: 360 },
              { label: "Down Payment (Amount or %)", name: "downPayment", type: "number", min: 0 },
              {
                label: "Down Payment Type",
                name: "downPaymentType",
                type: "select",
                options: ["amount", "percent"],
              },
            ].map(({ label, name, type, min, max, step, options }, index) => (
              <div key={index} className="mb-3">
                {label && <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>}
                {type === "select" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:border-red-500"
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {name === "loanType"
                          ? opt.charAt(0).toUpperCase() + opt.slice(1) + " Loan"
                          : opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : type === "range" ? (
                  <input
                    type="range"
                    name={name}
                    value={formData[name]}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => handleSliderChange(name, e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    min={min}
                    max={max}
                    step={step}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:border-red-500"
                  />
                )}
              </div>
            ))}
          </div>
          {[
            {
              title: "Additional Costs",
              key: "additionalCosts",
              fields: [
                { label: "Fees (Origination, Processing)", name: "fees", type: "number", min: 0 },
                {
                  label: "Sales Tax (%)",
                  name: "salesTax",
                  type: "number",
                  min: 0,
                  max: 20,
                  step: 0.1,
                  class: "auto-specific",
                },
                { label: "Trade-In Value", name: "tradeIn", type: "number", min: 0, class: "auto-specific" },
                {
                  label: "Property Tax (Annual)",
                  name: "propertyTax",
                  type: "number",
                  min: 0,
                  class: "mortgage-specific",
                },
                {
                  label: "Home Insurance (Annual)",
                  name: "insurance",
                  type: "number",
                  min: 0,
                  class: "mortgage-specific",
                },
                {
                  label: "HOA Fees (Monthly)",
                  name: "hoa",
                  type: "number",
                  min: 0,
                  class: "mortgage-specific",
                },
                {
                  label: "Minimum Payment (% of Balance)",
                  name: "minPayment",
                  type: "number",
                  min: 1,
                  max: 10,
                  step: 0.1,
                  class: "credit-specific",
                },
                {
                  label: "Balance Transfer Fee",
                  name: "balanceTransfer",
                  type: "number",
                  min: 0,
                  class: "credit-specific",
                },
              ],
            },
            {
              title: "Extra Payments",
              key: "extraPayments",
              fields: [
                { label: "Extra Monthly Payment", name: "extraMonthly", type: "number", min: 0 },
                { label: "One-Time Extra Payment", name: "extraOneTime", type: "number", min: 0 },
                { label: "Month of One-Time Payment", name: "extraOneTimeMonth", type: "number", min: 1 },
              ],
            },
            {
              title: "Advanced Options",
              key: "advancedOptions",
              fields: [
                { label: "Start Date", name: "startDate", type: "date" },
                { label: "Currency", name: "currency", type: "select", options: ["USD", "EUR", "INR"] },
                { label: "Annual Income", name: "income", type: "number", min: 0 },
                { label: "Debt-to-Income Ratio (%)", name: "dti", type: "number", min: 0, max: 100 },
              ],
            },
          ].map(({ title, key, fields }) => (
            <div key={key} className="mb-4">
              <div
                className="bg-red-500 text-white p-3 rounded-lg text-center cursor-pointer hover:bg-red-600"
                onClick={() => toggleSection(key)}
              >
                {title}
              </div>
              {showSections[key] && (
                <div className="mt-2">
                  {fields.map(({ label, name, type, min, max, step, options, class: fieldClass }, index) => (
                    <div
                      key={index}
                      className={`mb-3 ${
                        fieldClass && formData.loanType !== fieldClass.split("-")[0] ? "hidden" : ""
                      }`}
                    >
                      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                      {type === "select" ? (
                        <select
                          name={name}
                          value={formData[name]}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:border-red-500"
                        >
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt === "USD" ? "$ USD" : opt === "EUR" ? "€ EUR" : "₹ INR"}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={type}
                          name={name}
                          value={formData[name]}
                          min={min}
                          max={max}
                          step={step}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:border-red-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={calculateAmortization}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 w-full mb-4"
          >
            Calculate Amortization
          </button>
          {summary.length > 0 && (
            <table className="w-full text-sm text-gray-600 bg-white rounded-lg overflow-hidden mb-4">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3">Metric</th>
                  <th className="p-3">Value</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((metric, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="p-3">{metric.label}</td>
                    <td className="p-3">{metric.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {amortization.length > 0 && (
            <div className="max-h-80 overflow-y-auto mb-4">
              <table className="w-full text-sm text-gray-600 bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-red-500 text-white">
                    {["Month", "Date", "Payment", "Principal", "Interest", "Extra", "Balance"].map(
                      (header, index) => (
                        <th
                          key={index}
                          className="p-3 cursor-pointer hover:bg-red-600"
                          onClick={() => sortTable(index, amortization[0]?.sortOrder !== "asc")}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {amortization.map((entry, index) => (
                    <tr key={index} className="even:bg-gray-50">
                      <td className="p-3">{entry.month}</td>
                      <td className="p-3">{entry.date.toLocaleDateString("en-US")}</td>
                      <td className="p-3">{formatCurrency(entry.payment, formData.currency)}</td>
                      <td className="p-3">{formatCurrency(entry.principal, formData.currency)}</td>
                      <td className="p-3">{formatCurrency(entry.interest, formData.currency)}</td>
                      <td className="p-3">{formatCurrency(entry.extra, formData.currency)}</td>
                      <td className="p-3">{formatCurrency(entry.balance, formData.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <canvas ref={chartRef} className="w-full mb-4 border-2 border-gray-200 rounded-lg"></canvas>
          {amortization.length > 0 && (
            <div className="text-center">
              <a onClick={exportCSV} className="text-red-500 hover:underline cursor-pointer">
                Download Amortization Schedule
              </a>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        input[type="range"] {
          accent-color: #ef4444;
        }
      `}</style>
    </>
  );
}
