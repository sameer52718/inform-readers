"use client";
import { useState, useRef } from "react";
import Script from "next/script";

export default function Home() {
  const [file, setFile] = useState(null);
  const [csvContent, setCsvContent] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const fileInputRef = useRef(null);

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

  const processPDF = async () => {
    setError("");
    setStatus("");
    setCsvContent("");
    setDownloadUrl(null);

    const selectedFile = fileInputRef.current.files[0];
    if (!selectedFile) {
      setError("Please upload a PDF file");
      console.log("No file uploaded");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit");
      console.log("File too large:", selectedFile.size);
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
      console.log("PDF loaded, pages:", pdf.numPages);

      let allTables = [];
      let replacedChars = false;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        console.log("Page", pageNum, "text content loaded");

        // Simple table detection: group text items by rows based on y-position
        const rows = {};
        textContent.items.forEach((item) => {
          const y = Math.round(item.transform[5]);
          if (!rows[y]) rows[y] = [];
          const sanitized = sanitizeText(item.str);
          if (sanitized.replaced) replacedChars = true;
          rows[y].push({ text: sanitized.text, x: item.transform[4] });
        });

        // Sort rows by y-position (top to bottom)
        const sortedRows = Object.keys(rows)
          .sort((a, b) => parseFloat(b) - parseFloat(a))
          .map((y) => rows[y].sort((a, b) => a.x - b.x).map((cell) => cell.text));

        // Filter rows that resemble table data (at least 2 columns)
        const tableRows = sortedRows.filter((row) => row.length >= 2);
        if (tableRows.length > 0) {
          allTables.push(tableRows);
          console.log("Table found on page", pageNum, "rows:", tableRows.length);
        }
      }

      if (allTables.length === 0) {
        setError("No tables found in the PDF");
        console.log("No tables detected");
        return;
      }

      // Convert tables to CSV
      let newCsvContent = "";
      allTables.forEach((table, index) => {
        if (index > 0) newCsvContent += "\n";
        table.forEach((row) => {
          const escapedRow = row.map((cell) => {
            const sanitized = sanitizeText(cell);
            if (sanitized.replaced) replacedChars = true;
            return `"${sanitized.text.replace(/"/g, '""')}"`;
          });
          newCsvContent += escapedRow.join(",") + "\n";
        });
      });

      setCsvContent(newCsvContent);
      console.log("CSV generated, length:", newCsvContent.length);

      if (replacedChars) {
        setStatus(
          "Warning: Some special characters (e.g., Hindi, em dashes) were replaced with approximations"
        );
        console.log("Special characters replaced");
      }

      const blob = new Blob([newCsvContent], { type: "text/csv" });
      const dataUrl = URL.createObjectURL(blob);
      setDownloadUrl(dataUrl);
    } catch (error) {
      setError("Error processing PDF. Check console for details.");
      console.error("Processing error:", error);
    }
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
        }}
      />
      <div className="bg-white min-h-screen flex justify-center items-center p-4">
        <div className="bg-gray-100 p-5 rounded-lg max-w-md w-full shadow-lg">
          <h1 className="text-2xl font-bold text-red-500 text-center mb-5">PDF to CSV (Extract Tables)</h1>
          <div className="mb-4">
            <label htmlFor="pdfInput" className="block mb-1 text-sm text-gray-700">
              Upload PDF
            </label>
            <input
              type="file"
              id="pdfInput"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 bg-gray-200 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={processPDF}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 font-bold"
          >
            Extract Tables to CSV
          </button>
          <textarea
            id="preview"
            readOnly
            value={csvContent}
            placeholder="CSV preview will appear here"
            className="w-full p-2 mt-4 bg-gray-200 text-gray-700 rounded-md min-h-[100px] resize-y"
          />
          {downloadUrl && (
            <div className="mt-4 text-center">
              <a href={downloadUrl} download="tables.csv" className="text-red-500 hover:underline">
                Download CSV
              </a>
            </div>
          )}
          {status && <div className="mt-4 text-center text-yellow-500">{status}</div>}
          {error && <div className="mt-4 text-center text-red-500">{error}</div>}
        </div>
      </div>
    </>
  );
}
