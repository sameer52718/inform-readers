"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [accounts, setAccounts] = useState([{ name: "", type: "ira", balance: "", returnRate: "" }]);
  const [currentAge, setCurrentAge] = useState("");
  const [beneficiaryType, setBeneficiaryType] = useState("none");
  const [spouseAge, setSpouseAge] = useState("");
  const [beneficiaryAge, setBeneficiaryAge] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");
  const [contributionFrequency, setContributionFrequency] = useState("0");
  const [inflationRate, setInflationRate] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [projectionYears, setProjectionYears] = useState("30");
  const [currency, setCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [breakdownData, setBreakdownData] = useState([]);
  const [history, setHistory] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[curr]} ${parseFloat(amount || 0).toFixed(2)}`;
  };

  const getLifeExpectancy = (age, type, spouseAge, beneficiaryAge) => {
    if (type === "non-spouse" || (type === "none" && beneficiaryAge)) {
      return Math.max(1, 83.7 - beneficiaryAge);
    } else if (type === "spouse" && spouseAge) {
      let uniform = 97.1 - age + 0.1 * Math.pow(age - 70, 2);
      let adjustment = 0.5 * (age - spouseAge);
      return Math.min(uniform + 10, Math.max(uniform, uniform + adjustment));
    } else {
      return Math.max(1, 97.1 - age + 0.1 * Math.pow(age - 70, 2));
    }
  };

  const addAccount = () => {
    setAccounts([...accounts, { name: "", type: "ira", balance: "", returnRate: "" }]);
  };

  const removeAccount = (index) => {
    setAccounts(accounts.filter((_, i) => i !== index));
  };

  const updateAccount = (index, field, value) => {
    const newAccounts = [...accounts];
    newAccounts[index][field] = value;
    setAccounts(newAccounts);
  };

  const toggleBeneficiaryInputs = () => {
    return {
      spouseAgeVisible: beneficiaryType === "spouse",
      beneficiaryAgeVisible: beneficiaryType === "non-spouse",
    };
  };

  const calculateRMD = () => {
    const currentAgeVal = parseInt(currentAge) || 0;
    const spouseAgeVal = parseInt(spouseAge) || 0;
    const beneficiaryAgeVal = parseInt(beneficiaryAge) || 0;
    const contributionAmountVal = parseFloat(contributionAmount) || 0;
    const contributionFrequencyVal = parseInt(contributionFrequency) || 0;
    const inflationRateVal = parseFloat(inflationRate) / 100 || 0;
    const taxRateVal = parseFloat(taxRate) / 100 || 0;
    const projectionYearsVal = parseInt(projectionYears) || 30;

    if (accounts.length === 0) {
      alert("Please add at least one retirement account.");
      return;
    }
    if (currentAgeVal < 1) {
      alert("Please enter a valid current age.");
      return;
    }
    if (beneficiaryType === "spouse" && spouseAgeVal < 1) {
      alert("Please enter a valid spouse age.");
      return;
    }
    if (beneficiaryType === "non-spouse" && beneficiaryAgeVal < 1) {
      alert("Please enter a valid beneficiary age for inherited accounts.");
      return;
    }
    if (projectionYearsVal < 1) {
      alert("Please enter a valid number of projection years.");
      return;
    }

    let calculatedAccounts = [];
    let totalInitialBalance = 0;
    let totalContributions = 0;
    let totalGrowth = 0;
    let totalRmds = 0;
    let totalTaxes = 0;
    let newBreakdownData = [];

    accounts.forEach((acc) => {
      const name = acc.name || "Unnamed Account";
      const accountType = acc.type;
      const balance = parseFloat(acc.balance) || 0;
      const returnRate = parseFloat(acc.returnRate) / 100 || 0;

      if (balance <= 0 || returnRate < 0) return;

      let currentBalance = balance;
      let accountContributions = 0;
      let accountGrowth = 0;
      let accountRmds = 0;
      let accountTaxes = 0;
      let balances = [];
      let rmds = [];
      let realBalances = [];

      const isInherited = accountType === "inherited";
      const rmdStartAge = isInherited ? currentAgeVal : 73;
      const canContribute = accountType === "401k" && currentAgeVal < 73;

      for (let year = 1; year <= projectionYearsVal; year++) {
        const age = currentAgeVal + year - 1;
        let rmd = 0;
        let contribution =
          canContribute && contributionFrequencyVal > 0
            ? contributionAmountVal * contributionFrequencyVal
            : 0;

        if (age >= rmdStartAge) {
          const lifeExpectancy = getLifeExpectancy(
            age,
            beneficiaryType,
            spouseAgeVal,
            isInherited ? beneficiaryAgeVal : 0
          );
          rmd = currentBalance / lifeExpectancy;
        }

        const growth = currentBalance * returnRate;
        currentBalance = currentBalance + growth + contribution - rmd;

        if (currentBalance < 0) {
          rmd += currentBalance;
          currentBalance = 0;
        }

        const taxes = rmd * taxRateVal;
        const realBalance = currentBalance / Math.pow(1 + inflationRateVal, year);

        accountContributions += contribution;
        accountGrowth += growth;
        accountRmds += rmd;
        accountTaxes += taxes;

        balances.push(currentBalance);
        rmds.push(rmd);
        realBalances.push(realBalance);

        newBreakdownData.push({
          year,
          age,
          account: name,
          balance: currentBalance,
          rmd,
          contributions: contribution,
          growth,
          taxes,
          realBalance,
          lifeExpectancy:
            age >= rmdStartAge
              ? getLifeExpectancy(
                  age,
                  beneficiaryType,
                  spouseAgeVal,
                  isInherited ? beneficiaryAgeVal : 0
                ).toFixed(1)
              : "N/A",
        });

        if (currentBalance <= 0) break;
      }

      const apy = Math.pow(1 + returnRate / 12, 12) - 1;

      calculatedAccounts.push({
        name,
        totalRmds: accountRmds,
        afterTaxRmds: accountRmds * (1 - taxRateVal),
        totalContributions: accountContributions,
        totalGrowth: accountGrowth,
        remainingBalance: currentBalance,
        realBalance: currentBalance / Math.pow(1 + inflationRateVal, projectionYearsVal),
        apy,
        balances,
        rmds,
        realBalances,
      });

      totalInitialBalance += balance;
      totalContributions += accountContributions;
      totalGrowth += accountGrowth;
      totalRmds += accountRmds;
      totalTaxes += accountTaxes;
    });

    if (calculatedAccounts.length === 0) {
      alert(
        "Please provide valid inputs for at least one account (positive balance, non-negative return rate)."
      );
      return;
    }

    setResult({
      totalRmds,
      afterTaxRmds: totalRmds * (1 - taxRateVal),
      totalContributions,
      totalGrowth,
      remainingBalance: calculatedAccounts.reduce((sum, acc) => sum + acc.remainingBalance, 0),
      realBalance: calculatedAccounts.reduce((sum, acc) => sum + acc.realBalance, 0),
      apy: calculatedAccounts[0].apy * 100,
    });

    setBreakdownData(newBreakdownData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      totalRmds: formatCurrency(totalRmds),
      afterTaxRmds: formatCurrency(totalRmds * (1 - taxRateVal)),
      totalContributions: formatCurrency(totalContributions),
      totalGrowth: formatCurrency(totalGrowth),
      remainingBalance: formatCurrency(
        calculatedAccounts.reduce((sum, acc) => sum + acc.remainingBalance, 0)
      ),
      realBalance: formatCurrency(calculatedAccounts.reduce((sum, acc) => sum + acc.realBalance, 0)),
      apy: `${(calculatedAccounts[0].apy * 100).toFixed(2)}%`,
      accounts: calculatedAccounts.map((acc) => ({
        name: acc.name,
        totalRmds: formatCurrency(acc.totalRmds),
        afterTaxRmds: formatCurrency(acc.afterTaxRmds),
        totalContributions: formatCurrency(acc.totalContributions),
        totalGrowth: formatCurrency(acc.totalGrowth),
        remainingBalance: formatCurrency(acc.remainingBalance),
        realBalance: formatCurrency(acc.realBalance),
        apy: `${(acc.apy * 100).toFixed(2)}%`,
      })),
      inputs: {
        currentAge: currentAgeVal,
        beneficiaryType:
          beneficiaryType === "none" ? "None" : beneficiaryType === "spouse" ? "Spouse" : "Non-Spouse",
        spouseAge: beneficiaryType === "spouse" ? spouseAgeVal : "N/A",
        beneficiaryAge: beneficiaryType === "non-spouse" ? beneficiaryAgeVal : "N/A",
        contributionAmount: formatCurrency(contributionAmountVal),
        contributionFrequency:
          contributionFrequencyVal === 0
            ? "None"
            : contributionFrequencyVal === 12
            ? "Monthly"
            : contributionFrequencyVal === 4
            ? "Quarterly"
            : "Annually",
        inflationRate: `${(inflationRateVal * 100).toFixed(2)}%`,
        taxRate: `${(taxRateVal * 100).toFixed(2)}%`,
        projectionYears: projectionYearsVal,
        currency,
      },
    };
    setHistory([...history, calculation]);

    alert("Chart rendering not implemented in this demo.");
  };

  const compareAccounts = () => {
    const currentAgeVal = parseInt(currentAge) || 0;
    const spouseAgeVal = parseInt(spouseAge) || 0;
    const beneficiaryAgeVal = parseInt(beneficiaryAge) || 0;
    const contributionAmountVal = parseFloat(contributionAmount) || 0;
    const contributionFrequencyVal = parseInt(contributionFrequency) || 0;
    const inflationRateVal = parseFloat(inflationRate) / 100 || 0;
    const taxRateVal = parseFloat(taxRate) / 100 || 0;
    const projectionYearsVal = parseInt(projectionYears) || 30;

    if (accounts.length === 0) {
      alert("Please add at least one retirement account.");
      return;
    }
    if (currentAgeVal < 1) {
      alert("Please enter a valid current age.");
      return;
    }
    if (beneficiaryType === "spouse" && spouseAgeVal < 1) {
      alert("Please enter a valid spouse age.");
      return;
    }
    if (beneficiaryType === "non-spouse" && beneficiaryAgeVal < 1) {
      alert("Please enter a valid beneficiary age for inherited accounts.");
      return;
    }

    const newComparisonData = [];
    accounts.forEach((acc) => {
      const name = acc.name || "Unnamed Account";
      const accountType = acc.type;
      const balance = parseFloat(acc.balance) || 0;
      const returnRate = parseFloat(acc.returnRate) / 100 || 0;

      if (balance <= 0 || returnRate < 0) return;

      let currentBalance = balance;
      let accountRmds = 0;
      let accountContributions = 0;
      let accountGrowth = 0;

      const isInherited = accountType === "inherited";
      const rmdStartAge = isInherited ? currentAgeVal : 73;
      const canContribute = accountType === "401k" && currentAgeVal < 73;

      for (let year = 1; year <= projectionYearsVal; year++) {
        const age = currentAgeVal + year - 1;
        let rmd = 0;
        let contribution =
          canContribute && contributionFrequencyVal > 0
            ? contributionAmountVal * contributionFrequencyVal
            : 0;

        if (age >= rmdStartAge) {
          const lifeExpectancy = getLifeExpectancy(
            age,
            beneficiaryType,
            spouseAgeVal,
            isInherited ? beneficiaryAgeVal : 0
          );
          rmd = currentBalance / lifeExpectancy;
        }

        const growth = currentBalance * returnRate;
        currentBalance = currentBalance + growth + contribution - rmd;

        if (currentBalance < 0) {
          rmd += currentBalance;
          currentBalance = 0;
        }

        accountRmds += rmd;
        accountContributions += contribution;
        accountGrowth += growth;

        if (currentBalance <= 0) break;
      }

      const realBalance = currentBalance / Math.pow(1 + inflationRateVal, projectionYearsVal);

      newComparisonData.push({
        name,
        totalRmds: accountRmds,
        afterTaxRmds: accountRmds * (1 - taxRateVal),
        remainingBalance: currentBalance,
        realBalance,
      });
    });

    if (newComparisonData.length === 0) {
      alert(
        "Please provide valid inputs for at least one account (positive balance, non-negative return rate)."
      );
      return;
    }

    setComparisonData(newComparisonData);
  };

  const exportBreakdown = () => {
    if (breakdownData.length === 0) {
      alert("No breakdown data to export.");
      return;
    }

    const csvContent = [
      "Year,Age,Account,Balance,RMD,Contributions,Growth,Taxes,Real Balance,Life Expectancy",
      ...breakdownData.map(
        (item) =>
          `${item.year},${item.age},${item.account},${item.balance.toFixed(2)},${item.rmd.toFixed(
            2
          )},${item.contributions.toFixed(2)},${item.growth.toFixed(2)},${item.taxes.toFixed(
            2
          )},${item.realBalance.toFixed(2)},${item.lifeExpectancy}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rmd_breakdown.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSort = (table, index) => {
    const isBreakdown = table === "breakdown";
    const data = isBreakdown ? [...breakdownData] : [...comparisonData];
    const isAscending = !data[0]?.sortOrder || data[0].sortOrder === "desc";
    data.sort((a, b) => {
      let aValue = isBreakdown
        ? [
            a.year,
            a.age,
            a.account,
            a.balance,
            a.rmd,
            a.contributions,
            a.growth,
            a.taxes,
            a.realBalance,
            a.lifeExpectancy,
          ][index]
        : [a.name, a.totalRmds, a.afterTaxRmds, a.remainingBalance, a.realBalance][index];
      let bValue = isBreakdown
        ? [
            b.year,
            b.age,
            b.account,
            b.balance,
            b.rmd,
            b.contributions,
            b.growth,
            b.taxes,
            b.realBalance,
            b.lifeExpectancy,
          ][index]
        : [b.name, b.totalRmds, b.afterTaxRmds, b.remainingBalance, b.realBalance][index];
      if (typeof aValue === "number") {
        return isAscending ? aValue - bValue : bValue - aValue;
      }
      return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    data.forEach((item) => (item.sortOrder = isAscending ? "asc" : "desc"));
    if (isBreakdown) setBreakdownData(data);
    else setComparisonData(data);
  };

  useEffect(() => {
    toggleBeneficiaryInputs();
  }, [beneficiaryType]);

  const { spouseAgeVisible, beneficiaryAgeVisible } = toggleBeneficiaryInputs();

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-start">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-7xl w-full flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Advanced RMD Calculator</h1>
          <div className="space-y-4">
            <div className="input-group">
              <label className="block text-sm font-bold text-gray-600 mb-2">Retirement Accounts</label>
              <div id="accounts-list">
                {accounts.map((acc, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Account name (e.g., Fidelity IRA)"
                      value={acc.name}
                      onChange={(e) => updateAccount(index, "name", e.target.value)}
                      className="p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                    <select
                      value={acc.type}
                      onChange={(e) => updateAccount(index, "type", e.target.value)}
                      className="p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="ira">Traditional IRA</option>
                      <option value="401k">401(k)</option>
                      <option value="inherited">Inherited IRA/401(k)</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Balance ($)"
                      value={acc.balance}
                      onChange={(e) => updateAccount(index, "balance", e.target.value)}
                      step="1000"
                      className="p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                    <input
                      type="number"
                      placeholder="Return Rate (%)"
                      value={acc.returnRate}
                      onChange={(e) => updateAccount(index, "returnRate", e.target.value)}
                      step="0.01"
                      className="p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                    <button
                      onClick={() => removeAccount(index)}
                      className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addAccount}
                className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Add Account
              </button>
            </div>
            <div className="input-group">
              <label className="block text-sm font-bold text-gray-600 mb-2">Personal Details</label>
              {[
                {
                  label: "Current Age",
                  id: "current-age",
                  value: currentAge,
                  setter: setCurrentAge,
                  type: "number",
                  step: "1",
                },
                {
                  label: "Beneficiary Type",
                  id: "beneficiary-type",
                  value: beneficiaryType,
                  setter: setBeneficiaryType,
                  type: "select",
                  options: [
                    { value: "none", label: "None (Uniform Lifetime)" },
                    { value: "spouse", label: "Spouse" },
                    { value: "non-spouse", label: "Non-Spouse" },
                  ],
                },
                ...(spouseAgeVisible
                  ? [
                      {
                        label: "Spouse's Age",
                        id: "spouse-age",
                        value: spouseAge,
                        setter: setSpouseAge,
                        type: "number",
                        step: "1",
                      },
                    ]
                  : []),
                ...(beneficiaryAgeVisible
                  ? [
                      {
                        label: "Beneficiary's Age (for Inherited Accounts)",
                        id: "beneficiary-age",
                        value: beneficiaryAge,
                        setter: setBeneficiaryAge,
                        type: "number",
                        step: "1",
                      },
                    ]
                  : []),
              ].map((field) => (
                <div key={field.id} className="mb-4">
                  <label htmlFor={field.id} className="block text-sm font-bold text-gray-600 mb-2">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.id}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      step={field.step}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="input-group">
              <label className="block text-sm font-bold text-gray-600 mb-2">
                Additional Contributions (401(k) if working)
              </label>
              {[
                {
                  label: "Contribution Amount ($)",
                  id: "contribution-amount",
                  value: contributionAmount,
                  setter: setContributionAmount,
                  type: "number",
                  step: "100",
                },
                {
                  label: "Contribution Frequency",
                  id: "contribution-frequency",
                  value: contributionFrequency,
                  setter: setContributionFrequency,
                  type: "select",
                  options: [
                    { value: "0", label: "None" },
                    { value: "12", label: "Monthly" },
                    { value: "4", label: "Quarterly" },
                    { value: "1", label: "Annually" },
                  ],
                },
              ].map((field) => (
                <div key={field.id} className="mb-4">
                  <label htmlFor={field.id} className="block text-sm font-bold text-gray-600 mb-2">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.id}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      step={field.step}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="input-group">
              <label className="block text-sm font-bold text-gray-600 mb-2">Adjustments</label>
              {[
                {
                  label: "Inflation Rate (%)",
                  id: "inflation-rate",
                  value: inflationRate,
                  setter: setInflationRate,
                  type: "number",
                  step: "0.01",
                },
                {
                  label: "Tax Rate on RMDs (%)",
                  id: "tax-rate",
                  value: taxRate,
                  setter: setTaxRate,
                  type: "number",
                  step: "0.01",
                },
              ].map((field) => (
                <div key={field.id} className="mb-4">
                  <label htmlFor={field.id} className="block text-sm font-bold text-gray-600 mb-2">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    step={field.step}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              ))}
            </div>
            <div className="input-group">
              <label htmlFor="projection-years" className="block text-sm font-bold text-gray-600 mb-2">
                Projection Years
              </label>
              <input
                id="projection-years"
                type="number"
                value={projectionYears}
                onChange={(e) => setProjectionYears(e.target.value)}
                step="1"
                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="input-group">
              <label htmlFor="currency" className="block text-sm font-bold text-gray-600 mb-2">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
              >
                <option value="USD">$ USD</option>
                <option value="CAD">$ CAD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>
            <button
              onClick={calculateRMD}
              className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Calculate RMD
            </button>
            {result && (
              <div className="bg-gray-200 p-4 rounded-lg mt-4">
                <p>
                  <strong>Total RMDs:</strong> {formatCurrency(result.totalRmds)}
                </p>
                <p>
                  <strong>After-Tax RMDs:</strong> {formatCurrency(result.afterTaxRmds)}
                </p>
                <p>
                  <strong>Total Contributions:</strong> {formatCurrency(result.totalContributions)}
                </p>
                <p>
                  <strong>Total Growth:</strong> {formatCurrency(result.totalGrowth)}
                </p>
                <p>
                  <strong>Remaining Balance:</strong> {formatCurrency(result.remainingBalance)}
                </p>
                <p>
                  <strong>Real Balance (Inflation-Adjusted):</strong> {formatCurrency(result.realBalance)}
                </p>
                <p>
                  <strong>APY:</strong> {result.apy.toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto p-4 bg-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Breakdown & History</h1>
          {breakdownData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg mb-4">
              <thead>
                <tr>
                  {[
                    "Year",
                    "Age",
                    "Account",
                    "Balance",
                    "RMD",
                    "Contributions",
                    "Growth",
                    "Taxes",
                    "Real Balance",
                    "Life Expectancy",
                  ].map((header, i) => (
                    <th
                      key={i}
                      className="p-2 bg-red-500 text-white cursor-pointer"
                      onClick={() => handleSort("breakdown", i)}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {breakdownData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-2">{item.year}</td>
                    <td className="p-2">{item.age}</td>
                    <td className="p-2">{item.account}</td>
                    <td className="p-2">{formatCurrency(item.balance)}</td>
                    <td className="p-2">{formatCurrency(item.rmd)}</td>
                    <td className="p-2">{formatCurrency(item.contributions)}</td>
                    <td className="p-2">{formatCurrency(item.growth)}</td>
                    <td className="p-2">{formatCurrency(item.taxes)}</td>
                    <td className="p-2">{formatCurrency(item.realBalance)}</td>
                    <td className="p-2">{item.lifeExpectancy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {history.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-lg mb-4 shadow">
              <p>
                <strong>Date:</strong> {item.timestamp}
              </p>
              <p>
                <strong>Total RMDs:</strong> {item.totalRmds}
              </p>
              <p>
                <strong>After-Tax RMDs:</strong> {item.afterTaxRmds}
              </p>
              <p>
                <strong>Total Contributions:</strong> {item.totalContributions}
              </p>
              <p>
                <strong>Total Growth:</strong> {item.totalGrowth}
              </p>
              <p>
                <strong>Remaining Balance:</strong> {item.remainingBalance}
              </p>
              <p>
                <strong>Real Balance:</strong> {item.realBalance}
              </p>
              <p>
                <strong>APY:</strong> {item.apy}
              </p>
              <p>
                <strong>Accounts:</strong>
              </p>
              <ul className="list-disc pl-5">
                {item.accounts.map((acc, j) => (
                  <li key={j}>
                    {acc.name}: Total RMDs {acc.totalRmds}, After-Tax RMDs {acc.afterTaxRmds}, Contributions{" "}
                    {acc.totalContributions}, Growth {acc.totalGrowth}, Remaining Balance{" "}
                    {acc.remainingBalance}, Real Balance {acc.realBalance}, APY {acc.apy}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Inputs:</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>Current Age: {item.inputs.currentAge}</li>
                <li>Beneficiary Type: {item.inputs.beneficiaryType}</li>
                <li>Spouse Age: {item.inputs.spouseAge}</li>
                <li>Beneficiary Age: {item.inputs.beneficiaryAge}</li>
                <li>Contribution Amount: {item.inputs.contributionAmount}</li>
                <li>Contribution Frequency: {item.inputs.contributionFrequency}</li>
                <li>Inflation Rate: {item.inputs.inflationRate}</li>
                <li>Tax Rate: {item.inputs.taxRate}</li>
                <li>Projection Years: {item.inputs.projectionYears}</li>
                <li>Currency: {item.inputs.currency}</li>
              </ul>
            </div>
          ))}
          {comparisonData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg mb-4">
              <thead>
                <tr>
                  {["Account", "Total RMDs", "After-Tax RMDs", "Remaining Balance", "Real Balance"].map(
                    (header, i) => (
                      <th
                        key={i}
                        className="p-2 bg-red-500 text-white cursor-pointer"
                        onClick={() => handleSort("comparison", i)}
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{formatCurrency(item.totalRmds)}</td>
                    <td className="p-2">{formatCurrency(item.afterTaxRmds)}</td>
                    <td className="p-2">{formatCurrency(item.remainingBalance)}</td>
                    <td className="p-2">{formatCurrency(item.realBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            onClick={exportBreakdown}
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 mb-2"
          >
            Export Breakdown (CSV)
          </button>
          <button
            onClick={compareAccounts}
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Compare Accounts
          </button>
        </div>
      </div>
      <style jsx>{`
        input:focus,
        select:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
        }
        @media (max-width: 768px) {
          .max-h-[700px] {
            max-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}
