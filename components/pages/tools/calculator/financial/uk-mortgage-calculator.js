"use client";
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mortgageDetails, setMortgageDetails] = useState({
    currency: 'GBP', propertyValue: '300000', deposit: '30000', loanAmount: '270000', term: '25', interestRate: '3.5',
    rateType: 'fixed', mortgageType: 'repayment', buyerStatus: 'first-time', income: '50000', expenses: '1500',
    conveyancingFees: '1500', surveyFees: '500', otherFees: '1000', helpToBuy: '0', lisa: '4000', overpayment: '0',
    rateForecast: '1', riskTolerance: 'low'
  });
  const [scenarios, setScenarios] = useState([{ id: 1, loanAmount: '270000', interestRate: '3.5', term: '25' }]);
  const [results, setResults] = useState(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [showFullAmortization, setShowFullAmortization] = useState(false);
  const [mortgageHistory, setMortgageHistory] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const costPieChartRef = useRef(null);
  const balanceLineChartRef = useRef(null);
  const principalAreaChartRef = useRef(null);
  const ltvDonutChartRef = useRef(null);
  const metricsBarChartRef = useRef(null);
  let costPieChart, balanceLineChart, principalAreaChart, ltvDonutChart, metricsBarChart;

  const exchangeRates = { GBP: 1, USD: 1.27, PKR: 352.76, INR: 106.47 };
  const currencySymbols = { GBP: '£', USD: '$', PKR: '₨', INR: '₹' };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      setIsDarkMode(savedTheme === 'dark');
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');

      const savedHistory = JSON.parse(localStorage.getItem('mortgageHistory')) || [];
      setMortgageHistory(savedHistory);
    }

    if (costPieChartRef.current) {
      costPieChart = new Chart(costPieChartRef.current, { type: 'pie', data: { labels: [], datasets: [{ data: [], backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'] }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Cost Breakdown' } } } });
    }
    if (balanceLineChartRef.current) {
      balanceLineChart = new Chart(balanceLineChartRef.current, { type: 'line', data: { labels: [], datasets: [] }, options: { responsive: true, scales: { x: { title: { display: true, text: 'Month' } }, y: { title: { display: true, text: 'Balance' } } }, plugins: { title: { display: true, text: 'Loan Balance' } } } });
    }
    if (principalAreaChartRef.current) {
      principalAreaChart = new Chart(principalAreaChartRef.current, { type: 'line', data: { labels: [], datasets: [] }, options: { responsive: true, scales: { x: { title: { display: true, text: 'Month' } }, y: { title: { display: true, text: 'Amount' } } }, plugins: { title: { display: true, text: 'Principal vs. Interest' } } } });
    }
    if (ltvDonutChartRef.current) {
      ltvDonutChart = new Chart(ltvDonutChartRef.current, { type: 'doughnut', data: { labels: [], datasets: [{ data: [], backgroundColor: ['#3b82f6', '#f59e0b'] }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'LTV Ratio' } } } });
    }
    if (metricsBarChartRef.current) {
      metricsBarChart = new Chart(metricsBarChartRef.current, { type: 'bar', data: { labels: [], datasets: [] }, options: { responsive: true, scales: { y: { title: { display: true, text: 'Amount' } } }, plugins: { title: { display: true, text: 'Scenario Metrics Comparison' } } } });
    }
    return () => {
      costPieChart?.destroy();
      balanceLineChart?.destroy();
      principalAreaChart?.destroy();
      ltvDonutChart?.destroy();
      metricsBarChart?.destroy();
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  const updateMortgageDetail = (field, value) => {
    setMortgageDetails(prev => {
      const updated = { ...prev, [field]: value };
      if (['propertyValue', 'deposit', 'helpToBuy'].includes(field)) {
        const propertyValue = parseFloat(updated.propertyValue) || 0;
        const deposit = parseFloat(updated.deposit) || 0;
        const helpToBuy = parseFloat(updated.helpToBuy) || 0;
        const equityLoan = propertyValue * (helpToBuy / 100);
        updated.loanAmount = (propertyValue - deposit - equityLoan).toFixed(2);
      }
      if (field === 'buyerStatus' && value !== 'first-time') {
        updated.helpToBuy = '0';
        updated.lisa = '0';
      }
      return updated;
    });
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setError('Maximum 3 scenarios allowed.');
      return;
    }
    setScenarios([...scenarios, { id: scenarios.length + 1, loanAmount: '270000', interestRate: '3.5', term: '25' }]);
  };

  const updateScenario = (id, field, value) => {
    setScenarios(scenarios.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const convertCurrency = () => {
    setError('');
    const currentCurrency = mortgageDetails.currency;
    const newCurrency = currentCurrency === 'GBP' ? 'USD' : currentCurrency === 'USD' ? 'PKR' : currentCurrency === 'PKR' ? 'INR' : 'GBP';
    const rate = exchangeRates[newCurrency] / exchangeRates[currentCurrency];

    setMortgageDetails(prev => ({
      ...prev,
      currency: newCurrency,
      propertyValue: ((parseFloat(prev.propertyValue) || 0) * rate).toFixed(2),
      deposit: ((parseFloat(prev.deposit) || 0) * rate).toFixed(2),
      loanAmount: ((parseFloat(prev.loanAmount) || 0) * rate).toFixed(2),
      income: ((parseFloat(prev.income) || 0) * rate).toFixed(2),
      expenses: ((parseFloat(prev.expenses) || 0) * rate).toFixed(2),
      conveyancingFees: ((parseFloat(prev.conveyancingFees) || 0) * rate).toFixed(2),
      surveyFees: ((parseFloat(prev.surveyFees) || 0) * rate).toFixed(2),
      otherFees: ((parseFloat(prev.otherFees) || 0) * rate).toFixed(2),
      lisa: ((parseFloat(prev.lisa) || 0) * rate).toFixed(2),
      overpayment: ((parseFloat(prev.overpayment) || 0) * rate).toFixed(2)
    }));

    setScenarios(scenarios.map(s => ({
      ...s,
      loanAmount: ((parseFloat(s.loanAmount) || 0) * rate).toFixed(2)
    })));
  };

  const calculateSDLT = (propertyValue, buyerStatus) => {
    const bands = buyerStatus === 'first-time' && propertyValue <= 625000 ? [
      { threshold: 425000, rate: 0 },
      { threshold: 625000, rate: 5 }
    ] : buyerStatus === 'buy-to-let' ? [
      { threshold: 250000, rate: 3 },
      { threshold: 925000, rate: 8 },
      { threshold: 1500000, rate: 13 },
      { threshold: Infinity, rate: 15 }
    ] : [
      { threshold: 250000, rate: 0 },
      { threshold: 925000, rate: 5 },
      { threshold: 1500000, rate: 10 },
      { threshold: Infinity, rate: 12 }
    ];

    let tax = 0;
    let remaining = propertyValue;
    bands.forEach((band, i) => {
      if (remaining <= 0) return;
      const prevThreshold = i === 0 ? 0 : bands[i - 1].threshold;
      const taxable = Math.min(remaining, band.threshold - prevThreshold);
      tax += taxable * (band.rate / 100);
      remaining -= taxable;
    });
    return tax;
  };

  const calculatePayment = (loan, rate, term, type) => {
    const monthlyRate = rate / 100 / 12;
    const months = term * 12;
    if (type === 'repayment') {
      return loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }
    return loan * monthlyRate;
  };

  const calculateAmortization = (loan, rate, term, overpayment, type) => {
    const monthlyRate = rate / 100 / 12;
    const months = term * 12;
    let balance = loan;
    let totalInterest = 0;
    const schedule = [];
    let newTerm = months;

    for (let i = 0; i < months && balance > 0; i++) {
      const interest = balance * monthlyRate;
      const principal = type === 'repayment' ? calculatePayment(loan, rate, term, type) - interest : 0;
      let payment = principal + interest + overpayment;
      balance = balance - principal - overpayment;
      if (balance < 0) {
        payment += balance;
        balance = 0;
        newTerm = i + 1;
      }
      totalInterest += interest;
      schedule.push({ month: i + 1, payment: payment.toFixed(2), principal: principal.toFixed(2), interest: interest.toFixed(2), balance: balance.toFixed(2) });
    }
    return { schedule, totalInterest: totalInterest.toFixed(2), newTerm: Math.ceil(newTerm / 12) };
  };

  const calculate = () => {
    setError('');
    const { currency, propertyValue, deposit, loanAmount, term, interestRate, rateType, mortgageType, buyerStatus, income, expenses, conveyancingFees, surveyFees, otherFees, helpToBuy, lisa, overpayment, rateForecast, riskTolerance } = mortgageDetails;
    const values = { propertyValue, deposit, loanAmount, term, interestRate, income, expenses, conveyancingFees, surveyFees, otherFees, helpToBuy, lisa, overpayment, rateForecast };

    if (Object.values(values).some(v => isNaN(parseFloat(v)))) {
      setError('Please provide valid inputs.');
      return;
    }
    if (parseFloat(propertyValue) <= 0 || parseFloat(deposit) < 0 || parseFloat(loanAmount) <= 0 || parseInt(term) < 5 || parseInt(term) > 40 || parseFloat(interestRate) < 0 || parseFloat(income) <= 0 || parseFloat(expenses) < 0 || parseFloat(conveyancingFees) < 0 || parseFloat(surveyFees) < 0 || parseFloat(otherFees) < 0 || parseFloat(helpToBuy) < 0 || parseFloat(helpToBuy) > (buyerStatus === 'first-time' ? 40 : 0) || parseFloat(lisa) < 0 || parseFloat(overpayment) < 0 || parseFloat(rateForecast) < 0) {
      setError('Invalid input values (e.g., negative or out-of-range).');
      return;
    }
    if (parseFloat(loanAmount) + parseFloat(deposit) + (parseFloat(propertyValue) * parseFloat(helpToBuy) / 100) > parseFloat(propertyValue)) {
      setError('Loan amount + deposit + Help to Buy exceeds property value.');
      return;
    }

    const monthlyPayment = calculatePayment(parseFloat(loanAmount), parseFloat(interestRate), parseInt(term), mortgageType).toFixed(2);
    const { schedule, totalInterest, newTerm } = calculateAmortization(parseFloat(loanAmount), parseFloat(interestRate), parseInt(term), parseFloat(overpayment), mortgageType);
    const sdlt = calculateSDLT(parseFloat(propertyValue), buyerStatus).toFixed(2);
    const lisaBonus = buyerStatus === 'first-time' ? (parseFloat(lisa) * 0.25).toFixed(2) : '0';
    const helpToBuyLoan = (parseFloat(propertyValue) * parseFloat(helpToBuy) / 100).toFixed(2);
    const helpToBuyInterest = parseFloat(helpToBuyLoan) > 0 ? (parseFloat(helpToBuyLoan) * 0.0275 * (parseInt(term) - 5)).toFixed(2) : '0';
    const totalCost = (parseFloat(loanAmount) + parseFloat(totalInterest) + parseFloat(sdlt) + parseFloat(conveyancingFees) + parseFloat(surveyFees) + parseFloat(otherFees) + parseFloat(helpToBuyInterest)).toFixed(2);
    const ltv = ((parseFloat(loanAmount) / parseFloat(propertyValue)) * 100).toFixed(2);
    const dti = ((parseFloat(monthlyPayment) / (parseFloat(income) / 12)) * 100).toFixed(2);

    const maxLoan = (parseFloat(income) * 4.5).toFixed(2);
    const affordabilityPlanner = parseFloat(loanAmount) <= parseFloat(maxLoan) && parseFloat(dti) <= 40
      ? `Affordable: Loan of ${currencySymbols[currency]}${loanAmount} is within lender criteria (Max: ${currencySymbols[currency]}${maxLoan}, DTI: ${dti}%).`
      : `Not Affordable: Loan exceeds ${currencySymbols[currency]}${maxLoan} or DTI (${dti}%) is too high. Reduce loan or increase income.`;

    const overpaymentSavings = parseFloat(overpayment) > 0
      ? `Overpaying ${currencySymbols[currency]}${overpayment}/month reduces term to ${newTerm} years, saving ${currencySymbols[currency]}${(parseFloat(calculateAmortization(parseFloat(loanAmount), parseFloat(interestRate), parseInt(term), 0, mortgageType).totalInterest) - parseFloat(totalInterest)).toFixed(2)} in interest.`
      : `No overpayments. Consider overpaying to reduce term and interest.`;

    const riskPayment = rateType === 'variable' ? calculatePayment(parseFloat(loanAmount), parseFloat(interestRate) + parseFloat(rateForecast), parseInt(term), mortgageType).toFixed(2) : monthlyPayment;
    const rateRisk = rateType === 'variable' && riskTolerance !== 'high'
      ? `Warning: A ${rateForecast}% rate increase raises payment to ${currencySymbols[currency]}${riskPayment}/month. Consider a fixed rate if risk tolerance is ${riskTolerance}.`
      : `Low risk: ${rateType === 'fixed' ? 'Fixed rate protects against increases.' : 'High tolerance or low forecast increase.'}`;

    const sensitivity = [];
    for (let rate = Math.max(0, parseFloat(interestRate) - 0.5); rate <= parseFloat(interestRate) + 0.5; rate += 0.5) {
      const sPayment = calculatePayment(parseFloat(loanAmount), rate, parseInt(term), mortgageType).toFixed(2);
      sensitivity.push({ rate: rate.toFixed(1), payment: sPayment });
    }

    const scenarioResults = scenarios.map((s, i) => {
      const sLoan = parseFloat(s.loanAmount);
      const sRate = parseFloat(s.interestRate);
      const sTerm = parseInt(s.term);
      if (isNaN(sLoan) || isNaN(sRate) || isNaN(sTerm)) return null;
      const sPayment = calculatePayment(sLoan, sRate, sTerm, mortgageType).toFixed(2);
      const sTotalInterest = calculateAmortization(sLoan, sRate, sTerm, 0, mortgageType).totalInterest;
      const sTotalCost = (sLoan + parseFloat(sTotalInterest) + parseFloat(sdlt) + parseFloat(conveyancingFees) + parseFloat(surveyFees) + parseFloat(otherFees)).toFixed(2);
      const sLtv = ((sLoan / parseFloat(propertyValue)) * 100).toFixed(2);
      return { name: `Scenario ${i + 1}`, payment: sPayment, totalCost: sTotalCost, ltv: sLtv };
    }).filter(s => s);

    setResults({
      monthlyPayment: `${currencySymbols[currency]}${monthlyPayment}`,
      totalInterest: `${currencySymbols[currency]}${totalInterest}`,
      totalCost: `${currencySymbols[currency]}${totalCost}`,
      sdlt: `${currencySymbols[currency]}${sdlt}`,
      lisaBonus: `${currencySymbols[currency]}${lisaBonus}`,
      helpToBuyLoan: `${currencySymbols[currency]}${helpToBuyLoan}`,
      ltv: `${ltv}%`,
      dti: `${dti}%`,
      newTerm: `${newTerm} years`
    });
    setAmortizationSchedule(schedule);
    setMortgageHistory(prev => [...prev, { date: new Date().toLocaleString(), keyMetric: 'Monthly Payment', value: `${currencySymbols[currency]}${monthlyPayment}` }]);
    localStorage.setItem('mortgageHistory', JSON.stringify([...mortgageHistory, { date: new Date().toLocaleString(), keyMetric: 'Monthly Payment', value: `${currencySymbols[currency]}${monthlyPayment}` }]));

    updateCharts({
      totalInterest: parseFloat(totalInterest),
      sdlt: parseFloat(sdlt),
      ltv: parseFloat(ltv),
      monthlyPayment: parseFloat(monthlyPayment)
    }, currency, schedule, scenarioResults);

    setResults(prev => ({
      ...prev,
      scenarios: scenarioResults,
      affordabilityPlanner,
      overpaymentSavings,
      rateRisk,
      sensitivity: `Monthly payment ranges from ${currencySymbols[currency]}${sensitivity[0].payment} at ${sensitivity[0].rate}% to ${currencySymbols[currency]}${sensitivity[sensitivity.length - 1].payment} at ${sensitivity[sensitivity.length - 1].rate}%.`
    }));
  };

  const updateCharts = (results, currency, schedule, scenarios) => {
    if (costPieChart) {
      costPieChart.data.labels = ['Principal', 'Interest', 'SDLT', 'Fees'];
      costPieChart.data.datasets[0].data = [
        parseFloat(mortgageDetails.loanAmount),
        results.totalInterest,
        results.sdlt,
        parseFloat(mortgageDetails.conveyancingFees) + parseFloat(mortgageDetails.surveyFees) + parseFloat(mortgageDetails.otherFees)
      ];
      costPieChart.update();
    }

    const noOverpaymentSchedule = calculateAmortization(parseFloat(mortgageDetails.loanAmount), parseFloat(mortgageDetails.interestRate), parseInt(mortgageDetails.term), 0, mortgageDetails.mortgageType).schedule;
    if (balanceLineChart) {
      balanceLineChart.data.labels = schedule.map(s => s.month);
      balanceLineChart.data.datasets = [
        { label: `Balance with Overpayment (${currencySymbols[currency]})`, data: schedule.map(s => s.balance), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.2)', yAxisID: 'y' },
        { label: `Balance without Overpayment (${currencySymbols[currency]})`, data: noOverpaymentSchedule.map(s => s.balance), borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.2)', yAxisID: 'y' }
      ];
      balanceLineChart.options.scales.y.title.text = `Balance (${currencySymbols[currency]})`;
      balanceLineChart.update();
    }

    if (principalAreaChart) {
      principalAreaChart.data.labels = schedule.map(s => s.month);
      principalAreaChart.data.datasets = [
        { label: `Principal (${currencySymbols[currency]})`, data: schedule.map(s => s.principal), borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.4)', fill: true, yAxisID: 'y' },
        { label: `Interest (${currencySymbols[currency]})`, data: schedule.map(s => s.interest), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.4)', fill: true, yAxisID: 'y' }
      ];
      principalAreaChart.options.scales.y.title.text = `Amount (${currencySymbols[currency]})`;
      principalAreaChart.update();
    }

    if (ltvDonutChart) {
      ltvDonutChart.data.labels = ['Loan', 'Deposit'];
      ltvDonutChart.data.datasets[0].data = [parseFloat(mortgageDetails.loanAmount), parseFloat(mortgageDetails.deposit)];
      ltvDonutChart.update();
    }

    if (metricsBarChart) {
      metricsBarChart.data.labels = scenarios.map(s => s.name);
      metricsBarChart.data.datasets = [
        { label: `Monthly Payment (${currencySymbols[currency]})`, data: scenarios.map(s => s.payment), backgroundColor: '#3b82f6' },
        { label: `Total Cost (${currencySymbols[currency]})`, data: scenarios.map(s => s.totalCost), backgroundColor: '#10b981' }
      ];
      metricsBarChart.options.scales.y.title.text = `Amount (${currencySymbols[currency]})`;
      metricsBarChart.update();
    }
  };

  const toggleAmortization = () => {
    setShowFullAmortization(!showFullAmortization);
  };

  const saveCalculation = () => {
    if (!results) {
      setError('No valid calculation to save.');
      return;
    }
    setSuccess('Calculation saved to history!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const exportCSV = () => {
    const csvContent = [
      ['Date', 'Key Metric', 'Value'],
      ...mortgageHistory.map(h => [h.date, h.keyMetric, h.value])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mortgage_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Advanced UK Mortgage Calculator Results', 10, 10);
    doc.setFontSize(12);
    doc.text('Calculation History:', 10, 20);
    let y = 30;
    mortgageHistory.forEach(h => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text('Note: Visual charts (Pie, Line, Area, Donut, Bar) and amortization schedule are available in the web interface.', 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save('mortgage_results.pdf');
  };

  const mortgageFields = [
    { id: 'currency', label: 'Currency', type: 'select', options: [
      { value: 'GBP', label: 'GBP' }, { value: 'USD', label: 'USD' }, { value: 'PKR', label: 'PKR' }, { value: 'INR', label: 'INR' }
    ], tooltip: 'Choose your currency.' },
    { id: 'propertyValue', label: 'Property Value', type: 'number', step: '0.01', min: '0', defaultValue: '300000', tooltip: 'Purchase price of the property.' },
    { id: 'deposit', label: 'Deposit Amount', type: 'number', step: '0.01', min: '0', defaultValue: '30000', tooltip: 'Your upfront deposit.' },
    { id: 'loanAmount', label: 'Loan Amount', type: 'number', step: '0.01', min: '0', defaultValue: '270000', tooltip: 'Mortgage amount (auto-calculated).', readOnly: true },
    { id: 'term', label: 'Mortgage Term (Years)', type: 'number', step: '1', min: '5', max: '40', defaultValue: '25', tooltip: 'Duration of mortgage (5-40 years).' },
    { id: 'interestRate', label: 'Interest Rate (%)', type: 'number', step: '0.01', min: '0', defaultValue: '3.5', tooltip: 'Annual interest rate.' },
    { id: 'rateType', label: 'Rate Type', type: 'select', options: [
      { value: 'fixed', label: 'Fixed' }, { value: 'variable', label: 'Variable' }
    ], tooltip: 'Fixed or variable interest rate.' },
    { id: 'mortgageType', label: 'Mortgage Type', type: 'select', options: [
      { value: 'repayment', label: 'Repayment' }, { value: 'interest-only', label: 'Interest-Only' }
    ], tooltip: 'Repayment or Interest-Only.' },
    { id: 'buyerStatus', label: 'Buyer Status', type: 'select', options: [
      { value: 'first-time', label: 'First-Time Buyer' }, { value: 'home-mover', label: 'Home Mover' }, { value: 'buy-to-let', label: 'Buy-to-Let' }
    ], tooltip: 'Affects Stamp Duty rates.' },
    { id: 'income', label: 'Annual Household Income', type: 'number', step: '0.01', min: '0', defaultValue: '50000', tooltip: 'Total yearly income for affordability.' },
    { id: 'expenses', label: 'Monthly Expenses', type: 'number', step: '0.01', min: '0', defaultValue: '1500', tooltip: 'Monthly household expenses.' },
    { id: 'conveyancingFees', label: 'Conveyancing Fees', type: 'number', step: '0.01', min: '0', defaultValue: '1500', tooltip: 'Legal fees for property transfer.' },
    { id: 'surveyFees', label: 'Survey Fees', type: 'number', step: '0.01', min: '0', defaultValue: '500', tooltip: 'Property survey costs.' },
    { id: 'otherFees', label: 'Other Fees', type: 'number', step: '0.01', min: '0', defaultValue: '1000', tooltip: 'Additional costs (e.g., broker fees).' },
    { id: 'helpToBuy', label: 'Help to Buy Equity Loan (%)', type: 'number', step: '0.1', min: '0', max: '40', defaultValue: '0', tooltip: 'Equity loan for first-time buyers (0-40%).', disabled: mortgageDetails.buyerStatus !== 'first-time' },
    { id: 'lisa', label: 'Lifetime ISA Contribution', type: 'number', step: '0.01', min: '0', defaultValue: '4000', tooltip: 'LISA savings for first-time buyers.', disabled: mortgageDetails.buyerStatus !== 'first-time' },
    { id: 'overpayment', label: 'Monthly Overpayment', type: 'number', step: '0.01', min: '0', defaultValue: '0', tooltip: 'Additional monthly payment.' },
    { id: 'rateForecast', label: 'Interest Rate Forecast (%)', type: 'number', step: '0.01', min: '0', defaultValue: '1', tooltip: 'Expected rate increase for variable mortgages.' },
    { id: 'riskTolerance', label: 'Risk Tolerance', type: 'select', options: [
      { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }
    ], tooltip: 'Your comfort with rate changes.' }
  ];

  const scenarioFields = [
    { id: 'loanAmount', label: 'Loan Amount', type: 'number', step: '0.01', min: '0', defaultValue: '270000' },
    { id: 'interestRate', label: 'Interest Rate (%)', type: 'number', step: '0.01', min: '0', defaultValue: '3.5' },
    { id: 'term', label: 'Term (Years)', type: 'number', step: '1', min: '5', max: '40', defaultValue: '25' }
  ];

  return (
    <>
      <div className={`bg-white  flex items-center justify-center p-4 ${isDarkMode ? 'dark' : ''}`}>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Advanced UK Mortgage Calculator</h1>
            <button onClick={toggleTheme} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg">Toggle Dark Mode</button>
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Mortgage Details</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Enter details to calculate your UK mortgage payments and affordability.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mortgageFields.map(field => (
              <div key={field.id} className="relative">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  {field.label}
                  <span className="tooltip ml-1">?<span className="tooltiptext">{field.tooltip}</span></span>
                </label>
                {field.type === 'select' ? (
                  <select
                    value={mortgageDetails[field.id]}
                    onChange={(e) => updateMortgageDetail(field.id, e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                  >
                    {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    value={mortgageDetails[field.id]}
                    onChange={(e) => updateMortgageDetail(field.id, e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                    readOnly={field.readOnly}
                    disabled={field.disabled}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-4">Scenario Analysis</h2>
          {scenarios.map(scenario => (
            <div key={scenario.id} className="border p-4 rounded-lg mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Scenario {scenario.id}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenarioFields.map(field => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      step={field.step}
                      min={field.min}
                      max={field.max}
                      value={scenario[field.id]}
                      onChange={(e) => updateScenario(scenario.id, field.id, e.target.value)}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={addScenario} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4">Add Scenario</button>
          <div className="flex gap-4 mt-6 flex-wrap">
            <button onClick={convertCurrency} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">Convert Currency</button>
            <button onClick={calculate} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">Calculate</button>
            <button onClick={saveCalculation} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">Save Calculation</button>
          </div>
          {results && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Mortgage & Affordability Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(results).filter(([k]) => !['scenarios', 'affordabilityPlanner', 'overpaymentSavings', 'rateRisk', 'sensitivity'].includes(k)).map(([key, value]) => (
                  <div key={key}>
                    <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 overflow-x-auto max-h-80">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">Monthly Payment</th>
                      <th className="p-2">Total Cost</th>
                      <th className="p-2">LTV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarios.map(s => (
                      <tr key={s.name}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{currencySymbols[mortgageDetails.currency]}{s.payment}</td>
                        <td className="p-2">{currencySymbols[mortgageDetails.currency]}{s.totalCost}</td>
                        <td className="p-2">{s.ltv}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Affordability Planner</h3>
                <p className="text-gray-600 dark:text-gray-300">{results.affordabilityPlanner}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Overpayment Planner</h3>
                <p className="text-gray-600 dark:text-gray-300">{results.overpaymentSavings}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Rate Risk Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">{results.rateRisk}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Sensitivity Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">{results.sensitivity}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Cost Breakdown</h3>
                <canvas ref={costPieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Loan Balance</h3>
                <canvas ref={balanceLineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Principal vs. Interest</h3>
                <canvas ref={principalAreaChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">LTV Ratio</h3>
                <canvas ref={ltvDonutChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Scenario Metrics Comparison</h3>
                <canvas ref={metricsBarChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 overflow-x-auto max-h-80">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Amortization Schedule</h3>
                <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-2">Month</th>
                      <th className="p-2">Payment</th>
                      <th className="p-2">Principal</th>
                      <th className="p-2">Interest</th>
                      <th className="p-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showFullAmortization ? amortizationSchedule : amortizationSchedule.slice(0, 12)).map(s => (
                      <tr key={s.month}>
                        <td className="p-2">{s.month}</td>
                        <td className="p-2">{currencySymbols[mortgageDetails.currency]}{s.payment}</td>
                        <td className="p-2">{currencySymbols[mortgageDetails.currency]}{s.principal}</td>
                        <td className="p-2">{currencySymbols[mortgageDetails.currency]}{s.interest}</td>
                        <td className="p-2">{currencySymbols[mortgageDetails.currency]}{s.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={toggleAmortization} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4">
                  {showFullAmortization ? 'Show Partial Schedule' : 'Show Full Schedule'}
                </button>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Calculation History</h3>
                <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-2">Date</th>
                      <th className="p-2">Key Metric</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mortgageHistory.map((h, i) => (
                      <tr key={i}>
                        <td className="p-2">{h.date}</td>
                        <td className="p-2">{h.keyMetric}</td>
                        <td className="p-2">{h.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4 flex-wrap">
                <button onClick={exportCSV} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">Export CSV</button>
                <button onClick={exportPDF} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">Export PDF</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .tooltip { position: relative; display: inline-block; cursor: pointer; }
        .tooltiptext { visibility: hidden; width: 200px; background-color: #555; color: #fff; text-align: center; border-radius: 6px; padding: 5px; position: absolute; z-index: 10; bottom: 125%; left: 50%; margin-left: -100px; opacity: 0; transition: opacity 0.3s; }
        .tooltip:hover .tooltiptext { visibility: visible; opacity: 1; }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.5s ease-out; }
        @media (max-width: 640px) {
          .grid-cols-3 { grid-template-columns: 1fr; }
          .flex-wrap { flex-direction: column; }
          button { width: 100%; }
        }
      `}</style>
    </>
  );
}
