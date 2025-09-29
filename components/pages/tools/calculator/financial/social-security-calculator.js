"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [currentAge, setCurrentAge] = useState("50");
  const [currentAgeSlider, setCurrentAgeSlider] = useState("50");
  const [gender, setGender] = useState("male");
  const [maritalStatus, setMaritalStatus] = useState("single");
  const [aime, setAime] = useState("5000");
  const [currentEarnings, setCurrentEarnings] = useState("60000");
  const [yearsWorked, setYearsWorked] = useState("30");
  const [retirementAge, setRetirementAge] = useState("67");
  const [retirementAgeSlider, setRetirementAgeSlider] = useState("67");
  const [fra, setFra] = useState("67");
  const [spousalBenefit, setSpousalBenefit] = useState("no");
  const [spousePia, setSpousePia] = useState("0");
  const [survivorBenefit, setSurvivorBenefit] = useState("no");
  const [taxYear, setTaxYear] = useState("2025");
  const [filingStatus, setFilingStatus] = useState("single");
  const [otherIncome, setOtherIncome] = useState("20000");
  const [state, setState] = useState("none");
  const [inflationRate, setInflationRate] = useState("2");
  const [earningsGrowth, setEarningsGrowth] = useState("3");
  const [lifeExpectancy, setLifeExpectancy] = useState("80");
  const [discountRate, setDiscountRate] = useState("3");
  const [currency, setCurrency] = useState("USD");
  const [collapsibleStates, setCollapsibleStates] = useState({
    earningsDetails: false,
    retirementDetails: false,
    taxDetails: false,
    planningFactors: false,
  });
  const [summaryData, setSummaryData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [result, setResult] = useState({ csvLink: null, tips: [] });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[curr]} ${parseFloat(amount || 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  };

  const toggleCollapsible = (section) => {
    setCollapsibleStates((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSort = (index) => {
    const data = [...detailedData];
    const isAscending = !data[0]?.sortOrder || data[0].sortOrder === "desc";
    data.sort((a, b) => {
      const aValue = index === 1 ? a.amount : a.category;
      const bValue = index === 1 ? b.amount : b.category;
      if (index === 1) {
        const aNum = parseFloat(aValue) || 0;
        const bNum = parseFloat(bValue) || 0;
        return isAscending ? aNum - bNum : bNum - aNum;
      }
      return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    data.forEach((item) => (item.sortOrder = isAscending ? "asc" : "desc"));
    setDetailedData(data);
  };

  const calculateSocialSecurity = () => {
    setError("");
    setStatus("");
    setSummaryData([]);
    setDetailedData([]);
    setResult({ csvLink: null, tips: [] });

    const inputValues = {
      currentAge: parseInt(currentAge) || 0,
      gender,
      maritalStatus,
      aime: parseFloat(aime) || 0,
      currentEarnings: parseFloat(currentEarnings) || 0,
      yearsWorked: parseInt(yearsWorked) || 0,
      retirementAge: parseFloat(retirementAge) || 62,
      fra: parseFloat(fra) || 67,
      spousalBenefit: spousalBenefit === "yes",
      spousePia: parseFloat(spousePia) || 0,
      survivorBenefit: survivorBenefit === "yes",
      taxYear,
      filingStatus,
      otherIncome: parseFloat(otherIncome) || 0,
      state,
      inflationRate: parseFloat(inflationRate) / 100 || 0,
      earningsGrowth: parseFloat(earningsGrowth) / 100 || 0,
      lifeExpectancy: parseInt(lifeExpectancy) || 80,
      discountRate: parseFloat(discountRate) / 100 || 0,
      currency,
    };

    if (
      inputValues.currentAge < 18 ||
      inputValues.currentAge > 100 ||
      inputValues.retirementAge < 62 ||
      inputValues.retirementAge > 70 ||
      inputValues.fra < 66 ||
      inputValues.fra > 67
    ) {
      setError("Age inputs must be valid (Current: 18-100, Retirement: 62-70, FRA: 66-67)");
      return;
    }
    if (
      inputValues.aime < 0 ||
      inputValues.currentEarnings < 0 ||
      inputValues.yearsWorked < 0 ||
      inputValues.yearsWorked > 35 ||
      inputValues.spousePia < 0
    ) {
      setError("Earnings and years worked must be valid");
      return;
    }
    if (
      inputValues.otherIncome < 0 ||
      inputValues.inflationRate < 0 ||
      inputValues.earningsGrowth < 0 ||
      inputValues.lifeExpectancy < inputValues.currentAge
    ) {
      setError("Financial inputs must be valid");
      return;
    }
    if (inputValues.retirementAge <= inputValues.currentAge) {
      setError("Retirement age must be greater than current age");
      return;
    }

    try {
      const bendPoints = { first: 1231, second: 7427 };
      const bendRates = [0.9, 0.32, 0.15];
      const maxTaxableEarnings = 176100;
      const earningsTest = {
        beforeFRA: { limit: 22800, reduction: 0.5 },
        yearOfFRA: { limit: 60480, reduction: 0.333 },
      };

      let pia = 0;
      if (inputValues.aime <= bendPoints.first) {
        pia = inputValues.aime * bendRates[0];
      } else if (inputValues.aime <= bendPoints.second) {
        pia = bendPoints.first * bendRates[0] + (inputValues.aime - bendPoints.first) * bendRates[1];
      } else {
        pia =
          bendPoints.first * bendRates[0] +
          (bendPoints.second - bendPoints.first) * bendRates[1] +
          (inputValues.aime - bendPoints.second) * bendRates[2];
      }
      pia = Math.round(pia);

      const monthsEarly = Math.max(0, (inputValues.fra - inputValues.retirementAge) * 12);
      const monthsDelayed = Math.max(0, (inputValues.retirementAge - inputValues.fra) * 12);
      let monthlyBenefit = pia;
      if (monthsEarly > 0) {
        const reduction =
          monthsEarly <= 36
            ? (monthsEarly * 5) / 9 / 100
            : ((36 * 5) / 9 + ((monthsEarly - 36) * 5) / 12) / 100;
        monthlyBenefit *= 1 - reduction;
      } else if (monthsDelayed > 0) {
        const increase = (monthsDelayed * 8) / 12 / 100;
        monthlyBenefit *= 1 + increase;
      }
      monthlyBenefit = Math.round(monthlyBenefit);

      let spousalMonthly = 0,
        survivorMonthly = 0;
      if (inputValues.spousalBenefit && inputValues.spousePia > 0) {
        spousalMonthly = Math.min(inputValues.spousePia * 0.5, monthlyBenefit);
        monthlyBenefit = Math.max(monthlyBenefit, spousalMonthly);
      }
      if (inputValues.survivorBenefit && inputValues.spousePia > 0) {
        survivorMonthly = inputValues.spousePia;
      }
      const totalMonthlyBenefit = monthlyBenefit + (survivorMonthly > 0 ? survivorMonthly : 0);

      let earningsReduction = 0;
      if (inputValues.currentAge < inputValues.fra && inputValues.currentEarnings > 0) {
        const limit =
          inputValues.currentAge < inputValues.fra
            ? earningsTest.beforeFRA.limit
            : earningsTest.yearOfFRA.limit;
        const reductionRate =
          inputValues.currentAge < inputValues.fra
            ? earningsTest.beforeFRA.reduction
            : earningsTest.yearOfFRA.reduction;
        if (inputValues.currentEarnings > limit) {
          earningsReduction = Math.min(
            monthlyBenefit,
            ((inputValues.currentEarnings - limit) * reductionRate) / 12
          );
        }
      }
      const adjustedMonthlyBenefit = Math.max(0, totalMonthlyBenefit - earningsReduction);

      const annualBenefit = adjustedMonthlyBenefit * 12;
      const combinedIncome = inputValues.otherIncome + annualBenefit * 0.5;
      let taxableBenefit = 0;
      if (inputValues.filingStatus === "marriedJoint") {
        if (combinedIncome > 44000) {
          taxableBenefit = Math.min(
            annualBenefit * 0.85,
            (combinedIncome - 44000) * 0.85 + Math.min(12000, annualBenefit * 0.5)
          );
        } else if (combinedIncome > 32000) {
          taxableBenefit = Math.min(annualBenefit * 0.5, (combinedIncome - 32000) * 0.5);
        }
      } else {
        if (combinedIncome > 34000) {
          taxableBenefit = Math.min(
            annualBenefit * 0.85,
            (combinedIncome - 34000) * 0.85 + Math.min(9000, annualBenefit * 0.5)
          );
        } else if (combinedIncome > 25000) {
          taxableBenefit = Math.min(annualBenefit * 0.5, (combinedIncome - 25000) * 0.5);
        }
      }

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
      const taxableIncome = taxableBenefit + inputValues.otherIncome;
      const brackets = federalBrackets[inputValues.taxYear][inputValues.filingStatus];
      for (const bracket of brackets) {
        if (taxableIncome > bracket.min) {
          const taxableInBracket = Math.min(taxableIncome, bracket.max || taxableIncome) - bracket.min;
          federalTax += taxableInBracket * bracket.rate;
        }
      }

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
      if (inputValues.state !== "none" && inputValues.state !== "TX") {
        const stateBracket = stateBrackets[inputValues.state];
        for (const bracket of stateBracket) {
          if (taxableIncome > bracket.min) {
            const taxableInBracket = Math.min(taxableIncome, bracket.max || taxableIncome) - bracket.min;
            stateTax += taxableInBracket * bracket.rate;
          }
        }
      }
      const totalTax = federalTax + stateTax;
      const netAnnualBenefit = annualBenefit - totalTax;
      const netMonthlyBenefit = netAnnualBenefit / 12;

      const benefitYears = inputValues.lifeExpectancy - inputValues.retirementAge;
      let lifetimeBenefit = 0;
      let presentValue = 0;
      let currentBenefit = adjustedMonthlyBenefit;
      for (let year = 0; year < benefitYears; year++) {
        lifetimeBenefit += currentBenefit * 12;
        presentValue += (currentBenefit * 12) / Math.pow(1 + inputValues.discountRate, year + 1);
        currentBenefit *= 1 + inputValues.inflationRate;
      }

      const earlyPia = pia * (1 - ((inputValues.fra - 62) * 5) / 9 / 100);
      const delayedPia = pia * (1 + ((70 - inputValues.fra) * 8) / 12 / 100);
      const earlyAnnual = earlyPia * 12;
      const delayedAnnual = delayedPia * 12;
      const breakEvenAge = Math.round((earlyAnnual * (70 - 62)) / (delayedAnnual - earlyAnnual) + 62);

      const newSummaryData = [
        { label: "Primary Insurance Amount (PIA)", value: formatCurrency(pia) },
        { label: "Monthly Benefit", value: formatCurrency(adjustedMonthlyBenefit) },
        { label: "Net Monthly Benefit", value: formatCurrency(netMonthlyBenefit) },
        { label: "Taxable Benefit", value: formatCurrency(taxableBenefit) },
        { label: "Lifetime Benefit", value: formatCurrency(lifetimeBenefit) },
        { label: "Present Value", value: formatCurrency(presentValue) },
        { label: "Break-even Age", value: breakEvenAge },
        { label: "Earnings Test Reduction", value: formatCurrency(earningsReduction) },
      ];

      const newDetailedData = [
        { category: "AIME", amount: inputValues.aime },
        { category: "PIA", amount: pia },
        { category: "Monthly Benefit", amount: monthlyBenefit },
        { category: "Spousal Benefit", amount: spousalMonthly },
        { category: "Survivor Benefit", amount: survivorMonthly },
        { category: "Earnings Test Reduction", amount: -earningsReduction },
        { category: "Taxable Benefit", amount: taxableBenefit },
        { category: "Federal Tax", amount: -federalTax },
        { category: "State Tax", amount: -stateTax },
        { category: "Net Annual Benefit", amount: netAnnualBenefit },
      ].filter((item) => item.amount !== 0);

      const ages = [62, 63, 64, 65, 66, 67, 68, 69, 70];
      const benefits = ages.map((age) => {
        const months = (inputValues.fra - age) * 12;
        let benefit = pia;
        if (months > 0) {
          const reduction =
            months <= 36 ? (months * 5) / 9 / 100 : ((36 * 5) / 9 + ((months - 36) * 5) / 12) / 100;
          benefit *= 1 - reduction;
        } else if (months < 0) {
          const increase = (-months * 8) / 12 / 100;
          benefit *= 1 + increase;
        }
        return Math.round(benefit);
      });

      const csv = [
        "Category,Amount",
        ...newDetailedData.map((item) => `${item.category},${item.amount.toFixed(2)}`),
        "",
        "Retirement Age,Monthly Benefit",
        ...ages.map((age, i) => `${age},${benefits[i].toFixed(2)}`),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const csvLink = URL.createObjectURL(blob);

      const tips = [];
      if (inputValues.retirementAge < inputValues.fra)
        tips.push("Delaying benefits until FRA or age 70 increases monthly payments.");
      if (inputValues.spousalBenefit && inputValues.spousePia > pia)
        tips.push("Consider claiming spousal benefits for higher payments.");
      if (taxableBenefit > 0) tips.push("Manage other income to reduce taxable Social Security benefits.");
      if (earningsReduction > 0) tips.push("Reduce earnings before FRA to avoid benefit reductions.");
      if (breakEvenAge < inputValues.lifeExpectancy)
        tips.push("Delaying benefits may maximize lifetime benefits.");

      setSummaryData(newSummaryData);
      setDetailedData(newDetailedData);
      setResult({ csvLink, tips });

      alert("Chart rendering not implemented in this demo.");
    } catch (error) {
      setError("Error calculating Social Security. Check console for details.");
      console.error("Calculation error:", error);
    }
  };

  useEffect(() => {
    setCurrentAgeSlider(currentAge);
    setRetirementAgeSlider(retirementAge);
  }, [currentAge, retirementAge]);

  return (
    <div className="bg-white  p-4 flex justify-center items-start">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-xl w-full">
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">
          Advanced Social Security Calculator
        </h1>
        <div className="space-y-4">
          <div className="input-group">
            {[
              {
                label: "Current Age",
                id: "currentAge",
                value: currentAge,
                setter: setCurrentAge,
                type: "number",
                min: "18",
                max: "100",
                step: "1",
              },
              {
                label: "",
                id: "currentAgeSlider",
                value: currentAgeSlider,
                setter: setCurrentAgeSlider,
                type: "range",
                min: "18",
                max: "100",
                step: "1",
              },
              {
                label: "Gender",
                id: "gender",
                value: gender,
                setter: setGender,
                type: "select",
                options: [
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ],
              },
              {
                label: "Marital Status",
                id: "maritalStatus",
                value: maritalStatus,
                setter: setMaritalStatus,
                type: "select",
                options: [
                  { value: "single", label: "Single" },
                  { value: "married", label: "Married" },
                  { value: "divorced", label: "Divorced" },
                  { value: "widowed", label: "Widowed" },
                ],
              },
            ].map((field) => (
              <div key={field.id} className="mb-4">
                {field.label && (
                  <label htmlFor={field.id} className="block text-sm font-bold text-gray-600 mb-2">
                    {field.label}
                  </label>
                )}
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
                    onChange={(e) => {
                      field.setter(e.target.value);
                      if (field.id === "currentAge") setCurrentAgeSlider(e.target.value);
                      if (field.id === "currentAgeSlider") setCurrentAge(e.target.value);
                    }}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                )}
              </div>
            ))}
          </div>
          {[
            {
              title: "Earnings Details",
              key: "earningsDetails",
              fields: [
                {
                  label: "Average Indexed Monthly Earnings (AIME)",
                  id: "aime",
                  value: aime,
                  setter: setAime,
                  type: "number",
                  min: "0",
                  step: "100",
                },
                {
                  label: "Current Annual Earnings",
                  id: "currentEarnings",
                  value: currentEarnings,
                  setter: setCurrentEarnings,
                  type: "number",
                  min: "0",
                  step: "100",
                },
                {
                  label: "Years Worked",
                  id: "yearsWorked",
                  value: yearsWorked,
                  setter: setYearsWorked,
                  type: "number",
                  min: "0",
                  max: "35",
                  step: "1",
                },
              ],
            },
            {
              title: "Retirement Details",
              key: "retirementDetails",
              fields: [
                {
                  label: "Planned Retirement Age",
                  id: "retirementAge",
                  value: retirementAge,
                  setter: setRetirementAge,
                  type: "number",
                  min: "62",
                  max: "70",
                  step: "0.1",
                },
                {
                  label: "",
                  id: "retirementAgeSlider",
                  value: retirementAgeSlider,
                  setter: setRetirementAgeSlider,
                  type: "range",
                  min: "62",
                  max: "70",
                  step: "0.1",
                },
                {
                  label: "Full Retirement Age (FRA)",
                  id: "fra",
                  value: fra,
                  setter: setFra,
                  type: "number",
                  min: "66",
                  max: "67",
                  step: "0.1",
                },
                {
                  label: "Spousal Benefit Eligibility",
                  id: "spousalBenefit",
                  value: spousalBenefit,
                  setter: setSpousalBenefit,
                  type: "select",
                  options: [
                    { value: "no", label: "No" },
                    { value: "yes", label: "Yes" },
                  ],
                },
                {
                  label: "Spouse’s Primary Insurance Amount (PIA)",
                  id: "spousePia",
                  value: spousePia,
                  setter: setSpousePia,
                  type: "number",
                  min: "0",
                  step: "10",
                },
                {
                  label: "Survivor Benefit Eligibility",
                  id: "survivorBenefit",
                  value: survivorBenefit,
                  setter: setSurvivorBenefit,
                  type: "select",
                  options: [
                    { value: "no", label: "No" },
                    { value: "yes", label: "Yes" },
                  ],
                },
              ],
            },
            {
              title: "Tax Details",
              key: "taxDetails",
              fields: [
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
                  label: "Other Annual Income",
                  id: "otherIncome",
                  value: otherIncome,
                  setter: setOtherIncome,
                  type: "number",
                  min: "0",
                  step: "100",
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
              ],
            },
            {
              title: "Planning Factors",
              key: "planningFactors",
              fields: [
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
                  label: "Earnings Growth Rate (%)",
                  id: "earningsGrowth",
                  value: earningsGrowth,
                  setter: setEarningsGrowth,
                  type: "number",
                  min: "0",
                  step: "0.1",
                },
                {
                  label: "Life Expectancy (Years)",
                  id: "lifeExpectancy",
                  value: lifeExpectancy,
                  setter: setLifeExpectancy,
                  type: "number",
                  min: "65",
                  step: "1",
                },
                {
                  label: "Discount Rate (%)",
                  id: "discountRate",
                  value: discountRate,
                  setter: setDiscountRate,
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
              ],
            },
          ].map((section) => (
            <div key={section.key} className="space-y-2">
              <div
                className="p-3 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 text-center"
                onClick={() => toggleCollapsible(section.key)}
              >
                {section.title}
              </div>
              {collapsibleStates[section.key] && (
                <div className="space-y-4">
                  {section.fields.map((field) => (
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
                          onChange={(e) => {
                            field.setter(e.target.value);
                            if (field.id === "retirementAge") setRetirementAgeSlider(e.target.value);
                            if (field.id === "retirementAgeSlider") setRetirementAge(e.target.value);
                          }}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={calculateSocialSecurity}
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Calculate Social Security
          </button>
          {summaryData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg mt-4">
              <thead>
                <tr>
                  {["Metric", "Value"].map((header) => (
                    <th key={header} className="p-2 bg-red-500 text-white">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summaryData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-2">{item.label}</td>
                    <td className="p-2">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {detailedData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg mt-4 max-h-96 overflow-y-auto block">
              <thead>
                <tr>
                  {["Category", "Amount"].map((header, i) => (
                    <th
                      key={header}
                      className="p-2 bg-red-500 text-white cursor-pointer"
                      onClick={() => handleSort(i)}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detailedData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-2">{item.category}</td>
                    <td className="p-2">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {result.csvLink && (
            <div className="mt-4 text-center">
              <a
                href={result.csvLink}
                download="social_security_breakdown.csv"
                className="text-red-500 hover:underline"
              >
                Download Social Security Breakdown
              </a>
            </div>
          )}
          {result.tips.length > 0 && (
            <div className="mt-4">
              <strong className="block text-sm font-bold text-gray-600">Retirement Planning Tips:</strong>
              <ul className="list-disc pl-5">
                {result.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          {error && <div className="mt-4 text-center text-red-500">{error}</div>}
          {status && <div className="mt-4 text-center text-yellow-500">{status}</div>}
        </div>
        <style jsx>{`
          input:focus,
          select:focus {
            outline: none;
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
          }
          input[type="range"] {
            accent-color: #ef4444;
          }
          .max-h-96 {
            max-height: 24rem;
          }
        `}</style>
      </div>
    </div>
  );
}
