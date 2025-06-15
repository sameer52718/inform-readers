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
import ElectromagnetismCalculator from "@/components/pages/tools/calculator/physics/electromagnetism-calculator";
import EnergyCalculatorAdvanced from "@/components/pages/tools/calculator/physics/energy-calculator-advanced";
import FluidDynamicsCalculator from "@/components/pages/tools/calculator/physics/fluid-dynamics-calculator";
import FreeFallAirResistanceCalculator from "@/components/pages/tools/calculator/physics/free-fall-air-resistance-calculator";
import GeneralRelativityCalculator from "@/components/pages/tools/calculator/physics/general-relativity-calculator";
import GravitationalForceCalculator from "@/components/pages/tools/calculator/physics/gravitational-force-calculator";
import GroundSpeedCalculator from "@/components/pages/tools/calculator/physics/ground-speed-calculator";
import HarmonicMotionCalculator from "@/components/pages/tools/calculator/physics/harmonic-motion-calculator";
import MagnitudeAccelerationCalculator from "@/components/pages/tools/calculator/physics/magnitude-acceleration-calculator";
import MomentumCollisionCalculator from "@/components/pages/tools/calculator/physics/momentum-collision-calculator";
import NuclearPhysicsCalculator from "@/components/pages/tools/calculator/physics/nuclear-physics-calculator";
import OpticsCalculator from "@/components/pages/tools/calculator/physics/optics-calculator";
import ParticlePhysicsCalculator from "@/components/pages/tools/calculator/physics/particle-physics-calculator";
import PlasmaPhysicsCalculator from "@/components/pages/tools/calculator/physics/plasma-physics-calculator";
import PolarMomentCalculator from "@/components/pages/tools/calculator/physics/polar-moment-calculator";
import ProjectileMotionCalculator from "@/components/pages/tools/calculator/physics/projectile-motion-calculator";
import ProjectileVisualizerAdvanced from "@/components/pages/tools/calculator/physics/projectile-visualizer-advanced";
import QuantumFieldTheoryCalculator from "@/components/pages/tools/calculator/physics/quantum-field-theory-calculator";
import QuantumMechanicsCalculator from "@/components/pages/tools/calculator/physics/quantum-mechanics-calculator";
import RelativityCalculator from "@/components/pages/tools/calculator/physics/relativity-calculator";
import RotationalDynamicsCalculator from "@/components/pages/tools/calculator/physics/rotational-dynamics-calculator";
import StatisticalMechanicsCalculator from "@/components/pages/tools/calculator/physics/statistical-mechanics-calculator";
import SuvatCalculatorAdvanced from "@/components/pages/tools/calculator/physics/suvat-calculator-advanced";
import TensionCalculator from "@/components/pages/tools/calculator/physics/tension-calculator";
import ThermodynamicsCalculator from "@/components/pages/tools/calculator/physics/thermodynamics-calculator";
import VectorResolver from "@/components/pages/tools/calculator/physics/vector-resolver";
import WaveMechanicsCalculator from "@/components/pages/tools/calculator/physics/wave-mechanics-calculator";
import WorkEnergyCalculator from "@/components/pages/tools/calculator/physics/work-energy-calculator";

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
  "electromagnetism-calculator": ElectromagnetismCalculator,
  "energy-calculator-advanced": EnergyCalculatorAdvanced,
  "fluid-dynamics-calculator": FluidDynamicsCalculator,
  "free-fall-air-resistance-calculator": FreeFallAirResistanceCalculator,
  "general-relativity-calculator": GeneralRelativityCalculator,
  "gravitational-force-calculator": GravitationalForceCalculator,
  "ground-speed-calculator": GroundSpeedCalculator,
  "harmonic-motion-calculator": HarmonicMotionCalculator,
  "magnitude-acceleration-calculator": MagnitudeAccelerationCalculator,
  "momentum-collision-calculator": MomentumCollisionCalculator,
  "nuclear-physics-calculator": NuclearPhysicsCalculator,
  "optics-calculator": OpticsCalculator,
  "particle-physics-calculator": ParticlePhysicsCalculator,
  "plasma-physics-calculator": PlasmaPhysicsCalculator,
  "polar-moment-calculator": PolarMomentCalculator,
  "projectile-motion-calculator": ProjectileMotionCalculator,
  "projectile-visualizer-advanced": ProjectileVisualizerAdvanced,
  "quantum-field-theory-calculator": QuantumFieldTheoryCalculator,
  "quantum-mechanics-calculator": QuantumMechanicsCalculator,
  "relativity-calculator": RelativityCalculator,
  "rotational-dynamics-calculator": RotationalDynamicsCalculator,
  "statistical-mechanics-calculator": StatisticalMechanicsCalculator,
  "suvat-calculator-advanced": SuvatCalculatorAdvanced,
  "tension-calculator": TensionCalculator,
  "thermodynamics-calculator": ThermodynamicsCalculator,
  "vector-resolver": VectorResolver,
  "wave-mechanics-calculator": WaveMechanicsCalculator,
  "work-energy-calculator": WorkEnergyCalculator,
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
