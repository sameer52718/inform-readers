import { TOOL_CATEGORIES } from "@/constant/tools";

import AngleConverter from "@/components/pages/tools/other/angle-converter";
import DegreesToRadians from "@/components/pages/tools/other/degrees-to-radians";
import RadiansToDegrees from "@/components/pages/tools/other/radians-to-degrees";

import AcresToHectare from "@/components/pages/tools/other/acres-to-hectare";
import AcresToSquareFeet from "@/components/pages/tools/other/acres-to-square-feet";
import AcresToSquareMiles from "@/components/pages/tools/other/acres-to-square-miles";
import AreaConverter from "@/components/pages/tools/other/area-converter";
import HectareToAcres from "@/components/pages/tools/other/hectare-to-acres";
import SquareFeetToAcres from "@/components/pages/tools/other/square-feet-to-acres";
import SquareFeetToSquareMeter from "@/components/pages/tools/other/square-feet-to-square-meter";
import SquareFeetToSquareYards from "@/components/pages/tools/other/square-feet-to-square-yards";
import SquareMeterToSquareFeet from "@/components/pages/tools/other/square-meter-to-square-feet";
import SquareMilesToAcres from "@/components/pages/tools/other/square-miles-to-acres";
import SquareYardsToSquareFeet from "@/components/pages/tools/other/square-yards-to-square-feet";

import CaseConverter from "@/components/pages/tools/other/case-converter";
import ChargeConverter from "@/components/pages/tools/other/charge-converter";
import ConcentrationMolarConverter from "@/components/pages/tools/other/concentration-molar-converter";
import ConcentrationSolutionConverter from "@/components/pages/tools/other/concentration-solution-converter";
import AmpsToMilliampsConverter from "@/components/pages/tools/other/amps-to-milliamps-converter";
import CurrentConverter from "@/components/pages/tools/other/current-converter";
import MilliampsToAmpsConverter from "@/components/pages/tools/other/milliamps-to-amps-converter";

import DataStorageConverter from "@/components/pages/tools/other/data-storage-converter";
import GbToKb from "@/components/pages/tools/other/gb-to-kb";
import GbToMb from "@/components/pages/tools/other/gb-to-mb";
import GbToPb from "@/components/pages/tools/other/gb-to-pb";
import GbToTb from "@/components/pages/tools/other/gb-to-tb";
import KbToGb from "@/components/pages/tools/other/kb-to-gb";
import KbToMb from "@/components/pages/tools/other/kb-to-mb";
import KbToTb from "@/components/pages/tools/other/kb-to-tb";
import MbToGb from "@/components/pages/tools/other/mb-to-gb";
import MbToKb from "@/components/pages/tools/other/mb-to-kb";
import MbToPb from "@/components/pages/tools/other/mb-to-pb";
import MbToTb from "@/components/pages/tools/other/mb-to-tb";
import PbToGb from "@/components/pages/tools/other/pb-to-gb";
import PbToMb from "@/components/pages/tools/other/pb-to-mb";
import PbToTb from "@/components/pages/tools/other/pb-to-tb";
import TbToGb from "@/components/pages/tools/other/tb-to-gb";
import TbToKb from "@/components/pages/tools/other/tb-to-kb";
import TbToMb from "@/components/pages/tools/other/tb-to-mb";
import TbToPb from "@/components/pages/tools/other/tb-to-pb";

// Data Transfer Converter
import DataTransferConverter from "@/components/pages/tools/other/data-transfer-converter";

// // Digital Image Resolution Converter
import DigitalImageResolutionConverter from "@/components/pages/tools/other/digital-image-resolution-converter";

// // Electric Converters
import ElectricConductanceConverter from "@/components/pages/tools/other/electric-conductance-converter";
import ElectricConductivityConverter from "@/components/pages/tools/other/electric-conductivity-converter";
import ElectricFieldStrengthConverter from "@/components/pages/tools/other/electric-field-strength-converter";
import ElectricPotentialConverter from "@/components/pages/tools/other/electric-potential-converter";
import ElectricResistanceConverter from "@/components/pages/tools/other/electric-resistance-converter";
import ElectricResistivityConverter from "@/components/pages/tools/other/electric-resistivity-converter";
import ElectrostaticCapacitanceConverter from "@/components/pages/tools/other/electrostatic-capacitance-converter";

// // Energy Converters
import CalToJ from "@/components/pages/tools/other/cal-to-j";
import CalToKcal from "@/components/pages/tools/other/cal-to-kcal";
import EnergyConverter from "@/components/pages/tools/other/energy-converter";
import FtlbToNm from "@/components/pages/tools/other/ftlb-to-nm";
import JToCal from "@/components/pages/tools/other/j-to-cal";
import JToKj from "@/components/pages/tools/other/j-to-kj";
import KcalToCal from "@/components/pages/tools/other/kcal-to-cal";
import KcalToKj from "@/components/pages/tools/other/kcal-to-kj";
import KjToJ from "@/components/pages/tools/other/kj-to-j";
import KjToKcal from "@/components/pages/tools/other/kj-to-kcal";
import NmToFtlb from "@/components/pages/tools/other/nm-to-ftlb";

