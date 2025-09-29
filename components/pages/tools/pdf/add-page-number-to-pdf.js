"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const PDFLib = dynamic(() => import("pdf-lib").then((mod) => mod.PDFDocument), { ssr: false });
const pdfjsLib = dynamic(() => import("pdfjs-dist"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState("bottom-right");
  const [format, setFormat] = useState("Page {n}");
  const [font, setFont] = useState("Helvetica");
  const [fontSize, setFontSize] = useState("12");
  const [color, setColor] = useState("#000000");
  const [xOffset, setXOffset] = useState("0");
  const [yOffset, setYOffset] = useState("0");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("pdfjs-dist").then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
      });
    }
  }, []);

  const charMap = {
    "’": "'",
    "“": '"',
    "”": '"',
    "–": "-",
    "—": "-",
    "•": "*",
    "∞": "infinity",
    λ: "lambda",
    "\u2018": "'",
    "\u2019": "'",
    "\u201C": '"',
    "\u201D": '"',
    "\u2022": "*",
    "\u2013": "-",
    "\u2014": "-",
  };

  const sanitizeText = (text) => {
    let replaced = false;
    const sanitized = text.replace(
      /[^\x00-\x7F]|[’“”–—•∞λ\u2018\u2019\u201C\u201D\u2022\u2013\u2014]/g,
      (char) => {
        if (charMap[char]) {
          replaced = true;
          return charMap[char];
        }
        replaced = true;
        return "?";
      }
    );
    return { text: sanitized, replaced };
  };

  const renderPreview = async (pdfData) => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");
      await page.render({ canvasContext: context, viewport }).promise;
    } catch (err) {
      console.error("Preview rendering error:", err);
    }
  };

  const processPDF = async () => {
    setError("");
    setStatus("");
    setResult(null);
    const canvas = canvasRef.current;
    canvas.width = 0;
    canvas.height = 0;

    if (!file) {
      setError("Please upload a PDF file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit");
      return;
    }

    const size = parseInt(fontSize) || 12;
    const xOff = parseInt(xOffset) || 0;
    const yOff = parseInt(yOffset) || 0;

    if (size < 8 || size > 24) {
      setError("Please enter a valid font size (8-24)");
      return;
    }
    if (xOff < -50 || xOff > 50 || yOff < -50 || yOff > 50) {
      setError("Please enter valid offsets (-50 to 50)");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFLib.load(arrayBuffer);
      const pdfFont = await pdfDoc.embedFont(font);
      const rgb = {
        r: parseInt(color.slice(1, 3), 16) / 255,
        g: parseInt(color.slice(3, 5), 16) / 255,
        b: parseInt(color.slice(5, 7), 16) / 255,
      };

      let replacedChars = false;
      const totalPages = pdfDoc.getPageCount();

      pdfDoc.getPages().forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNum = index + 1;
        let text = format.replace("{n}", pageNum).replace("{total}", totalPages);
        const sanitized = sanitizeText(text);
        if (sanitized.replaced) replacedChars = true;
        text = sanitized.text;

        const textWidth = pdfFont.widthOfTextAtSize(text, size);
        const textHeight = size;
        const margin = 50;
        let x, y;

        switch (position) {
          case "top-left":
            x = margin + xOff;
            y = height - margin - textHeight + yOff;
            break;
          case "top-right":
            x = width - margin - textWidth + xOff;
            y = height - margin - textHeight + yOff;
            break;
          case "bottom-left":
            x = margin + xOff;
            y = margin + yOff;
            break;
          case "bottom-right":
            x = width - margin - textWidth + xOff;
            y = margin + yOff;
            break;
          case "top-center":
            x = (width - textWidth) / 2 + xOff;
            y = height - margin - textHeight + yOff;
            break;
          case "bottom-center":
            x = (width - textWidth) / 2 + xOff;
            y = margin + yOff;
            break;
        }

        page.drawText(text, { x, y, font: pdfFont, size, color: PDFLib.rgb(rgb.r, rgb.g, rgb.b) });
      });

      const pdfBytes = await pdfDoc.save();
      await renderPreview(pdfBytes);

      if (replacedChars) {
        setStatus("Warning: Some special characters (e.g., Hindi) were replaced with approximations");
      }

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const dataUrl = URL.createObjectURL(blob);
      setResult({ url: dataUrl, filename: "numbered_pdf.pdf" });
    } catch (err) {
      setError("Error processing PDF. Check console for details.");
      console.error("Processing error:", err);
    }
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Add Page Numbers to PDF</h1>
        <div className="space-y-4">
          <div className="input-group">
            <label htmlFor="pdfInput" className="block text-sm font-bold text-gray-600 mb-2">
              Upload PDF
            </label>
            <input
              type="file"
              id="pdfInput"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="controls space-y-4">
            {[
              {
                label: "Position",
                id: "position",
                value: position,
                setter: setPosition,
                type: "select",
                options: [
                  { value: "top-left", label: "Top Left" },
                  { value: "top-right", label: "Top Right" },
                  { value: "bottom-left", label: "Bottom Left" },
                  { value: "bottom-right", label: "Bottom Right" },
                  { value: "top-center", label: "Top Center" },
                  { value: "bottom-center", label: "Bottom Center" },
                ],
              },
              {
                label: "Format",
                id: "format",
                value: format,
                setter: setFormat,
                type: "select",
                options: [
                  { value: "Page {n}", label: "Page X (e.g., Page 1)" },
                  { value: "{n}", label: "X (e.g., 1)" },
                  { value: "Page {n} of {total}", label: "Page X of Y (e.g., Page 1 of 5)" },
                  { value: "{n}/{total}", label: "X/Y (e.g., 1/5)" },
                ],
              },
              {
                label: "Font",
                id: "font",
                value: font,
                setter: setFont,
                type: "select",
                options: [
                  { value: "Helvetica", label: "Helvetica" },
                  { value: "Times-Roman", label: "Times Roman" },
                  { value: "Courier", label: "Courier" },
                ],
              },
              {
                label: "Font Size (8-24pt)",
                id: "fontSize",
                value: fontSize,
                setter: setFontSize,
                type: "number",
                min: "8",
                max: "24",
              },
              { label: "Text Color", id: "color", value: color, setter: setColor, type: "color" },
              {
                label: "X Offset (px)",
                id: "xOffset",
                value: xOffset,
                setter: setXOffset,
                type: "number",
                min: "-50",
                max: "50",
              },
              {
                label: "Y Offset (px)",
                id: "yOffset",
                value: yOffset,
                setter: setYOffset,
                type: "number",
                min: "-50",
                max: "50",
              },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-bold text-gray-600 mb-2">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
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
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={processPDF}
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-105 transition"
          >
            Add Page Numbers
          </button>
          <canvas ref={canvasRef} className="w-full mt-4 border-2 border-gray-400 rounded-lg shadow"></canvas>
          {result && (
            <div className="mt-4 text-center">
              <a href={result.url} download={result.filename} className="text-red-500 hover:underline">
                Download Numbered PDF
              </a>
            </div>
          )}
          {status && <div className="mt-4 text-center text-yellow-500">{status}</div>}
          {error && <div className="mt-4 text-center text-red-500">{error}</div>}
        </div>
        <style jsx>{`
          input:focus,
          select:focus {
            outline: none;
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
          }
          .hover\:scale-105:hover {
            transform: scale(1.05);
          }
        `}</style>
      </div>
    </div>
  );
}
