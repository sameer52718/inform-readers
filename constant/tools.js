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
        id: "pdf-to-jpg",
        name: "PDF to JPG",
        path: "/tools/pdf/convert-pdf-to-jpg",
      },
      {
        id: "merge-pdf",
        name: "Merge PDFs",
        path: "/tools/pdf/merge-pdf",
      },
      {
        id: "compress-pdf",
        name: "Compress PDF",
        path: "/tools/pdf/compress-pdf",
      },
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
    ],
  },
  {
    id: "other-tools",
    name: "Other Tools",
    tools: [
      {
        id: "unit-converter",
        name: "Unit Converter",
        path: "/tools/other/unit-converter",
      },
      {
        id: "text-to-speech",
        name: "Text to Speech",
        path: "/tools/other/text-to-speech",
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
};
