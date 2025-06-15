"use client";

import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

const foodDatabase = [
  {
    name: "Chicken Breast",
    protein: 31,
    cost: 0.8,
    category: "animal",
    diet: ["omnivore", "keto", "paleo"],
    allergies: [],
  },
  {
    name: "Salmon",
    protein: 25,
    cost: 2.0,
    category: "animal",
    diet: ["omnivore", "pescatarian", "keto", "paleo"],
    allergies: [],
  },
  {
    name: "Eggs",
    protein: 13,
    cost: 0.4,
    category: "animal",
    diet: ["omnivore", "keto", "paleo"],
    allergies: ["dairy"],
  },
  {
    name: "Tofu",
    protein: 8,
    cost: 0.5,
    category: "plant",
    diet: ["vegetarian", "vegan", "pescatarian"],
    allergies: ["soy"],
  },
  {
    name: "Lentils",
    protein: 9,
    cost: 0.2,
    category: "plant",
    diet: ["vegetarian", "vegan", "pescatarian"],
    allergies: [],
  },
  {
    name: "Greek Yogurt",
    protein: 10,
    cost: 0.6,
    category: "animal",
    diet: ["omnivore", "vegetarian"],
    allergies: ["dairy"],
  },
  {
    name: "Almonds",
    protein: 7,
    cost: 1.5,
    category: "plant",
    diet: ["vegetarian", "vegan", "keto", "paleo"],
    allergies: ["nuts"],
  },
  {
    name: "Quinoa",
    protein: 14,
    cost: 0.7,
    category: "plant",
    diet: ["vegetarian", "vegan", "pescatarian"],
    allergies: [],
  },
  {
    name: "Whey Protein",
    protein: 80,
    cost: 1.2,
    category: "animal",
    diet: ["omnivore", "vegetarian"],
    allergies: ["dairy"],
  },
  {
    name: "Chickpeas",
    protein: 9,
    cost: 0.3,
    category: "plant",
    diet: ["vegetarian", "vegan", "pescatarian"],
    allergies: [],
  },
];

