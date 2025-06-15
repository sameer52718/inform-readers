"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [formData, setFormData] = useState({
    gender: "female",
    age: 30,
    unitSystem: "imperial",
    height: 167.6,
    heightFeet: 5,
    heightInches: 6,
    frameSize: "medium",
    currentWeight: "",
    formula: "devine",
    activityLevel: "1.55",
    wristCircumference: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showFrameSizeModal, setShowFrameSizeModal] = useState(false);
  const [results, setResults] = useState({});
  const [idealWeightHistory, setIdealWeightHistory] = useState([]);
  const formulaBarChartRef = useRef(null);
  const bmiPieChartRef = useRef(null);
  const progressGaugeRef = useRef(null);
  let formulaBarChartInstance = useRef(null);
  let bmiPieChartInstance = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("idealWeightHistory")) || [];
    setIdealWeightHistory(savedHistory);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["age", "height", "heightFeet", "heightInches", "currentWeight", "wristCircumference"].includes(
        name
      )
        ? parseFloat(value) || ""
        : value,
    }));
  };

  const updateInputFields = () => {
    setErrorMessage("");
    const { unitSystem } = formData;
    if (unitSystem === "metric") {
      setFormData((prev) => ({ ...prev, height: 167.6, currentWeight: "" }));
    } else {
      setFormData((prev) => ({ ...prev, heightFeet: 5, heightInches: 6, currentWeight: "" }));
    }
  };

  const convertUnits = () => {
    setErrorMessage("");
    const { unitSystem, heightFeet, heightInches, height, currentWeight } = formData;
    if (unitSystem === "imperial") {
      if (isNaN(heightFeet) || isNaN(heightInches)) {
        setErrorMessage("Please provide valid height.");
        return;
      }
      const heightCm = (heightFeet * 12 + heightInches) * 2.54;
      const weightKg = currentWeight ? currentWeight * 0.453592 : "";
      setFormData((prev) => ({
        ...prev,
        unitSystem: "metric",
        height: heightCm.toFixed(1),
        currentWeight: weightKg ? weightKg.toFixed(4) : "",
      }));
    } else {
      if (isNaN(height)) {
        setErrorMessage("Please provide valid height.");
        return;
      }
      const heightIn = height / 2.54;
      const feet = Math.floor(heightIn / 12);
      const inches = (heightIn % 12).toFixed(1);
      const weightLb = currentWeight ? currentWeight / 0.453592 : "";
      setFormData((prev) => ({
        ...prev,
        unitSystem: "imperial",
        heightFeet: feet,
        heightInches: inches,
        currentWeight: weightLb ? weightLb.toFixed(2) : "",
      }));
    }
  };

  const calculateFrameSize = () => {
    const { wristCircumference, unitSystem, height, heightFeet, heightInches } = formData;
    const heightCm =
      unitSystem === "metric"
        ? parseFloat(height)
        : (parseFloat(heightFeet) * 12 + parseFloat(heightInches)) * 2.54;

    if (isNaN(wristCircumference) || wristCircumference <= 0) {
      setErrorMessage("Please enter a valid wrist circumference.");
      return;
    }

    let frameSize;
    if (heightCm < 155) {
      frameSize = wristCircumference < 15 ? "small" : wristCircumference < 16 ? "medium" : "large";
    } else if (heightCm < 165) {
      frameSize = wristCircumference < 15.5 ? "small" : wristCircumference < 16.5 ? "medium" : "large";
    } else {
      frameSize = wristCircumference < 16 ? "small" : wristCircumference < 17 ? "medium" : "large";
    }

    setFormData((prev) => ({ ...prev, frameSize, wristCircumference: "" }));
    setShowFrameSizeModal(false);
    setSuccessMessage(
      `Frame size set to ${
        frameSize.charAt(0).toUpperCase() + frameSize.slice(1)
      } based on wrist measurement.`
    );
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const calculateIdealWeightValue = (heightCm, gender, formula, frameSize) => {
    let idealKg;
    if (formula === "devine") {
      const baseKg = gender === "male" ? 50 : 45.5;
      const extraCm = Math.max(0, heightCm - 152.4);
      idealKg = baseKg + (2.3 * extraCm) / 2.54;
    } else if (formula === "hamwi") {
      const heightIn = heightCm / 2.54;
      const baseLb = gender === "male" ? 106 : 100;
      const extraIn = Math.max(0, heightIn - 60);
      const increment = gender === "male" ? 6 : 5;
      idealKg = (baseLb + extraIn * increment) * 0.453592;
    } else {
      const baseKg = gender === "male" ? 52 : 49;
      const extraCm = Math.max(0, heightCm - 152.4);
      const increment = gender === "male" ? 1.9 : 1.7;
      idealKg = baseKg + (increment * extraCm) / 2.54;
    }

    let rangeMin = idealKg;
    let rangeMax = idealKg;
    if (frameSize === "small") {
      rangeMin *= 0.9;
      rangeMax *= 0.95;
    } else if (frameSize === "large") {
      rangeMin *= 1.05;
      rangeMax *= 1.1;
    }

    return {
      ideal: Number(idealKg.toFixed(1)),
      range: [Number(rangeMin.toFixed(1)), Number(rangeMax.toFixed(1))],
    };
  };

  const calculateBMI = (weightKg, heightCm) => {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Number(bmi.toFixed(1));
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi <= 24.9) return "Healthy Weight";
    if (bmi <= 29.9) return "Overweight";
    return "Obese";
  };

  const calculateCalories = (weightKg, heightCm, age, gender, activityLevel) => {
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === "male" ? 5 : -161);
    return Math.round(bmr * activityLevel);
  };

  const getHealthInsights = (bmi, gender, currentWeightKg, idealWeightKg) => {
    const category = getBMICategory(bmi);
    const baseInsights = {
      Underweight: "May indicate insufficient body mass. Consult a dietitian to ensure adequate nutrition.",
      "Healthy Weight": "Supports overall health. Maintain with a balanced diet and regular exercise.",
      Overweight: "May increase health risks. Consider gradual weight loss through lifestyle changes.",
      Obese: "Higher risk for chronic diseases. Seek medical advice for weight management.",
    };
    const femaleInsights = {
      Underweight: `${baseInsights["Underweight"]} For women, this may affect reproductive health. Consult a doctor if planning pregnancy.`,
      "Healthy Weight": `${baseInsights["Healthy Weight"]} For women, this range supports fertility and hormonal balance.`,
      Overweight: `${baseInsights["Overweight"]} For women, excess weight may impact pregnancy or menopause. Consult a doctor.`,
      Obese: `${baseInsights["Obese"]} For women, this may increase pregnancy complications. Seek medical support.`,
    };
    let insight = gender === "female" ? femaleInsights[category] : baseInsights[category];

    if (currentWeightKg) {
      const diffKg = currentWeightKg - idealWeightKg;
      if (Math.abs(diffKg) > 2) {
        const action = diffKg > 0 ? "lose" : "gain";
        const weeklyKcal = diffKg > 0 ? -500 : 500;
        insight += ` Your current weight is ${Math.abs(diffKg.toFixed(1))} kg ${
          diffKg > 0 ? "above" : "below"
        } your ideal weight. To reach your ideal weight, aim to ${action} ~0.5 kg/week by adjusting your daily calories by ${weeklyKcal} kcal.`;
      } else {
        insight += " Your current weight is close to your ideal weight. Maintain with consistent habits.";
      }
    }

    return insight;
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

  const calculateIdealWeight = () => {
    setErrorMessage("");
    const {
      gender,
      age,
      unitSystem,
      formula,
      frameSize,
      activityLevel,
      height,
      heightFeet,
      heightInches,
      currentWeight,
    } = formData;
    let heightCm, heightDisplay;

    if (unitSystem === "metric") {
      heightCm = parseFloat(height);
      heightDisplay = `${heightCm} cm`;
      if (isNaN(heightCm) || heightCm <= 0) {
        setErrorMessage("Please provide valid height.");
        return;
      }
      if (heightCm < 61 || heightCm > 274) {
        setErrorMessage("Please enter realistic height (61–274 cm).");
        return;
      }
    } else {
      heightCm = (parseFloat(heightFeet) * 12 + parseFloat(heightInches)) * 2.54;
      heightDisplay = `${heightFeet} ft ${heightInches} in`;
      if (isNaN(heightFeet) || isNaN(heightInches) || heightCm <= 0) {
        setErrorMessage("Please provide valid height.");
        return;
      }
      if (heightCm < 61 || heightCm > 274 || heightInches < 0 || heightInches >= 12) {
        setErrorMessage("Please enter realistic height (24–108 in, 0–11.9 in).");
        return;
      }
    }
    if (currentWeight && (currentWeight < 1 || currentWeight > (unitSystem === "metric" ? 617 : 1360))) {
      setErrorMessage(`Please enter realistic weight (1–${unitSystem === "metric" ? "617 kg" : "1360 lb"}).`);
      return;
    }
    if (age < 18 || age > 100) {
      setErrorMessage("Please enter a valid age (18–100 years).");
      return;
    }

    const weightData = calculateIdealWeightValue(heightCm, gender, formula, frameSize);
    const idealWeightKg = weightData.ideal;
    const weightRangeKg = weightData.range;
    const idealWeightLb = idealWeightKg / 0.453592;
    const weightRangeLb = weightRangeKg.map((w) => w / 0.453592);
    const bmi = calculateBMI(idealWeightKg, heightCm);
    const calories = calculateCalories(idealWeightKg, heightCm, age, gender, parseFloat(activityLevel));
    const healthInsights = getHealthInsights(
      bmi,
      gender,
      currentWeight ? (unitSystem === "metric" ? currentWeight : currentWeight * 0.453592) : null,
      idealWeightKg
    );

    if (bmi < 10 || bmi > 60) {
      setErrorMessage("Calculated BMI is out of range. Please check your inputs.");
      return;
    }

    const weightDisplay =
      unitSystem === "metric"
        ? `${idealWeightKg} kg (Range: ${weightRangeKg[0]}–${weightRangeKg[1]} kg)`
        : `${idealWeightLb.toFixed(1)} lb (Range: ${weightRangeLb[0].toFixed(1)}–${weightRangeLb[1].toFixed(
            1
          )} lb)`;

    const calcDetails =
      formula === "devine"
        ? `Devine (${gender}): ${
            gender === "male" ? "50" : "45.5"
          } kg + 2.3 kg per cm over 152.4 cm = ${idealWeightKg} kg`
        : formula === "hamwi"
        ? `Hamwi (${gender}): ${gender === "male" ? "106" : "100"} lb for 5 ft + ${
            gender === "male" ? "6" : "5"
          } lb per inch over 5 ft = ${idealWeightLb.toFixed(1)} lb`
        : `Robinson (${gender}): ${gender === "male" ? "52" : "49"} kg + ${
            gender === "male" ? "1.9" : "1.7"
          } kg per cm over 152.4 cm = ${idealWeightKg} kg`;

    setResults({
      idealWeight: weightDisplay,
      bmi: `${bmi} (${getBMICategory(bmi)})`,
      calories: `${calories} kcal/day`,
      healthInsights,
      calculationDetails: `${calcDetails}; Frame Adjustment: ${frameSize}; BMI: ${idealWeightKg} kg / (${
        heightCm / 100
      } m)² = ${bmi}; Calories: Mifflin-St Jeor BMR × ${activityLevel} = ${calories} kcal/day`,
    });

    const measurement = {
      date: new Date().toLocaleString(),
      gender,
      idealWeight: weightDisplay,
      bmi,
      height: heightDisplay,
      frameSize,
      unitSystem,
    };
    const newHistory = [...idealWeightHistory, measurement];
    setIdealWeightHistory(newHistory);
    localStorage.setItem("idealWeightHistory", JSON.stringify(newHistory));
    setShowResults(true);

    const progress = currentWeight
      ? Math.min(
          100,
          Math.max(
            0,
            100 -
              (Math.abs(
                (unitSystem === "metric" ? currentWeight : currentWeight * 0.453592) - idealWeightKg
              ) /
                idealWeightKg) *
                100
          )
        )
      : 0;
    const progressText = currentWeight
      ? `Your weight is ${progress.toFixed(1)}% aligned with your ideal weight.`
      : "Enter current weight to see progress.";
    setResults((prev) => ({ ...prev, progress, progressText }));

    if (currentWeight) {
      drawProgressGauge(progress);
    } else {
      drawProgressGauge(0);
    }

    if (formulaBarChartInstance.current) formulaBarChartInstance.current.destroy();
    const devineWeight = calculateIdealWeightValue(heightCm, gender, "devine", frameSize).ideal;
    const hamwiWeight = calculateIdealWeightValue(heightCm, gender, "hamwi", frameSize).ideal;
    const robinsonWeight = calculateIdealWeightValue(heightCm, gender, "robinson", frameSize).ideal;
    formulaBarChartInstance.current = new Chart(formulaBarChartRef.current, {
      type: "bar",
      data: {
        labels: ["Devine", "Hamwi", "Robinson"],
        datasets: [
          {
            label: `Ideal Weight (${unitSystem === "metric" ? "kg" : "lb"})`,
            data:
              unitSystem === "metric"
                ? [devineWeight, hamwiWeight, robinsonWeight]
                : [devineWeight / 0.453592, hamwiWeight / 0.453592, robinsonWeight / 0.453592],
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
            borderColor: ["#1e3a8a", "#065f46", "#b45309"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: unitSystem === "metric" ? "Weight (kg)" : "Weight (lb)" },
          },
        },
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Ideal Weight by Formula" },
        },
      },
    });

    if (bmiPieChartInstance.current) bmiPieChartInstance.current.destroy();
    const categoryCounts = { Underweight: 0, "Healthy Weight": 0, Overweight: 0, Obese: 0 };
    newHistory.forEach((h) => categoryCounts[getBMICategory(h.bmi)]++);
    const total = newHistory.length;
    const pieData = Object.values(categoryCounts).map((count) =>
      total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0
    );
    bmiPieChartInstance.current = new Chart(bmiPieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Underweight", "Healthy Weight", "Overweight", "Obese"],
        datasets: [
          {
            data: pieData,
            backgroundColor: ["#ef4444", "#10b981", "#f59e0b", "#3b82f6"],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "BMI Category Distribution (%)" },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw}%`;
              },
            },
          },
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
    if (idealWeightHistory.length === 0) {
      setErrorMessage("No saved measurements found.");
      return;
    }
    setShowResults(true);
  };

  const exportResults = () => {
    const { idealWeight, bmi, calories, healthInsights, calculationDetails } = results;
    const { gender, age, unitSystem, formula, frameSize, height, heightFeet, heightInches } = formData;
    const heightDisplay = unitSystem === "metric" ? `${height} cm` : `${heightFeet} ft ${heightInches} in`;

    const exportContent = `
Advanced Ideal Weight Calculator Results
======================================
Gender: ${gender}
Age: ${age || "N/A"}
Formula: ${formula.charAt(0).toUpperCase() + formula.slice(1)}
Frame Size: ${frameSize.charAt(0).toUpperCase() + frameSize.slice(1)}

Results:
- Ideal Weight: ${idealWeight || "N/A"}
- BMI at Ideal Weight: ${bmi || "N/A"}
- Daily Calories: ${calories || "N/A"}

Health Insights:
${healthInsights || "N/A"}

Calculation Details:
${calculationDetails || "N/A"}

Measurement Details:
- Height: ${heightDisplay}

Measurement History:
${idealWeightHistory
  .map(
    (h) =>
      `Date: ${h.date}, Gender: ${h.gender}, Ideal Weight: ${h.idealWeight}, BMI: ${h.bmi}, Height: ${h.height}, Frame Size: ${h.frameSize}`
  )
  .join("\n")}
======================================
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ideal_weight_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-5xl w-full animate-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Advanced Ideal Weight Calculator</h1>
          </div>
          {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-sm mt-1">{successMessage}</div>}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Enter Your Details</h2>
            <p className="text-sm text-gray-600 mb-4">
              Calculate your ideal weight with personalized health insights and goal planning. Use the frame
              size calculator for accurate results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Gender",
                  name: "gender",
                  type: "select",
                  options: ["female", "male"],
                  tooltip: "Gender affects ideal weight due to differences in muscle and fat distribution.",
                },
                {
                  label: "Age (years, optional)",
                  name: "age",
                  type: "number",
                  min: 18,
                  max: 100,
                  value: formData.age,
                  tooltip: "Age provides context for health recommendations.",
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
                  Body Frame Size
                  <span className="tooltip ml-1">
                    ?
                    <span className="tooltiptext">
                      Frame size adjusts ideal weight range (small, medium, large).
                    </span>
                  </span>
                </label>
                <select
                  name="frameSize"
                  value={formData.frameSize}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  required
                >
                  {["small", "medium", "large"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowFrameSizeModal(true)}
                  className="text-sm text-red-500 mt-1 hover:underline"
                >
                  Calculate Frame Size
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Current Weight (optional)
                  <span className="tooltip ml-1">
                    ?<span className="tooltiptext">Enter current weight to compare with ideal weight.</span>
                  </span>
                </label>
                <input
                  type="number"
                  name="currentWeight"
                  value={formData.currentWeight}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder={formData.unitSystem === "metric" ? "e.g., 68.04 kg" : "e.g., 150 lb"}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Formula
                  <span className="tooltip ml-1">
                    ?
                    <span className="tooltiptext">
                      Devine is medically standard; Hamwi and Robinson are alternatives.
                    </span>
                  </span>
                </label>
                <select
                  name="formula"
                  value={formData.formula}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white text-gray-900"
                >
                  {["devine", "hamwi", "robinson"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)} {opt === "devine" ? "(Recommended)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Activity Level
                  <span className="tooltip ml-1">
                    ?
                    <span className="tooltiptext">Used to estimate daily calorie needs at ideal weight.</span>
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
          {showFrameSizeModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-100 p-6 rounded-lg max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Frame Size Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Measure wrist circumference (cm) to estimate frame size.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Wrist Circumference (cm)
                  </label>
                  <input
                    type="number"
                    name="wristCircumference"
                    value={formData.wristCircumference}
                    onChange={handleInputChange}
                    step="0.1"
                    className="w-full p-3 border rounded-lg bg-white text-gray-900"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={calculateFrameSize}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Calculate
                  </button>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, wristCircumference: "" }));
                      setShowFrameSizeModal(false);
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
              onClick={calculateIdealWeight}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Calculate Ideal Weight
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
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Ideal Weight</h3>
                  <p className="text-2xl font-bold text-gray-800">{results.idealWeight}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">BMI at Ideal Weight</h3>
                  <p className="text-2xl font-bold text-gray-800">{results.bmi}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Daily Calories</h3>
                  <p className="text-2xl font-bold text-gray-800">{results.calories}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Health Insights</h3>
                <p className="text-gray-600">{results.healthInsights}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Weight Progress</h3>
                <div className="progress-gauge mx-auto">
                  <canvas ref={progressGaugeRef}></canvas>
                </div>
                <p className="text-gray-600 text-center">{results.progressText}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Formula Comparison</h3>
                <canvas ref={formulaBarChartRef} className="max-h-80"></canvas>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">BMI Category Distribution</h3>
                <canvas ref={bmiPieChartRef} className="max-h-80"></canvas>
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
                        <th className="p-2">Ideal Weight</th>
                        <th className="p-2">BMI</th>
                        <th className="p-2">Height</th>
                        <th className="p-2">Frame Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {idealWeightHistory.map((row, i) => (
                        <tr key={i}>
                          <td className="p-2">{row.date}</td>
                          <td className="p-2">{row.gender}</td>
                          <td className="p-2">{row.idealWeight}</td>
                          <td className="p-2">{row.bmi}</td>
                          <td className="p-2">{row.height}</td>
                          <td className="p-2">{row.frameSize}</td>
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
