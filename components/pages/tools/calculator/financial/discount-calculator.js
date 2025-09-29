"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Item 1",
      originalPrice: "100",
      quantity: "1",
      discountPercent: "10",
      fixedDiscount: "0",
      promoCode: "",
      taxRate: "7",
      shippingCost: "10",
      currency: "USD",
      tieredDiscounts: "",
      bulkDiscounts: "",
    },
  ]);
  const [theme, setTheme] = useState("light");
  const [results, setResults] = useState(null);
  const [showItemTable, setShowItemTable] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const priceChartRef = useRef(null);
  const breakdownChartRef = useRef(null);
  const priceChartInstance = useRef(null);
  const breakdownChartInstance = useRef(null);

  const exchangeRates = { USD: 1, EUR: 0.95, GBP: 0.8 };
  const promoCodes = {
    SAVE10: { type: "percentage", value: 10 },
    FLAT20: { type: "fixed", value: 20 },
    EXTRA5: { type: "percentage", value: 5 },
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    const savedData = localStorage.getItem("discountData");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setItems(data.items.map((item, index) => ({ ...item, id: index + 1 })));
      } catch (e) {
        console.error("Error loading inputs:", e);
      }
    }

    if (priceChartRef.current) {
      priceChartInstance.current = new Chart(priceChartRef.current, {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            { label: "Original Price", data: [], backgroundColor: "#4f46e5" },
            { label: "Final Price", data: [], backgroundColor: "#10b981" },
            { label: "Savings", data: [], backgroundColor: "#e11d48" },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Item" } },
            y: { title: { display: true, text: "Amount" } },
          },
        },
      });
    }
    if (breakdownChartRef.current) {
      breakdownChartInstance.current = new Chart(breakdownChartRef.current, {
        type: "pie",
        data: {
          labels: ["Base Price", "Taxes", "Shipping", "Savings"],
          datasets: [{ data: [0, 0, 0, 0], backgroundColor: ["#4f46e5", "#10b981", "#f59e0b", "#e11d48"] }],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" } },
        },
      });
    }
    return () => {
      priceChartInstance.current?.destroy();
      breakdownChartInstance.current?.destroy();
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const addItemForm = () => {
    const newId = Math.max(...items.map((i) => i.id)) + 1;
    setItems([
      ...items,
      {
        id: newId,
        name: `Item ${newId}`,
        originalPrice: "100",
        quantity: "1",
        discountPercent: "10",
        fixedDiscount: "0",
        promoCode: "",
        taxRate: "7",
        shippingCost: "10",
        currency: "USD",
        tieredDiscounts: "",
        bulkDiscounts: "",
      },
    ]);
  };

  const removeItemForm = (id) => {
    if (items.length > 1) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const handleFileUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const parsedItems = parseCSV(text);
        if (parsedItems.length > 0) {
          setItems(
            parsedItems.map((item, index) => ({
              id: index + 1,
              name: item.name,
              originalPrice: item.price.toString(),
              quantity: item.quantity.toString(),
              discountPercent: "10",
              fixedDiscount: "0",
              promoCode: "",
              taxRate: "7",
              shippingCost: "10",
              currency: "USD",
              tieredDiscounts: "",
              bulkDiscounts: "",
            }))
          );
        } else {
          setResults({ error: "Invalid CSV format. Expected: Item,Price,Quantity" });
        }
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (text) => {
    const lines = text.trim().split("\n").slice(1);
    return lines
      .map((line) => {
        const [name, price, quantity] = line.split(",").map((s) => s.trim());
        return { name, price: parseFloat(price), quantity: parseInt(quantity) };
      })
      .filter((item) => item.name && !isNaN(item.price) && !isNaN(item.quantity));
  };

  const resetForm = () => {
    setItems([
      {
        id: 1,
        name: "Item 1",
        originalPrice: "100",
        quantity: "1",
        discountPercent: "10",
        fixedDiscount: "0",
        promoCode: "",
        taxRate: "7",
        shippingCost: "10",
        currency: "USD",
        tieredDiscounts: "",
        bulkDiscounts: "",
      },
    ]);
    setResults(null);
    setShowItemTable(false);
    setShowCharts(false);
    localStorage.removeItem("discountData");
  };

  const parseDiscountPairs = (text) => {
    if (!text.trim()) return [];
    return text
      .split(",")
      .map((pair) => {
        const [threshold, discount] = pair.split(":").map((s) => parseFloat(s.trim()));
        return { threshold, discount };
      })
      .filter((t) => !isNaN(t.threshold) && !isNaN(t.discount));
  };

  const validateInputs = (items) => {
    const errors = [];
    if (items.length === 0) errors.push("Add at least one item.");
    items.forEach((item, index) => {
      if (!item.name.trim()) errors.push(`Item ${index + 1}: Item name is required.`);
      if (parseFloat(item.originalPrice) < 0 || isNaN(parseFloat(item.originalPrice)))
        errors.push(`Item ${index + 1}: Invalid original price.`);
      if (parseInt(item.quantity) < 1 || isNaN(parseInt(item.quantity)))
        errors.push(`Item ${index + 1}: Invalid quantity.`);
      if (
        parseFloat(item.discountPercent) < 0 ||
        parseFloat(item.discountPercent) > 100 ||
        isNaN(parseFloat(item.discountPercent))
      )
        errors.push(`Item ${index + 1}: Invalid discount percentage.`);
      if (parseFloat(item.fixedDiscount) < 0 || isNaN(parseFloat(item.fixedDiscount)))
        errors.push(`Item ${index + 1}: Invalid fixed discount.`);
      if (item.promoCode && !promoCodes[item.promoCode])
        errors.push(`Item ${index + 1}: Invalid promo code.`);
      if (parseFloat(item.taxRate) < 0 || parseFloat(item.taxRate) > 20 || isNaN(parseFloat(item.taxRate)))
        errors.push(`Item ${index + 1}: Invalid tax rate.`);
      if (parseFloat(item.shippingCost) < 0 || isNaN(parseFloat(item.shippingCost)))
        errors.push(`Item ${index + 1}: Invalid shipping cost.`);
      parseDiscountPairs(item.tieredDiscounts).forEach((t, i) => {
        if (
          t.threshold < 0 ||
          t.discount < 0 ||
          t.discount > 100 ||
          isNaN(t.threshold) ||
          isNaN(t.discount)
        ) {
          errors.push(`Item ${index + 1}: Invalid tiered discount at index ${i + 1}.`);
        }
      });
      parseDiscountPairs(item.bulkDiscounts).forEach((b, i) => {
        if (b.quantity < 1 || b.discount < 0 || b.discount > 100 || isNaN(b.quantity) || isNaN(b.discount)) {
          errors.push(`Item ${index + 1}: Invalid bulk discount at index ${i + 1}.`);
        }
      });
    });
    return errors;
  };

  const applyDiscounts = (item, totalPrice, totalQuantity) => {
    let price = parseFloat(item.originalPrice);
    let discountApplied = 0;

    if (parseFloat(item.discountPercent) > 0) {
      const discount = price * (parseFloat(item.discountPercent) / 100);
      price -= discount;
      discountApplied += discount;
    }

    const tiered = parseDiscountPairs(item.tieredDiscounts)
      .filter((t) => totalPrice >= t.threshold)
      .sort((a, b) => b.threshold - a.threshold)[0];
    if (tiered) {
      const discount = price * (tiered.discount / 100);
      price -= discount;
      discountApplied += discount;
    }

    const bulk = parseDiscountPairs(item.bulkDiscounts)
      .filter((b) => totalQuantity >= b.quantity)
      .sort((a, b) => b.quantity - a.quantity)[0];
    if (bulk) {
      const discount = price * (bulk.discount / 100);
      price -= discount;
      discountApplied += discount;
    }

    if (parseFloat(item.fixedDiscount) > 0) {
      price -= parseFloat(item.fixedDiscount);
      discountApplied += parseFloat(item.fixedDiscount);
    }

    if (item.promoCode && promoCodes[item.promoCode]) {
      const promo = promoCodes[item.promoCode];
      if (promo.type === "percentage") {
        const discount = price * (promo.value / 100);
        price -= discount;
        discountApplied += discount;
      } else {
        price -= promo.value;
        discountApplied += promo.value;
      }
    }

    return { finalPrice: Math.max(0, price), discountApplied };
  };

  const calculateShipping = (totalPrice, shippingCost) => {
    return totalPrice >= 100 ? 0 : parseFloat(shippingCost);
  };

  const optimizeQuantity = (item) => {
    const maxQuantity = 100;
    let bestQuantity = parseInt(item.quantity);
    let bestSavings = 0;
    for (let q = parseInt(item.quantity); q <= maxQuantity; q++) {
      const testItem = { ...item, quantity: q.toString() };
      const totalPrice = parseFloat(testItem.originalPrice) * q;
      const { finalPrice, discountApplied } = applyDiscounts(testItem, totalPrice, q);
      const savings = totalPrice - finalPrice * q;
      if (savings > bestSavings) {
        bestSavings = savings;
        bestQuantity = q;
      }
    }
    return bestQuantity;
  };

  const calculateDiscounts = () => {
    const errors = validateInputs(items);
    if (errors.length > 0) {
      setResults({ error: errors.join(" ") });
      return;
    }

    try {
      localStorage.setItem("discountData", JSON.stringify({ items }));
      let totalOriginalPrice = 0;
      let totalFinalPrice = 0;
      let totalSavings = 0;
      let totalTaxes = 0;
      let totalShipping = 0;
      const tableData = [];
      const currencySymbol = items[0].currency === "USD" ? "$" : items[0].currency === "EUR" ? "€" : "£";

      items.forEach((item) => {
        const totalPrice = parseFloat(item.originalPrice) * parseInt(item.quantity);
        const { finalPrice, discountApplied } = applyDiscounts(item, totalPrice, parseInt(item.quantity));
        const finalPriceWithQuantity = finalPrice * parseInt(item.quantity);
        const tax = finalPriceWithQuantity * (parseFloat(item.taxRate) / 100);
        const shipping = calculateShipping(totalPrice, item.shippingCost);
        const savings = totalPrice - finalPriceWithQuantity;
        const optimalQuantity = optimizeQuantity(item);

        totalOriginalPrice += totalPrice;
        totalFinalPrice += finalPriceWithQuantity + tax + shipping;
        totalSavings += savings;
        totalTaxes += tax;
        totalShipping += shipping;

        tableData.push({
          item: item.name,
          original: (totalPrice / exchangeRates[item.currency]).toFixed(2),
          quantity: parseInt(item.quantity),
          discount: (discountApplied / exchangeRates[item.currency]).toFixed(2),
          final: ((finalPriceWithQuantity + tax + shipping) / exchangeRates[item.currency]).toFixed(2),
          savings: (savings / exchangeRates[item.currency]).toFixed(2),
          optimalQuantity,
        });
      });

      const reportData = {
        summary: {
          "Total Original Price": `${currencySymbol}${(
            totalOriginalPrice / exchangeRates[items[0].currency]
          ).toFixed(2)}`,
          "Total Final Price": `${currencySymbol}${(
            totalFinalPrice / exchangeRates[items[0].currency]
          ).toFixed(2)}`,
          "Total Savings": `${currencySymbol}${(totalSavings / exchangeRates[items[0].currency]).toFixed(2)}`,
          "Total Taxes": `${currencySymbol}${(totalTaxes / exchangeRates[items[0].currency]).toFixed(2)}`,
          "Total Shipping": `${currencySymbol}${(totalShipping / exchangeRates[items[0].currency]).toFixed(
            2
          )}`,
        },
        table: tableData,
      };

      setResults(reportData);

      priceChartInstance.current.data.labels = tableData.map((row) => row.item);
      priceChartInstance.current.data.datasets[0].data = tableData.map((row) => parseFloat(row.original));
      priceChartInstance.current.data.datasets[1].data = tableData.map((row) => parseFloat(row.final));
      priceChartInstance.current.data.datasets[2].data = tableData.map((row) => parseFloat(row.savings));
      priceChartInstance.current.options.scales.y.title.text = `Amount (${currencySymbol})`;
      priceChartInstance.current.update();

      breakdownChartInstance.current.data.datasets[0].data = [
        (totalFinalPrice - totalTaxes - totalShipping) / exchangeRates[items[0].currency],
        totalTaxes / exchangeRates[items[0].currency],
        totalShipping / exchangeRates[items[0].currency],
        totalSavings / exchangeRates[items[0].currency],
      ];
      breakdownChartInstance.current.update();
    } catch (e) {
      setResults({ error: "An error occurred during calculation: " + e.message });
    }
  };

  const downloadReport = () => {
    if (!results?.summary) return;
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Discount Calculator Report", 20, 20);
      doc.setFontSize(12);
      let y = 30;
      Object.entries(results.summary).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 20, y);
        y += 10;
      });
      doc.addPage();
      doc.setFontSize(12);
      doc.text("Item Details", 20, 20);
      y = 30;
      results.table.forEach((row) => {
        doc.text(
          `Item ${row.item}: Original ${row.original}, Quantity ${row.quantity}, Discount ${row.discount}, Final ${row.final}, Savings ${row.savings}`,
          20,
          y
        );
        y += 10;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save("discount_report.pdf");
    } catch (e) {
      console.error("Error generating PDF:", e);
    }
  };

  const downloadCSV = () => {
    if (!results?.table) return;
    const headers = ["Item", "Original Price", "Quantity", "Discount Applied", "Final Price", "Savings"];
    const csv = [
      headers.join(","),
      ...results.table.map(
        (row) => `${row.item},${row.original},${row.quantity},${row.discount},${row.final},${row.savings}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "discount_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white  p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Discount Calculator</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Item Details</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Item {item.id}</h3>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItemForm(item.id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Item Name",
                      type: "text",
                      value: item.name,
                      field: "name",
                      tooltip: "Name of the item",
                    },
                    {
                      label: "Original Price",
                      type: "number",
                      value: item.originalPrice,
                      field: "originalPrice",
                      tooltip: "Price before discounts",
                      min: 0,
                      step: 0.01,
                    },
                    {
                      label: "Quantity",
                      type: "number",
                      value: item.quantity,
                      field: "quantity",
                      tooltip: "Number of units",
                      min: 1,
                      step: 1,
                      slider: { min: 1, max: 100, step: 1, ariaLabel: "Adjust quantity" },
                    },
                    {
                      label: "Discount (%)",
                      type: "number",
                      value: item.discountPercent,
                      field: "discountPercent",
                      tooltip: "Percentage discount",
                      min: 0,
                      max: 100,
                      step: 0.1,
                      slider: { min: 0, max: 100, step: 0.1, ariaLabel: "Adjust discount percentage" },
                    },
                    {
                      label: "Fixed Discount",
                      type: "number",
                      value: item.fixedDiscount,
                      field: "fixedDiscount",
                      tooltip: "Fixed amount off",
                      min: 0,
                      step: 0.01,
                    },
                    {
                      label: "Promotional Code",
                      type: "text",
                      value: item.promoCode,
                      field: "promoCode",
                      tooltip: "Enter promo code",
                      placeholder: "e.g., SAVE10",
                    },
                    {
                      label: "Tax Rate (%)",
                      type: "number",
                      value: item.taxRate,
                      field: "taxRate",
                      tooltip: "Sales tax or VAT rate",
                      min: 0,
                      max: 20,
                      step: 0.01,
                      slider: { min: 0, max: 20, step: 0.1, ariaLabel: "Adjust tax rate" },
                    },
                    {
                      label: "Shipping Cost",
                      type: "number",
                      value: item.shippingCost,
                      field: "shippingCost",
                      tooltip: "Shipping or handling fee",
                      min: 0,
                      step: 0.01,
                    },
                    {
                      label: "Currency",
                      type: "select",
                      value: item.currency,
                      field: "currency",
                      tooltip: "Select currency for display",
                      options: [
                        { value: "USD", label: "USD ($)" },
                        { value: "EUR", label: "EUR (€)" },
                        { value: "GBP", label: "GBP (£)" },
                      ],
                    },
                    {
                      label: "Tiered Discounts",
                      type: "textarea",
                      value: item.tieredDiscounts,
                      field: "tieredDiscounts",
                      tooltip: "Threshold:Discount pairs (e.g., $100:10%)",
                      placeholder: "e.g., 100:10, 200:15",
                    },
                    {
                      label: "Bulk Discounts",
                      type: "textarea",
                      value: item.bulkDiscounts,
                      field: "bulkDiscounts",
                      tooltip: "Quantity:Discount pairs (e.g., 10 units:5%)",
                      placeholder: "e.g., 10:5, 20:10",
                    },
                    {
                      label: "Upload Items (CSV)",
                      type: "file",
                      field: "file",
                      tooltip: "Upload CSV with Item,Price,Quantity",
                      accept: ".csv",
                    },
                  ].map((field) => (
                    <div key={field.label} className="relative">
                      <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                      {field.type === "select" ? (
                        <select
                          value={field.value}
                          onChange={(e) => updateItem(item.id, field.field, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-white text-gray-900"
                          aria-label={field.label}
                        >
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          value={field.value}
                          onChange={(e) => updateItem(item.id, field.field, e.target.value)}
                          rows="3"
                          placeholder={field.placeholder}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-white text-gray-900"
                          aria-label={field.label}
                        />
                      ) : field.type === "file" ? (
                        <input
                          type="file"
                          accept={field.accept}
                          onChange={(e) => handleFileUpload(item.id, e)}
                          className="mt-1 block w-full text-gray-700"
                          aria-label={field.label}
                        />
                      ) : (
                        <>
                          <input
                            type={field.type}
                            value={field.value}
                            onChange={(e) => updateItem(item.id, field.field, e.target.value)}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            placeholder={field.placeholder}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-white text-gray-900"
                            aria-label={field.label}
                          />
                          {field.slider && (
                            <input
                              type="range"
                              value={field.value}
                              onChange={(e) => updateItem(item.id, field.field, e.target.value)}
                              min={field.slider.min}
                              max={field.slider.max}
                              step={field.slider.step}
                              className="mt-2 w-full"
                              aria-label={field.slider.ariaLabel}
                            />
                          )}
                        </>
                      )}
                      <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8 md:-mt-16">
                        {field.tooltip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={addItemForm}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              aria-label="Add another item"
            >
              Add Another Item
            </button>
            <button
              onClick={resetForm}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              aria-label="Reset form"
            >
              Reset Form
            </button>
          </div>
          <button
            onClick={calculateDiscounts}
            className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            aria-label="Calculate discounts"
          >
            Calculate
          </button>
        </div>
        {results && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
            {results.error ? (
              <div className="text-red-600 mb-4">{results.error}</div>
            ) : (
              <>
                <div className="mb-4">
                  {Object.entries(results.summary).map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {value}
                    </p>
                  ))}
                  {results.table.map((row) => (
                    <p key={row.item}>
                      <strong>Optimal Quantity for {row.item}:</strong> {row.optimalQuantity}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => setShowItemTable(!showItemTable)}
                  className="w-full text-left bg-white p-2 rounded-md mb-2"
                  aria-label="Toggle item table"
                >
                  Item Details Table
                </button>
                {showItemTable && (
                  <div className="mb-4 overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          {[
                            "Item",
                            "Original Price",
                            "Quantity",
                            "Discount Applied",
                            "Final Price",
                            "Savings",
                          ].map((h) => (
                            <th key={h} className="px-4 py-2">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.table.map((row) => (
                          <tr key={row.item}>
                            <td className="px-4 py-2">{row.item}</td>
                            <td className="px-4 py-2">
                              {items[0].currency === "USD" ? "$" : items[0].currency === "EUR" ? "€" : "£"}
                              {row.original}
                            </td>
                            <td className="px-4 py-2">{row.quantity}</td>
                            <td className="px-4 py-2">
                              {items[0].currency === "USD" ? "$" : items[0].currency === "EUR" ? "€" : "£"}
                              {row.discount}
                            </td>
                            <td className="px-4 py-2">
                              {items[0].currency === "USD" ? "$" : items[0].currency === "EUR" ? "€" : "£"}
                              {row.final}
                            </td>
                            <td className="px-4 py-2">
                              {items[0].currency === "USD" ? "$" : items[0].currency === "EUR" ? "€" : "£"}
                              {row.savings}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className="w-full text-left bg-white p-2 rounded-md mb-2"
                  aria-label="Toggle charts"
                >
                  Cost Charts
                </button>
                {showCharts && (
                  <div className="mb-4">
                    <canvas ref={priceChartRef} className="w-full mb-4" />
                    <canvas ref={breakdownChartRef} className="w-full" />
                  </div>
                )}
                <div className="flex space-x-4">
                  <button
                    onClick={downloadReport}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    aria-label="Download PDF report"
                  >
                    Download PDF Report
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    aria-label="Download CSV"
                  >
                    Download CSV
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        .tooltip {
          display: none;
        }
        .relative:hover .tooltip {
          display: block;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #ef4444;
          cursor: pointer;
          border-radius: 50%;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #ef4444;
          cursor: pointer;
          border-radius: 50%;
        }
      `}</style>
    </>
  );
}
