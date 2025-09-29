"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [units, setUnits] = useState("metric");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState("male");
  const [waist, setWaist] = useState(80);
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [fitnessGoal, setFitnessGoal] = useState("weight-loss");
  const [targetWeight, setTargetWeight] = useState(65);
  const [timeline, setTimeline] = useState(12);
  const [exerciseFrequency, setExerciseFrequency] = useState(3);
  const [healthConditions, setHealthConditions] = useState([]);
  const [scenarios, setScenarios] = useState([{ height: 170, weight: 70, goal: "weight-loss" }]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const weightBarChartRef = useRef(null);
  const weightPieChartRef = useRef(null);
  const trendLineChartRef = useRef(null);
  const progressGaugeChartRef = useRef(null);
  const chartInstances = useRef({});

  useEffect(() => {
    setWeightHistory(JSON.parse(localStorage.getItem("weightHistory")) || []);
  }, []);

  const convertUnits = () => {
    setErrorMessage("");
    const newUnits = units === "metric" ? "imperial" : "metric";
    setUnits(newUnits);

    if (!isNaN(weight)) {
      setWeight(newUnits === "metric" ? (weight / 2.20462).toFixed(1) : (weight * 2.20462).toFixed(1));
    }
    if (!isNaN(height)) {
      setHeight(newUnits === "metric" ? (height / 0.393701).toFixed(1) : (height * 0.393701).toFixed(1));
    }
    if (!isNaN(waist)) {
      setWaist(newUnits === "metric" ? (waist / 0.393701).toFixed(1) : (waist * 0.393701).toFixed(1));
    }
    if (!isNaN(targetWeight)) {
      setTargetWeight(
        newUnits === "metric" ? (targetWeight / 2.20462).toFixed(1) : (targetWeight * 2.20462).toFixed(1)
      );
    }

    setScenarios(
      scenarios.map((s) => ({
        ...s,
        height: !isNaN(s.height)
          ? newUnits === "metric"
            ? (s.height / 0.393701).toFixed(1)
            : (s.height * 0.393701).toFixed(1)
          : s.height,
        weight: !isNaN(s.weight)
          ? newUnits === "metric"
            ? (s.weight / 2.20462).toFixed(1)
            : (s.weight * 2.20462).toFixed(1)
          : s.weight,
      }))
    );
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setErrorMessage("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([...scenarios, { height: 170, weight: 70, goal: "weight-loss" }]);
  };

  const calculateBMI = (weight, height, units) => {
    if (units === "metric") {
      return (weight / (height / 100) ** 2).toFixed(1);
    } else {
      return ((703 * weight) / height ** 2).toFixed(1);
    }
  };

  const calculateHealthyWeightRange = (height, units) => {
    const heightM = units === "metric" ? height / 100 : height * 0.0254;
    const minWeight = (18.5 * heightM * heightM).toFixed(1);
    const maxWeight = (24.9 * heightM * heightM).toFixed(1);
    return units === "metric"
      ? { min: minWeight, max: maxWeight, unit: "kg" }
      : { min: (minWeight * 2.20462).toFixed(1), max: (maxWeight * 2.20462).toFixed(1), unit: "lb" };
  };

  const calculateIBW = (height, gender, units) => {
    const heightIn = units === "metric" ? height * 0.393701 : height;
    const baseWeight = gender === "male" ? 50 : 45.5;
    const ibwKg = baseWeight + 2.3 * (heightIn - 60);
    return units === "metric" ? ibwKg.toFixed(1) : (ibwKg * 2.20462).toFixed(1);
  };

  const calculateABW = (weight, ibw, bmi, units) => {
    const weightKg = units === "metric" ? weight : weight / 2.20462;
    const ibwKg = units === "metric" ? ibw : ibw / 2.20462;
    if (bmi > 30) {
      const abwKg = ibwKg + 0.4 * (weightKg - ibwKg);
      return units === "metric" ? abwKg.toFixed(1) : (abwKg * 2.20462).toFixed(1);
    }
    return null;
  };

  const calculateWHtR = (waist, height, units) => {
    const waistCm = units === "metric" ? waist : waist * 2.54;
    const heightCm = units === "metric" ? height : height * 2.54;
    return (waistCm / heightCm).toFixed(2);
  };

  const calculateWeightChange = (weight, targetWeight, timeline, fitnessGoal) => {
    const weightChange = (weight - targetWeight).toFixed(1);
    const weeklyChange = timeline > 0 ? (weightChange / timeline).toFixed(2) : 0;
    const calorieAdjustment =
      fitnessGoal === "weight-loss"
        ? ((weeklyChange * 7700) / 7).toFixed(0)
        : ((weeklyChange * 7700) / 7).toFixed(0);
    return { change: weightChange, weekly: weeklyChange, calories: calorieAdjustment };
  };

  const calculate = () => {
    setErrorMessage("");
    if (
      [weight, height, age, waist, targetWeight, timeline, exerciseFrequency].some((val) => isNaN(val)) ||
      weight <= 0 ||
      height <= 0 ||
      age <= 0 ||
      waist <= 0 ||
      targetWeight <= 0 ||
      timeline < 0 ||
      exerciseFrequency < 0 ||
      exerciseFrequency > 7
    ) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }

    const bmi = calculateBMI(weight, height, units);
    const healthyWeight = calculateHealthyWeightRange(height, units);
    const ibw = calculateIBW(height, gender, units);
    const abw = calculateABW(weight, ibw, bmi, units);
    const whtr = calculateWHtR(waist, height, units);
    const weightChange = calculateWeightChange(weight, targetWeight, timeline, fitnessGoal);
    const bmiStatus = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
    const whtrStatus = whtr > (gender === "male" ? 0.5 : 0.48) ? "High (Increased Risk)" : "Healthy";
    const progress = Math.min(
      Math.abs(((weight - targetWeight) / (weight - healthyWeight.min)) * 100),
      100
    ).toFixed(1);

    let recommendations = "";
    if (fitnessGoal === "weight-loss") {
      recommendations = `To reach ${targetWeight} ${healthyWeight.unit} in ${timeline} weeks, lose ${
        weightChange.weekly
      } ${healthyWeight.unit}/week with a ${weightChange.calories} kcal/day deficit. Exercise ${
        exerciseFrequency + 1
      } days/week (cardio + strength).`;
    } else if (fitnessGoal === "weight-gain") {
      recommendations = `To reach ${targetWeight} ${healthyWeight.unit} in ${timeline} weeks, gain ${
        weightChange.weekly
      } ${healthyWeight.unit}/week with a ${
        weightChange.calories
      } kcal/day surplus. Include strength training ${exerciseFrequency + 1} days/week.`;
    } else {
      recommendations = `Maintain weight within ${healthyWeight.min}–${healthyWeight.max} ${healthyWeight.unit}. Exercise ${exerciseFrequency} days/week for health.`;
    }
    if (healthConditions.length > 0) {
      recommendations += ` Note: Conditions (${healthConditions.join(
        ", "
      )}) may affect weight management. Consult a doctor.`;
    }
    if (bmi < 18.5) {
      recommendations += ` Warning: BMI ${bmi} (Underweight) may indicate health risks. Focus on nutrient-dense foods.`;
    } else if (bmi >= 25) {
      recommendations += ` Warning: BMI ${bmi} (${bmiStatus}) increases risks like diabetes. Consult a professional.`;
    }
    if (whtrStatus === "High (Increased Risk)") {
      recommendations += ` Warning: WHtR ${whtr} indicates high visceral fat. Reduce waist through diet and exercise.`;
    }

    const sensitivity = [];
    for (let h = height * 0.95; h <= height * 1.05; h += height * 0.05) {
      const sHealthyWeight = calculateHealthyWeightRange(h, units);
      sensitivity.push({
        height: h.toFixed(1),
        range: `${sHealthyWeight.min}–${sHealthyWeight.max} ${sHealthyWeight.unit}`,
      });
    }

    const scenarioResults = scenarios
      .map((s, index) => {
        if (!isNaN(s.height) && !isNaN(s.weight)) {
          const sHealthyWeight = calculateHealthyWeightRange(s.height, units);
          const sBMI = calculateBMI(s.weight, s.height, units);
          return {
            name: `Scenario ${index + 1}`,
            range: `${sHealthyWeight.min}–${sHealthyWeight.max} ${sHealthyWeight.unit}`,
            bmi: sBMI,
          };
        }
        return null;
      })
      .filter((s) => s !== null);

    setResults({
      bmi,
      bmiStatus,
      healthyWeight: `${healthyWeight.min}–${healthyWeight.max} ${healthyWeight.unit}`,
      ibw: `${ibw} ${healthyWeight.unit}`,
      abw: abw ? `${abw} ${healthyWeight.unit}` : "N/A",
      whtr,
      whtrStatus,
      weightChange: `${weightChange.change} ${healthyWeight.unit}`,
      weeklyChange: `${weightChange.weekly} ${healthyWeight.unit}/week`,
      calorieAdjustment: `${weightChange.calories} kcal/day`,
      progress: `${progress}%`,
      sensitivity,
      scenarios: scenarioResults,
      recommendations,
    });

    const newHistory = [
      ...weightHistory,
      { date: new Date().toLocaleString(), keyMetric: "Weight", value: weight },
      { date: new Date().toLocaleString(), keyMetric: "BMI", value: bmi },
    ];
    setWeightHistory(newHistory);
    localStorage.setItem("weightHistory", JSON.stringify(newHistory));
  };

  useEffect(() => {
    if (results) {
      const updateCharts = () => {
        if (chartInstances.current.weightBarChart) chartInstances.current.weightBarChart.destroy();
        if (chartInstances.current.weightPieChart) chartInstances.current.weightPieChart.destroy();
        if (chartInstances.current.trendLineChart) chartInstances.current.trendLineChart.destroy();
        if (chartInstances.current.progressGaugeChart) chartInstances.current.progressGaugeChart.destroy();

        chartInstances.current.weightBarChart = new Chart(weightBarChartRef.current, {
          type: "bar",
          data: {
            labels: ["Current", "Healthy Min", "Healthy Max", "IBW", "ABW"],
            datasets: [
              {
                label: "Weight",
                data: [
                  parseFloat(weight),
                  parseFloat(results.healthyWeight.split("–")[0]),
                  parseFloat(results.healthyWeight.split("–")[1].split(" ")[0]),
                  parseFloat(results.ibw),
                  results.abw !== "N/A" ? parseFloat(results.abw) : 0,
                ],
                backgroundColor: ["#3b82f6", "#10b981", "#10b981", "#f59e0b", "#ef4444"],
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: { title: { display: true, text: `Weight (${units === "metric" ? "kg" : "lb"})` }, min: 0 },
            },
            plugins: {
              title: { display: true, text: "Weight Metrics Comparison" },
            },
          },
        });

        chartInstances.current.weightPieChart = new Chart(weightPieChartRef.current, {
          type: "pie",
          data: {
            labels: ["Weight Change Needed", "Remaining"],
            datasets: [
              {
                data: [Math.abs(parseFloat(results.weightChange)), 100],
                backgroundColor: [parseFloat(results.weightChange) > 0 ? "#ef4444" : "#10b981", "#e5e7eb"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Weight Change Needed" },
            },
          },
        });

        chartInstances.current.trendLineChart = new Chart(trendLineChartRef.current, {
          type: "line",
          data: {
            labels: weightHistory.filter((h) => h.keyMetric === "Weight").map((h) => h.date),
            datasets: [
              {
                label: `Weight (${units === "metric" ? "kg" : "lb"})`,
                data: weightHistory.filter((h) => h.keyMetric === "Weight").map((h) => parseFloat(h.value)),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                fill: false,
              },
              {
                label: "BMI",
                data: weightHistory.filter((h) => h.keyMetric === "BMI").map((h) => parseFloat(h.value)),
                borderColor: "#f59e0b",
                backgroundColor: "rgba(245, 158, 11, 0.2)",
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: { title: { display: true, text: "Date" } },
              y: { title: { display: true, text: "Value" }, min: 0 },
            },
            plugins: {
              title: { display: true, text: "Weight & BMI Trend" },
            },
          },
        });

        chartInstances.current.progressGaugeChart = new Chart(progressGaugeChartRef.current, {
          type: "doughnut",
          data: {
            labels: ["Progress", "Remaining"],
            datasets: [
              {
                data: [parseFloat(results.progress), 100 - parseFloat(results.progress)],
                backgroundColor: [parseFloat(results.progress) >= 100 ? "#10b981" : "#3b82f6", "#e5e7eb"],
                circumference: 180,
                rotation: 270,
              },
            ],
          },
          options: {
            responsive: true,
            cutout: "80%",
            plugins: {
              title: { display: true, text: "Progress to Target Weight" },
              legend: { display: false },
            },
          },
        });
      };
      updateCharts();
    }
  }, [results, weightHistory, units, weight]);

  const saveCalculation = () => {
    if (results) {
      setSuccessMessage("Calculation saved to history!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 2000);
    } else {
      setErrorMessage("No valid calculation to save.");
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Key Metric", "Value"],
      ...weightHistory.map((h) => [h.date, h.keyMetric, h.value]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "healthy_weight_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Healthy Weight Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Weight History:", 10, 20);
    let y = 30;
    weightHistory.forEach((h) => {
      doc.text(
        `Date: ${h.date}, ${h.keyMetric}: ${h.value} ${
          h.keyMetric === "Weight" ? (units === "metric" ? "kg" : "lb") : ""
        }`,
        10,
        y
      );
      y += 10;
    });
    doc.text(
      "Note: Visual charts (Bar, Pie, Line, Gauge) and recommendations are available in the web interface.",
      10,
      y
    );
    doc.text("Warning: Consult a healthcare provider for safe weight management.", 10, y + 10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 20);
    doc.save("healthy_weight_results.pdf");
  };

  return (
    <div className="bg-white  flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Healthy Weight Calculator</h1>
        </div>

        <div className="text-yellow-600 text-sm mb-4">
          <strong>Important:</strong> This calculator estimates healthy weight ranges for general guidance.
          Consult a doctor or dietitian for personalized health plans.
        </div>

        {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 text-sm mb-4">{successMessage}</div>}

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal & Health Details</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter details to calculate your healthy weight range and plan goals.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Units
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Metric (kg, cm) or Imperial (lb, inch).
                </span>
              </span>
            </label>
            <select
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="metric">Metric</option>
              <option value="imperial">Imperial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Weight
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Your current weight (kg or lb).
                </span>
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Height
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Your height (cm or inch).
                </span>
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Age
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Your age for health context.
                </span>
              </span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Gender
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Affects Ideal Body Weight calculation.
                </span>
              </span>
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Waist Circumference
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Waist measurement (cm or inch).
                </span>
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={waist}
              onChange={(e) => setWaist(parseFloat(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Activity Level
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Your daily activity level.
                </span>
              </span>
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="very">Very Active</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Fitness Goal
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Your weight goal.
                </span>
              </span>
            </label>
            <select
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="weight-loss">Weight Loss</option>
              <option value="maintenance">Maintenance</option>
              <option value="weight-gain">Weight Gain</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Target Weight
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Desired weight (kg or lb).
                </span>
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={targetWeight}
              onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Weight Change Timeline (Weeks)
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Weeks to reach target weight.
                </span>
              </span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={timeline}
              onChange={(e) => setTimeline(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Exercise Frequency (Days/Week)
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Weekly workout days.
                </span>
              </span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              max="7"
              value={exerciseFrequency}
              onChange={(e) => setExerciseFrequency(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Health Conditions
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Select conditions (optional).
                </span>
              </span>
            </label>
            <select
              multiple
              value={healthConditions}
              onChange={(e) =>
                setHealthConditions(Array.from(e.target.selectedOptions).map((opt) => opt.value))
              }
              className="w-full p-3 border rounded-lg"
            >
              <option value="diabetes">Diabetes</option>
              <option value="hypertension">Hypertension</option>
              <option value="thyroid">Thyroid Issues</option>
            </select>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Scenario Analysis</h2>
        {scenarios.map((s, index) => (
          <div key={index} className="border border-gray-200 p-4 mb-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-2">Scenario {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Height</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={s.height}
                  onChange={(e) => {
                    const newScenarios = [...scenarios];
                    newScenarios[index].height = parseFloat(e.target.value);
                    setScenarios(newScenarios);
                  }}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Weight</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={s.weight}
                  onChange={(e) => {
                    const newScenarios = [...scenarios];
                    newScenarios[index].weight = parseFloat(e.target.value);
                    setScenarios(newScenarios);
                  }}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Fitness Goal</label>
                <select
                  value={s.goal}
                  onChange={(e) => {
                    const newScenarios = [...scenarios];
                    newScenarios[index].goal = e.target.value;
                    setScenarios(newScenarios);
                  }}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="weight-loss">Weight Loss</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="weight-gain">Weight Gain</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addScenario}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4"
        >
          Add Scenario
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4 ml-4"
        >
          Learn About Healthy Weight
        </button>

        <div className="flex gap-4 mt-6 flex-wrap">
          <button
            onClick={convertUnits}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Convert Units
          </button>
          <button onClick={calculate} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">
            Calculate
          </button>
          <button
            onClick={saveCalculation}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Save Calculation
          </button>
        </div>

        {results && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Healthy Weight & Health Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900">BMI</h3>
                <p className="text-xl font-bold text-gray-800">
                  {results.bmi} ({results.bmiStatus})
                </p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">Healthy Weight Range</h3>
                <p className="text-xl font-bold text-gray-800">{results.healthyWeight}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">Ideal Body Weight</h3>
                <p className="text-xl font-bold text-gray-800">{results.ibw}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">Adjusted Body Weight</h3>
                <p className="text-xl font-bold text-gray-800">{results.abw}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">Waist-to-Height Ratio</h3>
                <p className="text-xl font-bold text-gray-800">
                  {results.whtr} ({results.whtrStatus})
                </p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">Weight Change Needed</h3>
                <p className="text-xl font-bold text-gray-800">{results.weightChange}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">Weekly Weight Change</h3>
                <p className="text-xl font-bold text-gray-800">{results.weeklyChange}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">Calorie Adjustment</h3>
                <p className="text-xl font-bold text-gray-800">{results.calorieAdjustment}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">Progress to Target</h3>
                <p className="text-xl font-bold text-gray-800">{results.progress}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Weight Metrics Comparison</h3>
              <canvas ref={weightBarChartRef} className="max-h-80"></canvas>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Weight Change Needed</h3>
              <canvas ref={weightPieChartRef} className="max-h-80"></canvas>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
              <table className="w-full text-sm text-gray-600">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Scenario</th>
                    <th className="p-2">Healthy Weight Range</th>
                    <th className="p-2">BMI</th>
                  </tr>
                </thead>
                <tbody>
                  {results.scenarios.map((s) => (
                    <tr key={s.name}>
                      <td className="p-2">{s.name}</td>
                      <td className="p-2">{s.range}</td>
                      <td className="p-2">{s.bmi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Sensitivity Analysis</h3>
              <p className="text-gray-600">
                Healthy weight range varies from {results.sensitivity[0].range} at{" "}
                {results.sensitivity[0].height} {units === "metric" ? "cm" : "in"} to{" "}
                {results.sensitivity[results.sensitivity.length - 1].range} at{" "}
                {results.sensitivity[results.sensitivity.length - 1].height}{" "}
                {units === "metric" ? "cm" : "in"}.
              </p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Weight & BMI Trend</h3>
              <canvas ref={trendLineChartRef} className="max-h-80"></canvas>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Progress to Target Weight</h3>
              <canvas ref={progressGaugeChartRef} className="max-h-80"></canvas>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Recommendations</h3>
              <p className="text-gray-600">{results.recommendations}</p>
            </div>
            <div className="mt-6 overflow-x-auto max-h-80 overflow-y-auto">
              <h3 className="text-md font-medium text-gray-900">Weight History</h3>
              <table className="w-full text-sm text-gray-600">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Date</th>
                    <th className="p-2">Key Metric</th>
                    <th className="p-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {weightHistory.map((h, i) => (
                    <tr key={i}>
                      <td className="p-2">{h.date}</td>
                      <td className="p-2">{h.keyMetric}</td>
                      <td className="p-2">
                        {h.value} {h.keyMetric === "Weight" ? (units === "metric" ? "kg" : "lb") : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={exportCSV}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Export CSV
              </button>
              <button
                onClick={exportPDF}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Export PDF
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg max-w-xl w-11/12 relative">
              <span
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-4 text-xl cursor-pointer"
              >
                ×
              </span>
              <h2 className="text-xl font-semibold mb-4">Understanding Healthy Weight</h2>
              <p className="mb-4">
                A healthy weight reduces the risk of chronic diseases and supports overall well-being. Metrics
                like BMI, Ideal Body Weight (IBW), and Waist-to-Height Ratio (WHtR) guide weight management.
              </p>
              <h3 className="text-md font-medium mb-2">Key Metrics</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>
                  <strong>BMI:</strong> Weight (kg) / [Height (m)]². Healthy: 18.5–24.9.
                </li>
                <li>
                  <strong>IBW:</strong> Ideal weight based on height and gender.
                </li>
                <li>
                  <strong>WHtR:</strong> Waist / Height. Healthy: &lt;0.5 (men), &lt;0.48 (women).
                </li>
                <li>
                  <strong>ABW:</strong> Adjusted weight for obese individuals.
                </li>
              </ul>
              <h3 className="text-md font-medium mb-2">Health Risks</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>
                  <strong>Underweight (BMI &lt; 18.5):</strong> Nutrient deficiencies, weakened immunity.
                </li>
                <li>
                  <strong>Overweight (BMI 25–29.9):</strong> Hypertension, heart disease.
                </li>
                <li>
                  <strong>Obese (BMI ≥ 30):</strong> Diabetes, joint issues.
                </li>
                <li>
                  <strong>High WHtR:</strong> Increased visceral fat, cardiovascular risk.
                </li>
              </ul>
              <h3 className="text-md font-medium mb-2">Tips</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Aim for 0.5–1 kg/week weight loss or 0.5 kg/week gain.</li>
                <li>Exercise 150–300 min/week at moderate intensity.</li>
                <li>Consult a dietitian for safe weight management plans.</li>
              </ul>
              <h3 className="text-md font-medium mb-2">Resources</h3>
              <p className="mb-4">For more information, visit:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>
                  <a
                    href="https://www.cdc.gov/healthyweight"
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    CDC Healthy Weight
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.who.int/health-topics/obesity"
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    WHO Obesity
                  </a>
                </li>
                <li>Local healthcare providers.</li>
              </ul>
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
  );
}
