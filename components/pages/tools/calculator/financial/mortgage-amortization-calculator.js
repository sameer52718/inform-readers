"use client"
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';

export default function Home() {
  const [formData, setFormData] = useState({
    currency: 'USD',
    loanAmount: '200000',
    interestRate: '4',
    term: '30',
    mortgageType: 'fixed',
    propertyValue: '250000',
    deposit: '50000',
    income: '60000',
    debtPayments: '500',
    originationFees: '2000',
    closingCosts: '3000',
    monthlyOverpayment: '100',
    onetimeOverpayment: '0',
    onetimeMonth: '12',
    taxRate: '25',
    taxDeduction: 'yes',
    armInitialRate: '3.5',
    armFrequency: '5',
    armCap: '2',
    refinanceRate: '3.5',
    refinanceTerm: '20',
    refinanceCosts: '5000',
  });
  const [scenarios, setScenarios] = useState([{ loan: '200000', rate: '4', term: '30' }]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState(JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('amortizationHistory') : '[]') || []);
  const [showFullAmortization, setShowFullAmortization] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const costPieChartRef = useRef(null);
  const balanceLineChartRef = useRef(null);
  const principalAreaChartRef = useRef(null);
  const taxDonutChartRef = useRef(null);
  const metricsBarChartRef = useRef(null);
  let costPieChart, balanceLineChart, principalAreaChart, taxDonutChart, metricsBarChart;

  useEffect(() => {
    if (costPieChartRef.current) {
      costPieChart = new Chart(costPieChartRef.current, { type: 'pie', data: { labels: [], datasets: [] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Cost Breakdown' } } } });
    }
    if (balanceLineChartRef.current) {
      balanceLineChart = new Chart(balanceLineChartRef.current, { type: 'line', data: { labels: [], datasets: [] }, options: { responsive: true, scales: { x: { title: { display: true, text: 'Month' } }, y: { title: { display: true, text: `Balance` } } }, plugins: { title: { display: true, text: 'Loan Balance' } } } });
    }
    if (principalAreaChartRef.current) {
      principalAreaChart = new Chart(principalAreaChartRef.current, { type: 'line', data: { labels: [], datasets: [] }, options: { responsive: true, scales: { x: { title: { display: true, text: 'Month' } }, y: { title: { display: true, text: `Amount` } } }, plugins: { title: { display: true, text: 'Principal vs. Interest' } } } });
    }
    if (taxDonutChartRef.current) {
      taxDonutChart = new Chart(taxDonutChartRef.current, { type: 'doughnut', data: { labels: [], datasets: [] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Tax Savings vs. Interest' } } } });
    }
    if (metricsBarChartRef.current) {
      metricsBarChart = new Chart(metricsBarChartRef.current, { type: 'bar', data: { labels: [], datasets: [] }, options: { responsive: true, scales: { y: { title: { display: true, text: `Amount` } } }, plugins: { title: { display: true, text: 'Scenario Metrics Comparison' } } } });
    }
    return () => {
      costPieChart?.destroy();
      balanceLineChart?.destroy();
      principalAreaChart?.destroy();
      taxDonutChart?.destroy();
      metricsBarChart?.destroy();
    };
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === 'mortgageType' && value !== 'adjustable') {
        newData.armInitialRate = prev.interestRate;
      } else if (field === 'interestRate' && prev.mortgageType === 'adjustable') {
        newData.armInitialRate = value;
      }
      return newData;
    });
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setError('Maximum 3 scenarios allowed.');
      return;
    }
    setScenarios([...scenarios, { loan: '200000', rate: '4', term: '30' }]);
  };

  const updateScenario = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index][field] = value;
    setScenarios(newScenarios);
  };

  const calculatePayment = (loan, rate, term, type) => {
    const monthlyRate = rate / 100 / 12;
    const months = term * 12;
    if (type === 'repayment' || type === 'fixed' || type === 'adjustable') {
      return loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }
    return loan * monthlyRate;
  };

  const calculateAmortization = (loan, rate, term, monthlyOverpayment, onetimeOverpayment, onetimeMonth, type, armSettings) => {
    let monthlyRate = rate / 100 / 12;
    const months = term * 12;
    let balance = loan;
    let totalInterest = 0;
    let totalTaxSavings = 0;
    let schedule = [];
    let newTerm = months;
    const taxRate = parseFloat(formData.taxRate) / 100;
    const taxDeduction = formData.taxDeduction === 'yes';

    if (type === 'adjustable') {
      const initialRate = armSettings.initialRate / 100 / 12;
      const frequency = armSettings.frequency * 12;
      const cap = armSettings.cap / 100 / 12;
      let currentRate = initialRate;

      for (let i = 0; i < months && balance > 0; i++) {
        if (i > 0 && i % frequency === 0) {
          currentRate = Math.min(currentRate + (Math.random() * 0.02 - 0.01), currentRate + cap);
          currentRate = Math.max(currentRate, initialRate - cap);
        }
        monthlyRate = currentRate;

        const interest = balance * monthlyRate;
        let principal = type === 'interest-only' ? 0 : calculatePayment(balance, monthlyRate * 12 * 100, (months - i) / 12, 'repayment') - interest;
        let payment = principal + interest;
        let extraPayment = i + 1 === onetimeMonth ? onetimeOverpayment : monthlyOverpayment;
        payment += extraPayment;
        balance = balance - principal - extraPayment;

        if (balance < 0) {
          payment += balance;
          balance = 0;
          newTerm = i + 1;
        }

        totalInterest += interest;
        if (taxDeduction) {
          totalTaxSavings += interest * taxRate;
        }

        schedule.push({
          month: i + 1,
          payment: payment.toFixed(2),
          principal: principal.toFixed(2),
          interest: interest.toFixed(2),
          balance: balance.toFixed(2),
          rate: (monthlyRate * 12 * 100).toFixed(2),
        });
      }
    } else {
      for (let i = 0; i < months && balance > 0; i++) {
        const interest = balance * monthlyRate;
        let principal = type === 'interest-only' ? 0 : calculatePayment(loan, rate, term, 'repayment') - interest;
        let payment = principal + interest;
        let extraPayment = i + 1 === onetimeMonth ? onetimeOverpayment : monthlyOverpayment;
        payment += extraPayment;
        balance = balance - principal - extraPayment;

        if (balance < 0) {
          payment += balance;
          balance = 0;
          newTerm = i + 1;
        }

        totalInterest += interest;
        if (taxDeduction) {
          totalTaxSavings += interest * taxRate;
        }

        schedule.push({
          month: i + 1,
          payment: payment.toFixed(2),
          principal: principal.toFixed(2),
          interest: interest.toFixed(2),
          balance: balance.toFixed(2),
          rate: rate.toFixed(2),
        });
      }
    }

    return { schedule, totalInterest: totalInterest.toFixed(2), newTerm: Math.ceil(newTerm / 12), totalTaxSavings: totalTaxSavings.toFixed(2) };
  };

  const calculate = () => {
    setError('');
    const { currency, loanAmount, interestRate, term, mortgageType, propertyValue, deposit, income, debtPayments, originationFees, closingCosts, monthlyOverpayment, onetimeOverpayment, onetimeMonth, taxRate, refinanceRate, refinanceTerm, refinanceCosts, armInitialRate, armFrequency, armCap } = formData;
    const parsedData = {
      loanAmount: parseFloat(loanAmount),
      interestRate: parseFloat(interestRate),
      term: parseInt(term),
      propertyValue: parseFloat(propertyValue),
      deposit: parseFloat(deposit),
      income: parseFloat(income),
      debtPayments: parseFloat(debtPayments),
      originationFees: parseFloat(originationFees),
      closingCosts: parseFloat(closingCosts),
      monthlyOverpayment: parseFloat(monthlyOverpayment),
      onetimeOverpayment: parseFloat(onetimeOverpayment),
      onetimeMonth: parseInt(onetimeMonth),
      taxRate: parseFloat(taxRate),
      refinanceRate: parseFloat(refinanceRate),
      refinanceTerm: parseInt(refinanceTerm),
      refinanceCosts: parseFloat(refinanceCosts),
      armSettings: { initialRate: parseFloat(armInitialRate), frequency: parseInt(armFrequency), cap: parseFloat(armCap) },
    };

    if (Object.values(parsedData).some(isNaN) || (mortgageType === 'adjustable' && Object.values(parsedData.armSettings).some(isNaN))) {
      setError('Please provide valid inputs.');
      return;
    }
    if (parsedData.loanAmount <= 0 || parsedData.interestRate < 0 || parsedData.term < 5 || parsedData.term > 40 || parsedData.propertyValue <= 0 || parsedData.deposit < 0 || parsedData.income <= 0 || parsedData.debtPayments < 0 || parsedData.originationFees < 0 || parsedData.closingCosts < 0 || parsedData.monthlyOverpayment < 0 || parsedData.onetimeOverpayment < 0 || parsedData.onetimeMonth < 1 || parsedData.onetimeMonth > parsedData.term * 12 || parsedData.taxRate < 0 || parsedData.taxRate > 100 || parsedData.refinanceRate < 0 || parsedData.refinanceTerm < 5 || parsedData.refinanceTerm > 40 || parsedData.refinanceCosts < 0) {
      setError('Invalid input values (e.g., negative or out-of-range).');
      return;
    }
    if (parsedData.loanAmount + parsedData.deposit > parsedData.propertyValue) {
      setError('Loan amount + deposit exceeds property value.');
      return;
    }

    const monthlyPayment = calculatePayment(parsedData.loanAmount, parsedData.interestRate, parsedData.term, mortgageType === 'fixed' || mortgageType === 'adjustable' ? 'repayment' : mortgageType).toFixed(2);
    const { schedule, totalInterest, newTerm, totalTaxSavings } = calculateAmortization(parsedData.loanAmount, parsedData.interestRate, parsedData.term, parsedData.monthlyOverpayment, parsedData.onetimeOverpayment, parsedData.onetimeMonth, mortgageType === 'fixed' || mortgageType === 'interest-only' ? mortgageType : 'adjustable', parsedData.armSettings);
    const totalCost = (parsedData.loanAmount + parseFloat(totalInterest) + parsedData.originationFees + parsedData.closingCosts).toFixed(2);
    const ltv = ((parsedData.loanAmount / parsedData.propertyValue) * 100).toFixed(2);
    const dti = (((parseFloat(monthlyPayment) + parsedData.debtPayments) / (parsedData.income / 12)) * 100).toFixed(2);

    const noOverpayment = calculateAmortization(parsedData.loanAmount, parsedData.interestRate, parsedData.term, 0, 0, 0, mortgageType === 'fixed' || mortgageType === 'interest-only' ? mortgageType : 'adjustable', parsedData.armSettings);
    const overpaymentSavings = parsedData.monthlyOverpayment > 0 || parsedData.onetimeOverpayment > 0
      ? `Overpayments reduce term to ${newTerm} years, saving ${currency} ${(noOverpayment.totalInterest - totalInterest).toFixed(2)} in interest.`
      : `No overpayments. Consider overpaying to reduce term and interest.`;

    const refinancePayment = calculatePayment(parsedData.loanAmount, parsedData.refinanceRate, parsedData.refinanceTerm, 'repayment').toFixed(2);
    const refinanceAmortization = calculateAmortization(parsedData.loanAmount, parsedData.refinanceRate, parsedData.refinanceTerm, 0, 0, 0, 'repayment', {});
    const refinanceSavings = (parseFloat(noOverpayment.totalInterest) - parseFloat(refinanceAmortization.totalInterest) - parsedData.refinanceCosts).toFixed(2);
    const refinanceAnalysis = refinanceSavings > 0
      ? `Refinancing at ${parsedData.refinanceRate}% for ${parsedData.refinanceTerm} years saves ${currency} ${refinanceSavings} after ${currency} ${parsedData.refinanceCosts} costs.`
      : `Refinancing at ${parsedData.refinanceRate}% for ${parsedData.refinanceTerm} years costs ${currency} ${-refinanceSavings} more.`;

    const sensitivity = [];
    for (let rate = Math.max(0, parsedData.interestRate - 0.5); rate <= parsedData.interestRate + 0.5; rate += 0.5) {
      const sPayment = calculatePayment(parsedData.loanAmount, rate, parsedData.term, mortgageType === 'fixed' || mortgageType === 'adjustable' ? 'repayment' : mortgageType).toFixed(2);
      sensitivity.push({ rate: rate.toFixed(1), payment: sPayment });
    }

    const scenarioResults = scenarios.map((s, index) => {
      const sLoan = parseFloat(s.loan);
      const sRate = parseFloat(s.rate);
      const sTerm = parseInt(s.term);
      if (isNaN(sLoan) || isNaN(sRate) || isNaN(sTerm)) return null;
      const sPayment = calculatePayment(sLoan, sRate, sTerm, mortgageType === 'fixed' || mortgageType === 'adjustable' ? 'repayment' : mortgageType).toFixed(2);
      const sAmortization = calculateAmortization(sLoan, sRate, sTerm, 0, 0, 0, mortgageType === 'fixed' || mortgageType === 'interest-only' ? mortgageType : 'adjustable', parsedData.armSettings);
      const sTotalCost = (sLoan + parseFloat(sAmortization.totalInterest) + parsedData.originationFees + parsedData.closingCosts).toFixed(2);
      return { name: `Scenario ${index + 1}`, payment: sPayment, totalCost: sTotalCost, payoffTime: `${sAmortization.newTerm} years` };
    }).filter(s => s);

    setResults({
      monthlyPayment: `${currency} ${monthlyPayment}`,
      totalInterest: `${currency} ${totalInterest}`,
      totalCost: `${currency} ${totalCost}`,
      ltv: `${ltv}%`,
      dti: `${dti}%`,
      newTerm: `${newTerm} years`,
      taxSavings: `${currency} ${totalTaxSavings}`,
      schedule,
      scenarios: scenarioResults,
      overpaymentSavings,
      refinanceAnalysis,
      sensitivity,
    });
  };

  const convertCurrency = () => {
    setError('');
    const rates = { USD: 1, GBP: 0.79, PKR: 277.95, INR: 83.95 };
    const newCurrency = formData.currency === 'USD' ? 'GBP' : formData.currency === 'GBP' ? 'PKR' : formData.currency === 'PKR' ? 'INR' : 'USD';
    const factor = rates[newCurrency] / rates[formData.currency];

    setFormData((prev) => ({
      ...prev,
      currency: newCurrency,
      loanAmount: (parseFloat(prev.loanAmount) * factor).toFixed(2),
      propertyValue: (parseFloat(prev.propertyValue) * factor).toFixed(2),
      deposit: (parseFloat(prev.deposit) * factor).toFixed(2),
      income: (parseFloat(prev.income) * factor).toFixed(2),
      debtPayments: (parseFloat(prev.debtPayments) * factor).toFixed(2),
      originationFees: (parseFloat(prev.originationFees) * factor).toFixed(2),
      closingCosts: (parseFloat(prev.closingCosts) * factor).toFixed(2),
      monthlyOverpayment: (parseFloat(prev.monthlyOverpayment) * factor).toFixed(2),
      onetimeOverpayment: (parseFloat(prev.onetimeOverpayment) * factor).toFixed(2),
      refinanceCosts: (parseFloat(prev.refinanceCosts) * factor).toFixed(2),
    }));

    setScenarios(scenarios.map(s => ({
      ...s,
      loan: (parseFloat(s.loan) * factor).toFixed(2),
    })));
  };

  const saveCalculation = () => {
    if (!results) {
      setError('No valid calculation to save.');
      return;
    }
    const newHistory = [...history, { date: new Date().toLocaleString(), keyMetric: 'Monthly Payment', value: results.monthlyPayment }];
    setHistory(newHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem('amortizationHistory', JSON.stringify(newHistory));
    }
    setSuccess('Calculation saved to history!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const exportCSV = () => {
    const csvContent = [['Date', 'Key Metric', 'Value'], ...history.map(h => [h.date, h.keyMetric, h.value])].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amortization_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Advanced Mortgage Amortization Calculator Results', 10, 10);
    doc.setFontSize(12);
    doc.text('Calculation History:', 10, 20);
    let y = 30;
    history.forEach(h => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text('Note: Visual charts (Pie, Line, Area, Donut, Bar) and amortization schedule are available in the web interface.', 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save('amortization_results.pdf');
  };

  const updateCharts = () => {
    if (!results) return;
    const { schedule, scenarios, totalInterest, taxSavings, currency } = results;

    costPieChart.data = {
      labels: ['Principal', 'Interest', 'Fees'],
      datasets: [{
        data: [
          parseFloat(formData.loanAmount),
          parseFloat(totalInterest.replace(currency, '')),
          parseFloat(formData.originationFees) + parseFloat(formData.closingCosts),
        ],
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
      }],
    };
    costPieChart.update();

    const noOverpaymentSchedule = calculateAmortization(
      parseFloat(formData.loanAmount),
      parseFloat(formData.interestRate),
      parseInt(formData.term),
      0,
      0,
      0,
      formData.mortgageType,
      { initialRate: parseFloat(formData.armInitialRate), frequency: parseInt(formData.armFrequency), cap: parseFloat(formData.armCap) }
    ).schedule;
    balanceLineChart.data = {
      labels: schedule.map(s => s.month),
      datasets: [
        { label: `Balance with Overpayment (${currency})`, data: schedule.map(s => s.balance), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.2)', yAxisID: 'y' },
        { label: `Balance without Overpayment (${currency})`, data: noOverpaymentSchedule.map(s => s.balance), borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.2)', yAxisID: 'y' },
      ],
    };
    balanceLineChart.update();

    principalAreaChart.data = {
      labels: schedule.map(s => s.month),
      datasets: [
        { label: `Principal (${currency})`, data: schedule.map(s => s.principal), borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.4)', fill: true, yAxisID: 'y' },
        { label: `Interest (${currency})`, data: schedule.map(s => s.interest), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.4)', fill: true, yAxisID: 'y' },
      ],
    };
    principalAreaChart.update();

    taxDonutChart.data = {
      labels: ['Interest Paid', 'Tax Savings'],
      datasets: [{
        data: [parseFloat(totalInterest.replace(currency, '')), parseFloat(taxSavings.replace(currency, ''))],
        backgroundColor: ['#3b82f6', '#f59e0b'],
      }],
    };
    taxDonutChart.update();

    metricsBarChart.data = {
      labels: scenarios.map(s => s.name),
      datasets: [
        { label: `Monthly Payment (${currency})`, data: scenarios.map(s => s.payment), backgroundColor: '#3b82f6' },
        { label: `Total Cost (${currency})`, data: scenarios.map(s => s.totalCost), backgroundColor: '#10b981' },
      ],
    };
    metricsBarChart.update();
  };

  useEffect(() => {
    if (results) {
      updateCharts();
    }
  }, [results]);

  return (
    <>
      <div className={`bg-white  flex items-center justify-center p-4 ${darkMode ? 'dark' : ''}`}>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-blue-100">Advanced Mortgage Amortization Calculator</h1>
            <button onClick={() => setDarkMode(!darkMode)} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg">Toggle Dark Mode</button>
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Mortgage Details</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Enter details to calculate your mortgage amortization schedule.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Currency', field: 'currency', type: 'select', options: ['USD', 'GBP', 'PKR', 'INR'], tooltip: 'Choose your currency.' },
              { label: 'Loan Amount', field: 'loanAmount', type: 'number', step: '0.01', min: '0', tooltip: 'Total mortgage amount.' },
              { label: 'Interest Rate (%)', field: 'interestRate', type: 'number', step: '0.01', min: '0', tooltip: 'Annual interest rate.' },
              { label: 'Mortgage Term (Years)', field: 'term', type: 'number', step: '1', min: '5', max: '40', tooltip: 'Duration of mortgage (5-40 years).' },
              { label: 'Mortgage Type', field: 'mortgageType', type: 'select', options: ['fixed', 'adjustable', 'interest-only'], tooltip: 'Fixed, Adjustable, or Interest-Only.' },
              { label: 'Property Value', field: 'propertyValue', type: 'number', step: '0.01', min: '0', tooltip: 'Purchase price for LTV calculation.' },
              { label: 'Deposit Amount', field: 'deposit', type: 'number', step: '0.01', min: '0', tooltip: 'Upfront deposit for LTV.' },
              { label: 'Annual Household Income', field: 'income', type: 'number', step: '0.01', min: '0', tooltip: 'For DTI calculation.' },
              { label: 'Monthly Debt Payments', field: 'debtPayments', type: 'number', step: '0.01', min: '0', tooltip: 'Other monthly debt obligations.' },
              { label: 'Origination Fees', field: 'originationFees', type: 'number', step: '0.01', min: '0', tooltip: 'Loan processing fees.' },
              { label: 'Closing Costs', field: 'closingCosts', type: 'number', step: '0.01', min: '0', tooltip: 'Additional closing fees.' },
              { label: 'Monthly Overpayment', field: 'monthlyOverpayment', type: 'number', step: '0.01', min: '0', tooltip: 'Additional monthly payment.' },
              { label: 'One-Time Overpayment', field: 'onetimeOverpayment', type: 'number', step: '0.01', min: '0', tooltip: 'One-time extra payment amount.' },
              { label: 'One-Time Overpayment Month', field: 'onetimeMonth', type: 'number', step: '1', min: '1', tooltip: 'Month for one-time overpayment.' },
              { label: 'Tax Rate (%)', field: 'taxRate', type: 'number', step: '0.01', min: '0', max: '100', tooltip: 'For interest deduction calculation.' },
              { label: 'Tax Deduction Eligible', field: 'taxDeduction', type: 'select', options: ['yes', 'no'], tooltip: 'Eligible for mortgage interest deduction?' },
            ].map(item => (
              <div key={item.label}>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  {item.label}
                  <span className="tooltip">?<span className="tooltiptext">{item.tooltip}</span></span>
                </label>
                {item.type === 'select' ? (
                  <select value={formData[item.field]} onChange={(e) => updateFormData(item.field, e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200">
                    {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={item.type}
                    value={formData[item.field]}
                    onChange={(e) => updateFormData(item.field, e.target.value)}
                    step={item.step}
                    min={item.min}
                    max={item.max}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-4">Adjustable-Rate Mortgage Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Initial Rate (%)', field: 'armInitialRate', step: '0.01', min: '0', tooltip: 'Initial ARM rate.', disabled: formData.mortgageType !== 'adjustable' },
              { label: 'Adjustment Frequency (Years)', field: 'armFrequency', step: '1', min: '1', tooltip: 'How often rate adjusts.', disabled: formData.mortgageType !== 'adjustable' },
              { label: 'Rate Cap (%)', field: 'armCap', step: '0.01', min: '0', tooltip: 'Maximum rate increase per adjustment.', disabled: formData.mortgageType !== 'adjustable' },
            ].map(item => (
              <div key={item.label}>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  {item.label}
                  <span className="tooltip">?<span className="tooltiptext">{item.tooltip}</span></span>
                </label>
                <input
                  type="number"
                  value={formData[item.field]}
                  onChange={(e) => updateFormData(item.field, e.target.value)}
                  step={item.step}
                  min={item.min}
                  disabled={item.disabled}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-4">Refinancing Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'New Interest Rate (%)', field: 'refinanceRate', step: '0.01', min: '0', tooltip: 'Rate for refinanced mortgage.' },
              { label: 'New Term (Years)', field: 'refinanceTerm', step: '1', min: '5', max: '40', tooltip: 'Term for refinanced mortgage.' },
              { label: 'Refinancing Costs', field: 'refinanceCosts', step: '0.01', min: '0', tooltip: 'Costs to refinance.' },
            ].map(item => (
              <div key={item.label}>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  {item.label}
                  <span className="tooltip">?<span className="tooltiptext">{item.tooltip}</span></span>
                </label>
                <input
                  type="number"
                  value={formData[item.field]}
                  onChange={(e) => updateFormData(item.field, e.target.value)}
                  step={item.step}
                  min={item.min}
                  max={item.max}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-4">Scenario Analysis</h2>
          <div>
            {scenarios.map((scenario, index) => (
              <div key={index} className="border border-gray-200 p-4 mb-4 rounded-lg">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100 mb-2">Scenario {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Loan Amount', field: 'loan', step: '0.01', min: '0' },
                    { label: 'Interest Rate (%)', field: 'rate', step: '0.01', min: '0' },
                    { label: 'Term (Years)', field: 'term', step: '1', min: '5', max: '40' },
                  ].map(item => (
                    <div key={item.label}>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{item.label}</label>
                      <input
                        type="number"
                        value={scenario[item.field]}
                        onChange={(e) => updateScenario(index, item.field, e.target.value)}
                        step={item.step}
                        min={item.min}
                        max={item.max}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={addScenario} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4">Add Scenario</button>
          </div>
          <div className="flex gap-4 mb-8 flex-wrap mt-6">
            <button onClick={convertCurrency} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">Convert Currency</button>
            <button onClick={calculate} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">Calculate</button>
            <button onClick={saveCalculation} className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">Save Calculation</button>
          </div>
          {results && (
            <div className="mt-6 animate-slide-in">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Amortization & Financial Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Monthly Payment', value: results.monthlyPayment },
                  { label: 'Total Interest', value: results.totalInterest },
                  { label: 'Total Cost', value: results.totalCost },
                  { label: 'Loan-to-Value (LTV)', value: results.ltv },
                  { label: 'Debt-to-Income (DTI)', value: results.dti },
                  { label: 'New Term (with Overpayment)', value: results.newTerm },
                  { label: 'Tax Savings', value: results.taxSavings },
                ].map(item => (
                  <div key={item.label}>
                    <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">{item.label}</h3>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 overflow-x-auto max-h-[300px] overflow-y-auto">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">Monthly Payment</th>
                      <th className="p-2">Total Cost</th>
                      <th className="p-2">Payoff Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarios.map(s => (
                      <tr key={s.name}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{formData.currency} {s.payment}</td>
                        <td className="p-2">{formData.currency} {s.totalCost}</td>
                        <td className="p-2">{s.payoffTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Overpayment Planner</h3>
                <p className="text-gray-600 dark:text-gray-300">{results.overpaymentSavings}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Refinancing Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">{results.refinanceAnalysis}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Sensitivity Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">Monthly payment ranges from {formData.currency} {results.sensitivity[0].payment} at {results.sensitivity[0].rate}% to {formData.currency} {results.sensitivity[results.sensitivity.length - 1].payment} at {results.sensitivity[results.sensitivity.length - 1].rate}%.</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Tax Savings</h3>
                <p className="text-gray-600 dark:text-gray-300">{results.taxSavings !== `${formData.currency} 0.00` ? `Tax deductions save ${results.taxSavings} over the term.` : 'No tax deductions applied.'}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Cost Breakdown</h3>
                <canvas ref={costPieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Loan Balance</h3>
                <canvas ref={balanceLineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Principal vs. Interest</h3>
                <canvas ref={principalAreaChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Tax Savings vs. Interest</h3>
                <canvas ref={taxDonutChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Scenario Metrics Comparison</h3>
                <canvas ref={metricsBarChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 overflow-x-auto max-h-[300px] overflow-y-auto">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Amortization Schedule</h3>
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
                    {(showFullAmortization ? results.schedule : results.schedule.slice(0, 12)).map(s => (
                      <tr key={s.month}>
                        <td className="p-2">{s.month}</td>
                        <td className="p-2">{formData.currency} {s.payment}</td>
                        <td className="p-2">{formData.currency} {s.principal}</td>
                        <td className="p-2">{formData.currency} {s.interest}</td>
                        <td className="p-2">{formData.currency} {s.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={() => setShowFullAmortization(!showFullAmortization)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4">{showFullAmortization ? 'Show Partial Schedule' : 'Show Full Schedule'}</button>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-blue-100">Calculation History</h3>
                <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-2">Date</th>
                      <th className="p-2">Key Metric</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, index) => (
                      <tr key={index}>
                        <td className="p-2">{h.date}</td>
                        <td className="p-2">{h.keyMetric}</td>
                        <td className="p-2">{h.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4 flex-wrap">
                <button onClick={exportCSV} className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">Export CSV</button>
                <button onClick={exportPDF} className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">Export PDF</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .tooltip { position: relative; display: inline-block; cursor: pointer; }
        .tooltip .tooltiptext { visibility: hidden; width: 200px; background-color: #555; color: #fff; text-align: center; border-radius: 6px; padding: 5px; position: absolute; z-index: 1; bottom: 125%; left: 50%; margin-left: -100px; opacity: 0; transition: opacity 0.3s; }
        .tooltip:hover .tooltiptext { visibility: visible; opacity: 1; }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.5s ease-out; }
      `}</style>
    </>
  );
}