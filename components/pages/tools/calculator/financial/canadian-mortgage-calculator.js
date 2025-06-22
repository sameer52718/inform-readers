"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [inputs, setInputs] = useState({
    homePrice: "",
    downPayment: "",
    interestRate: "",
    loanTerm: "30",
    paymentFrequency: "monthly",
    propertyTax: "",
    homeInsurance: "",
    stressTest: "no",
  });
  const [results, setResults] = useState(null);
  const [amortizationData, setAmortizationData] = useState([]);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const lineChartInstance = useRef(null);

  useEffect(() => {
    if (pieChartRef.current && lineChartRef.current) {
      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: ["Principal & Interest", "Property Tax", "Home Insurance", "CMHC Insurance"],
          datasets: [
            {
              data: [0, 0, 0, 0],
              backgroundColor: ["#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Payment Breakdown" },
          },
        },
      });

      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Loan Balance",
              data: [],
              borderColor: "#ef4444",
              fill: false,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Balance ($)" } },
            x: { title: { display: true, text: "Period" } },
          },
          plugins: {
            title: { display: true, text: "Loan Balance Over Time" },
          },
        },
      });
    }

    return () => {
      if (pieChartInstance.current) pieChartInstance.current.destroy();
      if (lineChartInstance.current) lineChartInstance.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (results && amortizationData.length > 0) {
      const periodsPerYear = {
        monthly: 12,
        "bi-weekly": 26,
        weekly: 52,
      }[inputs.paymentFrequency];
      pieChartInstance.current.data.datasets[0].data = [
        results.payment,
        (parseFloat(inputs.propertyTax) || 0) / periodsPerYear,
        (parseFloat(inputs.homeInsurance) || 0) / periodsPerYear,
        results.cmhcMonthly,
      ];
      pieChartInstance.current.update();

      lineChartInstance.current.data.labels = amortizationData.map((_, index) => index + 1);
      lineChartInstance.current.data.datasets[0].data = amortizationData.map((item) => item.balance);
      lineChartInstance.current.update();
    }
  }, [results, amortizationData, inputs.paymentFrequency]);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;

  const calculateCMHCInsurance = (loanAmount, downPaymentPercentage) => {
    if (downPaymentPercentage >= 20) return 0;
    const cmhcRates = [
      { maxDown: 5, rate: 4.0 },
      { maxDown: 10, rate: 3.1 },
      { maxDown: 15, rate: 2.8 },
      { maxDown: 20, rate: 2.4 },
    ];
    const rate = cmhcRates.find((r) => downPaymentPercentage <= r.maxDown).rate;
    return loanAmount * (rate / 100);
  };

  const calculateMortgage = () => {
    const homePrice = parseFloat(inputs.homePrice);
    const downPayment = parseFloat(inputs.downPayment);
    let interestRate = parseFloat(inputs.interestRate) / 100;
    const loanTerm = parseInt(inputs.loanTerm);
    const paymentFrequency = inputs.paymentFrequency;
    const propertyTax = parseFloat(inputs.propertyTax) || 0;
    const homeInsurance = parseFloat(inputs.homeInsurance) || 0;
    const applyStressTest = inputs.stressTest === "yes";

    if (isNaN(homePrice) || homePrice <= 0) {
      alert("Please enter a valid home price");
      return;
    }
    if (isNaN(downPayment) || downPayment < 0 || downPayment >= homePrice) {
      alert("Please enter a valid down payment");
      return;
    }
    if (isNaN(interestRate) || interestRate <= 0) {
      alert("Please enter a valid interest rate");
      return;
    }

    const downPaymentPercentage = (downPayment / homePrice) * 100;
    const baseLoanAmount = homePrice - downPayment;
    const cmhcInsurance = calculateCMHCInsurance(baseLoanAmount, downPaymentPercentage);
    const totalLoan = baseLoanAmount + cmhcInsurance;

    const frequencySettings = {
      monthly: { periodsPerYear: 12, label: "Month" },
      "bi-weekly": { periodsPerYear: 26, label: "Bi-Week" },
      weekly: { periodsPerYear: 52, label: "Week" },
    };
    const { periodsPerYear, label } = frequencySettings[paymentFrequency];
    const totalPeriods = loanTerm * periodsPerYear;
    const ratePerPeriod = interestRate / periodsPerYear;

    let stressTestRate = interestRate;
    if (applyStressTest) {
      stressTestRate = Math.max(0.0525, interestRate + 0.02);
    }
    const stressRatePerPeriod = stressTestRate / periodsPerYear;

    const payment =
      (totalLoan * (ratePerPeriod * Math.pow(1 + ratePerPeriod, totalPeriods))) /
      (Math.pow(1 + ratePerPeriod, totalPeriods) - 1);
    const stressPayment =
      (totalLoan * (stressRatePerPeriod * Math.pow(1 + stressRatePerPeriod, totalPeriods))) /
      (Math.pow(1 + stressRatePerPeriod, totalPeriods) - 1);

    const cmhcMonthly = cmhcInsurance / totalPeriods;
    const totalPayment =
      payment + propertyTax / periodsPerYear + homeInsurance / periodsPerYear + cmhcMonthly;

    let balance = totalLoan;
    let totalInterestPaid = 0;
    const newAmortizationData = [];
    for (let period = 1; period <= totalPeriods; period++) {
      const interest = balance * ratePerPeriod;
      const principal = payment - interest;
      balance -= principal;
      totalInterestPaid += interest;
      newAmortizationData.push({
        period,
        payment: totalPayment,
        principal,
        interest,
        balance: Math.max(balance, 0),
      });
    }

    setResults({
      totalLoan,
      cmhcInsurance,
      payment,
      totalPayment,
      totalInterestPaid,
      stressTestRate: applyStressTest ? stressTestRate * 100 : "N/A",
      cmhcMonthly,
    });
    setAmortizationData(newAmortizationData);
  };

  const exportAmortization = () => {
    if (amortizationData.length === 0) {
      alert("No amortization data to export");
      return;
    }

    const csvContent = [
      "Period,Payment,Principal,Interest,Balance",
      ...amortizationData.map(
        (item) =>
          `${item.period},${item.payment.toFixed(2)},${item.principal.toFixed(2)},${item.interest.toFixed(
            2
          )},${item.balance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "canadian_mortgage_amortization.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white min-h-screen flex justify-center items-center p-5">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-5xl w-full flex gap-8 flex-col md:flex-row">
          {/* Calculator Section */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-5 text-center">
              Canadian Mortgage Calculator
            </h1>
            {[
              {
                label: "Home Price ($)",
                id: "homePrice",
                type: "number",
                step: "1000",
                placeholder: "Enter home price",
              },
              {
                label: "Down Payment ($)",
                id: "downPayment",
                type: "number",
                step: "1000",
                placeholder: "Enter down payment",
              },
              {
                label: "Annual Interest Rate (%)",
                id: "interestRate",
                type: "number",
                step: "0.01",
                placeholder: "Enter interest rate",
              },
              {
                label: "Amortization Period (Years)",
                id: "loanTerm",
                type: "select",
                options: ["30", "25", "20", "15", "10"].map((y) => ({ value: y, label: `${y} Years` })),
              },
              {
                label: "Payment Frequency",
                id: "paymentFrequency",
                type: "select",
                options: [
                  { value: "monthly", label: "Monthly" },
                  { value: "bi-weekly", label: "Bi-Weekly" },
                  { value: "weekly", label: "Weekly" },
                ],
              },
              {
                label: "Annual Property Tax ($)",
                id: "propertyTax",
                type: "number",
                step: "100",
                placeholder: "Enter annual property tax",
              },
              {
                label: "Annual Home Insurance ($)",
                id: "homeInsurance",
                type: "number",
                step: "100",
                placeholder: "Enter annual home insurance",
              },
              {
                label: "Apply Stress Test",
                id: "stressTest",
                type: "select",
                options: [
                  { value: "no", label: "No" },
                  { value: "yes", label: "Yes (Greater of 5.25% or contract rate + 2%)" },
                ],
              },
            ].map(({ label, id, type, step, placeholder, options }) => (
              <div key={id} className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
                {type === "select" ? (
                  <select
                    value={inputs[id]}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:border-red-500 focus:ring focus:ring-red-200"
                  >
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    value={inputs[id]}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                    step={step}
                    placeholder={placeholder}
                    required={id !== "propertyTax" && id !== "homeInsurance"}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:border-red-500 focus:ring focus:ring-red-200"
                  />
                )}
              </div>
            ))}
            <button
              onClick={calculateMortgage}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-transform hover:-translate-y-0.5"
            >
              Calculate Mortgage
            </button>
            {results && (
              <div className="bg-white p-5 rounded-lg mt-5">
                <p>
                  <strong>Total Loan Amount:</strong> {formatCurrency(results.totalLoan)}
                </p>
                <p>
                  <strong>CMHC Insurance:</strong> {formatCurrency(results.cmhcInsurance)}
                </p>
                <p>
                  <strong>Payment Amount:</strong> {formatCurrency(results.totalPayment)}
                </p>
                <p>
                  <strong>Total Interest Paid:</strong> {formatCurrency(results.totalInterestPaid)}
                </p>
                <p>
                  <strong>Stress Test Rate:</strong>{" "}
                  {results.stressTestRate === "N/A" ? "N/A" : `${results.stressTestRate.toFixed(2)}%`}
                </p>
              </div>
            )}
            <div className="mt-5">
              <canvas ref={pieChartRef} />
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-white rounded-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-5 text-center">Amortization Schedule</h1>
            {amortizationData.length > 0 && (
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-red-500 text-white">
                    {["Period", "Payment", "Principal", "Interest", "Balance"].map((header) => (
                      <th key={header} className="p-3 text-right font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {amortizationData.slice(0, 60).map((item) => (
                    <tr key={item.period} className="even:bg-gray-50">
                      <td className="p-3 text-right">
                        {item.period}{" "}
                        {inputs.paymentFrequency === "monthly"
                          ? "Month"
                          : inputs.paymentFrequency === "bi-weekly"
                          ? "Bi-Week"
                          : "Week"}
                      </td>
                      <td className="p-3 text-right">{formatCurrency(item.payment)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.principal)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.interest)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-5">
              <canvas ref={lineChartRef} />
            </div>
            <button
              onClick={exportAmortization}
              className="w-full bg-green-500 text-white p-3 rounded-lg mt-5 hover:bg-green-600 transition-transform hover:-translate-y-0.5"
            >
              Export Amortization (CSV)
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
          }
          .max-h-\[700px\] {
            max-height: 500px;
          }
        }
      `}</style>
    </>
  );
}
