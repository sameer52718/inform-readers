"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function CarbCalculator() {
  const [units, setUnits] = useState("metric");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [fitnessGoal, setFitnessGoal] = useState("maintenance");
  const [trainingFrequency, setTrainingFrequency] = useState("4");
  const [dietaryPreference, setDietaryPreference] = useState("omnivore");
  const [calorieTarget, setCalorieTarget] = useState("2000");
  const [mealsPerDay, setMealsPerDay] = useState("4");
  const [bodyFat, setBodyFat] = useState("20");
  const [carbPercentage, setCarbPercentage] = useState("50");
  const [foodAllergies, setFoodAllergies] = useState([]);
  const [budgetPreference, setBudgetPreference] = useState("medium");
  const [scenarios, setScenarios] = useState([{ weight: "70", goal: "maintenance", activity: "sedentary" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState(null);
  const [carbHistory, setCarbHistory] = useState([]);
  const [foodSearch, setFoodSearch] = useState("");
  const macroPieChartRef = useRef(null);
  const carbLineChartRef = useRef(null);
  const sourceDonutChartRef = useRef(null);
  const metricsBarChartRef = useRef(null);
  const macroPieChartInstance = useRef(null);
  const carbLineChartInstance = useRef(null);
  const sourceDonutChartInstance = useRef(null);
  const metricsBarChartInstance = useRef(null);

  const foodDatabase = [
    {
      name: "Brown Rice",
      carbs: 23,
      type: "complex",
      cost: 0.2,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian", "paleo"],
      allergies: [],
    },
    {
      name: "Quinoa",
      carbs: 21,
      type: "complex",
      cost: 0.7,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian"],
      allergies: [],
    },
    {
      name: "Sweet Potato",
      carbs: 20,
      type: "complex",
      cost: 0.3,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian", "paleo"],
      allergies: [],
    },
    {
      name: "Oats",
      carbs: 27,
      type: "complex",
      cost: 0.2,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian"],
      allergies: ["gluten"],
    },
    {
      name: "Banana",
      carbs: 23,
      type: "simple",
      cost: 0.3,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian", "paleo"],
      allergies: [],
    },
    {
      name: "White Bread",
      carbs: 49,
      type: "simple",
      cost: 0.2,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian"],
      allergies: ["gluten"],
    },
    {
      name: "Lentils",
      carbs: 20,
      type: "complex",
      cost: 0.2,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian"],
      allergies: [],
    },
    {
      name: "Honey",
      carbs: 82,
      type: "simple",
      cost: 0.6,
      diet: ["omnivore", "vegetarian", "pescatarian", "paleo"],
      allergies: [],
    },
    {
      name: "Chickpeas",
      carbs: 27,
      type: "complex",
      cost: 0.3,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian"],
      allergies: [],
    },
    {
      name: "Whole Wheat Pasta",
      carbs: 30,
      type: "complex",
      cost: 0.4,
      diet: ["omnivore", "vegetarian", "vegan", "pescatarian"],
      allergies: ["gluten"],
    },
  ];

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("carbHistory") || "[]");
    setCarbHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (
      results &&
      macroPieChartRef.current &&
      carbLineChartRef.current &&
      sourceDonutChartRef.current &&
      metricsBarChartRef.current
    ) {
      updateCharts();
    }
  }, [results, scenarios, foodSearch]);

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

  const calculateCarbs = (calorieTarget, carbPercentage, fitnessGoal) => {
    const carbPercentages = {
      "weight-loss": 40,
      maintenance: 50,
      "muscle-gain": 55,
      endurance: 65,
      "low-carb": 10,
    };
    const targetCarbPercentage = carbPercentage || carbPercentages[fitnessGoal];
    const carbCalories = calorieTarget * (targetCarbPercentage / 100);
    const carbGrams = carbCalories / 4;
    return {
      grams: carbGrams.toFixed(1),
      calories: carbCalories.toFixed(0),
      percentage: targetCarbPercentage,
    };
  };

  const convertUnits = () => {
    setError("");
    const newUnits = units === "metric" ? "imperial" : "metric";
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!isNaN(w)) {
      setWeight(newUnits === "metric" ? (w / 2.20462).toFixed(1) : (w * 2.20462).toFixed(1));
    }
    if (!isNaN(h)) {
      setHeight(newUnits === "metric" ? (h / 0.393701).toFixed(1) : (h * 0.393701).toFixed(1));
    }
    setScenarios(
      scenarios.map((s) => ({
        ...s,
        weight: !isNaN(parseFloat(s.weight))
          ? newUnits === "metric"
            ? (parseFloat(s.weight) / 2.20462).toFixed(1)
            : (parseFloat(s.weight) * 2.20462).toFixed(1)
          : s.weight,
      }))
    );
    setUnits(newUnits);
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setError("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([...scenarios, { weight: "70", goal: "maintenance", activity: "sedentary" }]);
  };

  const updateScenario = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = { ...newScenarios[index], [field]: value };
    setScenarios(newScenarios);
  };

  const calculate = () => {
    setError("");
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const tf = parseInt(trainingFrequency);
    const ct = parseInt(calorieTarget);
    const mpd = parseInt(mealsPerDay);
    const bf = parseFloat(bodyFat);
    const cp = parseFloat(carbPercentage);

    if ([w, h, a, tf, ct, mpd, bf, cp].some((val) => isNaN(val) && val !== undefined)) {
      setError("Please provide valid inputs.");
      return;
    }
    if (
      w <= 0 ||
      h <= 0 ||
      a <= 0 ||
      tf < 0 ||
      tf > 7 ||
      ct <= 0 ||
      mpd < 1 ||
      mpd > 6 ||
      (bf && (bf < 0 || bf > 100)) ||
      cp < 0 ||
      cp > 100
    ) {
      setError("Invalid input values (e.g., negative or out-of-range).");
      return;
    }

    const bmi = calculateBMI(w, h, units);
    const bmr = calculateBMR(w, h, a, gender, units);
    const tdee = calculateTDEE(bmr, activityLevel);
    const carbs = calculateCarbs(ct, cp, fitnessGoal);
    const carbPerMeal = (carbs.grams / mpd).toFixed(1);
    const macroSplit = {
      carbs: carbs.percentage,
      protein: fitnessGoal === "low-carb" ? 30 : 25,
      fat: 100 - carbs.percentage - (fitnessGoal === "low-carb" ? 30 : 25),
    };
    const costEstimate = (
      carbs.grams *
      0.01 *
      (budgetPreference === "low" ? 0.5 : budgetPreference === "medium" ? 1 : 1.5)
    ).toFixed(2);

    const carbTypes = {
      complex: fitnessGoal === "endurance" ? 70 : 60,
      simple: fitnessGoal === "endurance" ? 20 : 30,
      fiber: 10,
    };
    const filteredFoods = foodDatabase.filter(
      (food) =>
        food.diet.includes(dietaryPreference) &&
        !food.allergies.some((allergy) => foodAllergies.includes(allergy)) &&
        (budgetPreference === "low"
          ? food.cost <= 0.3
          : budgetPreference === "medium"
          ? food.cost <= 0.5
          : true)
    );
    const mealPlan = Array.from({ length: mpd }, (_, i) => ({
      meal: `Meal ${i + 1}${fitnessGoal === "endurance" && i === 0 ? " (Pre-Workout)" : ""}`,
      carbs: carbPerMeal,
      foods: filteredFoods
        .slice(0, 2)
        .map((f) => f.name)
        .join(", "),
    }));

    const sensitivity = [];
    for (let c = ct * 0.9; c <= ct * 1.1; c += ct * 0.1) {
      const sCarbs = calculateCarbs(c, cp, fitnessGoal);
      sensitivity.push({ calories: c.toFixed(0), carbs: sCarbs.grams });
    }

    const scenarioResults = scenarios
      .map((s, i) => {
        const sWeight = parseFloat(s.weight);
        if (isNaN(sWeight)) return null;
        const sTDEE = calculateTDEE(calculateBMR(sWeight, h, a, gender, units), s.activity);
        const sCarbs = calculateCarbs(sTDEE, cp, s.goal);
        return { name: `Scenario ${i + 1}`, carbs: sCarbs.grams, calories: sCarbs.calories, tdee: sTDEE };
      })
      .filter((s) => s);

    const newHistory = [
      ...carbHistory,
      { date: new Date().toLocaleString(), keyMetric: "Daily Carbs", value: `${carbs.grams} g` },
    ];
    setCarbHistory(newHistory);
    localStorage.setItem("carbHistory", JSON.stringify(newHistory));

    setResults({
      carbs: `${carbs.grams} g`,
      carbCalories: `${carbs.calories} kcal`,
      bmi: `${bmi}`,
      bmr: `${bmr} kcal`,
      tdee: `${tdee} kcal`,
      carbPerMeal: `${carbPerMeal} g`,
      costEstimate: `$${costEstimate}/day`,
      filteredFoods,
      mealPlan,
      scenarioResults,
      sensitivity,
      carbTypes,
    });
  };

  const saveCalculation = () => {
    if (results && !error) {
      setSuccess("Calculation saved to history!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("No valid calculation to save.");
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Key Metric", "Value"],
      ...carbHistory.map((h) => [h.date, h.keyMetric, h.value]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "carb_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Carbohydrate Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    carbHistory.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text(
      "Note: Visual charts (Pie, Line, Donut, Bar) and meal plans are available in the web interface.",
      10,
      y
    );
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("carb_results.pdf");
  };

  const updateCharts = () => {
    if (macroPieChartInstance.current) macroPieChartInstance.current.destroy();
    macroPieChartInstance.current = new Chart(macroPieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Carbs", "Protein", "Fat"],
        datasets: [
          {
            data: [
              parseFloat(carbPercentage) || 50,
              fitnessGoal === "low-carb" ? 30 : 25,
              100 - (parseFloat(carbPercentage) || 50) - (fitnessGoal === "low-carb" ? 30 : 25),
            ],
            backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" }, title: { display: true, text: "Macronutrient Split" } },
      },
    });

    if (carbLineChartInstance.current) carbLineChartInstance.current.destroy();
    carbLineChartInstance.current = new Chart(carbLineChartRef.current, {
      type: "line",
      data: {
        labels: ["-10% Calories", "Current", "+10% Calories"],
        datasets: [
          {
            label: "Carb Needs (g)",
            data: [
              calculateCarbs(parseFloat(calorieTarget) * 0.9, parseFloat(carbPercentage), fitnessGoal).grams,
              results ? parseFloat(results.carbs) : 0,
              calculateCarbs(parseFloat(calorieTarget) * 1.1, parseFloat(carbPercentage), fitnessGoal).grams,
            ],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Calorie Change" } },
          y: { title: { display: true, text: "Carbs (g)" } },
        },
        plugins: { title: { display: true, text: "Carbs vs. Calories" } },
      },
    });

    if (sourceDonutChartInstance.current) sourceDonutChartInstance.current.destroy();
    sourceDonutChartInstance.current = new Chart(sourceDonutChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Complex", "Simple", "Fiber"],
        datasets: [
          {
            data: [results.carbTypes.complex, results.carbTypes.simple, results.carbTypes.fiber],
            backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" }, title: { display: true, text: "Carb Source Breakdown" } },
      },
    });

    if (metricsBarChartInstance.current) metricsBarChartInstance.current.destroy();
    metricsBarChartInstance.current = new Chart(metricsBarChartRef.current, {
      type: "bar",
      data: {
        labels: results.scenarioResults.map((s) => s.name),
        datasets: [
          {
            label: "Daily Carbs (g)",
            data: results.scenarioResults.map((s) => s.carbs),
            backgroundColor: "#3b82f6",
          },
          {
            label: "Calories from Carbs (kcal)",
            data: results.scenarioResults.map((s) => s.calories),
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

  const filteredFoods = foodDatabase.filter(
    (food) =>
      food.diet.includes(dietaryPreference) &&
      !food.allergies.some((allergy) => foodAllergies.includes(allergy)) &&
      (budgetPreference === "low"
        ? food.cost <= 0.3
        : budgetPreference === "medium"
        ? food.cost <= 0.5
        : true) &&
      food.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full">
          <h1 className="text-3xl font-bold text-red-700 mb-8">Advanced Carbohydrate Calculator</h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

          <h2 className="text-xl font-semibold text-red-700 mb-4">Personal & Fitness Details</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter details to calculate your daily carbohydrate needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Units <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Metric (kg, cm) or Imperial (lb, inch).
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
                Weight <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Your body weight (kg or lb).
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Height <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Your height (cm or inch).
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Age <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Your age for BMR calculation.
                </span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Gender <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Affects BMR calculation.
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
                Activity Level <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Your daily activity level.
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
                Fitness Goal <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Your primary fitness goal.
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
                <option value="endurance">Endurance</option>
                <option value="low-carb">Low-Carb</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Training Frequency (Days/Week) <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Weekly workout days.
                </span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="7"
                value={trainingFrequency}
                onChange={(e) => setTrainingFrequency(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Dietary Preference <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Your diet type.
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
                Daily Calorie Target <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Manual or TDEE-based calories.
                </span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Meals per Day <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Number of daily meals.
                </span>
              </label>
              <input
                type="number"
                step="1"
                min="1"
                max="6"
                value={mealsPerDay}
                onChange={(e) => setMealsPerDay(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Body Fat Percentage <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  For lean mass calculation (optional).
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Carb Percentage Target (%) <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Percentage of calories from carbs.
                </span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={carbPercentage}
                onChange={(e) => setCarbPercentage(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Food Allergies <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Select allergies to filter foods.
                </span>
              </label>
              <select
                multiple
                value={foodAllergies}
                onChange={(e) =>
                  setFoodAllergies(Array.from(e.target.selectedOptions).map((opt) => opt.value))
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="gluten">Gluten</option>
                <option value="nuts">Nuts</option>
                <option value="soy">Soy</option>
                <option value="dairy">Dairy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Budget Preference <span className="cursor-pointer text-red-500">?</span>
                <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                  Affects food recommendations.
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

          <h2 className="text-xl font-semibold text-red-700 mt-6 mb-4">Scenario Analysis</h2>
          {scenarios.map((s, i) => (
            <div key={i} className="border border-gray-200 p-4 rounded-lg mb-4">
              <h3 className="text-md font-medium text-red-700 mb-2">Scenario {i + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={s.weight}
                    onChange={(e) => updateScenario(i, "weight", e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Fitness Goal</label>
                  <select
                    value={s.goal}
                    onChange={(e) => updateScenario(i, "goal", e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="weight-loss">Weight Loss</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="low-carb">Low-Carb</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Activity Level</label>
                  <select
                    value={s.activity}
                    onChange={(e) => updateScenario(i, "activity", e.target.value)}
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
          <button onClick={addScenario} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4">
            Add Scenario
          </button>

          <div className="flex flex-wrap gap-4 mt-6">
            <button onClick={convertUnits} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Convert Units
            </button>
            <button onClick={calculate} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Calculate
            </button>
            <button onClick={saveCalculation} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Save Calculation
            </button>
          </div>

          {results && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-red-700 mb-4">Carbohydrate & Nutrition Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-md font-medium text-red-700">Daily Carbs</h3>
                  <p className="text-xl font-bold text-gray-800">{results.carbs}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-red-700">Carb Calories</h3>
                  <p className="text-xl font-bold text-gray-800">{results.carbCalories}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-red-700">BMI</h3>
                  <p className="text-xl font-bold text-gray-800">{results.bmi}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-red-700">BMR</h3>
                  <p className="text-xl font-bold text-gray-800">{results.bmr}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-red-700">TDEE</h3>
                  <p className="text-xl font-bold text-gray-800">{results.tdee}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-red-700">Carbs per Meal</h3>
                  <p className="text-xl font-bold text-gray-800">{results.carbPerMeal}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-red-700">Estimated Cost</h3>
                  <p className="text-xl font-bold text-gray-800">{results.costEstimate}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">Daily Carbs</th>
                      <th className="p-2">Calories from Carbs</th>
                      <th className="p-2">TDEE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarioResults.map((s) => (
                      <tr key={s.name}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.carbs} g</td>
                        <td className="p-2">{s.calories} kcal</td>
                        <td className="p-2">{s.tdee} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Sensitivity Analysis</h3>
                <p className="text-gray-600">
                  Carb needs range from {results.sensitivity[0].carbs} g at {results.sensitivity[0].calories}{" "}
                  kcal to {results.sensitivity[results.sensitivity.length - 1].carbs} g at{" "}
                  {results.sensitivity[results.sensitivity.length - 1].calories} kcal.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Macronutrient Split</h3>
                <canvas ref={macroPieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Carbs vs. Calories/Activity</h3>
                <canvas ref={carbLineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Carb Source Breakdown</h3>
                <canvas ref={sourceDonutChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Scenario Metrics Comparison</h3>
                <canvas ref={metricsBarChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 max-h-72 overflow-y-auto">
                <h3 className="text-md font-medium text-red-700">Meal Plan</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Meal</th>
                      <th className="p-2">Carbs (g)</th>
                      <th className="p-2">Suggested Foods</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.mealPlan.map((m) => (
                      <tr key={m.meal}>
                        <td className="p-2">{m.meal}</td>
                        <td className="p-2">{m.carbs} g</td>
                        <td className="p-2">{m.foods}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 max-h-72 overflow-y-auto">
                <h3 className="text-md font-medium text-red-700">Carbohydrate Food Database</h3>
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
                      <th className="p-2">Carbs (g/100g)</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Cost ($/100g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFoods.map((food) => (
                      <tr key={food.name}>
                        <td className="p-2">{food.name}</td>
                        <td className="p-2">{food.carbs} g</td>
                        <td className="p-2">{food.type}</td>
                        <td className="p-2">${food.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Key Metric</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carbHistory.map((h) => (
                      <tr key={h.date}>
                        <td className="p-2">{h.date}</td>
                        <td className="p-2">{h.keyMetric}</td>
                        <td className="p-2">{h.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <button onClick={exportCSV} className="bg-red-500 text-white px-6 py-3 rounded-lg">
                  Export CSV
                </button>
                <button onClick={exportPDF} className="bg-red-500 text-white px-6 py-3 rounded-lg">
                  Export PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
