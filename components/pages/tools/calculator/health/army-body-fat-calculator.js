"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

const armyStandards = {
  male: { "17-20": 20, "21-27": 22, "28-39": 24, "40+": 26 },
  female: { "17-20": 30, "21-27": 32, "28-39": 34, "40+": 36 },
};

export default function Home() {
  const [formData, setFormData] = useState({
    units: "metric",
    weight: 70,
    height: 170,
    age: 30,
    gender: "male",
    neck: 38,
    waist: 85,
    hip: 95,
    activityLevel: "sedentary",
    fitnessGoal: "meet-standards",
    trainingFrequency: 4,
    calorieTarget: 2000,
    bodyFatGoal: 15,
  });
  const [scenarios, setScenarios] = useState([{ weight: 70, waist: 85, neck: 38 }]);
  const [bodyFatHistory, setBodyFatHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({});
  const [compliance, setCompliance] = useState("");
  const [sensitivity, setSensitivity] = useState([]);
  const [recommendations, setRecommendations] = useState("");
  const compositionPieChartRef = useRef(null);
  const bodyFatLineChartRef = useRef(null);
  const metricsBarChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("bodyFatHistory")) || [];
    setBodyFatHistory(savedHistory);
    toggleHipInput();
  }, [formData.gender]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScenarioChange = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index][field] = parseFloat(value);
    setScenarios(newScenarios);
  };

  const toggleHipInput = () => {
    document.getElementById("hip-container")?.classList.toggle("hidden", formData.gender === "male");
  };

  const convertUnits = () => {
    setErrorMessage("");
    const newUnits = formData.units === "metric" ? "imperial" : "metric";
    const conversions = {
      weight: newUnits === "metric" ? (v) => (v / 2.20462).toFixed(1) : (v) => (v * 2.20462).toFixed(1),
      length: newUnits === "metric" ? (v) => (v / 0.393701).toFixed(1) : (v) => (v * 0.393701).toFixed(1),
    };

    setFormData((prev) => ({
      ...prev,
      units: newUnits,
      weight: conversions.weight(prev.weight),
      height: conversions.length(prev.height),
      neck: conversions.length(prev.neck),
      waist: conversions.length(prev.waist),
      hip: conversions.length(prev.hip),
    }));

    setScenarios(
      scenarios.map((s) => ({
        weight: conversions.weight(s.weight),
        waist: conversions.length(s.waist),
        neck: conversions.length(s.neck),
      }))
    );
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setErrorMessage("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([...scenarios, { weight: 70, waist: 85, neck: 38 }]);
  };

  const calculateBMI = (weight, height, units) => {
    if (units === "metric") return (weight / (height / 100) ** 2).toFixed(1);
    return ((703 * weight) / height ** 2).toFixed(1);
  };

  const calculateBMR = (weight, height, age, gender, units) => {
    const weightKg = units === "metric" ? weight : weight / 2.20462;
    const heightCm = units === "metric" ? height : height * 2.54;
    return (
      gender === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    ).toFixed(0);
  };

  const calculateTDEE = (bmr, activityLevel) => {
    const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725, elite: 1.9 };
    return (bmr * factors[activityLevel]).toFixed(0);
  };

  const calculateBodyFat = (gender, height, neck, waist, hip, units) => {
    const heightIn = units === "metric" ? height * 0.393701 : height;
    const neckIn = units === "metric" ? neck * 0.393701 : neck;
    const waistIn = units === "metric" ? waist * 0.393701 : waist;
    const hipIn = units === "metric" ? hip * 0.393701 : hip;
    if (gender === "male") {
      return (86.01 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76).toFixed(1);
    }
    return (163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387).toFixed(
      1
    );
  };

  const checkArmyCompliance = (bodyFat, age, gender) => {
    const ageGroup = age <= 20 ? "17-20" : age <= 27 ? "21-27" : age <= 39 ? "28-39" : "40+";
    const maxBodyFat = armyStandards[gender][ageGroup];
    return bodyFat <= maxBodyFat ? `Compliant (Max: ${maxBodyFat}%)` : `Non-Compliant (Max: ${maxBodyFat}%)`;
  };

  const calculate = () => {
    setErrorMessage("");
    const {
      units,
      weight,
      height,
      age,
      gender,
      neck,
      waist,
      hip,
      activityLevel,
      fitnessGoal,
      trainingFrequency,
      calorieTarget,
      bodyFatGoal,
    } = formData;
    const parsed = {
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      neck: parseFloat(neck),
      waist: parseFloat(waist),
      hip: parseFloat(hip),
      trainingFrequency: parseInt(trainingFrequency),
      calorieTarget: parseInt(calorieTarget),
      bodyFatGoal: parseFloat(bodyFatGoal),
    };

    if (Object.values(parsed).some((val) => isNaN(val) && val !== undefined)) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }
    if (gender === "female" && isNaN(parsed.hip)) {
      setErrorMessage("Hip circumference required for females.");
      return;
    }
    if (
      parsed.weight <= 0 ||
      parsed.height <= 0 ||
      parsed.age <= 0 ||
      parsed.neck <= 0 ||
      parsed.waist <= 0 ||
      (gender === "female" && parsed.hip <= 0) ||
      parsed.trainingFrequency < 0 ||
      parsed.trainingFrequency > 7 ||
      parsed.calorieTarget < 0 ||
      (parsed.bodyFatGoal && (parsed.bodyFatGoal < 0 || parsed.bodyFatGoal > 100))
    ) {
      setErrorMessage("Invalid input values.");
      return;
    }
    if (
      parsed.neck >= parsed.waist ||
      (gender === "female" && (parsed.neck >= parsed.hip || parsed.waist >= parsed.hip))
    ) {
      setErrorMessage("Invalid measurements: Neck must be smaller than waist/hip.");
      return;
    }

    const bmi = calculateBMI(parsed.weight, parsed.height, units);
    const bmr = calculateBMR(parsed.weight, parsed.height, parsed.age, gender, units);
    const tdee = calculateTDEE(bmr, activityLevel);
    const bodyFat = calculateBodyFat(gender, parsed.height, parsed.neck, parsed.waist, parsed.hip, units);
    const fatMass = (parsed.weight * (bodyFat / 100)).toFixed(1);
    const leanMass = (parsed.weight - fatMass).toFixed(1);
    const newCompliance = checkArmyCompliance(bodyFat, parsed.age, gender);
    const calorieAdjustment =
      fitnessGoal === "weight-loss" ? tdee - 500 : fitnessGoal === "muscle-gain" ? tdee + 500 : tdee;

    let newRecommendations = "";
    if (newCompliance.includes("Non-Compliant")) {
      newRecommendations = `To meet Army standards, reduce body fat by ${
        bodyFat -
        armyStandards[gender][
          parsed.age <= 20 ? "17-20" : parsed.age <= 27 ? "21-27" : parsed.age <= 39 ? "28-39" : "40+"
        ]
      }% through a calorie deficit of ~500 kcal/day and regular exercise (${
        parsed.trainingFrequency
      } days/week).`;
    } else if (parsed.bodyFatGoal && bodyFat > parsed.bodyFatGoal) {
      newRecommendations = `To reach ${
        parsed.bodyFatGoal
      }% body fat, maintain a calorie deficit of ~500 kcal/day and increase training to ${
        parsed.trainingFrequency + 1
      } days/week.`;
    } else {
      newRecommendations = `Maintain current fitness with ${parsed.trainingFrequency} days/week training and ${calorieAdjustment} kcal/day.`;
    }

    const newSensitivity = [];
    for (let w = parsed.weight * 0.9; w <= parsed.weight * 1.1; w += parsed.weight * 0.1) {
      newSensitivity.push({ weight: w.toFixed(1), bodyFat });
    }

    const newScenarios = scenarios
      .map((s, i) => {
        if (!isNaN(s.weight) && !isNaN(s.waist) && !isNaN(s.neck)) {
          const sBodyFat = calculateBodyFat(gender, parsed.height, s.neck, s.waist, parsed.hip, units);
          const sFatMass = (s.weight * (sBodyFat / 100)).toFixed(1);
          const sCompliance = checkArmyCompliance(sBodyFat, parsed.age, gender);
          return { name: `Scenario ${i + 1}`, bodyFat: sBodyFat, fatMass: sFatMass, compliance: sCompliance };
        }
        return null;
      })
      .filter((s) => s);

    setResults({
      bodyFat: `${bodyFat}%`,
      fatMass: `${fatMass} ${units === "metric" ? "kg" : "lb"}`,
      leanMass: `${leanMass} ${units === "metric" ? "kg" : "lb"}`,
      bmi,
      bmr: `${bmr} kcal`,
      tdee: `${tdee} kcal`,
      calorieAdjustment: `${calorieAdjustment} kcal`,
    });
    setCompliance(newCompliance);
    setSensitivity(newSensitivity);
    setRecommendations(newRecommendations);
    setShowResults(true);
    updateCharts({ ...results, bodyFat, fatMass, leanMass }, units, newScenarios);

    const newHistory = [
      ...bodyFatHistory,
      { date: new Date().toLocaleString(), keyMetric: "Body Fat %", value: `${bodyFat}%` },
    ];
    setBodyFatHistory(newHistory);
    localStorage.setItem("bodyFatHistory", JSON.stringify(newHistory));
  };

  const updateCharts = (results, units, scenarios) => {
    if (pieChartInstance.current) pieChartInstance.current.destroy();
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();

    pieChartInstance.current = new Chart(compositionPieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Fat Mass", "Lean Mass"],
        datasets: [
          {
            data: [parseFloat(results.fatMass), parseFloat(results.leanMass)],
            backgroundColor: ["#ef4444", "#f59e0b"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" }, title: { display: true, text: "Body Composition" } },
      },
    });

    lineChartInstance.current = new Chart(bodyFatLineChartRef.current, {
      type: "line",
      data: {
        labels: ["-10% Weight", "Current", "+10% Weight"],
        datasets: [
          {
            label: "Body Fat (%)",
            data: [
              calculateBodyFat(
                formData.gender,
                parseFloat(formData.height),
                parseFloat(formData.neck),
                parseFloat(formData.waist),
                parseFloat(formData.hip),
                units
              ),
              parseFloat(results.bodyFat),
              calculateBodyFat(
                formData.gender,
                parseFloat(formData.height),
                parseFloat(formData.neck),
                parseFloat(formData.waist),
                parseFloat(formData.hip),
                units
              ),
            ],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Weight Change" } },
          y: { title: { display: true, text: "Body Fat (%)" } },
        },
        plugins: { title: { display: true, text: "Body Fat vs. Weight" } },
      },
    });

    barChartInstance.current = new Chart(metricsBarChartRef.current, {
      type: "bar",
      data: {
        labels: scenarios.map((s) => s.name),
        datasets: [
          { label: "Body Fat (%)", data: scenarios.map((s) => s.bodyFat), backgroundColor: "#ef4444" },
          { label: "Fat Mass", data: scenarios.map((s) => s.fatMass), backgroundColor: "#10b981" },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { title: { display: true, text: "Amount" } } },
        plugins: { title: { display: true, text: "Scenario Body Fat Comparison" } },
      },
    });
  };

  const saveCalculation = () => {
    if (showResults) {
      setSuccessMessage("Calculation saved to history!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } else {
      setErrorMessage("No valid calculation to save.");
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Key Metric", "Value"],
      ...bodyFatHistory.map((h) => [h.date, h.keyMetric, h.value]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "body_fat_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Army Body Fat Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    bodyFatHistory.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text("Note: Visual charts and recommendations are available in the web interface.", 10, y);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 10);
    doc.save("body_fat_results.pdf");
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Advanced Army Body Fat Calculator</h1>
          </div>
          {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-sm mt-1">{successMessage}</div>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal & Measurement Details</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter details to calculate your body fat percentage per U.S. Army standards (AR 600-9).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Units",
                name: "units",
                type: "select",
                options: ["metric", "imperial"],
                tooltip: "Metric (kg, cm) or Imperial (lb, inch)",
              },
              {
                label: "Weight",
                name: "weight",
                type: "number",
                step: 0.1,
                min: 0,
                tooltip: "Your body weight (kg or lb)",
              },
              {
                label: "Height",
                name: "height",
                type: "number",
                step: 0.1,
                min: 0,
                tooltip: "Your height (cm or inch)",
              },
              {
                label: "Age",
                name: "age",
                type: "number",
                step: 1,
                min: 0,
                tooltip: "Your age for BMR and Army standards",
              },
              {
                label: "Gender",
                name: "gender",
                type: "select",
                options: ["male", "female"],
                tooltip: "Affects body fat formula and standards",
                onChange: toggleHipInput,
              },
              {
                label: "Neck Circumference",
                name: "neck",
                type: "number",
                step: 0.1,
                min: 0,
                tooltip: "Measure below Adam's apple (cm or inch)",
              },
              {
                label: "Waist Circumference",
                name: "waist",
                type: "number",
                step: 0.1,
                min: 0,
                tooltip: "Males: at navel; Females: smallest point (cm or inch)",
              },
              {
                label: "Hip Circumference",
                name: "hip",
                type: "number",
                step: 0.1,
                min: 0,
                tooltip: "Females only: widest point (cm or inch)",
                id: "hip-container",
                className: formData.gender === "male" ? "hidden" : "",
              },
              {
                label: "Activity Level",
                name: "activityLevel",
                type: "select",
                options: ["sedentary", "light", "moderate", "very", "elite"],
                tooltip: "Your daily activity level",
              },
              {
                label: "Fitness Goal",
                name: "fitnessGoal",
                type: "select",
                options: ["meet-standards", "weight-loss", "muscle-gain"],
                tooltip: "Your primary fitness goal",
              },
              {
                label: "Training Frequency (Days/Week)",
                name: "trainingFrequency",
                type: "number",
                step: 1,
                min: 0,
                max: 7,
                tooltip: "Weekly workout days",
              },
              {
                label: "Daily Calorie Target",
                name: "calorieTarget",
                type: "number",
                step: 1,
                min: 0,
                tooltip: "Manual or TDEE-based calories (optional)",
              },
              {
                label: "Target Body Fat %",
                name: "bodyFatGoal",
                type: "number",
                step: 0.1,
                min: 0,
                max: 100,
                tooltip: "Desired body fat percentage (optional)",
              },
            ].map(({ label, name, type, options, step, min, max, tooltip, id, className, onChange }) => (
              <div key={name} id={id} className={className}>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {label}
                  <span className="tooltip ml-1">
                    ?<span className="tooltiptext">{tooltip}</span>
                  </span>
                </label>
                {type === "select" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={onChange || handleInputChange}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1).replace("-", " ")}
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
          <div id="scenarios">
            {scenarios.map((s, i) => (
              <div key={i} className="scenario-section border border-gray-200 p-4 mb-4 rounded-lg">
                <h3 className="text-md font-medium text-gray-900 mb-2">Scenario {i + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Weight", field: "weight", value: s.weight },
                    { label: "Waist Circumference", field: "waist", value: s.waist },
                    { label: "Neck Circumference", field: "neck", value: s.neck },
                  ].map(({ label, field, value }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleScenarioChange(i, field, e.target.value)}
                        step="0.1"
                        min="0"
                        className="w-full p-3 border rounded-lg bg-white text-gray-900"
                      />
                    </div>
                  ))}
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Body Fat & Fitness Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Body Fat %", value: results.bodyFat },
                  { label: "Fat Mass", value: results.fatMass },
                  { label: "Lean Mass", value: results.leanMass },
                  { label: "BMI", value: results.bmi },
                  { label: "BMR", value: results.bmr },
                  { label: "TDEE", value: results.tdee },
                  { label: "Recommended Calories", value: results.calorieAdjustment },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <h3 className="text-md font-medium text-gray-900">{label}</h3>
                    <p className="text-xl font-bold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Army Compliance</h3>
                <p className="text-gray-600">{compliance}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">Body Fat %</th>
                      <th className="p-2">Fat Mass</th>
                      <th className="p-2">Compliance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((s, i) => (
                      <tr key={i}>
                        <td className="p-2">Scenario {i + 1}</td>
                        <td className="p-2">{s.bodyFat}%</td>
                        <td className="p-2">
                          {s.fatMass} {formData.units === "metric" ? "kg" : "lb"}
                        </td>
                        <td className="p-2">{s.compliance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Sensitivity Analysis</h3>
                <p className="text-gray-600">
                  Body fat ranges from {sensitivity[0]?.bodyFat}% at {sensitivity[0]?.weight}{" "}
                  {formData.units === "metric" ? "kg" : "lb"} to
                  {sensitivity[sensitivity.length - 1]?.bodyFat}% at{" "}
                  {sensitivity[sensitivity.length - 1]?.weight} {formData.units === "metric" ? "kg" : "lb"}.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Body Composition</h3>
                <canvas ref={compositionPieChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Body Fat vs. Weight</h3>
                <canvas ref={bodyFatLineChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Body Fat Comparison</h3>
                <canvas ref={metricsBarChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Recommendations</h3>
                <p className="text-gray-600">{recommendations}</p>
              </div>
              <div className="mt-6 overflow-x-auto max-h-80 overflow-y-auto">
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
                    {bodyFatHistory.map((h, i) => (
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