import FlowMassConverter from "@/components/pages/tools/other/flow-mass-converter";
import FlowConverter from "@/components/pages/tools/other/flow-converter";

import ForceConverter from "@/components/pages/tools/other/force-converter";
import KgToNewtons from "@/components/pages/tools/other/kg-to-newtons";
import LbsToNewtons from "@/components/pages/tools/other/lbs-to-newtons";
import NewtonsToKg from "@/components/pages/tools/other/newtons-to-kg";
import NewtonsToLbs from "@/components/pages/tools/other/newtons-to-lbs";

import FrequencyWavelengthConverter from "@/components/pages/tools/other/frequency-wavelength-converter";
import HeatDensityConverter from "@/components/pages/tools/other/heat-density-converter";
import HeatFluxDensityConverter from "@/components/pages/tools/other/heat-flux-density-converter";
import HeatTransferCoefficientConverter from "@/components/pages/tools/other/heat-transfer-coefficient-converter";
import IlluminationConverter from "@/components/pages/tools/other/illumination_converter";
import InductanceConverter from "@/components/pages/tools/other/inductance-converter";

// Length Converters
import CmToFeet from "@/components/pages/tools/other/cm-to-feet";
import CmToInches from "@/components/pages/tools/other/cm-to-inches";
import CmToKm from "@/components/pages/tools/other/cm-to-km";
import CmToM from "@/components/pages/tools/other/cm-to-m";
import CmToMm from "@/components/pages/tools/other/cm-to-mm";
import FeetToCm from "@/components/pages/tools/other/feet-to-cm";
import FeetToInches from "@/components/pages/tools/other/feet-to-inches";
import FeetToMeters from "@/components/pages/tools/other/feet-to-meters";
import FeetToMiles from "@/components/pages/tools/other/feet-to-miles";
import FeetToMm from "@/components/pages/tools/other/feet-to-mm";
import FeetToYards from "@/components/pages/tools/other/feet-to-yards";
import InchesToCm from "@/components/pages/tools/other/inches-to-cm";
import InchesToFeet from "@/components/pages/tools/other/inches-to-feet";
import InchesToMeters from "@/components/pages/tools/other/inches-to-meters";
import InchesToMm from "@/components/pages/tools/other/inches-to-mm";
import InchesToYards from "@/components/pages/tools/other/inches-to-yards";
import KmToCm from "@/components/pages/tools/other/km-to-cm";
import KmToM from "@/components/pages/tools/other/km-to-m";
import KmToMiles from "@/components/pages/tools/other/km-to-miles";
import MToCm from "@/components/pages/tools/other/m-to-cm";
import MToKm from "@/components/pages/tools/other/m-to-km";
import MToMm from "@/components/pages/tools/other/m-to-mm";
import MetersToFeet from "@/components/pages/tools/other/meters-to-feet";
import MetersToInches from "@/components/pages/tools/other/meters-to-inches";
import MetersToMiles from "@/components/pages/tools/other/meters-to-miles";
import MetersToYards from "@/components/pages/tools/other/meters-to-yards";
import MilesToFeet from "@/components/pages/tools/other/miles-to-feet";
import MilesToKm from "@/components/pages/tools/other/miles-to-km";
import MilesToMeters from "@/components/pages/tools/other/miles-to-meters";
import MilesToYards from "@/components/pages/tools/other/miles-to-yards";
import MmToCm from "@/components/pages/tools/other/mm-to-cm";
import MmToFeet from "@/components/pages/tools/other/mm-to-feet";
import MmToInches from "@/components/pages/tools/other/mm-to-inches";
import MmToM from "@/components/pages/tools/other/mm-to-m";
import YardsToFeet from "@/components/pages/tools/other/yards-to-feet";
import YardsToInches from "@/components/pages/tools/other/yards-to-inches";
import YardsToMeters from "@/components/pages/tools/other/yards-to-meters";
import YardsToMiles from "@/components/pages/tools/other/yards-to-miles";

import LinearChargeDensityConverter from "@/components/pages/tools/other/linear-charge-density-converter";
import LinearCurrentDensityConverter from "@/components/pages/tools/other/linear-current-density-converter";
import LuminanceConverter from "@/components/pages/tools/other/luminance-converter";
import LuminousIntensityConverter from "@/components/pages/tools/other/luminous-intensity-converter";
import MagneticFieldStrengthConverter from "@/components/pages/tools/other/magnetic-field-strength-converter";
import MagneticFluxConverter from "@/components/pages/tools/other/magnetic-flux-converter";
import MagneticFluxDensityConverter from "@/components/pages/tools/other/magnetic-flux-density-converter";
import MagnetomotiveForceConverter from "@/components/pages/tools/other/magnetomotive-force-converter";
import MassFluxDensityConverter from "@/components/pages/tools/other/mass-flux-density-converter";

