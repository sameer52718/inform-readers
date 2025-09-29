"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const pdfjsLib = dynamic(() => import("pdfjs-dist"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState(null);
  const [pdfTextData, setPdfTextData] = useState(null);
  const [lineBreak, setLineBreak] = useState("unix");
  const [showPreview, setShowPreview] = useState(false);
  const [unsupportedChars, setUnsupportedChars] = useState(new Set());
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("pdfjs-dist").then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js";
      });
    }
  }, []);

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
    "—": "--",
    "’": "'",
    "●": "*",
    "“": '"',
    "”": '"',
    "‘": "'",
    "‚": ",",
    "–": "-",
  };

  const sanitizeText = (text) => {
    return String(text).replace(/[^\x20-\x7E]/g, (char) => {
      if (symbolMap[char]) {
        setUnsupportedChars((prev) => new Set([...prev]));
        return symbolMap[char];
      }
      setUnsupportedChars((prev) => new Set([...prev, char]));
      return "?";
    });
  };

  const loadPDFFile = async (selectedFile) => {
    setError("");
    setUnsupportedChars(new Set());
    setPdfTextData(null);

    if (!selectedFile) {
      setError("Please select a PDF file.");
      return false;
    }
    if (!selectedFile.name.match(/\.pdf$/i)) {
      setError("The selected file must be a PDF file.");
      return false;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const textData = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        let pageText = textContent.items.map((item) => item.str).join("\n");
        pageText = sanitizeText(pageText);
        textData.push(pageText);
      }

      if (!textData.length || textData.every((text) => !text.trim())) {
        throw new Error("PDF file is empty or contains no extractable text.");
      }

      setPdfTextData(textData);
      if (showPreview) {
        renderPreviewText(textData);
      }
      return true;
    } catch (err) {
      setError(`An error occurred while reading the PDF file: ${err.message}`);
      console.error("PDF loading error:", err);
      return false;
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
    if (!showPreview && pdfTextData) {
      renderPreviewText(pdfTextData);
    }
  };

  const renderPreviewText = (data) => {
    const previewDiv = document.getElementById("dataPreview");
    if (previewDiv) {
      previewDiv.innerHTML = "";
      data.forEach((pageText, index) => {
        const pageDiv = document.createElement("div");
        pageDiv.innerHTML = `<strong>Page ${index + 1}:</strong><br>${
          pageText.replace(/\n/g, "<br>") || "(Empty)"
        }`;
        pageDiv.className = "mb-4";
        previewDiv.appendChild(pageDiv);
      });
    }
  };

  const convertToTXT = async () => {
    setError("");
    setStatus("");
    setUnsupportedChars(new Set());

    if (!pdfTextData && !file) {
      setError("Please select a PDF file.");
      return;
    }
    if (!pdfTextData && file) {
      const loaded = await loadPDFFile(file);
      if (!loaded) return;
    }

    try {
      const lineBreakChar = lineBreak === "unix" ? "\n" : "\r\n";
      let txtContent = "";
      pdfTextData.forEach((pageText, index) => {
        if (!pageText.trim()) return;
        txtContent += `--- Page ${index + 1} ---${lineBreakChar}${pageText}${lineBreakChar}${lineBreakChar}`;
      });

      if (!txtContent) {
        throw new Error("No text content to convert.");
      }

      let statusMessage = "Converted PDF to TXT.";
      if (unsupportedChars.size > 0) {
        statusMessage += ` Warning: Characters (${Array.from(unsupportedChars).join(
          ", "
        )}) were replaced with approximations or "?".`;
      }
      setStatus(statusMessage);

      const blob = new Blob([txtContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.txt";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      setError(`An error occurred while converting to TXT: ${err.message}`);
      console.error("Conversion error:", err);
    }
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-3xl font-extrabold text-red-500 mb-3">Simple PDF to TXT Tool</h1>
        <p className="text-gray-600 mb-6">
          Convert PDF files to plain text. Note: Symbols (e.g., λ, ±, ∞) and Hindi text may be replaced.
        </p>
        <input
          type="file"
          id="pdfInput"
          accept=".pdf"
          onChange={(e) => {
            setFile(e.target.files[0]);
            loadPDFFile(e.target.files[0]);
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 mb-6"
        />
        <div className="mb-6">
          <label htmlFor="lineBreak" className="block text-sm font-medium text-gray-700 mb-2">
            Line Break Style:
          </label>
          <select
            id="lineBreak"
            value={lineBreak}
            onChange={(e) => setLineBreak(e.target.value)}
            className="w-full max-w-xs border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="unix">Unix (\n)</option>
            <option value="windows">Windows (\r\n)</option>
          </select>
        </div>
        <div className="mb-6">
          <button onClick={togglePreview} className="text-red-600 hover:text-red-800 text-sm font-semibold">
            Toggle Data Preview
          </button>
          {showPreview && (
            <div
              id="dataPreview"
              className="mt-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 text-sm text-gray-700"
            />
          )}
        </div>
        <button
          onClick={convertToTXT}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Convert to TXT
        </button>
        {error && <div className="text-red-500 mt-4 text-sm text-center">{error}</div>}
        {status && <div className="text-gray-600 mt-4 text-sm text-center">{status}</div>}
        <style jsx>{`
          input:focus,
          select:focus {
            outline: none;
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
}
