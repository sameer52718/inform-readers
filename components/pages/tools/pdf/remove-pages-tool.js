"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const PDFLib = dynamic(() => import("pdf-lib").then((mod) => mod.PDFDocument), { ssr: false });
const pdfjsLib = dynamic(() => import("pdfjs-dist"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pages, setPages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("pdfjs-dist").then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
      });
    }
  }, []);

  const loadPDFPreview = async (selectedFile) => {
    setError("");
    setPages([]);
    setPdfDoc(null);

    if (!selectedFile) {
      setError("Please select a PDF file.");
      return;
    }
    if (selectedFile.type !== "application/pdf") {
      setError("The selected file must be a PDF.");
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDoc(doc);
      const pageCount = doc.numPages;
      const pagePreviews = [];

      for (let i = 1; i <= pageCount; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        await page.render({ canvasContext: context, viewport }).promise;
        pagePreviews.push({ canvas, pageNum: i });
      }
      setPages(pagePreviews);
    } catch (err) {
      setError("An error occurred while loading the PDF. Please try again.");
      console.error("Error loading PDF:", err);
    }
  };

  const showPagePreview = async (pageNum) => {
    if (!pdfDoc) return;
    setCurrentPageNum(pageNum);
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");
      await page.render({ canvasContext: context, viewport }).promise;
      setIsModalOpen(true);
    } catch (err) {
      setError("An error occurred while loading the page preview.");
      console.error("Error showing preview:", err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const removePages = async () => {
    setError("");

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("The selected file must be a PDF.");
      return;
    }

    const selectedPages = Array.from(document.querySelectorAll("#pageCheckboxes input:checked")).map(
      (cb) => parseInt(cb.value) - 1
    );

    if (selectedPages.length === 0) {
      setError("Please select at least one page to remove.");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDocLib = await PDFLib.load(arrayBuffer);
      const pageCount = pdfDocLib.getPageCount();

      selectedPages
        .sort((a, b) => b - a)
        .forEach((pageIndex) => {
          if (pageIndex >= 0 && pageIndex < pageCount) {
            pdfDocLib.removePage(pageIndex);
          }
        });

      if (pdfDocLib.getPageCount() === 0) {
        setError("Cannot remove all pages. Please keep at least one page.");
        return;
      }

      const pdfBytes = await pdfDocLib.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "modified.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      setError("An error occurred while removing pages. Please try again.");
      console.error("Error removing pages:", err);
    }
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-2xl w-full">
        <h1 className="text-3xl font-extrabold text-red-500 mb-3">Remove Pages Tool</h1>
        <p className="text-gray-600 mb-6">
          Easily delete specific pages from your PDF document with page previews.
        </p>
        <input
          type="file"
          id="pdfInput"
          accept="application/pdf"
          onChange={(e) => {
            setFile(e.target.files[0]);
            loadPDFPreview(e.target.files[0]);
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 mb-6"
        />
        {pages.length > 0 && (
          <div className="max-h-96 overflow-y-auto mb-6 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">Select pages to remove (click thumbnail to enlarge):</p>
            <div id="pageCheckboxes" className="grid grid-cols-2 gap-4">
              {pages.map((page) => (
                <div
                  key={page.pageNum}
                  className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md hover:bg-gray-100"
                >
                  <canvas
                    ref={(el) => {
                      if (el) {
                        const ctx = el.getContext("2d");
                        ctx.drawImage(page.canvas, 0, 0);
                      }
                    }}
                    width={page.canvas.width}
                    height={page.canvas.height}
                    className="cursor-pointer"
                    onClick={() => showPagePreview(page.pageNum)}
                  />
                  <input
                    type="checkbox"
                    id={`page${page.pageNum}`}
                    value={page.pageNum}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`page${page.pageNum}`} className="text-sm text-gray-700">
                    Page {page.pageNum}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={removePages}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Remove Selected Pages
        </button>
        {error && <div className="text-red-500 mt-4 text-sm text-center">{error}</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Page Preview</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>
        </div>
      )}

      <style jsx>{`
        input:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
}
