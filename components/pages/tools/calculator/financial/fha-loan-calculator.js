"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [formData, setFormData] = useState({
    currency: "USD",
    homePrice: "300000",
    creditScore: "580",
    downPayment: "3.5",
    interestRate: "6",
    loanTerm: "30",
    upfrontMip: "1.75",
    annualMip: "0.55",
    loanLimit: "498257",
    closingCosts: "6000",
    propertyTaxes: "3000",
    insurance: "1200",
    hoa: "0",
    monthlyIncome: "6000",
    monthlyDebts: "1000",
    targetDti: "43",
    monthlyRent: "2000",
    vacancyRate: "5",
    management: "8",
    appreciation: "3",
    holdingPeriod: "10",
  });
  const [scenarios, setScenarios] = useState([
    { id: 1, homePrice: "300000", interestRate: "6", rent: "2000" },
  ]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [theme, setTheme] = useState("light");
  const [history, setHistory] = useState([]);
  const paymentPieChartRef = useRef(null);
  const balanceLineChartRef = useRef(null);
  const equityAreaChartRef = useRef(null);
  const investmentDonutChartRef = useRef(null);
  const metricsBarChartRef = useRef(null);
  let paymentPieChart, balanceLineChart, equityAreaChart, investmentDonutChart, metricsBarChart;

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("fhaHistory")) || [];
    setHistory(savedHistory);

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    if (paymentPieChartRef.current) {
      paymentPieChart = new Chart(paymentPieChartRef.current, {
        type: "pie",
        data: {
          labels: [],
          datasets: [{ data: [], backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"] }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Monthly Payment Breakdown" },
          },
        },
      });
    }
    if (balanceLineChartRef.current) {
      balanceLineChart = new Chart(balanceLineChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Loan Balance",
              data: [],
              borderColor: "#ef4444",
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              yAxisID: "y",
            },
            {
              label: "Home Value",
              data: [],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              yAxisID: "y",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Year" } },
            y: { title: { display: true, text: "Amount" } },
          },
          plugins: { title: { display: true, text: "Loan Balance & Home Value" } },
        },
      });
    }
    if (equityAreaChartRef.current) {
      equityAreaChart = new Chart(equityAreaChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Cumulative Cash Flow",
              data: [],
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.4)",
              fill: true,
              yAxisID: "y",
            },
            {
              label: "Net Equity",
              data: [],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.4)",
              fill: true,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Year" } },
            y: { title: { display: true, text: "Cumulative Cash Flow" } },
            y1: {
              position: "right",
              title: { display: true, text: "Net Equity" },
              grid: { drawOnChartArea: false },
            },
          },
          plugins: { title: { display: true, text: "Cumulative Cash Flow & Equity" } },
        },
      });
    }
    if (investmentDonutChartRef.current) {
      investmentDonutChart = new Chart(investmentDonutChartRef.current, {
        type: "doughnut",
        data: { labels: [], datasets: [{ data: [], backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"] }] },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Initial Investment Breakdown" },
          },
        },
      });
    }
    if (metricsBarChartRef.current) {
      metricsBarChart = new Chart(metricsBarChartRef.current, {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            { label: "Cap Rate (%)", data: [], backgroundColor: "#3b82f6" },
            { label: "CoC Return (%)", data: [], backgroundColor: "#10b981" },
          ],
        },
        options: {
          responsive: true,
          scales: { y: { title: { display: true, text: "Percentage (%)" } } },
          plugins: { title: { display: true, text: "Scenario Metrics Comparison" } },
        },
      });
    }
    return () => {
      paymentPieChart?.destroy();
      balanceLineChart?.destroy();
      equityAreaChart?.destroy();
      investmentDonutChart?.destroy();
      metricsBarChart?.destroy();
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setError("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([
      ...scenarios,
      { id: scenarios.length + 1, homePrice: "300000", interestRate: "6", rent: "2000" },
    ]);
  };

  const updateScenario = (id, field, value) => {
    setScenarios(scenarios.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const convertCurrency = () => {
    setError("");
    const rates = { USD: 1, PKR: 277.95, INR: 83.95 };
    const currentCurrency = formData.currency;
    const newCurrency = currentCurrency === "USD" ? "PKR" : currentCurrency === "PKR" ? "INR" : "USD";
    const fields = [
      "homePrice",
      "closingCosts",
      "propertyTaxes",
      "insurance",
      "hoa",
      "monthlyIncome",
      "monthlyDebts",
      "monthlyRent",
      "loanLimit",
    ];
    const newFormData = { ...formData, currency: newCurrency };
    fields.forEach((field) => {
      const value = parseFloat(formData[field]);
      if (!isNaN(value)) {
        newFormData[field] = ((value * rates[newCurrency]) / rates[currentCurrency]).toFixed(2);
      }
    });
    setFormData(newFormData);
    const newScenarios = scenarios.map((s) => ({
      ...s,
      homePrice: ((parseFloat(s.homePrice) * rates[newCurrency]) / rates[currentCurrency]).toFixed(2),
      rent: ((parseFloat(s.rent) * rates[newCurrency]) / rates[currentCurrency]).toFixed(2),
    }));
    setScenarios(newScenarios);
  };

  const validateInputs = () => {
    const {
      homePrice,
      creditScore,
      downPayment,
      interestRate,
      loanTerm,
      upfrontMip,
      annualMip,
      loanLimit,
      closingCosts,
      propertyTaxes,
      insurance,
      hoa,
      monthlyIncome,
      monthlyDebts,
      targetDti,
      monthlyRent,
      vacancyRate,
      management,
      appreciation,
      holdingPeriod,
    } = formData;
    if (Object.values(formData).some((v) => v === "" || isNaN(parseFloat(v))))
      return "Please provide valid inputs.";
    if (parseFloat(homePrice) <= 0 || parseFloat(monthlyIncome) <= 0)
      return "Home price and income must be positive.";
    if (parseFloat(creditScore) < 500 || parseFloat(creditScore) > 850)
      return "Credit score must be between 500 and 850.";
    if (
      (parseFloat(creditScore) >= 580 && parseFloat(downPayment) < 3.5) ||
      (parseFloat(creditScore) < 580 && parseFloat(downPayment) < 10)
    )
      return `Down payment must be at least ${
        parseFloat(creditScore) >= 580 ? "3.5%" : "10%"
      } for credit score ${creditScore}.`;
    if (
      parseFloat(downPayment) > 100 ||
      parseFloat(interestRate) < 0 ||
      parseFloat(upfrontMip) < 0 ||
      parseFloat(annualMip) < 0 ||
      parseFloat(loanLimit) <= 0 ||
      parseFloat(closingCosts) < 0 ||
      parseFloat(propertyTaxes) < 0 ||
      parseFloat(insurance) < 0 ||
      parseFloat(hoa) < 0 ||
      parseFloat(monthlyDebts) < 0 ||
      parseFloat(targetDti) < 0 ||
      parseFloat(targetDti) > 100 ||
      parseFloat(vacancyRate) < 0 ||
      parseFloat(vacancyRate) > 100 ||
      parseFloat(management) < 0 ||
      parseFloat(management) > 100 ||
      parseFloat(appreciation) < 0 ||
      parseFloat(holdingPeriod) < 1
    )
      return "Invalid input values (e.g., negative or out-of-range percentages).";
    if (parseInt(loanTerm) !== 15 && parseInt(loanTerm) !== 30) return "Loan term must be 15 or 30 years.";
    return null;
  };

  const calculate = () => {
    setError("");
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const {
      currency,
      homePrice,
      creditScore,
      downPayment,
      interestRate,
      loanTerm,
      upfrontMip,
      annualMip,
      loanLimit,
      closingCosts,
      propertyTaxes,
      insurance,
      hoa,
      monthlyIncome,
      monthlyDebts,
      targetDti,
      monthlyRent,
      vacancyRate,
      management,
      appreciation,
      holdingPeriod,
    } = formData;
    const parsedData = Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, parseFloat(v)]));

    // Loan Calculations
    const baseLoanAmount = parsedData.homePrice * (1 - parsedData.downPayment / 100);
    const upfrontMipAmount = (baseLoanAmount * parsedData.upfrontMip) / 100;
    const loanAmount = baseLoanAmount + upfrontMipAmount;
    if (loanAmount > parsedData.loanLimit) {
      setError(
        `Loan amount (${currency} ${loanAmount.toFixed(2)}) exceeds FHA loan limit (${currency} ${
          parsedData.loanLimit
        }).`
      );
      return;
    }
    const monthlyRate = parsedData.interestRate / 100 / 12;
    const payments = parsedData.loanTerm * 12;
    const monthlyPI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1);
    const monthlyMip = (loanAmount * parsedData.annualMip) / 100 / 12;
    const monthlyTaxes = parsedData.propertyTaxes / 12;
    const monthlyInsurance = parsedData.insurance / 12;
    const monthlyHoa = parsedData.hoa / 12;
    const monthlyPayment = (monthlyPI + monthlyMip + monthlyTaxes + monthlyInsurance + monthlyHoa).toFixed(2);
    const totalInterest = (monthlyPI * payments - loanAmount).toFixed(2);
    const totalMip = (monthlyMip * payments + upfrontMipAmount).toFixed(2);
    const totalLoanCost = (parseFloat(monthlyPayment) * payments).toFixed(2);

    // Amortization Schedule
    let balance = loanAmount;
    let schedule = [];
    for (let i = 0; i < payments && balance > 0; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPI - interest;
      balance -= principal;
      if (balance < 0) balance = 0;
      if (i % 12 === 0 || i === payments - 1) {
        schedule.push({
          year: (i / 12 + 1).toFixed(1),
          payment: monthlyPI.toFixed(2),
          principal: principal.toFixed(2),
          interest: interest.toFixed(2),
          balance: balance.toFixed(2),
        });
      }
    }

    // Affordability Calculations
    const maxMonthlyPayment =
      (parsedData.monthlyIncome * parsedData.targetDti) / 100 - parsedData.monthlyDebts;
    const maxLoanAmount = Math.min(
      parsedData.loanLimit,
      ((maxMonthlyPayment - monthlyTaxes - monthlyInsurance - monthlyHoa - monthlyMip) *
        (Math.pow(1 + monthlyRate, payments) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, payments))
    );
    const maxHomePrice =
      maxLoanAmount / (1 + parsedData.upfrontMip / 100) / (1 - parsedData.downPayment / 100);
    const affordabilityScore = ((parseFloat(monthlyPayment) / parsedData.monthlyIncome) * 100).toFixed(2);

    // Investment Calculations
    const rentalIncome = parsedData.monthlyRent * 12 * (1 - parsedData.vacancyRate / 100);
    const managementFee = (rentalIncome * parsedData.management) / 100;
    const operatingExpenses = (parsedData.propertyTaxes + parsedData.insurance + managementFee).toFixed(2);
    const noi = (rentalIncome - operatingExpenses).toFixed(2);
    const cashFlow = (noi - monthlyPayment).toFixed(2);
    const capRate = ((noi / parsedData.homePrice) * 100).toFixed(2);
    const initialInvestment = (
      (parsedData.homePrice * parsedData.downPayment) / 100 +
      parsedData.closingCosts +
      upfrontMipAmount
    ).toFixed(2);
    const cocReturn = ((cashFlow / initialInvestment) * 100).toFixed(2);
    const futureValue = (
      parsedData.homePrice * Math.pow(1 + parsedData.appreciation / 100, parsedData.holdingPeriod)
    ).toFixed(2);
    const roi = (
      ((futureValue - loanAmount + cashFlow * parsedData.holdingPeriod - initialInvestment) /
        initialInvestment) *
      100
    ).toFixed(2);
    const annualDebtService = (monthlyPayment * 12).toFixed(2);
    const dscr = (noi / annualDebtService).toFixed(2);

    // Analyzers and Optimizers
    const affordabilityAnalysis =
      affordabilityScore > 43
        ? `High housing cost burden (${affordabilityScore}% of income). Consider a home price below ${currency} ${maxHomePrice.toFixed(
            2
          )}.`
        : `Affordable (${affordabilityScore}% of income). You can afford up to ${currency} ${maxHomePrice.toFixed(
            2
          )}.`;
    const mipOptimizer =
      parsedData.loanTerm === 30 && parsedData.annualMip > 0.45
        ? `Switch to a 15-year loan to reduce Annual MIP to 0.45% and save ${currency} ${(
            ((loanAmount * (parsedData.annualMip - 0.45)) / 100 / 12) *
            payments
          ).toFixed(2)} over the loan term.`
        : `MIP is optimized at ${parsedData.annualMip}% for a ${parsedData.loanTerm}-year loan.`;
    const investmentOptimizer =
      cocReturn < 8
        ? `To achieve CoC Return > 8%, increase rent to ${currency} ${(parsedData.monthlyRent * 1.1).toFixed(
            2
          )} or reduce expenses by ${currency} ${(operatingExpenses * 0.1).toFixed(2)}.`
        : `Strong investment with ${cocReturn}% CoC Return; maintain current strategy.`;
    const riskAnalysis = dscr < 1.2 ? "High risk (DSCR < 1.2)" : "Low risk (DSCR ≥ 1.2)";

    // Sensitivity Analysis
    const sensitivity = [];
    for (
      let rate = parsedData.interestRate * 0.9;
      rate <= parsedData.interestRate * 1.1;
      rate += parsedData.interestRate * 0.1
    ) {
      const sMonthlyPI =
        (loanAmount * (rate / 100 / 12) * Math.pow(1 + rate / 100 / 12, payments)) /
        (Math.pow(1 + rate / 100 / 12, payments) - 1);
      const sMonthlyPayment = (
        sMonthlyPI +
        monthlyMip +
        monthlyTaxes +
        monthlyInsurance +
        monthlyHoa
      ).toFixed(2);
      sensitivity.push({ rate: rate.toFixed(2), payment: sMonthlyPayment });
    }

    // Scenario Analysis
    const scenarioResults = scenarios
      .map((s, i) => {
        const sHomePrice = parseFloat(s.homePrice);
        const sInterestRate = parseFloat(s.interestRate);
        const sRent = parseFloat(s.rent);
        if (isNaN(sHomePrice) || isNaN(sInterestRate) || isNaN(sRent)) return null;
        const sBaseLoan = sHomePrice * (1 - parsedData.downPayment / 100);
        const sUpfrontMip = (sBaseLoan * parsedData.upfrontMip) / 100;
        const sLoanAmount = sBaseLoan + sUpfrontMip;
        const sMonthlyRate = sInterestRate / 100 / 12;
        const sMonthlyPI =
          (sLoanAmount * sMonthlyRate * Math.pow(1 + sMonthlyRate, payments)) /
          (Math.pow(1 + sMonthlyRate, payments) - 1);
        const sMonthlyPayment = (
          sMonthlyPI +
          monthlyMip +
          monthlyTaxes +
          monthlyInsurance +
          monthlyHoa
        ).toFixed(2);
        const sRentalIncome = sRent * 12 * (1 - parsedData.vacancyRate / 100);
        const sManagementFee = (sRentalIncome * parsedData.management) / 100;
        const sNOI = (
          sRentalIncome -
          (parsedData.propertyTaxes + parsedData.insurance + sManagementFee)
        ).toFixed(2);
        const sCapRate = ((sNOI / sHomePrice) * 100).toFixed(2);
        const sInitialInvestment = (
          (sHomePrice * parsedData.downPayment) / 100 +
          parsedData.closingCosts +
          sUpfrontMip
        ).toFixed(2);
        const sCashFlow = (sNOI - sMonthlyPayment).toFixed(2);
        const sCocReturn = ((sCashFlow / sInitialInvestment) * 100).toFixed(2);
        return {
          name: `Scenario ${i + 1}`,
          monthlyPayment: sMonthlyPayment,
          capRate: sCapRate,
          cocReturn: sCocReturn,
        };
      })
      .filter((s) => s);

    const newResults = {
      monthlyPayment: `${currency} ${monthlyPayment}`,
      totalLoanCost: `${currency} ${totalLoanCost}`,
      cashFlow: `${currency} ${cashFlow}`,
      capRate: `${capRate}%`,
      cocReturn: `${cocReturn}%`,
      roi: `${roi}%`,
      dscr,
      affordabilityScore: `${affordabilityScore}%`,
      initialInvestment,
      schedule,
      scenarios: scenarioResults,
      affordabilityAnalysis,
      mipOptimizer,
      investmentOptimizer,
      riskAnalysis,
      sensitivity,
    };
    setResults(newResults);

    // Update Charts
    paymentPieChart.data.labels = ["Principal & Interest", "MIP", "Taxes", "Insurance", "HOA"];
    paymentPieChart.data.datasets[0].data = [
      parseFloat(monthlyPayment) - (monthlyTaxes + monthlyInsurance + monthlyHoa + monthlyMip),
      monthlyMip,
      monthlyTaxes,
      monthlyInsurance,
      monthlyHoa,
    ];
    paymentPieChart.options.scales.y.title.text = `Amount (${currency})`;
    paymentPieChart.update();

    const years = Array.from({ length: parseInt(formData.holdingPeriod) }, (_, i) => i + 1);
    const balances = years.map((i) =>
      parseFloat(schedule[Math.min(Math.floor(i), schedule.length - 1)].balance)
    );
    const homeValues = years.map(
      (i) => parsedData.homePrice * Math.pow(1 + parsedData.appreciation / 100, i)
    );
    balanceLineChart.data.labels = years;
    balanceLineChart.data.datasets[0].data = balances;
    balanceLineChart.data.datasets[1].data = homeValues;
    balanceLineChart.options.scales.y.title.text = `Amount (${currency})`;
    balanceLineChart.update();

    const cumulativeCashFlows = years.map((_, i) => parseFloat(cashFlow) * (i + 1));
    const netEquity = years.map((i) => homeValues[i - 1] - balances[i - 1]);
    equityAreaChart.data.labels = years;
    equityAreaChart.data.datasets[0].data = cumulativeCashFlows;
    equityAreaChart.data.datasets[1].data = netEquity;
    equityAreaChart.options.scales.y.title.text = `Cumulative Cash Flow (${currency})`;
    equityAreaChart.options.scales.y1.title.text = `Net Equity (${currency})`;
    equityAreaChart.update();

    investmentDonutChart.data.labels = ["Down Payment", "Closing Costs", "Upfront MIP"];
    investmentDonutChart.data.datasets[0].data = [
      (parsedData.homePrice * parsedData.downPayment) / 100,
      parsedData.closingCosts,
      (baseLoanAmount * parsedData.upfrontMip) / 100,
    ];
    investmentDonutChart.update();

    metricsBarChart.data.labels = scenarioResults.map((s) => s.name);
    metricsBarChart.data.datasets[0].data = scenarioResults.map((s) => s.capRate);
    metricsBarChart.data.datasets[1].data = scenarioResults.map((s) => s.cocReturn);
    metricsBarChart.update();

    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        keyMetric: "Monthly Payment",
        value: `${currency} ${monthlyPayment}`,
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("fhaHistory", JSON.stringify(newHistory));
  };

  const saveCalculation = () => {
    if (!results) {
      setError("No valid calculation to save.");
      return;
    }
    setSuccess("Calculation saved to history!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Key Metric", "Value"],
      ...history.map((h) => [h.date, h.keyMetric, h.value]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fha_loan_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced FHA Loan Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    history.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text("Note: Visual charts (Pie, Line, Area, Donut, Bar) are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("fha_loan_results.pdf");
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Advanced FHA Loan Calculator</h1>
            <button
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
            >
              Toggle Dark Mode
            </button>
          </div>
          <div
            className={`mb-4 ${error ? "text-red-500" : "text-green-500"} text-sm ${
              error || success ? "" : "hidden"
            }`}
          >
            {error || success}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Loan Details</h2>
          <p className="text-sm text-gray-600 mb-4">Enter details to analyze your FHA loan.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Currency",
                field: "currency",
                type: "select",
                options: ["USD", "PKR", "INR"],
                tooltip: "Choose your currency.",
              },
              {
                label: "Home Price",
                field: "homePrice",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Purchase price of the home.",
              },
              {
                label: "Credit Score",
                field: "creditScore",
                type: "number",
                step: "1",
                min: "500",
                max: "850",
                tooltip: "Your credit score (500-850).",
              },
              {
                label: "Down Payment (%)",
                field: "downPayment",
                type: "number",
                step: "0.1",
                min: "3.5",
                max: "100",
                tooltip: "Percentage of price paid upfront.",
              },
              {
                label: "Interest Rate (%)",
                field: "interestRate",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Annual loan interest rate.",
              },
              {
                label: "Loan Term (Years)",
                field: "loanTerm",
                type: "select",
                options: ["15", "30"],
                tooltip: "Duration of the loan (15 or 30).",
              },
              {
                label: "Upfront MIP (%)",
                field: "upfrontMip",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "FHA upfront mortgage insurance premium.",
              },
              {
                label: "Annual MIP (%)",
                field: "annualMip",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Annual mortgage insurance premium.",
              },
              {
                label: "FHA Loan Limit",
                field: "loanLimit",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Maximum loan amount for your area.",
              },
              {
                label: "Closing Costs",
                field: "closingCosts",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Fees for loan closing.",
              },
              {
                label: "Annual Property Taxes",
                field: "propertyTaxes",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Yearly property tax amount.",
              },
              {
                label: "Annual Homeowners Insurance",
                field: "insurance",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Yearly insurance cost.",
              },
              {
                label: "Annual HOA Fees",
                field: "hoa",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Yearly HOA fees, if applicable.",
              },
            ].map((item) => (
              <div key={item.label} className="tooltip">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {item.label} <span>?</span>
                </label>
                {item.type === "select" ? (
                  <select
                    value={formData[item.field]}
                    onChange={(e) => updateFormData(item.field, e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  >
                    {item.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "15" || opt === "30" ? `${opt} Years` : opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={item.type}
                    value={formData[item.field]}
                    onChange={(e) => updateFormData(item.field, e.target.value)}
                    step={item.step}
                    min={item.min}
                    max={item.max}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  />
                )}
                <span className="tooltiptext">{item.tooltip}</span>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Affordability Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Monthly Income",
                field: "monthlyIncome",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Your total monthly income.",
              },
              {
                label: "Monthly Debts",
                field: "monthlyDebts",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Existing monthly debt payments.",
              },
              {
                label: "Target DTI (%)",
                field: "targetDti",
                type: "number",
                step: "0.1",
                min: "0",
                max: "100",
                tooltip: "Desired debt-to-income ratio.",
              },
            ].map((item) => (
              <div key={item.label} className="tooltip">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {item.label} <span>?</span>
                </label>
                <input
                  type={item.type}
                  value={formData[item.field]}
                  onChange={(e) => updateFormData(item.field, e.target.value)}
                  step={item.step}
                  min={item.min}
                  max={item.max}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                />
                <span className="tooltiptext">{item.tooltip}</span>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Investment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Monthly Rent",
                field: "monthlyRent",
                type: "number",
                step: "0.01",
                min: "0",
                tooltip: "Monthly rental income (if applicable).",
              },
              {
                label: "Vacancy Rate (%)",
                field: "vacancyRate",
                type: "number",
                step: "0.1",
                min: "0",
                max: "100",
                tooltip: "Percentage of time property is unoccupied.",
              },
              {
                label: "Property Management (%)",
                field: "management",
                type: "number",
                step: "0.1",
                min: "0",
                max: "100",
                tooltip: "Percentage of rent for management fees.",
              },
              {
                label: "Annual Appreciation (%)",
                field: "appreciation",
                type: "number",
                step: "0.1",
                min: "0",
                tooltip: "Expected annual property value increase.",
              },
              {
                label: "Holding Period (Years)",
                field: "holdingPeriod",
                type: "number",
                step: "1",
                min: "1",
                tooltip: "Years you plan to own the property.",
              },
            ].map((item) => (
              <div key={item.label} className="tooltip">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {item.label} <span>?</span>
                </label>
                <input
                  type={item.type}
                  value={formData[item.field]}
                  onChange={(e) => updateFormData(item.field, e.target.value)}
                  step={item.step}
                  min={item.min}
                  max={item.max}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                />
                <span className="tooltiptext">{item.tooltip}</span>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Scenario Analysis</h2>
          {scenarios.map((s) => (
            <div key={s.id} className="border p-4 rounded-lg mb-4">
              <h3 className="text-md font-medium text-gray-900 mb-2">Scenario {s.id}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Home Price", field: "homePrice", value: s.homePrice },
                  { label: "Interest Rate (%)", field: "interestRate", value: s.interestRate },
                  { label: "Monthly Rent", field: "rent", value: s.rent },
                ].map((item) => (
                  <div key={item.label}>
                    <label className="block text-sm font-medium text-gray-600 mb-2">{item.label}</label>
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => updateScenario(s.id, item.field, e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
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
            <button
              onClick={calculate}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Loan & Investment Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Monthly Payment", value: results.monthlyPayment },
                  { label: "Total Loan Cost", value: results.totalLoanCost },
                  { label: "Annual Cash Flow", value: results.cashFlow },
                  { label: "Cap Rate", value: results.capRate },
                  { label: "CoC Return", value: results.cocReturn },
                  { label: "ROI", value: results.roi },
                  { label: "DSCR", value: results.dscr },
                  { label: "Affordability Score", value: results.affordabilityScore },
                ].map((item) => (
                  <div key={item.label}>
                    <h3 className="text-md font-medium text-gray-900">{item.label}</h3>
                    <p className="text-xl font-bold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Amortization Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2">Year</th>
                        <th className="p-2">Payment</th>
                        <th className="p-2">Principal</th>
                        <th className="p-2">Interest</th>
                        <th className="p-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.schedule.map((s) => (
                        <tr key={s.year}>
                          <td className="p-2">{s.year}</td>
                          <td className="p-2">
                            {formData.currency} {s.payment}
                          </td>
                          <td className="p-2">
                            {formData.currency} {s.principal}
                          </td>
                          <td className="p-2">
                            {formData.currency} {s.interest}
                          </td>
                          <td className="p-2">
                            {formData.currency} {s.balance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2">Scenario</th>
                        <th className="p-2">Monthly Payment</th>
                        <th className="p-2">Cap Rate</th>
                        <th className="p-2">CoC Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.scenarios.map((s) => (
                        <tr key={s.name}>
                          <td className="p-2">{s.name}</td>
                          <td className="p-2">
                            {formData.currency} {s.monthlyPayment}
                          </td>
                          <td className="p-2">{s.capRate}%</td>
                          <td className="p-2">{s.cocReturn}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Affordability Analysis</h3>
                <p className="text-gray-600">{results.affordabilityAnalysis}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">MIP Optimizer</h3>
                <p className="text-gray-600">{results.mipOptimizer}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Investment Optimizer</h3>
                <p className="text-gray-600">{results.investmentOptimizer}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Risk Analysis</h3>
                <p className="text-gray-600">{results.riskAnalysis}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Sensitivity Analysis</h3>
                <p className="text-gray-600">{`Monthly payment ranges from ${formData.currency} ${
                  results.sensitivity[0].payment
                } at ${results.sensitivity[0].rate}% to ${formData.currency} ${
                  results.sensitivity[results.sensitivity.length - 1].payment
                } at ${results.sensitivity[results.sensitivity.length - 1].rate}%.`}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Monthly Payment Breakdown</h3>
                <canvas ref={paymentPieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Loan Balance & Home Value</h3>
                <canvas ref={balanceLineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Cumulative Cash Flow & Equity</h3>
                <canvas ref={equityAreaChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Initial Investment Breakdown</h3>
                <canvas ref={investmentDonutChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Metrics Comparison</h3>
                <canvas ref={metricsBarChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2">Date</th>
                      <th className="p-2">Key Metric</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.date}>
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
                  onClick={exportCSV}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
                >
                  Export CSV
                </button>
                <button
                  onClick={exportPDF}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
                >
                  Export PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        body {
          transition: background-color 0.3s, color 0.3s;
        }
        .tooltip {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        .tooltip .tooltiptext {
          visibility: hidden;
          width: 200px;
          background-color: #555;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          margin-left: -100px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .tooltip:hover .tooltiptext {
          visibility: visible;
          opacity: 1;
        }
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
        @media (max-width: 640px) {
          button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
