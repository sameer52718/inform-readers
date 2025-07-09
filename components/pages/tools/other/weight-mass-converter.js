"use client";

import { useState } from "react";

export default function Home() {
  const conversionFactors = {
    kilogram: 1,
    gram: 0.001,
    milligram: 1.0e-6,
    ton_metric: 1000,
    pound: 0.45359237,
    ounce: 0.0283495231,
    carat: 0.0002,
    ton_short: 907.18474,
    ton_long: 1016.0469088,
    atomic_mass_unit: 1.6605402e-27,
    exagram: 1.0e15,
    petagram: 1000000000000,
    teragram: 1000000000,
    gigagram: 1000000,
    megagram: 1000,
    hectogram: 0.1,
    dekagram: 0.01,
    decigram: 0.0001,
    centigram: 1.0e-5,
    microgram: 1.0e-9,
    nanogram: 1.0e-12,
    picogram: 1.0e-15,
    femtogram: 1.0e-18,
    attogram: 1.0e-21,
    dalton: 1.6605300000013e-27,
    kilogram_force: 9.80665,
    kilopound: 453.59237,
    kip: 453.59237,
    slug: 14.5939029372,
    pound_force: 14.5939029372,
    pound_troy: 0.3732417216,
    poundal: 0.0140867196,
    ton_assay_us: 0.02916667,
    ton_assay_uk: 0.0326666667,
    kiloton_metric: 1000000,
    quintal_metric: 100,
    hundredweight_us: 45.359237,
    hundredweight_uk: 50.80234544,
    quarter_us: 11.33980925,
    quarter_uk: 12.70058636,
    stone_us: 5.669904625,
    stone_uk: 6.35029318,
    tonne: 1000,
    pennyweight: 0.0015551738,
    scruple: 0.0012959782,
    grain: 6.47989e-5,
    gamma: 1.0e-9,
    talent_hebrew: 34.2,
    mina_hebrew: 0.57,
    shekel_hebrew: 0.0114,
    bekan_hebrew: 0.0057,
    gerah_hebrew: 0.00057,
    talent_greek: 20.4,
    mina_greek: 0.34,
    tetradrachma_greek: 0.0136,
    didrachma_greek: 0.0068,
    drachma_greek: 0.0034,
    denarius_roman: 0.00385,
    assarion_roman: 0.000240625,
    quadrans_roman: 6.01563e-5,
    lepton_roman: 3.00781e-5,
    planck_mass: 2.17671e-8,
    electron_mass: 9.1093897e-31,
    muon_mass: 1.8835327e-28,
    proton_mass: 1.6726231e-27,
    neutron_mass: 1.6749286e-27,
    deuteron_mass: 3.343586e-27,
    earth_mass: 5.9760000000002e24,
    sun_mass: 2.0e30,
  };

  const units = [
    {
      group: "Metric Units",
      options: [
        { value: "kilogram", label: "Kilogram [kg]" },
        { value: "gram", label: "Gram [g]" },
        { value: "milligram", label: "Milligram [mg]" },
        { value: "ton_metric", label: "Ton (metric) [t]" },
        { value: "megagram", label: "Megagram [Mg]" },
        { value: "hectogram", label: "Hectogram [hg]" },
        { value: "dekagram", label: "Dekagram [dag]" },
        { value: "decigram", label: "Decigram [dg]" },
        { value: "centigram", label: "Centigram [cg]" },
        { value: "microgram", label: "Microgram [µg]" },
        { value: "nanogram", label: "Nanogram [ng]" },
        { value: "picogram", label: "Picogram [pg]" },
        { value: "femtogram", label: "Femtogram [fg]" },
        { value: "attogram", label: "Attogram [ag]" },
        { value: "gamma", label: "Gamma" },
      ],
    },
    {
      group: "Imperial Units",
      options: [
        { value: "pound", label: "Pound [lbs]" },
        { value: "ounce", label: "Ounce [oz]" },
        { value: "ton_short", label: "Ton (short) [ton (US)]" },
        { value: "ton_long", label: "Ton (long) [ton (UK)]" },
        { value: "stone_us", label: "Stone (US)" },
        { value: "stone_uk", label: "Stone (UK)" },
        { value: "hundredweight_us", label: "Hundredweight (US)" },
        { value: "hundredweight_uk", label: "Hundredweight (UK)" },
        { value: "quarter_us", label: "Quarter (US)" },
        { value: "quarter_uk", label: "Quarter (UK)" },
      ],
    },
    {
      group: "Troy/Apothecary Units",
      options: [
        { value: "pound_troy", label: "Pound (troy or apothecary)" },
        { value: "pennyweight", label: "Pennyweight [pwt]" },
        { value: "scruple", label: "Scruple (apothecary) [s.ap]" },
        { value: "grain", label: "Grain [gr]" },
      ],
    },
    {
      group: "Biblical Hebrew Units",
      options: [
        { value: "talent_hebrew", label: "Talent (Biblical Hebrew)" },
        { value: "mina_hebrew", label: "Mina (Biblical Hebrew)" },
        { value: "shekel_hebrew", label: "Shekel (Biblical Hebrew)" },
        { value: "bekan_hebrew", label: "Bekan (Biblical Hebrew)" },
        { value: "gerah_hebrew", label: "Gerah (Biblical Hebrew)" },
      ],
    },
    {
      group: "Biblical Greek Units",
      options: [
        { value: "talent_greek", label: "Talent (Biblical Greek)" },
        { value: "mina_greek", label: "Mina (Biblical Greek)" },
        { value: "tetradrachma_greek", label: "Tetradrachma (Biblical Greek)" },
        { value: "didrachma_greek", label: "Didrachma (Biblical Greek)" },
        { value: "drachma_greek", label: "Drachma (Biblical Greek)" },
      ],
    },
    {
      group: "Biblical Roman Units",
      options: [
        { value: "denarius_roman", label: "Denarius (Biblical Roman)" },
        { value: "assarion_roman", label: "Assarion (Biblical Roman)" },
        { value: "quadrans_roman", label: "Quadrans (Biblical Roman)" },
        { value: "lepton_roman", label: "Lepton (Biblical Roman)" },
      ],
    },
    {
      group: "Other Units",
      options: [
        { value: "carat", label: "Carat [car, ct]" },
        { value: "atomic_mass_unit", label: "Atomic mass unit [u]" },
        { value: "dalton", label: "Dalton" },
        { value: "exagram", label: "Exagram [Eg]" },
        { value: "petagram", label: "Petagram [Pg]" },
        { value: "teragram", label: "Teragram [Tg]" },
        { value: "gigagram", label: "Gigagram [Gg]" },
        { value: "kiloton_metric", label: "Kiloton (metric) [kt]" },
        { value: "quintal_metric", label: "Quintal (metric) [cwt]" },
        { value: "kilogram_force", label: "Kilogram-force square second/meter" },
        { value: "kilopound", label: "Kilopound [kip]" },
        { value: "kip", label: "Kip" },
        { value: "slug", label: "Slug" },
        { value: "pound_force", label: "Pound-force square second/foot" },
        { value: "poundal", label: "Poundal [pdl]" },
        { value: "ton_assay_us", label: "Ton (assay) (US) [AT (US)]" },
        { value: "ton_assay_uk", label: "Ton (assay) (UK) [AT (UK)]" },
        { value: "tonne", label: "Tonne [t]" },
        { value: "planck_mass", label: "Planck mass" },
        { value: "electron_mass", label: "Electron mass (rest)" },
        { value: "muon_mass", label: "Muon mass" },
        { value: "proton_mass", label: "Proton mass" },
        { value: "neutron_mass", label: "Neutron mass" },
        { value: "deuteron_mass", label: "Deuteron mass" },
        { value: "earth_mass", label: "Earth's mass" },
        { value: "sun_mass", label: "Sun's mass" },
      ],
    },
  ];

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [result, setResult] = useState("Result: ");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      setResult("Result: Please enter a valid positive number");
      return;
    }
    if (!fromUnit || !toUnit) {
      setResult("Result: Please select both input and output units");
      return;
    }

    const valueInKg = value * conversionFactors[fromUnit];
    const converted = valueInKg / conversionFactors[toUnit];
    let formattedResult;
    if (Math.abs(converted) < 1e-6 || Math.abs(converted) > 1e6) {
      formattedResult = converted.toExponential(3);
    } else {
      formattedResult = converted.toFixed(6).replace(/\.?0+$/, "");
    }
    setResult(`Result: ${value} ${fromUnit} = ${formattedResult} ${toUnit}`);
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Weight and Mass Converter</h2>
        <div className="space-y-5">
          <div>
            <input
              type="number"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              step="any"
              className="p-3 w-full border-2 border-red-500 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="p-3 w-full border-2 border-red-500 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-red-500 bg-white cursor-pointer"
            >
              <option value="" disabled>
                Select input unit
              </option>
              {units.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="p-3 w-full border-2 border-red-500 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-red-500 bg-white cursor-pointer"
            >
              <option value="" disabled>
                Select output unit
              </option>
              {units.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <button
            onClick={handleConvert}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 text-base font-semibold cursor-pointer"
          >
            Convert
          </button>
          <div className="text-center text-lg text-gray-800 mt-5 break-words">{result}</div>
        </div>
      </div>
    </div>
  );
}
