
"use client";
import React from "react";
import HeroSection from "@/components/pages/converters/metal/HeroSection";
import ConverterSection from "@/components/pages/converters/metal/ConverterSection";
import MetalPricesSection from "@/components/pages/converters/metal/MetalPricesSection";
import ConversionTable from "@/components/pages/converters/metal/ConversionTable";
import { useMetalConverter } from "@/hooks/useMetalConverter";

function App() {
  const {
    currencies,
    metalPrices,
    metalCurrency,
    setMetalCurrency,
    metalAmount,
    setMetalAmount,
    metalFromCurrency,
    setMetalFromCurrency,
    selectedMetal,
    setSelectedMetal,
    metalResult,
    metalMetadata,
    error,
    metalTable,
    fetchedAt,
    isLoading,
  } = useMetalConverter();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <HeroSection
        title="Precious Metal Converter"
        subtitle="Convert currencies to precious metals with real-time market rates. Get accurate gold, silver, platinum, and other metal conversions instantly."
      />

      <ConverterSection
        currencies={currencies}
        metalPrices={metalPrices}
        metalAmount={metalAmount}
        setMetalAmount={setMetalAmount}
        metalFromCurrency={metalFromCurrency}
        setMetalFromCurrency={setMetalFromCurrency}
        selectedMetal={selectedMetal}
        setSelectedMetal={setSelectedMetal}
        error={error}
        metalResult={metalResult}
        metalMetadata={metalMetadata}
        fetchedAt={fetchedAt}
        isLoading={isLoading}
      />

      <MetalPricesSection
        currencies={currencies}
        metalPrices={metalPrices}
        metalCurrency={metalCurrency}
        setMetalCurrency={setMetalCurrency}
        isLoading={isLoading}
      />

      <ConversionTable metalTable={metalTable} metalMetadata={metalMetadata} />
    </div>
  );
}

export default App;
