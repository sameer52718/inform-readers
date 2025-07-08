export const TOOL_CATEGORIES = [
  {
    id: "image-tools",
    name: "Image Tools",
    tools: [
      { id: "remove-watermark", name: "Remove Watermark", path: "/tools/image-tools/remove-watermark" },
      { id: "upscale-image", name: "Upscale Image", path: "/tools/image-tools/upscale-image" },
      { id: "image-to-svg", name: "Image to SVG", path: "/tools/image-tools/image-to-svg" },
      { id: "blur-image", name: "Blur Image", path: "/tools/image-tools/blur-image" },
      { id: "image-histogram", name: "Image Histogram", path: "/tools/image-tools/image-histogram" },
      { id: "image-watermark", name: "Image Watermark", path: "/tools/image-tools/image-watermark" },
      {
        id: "adjust-brightness-contrast",
        name: "Adjust Brightness/Contrast",
        path: "/tools/image-tools/adjust-brightness-contrast",
      },
      { id: "noise-reduction", name: "Noise Reduction", path: "/tools/image-tools/noise-reduction" },
      {
        id: "advanced-image-compressor",
        name: "Advanced Image Compressor",
        path: "/tools/image-tools/advanced-image-compressor",
      },
      { id: "image-to-ascii", name: "Image to ASCII", path: "/tools/image-tools/image-to-ascii" },
      { id: "add-border", name: "Add Border", path: "/tools/image-tools/add-border" },
      { id: "add-text-to-image", name: "Add Text to Image", path: "/tools/image-tools/add-text-to-image" },
      {
        id: "black-white-filter",
        name: "Black & White Filter",
        path: "/tools/image-tools/black-white-filter",
      },
      { id: "collage-maker", name: "Collage Maker", path: "/tools/image-tools/collage-maker" },
      { id: "colorize-photo", name: "Colorize Photo", path: "/tools/image-tools/colorize-photo" },
      { id: "compress-image", name: "Compress Image", path: "/tools/image-tools/compress-image" },
      { id: "crop-image", name: "Crop Image", path: "/tools/image-tools/crop-image" },
      { id: "heic-to-jpg", name: "HEIC to JPG", path: "/tools/image-tools/heic-to-jpg" },
      {
        id: "image-format-converter",
        name: "Image Format Converter",
        path: "/tools/image-tools/image-format-converter",
      },
      { id: "image-splitter", name: "Image Splitter", path: "/tools/image-tools/image-splitter" },

      // Newly added tools
      { id: "image-to-text", name: "Image to Text", path: "/tools/image-tools/image-to-text" },
      { id: "pdf-to-jpg", name: "PDF to JPG", path: "/tools/image-tools/pdf-to-jpg" },
      { id: "pixelate-image", name: "Pixelate Image", path: "/tools/image-tools/pixelate-image" },
      { id: "remove-background", name: "Remove Background", path: "/tools/image-tools/remove-background" },
      { id: "resize-image", name: "Resize Image", path: "/tools/image-tools/resize-image" },
      { id: "round-image", name: "Round Image", path: "/tools/image-tools/round-image" },
      { id: "view-metadata", name: "View Metadata", path: "/tools/image-tools/view-metadata" },
    ],
  },
  {
    id: "pdf-tools",
    name: "PDF Tools",
    tools: [
      {
        id: "add_page_number_to_pdf",
        name: "Add Page Number to PDF",
        path: "/tools/pdf-tools/add-page-number-to-pdf",
      },
      {
        id: "bmp_to_pdf_converter",
        name: "BMP to PDF Converter",
        path: "/tools/pdf-tools/bmp-to-pdf-converter",
      },
      {
        id: "compress_pdf_tool",
        name: "Compress PDF",
        path: "/tools/pdf-tools/compress-pdf-tool",
      },
      {
        id: "excel_to_pdf_tool",
        name: "Excel to PDF",
        path: "/tools/pdf-tools/excel-to-pdf-tool",
      },
      {
        id: "extract_from_pdf",
        name: "Extract from PDF",
        path: "/tools/pdf-tools/extract-from-pdf",
      },
      {
        id: "extract_pdf_pages_tool",
        name: "Extract PDF Pages",
        path: "/tools/pdf-tools/extract-pdf-pages-tool",
      },
      {
        id: "high_resolution_tiff_to_pdf_converter",
        name: "High-Res TIFF to PDF",
        path: "/tools/pdf-tools/high-resolution-tiff-to-pdf-converter",
      },
      {
        id: "jpg_to_pdf_converter",
        name: "JPG to PDF Converter",
        path: "/tools/pdf-tools/jpg-to-pdf-converter",
      },
      {
        id: "merge_pdf_tool",
        name: "Merge PDFs",
        path: "/tools/pdf-tools/merge-pdf-tool",
      },
      {
        id: "organize_pdf_tool",
        name: "Organize PDF",
        path: "/tools/pdf-tools/organize-pdf-tool",
      },
      {
        id: "pdf_to_bmp_converter",
        name: "PDF to BMP Converter",
        path: "/tools/pdf-tools/pdf-to-bmp-converter",
      },
      {
        id: "pdf_to_csv",
        name: "PDF to CSV",
        path: "/tools/pdf-tools/pdf-to-csv",
      },
      {
        id: "pdf_to_png_converter",
        name: "PDF to PNG Converter",
        path: "/tools/pdf-tools/pdf-to-png-converter",
      },
      // {
      //   id: "pdf_to_ppt",
      //   name: "PDF to PPT",
      //   path: "/tools/pdf-tools/pdf-to-ppt",
      // },
      {
        id: "pdf_to_tiff_converter",
        name: "PDF to TIFF Converter",
        path: "/tools/pdf-tools/pdf-to-tiff-converter",
      },
      {
        id: "pdf_to_txt_tool",
        name: "PDF to TXT",
        path: "/tools/pdf-tools/pdf-to-txt-tool",
      },
      {
        id: "pdf_to_word",
        name: "PDF to Word",
        path: "/tools/pdf-tools/pdf-to-word",
      },
      {
        id: "pdf_to_zip_converter",
        name: "PDF to ZIP",
        path: "/tools/pdf-tools/pdf-to-zip-converter",
      },
      {
        id: "png_to_pdf_converter",
        name: "PNG to PDF Converter",
        path: "/tools/pdf-tools/png-to-pdf-converter",
      },
      {
        id: "powerpoint_to_pdf_converter",
        name: "PowerPoint to PDF",
        path: "/tools/pdf-tools/powerpoint-to-pdf-converter",
      },
      {
        id: "remove_pages_tool",
        name: "Remove PDF Pages",
        path: "/tools/pdf-tools/remove-pages-tool",
      },
      {
        id: "repair_pdf_tool",
        name: "Repair PDF",
        path: "/tools/pdf-tools/repair-pdf-tool",
      },
      {
        id: "rotate_pdf_tool",
        name: "Rotate PDF",
        path: "/tools/pdf-tools/rotate-pdf-tool",
      },
      {
        id: "txt_to_pdf_tool",
        name: "TXT to PDF",
        path: "/tools/pdf-tools/txt-to-pdf-tool",
      },
      // {
      //   id: "word_to_pdf_converter",
      //   name: "Word to PDF Converter",
      //   path: "/tools/pdf-tools/word-to-pdf-converter",
      // },
    ],
  },

  {
    id: "calculators",
    name: "Calculators",
    subcategories: [
      {
        id: "physics-calculators",
        name: "Physics Calculators",
        tools: [
          {
            id: "acceleration_calculator_with_charts",
            name: "Acceleration Calculator with Charts",
            path: "/tools/calculators/physics/acceleration-calculator-with-charts",
          },
          {
            id: "arrow_speed_calculator",
            name: "Arrow Speed Calculator",
            path: "/tools/calculators/physics/arrow-speed-calculator",
          },
          {
            id: "astrophysics_calculator",
            name: "Astrophysics Calculator",
            path: "/tools/calculators/physics/astrophysics-calculator",
          },
          {
            id: "ballistic_coefficient_calculator",
            name: "Ballistic Coefficient Calculator",
            path: "/tools/calculators/physics/ballistic-coefficient-calculator",
          },
          {
            id: "biophysics_calculator",
            name: "Biophysics Calculator",
            path: "/tools/calculators/physics/biophysics-calculator",
          },
          {
            id: "car_crash_calculator",
            name: "Car Crash Calculator",
            path: "/tools/calculators/physics/car-crash-calculator",
          },
          {
            id: "car_jump_distance_calculator",
            name: "Car Jump Distance Calculator",
            path: "/tools/calculators/physics/car-jump-distance-calculator",
          },
          {
            id: "computational_physics_calculator",
            name: "Computational Physics Calculator",
            path: "/tools/calculators/physics/computational-physics-calculator",
          },
          {
            id: "condensed_matter_calculator",
            name: "Condensed Matter Calculator",
            path: "/tools/calculators/physics/condensed-matter-calculator",
          },
          {
            id: "cosmology_calculator",
            name: "Cosmology Calculator",
            path: "/tools/calculators/physics/cosmology-calculator",
          },
          {
            id: "electromagnetism_calculator",
            name: "Electromagnetism Calculator",
            path: "/tools/calculators/physics/electromagnetism-calculator",
          },
          {
            id: "energy_calculator_advanced",
            name: "Advanced Energy Calculator",
            path: "/tools/calculators/physics/energy-calculator-advanced",
          },
          {
            id: "fluid_dynamics_calculator",
            name: "Fluid Dynamics Calculator",
            path: "/tools/calculators/physics/fluid-dynamics-calculator",
          },
          {
            id: "free_fall_air_resistance_calculator",
            name: "Free Fall with Air Resistance Calculator",
            path: "/tools/calculators/physics/free-fall-air-resistance-calculator",
          },
          {
            id: "general_relativity_calculator",
            name: "General Relativity Calculator",
            path: "/tools/calculators/physics/general-relativity-calculator",
          },
          {
            id: "gravitational_force_calculator",
            name: "Gravitational Force Calculator",
            path: "/tools/calculators/physics/gravitational-force-calculator",
          },
          {
            id: "ground_speed_calculator",
            name: "Ground Speed Calculator",
            path: "/tools/calculators/physics/ground-speed-calculator",
          },
          {
            id: "harmonic_motion_calculator",
            name: "Harmonic Motion Calculator",
            path: "/tools/calculators/physics/harmonic-motion-calculator",
          },
          {
            id: "magnitude_acceleration_calculator",
            name: "Magnitude of Acceleration Calculator",
            path: "/tools/calculators/physics/magnitude-acceleration-calculator",
          },
          {
            id: "momentum_collision_calculator",
            name: "Momentum & Collision Calculator",
            path: "/tools/calculators/physics/momentum-collision-calculator",
          },
          {
            id: "nuclear_physics_calculator",
            name: "Nuclear Physics Calculator",
            path: "/tools/calculators/physics/nuclear-physics-calculator",
          },
          {
            id: "optics_calculator",
            name: "Optics Calculator",
            path: "/tools/calculators/physics/optics-calculator",
          },
          {
            id: "particle_physics_calculator",
            name: "Particle Physics Calculator",
            path: "/tools/calculators/physics/particle-physics-calculator",
          },
          {
            id: "plasma_physics_calculator",
            name: "Plasma Physics Calculator",
            path: "/tools/calculators/physics/plasma-physics-calculator",
          },
          {
            id: "polar_moment_calculator",
            name: "Polar Moment Calculator",
            path: "/tools/calculators/physics/polar-moment-calculator",
          },
          {
            id: "projectile_motion_calculator",
            name: "Projectile Motion Calculator",
            path: "/tools/calculators/physics/projectile-motion-calculator",
          },
          {
            id: "projectile_visualizer_advanced",
            name: "Projectile Visualizer Advanced",
            path: "/tools/calculators/physics/projectile-visualizer-advanced",
          },
          {
            id: "quantum_field_theory_calculator",
            name: "Quantum Field Theory Calculator",
            path: "/tools/calculators/physics/quantum-field-theory-calculator",
          },
          {
            id: "quantum_mechanics_calculator",
            name: "Quantum Mechanics Calculator",
            path: "/tools/calculators/physics/quantum-mechanics-calculator",
          },
          {
            id: "relativity_calculator",
            name: "Relativity Calculator",
            path: "/tools/calculators/physics/relativity-calculator",
          },
          {
            id: "rotational_dynamics_calculator",
            name: "Rotational Dynamics Calculator",
            path: "/tools/calculators/physics/rotational-dynamics-calculator",
          },
          {
            id: "statistical_mechanics_calculator",
            name: "Statistical Mechanics Calculator",
            path: "/tools/calculators/physics/statistical-mechanics-calculator",
          },
          {
            id: "suvat_calculator_advanced",
            name: "SUVAT Calculator Advanced",
            path: "/tools/calculators/physics/suvat-calculator-advanced",
          },
          {
            id: "tension_calculator",
            name: "Tension Calculator",
            path: "/tools/calculators/physics/tension-calculator",
          },
          {
            id: "thermodynamics_calculator",
            name: "Thermodynamics Calculator",
            path: "/tools/calculators/physics/thermodynamics-calculator",
          },
          {
            id: "vector_resolver",
            name: "Vector Resolver",
            path: "/tools/calculators/physics/vector-resolver",
          },
          {
            id: "wave_mechanics_calculator",
            name: "Wave Mechanics Calculator",
            path: "/tools/calculators/physics/wave-mechanics-calculator",
          },
          {
            id: "work_energy_calculator",
            name: "Work and Energy Calculator",
            path: "/tools/calculators/physics/work-energy-calculator",
          },
        ],
      },
      {
        id: "maths-calculators",
        name: "Maths Calculators",
        tools: [
          {
            id: "advanced_fraction_calculator",
            name: "Advanced Fraction Calculator",
            path: "/tools/calculators/math/advanced-fraction-calculator",
          },
          {
            id: "area_calculator",
            name: "Area Calculator",
            path: "/tools/calculators/math/area-calculator",
          },
          {
            id: "average_calculator",
            name: "Average Calculator",
            path: "/tools/calculators/math/average-calculator",
          },
          {
            id: "big_number_calculator",
            name: "Big Number Calculator",
            path: "/tools/calculators/math/big-number-calculator",
          },
          {
            id: "binary_calculator",
            name: "Binary Calculator",
            path: "/tools/calculators/math/binary-calculator",
          },
          {
            id: "circle_calculator",
            name: "Circle Calculator",
            path: "/tools/calculators/math/circle-calculator",
          },
          {
            id: "common_factor_calculator",
            name: "Common Factor Calculator",
            path: "/tools/calculators/math/common-factor-calculator",
          },
          {
            id: "confidence_interval_calculator",
            name: "Confidence Interval Calculator",
            path: "/tools/calculators/math/confidence-interval-calculator",
          },
          {
            id: "distance_calculator",
            name: "Distance Calculator",
            path: "/tools/calculators/math/distance-calculator",
          },
          {
            id: "exponent_calculator",
            name: "Exponent Calculator",
            path: "/tools/calculators/math/exponent-calculator",
          },
          {
            id: "factor_calculator",
            name: "Factor Calculator",
            path: "/tools/calculators/math/factor-calculator",
          },
          {
            id: "fraction_calculator",
            name: "Fraction Calculator",
            path: "/tools/calculators/math/fraction-calculator",
          },
          {
            id: "greatest_common_factor_calculator",
            name: "Greatest Common Factor Calculator",
            path: "/tools/calculators/math/greatest-common-factor-calculator",
          },
          {
            id: "half_life_calculator",
            name: "Half-Life Calculator",
            path: "/tools/calculators/math/half-life-calculator",
          },
          {
            id: "hex_calculator",
            name: "Hex Calculator",
            path: "/tools/calculators/math/hex-calculator",
          },
          {
            id: "lcm_calculator",
            name: "LCM Calculator",
            path: "/tools/calculators/math/lcm-calculator",
          },
          {
            id: "logarithm_calculator",
            name: "Logarithm Calculator",
            path: "/tools/calculators/math/logarithm-calculator",
          },
          {
            id: "long_division_calculator",
            name: "Long Division Calculator",
            path: "/tools/calculators/math/long-division-calculator",
          },
          {
            id: "matrix_calculator",
            name: "Matrix Calculator",
            path: "/tools/calculators/math/matrix-calculator",
          },
          {
            id: "mean_median_mode_range_calculator",
            name: "Mean, Median, Mode, Range Calculator",
            path: "/tools/calculators/math/mean-median-mode-range-calculator",
          },
          {
            id: "number_sequence_calculator",
            name: "Number Sequence Calculator",
            path: "/tools/calculators/math/number-sequence-calculator",
          },
          {
            id: "p_value_calculator",
            name: "P-value Calculator",
            path: "/tools/calculators/math/p-value-calculator",
          },
          {
            id: "percent_error_calculator",
            name: "Percent Error Calculator",
            path: "/tools/calculators/math/percent-error-calculator",
          },
          {
            id: "percentage_calculator",
            name: "Percentage Calculator",
            path: "/tools/calculators/math/percentage-calculator",
          },
          {
            id: "permutation_and_combination_calculator",
            name: "Permutation and Combination Calculator",
            path: "/tools/calculators/math/permutation-and-combination-calculator",
          },
          {
            id: "prime_factorization_calculator",
            name: "Prime Factorization Calculator",
            path: "/tools/calculators/math/prime-factorization-calculator",
          },
          {
            id: "probability_calculator",
            name: "Probability Calculator",
            path: "/tools/calculators/math/probability-calculator",
          },
          {
            id: "pythagorean_theorem_calculator",
            name: "Pythagorean Theorem Calculator",
            path: "/tools/calculators/math/pythagorean-theorem-calculator",
          },
          {
            id: "quadratic_formula_calculator",
            name: "Quadratic Formula Calculator",
            path: "/tools/calculators/math/quadratic-formula-calculator",
          },
          {
            id: "random_number_generator",
            name: "Random Number Generator",
            path: "/tools/calculators/math/random-number-generator",
          },
          {
            id: "ratio_calculator",
            name: "Ratio Calculator",
            path: "/tools/calculators/math/ratio-calculator",
          },
          {
            id: "right_triangle_calculator",
            name: "Right Triangle Calculator",
            path: "/tools/calculators/math/right-triangle-calculator",
          },
          {
            id: "root_calculator",
            name: "Root Calculator",
            path: "/tools/calculators/math/root-calculator",
          },
          {
            id: "rounding_calculator",
            name: "Rounding Calculator",
            path: "/tools/calculators/math/rounding-calculator",
          },
          {
            id: "sample_size_calculator",
            name: "Sample Size Calculator",
            path: "/tools/calculators/math/sample-size-calculator",
          },
          {
            id: "scientific_calculator",
            name: "Scientific Calculator",
            path: "/tools/calculators/math/scientific-calculator",
          },
          {
            id: "scientific_notation_calculator",
            name: "Scientific Notation Calculator",
            path: "/tools/calculators/math/scientific-notation-calculator",
          },
          {
            id: "slope_calculator",
            name: "Slope Calculator",
            path: "/tools/calculators/math/slope-calculator",
          },
          {
            id: "standard_deviation_calculator",
            name: "Standard Deviation Calculator",
            path: "/tools/calculators/math/standard-deviation-calculator",
          },
          {
            id: "statistics_calculator",
            name: "Statistics Calculator",
            path: "/tools/calculators/math/statistics-calculator",
          },
          {
            id: "surface_area_calculator",
            name: "Surface Area Calculator",
            path: "/tools/calculators/math/surface-area-calculator",
          },
          {
            id: "triangle_calculator",
            name: "Triangle Calculator",
            path: "/tools/calculators/math/triangle-calculator",
          },
          {
            id: "volume_calculator",
            name: "Volume Calculator",
            path: "/tools/calculators/math/volume-calculator",
          },
          {
            id: "z_score_calculator",
            name: "Z-score Calculator",
            path: "/tools/calculators/math/z-score-calculator",
          },
        ],
      },
      {
        id: "health-calculators",
        name: "Health Calculators",
        tools: [
          {
            id: "anorexic_bmi_calculator",
            name: "Anorexic BMI Calculator",
            path: "/tools/calculators/health/anorexic-bmi-calculator",
          },
          {
            id: "army_body_fat_calculator",
            name: "Army Body Fat Calculator",
            path: "/tools/calculators/health/army-body-fat-calculator",
          },
          {
            id: "bmi_calculator",
            name: "BMI Calculator",
            path: "/tools/calculators/health/bmi-calculator",
          },
          {
            id: "bmr_calculator",
            name: "BMR Calculator",
            path: "/tools/calculators/health/bmr-calculator",
          },
          {
            id: "body_surface_area_calculator",
            name: "Body Surface Area Calculator",
            path: "/tools/calculators/health/body-surface-area-calculator",
          },
          {
            id: "calories_burned_calculator",
            name: "Calories Burned Calculator",
            path: "/tools/calculators/health/calories-burned-calculator",
          },
          {
            id: "carbohydrate_calculator",
            name: "Carbohydrate Calculator",
            path: "/tools/calculators/health/carbohydrate-calculator",
          },
          {
            id: "fat_intake_calculator",
            name: "Fat Intake Calculator",
            path: "/tools/calculators/health/fat-intake-calculator",
          },
          {
            id: "healthy_weight_calculator",
            name: "Healthy Weight Calculator",
            path: "/tools/calculators/health/healthy-weight-calculator",
          },
          {
            id: "ideal_weight_calculator",
            name: "Ideal Weight Calculator",
            path: "/tools/calculators/health/ideal-weight-calculator",
          },
          {
            id: "lean_body_mass_calculator",
            name: "Lean Body Mass Calculator",
            path: "/tools/calculators/health/lean-body-mass-calculator",
          },
          {
            id: "one_rep_max_calculator",
            name: "One Rep Max Calculator",
            path: "/tools/calculators/health/one-rep-max-calculator",
          },
          {
            id: "overweight_calculator",
            name: "Overweight Calculator",
            path: "/tools/calculators/health/overweight-calculator",
          },
          {
            id: "protein_calculator",
            name: "Protein Calculator",
            path: "/tools/calculators/health/protein-calculator",
          },
          {
            id: "tdee_calculator",
            name: "TDEE Calculator",
            path: "/tools/calculators/health/tdee-calculator",
          },
        ],
      },
      {
        id: "biology-calculators",
        name: "Biology Calculators",
        tools: [
          {
            id: "annealing-temperature-calculator",
            name: "Annealing Temperature Calculator",
            path: "/tools/calculators/biology/annealing-temperature-calculator",
          },
        ],
      },
      {
        id: "financial-calculators",
        name: "Financial Calculators",
        tools: [
          {
            id: "401k_calculator_for_use_by_us_residents",
            name: "401(k) Calculator",
            path: "/tools/calculators/financial/401k-calculator-for-use-by-us-residents",
          },
          {
            id: "advance_debt_consolidation_calculator",
            name: "Debt Consolidation Calculator",
            path: "/tools/calculators/financial/advance-debt-consolidation-calculator",
          },
          {
            id: "amortization_calculator",
            name: "Amortization Calculator",
            path: "/tools/calculators/financial/amortization-calculator",
          },
          {
            id: "annuity_calculator",
            name: "Annuity Calculator",
            path: "/tools/calculators/financial/annuity-calculator",
          },
          {
            id: "annuity_payout_calculator",
            name: "Annuity Payout Calculator",
            path: "/tools/calculators/financial/annuity-payout-calculator",
          },
          {
            id: "apr_calculator",
            name: "APR Calculator",
            path: "/tools/calculators/financial/apr-calculator",
          },
          {
            id: "auto_lease_calculator",
            name: "Auto Lease Calculator",
            path: "/tools/calculators/financial/auto-lease-calculator",
          },
          {
            id: "auto_loan_calculator",
            name: "Auto Loan Calculator",
            path: "/tools/calculators/financial/auto-loan-calculator",
          },
          {
            id: "average_return_calculator",
            name: "Average Return Calculator",
            path: "/tools/calculators/financial/average-return-calculator",
          },
          {
            id: "bond_calculator",
            name: "Bond Calculator",
            path: "/tools/calculators/financial/bond-calculator",
          },
          {
            id: "budget_calculator",
            name: "Budget Calculator",
            path: "/tools/calculators/financial/budget-calculator",
          },
          {
            id: "business_loan_calculator",
            name: "Business Loan Calculator",
            path: "/tools/calculators/financial/business-loan-calculator",
          },
          {
            id: "canadian_mortgage_calculator",
            name: "Canadian Mortgage Calculator",
            path: "/tools/calculators/financial/canadian-mortgage-calculator",
          },
          {
            id: "cash_back_low_interest_calculator",
            name: "Cash Back & Low Interest Calculator",
            path: "/tools/calculators/financial/cash-back-and-low-interest-calculator",
          },
          {
            id: "cd_calculator",
            name: "CD Calculator",
            path: "/tools/calculators/financial/cd-calculator",
          },
          {
            id: "college_cost_calculator",
            name: "College Cost Calculator",
            path: "/tools/calculators/financial/college-cost-calculator",
          },
          {
            id: "commission_calculator",
            name: "Commission Calculator",
            path: "/tools/calculators/financial/commission-calculator",
          },
          {
            id: "compound_interest_calculator",
            name: "Compound Interest Calculator",
            path: "/tools/calculators/financial/compound-interest-calculator",
          },
          {
            id: "credit_card_calculator",
            name: "Credit Card Calculator",
            path: "/tools/calculators/financial/credit-card-calculator",
          },
          {
            id: "credit_card_payoff_calculator",
            name: "Credit Card Payoff Calculator",
            path: "/tools/calculators/financial/credit-card-payoff-calculator",
          },
          {
            id: "debt_payoff_calculator",
            name: "Debt Payoff Calculator",
            path: "/tools/calculators/financial/debt-payoff-calculator",
          },
          {
            id: "debt_consolidation_calculator",
            name: "Debt Consolidation Calculator",
            path: "/tools/calculators/financial/debt-consolidation-calculator",
          },
          {
            id: "depreciation_calculator",
            name: "Depreciation Calculator",
            path: "/tools/calculators/financial/Depreciation-Calculator",
          },
          {
            id: "discount_calculator",
            name: "Discount Calculator",
            path: "/tools/calculators/financial/Discount-Calculator",
          },
          {
            id: "down_payment_calculator",
            name: "Down Payment Calculator",
            path: "/tools/calculators/financial/Down-Payment-Calculator",
          },
          {
            id: "dti_ratio_calculator",
            name: "DTI Ratio Calculator",
            path: "/tools/calculators/financial/DTI-Ratio-Calculator",
          },
          {
            id: "estate_tax_calculator",
            name: "Estate Tax Calculator",
            path: "/tools/calculators/financial/estate-tax-calculator",
          },
          {
            id: "fha_loan_calculator",
            name: "FHA Loan Calculator",
            path: "/tools/calculators/financial/FHA-Loan-Calculator",
          },
          {
            id: "finance_calculator",
            name: "Finance Calculator",
            path: "/tools/calculators/financial/finance-calculator",
          },
          {
            id: "future_value_calculator",
            name: "Future Value Calculator",
            path: "/tools/calculators/financial/Future-Value-Calculator",
          },
          {
            id: "house_affordability_calculator",
            name: "House Affordability Calculator",
            path: "/tools/calculators/financial/house-affordability-calculator",
          },
          {
            id: "income_tax_calculator",
            name: "Income Tax Calculator",
            path: "/tools/calculators/financial/income-tax-calculator",
          },
          {
            id: "inflation_calculator",
            name: "Inflation Calculator",
            path: "/tools/calculators/financial/inflation-calculator",
          },
          {
            id: "interest_calculator",
            name: "Interest Calculator",
            path: "/tools/calculators/financial/interest-calculator",
          },
          {
            id: "interest_rate_calculator",
            name: "Interest Rate Calculator",
            path: "/tools/calculators/financial/interest-rate-calculator",
          },
          {
            id: "investment_calculator",
            name: "Investment Calculator",
            path: "/tools/calculators/financial/investment-calculator",
          },
          {
            id: "ira_calculator",
            name: "IRA Calculator",
            path: "/tools/calculators/financial/IRA-Calculator",
          },
          {
            id: "irr_calculator",
            name: "IRR Calculator",
            path: "/tools/calculators/financial/IRR-Calculator",
          },
          {
            id: "lease_calculator",
            name: "Lease Calculator",
            path: "/tools/calculators/financial/lease-Calculator",
          },
          {
            id: "loan_calculator",
            name: "Loan Calculator",
            path: "/tools/calculators/financial/loan-calculator",
          },
          {
            id: "margin_calculator",
            name: "Margin Calculator",
            path: "/tools/calculators/financial/margin-calculator",
          },
          {
            id: "mortgage_amortization_calculator",
            name: "Mortgage Amortization Calculator",
            path: "/tools/calculators/financial/mortgage-amortization-calculator",
          },
          {
            id: "mortgage_payoff_calculator",
            name: "Mortgage Payoff Calculator",
            path: "/tools/calculators/financial/mortgage-payoff-calculator",
          },
          {
            id: "mortgage_calculator",
            name: "Mortgage Calculator",
            path: "/tools/calculators/financial/mortgage-calculator",
          },
          {
            id: "payback_period_calculator",
            name: "Payback Period Calculator",
            path: "/tools/calculators/financial/payback-period-calculator",
          },
          {
            id: "payment_calculator",
            name: "Payment Calculator",
            path: "/tools/calculators/financial/payment-calculator",
          },
          {
            id: "pension_calculator",
            name: "Pension Calculator",
            path: "/tools/calculators/financial/pension-calculator",
          },
          {
            id: "percent_off_calculator",
            name: "Percent Off Calculator",
            path: "/tools/calculators/financial/percent-off-calculator",
          },
          {
            id: "personal_loan_calculator",
            name: "Personal Loan Calculator",
            path: "/tools/calculators/financial/personal-loan-calculator",
          },
          {
            id: "present_value_calculator",
            name: "Present Value Calculator",
            path: "/tools/calculators/financial/present-value-calculator",
          },
          {
            id: "refinance_calculator",
            name: "Refinance Calculator",
            path: "/tools/calculators/financial/refinance-calculator",
          },
          {
            id: "rent_vs_buy_calculator",
            name: "Rent vs Buy Calculator",
            path: "/tools/calculators/financial/rent-vs-buy-calculator",
          },
          {
            id: "rent_calculator",
            name: "Rent Calculator",
            path: "/tools/calculators/financial/rent-calculator",
          },
          {
            id: "rental_property_calculator",
            name: "Rental Property Calculator",
            path: "/tools/calculators/financial/rental-property-calculator",
          },
          {
            id: "repayment_calculator",
            name: "Repayment Calculator",
            path: "/tools/calculators/financial/repayment-calculator",
          },
          {
            id: "retirement_calculator",
            name: "Retirement Calculator",
            path: "/tools/calculators/financial/retirement-calculator",
          },
          {
            id: "rmd_calculator",
            name: "RMD Calculator",
            path: "/tools/calculators/financial/rmd-calculator",
          },
          {
            id: "roi_calculator",
            name: "ROI Calculator",
            path: "/tools/calculators/financial/roi-calculator",
          },
          {
            id: "roth_ira_calculator",
            name: "Roth IRA Calculator",
            path: "/tools/calculators/financial/roth-ira-calculator",
          },
          {
            id: "salary_calculator",
            name: "Salary Calculator",
            path: "/tools/calculators/financial/salary-calculator",
          },
          {
            id: "savings_calculator",
            name: "Savings Calculator",
            path: "/tools/calculators/financial/savings-calculator",
          },
          {
            id: "simple_interest_calculator",
            name: "Simple Interest Calculator",
            path: "/tools/calculators/financial/simple-interest-calculator",
          },
          {
            id: "simplified_sales_tax_calculator",
            name: "Simplified Sales Tax Calculator",
            path: "/tools/calculators/financial/simplified-sales-tax-calculator",
          },
          {
            id: "social_security_calculator",
            name: "Social Security Calculator",
            path: "/tools/calculators/financial/social-security-calculator",
          },
          {
            id: "student_loan_calculator",
            name: "Student Loan Calculator",
            path: "/tools/calculators/financial/student-loan-calculator",
          },
          {
            id: "take_home_paycheck_calculator",
            name: "Take-Home Paycheck Calculator",
            path: "/tools/calculators/financial/take-home-paycheck-calculator",
          },
          {
            id: "uk_mortgage_calculator",
            name: "UK Mortgage Calculator",
            path: "/tools/calculators/financial/uk-mortgage-calculator",
          },
          {
            id: "va_mortgage_calculator",
            name: "VA Mortgage Calculator",
            path: "/tools/calculators/financial/va-mortgage-calculator",
          },
          {
            id: "vat_calculator",
            name: "VAT Calculator",
            path: "/tools/calculators/financial/vat-calculator",
          },
        ],
      },
    ],
  },
  {
    id: "other-tools",
    name: "Other Tools",
    subcategories: [
      {
        id: "angle-converter",
        name: "Angle Converter",
        tools: [
          {
            id: "angle_converter",
            name: "Angle Converter",
            path: "/tools/other-tools/angle-converter",
          },
          {
            id: "degrees_to_radians",
            name: "Degrees to Radians",
            path: "/tools/other-tools/degrees-to-radians",
          },
          {
            id: "radians_to_degrees",
            name: "Radians to Degrees",
            path: "/tools/other-tools/radians-to-degrees",
          },
        ],
      },
      {
        id: "area-converter",
        name: "Area Converter",
        tools: [
          {
            id: "area_converter",
            name: "Area Converter",
            path: "/tools/other-tools/area-converter",
          },
          {
            id: "acres_to_hectare",
            name: "Acres to Hectare",
            path: "/tools/other-tools/acres-to-hectare",
          },
          {
            id: "acres_to_square_feet",
            name: "Acres to Square Feet",
            path: "/tools/other-tools/acres-to-square-feet",
          },
          {
            id: "acres_to_square_miles",
            name: "Acres to Square Miles",
            path: "/tools/other-tools/acres-to-square-miles",
          },
          {
            id: "hectare_to_acres",
            name: "Hectare to Acres",
            path: "/tools/other-tools/hectare-to-acres",
          },
          {
            id: "square_feet_to_acres",
            name: "Square Feet to Acres",
            path: "/tools/other-tools/square-feet-to-acres",
          },
          {
            id: "square_feet_to_square_meter",
            name: "Square Feet to Square Meter",
            path: "/tools/other-tools/square-feet-to-square-meter",
          },
          {
            id: "square_feet_to_square_yards",
            name: "Square Feet to Square Yards",
            path: "/tools/other-tools/square-feet-to-square-yards",
          },
          {
            id: "square_meter_to_square_feet",
            name: "Square Meter to Square Feet",
            path: "/tools/other-tools/square-meter-to-square-feet",
          },
          {
            id: "square_miles_to_acres",
            name: "Square Miles to Acres",
            path: "/tools/other-tools/square-miles-to-acres",
          },
          {
            id: "square_yards_to_square_feet",
            name: "Square Yards to Square Feet",
            path: "/tools/other-tools/square-yards-to-square-feet",
          },
        ],
      },
      {
        id: "case-converter",
        name: "Case Converter Tool",
        tools: [
          {
            id: "case_converter",
            name: "Case Converter",
            path: "/tools/other-tools/case-converter",
          },
        ],
      },
      {
        id: "charge-converter",
        name: "Charge Converter",
        tools: [
          {
            id: "charge_converter",
            name: "Charge Converter",
            path: "/tools/other-tools/charge-converter",
          },
        ],
      },
      {
        id: "concentration-molar-converter",
        name: "Concentration – Molar Converter",
        tools: [
          {
            id: "concentration_molar_converter",
            name: "Concentration Molar Converter",
            path: "/tools/other-tools/concentration-molar-converter",
          },
        ],
      },
      {
        id: "concentration-solution-converter",
        name: "Concentration – Solution Converter",
        tools: [
          {
            id: "concentration_solution_converter",
            name: "Concentration Solution Converter",
            path: "/tools/other-tools/concentration-solution-converter",
          },
        ],
      },
      {
        id: "current-converter",
        name: "Current Converter",
        tools: [
          {
            id: "amps_to_milliamps_converter",
            name: "Amps to Milliamps Converter",
            path: "/tools/other-tools/amps-to-milliamps-converter",
          },
          {
            id: "current_converter",
            name: "Current Converter",
            path: "/tools/other-tools/current-converter",
          },
          {
            id: "milliamps_to_amps_converter",
            name: "Milliamps to Amps Converter",
            path: "/tools/other-tools/milliamps-to-amps-converter",
          },
        ],
      },
      {
        id: "data-storage-converter",
        name: "Data Storage Converter",
        tools: [
          {
            id: "data_storage_converter",
            name: "Data Storage Converter",
            path: "/tools/other-tools/data-storage-converter",
          },
          {
            id: "gb_to_kb",
            name: "GB to KB",
            path: "/tools/other-tools/gb-to-kb",
          },
          {
            id: "gb_to_mb",
            name: "GB to MB",
            path: "/tools/other-tools/gb-to-mb",
          },
          {
            id: "gb_to_pb",
            name: "GB to PB",
            path: "/tools/other-tools/gb-to-pb",
          },
          {
            id: "gb_to_tb",
            name: "GB to TB",
            path: "/tools/other-tools/gb-to-tb",
          },
          {
            id: "kb_to_gb",
            name: "KB to GB",
            path: "/tools/other-tools/kb-to-gb",
          },
          {
            id: "kb_to_mb",
            name: "KB to MB",
            path: "/tools/other-tools/kb-to-mb",
          },
          {
            id: "kb_to_tb",
            name: "KB to TB",
            path: "/tools/other-tools/kb-to-tb",
          },
          {
            id: "mb_to_gb",
            name: "MB to GB",
            path: "/tools/other-tools/mb-to-gb",
          },
          {
            id: "mb_to_kb",
            name: "MB to KB",
            path: "/tools/other-tools/mb-to-kb",
          },
          {
            id: "mb_to_pb",
            name: "MB to PB",
            path: "/tools/other-tools/mb-to-pb",
          },
          {
            id: "mb_to_tb",
            name: "MB to TB",
            path: "/tools/other-tools/mb-to-tb",
          },
          {
            id: "pb_to_gb",
            name: "PB to GB",
            path: "/tools/other-tools/pb-to-gb",
          },
          {
            id: "pb_to_mb",
            name: "PB to MB",
            path: "/tools/other-tools/pb-to-mb",
          },
          {
            id: "pb_to_tb",
            name: "PB to TB",
            path: "/tools/other-tools/pb-to-tb",
          },
          {
            id: "tb_to_gb",
            name: "TB to GB",
            path: "/tools/other-tools/tb-to-gb",
          },
          {
            id: "tb_to_kb",
            name: "TB to KB",
            path: "/tools/other-tools/tb-to-kb",
          },
          {
            id: "tb_to_mb",
            name: "TB to MB",
            path: "/tools/other-tools/tb-to-mb",
          },
          {
            id: "tb_to_pb",
            name: "TB to PB",
            path: "/tools/other-tools/tb-to-pb",
          },
        ],
      },
      {
        id: "data-transfer-converter",
        name: "Data Transfer Converter",
        tools: [
          {
            id: "data-transfer-converter",
            name: "Data Transfer Converter",
            path: "/tools/other-tools/data-transfer-converter",
          },
        ],
      },
      {
        id: "digital-image-resolution-converter",
        name: "Digital Image Resolution Converter",
        tools: [
          {
            id: "digital-image-resolution-converter",
            name: "Digital Image Resolution Converter",
            path: "/tools/other-tools/digital-image-resolution-converter",
          },
        ],
      },
      {
        id: "electric-tools",
        name: "Electric Converters",
        tools: [
          {
            id: "electric-conductance-converter",
            name: "Electric Conductance Converter",
            path: "/tools/other-tools/electric-conductance-converter",
          },
          {
            id: "electric-conductivity-converter",
            name: "Electric Conductivity Converter",
            path: "/tools/other-tools/electric-conductivity-converter",
          },
          {
            id: "electric-field-strength-converter",
            name: "Electric Field Strength Converter",
            path: "/tools/other-tools/electric-field-strength-converter",
          },
          {
            id: "electric-potential-converter",
            name: "Electric Potential Converter",
            path: "/tools/other-tools/electric-potential-converter",
          },
          {
            id: "electric-resistance-converter",
            name: "Electric Resistance Converter",
            path: "/tools/other-tools/electric-resistance-converter",
          },
          {
            id: "electric-resistivity-converter",
            name: "Electric Resistivity Converter",
            path: "/tools/other-tools/electric-resistivity-converter",
          },
          {
            id: "electrostatic-capacitance-converter",
            name: "Electrostatic Capacitance Converter",
            path: "/tools/other-tools/electrostatic-capacitance-converter",
          },
        ],
      },
      {
        id: "energy-tools",
        name: "Energy Converters",
        tools: [
          {
            id: "energy-converter",
            name: "Energy Converter",
            path: "/tools/other-tools/energy-converter",
          },
          {
            id: "cal-to-j",
            name: "Cal to J",
            path: "/tools/other-tools/cal-to-j",
          },
          {
            id: "cal-to-kcal",
            name: "Cal to Kcal",
            path: "/tools/other-tools/cal-to-kcal",
          },
          {
            id: "ftlb-to-nm",
            name: "Foot-pounds to Newton-meters",
            path: "/tools/other-tools/ftlb-to-nm",
          },
          {
            id: "j-to-cal",
            name: "Joules to Calories",
            path: "/tools/other-tools/j-to-cal",
          },
          {
            id: "j-to-kj",
            name: "Joules to Kilojoules",
            path: "/tools/other-tools/j-to-kj",
          },
          {
            id: "kcal-to-cal",
            name: "Kilocalories to Calories",
            path: "/tools/other-tools/kcal-to-cal",
          },
          {
            id: "kcal-to-kj",
            name: "Kilocalories to Kilojoules",
            path: "/tools/other-tools/kcal-to-kj",
          },
          {
            id: "kj-to-j",
            name: "Kilojoules to Joules",
            path: "/tools/other-tools/kj-to-j",
          },
          {
            id: "kj-to-kcal",
            name: "Kilojoules to Kilocalories",
            path: "/tools/other-tools/kj-to-kcal",
          },
          {
            id: "nm-to-ftlb",
            name: "Newton-meters to Foot-pounds",
            path: "/tools/other-tools/nm-to-ftlb",
          },
        ],
      },
      {
        id: "flow-mass",
        name: "Flow - Mass Converter",
        tools: [
          {
            id: "flow_mass_converter",
            name: "Mass Flow Converter",
            path: "/tools/other-tools/flow-mass-converter",
          },
          {
            id: "flow_converter",
            name: "Flow Converter",
            path: "/tools/other-tools/flow-converter",
          },
        ],
      },
      {
        id: "force-converter",
        name: "Force Converter Tool",
        tools: [
          {
            id: "force_converter",
            name: "Force Converter",
            path: "/tools/other-tools/force-converter",
          },
          {
            id: "kg_to_newtons",
            name: "Kilograms to Newtons",
            path: "/tools/other-tools/kg-to-newtons",
          },
          {
            id: "lbs_to_newtons",
            name: "Pounds to Newtons",
            path: "/tools/other-tools/lbs-to-newtons",
          },
          {
            id: "newtons_to_kg",
            name: "Newtons to Kilograms",
            path: "/tools/other-tools/newtons-to-kg",
          },
          {
            id: "newtons_to_lbs",
            name: "Newtons to Pounds",
            path: "/tools/other-tools/newtons-to-lbs",
          },
        ],
      },
      {
        id: "frequency-wavelength",
        name: "Frequency Wavelength Converter",
        tools: [
          {
            id: "frequency_wavelength_converter",
            name: "Frequency-Wavelength Converter",
            path: "/tools/other-tools/frequency-wavelength-converter",
          },
        ],
      },
      {
        id: "heat",
        name: "Heat Converter",
        tools: [
          {
            id: "heat_density_converter",
            name: "Heat Density Converter",
            path: "/tools/other-tools/heat-density-converter",
          },
          {
            id: "heat_flux_density_converter",
            name: "Heat Flux Density Converter",
            path: "/tools/other-tools/heat-flux-density-converter",
          },
          {
            id: "heat_transfer_coefficient_converter",
            name: "Heat Transfer Coefficient Converter",
            path: "/tools/other-tools/heat-transfer-coefficient-converter",
          },
        ],
      },
      {
        id: "illumination",
        name: "Illumination Converter",
        tools: [
          {
            id: "illumination_converter",
            name: "Illumination Converter",
            path: "/tools/other-tools/illumination_converter",
          },
        ],
      },
      {
        id: "inductance",
        name: "Inductance Converter",
        tools: [
          {
            id: "inductance_converter",
            name: "Inductance Converter",
            path: "/tools/other-tools/inductance-converter",
          },
        ],
      },
      {
        id: "length-converter",
        name: "Length Converter",
        tools: [
          { id: "cm-to-feet", name: "CM to Feet", path: "/tools/other-tools/cm-to-feet" },
          { id: "cm-to-inches", name: "CM to Inches", path: "/tools/other-tools/cm-to-inches" },
          { id: "cm-to-km", name: "CM to KM", path: "/tools/other-tools/cm-to-km" },
          { id: "cm-to-m", name: "CM to Meters", path: "/tools/other-tools/cm-to-m" },
          { id: "cm-to-mm", name: "CM to MM", path: "/tools/other-tools/cm-to-mm" },
          { id: "feet-to-cm", name: "Feet to CM", path: "/tools/other-tools/feet-to-cm" },
          { id: "feet-to-inches", name: "Feet to Inches", path: "/tools/other-tools/feet-to-inches" },
          { id: "feet-to-meters", name: "Feet to Meters", path: "/tools/other-tools/feet-to-meters" },
          { id: "feet-to-miles", name: "Feet to Miles", path: "/tools/other-tools/feet-to-miles" },
          { id: "feet-to-mm", name: "Feet to MM", path: "/tools/other-tools/feet-to-mm" },
          { id: "feet-to-yards", name: "Feet to Yards", path: "/tools/other-tools/feet-to-yards" },
          { id: "inches-to-cm", name: "Inches to CM", path: "/tools/other-tools/inches-to-cm" },
          { id: "inches-to-feet", name: "Inches to Feet", path: "/tools/other-tools/inches-to-feet" },
          { id: "inches-to-meters", name: "Inches to Meters", path: "/tools/other-tools/inches-to-meters" },
          { id: "inches-to-mm", name: "Inches to MM", path: "/tools/other-tools/inches-to-mm" },
          { id: "inches-to-yards", name: "Inches to Yards", path: "/tools/other-tools/inches-to-yards" },
          { id: "km-to-cm", name: "KM to CM", path: "/tools/other-tools/km-to-cm" },
          { id: "km-to-m", name: "KM to Meters", path: "/tools/other-tools/km-to-m" },
          { id: "km-to-miles", name: "KM to Miles", path: "/tools/other-tools/km-to-miles" },
          { id: "m-to-cm", name: "Meters to CM", path: "/tools/other-tools/m-to-cm" },
          { id: "m-to-km", name: "Meters to KM", path: "/tools/other-tools/m-to-km" },
          { id: "m-to-mm", name: "Meters to MM", path: "/tools/other-tools/m-to-mm" },
          { id: "meters-to-feet", name: "Meters to Feet", path: "/tools/other-tools/meters-to-feet" },
          { id: "meters-to-inches", name: "Meters to Inches", path: "/tools/other-tools/meters-to-inches" },
          { id: "meters-to-miles", name: "Meters to Miles", path: "/tools/other-tools/meters-to-miles" },
          { id: "meters-to-yards", name: "Meters to Yards", path: "/tools/other-tools/meters-to-yards" },
          { id: "miles-to-feet", name: "Miles to Feet", path: "/tools/other-tools/miles-to-feet" },
          { id: "miles-to-km", name: "Miles to KM", path: "/tools/other-tools/miles-to-km" },
          { id: "miles-to-meters", name: "Miles to Meters", path: "/tools/other-tools/miles-to-meters" },
          { id: "miles-to-yards", name: "Miles to Yards", path: "/tools/other-tools/miles-to-yards" },
          { id: "mm-to-cm", name: "MM to CM", path: "/tools/other-tools/mm-to-cm" },
          { id: "mm-to-feet", name: "MM to Feet", path: "/tools/other-tools/mm-to-feet" },
          { id: "mm-to-inches", name: "MM to Inches", path: "/tools/other-tools/mm-to-inches" },
          { id: "mm-to-m", name: "MM to Meters", path: "/tools/other-tools/mm-to-m" },
          { id: "yards-to-feet", name: "Yards to Feet", path: "/tools/other-tools/yards-to-feet" },
          { id: "yards-to-inches", name: "Yards to Inches", path: "/tools/other-tools/yards-to-inches" },
          { id: "yards-to-meters", name: "Yards to Meters", path: "/tools/other-tools/yards-to-meters" },
          { id: "yards-to-miles", name: "Yards to Miles", path: "/tools/other-tools/yards-to-miles" },
        ],
      },
      {
        id: "linear-charge-density-converter",
        name: "Linear Charge Density Converter",
        tools: [
          {
            id: "linear_charge_density_converter",
            name: "Linear Charge Density Converter",
            path: "/tools/other-tools/linear-charge-density-converter",
          },
        ],
      },
      {
        id: "linear-current-density-converter",
        name: "Linear Current Density Converter",
        tools: [
          {
            id: "linear_current_density_converter",
            name: "Linear Current Density Converter",
            path: "/tools/other-tools/linear-current-density-converter",
          },
        ],
      },
      {
        id: "luminance-converter",
        name: "Luminance Converter",
        tools: [
          {
            id: "luminance_converter",
            name: "Luminance Converter",
            path: "/tools/other-tools/luminance-converter",
          },
        ],
      },
      {
        id: "luminous-intensity-converter",
        name: "Luminous Intensity Converter",
        tools: [
          {
            id: "luminous_intensity_converter",
            name: "Luminous Intensity Converter",
            path: "/tools/other-tools/luminous-intensity-converter",
          },
        ],
      },
      {
        id: "magnetic-field",
        name: "Magnetic Field Converter",
        tools: [
          {
            id: "magnetic_field_strength_converter",
            name: "Magnetic Field Strength Converter",
            path: "/tools/other-tools/magnetic-field-strength-converter",
          },
          {
            id: "magnetic_flux_converter",
            name: "Magnetic Flux Converter",
            path: "/tools/other-tools/magnetic-flux-converter",
          },
          {
            id: "magnetic_flux_density_converter",
            name: "Magnetic Flux Density Converter",
            path: "/tools/other-tools/magnetic-flux-density-converter",
          },
          {
            id: "magnetomotive_force_converter",
            name: "Magnetomotive Force Converter",
            path: "/tools/other-tools/magnetomotive-force-converter",
          },
          {
            id: "mass_flux_density_converter",
            name: "Mass Flux Density Converter",
            path: "/tools/other-tools/mass-flux-density-converter",
          },
        ],
      },
      {
        id: "number-converter",
        name: "Number Converter Tool",
        tools: [
          {
            id: "binary-to-decimal",
            name: "Binary to Decimal",
            path: "/tools/other-tools/binary-to-decimal",
          },
          { id: "binary-to-hex", name: "Binary to Hex", path: "/tools/other-tools/binary-to-hex" },
          {
            id: "decimal-to-binary",
            name: "Decimal to Binary",
            path: "/tools/other-tools/decimal-to-binary",
          },
          { id: "decimal-to-hex", name: "Decimal to Hex", path: "/tools/other-tools/decimal-to-hex" },
          { id: "hex-to-binary", name: "Hex to Binary", path: "/tools/other-tools/hex-to-binary" },
          { id: "hex-to-decimal", name: "Hex to Decimal", path: "/tools/other-tools/hex-to-decimal" },
          {
            id: "numbers-converter",
            name: "Number System Converter",
            path: "/tools/other-tools/numbers-converter",
          },
        ],
      },
      {
        id: "permeability-converter",
        name: "Permeability Converter",
        tools: [
          {
            id: "permeability-converter",
            name: "Permeability Converter",
            path: "/tools/other-tools/permeability-converter",
          },
        ],
      },
      {
        id: "power-converter",
        name: "Power Converter Tool",
        tools: [
          { id: "btu-to-ton", name: "BTU to Ton", path: "/tools/other-tools/btu-to-ton" },
          { id: "hp-to-kw", name: "Horsepower to Kilowatts", path: "/tools/other-tools/hp-to-kw" },
          { id: "hp-to-watts", name: "Horsepower to Watts", path: "/tools/other-tools/hp-to-watts" },
          { id: "kw-to-hp", name: "Kilowatts to Horsepower", path: "/tools/other-tools/kw-to-hp" },
          { id: "power-converter", name: "Power Converter", path: "/tools/other-tools/power-converter" },
          { id: "ton-to-btu", name: "Ton to BTU", path: "/tools/other-tools/ton-to-btu" },
          { id: "watts-to-hp", name: "Watts to Horsepower", path: "/tools/other-tools/watts-to-hp" },
        ],
      },
      {
        id: "prefixes-converter",
        name: "Prefixes Converter",
        tools: [
          {
            id: "prefixes-converter",
            name: "Prefixes Converter",
            path: "/tools/other-tools/prefixes-converter",
          },
        ],
      },
      {
        id: "pressure-converter",
        name: "Pressure Converter",
        tools: [
          { id: "bar-to-psi", name: "Bar to PSI", path: "/tools/other-tools/bar-to-psi" },
          { id: "kpa-to-psi", name: "KPA to PSI", path: "/tools/other-tools/kpa-to-psi" },
          {
            id: "pressure-converter",
            name: "Pressure Converter",
            path: "/tools/other-tools/pressure-converter",
          },
          { id: "psi-to-bar", name: "PSI to Bar", path: "/tools/other-tools/psi-to-bar" },
          { id: "psi-to-kpa", name: "PSI to KPA", path: "/tools/other-tools/psi-to-kpa" },
        ],
      },
      {
        id: "radiation-converter",
        name: "Radiation Converter",
        tools: [
          {
            id: "radiation-converter",
            name: "Radiation Converter",
            path: "/tools/other-tools/radiation-converter",
          },
          {
            id: "radiation-absorbed-dose-converter",
            name: "Absorbed Dose Converter",
            path: "/tools/other-tools/radiation-absorbed-dose-converter",
          },
          {
            id: "radiation-activity-converter",
            name: "Radiation Activity Converter",
            path: "/tools/other-tools/radiation-activity-converter",
          },
          {
            id: "radiation-exposure-converter",
            name: "Radiation Exposure Converter",
            path: "/tools/other-tools/radiation-exposure-converter",
          },
        ],
      },
      {
        id: "sound-converter",
        name: "Sound Converter",
        tools: [
          { id: "sound-converter", name: "Sound Converter", path: "/tools/other-tools/sound-converter" },
        ],
      },
      {
        id: "specific-heat-capacity-converter",
        name: "Specific Heat Capacity Converter",
        tools: [
          {
            id: "specific-heat-capacity-converter",
            name: "Specific Heat Capacity Converter",
            path: "/tools/other-tools/specific-heat-capacity-converter",
          },
        ],
      },
      {
        id: "speed-converter",
        name: "Speed Converter",
        tools: [
          { id: "fps-to-mph", name: "FPS to MPH", path: "/tools/other-tools/fps-to-mph" },
          { id: "knot-to-mph", name: "Knot to MPH", path: "/tools/other-tools/knot-to-mph" },
          { id: "kph-to-mph", name: "KPH to MPH", path: "/tools/other-tools/kph-to-mph" },
          { id: "mph-to-fps", name: "MPH to FPS", path: "/tools/other-tools/mph-to-fps" },
          { id: "mph-to-knot", name: "MPH to Knot", path: "/tools/other-tools/mph-to-knot" },
          { id: "mph-to-kph", name: "MPH to KPH", path: "/tools/other-tools/mph-to-kph" },
          { id: "mph-to-mps", name: "MPH to MPS", path: "/tools/other-tools/mph-to-mps" },
          { id: "mps-to-kph", name: "MPS to KPH", path: "/tools/other-tools/mps-to-kph" },
          { id: "mps-to-mph", name: "MPS to MPH", path: "/tools/other-tools/mps-to-mph" },
          { id: "speed-converter", name: "Speed Converter", path: "/tools/other-tools/speed-converter" },
        ],
      },
      {
        id: "surface-converter",
        name: "Surface Converter",
        tools: [
          {
            id: "surface-charge-density-converter",
            name: "Surface Charge Density Converter",
            path: "/tools/other-tools/surface-charge-density-converter",
          },
          {
            id: "surface-current-density-converter",
            name: "Surface Current Density Converter",
            path: "/tools/other-tools/surface-current-density-converter",
          },
          {
            id: "surface-tension-converter",
            name: "Surface Tension Converter",
            path: "/tools/other-tools/surface-tension-converter",
          },
        ],
      },
      {
        id: "temperature-converter",
        name: "Temperature Converter",
        tools: [
          {
            id: "celsius-to-fahrenheit",
            name: "Celsius to Fahrenheit",
            path: "/tools/other-tools/celsius-to-fahrenheit",
          },
          {
            id: "celsius-to-kelvin",
            name: "Celsius to Kelvin",
            path: "/tools/other-tools/celsius-to-kelvin",
          },
          {
            id: "fahrenheit-to-celsius",
            name: "Fahrenheit to Celsius",
            path: "/tools/other-tools/fahrenheit-to-celsius",
          },
          {
            id: "fahrenheit-to-kelvin",
            name: "Fahrenheit to Kelvin",
            path: "/tools/other-tools/fahrenheit-to-kelvin",
          },
          {
            id: "kelvin-to-celsius",
            name: "Kelvin to Celsius",
            path: "/tools/other-tools/kelvin-to-celsius",
          },
          {
            id: "kelvin-to-fahrenheit",
            name: "Kelvin to Fahrenheit",
            path: "/tools/other-tools/kelvin-to-fahrenheit",
          },
          {
            id: "temperature-converter",
            name: "Temperature Converter",
            path: "/tools/other-tools/temperature-converter",
          },
          {
            id: "temperature-interval-converter",
            name: "Temperature Interval Converter",
            path: "/tools/other-tools/temperature-interval-converter",
          },
        ],
      },
      {
        id: "thermal-converter",
        name: "Thermal Converter",
        tools: [
          {
            id: "thermal-conductivity-converter",
            name: "Thermal Conductivity Converter",
            path: "/tools/other-tools/thermal-conductivity-converter",
          },
          {
            id: "thermal-expansion-converter",
            name: "Thermal Expansion Converter",
            path: "/tools/other-tools/thermal-expansion-converter",
          },
          {
            id: "thermal-resistance-converter",
            name: "Thermal Resistance Converter",
            path: "/tools/other-tools/thermal-resistance-converter",
          },
        ],
      },
      {
        id: "time-converter",
        name: "Time Converter",
        tools: [
          { id: "days-to-hours", name: "Days to Hours", path: "/tools/other-tools/days-to-hours" },
          { id: "days-to-minutes", name: "Days to Minutes", path: "/tools/other-tools/days-to-minutes" },
          { id: "days-to-months", name: "Days to Months", path: "/tools/other-tools/days-to-months" },
          { id: "days-to-seconds", name: "Days to Seconds", path: "/tools/other-tools/days-to-seconds" },
          { id: "days-to-years", name: "Days to Years", path: "/tools/other-tools/days-to-years" },
          { id: "hours-to-days", name: "Hours to Days", path: "/tools/other-tools/hours-to-days" },
          { id: "hours-to-minutes", name: "Hours to Minutes", path: "/tools/other-tools/hours-to-minutes" },
          {
            id: "milliseconds-to-seconds",
            name: "Milliseconds to Seconds",
            path: "/tools/other-tools/milliseconds-to-seconds",
          },
          { id: "minutes-to-days", name: "Minutes to Days", path: "/tools/other-tools/minutes-to-days" },
          { id: "minutes-to-hours", name: "Minutes to Hours", path: "/tools/other-tools/minutes-to-hours" },
          {
            id: "minutes-to-seconds",
            name: "Minutes to Seconds",
            path: "/tools/other-tools/minutes-to-seconds",
          },
          { id: "months-to-days", name: "Months to Days", path: "/tools/other-tools/months-to-days" },
          { id: "seconds-to-days", name: "Seconds to Days", path: "/tools/other-tools/seconds-to-days" },
          {
            id: "seconds-to-milliseconds",
            name: "Seconds to Milliseconds",
            path: "/tools/other-tools/seconds-to-milliseconds",
          },
          {
            id: "seconds-to-minutes",
            name: "Seconds to Minutes",
            path: "/tools/other-tools/seconds-to-minutes",
          },
          { id: "time-converter", name: "Time Converter", path: "/tools/other-tools/time-converter" },
          { id: "years-to-days", name: "Years to Days", path: "/tools/other-tools/years-to-days" },
        ],
      },
      {
        id: "typography-converter",
        name: "Typography Converter",
        tools: [
          {
            id: "typography-converter",
            name: "Typography Converter",
            path: "/tools/other-tools/typography-converter",
          },
        ],
      },
      {
        id: "volume-converter",
        name: "Volume Converter",
        tools: [
          {
            id: "volume-dry-converter",
            name: "Volume Dry Converter",
            path: "/tools/other-tools/volume-dry-converter",
          },
          {
            id: "volume-lumber-converter",
            name: "Volume Lumber Converter",
            path: "/tools/other-tools/volume-lumber-converter",
          },
          {
            id: "volume-charge-density-converter",
            name: "Volume Charge Density Converter",
            path: "/tools/other-tools/volume-charge-density-converter",
          },
          { id: "cc-to-ml", name: "CC to ML", path: "/tools/other-tools/cc-to-ml" },
          { id: "cc-to-oz", name: "CC to Ounces", path: "/tools/other-tools/cc-to-oz" },
          {
            id: "cubic-feet-to-cubic-yards",
            name: "Cubic Feet to Cubic Yards",
            path: "/tools/other-tools/cubic-feet-to-cubic-yards",
          },
          {
            id: "cubic-feet-to-gallon",
            name: "Cubic Feet to Gallon",
            path: "/tools/other-tools/cubic-feet-to-gallon",
          },
          {
            id: "cubic-inches-to-gallons",
            name: "Cubic Inches to Gallons",
            path: "/tools/other-tools/cubic-inches-to-gallons",
          },
          {
            id: "cubic-inches-to-liters",
            name: "Cubic Inches to Liters",
            path: "/tools/other-tools/cubic-inches-to-liters",
          },
          {
            id: "cubic-yards-to-cubic-feet",
            name: "Cubic Yards to Cubic Feet",
            path: "/tools/other-tools/cubic-yards-to-cubic-feet",
          },
          { id: "cups-to-gallon", name: "Cups to Gallon", path: "/tools/other-tools/cups-to-gallon" },
          { id: "cups-to-liters", name: "Cups to Liters", path: "/tools/other-tools/cups-to-liters" },
          { id: "cups-to-ml", name: "Cups to Milliliters", path: "/tools/other-tools/cups-to-ml" },
          { id: "cups-to-pint", name: "Cups to Pints", path: "/tools/other-tools/cups-to-pint" },
          { id: "cups-to-quart", name: "Cups to Quarts", path: "/tools/other-tools/cups-to-quart" },
          {
            id: "cups-to-tablespoons",
            name: "Cups to Tablespoons",
            path: "/tools/other-tools/cups-to-tablespoons",
          },
          {
            id: "gallon-to-cubic-feet",
            name: "Gallon to Cubic Feet",
            path: "/tools/other-tools/gallon-to-cubic-feet",
          },
          { id: "gallon-to-cups", name: "Gallon to Cups", path: "/tools/other-tools/gallon-to-cups" },
          { id: "gallon-to-ml", name: "Gallon to Milliliters", path: "/tools/other-tools/gallon-to-ml" },
          { id: "gallon-to-pints", name: "Gallon to Pints", path: "/tools/other-tools/gallon-to-pints" },
          { id: "gallon-to-quart", name: "Gallon to Quarts", path: "/tools/other-tools/gallon-to-quart" },
          {
            id: "gallons-to-cubic-inches",
            name: "Gallons to Cubic Inches",
            path: "/tools/other-tools/gallons-to-cubic-inches",
          },
          {
            id: "gallons-to-liters",
            name: "Gallons to Liters",
            path: "/tools/other-tools/gallons-to-liters",
          },
          { id: "l-to-ml", name: "Liters to Milliliters", path: "/tools/other-tools/l-to-ml" },
          { id: "liter-to-ounces", name: "Liter to Ounces", path: "/tools/other-tools/liter-to-ounces" },
          {
            id: "liters-to-cubic-inches",
            name: "Liters to Cubic Inches",
            path: "/tools/other-tools/liters-to-cubic-inches",
          },
          { id: "liters-to-cups", name: "Liters to Cups", path: "/tools/other-tools/liters-to-cups" },
          {
            id: "liters-to-gallons",
            name: "Liters to Gallons",
            path: "/tools/other-tools/liters-to-gallons",
          },
          { id: "liters-to-pints", name: "Liters to Pints", path: "/tools/other-tools/liters-to-pints" },
          { id: "liters-to-quarts", name: "Liters to Quarts", path: "/tools/other-tools/liters-to-quarts" },
          { id: "ml-to-cc", name: "ML to CC", path: "/tools/other-tools/ml-to-cc" },
          { id: "ml-to-cups", name: "ML to Cups", path: "/tools/other-tools/ml-to-cups" },
          { id: "ml-to-gallon", name: "ML to Gallon", path: "/tools/other-tools/ml-to-gallon" },
          { id: "ml-to-l", name: "ML to Liters", path: "/tools/other-tools/ml-to-l" },
          { id: "ml-to-pint", name: "ML to Pints", path: "/tools/other-tools/ml-to-pint" },
          { id: "ml-to-teaspoon", name: "ML to Teaspoons", path: "/tools/other-tools/ml-to-teaspoon" },
          { id: "ounces-to-liter", name: "Ounces to Liter", path: "/tools/other-tools/ounces-to-liter" },
          { id: "oz-to-cc", name: "Ounces to CC", path: "/tools/other-tools/oz-to-cc" },
          { id: "pint-to-cups", name: "Pint to Cups", path: "/tools/other-tools/pint-to-cups" },
          { id: "pint-to-ml", name: "Pint to ML", path: "/tools/other-tools/pint-to-ml" },
          { id: "pints-to-gallon", name: "Pints to Gallon", path: "/tools/other-tools/pints-to-gallon" },
          { id: "pints-to-liters", name: "Pints to Liters", path: "/tools/other-tools/pints-to-liters" },
          { id: "quart-to-cups", name: "Quart to Cups", path: "/tools/other-tools/quart-to-cups" },
          { id: "quart-to-gallon", name: "Quart to Gallon", path: "/tools/other-tools/quart-to-gallon" },
          { id: "quarts-to-liters", name: "Quarts to Liters", path: "/tools/other-tools/quarts-to-liters" },
          {
            id: "tablespoons-to-cups",
            name: "Tablespoons to Cups",
            path: "/tools/other-tools/tablespoons-to-cups",
          },
          {
            id: "tablespoons-to-teaspoons",
            name: "Tablespoons to Teaspoons",
            path: "/tools/other-tools/tablespoons-to-teaspoons",
          },
          { id: "teaspoon-to-ml", name: "Teaspoon to ML", path: "/tools/other-tools/teaspoon-to-ml" },
          {
            id: "teaspoons-to-tablespoons",
            name: "Teaspoons to Tablespoons",
            path: "/tools/other-tools/teaspoons-to-tablespoons",
          },
          { id: "volume-converter", name: "Volume Converter", path: "/tools/other-tools/volume-converter" },
        ],
      },
    ],
  },
];

