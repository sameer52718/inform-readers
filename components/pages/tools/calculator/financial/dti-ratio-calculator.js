"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [income, setIncome] = useState("");
  const [incomePeriod, setIncomePeriod] = useState("monthly");
  const [debts, setDebts] = useState([{ id: 1, name: "", amount: "" }]);
  const [results, setResults] = useState(null);
  const debtChartRef = useRef(null);
  const debtChartInstance = useRef(null);

  useEffect(() => {
    if (debtChartRef.current) {
      debtChartInstance.current = new Chart(debtChartRef.current, {
        type: "pie",
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Debt Distribution" },
          },
        },
      });
    }
    return () => {
      debtChartInstance.current?.destroy();
    };
  }, []);

  const addDebt = () => {
    setDebts([...debts, { id: debts.length + 1, name: "", amount: "" }]);
  };

  const removeDebt = (id) => {
    if (debts.length > 1) {
      setDebts(debts.filter((debt) => debt.id !== id));
    }
  };

  const updateDebt = (id, field, value) => {
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, [field]: value } : debt)));
  };

  const calculateDTI = () => {
    const monthlyIncome = incomePeriod === "annual" ? parseFloat(income) / 12 : parseFloat(income) || 0;
    const debtData = debts.map((debt) => ({
      name: debt.name || "Unnamed Debt",
      amount: parseFloat(debt.amount) || 0,
    }));

    const housingDebt =
      debtData.find(
        (d) => d.name.toLowerCase().includes("housing") || d.name.toLowerCase().includes("mortgage")
      )?.amount || 0;
    const totalDebt = debtData.reduce((sum, debt) => sum + debt.amount, 0);

    const frontEndDTI = (housingDebt / monthlyIncome) * 100;
    const backEndDTI = (totalDebt / monthlyIncome) * 100;

    let analysis = "";
    if (backEndDTI <= 36) {
      analysis = "Your DTI is healthy. Lenders typically prefer a back-end DTI below 36%.";
    } else if (backEndDTI <= 43) {
      analysis = "Your DTI is moderate. Some lenders may approve loans, but consider reducing debt.";
    } else {
      analysis = "Your DTI is high. This may impact loan approvals. Focus on paying down debts.";
    }

    setResults({
      frontEndDTI: frontEndDTI.toFixed(2),
      backEndDTI: backEndDTI.toFixed(2),
      analysis,
      debts: debtData,
    });

    debtChartInstance.current.data.labels = debtData.map((d) => d.name);
    debtChartInstance.current.data.datasets[0].data = debtData.map((d) => d.amount);
    debtChartInstance.current.update();
  };

  const saveCalculation = () => {
    const data = { income, incomePeriod, debts };
    localStorage.setItem("dtiCalculation", JSON.stringify(data));
    alert("Calculation saved!");
  };

  const loadCalculation = () => {
    const saved = localStorage.getItem("dtiCalculation");
    if (saved) {
      const data = JSON.parse(saved);
      setIncome(data.income);
      setIncomePeriod(data.incomePeriod);
      setDebts(data.debts.map((debt, index) => ({ ...debt, id: index + 1 })));
      calculateDTI();
    } else {
      alert("No saved calculation found.");
    }
  };

  const exportResults = () => {
    if (!results) return;
    const exportContent = `
Debt-to-Income (DTI) Ratio Results
================================
Front-End DTI: ${results.frontEndDTI}%
Back-End DTI: ${results.backEndDTI}%

Financial Health: ${results.analysis}

Debt Breakdown:
${results.debts.map((d) => `${d.name}: $${d.amount.toFixed(2)}`).join("\n")}
Total Monthly Debt: $${results.debts.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
================================
Generated on: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dti_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Debt-to-Income (DTI) Ratio Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text("Results:", 20, 40);
    doc.text(`Front-End DTI: ${results.frontEndDTI}%`, 20, 50);
    doc.text(`Back-End DTI: ${results.backEndDTI}%`, 20, 60);
    doc.text("Financial Health:", 20, 70);
    doc.text(results.analysis, 20, 80, { maxWidth: 160 });
    doc.text("Debt Breakdown:", 20, 100);
    let y = 110;
    results.debts.forEach((debt) => {
      doc.text(`${debt.name}: $${debt.amount.toFixed(2)}`, 20, y);
      y += 10;
    });
    doc.text(`Total Monthly Debt: $${results.debts.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}`, 20, y);
    doc.save("dti_report.pdf");
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Advanced DTI Ratio Calculator</h1>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Income Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Gross Income</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Period</label>
                <select
                  value={incomePeriod}
                  onChange={(e) => setIncomePeriod(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Debt Payments</h2>
            <div className="space-y-4">
              {debts.map((debt) => (
                <div key={debt.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Debt Name (e.g., Mortgage)"
                    required
                  />
                  <input
                    type="number"
                    value={debt.amount}
                    onChange={(e) => updateDebt(debt.id, "amount", e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Monthly Payment"
                    required
                  />
                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                    disabled={debts.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addDebt}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Add Debt
            </button>
          </div>
          <div className="flex gap-4 mb-8">
            <button
              onClick={calculateDTI}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate DTI
            </button>
            <button
              onClick={saveCalculation}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Save Calculation
            </button>
            <button
              onClick={loadCalculation}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Load Saved
            </button>
          </div>
          {results && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Front-End DTI</h3>
                  <p className="text-2xl font-bold text-gray-800">{results.frontEndDTI}%</p>
                  <div className="progress-bar">
                    <div
                      className={`progress ${
                        parseFloat(results.frontEndDTI) > 28 ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(parseFloat(results.frontEndDTI), 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Back-End DTI</h3>
                  <p className="text-2xl font-bold text-gray-800">{results.backEndDTI}%</p>
                  <div className="progress-bar">
                    <div
                      className={`progress ${
                        parseFloat(results.backEndDTI) > 36 ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(parseFloat(results.backEndDTI), 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Debt Distribution</h3>
                <canvas ref={debtChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Health Analysis</h3>
                <p className="text-gray-600">{results.analysis}</p>
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
