"use client";
import { useState, useRef } from "react";
import Script from "next/script";

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [status, setStatus] = useState("");
  const [resolution, setResolution] = useState("2.0");
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef(null);

  const canvasToBMP = (canvas) => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    // BMP header (simplified for 24-bit BMP)
    const fileSize = 54 + width * height * 3;
    const bmpHeader = new ArrayBuffer(54);
    const view = new DataView(bmpHeader);
    view.setUint8(0, 66); // 'B'
    view.setUint8(1, 77); // 'M'
    view.setUint32(2, fileSize, true);
    view.setUint32(10, 54, true); // Pixel data offset
    view.setUint32(14, 40, true); // DIB header size
    view.setInt32(18, width, true);
    view.setInt32(22, height, true);
    view.setUint16(26, 1, true); // Planes
    view.setUint16(28, 24, true); // Bits per pixel
    view.setUint32(34, width * height * 3, true); // Image size

    // Pixel data
    const rowPadding = (4 - ((width * 3) % 4)) % 4;
    const pixelData = new Uint8Array(width * height * 3 + height * rowPadding);
    let offset = 0;
    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        pixelData[offset++] = data[idx + 2]; // B
        pixelData[offset++] = data[idx + 1]; // G
        pixelData[offset++] = data[idx]; // R
      }
      for (let p = 0; p < rowPadding; p++) {
        pixelData[offset++] = 0;
      }
    }

    // Combine header and pixel data
    const bmp = new Blob([bmpHeader, pixelData], { type: "image/bmp" });
    return URL.createObjectURL(bmp);
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(null);
    setPreviewSrc(null);
    setStatus("");
    setProgress(0);

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setStatus("The selected file must be a PDF.");
        return;
      }
      setFile(selectedFile);
      setStatus("Processing PDF...");

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        await page.render({ canvasContext: context, viewport }).promise;
        setPreviewSrc(canvas.toDataURL("image/png"));
        setStatus(`PDF loaded with ${pdf.numPages} page(s)`);
      } catch (err) {
        setStatus(`Error loading PDF: ${err.message}`);
        setPreviewSrc(null);
      }
    } else {
      setStatus("No PDF selected");
    }
  };

  const convertToBMP = async () => {
    if (!file) {
      setStatus("Please select a PDF file");
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setStatus("Converting to BMP...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: parseFloat(resolution) });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        await page.render({ canvasContext: context, viewport }).promise;

        const bmpUrl = canvasToBMP(canvas);
        const link = document.createElement("a");
        link.href = bmpUrl;
        link.download = `page_${i}.bmp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(bmpUrl);

        setProgress((i / numPages) * 100);
      }

      setStatus("BMP files downloaded successfully!");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsConverting(false);
      setProgress(0);
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
      <div className="bg-white min-h-screen flex justify-center items-center p-4">
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center max-w-xl w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">PDF to BMP Converter</h1>
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block w-full my-4 p-2 text-gray-700"
          />
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="block w-full my-4 p-2 border border-gray-300 rounded-md"
          >
            <option value="0.5">Low Resolution (Smallest File)</option>
            <option value="1.0">Standard Resolution (Smaller File)</option>
            <option value="2.0">High Resolution (Larger File)</option>
          </select>
          {previewSrc && (
            <div className="my-4 max-h-48 overflow-y-auto border border-gray-300 p-2 text-left">
              <img src={previewSrc} alt="Page 1 Preview" className="max-w-24 m-1" />
            </div>
          )}
          <button
            onClick={convertToBMP}
            disabled={isConverting}
            className={`bg-red-500 text-white px-5 py-2 rounded-md text-base font-medium ${
              isConverting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
            }`}
          >
            Convert to BMP
          </button>
          {progress > 0 && <progress value={progress} max="100" className="w-full h-5 my-4" />}
          {status && <div className="mt-4 text-gray-700">{status}</div>}
        </div>
      </div>
      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
        }
        progress::-webkit-progress-bar {
          background-color: #e5e7eb;
          border-radius: 5px;
        }
        progress::-webkit-progress-value {
          background-color: #ef4444;
          border-radius: 5px;
        }
        progress::-moz-progress-bar {
          background-color: #ef4444;
          border-radius: 5px;
        }
        @media (max-width: 640px) {
          .max-w-xl {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
