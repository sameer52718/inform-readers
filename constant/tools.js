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
        metaTitle: "Convert PDF to JPG Online - Inform Readers",
        metaDescription:
          "Transform PDF files into high-quality JPG images with Inform Readers' free PDF to JPG converter.",
      },
      {
        id: "merge-pdf",
        name: "Merge PDFs",
        path: "/tools/pdf/merge-pdf",
        metaTitle: "Merge PDF Files Online for Free - Inform Readers",
        metaDescription:
          "Combine multiple PDF files into one document easily with Inform Readers' free Merge PDFs tool.",
      },
      {
        id: "compress-pdf",
        name: "Compress PDF",
        path: "/tools/pdf/compress-pdf",
        metaTitle: "Compress PDF Files Online - Inform Readers",
        metaDescription:
          "Reduce PDF file sizes quickly and efficiently with Inform Readers' free PDF Compressor tool.",
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
            id: "force-calculator",
            name: "Force Calculator",
            path: "/tools/calculators/physics/force",
            metaTitle: "Calculate Force Online - Inform Readers",
            metaDescription:
              "Compute force using mass and acceleration with Inform Readers' free Physics Force Calculator.",
          },
          {
            id: "velocity-calculator",
            name: "Velocity Calculator",
            path: "/tools/calculators/physics/velocity",
            metaTitle: "Calculate Velocity Online - Inform Readers",
            metaDescription:
              "Determine velocity quickly with Inform Readers' free Physics Velocity Calculator.",
          },
        ],
      },
      {
        id: "maths-calculators",
        name: "Maths Calculators",
        tools: [
          {
            id: "quadratic-solver",
            name: "Quadratic Solver",
            path: "/tools/calculators/maths/quadratic-solver",
            metaTitle: "Solve Quadratic Equations Online - Inform Readers",
            metaDescription:
              "Solve quadratic equations easily with Inform Readers' free Quadratic Solver tool.",
          },
          {
            id: "percentage-calculator",
            name: "Percentage Calculator",
            path: "/tools/calculators/maths/percentage",
            metaTitle: "Calculate Percentages Online - Inform Readers",
            metaDescription:
              "Compute percentages quickly and accurately with Inform Readers' free Percentage Calculator.",
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
        metaTitle: "Convert Units Online - Inform Readers",
        metaDescription:
          "Convert between various units like length, weight, and more with Inform Readers' free Unit Converter.",
      },
      {
        id: "text-to-speech",
        name: "Text to Speech",
        path: "/tools/other/text-to-speech",
        metaTitle: "Text to Speech Online - Inform Readers",
        metaDescription:
          "Convert text to natural-sounding speech with Inform Readers' free Text to Speech tool.",
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
};
