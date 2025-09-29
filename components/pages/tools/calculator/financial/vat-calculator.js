"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default function Home() {
  const [amount, setAmount] = useState("");
  const [vatRate, setVatRate] = useState("20");
  const [customVat, setCustomVat] = useState("");
  const [isCustomVat, setIsCustomVat] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [calculationType, setCalculationType] = useState("exclusive");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [pieChartData, setPieChartData] = useState({
    labels: ["Net Amount", "VAT Amount"],
    datasets: [
      { data: [0, 0], backgroundColor: ["#3498db", "#e74c3c"], borderColor: "#fff", borderWidth: 2 },
    ],
  });
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      { label: "Total Amount", data: [], backgroundColor: "#2ecc71", borderColor: "#27ae60", borderWidth: 1 },
    ],
  });

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", EUR: "€", GBP: "£", INR: "₹" };
    return `${symbols[curr]}${parseFloat(amount || 0).toFixed(2)}`;
  };

  const stripCurrency = (amount) => parseFloat(amount.replace(/[^0-9.]/g, ""));

  const handleVatRateChange = (value) => {
    setVatRate(value);
    setIsCustomVat(value === "custom");
  };

  const calculateVAT = () => {
    const inputAmount = parseFloat(amount);
    const rate = isCustomVat ? parseFloat(customVat) : parseFloat(vatRate);

    if (isNaN(inputAmount)) {
      alert("Please enter a valid amount");
      return;
    }
    if (isCustomVat && (isNaN(rate) || rate < 0)) {
      alert("Please enter a valid custom VAT rate");
      return;
    }

    let netAmount, vatAmount, totalAmount;
    if (calculationType === "exclusive") {
      netAmount = inputAmount;
      vatAmount = (inputAmount * rate) / 100;
      totalAmount = inputAmount + vatAmount;
    } else {
      totalAmount = inputAmount;
      netAmount = inputAmount / (1 + rate / 100);
      vatAmount = inputAmount - netAmount;
    }

    setResult({
      netAmount,
      vatAmount,
      totalAmount,
    });

    const calculation = {
      timestamp: new Date().toLocaleString(),
      amount: formatCurrency(inputAmount, currency),
      vatRate: `${rate}%`,
      calcType: calculationType === "exclusive" ? "VAT Exclusive" : "VAT Inclusive",
      netAmount: formatCurrency(netAmount, currency),
      vatAmount: formatCurrency(vatAmount, currency),
      totalAmount: formatCurrency(totalAmount, currency),
    };

    setHistory([...history, calculation]);

    setPieChartData({
      labels: ["Net Amount", "VAT Amount"],
      datasets: [
        {
          data: [netAmount, vatAmount],
          backgroundColor: ["#3498db", "#e74c3c"],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    });

    setBarChartData({
      labels: [...history, calculation].map((item) => item.timestamp),
      datasets: [
        {
          label: "Total Amount",
          data: [...history, calculation].map((item) => stripCurrency(item.totalAmount)),
          backgroundColor: "#2ecc71",
          borderColor: "#27ae60",
          borderWidth: 1,
        },
      ],
    });
  };

  const exportHistory = () => {
    if (history.length === 0) {
      alert("No history to export");
      return;
    }

    const csvContent = [
      "Date,Input Amount,VAT Rate,Type,Net Amount,VAT Amount,Total Amount",
      ...history.map(
        (item) =>
          `"${item.timestamp}","${item.amount}","${item.vatRate}","${item.calcType}","${item.netAmount}","${item.vatAmount}","${item.totalAmount}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vat_calculation_history.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-start">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-5xl w-full flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Advanced VAT Calculator</h1>
          <div className="space-y-4">
            {[
              {
                label: "Amount",
                id: "amount",
                value: amount,
                setter: setAmount,
                type: "number",
                step: "0.01",
              },
              {
                label: "VAT Rate (%)",
                id: "vat-rate",
                value: vatRate,
                setter: handleVatRateChange,
                type: "select",
                options: [
                  { value: "20", label: "20% (Standard)" },
                  { value: "5", label: "5% (Reduced)" },
                  { value: "0", label: "0% (Exempt)" },
                  { value: "custom", label: "Custom Rate" },
                ],
              },
              {
                label: "Custom VAT Rate (%)",
                id: "custom-vat",
                value: customVat,
                setter: setCustomVat,
                type: "number",
                step: "0.01",
                hidden: !isCustomVat,
              },
              {
                label: "Currency",
                id: "currency",
                value: currency,
                setter: setCurrency,
                type: "select",
                options: [
                  { value: "USD", label: "$ USD" },
                  { value: "EUR", label: "€ EUR" },
                  { value: "GBP", label: "£ GBP" },
                  { value: "INR", label: "₹ INR" },
                ],
              },
              {
                label: "Calculation Type",
                id: "calculation-type",
                value: calculationType,
                setter: setCalculationType,
                type: "select",
                options: [
                  { value: "exclusive", label: "VAT Exclusive (Add VAT)" },
                  { value: "inclusive", label: "VAT Inclusive (Extract VAT)" },
                ],
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
              onClick={calculateVAT}
              className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Calculate VAT
            </button>
            {result && (
              <div className="bg-gray-200 p-4 rounded-lg mt-4">
                <p>
                  <strong>Net Amount:</strong> {formatCurrency(result.netAmount)}
                </p>
                <p>
                  <strong>VAT Amount:</strong> {formatCurrency(result.vatAmount)}
                </p>
                <p>
                  <strong>Total Amount:</strong> {formatCurrency(result.totalAmount)}
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
                    title: { display: true, text: "Current Calculation Breakdown" },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 max-h-[600px] overflow-y-auto p-4 bg-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Calculation History</h1>
          {history.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-lg mb-4 shadow">
              <p>
                <strong>Date:</strong> {item.timestamp}
              </p>
              <p>
                <strong>Input Amount:</strong> {item.amount}
              </p>
              <p>
                <strong>VAT Rate:</strong> {item.vatRate}
              </p>
              <p>
                <strong>Type:</strong> {item.calcType}
              </p>
              <p>
                <strong>Net:</strong> {item.netAmount}
              </p>
              <p>
                <strong>VAT:</strong> {item.vatAmount}
              </p>
              <p>
                <strong>Total:</strong> {item.totalAmount}
              </p>
            </div>
          ))}
          <div className="chart-container mt-4">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: "Amount" } },
                  x: { title: { display: true, text: "Calculation Date" } },
                },
                plugins: { title: { display: true, text: "Calculation History" } },
              }}
            />
          </div>
          <button
            onClick={exportHistory}
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-4"
          >
            Export History (CSV)
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
          .max-h-[600px] {
            max-height: 400px;
          }
        }
      `}</style>
    </div>
  );
}
