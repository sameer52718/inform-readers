import { calculatorMetaData } from "@/constant/tools";

import AccelerationCalculatorWithCharts from "@/components/pages/tools/calculator/physics/acceleration-calculator-with-charts";
import ArrowSpeedCalculator from "@/components/pages/tools/calculator/physics/arrow-speed-calculator";
import AstrophysicsCalculator from "@/components/pages/tools/calculator/physics/astrophysics-calculator";
import BallisticCoefficientCalculator from "@/components/pages/tools/calculator/physics/ballistic-coefficient-calculator";
import BiophysicsCalculator from "@/components/pages/tools/calculator/physics/biophysics-calculator";
import CarCrashCalculator from "@/components/pages/tools/calculator/physics/car-crash-calculator";
import CarJumpDistanceCalculator from "@/components/pages/tools/calculator/physics/car-jump-distance-calculator";
import ComputationalPhysicsCalculator from "@/components/pages/tools/calculator/physics/computational-physics-calculator";
import CondensedMatterCalculator from "@/components/pages/tools/calculator/physics/condensed-matter-calculator";
import CosmologyCalculator from "@/components/pages/tools/calculator/physics/cosmology-calculator";

const toolComponents = {
  "acceleration-calculator-with-charts": AccelerationCalculatorWithCharts,
  "arrow-speed-calculator": ArrowSpeedCalculator,
  "astrophysics-calculator": AstrophysicsCalculator,
  "ballistic-coefficient-calculator": BallisticCoefficientCalculator,
  "biophysics-calculator": BiophysicsCalculator,
  "car-crash-calculator": CarCrashCalculator,
  "car-jump-distance-calculator": CarJumpDistanceCalculator,
  "computational-physics-calculator": ComputationalPhysicsCalculator,
  "condensed-matter-calculator": CondensedMatterCalculator,
  "cosmology-calculator": CosmologyCalculator,
};

export async function generateMetadata({ params }) {
  const { tool } = params;

  return (
    calculatorMetaData[tool] || {
      title: "Calculator Tool Not Found | Inform Readers",
      description: "The requested Calculator tool was not found. Explore other free tools at Inform Readers.",
    }
  );
}

export default function ToolPage({ params }) {
  const { tool } = params;
  const Component = toolComponents[tool] || (() => <div>Tool not found</div>);

  return <Component />;
}
