"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const pdfjsLib = dynamic(() => import("pdfjs-dist"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("pdfjs-dist").then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
      });
    }
  }, []);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreview(null);
    setStatus("");
    setProgress(0);

    if (selectedFile) {
      setStatus("Processing PDF...");
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        await page.render({ canvasContext: context, viewport }).promise;
        setPreview(canvas.toDataURL("image/png"));
        setStatus(`PDF loaded with ${pdf.numPages} page(s)`);
      } catch (err) {
        setStatus(`Error loading PDF: ${err.message}`);
        setPreview(null);
      }
    } else {
      setStatus("No PDF selected");
    }
  };

  const convertToPNG = async () => {
    if (!file) {
      setStatus("Please select a PDF file");
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setStatus("Converting to PNG...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        await page.render({ canvasContext: context, viewport }).promise;

        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `page_${i}.png`;
        link.click();

        setProgress((i / numPages) * 100);
      }

      setStatus("PNG files downloaded successfully!");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-xl w-full text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-6">PDF to PNG Converter</h1>
        <input
          type="file"
          id="pdfInput"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 mb-6"
        />
        {preview && (
          <div className="my-4 max-h-48 overflow-y-auto border border-gray-300 p-2 rounded-lg text-left">
            <img src={preview} alt="Page 1 Preview" className="max-w-[100px] m-1" />
          </div>
        )}
        <button
          onClick={convertToPNG}
          disabled={isConverting}
          className={`w-full py-3 px-4 rounded-lg text-white transition ${
            isConverting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Convert to PNG
        </button>
        {progress > 0 && (
          <progress
            className="w-full h-5 mt-4 rounded accent-red-500"
            max="100"
            value={progress}
          />
        )}
        {status && <div className="mt-4 text-gray-600">{status}</div>}
        <style jsx>{`
          input:focus {
            outline: none;
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
          }
          progress::-webkit-progress-value {
            background-color: #ef4444;
            border-radius: 4px;
          }
          progress::-webkit-progress-bar {
            background-color: #e5e7eb;
            border-radius: 4px;
          }
          progress::-moz-progress-bar {
            background-color: #ef4444;
            border-radius: 4px;
          }
        `}</style>
      </div>
    </div>
  );
}