"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PDFLib = dynamic(() => import("pdf-lib").then((mod) => mod.PDFDocument), { ssr: false });

export default function Home() {
  const [file, setFile] = useState(null);
  const [rotationAngle, setRotationAngle] = useState("90");
  const [error, setError] = useState("");

  const rotatePDF = async () => {
    setError("");

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
      const pdfDoc = await PDFLib.load(arrayBuffer);

      pdfDoc.getPages().forEach((page) => {
        const currentRotation = page.getRotation().angle || 0;
        page.setRotation(PDFLib.degrees(currentRotation + parseInt(rotationAngle)));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rotated.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      setError("An error occurred while rotating the PDF. Please try again.");
      console.error("Rotation error:", err);
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Rotate PDF Tool</h1>
        <p className="text-gray-600 mb-4">Adjust the orientation of pages in your PDF document.</p>
        <input
          type="file"
          id="pdfInput"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 mb-4"
        />
        <select
          id="rotationAngle"
          value={rotationAngle}
          onChange={(e) => setRotationAngle(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="90">Rotate 90° Clockwise</option>
          <option value="180">Rotate 180°</option>
          <option value="270">Rotate 270° Clockwise</option>
        </select>
        <button
          onClick={rotatePDF}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
        >
          Rotate PDF
        </button>
        {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
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
