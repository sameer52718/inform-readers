'use client';

import React, { useState, useRef, useEffect } from 'react';

const MagnitudeAccelerationCalculator = () => {
  const [unitSystem, setUnitSystem] = useState('si');
  const [inputs, setInputs] = useState({
    ax: '',
    ay: '',
    az: '',
    velocity: '',
    radius: '',
    gravity: '',
  });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const g_default = 9.81; // m/s²
  const ft_to_m = 0.3048; // ft to m
  const mph_to_m_per_s = 0.44704; // mph to m/s

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 400;
    }
  }, []);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const ax = parseFloat(inputs.ax) || 0;
    const ay = parseFloat(inputs.ay) || 0;
    const az = parseFloat(inputs.az) || 0;
    const velocity = parseFloat(inputs.velocity);
    const radius = parseFloat(inputs.radius);
    const gravity = parseFloat(inputs.gravity) || (unitSystem === 'si' ? g_default : g_default / ft_to_m);
    const steps = [];

    // Unit conversions
    let a_x = ax, a_y = ay, a_z = az, v = velocity, r = radius, a_g = gravity;
    if (unitSystem === 'imperial') {
      a_x *= ft_to_m; // ft/s² to m/s²
      a_y *= ft_to_m; // ft/s² to m/s²
      a_z *= ft_to_m; // ft/s² to m/s²
      a_g *= ft_to_m; // ft/s² to m/s²
      if (!isNaN(v)) v *= mph_to_m_per_s; // mph to m/s
      if (!isNaN(r)) r *= ft_to_m; // ft to m
      steps.push('Converted accelerations (ft/s² to m/s²), velocity (mph to m/s), radius (ft to m).');
    }

    if ((isNaN(ax) && isNaN(ay) && isNaN(az)) && (isNaN(v) || isNaN(r)) && isNaN(gravity)) {
      setResults(<p className="text-red-500">At least one acceleration component required.</p>);
      return;
    }

    let a_c = 0;
    if (!isNaN(v) && !isNaN(r) && r > 0) {
      a_c = (v * v) / r;
      steps.push(`Centripetal acceleration: a_c = v² / r = ${v.toFixed(2)}² / ${r.toFixed(2)} = ${a_c.toFixed(2)} m/s²`);
    } else if (!isNaN(v) !== !isNaN(r)) {
      setResults(<p className="text-red-500">Both velocity and radius required for centripetal acceleration.</p>);
      return;
    }

    // Calculate total acceleration
    const a_total = Math.sqrt(a_x * a_x + a_y * a_y + a_z * a_z + a_c * a_c + a_g * a_g);
    const theta = (a_x !== 0 || a_y !== 0) ? Math.atan2(a_y, a_x) * 180 / Math.PI : 0;
    steps.push(
      `Total acceleration: a = √(a_x² + a_y² + a_z² + a_c² + a_g²) = √(${a_x.toFixed(2)}² + ${a_y.toFixed(2)}² + ${a_z.toFixed(2)}² + ${a_c.toFixed(2)}² + ${a_g.toFixed(2)}²) = ${a_total.toFixed(2)} m/s²`
    );
    if (theta !== 0) steps.push(`Direction (2D): θ = atan2(a_y, a_x) = ${theta.toFixed(2)}°`);

    // Convert back for display
    let a_x_display = ax, a_y_display = ay, a_z_display = az, a_c_display = a_c, a_g_display = gravity, a_total_display = a_total;
    if (unitSystem === 'imperial') {
      a_x_display /= ft_to_m; // m/s² to ft/s²
      a_y_display /= ft_to_m; // m/s² to ft/s²
      a_z_display /= ft_to_m; // m/s² to ft/s²
      a_c_display /= ft_to_m; // m/s² to ft/s²
      a_g_display /= ft_to_m; // m/s² to ft/s²
      a_total_display /= ft_to_m; // m/s² to ft/s²
      steps.push('Converted accelerations (m/s² to ft/s²).');
    }

    const result = {
      unitSystem,
      ax: a_x_display,
      ay: a_y_display,
      az: a_z_display,
      velocity: velocity || 0,
      radius: radius || 0,
      gravity: a_g_display,
      centripetal: a_c_display,
      total: a_total_display,
      angle: theta,
      timestamp: new Date().toISOString(),
    };

    // Display results
    setResults(
      <div>
        <p>X-Acceleration: {a_x_display.toFixed(2)} {unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
        <p>Y-Acceleration: {a_y_display.toFixed(2)} {unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
        <p>Z-Acceleration: {a_z_display.toFixed(2)} {unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
        {a_c_display > 0 && (
          <p>Centripetal Acceleration: {a_c_display.toFixed(2)} {unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
        )}
        <p>Gravitational Acceleration: {a_g_display.toFixed(2)} {unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
        <p>Total Acceleration: {a_total_display.toFixed(2)} {unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
        {theta !== 0 && <p>Direction (2D): {theta.toFixed(2)}°</p>}
        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Solution Steps</h2>
        {steps.map((step, idx) => (
          <p key={idx} className="text-sm text-gray-700 mb-2">{step}</p>
        ))}
      </div>
    );

    // Add to history
    setHistory([...history, result]);

    // Plot graph
    plotGraph(result);
  };

  const plotGraph = (result) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '12px Inter';
    ctx.fillStyle = '#000000';
    ctx.fillText('Acceleration Vector Diagram', 10, 20);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const scale = 50; // Pixels per unit (m/s² or ft/s²)

    // Convert to display units
    const a_x = result.ax;
    const a_y = result.ay;
    const a_z = result.az;
    const a_c = result.centripetal;
    const a_g = result.gravity;
    const a_total = result.total;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(cx - 200, cy);
    ctx.lineTo(cx + 200, cy);
    ctx.moveTo(cx, cy - 200);
    ctx.lineTo(cx, cy + 200);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillText('X', cx + 210, cy + 5);
    ctx.fillText('Y', cx - 5, cy - 210);

    // Draw component vectors
    const components = [
      { x: a_x, y: 0, color: '#ef4444', label: 'a_x' },
      { x: 0, y: a_y, color: '#10b981', label: 'a_y' },
      { x: 0, y: a_c, color: '#3b82f6', label: 'a_c' },
      { x: 0, y: a_g, color: '#f59e0b', label: 'a_g' },
    ];

    let x_total = a_x, y_total = a_y + a_c + a_g;
    components.forEach((comp) => {
      if (comp.x !== 0 || comp.y !== 0) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + comp.x * scale, cy - comp.y * scale);
        ctx.strokeStyle = comp.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = comp.color;
        ctx.fillText(comp.label, cx + comp.x * scale + 5, cy - comp.y * scale - 5);
      }
      if (comp.x !== 0) x_total += comp.x;
    });

    // Draw total vector
    if (x_total !== 0 || y_total !== 0) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + x_total * scale, cy - y_total * scale);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#a855f7';
      ctx.fillText(`a_total = ${a_total.toFixed(2)}`, cx + x_total * scale + 5, cy - y_total * scale - 5);
    }

    // Indicate Z-component (if non-zero)
    if (a_z !== 0) {
      ctx.fillStyle = '#000000';
      ctx.fillText(
        `Z-Acceleration: ${a_z.toFixed(2)} ${result.unitSystem === 'si' ? 'm/s²' : 'ft/s²'} (out of plane)`,
        cx - 100,
        cy + 180
      );
    }
  };

  const clearInputs = () => {
    setInputs({
      ax: '',
      ay: '',
      az: '',
      velocity: '',
      radius: '',
      gravity: '',
    });
    setResults(null);
    setHistory([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const exportCSV = () => {
    if (!history.length) {
      alert('No data to export.');
      return;
    }
    const csv = [
      'Run,UnitSystem,Timestamp,ax,ay,az,velocity,radius,gravity,centripetal,total,angle',
      ...history.map(
        (run, index) => `
        ${index + 1},${run.unitSystem},${run.timestamp},${run.ax.toFixed(2)},${run.ay.toFixed(2)},
        ${run.az.toFixed(2)},${run.velocity.toFixed(2)},${run.radius.toFixed(2)},
        ${run.gravity.toFixed(2)},${run.centripetal.toFixed(2)},${run.total.toFixed(2)},${run.angle.toFixed(2)}
      `
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'magnitude_acceleration_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!history.length) {
      alert('No data to export.');
      return;
    }
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'magnitude_acceleration_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') calculate();
    if (e.key === 'c') clearInputs();
  };

  return (
    <div
      className=" bg-white flex justify-center items-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-4xl text-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Magnitude of Acceleration Calculator
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="unit-system" className="block text-sm font-medium text-gray-700 mb-2">
              Unit System:
            </label>
            <select
              id="unit-system"
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Unit system"
            >
              <option value="si">SI (m, s)</option>
              <option value="imperial">Imperial (ft, s)</option>
            </select>
          </div>
          <div>
            <label htmlFor="ax" className="block text-sm font-medium text-gray-700 mb-2">
              X-Acceleration:
            </label>
            <input
              type="text"
              id="ax"
              name="ax"
              value={inputs.ax}
              onChange={handleInputChange}
              placeholder="e.g., 2 (m/s² or ft/s²)"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="X-acceleration"
            />
          </div>
          <div>
            <label htmlFor="ay" className="block text-sm font-medium text-gray-700 mb-2">
              Y-Acceleration:
            </label>
            <input
              type="text"
              id="ay"
              name="ay"
              value={inputs.ay}
              onChange={handleInputChange}
              placeholder="e.g., 3 (m/s² or ft/s²)"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Y-acceleration"
            />
          </div>
          <div>
            <label htmlFor="az" className="block text-sm font-medium text-gray-700 mb-2">
              Z-Acceleration (optional):
            </label>
            <input
              type="text"
              id="az"
              name="az"
              value={inputs.az}
              onChange={handleInputChange}
              placeholder="e.g., 0 (m/s² or ft/s²)"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Z-acceleration"
            />
          </div>
          <div>
            <label htmlFor="velocity" className="block text-sm font-medium text-gray-700 mb-2">
              Velocity (optional):
            </label>
            <input
              type="text"
              id="velocity"
              name="velocity"
              value={inputs.velocity}
              onChange={handleInputChange}
              placeholder="e.g., 10 (m/s or mph)"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Velocity"
            />
          </div>
          <div>
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-2">
              Radius (optional):
            </label>
            <input
              type="text"
              id="radius"
              name="radius"
              value={inputs.radius}
              onChange={handleInputChange}
              placeholder="e.g., 5 (m or ft)"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Radius"
            />
          </div>
          <div>
            <label htmlFor="gravity" className="block text-sm font-medium text-gray-700 mb-2">
              Gravitational Acceleration (optional):
            </label>
            <input
              type="text"
              id="gravity"
              name="gravity"
              value={inputs.gravity}
              onChange={handleInputChange}
              placeholder="e.g., 9.81 (m/s² or ft/s²)"
              className="w-full p-2 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              aria-label="Gravitational acceleration"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={calculate}
            className="flex-1 min-w-[120px] py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Calculate
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
        <canvas
          ref={canvasRef}
          className="w-full h-96 bg-gray-100 rounded-lg mb-4 border border-gray-200"
        />
        <div className="p-4 bg-gray-200 rounded-lg mb-4">{results}</div>
        <div className="p-4 bg-gray-200 rounded-lg max-h-52 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Calculation History</h2>
          <div>
            {history.map((run, index) => (
              <div key={index} className="p-2 mb-2 bg-white rounded-lg shadow-sm">
                <p>Run {index + 1} ({run.unitSystem}, {new Date(run.timestamp).toLocaleString()}):</p>
                <p>X-Acceleration: {run.ax.toFixed(2)} {run.unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
                <p>Y-Acceleration: {run.ay.toFixed(2)} {run.unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
                <p>Z-Acceleration: {run.az.toFixed(2)} {run.unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
                {run.centripetal > 0 && (
                  <p>Centripetal Acceleration: {run.centripetal.toFixed(2)} {run.unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
                )}
                <p>Gravitational Acceleration: {run.gravity.toFixed(2)} {run.unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
                <p>Total Acceleration: {run.total.toFixed(2)} {run.unitSystem === 'si' ? 'm/s²' : 'ft/s²'}</p>
                {run.angle !== 0 && <p>Direction (2D): {run.angle.toFixed(2)}°</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default MagnitudeAccelerationCalculator