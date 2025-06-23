"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PDFLib = dynamic(() => import("pdf-lib").then((mod) => mod.PDFDocument), { ssr: false });

export default function Home() {
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [fontFamily, setFontFamily] = useState("TimesRoman");
  const [fontSize, setFontSize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState("1");
  const [margin, setMargin] = useState("50");
  const [alignment, setAlignment] = useState("left");
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const loadTextFile = async (selectedFile) => {
    setError("");
    setTextContent("");

    if (!selectedFile) {
      setError("Please select a .txt file.");
      return false;
    }
    if (!selectedFile.name.endsWith(".txt")) {
      setError("The selected file must be a .txt file.");
      return false;
    }

    try {
      const content = await selectedFile.text();
      setTextContent(content);
      return true;
    } catch (err) {
      setError("An error occurred while reading the text file: " + err.message);
      console.error("Text loading error:", err);
      return false;
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const convertToPDF = async () => {
    setError("");
    setStatus("");

    if (!textContent && !file) {
      setError("Please select a .txt file.");
      return;
    }
    if (!textContent && file) {
      const loaded = await loadTextFile(file);
      if (!loaded) return;
    }

    try {
      const pdfDoc = await PDFLib.create();
      const font = await pdfDoc.embedFont(PDFLib.StandardFonts[fontFamily]);
      const pageWidth = 595;
      const pageHeight = 842;
      const textWidth = pageWidth - 2 * parseInt(margin);
      const lineHeight = fontSize * parseFloat(lineSpacing);

      const lines = textContent.split("\n");
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - parseInt(margin);

      for (const line of lines) {
        const words = line.split(" ");
        let currentLine = "";
        for (const word of words) {
          const testLine = currentLine + (currentLine ? " " : "") + word;
          if (font.widthOfTextAtSize(testLine, fontSize) > textWidth) {
            if (y < parseInt(margin) + lineHeight) {
              currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
              y = pageHeight - parseInt(margin);
            }
            currentPage.drawText(currentLine, {
              x: parseInt(margin),
              y,
              size: fontSize,
              font,
              color: PDFLib.rgb(0, 0, 0),
              maxWidth: alignment === "justify" ? textWidth : undefined,
              wordBreaks: alignment === "justify" ? [" "] : undefined,
            });
            y -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          if (y < parseInt(margin) + lineHeight) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - parseInt(margin);
          }
          currentPage.drawText(currentLine, {
            x: parseInt(margin),
            y,
            size: fontSize,
            font,
            color: PDFLib.rgb(0, 0, 0),
            maxWidth: alignment === "justify" ? textWidth : undefined,
            wordBreaks: alignment === "justify" ? [" "] : undefined,
          });
          y -= lineHeight;
        }
      }

      const pdfBytes = await pdfDoc.save();
      setStatus(`Converted text to PDF. Output size: ${(pdfBytes.length / 1024).toFixed(2)} KB`);

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      setError("An error occurred while converting to PDF: " + err.message);
      console.error("Conversion error:", err);
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-3xl font-extrabold text-red-500 mb-3">Advanced TXT to PDF Tool</h1>
        <p className="text-gray-600 mb-6">
          Convert text files to professional PDFs with customizable formatting.
        </p>
        <input
          type="file"
          id="txtInput"
          accept=".txt"
          onChange={(e) => {
            setFile(e.target.files[0]);
            loadTextFile(e.target.files[0]);
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 mb-6"
        />
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-2">
              Font Family:
            </label>
            <select
              id="fontFamily"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="TimesRoman">Times Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Courier">Courier</option>
            </select>
          </div>
          <div>
            <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-2">
              Font Size: <span>{fontSize}</span>pt
            </label>
            <input
              type="range"
              id="fontSize"
              min="8"
              max="16"
              value={fontSize}
              step="1"
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
          <div>
            <label htmlFor="lineSpacing" className="block text-sm font-medium text-gray-700 mb-2">
              Line Spacing:
            </label>
            <select
              id="lineSpacing"
              value={lineSpacing}
              onChange={(e) => setLineSpacing(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="1">Single (1.0)</option>
              <option value="1.5">1.5</option>
              <option value="2">Double (2.0)</option>
            </select>
          </div>
          <div>
            <label htmlFor="margin" className="block text-sm font-medium text-gray-700 mb-2">
              Margins:
            </label>
            <select
              id="margin"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="25">Small (25pt)</option>
              <option value="50">Medium (50pt)</option>
              <option value="75">Large (75pt)</option>
            </select>
          </div>
          <div>
            <label htmlFor="alignment" className="block text-sm font-medium text-gray-700 mb-2">
              Text Alignment:
            </label>
            <select
              id="alignment"
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="left">Left</option>
              <option value="justify">Justified</option>
            </select>
          </div>
        </div>
        <div className="mb-6">
          <button onClick={togglePreview} className="text-red-600 hover:text-red-800 text-sm font-semibold">
            Toggle Text Preview
          </button>
          {showPreview && (
            <div
              id="textPreview"
              className="mt-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 text-gray-700 text-sm"
            >
              {textContent}
            </div>
          )}
        </div>
        <button
          onClick={convertToPDF}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Convert to PDF
        </button>
        {error && <div className="text-red-500 mt-4 text-sm text-center">{error}</div>}
        {status && <div className="text-gray-600 mt-4 text-sm text-center">{status}</div>}
        <style jsx>{`
          input:focus,
          select:focus {
            outline: none;
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
          }
          input[type="range"]::-webkit-slider-thumb {
            background: #ef4444;
          }
          input[type="range"]::-moz-range-thumb {
            background: #ef4444;
          }
        `}</style>
      </div>
    </div>
  );
}