export const toolMetadata = {
  "remove-watermark": {
    title: "Remove Watermark from Images - Free Tool | Inform Readers",
    description:
      "Easily remove watermarks from your images with Inform Readers' free tool. Specify watermark position and size for precise removal.",
    keywords: "remove watermark, image watermark remover, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Remove Watermark from Images - Free Tool | Inform Readers",
      description:
        "Easily remove watermarks from your images with Inform Readers' free tool. Specify watermark position and size for precise removal.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/remove-watermark",
    },
  },
  "upscale-image": {
    title: "Upscale Image - Free Tool | Inform Readers",
    description:
      "Upscale your images effortlessly with Inform Readers' free tool. Increase image resolution up to 4x with a simple scale factor adjustment.",
    keywords: "upscale image, image upscaler, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Upscale Image - Free Tool | Inform Readers",
      description:
        "Upscale your images effortlessly with Inform Readers' free tool. Increase image resolution up to 4x with a simple scale factor adjustment.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/upscale-image",
    },
  },
  "image-to-svg": {
    title: "Convert Image to SVG - Free Tool | Inform Readers",
    description:
      "Convert your images to SVG format with Inform Readers' free tool. Adjust the threshold for precise vector conversion.",
    keywords: "image to svg, convert image to svg, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Convert Image to SVG - Free Tool | Inform Readers",
      description:
        "Convert your images to SVG format with Inform Readers' free tool. Adjust the threshold for precise vector conversion.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/image-to-svg",
    },
  },
  "blur-image": {
    title: "Blur Image - Free Tool | Inform Readers",
    description:
      "Blur your images effortlessly with Inform Readers' free tool. Adjust the blur radius for the perfect effect.",
    keywords: "blur image, image blur tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Blur Image - Free Tool | Inform Readers",
      description:
        "Blur your images effortlessly with Inform Readers' free tool. Adjust the blur radius for the perfect effect.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/blur-image",
    },
  },
  "image-histogram": {
    title: "Image Histogram - Free Tool | Inform Readers",
    description:
      "Analyze your images with Inform Readers' free image histogram tool. Visualize the color distribution of your images easily.",
    keywords: "image histogram, analyze image colors, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Image Histogram - Free Tool | Inform Readers",
      description:
        "Analyze your images with Inform Readers' free image histogram tool. Visualize the color distribution of your images easily.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/image-histogram",
    },
  },
  "image-watermark": {
    title: "Add Watermark to Image - Free Tool | Inform Readers",
    description:
      "Add watermarks to your images with Inform Readers' free tool. Customize position, opacity, and more for perfect branding.",
    keywords: "add watermark to image, image watermark tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Add Watermark to Image - Free Tool | Inform Readers",
      description:
        "Add watermarks to your images with Inform Readers' free tool. Customize position, opacity, and more for perfect branding.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/image-watermark",
    },
  },
  "adjust-brightness-contrast": {
    title: "Adjust Brightness/Contrast - Free Tool | Inform Readers",
    description:
      "Adjust the brightness and contrast of your images with Inform Readers' free tool. Enhance your photos effortlessly.",
    keywords: "adjust brightness contrast, image brightness tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Adjust Brightness/Contrast - Free Tool | Inform Readers",
      description:
        "Adjust the brightness and contrast of your images with Inform Readers' free tool. Enhance your photos effortlessly.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/adjust-brightness-contrast",
    },
  },
  "noise-reduction": {
    title: "Image Noise Reduction - Free Tool | Inform Readers",
    description:
      "Reduce noise in your images with Inform Readers' free tool. Clean up your photos with adjustable filter sizes.",
    keywords: "image noise reduction, reduce image noise, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Image Noise Reduction - Free Tool | Inform Readers",
      description:
        "Reduce noise in your images with Inform Readers' free tool. Clean up your photos with adjustable filter sizes.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/noise-reduction",
    },
  },
  "advanced-image-compressor": {
    title: "Advanced Image Compressor - Free Tool | Inform Readers",
    description:
      "Compress your images with Inform Readers' free advanced compressor. Optimize quality and size for web and storage.",
    keywords: "advanced image compressor, compress image, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Advanced Image Compressor - Free Tool | Inform Readers",
      description:
        "Compress your images with Inform Readers' free advanced compressor. Optimize quality and size for web and storage.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/advanced-image-compressor",
    },
  },
  "image-to-ascii": {
    title: "Image to ASCII Art - Free Tool | Inform Readers",
    description:
      "Convert your images to ASCII art with Inform Readers' free tool. Customize the width for detailed text-based art.",
    keywords: "image to ascii, convert image to ascii art, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Image to ASCII Art - Free Tool | Inform Readers",
      description:
        "Convert your images to ASCII art with Inform Readers' free tool. Customize the width for detailed text-based art.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/image-to-ascii",
    },
  },
  "add-border": {
    title: "Add Border to Image - Free Tool | Inform Readers",
    description:
      "Easily add borders to your images with Inform Readers' free tool. Customize border width, color, and style for a polished look.",
    keywords: "add border to image, image border tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Add Border to Image - Free Tool | Inform Readers",
      description:
        "Easily add borders to your images with Inform Readers' free tool. Customize border width, color, and style for a polished look.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/add-border",
    },
  },
  "add-text-to-image": {
    title: "Add Text to Image - Free Tool | Inform Readers",
    description:
      "Add custom text to your images with Inform Readers' free tool. Adjust font, size, color, and position for perfect overlays.",
    keywords: "add text to image, image text tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Add Text to Image - Free Tool | Inform Readers",
      description:
        "Add custom text to your images with Inform Readers' free tool. Adjust font, size, color, and position for perfect overlays.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/add-text-to-image",
    },
  },
  "black-white-filter": {
    title: "Black & White Filter - Free Tool | Inform Readers",
    description:
      "Convert your images to black and white with Inform Readers' free tool. Apply a classic monochrome filter effortlessly.",
    keywords: "black and white filter, image monochrome tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Black & White Filter - Free Tool | Inform Readers",
      description:
        "Convert your images to black and white with Inform Readers' free tool. Apply a classic monochrome filter effortlessly.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/black-white-filter",
    },
  },
  "collage-maker": {
    title: "Collage Maker - Free Tool | Inform Readers",
    description:
      "Create stunning photo collages with Inform Readers' free tool. Combine multiple images with customizable layouts and spacing.",
    keywords: "collage maker, photo collage tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Collage Maker - Free Tool | Inform Readers",
      description:
        "Create stunning photo collages with Inform Readers' free tool. Combine multiple images with customizable layouts and spacing.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/collage-maker",
    },
  },
  "colorize-photo": {
    title: "Colorize Photo - Free Tool | Inform Readers",
    description:
      "Bring old photos to life with Inform Readers' free colorize tool. Add vibrant colors to black and white images easily.",
    keywords: "colorize photo, photo colorization tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Colorize Photo - Free Tool | Inform Readers",
      description:
        "Bring old photos to life with Inform Readers' free colorize tool. Add vibrant colors to black and white images easily.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/colorize-photo",
    },
  },
  "compress-image": {
    title: "Compress Image - Free Tool | Inform Readers",
    description:
      "Reduce image file size with Inform Readers' free compression tool. Optimize images for web and storage without losing quality.",
    keywords: "compress image, image compression tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Compress Image - Free Tool | Inform Readers",
      description:
        "Reduce image file size with Inform Readers' free compression tool. Optimize images for web and storage without losing quality.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/compress-image",
    },
  },
  "crop-image": {
    title: "Crop Image - Free Tool | Inform Readers",
    description:
      "Crop your images precisely with Inform Readers' free tool. Adjust dimensions and focus on the perfect section of your photo.",
    keywords: "crop image, image cropping tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Crop Image - Free Tool | Inform Readers",
      description:
        "Crop your images precisely with Inform Readers' free tool. Adjust dimensions and focus on the perfect section of your photo.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/crop-image",
    },
  },
  "heic-to-jpg": {
    title: "HEIC to JPG Converter - Free Tool | Inform Readers",
    description:
      "Convert HEIC images to JPG with Inform Readers' free tool. Transform your photos for broader compatibility easily.",
    keywords: "heic to jpg, convert heic to jpg, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "HEIC to JPG Converter - Free Tool | Inform Readers",
      description:
        "Convert HEIC images to JPG with Inform Readers' free tool. Transform your photos for broader compatibility easily.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/heic-to-jpg",
    },
  },
  "image-format-converter": {
    title: "Image Format Converter - Free Tool | Inform Readers",
    description:
      "Convert images between formats (PNG, JPG, GIF, etc.) with Inform Readers' free tool. Easy and fast format conversion.",
    keywords: "image format converter, convert image format, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Image Format Converter - Free Tool | Inform Readers",
      description:
        "Convert images between formats (PNG, JPG, GIF, etc.) with Inform Readers' free tool. Easy and fast format conversion.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/image-format-converter",
    },
  },
  "image-splitter": {
    title: "Image Splitter - Free Tool | Inform Readers",
    description:
      "Split your images into multiple parts with Inform Readers' free tool. Customize rows and columns for perfect divisions.",
    keywords: "image splitter, split image tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Image Splitter - Free Tool | Inform Readers",
      description:
        "Split your images into multiple parts with Inform Readers' free tool. Customize rows and columns for perfect divisions.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/image-splitter",
    },
  },
  "image-to-text": {
    title: "Image to Text Converter - Free Tool | Inform Readers",
    description:
      "Extract text from images easily with Inform Readers' free Image to Text converter. Supports multiple languages and formats.",
    keywords: "image to text, OCR tool, text extraction, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Image to Text Converter - Free Tool | Inform Readers",
      description:
        "Extract text from images easily with Inform Readers' free Image to Text converter. Supports multiple languages and formats.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/image-to-text",
    },
  },
  "pdf-to-jpg": {
    title: "PDF to JPG Converter - Free Tool | Inform Readers",
    description:
      "Convert your PDF files to high-quality JPG images quickly with Inform Readers' free PDF to JPG converter.",
    keywords: "pdf to jpg, convert pdf to image, free pdf tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "PDF to JPG Converter - Free Tool | Inform Readers",
      description:
        "Convert your PDF files to high-quality JPG images quickly with Inform Readers' free PDF to JPG converter.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/pdf-to-jpg",
    },
  },
  "pixelate-image": {
    title: "Pixelate Image - Free Tool | Inform Readers",
    description:
      "Pixelate your images easily with Inform Readers' free tool. Control pixel size for privacy or creative effects.",
    keywords: "pixelate image, image pixelation, privacy tool, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Pixelate Image - Free Tool | Inform Readers",
      description:
        "Pixelate your images easily with Inform Readers' free tool. Control pixel size for privacy or creative effects.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/pixelate-image",
    },
  },
  "remove-background": {
    title: "Remove Image Background - Free Tool | Inform Readers",
    description:
      "Quickly remove backgrounds from images with Inform Readers' free background remover. Perfect for product photos and designs.",
    keywords: "remove background, background remover, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Remove Image Background - Free Tool | Inform Readers",
      description:
        "Quickly remove backgrounds from images with Inform Readers' free background remover. Perfect for product photos and designs.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/remove-background",
    },
  },
  "resize-image": {
    title: "Resize Image - Free Tool | Inform Readers",
    description:
      "Resize your images easily with Inform Readers' free tool. Maintain quality while adjusting width and height.",
    keywords: "resize image, image resizer, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Resize Image - Free Tool | Inform Readers",
      description:
        "Resize your images easily with Inform Readers' free tool. Maintain quality while adjusting width and height.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/resize-image",
    },
  },
  "round-image": {
    title: "Round Image Corners - Free Tool | Inform Readers",
    description:
      "Add rounded corners to your images effortlessly with Inform Readers' free Round Image tool. Customize radius and style.",
    keywords: "round image, rounded corners, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Round Image Corners - Free Tool | Inform Readers",
      description:
        "Add rounded corners to your images effortlessly with Inform Readers' free Round Image tool. Customize radius and style.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/round-image",
    },
  },
  "view-metadata": {
    title: "View Image Metadata - Free Tool | Inform Readers",
    description:
      "View detailed metadata of your images including EXIF data with Inform Readers' free metadata viewer tool.",
    keywords: "view metadata, image metadata viewer, EXIF viewer, free image tool, Inform Readers",
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "View Image Metadata - Free Tool | Inform Readers",
      description:
        "View detailed metadata of your images including EXIF data with Inform Readers' free metadata viewer tool.",
      type: "website",
      url: "https://www.informreaders.com/tools/image-tools/view-metadata",
    },
  },
};
export const calculatorMetaData = {
  "acceleration-calculator-with-charts": {
    title: "Acceleration Calculator with Charts | Inform Readers",
    description:
      "Calculate acceleration with visual charts for better understanding of motion dynamics. Ideal for physics students and educators.",
  },
  "arrow-speed-calculator": {
    title: "Arrow Speed Calculator | Inform Readers",
    description:
      "Estimate the speed of arrows based on draw weight, arrow mass, and release factors. Useful for archers and ballistics analysis.",
  },
  "astrophysics-calculator": {
    title: "Astrophysics Calculator | Inform Readers",
    description:
      "Perform key astrophysics calculations such as gravitational forces, orbital dynamics, and star properties.",
  },
  "ballistic-coefficient-calculator": {
    title: "Ballistic Coefficient Calculator | Inform Readers",
    description:
      "Calculate the ballistic coefficient to predict projectile behavior and flight performance over distances.",
  },
  "biophysics-calculator": {
    title: "Biophysics Calculator | Inform Readers",
    description:
      "Explore physical principles applied to biological systems, from molecular motion to cellular dynamics.",
  },
  "car-crash-calculator": {
    title: "Car Crash Impact Calculator | Inform Readers",
    description:
      "Estimate impact force in car crashes based on speed, mass, and stopping distance. A valuable tool for safety analysis.",
  },
  "car-jump-distance-calculator": {
    title: "Car Jump Distance Calculator | Inform Readers",
    description:
      "Predict how far a vehicle will jump based on speed and launch angle. Great for stunt planning and simulations.",
  },
  "computational-physics-calculator": {
    title: "Computational Physics Calculator | Inform Readers",
    description:
      "Solve complex physics problems using numerical methods and simulations with this advanced calculator.",
  },
  "condensed-matter-calculator": {
    title: "Condensed Matter Physics Calculator | Inform Readers",
    description:
      "Analyze properties of solids and liquids, including lattice dynamics, electron interactions, and thermal properties.",
  },
  "cosmology-calculator": {
    title: "Cosmology Calculator | Inform Readers",
    description:
      "Explore universe models, expansion rates, and redshift-distance relationships with this cosmology tool.",
  },
  "electromagnetism-calculator": {
    title: "Electromagnetism Calculator | Inform Readers",
    description:
      "Calculate electromagnetic field strengths, forces, and potentials. Essential for E&M and electronics applications.",
  },
  "energy-calculator-advanced": {
    title: "Advanced Energy Calculator | Inform Readers",
    description:
      "Analyze kinetic, potential, thermal, and mechanical energy in various physical systems with advanced parameters.",
  },
  "fluid-dynamics-calculator": {
    title: "Fluid Dynamics Calculator | Inform Readers",
    description:
      "Compute pressure, flow rate, drag force, and more in fluid systems. A must-have for aerodynamics and hydrodynamics studies.",
  },
  "free-fall-air-resistance-calculator": {
    title: "Free Fall with Air Resistance Calculator | Inform Readers",
    description:
      "Simulate object motion under gravity and air resistance to determine terminal velocity and fall time accurately.",
  },
  "general-relativity-calculator": {
    title: "General Relativity Calculator | Inform Readers",
    description:
      "Explore time dilation, gravitational lensing, and curvature of spacetime with this Einstein-inspired physics tool.",
  },
  "gravitational-force-calculator": {
    title: "Gravitational Force Calculator | Inform Readers",
    description:
      "Determine gravitational attraction between two masses. Perfect for physics education and astrophysics modeling.",
  },
  "ground-speed-calculator": {
    title: "Ground Speed Calculator | Inform Readers",
    description:
      "Calculate an object's speed relative to the ground, factoring in wind or current influences. Great for aviation and sailing.",
  },
  "harmonic-motion-calculator": {
    title: "Harmonic Motion Calculator | Inform Readers",
    description:
      "Analyze oscillatory systems like springs and pendulums, including period, frequency, and displacement over time.",
  },
  "magnitude-acceleration-calculator": {
    title: "Magnitude of Acceleration Calculator | Inform Readers",
    description:
      "Compute the magnitude of an object's acceleration vector given its components. Useful in vector physics and kinematics.",
  },
  "momentum-collision-calculator": {
    title: "Momentum & Collision Calculator | Inform Readers",
    description:
      "Calculate momentum, impulse, and final velocities for elastic and inelastic collisions between bodies.",
  },
  "nuclear-physics-calculator": {
    title: "Nuclear Physics Calculator | Inform Readers",
    description:
      "Perform calculations related to nuclear decay, binding energy, and fission/fusion processes. Designed for advanced nuclear science studies.",
  },
  "optics-calculator": {
    title: "Optics Calculator | Inform Readers",
    description:
      "Analyze light behavior through lenses and mirrors, including focal length, magnification, and image formation.",
  },
  "particle-physics-calculator": {
    title: "Particle Physics Calculator | Inform Readers",
    description:
      "Explore interactions between subatomic particles, decay processes, and energy-mass relations with this high-energy physics tool.",
  },
  "plasma-physics-calculator": {
    title: "Plasma Physics Calculator | Inform Readers",
    description:
      "Calculate plasma parameters such as Debye length, plasma frequency, and temperature. Ideal for space and fusion research.",
  },
  "polar-moment-calculator": {
    title: "Polar Moment Calculator | Inform Readers",
    description:
      "Determine the polar moment of inertia for various cross-sections. Useful for torsional stress analysis in mechanical engineering.",
  },
  "projectile-motion-calculator": {
    title: "Projectile Motion Calculator | Inform Readers",
    description:
      "Compute the trajectory, range, time of flight, and maximum height of projectiles under gravity.",
  },
  "projectile-visualizer-advanced": {
    title: "Projectile Visualizer Advanced | Inform Readers",
    description:
      "Visualize and simulate complex projectile motion with air resistance and angle variations. Great for advanced physics demonstrations.",
  },
  "quantum-field-theory-calculator": {
    title: "Quantum Field Theory Calculator | Inform Readers",
    description:
      "Dive into quantum fields and particle interactions with tools for Lagrangians, Feynman diagrams, and more.",
  },
  "quantum-mechanics-calculator": {
    title: "Quantum Mechanics Calculator | Inform Readers",
    description:
      "Solve quantum problems involving wavefunctions, potential wells, uncertainty principles, and energy levels.",
  },
  "relativity-calculator": {
    title: "Relativity Calculator | Inform Readers",
    description:
      "Explore time dilation, length contraction, and relativistic mass changes based on Einstein's theory of relativity.",
  },
  "rotational-dynamics-calculator": {
    title: "Rotational Dynamics Calculator | Inform Readers",
    description:
      "Calculate torque, angular momentum, rotational inertia, and more for rotating bodies and systems.",
  },
  "statistical-mechanics-calculator": {
    title: "Statistical Mechanics Calculator | Inform Readers",
    description:
      "Analyze macroscopic properties using statistical methods, including partition functions, entropy, and thermodynamic probabilities.",
  },
  "suvat-calculator-advanced": {
    title: "SUVAT Calculator Advanced | Inform Readers",
    description:
      "Solve motion problems using SUVAT equations with flexible inputs for displacement, velocity, acceleration, and time.",
  },
  "tension-calculator": {
    title: "Tension Calculator | Inform Readers",
    description:
      "Determine the tension force in cables, ropes, or strings in mechanical systems under various conditions.",
  },
  "thermodynamics-calculator": {
    title: "Thermodynamics Calculator | Inform Readers",
    description:
      "Calculate energy transfer, work, heat, entropy, and efficiency across thermodynamic processes and cycles.",
  },
  "vector-resolver": {
    title: "Vector Resolver | Inform Readers",
    description:
      "Resolve vectors into components or find resultant vectors in 2D and 3D space. Essential for physics and engineering.",
  },
  "wave-mechanics-calculator": {
    title: "Wave Mechanics Calculator | Inform Readers",
    description:
      "Compute wave properties like speed, frequency, wavelength, energy, and interference in classical and quantum contexts.",
  },
  "work-energy-calculator": {
    title: "Work and Energy Calculator | Inform Readers",
    description:
      "Calculate work done, kinetic and potential energy, and energy conservation in various physical systems.",
  },
  "advanced-fraction-calculator": {
    title: "Advanced Fraction Calculator | Inform Readers",
    description:
      "Add, subtract, multiply, or divide fractions with step-by-step simplification. Great for students and professionals alike.",
  },
  "area-calculator": {
    title: "Area Calculator | Inform Readers",
    description: "Quickly calculate the area of geometric shapes like circles, squares, triangles, and more.",
  },
  "average-calculator": {
    title: "Average Calculator | Inform Readers",
    description:
      "Find the mean of any data set quickly and easily. Supports weighted and unweighted averages.",
  },
  "big-number-calculator": {
    title: "Big Number Calculator | Inform Readers",
    description: "Perform calculations on extremely large integers beyond normal calculator limits.",
  },
  "binary-calculator": {
    title: "Binary Calculator | Inform Readers",
    description: "Convert between binary, decimal, and hexadecimal or perform binary arithmetic operations.",
  },
  "circle-calculator": {
    title: "Circle Calculator | Inform Readers",
    description: "Calculate circle area, circumference, diameter, and radius with just one value.",
  },
  "common-factor-calculator": {
    title: "Common Factor Calculator | Inform Readers",
    description: "Find common factors or the greatest common divisor (GCD) of any two or more integers.",
  },
  "confidence-interval-calculator": {
    title: "Confidence Interval Calculator | Inform Readers",
    description:
      "Compute confidence intervals for population means and proportions. Useful for statistics students and researchers.",
  },
  "distance-calculator": {
    title: "Distance Calculator | Inform Readers",
    description: "Calculate the straight-line distance between two points in 2D or 3D space.",
  },
  "exponent-calculator": {
    title: "Exponent Calculator | Inform Readers",
    description:
      "Calculate powers and exponents with base and exponent inputs. Supports negative and fractional powers.",
  },
  "factor-calculator": {
    title: "Factor Calculator | Inform Readers",
    description:
      "Find all the factors of any integer quickly and easily. Great for number theory and math homework.",
  },
  "fraction-calculator": {
    title: "Fraction Calculator | Inform Readers",
    description:
      "Perform addition, subtraction, multiplication, and division of fractions with simplified output.",
  },
  "greatest-common-factor-calculator": {
    title: "Greatest Common Factor Calculator | Inform Readers",
    description: "Calculate the GCF (HCF) of two or more numbers using efficient algorithms.",
  },
  "half-life-calculator": {
    title: "Half-Life Calculator | Inform Readers",
    description: "Calculate the remaining quantity of a substance after a given number of half-life periods.",
  },
  "hex-calculator": {
    title: "Hex Calculator | Inform Readers",
    description: "Perform hexadecimal arithmetic and convert between hex, binary, and decimal formats.",
  },
  "lcm-calculator": {
    title: "LCM Calculator | Inform Readers",
    description: "Find the Least Common Multiple (LCM) of two or more numbers efficiently.",
  },
  "logarithm-calculator": {
    title: "Logarithm Calculator | Inform Readers",
    description:
      "Compute logarithms with any base, including natural and common logs. Ideal for algebra and calculus.",
  },
  "long-division-calculator": {
    title: "Long Division Calculator | Inform Readers",
    description: "Solve division problems with detailed steps using the long division method.",
  },
  "matrix-calculator": {
    title: "Matrix Calculator | Inform Readers",
    description:
      "Perform matrix operations such as addition, multiplication, and inversion. Great for linear algebra.",
  },
  "mean-median-mode-range-calculator": {
    title: "Mean, Median, Mode, Range Calculator | Inform Readers",
    description:
      "Compute key statistical measures from a data set in seconds. Useful for students and analysts.",
  },
  "advanced-fraction-calculator": {
    title: "Advanced Fraction Calculator | Inform Readers",
    description:
      "Solve complex fraction calculations with step-by-step output and simplification using our Advanced Fraction Calculator.",
  },
  "area-calculator": {
    title: "Area Calculator | Inform Readers",
    description: "Calculate the area of various geometric shapes instantly with our Area Calculator.",
  },
  "average-calculator": {
    title: "Average Calculator | Inform Readers",
    description: "Find the mean of numbers accurately with our easy-to-use Average Calculator.",
  },
  "big-number-calculator": {
    title: "Big Number Calculator | Inform Readers",
    description:
      "Perform calculations on large integers beyond normal limits using our Big Number Calculator.",
  },
  "binary-calculator": {
    title: "Binary Calculator | Inform Readers",
    description: "Add, subtract, and convert binary numbers with our comprehensive Binary Calculator.",
  },
  "circle-calculator": {
    title: "Circle Calculator | Inform Readers",
    description: "Compute the area, circumference, and diameter of a circle with ease.",
  },
  "common-factor-calculator": {
    title: "Common Factor Calculator | Inform Readers",
    description: "Find all common factors of two or more numbers with our fast and simple tool.",
  },
  "confidence-interval-calculator": {
    title: "Confidence Interval Calculator | Inform Readers",
    description: "Estimate the confidence interval for population parameters based on sample statistics.",
  },
  "distance-calculator": {
    title: "Distance Calculator | Inform Readers",
    description: "Compute the distance between two points using coordinate geometry.",
  },
  "exponent-calculator": {
    title: "Exponent Calculator | Inform Readers",
    description: "Easily calculate powers and exponents of numbers with this quick calculator.",
  },
  "factor-calculator": {
    title: "Factor Calculator | Inform Readers",
    description: "Get all the factors of any integer quickly and accurately.",
  },
  "fraction-calculator": {
    title: "Fraction Calculator | Inform Readers",
    description: "Perform operations on fractions, including simplification and conversion.",
  },
  "greatest-common-factor-calculator": {
    title: "Greatest Common Factor Calculator | Inform Readers",
    description: "Find the GCF of two or more numbers quickly and easily.",
  },
  "half-life-calculator": {
    title: "Half-Life Calculator | Inform Readers",
    description: "Determine the remaining quantity of a substance based on its half-life.",
  },
  "hex-calculator": {
    title: "Hex Calculator | Inform Readers",
    description: "Perform hexadecimal arithmetic and conversions with ease.",
  },
  "lcm-calculator": {
    title: "LCM Calculator | Inform Readers",
    description: "Calculate the least common multiple (LCM) of any set of integers.",
  },
  "logarithm-calculator": {
    title: "Logarithm Calculator | Inform Readers",
    description: "Calculate logarithms for any base, including natural and common logs.",
  },
  "long-division-calculator": {
    title: "Long Division Calculator | Inform Readers",
    description: "Perform long division with step-by-step instructions.",
  },
  "matrix-calculator": {
    title: "Matrix Calculator | Inform Readers",
    description: "Add, subtract, and multiply matrices or find the determinant and inverse.",
  },
  "mean-median-mode-range-calculator": {
    title: "Mean, Median, Mode, Range Calculator | Inform Readers",
    description: "Quickly compute all key measures of central tendency for your dataset.",
  },
  "number-sequence-calculator": {
    title: "Number Sequence Calculator | Inform Readers",
    description: "Identify patterns and predict the next terms in number sequences.",
  },
  "p-value-calculator": {
    title: "P-value Calculator | Inform Readers",
    description: "Find the p-value for your statistical test results to interpret significance.",
  },
  "percent-error-calculator": {
    title: "Percent Error Calculator | Inform Readers",
    description: "Calculate the percentage error between a measured and true value.",
  },
  "percentage-calculator": {
    title: "Percentage Calculator | Inform Readers",
    description: "Quickly compute percentages, percentage increases or decreases.",
  },
  "permutation-and-combination-calculator": {
    title: "Permutation and Combination Calculator | Inform Readers",
    description: "Calculate total permutations and combinations for given elements.",
  },
  "prime-factorization-calculator": {
    title: "Prime Factorization Calculator | Inform Readers",
    description: "Break down numbers into their prime factors step by step.",
  },
  "probability-calculator": {
    title: "Probability Calculator | Inform Readers",
    description: "Compute the probability of events based on inputs and conditions.",
  },
  "pythagorean-theorem-calculator": {
    title: "Pythagorean Theorem Calculator | Inform Readers",
    description: "Calculate the hypotenuse or any side of a right triangle easily.",
  },
  "quadratic-formula-calculator": {
    title: "Quadratic Formula Calculator | Inform Readers",
    description: "Solve quadratic equations using the standard formula with real-time output.",
  },
  "random-number-generator": {
    title: "Random Number Generator | Inform Readers",
    description: "Generate random numbers for any range and format instantly.",
  },
  "ratio-calculator": {
    title: "Ratio Calculator | Inform Readers",
    description: "Simplify and compare ratios or find missing values with our powerful Ratio Calculator.",
  },
  "right-triangle-calculator": {
    title: "Right Triangle Calculator | Inform Readers",
    description: "Calculate sides and angles of right triangles using trigonometry and Pythagoras.",
  },
  "root-calculator": {
    title: "Root Calculator | Inform Readers",
    description: "Find square roots, cube roots, and nth roots quickly and accurately.",
  },
  "rounding-calculator": {
    title: "Rounding Calculator | Inform Readers",
    description: "Round numbers to the nearest whole, decimal place, or custom precision.",
  },
  "sample-size-calculator": {
    title: "Sample Size Calculator | Inform Readers",
    description:
      "Determine ideal sample sizes for surveys and studies based on confidence and margin of error.",
  },
  "scientific-calculator": {
    title: "Scientific Calculator | Inform Readers",
    description: "Use a full-featured online scientific calculator for all complex math operations.",
  },
  "scientific-notation-calculator": {
    title: "Scientific Notation Calculator | Inform Readers",
    description: "Convert numbers to and from scientific notation instantly.",
  },
  "slope-calculator": {
    title: "Slope Calculator | Inform Readers",
    description: "Calculate the slope between two points on a line using simple geometry.",
  },
  "standard-deviation-calculator": {
    title: "Standard Deviation Calculator | Inform Readers",
    description: "Compute standard deviation and variance for any set of data points.",
  },
  "statistics-calculator": {
    title: "Statistics Calculator | Inform Readers",
    description: "Calculate mean, median, variance, standard deviation and more statistical measures.",
  },
  "surface-area-calculator": {
    title: "Surface Area Calculator | Inform Readers",
    description: "Compute surface area for 3D shapes like cubes, spheres, pyramids, and more.",
  },
  "triangle-calculator": {
    title: "Triangle Calculator | Inform Readers",
    description: "Solve triangle side lengths and angles using various trigonometric formulas.",
  },
  "volume-calculator": {
    title: "Volume Calculator | Inform Readers",
    description: "Find the volume of 3D geometric figures like cylinders, cones, and cubes.",
  },
  "z-score-calculator": {
    title: "Z-score Calculator | Inform Readers",
    description:
      "Calculate Z-scores for normal distributions to determine standard deviations from the mean.",
  },
  "anorexic-bmi-calculator": {
    title: "Anorexic BMI Calculator | Inform Readers",
    description:
      "Determine if your BMI falls within anorexic levels using our specialized Anorexic BMI Calculator.",
  },
  "army-body-fat-calculator": {
    title: "Army Body Fat Calculator | Inform Readers",
    description:
      "Calculate your body fat percentage using official U.S. Army standards for fitness assessments.",
  },
  "bmi-calculator": {
    title: "BMI Calculator | Inform Readers",
    description:
      "Instantly calculate your Body Mass Index (BMI) and understand your weight category for better health planning.",
  },
  "bmr-calculator": {
    title: "BMR Calculator | Inform Readers",
    description:
      "Estimate your Basal Metabolic Rate to understand how many calories your body burns at rest.",
  },
  "body-surface-area-calculator": {
    title: "Body Surface Area Calculator | Inform Readers",
    description: "Calculate your total body surface area (BSA) for medical dosing and clinical purposes.",
  },
  "calories-burned-calculator": {
    title: "Calories Burned Calculator | Inform Readers",
    description: "Estimate how many calories you burn from activities like running, cycling, and walking.",
  },
  "carbohydrate-calculator": {
    title: "Carbohydrate Calculator | Inform Readers",
    description:
      "Find out how many carbs you need daily based on your activity level, weight goals, and dietary preferences.",
  },
  "fat-intake-calculator": {
    title: "Fat Intake Calculator | Inform Readers",
    description:
      "Determine the optimal amount of dietary fat for your health goals with our Fat Intake Calculator.",
  },
  "healthy-weight-calculator": {
    title: "Healthy Weight Calculator | Inform Readers",
    description: "See if you're within the healthy weight range for your height and age using our easy tool.",
  },
  "ideal-weight-calculator": {
    title: "Ideal Weight Calculator | Inform Readers",
    description:
      "Estimate your ideal body weight using multiple methods like Devine, Robinson, and BMI-based formulas.",
  },
  "lean-body-mass-calculator": {
    title: "Lean Body Mass Calculator | Inform Readers",
    description: "Calculate your lean body mass to better plan fitness, diet, and body composition goals.",
  },
  "one-rep-max-calculator": {
    title: "One Rep Max Calculator | Inform Readers",
    description:
      "Estimate your 1RM — the maximum weight you can lift for one repetition — for strength training.",
  },
  "overweight-calculator": {
    title: "Overweight Calculator | Inform Readers",
    description:
      "Check if your BMI places you in the overweight category and what steps you can take for change.",
  },
  "protein-calculator": {
    title: "Protein Calculator | Inform Readers",
    description:
      "Determine your daily protein needs based on body weight, activity level, and fitness goals.",
  },
  "tdee-calculator": {
    title: "TDEE Calculator | Inform Readers",
    description:
      "Calculate your Total Daily Energy Expenditure (TDEE) to plan calorie intake for weight loss or gain.",
  },
  "annealing-temperature-calculator": {
    title: "Annealing Temperature Calculator | Inform Readers",
    description: "Calculate your Total Annealing Temperature.",
  },
  // Financial Calculators
  "401k-calculator-for-use-by-us-residents": {
    title: "401(k) Calculator | Inform Readers",
    description:
      "Estimate your 401(k) retirement savings and see how contributions, employer match, and investment returns affect your future balance.",
  },
  "advance-debt-consolidation-calculator": {
    title: "Debt Consolidation Calculator | Inform Readers",
    description:
      "Evaluate whether consolidating your debts into a single loan can lower your monthly payments and total interest costs.",
  },
  "amortization-calculator": {
    title: "Amortization Calculator | Inform Readers",
    description:
      "Visualize your loan repayment over time with a detailed amortization schedule including principal and interest breakdowns.",
  },
  "annuity-calculator": {
    title: "Annuity Calculator | Inform Readers",
    description:
      "Calculate the present or future value of an annuity based on payment frequency, rate of return, and duration.",
  },
  "annuity-payout-calculator": {
    title: "Annuity Payout Calculator | Inform Readers",
    description:
      "Estimate the monthly or annual payouts you can receive from an annuity based on principal and interest rate.",
  },
  "apr-calculator": {
    title: "APR Calculator | Inform Readers",
    description:
      "Determine the true annual percentage rate (APR) of a loan, including interest and additional fees.",
  },
  "auto-lease-calculator": {
    title: "Auto Lease Calculator | Inform Readers",
    description:
      "Estimate your monthly car lease payments, factoring in residual value, money factor, term, and more.",
  },
  "auto-loan-calculator": {
    title: "Auto Loan Calculator | Inform Readers",
    description:
      "Figure out your monthly car loan payments and total interest based on loan amount, term, and APR.",
  },
  "average-return-calculator": {
    title: "Average Return Calculator | Inform Readers",
    description:
      "Calculate average annual return on investment (ROI) to assess the historical performance of your portfolio.",
  },
  "bond-calculator": {
    title: "Bond Calculator | Inform Readers",
    description:
      "Evaluate bond yield, price, and interest income using various inputs like face value, coupon rate, and maturity.",
  },
  "budget-calculator": {
    title: "Budget Calculator | Inform Readers",
    description:
      "Create a personal budget by tracking income and expenses to better manage your monthly finances.",
  },
  "business-loan-calculator": {
    title: "Business Loan Calculator | Inform Readers",
    description:
      "Estimate loan payments for your business financing needs based on amount, term, and interest rate.",
  },
  "canadian-mortgage-calculator": {
    title: "Canadian Mortgage Calculator | Inform Readers",
    description:
      "Calculate monthly mortgage payments, interest costs, and amortization schedules under Canadian lending rules.",
  },
  "cash-back-and-low-interest-calculator": {
    title: "Cash Back & Low Interest Calculator | Inform Readers",
    description:
      "Compare savings between credit cards with cash back offers versus low interest rates over time.",
  },
  "cd-calculator": {
    title: "CD Calculator | Inform Readers",
    description:
      "Estimate how much interest you’ll earn on a Certificate of Deposit (CD) over time with compound growth.",
  },
  "college-cost-calculator": {
    title: "College Cost Calculator | Inform Readers",
    description:
      "Plan for education expenses by estimating total college costs, including tuition, fees, housing, and inflation.",
  },
  "commission-calculator": {
    title: "Commission Calculator | Inform Readers",
    description:
      "Calculate commission earnings based on sales amount and commission percentage or tiered structures.",
  },
  "compound-interest-calculator": {
    title: "Compound Interest Calculator | Inform Readers",
    description:
      "See how your savings grow over time with compound interest using customizable rate, time, and contribution inputs.",
  },
  "credit-card-calculator": {
    title: "Credit Card Calculator | Inform Readers",
    description:
      "Understand the long-term costs of carrying a credit card balance and how payments affect interest accrual.",
  },
  "credit-card-payoff-calculator": {
    title: "Credit Card Payoff Calculator | Inform Readers",
    description:
      "Create a strategy to pay off your credit card debt faster and save on interest with various payoff methods.",
  },
  "debt-payoff-calculator": {
    title: "Debt Payoff Calculator | Inform Readers",
    description:
      "Plan your debt-free journey by estimating how long it will take to pay off your debt with our Debt Payoff Calculator.",
  },
  "debt-consolidation-calculator": {
    title: "Debt Consolidation Calculator | Inform Readers",
    description:
      "Evaluate your savings potential by consolidating multiple debts into a single loan with our Debt Consolidation Calculator.",
  },
  "Depreciation-Calculator": {
    title: "Depreciation Calculator | Inform Readers",
    description:
      "Calculate the depreciation of assets using methods like straight-line, declining balance, and sum-of-years-digits.",
  },
  "Discount-Calculator": {
    title: "Discount Calculator | Inform Readers",
    description:
      "Quickly calculate discounted prices and savings for any item using our Discount Calculator.",
  },
  "Down-Payment-Calculator": {
    title: "Down Payment Calculator | Inform Readers",
    description:
      "Estimate your ideal down payment amount and how it impacts your monthly mortgage or loan payments.",
  },
  "DTI-Ratio-Calculator": {
    title: "DTI Ratio Calculator | Inform Readers",
    description:
      "Calculate your Debt-to-Income (DTI) ratio to assess loan eligibility and improve financial planning.",
  },
  "estate-tax-calculator": {
    title: "Estate Tax Calculator | Inform Readers",
    description:
      "Estimate estate taxes owed based on federal limits and exemptions using our Estate Tax Calculator.",
  },
  "FHA-Loan-Calculator": {
    title: "FHA Loan Calculator | Inform Readers",
    description:
      "Calculate your monthly FHA loan payments including MIP, taxes, and insurance with our FHA Loan Calculator.",
  },
  "finance-calculator": {
    title: "Finance Calculator | Inform Readers",
    description:
      "Perform essential financial computations like loan payments, interest, and time value of money.",
  },
  "Future-Value-Calculator": {
    title: "Future Value Calculator | Inform Readers",
    description:
      "Estimate the future value of investments based on interest rate and time using our Future Value Calculator.",
  },
  "house-affordability-calculator": {
    title: "House Affordability Calculator | Inform Readers",
    description: "Determine how much house you can afford based on income, debt, and expenses.",
  },
  "income-tax-calculator": {
    title: "Income Tax Calculator | Inform Readers",
    description: "Estimate your federal income tax liability with our up-to-date Income Tax Calculator.",
  },
  "inflation-calculator": {
    title: "Inflation Calculator | Inform Readers",
    description:
      "Understand the impact of inflation on purchasing power over time using our Inflation Calculator.",
  },
  "interest-calculator": {
    title: "Interest Calculator | Inform Readers",
    description: "Calculate simple and compound interest on savings, loans, or investments.",
  },
  "interest-rate-calculator": {
    title: "Interest Rate Calculator | Inform Readers",
    description: "Find the effective interest rate or compare interest rates between different loan options.",
  },
  "investment-calculator": {
    title: "Investment Calculator | Inform Readers",
    description: "Project your investment growth based on initial capital, rate of return, and time horizon.",
  },
  "IRA-Calculator": {
    title: "IRA Calculator | Inform Readers",
    description:
      "Estimate your retirement savings and tax benefits using our IRA Calculator for traditional and Roth accounts.",
  },
  "IRR-Calculator": {
    title: "IRR Calculator | Inform Readers",
    description: "Calculate the Internal Rate of Return (IRR) for your investment to evaluate profitability.",
  },
  "lease-Calculator": {
    title: "Lease Calculator | Inform Readers",
    description:
      "Estimate monthly lease payments based on vehicle price, residual value, term, and money factor.",
  },
  "loan-calculator": {
    title: "Loan Calculator | Inform Readers",
    description: "Calculate loan payments, interest, and amortization schedules with our Loan Calculator.",
  },
  "margin-calculator": {
    title: "Margin Calculator | Inform Readers",
    description: "Calculate required margin and potential profit/loss for margin-based trading strategies.",
  },
  "mortgage-amortization-calculator": {
    title: "Mortgage Amortization Calculator | Inform Readers",
    description: "Visualize your mortgage amortization schedule including interest vs. principal payments.",
  },
  "mortgage-payoff-calculator": {
    title: "Mortgage Payoff Calculator | Inform Readers",
    description: "Estimate how quickly you can pay off your mortgage by making extra payments.",
  },
  "mortgage-calculator": {
    title: "Mortgage Calculator | Inform Readers",
    description: "Calculate your monthly mortgage payment based on loan amount, interest rate, and term.",
  },
  "payback-period-calculator": {
    title: "Payback Period Calculator | Inform Readers",
    description:
      "Determine how long it will take to recoup your investment with our Payback Period Calculator.",
  },
  "payment-calculator": {
    title: "Payment Calculator | Inform Readers",
    description: "Figure out monthly or periodic payments for any loan amount and term.",
  },
  "pension-calculator": {
    title: "Pension Calculator | Inform Readers",
    description: "Estimate your expected pension income at retirement based on service and salary.",
  },
  "percent-off-calculator": {
    title: "Percent Off Calculator | Inform Readers",
    description: "Quickly calculate how much you’ll save with discounts and percent-off deals.",
  },
  "personal-loan-calculator": {
    title: "Personal Loan Calculator | Inform Readers",
    description: "Calculate your monthly payments and total cost for any personal loan amount and rate.",
  },
  "present-value-calculator": {
    title: "Present Value Calculator | Inform Readers",
    description: "Find out the present value of future cash flows or investments with this calculator.",
  },
  "refinance-calculator": {
    title: "Refinance Calculator | Inform Readers",
    description: "See how much you can save by refinancing your loan at a new interest rate.",
  },
  "rent-vs-buy-calculator": {
    title: "Rent vs. Buy Calculator | Inform Readers",
    description: "Compare renting versus buying a home based on financial and lifestyle factors.",
  },
  "rent-calculator": {
    title: "Rent Calculator | Inform Readers",
    description: "Estimate how much rent you can afford based on your income and expenses.",
  },
  "rental-property-calculator": {
    title: "Rental Property Calculator | Inform Readers",
    description: "Evaluate potential returns on rental properties by factoring in income and expenses.",
  },
  "repayment-calculator": {
    title: "Repayment Calculator | Inform Readers",
    description: "Determine repayment schedules for various loan types and payment strategies.",
  },
  "retirement-calculator": {
    title: "Retirement Calculator | Inform Readers",
    description: "Estimate how much you need to retire comfortably and whether you're on track.",
  },
  "rmd-calculator": {
    title: "RMD Calculator | Inform Readers",
    description: "Calculate Required Minimum Distributions (RMDs) from your retirement accounts.",
  },
  "roi-calculator": {
    title: "ROI Calculator | Inform Readers",
    description: "Compute the Return on Investment (ROI) to evaluate the profitability of your investments.",
  },
  "roth-ira-calculator": {
    title: "Roth IRA Calculator | Inform Readers",
    description: "Estimate future value of your Roth IRA contributions and tax-free withdrawals.",
  },
  "salary-calculator": {
    title: "Salary Calculator | Inform Readers",
    description: "Convert salary to hourly, estimate take-home pay, or compare annual incomes.",
  },
  "savings-calculator": {
    title: "Savings Calculator | Inform Readers",
    description: "Estimate how your savings will grow over time with compound interest and regular deposits.",
  },
  "simple-interest-calculator": {
    title: "Simple Interest Calculator | Inform Readers",
    description: "Calculate simple interest earned or paid based on principal, rate, and time.",
  },
  "simplified-sales-tax-calculator": {
    title: "Simplified Sales Tax Calculator | Inform Readers",
    description: "Quickly estimate sales tax for your purchases based on location and tax rate.",
  },
  "social-security-calculator": {
    title: "Social Security Calculator | Inform Readers",
    description: "Estimate your future Social Security benefits based on earnings and retirement age.",
  },
  "student-loan-calculator": {
    title: "Student Loan Calculator | Inform Readers",
    description:
      "Project monthly payments and total cost of your student loans based on loan terms and interest.",
  },
  "take-home-paycheck-calculator": {
    title: "Take-Home Paycheck Calculator | Inform Readers",
    description: "Estimate your net paycheck after taxes and deductions using this take-home pay calculator.",
  },
  "uk-mortgage-calculator": {
    title: "UK Mortgage Calculator | Inform Readers",
    description:
      "Calculate mortgage payments and costs specific to the UK housing market and interest rates.",
  },
  "va-mortgage-calculator": {
    title: "VA Mortgage Calculator | Inform Readers",
    description: "Estimate monthly mortgage payments for VA loans with zero down payment options.",
  },
  "vat-calculator": {
    title: "VAT Calculator | Inform Readers",
    description: "Calculate Value-Added Tax (VAT) for purchases and services with customizable tax rates.",
  },
};

