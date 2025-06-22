"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [colleges, setColleges] = useState([
    { name: "", tuition: "", roomBoard: "", books: "", transportation: "", personal: "" },
  ]);
  const [years, setYears] = useState("");
  const [costEscalation, setCostEscalation] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [scholarships, setScholarships] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanRate, setLoanRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [annualContribution, setAnnualContribution] = useState("");
  const [investmentRate, setInvestmentRate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [costData, setCostData] = useState([]);
  const [history, setHistory] = useState(
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("collegeCostHistory")) || [] : []
  );
  const [comparisonData, setComparisonData] = useState([]);

  const formatCurrency = (amount, curr) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[curr]}${parseFloat(amount).toFixed(2)}`;
  };

  const addCollegeRow = () => {
    setColleges([
      ...colleges,
      { name: "", tuition: "", roomBoard: "", books: "", transportation: "", personal: "" },
    ]);
  };

  const removeCollegeRow = (index) => {
    setColleges(colleges.filter((_, i) => i !== index));
  };

  const updateCollege = (index, field, value) => {
    const newColleges = [...colleges];
    newColleges[index][field] = value;
    setColleges(newColleges);
  };

  const calculateCosts = () => {
    const parsedYears = parseInt(years) || 0;
    const parsedCostEscalation = parseFloat(costEscalation) / 100 || 0;
    const parsedInflationRate = parseFloat(inflationRate) / 100 || 0;
    const parsedScholarships = parseFloat(scholarships) || 0;
    const parsedLoanAmount = parseFloat(loanAmount) || 0;
    const parsedLoanRate = parseFloat(loanRate) / 100 || 0;
    const parsedLoanTerm = parseInt(loanTerm) || 0;
    const parsedCurrentSavings = parseFloat(currentSavings) || 0;
    const parsedAnnualContribution = parseFloat(annualContribution) || 0;
    const parsedInvestmentRate = parseFloat(investmentRate) / 100 || 0;

    const parsedColleges = colleges
      .map((college) => ({
        name: college.name || "Unnamed College",
        tuition: parseFloat(college.tuition) || 0,
        roomBoard: parseFloat(college.roomBoard) || 0,
        books: parseFloat(college.books) || 0,
        transportation: parseFloat(college.transportation) || 0,
        personal: parseFloat(college.personal) || 0,
      }))
      .filter(
        (college) =>
          college.tuition > 0 ||
          college.roomBoard > 0 ||
          college.books > 0 ||
          college.transportation > 0 ||
          college.personal > 0
      );

    if (parsedColleges.length === 0) {
      alert("Please add at least one college with valid costs");
      return;
    }
    if (parsedYears <= 0) {
      alert("Please enter a valid number of years");
      return;
    }
    if (parsedLoanAmount > 0 && (parsedLoanRate <= 0 || parsedLoanTerm <= 0)) {
      alert("Please enter valid loan interest rate and term");
      return;
    }

    let totalCost = { tuition: 0, roomBoard: 0, books: 0, transportation: 0, personal: 0, total: 0 };
    let totalFutureCost = { tuition: 0, roomBoard: 0, books: 0, transportation: 0, personal: 0, total: 0 };
    let newCostData = [];
    let parsedCollegesWithTotals = [];

    parsedColleges.forEach((college) => {
      let yearTotals = [];
      let collegeTotal = { tuition: 0, roomBoard: 0, books: 0, transportation: 0, personal: 0, total: 0 };
      let collegeFutureTotal = {
        tuition: 0,
        roomBoard: 0,
        books: 0,
        transportation: 0,
        personal: 0,
        total: 0,
      };

      for (let year = 1; year <= parsedYears; year++) {
        const escalatedTuition = college.tuition * Math.pow(1 + parsedCostEscalation, year - 1);
        const escalatedRoomBoard = college.roomBoard * Math.pow(1 + parsedCostEscalation, year - 1);
        const escalatedBooks = college.books * Math.pow(1 + parsedCostEscalation, year - 1);
        const escalatedTransportation = college.transportation * Math.pow(1 + parsedCostEscalation, year - 1);
        const escalatedPersonal = college.personal * Math.pow(1 + parsedCostEscalation, year - 1);
        const yearTotal =
          escalatedTuition +
          escalatedRoomBoard +
          escalatedBooks +
          escalatedTransportation +
          escalatedPersonal;

        const futureTuition = escalatedTuition * Math.pow(1 + parsedInflationRate, year - 1);
        const futureRoomBoard = escalatedRoomBoard * Math.pow(1 + parsedInflationRate, year - 1);
        const futureBooks = escalatedBooks * Math.pow(1 + parsedInflationRate, year - 1);
        const futureTransportation = escalatedTransportation * Math.pow(1 + parsedInflationRate, year - 1);
        const futurePersonal = escalatedPersonal * Math.pow(1 + parsedInflationRate, year - 1);
        const futureYearTotal =
          futureTuition + futureRoomBoard + futureBooks + futureTransportation + futurePersonal;

        yearTotals.push({
          year,
          tuition: escalatedTuition,
          roomBoard: escalatedRoomBoard,
          books: escalatedBooks,
          transportation: escalatedTransportation,
          personal: escalatedPersonal,
          total: yearTotal,
        });

        newCostData.push({
          year,
          college: college.name,
          tuition: escalatedTuition,
          roomBoard: escalatedRoomBoard,
          books: escalatedBooks,
          transportation: escalatedTransportation,
          personal: escalatedPersonal,
          total: yearTotal,
        });

        collegeTotal.tuition += escalatedTuition;
        collegeTotal.roomBoard += escalatedRoomBoard;
        collegeTotal.books += escalatedBooks;
        collegeTotal.transportation += escalatedTransportation;
        collegeTotal.personal += escalatedPersonal;
        collegeTotal.total += yearTotal;

        collegeFutureTotal.tuition += futureTuition;
        collegeFutureTotal.roomBoard += futureRoomBoard;
        collegeFutureTotal.books += futureBooks;
        collegeFutureTotal.transportation += futureTransportation;
        collegeFutureTotal.personal += futurePersonal;
        collegeFutureTotal.total += futureYearTotal;

        totalCost.tuition += escalatedTuition;
        totalCost.roomBoard += escalatedRoomBoard;
        totalCost.books += escalatedBooks;
        totalCost.transportation += escalatedTransportation;
        totalCost.personal += escalatedPersonal;
        totalCost.total += yearTotal;

        totalFutureCost.tuition += futureTuition;
        totalFutureCost.roomBoard += futureRoomBoard;
        totalFutureCost.books += futureBooks;
        totalFutureCost.transportation += futureTransportation;
        totalFutureCost.personal += futurePersonal;
        totalFutureCost.total += futureYearTotal;
      }

      parsedCollegesWithTotals.push({
        name: college.name,
        yearTotals,
        total: collegeTotal,
        futureTotal: collegeFutureTotal,
      });
    });

    const totalScholarships = parsedScholarships * parsedYears;
    const totalLoans = parsedLoanAmount * parsedYears;

    let monthlyLoanPayment = 0;
    let totalLoanInterest = 0;
    if (totalLoans > 0) {
      const monthlyRate = parsedLoanRate / 12;
      const totalMonths = parsedLoanTerm * 12;
      monthlyLoanPayment = totalLoans * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -totalMonths)));
      totalLoanInterest = monthlyLoanPayment * totalMonths - totalLoans;
    }

    let savingsValue = parsedCurrentSavings;
    for (let year = 1; year <= parsedYears; year++) {
      savingsValue = savingsValue * (1 + parsedInvestmentRate) + parsedAnnualContribution;
    }

    const netCost = totalCost.total - totalScholarships - savingsValue;
    const netCostAfterLoans = netCost - totalLoans;

    setResults({
      totalCost: totalCost.total,
      netCost: netCostAfterLoans > 0 ? netCostAfterLoans : 0,
      totalLoan: totalLoans,
      monthlyLoanPayment,
      totalLoanInterest,
      savingsContribution: savingsValue,
      futureCost: totalFutureCost.total,
    });
    setCostData(newCostData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      totalCost: formatCurrency(totalCost.total, currency),
      netCost: formatCurrency(netCostAfterLoans > 0 ? netCostAfterLoans : 0, currency),
      totalLoan: formatCurrency(totalLoans, currency),
      monthlyLoanPayment: formatCurrency(monthlyLoanPayment, currency),
      totalLoanInterest: formatCurrency(totalLoanInterest, currency),
      savingsContribution: formatCurrency(savingsValue, currency),
      futureCost: formatCurrency(totalFutureCost.total, currency),
      colleges: parsedCollegesWithTotals.map((college) => ({
        name: college.name,
        total: formatCurrency(college.total.total, currency),
        tuition: formatCurrency(college.total.tuition, currency),
        roomBoard: formatCurrency(college.total.roomBoard, currency),
        books: formatCurrency(college.total.books, currency),
        transportation: formatCurrency(college.total.transportation, currency),
        personal: formatCurrency(college.total.personal, currency),
      })),
      inputs: {
        years: parsedYears,
        costEscalation: `${(parsedCostEscalation * 100).toFixed(2)}%`,
        inflationRate: `${(parsedInflationRate * 100).toFixed(2)}%`,
        scholarships: formatCurrency(parsedScholarships, currency),
        loanAmount: formatCurrency(parsedLoanAmount, currency),
        loanRate: `${(parsedLoanRate * 100).toFixed(2)}%`,
        loanTerm: `${parsedLoanTerm} years`,
        currentSavings: formatCurrency(parsedCurrentSavings, currency),
        annualContribution: formatCurrency(parsedAnnualContribution, currency),
        investmentRate: `${(parsedInvestmentRate * 100).toFixed(2)}%`,
      },
    };
    const newHistory = [...history, calculation];
    setHistory(newHistory);
    localStorage.setItem("collegeCostHistory", JSON.stringify(newHistory));

    alert("Charts not implemented in this demo.");
  };

  const compareColleges = () => {
    const parsedYears = parseInt(years) || 0;
    const parsedCostEscalation = parseFloat(costEscalation) / 100 || 0;
    const parsedScholarships = parseFloat(scholarships) || 0;
    const parsedLoanAmount = parseFloat(loanAmount) || 0;
    const parsedCurrentSavings = parseFloat(currentSavings) || 0;
    const parsedAnnualContribution = parseFloat(annualContribution) || 0;
    const parsedInvestmentRate = parseFloat(investmentRate) / 100 || 0;

    if (colleges.length === 0 || parsedYears <= 0) {
      alert("Please add at least one college and specify number of years");
      return;
    }

    let savingsValue = parsedCurrentSavings;
    for (let year = 1; year <= parsedYears; year++) {
      savingsValue = savingsValue * (1 + parsedInvestmentRate) + parsedAnnualContribution;
    }
    const totalScholarships = parsedScholarships * parsedYears;
    const totalLoans = parsedLoanAmount * parsedYears;

    const newComparisonData = colleges
      .map((college) => ({
        name: college.name || "Unnamed College",
        tuition: parseFloat(college.tuition) || 0,
        roomBoard: parseFloat(college.roomBoard) || 0,
        books: parseFloat(college.books) || 0,
        transportation: parseFloat(college.transportation) || 0,
        personal: parseFloat(college.personal) || 0,
      }))
      .filter(
        (college) =>
          college.tuition > 0 ||
          college.roomBoard > 0 ||
          college.books > 0 ||
          college.transportation > 0 ||
          college.personal > 0
      )
      .map((college) => {
        let collegeTotal = 0;
        for (let year = 1; year <= parsedYears; year++) {
          const escalatedTuition = college.tuition * Math.pow(1 + parsedCostEscalation, year - 1);
          const escalatedRoomBoard = college.roomBoard * Math.pow(1 + parsedCostEscalation, year - 1);
          const escalatedBooks = college.books * Math.pow(1 + parsedCostEscalation, year - 1);
          const escalatedTransportation =
            college.transportation * Math.pow(1 + parsedCostEscalation, year - 1);
          const escalatedPersonal = college.personal * Math.pow(1 + parsedCostEscalation, year - 1);
          collegeTotal +=
            escalatedTuition +
            escalatedRoomBoard +
            escalatedBooks +
            escalatedTransportation +
            escalatedPersonal;
        }

        const netCost = collegeTotal - totalScholarships - savingsValue;
        const netCostAfterLoans = netCost - totalLoans;

        return {
          name: college.name,
          totalCost: collegeTotal,
          netCost: netCostAfterLoans > 0 ? netCostAfterLoans : 0,
          totalLoan: totalLoans,
        };
      });

    setComparisonData(newComparisonData);
  };

  const exportCostBreakdown = () => {
    if (costData.length === 0) {
      alert("No cost data to export");
      return;
    }
    alert("Export not implemented in this demo.");
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full flex gap-8 flex-col md:flex-row animate-slide-in">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-red-500 mb-6 text-center">
            Advanced College Cost Calculator
          </h1>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Colleges</label>
            <div id="colleges-list">
              {colleges.map((college, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-2 mb-2">
                  {[
                    { placeholder: "College name", key: "name", type: "text" },
                    { placeholder: "Tuition ($/year)", key: "tuition", type: "number", step: "1000" },
                    { placeholder: "Room & Board ($/year)", key: "roomBoard", type: "number", step: "1000" },
                    { placeholder: "Books ($/year)", key: "books", type: "number", step: "100" },
                    {
                      placeholder: "Transportation ($/year)",
                      key: "transportation",
                      type: "number",
                      step: "100",
                    },
                    { placeholder: "Personal ($/year)", key: "personal", type: "number", step: "100" },
                  ].map(({ placeholder, key, type, step }) => (
                    <div key={key} className="relative flex-1">
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={college[key]}
                        onChange={(e) => updateCollege(index, key, e.target.value)}
                        step={step}
                        className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => removeCollegeRow(index)}
                    className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 md:w-auto"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addCollegeRow}
              className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 w-full mt-2"
            >
              Add College
            </button>
          </div>
          {[
            {
              label: "Number of Years",
              key: "years",
              type: "number",
              step: "1",
              value: years,
              onChange: (e) => setYears(e.target.value),
            },
            {
              label: "Annual Cost Escalation (%)",
              key: "costEscalation",
              type: "number",
              step: "0.01",
              value: costEscalation,
              onChange: (e) => setCostEscalation(e.target.value),
            },
            {
              label: "Annual Inflation Rate (%)",
              key: "inflationRate",
              type: "number",
              step: "0.01",
              value: inflationRate,
              onChange: (e) => setInflationRate(e.target.value),
            },
            {
              label: "Scholarships/Grants ($/year)",
              key: "scholarships",
              type: "number",
              step: "1000",
              value: scholarships,
              onChange: (e) => setScholarships(e.target.value),
            },
            {
              label: "Student Loan Amount ($/year)",
              key: "loanAmount",
              type: "number",
              step: "1000",
              value: loanAmount,
              onChange: (e) => setLoanAmount(e.target.value),
            },
            {
              label: "Loan Interest Rate (%)",
              key: "loanRate",
              type: "number",
              step: "0.01",
              value: loanRate,
              onChange: (e) => setLoanRate(e.target.value),
            },
            {
              label: "Loan Repayment Term (Years)",
              key: "loanTerm",
              type: "number",
              step: "1",
              value: loanTerm,
              onChange: (e) => setLoanTerm(e.target.value),
            },
            {
              label: "Current Savings ($)",
              key: "currentSavings",
              type: "number",
              step: "1000",
              value: currentSavings,
              onChange: (e) => setCurrentSavings(e.target.value),
            },
            {
              label: "Annual Contribution ($)",
              key: "annualContribution",
              type: "number",
              step: "1000",
              value: annualContribution,
              onChange: (e) => setAnnualContribution(e.target.value),
            },
            {
              label: "Investment Return Rate (%)",
              key: "investmentRate",
              type: "number",
              step: "0.01",
              value: investmentRate,
              onChange: (e) => setInvestmentRate(e.target.value),
            },
            {
              label: "Currency",
              key: "currency",
              type: "select",
              options: ["USD", "CAD", "EUR", "GBP"],
              value: currency,
              onChange: (e) => setCurrency(e.target.value),
            },
          ].map(({ label, key, type, step, value, onChange, options }) => (
            <div key={key} className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
              {type === "select" ? (
                <select
                  value={value}
                  onChange={onChange}
                  className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {`${opt === "USD" || opt === "CAD" ? "$" : opt === "EUR" ? "€" : "£"} ${opt}`}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  value={value}
                  onChange={onChange}
                  step={step}
                  className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                />
              )}
            </div>
          ))}
          <button
            onClick={calculateCosts}
            className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 w-full"
          >
            Calculate Costs
          </button>
          {results && (
            <div className="bg-gray-200 p-5 rounded-lg mt-6">
              {[
                { label: "Total Cost", value: results.totalCost },
                { label: "Net Cost (After Aid)", value: results.netCost },
                { label: "Total Loan Amount", value: results.totalLoan },
                { label: "Monthly Loan Payment", value: results.monthlyLoanPayment },
                { label: "Total Loan Interest", value: results.totalLoanInterest },
                { label: "Savings Contribution", value: results.savingsContribution },
                { label: "Future Cost (Inflated)", value: results.futureCost },
              ].map(({ label, value }) => (
                <p key={label} className="text-gray-700">
                  <strong>{label}:</strong> {formatCurrency(value, currency)}
                </p>
              ))}
            </div>
          )}
          <div className="mt-6">
            <p className="text-gray-600">Cost chart not implemented in this demo.</p>
          </div>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-500 mb-6 text-center">Cost Breakdown & History</h1>
          {costData.length > 0 && (
            <table className="w-full text-sm text-gray-600 mb-6">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3">Year</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Tuition</th>
                  <th className="p-3">Room & Board</th>
                  <th className="p-3">Books</th>
                  <th className="p-3">Transportation</th>
                  <th className="p-3">Personal</th>
                  <th className="p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {costData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-3">{item.year}</td>
                    <td className="p-3">{item.college}</td>
                    <td className="p-3">{formatCurrency(item.tuition, currency)}</td>
                    <td className="p-3">{formatCurrency(item.roomBoard, currency)}</td>
                    <td className="p-3">{formatCurrency(item.books, currency)}</td>
                    <td className="p-3">{formatCurrency(item.transportation, currency)}</td>
                    <td className="p-3">{formatCurrency(item.personal, currency)}</td>
                    <td className="p-3">{formatCurrency(item.total, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mb-6">
            {history.map((item, i) => (
              <div key={i} className="bg-white p-4 mb-4 rounded-lg shadow">
                <p>
                  <strong>Date:</strong> {item.timestamp}
                </p>
                <p>
                  <strong>Total Cost:</strong> {item.totalCost}
                </p>
                <p>
                  <strong>Net Cost:</strong> {item.netCost}
                </p>
                <p>
                  <strong>Total Loan:</strong> {item.totalLoan}
                </p>
                <p>
                  <strong>Monthly Loan Payment:</strong> {item.monthlyLoanPayment}
                </p>
                <p>
                  <strong>Total Loan Interest:</strong> {item.totalLoanInterest}
                </p>
                <p>
                  <strong>Savings Contribution:</strong> {item.savingsContribution}
                </p>
                <p>
                  <strong>Future Cost:</strong> {item.futureCost}
                </p>
                <p>
                  <strong>Colleges:</strong>
                </p>
                <ul className="list-disc pl-5">
                  {item.colleges.map((college, j) => (
                    <li key={j}>
                      {college.name}: Total {college.total}, Tuition {college.tuition}, Room & Board{" "}
                      {college.roomBoard}, Books {college.books}, Transportation {college.transportation},
                      Personal {college.personal}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Inputs:</strong>
                </p>
                <ul className="list-disc pl-5">
                  {Object.entries(item.inputs).map(([key, value]) => (
                    <li key={key}>
                      {key === "years"
                        ? "Years"
                        : key === "costEscalation"
                        ? "Cost Escalation"
                        : key === "inflationRate"
                        ? "Inflation Rate"
                        : key === "scholarships"
                        ? "Scholarships/Grants"
                        : key === "loanAmount"
                        ? "Loan Amount"
                        : key === "loanRate"
                        ? "Loan Rate"
                        : key === "loanTerm"
                        ? "Loan Term"
                        : key === "currentSavings"
                        ? "Current Savings"
                        : key === "annualContribution"
                        ? "Annual Contribution"
                        : "Investment Rate"}
                      : {value}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {comparisonData.length > 0 && (
            <table className="w-full text-sm text-gray-600 mb-6">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3">College</th>
                  <th className="p-3">Total Cost</th>
                  <th className="p-3">Net Cost</th>
                  <th className="p-3">Total Loan</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{formatCurrency(item.totalCost, currency)}</td>
                    <td className="p-3">{formatCurrency(item.netCost, currency)}</td>
                    <td className="p-3">{formatCurrency(item.totalLoan, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mb-6">
            <p className="text-gray-600">Aid chart not implemented in this demo.</p>
          </div>
          <div className="flex gap-4 flex-col sm:flex-row">
            <button
              onClick={exportCostBreakdown}
              className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 flex-1"
            >
              Export Cost Breakdown (CSV)
            </button>
            <button
              onClick={compareColleges}
              className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 flex-1"
            >
              Compare Colleges
            </button>
          </div>
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
          @media (max-width: 768px) {
            .flex-col {
              flex-direction: column;
            }
            .max-h-[700px] {
              max-height: 500px;
            }
            .text-sm {
              font-size: 0.875rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
