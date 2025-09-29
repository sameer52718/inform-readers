"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [cards, setCards] = useState([{ id: 1, name: "", balance: "", interestRate: "", minPayment: "" }]);
  const [paymentStrategy, setPaymentStrategy] = useState("minimum");
  const [fixedPayment, setFixedPayment] = useState("");
  const [balanceTransfer, setBalanceTransfer] = useState("none");
  const [transferDetails, setTransferDetails] = useState({ rate: "", period: "", fee: "" });
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [history, setHistory] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const balanceChartRef = useRef(null);
  const breakdownChartRef = useRef(null);
  const balanceChartInstance = useRef(null);
  const breakdownChartInstance = useRef(null);

  useEffect(() => {
    if (balanceChartRef.current) {
      balanceChartInstance.current = new Chart(balanceChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [{ label: "Balance", data: [], borderColor: "#3498db", fill: false, tension: 0.1 }],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Balance" } },
            x: { title: { display: true, text: "Month" } },
          },
          plugins: { title: { display: true, text: "Credit Card Balance Over Time" } },
        },
      });
    }
    if (breakdownChartRef.current) {
      breakdownChartInstance.current = new Chart(breakdownChartRef.current, {
        type: "pie",
        data: {
          labels: ["Principal", "Interest", "Transfer Fee"],
          datasets: [
            {
              data: [0, 0, 0],
              backgroundColor: ["#3498db", "#e74c3c", "#f1c40f"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Payment Breakdown" } },
        },
      });
    }
    return () => {
      balanceChartInstance.current?.destroy();
      breakdownChartInstance.current?.destroy();
    };
  }, []);

  const formatCurrency = (amount, curr = currency) => {
    const symbols = { USD: "$", CAD: "$", EUR: "€", GBP: "£" };
    return `${symbols[curr]}${parseFloat(amount).toFixed(2)}`;
  };

  const addCardRow = () => {
    const newId = Math.max(...cards.map((c) => c.id)) + 1;
    setCards([...cards, { id: newId, name: "", balance: "", interestRate: "", minPayment: "" }]);
  };

  const removeCardRow = (id) => {
    if (cards.length > 1) setCards(cards.filter((c) => c.id !== id));
  };

  const updateCard = (id, field, value) => {
    setCards(cards.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const calculatePayoff = () => {
    const validCards = cards.filter(
      (c) => parseFloat(c.balance) > 0 && parseFloat(c.interestRate) >= 0 && parseFloat(c.minPayment) >= 0
    );
    if (validCards.length === 0) {
      setResults({
        error: "Please enter at least one valid credit card with balance, interest rate, and minimum payment",
      });
      return;
    }
    if (paymentStrategy === "fixed" && (!parseFloat(fixedPayment) || parseFloat(fixedPayment) <= 0)) {
      setResults({ error: "Please enter a valid fixed monthly payment" });
      return;
    }
    if (
      balanceTransfer === "offer" &&
      (!parseFloat(transferDetails.rate) ||
        !parseInt(transferDetails.period) ||
        !parseFloat(transferDetails.fee))
    ) {
      setResults({ error: "Please enter valid balance transfer details" });
      return;
    }

    let totalBalance = validCards.reduce((sum, c) => sum + parseFloat(c.balance), 0);
    const transferFee =
      balanceTransfer === "offer" ? totalBalance * (parseFloat(transferDetails.fee) / 100) : 0;
    totalBalance += transferFee;
    let totalInterest = 0;
    let totalPayments = 0;
    let payoffMonths = 0;
    const newPaymentData = [];
    const balances = [totalBalance];
    const months = [0];
    const cardsCopy = validCards.map((c) => ({
      name: c.name || "Unnamed Card",
      balance: parseFloat(c.balance),
      interestRate: parseFloat(c.interestRate) / 100,
      minPayment: parseFloat(c.minPayment),
    }));

    if (paymentStrategy === "snowball" || paymentStrategy === "avalanche") {
      cardsCopy.sort(
        paymentStrategy === "snowball"
          ? (a, b) => a.balance - b.balance
          : (a, b) => b.interestRate - a.interestRate
      );
      let remainingBalance = totalBalance;
      let month = 0;
      let totalMonthlyPayment = cardsCopy.reduce((sum, c) => sum + c.minPayment, 0);

      while (remainingBalance > 0 && month < 1200) {
        month++;
        let monthInterest = 0;
        let monthPrincipal = 0;
        let payment = totalMonthlyPayment;

        for (let i = 0; i < cardsCopy.length; i++) {
          if (cardsCopy[i].balance <= 0) continue;
          const cardInterest =
            (cardsCopy[i].balance *
              (balanceTransfer === "offer" && month <= parseInt(transferDetails.period)
                ? parseFloat(transferDetails.rate) / 100
                : cardsCopy[i].interestRate)) /
            12;
          let cardPayment = Math.min(cardsCopy[i].balance + cardInterest, cardsCopy[i].minPayment);
          if (cardsCopy[i].balance > 0 && payment > 0) {
            const availablePayment = Math.min(payment, cardsCopy[i].balance + cardInterest);
            monthInterest += cardInterest;
            monthPrincipal += availablePayment - cardInterest;
            cardsCopy[i].balance = Math.max(0, cardsCopy[i].balance - (availablePayment - cardInterest));
            payment -= availablePayment;
          }
          if (cardsCopy[i].balance <= 0 && i < cardsCopy.length - 1) {
            totalMonthlyPayment += cardsCopy[i].minPayment;
          }
        }

        remainingBalance -= monthPrincipal;
        totalInterest += monthInterest;
        totalPayments += monthPrincipal + monthInterest;
        newPaymentData.push({
          month,
          payment: monthPrincipal + monthInterest,
          interest: monthInterest,
          principal: monthPrincipal,
          balance: remainingBalance,
        });
        balances.push(remainingBalance);
        months.push(month);
        if (remainingBalance <= 0) break;
      }
      payoffMonths = month;
    } else {
      let remainingBalance = totalBalance;
      let month = 0;
      const monthlyPayment =
        paymentStrategy === "fixed"
          ? parseFloat(fixedPayment)
          : cardsCopy.reduce((sum, c) => sum + c.minPayment, 0);

      if (
        paymentStrategy === "fixed" &&
        monthlyPayment < cardsCopy.reduce((sum, c) => sum + c.minPayment, 0)
      ) {
        setResults({ error: "Fixed payment must be at least the sum of minimum payments" });
        return;
      }

      while (remainingBalance > 0 && month < 1200) {
        month++;
        let monthInterest = 0;
        let monthPrincipal = 0;

        cardsCopy.forEach((card) => {
          if (card.balance <= 0) return;
          const cardInterest =
            (card.balance *
              (balanceTransfer === "offer" && month <= parseInt(transferDetails.period)
                ? parseFloat(transferDetails.rate) / 100
                : card.interestRate)) /
            12;
          monthInterest += cardInterest;
          let cardPayment =
            paymentStrategy === "fixed"
              ? (card.balance / remainingBalance) * (monthlyPayment - monthInterest)
              : Math.min(card.minPayment, card.balance + cardInterest);
          if (cardPayment > 0) {
            const principalPaid = Math.min(cardPayment, card.balance);
            card.balance = Math.max(0, card.balance - principalPaid);
            monthPrincipal += principalPaid;
          }
        });

        const totalPayment = paymentStrategy === "fixed" ? monthlyPayment : monthPrincipal + monthInterest;
        remainingBalance -= monthPrincipal;
        totalInterest += monthInterest;
        totalPayments += totalPayment;
        newPaymentData.push({
          month,
          payment: totalPayment,
          interest: monthInterest,
          principal: monthPrincipal,
          balance: remainingBalance,
        });
        balances.push(remainingBalance);
        months.push(month);
        if (remainingBalance <= 0) break;
      }
      payoffMonths = month;
    }

    if (payoffMonths >= 1200) {
      setResults({ error: "Payoff takes too long; increase payments or check inputs" });
      return;
    }

    setResults({
      totalBalance: totalBalance - transferFee,
      totalInterest,
      payoffTime: payoffMonths,
      totalPayments,
      transferFee,
      monthlyPayment:
        paymentStrategy === "fixed" ? fixedPayment : cardsCopy.reduce((sum, c) => sum + c.minPayment, 0),
    });
    setPaymentData(newPaymentData);

    const calculation = {
      timestamp: new Date().toLocaleString(),
      strategy: paymentStrategy,
      totalBalance: formatCurrency(totalBalance - transferFee),
      totalInterest: formatCurrency(totalInterest),
      payoffTime: `${payoffMonths} months`,
      totalPayments: formatCurrency(totalPayments),
      transferFee: formatCurrency(transferFee),
      monthlyPayment: formatCurrency(
        paymentStrategy === "fixed" ? fixedPayment : cardsCopy.reduce((sum, c) => sum + c.minPayment, 0)
      ),
      cards: cardsCopy.map((c) => ({
        name: c.name,
        balance: formatCurrency(c.balance),
        interestRate: `${(c.interestRate * 100).toFixed(2)}%`,
        minPayment: formatCurrency(c.minPayment),
      })),
      balanceTransfer:
        balanceTransfer === "offer"
          ? {
              transferRate: `${parseFloat(transferDetails.rate).toFixed(2)}%`,
              transferPeriod: `${parseInt(transferDetails.period)} months`,
              transferFeeRate: `${parseFloat(transferDetails.fee).toFixed(2)}%`,
            }
          : "None",
    };
    setHistory([...history, calculation]);

    balanceChartInstance.current.data.labels = months;
    balanceChartInstance.current.data.datasets[0].data = balances;
    balanceChartInstance.current.update();
    breakdownChartInstance.current.data.datasets[0].data = [
      totalBalance - transferFee,
      totalInterest,
      transferFee,
    ];
    breakdownChartInstance.current.update();
  };

  const compareStrategies = () => {
    const validCards = cards.filter(
      (c) => parseFloat(c.balance) > 0 && parseFloat(c.interestRate) >= 0 && parseFloat(c.minPayment) >= 0
    );
    if (validCards.length === 0) {
      setResults({ error: "Please enter valid credit card details" });
      return;
    }

    const cardsCopy = validCards.map((c) => ({
      balance: parseFloat(c.balance),
      interestRate: parseFloat(c.interestRate) / 100,
      minPayment: parseFloat(c.minPayment),
    }));
    let totalBalance = cardsCopy.reduce((sum, c) => sum + c.balance, 0);
    const transferFee =
      balanceTransfer === "offer" ? totalBalance * (parseFloat(transferDetails.fee) / 100) : 0;
    totalBalance += transferFee;

    const strategies = [
      { label: "Minimum Payments", type: "minimum" },
      { label: "Debt Snowball", type: "snowball" },
      { label: "Debt Avalanche", type: "avalanche" },
    ];

    const newComparisonData = strategies.map((strategy) => {
      const cardsClone = JSON.parse(JSON.stringify(cardsCopy));
      let remainingBalance = totalBalance;
      let totalInterest = 0;
      let totalPayments = 0;
      let month = 0;

      if (strategy.type === "minimum") {
        while (remainingBalance > 0 && month < 1200) {
          month++;
          let monthInterest = 0;
          let monthPrincipal = 0;

          cardsClone.forEach((card) => {
            if (card.balance <= 0) return;
            const cardInterest =
              (card.balance *
                (balanceTransfer === "offer" && month <= parseInt(transferDetails.period)
                  ? parseFloat(transferDetails.rate) / 100
                  : card.interestRate)) /
              12;
            monthInterest += cardInterest;
            const cardPayment = Math.min(card.minPayment, card.balance + cardInterest);
            const principalPaid = Math.min(cardPayment, card.balance);
            card.balance = Math.max(0, card.balance - principalPaid);
            monthPrincipal += principalPaid;
          });

          remainingBalance -= monthPrincipal;
          totalInterest += monthInterest;
          totalPayments += monthPrincipal + monthInterest;
          if (remainingBalance <= 0) break;
        }
      } else {
        cardsClone.sort(
          strategy.type === "snowball"
            ? (a, b) => a.balance - b.balance
            : (a, b) => b.interestRate - a.interestRate
        );
        let totalMonthlyPayment = cardsClone.reduce((sum, c) => sum + c.minPayment, 0);

        while (remainingBalance > 0 && month < 1200) {
          month++;
          let monthInterest = 0;
          let monthPrincipal = 0;
          let payment = totalMonthlyPayment;

          for (let i = 0; i < cardsClone.length; i++) {
            if (cardsClone[i].balance <= 0) continue;
            const cardInterest =
              (cardsClone[i].balance *
                (balanceTransfer === "offer" && month <= parseInt(transferDetails.period)
                  ? parseFloat(transferDetails.rate) / 100
                  : cardsClone[i].interestRate)) /
              12;
            let cardPayment = Math.min(cardsClone[i].balance + cardInterest, cardsClone[i].minPayment);
            if (cardsClone[i].balance > 0 && payment > 0) {
              const availablePayment = Math.min(payment, cardsClone[i].balance + cardInterest);
              monthInterest += cardInterest;
              monthPrincipal += availablePayment - cardInterest;
              cardsClone[i].balance = Math.max(0, cardsClone[i].balance - (availablePayment - cardInterest));
              payment -= availablePayment;
            }
            if (cardsClone[i].balance <= 0 && i < cardsClone.length - 1) {
              totalMonthlyPayment += cardsClone[i].minPayment;
            }
          }

          remainingBalance -= monthPrincipal;
          totalInterest += monthInterest;
          totalPayments += monthPrincipal + monthInterest;
          if (remainingBalance <= 0) break;
        }
      }

      return { label: strategy.label, totalInterest, payoffTime: month, totalPayments };
    });

    setComparisonData(newComparisonData);
  };

  const exportPaymentSchedule = () => {
    if (paymentData.length === 0) {
      setResults({ error: "No payment data to export" });
      return;
    }

    const csvContent = [
      "Month,Payment,Interest,Principal,Balance",
      ...paymentData.map(
        (item) =>
          `${item.month},${item.payment.toFixed(2)},${item.interest.toFixed(2)},${item.principal.toFixed(
            2
          )},${item.balance.toFixed(2)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "credit_card_payment_schedule.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white  flex justify-center items-center p-5">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-6xl w-full flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Advanced Credit Card Calculator
            </h1>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Credit Cards</label>
              {cards.map((card) => (
                <div key={card.id} className="flex flex-col sm:flex-row gap-2 mb-3">
                  {[
                    { id: "name", type: "text", placeholder: "Card name", value: card.name },
                    {
                      id: "balance",
                      type: "number",
                      placeholder: "Balance ($)",
                      step: "100",
                      value: card.balance,
                    },
                    {
                      id: "interestRate",
                      type: "number",
                      placeholder: "Interest Rate (%)",
                      step: "0.01",
                      value: card.interestRate,
                    },
                    {
                      id: "minPayment",
                      type: "number",
                      placeholder: "Min Payment ($)",
                      step: "10",
                      value: card.minPayment,
                    },
                  ].map((field) => (
                    <input
                      key={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      step={field.step}
                      value={field.value}
                      onChange={(e) => updateCard(card.id, field.id, e.target.value)}
                      className="flex-1 p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                    />
                  ))}
                  {cards.length > 1 && (
                    <button
                      onClick={() => removeCardRow(card.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 sm:w-auto"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addCardRow}
                className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
              >
                Add Card
              </button>
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Payment Strategy</label>
              <select
                value={paymentStrategy}
                onChange={(e) => setPaymentStrategy(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
              >
                {[
                  { value: "minimum", label: "Minimum Payments" },
                  { value: "fixed", label: "Fixed Monthly Payment" },
                  { value: "snowball", label: "Debt Snowball" },
                  { value: "avalanche", label: "Debt Avalanche" },
                ].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {paymentStrategy === "fixed" && (
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Fixed Monthly Payment ($)
                </label>
                <input
                  type="number"
                  placeholder="Enter fixed payment"
                  step="100"
                  value={fixedPayment}
                  onChange={(e) => setFixedPayment(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                />
              </div>
            )}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Balance Transfer Offer</label>
              <select
                value={balanceTransfer}
                onChange={(e) => setBalanceTransfer(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
              >
                <option value="none">None</option>
                <option value="offer">Apply Offer</option>
              </select>
            </div>
            {balanceTransfer === "offer" && (
              <>
                {[
                  {
                    id: "rate",
                    label: "Promotional Interest Rate (%)",
                    placeholder: "Enter promotional rate",
                    step: "0.01",
                  },
                  {
                    id: "period",
                    label: "Promotional Period (Months)",
                    placeholder: "Enter promotional period",
                    step: "1",
                  },
                  {
                    id: "fee",
                    label: "Transfer Fee (%)",
                    placeholder: "Enter transfer fee percentage",
                    step: "0.01",
                  },
                ].map((field) => (
                  <div key={field.id} className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      step={field.step}
                      value={transferDetails[field.id]}
                      onChange={(e) => setTransferDetails({ ...transferDetails, [field.id]: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                    />
                  </div>
                ))}
              </>
            )}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
              >
                {[
                  { value: "USD", label: "$ USD" },
                  { value: "CAD", label: "$ CAD" },
                  { value: "EUR", label: "€ EUR" },
                  { value: "GBP", label: "£ GBP" },
                ].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={calculatePayoff}
              className="w-full bg-red-500 text-white p-3 rounded-lg mb-5 hover:bg-red-600"
            >
              Calculate Payoff
            </button>
            {results && (
              <div className="bg-white p-5 rounded-lg mb-5">
                {results.error ? (
                  <p className="text-red-500 text-center">{results.error}</p>
                ) : (
                  <>
                    <p>
                      <strong>Total Balance:</strong> {formatCurrency(results.totalBalance)}
                    </p>
                    <p>
                      <strong>Total Interest Paid:</strong> {formatCurrency(results.totalInterest)}
                    </p>
                    <p>
                      <strong>Payoff Time:</strong> {results.payoffTime} months (
                      {(results.payoffTime / 12).toFixed(1)} years)
                    </p>
                    <p>
                      <strong>Total Payments:</strong> {formatCurrency(results.totalPayments)}
                    </p>
                    <p>
                      <strong>Balance Transfer Fee:</strong> {formatCurrency(results.transferFee)}
                    </p>
                    <p>
                      <strong>Monthly Payment:</strong> {formatCurrency(results.monthlyPayment)}
                    </p>
                  </>
                )}
              </div>
            )}
            <div className="mb-5">
              <canvas ref={balanceChartRef} className="border-2 border-gray-300 rounded-lg" />
            </div>
          </div>
          <div className="flex-1 max-h-[700px] overflow-y-auto p-5 bg-white rounded-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Payment Schedule & History</h1>
            {paymentData.length > 0 && (
              <table className="w-full border-collapse mb-5">
                <thead>
                  <tr className="bg-red-500 text-white">
                    {["Month", "Payment", "Interest", "Principal", "Balance"].map((h) => (
                      <th key={h} className="p-2 text-right">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paymentData.map((item, i) => (
                    <tr key={i} className="border-b border-gray-300 even:bg-gray-50">
                      <td className="p-2 text-right">{item.month}</td>
                      <td className="p-2 text-right">{formatCurrency(item.payment)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.interest)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.principal)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {history.map((item, i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg mb-3 shadow">
                <p>
                  <strong>Date:</strong> {item.timestamp}
                </p>
                <p>
                  <strong>Strategy:</strong> {item.strategy}
                </p>
                <p>
                  <strong>Total Balance:</strong> {item.totalBalance}
                </p>
                <p>
                  <strong>Total Interest:</strong> {item.totalInterest}
                </p>
                <p>
                  <strong>Payoff Time:</strong> {item.payoffTime}
                </p>
                <p>
                  <strong>Total Payments:</strong> {item.totalPayments}
                </p>
                <p>
                  <strong>Balance Transfer Fee:</strong> {item.transferFee}
                </p>
                <p>
                  <strong>Monthly Payment:</strong> {item.monthlyPayment}
                </p>
                <p>
                  <strong>Cards:</strong>
                </p>
                <ul className="list-disc pl-5">
                  {item.cards.map((card, j) => (
                    <li key={j}>
                      {card.name}: Balance {card.balance}, Interest {card.interestRate}, Min Payment{" "}
                      {card.minPayment}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Balance Transfer:</strong>{" "}
                  {typeof item.balanceTransfer === "string"
                    ? item.balanceTransfer
                    : `Rate: ${item.balanceTransfer.transferRate}, Period: ${item.balanceTransfer.transferPeriod}, Fee: ${item.balanceTransfer.transferFeeRate}`}
                </p>
              </div>
            ))}
            {comparisonData.length > 0 && (
              <table className="w-full border-collapse mb-5">
                <thead>
                  <tr className="bg-red-500 text-white">
                    {["Strategy", "Total Interest", "Payoff Time", "Total Payments"].map((h) => (
                      <th key={h} className="p-2 text-right">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, i) => (
                    <tr key={i} className="border-b border-gray-300 even:bg-gray-50">
                      <td className="p-2 text-right">{item.label}</td>
                      <td className="p-2 text-right">{formatCurrency(item.totalInterest)}</td>
                      <td className="p-2 text-right">{item.payoffTime} months</td>
                      <td className="p-2 text-right">{formatCurrency(item.totalPayments)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mb-5">
              <canvas ref={breakdownChartRef} className="border-2 border-gray-300 rounded-lg" />
            </div>
            <button
              onClick={exportPaymentSchedule}
              className="w-full bg-green-500 text-white p-3 rounded-lg mb-3 hover:bg-green-600"
            >
              Export Payment Schedule (CSV)
            </button>
            <button
              onClick={compareStrategies}
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
            >
              Compare Strategies
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .flex-col\\:md\\:flex-row {
            flex-direction: column;
          }
          .max-h-\\[700px\\] {
            max-height: 500px;
          }
          .flex-row {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
