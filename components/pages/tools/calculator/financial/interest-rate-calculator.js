"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [calcType, setCalcType] = useState("simple");
  const [principal, setPrincipal] = useState("10000");
  const [principalSlider, setPrincipalSlider] = useState("10000");
  const [interestRate, setInterestRate] = useState("5");
  const [interestRateSlider, setInterestRateSlider] = useState("5");
  const [timePeriod, setTimePeriod] = useState("5");
  const [compounding, setCompounding] = useState("12");
  const [paymentFrequency, setPaymentFrequency] = useState("12");
  const [contributions, setContributions] = useState("0");
  const [contributionFrequency, setContributionFrequency] = useState("12");
  const [taxRate, setTaxRate] = useState("0");
  const [inflationRate, setInflationRate] = useState("2");
  const [originationFee, setOriginationFee] = useState("0");
  const [annualExpenses, setAnnualExpenses] = useState("30000");
  const [savingsRate, setSavingsRate] = useState("20");
  const [dti, setDti] = useState("36");
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [activeSections, setActiveSections] = useState({
    taxAndInflation: false,
    advancedOptions: false,
  });

  useEffect(() => {
    setPrincipal(principalSlider);
  }, [principalSlider]);

  useEffect(() => {
    setInterestRate(interestRateSlider);
  }, [interestRateSlider]);

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[curr]} ${parseFloat(amount || 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  };

  const toggleSection = (section) => {
    setActiveSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const calculateInterest = () => {
    setError("");
    setStatus("");
    setResults(null);

    const parsed = {
      principal: parseFloat(principal) || 0,
      interestRate: parseFloat(interestRate) / 100 || 0,
      timePeriod: parseFloat(timePeriod) || 0,
      compounding: parseInt(compounding) || 1,
      paymentFrequency: parseInt(paymentFrequency) || 12,
      contributions: parseFloat(contributions) || 0,
      contributionFrequency: parseInt(contributionFrequency) || 12,
      taxRate: parseFloat(taxRate) / 100 || 0,
      inflationRate: parseFloat(inflationRate) / 100 || 0,
      originationFee: parseFloat(originationFee) || 0,
      annualExpenses: parseFloat(annualExpenses) || 0,
      savingsRate: parseFloat(savingsRate) / 100 || 0,
      dti: parseFloat(dti) / 100 || 0.36,
    };

    if (
      parsed.principal < 0 ||
      parsed.interestRate < 0 ||
      parsed.timePeriod < 0 ||
      parsed.contributions < 0 ||
      parsed.originationFee < 0
    ) {
      setError("Principal, rates, time, contributions, and fees must be non-negative");
      return;
    }
    if (
      parsed.taxRate < 0 ||
      parsed.taxRate > 1 ||
      parsed.inflationRate < 0 ||
      parsed.savingsRate < 0 ||
      parsed.savingsRate > 1 ||
      parsed.dti < 0 ||
      parsed.dti > 1
    ) {
      setError("Rates must be between 0% and 100%");
      return;
    }
    if (parsed.annualExpenses < 0) {
      setError("Expenses must be non-negative");
      return;
    }

    try {
      let totalInterest = 0;
      let finalAmount = 0;
      let monthlyPayment = 0;
      let detailedData = [];
      let effectiveAnnualRate = 0;
      let realInterestRate = parsed.interestRate / (1 + parsed.inflationRate) - parsed.inflationRate;

      if (calcType === "simple") {
        totalInterest = parsed.principal * parsed.interestRate * parsed.timePeriod;
        finalAmount = parsed.principal + totalInterest;
        for (let year = 1; year <= parsed.timePeriod; year++) {
          detailedData.push({
            period: `Year ${year}`,
            amount: parsed.principal + parsed.principal * parsed.interestRate * year,
          });
        }
      } else if (calcType === "compound") {
        finalAmount =
          parsed.principal *
          Math.pow(1 + parsed.interestRate / parsed.compounding, parsed.compounding * parsed.timePeriod);
        totalInterest = finalAmount - parsed.principal;
        effectiveAnnualRate = Math.pow(1 + parsed.interestRate / parsed.compounding, parsed.compounding) - 1;
        for (let year = 1; year <= parsed.timePeriod; year++) {
          detailedData.push({
            period: `Year ${year}`,
            amount:
              parsed.principal *
              Math.pow(1 + parsed.interestRate / parsed.compounding, parsed.compounding * year),
          });
        }
      } else if (calcType === "loan") {
        const periods = parsed.timePeriod * parsed.paymentFrequency;
        const ratePerPeriod = parsed.interestRate / parsed.paymentFrequency;
        monthlyPayment =
          (parsed.principal * ratePerPeriod * Math.pow(1 + ratePerPeriod, periods)) /
          (Math.pow(1 + ratePerPeriod, periods) - 1);
        let balance = parsed.principal + parsed.originationFee;
        let totalInterestPaid = 0;
        for (let period = 1; period <= periods; period++) {
          const interest = balance * ratePerPeriod;
          const principalPayment = monthlyPayment - interest;
          balance -= principalPayment;
          totalInterestPaid += interest;
          if (period % parsed.paymentFrequency === 0 || period === periods) {
            detailedData.push({
              period: `Year ${Math.ceil(period / parsed.paymentFrequency)}`,
              amount: balance,
              interest,
              principal: principalPayment,
            });
          }
        }
        totalInterest = totalInterestPaid;
        finalAmount = parsed.principal + totalInterest + parsed.originationFee;
      } else if (calcType === "savings") {
        const periods = parsed.timePeriod * parsed.contributionFrequency;
        const ratePerPeriod = parsed.interestRate / parsed.contributionFrequency;
        const compoundFactor = Math.pow(1 + ratePerPeriod, periods);
        finalAmount =
          parsed.principal * compoundFactor +
          parsed.contributions * ((compoundFactor - 1) / ratePerPeriod) * (1 + ratePerPeriod);
        totalInterest = finalAmount - parsed.principal - parsed.contributions * periods;
        effectiveAnnualRate = Math.pow(1 + parsed.interestRate / parsed.compounding, parsed.compounding) - 1;
        let balance = parsed.principal;
        for (let period = 1; period <= periods; period++) {
          balance = balance * (1 + ratePerPeriod) + parsed.contributions;
          if (period % parsed.contributionFrequency === 0 || period === periods) {
            detailedData.push({
              period: `Year ${Math.ceil(period / parsed.contributionFrequency)}`,
              amount: balance,
            });
          }
        }
      }

      const netInterest = totalInterest * (1 - parsed.taxRate);
      const inflationAdjustedAmount = finalAmount / Math.pow(1 + parsed.inflationRate, parsed.timePeriod);
      const monthlyPaymentForLoan = calcType === "loan" ? monthlyPayment : 0;
      const monthlyNetIncome = calcType === "savings" ? netInterest / (parsed.timePeriod * 12) : 0;
      const monthlyExpenses = parsed.annualExpenses / 12;
      const monthlySavings = monthlyNetIncome * parsed.savingsRate;
      const surplus = monthlyNetIncome - monthlyExpenses - monthlySavings - monthlyPaymentForLoan;
      const affordablePayment = (monthlyNetIncome + monthlyExpenses) * parsed.dti;

      const summaryMetrics = [
        { label: "Principal/Loan Amount", value: formatCurrency(parsed.principal) },
        { label: "Total Interest", value: formatCurrency(totalInterest) },
        { label: "Final Amount", value: formatCurrency(finalAmount) },
        {
          label: calcType === "loan" ? "Monthly Payment" : "Net Interest (After Tax)",
          value: formatCurrency(calcType === "loan" ? monthlyPayment : netInterest),
        },
        { label: "Inflation-Adjusted Amount", value: formatCurrency(inflationAdjustedAmount) },
        {
          label: "Effective Annual Rate",
          value: effectiveAnnualRate ? `${(effectiveAnnualRate * 100).toFixed(2)}%` : "N/A",
        },
        { label: "Real Interest Rate", value: `${(realInterestRate * 100).toFixed(2)}%` },
        {
          label: calcType === "loan" ? "Total Cost (with Fees)" : "Monthly Surplus",
          value: formatCurrency(calcType === "loan" ? finalAmount : surplus),
        },
        { label: "Affordable Payment", value: formatCurrency(affordablePayment) },
      ];

      let csv = calcType === "loan" ? "Period,Balance,Interest,Principal\n" : "Period,Amount\n";
      detailedData.forEach((item) => {
        if (calcType === "loan") {
          csv += `${item.period},${item.amount.toFixed(2)},${item.interest.toFixed(
            2
          )},${item.principal.toFixed(2)}\n`;
        } else {
          csv += `${item.period},${item.amount.toFixed(2)}\n`;
        }
      });

      const tips = [];
      if (parsed.interestRate > 0.06 && calcType === "loan")
        tips.push("Consider refinancing to a lower interest rate.");
      if (calcType === "savings" && parsed.contributions === 0)
        tips.push("Add regular contributions to maximize savings growth.");
      if (parsed.inflationRate > parsed.interestRate)
        tips.push("Real return is negative; explore higher-yield investments.");
      if (surplus < 0 && calcType === "loan") tips.push("Review expenses to accommodate loan payments.");

      setResults({
        summaryMetrics,
        detailedData,
        csv,
        tips,
      });

      alert("Interest chart not implemented in this demo.");
    } catch (error) {
      setError("Error calculating interest. Check console for details.");
      console.error("Calculation error:", error);
    }
  };

  const sortDetailedTable = (column) => {
    if (!results) return;
    const isAmount = column === "amount";
    const isAscending = results.sortOrder?.column === column && results.sortOrder?.direction === "asc";
    const direction = isAscending ? "desc" : "asc";
    const sortedData = [...results.detailedData].sort((a, b) => {
      const aValue = isAmount ? a.amount : a.period;
      const bValue = isAmount ? b.amount : b.period;
      if (isAmount) {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    setResults({
      ...results,
      detailedData: sortedData,
      sortOrder: { column, direction },
    });
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4 relative">
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
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">
          Advanced Interest Rate Calculator
        </h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {status && <div className="text-yellow-400 text-center mb-4">{status}</div>}

        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Calculation Type
          </label>
          <select
            value={calcType}
            onChange={(e) => setCalcType(e.target.value)}
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          >
            <option value="simple">Simple Interest</option>
            <option value="compound">Compound Interest</option>
            <option value="loan">Loan Interest</option>
            <option value="savings">Savings Growth</option>
          </select>

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
            Principal/Loan Amount
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            min="0"
            step="100"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />
          <input
            type="range"
            min="0"
            max="1000000"
            value={principalSlider}
            onChange={(e) => setPrincipalSlider(e.target.value)}
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
            min="0"
            step="0.1"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />
          <input
            type="range"
            min="0"
            max="20"
            value={interestRateSlider}
            onChange={(e) => setInterestRateSlider(e.target.value)}
            step="0.1"
            className="w-full mt-2 accent-red-500"
          />

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
            Time Period (Years)
          </label>
          <input
            type="number"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            min="0"
            step="0.1"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />

          {(calcType === "compound" || calcType === "savings") && (
            <>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
                Compounding Frequency
              </label>
              <select
                value={compounding}
                onChange={(e) => setCompounding(e.target.value)}
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="1">Annually</option>
                <option value="2">Semi-Annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
              </select>
            </>
          )}

          {calcType === "loan" && (
            <>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
                Payment Frequency
              </label>
              <select
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="12">Monthly</option>
                <option value="4">Quarterly</option>
                <option value="1">Annually</option>
              </select>
            </>
          )}

          {calcType === "savings" && (
            <>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
                Regular Contributions (Per Period)
              </label>
              <input
                type="number"
                value={contributions}
                onChange={(e) => setContributions(e.target.value)}
                min="0"
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
              />

              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
                Contribution Frequency
              </label>
              <select
                value={contributionFrequency}
                onChange={(e) => setContributionFrequency(e.target.value)}
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="12">Monthly</option>
                <option value="4">Quarterly</option>
                <option value="1">Annually</option>
              </select>
            </>
          )}
        </div>

        <div className="mb-4">
          <div
            onClick={() => toggleSection("taxAndInflation")}
            className="bg-red-500 text-white p-3 rounded-lg text-center cursor-pointer hover:bg-red-600"
          >
            Tax and Inflation
          </div>
          <div
            className={`transition-all duration-300 ${activeSections.taxAndInflation ? "block" : "hidden"}`}
          >
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mt-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Tax Rate on Interest (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                min="0"
                max="100"
                step="0.1"
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
              />

              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
                Inflation Rate (%)
              </label>
              <input
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                min="0"
                step="0.1"
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div
            onClick={() => toggleSection("advancedOptions")}
            className="bg-red-500 text-white p-3 rounded-lg text-center cursor-pointer hover:bg-red-600"
          >
            Advanced Options
          </div>
          <div
            className={`transition-all duration-300 ${activeSections.advancedOptions ? "block" : "hidden"}`}
          >
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mt-2">
              {calcType === "loan" && (
                <>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Loan Origination Fee
                  </label>
                  <input
                    type="number"
                    value={originationFee}
                    onChange={(e) => setOriginationFee(e.target.value)}
                    min="0"
                    className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </>
              )}

              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
                Annual Expenses
              </label>
              <input
                type="number"
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(e.target.value)}
                min="0"
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
              />

              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
                Savings Rate (% of Net Income)
              </label>
              <input
                type="number"
                value={savingsRate}
                onChange={(e) => setSavingsRate(e.target.value)}
                min="0"
                max="100"
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
              />

              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
                Debt-to-Income Ratio (%)
              </label>
              <input
                type="number"
                value={dti}
                onChange={(e) => setDti(e.target.value)}
                min="0"
                max="100"
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
              />

              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="INR">₹ INR</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={calculateInterest}
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:scale-105 transition-transform"
        >
          Calculate Interest
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

            <table className="w-full border-collapse bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mt-6 max-h-80 overflow-y-auto block">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th
                    onClick={() => sortDetailedTable("period")}
                    className="p-3 cursor-pointer hover:bg-red-600"
                  >
                    Period
                  </th>
                  <th
                    onClick={() => sortDetailedTable("amount")}
                    className="p-3 cursor-pointer hover:bg-red-600"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.detailedData.map((item, i) => (
                  <tr key={item.period} className={i % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : ""}>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{item.period}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {calcType === "loan"
                        ? `Balance: ${formatCurrency(item.amount)}, Interest: ${formatCurrency(
                            item.interest
                          )}`
                        : formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6">
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Interest chart not implemented in this demo.
              </p>
            </div>

            <div className="mt-6 text-center">
              <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(results.csv)}`}
                download={calcType === "loan" ? "amortization_schedule.csv" : "interest_growth.csv"}
                className="text-red-500 hover:underline"
              >
                Download {calcType === "loan" ? "Amortization Schedule" : "Growth Schedule"}
              </a>
              {results.tips.length > 0 && (
                <div className="mt-4">
                  <strong className="text-gray-700 dark:text-gray-200">Financial Planning Tips:</strong>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                    {results.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
