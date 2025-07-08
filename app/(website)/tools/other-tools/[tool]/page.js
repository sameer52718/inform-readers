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
