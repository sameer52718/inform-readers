"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [cds, setCds] = useState([
    { id: 1, name: "", principal: "", interestRate: "", term: "", compoundFrequency: "12" },
  ]);
  const [contribution, setContribution] = useState({ amount: "", frequency: "0" });
  const [adjustments, setAdjustments] = useState({
    taxRate: "",
    inflationRate: "",
    penaltyAmount: "",
    penaltyType: "fixed",
  });
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [breakdownData, setBreakdownData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [history, setHistory] = useState([]);
  const growthChartRef = useRef(null);
  const balanceChartRef = useRef(null);
  const growthChartInstance = useRef(null);
  const balanceChartInstance = useRef(null);

  useEffect(() => {
    if (growthChartRef.current) {
      growthChartInstance.current = new Chart(growthChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            { label: "Nominal Value", data: [], borderColor: "#ef4444", fill: false },
            { label: "Real Value (Inflation-Adjusted)", data: [], borderColor: "#facc15", fill: false },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Period" } },
            y: { beginAtZero: true, title: { display: true, text: "Value" } },
          },
          plugins: { title: { display: true, text: "CD Growth Over Time" } },
        },
      });
    }
    if (balanceChartRef.current) {
      balanceChartInstance.current = new Chart(balanceChartRef.current, {
        type: "pie",
        data: {
          labels: ["Principal", "Interest", "Contributions", "Taxes"],
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
          plugins: { legend: { position: "top" }, title: { display: true, text: "Balance Breakdown" } },
        },
      });
    }
    return () => {
      growthChartInstance.current?.destroy();
      balanceChartInstance.current?.destroy();
    };
  }, []);

  const formatCurrency = (amount) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  const addCdRow = () => {
    const newId = Math.max(...cds.map((c) => c.id)) + 1;
    setCds([
      ...cds,
      { id: newId, name: "", principal: "", interestRate: "", term: "", compoundFrequency: "12" },
    ]);
  };

  const removeCdRow = (id) => {
    if (cds.length > 1) {
      setCds(cds.filter((c) => c.id !== id));
    }
  };

  const updateCd = (id, field, value) => {
    setCds(cds.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const calculateCD = () => {
    const contributionAmount = parseFloat(contribution.amount) || 0;
    const contributionFrequency = parseInt(contribution.frequency) || 0;
    const taxRate = parseFloat(adjustments.taxRate) / 100 || 0;
    const inflationRate = parseFloat(adjustments.inflationRate) / 100 || 0;
    const penaltyAmount = parseFloat(adjustments.penaltyAmount) || 0;
    const penaltyType = adjustments.penaltyType;

    if (cds.length === 0) {
      setResults({ error: "Please add at least one CD" });
      return;
    }

    let calculatedCds = [];
    let totalPrincipal = 0;
    let totalInterest = 0;
    let totalContributions = 0;
    let totalTaxes = 0;
    let newBreakdownData = [];

    cds.forEach((cd) => {
      const name = cd.name || "Unnamed CD";
      const principal = parseFloat(cd.principal) || 0;
      const interestRate = parseFloat(cd.interestRate) / 100 || 0;
      const term = parseFloat(cd.term) || 0;
      const compoundFrequency = parseInt(cd.compoundFrequency) || 1;

      if (principal <= 0 || interestRate <= 0 || term <= 0) return;

      const periods = Math.floor(term);
      let balance = principal;
      let totalInterestEarned = 0;
      let totalContributionsMade = 0;
      let balances = [];
      let realBalances = [];
      let periodInterest = [];

      for (let period = 1; period <= periods; period++) {
        const compoundsPerYear = compoundFrequency;
        const ratePerCompound = interestRate / compoundsPerYear;
        const contributionPerCompound =
          contributionFrequency > 0 ? contributionAmount * (compoundsPerYear / contributionFrequency) : 0;

        const futureValue =
          balance * Math.pow(1 + ratePerCompound, compoundsPerYear) +
          (contributionPerCompound * (Math.pow(1 + ratePerCompound, compoundsPerYear) - 1)) / ratePerCompound;

        const periodInterestEarned = futureValue - balance - contributionPerCompound * compoundsPerYear;
        totalInterestEarned += periodInterestEarned;
        totalContributionsMade += contributionPerCompound * compoundsPerYear;

        balance = futureValue;
        const realBalance = balance / Math.pow(1 + inflationRate, period);

        balances.push(balance);
        realBalances.push(realBalance);
        periodInterest.push(periodInterestEarned);

        newBreakdownData.push({
          period,
          cd: name,
          balance,
          interest: periodInterestEarned,
          contributions: contributionPerCompound * compoundsPerYear,
          taxes: periodInterestEarned * taxRate,
          realBalance,
        });
      }

      const apy = Math.pow(1 + interestRate / compoundFrequency, compoundFrequency) - 1;
      const taxes = totalInterestEarned * taxRate;
      const penalty = penaltyType === "fixed" ? penaltyAmount : totalInterestEarned * (penaltyAmount / 100);
      const valueAfterPenalty = balance - penalty;

      calculatedCds.push({
        name,
        principal,
        futureValue: balance,
        totalInterest: totalInterestEarned,
        totalContributions: totalContributionsMade,
        taxes,
        realValue: balance / Math.pow(1 + inflationRate, term),
        apy,
        penalty,
        valueAfterPenalty,
        balances,
        realBalances,
      });

      totalPrincipal += principal;
      totalInterest += totalInterestEarned;
      totalContributions += totalContributionsMade;
      totalTaxes += taxes;
    });

    if (calculatedCds.length === 0) {
      setResults({
        error:
          "Please provide valid inputs for at least one CD (principal, interest rate, and term must be positive).",
      });
      return;
    }

    setResults({
      futureValue: calculatedCds.reduce((sum, cd) => sum + cd.futureValue, 0),
      totalInterest,
      afterTaxInterest: totalInterest - totalTaxes,
      totalContributions,
      realValue: calculatedCds.reduce((sum, cd) => sum + cd.realValue, 0),
      apy: calculatedCds[0].apy * 100,
      penalty: calculatedCds.reduce((sum, cd) => sum + cd.penalty, 0),
      valueAfterPenalty: calculatedCds.reduce((sum, cd) => sum + cd.valueAfterPenalty, 0),
    });
    setBreakdownData(newBreakdownData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      futureValue: formatCurrency(calculatedCds.reduce((sum, cd) => sum + cd.futureValue, 0)),
      totalInterest: formatCurrency(totalInterest),
      afterTaxInterest: formatCurrency(totalInterest - totalTaxes),
      totalContributions: formatCurrency(totalContributions),
      realValue: formatCurrency(calculatedCds.reduce((sum, cd) => sum + cd.realValue, 0)),
      apy: `${(calculatedCds[0].apy * 100).toFixed(2)}%`,
      penalty: formatCurrency(calculatedCds.reduce((sum, cd) => sum + cd.penalty, 0)),
      valueAfterPenalty: formatCurrency(calculatedCds.reduce((sum, cd) => sum + cd.valueAfterPenalty, 0)),
      cds: calculatedCds.map((cd) => ({
        name: cd.name,
        principal: formatCurrency(cd.principal),
        futureValue: formatCurrency(cd.futureValue),
        totalInterest: formatCurrency(cd.totalInterest),
        totalContributions: formatCurrency(cd.totalContributions),
        taxes: formatCurrency(cd.taxes),
        realValue: formatCurrency(cd.realValue),
        apy: `${(cd.apy * 100).toFixed(2)}%`,
      })),
      inputs: {
        contributionAmount: formatCurrency(contributionAmount),
        contributionFrequency:
          contributionFrequency === 0
            ? "None"
            : contributionFrequency === 12
            ? "Monthly"
            : contributionFrequency === 4
            ? "Quarterly"
            : "Annually",
        taxRate: `${(taxRate * 100).toFixed(2)}%`,
        inflationRate: `${(inflationRate * 100).toFixed(2)}%`,
        penalty: penaltyType === "fixed" ? formatCurrency(penaltyAmount) : `${penaltyAmount.toFixed(2)}%`,
        currency,
      },
    };
    setHistory([...history, calculation]);

    if (growthChartInstance.current) {
      growthChartInstance.current.data.labels = Array.from(
        { length: calculatedCds[0].balances.length },
        (_, i) => `Year ${i + 1}`
      );
      growthChartInstance.current.data.datasets[0].data = calculatedCds.map((cd) => cd.balances).flat();
      growthChartInstance.current.data.datasets[1].data = calculatedCds.map((cd) => cd.realBalances).flat();
      growthChartInstance.current.update();
    }
    if (balanceChartInstance.current) {
      balanceChartInstance.current.data.datasets[0].data = [
        totalPrincipal,
        totalInterest,
        totalContributions,
        totalTaxes,
      ];
      balanceChartInstance.current.update();
    }
  };

  const compareCDs = () => {
    const contributionAmount = parseFloat(contribution.amount) || 0;
    const contributionFrequency = parseInt(contribution.frequency) || 0;
    const taxRate = parseFloat(adjustments.taxRate) / 100 || 0;
    const inflationRate = parseFloat(adjustments.inflationRate) / 100 || 0;

    if (cds.length === 0) {
      setComparisonData([]);
      setResults({ error: "Please add at least one CD" });
      return;
    }

    const newComparisonData = cds
      .map((cd) => {
        const name = cd.name || "Unnamed CD";
        const principal = parseFloat(cd.principal) || 0;
        const interestRate = parseFloat(cd.interestRate) / 100 || 0;
        const term = parseFloat(cd.term) || 0;
        const compoundFrequency = parseInt(cd.compoundFrequency) || 1;

        if (principal <= 0 || interestRate <= 0 || term <= 0) return null;

        let balance = principal;
        let totalInterestEarned = 0;
        let totalContributionsMade = 0;

        const compoundsPerYear = compoundFrequency;
        const ratePerCompound = interestRate / compoundsPerYear;
        const contributionPerCompound =
          contributionFrequency > 0 ? contributionAmount * (compoundsPerYear / contributionFrequency) : 0;

        const futureValue =
          balance * Math.pow(1 + ratePerCompound, compoundsPerYear * term) +
          (contributionPerCompound * (Math.pow(1 + ratePerCompound, compoundsPerYear * term) - 1)) /
            ratePerCompound;

        totalInterestEarned = futureValue - principal - contributionPerCompound * compoundsPerYear * term;
        totalContributionsMade = contributionPerCompound * compoundsPerYear * term;

        const apy = Math.pow(1 + interestRate / compoundFrequency, compoundFrequency) - 1;
        const realValue = futureValue / Math.pow(1 + inflationRate, term);

        return { name, futureValue, totalInterest: totalInterestEarned, apy: apy * 100, realValue };
      })
      .filter(Boolean);

    if (newComparisonData.length === 0) {
      setComparisonData([]);
      setResults({
        error:
          "Please provide valid inputs for at least one CD (principal, interest rate, and term must be positive).",
      });
      return;
    }

    setComparisonData(newComparisonData);
    setResults(null);
  };

  const exportBreakdown = () => {
    if (breakdownData.length === 0) {
      setResults({ error: "No breakdown data to export" });
      return;
    }

    const csvContent = [
      "Period,CD,Balance,Interest,Contributions,Taxes,Real Value",
      ...breakdownData.map(
        (item) =>
          `${item.period},${item.cd},${item.balance.toFixed(2)},${item.interest.toFixed(
            2
          )},${item.contributions.toFixed(2)},${item.taxes.toFixed(2)},${item.realBalance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cd_breakdown.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white min-h-screen flex justify-center items-center p-5">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-6xl w-full flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Advanced CD Calculator</h1>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Certificates of Deposit</label>
              {cds.map((cd) => (
                <div key={cd.id} className="flex flex-col sm:flex-row gap-2 mb-3">
                  {[
                    { id: "name", type: "text", placeholder: "CD name (e.g., Bank A)", value: cd.name },
                    {
                      id: "principal",
                      type: "number",
                      placeholder: "Principal ($)",
                      step: "1000",
                      value: cd.principal,
                    },
                    {
                      id: "interestRate",
                      type: "number",
                      placeholder: "Interest Rate (%)",
                      step: "0.01",
                      value: cd.interestRate,
                    },
                    { id: "term", type: "number", placeholder: "Term (years)", step: "0.1", value: cd.term },
                    {
                      id: "compoundFrequency",
                      type: "select",
                      value: cd.compoundFrequency,
                      options: [
                        { value: "12", label: "Monthly" },
                        { value: "4", label: "Quarterly" },
                        { value: "2", label: "Semi-Annually" },
                        { value: "1", label: "Annually" },
                      ],
                    },
                  ].map((field) => (
                    <div key={field.id} className="flex-1">
                      {field.type === "select" ? (
                        <select
                          value={field.value}
                          onChange={(e) => updateCd(cd.id, field.id, e.target.value)}
                          className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
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
                          value={field.value}
                          step={field.step}
                          onChange={(e) => updateCd(cd.id, field.id, e.target.value)}
                          className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                        />
                      )}
                    </div>
                  ))}
                  {cds.length > 1 && (
                    <button
                      onClick={() => removeCdRow(cd.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 sm:w-auto"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addCdRow}
                className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
              >
                Add CD
              </button>
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Additional Contributions</label>
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Contribution Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="Enter contribution amount"
                  step="100"
                  value={contribution.amount}
                  onChange={(e) => setContribution({ ...contribution, amount: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium text-gray-700">Contribution Frequency</label>
                <select
                  value={contribution.frequency}
                  onChange={(e) => setContribution({ ...contribution, frequency: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                >
                  {[
                    { value: "0", label: "None" },
                    { value: "12", label: "Monthly" },
                    { value: "4", label: "Quarterly" },
                    { value: "1", label: "Annually" },
                  ].map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Adjustments</label>
              {[
                {
                  id: "taxRate",
                  label: "Tax Rate on Interest (%)",
                  type: "number",
                  step: "0.01",
                  value: adjustments.taxRate,
                },
                {
                  id: "inflationRate",
                  label: "Inflation Rate (%)",
                  type: "number",
                  step: "0.01",
                  value: adjustments.inflationRate,
                },
                {
                  id: "penaltyAmount",
                  label: "Early Withdrawal Penalty ($ or % of interest)",
                  type: "number",
                  step: "100",
                  value: adjustments.penaltyAmount,
                },
                {
                  id: "penaltyType",
                  label: "Penalty Type",
                  type: "select",
                  value: adjustments.penaltyType,
                  options: [
                    { value: "fixed", label: "Fixed ($)" },
                    { value: "percent", label: "Percent of Interest (%)" },
                  ],
                },
              ].map((field) => (
                <div key={field.id} className="mb-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      value={field.value}
                      onChange={(e) => setAdjustments({ ...adjustments, [field.id]: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
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
                      step={field.step}
                      value={field.value}
                      onChange={(e) => setAdjustments({ ...adjustments, [field.id]: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
              >
                {[
                  { value: "USD", label: "$ USD" },
                  { value: "CAD", label: "$ CAD" },
                  { value: "EUR", label: "€ EUR" },
                  { value: "GBP", label: "£ GBP" },
                ].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={calculateCD}
              className="w-full bg-red-500 text-white p-3 rounded-lg mb-5 hover:bg-red-600"
            >
              Calculate CD
            </button>
            {results && (
              <div className="bg-white p-5 rounded-lg mb-5">
                {results.error ? (
                  <p className="text-red-500 text-center">{results.error}</p>
                ) : (
                  <>
                    <p>
                      <strong>Future Value:</strong> {formatCurrency(results.futureValue)}
                    </p>
                    <p>
                      <strong>Total Interest:</strong> {formatCurrency(results.totalInterest)}
                    </p>
                    <p>
                      <strong>After-Tax Interest:</strong> {formatCurrency(results.afterTaxInterest)}
                    </p>
                    <p>
                      <strong>Total Contributions:</strong> {formatCurrency(results.totalContributions)}
                    </p>
                    <p>
                      <strong>Real Value (Inflation-Adjusted):</strong> {formatCurrency(results.realValue)}
                    </p>
                    <p>
                      <strong>APY:</strong> {results.apy.toFixed(2)}%
                    </p>
                    <p>
                      <strong>Early Withdrawal Penalty:</strong> {formatCurrency(results.penalty)}
                    </p>
                    <p>
                      <strong>Value After Penalty:</strong> {formatCurrency(results.valueAfterPenalty)}
                    </p>
                  </>
                )}
              </div>
            )}
            <div className="mb-5">
              <canvas ref={growthChartRef} className="border-2 border-gray-300 rounded-lg" />
            </div>
          </div>
          <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-white rounded-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Breakdown & History</h1>
            {breakdownData.length > 0 && (
              <table className="w-full border-collapse mb-5">
                <thead>
                  <tr className="bg-red-500 text-white">
                    {["Period", "CD", "Balance", "Interest", "Contributions", "Taxes", "Real Value"].map(
                      (h) => (
                        <th key={h} className="p-2 text-right">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {breakdownData.map((item, i) => (
                    <tr key={i} className="border-b border-gray-300 even:bg-gray-50">
                      <td className="p-2 text-right">{item.period}</td>
                      <td className="p-2 text-right">{item.cd}</td>
                      <td className="p-2 text-right">{formatCurrency(item.balance)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.interest)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.contributions)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.taxes)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.realBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {history.map((item, i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg mb-3 shadow">
                <p>
                  <strong>Date:</strong> {item.timestamp}
                </p>
                <p>
                  <strong>Future Value:</strong> {item.futureValue}
                </p>
                <p>
                  <strong>Total Interest:</strong> {item.totalInterest}
                </p>
                <p>
                  <strong>After-Tax Interest:</strong> {item.afterTaxInterest}
                </p>
                <p>
                  <strong>Total Contributions:</strong> {item.totalContributions}
                </p>
                <p>
                  <strong>Real Value:</strong> {item.realValue}
                </p>
                <p>
                  <strong>APY:</strong> {item.apy}
                </p>
                <p>
                  <strong>Penalty:</strong> {item.penalty}
                </p>
                <p>
                  <strong>Value After Penalty:</strong> {item.valueAfterPenalty}
                </p>
                <p>
                  <strong>CDs:</strong>
                </p>
                <ul className="list-disc pl-5">
                  {item.cds.map((cd, j) => (
                    <li key={j}>
                      {cd.name}: Principal {cd.principal}, Future Value {cd.futureValue}, Interest{" "}
                      {cd.totalInterest}, Contributions {cd.totalContributions}, Taxes {cd.taxes}, Real Value{" "}
                      {cd.realValue}, APY {cd.apy}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Inputs:</strong>
                </p>
                <ul className="list-disc pl-5">
                  <li>Contribution Amount: {item.inputs.contributionAmount}</li>
                  <li>Contribution Frequency: {item.inputs.contributionFrequency}</li>
                  <li>Tax Rate: {item.inputs.taxRate}</li>
                  <li>Inflation Rate: {item.inputs.inflationRate}</li>
                  <li>Penalty: {item.inputs.penalty}</li>
                  <li>Currency: {item.inputs.currency}</li>
                </ul>
              </div>
            ))}
            {comparisonData.length > 0 && (
              <table className="w-full border-collapse mb-5">
                <thead>
                  <tr className="bg-red-500 text-white">
                    {["CD", "Future Value", "Total Interest", "APY", "Real Value"].map((h) => (
                      <th key={h} className="p-2 text-right">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, i) => (
                    <tr key={i} className="border-b border-gray-300 even:bg-gray-50">
                      <td className="p-2 text-right">{item.name}</td>
                      <td className="p-2 text-right">{formatCurrency(item.futureValue)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.totalInterest)}</td>
                      <td className="p-2 text-right">{item.apy.toFixed(2)}%</td>
                      <td className="p-2 text-right">{formatCurrency(item.realValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mb-5">
              <canvas ref={balanceChartRef} className="border-2 border-gray-300 rounded-lg" />
            </div>
            <button
              onClick={exportBreakdown}
              className="w-full bg-green-500 text-white p-3 rounded-lg mb-3 hover:bg-green-600"
            >
              Export Breakdown (CSV)
            </button>
            <button
              onClick={compareCDs}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              Compare CDs
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .flex-col\\:md\\:flex-row {
            flex-direction: column;
          }
          .max-h-\\[700px\\] {
            max-height: 500px;
          }
          .flex-row {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
