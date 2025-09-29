"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [investmentType, setInvestmentType] = useState("one-time");
  const [initialInvestment, setInitialInvestment] = useState("");
  const [contribution, setContribution] = useState("");
  const [contributionFrequency, setContributionFrequency] = useState("annually");
  const [investmentPeriod, setInvestmentPeriod] = useState("");
  const [returnRate, setReturnRate] = useState("");
  const [compounding, setCompounding] = useState("annually");
  const [inflationRate, setInflationRate] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [projectionData, setProjectionData] = useState([]);
  const [history, setHistory] = useState(
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("compoundInterestHistory")) || [] : []
  );
  const [comparisonData, setComparisonData] = useState([]);

  const formatCurrency = (amount, curr) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[curr]}${parseFloat(amount).toFixed(2)}`;
  };

  const calculateCompoundInterest = () => {
    const parsedInitialInvestment = parseFloat(initialInvestment) || 0;
    const parsedContribution = parseFloat(contribution) || 0;
    const parsedInvestmentPeriod = parseInt(investmentPeriod);
    const parsedReturnRate = parseFloat(returnRate) / 100;
    const parsedInflationRate = parseFloat(inflationRate) / 100 || 0;
    const parsedTaxRate = parseFloat(taxRate) / 100 || 0;

    if (isNaN(parsedInvestmentPeriod) || parsedInvestmentPeriod <= 0) {
      alert("Please enter a valid investment period");
      return;
    }
    if (isNaN(parsedReturnRate) || parsedReturnRate < 0) {
      alert("Please enter a valid return rate");
      return;
    }
    if (
      (investmentType === "one-time" || investmentType === "both") &&
      (isNaN(parsedInitialInvestment) || parsedInitialInvestment <= 0)
    ) {
      alert("Please enter a valid initial investment");
      return;
    }
    if (
      (investmentType === "recurring" || investmentType === "both") &&
      (isNaN(parsedContribution) || parsedContribution <= 0)
    ) {
      alert("Please enter a valid periodic contribution");
      return;
    }

    const compoundingPeriods = {
      annually: 1,
      "semi-annually": 2,
      quarterly: 4,
      monthly: 12,
      daily: 365,
    };
    const contributionPeriods = {
      annually: 1,
      "semi-annually": 2,
      quarterly: 4,
      monthly: 12,
    };
    const n = compoundingPeriods[compounding];
    const m = contributionPeriods[contributionFrequency];
    const ratePerPeriod = parsedReturnRate / n;
    const totalPeriods = parsedInvestmentPeriod * n;
    const contributionsPerYear = investmentType === "one-time" ? 0 : parsedContribution * m;

    let balance = investmentType === "recurring" ? 0 : parsedInitialInvestment;
    let totalContributions =
      investmentType === "one-time" ? 0 : parsedContribution * m * parsedInvestmentPeriod;
    let totalInterest = 0;
    let totalTaxes = 0;
    let newProjectionData = [];
    const nominalBalances = [balance];
    const realBalances = [balance / Math.pow(1 + parsedInflationRate, 0)];

    for (let year = 1; year <= parsedInvestmentPeriod; year++) {
      let yearBalance = balance;
      let yearInterest = 0;
      let yearTaxes = 0;
      let yearContribution = investmentType === "one-time" ? 0 : contributionsPerYear;

      for (let period = 1; period <= n; period++) {
        let periodContribution =
          period % (n / m) === 0 && investmentType !== "one-time" ? parsedContribution : 0;
        let interest = yearBalance * ratePerPeriod;
        let tax = interest * parsedTaxRate;
        yearInterest += interest;
        yearTaxes += tax;
        yearBalance = yearBalance * (1 + ratePerPeriod) - tax + periodContribution;
      }

      balance = yearBalance;
      totalInterest += yearInterest;
      totalTaxes += yearTaxes;
      newProjectionData.push({
        year,
        contribution: yearContribution,
        interest: yearInterest,
        taxes: yearTaxes,
        balance,
      });
      nominalBalances.push(balance);
      realBalances.push(balance / Math.pow(1 + parsedInflationRate, year));
    }

    const finalBalance = balance;
    const realBalance = finalBalance / Math.pow(1 + parsedInflationRate, parsedInvestmentPeriod);
    const effectiveAnnualReturn =
      n > 1
        ? (Math.pow(1 + ratePerPeriod * (1 - parsedTaxRate), n) - 1) * 100
        : parsedReturnRate * (1 - parsedTaxRate) * 100;

    setResults({
      initialInvestment: parsedInitialInvestment,
      totalContributions,
      totalInterest,
      finalBalance,
      realBalance,
      taxesPaid: totalTaxes,
      effectiveReturn: effectiveAnnualReturn.toFixed(2),
    });
    setProjectionData(newProjectionData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      investmentType,
      initialInvestment: formatCurrency(parsedInitialInvestment, currency),
      totalContributions: formatCurrency(totalContributions, currency),
      investmentPeriod: `${parsedInvestmentPeriod} years`,
      returnRate: `${(parsedReturnRate * 100).toFixed(2)}%`,
      compounding,
      contributionFrequency: investmentType === "one-time" ? "N/A" : contributionFrequency,
      inflationRate: `${(parsedInflationRate * 100).toFixed(2)}%`,
      taxRate: `${(parsedTaxRate * 100).toFixed(2)}%`,
      totalInterest: formatCurrency(totalInterest, currency),
      finalBalance: formatCurrency(finalBalance, currency),
      realBalance: formatCurrency(realBalance, currency),
      taxesPaid: formatCurrency(totalTaxes, currency),
      effectiveReturn: `${effectiveAnnualReturn.toFixed(2)}%`,
    };
    const newHistory = [...history, calculation];
    setHistory(newHistory);
    localStorage.setItem("compoundInterestHistory", JSON.stringify(newHistory));

    alert("Charts not implemented in this demo.");
  };

  const compareScenarios = () => {
    const parsedInitialInvestment = parseFloat(initialInvestment) || 0;
    const parsedContribution = parseFloat(contribution) || 0;
    const parsedInvestmentPeriod = parseInt(investmentPeriod);
    const parsedReturnRate = parseFloat(returnRate) / 100;
    const parsedInflationRate = parseFloat(inflationRate) / 100 || 0;
    const parsedTaxRate = parseFloat(taxRate) / 100 || 0;

    if (isNaN(parsedInvestmentPeriod) || isNaN(parsedReturnRate)) {
      alert("Please calculate compound interest first");
      return;
    }

    const compoundingPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12, daily: 365 };
    const contributionPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
    const n = compoundingPeriods[compounding];
    const m = contributionPeriods[contributionFrequency];

    const scenarios = [
      { label: "Base Case", rate: parsedReturnRate, contribution: parsedContribution },
      { label: "Higher Return (+1%)", rate: parsedReturnRate + 0.01, contribution: parsedContribution },
      {
        label: "Lower Return (-1%)",
        rate: Math.max(parsedReturnRate - 0.01, 0),
        contribution: parsedContribution,
      },
      { label: "Double Contribution", rate: parsedReturnRate, contribution: parsedContribution * 2 },
    ];

    const newComparisonData = scenarios.map((scenario) => {
      let balance = investmentType === "recurring" ? 0 : parsedInitialInvestment;
      let totalContributions =
        investmentType === "one-time" ? 0 : scenario.contribution * m * parsedInvestmentPeriod;
      let totalInterest = 0;
      const ratePerPeriod = scenario.rate / n;

      for (let year = 1; year <= parsedInvestmentPeriod; year++) {
        let yearBalance = balance;
        let yearInterest = 0;

        for (let period = 1; period <= n; period++) {
          let periodContribution =
            period % (n / m) === 0 && investmentType !== "one-time" ? scenario.contribution : 0;
          let interest = yearBalance * ratePerPeriod;
          let tax = interest * parsedTaxRate;
          yearInterest += interest;
          yearBalance = yearBalance * (1 + ratePerPeriod) - tax + periodContribution;
        }

        balance = yearBalance;
        totalInterest += yearInterest;
      }

      const finalBalance = balance;
      const realBalance = finalBalance / Math.pow(1 + parsedInflationRate, parsedInvestmentPeriod);
      return { label: scenario.label, finalBalance, realBalance, totalInterest };
    });

    setComparisonData(newComparisonData);
  };

  const exportProjections = () => {
    if (projectionData.length === 0) {
      alert("No projection data to export");
      return;
    }
    alert("Export not implemented in this demo.");
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full flex gap-8 flex-col md:flex-row animate-slide-in">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-red-500 mb-6 text-center">
            Advanced Compound Interest Calculator
          </h1>
          {[
            {
              label: "Investment Type",
              key: "investmentType",
              type: "select",
              options: ["one-time", "recurring", "both"],
              value: investmentType,
              onChange: (e) => setInvestmentType(e.target.value),
            },
            {
              label: "Initial Investment ($)",
              key: "initialInvestment",
              type: "number",
              step: "100",
              hidden: investmentType === "recurring",
              value: initialInvestment,
              onChange: (e) => setInitialInvestment(e.target.value),
            },
            {
              label: "Periodic Contribution ($)",
              key: "contribution",
              type: "number",
              step: "100",
              hidden: investmentType === "one-time",
              value: contribution,
              onChange: (e) => setContribution(e.target.value),
            },
            {
              label: "Contribution Frequency",
              key: "contributionFrequency",
              type: "select",
              options: ["annually", "semi-annually", "quarterly", "monthly"],
              hidden: investmentType === "one-time",
              value: contributionFrequency,
              onChange: (e) => setContributionFrequency(e.target.value),
            },
            {
              label: "Investment Period (Years)",
              key: "investmentPeriod",
              type: "number",
              step: "1",
              value: investmentPeriod,
              onChange: (e) => setInvestmentPeriod(e.target.value),
            },
            {
              label: "Annual Return Rate (%)",
              key: "returnRate",
              type: "number",
              step: "0.01",
              value: returnRate,
              onChange: (e) => setReturnRate(e.target.value),
            },
            {
              label: "Compounding Frequency",
              key: "compounding",
              type: "select",
              options: ["annually", "semi-annually", "quarterly", "monthly", "daily"],
              value: compounding,
              onChange: (e) => setCompounding(e.target.value),
            },
            {
              label: "Inflation Rate (%)",
              key: "inflationRate",
              type: "number",
              step: "0.01",
              value: inflationRate,
              onChange: (e) => setInflationRate(e.target.value),
            },
            {
              label: "Tax Rate on Returns (%)",
              key: "taxRate",
              type: "number",
              step: "0.01",
              value: taxRate,
              onChange: (e) => setTaxRate(e.target.value),
            },
            {
              label: "Currency",
              key: "currency",
              type: "select",
              options: ["USD", "CAD", "EUR", "GBP"],
              value: currency,
              onChange: (e) => setCurrency(e.target.value),
            },
          ].map(
            ({ label, key, type, options, step, hidden, value, onChange }) =>
              !hidden && (
                <div key={key} className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
                  {type === "select" ? (
                    <select
                      value={value}
                      onChange={onChange}
                      className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {key === "investmentType"
                            ? opt === "one-time"
                              ? "One-Time Investment"
                              : opt === "recurring"
                              ? "Recurring Contributions"
                              : "Both One-Time & Recurring"
                            : key === "currency"
                            ? `${opt === "USD" || opt === "CAD" ? "$" : opt === "EUR" ? "€" : "£"} ${opt}`
                            : opt.charAt(0).toUpperCase() + opt.slice(1).replace("-", " ")}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      value={value}
                      onChange={onChange}
                      step={step}
                      className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                    />
                  )}
                </div>
              )
          )}
          <button
            onClick={calculateCompoundInterest}
            className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 w-full"
          >
            Calculate Compound Interest
          </button>
          {results && (
            <div className="bg-gray-200 p-5 rounded-lg mt-6">
              {[
                { label: "Initial Investment", value: results.initialInvestment },
                { label: "Total Contributions", value: results.totalContributions },
                { label: "Total Interest Earned", value: results.totalInterest },
                { label: "Final Balance", value: results.finalBalance },
                { label: "Real Balance (Inflation-Adjusted)", value: results.realBalance },
                { label: "Taxes Paid", value: results.taxesPaid },
                { label: "Effective Annual Return", value: results.effectiveReturn, isPercentage: true },
              ].map(({ label, value, isPercentage }) => (
                <p key={label} className="text-gray-700">
                  <strong>{label}:</strong> {isPercentage ? `${value}%` : formatCurrency(value, currency)}
                </p>
              ))}
            </div>
          )}
          <div className="mt-6">
            <p className="text-gray-600">Growth chart not implemented in this demo.</p>
          </div>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-500 mb-6 text-center">Projections & History</h1>
          {projectionData.length > 0 && (
            <table className="w-full text-sm text-gray-600 mb-6">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3">Year</th>
                  <th className="p-3">Contribution</th>
                  <th className="p-3">Interest</th>
                  <th className="p-3">Taxes</th>
                  <th className="p-3">Balance</th>
                </tr>
              </thead>
              <tbody>
                {projectionData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-3">{item.year}</td>
                    <td className="p-3">{formatCurrency(item.contribution, currency)}</td>
                    <td className="p-3">{formatCurrency(item.interest, currency)}</td>
                    <td className="p-3">{formatCurrency(item.taxes, currency)}</td>
                    <td className="p-3">{formatCurrency(item.balance, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mb-6">
            {history.map((item, i) => (
              <div key={i} className="bg-white p-4 mb-4 rounded-lg shadow">
                <p>
                  <strong>Date:</strong> {item.timestamp}
                </p>
                <p>
                  <strong>Investment Type:</strong>{" "}
                  {item.investmentType === "one-time"
                    ? "One-Time Investment"
                    : item.investmentType === "recurring"
                    ? "Recurring Contributions"
                    : "Both One-Time & Recurring"}
                </p>
                <p>
                  <strong>Initial Investment:</strong> {item.initialInvestment}
                </p>
                <p>
                  <strong>Total Contributions:</strong> {item.totalContributions}
                </p>
                <p>
                  <strong>Investment Period:</strong> {item.investmentPeriod}
                </p>
                <p>
                  <strong>Return Rate:</strong> {item.returnRate}
                </p>
                <p>
                  <strong>Compounding:</strong>{" "}
                  {item.compounding.charAt(0).toUpperCase() + item.compounding.slice(1).replace("-", " ")}
                </p>
                <p>
                  <strong>Contribution Frequency:</strong>{" "}
                  {item.contributionFrequency.charAt(0).toUpperCase() +
                    item.contributionFrequency.slice(1).replace("-", " ")}
                </p>
                <p>
                  <strong>Inflation Rate:</strong> {item.inflationRate}
                </p>
                <p>
                  <strong>Tax Rate:</strong> {item.taxRate}
                </p>
                <p>
                  <strong>Total Interest:</strong> {item.totalInterest}
                </p>
                <p>
                  <strong>Final Balance:</strong> {item.finalBalance}
                </p>
                <p>
                  <strong>Real Balance:</strong> {item.realBalance}
                </p>
                <p>
                  <strong>Taxes Paid:</strong> {item.taxesPaid}
                </p>
                <p>
                  <strong>Effective Return:</strong> {item.effectiveReturn}
                </p>
              </div>
            ))}
          </div>
          {comparisonData.length > 0 && (
            <table className="w-full text-sm text-gray-600 mb-6">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3">Scenario</th>
                  <th className="p-3">Final Balance</th>
                  <th className="p-3">Real Balance</th>
                  <th className="p-3">Total Interest</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-3">{item.label}</td>
                    <td className="p-3">{formatCurrency(item.finalBalance, currency)}</td>
                    <td className="p-3">{formatCurrency(item.realBalance, currency)}</td>
                    <td className="p-3">{formatCurrency(item.totalInterest, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mb-6">
            <p className="text-gray-600">Breakdown chart not implemented in this demo.</p>
          </div>
          <div className="flex gap-4 flex-col sm:flex-row">
            <button
              onClick={exportProjections}
              className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 flex-1"
            >
              Export Projections (CSV)
            </button>
            <button
              onClick={compareScenarios}
              className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 flex-1"
            >
              Compare Scenarios
            </button>
          </div>
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
          @media (max-width: 768px) {
            .flex-col {
              flex-direction: column;
            }
            .max-h-[700px] {
              max-height: 500px;
            }
            .text-sm {
              font-size: 0.875rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
