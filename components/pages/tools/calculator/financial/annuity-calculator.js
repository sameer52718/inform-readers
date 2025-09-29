"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [annuityType, setAnnuityType] = useState("immediate-fixed");
  const [initialInvestment, setInitialInvestment] = useState("");
  const [periodicContribution, setPeriodicContribution] = useState("");
  const [contributionFrequency, setContributionFrequency] = useState("annually");
  const [accumulationPeriod, setAccumulationPeriod] = useState("");
  const [growthRate, setGrowthRate] = useState("");
  const [compounding, setCompounding] = useState("annually");
  const [payoutPeriod, setPayoutPeriod] = useState("");
  const [payoutFrequency, setPayoutFrequency] = useState("annually");
  const [annuityRate, setAnnuityRate] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [history, setHistory] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const balanceChartRef = useRef(null);
  const breakdownChartRef = useRef(null);
  const balanceChartInstance = useRef(null);
  const breakdownChartInstance = useRef(null);

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  useEffect(() => {
    const loadChartJs = async () => {
      const Chart = (await import("chart.js")).default;
      Chart.register(...(await import("chart.js")).registerables);

      if (balanceChartRef.current) {
        balanceChartInstance.current = new Chart(balanceChartRef.current, {
          type: "line",
          data: {
            labels: [],
            datasets: [
              {
                label: "Nominal Balance",
                data: [],
                borderColor: "#ef4444",
                fill: false,
                tension: 0.1,
              },
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
            plugins: {
              title: { display: true, text: "Annuity Balance Over Time" },
            },
          },
        });
      }

      if (breakdownChartRef.current) {
        breakdownChartInstance.current = new Chart(breakdownChartRef.current, {
          type: "pie",
          data: {
            labels: ["Initial Investment", "Contributions", "Growth", "Payouts"],
            datasets: [
              {
                data: [0, 0, 0, 0],
                backgroundColor: ["#ef4444", "#2ecc71", "#f1c40f", "#e74c3c"],
                borderColor: "#fff",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Annuity Cash Flow Breakdown" },
            },
          },
        });
      }
    };
    loadChartJs();
    return () => {
      if (balanceChartInstance.current) balanceChartInstance.current.destroy();
      if (breakdownChartInstance.current) breakdownChartInstance.current.destroy();
    };
  }, []);

  const updateBalanceChart = (years, nominalBalances, realBalances) => {
    if (balanceChartInstance.current) {
      balanceChartInstance.current.data.labels = years;
      balanceChartInstance.current.data.datasets[0].data = nominalBalances;
      balanceChartInstance.current.data.datasets[1].data = realBalances;
      balanceChartInstance.current.update();
    }
  };

  const updateBreakdownChart = (initial, contributions, growth, payouts) => {
    if (breakdownChartInstance.current) {
      breakdownChartInstance.current.data.datasets[0].data = [initial, contributions, growth, payouts];
      breakdownChartInstance.current.update();
    }
  };

  const calculateAnnuity = () => {
    const parsedInitial = parseFloat(initialInvestment) || 0;
    const parsedContribution = parseFloat(periodicContribution) || 0;
    const parsedAccumulation = parseInt(accumulationPeriod) || 0;
    const parsedGrowth = parseFloat(growthRate) / 100 || 0;
    const parsedPayout = parseInt(payoutPeriod) || 0;
    const parsedAnnuityRate = parseFloat(annuityRate) / 100 || 0.04;
    const parsedInflation = parseFloat(inflationRate) / 100 || 0;
    const isDeferred = annuityType.includes("deferred");

    if (isDeferred && (isNaN(parsedAccumulation) || parsedAccumulation <= 0)) {
      alert("Please enter a valid accumulation period");
      return;
    }
    if ((isDeferred || annuityType.includes("variable")) && (isNaN(parsedGrowth) || parsedGrowth < 0)) {
      alert("Please enter a valid growth rate");
      return;
    }
    if (isNaN(parsedPayout) || parsedPayout <= 0) {
      alert("Please enter a valid payout period");
      return;
    }
    if (!isDeferred && (isNaN(parsedInitial) || parsedInitial <= 0)) {
      alert("Please enter a valid initial investment");
      return;
    }

    const compoundingPeriods = {
      annually: 1,
      "semi-annually": 2,
      quarterly: 4,
      monthly: 12,
    };
    const contributionPeriods = {
      annually: 1,
      "semi-annually": 2,
      quarterly: 4,
      monthly: 12,
    };
    const payoutPeriods = {
      annually: 1,
      "semi-annually": 2,
      quarterly: 4,
      monthly: 12,
    };
    const n = compoundingPeriods[compounding];
    const m = contributionPeriods[contributionFrequency];
    const p = payoutPeriods[payoutFrequency];
    const ratePerPeriod = parsedGrowth / n;

    let balance = isDeferred ? 0 : parsedInitial;
    let totalContributions = isDeferred ? parsedContribution * m * parsedAccumulation : 0;
    let totalGrowth = 0;
    let totalPayouts = 0;
    const newCashFlowData = [];
    const nominalBalances = [balance];
    const realBalances = [balance / Math.pow(1 + parsedInflation, 0)];
    let years = [0];

    if (isDeferred) {
      for (let year = 1; year <= parsedAccumulation; year++) {
        let yearBalance = balance;
        let yearGrowth = 0;
        let yearContribution = annuityType.includes("variable") ? parsedContribution * m : 0;

        for (let period = 1; period <= n; period++) {
          let periodContribution =
            period % (n / m) === 0 && annuityType.includes("variable") ? parsedContribution : 0;
          let growth = yearBalance * ratePerPeriod;
          yearGrowth += growth;
          yearBalance = yearBalance * (1 + ratePerPeriod) + periodContribution;
        }

        balance = yearBalance;
        totalGrowth += yearGrowth;
        newCashFlowData.push({
          year,
          contribution: yearContribution,
          growth: yearGrowth,
          payout: 0,
          balance,
        });
        nominalBalances.push(balance);
        realBalances.push(balance / Math.pow(1 + parsedInflation, year));
        years.push(year);
      }
    }

    let annuityBalance = balance;
    const periodsPerYear = p;
    const payoutPerPeriod = annuityType.includes("fixed")
      ? annuityBalance / (parsedPayout * periodsPerYear)
      : (annuityBalance * parsedAnnuityRate) / periodsPerYear;
    const payoutGrowthRate = annuityType.includes("variable") ? parsedGrowth / n : 0;

    for (
      let year = isDeferred ? parsedAccumulation + 1 : 1;
      year <= (isDeferred ? parsedAccumulation + parsedPayout : parsedPayout);
      year++
    ) {
      let yearBalance = balance;
      let yearGrowth = 0;
      let yearPayout = payoutPerPeriod * periodsPerYear;

      for (let period = 1; period <= periodsPerYear; period++) {
        let growth = yearBalance * payoutGrowthRate;
        yearGrowth += growth;
        yearBalance = yearBalance * (1 + payoutGrowthRate) - payoutPerPeriod;
      }

      balance = Math.max(yearBalance, 0);
      totalGrowth += yearGrowth;
      totalPayouts += yearPayout;
      newCashFlowData.push({
        year,
        contribution: 0,
        growth: yearGrowth,
        payout: yearPayout,
        balance,
      });
      nominalBalances.push(balance);
      realBalances.push(balance / Math.pow(1 + parsedInflation, year));
      years.push(year);
    }

    const realBalance = annuityBalance / Math.pow(1 + parsedInflation, isDeferred ? parsedAccumulation : 0);
    const annualPayout = payoutPerPeriod * periodsPerYear;
    const monthlyPayout = annualPayout / 12;

    setResult({
      initialInvestment: parsedInitial,
      totalContributions,
      totalGrowth,
      annuityBalance,
      realBalance,
      annualPayout,
      monthlyPayout,
      totalPayouts,
    });

    setCashFlowData(newCashFlowData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      annuityType,
      initialInvestment: formatCurrency(parsedInitial, currency),
      totalContributions: formatCurrency(totalContributions, currency),
      totalGrowth: formatCurrency(totalGrowth, currency),
      annuityBalance: formatCurrency(annuityBalance, currency),
      realBalance: formatCurrency(realBalance, currency),
      annualPayout: formatCurrency(annualPayout, currency),
      monthlyPayout: formatCurrency(monthlyPayout, currency),
      totalPayouts: formatCurrency(totalPayouts, currency),
      inputs: {
        accumulationPeriod: isDeferred ? `${parsedAccumulation} years` : "N/A",
        growthRate: `${(parsedGrowth * 100).toFixed(2)}%`,
        compounding,
        contributionFrequency,
        payoutPeriod: `${parsedPayout} years`,
        payoutFrequency,
        annuityRate: `${(parsedAnnuityRate * 100).toFixed(2)}%`,
        inflationRate: `${(parsedInflation * 100).toFixed(2)}%`,
      },
    };
    setHistory([...history, calculation]);

    updateBalanceChart(years, nominalBalances, realBalances);
    updateBreakdownChart(parsedInitial, totalContributions, totalGrowth, totalPayouts);
  };

  const compareScenarios = () => {
    const parsedInitial = parseFloat(initialInvestment) || 0;
    const parsedContribution = parseFloat(periodicContribution) || 0;
    const parsedAccumulation = parseInt(accumulationPeriod) || 0;
    const parsedGrowth = parseFloat(growthRate) / 100 || 0;
    const parsedPayout = parseInt(payoutPeriod) || 0;
    const parsedAnnuityRate = parseFloat(annuityRate) / 100 || 0.04;
    const parsedInflation = parseFloat(inflationRate) / 100 || 0;
    const isDeferred = annuityType.includes("deferred");

    if (isDeferred && isNaN(parsedAccumulation)) {
      alert("Please calculate annuity first");
      return;
    }
    if (isNaN(parsedPayout)) {
      alert("Please calculate annuity first");
      return;
    }

    const compoundingPeriods = {
      annually: 1,
      "semi-annually": 2,
      quarterly: 4,
      monthly: 12,
    };
    const contributionPeriods = {
      annually: 1,
      "semi-annually": 2,
      quarterly: 4,
      monthly: 12,
    };
    const payoutPeriods = {
      annually: 1,
      "semi-annually": 2,
      quarterly: 4,
      monthly: 12,
    };
    const n = compoundingPeriods[compounding];
    const m = contributionPeriods[contributionFrequency];
    const p = payoutPeriods[payoutFrequency];

    const scenarios = [
      {
        label: "Base Case",
        growthRate: parsedGrowth,
        annuityRate: parsedAnnuityRate,
        periodicContribution: parsedContribution,
      },
      {
        label: "Higher Growth (+1%)",
        growthRate: parsedGrowth + 0.01,
        annuityRate: parsedAnnuityRate,
        periodicContribution: parsedContribution,
      },
      {
        label: "Higher Annuity Rate (+0.5%)",
        growthRate: parsedGrowth,
        annuityRate: parsedAnnuityRate + 0.005,
        periodicContribution: parsedContribution,
      },
      {
        label: "Higher Contribution (+50%)",
        growthRate: parsedGrowth,
        annuityRate: parsedAnnuityRate,
        periodicContribution: parsedContribution * 1.5,
      },
    ];

    const newComparisonData = scenarios.map((scenario) => {
      let balance = isDeferred ? 0 : parsedInitial;
      let totalContributions = isDeferred ? scenario.periodicContribution * m * parsedAccumulation : 0;
      let totalGrowth = 0;
      const ratePerPeriod = scenario.growthRate / n;

      if (isDeferred) {
        for (let year = 1; year <= parsedAccumulation; year++) {
          let yearBalance = balance;
          let yearGrowth = 0;
          for (let period = 1; period <= n; period++) {
            let periodContribution =
              period % (n / m) === 0 && annuityType.includes("variable") ? scenario.periodicContribution : 0;
            let growth = yearBalance * ratePerPeriod;
            yearGrowth += growth;
            yearBalance = yearBalance * (1 + ratePerPeriod) + periodContribution;
          }
          balance = yearBalance;
          totalGrowth += yearGrowth;
        }
      }

      const annuityBalance = balance;
      const realBalance = annuityBalance / Math.pow(1 + parsedInflation, isDeferred ? parsedAccumulation : 0);
      const periodsPerYear = p;
      const payoutPerPeriod = annuityType.includes("fixed")
        ? annuityBalance / (parsedPayout * periodsPerYear)
        : (annuityBalance * scenario.annuityRate) / periodsPerYear;
      const annualPayout = payoutPerPeriod * periodsPerYear;

      return { label: scenario.label, annuityBalance, realBalance, annualPayout };
    });

    setComparisonData(newComparisonData);
  };

  const exportCashFlow = () => {
    if (cashFlowData.length === 0) {
      alert("No cash flow data to export");
      return;
    }

    const csvContent = [
      "Year,Contribution,Growth,Payout,Balance",
      ...cashFlowData.map(
        (item) =>
          `${item.year},${item.contribution.toFixed(2)},${item.growth.toFixed(2)},${item.payout.toFixed(
            2
          )},${item.balance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annuity_cashflow.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-6xl w-full flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Advanced Annuity Calculator</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">Annuity Type</label>
            <select
              value={annuityType}
              onChange={(e) => setAnnuityType(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="immediate-fixed">Immediate Fixed</option>
              <option value="deferred-fixed">Deferred Fixed</option>
              <option value="immediate-variable">Immediate Variable</option>
              <option value="deferred-variable">Deferred Variable</option>
            </select>
          </div>
          {annuityType.includes("deferred") && (
            <div id="accumulation-inputs">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Initial Investment ($)</label>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="Enter initial investment"
                  step="100"
                  className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Periodic Contribution ($)
                </label>
                <input
                  type="number"
                  value={periodicContribution}
                  onChange={(e) => setPeriodicContribution(e.target.value)}
                  placeholder="Enter contribution"
                  step="100"
                  className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Contribution Frequency</label>
                <select
                  value={contributionFrequency}
                  onChange={(e) => setContributionFrequency(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                >
                  <option value="annually">Annually</option>
                  <option value="semi-annually">Semi-Annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Accumulation Period (Years)
                </label>
                <input
                  type="number"
                  value={accumulationPeriod}
                  onChange={(e) => setAccumulationPeriod(e.target.value)}
                  placeholder="Enter accumulation period"
                  step="1"
                  className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Expected Growth Rate (%)
                </label>
                <input
                  type="number"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(e.target.value)}
                  placeholder="Enter growth rate"
                  step="0.01"
                  className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Compounding Frequency</label>
                <select
                  value={compounding}
                  onChange={(e) => setCompounding(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                >
                  <option value="annually">Annually</option>
                  <option value="semi-annually">Semi-Annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          )}
          {!annuityType.includes("deferred") && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">Initial Investment ($)</label>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                placeholder="Enter initial investment"
                step="100"
                className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">Payout Period (Years)</label>
            <input
              type="number"
              value={payoutPeriod}
              onChange={(e) => setPayoutPeriod(e.target.value)}
              placeholder="Enter payout period"
              step="1"
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">Payout Frequency</label>
            <select
              value={payoutFrequency}
              onChange={(e) => setPayoutFrequency(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="annually">Annually</option>
              <option value="semi-annually">Semi-Annually</option>
              <option value="quarterly">Quarterly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">Annuity Rate (%)</label>
            <input
              type="number"
              value={annuityRate}
              onChange={(e) => setAnnuityRate(e.target.value)}
              placeholder="Enter annuity rate"
              step="0.01"
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">Inflation Rate (%)</label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              placeholder="Enter inflation rate"
              step="0.01"
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="USD">$ USD</option>
              <option value="CAD">$ CAD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>
          <button
            onClick={calculateAnnuity}
            className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600"
          >
            Calculate Annuity
          </button>
          {result && (
            <div className="bg-gray-200 p-4 rounded-lg mt-4">
              <p>
                <strong>Initial Investment:</strong> {formatCurrency(result.initialInvestment, currency)}
              </p>
              <p>
                <strong>Total Contributions:</strong> {formatCurrency(result.totalContributions, currency)}
              </p>
              <p>
                <strong>Total Growth:</strong> {formatCurrency(result.totalGrowth, currency)}
              </p>
              <p>
                <strong>Annuity Balance:</strong> {formatCurrency(result.annuityBalance, currency)}
              </p>
              <p>
                <strong>Real Balance (Inflation-Adjusted):</strong>{" "}
                {formatCurrency(result.realBalance, currency)}
              </p>
              <p>
                <strong>Annual Payout:</strong> {formatCurrency(result.annualPayout, currency)}
              </p>
              <p>
                <strong>Monthly Payout:</strong> {formatCurrency(result.monthlyPayout, currency)}
              </p>
              <p>
                <strong>Total Payouts:</strong> {formatCurrency(result.totalPayouts, currency)}
              </p>
            </div>
          )}
          <div className="mt-4">
            <canvas ref={balanceChartRef}></canvas>
          </div>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto p-4 bg-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Cash Flow & History</h1>
          {cashFlowData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Year</th>
                  <th className="p-2">Contribution</th>
                  <th className="p-2">Growth</th>
                  <th className="p-2">Payout</th>
                  <th className="p-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {cashFlowData.map((item, i) => (
                  <tr key={i} className="border-b border-gray-300 even:bg-gray-50">
                    <td className="p-2 text-right">{item.year}</td>
                    <td className="p-2 text-right">{formatCurrency(item.contribution, currency)}</td>
                    <td className="p-2 text-right">{formatCurrency(item.growth, currency)}</td>
                    <td className="p-2 text-right">{formatCurrency(item.payout, currency)}</td>
                    <td className="p-2 text-right">{formatCurrency(item.balance, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {history.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow mb-4">
              <p>
                <strong>Date:</strong> {item.timestamp}
              </p>
              <p>
                <strong>Annuity Type:</strong> {item.annuityType}
              </p>
              <p>
                <strong>Initial Investment:</strong> {item.initialInvestment}
              </p>
              <p>
                <strong>Total Contributions:</strong> {item.totalContributions}
              </p>
              <p>
                <strong>Total Growth:</strong> {item.totalGrowth}
              </p>
              <p>
                <strong>Annuity Balance:</strong> {item.annuityBalance}
              </p>
              <p>
                <strong>Real Balance:</strong> {item.realBalance}
              </p>
              <p>
                <strong>Annual Payout:</strong> {item.annualPayout}
              </p>
              <p>
                <strong>Monthly Payout:</strong> {item.monthlyPayout}
              </p>
              <p>
                <strong>Total Payouts:</strong> {item.totalPayouts}
              </p>
              <p>
                <strong>Inputs:</strong>
              </p>
              <ul className="list-disc pl-5">
                {Object.entries(item.inputs).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {comparisonData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden mt-4">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Scenario</th>
                  <th className="p-2">Annuity Balance</th>
                  <th className="p-2">Real Balance</th>
                  <th className="p-2">Annual Payout</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, i) => (
                  <tr key={i} className="border-b border-gray-300 even:bg-gray-50">
                    <td className="p-2 text-right">{item.label}</td>
                    <td className="p-2 text-right">{formatCurrency(item.annuityBalance, currency)}</td>
                    <td className="p-2 text-right">{formatCurrency(item.realBalance, currency)}</td>
                    <td className="p-2 text-right">{formatCurrency(item.annualPayout, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-4">
            <canvas ref={breakdownChartRef}></canvas>
          </div>
          <button
            onClick={exportCashFlow}
            className="bg-green-500 text-white px-4 py-2 rounded-lg w-full mt-4 hover:bg-green-600"
          >
            Export Cash Flow (CSV)
          </button>
          <button
            onClick={compareScenarios}
            className="bg-green-500 text-white px-4 py-2 rounded-lg w-full mt-2 hover:bg-green-600"
          >
            Compare Scenarios
          </button>
        </div>
      </div>
    </div>
  );
}
