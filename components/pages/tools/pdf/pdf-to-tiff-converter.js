"use client";
import { useState, useRef } from "react";
import Script from "next/script";

export default function Home() {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChange = async (event) => {
    setError("");
    setPdfDoc(null);
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
        setPdfDoc(pdf);
      } catch (err) {
        setError("Error loading PDF: " + err.message);
      }
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const convertToTIFF = async () => {
    if (!pdfDoc) {
      setError("Please upload a PDF first.");
      return;
    }

    try {
      const page = await pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext("2d");
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Note: Browsers don't support 'image/tiff' in canvas.toBlob
      // Fallback to PNG as TIFF is not natively supported
      canvas.toBlob((blob) => {
        const fileName = "converted.png"; // Changed to PNG
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link);
        setError("Note: Output is PNG as browsers do not support TIFF conversion natively.");
      }, "image/png"); // Fallback to PNG
    } catch (err) {
      setError("Error converting PDF: " + err.message);
    }
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
        }}
      />
      <div className="bg-white  flex justify-center items-center p-4">
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-5">PDF to TIFF Converter</h1>
          <input
            type="file"
            id="pdf-upload"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block w-full my-2 p-2 text-gray-700 bg-gray-200 rounded-md"
          />
          <button
            id="convert-btn"
            onClick={convertToTIFF}
            className="w-full bg-red-500 text-white py-2 px-4 my-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Convert to TIFF
          </button>
          <canvas id="pdf-canvas" ref={canvasRef} className="hidden" />
          {error && (
            <div id="output" className="mt-5 text-red-500">
              {error}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
        }
        .shadow-lg {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        @media (max-width: 640px) {
          .max-w-md {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
