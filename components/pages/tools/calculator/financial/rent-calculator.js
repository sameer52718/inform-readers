"use client";

import { useState } from "react";

export default function Home() {
  const [annualIncome, setAnnualIncome] = useState("60000");
  const [employmentStatus, setEmploymentStatus] = useState("fulltime");
  const [monthlyExpenses, setMonthlyExpenses] = useState("1500");
  const [savingsRate, setSavingsRate] = useState("20");
  const [dti, setDti] = useState("30");
  const [movingCosts, setMovingCosts] = useState("1000");
  const [rentBudget, setRentBudget] = useState("1200");
  const [leaseTerm, setLeaseTerm] = useState("12");
  const [utilities, setUtilities] = useState("none");
  const [additionalFees, setAdditionalFees] = useState("50");
  const [insurance, setInsurance] = useState("300");
  const [taxYear, setTaxYear] = useState("2025");
  const [filingStatus, setFilingStatus] = useState("single");
  const [state, setState] = useState("none");
  const [commuteCost, setCommuteCost] = useState("100");
  const [lifestylePriority, setLifestylePriority] = useState("affordability");
  const [inflationRate, setInflationRate] = useState("2");
  const [rentIncrease, setRentIncrease] = useState("3");
  const [currency, setCurrency] = useState("USD");
  const [rentals, setRentals] = useState([
    { rent: "1200", utilities: "none", fees: "50", commuteTime: "20", amenities: "7" },
    { rent: "1400", utilities: "some", fees: "30", commuteTime: "15", amenities: "8" },
    { rent: "1000", utilities: "all", fees: "20", commuteTime: "30", amenities: "6" },
  ]);
  const [summaryMetrics, setSummaryMetrics] = useState([]);
  const [detailedItems, setDetailedItems] = useState([]);
  const [rentalScores, setRentalScores] = useState([]);
  const [tips, setTips] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeSections, setActiveSections] = useState({
    rentalDetails: false,
    taxDetails: false,
    lifestyleFactors: false,
    compareRentals: false,
  });

  const toggleSection = (section) => {
    setActiveSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateRental = (index, field, value) => {
    const newRentals = [...rentals];
    newRentals[index] = { ...newRentals[index], [field]: value };
    setRentals(newRentals);
  };

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[curr]} ${parseFloat(amount || 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  };

  const calculateRent = () => {
    setErrorMessage("");
    setSummaryMetrics([]);
    setDetailedItems([]);
    setRentalScores([]);
    setTips([]);

    const annualIncomeVal = parseFloat(annualIncome) || 0;
    const monthlyExpensesVal = parseFloat(monthlyExpenses) || 0;
    const savingsRateVal = parseFloat(savingsRate) / 100 || 0;
    const dtiVal = parseFloat(dti) / 100 || 0.3;
    const movingCostsVal = parseFloat(movingCosts) || 0;
    const rentBudgetVal = parseFloat(rentBudget) || 0;
    const leaseTermVal = parseInt(leaseTerm) || 12;
    const additionalFeesVal = parseFloat(additionalFees) || 0;
    const insuranceVal = parseFloat(insurance) || 0;
    const commuteCostVal = parseFloat(commuteCost) || 0;
    const inflationRateVal = parseFloat(inflationRate) / 100 || 0;
    const rentIncreaseVal = parseFloat(rentIncrease) / 100 || 0;

    const rentalsData = rentals.map((rental) => ({
      rent: parseFloat(rental.rent) || 0,
      utilities: rental.utilities,
      fees: parseFloat(rental.fees) || 0,
      commuteTime: parseInt(rental.commuteTime) || 0,
      amenities: parseInt(rental.amenities) || 1,
    }));

    // Validation
    if (
      annualIncomeVal < 0 ||
      monthlyExpensesVal < 0 ||
      movingCostsVal < 0 ||
      rentBudgetVal < 0 ||
      leaseTermVal < 1
    ) {
      setErrorMessage("Income, expenses, moving costs, rent, and lease term must be valid.");
      return;
    }
    if (dtiVal < 0 || dtiVal > 1 || savingsRateVal < 0 || savingsRateVal > 1) {
      setErrorMessage("DTI and savings rate must be between 0% and 100%.");
      return;
    }
    if (additionalFeesVal < 0 || insuranceVal < 0 || commuteCostVal < 0) {
      setErrorMessage("Rental details must be non-negative.");
      return;
    }
    if (inflationRateVal < 0 || rentIncreaseVal < 0) {
      setErrorMessage("Economic factors must be non-negative.");
      return;
    }
    for (let i = 0; i < rentalsData.length; i++) {
      if (
        rentalsData[i].rent < 0 ||
        rentalsData[i].fees < 0 ||
        rentalsData[i].commuteTime < 0 ||
        rentalsData[i].amenities < 1 ||
        rentalsData[i].amenities > 10
      ) {
        setErrorMessage(`Invalid data for Rental Option ${i + 1}.`);
        return;
      }
    }

    // Tax calculations
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

    const taxableIncome = Math.max(0, annualIncomeVal - standardDeductions[taxYear][filingStatus]);
    let federalTax = 0;
    const brackets = federalBrackets[taxYear][filingStatus];
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max || taxableIncome) - bracket.min;
        federalTax += taxableInBracket * bracket.rate;
      }
    }
    const socialSecurityCap = 168600;
    const socialSecurity = Math.min(annualIncomeVal, socialSecurityCap) * 0.062;
    const medicare = annualIncomeVal * 0.0145;
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
    const netIncome = annualIncomeVal - totalTax;
    const effectiveTaxRate = annualIncomeVal > 0 ? (totalTax / annualIncomeVal) * 100 : 0;

    // Affordability calculations
    const monthlyNetIncome = netIncome / 12;
    const monthlySavings = monthlyNetIncome * savingsRateVal;
    const maxHousingPayment = Math.min(
      monthlyNetIncome * dtiVal,
      monthlyNetIncome - monthlyExpensesVal - monthlySavings
    );
    const utilityCosts = { all: 0, some: 150, none: 360 };
    const monthlyHousingCost =
      rentBudgetVal + utilityCosts[utilities] + additionalFeesVal + insuranceVal / 12 + commuteCostVal;
    const affordableRent =
      maxHousingPayment - (utilityCosts[utilities] + additionalFeesVal + insuranceVal / 12 + commuteCostVal);
    const surplus = monthlyNetIncome - monthlyExpensesVal - monthlySavings - monthlyHousingCost;

    // Total lease cost with rent increases
    let totalLeaseCost = 0;
    let currentRent = rentBudgetVal;
    for (let year = 0; year < Math.ceil(leaseTermVal / 12); year++) {
      const monthsInYear = Math.min(12, leaseTermVal - year * 12);
      totalLeaseCost +=
        (currentRent + utilityCosts[utilities] + additionalFeesVal + insuranceVal / 12 + commuteCostVal) *
        monthsInYear;
      currentRent *= 1 + rentIncreaseVal;
    }
    const inflationAdjustedCost = totalLeaseCost / Math.pow(1 + inflationRateVal, leaseTermVal / 12);
    const breakEvenMonths = movingCostsVal / (affordableRent - rentBudgetVal) || Infinity;

    // Rental comparison
    const weights = {
      affordability: lifestylePriority === "affordability" ? 0.6 : 0.4,
      amenities: lifestylePriority === "amenities" ? 0.5 : 0.3,
      location: lifestylePriority === "location" ? 0.5 : 0.3,
    };
    const maxCommuteTime = Math.max(...rentalsData.map((r) => r.commuteTime), 1);
    const newRentalScores = rentalsData
      .map((rental, i) => {
        if (rental.rent === 0) return null;
        const affordabilityScore =
          (affordableRent / (rental.rent + utilityCosts[rental.utilities] + rental.fees)) * 100;
        const amenitiesScore = (rental.amenities / 10) * 100;
        const locationScore = (1 - rental.commuteTime / maxCommuteTime) * 100;
        const totalCost =
          rental.rent + utilityCosts[rental.utilities] + rental.fees + insuranceVal / 12 + commuteCostVal;
        const score =
          affordabilityScore * weights.affordability +
          amenitiesScore * weights.amenities +
          locationScore * weights.location;
        return { index: i + 1, score, totalCost };
      })
      .filter((r) => r);

    // Summary table
    const newSummaryMetrics = [
      { label: "Affordable Rent", value: formatCurrency(affordableRent) },
      { label: "Total Monthly Housing Cost", value: formatCurrency(monthlyHousingCost) },
      { label: "Net Monthly Income", value: formatCurrency(monthlyNetIncome) },
      { label: "Monthly Surplus", value: formatCurrency(surplus) },
      { label: "Total Lease Cost", value: formatCurrency(totalLeaseCost) },
      { label: "Inflation-Adjusted Cost", value: formatCurrency(inflationAdjustedCost) },
      { label: "Effective Tax Rate", value: `${effectiveTaxRate.toFixed(2)}%` },
      {
        label: "Break-even Months",
        value: breakEvenMonths === Infinity ? "N/A" : breakEvenMonths.toFixed(1),
      },
    ];
    setSummaryMetrics(newSummaryMetrics);

    // Detailed table
    const newDetailedItems = [
      { category: "Annual Income", amount: annualIncomeVal },
      { category: "Federal Tax", amount: -federalTax },
      { category: "Social Security", amount: -socialSecurity },
      { category: "Medicare", amount: -medicare },
      { category: "State Tax", amount: -stateTax },
      { category: "Monthly Expenses", amount: -monthlyExpensesVal * 12 },
      { category: "Rent", amount: -rentBudgetVal * 12 },
      { category: "Utilities", amount: -utilityCosts[utilities] * 12 },
      { category: "Additional Fees", amount: -additionalFeesVal * 12 },
      { category: "Renter’s Insurance", amount: -insuranceVal },
      { category: "Commute Cost", amount: -commuteCostVal * 12 },
    ].filter((item) => item.amount !== 0);
    setDetailedItems(newDetailedItems);

    // Comparison table
    setRentalScores(newRentalScores);

    // Financial planning tips
    const newTips = [];
    if (surplus < 0) newTips.push("Reduce expenses or choose a lower rent to stay within budget.");
    if (rentBudgetVal > affordableRent)
      newTips.push(
        "Your rent budget exceeds affordability; consider negotiating or finding cheaper options."
      );
    if (utilityCosts[utilities] > 0) newTips.push("Ask if utilities can be included to reduce costs.");
    if (newRentalScores.length > 0 && newRentalScores[0].score < 80)
      newTips.push("Explore rentals with better affordability or amenities.");
    setTips(newTips);

    // CSV download
    let csv = "Category,Amount\n";
    newDetailedItems.forEach((item) => {
      csv += `${item.category},${item.amount.toFixed(2)}\n`;
    });
    csv += "\nRental,Score,Total Monthly Cost\n";
    newRentalScores.forEach((rental) => {
      csv += `Rental ${rental.index},${rental.score.toFixed(1)},${rental.totalCost.toFixed(2)}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const dataUrl = URL.createObjectURL(blob);

    setSummaryMetrics((prev) => [
      ...prev,
      {
        label: "Download Rent Breakdown",
        value: (
          <a href={dataUrl} download="rent_breakdown.csv" className="text-red-500 hover:underline">
            Download CSV
          </a>
        ),
      },
    ]);

    alert("Chart rendering not implemented in this demo.");
  };

  const handleSort = (table, index) => {
    const isSummary = table === "summary";
    const isDetailed = table === "detailed";
    const isComparison = table === "comparison";
    const data = isSummary ? [...summaryMetrics] : isDetailed ? [...detailedItems] : [...rentalScores];
    const isAscending = !data[0]?.sortOrder || data[0].sortOrder === "desc";
    data.sort((a, b) => {
      let aValue = isSummary
        ? typeof a.value === "string"
          ? a.value
          : a.value.toString()
        : isDetailed
        ? a.amount
        : a[index === 0 ? "index" : index === 1 ? "score" : "totalCost"];
      let bValue = isSummary
        ? typeof b.value === "string"
          ? b.value
          : b.value.toString()
        : isDetailed
        ? b.amount
        : b[index === 0 ? "index" : index === 1 ? "score" : "totalCost"];
      if (isDetailed || (isComparison && index !== 0)) {
        aValue = parseFloat(aValue.toString().replace(/[^0-9.-]+/g, "")) || 0;
        bValue = parseFloat(bValue.toString().replace(/[^0-9.-]+/g, "")) || 0;
        return isAscending ? aValue - bValue : bValue - aValue;
      }
      return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    data.forEach((item) => (item.sortOrder = isAscending ? "asc" : "desc"));
    if (isSummary) setSummaryMetrics(data);
    else if (isDetailed) setDetailedItems(data);
    else setRentalScores(data);
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-start">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-3xl w-full animate-slide-in">
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Advanced Rent Calculator</h1>
        {errorMessage && <div className="text-red-500 text-sm mb-4 text-center">{errorMessage}</div>}
        <div className="space-y-4">
          <div className="input-group">
            {[
              {
                label: "Annual Household Income",
                id: "annualIncome",
                value: annualIncome,
                setter: setAnnualIncome,
                type: "number",
                min: "0",
                step: "100",
              },
              {
                label: "Employment Status",
                id: "employmentStatus",
                value: employmentStatus,
                setter: setEmploymentStatus,
                type: "select",
                options: [
                  { value: "fulltime", label: "Full-time" },
                  { value: "parttime", label: "Part-time" },
                  { value: "selfemployed", label: "Self-employed" },
                ],
              },
              {
                label: "Monthly Expenses",
                id: "monthlyExpenses",
                value: monthlyExpenses,
                setter: setMonthlyExpenses,
                type: "number",
                min: "0",
                step: "10",
              },
              {
                label: "Savings Rate (% of Net Income)",
                id: "savingsRate",
                value: savingsRate,
                setter: setSavingsRate,
                type: "number",
                min: "0",
                max: "100",
                step: "0.1",
              },
              {
                label: "Target Debt-to-Income Ratio (%)",
                id: "dti",
                value: dti,
                setter: setDti,
                type: "number",
                min: "0",
                max: "100",
                step: "0.1",
              },
              {
                label: "Moving Costs",
                id: "movingCosts",
                value: movingCosts,
                setter: setMovingCosts,
                type: "number",
                min: "0",
                step: "10",
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
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                )}
              </div>
            ))}
          </div>
          <div
            className="collapsible bg-red-500 text-white rounded-lg p-3 text-center cursor-pointer hover:bg-red-600"
            onClick={() => toggleSection("rentalDetails")}
          >
            Rental Details
          </div>
          {activeSections.rentalDetails && (
            <div className="collapse-content space-y-4">
              {[
                {
                  label: "Desired Rent Budget",
                  id: "rentBudget",
                  value: rentBudget,
                  setter: setRentBudget,
                  type: "number",
                  min: "0",
                  step: "10",
                },
                {
                  label: "Lease Term (Months)",
                  id: "leaseTerm",
                  value: leaseTerm,
                  setter: setLeaseTerm,
                  type: "number",
                  min: "1",
                  step: "1",
                },
                {
                  label: "Utilities Included",
                  id: "utilities",
                  value: utilities,
                  setter: setUtilities,
                  type: "select",
                  options: [
                    { value: "all", label: "All (Water, Electricity, Gas, Internet)" },
                    { value: "some", label: "Some" },
                    { value: "none", label: "None" },
                  ],
                },
                {
                  label: "Additional Fees (Monthly)",
                  id: "additionalFees",
                  value: additionalFees,
                  setter: setAdditionalFees,
                  type: "number",
                  min: "0",
                  step: "10",
                },
                {
                  label: "Renter’s Insurance (Annual)",
                  id: "insurance",
                  value: insurance,
                  setter: setInsurance,
                  type: "number",
                  min: "0",
                  step: "10",
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
                      min={field.min}
                      step={field.step}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <div
            className="collapsible bg-red-500 text-white rounded-lg p-3 text-center cursor-pointer hover:bg-red-600"
            onClick={() => toggleSection("taxDetails")}
          >
            Tax Details
          </div>
          {activeSections.taxDetails && (
            <div className="collapse-content space-y-4">
              {[
                {
                  label: "Tax Year",
                  id: "taxYear",
                  value: taxYear,
                  setter: setTaxYear,
                  type: "select",
                  options: [
                    { value: "2024", label: "2024" },
                    { value: "2025", label: "2025" },
                  ],
                },
                {
                  label: "Filing Status",
                  id: "filingStatus",
                  value: filingStatus,
                  setter: setFilingStatus,
                  type: "select",
                  options: [
                    { value: "single", label: "Single" },
                    { value: "marriedJoint", label: "Married Filing Jointly" },
                    { value: "marriedSeparate", label: "Married Filing Separately" },
                    { value: "headHousehold", label: "Head of Household" },
                  ],
                },
                {
                  label: "State",
                  id: "state",
                  value: state,
                  setter: setState,
                  type: "select",
                  options: [
                    { value: "none", label: "No State Tax" },
                    { value: "CA", label: "California" },
                    { value: "NY", label: "New York" },
                    { value: "TX", label: "Texas" },
                  ],
                },
              ].map((field) => (
                <div key={field.id} className="mb-4">
                  <label htmlFor={field.id} className="block text-sm font-bold text-gray-600 mb-2">
                    {field.label}
                  </label>
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
                </div>
              ))}
            </div>
          )}
          <div
            className="collapsible bg-red-500 text-white rounded-lg p-3 text-center cursor-pointer hover:bg-red-600"
            onClick={() => toggleSection("lifestyleFactors")}
          >
            Lifestyle Factors
          </div>
          {activeSections.lifestyleFactors && (
            <div className="collapse-content space-y-4">
              {[
                {
                  label: "Commute Cost (Monthly)",
                  id: "commuteCost",
                  value: commuteCost,
                  setter: setCommuteCost,
                  type: "number",
                  min: "0",
                  step: "10",
                },
                {
                  label: "Lifestyle Priority",
                  id: "lifestylePriority",
                  value: lifestylePriority,
                  setter: setLifestylePriority,
                  type: "select",
                  options: [
                    { value: "affordability", label: "Affordability" },
                    { value: "amenities", label: "Amenities" },
                    { value: "location", label: "Location" },
                  ],
                },
                {
                  label: "Inflation Rate (%)",
                  id: "inflationRate",
                  value: inflationRate,
                  setter: setInflationRate,
                  type: "number",
                  min: "0",
                  step: "0.1",
                },
                {
                  label: "Annual Rent Increase (%)",
                  id: "rentIncrease",
                  value: rentIncrease,
                  setter: setRentIncrease,
                  type: "number",
                  min: "0",
                  step: "0.1",
                },
                {
                  label: "Currency",
                  id: "currency",
                  value: currency,
                  setter: setCurrency,
                  type: "select",
                  options: [
                    { value: "USD", label: "$ USD" },
                    { value: "EUR", label: "€ EUR" },
                    { value: "INR", label: "₹ INR" },
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
                      min={field.min}
                      step={field.step}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <div
            className="collapsible bg-red-500 text-white rounded-lg p-3 text-center cursor-pointer hover:bg-red-600"
            onClick={() => toggleSection("compareRentals")}
          >
            Compare Rentals (Up to 3)
          </div>
          {activeSections.compareRentals && (
            <div className="collapse-content space-y-4">
              {rentals.map((rental, index) => (
                <div key={index} className="rental-option border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-gray-600 mb-2">Rental Option {index + 1}</h3>
                  {[
                    {
                      label: "Rent",
                      id: `rent${index}`,
                      value: rental.rent,
                      setter: (value) => updateRental(index, "rent", value),
                      type: "number",
                      min: "0",
                      step: "10",
                    },
                    {
                      label: "Utilities Included",
                      id: `utilities${index}`,
                      value: rental.utilities,
                      setter: (value) => updateRental(index, "utilities", value),
                      type: "select",
                      options: [
                        { value: "all", label: "All" },
                        { value: "some", label: "Some" },
                        { value: "none", label: "None" },
                      ],
                    },
                    {
                      label: "Additional Fees (Monthly)",
                      id: `fees${index}`,
                      value: rental.fees,
                      setter: (value) => updateRental(index, "fees", value),
                      type: "number",
                      min: "0",
                      step: "10",
                    },
                    {
                      label: "Commute Time (Minutes)",
                      id: `commuteTime${index}`,
                      value: rental.commuteTime,
                      setter: (value) => updateRental(index, "commuteTime", value),
                      type: "number",
                      min: "0",
                      step: "1",
                    },
                    {
                      label: "Amenities Score (1-10)",
                      id: `amenities${index}`,
                      value: rental.amenities,
                      setter: (value) => updateRental(index, "amenities", value),
                      type: "number",
                      min: "1",
                      max: "10",
                      step: "1",
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
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={calculateRent}
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Calculate Rent
          </button>
          {summaryMetrics.length > 0 && (
            <div className="mt-6">
              <table className="w-full border-collapse bg-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th
                      className="p-2 bg-red-500 text-white cursor-pointer"
                      onClick={() => handleSort("summary", 0)}
                    >
                      Metric
                    </th>
                    <th
                      className="p-2 bg-red-500 text-white cursor-pointer"
                      onClick={() => handleSort("summary", 1)}
                    >
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summaryMetrics.map((metric, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="p-2">{metric.label}</td>
                      <td className="p-2">{metric.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {detailedItems.length > 0 && (
            <div className="mt-6 max-h-80 overflow-y-auto">
              <table className="w-full border-collapse bg-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th
                      className="p-2 bg-red-500 text-white cursor-pointer"
                      onClick={() => handleSort("detailed", 0)}
                    >
                      Category
                    </th>
                    <th
                      className="p-2 bg-red-500 text-white cursor-pointer"
                      onClick={() => handleSort("detailed", 1)}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detailedItems.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="p-2">{item.category}</td>
                      <td className="p-2">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {rentalScores.length > 0 && (
            <div className="mt-6 max-h-80 overflow-y-auto">
              <table className="w-full border-collapse bg-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th
                      className="p-2 bg-red-500 text-white cursor-pointer"
                      onClick={() => handleSort("comparison", 0)}
                    >
                      Rental
                    </th>
                    <th
                      className="p-2 bg-red-500 text-white cursor-pointer"
                      onClick={() => handleSort("comparison", 1)}
                    >
                      Score
                    </th>
                    <th
                      className="p-2 bg-red-500 text-white cursor-pointer"
                      onClick={() => handleSort("comparison", 2)}
                    >
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rentalScores.map((rental, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="p-2">Rental {rental.index}</td>
                      <td className="p-2">{rental.score.toFixed(1)}</td>
                      <td className="p-2">{formatCurrency(rental.totalCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tips.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-700">Financial Planning Tips:</h3>
              <ul className="list-disc pl-5 text-gray-600">
                {tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        input:focus,
        select:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
        }
        .collapsible:hover {
          transform: scale(1.02);
        }
        .collapse-content {
          display: ${activeSections.rentalDetails ||
          activeSections.taxDetails ||
          activeSections.lifestyleFactors ||
          activeSections.compareRentals
            ? "block"
            : "none"};
        }
        .collapse-content.active {
          display: block;
        }
        @media (max-width: 640px) {
          .tool-container {
            padding: 1rem;
          }
          .text-2xl {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
