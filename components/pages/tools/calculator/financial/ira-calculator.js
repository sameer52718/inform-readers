"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scenarios, setScenarios] = useState([
    {
      iraType: "traditional",
      initialBalance: "10000",
      contribution: "7000",
      rate: "6",
      currentAge: "30",
      retirementAge: "65",
      lifeExpectancy: "85",
      currentTaxRate: "25",
      retirementTaxRate: "20",
      inflationRate: "2",
      currency: "USD",
    },
  ]);
  const [taxableRate, setTaxableRate] = useState("5");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [showBalanceTable, setShowBalanceTable] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const exchangeRates = { USD: 1, EUR: 0.95, GBP: 0.8 };
  const currencySymbol = scenarios[0].currency === "USD" ? "$" : scenarios[0].currency === "EUR" ? "€" : "£";

  useEffect(() => {
    const savedData = localStorage.getItem("iraData");
    if (savedData) {
      const { scenarios, otherInputs } = JSON.parse(savedData);
      setScenarios(scenarios);
      setTaxableRate(otherInputs.taxableRate);
    }
  }, []);

  const addScenario = () => {
    setScenarios([
      ...scenarios,
      {
        iraType: "traditional",
        initialBalance: "10000",
        contribution: "7000",
        rate: "6",
        currentAge: "30",
        retirementAge: "65",
        lifeExpectancy: "85",
        currentTaxRate: "25",
        retirementTaxRate: "20",
        inflationRate: "2",
        currency: "USD",
      },
    ]);
  };

  const removeScenario = (index) => {
    setScenarios(scenarios.filter((_, i) => i !== index));
  };

  const updateScenario = (index, field, value) => {
    const updatedScenarios = [...scenarios];
    updatedScenarios[index] = { ...updatedScenarios[index], [field]: value };
    setScenarios(updatedScenarios);
  };

  const resetForm = () => {
    setScenarios([
      {
        iraType: "traditional",
        initialBalance: "10000",
        contribution: "7000",
        rate: "6",
        currentAge: "30",
        retirementAge: "65",
        lifeExpectancy: "85",
        currentTaxRate: "25",
        retirementTaxRate: "20",
        inflationRate: "2",
        currency: "USD",
      },
    ]);
    setTaxableRate("5");
    setResults(null);
    setError("");
    localStorage.removeItem("iraData");
  };

  const validateInputs = (scenarios, taxableRate) => {
    const errors = [];
    if (scenarios.length === 0) errors.push("Add at least one scenario.");
    scenarios.forEach((scenario, index) => {
      if (scenario.initialBalance < 0 || isNaN(scenario.initialBalance))
        errors.push(`Scenario ${index + 1}: Invalid initial balance.`);
      if (scenario.contribution < 0 || isNaN(scenario.contribution))
        errors.push(`Scenario ${index + 1}: Invalid contribution.`);
      if (scenario.rate < 0 || isNaN(scenario.rate))
        errors.push(`Scenario ${index + 1}: Invalid return rate.`);
      if (scenario.currentAge < 18 || scenario.currentAge > 100 || isNaN(scenario.currentAge))
        errors.push(`Scenario ${index + 1}: Invalid current age.`);
      if (
        scenario.retirementAge < scenario.currentAge ||
        scenario.retirementAge > 100 ||
        isNaN(scenario.retirementAge)
      )
        errors.push(`Scenario ${index + 1}: Invalid retirement age.`);
      if (
        scenario.lifeExpectancy < scenario.retirementAge ||
        scenario.lifeExpectancy > 120 ||
        isNaN(scenario.lifeExpectancy)
      )
        errors.push(`Scenario ${index + 1}: Invalid life expectancy.`);
      if (scenario.currentTaxRate < 0 || scenario.currentTaxRate > 50 || isNaN(scenario.currentTaxRate))
        errors.push(`Scenario ${index + 1}: Invalid current tax rate.`);
      if (
        scenario.retirementTaxRate < 0 ||
        scenario.retirementTaxRate > 50 ||
        isNaN(scenario.retirementTaxRate)
      )
        errors.push(`Scenario ${index + 1}: Invalid retirement tax rate.`);
      if (scenario.inflationRate < 0 || scenario.inflationRate > 10 || isNaN(scenario.inflationRate))
        errors.push(`Scenario ${index + 1}: Invalid inflation rate.`);
      if (scenario.contribution > (scenario.currentAge >= 50 ? 8000 : 7000))
        errors.push(
          `Scenario ${index + 1}: Contribution exceeds IRS limit (${
            scenario.currentAge >= 50 ? "$8,000" : "$7,000"
          }).`
        );
    });
    if (taxableRate < 0 || isNaN(taxableRate)) errors.push("Invalid taxable account rate.");
    return errors;
  };

  const calculateCompoundGrowth = (balance, rate, years) => {
    const amount = balance * Math.pow(1 + rate / 100, years);
    return isFinite(amount) ? amount : balance;
  };

  const calculateRMD = (balance, age) => {
    if (age < 73) return 0;
    const lifeExpectancyFactor = Math.max(27.4 - (age - 73), 1);
    const rmd = balance / lifeExpectancyFactor;
    return isFinite(rmd) ? rmd : 0;
  };

  const calculateTaxableAccount = (initialBalance, contribution, rate, years, taxRate) => {
    let balance = initialBalance;
    let totalContributions = initialBalance;
    for (let i = 0; i < years; i++) {
      const growth = balance * (rate / 100);
      balance += growth * (1 - taxRate / 100);
      if (i < years) {
        balance += contribution;
        totalContributions += contribution;
      }
    }
    return { balance, totalContributions };
  };

  const generateYearlySchedule = (scenario, taxableRate, id) => {
    const schedule = [];
    let balance = parseFloat(scenario.initialBalance);
    let totalContributions = parseFloat(scenario.initialBalance);
    let totalGrowth = 0;
    let totalWithdrawals = 0;
    let totalTaxes = 0;
    const yearsToRetirement = scenario.retirementAge - scenario.currentAge;
    const totalYears = scenario.lifeExpectancy - scenario.currentAge;
    const realRate = (scenario.rate - scenario.inflationRate) / 100;
    const exchangeRate = exchangeRates[scenario.currency] || 1;

    for (let year = 0; year < yearsToRetirement; year++) {
      const age = scenario.currentAge + year;
      const contribution =
        parseFloat(scenario.contribution) * Math.pow(1 + scenario.inflationRate / 100, year);
      const contributionAfterTax =
        scenario.iraType === "roth" ? contribution * (1 - scenario.currentTaxRate / 100) : contribution;
      balance += contributionAfterTax;
      totalContributions += contributionAfterTax;
      const growth = balance * realRate;
      balance += growth;
      totalGrowth += growth;
      schedule.push({
        scenarioId: id,
        year: year + 1,
        age,
        balance: (balance / exchangeRate).toFixed(2),
        contribution: (contributionAfterTax / exchangeRate).toFixed(2),
        growth: (growth / exchangeRate).toFixed(2),
        withdrawal: "0.00",
        taxes: "0.00",
      });
    }

    const retirementBalance = balance;
    const withdrawalYears = scenario.lifeExpectancy - scenario.retirementAge;
    const annualWithdrawal = retirementBalance / withdrawalYears;
    for (let year = yearsToRetirement; year < totalYears; year++) {
      const age = scenario.currentAge + year;
      const growth = balance * realRate;
      balance += growth;
      totalGrowth += growth;
      let withdrawal =
        annualWithdrawal * Math.pow(1 + scenario.inflationRate / 100, year - yearsToRetirement);
      let taxes = 0;

      if (scenario.iraType === "traditional" && age >= 73) {
        const rmd = calculateRMD(balance, age);
        withdrawal = Math.max(withdrawal, rmd);
      }

      if (scenario.iraType === "traditional") {
        taxes = withdrawal * (scenario.retirementTaxRate / 100);
        if (age < 59.5) taxes += withdrawal * 0.1;
      } else if (scenario.iraType === "roth" && age < 59.5) {
        const taxablePortion = Math.max(0, withdrawal - totalContributions);
        taxes = taxablePortion * 0.1;
      }

      balance -= withdrawal;
      totalWithdrawals += withdrawal;
      totalTaxes += taxes;

      schedule.push({
        scenarioId: id,
        year: year + 1,
        age,
        balance: (balance / exchangeRate).toFixed(2),
        contribution: "0.00",
        growth: (growth / exchangeRate).toFixed(2),
        withdrawal: (withdrawal / exchangeRate).toFixed(2),
        taxes: (taxes / exchangeRate).toFixed(2),
      });

      if (balance < 0) break;
    }

    const taxable = calculateTaxableAccount(
      parseFloat(scenario.initialBalance),
      parseFloat(scenario.contribution),
      parseFloat(taxableRate),
      yearsToRetirement,
      parseFloat(scenario.currentTaxRate)
    );

    return {
      schedule,
      totalContributions,
      totalGrowth,
      totalWithdrawals,
      totalTaxes,
      taxableBalance: taxable.balance,
      taxableContributions: taxable.totalContributions,
    };
  };

  const calculateIRA = () => {
    setError("");
    setResults(null);

    const parsedScenarios = scenarios.map((scenario, index) => ({
      ...scenario,
      initialBalance: parseFloat(scenario.initialBalance) || 0,
      contribution: parseFloat(scenario.contribution) || 0,
      rate: parseFloat(scenario.rate) || 0,
      currentAge: parseInt(scenario.currentAge) || 0,
      retirementAge: parseInt(scenario.retirementAge) || 0,
      lifeExpectancy: parseInt(scenario.lifeExpectancy) || 0,
      currentTaxRate: parseFloat(scenario.currentTaxRate) || 0,
      retirementTaxRate: parseFloat(scenario.retirementTaxRate) || 0,
      inflationRate: parseFloat(scenario.inflationRate) || 0,
      exchangeRate: exchangeRates[scenario.currency] || 1,
      id: index + 1,
    }));
    const parsedTaxableRate = parseFloat(taxableRate) || 0;

    const errors = validateInputs(parsedScenarios, parsedTaxableRate);
    if (errors.length > 0) {
      setError(errors.join("<br />"));
      return;
    }

    localStorage.setItem("iraData", JSON.stringify({ scenarios, otherInputs: { taxableRate } }));

    let totalContributions = 0;
    let totalGrowth = 0;
    let totalWithdrawals = 0;
    let totalTaxes = 0;
    let maxYears = 0;
    const schedules = [];
    const chartData = [];

    parsedScenarios.forEach((scenario) => {
      const {
        schedule,
        totalContributions: contrib,
        totalGrowth: growth,
        totalWithdrawals: withdrawals,
        totalTaxes: taxes,
        taxableBalance,
        taxableContributions,
      } = generateYearlySchedule(scenario, parsedTaxableRate, scenario.id);
      totalContributions += contrib;
      totalGrowth += growth;
      totalWithdrawals += withdrawals;
      totalTaxes += taxes;
      maxYears = Math.max(maxYears, schedule.length);
      schedules.push(schedule);

      schedule.forEach((row) => {
        if (!chartData[row.year - 1]) {
          chartData[row.year - 1] = { year: row.year, balance: 0 };
        }
        chartData[row.year - 1].balance += parseFloat(row.balance) * scenario.exchangeRate;
      });
    });

    const reportData = {
      summary: {
        "Total Contributions": `${currencySymbol}${(
          totalContributions / parsedScenarios[0].exchangeRate
        ).toFixed(2)}`,
        "Total Growth": `${currencySymbol}${(totalGrowth / parsedScenarios[0].exchangeRate).toFixed(2)}`,
        "Total Withdrawals": `${currencySymbol}${(totalWithdrawals / parsedScenarios[0].exchangeRate).toFixed(
          2
        )}`,
        "Total Taxes Paid": `${currencySymbol}${(totalTaxes / parsedScenarios[0].exchangeRate).toFixed(2)}`,
        "Taxable Account Balance": `${currencySymbol}${
          schedules[0][schedules[0].length - 1].scenarioId === 1
            ? (
                calculateTaxableAccount(
                  parsedScenarios[0].initialBalance,
                  parsedScenarios[0].contribution,
                  parsedTaxableRate,
                  parsedScenarios[0].retirementAge - parsedScenarios[0].currentAge,
                  parsedScenarios[0].currentTaxRate
                ).balance / parsedScenarios[0].exchangeRate
              ).toFixed(2)
            : "N/A"
        }`,
      },
      table: schedules.flat(),
    };

    setResults(reportData);
    alert("Charts (Balance and Breakdown) not implemented in this demo.");
  };

  const downloadReport = () => {
    if (!results) {
      setError("No report data available.");
      return;
    }
    try {
      import("jspdf").then(({ jsPDF }) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("IRA Calculator Report", 20, 20);
        doc.setFontSize(12);
        let y = 30;
        Object.entries(results.summary).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`, 20, y);
          y += 10;
        });
        doc.addPage();
        doc.setFontSize(12);
        doc.text("Yearly Balance Details", 20, 20);
        y = 30;
        results.table.forEach((row) => {
          doc.text(
            `Scenario ${row.scenarioId}, Year ${row.year}, Age ${row.age}: Balance ${currencySymbol}${row.balance}, Contribution ${currencySymbol}${row.contribution}, Growth ${currencySymbol}${row.growth}, Withdrawal ${currencySymbol}${row.withdrawal}, Taxes ${currencySymbol}${row.taxes}`,
            20,
            y
          );
          y += 10;
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
        });
        doc.save("ira_calculator_report.pdf");
      });
    } catch (e) {
      setError("Error generating PDF: " + e.message);
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Advanced IRA Calculator</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            aria-label="Toggle dark mode"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter IRA Details</h2>
          {scenarios.map((scenario, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Scenario {index + 1}</h3>
                {index > 0 && (
                  <button
                    onClick={() => removeScenario(index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Remove scenario"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">IRA Type</label>
                  <select
                    value={scenario.iraType}
                    onChange={(e) => updateScenario(index, "iraType", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                    aria-label="IRA type"
                  >
                    <option value="traditional">Traditional IRA</option>
                    <option value="roth">Roth IRA</option>
                  </select>
                  <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                    Traditional or Roth IRA
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Initial Balance</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={scenario.initialBalance}
                    onChange={(e) => updateScenario(index, "initialBalance", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                    aria-label="Initial balance"
                  />
                  <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                    Current IRA balance
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Annual Contribution</label>
                  <input
                    type="number"
                    min="0"
                    max="8000"
                    step="100"
                    value={scenario.contribution}
                    onChange={(e) => updateScenario(index, "contribution", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                    aria-label="Annual contribution"
                  />
                  <input
                    type="range"
                    min="0"
                    max="8000"
                    step="100"
                    value={scenario.contribution}
                    onChange={(e) => updateScenario(index, "contribution", e.target.value)}
                    className="mt-2 w-full accent-red-500"
                    aria-label="Adjust contribution"
                  />
                  <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-16">
                    Annual contribution (max $7,000/$8,000)
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Expected Return Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="15"
                    value={scenario.rate}
                    onChange={(e) => updateScenario(index, "rate", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                    aria-label="Return rate"
                  />
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.1"
                    value={scenario.rate}
                    onChange={(e) => updateScenario(index, "rate", e.target.value)}
                    className="mt-2 w-full accent-red-500"
                    aria-label="Adjust return rate"
                  />
                  <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-16">
                    Annual investment return rate
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Current Age</label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={scenario.currentAge}
                    onChange={(e) => updateScenario(index, "currentAge", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                    aria-label="Current age"
                  />
                  <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                    Your current age
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Retirement Age</label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={scenario.retirementAge}
                    onChange={(e) => updateScenario(index, "retirementAge", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                    aria-label="Retirement age"
                  />
                  <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                    Age at retirement
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Life Expectancy</label>
                  <input
                    type="number"
                    min="18"
                    max="120"
                    value={scenario.lifeExpectancy}
                    onChange={(e) => updateScenario(index, "lifeExpectancy", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                    aria-label="Life expectancy"
                  />
                  <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                    Expected lifespan
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Current Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="50"
                    value={scenario.currentTaxRate}
                    onChange={(e) => updateScenario(index, "currentTaxRate", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                    aria-label="Current tax rate"
                  />
                  <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                    Current income tax rate
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Retirement Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="50"
                    value={scenario.retirementTaxRate}
                    onChange={(e) => updateScenario(index, "retirementTaxRate", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                    aria-label="Retirement tax rate"
                  />
                  <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                    Expected tax rate in retirement
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Inflation Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={scenario.inflationRate}
                    onChange={(e) => updateScenario(index, "inflationRate", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                    aria-label="Inflation rate"
                  />
                  <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                    Annual inflation rate
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Currency</label>
                  <select
                    value={scenario.currency}
                    onChange={(e) => updateScenario(index, "currency", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                    aria-label="Currency"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                  <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                    Select currency for display
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={addScenario}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              aria-label="Add another scenario"
            >
              Add Another Scenario
            </button>
            <button
              onClick={resetForm}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              aria-label="Reset form"
            >
              Reset Form
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Compare with Taxable Account Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="15"
                value={taxableRate}
                onChange={(e) => setTaxableRate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-200"
                aria-label="Taxable account rate"
              />
              <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8">
                Return rate for taxable account comparison
              </span>
            </div>
          </div>
          <button
            onClick={calculateIRA}
            className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            aria-label="Calculate IRA"
          >
            Calculate
          </button>
        </div>

        {results && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
            {error && <div className="text-red-600 mb-4" dangerouslySetInnerHTML={{ __html: error }} />}
            <div className="mb-4">
              {Object.entries(results.summary).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong> {value}
                </p>
              ))}
            </div>
            <button
              onClick={() => setShowBalanceTable(!showBalanceTable)}
              className="w-full text-left bg-gray-200 p-2 rounded-md mb-2 hover:bg-gray-300"
              aria-label="Toggle balance table"
            >
              Yearly Balance Table
            </button>
            {showBalanceTable && (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-2">Scenario</th>
                      <th className="px-4 py-2">Year</th>
                      <th className="px-4 py-2">Age</th>
                      <th className="px-4 py-2">Balance</th>
                      <th className="px-4 py-2">Contribution</th>
                      <th className="px-4 py-2">Growth</th>
                      <th className="px-4 py-2">Withdrawal</th>
                      <th className="px-4 py-2">Taxes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.table.map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-2">{row.scenarioId}</td>
                        <td className="px-4 py-2">{row.year}</td>
                        <td className="px-4 py-2">{row.age}</td>
                        <td className="px-4 py-2">
                          {currencySymbol}
                          {row.balance}
                        </td>
                        <td className="px-4 py-2">
                          {currencySymbol}
                          {row.contribution}
                        </td>
                        <td className="px-4 py-2">
                          {currencySymbol}
                          {row.growth}
                        </td>
                        <td className="px-4 py-2">
                          {currencySymbol}
                          {row.withdrawal}
                        </td>
                        <td className="px-4 py-2">
                          {currencySymbol}
                          {row.taxes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="w-full text-left bg-gray-200 p-2 rounded-md mb-2 hover:bg-gray-300"
              aria-label="Toggle charts"
            >
              Charts
            </button>
            {showCharts && (
              <div className="mb-4">
                <p className="text-gray-600 text-center">Balance Chart not implemented in this demo.</p>
                <p className="text-gray-600 text-center mt-4">
                  Breakdown Chart not implemented in this demo.
                </p>
              </div>
            )}
            <button
              onClick={downloadReport}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              aria-label="Download PDF report"
            >
              Download PDF Report
            </button>
          </div>
        )}

        <style jsx>{`
          .relative:hover .tooltip {
            display: block;
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #ef4444;
            cursor: pointer;
            border-radius: 50%;
          }
          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #ef4444;
            cursor: pointer;
            border-radius: 50%;
          }
        `}</style>
      </div>
    </div>
  );
}
