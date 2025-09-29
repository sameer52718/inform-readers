"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [formData, setFormData] = useState({
    currentAge: "",
    retirementAge: "",
    lifeExpectancy: "",
    currentSavings: "",
    annualContribution: "",
    investmentRate: "",
    inflationRate: "",
    annualExpenses: "",
    pension: "",
    withdrawalStrategy: "4-percent",
    currency: "USD",
  });
  const [results, setResults] = useState(null);
  const [projectionData, setProjectionData] = useState([]);
  const [history, setHistory] = useState([]);
  const savingsGrowthChartRef = useRef(null);
  const balanceTrendChartRef = useRef(null);
  let savingsGrowthChart, balanceTrendChart;

  useEffect(() => {
    if (savingsGrowthChartRef.current) {
      savingsGrowthChart = new Chart(savingsGrowthChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            { label: "Nominal Savings", data: [], borderColor: "#3498db", fill: false, tension: 0.1 },
            {
              label: "Inflation-Adjusted Savings",
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
            y: { beginAtZero: true, title: { display: true, text: "Savings" } },
            x: { title: { display: true, text: "Year" } },
          },
          plugins: { title: { display: true, text: "Savings Growth Until Retirement" } },
        },
      });
    }
    if (balanceTrendChartRef.current) {
      balanceTrendChart = new Chart(balanceTrendChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            { label: "Retirement Balance", data: [], borderColor: "#2ecc71", fill: false, tension: 0.1 },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Balance" } },
            x: { title: { display: true, text: "Year" } },
          },
          plugins: { title: { display: true, text: "Retirement Balance Over Time" } },
        },
      });
    }
    return () => {
      savingsGrowthChart?.destroy();
      balanceTrendChart?.destroy();
    };
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  const calculateRetirement = () => {
    const inputs = {
      currentAge: parseInt(formData.currentAge),
      retirementAge: parseInt(formData.retirementAge),
      lifeExpectancy: parseInt(formData.lifeExpectancy),
      currentSavings: parseFloat(formData.currentSavings),
      annualContribution: parseFloat(formData.annualContribution) || 0,
      investmentRate: parseFloat(formData.investmentRate) / 100,
      inflationRate: parseFloat(formData.inflationRate) / 100 || 0,
      annualExpenses: parseFloat(formData.annualExpenses),
      pension: parseFloat(formData.pension) || 0,
      withdrawalStrategy: formData.withdrawalStrategy,
      currency: formData.currency,
    };

    // Validation
    if (isNaN(inputs.currentAge) || inputs.currentAge < 0) {
      alert("Please enter a valid current age");
      return;
    }
    if (isNaN(inputs.retirementAge) || inputs.retirementAge <= inputs.currentAge) {
      alert("Retirement age must be greater than current age");
      return;
    }
    if (isNaN(inputs.lifeExpectancy) || inputs.lifeExpectancy <= inputs.retirementAge) {
      alert("Life expectancy must be greater than retirement age");
      return;
    }
    if (isNaN(inputs.currentSavings) || inputs.currentSavings < 0) {
      alert("Please enter a valid current savings amount");
      return;
    }
    if (isNaN(inputs.investmentRate) || inputs.investmentRate < 0) {
      alert("Please enter a valid investment return rate");
      return;
    }
    if (isNaN(inputs.annualExpenses) || inputs.annualExpenses <= 0) {
      alert("Please enter valid annual retirement expenses");
      return;
    }

    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const retirementYears = inputs.lifeExpectancy - inputs.retirementAge;

    // Calculate savings growth until retirement
    let savings = inputs.currentSavings;
    const nominalSavings = [savings];
    const realSavings = [savings / Math.pow(1 + inputs.inflationRate, 0)];
    for (let year = 1; year <= yearsToRetirement; year++) {
      savings = savings * (1 + inputs.investmentRate) + inputs.annualContribution;
      nominalSavings.push(savings);
      realSavings.push(savings / Math.pow(1 + inputs.inflationRate, year));
    }
    const retirementSavings = savings;
    const realRetirementSavings = savings / Math.pow(1 + inputs.inflationRate, yearsToRetirement);

    // Initialize projection data
    const newProjectionData = [];
    for (let year = 0; year < yearsToRetirement; year++) {
      const contribution = year < yearsToRetirement ? inputs.annualContribution : 0;
      newProjectionData.push({
        year,
        age: inputs.currentAge + year,
        savingsContribution: year === 0 ? inputs.currentSavings : contribution,
        withdrawal: 0,
        balance: nominalSavings[year],
      });
    }

    // Calculate retirement withdrawals
    let balance = retirementSavings;
    let annualWithdrawal;
    let fundsLastYears = 0;

    if (inputs.withdrawalStrategy === "4-percent") {
      annualWithdrawal = retirementSavings * 0.04;
    } else if (inputs.withdrawalStrategy === "fixed") {
      annualWithdrawal = Math.max(inputs.annualExpenses - inputs.pension, 0);
    } else {
      annualWithdrawal = Math.max(inputs.annualExpenses - inputs.pension, 0);
    }

    for (let year = 0; year <= retirementYears; year++) {
      const age = inputs.retirementAge + year;
      let withdrawal = 0;
      if (year > 0) {
        withdrawal =
          inputs.withdrawalStrategy === "inflation-adjusted"
            ? annualWithdrawal * Math.pow(1 + inputs.inflationRate, year - 1)
            : annualWithdrawal;
        balance = balance * (1 + inputs.investmentRate) - withdrawal;
      }
      newProjectionData.push({
        year: yearsToRetirement + year,
        age,
        savingsContribution: 0,
        withdrawal,
        balance: Math.max(balance, 0),
      });
      if (balance > 0 || year === 0) {
        fundsLastYears = year;
      }
      if (balance <= 0 && year < retirementYears) {
        break;
      }
    }

    // Calculate shortfall or surplus
    const totalWithdrawals = newProjectionData.reduce((sum, item) => sum + item.withdrawal, 0);
    const totalPension = inputs.pension * retirementYears;
    const shortfallSurplus = balance > 0 ? balance : totalWithdrawals - retirementSavings - totalPension;

    setResults({
      retirementSavings: formatCurrency(retirementSavings, inputs.currency),
      realSavings: formatCurrency(realRetirementSavings, inputs.currency),
      withdrawalAmount: formatCurrency(annualWithdrawal, inputs.currency),
      fundsDuration: `${fundsLastYears} years`,
      shortfallSurplus:
        balance > 0
          ? `Surplus: ${formatCurrency(shortfallSurplus, inputs.currency)}`
          : `Shortfall: ${formatCurrency(Math.abs(shortfallSurplus), inputs.currency)}`,
    });

    setProjectionData(newProjectionData);
    setHistory([
      ...history,
      {
        timestamp: new Date().toLocaleString(),
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        lifeExpectancy: inputs.lifeExpectancy,
        currentSavings: formatCurrency(inputs.currentSavings, inputs.currency),
        annualContribution: formatCurrency(inputs.annualContribution, inputs.currency),
        investmentRate: `${(inputs.investmentRate * 100).toFixed(2)}%`,
        inflationRate: `${(inputs.inflationRate * 100).toFixed(2)}%`,
        annualExpenses: formatCurrency(inputs.annualExpenses, inputs.currency),
        pension: formatCurrency(inputs.pension, inputs.currency),
        withdrawalStrategy: inputs.withdrawalStrategy,
        retirementSavings: formatCurrency(retirementSavings, inputs.currency),
        realSavings: formatCurrency(realRetirementSavings, inputs.currency),
        withdrawalAmount: formatCurrency(annualWithdrawal, inputs.currency),
        fundsDuration: `${fundsLastYears} years`,
        shortfallSurplus:
          balance > 0
            ? `Surplus: ${formatCurrency(shortfallSurplus, inputs.currency)}`
            : `Shortfall: ${formatCurrency(Math.abs(shortfallSurplus), inputs.currency)}`,
      },
    ]);

    savingsGrowthChart.data.labels = Array.from({ length: yearsToRetirement + 1 }, (_, i) => i);
    savingsGrowthChart.data.datasets[0].data = nominalSavings;
    savingsGrowthChart.data.datasets[1].data = realSavings;
    savingsGrowthChart.update();

    balanceTrendChart.data.labels = newProjectionData.map((item) => item.year);
    balanceTrendChart.data.datasets[0].data = newProjectionData.map((item) => item.balance);
    balanceTrendChart.update();
  };

  const compareScenarios = () => {
    const inputs = {
      currentAge: parseInt(formData.currentAge),
      retirementAge: parseInt(formData.retirementAge),
      lifeExpectancy: parseInt(formData.lifeExpectancy),
      currentSavings: parseFloat(formData.currentSavings),
      annualContribution: parseFloat(formData.annualContribution) || 0,
      investmentRate: parseFloat(formData.investmentRate) / 100,
      inflationRate: parseFloat(formData.inflationRate) / 100 || 0,
      annualExpenses: parseFloat(formData.annualExpenses),
      pension: parseFloat(formData.pension) || 0,
      currency: formData.currency,
    };

    if (
      isNaN(inputs.currentAge) ||
      isNaN(inputs.retirementAge) ||
      isNaN(inputs.lifeExpectancy) ||
      isNaN(inputs.currentSavings) ||
      isNaN(inputs.investmentRate) ||
      isNaN(inputs.annualExpenses)
    ) {
      alert("Please calculate retirement first");
      return;
    }

    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const retirementYears = inputs.lifeExpectancy - inputs.retirementAge;

    const scenarios = [
      { label: "Base Case", rate: inputs.investmentRate, contribution: inputs.annualContribution },
      {
        label: "Higher Return (+1%)",
        rate: inputs.investmentRate + 0.01,
        contribution: inputs.annualContribution,
      },
      {
        label: "Lower Return (-1%)",
        rate: Math.max(inputs.investmentRate - 0.01, 0),
        contribution: inputs.annualContribution,
      },
      {
        label: "Double Contribution",
        rate: inputs.investmentRate,
        contribution: inputs.annualContribution * 2,
      },
    ];

    const comparisonData = scenarios.map((scenario) => {
      let savings = inputs.currentSavings;
      for (let year = 1; year <= yearsToRetirement; year++) {
        savings = savings * (1 + scenario.rate) + scenario.contribution;
      }
      let balance = savings;
      const annualWithdrawal = savings * 0.04; // Use 4% rule for comparison
      let fundsLastYears = 0;
      for (let year = 1; year <= retirementYears; year++) {
        balance = balance * (1 + scenario.rate) - annualWithdrawal;
        if (balance > 0) {
          fundsLastYears = year;
        }
        if (balance <= 0) break;
      }
      const shortfallSurplus =
        balance > 0 ? balance : (inputs.annualExpenses - inputs.pension) * retirementYears - savings;
      return {
        label: scenario.label,
        savings,
        fundsLastYears,
        shortfallSurplus: balance > 0 ? shortfallSurplus : -shortfallSurplus,
        surplus: balance > 0,
      };
    });

    return comparisonData;
  };

  const exportProjections = () => {
    if (projectionData.length === 0) {
      alert("No projection data to export");
      return;
    }

    const csvContent = [
      "Year,Age,Savings/Contribution,Withdrawal,Balance",
      ...projectionData.map(
        (item) =>
          `${item.year},${item.age},${item.savingsContribution.toFixed(2)},${item.withdrawal.toFixed(
            2
          )},${item.balance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "retirement_projections.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const inputFields = [
    {
      id: "currentAge",
      label: "Current Age",
      type: "number",
      step: "1",
      placeholder: "Enter current age",
      required: true,
    },
    {
      id: "retirementAge",
      label: "Retirement Age",
      type: "number",
      step: "1",
      placeholder: "Enter retirement age",
      required: true,
    },
    {
      id: "lifeExpectancy",
      label: "Life Expectancy",
      type: "number",
      step: "1",
      placeholder: "Enter life expectancy",
      required: true,
    },
    {
      id: "currentSavings",
      label: "Current Savings",
      type: "number",
      step: "1000",
      placeholder: "Enter current savings",
      required: true,
    },
    {
      id: "annualContribution",
      label: "Annual Contribution",
      type: "number",
      step: "100",
      placeholder: "Enter annual contribution",
    },
    {
      id: "investmentRate",
      label: "Investment Return Rate (%)",
      type: "number",
      step: "0.01",
      placeholder: "Enter return rate",
      required: true,
    },
    {
      id: "inflationRate",
      label: "Inflation Rate (%)",
      type: "number",
      step: "0.01",
      placeholder: "Enter inflation rate",
    },
    {
      id: "annualExpenses",
      label: "Annual Retirement Expenses",
      type: "number",
      step: "1000",
      placeholder: "Enter annual expenses",
      required: true,
    },
    {
      id: "pension",
      label: "Annual Pension/Social Security",
      type: "number",
      step: "100",
      placeholder: "Enter annual pension",
    },
    {
      id: "withdrawalStrategy",
      label: "Withdrawal Strategy",
      type: "select",
      options: ["4-percent", "fixed", "inflation-adjusted"],
    },
    { id: "currency", label: "Currency", type: "select", options: ["USD", "CAD", "EUR", "GBP"] },
  ];

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-5">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full flex gap-8 max-md:flex-col">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
              Advanced Retirement Calculator
            </h1>
            {inputFields.map((field) => (
              <div key={field.id} className="mb-5">
                <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    value={formData[field.id]}
                    onChange={(e) => updateFormData(field.id, e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 focus:border-red-500 focus:ring-red-200"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "USD"
                          ? "$ USD"
                          : opt === "CAD"
                          ? "$ CAD"
                          : opt === "EUR"
                          ? "€ EUR"
                          : opt === "GBP"
                          ? "£ GBP"
                          : opt === "4-percent"
                          ? "4% Rule"
                          : opt === "fixed"
                          ? "Fixed Annual Withdrawal"
                          : "Inflation-Adjusted Withdrawal"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.id]}
                    onChange={(e) => updateFormData(field.id, e.target.value)}
                    step={field.step}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 focus:border-red-500 focus:ring-red-200"
                  />
                )}
              </div>
            ))}
            <button
              onClick={calculateRetirement}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-transform hover:-translate-y-0.5"
            >
              Calculate Retirement
            </button>
            {results && (
              <div className="bg-gray-50 p-5 rounded-lg mt-5">
                {Object.entries(results).map(([key, value]) => (
                  <p key={key} className="text-gray-800 my-2">
                    <strong>
                      {key === "retirementSavings"
                        ? "Retirement Savings at Retirement"
                        : key === "realSavings"
                        ? "Real Savings (Inflation-Adjusted)"
                        : key === "withdrawalAmount"
                        ? "Annual Withdrawal Amount"
                        : key === "fundsDuration"
                        ? "Years Funds Will Last"
                        : "Shortfall/Surplus"}
                      :
                    </strong>{" "}
                    {value}
                  </p>
                ))}
              </div>
            )}
            <div className="mt-5">
              <canvas ref={savingsGrowthChartRef} />
            </div>
          </div>
          <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-50 rounded-lg max-md:max-h-[500px]">
            <h1 className="text-2xl font-semibold text-gray-800 mb-5 text-center">Projections & History</h1>
            {projectionData.length > 0 && (
              <table className="w-full text-sm text-gray-600 mb-5">
                <thead>
                  <tr className="bg-[#3498db] text-white">
                    <th className="p-3 text-right">Year</th>
                    <th className="p-3 text-right">Age</th>
                    <th className="p-3 text-right">Savings/Contribution</th>
                    <th className="p-3 text-right">Withdrawal</th>
                    <th className="p-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionData.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 text-right">{item.year}</td>
                      <td className="p-3 text-right">{item.age}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.savingsContribution, formData.currency)}
                      </td>
                      <td className="p-3 text-right">{formatCurrency(item.withdrawal, formData.currency)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.balance, formData.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div>
              {history.map((item, i) => (
                <div key={i} className="bg-white p-4 mb-3 rounded-lg shadow-sm">
                  <p className="text-gray-800">
                    <strong>Date:</strong> {item.timestamp}
                  </p>
                  <p className="text-gray-800">
                    <strong>Current Age:</strong> {item.currentAge}
                  </p>
                  <p className="text-gray-800">
                    <strong>Retirement Age:</strong> {item.retirementAge}
                  </p>
                  <p className="text-gray-800">
                    <strong>Life Expectancy:</strong> {item.lifeExpectancy}
                  </p>
                  <p className="text-gray-800">
                    <strong>Current Savings:</strong> {item.currentSavings}
                  </p>
                  <p className="text-gray-800">
                    <strong>Annual Contribution:</strong> {item.annualContribution}
                  </p>
                  <p className="text-gray-800">
                    <strong>Investment Rate:</strong> {item.investmentRate}
                  </p>
                  <p className="text-gray-800">
                    <strong>Inflation Rate:</strong> {item.inflationRate}
                  </p>
                  <p className="text-gray-800">
                    <strong>Annual Expenses:</strong> {item.annualExpenses}
                  </p>
                  <p className="text-gray-800">
                    <strong>Pension:</strong> {item.pension}
                  </p>
                  <p className="text-gray-800">
                    <strong>Withdrawal Strategy:</strong> {item.withdrawalStrategy}
                  </p>
                  <p className="text-gray-800">
                    <strong>Retirement Savings:</strong> {item.retirementSavings}
                  </p>
                  <p className="text-gray-800">
                    <strong>Real Savings:</strong> {item.realSavings}
                  </p>
                  <p className="text-gray-800">
                    <strong>Withdrawal Amount:</strong> {item.withdrawalAmount}
                  </p>
                  <p className="text-gray-800">
                    <strong>Funds Duration:</strong> {item.fundsDuration}
                  </p>
                  <p className="text-gray-800">
                    <strong>Shortfall/Surplus:</strong> {item.shortfallSurplus}
                  </p>
                </div>
              ))}
            </div>
            {compareScenarios().length > 0 && (
              <table className="w-full text-sm text-gray-600 mb-5">
                <thead>
                  <tr className="bg-[#3498db] text-white">
                    <th className="p-3 text-right">Scenario</th>
                    <th className="p-3 text-right">Savings at Retirement</th>
                    <th className="p-3 text-right">Years Funds Last</th>
                    <th className="p-3 text-right">Shortfall/Surplus</th>
                  </tr>
                </thead>
                <tbody>
                  {compareScenarios().map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 text-right">{item.label}</td>
                      <td className="p-3 text-right">{formatCurrency(item.savings, formData.currency)}</td>
                      <td className="p-3 text-right">{item.fundsLastYears} years</td>
                      <td className="p-3 text-right">
                        {item.surplus
                          ? `Surplus: ${formatCurrency(item.shortfallSurplus, formData.currency)}`
                          : `Shortfall: ${formatCurrency(
                              Math.abs(item.shortfallSurplus),
                              formData.currency
                            )}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-5">
              <canvas ref={balanceTrendChartRef} />
            </div>
            <button
              onClick={exportProjections}
              className="w-full bg-[#2ecc71] text-white p-3 rounded-lg hover:bg-[#27ae60] transition-transform hover:-translate-y-0.5 mt-5"
            >
              Export Projections (CSV)
            </button>
            <button
              onClick={() => compareScenarios()}
              className="w-full bg-[#2ecc71] text-white p-3 rounded-lg hover:bg-[#27ae60] transition-transform hover:-translate-y-0.5 mt-3"
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
        input:focus,
        select:focus {
          outline: none;
        }
        @media (max-width: 768px) {
          .max-md\\:flex-col {
            flex-direction: column;
          }
          .max-md\\:max-h-\\[500px\\] {
            max-height: 500px;
          }
        }
      `}</style>
    </>
  );
}
