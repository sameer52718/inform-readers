"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [incomeDetails, setIncomeDetails] = useState({
    incomeType: "salary",
    income: "",
    payFrequency: "weekly",
    hoursPerWeek: "40",
    weeksPerYear: "52",
  });
  const [taxDetails, setTaxDetails] = useState({
    federalTax: "22",
    stateTax: "5",
    _401k: "0",
    healthInsurance: "0",
  });
  const [deductions, setDeductions] = useState([{ id: 1, name: "", amount: "" }]);
  const [results, setResults] = useState(null);
  const deductionsChartRef = useRef(null);
  let deductionsChart;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = JSON.parse(localStorage.getItem("paycheckCalculation"));
      if (savedData) {
        setIncomeDetails({
          incomeType: savedData.incomeType,
          income: savedData.income,
          payFrequency: savedData.payFrequency,
          hoursPerWeek: savedData.hoursPerWeek,
          weeksPerYear: savedData.weeksPerYear,
        });
        setTaxDetails({
          federalTax: savedData.federalTax,
          stateTax: savedData.stateTax,
          _401k: savedData._401k,
          healthInsurance: savedData.healthInsurance,
        });
        setDeductions(savedData.deductions.map((d, i) => ({ id: i + 1, name: d.name, amount: d.amount })));
      }
    }

    if (deductionsChartRef.current) {
      deductionsChart = new Chart(deductionsChartRef.current, {
        type: "doughnut",
        data: {
          labels: [],
          datasets: [
            { data: [], backgroundColor: ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"] },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Deductions Breakdown" } },
        },
      });
    }
    return () => {
      deductionsChart?.destroy();
    };
  }, []);

  const updateIncomeDetail = (field, value) => {
    setIncomeDetails((prev) => ({ ...prev, [field]: value }));
  };

  const updateTaxDetail = (field, value) => {
    setTaxDetails((prev) => ({ ...prev, [field]: value }));
  };

  const addDeduction = () => {
    setDeductions([...deductions, { id: deductions.length + 1, name: "", amount: "" }]);
  };

  const removeDeduction = (id) => {
    if (deductions.length > 1) {
      setDeductions(deductions.filter((d) => d.id !== id));
    }
  };

  const updateDeduction = (id, field, value) => {
    setDeductions(deductions.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const calculatePaycheck = () => {
    let income = parseFloat(incomeDetails.income) || 0;
    const { incomeType, payFrequency, hoursPerWeek, weeksPerYear } = incomeDetails;
    const federalTaxRate = parseFloat(taxDetails.federalTax) / 100 || 0;
    const stateTaxRate = parseFloat(taxDetails.stateTax) / 100 || 0;
    const _401kRate = parseFloat(taxDetails._401k) / 100 || 0;
    const healthInsurance = parseFloat(taxDetails.healthInsurance) || 0;

    if (incomeType === "hourly") {
      income = income * (parseFloat(hoursPerWeek) || 40) * (parseFloat(weeksPerYear) || 52);
    }

    let annualIncome = income;
    if (payFrequency === "weekly") annualIncome = income * 52;
    else if (payFrequency === "biweekly") annualIncome = income * 26;
    else if (payFrequency === "monthly") annualIncome = income * 12;

    let grossPay;
    if (payFrequency === "weekly") grossPay = annualIncome / 52;
    else if (payFrequency === "biweekly") grossPay = annualIncome / 26;
    else if (payFrequency === "monthly") grossPay = annualIncome / 12;
    else grossPay = annualIncome;

    const validDeductions = deductions.map((d) => ({
      name: d.name || "Unnamed Deduction",
      amount: parseFloat(d.amount) || 0,
    }));

    const federalTax = grossPay * federalTaxRate;
    const stateTax = grossPay * stateTaxRate;
    const _401k = grossPay * _401kRate;
    const totalCustomDeductions = validDeductions.reduce((sum, d) => sum + d.amount, 0);
    const totalDeductions = federalTax + stateTax + _401k + healthInsurance + totalCustomDeductions;
    const takeHomePay = grossPay - totalDeductions;

    const savingsRate = (takeHomePay / grossPay) * 100;
    let financialTips = "";
    if (savingsRate > 70) {
      financialTips = "Great job! Your take-home pay is strong. Consider increasing savings or investments.";
    } else if (savingsRate > 50) {
      financialTips = "Your take-home pay is solid. Review deductions to optimize savings.";
    } else {
      financialTips = "Your take-home pay is low. Consider reducing deductions or increasing income.";
    }

    setResults({
      grossPay,
      takeHomePay,
      financialTips,
      deductions: validDeductions,
      federalTax,
      stateTax,
      _401k,
      healthInsurance,
    });

    if (deductionsChart) {
      deductionsChart.data.labels = [
        "Federal Tax",
        "State Tax",
        "401k",
        "Health Insurance",
        ...validDeductions.map((d) => d.name),
      ];
      deductionsChart.data.datasets[0].data = [
        federalTax,
        stateTax,
        _401k,
        healthInsurance,
        ...validDeductions.map((d) => d.amount),
      ];
      deductionsChart.update();
    }
  };

  const saveCalculation = () => {
    const data = {
      incomeType: incomeDetails.incomeType,
      income: incomeDetails.income,
      payFrequency: incomeDetails.payFrequency,
      hoursPerWeek: incomeDetails.hoursPerWeek,
      weeksPerYear: incomeDetails.weeksPerYear,
      federalTax: taxDetails.federalTax,
      stateTax: taxDetails.stateTax,
      _401k: taxDetails._401k,
      healthInsurance: taxDetails.healthInsurance,
      deductions: deductions.map((d) => ({ name: d.name, amount: d.amount })),
    };
    localStorage.setItem("paycheckCalculation", JSON.stringify(data));
    alert("Calculation saved!");
  };

  const loadCalculation = () => {
    const saved = JSON.parse(localStorage.getItem("paycheckCalculation"));
    if (saved) {
      setIncomeDetails({
        incomeType: saved.incomeType,
        income: saved.income,
        payFrequency: saved.payFrequency,
        hoursPerWeek: saved.hoursPerWeek,
        weeksPerYear: saved.weeksPerYear,
      });
      setTaxDetails({
        federalTax: saved.federalTax,
        stateTax: saved.stateTax,
        _401k: saved._401k,
        healthInsurance: saved.healthInsurance,
      });
      setDeductions(saved.deductions.map((d, i) => ({ id: i + 1, name: d.name, amount: d.amount })));
      calculatePaycheck();
    } else {
      alert("No saved calculation found.");
    }
  };

  const exportResults = () => {
    if (!results) return;
    const { grossPay, takeHomePay, financialTips, deductions, federalTax, stateTax, _401k, healthInsurance } =
      results;
    const exportContent = `
Take-Home Paycheck Results
=========================
Gross Pay: $${grossPay.toFixed(2)}
Take-Home Pay: $${takeHomePay.toFixed(2)}

Deductions:
- Federal Tax: ${federalTax.toFixed(2)}%
- State Tax: ${stateTax.toFixed(2)}%
- 401k: ${_401k.toFixed(2)}%
- Health Insurance: $${healthInsurance.toFixed(2)}
${deductions.map((d) => `- ${d.name}: $${d.amount.toFixed(2)}`).join("\n")}

Financial Tips: ${financialTips}
=========================
Generated on: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paycheck_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!results) return;
    const { grossPay, takeHomePay, financialTips, deductions, federalTax, stateTax, _401k, healthInsurance } =
      results;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Take-Home Paycheck Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text("Results:", 20, 40);
    doc.text(`Gross Pay: $${grossPay.toFixed(2)}`, 20, 50);
    doc.text(`Take-Home Pay: $${takeHomePay.toFixed(2)}`, 20, 60);
    doc.text("Deductions:", 20, 70);
    let y = 80;
    doc.text(`Federal Tax: ${federalTax.toFixed(2)}%`, 20, y);
    y += 10;
    doc.text(`State Tax: ${stateTax.toFixed(2)}%`, 20, y);
    y += 10;
    doc.text(`401k: ${_401k.toFixed(2)}%`, 20, y);
    y += 10;
    doc.text(`Health Insurance: $${healthInsurance.toFixed(2)}`, 20, y);
    y += 10;
    deductions.forEach((d) => {
      doc.text(`${d.name}: $${d.amount.toFixed(2)}`, 20, y);
      y += 10;
    });
    doc.text("Financial Tips:", 20, y);
    doc.text(financialTips, 20, y + 10, { maxWidth: 160 });
    doc.save("paycheck_report.pdf");
  };

  const incomeFields = [
    {
      id: "incomeType",
      label: "Income Type",
      type: "select",
      options: [
        { value: "salary", label: "Salaried" },
        { value: "hourly", label: "Hourly" },
        { value: "contract", label: "Contract" },
      ],
    },
    { id: "income", label: "Gross Income", type: "number", placeholder: "Enter amount" },
    {
      id: "payFrequency",
      label: "Pay Frequency",
      type: "select",
      options: [
        { value: "weekly", label: "Weekly" },
        { value: "biweekly", label: "Bi-weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "annually", label: "Annually" },
      ],
    },
  ];

  const hourlyFields = [
    { id: "hoursPerWeek", label: "Hours per Week", type: "number", placeholder: "e.g., 40" },
    { id: "weeksPerYear", label: "Weeks per Year", type: "number", placeholder: "e.g., 52" },
  ];

  const taxFields = [
    {
      id: "federalTax",
      label: "Federal Tax Rate (%)",
      type: "number",
      placeholder: "e.g., 22",
      defaultValue: "22",
    },
    {
      id: "stateTax",
      label: "State Tax Rate (%)",
      type: "number",
      placeholder: "e.g., 5",
      defaultValue: "5",
    },
    { id: "401k", label: "401k Contribution (%)", type: "number", placeholder: "e.g., 5", defaultValue: "0" },
    {
      id: "healthInsurance",
      label: "Health Insurance ($)",
      type: "number",
      placeholder: "e.g., 200",
      defaultValue: "0",
    },
  ];

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Take-Home Paycheck Calculator</h1>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Income Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {incomeFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      value={incomeDetails[field.id]}
                      onChange={(e) => updateIncomeDetail(field.id, e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={incomeDetails[field.id]}
                      onChange={(e) => updateIncomeDetail(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  )}
                </div>
              ))}
            </div>
            {incomeDetails.incomeType === "hourly" && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                {hourlyFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-600 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      value={incomeDetails[field.id]}
                      onChange={(e) => updateIncomeDetail(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Taxes & Deductions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {taxFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    value={taxDetails[field.id]}
                    onChange={(e) => updateTaxDetail(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              ))}
            </div>
            <div id="custom-deductions" className="mt-4 space-y-4">
              {deductions.map((d) => (
                <div
                  key={d.id}
                  className="deduction-input grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn"
                >
                  <input
                    type="text"
                    value={d.name}
                    onChange={(e) => updateDeduction(d.id, "name", e.target.value)}
                    placeholder="Deduction Name"
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    value={d.amount}
                    onChange={(e) => updateDeduction(d.id, "amount", e.target.value)}
                    placeholder="Amount"
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  <button
                    onClick={() => removeDeduction(d.id)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addDeduction}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Add Deduction
            </button>
          </div>
          <div className="flex gap-4 mb-8">
            <button
              onClick={calculatePaycheck}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate Paycheck
            </button>
            <button
              onClick={saveCalculation}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Save Calculation
            </button>
            <button
              onClick={loadCalculation}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Load Saved
            </button>
          </div>
          {results && (
            <div id="results">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Gross Pay</h3>
                  <p className="text-2xl font-bold text-gray-800">${results.grossPay.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Take-Home Pay</h3>
                  <p className="text-2xl font-bold text-gray-800">${results.takeHomePay.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Deductions Breakdown</h3>
                <canvas ref={deductionsChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Tips</h3>
                <p className="text-gray-600">{results.financialTips}</p>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={exportPDF}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                >
                  Export as PDF
                </button>
                <button
                  onClick={exportResults}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                >
                  Export as Text
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @media (max-width: 768px) {
          .grid-cols-3 {
            grid-template-columns: 1fr;
          }
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
