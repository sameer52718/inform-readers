"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [accounts, setAccounts] = useState([
    { name: "", initialBalance: "", annualContribution: "", returnRate: "" },
  ]);
  const [formData, setFormData] = useState({
    currentAge: "",
    retirementAge: "",
    extraContributionAmount: "",
    extraContributionFrequency: "0",
    inflationRate: "",
    taxRate: "",
    withdrawalType: "lump-sum",
    withdrawalRate: "",
    currency: "USD",
  });
  const [results, setResults] = useState(null);
  const [breakdownData, setBreakdownData] = useState([]);
  const [history, setHistory] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const growthChartRef = useRef(null);
  const balanceChartRef = useRef(null);
  let growthChart, balanceChart;

  useEffect(() => {
    if (growthChartRef.current) {
      growthChart = new Chart(growthChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            { label: "Nominal Value", data: [], borderColor: "#3498db", fill: false },
            { label: "Real Value (Inflation-Adjusted)", data: [], borderColor: "#e74c3c", fill: false },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Year" } },
            y: { beginAtZero: true, title: { display: true, text: "Value" } },
          },
          plugins: { title: { display: true, text: "Roth IRA Growth Over Time" } },
        },
      });
    }
    if (balanceChartRef.current) {
      balanceChart = new Chart(balanceChartRef.current, {
        type: "pie",
        data: {
          labels: ["Contributions", "Growth", "Taxes/Penalties"],
          datasets: [
            {
              data: [0, 0, 0],
              backgroundColor: ["#3498db", "#2ecc71", "#e74c3c"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Balance Breakdown" } },
        },
      });
    }
    return () => {
      growthChart?.destroy();
      balanceChart?.destroy();
    };
  }, []);

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  const addAccount = () => {
    setAccounts([...accounts, { name: "", initialBalance: "", annualContribution: "", returnRate: "" }]);
  };

  const removeAccount = (index) => {
    setAccounts(accounts.filter((_, i) => i !== index));
  };

  const updateAccount = (index, field, value) => {
    const newAccounts = [...accounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setAccounts(newAccounts);
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateRothIRA = () => {
    const inputs = {
      currentAge: parseInt(formData.currentAge) || 0,
      retirementAge: parseInt(formData.retirementAge) || 0,
      extraContributionAmount: parseFloat(formData.extraContributionAmount) || 0,
      extraContributionFrequency: parseInt(formData.extraContributionFrequency) || 0,
      inflationRate: parseFloat(formData.inflationRate) / 100 || 0,
      taxRate: parseFloat(formData.taxRate) / 100 || 0,
      withdrawalType: formData.withdrawalType,
      withdrawalRate: parseFloat(formData.withdrawalRate) / 100 || 0.04,
      currency: formData.currency,
    };

    if (accounts.length === 0) {
      alert("Please add at least one Roth IRA account.");
      return;
    }
    if (inputs.currentAge <= 0 || inputs.retirementAge <= inputs.currentAge) {
      alert(
        "Please enter a valid current age and retirement age (retirement age must be greater than current age)."
      );
      return;
    }

    let calculatedAccounts = [];
    let totalContributions = 0;
    let totalGrowth = 0;
    let totalTaxesPenalties = 0;
    let newBreakdownData = [];

    const years = inputs.retirementAge - inputs.currentAge;
    const contributionLimit = inputs.currentAge >= 50 ? 8000 : 7000;

    for (let acc of accounts) {
      const name = acc.name || "Unnamed Account";
      const initialBalance = parseFloat(acc.initialBalance) || 0;
      const annualContribution = parseFloat(acc.annualContribution) || 0;
      const returnRate = parseFloat(acc.returnRate) / 100 || 0;

      if (initialBalance < 0 || annualContribution < 0 || returnRate <= 0) {
        alert(`Invalid inputs for ${name} (non-negative balance/contributions, positive return rate).`);
        return;
      }
      if (annualContribution > contributionLimit) {
        alert(`Annual contribution for ${name} exceeds Roth IRA limit of $${contributionLimit}.`);
        return;
      }

      let balance = initialBalance;
      let accountContributions = initialBalance;
      let accountGrowth = 0;
      let balances = [];
      let realBalances = [];

      for (let year = 1; year <= years; year++) {
        const contribution = Math.min(annualContribution, contributionLimit);
        const extraContribution =
          inputs.extraContributionFrequency > 0
            ? inputs.extraContributionAmount * inputs.extraContributionFrequency
            : 0;
        const totalYearContribution = contribution + extraContribution;

        if (totalYearContribution + annualContribution > contributionLimit) {
          alert(
            `Total contributions for ${name} in year ${year} exceed Roth IRA limit of $${contributionLimit}.`
          );
          return;
        }

        balance = balance * (1 + returnRate) + totalYearContribution;
        const yearGrowth = balance - balance / (1 + returnRate) - totalYearContribution;

        accountContributions += totalYearContribution;
        accountGrowth += yearGrowth;

        const realBalance = balance / Math.pow(1 + inputs.inflationRate, year);
        const isWithdrawalEligible = inputs.currentAge + year >= 59.5 && year >= 5;

        balances.push(balance);
        realBalances.push(realBalance);
        newBreakdownData.push({
          year,
          age: inputs.currentAge + year,
          account: name,
          balance,
          contributions: totalYearContribution,
          growth: yearGrowth,
          realBalance,
          withdrawalEligible: isWithdrawalEligible ? "Yes" : "No",
        });
      }

      const apy = Math.pow(1 + returnRate / 12, 12) - 1;
      const isQualified = inputs.retirementAge >= 59.5 && years >= 5;
      let withdrawalAmount = inputs.withdrawalType === "lump-sum" ? balance : balance * inputs.withdrawalRate;
      let taxesPenalties = 0;
      if (!isQualified) {
        const taxableEarnings =
          inputs.withdrawalType === "lump-sum"
            ? Math.max(0, balance - accountContributions)
            : Math.max(0, withdrawalAmount - accountContributions / years);
        taxesPenalties = taxableEarnings * (inputs.taxRate + 0.1);
      }
      const netWithdrawal = withdrawalAmount - taxesPenalties;

      calculatedAccounts.push({
        name,
        futureValue: balance,
        totalContributions: accountContributions,
        totalGrowth: accountGrowth,
        realValue: balance / Math.pow(1 + inputs.inflationRate, years),
        apy,
        withdrawalAmount,
        taxesPenalties,
        netWithdrawal,
        balances,
        realBalances,
      });

      totalContributions += accountContributions;
      totalGrowth += accountGrowth;
      totalTaxesPenalties += taxesPenalties;
    }

    setBreakdownData(newBreakdownData);
    setResults({
      futureValue: calculatedAccounts.reduce((sum, acc) => sum + acc.futureValue, 0),
      totalContributions,
      totalGrowth,
      realValue: calculatedAccounts.reduce((sum, acc) => sum + acc.realValue, 0),
      apy: calculatedAccounts[0].apy,
      withdrawalAmount: calculatedAccounts.reduce((sum, acc) => sum + acc.withdrawalAmount, 0),
      taxesPenalties: totalTaxesPenalties,
      netWithdrawal: calculatedAccounts.reduce((sum, acc) => sum + acc.netWithdrawal, 0),
    });

    const calculation = {
      timestamp: new Date().toLocaleString(),
      futureValue: formatCurrency(
        calculatedAccounts.reduce((sum, acc) => sum + acc.futureValue, 0),
        inputs.currency
      ),
      totalContributions: formatCurrency(totalContributions, inputs.currency),
      totalGrowth: formatCurrency(totalGrowth, inputs.currency),
      realValue: formatCurrency(
        calculatedAccounts.reduce((sum, acc) => sum + acc.realValue, 0),
        inputs.currency
      ),
      apy: `${(calculatedAccounts[0].apy * 100).toFixed(2)}%`,
      withdrawalAmount: formatCurrency(
        calculatedAccounts.reduce((sum, acc) => sum + acc.withdrawalAmount, 0),
        inputs.currency
      ),
      taxesPenalties: formatCurrency(totalTaxesPenalties, inputs.currency),
      netWithdrawal: formatCurrency(
        calculatedAccounts.reduce((sum, acc) => sum + acc.netWithdrawal, 0),
        inputs.currency
      ),
      accounts: calculatedAccounts.map((acc) => ({
        name: acc.name,
        futureValue: formatCurrency(acc.futureValue, inputs.currency),
        totalContributions: formatCurrency(acc.totalContributions, inputs.currency),
        totalGrowth: formatCurrency(acc.totalGrowth, inputs.currency),
        realValue: formatCurrency(acc.realValue, inputs.currency),
        apy: `${(acc.apy * 100).toFixed(2)}%`,
        withdrawalAmount: formatCurrency(acc.withdrawalAmount, inputs.currency),
        taxesPenalties: formatCurrency(acc.taxesPenalties, inputs.currency),
        netWithdrawal: formatCurrency(acc.netWithdrawal, inputs.currency),
      })),
      inputs: {
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        extraContributionAmount: formatCurrency(inputs.extraContributionAmount, inputs.currency),
        extraContributionFrequency:
          inputs.extraContributionFrequency === 0
            ? "None"
            : inputs.extraContributionFrequency === 12
            ? "Monthly"
            : inputs.extraContributionFrequency === 4
            ? "Quarterly"
            : "Annually",
        inflationRate: `${(inputs.inflationRate * 100).toFixed(2)}%`,
        taxRate: `${(inputs.taxRate * 100).toFixed(2)}%`,
        withdrawalType: inputs.withdrawalType === "lump-sum" ? "Lump-Sum" : "Annual",
        withdrawalRate: `${(inputs.withdrawalRate * 100).toFixed(2)}%`,
        currency: inputs.currency,
      },
    };
    setHistory([...history, calculation]);

    growthChart.data.labels = Array.from({ length: years }, (_, i) => `Year ${i + 1}`);
    growthChart.data.datasets[0].data = calculatedAccounts.map((acc) => acc.balances).flat();
    growthChart.data.datasets[1].data = calculatedAccounts.map((acc) => acc.realBalances).flat();
    growthChart.update();

    balanceChart.data.datasets[0].data = [totalContributions, totalGrowth, totalTaxesPenalties];
    balanceChart.update();
  };

  const compareAccounts = () => {
    const inputs = {
      currentAge: parseInt(formData.currentAge) || 0,
      retirementAge: parseInt(formData.retirementAge) || 0,
      extraContributionAmount: parseFloat(formData.extraContributionAmount) || 0,
      extraContributionFrequency: parseInt(formData.extraContributionFrequency) || 0,
      inflationRate: parseFloat(formData.inflationRate) / 100 || 0,
      taxRate: parseFloat(formData.taxRate) / 100 || 0,
      withdrawalType: formData.withdrawalType,
      withdrawalRate: parseFloat(formData.withdrawalRate) / 100 || 0.04,
      currency: formData.currency,
    };

    if (accounts.length === 0) {
      alert("Please add at least one Roth IRA account.");
      return;
    }
    if (inputs.currentAge <= 0 || inputs.retirementAge <= inputs.currentAge) {
      alert(
        "Please enter a valid current age and retirement age (retirement age must be greater than current age)."
      );
      return;
    }

    const years = inputs.retirementAge - inputs.currentAge;
    const contributionLimit = inputs.currentAge >= 50 ? 8000 : 7000;
    let newComparisonData = [];

    for (let acc of accounts) {
      const name = acc.name || "Unnamed Account";
      const initialBalance = parseFloat(acc.initialBalance) || 0;
      const annualContribution = parseFloat(acc.annualContribution) || 0;
      const returnRate = parseFloat(acc.returnRate) / 100 || 0;

      if (initialBalance < 0 || annualContribution < 0 || returnRate <= 0) {
        alert(`Invalid inputs for ${name} (non-negative balance/contributions, positive return rate).`);
        return;
      }
      if (annualContribution > contributionLimit) {
        alert(`Annual contribution for ${name} exceeds Roth IRA limit of $${contributionLimit}.`);
        return;
      }

      let balance = initialBalance;
      let totalAccountContributions = initialBalance;
      let totalAccountGrowth = 0;

      for (let year = 1; year <= years; year++) {
        const contribution = Math.min(annualContribution, contributionLimit);
        const extraContribution =
          inputs.extraContributionFrequency > 0
            ? inputs.extraContributionAmount * inputs.extraContributionFrequency
            : 0;
        const totalYearContribution = contribution + extraContribution;

        if (totalYearContribution + annualContribution > contributionLimit) {
          alert(
            `Total contributions for ${name} in year ${year} exceed Roth IRA limit of $${contributionLimit}.`
          );
          return;
        }

        balance = balance * (1 + returnRate) + totalYearContribution;
        totalAccountContributions += totalYearContribution;
        totalAccountGrowth = balance - totalAccountContributions;
      }

      const realValue = balance / Math.pow(1 + inputs.inflationRate, years);
      const isQualified = inputs.retirementAge >= 59.5 && years >= 5;
      let withdrawalAmount = inputs.withdrawalType === "lump-sum" ? balance : balance * inputs.withdrawalRate;
      let taxesPenalties = 0;
      if (!isQualified) {
        const taxableEarnings =
          inputs.withdrawalType === "lump-sum"
            ? Math.max(0, balance - totalAccountContributions)
            : Math.max(0, withdrawalAmount - totalAccountContributions / years);
        taxesPenalties = taxableEarnings * (inputs.taxRate + 0.1);
      }
      const netWithdrawal = withdrawalAmount - taxesPenalties;

      newComparisonData.push({ name, futureValue: balance, totalGrowth, realValue, netWithdrawal });
    }

    setComparisonData(newComparisonData);
  };

  const exportBreakdown = () => {
    if (breakdownData.length === 0) {
      alert("No breakdown data to export.");
      return;
    }

    const csvContent = [
      "Year,Age,Account,Balance,Contributions,Growth,Real Value,Withdrawal Eligible",
      ...breakdownData.map(
        (item) =>
          `${item.year},${item.age},${item.account},${item.balance.toFixed(2)},${item.contributions.toFixed(
            2
          )},${item.growth.toFixed(2)},${item.realBalance.toFixed(2)},${item.withdrawalEligible}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roth_ira_breakdown.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const inputFields = [
    { id: "currentAge", label: "Current Age", type: "number", placeholder: "Enter current age", step: "1" },
    {
      id: "retirementAge",
      label: "Retirement Age",
      type: "number",
      placeholder: "Enter retirement age",
      step: "1",
    },
    {
      id: "extraContributionAmount",
      label: "Contribution Amount ($)",
      type: "number",
      placeholder: "Enter contribution amount",
      step: "100",
    },
    {
      id: "extraContributionFrequency",
      label: "Contribution Frequency",
      type: "select",
      options: [
        { value: "0", label: "None" },
        { value: "12", label: "Monthly" },
        { value: "4", label: "Quarterly" },
        { value: "1", label: "Annually" },
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
      id: "taxRate",
      label: "Tax Rate on Non-Qualified Withdrawals (%)",
      type: "number",
      placeholder: "Enter tax rate",
      step: "0.01",
    },
    {
      id: "withdrawalType",
      label: "Withdrawal Type",
      type: "select",
      options: [
        { value: "lump-sum", label: "Lump-Sum at Retirement" },
        { value: "annual", label: "Annual Withdrawals" },
      ],
    },
    {
      id: "withdrawalRate",
      label: "Annual Withdrawal Rate (%)",
      type: "number",
      placeholder: "Enter withdrawal rate (e.g., 4)",
      step: "0.01",
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
            <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">
              Advanced Roth IRA Calculator
            </h1>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Roth IRA Accounts</label>
              {accounts.map((acc, index) => (
                <div key={index} className="flex gap-2 mb-2 flex-col sm:flex-row">
                  <input
                    type="text"
                    placeholder="Account name (e.g., Vanguard)"
                    value={acc.name}
                    onChange={(e) => updateAccount(index, "name", e.target.value)}
                    className="p-3 border rounded-lg bg-gray-50 flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Initial Balance ($)"
                    value={acc.initialBalance}
                    onChange={(e) => updateAccount(index, "initialBalance", e.target.value)}
                    step="1000"
                    className="p-3 border rounded-lg bg-gray-50 flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Annual Contribution ($)"
                    value={acc.annualContribution}
                    onChange={(e) => updateAccount(index, "annualContribution", e.target.value)}
                    step="100"
                    className="p-3 border rounded-lg bg-gray-50 flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Return Rate (%)"
                    value={acc.returnRate}
                    onChange={(e) => updateAccount(index, "returnRate", e.target.value)}
                    step="0.01"
                    className="p-3 border rounded-lg bg-gray-50 flex-1"
                  />
                  <button
                    onClick={() => removeAccount(index)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addAccount}
                className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 w-full mt-2"
              >
                Add Account
              </button>
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Personal Details</label>
              {inputFields.slice(0, 2).map((field) => (
                <div key={field.id} className="mb-4">
                  <label className="block text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={(e) => updateFormData(field.id, e.target.value)}
                    step={field.step}
                    className="w-full p-3 border rounded-lg bg-gray-50"
                  />
                </div>
              ))}
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Additional Contributions</label>
              {inputFields.slice(2, 4).map((field) => (
                <div key={field.id} className="mb-4">
                  <label className="block text-gray-700 mb-1">{field.label}</label>
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
                      className="w-full p-3 border rounded-lg bg-gray-50"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Adjustments</label>
              {inputFields.slice(4, 6).map((field) => (
                <div key={field.id} className="mb-4">
                  <label className="block text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={(e) => updateFormData(field.id, e.target.value)}
                    step={field.step}
                    className="w-full p-3 border rounded-lg bg-gray-50"
                  />
                </div>
              ))}
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Withdrawal Options</label>
              {inputFields.slice(6, 8).map((field) => (
                <div key={field.id} className="mb-4">
                  <label className="block text-gray-700 mb-1">{field.label}</label>
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
                      className="w-full p-3 border rounded-lg bg-gray-50"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Currency</label>
              {inputFields[8].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateFormData("currency", opt.value)}
                  className={`p-3 rounded-lg mr-2 ${
                    formData.currency === opt.value ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={calculateRothIRA}
              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 w-full"
            >
              Calculate Roth IRA
            </button>
            {results && (
              <div className="bg-gray-100 p-5 rounded-lg mt-5">
                {Object.entries(results).map(([key, value]) => (
                  <p key={key} className="text-gray-800 my-2">
                    <strong>
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                    </strong>{" "}
                    {key === "apy"
                      ? `${(value * 100).toFixed(2)}%`
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
            <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">Breakdown & History</h1>
            {breakdownData.length > 0 && (
              <table className="w-full text-sm text-gray-800 bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#3498db] text-white">
                    <th className="p-3 text-right">Year</th>
                    <th className="p-3 text-right">Age</th>
                    <th className="p-3 text-right">Account</th>
                    <th className="p-3 text-right">Balance</th>
                    <th className="p-3 text-right">Contributions</th>
                    <th className="p-3 text-right">Growth</th>
                    <th className="p-3 text-right">Real Value</th>
                    <th className="p-3 text-right">Withdrawal Eligible</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdownData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-[#f8f9fa]" : ""}>
                      <td className="p-3 text-right">{item.year}</td>
                      <td className="p-3 text-right">{item.age}</td>
                      <td className="p-3 text-right">{item.account}</td>
                      <td className="p-3 text-right">{formatCurrency(item.balance, formData.currency)}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.contributions, formData.currency)}
                      </td>
                      <td className="p-3 text-right">{formatCurrency(item.growth, formData.currency)}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.realBalance, formData.currency)}
                      </td>
                      <td className="p-3 text-right">{item.withdrawalEligible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-5">
              {history.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg mb-2 shadow">
                  <p>
                    <strong>Date:</strong> {item.timestamp}
                  </p>
                  {Object.entries(item)
                    .filter(([key]) => key !== "timestamp" && key !== "accounts" && key !== "inputs")
                    .map(([key, value]) => (
                      <p key={key}>
                        <strong>
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                        </strong>{" "}
                        {value}
                      </p>
                    ))}
                  <p>
                    <strong>Accounts:</strong>
                  </p>
                  <ul>
                    {item.accounts.map((acc, i) => (
                      <li key={i}>
                        {acc.name}: Future Value {acc.futureValue}, Contributions {acc.totalContributions},
                        Growth {acc.totalGrowth}, Real Value {acc.realValue}, APY {acc.apy}, Withdrawal{" "}
                        {acc.withdrawalAmount}, Taxes/Penalties {acc.taxesPenalties}, Net Withdrawal{" "}
                        {acc.netWithdrawal}
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Inputs:</strong>
                  </p>
                  <ul>
                    {Object.entries(item.inputs).map(([key, value]) => (
                      <li key={key}>
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}: {value}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {comparisonData.length > 0 && (
              <table className="w-full text-sm text-gray-800 bg-white rounded-lg overflow-hidden mt-5">
                <thead>
                  <tr className="bg-[#3498db] text-white">
                    <th className="p-3 text-right">Account</th>
                    <th className="p-3 text-right">Future Value</th>
                    <th className="p-3 text-right">Total Growth</th>
                    <th className="p-3 text-right">Real Value</th>
                    <th className="p-3 text-right">Net Withdrawal</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-[#f8f9fa]" : ""}>
                      <td className="p-3 text-right">{item.name}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.futureValue, formData.currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.totalGrowth, formData.currency)}
                      </td>
                      <td className="p-3 text-right">{formatCurrency(item.realValue, formData.currency)}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.netWithdrawal, formData.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-5">
              <canvas ref={balanceChartRef} />
            </div>
            <button
              onClick={exportBreakdown}
              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 w-full mt-5"
            >
              Export Breakdown (CSV)
            </button>
            <button
              onClick={compareAccounts}
              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 w-full mt-2"
            >
              Compare Accounts
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
          .sm\\:flex-row {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
