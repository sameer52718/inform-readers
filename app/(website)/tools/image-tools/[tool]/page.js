import { TOOL_CATEGORIES } from "@/constant/tools";
import RemoveWatermark from "@/components/pages/tools/images/remove-watermark";
import UpscaleImage from "@/components/pages/tools/images/upscale-image";
import BlurImage from "@/components/pages/tools/images/blur-image";
import ImageToSvg from "@/components/pages/tools/images/image-to-svg";
import ImageHistogram from "@/components/pages/tools/images/image-histogram";
import ImageWatermark from "@/components/pages/tools/images/image-watermark";
import AdjustBrightnessContrast from "@/components/pages/tools/images/adjust-brightness-contrast";
import NoiseReduction from "@/components/pages/tools/images/noise-reduction";
import AdvancedImageCompressor from "@/components/pages/tools/images/advanced-image-compressor";
import ImageToAscii from "@/components/pages/tools/images/image-to-ascii";
import AddBorder from "@/components/pages/tools/images/add-border";
import AddTextToImage from "@/components/pages/tools/images/add-text-to-image";
import BlackWhiteFilter from "@/components/pages/tools/images/black-white-filter";
import CollageMaker from "@/components/pages/tools/images/collage-maker";
import ColorizePhoto from "@/components/pages/tools/images/colorize-photo";
import CompressImage from "@/components/pages/tools/images/compress-image";
import CropImage from "@/components/pages/tools/images/crop-image";
import HeicToJpg from "@/components/pages/tools/images/heic-to-jpg";
import ImageFormatConverter from "@/components/pages/tools/images/image-format-converter";
import ImageSplitter from "@/components/pages/tools/images/image-splitter";
import ImageToText from "@/components/pages/tools/images/image-to-text";
import PdfToJpg from "@/components/pages/tools/images/pdf-to-jpg";
import PixelateImage from "@/components/pages/tools/images/pixelate-image";
import RemoveBackground from "@/components/pages/tools/images/remove-background";
import ResizeImage from "@/components/pages/tools/images/resize-image";
import RoundImage from "@/components/pages/tools/images/round-image";
import ViewMetadata from "@/components/pages/tools/images/view-metadata";


import { headers } from "next/headers";
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";

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
  "add-border": AddBorder,
  "add-text-to-image": AddTextToImage,
  "black-white-filter": BlackWhiteFilter,
  "collage-maker": CollageMaker,
  "colorize-photo": ColorizePhoto,
  "compress-image": CompressImage,
  "crop-image": CropImage,
  "heic-to-jpg": HeicToJpg,
  "image-format-converter": ImageFormatConverter,
  "image-splitter": ImageSplitter,
  "image-to-text": ImageToText,
  "pdf-to-jpg": PdfToJpg,
  "pixelate-image": PixelateImage,
  "remove-background": RemoveBackground,
  "resize-image": ResizeImage,
  "round-image": RoundImage,
  "view-metadata": ViewMetadata,
};


export async function generateMetadata({ params }) {
  const { tool } = params;

  // Get tool details
  const toolData = TOOL_CATEGORIES.find((item) => item.id === "image-tools")?.tools.find((t) => t.id === tool);
  const toolName = toolData?.name;

  // Get country from host
  const host = (await headers()).get("host") || "informreaders.com";
  const country = getCountryName(getCountryCodeFromHost(host));

  if (!toolName) {
    return {
      title: "Image Tool Not Found | Inform Readers",
      description: "The requested image tool was not found. Explore other free tools at Inform Readers.",
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
  };
}

export default function ToolPage({ params }) {
  const { tool } = params;
  const Component = toolComponents[tool] || (() => <div>Tool not found</div>);

  return <Component />;
}
