"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [formData, setFormData] = useState({
    interestType: "simple",
    principal: "",
    interestRate: "",
    timePeriod: "",
    compounding: "annually",
    contribution: "",
    inflationRate: "",
    currency: "USD",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const balanceGrowthChartRef = useRef(null);
  const interestTrendChartRef = useRef(null);
  let balanceGrowthChart, interestTrendChart;

  useEffect(() => {
    if (balanceGrowthChartRef.current) {
      balanceGrowthChart = new Chart(balanceGrowthChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            { label: "Balance", data: [], borderColor: "#3498db", fill: false, tension: 0.1 },
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
            y: { beginAtZero: true, title: { display: true, text: "Amount" } },
            x: { title: { display: true, text: "Year" } },
          },
          plugins: { title: { display: true, text: "Balance Growth Over Time" } },
        },
      });
    }
    if (interestTrendChartRef.current) {
      interestTrendChart = new Chart(interestTrendChartRef.current, {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              label: "Interest Earned",
              data: [],
              backgroundColor: "#2ecc71",
              borderColor: "#fff",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Interest" } },
            x: { title: { display: true, text: "Calculation" } },
          },
          plugins: { title: { display: true, text: "Interest Earned Across Calculations" } },
        },
      });
    }
    return () => {
      balanceGrowthChart?.destroy();
      interestTrendChart?.destroy();
    };
  }, []);

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateInputs = (principal, interestRate, timePeriod) => {
    if (isNaN(principal) || principal <= 0) return "Please enter a valid principal amount";
    if (isNaN(interestRate) || interestRate < 0) return "Please enter a valid interest rate";
    if (isNaN(timePeriod) || timePeriod <= 0) return "Please enter a valid time period";
    return null;
  };

  const calculateInterest = () => {
    const {
      interestType,
      principal,
      interestRate,
      timePeriod,
      compounding,
      contribution,
      inflationRate,
      currency,
    } = formData;
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100;
    const t = parseInt(timePeriod);
    const c = parseFloat(contribution) || 0;
    const i = parseFloat(inflationRate) / 100 || 0;

    const error = validateInputs(p, r, t);
    if (error) {
      alert(error);
      return;
    }

    const compoundingPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12, daily: 365 };
    const n = interestType === "compound" ? compoundingPeriods[compounding] : 1;
    const ratePerPeriod = r / n;
    const totalPeriods = t * n;

    let finalBalance, totalInterest;
    const balances = [];
    const realBalances = [];
    const years = Array.from({ length: t + 1 }, (_, i) => i);

    if (interestType === "simple") {
      totalInterest = p * r * t;
      finalBalance = p + totalInterest;
      if (c > 0) {
        finalBalance += c * t * n;
        totalInterest += c * r * t;
      }
      for (let year = 0; year <= t; year++) {
        const currentBalance = p + p * r * year + c * year * n;
        const realBalance = currentBalance / Math.pow(1 + i, year);
        balances.push(currentBalance);
        realBalances.push(realBalance);
      }
    } else {
      finalBalance = p * Math.pow(1 + ratePerPeriod, totalPeriods);
      if (c > 0) {
        finalBalance += (c * (Math.pow(1 + ratePerPeriod, totalPeriods) - 1)) / ratePerPeriod;
      }
      totalInterest = finalBalance - p - c * totalPeriods;
      for (let year = 0; year <= t; year++) {
        const periodsSoFar = year * n;
        let currentBalance = p * Math.pow(1 + ratePerPeriod, periodsSoFar);
        if (c > 0) {
          currentBalance += (c * (Math.pow(1 + ratePerPeriod, periodsSoFar) - 1)) / ratePerPeriod;
        }
        const realBalance = currentBalance / Math.pow(1 + i, year);
        balances.push(currentBalance);
        realBalances.push(realBalance);
      }
    }

    const effectiveRate = interestType === "compound" ? (Math.pow(1 + ratePerPeriod, n) - 1) * 100 : r * 100;
    const realBalance = finalBalance / Math.pow(1 + i, t);

    setResults({ principal: p, totalInterest, finalBalance, realBalance, effectiveRate });

    const calculation = {
      timestamp: new Date().toLocaleString(),
      interestType,
      principal: formatCurrency(p, currency),
      interestRate: `${(r * 100).toFixed(2)}%`,
      timePeriod: `${t} years`,
      compounding: interestType === "compound" ? compounding : "N/A",
      contribution: formatCurrency(c, currency),
      totalInterest: formatCurrency(totalInterest, currency),
      finalBalance: formatCurrency(finalBalance, currency),
      realBalance: formatCurrency(realBalance, currency),
      effectiveRate: `${effectiveRate.toFixed(2)}%`,
    };
    setHistory((prev) => [...prev, calculation]);

    balanceGrowthChart.data.labels = years;
    balanceGrowthChart.data.datasets[0].data = balances;
    balanceGrowthChart.data.datasets[1].data = realBalances;
    balanceGrowthChart.options.scales.y.title.text = `Amount (${currency})`;
    balanceGrowthChart.update();

    const labels = history.map((_, index) => `Calc ${index + 1}`);
    const data = history.map((item) => parseFloat(item.totalInterest.replace(/[^0-9.]/g, "")));
    interestTrendChart.data.labels = [...labels, `Calc ${history.length + 1}`];
    interestTrendChart.data.datasets[0].data = [...data, totalInterest];
    interestTrendChart.options.scales.y.title.text = `Interest (${currency})`;
    interestTrendChart.update();
  };

  const compareScenarios = () => {
    const {
      interestType,
      principal,
      interestRate,
      timePeriod,
      compounding,
      contribution,
      inflationRate,
      currency,
    } = formData;
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100;
    const t = parseInt(timePeriod);
    const c = parseFloat(contribution) || 0;
    const i = parseFloat(inflationRate) / 100 || 0;

    const error = validateInputs(p, r, t);
    if (error) {
      alert(error);
      return;
    }

    const compoundingPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12, daily: 365 };
    const n = interestType === "compound" ? compoundingPeriods[compounding] : 1;
    const totalPeriods = t * n;

    const scenarios = [
      { label: "Base Case", rate: r, contribution: c },
      { label: "Lower Rate (-0.5%)", rate: Math.max(r - 0.005, 0), contribution: c },
      { label: "Higher Rate (+0.5%)", rate: r + 0.005, contribution: c },
      { label: "Double Contribution", rate: r, contribution: c * 2 },
    ];

    const data = scenarios.map((scenario) => {
      let finalBalance, totalInterest;
      if (interestType === "simple") {
        totalInterest = p * scenario.rate * t;
        finalBalance = p + totalInterest + scenario.contribution * t * n;
      } else {
        finalBalance = p * Math.pow(1 + scenario.rate / n, totalPeriods);
        if (scenario.contribution > 0) {
          finalBalance +=
            (scenario.contribution * (Math.pow(1 + scenario.rate / n, totalPeriods) - 1)) /
            (scenario.rate / n);
        }
        totalInterest = finalBalance - p - scenario.contribution * totalPeriods;
      }
      const realBalance = finalBalance / Math.pow(1 + i, t);
      return { label: scenario.label, totalInterest, finalBalance, realBalance };
    });

    setComparisonData(data);
  };

  const exportHistory = () => {
    if (history.length === 0) {
      alert("No history to export");
      return;
    }
    const csvContent = [
      "Date,Interest Type,Principal,Interest Rate,Time Period,Compounding,Contribution,Total Interest,Final Balance,Real Balance,Effective Rate",
      ...history.map(
        (item) =>
          `"${item.timestamp}","${item.interestType}","${item.principal}","${item.interestRate}","${item.timePeriod}","${item.compounding}","${item.contribution}","${item.totalInterest}","${item.finalBalance}","${item.realBalance}","${item.effectiveRate}"`
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interest_calculation_history.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Advanced Interest Calculator
            </h1>
            <div className="space-y-4">
              {[
                {
                  label: "Interest Type",
                  field: "interestType",
                  type: "select",
                  options: ["simple", "compound"],
                  optionLabels: ["Simple Interest", "Compound Interest"],
                },
                {
                  label: "Principal Amount ($)",
                  field: "principal",
                  type: "number",
                  placeholder: "Enter principal amount",
                  step: "100",
                },
                {
                  label: "Annual Interest Rate (%)",
                  field: "interestRate",
                  type: "number",
                  placeholder: "Enter interest rate",
                  step: "0.01",
                },
                {
                  label: "Time Period (Years)",
                  field: "timePeriod",
                  type: "number",
                  placeholder: "Enter time period",
                  step: "1",
                },
                {
                  label: "Compounding Frequency",
                  field: "compounding",
                  type: "select",
                  options: ["annually", "semi-annually", "quarterly", "monthly", "daily"],
                  optionLabels: ["Annually", "Semi-Annually", "Quarterly", "Monthly", "Daily"],
                  className: formData.interestType === "compound" ? "" : "hidden",
                },
                {
                  label: "Additional Contribution per Period ($)",
                  field: "contribution",
                  type: "number",
                  placeholder: "Enter contribution (optional)",
                  step: "10",
                },
                {
                  label: "Annual Inflation Rate (%)",
                  field: "inflationRate",
                  type: "number",
                  placeholder: "Enter inflation rate (optional)",
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
                onClick={calculateInterest}
                className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:-translate-y-1 transition-all"
              >
                Calculate Interest
              </button>
              {results && (
                <div className="bg-white p-5 rounded-lg mt-4">
                  <p>
                    <strong>Principal Amount:</strong> {formatCurrency(results.principal, formData.currency)}
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
                    <strong>Effective Annual Rate:</strong> {results.effectiveRate.toFixed(2)}%
                  </p>
                </div>
              )}
              <div className="mt-4">
                <canvas ref={balanceGrowthChartRef} className="max-w-full" />
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white p-5 rounded-lg max-h-[700px] overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">History & Comparison</h1>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <p>
                    <strong>Date:</strong> {item.timestamp}
                  </p>
                  <p>
                    <strong>Interest Type:</strong> {item.interestType}
                  </p>
                  <p>
                    <strong>Principal:</strong> {item.principal}
                  </p>
                  <p>
                    <strong>Interest Rate:</strong> {item.interestRate}
                  </p>
                  <p>
                    <strong>Time Period:</strong> {item.timePeriod}
                  </p>
                  <p>
                    <strong>Compounding:</strong> {item.compounding}
                  </p>
                  <p>
                    <strong>Contribution:</strong> {item.contribution}
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
                    <strong>Effective Rate:</strong> {item.effectiveRate}
                  </p>
                </div>
              ))}
            </div>
            {comparisonData.length > 0 && (
              <table className="w-full border-collapse bg-gray-100 rounded-lg mt-4">
                <thead>
                  <tr className="bg-red-500 text-white">
                    <th className="p-3 text-right">Scenario</th>
                    <th className="p-3 text-right">Interest Earned</th>
                    <th className="p-3 text-right">Final Balance</th>
                    <th className="p-3 text-right">Real Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr key={item.label} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-3 text-right">{item.label}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.totalInterest, formData.currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.finalBalance, formData.currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.realBalance, formData.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-4">
              <canvas ref={interestTrendChartRef} className="max-w-full" />
            </div>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={exportHistory}
                className="w-full md:w-auto bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 hover:-translate-y-1 transition-all"
              >
                Export History (CSV)
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
