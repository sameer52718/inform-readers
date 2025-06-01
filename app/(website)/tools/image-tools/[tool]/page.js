import RemoveWatermark from "@/components/pages/tools/images/remove-watermark";
import { toolMetadata } from "@/constant/tools";
import UpscaleImage from "@/components/pages/tools/images/upscale-image";
import BlurImage from "@/components/pages/tools/images/blur-image";
import ImageToSvg from "@/components/pages/tools/images/image-to-svg";
import ImageHistogram from "@/components/pages/tools/images/image-histogram";
import ImageWatermark from "@/components/pages/tools/images/image-watermark";
import AdjustBrightnessContrast from "@/components/pages/tools/images/adjust-brightness-contrast";
import NoiseReduction from "@/components/pages/tools/images/noise-reduction";
import AdvancedImageCompressor from "@/components/pages/tools/images/advanced-image-compressor";
import ImageToAscii from "@/components/pages/tools/images/image-to-ascii";
// Uncomment and update these imports as you create each component

const toolComponents = {
  "remove-watermark": RemoveWatermark,
  "upscale-image": UpscaleImage,
  "image-to-svg": ImageToSvg,
  "blur-image": BlurImage,
  "image-histogram": ImageHistogram,
  "image-watermark": ImageWatermark,
  "adjust-brightness-contrast": AdjustBrightnessContrast,
  "noise-reduction": NoiseReduction,
  "advanced-image-compressor": AdvancedImageCompressor,
  "image-to-ascii": ImageToAscii,
};

export async function generateMetadata({ params }) {
  const { tool } = params;
  return (
    toolMetadata[tool] || {
      title: "Image Tool Not Found | Inform Readers",
      description: "The requested image tool was not found. Explore other free tools at Inform Readers.",
    }
  );
}

export default function ToolPage({ params }) {
  const { tool } = params;
  const Component = toolComponents[tool] || (() => <div>Tool not found</div>);

  return <Component />;
}
