"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function BSACalculator() {
  const [unitSystem, setUnitSystem] = useState("imperial");
  const [gender, setGender] = useState("female");
  const [age, setAge] = useState("30");
  const [patientType, setPatientType] = useState("adult");
  const [weight, setWeight] = useState("150");
  const [heightMetric, setHeightMetric] = useState("");
  const [heightFeet, setHeightFeet] = useState("5");
  const [heightInches, setHeightInches] = useState("6");
  const [formula, setFormula] = useState("dubois");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState(null);
  const [bsaHistory, setBsaHistory] = useState([]);
  const [drugModalOpen, setDrugModalOpen] = useState(false);
  const [drug, setDrug] = useState("5fu");
  const [drugBsa, setDrugBsa] = useState("");
  const compositionPieChartRef = useRef(null);
  const formulaBarChartRef = useRef(null);
  const progressGaugeRef = useRef(null);
  const compositionPieChartInstance = useRef(null);
  const formulaBarChartInstance = useRef(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("bsaHistory") || "[]");
    setBsaHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (results && compositionPieChartRef.current && formulaBarChartRef.current && progressGaugeRef.current) {
      updateCharts();
      drawProgressGauge(((results.bsa / 1.73) * 100).toFixed(0));
    }
  }, [results, bsaHistory]);

  const calculateBSAValue = (weightKg, heightCm, formula) => {
    let bsa;
    if (formula === "dubois") {
      bsa = 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725);
    } else if (formula === "mosteller") {
      bsa = Math.sqrt((weightKg * heightCm) / 3600);
    } else if (formula === "haycock") {
      bsa = 0.024265 * Math.pow(weightKg, 0.5378) * Math.pow(heightCm, 0.3964);
    } else if (formula === "gehan") {
      bsa = 0.0235 * Math.pow(weightKg, 0.51456) * Math.pow(heightCm, 0.42246);
    }
    return Number(bsa.toFixed(2));
  };

  const calculateBMI = (weightKg, heightCm) => {
    const heightM = heightCm / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  const calculateEGFR = (weightKg, age, gender, bsa) => {
    const creatinine = 1;
    let egfr = ((140 - age) * weightKg) / (72 * creatinine);
    if (gender === "female") egfr *= 0.85;
    egfr = (egfr * 1.73) / bsa;
    return Math.round(egfr);
  };

  const getHealthInsights = (bsa, bmi, gender, age, patientType) => {
    let insights = `Your BSA is ${bsa} m², used for medical dosing and renal function estimation. `;
    if (patientType === "pediatric") {
      insights += `In pediatric patients, BSA guides accurate drug dosing. Mosteller formula is often preferred for children. `;
    } else {
      insights += `For adults, BSA typically ranges from 1.6–2.0 m². `;
      if (bsa < 1.6) insights += `Your BSA is below average, which may affect dosing calculations. `;
      else if (bsa > 2.0) insights += `Your BSA is above average, which may increase dosing requirements. `;
    }
    if (bmi) {
      if (bmi < 18.5)
        insights += `Your BMI (${bmi}) is underweight. Consult a healthcare provider for nutritional advice. `;
      else if (bmi <= 24.9) insights += `Your BMI (${bmi}) is normal, supporting overall health. `;
      else if (bmi <= 29.9)
        insights += `Your BMI (${bmi}) is overweight. Consider lifestyle changes to optimize health. `;
      else insights += `Your BMI (${bmi}) is obese. Consult a healthcare provider for weight management. `;
    }
    if (gender === "female" && age >= 18 && patientType === "adult") {
      insights += `For women, BSA can influence chemotherapy and hormonal drug dosing. `;
    }
    return insights;
  };

  const convertUnits = () => {
    setError("");
    const w = parseFloat(weight);
    if (unitSystem === "imperial") {
      const feet = parseFloat(heightFeet);
      const inches = parseFloat(heightInches);
      if (isNaN(w) || isNaN(feet) || isNaN(inches)) {
        setError("Please provide valid weight and height.");
        return;
      }
      const weightKg = w * 0.453592;
      const heightCm = (feet * 12 + inches) * 2.54;
      setUnitSystem("metric");
      setWeight(weightKg.toFixed(4));
      setHeightMetric(heightCm.toFixed(1));
    } else {
      const h = parseFloat(heightMetric);
      if (isNaN(w) || isNaN(h)) {
        setError("Please provide valid weight and height.");
        return;
      }
      const weightLb = w / 0.453592;
      const heightIn = h / 2.54;
      const feet = Math.floor(heightIn / 12);
      const inches = (heightIn % 12).toFixed(1);
      setUnitSystem("imperial");
      setWeight(weightLb.toFixed(2));
      setHeightFeet(feet);
      setHeightInches(inches);
    }
  };

  const calculateBSA = () => {
    setError("");
    const a = parseInt(age) || 30;
    const w = parseFloat(weight);
    let height, weightKg, heightCm, heightDisplay;

    if (unitSystem === "metric") {
      height = parseFloat(heightMetric);
      weightKg = w;
      heightCm = height;
      heightDisplay = `${height} cm`;
      if (isNaN(w) || isNaN(height) || w <= 0 || height <= 0) {
        setError("Please provide valid weight and height.");
        return;
      }
      const minWeight = patientType === "pediatric" ? 0.5 : 1;
      const maxWeight = patientType === "pediatric" ? 50 : 617;
      const minHeight = patientType === "pediatric" ? 30 : 61;
      const maxHeight = patientType === "pediatric" ? 150 : 274;
      if (w < minWeight || w > maxWeight || height < minHeight || height > maxHeight) {
        setError(
          `Please enter realistic values: Weight (${minWeight}–${maxWeight} kg), Height (${minHeight}–${maxHeight} cm).`
        );
        return;
      }
    } else {
      const feet = parseFloat(heightFeet);
      const inches = parseFloat(heightInches);
      height = feet * 12 + inches;
      weightKg = w * 0.453592;
      heightCm = height * 2.54;
      heightDisplay = `${feet} ft ${inches} in`;
      if (isNaN(w) || isNaN(feet) || isNaN(inches) || w <= 0 || height <= 0) {
        setError("Please provide valid weight and height.");
        return;
      }
      const minWeight = patientType === "pediatric" ? 1.1 : 2;
      const maxWeight = patientType === "pediatric" ? 110 : 1360;
      const minHeight = patientType === "pediatric" ? 11.8 : 24;
      const maxHeight = patientType === "pediatric" ? 59 : 108;
      if (
        w < minWeight ||
        w > maxWeight ||
        height < minHeight ||
        height > maxHeight ||
        inches < 0 ||
        inches >= 12
      ) {
        setError(
          `Please enter realistic values: Weight (${minWeight}–${maxWeight} lb), Height (${minHeight}–${maxHeight} in, 0–11.9 in).`
        );
        return;
      }
    }
    if (a < 1 || a > 100) {
      setError("Please enter a valid age (1–100 years).");
      return;
    }
    if (patientType === "pediatric" && a > 18) {
      setError("Pediatric mode is for ages 1–18.");
      return;
    }

    const bsa = calculateBSAValue(weightKg, heightCm, formula);
    if (!bsa || bsa < 0.2 || bsa > 3.0) {
      setError("Calculated BSA is out of range. Please check your inputs.");
      return;
    }
    const bmi = calculateBMI(weightKg, heightCm);
    const egfr = calculateEGFR(weightKg, a, gender, bsa);
    const healthInsights = getHealthInsights(bsa, bmi, gender, a, patientType);

    const calcDetails =
      formula === "dubois"
        ? `Du Bois: 0.007184 × ${weightKg.toFixed(2)}^0.425 × ${heightCm.toFixed(1)}^0.725 = ${bsa} m²`
        : formula === "mosteller"
        ? `Mosteller: √((${weightKg.toFixed(2)} × ${heightCm.toFixed(1)}) / 3600) = ${bsa} m²`
        : formula === "haycock"
        ? `Haycock: 0.024265 × ${weightKg.toFixed(2)}^0.5378 × ${heightCm.toFixed(1)}^0.3964 = ${bsa} m²`
        : `Gehan & George: 0.0235 × ${weightKg.toFixed(2)}^0.51456 × ${heightCm.toFixed(
            1
          )}^0.42246 = ${bsa} m²`;
    const calcDetailsFull = `${calcDetails}; BMI: ${weightKg.toFixed(2)} / (${(heightCm / 100).toFixed(
      2
    )}²) = ${bmi} kg/m²; eGFR: [((140 - ${a}) × ${weightKg.toFixed(2)}) / (72 × 1)]${
      gender === "female" ? " × 0.85" : ""
    } × (1.73 / ${bsa}) = ${egfr} mL/min/1.73m²`;

    const measurement = {
      date: new Date().toLocaleString(),
      gender,
      bsa,
      bmi,
      weight: `${w} ${unitSystem === "metric" ? "kg" : "lb"}`,
      height: heightDisplay,
      unitSystem,
    };

    const newHistory = [...bsaHistory, measurement];
    setBsaHistory(newHistory);
    localStorage.setItem("bsaHistory", JSON.stringify(newHistory));

    setResults({ bsa, bmi, egfr, healthInsights, calcDetails: calcDetailsFull });
  };

  const saveCalculation = () => {
    if (results && !error) {
      setSuccess("Measurement saved to history!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("Cannot save invalid measurement.");
    }
  };

  const loadHistory = () => {
    setError("");
    if (bsaHistory.length === 0) {
      setError("No saved measurements found.");
      return;
    }
    setResults(results || {});
  };

  const showDrugDosingModal = () => {
    if (!results || !results.bsa) {
      setError("Please calculate BSA first.");
      return;
    }
    setDrugBsa(results.bsa.toFixed(2));
    setDrugModalOpen(true);
  };

  const closeDrugDosingModal = () => {
    setDrugModalOpen(false);
    setDrug("5fu");
  };

  const calculateDrugDose = () => {
    const bsa = parseFloat(drugBsa);
    if (isNaN(bsa) || bsa <= 0) {
      setError("Invalid BSA value.");
      return;
    }
    let dose = drug === "5fu" ? bsa * 500 : bsa * 50;
    dose = dose.toFixed(1);
    setSuccess(`Estimated dose for ${drug === "5fu" ? "5-Fluorouracil" : "Cisplatin"}: ${dose} mg.`);
    setTimeout(() => setSuccess(""), 2000);
    closeDrugDosingModal();
  };

  const exportResults = () => {
    if (!results) return;
    const exportContent = `
Advanced Body Surface Area Calculator Results
======================================
Gender: ${gender}
Age: ${age || "N/A"}
Patient Type: ${patientType}
Formula: ${
      formula === "dubois"
        ? "Du Bois"
        : formula === "mosteller"
        ? "Mosteller"
        : formula === "haycock"
        ? "Haycock"
        : "Gehan & George"
    }

Results:
- Body Surface Area: ${results.bsa} m²
- BMI: ${results.bmi} kg/m²
- eGFR: ${results.egfr} mL/min/1.73m²

Health Insights:
${results.healthInsights}

Calculation Details:
${results.calcDetails}

Measurement Details:
- Weight: ${weight} ${unitSystem === "metric" ? "kg" : "lb"}
- Height: ${unitSystem === "metric" ? heightMetric : `${heightFeet} ft ${heightInches} in`}${
      unitSystem === "metric" ? " cm" : ""
    }

Measurement History:
${bsaHistory
  .map(
    (h) =>
      `Date: ${h.date}, Gender: ${h.gender}, BSA: ${h.bsa} m², BMI: ${h.bmi}, Weight: ${h.weight}, Height: ${h.height}`
  )
  .join("\n")}
======================================
Generated on: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bsa_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const drawProgressGauge = (progress) => {
    const canvas = progressGaugeRef.current;
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

    const progressAngle = startAngle + (Math.min(progress, 150) / 100) * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, progressAngle);
    ctx.strokeStyle = "#10b981";
    ctx.stroke();

    ctx.font = "16px Arial";
    ctx.fillStyle = "#1f2937";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.min(progress, 150)}%`, centerX, centerY - 10);
  };

  const updateCharts = () => {
    if (compositionPieChartInstance.current) compositionPieChartInstance.current.destroy();
    compositionPieChartInstance.current = new Chart(compositionPieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Underweight", "Normal", "Overweight", "Obese"],
        datasets: [
          {
            data: [
              results.bmi < 18.5 ? 1 : 0,
              results.bmi >= 18.5 && results.bmi <= 24.9 ? 1 : 0,
              results.bmi >= 25 && results.bmi <= 29.9 ? 1 : 0,
              results.bmi >= 30 ? 1 : 0,
            ],
            backgroundColor: ["#f59e0b", "#10b981", "#f97316", "#ef4444"],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "BMI Category" },
          tooltip: { callbacks: { label: (context) => context.label } },
        },
      },
    });

    if (formulaBarChartInstance.current) formulaBarChartInstance.current.destroy();
    const weightKg = unitSystem === "metric" ? parseFloat(weight) : parseFloat(weight) * 0.453592;
    const heightCm =
      unitSystem === "metric"
        ? parseFloat(heightMetric)
        : (parseFloat(heightFeet) * 12 + parseFloat(heightInches)) * 2.54;
    const duboisBSA = calculateBSAValue(weightKg, heightCm, "dubois");
    const mostellerBSA = calculateBSAValue(weightKg, heightCm, "mosteller");
    const haycockBSA = calculateBSAValue(weightKg, heightCm, "haycock");
    const gehanBSA = calculateBSAValue(weightKg, heightCm, "gehan");
    formulaBarChartInstance.current = new Chart(formulaBarChartRef.current, {
      type: "bar",
      data: {
        labels: ["Du Bois", "Mosteller", "Haycock", "Gehan & George"],
        datasets: [
          {
            label: "BSA (m²)",
            data: [duboisBSA, mostellerBSA, haycockBSA, gehanBSA],
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
            borderColor: ["#1e3a8a", "#065f46", "#b45309", "#991b1b"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: false, title: { display: true, text: "BSA (m²)" } } },
        plugins: { legend: { display: false }, title: { display: true, text: "BSA by Formula" } },
      },
    });
  };

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-5xl w-full">
          <h1 className="text-3xl font-bold text-red-700 mb-8">Advanced Body Surface Area Calculator</h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-red-700 mb-4">Enter Your Details</h2>
            <p className="text-sm text-gray-600 mb-4">
              Calculate your Body Surface Area (BSA) with insights for medical dosing and renal function.
              Select pediatric mode for children.
            </p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Gender <span className="cursor-pointer text-red-500">?</span>
                  <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                    Gender provides context for health insights.
                  </span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Age (years, optional) <span className="cursor-pointer text-red-500">?</span>
                  <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                    Age adjusts BMI and eGFR calculations.
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Patient Type <span className="cursor-pointer text-red-500">?</span>
                  <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                    Pediatric mode adjusts for children.
                  </span>
                </label>
                <select
                  value={patientType}
                  onChange={(e) => setPatientType(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="adult">Adult</option>
                  <option value="pediatric">Pediatric</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Unit System <span className="cursor-pointer text-red-500">?</span>
                  <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                    Choose metric (kg, cm) or imperial (lb, ft/in).
                  </span>
                </label>
                <select
                  value={unitSystem}
                  onChange={(e) => setUnitSystem(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="metric">Metric (kg, cm)</option>
                  <option value="imperial">Imperial (lb, ft/in)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Weight ({unitSystem === "metric" ? "kg" : "lb"})
                </label>
                <input
                  type="number"
                  step={unitSystem === "metric" ? "0.0001" : "0.01"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              {unitSystem === "metric" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={heightMetric}
                    onChange={(e) => setHeightMetric(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Height (ft)</label>
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Height (in)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Formula <span className="cursor-pointer text-red-500">?</span>
                  <span className="hidden absolute w-48 bg-gray-700 text-white text-center rounded-lg p-2 -mt-2 ml-2">
                    Du Bois is standard; Mosteller is simpler for pediatrics.
                  </span>
                </label>
                <select
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="dubois">Du Bois (Recommended)</option>
                  <option value="mosteller">Mosteller</option>
                  <option value="haycock">Haycock</option>
                  <option value="gehan">Gehan & George</option>
                </select>
              </div>
            </div>
            <button onClick={convertUnits} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">
              Convert Units
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <button onClick={calculateBSA} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Calculate BSA
            </button>
            <button onClick={saveCalculation} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Save Measurement
            </button>
            <button onClick={loadHistory} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              View History
            </button>
            <button onClick={showDrugDosingModal} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Drug Dosing
            </button>
          </div>

          {drugModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
              <div className="bg-gray-100 p-6 rounded-lg max-w-md w-full">
                <h3 className="text-lg font-semibold text-red-700 mb-4">Drug Dosage Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Estimate dosage based on BSA (e.g., 5-FU at 500 mg/m²).
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Drug</label>
                    <select
                      value={drug}
                      onChange={(e) => setDrug(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="5fu">5-Fluorouracil (500 mg/m²)</option>
                      <option value="cisplatin">Cisplatin (50 mg/m²)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">BSA (m²)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={drugBsa}
                      readOnly
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button onClick={calculateDrugDose} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                    Calculate
                  </button>
                  <button
                    onClick={closeDrugDosingModal}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {results && (
            <div>
              <h2 className="text-xl font-semibold text-red-700 mb-4">Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-red-700">Body Surface Area</h3>
                  <p className="text-2xl font-bold text-gray-800">{results.bsa} m²</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-red-700">BMI</h3>
                  <p className="text-2xl font-bold text-gray-800">{results.bmi} kg/m²</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-red-700">eGFR</h3>
                  <p className="text-2xl font-bold text-gray-800">{results.egfr} mL/min/1.73m²</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-red-700 mb-4">Health Insights</h3>
                <p className="text-gray-600">{results.healthInsights}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-red-700 mb-4">BSA Progress</h3>
                <canvas ref={progressGaugeRef} className="w-48 h-24 mx-auto" />
                <p className="text-gray-600 text-center">
                  Your BSA is {((results.bsa / 1.73) * 100).toFixed(0)}% of the standard adult BSA (1.73 m²).
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-red-700 mb-4">Body Composition</h3>
                <canvas ref={compositionPieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-red-700 mb-4">Formula Comparison</h3>
                <canvas ref={formulaBarChartRef} className="max-h-80" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-red-700 mb-4">Calculation Details</h3>
                <p className="text-gray-600">{results.calcDetails}</p>
              </div>
              <div className="mt-6 overflow-x-auto">
                <h3 className="text-lg font-medium text-red-700 mb-4">Measurement History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Gender</th>
                      <th className="p-2">BSA (m²)</th>
                      <th className="p-2">BMI</th>
                      <th className="p-2">Weight</th>
                      <th className="p-2">Height</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bsaHistory.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2">{row.date}</td>
                        <td className="p-2">{row.gender}</td>
                        <td className="p-2">{row.bsa} m²</td>
                        <td className="p-2">{row.bmi}</td>
                        <td className="p-2">{row.weight}</td>
                        <td className="p-2">{row.height}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <button onClick={exportResults} className="bg-red-500 text-white px-6 py-3 rounded-lg">
                  Export as Text
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
