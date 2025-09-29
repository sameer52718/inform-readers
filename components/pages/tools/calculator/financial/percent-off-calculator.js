"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [formData, setFormData] = useState({
    originalPrice: "",
    taxRate: "",
    currency: "USD",
  });
  const [discounts, setDiscounts] = useState([{ value: "" }]);
  const [history, setHistory] = useState([]);
  const [results, setResults] = useState(null);
  const priceBreakdownChartRef = useRef(null);
  const savingsTrendChartRef = useRef(null);
  let priceBreakdownChart, savingsTrendChart;

  useEffect(() => {
    if (priceBreakdownChartRef.current) {
      priceBreakdownChart = new Chart(priceBreakdownChartRef.current, {
        type: "pie",
        data: {
          labels: ["Discounted Price", "Discount Amount", "Tax Amount"],
          datasets: [
            {
              data: [0, 0, 0],
              backgroundColor: ["#3498db", "#e74c3c", "#2ecc71"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Price Breakdown" } },
        },
      });
    }
    if (savingsTrendChartRef.current) {
      savingsTrendChart = new Chart(savingsTrendChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Total Savings ($)",
              data: [],
              borderColor: "#3498db",
              fill: false,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Savings ($)" } },
            x: { title: { display: true, text: "Calculation" } },
          },
          plugins: { title: { display: true, text: "Savings Trend Over Time" } },
        },
      });
    }
    return () => {
      priceBreakdownChart?.destroy();
      savingsTrendChart?.destroy();
    };
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addDiscount = () => {
    setDiscounts([...discounts, { value: "" }]);
  };

  const removeDiscount = (index) => {
    if (discounts.length > 1) {
      setDiscounts(discounts.filter((_, i) => i !== index));
    }
  };

  const updateDiscount = (index, value) => {
    const newDiscounts = [...discounts];
    newDiscounts[index].value = value;
    setDiscounts(newDiscounts);
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency]}${parseFloat(amount).toFixed(2)}`;
  };

  const calculatePercentOff = () => {
    const originalPrice = parseFloat(formData.originalPrice);
    const taxRate = parseFloat(formData.taxRate) || 0;
    const currency = formData.currency;

    if (isNaN(originalPrice) || originalPrice <= 0) {
      alert("Please enter a valid original price");
      return;
    }

    const discountValues = discounts.map((d) => {
      const value = parseFloat(d.value);
      if (isNaN(value) || value < 0 || value > 100) {
        alert("Please enter valid discount percentages (0-100)");
        throw new Error("Invalid discount");
      }
      return value;
    });

    let currentPrice = originalPrice;
    let totalDiscount = 0;
    discountValues.forEach((discount) => {
      const discountAmount = currentPrice * (discount / 100);
      totalDiscount += discountAmount;
      currentPrice -= discountAmount;
    });

    const discountedPrice = currentPrice;
    const taxAmount = discountedPrice * (taxRate / 100);
    const finalPrice = discountedPrice + taxAmount;
    const totalSavings = originalPrice - discountedPrice;

    const calculation = {
      timestamp: new Date().toLocaleString(),
      originalPrice: formatCurrency(originalPrice, currency),
      discounts: discountValues.map((d) => `${d}%`).join(", "),
      taxRate: `${taxRate}%`,
      discountedPrice: formatCurrency(discountedPrice, currency),
      taxAmount: formatCurrency(taxAmount, currency),
      finalPrice: formatCurrency(finalPrice, currency),
      totalSavings: formatCurrency(totalSavings, currency),
      rawSavings: totalSavings,
    };

    setResults({
      originalPrice,
      totalDiscount,
      discountedPrice,
      taxAmount,
      finalPrice,
      totalSavings,
    });

    setHistory([...history, calculation]);

    priceBreakdownChart.data.datasets[0].data = [discountedPrice, totalDiscount, taxAmount];
    priceBreakdownChart.update();

    savingsTrendChart.data.labels = history.map((_, index) => `Calc ${index + 1}`);
    savingsTrendChart.data.datasets[0].data = [...history, calculation].map((item) =>
      parseFloat(item.totalSavings.replace(/[^0-9.]/g, ""))
    );
    savingsTrendChart.update();
  };

  const exportHistory = () => {
    if (history.length === 0) {
      alert("No history to export");
      return;
    }

    const csvContent = [
      "Date,Original Price,Discounts,Tax Rate,Discounted Price,Tax Amount,Final Price,Total Savings",
      ...history.map(
        (item) =>
          `"${item.timestamp}","${item.originalPrice}","${item.discounts}","${item.taxRate}","${item.discountedPrice}","${item.taxAmount}","${item.finalPrice}","${item.totalSavings}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "percent_off_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white  flex justify-center items-center p-5">
        <div className="bg-gray-100 rounded-3xl shadow-xl p-8 max-w-5xl w-full flex gap-8 max-md:flex-col">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">Percent Off Calculator</h1>
            <div className="mb-5">
              <label className="block mb-2 text-gray-700 font-medium">Original Price ($)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => updateFormData("originalPrice", e.target.value)}
                placeholder="Enter original price"
                step="0.01"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring focus:ring-red-200"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-gray-700 font-medium">Discounts (%)</label>
              <div>
                {discounts.map((discount, index) => (
                  <div key={index} className="flex gap-3 mb-3 items-center">
                    <input
                      type="number"
                      value={discount.value}
                      onChange={(e) => updateDiscount(index, e.target.value)}
                      placeholder="Enter discount percentage"
                      step="0.01"
                      required
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring focus:ring-red-200"
                    />
                    <button
                      onClick={() => removeDiscount(index)}
                      className={`bg-[#e74c3c] text-white p-2 rounded-lg hover:bg-[#c0392b] ${
                        discounts.length > 1 ? "" : "hidden"
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addDiscount}
                  className="bg-red-500 text-white w-full p-3 rounded-lg hover:bg-red-600 mt-2"
                >
                  Add Another Discount
                </button>
              </div>
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-gray-700 font-medium">Tax Rate (%)</label>
              <input
                type="number"
                value={formData.taxRate}
                onChange={(e) => updateFormData("taxRate", e.target.value)}
                placeholder="Enter tax rate (e.g., 13 for HST)"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring focus:ring-red-200"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-gray-700 font-medium">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => updateFormData("currency", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring focus:ring-red-200"
              >
                <option value="USD">$ USD</option>
                <option value="CAD">$ CAD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>
            <button
              onClick={calculatePercentOff}
              className="bg-red-500 text-white w-full p-3 rounded-lg hover:bg-red-600"
            >
              Calculate
            </button>
            {results && (
              <div className="bg-gray-200 p-5 rounded-lg mt-5">
                <p>
                  <strong>Original Price:</strong> {formatCurrency(results.originalPrice, formData.currency)}
                </p>
                <p>
                  <strong>Total Discount:</strong> {formatCurrency(results.totalDiscount, formData.currency)}
                </p>
                <p>
                  <strong>Discounted Price:</strong>{" "}
                  {formatCurrency(results.discountedPrice, formData.currency)}
                </p>
                <p>
                  <strong>Tax Amount:</strong> {formatCurrency(results.taxAmount, formData.currency)}
                </p>
                <p>
                  <strong>Final Price:</strong> {formatCurrency(results.finalPrice, formData.currency)}
                </p>
                <p>
                  <strong>Total Savings:</strong> {formatCurrency(results.totalSavings, formData.currency)}
                </p>
              </div>
            )}
            <div className="mt-5">
              <canvas ref={priceBreakdownChartRef} />
            </div>
          </div>
          <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-200 rounded-lg max-md:max-h-[500px]">
            <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">Calculation History</h1>
            <div>
              {history.map((item, index) => (
                <div key={index} className="bg-white p-4 mb-3 rounded-lg shadow-sm">
                  <p>
                    <strong>Date:</strong> {item.timestamp}
                  </p>
                  <p>
                    <strong>Original Price:</strong> {item.originalPrice}
                  </p>
                  <p>
                    <strong>Discounts:</strong> {item.discounts}
                  </p>
                  <p>
                    <strong>Tax Rate:</strong> {item.taxRate}
                  </p>
                  <p>
                    <strong>Discounted Price:</strong> {item.discountedPrice}
                  </p>
                  <p>
                    <strong>Tax Amount:</strong> {item.taxAmount}
                  </p>
                  <p>
                    <strong>Final Price:</strong> {item.finalPrice}
                  </p>
                  <p>
                    <strong>Total Savings:</strong> {item.totalSavings}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <canvas ref={savingsTrendChartRef} />
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
