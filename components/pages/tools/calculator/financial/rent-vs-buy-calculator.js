"use client";

import { useState } from "react";

export default function Home() {
  const [homePrice, setHomePrice] = useState("300000");
  const [downPayment, setDownPayment] = useState("60000");
  const [mortgageRate, setMortgageRate] = useState("4");
  const [loanTerm, setLoanTerm] = useState("30");
  const [propertyTax, setPropertyTax] = useState("1.2");
  const [homeInsurance, setHomeInsurance] = useState("1200");
  const [maintenance, setMaintenance] = useState("1");
  const [closingCosts, setClosingCosts] = useState("5000");
  const [appreciation, setAppreciation] = useState("3");
  const [monthlyRent, setMonthlyRent] = useState("1500");
  const [rentIncrease, setRentIncrease] = useState("2");
  const [rentersInsurance, setRentersInsurance] = useState("200");
  const [analysisPeriod, setAnalysisPeriod] = useState("10");
  const [investmentRate, setInvestmentRate] = useState("5");
  const [results, setResults] = useState(null);
  const [costTable, setCostTable] = useState([]);
  const [financialAnalysis, setFinancialAnalysis] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const calculateMonthlyPayment = (loanAmount, annualRate, termYears) => {
    const monthlyRate = annualRate / 100 / 12;
    const termMonths = termYears * 12;
    return (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
    );
  };

  const formatCurrency = (amount) => `$${parseFloat(amount || 0).toFixed(2)}`;

  const calculateRentVsBuy = () => {
    setErrorMessage("");
    const homePriceVal = parseFloat(homePrice);
    const downPaymentVal = parseFloat(downPayment);
    const mortgageRateVal = parseFloat(mortgageRate);
    const loanTermVal = parseInt(loanTerm);
    const propertyTaxRateVal = parseFloat(propertyTax);
    const homeInsuranceVal = parseFloat(homeInsurance);
    const maintenanceRateVal = parseFloat(maintenance);
    const closingCostsVal = parseFloat(closingCosts);
    const appreciationRateVal = parseFloat(appreciation);
    const monthlyRentVal = parseFloat(monthlyRent);
    const rentIncreaseRateVal = parseFloat(rentIncrease);
    const rentersInsuranceVal = parseFloat(rentersInsurance);
    const analysisPeriodVal = parseInt(analysisPeriod);
    const investmentRateVal = parseFloat(investmentRate);

    if (
      isNaN(homePriceVal) ||
      isNaN(downPaymentVal) ||
      isNaN(mortgageRateVal) ||
      isNaN(loanTermVal) ||
      isNaN(propertyTaxRateVal) ||
      isNaN(homeInsuranceVal) ||
      isNaN(maintenanceRateVal) ||
      isNaN(closingCostsVal) ||
      isNaN(appreciationRateVal) ||
      isNaN(monthlyRentVal) ||
      isNaN(rentIncreaseRateVal) ||
      isNaN(rentersInsuranceVal) ||
      isNaN(analysisPeriodVal) ||
      isNaN(investmentRateVal)
    ) {
      setErrorMessage("Please provide valid inputs for all fields.");
      return;
    }

    if (
      homePriceVal <= 0 ||
      downPaymentVal < 0 ||
      mortgageRateVal <= 0 ||
      loanTermVal <= 0 ||
      monthlyRentVal <= 0
    ) {
      setErrorMessage(
        "Home price, mortgage rate, loan term, and monthly rent must be positive; down payment cannot be negative."
      );
      return;
    }
    if (
      propertyTaxRateVal < 0 ||
      homeInsuranceVal < 0 ||
      maintenanceRateVal < 0 ||
      closingCostsVal < 0 ||
      appreciationRateVal < 0 ||
      rentIncreaseRateVal < 0 ||
      rentersInsuranceVal < 0 ||
      investmentRateVal < 0
    ) {
      setErrorMessage(
        "Tax rate, insurance, maintenance, closing costs, appreciation, rent increase, and investment rate cannot be negative."
      );
      return;
    }
    if (analysisPeriodVal <= 0) {
      setErrorMessage("Analysis period must be positive.");
      return;
    }

    const loanAmount = homePriceVal - downPaymentVal;
    const monthlyPayment = calculateMonthlyPayment(loanAmount, mortgageRateVal, loanTermVal);
    const monthlyPropertyTax = (homePriceVal * (propertyTaxRateVal / 100)) / 12;
    const monthlyInsurance = homeInsuranceVal / 12;
    const monthlyMaintenance = (homePriceVal * (maintenanceRateVal / 100)) / 12;

    let totalBuyingCost = downPaymentVal + closingCostsVal;
    let totalRentingCost = 0;
    const buyingCosts = [];
    const rentingCosts = [];
    let breakEvenYear = null;

    for (let year = 0; year <= analysisPeriodVal; year++) {
      let yearlyBuyingCost = 0;
      let yearlyRentingCost = 0;

      if (year === 0) {
        buyingCosts.push(totalBuyingCost);
        rentingCosts.push(0);
        continue;
      }

      const monthsInYear = Math.min(12, loanTermVal * 12 - (year - 1) * 12);
      yearlyBuyingCost += monthlyPayment * monthsInYear;
      yearlyBuyingCost += monthlyPropertyTax * 12;
      yearlyBuyingCost += monthlyInsurance * 12;
      yearlyBuyingCost += monthlyMaintenance * 12;

      const currentRent = monthlyRentVal * Math.pow(1 + rentIncreaseRateVal / 100, year - 1);
      yearlyRentingCost += currentRent * 12;
      yearlyRentingCost += rentersInsuranceVal;

      const homeValue = homePriceVal * Math.pow(1 + appreciationRateVal / 100, year);
      const investmentValue = downPaymentVal * Math.pow(1 + investmentRateVal / 100, year);

      totalBuyingCost += yearlyBuyingCost;
      totalRentingCost += yearlyRentingCost;

      const netBuyingCost = totalBuyingCost - (homeValue - homePriceVal);
      buyingCosts.push(netBuyingCost);
      rentingCosts.push(totalRentingCost - (investmentValue - downPaymentVal));

      if (breakEvenYear === null && netBuyingCost < totalRentingCost - (investmentValue - downPaymentVal)) {
        breakEvenYear = year;
      }
    }

    const newCostTable = Array.from({ length: analysisPeriodVal + 1 }, (_, year) => ({
      year,
      buyCost: buyingCosts[year],
      rentCost: rentingCosts[year],
      difference: buyingCosts[year] - rentingCosts[year],
    }));

    let analysis = "";
    if (breakEvenYear && breakEvenYear <= analysisPeriodVal / 2) {
      analysis = `Buying is likely more cost-effective after ${breakEvenYear} years, especially if you plan to stay long-term. Consider market trends and personal financial goals.`;
    } else if (breakEvenYear) {
      analysis = `Buying becomes cheaper after ${breakEvenYear} years, but the long break-even period suggests renting may be better for shorter stays.`;
    } else {
      analysis = `Renting is more cost-effective over the ${analysisPeriodVal}-year period. Evaluate non-financial factors like stability and lifestyle preferences.`;
    }

    setResults({
      buyCost: formatCurrency(buyingCosts[analysisPeriodVal]),
      rentCost: formatCurrency(rentingCosts[analysisPeriodVal]),
      breakEven: breakEvenYear ? `Year ${breakEvenYear}` : "Not within analysis period",
    });
    setCostTable(newCostTable);
    setFinancialAnalysis(analysis);

    alert("Chart rendering not implemented in this demo.");
  };

  const saveCalculation = () => {
    const data = {
      homePrice,
      downPayment,
      mortgageRate,
      loanTerm,
      propertyTax,
      homeInsurance,
      maintenance,
      closingCosts,
      appreciation,
      monthlyRent,
      rentIncrease,
      rentersInsurance,
      analysisPeriod,
      investmentRate,
    };
    localStorage.setItem("rentVsBuyCalculation", JSON.stringify(data));
    setSuccessMessage("Calculation saved!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const loadCalculation = () => {
    const saved = localStorage.getItem("rentVsBuyCalculation");
    if (saved) {
      const data = JSON.parse(saved);
      setHomePrice(data.homePrice || "300000");
      setDownPayment(data.downPayment || "60000");
      setMortgageRate(data.mortgageRate || "4");
      setLoanTerm(data.loanTerm || "30");
      setPropertyTax(data.propertyTax || "1.2");
      setHomeInsurance(data.homeInsurance || "1200");
      setMaintenance(data.maintenance || "1");
      setClosingCosts(data.closingCosts || "5000");
      setAppreciation(data.appreciation || "3");
      setMonthlyRent(data.monthlyRent || "1500");
      setRentIncrease(data.rentIncrease || "2");
      setRentersInsurance(data.rentersInsurance || "200");
      setAnalysisPeriod(data.analysisPeriod || "10");
      setInvestmentRate(data.investmentRate || "5");
      calculateRentVsBuy();
    } else {
      setErrorMessage("No saved calculation found.");
    }
  };

  const exportResults = () => {
    if (!results) {
      setErrorMessage("No results to export.");
      return;
    }

    const exportContent = `
Rent vs. Buy Calculator Results
==============================
Total Cost of Buying: ${results.buyCost}
Total Cost of Renting: ${results.rentCost}
Break-Even Year: ${results.breakEven}

Buying Details:
- Home Price: $${homePrice}
- Down Payment: $${downPayment}
- Mortgage Rate: ${mortgageRate}%
- Loan Term: ${loanTerm} years
- Property Tax: ${propertyTax}%
- Home Insurance: $${homeInsurance}/year
- Maintenance: ${maintenance}% of home value
- Closing Costs: $${closingCosts}
- Appreciation: ${appreciation}%

Renting Details:
- Monthly Rent: $${monthlyRent}
- Annual Rent Increase: ${rentIncrease}%
- Renter’s Insurance: $${rentersInsurance}/year

Analysis Settings:
- Analysis Period: ${analysisPeriod} years
- Investment Return Rate: ${investmentRate}%

Cost Comparison:
${costTable
  .map(
    (row) =>
      `Year ${row.year}: Buying ${formatCurrency(row.buyCost)}, Renting ${formatCurrency(
        row.rentCost
      )}, Difference ${formatCurrency(row.difference)}`
  )
  .join("\n")}

Financial Analysis: ${financialAnalysis}
==============================
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rent_vs_buy_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!results) {
      setErrorMessage("No results to export.");
      return;
    }
    alert("PDF export not implemented in this demo.");
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-start">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-4xl w-full animate-slide-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Rent vs. Buy Calculator</h1>
        </div>
        {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 text-sm mt-2">{successMessage}</div>}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Buying Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Home Price ($)",
                id: "home-price",
                value: homePrice,
                setter: setHomePrice,
                type: "number",
                placeholder: "e.g., 300000",
                min: "0",
              },
              {
                label: "Down Payment ($)",
                id: "down-payment",
                value: downPayment,
                setter: setDownPayment,
                type: "number",
                placeholder: "e.g., 60000",
                min: "0",
              },
              {
                label: "Mortgage Interest Rate (%)",
                id: "mortgage-rate",
                value: mortgageRate,
                setter: setMortgageRate,
                type: "number",
                step: "0.01",
                placeholder: "e.g., 4",
                min: "0",
              },
              {
                label: "Loan Term (Years)",
                id: "loan-term",
                value: loanTerm,
                setter: setLoanTerm,
                type: "number",
                placeholder: "e.g., 30",
                min: "1",
              },
              {
                label: "Annual Property Tax (%)",
                id: "property-tax",
                value: propertyTax,
                setter: setPropertyTax,
                type: "number",
                step: "0.01",
                placeholder: "e.g., 1.2",
                min: "0",
              },
              {
                label: "Annual Home Insurance ($)",
                id: "home-insurance",
                value: homeInsurance,
                setter: setHomeInsurance,
                type: "number",
                placeholder: "e.g., 1200",
                min: "0",
              },
              {
                label: "Annual Maintenance (% of Home Value)",
                id: "maintenance",
                value: maintenance,
                setter: setMaintenance,
                type: "number",
                step: "0.01",
                placeholder: "e.g., 1",
                min: "0",
              },
              {
                label: "Closing Costs ($)",
                id: "closing-costs",
                value: closingCosts,
                setter: setClosingCosts,
                type: "number",
                placeholder: "e.g., 5000",
                min: "0",
              },
              {
                label: "Annual Home Appreciation (%)",
                id: "appreciation",
                value: appreciation,
                setter: setAppreciation,
                type: "number",
                step: "0.01",
                placeholder: "e.g., 3",
                min: "0",
              },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-600 mb-2">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  step={field.step}
                  min={field.min}
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Renting Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Monthly Rent ($)",
                id: "monthly-rent",
                value: monthlyRent,
                setter: setMonthlyRent,
                type: "number",
                placeholder: "e.g., 1500",
                min: "0",
              },
              {
                label: "Annual Rent Increase (%)",
                id: "rent-increase",
                value: rentIncrease,
                setter: setRentIncrease,
                type: "number",
                step: "0.01",
                placeholder: "e.g., 2",
                min: "0",
              },
              {
                label: "Renter’s Insurance ($/year)",
                id: "renters-insurance",
                value: rentersInsurance,
                setter: setRentersInsurance,
                type: "number",
                placeholder: "e.g., 200",
                min: "0",
              },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-600 mb-2">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  step={field.step}
                  min={field.min}
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Analysis Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Analysis Period (Years)",
                id: "analysis-period",
                value: analysisPeriod,
                setter: setAnalysisPeriod,
                type: "number",
                placeholder: "e.g., 10",
                min: "1",
              },
              {
                label: "Investment Return Rate (%)",
                id: "investment-rate",
                value: investmentRate,
                setter: setInvestmentRate,
                type: "number",
                step: "0.01",
                placeholder: "e.g., 5",
                min: "0",
              },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-600 mb-2">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  step={field.step}
                  min={field.min}
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={calculateRentVsBuy}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Calculate
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
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Total Cost of Buying</h3>
                <p className="text-2xl font-bold text-gray-800">{results.buyCost}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Total Cost of Renting</h3>
                <p className="text-2xl font-bold text-gray-800">{results.rentCost}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Break-Even Year</h3>
                <p className="text-2xl font-bold text-gray-800">{results.breakEven}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Year</th>
                      <th className="p-2">Buying Cost ($)</th>
                      <th className="p-2">Renting Cost ($)</th>
                      <th className="p-2">Difference ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costTable.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                        <td className="p-2">{row.year}</td>
                        <td className="p-2">{formatCurrency(row.buyCost)}</td>
                        <td className="p-2">{formatCurrency(row.rentCost)}</td>
                        <td className="p-2">{formatCurrency(row.difference)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Analysis</h3>
              <p className="text-gray-600">{financialAnalysis}</p>
            </div>
            <div className="mt-6 flex gap-4 flex-wrap">
              <button
                onClick={exportPDF}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Export as PDF
              </button>
              <button
                onClick={exportResults}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Export as Text
              </button>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        input:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
        }
        @media (max-width: 640px) {
          .flex-wrap {
            flex-direction: column;
            align-items: stretch;
          }
          button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
