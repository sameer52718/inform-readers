"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [currency, setCurrency] = useState("USD");
  const [loanType, setLoanType] = useState("conventional");
  const [homePrice, setHomePrice] = useState("300000");
  const [downPayment, setDownPayment] = useState("20");
  const [creditScore, setCreditScore] = useState("700");
  const [interestRate, setInterestRate] = useState("6");
  const [loanTerm, setLoanTerm] = useState("30");
  const [upfrontMip, setUpfrontMip] = useState("1.75");
  const [annualMip, setAnnualMip] = useState("0.55");
  const [closingCosts, setClosingCosts] = useState("6000");
  const [propertyTaxes, setPropertyTaxes] = useState("3000");
  const [insurance, setInsurance] = useState("1200");
  const [hoa, setHoa] = useState("0");
  const [monthlyIncome, setMonthlyIncome] = useState("6000");
  const [monthlyDebts, setMonthlyDebts] = useState("1000");
  const [targetDti, setTargetDti] = useState("43");
  const [monthlyRent, setMonthlyRent] = useState("2000");
  const [vacancyRate, setVacancyRate] = useState("5");
  const [management, setManagement] = useState("8");
  const [appreciation, setAppreciation] = useState("3");
  const [holdingPeriod, setHoldingPeriod] = useState("10");
  const [currentSavings, setCurrentSavings] = useState("20000");
  const [monthlySavings, setMonthlySavings] = useState("1000");
  const [savingsRate, setSavingsRate] = useState("2");
  const [scenarios, setScenarios] = useState([{ homePrice: "300000", downPayment: "20", rent: "2000" }]);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState(
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("downPaymentHistory")) || [] : []
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateDownPayment = () => {
      if (loanType === "va") {
        setDownPayment("0");
      } else if (loanType === "fha") {
        setDownPayment(parseInt(creditScore) >= 580 ? "3.5" : "10");
      } else {
        setDownPayment("20");
      }
    };
    updateDownPayment();
  }, [loanType, creditScore]);

  const formatCurrency = (amount) => `${currency} ${parseFloat(amount).toFixed(2)}`;

  const convertCurrency = () => {
    setError("");
    const rates = { USD: 1, PKR: 277.95, INR: 83.95 };
    const newCurrency = currency === "USD" ? "PKR" : currency === "PKR" ? "INR" : "USD";
    const fields = [
      { value: homePrice, setter: setHomePrice },
      { value: closingCosts, setter: setClosingCosts },
      { value: propertyTaxes, setter: setPropertyTaxes },
      { value: insurance, setter: setInsurance },
      { value: hoa, setter: setHoa },
      { value: monthlyIncome, setter: setMonthlyIncome },
      { value: monthlyDebts, setter: setMonthlyDebts },
      { value: monthlyRent, setter: setMonthlyRent },
      { value: currentSavings, setter: setCurrentSavings },
      { value: monthlySavings, setter: setMonthlySavings },
    ];
    fields.forEach(({ value, setter }) => {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) setter(((parsed * rates[newCurrency]) / rates[currency]).toFixed(2));
    });
    setScenarios(
      scenarios.map((s) => ({
        homePrice: ((parseFloat(s.homePrice) * rates[newCurrency]) / rates[currency]).toFixed(2),
        downPayment: s.downPayment,
        rent: ((parseFloat(s.rent) * rates[newCurrency]) / rates[currency]).toFixed(2),
      }))
    );
    setCurrency(newCurrency);
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setError("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([...scenarios, { homePrice: "300000", downPayment: "20", rent: "2000" }]);
  };

  const calculate = () => {
    setError("");
    const parsed = {
      homePrice: parseFloat(homePrice),
      downPayment: parseFloat(downPayment),
      creditScore: parseInt(creditScore),
      interestRate: parseFloat(interestRate),
      loanTerm: parseInt(loanTerm),
      upfrontMip: parseFloat(upfrontMip),
      annualMip: parseFloat(annualMip),
      closingCosts: parseFloat(closingCosts),
      propertyTaxes: parseFloat(propertyTaxes),
      insurance: parseFloat(insurance),
      hoa: parseFloat(hoa),
      monthlyIncome: parseFloat(monthlyIncome),
      monthlyDebts: parseFloat(monthlyDebts),
      targetDti: parseFloat(targetDti),
      monthlyRent: parseFloat(monthlyRent),
      vacancyRate: parseFloat(vacancyRate),
      management: parseFloat(management),
      appreciation: parseFloat(appreciation),
      holdingPeriod: parseInt(holdingPeriod),
      currentSavings: parseFloat(currentSavings),
      monthlySavings: parseFloat(monthlySavings),
      savingsRate: parseFloat(savingsRate),
    };
    if (Object.values(parsed).some(isNaN)) {
      setError("Please provide valid inputs.");
      return;
    }
    if (parsed.homePrice <= 0 || parsed.monthlyIncome <= 0 || parsed.monthlySavings < 0) {
      setError("Home price, income, and savings must be positive or zero.");
      return;
    }
    if (parsed.creditScore < 500 || parsed.creditScore > 850) {
      setError("Credit score must be between 500 and 850.");
      return;
    }
    if (
      parsed.downPayment < 0 ||
      parsed.downPayment > 100 ||
      parsed.interestRate < 0 ||
      parsed.upfrontMip < 0 ||
      parsed.annualMip < 0 ||
      parsed.closingCosts < 0 ||
      parsed.propertyTaxes < 0 ||
      parsed.insurance < 0 ||
      parsed.hoa < 0 ||
      parsed.monthlyDebts < 0 ||
      parsed.targetDti < 0 ||
      parsed.targetDti > 100 ||
      parsed.vacancyRate < 0 ||
      parsed.vacancyRate > 100 ||
      parsed.management < 0 ||
      parsed.management > 100 ||
      parsed.appreciation < 0 ||
      parsed.holdingPeriod < 1 ||
      parsed.savingsRate < 0
    ) {
      setError("Invalid input values (e.g., negative or out-of-range percentages).");
      return;
    }
    if (
      loanType === "fha" &&
      ((parsed.creditScore >= 580 && parsed.downPayment < 3.5) ||
        (parsed.creditScore < 580 && parsed.downPayment < 10))
    ) {
      setError(
        `Down payment must be at least ${
          parsed.creditScore >= 580 ? "3.5%" : "10%"
        } for FHA loan with credit score ${parsed.creditScore}.`
      );
      return;
    }
    if (loanType === "conventional" && parsed.downPayment < 3) {
      setError("Down payment must be at least 3% for Conventional loan.");
      return;
    }
    if (loanType === "va" && parsed.downPayment !== 0) {
      setError("Down payment must be 0% for VA loan.");
      return;
    }
    if (parsed.loanTerm !== 15 && parsed.loanTerm !== 30) {
      setError("Loan term must be 15 or 30 years.");
      return;
    }

    const downPaymentAmount = ((parsed.homePrice * parsed.downPayment) / 100).toFixed(2);
    const baseLoanAmount = parsed.homePrice - downPaymentAmount;
    const upfrontMipAmount = loanType === "fha" ? (baseLoanAmount * parsed.upfrontMip) / 100 : 0;
    const loanAmount = (baseLoanAmount + upfrontMipAmount).toFixed(2);
    const initialInvestment = (
      parseFloat(downPaymentAmount) +
      parsed.closingCosts +
      upfrontMipAmount
    ).toFixed(2);

    const monthlyRate = parsed.interestRate / 100 / 12;
    const payments = parsed.loanTerm * 12;
    const monthlyPI =
      loanAmount > 0
        ? (
            (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
            (Math.pow(1 + monthlyRate, payments) - 1)
          ).toFixed(2)
        : 0;
    const monthlyMip = loanType === "fha" ? ((loanAmount * parsed.annualMip) / 100 / 12).toFixed(2) : 0;
    const monthlyTaxes = (parsed.propertyTaxes / 12).toFixed(2);
    const monthlyInsurance = (parsed.insurance / 12).toFixed(2);
    const monthlyHoa = (parsed.hoa / 12).toFixed(2);
    const monthlyPayment = (
      parseFloat(monthlyPI) +
      parseFloat(monthlyMip) +
      parseFloat(monthlyTaxes) +
      parseFloat(monthlyInsurance) +
      parseFloat(monthlyHoa)
    ).toFixed(2);
    const totalLoanCost = (parseFloat(monthlyPayment) * payments).toFixed(2);

    const maxMonthlyPayment = ((parsed.monthlyIncome * parsed.targetDti) / 100 - parsed.monthlyDebts).toFixed(
      2
    );
    const maxLoanAmount =
      maxMonthlyPayment >
      parseFloat(monthlyMip) +
        parseFloat(monthlyTaxes) +
        parseFloat(monthlyInsurance) +
        parseFloat(monthlyHoa)
        ? (
            ((maxMonthlyPayment -
              parseFloat(monthlyMip) -
              parseFloat(monthlyTaxes) -
              parseFloat(monthlyInsurance) -
              parseFloat(monthlyHoa)) *
              (Math.pow(1 + monthlyRate, payments) - 1)) /
            (monthlyRate * Math.pow(1 + monthlyRate, payments))
          ).toFixed(2)
        : 0;
    const maxHomePrice =
      loanType === "fha"
        ? (maxLoanAmount / (1 + parsed.upfrontMip / 100) / (1 - parsed.downPayment / 100)).toFixed(2)
        : (maxLoanAmount / (1 - parsed.downPayment / 100)).toFixed(2);
    const affordabilityScore = ((parseFloat(monthlyPayment) / parsed.monthlyIncome) * 100).toFixed(2);

    const rentalIncome = (parsed.monthlyRent * 12 * (1 - parsed.vacancyRate / 100)).toFixed(2);
    const managementFee = ((rentalIncome * parsed.management) / 100).toFixed(2);
    const operatingExpenses = (parsed.propertyTaxes + parsed.insurance + parseFloat(managementFee)).toFixed(
      2
    );
    const noi = (rentalIncome - operatingExpenses).toFixed(2);
    const cashFlow = (noi - monthlyPayment * 12).toFixed(2);
    const capRate = ((noi / parsed.homePrice) * 100).toFixed(2);
    const cocReturn = ((cashFlow / initialInvestment) * 100).toFixed(2);
    const futureValue = (
      parsed.homePrice * Math.pow(1 + parsed.appreciation / 100, parsed.holdingPeriod)
    ).toFixed(2);
    const roi = (
      ((futureValue - loanAmount + cashFlow * parsed.holdingPeriod - initialInvestment) / initialInvestment) *
      100
    ).toFixed(2);
    const annualDebtService = (monthlyPayment * 12).toFixed(2);
    const dscr = monthlyPayment > 0 ? (noi / annualDebtService).toFixed(2) : "N/A";

    const targetSavings = (parseFloat(downPaymentAmount) + parsed.closingCosts + upfrontMipAmount).toFixed(2);
    const monthlySavingsRate = parsed.savingsRate / 100 / 12;
    const monthsToSave =
      parsed.monthlySavings > 0
        ? Math.ceil(
            Math.log(
              ((targetSavings - parsed.currentSavings) * monthlySavingsRate) / parsed.monthlySavings + 1
            ) / Math.log(1 + monthlySavingsRate)
          )
        : "N/A";
    const yearsToSave = monthsToSave !== "N/A" ? (monthsToSave / 12).toFixed(1) : "N/A";

    const affordabilityAnalysis =
      affordabilityScore > 43
        ? `High housing cost burden (${affordabilityScore}% of income). Consider a home price below ${currency} ${maxHomePrice}.`
        : `Affordable (${affordabilityScore}% of income). You can afford up to ${currency} ${maxHomePrice}.`;
    const savingsOptimizer =
      yearsToSave !== "N/A" && yearsToSave > 2
        ? `To save for down payment in under 2 years, increase monthly savings to ${currency} ${(
            parsed.monthlySavings * 1.5
          ).toFixed(2)} or find a ${currency} ${(parsed.homePrice * 0.8).toFixed(2)} home.`
        : `Savings plan is optimal; down payment achievable in ${yearsToSave} years.`;
    const investmentOptimizer =
      cocReturn < 8
        ? `To achieve CoC Return > 8%, increase rent to ${currency} ${(parsed.monthlyRent * 1.1).toFixed(
            2
          )} or reduce expenses by ${currency} ${(operatingExpenses * 0.1).toFixed(2)}.`
        : `Strong investment with ${cocReturn}% CoC Return; maintain current strategy.`;
    const riskAnalysis =
      dscr !== "N/A" && dscr < 1.2 ? "High risk (DSCR < 1.2)" : "Low risk (DSCR ≥ 1.2 or no debt)";

    const sensitivity = [];
    for (let dp = Math.max(0, parsed.downPayment - 5); dp <= parsed.downPayment + 5; dp += 5) {
      const sDownPaymentAmount = (parsed.homePrice * dp) / 100;
      const sBaseLoan = parsed.homePrice - sDownPaymentAmount;
      const sUpfrontMip = loanType === "fha" ? (sBaseLoan * parsed.upfrontMip) / 100 : 0;
      const sLoanAmount = sBaseLoan + sUpfrontMip;
      const sMonthlyPI =
        sLoanAmount > 0
          ? (sLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
            (Math.pow(1 + monthlyRate, payments) - 1)
          : 0;
      const sMonthlyPayment = (
        sMonthlyPI +
        parseFloat(monthlyMip) +
        parseFloat(monthlyTaxes) +
        parseFloat(monthlyInsurance) +
        parseFloat(monthlyHoa)
      ).toFixed(2);
      sensitivity.push({ downPayment: dp.toFixed(1), payment: sMonthlyPayment });
    }

    const scenarioResults = scenarios
      .map((s, index) => {
        const sHomePrice = parseFloat(s.homePrice);
        const sDownPayment = parseFloat(s.downPayment);
        const sRent = parseFloat(s.rent);
        if (isNaN(sHomePrice) || isNaN(sDownPayment) || isNaN(sRent)) return null;
        const sDownPaymentAmount = (sHomePrice * sDownPayment) / 100;
        const sBaseLoan = sHomePrice - sDownPaymentAmount;
        const sUpfrontMip = loanType === "fha" ? (sBaseLoan * parsed.upfrontMip) / 100 : 0;
        const sLoanAmount = sBaseLoan + sUpfrontMip;
        const sMonthlyPI =
          sLoanAmount > 0
            ? (sLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
              (Math.pow(1 + monthlyRate, payments) - 1)
            : 0;
        const sMonthlyPayment = (
          sMonthlyPI +
          parseFloat(monthlyMip) +
          parseFloat(monthlyTaxes) +
          parseFloat(monthlyInsurance) +
          parseFloat(monthlyHoa)
        ).toFixed(2);
        const sRentalIncome = sRent * 12 * (1 - parsed.vacancyRate / 100);
        const sManagementFee = (sRentalIncome * parsed.management) / 100;
        const sNOI = (sRentalIncome - (parsed.propertyTaxes + parsed.insurance + sManagementFee)).toFixed(2);
        const sInitialInvestment = (sDownPaymentAmount + parsed.closingCosts + sUpfrontMip).toFixed(2);
        const sCashFlow = (sNOI - sMonthlyPayment * 12).toFixed(2);
        const sCocReturn = ((sCashFlow / sInitialInvestment) * 100).toFixed(2);
        return {
          name: `Scenario ${index + 1}`,
          downPayment: sDownPaymentAmount.toFixed(2),
          monthlyPayment: sMonthlyPayment,
          cocReturn: sCocReturn,
        };
      })
      .filter(Boolean);

    setResults({
      downPayment: formatCurrency(downPaymentAmount),
      initialInvestment: formatCurrency(initialInvestment),
      monthlyPayment: formatCurrency(monthlyPayment),
      totalLoanCost: formatCurrency(totalLoanCost),
      cashFlow: formatCurrency(cashFlow),
      capRate: `${capRate}%`,
      cocReturn: `${cocReturn}%`,
      roi: `${roi}%`,
      dscr,
      affordabilityScore: `${affordabilityScore}%`,
      yearsToSave,
      scenarios: scenarioResults,
      affordabilityAnalysis,
      savingsOptimizer,
      investmentOptimizer,
      riskAnalysis,
      sensitivity: `Monthly payment ranges from ${currency} ${sensitivity[0].payment} at ${
        sensitivity[0].downPayment
      }% down to ${currency} ${sensitivity[sensitivity.length - 1].payment} at ${
        sensitivity[sensitivity.length - 1].downPayment
      }% down.`,
    });

    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        keyMetric: "Down Payment",
        value: formatCurrency(downPaymentAmount),
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("downPaymentHistory", JSON.stringify(newHistory));

    alert("Charts and PDF export not implemented in this demo.");
  };

  const saveCalculation = () => {
    if (results) {
      setSuccess("Calculation saved to history!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("No valid calculation to save.");
    }
  };

  const handleScenarioChange = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = { ...newScenarios[index], [field]: value };
    setScenarios(newScenarios);
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4">
      <div
        className={`bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in ${
          isDarkMode ? "dark:bg-gray-800" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Advanced Down Payment Calculator</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
          >
            Toggle Dark Mode
          </button>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Loan & Home Details</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Enter details to calculate your down payment and loan affordability.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Currency",
              type: "select",
              value: currency,
              onChange: setCurrency,
              options: ["USD", "PKR", "INR"],
              tooltip: "Choose your currency.",
            },
            {
              label: "Loan Type",
              type: "select",
              value: loanType,
              onChange: setLoanType,
              options: ["conventional", "fha", "va"],
              tooltip: "Select the type of mortgage loan.",
            },
            {
              label: "Home Price",
              type: "number",
              value: homePrice,
              onChange: setHomePrice,
              step: "0.01",
              min: "0",
              tooltip: "Purchase price of the home.",
            },
            {
              label: "Down Payment (%)",
              type: "number",
              value: downPayment,
              onChange: setDownPayment,
              step: "0.1",
              min: "0",
              max: "100",
              disabled: loanType === "va",
              tooltip: "Percentage of price paid upfront.",
            },
            {
              label: "Credit Score",
              type: "number",
              value: creditScore,
              onChange: setCreditScore,
              step: "1",
              min: "500",
              max: "850",
              tooltip: "Your credit score (500-850).",
            },
            {
              label: "Interest Rate (%)",
              type: "number",
              value: interestRate,
              onChange: setInterestRate,
              step: "0.01",
              min: "0",
              tooltip: "Annual loan interest rate.",
            },
            {
              label: "Loan Term (Years)",
              type: "select",
              value: loanTerm,
              onChange: setLoanTerm,
              options: ["15", "30"],
              tooltip: "Duration of the loan.",
            },
            {
              label: "Upfront MIP (%)",
              type: "number",
              value: upfrontMip,
              onChange: setUpfrontMip,
              step: "0.01",
              min: "0",
              disabled: loanType !== "fha",
              tooltip: "FHA upfront mortgage insurance premium (FHA only).",
            },
            {
              label: "Annual MIP (%)",
              type: "number",
              value: annualMip,
              onChange: setAnnualMip,
              step: "0.01",
              min: "0",
              disabled: loanType !== "fha",
              tooltip: "Annual mortgage insurance premium (FHA only).",
            },
            {
              label: "Closing Costs",
              type: "number",
              value: closingCosts,
              onChange: setClosingCosts,
              step: "0.01",
              min: "0",
              tooltip: "Fees for loan closing.",
            },
            {
              label: "Annual Property Taxes",
              type: "number",
              value: propertyTaxes,
              onChange: setPropertyTaxes,
              step: "0.01",
              min: "0",
              tooltip: "Yearly property tax amount.",
            },
            {
              label: "Annual Homeowners Insurance",
              type: "number",
              value: insurance,
              onChange: setInsurance,
              step: "0.01",
              min: "0",
              tooltip: "Yearly insurance cost.",
            },
            {
              label: "Annual HOA Fees",
              type: "number",
              value: hoa,
              onChange: setHoa,
              step: "0.01",
              min: "0",
              tooltip: "Yearly HOA fees, if applicable.",
            },
          ].map(({ label, type, value, onChange, options, step, min, max, disabled, tooltip }) => (
            <div key={label} className="relative">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                {label}
                <span className="tooltip inline-block ml-1">
                  ?
                  <span className="tooltiptext absolute hidden bg-gray-600 text-white text-xs rounded p-2 w-48 -ml-24 -mt-10 z-10 group-hover:block">
                    {tooltip}
                  </span>
                </span>
              </label>
              {type === "select" ? (
                <select
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-red-500 focus:border-red-500"
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "conventional"
                        ? "Conventional"
                        : opt === "fha"
                        ? "FHA"
                        : opt === "va"
                        ? "VA"
                        : `${opt} Years`}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  step={step}
                  min={min}
                  max={max}
                  disabled={disabled}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                />
              )}
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-4">
          Affordability Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Monthly Income",
              type: "number",
              value: monthlyIncome,
              onChange: setMonthlyIncome,
              step: "0.01",
              min: "0",
              tooltip: "Your total monthly income.",
            },
            {
              label: "Monthly Debts",
              type: "number",
              value: monthlyDebts,
              onChange: setMonthlyDebts,
              step: "0.01",
              min: "0",
              tooltip: "Existing monthly debt payments.",
            },
            {
              label: "Target DTI (%)",
              type: "number",
              value: targetDti,
              onChange: setTargetDti,
              step: "0.1",
              min: "0",
              max: "100",
              tooltip: "Desired debt-to-income ratio.",
            },
          ].map(({ label, type, value, onChange, step, min, max, tooltip }) => (
            <div key={label} className="relative">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                {label}
                <span className="tooltip inline-block ml-1">
                  ?
                  <span className="tooltiptext absolute hidden bg-gray-600 text-white text-xs rounded p-2 w-48 -ml-24 -mt-10 z-10 group-hover:block">
                    {tooltip}
                  </span>
                </span>
              </label>
              <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                step={step}
                min={min}
                max={max}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-4">
          Investment Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Monthly Rent",
              type: "number",
              value: monthlyRent,
              onChange: setMonthlyRent,
              step: "0.01",
              min: "0",
              tooltip: "Monthly rental income (if applicable).",
            },
            {
              label: "Vacancy Rate (%)",
              type: "number",
              value: vacancyRate,
              onChange: setVacancyRate,
              step: "0.1",
              min: "0",
              max: "100",
              tooltip: "Percentage of time property is unoccupied.",
            },
            {
              label: "Property Management (%)",
              type: "number",
              value: management,
              onChange: setManagement,
              step: "0.1",
              min: "0",
              max: "100",
              tooltip: "Percentage of rent for management fees.",
            },
            {
              label: "Annual Appreciation (%)",
              type: "number",
              value: appreciation,
              onChange: setAppreciation,
              step: "0.1",
              min: "0",
              tooltip: "Expected annual property value increase.",
            },
            {
              label: "Holding Period (Years)",
              type: "number",
              value: holdingPeriod,
              onChange: setHoldingPeriod,
              step: "1",
              min: "1",
              tooltip: "Years you plan to own the property.",
            },
          ].map(({ label, type, value, onChange, step, min, max, tooltip }) => (
            <div key={label} className="relative">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                {label}
                <span className="tooltip inline-block ml-1">
                  ?
                  <span className="tooltiptext absolute hidden bg-gray-600 text-white text-xs rounded p-2 w-48 -ml-24 -mt-10 z-10 group-hover:block">
                    {tooltip}
                  </span>
                </span>
              </label>
              <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                step={step}
                min={min}
                max={max}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-4">Savings Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Current Savings",
              type: "number",
              value: currentSavings,
              onChange: setCurrentSavings,
              step: "0.01",
              min: "0",
              tooltip: "Your current savings for down payment.",
            },
            {
              label: "Monthly Savings",
              type: "number",
              value: monthlySavings,
              onChange: setMonthlySavings,
              step: "0.01",
              min: "0",
              tooltip: "Amount saved monthly for down payment.",
            },
            {
              label: "Savings Interest Rate (%)",
              type: "number",
              value: savingsRate,
              onChange: setSavingsRate,
              step: "0.01",
              min: "0",
              tooltip: "Annual interest rate on savings.",
            },
          ].map(({ label, type, value, onChange, step, min, tooltip }) => (
            <div key={label} className="relative">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                {label}
                <span className="tooltip inline-block ml-1">
                  ?
                  <span className="tooltiptext absolute hidden bg-gray-600 text-white text-xs rounded p-2 w-48 -ml-24 -mt-10 z-10 group-hover:block">
                    {tooltip}
                  </span>
                </span>
              </label>
              <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                step={step}
                min={min}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-4">
          Scenario Analysis
        </h2>
        {scenarios.map((s, index) => (
          <div key={index} className="border border-gray-200 p-4 mb-4 rounded-lg">
            <h3 className="text-md font-medium text-red-500 mb-2">Scenario {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Home Price",
                  type: "number",
                  value: s.homePrice,
                  onChange: (value) => handleScenarioChange(index, "homePrice", value),
                  step: "0.01",
                  min: "0",
                },
                {
                  label: "Down Payment (%)",
                  type: "number",
                  value: s.downPayment,
                  onChange: (value) => handleScenarioChange(index, "downPayment", value),
                  step: "0.1",
                  min: "0",
                  max: "100",
                },
                {
                  label: "Monthly Rent",
                  type: "number",
                  value: s.rent,
                  onChange: (value) => handleScenarioChange(index, "rent", value),
                  step: "0.01",
                  min: "0",
                },
              ].map(({ label, type, value, onChange, step, min, max }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    step={step}
                    min={min}
                    max={max}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={addScenario}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4"
        >
          Add Scenario
        </button>

        <div className="flex gap-4 mt-6 flex-wrap">
          <button
            onClick={convertCurrency}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Convert Currency
          </button>
          <button onClick={calculate} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">
            Calculate
          </button>
          <button
            onClick={saveCalculation}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Save Calculation
          </button>
        </div>

        {results && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Down Payment & Loan Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Down Payment", value: results.downPayment },
                { label: "Initial Investment", value: results.initialInvestment },
                { label: "Monthly Payment", value: results.monthlyPayment },
                { label: "Total Loan Cost", value: results.totalLoanCost },
                { label: "Annual Cash Flow", value: results.cashFlow },
                { label: "Cap Rate", value: results.capRate },
                { label: "CoC Return", value: results.cocReturn },
                { label: "ROI", value: results.roi },
                { label: "DSCR", value: results.dscr },
                { label: "Affordability Score", value: results.affordabilityScore },
                { label: "Time to Save", value: `${results.yearsToSave} years` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <h3 className="text-md font-medium text-red-500">{label}</h3>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 overflow-x-auto">
              <h3 className="text-md font-medium text-red-500">Scenario Comparison</h3>
              <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2">Scenario</th>
                    <th className="p-2">Down Payment</th>
                    <th className="p-2">Monthly Payment</th>
                    <th className="p-2">CoC Return</th>
                  </tr>
                </thead>
                <tbody>
                  {results.scenarios.map((s, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="p-2">{s.name}</td>
                      <td className="p-2">{formatCurrency(s.downPayment)}</td>
                      <td className="p-2">{formatCurrency(s.monthlyPayment)}</td>
                      <td className="p-2">{s.cocReturn}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {[
              { label: "Affordability Analysis", value: results.affordabilityAnalysis },
              { label: "Savings Optimizer", value: results.savingsOptimizer },
              { label: "Investment Optimizer", value: results.investmentOptimizer },
              { label: "Risk Analysis", value: results.riskAnalysis },
              { label: "Sensitivity Analysis", value: results.sensitivity },
            ].map(({ label, value }) => (
              <div key={label} className="mt-6">
                <h3 className="text-md font-medium text-red-500">{label}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value}</p>
              </div>
            ))}
            {[
              "Initial Investment Breakdown",
              "Loan Balance & Home Value",
              "Cumulative Cash Flow & Savings",
              "Monthly Payment Breakdown",
              "Scenario Metrics Comparison",
            ].map((chart) => (
              <div key={chart} className="mt-6">
                <h3 className="text-md font-medium text-red-500">{chart}</h3>
                <p className="text-gray-600">Chart not implemented in this demo.</p>
              </div>
            ))}
            <div className="mt-6">
              <h3 className="text-md font-medium text-red-500">Calculation History</h3>
              <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2">Date</th>
                    <th className="p-2">Key Metric</th>
                    <th className="p-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="p-2">{h.date}</td>
                      <td className="p-2">{h.keyMetric}</td>
                      <td className="p-2">{h.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={() => alert("CSV export not implemented in this demo.")}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Export CSV
              </button>
              <button
                onClick={() => alert("PDF export not implemented in this demo.")}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Export PDF
              </button>
            </div>
          </div>
        )}

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
          .tooltip:hover .tooltiptext {
            display: block;
          }
          @media (max-width: 640px) {
            .flex-wrap {
              flex-direction: column;
            }
            button {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
