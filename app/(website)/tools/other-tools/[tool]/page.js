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
