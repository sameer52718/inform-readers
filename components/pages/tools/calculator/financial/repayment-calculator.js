"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [formData, setFormData] = useState({
    loanType: "mortgage",
    loanAmount: "",
    interestRate: "",
    loanTerm: "",
    paymentFrequency: "monthly",
    extraPayment: "",
    prepaymentPenalty: "",
    refinancing: "none",
    refinanceRate: "",
    refinanceTerm: "",
    refinanceFee: "",
    refinanceMonth: "",
    currency: "USD",
  });
  const [results, setResults] = useState(null);
  const [amortizationData, setAmortizationData] = useState([]);
  const [history, setHistory] = useState([]);
  const balanceChartRef = useRef(null);
  const breakdownChartRef = useRef(null);
  let balanceChart, breakdownChart;

  useEffect(() => {
    if (balanceChartRef.current) {
      balanceChart = new Chart(balanceChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [{ label: "Loan Balance", data: [], borderColor: "#3498db", fill: false, tension: 0.1 }],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Balance" } },
            x: { title: { display: true, text: "Period" } },
          },
          plugins: { title: { display: true, text: "Loan Balance Over Time" } },
        },
      });
    }
    if (breakdownChartRef.current) {
      breakdownChart = new Chart(breakdownChartRef.current, {
        type: "pie",
        data: {
          labels: ["Principal", "Interest", "Fees"],
          datasets: [
            {
              data: [0, 0, 0],
              backgroundColor: ["#3498db", "#e74c3c", "#f1c40f"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Loan Payment Breakdown" } },
        },
      });
    }
    return () => {
      balanceChart?.destroy();
      breakdownChart?.destroy();
    };
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  const calculateRepayment = () => {
    const inputs = {
      loanType: formData.loanType,
      loanAmount: parseFloat(formData.loanAmount) || 0,
      interestRate: parseFloat(formData.interestRate) / 100 || 0,
      loanTerm: parseInt(formData.loanTerm) || 0,
      paymentFrequency: formData.paymentFrequency,
      extraPayment: parseFloat(formData.extraPayment) || 0,
      prepaymentPenaltyRate: parseFloat(formData.prepaymentPenalty) / 100 || 0,
      refinancing: formData.refinancing,
      refinanceRate: parseFloat(formData.refinanceRate) / 100 || 0,
      refinanceTerm: parseInt(formData.refinanceTerm) || 0,
      refinanceFee: parseFloat(formData.refinanceFee) || 0,
      refinanceMonth: parseInt(formData.refinanceMonth) || 0,
      currency: formData.currency,
    };

    // Validation
    if (inputs.loanAmount <= 0) {
      alert("Please enter a valid loan amount");
      return;
    }
    if (inputs.interestRate < 0) {
      alert("Please enter a valid interest rate");
      return;
    }
    if (inputs.loanTerm <= 0) {
      alert("Please enter a valid loan term");
      return;
    }
    if (
      inputs.refinancing === "apply" &&
      (isNaN(inputs.refinanceRate) ||
        isNaN(inputs.refinanceTerm) ||
        isNaN(inputs.refinanceFee) ||
        inputs.refinanceMonth <= 0)
    ) {
      alert("Please enter valid refinancing details");
      return;
    }

    const periodsPerYear = { monthly: 12, "bi-weekly": 26, weekly: 52 }[inputs.paymentFrequency];
    const periodRate = inputs.interestRate / periodsPerYear;
    const totalPeriods = inputs.loanTerm * periodsPerYear;
    const monthlyRate = inputs.interestRate / 12;

    let balance = inputs.loanAmount;
    let totalInterest = 0;
    let totalPayments = 0;
    let totalFees = inputs.refinanceFee;
    let prepaymentPenalty = 0;
    let periods = [];
    let balances = [balance];
    let periodCount = 0;
    const newAmortizationData = [];

    // Calculate standard payment
    let periodPayment = balance * (periodRate / (1 - Math.pow(1 + periodRate, -totalPeriods)));
    let monthlyPayment = periodPayment * (periodsPerYear / 12);

    if (inputs.refinancing === "apply" && inputs.refinanceMonth * (12 / periodsPerYear) <= totalPeriods) {
      // Pre-refinancing phase
      for (let period = 1; period < inputs.refinanceMonth * (12 / periodsPerYear) && balance > 0; period++) {
        periodCount++;
        let interest = balance * periodRate;
        let principal = periodPayment - interest + inputs.extraPayment * (periodsPerYear / 12);
        if (principal > balance) {
          principal = balance;
          prepaymentPenalty += balance * inputs.prepaymentPenaltyRate;
        }
        balance -= principal;
        totalInterest += interest;
        totalPayments += periodPayment + inputs.extraPayment * (periodsPerYear / 12);
        newAmortizationData.push({
          period: periodCount,
          payment: periodPayment + inputs.extraPayment * (periodsPerYear / 12),
          interest,
          principal,
          balance,
        });
        periods.push(periodCount);
        balances.push(balance);
        if (balance <= 0) break;
      }

      // Refinancing phase
      balance += inputs.refinanceFee;
      totalFees += inputs.refinanceFee;
      const newPeriodRate = inputs.refinanceRate / periodsPerYear;
      const newTotalPeriods = inputs.refinanceTerm * periodsPerYear;
      periodPayment = balance * (newPeriodRate / (1 - Math.pow(1 + newPeriodRate, -newTotalPeriods)));
      monthlyPayment = periodPayment * (periodsPerYear / 12);

      while (balance > 0 && periodCount < 1200) {
        periodCount++;
        let interest = balance * newPeriodRate;
        let principal = periodPayment - interest + inputs.extraPayment * (periodsPerYear / 12);
        if (principal > balance) {
          principal = balance;
          prepaymentPenalty += balance * inputs.prepaymentPenaltyRate;
        }
        balance -= principal;
        totalInterest += interest;
        totalPayments += periodPayment + inputs.extraPayment * (periodsPerYear / 12);
        newAmortizationData.push({
          period: periodCount,
          payment: periodPayment + inputs.extraPayment * (periodsPerYear / 12),
          interest,
          principal,
          balance,
        });
        periods.push(periodCount);
        balances.push(balance);
        if (balance <= 0) break;
      }
    } else {
      // Standard repayment
      while (balance > 0 && periodCount < 1200) {
        periodCount++;
        let interest = balance * periodRate;
        let principal = periodPayment - interest + inputs.extraPayment * (periodsPerYear / 12);
        if (principal > balance) {
          principal = balance;
          prepaymentPenalty += balance * inputs.prepaymentPenaltyRate;
        }
        balance -= principal;
        totalInterest += interest;
        totalPayments += periodPayment + inputs.extraPayment * (periodsPerYear / 12);
        newAmortizationData.push({
          period: periodCount,
          payment: periodPayment + inputs.extraPayment * (periodsPerYear / 12),
          interest,
          principal,
          balance,
        });
        periods.push(periodCount);
        balances.push(balance);
        if (balance <= 0) break;
      }
    }

    if (periodCount >= 1200) {
      alert("Repayment takes too long; check inputs or increase payments");
      return;
    }

    const totalCost = totalPayments + prepaymentPenalty + totalFees;

    setResults({
      loanAmount: formatCurrency(inputs.loanAmount, inputs.currency),
      totalInterest: formatCurrency(totalInterest, inputs.currency),
      totalPayments: formatCurrency(totalPayments, inputs.currency),
      payoffTime: `${periodCount} periods (${(periodCount / periodsPerYear).toFixed(1)} years)`,
      monthlyPayment: formatCurrency(monthlyPayment + inputs.extraPayment, inputs.currency),
      prepaymentPenalty: formatCurrency(prepaymentPenalty, inputs.currency),
      refinanceFee: formatCurrency(inputs.refinanceFee, inputs.currency),
      totalCost: formatCurrency(totalCost, inputs.currency),
    });

    setAmortizationData(newAmortizationData);
    const newHistory = [
      ...history,
      {
        timestamp: new Date().toLocaleString(),
        loanType: inputs.loanType,
        loanAmount: formatCurrency(inputs.loanAmount, inputs.currency),
        totalInterest: formatCurrency(totalInterest, inputs.currency),
        totalPayments: formatCurrency(totalPayments, inputs.currency),
        payoffTime: `${periodCount} periods`,
        monthlyPayment: formatCurrency(monthlyPayment + inputs.extraPayment, inputs.currency),
        prepaymentPenalty: formatCurrency(prepaymentPenalty, inputs.currency),
        refinanceFee: formatCurrency(inputs.refinanceFee, inputs.currency),
        totalCost: formatCurrency(totalCost, inputs.currency),
        inputs: {
          interestRate: `${(inputs.interestRate * 100).toFixed(2)}%`,
          loanTerm: `${inputs.loanTerm} years`,
          paymentFrequency: inputs.paymentFrequency,
          extraPayment: formatCurrency(inputs.extraPayment, inputs.currency),
          prepaymentPenaltyRate: `${(inputs.prepaymentPenaltyRate * 100).toFixed(2)}%`,
          refinancing:
            inputs.refinancing === "apply"
              ? {
                  refinanceRate: `${(inputs.refinanceRate * 100).toFixed(2)}%`,
                  refinanceTerm: `${inputs.refinanceTerm} years`,
                  refinanceFee: formatCurrency(inputs.refinanceFee, inputs.currency),
                  refinanceMonth: `${inputs.refinanceMonth} months`,
                }
              : "None",
        },
      },
    ];
    setHistory(newHistory);

    balanceChart.data.labels = periods;
    balanceChart.data.datasets[0].data = balances;
    balanceChart.update();
    breakdownChart.data.datasets[0].data = [inputs.loanAmount, totalInterest, prepaymentPenalty + totalFees];
    breakdownChart.update();
  };

  const compareScenarios = () => {
    const inputs = {
      loanAmount: parseFloat(formData.loanAmount) || 0,
      interestRate: parseFloat(formData.interestRate) / 100 || 0,
      loanTerm: parseInt(formData.loanTerm) || 0,
      paymentFrequency: formData.paymentFrequency,
      extraPayment: parseFloat(formData.extraPayment) || 0,
      prepaymentPenaltyRate: parseFloat(formData.prepaymentPenalty) / 100 || 0,
      currency: formData.currency,
    };

    if (inputs.loanAmount <= 0 || inputs.interestRate < 0 || inputs.loanTerm <= 0) {
      alert("Please enter valid loan details");
      return;
    }

    const periodsPerYear = { monthly: 12, "bi-weekly": 26, weekly: 52 }[inputs.paymentFrequency];
    const periodRate = inputs.interestRate / periodsPerYear;
    const totalPeriods = inputs.loanTerm * periodsPerYear;

    const scenarios = [
      { label: "Standard Payment", extraPayment: 0 },
      {
        label: `Extra Payment (${formatCurrency(inputs.extraPayment, inputs.currency)})`,
        extraPayment: inputs.extraPayment,
      },
      { label: "Higher Interest (+1%)", extraPayment: 0, interestRate: inputs.interestRate + 0.01 },
      { label: "Shorter Term (-5 Years)", extraPayment: 0, loanTerm: Math.max(1, inputs.loanTerm - 5) },
    ];

    const comparisonData = scenarios.map((scenario) => {
      let balance = inputs.loanAmount;
      let totalInterest = 0;
      let totalPayments = 0;
      let periodCount = 0;
      const scenarioPeriodRate = (scenario.interestRate || inputs.interestRate) / periodsPerYear;
      const scenarioTotalPeriods = (scenario.loanTerm || inputs.loanTerm) * periodsPerYear;
      let periodPayment =
        balance * (scenarioPeriodRate / (1 - Math.pow(1 + scenarioPeriodRate, -scenarioTotalPeriods)));

      while (balance > 0 && periodCount < 1200) {
        periodCount++;
        let interest = balance * scenarioPeriodRate;
        let principal = periodPayment - interest + scenario.extraPayment * (periodsPerYear / 12);
        if (principal > balance) principal = balance;
        balance -= principal;
        totalInterest += interest;
        totalPayments += periodPayment + scenario.extraPayment * (periodsPerYear / 12);
        if (balance <= 0) break;
      }

      const totalCost = totalPayments + inputs.prepaymentPenaltyRate * balance;
      return { label: scenario.label, totalInterest, payoffTime: periodCount, totalCost };
    });

    return comparisonData;
  };

  const exportAmortization = () => {
    if (amortizationData.length === 0) {
      alert("No amortization data to export");
      return;
    }

    const csvContent = [
      "Period,Payment,Interest,Principal,Balance",
      ...amortizationData.map(
        (item) =>
          `${item.period},${item.payment.toFixed(2)},${item.interest.toFixed(2)},${item.principal.toFixed(
            2
          )},${item.balance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loan_amortization.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const inputFields = [
    {
      id: "loanType",
      label: "Loan Type",
      type: "select",
      options: ["mortgage", "auto", "personal", "student", "other"],
    },
    {
      id: "loanAmount",
      label: "Loan Amount",
      type: "number",
      step: "1000",
      placeholder: "Enter loan amount",
    },
    {
      id: "interestRate",
      label: "Annual Interest Rate (%)",
      type: "number",
      step: "0.01",
      placeholder: "Enter interest rate",
    },
    { id: "loanTerm", label: "Loan Term (Years)", type: "number", step: "1", placeholder: "Enter loan term" },
    {
      id: "paymentFrequency",
      label: "Payment Frequency",
      type: "select",
      options: ["monthly", "bi-weekly", "weekly"],
    },
    {
      id: "extraPayment",
      label: "Extra Monthly Payment",
      type: "number",
      step: "100",
      placeholder: "Enter extra payment",
    },
    {
      id: "prepaymentPenalty",
      label: "Prepayment Penalty (% of Remaining Balance)",
      type: "number",
      step: "0.01",
      placeholder: "Enter penalty percentage",
    },
    { id: "refinancing", label: "Refinancing Option", type: "select", options: ["none", "apply"] },
    { id: "currency", label: "Currency", type: "select", options: ["USD", "CAD", "EUR", "GBP"] },
  ];

  const refinanceFields = [
    {
      id: "refinanceRate",
      label: "New Interest Rate (%)",
      type: "number",
      step: "0.01",
      placeholder: "Enter new interest rate",
    },
    {
      id: "refinanceTerm",
      label: "New Loan Term (Years)",
      type: "number",
      step: "1",
      placeholder: "Enter new term",
    },
    {
      id: "refinanceFee",
      label: "Refinancing Fee",
      type: "number",
      step: "100",
      placeholder: "Enter refinancing fee",
    },
    {
      id: "refinanceMonth",
      label: "Month to Refinance",
      type: "number",
      step: "1",
      placeholder: "Enter month number",
    },
  ];

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-5">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full flex gap-8 max-md:flex-col">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
              Advanced Repayment Calculator
            </h1>
            {inputFields.map((field) => (
              <div key={field.id} className="mb-5">
                <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    value={formData[field.id]}
                    onChange={(e) => updateFormData(field.id, e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 focus:border-red-500 focus:ring-red-200"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "USD"
                          ? "$ USD"
                          : opt === "CAD"
                          ? "$ CAD"
                          : opt === "EUR"
                          ? "€ EUR"
                          : opt === "GBP"
                          ? "£ GBP"
                          : opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.id]}
                    onChange={(e) => updateFormData(field.id, e.target.value)}
                    step={field.step}
                    placeholder={field.placeholder}
                    className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 focus:border-red-500 focus:ring-red-200"
                  />
                )}
              </div>
            ))}
            {formData.refinancing === "apply" && (
              <div className="mb-5">
                {refinanceFields.map((field) => (
                  <div key={field.id} className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={formData[field.id]}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      step={field.step}
                      placeholder={field.placeholder}
                      className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 focus:border-red-500 focus:ring-red-200"
                    />
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={calculateRepayment}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-transform hover:-translate-y-0.5"
            >
              Calculate Repayment
            </button>
            {results && (
              <div className="bg-gray-50 p-5 rounded-lg mt-5">
                {Object.entries(results).map(([key, value]) => (
                  <p key={key} className="text-gray-800 my-2">
                    <strong>
                      {key === "loanAmount"
                        ? "Loan Amount"
                        : key === "totalInterest"
                        ? "Total Interest Paid"
                        : key === "totalPayments"
                        ? "Total Payments"
                        : key === "payoffTime"
                        ? "Payoff Time"
                        : key === "monthlyPayment"
                        ? "Monthly Payment"
                        : key === "prepaymentPenalty"
                        ? "Prepayment Penalty"
                        : key === "refinanceFee"
                        ? "Refinancing Fee"
                        : "Total Cost"}
                      :
                    </strong>{" "}
                    {value}
                  </p>
                ))}
              </div>
            )}
            <div className="mt-5">
              <canvas ref={balanceChartRef} />
            </div>
          </div>
          <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-50 rounded-lg max-md:max-h-[500px]">
            <h1 className="text-2xl font-semibold text-gray-800 mb-5 text-center">Amortization & History</h1>
            {amortizationData.length > 0 && (
              <table className="w-full text-sm text-gray-600 mb-5">
                <thead>
                  <tr className="bg-[#3498db] text-white">
                    <th className="p-3 text-right">Period</th>
                    <th className="p-3 text-right">Payment</th>
                    <th className="p-3 text-right">Interest</th>
                    <th className="p-3 text-right">Principal</th>
                    <th className="p-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizationData.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 text-right">{item.period}</td>
                      <td className="p-3 text-right">{formatCurrency(item.payment, formData.currency)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.interest, formData.currency)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.principal, formData.currency)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.balance, formData.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div>
              {history.map((item, i) => (
                <div key={i} className="bg-white p-4 mb-3 rounded-lg shadow-sm">
                  <p className="text-gray-800">
                    <strong>Date:</strong> {item.timestamp}
                  </p>
                  <p className="text-gray-800">
                    <strong>Loan Type:</strong> {item.loanType}
                  </p>
                  <p className="text-gray-800">
                    <strong>Loan Amount:</strong> {item.loanAmount}
                  </p>
                  <p className="text-gray-800">
                    <strong>Total Interest:</strong> {item.totalInterest}
                  </p>
                  <p className="text-gray-800">
                    <strong>Total Payments:</strong> {item.totalPayments}
                  </p>
                  <p className="text-gray-800">
                    <strong>Payoff Time:</strong> {item.payoffTime}
                  </p>
                  <p className="text-gray-800">
                    <strong>Monthly Payment:</strong> {item.monthlyPayment}
                  </p>
                  <p className="text-gray-800">
                    <strong>Prepayment Penalty:</strong> {item.prepaymentPenalty}
                  </p>
                  <p className="text-gray-800">
                    <strong>Refinancing Fee:</strong> {item.refinanceFee}
                  </p>
                  <p className="text-gray-800">
                    <strong>Total Cost:</strong> {item.totalCost}
                  </p>
                  <p className="text-gray-800">
                    <strong>Inputs:</strong>
                  </p>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Interest Rate: {item.inputs.interestRate}</li>
                    <li>Loan Term: {item.inputs.loanTerm}</li>
                    <li>Payment Frequency: {item.inputs.paymentFrequency}</li>
                    <li>Extra Payment: {item.inputs.extraPayment}</li>
                    <li>Prepayment Penalty Rate: {item.inputs.prepaymentPenaltyRate}</li>
                    <li>
                      Refinancing:{" "}
                      {typeof item.inputs.refinancing === "string"
                        ? item.inputs.refinancing
                        : `Rate: ${item.inputs.refinancing.refinanceRate}, Term: ${item.inputs.refinancing.refinanceTerm}, Fee: ${item.inputs.refinancing.refinanceFee}, Month: ${item.inputs.refinancing.refinanceMonth}`}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
            {compareScenarios().length > 0 && (
              <table className="w-full text-sm text-gray-600 mb-5">
                <thead>
                  <tr className="bg-[#3498db] text-white">
                    <th className="p-3 text-right">Scenario</th>
                    <th className="p-3 text-right">Total Interest</th>
                    <th className="p-3 text-right">Payoff Time</th>
                    <th className="p-3 text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {compareScenarios().map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 text-right">{item.label}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(item.totalInterest, formData.currency)}
                      </td>
                      <td className="p-3 text-right">{item.payoffTime} periods</td>
                      <td className="p-3 text-right">{formatCurrency(item.totalCost, formData.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-5">
              <canvas ref={breakdownChartRef} />
            </div>
            <button
              onClick={exportAmortization}
              className="w-full bg-[#2ecc71] text-white p-3 rounded-lg hover:bg-[#27ae60] transition-transform hover:-translate-y-0.5 mt-5"
            >
              Export Amortization (CSV)
            </button>
            <button
              onClick={() => compareScenarios()}
              className="w-full bg-[#2ecc71] text-white p-3 rounded-lg hover:bg-[#27ae60] transition-transform hover:-translate-y-0.5 mt-3"
            >
              Compare Scenarios
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        input:focus,
        select:focus {
          outline: none;
        }
        @media (max-width: 768px) {
          .max-md\\:flex-col {
            flex-direction: column;
          }
          .max-md\\:max-h-\\[500px\\] {
            max-height: 500px;
          }
        }
      `}</style>
    </>
  );
}
