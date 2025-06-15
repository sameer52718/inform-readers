"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function BMICalculator() {
  const [unitSystem, setUnitSystem] = useState("imperial");
  const [gender, setGender] = useState("female");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("158.73");
  const [heightMetric, setHeightMetric] = useState("");
  const [heightFeet, setHeightFeet] = useState("5");
  const [heightInches, setHeightInches] = useState("10");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState(null);
  const [bmiHistory, setBmiHistory] = useState([]);
  const bmiPieChartRef = useRef(null);
  const bmiPieChartInstance = useRef(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
    setBmiHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (results && bmiPieChartRef.current) {
      updatePieChart();
    }
  }, [results, bmiHistory]);

  const calculateBMIValue = (weight, height, unitSystem) => {
    let bmi;
    if (unitSystem === "metric") {
      bmi = weight / (height * height);
    } else {
      bmi = (weight / (height * height)) * 703;
    }
    return Number(bmi.toFixed(1));
  };

  const calculateBodyFat = (bmi, age, gender) => {
    if (!age || age < 18 || age > 100) return null;
    if (gender === "female") {
      return Number((1.2 * bmi + 0.23 * age - 5.4).toFixed(1));
    } else {
      return Number((1.2 * bmi + 0.23 * age - 16.2).toFixed(1));
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi <= 24.9) return "Healthy Weight";
    if (bmi <= 29.9) return "Overweight";
    return "Obese";
  };

  const getHealthNotes = (category, gender) => {
    const baseNotes = {
      Underweight:
        "May indicate insufficient body fat or muscle mass. Consult a doctor to assess nutrition or health conditions.",
      "Healthy Weight":
        "Generally associated with lower health risks. Maintain with a balanced diet and exercise.",
      Overweight:
        "May increase risk of heart disease or diabetes. Consider lifestyle changes and consult a doctor.",
      Obese: "Higher risk for chronic diseases. Seek medical advice for weight management strategies.",
    };
    const femaleNotes = {
      Underweight: `${baseNotes["Underweight"]} For women, this may affect menstrual cycles or fertility. If pregnant, consult a doctor immediately.`,
      "Healthy Weight": `${baseNotes["Healthy Weight"]} For women, this range supports reproductive health. If pregnant or post-menopausal, consult a doctor for personalized advice.`,
      Overweight: `${baseNotes["Overweight"]} For women, excess weight may impact hormonal balance or pregnancy. Consult a doctor for tailored guidance.`,
      Obese: `${baseNotes["Obese"]} For women, this may increase risks during pregnancy or menopause. Seek medical support for health planning.`,
    };
    return gender === "female" ? femaleNotes[category] : baseNotes[category];
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
      const heightMeters = (feet * 12 + inches) * 0.0254;
      setUnitSystem("metric");
      setWeight(weightKg.toFixed(4));
      setHeightMetric(heightMeters.toFixed(4));
    } else {
      const h = parseFloat(heightMetric);
      if (isNaN(w) || isNaN(h)) {
        setError("Please provide valid weight and height.");
        return;
      }
      const weightLb = w / 0.453592;
      const heightIn = h / 0.0254;
      const feet = Math.floor(heightIn / 12);
      const inches = (heightIn % 12).toFixed(1);
      setUnitSystem("imperial");
      setWeight(weightLb.toFixed(2));
      setHeightFeet(feet);
      setHeightInches(inches);
    }
  };

  const calculateBMI = () => {
    setError("");
    const w = parseFloat(weight);
    let height, heightDisplay;

    if (unitSystem === "metric") {
      height = parseFloat(heightMetric);
      heightDisplay = `${height} m`;
      if (isNaN(w) || isNaN(height) || w <= 0 || height <= 0) {
        setError("Please provide valid weight and height.");
        return;
      }
      if (w < 1 || w > 617 || height < 0.61 || height > 2.74) {
        setError("Please enter realistic values: Weight (1–617 kg), Height (0.61–2.74 m).");
        return;
      }
    } else {
      const feet = parseFloat(heightFeet);
      const inches = parseFloat(heightInches);
      height = feet * 12 + inches;
      heightDisplay = `${feet} ft ${inches} in`;
      if (isNaN(w) || isNaN(feet) || isNaN(inches) || w <= 0 || height <= 0) {
        setError("Please provide valid weight and height.");
        return;
      }
      if (w < 2 || w > 1360 || height < 24 || height > 108 || inches < 0 || inches >= 12) {
        setError("Please enter realistic values: Weight (2–1360 lb), Height (24–108 in, 0–11.9 in).");
        return;
      }
    }

    const rawBMI = unitSystem === "metric" ? w / (height * height) : (w / (height * height)) * 703;
    const bmi = calculateBMIValue(w, height, unitSystem);
    if (bmi < 10 || bmi > 60) {
      setError("Calculated BMI is out of range. Please check your inputs.");
      return;
    }

    const category = getBMICategory(bmi);
    const bodyFat = calculateBodyFat(bmi, age, gender);
    const healthNotes = getHealthNotes(category, gender);
    const intermediate =
      unitSystem === "metric" ? `${w} kg / (${height} m)²` : `${w} lb / (${height} in)² * 703`;
    const calcDetails = `Formula: ${intermediate} = ${rawBMI.toFixed(4)} (rounded to ${bmi})${
      bodyFat
        ? `; Est. Body Fat: (1.20 * ${bmi}) + (0.23 * ${age}) - ${
            gender === "female" ? "5.4" : "16.2"
          } = ${bodyFat}%`
        : ""
    }`;

    const measurement = {
      date: new Date().toLocaleString(),
      gender,
      bmi,
      bodyFat: bodyFat || "N/A",
      weight: `${w} ${unitSystem === "metric" ? "kg" : "lb"}`,
      height: heightDisplay,
      category,
      unitSystem,
    };

    const newHistory = [...bmiHistory, measurement];
    setBmiHistory(newHistory);
    localStorage.setItem("bmiHistory", JSON.stringify(newHistory));

    setResults({ bmi, category, bodyFat, healthNotes, calcDetails });
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
    if (bmiHistory.length === 0) {
      setError("No saved measurements found.");
      return;
    }
    setResults(results || {});
  };

  const exportResults = () => {
    if (!results) return;
    const exportContent = `
BMI Calculator Results
=====================
Gender: ${gender}
Age: ${age || "N/A"}
BMI: ${results.bmi}
Category: ${results.category}

Measurement Details:
- Weight: ${weight} ${unitSystem === "metric" ? "kg" : "lb"}
- Height: ${unitSystem === "metric" ? heightMetric : `${heightFeet} ft ${heightInches} in`}${
      unitSystem === "metric" ? " m" : ""
    }

Health Notes:
${results.healthNotes}

Calculation Details:
${results.calcDetails}

Measurement History:
${bmiHistory
  .map(
    (h) =>
      `Date: ${h.date}, Gender: ${h.gender}, BMI: ${h.bmi}, Body Fat: ${h.bodyFat}, Weight: ${h.weight}, Height: ${h.height}, Category: ${h.category}`
  )
  .join("\n")}
=====================
Generated on: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bmi_results.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const updatePieChart = () => {
    if (bmiPieChartInstance.current) bmiPieChartInstance.current.destroy();
    const categoryCounts = { Underweight: 0, "Healthy Weight": 0, Overweight: 0, Obese: 0 };
    bmiHistory.forEach((h) => categoryCounts[h.category]++);
    const total = bmiHistory.length;
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
              label: (context) => `${context.label}: ${context.raw}%`,
            },
          },
        },
      },
    });
  };

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-red-700 mb-8">BMI Calculator</h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-red-700 mb-4">Enter Measurements</h2>
            <p className="text-sm text-gray-600 mb-4">
              Matches CDC Adult BMI Calculator (
              <a
                href="https://www.cdc.gov/bmi/adult-calculator/index.html"
                target="_blank"
                className="text-red-500 hover:underline"
              >
                link
              </a>
              ). Use Convert Units for precise lb ↔ kg, in ↔ m conversion. Gender and age provide
              female-specific guidance.
            </p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Gender</label>
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
                <label className="block text-sm font-medium text-gray-600 mb-2">Age (years, optional)</label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="e.g., 30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Unit System</label>
                <select
                  value={unitSystem}
                  onChange={(e) => setUnitSystem(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="metric">Metric (kg, m)</option>
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
                  <label className="block text-sm font-medium text-gray-600 mb-2">Height (m)</label>
                  <input
                    type="number"
                    step="0.0001"
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
            </div>
            <button onClick={convertUnits} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">
              Convert Units
            </button>
          </div>

          <div className="flex gap-4 mb-8">
            <button onClick={calculateBMI} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Calculate BMI
            </button>
            <button onClick={saveCalculation} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Save Measurement
            </button>
            <button onClick={loadHistory} className="bg-red-500 text-white px-6 py-3 rounded-lg">
              View History
            </button>
          </div>

          {results && (
            <div>
              <h2 className="text-xl font-semibold text-red-700 mb-4">Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-red-700">BMI</h3>
                  <p className="text-2xl font-bold text-gray-800">{results.bmi}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-red-700">Category</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {results.bodyFat
                      ? `${results.category} (Est. Body Fat: ${results.bodyFat}%)`
                      : results.category}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-red-700 mb-4">Health Notes</h3>
                <p className="text-gray-600">{results.healthNotes}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-red-700 mb-4">Calculation Details</h3>
                <p className="text-gray-600">{results.calcDetails}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-red-700 mb-4">BMI Category Distribution</h3>
                <canvas ref={bmiPieChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 overflow-x-auto">
                <h3 className="text-lg font-medium text-red-700 mb-4">Measurement History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Gender</th>
                      <th className="p-2">BMI</th>
                      <th className="p-2">Body Fat %</th>
                      <th className="p-2">Weight</th>
                      <th className="p-2">Height</th>
                      <th className="p-2">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bmiHistory.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2">{row.date}</td>
                        <td className="p-2">{row.gender}</td>
                        <td className="p-2">{row.bmi}</td>
                        <td className="p-2">{row.bodyFat}</td>
                        <td className="p-2">{row.weight}</td>
                        <td className="p-2">{row.height}</td>
                        <td className="p-2">{row.category}</td>
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
