"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    investment: 100000,
    annuityType: "fixed",
    interestRate: 4,
    paymentFrequency: "monthly",
    currentAge: 60,
    gender: "male",
    lifeExpectancy: 80,
    maritalStatus: "single",
    spouseAge: 60,
    payoutType: "lifeOnly",
    periodCertain: 10,
    refundOption: "none",
    cola: 2,
    annuitizationPeriod: 20,
    taxYear: "2025",
    filingStatus: "single",
    otherIncome: 20000,
    state: "none",
    inflationRate: 2,
    discountRate: 3,
    growthRate: 4,
    currency: "USD",
  });
  const [summary, setSummary] = useState([]);
  const [payoutSchedule, setPayoutSchedule] = useState([]);
  const [error, setError] = useState("");
  const [tips, setTips] = useState([]);
  const [showSections, setShowSections] = useState({
    personalDetails: false,
    payoutOptions: false,
    taxDetails: false,
    planningFactors: false,
  });
  const chartRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "investment",
        "interestRate",
        "currentAge",
        "lifeExpectancy",
        "spouseAge",
        "periodCertain",
        "cola",
        "annuitizationPeriod",
        "otherIncome",
        "inflationRate",
        "discountRate",
        "growthRate",
      ].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSliderChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[currency]} ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  };

  const calculateAnnuityPayout = () => {
    setError("");
    setSummary([]);
    setPayoutSchedule([]);
    setTips([]);
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    }

    const {
      investment,
      annuityType,
      interestRate,
      paymentFrequency,
      currentAge,
      gender,
      lifeExpectancy,
      maritalStatus,
      spouseAge,
      payoutType,
      periodCertain,
      refundOption,
      cola,
      annuitizationPeriod,
      taxYear,
      filingStatus,
      otherIncome,
      state,
      inflationRate,
      discountRate,
      growthRate,
      currency,
    } = formData;

    // Validation
    if (
      investment < 0 ||
      interestRate < 0 ||
      currentAge < 18 ||
      currentAge > 100 ||
      lifeExpectancy < currentAge
    ) {
      setError("Investment, interest rate, and ages must be valid");
      return;
    }
    if (spouseAge < 18 || spouseAge > 100 || periodCertain < 0 || annuitizationPeriod < 1) {
      setError("Spouse age, period certain, and annuitization period must be valid");
      return;
    }
    if (otherIncome < 0 || inflationRate < 0 || discountRate < 0 || growthRate < 0 || cola < 0) {
      setError("Financial rates must be non-negative");
      return;
    }
    if (payoutType === "jointLife" && maritalStatus !== "married") {
      setError("Joint life payout requires married status");
      return;
    }

    try {
      // Annuity calculations
      const paymentsPerYear = { monthly: 12, quarterly: 4, annually: 1 }[paymentFrequency];
      const ratePerPeriod = interestRate / 100 / paymentsPerYear;
      let payoutPeriod = annuitizationPeriod;
      if (payoutType === "lifeOnly" || payoutType === "lifeCertain") {
        payoutPeriod = lifeExpectancy - currentAge;
      } else if (payoutType === "jointLife") {
        payoutPeriod = Math.max(lifeExpectancy - currentAge, lifeExpectancy - spouseAge);
      }
      if (payoutType === "lifeCertain") {
        payoutPeriod = Math.max(payoutPeriod, periodCertain);
      }
      const totalPayments = payoutPeriod * paymentsPerYear;

      // Deferred annuity growth
      let effectiveInvestment = investment;
      if (annuityType === "deferred") {
        const deferralYears = Math.max(0, 65 - currentAge);
        effectiveInvestment = investment * Math.pow(1 + growthRate / 100, deferralYears);
      }

      // Payout calculation (present value of annuity)
      let payoutPerPeriod =
        effectiveInvestment * (ratePerPeriod / (1 - Math.pow(1 + ratePerPeriod, -totalPayments)));
      if (payoutType === "jointLife") {
        payoutPerPeriod *= 0.8; // Reduced for joint life
      }
      if (refundOption !== "none") {
        payoutPerPeriod *= 0.9; // Reduced for refund guarantee
      }
      payoutPerPeriod = Math.round(payoutPerPeriod);

      // Annual payout and COLA
      let annualPayout = payoutPerPeriod * paymentsPerYear;
      const basePayout = annualPayout;

      // Exclusion ratio for taxes
      const expectedReturn = annualPayout * payoutPeriod;
      const exclusionRatio = Math.min(1, investment / expectedReturn);
      const taxablePortion = annualPayout * (1 - exclusionRatio);

      // Taxation
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
      let federalTax = 0;
      const taxableIncome = taxablePortion + otherIncome;
      const brackets = federalBrackets[taxYear][filingStatus];
      for (const bracket of brackets) {
        if (taxableIncome > bracket.min) {
          const taxableInBracket = Math.min(taxableIncome, bracket.max || taxableIncome) - bracket.min;
          federalTax += taxableInBracket * bracket.rate;
        }
      }

      // State tax
      let stateTax = 0;
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
      if (state !== "none" && state !== "TX") {
        const stateBracket = stateBrackets[state];
        for (const bracket of stateBracket) {
          if (taxableIncome > bracket.min) {
            const taxableInBracket = Math.min(taxableIncome, bracket.max || taxableIncome) - bracket.min;
            stateTax += taxableInBracket * bracket.rate;
          }
        }
      }
      const totalTax = federalTax + stateTax;
      const netAnnualPayout = annualPayout - totalTax;
      const netPayoutPerPeriod = netAnnualPayout / paymentsPerYear;

      // Total payout and present value
      let totalPayout = 0;
      let presentValue = 0;
      let cumulativePayout = 0;
      let breakEvenYear = 0;
      const newPayoutSchedule = [];
      for (let year = 1; year <= payoutPeriod; year++) {
        const yearPayout = annualPayout * Math.pow(1 + cola / 100, year - 1);
        totalPayout += yearPayout;
        presentValue += yearPayout / Math.pow(1 + discountRate / 100, year);
        cumulativePayout += yearPayout;
        if (cumulativePayout >= investment && breakEvenYear === 0) {
          breakEvenYear = year;
        }
        newPayoutSchedule.push({
          year,
          payout: yearPayout,
          taxable: yearPayout * (1 - exclusionRatio),
          netPayout: yearPayout - yearPayout * (1 - exclusionRatio) * (federalTax / taxableIncome),
        });
      }

      // Future value
      const futureValue = totalPayout / Math.pow(1 + inflationRate / 100, payoutPeriod);

      // Summary table
      setSummary([
        { label: "Initial Investment", value: formatCurrency(investment, currency) },
        { label: "Payout per Period", value: formatCurrency(payoutPerPeriod, currency) },
        { label: "Net Payout per Period", value: formatCurrency(netPayoutPerPeriod, currency) },
        { label: "Taxable Portion", value: formatCurrency(taxablePortion, currency) },
        { label: "Total Payout", value: formatCurrency(totalPayout, currency) },
        { label: "Present Value", value: formatCurrency(presentValue, currency) },
        { label: "Future Value", value: formatCurrency(futureValue, currency) },
        { label: "Break-even Year", value: breakEvenYear },
      ]);

      // Detailed table
      setPayoutSchedule(newPayoutSchedule);

      // Area chart
      if (chartRef.current) {
        chartRef.current.width = 580;
        chartRef.current.height = 200;
        const ctx = chartRef.current.getContext("2d");
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(0, 0, chartRef.current.width, chartRef.current.height);
        const maxPayout = Math.max(...newPayoutSchedule.map((item) => item.payout));
        ctx.beginPath();
        ctx.moveTo(0, chartRef.current.height);
        newPayoutSchedule.forEach((item, i) => {
          const x = (i / (newPayoutSchedule.length - 1)) * chartRef.current.width;
          const y = chartRef.current.height - (item.payout / maxPayout) * (chartRef.current.height - 20);
          ctx.lineTo(x, y);
        });
        ctx.lineTo(chartRef.current.width, chartRef.current.height);
        ctx.fillStyle = "rgba(239, 68, 68, 0.5)";
        ctx.fill();
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Financial planning tips
      const newTips = [];
      if (cola === 0) newTips.push("Consider adding a COLA to protect against inflation.");
      if (payoutType === "lifeOnly")
        newTips.push("Life with period certain or refund options can provide beneficiary protection.");
      if (taxablePortion > 0) newTips.push("Manage other income to reduce taxes on annuity payouts.");
      if (breakEvenYear > 10)
        newTips.push("Evaluate if the annuity aligns with your financial goals based on break-even point.");
      if (annuityType === "variable") newTips.push("Monitor investment performance for variable annuities.");
      setTips(newTips);
    } catch (error) {
      setError("Error calculating annuity payout. Check console for details.");
      console.error("Calculation error:", error);
    }
  };

  const sortTable = (index, isAscending) => {
    const sorted = [...payoutSchedule].sort((a, b) => {
      const aValue = index === 0 ? a.year : a[["payout", "taxable", "netPayout"][index - 1]];
      const bValue = index === 0 ? b.year : b[["payout", "taxable", "netPayout"][index - 1]];
      return isAscending ? aValue - bValue : bValue - aValue;
    });
    setPayoutSchedule(sorted);
  };

  const exportCSV = () => {
    if (payoutSchedule.length === 0) return;
    let csv = "Year,Payout,Taxable Portion,Net Payout\n";
    payoutSchedule.forEach((item) => {
      csv += `${item.year},${item.payout.toFixed(2)},${item.taxable.toFixed(2)},${item.netPayout.toFixed(
        2
      )}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annuity_payout_schedule.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleSection = (section) => {
    setShowSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-xl w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Advanced Annuity Payout Calculator
          </h1>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          <div className="mb-4">
            {[
              { label: "Initial Investment Amount", name: "investment", type: "number", min: 0, step: 1000 },
              { label: "", name: "investment", type: "range", min: 0, max: 1000000, step: 1000 },
              {
                label: "Annuity Type",
                name: "annuityType",
                type: "select",
                options: ["fixed", "variable", "immediate", "deferred"],
              },
              {
                label: "Interest Rate/Expected Return (%)",
                name: "interestRate",
                type: "number",
                min: 0,
                step: 0.1,
              },
              {
                label: "Payment Frequency",
                name: "paymentFrequency",
                type: "select",
                options: ["monthly", "quarterly", "annually"],
              },
            ].map(({ label, name, type, min, max, step, options }, index) => (
              <div key={index} className="mb-3">
                {label && <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>}
                {type === "select" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:border-red-500"
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : type === "range" ? (
                  <input
                    type="range"
                    name={name}
                    value={formData[name]}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => handleSliderChange(name, e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    min={min}
                    max={max}
                    step={step}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:border-red-500"
                  />
                )}
              </div>
            ))}
          </div>
          {[
            {
              title: "Personal Details",
              key: "personalDetails",
              fields: [
                { label: "Current Age", name: "currentAge", type: "number", min: 18, max: 100, step: 1 },
                { label: "Gender", name: "gender", type: "select", options: ["male", "female"] },
                {
                  label: "Life Expectancy (Years)",
                  name: "lifeExpectancy",
                  type: "number",
                  min: 65,
                  step: 1,
                },
                {
                  label: "Marital Status",
                  name: "maritalStatus",
                  type: "select",
                  options: ["single", "married"],
                },
                { label: "Spouse’s Age", name: "spouseAge", type: "number", min: 18, max: 100, step: 1 },
              ],
            },
            {
              title: "Payout Options",
              key: "payoutOptions",
              fields: [
                {
                  label: "Payout Type",
                  name: "payoutType",
                  type: "select",
                  options: ["lifeOnly", "lifeCertain", "jointLife", "fixedPeriod"],
                },
                {
                  label: "Period Certain (Years)",
                  name: "periodCertain",
                  type: "number",
                  min: 0,
                  max: 30,
                  step: 1,
                },
                {
                  label: "Refund Option",
                  name: "refundOption",
                  type: "select",
                  options: ["none", "cash", "installment"],
                },
                {
                  label: "Cost of Living Adjustment (COLA, %)",
                  name: "cola",
                  type: "number",
                  min: 0,
                  step: 0.1,
                },
                {
                  label: "Annuitization Period (Years)",
                  name: "annuitizationPeriod",
                  type: "number",
                  min: 1,
                  step: 1,
                },
              ],
            },
            {
              title: "Tax Details",
              key: "taxDetails",
              fields: [
                { label: "Tax Year", name: "taxYear", type: "select", options: ["2024", "2025"] },
                {
                  label: "Filing Status",
                  name: "filingStatus",
                  type: "select",
                  options: ["single", "marriedJoint", "marriedSeparate", "headHousehold"],
                },
                { label: "Other Annual Income", name: "otherIncome", type: "number", min: 0, step: 100 },
                { label: "State", name: "state", type: "select", options: ["none", "CA", "NY", "TX"] },
              ],
            },
            {
              title: "Planning Factors",
              key: "planningFactors",
              fields: [
                { label: "Inflation Rate (%)", name: "inflationRate", type: "number", min: 0, step: 0.1 },
                { label: "Discount Rate (%)", name: "discountRate", type: "number", min: 0, step: 0.1 },
                {
                  label: "Investment Growth Rate (%)",
                  name: "growthRate",
                  type: "number",
                  min: 0,
                  step: 0.1,
                },
                { label: "Currency", name: "currency", type: "select", options: ["USD", "EUR", "INR"] },
              ],
            },
          ].map(({ title, key, fields }) => (
            <div key={key} className="mb-4">
              <div
                className="bg-red-500 text-white p-3 rounded-lg text-center cursor-pointer hover:bg-red-600"
                onClick={() => toggleSection(key)}
              >
                {title}
              </div>
              {showSections[key] && (
                <div className="mt-2">
                  {fields.map(({ label, name, type, min, max, step, options }, index) => (
                    <div key={index} className="mb-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                      {type === "select" ? (
                        <select
                          name={name}
                          value={formData[name]}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:border-red-500"
                        >
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {name === "currency"
                                ? opt === "USD"
                                  ? "$ USD"
                                  : opt === "EUR"
                                  ? "€ EUR"
                                  : "₹ INR"
                                : name === "payoutType"
                                ? opt.replace(/([A-Z])/g, " $1").trim()
                                : name === "filingStatus"
                                ? opt.replace(/([A-Z])/g, " $1").trim()
                                : opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={type}
                          name={name}
                          value={formData[name]}
                          min={min}
                          max={max}
                          step={step}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:border-red-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={calculateAnnuityPayout}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 w-full mb-4"
          >
            Calculate Annuity Payout
          </button>
          {summary.length > 0 && (
            <table className="w-full text-sm text-gray-600 bg-white rounded-lg overflow-hidden mb-4">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3">Metric</th>
                  <th className="p-3">Value</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((metric, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="p-3">{metric.label}</td>
                    <td className="p-3">{metric.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {payoutSchedule.length > 0 && (
            <div className="max-h-80 overflow-y-auto mb-4">
              <table className="w-full text-sm text-gray-600 bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-red-500 text-white">
                    {["Year", "Payout", "Taxable", "Net Payout"].map((header, index) => (
                      <th
                        key={index}
                        className="p-3 cursor-pointer hover:bg-red-600"
                        onClick={() => sortTable(index, payoutSchedule[0]?.sortOrder !== "asc")}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payoutSchedule.map((item, index) => (
                    <tr key={index} className="even:bg-gray-50">
                      <td className="p-3">{item.year}</td>
                      <td className="p-3">{formatCurrency(item.payout, formData.currency)}</td>
                      <td className="p-3">{formatCurrency(item.taxable, formData.currency)}</td>
                      <td className="p-3">{formatCurrency(item.netPayout, formData.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <canvas ref={chartRef} className="w-full mb-4 border-2 border-gray-200 rounded-lg"></canvas>
          {(payoutSchedule.length > 0 || tips.length > 0) && (
            <div className="text-center">
              {payoutSchedule.length > 0 && (
                <a onClick={exportCSV} className="text-red-500 hover:underline cursor-pointer block mb-4">
                  Download Annuity Payout Schedule
                </a>
              )}
              {tips.length > 0 && (
                <div className="text-sm text-gray-600">
                  <strong>Financial Planning Tips:</strong>
                  <ul className="list-disc list-inside">
                    {tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        input[type="range"] {
          accent-color: #ef4444;
        }
      `}</style>
    </>
  );
}
