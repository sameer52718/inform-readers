"use client";

import { useState } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [totalEstate, setTotalEstate] = useState("15000000");
  const [taxableGifts, setTaxableGifts] = useState("0");
  const [realEstate, setRealEstate] = useState("8000000");
  const [stocks, setStocks] = useState("4000000");
  const [bonds, setBonds] = useState("1000000");
  const [cash, setCash] = useState("1000000");
  const [business, setBusiness] = useState("0");
  const [otherAssets, setOtherAssets] = useState("1000000");
  const [maritalDeduction, setMaritalDeduction] = useState("5000000");
  const [charitableDeduction, setCharitableDeduction] = useState("1000000");
  const [debts, setDebts] = useState("500000");
  const [adminExpenses, setAdminExpenses] = useState("150000");
  const [taxYear, setTaxYear] = useState("2025");
  const [filingStatus, setFilingStatus] = useState("individual");
  const [state, setState] = useState("none");
  const [giftExclusion, setGiftExclusion] = useState("18000");
  const [giftRecipients, setGiftRecipients] = useState("5");
  const [inflationRate, setInflationRate] = useState("2");
  const [growthRate, setGrowthRate] = useState("4");
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [activeSections, setActiveSections] = useState({
    assets: false,
    deductions: false,
    taxDetails: false,
    planning: false,
  });

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[curr]} ${parseFloat(amount).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  };

  const toggleSection = (section) => {
    setActiveSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const calculateEstateTax = () => {
    setError("");
    setStatus("");
    setResults(null);

    const parsed = {
      totalEstate: parseFloat(totalEstate) || 0,
      taxableGifts: parseFloat(taxableGifts) || 0,
      realEstate: parseFloat(realEstate) || 0,
      stocks: parseFloat(stocks) || 0,
      bonds: parseFloat(bonds) || 0,
      cash: parseFloat(cash) || 0,
      business: parseFloat(business) || 0,
      otherAssets: parseFloat(otherAssets) || 0,
      maritalDeduction: parseFloat(maritalDeduction) || 0,
      charitableDeduction: parseFloat(charitableDeduction) || 0,
      debts: parseFloat(debts) || 0,
      adminExpenses: parseFloat(adminExpenses) || 0,
      giftExclusion: parseFloat(giftExclusion) || 0,
      giftRecipients: parseInt(giftRecipients) || 0,
      inflationRate: parseFloat(inflationRate) / 100 || 0,
      growthRate: parseFloat(growthRate) / 100 || 0,
    };

    if (
      parsed.totalEstate < 0 ||
      parsed.taxableGifts < 0 ||
      parsed.realEstate < 0 ||
      parsed.stocks < 0 ||
      parsed.bonds < 0 ||
      parsed.cash < 0 ||
      parsed.business < 0 ||
      parsed.otherAssets < 0
    ) {
      setError("Estate values and assets must be non-negative");
      return;
    }
    if (
      parsed.maritalDeduction < 0 ||
      parsed.charitableDeduction < 0 ||
      parsed.debts < 0 ||
      parsed.adminExpenses < 0
    ) {
      setError("Deductions and expenses must be non-negative");
      return;
    }
    if (
      parsed.giftExclusion < 0 ||
      parsed.giftRecipients < 0 ||
      parsed.inflationRate < 0 ||
      parsed.growthRate < 0
    ) {
      setError("Planning factors must be non-negative");
      return;
    }
    const assetSum =
      parsed.realEstate + parsed.stocks + parsed.bonds + parsed.cash + parsed.business + parsed.otherAssets;
    if (Math.abs(assetSum - parsed.totalEstate) > 1000) {
      setError("Asset breakdown must approximately match total estate value");
      return;
    }

    try {
      const exemptions = {
        2024: { individual: 12920000, married: 25840000 },
        2025: { individual: 13610000, married: 27220000 },
      };
      const federalBrackets = [
        { min: 0, max: 10000, rate: 0.18 },
        { min: 10001, max: 20000, rate: 0.2 },
        { min: 20001, max: 40000, rate: 0.22 },
        { min: 40001, max: 60000, rate: 0.24 },
        { min: 60001, max: 80000, rate: 0.26 },
        { min: 80001, max: 100000, rate: 0.28 },
        { min: 100001, max: 150000, rate: 0.3 },
        { min: 150001, max: 250000, rate: 0.32 },
        { min: 250001, max: 500000, rate: 0.34 },
        { min: 500001, max: 750000, rate: 0.37 },
        { min: 750001, max: 1000000, rate: 0.39 },
        { min: 1000001, rate: 0.4 },
      ];
      const stateExemptions = { NY: 6940000, MD: 5000000 };
      const stateBrackets = {
        NY: [
          { min: 0, max: 500000, rate: 0.0306 },
          { min: 500001, max: 1000000, rate: 0.056 },
          { min: 1000001, max: 2100000, rate: 0.072 },
          { min: 2100001, max: 3100000, rate: 0.082 },
          { min: 3100001, max: 4100000, rate: 0.092 },
          { min: 4100001, max: 5200000, rate: 0.102 },
          { min: 5200001, max: 6300000, rate: 0.112 },
          { min: 6300001, max: 7300000, rate: 0.122 },
          { min: 7300001, max: 8300000, rate: 0.132 },
          { min: 8300001, max: 9400000, rate: 0.142 },
          { min: 9400001, max: 10400000, rate: 0.152 },
          { min: 10400001, rate: 0.16 },
        ],
        MD: [
          { min: 0, max: 1000000, rate: 0 },
          { min: 1000001, max: 2000000, rate: 0.08 },
          { min: 2000001, max: 3000000, rate: 0.09 },
          { min: 3000001, max: 4000000, rate: 0.1 },
          { min: 4000001, max: 5000000, rate: 0.11 },
          { min: 5000001, max: 6000000, rate: 0.12 },
          { min: 6000001, max: 7000000, rate: 0.13 },
          { min: 7000001, max: 8000000, rate: 0.14 },
          { min: 8000001, max: 9000000, rate: 0.15 },
          { min: 9000001, rate: 0.16 },
        ],
      };

      const grossEstate = parsed.totalEstate + parsed.taxableGifts;
      const totalDeductions =
        parsed.maritalDeduction + parsed.charitableDeduction + parsed.debts + parsed.adminExpenses;
      const taxableEstate = Math.max(0, grossEstate - totalDeductions);
      const exemption = exemptions[taxYear][filingStatus];
      const federalTaxable = Math.max(0, taxableEstate - exemption);

      let federalTax = 0;
      for (const bracket of federalBrackets) {
        if (federalTaxable > bracket.min) {
          const taxableInBracket = Math.min(federalTaxable, bracket.max || federalTaxable) - bracket.min;
          federalTax += taxableInBracket * bracket.rate;
        }
      }

      let stateTax = 0;
      if (state !== "none") {
        const stateExemption = stateExemptions[state] || 0;
        const stateTaxable = Math.max(0, taxableEstate - stateExemption);
        const brackets = stateBrackets[state];
        for (const bracket of brackets) {
          if (stateTaxable > bracket.min) {
            const taxableInBracket = Math.min(stateTaxable, bracket.max || stateTaxable) - bracket.min;
            stateTax += taxableInBracket * bracket.rate;
          }
        }
      }

      const totalTax = federalTax + stateTax;
      const netEstate = taxableEstate - totalTax;
      const effectiveTaxRate = grossEstate > 0 ? (totalTax / grossEstate) * 100 : 0;

      const annualGiftSavings = parsed.giftExclusion * parsed.giftRecipients;
      const lifetimeGiftSavings = annualGiftSavings * 10;
      const reducedTaxableEstate = Math.max(0, taxableEstate - lifetimeGiftSavings);
      let reducedFederalTax = 0;
      const reducedFederalTaxable = Math.max(0, reducedTaxableEstate - exemption);
      for (const bracket of federalBrackets) {
        if (reducedFederalTaxable > bracket.min) {
          const taxableInBracket =
            Math.min(reducedFederalTaxable, bracket.max || reducedFederalTaxable) - bracket.min;
          reducedFederalTax += taxableInBracket * bracket.rate;
        }
      }
      const giftTaxSavings = federalTax - reducedFederalTax;

      const projectionYears = 10;
      const futureEstateValue = parsed.totalEstate * Math.pow(1 + parsed.growthRate, projectionYears);
      const inflationAdjustedValue = futureEstateValue / Math.pow(1 + parsed.inflationRate, projectionYears);

      const summaryMetrics = [
        { label: "Gross Estate", value: formatCurrency(grossEstate) },
        { label: "Taxable Estate", value: formatCurrency(taxableEstate) },
        { label: "Federal Estate Tax", value: formatCurrency(federalTax) },
        { label: "State Estate Tax", value: formatCurrency(stateTax) },
        { label: "Net Estate", value: formatCurrency(netEstate) },
        {
          label: "Effective Tax Rate",
          value: `${effectiveTaxRate.toFixed(2)}%`,
        },
        {
          label: "Annual Gift Savings",
          value: formatCurrency(annualGiftSavings),
        },
        {
          label: "Projected Gift Tax Savings",
          value: formatCurrency(giftTaxSavings),
        },
        {
          label: "Future Estate Value",
          value: formatCurrency(futureEstateValue),
        },
        {
          label: "Inflation-Adjusted Value",
          value: formatCurrency(inflationAdjustedValue),
        },
      ];

      const detailedItems = [
        { category: "Real Estate", amount: parsed.realEstate },
        { category: "Stocks", amount: parsed.stocks },
        { category: "Bonds", amount: parsed.bonds },
        { category: "Cash", amount: parsed.cash },
        { category: "Business Interests", amount: parsed.business },
        { category: "Other Assets", amount: parsed.otherAssets },
        { category: "Taxable Gifts", amount: parsed.taxableGifts },
        { category: "Marital Deduction", amount: -parsed.maritalDeduction },
        { category: "Charitable Deduction", amount: -parsed.charitableDeduction },
        { category: "Debts and Liabilities", amount: -parsed.debts },
        { category: "Administrative Expenses", amount: -parsed.adminExpenses },
        { category: "Federal Estate Tax", amount: -federalTax },
        { category: "State Estate Tax", amount: -stateTax },
      ].filter((item) => item.amount !== 0);

      const tips = [];
      if (taxableEstate > exemption) tips.push("Consider increasing annual gifts to reduce taxable estate.");
      if (parsed.maritalDeduction === 0 && filingStatus === "married")
        tips.push("Utilize unlimited marital deduction for spouse transfers.");
      if (parsed.charitableDeduction === 0)
        tips.push("Charitable donations can reduce taxable estate significantly.");
      if (giftTaxSavings > 0)
        tips.push("Continue leveraging annual gift exclusions to minimize future taxes.");
      if (state !== "none") tips.push("Review state-specific estate planning strategies.");

      setResults({
        summaryMetrics,
        detailedItems,
        tips,
      });

      alert("Pie chart not implemented in this demo.");
    } catch (error) {
      setError("Error calculating estate tax. Check console for details.");
      console.error("Calculation error:", error);
    }
  };

  const sortDetailedTable = (column) => {
    if (!results) return;
    const isAmount = column === "amount";
    const isAscending = results.sortOrder?.column === column && results.sortOrder?.direction === "asc";
    const direction = isAscending ? "desc" : "asc";
    const sortedItems = [...results.detailedItems].sort((a, b) => {
      const aValue = isAmount ? a.amount : a.category;
      const bValue = isAmount ? b.amount : b.category;
      if (isAmount) {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    setResults({
      ...results,
      detailedItems: sortedItems,
      sortOrder: { column, direction },
    });
  };

  const handleSliderChange = (value) => {
    setTotalEstate(value);
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4 relative">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        🌙 Toggle Theme
      </button>
      <div
        className={`bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-xl w-full transition-transform hover:-translate-y-1 ${
          isDarkMode ? "dark:bg-gray-800" : ""
        }`}
      >
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Advanced Estate Tax Calculator</h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {status && <div className="text-yellow-400 text-center mb-4">{status}</div>}

        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Total Estate Value
          </label>
          <input
            type="number"
            value={totalEstate}
            onChange={(e) => setTotalEstate(e.target.value)}
            min="0"
            step="1000"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />
          <input
            type="range"
            min="0"
            max="50000000"
            value={totalEstate}
            onChange={(e) => handleSliderChange(e.target.value)}
            step="1000"
            className="w-full mt-2 accent-red-500"
          />
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
            Adjusted Taxable Gifts
          </label>
          <input
            type="number"
            value={taxableGifts}
            onChange={(e) => setTaxableGifts(e.target.value)}
            min="0"
            step="1000"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {[
          {
            title: "Asset Breakdown",
            section: "assets",
            inputs: [
              { label: "Real Estate", value: realEstate, setter: setRealEstate },
              { label: "Stocks", value: stocks, setter: setStocks },
              { label: "Bonds", value: bonds, setter: setBonds },
              { label: "Cash", value: cash, setter: setCash },
              {
                label: "Business Interests",
                value: business,
                setter: setBusiness,
              },
              {
                label: "Other Assets",
                value: otherAssets,
                setter: setOtherAssets,
              },
            ],
          },
          {
            title: "Deductions and Credits",
            section: "deductions",
            inputs: [
              {
                label: "Marital Deduction",
                value: maritalDeduction,
                setter: setMaritalDeduction,
              },
              {
                label: "Charitable Deduction",
                value: charitableDeduction,
                setter: setCharitableDeduction,
              },
              { label: "Debts and Liabilities", value: debts, setter: setDebts },
              {
                label: "Administrative Expenses",
                value: adminExpenses,
                setter: setAdminExpenses,
              },
            ],
          },
          {
            title: "Tax Details",
            section: "taxDetails",
            inputs: [
              {
                label: "Tax Year",
                type: "select",
                value: taxYear,
                setter: setTaxYear,
                options: ["2024", "2025"],
              },
              {
                label: "Filing Status",
                type: "select",
                value: filingStatus,
                setter: setFilingStatus,
                options: ["individual", "married"],
              },
              {
                label: "State",
                type: "select",
                value: state,
                setter: setState,
                options: ["none", "NY", "MD"],
              },
            ],
          },
          {
            title: "Planning Factors",
            section: "planning",
            inputs: [
              {
                label: "Annual Gift Exclusion per Recipient",
                value: giftExclusion,
                setter: setGiftExclusion,
                step: "100",
              },
              {
                label: "Number of Gift Recipients",
                value: giftRecipients,
                setter: setGiftRecipients,
                step: "1",
              },
              {
                label: "Inflation Rate (%)",
                value: inflationRate,
                setter: setInflationRate,
                step: "0.1",
              },
              {
                label: "Estate Growth Rate (%)",
                value: growthRate,
                setter: setGrowthRate,
                step: "0.1",
              },
              {
                label: "Currency",
                type: "select",
                value: currency,
                setter: setCurrency,
                options: ["USD", "EUR", "INR"],
              },
            ],
          },
        ].map(({ title, section, inputs }) => (
          <div key={section} className="mb-4">
            <div
              onClick={() => toggleSection(section)}
              className="bg-red-500 text-white p-3 rounded-lg text-center cursor-pointer hover:bg-red-600"
            >
              {title}
            </div>
            <div className={`transition-all duration-300 ${activeSections[section] ? "block" : "hidden"}`}>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mt-2">
                {inputs.map(({ label, value, setter, type = "number", options, step = "1000" }) => (
                  <div key={label} className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
                      >
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt === "none"
                              ? "No State Tax"
                              : opt === "individual"
                              ? "Individual"
                              : opt === "married"
                              ? "Married"
                              : opt === "USD"
                              ? "$ USD"
                              : opt === "EUR"
                              ? "€ EUR"
                              : opt === "INR"
                              ? "₹ INR"
                              : opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        min="0"
                        step={step}
                        className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={calculateEstateTax}
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:scale-105 transition-transform"
        >
          Calculate Estate Tax
        </button>

        {results && (
          <div className="mt-6">
            <table className="w-full border-collapse bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3">Metric</th>
                  <th className="p-3">Value</th>
                </tr>
              </thead>
              <tbody>
                {results.summaryMetrics.map((metric, i) => (
                  <tr key={metric.label} className={i % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : ""}>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{metric.label}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{metric.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className="w-full border-collapse bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mt-6 max-h-80 overflow-y-auto block">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th
                    onClick={() => sortDetailedTable("category")}
                    className="p-3 cursor-pointer hover:bg-red-600"
                  >
                    Category
                  </th>
                  <th
                    onClick={() => sortDetailedTable("amount")}
                    className="p-3 cursor-pointer hover:bg-red-600"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.detailedItems.map((item, i) => (
                  <tr key={item.category} className={i % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : ""}>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{item.category}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6">
              <p className="text-gray-600 dark:text-gray-300">Pie chart not implemented in this demo.</p>
            </div>

            <div className="mt-6 text-center">
              <a
                href={`data:text/csv;charset=utf-8,Category,Amount\n${results.detailedItems
                  .map((item) => `${item.category},${item.amount.toFixed(2)}`)
                  .join("\n")}`}
                download="estate_tax_breakdown.csv"
                className="text-red-500 hover:underline"
              >
                Download Estate Tax Breakdown
              </a>
              {results.tips.length > 0 && (
                <div className="mt-4">
                  <strong className="text-gray-700 dark:text-gray-200">Tax Planning Tips:</strong>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                    {results.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <style jsx>{`
          .transition-transform:hover {
            transform: translateY(-5px);
          }
          @media (max-width: 640px) {
            .max-w-xl {
              max-width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
