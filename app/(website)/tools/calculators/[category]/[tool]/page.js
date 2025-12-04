import { TOOL_CATEGORIES } from "@/constant/tools";

// Physics
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

// Maths
import AdvancedFractionCalculator from "@/components/pages/tools/calculator/math/advanced-fraction-calculator";
import AreaCalculator from "@/components/pages/tools/calculator/math/area-calculator";
import AverageCalculator from "@/components/pages/tools/calculator/math/average-calculator";
import BigNumberCalculator from "@/components/pages/tools/calculator/math/big-number-calculator";
import BinaryCalculator from "@/components/pages/tools/calculator/math/binary-calculator";
import CircleCalculator from "@/components/pages/tools/calculator/math/circle-calculator";
import CommonFactorCalculator from "@/components/pages/tools/calculator/math/common-factor-calculator";
import ConfidenceIntervalCalculator from "@/components/pages/tools/calculator/math/confidence-interval-calculator";
import DistanceCalculator from "@/components/pages/tools/calculator/math/distance-calculator";
import ExponentCalculator from "@/components/pages/tools/calculator/math/exponent-calculator";
import FactorCalculator from "@/components/pages/tools/calculator/math/factor-calculator";
import FractionCalculator from "@/components/pages/tools/calculator/math/fraction-calculator";
import GreatestCommonFactorCalculator from "@/components/pages/tools/calculator/math/greatest-common-factor-calculator";
import HalfLifeCalculator from "@/components/pages/tools/calculator/math/half-life-calculator";
import HexCalculator from "@/components/pages/tools/calculator/math/hex-calculator";
import LCMCalculator from "@/components/pages/tools/calculator/math/lcm-calculator";
import LogarithmCalculator from "@/components/pages/tools/calculator/math/logarithm-calculator";
import LongDivisionCalculator from "@/components/pages/tools/calculator/math/long-division-calculator";
import MatrixCalculator from "@/components/pages/tools/calculator/math/matrix-calculator";
import MeanMedianModeRangeCalculator from "@/components/pages/tools/calculator/math/mean-median-mode-range-calculator";
import NumberSequenceCalculator from "@/components/pages/tools/calculator/math/number-sequence-calculator";
import PValueCalculator from "@/components/pages/tools/calculator/math/p-value-calculator";
import PercentErrorCalculator from "@/components/pages/tools/calculator/math/percent-error-calculator";
import PercentageCalculator from "@/components/pages/tools/calculator/math/percentage-calculator";
import PermutationAndCombinationCalculator from "@/components/pages/tools/calculator/math/permutation-and-combination-calculator";
import PrimeFactorizationCalculator from "@/components/pages/tools/calculator/math/prime-factorization-calculator";
import ProbabilityCalculator from "@/components/pages/tools/calculator/math/probability-calculator";
import PythagoreanTheoremCalculator from "@/components/pages/tools/calculator/math/pythagorean-theorem-calculator";
import QuadraticFormulaCalculator from "@/components/pages/tools/calculator/math/quadratic-formula-calculator";
import RandomNumberGenerator from "@/components/pages/tools/calculator/math/random-number-generator";
import RatioCalculator from "@/components/pages/tools/calculator/math/ratio-calculator";
import RightTriangleCalculator from "@/components/pages/tools/calculator/math/right-triangle-calculator";
import RootCalculator from "@/components/pages/tools/calculator/math/root-calculator";
import RoundingCalculator from "@/components/pages/tools/calculator/math/rounding-calculator";
import SampleSizeCalculator from "@/components/pages/tools/calculator/math/sample-size-calculator";
import ScientificCalculator from "@/components/pages/tools/calculator/math/scientific-calculator";
import ScientificNotationCalculator from "@/components/pages/tools/calculator/math/scientific-notation-calculator";
import SlopeCalculator from "@/components/pages/tools/calculator/math/slope-calculator";
import StandardDeviationCalculator from "@/components/pages/tools/calculator/math/standard-deviation-calculator";
import StatisticsCalculator from "@/components/pages/tools/calculator/math/statistics-calculator";
import SurfaceAreaCalculator from "@/components/pages/tools/calculator/math/surface-area-calculator";
import TriangleCalculator from "@/components/pages/tools/calculator/math/triangle-calculator";
import VolumeCalculator from "@/components/pages/tools/calculator/math/volume-calculator";
import ZScoreCalculator from "@/components/pages/tools/calculator/math/z-score-calculator";

