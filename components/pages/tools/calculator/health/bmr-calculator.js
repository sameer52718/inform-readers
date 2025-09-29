"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [formData, setFormData] = useState({
    gender: "female",
    age: 30,
    unitSystem: "imperial",
    weight: 150,
    height: "",
    heightFeet: 5,
    heightInches: 6,
    activityLevel: "1.55",
    formula: "mifflin",
    calorieGoal: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({
    bmr: "",
    tdee: "",
    adjustedCalories: "",
    macros: "",
    mealPlan: "",
    calculationDetails: "",
  });
  const [bmrHistory, setBmrHistory] = useState([]);
  const macroPieChartRef = useRef(null);
  const formulaBarChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("bmrHistory")) || [];
    setBmrHistory(savedHistory);
    updateInputFields();
  }, [formData.unitSystem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "calorieGoal") {
      updateCalorieGoalText(value);
    }
  };

  const updateCalorieGoalText = (value) => {
    const goal = parseInt(value);
    return goal === 0
      ? "Maintain Weight (0 kcal/day)"
      : goal < 0
      ? `Lose Weight (${goal} kcal/day)`
      : `Gain Weight (+${goal} kcal/day)`;
  };

  const updateInputFields = () => {
    setErrorMessage("");
    const { unitSystem, weight, heightFeet, heightInches } = formData;
    if (unitSystem === "metric") {
      setFormData((prev) => ({
        ...prev,
        weight: prev.weight ? (prev.weight * 0.453592).toFixed(4) : 68.0388,
        height: prev.heightFeet
          ? ((prev.heightFeet * 12 + parseFloat(prev.heightInches)) * 2.54).toFixed(1)
          : 167.6,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        weight: prev.weight ? (prev.weight / 0.453592).toFixed(2) : 150,
        heightFeet: prev.height ? Math.floor(prev.height / 2.54 / 12) : 5,
        heightInches: prev.height ? ((prev.height / 2.54) % 12).toFixed(1) : 6,
      }));
    }
  };

  const convertUnits = () => {
    setErrorMessage("");
    const { unitSystem, weight, height, heightFeet, heightInches } = formData;
    if (unitSystem === "imperial") {
      if (isNaN(weight) || isNaN(heightFeet) || isNaN(heightInches)) {
        setErrorMessage("Please provide valid weight and height.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        unitSystem: "metric",
        weight: (weight * 0.453592).toFixed(4),
        height: ((heightFeet * 12 + parseFloat(heightInches)) * 2.54).toFixed(1),
      }));
    } else {
      if (isNaN(weight) || isNaN(height)) {
        setErrorMessage("Please provide valid weight and height.");
        return;
      }
      const heightIn = height / 2.54;
      setFormData((prev) => ({
        ...prev,
        unitSystem: "imperial",
        weight: (weight / 0.453592).toFixed(2),
        heightFeet: Math.floor(heightIn / 12),
        heightInches: (heightIn % 12).toFixed(1),
      }));
    }
  };

  const calculateBMRValue = (weightKg, heightCm, age, gender, formula) => {
    let bmr;
    if (formula === "mifflin") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === "male" ? 5 : -161);
    } else {
      bmr =
        gender === "male"
          ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
          : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
    }
    return Math.round(bmr);
  };

  const calculateTDEE = (bmr, activityLevel) => Math.round(bmr * activityLevel);

  const calculateMacros = (tdee, goal) => {
    const adjustedCalories = tdee + goal;
    const proteinGrams = Math.round((adjustedCalories * 0.3) / 4);
    const carbGrams = Math.round((adjustedCalories * 0.4) / 4);
    const fatGrams = Math.round((adjustedCalories * 0.3) / 9);
    return { protein: proteinGrams, carbs: carbGrams, fats: fatGrams, calories: adjustedCalories };
  };

  const generateMealPlan = (calories) => {
    const breakfast = Math.round(calories * 0.25);
    const lunch = Math.round(calories * 0.3);
    const dinner = Math.round(calories * 0.3);
    const snacks = Math.round(calories * 0.15);
    return `Breakfast: ${breakfast} kcal, Lunch: ${lunch} kcal, Dinner: ${dinner} kcal, Snacks: ${snacks} kcal`;
  };

  const calculateBMR = () => {
    setErrorMessage("");
    const {
      gender,
      age,
      unitSystem,
      weight,
      height,
      heightFeet,
      heightInches,
      activityLevel,
      formula,
      calorieGoal,
    } = formData;
    let weightKg, heightCm, heightDisplay;

    if (unitSystem === "metric") {
      weightKg = parseFloat(weight);
      heightCm = parseFloat(height);
      heightDisplay = `${heightCm} cm`;
      if (isNaN(weightKg) || isNaN(heightCm) || weightKg <= 0 || heightCm <= 0) {
        setErrorMessage("Please provide valid weight and height.");
        return;
      }
      if (weightKg < 1 || weightKg > 617 || heightCm < 61 || heightCm > 274) {
        setErrorMessage("Please enter realistic values: Weight (1–617 kg), Height (61–274 cm).");
        return;
      }
    } else {
      weightKg = parseFloat(weight) * 0.453592;
      heightCm = (parseFloat(heightFeet) * 12 + parseFloat(heightInches)) * 2.54;
      heightDisplay = `${heightFeet} ft ${heightInches} in`;
      if (isNaN(weightKg) || isNaN(heightFeet) || isNaN(heightInches) || weightKg <= 0 || heightCm <= 0) {
        setErrorMessage("Please provide valid weight and height.");
        return;
      }
      const heightIn = heightFeet * 12 + parseFloat(heightInches);
      if (
        weightKg < 2 ||
        weightKg > 1360 ||
        heightIn < 24 ||
        heightIn > 108 ||
        heightInches < 0 ||
        heightInches >= 12
      ) {
        setErrorMessage("Please enter realistic values: Weight (2–1360 lb), Height (24–108 in, 0–11.9 in).");
        return;
      }
    }
    if (isNaN(age) || age < 18 || age > 100) {
      setErrorMessage("Please enter a valid age (18–100 years).");
      return;
    }

    const bmr = calculateBMRValue(weightKg, heightCm, age, gender, formula);
    if (bmr < 500 || bmr > 4000) {
      setErrorMessage("Calculated BMR is out of range. Please check your inputs.");
      return;
    }
    const tdee = calculateTDEE(bmr, parseFloat(activityLevel));
    const macros = calculateMacros(tdee, parseInt(calorieGoal));
    const mealPlan = generateMealPlan(macros.calories);

    const calcDetails =
      formula === "mifflin"
        ? `Mifflin-St Jeor: (10 × ${weightKg.toFixed(2)} kg) + (6.25 × ${heightCm.toFixed(
            1
          )} cm) − (5 × ${age}) + ${gender === "male" ? "5" : "−161"} = ${bmr} kcal/day`
        : `Harris-Benedict (${gender}): ${
            gender === "male" ? "88.362" : "447.593"
          } + (13.397 × ${weightKg.toFixed(2)} kg) + (4.799 × ${heightCm.toFixed(
            1
          )} cm) − (5.677 × ${age}) = ${bmr} kcal/day`;

    setResults({
      bmr: `${bmr} kcal/day`,
      tdee: `${tdee} kcal/day`,
      adjustedCalories: `${macros.calories} kcal/day (${
        calorieGoal === 0 ? "Maintain" : calorieGoal < 0 ? "Lose" : "Gain"
      })`,
      macros: `Protein: ${macros.protein}g, Carbohydrates: ${macros.carbs}g, Fats: ${macros.fats}g`,
      mealPlan,
      calculationDetails: `${calcDetails}; TDEE: ${bmr} × ${activityLevel} = ${tdee} kcal/day; Adjusted: ${tdee} + (${calorieGoal}) = ${macros.calories} kcal/day`,
    });
    setShowResults(true);

    const measurement = {
      date: new Date().toLocaleString(),
      gender,
      bmr,
      tdee,
      weight: `${weight} ${unitSystem === "metric" ? "kg" : "lb"}`,
      height: heightDisplay,
      goal: parseInt(calorieGoal),
      unitSystem,
    };
    const newHistory = [...bmrHistory, measurement];
    setBmrHistory(newHistory);
    localStorage.setItem("bmrHistory", JSON.stringify(newHistory));

    updateCharts(macros, weightKg, heightCm, age, gender);
  };

  const updateCharts = (macros, weightKg, heightCm, age, gender) => {
    if (pieChartInstance.current) pieChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();

    pieChartInstance.current = new Chart(macroPieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Protein", "Carbohydrates", "Fats"],
        datasets: [
          {
            data: [macros.protein * 4, macros.carbs * 4, macros.fats * 9],
            backgroundColor: ["#ef4444", "#3b82f6", "#f59e0b"],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Macronutrient Distribution (kcal)" },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} kcal`,
            },
          },
        },
      },
    });

    const mifflinBMR = calculateBMRValue(weightKg, heightCm, age, gender, "mifflin");
    const harrisBMR = calculateBMRValue(weightKg, heightCm, age, gender, "harris");
    barChartInstance.current = new Chart(formulaBarChartRef.current, {
      type: "bar",
      data: {
        labels: ["Mifflin-St Jeor", "Harris-Benedict"],
        datasets: [
          {
            label: "BMR (kcal/day)",
            data: [mifflinBMR, harrisBMR],
            backgroundColor: ["#ef4444", "#10b981"],
            borderColor: ["#b91c1c", "#065f46"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: false, title: { display: true, text: "Calories" } } },
        plugins: { legend: { display: false }, title: { display: true, text: "BMR by Formula" } },
      },
    });
  };

  const saveCalculation = () => {
    if (showResults && !errorMessage) {
      setSuccessMessage("Measurement saved to history!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } else {
      setErrorMessage("Cannot save invalid measurement.");
    }
  };

  const loadHistory = () => {
    if (bmrHistory.length === 0) {
      setErrorMessage("No saved measurements found.");
      return;
    }
    setShowResults(true);
  };

  const exportResults = () => {
    const { bmr, tdee, adjustedCalories, macros, mealPlan, calculationDetails } = results;
    const { gender, age, unitSystem, formula, activityLevel, weight, height, heightFeet, heightInches } =
      formData;
    const activityText = {
      1.2: "Sedentary (little or no exercise)",
      1.375: "Lightly Active (light exercise 1-3 days/week)",
      1.55: "Moderately Active (moderate exercise 3-5 days/week)",
      1.725: "Very Active (hard exercise 6-7 days/week)",
      1.9: "Extremely Active (very hard exercise, physical job)",
    }[activityLevel];
    const heightDisplay = unitSystem === "metric" ? `${height} cm` : `${heightFeet} ft ${heightInches} in`;

    const exportContent = `
Advanced BMR Calculator Results
==============================
Gender: ${gender}
Age: ${age}
Formula: ${formula === "mifflin" ? "Mifflin-St Jeor" : "Harris-Benedict"}
Activity Level: ${activityText}

Results:
- BMR: ${bmr}
- TDEE: ${tdee}
- Adjusted Calories: ${adjustedCalories}
- Macronutrients: ${macros}
- Meal Plan: ${mealPlan}

Measurement Details:
- Weight: ${weight} ${unitSystem === "metric" ? "kg" : "lb"}
- Height: ${heightDisplay}

Calculation Details:
${calculationDetails}

Measurement History:
${bmrHistory
  .map(
    (h) =>
      `Date: ${h.date}, Gender: ${h.gender}, BMR: ${h.bmr}, TDEE: ${h.tdee}, Weight: ${h.weight}, Height: ${
        h.height
      }, Goal: ${h.goal === 0 ? "Maintain" : h.goal < 0 ? `Lose (${h.goal})` : `Gain (+${h.goal})`}`
  )
  .join("\n")}
==============================
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bmr_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-5xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Advanced BMR Calculator</h1>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Enter Your Details</h2>
            <p className="text-sm text-gray-600 mb-4">
              Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) with
              personalized macronutrient and meal planning.
            </p>
            {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
            {successMessage && <div className="text-green-500 text-sm mt-1">{successMessage}</div>}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Gender",
                  name: "gender",
                  type: "select",
                  options: ["female", "male"],
                  tooltip: "Gender affects BMR due to differences in muscle mass and hormones.",
                },
                {
                  label: "Age (years)",
                  name: "age",
                  type: "number",
                  min: 18,
                  max: 100,
                  tooltip: "Age impacts metabolism; older adults have lower BMR.",
                },
                {
                  label: "Unit System",
                  name: "unitSystem",
                  type: "select",
                  options: ["metric", "imperial"],
                  tooltip: "Choose metric (kg, cm) or imperial (lb, ft/in).",
                  onChange: updateInputFields,
                },
                {
                  label: `Weight (${formData.unitSystem === "metric" ? "kg" : "lb"})`,
                  name: "weight",
                  type: "number",
                  step: formData.unitSystem === "metric" ? 0.0001 : 0.01,
                  id: "weight-input",
                  tooltip: "Your body weight.",
                },
                ...(formData.unitSystem === "metric"
                  ? [
                      {
                        label: "Height (cm)",
                        name: "height",
                        type: "number",
                        step: 0.1,
                        id: "height-input",
                        tooltip: "Your height in centimeters.",
                      },
                    ]
                  : [
                      {
                        label: "Height",
                        id: "height-imperial-input",
                        type: "group",
                        fields: [
                          {
                            label: "Height (ft)",
                            name: "heightFeet",
                            type: "number",
                            tooltip: "Your height in feet.",
                          },
                          {
                            label: "Height (in)",
                            name: "heightInches",
                            type: "number",
                            step: 0.1,
                            tooltip: "Your height in inches.",
                          },
                        ],
                      },
                    ]),
                {
                  label: "Activity Level",
                  name: "activityLevel",
                  type: "select",
                  options: [
                    { value: "1.2", text: "Sedentary (little or no exercise)" },
                    { value: "1.375", text: "Lightly Active (light exercise 1-3 days/week)" },
                    { value: "1.55", text: "Moderately Active (moderate exercise 3-5 days/week)" },
                    { value: "1.725", text: "Very Active (hard exercise 6-7 days/week)" },
                    { value: "1.9", text: "Extremely Active (very hard exercise, physical job)" },
                  ],
                  tooltip: "Activity level determines TDEE by multiplying BMR.",
                },
                {
                  label: "Formula",
                  name: "formula",
                  type: "select",
                  options: ["mifflin", "harris"],
                  tooltip: "Mifflin-St Jeor is more accurate; Harris-Benedict is traditional.",
                },
                {
                  label: "Goal",
                  name: "calorieGoal",
                  type: "range",
                  min: -1000,
                  max: 1000,
                  step: 50,
                  tooltip: "Adjust calorie intake for weight maintenance, loss, or gain.",
                },
              ].map(({ label, name, type, options, min, max, step, id, tooltip, onChange, fields }) => (
                <div key={name || id} id={id} className={type === "group" ? "grid grid-cols-2 gap-2" : ""}>
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
                      value={formData[name]}
                      onChange={onChange || handleInputChange}
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    >
                      {options.map((opt) => (
                        <option
                          key={typeof opt === "object" ? opt.value : opt}
                          value={typeof opt === "object" ? opt.value : opt}
                        >
                          {typeof opt === "object"
                            ? opt.text
                            : opt === "mifflin"
                            ? "Mifflin-St Jeor"
                            : opt === "harris"
                            ? "Harris-Benedict"
                            : opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : type === "range" ? (
                    <>
                      <input
                        type="range"
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        min={min}
                        max={max}
                        step={step}
                        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-sm text-gray-600 mt-1">{updateCalorieGoalText(formData[name])}</p>
                    </>
                  ) : type === "group" ? (
                    fields.map(
                      ({
                        label: subLabel,
                        name: subName,
                        type: subType,
                        step: subStep,
                        tooltip: subTooltip,
                      }) => (
                        <div key={subName}>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {subLabel}
                            {subTooltip && (
                              <span className="tooltip ml-1">
                                ?<span className="tooltiptext">{subTooltip}</span>
                              </span>
                            )}
                          </label>
                          <input
                            type={subType}
                            name={subName}
                            value={formData[subName]}
                            onChange={handleInputChange}
                            step={subStep}
                            className="w-full p-3 border rounded-lg bg-white text-gray-900"
                          />
                        </div>
                      )
                    )
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      min={min}
                      max={max}
                      step={step}
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={convertUnits}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Convert Units
            </button>
          </div>
          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={calculateBMR}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate BMR
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
          </div>
          {showResults && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "BMR", value: results.bmr },
                  { label: "TDEE", value: results.tdee },
                  { label: "Adjusted Calories", value: results.adjustedCalories },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <h3 className="text-lg font-medium text-gray-900">{label}</h3>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Macronutrient Breakdown</h3>
                <p className="text-gray-600">{results.macros}</p>
                <canvas ref={macroPieChartRef} className="max-h-80 mt-4"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Meal Planner</h3>
                <p className="text-gray-600">{results.mealPlan}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Formula Comparison</h3>
                <canvas ref={formulaBarChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Calculation Details</h3>
                <p className="text-gray-600">{results.calculationDetails}</p>
              </div>
              <div className="mt-6 overflow-x-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Measurement History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Gender</th>
                      <th className="p-2">BMR</th>
                      <th className="p-2">TDEE</th>
                      <th className="p-2">Weight</th>
                      <th className="p-2">Height</th>
                      <th className="p-2">Goal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bmrHistory.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2">{row.date}</td>
                        <td className="p-2">{row.gender}</td>
                        <td className="p-2">{row.bmr}</td>
                        <td className="p-2">{row.tdee}</td>
                        <td className="p-2">{row.weight}</td>
                        <td className="p-2">{row.height}</td>
                        <td className="p-2">
                          {row.goal === 0
                            ? "Maintain"
                            : row.goal < 0
                            ? `Lose (${row.goal})`
                            : `Gain (+${row.goal})`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
