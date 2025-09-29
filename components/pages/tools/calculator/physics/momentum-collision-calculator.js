"use client";

import React, { useState, useRef, useEffect } from "react";

const MomentumCollisionCalculator = () => {
  const [mode, setMode] = useState("scalar");
  const [dimension, setDimension] = useState("1d");
  const [collisionType, setCollisionType] = useState("elastic");
  const [angleUnit, setAngleUnit] = useState("deg");
  const [inputs, setInputs] = useState({
    restitution: "",
    mass1: "",
    velocityMag1: "",
    velocityAngle1: "",
    velocityX1: "",
    velocityY1: "",
    mass2: "",
    velocityMag2: "",
    velocityAngle2: "",
    velocityX2: "",
    velocityY2: "",
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 400;
    }
    updateInputs();
  }, [mode, dimension, collisionType]);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const updateInputs = () => {
    // Handled via conditional rendering in JSX
  };

  const calculateCollision = () => {
    const restitution = parseFloat(inputs.restitution);
    const mass1 = parseFloat(inputs.mass1);
    const mass2 = parseFloat(inputs.mass2);
    const velocityMag1 = parseFloat(inputs.velocityMag1);
    const velocityAngle1 = parseFloat(inputs.velocityAngle1);
    const velocityMag2 = parseFloat(inputs.velocityMag2);
    const velocityAngle2 = parseFloat(inputs.velocityAngle2);
    const velocityX1 = parseFloat(inputs.velocityX1);
    const velocityY1 = parseFloat(inputs.velocityY1);
    const velocityX2 = parseFloat(inputs.velocityX2);
    const velocityY2 = parseFloat(inputs.velocityY2);
    const steps = [];

    // Input validation
    if (isNaN(mass1) || isNaN(mass2) || mass1 <= 0 || mass2 <= 0) {
      setResults(<p className="text-red-500">Masses must be positive.</p>);
      return;
    }
    if (collisionType === "partial" && (isNaN(restitution) || restitution < 0 || restitution > 1)) {
      setResults(<p className="text-red-500">Coefficient of restitution must be between 0 and 1.</p>);
      return;
    }
    let v1x, v1y, v2x, v2y;
    if (mode === "scalar") {
      if (isNaN(velocityMag1) || isNaN(velocityMag2) || isNaN(velocityAngle1) || isNaN(velocityAngle2)) {
        setResults(<p className="text-red-500">Velocity magnitudes and angles must be valid.</p>);
        return;
      }
      const theta1 = angleUnit === "deg" ? (velocityAngle1 * Math.PI) / 180 : velocityAngle1;
      const theta2 = angleUnit === "deg" ? (velocityAngle2 * Math.PI) / 180 : velocityAngle2;
      v1x = velocityMag1 * Math.cos(theta1);
      v1y = dimension === "2d" ? velocityMag1 * Math.sin(theta1) : 0;
      v2x = velocityMag2 * Math.cos(theta2);
      v2y = dimension === "2d" ? velocityMag2 * Math.sin(theta2) : 0;
      steps.push(
        `Object 1 velocity: v1_x = ${velocityMag1} cos(${velocityAngle1} ${angleUnit}) = ${v1x.toFixed(
          2
        )} m/s${
          dimension === "2d"
            ? `, v1_y = ${velocityMag1} sin(${velocityAngle1} ${angleUnit}) = ${v1y.toFixed(2)} m/s`
            : ""
        }`
      );
      steps.push(
        `Object 2 velocity: v2_x = ${velocityMag2} cos(${velocityAngle2} ${angleUnit}) = ${v2x.toFixed(
          2
        )} m/s${
          dimension === "2d"
            ? `, v2_y = ${velocityMag2} sin(${velocityAngle2} ${angleUnit}) = ${v2y.toFixed(2)} m/s`
            : ""
        }`
      );
    } else {
      if (
        isNaN(velocityX1) ||
        isNaN(velocityX2) ||
        (dimension === "2d" && (isNaN(velocityY1) || isNaN(velocityY2)))
      ) {
        setResults(<p className="text-red-500">Velocity components must be valid.</p>);
        return;
      }
      v1x = velocityX1;
      v1y = dimension === "2d" ? velocityY1 : 0;
      v2x = velocityX2;
      v2y = dimension === "2d" ? velocityY2 : 0;
      steps.push(
        `Object 1 velocity: v1_x = ${v1x.toFixed(2)} m/s${
          dimension === "2d" ? `, v1_y = ${v1y.toFixed(2)} m/s` : ""
        }`
      );
      steps.push(
        `Object 2 velocity: v2_x = ${v2x.toFixed(2)} m/s${
          dimension === "2d" ? `, v2_y = ${v2y.toFixed(2)} m/s` : ""
        }`
      );
    }

    // Initial momentum
    const p1x = mass1 * v1x;
    const p1y = mass1 * v1y;
    const p2x = mass2 * v2x;
    const p2y = mass2 * v2y;
    steps.push(
      `Initial momentum Object 1: p1_x = m1 v1_x = ${mass1} × ${v1x.toFixed(2)} = ${p1x.toFixed(2)} kg·m/s${
        dimension === "2d" ? `, p1_y = ${mass1} × ${v1y.toFixed(2)} = ${p1y.toFixed(2)} kg·m/s` : ""
      }`
    );
    steps.push(
      `Initial momentum Object 2: p2_x = m2 v2_x = ${mass2} × ${v2x.toFixed(2)} = ${p2x.toFixed(2)} kg·m/s${
        dimension === "2d" ? `, p2_y = ${mass2} × ${v2y.toFixed(2)} = ${p2y.toFixed(2)} kg·m/s` : ""
      }`
    );

    // Total initial momentum
    const totalPx = p1x + p2x;
    const totalPy = p1y + p2y;
    steps.push(
      `Total initial momentum: p_x = p1_x + p2_x = ${p1x.toFixed(2)} + ${p2x.toFixed(2)} = ${totalPx.toFixed(
        2
      )} kg·m/s${
        dimension === "2d"
          ? `, p_y = ${p1y.toFixed(2)} + ${p2y.toFixed(2)} = ${totalPy.toFixed(2)} kg·m/s`
          : ""
      }`
    );

    // Initial kinetic energy
    const ke1 = 0.5 * mass1 * (v1x * v1x + v1y * v1y);
    const ke2 = 0.5 * mass2 * (v2x * v2x + v2y * v2y);
    const totalKE = ke1 + ke2;
    steps.push(
      `Initial KE Object 1: KE1 = ½ m1 (v1_x² + v1_y²) = ½ × ${mass1} × (${v1x.toFixed(2)}² + ${v1y.toFixed(
        2
      )}²) = ${ke1.toFixed(2)} J`
    );
    steps.push(
      `Initial KE Object 2: KE2 = ½ m2 (v2_x² + v2_y²) = ½ × ${mass2} × (${v2x.toFixed(2)}² + ${v2y.toFixed(
        2
      )}²) = ${ke2.toFixed(2)} J`
    );
    steps.push(`Total initial KE: ${ke1.toFixed(2)} + ${ke2.toFixed(2)} = ${totalKE.toFixed(2)} J`);

    // Post-collision velocities
    let v1xFinal, v1yFinal, v2xFinal, v2yFinal, finalKE;
    if (collisionType === "inelastic") {
      v1xFinal = v2xFinal = (mass1 * v1x + mass2 * v2x) / (mass1 + mass2);
      v1yFinal = v2yFinal = (mass1 * v1y + mass2 * v2y) / (mass1 + mass2);
      steps.push(
        `Perfectly inelastic: Common final velocity (x): v_f = (m1 v1_x + m2 v2_x)/(m1 + m2) = (${mass1} × ${v1x.toFixed(
          2
        )} + ${mass2} × ${v2x.toFixed(2)})/(${mass1} + ${mass2}) = ${v1xFinal.toFixed(2)} m/s`
      );
      if (dimension === "2d") {
        steps.push(
          `Common final velocity (y): v_f = (m1 v1_y + m2 v2_y)/(m1 + m2) = (${mass1} × ${v1y.toFixed(
            2
          )} + ${mass2} × ${v2y.toFixed(2)})/(${mass1} + ${mass2}) = ${v1yFinal.toFixed(2)} m/s`
        );
      }
    } else {
      const e = collisionType === "elastic" ? 1 : restitution;
      v1xFinal = ((mass1 - e * mass2) * v1x + (1 + e) * mass2 * v2x) / (mass1 + mass2);
      v2xFinal = ((mass2 - e * mass1) * v2x + (1 + e) * mass1 * v1x) / (mass1 + mass2);
      steps.push(
        `Final velocity Object 1 (x): v1_x' = [(m1 - e m2) v1_x + (1 + e) m2 v2_x]/(m1 + m2) = [(${mass1} - ${e} × ${mass2}) × ${v1x.toFixed(
          2
        )} + (1 + ${e}) × ${mass2} × ${v2x.toFixed(2)}]/(${mass1} + ${mass2}) = ${v1xFinal.toFixed(2)} m/s`
      );
      steps.push(
        `Final velocity Object 2 (x): v2_x' = [(m2 - e m1) v2_x + (1 + e) m1 v1_x]/(m1 + m2) = [(${mass2} - ${e} × ${mass1}) × ${v2x.toFixed(
          2
        )} + (1 + ${e}) × ${mass1} × ${v1x.toFixed(2)}]/(${mass1} + ${mass2}) = ${v2xFinal.toFixed(2)} m/s`
      );
      if (dimension === "2d") {
        v1yFinal = ((mass1 - e * mass2) * v1y + (1 + e) * mass2 * v2y) / (mass1 + mass2);
        v2yFinal = ((mass2 - e * m1) * v2y + (1 + e) * m1 * v1y) / (mass1 + mass2);
        steps.push(
          `Final velocity Object 1 (y): v1_y' = [(m1 - e m2) v1_y + (1 + e) m2 v2_y]/(m1 + m2) = [(${mass1} - ${e} × ${mass2}) × ${v1y.toFixed(
            2
          )} + (1 + ${e}) × ${mass2} × ${v2y.toFixed(2)}]/(${mass1} + ${mass2}) = ${v1yFinal.toFixed(2)} m/s`
        );
        steps.push(
          `Final velocity Object 2 (y): v2_y' = [(m2 - e m1) v2_y + (1 + e) m1 v1_y]/(m1 + m2) = [(${mass2} - ${e} × ${mass1}) × ${v2y.toFixed(
            2
          )} + (1 + ${e}) × ${mass1} × ${v1y.toFixed(2)}]/(${mass1} + ${mass2}) = ${v2yFinal.toFixed(2)} m/s`
        );
      } else {
        v1yFinal = v2yFinal = 0;
      }
    }

    // Final momentum
    const p1xFinal = mass1 * v1xFinal;
    const p1yFinal = mass1 * v1yFinal;
    const p2xFinal = mass2 * v2xFinal;
    const p2yFinal = mass2 * v2yFinal;
    steps.push(
      `Final momentum Object 1: p1_x' = m1 v1_x' = ${mass1} × ${v1xFinal.toFixed(2)} = ${p1xFinal.toFixed(
        2
      )} kg·m/s${
        dimension === "2d"
          ? `, p1_y' = ${mass1} × ${v1yFinal.toFixed(2)} = ${p1yFinal.toFixed(2)} kg·m/s`
          : ""
      }`
    );
    steps.push(
      `Final momentum Object 2: p2_x' = m2 v2_x' = ${mass2} × ${v2xFinal.toFixed(2)} = ${p2xFinal.toFixed(
        2
      )} kg·m/s${
        dimension === "2d"
          ? `, p2_y' = ${mass2} × ${v2yFinal.toFixed(2)} = ${p2yFinal.toFixed(2)} kg·m/s`
          : ""
      }`
    );

    // Total final momentum
    const totalPxFinal = p1xFinal + p2xFinal;
    const totalPyFinal = p1yFinal + p2yFinal;
    steps.push(
      `Total final momentum: p_x' = p1_x' + p2_x' = ${p1xFinal.toFixed(2)} + ${p2xFinal.toFixed(
        2
      )} = ${totalPxFinal.toFixed(2)} kg·m/s${
        dimension === "2d"
          ? `, p_y' = ${p1yFinal.toFixed(2)} + ${p2yFinal.toFixed(2)} = ${totalPyFinal.toFixed(2)} kg·m/s`
          : ""
      }`
    );

    // Impulse
    const impulse1x = p1xFinal - p1x;
    const impulse1y = p1yFinal - p1y;
    steps.push(
      `Impulse on Object 1: J1_x = p1_x' - p1_x = ${p1xFinal.toFixed(2)} - ${p1x.toFixed(
        2
      )} = ${impulse1x.toFixed(2)} N·s${
        dimension === "2d"
          ? `, J1_y = ${p1yFinal.toFixed(2)} - ${p1y.toFixed(2)} = ${impulse1y.toFixed(2)} N·s`
          : ""
      }`
    );

    // Final kinetic energy
    const ke1Final = 0.5 * mass1 * (v1xFinal * v1xFinal + v1yFinal * v1yFinal);
    const ke2Final = 0.5 * mass2 * (v2xFinal * v2xFinal + v2yFinal * v2yFinal);
    finalKE = ke1Final + ke2Final;
    steps.push(
      `Final KE Object 1: KE1' = ½ m1 (v1_x'² + v1_y'²) = ½ × ${mass1} × (${v1xFinal.toFixed(
        2
      )}² + ${v1yFinal.toFixed(2)}²) = ${ke1Final.toFixed(2)} J`
    );
    steps.push(
      `Final KE Object 2: KE2' = ½ m2 (v2_x'² + v2_y'²) = ½ × ${mass2} × (${v2xFinal.toFixed(
        2
      )}² + ${v2yFinal.toFixed(2)}²) = ${ke2Final.toFixed(2)} J`
    );
    steps.push(`Total final KE: ${ke1Final.toFixed(2)} + ${ke2Final.toFixed(2)} = ${finalKE.toFixed(2)} J`);

    // Display results
    setResults(
      <div>
        <p>
          Object 1 Initial Momentum: ({p1x.toFixed(2)}
          {dimension === "2d" ? `, ${p1y.toFixed(2)}` : ""}) kg·m/s
        </p>
        <p>
          Object 2 Initial Momentum: ({p2x.toFixed(2)}
          {dimension === "2d" ? `, ${p2y.toFixed(2)}` : ""}) kg·m/s
        </p>
        <p>
          Total Initial Momentum: ({totalPx.toFixed(2)}
          {dimension === "2d" ? `, ${totalPy.toFixed(2)}` : ""}) kg·m/s
        </p>
        <p>
          Object 1 Final Velocity: ({v1xFinal.toFixed(2)}
          {dimension === "2d" ? `, ${v1yFinal.toFixed(2)}` : ""}) m/s
        </p>
        <p>
          Object 2 Final Velocity: ({v2xFinal.toFixed(2)}
          {dimension === "2d" ? `, ${v2yFinal.toFixed(2)}` : ""}) m/s
        </p>
        <p>
          Impulse on Object 1: ({impulse1x.toFixed(2)}
          {dimension === "2d" ? `, ${impulse1y.toFixed(2)}` : ""}) N·s
        </p>
        <p>Initial Kinetic Energy: {totalKE.toFixed(2)} J</p>
        <p>Final Kinetic Energy: {finalKE.toFixed(2)} J</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
        {steps.map((step, idx) => (
          <p key={idx} className="text-sm text-gray-700 mb-2">
            {step}
          </p>
        ))}
      </div>
    );

    // Add to history
    setHistory([
      ...history,
      {
        mode,
        dimension,
        collisionType,
        restitution: collisionType === "partial" ? restitution : null,
        angleUnit,
        mass1,
        mass2,
        initialVelocities: { v1x, v1y, v2x, v2y },
        finalVelocities: { v1x: v1xFinal, v1y: v1yFinal, v2x: v2xFinal, v2y: v2yFinal },
        initialMomentum: { p1x, p1y, p2x, p2y },
        finalMomentum: { p1x: p1xFinal, p1y: p1yFinal, p2x: p2xFinal, p2y: p2yFinal },
        impulse: { x: impulse1x, y: impulse1y },
        initialKE: totalKE,
        finalKE,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Plot graph
    plotGraph(p1x, p1y, p2x, p2y, p1xFinal, p1yFinal, p2xFinal, p2yFinal);
  };

  const importFromVectorResolver = () => {
    alert("Import from Vector Resolver not implemented. Please enter velocities manually.");
  };

  const plotGraph = (p1x, p1y, p2x, p2y, p1xFinal, p1yFinal, p2xFinal, p2yFinal) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#000000";
    ctx.fillText("Initial and Final Momentum Vectors", 10, 20);

    const maxX = Math.max(Math.abs(p1x), Math.abs(p2x), Math.abs(p1xFinal), Math.abs(p2xFinal), 10);
    const maxY = Math.max(Math.abs(p1y), Math.abs(p2y), Math.abs(p1yFinal), Math.abs(p2yFinal), 10);
    const scale = Math.min((canvas.width - 100) / (2 * maxX), (canvas.height - 100) / (2 * maxY));
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(50, cy);
    ctx.lineTo(canvas.width - 50, cy);
    ctx.moveTo(cx, 50);
    ctx.lineTo(cx, canvas.height - 50);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw initial momentum Object 1 (blue)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + p1x * scale, cy - p1y * scale);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();
    let angle = Math.atan2(-p1y, p1x);
    ctx.beginPath();
    ctx.moveTo(cx + p1x * scale, cy - p1y * scale);
    ctx.lineTo(
      cx + p1x * scale - 10 * Math.cos(angle - Math.PI / 6),
      cy - p1y * scale + 10 * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(cx + p1x * scale, cy - p1y * scale);
    ctx.lineTo(
      cx + p1x * scale - 10 * Math.cos(angle + Math.PI / 6),
      cy - p1y * scale + 10 * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Draw initial momentum Object 2 (red)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + p2x * scale, cy - p2y * scale);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();
    angle = Math.atan2(-p2y, p2x);
    ctx.beginPath();
    ctx.moveTo(cx + p2x * scale, cy - p2y * scale);
    ctx.lineTo(
      cx + p2x * scale - 10 * Math.cos(angle - Math.PI / 6),
      cy - p2y * scale + 10 * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(cx + p2x * scale, cy - p2y * scale);
    ctx.lineTo(
      cx + p2x * scale - 10 * Math.cos(angle + Math.PI / 6),
      cy - p2y * scale + 10 * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Draw final momentum Object 1 (cyan, dashed)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + p1xFinal * scale, cy - p1yFinal * scale);
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    angle = Math.atan2(-p1yFinal, p1xFinal);
    ctx.beginPath();
    ctx.moveTo(cx + p1xFinal * scale, cy - p1yFinal * scale);
    ctx.lineTo(
      cx + p1xFinal * scale - 10 * Math.cos(angle - Math.PI / 6),
      cy - p1yFinal * scale + 10 * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(cx + p1xFinal * scale, cy - p1yFinal * scale);
    ctx.lineTo(
      cx + p1xFinal * scale - 10 * Math.cos(angle + Math.PI / 6),
      cy - p1yFinal * scale + 10 * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw final momentum Object 2 (pink, dashed)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + p2xFinal * scale, cy - p2yFinal * scale);
    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    angle = Math.atan2(-p2yFinal, p2xFinal);
    ctx.beginPath();
    ctx.moveTo(cx + p2xFinal * scale, cy - p2yFinal * scale);
    ctx.lineTo(
      cx + p2xFinal * scale - 10 * Math.cos(angle - Math.PI / 6),
      cy - p2yFinal * scale + 10 * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(cx + p2xFinal * scale, cy - p2yFinal * scale);
    ctx.lineTo(
      cx + p2xFinal * scale - 10 * Math.cos(angle + Math.PI / 6),
      cy - p2yFinal * scale + 10 * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const clearInputs = () => {
    setInputs({
      restitution: "",
      mass1: "",
      velocityMag1: "",
      velocityAngle1: "",
      velocityX1: "",
      velocityY1: "",
      mass2: "",
      velocityMag2: "",
      velocityAngle2: "",
      velocityX2: "",
      velocityY2: "",
    });
    setResults(null);
    setHistory([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const exportCSV = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const csv = [
      "Run,CollisionType,Dimension,Timestamp,Mass1,Mass2,V1x,V1y,V2x,V2y,V1xFinal,V1yFinal,V2xFinal,V2yFinal,ImpulseX,ImpulseY,InitialKE,FinalKE",
      ...history.map(
        (run, index) => `
        ${index + 1},${run.collisionType},${run.dimension},${run.timestamp},
        ${run.mass1.toFixed(2)},${run.mass2.toFixed(2)},
        ${run.initialVelocities.v1x.toFixed(2)},${
          run.dimension === "2d" ? run.initialVelocities.v1y.toFixed(2) : ""
        },
        ${run.initialVelocities.v2x.toFixed(2)},${
          run.dimension === "2d" ? run.initialVelocities.v2y.toFixed(2) : ""
        },
        ${run.finalVelocities.v1x.toFixed(2)},${
          run.dimension === "2d" ? run.finalVelocities.v1y.toFixed(2) : ""
        },
        ${run.finalVelocities.v2x.toFixed(2)},${
          run.dimension === "2d" ? run.finalVelocities.v2y.toFixed(2) : ""
        },
        ${run.impulse.x.toFixed(2)},${run.dimension === "2d" ? run.impulse.y.toFixed(2) : ""},
        ${run.initialKE.toFixed(2)},${run.finalKE.toFixed(2)}
      `
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "momentum_collision_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!history.length) {
      alert("No data to export.");
      return;
    }
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "momentum_collision_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculateCollision();
    if (e.key === "c") clearInputs();
  };

  return (
    <div
      className=" bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-5xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Momentum and Collision Calculator
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-2">
              Input Mode:
            </label>
            <select
              id="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Input mode"
            >
              <option value="scalar">Scalar (Magnitude + Angle)</option>
              <option value="vector">Vector Components</option>
            </select>
          </div>
          <div>
            <label htmlFor="dimension" className="block text-sm font-medium text-gray-700 mb-2">
              Dimension:
            </label>
            <select
              id="dimension"
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Dimension"
            >
              <option value="1d">1D</option>
              <option value="2d">2D</option>
            </select>
          </div>
          <div>
            <label htmlFor="collision-type" className="block text-sm font-medium text-gray-700 mb-2">
              Collision Type:
            </label>
            <select
              id="collision-type"
              value={collisionType}
              onChange={(e) => setCollisionType(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Collision type"
            >
              <option value="elastic">Elastic</option>
              <option value="inelastic">Perfectly Inelastic</option>
              <option value="partial">Partially Inelastic</option>
            </select>
          </div>
          {collisionType === "partial" && (
            <div>
              <label htmlFor="restitution" className="block text-sm font-medium text-gray-700 mb-2">
                Coefficient of Restitution (0-1):
              </label>
              <input
                type="text"
                id="restitution"
                name="restitution"
                value={inputs.restitution}
                onChange={handleInputChange}
                placeholder="e.g., 0.8"
                className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Coefficient of restitution"
              />
            </div>
          )}
          <div>
            <label htmlFor="angle-unit" className="block text-sm font-medium text-gray-700 mb-2">
              Angle Unit:
            </label>
            <select
              id="angle-unit"
              value={angleUnit}
              onChange={(e) => setAngleUnit(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Angle unit"
            >
              <option value="deg">Degrees</option>
              <option value="rad">Radians</option>
            </select>
          </div>
        </div>
        <div className="mb-4 p-4 bg-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Object 1</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="mass-1" className="block text-sm font-medium text-gray-700 mb-2">
                Mass (kg):
              </label>
              <input
                type="text"
                id="mass-1"
                name="mass1"
                value={inputs.mass1}
                onChange={handleInputChange}
                placeholder="e.g., 1"
                className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Mass of object 1"
              />
            </div>
            {mode === "scalar" && (
              <>
                <div>
                  <label htmlFor="velocity-mag-1" className="block text-sm font-medium text-gray-700 mb-2">
                    Velocity Magnitude (m/s):
                  </label>
                  <input
                    type="text"
                    id="velocity-mag-1"
                    name="velocityMag1"
                    value={inputs.velocityMag1}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    aria-label="Velocity magnitude of object 1"
                  />
                </div>
                <div>
                  <label htmlFor="velocity-angle-1" className="block text-sm font-medium text-gray-700 mb-2">
                    Angle (θ):
                  </label>
                  <input
                    type="text"
                    id="velocity-angle-1"
                    name="velocityAngle1"
                    value={inputs.velocityAngle1}
                    onChange={handleInputChange}
                    placeholder="e.g., 0"
                    className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    aria-label="Velocity angle of object 1"
                  />
                </div>
              </>
            )}
            {mode === "vector" && (
              <>
                <div>
                  <label htmlFor="velocity-x-1" className="block text-sm font-medium text-gray-700 mb-2">
                    x-velocity (m/s):
                  </label>
                  <input
                    type="text"
                    id="velocity-x-1"
                    name="velocityX1"
                    value={inputs.velocityX1}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    aria-label="x-velocity of object 1"
                  />
                </div>
                {dimension === "2d" && (
                  <div>
                    <label htmlFor="velocity-y-1" className="block text-sm font-medium text-gray-700 mb-2">
                      y-velocity (m/s):
                    </label>
                    <input
                      type="text"
                      id="velocity-y-1"
                      name="velocityY1"
                      value={inputs.velocityY1}
                      onChange={handleInputChange}
                      placeholder="e.g., 0"
                      className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                      aria-label="y-velocity of object 1"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="mb-4 p-4 bg-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Object 2</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="mass-2" className="block text-sm font-medium text-gray-700 mb-2">
                Mass (kg):
              </label>
              <input
                type="text"
                id="mass-2"
                name="mass2"
                value={inputs.mass2}
                onChange={handleInputChange}
                placeholder="e.g., 2"
                className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                aria-label="Mass of object 2"
              />
            </div>
            {mode === "scalar" && (
              <>
                <div>
                  <label htmlFor="velocity-mag-2" className="block text-sm font-medium text-gray-700 mb-2">
                    Velocity Magnitude (m/s):
                  </label>
                  <input
                    type="text"
                    id="velocity-mag-2"
                    name="velocityMag2"
                    value={inputs.velocityMag2}
                    onChange={handleInputChange}
                    placeholder="e.g., 3"
                    className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    aria-label="Velocity magnitude of object 2"
                  />
                </div>
                <div>
                  <label htmlFor="velocity-angle-2" className="block text-sm font-medium text-gray-700 mb-2">
                    Angle (θ):
                  </label>
                  <input
                    type="text"
                    id="velocity-angle-2"
                    name="velocityAngle2"
                    value={inputs.velocityAngle2}
                    onChange={handleInputChange}
                    placeholder="e.g., 180"
                    className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    aria-label="Velocity angle of object 2"
                  />
                </div>
              </>
            )}
            {mode === "vector" && (
              <>
                <div>
                  <label htmlFor="velocity-x-2" className="block text-sm font-medium text-gray-700 mb-2">
                    x-velocity (m/s):
                  </label>
                  <input
                    type="text"
                    id="velocity-x-2"
                    name="velocityX2"
                    value={inputs.velocityX2}
                    onChange={handleInputChange}
                    placeholder="e.g., -3"
                    className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    aria-label="x-velocity of object 2"
                  />
                </div>
                {dimension === "2d" && (
                  <div>
                    <label htmlFor="velocity-y-2" className="block text-sm font-medium text-gray-700 mb-2">
                      y-velocity (m/s):
                    </label>
                    <input
                      type="text"
                      id="velocity-y-2"
                      name="velocityY2"
                      value={inputs.velocityY2}
                      onChange={handleInputChange}
                      placeholder="e.g., 0"
                      className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                      aria-label="y-velocity of object 2"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculateCollision}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
          </button>
          <button
            onClick={importFromVectorResolver}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Import from Vector Resolver
          </button>
          <button
            onClick={clearInputs}
            className="flex-1 min-w-[120px] py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Clear
          </button>
          <button
            onClick={exportCSV}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Export CSV
          </button>
          <button
            onClick={exportJSON}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Export JSON
          </button>
        </div>
        <canvas ref={canvasRef} className="w-full h-96 bg-gray-100 rounded-lg mb-4 border border-gray-200" />
        <div className="p-4 bg-gray-200 rounded-lg mb-4">{results}</div>
        <div className="p-4 bg-gray-200 rounded-lg max-h-52 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Calculation History</h2>
          <div>
            {history.map((run, index) => (
              <div key={index} className="p-2 mb-2 bg-white rounded-lg shadow-sm">
                <p>
                  Run {index + 1} ({run.collisionType}, {run.dimension},{" "}
                  {new Date(run.timestamp).toLocaleString()}):
                </p>
                <p>
                  Object 1: m1 = {run.mass1.toFixed(2)} kg, v1 = ({run.initialVelocities.v1x.toFixed(2)}
                  {run.dimension === "2d" ? `, ${run.initialVelocities.v1y.toFixed(2)}` : ""}) m/s
                </p>
                <p>
                  Object 2: m2 = {run.mass2.toFixed(2)} kg, v2 = ({run.initialVelocities.v2x.toFixed(2)}
                  {run.dimension === "2d" ? `, ${run.initialVelocities.v2y.toFixed(2)}` : ""}) m/s
                </p>
                <p>
                  Final v1: ({run.finalVelocities.v1x.toFixed(2)}
                  {run.dimension === "2d" ? `, ${run.finalVelocities.v1y.toFixed(2)}` : ""}) m/s
                </p>
                <p>
                  Final v2: ({run.finalVelocities.v2x.toFixed(2)}
                  {run.dimension === "2d" ? `, ${run.finalVelocities.v2y.toFixed(2)}` : ""}) m/s
                </p>
                <p>
                  Impulse on Object 1: ({run.impulse.x.toFixed(2)}
                  {run.dimension === "2d" ? `, ${run.impulse.y.toFixed(2)}` : ""}) N·s
                </p>
                <p>
                  KE: Initial = {run.initialKE.toFixed(2)} J, Final = {run.finalKE.toFixed(2)} J
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomentumCollisionCalculator;
