"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [formData, setFormData] = useState({
    msrp: "",
    negotiatedPrice: "",
    downPayment: "0",
    residualValue: "50",
    moneyFactor: "0.002",
    leaseTerm: "36",
    salesTax: "7",
  });
  const [fees, setFees] = useState([{ name: "Acquisition Fee", amount: "" }]);
  const [results, setResults] = useState(null);
  const costChartRef = useRef(null);
  let costChart;

  useEffect(() => {
    if (costChartRef.current) {
      costChart = new Chart(costChartRef.current, {
        type: "pie",
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Lease Cost Breakdown" } },
        },
      });
    }
    return () => costChart?.destroy();
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addFee = () => {
    setFees([...fees, { name: `Fee ${fees.length + 1}`, amount: "" }]);
  };

  const removeFee = (index) => {
    if (fees.length > 1) {
      setFees(fees.filter((_, i) => i !== index));
    }
  };

  const updateFee = (index, field, value) => {
    const newFees = [...fees];
    newFees[index][field] = value;
    setFees(newFees);
  };

  const calculateLease = () => {
    const { msrp, negotiatedPrice, downPayment, residualValue, moneyFactor, leaseTerm, salesTax } = formData;
    const msrpVal = parseFloat(msrp) || 0;
    const negPrice = parseFloat(negotiatedPrice) || 0;
    const downPay = parseFloat(downPayment) || 0;
    const resValPercent = parseFloat(residualValue) / 100 || 0;
    const moneyFac = parseFloat(moneyFactor) || 0;
    const term = parseFloat(leaseTerm) || 36;
    const taxRate = parseFloat(salesTax) / 100 || 0;

    if (!msrpVal || !negPrice) {
      alert("Please enter valid MSRP and Negotiated Price.");
      return;
    }

    const totalFees = fees.reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);
    const residualValues = msrpVal * resValPercent;
    const capitalizedCost = negPrice - downPay;
    const depreciationAmount = (capitalizedCost - residualValue) / term;
    const avgLoanValue = capitalizedCost + residualValue;
    const monthlyInterest = avgLoanValue * moneyFac;
    const baseMonthlyPayment = depreciationAmount + monthlyInterest;
    const monthlyTax = baseMonthlyPayment * taxRate;
    const monthlyPayment = baseMonthlyPayment + monthlyTax;
    const totalLeaseCost = monthlyPayment * term + downPay + totalFees;
    const buyoutPrice =
      residualValue +
      fees
        .filter((f) => f.name.toLowerCase().includes("disposition"))
        .reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);

    const paymentToMsrpRatio = (monthlyPayment * term) / msrpVal;
    let tips = "";
    if (paymentToMsrpRatio < 0.4) {
      tips = "This lease is cost-effective. Consider negotiating additional perks or shorter terms.";
    } else if (paymentToMsrpRatio < 0.6) {
      tips = "The lease terms are reasonable. Review fees to optimize costs.";
    } else {
      tips =
        "The lease is expensive relative to the vehicle’s value. Consider negotiating a lower price or shorter term.";
    }

    setResults({
      monthlyPayment,
      totalLeaseCost,
      buyoutPrice,
      tips,
      depreciation: depreciationAmount * term,
      interest: monthlyInterest * term,
      taxes: monthlyTax * term,
      fees: totalFees,
      downPayment: downPay,
    });

    costChart.data = {
      labels: ["Depreciation", "Interest", "Taxes", "Fees", "Down Payment"],
      datasets: [
        {
          data: [depreciationAmount * term, monthlyInterest * term, monthlyTax * term, totalFees, downPay],
          backgroundColor: ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6"],
        },
      ],
    };
    costChart.update();
  };

  const saveCalculation = () => {
    const data = { ...formData, fees };
    localStorage.setItem("leaseCalculation", JSON.stringify(data));
    alert("Calculation saved!");
  };

  const loadCalculation = () => {
    const saved = localStorage.getItem("leaseCalculation");
    if (saved) {
      const data = JSON.parse(saved);
      setFormData({
        msrp: data.msrp,
        negotiatedPrice: data.negotiatedPrice,
        downPayment: data.downPayment,
        residualValue: data.residualValue,
        moneyFactor: data.moneyFactor,
        leaseTerm: data.leaseTerm,
        salesTax: data.salesTax,
      });
      setFees(data.fees);
      calculateLease();
    } else {
      alert("No saved calculation found.");
    }
  };

  const exportResults = () => {
    if (!results) return;
    const exportContent = `
Lease Calculator Results
=======================
Monthly Payment: $${results.monthlyPayment.toFixed(2)}
Total Lease Cost: $${results.totalLeaseCost.toFixed(2)}
Buyout Price: $${results.buyoutPrice.toFixed(2)}

Fees:
${fees.map((f) => `- ${f.name}: $${(parseFloat(f.amount) || 0).toFixed(2)}`).join("\n")}

Financial Tips: ${results.tips}
=======================
Generated on: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lease_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Lease Calculator Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text("Results:", 20, 40);
    doc.text(`Monthly Payment: $${results.monthlyPayment.toFixed(2)}`, 20, 50);
    doc.text(`Total Lease Cost: $${results.totalLeaseCost.toFixed(2)}`, 20, 60);
    doc.text(`Buyout Price: $${results.buyoutPrice.toFixed(2)}`, 20, 70);
    doc.text("Fees:", 20, 80);
    let y = 90;
    fees.forEach((fee) => {
      doc.text(`${fee.name}: $${(parseFloat(fee.amount) || 0).toFixed(2)}`, 20, y);
      y += 10;
    });
    doc.text("Financial Tips:", 20, y);
    doc.text(results.tips, 20, y + 10, { maxWidth: 160 });
    doc.save("lease_report.pdf");
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Advanced Lease Calculator</h1>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Lease Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Vehicle MSRP ($)", field: "msrp", placeholder: "e.g., 35000" },
                { label: "Negotiated Price ($)", field: "negotiatedPrice", placeholder: "e.g., 32000" },
                { label: "Down Payment ($)", field: "downPayment", placeholder: "e.g., 2000" },
                { label: "Residual Value (%)", field: "residualValue", placeholder: "e.g., 50" },
                { label: "Money Factor", field: "moneyFactor", step: "0.0001", placeholder: "e.g., 0.002" },
                { label: "Lease Term (Months)", field: "leaseTerm", placeholder: "e.g., 36" },
                { label: "Sales Tax Rate (%)", field: "salesTax", placeholder: "e.g., 7" },
              ].map((item) => (
                <div key={item.label}>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{item.label}</label>
                  <input
                    type="number"
                    value={formData[item.field]}
                    onChange={(e) => updateFormData(item.field, e.target.value)}
                    placeholder={item.placeholder}
                    step={item.step}
                    required={
                      item.field !== "downPayment" &&
                      item.field !== "residualValue" &&
                      item.field !== "moneyFactor" &&
                      item.field !== "leaseTerm" &&
                      item.field !== "salesTax"
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Additional Fees</h2>
            <div className="space-y-4">
              {fees.map((fee, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                  <input
                    type="text"
                    value={fee.name}
                    onChange={(e) => updateFee(index, "name", e.target.value)}
                    placeholder="Fee Name (e.g., Acquisition Fee)"
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    type="number"
                    value={fee.amount}
                    onChange={(e) => updateFee(index, "amount", e.target.value)}
                    placeholder="Amount"
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                  <button
                    onClick={() => removeFee(index)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addFee}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Add Fee
            </button>
          </div>
          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={calculateLease}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate Lease
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
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Monthly Payment</h3>
                  <p className="text-2xl font-bold text-gray-800">${results.monthlyPayment.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Total Lease Cost</h3>
                  <p className="text-2xl font-bold text-gray-800">${results.totalLeaseCost.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Buyout Price</h3>
                  <p className="text-2xl font-bold text-gray-800">${results.buyoutPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
                <canvas ref={costChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Tips</h3>
                <p className="text-gray-600">{results.tips}</p>
              </div>
              <div className="mt-6 flex gap-4 flex-wrap">
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
        .transition-all {
          transition: all 0.3s ease;
        }
        .hover\\:-translate-y-1:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}
