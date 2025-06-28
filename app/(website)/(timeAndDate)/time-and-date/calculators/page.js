"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import Chrono from "chrono-node";
import { Loader2 } from "lucide-react";

export default function CalculatorsPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const parsed = Chrono.parseDate(input);
    if (parsed) {
      const now = DateTime.now();
      const target = DateTime.fromJSDate(parsed);
      const diff = target.diff(now, ["days"]).toObject();
      setResult(`Difference: ${Math.abs(diff.days)} days`);
    } else {
      setResult("Invalid date input");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Calculators</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date Input (e.g., "next week")</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter date (e.g., next week)"
              className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600"
            />
          </div>
          <button
            onClick={handleCalculate}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Calculate
          </button>
          {result && <p className="mt-4 text-gray-700">{result}</p>}
        </div>
      </div>
    </main>
  );
}
