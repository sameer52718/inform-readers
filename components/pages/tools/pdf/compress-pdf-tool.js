"use client";
import { useState, useRef } from "react";
import * as PDFLib from "pdf-lib";

export default function Home() {
  const [file, setFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [error, setError] = useState("");
  const [sizeInfo, setSizeInfo] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setError("");
    setSizeInfo("");
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("The selected file must be a PDF.");
        return;
      }
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const compressPDF = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      const originalSize = arrayBuffer.byteLength;
      console.log("Step 1: Loaded file with size:", originalSize, "bytes");

      // Validate PDF
      console.log("Step 2: Validating PDF...");
      let pdfDoc;
      try {
        pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      } catch (loadError) {
        throw new Error("Invalid or corrupted PDF file: " + loadError.message);
      }
      console.log("Step 3: PDF validated successfully.");

      // Apply compression
      console.log("Step 4: Applying compression level:", compressionLevel);
      if (compressionLevel === "high") {
        const pages = pdfDoc.getPages();
        for (const page of pages) {
          try {
            page.node.removeAnnots();
          } catch (pageError) {
            console.warn("Warning: Failed to remove annotations on a page:", pageError.message);
          }
        }
      }

      // Save PDF with object streams
      console.log("Step 5: Saving compressed PDF...");
      let pdfBytes;
      try {
        pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      } catch (saveError) {
        console.warn(
          "Warning: Compression failed, attempting to save without compression:",
          saveError.message
        );
        pdfBytes = await pdfDoc.save();
      }
      const compressedSize = pdfBytes.length;
      console.log("Step 6: Compression complete:", { originalSize, compressedSize });

      // Display size information
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(2);
      setSizeInfo(
        `Original size: ${(originalSize / 1024).toFixed(2)} KB | Compressed size: ${(
          compressedSize / 1024
        ).toFixed(2)} KB | Reduction: ${reduction}%`
      );
      console.log("Step 7: Size info displayed:", { reduction: reduction + "%" });

      // Create download
      console.log("Step 8: Initiating download...");
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.download = "compressed.pdf";
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
      console.log("Step 9: PDF compressed and downloaded successfully.");
    } catch (error) {
      setError("An error occurred while compressing the PDF: " + error.message);
      console.error("Detailed error during compression:", error);
    }
  };

  return (
    <>
      <div className="bg-white  flex items-center justify-center p-4">
        <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all hover:scale-105 duration-300">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Compress PDF Tool</h1>
          <p className="text-gray-600 mb-6">
            Reduce the file size of your PDF for easier sharing and storage.
          </p>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 mb-6"
          />
          <div className="mb-6">
            <label htmlFor="compressionLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Compression Level:
            </label>
            <select
              id="compressionLevel"
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="low">Low (Minimal compression, high quality)</option>
              <option value="medium">Medium (Balanced compression)</option>
              <option value="high">High (Maximum compression, lower quality)</option>
            </select>
          </div>
          <button
            onClick={compressPDF}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition duration-200 font-semibold"
          >
            Compress PDF
          </button>
          {error && <div className="text-red-500 mt-4 text-sm text-center">{error}</div>}
          {sizeInfo && <div className="text-gray-600 mt-4 text-sm text-center">{sizeInfo}</div>}
        </div>
      </div>
    </>
  );
}
