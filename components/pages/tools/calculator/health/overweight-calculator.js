"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function Home() {
  const [formData, setFormData] = useState({
    units: "metric",
    weight: 80,
    height: 170,
    age: 30,
    gender: "male",
    waist: "40.5",
    neck: "38",
    hip: "100",
    activityLevel: "sedentary",
    fitnessGoal: "weight-loss",
    trainingFrequency: 3,
    calorieTarget: "2000",
    targetBMI: "24.9",
    healthConditions: [],
  });
  const [scenarios, setScenarios] = useState([{ weight: "80", waist: "90", goal: "weight-loss" }]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [healthHistory, setHealthHistory] = useState([]);
  const [results, setResults] = useState({});
  const compositionPieChartRef = useRef(null);
  const trendLineChartRef = useRef(null);
  const metricsBarChartRef = useRef(null);
  const riskGaugeChartRef = useRef(null);
  let compositionPieChartInstance = useRef(null);
  let trendLineChartInstance = useRef(null);
  let metricsBarChartInstance = useRef(null);
  let riskGaugeChartInstance = useRef(null);

  const bmiClassification = [
    { min: 0, max: 18.5, status: "Underweight", risk: "Low" },
    { min: 18.5, max: 25, status: "Normal", risk: "None" },
    { min: 25, max: 30, status: "Overweight", risk: "Elevated" },
    { min: 30, max: Infinity, status: "Obese", risk: "High" },
  ];

  const bodyFatRanges = {
    male: { "20-39": { min: 10, max: 22 }, "40-59": { min: 13, max: 25 } },
    female: { "20-39": { min: 20, max: 32 }, "40-59": { min: 23, max: 35 } },
  };

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("healthHistory")) || [];
    setHealthHistory(savedHistory, savedHistory);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "weight",
        "height",
        "age",
        "waist",
        "neck",
        "hip",
        "trainingFrequency",
        "calorieTarget",
        "targetBMI",
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
      newScenarios[index][field] = ["weight", "waist"].includes(field) ? parseFloat(value) || "" : value;
      return newScenarios;
    });
  };

  const toggleHipInput = () => formData.gender === "male";

  const convertUnits = () => {
    setErrorMessage("");
    const { units, weight, height, waist, neck, hip } = formData;
    const newUnits = units === "metric" ? "imperial" : "metric";
    const convert = (val, toMetric) =>
      toMetric
        ? (val / (units === "metric" ? 2.20462 : 0.393701)).toFixed(1)
        : (val * (units === "metric" ? 0.393701 : 2.20462)).toFixed(1);

    if ([weight, height, waist, neck, hip].some((val) => isNaN(parseFloat(val)) && val !== "")) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      units: newUnits,
      weight: convert(weight, newUnits === "metric"),
      height: convert(height, newUnits === "metric"),
      waist: convert(waist, newUnits === "metric"),
      neck: convert(neck, newUnits === "metric"),
      hip: convert(hip, newUnits === "metric"),
    }));

    setScenarios((prev) =>
      prev.map((s) => ({
        ...s,
        weight: convert(s.weight, newUnits === "metric"),
        waist: convert(s.waist, newUnits === "metric"),
      }))
    );
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setErrorMessage("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios((prev) => [...prev, { weight: "80", waist: "90", goal: "weight-loss" }]);
  };

  const calculateBMI = (weight, height, units) => {
    weight = parseFloat(weight);
    height = parseFloat(height);
    return units === "metric"
      ? (weight / (height / 100) ** 2).toFixed(1)
      : ((703 * weight) / height ** 2).toFixed(1);
  };

  const getBMIClassification = (bmi) =>
    bmiClassification.find((cls) => bmi >= cls.min && bmi < cls.max) || {
      status: "Unknown",
      risk: "Unknown",
    };

  const calculateBodyFat = (gender, height, neck, waist, hip, units) => {
    const toInches = (val) => (units === "metric" ? val * 0.393701 : val);
    height = toInches(parseFloat(height));
    neck = toInches(parseFloat(neck));
    waist = toInches(parseFloat(waist));
    hip = toInches(parseFloat(hip));
    if (gender === "male") {
      return (86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76).toFixed(1);
    }
    return (163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387).toFixed(1);
  };

  const checkBodyFatHealth = (bodyFat, age, gender) => {
    const ageGroup = age <= 39 ? "20-39" : "40-59";
    const range = bodyFatRanges[gender][ageGroup];
    if (bodyFat < range.min) return "Below Healthy";
    if (bodyFat <= range.max) return "Healthy";
    return "Above Healthy";
  };

  const calculateBMR = (weight, height, age, gender, units) => {
    const weightKg = units === "metric" ? parseFloat(weight) : parseFloat(weight) / 2.20462;
    const heightCm = units === "metric" ? parseFloat(height) : parseFloat(height) * 2.54;
    return (10 * weightKg + 6.25 * heightCm - 5 * age + (gender === "male" ? 5 : -161)).toFixed(0);
  };

  const calculateTDEE = (bmr, activityLevel) => {
    const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 };
    return (bmr * factors[activityLevel]).toFixed(0);
  };

  const calculateHealthyWeightRange = (height, units) => {
    const heightM = units === "metric" ? parseFloat(height) / 100 : parseFloat(height) * 0.0254;
    const minWeight = (18.5 * heightM * heightM).toFixed(1);
    const maxWeight = (24.9 * heightM * heightM).toFixed(1);
    return units === "metric"
      ? { min: minWeight, max: maxWeight, unit: "kg" }
      : { min: (minWeight * 2.20462).toFixed(1), max: (maxWeight * 2.20462).toFixed(1), unit: "lb" };
  };

  const calculate = () => {
    setErrorMessage("");
    const {
      units,
      weight,
      height,
      age,
      gender,
      waist,
      neck,
      hip,
      activityLevel,
      fitnessGoal,
      trainingFrequency,
      calorieTarget,
      targetBMI,
      healthConditions,
    } = formData;

    if (
      [weight, height, age, waist, neck, trainingFrequency, calorieTarget, targetBMI].some(
        (val) => isNaN(parseFloat(val)) && val !== ""
      ) ||
      (gender === "female" && isNaN(parseFloat(hip)))
    ) {
      setErrorMessage("Please provide valid inputs.");
      return;
    }
    if (
      parseFloat(weight) <= 0 ||
      parseFloat(height) <= 0 ||
      age <= 0 ||
      parseFloat(waist) <= 0 ||
      parseFloat(neck) <= 0 ||
      (gender === "female" && parseFloat(hip) <= 0) ||
      trainingFrequency < 0 ||
      trainingFrequency > 7 ||
      calorieTarget < 0 ||
      (targetBMI && (targetBMI < 0 || targetBMI > 50))
    ) {
      setErrorMessage("Invalid input values (e.g., negative or out-of-range).");
      return;
    }
    if (
      parseFloat(neck) >= parseFloat(waist) ||
      (gender === "female" && (parseFloat(neck) >= parseFloat(hip) || parseFloat(waist) >= parseFloat(hip)))
    ) {
      setErrorMessage("Invalid measurements: Neck must be smaller than waist/hip.");
      return;
    }

    const bmi = calculateBMI(weight, height, units);
    const classification = getBMIClassification(bmi);
    const bodyFat = calculateBodyFat(gender, height, neck, waist, hip, units);
    const bodyFatStatus = checkBodyFatHealth(bodyFat, age, gender);
    const fatMass = (weight * (bodyFat / 100)).toFixed(1);
    const leanMass = (weight - fatMass).toFixed(1);
    const bmr = calculateBMR(weight, height, age, gender, units);
    const tdee = calculateTDEE(bmr, activityLevel);
    const healthyWeight = calculateHealthyWeightRange(height, units);
    const calorieAdjustment = fitnessGoal === "weight-loss" ? parseInt(tdee) - 500 : parseInt(tdee);
    const overweightRisk =
      bmi >= 25
        ? `Warning: BMI ${bmi} indicates ${classification.status} with ${classification.risk} health risk. Consult a healthcare professional.`
        : `BMI ${bmi} is ${classification.status}. Maintain healthy habits.`;

    let recommendations = "";
    if (bmi >= 25) {
      recommendations = `To reach a healthy BMI (${
        targetBMI || 24.9
      }), aim for a calorie deficit of 500 kcal/day and exercise ${
        trainingFrequency + 1
      } days/week. Consult a dietitian or doctor.`;
    } else if (bmi > targetBMI) {
      recommendations = `To reach a BMI of ${targetBMI}, maintain a calorie deficit of 500 kcal/day and train ${trainingFrequency} days/week.`;
    } else {
      recommendations = `Maintain your current health with ${calorieAdjustment} kcal/day and ${trainingFrequency} days/week exercise.`;
    }
    if (healthConditions.length > 0) {
      recommendations += ` Note: Conditions (${healthConditions.join(
        ", "
      )}) increase health risks. Seek medical advice.`;
    }
    if (bodyFatStatus === "Above Healthy") {
      recommendations += ` Your body fat (${bodyFat}%) is above healthy range. Focus on fat loss through diet and exercise.`;
    }

    const sensitivity = [];
    for (let w = parseFloat(weight) * 0.9; w <= parseFloat(weight) * 1.1; w += parseFloat(weight) * 0.1) {
      const sBMI = calculateBMI(w, height, units);
      const sBodyFat = calculateBodyFat(gender, height, neck, waist, hip, units);
      sensitivity.push({ weight: w.toFixed(1), bmi: sBMI, bodyFat: sBodyFat });
    }

    const scenarioResults = scenarios
      .map((s, i) => {
        if (isNaN(parseFloat(s.weight)) || isNaN(parseFloat(s.waist))) return null;
        const sBMI = calculateBMI(s.weight, height, units);
        const sBodyFat = calculateBodyFat(gender, height, neck, s.waist, hip, units);
        const sClassification = getBMIClassification(sBMI);
        return { name: `Scenario ${i + 1}`, bmi: sBMI, bodyFat: sBodyFat, risk: sClassification.risk };
      })
      .filter(Boolean);

    setResults({
      bmi,
      weightStatus: classification.status,
      bodyFat: `${bodyFat}%`,
      bodyFatStatus,
      fatMass: `${fatMass} ${units === "metric" ? "kg" : "lb"}`,
      leanMass: `${leanMass} ${units === "metric" ? "kg" : "lb"}`,
      bmr: `${bmr} kcal`,
      tdee: `${tdee} kcal`,
      healthyWeight: `${healthyWeight.min}–${healthyWeight.max} ${healthyWeight.unit}`,
      calorieAdjustment: `${calorieAdjustment} kcal`,
      overweightRisk,
      recommendations,
      sensitivity,
      scenarios: scenarioResults,
    });

    const newHistory = [
      ...healthHistory,
      { date: new Date().toLocaleString(), keyMetric: "BMI", value: bmi },
      { date: new Date().toLocaleString(), keyMetric: "Body Fat %", value: bodyFat },
    ];
    setHealthHistory(newHistory, newHistory);
    localStorage.setItem("healthHistory", JSON.stringify(newHistory));
    setShowResults(true);

    if (compositionPieChartInstance.current) compositionPieChartInstance.current.destroy();
    compositionPieChartInstance.current = new Chart(compositionPieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Fat Mass", "Lean Mass"],
        datasets: [
          { data: [parseFloat(fatMass), parseFloat(leanMass)], backgroundColor: ["#3b82f6", "#f59e0b"] },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" }, title: { display: true, text: "Body Composition" } },
      },
    });

    if (trendLineChartInstance.current) trendLineChartInstance.current.destroy();
    trendLineChartInstance.current = new Chart(trendLineChartRef.current, {
      type: "line",
      data: {
        labels: newHistory.filter((h) => h.keyMetric === "BMI").map((h) => h.date),
        datasets: [
          {
            label: "BMI",
            data: newHistory.filter((h) => h.keyMetric === "BMI").map((h) => parseFloat(h.value)),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: false,
          },
          {
            label: "Body Fat %",
            data: newHistory.filter((h) => h.keyMetric === "Body Fat %").map((h) => parseFloat(h.value)),
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
        plugins: { title: { display: true, text: "BMI & Body Fat Trend" } },
      },
    });

    if (metricsBarChartInstance.current) metricsBarChartInstance.current.destroy();
    metricsBarChartInstance.current = new Chart(metricsBarChartRef.current, {
      type: "bar",
      data: {
        labels: scenarioResults.map((s) => s.name),
        datasets: [
          { label: "BMI", data: scenarioResults.map((s) => s.bmi), backgroundColor: "#3b82f6" },
          { label: "Body Fat %", data: scenarioResults.map((s) => s.bodyFat), backgroundColor: "#f59e0b" },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { title: { display: true, text: "Value" }, min: 0 } },
        plugins: { title: { display: true, text: "Scenario Comparison" } },
      },
    });

    if (riskGaugeChartInstance.current) riskGaugeChartInstance.current.destroy();
    riskGaugeChartInstance.current = new Chart(riskGaugeChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["BMI", "Remaining"],
        datasets: [
          {
            data: [Math.min(parseFloat(bmi), 40), Math.max(40 - parseFloat(bmi), 0)],
            backgroundColor: [
              parseFloat(bmi) >= 30 ? "#ef4444" : parseFloat(bmi) >= 25 ? "#f59e0b" : "#10b981",
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
        plugins: { title: { display: true, text: "Health Risk Level" }, legend: { display: false } },
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
    a.download = "overweight_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Overweight Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    healthHistory.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text(
      "Note: Visual charts (Pie, Line, Bar, Gauge) and recommendations are available in the web interface.",
      10,
      y
    );
    doc.text(
      "Warning: BMI ≥25 indicates increased health risks. Consult a healthcare professional.",
      10,
      y + 10
    );
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 20);
    doc.save("overweight_results.pdf");
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Advanced Overweight Calculator</h1>
          </div>
          <div className="warning-message mb-4">
            <strong>Important:</strong> This calculator assesses overweight status using BMI and body fat. BMI
            ≥25 indicates potential health risks. Consult a healthcare professional for personalized advice.
          </div>
          {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-sm mt-1">{successMessage}</div>}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal & Health Details</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter details to calculate your BMI, body fat, and overweight status.
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
                  tooltip: "Your age for BMR and health risks.",
                },
                {
                  label: "Gender",
                  name: "gender",
                  type: "select",
                  options: ["male", "female"],
                  tooltip: "Affects BMR and body fat calculation.",
                  onChange: () =>
                    setFormData((prev) => ({ ...prev, hip: prev.gender === "male" ? "" : prev.hip })),
                },
                {
                  label: "Waist Circumference",
                  name: "waist",
                  type: "number",
                  step: "0.1",
                  min: 0,
                  value: formData.waist,
                  tooltip: "Measure at navel (cm or inch).",
                },
                {
                  label: "Neck Circumference",
                  name: "neck",
                  type: "number",
                  step: "0.1",
                  min: 0,
                  value: formData.neck,
                  tooltip: "Measure below Adam's apple (cm or inch).",
                },
                ...(toggleHipInput()
                  ? []
                  : [
                      {
                        label: "Hip Circumference",
                        name: "hip",
                        type: "number",
                        step: "0.1",
                        min: 0,
                        value: formData.hip,
                        tooltip: "Females only: widest point (cm or inch).",
                      },
                    ]),
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
                  options: ["weight-loss", "maintenance", "improve-fitness"],
                  tooltip: "Your primary fitness goal.",
                },
                {
                  label: "Training Frequency (Days/Week)",
                  name: "trainingFrequency",
                  type: "number",
                  step: "1",
                  min: 0,
                  max: 7,
                  value: formData.trainingFrequency,
                  tooltip: "Weekly workout days.",
                },
                {
                  label: "Daily Calorie Target",
                  name: "calorieTarget",
                  type: "number",
                  step: "1",
                  min: 0,
                  value: formData.calorieTarget,
                  tooltip: "Manual or TDEE-based calories (optional).",
                },
                {
                  label: "Target BMI",
                  name: "targetBMI",
                  type: "number",
                  step: "0.1",
                  min: 0,
                  value: formData.targetBMI,
                  tooltip: "Desired BMI (e.g., 24.9 for healthy).",
                },
                {
                  label: "Health Conditions",
                  name: "healthConditions",
                  type: "select",
                  multiple: true,
                  options: ["hypertension", "diabetes", "joint-pain", "sleep-apnea"],
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
                      label: "Waist Circumference",
                      name: "waist",
                      type: "number",
                      step: "0.1",
                      min: 0,
                      value: s.waist,
                    },
                    {
                      label: "Fitness Goal",
                      name: "goal",
                      type: "select",
                      options: ["weight-loss", "maintenance", "improve-fitness"],
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
              Learn About Overweight Risks
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">BMI & Health Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "BMI", key: "bmi" },
                  { label: "Weight Status", key: "weightStatus" },
                  { label: "Body Fat %", key: "bodyFat" },
                  { label: "Body Fat Status", key: "bodyFatStatus" },
                  { label: "Fat Mass", key: "fatMass" },
                  { label: "Lean Mass", key: "leanMass" },
                  { label: "BMR", key: "bmr" },
                  { label: "TDEE", key: "tdee" },
                  { label: "Healthy Weight Range", key: "healthyWeight" },
                  { label: "Recommended Calories", key: "calorieAdjustment" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <h3 className="text-md font-medium text-gray-900">{label}</h3>
                    <p className="text-xl font-bold text-gray-800">{results[key]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Overweight Risk Assessment</h3>
                <p className="text-gray-600">{results.overweightRisk}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Body Composition</h3>
                <canvas ref={compositionPieChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">BMI</th>
                      <th className="p-2">Body Fat %</th>
                      <th className="p-2">Health Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarios.map((s) => (
                      <tr key={s.name}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.bmi}</td>
                        <td className="p-2">{s.bodyFat}%</td>
                        <td className="p-2">{s.risk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Sensitivity Analysis</h3>
                <p className="text-gray-600">
                  BMI ranges from {results.sensitivity[0].bmi} at {results.sensitivity[0].weight}{" "}
                  {formData.units === "metric" ? "kg" : "lb"} to{" "}
                  {results.sensitivity[results.sensitivity.length - 1].bmi} at{" "}
                  {results.sensitivity[results.sensitivity.length - 1].weight}{" "}
                  {formData.units === "metric" ? "kg" : "lb"}. Body fat ranges from{" "}
                  {results.sensitivity[0].bodyFat}% to{" "}
                  {results.sensitivity[results.sensitivity.length - 1].bodyFat}%.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">BMI & Body Fat Trend</h3>
                <canvas ref={trendLineChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Scenario Comparison</h3>
                <canvas ref={metricsBarChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Health Risk Level</h3>
                <canvas ref={riskGaugeChartRef} className="max-h-80"></canvas>
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
                        <td className="p-2">{h.value}</td>
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
                <h2 className="text-xl font-semibold mb-4">Understanding Overweight Risks</h2>
                <p className="mb-4">
                  Being overweight (BMI 25–29.9) or obese (BMI ≥30) increases the risk of various health
                  conditions. Managing weight through diet and exercise can improve health outcomes.
                </p>
                <h3 className="text-md font-medium mb-2">Health Risks</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Type 2 Diabetes.</li>
                  <li>Hypertension (High Blood Pressure).</li>
                  <li>Heart Disease.</li>
                  <li>Joint Pain and Osteoarthritis.</li>
                  <li>Sleep Apnea.</li>
                </ul>
                <h3 className="text-md font-medium mb-2">Healthy Weight Tips</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Aim for a calorie deficit of 500–1000 kcal/day for weight loss.</li>
                  <li>Exercise 150–300 minutes/week (e.g., brisk walking, strength training).</li>
                  <li>Eat a balanced diet rich in fruits, vegetables, and lean proteins.</li>
                  <li>Consult a dietitian or doctor for personalized plans.</li>
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
                      href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      WHO Obesity Facts
                    </a>
                  </li>
                  <li>Local healthcare providers.</li>
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
