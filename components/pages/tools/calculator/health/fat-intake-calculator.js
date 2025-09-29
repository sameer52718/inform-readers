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
    trainingFrequency: 4,
    dietaryPreference: "omnivore",
    calorieTarget: 2000,
    mealsPerDay: 4,
    bodyFat: 20,
    fatPercentage: 30,
    foodAllergies: [],
    budgetPreference: "low",
  });
  const [scenarios, setScenarios] = useState([
    { weight: 70, goal: "weight-loss", fitnessLevel: "sedentary" },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({});
  const [fatHistory, setFatHistory] = useState([]);
  const [foodSearch, setFoodSearch] = useState("");
  const macroPieChartRef = useRef(null);
  const fatLineChartRef = useRef(null);
  const sourceDonutChartRef = useRef(null);
  const metricsBarChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const lineChartInstance = useRef(null);
  const donutChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  const foodDatabase = [
    {
      name: "Olive Oil",
      fat: 100,
      type: "unsaturated",
      cost: 0.8,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian", "keto", "paleo"],
      allergies: [],
    },
    {
      name: "Avocado",
      fat: 15,
      type: "unsaturated",
      cost: 1.2,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian", "keto", "paleo"],
      allergies: [],
    },
    {
      name: "Butter",
      fat: 81,
      type: "saturated",
      cost: 0.6,
      diet: ["omnivore", "vegetarian", "keto", "paleo"],
      allergies: ["dairy"],
    },
    {
      name: "Salmon",
      fat: 13,
      type: "omega-3",
      cost: 2.0,
      diet: ["omnivore", "pescatarian", "keto", "paleo"],
      allergies: [],
    },
    {
      name: "Almonds",
      fat: 50,
      type: "unsaturated",
      cost: 1.5,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian", "keto", "paleo"],
      allergies: ["nuts"],
    },
    {
      name: "Coconut Oil",
      fat: 100,
      type: "saturated",
      cost: 0.9,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian", "keto", "paleo"],
      allergies: [],
    },
    {
      name: "Chia Seeds",
      fat: 31,
      type: "omega-3",
      cost: 1.0,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian", "keto", "paleo"],
      allergies: [],
    },
    {
      name: "Cheese",
      fat: 33,
      type: "saturated",
      cost: 0.7,
      diet: ["omnivore", "vegetarian", "keto"],
      allergies: ["dairy"],
    },
    {
      name: "Peanut Butter",
      fat: 50,
      type: "unsaturated",
      cost: 0.5,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian"],
      allergies: ["nuts"],
    },
    {
      name: "Flaxseeds",
      fat: 42,
      type: "omega-3",
      cost: 0.8,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian", "keto", "paleo"],
      allergies: [],
    },
  ];

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("fatHistory")) || [];
    setFatHistory(savedHistory);
    updateFoodTable();
  }, [formData.dietaryPreference, formData.foodAllergies, formData.budgetPreference, foodSearch]);

  const handleInputChange = (e) => {
    const { name, value, type, options } = e.target;
    if (name === "foodAllergies") {
      const selected = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === "number" ? parseFloat(value) || "" : value }));
    }
  };

  const convertUnits = () => {
    setErrorMessage("");
    const { units, weight, height } = formData;
    const newUnits = units === "metric" ? "imperial" : "metric";
    setFormData((prev) => ({
      ...prev,
      units: newUnits,
      weight: !isNaN(weight)
        ? newUnits === "metric"
          ? (weight / 2.20462).toFixed(1)
          : (weight * 2.20462).toFixed(1)
        : "",
      height: !isNaN(height)
        ? newUnits === "metric"
          ? (height / 0.393701).toFixed(1)
          : (height * 0.393701).toFixed(1)
        : "",
    }));
    setScenarios(
      scenarios.map((s) => ({
        ...s,
        weight: !isNaN(s.weight)
          ? newUnits === "metric"
            ? (s.weight / 2.20462).toFixed(1)
            : (s.weight * 2.20462).toFixed(1)
          : "",
      }))
    );
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setErrorMessage("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([...scenarios, { weight: 70, goal: "weight-loss", fitnessLevel: "sedentary" }]);
  };

  const updateScenario = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index][field] = field === "weight" ? parseFloat(value) || "" : value;
    setScenarios(newScenarios);
  };

  const calculateBMI = (weight, height, units) => {
    if (units === "metric") {
      return (weight / (height / 100) ** 2).toFixed(1);
    } else {
      return ((703 * weight) / height ** 2).toFixed(1);
    }
  };

  const calculateBMR = (weight, height, age, gender, units) => {
    const weightKg = units === "metric" ? weight : weight / 2.20462;
    const heightCm = units === "metric" ? height : height * 2.54;
    if (gender === "male") {
      return (10 * weightKg + 6.25 * heightCm - 5 * age + 5).toFixed(0);
    } else {
      return (10 * weightKg + 6.25 * heightCm - 5 * age - 161).toFixed(0);
    }
  };

  const calculateTDEE = (bmr, activityLevel) => {
    const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725, elite: 1.9 };
    return (bmr * factors[activityLevel]).toFixed(0);
  };

  const calculateFat = (calorieTarget, fatPercentage, fitnessGoal) => {
    const fatPercentages = {
      "weight-loss": 20,
      maintenance: 25,
      "muscle-gain": 30,
      ketogenic: 70,
      "heart-health": 20,
    };
    const targetFatPercentage = fatPercentage || fatPercentages[fitnessGoal];
    const fatCalories = calorieTarget * (targetFatPercentage / 100);
    const fatGrams = fatCalories / 9;
    return { grams: fatGrams.toFixed(1), calories: fatCalories.toFixed(0), percentage: targetFatPercentage };
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
      trainingFrequency,
      dietaryPreference,
      calorieTarget,
      mealsPerDay,
      bodyFat,
      fatPercentage,
      foodAllergies,
      budgetPreference,
    } = formData;
    if (
      [weight, height, age, trainingFrequency, calorieTarget, mealsPerDay, bodyFat, fatPercentage].some(
        (val) => isNaN(val) && val !== undefined
      )
    ) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }
    if (
      weight <= 0 ||
      height <= 0 ||
      age <= 0 ||
      trainingFrequency < 0 ||
      trainingFrequency > 7 ||
      calorieTarget <= 0 ||
      mealsPerDay < 1 ||
      mealsPerDay > 6 ||
      (bodyFat && (bodyFat < 0 || bodyFat > 100)) ||
      fatPercentage < 0 ||
      fatPercentage > 100
    ) {
      setErrorMessage("Invalid input values (e.g., negative or out-of-range).");
      return;
    }

    const bmi = calculateBMI(weight, height, units);
    const bmr = calculateBMR(weight, height, age, gender, units);
    const tdee = calculateTDEE(bmr, activityLevel);
    const fat = calculateFat(calorieTarget, fatPercentage, fitnessGoal);
    const fatPerMeal = (fat.grams / mealsPerDay).toFixed(1);
    const macroSplit = {
      fat: fat.percentage,
      protein: fitnessGoal === "ketogenic" ? 20 : 30,
      carbs: 100 - fat.percentage - (fitnessGoal === "ketogenic" ? 20 : 30),
    };
    const costEstimate = (
      fat.grams *
      0.02 *
      (budgetPreference === "low" ? 0.5 : budgetPreference === "medium" ? 1 : 1.5)
    ).toFixed(2);
    const fatTypes = {
      saturated: fitnessGoal === "ketogenic" ? 30 : 10,
      unsaturated: fitnessGoal === "heart-health" ? 70 : 60,
      omega3: fitnessGoal === "heart-health" ? 20 : 30,
    };

    const filteredFoods = foodDatabase.filter(
      (food) =>
        food.diet.includes(dietaryPreference) &&
        !food.allergies.some((allergy) => foodAllergies.includes(allergy)) &&
        (budgetPreference === "low"
          ? food.cost <= 0.7
          : budgetPreference === "medium"
          ? food.cost <= 1.0
          : true)
    );
    const mealPlan = Array.from({ length: mealsPerDay }, (_, i) => ({
      meal: `Meal ${i + 1}`,
      fat: fatPerMeal,
      foods: filteredFoods
        .slice(0, 2)
        .map((f) => f.name)
        .join(", "),
    }));

    const sensitivity = [];
    for (let c = calorieTarget * 0.9; c <= calorieTarget * 1.1; c += calorieTarget * 0.1) {
      const sFat = calculateFat(c, fatPercentage, fitnessGoal);
      sensitivity.push({ calories: c.toFixed(0), fat: sFat.grams });
    }

    const scenarioResults = scenarios.map((s, i) => {
      const sTDEE = calculateTDEE(calculateBMR(s.weight, height, age, gender, units), s.fitnessLevel);
      const sFat = calculateFat(sTDEE, fatPercentage, s.goal);
      return { name: `Scenario ${i + 1}`, fat: sFat.grams, calories: sFat.calories, tdee: sTDEE };
    });

    setResults({
      fat: `${fat.grams} g`,
      fatCalories: `${fat.calories} kcal`,
      bmi: `${bmi}`,
      bmr: `${bmr} kcal`,
      tdee: `${tdee} kcal`,
      fatPerMeal: `${fatPerMeal} g`,
      costEstimate: `$${costEstimate}/day`,
      sensitivity: `Fat needs range from ${sensitivity[0].fat} g at ${sensitivity[0].calories} kcal to ${
        sensitivity[sensitivity.length - 1].fat
      } g at ${sensitivity[sensitivity.length - 1].calories} kcal.`,
      filteredFoods,
      mealPlan,
      scenarios: scenarioResults,
      fatTypes,
      macroSplit,
    });
    setShowResults(true);

    const newHistory = [
      ...fatHistory,
      { date: new Date().toLocaleString(), keyMetric: "Daily Fat", value: fat.grams },
    ];
    setFatHistory(newHistory);
    localStorage.setItem("fatHistory", JSON.stringify(newHistory));

    updateCharts({ ...results, fat: fat.grams, macroSplit }, units, scenarioResults, filteredFoods, fatTypes);
  };

  const updateFoodTable = () => {
    const filteredFoods = foodDatabase.filter(
      (food) =>
        food.diet.includes(formData.dietaryPreference) &&
        !food.allergies.some((allergy) => formData.foodAllergies.includes(allergy)) &&
        (formData.budgetPreference === "low"
          ? food.cost <= 0.7
          : formData.budgetPreference === "medium"
          ? food.cost <= 1.0
          : true) &&
        food.name.toLowerCase().includes(foodSearch.toLowerCase())
    );
    return filteredFoods;
  };

  const updateCharts = (results, units, scenarios, filteredFoods, fatTypes) => {
    if (pieChartInstance.current) pieChartInstance.current.destroy();
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (donutChartInstance.current) donutChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();

    pieChartInstance.current = new Chart(macroPieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Fat", "Protein", "Carbs"],
        datasets: [
          {
            data: [results.macroSplit.fat, results.macroSplit.protein, results.macroSplit.carbs],
            backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" }, title: { display: true, text: "Macronutrient Split" } },
      },
    });

    lineChartInstance.current = new Chart(fatLineChartRef.current, {
      type: "line",
      data: {
        labels: ["-10% Calories", "Current", "+10% Calories"],
        datasets: [
          {
            label: "Fat Needs (g)",
            data: [
              calculateFat(formData.calorieTarget * 0.9, formData.fatPercentage, formData.fitnessGoal).grams,
              parseFloat(results.fat),
              calculateFat(formData.calorieTarget * 1.1, formData.fatPercentage, formData.fitnessGoal).grams,
            ],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Calorie Change" } },
          y: { title: { display: true, text: "Fat (g)" } },
        },
        plugins: { title: { display: true, text: "Fat vs. Calories" } },
      },
    });

    donutChartInstance.current = new Chart(sourceDonutChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Saturated", "Unsaturated", "Omega-3"],
        datasets: [
          {
            data: [fatTypes.saturated, fatTypes.unsaturated, fatTypes.omega3],
            backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" }, title: { display: true, text: "Fat Source Breakdown" } },
      },
    });

    barChartInstance.current = new Chart(metricsBarChartRef.current, {
      type: "bar",
      data: {
        labels: scenarios.map((s) => s.name),
        datasets: [
          { label: "Daily Fat (g)", data: scenarios.map((s) => s.fat), backgroundColor: "#ef4444" },
          {
            label: "Calories from Fat (kcal)",
            data: scenarios.map((s) => s.calories),
            backgroundColor: "#10b981",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { title: { display: true, text: "Amount" } } },
        plugins: { title: { display: true, text: "Scenario Metrics Comparison" } },
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
      ...fatHistory.map((h) => [h.date, h.keyMetric, h.value]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fat_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Fat Intake Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    fatHistory.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text(
      "Note: Visual charts (Pie, Line, Donut, Bar) and meal plans are available in the web interface.",
      10,
      y
    );
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("fat_results.pdf");
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Advanced Fat Intake Calculator</h1>
          </div>
          {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-sm mt-1">{successMessage}</div>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal & Fitness Details</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter details to calculate your daily fat intake needs.
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
                step: 0.1,
                min: 0,
                tooltip: "Your body weight (kg or lb).",
              },
              {
                label: "Height",
                name: "height",
                type: "number",
                step: 0.1,
                min: 0,
                tooltip: "Your height (cm or inch).",
              },
              {
                label: "Age",
                name: "age",
                type: "number",
                step: 1,
                min: 0,
                tooltip: "Your age for BMR calculation.",
              },
              {
                label: "Gender",
                name: "gender",
                type: "select",
                options: ["male", "female", "other"],
                tooltip: "Affects BMR calculation.",
              },
              {
                label: "Activity Level",
                name: "activityLevel",
                type: "select",
                options: ["sedentary", "light", "moderate", "very", "elite"],
                tooltip: "Your daily activity level.",
              },
              {
                label: "Fitness Goal",
                name: "fitnessGoal",
                type: "select",
                options: ["weight-loss", "maintenance", "muscle-gain", "ketogenic", "heart-health"],
                tooltip: "Your primary fitness goal.",
              },
              {
                label: "Training Frequency (Days/Week)",
                name: "trainingFrequency",
                type: "number",
                step: 1,
                min: 0,
                max: 7,
                tooltip: "Weekly workout days.",
              },
              {
                label: "Dietary Preference",
                name: "dietaryPreference",
                type: "select",
                options: ["omnivore", "vegetarian", "vegan", "pescatarian", "keto", "paleo"],
                tooltip: "Your diet type.",
              },
              {
                label: "Daily Calorie Target",
                name: "calorieTarget",
                type: "number",
                step: 1,
                min: 0,
                tooltip: "Manual or TDEE-based calories.",
              },
              {
                label: "Meals per Day",
                name: "mealsPerDay",
                type: "number",
                step: 1,
                min: 1,
                max: 6,
                tooltip: "Number of daily meals.",
              },
              {
                label: "Body Fat Percentage",
                name: "bodyFat",
                type: "number",
                step: 0.1,
                min: 0,
                max: 100,
                tooltip: "For lean mass calculation (optional).",
              },
              {
                label: "Fat Percentage Target (%)",
                name: "fatPercentage",
                type: "number",
                step: 1,
                min: 0,
                max: 100,
                tooltip: "Percentage of calories from fat.",
              },
              {
                label: "Food Allergies",
                name: "foodAllergies",
                type: "select",
                multiple: true,
                options: ["dairy", "nuts", "soy", "gluten"],
                tooltip: "Select allergies to filter foods.",
              },
              {
                label: "Budget Preference",
                name: "budgetPreference",
                type: "select",
                options: ["low", "medium", "high"],
                tooltip: "Affects food recommendations.",
              },
            ].map(({ label, name, type, options, step, min, max, multiple, tooltip }) => (
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
                    value={multiple ? undefined : formData[name]}
                    onChange={handleInputChange}
                    multiple={multiple}
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
                    name={name}
                    value={formData[name]}
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
          <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Scenario Analysis</h2>
          {scenarios.map((scenario, index) => (
            <div key={index} className="border border-gray-200 p-4 mb-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-900 mb-2">Scenario {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Weight", name: "weight", type: "number", step: 0.1, min: 0 },
                  {
                    label: "Fitness Goal",
                    name: "goal",
                    type: "select",
                    options: ["weight-loss", "maintenance", "muscle-gain", "ketogenic", "heart-health"],
                  },
                  {
                    label: "Activity Level",
                    name: "fitnessLevel",
                    type: "select",
                    options: ["sedentary", "light", "moderate", "very", "elite"],
                  },
                ].map(({ label, name, type, options, step, min }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
                    {type === "select" ? (
                      <select
                        value={scenario[name]}
                        onChange={(e) => updateScenario(index, name, e.target.value)}
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
                        value={scenario[name]}
                        onChange={(e) => updateScenario(index, name, e.target.value)}
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
          <div className="flex gap-4 mt-6 flex-wrap">
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
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Fat Intake & Nutrition Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Daily Fat", key: "fat" },
                  { label: "Fat Calories", key: "fatCalories" },
                  { label: "BMI", key: "bmi" },
                  { label: "BMR", key: "bmr" },
                  { label: "TDEE", key: "tdee" },
                  { label: "Fat per Meal", key: "fatPerMeal" },
                  { label: "Estimated Cost", key: "costEstimate" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <h3 className="text-md font-medium text-gray-900">{label}</h3>
                    <p className="text-xl font-bold text-gray-800">{results[key]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">Daily Fat</th>
                      <th className="p-2">Calories from Fat</th>
                      <th className="p-2">TDEE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarios?.map((s) => (
                      <tr key={s.name}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.fat} g</td>
                        <td className="p-2">{s.calories} kcal</td>
                        <td className="p-2">{s.tdee} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Sensitivity Analysis</h3>
                <p className="text-gray-600">{results.sensitivity}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Macronutrient Split</h3>
                <canvas ref={macroPieChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Fat vs. Calories/Activity</h3>
                <canvas ref={fatLineChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Fat Source Breakdown</h3>
                <canvas ref={sourceDonutChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Metrics Comparison</h3>
                <canvas ref={metricsBarChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6 overflow-x-auto max-h-80 overflow-y-auto">
                <h3 className="text-md font-medium text-gray-900">Meal Plan</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Meal</th>
                      <th className="p-2">Fat (g)</th>
                      <th className="p-2">Suggested Foods</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.mealPlan?.map((m) => (
                      <tr key={m.meal}>
                        <td className="p-2">{m.meal}</td>
                        <td className="p-2">{m.fat} g</td>
                        <td className="p-2">{m.foods}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 overflow-x-auto max-h-80 overflow-y-auto">
                <h3 className="text-md font-medium text-gray-900">Fat Food Database</h3>
                <input
                  type="text"
                  placeholder="Search foods..."
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900 mb-4"
                />
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Food</th>
                      <th className="p-2">Fat (g/100g)</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Cost ($/100g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updateFoodTable().map((food) => (
                      <tr key={food.name}>
                        <td className="p-2">{food.name}</td>
                        <td className="p-2">{food.fat} g</td>
                        <td className="p-2">{food.type}</td>
                        <td className="p-2">${food.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
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
                    {fatHistory.map((h, i) => (
                      <tr key={i}>
                        <td className="p-2">{h.date}</td>
                        <td className="p-2">{h.keyMetric}</td>
                        <td className="p-2">{h.value}</td>
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
        </div>
        <style jsx>{`
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
          @media (max-width: 640px) {
            .flex-wrap {
              flex-direction: column;
            }
            button {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </>
  );
}
