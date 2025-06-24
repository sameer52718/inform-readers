import { pdfToolMetaData } from "@/constant/tools";

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
  return (
    pdfToolMetaData[tool] || {
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
