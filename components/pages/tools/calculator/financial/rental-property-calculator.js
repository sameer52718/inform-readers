"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [scenarios, setScenarios] = useState([{ price: "300000", rent: "1500", rate: "4" }]);
  const [formData, setFormData] = useState({
    currency: "USD",
    propertyPrice: "300000",
    downPayment: "20",
    interestRate: "4",
    loanTerm: "30",
    closingCosts: "5000",
    renovationCosts: "10000",
    appreciation: "3",
    holdingPeriod: "10",
    monthlyRent: "1500",
    units: "2",
    otherIncome: "100",
    vacancyRate: "5",
    propertyTaxes: "3000",
    insurance: "1200",
    maintenance: "2000",
    management: "8",
    utilities: "1000",
    hoa: "0",
    capex: "1500",
    otherExpenses: "0",
    taxRate: "25",
    depreciationPeriod: "27.5",
  });
  const expensePieChartRef = useRef(null);
  const cashflowLineChartRef = useRef(null);
  const equityAreaChartRef = useRef(null);
  const investmentDonutChartRef = useRef(null);
  const metricBarChartRef = useRef(null);
  let expensePieChart, cashflowLineChart, equityAreaChart, investmentDonutChart, metricBarChart;

  useEffect(() => {
    if (expensePieChartRef.current) {
      expensePieChart = new Chart(expensePieChartRef.current, { type: "pie", data: {}, options: {} });
    }
    if (cashflowLineChartRef.current) {
      cashflowLineChart = new Chart(cashflowLineChartRef.current, { type: "line", data: {}, options: {} });
    }
    if (equityAreaChartRef.current) {
      equityAreaChart = new Chart(equityAreaChartRef.current, { type: "line", data: {}, options: {} });
    }
    if (investmentDonutChartRef.current) {
      investmentDonutChart = new Chart(investmentDonutChartRef.current, {
        type: "doughnut",
        data: {},
        options: {},
      });
    }
    if (metricBarChartRef.current) {
      metricBarChart = new Chart(metricBarChartRef.current, { type: "bar", data: {}, options: {} });
    }
    setHistory(JSON.parse(localStorage.getItem("rentalHistory")) || []);
    return () => {
      expensePieChart?.destroy();
      cashflowLineChart?.destroy();
      equityAreaChart?.destroy();
      investmentDonutChart?.destroy();
      metricBarChart?.destroy();
    };
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setError("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([...scenarios, { price: "300000", rent: "1500", rate: "4" }]);
  };

  const updateScenario = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index][field] = value;
    setScenarios(newScenarios);
  };

  const convertCurrency = () => {
    setError("");
    const currency = formData.currency;
    const rates = { USD: 1, PKR: 277.95, INR: 83.95 };
    const newCurrency = currency === "USD" ? "PKR" : currency === "PKR" ? "INR" : "USD";
    const fields = [
      "propertyPrice",
      "closingCosts",
      "renovationCosts",
      "monthlyRent",
      "otherIncome",
      "propertyTaxes",
      "insurance",
      "maintenance",
      "utilities",
      "hoa",
      "capex",
      "otherExpenses",
    ];
    const newData = { currency: newCurrency };
    fields.forEach((field) => {
      const value = parseFloat(formData[field]);
      if (!isNaN(value)) {
        newData[field] = ((value * rates[newCurrency]) / rates[currency]).toFixed(2);
      }
    });
    setFormData((prev) => ({ ...prev, ...newData }));
    setScenarios(
      scenarios.map((s) => ({
        price: ((parseFloat(s.price) * rates[newCurrency]) / rates[currency]).toFixed(2),
        rent: ((parseFloat(s.rent) * rates[newCurrency]) / rates[currency]).toFixed(2),
        rate: s.rate,
      }))
    );
  };

  const calculate = () => {
    setError("");
    const inputs = {
      currency: formData.currency,
      propertyPrice: parseFloat(formData.propertyPrice),
      downPayment: parseFloat(formData.downPayment),
      interestRate: parseFloat(formData.interestRate),
      loanTerm: parseInt(formData.loanTerm),
      closingCosts: parseFloat(formData.closingCosts),
      renovationCosts: parseFloat(formData.renovationCosts),
      appreciation: parseFloat(formData.appreciation),
      holdingPeriod: parseInt(formData.holdingPeriod),
      monthlyRent: parseFloat(formData.monthlyRent),
      units: parseInt(formData.units),
      otherIncome: parseFloat(formData.otherIncome),
      vacancyRate: parseFloat(formData.vacancyRate),
      propertyTaxes: parseFloat(formData.propertyTaxes),
      insurance: parseFloat(formData.insurance),
      maintenance: parseFloat(formData.maintenance),
      management: parseFloat(formData.management),
      utilities: parseFloat(formData.utilities),
      hoa: parseFloat(formData.hoa),
      capex: parseFloat(formData.capex),
      otherExpenses: parseFloat(formData.otherExpenses),
      taxRate: parseFloat(formData.taxRate),
      depreciationPeriod: parseFloat(formData.depreciationPeriod),
    };

    // Validation
    if (Object.values(inputs).some(isNaN)) {
      setError("Please provide valid inputs.");
      return;
    }
    if (inputs.propertyPrice <= 0 || inputs.monthlyRent <= 0 || inputs.units <= 0) {
      setError("Property price, rent, and units must be positive.");
      return;
    }
    if (
      inputs.downPayment < 0 ||
      inputs.downPayment > 100 ||
      inputs.interestRate < 0 ||
      inputs.closingCosts < 0 ||
      inputs.renovationCosts < 0 ||
      inputs.appreciation < 0 ||
      inputs.holdingPeriod < 1 ||
      inputs.vacancyRate < 0 ||
      inputs.vacancyRate > 100 ||
      inputs.propertyTaxes < 0 ||
      inputs.insurance < 0 ||
      inputs.maintenance < 0 ||
      inputs.management < 0 ||
      inputs.management > 100 ||
      inputs.utilities < 0 ||
      inputs.hoa < 0 ||
      inputs.capex < 0 ||
      inputs.otherExpenses < 0 ||
      inputs.taxRate < 0 ||
      inputs.taxRate > 100 ||
      inputs.depreciationPeriod < 1
    ) {
      setError("Invalid input values (e.g., negative or out-of-range percentages).");
      return;
    }
    if (inputs.loanTerm < 1 || inputs.loanTerm > 30) {
      setError("Loan term must be between 1 and 30 years.");
      return;
    }

    // Mortgage Calculations
    const loanAmount = inputs.propertyPrice * (1 - inputs.downPayment / 100);
    const monthlyRate = inputs.interestRate / 100 / 12;
    const payments = inputs.loanTerm * 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1);
    const totalInterest = (monthlyPayment * payments - loanAmount).toFixed(2);

    // Amortization Schedule
    let balance = loanAmount;
    const schedule = [];
    for (let i = 0; i < payments && balance > 0; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
      if (balance < 0) balance = 0;
      if (i % 12 === 0 || i === payments - 1) {
        schedule.push({
          year: (i / 12 + 1).toFixed(1),
          payment: monthlyPayment.toFixed(2),
          principal: principal.toFixed(2),
          interest: interest.toFixed(2),
          balance: balance.toFixed(2),
        });
      }
    }

    // Income
    const grossRentalIncome = inputs.monthlyRent * inputs.units * 12 * (1 - inputs.vacancyRate / 100);
    const totalIncome = (grossRentalIncome + inputs.otherIncome * 12).toFixed(2);

    // Expenses
    const managementFee = ((grossRentalIncome * inputs.management) / 100).toFixed(2);
    const operatingExpenses = (
      inputs.propertyTaxes +
      inputs.insurance +
      inputs.maintenance +
      parseFloat(managementFee) +
      inputs.utilities +
      inputs.hoa
    ).toFixed(2);
    const totalExpenses = (parseFloat(operatingExpenses) + inputs.capex + monthlyPayment * 12).toFixed(2);

    // Investment Metrics
    const noi = (totalIncome - operatingExpenses).toFixed(2);
    const cashFlow = (noi - monthlyPayment * 12 - inputs.capex).toFixed(2);
    const capRate = ((noi / inputs.propertyPrice) * 100).toFixed(2);
    const totalInvested = (
      (inputs.propertyPrice * inputs.downPayment) / 100 +
      inputs.closingCosts +
      inputs.renovationCosts
    ).toFixed(2);
    const cocReturn = ((cashFlow / totalInvested) * 100).toFixed(2);
    const futureValue = (
      inputs.propertyPrice * Math.pow(1 + inputs.appreciation / 100, inputs.holdingPeriod)
    ).toFixed(2);
    const roi = (
      ((futureValue - loanAmount + cashFlow * inputs.holdingPeriod - totalInvested) / totalInvested) *
      100
    ).toFixed(2);
    const annualDebtService = (monthlyPayment * 12).toFixed(2);
    const dscr = (noi / annualDebtService).toFixed(2);

    // Tax Calculations
    const annualDepreciation = ((inputs.propertyPrice * 0.8) / inputs.depreciationPeriod).toFixed(2);
    const deductibleExpenses = (
      parseFloat(totalInterest) / inputs.loanTerm +
      inputs.propertyTaxes +
      inputs.insurance +
      inputs.maintenance +
      parseFloat(managementFee)
    ).toFixed(2);
    const taxableIncome = (noi - deductibleExpenses - annualDepreciation).toFixed(2);
    const taxes = taxableIncome > 0 ? ((taxableIncome * inputs.taxRate) / 100).toFixed(2) : 0;
    const afterTaxCashFlow = (cashFlow - taxes).toFixed(2);

    // Break-Even
    const breakEvenYears = totalInvested / cashFlow > 0 ? (totalInvested / cashFlow).toFixed(2) : "N/A";

    // Optimizer and Risk Analysis
    const optimizer =
      cocReturn < 8
        ? `To achieve a CoC Return > 8%, consider increasing rent to ${inputs.currency} ${(
            inputs.monthlyRent * 1.1
          ).toFixed(2)} or reducing expenses by ${inputs.currency} ${(operatingExpenses * 0.1).toFixed(2)}.`
        : `Strong investment with ${cocReturn}% CoC Return; maintain current strategy.`;
    const riskAnalysis = dscr < 1.2 ? "High risk (DSCR < 1.2)" : "Low risk (DSCR ≥ 1.2)";

    // Scenario Analysis
    const scenarioResults = scenarios
      .map((s, index) => {
        const price = parseFloat(s.price);
        const rent = parseFloat(s.rent);
        const rate = parseFloat(s.rate);
        if (isNaN(price) || isNaN(rent) || isNaN(rate)) return null;
        const scenarioLoan = price * (1 - inputs.downPayment / 100);
        const scenarioMonthlyRate = rate / 100 / 12;
        const scenarioPayment =
          (scenarioLoan * scenarioMonthlyRate * Math.pow(1 + scenarioMonthlyRate, payments)) /
          (Math.pow(1 + scenarioMonthlyRate, payments) - 1);
        const scenarioIncome =
          rent * inputs.units * 12 * (1 - inputs.vacancyRate / 100) + inputs.otherIncome * 12;
        const scenarioNOI = scenarioIncome - operatingExpenses;
        const scenarioCashFlow = scenarioNOI - scenarioPayment * 12 - inputs.capex;
        return {
          name: `Scenario ${index + 1}`,
          capRate: ((scenarioNOI / price) * 100).toFixed(2),
          cocReturn: ((scenarioCashFlow / totalInvested) * 100).toFixed(2),
          roi: (
            ((price * Math.pow(1 + inputs.appreciation / 100, inputs.holdingPeriod) -
              scenarioLoan +
              scenarioCashFlow * inputs.holdingPeriod -
              totalInvested) /
              totalInvested) *
            100
          ).toFixed(2),
        };
      })
      .filter((s) => s);

    const resultData = {
      monthlyPayment: `${inputs.currency} ${monthlyPayment.toFixed(2)}`,
      cashFlow: `${inputs.currency} ${cashFlow}`,
      capRate: `${capRate}%`,
      cocReturn: `${cocReturn}%`,
      roi: `${roi}%`,
      dscr,
      afterTaxCashFlow: `${inputs.currency} ${afterTaxCashFlow}`,
      breakEvenYears,
      totalInvested,
    };

    setResults({
      resultData,
      currency: inputs.currency,
      schedule,
      scenarios: scenarioResults,
      optimizer,
      riskAnalysis,
    });
    const newHistory = [
      ...history,
      { date: new Date().toLocaleString(), keyMetric: "Cash-on-Cash Return", value: `${cocReturn}%` },
    ];
    setHistory(newHistory);
    localStorage.setItem("rentalHistory", JSON.stringify(newHistory));
  };

  const saveCalculation = () => {
    if (results) {
      setSuccess("Calculation saved to history!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("No valid calculation to save.");
    }
  };

  const exportCSV = () => {
    const csvContent = [
      "Date,Key Metric,Value",
      ...history.map((h) => `"${h.date}","${h.keyMetric}","${h.value}"`),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rental_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Rental Property Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    history.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text("Note: Visual charts (Pie, Line, Area, Donut, Bar) are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("rental_results.pdf");
  };

  const updateCharts = (resultData, currency, schedule, scenarioResults) => {
    if (expensePieChart) expensePieChart.destroy();
    if (cashflowLineChart) cashflowLineChart.destroy();
    if (equityAreaChart) equityAreaChart.destroy();
    if (investmentDonutChart) investmentDonutChart.destroy();
    if (metricBarChart) metricBarChart.destroy();

    expensePieChart = new Chart(expensePieChartRef.current, {
      type: "pie",
      data: {
        labels: [
          "Mortgage",
          "Property Taxes",
          "Insurance",
          "Maintenance",
          "Management",
          "Utilities",
          "HOA",
          "CapEx",
        ],
        datasets: [
          {
            data: [
              parseFloat(resultData.monthlyPayment.replace(currency, "")) * 12,
              parseFloat(formData.propertyTaxes),
              parseFloat(formData.insurance),
              parseFloat(formData.maintenance),
              (parseFloat(formData.monthlyRent) *
                parseFloat(formData.units) *
                12 *
                (1 - parseFloat(formData.vacancyRate) / 100) *
                parseFloat(formData.management)) /
                100,
              parseFloat(formData.utilities),
              parseFloat(formData.hoa),
              parseFloat(formData.capex),
            ],
            backgroundColor: [
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#ef4444",
              "#8b5cf6",
              "#ec4899",
              "#f97316",
              "#6b7280",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" }, title: { display: true, text: "Expense Breakdown" } },
      },
    });

    const years = Array.from({ length: parseInt(formData.holdingPeriod) }, (_, i) => i + 1);
    const cashFlows = years.map(() => parseFloat(resultData.cashFlow.replace(currency, "")));
    const propertyValues = years.map(
      (i) => parseFloat(formData.propertyPrice) * Math.pow(1 + parseFloat(formData.appreciation) / 100, i)
    );
    cashflowLineChart = new Chart(cashflowLineChartRef.current, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: `Annual Cash Flow (${currency})`,
            data: cashFlows,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            yAxisID: "y",
          },
          {
            label: `Property Value (${currency})`,
            data: propertyValues,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Year" } },
          y: { title: { display: true, text: `Cash Flow (${currency})` } },
          y1: {
            position: "right",
            title: { display: true, text: `Property Value (${currency})` },
            grid: { drawOnChartArea: false },
          },
        },
        plugins: { title: { display: true, text: "Cash Flow & Value Over Time" } },
      },
    });

    const cumulativeCashFlows = years.map(
      (_, i) => parseFloat(resultData.cashFlow.replace(currency, "")) * (i + 1)
    );
    const netEquity = years.map((i) => {
      const yearIndex = Math.min(Math.floor(i), schedule.length - 1);
      const balance = parseFloat(schedule[yearIndex].balance);
      const value = propertyValues[i - 1];
      return value - balance;
    });
    equityAreaChart = new Chart(equityAreaChartRef.current, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: `Cumulative Cash Flow (${currency})`,
            data: cumulativeCashFlows,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.4)",
            fill: true,
            yAxisID: "y",
          },
          {
            label: `Net Equity (${currency})`,
            data: netEquity,
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
          y: { title: { display: true, text: `Cumulative Cash Flow (${currency})` } },
          y1: {
            position: "right",
            title: { display: true, text: `Net Equity (${currency})` },
            grid: { drawOnChartArea: false },
          },
        },
        plugins: { title: { display: true, text: "Cumulative Cash Flow & Equity" } },
      },
    });

    investmentDonutChart = new Chart(investmentDonutChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Down Payment", "Closing Costs", "Renovation Costs"],
        datasets: [
          {
            data: [
              (parseFloat(formData.propertyPrice) * parseFloat(formData.downPayment)) / 100,
              parseFloat(formData.closingCosts),
              parseFloat(formData.renovationCosts),
            ],
            backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Initial Investment Breakdown" },
        },
      },
    });

    metricBarChart = new Chart(metricBarChartRef.current, {
      type: "bar",
      data: {
        labels: scenarioResults.map((s) => s.name),
        datasets: [
          { label: "Cap Rate (%)", data: scenarioResults.map((s) => s.capRate), backgroundColor: "#3b82f6" },
          {
            label: "CoC Return (%)",
            data: scenarioResults.map((s) => s.cocReturn),
            backgroundColor: "#10b981",
          },
          { label: "ROI (%)", data: scenarioResults.map((s) => s.roi), backgroundColor: "#f59e0b" },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { title: { display: true, text: "Percentage (%)" } } },
        plugins: { title: { display: true, text: "Metric Comparison" } },
      },
    });
  };

  const renderInputs = (section, fields) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            {field.label}
            <span className="tooltip">
              ?<span className="tooltiptext">{field.tooltip}</span>
            </span>
          </label>
          {field.type === "select" ? (
            <select
              value={formData[field.id]}
              onChange={(e) => updateFormData(field.id, e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800"
            >
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={formData[field.id]}
              onChange={(e) => updateFormData(field.id, e.target.value)}
              step={field.step}
              min={field.min}
              max={field.max}
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800"
            />
          )}
        </div>
      ))}
    </div>
  );

  const inputSections = [
    {
      title: "Property Details",
      description: "Enter details to analyze your rental property investment.",
      fields: [
        {
          id: "currency",
          label: "Currency",
          type: "select",
          options: ["USD", "PKR", "INR"],
          tooltip: "Choose your currency.",
        },
        {
          id: "propertyPrice",
          label: "Property Price",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Purchase price of the property.",
        },
        {
          id: "downPayment",
          label: "Down Payment (%)",
          type: "number",
          step: "0.1",
          min: "0",
          max: "100",
          tooltip: "Percentage of price paid upfront.",
        },
        {
          id: "interestRate",
          label: "Interest Rate (%)",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Annual mortgage interest rate.",
        },
        {
          id: "loanTerm",
          label: "Loan Term (Years)",
          type: "number",
          step: "1",
          min: "1",
          tooltip: "Duration of the mortgage.",
        },
        {
          id: "closingCosts",
          label: "Closing Costs",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Fees for purchasing the property.",
        },
        {
          id: "renovationCosts",
          label: "Renovation Costs",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Initial repair or upgrade costs.",
        },
        {
          id: "appreciation",
          label: "Annual Appreciation (%)",
          type: "number",
          step: "0.1",
          min: "0",
          tooltip: "Expected annual property value increase.",
        },
        {
          id: "holdingPeriod",
          label: "Holding Period (Years)",
          type: "number",
          step: "1",
          min: "1",
          tooltip: "Years you plan to own the property.",
        },
      ],
    },
    {
      title: "Income Details",
      fields: [
        {
          id: "monthlyRent",
          label: "Monthly Rent per Unit",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Rent per rental unit per month.",
        },
        {
          id: "units",
          label: "Number of Units",
          type: "number",
          step: "1",
          min: "1",
          tooltip: "Total rental units in the property.",
        },
        {
          id: "otherIncome",
          label: "Other Monthly Income",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Additional income (e.g., parking).",
        },
        {
          id: "vacancyRate",
          label: "Vacancy Rate (%)",
          type: "number",
          step: "0.1",
          min: "0",
          max: "100",
          tooltip: "Percentage of time units are unoccupied.",
        },
      ],
    },
    {
      title: "Expense Details",
      fields: [
        {
          id: "propertyTaxes",
          label: "Annual Property Taxes",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Yearly property tax amount.",
        },
        {
          id: "insurance",
          label: "Annual Insurance",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Yearly insurance cost.",
        },
        {
          id: "maintenance",
          label: "Annual Maintenance",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Yearly maintenance costs.",
        },
        {
          id: "management",
          label: "Property Management (%)",
          type: "number",
          step: "0.1",
          min: "0",
          max: "100",
          tooltip: "Percentage of rent for management fees.",
        },
        {
          id: "utilities",
          label: "Annual Utilities",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Yearly utility costs paid by owner.",
        },
        {
          id: "hoa",
          label: "Annual HOA Fees",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Yearly HOA fees, if applicable.",
        },
        {
          id: "capex",
          label: "Annual CapEx",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Yearly capital expenditure reserve.",
        },
        {
          id: "otherExpenses",
          label: "Other Annual Expenses",
          type: "number",
          step: "0.01",
          min: "0",
          tooltip: "Miscellaneous yearly expenses.",
        },
      ],
    },
    {
      title: "Tax Details",
      fields: [
        {
          id: "taxRate",
          label: "Marginal Tax Rate (%)",
          type: "number",
          step: "0.1",
          min: "0",
          max: "100",
          tooltip: "Your income tax rate.",
        },
        {
          id: "depreciationPeriod",
          label: "Depreciation Period (Years)",
          type: "number",
          step: "0.1",
          min: "1",
          tooltip: "Years to depreciate property (e.g., 27.5).",
        },
      ],
    },
  ];

  return (
    <>
      <div className={`bg-white min-h-screen flex items-center justify-center p-4 ${darkMode ? "dark" : ""}`}>
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Advanced Rental Property Calculator</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            >
              Toggle Dark Mode
            </button>
          </div>
          <div className={`text-sm ${error ? "text-[#ef4444]" : success ? "text-[#10b981]" : "hidden"} mb-4`}>
            {error || success}
          </div>
          {inputSections.map((section) => (
            <div key={section.title} className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{section.title}</h2>
              {section.description && <p className="text-sm text-gray-600 mb-4">{section.description}</p>}
              {renderInputs(section.title, section.fields)}
            </div>
          ))}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Scenario Analysis</h2>
            {scenarios.map((s, index) => (
              <div key={index} className="scenario-section border border-gray-200 p-4 rounded-lg mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">Scenario {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Property Price</label>
                    <input
                      type="number"
                      value={s.price}
                      onChange={(e) => updateScenario(index, "price", e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Monthly Rent</label>
                    <input
                      type="number"
                      value={s.rent}
                      onChange={(e) => updateScenario(index, "rent", e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      value={s.rate}
                      onChange={(e) => updateScenario(index, "rate", e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addScenario}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
            >
              Add Scenario
            </button>
          </div>
          <div className="flex gap-4 mt-6 flex-wrap">
            <button
              onClick={convertCurrency}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Investment Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(results.resultData).map(([key, value]) => (
                  <div key={key}>
                    <h3 className="text-md font-medium text-gray-800">
                      {key === "monthlyPayment"
                        ? "Monthly Payment"
                        : key === "cashFlow"
                        ? "Annual Cash Flow"
                        : key === "capRate"
                        ? "Cap Rate"
                        : key === "cocReturn"
                        ? "CoC Return"
                        : key === "roi"
                        ? "ROI"
                        : key === "dscr"
                        ? "DSCR"
                        : key === "afterTaxCashFlow"
                        ? "After-Tax Cash Flow"
                        : "Break-Even"}
                    </h3>
                    <p className="text-xl font-bold text-gray-800">
                      {key === "breakEvenYears" ? `${value} years` : value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Amortization Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">Year</th>
                        <th className="p-2">Payment</th>
                        <th className="p-2">Principal</th>
                        <th className="p-2">Interest</th>
                        <th className="p-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.schedule.map((s, i) => (
                        <tr key={i}>
                          <td className="p-2">{s.year}</td>
                          <td className="p-2">
                            {results.currency} {s.payment}
                          </td>
                          <td className="p-2">
                            {results.currency} {s.principal}
                          </td>
                          <td className="p-2">
                            {results.currency} {s.interest}
                          </td>
                          <td className="p-2">
                            {results.currency} {s.balance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-6 overflow-x-auto">
                <h3 className="text-md font-medium text-gray-800">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">Cap Rate</th>
                      <th className="p-2">CoC Return</th>
                      <th className="p-2">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarios.map((s, i) => (
                      <tr key={i}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.capRate}%</td>
                        <td className="p-2">{s.cocReturn}%</td>
                        <td className="p-2">{s.roi}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Investment Optimizer</h3>
                <p className="text-gray-600">{results.optimizer}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Risk Analysis</h3>
                <p className="text-gray-600">{results.riskAnalysis}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Expense Breakdown</h3>
                <canvas ref={expensePieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Cash Flow & Value Over Time</h3>
                <canvas ref={cashflowLineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Cumulative Cash Flow & Equity</h3>
                <canvas ref={equityAreaChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Initial Investment Breakdown</h3>
                <canvas ref={investmentDonutChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Metric Comparison</h3>
                <canvas ref={metricBarChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Key Metric</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i}>
                        <td className="p-2">{h.date}</td>
                        <td className="p-2">{h.keyMetric}</td>
                        <td className="p-2">{h.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4">
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
        .dark {
          background-color: #1f2937;
        }
        .dark .bg-gray-100 {
          background-color: #374151;
        }
        .dark .text-gray-800 {
          color: #e5e7eb;
        }
        .dark .text-gray-600 {
          color: #9ca3af;
        }
        .dark .bg-gray-200 {
          background-color: #4b5563;
        }
        .dark .bg-gray-50 {
          background-color: #6b7280;
        }
        .dark .border-gray-200 {
          border-color: #4b5563;
        }
        @media (max-width: 640px) {
          .flex {
            flex-direction: column;
          }
          button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
