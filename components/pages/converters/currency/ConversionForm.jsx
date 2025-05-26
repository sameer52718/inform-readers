import React from "react";
import { ArrowLeftRight } from "lucide-react";
import CurrencySelect from "./CurrencySelect";
const ConversionForm = ({
  amount,
  setAmount,
  fromCurrency,
  setFromCurrency,
  toCurrency,
  setToCurrency,
  currencies,
  swapCurrencies,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="transition-all duration-300 hover:transform hover:scale-[1.02]">
          <label className="block text-sm font-medium mb-2 text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="0.01"
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
            placeholder="Enter amount"
          />
        </div>

        <CurrencySelect
          label="From"
          value={fromCurrency}
          onChange={setFromCurrency}
          currencies={currencies}
        />

        <CurrencySelect label="To" value={toCurrency} onChange={setToCurrency} currencies={currencies} />
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={swapCurrencies}
          className="group p-3 bg-gradient-to-r from-red-600 to-red-600 text-white rounded-lg hover:from-red-700 hover:to-red-700 transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
        >
          <ArrowLeftRight className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-medium">Swap Currencies</span>
        </button>
      </div>
    </div>
  );
};

export default ConversionForm;
