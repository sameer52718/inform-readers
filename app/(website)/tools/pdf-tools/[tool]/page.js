import { TOOL_CATEGORIES } from "@/constant/tools";

import AddPageNumberToPDF from "@/components/pages/tools/pdf/add-page-number-to-pdf";
import BmpToPDFConverter from "@/components/pages/tools/pdf/bmp-to-pdf-converter";
import CompressPDFTool from "@/components/pages/tools/pdf/compress-pdf-tool";
import ExcelToPDFTool from "@/components/pages/tools/pdf/excel-to-pdf-tool";
import ExtractFromPDF from "@/components/pages/tools/pdf/extract-from-pdf";
import ExtractPDFPagesTool from "@/components/pages/tools/pdf/extract-pdf-pages-tool";
import HighResolutionTiffToPDFConverter from "@/components/pages/tools/pdf/high-resolution-tiff-to-pdf-converter";
import JpgToPDFConverter from "@/components/pages/tools/pdf/jpg-to-pdf-converter";
import MergePDFTool from "@/components/pages/tools/pdf/merge-pdf-tool";
import OrganizePDFTool from "@/components/pages/tools/pdf/organize-pdf-tool";
import PDFToBmpConverter from "@/components/pages/tools/pdf/pdf-to-bmp-converter";
import PDFToCSV from "@/components/pages/tools/pdf/pdf-to-csv";
import PDFToPngConverter from "@/components/pages/tools/pdf/pdf-to-png-converter";
// import PDFToPPT from "@/components/pages/tools/pdf/pdf-to-ppt";
import PDFToTiffConverter from "@/components/pages/tools/pdf/pdf-to-tiff-converter";
import PDFToTxtTool from "@/components/pages/tools/pdf/pdf-to-txt-tool";
import PDFToWord from "@/components/pages/tools/pdf/pdf-to-word";
import PDFToZipConverter from "@/components/pages/tools/pdf/pdf-to-zip-converter";
import PngToPDFConverter from "@/components/pages/tools/pdf/png-to-pdf-converter";
import PowerPointToPDFConverter from "@/components/pages/tools/pdf/powerpoint-to-pdf-converter";
import RemovePagesTool from "@/components/pages/tools/pdf/remove-pages-tool";
import RepairPDFTool from "@/components/pages/tools/pdf/repair-pdf-tool";
import RotatePDFTool from "@/components/pages/tools/pdf/rotate-pdf-tool";
import TxtToPDFTool from "@/components/pages/tools/pdf/txt-to-pdf-tool";
// import WordToPDFConverter from "@/components/pages/tools/pdf/word-to-pdf-converter";

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
  "add-page-number-to-pdf": AddPageNumberToPDF,
  "bmp-to-pdf-converter": BmpToPDFConverter,
  "compress-pdf-tool": CompressPDFTool,
  "excel-to-pdf-tool": ExcelToPDFTool,
  "extract-from-pdf": ExtractFromPDF,
  "extract-pdf-pages-tool": ExtractPDFPagesTool,
  "high-resolution-tiff-to-pdf-converter": HighResolutionTiffToPDFConverter,
  "jpg-to-pdf-converter": JpgToPDFConverter,
  "merge-pdf-tool": MergePDFTool,
  "organize-pdf-tool": OrganizePDFTool,
  "pdf-to-bmp-converter": PDFToBmpConverter,
  "pdf-to-csv": PDFToCSV,
  "pdf-to-png-converter": PDFToPngConverter,
  // "pdf-to-ppt": PDFToPPT,
  "pdf-to-tiff-converter": PDFToTiffConverter,
  "pdf-to-txt-tool": PDFToTxtTool,
  "pdf-to-word": PDFToWord,
  "pdf-to-zip-converter": PDFToZipConverter,
  "png-to-pdf-converter": PngToPDFConverter,
  "powerpoint-to-pdf-converter": PowerPointToPDFConverter,
  "remove-pages-tool": RemovePagesTool,
  "repair-pdf-tool": RepairPDFTool,
  "rotate-pdf-tool": RotatePDFTool,
  "txt-to-pdf-tool": TxtToPDFTool,
  //   "word-to-pdf-converter": WordToPDFConverter,
};

export async function generateMetadata({ params }) {
  const { tool } = params;

  // Get tool details
  const toolData = TOOL_CATEGORIES.find((item) => item.id === "pdf-tools")?.tools.find((t) => t.id === tool);
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