import BinaryToDecimal from "@/components/pages/tools/other/binary-to-decimal";
import BinaryToHex from "@/components/pages/tools/other/binary-to-hex";
import DecimalToBinary from "@/components/pages/tools/other/decimal-to-binary";
import DecimalToHex from "@/components/pages/tools/other/decimal-to-hex";
import HexToBinary from "@/components/pages/tools/other/hex-to-binary";
import HexToDecimal from "@/components/pages/tools/other/hex-to-decimal";
import NumbersConverter from "@/components/pages/tools/other/numbers-converter";
import PermeabilityConverter from "@/components/pages/tools/other/permeability-converter";
import BtuToTon from "@/components/pages/tools/other/btu-to-ton";
import HpToKw from "@/components/pages/tools/other/hp-to-kw";
import HpToWatts from "@/components/pages/tools/other/hp-to-watts";
import KwToHp from "@/components/pages/tools/other/kw-to-hp";
import PowerConverter from "@/components/pages/tools/other/power-converter";
import TonToBtu from "@/components/pages/tools/other/ton-to-btu";
import WattsToHp from "@/components/pages/tools/other/watts-to-hp";

import PrefixesConverter from "@/components/pages/tools/other/prefixes-converter";
import BarToPsi from "@/components/pages/tools/other/bar-to-psi";
import KpaToPsi from "@/components/pages/tools/other/kpa-to-psi";
import PressureConverter from "@/components/pages/tools/other/pressure-converter";
import PsiToBar from "@/components/pages/tools/other/psi-to-bar";
import PsiToKpa from "@/components/pages/tools/other/psi-to-kpa";
import RadiationConverter from "@/components/pages/tools/other/radiation-converter";
import RadiationAbsorbedDoseConverter from "@/components/pages/tools/other/radiation-absorbed-dose-converter";
import RadiationActivityConverter from "@/components/pages/tools/other/radiation-activity-converter";
import RadiationExposureConverter from "@/components/pages/tools/other/radiation-exposure-converter";

import SoundConverter from "@/components/pages/tools/other/sound-converter";
import SpecificHeatCapacityConverter from "@/components/pages/tools/other/specific-heat-capacity-converter";
import FpsToMph from "@/components/pages/tools/other/fps-to-mph";
import KnotToMph from "@/components/pages/tools/other/knot-to-mph";
import KphToMph from "@/components/pages/tools/other/kph-to-mph";
import MphToFps from "@/components/pages/tools/other/mph-to-fps";
import MphToKnot from "@/components/pages/tools/other/mph-to-knot";
import MphToKph from "@/components/pages/tools/other/mph-to-kph";
import MphToMps from "@/components/pages/tools/other/mph-to-mps";
import MpsToKph from "@/components/pages/tools/other/mps-to-kph";
import MpsToMph from "@/components/pages/tools/other/mps-to-mph";
import SpeedConverter from "@/components/pages/tools/other/speed-converter";
import SurfaceChargeDensityConverter from "@/components/pages/tools/other/surface-charge-density-converter";
import SurfaceCurrentDensityConverter from "@/components/pages/tools/other/surface-current-density-converter";
import SurfaceTensionConverter from "@/components/pages/tools/other/surface-tension-converter";

import CelsiusToFahrenheit from "@/components/pages/tools/other/celsius-to-fahrenheit";
import CelsiusToKelvin from "@/components/pages/tools/other/celsius-to-kelvin";
import FahrenheitToCelsius from "@/components/pages/tools/other/fahrenheit-to-celsius";
import FahrenheitToKelvin from "@/components/pages/tools/other/fahrenheit-to-kelvin";
import KelvinToCelsius from "@/components/pages/tools/other/kelvin-to-celsius";
import KelvinToFahrenheit from "@/components/pages/tools/other/kelvin-to-fahrenheit";
import TemperatureConverter from "@/components/pages/tools/other/temperature-converter";
import TemperatureIntervalConverter from "@/components/pages/tools/other/temperature-interval-converter";
import ThermalConductivityConverter from "@/components/pages/tools/other/thermal-conductivity-converter";
import ThermalExpansionConverter from "@/components/pages/tools/other/thermal-expansion-converter";
import ThermalResistanceConverter from "@/components/pages/tools/other/thermal-resistance-converter";

import DaysToHours from "@/components/pages/tools/other/days-to-hours";
import DaysToMinutes from "@/components/pages/tools/other/days-to-minutes";
import DaysToMonths from "@/components/pages/tools/other/days-to-months";
import DaysToSeconds from "@/components/pages/tools/other/days-to-seconds";
import DaysToYears from "@/components/pages/tools/other/days-to-years";
import HoursToDays from "@/components/pages/tools/other/hours-to-days";
import HoursToMinutes from "@/components/pages/tools/other/hours-to-minutes";
import MillisecondsToSeconds from "@/components/pages/tools/other/milliseconds-to-seconds";
import MinutesToDays from "@/components/pages/tools/other/minutes-to-days";
import MinutesToHours from "@/components/pages/tools/other/minutes-to-hours";
import MinutesToSeconds from "@/components/pages/tools/other/minutes-to-seconds";
import MonthsToDays from "@/components/pages/tools/other/months-to-days";
import SecondsToDays from "@/components/pages/tools/other/seconds-to-days";
import SecondsToMilliseconds from "@/components/pages/tools/other/seconds-to-milliseconds";
import SecondsToMinutes from "@/components/pages/tools/other/seconds-to-minutes";
import TimeConverter from "@/components/pages/tools/other/time-converter";
import YearsToDays from "@/components/pages/tools/other/years-to-days";
import TypographyConverter from "@/components/pages/tools/other/typography-converter";

