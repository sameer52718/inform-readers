"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [leases, setLeases] = useState([
    {
      id: 1,
      msrp: 35000,
      negotiatedPrice: 32000,
      residualPercent: 50,
      leaseTerm: 36,
      moneyFactor: 0.0025,
      apr: 6,
      downPayment: 2000,
      tradeIn: 0,
      rebates: 0,
      salesTax: 7,
      acquisitionFee: 700,
      registrationFee: 200,
      maintenance: 0,
      insurance: 0,
      annualMileage: 12000,
      mileageAllowance: 12000,
      excessMileageFee: 0.25,
      currency: "USD",
    },
  ]);
  const [loanApr, setLoanApr] = useState(5);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [showSections, setShowSections] = useState({ paymentTable: false, charts: false });
  const paymentChartRef = useRef(null);
  const breakdownChartRef = useRef(null);
  const paymentChartInstance = useRef(null);
  const breakdownChartInstance = useRef(null);

  const exchangeRates = { USD: 1, EUR: 0.95, GBP: 0.8 };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("leaseData"));
    if (savedData) {
      setLeases(savedData.leases);
      setLoanApr(savedData.otherInputs.loanApr);
    }
  }, []);

  useEffect(() => {
    if (results && paymentChartRef.current && breakdownChartRef.current) {
      if (paymentChartInstance.current) paymentChartInstance.current.destroy();
      if (breakdownChartInstance.current) breakdownChartInstance.current.destroy();

      const currencySymbol = leases[0].currency === "USD" ? "$" : leases[0].currency === "EUR" ? "€" : "£";
      const chartData = Array.from({ length: leases[0].leaseTerm }, (_, i) => ({
        month: i + 1,
        payment: results.table
          .filter((row) => row.month === i + 1)
          .reduce((sum, row) => sum + parseFloat(row.payment) * exchangeRates[leases[0].currency], 0),
      }));

      paymentChartInstance.current = new Chart(paymentChartRef.current, {
        type: "line",
        data: {
          labels: Array.from({ length: leases[0].leaseTerm }, (_, i) => i + 1),
          datasets: [
            {
              label: "Monthly Payment",
              data: chartData.map((d) => d.payment / exchangeRates[leases[0].currency]),
              borderColor: "#ef4444",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Month" } },
            y: { title: { display: true, text: `Payment (${currencySymbol})` } },
          },
        },
      });

      breakdownChartInstance.current = new Chart(breakdownChartRef.current, {
        type: "pie",
        data: {
          labels: ["Depreciation", "Interest", "Taxes", "Fees", "Optional Costs", "Mileage"],
          datasets: [
            {
              data: [
                parseFloat(results.summary["Total Depreciation"].replace(/[^0-9.]/g, "")),
                parseFloat(results.summary["Total Interest"].replace(/[^0-9.]/g, "")),
                parseFloat(results.summary["Total Taxes"].replace(/[^0-9.]/g, "")),
                parseFloat(results.summary["Total Fees"].replace(/[^0-9.]/g, "")),
                parseFloat(results.summary["Optional Costs"].replace(/[^0-9.]/g, "")),
                parseFloat(results.summary["Excess Mileage Cost"].replace(/[^0-9.]/g, "")),
              ],
              backgroundColor: ["#ef4444", "#10b981", "#e11d48", "#f59e0b", "#6b7280", "#ec4899"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" } },
        },
      });
    }
  }, [results, leases]);

  const handleInputChange = (index, field, value) => {
    const newLeases = [...leases];
    newLeases[index] = {
      ...newLeases[index],
      [field]: field === "currency" ? value : parseFloat(value) || value,
    };
    if (field === "apr") {
      newLeases[index].moneyFactor = (parseFloat(value) || 0) / 2400;
    }
    setLeases(newLeases);
  };

  const handleSliderChange = (index, field, value) => {
    handleInputChange(index, field, value);
  };

  const addLeaseForm = () => {
    setLeases([
      ...leases,
      {
        id: leases.length + 1,
        msrp: 35000,
        negotiatedPrice: 32000,
        residualPercent: 50,
        leaseTerm: 36,
        moneyFactor: 0.0025,
        apr: 6,
        downPayment: 2000,
        tradeIn: 0,
        rebates: 0,
        salesTax: 7,
        acquisitionFee: 700,
        registrationFee: 200,
        maintenance: 0,
        insurance: 0,
        annualMileage: 12000,
        mileageAllowance: 12000,
        excessMileageFee: 0.25,
        currency: "USD",
      },
    ]);
  };

  const removeLeaseForm = (index) => {
    setLeases(leases.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setLeases([
      {
        id: 1,
        msrp: 35000,
        negotiatedPrice: 32000,
        residualPercent: 50,
        leaseTerm: 36,
        moneyFactor: 0.0025,
        apr: 6,
        downPayment: 2000,
        tradeIn: 0,
        rebates: 0,
        salesTax: 7,
        acquisitionFee: 700,
        registrationFee: 200,
        maintenance: 0,
        insurance: 0,
        annualMileage: 12000,
        mileageAllowance: 12000,
        excessMileageFee: 0.25,
        currency: "USD",
      },
    ]);
    setLoanApr(5);
    setResults(null);
    setError("");
    localStorage.removeItem("leaseData");
  };

  const validateInputs = () => {
    const errors = [];
    if (leases.length === 0) errors.push("Add at least one lease scenario.");
    leases.forEach((lease, index) => {
      if (lease.msrp <= 0 || isNaN(lease.msrp)) errors.push(`Scenario ${index + 1}: Invalid MSRP.`);
      if (lease.negotiatedPrice <= 0 || isNaN(lease.negotiatedPrice))
        errors.push(`Scenario ${index + 1}: Invalid negotiated price.`);
      if (lease.residualPercent <= 0 || lease.residualPercent > 100 || isNaN(lease.residualPercent))
        errors.push(`Scenario ${index + 1}: Invalid residual value percentage.`);
      if (lease.leaseTerm < 12 || lease.leaseTerm > 60 || isNaN(lease.leaseTerm))
        errors.push(`Scenario ${index + 1}: Invalid lease term.`);
      if (lease.moneyFactor < 0 || isNaN(lease.moneyFactor))
        errors.push(`Scenario ${index + 1}: Invalid money factor.`);
      if (lease.apr < 0 || lease.apr > 15 || isNaN(lease.apr))
        errors.push(`Scenario ${index + 1}: Invalid interest rate.`);
      if (lease.downPayment < 0 || isNaN(lease.downPayment))
        errors.push(`Scenario ${index + 1}: Invalid down payment.`);
      if (lease.tradeIn < 0 || isNaN(lease.tradeIn))
        errors.push(`Scenario ${index + 1}: Invalid trade-in value.`);
      if (lease.rebates < 0 || isNaN(lease.rebates)) errors.push(`Scenario ${index + 1}: Invalid rebates.`);
      if (lease.salesTax < 0 || lease.salesTax > 15 || isNaN(lease.salesTax))
        errors.push(`Scenario ${index + 1}: Invalid sales tax rate.`);
      if (lease.acquisitionFee < 0 || isNaN(lease.acquisitionFee))
        errors.push(`Scenario ${index + 1}: Invalid acquisition fee.`);
      if (lease.registrationFee < 0 || isNaN(lease.registrationFee))
        errors.push(`Scenario ${index + 1}: Invalid registration fee.`);
      if (lease.maintenance < 0 || isNaN(lease.maintenance))
        errors.push(`Scenario ${index + 1}: Invalid maintenance cost.`);
      if (lease.insurance < 0 || isNaN(lease.insurance))
        errors.push(`Scenario ${index + 1}: Invalid insurance cost.`);
      if (lease.annualMileage < 0 || isNaN(lease.annualMileage))
        errors.push(`Scenario ${index + 1}: Invalid annual mileage.`);
      if (lease.mileageAllowance < 0 || isNaN(lease.mileageAllowance))
        errors.push(`Scenario ${index + 1}: Invalid mileage allowance.`);
      if (lease.excessMileageFee < 0 || isNaN(lease.excessMileageFee))
        errors.push(`Scenario ${index + 1}: Invalid excess mileage fee.`);
    });
    if (loanApr < 0 || isNaN(loanApr)) errors.push("Invalid loan APR.");
    return errors;
  };

  const calculateMonthlyLeasePayment = (lease) => {
    const residualValue = lease.msrp * (lease.residualPercent / 100);
    const capitalizedCost =
      lease.negotiatedPrice -
      lease.downPayment -
      lease.tradeIn -
      lease.rebates +
      lease.acquisitionFee +
      lease.registrationFee;
    const depreciationFee = (capitalizedCost - residualValue) / lease.leaseTerm;
    const financeFee = (capitalizedCost + residualValue) * lease.moneyFactor;
    const basePayment = depreciationFee + financeFee;
    const tax = basePayment * (lease.salesTax / 100);
    return {
      basePayment,
      tax,
      totalPayment: basePayment + tax,
      depreciationFee,
      financeFee,
    };
  };

  const calculateLoanPayment = (principal, apr, term) => {
    const monthlyRate = apr / 100 / 12;
    const payment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, term))) / (Math.pow(1 + monthlyRate, term) - 1);
    return isFinite(payment) ? payment : 0;
  };

  const calculateExcessMileageCost = (lease) => {
    const totalMiles = lease.annualMileage * (lease.leaseTerm / 12);
    const allowedMiles = lease.mileageAllowance * (lease.leaseTerm / 12);
    const excessMiles = Math.max(0, totalMiles - allowedMiles);
    return excessMiles * lease.excessMileageFee;
  };

  const generatePaymentSchedule = (lease, paymentDetails) => {
    const schedule = [];
    for (let month = 1; month <= lease.leaseTerm; month++) {
      schedule.push({
        scenarioId: lease.id,
        month,
        payment: (paymentDetails.totalPayment / exchangeRates[lease.currency]).toFixed(2),
        depreciation: (paymentDetails.depreciationFee / exchangeRates[lease.currency]).toFixed(2),
        interest: (paymentDetails.financeFee / exchangeRates[lease.currency]).toFixed(2),
        tax: (paymentDetails.tax / exchangeRates[lease.currency]).toFixed(2),
      });
    }
    return schedule;
  };

  const calculateLease = () => {
    try {
      const errors = validateInputs();
      if (errors.length > 0) {
        setError(errors.join("<br>"));
        setResults(null);
        return;
      }
      setError("");

      localStorage.setItem("leaseData", JSON.stringify({ leases, otherInputs: { loanApr } }));

      let totalMonthlyPayment = 0;
      let totalLeaseCost = 0;
      let totalDepreciation = 0;
      let totalInterest = 0;
      let totalTaxes = 0;
      let totalFees = 0;
      let totalOptionalCosts = 0;
      let totalMileageCost = 0;
      const schedules = [];

      leases.forEach((lease) => {
        const paymentDetails = calculateMonthlyLeasePayment(lease);
        const monthlyPayment = paymentDetails.totalPayment;
        const schedule = generatePaymentSchedule(lease, paymentDetails);
        const excessMileageCost = calculateExcessMileageCost(lease);
        const upfrontCosts = lease.downPayment + lease.acquisitionFee + lease.registrationFee;
        const optionalCosts = (lease.maintenance + lease.insurance) * (lease.leaseTerm / 12);
        const leaseCost = monthlyPayment * lease.leaseTerm + upfrontCosts + optionalCosts + excessMileageCost;

        totalMonthlyPayment += monthlyPayment;
        totalLeaseCost += leaseCost;
        totalDepreciation += paymentDetails.depreciationFee * lease.leaseTerm;
        totalInterest += paymentDetails.financeFee * lease.leaseTerm;
        totalTaxes += paymentDetails.tax * lease.leaseTerm;
        totalFees += lease.acquisitionFee + lease.registrationFee;
        totalOptionalCosts += optionalCosts;
        totalMileageCost += excessMileageCost;
        schedules.push(schedule);
      });

      const currencySymbol = leases[0].currency === "USD" ? "$" : leases[0].currency === "EUR" ? "€" : "£";
      const newResults = {
        summary: {
          "Monthly Payment": `${currencySymbol}${(
            totalMonthlyPayment / exchangeRates[leases[0].currency]
          ).toFixed(2)}`,
          "Total Lease Cost": `${currencySymbol}${(
            totalLeaseCost / exchangeRates[leases[0].currency]
          ).toFixed(2)}`,
          "Total Depreciation": `${currencySymbol}${(
            totalDepreciation / exchangeRates[leases[0].currency]
          ).toFixed(2)}`,
          "Total Interest": `${currencySymbol}${(totalInterest / exchangeRates[leases[0].currency]).toFixed(
            2
          )}`,
          "Total Taxes": `${currencySymbol}${(totalTaxes / exchangeRates[leases[0].currency]).toFixed(2)}`,
          "Total Fees": `${currencySymbol}${(totalFees / exchangeRates[leases[0].currency]).toFixed(2)}`,
          "Optional Costs": `${currencySymbol}${(
            totalOptionalCosts / exchangeRates[leases[0].currency]
          ).toFixed(2)}`,
          "Excess Mileage Cost": `${currencySymbol}${(
            totalMileageCost / exchangeRates[leases[0].currency]
          ).toFixed(2)}`,
          "Loan Monthly Payment": `${currencySymbol}${(
            calculateLoanPayment(
              leases[0].negotiatedPrice - leases[0].downPayment - leases[0].tradeIn - leases[0].rebates,
              loanApr,
              leases[0].leaseTerm
            ) / exchangeRates[leases[0].currency]
          ).toFixed(2)}`,
        },
        table: schedules.flat(),
      };

      setResults(newResults);
    } catch (e) {
      setError("An error occurred during calculation: " + e.message);
      setResults(null);
    }
  };

  const downloadReport = () => {
    if (!results) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Auto Lease Calculator Report", 20, 20);
    doc.setFontSize(12);
    let y = 30;
    Object.entries(results.summary).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 20, y);
      y += 10;
    });
    doc.addPage();
    doc.setFontSize(12);
    doc.text("Monthly Payment Details", 20, 20);
    y = 30;
    results.table.forEach((row) => {
      doc.text(
        `Scenario ${row.scenarioId}, Month ${row.month}: Payment $${row.payment}, Depreciation $${row.depreciation}, Interest $${row.interest}, Tax $${row.tax}`,
        20,
        y
      );
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save("auto_lease_report.pdf");
  };

  return (
    <>
      <div className="bg-white min-h-screen p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Advanced Auto Lease Calculator</h1>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Lease Details</h2>
            {leases.map((lease, index) => (
              <div key={lease.id} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Lease Scenario {lease.id}</h3>
                  {leases.length > 1 && (
                    <button
                      onClick={() => removeLeaseForm(index)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Remove lease"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "MSRP",
                      field: "msrp",
                      type: "number",
                      min: 0,
                      step: 100,
                      tooltip: "Manufacturer's Suggested Retail Price",
                    },
                    {
                      label: "Negotiated Price",
                      field: "negotiatedPrice",
                      type: "number",
                      min: 0,
                      step: 100,
                      tooltip: "Agreed-upon vehicle price",
                    },
                    {
                      label: "Residual Value (%)",
                      field: "residualPercent",
                      type: "number",
                      min: 0,
                      max: 100,
                      step: 0.1,
                      tooltip: "Vehicle value at lease end",
                    },
                    {
                      label: "Lease Term (Months)",
                      field: "leaseTerm",
                      type: "number",
                      min: 12,
                      max: 60,
                      step: 1,
                      tooltip: "Duration of lease",
                      slider: { min: 12, max: 60, step: 1 },
                    },
                    {
                      label: "Money Factor",
                      field: "moneyFactor",
                      type: "number",
                      min: 0,
                      step: 0.00001,
                      tooltip: "Lease interest rate (or enter APR below)",
                    },
                    {
                      label: "Interest Rate (APR %)",
                      field: "apr",
                      type: "number",
                      min: 0,
                      max: 15,
                      step: 0.01,
                      tooltip: "Annual percentage rate (converts to money factor)",
                      slider: { min: 0, max: 15, step: 0.1 },
                    },
                    {
                      label: "Down Payment",
                      field: "downPayment",
                      type: "number",
                      min: 0,
                      step: 100,
                      tooltip: "Initial payment to reduce cost",
                      slider: { min: 0, max: 10000, step: 100 },
                    },
                    {
                      label: "Trade-in Value",
                      field: "tradeIn",
                      type: "number",
                      min: 0,
                      step: 100,
                      tooltip: "Value of traded vehicle",
                    },
                    {
                      label: "Rebates",
                      field: "rebates",
                      type: "number",
                      min: 0,
                      step: 100,
                      tooltip: "Manufacturer or dealer incentives",
                    },
                    {
                      label: "Sales Tax Rate (%)",
                      field: "salesTax",
                      type: "number",
                      min: 0,
                      max: 15,
                      step: 0.01,
                      tooltip: "Local sales tax rate",
                    },
                    {
                      label: "Acquisition Fee",
                      field: "acquisitionFee",
                      type: "number",
                      min: 0,
                      step: 10,
                      tooltip: "Lease initiation fee",
                    },
                    {
                      label: "Registration Fee",
                      field: "registrationFee",
                      type: "number",
                      min: 0,
                      step: 10,
                      tooltip: "Vehicle registration fee",
                    },
                    {
                      label: "Maintenance Cost",
                      field: "maintenance",
                      type: "number",
                      min: 0,
                      step: 10,
                      tooltip: "Optional maintenance package",
                    },
                    {
                      label: "Insurance Cost",
                      field: "insurance",
                      type: "number",
                      min: 0,
                      step: 10,
                      tooltip: "Estimated annual insurance",
                    },
                    {
                      label: "Annual Mileage",
                      field: "annualMileage",
                      type: "number",
                      min: 0,
                      step: 1000,
                      tooltip: "Expected miles per year",
                    },
                    {
                      label: "Mileage Allowance",
                      field: "mileageAllowance",
                      type: "number",
                      min: 0,
                      step: 1000,
                      tooltip: "Allowed miles per year",
                    },
                    {
                      label: "Excess Mileage Fee ($/mile)",
                      field: "excessMileageFee",
                      type: "number",
                      min: 0,
                      step: 0.01,
                      tooltip: "Fee per excess mile",
                    },
                    {
                      label: "Currency",
                      field: "currency",
                      type: "select",
                      options: ["USD", "EUR", "GBP"],
                      tooltip: "Select currency for display",
                    },
                  ].map(({ label, field, type, min, max, step, tooltip, slider, options }) => (
                    <div key={field} className="relative">
                      <label className="block text-sm font-medium text-gray-600">{label}</label>
                      {type === "select" ? (
                        <select
                          value={lease[field]}
                          onChange={(e) => handleInputChange(index, field, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                          aria-label={label}
                        >
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt === "USD" ? "USD ($)" : opt === "EUR" ? "EUR (€)" : "GBP (£)"}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={type}
                          value={lease[field]}
                          min={min}
                          max={max}
                          step={step}
                          onChange={(e) => handleInputChange(index, field, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                          aria-label={label}
                        />
                      )}
                      {slider && (
                        <input
                          type="range"
                          value={lease[field]}
                          min={slider.min}
                          max={slider.max}
                          step={slider.step}
                          onChange={(e) => handleSliderChange(index, field, e.target.value)}
                          className="mt-2 w-full"
                          aria-label={`Adjust ${label.toLowerCase()}`}
                        />
                      )}
                      <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8 z-10">
                        {tooltip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex space-x-4 mt-4">
              <button
                onClick={addLeaseForm}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                aria-label="Add another lease"
              >
                Add Another Lease
              </button>
              <button
                onClick={resetForm}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                aria-label="Reset form"
              >
                Reset Form
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600">Compare with Loan APR (%)</label>
                <input
                  type="number"
                  value={loanApr}
                  min="0"
                  max="15"
                  step="0.01"
                  onChange={(e) => setLoanApr(parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                  aria-label="Loan APR"
                />
                <span className="tooltip hidden absolute bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8 z-10">
                  Loan interest rate for comparison
                </span>
              </div>
            </div>
            <button
              onClick={calculateLease}
              className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              aria-label="Calculate lease"
            >
              Calculate
            </button>
          </div>
          {results && (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
              {error && <div className="text-red-600 mb-4" dangerouslySetInnerHTML={{ __html: error }} />}
              <div className="mb-4">
                {Object.entries(results.summary).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setShowSections({ ...showSections, paymentTable: !showSections.paymentTable })}
                className="w-full text-left bg-gray-200 p-2 rounded-md mb-2"
                aria-label="Toggle payment table"
              >
                Monthly Payment Table
              </button>
              {showSections.paymentTable && (
                <div className="mb-4 overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs uppercase bg-red-500 text-white">
                      <tr>
                        {["Scenario", "Month", "Payment", "Depreciation", "Interest", "Tax"].map((header) => (
                          <th key={header} className="px-4 py-2">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.table.map((row, index) => (
                        <tr key={index} className="even:bg-gray-50">
                          <td className="px-4 py-2">{row.scenarioId}</td>
                          <td className="px-4 py-2">{row.month}</td>
                          <td className="px-4 py-2">
                            {leases[0].currency === "USD" ? "$" : leases[0].currency === "EUR" ? "€" : "£"}
                            {row.payment}
                          </td>
                          <td className="px-4 py-2">
                            {leases[0].currency === "USD" ? "$" : leases[0].currency === "EUR" ? "€" : "£"}
                            {row.depreciation}
                          </td>
                          <td className="px-4 py-2">
                            {leases[0].currency === "USD" ? "$" : leases[0].currency === "EUR" ? "€" : "£"}
                            {row.interest}
                          </td>
                          <td className="px-4 py-2">
                            {leases[0].currency === "USD" ? "$" : leases[0].currency === "EUR" ? "€" : "£"}
                            {row.tax}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button
                onClick={() => setShowSections({ ...showSections, charts: !showSections.charts })}
                className="w-full text-left bg-gray-200 p-2 rounded-md mb-2"
                aria-label="Toggle charts"
              >
                Cost Charts
              </button>
              {showSections.charts && (
                <div className="mb-4">
                  <canvas ref={paymentChartRef} className="w-full mb-4"></canvas>
                  <canvas ref={breakdownChartRef} className="w-full"></canvas>
                </div>
              )}
              <button
                onClick={downloadReport}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                aria-label="Download PDF report"
              >
                Download PDF Report
              </button>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #ef4444;
          cursor: pointer;
          border-radius: 50%;
        }
        .relative:hover .tooltip {
          display: block;
        }
      `}</style>
    </>
  );
}
