"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [pensionType, setPensionType] = useState("defined-contribution");
  const [currentBalance, setCurrentBalance] = useState("");
  const [annualSalary, setAnnualSalary] = useState("");
  const [employeeContribution, setEmployeeContribution] = useState("");
  const [employerContribution, setEmployerContribution] = useState("");
  const [salaryGrowth, setSalaryGrowth] = useState("");
  const [investmentPeriod, setInvestmentPeriod] = useState("");
  const [returnRate, setReturnRate] = useState("");
  const [compounding, setCompounding] = useState("annually");
  const [benefitFormula, setBenefitFormula] = useState("");
  const [serviceYears, setServiceYears] = useState("");
  const [finalSalary, setFinalSalary] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [retirementYears, setRetirementYears] = useState("");
  const [annuityRate, setAnnuityRate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [projectionData, setProjectionData] = useState([]);
  const [history, setHistory] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[curr]}${parseFloat(amount || 0).toFixed(2)}`;
  };

  const calculatePension = () => {
    const parsedInflationRate = parseFloat(inflationRate) / 100 || 0;
    const parsedRetirementYears = parseInt(retirementYears) || 20;
    const parsedAnnuityRate = parseFloat(annuityRate) / 100 || 0.04;
    let finalBalance = 0,
      realBalance = 0,
      annualPensionIncome = 0,
      monthlyPensionIncome = 0;
    let totalEmployeeContributions = 0,
      totalEmployerContributions = 0,
      totalInterest = 0;

    if (pensionType === "defined-contribution") {
      const parsedCurrentBalance = parseFloat(currentBalance) || 0;
      let parsedAnnualSalary = parseFloat(annualSalary) || 0;
      const parsedEmployeeContribution = parseFloat(employeeContribution) / 100 || 0;
      const parsedEmployerContribution = parseFloat(employerContribution) / 100 || 0;
      const parsedSalaryGrowth = parseFloat(salaryGrowth) / 100 || 0;
      const parsedInvestmentPeriod = parseInt(investmentPeriod);
      const parsedReturnRate = parseFloat(returnRate) / 100;

      if (isNaN(parsedInvestmentPeriod) || parsedInvestmentPeriod <= 0) {
        alert("Please enter a valid investment period");
        return;
      }
      if (isNaN(parsedReturnRate) || parsedReturnRate < 0) {
        alert("Please enter a valid return rate");
        return;
      }
      if (parsedAnnualSalary <= 0 && parsedCurrentBalance <= 0) {
        alert("Please enter a valid salary or current balance");
        return;
      }

      const compoundingPeriods = {
        annually: 1,
        "semi-annually": 2,
        quarterly: 4,
        monthly: 12,
      };
      const n = compoundingPeriods[compounding];
      const ratePerPeriod = parsedReturnRate / n;

      let balance = parsedCurrentBalance;
      const newProjectionData = [];
      const nominalBalances = [balance];
      const realBalances = [balance / Math.pow(1 + parsedInflationRate, 0)];

      for (let year = 1; year <= parsedInvestmentPeriod; year++) {
        let yearBalance = balance;
        let yearInterest = 0;
        let yearEmployeeContribution = parsedAnnualSalary * parsedEmployeeContribution;
        let yearEmployerContribution = parsedAnnualSalary * parsedEmployerContribution;
        let monthlyEmployeeContribution = yearEmployeeContribution / 12;
        let monthlyEmployerContribution = yearEmployerContribution / 12;

        for (let period = 1; period <= n; period++) {
          let periodContribution =
            period % (n / 12) === 0 ? monthlyEmployeeContribution + monthlyEmployerContribution : 0;
          let interest = yearBalance * ratePerPeriod;
          yearInterest += interest;
          yearBalance = yearBalance * (1 + ratePerPeriod) + periodContribution;
        }

        balance = yearBalance;
        totalEmployeeContributions += yearEmployeeContribution;
        totalEmployerContributions += yearEmployerContribution;
        totalInterest += yearInterest;
        newProjectionData.push({
          year,
          employeeContribution: yearEmployeeContribution,
          employerContribution: yearEmployerContribution,
          interest: yearInterest,
          balance,
        });
        nominalBalances.push(balance);
        realBalances.push(balance / Math.pow(1 + parsedInflationRate, year));
        parsedAnnualSalary *= 1 + parsedSalaryGrowth;
      }

      finalBalance = balance;
      realBalance = finalBalance / Math.pow(1 + parsedInflationRate, parsedInvestmentPeriod);
      annualPensionIncome = finalBalance * parsedAnnuityRate;
      monthlyPensionIncome = annualPensionIncome / 12;

      setResults({
        initialBalance: parsedCurrentBalance,
        totalEmployeeContributions,
        totalEmployerContributions,
        totalInterest,
        finalBalance,
        realBalance,
        annualPensionIncome,
        monthlyPensionIncome,
      });
      setProjectionData(newProjectionData);

      alert("Charts not implemented in this demo.");
    } else {
      const parsedBenefitFormula = parseFloat(benefitFormula) / 100 || 0;
      const parsedServiceYears = parseInt(serviceYears) || 0;
      const parsedFinalSalary = parseFloat(finalSalary) || 0;

      if (isNaN(parsedBenefitFormula) || parsedBenefitFormula <= 0) {
        alert("Please enter a valid benefit formula percentage");
        return;
      }
      if (isNaN(parsedServiceYears) || parsedServiceYears <= 0) {
        alert("Please enter a valid number of service years");
        return;
      }
      if (isNaN(parsedFinalSalary) || parsedFinalSalary <= 0) {
        alert("Please enter a valid final average salary");
        return;
      }

      annualPensionIncome = parsedFinalSalary * parsedBenefitFormula * parsedServiceYears;
      monthlyPensionIncome = annualPensionIncome / 12;
      finalBalance = annualPensionIncome * parsedRetirementYears;
      realBalance = finalBalance / Math.pow(1 + parsedInflationRate, parsedRetirementYears / 2);

      setResults({
        initialBalance: 0,
        totalEmployeeContributions: 0,
        totalEmployerContributions: 0,
        totalInterest: 0,
        finalBalance,
        realBalance,
        annualPensionIncome,
        monthlyPensionIncome,
      });
      setProjectionData([]);

      alert("Charts not implemented in this demo.");
    }

    const calculation = {
      timestamp: new Date().toLocaleString(),
      pensionType,
      initialBalance: formatCurrency(
        pensionType === "defined-contribution" ? parseFloat(currentBalance) || 0 : 0,
        currency
      ),
      totalEmployeeContributions: formatCurrency(totalEmployeeContributions, currency),
      totalEmployerContributions: formatCurrency(totalEmployerContributions, currency),
      totalInterest: formatCurrency(totalInterest, currency),
      finalBalance: formatCurrency(finalBalance, currency),
      realBalance: formatCurrency(realBalance, currency),
      annualPensionIncome: formatCurrency(annualPensionIncome, currency),
      monthlyPensionIncome: formatCurrency(monthlyPensionIncome, currency),
      inputs:
        pensionType === "defined-contribution"
          ? {
              annualSalary: formatCurrency(parseFloat(annualSalary) || 0, currency),
              employeeContribution: `${(parseFloat(employeeContribution) || 0).toFixed(2)}%`,
              employerContribution: `${(parseFloat(employerContribution) || 0).toFixed(2)}%`,
              salaryGrowth: `${(parseFloat(salaryGrowth) || 0).toFixed(2)}%`,
              investmentPeriod: `${parseInt(investmentPeriod) || 0} years`,
              returnRate: `${(parseFloat(returnRate) || 0).toFixed(2)}%`,
              compounding,
            }
          : {
              benefitFormula: `${(parseFloat(benefitFormula) || 0).toFixed(2)}%`,
              serviceYears: `${parseInt(serviceYears) || 0} years`,
              finalSalary: formatCurrency(parseFloat(finalSalary) || 0, currency),
            },
      inflationRate: `${(parsedInflationRate * 100).toFixed(2)}%`,
      retirementYears: `${parsedRetirementYears} years`,
      annuityRate: `${(parsedAnnuityRate * 100).toFixed(2)}%`,
    };
    setHistory([...history, calculation]);
  };

  const compareScenarios = () => {
    const parsedInflationRate = parseFloat(inflationRate) / 100 || 0;
    const parsedRetirementYears = parseInt(retirementYears) || 20;
    const parsedAnnuityRate = parseFloat(annuityRate) / 100 || 0.04;

    if (pensionType === "defined-contribution") {
      const parsedCurrentBalance = parseFloat(currentBalance) || 0;
      let parsedAnnualSalary = parseFloat(annualSalary) || 0;
      const parsedEmployeeContribution = parseFloat(employeeContribution) / 100 || 0;
      const parsedEmployerContribution = parseFloat(employerContribution) / 100 || 0;
      const parsedSalaryGrowth = parseFloat(salaryGrowth) / 100 || 0;
      const parsedInvestmentPeriod = parseInt(investmentPeriod);
      const parsedReturnRate = parseFloat(returnRate) / 100;

      if (isNaN(parsedInvestmentPeriod) || isNaN(parsedReturnRate)) {
        alert("Please calculate pension first");
        return;
      }

      const compoundingPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
      const n = compoundingPeriods[compounding];

      const scenarios = [
        {
          label: "Base Case",
          returnRate: parsedReturnRate,
          employeeContributionRate: parsedEmployeeContribution,
        },
        {
          label: "Higher Return (+1%)",
          returnRate: parsedReturnRate + 0.01,
          employeeContributionRate: parsedEmployeeContribution,
        },
        {
          label: "Lower Return (-1%)",
          returnRate: Math.max(parsedReturnRate - 0.01, 0),
          employeeContributionRate: parsedEmployeeContribution,
        },
        {
          label: "Higher Contribution (+2%)",
          returnRate: parsedReturnRate,
          employeeContributionRate: parsedEmployeeContribution + 0.02,
        },
      ];

      const newComparisonData = scenarios.map((scenario) => {
        let balance = parsedCurrentBalance;
        let scenarioSalary = parsedAnnualSalary;
        const ratePerPeriod = scenario.returnRate / n;

        for (let year = 1; year <= parsedInvestmentPeriod; year++) {
          let yearBalance = balance;
          let yearEmployeeContribution = scenarioSalary * scenario.employeeContributionRate;
          let yearEmployerContribution = scenarioSalary * parsedEmployerContribution;
          let monthlyEmployeeContribution = yearEmployeeContribution / 12;
          let monthlyEmployerContribution = yearEmployerContribution / 12;

          for (let period = 1; period <= n; period++) {
            let periodContribution =
              period % (n / 12) === 0 ? monthlyEmployeeContribution + monthlyEmployerContribution : 0;
            let interest = yearBalance * ratePerPeriod;
            yearBalance = yearBalance * (1 + ratePerPeriod) + periodContribution;
          }

          balance = yearBalance;
          scenarioSalary *= 1 + parsedSalaryGrowth;
        }

        const finalBalance = balance;
        const realBalance = finalBalance / Math.pow(1 + parsedInflationRate, parsedInvestmentPeriod);
        const annualIncome = finalBalance * parsedAnnuityRate;
        return { label: scenario.label, finalBalance, realBalance, annualIncome };
      });

      setComparisonData(newComparisonData);
    } else {
      const parsedBenefitFormula = parseFloat(benefitFormula) / 100 || 0;
      const parsedServiceYears = parseInt(serviceYears) || 0;
      const parsedFinalSalary = parseFloat(finalSalary) || 0;

      if (isNaN(parsedBenefitFormula) || isNaN(parsedServiceYears) || isNaN(parsedFinalSalary)) {
        alert("Please calculate pension first");
        return;
      }

      const scenarios = [
        {
          label: "Base Case",
          benefitFormula: parsedBenefitFormula,
          serviceYears: parsedServiceYears,
          finalSalary: parsedFinalSalary,
        },
        {
          label: "Higher Benefit (+0.5%)",
          benefitFormula: parsedBenefitFormula + 0.005,
          serviceYears: parsedServiceYears,
          finalSalary: parsedFinalSalary,
        },
        {
          label: "More Service (+5 Years)",
          benefitFormula: parsedBenefitFormula,
          serviceYears: parsedServiceYears + 5,
          finalSalary: parsedFinalSalary,
        },
        {
          label: "Higher Salary (+10%)",
          benefitFormula: parsedBenefitFormula,
          serviceYears: parsedServiceYears,
          finalSalary: parsedFinalSalary * 1.1,
        },
      ];

      const newComparisonData = scenarios.map((scenario) => {
        const annualIncome = scenario.finalSalary * scenario.benefitFormula * scenario.serviceYears;
        const finalBalance = annualIncome * parsedRetirementYears;
        const realBalance = finalBalance / Math.pow(1 + parsedInflationRate, parsedRetirementYears / 2);
        return { label: scenario.label, finalBalance, realBalance, annualIncome };
      });

      setComparisonData(newComparisonData);
    }
  };

  const exportProjections = () => {
    if (projectionData.length === 0) {
      alert("No projection data to export");
      return;
    }

    const csvContent = [
      "Year,Employee Contribution,Employer Contribution,Interest,Balance",
      ...projectionData.map(
        (item) =>
          `${item.year},${item.employeeContribution.toFixed(2)},${item.employerContribution.toFixed(
            2
          )},${item.interest.toFixed(2)},${item.balance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pension_projections.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white  p-5 flex justify-center items-start">
      <div className="bg-gray-100 rounded-xl shadow-2xl p-6 max-w-5xl w-full flex gap-6 flex-col md:flex-row">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-5">Advanced Pension Calculator</h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="pension-type" className="block text-sm font-medium text-gray-700 mb-1">
                Pension Type
              </label>
              <select
                id="pension-type"
                value={pensionType}
                onChange={(e) => setPensionType(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
              >
                <option value="defined-contribution">Defined Contribution</option>
                <option value="defined-benefit">Defined Benefit</option>
              </select>
            </div>
            {pensionType === "defined-contribution" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="current-balance" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Pension Balance ($)
                  </label>
                  <input
                    id="current-balance"
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                    placeholder="Enter current balance"
                    step="100"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="annual-salary" className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Salary ($)
                  </label>
                  <input
                    id="annual-salary"
                    type="number"
                    value={annualSalary}
                    onChange={(e) => setAnnualSalary(e.target.value)}
                    placeholder="Enter annual salary"
                    step="1000"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="employee-contribution"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Employee Contribution (%)
                  </label>
                  <input
                    id="employee-contribution"
                    type="number"
                    value={employeeContribution}
                    onChange={(e) => setEmployeeContribution(e.target.value)}
                    placeholder="Enter contribution percentage"
                    step="0.1"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="employer-contribution"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Employer Contribution (%)
                  </label>
                  <input
                    id="employer-contribution"
                    type="number"
                    value={employerContribution}
                    onChange={(e) => setEmployerContribution(e.target.value)}
                    placeholder="Enter employer contribution percentage"
                    step="0.1"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="salary-growth" className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Salary Growth Rate (%)
                  </label>
                  <input
                    id="salary-growth"
                    type="number"
                    value={salaryGrowth}
                    onChange={(e) => setSalaryGrowth(e.target.value)}
                    placeholder="Enter salary growth rate"
                    step="0.01"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="investment-period" className="block text-sm font-medium text-gray-700 mb-1">
                    Years Until Retirement
                  </label>
                  <input
                    id="investment-period"
                    type="number"
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(e.target.value)}
                    placeholder="Enter years until retirement"
                    step="1"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="return-rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Annual Return Rate (%)
                  </label>
                  <input
                    id="return-rate"
                    type="number"
                    value={returnRate}
                    onChange={(e) => setReturnRate(e.target.value)}
                    placeholder="Enter return rate"
                    step="0.01"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="compounding" className="block text-sm font-medium text-gray-700 mb-1">
                    Compounding Frequency
                  </label>
                  <select
                    id="compounding"
                    value={compounding}
                    onChange={(e) => setCompounding(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="annually">Annually</option>
                    <option value="semi-annually">Semi-Annually</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            )}
            {pensionType === "defined-benefit" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="benefit-formula" className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Benefit Formula (% of Salary)
                  </label>
                  <input
                    id="benefit-formula"
                    type="number"
                    value={benefitFormula}
                    onChange={(e) => setBenefitFormula(e.target.value)}
                    placeholder="Enter benefit percentage"
                    step="0.1"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="service-years" className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Service
                  </label>
                  <input
                    id="service-years"
                    type="number"
                    value={serviceYears}
                    onChange={(e) => setServiceYears(e.target.value)}
                    placeholder="Enter years of service"
                    step="1"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="final-salary" className="block text-sm font-medium text-gray-700 mb-1">
                    Final Average Salary ($)
                  </label>
                  <input
                    id="final-salary"
                    type="number"
                    value={finalSalary}
                    onChange={(e) => setFinalSalary(e.target.value)}
                    placeholder="Enter final average salary"
                    step="1000"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="inflation-rate" className="block text-sm font-medium text-gray-700 mb-1">
                Inflation Rate (%)
              </label>
              <input
                id="inflation-rate"
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                placeholder="Enter inflation rate"
                step="0.01"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="retirement-years" className="block text-sm font-medium text-gray-700 mb-1">
                Retirement Years (Life Expectancy)
              </label>
              <input
                id="retirement-years"
                type="number"
                value={retirementYears}
                onChange={(e) => setRetirementYears(e.target.value)}
                placeholder="Enter retirement years"
                step="1"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="annuity-rate" className="block text-sm font-medium text-gray-700 mb-1">
                Annuity Rate (%)
              </label>
              <input
                id="annuity-rate"
                type="number"
                value={annuityRate}
                onChange={(e) => setAnnuityRate(e.target.value)}
                placeholder="Enter annuity rate"
                step="0.01"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
              >
                <option value="USD">$ USD</option>
                <option value="CAD">$ CAD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>
            <button
              onClick={calculatePension}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:-translate-y-0.5 transition"
            >
              Calculate Pension
            </button>
            {results && (
              <div className="bg-gray-200 p-5 rounded-lg mt-5">
                <p className="text-gray-700">
                  <strong>Initial Balance:</strong> {formatCurrency(results.initialBalance)}
                </p>
                <p className="text-gray-700">
                  <strong>Total Employee Contributions:</strong>{" "}
                  {formatCurrency(results.totalEmployeeContributions)}
                </p>
                <p className="text-gray-700">
                  <strong>Total Employer Contributions:</strong>{" "}
                  {formatCurrency(results.totalEmployerContributions)}
                </p>
                <p className="text-gray-700">
                  <strong>Total Interest Earned:</strong> {formatCurrency(results.totalInterest)}
                </p>
                <p className="text-gray-700">
                  <strong>Final Pension Balance:</strong> {formatCurrency(results.finalBalance)}
                </p>
                <p className="text-gray-700">
                  <strong>Real Balance (Inflation-Adjusted):</strong> {formatCurrency(results.realBalance)}
                </p>
                <p className="text-gray-700">
                  <strong>Annual Pension Income:</strong> {formatCurrency(results.annualPensionIncome)}
                </p>
                <p className="text-gray-700">
                  <strong>Monthly Pension Income:</strong> {formatCurrency(results.monthlyPensionIncome)}
                </p>
              </div>
            )}
            <div className="mt-5 text-center text-gray-600">
              Growth and breakdown charts not implemented in this demo.
            </div>
          </div>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-5">Projections & History</h1>
          {projectionData.length > 0 && (
            <table className="w-full border-collapse rounded-lg overflow-hidden bg-white">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3 text-right">Year</th>
                  <th className="p-3 text-right">Employee Contribution</th>
                  <th className="p-3 text-right">Employer Contribution</th>
                  <th className="p-3 text-right">Interest</th>
                  <th className="p-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {projectionData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-3 text-right">{item.year}</td>
                    <td className="p-3 text-right">{formatCurrency(item.employeeContribution)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.employerContribution)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.interest)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="space-y-4 mt-5">
            {history.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <p className="text-gray-700">
                  <strong>Date:</strong> {item.timestamp}
                </p>
                <p className="text-gray-700">
                  <strong>Pension Type:</strong> {item.pensionType}
                </p>
                <p className="text-gray-700">
                  <strong>Initial Balance:</strong> {item.initialBalance}
                </p>
                <p className="text-gray-700">
                  <strong>Total Employee Contributions:</strong> {item.totalEmployeeContributions}
                </p>
                <p className="text-gray-700">
                  <strong>Total Employer Contributions:</strong> {item.totalEmployerContributions}
                </p>
                <p className="text-gray-700">
                  <strong>Total Interest:</strong> {item.totalInterest}
                </p>
                <p className="text-gray-700">
                  <strong>Final Balance:</strong> {item.finalBalance}
                </p>
                <p className="text-gray-700">
                  <strong>Real Balance:</strong> {item.realBalance}
                </p>
                <p className="text-gray-700">
                  <strong>Annual Pension Income:</strong> {item.annualPensionIncome}
                </p>
                <p className="text-gray-700">
                  <strong>Monthly Pension Income:</strong> {item.monthlyPensionIncome}
                </p>
                <p className="text-gray-700">
                  <strong>Inputs:</strong>
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  {Object.entries(item.inputs).map(([key, value]) => (
                    <li key={key}>{`${key}: ${value}`}</li>
                  ))}
                </ul>
                <p className="text-gray-700">
                  <strong>Inflation Rate:</strong> {item.inflationRate}
                </p>
                <p className="text-gray-700">
                  <strong>Retirement Years:</strong> {item.retirementYears}
                </p>
                <p className="text-gray-700">
                  <strong>Annuity Rate:</strong> {item.annuityRate}
                </p>
              </div>
            ))}
          </div>
          {comparisonData.length > 0 && (
            <table className="w-full border-collapse rounded-lg overflow-hidden bg-white mt-5">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3 text-right">Scenario</th>
                  <th className="p-3 text-right">Final Balance</th>
                  <th className="p-3 text-right">Real Balance</th>
                  <th className="p-3 text-right">Annual Income</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-3 text-right">{item.label}</td>
                    <td className="p-3 text-right">{formatCurrency(item.finalBalance)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.realBalance)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.annualIncome)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            onClick={exportProjections}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:-translate-y-0.5 transition mt-5"
          >
            Export Projections (CSV)
          </button>
          <button
            onClick={compareScenarios}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:-translate-y-0.5 transition mt-2"
          >
            Compare Scenarios
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
          .flex-col {
            flex-direction: column;
          }
          .max-h-[700px] {
            max-height: 500px;
          }
          table {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
