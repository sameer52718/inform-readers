"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const PDFLib = dynamic(() => import("pdf-lib").then((mod) => mod.PDFDocument), { ssr: false });
const pdfjsLib = dynamic(() => import("pdfjs-dist"), { ssr: false });
const Sortable = dynamic(() => import("sortablejs"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageOrder, setPageOrder] = useState([]);
  const [pages, setPages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(null);
  const [currentScale, setCurrentScale] = useState(1.5);
  const [error, setError] = useState("");
  const pageContainerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("pdfjs-dist").then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
      });
    }
  }, []);

  useEffect(() => {
    if (pageContainerRef.current && pages.length > 0) {
      import("sortablejs").then((Sortable) => {
        new Sortable(pageContainerRef.current, {
          animation: 150,
          onEnd: (evt) => {
            const newOrder = [...pageOrder];
            const [movedPage] = newOrder.splice(evt.oldIndex, 1);
            newOrder.splice(evt.newIndex, 0, movedPage);
            setPageOrder(newOrder);
          },
        });
      });
    }
  }, [pages, pageOrder]);

  const loadPDFPreview = async (selectedFile) => {
    setError("");
    setPages([]);
    setPageOrder([]);
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
      const newOrder = Array.from({ length: pageCount }, (_, i) => i);
      setPageOrder(newOrder);

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
    setCurrentScale(1.5);
    await renderPreview(pageNum, 1.5);
    setIsModalOpen(true);
  };

  const renderPreview = async (pageNum, scale) => {
    if (!pdfDoc || !pageNum) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const maxHeight = window.innerHeight * 0.65;
      const viewportDefault = page.getViewport({ scale: 1.5 });
      const defaultScale = Math.min(1.5, maxHeight / viewportDefault.height);
      const finalScale = scale || defaultScale;

      const viewport = page.getViewport({ scale: finalScale });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");
      await page.render({ canvasContext: context, viewport }).promise;

      document.getElementById("zoomSlider").value = finalScale;
    } catch (err) {
      console.error("Error rendering preview:", err);
    }
  };

  const zoomIn = () => {
    const newScale = Math.min(currentScale + 0.2, 3);
    setCurrentScale(newScale);
    renderPreview(currentPageNum, newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(currentScale - 0.2, 0.5);
    setCurrentScale(newScale);
    renderPreview(currentPageNum, newScale);
  };

  const zoomPreview = (scale) => {
    const newScale = parseFloat(scale);
    setCurrentScale(newScale);
    renderPreview(currentPageNum, newScale);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  const organizePDF = async () => {
    setError("");

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("The selected file must be a PDF.");
      return;
    }
    if (!pageOrder.length) {
      setError("No pages available to organize.");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDocLib = await PDFLib.load(arrayBuffer);
      const newPdf = await PDFLib.create();

      for (const pageIndex of pageOrder) {
        const [copiedPage] = await newPdf.copyPages(pdfDocLib, [pageIndex]);
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reordered.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      setError("An error occurred while reorganizing pages. Please try again.");
      console.error("Error reorganizing PDF:", err);
    }
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-3xl w-full">
        <h1 className="text-3xl font-extrabold text-red-500 mb-3">Organize PDF Tool</h1>
        <p className="text-gray-600 mb-6">Rearrange pages in your PDF document with drag-and-drop ease.</p>
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
            <p className="text-sm text-gray-700 mb-2">Drag and drop pages to reorder:</p>
            <div ref={pageContainerRef} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pages.map((page, index) => (
                <div
                  key={page.pageNum}
                  className="page-item p-2 bg-gray-50 rounded-md hover:bg-gray-100 cursor-move"
                  data-page={page.pageNum - 1}
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
                    className="cursor-pointer w-full"
                    onClick={() => showPagePreview(page.pageNum)}
                  />
                  <div className="text-sm text-gray-700 mt-1">Page {page.pageNum}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={organizePDF}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Save Reordered PDF
        </button>
        {error && <div className="text-red-500 mt-4 text-sm text-center">{error}</div>}
      </div>

      {isModalOpen && (
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
              <button onClick={closeModal} className="text-gray-600 text-2xl font-bold hover:text-gray-800">
                ×
              </button>
            </div>
            <div className="flex items-center justify-center mb-4 space-x-4">
              <button
                onClick={zoomOut}
                className="bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300"
                title="Zoom Out"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              <input
                type="range"
                id="zoomSlider"
                min="0.5"
                max="3"
                step="0.1"
                value={currentScale}
                onChange={(e) => zoomPreview(e.target.value)}
                className="w-32 accent-red-500"
              />
              <button
                onClick={zoomIn}
                className="bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300"
                title="Zoom In"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="flex-grow overflow-auto flex items-center justify-center">
              <canvas ref={canvasRef} className="max-w-full max-h-[65vh] h-auto" />
            </div>
            <div className="sticky bottom-0 bg-white pt-4 text-center">
              <button
                onClick={closeModal}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        input:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
        }
        input[type="range"] {
          accent-color: #ef4444;
        }
      `}</style>
    </div>
  );
}
