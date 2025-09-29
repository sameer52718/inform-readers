"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [formData, setFormData] = useState({
    calculationType: "single",
    futureValue: "",
    interestRate: "",
    periods: "",
    compounding: "annually",
    annuityType: "ordinary",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [sensitivityData, setSensitivityData] = useState([]);
  const cashFlowChartRef = useRef(null);
  const sensitivityChartRef = useRef(null);
  let cashFlowChart, sensitivityChart;

  useEffect(() => {
    if (cashFlowChartRef.current) {
      cashFlowChart = new Chart(cashFlowChartRef.current, {
        type: "bar",
        data: {
          labels: ["Present Value", "Future Value"],
          datasets: [
            {
              label: "Amount ($)",
              data: [0, 0],
              backgroundColor: ["#3498db", "#e74c3c"],
              borderColor: "#fff",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true, title: { display: true, text: "Amount ($)" } } },
          plugins: { title: { display: true, text: "Present vs Future Value" } },
        },
      });
    }
    if (sensitivityChartRef.current) {
      sensitivityChart = new Chart(sensitivityChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Present Value ($)",
              data: [],
              borderColor: "#2ecc71",
              fill: false,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Present Value ($)" } },
            x: { title: { display: true, text: "Interest Rate (%)" } },
          },
          plugins: { title: { display: true, text: "Sensitivity Analysis" } },
        },
      });
    }
    return () => {
      cashFlowChart?.destroy();
      sensitivityChart?.destroy();
    };
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;

  const calculatePV = () => {
    const { calculationType, futureValue, interestRate, periods, compounding, annuityType } = formData;
    const fv = parseFloat(futureValue);
    const rate = parseFloat(interestRate) / 100;
    const nPeriods = parseInt(periods);

    if (isNaN(fv) || fv <= 0) {
      alert("Please enter a valid future value");
      return;
    }
    if (isNaN(rate) || rate < 0) {
      alert("Please enter a valid interest rate");
      return;
    }
    if (isNaN(nPeriods) || nPeriods <= 0) {
      alert("Please enter a valid number of periods");
      return;
    }

    const compoundingPeriods = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
    const n = compoundingPeriods[compounding];
    const totalPeriods = nPeriods * n;
    const ratePerPeriod = rate / n;

    let pv;
    if (calculationType === "single") {
      pv = fv / Math.pow(1 + ratePerPeriod, totalPeriods);
    } else {
      if (annuityType === "ordinary") {
        pv = (fv * (1 - Math.pow(1 + ratePerPeriod, -totalPeriods))) / ratePerPeriod;
      } else {
        pv = ((fv * (1 - Math.pow(1 + ratePerPeriod, -totalPeriods))) / ratePerPeriod) * (1 + ratePerPeriod);
      }
    }

    const effectiveRate = (Math.pow(1 + ratePerPeriod, n) - 1) * 100;

    const newSensitivityData = [];
    for (let delta = -2; delta <= 2; delta += 0.5) {
      const newRate = rate + delta / 100;
      if (newRate < 0) continue;
      let newPV;
      if (calculationType === "single") {
        newPV = fv / Math.pow(1 + newRate / n, totalPeriods);
      } else {
        if (annuityType === "ordinary") {
          newPV = (fv * (1 - Math.pow(1 + newRate / n, -totalPeriods))) / (newRate / n);
        } else {
          newPV = ((fv * (1 - Math.pow(1 + newRate / n, -totalPeriods))) / (newRate / n)) * (1 + newRate / n);
        }
      }
      newSensitivityData.push({ rate: newRate * 100, pv: newPV });
    }

    setResults({ presentValue: pv, effectiveRate });
    setSensitivityData(newSensitivityData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      type: calculationType === "single" ? "Single Cash Flow" : `Annuity (${annuityType})`,
      futureValue: formatCurrency(fv),
      interestRate: `${(rate * 100).toFixed(2)}%`,
      periods: nPeriods,
      compounding,
      presentValue: formatCurrency(pv),
      effectiveRate: `${effectiveRate.toFixed(2)}%`,
    };
    setHistory([...history, calculation]);

    cashFlowChart.data.datasets[0].data = [pv, fv];
    cashFlowChart.update();

    sensitivityChart.data.labels = newSensitivityData.map((item) => item.rate.toFixed(2));
    sensitivityChart.data.datasets[0].data = newSensitivityData.map((item) => item.pv);
    sensitivityChart.update();
  };

  const exportHistory = () => {
    if (history.length === 0) {
      alert("No history to export");
      return;
    }

    const csvContent = [
      "Date,Type,Future Value,Interest Rate,Periods,Compounding,Present Value,Effective Rate",
      ...history.map(
        (item) =>
          `"${item.timestamp}","${item.type}","${item.futureValue}","${item.interestRate}",${item.periods},"${item.compounding}","${item.presentValue}","${item.effectiveRate}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pv_calculation_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white  flex justify-center items-center p-5">
        <div className="bg-gray-100 rounded-3xl shadow-xl p-8 max-w-5xl w-full flex gap-8 max-md:flex-col">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">Present Value Calculator</h1>
            <div className="mb-5">
              <label className="block mb-2 text-gray-700 font-medium">Calculation Type</label>
              <select
                value={formData.calculationType}
                onChange={(e) => updateFormData("calculationType", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring focus:ring-red-200"
              >
                <option value="single">Single Cash Flow</option>
                <option value="annuity">Annuity</option>
              </select>
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-gray-700 font-medium">Future Value ($)</label>
              <input
                type="number"
                value={formData.futureValue}
                onChange={(e) => updateFormData("futureValue", e.target.value)}
                placeholder="Enter future value or payment"
                step="100"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring focus:ring-red-200"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-gray-700 font-medium">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={formData.interestRate}
                onChange={(e) => updateFormData("interestRate", e.target.value)}
                placeholder="Enter interest rate"
                step="0.01"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring focus:ring-red-200"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-gray-700 font-medium">Number of Periods</label>
              <input
                type="number"
                value={formData.periods}
                onChange={(e) => updateFormData("periods", e.target.value)}
                placeholder="Enter number of periods"
                step="1"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring focus:ring-red-200"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-gray-700 font-medium">Compounding Frequency</label>
              <select
                value={formData.compounding}
                onChange={(e) => updateFormData("compounding", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring focus:ring-red-200"
              >
                <option value="annually">Annually</option>
                <option value="semi-annually">Semi-Annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className={`mb-5 ${formData.calculationType === "annuity" ? "" : "hidden"}`}>
              <label className="block mb-2 text-gray-700 font-medium">Annuity Type</label>
              <select
                value={formData.annuityType}
                onChange={(e) => updateFormData("annuityType", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring focus:ring-red-200"
              >
                <option value="ordinary">Ordinary (End of Period)</option>
                <option value="due">Due (Beginning of Period)</option>
              </select>
            </div>
            <button
              onClick={calculatePV}
              className="bg-red-500 text-white w-full p-3 rounded-lg hover:bg-red-600"
            >
              Calculate Present Value
            </button>
            {results && (
              <div className="bg-gray-200 p-5 rounded-lg mt-5">
                <p>
                  <strong>Present Value:</strong> {formatCurrency(results.presentValue)}
                </p>
                <p>
                  <strong>Effective Annual Rate:</strong> {results.effectiveRate.toFixed(2)}%
                </p>
              </div>
            )}
            <div className="mt-5">
              <canvas ref={cashFlowChartRef} />
            </div>
          </div>
          <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-200 rounded-lg max-md:max-h-[500px]">
            <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">
              History & Sensitivity Analysis
            </h1>
            <div>
              {history.map((item, index) => (
                <div key={index} className="bg-white p-4 mb-3 rounded-lg shadow-sm">
                  <p>
                    <strong>Date:</strong> {item.timestamp}
                  </p>
                  <p>
                    <strong>Type:</strong> {item.type}
                  </p>
                  <p>
                    <strong>Future Value:</strong> {item.futureValue}
                  </p>
                  <p>
                    <strong>Interest Rate:</strong> {item.interestRate}
                  </p>
                  <p>
                    <strong>Periods:</strong> {item.periods}
                  </p>
                  <p>
                    <strong>Compounding:</strong> {item.compounding}
                  </p>
                  <p>
                    <strong>Present Value:</strong> {item.presentValue}
                  </p>
                  <p>
                    <strong>Effective Rate:</strong> {item.effectiveRate}
                  </p>
                </div>
              ))}
            </div>
            <table
              className={`w-full border-collapse mt-5 bg-white rounded-lg overflow-hidden ${
                sensitivityData.length ? "" : "hidden"
              }`}
            >
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3 text-right">Interest Rate (%)</th>
                  <th className="p-3 text-right">Present Value ($)</th>
                </tr>
              </thead>
              <tbody>
                {sensitivityData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="p-3 text-right">{item.rate.toFixed(2)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.pv)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-5">
              <canvas ref={sensitivityChartRef} />
            </div>
            <button
              onClick={exportHistory}
              className="bg-[#2ecc71] text-white w-full p-3 rounded-lg hover:bg-[#27ae60] mt-5"
            >
              Export History (CSV)
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
