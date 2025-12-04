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
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { buildHreflangLinks } from "@/lib/hreflang";

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
  const alternates = buildHreflangLinks(`/tools/pdf-tools/${tool}`, host);
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

  const toolData = TOOL_CATEGORIES.find((item) => item.id === "pdf-tools")?.tools.find((t) => t.id === tool);
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
    { label: "PDF Tools", href: "/tools/pdf-tools" },
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
