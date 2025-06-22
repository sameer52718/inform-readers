"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [bonds, setBonds] = useState([
    {
      id: 1,
      name: "Treasury Bond",
      faceValue: "10000",
      couponRate: "4",
      marketPrice: "9500",
      yearsToMaturity: "5",
      bondType: "treasury",
      creditRating: "AAA",
    },
  ]);
  const [taxRate, setTaxRate] = useState("25");
  const [inflationRate, setInflationRate] = useState("2");
  const [budget, setBudget] = useState("20000");
  const [riskTolerance, setRiskTolerance] = useState("low");
  const [showAlternative, setShowAlternative] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const dragItem = useRef(null);

  const addBond = () => {
    const newId = bonds.length + 1;
    setBonds([
      ...bonds,
      {
        id: newId,
        name: `Bond ${newId}`,
        faceValue: "10000",
        couponRate: "4",
        marketPrice: "9500",
        yearsToMaturity: "5",
        bondType: "treasury",
        creditRating: "AAA",
      },
    ]);
  };

  const removeBond = (id) => {
    if (bonds.length > 1) {
      setBonds(bonds.filter((bond) => bond.id !== id));
    }
  };

  const updateBond = (id, field, value) => {
    setBonds(bonds.map((bond) => (bond.id === id ? { ...bond, [field]: value } : bond)));
  };

  const handleDragStart = (id) => {
    dragItem.current = id;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetId) => {
    if (dragItem.current && dragItem.current !== targetId) {
      const draggedBond = bonds.find((bond) => bond.id === dragItem.current);
      const targetIndex = bonds.findIndex((bond) => bond.id === targetId);
      const newBonds = bonds.filter((bond) => bond.id !== dragItem.current);
      newBonds.splice(targetIndex, 0, draggedBond);
      setBonds(newBonds);
    }
    dragItem.current = null;
  };

  const formatPercent = (value) =>
    isNaN(value) || !isFinite(value) ? "0.00%" : `${(value * 100).toFixed(2)}%`;

  const formatCurrency = (value) =>
    `$ ${Math.max(0, value || 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;

  const calculateYTM = (faceValue, couponRate, marketPrice, yearsToMaturity, frequency) => {
    if (faceValue <= 0 || marketPrice <= 0 || yearsToMaturity <= 0) return 0;
    const coupon = (faceValue * couponRate) / frequency;
    const n = yearsToMaturity * frequency;
    let low = 0;
    let high = 1;
    let ytm = couponRate || 0.05;
    try {
      for (let i = 0; i < 50; i++) {
        ytm = (low + high) / 2;
        let price = 0;
        for (let t = 1; t <= n; t++) {
          price += coupon / Math.pow(1 + ytm / frequency, t);
        }
        price += faceValue / Math.pow(1 + ytm / frequency, n);
        if (Math.abs(price - marketPrice) < 0.0001) break;
        if (price > marketPrice) low = ytm;
        else high = ytm;
      }
      return isNaN(ytm) ? 0 : ytm;
    } catch (error) {
      console.error("YTM error:", error.message);
      return 0;
    }
  };

  const calculateDuration = (faceValue, couponRate, marketPrice, ytm, yearsToMaturity, frequency) => {
    if (faceValue <= 0 || marketPrice <= 0 || yearsToMaturity <= 0 || isNaN(ytm)) return 0;
    const coupon = (faceValue * couponRate) / frequency;
    const n = yearsToMaturity * frequency;
    let duration = 0;
    let price = 0;
    try {
      for (let t = 1; t <= n; t++) {
        const discount = Math.pow(1 + ytm / frequency, t) || 1;
        const cashFlow = t === n ? coupon + faceValue : coupon;
        price += cashFlow / discount;
        duration += ((t / frequency) * cashFlow) / discount;
      }
      duration = price > 0 ? duration / price : 0;
      return isNaN(duration) ? 0 : duration;
    } catch (error) {
      console.error("Duration error:", error.message);
      return 0;
    }
  };

  const calculateConvexity = (faceValue, couponRate, marketPrice, ytm, yearsToMaturity, frequency) => {
    if (faceValue <= 0 || marketPrice <= 0 || yearsToMaturity <= 0 || isNaN(ytm)) return 0;
    const coupon = (faceValue * couponRate) / frequency;
    const n = yearsToMaturity * frequency;
    let convexity = 0;
    let price = 0;
    try {
      for (let t = 1; t <= n; t++) {
        const discount = Math.pow(1 + ytm / frequency, t) || 1;
        const cashFlow = t === n ? coupon + faceValue : coupon;
        price += cashFlow / discount;
        convexity += (cashFlow * (t * (t + 1))) / (discount * Math.pow(1 + ytm / frequency, 2));
      }
      convexity = price > 0 && frequency > 0 ? convexity / (price * frequency * frequency) : 0;
      return isNaN(convexity) ? 0 : convexity;
    } catch (error) {
      console.error("Convexity error:", error.message);
      return 0;
    }
  };

  const sortResults = (index, isAscending) => {
    if (!results) return;
    const sorted = [...results].sort((a, b) => {
      const fields = [
        "bond",
        "ytm",
        "currentYield",
        "duration",
        "convexity",
        "taxEquivalentYield",
        "inflationAdjustedYield",
        "creditRisk",
      ];
      const aValue = a[fields[index]];
      const bValue = b[fields[index]];
      if ([1, 2, 3, 4, 5, 6].includes(index)) {
        return isAscending ? aValue - bValue : bValue - aValue;
      }
      return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    setResults(sorted);
  };

  const calculate = () => {
    alert("Calculate button clicked");
    setError("");
    setStatus("Calculating...");
    setSuggestion("");
    setResults(null);

    const parsedTaxRate = parseFloat(taxRate) / 100 || 0;
    const parsedInflationRate = parseFloat(inflationRate) / 100 || 0;
    const parsedBudget = parseFloat(budget) || Infinity;
    const frequency = showAlternative ? 1 : 2;

    if (bonds.length === 0) {
      setError("Please add at least one bond");
      setStatus("");
      return;
    }
    if (bonds.some((b) => parseFloat(b.faceValue) <= 0)) {
      setError("Face values must be positive");
      setStatus("");
      return;
    }
    if (bonds.some((b) => parseFloat(b.marketPrice) <= 0)) {
      setError("Market prices must be positive");
      setStatus("");
      return;
    }
    if (bonds.some((b) => parseFloat(b.yearsToMaturity) <= 0)) {
      setError("Years to maturity must be positive");
      setStatus("");
      return;
    }
    if (
      bonds.some((b) => parseFloat(b.couponRate) < 0) ||
      parsedTaxRate < 0 ||
      parsedInflationRate < 0 ||
      parsedBudget < 0
    ) {
      setError("Rates and budget must be non-negative");
      setStatus("");
      return;
    }

    try {
      let totalInvestment = 0;
      let totalCouponIncome = 0;
      const calcResults = bonds.map((bond) => {
        const faceValue = parseFloat(bond.faceValue);
        const couponRate = parseFloat(bond.couponRate) / 100;
        const marketPrice = parseFloat(bond.marketPrice);
        const yearsToMaturity = parseFloat(bond.yearsToMaturity);
        const ytm = calculateYTM(faceValue, couponRate, marketPrice, yearsToMaturity, frequency);
        const couponPayment = (faceValue * couponRate) / frequency;
        const currentYield = (couponPayment * frequency) / marketPrice || 0;
        const duration = calculateDuration(
          faceValue,
          couponRate,
          marketPrice,
          ytm,
          yearsToMaturity,
          frequency
        );
        const convexity = calculateConvexity(
          faceValue,
          couponRate,
          marketPrice,
          ytm,
          yearsToMaturity,
          frequency
        );
        const taxEquivalentYield =
          bond.bondType === "municipal" && parsedTaxRate > 0 ? ytm / (1 - parsedTaxRate) : ytm;
        const inflationAdjustedYield =
          parsedInflationRate < 1 ? (1 + ytm) / (1 + parsedInflationRate) - 1 : 0;
        const creditRisk =
          bond.creditRating === "AAA" || bond.creditRating === "AA"
            ? "Low"
            : bond.creditRating === "A" || bond.creditRating === "BBB"
            ? "Moderate"
            : "High";

        totalInvestment += marketPrice;
        totalCouponIncome += couponPayment * frequency * yearsToMaturity;

        return {
          bond: bond.name,
          ytm,
          currentYield,
          duration,
          convexity,
          taxEquivalentYield,
          inflationAdjustedYield,
          creditRisk,
        };
      });

      if (totalInvestment > parsedBudget) {
        setError("Total investment exceeds budget");
        setStatus("");
        return;
      }

      const highRiskBonds = calcResults.filter((r) => r.creditRisk === "High").length;
      if (riskTolerance === "low" && highRiskBonds > 0) {
        setSuggestion("High-risk bonds detected. Consider AAA/AA bonds.");
      } else if (riskTolerance === "medium" && highRiskBonds > bonds.length / 2) {
        setSuggestion("Too many high-risk bonds. Mix with A/BBB bonds.");
      } else {
        setSuggestion("Portfolio aligns with risk tolerance.");
      }

      setResults(calcResults);
      setStatus("Calculation complete!");

      const csv = [
        "Bond,YTM (%),Current Yield (%),Duration,Convexity,Tax-Equivalent Yield (%),Inflation-Adjusted Yield (%),Credit Risk",
        ...calcResults.map(
          (r) =>
            `${r.bond},${(r.ytm * 100).toFixed(2)},${(r.currentYield * 100).toFixed(2)},${r.duration.toFixed(
              2
            )},${r.convexity.toFixed(2)},${(r.taxEquivalentYield * 100).toFixed(2)},${(
              r.inflationAdjustedYield * 100
            ).toFixed(2)},${r.creditRisk}`
        ),
      ].join("\n");
      const csvUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      setResults((prev) => ({ ...prev, csvUrl, totalInvestment, totalCouponIncome }));
    } catch (error) {
      setError("Error: Check console");
      setStatus("");
      console.error("Calculation error:", error.message, error.stack);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Advanced Bond Calculator</h1>
        <div className="mb-4">
          {bonds.map((bond) => (
            <div
              key={bond.id}
              className="border border-gray-300 p-4 rounded-lg mb-4 cursor-move"
              draggable
              onDragStart={() => handleDragStart(bond.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(bond.id)}
            >
              <label className="block text-sm font-medium text-gray-600 mb-2">Bond Name</label>
              <input
                type="text"
                value={bond.name}
                onChange={(e) => updateBond(bond.id, "name", e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
              />
              <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Face Value ($)</label>
              <input
                type="number"
                value={bond.faceValue}
                onChange={(e) => updateBond(bond.id, "faceValue", e.target.value)}
                min="0"
                step="100"
                className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
              />
              <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Coupon Rate (%)</label>
              <input
                type="number"
                value={bond.couponRate}
                onChange={(e) => updateBond(bond.id, "couponRate", e.target.value)}
                min="0"
                step="0.1"
                className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
              />
              <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Market Price ($)</label>
              <input
                type="number"
                value={bond.marketPrice}
                onChange={(e) => updateBond(bond.id, "marketPrice", e.target.value)}
                min="0"
                step="100"
                className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
              />
              <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Years to Maturity</label>
              <input
                type="number"
                value={bond.yearsToMaturity}
                onChange={(e) => updateBond(bond.id, "yearsToMaturity", e.target.value)}
                min="0"
                step="0.1"
                className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
              />
              <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Bond Type</label>
              <select
                value={bond.bondType}
                onChange={(e) => updateBond(bond.id, "bondType", e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
              >
                <option value="treasury">Treasury</option>
                <option value="corporate">Corporate</option>
                <option value="municipal">Municipal</option>
              </select>
              <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Credit Rating</label>
              <select
                value={bond.creditRating}
                onChange={(e) => updateBond(bond.id, "creditRating", e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
              >
                <option value="AAA">AAA</option>
                <option value="AA">AA</option>
                <option value="A">A</option>
                <option value="BBB">BBB</option>
                <option value="BB">BB</option>
              </select>
              {bonds.length > 1 && (
                <button
                  onClick={() => removeBond(bond.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg w-full mt-4 hover:bg-red-600"
                >
                  Remove Bond
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addBond}
          className="bg-green-500 text-white px-4 py-2 rounded-lg w-full mb-4 hover:bg-green-600"
        >
          Add Another Bond
        </button>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Tax Rate (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            min="0"
            step="1"
            className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Inflation Rate (%)</label>
          <input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(e.target.value)}
            min="0"
            step="0.1"
            className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Investment Budget ($)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            min="0"
            step="100"
            className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
          />
          <label className="block text-sm font-medium text-gray-600 mb-2 mt-4">Risk Tolerance</label>
          <select
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div
          className="cursor-pointer p-2 bg-gray-500 text-white rounded-lg text-center mb-4 hover:bg-gray-600"
          onClick={() => setShowAlternative(!showAlternative)}
        >
          {showAlternative ? "Show Original Scenario" : "Show Alternative Scenario"}
        </div>
        <button
          onClick={calculate}
          className="bg-red-500 text-white px-4 py-2 rounded-lg w-full mb-4 hover:bg-red-600"
        >
          Calculate Bond Metrics
        </button>
        {results && (
          <>
            <table className="w-full border-collapse bg-white rounded-lg mt-4">
              <thead>
                <tr className="bg-red-500 text-white">
                  {[
                    "Bond",
                    "YTM (%)",
                    "Current Yield (%)",
                    "Duration (Years)",
                    "Convexity",
                    "Tax-Equivalent Yield (%)",
                    "Inflation-Adjusted Yield (%)",
                    "Credit Risk",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="p-2 cursor-pointer hover:bg-red-600"
                      onClick={() => sortResults(index, results.sortOrder !== "asc")}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-gray-300">
                    <td className="p-2">{r.bond}</td>
                    <td className="p-2">{formatPercent(r.ytm)}</td>
                    <td className="p-2">{formatPercent(r.currentYield)}</td>
                    <td className="p-2">{isNaN(r.duration) ? "0.00" : r.duration.toFixed(2)}</td>
                    <td className="p-2">{isNaN(r.convexity) ? "0.00" : r.convexity.toFixed(2)}</td>
                    <td className="p-2">{formatPercent(r.taxEquivalentYield)}</td>
                    <td className="p-2">{formatPercent(r.inflationAdjustedYield)}</td>
                    <td className="p-2">{r.creditRisk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-center text-gray-600">
              <div>
                Total Investment: {formatCurrency(results.totalInvestment)}
                <br />
                Total Coupon Income: {formatCurrency(results.totalCouponIncome)}
                <br />
                Average YTM: {formatPercent(results.reduce((sum, r) => sum + r.ytm, 0) / results.length || 0)}
              </div>
              <a href={results.csvUrl} download="bond_metrics.csv" className="text-red-500 hover:underline">
                Download CSV
              </a>
              <br />
              <a
                href="#"
                onClick={() => alert("PDF export not implemented")}
                className="text-red-500 hover:underline"
              >
                Download PDF
              </a>
            </div>
          </>
        )}
        {status && <div className="mt-4 text-center text-yellow-500">{status}</div>}
        {error && <div className="mt-4 text-center text-red-500">{error}</div>}
        {suggestion && <div className="mt-4 text-center text-green-500">{suggestion}</div>}
      </div>
    </div>
  );
}
