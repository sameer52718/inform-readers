"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const PDFLib = dynamic(() => import("pdf-lib").then((mod) => mod.PDFDocument), { ssr: false });
const XLSX = dynamic(() => import("xlsx"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [fontFamily, setFontFamily] = useState("TimesRoman");
  const [fontSize, setFontSize] = useState("12");
  const [orientation, setOrientation] = useState("portrait");
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [unsupportedChars, setUnsupportedChars] = useState(new Set());

  const symbolMap = {
    λ: "l",
    Λ: "L",
    α: "a",
    "±": "+/-",
    "∞": "infinity",
    "∑": "sum",
    β: "b",
    γ: "g",
    δ: "d",
    θ: "th",
    π: "pi",
    σ: "s",
    अ: "a",
    आ: "aa",
    इ: "i",
    ई: "ee",
    उ: "u",
    ऊ: "oo",
    ए: "e",
    ऐ: "ai",
    ओ: "o",
    औ: "au",
    क: "k",
    ख: "kh",
  };

  const sanitizeText = (text) => {
    return String(text).replace(/[^\x20-\x7E]/g, (char) => {
      if (symbolMap[char]) {
        return symbolMap[char];
      }
      setUnsupportedChars((prev) => new Set([...prev, char]));
      return "?";
    });
  };

  const loadExcelFile = async (selectedFile) => {
    setError("");
    setUnsupportedChars(new Set());

    if (!selectedFile) {
      setError("Please select an Excel file (.xlsx or .xls).");
      return false;
    }
    if (!selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      setError("The selected file must be an Excel file (.xlsx or .xls).");
      return false;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheet = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1 });
      if (!data.length || !data[0].length) {
        throw new Error("Excel file is empty or invalid.");
      }
      setExcelData(data);
      return true;
    } catch (err) {
      setError(`An error occurred while reading the Excel file: ${err.message}`);
      console.error("Excel loading error:", err);
      return false;
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const renderPreviewTable = (data) => {
    return (
      <table className="w-full border-collapse text-sm text-gray-700">
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border border-gray-300 p-2">
                  {cell || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const convertToPDF = async () => {
    setError("");
    setStatus("");
    setUnsupportedChars(new Set());

    if (!excelData && !file) {
      setError("Please select an Excel file.");
      return;
    }
    if (!excelData && file) {
      const loaded = await loadExcelFile(file);
      if (!loaded) return;
    }

    try {
      const size = parseInt(fontSize);
      const pdfDoc = await PDFLib.create();
      const pdfFont = await pdfDoc.embedFont(
        PDFLib.StandardFonts[fontFamily.replace("TimesRoman", "TimesRoman")]
      );
      const pageSize = orientation === "portrait" ? [595, 842] : [842, 595];
      const pageWidth = pageSize[0];
      const pageHeight = pageSize[1];
      const textWidth = pageWidth;
      const lineHeight = size * 1.5;

      const maxColumns = Math.min(excelData[0] ? excelData[0].length : 1, 8);
      const columnWidths = new Array(maxColumns).fill(0);
      excelData.forEach((row) => {
        for (let i = 0; i < maxColumns; i++) {
          const text = sanitizeText(row[i] || "");
          const width = pdfFont.widthOfTextAtSize(text, size) * 1.3;
          columnWidths[i] = Math.max(columnWidths[i], width, 60);
        }
      });

      const totalWidth = columnWidths.reduce((sum, w) => sum + w, 0);
      if (totalWidth > textWidth) {
        const scale = textWidth / totalWidth;
        columnWidths.forEach((_, i) => (columnWidths[i] *= scale));
      }

      let currentPage = pdfDoc.addPage(pageSize);
      let y = pageHeight;

      for (const row of excelData) {
        const rowHeight = lineHeight;
        if (y < rowHeight) {
          currentPage = pdfDoc.addPage(pageSize);
          y = pageHeight;
        }

        let x = 0;
        for (let i = 0; i < maxColumns; i++) {
          const cellText = sanitizeText(row[i] || "");
          currentPage.drawText(cellText, {
            x,
            y: y - size,
            size,
            font: pdfFont,
            color: PDFLib.rgb(0, 0, 0),
            maxWidth: columnWidths[i],
            wordBreaks: [" "],
          });
          currentPage.drawRectangle({
            x,
            y: y - rowHeight,
            width: columnWidths[i],
            height: rowHeight,
            borderColor: PDFLib.rgb(0, 0, 0),
            borderWidth: 0.5,
          });
          x += columnWidths[i];
        }
        y -= rowHeight;
      }

      const pdfBytes = await pdfDoc.save();
      let statusMessage = `Converted Excel to PDF. Output size: ${(pdfBytes.length / 1024).toFixed(2)} KB`;
      if (unsupportedChars.size > 0) {
        statusMessage += ` Warning: Characters (${Array.from(unsupportedChars).join(
          ", "
        )}) were replaced with approximations or '?'. Standard fonts have limited symbol support.`;
      }
      setStatus(statusMessage);

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      setError(`An error occurred while converting to PDF: ${err.message}`);
      console.error("Conversion error:", err);
    }
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-3xl font-extrabold text-red-500 mb-3">Simple Excel to PDF Tool</h1>
        <p className="text-gray-600 mb-6">
          Convert Excel files to PDFs with standard fonts. Note: Symbols (e.g., λ, ±, ∞) may be replaced.
        </p>
        <div className="space-y-6">
          <input
            type="file"
            id="excelInput"
            accept=".xlsx,.xls"
            onChange={(e) => {
              setFile(e.target.files[0]);
              loadExcelFile(e.target.files[0]);
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "Font Family",
                id: "fontFamily",
                value: fontFamily,
                setter: setFontFamily,
                type: "select",
                options: [
                  { value: "TimesRoman", label: "Times Roman" },
                  { value: "Helvetica", label: "Helvetica" },
                  { value: "Courier", label: "Courier" },
                ],
              },
              {
                label: "Font Size",
                id: "fontSize",
                value: fontSize,
                setter: setFontSize,
                type: "range",
                min: "8",
                max: "16",
                step: "1",
              },
              {
                label: "Page Orientation",
                id: "orientation",
                value: orientation,
                setter: setOrientation,
                type: "select",
                options: [
                  { value: "portrait", label: "Portrait" },
                  { value: "landscape", label: "Landscape" },
                ],
              },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.id === "fontSize" && `: ${fontSize}pt`}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>
          <div>
            <button onClick={togglePreview} className="text-red-600 hover:text-red-800 text-sm font-semibold">
              Toggle Data Preview
            </button>
            {showPreview && excelData && (
              <div className="mt-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                {renderPreviewTable(excelData)}
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
        </div>
        <style jsx>{`
          input:focus,
          select:focus {
            outline: none;
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
          }
          input[type="range"] {
            accent-color: #ef4444;
          }
        `}</style>
      </div>
    </div>
  );
}
