"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [debts, setDebts] = useState([
    {
      id: 1,
      name: "Credit Card",
      balance: 5000,
      apr: 18,
      minPayment: 2.5,
      creditLimit: 10000,
      sliderValue: 5000,
    },
  ]);
  const [consolidationType, setConsolidationType] = useState("none");
  const [consolidationAmount, setConsolidationAmount] = useState(0);
  const [consolidationApr, setConsolidationApr] = useState(7);
  const [consolidationTerm, setConsolidationTerm] = useState(3);
  const [consolidationFee, setConsolidationFee] = useState(1);
  const [prepaymentPenalty, setPrepaymentPenalty] = useState(0);
  const [strategy, setStrategy] = useState("minimum");
  const [extraPayment, setExtraPayment] = useState(100);
  const [budget, setBudget] = useState(500);
  const [income, setIncome] = useState(50000);
  const [filingStatus, setFilingStatus] = useState("single");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const canvasRef = useRef(null);

  const addDebt = () => {
    const newDebt = {
      id: debts.length + 1,
      name: `Debt ${debts.length + 1}`,
      balance: 0,
      apr: 15,
      minPayment: 2.5,
      creditLimit: 0,
      sliderValue: 0,
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id) => {
    if (debts.length > 1) {
      setDebts(debts.filter((debt) => debt.id !== id));
    }
  };

  const updateDebt = (id, field, value) => {
    setDebts(
      debts.map((debt) =>
        debt.id === id ? { ...debt, [field]: field === "name" ? value : parseFloat(value) || 0 } : debt
      )
    );
    if (field === "balance") {
      setDebts(
        debts.map((debt) => (debt.id === id ? { ...debt, sliderValue: parseFloat(value) || 0 } : debt))
      );
    }
  };

  const syncSlider = (id, value) => {
    setDebts(
      debts.map((debt) =>
        debt.id === id
          ? { ...debt, balance: parseFloat(value) || 0, sliderValue: parseFloat(value) || 0 }
          : debt
      )
    );
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData("text/plain"));
    if (draggedId !== targetId) {
      const draggedIndex = debts.findIndex((debt) => debt.id === draggedId);
      const targetIndex = debts.findIndex((debt) => debt.id === targetId);
      const newDebts = [...debts];
      const [dragged] = newDebts.splice(draggedIndex, 1);
      newDebts.splice(targetIndex, 0, dragged);
      setDebts(newDebts);
    }
  };

  const formatCurrency = (amount) => {
    return `$ ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  };

  const calculateConsolidation = () => {
    setError("");
    setStatus("Calculating...");
    setSummary([]);
    setSchedule([]);

    if (debts.length === 0) {
      setError("Add at least one debt");
      setStatus("");
      return;
    }
    if (
      debts.some((debt) => debt.balance <= 0 || debt.minPayment <= 0 || debt.apr < 0 || debt.creditLimit < 0)
    ) {
      setError(
        "Debt balance and minimum payment must be positive; APR and credit limit must be non-negative"
      );
      setStatus("");
      return;
    }
    if (
      consolidationType !== "none" &&
      (consolidationAmount <= 0 || consolidationApr < 0 || consolidationTerm <= 0 || consolidationFee < 0)
    ) {
      setError("Consolidation amount and term must be positive; APR and fee must be non-negative");
      setStatus("");
      return;
    }
    if (consolidationAmount > debts.reduce((sum, debt) => sum + debt.balance, 0)) {
      setError("Consolidation amount exceeds total debt");
      setStatus("");
      return;
    }
    if (extraPayment < 0 || budget < 0 || income < 0) {
      setError("Extra payment, budget, and income must be non-negative");
      setStatus("");
      return;
    }

    try {
      const taxRate =
        filingStatus === "single"
          ? income > 60000
            ? 0.24
            : 0.12
          : filingStatus === "married"
          ? income > 120000
            ? 0.24
            : 0.12
          : 0.22;

      let totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
      let totalInterest = 0;
      let totalTaxDeduction = 0;
      let months = 0;
      let activeDebts = debts.map((debt, i) => ({
        ...debt,
        originalIndex: i,
        balance: debt.balance,
        minPayment: Math.max(25, debt.balance * (debt.minPayment / 100)),
        utilization: debt.creditLimit > 0 ? (debt.balance / debt.creditLimit) * 100 : 0,
      }));
      const monthlyRates = debts.map((debt) => debt.apr / 100 / 12);

      let consolidationBalance = consolidationAmount;
      let consolidationFee = consolidationAmount * (consolidationFee / 100);
      let consolidationMonths = consolidationTerm * 12;
      if (consolidationType !== "none") {
        const consolidationMonthlyRate = consolidationApr / 100 / 12;
        const consolidationPayment =
          consolidationType === "loan"
            ? consolidationBalance *
              ((consolidationMonthlyRate * Math.pow(1 + consolidationMonthlyRate, consolidationMonths)) /
                (Math.pow(1 + consolidationMonthlyRate, consolidationMonths) - 1))
            : Math.max(25, consolidationBalance * 0.02);
        activeDebts.push({
          name: consolidationType === "loan" ? "Consolidation Loan" : "Balance Transfer",
          balance: consolidationBalance + consolidationFee,
          apr: consolidationApr,
          minPayment: consolidationPayment,
          originalIndex: debts.length,
          utilization: 0,
        });
        monthlyRates.push(consolidationMonthlyRate);
        activeDebts = activeDebts.map((debt) => {
          if (debt.originalIndex < debts.length) {
            debt.balance = Math.max(0, debt.balance - consolidationBalance / debts.length);
            debt.utilization = debt.creditLimit > 0 ? (debt.balance / debt.creditLimit) * 100 : 0;
          }
          return debt;
        });
        totalBalance += consolidationFee;
      }

      let debtOrder = [...activeDebts];
      if (strategy === "avalanche") {
        debtOrder.sort(
          (a, b) =>
            (debts[b.originalIndex]?.apr || consolidationApr) -
            (debts[a.originalIndex]?.apr || consolidationApr)
        );
      } else if (strategy === "snowball") {
        debtOrder.sort((a, b) => a.balance - b.balance);
      } else if (strategy === "custom") {
        debtOrder = [...activeDebts];
      }

      const schedule = [];
      while (activeDebts.some((debt) => debt.balance > 0) && months < 1200) {
        months++;
        let totalPayment = 0;
        const monthPayments = [];

        activeDebts.forEach((debt) => {
          if (debt.balance > 0) {
            debt.minPayment =
              debt.originalIndex < debts.length
                ? Math.max(25, debt.balance * (debt.minPayment / 100))
                : debt.minPayment;
            const interest = debt.balance * monthlyRates[debt.originalIndex];
            const payment = Math.min(debt.minPayment, debt.balance + interest);
            totalPayment += payment;
            totalInterest += interest;
            totalTaxDeduction += interest * taxRate;
            debt.balance = Math.max(0, debt.balance + interest - payment);
            debt.utilization = debt.creditLimit > 0 ? (debt.balance / debt.creditLimit) * 100 : 0;
            monthPayments.push({
              month: months,
              debt: debt.name,
              payment,
              interest,
              balance: debt.balance,
              taxDeduction: interest * taxRate,
              utilization: debt.utilization,
            });
          }
        });

        if (totalPayment > budget) {
          setError(`Payments exceed budget in month ${months}. Adjust budget or payments.`);
          setStatus("");
          return;
        }

        if (extraPayment > 0 && strategy !== "minimum") {
          let remainingPayment = Math.min(extraPayment, budget - totalPayment);
          for (let debt of debtOrder) {
            if (debt.balance > 0 && remainingPayment > 0) {
              const interest = debt.balance * monthlyRates[debt.originalIndex];
              const payment = Math.min(remainingPayment, debt.balance + interest);
              totalPayment += payment;
              totalInterest += interest;
              totalTaxDeduction += interest * taxRate;
              debt.balance = Math.max(0, debt.balance + interest - payment);
              debt.utilization = debt.creditLimit > 0 ? (debt.balance / debt.creditLimit) * 100 : 0;
              remainingPayment -= payment;
              monthPayments.push({
                month: months,
                debt: debt.name,
                payment,
                interest,
                balance: debt.balance,
                taxDeduction: interest * taxRate,
                utilization: debt.utilization,
              });
            }
          }
        }

        schedule.push(...monthPayments);
      }

      if (months >= 1200) {
        setError("Payoff takes too long. Increase payments or adjust strategy.");
        setStatus("");
        return;
      }

      let noConsolidationMonths = 0,
        noConsolidationInterest = 0;
      let tempDebts = debts.map((d, i) => ({
        ...d,
        originalIndex: i,
        balance: d.balance,
        minPayment: Math.max(25, d.balance * (d.minPayment / 100)),
      }));
      while (tempDebts.some((d) => d.balance > 0) && noConsolidationMonths < 1200) {
        noConsolidationMonths++;
        let totalPayment = 0;
        tempDebts.forEach((d) => {
          if (d.balance > 0) {
            d.minPayment = Math.max(25, d.balance * (d.minPayment / 100));
            const interest = d.balance * monthlyRates[d.originalIndex];
            const payment = Math.min(d.minPayment, d.balance + interest);
            totalPayment += payment;
            noConsolidationInterest += interest;
            d.balance = Math.max(0, d.balance + interest - payment);
          }
        });
        if (totalPayment > budget) break;
      }

      const consolidationSavings = consolidationType !== "none" ? noConsolidationInterest - totalInterest : 0;
      const creditScoreImpact = activeDebts.some((debt) => debt.utilization > 30)
        ? "Moderate (high utilization)"
        : "Positive (low utilization)";
      setSummary([
        { label: "Total Balance", value: formatCurrency(totalBalance) },
        { label: "Payoff Timeline (Months)", value: months },
        { label: "Total Interest Paid", value: formatCurrency(totalInterest) },
        { label: "Consolidation Savings", value: formatCurrency(consolidationSavings) },
        { label: "Tax Deductions", value: formatCurrency(totalTaxDeduction) },
        { label: "Credit Score Impact", value: creditScoreImpact },
      ]);

      setSchedule(schedule);

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        const totalBalances = Array(months + 1).fill(0);
        const totalInterests = Array(months + 1).fill(0);
        schedule.forEach((item) => {
          totalBalances[item.month] = (totalBalances[item.month] || 0) + item.balance;
          totalInterests[item.month] = (totalInterests[item.month] || 0) + item.interest;
        });
        const maxBalance = Math.max(totalBalance, ...totalBalances);
        const maxInterest = Math.max(...totalInterests);
        ctx.beginPath();
        ctx.moveTo(0, canvasRef.current.height);
        totalBalances.forEach((balance, i) => {
          const x = (i / months) * canvasRef.current.width;
          const y = canvasRef.current.height - (balance / maxBalance) * (canvasRef.current.height - 30);
          ctx.lineTo(x, y);
        });
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, canvasRef.current.height);
        totalInterests.forEach((interest, i) => {
          const x = (i / months) * canvasRef.current.width;
          const y = canvasRef.current.height - (interest / maxInterest) * (canvasRef.current.height - 30);
          ctx.lineTo(x, y);
        });
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      setStatus("Calculation complete!");
    } catch (error) {
      setError("Error in calculation. Check console for details.");
      setStatus("");
      console.error("Calculation error:", error);
    }
  };

  const sortTable = (index) => {
    const isAscending = !schedule[index]?.ascending;
    const sorted = [...schedule].sort((a, b) => {
      const aValue =
        index === 0 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6
          ? parseFloat((a[Object.keys(a)[index]] || "").replace(/[^0-9.-]+/g, "")) || 0
          : a[Object.keys(a)[index]];
      const bValue =
        index === 0 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6
          ? parseFloat((b[Object.keys(b)[index]] || "").replace(/[^0-9.-]+/g, "")) || 0
          : b[Object.keys(b)[index]];
      if (typeof aValue === "number") {
        return isAscending ? aValue - bValue : bValue - aValue;
      }
      return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    setSchedule(sorted.map((item) => ({ ...item, ascending: isAscending })));
  };

  const exportCSV = () => {
    let csv = "Month,Debt,Payment,Interest,Balance,Tax Deduction,Credit Utilization\n";
    schedule.forEach((item) => {
      csv += `${item.month},${item.debt},${item.payment.toFixed(2)},${item.interest.toFixed(
        2
      )},${item.balance.toFixed(2)},${item.taxDeduction.toFixed(2)},${item.utilization.toFixed(1)}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "debt_consolidation_schedule.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    alert("PDF export not implemented. Use inline jsPDF for full functionality.");
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">
          Advanced Debt Consolidation Calculator
        </h1>
        <div className="mb-6">
          {debts.map((debt) => (
            <div
              key={debt.id}
              className="border border-gray-300 p-4 rounded-lg mb-4 cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, debt.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, debt.id)}
            >
              <label className="block text-sm font-medium text-gray-600 mb-2">Debt Name</label>
              <input
                type="text"
                value={debt.name}
                onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Current Balance ($)</label>
              <input
                type="number"
                value={debt.balance}
                onChange={(e) => updateDebt(debt.id, "balance", e.target.value)}
                min="0"
                step="100"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="range"
                min="0"
                max="50000"
                value={debt.sliderValue}
                onChange={(e) => syncSlider(debt.id, e.target.value)}
                step="100"
                className="w-full mt-2"
              />
              <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">
                Annual Percentage Rate (APR, %)
              </label>
              <input
                type="number"
                value={debt.apr}
                onChange={(e) => updateDebt(debt.id, "apr", e.target.value)}
                min="0"
                step="0.1"
                className="w-full p-2 border rounded-lg"
              />
              <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">
                Minimum Payment (% of Balance)
              </label>
              <input
                type="number"
                value={debt.minPayment}
                onChange={(e) => updateDebt(debt.id, "minPayment", e.target.value)}
                min="0"
                step="0.1"
                className="w-full p-2 border rounded-lg"
              />
              <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Credit Limit ($)</label>
              <input
                type="number"
                value={debt.creditLimit}
                onChange={(e) => updateDebt(debt.id, "creditLimit", e.target.value)}
                min="0"
                step="100"
                className="w-full p-2 border rounded-lg"
              />
              <div className="h-2 bg-gray-300 rounded-full mt-4">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${
                      debt.creditLimit > 0 ? Math.max(0, 100 - (debt.balance / debt.creditLimit) * 100) : 0
                    }%`,
                  }}
                ></div>
              </div>
              {debts.length > 1 && (
                <button
                  onClick={() => removeDebt(debt.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 w-full hover:bg-red-600"
                >
                  Remove Debt
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addDebt}
            className="bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600"
          >
            Add Another Debt
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Consolidation Type</label>
          <select
            value={consolidationType}
            onChange={(e) => setConsolidationType(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="none">No Consolidation</option>
            <option value="loan">Consolidation Loan</option>
            <option value="balanceTransfer">Balance Transfer Card</option>
          </select>
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">
            Consolidation Amount ($)
          </label>
          <input
            type="number"
            value={consolidationAmount}
            onChange={(e) => setConsolidationAmount(parseFloat(e.target.value) || 0)}
            min="0"
            step="100"
            className="w-full p-2 border rounded-lg"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Consolidation APR (%)</label>
          <input
            type="number"
            value={consolidationApr}
            onChange={(e) => setConsolidationApr(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            className="w-full p-2 border rounded-lg"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Term (Years)</label>
          <input
            type="number"
            value={consolidationTerm}
            onChange={(e) => setConsolidationTerm(parseFloat(e.target.value) || 0)}
            min="0"
            step="1"
            className="w-full p-2 border rounded-lg"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">
            Origination/Transfer Fee (%)
          </label>
          <input
            type="number"
            value={consolidationFee}
            onChange={(e) => setConsolidationFee(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            className="w-full p-2 border rounded-lg"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Prepayment Penalty ($)</label>
          <input
            type="number"
            value={prepaymentPenalty}
            onChange={(e) => setPrepaymentPenalty(parseFloat(e.target.value) || 0)}
            min="0"
            step="10"
            className="w-full p-2 border rounded-lg"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Payment Strategy</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="minimum">Minimum Payment</option>
            <option value="avalanche">Debt Avalanche</option>
            <option value="snowball">Debt Snowball</option>
            <option value="custom">Custom (Drag to Prioritize)</option>
          </select>
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">
            Extra Monthly Payment ($)
          </label>
          <input
            type="number"
            value={extraPayment}
            onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
            min="0"
            step="10"
            className="w-full p-2 border rounded-lg"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Monthly Budget ($)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
            min="0"
            step="10"
            className="w-full p-2 border rounded-lg"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Annual Income ($)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
            min="0"
            step="1000"
            className="w-full p-2 border rounded-lg"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Tax Filing Status</label>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="head">Head of Household</option>
          </select>
        </div>
        <button
          onClick={calculateConsolidation}
          className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600"
        >
          Calculate Consolidation
        </button>
        {summary.length > 0 && (
          <table className="w-full mt-6 border-collapse bg-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="p-2">Metric</th>
                <th className="p-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((metric, i) => (
                <tr key={i} className="border-b border-gray-300">
                  <td className="p-2">{metric.label}</td>
                  <td className="p-2">{metric.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {schedule.length > 0 && (
          <table className="w-full mt-6 border-collapse bg-gray-200 rounded-lg overflow-hidden max-h-80 overflow-y-auto block">
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="p-2 cursor-pointer" onClick={() => sortTable(0)}>
                  Month
                </th>
                <th className="p-2 cursor-pointer" onClick={() => sortTable(1)}>
                  Debt
                </th>
                <th className="p-2 cursor-pointer" onClick={() => sortTable(2)}>
                  Payment
                </th>
                <th className="p-2 cursor-pointer" onClick={() => sortTable(3)}>
                  Interest
                </th>
                <th className="p-2 cursor-pointer" onClick={() => sortTable(4)}>
                  Balance
                </th>
                <th className="p-2 cursor-pointer" onClick={() => sortTable(5)}>
                  Tax Deduction
                </th>
                <th className="p-2 cursor-pointer" onClick={() => sortTable(6)}>
                  Credit Utilization
                </th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, i) => (
                <tr key={i} className="border-b border-gray-300">
                  <td className="p-2">{item.month}</td>
                  <td className="p-2">{item.debt}</td>
                  <td className="p-2">{formatCurrency(item.payment)}</td>
                  <td className="p-2">{formatCurrency(item.interest)}</td>
                  <td className="p-2">{formatCurrency(item.balance)}</td>
                  <td className="p-2">{formatCurrency(item.taxDeduction)}</td>
                  <td className="p-2">{item.utilization.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {schedule.length > 0 && (
          <div className="mt-6">
            <canvas
              ref={canvasRef}
              width="680"
              height="150"
              className="border-2 border-gray-300 rounded-lg"
            ></canvas>
          </div>
        )}
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        {status && <div className="text-yellow-500 text-center mt-4">{status}</div>}
        {schedule.length > 0 && (
          <div className="mt-4 text-center">
            <a onClick={exportCSV} className="text-blue-500 underline cursor-pointer mr-4">
              Download Payoff Schedule (CSV)
            </a>
            <a onClick={exportPDF} className="text-blue-500 underline cursor-pointer">
              Download Payoff Schedule (PDF)
            </a>
          </div>
        )}
      </div>
      <style jsx>{`
        input:focus,
        select:focus {
          outline: none;
          box-shadow: 0 0 6px #ef4444;
        }

        input[type="range"] {
          accent-color: #ef4444;
        }

        @media (max-width: 640px) {
          button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
