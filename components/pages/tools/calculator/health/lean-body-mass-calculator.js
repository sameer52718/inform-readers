"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [formData, setFormData] = useState({
    gender: "female",
    age: 30,
    unitSystem: "imperial",
    weight: 150,
    height: 167.6,
    heightFeet: 5,
    heightInches: 6,
    bodyFat: "",
    formula: "boer",
    activityLevel: "1.55",
    waist: "",
    neck: "",
    hip: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showBodyFatModal, setShowBodyFatModal] = useState(false);
  const [results, setResults] = useState({});
  const [lbmHistory, setLbmHistory] = useState([]);
  const compositionPieChartRef = useRef(null);
  const formulaBarChartRef = useRef(null);
  const progressGaugeRef = useRef(null);
  let compositionPieChartInstance = useRef(null);
  let formulaBarChartInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("lbmHistory")) || [];
    setLbmHistory(savedHistory);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "age",
        "weight",
        "height",
        "heightFeet",
        "heightInches",
        "bodyFat",
        "waist",
        "neck",
        "hip",
      ].includes(name)
        ? parseFloat(value) || ""
        : value,
    }));
  };

  const updateInputFields = () => {
    setErrorMessage("");
    const { unitSystem } = formData;
    if (unitSystem === "metric") {
      setFormData((prev) => ({ ...prev, weight: 68.0388, height: 167.6 }));
    } else {
      setFormData((prev) => ({ ...prev, weight: 150, heightFeet: 5, heightInches: 6 }));
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
      const weightKg = weight * 0.453592;
      const heightCm = (heightFeet * 12 + heightInches) * 2.54;
      setFormData((prev) => ({
        ...prev,
        unitSystem: "metric",
        weight: weightKg.toFixed(4),
        height: heightCm.toFixed(1),
      }));
    } else {
      if (isNaN(weight) || isNaN(height)) {
        setErrorMessage("Please provide valid weight and height.");
        return;
      }
      const weightLb = weight / 0.453592;
      const heightIn = height / 2.54;
      const feet = Math.floor(heightIn / 12);
      const inches = (heightIn % 12).toFixed(1);
      setFormData((prev) => ({
        ...prev,
        unitSystem: "imperial",
        weight: weightLb.toFixed(2),
        heightFeet: feet,
        heightInches: inches,
      }));
    }
  };

  const calculateBodyFat = () => {
    const { gender, waist, neck, hip, unitSystem, height, heightFeet, heightInches } = formData;
    const heightCm =
      unitSystem === "metric"
        ? parseFloat(height)
        : (parseFloat(heightFeet) * 12 + parseFloat(heightInches)) * 2.54;

    if (
      isNaN(waist) ||
      isNaN(neck) ||
      waist <= 0 ||
      neck <= 0 ||
      (gender === "female" && (isNaN(hip) || hip <= 0))
    ) {
      setErrorMessage("Please enter valid measurements.");
      return;
    }

    const heightIn = heightCm / 2.54;
    let bodyFat;
    if (gender === "male") {
      bodyFat = 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(heightIn) + 36.76;
    } else {
      bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(heightIn) - 78.387;
    }
    bodyFat = Math.max(0, Math.min(100, Number(bodyFat.toFixed(1))));

    setFormData((prev) => ({ ...prev, bodyFat }));
    setShowBodyFatModal(false);
    setSuccessMessage(`Body fat estimated at ${bodyFat}%.`);
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const calculateLBMValue = (weightKg, heightCm, gender, formula, bodyFat) => {
    let lbm;
    if (formula === "boer") {
      lbm =
        gender === "male"
          ? 0.407 * weightKg + 0.267 * heightCm - 19.2
          : 0.252 * weightKg + 0.473 * heightCm - 48.3;
    } else if (formula === "hume") {
      lbm =
        gender === "male"
          ? 0.3281 * weightKg + 0.33929 * heightCm - 29.5336
          : 0.29569 * weightKg + 0.41813 * heightCm - 43.2933;
    } else {
      if (!bodyFat) return null;
      lbm = weightKg * (1 - bodyFat / 100);
    }
    return Number(lbm.toFixed(1));
  };

  const calculateBMR = (lbm, heightCm, age, gender) => {
    const bmr = 10 * lbm + 6.25 * heightCm - 5 * age + (gender === "male" ? 5 : -161);
    return Math.round(bmr);
  };

  const calculateTDEE = (bmr, activityLevel) => Math.round(bmr * activityLevel);

  const getHealthInsights = (lbm, bodyFat, gender, weightKg) => {
    let insights = `Your lean body mass is ${((lbm / weightKg) * 100).toFixed(
      1
    )}% of your total weight, indicating your muscle and essential tissue mass. `;
    if (bodyFat) {
      const healthyRange = gender === "male" ? [8, 20] : [21, 33];
      if (bodyFat < healthyRange[0]) {
        insights += `Your body fat (${bodyFat}%) is below the healthy range (${healthyRange[0]}–${healthyRange[1]}%). Consider consulting a doctor to ensure adequate fat for health.`;
      } else if (bodyFat <= healthyRange[1]) {
        insights += `Your body fat (${bodyFat}%) is within the healthy range (${healthyRange[0]}–${healthyRange[1]}%), supporting overall health.`;
      } else {
        insights += `Your body fat (${bodyFat}%) is above the healthy range (${healthyRange[0]}–${healthyRange[1]}%). Gradual fat loss through diet and exercise may improve health.`;
      }
      if (gender === "female") {
        insights += ` For women, maintaining healthy body fat supports hormonal balance and reproductive health.`;
      }
    }
    insights += ` To support muscle growth, aim for 1.6–2.2 g of protein per kg of LBM daily (${(
      lbm * 1.6
    ).toFixed(1)}–${(lbm * 2.2).toFixed(1)} g).`;
    return insights;
  };

  const drawProgressGauge = (progress) => {
    const canvas = progressGaugeRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = 200;
    const height = 100;
    canvas.width = width;
    canvas.height = height;
    const centerX = width / 2;
    const centerY = height;
    const radius = 80;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#e5e7eb";
    ctx.stroke();

    const progressAngle = startAngle + (progress / 100) * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, progressAngle);
    ctx.strokeStyle = "#10b981";
    ctx.stroke();

    ctx.font = "16px Arial";
    ctx.fillStyle = "#1f2937";
    ctx.textAlign = "center";
    ctx.fillText(`${progress.toFixed(0)}%`, centerX, centerY - 10);
  };

  const calculateLBM = () => {
    setErrorMessage("");
    const {
      gender,
      age,
      unitSystem,
      formula,
      bodyFat,
      activityLevel,
      weight,
      height,
      heightFeet,
      heightInches,
    } = formData;
    let weightKg, heightCm, heightDisplay;

    if (unitSystem === "metric") {
      weightKg = parseFloat(weight);
      heightCm = parseFloat(height);
      heightDisplay = `${height} cm`;
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
      if (isNaN(weight) || isNaN(heightFeet) || isNaN(heightInches) || weight <= 0 || heightCm <= 0) {
        setErrorMessage("Please provide valid weight and height.");
        return;
      }
      if (
        weight < 2 ||
        weight > 1360 ||
        heightCm < 61 ||
        heightCm > 274 ||
        heightInches < 0 ||
        heightInches >= 12
      ) {
        setErrorMessage("Please enter realistic values: Weight (2–1360 lb), Height (24–108 in, 0–11.9 in).");
        return;
      }
    }
    if (age < 18 || age > 100) {
      setErrorMessage("Please enter a valid age (18–100 years).");
      return;
    }
    if (formula === "body-fat" && !bodyFat) {
      setErrorMessage("Please provide body fat percentage or use the calculator.");
      return;
    }
    if (bodyFat && (bodyFat < 0 || bodyFat > 100)) {
      setErrorMessage("Body fat percentage must be between 0 and 100.");
      return;
    }

    const lbm = calculateLBMValue(weightKg, heightCm, gender, formula, bodyFat);
    if (!lbm || lbm < 10 || lbm > weightKg) {
      setErrorMessage("Calculated LBM is out of range. Please check your inputs.");
      return;
    }

    const lbmLb = lbm / 0.453592;
    const fatMassKg = weightKg - lbm;
    const fatMassLb = fatMassKg / 0.453592;
    const bodyFatPercent = bodyFat || ((fatMassKg / weightKg) * 100).toFixed(1);
    const bmr = calculateBMR(lbm, heightCm, age, gender);
    const tdee = calculateTDEE(bmr, parseFloat(activityLevel));
    const healthInsights = getHealthInsights(lbm, bodyFatPercent, gender, weightKg);

    const lbmDisplay = unitSystem === "metric" ? `${lbm} kg` : `${lbmLb.toFixed(1)} lb`;
    const fatMassDisplay =
      unitSystem === "metric" ? `${fatMassKg.toFixed(1)} kg` : `${fatMassLb.toFixed(1)} lb`;
    const calcDetails =
      formula === "boer"
        ? `Boer (${gender}): ${gender === "male" ? "0.407" : "0.252"} × ${weightKg.toFixed(2)} kg + ${
            gender === "male" ? "0.267" : "0.473"
          } × ${heightCm.toFixed(1)} cm − ${gender === "male" ? "19.2" : "48.3"} = ${lbm} kg`
        : formula === "hume"
        ? `Hume (${gender}): ${gender === "male" ? "0.32810" : "0.29569"} × ${weightKg.toFixed(2)} kg + ${
            gender === "male" ? "0.33929" : "0.41813"
          } × ${heightCm.toFixed(1)} cm − ${gender === "male" ? "29.5336" : "43.2933"} = ${lbm} kg`
        : `Body Fat %: ${weightKg.toFixed(2)} kg × (1 − ${bodyFat} / 100) = ${lbm} kg`;

    setResults({
      lbm: lbmDisplay,
      bodyFat: `${bodyFatPercent}%`,
      fatMass: fatMassDisplay,
      bmr: `${bmr} kcal/day`,
      tdee: `${tdee} kcal/day`,
      healthInsights,
      calculationDetails: `${calcDetails}; Fat Mass: ${weightKg.toFixed(2)} − ${lbm} = ${fatMassKg.toFixed(
        1
      )} kg; BMR: (10 × ${lbm}) + (6.25 × ${heightCm.toFixed(1)}) − (5 × ${age}) + ${
        gender === "male" ? "5" : "−161"
      } = ${bmr} kcal/day; TDEE: ${bmr} × ${activityLevel} = ${tdee} kcal/day`,
      progress: ((lbm / weightKg) * 100).toFixed(1),
      progressText: `Your LBM is ${((lbm / weightKg) * 100).toFixed(1)}% of your total weight.`,
    });

    const measurement = {
      date: new Date().toLocaleString(),
      gender,
      lbm: lbmDisplay,
      bodyFat: bodyFatPercent,
      weight: `${weight} ${unitSystem === "metric" ? "kg" : "lb"}`,
      height: heightDisplay,
      unitSystem,
    };
    const newHistory = [...lbmHistory, measurement];
    setLbmHistory(newHistory);
    localStorage.setItem("lbmHistory", JSON.stringify(newHistory));
    setShowResults(true);

    drawProgressGauge((lbm / weightKg) * 100);

    if (compositionPieChartInstance.current) compositionPieChartInstance.current.destroy();
    compositionPieChartInstance.current = new Chart(compositionPieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Lean Body Mass", "Fat Mass"],
        datasets: [
          {
            data: unitSystem === "metric" ? [lbm, fatMassKg] : [lbmLb, fatMassLb],
            backgroundColor: ["#10b981", "#f59e0b"],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: `Body Composition (${unitSystem === "metric" ? "kg" : "lb"})` },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.label}: ${context.raw.toFixed(1)} ${unitSystem === "metric" ? "kg" : "lb"}`,
            },
          },
        },
      },
    });

    if (formulaBarChartInstance.current) formulaBarChartInstance.current.destroy();
    const boerLBM = calculateLBMValue(weightKg, heightCm, gender, "boer");
    const humeLBM = calculateLBMValue(weightKg, heightCm, gender, "hume");
    const bodyFatLBM = bodyFat ? calculateLBMValue(weightKg, heightCm, gender, "body-fat", bodyFat) : null;
    formulaBarChartInstance.current = new Chart(formulaBarChartRef.current, {
      type: "bar",
      data: {
        labels: bodyFat ? ["Boer", "Hume", "Body Fat %"] : ["Boer", "Hume"],
        datasets: [
          {
            label: `LBM (${unitSystem === "metric" ? "kg" : "lb"})`,
            data: bodyFat
              ? unitSystem === "metric"
                ? [boerLBM, humeLBM, bodyFatLBM]
                : [boerLBM / 0.453592, humeLBM / 0.453592, bodyFatLBM / 0.453592]
              : unitSystem === "metric"
              ? [boerLBM, humeLBM]
              : [boerLBM / 0.453592, humeLBM / 0.453592],
            backgroundColor: bodyFat ? ["#3b82f6", "#10b981", "#f59e0b"] : ["#3b82f6", "#10b981"],
            borderColor: bodyFat ? ["#1e3a8a", "#065f46", "#b45309"] : ["#1e3a8a", "#065f46"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: unitSystem === "metric" ? "LBM (kg)" : "LBM (lb)" },
          },
        },
        plugins: {
          legend: { display: false },
          title: { display: true, text: "LBM by Formula" },
        },
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
    if (lbmHistory.length === 0) {
      setErrorMessage("No saved measurements found.");
      return;
    }
    setShowResults(true);
  };

  const exportResults = () => {
    const { lbm, bodyFat, fatMass, bmr, tdee, healthInsights, calculationDetails } = results;
    const { gender, age, unitSystem, formula, weight, height, heightFeet, heightInches } = formData;
    const heightDisplay = unitSystem === "metric" ? `${height} cm` : `${heightFeet} ft ${heightInches} in`;

    const exportContent = `
Advanced Lean Body Mass Calculator Results
======================================
Gender: ${gender}
Age: ${age || "N/A"}
Formula: ${formula === "boer" ? "Boer" : formula === "hume" ? "Hume" : "Body Fat %"}

Results:
- Lean Body Mass: ${lbm || "N/A"}
- Body Fat %: ${bodyFat || "N/A"}
- Fat Mass: ${fatMass || "N/A"}
- BMR at LBM: ${bmr || "N/A"}
- TDEE: ${tdee || "N/A"}

Health Insights:
${healthInsights || "N/A"}

Calculation Details:
${calculationDetails || "N/A"}

Measurement Details:
- Weight: ${weight} ${unitSystem === "metric" ? "kg" : "lb"}
- Height: ${heightDisplay}${unitSystem === "metric" ? " cm" : ""}

Measurement History:
${lbmHistory
  .map(
    (h) =>
      `Date: ${h.date}, Gender: ${h.gender}, LBM: ${h.lbm}, Body Fat %: ${h.bodyFat}%, Weight: ${h.weight}, Height: ${h.height}`
  )
  .join("\n")}
======================================
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lbm_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-5xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Advanced Lean Body Mass Calculator</h1>
          </div>
          {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-sm mt-1">{successMessage}</div>}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Enter Your Details</h2>
            <p className="text-sm text-gray-600 mb-4">
              Calculate your Lean Body Mass (LBM) with personalized health insights and muscle gain planning.
              Use the body fat calculator for accurate results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Gender",
                  name: "gender",
                  type: "select",
                  options: ["female", "male"],
                  tooltip: "Gender affects LBM due to differences in muscle mass.",
                },
                {
                  label: "Age (years, optional)",
                  name: "age",
                  type: "number",
                  min: 18,
                  max: 100,
                  value: formData.age,
                  tooltip: "Age provides context for calorie estimates and health insights.",
                },
                {
                  label: "Unit System",
                  name: "unitSystem",
                  type: "select",
                  options: ["metric", "imperial"],
                  tooltip: "Choose metric (kg, cm) or imperial (lb, ft/in).",
                  onChange: () => updateInputFields(),
                },
              ].map(({ label, name, type, options, min, max, value, tooltip, onChange }) => (
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
                      value={formData[name]}
                      onChange={(e) => {
                        handleInputChange(e);
                        if (onChange) onChange();
                      }}
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === "metric"
                            ? "Metric (kg, cm)"
                            : opt === "imperial"
                            ? "Imperial (lb, ft/in)"
                            : opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={value}
                      onChange={handleInputChange}
                      min={min}
                      max={max}
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Weight ({formData.unitSystem === "metric" ? "kg" : "lb"})
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step={formData.unitSystem === "metric" ? "0.0001" : "0.01"}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  required
                />
              </div>
              {formData.unitSystem === "metric" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    step="0.1"
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    required
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Height (ft)</label>
                    <input
                      type="number"
                      name="heightFeet"
                      value={formData.heightFeet}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Height (in)</label>
                    <input
                      type="number"
                      name="heightInches"
                      value={formData.heightInches}
                      onChange={handleInputChange}
                      step="0.1"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Body Fat % (optional)
                  <span className="tooltip ml-1">
                    ?
                    <span className="tooltiptext">
                      Enter body fat % or use the calculator to estimate it.
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  name="bodyFat"
                  value={formData.bodyFat}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                />
                <button
                  onClick={() => setShowBodyFatModal(true)}
                  className="text-sm text-red-500 mt-1 hover:underline"
                >
                  Calculate Body Fat
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Formula
                  <span className="tooltip ml-1">
                    ?
                    <span className="tooltiptext">
                      Boer is standard; Hume and Body Fat % are alternatives.
                    </span>
                  </span>
                </label>
                <select
                  name="formula"
                  value={formData.formula}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                >
                  {["boer", "hume", "body-fat"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "boer" ? "Boer (Recommended)" : opt === "hume" ? "Hume" : "Body Fat %"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Activity Level
                  <span className="tooltip ml-1">
                    ?<span className="tooltiptext">Used to estimate daily calorie needs at LBM.</span>
                  </span>
                </label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                >
                  {[
                    { value: "1.2", label: "Sedentary" },
                    { value: "1.375", label: "Lightly Active" },
                    { value: "1.55", label: "Moderately Active" },
                    { value: "1.725", label: "Very Active" },
                    { value: "1.9", label: "Extremely Active" },
                  ].map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
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
          {showBodyFatModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-100 p-6 rounded-lg max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Body Fat Calculator (US Navy Method)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter measurements in cm to estimate body fat percentage.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Waist (cm)</label>
                    <input
                      type="number"
                      name="waist"
                      value={formData.waist}
                      onChange={handleInputChange}
                      step="0.1"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Neck (cm)</label>
                    <input
                      type="number"
                      name="neck"
                      value={formData.neck}
                      onChange={handleInputChange}
                      step="0.1"
                      className="w-full p-3 border rounded-lg bg-white text-gray-900"
                    />
                  </div>
                  {formData.gender === "female" && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-2">Hip (cm)</label>
                      <input
                        type="number"
                        name="hip"
                        value={formData.hip}
                        onChange={handleInputChange}
                        step="0.1"
                        className="w-full p-3 border rounded-lg bg-white text-gray-900"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={calculateBodyFat}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Calculate
                  </button>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, waist: "", neck: "", hip: "" }));
                      setShowBodyFatModal(false);
                    }}
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
              onClick={calculateLBM}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate LBM
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
                  { label: "Lean Body Mass", key: "lbm" },
                  { label: "Body Fat %", key: "bodyFat" },
                  { label: "Fat Mass", key: "fatMass" },
                  { label: "BMR at LBM", key: "bmr" },
                  { label: "TDEE", key: "tdee" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <h3 className="text-lg font-medium text-gray-900">{label}</h3>
                    <p className="text-2xl font-bold text-gray-800">{results[key]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Health Insights</h3>
                <p className="text-gray-600">{results.healthInsights}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">LBM Progress</h3>
                <div className="progress-gauge mx-auto">
                  <canvas ref={progressGaugeRef}></canvas>
                </div>
                <p className="text-gray-600 text-center">{results.progressText}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Body Composition</h3>
                <canvas ref={compositionPieChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Formula Comparison</h3>
                <canvas ref={formulaBarChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Calculation Details</h3>
                <p className="text-gray-600">{results.calculationDetails}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Measurement History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">Date</th>
                        <th className="p-2">Gender</th>
                        <th className="p-2">LBM</th>
                        <th className="p-2">Body Fat %</th>
                        <th className="p-2">Weight</th>
                        <th className="p-2">Height</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lbmHistory.map((row, i) => (
                        <tr key={i}>
                          <td className="p-2">{row.date}</td>
                          <td className="p-2">{row.gender}</td>
                          <td className="p-2">{row.lbm}</td>
                          <td className="p-2">{row.bodyFat}%</td>
                          <td className="p-2">{row.weight}</td>
                          <td className="p-2">{row.height}</td>
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
            .progress-gauge {
              width: 200px;
              height: 100px;
              position: relative;
              margin: 20px auto;
            }
            .progress-gauge canvas {
              width: 100%;
              height: 100%;
            }
            .flex-wrap {
              flex-direction: row;
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
      </div>
    </>
  );
}