// Health
import AnorexicBMICalculator from "@/components/pages/tools/calculator/health/anorexic-bmi-calculator";
import ArmyBodyFatCalculator from "@/components/pages/tools/calculator/health/army-body-fat-calculator";
import BMICalculator from "@/components/pages/tools/calculator/health/bmi-calculator";
import BMRCalculator from "@/components/pages/tools/calculator/health/bmr-calculator";
import BodySurfaceAreaCalculator from "@/components/pages/tools/calculator/health/body-surface-area-calculator";
import CaloriesBurnedCalculator from "@/components/pages/tools/calculator/health/calories-burned-calculator";
import CarbohydrateCalculator from "@/components/pages/tools/calculator/health/carbohydrate-calculator";
import FatIntakeCalculator from "@/components/pages/tools/calculator/health/fat-intake-calculator";
import HealthyWeightCalculator from "@/components/pages/tools/calculator/health/healthy-weight-calculator";
import IdealWeightCalculator from "@/components/pages/tools/calculator/health/ideal-weight-calculator";
import LeanBodyMassCalculator from "@/components/pages/tools/calculator/health/lean-body-mass-calculator";
import OneRepMaxCalculator from "@/components/pages/tools/calculator/health/one-rep-max-calculator";
import OverweightCalculator from "@/components/pages/tools/calculator/health/overweight-calculator";
import ProteinCalculator from "@/components/pages/tools/calculator/health/protein-calculator";
import TDEECalculator from "@/components/pages/tools/calculator/health/tdee-calculator";

// Biology
import AnnealingTemperatureCalculator from "@/components/pages/tools/calculator/biology/annealing-temperature-calculator";

