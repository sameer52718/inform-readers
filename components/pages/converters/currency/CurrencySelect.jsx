import React from "react";

const CurrencySelect = ({ label, value, onChange, currencies }) => {
  return (
    <div className="transition-all duration-300 hover:transform hover:scale-[1.02]">
      <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 appearance-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
          paddingRight: "2.5rem",
        }}
      >
        {currencies.map((currency) => (
          <option key={currency.baseCurrency} value={currency.baseCurrency}>
            {currency.baseCurrency} - {currency.fullName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelect;
