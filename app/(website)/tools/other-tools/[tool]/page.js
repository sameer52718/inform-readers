import { otherToolMetaData } from "@/constant/tools";

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
};

export async function generateMetadata({ params }) {
  const { tool } = params;
  return (
    otherToolMetaData[tool] || {
      title: "Other Tool Not Found | Inform Readers",
      description: "The requested image tool was not found. Explore other free tools at Inform Readers.",
    }
  );
}

export default function ToolPage({ params }) {
  const { tool } = params;
  const Component = toolComponents[tool] || (() => <div>Tool not found</div>);

  return <Component />;
}
