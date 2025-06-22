"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [salaryType, setSalaryType] = useState("annual");
  const [baseSalary, setBaseSalary] = useState("50000");
  const [baseSalarySlider, setBaseSalarySlider] = useState("50000");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [payFrequency, setPayFrequency] = useState("biweekly");
  const [employmentStatus, setEmploymentStatus] = useState("fulltime");
  const [bonus, setBonus] = useState("0");
  const [oneTimeBonus, setOneTimeBonus] = useState("0");
  const [overtimeHours, setOvertimeHours] = useState("0");
  const [overtimeRate, setOvertimeRate] = useState("1.5");
  const [commission, setCommission] = useState("0");
  const [taxYear, setTaxYear] = useState("2025");
  const [filingStatus, setFilingStatus] = useState("single");
  const [state, setState] = useState("none");
  const [federalAllowances, setFederalAllowances] = useState("0");
  const [stateAllowances, setStateAllowances] = useState("0");
  const [deductionType, setDeductionType] = useState("standard");
  const [four01k, setFour01k] = useState("5");
  const [healthInsurance, setHealthInsurance] = useState("2000");
  const [hsa, setHsa] = useState("0");
  const [unionDues, setUnionDues] = useState("0");
  const [garnishments, setGarnishments] = useState("0");
  const [mortgageInterest, setMortgageInterest] = useState("0");
  const [charity, setCharity] = useState("0");
  const [medical, setMedical] = useState("0");
  const [employer401k, setEmployer401k] = useState("3");
  const [employerHealth, setEmployerHealth] = useState("5000");
  const [ptoHours, setPtoHours] = useState("80");
  const [annualExpenses, setAnnualExpenses] = useState("30000");
  const [savingsRate, setSavingsRate] = useState("20");
  const [dti, setDti] = useState("36");
  const [currency, setCurrency] = useState("USD");
  const [collapsibleStates, setCollapsibleStates] = useState({
    taxDetails: false,
    deductions: false,
    benefits: false,
    financialDetails: false,
  });
  const [summaryData, setSummaryData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [result, setResult] = useState({ csvLink: null, tips: [] });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[curr]} ${parseFloat(amount || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  };

  const toggleCollapsible = (section) => {
    setCollapsibleStates((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSort = (table, index) => {
    const data = table === "summary" ? [...summaryData] : [...detailedData];
    const isAscending = !data[0]?.sortOrder || data[0].sortOrder === "desc";
    data.sort((a, b) => {
      const aValue = table === "summary" ? a.value : a.amount;
      const bValue = table === "summary" ? b.value : b.amount;
      if (index === 1) {
        const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, "")) || 0;
        const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, "")) || 0;
        return isAscending ? aNum - bNum : bNum - aNum;
      }
      return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    data.forEach((item) => (item.sortOrder = isAscending ? "asc" : "desc"));
    if (table === "summary") setSummaryData(data);
    else setDetailedData(data);
  };

  const calculateSalary = () => {
    setError("");
    setStatus("");
    setSummaryData([]);
    setDetailedData([]);
    setResult({ csvLink: null, tips: [] });

    const inputValues = {
      salaryType,
      baseSalary: parseFloat(baseSalary) || 0,
      hoursPerWeek: parseFloat(hoursPerWeek) || 40,
      payFrequency,
      employmentStatus,
      bonus: parseFloat(bonus) || 0,
      oneTimeBonus: parseFloat(oneTimeBonus) || 0,
      overtimeHours: parseFloat(overtimeHours) || 0,
      overtimeRate: parseFloat(overtimeRate) || 1.5,
      commission: parseFloat(commission) || 0,
      taxYear,
      filingStatus,
      state,
      federalAllowances: parseInt(federalAllowances) || 0,
      stateAllowances: parseInt(stateAllowances) || 0,
      deductionType,
      four01k: parseFloat(four01k) || 0,
      healthInsurance: parseFloat(healthInsurance) || 0,
      hsa: parseFloat(hsa) || 0,
      unionDues: parseFloat(unionDues) || 0,
      garnishments: parseFloat(garnishments) || 0,
      mortgageInterest: parseFloat(mortgageInterest) || 0,
      charity: parseFloat(charity) || 0,
      medical: parseFloat(medical) || 0,
      employer401k: parseFloat(employer401k) || 0,
      employerHealth: parseFloat(employerHealth) || 0,
      ptoHours: parseFloat(ptoHours) || 0,
      annualExpenses: parseFloat(annualExpenses) || 0,
      savingsRate: parseFloat(savingsRate) || 0,
      dti: parseFloat(dti) || 36,
      currency,
    };

    if (
      inputValues.baseSalary < 0 ||
      inputValues.bonus < 0 ||
      inputValues.oneTimeBonus < 0 ||
      inputValues.overtimeHours < 0 ||
      inputValues.overtimeRate < 1 ||
      inputValues.commission < 0
    ) {
      setError("Salary and bonus values must be valid");
      return;
    }
    if (inputValues.hoursPerWeek < 0 || inputValues.hoursPerWeek > 168) {
      setError("Hours per week must be between 0 and 168");
      return;
    }
    if (
      inputValues.four01k < 0 ||
      inputValues.four01k > 100 ||
      inputValues.employer401k < 0 ||
      inputValues.employer401k > 100
    ) {
      setError("401(k) contributions must be between 0% and 100%");
      return;
    }
    if (
      inputValues.healthInsurance < 0 ||
      inputValues.hsa < 0 ||
      inputValues.unionDues < 0 ||
      inputValues.garnishments < 0 ||
      inputValues.mortgageInterest < 0 ||
      inputValues.charity < 0 ||
      inputValues.medical < 0
    ) {
      setError("Deductions cannot be negative");
      return;
    }
    if (inputValues.employerHealth < 0 || inputValues.ptoHours < 0) {
      setError("Benefits cannot be negative");
      return;
    }
    if (
      inputValues.savingsRate < 0 ||
      inputValues.savingsRate > 100 ||
      inputValues.dti < 0 ||
      inputValues.dti > 100 ||
      inputValues.annualExpenses < 0
    ) {
      setError("Financial details must be valid");
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
            { rate: 0.10, min: 0, max: 11600 },
            { rate: 0.12, min: 11601, max: 47150 },
            { rate: 0.22, min: 47151, max: 100525 },
            { rate: 0.24, min: 100526, max: 191950 },
            { rate: 0.32, min: 191951, max: 243725 },
            { rate: 0.35, min: 243726, max: 609350 },
            { rate: 0.37, min: 609351 },
          ],
          marriedJoint: [
            { rate: 0.10, min: 0, max: 23200 },
            { rate: 0.12, min: 23201, max: 94300 },
            { rate: 0.22, min: 94301, max: 201050 },
            { rate: 0.24, min: 201051, max: 383900 },
            { rate: 0.32, min: 383901, max: 487450 },
            { rate: 0.35, min: 487451, max: 731200 },
            { rate: 0.37, min: 731201 },
          ],
          marriedSeparate: [
            { rate: 0.10, min: 0, max: 11600 },
            { rate: 0.12, min: 11601, max: 47150 },
            { rate: 0.22, min: 47151, max: 100525 },
            { rate: 0.24, min: 100526, max: 191950 },
            { rate: 0.32, min: 191951, max: 243725 },
            { rate: 0.35, min: 243726, max: 365600 },
            { rate: 0.37, min: 365601 },
          ],
          headHousehold: [
            { rate: 0.10, min: 0, max: 16550 },
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

      let annualBaseSalary = inputValues.baseSalary;
      if (inputValues.salaryType === "monthly") {
        annualBaseSalary = inputValues.baseSalary * 12;
      } else if (inputValues.salaryType === "hourly") {
        const regularPay = inputValues.baseSalary * inputValues.hoursPerWeek * 52;
        const overtimePay = inputValues.baseSalary * inputValues.overtimeRate * inputValues.overtimeHours * 52;
        annualBaseSalary = regularPay + overtimePay;
      }
      const grossSalary = annualBaseSalary + inputValues.bonus + inputValues.oneTimeBonus + inputValues.commission;

      const four01kAmount = (inputValues.four01k / 100) * annualBaseSalary;
      const preTaxDeductions = four01kAmount + inputValues.healthInsurance + inputValues.hsa;

      let taxDeductions = 0;
      if (inputValues.deductionType === "standard") {
        taxDeductions = standardDeductions[inputValues.taxYear][inputValues.filingStatus];
      } else {
        taxDeductions = inputValues.mortgageInterest + inputValues.charity + inputValues.medical;
      }
      const taxableIncome = Math.max(0, grossSalary - preTaxDeductions - taxDeductions);

      let federalTax = 0;
      let marginalRate = 0;
      const brackets = federalBrackets[inputValues.taxYear][inputValues.filingStatus];
      for (const bracket of brackets) {
        if (taxableIncome > bracket.min) {
          const taxableInBracket = Math.min(taxableIncome, bracket.max || taxableIncome) - bracket.min;
          federalTax += taxableInBracket * bracket.rate;
          marginalRate = bracket.rate;
        }
      }
      federalTax = Math.max(0, federalTax - inputValues.federalAllowances * 4500);

      const socialSecurityCap = 168600;
      const socialSecurity = Math.min(grossSalary, socialSecurityCap) * 0.062;
      const medicare = grossSalary * 0.0145;

      let stateTax = 0;
      if (inputValues.state !== "none" && inputValues.state !== "TX") {
        const stateBracket = stateBrackets[inputValues.state];
        for (const bracket of stateBracket) {
          if (taxableIncome > bracket.min) {
            const taxableInBracket = Math.min(taxableIncome, bracket.max || taxableIncome) - bracket.min;
            stateTax += taxableInBracket * bracket.rate;
          }
        }
        stateTax = Math.max(0, stateTax - inputValues.stateAllowances * 1000);
      }

      const postTaxDeductions = inputValues.unionDues + inputValues.garnishments;

      const totalTax = federalTax + socialSecurity + medicare + stateTax;
      const netSalary = grossSalary - preTaxDeductions - totalTax - postTaxDeductions;
      const effectiveTaxRate = grossSalary > 0 ? (totalTax / grossSalary) * 100 : 0;

      const periodsPerYear = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };
      const takeHomePay = netSalary / periodsPerYear[inputValues.payFrequency];

      const employer401kAmount = (inputValues.employer401k / 100) * annualBaseSalary;
      const ptoValue = (annualBaseSalary / (52 * inputValues.hoursPerWeek)) * inputValues.ptoHours;
      const totalBenefits = employer401kAmount + inputValues.employerHealth + ptoValue;
      const totalCompensation = grossSalary + totalBenefits;

      const monthlyNetIncome = netSalary / 12;
      const monthlyExpenses = inputValues.annualExpenses / 12;
      const monthlySavings = monthlyNetIncome * (inputValues.savingsRate / 100);
      const surplus = monthlyNetIncome - monthlyExpenses - monthlySavings;
      const affordableExpenses = netSalary * (inputValues.dti / 100) / 12;

      const newSummaryData = [
        { label: "Gross Salary", value: formatCurrency(grossSalary) },
        { label: "Taxable Income", value: formatCurrency(taxableIncome) },
        { label: "Total Tax", value: formatCurrency(totalTax) },
        { label: "Net Salary", value: formatCurrency(netSalary) },
        { label: "Take-Home Pay (per period)", value: formatCurrency(takeHomePay) },
        { label: "Effective Tax Rate", value: `${effectiveTaxRate.toFixed(2)}%` },
        { label: "Marginal Tax Rate", value: `${(marginalRate * 100).toFixed(2)}%` },
        { label: "Total Benefits", value: formatCurrency(totalBenefits) },
        { label: "Total Compensation", value: formatCurrency(totalCompensation) },
        { label: "Monthly Surplus", value: formatCurrency(surplus) },
        { label: "Affordable Expenses", value: formatCurrency(affordableExpenses) },
      ];

      const newDetailedData = [
        { category: "Base Salary", amount: annualBaseSalary },
        { category: "Bonus", amount: inputValues.bonus },
        { category: "One-Time Bonus", amount: inputValues.oneTimeBonus },
        { category: "Commission", amount: inputValues.commission },
        { category: "401(k) Contribution", amount: -four01kAmount },
        { category: "Health Insurance", amount: -inputValues.healthInsurance },
        { category: "HSA Contribution", amount: -inputValues.hsa },
        { category: "Federal Tax", amount: -federalTax },
        { category: "Social Security", amount: -socialSecurity },
        { category: "Medicare", amount: -medicare },
        { category: "State Tax", amount: -stateTax },
        { category: "Union Dues", amount: -inputValues.unionDues },
        { category: "Garnishments", amount: -inputValues.garnishments },
        { category: "Employer 401(k) Match", amount: employer401kAmount },
        { category: "Employer Health Contribution", amount: inputValues.employerHealth },
        { category: "PTO Value", amount: ptoValue },
      ].filter((item) => item.amount !== 0);

      const csv = ["Category,Amount", ...newDetailedData.map((item) => `${item.category},${item.amount.toFixed(2)}`)].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const csvLink = URL.createObjectURL(blob);

      const tips = [];
      if (effectiveTaxRate > 20) tips.push("Consider increasing pre-tax deductions (e.g., 401(k), HSA).");
      if (surplus < 0) tips.push("Review expenses or negotiate a higher salary to cover costs.");
      if (inputValues.four01k < 10) tips.push("Increase 401(k) contributions to reduce taxable income and save for retirement.");

      setSummaryData(newSummaryData);
      setDetailedData(newDetailedData);
      setResult({ csvLink, tips });

      alert("Chart rendering not implemented in this demo.");
    } catch (error) {
      setError("Error calculating salary. Check console for details.");
      console.error("Calculation error:", error);
    }
  };

  useEffect(() => {
    setBaseSalarySlider(baseSalary);
  }, [baseSalary]);

  const isHourly = salaryType === "hourly";
  const isItemized = deductionType === "itemized";

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-start">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-xl w-full">
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Advanced Salary Calculator</h1>
        <div className="space-y-4">
          <div className="input-group">
            {[
              { label: "Salary Type", id: "salaryType", value: salaryType, setter: setSalaryType, type: "select", options: [
                { value: "annual", label: "Annual" },
                { value: "monthly", label: "Monthly" },
                { value: "hourly", label: "Hourly" },
              ]},
              { label: "Base Salary", id: "baseSalary", value: baseSalary, setter: setBaseSalary, type: "number", min: "0", step: "100" },
              { label: "", id: "baseSalarySlider", value: baseSalarySlider, setter: setBaseSalarySlider, type: "range", min: "0", max: "500000", step: "100" },
              ...(isHourly ? [
                { label: "Hours per Week", id: "hoursPerWeek", value: hoursPerWeek, setter: setHoursPerWeek, type: "number", min: "0", max: "168" },
                { label: "Overtime Hours per Week", id: "overtimeHours", value: overtimeHours, setter: setOvertimeHours, type: "number", min: "0" },
                { label: "Overtime Rate Multiplier", id: "overtimeRate", value: overtimeRate, setter: setOvertimeRate, type: "number", min: "1", step: "0.1" },
              ] : []),
              { label: "Pay Frequency", id: "payFrequency", value: payFrequency, setter: setPayFrequency, type: "select", options: [
                { value: "weekly", label: "Weekly" },
                { value: "biweekly", label: "Bi-weekly" },
                { value: "semimonthly", label: "Semi-monthly" },
                { value: "monthly", label: "Monthly" },
              ]},
              { label: "Employment Status", id: "employmentStatus", value: employmentStatus, setter: setEmploymentStatus, type: "select", options: [
                { value: "fulltime", label: "Full-time" },
                { value: "parttime", label: "Part-time" },
                { value: "contract", label: "Contract" },
              ]},
              { label: "Annual Bonus", id: "bonus", value: bonus, setter: setBonus, type: "number", min: "0" },
              { label: "One-Time Bonus", id: "oneTimeBonus", value: oneTimeBonus, setter: setOneTimeBonus, type: "number", min: "0" },
              { label: "Commission/Variable Pay", id: "commission", value: commission, setter: setCommission, type: "number", min: "0" },
            ].map((field) => (
              <div key={field.id} className="mb-4">
                {field.label && <label htmlFor={field.id} className="block text-sm font-bold text-gray-600 mb-2">{field.label}</label>}
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    onChange={(e) => {
                      field.setter(e.target.value);
                      if (field.id === "baseSalary") setBaseSalarySlider(e.target.value);
                      if (field.id === "baseSalarySlider") setBaseSalary(e.target.value);
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
            { title: "Tax Details", key: "taxDetails", fields: [
              { label: "Tax Year", id: "taxYear", value: taxYear, setter: setTaxYear, type: "select", options: [
                { value: "2024", label: "2024" },
                { value: "2025", label: "2025" },
              ]},
              { label: "Filing Status", id: "filingStatus", value: filingStatus, setter: setFilingStatus, type: "select", options: [
                { value: "single", label: "Single" },
                { value: "marriedJoint", label: "Married Filing Jointly" },
                { value: "marriedSeparate", label: "Married Filing Separately" },
                { value: "headHousehold", label: "Head of Household" },
              ]},
              { label: "State", id: "state", value: state, setter: setState, type: "select", options: [
                { value: "none", label: "No State Tax" },
                { value: "CA", label: "California" },
                { value: "NY", label: "New York" },
                { value: "TX", label: "Texas" },
              ]},
              { label: "Federal Withholding Allowances", id: "federalAllowances", value: federalAllowances, setter: setFederalAllowances, type: "number", min: "0" },
              { label: "State Withholding Allowances", id: "stateAllowances", value: stateAllowances, setter: setStateAllowances, type: "number", min: "0" },
            ]},
            { title: "Deductions", key: "deductions", fields: [
              { label: "Tax Deduction Type", id: "deductionType", value: deductionType, setter: setDeductionType, type: "select", options: [
                { value: "standard", label: "Standard Deduction" },
                { value: "itemized", label: "Itemized Deductions" },
              ]},
              { label: "401(k) Contribution (% of Salary)", id: "401k", value: four01k, setter: setFour01k, type: "number", min: "0", max: "100", step: "0.1" },
              { label: "Health Insurance (Annual)", id: "healthInsurance", value: healthInsurance, setter: setHealthInsurance, type: "number", min: "0" },
              { label: "HSA Contribution (Annual)", id: "hsa", value: hsa, setter: setHsa, type: "number", min: "0" },
              { label: "Union Dues (Annual)", id: "unionDues", value: unionDues, setter: setUnionDues, type: "number", min: "0" },
              { label: "Garnishments (Annual)", id: "garnishments", value: garnishments, setter: setGarnishments, type: "number", min: "0" },
              ...(isItemized ? [
                { label: "Mortgage Interest", id: "mortgageInterest", value: mortgageInterest, setter: setMortgageInterest, type: "number", min: "0" },
                { label: "Charitable Contributions", id: "charity", value: charity, setter: setCharity, type: "number", min: "0" },
                { label: "Medical Expenses", id: "medical", value: medical, setter: setMedical, type: "number", min: "0" },
              ] : []),
            ]},
            { title: "Benefits", key: "benefits", fields: [
              { label: "Employer 401(k) Match (% of Salary)", id: "employer401k", value: employer401k, setter: setEmployer401k, type: "number", min: "0", max: "100", step: "0.1" },
              { label: "Employer Health Insurance Contribution (Annual)", id: "employerHealth", value: employerHealth, setter: setEmployerHealth, type: "number", min: "0" },
              { label: "Paid Time Off (PTO) Hours per Year", id: "ptoHours", value: ptoHours, setter: setPtoHours, type: "number", min: "0" },
            ]},
            { title: "Financial Details", key: "financialDetails", fields: [
              { label: "Annual Expenses", id: "annualExpenses", value: annualExpenses, setter: setAnnualExpenses, type: "number", min: "0" },
              { label: "Savings Rate (% of Net Income)", id: "savingsRate", value: savingsRate, setter: setSavingsRate, type: "number", min: "0", max: "100" },
              { label: "Debt-to-Income Ratio (%)", id: "dti", value: dti, setter: setDti, type: "number", min: "0", max: "100" },
              { label: "Currency", id: "currency", value: currency, setter: setCurrency, type: "select", options: [
                { value: "USD", label: "$ USD" },
                { value: "EUR", label: "€ EUR" },
                { value: "INR", label: "₹ INR" },
              ]},
            ]},
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
                      <label htmlFor={field.id} className="block text-sm font-bold text-gray-600 mb-2">{field.label}</label>
                      {field.type === "select" ? (
                        <select
                          id={field.id}
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                        >
                          {field.options.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
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
              )}
            </div>
          ))}
          <button onClick={calculateSalary} className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Calculate Salary
          </button>
          {summaryData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg mt-4">
              <thead>
                <tr>
                  {["Metric", "Value"].map((header, i) => (
                    <th key={i} className="p-2 bg-red-500 text-white cursor-pointer" onClick={() => handleSort("summary", i)}>{header}</th>
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
                    <th key={i} className="p-2 bg-red-500 text-white cursor-pointer" onClick={() => handleSort("detailed", i)}>{header}</th>
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
              <a href={result.csvLink} download="salary_breakdown.csv" className="text-red-500 hover:underline">Download Salary Breakdown</a>
            </div>
          )}
          {result.tips.length > 0 && (
            <div className="mt-4">
              <strong className="block text-sm font-bold text-gray-600">Salary Planning Tips:</strong>
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