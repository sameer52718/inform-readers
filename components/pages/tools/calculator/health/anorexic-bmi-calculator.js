"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";

export default function AdvancedAnorexicBMICalculator() {
  const [units, setUnits] = useState("metric");
  const [weight, setWeight] = useState("50");
  const [height, setHeight] = useState("165");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [healthGoal, setHealthGoal] = useState("weight-gain");
  const [monitoringFrequency, setMonitoringFrequency] = useState("weekly");
  const [calorieTarget, setCalorieTarget] = useState("1800");
  const [targetBMI, setTargetBMI] = useState("18.5");
  const [healthConditions, setHealthConditions] = useState([]);
  const [scenarios, setScenarios] = useState([{ id: 1, weight: "50", goal: "weight-gain" }]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bmiHistory, setBmiHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bmiLineChartRef = useRef(null);
  const bmiBarChartRef = useRef(null);
  const bmiGaugeChartRef = useRef(null);
  const bmiLineChartInstance = useRef(null);
  const bmiBarChartInstance = useRef(null);
  const bmiGaugeChartInstance = useRef(null);

  const bmiClassification = [
    { min: 0, max: 15, status: "Severe Thinness", risk: "High Anorexia Risk" },
    { min: 15, max: 16, status: "Moderate Thinness", risk: "Potential Anorexia Risk" },
    { min: 16, max: 17, status: "Mild Thinness", risk: "Potential Anorexia Risk" },
    { min: 17, max: 18.5, status: "Underweight", risk: "Monitor" },
    { min: 18.5, max: 25, status: "Normal", risk: "None" },
    { min: 25, max: 30, status: "Overweight", risk: "None" },
    { min: 30, max: Infinity, status: "Obese", risk: "None" },
  ];

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
    setBmiHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (results && bmiHistory.length > 0) {
      updateCharts();
    }
  }, [results, bmiHistory]);

  const calculateBMI = (weight, height, units) => {
    if (units === "metric") {
      return (weight / (height / 100) ** 2).toFixed(1);
    } else {
      return ((703 * weight) / height ** 2).toFixed(1);
    }
  };

  const getBMIClassification = (bmi) => {
    return (
      bmiClassification.find((cls) => bmi >= cls.min && bmi < cls.max) || {
        status: "Unknown",
        risk: "Unknown",
      }
    );
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
    const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 };
    return (bmr * factors[activityLevel]).toFixed(0);
  };

  const calculateHealthyWeightRange = (height, units) => {
    const heightM = units === "metric" ? height / 100 : height * 0.0254;
    const minWeight = (18.5 * heightM * heightM).toFixed(1);
    const maxWeight = (24.9 * heightM * heightM).toFixed(1);
    return units === "metric"
      ? { min: minWeight, max: maxWeight, unit: "kg" }
      : { min: (minWeight * 2.20462).toFixed(1), max: (maxWeight * 2.20462).toFixed(1), unit: "lb" };
  };

  const convertUnits = () => {
    setError("");
    const newUnits = units === "metric" ? "imperial" : "metric";
    setUnits(newUnits);
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
  };

  const addScenario = () => {
    if (scenarios.length >= 3) {
      setError("Maximum 3 scenarios allowed.");
      return;
    }
    setScenarios([...scenarios, { id: scenarios.length + 1, weight: "50", goal: "weight-gain" }]);
  };

  const updateScenario = (id, field, value) => {
    setScenarios(scenarios.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const calculate = () => {
    setError("");
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const ct = parseInt(calorieTarget);
    const tb = parseFloat(targetBMI);

    if ([w, h, a, ct, tb].some((val) => isNaN(val))) {
      setError("Please provide valid inputs.");
      return;
    }
    if (w <= 0 || h <= 0 || a <= 0 || ct < 0 || tb < 0 || tb > 50) {
      setError("Invalid input values (e.g., negative or out-of-range).");
      return;
    }

    const bmi = calculateBMI(w, h, units);
    const classification = getBMIClassification(bmi);
    const bmr = calculateBMR(w, h, a, gender, units);
    const tdee = calculateTDEE(bmr, activityLevel);
    const healthyWeight = calculateHealthyWeightRange(h, units);
    const calorieAdjustment = healthGoal === "weight-gain" ? parseInt(tdee) + 500 : parseInt(tdee);
    const anorexiaRisk = classification.risk.includes("Anorexia")
      ? `Warning: BMI ${bmi} indicates ${classification.risk}. Consult a healthcare professional immediately.`
      : `BMI ${bmi} is ${classification.status}. Monitor health regularly.`;

    let recommendations = "";
    if (bmi < 17.5) {
      recommendations = `Your BMI indicates a potential risk of anorexia nervosa. Seek professional help immediately (e.g., NEDA Helpline: 1-800-931-2237). Consider a calorie surplus of 500 kcal/day to reach a healthy BMI (${
        tb || 18.5
      }). Monitor ${monitoringFrequency}.`;
    } else if (bmi < tb) {
      recommendations = `To reach a BMI of ${tb}, aim for a calorie surplus of 500 kcal/day and monitor ${monitoringFrequency}. Consult a dietitian for a balanced plan.`;
    } else {
      recommendations = `Maintain your current health with ${calorieAdjustment} kcal/day and monitor ${monitoringFrequency}.`;
    }
    if (healthConditions.length > 0) {
      recommendations += ` Note: Symptoms (${healthConditions.join(
        ", "
      )}) may indicate health concerns. Consult a doctor.`;
    }

    const sensitivity = [];
    for (let sw = w * 0.9; sw <= w * 1.1; sw += w * 0.1) {
      const sBMI = calculateBMI(sw, h, units);
      sensitivity.push({ weight: sw.toFixed(1), bmi: sBMI });
    }

    const scenarioResults = scenarios
      .map((s, i) => {
        const sWeight = parseFloat(s.weight);
        if (!isNaN(sWeight)) {
          const sBMI = calculateBMI(sWeight, h, units);
          const sClassification = getBMIClassification(sBMI);
          return {
            name: `Scenario ${i + 1}`,
            bmi: sBMI,
            status: sClassification.status,
            risk: sClassification.risk,
          };
        }
        return null;
      })
      .filter((s) => s);

    const newHistory = [...bmiHistory, { date: new Date().toLocaleString(), keyMetric: "BMI", value: bmi }];
    setBmiHistory(newHistory);
    localStorage.setItem("bmiHistory", JSON.stringify(newHistory));

    setResults({
      bmi,
      weightStatus: classification.status,
      bmr: `${bmr} kcal`,
      tdee: `${tdee} kcal`,
      healthyWeight: `${healthyWeight.min}–${healthyWeight.max} ${healthyWeight.unit}`,
      calorieAdjustment: `${calorieAdjustment} kcal`,
      anorexiaRisk,
      scenarios: scenarioResults,
      sensitivity,
      recommendations,
    });
  };

  const saveCalculation = () => {
    if (results) {
      setSuccess("Calculation saved to history!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("No valid calculation to save.");
    }
  };

  const updateCharts = () => {
    if (bmiLineChartInstance.current) bmiLineChartInstance.current.destroy();
    if (bmiBarChartInstance.current) bmiBarChartInstance.current.destroy();
    if (bmiGaugeChartInstance.current) bmiGaugeChartInstance.current.destroy();

    bmiLineChartInstance.current = new Chart(bmiLineChartRef.current, {
      type: "line",
      data: {
        labels: bmiHistory.map((h) => h.date),
        datasets: [
          {
            label: "BMI",
            data: bmiHistory.map((h) => parseFloat(h.value)),
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
          y: { title: { display: true, text: "BMI" }, min: 0 },
        },
        plugins: { title: { display: true, text: "BMI Trend Over Time" } },
      },
    });

    bmiBarChartInstance.current = new Chart(bmiBarChartRef.current, {
      type: "bar",
      data: {
        labels: results.scenarios.map((s) => s.name),
        datasets: [
          {
            label: "BMI",
            data: results.scenarios.map((s) => s.bmi),
            backgroundColor: "#ef4444",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { title: { display: true, text: "BMI" }, min: 0 } },
        plugins: { title: { display: true, text: "Scenario BMI Comparison" } },
      },
    });

    bmiGaugeChartInstance.current = new Chart(bmiGaugeChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["BMI", "Remaining"],
        datasets: [
          {
            data: [Math.min(parseFloat(results.bmi), 30), Math.max(30 - parseFloat(results.bmi), 0)],
            backgroundColor: [
              parseFloat(results.bmi) < 17.5
                ? "#ef4444"
                : parseFloat(results.bmi) < 18.5
                ? "#f59e0b"
                : "#10b981",
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
        plugins: { title: { display: true, text: "BMI Risk Level" }, legend: { display: false } },
      },
    });
  };

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Key Metric", "Value"],
      ...bmiHistory.map((h) => [h.date, h.keyMetric, h.value]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bmi_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Advanced Anorexic BMI Calculator Results", 10, 10);
    doc.setFontSize(12);
    doc.text("Calculation History:", 10, 20);
    let y = 30;
    bmiHistory.forEach((h) => {
      doc.text(`Date: ${h.date}, ${h.keyMetric}: ${h.value}`, 10, y);
      y += 10;
    });
    doc.text(
      "Note: Visual charts (Line, Bar, Gauge) and recommendations are available in the web interface.",
      10,
      y
    );
    doc.text(
      "Warning: BMI < 17.5 may indicate anorexia risk. Consult a healthcare professional.",
      10,
      y + 10
    );
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y + 20);
    doc.save("bmi_results.pdf");
  };

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-6xl w-full">
          <h1 className="text-3xl font-bold text-red-700 mb-8">Advanced Anorexic BMI Calculator</h1>

          <div className="text-yellow-600 text-sm mb-4">
            <strong>Important:</strong> This calculator is a screening tool, not a diagnosis. BMI &lt; 17.5
            may indicate a risk of anorexia nervosa. Please consult a healthcare professional for a
            comprehensive evaluation.
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

          <h2 className="text-xl font-semibold text-red-700 mb-4">Personal & Health Details</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter details to calculate your BMI and assess anorexia risk.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Units{" "}
                <span className="tooltip inline-block cursor-pointer">
                  ?
                  <span className="tooltiptext absolute w-48 bg-gray-800 text-white text-center rounded-lg p-2 -top-12 left-1/2 -ml-24 opacity-0 transition-opacity">
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
                Weight{" "}
                <span className="tooltip inline-block cursor-pointer">
                  ?
                  <span className="tooltiptext absolute w-48 bg-gray-800 text-white text-center rounded-lg p-2 -top-12 left-1/2 -ml-24 opacity-0 transition-opacity">
                    Your body weight (kg or lb).
                  </span>
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
                Height{" "}
                <span className="tooltip inline-block cursor-pointer">
                  ?
                  <span className="tooltiptext absolute w-48 bg-gray-800 text-white text-center rounded-lg p-2 -top-12 left-1/2 -ml-24 opacity-0 transition-opacity">
                    Your height (cm or inch).
                  </span>
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
                Age{" "}
                <span className="tooltip inline-block cursor-pointer">
                  ?
                  <span className="tooltiptext absolute w-48 bg-gray-800 text-white text-center rounded-lg p-2 -top-12 left-1/2 -ml-24 opacity-0 transition-opacity">
                    Your age for BMR calculation.
                  </span>
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
                Gender{" "}
                <span className="tooltip inline-block cursor-pointer">
                  ?
                  <span className="tooltiptext absolute w-48 bg-gray-800 text-white text-center rounded-lg p-2 -top-12 left-1/2 -ml-24 opacity-0 transition-opacity">
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
                Activity Level{" "}
                <span className="tooltip inline-block cursor-pointer">
                  ?
                  <span className="tooltiptext absolute w-48 bg-gray-800 text-white text-center rounded-lg p-2 -top-12 left-1/2 -ml-24 opacity-0 transition-opacity">
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Health Goal{" "}
                <span className="tooltip inline-block cursor-pointer">
                  ?
                  <span className="tooltiptext absolute w-48 bg-gray-800 text-white text-center rounded-lg p-2 -top-12 left-1/2 -ml-24 opacity-0 transition-opacity">
                    Your primary health goal.
                  </span>
                </span>
              </label>
              <select
                value={healthGoal}
                onChange={(e) => setHealthGoal(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="weight-gain">Weight Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="monitor-risk">Monitor Anorexia Risk</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Monitoring Frequency{" "}
                <span className="tooltip inline-block cursor-pointer">
                  ?
                  <span className="tooltiptext absolute w-48 bg-gray-800 text-white text-center rounded-lg p-2 -top-12 left-1/2 -ml-24 opacity-0 transition-opacity">
                    How often you track BMI.
                  </span>
                </span>
              </label>
              <select
                value={monitoringFrequency}
                onChange={(e) => setMonitoringFrequency(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Daily Calorie Target{" "}
                <span className="tooltip inline-block cursor-pointer">
                  ?
                  <span className="tooltiptext absolute w-48 bg-gray-800 text-white text-center rounded-lg p-2 -top-12 left-1/2 -ml-24 opacity-0 transition-opacity">
                    Manual or TDEE-based calories (optional).
                  </span>
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
                Target BMI{" "}
                <span className="tooltip inline-block cursor-pointer">
                  ?
                  <span className="tooltiptext absolute w-48 bg-gray-800 text-white text-center rounded-lg p-2 -top-12 left-1/2 -ml-24 opacity-0 transition-opacity">
                    Desired BMI (e.g., 18.5 for healthy).
                  </span>
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={targetBMI}
                onChange={(e) => setTargetBMI(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Health Conditions{" "}
                <span className="tooltip inline-block cursor-pointer">
                  ?
                  <span className="tooltiptext absolute w-48 bg-gray-800 text-white text-center rounded-lg p-2 -top-12 left-1/2 -ml-24 opacity-0 transition-opacity">
                    Select symptoms (optional).
                  </span>
                </span>
              </label>
              <select
                multiple
                value={healthConditions}
                onChange={(e) =>
                  setHealthConditions(Array.from(e.target.selectedOptions).map((opt) => opt.value))
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="amenorrhea">Amenorrhea</option>
                <option value="fatigue">Fatigue</option>
                <option value="hair-loss">Hair Loss</option>
                <option value="cold-intolerance">Cold Intolerance</option>
              </select>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-red-700 mt-6 mb-4">Scenario Analysis</h2>
          {scenarios.map((s) => (
            <div key={s.id} className="border border-gray-300 p-4 mb-4 rounded-lg">
              <h3 className="text-md font-medium text-red-700 mb-2">Scenario {s.id}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={s.weight}
                    onChange={(e) => updateScenario(s.id, "weight", e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Health Goal</label>
                  <select
                    value={s.goal}
                    onChange={(e) => updateScenario(s.id, "goal", e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="weight-gain">Weight Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="monitor-risk">Monitor Anorexia Risk</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addScenario} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4">
            Add Scenario
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 ml-4"
          >
            Learn About Anorexia
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
              <h2 className="text-xl font-semibold text-red-700 mb-4">BMI & Health Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-md font-medium text-red-700">BMI</h3>
                  <p className="text-xl font-bold text-gray-800">{results.bmi}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-red-700">Weight Status</h3>
                  <p className="text-xl font-bold text-gray-800">{results.weightStatus}</p>
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
                  <h3 className="text-md font-medium text-red-700">Healthy Weight Range</h3>
                  <p className="text-xl font-bold text-gray-800">{results.healthyWeight}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-red-700">Recommended Calories</h3>
                  <p className="text-xl font-bold text-gray-800">{results.calorieAdjustment}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Anorexia Risk Assessment</h3>
                <p className="text-gray-600">{results.anorexiaRisk}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Scenario Comparison</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Scenario</th>
                      <th className="p-2">BMI</th>
                      <th className="p-2">Weight Status</th>
                      <th className="p-2">Anorexia Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarios.map((s) => (
                      <tr key={s.name}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.bmi}</td>
                        <td className="p-2">{s.status}</td>
                        <td className="p-2">{s.risk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Sensitivity Analysis</h3>
                <p className="text-gray-600">
                  BMI ranges from {results.sensitivity[0].bmi} at {results.sensitivity[0].weight}{" "}
                  {units === "metric" ? "kg" : "lb"} to{" "}
                  {results.sensitivity[results.sensitivity.length - 1].bmi} at{" "}
                  {results.sensitivity[results.sensitivity.length - 1].weight}{" "}
                  {units === "metric" ? "kg" : "lb"}.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">BMI Trend</h3>
                <canvas ref={bmiLineChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Scenario BMI Comparison</h3>
                <canvas ref={bmiBarChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">BMI Risk Level</h3>
                <canvas ref={bmiGaugeChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-red-700">Recommendations</h3>
                <p className="text-gray-600">{results.recommendations}</p>
              </div>
              <div className="mt-6 max-h-[300px] overflow-y-auto">
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
                    {bmiHistory.map((h, i) => (
                      <tr key={i}>
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

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
              <div className="bg-gray-100 p-5 rounded-lg max-w-[600px] w-[90%] relative">
                <span
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 right-4 text-2xl cursor-pointer"
                >
                  ×
                </span>
                <h2 className="text-xl font-semibold text-red-700 mb-4">Understanding Anorexia Nervosa</h2>
                <p className="mb-4 text-gray-600">
                  Anorexia nervosa is a serious eating disorder characterized by an intense fear of gaining
                  weight, a distorted body image, and extreme weight loss efforts. BMI below 17.5 may indicate
                  a risk, but diagnosis requires professional evaluation.
                </p>
                <h3 className="text-md font-medium text-red-700 mb-2">Symptoms</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Extreme weight loss or low BMI (&lt;17.5).</li>
                  <li>Intense fear of weight gain.</li>
                  <li>Distorted body image.</li>
                  <li>Amenorrhea (loss of menstrual periods).</li>
                  <li>Fatigue, hair loss, or cold intolerance.</li>
                </ul>
                <h3 className="text-md font-medium text-red-700 mb-2">Health Risks</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Heart complications.</li>
                  <li>Bone density loss.</li>
                  <li>Organ damage.</li>
                  <li>Infertility.</li>
                </ul>
                <h3 className="text-md font-medium text-red-700 mb-2">Resources</h3>
                <p className="mb-4 text-gray-600">Seek help from a healthcare professional. Contact:</p>
                <ul className="list-disc pl-5 mb-4 text-blue-500">
                  <li>
                    <a
                      href="https://www.nationaleatingdisorders.org"
                      target="_blank"
                      className="hover:underline"
                    >
                      National Eating Disorders Association (NEDA)
                    </a>
                  </li>
                  <li>NEDA Helpline: 1-800-931-2237</li>
                  <li>Local mental health services.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
