"use client";
import { useState, useRef } from "react";
import * as PDFLib from "pdf-lib";

export default function Home() {
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const fileInputRef = useRef(null);

  const mergePDFs = async () => {
    setError("");
    setDownloadUrl(null);

    const files = fileInputRef.current.files;
    if (!files.length) {
      setError("Please select at least one PDF file.");
      return;
    }

    try {
      const mergedPdf = await PDFLib.PDFDocument.create();
      for (const file of files) {
        if (file.type !== "application/pdf") {
          setError("All selected files must be in PDF format.");
          return;
        }
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Auto-trigger download
      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.download = "merged.pdf";
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

      // Clean up URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setDownloadUrl(null);
      }, 10000);
    } catch (error) {
      setError("An error occurred while merging PDFs. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Merge PDF Tool</h1>
          <p className="text-gray-600 mb-4">
            Combine multiple PDF files into a single document effortlessly.
          </p>
          <input
            type="file"
            multiple
            accept="application/pdf"
            ref={fileInputRef}
            onChange={() => setError("")}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 mb-4"
          />
          <button
            onClick={mergePDFs}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
          >
            Merge PDFs
          </button>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download="merged.pdf"
              className="mt-4 text-red-600 hover:underline text-center block"
            >
              Download Merged PDF
            </a>
          )}
          {error && <div className="text-red-500 mt-2 text-sm text-center">{error}</div>}
        </div>
      </div>
    </>
  );
}
