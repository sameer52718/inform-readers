"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default function Home() {
  const [homePrice, setHomePrice] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("30");
  const [fundingFee, setFundingFee] = useState("2.15");
  const [customFee, setCustomFee] = useState("");
  const [isCustomFee, setIsCustomFee] = useState(false);
  const [propertyTax, setPropertyTax] = useState("");
  const [homeInsurance, setHomeInsurance] = useState("");
  const [result, setResult] = useState(null);
  const [amortizationData, setAmortizationData] = useState([]);
  const [pieChartData, setPieChartData] = useState({
    labels: ["Principal & Interest", "Property Tax", "Home Insurance"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ["#3498db", "#e74c3c", "#2ecc71"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  });
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [{ label: "Loan Balance", data: [], borderColor: "#3498db", fill: false, tension: 0.1 }],
  });

  const formatCurrency = (amount) => `$${parseFloat(amount || 0).toFixed(2)}`;

  const handleFundingFeeChange = (value) => {
    setFundingFee(value);
    setIsCustomFee(value === "custom");
  };

  const calculateMortgage = () => {
    const price = parseFloat(homePrice);
    const rate = parseFloat(interestRate) / 100;
    const term = parseInt(loanTerm);
    const fee = isCustomFee ? parseFloat(customFee) : parseFloat(fundingFee);
    const tax = parseFloat(propertyTax) || 0;
    const insurance = parseFloat(homeInsurance) || 0;

    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid home price");
      return;
    }
    if (isNaN(rate) || rate <= 0) {
      alert("Please enter a valid interest rate");
      return;
    }
    if (isCustomFee && (isNaN(fee) || fee < 0)) {
      alert("Please enter a valid custom funding fee rate");
      return;
    }

    const fundingFeeAmount = price * (fee / 100);
    const totalLoan = price + 0;
    const monthlyRate = rate / 12;
    const totalMonths = term * 12;

    const monthlyPI =
      (totalLoan * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const monthlyPayment = monthlyPI + tax / 12 + insurance / 12;

    let balance = totalLoan;
    let totalInterestPaid = 0;
    const newAmortizationData = [];
    for (let month = 1; month <= totalMonths; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPI - interest;
      balance -= principal;
      totalInterestPaid += interest;
      newAmortizationData.push({
        month,
        payment: monthlyPayment,
        principal,
        interest,
        balance: Math.max(balance, 0),
      });
    }

    setResult({
      totalLoan,
      monthlyPayment,
      fundingFeeAmount,
      totalInterest: totalInterestPaid,
    });

    setAmortizationData(newAmortizationData);

    setPieChartData({
      labels: ["Principal & Interest", "Property Tax", "Home Insurance"],
      datasets: [
        {
          data: [monthlyPI, tax / 12, insurance / 12],
          backgroundColor: ["#3498db", "#e74c3c", "#2ecc71"],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    });

    setLineChartData({
      labels: newAmortizationData.map((_, index) => index + 1),
      datasets: [
        {
          label: "Loan Balance",
          data: newAmortizationData.map((item) => item.balance),
          borderColor: "#3498db",
          fill: false,
          tension: 0.1,
        },
      ],
    });
  };

  const exportAmortization = () => {
    if (amortizationData.length === 0) {
      alert("No amortization data to export");
      return;
    }

    const csvContent = [
      "Month,Payment,Principal,Interest,Balance",
      ...amortizationData.map(
        (item) =>
          `${item.month},${item.payment.toFixed(2)},${item.principal.toFixed(2)},${item.interest.toFixed(
            2
          )},${item.balance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "va_mortgage_amortization.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-start">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-7xl w-full flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">VA Mortgage Calculator</h1>
          <div className="space-y-4">
            {[
              {
                label: "Home Price ($)",
                id: "home-price",
                value: homePrice,
                setter: setHomePrice,
                type: "number",
                step: "1000",
              },
              {
                label: "Annual Interest Rate (%)",
                id: "interest-rate",
                value: interestRate,
                setter: setInterestRate,
                type: "number",
                step: "0.01",
              },
              {
                label: "Loan Term (Years)",
                id: "loan-term",
                value: loanTerm,
                setter: setLoanTerm,
                type: "select",
                options: [
                  { value: "30", label: "30 Years" },
                  { value: "15", label: "15 Years" },
                  { value: "20", label: "20 Years" },
                  { value: "10", label: "10 Years" },
                ],
              },
              {
                label: "VA Funding Fee (%)",
                id: "funding-fee",
                value: fundingFee,
                setter: handleFundingFeeChange,
                type: "select",
                options: [
                  { value: "2.15", label: "2.15% (First-time use, 0% down)" },
                  { value: "3.3", label: "3.3% (Subsequent use, 0% down)" },
                  { value: "0.5", label: "0.5% (Cash-out refinance)" },
                  { value: "custom", label: "Custom Rate" },
                ],
              },
              {
                label: "Custom Funding Fee Rate (%)",
                id: "custom-fee",
                value: customFee,
                setter: setCustomFee,
                type: "number",
                step: "0.01",
                hidden: !isCustomFee,
              },
              {
                label: "Annual Property Tax ($)",
                id: "property-tax",
                value: propertyTax,
                setter: setPropertyTax,
                type: "number",
                step: "100",
              },
              {
                label: "Annual Home Insurance ($)",
                id: "home-insurance",
                value: homeInsurance,
                setter: setHomeInsurance,
                type: "number",
                step: "100",
              },
            ].map((field) => (
              <div key={field.id} className={`input-group ${field.hidden ? "hidden" : ""}`}>
                <label htmlFor={field.id} className="block text-sm font-bold text-gray-600 mb-2">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    step={field.step}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                )}
              </div>
            ))}
            <button
              onClick={calculateMortgage}
              className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Calculate Mortgage
            </button>
            {result && (
              <div className="bg-gray-200 p-4 rounded-lg mt-4">
                <p>
                  <strong>Total Loan Amount:</strong> {formatCurrency(result.totalLoan)}
                </p>
                <p>
                  <strong>Monthly Payment:</strong> {formatCurrency(result.monthlyPayment)}
                </p>
                <p>
                  <strong>Funding Fee:</strong> {formatCurrency(result.fundingFeeAmount)}
                </p>
                <p>
                  <strong>Total Interest Paid:</strong> {formatCurrency(result.totalInterest)}
                </p>
              </div>
            )}
            <div className="chart-container mt-4">
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Monthly Payment Breakdown" },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto p-4 bg-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Amortization & History</h1>
          {amortizationData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg mb-4">
              <thead>
                <tr>
                  {["Month", "Payment", "Principal", "Interest", "Balance"].map((header) => (
                    <th key={header} className="p-2 bg-red-500 text-white">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {amortizationData.slice(0, 60).map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-2">{item.month}</td>
                    <td className="p-2">{formatCurrency(item.payment)}</td>
                    <td className="p-2">{formatCurrency(item.principal)}</td>
                    <td className="p-2">{formatCurrency(item.interest)}</td>
                    <td className="p-2">{formatCurrency(item.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="chart-container mt-4">
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: "Balance ($)" } },
                  x: { title: { display: true, text: "Month" } },
                },
                plugins: { title: { display: true, text: "Loan Balance Over Time" } },
              }}
            />
          </div>
          <button
            onClick={exportAmortization}
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-4"
          >
            Export Amortization (CSV)
          </button>
        </div>
      </div>
      <style jsx>{`
        input:focus,
        select:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
        }
        @media (max-width: 768px) {
          .max-h-[700px] {
            max-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}