export const pdfToolMetaData = {
  "add-page-number-to-pdf": {
    title: "Add Page Numbers to PDF | Inform Readers",
    description:
      "Easily insert page numbers into your PDF documents for organized reading and professional formatting.",
  },
  "bmp-to-pdf-converter": {
    title: "BMP to PDF Converter | Inform Readers",
    description: "Convert BMP image files into high-quality PDFs instantly with our user-friendly tool.",
  },
  "compress-pdf-tool": {
    title: "Compress PDF Tool | Inform Readers",
    description:
      "Reduce the file size of your PDFs without sacrificing quality for faster sharing and uploading.",
  },
  "excel-to-pdf-tool": {
    title: "Excel to PDF Tool | Inform Readers",
    description: "Convert your Excel spreadsheets to PDF format quickly and accurately for easy sharing.",
  },
  "extract-from-pdf": {
    title: "Extract from PDF Tool | Inform Readers",
    description:
      "Pull text, images, or specific content from PDF files effortlessly with our extraction tool.",
  },
  "extract-pdf-pages-tool": {
    title: "Extract PDF Pages Tool | Inform Readers",
    description: "Select and extract specific pages from a PDF file into a new document with ease.",
  },
  "high-resolution-tiff-to-pdf-converter": {
    title: "High Resolution TIFF to PDF Converter | Inform Readers",
    description: "Convert high-quality TIFF images into PDFs while preserving clarity and resolution.",
  },
  "jpg-to-pdf-converter": {
    title: "JPG to PDF Converter | Inform Readers",
    description: "Quickly convert JPG images into a single or multi-page PDF with our efficient converter.",
  },
  "merge-pdf-tool": {
    title: "Merge PDF Tool | Inform Readers",
    description: "Combine multiple PDF documents into one seamless file using our intuitive PDF merger.",
  },
  "organize-pdf-tool": {
    title: "Organize PDF Tool | Inform Readers",
    description: "Rearrange, rotate, or delete PDF pages to structure your document exactly how you want it.",
  },
  "pdf-to-bmp-converter": {
    title: "PDF to BMP Converter | Inform Readers",
    description: "Convert your PDF pages to BMP image format for editing, storage, or printing needs.",
  },
  "pdf-to-csv": {
    title: "PDF to CSV Converter | Inform Readers",
    description: "Extract tabular data from PDF files and convert it into editable CSV spreadsheets.",
  },
  "pdf-to-jpg-converter": {
    title: "PDF to JPG Converter | Inform Readers",
    description: "Turn your PDF pages into JPG image files in just a few clicks with this quick tool.",
  },
  "pdf-to-png-converter": {
    title: "PDF to PNG Converter | Inform Readers",
    description: "Convert PDF documents to PNG format for sharing, editing, or archiving.",
  },
  "pdf-to-ppt": {
    title: "PDF to PPT Converter | Inform Readers",
    description: "Transform PDF documents into PowerPoint presentations while maintaining formatting.",
  },
  "pdf-to-tiff-converter": {
    title: "PDF to TIFF Converter | Inform Readers",
    description: "Convert PDF pages to TIFF image format for high-resolution printing or storage.",
  },
  "pdf-to-txt-tool": {
    title: "PDF to TXT Tool | Inform Readers",
    description: "Extract plain text from PDF documents for editing, analysis, or storage purposes.",
  },
  "pdf-to-word": {
    title: "PDF to Word Converter | Inform Readers",
    description: "Convert your PDFs into editable Microsoft Word documents in seconds with great accuracy.",
  },
  "pdf-to-zip-converter": {
    title: "PDF to ZIP Converter | Inform Readers",
    description: "Bundle your PDF files into a ZIP archive for easy sharing and compressed storage.",
  },
  "png-to-pdf-converter": {
    title: "PNG to PDF Converter | Inform Readers",
    description: "Convert PNG images to PDF documents while preserving image quality and layout.",
  },
  "powerpoint-to-pdf-converter": {
    title: "PowerPoint to PDF Converter | Inform Readers",
    description: "Convert PowerPoint presentations (.ppt/.pptx) into easy-to-share PDF files instantly.",
  },
  "remove-pages-tool": {
    title: "Remove PDF Pages Tool | Inform Readers",
    description: "Delete unwanted pages from your PDF documents quickly and cleanly.",
  },
  "repair-pdf-tool": {
    title: "Repair PDF Tool | Inform Readers",
    description: "Fix corrupted or damaged PDF files and recover readable content automatically.",
  },
  "rotate-pdf-tool": {
    title: "Rotate PDF Tool | Inform Readers",
    description: "Easily rotate individual or all pages in your PDF to the desired orientation.",
  },
  "txt-to-pdf-tool": {
    title: "TXT to PDF Tool | Inform Readers",
    description: "Convert plain text files (.txt) into properly formatted PDF documents with ease.",
  },
  "word-to-pdf-converter": {
    title: "Word to PDF Converter | Inform Readers",
    description: "Transform Microsoft Word documents into PDF format for universal sharing and printing.",
  },
};

