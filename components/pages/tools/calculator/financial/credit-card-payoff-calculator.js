"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Visa",
      balance: 5000,
      apr: 18,
      minPayment: 2.5,
      creditLimit: 10000,
      issuer: "generic",
      transferAmount: 0,
    },
  ]);
  const [transfer, setTransfer] = useState({ introApr: 0, introPeriod: 12, fee: 3, regularApr: 15 });
  const [strategy, setStrategy] = useState({ type: "minimum", fixedPayment: 200, extraPayment: 100 });
  const [personal, setPersonal] = useState({
    currentAge: 30,
    filingStatus: "single",
    otherIncome: 50000,
    taxYear: "2025",
    state: "none",
    debtType: "personal",
  });
  const [planning, setPlanning] = useState({
    inflationRate: 2,
    savingsRate: 3,
    budget: 500,
    compounding: "monthly",
    currency: "USD",
  });
  const [results, setResults] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [customOrder, setCustomOrder] = useState([]);
  const [activeCollapsible, setActiveCollapsible] = useState({});
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            { label: "Total Balance", data: [], borderColor: "#ef4444", lineWidth: 2 },
            { label: "Total Interest", data: [], borderColor: "#facc15", lineWidth: 2 },
          ],
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { position: "top" } },
        },
      });
    }
    return () => chartInstance.current?.destroy();
  }, []);

  useEffect(() => {
    if (results && schedule.length > 0) {
      const months = results.months;
      const totalBalances = Array(months + 1).fill(0);
      const totalInterests = Array(months + 1).fill(0);
      schedule.forEach((item) => {
        totalBalances[item.month] = (totalBalances[item.month] || 0) + item.balance;
        totalInterests[item.month] = (totalInterests[item.month] || 0) + item.interest;
      });
      chartInstance.current.data.labels = Array.from({ length: months + 1 }, (_, i) => i);
      chartInstance.current.data.datasets[0].data = totalBalances;
      chartInstance.current.data.datasets[1].data = totalInterests;
      chartInstance.current.update();
    }
  }, [results, schedule]);

  const addCard = () => {
    const newId = Math.max(...cards.map((c) => c.id)) + 1;
    setCards([
      ...cards,
      {
        id: newId,
        name: `Card ${newId}`,
        balance: 0,
        apr: 15,
        minPayment: 2.5,
        creditLimit: 10000,
        issuer: "generic",
        transferAmount: 0,
      },
    ]);
  };

  const removeCard = (id) => {
    if (cards.length > 1) {
      setCards(cards.filter((c) => c.id !== id));
      setCustomOrder(customOrder.filter((orderId) => orderId !== id));
    }
  };

  const updateCard = (id, field, value) => {
    setCards(
      cards.map((c) =>
        c.id === id ? { ...c, [field]: field === "name" ? value : parseFloat(value) || 0 } : c
      )
    );
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    e.target.classList.add("opacity-50", "scale-95");
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("opacity-50", "scale-95");
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData("text/plain"));
    const newOrder = [...cards];
    const draggedIndex = newOrder.findIndex((c) => c.id === draggedId);
    const targetIndex = newOrder.findIndex((c) => c.id === targetId);
    const [dragged] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, dragged);
    setCards(newOrder);
    setCustomOrder(newOrder.map((c) => c.id));
  };

  const toggleCollapsible = (section) => {
    setActiveCollapsible((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const formatCurrency = (amount) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[planning.currency]} ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  };

  const calculatePayoff = () => {
    try {
      // Validation
      if (
        cards.some(
          (c) =>
            c.balance < 0 ||
            c.apr < 0 ||
            c.minPayment < 0 ||
            c.creditLimit < 0 ||
            c.transferAmount < 0 ||
            c.transferAmount > c.balance
        )
      ) {
        return { error: "Card details and transfer amounts must be valid" };
      }
      if (
        strategy.fixedPayment < 0 ||
        strategy.extraPayment < 0 ||
        personal.currentAge < 18 ||
        personal.currentAge > 100
      ) {
        return { error: "Payment and age inputs must be valid" };
      }
      if (
        personal.otherIncome < 0 ||
        planning.inflationRate < 0 ||
        planning.savingsRate < 0 ||
        planning.budget < 0 ||
        transfer.introApr < 0 ||
        transfer.fee < 0 ||
        transfer.regularApr < 0
      ) {
        return { error: "Financial and transfer inputs must be non-negative" };
      }
      if (cards.length === 0) {
        return { error: "Add at least one credit card" };
      }

      // Payoff calculations
      const monthlyRate = cards.map((c) =>
        planning.compounding === "daily" ? c.apr / 100 / 365 : c.apr / 100 / 12
      );
      let totalBalance = cards.reduce((sum, c) => sum + c.balance, 0);
      let transferFee = cards.reduce((sum, c) => sum + c.transferAmount * (transfer.fee / 100), 0);
      let totalInterest = transferFee;
      let months = 0;
      const newSchedule = [];
      let activeCards = cards.map((c, i) => ({
        ...c,
        originalIndex: i,
        balance: c.balance - c.transferAmount,
        transferBalance: c.transferAmount,
        minPayment: 0,
      }));
      const transferCard = {
        id: -1,
        name: "Transfer Card",
        balance: cards.reduce((sum, c) => sum + c.transferAmount, 0),
        apr: transfer.introApr,
        minPayment: 2.5,
        creditLimit: 0,
        issuer: "generic",
        transferAmount: 0,
        originalIndex: cards.length,
        transferBalance: 0,
      };
      if (transferCard.balance > 0) {
        activeCards.push(transferCard);
        monthlyRate.push(
          planning.compounding === "daily" ? transfer.introApr / 100 / 365 : transfer.introApr / 100 / 12
        );
      }

      let cardOrder = [...activeCards];
      if (strategy.type === "snowball") {
        cardOrder.sort((a, b) => a.balance - b.balance);
      } else if (strategy.type === "avalanche") {
        cardOrder.sort(
          (a, b) =>
            (cards[b.originalIndex]?.apr || transfer.regularApr) -
            (cards[a.originalIndex]?.apr || transfer.introApr)
        );
      } else if (strategy.type === "hybrid") {
        cardOrder.sort((a, b) => {
          const aHighPriority = a.balance < 5000 ? cards[a.originalIndex]?.apr || transfer.introApr : 0;
          const bHighPriority = b.balance < 5000 ? cards[b.originalIndex]?.apr || transfer.introApr : 0;
          return bHighPriority - aHighPriority || a.balance - b.balance;
        });
      } else if (strategy.type === "custom") {
        cardOrder = customOrder
          .map((id) => activeCards.find((c) => c.id === id || c.name === "Transfer Card"))
          .filter(Boolean);
      }

      while (activeCards.some((c) => c.balance > 0 || c.transferBalance > 0) && months < 1200) {
        months++;
        let totalPayment = 0;
        const monthPayments = [];

        if (transferCard.balance > 0 && months > transfer.introPeriod) {
          monthlyRate[transferCard.originalIndex] =
            planning.compounding === "daily"
              ? transfer.regularApr / 100 / 365
              : transfer.regularApr / 100 / 12;
        }

        activeCards.forEach((c) => {
          const balance = c.balance + c.transferBalance;
          const interest =
            c.balance * monthlyRate[c.originalIndex] + c.transferBalance * monthlyRate[c.originalIndex];
          c.minPayment =
            c.issuer === "amex" ? balance * 0.01 + interest : Math.max(25, balance * (c.minPayment / 100));
          if (balance > 0) c.minPayment = Math.min(c.minPayment, balance + interest);
        });

        if (strategy.type === "minimum") {
          activeCards.forEach((c) => {
            if (c.balance > 0 || c.transferBalance > 0) {
              const interest =
                c.balance * monthlyRate[c.originalIndex] + c.transferBalance * monthlyRate[c.originalIndex];
              const payment = Math.min(c.minPayment, c.balance + c.transferBalance + interest);
              totalPayment += payment;
              totalInterest += interest;
              const paymentToOriginal = Math.min(payment, c.balance + interest);
              c.balance = Math.max(0, c.balance + interest - paymentToOriginal);
              c.transferBalance = Math.max(0, c.transferBalance - (payment - paymentToOriginal));
              monthPayments.push({
                card: c.name,
                payment,
                interest,
                balance: c.balance + c.transferBalance,
                month: months,
              });
            }
          });
        } else if (strategy.type === "fixed") {
          let remainingPayment = Math.min(strategy.fixedPayment + strategy.extraPayment, planning.budget);
          activeCards.forEach((c) => {
            if ((c.balance > 0 || c.transferBalance > 0) && remainingPayment > 0) {
              const interest =
                c.balance * monthlyRate[c.originalIndex] + c.transferBalance * monthlyRate[c.originalIndex];
              const payment = Math.min(remainingPayment, c.balance + c.transferBalance + interest);
              totalPayment += payment;
              totalInterest += interest;
              const paymentToOriginal = Math.min(payment, c.balance + interest);
              c.balance = Math.max(0, c.balance + interest - paymentToOriginal);
              c.transferBalance = Math.max(0, c.transferBalance - (payment - paymentToOriginal));
              remainingPayment -= payment;
              monthPayments.push({
                card: c.name,
                payment,
                interest,
                balance: c.balance + c.transferBalance,
                month: months,
              });
            }
          });
        } else {
          let remainingPayment = strategy.extraPayment;
          activeCards.forEach((c) => {
            if (c.balance > 0 || c.transferBalance > 0) {
              const interest =
                c.balance * monthlyRate[c.originalIndex] + c.transferBalance * monthlyRate[c.originalIndex];
              const payment = Math.min(c.minPayment, c.balance + c.transferBalance + interest);
              totalPayment += payment;
              totalInterest += interest;
              const paymentToOriginal = Math.min(payment, c.balance + interest);
              c.balance = Math.max(0, c.balance + interest - paymentToOriginal);
              c.transferBalance = Math.max(0, c.transferBalance - (payment - paymentToOriginal));
              remainingPayment += c.minPayment - payment;
              monthPayments.push({
                card: c.name,
                payment,
                interest,
                balance: c.balance + c.transferBalance,
                month: months,
              });
            }
          });
          remainingPayment = Math.min(remainingPayment, planning.budget - totalPayment);
          for (let c of cardOrder) {
            if ((c.balance > 0 || c.transferBalance > 0) && remainingPayment > 0) {
              const interest =
                c.balance * monthlyRate[c.originalIndex] + c.transferBalance * monthlyRate[c.originalIndex];
              const payment = Math.min(remainingPayment, c.balance + c.transferBalance + interest);
              totalPayment += payment;
              totalInterest += interest;
              const paymentToOriginal = Math.min(payment, c.balance + interest);
              c.balance = Math.max(0, c.balance + interest - paymentToOriginal);
              c.transferBalance = Math.max(0, c.transferBalance - (payment - paymentToOriginal));
              remainingPayment -= payment;
              monthPayments.push({
                card: c.name,
                payment,
                interest,
                balance: c.balance + c.transferBalance,
                month: months,
              });
            }
          }
        }

        if (totalPayment > planning.budget) {
          return { error: "Total payments exceed monthly budget" };
        }

        newSchedule.push(...monthPayments);
      }

      if (months >= 1200) {
        return { error: "Payoff takes too long. Increase payments or adjust strategy." };
      }

      // Update progress bars
      cards.forEach((c, i) => {
        const progress = document.getElementById(`progress${c.id}`);
        if (progress) {
          const percent = Math.max(
            0,
            100 - ((activeCards[i]?.balance + activeCards[i]?.transferBalance) / c.balance) * 100
          );
          progress.style.width = `${percent}%`;
        }
      });

      // Taxable interest deduction
      const federalBrackets = {
        2025: {
          single: [
            { rate: 0.1, min: 0, max: 11600 },
            { rate: 0.12, min: 11601, max: 47150 },
            { rate: 0.22, min: 47151, max: 100525 },
            { rate: 0.24, min: 100526, max: 191950 },
            { rate: 0.32, min: 191951, max: 243725 },
            { rate: 0.35, min: 243726, max: 609350 },
            { rate: 0.37, min: 609351 },
          ],
          marriedJoint: [
            { rate: 0.1, min: 0, max: 23200 },
            { rate: 0.12, min: 23201, max: 94300 },
            { rate: 0.22, min: 94301, max: 201050 },
            { rate: 0.24, min: 201051, max: 383900 },
            { rate: 0.32, min: 383901, max: 487450 },
            { rate: 0.35, min: 487451, max: 731200 },
            { rate: 0.37, min: 731201 },
          ],
          marriedSeparate: [
            { rate: 0.1, min: 0, max: 11600 },
            { rate: 0.12, min: 11601, max: 47150 },
            { rate: 0.22, min: 47151, max: 100525 },
            { rate: 0.24, min: 100526, max: 191950 },
            { rate: 0.32, min: 191951, max: 243725 },
            { rate: 0.35, min: 243726, max: 365600 },
            { rate: 0.37, min: 365601 },
          ],
          headHousehold: [
            { rate: 0.1, min: 0, max: 16550 },
            { rate: 0.12, min: 16551, max: 63100 },
            { rate: 0.22, min: 63101, max: 100500 },
            { rate: 0.24, min: 100501, max: 191950 },
            { rate: 0.32, min: 191951, max: 243700 },
            { rate: 0.35, min: 243701, max: 591975 },
            { rate: 0.37, min: 591976 },
          ],
        },
      };
      let federalTaxSavings = 0;
      const taxableIncome = personal.otherIncome;
      const brackets = federalBrackets[personal.taxYear][personal.filingStatus];
      let marginalRate = 0;
      for (const bracket of brackets) {
        if (taxableIncome > bracket.min) marginalRate = bracket.rate;
      }
      if (personal.debtType === "business") {
        federalTaxSavings = totalInterest * marginalRate * 0.1;
      } else if (personal.debtType === "student") {
        federalTaxSavings = Math.min(2500, totalInterest) * marginalRate;
      }

      // State tax
      let stateTaxSavings = 0;
      const stateBrackets = {
        CA: [
          { rate: 0.01, min: 0, max: 10412 },
          { rate: 0.02, min: 10413, max: 24684 },
          { rate: 0.04, min: 24685, max: 38959 },
          { rate: 0.06, min: 38960, max: 54081 },
          { rate: 0.08, min: 54082, max: 68350 },
          { rate: 0.093, min: 68351, max: 349137 },
          { rate: 0.103, min: 349138, max: 418961 },
          { rate: 0.113, min: 418962 },
        ],
        NY: [
          { rate: 0.04, min: 0, max: 8500 },
          { rate: 0.045, min: 8501, max: 11700 },
          { rate: 0.0525, min: 11701, max: 13900 },
          { rate: 0.059, min: 13901, max: 80650 },
          { rate: 0.0633, min: 80651, max: 215400 },
          { rate: 0.0685, min: 215401, max: 1077550 },
          { rate: 0.0965, min: 1077551 },
        ],
        TX: [{ rate: 0, min: 0 }],
      };
      if (
        personal.state !== "none" &&
        personal.state !== "TX" &&
        (personal.debtType === "business" || personal.debtType === "student")
      ) {
        const stateBracket = stateBrackets[personal.state];
        let stateMarginalRate = 0;
        for (const bracket of stateBracket) {
          if (taxableIncome > bracket.min) stateMarginalRate = bracket.rate;
        }
        stateTaxSavings =
          (personal.debtType === "student" ? Math.min(2500, totalInterest) : totalInterest * 0.1) *
          stateMarginalRate;
      }
      const totalTaxSavings = federalTaxSavings + stateTaxSavings;
      const netCost = totalInterest - totalTaxSavings;

      // Opportunity cost
      const monthlySavingsRate = planning.savingsRate / 100 / 12;
      let opportunityCost = 0;
      newSchedule.forEach((item) => {
        opportunityCost += item.payment * Math.pow(1 + monthlySavingsRate, months - item.month);
      });

      // Credit utilization and score impact
      const totalCreditLimit = cards.reduce((sum, c) => sum + c.creditLimit, 0);
      const utilizationRatio = totalBalance / totalCreditLimit;
      let scoreImpact = utilizationRatio < 0.3 ? 10 : utilizationRatio < 0.5 ? 0 : -20;
      scoreImpact += Math.floor(months / 12) * 5;

      // Budget optimization
      const optimalPayments = activeCards.map((c) => {
        const interestRate = monthlyRate[c.originalIndex];
        return {
          name: c.name,
          payment:
            c.minPayment +
            (strategy.extraPayment * interestRate) / monthlyRate.reduce((sum, r) => sum + r, 0),
        };
      });

      // Scenario analysis
      const newScenarios = ["minimum", "snowball", "avalanche"].map((s) => {
        let tempCards = activeCards.map((c) => ({ ...c }));
        let tempMonths = 0,
          tempInterest = transferFee;
        let tempSchedule = [];
        while (tempCards.some((c) => c.balance > 0 || c.transferBalance > 0) && tempMonths < 1200) {
          tempMonths++;
          let tempPayment = 0;
          let tempOrder = [...tempCards];
          if (s === "snowball") tempOrder.sort((a, b) => a.balance - b.balance);
          else if (s === "avalanche")
            tempOrder.sort(
              (a, b) =>
                (cards[b.originalIndex]?.apr || transfer.regularApr) -
                (cards[a.originalIndex]?.apr || transfer.introApr)
            );
          tempCards.forEach((c) => {
            const balance = c.balance + c.transferBalance;
            const interest =
              c.balance * monthlyRate[c.originalIndex] + c.transferBalance * monthlyRate[c.originalIndex];
            c.minPayment =
              c.issuer === "amex" ? balance * 0.01 + interest : Math.max(25, balance * (c.minPayment / 100));
            if (balance > 0) c.minPayment = Math.min(c.minPayment, balance + interest);
          });
          tempCards.forEach((c) => {
            if (c.balance > 0 || c.transferBalance > 0) {
              const interest =
                c.balance * monthlyRate[c.originalIndex] + c.transferBalance * monthlyRate[c.originalIndex];
              const payment =
                s === "minimum"
                  ? Math.min(c.minPayment, c.balance + c.transferBalance + interest)
                  : c.minPayment;
              tempPayment += payment;
              tempInterest += interest;
              const paymentToOriginal = Math.min(payment, c.balance + interest);
              c.balance = Math.max(0, c.balance + interest - paymentToOriginal);
              c.transferBalance = Math.max(0, c.transferBalance - (payment - paymentToOriginal));
              tempSchedule.push({ payment, interest });
            }
          });
          if (s !== "minimum") {
            let remaining = strategy.extraPayment;
            tempCards.forEach(
              (c) => (remaining += c.minPayment - (tempSchedule[tempSchedule.length - 1]?.payment || 0))
            );
            for (let c of tempOrder) {
              if ((c.balance > 0 || c.transferBalance > 0) && remaining > 0) {
                const interest =
                  c.balance * monthlyRate[c.originalIndex] + c.transferBalance * monthlyRate[c.originalIndex];
                const payment = Math.min(remaining, c.balance + c.transferBalance + interest);
                tempPayment += payment;
                tempInterest += interest;
                const paymentToOriginal = Math.min(payment, c.balance + interest);
                c.balance = Math.max(0, c.balance + interest - paymentToOriginal);
                c.transferBalance = Math.max(0, c.transferBalance - (payment - paymentToOriginal));
                remaining -= payment;
              }
            }
          }
        }
        return {
          strategy: s,
          months: tempMonths,
          interest: tempInterest,
          netCost: tempInterest - totalTaxSavings,
        };
      });

      setResults({
        totalBalance,
        months,
        totalInterest,
        netCost,
        opportunityCost,
        utilizationRatio,
        scoreImpact,
      });
      setSchedule(newSchedule);
      setScenarios(newScenarios);

      // Financial planning tips
      const tips = [];
      if (strategy.type === "minimum") tips.push("Switch to avalanche or hybrid to save on interest.");
      if (utilizationRatio > 0.3) tips.push("Reduce utilization below 30% to boost credit score.");
      if (transferCard.balance > 0)
        tips.push("Maximize balance transfer benefits by paying off during intro period.");
      if (optimalPayments.some((p) => p.payment > 0))
        tips.push(
          `Optimize payments: ${optimalPayments
            .map((p) => `${p.name}: ${formatCurrency(p.payment)}`)
            .join(", ")}`
        );

      return { tips };
    } catch (error) {
      return { error: "Error calculating payoff. Check inputs." };
    }
  };

  const handleCalculate = () => {
    const { error, tips } = calculatePayoff();
    if (error) {
      setResults({ error });
    } else {
      setResults((prev) => ({ ...prev, tips }));
    }
  };

  const handleSort = (index) => {
    const newSchedule = [...schedule];
    const isAscending = !activeCollapsible[`sort${index}`];
    newSchedule.sort((a, b) => {
      const aValue =
        index === 0 || index === 2 || index === 3 || index === 4
          ? parseFloat(a[Object.keys(a)[index]].toString().replace(/[^0-9.-]+/g, "")) || 0
          : a[Object.keys(a)[index]];
      const bValue =
        index === 0 || index === 2 || index === 3 || index === 4
          ? parseFloat(b[Object.keys(b)[index]].toString().replace(/[^0-9.-]+/g, "")) || 0
          : b[Object.keys(b)[index]];
      return isAscending
        ? typeof aValue === "number"
          ? aValue - bValue
          : aValue.localeCompare(bValue)
        : typeof bValue === "number"
        ? bValue - aValue
        : bValue.localeCompare(aValue);
    });
    setSchedule(newSchedule);
    setActiveCollapsible((prev) => ({ ...prev, [`sort${index}`]: isAscending }));
  };

  const exportCSV = () => {
    const csv = [
      "Month,Card,Payment,Interest,Balance",
      ...schedule.map(
        (item) =>
          `${item.month},${item.card},${item.payment.toFixed(2)},${item.interest.toFixed(
            2
          )},${item.balance.toFixed(2)}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "credit_card_payoff_schedule.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Credit Card Payoff Summary", 10, 10);
    if (results) {
      [
        { label: "Total Balance", value: formatCurrency(results.totalBalance) },
        { label: "Payoff Timeline (Months)", value: results.months },
        { label: "Total Interest Paid", value: formatCurrency(results.totalInterest) },
        { label: "Net Cost", value: formatCurrency(results.netCost) },
        { label: "Opportunity Cost", value: formatCurrency(results.opportunityCost) },
        { label: "Credit Utilization Ratio", value: `${(results.utilizationRatio * 100).toFixed(2)}%` },
        {
          label: "Estimated Credit Score Impact",
          value: `${results.scoreImpact > 0 ? "+" : ""}${results.scoreImpact} points`,
        },
      ].forEach((metric, i) => doc.text(`${metric.label}: ${metric.value}`, 10, 20 + i * 10));
    }
    doc.save("credit_card_payoff_summary.pdf");
  };

  return (
    <>
      <div className="bg-white min-h-screen flex justify-center items-center p-5">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-3xl w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Advanced Credit Card Payoff Calculator
          </h1>
          <div ref={cardsContainerRef} className="mb-5">
            {cards.map((card) => (
              <div
                key={card.id}
                className="border border-gray-300 p-4 rounded-lg mb-4 cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, card.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, card.id)}
              >
                {[
                  { label: "Card Name", id: "name", type: "text", value: card.name },
                  {
                    label: "Current Balance",
                    id: "balance",
                    type: "number",
                    value: card.balance,
                    step: "100",
                    min: "0",
                  },
                  {
                    label: "Annual Percentage Rate (APR, %)",
                    id: "apr",
                    type: "number",
                    value: card.apr,
                    step: "0.1",
                    min: "0",
                  },
                  {
                    label: "Minimum Payment (% of Balance)",
                    id: "minPayment",
                    type: "number",
                    value: card.minPayment,
                    step: "0.1",
                    min: "0",
                  },
                  {
                    label: "Credit Limit",
                    id: "creditLimit",
                    type: "number",
                    value: card.creditLimit,
                    step: "100",
                    min: "0",
                  },
                  {
                    label: "Card Issuer",
                    id: "issuer",
                    type: "select",
                    value: card.issuer,
                    options: ["generic", "visa", "amex"].map((v) => ({
                      value: v,
                      label: v.charAt(0).toUpperCase() + v.slice(1),
                    })),
                  },
                  {
                    label: "Balance Transfer Amount",
                    id: "transferAmount",
                    type: "number",
                    value: card.transferAmount,
                    step: "100",
                    min: "0",
                  },
                ].map((field) => (
                  <div key={field.id} className="mb-3">
                    <label className="block mb-1 text-sm font-medium text-gray-700">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        value={field.value}
                        onChange={(e) => updateCard(card.id, field.id, e.target.value)}
                        className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                      >
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => updateCard(card.id, field.id, e.target.value)}
                          step={field.step}
                          min={field.min}
                          className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                        />
                        {field.id === "balance" && (
                          <input
                            type="range"
                            min="0"
                            max="50000"
                            value={field.value}
                            step="100"
                            onChange={(e) => updateCard(card.id, field.id, e.target.value)}
                            className="w-full mt-2"
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
                <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div id={`progress${card.id}`} className="h-full bg-red-500" style={{ width: "0%" }} />
                </div>
                {cards.length > 1 && (
                  <button
                    onClick={() => removeCard(card.id)}
                    className="w-full bg-red-500 text-white p-2 rounded-lg mt-3 hover:bg-red-600"
                  >
                    Remove Card
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addCard}
            className="w-full bg-green-500 text-white p-3 rounded-lg mb-5 hover:bg-green-600"
          >
            Add Another Card
          </button>
          {[
            {
              title: "Balance Transfer Option",
              fields: [
                {
                  label: "Introductory APR (%)",
                  id: "introApr",
                  type: "number",
                  value: transfer.introApr,
                  step: "0.1",
                  min: "0",
                },
                {
                  label: "Introductory Period (Months)",
                  id: "introPeriod",
                  type: "number",
                  value: transfer.introPeriod,
                  step: "1",
                  min: "0",
                },
                {
                  label: "Transfer Fee (%)",
                  id: "fee",
                  type: "number",
                  value: transfer.fee,
                  step: "0.1",
                  min: "0",
                },
                {
                  label: "Regular APR (%)",
                  id: "regularApr",
                  type: "number",
                  value: transfer.regularApr,
                  step: "0.1",
                  min: "0",
                },
              ],
              state: transfer,
              setState: setTransfer,
            },
            {
              title: "Payment Strategy",
              fields: [
                {
                  label: "Payment Strategy",
                  id: "type",
                  type: "select",
                  value: strategy.type,
                  options: ["minimum", "fixed", "snowball", "avalanche", "hybrid", "custom"].map((v) => ({
                    value: v,
                    label: v.charAt(0).toUpperCase() + v.slice(1),
                  })),
                },
                {
                  label: "Fixed Payment Amount",
                  id: "fixedPayment",
                  type: "number",
                  value: strategy.fixedPayment,
                  step: "10",
                  min: "0",
                },
                {
                  label: "Extra Monthly Payment",
                  id: "extraPayment",
                  type: "number",
                  value: strategy.extraPayment,
                  step: "10",
                  min: "0",
                },
              ],
              state: strategy,
              setState: setStrategy,
            },
            {
              title: "Personal Details",
              fields: [
                {
                  label: "Current Age",
                  id: "currentAge",
                  type: "number",
                  value: personal.currentAge,
                  step: "1",
                  min: "18",
                  max: "100",
                },
                {
                  label: "Filing Status",
                  id: "filingStatus",
                  type: "select",
                  value: personal.filingStatus,
                  options: ["single", "marriedJoint", "marriedSeparate", "headHousehold"].map((v) => ({
                    value: v,
                    label: v.replace(/([A-Z])/g, " $1").trim(),
                  })),
                },
                {
                  label: "Other Annual Income",
                  id: "otherIncome",
                  type: "number",
                  value: personal.otherIncome,
                  step: "100",
                  min: "0",
                },
                {
                  label: "Tax Year",
                  id: "taxYear",
                  type: "select",
                  value: personal.taxYear,
                  options: ["2024", "2025"].map((v) => ({ value: v, label: v })),
                },
                {
                  label: "State",
                  id: "state",
                  type: "select",
                  value: personal.state,
                  options: ["none", "CA", "NY", "TX"].map((v) => ({
                    value: v,
                    label: v === "none" ? "No State Tax" : v,
                  })),
                },
                {
                  label: "Debt Type",
                  id: "debtType",
                  type: "select",
                  value: personal.debtType,
                  options: ["personal", "business", "student"].map((v) => ({
                    value: v,
                    label: v.charAt(0).toUpperCase() + v.slice(1),
                  })),
                },
              ],
              state: personal,
              setState: setPersonal,
            },
            {
              title: "Planning Factors",
              fields: [
                {
                  label: "Inflation Rate (%)",
                  id: "inflationRate",
                  type: "number",
                  value: planning.inflationRate,
                  step: "0.1",
                  min: "0",
                },
                {
                  label: "Savings Interest Rate (%)",
                  id: "savingsRate",
                  type: "number",
                  value: planning.savingsRate,
                  step: "0.1",
                  min: "0",
                },
                {
                  label: "Monthly Budget for Payments",
                  id: "budget",
                  type: "number",
                  value: planning.budget,
                  step: "10",
                  min: "0",
                },
                {
                  label: "Interest Compounding",
                  id: "compounding",
                  type: "select",
                  value: planning.compounding,
                  options: ["monthly", "daily"].map((v) => ({
                    value: v,
                    label: v.charAt(0).toUpperCase() + v.slice(1),
                  })),
                },
                {
                  label: "Currency",
                  id: "currency",
                  type: "select",
                  value: planning.currency,
                  options: ["USD", "EUR", "INR"].map((v) => ({ value: v, label: v })),
                },
              ],
              state: planning,
              setState: setPlanning,
            },
          ].map((section) => (
            <div key={section.title}>
              <div
                onClick={() => toggleCollapsible(section.title)}
                className="bg-red-500 text-white p-3 rounded-lg mb-2 text-center cursor-pointer hover:bg-red-600"
              >
                {section.title}
              </div>
              {activeCollapsible[section.title] && (
                <div className="p-4 border border-gray-300 rounded-lg mb-4">
                  {section.fields.map((field) => (
                    <div key={field.id} className="mb-3">
                      <label className="block mb-1 text-sm font-medium text-gray-700">{field.label}</label>
                      {field.type === "select" ? (
                        <select
                          value={field.value}
                          onChange={(e) => section.setState({ ...section.state, [field.id]: e.target.value })}
                          className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                        >
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) =>
                            section.setState({
                              ...section.state,
                              [field.id]: parseFloat(e.target.value) || 0,
                            })
                          }
                          step={field.step}
                          min={field.min}
                          max={field.max}
                          className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:border-red-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={handleCalculate}
            className="w-full bg-red-500 text-white p-3 rounded-lg mb-5 hover:bg-red-600"
          >
            Calculate Payoff
          </button>
          {results && (
            <>
              {results.error ? (
                <div className="text-red-500 text-center mb-5">{results.error}</div>
              ) : (
                <>
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Payoff Timeline (Month)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={results.months}
                      value={results.timeline || 0}
                      onChange={(e) => {
                        const month = parseInt(e.target.value);
                        const monthData = schedule.filter((item) => item.month === month);
                        setResults({
                          ...results,
                          timeline: month,
                          timelineInfo: monthData.length
                            ? `Month ${month}: ${monthData
                                .map((d) => `${d.card}: ${formatCurrency(d.balance)}`)
                                .join(", ")}`
                            : `Month ${month}: All paid off`,
                        });
                      }}
                      className="w-full"
                    />
                    <div className="text-gray-600 text-center">{results.timelineInfo || ""}</div>
                  </div>
                  <table className="w-full border-collapse mb-5">
                    <thead>
                      <tr className="bg-red-500 text-white">
                        {["Metric", "Value"].map((h, i) => (
                          <th key={h} className="p-2 text-left" onClick={() => handleSort(i)}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Total Balance", value: formatCurrency(results.totalBalance) },
                        { label: "Payoff Timeline (Months)", value: results.months },
                        { label: "Total Interest Paid", value: formatCurrency(results.totalInterest) },
                        { label: "Net Cost", value: formatCurrency(results.netCost) },
                        { label: "Opportunity Cost", value: formatCurrency(results.opportunityCost) },
                        {
                          label: "Credit Utilization Ratio",
                          value: `${(results.utilizationRatio * 100).toFixed(2)}%`,
                        },
                        {
                          label: "Estimated Credit Score Impact",
                          value: `${results.scoreImpact > 0 ? "+" : ""}${results.scoreImpact} points`,
                        },
                      ].map((metric) => (
                        <tr key={metric.label} className="border-b border-gray-300">
                          <td className="p-2">{metric.label}</td>
                          <td className="p-2">{metric.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <table className="w-full border-collapse mb-5">
                    <thead>
                      <tr className="bg-red-500 text-white">
                        {["Strategy", "Months", "Interest", "Net Cost"].map((h, i) => (
                          <th key={h} className="p-2 text-left" onClick={() => handleSort(i)}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {scenarios.map((s) => (
                        <tr key={s.strategy} className="border-b border-gray-300">
                          <td className="p-2">{s.strategy.charAt(0).toUpperCase() + s.strategy.slice(1)}</td>
                          <td className="p-2">{s.months}</td>
                          <td className="p-2">{formatCurrency(s.interest)}</td>
                          <td className="p-2">{formatCurrency(s.netCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <table className="w-full border-collapse mb-5 max-h-96 overflow-y-auto block">
                    <thead>
                      <tr className="bg-red-500 text-white">
                        {["Month", "Card", "Payment", "Interest", "Balance"].map((h, i) => (
                          <th key={h} className="p-2 text-left cursor-pointer" onClick={() => handleSort(i)}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((item) => (
                        <tr key={`${item.month}-${item.card}`} className="border-b border-gray-300">
                          <td className="p-2">{item.month}</td>
                          <td className="p-2">{item.card}</td>
                          <td className="p-2">{formatCurrency(item.payment)}</td>
                          <td className="p-2">{formatCurrency(item.interest)}</td>
                          <td className="p-2">{formatCurrency(item.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <canvas ref={chartRef} className="border-2 border-gray-300 rounded-lg mb-5" />
                  <div className="flex gap-4 mb-5">
                    <button
                      onClick={exportCSV}
                      className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
                    >
                      Download Payoff Schedule (CSV)
                    </button>
                    <button
                      onClick={exportPDF}
                      className="flex-1 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600"
                    >
                      Download Payoff Summary (PDF)
                    </button>
                  </div>
                  {results.tips && (
                    <div className="text-gray-600">
                      <strong>Financial Planning Tips:</strong>
                      <ul className="list-disc pl-5">
                        {results.tips.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .cursor-move:hover {
          transform: translateY(-2px);
          transition: transform 0.3s ease;
        }
        .cursor-move.dragging {
          opacity: 0.5;
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
}
