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
};
