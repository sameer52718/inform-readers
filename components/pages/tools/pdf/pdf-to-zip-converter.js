"use client";
import { useState, useRef } from "react";
import Head from "next/head";
import Script from "next/script";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [status, setStatus] = useState("");
  const [imageQuality, setImageQuality] = useState("1.0");
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles([]);
    setPreviews([]);
    setStatus("");
    setProgress(0);

    if (selectedFiles.length > 0) {
      setStatus(`Processing ${selectedFiles.length} PDF(s)...`);
      const newPreviews = [];

      for (const file of selectedFiles) {
        if (file.type !== "application/pdf") {
          newPreviews.push({ name: file.name, error: "Invalid file type: Must be PDF" });
          continue;
        }
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.0 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const context = canvas.getContext("2d");
          await page.render({ canvasContext: context, viewport }).promise;
          newPreviews.push({ name: file.name, src: canvas.toDataURL("image/png"), pageCount: pdf.numPages });
        } catch (err) {
          newPreviews.push({ name: file.name, error: `Error: ${err.message}` });
        }
      }

      setFiles(selectedFiles);
      setPreviews(newPreviews);
      setStatus(`${selectedFiles.length} PDF(s) loaded`);
    } else {
      setStatus("No PDFs selected");
    }
  };

  const convertToZIP = async () => {
    if (files.length === 0) {
      setStatus("Please select at least one PDF file");
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setStatus("Converting to ZIP...");

    try {
      const zip = new JSZip();
      let totalPages = 0;
      let processedPages = 0;

      // Count total pages for progress
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
        totalPages += pdf.numPages;
      }

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
        const numPages = pdf.numPages;
        const pdfFolder = zip.folder(file.name.replace(".pdf", ""));

        for (let j = 1; j <= numPages; j++) {
          const page = await pdf.getPage(j);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const context = canvas.getContext("2d");
          await page.render({ canvasContext: context, viewport }).promise;

          const imgData = canvas.toDataURL("image/png", parseFloat(imageQuality));
          const imgBlob = await (await fetch(imgData)).blob();
          pdfFolder.file(`page_${j}.png`, imgBlob);

          processedPages++;
          setProgress((processedPages / totalPages) * 100);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "converted.zip");
      setStatus("ZIP file downloaded successfully!");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  return (
    <>
      <Head>
        <title>PDF to ZIP Converter (Multiple Files)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
        }}
      />
      <div className="bg-white  flex justify-center items-center p-4">
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">PDF to ZIP Converter (Multiple Files)</h1>
          <input
            type="file"
            accept=".pdf"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block w-full my-4 p-2 text-gray-700"
          />
          <select
            value={imageQuality}
            onChange={(e) => setImageQuality(e.target.value)}
            className="block w-full my-4 p-2 border border-gray-300 rounded-md"
          >
            <option value="0.6">Medium Quality (Smallest File)</option>
            <option value="0.8">High Quality (Smaller File)</option>
            <option value="1.0">Maximum Quality (Larger File)</option>
          </select>
          {previews.length > 0 && (
            <div className="my-4 max-h-72 overflow-y-auto border border-gray-300 p-2 text-left">
              {previews.map((preview, index) => (
                <div key={index} className="mb-2">
                  <strong className="text-gray-700">{preview.name}</strong>
                  <br />
                  {preview.src && (
                    <img src={preview.src} alt={`${preview.name} Page 1 Preview`} className="max-w-24 m-1" />
                  )}
                  {preview.error && <span className="text-red-500">{preview.error}</span>}
                  {preview.pageCount && <span className="text-gray-600"> ({preview.pageCount} pages)</span>}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={convertToZIP}
            disabled={isConverting}
            className={`bg-red-500 text-white px-5 py-2 rounded-md text-base font-medium ${
              isConverting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
            }`}
          >
            Convert to ZIP
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
          .max-w-2xl {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