import VolumeDryConverter from "@/components/pages/tools/other/volume-dry-converter";
import VolumeLumberConverter from "@/components/pages/tools/other/volume-lumber-converter";
import VolumeChargeDensityConverter from "@/components/pages/tools/other/volume-charge-density-converter";
import CcToMl from "@/components/pages/tools/other/cc-to-ml";
import CcToOz from "@/components/pages/tools/other/cc-to-oz";
import CubicFeetToCubicYards from "@/components/pages/tools/other/cubic-feet-to-cubic-yards";
import CubicFeetToGallon from "@/components/pages/tools/other/cubic-feet-to-gallon";
import CubicInchesToGallons from "@/components/pages/tools/other/cubic-inches-to-gallons";
import CubicInchesToLiters from "@/components/pages/tools/other/cubic-inches-to-liters";
import CubicYardsToCubicFeet from "@/components/pages/tools/other/cubic-yards-to-cubic-feet";
import CupsToGallon from "@/components/pages/tools/other/cups-to-gallon";
import CupsToLiters from "@/components/pages/tools/other/cups-to-liters";
import CupsToMl from "@/components/pages/tools/other/cups-to-ml";
import CupsToPint from "@/components/pages/tools/other/cups-to-pint";
import CupsToQuart from "@/components/pages/tools/other/cups-to-quart";
import CupsToTablespoons from "@/components/pages/tools/other/cups-to-tablespoons";
import GallonToCubicFeet from "@/components/pages/tools/other/gallon-to-cubic-feet";
import GallonToCups from "@/components/pages/tools/other/gallon-to-cups";
import GallonToMl from "@/components/pages/tools/other/gallon-to-ml";
import GallonToPints from "@/components/pages/tools/other/gallon-to-pints";
import GallonToQuart from "@/components/pages/tools/other/gallon-to-quart";
import GallonsToCubicInches from "@/components/pages/tools/other/gallons-to-cubic-inches";
import GallonsToLiters from "@/components/pages/tools/other/gallons-to-liters";
import LToMl from "@/components/pages/tools/other/l-to-ml";
import LiterToOunces from "@/components/pages/tools/other/liter-to-ounces";
import LitersToCubicInches from "@/components/pages/tools/other/liters-to-cubic-inches";
import LitersToCups from "@/components/pages/tools/other/liters-to-cups";
import LitersToGallons from "@/components/pages/tools/other/liters-to-gallons";
import LitersToPints from "@/components/pages/tools/other/liters-to-pints";
import LitersToQuarts from "@/components/pages/tools/other/liters-to-quarts";
import MlToCc from "@/components/pages/tools/other/ml-to-cc";
import MlToCups from "@/components/pages/tools/other/ml-to-cups";
import MlToGallon from "@/components/pages/tools/other/ml-to-gallon";
import MlToL from "@/components/pages/tools/other/ml-to-l";
import MlToPint from "@/components/pages/tools/other/ml-to-pint";
import MlToTeaspoon from "@/components/pages/tools/other/ml-to-teaspoon";
import OuncesToLiter from "@/components/pages/tools/other/ounces-to-liter";
import OzToCc from "@/components/pages/tools/other/oz-to-cc";
import PintToCups from "@/components/pages/tools/other/pint-to-cups";
import PintToMl from "@/components/pages/tools/other/pint-to-ml";
import PintsToGallon from "@/components/pages/tools/other/pints-to-gallon";
import PintsToLiters from "@/components/pages/tools/other/pints-to-liters";
import QuartToCups from "@/components/pages/tools/other/quart-to-cups";
import QuartToGallon from "@/components/pages/tools/other/quart-to-gallon";
import QuartsToLiters from "@/components/pages/tools/other/quarts-to-liters";
import TablespoonsToCups from "@/components/pages/tools/other/tablespoons-to-cups";
import TablespoonsToTeaspoons from "@/components/pages/tools/other/tablespoons-to-teaspoons";
import TeaspoonToMl from "@/components/pages/tools/other/teaspoon-to-ml";
import TeaspoonsToTablespoons from "@/components/pages/tools/other/teaspoons-to-tablespoons";
import VolumeConverter from "@/components/pages/tools/other/volume-converter";

