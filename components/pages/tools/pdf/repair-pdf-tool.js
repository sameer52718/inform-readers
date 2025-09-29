"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PDFLib = dynamic(() => import("pdf-lib").then((mod) => mod.PDFDocument), { ssr: false });

export default function Home() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const repairPDF = async () => {
    setError("");
    setStatus("");

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("The selected file must be a PDF.");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalSize = arrayBuffer.byteLength;

      let pdfDoc;
      try {
        pdfDoc = await PDFLib.load(arrayBuffer, { ignoreEncryption: true });
      } catch (loadError) {
        throw new Error("Failed to parse PDF. The file may be severely corrupted: " + loadError.message);
      }

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const repairedSize = pdfBytes.length;

      setStatus(
        `Original size: ${(originalSize / 1024).toFixed(2)} KB | Repaired size: ${(
          repairedSize / 1024
        ).toFixed(2)} KB`
      );

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "repaired.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      setError("An error occurred while repairing the PDF: " + err.message);
      console.error("Repair error:", err);
    }
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-lg w-full">
        <h1 className="text-3xl font-extrabold text-red-500 mb-3">Repair PDF Tool</h1>
        <p className="text-gray-600 mb-6">
          Upload a corrupted PDF to attempt repair and download the fixed file.
        </p>
        <input
          type="file"
          id="pdfInput"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 mb-6"
        />
        <button
          onClick={repairPDF}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Repair PDF
        </button>
        {error && <div className="text-red-500 mt-4 text-sm text-center">{error}</div>}
        {status && <div className="text-gray-600 mt-4 text-sm text-center">{status}</div>}
        <style jsx>{`
          input:focus {
            outline: none;
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
}