export const otherToolMetaData = {
  "angle-converter": {
    title: "Angle Converter – Degrees, Radians & Grads",
    description:
      "Quickly convert angles between degrees, radians, and grads using this comprehensive angle converter tool.",
  },
  "degrees-to-radians": {
    title: "Degrees to Radians Converter",
    description:
      "Convert degrees to radians easily with this fast and accurate degrees-to-radians converter.",
  },
  "radians-to-degrees": {
    title: "Radians to Degrees Converter",
    description: "Convert radians to degrees quickly using this simple and efficient angle converter.",
  },
  "area-converter": {
    title: "Area Converter – Convert Between Units",
    description:
      "Easily convert area units like square feet, square meters, acres, hectares, and more with this area converter.",
  },
  "acres-to-hectare": {
    title: "Acres to Hectare Converter",
    description:
      "Convert acres to hectares quickly and accurately with our user-friendly area conversion tool.",
  },
  "acres-to-square-feet": {
    title: "Acres to Square Feet Converter",
    description: "Easily convert acres to square feet with our fast and accurate converter.",
  },
  "acres-to-square-miles": {
    title: "Acres to Square Miles Converter",
    description: "Convert acres to square miles using this simple and efficient tool.",
  },
  "hectare-to-acres": {
    title: "Hectare to Acres Converter",
    description: "Convert hectares to acres instantly with our easy-to-use area converter.",
  },
  "square-feet-to-acres": {
    title: "Square Feet to Acres Converter",
    description: "Convert square feet to acres quickly and get accurate results in real-time.",
  },
  "square-feet-to-square-meter": {
    title: "Square Feet to Square Meter Converter",
    description: "Use this tool to convert square feet to square meters easily and accurately.",
  },
  "square-feet-to-square-yards": {
    title: "Square Feet to Square Yards Converter",
    description: "Convert square feet to square yards instantly with our efficient area converter.",
  },
  "square-meter-to-square-feet": {
    title: "Square Meter to Square Feet Converter",
    description: "Quickly convert square meters to square feet using this powerful tool.",
  },
  "square-miles-to-acres": {
    title: "Square Miles to Acres Converter",
    description: "Convert square miles to acres with high precision using our conversion tool.",
  },
  "square-yards-to-square-feet": {
    title: "Square Yards to Square Feet Converter",
    description: "Convert square yards to square feet instantly and accurately.",
  },
  "case-converter": {
    title: "Case Converter Tool – Uppercase, Lowercase, Title Case",
    description:
      "Easily convert text between uppercase, lowercase, sentence case, and more with our Case Converter Tool.",
  },
  "charge-converter": {
    title: "Charge Converter – Convert Electric Charge Units",
    description:
      "Convert between units of electric charge such as coulombs, milliamp-hours, and more with our Charge Converter.",
  },
  "concentration-molar-converter": {
    title: "Molar Concentration Converter – Convert Molarity Units",
    description:
      "Easily convert between different molar concentration units such as mol/L, mmol/L, and more.",
  },
  "concentration-solution-converter": {
    title: "Solution Concentration Converter – Percentage, ppm, ppb",
    description:
      "Convert solution concentration units like % w/w, ppm, ppb, and molarity using this comprehensive tool.",
  },
  "amps-to-milliamps-converter": {
    title: "Amps to Milliamps Converter",
    description:
      "Convert amperes (amps) to milliamperes (mA) quickly with this electrical current conversion tool.",
  },
  "current-converter": {
    title: "Current Converter – Electrical Unit Conversion",
    description: "Convert electrical current units such as amperes, milliamperes, kiloamperes, and more.",
  },
  "milliamps-to-amps-converter": {
    title: "Milliamps to Amps Converter",
    description:
      "Easily convert milliamperes (mA) to amperes (A) with this accurate and fast electrical converter.",
  },
  "data-storage-converter": {
    title: "Data Storage Converter – Convert KB, MB, GB, TB",
    description:
      "Convert digital storage units like kilobytes, megabytes, gigabytes, and terabytes easily with this universal data storage converter.",
  },
  "gb-to-kb": {
    title: "GB to KB Converter",
    description:
      "Convert gigabytes to kilobytes (GB to KB) easily and accurately with this data size calculator.",
  },
  "gb-to-mb": {
    title: "GB to MB Converter",
    description: "Quickly convert gigabytes to megabytes using our easy-to-use GB to MB conversion tool.",
  },
  "gb-to-pb": {
    title: "GB to PB Converter",
    description: "Convert gigabytes to petabytes instantly using our digital storage conversion tool.",
  },
  "gb-to-tb": {
    title: "GB to TB Converter",
    description:
      "Convert gigabytes to terabytes effortlessly with this accurate and simple GB to TB converter.",
  },
  "kb-to-gb": {
    title: "KB to GB Converter",
    description: "Convert kilobytes to gigabytes with our fast and reliable KB to GB conversion calculator.",
  },
  "kb-to-mb": {
    title: "KB to MB Converter",
    description: "Easily convert kilobytes to megabytes using this KB to MB tool with precision.",
  },
  "kb-to-tb": {
    title: "KB to TB Converter",
    description: "Convert kilobytes to terabytes accurately using this online KB to TB data converter.",
  },
  "mb-to-gb": {
    title: "MB to GB Converter",
    description: "Convert megabytes to gigabytes using our MB to GB data converter tool with quick results.",
  },
  "mb-to-kb": {
    title: "MB to KB Converter",
    description: "Convert megabytes to kilobytes (MB to KB) easily using this simple online tool.",
  },
  "mb-to-pb": {
    title: "MB to PB Converter",
    description: "Convert megabytes to petabytes quickly with this efficient MB to PB data conversion tool.",
  },
  "mb-to-tb": {
    title: "MB to TB Converter",
    description: "Convert megabytes to terabytes with ease using this MB to TB conversion calculator.",
  },
  "pb-to-gb": {
    title: "PB to GB Converter",
    description: "Convert petabytes to gigabytes (PB to GB) instantly with our digital storage calculator.",
  },
  "pb-to-mb": {
    title: "PB to MB Converter",
    description: "Easily convert petabytes to megabytes using this accurate PB to MB converter.",
  },
  "pb-to-tb": {
    title: "PB to TB Converter",
    description: "Convert petabytes to terabytes quickly and efficiently with our PB to TB converter tool.",
  },
  "tb-to-gb": {
    title: "TB to GB Converter",
    description: "Convert terabytes to gigabytes easily with our TB to GB digital storage conversion tool.",
  },
  "tb-to-kb": {
    title: "TB to KB Converter",
    description: "Convert terabytes to kilobytes using this simple and fast TB to KB conversion tool.",
  },
  "tb-to-mb": {
    title: "TB to MB Converter",
    description: "Convert terabytes to megabytes quickly and accurately with our TB to MB converter.",
  },
  "tb-to-pb": {
    title: "TB to PB Converter",
    description: "Easily convert terabytes to petabytes using this efficient TB to PB data size converter.",
  },
  // Data Transfer
  "data-transfer-converter": {
    title: "Data Transfer Converter – Mbps, MB/s, GBps & More",
    description:
      "Convert data transfer units such as Mbps, MB/s, GBps, and more using this quick and accurate data transfer converter.",
  },

  // Digital Image
  "digital-image-resolution-converter": {
    title: "Digital Image Resolution Converter – DPI, PPI & More",
    description:
      "Easily convert digital image resolutions between DPI, PPI, pixels per cm, and other formats with this resolution converter.",
  },

  // Electric Converters
  "electric-conductance-converter": {
    title: "Electric Conductance Converter",
    description:
      "Convert electric conductance between Siemens, mS, μS and more with this precise conductance converter tool.",
  },
  "electric-conductivity-converter": {
    title: "Electric Conductivity Converter",
    description: "Convert electric conductivity units with ease using this practical and accurate tool.",
  },
  "electric-field-strength-converter": {
    title: "Electric Field Strength Converter",
    description: "Convert electric field strength between volts per meter and other units effortlessly.",
  },
  "electric-potential-converter": {
    title: "Electric Potential Converter",
    description: "Use this tool to convert electric potential between volts, millivolts, and kilovolts.",
  },
  "electric-resistance-converter": {
    title: "Electric Resistance Converter",
    description: "Convert resistance values between ohms, kiloohms, and megaohms accurately.",
  },
  "electric-resistivity-converter": {
    title: "Electric Resistivity Converter",
    description:
      "Accurately convert resistivity values using various scientific units including ohm-meters and ohm-centimeters.",
  },
  "electrostatic-capacitance-converter": {
    title: "Electrostatic Capacitance Converter",
    description:
      "Convert electrostatic capacitance between farads, microfarads, nanofarads, and picofarads easily.",
  },

  // Energy Converters
  "energy-converter": {
    title: "Energy Converter – Joules, Calories, Kilojoules",
    description:
      "Convert energy units like joules, calories, kilojoules, and more using this all-in-one energy conversion tool.",
  },
  "cal-to-j": {
    title: "Cal to J Converter – Calories to Joules",
    description: "Quickly convert calories (cal) to joules (J) using this precise and simple tool.",
  },
  "cal-to-kcal": {
    title: "Cal to Kcal Converter – Calories to Kilocalories",
    description: "Convert calories to kilocalories instantly with this easy-to-use converter.",
  },
  "ftlb-to-nm": {
    title: "Foot-pounds to Newton-meters Converter",
    description: "Convert foot-pounds (ft·lb) to newton-meters (Nm) quickly and accurately.",
  },
  "j-to-cal": {
    title: "Joules to Calories Converter",
    description: "Easily convert energy from joules to calories using this fast conversion tool.",
  },
  "j-to-kj": {
    title: "Joules to Kilojoules Converter",
    description: "Convert joules (J) to kilojoules (kJ) quickly with this accurate tool.",
  },
  "kcal-to-cal": {
    title: "Kilocalories to Calories Converter",
    description: "Easily convert kcal to cal for energy, nutrition, and physics calculations.",
  },
  "kcal-to-kj": {
    title: "Kilocalories to Kilojoules Converter",
    description: "Convert kilocalories to kilojoules with this simple and precise tool.",
  },
  "kj-to-j": {
    title: "Kilojoules to Joules Converter",
    description: "Convert kilojoules (kJ) to joules (J) instantly and accurately.",
  },
  "kj-to-kcal": {
    title: "Kilojoules to Kilocalories Converter",
    description: "Quickly convert energy from kilojoules to kilocalories with this easy converter.",
  },
  "nm-to-ftlb": {
    title: "Newton-meters to Foot-pounds Converter",
    description: "Convert Nm to ft·lb quickly for torque, engineering, and mechanical uses.",
  },
  // Flow - Mass / Flow Converters
  "flow-mass-converter": {
    title: "Mass Flow Converter – Convert Mass Flow Rates",
    description:
      "Convert mass flow rate units such as kg/s, g/s, lb/min, and more with this accurate mass flow converter.",
  },
  "flow-converter": {
    title: "Flow Converter – Volume and Mass Flow",
    description:
      "Easily convert between various flow units including volume and mass flow using this efficient tool.",
  },

  // Force Converter
  "force-converter": {
    title: "Force Converter – Newtons, kgf, lbf & More",
    description:
      "Convert force units including newtons, kilogram-force, pound-force and more with this accurate converter.",
  },
  "kg-to-newtons": {
    title: "Kilograms to Newtons Converter",
    description:
      "Convert mass in kilograms (kg) to force in newtons (N) using this fast and reliable converter.",
  },
  "lbs-to-newtons": {
    title: "Pounds to Newtons Converter",
    description: "Convert pounds-force (lbf) to newtons (N) with ease using this simple converter.",
  },
  "newtons-to-kg": {
    title: "Newtons to Kilograms Converter",
    description: "Convert force in newtons to mass in kilograms using this efficient tool.",
  },
  "newtons-to-lbs": {
    title: "Newtons to Pounds Converter",
    description:
      "Quickly convert force from newtons (N) to pounds-force (lbf) with this accurate calculator.",
  },

  // Frequency Wavelength
  "frequency-wavelength-converter": {
    title: "Frequency-Wavelength Converter",
    description:
      "Convert between frequency and wavelength for electromagnetic waves using this practical tool.",
  },

  // Heat Converters
  "heat-density-converter": {
    title: "Heat Density Converter",
    description:
      "Convert between units of heat density such as J/m³, BTU/ft³ and more using this specialized converter.",
  },
  "heat-flux-density-converter": {
    title: "Heat Flux Density Converter",
    description: "Accurately convert heat flux density between W/m², BTU/hr·ft², and more with this tool.",
  },
  "heat-transfer-coefficient-converter": {
    title: "Heat Transfer Coefficient Converter",
    description: "Convert heat transfer coefficient values easily between W/m²·K, BTU/hr·ft²·°F, and more.",
  },

  // Illumination Converter
  illumination_converter: {
    title: "Illumination Converter – Lux, Foot-candle & More",
    description:
      "Convert illumination units such as lux and foot-candles using this lighting intensity converter.",
  },

  // Inductance Converter
  "inductance-converter": {
    title: "Inductance Converter – Henry, mH, μH & More",
    description:
      "Convert inductance units including henry (H), millihenry (mH), and microhenry (μH) using this precise tool.",
  },
  "cm-to-feet": {
    title: "Centimeters to Feet Converter",
    description: "Convert centimeters to feet quickly and accurately using this simple tool.",
  },
  "cm-to-inches": {
    title: "Centimeters to Inches Converter",
    description: "Easily convert centimeters to inches for fast measurement conversions.",
  },
  "cm-to-km": {
    title: "Centimeters to Kilometers Converter",
    description: "Convert centimeters to kilometers easily using our online tool.",
  },
  "cm-to-m": {
    title: "Centimeters to Meters Converter",
    description: "Convert cm to meters quickly and accurately.",
  },
  "cm-to-mm": {
    title: "Centimeters to Millimeters Converter",
    description: "Use this tool to convert centimeters to millimeters instantly.",
  },
  "feet-to-cm": {
    title: "Feet to Centimeters Converter",
    description: "Convert feet to centimeters using our quick and easy converter.",
  },
  "feet-to-inches": {
    title: "Feet to Inches Converter",
    description: "Easily convert feet to inches with this fast and accurate tool.",
  },
  "feet-to-meters": {
    title: "Feet to Meters Converter",
    description: "Convert feet to meters instantly using this reliable tool.",
  },
  "feet-to-miles": {
    title: "Feet to Miles Converter",
    description: "Convert feet to miles quickly with our user-friendly tool.",
  },
  "feet-to-mm": {
    title: "Feet to Millimeters Converter",
    description: "Convert feet to millimeters easily and accurately.",
  },
  "feet-to-yards": {
    title: "Feet to Yards Converter",
    description: "Quickly convert feet to yards using our simple calculator.",
  },
  "inches-to-cm": {
    title: "Inches to Centimeters Converter",
    description: "Convert inches to centimeters easily with this simple and efficient tool.",
  },
  "inches-to-feet": {
    title: "Inches to Feet Converter",
    description: "Quickly convert inches to feet with our reliable conversion calculator.",
  },
  "inches-to-meters": {
    title: "Inches to Meters Converter",
    description: "Accurate conversion from inches to meters made easy.",
  },
  "inches-to-mm": {
    title: "Inches to Millimeters Converter",
    description: "Instantly convert inches to millimeters online.",
  },
  "inches-to-yards": {
    title: "Inches to Yards Converter",
    description: "Easily convert inches to yards with precision.",
  },
  "km-to-cm": {
    title: "Kilometers to Centimeters Converter",
    description: "Convert kilometers to centimeters fast and effortlessly.",
  },
  "km-to-m": {
    title: "Kilometers to Meters Converter",
    description: "Get accurate conversions from kilometers to meters.",
  },
  "km-to-miles": {
    title: "Kilometers to Miles Converter",
    description: "Easily convert kilometers to miles with this calculator.",
  },
  "m-to-cm": {
    title: "Meters to Centimeters Converter",
    description: "Simple tool for converting meters to centimeters.",
  },
  "m-to-km": {
    title: "Meters to Kilometers Converter",
    description: "Convert meters to kilometers instantly.",
  },
  "m-to-mm": {
    title: "Meters to Millimeters Converter",
    description: "Quickly convert meters to millimeters online.",
  },
  "meters-to-feet": {
    title: "Meters to Feet Converter",
    description: "Fast and accurate conversion from meters to feet.",
  },
  "meters-to-inches": {
    title: "Meters to Inches Converter",
    description: "Convert meters to inches quickly with this handy tool.",
  },
  "meters-to-miles": {
    title: "Meters to Miles Converter",
    description: "Easily convert meters to miles using our online calculator.",
  },
  "meters-to-yards": {
    title: "Meters to Yards Converter",
    description: "Get quick results converting meters to yards.",
  },
  "miles-to-feet": {
    title: "Miles to Feet Converter",
    description: "Convert miles to feet instantly and accurately.",
  },
  "miles-to-km": {
    title: "Miles to Kilometers Converter",
    description: "Quick conversion from miles to kilometers.",
  },
  "miles-to-meters": {
    title: "Miles to Meters Converter",
    description: "Easily convert miles to meters with precision.",
  },
  "miles-to-yards": {
    title: "Miles to Yards Converter",
    description: "Fast tool to convert miles into yards accurately.",
  },
  "mm-to-cm": {
    title: "Millimeters to Centimeters Converter",
    description: "Simple tool for converting millimeters to centimeters.",
  },
  "mm-to-feet": {
    title: "Millimeters to Feet Converter",
    description: "Accurate conversion from millimeters to feet.",
  },
  "mm-to-inches": {
    title: "Millimeters to Inches Converter",
    description: "Quickly convert millimeters to inches online.",
  },
  "mm-to-m": {
    title: "Millimeters to Meters Converter",
    description: "Easily convert mm to meters with this calculator.",
  },
  "yards-to-feet": {
    title: "Yards to Feet Converter",
    description: "Fast and accurate conversion from yards to feet.",
  },
  "yards-to-inches": {
    title: "Yards to Inches Converter",
    description: "Convert yards to inches quickly with our tool.",
  },
  "yards-to-meters": {
    title: "Yards to Meters Converter",
    description: "Easily convert yards to meters online.",
  },
  "yards-to-miles": {
    title: "Yards to Miles Converter",
    description: "Accurate and fast conversion from yards to miles.",
  },
  "linear-charge-density-converter": {
    title: "Linear Charge Density Converter",
    description: "Convert linear charge density units quickly and accurately using this tool.",
  },
  "linear-current-density-converter": {
    title: "Linear Current Density Converter",
    description: "Easily convert linear current density units with this efficient converter.",
  },
  "luminance-converter": {
    title: "Luminance Converter",
    description: "Convert luminance values across various units instantly.",
  },
  "luminous-intensity-converter": {
    title: "Luminous Intensity Converter",
    description: "Quickly convert luminous intensity between candela, millicandela, and more.",
  },
  "magnetic-field-strength-converter": {
    title: "Magnetic Field Strength Converter",
    description: "Convert magnetic field strength units like ampere per meter and oersted easily.",
  },
  "magnetic-flux-converter": {
    title: "Magnetic Flux Converter",
    description: "Quickly convert magnetic flux units such as weber and maxwell.",
  },
  "magnetic-flux-density-converter": {
    title: "Magnetic Flux Density Converter",
    description: "Convert magnetic flux density units like tesla and gauss with precision.",
  },
  "magnetomotive-force-converter": {
    title: "Magnetomotive Force Converter",
    description: "Convert magnetomotive force units easily and accurately.",
  },
  "mass-flux-density-converter": {
    title: "Mass Flux Density Converter",
    description: "Instantly convert mass flux density values across different units.",
  },
  "binary-to-decimal": {
    title: "Binary to Decimal Converter",
    description: "Convert binary numbers to decimal values quickly and accurately.",
  },
  "binary-to-hex": {
    title: "Binary to Hex Converter",
    description: "Easily convert binary numbers to hexadecimal format.",
  },
  "decimal-to-binary": {
    title: "Decimal to Binary Converter",
    description: "Convert decimal numbers to binary using this fast converter.",
  },
  "decimal-to-hex": {
    title: "Decimal to Hex Converter",
    description: "Convert decimal numbers to hexadecimal values instantly.",
  },
  "hex-to-binary": {
    title: "Hex to Binary Converter",
    description: "Convert hexadecimal values to binary quickly and precisely.",
  },
  "hex-to-decimal": {
    title: "Hex to Decimal Converter",
    description: "Easily convert hex values to decimal numbers.",
  },
  "numbers-converter": {
    title: "Number System Converter",
    description: "Convert between binary, decimal, and hexadecimal number systems.",
  },
  "permeability-converter": {
    title: "Permeability Converter",
    description: "Convert permeability values between various units such as henry per meter.",
  },
  "btu-to-ton": {
    title: "BTU to Ton Converter",
    description: "Convert BTU/hr to refrigeration tons quickly and accurately.",
  },
  "hp-to-kw": {
    title: "Horsepower to Kilowatts Converter",
    description: "Convert horsepower (HP) to kilowatts (kW) easily.",
  },
  "hp-to-watts": {
    title: "Horsepower to Watts Converter",
    description: "Convert horsepower to watts instantly using this tool.",
  },
  "kw-to-hp": {
    title: "Kilowatts to Horsepower Converter",
    description: "Convert kilowatts to horsepower efficiently and accurately.",
  },
  "power-converter": {
    title: "Power Converter Tool",
    description: "Convert between different power units like watts, HP, BTU, and more.",
  },
  "ton-to-btu": {
    title: "Ton to BTU Converter",
    description: "Convert tons of refrigeration to BTU/hr quickly.",
  },
  "watts-to-hp": {
    title: "Watts to Horsepower Converter",
    description: "Convert watts to horsepower using this reliable power unit converter.",
  },
  "prefixes-converter": {
    title: "Prefixes Converter",
    description: "Convert between metric prefixes such as kilo, mega, milli, and more.",
  },
  "bar-to-psi": {
    title: "Bar to PSI Converter",
    description: "Convert bar pressure units to pounds per square inch (PSI) quickly.",
  },
  "kpa-to-psi": {
    title: "KPA to PSI Converter",
    description: "Convert kilopascals (kPa) to PSI using this fast and accurate tool.",
  },
  "pressure-converter": {
    title: "Pressure Unit Converter",
    description: "Convert between different pressure units like bar, PSI, Pa, and kPa easily.",
  },
  "psi-to-bar": {
    title: "PSI to Bar Converter",
    description: "Easily convert PSI (pounds per square inch) to bar units.",
  },
  "psi-to-kpa": {
    title: "PSI to KPA Converter",
    description: "Convert PSI values to kilopascals (kPa) with this quick converter.",
  },
  "radiation-converter": {
    title: "Radiation Unit Converter",
    description: "Convert between various radiation measurement units accurately.",
  },
  "radiation-absorbed-dose-converter": {
    title: "Radiation Absorbed Dose Converter",
    description: "Convert radiation absorbed dose units like gray and rad quickly.",
  },
  "radiation-activity-converter": {
    title: "Radiation Activity Converter",
    description: "Easily convert between becquerel (Bq) and curie (Ci) activity units.",
  },
  "radiation-exposure-converter": {
    title: "Radiation Exposure Converter",
    description: "Convert radiation exposure units such as roentgen, coulomb/kg, and more.",
  },
  "sound-converter": {
    title: "Sound Unit Converter",
    description: "Convert sound measurements such as decibels, sound pressure, and intensity effortlessly.",
  },
  "specific-heat-capacity-converter": {
    title: "Specific Heat Capacity Converter",
    description: "Convert specific heat capacity units between J/kg·K, cal/g·°C, and more.",
  },
  "fps-to-mph": {
    title: "FPS to MPH Converter",
    description: "Convert feet per second (FPS) to miles per hour (MPH) with ease.",
  },
  "knot-to-mph": {
    title: "Knots to MPH Converter",
    description: "Convert knots to miles per hour (MPH) using this simple tool.",
  },
  "kph-to-mph": {
    title: "KPH to MPH Converter",
    description: "Easily convert kilometers per hour (KPH) to miles per hour (MPH).",
  },
  "mph-to-fps": {
    title: "MPH to FPS Converter",
    description: "Convert miles per hour (MPH) to feet per second (FPS) quickly.",
  },
  "mph-to-knot": {
    title: "MPH to Knots Converter",
    description: "Convert miles per hour (MPH) to knots efficiently.",
  },
  "mph-to-kph": {
    title: "MPH to KPH Converter",
    description: "Convert miles per hour (MPH) to kilometers per hour (KPH) easily.",
  },
  "mph-to-mps": {
    title: "MPH to MPS Converter",
    description: "Convert miles per hour (MPH) to meters per second (MPS) accurately.",
  },
  "mps-to-kph": {
    title: "MPS to KPH Converter",
    description: "Convert meters per second (MPS) to kilometers per hour (KPH).",
  },
  "mps-to-mph": {
    title: "MPS to MPH Converter",
    description: "Convert meters per second (MPS) to miles per hour (MPH).",
  },
  "speed-converter": {
    title: "Speed Converter",
    description: "Convert between different speed units like MPH, KPH, knots, and more.",
  },
  "surface-charge-density-converter": {
    title: "Surface Charge Density Converter",
    description: "Convert between different surface charge density units easily and accurately.",
  },
  "surface-current-density-converter": {
    title: "Surface Current Density Converter",
    description: "Convert surface current density units in a few clicks.",
  },
  "surface-tension-converter": {
    title: "Surface Tension Converter",
    description: "Convert between surface tension units like N/m, dyn/cm, and more.",
  },
  "celsius-to-fahrenheit": {
    title: "Celsius to Fahrenheit Converter",
    description: "Convert Celsius to Fahrenheit instantly and accurately.",
  },
  "celsius-to-kelvin": {
    title: "Celsius to Kelvin Converter",
    description: "Easily convert Celsius to Kelvin using this tool.",
  },
  "fahrenheit-to-celsius": {
    title: "Fahrenheit to Celsius Converter",
    description: "Quickly convert Fahrenheit to Celsius with precision.",
  },
  "fahrenheit-to-kelvin": {
    title: "Fahrenheit to Kelvin Converter",
    description: "Convert Fahrenheit to Kelvin in just a few clicks.",
  },
  "kelvin-to-celsius": {
    title: "Kelvin to Celsius Converter",
    description: "Convert Kelvin to Celsius quickly and easily.",
  },
  "kelvin-to-fahrenheit": {
    title: "Kelvin to Fahrenheit Converter",
    description: "Convert Kelvin to Fahrenheit in an instant.",
  },
  "temperature-converter": {
    title: "Temperature Converter",
    description: "Convert between Celsius, Fahrenheit, Kelvin and other units.",
  },
  "temperature-interval-converter": {
    title: "Temperature Interval Converter",
    description: "Convert temperature differences between units like K, °C, and °F.",
  },
  "thermal-conductivity-converter": {
    title: "Thermal Conductivity Converter",
    description: "Convert between thermal conductivity units such as W/m·K and BTU/hr·ft·°F.",
  },
  "thermal-expansion-converter": {
    title: "Thermal Expansion Converter",
    description: "Convert thermal expansion coefficients across various units.",
  },
  "thermal-resistance-converter": {
    title: "Thermal Resistance Converter",
    description: "Convert between different units of thermal resistance easily.",
  },
  "days-to-hours": {
    title: "Days to Hours Converter",
    description: "Easily convert days to hours with this efficient time conversion tool.",
  },
  "days-to-minutes": {
    title: "Days to Minutes Converter",
    description: "Convert days into minutes instantly and accurately.",
  },
  "days-to-months": {
    title: "Days to Months Converter",
    description: "Quickly convert days to months with this simple tool.",
  },
  "days-to-seconds": {
    title: "Days to Seconds Converter",
    description: "Instantly convert days into seconds for accurate time calculations.",
  },
  "days-to-years": {
    title: "Days to Years Converter",
    description: "Convert days into years quickly with this helpful time tool.",
  },
  "hours-to-days": {
    title: "Hours to Days Converter",
    description: "Convert hours to days efficiently and accurately.",
  },
  "hours-to-minutes": {
    title: "Hours to Minutes Converter",
    description: "Easily convert hours into minutes with our online tool.",
  },
  "milliseconds-to-seconds": {
    title: "Milliseconds to Seconds Converter",
    description: "Convert milliseconds to seconds instantly and accurately.",
  },
  "minutes-to-days": {
    title: "Minutes to Days Converter",
    description: "Quickly convert minutes to days using this calculator.",
  },
  "minutes-to-hours": {
    title: "Minutes to Hours Converter",
    description: "Convert minutes to hours instantly and with precision.",
  },
  "minutes-to-seconds": {
    title: "Minutes to Seconds Converter",
    description: "Easily convert minutes into seconds for fast time conversion.",
  },
  "months-to-days": {
    title: "Months to Days Converter",
    description: "Convert months into days accurately using this time tool.",
  },
  "seconds-to-days": {
    title: "Seconds to Days Converter",
    description: "Convert seconds into days with this easy-to-use converter.",
  },
  "seconds-to-milliseconds": {
    title: "Seconds to Milliseconds Converter",
    description: "Instantly convert seconds to milliseconds for accurate timing.",
  },
  "seconds-to-minutes": {
    title: "Seconds to Minutes Converter",
    description: "Quickly convert seconds to minutes using this handy tool.",
  },
  "time-converter": {
    title: "Time Converter",
    description:
      "Convert between hours, days, seconds, months, and more using this all-in-one time converter.",
  },
  "years-to-days": {
    title: "Years to Days Converter",
    description: "Convert years into days quickly with this precise calculator.",
  },
  "typography-converter": {
    title: "Typography Converter",
    description: "Convert between points, pixels, ems, rems, and more using this typography unit converter.",
  },
  "volume-dry-converter": {
    title: "Volume Dry Converter",
    description: "Convert between dry volume units like dry pints, quarts, and more.",
  },
  "volume-lumber-converter": {
    title: "Volume Lumber Converter",
    description: "Convert between lumber volume units like board feet, cubic meters, etc.",
  },
  "volume-charge-density-converter": {
    title: "Volume Charge Density Converter",
    description: "Easily convert units of charge per unit volume using this tool.",
  },
  "cc-to-ml": {
    title: "CC to ML Converter",
    description: "Convert cubic centimeters (cc) to milliliters (ml) instantly.",
  },
  "cc-to-oz": {
    title: "CC to Ounces Converter",
    description: "Quickly convert cc to fluid ounces using this reliable converter.",
  },
  "cubic-feet-to-cubic-yards": {
    title: "Cubic Feet to Cubic Yards Converter",
    description: "Convert cubic feet to cubic yards accurately with this simple tool.",
  },
  "cubic-feet-to-gallon": {
    title: "Cubic Feet to Gallons Converter",
    description: "Convert cubic feet to gallons with ease using our tool.",
  },
  "cubic-inches-to-gallons": {
    title: "Cubic Inches to Gallons Converter",
    description: "Easily convert cubic inches to gallons using this converter.",
  },
  "cubic-inches-to-liters": {
    title: "Cubic Inches to Liters Converter",
    description: "Quickly convert cubic inches into liters using this handy tool.",
  },
  "cubic-yards-to-cubic-feet": {
    title: "Cubic Yards to Cubic Feet Converter",
    description: "Convert cubic yards to cubic feet accurately and easily.",
  },
  "cups-to-gallon": {
    title: "Cups to Gallon Converter",
    description: "Convert cups to gallons quickly with this efficient converter.",
  },
  "cups-to-liters": {
    title: "Cups to Liters Converter",
    description: "Easily convert cups to liters with precision.",
  },
  "cups-to-ml": {
    title: "Cups to Milliliters Converter",
    description: "Convert cups to ml instantly using this online tool.",
  },
  "cups-to-pint": {
    title: "Cups to Pints Converter",
    description: "Quickly convert cups into pints for kitchen or lab use.",
  },
  "cups-to-quart": {
    title: "Cups to Quarts Converter",
    description: "Convert cups to quarts easily with this helpful converter.",
  },
  "cups-to-tablespoons": {
    title: "Cups to Tablespoons Converter",
    description: "Convert cups to tablespoons quickly for cooking or measurements.",
  },
  "gallon-to-cubic-feet": {
    title: "Gallon to Cubic Feet Converter",
    description: "Convert gallons into cubic feet accurately and instantly.",
  },
  "gallon-to-cups": {
    title: "Gallon to Cups Converter",
    description: "Easily convert gallons into cups with this precise tool.",
  },
  "gallon-to-ml": {
    title: "Gallon to Milliliters Converter",
    description: "Convert gallons to ml with this fast and accurate converter.",
  },
  "gallon-to-pints": {
    title: "Gallon to Pints Converter",
    description: "Quickly convert gallons to pints for fluid volume measurement.",
  },
  "gallon-to-quart": {
    title: "Gallon to Quarts Converter",
    description: "Convert gallons to quarts instantly and reliably.",
  },
  "gallons-to-cubic-inches": {
    title: "Gallons to Cubic Inches Converter",
    description: "Easily convert gallons to cubic inches using this tool.",
  },
  "gallons-to-liters": {
    title: "Gallons to Liters Converter",
    description: "Convert gallons to liters accurately and quickly.",
  },
  "l-to-ml": {
    title: "Liters to Milliliters Converter",
    description: "Convert liters into milliliters quickly using this tool.",
  },
  "liter-to-ounces": {
    title: "Liter to Ounces Converter",
    description: "Convert liters to fluid ounces accurately for various needs.",
  },
  "liters-to-cubic-inches": {
    title: "Liters to Cubic Inches Converter",
    description: "Convert liters to cubic inches quickly and accurately.",
  },
  "liters-to-cups": {
    title: "Liters to Cups Converter",
    description: "Easily convert liters into US cups with this tool.",
  },
  "liters-to-gallons": {
    title: "Liters to Gallons Converter",
    description: "Convert liters to US gallons with precise results.",
  },
  "liters-to-pints": {
    title: "Liters to Pints Converter",
    description: "Quickly convert liters to pints using our online converter.",
  },
  "liters-to-quarts": {
    title: "Liters to Quarts Converter",
    description: "Convert liters into quarts with this simple tool.",
  },
  "ml-to-cc": {
    title: "Milliliters to Cubic Centimeters Converter",
    description: "Convert ml to cc instantly and accurately.",
  },
  "ml-to-cups": {
    title: "Milliliters to Cups Converter",
    description: "Convert ml to US cups quickly and easily.",
  },
  "ml-to-gallon": {
    title: "Milliliters to Gallon Converter",
    description: "Convert milliliters into US gallons efficiently.",
  },
  "ml-to-l": {
    title: "Milliliters to Liters Converter",
    description: "Quickly convert ml to liters for accurate volume conversion.",
  },
  "ml-to-pint": {
    title: "Milliliters to Pints Converter",
    description: "Convert ml to pints using this reliable tool.",
  },
  "ml-to-teaspoon": {
    title: "Milliliters to Teaspoons Converter",
    description: "Easily convert ml to teaspoons with this handy converter.",
  },
  "ounces-to-liter": {
    title: "Ounces to Liter Converter",
    description: "Convert fluid ounces to liters with precise calculation.",
  },
  "oz-to-cc": {
    title: "Ounces to CC Converter",
    description: "Convert ounces to cubic centimeters easily.",
  },
  "pint-to-cups": {
    title: "Pints to Cups Converter",
    description: "Quickly convert pints to cups with this simple tool.",
  },
  "pint-to-ml": {
    title: "Pints to Milliliters Converter",
    description: "Convert pints to ml easily and accurately.",
  },
  "pints-to-gallon": {
    title: "Pints to Gallon Converter",
    description: "Convert multiple pints to gallons instantly.",
  },
  "pints-to-liters": {
    title: "Pints to Liters Converter",
    description: "Convert pints to liters using this convenient tool.",
  },
  "quart-to-cups": {
    title: "Quarts to Cups Converter",
    description: "Easily convert quarts to cups for quick reference.",
  },
  "quart-to-gallon": {
    title: "Quarts to Gallons Converter",
    description: "Convert quarts to gallons accurately.",
  },
  "quarts-to-liters": {
    title: "Quarts to Liters Converter",
    description: "Convert quarts to liters with fast results.",
  },
  "tablespoons-to-cups": {
    title: "Tablespoons to Cups Converter",
    description: "Convert tablespoons to cups for recipes and measurements.",
  },
  "tablespoons-to-teaspoons": {
    title: "Tablespoons to Teaspoons Converter",
    description: "Convert tablespoons to teaspoons instantly.",
  },
  "teaspoon-to-ml": {
    title: "Teaspoons to Milliliters Converter",
    description: "Convert teaspoons to ml for accurate kitchen conversions.",
  },
  "teaspoons-to-tablespoons": {
    title: "Teaspoons to Tablespoons Converter",
    description: "Quickly convert teaspoons to tablespoons.",
  },
  "volume-converter": {
    title: "Volume Converter",
    description: "Comprehensive volume conversion tool for various units.",
  },
};
