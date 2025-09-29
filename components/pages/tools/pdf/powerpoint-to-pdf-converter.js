"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const jsPDF = dynamic(() => import("jspdf").then((mod) => mod.jsPDF), { ssr: false });
const JSZip = dynamic(() => import("jszip"), { ssr: false });

export default function Home() {
  const [files, setFiles] = useState([]);
  const [previewContent, setPreviewContent] = useState([]);
  const [imageQuality, setImageQuality] = useState("1.0");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setPreviewContent([]);
    setStatus("");

    if (selectedFiles.length > 0) {
      setStatus(`Processing ${selectedFiles.length} file(s)...`);
      const newPreviewContent = [];

      for (const file of selectedFiles) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const zip = await JSZip.loadAsync(arrayBuffer);
          const slideFiles = Object.keys(zip.files).filter((f) => f.startsWith("ppt/slides/slide"));
          newPreviewContent.push({ name: file.name, slideCount: slideFiles.length });
        } catch (err) {
          newPreviewContent.push({ name: file.name, error: err.message });
        }
      }
      setPreviewContent(newPreviewContent);
      setStatus(`${selectedFiles.length} file(s) loaded`);
    } else {
      setStatus("No files selected");
    }
  };

  const convertToPDF = async () => {
    if (!files.length) {
      setStatus("Please select at least one PowerPoint file");
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setStatus("Converting to PDF...");

    try {
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const maxWidth = 180;
      const maxHeight = 270;
      let totalSlides = 0;
      let processedSlides = 0;

      // Count total slides
      for (const file of files) {
        const zip = await JSZip.loadAsync(await file.arrayBuffer());
        const slideFiles = Object.keys(zip.files).filter((f) => f.startsWith("ppt/slides/slide"));
        totalSlides += slideFiles.length;
      }

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        const slideFiles = Object.keys(zip.files)
          .filter((f) => f.startsWith("ppt/slides/slide"))
          .sort((a, b) => {
            const aNum = parseInt(a.match(/slide(\d+)\.xml/)[1]);
            const bNum = parseInt(b.match(/slide(\d+)\.xml/)[1]);
            return aNum - bNum;
          });

        for (let j = 0; j < slideFiles.length; j++) {
          if (processedSlides > 0) {
            pdf.addPage();
          }

          const slideXml = await zip.file(slideFiles[j]).async("string");
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(slideXml, "text/xml");

          let yOffset = 10;
          const lineHeight = 12 * 1.2;

          // Extract text
          const textNodes = xmlDoc.getElementsByTagName("a:t");
          for (const node of textNodes) {
            const text = node.textContent.trim();
            if (text) {
              pdf.setFontSize(12);
              pdf.setFont("helvetica", "normal");
              const lines = pdf.splitTextToSize(text, maxWidth);
              lines.forEach((line) => {
                if (yOffset > maxHeight) {
                  pdf.addPage();
                  yOffset = 10;
                }
                pdf.text(line, 10, yOffset);
                yOffset += lineHeight;
              });
            }
          }

          // Extract images
          const relsFile = `ppt/slides/_rels/slide${j + 1}.xml.rels`;
          if (zip.files[relsFile]) {
            const relsXml = await zip.file(relsFile).async("string");
            const relsDoc = parser.parseFromString(relsXml, "text/xml");
            const relationships = relsDoc.getElementsByTagName("Relationship");
            for (const rel of relationships) {
              const target = rel.getAttribute("Target");
              if (target.includes("media/")) {
                const mediaFile = `ppt/${target.replace("../", "")}`;
                if (zip.files[mediaFile]) {
                  const imgData = await zip.file(mediaFile).async("base64");
                  const imgType = mediaFile.split(".").pop().toUpperCase();
                  const imgWidth = 100;
                  const imgHeight = 100 * (3 / 4);
                  if (yOffset + imgHeight > maxHeight) {
                    pdf.addPage();
                    yOffset = 10;
                  }
                  pdf.addImage(
                    `data:image/${imgType.toLowerCase()};base64,${imgData}`,
                    imgType,
                    10,
                    yOffset,
                    imgWidth,
                    imgHeight,
                    undefined,
                    "FAST",
                    parseFloat(imageQuality)
                  );
                  yOffset += imgHeight + 5;
                }
              }
            }
          }

          processedSlides++;
          setProgress((processedSlides / totalSlides) * 100);
        }
      }

      pdf.save("converted.pdf");
      setStatus("PDF downloaded successfully!");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-xl w-full text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-6">Advanced PowerPoint to PDF Converter</h1>
        <input
          type="file"
          id="pptInput"
          accept=".pptx"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 mb-4"
        />
        <select
          id="imageQuality"
          value={imageQuality}
          onChange={(e) => setImageQuality(e.target.value)}
          className="w-full max-w-xs border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="0.6">Medium Quality (Smallest File)</option>
          <option value="0.8">High Quality (Smaller File)</option>
          <option value="1.0">Maximum Quality (Larger File)</option>
        </select>
        {previewContent.length > 0 && (
          <div className="my-4 max-h-72 overflow-y-auto border border-gray-300 p-2 rounded-lg text-left">
            {previewContent.map((item, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold">{item.name}</h3>
                {item.error ? (
                  <p className="text-red-500">Error: {item.error}</p>
                ) : (
                  <p>{item.slideCount} slides detected</p>
                )}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={convertToPDF}
          disabled={isConverting}
          className={`w-full py-3 px-4 rounded-lg text-white transition ${
            isConverting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Convert to PDF
        </button>
        {progress > 0 && (
          <progress className="w-full h-5 mt-4 rounded accent-red-500" max="100" value={progress} />
        )}
        {status && <div className="mt-4 text-gray-600">{status}</div>}
        <style jsx>{`
          input:focus,
          select:focus {
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
