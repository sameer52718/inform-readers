"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("mortgage");
  const [homePrice, setHomePrice] = useState("300000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [loanTerm, setLoanTerm] = useState("30");
  const [interestRate, setInterestRate] = useState("4.5");
  const [propertyTax, setPropertyTax] = useState("1.2");
  const [insurance, setInsurance] = useState("1200");
  const [annualIncome, setAnnualIncome] = useState("80000");
  const [monthlyDebt, setMonthlyDebt] = useState("500");
  const [affordDownPayment, setAffordDownPayment] = useState("40000");
  const [affordInterestRate, setAffordInterestRate] = useState("4.5");
  const [purchasePrice, setPurchasePrice] = useState("250000");
  const [rentalIncome, setRentalIncome] = useState("18000");
  const [annualExpenses, setAnnualExpenses] = useState("6000");
  const [appreciationRate, setAppreciationRate] = useState("3");
  const [investmentPeriod, setInvestmentPeriod] = useState("5");
  const [prop1Price, setProp1Price] = useState("300000");
  const [prop1Rent, setProp1Rent] = useState("1500");
  const [prop1Expenses, setProp1Expenses] = useState("5000");
  const [prop2Price, setProp2Price] = useState("350000");
  const [prop2Rent, setProp2Rent] = useState("1700");
  const [prop2Expenses, setProp2Expenses] = useState("6000");
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const switchTab = (tab) => {
    setActiveTab(tab);
    setResults(null);
    setErrorMessage("");
  };

  const formatCurrency = (amount) => `$${parseFloat(amount || 0).toFixed(2)}`;

  const calculateMortgage = () => {
    setErrorMessage("");
    const homePriceVal = parseFloat(homePrice);
    const downPaymentPercentVal = parseFloat(downPaymentPercent);
    const loanTermVal = parseFloat(loanTerm);
    const interestRateVal = parseFloat(interestRate) / 100;
    const propertyTaxVal = parseFloat(propertyTax) / 100;
    const insuranceVal = parseFloat(insurance);

    if (
      isNaN(homePriceVal) ||
      isNaN(downPaymentPercentVal) ||
      isNaN(loanTermVal) ||
      isNaN(interestRateVal) ||
      isNaN(propertyTaxVal) ||
      isNaN(insuranceVal)
    ) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }
    if (
      homePriceVal <= 0 ||
      downPaymentPercentVal < 0 ||
      loanTermVal <= 0 ||
      interestRateVal < 0 ||
      propertyTaxVal < 0 ||
      insuranceVal < 0
    ) {
      setErrorMessage("Inputs must be non-negative; home price and loan term must be positive.");
      return;
    }
    if (downPaymentPercentVal > 100) {
      setErrorMessage("Down payment percentage cannot exceed 100%.");
      return;
    }

    const downPayment = homePriceVal * (downPaymentPercentVal / 100);
    const loanAmount = homePriceVal - downPayment;
    const monthlyRate = interestRateVal / 12;
    const totalPayments = loanTermVal * 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    const monthlyTax = (homePriceVal * propertyTaxVal) / 12;
    const monthlyInsurance = insuranceVal / 12;
    const totalMonthlyPayment = monthlyPayment + monthlyTax + monthlyInsurance;
    const totalInterest = (monthlyPayment * totalPayments - loanAmount).toFixed(2);

    setResults({
      loanAmount: formatCurrency(loanAmount),
      monthlyPayment: formatCurrency(monthlyPayment),
      monthlyTax: formatCurrency(monthlyTax),
      monthlyInsurance: formatCurrency(monthlyInsurance),
      totalMonthlyPayment: formatCurrency(totalMonthlyPayment),
      totalInterest: formatCurrency(totalInterest),
    });

    alert("Chart rendering not implemented in this demo.");
  };

  const calculateAffordability = () => {
    setErrorMessage("");
    const annualIncomeVal = parseFloat(annualIncome);
    const monthlyDebtVal = parseFloat(monthlyDebt);
    const downPaymentVal = parseFloat(affordDownPayment);
    const interestRateVal = parseFloat(affordInterestRate) / 100;

    if (isNaN(annualIncomeVal) || isNaN(monthlyDebtVal) || isNaN(downPaymentVal) || isNaN(interestRateVal)) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }
    if (annualIncomeVal <= 0 || monthlyDebtVal < 0 || downPaymentVal < 0 || interestRateVal < 0) {
      setErrorMessage("Annual income must be positive; other inputs cannot be negative.");
      return;
    }

    const monthlyIncome = annualIncomeVal / 12;
    const dtiRatio = 0.36;
    const maxMonthlyPayment = monthlyIncome * dtiRatio - monthlyDebtVal;
    const loanTerm = 30 * 12;
    const monthlyRate = interestRateVal / 12;
    const loanAmount =
      (maxMonthlyPayment * (Math.pow(1 + monthlyRate, loanTerm) - 1)) /
      (monthlyRate * Math.pow(1 + monthlyRate, loanTerm));
    const maxHomePrice = loanAmount + downPaymentVal;

    setResults({
      monthlyIncome: formatCurrency(monthlyIncome),
      maxMonthlyPayment: formatCurrency(maxMonthlyPayment),
      loanAmount: formatCurrency(loanAmount),
      maxHomePrice: formatCurrency(maxHomePrice),
    });

    alert("Chart rendering not implemented in this demo.");
  };

  const calculateROI = () => {
    setErrorMessage("");
    const purchasePriceVal = parseFloat(purchasePrice);
    const rentalIncomeVal = parseFloat(rentalIncome);
    const annualExpensesVal = parseFloat(annualExpenses);
    const appreciationRateVal = parseFloat(appreciationRate) / 100;
    const investmentPeriodVal = parseFloat(investmentPeriod);

    if (
      isNaN(purchasePriceVal) ||
      isNaN(rentalIncomeVal) ||
      isNaN(annualExpensesVal) ||
      isNaN(appreciationRateVal) ||
      isNaN(investmentPeriodVal)
    ) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }
    if (purchasePriceVal <= 0 || rentalIncomeVal < 0 || annualExpensesVal < 0 || investmentPeriodVal <= 0) {
      setErrorMessage(
        "Purchase price and investment period must be positive; other inputs cannot be negative."
      );
      return;
    }

    const netOperatingIncome = rentalIncomeVal - annualExpensesVal;
    const capRate = ((netOperatingIncome / purchasePriceVal) * 100).toFixed(2);
    const futureValue = purchasePriceVal * Math.pow(1 + appreciationRateVal, investmentPeriodVal);
    const totalReturn = futureValue - purchasePriceVal + netOperatingIncome * investmentPeriodVal;
    const annualizedROI = (
      (Math.pow(totalReturn / purchasePriceVal + 1, 1 / investmentPeriodVal) - 1) *
      100
    ).toFixed(2);

    setResults({
      netOperatingIncome: formatCurrency(netOperatingIncome),
      capRate: `${capRate}%`,
      futureValue: formatCurrency(futureValue),
      totalReturn: formatCurrency(totalReturn),
      annualizedROI: `${annualizedROI}%`,
    });

    alert("Chart rendering not implemented in this demo.");
  };

  const compareProperties = () => {
    setErrorMessage("");
    const prop1PriceVal = parseFloat(prop1Price);
    const prop1RentVal = parseFloat(prop1Rent) * 12;
    const prop1ExpensesVal = parseFloat(prop1Expenses);
    const prop2PriceVal = parseFloat(prop2Price);
    const prop2RentVal = parseFloat(prop2Rent) * 12;
    const prop2ExpensesVal = parseFloat(prop2Expenses);

    if (
      isNaN(prop1PriceVal) ||
      isNaN(prop1RentVal) ||
      isNaN(prop1ExpensesVal) ||
      isNaN(prop2PriceVal) ||
      isNaN(prop2RentVal) ||
      isNaN(prop2ExpensesVal)
    ) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }
    if (
      prop1PriceVal <= 0 ||
      prop1RentVal < 0 ||
      prop1ExpensesVal < 0 ||
      prop2PriceVal <= 0 ||
      prop2RentVal < 0 ||
      prop2ExpensesVal < 0
    ) {
      setErrorMessage("Property prices must be positive; other inputs cannot be negative.");
      return;
    }

    const prop1NOI = prop1RentVal - prop1ExpensesVal;
    const prop2NOI = prop2RentVal - prop2ExpensesVal;
    const prop1CapRate = ((prop1NOI / prop1PriceVal) * 100).toFixed(2);
    const prop2CapRate = ((prop2NOI / prop2PriceVal) * 100).toFixed(2);

    setResults({
      prop1: {
        price: formatCurrency(prop1PriceVal),
        noi: formatCurrency(prop1NOI),
        capRate: `${prop1CapRate}%`,
      },
      prop2: {
        price: formatCurrency(prop2PriceVal),
        noi: formatCurrency(prop2NOI),
        capRate: `${prop2CapRate}%`,
      },
      recommendation: prop1CapRate > prop2CapRate ? "Property 1" : "Property 2",
    });

    alert("Chart rendering not implemented in this demo.");
  };

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-start">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Real Estate Calculator</h1>
        </div>
        <div className="flex border-b mb-6">
          {["mortgage", "affordability", "investment", "comparison"].map((tab) => (
            <div
              key={tab}
              className={`tab flex-1 text-center py-4 font-semibold ${
                activeTab === tab ? "border-b-2 border-red-500 text-red-500" : "border-b-2 border-transparent"
              } cursor-pointer`}
              onClick={() => switchTab(tab)}
            >
              {tab === "mortgage"
                ? "Mortgage Calculator"
                : tab === "affordability"
                ? "Affordability"
                : tab === "investment"
                ? "Investment ROI"
                : "Property Comparison"}
            </div>
          ))}
        </div>
        {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
        {activeTab === "mortgage" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Mortgage Calculator</h2>
            <p className="text-sm text-gray-600">Calculate mortgage payments and costs.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Home Price ($)",
                  id: "homePrice",
                  value: homePrice,
                  setter: setHomePrice,
                  type: "number",
                  min: "0",
                },
                {
                  label: "Down Payment (%)",
                  id: "downPaymentPercent",
                  value: downPaymentPercent,
                  setter: setDownPaymentPercent,
                  type: "number",
                  min: "0",
                  max: "100",
                },
                {
                  label: "Loan Term (Years)",
                  id: "loanTerm",
                  value: loanTerm,
                  setter: setLoanTerm,
                  type: "number",
                  min: "1",
                },
                {
                  label: "Interest Rate (%)",
                  id: "interestRate",
                  value: interestRate,
                  setter: setInterestRate,
                  type: "number",
                  step: "0.01",
                  min: "0",
                },
                {
                  label: "Property Tax (%)",
                  id: "propertyTax",
                  value: propertyTax,
                  setter: setPropertyTax,
                  type: "number",
                  step: "0.01",
                  min: "0",
                },
                {
                  label: "Home Insurance ($/year)",
                  id: "insurance",
                  value: insurance,
                  setter: setInsurance,
                  type: "number",
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
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={calculateMortgage}
              className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Calculate
            </button>
            {results && (
              <div className="result-card p-6 bg-gray-200 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-gray-900">Mortgage Details</h3>
                <p>
                  <strong>Loan Amount:</strong> {results.loanAmount}
                </p>
                <p>
                  <strong>Monthly Payment (Principal + Interest):</strong> {results.monthlyPayment}
                </p>
                <p>
                  <strong>Monthly Property Tax:</strong> {results.monthlyTax}
                </p>
                <p>
                  <strong>Monthly Insurance:</strong> {results.monthlyInsurance}
                </p>
                <p>
                  <strong>Total Monthly Payment:</strong> {results.totalMonthlyPayment}
                </p>
                <p>
                  <strong>Total Interest Paid:</strong> {results.totalInterest}
                </p>
              </div>
            )}
          </div>
        )}
        {activeTab === "affordability" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Affordability Calculator</h2>
            <p className="text-sm text-gray-600">Determine how much home you can afford.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Annual Income ($)",
                  id: "annualIncome",
                  value: annualIncome,
                  setter: setAnnualIncome,
                  type: "number",
                  min: "0",
                },
                {
                  label: "Monthly Debt Payments ($)",
                  id: "monthlyDebt",
                  value: monthlyDebt,
                  setter: setMonthlyDebt,
                  type: "number",
                  min: "0",
                },
                {
                  label: "Down Payment ($)",
                  id: "affordDownPayment",
                  value: affordDownPayment,
                  setter: setAffordDownPayment,
                  type: "number",
                  min: "0",
                },
                {
                  label: "Interest Rate (%)",
                  id: "affordInterestRate",
                  value: affordInterestRate,
                  setter: setAffordInterestRate,
                  type: "number",
                  step: "0.01",
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
                    step={field.step}
                    min={field.min}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={calculateAffordability}
              className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Calculate
            </button>
            {results && (
              <div className="result-card p-6 bg-gray-200 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-gray-900">Affordability Details</h3>
                <p>
                  <strong>Monthly Income:</strong> {results.monthlyIncome}
                </p>
                <p>
                  <strong>Max Monthly Payment:</strong> {results.maxMonthlyPayment}
                </p>
                <p>
                  <strong>Estimated Loan Amount:</strong> {results.loanAmount}
                </p>
                <p>
                  <strong>Maximum Home Price:</strong> {results.maxHomePrice}
                </p>
              </div>
            )}
          </div>
        )}
        {activeTab === "investment" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Investment ROI Calculator</h2>
            <p className="text-sm text-gray-600">Evaluate returns on real estate investments.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Purchase Price ($)",
                  id: "purchasePrice",
                  value: purchasePrice,
                  setter: setPurchasePrice,
                  type: "number",
                  min: "0",
                },
                {
                  label: "Annual Rental Income ($)",
                  id: "rentalIncome",
                  value: rentalIncome,
                  setter: setRentalIncome,
                  type: "number",
                  min: "0",
                },
                {
                  label: "Annual Expenses ($)",
                  id: "annualExpenses",
                  value: annualExpenses,
                  setter: setAnnualExpenses,
                  type: "number",
                  min: "0",
                },
                {
                  label: "Appreciation Rate (%)",
                  id: "appreciationRate",
                  value: appreciationRate,
                  setter: setAppreciationRate,
                  type: "number",
                  step: "0.01",
                  min: "0",
                },
                {
                  label: "Investment Period (Years)",
                  id: "investmentPeriod",
                  value: investmentPeriod,
                  setter: setInvestmentPeriod,
                  type: "number",
                  min: "1",
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
                    step={field.step}
                    min={field.min}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={calculateROI}
              className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Calculate
            </button>
            {results && (
              <div className="result-card p-6 bg-gray-200 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-gray-900">Investment ROI Details</h3>
                <p>
                  <strong>Net Operating Income:</strong> {results.netOperatingIncome}
                </p>
                <p>
                  <strong>Capitalization Rate:</strong> {results.capRate}
                </p>
                <p>
                  <strong>Future Property Value:</strong> {results.futureValue}
                </p>
                <p>
                  <strong>Total Return:</strong> {results.totalReturn}
                </p>
                <p>
                  <strong>Annualized ROI:</strong> {results.annualizedROI}
                </p>
              </div>
            )}
          </div>
        )}
        {activeTab === "comparison" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Property Comparison</h2>
            <p className="text-sm text-gray-600">Compare two properties based on financial metrics.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Property 1</h3>
                {[
                  {
                    label: "Price ($)",
                    id: "prop1Price",
                    value: prop1Price,
                    setter: setProp1Price,
                    type: "number",
                    min: "0",
                  },
                  {
                    label: "Monthly Rent ($)",
                    id: "prop1Rent",
                    value: prop1Rent,
                    setter: setProp1Rent,
                    type: "number",
                    min: "0",
                  },
                  {
                    label: "Annual Expenses ($)",
                    id: "prop1Expenses",
                    value: prop1Expenses,
                    setter: setProp1Expenses,
                    type: "number",
                    min: "0",
                  },
                ].map((field) => (
                  <div key={field.id} className="mb-4">
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-600 mb-2">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      min={field.min}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Property 2</h3>
                {[
                  {
                    label: "Price ($)",
                    id: "prop2Price",
                    value: prop2Price,
                    setter: setProp2Price,
                    type: "number",
                    min: "0",
                  },
                  {
                    label: "Monthly Rent ($)",
                    id: "prop2Rent",
                    value: prop2Rent,
                    setter: setProp2Rent,
                    type: "number",
                    min: "0",
                  },
                  {
                    label: "Annual Expenses ($)",
                    id: "prop2Expenses",
                    value: prop2Expenses,
                    setter: setProp2Expenses,
                    type: "number",
                    min: "0",
                  },
                ].map((field) => (
                  <div key={field.id} className="mb-4">
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-600 mb-2">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      min={field.min}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={compareProperties}
              className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Compare
            </button>
            {results && (
              <div className="result-card p-6 bg-gray-200 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-gray-900">Comparison Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900">Property 1</h4>
                    <p>
                      <strong>Price:</strong> {results.prop1.price}
                    </p>
                    <p>
                      <strong>Annual Net Income:</strong> {results.prop1.noi}
                    </p>
                    <p>
                      <strong>Cap Rate:</strong> {results.prop1.capRate}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-gray-900">Property 2</h4>
                    <p>
                      <strong>Price:</strong> {results.prop2.price}
                    </p>
                    <p>
                      <strong>Annual Net Income:</strong> {results.prop2.noi}
                    </p>
                    <p>
                      <strong>Cap Rate:</strong> {results.prop2.capRate}
                    </p>
                  </div>
                </div>
                <p className="mt-4">
                  <strong>Recommendation:</strong> {results.recommendation} offers a better return based on
                  capitalization rate.
                </p>
              </div>
            )}
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
          .tab {
            font-size: 0.9rem;
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
