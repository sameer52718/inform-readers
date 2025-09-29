"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [formData, setFormData] = useState({
    units: "metric",
    weight: 70,
    height: 170,
    age: 30,
    gender: "male",
    activityLevel: "sedentary",
    fitnessGoal: "weight-loss",
    calorieIntake: 2000,
    exerciseFrequency: 3,
    targetWeight: 65,
    bodyFat: 20,
    healthConditions: [],
  });
  const [scenarios, setScenarios] = useState([
    { weight: 70, activityLevel: "sedentary", goal: "weight-loss" },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [healthHistory, setHealthHistory] = useState([]);
  const [results, setResults] = useState({});
  const macroPieChartRef = useRef(null);
  const trendLineChartRef = useRef(null);
  const tdeeBarChartRef = useRef(null);
  const balanceGaugeChartRef = useRef(null);
  let macroPieChartInstance = useRef(null);
  let trendLineChartInstance = useRef(null);
  let tdeeBarChartInstance = useRef(null);
  let balanceGaugeChartInstance = useRef(null);

  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extreme: 1.9,
  };

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("healthHistory")) || [];
    setHealthHistory(savedHistory);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "weight",
        "height",
        "age",
        "calorieIntake",
        "exerciseFrequency",
        "targetWeight",
        "bodyFat",
      ].includes(name)
        ? parseFloat(value) || ""
        : value,
    }));
  };

  const handleHealthConditionsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormData((prev) => ({ ...prev, healthConditions: selected }));
  };

  const handleScenarioChange = (index, field, value) => {
    setScenarios((prev) => {
      const newScenarios = [...prev];
      newScenarios[index][field] = field === "weight" ? parseFloat(value) || "" : value;
      return newScenarios;
    });
  };

  const convertUnits = () => {
    setErrorMessage("");
    const { units, weight, height, targetWeight } = formData;
    const newUnits = units === "metric" ? "imperial" : "metric";
    const convert = (val, toMetric) => (toMetric ? (val / 2.20462).toFixed(1) : (val * 2.20462).toFixed(1));

    if ([weight, height, targetWeight].some((val) => isNaN(parseFloat(val)) && val !== "")) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      units: newUnits,
      weight: convert(weight, newUnits === "metric"),
      height: convert(height, newUnits === "metric"),
      targetWeight: convert(targetWeight, newUnits === "metric"),
    }));

    setScenarios((prev) =>
      prev.map((s) => ({
        ...s,
        weight: convert(s.weight, newUnits === "metric"),
      }))
    );
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setErrorMessage("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios((prev) => [...prev, { weight: 70, activityLevel: "sedentary", goal: "weight-loss" }]);
  };

  const calculateBMI = (weight, height, units) => {
    weight = parseFloat(weight);
    height = parseFloat(height);
    return units === "metric"
      ? (weight / (height / 100) ** 2).toFixed(1)
      : ((703 * weight) / height ** 2).toFixed(1);
  };

  const calculateHealthyWeightRange = (height, units) => {
    const heightM = units === "metric" ? parseFloat(height) / 100 : parseFloat(height) * 0.0254;
    const minWeight = (18.5 * heightM * heightM).toFixed(1);
    const maxWeight = (24.9 * heightM * heightM).toFixed(1);
    return units === "metric"
      ? { min: minWeight, max: maxWeight, unit: "kg" }
      : { min: (minWeight * 2.20462).toFixed(1), max: (maxWeight * 2.20462).toFixed(1), unit: "lb" };
  };

  const calculateBMR = (weight, height, age, gender, bodyFat, units) => {
    const weightKg = units === "metric" ? parseFloat(weight) : parseFloat(weight) / 2.20462;
    const heightCm = units === "metric" ? parseFloat(height) : parseFloat(height) * 2.54;
    if (bodyFat && bodyFat > 0 && bodyFat < 100) {
      const leanMass = weightKg * (1 - bodyFat / 100);
      return (370 + 21.6 * leanMass).toFixed(0); // Katch-McArdle
    }
    return gender === "male"
      ? (10 * weightKg + 6.25 * heightCm - 5 * age + 5).toFixed(0) // Mifflin-St Jeor
      : (10 * weightKg + 6.25 * heightCm - 5 * age - 161).toFixed(0);
  };

  const calculateTDEE = (bmr, activityLevel) => {
    return (bmr * activityFactors[activityLevel]).toFixed(0);
  };

  const calculateCalorieGoal = (tdee, fitnessGoal) => {
    if (fitnessGoal === "weight-loss") return (tdee - 500).toFixed(0);
    if (fitnessGoal === "muscle-gain") return (tdee + 250).toFixed(0);
    return tdee;
  };

  const calculateMacronutrients = (calorieGoal, fitnessGoal, weight, units) => {
    const weightKg = units === "metric" ? parseFloat(weight) : parseFloat(weight) / 2.20462;
    const proteinGrams = (fitnessGoal === "muscle-gain" ? 2.0 * weightKg : 1.8 * weightKg).toFixed(0);
    const proteinCalories = proteinGrams * 4;
    const fatCalories = (calorieGoal * 0.25).toFixed(0);
    const fatGrams = (fatCalories / 9).toFixed(0);
    const carbCalories = calorieGoal - proteinCalories - fatCalories;
    const carbGrams = (carbCalories / 4).toFixed(0);
    return { protein: proteinGrams, carbs: carbGrams, fat: fatGrams };
  };

  const calculate = () => {
    setErrorMessage("");
    const {
      units,
      weight,
      height,
      age,
      gender,
      activityLevel,
      fitnessGoal,
      calorieIntake,
      exerciseFrequency,
      targetWeight,
      bodyFat,
      healthConditions,
    } = formData;

    if (
      [weight, height, age, calorieIntake, exerciseFrequency, targetWeight].some(
        (val) => isNaN(parseFloat(val)) && val !== ""
      ) ||
      (bodyFat && (bodyFat <= 0 || bodyFat >= 100))
    ) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }
    if (
      weight <= 0 ||
      height <= 0 ||
      age <= 0 ||
      calorieIntake < 0 ||
      exerciseFrequency < 0 ||
      exerciseFrequency > 7 ||
      targetWeight <= 0
    ) {
      setErrorMessage("Invalid input values (e.g., negative or zero).");
      return;
    }

    const bmi = calculateBMI(weight, height, units);
    const healthyWeight = calculateHealthyWeightRange(height, units);
    const bmr = calculateBMR(weight, height, age, gender, bodyFat, units);
    const tdee = calculateTDEE(bmr, activityLevel);
    const calorieGoal = calculateCalorieGoal(tdee, fitnessGoal);
    const macros = calculateMacronutrients(calorieGoal, fitnessGoal, weight, units);
    const calorieBalance = (calorieIntake - tdee).toFixed(0);
    const calorieBalanceStatus = calorieBalance > 0 ? "Surplus" : calorieBalance < 0 ? "Deficit" : "Balanced";
    const progressToTarget = (((weight - targetWeight) / (weight - healthyWeight.min)) * 100).toFixed(1);

    let recommendations = "";
    if (fitnessGoal === "weight-loss") {
      recommendations = `To reach ${targetWeight} ${
        units === "metric" ? "kg" : "lb"
      }, consume ${calorieGoal} kcal/day (500 kcal deficit) and exercise ${
        exerciseFrequency + 1
      } days/week. Include cardio and strength training.`;
    } else if (fitnessGoal === "muscle-gain") {
      recommendations = `To gain muscle, consume ${calorieGoal} kcal/day (250 kcal surplus) with ${
        macros.protein
      } g protein. Train ${exerciseFrequency + 1} days/week with strength exercises.`;
    } else {
      recommendations = `To maintain weight, consume ${calorieGoal} kcal/day. Exercise ${exerciseFrequency} days/week to stay healthy.`;
    }
    if (healthConditions.length > 0) {
      recommendations += ` Note: Conditions (${healthConditions.join(
        ", "
      )}) may affect TDEE or nutrition needs. Consult a doctor.`;
    }
    if (bmi >= 25) {
      recommendations += ` Warning: BMI ${bmi} indicates overweight/obese status. Focus on a balanced diet and consult a professional.`;
    }

    const sensitivity = [];
    for (let w = parseFloat(weight) * 0.9; w <= parseFloat(weight) * 1.1; w += parseFloat(weight) * 0.1) {
      const sBMR = calculateBMR(w, height, age, gender, bodyFat, units);
      const sTDEE = calculateTDEE(sBMR, activityLevel);
      sensitivity.push({ weight: w.toFixed(1), tdee: sTDEE });
    }

    const scenarioResults = scenarios
      .map((s, i) => {
        if (isNaN(parseFloat(s.weight))) return null;
        const sBMR = calculateBMR(s.weight, height, age, gender, bodyFat, units);
        const sTDEE = calculateTDEE(sBMR, s.activityLevel);
        const sCalorieGoal = calculateCalorieGoal(sTDEE, s.goal);
        return { name: `Scenario ${i + 1}`, tdee: sTDEE, calorieGoal: sCalorieGoal };
      })
      .filter(Boolean);

    setResults({
      bmi,
      healthyWeight: `${healthyWeight.min}–${healthyWeight.max} ${healthyWeight.unit}`,
      bmr: `${bmr} kcal`,
      tdee: `${tdee} kcal`,
      calorieGoal: `${calorieGoal} kcal`,
      protein: `${macros.protein} g`,
      carbs: `${macros.carbs} g`,
      fat: `${macros.fat} g`,
      calorieBalance: `${calorieBalance} kcal (${calorieBalanceStatus})`,
      progress: `${progressToTarget}%`,
      sensitivity,
      scenarios: scenarioResults,
      recommendations,
    });

    const newHistory = [
      ...healthHistory,
      { date: new Date().toLocaleString(), keyMetric: "TDEE", value: tdee },
      { date: new Date().toLocaleString(), keyMetric: "Weight", value: weight },
    ];
    setHealthHistory(newHistory);
    localStorage.setItem("healthHistory", JSON.stringify(newHistory));
    setShowResults(true);

    if (macroPieChartInstance.current) macroPieChartInstance.current.destroy();
    macroPieChartInstance.current = new Chart(macroPieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Protein", "Carbohydrates", "Fat"],
        datasets: [
          {
            data: [parseFloat(macros.protein), parseFloat(macros.carbs), parseFloat(macros.fat)],
            backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Macronutrient Distribution (grams)" },
        },
      },
    });

    if (trendLineChartInstance.current) trendLineChartInstance.current.destroy();
    trendLineChartInstance.current = new Chart(trendLineChartRef.current, {
      type: "line",
      data: {
        labels: newHistory.filter((h) => h.keyMetric === "TDEE").map((h) => h.date),
        datasets: [
          {
            label: "TDEE (kcal)",
            data: newHistory.filter((h) => h.keyMetric === "TDEE").map((h) => parseFloat(h.value)),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: false,
          },
          {
            label: "Weight",
            data: newHistory.filter((h) => h.keyMetric === "Weight").map((h) => parseFloat(h.value)),
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
        plugins: { title: { display: true, text: "TDEE & Weight Trend" } },
      },
    });

    if (tdeeBarChartInstance.current) tdeeBarChartInstance.current.destroy();
    tdeeBarChartInstance.current = new Chart(tdeeBarChartRef.current, {
      type: "bar",
      data: {
        labels: scenarioResults.map((s) => s.name),
        datasets: [
          { label: "TDEE (kcal)", data: scenarioResults.map((s) => s.tdee), backgroundColor: "#3b82f6" },
          {
            label: "Calorie Goal (kcal)",
            data: scenarioResults.map((s) => s.calorieGoal),
            backgroundColor: "#f59e0b",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { title: { display: true, text: "Calories (kcal)" }, min: 0 } },
        plugins: { title: { display: true, text: "Scenario Comparison" } },
      },
    });

    if (balanceGaugeChartInstance.current) balanceGaugeChartInstance.current.destroy();
    balanceGaugeChartInstance.current = new Chart(balanceGaugeChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Balance", "Remaining"],
        datasets: [
          {
            data: [Math.abs(parseFloat(calorieBalance)), 1000],
            backgroundColor: [
              calorieBalance > 0 ? "#10b981" : calorieBalance < 0 ? "#ef4444" : "#3b82f6",
              "#e5e7eb",
            ],
            circumference: 180,
            rotation: 270,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "80%",
        plugins: { title: { display: true, text: "Calorie Balance Status" }, legend: { display: false } },
      },
    });
  };

  const saveCalculation = () => {
    if (showResults && !errorMessage) {
      setSuccessMessage("Calculation saved to history!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } else {
      setErrorMessage("No valid calculation to save.");
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Key Metric", "Value"],
      ...healthHistory.map((h) => [h.date, h.keyMetric, h.value]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tdee_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced TDEE Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    healthHistory.forEach((h) => {
      doc.text(
        `Date: ${h.date}, ${h.keyMetric}: ${h.value} ${
          h.keyMetric === "TDEE" ? "kcal" : formData.units === "metric" ? "kg" : "lb"
        }`,
        10,
        y
      );
      y += 10;
    });
    doc.text(
      "Note: Visual charts (Pie, Line, Bar, Gauge) and recommendations are available in the web interface.",
      10,
      y
    );
    doc.text("Warning: Consult a dietitian for personalized nutrition plans.", 10, y + 10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 20);
    doc.save("tdee_results.pdf");
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Advanced TDEE Calculator</h1>
          </div>
          <div className="warning-message mb-4">
            <strong>Important:</strong> This calculator estimates Total Daily Energy Expenditure (TDEE) for
            nutrition planning. Consult a dietitian or doctor for personalized advice.
          </div>
          {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-sm mt-1">{successMessage}</div>}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal & Health Details</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter details to calculate your TDEE and plan nutrition.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Units",
                  name: "units",
                  type: "select",
                  options: ["metric", "imperial"],
                  tooltip: "Metric (kg, cm) or Imperial (lb, inch).",
                },
                {
                  label: "Weight",
                  name: "weight",
                  type: "number",
                  step: "0.1",
                  min: 0,
                  value: formData.weight,
                  tooltip: "Your body weight (kg or lb).",
                },
                {
                  label: "Height",
                  name: "height",
                  type: "number",
                  step: "0.1",
                  min: 0,
                  value: formData.height,
                  tooltip: "Your height (cm or inch).",
                },
                {
                  label: "Age",
                  name: "age",
                  type: "number",
                  step: "1",
                  min: 0,
                  value: formData.age,
                  tooltip: "Your age for BMR calculation.",
                },
                {
                  label: "Gender",
                  name: "gender",
                  type: "select",
                  options: ["male", "female"],
                  tooltip: "Affects BMR calculation.",
                },
                {
                  label: "Activity Level",
                  name: "activityLevel",
                  type: "select",
                  options: ["sedentary", "light", "moderate", "very", "extreme"],
                  tooltip: "Your daily activity level.",
                },
                {
                  label: "Fitness Goal",
                  name: "fitnessGoal",
                  type: "select",
                  options: ["weight-loss", "maintenance", "muscle-gain"],
                  tooltip: "Your primary fitness goal.",
                },
                {
                  label: "Daily Calorie Intake",
                  name: "calorieIntake",
                  type: "number",
                  step: "1",
                  min: 0,
                  value: formData.calorieIntake,
                  tooltip: "Calories consumed daily.",
                },
                {
                  label: "Exercise Frequency (Days/Week)",
                  name: "exerciseFrequency",
                  type: "number",
                  step: "1",
                  min: 0,
                  max: 7,
                  value: formData.exerciseFrequency,
                  tooltip: "Weekly workout days.",
                },
                {
                  label: "Target Weight",
                  name: "targetWeight",
                  type: "number",
                  step: "0.1",
                  min: 0,
                  value: formData.targetWeight,
                  tooltip: "Desired weight (kg or lb).",
                },
                {
                  label: "Body Fat % (Optional)",
                  name: "bodyFat",
                  type: "number",
                  step: "0.1",
                  min: 0,
                  max: 100,
                  value: formData.bodyFat,
                  tooltip: "For Katch-McArdle BMR formula.",
                },
                {
                  label: "Health Conditions",
                  name: "healthConditions",
                  type: "select",
                  multiple: true,
                  options: ["thyroid", "diabetes", "hypertension"],
                  tooltip: "Select conditions (optional).",
                  onChange: handleHealthConditionsChange,
                },
              ].map(({ label, name, type, options, step, min, max, value, tooltip, onChange, multiple }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {label}
                    {tooltip && (
                      <span className="tooltip ml-1">
                        ?<span className="tooltiptext">{tooltip}</span>
                      </span>
                    )}
                  </label>
                  {type === "select" ? (
                    <select
                      name={name}
                      value={multiple ? formData[name] : value}
                      onChange={onChange || handleInputChange}
                      multiple={multiple}
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === "metric"
                            ? "Metric"
                            : opt === "imperial"
                            ? "Imperial"
                            : opt.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={value}
                      onChange={handleInputChange}
                      step={step}
                      min={min}
                      max={max}
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Scenario Analysis</h2>
            {scenarios.map((s, i) => (
              <div key={i} className="scenario-section border border-gray-200 p-4 mb-4 rounded-lg">
                <h3 className="text-md font-medium text-gray-900 mb-2">Scenario {i + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Weight", name: "weight", type: "number", step: "0.1", min: 0, value: s.weight },
                    {
                      label: "Activity Level",
                      name: "activityLevel",
                      type: "select",
                      options: ["sedentary", "light", "moderate", "very", "extreme"],
                      value: s.activityLevel,
                    },
                    {
                      label: "Fitness Goal",
                      name: "goal",
                      type: "select",
                      options: ["weight-loss", "maintenance", "muscle-gain"],
                      value: s.goal,
                    },
                  ].map(({ label, name, type, step, min, value, options }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
                      {type === "select" ? (
                        <select
                          value={value}
                          onChange={(e) => handleScenarioChange(i, name, e.target.value)}
                          className="w-full p-3 border rounded-lg bg-white text-gray-900"
                        >
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={type}
                          value={value}
                          onChange={(e) => handleScenarioChange(i, name, e.target.value)}
                          step={step}
                          min={min}
                          className="w-full p-3 border rounded-lg bg-white text-gray-900"
                        />
                      )}
                    </div>
                  ))}
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
              Learn About TDEE & Nutrition
            </button>
          </div>
          <div className="controls-container flex gap-4 mb-8 flex-wrap">
            <button
              onClick={convertUnits}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Convert Units
            </button>
            <button
              onClick={calculate}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate
            </button>
            <button
              onClick={saveCalculation}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Save Calculation
            </button>
          </div>
          {showResults && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">TDEE & Nutrition Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "BMI", key: "bmi" },
                  { label: "Healthy Weight Range", key: "healthyWeight" },
                  { label: "BMR", key: "bmr" },
                  { label: "TDEE", key: "tdee" },
                  { label: "Calorie Goal", key: "calorieGoal" },
                  { label: "Protein", key: "protein" },
                  { label: "Carbohydrates", key: "carbs" },
                  { label: "Fat", key: "fat" },
                  { label: "Calorie Balance", key: "calorieBalance" },
                  { label: "Progress to Target Weight", key: "progress" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <h3 className="text-md font-medium text-gray-900">{label}</h3>
                    <p className="text-xl font-bold text-gray-800">{results[key]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Macronutrient Distribution</h3>
                <canvas ref={macroPieChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">TDEE</th>
                      <th className="p-2">Calorie Goal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarios.map((s) => (
                      <tr key={s.name}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.tdee} kcal</td>
                        <td className="p-2">{s.calorieGoal} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Sensitivity Analysis</h3>
                <p className="text-gray-600">
                  TDEE ranges from {results.sensitivity[0].tdee} kcal at {results.sensitivity[0].weight}{" "}
                  {formData.units === "metric" ? "kg" : "lb"} to{" "}
                  {results.sensitivity[results.sensitivity.length - 1].tdee} kcal at{" "}
                  {results.sensitivity[results.sensitivity.length - 1].weight}{" "}
                  {formData.units === "metric" ? "kg" : "lb"}.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">TDEE & Weight Trend</h3>
                <canvas ref={trendLineChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
                <canvas ref={tdeeBarChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Calorie Balance Status</h3>
                <canvas ref={balanceGaugeChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Recommendations</h3>
                <p className="text-gray-600">{results.recommendations}</p>
              </div>
              <div className="mt-6 history-table">
                <h3 className="text-md font-medium text-gray-900">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Key Metric</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthHistory.map((h, i) => (
                      <tr key={i}>
                        <td className="p-2">{h.date}</td>
                        <td className="p-2">{h.keyMetric}</td>
                        <td className="p-2">
                          {h.keyMetric === "TDEE"
                            ? h.value + " kcal"
                            : h.value + (formData.units === "metric" ? " kg" : " lb")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="controls-container flex gap-4 mt-4">
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
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-100 p-6 rounded-lg max-w-lg w-full">
                <span className="close text-2xl cursor-pointer" onClick={() => setShowModal(false)}>
                  ×
                </span>
                <h2 className="text-xl font-semibold mb-4">Understanding TDEE & Nutrition</h2>
                <p className="mb-4">
                  Total Daily Energy Expenditure (TDEE) is the total calories you burn daily, including basal
                  metabolic rate (BMR) and activity. It guides nutrition planning for weight management or
                  fitness goals.
                </p>
                <h3 className="text-md font-medium mb-2">Key Concepts</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <strong>BMR:</strong> Calories burned at rest.
                  </li>
                  <li>
                    <strong>TDEE:</strong> BMR × Activity Factor.
                  </li>
                  <li>
                    <strong>Macronutrients:</strong> Protein, carbs, and fats for energy and health.
                  </li>
                </ul>
                <h3 className="text-md font-medium mb-2">Nutrition Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Weight Loss: Consume 500–1000 kcal below TDEE.</li>
                  <li>Muscle Gain: Consume 250–500 kcal above TDEE with high protein.</li>
                  <li>Balance macros: 45–65% carbs, 20–35% fats, 10–35% protein.</li>
                  <li>Consult a dietitian for personalized plans.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Health Considerations</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Conditions like thyroid issues may affect TDEE.</li>
                  <li>Monitor calorie intake to avoid deficiencies.</li>
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
                      href="https://www.eatright.org"
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      Academy of Nutrition and Dietetics
                    </a>
                  </li>
                  <li>Local dietitians or nutritionists.</li>
                </ul>
              </div>
            </div>
          )}
          <style jsx>{`
            .warning-message {
              color: #f59e0b;
              font-size: 0.875rem;
              margin-top: 0.25rem;
            }
            .tooltip {
              position: relative;
              display: inline-block;
              cursor: pointer;
            }
            .tooltip .tooltiptext {
              visibility: hidden;
              width: 200px;
              background-color: #555;
              color: #fff;
              text-align: center;
              border-radius: 6px;
              padding: 5px;
              position: absolute;
              z-index: 1;
              bottom: 125%;
              left: 50%;
              margin-left: -100px;
              opacity: 0;
              transition: opacity 0.3s;
            }
            .tooltip:hover .tooltiptext {
              visibility: visible;
              opacity: 1;
            }
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
            .controls-container {
              display: flex;
              gap: 1rem;
              flex-wrap: wrap;
            }
            .scenario-section {
              border: 1px solid #e5e7eb;
              padding: 1rem;
              border-radius: 0.5rem;
            }
            .history-table {
              overflow-x: auto;
              max-height: 300px;
              overflow-y: auto;
            }
            .close {
              position: absolute;
              top: 10px;
              right: 15px;
              font-size: 20px;
              cursor: pointer;
            }
            @media (max-width: 640px) {
              .controls-container {
                flex-direction: column;
                align-items: stretch;
              }
              button {
                width: 100%;
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
