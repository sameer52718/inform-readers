"use client";

import { useState } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [annualIncome, setAnnualIncome] = useState("75000");
  const [employmentStatus, setEmploymentStatus] = useState("fulltime");
  const [monthlyExpenses, setMonthlyExpenses] = useState("2000");
  const [downPayment, setDownPayment] = useState("20000");
  const [dti, setDti] = useState("36");
  const [savingsRate, setSavingsRate] = useState("20");
  const [interestRate, setInterestRate] = useState("5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [loanType, setLoanType] = useState("fixed");
  const [propertyTaxRate, setPropertyTaxRate] = useState("1");
  const [insurance, setInsurance] = useState("1200");
  const [pmiRate, setPmiRate] = useState("0.5");
  const [hoaFees, setHoaFees] = useState("0");
  const [closingCosts, setClosingCosts] = useState("3");
  const [taxYear, setTaxYear] = useState("2025");
  const [filingStatus, setFilingStatus] = useState("single");
  const [state, setState] = useState("none");
  const [inflationRate, setInflationRate] = useState("2");
  const [appreciationRate, setAppreciationRate] = useState("3");
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [activeSections, setActiveSections] = useState({
    loanDetails: false,
    taxDetails: false,
    economicFactors: false,
  });

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[curr]} ${parseFloat(amount || 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  };

  const toggleSection = (section) => {
    setActiveSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const calculateAffordability = () => {
    setError("");
    setStatus("");
    setResults(null);

    const parsed = {
      annualIncome: parseFloat(annualIncome) || 0,
      monthlyExpenses: parseFloat(monthlyExpenses) || 0,
      downPayment: parseFloat(downPayment) || 0,
      dti: parseFloat(dti) / 100 || 0.36,
      savingsRate: parseFloat(savingsRate) / 100 || 0,
      interestRate: parseFloat(interestRate) / 100 || 0,
      loanTerm: parseInt(loanTerm) || 30,
      propertyTaxRate: parseFloat(propertyTaxRate) / 100 || 0,
      insurance: parseFloat(insurance) || 0,
      pmiRate: parseFloat(pmiRate) / 100 || 0,
      hoaFees: parseFloat(hoaFees) || 0,
      closingCosts: parseFloat(closingCosts) / 100 || 0,
      inflationRate: parseFloat(inflationRate) / 100 || 0,
      appreciationRate: parseFloat(appreciationRate) / 100 || 0,
    };

    if (
      parsed.annualIncome < 0 ||
      parsed.monthlyExpenses < 0 ||
      parsed.downPayment < 0 ||
      parsed.interestRate < 0 ||
      parsed.loanTerm < 1
    ) {
      setError("Income, expenses, down payment, rate, and term must be valid");
      return;
    }
    if (parsed.dti < 0 || parsed.dti > 1 || parsed.savingsRate < 0 || parsed.savingsRate > 1) {
      setError("DTI and savings rate must be between 0% and 100%");
      return;
    }
    if (
      parsed.propertyTaxRate < 0 ||
      parsed.insurance < 0 ||
      parsed.pmiRate < 0 ||
      parsed.hoaFees < 0 ||
      parsed.closingCosts < 0
    ) {
      setError("Loan details must be non-negative");
      return;
    }
    if (parsed.inflationRate < 0 || parsed.appreciationRate < 0) {
      setError("Economic factors must be non-negative");
      return;
    }

    try {
      const standardDeductions = {
        2024: { single: 14600, marriedJoint: 29200, marriedSeparate: 14600, headHousehold: 21900 },
        2025: { single: 15000, marriedJoint: 30000, marriedSeparate: 15000, headHousehold: 22500 },
      };
      const federalBrackets = {
        2025: {
          single: [
            { rate: 0.1, min: 0, max: 11600 },
            { rate: 0.12, min: 11601, max: 47150 },
            { rate: 0.22, min: 47151, max: 100525 },
            { rate: 0.24, min: 100526, max: 191950 },
            { rate: 0.32, min: 191951, max: 243725 },
            { rate: 0.35, min: 243726, max: 609350 },
            { rate: 0.37, min: 609351 },
          ],
          marriedJoint: [
            { rate: 0.1, min: 0, max: 23200 },
            { rate: 0.12, min: 23201, max: 94300 },
            { rate: 0.22, min: 94301, max: 201050 },
            { rate: 0.24, min: 201051, max: 383900 },
            { rate: 0.32, min: 383901, max: 487450 },
            { rate: 0.35, min: 487451, max: 731200 },
            { rate: 0.37, min: 731201 },
          ],
          marriedSeparate: [
            { rate: 0.1, min: 0, max: 11600 },
            { rate: 0.12, min: 11601, max: 47150 },
            { rate: 0.22, min: 47151, max: 100525 },
            { rate: 0.24, min: 100526, max: 191950 },
            { rate: 0.32, min: 191951, max: 243725 },
            { rate: 0.35, min: 243726, max: 365600 },
            { rate: 0.37, min: 365601 },
          ],
          headHousehold: [
            { rate: 0.1, min: 0, max: 16550 },
            { rate: 0.12, min: 16551, max: 63100 },
            { rate: 0.22, min: 63101, max: 100500 },
            { rate: 0.24, min: 100501, max: 191950 },
            { rate: 0.32, min: 191951, max: 243700 },
            { rate: 0.35, min: 243701, max: 591975 },
            { rate: 0.37, min: 591976 },
          ],
        },
      };
      const stateBrackets = {
        CA: [
          { rate: 0.01, min: 0, max: 10412 },
          { rate: 0.02, min: 10413, max: 24684 },
          { rate: 0.04, min: 24685, max: 38959 },
          { rate: 0.06, min: 38960, max: 54081 },
          { rate: 0.08, min: 54082, max: 68350 },
          { rate: 0.093, min: 68351, max: 349137 },
          { rate: 0.103, min: 349138, max: 418961 },
          { rate: 0.113, min: 418962 },
        ],
        NY: [
          { rate: 0.04, min: 0, max: 8500 },
          { rate: 0.045, min: 8501, max: 11700 },
          { rate: 0.0525, min: 11701, max: 13900 },
          { rate: 0.059, min: 13901, max: 80650 },
          { rate: 0.0633, min: 80651, max: 215400 },
          { rate: 0.0685, min: 215401, max: 1077550 },
          { rate: 0.0965, min: 1077551 },
        ],
        TX: [{ rate: 0, min: 0 }],
      };

      const taxableIncome = Math.max(0, parsed.annualIncome - standardDeductions[taxYear][filingStatus]);
      let federalTax = 0;
      let marginalRate = 0;
      const brackets = federalBrackets[taxYear][filingStatus];
      for (const bracket of brackets) {
        if (taxableIncome > bracket.min) {
          const taxableInBracket = Math.min(taxableIncome, bracket.max || taxableIncome) - bracket.min;
          federalTax += taxableInBracket * bracket.rate;
          marginalRate = bracket.rate;
        }
      }
      const socialSecurityCap = 168600;
      const socialSecurity = Math.min(parsed.annualIncome, socialSecurityCap) * 0.062;
      const medicare = parsed.annualIncome * 0.0145;
      let stateTax = 0;
      if (state !== "none" && state !== "TX") {
        const stateBracket = stateBrackets[state];
        for (const bracket of stateBracket) {
          if (taxableIncome > bracket.min) {
            const taxableInBracket = Math.min(taxableIncome, bracket.max || taxableIncome) - bracket.min;
            stateTax += taxableInBracket * bracket.rate;
          }
        }
      }
      const totalTax = federalTax + socialSecurity + medicare + stateTax;
      const netIncome = parsed.annualIncome - totalTax;
      const effectiveTaxRate = parsed.annualIncome > 0 ? (totalTax / parsed.annualIncome) * 100 : 0;

      const monthlyNetIncome = netIncome / 12;
      const monthlySavings = monthlyNetIncome * parsed.savingsRate;
      const maxHousingPayment = monthlyNetIncome * parsed.dti - parsed.monthlyExpenses;
      const periods = parsed.loanTerm * 12;
      const monthlyRate = parsed.interestRate / 12;
      const loanFactor =
        (monthlyRate * Math.pow(1 + monthlyRate, periods)) / (Math.pow(1 + monthlyRate, periods) - 1);
      const maxLoanPayment =
        maxHousingPayment /
        (1 +
          parsed.propertyTaxRate / 12 +
          parsed.insurance / 12 / maxHousingPayment +
          parsed.hoaFees / maxHousingPayment);
      let maxLoanAmount = maxLoanPayment / loanFactor;
      const downPaymentPercent = parsed.downPayment / (maxLoanAmount + parsed.downPayment);
      const pmi = downPaymentPercent < 0.2 ? (maxLoanAmount * parsed.pmiRate) / 12 : 0;
      const monthlyHousingCost =
        maxLoanPayment +
        (parsed.propertyTaxRate / 12) * (maxLoanAmount + parsed.downPayment) +
        parsed.insurance / 12 +
        pmi +
        parsed.hoaFees;
      maxLoanAmount =
        (maxHousingPayment -
          ((parsed.propertyTaxRate / 12) * parsed.downPayment +
            parsed.insurance / 12 +
            pmi +
            parsed.hoaFees)) /
        (loanFactor + parsed.propertyTaxRate / 12);
      const affordableHomePrice = maxLoanAmount + parsed.downPayment;
      const totalClosingCosts = affordableHomePrice * parsed.closingCosts;
      const totalHousingCost = monthlyHousingCost + (affordableHomePrice * 0.01) / 12; // Maintenance estimate
      const surplus = monthlyNetIncome - parsed.monthlyExpenses - monthlySavings - totalHousingCost;

      const futureHomeValue = affordableHomePrice * Math.pow(1 + parsed.appreciationRate, parsed.loanTerm);
      const inflationAdjustedValue = futureHomeValue / Math.pow(1 + parsed.inflationRate, parsed.loanTerm);
      const breakEvenYears = totalClosingCosts / (affordableHomePrice * parsed.appreciationRate) || Infinity;

      const summaryMetrics = [
        { label: "Affordable Home Price", value: formatCurrency(affordableHomePrice) },
        { label: "Monthly Housing Cost", value: formatCurrency(monthlyHousingCost) },
        { label: "Loan Amount", value: formatCurrency(maxLoanAmount) },
        { label: "Down Payment", value: formatCurrency(parsed.downPayment) },
        { label: "Total Closing Costs", value: formatCurrency(totalClosingCosts) },
        { label: "Net Monthly Income", value: formatCurrency(monthlyNetIncome) },
        { label: "Monthly Surplus", value: formatCurrency(surplus) },
        { label: "Effective Tax Rate", value: `${effectiveTaxRate.toFixed(2)}%` },
        { label: "Future Home Value", value: formatCurrency(futureHomeValue) },
        { label: "Inflation-Adjusted Value", value: formatCurrency(inflationAdjustedValue) },
        { label: "Break-even Years", value: breakEvenYears === Infinity ? "N/A" : breakEvenYears.toFixed(1) },
      ];

      const detailedItems = [
        { category: "Annual Income", amount: parsed.annualIncome },
        { category: "Federal Tax", amount: -federalTax },
        { category: "Social Security", amount: -socialSecurity },
        { category: "Medicare", amount: -medicare },
        { category: "State Tax", amount: -stateTax },
        { category: "Monthly Expenses", amount: -parsed.monthlyExpenses * 12 },
        { category: "Principal & Interest", amount: -maxLoanPayment * 12 },
        { category: "Property Taxes", amount: -parsed.propertyTaxRate * affordableHomePrice },
        { category: "Homeowners Insurance", amount: -parsed.insurance },
        { category: "PMI", amount: -pmi * 12 },
        { category: "HOA Fees", amount: -parsed.hoaFees * 12 },
        { category: "Maintenance (Est.)", amount: -affordableHomePrice * 0.01 },
      ].filter((item) => item.amount !== 0);

      const tips = [];
      if (surplus < 0) tips.push("Reduce expenses or increase income to afford this home.");
      if (downPaymentPercent < 0.2) tips.push("Increase down payment to avoid PMI costs.");
      if (parsed.interestRate > 0.06)
        tips.push("Shop for lower interest rates or consider refinancing later.");
      if (breakEvenYears > 7) tips.push("Consider a shorter-term investment if planning to sell soon.");

      setResults({
        summaryMetrics,
        detailedItems,
        tips,
        csvData: detailedItems.map((item) => ({
          Category: item.category,
          Amount: item.amount.toFixed(2),
        })),
      });

      alert("Pie chart not implemented in this demo.");
    } catch (error) {
      setError("Error calculating affordability. Check console for details.");
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
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">
          Advanced House Affordability Calculator
        </h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {status && <div className="text-yellow-400 text-center mb-4">{status}</div>}

        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Annual Household Income
          </label>
          <input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
            min="0"
            step="100"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />
          <input
            type="range"
            min="0"
            max="500000"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
            step="100"
            className="w-full mt-2 accent-red-500"
          />

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
            Employment Status
          </label>
          <select
            value={employmentStatus}
            onChange={(e) => setEmploymentStatus(e.target.value)}
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          >
            <option value="fulltime">Full-time</option>
            <option value="parttime">Part-time</option>
            <option value="selfemployed">Self-employed</option>
          </select>

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
            Monthly Expenses
          </label>
          <input
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.target.value)}
            min="0"
            step="10"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
            Down Payment
          </label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            min="0"
            step="100"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
            Target Debt-to-Income Ratio (%)
          </label>
          <input
            type="number"
            value={dti}
            onChange={(e) => setDti(e.target.value)}
            min="0"
            max="100"
            step="0.1"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">
            Savings Rate (% of Net Income)
          </label>
          <input
            type="number"
            value={savingsRate}
            onChange={(e) => setSavingsRate(e.target.value)}
            min="0"
            max="100"
            step="0.1"
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {[
          {
            title: "Loan Details",
            section: "loanDetails",
            inputs: [
              {
                label: "Annual Interest Rate (%)",
                value: interestRate,
                setter: setInterestRate,
                type: "number",
                min: "0",
                step: "0.1",
              },
              {
                label: "Loan Term (Years)",
                value: loanTerm,
                setter: setLoanTerm,
                type: "number",
                min: "1",
                step: "1",
              },
              {
                label: "Loan Type",
                value: loanType,
                setter: setLoanType,
                type: "select",
                options: ["fixed", "adjustable"],
              },
              {
                label: "Property Tax Rate (% of Home Value)",
                value: propertyTaxRate,
                setter: setPropertyTaxRate,
                type: "number",
                min: "0",
                step: "0.1",
              },
              {
                label: "Homeowners Insurance (Annual)",
                value: insurance,
                setter: setInsurance,
                type: "number",
                min: "0",
                step: "10",
              },
              {
                label: "PMI Rate (% of Loan, if Down Payment < 20%)",
                value: pmiRate,
                setter: setPmiRate,
                type: "number",
                min: "0",
                step: "0.1",
              },
              {
                label: "HOA Fees (Monthly)",
                value: hoaFees,
                setter: setHoaFees,
                type: "number",
                min: "0",
                step: "10",
              },
              {
                label: "Closing Costs (% of Home Price)",
                value: closingCosts,
                setter: setClosingCosts,
                type: "number",
                min: "0",
                step: "0.1",
              },
            ],
          },
          {
            title: "Tax Details",
            section: "taxDetails",
            inputs: [
              {
                label: "Tax Year",
                value: taxYear,
                setter: setTaxYear,
                type: "select",
                options: ["2024", "2025"],
              },
              {
                label: "Filing Status",
                value: filingStatus,
                setter: setFilingStatus,
                type: "select",
                options: ["single", "marriedJoint", "marriedSeparate", "headHousehold"],
              },
              {
                label: "State",
                value: state,
                setter: setState,
                type: "select",
                options: ["none", "CA", "NY", "TX"],
              },
            ],
          },
          {
            title: "Economic Factors",
            section: "economicFactors",
            inputs: [
              {
                label: "Inflation Rate (%)",
                value: inflationRate,
                setter: setInflationRate,
                type: "number",
                min: "0",
                step: "0.1",
              },
              {
                label: "Home Price Appreciation Rate (%)",
                value: appreciationRate,
                setter: setAppreciationRate,
                type: "number",
                min: "0",
                step: "0.1",
              },
              {
                label: "Currency",
                value: currency,
                setter: setCurrency,
                type: "select",
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
                {inputs.map(({ label, value, setter, type = "number", options, min, max, step }) => (
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
                              : opt === "single"
                              ? "Single"
                              : opt === "marriedJoint"
                              ? "Married Filing Jointly"
                              : opt === "marriedSeparate"
                              ? "Married Filing Separately"
                              : opt === "headHousehold"
                              ? "Head of Household"
                              : opt === "fixed"
                              ? "Fixed-Rate"
                              : opt === "adjustable"
                              ? "Adjustable-Rate"
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
                      <>
                        <input
                          type={type}
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          min={min}
                          max={max}
                          step={step}
                          className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500"
                        />
                        {["Annual Interest Rate (%)"].includes(label) && (
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            step="0.1"
                            className="w-full mt-2 accent-red-500"
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={calculateAffordability}
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:scale-105 transition-transform"
        >
          Calculate Affordability
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
                href={`data:text/csv;charset=utf-8,Category,Amount\n${results.csvData
                  .map((item) => `${item.Category},${item.Amount}`)
                  .join("\n")}`}
                download="affordability_breakdown.csv"
                className="text-red-500 hover:underline"
              >
                Download Affordability Breakdown
              </a>
              {results.tips.length > 0 && (
                <div className="mt-4">
                  <strong className="text-gray-700 dark:text-gray-200">Financial Planning Tips:</strong>
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
