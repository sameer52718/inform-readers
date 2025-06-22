"use client";

import { useState } from "react";

export default function Home() {
  const [taxRate, setTaxRate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [items, setItems] = useState([{ name: "", price: "", quantity: "1", discount: "", exempt: "no" }]);
  const [result, setResult] = useState(null);
  const [breakdownData, setBreakdownData] = useState([]);
  const [history, setHistory] = useState([]);

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[curr]}${parseFloat(amount || 0).toFixed(2)}`;
  };

  const addItemRow = () => {
    setItems([...items, { name: "", price: "", quantity: "1", discount: "", exempt: "no" }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateSalesTax = () => {
    const taxRateValue = parseFloat(taxRate) / 100;
    if (isNaN(taxRateValue) || taxRateValue < 0) {
      alert("Please enter a valid tax rate");
      return;
    }

    let subtotal = 0;
    let totalDiscounts = 0;
    let taxableAmount = 0;
    let salesTax = 0;
    let totalAmount = 0;
    const newBreakdownData = [];

    items.forEach((item) => {
      const name = item.name || "Unnamed Item";
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      const discount = parseFloat(item.discount) / 100 || 0;
      const exempt = item.exempt === "yes";

      if (price <= 0 || quantity <= 0) return;

      const itemSubtotal = price * quantity;
      const itemDiscount = itemSubtotal * discount;
      const itemTaxable = exempt ? 0 : itemSubtotal - itemDiscount;
      const itemTax = itemTaxable * taxRateValue;
      const itemTotal = itemSubtotal - itemDiscount + itemTax;

      subtotal += itemSubtotal;
      totalDiscounts += itemDiscount;
      taxableAmount += itemTaxable;
      salesTax += itemTax;
      totalAmount += itemTotal;

      newBreakdownData.push({
        name,
        price: itemSubtotal,
        quantity,
        discount: itemDiscount,
        tax: itemTax,
        total: itemTotal,
      });
    });

    if (subtotal === 0) {
      alert("Please enter valid item prices and quantities");
      return;
    }

    setResult({
      subtotal,
      totalDiscounts,
      taxableAmount,
      salesTax,
      totalAmount,
    });
    setBreakdownData(newBreakdownData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      taxRate: `${(taxRateValue * 100).toFixed(2)}%`,
      subtotal: formatCurrency(subtotal),
      totalDiscounts: formatCurrency(totalDiscounts),
      taxableAmount: formatCurrency(taxableAmount),
      salesTax: formatCurrency(salesTax),
      totalAmount: formatCurrency(totalAmount),
      items: newBreakdownData.map((item) => ({
        name: item.name,
        price: formatCurrency(item.price),
        quantity: item.quantity,
        discount: formatCurrency(item.discount),
        tax: formatCurrency(item.tax),
        total: formatCurrency(item.total),
      })),
    };
    setHistory([...history, calculation]);

    alert("Chart rendering not implemented in this demo.");
  };

  const exportBreakdown = () => {
    if (breakdownData.length === 0) {
      alert("No breakdown data to export");
      return;
    }

    const csvContent = [
      "Item,Price,Quantity,Discount,Tax,Total",
      ...breakdownData.map(
        (item) =>
          `"${item.name}",${item.price.toFixed(2)},${item.quantity},${item.discount.toFixed(
            2
          )},${item.tax.toFixed(2)},${item.total.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_tax_breakdown.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-start">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-7xl w-full flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">
            Simplified Sales Tax Calculator
          </h1>
          <div className="space-y-4">
            <div className="input-group">
              <label htmlFor="tax-rate" className="block text-sm font-bold text-gray-600 mb-2">
                Sales Tax Rate (%)
              </label>
              <input
                id="tax-rate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="Enter tax rate"
                step="0.01"
                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="input-group">
              <label className="block text-sm font-bold text-gray-600 mb-2">Items</label>
              <div id="items-list">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateItem(index, "name", e.target.value)}
                      className="p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", e.target.value)}
                      step="0.01"
                      className="p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      step="1"
                      className="p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                    <input
                      type="number"
                      placeholder="Discount (%)"
                      value={item.discount}
                      onChange={(e) => updateItem(index, "discount", e.target.value)}
                      step="0.01"
                      className="p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                    <select
                      value={item.exempt}
                      onChange={(e) => updateItem(index, "exempt", e.target.value)}
                      className="p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="no">Taxable</option>
                      <option value="yes">Exempt</option>
                    </select>
                    <button
                      onClick={() => removeItemRow(index)}
                      className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addItemRow}
                className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Add Item
              </button>
            </div>
            <div className="input-group">
              <label htmlFor="currency" className="block text-sm font-bold text-gray-600 mb-2">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
              >
                <option value="USD">$ USD</option>
                <option value="CAD">$ CAD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>
            <button
              onClick={calculateSalesTax}
              className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Calculate Sales Tax
            </button>
            {result && (
              <div className="bg-gray-200 p-4 rounded-lg mt-4">
                <p>
                  <strong>Subtotal:</strong> {formatCurrency(result.subtotal)}
                </p>
                <p>
                  <strong>Total Discounts:</strong> {formatCurrency(result.totalDiscounts)}
                </p>
                <p>
                  <strong>Taxable Amount:</strong> {formatCurrency(result.taxableAmount)}
                </p>
                <p>
                  <strong>Sales Tax:</strong> {formatCurrency(result.salesTax)}
                </p>
                <p>
                  <strong>Total Amount:</strong> {formatCurrency(result.totalAmount)}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto p-4 bg-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Breakdown & History</h1>
          {breakdownData.length > 0 && (
            <table className="w-full border-collapse bg-white rounded-lg mb-4">
              <thead>
                <tr>
                  {["Item", "Price", "Qty", "Discount", "Tax", "Total"].map((header) => (
                    <th key={header} className="p-2 bg-red-500 text-white">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {breakdownData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-2 text-left">{item.name}</td>
                    <td className="p-2">{formatCurrency(item.price)}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">{formatCurrency(item.discount)}</td>
                    <td className="p-2">{formatCurrency(item.tax)}</td>
                    <td className="p-2">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {history.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-lg mb-4 shadow">
              <p>
                <strong>Date:</strong> {item.timestamp}
              </p>
              <p>
                <strong>Tax Rate:</strong> {item.taxRate}
              </p>
              <p>
                <strong>Subtotal:</strong> {item.subtotal}
              </p>
              <p>
                <strong>Total Discounts:</strong> {item.totalDiscounts}
              </p>
              <p>
                <strong>Taxable Amount:</strong> {item.taxableAmount}
              </p>
              <p>
                <strong>Sales Tax:</strong> {item.salesTax}
              </p>
              <p>
                <strong>Total Amount:</strong> {item.totalAmount}
              </p>
              <p>
                <strong>Items:</strong>
              </p>
              <ul className="list-disc pl-5">
                {item.items.map((i, j) => (
                  <li key={j}>
                    {i.name}: Price {i.price}, Qty {i.quantity}, Discount {i.discount}, Tax {i.tax}, Total{" "}
                    {i.total}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button
            onClick={exportBreakdown}
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Export Breakdown (CSV)
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
