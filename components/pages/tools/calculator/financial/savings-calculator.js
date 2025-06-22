"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [formData, setFormData] = useState({
    savingsType: "one-time",
    initialDeposit: "",
    contribution: "",
    contributionFrequency: "annually",
    savingsPeriod: "",
    interestRate: "",
    compounding: "annually",
    inflationRate: "",
    savingsGoal: "",
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
          plugins: { title: { display: true, text: "Savings Growth Over Time" } },
        },
      });
    }
    if (breakdownChartRef.current) {
      breakdownChart = new Chart(breakdownChartRef.current, {
        type: "pie",
        data: {
          labels: ["Initial Deposit", "Contributions", "Interest"],
          datasets: [
            {
              data: [0, 0, 0],
              backgroundColor: ["#3498db", "#2ecc71", "#f1c40f"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Savings Breakdown" } },
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

  const calculateSavings = () => {
    const {
      savingsType,
      initialDeposit,
      contribution,
      contributionFrequency,
      savingsPeriod,
      interestRate,
      compounding,
      inflationRate,
      savingsGoal,
      currency,
    } = formData;
    const parsed = {
      initialDeposit: parseFloat(initialDeposit) || 0,
      contribution: parseFloat(contribution) || 0,
      savingsPeriod: parseInt(savingsPeriod),
      interestRate: parseFloat(interestRate) / 100,
      inflationRate: parseFloat(inflationRate) / 100 || 0,
      savingsGoal: parseFloat(savingsGoal) || 0,
    };

    if (isNaN(parsed.savingsPeriod) || parsed.savingsPeriod <= 0) {
      alert("Please enter a valid savings period");
      return;
    }
    if (isNaN(parsed.interestRate) || parsed.interestRate < 0) {
      alert("Please enter a valid interest rate");
      return;
    }
    if (
      (savingsType === "one-time" || savingsType === "both") &&
      (isNaN(parsed.initialDeposit) || parsed.initialDeposit <= 0)
    ) {
      alert("Please enter a valid initial deposit");
      return;
    }
    if (
      (savingsType === "recurring" || savingsType === "both") &&
      (isNaN(parsed.contribution) || parsed.contribution <= 0)
    ) {
      alert("Please enter a valid periodic contribution");
      return;
    }

    const compoundingPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12, daily: 365 };
    const contributionPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
    const n = compoundingPeriods[compounding];
    const m = contributionPeriods[contributionFrequency];
    const ratePerPeriod = parsed.interestRate / n;
    const contributionsPerYear = savingsType === "one-time" ? 0 : parsed.contribution * m;

    let balance = savingsType === "recurring" ? 0 : parsed.initialDeposit;
    let totalContributions = savingsType === "one-time" ? 0 : parsed.contribution * m * parsed.savingsPeriod;
    let totalInterest = 0;
    let newProjectionData = [];
    const nominalBalances = [balance];
    const realBalances = [balance / Math.pow(1 + parsed.inflationRate, 0)];

    for (let year = 1; year <= parsed.savingsPeriod; year++) {
      let yearBalance = balance;
      let yearInterest = 0;
      let yearContribution = savingsType === "one-time" ? 0 : contributionsPerYear;

      for (let period = 1; period <= n; period++) {
        let periodContribution =
          period % (n / m) === 0 && savingsType !== "one-time" ? parsed.contribution : 0;
        let interest = yearBalance * ratePerPeriod;
        yearInterest += interest;
        yearBalance = yearBalance * (1 + ratePerPeriod) + periodContribution;
      }

      balance = yearBalance;
      totalInterest += yearInterest;
      newProjectionData.push({ year, contribution: yearContribution, interest: yearInterest, balance });
      nominalBalances.push(balance);
      realBalances.push(balance / Math.pow(1 + parsed.inflationRate, year));
    }

    const finalBalance = balance;
    const realBalance = finalBalance / Math.pow(1 + parsed.inflationRate, parsed.savingsPeriod);
    const effectiveAnnualReturn =
      n > 1 ? (Math.pow(1 + ratePerPeriod, n) - 1) * 100 : parsed.interestRate * 100;
    const goalStatus =
      parsed.savingsGoal > 0
        ? finalBalance >= parsed.savingsGoal
          ? `Goal achieved! Surplus: ${formatCurrency(finalBalance - parsed.savingsGoal, currency)}`
          : `Shortfall: ${formatCurrency(parsed.savingsGoal - finalBalance, currency)}`
        : "No goal set";

    setResults({
      initialDeposit: parsed.initialDeposit,
      totalContributions,
      totalInterest,
      finalBalance,
      realBalance,
      goalStatus,
      effectiveReturn: effectiveAnnualReturn,
    });
    setProjectionData(newProjectionData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      savingsType,
      initialDeposit: formatCurrency(parsed.initialDeposit, currency),
      totalContributions: formatCurrency(totalContributions, currency),
      savingsPeriod: `${parsed.savingsPeriod} years`,
      interestRate: `${(parsed.interestRate * 100).toFixed(2)}%`,
      compounding,
      contributionFrequency: savingsType === "one-time" ? "N/A" : contributionFrequency,
      inflationRate: `${(parsed.inflationRate * 100).toFixed(2)}%`,
      savingsGoal: parsed.savingsGoal > 0 ? formatCurrency(parsed.savingsGoal, currency) : "None",
      totalInterest: formatCurrency(totalInterest, currency),
      finalBalance: formatCurrency(finalBalance, currency),
      realBalance: formatCurrency(realBalance, currency),
      goalStatus,
      effectiveReturn: `${effectiveAnnualReturn.toFixed(2)}%`,
    };
    setHistory([...history, calculation]);

    growthChart.data.labels = Array.from({ length: parsed.savingsPeriod + 1 }, (_, i) => i);
    growthChart.data.datasets[0].data = nominalBalances;
    growthChart.data.datasets[1].data = realBalances;
    growthChart.update();

    breakdownChart.data.datasets[0].data = [parsed.initialDeposit, totalContributions, totalInterest];
    breakdownChart.update();
  };

  const compareScenarios = () => {
    const {
      savingsType,
      initialDeposit,
      contribution,
      contributionFrequency,
      savingsPeriod,
      interestRate,
      compounding,
      inflationRate,
      savingsGoal,
      currency,
    } = formData;
    const parsed = {
      initialDeposit: parseFloat(initialDeposit) || 0,
      contribution: parseFloat(contribution) || 0,
      savingsPeriod: parseInt(savingsPeriod),
      interestRate: parseFloat(interestRate) / 100,
      inflationRate: parseFloat(inflationRate) / 100 || 0,
      savingsGoal: parseFloat(savingsGoal) || 0,
    };

    if (isNaN(parsed.savingsPeriod) || isNaN(parsed.interestRate)) {
      alert("Please calculate savings first");
      return;
    }

    const compoundingPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12, daily: 365 };
    const contributionPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
    const n = compoundingPeriods[compounding];
    const m = contributionPeriods[contributionFrequency];

    const scenarios = [
      { label: "Base Case", rate: parsed.interestRate, contribution: parsed.contribution },
      { label: "Higher Rate (+1%)", rate: parsed.interestRate + 0.01, contribution: parsed.contribution },
      {
        label: "Lower Rate (-1%)",
        rate: Math.max(parsed.interestRate - 0.01, 0),
        contribution: parsed.contribution,
      },
      { label: "Double Contribution", rate: parsed.interestRate, contribution: parsed.contribution * 2 },
    ];

    const newComparisonData = scenarios.map((scenario) => {
      let balance = savingsType === "recurring" ? 0 : parsed.initialDeposit;
      let totalContributions =
        savingsType === "one-time" ? 0 : scenario.contribution * m * parsed.savingsPeriod;
      let totalInterest = 0;
      const ratePerPeriod = scenario.rate / n;

      for (let year = 1; year <= parsed.savingsPeriod; year++) {
        let yearBalance = balance;
        let yearInterest = 0;

        for (let period = 1; period <= n; period++) {
          let periodContribution =
            period % (n / m) === 0 && savingsType !== "one-time" ? scenario.contribution : 0;
          let interest = yearBalance * ratePerPeriod;
          yearInterest += interest;
          yearBalance = yearBalance * (1 + ratePerPeriod) + periodContribution;
        }

        balance = yearBalance;
        totalInterest += yearInterest;
      }

      const finalBalance = balance;
      const realBalance = finalBalance / Math.pow(1 + parsed.inflationRate, parsed.savingsPeriod);
      const timeToGoal =
        parsed.savingsGoal > 0
          ? calculateTimeToGoal(
              parsed.initialDeposit,
              scenario.contribution,
              m,
              scenario.rate,
              n,
              parsed.savingsGoal
            )
          : "N/A";
      return { label: scenario.label, finalBalance, realBalance, timeToGoal };
    });

    setComparisonData(newComparisonData);
  };

  const calculateTimeToGoal = (initialDeposit, contribution, m, rate, n, goal) => {
    let balance = initialDeposit;
    let years = 0;
    const ratePerPeriod = rate / n;
    const maxYears = 100;

    while (balance < goal && years < maxYears) {
      let yearBalance = balance;
      for (let period = 1; period <= n; period++) {
        let periodContribution = period % (n / m) === 0 ? contribution : 0;
        let interest = yearBalance * ratePerPeriod;
        yearBalance = yearBalance * (1 + ratePerPeriod) + periodContribution;
      }
      balance = yearBalance;
      years++;
    }

    return balance >= goal ? years : "Goal not reached";
  };

  const exportProjections = () => {
    if (projectionData.length === 0) {
      alert("No projection data to export");
      return;
    }

    const csvContent = [
      "Year,Contribution,Interest,Balance",
      ...projectionData.map(
        (item) =>
          `${item.year},${item.contribution.toFixed(2)},${item.interest.toFixed(2)},${item.balance.toFixed(
            2
          )}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "savings_projections.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const inputFields = [
    {
      id: "savingsType",
      label: "Savings Type",
      type: "select",
      options: [
        { value: "one-time", label: "One-Time Deposit" },
        { value: "recurring", label: "Recurring Contributions" },
        { value: "both", label: "Both One-Time & Recurring" },
      ],
    },
    {
      id: "initialDeposit",
      label: "Initial Deposit ($)",
      type: "number",
      placeholder: "Enter initial deposit",
      step: "100",
      group: "initial-deposit-group",
      show: formData.savingsType !== "recurring",
    },
    {
      id: "contribution",
      label: "Periodic Contribution ($)",
      type: "number",
      placeholder: "Enter contribution",
      step: "100",
      group: "contribution-group",
      show: formData.savingsType !== "one-time",
    },
    {
      id: "contributionFrequency",
      label: "Contribution Frequency",
      type: "select",
      options: [
        { value: "annually", label: "Annually" },
        { value: "semi-annually", label: "Semi-Annually" },
        { value: "quarterly", label: "Quarterly" },
        { value: "monthly", label: "Monthly" },
      ],
      group: "contribution-frequency-group",
      show: formData.savingsType !== "one-time",
    },
    {
      id: "savingsPeriod",
      label: "Savings Period (Years)",
      type: "number",
      placeholder: "Enter savings period",
      step: "1",
      required: true,
    },
    {
      id: "interestRate",
      label: "Annual Interest Rate (%)",
      type: "number",
      placeholder: "Enter interest rate",
      step: "0.01",
      required: true,
    },
    {
      id: "compounding",
      label: "Compounding Frequency",
      type: "select",
      options: [
        { value: "annually", label: "Annually" },
        { value: "semi-annually", label: "Semi-Annually" },
        { value: "quarterly", label: "Quarterly" },
        { value: "monthly", label: "Monthly" },
        { value: "daily", label: "Daily" },
      ],
    },
    {
      id: "inflationRate",
      label: "Inflation Rate (%)",
      type: "number",
      placeholder: "Enter inflation rate",
      step: "0.01",
    },
    {
      id: "savingsGoal",
      label: "Savings Goal ($)",
      type: "number",
      placeholder: "Enter savings goal",
      step: "100",
    },
    {
      id: "currency",
      label: "Currency",
      type: "select",
      options: [
        { value: "USD", label: "$ USD" },
        { value: "CAD", label: "$ CAD" },
        { value: "EUR", label: "€ EUR" },
        { value: "GBP", label: "£ GBP" },
      ],
    },
  ];

  return (
    <>
      <div className="bg-white min-h-screen flex justify-center items-center p-5">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-7 max-w-5xl w-full flex gap-7">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">Advanced Savings Calculator</h1>
            {inputFields.map(
              (field) =>
                field.show !== false && (
                  <div key={field.id} className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        value={formData[field.id]}
                        onChange={(e) => updateFormData(field.id, e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-50"
                      >
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.id]}
                        onChange={(e) => updateFormData(field.id, e.target.value)}
                        step={field.step}
                        required={field.required}
                        className="w-full p-3 border rounded-lg bg-gray-50"
                      />
                    )}
                  </div>
                )
            )}
            <button
              onClick={calculateSavings}
              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 w-full"
            >
              Calculate Savings
            </button>
            {results && (
              <div className="bg-gray-100 p-5 rounded-lg mt-5">
                {Object.entries(results).map(([key, value]) => (
                  <p key={key} className="text-gray-800 my-2">
                    <strong>
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                    </strong>{" "}
                    {key === "effectiveReturn"
                      ? `${value.toFixed(2)}%`
                      : key === "goalStatus"
                      ? value
                      : formatCurrency(value, formData.currency)}
                  </p>
                ))}
              </div>
            )}
            <div className="mt-5">
              <canvas ref={growthChartRef} />
            </div>
          </div>
          <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-100 rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">Projections & History</h1>
            {projectionData.length > 0 && (
              <table className="w-full text-sm text-gray-800 bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#3498db] text-white">
                    <th className="p-3 text-right">Year</th>
                    <th className="p-3 text-right">Contribution</th>
                    <th className="p-3 text-right">Interest</th>
                    <th className="p-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-[#f8f9fa]" : ""}>
                      <td className="p-3 text-right">{item.year}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.contribution, formData.currency)}
                      </td>
                      <td className="p-3 text-right">{formatCurrency(item.interest, formData.currency)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.balance, formData.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-5">
              {history.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg mb-2 shadow">
                  {Object.entries(item).map(([key, value]) => (
                    <p key={key}>
                      <strong>
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                      </strong>{" "}
                      {value}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            {comparisonData.length > 0 && (
              <table className="w-full text-sm text-gray-800 bg-white rounded-lg overflow-hidden mt-5">
                <thead>
                  <tr className="bg-[#3498db] text-white">
                    <th className="p-3 text-right">Scenario</th>
                    <th className="p-3 text-right">Final Balance</th>
                    <th className="p-3 text-right">Real Balance</th>
                    <th className="p-3 text-right">Time to Goal (Years)</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-[#f8f9fa]" : ""}>
                      <td className="p-3 text-right">{item.label}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.finalBalance, formData.currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.realBalance, formData.currency)}
                      </td>
                      <td className="p-3 text-right">{item.timeToGoal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-5">
              <canvas ref={breakdownChartRef} />
            </div>
            <button
              onClick={exportProjections}
              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 w-full mt-5"
            >
              Export Projections (CSV)
            </button>
            <button
              onClick={compareScenarios}
              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 w-full mt-2"
            >
              Compare Scenarios
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        input,
        select,
        button {
          transition: all 0.3s ease;
        }
        input:focus,
        select:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
        }
        button:hover {
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
          }
          .max-h\\[700px\\] {
            max-height: 500px;
          }
        }
      `}</style>
    </>
  );
}