import GToKg from "@/components/pages/tools/other/g-to-kg";
import GramsToMilligrams from "@/components/pages/tools/other/grams-to-milligrams";
import GramsToOunces from "@/components/pages/tools/other/grams-to-ounces";
import GramsToPounds from "@/components/pages/tools/other/grams-to-pounds";
import KgToG from "@/components/pages/tools/other/kg-to-g";
import KgToLbs from "@/components/pages/tools/other/kg-to-lbs";
import KgToOz from "@/components/pages/tools/other/kg-to-oz";
import LbsToKg from "@/components/pages/tools/other/lbs-to-kg";
import LbsToStone from "@/components/pages/tools/other/lbs-to-stone";
import LbsToTon from "@/components/pages/tools/other/lbs-to-ton";
import MilligramsToGrams from "@/components/pages/tools/other/milligrams-to-grams";
import OuncesToGrams from "@/components/pages/tools/other/ounces-to-grams";
import OuncesToPounds from "@/components/pages/tools/other/ounces-to-pounds";
import OzToKg from "@/components/pages/tools/other/oz-to-kg";
import PoundsToGrams from "@/components/pages/tools/other/pounds-to-grams";
import PoundsToOunces from "@/components/pages/tools/other/pounds-to-ounces";
import StoneToLbs from "@/components/pages/tools/other/stone-to-lbs";
import TonToLbs from "@/components/pages/tools/other/ton-to-lbs";
import WeightMassConverter from "@/components/pages/tools/other/weight-mass-converter";

import { headers } from "next/headers";
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";
import { buildHreflangLinks } from "@/lib/hreflang";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";

const metaTitleTemplates = [
  "Free {ToolName} Online Tool in {Country} – Fast & Easy",
  "Best {ToolName} for {Country} Users – Secure & Reliable",
  "{ToolName} Service in {Country} – Quick Results Online",
];

// Description templates
const metaDescriptionTemplates = [
  "Try our advanced {ToolName} tool in {Country}. Get fast, accurate, and reliable results within seconds. Perfect for students, professionals, and daily users who want a simple yet powerful online tool. No installation required, works directly in your browser.",
  "Looking for a secure and user-friendly {ToolName} in {Country}? Our free online solution helps you complete tasks instantly with high precision. Easy to use on mobile and desktop. Save time and boost productivity with just one click.",
  "Use {ToolName} online in {Country} to make your work easier. Designed for speed, simplicity, and efficiency. Whether you are a professional, student, or casual user, this tool provides high-quality results without any signup or hidden costs.",
];

function applyMetaTemplate(template, values) {
  return template.replace(/{ToolName}/g, values.toolName || "").replace(/{Country}/g, values.country || "");
}

const faqTemplates = [
  {
    q: "What is {ToolName} and how does it work in {Country}?",
    a: "{ToolName} is an easy-to-use online tool that helps users in {Country} perform quick and accurate tasks without installing any software. It works directly from your browser, offering a smooth experience.",
  },
  {
    q: "Is {ToolName} free to use in {Country}?",
    a: "Yes, {ToolName} is available for free in {Country}. You can use it anytime, and there are no hidden charges or complex sign-ups required.",
  },
  {
    q: "Can I access {ToolName} on mobile devices in {Country}?",
    a: "Absolutely! {ToolName} is fully compatible with both desktop and mobile browsers, making it convenient for users in {Country} to access tools on the go.",
  },
];

function applyFaqTemplate(template, values) {
  return {
    q: template.q.replace(/{ToolName}/g, values.toolName || "").replace(/{Country}/g, values.country || ""),
    a: template.a.replace(/{ToolName}/g, values.toolName || "").replace(/{Country}/g, values.country || ""),
  };
}

// 🔹 Intro templates
const introTemplates = [
  "Looking for a reliable way to use {ToolName} in {Country}? Our platform makes it easy to access this powerful tool directly online without downloads. Whether you are on desktop or mobile, {ToolName} in {Country} ensures speed, accuracy, and a smooth experience.",
  "With the growing demand for online solutions in {Country}, {ToolName} has become a go-to choice for professionals, students, and businesses. This tool is simple, fast, and accessible, helping you get results instantly without technical hassle.",
  "If you’re searching for the best way to use {ToolName} in {Country}, you’re at the right place. This tool offers a user-friendly interface, quick performance, and is completely free to use online.",
  "The use of {ToolName} in {Country} is growing every day, and for good reason. It’s an all-in-one solution designed to save time and deliver accurate results with just a few clicks. No installation required — just open and start using!",
  "In today’s digital world, tools like {ToolName} are essential for people in {Country}. Whether you need it for personal use, business, or education, this tool guarantees fast performance and reliable outcomes every time.",
  "Searching for {ToolName} in {Country}? Our online tool is optimized for speed, accuracy, and convenience. No sign-ups, no downloads — just instant access anytime, anywhere.",
  "The easiest way to access {ToolName} in {Country} is right here. This tool provides professional-grade features that are simple enough for anyone to use, making your workflow faster and smarter.",
  "Whether you’re in {Country} for work, study, or personal projects, {ToolName} can make your tasks easier. With advanced technology and a simple design, this online tool is trusted by thousands of users worldwide.",
  "When it comes to online tools in {Country}, {ToolName} stands out as a reliable and free solution. It saves time, boosts productivity, and gives you accurate results within seconds.",
  "Using {ToolName} in {Country} has never been this simple. Our platform ensures you get quick, efficient, and reliable access without worrying about hidden costs or complicated steps.",
];

function applyIntroTemplate(template, values) {
  return template.replace(/{ToolName}/g, values.toolName || "").replace(/{Country}/g, values.country || "");
}

