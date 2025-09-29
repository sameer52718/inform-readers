"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [fees, setFees] = useState([{ id: 1, name: "", amount: "" }]);
  const [compareRate, setCompareRate] = useState("");
  const [compareTerm, setCompareTerm] = useState("");
  const [results, setResults] = useState(null);
  const costChartRef = useRef(null);
  const costChartInstance = useRef(null);

  useEffect(() => {
    const loadChartJs = async () => {
      const Chart = (await import("chart.js")).default;
      Chart.register(...(await import("chart.js")).registerables);

      if (costChartRef.current) {
        costChartInstance.current = new Chart(costChartRef.current, {
          type: "pie",
          data: {
            labels: ["Principal", "Interest", "Fees"],
            datasets: [
              {
                data: [0, 0, 0],
                backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Loan Cost Breakdown" },
            },
          },
        });
      }
    };
    loadChartJs();
    return () => {
      if (costChartInstance.current) costChartInstance.current.destroy();
    };
  }, []);

  const addFee = () => {
    setFees([...fees, { id: fees.length + 1, name: "", amount: "" }]);
  };

  const removeFee = (id) => {
    if (fees.length > 1) {
      setFees(fees.filter((fee) => fee.id !== id));
    }
  };

  const updateFee = (id, field, value) => {
    setFees(fees.map((fee) => (fee.id === id ? { ...fee, [field]: value } : fee)));
  };

  const calculateMonthlyPayment = (loanAmount, monthlyRate, termMonths) => {
    return (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
    );
  };

  const calculateAPRValue = (loanAmount, fees, monthlyPayment, termMonths) => {
    const maxIterations = 1000;
    const tolerance = 0.0001;
    let guess = 0.05 / 12;

    for (let i = 0; i < maxIterations; i++) {
      let pv = -loanAmount - fees;
      let derivative = 0;

      for (let t = 1; t <= termMonths; t++) {
        pv += monthlyPayment / Math.pow(1 + guess, t);
        derivative -= (t * monthlyPayment) / Math.pow(1 + guess, t + 1);
      }

      if (Math.abs(pv) < tolerance) {
        return guess * 12 * 100;
      }

      const newGuess = guess - pv / derivative;
      if (Math.abs(newGuess - guess) < tolerance) {
        return guess * 12 * 100;
      }
      guess = newGuess;
    }

    return NaN;
  };

  const calculateAPR = () => {
    const parsedLoanAmount = parseFloat(loanAmount) || 0;
    const parsedInterestRate = parseFloat(interestRate) || 0;
    const parsedTermMonths = parseInt(loanTerm) || 0;
    const parsedCompareRate = parseFloat(compareRate) || parsedInterestRate;
    const parsedCompareTerm = parseInt(compareTerm) || parsedTermMonths;

    if (parsedLoanAmount <= 0 || parsedInterestRate <= 0 || parsedTermMonths <= 0) {
      alert("Please provide valid loan amount, interest rate, and term.");
      return;
    }

    const monthlyRate = parsedInterestRate / 100 / 12;
    const monthlyPayment = calculateMonthlyPayment(parsedLoanAmount, monthlyRate, parsedTermMonths);
    const totalFees = fees.reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);
    const apr = calculateAPRValue(parsedLoanAmount, totalFees, monthlyPayment, parsedTermMonths);
    const totalPayments = monthlyPayment * parsedTermMonths;
    const totalInterest = totalPayments - parsedLoanAmount;
    const totalCost = totalPayments + totalFees;

    let balance = parsedLoanAmount;
    const amortization = [];
    for (let month = 1; month <= parsedTermMonths; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
      amortization.push({
        month,
        payment: monthlyPayment.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance: Math.max(balance, 0).toFixed(2),
      });
    }

    let comparisonText = "";
    if (parsedCompareRate !== parsedInterestRate || parsedCompareTerm !== parsedTermMonths) {
      const compareMonthlyRate = parsedCompareRate / 100 / 12;
      const compareMonthlyPayment = calculateMonthlyPayment(
        parsedLoanAmount,
        compareMonthlyRate,
        parsedCompareTerm
      );
      const compareTotalPayments = compareMonthlyPayment * parsedCompareTerm;
      const compareTotalInterest = compareTotalPayments - parsedLoanAmount;
      const compareAPR = calculateAPRValue(
        parsedLoanAmount,
        totalFees,
        compareMonthlyPayment,
        parsedCompareTerm
      );
      comparisonText = `
        Alternative Loan (Rate: ${parsedCompareRate}%, Term: ${parsedCompareTerm} months):
        - APR: ${isNaN(compareAPR) ? "Non-converging" : compareAPR.toFixed(2)}%
        - Monthly Payment: $${compareMonthlyPayment.toFixed(2)}
        - Total Interest: $${compareTotalInterest.toFixed(2)}
        - Total Cost: $${(compareTotalPayments + totalFees).toFixed(2)}
      `;
    }

    const affordabilityRatio = monthlyPayment / (parsedLoanAmount / parsedTermMonths);
    let analysis = "";
    if (isNaN(apr)) {
      analysis = "The APR could not be calculated. Ensure all inputs are valid.";
    } else if (apr <= 5) {
      analysis = `The APR (${apr.toFixed(
        2
      )}%) is low, indicating a cost-effective loan. Ensure the monthly payment ($${monthlyPayment.toFixed(
        2
      )}) fits your budget.`;
    } else if (apr <= 10) {
      analysis = `The APR (${apr.toFixed(
        2
      )}%) is moderate. Compare other loan options to reduce costs, and verify affordability of $${monthlyPayment.toFixed(
        2
      )}/month.`;
    } else {
      analysis = `The APR (${apr.toFixed(
        2
      )}%) is high, increasing the loan's cost. Consider shorter terms or lower rates to save on interest.`;
    }

    setResults({
      apr: isNaN(apr) ? "Non-converging" : `${apr.toFixed(2)}%`,
      totalInterest: totalInterest.toFixed(2),
      totalCost: totalCost.toFixed(2),
      monthlyPayment: monthlyPayment.toFixed(2),
      amortization,
      comparisonText,
      analysis,
    });

    if (costChartInstance.current) {
      costChartInstance.current.data.datasets[0].data = [parsedLoanAmount, totalInterest, totalFees];
      costChartInstance.current.update();
    }
  };

  const saveCalculation = () => {
    const data = {
      loanAmount,
      interestRate,
      loanTerm,
      compareRate,
      compareTerm,
      fees,
    };
    localStorage.setItem("aprCalculation", JSON.stringify(data));
    alert("Calculation saved!");
  };

  const loadCalculation = () => {
    const saved = localStorage.getItem("aprCalculation");
    if (saved) {
      const data = JSON.parse(saved);
      setLoanAmount(data.loanAmount);
      setInterestRate(data.interestRate);
      setLoanTerm(data.loanTerm);
      setCompareRate(data.compareRate);
      setCompareTerm(data.compareTerm);
      setFees(data.fees);
      calculateAPR();
    } else {
      alert("TNo saved calculation found.");
    }
  };

  const exportResults = () => {
    if (!results) {
      alert("Please calculate APR first.");
      return;
    }

    const exportContent = `
APR Calculator Results
=====================
Annual Percentage Rate: ${results.apr}
Total Interest Paid: $${results.totalInterest}
Total Loan Cost: $${results.totalCost}
Monthly Payment: $${results.monthlyPayment}

Loan Details:
- Loan Amount: $${loanAmount}
- Nominal Interest Rate: ${interestRate}%
- Loan Term: ${loanTerm} months

Additional Fees:
${fees.map((f) => `- ${f.name}: $${parseFloat(f.amount || 0).toFixed(2)}`).join("\n")}

Amortization Schedule:
${results.amortization
  .map(
    (a) =>
      `Month ${a.month}: Payment $${a.payment}, Principal $${a.principal}, Interest $${a.interest}, Balance $${a.balance}`
  )
  .join("\n")}

Loan Comparison:
${results.comparisonText || "No comparison provided."}

Affordability Analysis: ${results.analysis}
=====================
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apr_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    if (!results) {
      alert("Please calculate APR first.");
      return;
    }

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("APR Calculator Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text("Results:", 20, 40);
    doc.text(`Annual Percentage Rate: ${results.apr}`, 20, 50);
    doc.text(`Total Interest Paid: $${results.totalInterest}`, 20, 60);
    doc.text(`Total Loan Cost: $${results.totalCost}`, 20, 70);
    doc.text(`Monthly Payment: $${results.monthlyPayment}`, 20, 80);
    doc.text("Loan Details:", 20, 90);
    doc.text(`Loan Amount: $${loanAmount}`, 20, 100);
    doc.text(`Nominal Interest Rate: ${interestRate}%`, 20, 110);
    doc.text(`Loan Term: ${loanTerm} months`, 20, 120);
    doc.text("Additional Fees:", 20, 130);
    let y = 140;
    fees.forEach((fee) => {
      doc.text(`${fee.name}: $${parseFloat(fee.amount || 0).toFixed(2)}`, 20, y);
      y += 10;
    });
    doc.text("Amortization Schedule:", 20, y);
    y += 10;
    results.amortization.slice(0, 10).forEach((row) => {
      doc.text(
        `Month ${row.month}: Payment $${row.payment}, Principal $${row.principal}, Interest $${row.interest}, Balance $${row.balance}`,
        20,
        y
      );
      y += 10;
    });
    doc.text("Loan Comparison:", 20, y);
    doc.text(results.comparisonText || "No comparison provided.", 20, y + 10, {
      maxWidth: 160,
    });
    y += 30;
    doc.text("Affordability Analysis:", 20, y);
    doc.text(results.analysis, 20, y + 10, { maxWidth: 160 });
    doc.save("apr_report.pdf");
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-red-500 mb-8">Advanced APR Calculator</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Loan Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Loan Amount ($)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="e.g., 10000"
                required
                className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Nominal Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 5"
                required
                className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Loan Term (Months)</label>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="e.g., 36"
                required
                className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Additional Fees</h2>
          <div className="space-y-4">
            {fees.map((fee) => (
              <div
                key={fee.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-[fadeIn_0.5s_ease-out]"
              >
                <input
                  type="text"
                  value={fee.name}
                  onChange={(e) => updateFee(fee.id, "name", e.target.value)}
                  placeholder="Fee Name (e.g., Origination)"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <input
                  type="number"
                  value={fee.amount}
                  onChange={(e) => updateFee(fee.id, "amount", e.target.value)}
                  placeholder="Amount ($)"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <button
                  onClick={() => removeFee(fee.id)}
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
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Compare Loan Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Alternative Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={compareRate}
                onChange={(e) => setCompareRate(e.target.value)}
                placeholder="e.g., 4.5"
                className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Alternative Term (Months)
              </label>
              <input
                type="number"
                value={compareTerm}
                onChange={(e) => setCompareTerm(e.target.value)}
                placeholder="e.g., 48"
                className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 mb-8">
          <button
            onClick={calculateAPR}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Calculate APR
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-red-500">Annual Percentage Rate (APR)</h3>
                <p className="text-2xl font-bold text-gray-800">{results.apr}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-500">Total Interest Paid</h3>
                <p className="text-2xl font-bold text-gray-800">${results.totalInterest}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-500">Total Loan Cost</h3>
                <p className="text-2xl font-bold text-gray-800">${results.totalCost}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-red-500 mb-4">Monthly Payment</h3>
              <p className="text-xl text-gray-600">${results.monthlyPayment}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-red-500 mb-4">Loan Cost Breakdown</h3>
              <canvas ref={costChartRef} className="max-h-80"></canvas>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-red-500 mb-4">Amortization Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Month</th>
                      <th className="p-2">Payment</th>
                      <th className="p-2">Principal</th>
                      <th className="p-2">Interest</th>
                      <th className="p-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.amortization.map((row, i) => (
                      <tr key={i} className="border-b border-gray-300">
                        <td className="p-2">{row.month}</td>
                        <td className="p-2">${row.payment}</td>
                        <td className="p-2">${row.principal}</td>
                        <td className="p-2">${row.interest}</td>
                        <td className="p-2">${row.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-red-500 mb-4">Loan Comparison</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {results.comparisonText || "No comparison provided."}
              </p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-red-500 mb-4">Loan Affordability Analysis</h3>
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
        .animate-\[fadeIn_0\.5s_ease-out\] {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
