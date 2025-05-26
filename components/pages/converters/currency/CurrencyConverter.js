"use client";
import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

import Header from "@/components/pages/converters/currency/Header";
import ConversionForm from "@/components/pages/converters/currency/ConversionForm";
import ResultDisplay from "@/components/pages/converters/currency/ResultDisplay";
import CurrencyInfo from "@/components/pages/converters/currency/CurrencyInfo";
import ConversionTable from "@/components/pages/converters/currency/ConversionTable";
import Loading from "@/components/pages/converters/currency/Loading";

export default function CurrencyConverter() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState(10);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [conversionTable, setConversionTable] = useState([]);

  // Fetch available currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axiosInstance.get("/website/currency");
        if (response.data.success) {
          setCurrencies(response.data.currencies);
        } else {
          setError("Failed to load currencies");
        }
      } catch (err) {
        setError("Error fetching currencies");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  // Perform conversion
  const convertCurrency = async () => {
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      setResult(null);
      setMetadata(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/website/currency/convert", {
        params: { amount, fromCurrency, toCurrency },
      });
      if (response.data.success) {
        setResult(response.data.result);
        setMetadata(response.data.metadata);
        setError(null);

        // Generate conversion table
        const amounts = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];
        const table = amounts.map((amt) => ({
          amount: amt,
          converted: ((amt * response.data.result) / amount).toFixed(4),
        }));
        setConversionTable(table);
      } else {
        setError(response.data.message || "Conversion failed");
        setResult(null);
        setMetadata(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error performing conversion");
      setResult(null);
      setMetadata(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoading) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency, initialLoading]);

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="py-8 md:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Conversion Form */}
          <section className="mb-8">
            <ConversionForm
              amount={amount}
              setAmount={setAmount}
              fromCurrency={fromCurrency}
              setFromCurrency={setFromCurrency}
              toCurrency={toCurrency}
              setToCurrency={setToCurrency}
              currencies={currencies}
              swapCurrencies={swapCurrencies}
            />
          </section>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 text-center shadow-sm">{error}</div>
          )}

          {/* Loading or Results */}
          <Loading loading={isLoading} className="h-24 mb-8">
            {result && metadata && (
              <>
                {/* Result Display */}
                <section className="mb-8">
                  <ResultDisplay amount={amount} result={result} metadata={metadata} />
                </section>

                {/* Currency Information */}
                <section className="mb-8">
                  <CurrencyInfo metadata={metadata} />
                </section>

                {/* Conversion Tables */}
                <section className="mb-8">
                  <ConversionTable
                    conversionTable={conversionTable}
                    metadata={metadata}
                    amount={amount}
                    result={result}
                  />
                </section>
              </>
            )}
          </Loading>
        </div>
      </main>
    </div>
  );
}
