'use client';

import { useState, useEffect } from 'react';

export default function TempToggle({ onToggle }) {
  const [unit, setUnit] = useState('F');

  useEffect(() => {
    const savedUnit = localStorage.getItem('tempUnit') || 'F';
    setUnit(savedUnit);
    if (onToggle) onToggle(savedUnit);
  }, []);

  const handleToggle = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem('tempUnit', newUnit);
    if (onToggle) onToggle(newUnit);
  };

  return (
    <div className="inline-flex border border-gray-400 rounded-sm bg-white">
      <button
        onClick={() => handleToggle('F')}
        className={`px-2 py-1 text-xs font-medium ${
          unit === 'F' 
            ? 'bg-red-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        °F
      </button>
      <button
        onClick={() => handleToggle('C')}
        className={`px-2 py-1 text-xs font-medium ${
          unit === 'C' 
            ? 'bg-red-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        °C
      </button>
    </div>
  );
}