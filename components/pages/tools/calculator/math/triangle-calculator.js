"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [inputType, setInputType] = useState("sss");
  const [precision, setPrecision] = useState("2");
  const [angleUnit, setAngleUnit] = useState("degrees");
  const [inputs, setInputs] = useState({});
  const [batchFile, setBatchFile] = useState(null);
  const [batchText, setBatchText] = useState("");
  const [trigInput, setTrigInput] = useState("");
  const [variation, setVariation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    // Load history
    try {
      const stored = localStorage.getItem("triangleCalcHistory");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(
            parsed.filter(
              (entry) =>
                entry &&
                typeof entry.date === "string" &&
                typeof entry.params === "string" &&
                typeof entry.result === "string"
            )
          );
        }
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }

    // Load external scripts
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/mathjs@11.8.0/lib/browser/math.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
    ]).catch((err) => console.error("Failed to load scripts:", err));

    // Initialize input fields
    updateInputFields();

    // Cleanup
    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, []);

  useEffect(() => {
    updateInputFields();
  }, [inputType, angleUnit]);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const showError = (message) => {
    clearMessages();
    setErrorMessage(String(message || "An unexpected error occurred"));
  };

  const showSuccess = (message) => {
    clearMessages();
    setSuccessMessage(String(message || "Operation completed successfully"));
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const updateInputFields = () => {
    const configs = {
      sss: [
        { label: "Side a", id: "side-a", placeholder: "e.g., 3" },
        { label: "Side b", id: "side-b", placeholder: "e.g., 4" },
        { label: "Side c", id: "side-c", placeholder: "e.g., 5" },
      ],
      sas: [
        { label: "Side a", id: "side-a", placeholder: "e.g., 5" },
        { label: `Angle C (${angleUnit})`, id: "angle-c", placeholder: "e.g., 30" },
        { label: "Side b", id: "side-b", placeholder: "e.g., 6" },
      ],
      asa: [
        { label: `Angle A (${angleUnit})`, id: "angle-a", placeholder: "e.g., 40" },
        { label: "Side c", id: "side-c", placeholder: "e.g., 5" },
        { label: `Angle B (${angleUnit})`, id: "angle-b", placeholder: "e.g., 60" },
      ],
      aas: [
        { label: `Angle A (${angleUnit})`, id: "angle-a", placeholder: "e.g., 40" },
        { label: `Angle B (${angleUnit})`, id: "angle-b", placeholder: "e.g., 60" },
        { label: "Side c", id: "side-c", placeholder: "e.g., 5" },
      ],
      ssa: [
        { label: "Side a", id: "side-a", placeholder: "e.g., 5" },
        { label: "Side b", id: "side-b", placeholder: "e.g., 6" },
        { label: `Angle A (${angleUnit})`, id: "angle-a", placeholder: "e.g., 30" },
      ],
      coordinates: [
        { label: "Vertex A (x,y)", id: "vertex-a", placeholder: "e.g., 0,0" },
        { label: "Vertex B (x,y)", id: "vertex-b", placeholder: "e.g., 3,0" },
        { label: "Vertex C (x,y)", id: "vertex-c", placeholder: "e.g., 0,4" },
      ],
    };

    const newInputs = {};
    configs[inputType].forEach((field) => {
      newInputs[field.id] = inputs[field.id] || "";
    });
    setInputs(newInputs);
  };

  const parseInput = (input, isAngle = false, angleUnit = "degrees") => {
    try {
      if (!input.trim()) throw new Error("Input cannot be empty");
      let value = parseFloat(input);
      if (isNaN(value) || !isFinite(value)) throw new Error("Invalid number");
      if (!isAngle && value <= 0) throw new Error("Side length must be positive");
      if (isAngle && angleUnit === "degrees" && (value <= 0 || value >= 180)) {
        throw new Error("Angle must be between 0 and 180 degrees");
      }
      if (isAngle && angleUnit === "radians") {
        value = window.math.unit(value, "rad").toNumber("deg");
      }
      return value;
    } catch (e) {
      throw new Error("Invalid input: " + e.message);
    }
  };

  const parseCoordinates = (input) => {
    try {
      const [x, y] = input.split(",").map((s) => parseFloat(s.trim()));
      if (isNaN(x) || isNaN(y)) throw new Error("Invalid coordinates");
      return { x, y };
    } catch (e) {
      throw new Error("Invalid coordinates: " + e.message);
    }
  };

  const validateTriangle = (sides) => {
    try {
      if (sides.some((s) => s <= 0)) throw new Error("Sides must be positive");
      const [a, b, c] = sides.sort((x, y) => x - y);
      if (a + b <= c) throw new Error("Triangle inequality violated");
      return true;
    } catch (e) {
      throw new Error("Validation error: " + e.message);
    }
  };

  const calculateTriangle = (inputs, inputType, precision, angleUnit) => {
    try {
      let sides = [],
        angles = [];
      let a, b, c, A, B, C;

      if (inputType === "coordinates") {
        const [v1, v2, v3] = inputs.map((v) => parseCoordinates(v));
        a = Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
        b = Math.sqrt((v3.x - v2.x) ** 2 + (v3.y - v2.y) ** 2);
        c = Math.sqrt((v3.x - v1.x) ** 2 + (v3.y - v1.y) ** 2);
        sides = [a, b, c];
        inputs = [v1, v2, v3];
      } else if (inputType === "sss") {
        sides = inputs.map((s) => parseInput(s));
        [a, b, c] = sides;
      } else if (inputType === "sas") {
        const [sideA, angleC, sideB] = inputs;
        a = parseInput(sideA);
        C = parseInput(angleC, true, angleUnit);
        b = parseInput(sideB);
        sides = [a, b];
        angles = [C];
      } else if (inputType === "asa" || inputType === "aas") {
        const [angleA, sideC, angleB] = inputs;
        A = parseInput(angleA, true, angleUnit);
        c = parseInput(sideC);
        B = parseInput(angleB, true, angleUnit);
        C = 180 - A - B;
        if (C <= 0) throw new Error("Invalid angle sum");
        sides = [c];
        angles = [A, B, C];
      } else if (inputType === "ssa") {
        const [sideA, sideB, angleA] = inputs;
        a = parseInput(sideA);
        b = parseInput(sideB);
        A = parseInput(angleA, true, angleUnit);
        sides = [a, b];
        angles = [A];
      }

      validateTriangle(sides.length === 3 ? sides : [a || 1, b || 1, c || 1]);

      if (inputType === "sss") {
        A = (Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)) * 180) / Math.PI;
        B = (Math.acos((a ** 2 + c ** 2 - b ** 2) / (2 * a * c)) * 180) / Math.PI;
        C = 180 - A - B;
        angles = [A, B, C];
      } else if (inputType === "sas") {
        c = Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos((C * Math.PI) / 180));
        A = (Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)) * 180) / Math.PI;
        B = 180 - A - C;
        sides = [a, b, c];
        angles = [A, B, C];
      } else if (inputType === "asa" || inputType === "aas") {
        a = (c * Math.sin((A * Math.PI) / 180)) / Math.sin((C * Math.PI) / 180);
        b = (c * Math.sin((B * Math.PI) / 180)) / Math.sin((C * Math.PI) / 180);
        sides = [a, b, c];
      } else if (inputType === "ssa") {
        B = (Math.asin((b * Math.sin((A * Math.PI) / 180)) / a) * 180) / Math.PI;
        if (isNaN(B)) throw new Error("No valid triangle (SSA ambiguous case)");
        C = 180 - A - B;
        if (C <= 0) throw new Error("Invalid angle sum");
        c = (a * Math.sin((C * Math.PI) / 180)) / Math.sin((A * Math.PI) / 180);
        sides = [a, b, c];
        angles = [A, B, C];
      }

      validateTriangle(sides);

      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

      const h_a = (2 * area) / a;
      const h_b = (2 * area) / b;
      const h_c = (2 * area) / c;

      const sideClass =
        a === b && b === c ? "Equilateral" : a === b || b === c || a === c ? "Isosceles" : "Scalene";
      const angleClass = Math.max(A, B, C) > 90 ? "Obtuse" : Math.max(A, B, C) === 90 ? "Right" : "Acute";

      let vertices =
        inputType === "coordinates"
          ? inputs
          : [
              { x: 0, y: 0 },
              { x: a, y: 0 },
              { x: b * Math.cos((C * Math.PI) / 180), y: b * Math.sin((C * Math.PI) / 180) },
            ];
      const centroid = {
        x: (vertices[0].x + vertices[1].x + vertices[2].x) / 3,
        y: (vertices[0].y + vertices[1].y + vertices[2].y) / 3,
      };

      return {
        sides: { a, b, c },
        angles: { A, B, C },
        area,
        perimeter: a + b + c,
        heights: { h_a, h_b, h_c },
        classification: `${sideClass}, ${angleClass}`,
        vertices,
        centroid,
        inputType,
      };
    } catch (e) {
      throw new Error(`Calculation error: ${e.message}`);
    }
  };

  const formatOutput = (result, precision, angleUnit) => {
    try {
      const angles =
        angleUnit === "degrees"
          ? result.angles
          : {
              A: window.math.unit(result.angles.A, "deg").toNumber("rad"),
              B: window.math.unit(result.angles.B, "deg").toNumber("rad"),
              C: window.math.unit(result.angles.C, "deg").toNumber("rad"),
            };
      return {
        sides: {
          a: Number(result.sides.a.toFixed(precision)),
          b: Number(result.sides.b.toFixed(precision)),
          c: Number(result.sides.c.toFixed(precision)),
        },
        angles: {
          A: Number(angles.A.toFixed(precision)),
          B: Number(angles.B.toFixed(precision)),
          C: Number(angles.C.toFixed(precision)),
        },
        area: Number(result.area.toFixed(precision)),
        perimeter: Number(result.perimeter.toFixed(precision)),
        heights: {
          h_a: Number(result.heights.h_a.toFixed(precision)),
          h_b: Number(result.heights.h_b.toFixed(precision)),
          h_c: Number(result.heights.h_c.toFixed(precision)),
        },
        classification: result.classification,
        vertices: result.vertices,
        centroid: {
          x: Number(result.centroid.x.toFixed(precision)),
          y: Number(result.centroid.y.toFixed(precision)),
        },
      };
    } catch (e) {
      throw new Error("Formatting error: " + e.message);
    }
  };

  const calculate = async () => {
    clearMessages();
    try {
      const precisionVal = parseInt(precision);
      if (!Number.isInteger(precisionVal) || precisionVal < 0)
        throw new Error("Precision must be a non-negative integer");

      let results = [];
      const isBatch = batchFile || batchText;

      if (!isBatch) {
        const inputValues = getInputs();
        if (!inputValues.length) throw new Error("All input fields are required");
        const result = calculateTriangle(inputValues, inputType, precisionVal, angleUnit);
        const formatted = formatOutput(result, precisionVal, angleUnit);
        results.push({
          inputType,
          precision: precisionVal,
          angleUnit,
          inputs: inputValues,
          result: formatted,
        });
        displayResults(results, isBatch);
      } else {
        let calculations = [];
        if (batchFile) {
          calculations = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = e.target.result;
              if (!text.trim()) reject(new Error("Empty file provided"));
              resolve(
                text
                  .split("\n")
                  .map((line) => line.split(",").map((s) => s.trim()))
                  .filter((c) => c.length >= 4)
              );
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(batchFile);
          });
        } else if (batchText) {
          calculations = batchText
            .split(";")
            .map((c) => c.split(",").map((s) => s.trim()))
            .filter((c) => c.length >= 4);
          if (calculations.length === 0) throw new Error("No valid datasets provided");
        }
        await processBatch(calculations, results);
        if (results.length === 0) throw new Error("No valid calculations in batch input");
        displayResults(results, isBatch);
      }
      showSuccess("Calculation completed successfully");
    } catch (e) {
      console.error("Calculation error:", e);
      showError(e.message || "Invalid input");
    }
  };

  const getInputs = () => {
    const inputValues = [];
    if (inputType === "sss") {
      inputValues.push(inputs["side-a"]);
      inputValues.push(inputs["side-b"]);
      inputValues.push(inputs["side-c"]);
    } else if (inputType === "sas") {
      inputValues.push(inputs["side-a"]);
      inputValues.push(inputs["angle-c"]);
      inputValues.push(inputs["side-b"]);
    } else if (inputType === "asa" || inputType === "aas") {
      inputValues.push(inputs["angle-a"]);
      inputValues.push(inputs["side-c"]);
      inputValues.push(inputs["angle-b"]);
    } else if (inputType === "ssa") {
      inputValues.push(inputs["side-a"]);
      inputValues.push(inputs["side-b"]);
      inputValues.push(inputs["angle-a"]);
    } else if (inputType === "coordinates") {
      inputValues.push(inputs["vertex-a"]);
      inputValues.push(inputs["vertex-b"]);
      inputValues.push(inputs["vertex-c"]);
    }
    return inputValues;
  };

  const processBatch = async (calculations, results) => {
    for (const c of calculations) {
      try {
        const calcInputType = c[c.length - 1];
        const precisionVal = parseInt(precision);
        if (!["sss", "sas", "asa", "aas", "ssa", "coordinates"].includes(calcInputType)) continue;
        const calcInputs = c.slice(0, c.length - 1);
        const result = calculateTriangle(calcInputs, calcInputType, precisionVal, angleUnit);
        const formatted = formatOutput(result, precisionVal, angleUnit);
        results.push({
          inputType: calcInputType,
          precision: precisionVal,
          angleUnit,
          inputs: calcInputs,
          result: formatted,
        });
      } catch (e) {
        console.warn(`Skipping invalid batch entry: ${e.message}`);
      }
    }
  };

  const displayResults = (results, isBatch) => {
    let output = [];
    if (isBatch) {
      const tableRows = results.map((r) => {
        const input = r.inputs.join(", ");
        const resultText = `
          Sides: a=${r.result.sides.a}, b=${r.result.sides.b}, c=${r.result.sides.c}<br>
          Angles: A=${r.result.angles.A}, B=${r.result.angles.B}, C=${r.result.angles.C}<br>
          Area: ${r.result.area}<br>
          Perimeter: ${r.result.perimeter}<br>
          Classification: ${r.result.classification}
        `;
        return { input, inputType: r.inputType, resultText };
      });

      output.push(
        <table key="batch-results" className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Input</th>
              <th className="p-2">Input Type</th>
              <th className="p-2">Output</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, i) => (
              <tr key={i}>
                <td className="p-2">{row.input}</td>
                <td className="p-2">{row.inputType}</td>
                <td className="p-2" dangerouslySetInnerHTML={{ __html: row.resultText }} />
              </tr>
            ))}
          </tbody>
        </table>
      );

      const sides = results.flatMap((r) => [r.result.sides.a, r.result.sides.b, r.result.sides.c]);
      const angles = results.flatMap((r) => [r.result.angles.A, r.result.angles.B, r.result.angles.C]);
      if (sides.length > 0 || angles.length > 0) {
        const sideFreq = {},
          angleFreq = {};
        sides.forEach((s) => (sideFreq[s] = (sideFreq[s] || 0) + 1));
        angles.forEach((a) => (angleFreq[a] = (angleFreq[a] || 0) + 1));
        output.push(
          <div key="freq-table">
            <br />
            <strong>Side/Angle Frequency Table:</strong>
            <br />
            <table className="w-full text-sm text-gray-600">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Type</th>
                  <th className="p-2">Value</th>
                  <th className="p-2">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(sideFreq).map(([s, freq], i) => (
                  <tr key={`side-${i}`}>
                    <td className="p-2">Side</td>
                    <td className="p-2">{s}</td>
                    <td className="p-2">{freq}</td>
                  </tr>
                ))}
                {Object.entries(angleFreq).map(([a, freq], i) => (
                  <tr key={`angle-${i}`}>
                    <td className="p-2">Angle</td>
                    <td className="p-2">{a}</td>
                    <td className="p-2">{freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    } else {
      const r = results[0];
      output.push(
        <div key="single-result">
          <strong>
            Results (Input Type: {r.inputType}, Precision: {r.precision}, Angle Unit: {r.angleUnit}):
          </strong>
          <br />
          Sides: a={r.result.sides.a}, b={r.result.sides.b}, c={r.result.sides.c}
          <br />
          Angles: A={r.result.angles.A}, B={r.result.angles.B}, C={r.result.angles.C}
          <br />
          Area: {r.result.area}
          <br />
          Perimeter: {r.result.perimeter}
          <br />
          Heights: h_a={r.result.heights.h_a}, h_b={r.result.heights.h_b}, h_c={r.result.heights.h_c}
          <br />
          Classification: {r.result.classification}
          <br />
          Centroid: ({r.result.centroid.x}, {r.result.centroid.y})
        </div>
      );
    }

    setResults(output);
    const params = isBatch
      ? `Batch: ${results.length} triangles, Input Type: ${results[0].inputType}`
      : `Inputs: ${results[0].inputs.join(", ")}, Input Type: ${results[0].inputType}`;
    saveToHistory(
      params,
      output.map(
        (o) => (o.props.children?.toString() || o).replace(/<[^>]+>/g, "; ").substring(0, 100) + "..."
      )
    );
    updateVisualizations(results, isBatch);
  };

  const calculateTrig = () => {
    clearMessages();
    try {
      const inputs = trigInput.split(",").map((s) => parseInput(s));
      const precisionVal = parseInt(precision);
      const result = calculateTriangle(inputs, inputType, precisionVal, angleUnit);
      const trigValues = {
        sinA: Math.sin((result.angles.A * Math.PI) / 180),
        cosA: Math.cos((result.angles.A * Math.PI) / 180),
        sinB: Math.sin((result.angles.B * Math.PI) / 180),
        cosB: Math.cos((result.angles.B * Math.PI) / 180),
        sinC: Math.sin((result.angles.C * Math.PI) / 180),
        cosC: Math.cos((result.angles.C * Math.PI) / 180),
      };
      const trigText = `
        sin(A): ${trigValues.sinA.toFixed(precisionVal)}<br>
        cos(A): ${trigValues.cosA.toFixed(precisionVal)}<br>
        sin(B): ${trigValues.sinB.toFixed(precisionVal)}<br>
        cos(B): ${trigValues.cosB.toFixed(precisionVal)}<br>
        sin(C): ${trigValues.sinC.toFixed(precisionVal)}<br>
        cos(C): ${trigValues.cosC.toFixed(precisionVal)}
      `;
      const expression = `Trig(${inputs.join(", ")})`;

      setResults([
        <div
          key="trig-result"
          dangerouslySetInnerHTML={{ __html: `<strong>Trigonometric Analysis:</strong><br>${trigText}` }}
        />,
      ]);
      saveToHistory(expression, trigText.replace(/<br>/g, "; "));
      updateBarChart(
        [trigValues.sinA, trigValues.sinB, trigValues.sinC],
        [trigValues.cosA, trigValues.cosB, trigValues.cosC],
        true
      );
      showSuccess("Trigonometric analysis completed");
    } catch (e) {
      console.error("Trig error:", e);
      showError("Invalid trigonometric input: " + e.message);
    }
  };

  const calculateSensitivity = () => {
    clearMessages();
    try {
      const variationVal = parseFloat(variation);
      const precisionVal = parseInt(precision);
      const inputValues = getInputs();
      if (!inputValues.length) throw new Error("Inputs are required");
      if (isNaN(variationVal)) throw new Error("Invalid variation");

      const results = [];
      const modifiedInputs = [
        [...inputValues],
        inputValues.map((v, i) =>
          inputType === "sss" && i < 3 ? (parseFloat(v) + variationVal).toString() : v
        ),
        inputValues.slice(0, -1),
      ].filter((set) => set.length > 0);

      for (const set of modifiedInputs) {
        try {
          const result = calculateTriangle(set, inputType, precisionVal, angleUnit);
          const formatted = formatOutput(result, precisionVal, angleUnit);
          results.push({
            set: set.join(", "),
            result: formatted,
          });
        } catch (e) {
          console.warn(`Skipping sensitivity variation: ${e.message}`);
        }
      }

      const resultText = results
        .map(
          (r) =>
            `Inputs [${r.set}]:<br>` +
            `Area: ${r.result.area}<br>` +
            `Perimeter: ${r.result.perimeter}<br>` +
            `Classification: ${r.result.classification}`
        )
        .join("<br><br>");

      setResults([
        <div
          key="sensitivity-result"
          dangerouslySetInnerHTML={{
            __html: `<strong>Sensitivity Analysis (Variation: ${variationVal}):</strong><br>${resultText}`,
          }}
        />,
      ]);
      saveToHistory(`Sensitivity (Variation: ${variationVal})`, resultText.replace(/<br>/g, "; "));
      updateSensitivityChart(results);
      showSuccess("Sensitivity analysis completed");
    } catch (e) {
      console.error("Sensitivity error:", e);
      showError("Invalid sensitivity input: " + e.message);
    }
  };

  const updateVisualizations = (results, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();

    if (!isBatch && results.length === 1) {
      drawTriangleVisualization(results[0].result);
    } else if (svgRef.current) {
      svgRef.current.innerHTML =
        '<text x="10" y="50" fill="#000" font-size="14">Visualization available for single triangle</text>';
    }

    const sides = results.flatMap((r) => [r.result.sides.a, r.result.sides.b, r.result.sides.c]);
    const angles = results.flatMap((r) => [r.result.angles.A, r.result.angles.B, r.result.angles.C]);
    if (sides.length > 0 || angles.length > 0) {
      updateBarChart(sides, angles, isBatch);
    }
  };

  const drawTriangleVisualization = (result) => {
    if (!svgRef.current) return;
    svgRef.current.innerHTML = "";
    const width = 500;
    const height = 300;
    svgRef.current.setAttribute("width", width);
    svgRef.current.setAttribute("height", height);

    try {
      const vertices = result.vertices;
      const maxX = Math.max(...vertices.map((v) => v.x));
      const minX = Math.min(...vertices.map((v) => v.x));
      const maxY = Math.max(...vertices.map((v) => v.y));
      const minY = Math.min(...vertices.map((v) => v.y));
      let rangeX = maxX - minX;
      let rangeY = maxY - minY;
      if (rangeX === 0) rangeX = 1;
      if (rangeY === 0) rangeY = 1;

      const scaleX = (width - 100) / rangeX;
      const scaleY = (height - 100) / rangeY;
      const scale = Math.min(scaleX, scaleY);
      const offsetX = 50 - minX * scale;
      const offsetY = height - 50 - maxY * scale;

      const scaledVertices = vertices.map((v) => ({
        x: v.x * scale + offsetX,
        y: v.y * scale + offsetY,
      }));

      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("points", scaledVertices.map((v) => `${v.x},${v.y}`).join(" "));
      poly.setAttribute("fill", "#fecaca");
      poly.setAttribute("stroke", "#b91c1c");
      poly.setAttribute("stroke-width", "2");
      svgRef.current.appendChild(poly);

      scaledVertices.forEach((v, i) => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", v.x + 5);
        text.setAttribute("y", v.y - 5);
        text.setAttribute("fill", "#000");
        text.setAttribute("font-size", "12");
        text.textContent = ["A", "B", "C"][i];
        svgRef.current.appendChild(text);
      });

      const sides = result.sides;
      const midPoints = [
        {
          x: (scaledVertices[1].x + scaledVertices[2].x) / 2,
          y: (scaledVertices[1].y + scaledVertices[2].y) / 2,
          label: `a=${sides.a}`,
        },
        {
          x: (scaledVertices[0].x + scaledVertices[2].x) / 2,
          y: (scaledVertices[0].y + scaledVertices[2].y) / 2,
          label: `b=${sides.b}`,
        },
        {
          x: (scaledVertices[0].x + scaledVertices[1].x) / 2,
          y: (scaledVertices[0].y + scaledVertices[1].y) / 2,
          label: `c=${sides.c}`,
        },
      ];
      midPoints.forEach((mp) => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", mp.x);
        text.setAttribute("y", mp.y);
        text.setAttribute("fill", "#000");
        text.setAttribute("font-size", "12");
        text.textContent = mp.label;
        svgRef.current.appendChild(text);
      });

      const centroid = {
        x: result.centroid.x * scale + offsetX,
        y: result.centroid.y * scale + offsetY,
      };
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", centroid.x);
      circle.setAttribute("cy", centroid.y);
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", "#ef4444");
      svgRef.current.appendChild(circle);
      const centroidText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      centroidText.setAttribute("x", centroid.x + 10);
      centroidText.setAttribute("y", centroid.y);
      centroidText.setAttribute("fill", "#000");
      centroidText.setAttribute("font-size", "12");
      centroidText.textContent = "Centroid";
      svgRef.current.appendChild(centroidText);
    } catch (e) {
      console.error("Visualization error:", e);
      svgRef.current.innerHTML =
        '<text x="10" y="50" fill="#000" font-size="14">Unable to render visualization: Invalid data</text>';
    }
  };

  const updateBarChart = (sides, angles, isBatch) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (!barChartRef.current) return;

    const sideFreq = {},
      angleFreq = {};
    sides.forEach((s) => (sideFreq[s] = (sideFreq[s] || 0) + 1));
    angles.forEach((a) => (angleFreq[a] = (angleFreq[a] || 0) + 1));
    const labels = [...new Set([...Object.keys(sideFreq), ...Object.keys(angleFreq)])]
      .map(Number)
      .sort((a, b) => a - b);
    const sideData = labels.map((s) => sideFreq[s] || 0);
    const angleData = labels.map((a) => angleFreq[a] || 0);

    barChartInstance.current = new window.Chart(barChartRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: isBatch ? "Side Frequency" : "Sine Values",
            data: isBatch ? sideData : sideData,
            backgroundColor: "#ef4444",
            borderColor: "#b91c1c",
            borderWidth: 1,
          },
          {
            label: isBatch ? "Angle Frequency" : "Cosine Values",
            data: isBatch ? angleData : angleData,
            backgroundColor: "#ef4444",
            borderColor: "#b91c1c",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Frequency" }, beginAtZero: true },
          x: { title: { display: true, text: "Value" } },
        },
        plugins: {
          title: { display: true, text: isBatch ? "Side/Angle Frequency" : "Trigonometric Values" },
        },
      },
    });
  };

  const updateSensitivityChart = (results) => {
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (!barChartRef.current) return;

    const labels = ["Original", "Add Variation", "Remove Last"];
    const datasets = [
      {
        label: "Area",
        data: results.map((r) => r.result.area),
        backgroundColor: "#ef4444",
        borderColor: "#b91c1c",
        borderWidth: 1,
      },
      {
        label: "Perimeter",
        data: results.map((r) => r.result.perimeter),
        backgroundColor: "#ef4444",
        borderColor: "#b91c1c",
        borderWidth: 1,
      },
    ];

    barChartInstance.current = new window.Chart(barChartRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Value" }, beginAtZero: true },
          x: { title: { display: true, text: "Dataset" } },
        },
        plugins: {
          title: { display: true, text: "Sensitivity Analysis" },
        },
      },
    });
  };

  const clearInputs = () => {
    setInputType("sss");
    setPrecision("2");
    setAngleUnit("degrees");
    setInputs({});
    setBatchFile(null);
    setBatchText("");
    setTrigInput("");
    setVariation("");
    clearMessages();
    setResults([]);
    if (svgRef.current) svgRef.current.innerHTML = "";
    if (barChartInstance.current) barChartInstance.current.destroy();
  };

  const saveCalculation = () => {
    if (results.length > 0) {
      showSuccess("Calculation saved to history!");
    } else {
      showError("No valid calculation to save.");
    }
  };

  const saveToHistory = (params, result) => {
    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        params: String(params || ""),
        result: String(result || ""),
      },
    ];
    setHistory(newHistory);
    localStorage.setItem("triangleCalcHistory", JSON.stringify(newHistory));
  };

  const exportCSV = () => {
    const headers = ["Date", "Parameters", "Result"];
    const rows = history.map((entry) => [`"${entry.date}"`, `"${entry.params}"`, `"${entry.result}"`]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "triangle_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "triangle_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Triangle Calculation History", 10, 10);
    let y = 20;
    history.forEach((entry) => {
      doc.text(`Date: ${entry.date}`, 10, y);
      doc.text(`Parameters: ${entry.params}`, 10, y + 10);
      doc.text(`Result: ${entry.result}`, 10, y + 20);
      y += 40;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("triangle_history.pdf");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
      calculate();
    }
  };

  const inputFields = {
    sss: [
      { label: "Side a", id: "side-a", placeholder: "e.g., 3" },
      { label: "Side b", id: "side-b", placeholder: "e.g., 4" },
      { label: "Side c", id: "side-c", placeholder: "e.g., 5" },
    ],
    sas: [
      { label: "Side a", id: "side-a", placeholder: "e.g., 5" },
      { label: `Angle C (${angleUnit})`, id: "angle-c", placeholder: "e.g., 30" },
      { label: "Side b", id: "side-b", placeholder: "e.g., 6" },
    ],
    asa: [
      { label: `Angle A (${angleUnit})`, id: "angle-a", placeholder: "e.g., 40" },
      { label: "Side c", id: "side-c", placeholder: "e.g., 5" },
      { label: `Angle B (${angleUnit})`, id: "angle-b", placeholder: "e.g., 60" },
    ],
    aas: [
      { label: `Angle A (${angleUnit})`, id: "angle-a", placeholder: "e.g., 40" },
      { label: `Angle B (${angleUnit})`, id: "angle-b", placeholder: "e.g., 60" },
      { label: "Side c", id: "side-c", placeholder: "e.g., 5" },
    ],
    ssa: [
      { label: "Side a", id: "side-a", placeholder: "e.g., 5" },
      { label: "Side b", id: "side-b", placeholder: "e.g., 6" },
      { label: `Angle A (${angleUnit})`, id: "angle-a", placeholder: "e.g., 30" },
    ],
    coordinates: [
      { label: "Vertex A (x,y)", id: "vertex-a", placeholder: "e.g., 0,0" },
      { label: "Vertex B (x,y)", id: "vertex-b", placeholder: "e.g., 3,0" },
      { label: "Vertex C (x,y)", id: "vertex-c", placeholder: "e.g., 0,4" },
    ],
  }[inputType];

  return (
    <>
      <div
        className="min-h-screen bg-white flex justify-center items-center p-4 font-inter"
        onKeyDown={handleKeyDown}
      >
        <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6 animate-pulse">Advanced Triangle Calculator</h1>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculator Settings</h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Input Type
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Select how to define the triangle.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value)}
                >
                  <option value="sss">SSS (Side-Side-Side)</option>
                  <option value="sas">SAS (Side-Angle-Side)</option>
                  <option value="asa">ASA (Angle-Side-Angle)</option>
                  <option value="aas">AAS (Angle-Angle-Side)</option>
                  <option value="ssa">SSA (Side-Side-Angle)</option>
                  <option value="coordinates">Coordinates (Vertices)</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Precision (Decimal Places)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Number of decimal places for output.
                  </span>
                </label>
                <input
                  type="number"
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  placeholder="e.g., 2"
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Angle Unit
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Choose angle unit for input/output.
                  </span>
                </label>
                <select
                  className="p-3 border rounded-lg w-full bg-gray-200"
                  value={angleUnit}
                  onChange={(e) => setAngleUnit(e.target.value)}
                >
                  <option value="degrees">Degrees</option>
                  <option value="radians">Radians</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Triangle Inputs</h3>
              <div className="flex flex-wrap gap-4 items-end">
                {inputFields.map((field) => (
                  <div key={field.id} className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                      {field.label}
                      <span className="ml-1 cursor-pointer">?</span>
                      <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                        Enter {field.label.toLowerCase()}.
                      </span>
                    </label>
                    <input
                      type="text"
                      className="p-3 border rounded-lg w-full bg-gray-200"
                      placeholder={field.placeholder}
                      value={inputs[field.id] || ""}
                      onChange={(e) => setInputs({ ...inputs, [field.id]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                Batch Input (CSV: input1,input2,...,input_type)
                <span className="ml-1 cursor-pointer">?</span>
                <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                  Upload CSV or enter triangles (e.g., 3,4,5,sss;5,30,6,sas).
                </span>
              </label>
              <input
                type="file"
                accept=".csv"
                className="p-3 border rounded-lg w-full bg-gray-200 mb-2"
                onChange={(e) => setBatchFile(e.target.files[0])}
              />
              <textarea
                className="p-3 border rounded-lg w-full bg-gray-200"
                rows="4"
                placeholder="e.g., 3,4,5,sss;5,30,6,sas"
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4 mb-6">
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              onClick={calculate}
            >
              Calculate
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              onClick={clearInputs}
            >
              Clear
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              onClick={saveCalculation}
            >
              Save Calculation
            </button>
          </div>
          <div className="mb-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Features
            </button>
          </div>
          {showAdvanced && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analysis</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Analyze Triangle (comma-separated inputs)
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Enter triangle inputs for trigonometric analysis.
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 3,4,5"
                  value={trigInput}
                  onChange={(e) => setTrigInput(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={calculateTrig}
                >
                  Calculate Trigonometry
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2 relative group">
                  Variation Value
                  <span className="ml-1 cursor-pointer">?</span>
                  <span className="absolute hidden group-hover:block w-48 bg-gray-600 text-white text-xs rounded p-2 -top-10 left-0 z-10">
                    Value to adjust side/angle for sensitivity analysis.
                  </span>
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg bg-gray-200"
                  placeholder="e.g., 1"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
                  onClick={calculateSensitivity}
                >
                  Analyze Sensitivity
                </button>
              </div>
            </div>
          )}
          {results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Calculation Results</h2>
              <div className="text-gray-600 mb-4">{results}</div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Triangle Visualization</h3>
                <svg ref={svgRef} className="w-full max-w-[500px] h-[300px] mx-auto block" />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700">Side/Angle Frequency</h3>
                <canvas ref={barChartRef} className="max-h-80" />
              </div>
              <div className="mt-6 max-h-52 overflow-y-auto">
                <h3 className="text-md font-medium text-gray-700">Calculation History</h3>
                <table className="w-full text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Date</th>
                      <th className="p-2">Parameters</th>
                      <th className="p-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-2 text-center">
                          No history available
                        </td>
                      </tr>
                    ) : (
                      history.map((entry, i) => (
                        <tr key={i}>
                          <td className="p-2">{entry.date}</td>
                          <td className="p-2">{entry.params}</td>
                          <td className="p-2">{entry.result}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={exportCSV}
                >
                  Export CSV
                </button>
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={exportJSON}
                >
                  Export JSON
                </button>
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={exportPDF}
                >
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
