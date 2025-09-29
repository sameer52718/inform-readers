"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [debts, setDebts] = useState([
    { id: 1, name: "", type: "credit-card", balance: "", interestRate: "", minPayment: "" },
  ]);
  const [paymentStrategy, setPaymentStrategy] = useState("minimum");
  const [fixedPayment, setFixedPayment] = useState("");
  const [customPriority, setCustomPriority] = useState("");
  const [extraPayment, setExtraPayment] = useState("");
  const [balanceTransfer, setBalanceTransfer] = useState("none");
  const [transferDetails, setTransferDetails] = useState({ rate: "", period: "", fee: "" });
  const [consolidation, setConsolidation] = useState("none");
  const [consolidationDetails, setConsolidationDetails] = useState({ rate: "", term: "", fee: "" });
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [history, setHistory] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const balanceChartRef = useRef(null);
  const breakdownChartRef = useRef(null);
  const balanceChartInstance = useRef(null);
  const breakdownChartInstance = useRef(null);

  useEffect(() => {
    if (balanceChartRef.current) {
      balanceChartInstance.current = new Chart(balanceChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [{ label: "Total Balance", data: [], borderColor: "#3498db", fill: false, tension: 0.1 }],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Balance" } },
            x: { title: { display: true, text: "Month" } },
          },
          plugins: { title: { display: true, text: "Debt Balance Over Time" } },
        },
      });
    }
    if (breakdownChartRef.current) {
      breakdownChartInstance.current = new Chart(breakdownChartRef.current, {
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
          plugins: { legend: { position: "top" }, title: { display: true, text: "Debt Payment Breakdown" } },
        },
      });
    }
    return () => {
      balanceChartInstance.current?.destroy();
      breakdownChartInstance.current?.destroy();
    };
  }, []);

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[curr]}${parseFloat(amount).toFixed(2)}`;
  };

  const addDebtRow = () => {
    const newId = Math.max(...debts.map((d) => d.id)) + 1;
    setDebts([
      ...debts,
      { id: newId, name: "", type: "credit-card", balance: "", interestRate: "", minPayment: "" },
    ]);
  };

  const removeDebtRow = (id) => {
    if (debts.length > 1) setDebts(debts.filter((d) => d.id !== id));
  };

  const updateDebt = (id, field, value) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const calculatePayoff = () => {
    const validDebts = debts.filter(
      (d) => parseFloat(d.balance) > 0 && parseFloat(d.interestRate) >= 0 && parseFloat(d.minPayment) >= 0
    );
    if (validDebts.length === 0) {
      setResults({
        error: "Please enter at least one valid debt with balance, interest rate, and minimum payment",
      });
      return;
    }
    if (paymentStrategy === "fixed" && (!parseFloat(fixedPayment) || parseFloat(fixedPayment) <= 0)) {
      setResults({ error: "Please enter a valid fixed monthly payment" });
      return;
    }
    if (paymentStrategy === "custom" && !customPriority.trim()) {
      setResults({ error: "Please enter valid debt names for custom priority" });
      return;
    }
    if (
      balanceTransfer === "offer" &&
      (!parseFloat(transferDetails.rate) ||
        !parseInt(transferDetails.period) ||
        !parseFloat(transferDetails.fee))
    ) {
      setResults({ error: "Please enter valid balance transfer details" });
      return;
    }
    if (
      consolidation === "apply" &&
      (!parseFloat(consolidationDetails.rate) ||
        !parseInt(consolidationDetails.term) ||
        isNaN(parseFloat(consolidationDetails.fee)))
    ) {
      setResults({ error: "Please enter valid consolidation details" });
      return;
    }

    let totalBalance = validDebts.reduce((sum, d) => sum + parseFloat(d.balance), 0);
    const creditCardBalance = validDebts
      .filter((d) => d.type === "credit-card")
      .reduce((sum, d) => sum + parseFloat(d.balance), 0);
    const transferFee =
      balanceTransfer === "offer" ? creditCardBalance * (parseFloat(transferDetails.fee) / 100) : 0;
    const consolidationFee = consolidation === "apply" ? parseFloat(consolidationDetails.fee) : 0;
    const totalFees = transferFee + consolidationFee;
    totalBalance += totalFees;
    let totalInterest = 0;
    let totalPayments = 0;
    let payoffMonths = 0;
    const newPaymentData = [];
    const balances = [totalBalance];
    const months = [0];
    const debtsCopy = validDebts.map((d) => ({
      name: d.name || "Unnamed Debt",
      type: d.type,
      balance: parseFloat(d.balance),
      interestRate: parseFloat(d.interestRate) / 100,
      minPayment: parseFloat(d.minPayment),
    }));

    if (consolidation === "apply") {
      const monthlyRate = parseFloat(consolidationDetails.rate) / 100 / 12;
      const totalMonths = parseInt(consolidationDetails.term) * 12;
      const monthlyPayment = totalBalance * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -totalMonths)));
      let remainingBalance = totalBalance;

      for (let month = 1; month <= totalMonths && remainingBalance > 0; month++) {
        const monthInterest = remainingBalance * monthlyRate;
        const monthPrincipal = monthlyPayment - monthInterest;
        remainingBalance -= monthPrincipal;
        totalInterest += monthInterest;
        totalPayments += monthlyPayment;
        newPaymentData.push({
          month,
          debtName: "Consolidated Loan",
          payment: monthlyPayment,
          interest: monthInterest,
          principal: monthPrincipal,
          balance: remainingBalance,
        });
        balances.push(remainingBalance);
        months.push(month);
      }
      payoffMonths = totalMonths;
    } else {
      if (paymentStrategy === "snowball") {
        debtsCopy.sort((a, b) => a.balance - b.balance);
      } else if (paymentStrategy === "avalanche") {
        debtsCopy.sort((a, b) => b.interestRate - a.interestRate);
      } else if (paymentStrategy === "custom") {
        const priority = customPriority.split(",").map((name) => name.trim());
        debtsCopy.sort((a, b) => {
          const aIndex = priority.indexOf(a.name);
          const bIndex = priority.indexOf(b.name);
          return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
        });
      }

      let remainingBalance = totalBalance;
      let month = 0;
      let totalMonthlyPayment =
        debtsCopy.reduce((sum, d) => sum + d.minPayment, 0) + (parseFloat(extraPayment) || 0);

      if (
        paymentStrategy === "fixed" &&
        parseFloat(fixedPayment) < totalMonthlyPayment - (parseFloat(extraPayment) || 0)
      ) {
        setResults({ error: "Fixed payment must be at least the sum of minimum payments" });
        return;
      }

      while (remainingBalance > 0 && month < 1200) {
        month++;
        let monthInterest = 0;
        let monthPrincipal = 0;
        let payment = paymentStrategy === "fixed" ? parseFloat(fixedPayment) : totalMonthlyPayment;

        for (let i = 0; i < debtsCopy.length; i++) {
          if (debtsCopy[i].BALance <= 0) continue;
          const debtInterest =
            (debtsCopy[i].balance *
              (balanceTransfer === "offer" &&
              debtsCopy[i].type === "credit-card" &&
              month <= parseInt(transferDetails.period)
                ? parseFloat(transferDetails.rate) / 100
                : debtsCopy[i].interestRate)) /
            12;
          let debtPayment =
            paymentStrategy === "fixed"
              ? (debtsCopy[i].balance / remainingBalance) * (payment - monthInterest)
              : Math.min(debtsCopy[i].minPayment, debtsCopy[i].balance + debtInterest);
          if (debtsCopy[i].balance > 0 && payment > 0) {
            const availablePayment = Math.min(payment, debtsCopy[i].balance + debtInterest);
            monthInterest += debtInterest;
            monthPrincipal += availablePayment - debtInterest;
            debtsCopy[i].balance = Math.max(0, debtsCopy[i].balance - (availablePayment - debtInterest));
            newPaymentData.push({
              month,
              debtName: debtsCopy[i].name,
              payment: availablePayment,
              interest: debtInterest,
              principal: availablePayment - debtInterest,
              balance: debtsCopy[i].balance,
            });
            payment -= availablePayment;
          }
          if (
            debtsCopy[i].balance <= 0 &&
            i < debtsCopy.length - 1 &&
            paymentStrategy !== "fixed" &&
            paymentStrategy !== "minimum"
          ) {
            totalMonthlyPayment += debtsCopy[i].minPayment;
          }
        }

        remainingBalance -= monthPrincipal;
        totalInterest += monthInterest;
        totalPayments += monthPrincipal + monthInterest;
        balances.push(remainingBalance);
        months.push(month);
        if (remainingBalance <= 0) break;
      }
      payoffMonths = month;
    }

    if (payoffMonths >= 1200) {
      setResults({ error: "Payoff takes too long; increase payments or check inputs" });
      return;
    }

    setResults({
      totalBalance: totalBalance - totalFees,
      totalInterest,
      payoffTime: payoffMonths,
      totalPayments,
      transferFee,
      consolidationFee,
      monthlyPayment:
        consolidation === "apply"
          ? totalPayments / payoffMonths
          : paymentStrategy === "fixed"
          ? fixedPayment
          : totalMonthlyPayment,
    });
    setPaymentData(newPaymentData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      strategy: paymentStrategy,
      totalBalance: formatCurrency(totalBalance - totalFees),
      totalInterest: formatCurrency(totalInterest),
      payoffTime: `${payoffMonths} months`,
      totalPayments: formatCurrency(totalPayments),
      transferFee: formatCurrency(transferFee),
      consolidationFee: formatCurrency(consolidationFee),
      monthlyPayment: formatCurrency(
        consolidation === "apply"
          ? totalPayments / payoffMonths
          : paymentStrategy === "fixed"
          ? fixedPayment
          : totalMonthlyPayment
      ),
      extraPayment: formatCurrency(extraPayment),
      debts: debtsCopy.map((d) => ({
        name: d.name,
        type: d.type,
        balance: formatCurrency(d.balance),
        interestRate: `${(d.interestRate * 100).toFixed(2)}%`,
        minPayment: formatCurrency(d.minPayment),
      })),
      balanceTransfer:
        balanceTransfer === "offer"
          ? {
              transferRate: `${parseFloat(transferDetails.rate).toFixed(2)}%`,
              transferPeriod: `${parseInt(transferDetails.period)} months`,
              transferFeeRate: `${parseFloat(transferDetails.fee).toFixed(2)}%`,
            }
          : "None",
      consolidation:
        consolidation === "apply"
          ? {
              consolidationRate: `${parseFloat(consolidationDetails.rate).toFixed(2)}%`,
              consolidationTerm: `${parseInt(consolidationDetails.term)} years`,
              consolidationFee: formatCurrency(consolidationDetails.fee),
            }
          : "None",
    };
    setHistory([...history, calculation]);

    balanceChartInstance.current.data.labels = months;
    balanceChartInstance.current.data.datasets[0].data = balances;
    balanceChartInstance.current.update();
    breakdownChartInstance.current.data.datasets[0].data = [
      totalBalance - totalFees,
      totalInterest,
      totalFees,
    ];
    breakdownChartInstance.current.update();
  };

  const compareStrategies = () => {
    const validDebts = debts.filter(
      (d) => parseFloat(d.balance) > 0 && parseFloat(d.interestRate) >= 0 && parseFloat(d.minPayment) >= 0
    );
    if (validDebts.length === 0) {
      setResults({ error: "Please enter valid debt details" });
      return;
    }

    const debtsCopy = validDebts.map((d) => ({
      name: d.name || "Unnamed Debt",
      type: d.type,
      balance: parseFloat(d.balance),
      interestRate: parseFloat(d.interestRate) / 100,
      minPayment: parseFloat(d.minPayment),
    }));
    let totalBalance = debtsCopy.reduce((sum, d) => sum + d.balance, 0);
    const creditCardBalance = debtsCopy
      .filter((d) => d.type === "credit-card")
      .reduce((sum, d) => sum + d.balance, 0);
    const transferFee =
      balanceTransfer === "offer" ? creditCardBalance * (parseFloat(transferDetails.fee) / 100) : 0;
    totalBalance += transferFee;

    const strategies = [
      { label: "Minimum Payments", type: "minimum" },
      { label: "Debt Snowball", type: "snowball" },
      { label: "Debt Avalanche", type: "avalanche" },
    ];

    const newComparisonData = strategies.map((strategy) => {
      const debtsClone = JSON.parse(JSON.stringify(debtsCopy));
      let remainingBalance = totalBalance;
      let totalInterest = 0;
      let totalPayments = 0;
      let month = 0;
      let totalMonthlyPayment =
        debtsClone.reduce((sum, d) => sum + d.minPayment, 0) + (parseFloat(extraPayment) || 0);

      if (strategy.type === "minimum") {
        while (remainingBalance > 0 && month < 1200) {
          month++;
          let monthInterest = 0;
          let monthPrincipal = 0;

          debtsClone.forEach((debt) => {
            if (debt.balance <= 0) return;
            const debtInterest =
              (debt.balance *
                (balanceTransfer === "offer" &&
                debt.type === "credit-card" &&
                month <= parseInt(transferDetails.period)
                  ? parseFloat(transferDetails.rate) / 100
                  : debt.interestRate)) /
              12;
            monthInterest += debtInterest;
            const debtPayment = Math.min(debt.minPayment, debt.balance + debtInterest);
            const principalPaid = Math.min(debtPayment, debt.balance);
            debt.balance = Math.max(0, debt.balance - principalPaid);
            monthPrincipal += principalPaid;
          });

          remainingBalance -= monthPrincipal;
          totalInterest += monthInterest;
          totalPayments += monthPrincipal + monthInterest;
          if (remainingBalance <= 0) break;
        }
      } else {
        debtsClone.sort(
          strategy.type === "snowball"
            ? (a, b) => a.balance - b.balance
            : (a, b) => b.interestRate - a.interestRate
        );

        while (remainingBalance > 0 && month < 1200) {
          month++;
          let monthInterest = 0;
          let monthPrincipal = 0;
          let payment = totalMonthlyPayment;

          for (let i = 0; i < debtsClone.length; i++) {
            if (debtsClone[i].balance <= 0) continue;
            const debtInterest =
              (debtsClone[i].balance *
                (balanceTransfer === "offer" &&
                debtsClone[i].type === "credit-card" &&
                month <= parseInt(transferDetails.period)
                  ? parseFloat(transferDetails.rate) / 100
                  : debtsClone[i].interestRate)) /
              12;
            let debtPayment = Math.min(debtsClone[i].balance + debtInterest, debtsClone[i].minPayment);
            if (debtsClone[i].balance > 0 && payment > 0) {
              const availablePayment = Math.min(payment, debtsClone[i].balance + debtInterest);
              monthInterest += debtInterest;
              monthPrincipal += availablePayment - debtInterest;
              debtsClone[i].balance = Math.max(0, debtsClone[i].balance - (availablePayment - debtInterest));
              payment -= availablePayment;
            }
            if (debtsClone[i].balance <= 0 && i < debtsClone.length - 1) {
              totalMonthlyPayment += debtsClone[i].minPayment;
            }
          }

          remainingBalance -= monthPrincipal;
          totalInterest += monthInterest;
          totalPayments += monthPrincipal + monthInterest;
          if (remainingBalance <= 0) break;
        }
      }

      return { label: strategy.label, totalInterest, payoffTime: month, totalPayments };
    });

    setComparisonData(newComparisonData);
  };

  const exportPaymentSchedule = () => {
    if (paymentData.length === 0) {
      setResults({ error: "No payment data to export" });
      return;
    }

    const csvContent = [
      "Month,Debt Name,Payment,Interest,Principal,Balance",
      ...paymentData.map(
        (item) =>
          `${item.month},${item.debtName},${item.payment.toFixed(2)},${item.interest.toFixed(
            2
          )},${item.principal.toFixed(2)},${item.balance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "debt_payment_schedule.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white  flex justify-center items-center p-5">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-6xl w-full flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Advanced Debt Payoff Calculator
            </h1>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Debts</label>
              {debts.map((debt) => (
                <div key={debt.id} className="flex flex-col sm:flex-row gap-2 mb-3">
                  {[
                    { id: "name", type: "text", placeholder: "Debt name", value: debt.name },
                    {
                      id: "type",
                      type: "select",
                      value: debt.type,
                      options: [
                        { value: "credit-card", label: "Credit Card" },
                        { value: "student-loan", label: "Student Loan" },
                        { value: "personal-loan", label: "Personal Loan" },
                        { value: "auto-loan", label: "Auto Loan" },
                        { value: "other", label: "Other" },
                      ],
                    },
                    {
                      id: "balance",
                      type: "number",
                      placeholder: "Balance ($)",
                      step: "100",
                      value: debt.balance,
                    },
                    {
                      id: "interestRate",
                      type: "number",
                      placeholder: "Interest Rate (%)",
                      step: "0.01",
                      value: debt.interestRate,
                    },
                    {
                      id: "minPayment",
                      type: "number",
                      placeholder: "Min Payment ($)",
                      step: "10",
                      value: debt.minPayment,
                    },
                  ].map((field) => (
                    <div key={field.id} className="flex-1">
                      {field.type === "select" ? (
                        <select
                          value={field.value}
                          onChange={(e) => updateDebt(debt.id, field.id, e.target.value)}
                          className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
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
                          placeholder={field.placeholder}
                          step={field.step}
                          value={field.value}
                          onChange={(e) => updateDebt(debt.id, field.id, e.target.value)}
                          className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                        />
                      )}
                    </div>
                  ))}
                  {debts.length > 1 && (
                    <button
                      onClick={() => removeDebtRow(debt.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 sm:w-auto"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addDebtRow}
                className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
              >
                Add Debt
              </button>
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Payment Strategy</label>
              <select
                value={paymentStrategy}
                onChange={(e) => setPaymentStrategy(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
              >
                {[
                  { value: "minimum", label: "Minimum Payments" },
                  { value: "fixed", label: "Fixed Monthly Payment" },
                  { value: "snowball", label: "Debt Snowball (Lowest Balance First)" },
                  { value: "avalanche", label: "Debt Avalanche (Highest Interest First)" },
                  { value: "custom", label: "Custom Priority" },
                ].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {paymentStrategy === "fixed" && (
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Fixed Monthly Payment ($)
                </label>
                <input
                  type="number"
                  placeholder="Enter fixed payment"
                  step="100"
                  value={fixedPayment}
                  onChange={(e) => setFixedPayment(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                />
              </div>
            )}
            {paymentStrategy === "custom" && (
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Custom Debt Priority (Comma-separated names)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Card 1, Loan 2"
                  value={customPriority}
                  onChange={(e) => setCustomPriority(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                />
              </div>
            )}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Extra Monthly Payment ($)
              </label>
              <input
                type="number"
                placeholder="Enter extra payment"
                step="100"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Balance Transfer (Credit Cards Only)
              </label>
              <select
                value={balanceTransfer}
                onChange={(e) => setBalanceTransfer(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
              >
                <option value="none">None</option>
                <option value="offer">Apply Offer</option>
              </select>
            </div>
            {balanceTransfer === "offer" && (
              <>
                {[
                  {
                    id: "rate",
                    label: "Promotional Interest Rate (%)",
                    placeholder: "Enter promotional rate",
                    step: "0.01",
                  },
                  {
                    id: "period",
                    label: "Promotional Period (Months)",
                    placeholder: "Enter promotional period",
                    step: "1",
                  },
                  {
                    id: "fee",
                    label: "Transfer Fee (%)",
                    placeholder: "Enter transfer fee percentage",
                    step: "0.01",
                  },
                ].map((field) => (
                  <div key={field.id} className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      step={field.step}
                      value={transferDetails[field.id]}
                      onChange={(e) => setTransferDetails({ ...transferDetails, [field.id]: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                    />
                  </div>
                ))}
              </>
            )}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Loan Consolidation</label>
              <select
                value={consolidation}
                onChange={(e) => setConsolidation(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
              >
                <option value="none">None</option>
                <option value="apply">Apply Consolidation</option>
              </select>
            </div>
            {consolidation === "apply" && (
              <>
                {[
                  {
                    id: "rate",
                    label: "Consolidation Interest Rate (%)",
                    placeholder: "Enter consolidation rate",
                    step: "0.01",
                  },
                  {
                    id: "term",
                    label: "Consolidation Term (Years)",
                    placeholder: "Enter term in years",
                    step: "1",
                  },
                  {
                    id: "fee",
                    label: "Consolidation Fee ($)",
                    placeholder: "Enter consolidation fee",
                    step: "100",
                  },
                ].map((field) => (
                  <div key={field.id} className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      step={field.step}
                      value={consolidationDetails[field.id]}
                      onChange={(e) =>
                        setConsolidationDetails({ ...consolidationDetails, [field.id]: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                    />
                  </div>
                ))}
              </>
            )}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
              >
                {[
                  { value: "USD", label: "$ USD" },
                  { value: "CAD", label: "$ CAD" },
                  { value: "EUR", label: "€ EUR" },
                  { value: "GBP", label: "£ GBP" },
                ].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={calculatePayoff}
              className="w-full bg-red-500 text-white p-3 rounded-lg mb-5 hover:bg-red-600"
            >
              Calculate Payoff
            </button>
            {results && (
              <div className="bg-white p-5 rounded-lg mb-5">
                {results.error ? (
                  <p className="text-red-500 text-center">{results.error}</p>
                ) : (
                  <>
                    <p>
                      <strong>Total Balance:</strong> {formatCurrency(results.totalBalance)}
                    </p>
                    <p>
                      <strong>Total Interest Paid:</strong> {formatCurrency(results.totalInterest)}
                    </p>
                    <p>
                      <strong>Payoff Time:</strong> {results.payoffTime} months (
                      {(results.payoffTime / 12).toFixed(1)} years)
                    </p>
                    <p>
                      <strong>Total Payments:</strong> {formatCurrency(results.totalPayments)}
                    </p>
                    <p>
                      <strong>Balance Transfer Fee:</strong> {formatCurrency(results.transferFee)}
                    </p>
                    <p>
                      <strong>Consolidation Fee:</strong> {formatCurrency(results.consolidationFee)}
                    </p>
                    <p>
                      <strong>Monthly Payment:</strong> {formatCurrency(results.monthlyPayment)}
                    </p>
                  </>
                )}
              </div>
            )}
            <div className="mb-5">
              <canvas ref={balanceChartRef} className="border-2 border-gray-300 rounded-lg" />
            </div>
          </div>
          <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-white rounded-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Payment Schedule & History</h1>
            {paymentData.length > 0 && (
              <table className="w-full border-collapse mb-5">
                <thead>
                  <tr className="bg-red-500 text-white">
                    {["Month", "Debt Name", "Payment", "Interest", "Principal", "Balance"].map((h) => (
                      <th key={h} className="p-2 text-right">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paymentData.map((item, i) => (
                    <tr key={i} className="border-b border-gray-300 even:bg-gray-50">
                      <td className="p-2 text-right">{item.month}</td>
                      <td className="p-2 text-right">{item.debtName}</td>
                      <td className="p-2 text-right">{formatCurrency(item.payment)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.interest)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.principal)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {history.map((item, i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg mb-3 shadow">
                <p>
                  <strong>Date:</strong> {item.timestamp}
                </p>
                <p>
                  <strong>Strategy:</strong> {item.strategy}
                </p>
                <p>
                  <strong>Total Balance:</strong> {item.totalBalance}
                </p>
                <p>
                  <strong>Total Interest:</strong> {item.totalInterest}
                </p>
                <p>
                  <strong>Payoff Time:</strong> {item.payoffTime}
                </p>
                <p>
                  <strong>Total Payments:</strong> {item.totalPayments}
                </p>
                <p>
                  <strong>Balance Transfer Fee:</strong> {item.transferFee}
                </p>
                <p>
                  <strong>Consolidation Fee:</strong> {item.consolidationFee}
                </p>
                <p>
                  <strong>Monthly Payment:</strong> {item.monthlyPayment}
                </p>
                <p>
                  <strong>Extra Payment:</strong> {item.extraPayment}
                </p>
                <p>
                  <strong>Debts:</strong>
                </p>
                <ul className="list-disc pl-5">
                  {item.debts.map((debt, j) => (
                    <li key={j}>
                      {debt.name} ({debt.type}): Balance {debt.balance}, Interest {debt.interestRate}, Min
                      Payment {debt.minPayment}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Balance Transfer:</strong>{" "}
                  {typeof item.balanceTransfer === "string"
                    ? item.balanceTransfer
                    : `Rate: ${item.balanceTransfer.transferRate}, Period: ${item.balanceTransfer.transferPeriod}, Fee: ${item.balanceTransfer.transferFeeRate}`}
                </p>
                <p>
                  <strong>Consolidation:</strong>{" "}
                  {typeof item.consolidation === "string"
                    ? item.consolidation
                    : `Rate: ${item.consolidation.consolidationRate}, Term: ${item.consolidation.consolidationTerm}, Fee: ${item.consolidation.consolidationFee}`}
                </p>
              </div>
            ))}
            {comparisonData.length > 0 && (
              <table className="w-full border-collapse mb-5">
                <thead>
                  <tr className="bg-red-500 text-white">
                    {["Strategy", "Total Interest", "Payoff Time", "Total Payments"].map((h) => (
                      <th key={h} className="p-2 text-right">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, i) => (
                    <tr key={i} className="border-b border-gray-300 even:bg-gray-50">
                      <td className="p-2 text-right">{item.label}</td>
                      <td className="p-2 text-right">{formatCurrency(item.totalInterest)}</td>
                      <td className="p-2 text-right">{item.payoffTime} months</td>
                      <td className="p-2 text-right">{formatCurrency(item.totalPayments)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mb-5">
              <canvas ref={breakdownChartRef} className="border-2 border-gray-300 rounded-lg" />
            </div>
            <button
              onClick={exportPaymentSchedule}
              className="w-full bg-green-500 text-white p-3 rounded-lg mb-3 hover:bg-green-600"
            >
              Export Payment Schedule (CSV)
            </button>
            <button
              onClick={compareStrategies}
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
            >
              Compare Strategies
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .flex-col\\:md\\:flex-row {
            flex-direction: column;
          }
          .max-h-\\[700px\\] {
            max-height: 500px;
          }
          .flex-row {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
