"use client";

import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [gender, setGender] = useState("female");
  const [bodyWeight, setBodyWeight] = useState(150);
  const [unitSystem, setUnitSystem] = useState("imperial");
  const [exercise, setExercise] = useState("bench");
  const [weight, setWeight] = useState(135);
  const [reps, setReps] = useState(5);
  const [formula, setFormula] = useState("epley");
  const [experience, setExperience] = useState("beginner");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState(null);
  const [oneRmHistory, setOneRmHistory] = useState([]);
  const [showWarmUpModal, setShowWarmUpModal] = useState(false);
  const [warmUp1RM, setWarmUp1RM] = useState(0);

  const formulaBarChartRef = useRef(null);
  const repLineChartRef = useRef(null);
  const progressGaugeRef = useRef(null);
  const chartInstances = useRef({});

  useEffect(() => {
    setOneRmHistory(JSON.parse(localStorage.getItem("oneRmHistory")) || []);
  }, []);

  const updateInputFields = (newUnitSystem) => {
    if (newUnitSystem === "metric") {
      setWeight((prev) => (prev * 0.453592).toFixed(4));
      setBodyWeight((prev) => (prev * 0.453592).toFixed(4));
    } else {
      setWeight((prev) => (prev / 0.453592).toFixed(2));
      setBodyWeight((prev) => (prev / 0.453592).toFixed(2));
    }
    setErrorMessage("");
  };

  const convertUnits = () => {
    const newUnitSystem = unitSystem === "imperial" ? "metric" : "imperial";
    setUnitSystem(newUnitSystem);
    updateInputFields(newUnitSystem);
  };

  const calculate1RMValue = (weight, reps, formula) => {
    let oneRm;
    if (formula === "epley") {
      oneRm = weight * (1 + reps / 30);
    } else if (formula === "brzycki") {
      oneRm = weight * (36 / (37 - reps));
    } else if (formula === "lander") {
      oneRm = (100 * weight) / (101.3 - 2.67123 * reps);
    } else if (formula === "mayhew") {
      oneRm = (100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps));
    }
    return Number(oneRm.toFixed(2));
  };

  const calculateStrengthRatio = (oneRm, bodyWeight) => {
    const oneRmKg = unitSystem === "metric" ? oneRm : oneRm * 0.453592;
    const bodyWeightKg = unitSystem === "metric" ? bodyWeight : bodyWeight * 0.453592;
    return (oneRmKg / bodyWeightKg).toFixed(2);
  };

  const getStrengthLevel = (oneRm, gender, bodyWeight, exercise) => {
    const standards = {
      bench: {
        male: { beginner: 135, intermediate: 185, advanced: 225 },
        female: { beginner: 65, intermediate: 100, advanced: 135 },
      },
      squat: {
        male: { beginner: 185, intermediate: 250, advanced: 315 },
        female: { beginner: 100, intermediate: 155, advanced: 205 },
      },
      deadlift: {
        male: { beginner: 225, intermediate: 315, advanced: 405 },
        female: { beginner: 135, intermediate: 205, advanced: 275 },
      },
      overhead: {
        male: { beginner: 95, intermediate: 135, advanced: 185 },
        female: { beginner: 45, intermediate: 75, advanced: 100 },
      },
    };

    const oneRmLb = unitSystem === "metric" ? oneRm / 0.453592 : oneRm;
    const level = standards[exercise][gender];
    if (oneRmLb < level.beginner) return "Below Beginner";
    if (oneRmLb < level.intermediate) return "Beginner";
    if (oneRmLb < level.advanced) return "Intermediate";
    return "Advanced";
  };

  const getTrainingInsights = (oneRm, strengthRatio, strengthLevel, exercise) => {
    let insights = `Your 1RM for ${exercise} is ${oneRm} ${
      unitSystem === "metric" ? "kg" : "lb"
    }, with a strength-to-weight ratio of ${strengthRatio}. `;
    insights += `Your strength level is ${strengthLevel}. `;

    if (strengthLevel === "Below Beginner" || strengthLevel === "Beginner") {
      insights += `Focus on form and progressive overload. Try a 5x5 program with 65–80% of your 1RM (≈${(
        oneRm * 0.65
      ).toFixed(1)}–${(oneRm * 0.8).toFixed(1)} ${unitSystem === "metric" ? "kg" : "lb"}). `;
    } else if (strengthLevel === "Intermediate") {
      insights += `Incorporate periodization. Try a 3x8–12 program with 70–85% of your 1RM (≈${(
        oneRm * 0.7
      ).toFixed(1)}–${(oneRm * 0.85).toFixed(1)} ${unitSystem === "metric" ? "kg" : "lb"}). `;
    } else {
      insights += `Optimize with advanced techniques (e.g., clusters). Use 80–95% of your 1RM (≈${(
        oneRm * 0.8
      ).toFixed(1)}–${(oneRm * 0.95).toFixed(1)} ${unitSystem === "metric" ? "kg" : "lb"}). `;
    }

    if (strengthRatio < 1.0) {
      insights += `Your strength-to-weight ratio is below 1.0. Increasing strength or reducing body weight can improve this. `;
    } else if (strengthRatio >= 1.5) {
      insights += `Your strength-to-weight ratio is excellent, indicating strong relative strength. `;
    }

    if (exercise === "bench") {
      insights += `Ensure proper scapular retraction and bar path for bench press efficiency. `;
    } else if (exercise === "squat") {
      insights += `Maintain depth and core bracing for safe, effective squats. `;
    } else if (exercise === "deadlift") {
      insights += `Focus on hip hinge and neutral spine to maximize deadlift performance. `;
    } else {
      insights += `Stabilize your core and avoid excessive momentum for overhead press. `;
    }

    return insights;
  };

  const calculate1RM = () => {
    setErrorMessage("");

    if (isNaN(weight) || isNaN(reps) || isNaN(bodyWeight) || weight <= 0 || bodyWeight <= 0) {
      setErrorMessage("Please provide valid weight, repetitions, and body weight.");
      return;
    }
    if (reps < 1 || reps > 20) {
      setErrorMessage("Repetitions must be between 1 and 20.");
      return;
    }
    if (weight > (unitSystem === "metric" ? 600 : 1322.77)) {
      setErrorMessage(
        `Weight lifted seems unrealistic (max ${unitSystem === "metric" ? "600 kg" : "1322.77 lb"}).`
      );
      return;
    }
    if (
      bodyWeight < (unitSystem === "metric" ? 20 : 44) ||
      bodyWeight > (unitSystem === "metric" ? 300 : 661)
    ) {
      setErrorMessage(`Body weight must be between ${unitSystem === "metric" ? "20–300 kg" : "44–661 lb"}.`);
      return;
    }

    const oneRm = calculate1RMValue(weight, reps, formula);
    if (!oneRm || oneRm < weight || oneRm > (unitSystem === "metric" ? 600 : 1322.77)) {
      setErrorMessage("Calculated 1RM is out of range. Please check your inputs.");
      return;
    }

    const strengthRatio = calculateStrengthRatio(oneRm, bodyWeight);
    const strengthLevel = getStrengthLevel(oneRm, gender, bodyWeight, exercise);
    const trainingInsights = getTrainingInsights(oneRm, strengthRatio, strengthLevel, exercise);

    const calcDetails =
      formula === "epley"
        ? `Epley: ${weight} × (1 + (${reps} / 30)) = ${oneRm} ${unitSystem === "metric" ? "kg" : "lb"}`
        : formula === "brzycki"
        ? `Brzycki: ${weight} × (36 / (37 - ${reps})) = ${oneRm} ${unitSystem === "metric" ? "kg" : "lb"}`
        : formula === "lander"
        ? `Lander: (100 × ${weight}) / (101.3 - 2.67123 × ${reps}) = ${oneRm} ${
            unitSystem === "metric" ? "kg" : "lb"
          }`
        : `Mayhew: (100 × ${weight}) / (52.2 + (41.9 × e^(-0.055 × ${reps}))) = ${oneRm} ${
            unitSystem === "metric" ? "kg" : "lb"
          }`;

    const percentages = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
    const percentageTable = percentages.map((p) => ({
      percent: p,
      weight: ((oneRm * p) / 100).toFixed(2),
    }));

    const repMaxes = [
      { reps: 3, weight: (oneRm / (1 + 3 / 30)).toFixed(2) },
      { reps: 5, weight: (oneRm / (1 + 5 / 30)).toFixed(2) },
      { reps: 10, weight: (oneRm / (1 + 10 / 30)).toFixed(2) },
    ];

    const standard1RM = standards[exercise][gender].advanced * (unitSystem === "metric" ? 0.453592 : 1);
    const progressPercent = Math.min((oneRm / standard1RM) * 100, 150).toFixed(0);

    setResults({
      oneRm,
      strengthRatio,
      strengthLevel,
      trainingInsights,
      calcDetails,
      percentageTable,
      repMaxes,
      progressPercent,
    });

    const measurement = {
      date: new Date().toLocaleString(),
      exercise,
      oneRm: `${oneRm} ${unitSystem === "metric" ? "kg" : "lb"}`,
      weight: `${weight} ${unitSystem === "metric" ? "kg" : "lb"}`,
      reps,
    };
    const newHistory = [...oneRmHistory, measurement];
    setOneRmHistory(newHistory);
    localStorage.setItem("oneRmHistory", JSON.stringify(newHistory));
  };

  useEffect(() => {
    if (results) {
      const drawProgressGauge = (progress) => {
        if (chartInstances.current.progressGauge) chartInstances.current.progressGauge.destroy();

        chartInstances.current.progressGauge = new Chart(progressGaugeRef.current, {
          type: "doughnut",
          data: {
            labels: ["Progress", "Remaining"],
            datasets: [
              {
                data: [progress, 150 - progress],
                backgroundColor: ["#10b981", "#e5e7eb"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            cutout: "80%",
            circumference: 180,
            rotation: 270,
            plugins: {
              legend: { display: false },
              title: { display: false },
              tooltip: { enabled: false },
              afterDraw: (chart) => {
                const ctx = chart.ctx;
                ctx.font = "16px Arial";
                ctx.fillStyle = "#1f2937";
                ctx.textAlign = "center";
                ctx.fillText(`${progress}%`, chart.width / 2, chart.height - 10);
              },
            },
          },
        });
      };

      drawProgressGauge(results.progressPercent);

      if (chartInstances.current.formulaBarChart) chartInstances.current.formulaBarChart.destroy();
      const epley1RM = calculate1RMValue(weight, reps, "epley");
      const brzycki1RM = calculate1RMValue(weight, reps, "brzycki");
      const lander1RM = calculate1RMValue(weight, reps, "lander");
      const mayhew1RM = calculate1RMValue(weight, reps, "mayhew");
      chartInstances.current.formulaBarChart = new Chart(formulaBarChartRef.current, {
        type: "bar",
        data: {
          labels: ["Epley", "Brzycki", "Lander", "Mayhew"],
          datasets: [
            {
              label: `1RM (${unitSystem === "metric" ? "kg" : "lb"})`,
              data: [epley1RM, brzycki1RM, lander1RM, mayhew1RM],
              backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
              borderColor: ["#1e3a8a", "#065f46", "#b45309", "#991b1b"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false,
              title: { display: true, text: `1RM (${unitSystem === "metric" ? "kg" : "lb"})` },
            },
          },
          plugins: {
            legend: { display: false },
            title: { display: true, text: "1RM by Formula" },
          },
        },
      });

      if (chartInstances.current.repLineChart) chartInstances.current.repLineChart.destroy();
      const repRange = [1, 3, 5, 8, 10, 12, 15];
      const repWeights = repRange.map((r) => ({
        reps: r,
        weight: (results.oneRm / (1 + r / 30)).toFixed(2),
      }));
      chartInstances.current.repLineChart = new Chart(repLineChartRef.current, {
        type: "line",
        data: {
          labels: repRange,
          datasets: [
            {
              label: `Weight (${unitSystem === "metric" ? "kg" : "lb"})`,
              data: repWeights.map((rw) => rw.weight),
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Repetitions" } },
            y: { title: { display: true, text: `Weight (${unitSystem === "metric" ? "kg" : "lb"})` } },
          },
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Weight Across Repetitions" },
          },
        },
      });
    }
  }, [results, unitSystem, weight, reps]);

  const calculateWarmUp = () => {
    if (isNaN(warmUp1RM) || warmUp1RM <= 0) {
      setErrorMessage("Invalid 1RM value.");
      return;
    }

    const warmUpSets = [
      { percent: 40, reps: 5, weight: (warmUp1RM * 0.4).toFixed(2) },
      { percent: 50, reps: 5, weight: (warmUp1RM * 0.5).toFixed(2) },
      { percent: 60, reps: 3, weight: (warmUp1RM * 0.6).toFixed(2) },
      { percent: 70, reps: 2, weight: (warmUp1RM * 0.7).toFixed(2) },
      { percent: 80, reps: 1, weight: (warmUp1RM * 0.8).toFixed(2) },
    ];

    setSuccessMessage(
      `Warm-Up Sets:\n${warmUpSets
        .map(
          (set) =>
            `${set.weight} ${unitSystem === "metric" ? "kg" : "lb"} × ${set.reps} reps (${set.percent}%)`
        )
        .join("\n")}`
    );
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 4000);
    setShowWarmUpModal(false);
  };

  const saveCalculation = () => {
    if (results && !errorMessage) {
      setSuccessMessage("Measurement saved to history!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 2000);
    } else {
      setErrorMessage("Cannot save invalid measurement.");
    }
  };

  const loadHistory = () => {
    if (oneRmHistory.length === 0) {
      setErrorMessage("No saved measurements found.");
      return;
    }
    setResults({ ...results, showHistory: true });
  };

  const exportResults = () => {
    if (!results) return;

    const exportContent = `
Advanced One Rep Max Calculator Results
======================================
Gender: ${gender}
Body Weight: ${bodyWeight} ${unitSystem === "metric" ? "kg" : "lb"}
Exercise: ${exercise}
Formula: ${
      formula === "epley"
        ? "Epley"
        : formula === "brzycki"
        ? "Brzycki"
        : formula === "lander"
        ? "Lander"
        : "Mayhew"
    }
Experience Level: ${experience}

Results:
- One Rep Max: ${results.oneRm} ${unitSystem === "metric" ? "kg" : "lb"}
- Strength-to-Weight Ratio: ${results.strengthRatio}
- Strength Level: ${results.strengthLevel}

Training Insights:
${results.trainingInsights}

Calculation Details:
${results.calcDetails}

Measurement Details:
- Weight Lifted: ${weight} ${unitSystem === "metric" ? "kg" : "lb"}
- Repetitions: ${reps}

Measurement History:
${oneRmHistory
  .map(
    (h) => `Date: ${h.date}, Exercise: ${h.exercise}, 1RM: ${h.oneRm}, Weight: ${h.weight}, Reps: ${h.reps}`
  )
  .join("\n")}
======================================
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "1rm_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-5xl w-full animate-slide-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced One Rep Max Calculator</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Enter Your Lift Details</h2>
          <p className="text-sm text-gray-600 mb-4">
            Calculate your One Rep Max (1RM) with insights for strength training and programming.
          </p>
          {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-sm mb-4">{successMessage}</div>}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Gender
                <span className="relative inline-block cursor-pointer ml-1">
                  ?
                  <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                    Gender affects strength standards.
                  </span>
                </span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Body Weight
                <span className="relative inline-block cursor-pointer ml-1">
                  ?
                  <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                    Used for strength-to-weight ratio.
                  </span>
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                value={bodyWeight}
                onChange={(e) => setBodyWeight(parseFloat(e.target.value))}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Unit System
                <span className="relative inline-block cursor-pointer ml-1">
                  ?
                  <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                    Choose metric (kg) or imperial (lb).
                  </span>
                </span>
              </label>
              <select
                value={unitSystem}
                onChange={(e) => {
                  setUnitSystem(e.target.value);
                  updateInputFields(e.target.value);
                }}
                className="w-full p-3 border rounded-lg"
              >
                <option value="metric">Metric (kg)</option>
                <option value="imperial">Imperial (lb)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Exercise
                <span className="relative inline-block cursor-pointer ml-1">
                  ?
                  <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                    Select the lift for context-specific insights.
                  </span>
                </span>
              </label>
              <select
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="bench">Bench Press</option>
                <option value="squat">Squat</option>
                <option value="deadlift">Deadlift</option>
                <option value="overhead">Overhead Press</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Weight Lifted ({unitSystem === "metric" ? "kg" : "lb"})
              </label>
              <input
                type="number"
                step={unitSystem === "metric" ? "0.0001" : "0.01"}
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Repetitions
                <span className="relative inline-block cursor-pointer ml-1">
                  ?
                  <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                    Number of reps performed (1–20).
                  </span>
                </span>
              </label>
              <input
                type="number"
                value={reps}
                min="1"
                max="20"
                onChange={(e) => setReps(parseInt(e.target.value))}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Formula
                <span className="relative inline-block cursor-pointer ml-1">
                  ?
                  <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                    Epley is standard; others vary slightly.
                  </span>
                </span>
              </label>
              <select
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="epley">Epley (Recommended)</option>
                <option value="brzycki">Brzycki</option>
                <option value="lander">Lander</option>
                <option value="mayhew">Mayhew</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Experience Level
                <span className="relative inline-block cursor-pointer ml-1">
                  ?
                  <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                    Compare to strength standards.
                  </span>
                </span>
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <button
            onClick={convertUnits}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Convert Units
          </button>
        </div>

        {showWarmUpModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Warm-Up Calculator</h3>
              <p className="text-sm text-gray-600 mb-4">Generate warm-up sets based on your 1RM.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">1RM</label>
                  <input
                    type="number"
                    step="0.01"
                    value={warmUp1RM}
                    onChange={(e) => setWarmUp1RM(parseFloat(e.target.value))}
                    className="w-full p-3 border rounded-lg"
                    readOnly
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={calculateWarmUp}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Calculate
                </button>
                <button
                  onClick={() => setShowWarmUpModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={calculate1RM}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 border-2 border-red-500"
          >
            Calculate 1RM
          </button>
          <button
            onClick={saveCalculation}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Save Measurement
          </button>
          <button
            onClick={loadHistory}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            View History
          </button>
          <button
            onClick={() => {
              if (!results) {
                setErrorMessage("Please calculate 1RM first.");
                return;
              }
              setWarmUp1RM(results.oneRm);
              setShowWarmUpModal(true);
            }}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Warm-Up Calculator
          </button>
        </div>

        {results && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">One Rep Max</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {results.oneRm} {unitSystem === "metric" ? "kg" : "lb"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Strength-to-Weight Ratio</h3>
                <p className="text-2xl font-bold text-gray-800">{results.strengthRatio}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Strength Level</h3>
                <p className="text-2xl font-bold text-gray-800">{results.strengthLevel}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Training Insights</h3>
              <p className="text-gray-600">{results.trainingInsights}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">1RM Progress</h3>
              <div className="w-48 h-24 mx-auto">
                <canvas ref={progressGaugeRef}></canvas>
              </div>
              <p className="text-gray-600 text-center">
                Your 1RM is {results.progressPercent}% of an advanced lifter's standard.
              </p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Percentage of 1RM</h3>
              <table className="w-full text-sm text-gray-600">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">% of 1RM</th>
                    <th className="p-2">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {results.percentageTable.map((p) => (
                    <tr key={p.percent}>
                      <td className="p-2">{p.percent}%</td>
                      <td className="p-2">
                        {p.weight} {unitSystem === "metric" ? "kg" : "lb"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Rep Max Estimates</h3>
              <table className="w-full text-sm text-gray-600">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Reps</th>
                    <th className="p-2">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {results.repMaxes.map((rm) => (
                    <tr key={rm.reps}>
                      <td className="p-2">{rm.reps}RM</td>
                      <td className="p-2">
                        {rm.weight} {unitSystem === "metric" ? "kg" : "lb"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Formula Comparison</h3>
              <canvas ref={formulaBarChartRef} className="max-h-80"></canvas>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">1RM Across Reps</h3>
              <canvas ref={repLineChartRef} className="max-h-80"></canvas>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Calculation Details</h3>
              <p className="text-gray-600">{results.calcDetails}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Measurement History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Exercise</th>
                      <th className="p-2">1RM</th>
                      <th className="p-2">Weight</th>
                      <th className="p-2">Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oneRmHistory.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2">{row.date}</td>
                        <td className="p-2">{row.exercise}</td>
                        <td className="p-2">{row.oneRm}</td>
                        <td className="p-2">{row.weight}</td>
                        <td className="p-2">{row.reps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={exportResults}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Export as Text
              </button>
            </div>
          </div>
        )}

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

          .relative:hover .absolute {
            visibility: visible;
            opacity: 1;
          }

          .absolute {
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s;
          }

          @media (max-width: 640px) {
            .flex-wrap {
              flex-direction: column;
            }

            .flex-wrap button {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

const standards = {
  bench: {
    male: { beginner: 135, intermediate: 185, advanced: 225 },
    female: { beginner: 65, intermediate: 100, advanced: 135 },
  },
  squat: {
    male: { beginner: 185, intermediate: 250, advanced: 315 },
    female: { beginner: 100, intermediate: 155, advanced: 205 },
  },
  deadlift: {
    male: { beginner: 225, intermediate: 315, advanced: 405 },
    female: { beginner: 135, intermediate: 205, advanced: 275 },
  },
  overhead: {
    male: { beginner: 95, intermediate: 135, advanced: 185 },
    female: { beginner: 45, intermediate: 75, advanced: 100 },
  },
};