const toolComponents = {
  "angle-converter": AngleConverter,
  "degrees-to-radians": DegreesToRadians,
  "radians-to-degrees": RadiansToDegrees,

  "acres-to-hectare": AcresToHectare,
  "acres-to-square-feet": AcresToSquareFeet,
  "acres-to-square-miles": AcresToSquareMiles,
  "area-converter": AreaConverter,
  "hectare-to-acres": HectareToAcres,
  "square-feet-to-acres": SquareFeetToAcres,
  "square-feet-to-square-meter": SquareFeetToSquareMeter,
  "square-feet-to-square-yards": SquareFeetToSquareYards,
  "square-meter-to-square-feet": SquareMeterToSquareFeet,
  "square-miles-to-acres": SquareMilesToAcres,
  "square-yards-to-square-feet": SquareYardsToSquareFeet,

  "case-converter": CaseConverter,
  "charge-converter": ChargeConverter,
  "concentration-molar-converter": ConcentrationMolarConverter,
  "concentration-solution-converter": ConcentrationSolutionConverter,
  "amps-to-milliamps-converter": AmpsToMilliampsConverter,
  "current-converter": CurrentConverter,
  "milliamps-to-amps-converter": MilliampsToAmpsConverter,

  "data-storage-converter": DataStorageConverter,
  "gb-to-kb": GbToKb,
  "gb-to-mb": GbToMb,
  "gb-to-pb": GbToPb,
  "gb-to-tb": GbToTb,
  "kb-to-gb": KbToGb,
  "kb-to-mb": KbToMb,
  "kb-to-tb": KbToTb,
  "mb-to-gb": MbToGb,
  "mb-to-kb": MbToKb,
  "mb-to-pb": MbToPb,
  "mb-to-tb": MbToTb,
  "pb-to-gb": PbToGb,
  "pb-to-mb": PbToMb,
  "pb-to-tb": PbToTb,
  "tb-to-gb": TbToGb,
  "tb-to-kb": TbToKb,
  "tb-to-mb": TbToMb,
  "tb-to-pb": TbToPb,

  "data-transfer-converter": DataTransferConverter,
  "digital-image-resolution-converter": DigitalImageResolutionConverter,
  "electric-conductance-converter": ElectricConductanceConverter,
  "electric-conductivity-converter": ElectricConductivityConverter,
  "electric-field-strength-converter": ElectricFieldStrengthConverter,
  "electric-potential-converter": ElectricPotentialConverter,
  "electric-resistance-converter": ElectricResistanceConverter,
  "electric-resistivity-converter": ElectricResistivityConverter,
  "electrostatic-capacitance-converter": ElectrostaticCapacitanceConverter,
  "cal-to-j": CalToJ,
  "cal-to-kcal": CalToKcal,
  "energy-converter": EnergyConverter,
  "ftlb-to-nm": FtlbToNm,
  "j-to-cal": JToCal,
  "j-to-kj": JToKj,
  "kcal-to-cal": KcalToCal,
  "kcal-to-kj": KcalToKj,
  "kj-to-j": KjToJ,
  "kj-to-kcal": KjToKcal,
  "nm-to-ftlb": NmToFtlb,

  "flow-mass-converter": FlowMassConverter,
  "flow-converter": FlowConverter,

  "force-converter": ForceConverter,
  "kg-to-newtons": KgToNewtons,
  "lbs-to-newtons": LbsToNewtons,
  "newtons-to-kg": NewtonsToKg,
  "newtons-to-lbs": NewtonsToLbs,
  "frequency-wavelength-converter": FrequencyWavelengthConverter,
  "heat-density-converter": HeatDensityConverter,
  "heat-flux-density-converter": HeatFluxDensityConverter,
  "heat-transfer-coefficient-converter": HeatTransferCoefficientConverter,
  illumination_converter: IlluminationConverter,
  "inductance-converter": InductanceConverter,

  "cm-to-feet": CmToFeet,
  "cm-to-inches": CmToInches,
  "cm-to-km": CmToKm,
  "cm-to-m": CmToM,
  "cm-to-mm": CmToMm,
  "feet-to-cm": FeetToCm,
  "feet-to-inches": FeetToInches,
  "feet-to-meters": FeetToMeters,
  "feet-to-miles": FeetToMiles,
  "feet-to-mm": FeetToMm,
  "feet-to-yards": FeetToYards,
  "inches-to-cm": InchesToCm,
  "inches-to-feet": InchesToFeet,
  "inches-to-meters": InchesToMeters,
  "inches-to-mm": InchesToMm,
  "inches-to-yards": InchesToYards,
  "km-to-cm": KmToCm,
  "km-to-m": KmToM,
  "km-to-miles": KmToMiles,
  "m-to-cm": MToCm,
  "m-to-km": MToKm,
  "m-to-mm": MToMm,
  "meters-to-feet": MetersToFeet,
  "meters-to-inches": MetersToInches,
  "meters-to-miles": MetersToMiles,
  "meters-to-yards": MetersToYards,
  "miles-to-feet": MilesToFeet,
  "miles-to-km": MilesToKm,
  "miles-to-meters": MilesToMeters,
  "miles-to-yards": MilesToYards,
  "mm-to-cm": MmToCm,
  "mm-to-feet": MmToFeet,
  "mm-to-inches": MmToInches,
  "mm-to-m": MmToM,
  "yards-to-feet": YardsToFeet,
  "yards-to-inches": YardsToInches,
  "yards-to-meters": YardsToMeters,
  "yards-to-miles": YardsToMiles,

  "linear-charge-density-converter": LinearChargeDensityConverter,
  "linear-current-density-converter": LinearCurrentDensityConverter,
  "luminance-converter": LuminanceConverter,
  "luminous-intensity-converter": LuminousIntensityConverter,
  "magnetic-field-strength-converter": MagneticFieldStrengthConverter,
  "magnetic-flux-converter": MagneticFluxConverter,
  "magnetic-flux-density-converter": MagneticFluxDensityConverter,
  "magnetomotive-force-converter": MagnetomotiveForceConverter,
  "mass-flux-density-converter": MassFluxDensityConverter,

  "binary-to-decimal": BinaryToDecimal,
  "binary-to-hex": BinaryToHex,
  "decimal-to-binary": DecimalToBinary,
  "decimal-to-hex": DecimalToHex,
  "hex-to-binary": HexToBinary,
  "hex-to-decimal": HexToDecimal,
  "numbers-converter": NumbersConverter,
  "permeability-converter": PermeabilityConverter,
  "btu-to-ton": BtuToTon,
  "hp-to-kw": HpToKw,
  "hp-to-watts": HpToWatts,
  "kw-to-hp": KwToHp,
  "power-converter": PowerConverter,
  "ton-to-btu": TonToBtu,
  "watts-to-hp": WattsToHp,

  "prefixes-converter": PrefixesConverter,
  "bar-to-psi": BarToPsi,
  "kpa-to-psi": KpaToPsi,
  "pressure-converter": PressureConverter,
  "psi-to-bar": PsiToBar,
  "psi-to-kpa": PsiToKpa,
  "radiation-converter": RadiationConverter,
  "radiation-absorbed-dose-converter": RadiationAbsorbedDoseConverter,
  "radiation-activity-converter": RadiationActivityConverter,
  "radiation-exposure-converter": RadiationExposureConverter,

  "sound-converter": SoundConverter,
  "specific-heat-capacity-converter": SpecificHeatCapacityConverter,
  "fps-to-mph": FpsToMph,
  "knot-to-mph": KnotToMph,
  "kph-to-mph": KphToMph,
  "mph-to-fps": MphToFps,
  "mph-to-knot": MphToKnot,
  "mph-to-kph": MphToKph,
  "mph-to-mps": MphToMps,
  "mps-to-kph": MpsToKph,
  "mps-to-mph": MpsToMph,
  "speed-converter": SpeedConverter,
  "surface-charge-density-converter": SurfaceChargeDensityConverter,
  "surface-current-density-converter": SurfaceCurrentDensityConverter,
  "surface-tension-converter": SurfaceTensionConverter,

  "celsius-to-fahrenheit": CelsiusToFahrenheit,
  "celsius-to-kelvin": CelsiusToKelvin,
  "fahrenheit-to-celsius": FahrenheitToCelsius,
  "fahrenheit-to-kelvin": FahrenheitToKelvin,
  "kelvin-to-celsius": KelvinToCelsius,
  "kelvin-to-fahrenheit": KelvinToFahrenheit,
  "temperature-converter": TemperatureConverter,
  "temperature-interval-converter": TemperatureIntervalConverter,
  "thermal-conductivity-converter": ThermalConductivityConverter,
  "thermal-expansion-converter": ThermalExpansionConverter,
  "thermal-resistance-converter": ThermalResistanceConverter,

  "days-to-hours": DaysToHours,
  "days-to-minutes": DaysToMinutes,
  "days-to-months": DaysToMonths,
  "days-to-seconds": DaysToSeconds,
  "days-to-years": DaysToYears,
  "hours-to-days": HoursToDays,
  "hours-to-minutes": HoursToMinutes,
  "milliseconds-to-seconds": MillisecondsToSeconds,
  "minutes-to-days": MinutesToDays,
  "minutes-to-hours": MinutesToHours,
  "minutes-to-seconds": MinutesToSeconds,
  "months-to-days": MonthsToDays,
  "seconds-to-days": SecondsToDays,
  "seconds-to-milliseconds": SecondsToMilliseconds,
  "seconds-to-minutes": SecondsToMinutes,
  "time-converter": TimeConverter,
  "years-to-days": YearsToDays,
  "typography-converter": TypographyConverter,

  "volume-dry-converter": VolumeDryConverter,
  "volume-lumber-converter": VolumeLumberConverter,
  "volume-charge-density-converter": VolumeChargeDensityConverter,
  "cc-to-ml": CcToMl,
  "cc-to-oz": CcToOz,
  "cubic-feet-to-cubic-yards": CubicFeetToCubicYards,
  "cubic-feet-to-gallon": CubicFeetToGallon,
  "cubic-inches-to-gallons": CubicInchesToGallons,
  "cubic-inches-to-liters": CubicInchesToLiters,
  "cubic-yards-to-cubic-feet": CubicYardsToCubicFeet,
  "cups-to-gallon": CupsToGallon,
  "cups-to-liters": CupsToLiters,
  "cups-to-ml": CupsToMl,
  "cups-to-pint": CupsToPint,
  "cups-to-quart": CupsToQuart,
  "cups-to-tablespoons": CupsToTablespoons,
  "gallon-to-cubic-feet": GallonToCubicFeet,
  "gallon-to-cups": GallonToCups,
  "gallon-to-ml": GallonToMl,
  "gallon-to-pints": GallonToPints,
  "gallon-to-quart": GallonToQuart,
  "gallons-to-cubic-inches": GallonsToCubicInches,
  "gallons-to-liters": GallonsToLiters,
  "l-to-ml": LToMl,
  "liter-to-ounces": LiterToOunces,
  "liters-to-cubic-inches": LitersToCubicInches,
  "liters-to-cups": LitersToCups,
  "liters-to-gallons": LitersToGallons,
  "liters-to-pints": LitersToPints,
  "liters-to-quarts": LitersToQuarts,
  "ml-to-cc": MlToCc,
  "ml-to-cups": MlToCups,
  "ml-to-gallon": MlToGallon,
  "ml-to-l": MlToL,
  "ml-to-pint": MlToPint,
  "ml-to-teaspoon": MlToTeaspoon,
  "ounces-to-liter": OuncesToLiter,
  "oz-to-cc": OzToCc,
  "pint-to-cups": PintToCups,
  "pint-to-ml": PintToMl,
  "pints-to-gallon": PintsToGallon,
  "pints-to-liters": PintsToLiters,
  "quart-to-cups": QuartToCups,
  "quart-to-gallon": QuartToGallon,
  "quarts-to-liters": QuartsToLiters,
  "tablespoons-to-cups": TablespoonsToCups,
  "tablespoons-to-teaspoons": TablespoonsToTeaspoons,
  "teaspoon-to-ml": TeaspoonToMl,
  "teaspoons-to-tablespoons": TeaspoonsToTablespoons,
  "volume-converter": VolumeConverter,

  "g-to-kg": GToKg,
  "grams-to-milligrams": GramsToMilligrams,
  "grams-to-ounces": GramsToOunces,
  "grams-to-pounds": GramsToPounds,
  "kg-to-g": KgToG,
  "kg-to-lbs": KgToLbs,
  "kg-to-oz": KgToOz,
  "lbs-to-kg": LbsToKg,
  "lbs-to-stone": LbsToStone,
  "lbs-to-ton": LbsToTon,
  "milligrams-to-grams": MilligramsToGrams,
  "ounces-to-grams": OuncesToGrams,
  "ounces-to-pounds": OuncesToPounds,
  "oz-to-kg": OzToKg,
  "pounds-to-grams": PoundsToGrams,
  "pounds-to-ounces": PoundsToOunces,
  "stone-to-lbs": StoneToLbs,
  "ton-to-lbs": TonToLbs,
  "weight-mass-converter": WeightMassConverter,
};

