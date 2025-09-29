"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const pdfjsLib = dynamic(() => import("pdfjs-dist"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState("all");
  const [singlePage, setSinglePage] = useState("");
  const [startPage, setStartPage] = useState("");
  const [endPage, setEndPage] = useState("");
  const [lineBreaks, setLineBreaks] = useState("preserve");
  const [whitespace, setWhitespace] = useState("keep");
  const [textCase, setTextCase] = useState("original");
  const [extractedText, setExtractedText] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isFormatOptionsOpen, setIsFormatOptionsOpen] = useState(false);
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

  const formatText = (text) => {
    let formatted = text;
    if (lineBreaks === "normalize") {
      formatted = formatted.replace(/\n+/g, " ");
    }
    if (whitespace === "trim") {
      formatted = formatted.replace(/\s+/g, " ").trim();
    }
    if (textCase === "uppercase") {
      formatted = formatted.toUpperCase();
    } else if (textCase === "lowercase") {
      formatted = formatted.toLowerCase();
    }
    return formatted;
  };

  const updatePreview = () => {
    if (extractedText) {
      setFormattedText(formatText(extractedText));
    }
  };

  useEffect(() => {
    updatePreview();
  }, [lineBreaks, whitespace, textCase, extractedText]);

  const renderPreview = async (pdf, pageNum) => {
    try {
      const page = await pdf.getPage(pageNum);
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
    setExtractedText("");
    setFormattedText("");
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

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let start, end;
      if (pageRange === "all") {
        start = 1;
        end = pdf.numPages;
      } else if (pageRange === "single") {
        start = parseInt(singlePage) || 1;
        end = start;
      } else {
        start = parseInt(startPage) || 1;
        end = parseInt(endPage) || pdf.numPages;
      }

      if (start < 1 || end > pdf.numPages || start > end) {
        setError(`Invalid page range. Must be between 1 and ${pdf.numPages}`);
        return;
      }

      let replacedChars = false;
      let fullText = "";

      for (let pageNum = start; pageNum <= end; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        let pageText = "";
        textContent.items.forEach((item) => {
          const sanitized = sanitizeText(item.str);
          if (sanitized.replaced) replacedChars = true;
          pageText += sanitized.text + (item.hasEOL ? "\n" : " ");
        });
        fullText += (fullText ? "\n\n" : "") + `Page ${pageNum}:\n${pageText}`;
      }

      setExtractedText(fullText);
      setFormattedText(formatText(fullText));

      if (replacedChars) {
        setStatus(
          "Warning: Some special characters (e.g., Hindi, em dashes) were replaced with approximations"
        );
      }

      await renderPreview(pdf, start);

      const blob = new Blob([fullText], { type: "text/plain" });
      const dataUrl = URL.createObjectURL(blob);
      setResult({ url: dataUrl, filename: "extracted_text.txt" });
    } catch (err) {
      setError("Error processing PDF. Check console for details.");
      console.error("Processing error:", err);
    }
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Extract Text from PDF</h1>
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
            <div>
              <label htmlFor="pageRange" className="block text-sm font-bold text-gray-600 mb-2">
                Page Range
              </label>
              <select
                id="pageRange"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Pages</option>
                <option value="single">Single Page</option>
                <option value="range">Page Range</option>
              </select>
            </div>
            {pageRange !== "all" && (
              <div className="space-y-4">
                {pageRange === "single" && (
                  <div>
                    <label htmlFor="singlePage" className="block text-sm font-bold text-gray-600 mb-2">
                      Page Number
                    </label>
                    <input
                      type="number"
                      id="singlePage"
                      value={singlePage}
                      onChange={(e) => setSinglePage(e.target.value)}
                      min="1"
                      placeholder="e.g., 1"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                )}
                {pageRange === "range" && (
                  <>
                    <div>
                      <label htmlFor="startPage" className="block text-sm font-bold text-gray-600 mb-2">
                        Start Page
                      </label>
                      <input
                        type="number"
                        id="startPage"
                        value={startPage}
                        onChange={(e) => setStartPage(e.target.value)}
                        min="1"
                        placeholder="e.g., 1"
                        className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="endPage" className="block text-sm font-bold text-gray-600 mb-2">
                        End Page
                      </label>
                      <input
                        type="number"
                        id="endPage"
                        value={endPage}
                        onChange={(e) => setEndPage(e.target.value)}
                        min="1"
                        placeholder="e.g., 5"
                        className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            <div
              className="cursor-pointer p-3 bg-red-500 text-white rounded-lg text-center hover:bg-red-600"
              onClick={() => setIsFormatOptionsOpen(!isFormatOptionsOpen)}
            >
              Formatting Options
            </div>
            {isFormatOptionsOpen && (
              <div className="space-y-4">
                {[
                  {
                    label: "Line Breaks",
                    id: "lineBreaks",
                    value: lineBreaks,
                    setter: setLineBreaks,
                    options: [
                      { value: "preserve", label: "Preserve" },
                      { value: "normalize", label: "Normalize (Single Line)" },
                    ],
                  },
                  {
                    label: "Whitespace",
                    id: "whitespace",
                    value: whitespace,
                    setter: setWhitespace,
                    options: [
                      { value: "keep", label: "Keep" },
                      { value: "trim", label: "Trim" },
                    ],
                  },
                  {
                    label: "Text Case",
                    id: "case",
                    value: textCase,
                    setter: setTextCase,
                    options: [
                      { value: "original", label: "Original" },
                      { value: "uppercase", label: "Uppercase" },
                      { value: "lowercase", label: "Lowercase" },
                    ],
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-bold text-gray-600 mb-2">
                      {field.label}
                    </label>
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
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={processPDF}
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-105 transition"
          >
            Extract Text
          </button>
          <textarea
            id="preview"
            readOnly
            value={formattedText}
            placeholder="Extracted text will appear here"
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500 min-h-[100px] resize-y"
          />
          <canvas ref={canvasRef} className="w-full mt-4 border-2 border-gray-400 rounded-lg shadow"></canvas>
          {result && (
            <div className="mt-4 text-center">
              <a href={result.url} download={result.filename} className="text-red-500 hover:underline">
                Download Text
              </a>
            </div>
          )}
          {status && <div className="mt-4 text-center text-yellow-500">{status}</div>}
          {error && <div className="mt-4 text-center text-red-500">{error}</div>}
        </div>
        <style jsx>{`
          input:focus,
          select:focus,
          textarea:focus {
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
