"use client";

import React, { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

const PdfToJpg = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setDownloadLink("");
  };

  const handleConvert = async () => {
    setError("");
    setDownloadLink("");

    if (!file) {
      setError("Please upload a PDF");
      return;
    }

    try {
      setLoading(true);

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1 });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      const dataUrl = canvas.toDataURL("image/jpeg");
      setDownloadLink(dataUrl);
    } catch (err) {
      setError("Error converting PDF");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg space-y-6">
        <h1 className="text-3xl text-gray-700 font-semibold text-center">PDF to JPG</h1>

        <div>
          <label htmlFor="pdfInput" className="block mb-2 text-gray-700 font-medium">
            Upload PDF
          </label>
          <input
            id="pdfInput"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-red-50 file:text-red-700
              hover:file:bg-red-100
              "
          />
        </div>

        <button
          onClick={handleConvert}
          disabled={loading}
          className={`w-full py-2 px-4 font-semibold rounded-md text-white 
            ${loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}
          `}
        >
          {loading ? "Converting..." : "Convert to JPG"}
        </button>

        <canvas ref={canvasRef} className="w-full rounded-md border border-gray-600" />

        {error && <p className="text-red-500 text-center">{error}</p>}

        {downloadLink && (
          <div className="text-center mt-4">
            <a
              href={downloadLink}
              download="converted_image.jpg"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Download JPG
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfToJpg;