export async function generateMetadata({ params }) {
  const { tool } = await params;

  // Get tool details
  const toolData = TOOL_CATEGORIES.find((item) => item.id === "other-tools")
    ?.subcategories.flatMap((sub) => sub.tools)
    .find((t) => t.id === tool);
  const toolName = toolData?.name;

  // Get country from host
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/tools/other-tools/${tool}`, host);
  const country = getCountryName(getCountryCodeFromHost(host));

  if (!toolName) {
    return {
      title: "Image Tool Not Found | Inform Readers",
      description: "The requested image tool was not found. Explore other free tools at Inform Readers.",
      alternates,
    };
  }

  // Values for replacement
  const values = { toolName, country };

  // Pick random templates
  const randomTitle = applyMetaTemplate(
    metaTitleTemplates[Math.floor(Math.random() * metaTitleTemplates.length)],
    values
  );
  const randomDescription = applyMetaTemplate(
    metaDescriptionTemplates[Math.floor(Math.random() * metaDescriptionTemplates.length)],
    values
  );

  return {
    title: randomTitle,
    description: randomDescription,
    alternates,
  };
}

export default async function ToolPage({ params }) {
  const { tool } = await params;
  const Component = toolComponents[tool] || (() => <div>Tool not found</div>);

  const toolData = TOOL_CATEGORIES.find((item) => item.id === "other-tools")
    ?.subcategories.flatMap((sub) => sub.tools)
    .find((t) => t.id === tool);
  const toolName = toolData?.name || "";

  const host = (await headers()).get("host") || "informreaders.com";
  const country = getCountryName(getCountryCodeFromHost(host));

  const values = { toolName, country };

  // Apply FAQs
  const faqs = faqTemplates.map((t) => applyFaqTemplate(t, values));

  const chosenIntro = applyIntroTemplate(
    introTemplates[Math.floor(Math.random() * introTemplates.length)],
    values
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: "Other Tools", href: "/tools/other-tools" },
    { label: toolName },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Intro Section */}
      <Breadcrumb items={breadcrumbItems} />
      <div className="mb-6">
        <p className="text-gray-700 text-lg font-semibold text-center leading-relaxed">{chosenIntro}</p>
      </div>

      {/* Tool Component */}
      <Component />

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
