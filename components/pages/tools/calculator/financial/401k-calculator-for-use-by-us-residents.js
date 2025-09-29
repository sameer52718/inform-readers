"use client";

import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [formData, setFormData] = useState({
    currentBalance: "",
    annualSalary: "",
    employeeContribution: "",
    employerMatch: "",
    salaryGrowth: "",
    investmentPeriod: "",
    returnRate: "",
    compounding: "annually",
    inflationRate: "",
    withdrawalRate: "",
    currency: "USD",
  });
  const [projectionData, setProjectionData] = useState([]);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const growthChartRef = useRef(null);
  const breakdownChartRef = useRef(null);
  let growthChartInstance = useRef(null);
  let breakdownChartInstance = useRef(null);

  useEffect(() => {
    initializeCharts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "currentBalance",
        "annualSalary",
        "employeeContribution",
        "employerMatch",
        "salaryGrowth",
        "investmentPeriod",
        "returnRate",
        "inflationRate",
        "withdrawalRate",
      ].includes(name)
        ? parseFloat(value) || ""
        : value,
    }));
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  const initializeCharts = () => {
    const growthCtx = growthChartRef.current?.getContext("2d");
    if (growthCtx) {
      growthChartInstance.current = new Chart(growthCtx, {
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
          plugins: { title: { display: true, text: "401(k) Growth Over Time" } },
        },
      });
    }

    const breakdownCtx = breakdownChartRef.current?.getContext("2d");
    if (breakdownCtx) {
      breakdownChartInstance.current = new Chart(breakdownCtx, {
        type: "pie",
        data: {
          labels: ["Initial Balance", "Employee Contributions", "Employer Contributions", "Interest"],
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
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "401(k) Contribution Breakdown" },
          },
        },
      });
    }
  };

  const updateGrowthChart = (years, nominalBalances, realBalances) => {
    if (growthChartInstance.current) {
      growthChartInstance.current.data.labels = years;
      growthChartInstance.current.data.datasets[0].data = nominalBalances;
      growthChartInstance.current.data.datasets[1].data = realBalances;
      growthChartInstance.current.update();
    }
  };

  const updateBreakdownChart = (initial, employeeContributions, employerContributions, interest) => {
    if (breakdownChartInstance.current) {
      breakdownChartInstance.current.data.datasets[0].data = [
        initial,
        employeeContributions,
        employerContributions,
        interest,
      ];
      breakdownChartInstance.current.update();
    }
  };

  const calculate401k = () => {
    const {
      currentBalance,
      annualSalary,
      employeeContribution,
      employerMatch,
      salaryGrowth,
      investmentPeriod,
      returnRate,
      compounding,
      inflationRate,
      withdrawalRate,
      currency,
    } = formData;

    const parsed = {
      currentBalance: parseFloat(currentBalance) || 0,
      annualSalary: parseFloat(annualSalary) || 0,
      employeeContributionRate: parseFloat(employeeContribution) / 100 || 0,
      employerMatchRate: parseFloat(employerMatch) / 100 || 0,
      salaryGrowthRate: parseFloat(salaryGrowth) / 100 || 0,
      investmentPeriod: parseInt(investmentPeriod),
      returnRate: parseFloat(returnRate) / 100,
      inflationRate: parseFloat(inflationRate) / 100 || 0,
      withdrawalRate: parseFloat(withdrawalRate) / 100 || 0.04,
    };

    if (isNaN(parsed.investmentPeriod) || parsed.investmentPeriod <= 0) {
      alert("Please enter a valid investment period");
      return;
    }
    if (isNaN(parsed.returnRate) || parsed.returnRate < 0) {
      alert("Please enter a valid return rate");
      return;
    }
    if (parsed.annualSalary <= 0 && parsed.currentBalance <= 0) {
      alert("Please enter a valid salary or current balance");
      return;
    }
    if (parsed.employeeContributionRate < 0 || parsed.employerMatchRate < 0) {
      alert("Contribution rates cannot be negative");
      return;
    }

    const compoundingPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
    const n = compoundingPeriods[compounding];
    const ratePerPeriod = parsed.returnRate / n;
    const totalPeriods = parsed.investmentPeriod * n;

    let balance = parsed.currentBalance;
    let totalEmployeeContributions = 0;
    let totalEmployerContributions = 0;
    let totalInterest = 0;
    let currentSalary = parsed.annualSalary;
    const projections = [];
    const nominalBalances = [balance];
    const realBalances = [balance / Math.pow(1 + parsed.inflationRate, 0)];

    for (let year = 1; year <= parsed.investmentPeriod; year++) {
      let yearBalance = balance;
      let yearInterest = 0;
      let yearEmployeeContribution = currentSalary * parsed.employeeContributionRate;
      let yearEmployerContribution = Math.min(
        currentSalary * parsed.employerMatchRate,
        yearEmployeeContribution
      );
      let monthlyEmployeeContribution = yearEmployeeContribution / 12;
      let monthlyEmployerContribution = yearEmployerContribution / 12;

      for (let period = 1; period <= n; period++) {
        let periodContribution =
          period % (n / 12) === 0 ? monthlyEmployeeContribution + monthlyEmployerContribution : 0;
        let interest = yearBalance * ratePerPeriod;
        yearInterest += interest;
        yearBalance = yearBalance * (1 + ratePerPeriod) + periodContribution;
      }

      balance = yearBalance;
      totalEmployeeContributions += yearEmployeeContribution;
      totalEmployerContributions += yearEmployerContribution;
      totalInterest += yearInterest;
      projections.push({
        year,
        employeeContribution: yearEmployeeContribution,
        employerContribution: yearEmployerContribution,
        interest: yearInterest,
        balance,
      });
      nominalBalances.push(balance);
      realBalances.push(balance / Math.pow(1 + parsed.inflationRate, year));
      currentSalary *= 1 + parsed.salaryGrowthRate;
    }

    const finalBalance = balance;
    const realBalance = finalBalance / Math.pow(1 + parsed.inflationRate, parsed.investmentPeriod);
    const annualRetirementIncome = finalBalance * parsed.withdrawalRate;

    setResult({
      initialBalance: parsed.currentBalance,
      totalEmployeeContributions,
      totalEmployerContributions,
      totalInterest,
      finalBalance,
      realBalance,
      annualRetirementIncome,
      currency,
    });

    const calculation = {
      timestamp: new Date().toLocaleString(),
      currentBalance: formatCurrency(parsed.currentBalance, currency),
      annualSalary: formatCurrency(currentSalary, currency),
      employeeContribution: `${(parsed.employeeContributionRate * 100).toFixed(2)}%`,
      employerMatch: `${(parsed.employerMatchRate * 100).toFixed(2)}%`,
      salaryGrowth: `${(parsed.salaryGrowthRate * 100).toFixed(2)}%`,
      investmentPeriod: `${parsed.investmentPeriod} years`,
      returnRate: `${(parsed.returnRate * 100).toFixed(2)}%`,
      compounding,
      inflationRate: `${(parsed.inflationRate * 100).toFixed(2)}%`,
      withdrawalRate: `${(parsed.withdrawalRate * 100).toFixed(2)}%`,
      totalEmployeeContributions: formatCurrency(totalEmployeeContributions, currency),
      totalEmployerContributions: formatCurrency(totalEmployerContributions, currency),
      totalInterest: formatCurrency(totalInterest, currency),
      finalBalance: formatCurrency(finalBalance, currency),
      realBalance: formatCurrency(realBalance, currency),
      annualRetirementIncome: formatCurrency(annualRetirementIncome, currency),
    };
    setHistory([...history, calculation]);
    setProjectionData(projections);

    updateGrowthChart(
      Array.from({ length: parsed.investmentPeriod + 1 }, (_, i) => i),
      nominalBalances,
      realBalances
    );
    updateBreakdownChart(
      parsed.currentBalance,
      totalEmployeeContributions,
      totalEmployerContributions,
      totalInterest
    );
  };

  const compareScenarios = () => {
    const {
      currentBalance,
      annualSalary,
      employeeContribution,
      employerMatch,
      salaryGrowth,
      investmentPeriod,
      returnRate,
      compounding,
      inflationRate,
      withdrawalRate,
      currency,
    } = formData;

    const parsed = {
      currentBalance: parseFloat(currentBalance) || 0,
      annualSalary: parseFloat(annualSalary) || 0,
      employeeContributionRate: parseFloat(employeeContribution) / 100 || 0,
      employerMatchRate: parseFloat(employerMatch) / 100 || 0,
      salaryGrowthRate: parseFloat(salaryGrowth) / 100 || 0,
      investmentPeriod: parseInt(investmentPeriod),
      returnRate: parseFloat(returnRate) / 100,
      inflationRate: parseFloat(inflationRate) / 100 || 0,
      withdrawalRate: parseFloat(withdrawalRate) / 100 || 0.04,
    };

    if (isNaN(parsed.investmentPeriod) || isNaN(parsed.returnRate)) {
      alert("Please calculate 401(k) first");
      return;
    }

    const compoundingPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
    const n = compoundingPeriods[compounding];

    const scenarios = [
      {
        label: "Base Case",
        returnRate: parsed.returnRate,
        employeeContributionRate: parsed.employeeContributionRate,
      },
      {
        label: "Higher Return (+1%)",
        returnRate: parsed.returnRate + 0.01,
        employeeContributionRate: parsed.employeeContributionRate,
      },
      {
        label: "Lower Return (-1%)",
        returnRate: Math.max(parsed.returnRate - 0.01, 0),
        employeeContributionRate: parsed.employeeContributionRate,
      },
      {
        label: "Higher Contribution (+2%)",
        returnRate: parsed.returnRate,
        employeeContributionRate: parsed.employeeContributionRate + 0.02,
      },
    ];

    const newComparisonData = scenarios.map((scenario) => {
      let balance = parsed.currentBalance;
      let totalEmployeeContributions = 0;
      let totalEmployerContributions = 0;
      let totalInterest = 0;
      let scenarioSalary = parsed.annualSalary;
      const ratePerPeriod = scenario.returnRate / n;

      for (let year = 1; year <= parsed.investmentPeriod; year++) {
        let yearBalance = balance;
        let yearInterest = 0;
        let yearEmployeeContribution = scenarioSalary * scenario.employeeContributionRate;
        let yearEmployerContribution = Math.min(
          scenarioSalary * parsed.employerMatchRate,
          yearEmployeeContribution
        );
        let monthlyEmployeeContribution = yearEmployeeContribution / 12;
        let monthlyEmployerContribution = yearEmployerContribution / 12;

        for (let period = 1; period <= n; period++) {
          let periodContribution =
            period % (n / 12) === 0 ? monthlyEmployeeContribution + monthlyEmployerContribution : 0;
          let interest = yearBalance * ratePerPeriod;
          yearInterest += interest;
          yearBalance = yearBalance * (1 + ratePerPeriod) + periodContribution;
        }

        balance = yearBalance;
        totalEmployeeContributions += yearEmployeeContribution;
        totalEmployerContributions += yearEmployerContribution;
        totalInterest += yearInterest;
        scenarioSalary *= 1 + parsed.salaryGrowthRate;
      }

      const finalBalance = balance;
      const realBalance = finalBalance / Math.pow(1 + parsed.inflationRate, parsed.investmentPeriod);
      const annualRetirementIncome = finalBalance * parsed.withdrawalRate;
      return { label: scenario.label, finalBalance, realBalance, annualRetirementIncome };
    });

    setComparisonData(newComparisonData);
  };

  const exportProjections = () => {
    if (projectionData.length === 0) {
      alert("No projection data to export");
      return;
    }

    const currency = formData.currency;
    const csvContent = [
      "Year,Employee Contribution,Employer Contribution,Interest,Balance",
      ...projectionData.map(
        (item) =>
          `${item.year},${item.employeeContribution.toFixed(2)},${item.employerContribution.toFixed(
            2
          )},${item.interest.toFixed(2)},${item.balance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "401k_projections.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-5xl w-full flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Advanced 401(k) Calculator</h1>
            {[
              {
                label: "Current 401(k) Balance ($)",
                name: "currentBalance",
                type: "number",
                placeholder: "Enter current balance",
                step: "100",
              },
              {
                label: "Annual Salary ($)",
                name: "annualSalary",
                type: "number",
                placeholder: "Enter annual salary",
                step: "1000",
              },
              {
                label: "Employee Contribution (%)",
                name: "employeeContribution",
                type: "number",
                placeholder: "Enter contribution percentage",
                step: "0.1",
              },
              {
                label: "Employer Match (% up to)",
                name: "employerMatch",
                type: "number",
                placeholder: "Enter employer match percentage",
                step: "0.1",
              },
              {
                label: "Annual Salary Growth Rate (%)",
                name: "salaryGrowth",
                type: "number",
                placeholder: "Enter salary growth rate",
                step: "0.01",
              },
              {
                label: "Years Until Retirement",
                name: "investmentPeriod",
                type: "number",
                placeholder: "Enter years until retirement",
                step: "1",
                required: true,
              },
              {
                label: "Expected Annual Return Rate (%)",
                name: "returnRate",
                type: "number",
                placeholder: "Enter return rate",
                step: "0.01",
                required: true,
              },
              {
                label: "Compounding Frequency",
                name: "compounding",
                type: "select",
                options: ["annually", "semi-annually", "quarterly", "monthly"],
              },
              {
                label: "Inflation Rate (%)",
                name: "inflationRate",
                type: "number",
                placeholder: "Enter inflation rate",
                step: "0.01",
              },
              {
                label: "Annual Withdrawal Rate at Retirement (%)",
                name: "withdrawalRate",
                type: "number",
                placeholder: "Enter withdrawal rate",
                step: "0.01",
              },
              { label: "Currency", name: "currency", type: "select", options: ["USD", "CAD", "EUR", "GBP"] },
            ].map(({ label, name, type, placeholder, step, required, options }) => (
              <div key={name} className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
                {type === "select" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200"
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {name === "currency"
                          ? `${
                              opt === "USD"
                                ? "$ USD"
                                : opt === "CAD"
                                ? "$ CAD"
                                : opt === "EUR"
                                ? "€ EUR"
                                : "£ GBP"
                            }`
                          : opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    step={step}
                    required={required}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200"
                  />
                )}
              </div>
            ))}
            <button
              onClick={calculate401k}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 w-full"
            >
              Calculate 401(k)
            </button>
            {result && (
              <div className="bg-gray-100 p-5 rounded-lg mt-4">
                <p>
                  <strong>Initial Balance:</strong> {formatCurrency(result.initialBalance, result.currency)}
                </p>
                <p>
                  <strong>Total Employee Contributions:</strong>{" "}
                  {formatCurrency(result.totalEmployeeContributions, result.currency)}
                </p>
                <p>
                  <strong>Total Employer Contributions:</strong>{" "}
                  {formatCurrency(result.totalEmployerContributions, result.currency)}
                </p>
                <p>
                  <strong>Total Interest Earned:</strong>{" "}
                  {formatCurrency(result.totalInterest, result.currency)}
                </p>
                <p>
                  <strong>Final Balance:</strong> {formatCurrency(result.finalBalance, result.currency)}
                </p>
                <p>
                  <strong>Real Balance (Inflation-Adjusted):</strong>{" "}
                  {formatCurrency(result.realBalance, result.currency)}
                </p>
                <p>
                  <strong>Annual Retirement Income:</strong>{" "}
                  {formatCurrency(result.annualRetirementIncome, result.currency)}
                </p>
              </div>
            )}
            <div className="mt-4">
              <canvas ref={growthChartRef}></canvas>
            </div>
          </div>
          <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-100 rounded-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Projections & History</h1>
            {projectionData.length > 0 && (
              <table className="w-full text-sm text-gray-600 bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-red-500 text-white">
                    <th className="p-3 text-right">Year</th>
                    <th className="p-3 text-right">Employee Contribution</th>
                    <th className="p-3 text-right">Employer Contribution</th>
                    <th className="p-3 text-right">Interest</th>
                    <th className="p-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionData.map((item) => (
                    <tr key={item.year} className="even:bg-gray-50">
                      <td className="p-3 text-right">{item.year}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.employeeContribution, formData.currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.employerContribution, formData.currency)}
                      </td>
                      <td className="p-3 text-right">{formatCurrency(item.interest, formData.currency)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.balance, formData.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div>
              {history.map((item, index) => (
                <div key={index} className="bg-white p-4 mb-2 rounded-lg shadow-sm">
                  <p>
                    <strong>Date:</strong> {item.timestamp}
                  </p>
                  <p>
                    <strong>Current Balance:</strong> {item.currentBalance}
                  </p>
                  <p>
                    <strong>Annual Salary:</strong> {item.annualSalary}
                  </p>
                  <p>
                    <strong>Employee Contribution:</strong> {item.employeeContribution}
                  </p>
                  <p>
                    <strong>Employer Match:</strong> {item.employerMatch}
                  </p>
                  <p>
                    <strong>Salary Growth:</strong> {item.salaryGrowth}
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
                    <strong>Inflation Rate:</strong> {item.inflationRate}
                  </p>
                  <p>
                    <strong>Withdrawal Rate:</strong> {item.withdrawalRate}
                  </p>
                  <p>
                    <strong>Total Employee Contributions:</strong> {item.totalEmployeeContributions}
                  </p>
                  <p>
                    <strong>Total Employer Contributions:</strong> {item.totalEmployerContributions}
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
                    <strong>Annual Retirement Income:</strong> {item.annualRetirementIncome}
                  </p>
                </div>
              ))}
            </div>
            {comparisonData.length > 0 && (
              <table className="w-full text-sm text-gray-600 bg-white rounded-lg overflow-hidden mt-4">
                <thead>
                  <tr className="bg-red-500 text-white">
                    <th className="p-3 text-right">Scenario</th>
                    <th className="p-3 text-right">Final Balance</th>
                    <th className="p-3 text-right">Real Balance</th>
                    <th className="p-3 text-right">Retirement Income</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr key={index} className="even:bg-gray-50">
                      <td className="p-3 text-right">{item.label}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.finalBalance, formData.currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.realBalance, formData.currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.annualRetirementIncome, formData.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-4">
              <canvas ref={breakdownChartRef}></canvas>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <button
                onClick={exportProjections}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Export Projections (CSV)
              </button>
              <button
                onClick={compareScenarios}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Compare Scenarios
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .flex-col {
            flex-direction: column;
          }
          .max-h-\\[700px\\] {
            max-height: 500px;
          }
          table {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </>
  );
}
