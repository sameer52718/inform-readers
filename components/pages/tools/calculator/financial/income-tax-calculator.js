"use client"
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    taxYear: '2025',
    filingStatus: 'single',
    state: 'none',
    salary: '50000',
    businessIncome: '0',
    investmentIncome: '0',
    otherIncome: '0',
    deductionType: 'standard',
    mortgageInterest: '0',
    charity: '0',
    medical: '0',
    stateLocalTax: '0',
    businessExpenses: '0',
    dependents: '0',
    eitc: '0',
    educationCredit: '0',
    energyCredit: '0',
    federalWithholding: '0',
    stateWithholding: '0',
    annualExpenses: '30000',
    savingsRate: '20',
    dti: '36',
    currency: 'USD',
  });
  const [salaryRange, setSalaryRange] = useState('50000');
  const [theme, setTheme] = useState('light');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [activeSections, setActiveSections] = useState({ deductions: false, credits: false, withholding: false });
  const canvasRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleSection = (section) => {
    setActiveSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'salary') setSalaryRange(value);
  };

  const syncSlider = (value) => {
    setSalaryRange(value);
    updateFormData('salary', value);
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: '$', EUR: '€', INR: '₹' };
    return `${symbols[currency]} ${parseFloat(amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const validateInputs = () => {
    const { salary, businessIncome, investmentIncome, otherIncome, mortgageInterest, charity, medical, stateLocalTax, businessExpenses, dependents, eitc, educationCredit, energyCredit, federalWithholding, stateWithholding, annualExpenses, savingsRate, dti } = formData;
    if ([salary, businessIncome, investmentIncome, otherIncome, mortgageInterest, charity, medical, stateLocalTax, businessExpenses, dependents, eitc, educationCredit, energyCredit, federalWithholding, stateWithholding, annualExpenses, savingsRate, dti].some(v => parseFloat(v) < 0)) return 'Values cannot be negative';
    if (parseFloat(savingsRate) > 100 || parseFloat(dti) > 100) return 'Savings rate and DTI must be between 0% and 100%';
    return null;
  };

  const calculateTax = () => {
    setError('');
    setResults(null);
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const parsedData = Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, parseFloat(v) || v]));
    const { taxYear, filingStatus, state, salary, businessIncome, investmentIncome, otherIncome, deductionType, mortgageInterest, charity, medical, stateLocalTax, businessExpenses, dependents, eitc, educationCredit, energyCredit, federalWithholding, stateWithholding, annualExpenses, savingsRate, dti, currency } = parsedData;

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

    const grossIncome = salary + businessIncome + investmentIncome + otherIncome;
    let totalDeductions = businessExpenses;
    if (deductionType === 'standard') {
      totalDeductions += standardDeductions[taxYear][filingStatus];
    } else {
      totalDeductions += mortgageInterest + charity + medical + Math.min(stateLocalTax, 10000);
    }
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    let federalTax = 0;
    let marginalRate = 0;
    const brackets = federalBrackets[taxYear][filingStatus];
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max || taxableIncome) - bracket.min;
        federalTax += taxableInBracket * bracket.rate;
        marginalRate = bracket.rate;
      }
    }

    const socialSecurityCap = 168600;
    const socialSecurity = Math.min(grossIncome, socialSecurityCap) * 0.062;
    const medicare = grossIncome * 0.0145;

    let stateTax = 0;
    if (state !== 'none' && state !== 'TX') {
      const stateBracket = stateBrackets[state];
      for (const bracket of stateBracket) {
        if (taxableIncome > bracket.min) {
          const taxableInBracket = Math.min(taxableIncome, bracket.max || taxableIncome) - bracket.min;
          stateTax += taxableInBracket * bracket.rate;
        }
      }
    }

    const childTaxCredit = dependents * 2000;
    let eitcCredit = 0;
    if (eitc > 0 && eitc <= 50000) {
      eitcCredit = eitc <= 20000 ? 3000 : eitc <= 35000 ? 1500 : 500;
    }
    const totalCredits = childTaxCredit + eitcCredit + educationCredit + energyCredit;

    const totalFederalTax = Math.max(0, federalTax + socialSecurity + medicare - totalCredits);
    const totalTax = totalFederalTax + stateTax;
    const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
    const netIncome = grossIncome - totalTax;
    const taxDue = totalFederalTax - federalWithholding + stateTax - stateWithholding;
    const monthlyNetIncome = netIncome / 12;
    const monthlyExpenses = annualExpenses / 12;
    const monthlySavings = monthlyNetIncome * (savingsRate / 100);
    const surplus = monthlyNetIncome - monthlyExpenses - monthlySavings;
    const affordableExpenses = netIncome * (dti / 100) / 12;

    const summaryMetrics = [
      { label: 'Gross Income', value: formatCurrency(grossIncome, currency) },
      { label: 'Taxable Income', value: formatCurrency(taxableIncome, currency) },
      { label: 'Federal Tax', value: formatCurrency(totalFederalTax, currency) },
      { label: 'State Tax', value: formatCurrency(stateTax, currency) },
      { label: 'Total Tax', value: formatCurrency(totalTax, currency) },
      { label: 'Net Income', value: formatCurrency(netIncome, currency) },
      { label: 'Effective Tax Rate', value: `${effectiveTaxRate.toFixed(2)}%` },
      { label: 'Marginal Tax Rate', value: `${(marginalRate * 100).toFixed(2)}%` },
      { label: 'Tax Due/Refund', value: formatCurrency(taxDue, currency) },
      { label: 'Monthly Surplus', value: formatCurrency(surplus, currency) },
      { label: 'Affordable Expenses', value: formatCurrency(affordableExpenses, currency) },
    ];

    const detailedItems = [
      { category: 'Salary/Wages', amount: salary },
      { category: 'Business Income', amount: businessIncome },
      { category: 'Investment Income', amount: investmentIncome },
      { category: 'Other Income', amount: otherIncome },
      { category: 'Total Deductions', amount: -totalDeductions },
      { category: 'Federal Income Tax', amount: federalTax },
      { category: 'Social Security', amount: socialSecurity },
      { category: 'Medicare', amount: medicare },
      { category: 'State Tax', amount: stateTax },
      { category: 'Child Tax Credit', amount: -childTaxCredit },
      { category: 'EITC', amount: -eitcCredit },
      { category: 'Education Credit', amount: -educationCredit },
      { category: 'Energy Credit', amount: -energyCredit },
    ];

    const tips = [];
    if (effectiveTaxRate > 20) tips.push('Consider increasing deductions (e.g., charity, retirement contributions).');
    if (taxDue > 0) tips.push('Adjust withholding to avoid owing taxes next year.');
    if (surplus < 0) tips.push('Review expenses to ensure financial stability.');

    setResults({ summaryMetrics, detailedItems, tips, taxComponents: [
      { label: 'Federal Income', amount: federalTax },
      { label: 'Social Security', amount: socialSecurity },
      { label: 'Medicare', amount: medicare },
      { label: 'State Tax', amount: stateTax },
    ]});

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = theme === 'light' ? '#e5e7eb' : '#4a5568';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const totalTaxComponents = results?.taxComponents.reduce((sum, comp) => sum + Math.max(0, comp.amount), 0) || 0;
      let startAngle = 0;
      const colors = ['#06b6d4', '#f87171', '#facc15', '#34d399'];
      results?.taxComponents.forEach((comp, i) => {
        if (comp.amount > 0) {
          const sliceAngle = (comp.amount / totalTaxComponents) * 2 * Math.PI;
          ctx.beginPath();
          ctx.arc(290, 100, 80, startAngle, startAngle + sliceAngle);
          ctx.lineTo(290, 100);
          ctx.fillStyle = colors[i];
          ctx.fill();
          startAngle += sliceAngle;
        }
      });
    }
  };

  const sortTable = (index, isAscending) => {
    if (!results) return;
    const sortedItems = [...results.detailedItems].sort((a, b) => {
      if (index === 0) return isAscending ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
      return isAscending ? a.amount - b.amount : b.amount - a.amount;
    });
    setResults((prev) => ({ ...prev, detailedItems: sortedItems }));
  };

  const exportCSV = () => {
    if (!results) return;
    let csv = 'Category,Amount\n';
    results.detailedItems.forEach(item => {
      csv += `${item.category},${item.amount.toFixed(2)}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tax_breakdown.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
     
      <div className="bg-white min-h-screen flex items-center justify-center p-4 relative">
        <button onClick={toggleTheme} className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg">🌙 Toggle Theme</button>
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-2xl w-full transition-transform hover:-translate-y-1">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Advanced Income Tax Calculator</h1>
          <div className="space-y-4">
            {[
              { label: 'Tax Year', field: 'taxYear', type: 'select', options: ['2024', '2025'] },
              { label: 'Filing Status', field: 'filingStatus', type: 'select', options: ['single', 'marriedJoint', 'marriedSeparate', 'headHousehold'], optionLabels: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'] },
              { label: 'State', field: 'state', type: 'select', options: ['none', 'CA', 'NY', 'TX'], optionLabels: ['No State Tax', 'California', 'New York', 'Texas'] },
              { label: 'Salary/Wages (Annual)', field: 'salary', type: 'number', min: '0', step: '100' },
              { label: '', field: 'salary', type: 'range', min: '0', max: '500000', step: '100', value: salaryRange, onChange: syncSlider },
              { label: 'Business/Self-Employment Income', field: 'businessIncome', type: 'number', min: '0' },
              { label: 'Investment Income (Dividends, Capital Gains)', field: 'investmentIncome', type: 'number', min: '0' },
              { label: 'Other Income (Rental, Freelance)', field: 'otherIncome', type: 'number', min: '0' },
            ].map(item => (
              <div key={item.label} className={item.label ? 'space-y-2' : ''}>
                {item.label && <label className="block text-sm font-bold text-gray-700">{item.label}</label>}
                {item.type === 'select' ? (
                  <select value={formData[item.field]} onChange={(e) => updateFormData(item.field, e.target.value)} className="w-full p-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-red-500">
                    {(item.options || []).map((opt, i) => <option key={opt} value={opt}>{item.optionLabels ? item.optionLabels[i] : opt}</option>)}
                  </select>
                ) : (
                  <input type={item.type} value={item.value ?? formData[item.field]} onChange={(e) => (item.onChange || updateFormData)(item.field, e.target.value)} min={item.min} max={item.max} step={item.step} className="w-full p-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-red-500" />
                )}
              </div>
            ))}
            <div className="bg-red-500 text-white p-3 rounded-lg text-center cursor-pointer" onClick={() => toggleSection('deductions')}>Deductions</div>
            {activeSections.deductions && (
              <div className="space-y-4">
                {[
                  { label: 'Deduction Type', field: 'deductionType', type: 'select', options: ['standard', 'itemized'], optionLabels: ['Standard Deduction', 'Itemized Deductions'] },
                  { label: 'Mortgage Interest', field: 'mortgageInterest', type: 'number', min: '0', className: formData.deductionType === 'itemized' ? '' : 'hidden', itemized: true },
                  { label: 'Charitable Contributions', field: 'charity', type: 'number', min: '0', className: formData.deductionType === 'itemized' ? '' : 'hidden', itemized: true },
                  { label: 'Medical Expenses', field: 'medical', type: 'number', min: '0', className: formData.deductionType === 'itemized' ? '' : 'hidden', itemized: true },
                  { label: 'State/Local Taxes', field: 'stateLocalTax', type: 'number', min: '0', className: formData.deductionType === 'itemized' ? '' : 'hidden', itemized: true },
                  { label: 'Business Expenses (Self-Employed)', field: 'businessExpenses', type: 'number', min: '0' },
                ].map(item => (
                  <div key={item.label} className={`space-y-2 ${item.className || ''}`}>
                    <label className="block text-sm font-bold text-gray-700">{item.label}</label>
                    {item.type === 'select' ? (
                      <select value={formData[item.field]} onChange={(e) => updateFormData(item.field, e.target.value)} className="w-full p-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-red-500">
                        {item.options.map((opt, i) => <option key={opt} value={opt}>{item.optionLabels[i]}</option>)}
                      </select>
                    ) : (
                      <input type={item.type} value={formData[item.field]} onChange={(e) => updateFormData(item.field, e.target.value)} min={item.min} className="w-full p-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-red-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="bg-red-500 text-white p-3 rounded-lg text-center cursor-pointer" onClick={() => toggleSection('credits')}>Tax Credits</div>
            {activeSections.credits && (
              <div className="space-y-4">
                {[
                  { label: 'Number of Dependents (Children under 17)', field: 'dependents', type: 'number', min: '0' },
                  { label: 'Earned Income Tax Credit (EITC) Eligible Income', field: 'eitc', type: 'number', min: '0' },
                  { label: 'Education Credits', field: 'educationCredit', type: 'number', min: '0' },
                  { label: 'Energy Credits', field: 'energyCredit', type: 'number', min: '0' },
                ].map(item => (
                  <div key={item.label} className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">{item.label}</label>
                    <input type={item.type} value={formData[item.field]} onChange={(e) => updateFormData(item.field, e.target.value)} min={item.min} className="w-full p-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-red-500" />
                  </div>
                ))}
              </div>
            )}
            <div className="bg-red-500 text-white p-3 rounded-lg text-center cursor-pointer" onClick={() => toggleSection('withholding')}>Withholding & Financial Details</div>
            {activeSections.withholding && (
              <div className="space-y-4">
                {[
                  { label: 'Federal Taxes Withheld', field: 'federalWithholding', type: 'number', min: '0' },
                  { label: 'State Taxes Withheld', field: 'stateWithholding', type: 'number', min: '0' },
                  { label: 'Annual Expenses', field: 'annualExpenses', type: 'number', min: '0' },
                  { label: 'Savings Rate (%)', field: 'savingsRate', type: 'number', min: '0', max: '100' },
                  { label: 'Debt-to-Income Ratio (%)', field: 'dti', type: 'number', min: '0', max: '100' },
                  { label: 'Currency', field: 'currency', type: 'select', options: ['USD', 'EUR', 'INR'], optionLabels: ['$ USD', '€ EUR', '₹ INR'] },
                ].map(item => (
                  <div key={item.label} className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">{item.label}</label>
                    {item.type === 'select' ? (
                      <select value={formData[item.field]} onChange={(e) => updateFormData(item.field, e.target.value)} className="w-full p-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-red-500">
                        {item.options.map((opt, i) => <option key={opt} value={opt}>{item.optionLabels[i]}</option>)}
                      </select>
                    ) : (
                      <input type={item.type} value={formData[item.field]} onChange={(e) => updateFormData(item.field, e.target.value)} min={item.min} max={item.max} className="w-full p-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-red-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <button onClick={calculateTax} className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-transform hover:scale-105">Calculate Tax</button>
            {results && (
              <>
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden mt-4">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Metric</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.summaryMetrics.map((metric) => (
                      <tr key={metric.label} className="border-b border-gray-300">
                        <td className="p-2 text-gray-700">{metric.label}</td>
                        <td className="p-2 text-gray-700">{metric.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden mt-4 max-h-80 overflow-y-auto block">
                  <thead>
                    <tr className="bg-gray-200 sticky top-0">
                      <th className="p-2 cursor-pointer" onClick={() => sortTable(0, true)}>Category</th>
                      <th className="p-2 cursor-pointer" onClick={() => sortTable(1, true)}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.detailedItems.map((item) => (
                      <tr key={item.category} className="border-b border-gray-300">
                        <td className="p-2 text-gray-700">{item.category}</td>
                        <td className="p-2 text-gray-700">{formatCurrency(item.amount, formData.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <canvas ref={canvasRef} width="580" height="200" className="mt-4 border-2 border-gray-300 rounded-lg shadow-md" />
                <div className="mt-4 text-center">
                  <a onClick={exportCSV} className="text-red-500 hover:underline cursor-pointer">Download Tax Breakdown</a>
                  {results.tips.length > 0 && (
                    <div className="mt-4">
                      <strong className="text-gray-700">Tax Planning Tips:</strong>
                      <ul className="list-disc list-inside text-gray-700">
                        {results.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
            {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
          </div>
        </div>
      </div>
      <style jsx>{`
        input:focus, select:focus { outline: none; }
        .transition-transform { transition: transform 0.3s ease; }
        .hover\\:scale-105:hover { transform: scale(1.05); }
        .max-h-80 { max-height: 20rem; }
        .sticky { position: sticky; }
      `}</style>
    </>
  );
}