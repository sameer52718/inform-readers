"use client";
import { useState, useRef, useEffect } from "react";
import * as PDFLib from "pdf-lib";
import Script from "next/script";

export default function Home() {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [error, setError] = useState("");
  const [pages, setPages] = useState([]);
  const [previewPage, setPreviewPage] = useState(null);
  const fileInputRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const loadPDFPreview = async (file) => {
    setError("");
    setPages([]);
    setSelectedPages([]);
    setPdfDoc(null);

    if (!file) {
      setError("Please select a PDF file.");
      console.error("Step 1: No file selected.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("The selected file must be a PDF.");
      console.error("Step 2: Invalid file type:", file.type);
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      console.log("Step 3: Loading PDF with size:", arrayBuffer.byteLength, "bytes");
      const pdfJsDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDoc(pdfJsDoc);
      const pageCount = pdfJsDoc.numPages;
      console.log("Step 4: PDF loaded with", pageCount, "pages.");

      const newPages = [];
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdfJsDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        await page.render({ canvasContext: context, viewport }).promise;
        newPages.push({ index: i - 1, canvas });
      }
      setPages(newPages);
      console.log("Step 6: Page thumbnails loaded successfully.");
    } catch (error) {
      setError("An error occurred while loading the PDF: " + error.message);
      console.error("Detailed error during PDF loading:", error);
    }
  };

  const showPagePreview = async (pageNum) => {
    if (!pdfDoc) {
      console.error("Step 7: No PDF document available for preview.");
      return;
    }

    try {
      console.log("Step 8: Showing preview for page", pageNum);
      setPreviewPage(pageNum);
    } catch (error) {
      setError("An error occurred while loading the page preview: " + error.message);
      console.error("Detailed error during preview:", error);
    }
  };

  useEffect(() => {
    if (previewPage && pdfDoc && previewCanvasRef.current) {
      const renderPreview = async () => {
        const page = await pdfDoc.getPage(previewPage);
        const maxHeight = window.innerHeight * 0.7;
        const viewportDefault = page.getViewport({ scale: 1.5 });
        const scale = Math.min(1.5, maxHeight / viewportDefault.height);
        const viewport = page.getViewport({ scale });

        const canvas = previewCanvasRef.current;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        await page.render({ canvasContext: context, viewport }).promise;
        console.log("Step 9: Preview rendered with scale", scale);
      };
      renderPreview();
    }
  }, [previewPage, pdfDoc]);

  const closeModal = () => {
    setPreviewPage(null);
    console.log("Step 10: Preview modal closed.");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && previewPage !== null) {
      closeModal();
      console.log("Step 11: Modal closed via Escape key.");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [previewPage]);

  const togglePageSelection = (pageIndex) => {
    setSelectedPages((prev) => {
      const newSelected = prev.includes(pageIndex)
        ? prev.filter((p) => p !== pageIndex)
        : [...prev, pageIndex];
      newSelected.sort((a, b) => a - b);
      console.log("Step 5: Selected pages:", newSelected);
      return newSelected;
    });
  };

  const extractPages = async () => {
    if (!fileInputRef.current.files.length) {
      setError("Please select a PDF file.");
      console.error("Step 13: No file selected for extraction.");
      return;
    }

    if (!selectedPages.length) {
      setError("Please select at least one page to extract.");
      console.error("Step 14: No pages selected.");
      return;
    }

    try {
      console.log("Step 15: Starting page extraction for pages:", selectedPages);
      const arrayBuffer = await fileInputRef.current.files[0].arrayBuffer();
      const pdfDocLib = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const newPdf = await PDFLib.PDFDocument.create();

      for (const pageIndex of selectedPages) {
        const [copiedPage] = await newPdf.copyPages(pdfDocLib, [pageIndex]);
        newPdf.addPage(copiedPage);
      }

      console.log("Step 16: Pages copied to new PDF.");
      const pdfBytes = await newPdf.save();
      console.log("Step 17: New PDF saved with size:", pdfBytes.length, "bytes");

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.download = "extracted.pdf";
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
      console.log("Step 18: Extracted PDF downloaded successfully.");
    } catch (error) {
      setError("An error occurred while extracting pages: " + error.message);
      console.error("Detailed error during extraction:", error);
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
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-3xl w-full transform transition-all hover:scale-105 duration-300">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Extract PDF Pages Tool</h1>
          <p className="text-gray-600 mb-6">
            Select pages to extract and create a new PDF with only those pages.
          </p>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={(e) => loadPDFPreview(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 mb-6"
          />
          {pages.length > 0 && (
            <div className="max-h-96 overflow-y-auto mb-6 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">Select pages to extract:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <div
                    key={page.index}
                    className="page-item p-2 bg-gray-50 rounded-md hover:bg-gray-100"
                    data-page={page.index}
                  >
                    <canvas
                      ref={(el) => el && el.getContext("2d").drawImage(page.canvas, 0, 0)}
                      width={page.canvas.width}
                      height={page.canvas.height}
                      className="cursor-pointer w-full"
                      onClick={() => showPagePreview(page.index + 1)}
                    />
                    <div className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        className="mr-2 page-checkbox"
                        data-page={page.index}
                        checked={selectedPages.includes(page.index)}
                        onChange={() => togglePageSelection(page.index)}
                      />
                      <span className="text-sm text-gray-700">Page {page.index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={extractPages}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition duration-200 font-semibold"
          >
            Extract Pages
          </button>
          {error && <div className="text-red-500 mt-4 text-sm text-center">{error}</div>}
        </div>
      </div>
      {previewPage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-[90vw] w-full max-h-[90vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Page Preview</h2>
              <button
                onClick={closeModal}
                className="text-gray-600 text-2xl font-bold hover:text-gray-800 focus:outline-none"
              >
                ×
              </button>
            </div>
            <div className="flex-grow overflow-auto flex items-center justify-center">
              <canvas ref={previewCanvasRef} className="max-w-full max-h-[70vh] h-auto" />
            </div>
            <div className="sticky bottom-0 bg-white pt-4 text-center">
              <button
                onClick={closeModal}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