// Financial
import Calculator401k from "@/components/pages/tools/calculator/financial/401k-calculator-for-use-by-us-residents";
import AdvanceDebtConsolidationCalculator from "@/components/pages/tools/calculator/financial/advance-debt-consolidation-calculator";
import AmortizationCalculator from "@/components/pages/tools/calculator/financial/amortization-calculator";
import AnnuityCalculator from "@/components/pages/tools/calculator/financial/annuity-calculator";
import AnnuityPayoutCalculator from "@/components/pages/tools/calculator/financial/annuity-payout-calculator";
import APRCalculator from "@/components/pages/tools/calculator/financial/apr-calculator";
import AutoLeaseCalculator from "@/components/pages/tools/calculator/financial/auto-lease-calculator";
import AutoLoanCalculator from "@/components/pages/tools/calculator/financial/auto-loan-calculator";
import AverageReturnCalculator from "@/components/pages/tools/calculator/financial/average-return-calculator";
import BondCalculator from "@/components/pages/tools/calculator/financial/bond-calculator";
import BudgetCalculator from "@/components/pages/tools/calculator/financial/budget-calculator";
import BusinessLoanCalculator from "@/components/pages/tools/calculator/financial/business-loan-calculator";
import CanadianMortgageCalculator from "@/components/pages/tools/calculator/financial/canadian-mortgage-calculator";
import CashBackLowInterestCalculator from "@/components/pages/tools/calculator/financial/cash-back-&-low-interest-calculator";
import CDCalculator from "@/components/pages/tools/calculator/financial/cd-calculator";
import CollegeCostCalculator from "@/components/pages/tools/calculator/financial/college-cost-calculator";
import CommissionCalculator from "@/components/pages/tools/calculator/financial/commission-calculator";
import CompoundInterestCalculator from "@/components/pages/tools/calculator/financial/compound-interest-calculator";
import CreditCardCalculator from "@/components/pages/tools/calculator/financial/credit-card-calculator";
import CreditCardPayoffCalculator from "@/components/pages/tools/calculator/financial/credit-card-payoff-calculator";
import DebtPayoffCalculator from "@/components/pages/tools/calculator/financial/debt-payoff-calculator";
import DebtConsolidationCalculator from "@/components/pages/tools/calculator/financial/debt-consolidation-calculator";
import DepreciationCalculator from "@/components/pages/tools/calculator/financial/depreciation-calculator";
import DiscountCalculator from "@/components/pages/tools/calculator/financial/discount-calculator";
import DownPaymentCalculator from "@/components/pages/tools/calculator/financial/down-payment-calculator";
import DTIRatioCalculator from "@/components/pages/tools/calculator/financial/dti-ratio-calculator";
import EstateTaxCalculator from "@/components/pages/tools/calculator/financial/estate-tax-calculator";
import FHALoanCalculator from "@/components/pages/tools/calculator/financial/fha-loan-calculator";
import FinanceCalculator from "@/components/pages/tools/calculator/financial/finance-calculator";
import FutureValueCalculator from "@/components/pages/tools/calculator/financial/future-value-calculator";
import HouseAffordabilityCalculator from "@/components/pages/tools/calculator/financial/house-affordability-calculator";
import IncomeTaxCalculator from "@/components/pages/tools/calculator/financial/income-tax-calculator";
import InflationCalculator from "@/components/pages/tools/calculator/financial/inflation-calculator";
import InterestCalculator from "@/components/pages/tools/calculator/financial/interest-calculator";
import InterestRateCalculator from "@/components/pages/tools/calculator/financial/interest-rate-calculator";
import InvestmentCalculator from "@/components/pages/tools/calculator/financial/investment-calculator";
import IRACalculator from "@/components/pages/tools/calculator/financial/ira-calculator";
import IRRCalculator from "@/components/pages/tools/calculator/financial/irr-calculator";
import LeaseCalculator from "@/components/pages/tools/calculator/financial/lease-calculator";
import LoanCalculator from "@/components/pages/tools/calculator/financial/loan-calculator";
import MarginCalculator from "@/components/pages/tools/calculator/financial/margin-calculator";
import MortgageAmortizationCalculator from "@/components/pages/tools/calculator/financial/mortgage-amortization-calculator";
import MortgagePayoffCalculator from "@/components/pages/tools/calculator/financial/mortgage-payoff-calculator";
import MortgageCalculator from "@/components/pages/tools/calculator/financial/mortgage-calculator";
import PaybackPeriodCalculator from "@/components/pages/tools/calculator/financial/payback-period-calculator";
import PaymentCalculator from "@/components/pages/tools/calculator/financial/payment-calculator";
import PensionCalculator from "@/components/pages/tools/calculator/financial/pension-calculator";
import PercentOffCalculator from "@/components/pages/tools/calculator/financial/percent-off-calculator";
import PersonalLoanCalculator from "@/components/pages/tools/calculator/financial/personal-loan-calculator";
import PresentValueCalculator from "@/components/pages/tools/calculator/financial/present-value-calculator";
import RefinanceCalculator from "@/components/pages/tools/calculator/financial/refinance-calculator";
import RentVsBuyCalculator from "@/components/pages/tools/calculator/financial/rent-vs-buy-calculator";
import RentCalculator from "@/components/pages/tools/calculator/financial/rent-calculator";
import RentalPropertyCalculator from "@/components/pages/tools/calculator/financial/rental-property-calculator";
import RepaymentCalculator from "@/components/pages/tools/calculator/financial/repayment-calculator";
import RetirementCalculator from "@/components/pages/tools/calculator/financial/retirement-calculator";
import RmdCalculator from "@/components/pages/tools/calculator/financial/rmd-calculator";
import RoiCalculator from "@/components/pages/tools/calculator/financial/roi-calculator";
import RothIraCalculator from "@/components/pages/tools/calculator/financial/roth-ira-calculator";
import SalaryCalculator from "@/components/pages/tools/calculator/financial/salary-calculator";
import SavingsCalculator from "@/components/pages/tools/calculator/financial/savings-calculator";
import SimpleInterestCalculator from "@/components/pages/tools/calculator/financial/simple-interest-calculator";
import SimplifiedSalesTaxCalculator from "@/components/pages/tools/calculator/financial/simplified-sales-tax-calculator";
import SocialSecurityCalculator from "@/components/pages/tools/calculator/financial/social-security-calculator";
import StudentLoanCalculator from "@/components/pages/tools/calculator/financial/student-loan-calculator";
import TakeHomePaycheckCalculator from "@/components/pages/tools/calculator/financial/take-home-paycheck-calculator";
import UKMortgageCalculator from "@/components/pages/tools/calculator/financial/uk-mortgage-calculator";
import VAMortgageCalculator from "@/components/pages/tools/calculator/financial/va-mortgage-calculator";
import VATCalculator from "@/components/pages/tools/calculator/financial/vat-calculator";

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
  // Physics
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
  // Maths
  "advanced-fraction-calculator": AdvancedFractionCalculator,
  "area-calculator": AreaCalculator,
  "average-calculator": AverageCalculator,
  "big-number-calculator": BigNumberCalculator,
  "binary-calculator": BinaryCalculator,
  "circle-calculator": CircleCalculator,
  "common-factor-calculator": CommonFactorCalculator,
  "confidence-interval-calculator": ConfidenceIntervalCalculator,
  "distance-calculator": DistanceCalculator,
  "exponent-calculator": ExponentCalculator,
  "factor-calculator": FactorCalculator,
  "fraction-calculator": FractionCalculator,
  "greatest-common-factor-calculator": GreatestCommonFactorCalculator,
  "half-life-calculator": HalfLifeCalculator,
  "hex-calculator": HexCalculator,
  "lcm-calculator": LCMCalculator,
  "logarithm-calculator": LogarithmCalculator,
  "long-division-calculator": LongDivisionCalculator,
  "matrix-calculator": MatrixCalculator,
  "mean-median-mode-range-calculator": MeanMedianModeRangeCalculator,
  "number-sequence-calculator": NumberSequenceCalculator,
  "p-value-calculator": PValueCalculator,
  "percent-error-calculator": PercentErrorCalculator,
  "percentage-calculator": PercentageCalculator,
  "permutation-and-combination-calculator": PermutationAndCombinationCalculator,
  "prime-factorization-calculator": PrimeFactorizationCalculator,
  "probability-calculator": ProbabilityCalculator,
  "pythagorean-theorem-calculator": PythagoreanTheoremCalculator,
  "quadratic-formula-calculator": QuadraticFormulaCalculator,
  "random-number-generator": RandomNumberGenerator,
  "ratio-calculator": RatioCalculator,
  "right-triangle-calculator": RightTriangleCalculator,
  "root-calculator": RootCalculator,
  "rounding-calculator": RoundingCalculator,
  "sample-size-calculator": SampleSizeCalculator,
  "scientific-calculator": ScientificCalculator,
  "scientific-notation-calculator": ScientificNotationCalculator,
  "slope-calculator": SlopeCalculator,
  "standard-deviation-calculator": StandardDeviationCalculator,
  "statistics-calculator": StatisticsCalculator,
  "surface-area-calculator": SurfaceAreaCalculator,
  "triangle-calculator": TriangleCalculator,
  "volume-calculator": VolumeCalculator,
  "z-score-calculator": ZScoreCalculator,
  // Health
  "anorexic-bmi-calculator": AnorexicBMICalculator,
  "army-body-fat-calculator": ArmyBodyFatCalculator,
  "bmi-calculator": BMICalculator,
  "bmr-calculator": BMRCalculator,
  "body-surface-area-calculator": BodySurfaceAreaCalculator,
  "calories-burned-calculator": CaloriesBurnedCalculator,
  "carbohydrate-calculator": CarbohydrateCalculator,
  "fat-intake-calculator": FatIntakeCalculator,
  "healthy-weight-calculator": HealthyWeightCalculator,
  "ideal-weight-calculator": IdealWeightCalculator,
  "lean-body-mass-calculator": LeanBodyMassCalculator,
  "one-rep-max-calculator": OneRepMaxCalculator,
  "overweight-calculator": OverweightCalculator,
  "protein-calculator": ProteinCalculator,
  "tdee-calculator": TDEECalculator,
  // biology
  "annealing-temperature-calculator": AnnealingTemperatureCalculator,
  // Financial
  "401k-calculator-for-use-by-us-residents": Calculator401k,
  "advance-debt-consolidation-calculator": AdvanceDebtConsolidationCalculator,
  "amortization-calculator": AmortizationCalculator,
  "annuity-calculator": AnnuityCalculator,
  "annuity-payout-calculator": AnnuityPayoutCalculator,
  "apr-calculator": APRCalculator,
  "auto-lease-calculator": AutoLeaseCalculator,
  "auto-loan-calculator": AutoLoanCalculator,
  "average-return-calculator": AverageReturnCalculator,
  "bond-calculator": BondCalculator,
  "budget-calculator": BudgetCalculator,
  "business-loan-calculator": BusinessLoanCalculator,
  "canadian-mortgage-calculator": CanadianMortgageCalculator,
  "cash-back-and-low-interest-calculator": CashBackLowInterestCalculator,
  "cd-calculator": CDCalculator,
  "college-cost-calculator": CollegeCostCalculator,
  "commission-calculator": CommissionCalculator,
  "compound-interest-calculator": CompoundInterestCalculator,
  "credit-card-calculator": CreditCardCalculator,
  "credit-card-payoff-calculator": CreditCardPayoffCalculator,
  "debt-payoff-calculator": DebtPayoffCalculator,
  "debt-consolidation-calculator": DebtConsolidationCalculator,
  "depreciation-calculator": DepreciationCalculator,
  "discount-calculator": DiscountCalculator,
  "down-payment-calculator": DownPaymentCalculator,
  "dti-ratio-calculator": DTIRatioCalculator,
  "estate-tax-calculator": EstateTaxCalculator,
  "fha-loan-calculator": FHALoanCalculator,
  "finance-calculator": FinanceCalculator,
  "future-value-calculator": FutureValueCalculator,
  "house-affordability-calculator": HouseAffordabilityCalculator,
  "income-tax-calculator": IncomeTaxCalculator,
  "inflation-calculator": InflationCalculator,
  "interest-calculator": InterestCalculator,
  "interest-rate-calculator": InterestRateCalculator,
  "investment-calculator": InvestmentCalculator,
  "ira-calculator": IRACalculator,
  "irr-calculator": IRRCalculator,
  "lease-calculator": LeaseCalculator,
  "loan-calculator": LoanCalculator,
  "margin-calculator": MarginCalculator,
  "mortgage-amortization-calculator": MortgageAmortizationCalculator,
  "mortgage-payoff-calculator": MortgagePayoffCalculator,
  "mortgage-calculator": MortgageCalculator,
  "payback-period-calculator": PaybackPeriodCalculator,
  "payment-calculator": PaymentCalculator,
  "pension-calculator": PensionCalculator,
  "percent-off-calculator": PercentOffCalculator,
  "personal-loan-calculator": PersonalLoanCalculator,
  "present-value-calculator": PresentValueCalculator,
  "refinance-calculator": RefinanceCalculator,
  "rent-vs-buy-calculator": RentVsBuyCalculator,
  "rent-calculator": RentCalculator,
  "rental-property-calculator": RentalPropertyCalculator,
  "repayment-calculator": RepaymentCalculator,
  "retirement-calculator": RetirementCalculator,
  "rmd-calculator": RmdCalculator,
  "roi-calculator": RoiCalculator,
  "roth-ira-calculator": RothIraCalculator,
  "salary-calculator": SalaryCalculator,
  "savings-calculator": SavingsCalculator,
  "simple-interest-calculator": SimpleInterestCalculator,
  "simplified-sales-tax-calculator": SimplifiedSalesTaxCalculator,
  "social-security-calculator": SocialSecurityCalculator,
  "student-loan-calculator": StudentLoanCalculator,
  "take-home-paycheck-calculator": TakeHomePaycheckCalculator,
  "uk-mortgage-calculator": UKMortgageCalculator,
  "va-mortgage-calculator": VAMortgageCalculator,
  "vat-calculator": VATCalculator,
};

export async function generateMetadata({ params }) {
  const { tool, category } = params;

  // Get tool details
  const toolData = TOOL_CATEGORIES.find((item) => item.id === "calculators")
    ?.subcategories.flatMap((sub) => sub.tools)
    .find((t) => t.id === tool);
  const toolName = toolData?.name;

  // Get country from host
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/tools/calculators/${category}/${tool}`, host);
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
  const { tool } = params;
  const Component = toolComponents[tool] || (() => <div>Tool not found</div>);

  const toolData = TOOL_CATEGORIES.find((item) => item.id === "calculators")
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
    { label: "Calculators", href: "/tools/calculators" },
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
