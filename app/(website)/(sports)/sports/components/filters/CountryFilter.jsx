"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function CountryFilter({ selectedCountries, onCountriesChange, availableCountries, className }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = useMemo(() => {
    return availableCountries.filter((country) => country.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [availableCountries, searchTerm]);

  const toggleCountry = (country) => {
    if (selectedCountries.includes(country)) {
      onCountriesChange(selectedCountries.filter((c) => c !== country));
    } else {
      onCountriesChange([...selectedCountries, country]);
    }
  };

  const clearAllFilters = () => {
    onCountriesChange([]);
    setSearchTerm("");
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5 text-red-500" />
          Filter by Country
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Selected Countries */}
        {selectedCountries.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Selected ({selectedCountries.length})</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-auto p-1"
              >
                Clear all
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCountries.map((country) => (
                <Badge
                  key={country}
                  variant="secondary"
                  className="bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer flex items-center gap-1"
                  onClick={() => toggleCountry(country)}
                >
                  {country}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available Countries */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Available Countries</span>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <Button
                  key={country}
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCountry(country)}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    selectedCountries.includes(country)
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "hover:bg-gray-50"
                  )}
                >
                  {country}
                  {selectedCountries.includes(country) && <X className="w-3 h-3 ml-auto" />}
                </Button>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-2">No countries found</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
