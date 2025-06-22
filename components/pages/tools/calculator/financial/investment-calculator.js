"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [formData, setFormData] = useState({
    investmentType: "one-time",
    initialInvestment: "",
    contribution: "",
    contributionFrequency: "annually",
    investmentPeriod: "",
    returnRate: "",
    compounding: "annually",
    inflationRate: "",
    taxRate: "",
    currency: "USD",
  });
  const [results, setResults] = useState(null);
  const [projectionData, setProjectionData] = useState([]);
  const [history, setHistory] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const growthChartRef = useRef(null);
  const breakdownChartRef = useRef(null);
  let growthChart, breakdownChart;

  useEffect(() => {
    if (growthChartRef.current) {
      growthChart = new Chart(growthChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            { label: "Nominal Balance", data: [], borderColor: "#3498db", fill: false, tension: 0.1 },
            {
              label: "Inflation-Adjusted Balance",
              data: [],
              borderColor: "#e74c3c",
              fill: false,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Balance" } },
            x: { title: { display: true, text: "Year" } },
          },
          plugins: { title: { display: true, text: "Investment Growth Over Time" } },
        },
      });
    }
    if (breakdownChartRef.current) {
      breakdownChart = new Chart(breakdownChartRef.current, {
        type: "pie",
        data: {
          labels: ["Initial Investment", "Contributions", "Interest", "Taxes Paid"],
          datasets: [
            {
              data: [0, 0, 0, 0],
              backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Investment Breakdown" } },
        },
      });
    }
    return () => {
      growthChart?.destroy();
      breakdownChart?.destroy();
    };
  }, []);

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateInputs = (investmentType, initialInvestment, contribution, investmentPeriod, returnRate) => {
    if (isNaN(investmentPeriod) || investmentPeriod <= 0) return "Please enter a valid investment period";
    if (isNaN(returnRate) || returnRate < 0) return "Please enter a valid return rate";
    if (
      (investmentType === "one-time" || investmentType === "both") &&
      (isNaN(initialInvestment) || initialInvestment <= 0)
    )
      return "Please enter a valid initial investment";
    if (
      (investmentType === "recurring" || investmentType === "both") &&
      (isNaN(contribution) || contribution <= 0)
    )
      return "Please enter a valid periodic contribution";
    return null;
  };

  const calculateInvestment = () => {
    const {
      investmentType,
      initialInvestment,
      contribution,
      contributionFrequency,
      investmentPeriod,
      returnRate,
      compounding,
      inflationRate,
      taxRate,
      currency,
    } = formData;
    const initInv = parseFloat(initialInvestment) || 0;
    const contrib = parseFloat(contribution) || 0;
    const period = parseInt(investmentPeriod);
    const rate = parseFloat(returnRate) / 100;
    const inflRate = parseFloat(inflationRate) / 100 || 0;
    const tax = parseFloat(taxRate) / 100 || 0;

    const error = validateInputs(investmentType, initInv, contrib, period, rate);
    if (error) {
      alert(error);
      return;
    }

    const compoundingPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12, daily: 365 };
    const contributionPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
    const n = compoundingPeriods[compounding];
    const m = contributionPeriods[contributionFrequency];
    const ratePerPeriod = rate / n;
    const totalPeriods = period * n;
    const contributionsPerYear = investmentType === "one-time" ? 0 : contrib * m;

    let balance = investmentType === "recurring" ? 0 : initInv;
    let totalContributions = investmentType === "one-time" ? 0 : contrib * m * period;
    let totalInterest = 0;
    let totalTaxes = 0;
    const projections = [];
    const nominalBalances = [balance];
    const realBalances = [balance / Math.pow(1 + inflRate, 0)];

    for (let year = 1; year <= period; year++) {
      let yearBalance = balance;
      let yearInterest = 0;
      let yearTaxes = 0;
      let yearContribution = investmentType === "one-time" ? 0 : contributionsPerYear;

      for (let p = 1; p <= n; p++) {
        let periodContribution = p % (n / m) === 0 && investmentType !== "one-time" ? contrib : 0;
        let interest = yearBalance * ratePerPeriod;
        let taxAmount = interest * tax;
        yearInterest += interest;
        yearTaxes += taxAmount;
        yearBalance = yearBalance * (1 + ratePerPeriod) - taxAmount + periodContribution;
      }

      balance = yearBalance;
      totalInterest += yearInterest;
      totalTaxes += yearTaxes;
      projections.push({
        year,
        contribution: yearContribution,
        interest: yearInterest,
        taxes: yearTaxes,
        balance,
      });
      nominalBalances.push(balance);
      realBalances.push(balance / Math.pow(1 + inflRate, year));
    }

    const finalBalance = balance;
    const realBalance = finalBalance / Math.pow(1 + inflRate, period);
    const effectiveAnnualReturn =
      n > 1 ? (Math.pow(1 + ratePerPeriod * (1 - tax), n) - 1) * 100 : rate * (1 - tax) * 100;

    setResults({
      initialInvestment: initInv,
      totalContributions,
      totalInterest,
      finalBalance,
      realBalance,
      totalTaxes,
      effectiveAnnualReturn,
    });
    setProjectionData(projections);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      investmentType,
      initialInvestment: formatCurrency(initInv, currency),
      totalContributions: formatCurrency(totalContributions, currency),
      investmentPeriod: `${period} years`,
      returnRate: `${(rate * 100).toFixed(2)}%`,
      compounding,
      contributionFrequency: investmentType === "one-time" ? "N/A" : contributionFrequency,
      inflationRate: `${(inflRate * 100).toFixed(2)}%`,
      taxRate: `${(tax * 100).toFixed(2)}%`,
      totalInterest: formatCurrency(totalInterest, currency),
      finalBalance: formatCurrency(finalBalance, currency),
      realBalance: formatCurrency(realBalance, currency),
      taxesPaid: formatCurrency(totalTaxes, currency),
      effectiveReturn: `${effectiveAnnualReturn.toFixed(2)}%`,
    };
    setHistory((prev) => [...prev, calculation]);

    growthChart.data.labels = Array.from({ length: period + 1 }, (_, i) => i);
    growthChart.data.datasets[0].data = nominalBalances;
    growthChart.data.datasets[1].data = realBalances;
    growthChart.options.scales.y.title.text = `Balance (${currency})`;
    growthChart.update();

    breakdownChart.data.datasets[0].data = [initInv, totalContributions, totalInterest, totalTaxes];
    breakdownChart.update();
  };

  const compareScenarios = () => {
    const {
      investmentType,
      initialInvestment,
      contribution,
      contributionFrequency,
      investmentPeriod,
      returnRate,
      compounding,
      inflationRate,
      taxRate,
      currency,
    } = formData;
    const initInv = parseFloat(initialInvestment) || 0;
    const contrib = parseFloat(contribution) || 0;
    const period = parseInt(investmentPeriod);
    const rate = parseFloat(returnRate) / 100;
    const inflRate = parseFloat(inflationRate) / 100 || 0;
    const tax = parseFloat(taxRate) / 100 || 0;

    const error = validateInputs(investmentType, initInv, contrib, period, rate);
    if (error) {
      alert(error);
      return;
    }

    const compoundingPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12, daily: 365 };
    const contributionPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
    const n = compoundingPeriods[compounding];
    const m = contributionPeriods[contributionFrequency];

    const scenarios = [
      { label: "Base Case", rate, contribution: contrib },
      { label: "Higher Return (+1%)", rate: rate + 0.01, contribution: contrib },
      { label: "Lower Return (-1%)", rate: Math.max(rate - 0.01, 0), contribution: contrib },
      { label: "Double Contribution", rate, contribution: contrib * 2 },
    ];

    const data = scenarios.map((scenario) => {
      let balance = investmentType === "recurring" ? 0 : initInv;
      let totalContributions = investmentType === "one-time" ? 0 : scenario.contribution * m * period;
      let totalInterest = 0;
      const ratePerPeriod = scenario.rate / n;

      for (let year = 1; year <= period; year++) {
        let yearBalance = balance;
        let yearInterest = 0;
        let yearContribution = investmentType === "one-time" ? 0 : scenario.contribution * m;

        for (let p = 1; p <= n; p++) {
          let periodContribution =
            p % (n / m) === 0 && investmentType !== "one-time" ? scenario.contribution : 0;
          let interest = yearBalance * ratePerPeriod;
          let taxAmount = interest * tax;
          yearInterest += interest;
          yearBalance = yearBalance * (1 + ratePerPeriod) - taxAmount + periodContribution;
        }

        balance = yearBalance;
        totalInterest += yearInterest;
      }

      const finalBalance = balance;
      const realBalance = finalBalance / Math.pow(1 + inflRate, period);
      return { label: scenario.label, finalBalance, realBalance, totalInterest };
    });

    setComparisonData(data);
  };

  const exportProjections = () => {
    if (projectionData.length === 0) {
      alert("No projection data to export");
      return;
    }
    const csvContent = [
      "Year,Contribution,Interest,Taxes,Balance",
      ...projectionData.map(
        (item) =>
          `${item.year},${item.contribution.toFixed(2)},${item.interest.toFixed(2)},${item.taxes.toFixed(
            2
          )},${item.balance.toFixed(2)}`
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "investment_projections.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Advanced Investment Calculator
            </h1>
            <div className="space-y-4">
              {[
                {
                  label: "Investment Type",
                  field: "investmentType",
                  type: "select",
                  options: ["one-time", "recurring", "both"],
                  optionLabels: [
                    "One-Time Investment",
                    "Recurring Contributions",
                    "Both One-Time & Recurring",
                  ],
                },
                {
                  label: "Initial Investment ($)",
                  field: "initialInvestment",
                  type: "number",
                  placeholder: "Enter initial investment",
                  step: "100",
                  className: formData.investmentType === "recurring" ? "hidden" : "",
                },
                {
                  label: "Periodic Contribution ($)",
                  field: "contribution",
                  type: "number",
                  placeholder: "Enter contribution",
                  step: "100",
                  className: formData.investmentType === "one-time" ? "hidden" : "",
                },
                {
                  label: "Contribution Frequency",
                  field: "contributionFrequency",
                  type: "select",
                  options: ["annually", "semi-annually", "quarterly", "monthly"],
                  optionLabels: ["Annually", "Semi-Annually", "Quarterly", "Monthly"],
                  className: formData.investmentType === "one-time" ? "hidden" : "",
                },
                {
                  label: "Investment Period (Years)",
                  field: "investmentPeriod",
                  type: "number",
                  placeholder: "Enter investment period",
                  step: "1",
                },
                {
                  label: "Annual Return Rate (%)",
                  field: "returnRate",
                  type: "number",
                  placeholder: "Enter return rate",
                  step: "0.01",
                },
                {
                  label: "Compounding Frequency",
                  field: "compounding",
                  type: "select",
                  options: ["annually", "semi-annually", "quarterly", "monthly", "daily"],
                  optionLabels: ["Annually", "Semi-Annually", "Quarterly", "Monthly", "Daily"],
                },
                {
                  label: "Inflation Rate (%)",
                  field: "inflationRate",
                  type: "number",
                  placeholder: "Enter inflation rate",
                  step: "0.01",
                },
                {
                  label: "Tax Rate on Returns (%)",
                  field: "taxRate",
                  type: "number",
                  placeholder: "Enter tax rate",
                  step: "0.01",
                },
                {
                  label: "Currency",
                  field: "currency",
                  type: "select",
                  options: ["USD", "CAD", "EUR", "GBP"],
                  optionLabels: ["$ USD", "$ CAD", "€ EUR", "£ GBP"],
                },
              ].map((item) => (
                <div key={item.label} className={`space-y-2 ${item.className || ""}`}>
                  <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                  {item.type === "select" ? (
                    <select
                      value={formData[item.field]}
                      onChange={(e) => updateFormData(item.field, e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                    >
                      {item.options.map((opt, i) => (
                        <option key={opt} value={opt}>
                          {item.optionLabels[i]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={item.type}
                      value={formData[item.field]}
                      onChange={(e) => updateFormData(item.field, e.target.value)}
                      placeholder={item.placeholder}
                      step={item.step}
                      className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                    />
                  )}
                </div>
              ))}
              <button
                onClick={calculateInvestment}
                className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:-translate-y-1 transition-all"
              >
                Calculate Investment
              </button>
              {results && (
                <div className="bg-white p-5 rounded-lg mt-4">
                  <p>
                    <strong>Initial Investment:</strong>{" "}
                    {formatCurrency(results.initialInvestment, formData.currency)}
                  </p>
                  <p>
                    <strong>Total Contributions:</strong>{" "}
                    {formatCurrency(results.totalContributions, formData.currency)}
                  </p>
                  <p>
                    <strong>Total Interest Earned:</strong>{" "}
                    {formatCurrency(results.totalInterest, formData.currency)}
                  </p>
                  <p>
                    <strong>Final Balance:</strong> {formatCurrency(results.finalBalance, formData.currency)}
                  </p>
                  <p>
                    <strong>Real Balance (Inflation-Adjusted):</strong>{" "}
                    {formatCurrency(results.realBalance, formData.currency)}
                  </p>
                  <p>
                    <strong>Taxes Paid:</strong> {formatCurrency(results.totalTaxes, formData.currency)}
                  </p>
                  <p>
                    <strong>Effective Annual Return:</strong> {results.effectiveAnnualReturn.toFixed(2)}%
                  </p>
                </div>
              )}
              <div className="mt-4">
                <canvas ref={growthChartRef} className="max-w-full" />
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white p-5 rounded-lg max-h-[700px] overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Projections & History</h1>
            {projectionData.length > 0 && (
              <table className="w-full border-collapse bg-gray-100 rounded-lg mt-4">
                <thead>
                  <tr className="bg-red-500 text-white">
                    <th className="p-3 text-right">Year</th>
                    <th className="p-3 text-right">Contribution</th>
                    <th className="p-3 text-right">Interest</th>
                    <th className="p-3 text-right">Taxes</th>
                    <th className="p-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionData.map((item, index) => (
                    <tr key={item.year} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-3 text-right">{item.year}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.contribution, formData.currency)}
                      </td>
                      <td className="p-3 text-right">{formatCurrency(item.interest, formData.currency)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.taxes, formData.currency)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.balance, formData.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="space-y-4 mt-4">
              {history.map((item, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <p>
                    <strong>Date:</strong> {item.timestamp}
                  </p>
                  <p>
                    <strong>Investment Type:</strong> {item.investmentType}
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
                    <strong>Compounding:</strong> {item.compounding}
                  </p>
                  <p>
                    <strong>Contribution Frequency:</strong> {item.contributionFrequency}
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
              <table className="w-full border-collapse bg-gray-100 rounded-lg mt-4">
                <thead>
                  <tr className="bg-red-500 text-white">
                    <th className="p-3 text-right">Scenario</th>
                    <th className="p-3 text-right">Final Balance</th>
                    <th className="p-3 text-right">Real Balance</th>
                    <th className="p-3 text-right">Total Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr key={item.label} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-3 text-right">{item.label}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.finalBalance, formData.currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.realBalance, formData.currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.totalInterest, formData.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-4">
              <canvas ref={breakdownChartRef} className="max-w-full" />
            </div>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={exportProjections}
                className="w-full md:w-auto bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 hover:-translate-y-1 transition-all"
              >
                Export Projections (CSV)
              </button>
              <button
                onClick={compareScenarios}
                className="w-full md:w-auto bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 hover:-translate-y-1 transition-all"
              >
                Compare Scenarios
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .transition-all {
          transition: all 0.3s ease;
        }
        .hover\\:-translate-y-1:hover {
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .max-h-\\[700px\\] {
            max-height: 500px;
          }
          button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
