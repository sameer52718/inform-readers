"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [incomes, setIncomes] = useState([{ name: "", amount: 0, frequency: "monthly" }]);
  const [expenses, setExpenses] = useState([
    { name: "", amount: 0, category: "fixed", subcategory: "housing" },
  ]);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [savingsMonths, setSavingsMonths] = useState(12);
  const [results, setResults] = useState(null);
  const expenseChartRef = useRef(null);
  const incomeExpenseChartRef = useRef(null);
  const expenseChartInstance = useRef(null);
  const incomeExpenseChartInstance = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("budgetCalculation"));
    if (saved) {
      setIncomes(saved.incomes);
      setExpenses(saved.expenses);
      setSavingsGoal(saved.savingsGoal || 0);
      setSavingsMonths(saved.savingsMonths || 12);
      calculateBudget(saved.incomes, saved.expenses, saved.savingsGoal, saved.savingsMonths);
    }
  }, []);

  useEffect(() => {
    if (results && expenseChartRef.current && incomeExpenseChartRef.current) {
      if (expenseChartInstance.current) expenseChartInstance.current.destroy();
      if (incomeExpenseChartInstance.current) incomeExpenseChartInstance.current.destroy();

      expenseChartInstance.current = new Chart(expenseChartRef.current, {
        type: "pie",
        data: {
          labels: expenses.map((e) => `${e.name} (${e.subcategory})`),
          datasets: [
            {
              data: expenses.map((e) => e.amount),
              backgroundColor: ["#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6b7280"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Expense Breakdown" },
          },
        },
      });

      incomeExpenseChartInstance.current = new Chart(incomeExpenseChartRef.current, {
        type: "bar",
        data: {
          labels: ["Income", "Expenses"],
          datasets: [
            {
              label: "Monthly Amount ($)",
              data: [results.totalMonthlyIncome, results.totalExpenses],
              backgroundColor: ["#ef4444", "#10b981"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Income vs. Expenses" },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }
  }, [results, expenses]);

  const addIncome = () => {
    setIncomes([...incomes, { name: "", amount: 0, frequency: "monthly" }]);
  };

  const removeIncome = (index) => {
    if (incomes.length > 1) {
      setIncomes(incomes.filter((_, i) => i !== index));
    }
  };

  const addExpense = () => {
    setExpenses([...expenses, { name: "", amount: 0, category: "fixed", subcategory: "housing" }]);
  };

  const removeExpense = (index) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((_, i) => i !== index));
    }
  };

  const updateIncome = (index, field, value) => {
    const newIncomes = [...incomes];
    newIncomes[index][field] = field === "amount" ? parseFloat(value) || 0 : value;
    setIncomes(newIncomes);
  };

  const updateExpense = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = field === "amount" ? parseFloat(value) || 0 : value;
    setExpenses(newExpenses);
  };

  const calculateBudget = (
    calcIncomes = incomes,
    calcExpenses = expenses,
    calcSavingsGoal = savingsGoal,
    calcSavingsMonths = savingsMonths
  ) => {
    if (calcIncomes.length === 0 || calcIncomes.every((i) => i.amount <= 0)) {
      alert("Please add at least one valid income source.");
      return;
    }

    const totalMonthlyIncome = calcIncomes.reduce((sum, income) => {
      if (income.frequency === "weekly") return sum + income.amount * 4.333;
      if (income.frequency === "biweekly") return sum + income.amount * 2.167;
      if (income.frequency === "annual") return sum + income.amount / 12;
      return sum + income.amount;
    }, 0);

    const totalExpenses = calcExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const fixedExpenses = calcExpenses
      .filter((e) => e.category === "fixed")
      .reduce((sum, e) => sum + e.amount, 0);
    const variableExpenses = calcExpenses
      .filter((e) => e.category === "variable")
      .reduce((sum, e) => sum + e.amount, 0);
    const savingsExpenses = calcExpenses
      .filter((e) => e.category === "savings")
      .reduce((sum, e) => sum + e.amount, 0);

    const netBalance = totalMonthlyIncome - totalExpenses;
    const monthlySavingsNeeded = calcSavingsGoal / calcSavingsMonths;
    const savingsProgress =
      savingsExpenses >= monthlySavingsNeeded ? 100 : (savingsExpenses / monthlySavingsNeeded) * 100;

    let analysis = "";
    if (netBalance > 0) {
      analysis = `Your budget is in surplus! You have $${netBalance.toFixed(
        2
      )} left each month. Consider increasing savings or paying down debt.`;
    } else if (netBalance === 0) {
      analysis =
        "Your budget is balanced, but there’s no surplus. Review variable expenses to create room for savings.";
    } else {
      analysis = `Your budget is in deficit by $${Math.abs(netBalance).toFixed(
        2
      )}. Reduce variable expenses or increase income to balance your budget.`;
    }

    const needsPercent = (fixedExpenses / totalMonthlyIncome) * 100;
    const wantsPercent = (variableExpenses / totalMonthlyIncome) * 100;
    const savingsPercent = (savingsExpenses / totalMonthlyIncome) * 100;
    const budgetRules = `
      50/30/20 Rule:
      - Needs (Fixed): 50% recommended, Your budget: ${needsPercent.toFixed(2)}%
      - Wants (Variable): 30% recommended, Your budget: ${wantsPercent.toFixed(2)}%
      - Savings/Debt: 20% recommended, Your budget: ${savingsPercent.toFixed(2)}%
      Suggestions: ${needsPercent > 50 ? "Reduce fixed expenses." : ""} ${
      wantsPercent > 30 ? "Cut back on variable spending." : ""
    } ${savingsPercent < 20 ? "Increase savings contributions." : ""}
    `;

    setResults({
      totalMonthlyIncome,
      totalExpenses,
      netBalance,
      savingsProgress,
      monthlySavingsNeeded,
      savingsExpenses,
      analysis,
      budgetRules,
    });
  };

  const saveBudget = () => {
    const data = {
      incomes,
      expenses,
      savingsGoal,
      savingsMonths,
    };
    localStorage.setItem("budgetCalculation", JSON.stringify(data));
    alert("Budget saved!");
  };

  const loadBudget = () => {
    const saved = JSON.parse(localStorage.getItem("budgetCalculation"));
    if (saved) {
      setIncomes(saved.incomes);
      setExpenses(saved.expenses);
      setSavingsGoal(saved.savingsGoal || 0);
      setSavingsMonths(saved.savingsMonths || 12);
      calculateBudget(saved.incomes, saved.expenses, saved.savingsGoal, saved.savingsMonths);
    } else {
      alert("No saved budget found.");
    }
  };

  const exportResults = () => {
    if (!results) return;
    const exportContent = `
Budget Calculator Results
========================
Total Monthly Income: $${results.totalMonthlyIncome.toFixed(2)}
Total Monthly Expenses: $${results.totalExpenses.toFixed(2)}
Net Monthly Balance: $${results.netBalance.toFixed(2)}

Income Sources:
${incomes.map((i) => `- ${i.name}: $${i.amount.toFixed(2)} (${i.frequency})`).join("\n")}

Expenses:
${expenses.map((e) => `- ${e.name} (${e.subcategory}, ${e.category}): $${e.amount.toFixed(2)}`).join("\n")}

Savings Goal Progress:
You need $${results.monthlySavingsNeeded.toFixed(2)}/month to reach your $${savingsGoal.toFixed(
      2
    )} goal in ${savingsMonths} months. Current savings: $${results.savingsExpenses.toFixed(
      2
    )}/month (${results.savingsProgress.toFixed(2)}% progress).

Budget Health: ${results.analysis}

Budgeting Rule Comparison:
${results.budgetRules}
========================
Generated on: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budget_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Budget Calculator Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text("Budget Overview:", 20, 40);
    doc.text(`Total Monthly Income: $${results.totalMonthlyIncome.toFixed(2)}`, 20, 50);
    doc.text(`Total Monthly Expenses: $${results.totalExpenses.toFixed(2)}`, 20, 60);
    doc.text(`Net Monthly Balance: $${results.netBalance.toFixed(2)}`, 20, 70);

    doc.text("Income Sources:", 20, 80);
    let y = 90;
    incomes.forEach((income) => {
      doc.text(`${income.name}: $${income.amount.toFixed(2)} (${income.frequency})`, 20, y);
      y += 10;
    });

    doc.text("Expenses:", 20, y);
    y += 10;
    expenses.forEach((expense) => {
      doc.text(
        `${expense.name} (${expense.subcategory}, ${expense.category}): $${expense.amount.toFixed(2)}`,
        20,
        y
      );
      y += 10;
    });

    doc.text("Savings Goal Progress:", 20, y);
    doc.text(
      `You need $${results.monthlySavingsNeeded.toFixed(2)}/month to reach your $${savingsGoal.toFixed(
        2
      )} goal in ${savingsMonths} months.`,
      20,
      y + 10,
      { maxWidth: 160 }
    );
    y += 30;

    doc.text("Budget Health:", 20, y);
    doc.text(results.analysis, 20, y + 10, { maxWidth: 160 });
    y += 30;

    doc.text("Budgeting Rule Comparison:", 20, y);
    doc.text(results.budgetRules, 20, y + 10, { maxWidth: 160 });

    doc.save("budget_report.pdf");
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Advanced Budget Calculator</h1>

          {/* Income Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Income Sources</h2>
            <div className="space-y-4">
              {incomes.map((income, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
                  <input
                    type="text"
                    value={income.name}
                    onChange={(e) => updateIncome(index, "name", e.target.value)}
                    placeholder="Income Source (e.g., Salary)"
                    required
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  />
                  <input
                    type="number"
                    value={income.amount}
                    onChange={(e) => updateIncome(index, "amount", e.target.value)}
                    placeholder="Amount"
                    required
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  />
                  <select
                    value={income.frequency}
                    onChange={(e) => updateIncome(index, "frequency", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  >
                    {["weekly", "biweekly", "monthly", "annual"].map((freq) => (
                      <option key={freq} value={freq}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeIncome(index)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                    disabled={incomes.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addIncome}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Add Income
            </button>
          </div>

          {/* Expenses Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses</h2>
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-fadeIn">
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => updateExpense(index, "name", e.target.value)}
                    placeholder="Expense Name (e.g., Rent)"
                    required
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  />
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => updateExpense(index, "amount", e.target.value)}
                    placeholder="Monthly Amount"
                    required
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  />
                  <select
                    value={expense.category}
                    onChange={(e) => updateExpense(index, "category", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  >
                    {[
                      { value: "fixed", label: "Fixed (e.g., Rent, Utilities)" },
                      { value: "variable", label: "Variable (e.g., Groceries, Entertainment)" },
                      { value: "savings", label: "Savings/Investments" },
                    ].map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={expense.subcategory}
                    onChange={(e) => updateExpense(index, "subcategory", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  >
                    {["housing", "transportation", "food", "entertainment", "savings", "other"].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub.charAt(0).toUpperCase() + sub.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeExpense(index)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                    disabled={expenses.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addExpense}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Add Expense
            </button>
          </div>

          {/* Savings Goal Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Savings Goal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Goal Amount ($)</label>
                <input
                  type="number"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 5000"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Target Months</label>
                <input
                  type="number"
                  value={savingsMonths}
                  onChange={(e) => setSavingsMonths(parseFloat(e.target.value) || 12)}
                  placeholder="e.g., 12"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => calculateBudget()}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate Budget
            </button>
            <button
              onClick={saveBudget}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Save Budget
            </button>
            <button
              onClick={loadBudget}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Load Saved
            </button>
          </div>

          {/* Results Section */}
          {results && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Budget Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Total Monthly Income</h3>
                  <p className="text-2xl font-bold text-gray-800">${results.totalMonthlyIncome.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Total Monthly Expenses</h3>
                  <p className="text-2xl font-bold text-gray-800">${results.totalExpenses.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Net Monthly Balance</h3>
                  <p className="text-2xl font-bold text-gray-800">${results.netBalance.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Goal Progress</h3>
                <p className="text-gray-600">
                  You need ${results.monthlySavingsNeeded.toFixed(2)}/month to reach your $
                  {savingsGoal.toFixed(2)} goal in {savingsMonths} months. Current savings: $
                  {results.savingsExpenses.toFixed(2)}/month ({results.savingsProgress.toFixed(2)}% progress).
                </p>
                <div className="progress-bar h-5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`progress h-full ${
                      results.savingsProgress < 50
                        ? "bg-red-500"
                        : results.savingsProgress < 80
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(results.savingsProgress, 100)}%` }}
                  />
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Breakdown</h3>
                <canvas ref={expenseChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Income vs. Expenses</h3>
                <canvas ref={incomeExpenseChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Health Analysis</h3>
                <p className="text-gray-600">{results.analysis}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Budgeting Rule Comparison</h3>
                <p className="text-gray-600 whitespace-pre-line">{results.budgetRules}</p>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={exportPDF}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
                >
                  Export as PDF
                </button>
                <button
                  onClick={exportResults}
                  className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600"
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
        .progress-bar {
          height: 20px;
          background: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
        }
        .progress {
          height: 100%;
          transition: width 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}
