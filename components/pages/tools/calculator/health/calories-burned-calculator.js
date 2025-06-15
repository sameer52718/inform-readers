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
    activityType: "4.3",
    customMet: 4.0,
    duration: 60,
    intensity: "moderate",
    distance: 0,
    activityLevel: "sedentary",
    fitnessGoal: "weight-loss",
    calorieIntake: 2000,
    targetCalories: 500,
    fitnessLevel: "beginner",
    healthConditions: [],
  });
  const [scenarios, setScenarios] = useState([{ activity: "4.3", duration: 60, intensity: "moderate" }]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({});
  const [calorieHistory, setCalorieHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const gaugeChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const gaugeChartInstance = useRef(null);

  const activityMETs = {
    4.3: "Walking (3.5 mph)",
    9.8: "Running (6 mph)",
    "8.0": "Cycling (12–14 mph)",
    5.8: "Swimming (moderate)",
    "3.0": "Yoga",
    "7.0": "Weightlifting (moderate)",
    "6.0": "Hiking",
  };

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("calorieHistory")) || [];
    setCalorieHistory(savedHistory);
    toggleCustomMET();
  }, [formData.activityType]);

  const handleInputChange = (e) => {
    const { name, value, type, options } = e.target;
    if (name === "healthConditions") {
      const selected = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === "number" ? parseFloat(value) || "" : value }));
    }
  };

  const toggleCustomMET = () => {
    return formData.activityType === "custom";
  };

  const convertUnits = () => {
    setErrorMessage("");
    const { units, weight, height, distance } = formData;
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
      distance: !isNaN(distance)
        ? newUnits === "metric"
          ? (distance / 0.621371).toFixed(1)
          : (distance * 0.621371).toFixed(1)
        : "",
    }));
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setErrorMessage("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([...scenarios, { activity: "4.3", duration: 60, intensity: "moderate" }]);
  };

  const updateScenario = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index][field] = field === "duration" ? parseFloat(value) || "" : value;
    setScenarios(newScenarios);
  };

  const calculateBMR = (weight, height, age, gender, units) => {
    const weightKg = units === "metric" ? weight : weight / 2.20462;
    const heightCm = units === "metric" ? height : height * 2.54;
    return gender === "male"
      ? (10 * weightKg + 6.25 * heightCm - 5 * age + 5).toFixed(0)
      : (10 * weightKg + 6.25 * heightCm - 5 * age - 161).toFixed(0);
  };

  const calculateTDEE = (bmr, activityLevel) => {
    const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 };
    return (bmr * factors[activityLevel]).toFixed(0);
  };

  const calculateCaloriesBurned = (weight, met, duration, intensity, fitnessLevel, units) => {
    const weightKg = units === "metric" ? weight : weight / 2.20462;
    const intensityFactors = { low: 0.8, moderate: 1.0, high: 1.2 };
    const fitnessFactors = { beginner: 0.9, intermediate: 1.0, advanced: 1.1 };
    const adjustedMET = met * intensityFactors[intensity] * fitnessFactors[fitnessLevel];
    return (adjustedMET * weightKg * (duration / 60)).toFixed(0);
  };

  const calculate = () => {
    setErrorMessage("");
    const {
      units,
      weight,
      height,
      age,
      gender,
      activityType,
      customMet,
      duration,
      intensity,
      activityLevel,
      fitnessGoal,
      calorieIntake,
      targetCalories,
      fitnessLevel,
      healthConditions,
    } = formData;
    if ([weight, height, age, duration, calorieIntake, targetCalories].some((val) => isNaN(val))) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }
    if (activityType === "custom" && isNaN(customMet)) {
      setErrorMessage("Please provide a valid custom MET value.");
      return;
    }
    if (
      weight <= 0 ||
      height <= 0 ||
      age <= 0 ||
      duration <= 0 ||
      calorieIntake < 0 ||
      targetCalories < 0 ||
      (activityType === "custom" && customMet <= 0)
    ) {
      setErrorMessage("Invalid input values (e.g., negative or zero).");
      return;
    }

    const met = activityType === "custom" ? customMet : parseFloat(activityType);
    const caloriesBurned = calculateCaloriesBurned(weight, met, duration, intensity, fitnessLevel, units);
    const bmr = calculateBMR(weight, height, age, gender, units);
    const tdee = calculateTDEE(bmr, activityLevel);
    const totalCaloriesBurned = parseInt(tdee) + parseInt(caloriesBurned);
    const calorieBalance = calorieIntake - totalCaloriesBurned;
    const calorieBalanceStatus = calorieBalance > 0 ? "Surplus" : calorieBalance < 0 ? "Deficit" : "Balanced";
    const progressPercent = Math.min((caloriesBurned / targetCalories) * 100, 100).toFixed(1);

    let recommendations = "";
    if (fitnessGoal === "weight-loss") {
      recommendations = `Aim for a calorie deficit of 500–1000 kcal/day. Your current ${calorieBalanceStatus} (${calorieBalance} kcal) supports weight loss. Continue ${duration} min of ${
        activityMETs[met] || "custom activity"
      } ${intensity} intensity.`;
    } else if (fitnessGoal === "muscle-gain") {
      recommendations = `Aim for a calorie surplus of 250–500 kcal/day. Your current ${calorieBalanceStatus} (${calorieBalance} kcal) may need adjustment. Include strength training 3–5 days/week.`;
    } else {
      recommendations = `Maintain a balanced calorie intake. Your current ${calorieBalanceStatus} (${calorieBalance} kcal) is suitable. Perform ${duration} min of ${
        activityMETs[met] || "custom activity"
      } ${intensity} intensity regularly.`;
    }
    if (healthConditions.length > 0) {
      recommendations += ` Note: Conditions (${healthConditions.join(
        ", "
      )}) may require exercise modifications. Consult a doctor.`;
    }
    if (caloriesBurned > 1000 || duration > 120) {
      recommendations += ` Warning: High calorie burn (${caloriesBurned} kcal) or long duration (${duration} min) may lead to overtraining. Ensure adequate rest and nutrition.`;
    }

    const sensitivity = [];
    for (let w = weight * 0.9; w <= weight * 1.1; w += weight * 0.1) {
      sensitivity.push({
        weight: w.toFixed(1),
        calories: calculateCaloriesBurned(w, met, duration, intensity, fitnessLevel, units),
      });
    }

    const scenarioResults = scenarios.map((s, i) => ({
      name: `Scenario ${i + 1}`,
      activity: activityMETs[s.activity],
      calories: calculateCaloriesBurned(
        weight,
        parseFloat(s.activity),
        s.duration,
        s.intensity,
        fitnessLevel,
        units
      ),
    }));

    setResults({
      caloriesBurned: `${caloriesBurned} kcal`,
      bmr: `${bmr} kcal`,
      tdee: `${tdee} kcal`,
      totalCaloriesBurned: `${totalCaloriesBurned} kcal`,
      calorieBalance: `${calorieBalance} kcal (${calorieBalanceStatus})`,
      progress: `${progressPercent}%`,
      sensitivity: `Calories burned range from ${sensitivity[0].calories} kcal at ${sensitivity[0].weight} ${
        units === "metric" ? "kg" : "lb"
      } to ${sensitivity[sensitivity.length - 1].calories} kcal at ${
        sensitivity[sensitivity.length - 1].weight
      } ${units === "metric" ? "kg" : "lb"}.`,
      recommendations,
      scenarios: scenarioResults,
    });
    setShowResults(true);

    const newHistory = [
      ...calorieHistory,
      { date: new Date().toLocaleString(), keyMetric: "Calories Burned", value: caloriesBurned },
    ];
    setCalorieHistory(newHistory);
    localStorage.setItem("calorieHistory", JSON.stringify(newHistory));

    updateCharts({ ...results, progress: progressPercent }, scenarioResults);
  };

  const updateCharts = (results, scenarios) => {
    if (pieChartInstance.current) pieChartInstance.current.destroy();
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (gaugeChartInstance.current) gaugeChartInstance.current.destroy();

    pieChartInstance.current = new Chart(pieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Activity Calories", "TDEE"],
        datasets: [
          {
            data: [parseFloat(results.caloriesBurned), parseFloat(results.tdee)],
            backgroundColor: ["#ef4444", "#f59e0b"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" }, title: { display: true, text: "Calorie Distribution" } },
      },
    });

    lineChartInstance.current = new Chart(lineChartRef.current, {
      type: "line",
      data: {
        labels: calorieHistory.map((h) => h.date),
        datasets: [
          {
            label: "Calories Burned",
            data: calorieHistory.map((h) => parseFloat(h.value)),
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Date" } },
          y: { title: { display: true, text: "Calories (kcal)" }, min: 0 },
        },
        plugins: { title: { display: true, text: "Calories Burned Trend" } },
      },
    });

    barChartInstance.current = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels: scenarios.map((s) => s.name),
        datasets: [
          {
            label: "Calories Burned",
            data: scenarios.map((s) => parseFloat(s.calories)),
            backgroundColor: "#ef4444",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { title: { display: true, text: "Calories (kcal)" }, min: 0 } },
        plugins: { title: { display: true, text: "Scenario Comparison" } },
      },
    });

    gaugeChartInstance.current = new Chart(gaugeChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Progress", "Remaining"],
        datasets: [
          {
            data: [parseFloat(results.progress), 100 - parseFloat(results.progress)],
            backgroundColor: [parseFloat(results.progress) >= 100 ? "#10b981" : "#ef4444", "#e5e7eb"],
            circumference: 180,
            rotation: 270,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "80%",
        plugins: { title: { display: true, text: "Calorie Burn Progress" }, legend: { display: false } },
      },
    });
  };

  const saveCalculation = () => {
    if (showResults && !errorMessage) {
      setSuccessMessage("Calculation saved to activity log!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } else {
      setErrorMessage("No valid calculation to save.");
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Key Metric", "Value"],
      ...calorieHistory.map((h) => [h.date, h.keyMetric, h.value]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calorie_burned_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Calories Burned Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Activity Log:", 10, 20);
    let y = 30;
    calorieHistory.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value} kcal`, 10, y);
      y += 10;
    });
    doc.text(
      "Note: Visual charts (Pie, Line, Bar, Gauge) and recommendations are available in the web interface.",
      10,
      y
    );
    doc.text("Warning: Ensure adequate nutrition and rest to avoid overtraining.", 10, y + 10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 20);
    doc.save("calorie_burned_results.pdf");
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Advanced Calories Burned Calculator</h1>
          </div>
          <div className="text-yellow-500 text-sm mb-4">
            <strong>Important:</strong> This calculator estimates calories burned during activities. For
            accurate fitness planning, consult a fitness professional or dietitian.
          </div>
          {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-sm mt-1">{successMessage}</div>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal & Activity Details</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter details to calculate calories burned and assess fitness goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Units",
                name: "units",
                type: "select",
                options: ["metric", "imperial"],
                tooltip: "Metric (kg, km) or Imperial (lb, miles).",
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
                options: ["male", "female"],
                tooltip: "Affects BMR calculation.",
              },
              {
                label: "Activity Type",
                name: "activityType",
                type: "select",
                options: [
                  ...Object.entries(activityMETs).map(([value, text]) => ({ value, text })),
                  { value: "custom", text: "Custom MET" },
                ],
                tooltip: "Select or enter custom MET value.",
              },
              ...(toggleCustomMET()
                ? [
                    {
                      label: "Custom MET Value",
                      name: "customMet",
                      type: "number",
                      step: 0.1,
                      min: 0,
                      tooltip: "Enter MET value for custom activity.",
                    },
                  ]
                : []),
              {
                label: "Duration (Minutes)",
                name: "duration",
                type: "number",
                step: 1,
                min: 0,
                tooltip: "Total activity duration.",
              },
              {
                label: "Intensity",
                name: "intensity",
                type: "select",
                options: ["low", "moderate", "high"],
                tooltip: "Low, Moderate, or High effort.",
              },
              {
                label: "Distance (Optional)",
                name: "distance",
                type: "number",
                step: 0.1,
                min: 0,
                tooltip: "Distance for running/cycling (km or miles).",
              },
              {
                label: "Activity Level",
                name: "activityLevel",
                type: "select",
                options: ["sedentary", "light", "moderate", "very"],
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
                step: 1,
                min: 0,
                tooltip: "Calories consumed daily.",
              },
              {
                label: "Target Calories Burned",
                name: "targetCalories",
                type: "number",
                step: 1,
                min: 0,
                tooltip: "Desired daily calorie burn.",
              },
              {
                label: "Fitness Level",
                name: "fitnessLevel",
                type: "select",
                options: ["beginner", "intermediate", "advanced"],
                tooltip: "Your exercise experience.",
              },
              {
                label: "Health Conditions",
                name: "healthConditions",
                type: "select",
                multiple: true,
                options: ["asthma", "joint-issues", "heart-condition"],
                tooltip: "Select conditions (optional).",
              },
            ].map(({ label, name, type, options, step, min, multiple, tooltip }) => (
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
                      <option
                        key={typeof opt === "object" ? opt.value : opt}
                        value={typeof opt === "object" ? opt.value : opt}
                      >
                        {typeof opt === "object"
                          ? opt.text
                          : opt.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
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
                  {
                    label: "Activity Type",
                    name: "activity",
                    type: "select",
                    options: Object.entries(activityMETs).map(([value, text]) => ({ value, text })),
                  },
                  { label: "Duration (Minutes)", name: "duration", type: "number", step: 1, min: 0 },
                  {
                    label: "Intensity",
                    name: "intensity",
                    type: "select",
                    options: ["low", "moderate", "high"],
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
                          <option key={opt.value} value={opt.value}>
                            {opt.text}
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
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4 ml-4"
          >
            Learn About Exercise & Calories
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calories Burned & Fitness Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Calories Burned", key: "caloriesBurned" },
                  { label: "BMR", key: "bmr" },
                  { label: "TDEE", key: "tdee" },
                  { label: "Total Calories Burned", key: "totalCaloriesBurned" },
                  { label: "Calorie Balance", key: "calorieBalance" },
                  { label: "Progress to Target", key: "progress" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <h3 className="text-md font-medium text-gray-900">{label}</h3>
                    <p className="text-xl font-bold text-gray-800">{results[key]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Calorie Distribution</h3>
                <canvas ref={pieChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">Activity</th>
                      <th className="p-2">Calories Burned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarios?.map((s) => (
                      <tr key={s.name}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.activity}</td>
                        <td className="p-2">{s.calories} kcal</td>
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
                <h3 className="text-md font-medium text-gray-900">Calories Burned Trend</h3>
                <canvas ref={lineChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
                <canvas ref={barChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Calorie Burn Progress</h3>
                <canvas ref={gaugeChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Recommendations</h3>
                <p className="text-gray-600">{results.recommendations}</p>
              </div>
              <div className="mt-6 overflow-x-auto max-h-80 overflow-y-auto">
                <h3 className="text-md font-medium text-gray-900">Activity Log</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Key Metric</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calorieHistory.map((h, i) => (
                      <tr key={i}>
                        <td className="p-2">{h.date}</td>
                        <td className="p-2">{h.keyMetric}</td>
                        <td className="p-2">{h.value} kcal</td>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
                <span
                  className="absolute top-2 right-4 text-xl cursor-pointer"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold mb-4">Understanding Exercise & Calories</h2>
                <p className="mb-4">
                  Physical activity burns calories, contributing to weight management and overall health. The
                  Metabolic Equivalent of Task (MET) measures energy expenditure.
                </p>
                <h3 className="text-md font-medium mb-2">Benefits of Exercise</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Improves cardiovascular health.</li>
                  <li>Enhances mood and mental health.</li>
                  <li>Supports weight loss or maintenance.</li>
                  <li>Builds muscle and bone strength.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Risks of Overtraining</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Fatigue or burnout.</li>
                  <li>Increased injury risk.</li>
                  <li>Hormonal imbalances.</li>
                  <li>Inadequate recovery.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Exercise 150–300 minutes/week at moderate intensity.</li>
                  <li>Balance calorie intake with expenditure.</li>
                  <li>Consult a professional for personalized plans.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Resources</h3>
                <p className="mb-4">For more information, visit:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <a
                      href="https://www.cdc.gov/physicalactivity"
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      CDC Physical Activity
                    </a>
                  </li>
                  <li>
                    <a href="https://www.acsm.org" target="_blank" className="text-blue-500 hover:underline">
                      American College of Sports Medicine
                    </a>
                  </li>
                  <li>Local fitness professionals.</li>
                </ul>
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