export default function Home() {
  const [units, setUnits] = useState("metric");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [fitnessGoal, setFitnessGoal] = useState("weight-loss");
  const [trainingFrequency, setTrainingFrequency] = useState(4);
  const [dietaryPreference, setDietaryPreference] = useState("omnivore");
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [mealsPerDay, setMealsPerDay] = useState(4);
  const [bodyFat, setBodyFat] = useState(20);
  const [proteinMultiplier, setProteinMultiplier] = useState(1.6);
  const [foodAllergies, setFoodAllergies] = useState([]);
  const [budgetPreference, setBudgetPreference] = useState("low");
  const [scenarios, setScenarios] = useState([
    { id: 1, weight: 70, goal: "weight-loss", activity: "sedentary" },
  ]);
  const [scenarioCount, setScenarioCount] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState(null);
  const [proteinHistory, setProteinHistory] = useState([]);
  const [foodSearch, setFoodSearch] = useState("");

  const macroPieChartRef = useRef(null);
  const proteinLineChartRef = useRef(null);
  const sourceDonutChartRef = useRef(null);
  const metricsBarChartRef = useRef(null);
  const chartInstances = useRef({});

  useEffect(() => {
    setProteinHistory(JSON.parse(localStorage.getItem("proteinHistory")) || []);
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
    setScenarios(
      scenarios.map((s) => ({
        ...s,
        weight: !isNaN(s.weight)
          ? newUnits === "metric"
            ? (s.weight / 2.20462).toFixed(1)
            : (s.weight * 2.20462).toFixed(1)
          : s.weight,
      }))
    );
  };

  const addScenario = () => {
    if (scenarioCount >= 3) {
      setErrorMessage("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarioCount(scenarioCount + 1);
    setScenarios([
      ...scenarios,
      { id: scenarioCount + 1, weight: 70, goal: "weight-loss", activity: "sedentary" },
    ]);
  };

  const updateScenario = (id, field, value) => {
    setScenarios(scenarios.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
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

  const calculateProtein = (weight, activityLevel, fitnessGoal, bodyFat, proteinMultiplier, units) => {
    const multipliers = {
      "weight-loss": { sedentary: 1.2, light: 1.4, moderate: 1.6, very: 1.8, elite: 2.0 },
      maintenance: { sedentary: 0.8, light: 1.0, moderate: 1.2, very: 1.4, elite: 1.6 },
      "muscle-gain": { sedentary: 1.6, light: 1.8, moderate: 2.0, very: 2.2, elite: 2.4 },
      athletic: { sedentary: 1.4, light: 1.6, moderate: 1.8, very: 2.0, elite: 2.2 },
    };
    const multiplier = proteinMultiplier || multipliers[fitnessGoal][activityLevel];
    let protein;
    if (bodyFat && bodyFat > 0 && bodyFat < 100) {
      const leanMass =
        units === "metric" ? weight * (1 - bodyFat / 100) : (weight * (1 - bodyFat / 100)) / 2.20462;
      protein = leanMass * multiplier;
    } else {
      const weightKg = units === "metric" ? weight : weight / 2.20462;
      protein = weightKg * multiplier;
    }
    return protein.toFixed(1);
  };

  const calculate = () => {
    setErrorMessage("");
    if (
      [weight, height, age, trainingFrequency, calorieTarget, mealsPerDay, bodyFat, proteinMultiplier].some(
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
      proteinMultiplier < 0
    ) {
      setErrorMessage("Invalid input values (e.g., negative or out-of-range).");
      return;
    }

    const bmi = calculateBMI(weight, height, units);
    const bmr = calculateBMR(weight, height, age, gender, units);
    const tdee = calculateTDEE(bmr, activityLevel);
    const protein = calculateProtein(weight, activityLevel, fitnessGoal, bodyFat, proteinMultiplier, units);
    const proteinCalories = (protein * 4).toFixed(0);
    const proteinPerMeal = (protein / mealsPerDay).toFixed(1);
    const costEstimate = (
      protein *
      0.01 *
      (budgetPreference === "low" ? 0.5 : budgetPreference === "medium" ? 1 : 1.5)
    ).toFixed(2);

    const filteredFoods = foodDatabase.filter(
      (food) =>
        food.diet.includes(dietaryPreference) &&
        !food.allergies.some((allergy) => foodAllergies.includes(allergy)) &&
        (budgetPreference === "low"
          ? food.cost <= 0.5
          : budgetPreference === "medium"
          ? food.cost <= 1
          : true)
    );
    const mealPlan = Array.from({ length: mealsPerDay }, (_, i) => ({
      meal: `Meal ${i + 1}`,
      protein: proteinPerMeal,
      foods: filteredFoods
        .slice(0, 2)
        .map((f) => f.name)
        .join(", "),
    }));

    const sensitivity = [];
    for (let w = weight * 0.9; w <= weight * 1.1; w += weight * 0.1) {
      const sProtein = calculateProtein(w, activityLevel, fitnessGoal, bodyFat, proteinMultiplier, units);
      sensitivity.push({ weight: w.toFixed(1), protein: sProtein });
    }

    const scenarioResults = scenarios
      .map((s, index) => {
        if (!isNaN(s.weight)) {
          const sProtein = calculateProtein(s.weight, s.activity, s.goal, bodyFat, proteinMultiplier, units);
          const sCalories = (sProtein * 4).toFixed(0);
          const sTDEE = calculateTDEE(calculateBMR(s.weight, height, age, gender, units), s.activity);
          return { name: `Scenario ${index + 1}`, protein: sProtein, calories: sCalories, tdee: sTDEE };
        }
        return null;
      })
      .filter((s) => s);

    setResults({
      protein: `${protein} g`,
      proteinCalories: `${proteinCalories} kcal`,
      bmi: `${bmi}`,
      bmr: `${bmr} kcal`,
      tdee: `${tdee} kcal`,
      proteinPerMeal: `${proteinPerMeal} g`,
      costEstimate: `$${costEstimate}/day`,
      filteredFoods,
      mealPlan,
      scenarios: scenarioResults,
      sensitivity,
    });

    const newHistory = [
      ...proteinHistory,
      { date: new Date().toLocaleString(), keyMetric: "Daily Protein", value: `${protein} g` },
    ];
    setProteinHistory(newHistory);
    localStorage.setItem("proteinHistory", JSON.stringify(newHistory));
  };

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
      ...proteinHistory.map((h) => [h.date, h.keyMetric, h.value]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "protein_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Protein Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    proteinHistory.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text(
      "Note: Visual charts (Pie, Line, Donut, Bar) and meal plans are available in the web interface.",
      10,
      y
    );
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("protein_results.pdf");
  };

  useEffect(() => {
    if (results) {
      if (chartInstances.current.macroPieChart) chartInstances.current.macroPieChart.destroy();
      chartInstances.current.macroPieChart = new Chart(macroPieChartRef.current, {
        type: "pie",
        data: {
          labels: ["Protein", "Carbs", "Fats"],
          datasets: [{ data: [40, 30, 30], backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"] }],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Macronutrient Split" } },
        },
      });

      if (chartInstances.current.proteinLineChart) chartInstances.current.proteinLineChart.destroy();
      chartInstances.current.proteinLineChart = new Chart(proteinLineChartRef.current, {
        type: "line",
        data: {
          labels: ["-10% Weight", "Current", "+10% Weight"],
          datasets: [
            {
              label: `Protein Needs (g)`,
              data: [
                calculateProtein(weight * 0.9, activityLevel, fitnessGoal, bodyFat, proteinMultiplier, units),
                parseFloat(results.protein),
                calculateProtein(weight * 1.1, activityLevel, fitnessGoal, bodyFat, proteinMultiplier, units),
              ],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Weight Change" } },
            y: { title: { display: true, text: "Protein (g)" } },
          },
          plugins: { title: { display: true, text: "Protein vs. Weight" } },
        },
      });

      if (chartInstances.current.sourceDonutChart) chartInstances.current.sourceDonutChart.destroy();
      const animalCount = results.filteredFoods.filter((f) => f.category === "animal").length;
      const plantCount = results.filteredFoods.filter((f) => f.category === "plant").length;
      chartInstances.current.sourceDonutChart = new Chart(sourceDonutChartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Animal-Based", "Plant-Based"],
          datasets: [{ data: [animalCount, plantCount], backgroundColor: ["#3b82f6", "#f59e0b"] }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Protein Source Breakdown" },
          },
        },
      });

      if (chartInstances.current.metricsBarChart) chartInstances.current.metricsBarChart.destroy();
      chartInstances.current.metricsBarChart = new Chart(metricsBarChartRef.current, {
        type: "bar",
        data: {
          labels: results.scenarios.map((s) => s.name),
          datasets: [
            {
              label: "Daily Protein (g)",
              data: results.scenarios.map((s) => s.protein),
              backgroundColor: "#3b82f6",
            },
            {
              label: "Calories from Protein (kcal)",
              data: results.scenarios.map((s) => s.calories),
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
    }
  }, [results, units, weight, activityLevel, fitnessGoal, bodyFat, proteinMultiplier]);

  const filteredFoods = foodDatabase
    .filter(
      (food) =>
        food.diet.includes(dietaryPreference) &&
        !food.allergies.some((allergy) => foodAllergies.includes(allergy)) &&
        (budgetPreference === "low"
          ? food.cost <= 0.5
          : budgetPreference === "medium"
          ? food.cost <= 1
          : true)
    )
    .filter((food) => food.name.toLowerCase().includes(foodSearch.toLowerCase()));

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Protein Calculator</h1>
        </div>

        {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 text-sm mb-4">{successMessage}</div>}

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal & Fitness Details</h2>
        <p className="text-sm text-gray-600 mb-4">Enter details to calculate your daily protein needs.</p>
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
                  Your body weight (kg or lb).
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
                  Your age for BMR calculation.
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
                  Affects BMR calculation.
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
              <option value="other">Other</option>
            </select>
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
              <option value="elite">Elite Athlete</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Fitness Goal
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Your primary fitness goal.
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
              <option value="muscle-gain">Muscle Gain</option>
              <option value="athletic">Athletic Performance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Training Frequency (Days/Week)
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
              value={trainingFrequency}
              onChange={(e) => setTrainingFrequency(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Dietary Preference
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Your diet type.
                </span>
              </span>
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="omnivore">Omnivore</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Daily Calorie Target
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Manual or TDEE-based calories.
                </span>
              </span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Meals per Day
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Number of daily meals.
                </span>
              </span>
            </label>
            <input
              type="number"
              step="1"
              min="1"
              max="6"
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Body Fat Percentage
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  For lean mass calculation (optional).
                </span>
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={bodyFat}
              onChange={(e) => setBodyFat(parseFloat(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Protein Multiplier
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Grams per kg or lb (optional).
                </span>
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={proteinMultiplier}
              onChange={(e) => setProteinMultiplier(parseFloat(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Food Allergies
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Select allergies to filter foods.
                </span>
              </span>
            </label>
            <select
              multiple
              value={foodAllergies}
              onChange={(e) => setFoodAllergies(Array.from(e.target.selectedOptions).map((opt) => opt.value))}
              className="w-full p-3 border rounded-lg"
            >
              <option value="dairy">Dairy</option>
              <option value="nuts">Nuts</option>
              <option value="soy">Soy</option>
              <option value="gluten">Gluten</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Budget Preference
              <span className="relative inline-block cursor-pointer ml-1">
                ?
                <span className="absolute hidden w-48 bg-gray-800 text-white text-center rounded-lg p-2 bottom-full left-1/2 -ml-24">
                  Affects food recommendations.
                </span>
              </span>
            </label>
            <select
              value={budgetPreference}
              onChange={(e) => setBudgetPreference(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Scenario Analysis</h2>
        <div>
          {scenarios.map((s) => (
            <div key={s.id} className="border border-gray-200 p-4 mb-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-900 mb-2">Scenario {s.id}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={s.weight}
                    onChange={(e) => updateScenario(s.id, "weight", parseFloat(e.target.value))}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Fitness Goal</label>
                  <select
                    value={s.goal}
                    onChange={(e) => updateScenario(s.id, "goal", e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="weight-loss">Weight Loss</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="athletic">Athletic Performance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Activity Level</label>
                  <select
                    value={s.activity}
                    onChange={(e) => updateScenario(s.id, "activity", e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="very">Very Active</option>
                    <option value="elite">Elite Athlete</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
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
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Protein & Nutrition Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900">Daily Protein</h3>
                <p className="text-xl font-bold text-gray-800">{results.protein}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">Protein Calories</h3>
                <p className="text-xl font-bold text-gray-800">{results.proteinCalories}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">BMI</h3>
                <p className="text-xl font-bold text-gray-800">{results.bmi}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">BMR</h3>
                <p className="text-xl font-bold text-gray-800">{results.bmr}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">TDEE</h3>
                <p className="text-xl font-bold text-gray-800">{results.tdee}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">Protein per Meal</h3>
                <p className="text-xl font-bold text-gray-800">{results.proteinPerMeal}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900">Estimated Cost</h3>
                <p className="text-xl font-bold text-gray-800">{results.costEstimate}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
              <table className="w-full text-sm text-gray-600">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Scenario</th>
                    <th className="p-2">Daily Protein</th>
                    <th className="p-2">Calories from Protein</th>
                    <th className="p-2">TDEE</th>
                  </tr>
                </thead>
                <tbody>
                  {results.scenarios.map((s) => (
                    <tr key={s.name}>
                      <td className="p-2">{s.name}</td>
                      <td className="p-2">{s.protein} g</td>
                      <td className="p-2">{s.calories} kcal</td>
                      <td className="p-2">{s.tdee} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Sensitivity Analysis</h3>
              <p className="text-gray-600">
                Protein needs range from {results.sensitivity[0].protein} g at {results.sensitivity[0].weight}{" "}
                {units === "metric" ? "kg" : "lb"} to{" "}
                {results.sensitivity[results.sensitivity.length - 1].protein} g at{" "}
                {results.sensitivity[results.sensitivity.length - 1].weight}{" "}
                {units === "metric" ? "kg" : "lb"}.
              </p>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Macronutrient Split</h3>
              <canvas ref={macroPieChartRef} className="max-h-80"></canvas>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Protein vs. Weight/Activity</h3>
              <canvas ref={proteinLineChartRef} className="max-h-80"></canvas>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Protein Source Breakdown</h3>
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
                    <th className="p-2">Protein (g)</th>
                    <th className="p-2">Suggested Foods</th>
                  </tr>
                </thead>
                <tbody>
                  {results.mealPlan.map((m, i) => (
                    <tr key={i}>
                      <td className="p-2">{m.meal}</td>
                      <td className="p-2">{m.protein} g</td>
                      <td className="p-2">{m.foods}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 overflow-x-auto max-h-80 overflow-y-auto">
              <h3 className="text-md font-medium text-gray-900">Protein Food Database</h3>
              <input
                type="text"
                placeholder="Search foods..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
              />
              <table className="w-full text-sm text-gray-600">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Food</th>
                    <th className="p-2">Protein (g/100g)</th>
                    <th className="p-2">Cost ($/100g)</th>
                    <th className="p-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFoods.map((food, i) => (
                    <tr key={i}>
                      <td className="p-2">{food.name}</td>
                      <td className="p-2">{food.protein} g</td>
                      <td className="p-2">${food.cost}</td>
                      <td className="p-2">{food.category}</td>
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
                  {proteinHistory.map((h, i) => (
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
