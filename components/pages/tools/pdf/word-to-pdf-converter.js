"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const jsPDF = dynamic(() => import("jspdf").then((mod) => mod.jsPDF), { ssr: false });
const mammoth = dynamic(() => import("mammoth/mammoth.browser"), { ssr: false });

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
      setStatus(`Processing ${selectedFiles.length} document(s)...`);
      const newPreviewContent = [];

      for (let i = 0; i < Math.min(selectedFiles.length, 3); i++) {
        try {
          const arrayBuffer = await selectedFiles[i].arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          newPreviewContent.push({
            name: selectedFiles[i].name,
            text: result.value.slice(0, 200) + (result.value.length > 200 ? "..." : ""),
          });
        } catch (err) {
          newPreviewContent.push({ name: selectedFiles[i].name, error: err.message });
        }
      }
      setPreviewContent(newPreviewContent);
      setStatus(`${selectedFiles.length} document(s) loaded`);
    } else {
      setStatus("No documents selected");
    }
  };

  const convertToPDF = async () => {
    if (!files.length) {
      setStatus("Please select at least one Word document");
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setStatus("Converting to PDF...");

    try {
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const maxWidth = 180;
      let totalProgress = 0;

      for (let i = 0; i < files.length; i++) {
        try {
          const arrayBuffer = await files[i].arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          const html = result.value;

          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          let yOffset = 10;
          const lineHeight = 12 * 1.2;

          const processNode = async (node, depth = 0) => {
            if (yOffset > 270) {
              pdf.addPage();
              yOffset = 10;
            }

            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent.trim();
              if (text) {
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                const lines = pdf.splitTextToSize(text, maxWidth);
                lines.forEach((line) => {
                  if (yOffset > 270) {
                    pdf.addPage();
                    yOffset = 10;
                  }
                  pdf.text(line, 10, yOffset);
                  yOffset += lineHeight;
                });
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const tag = node.tagName.toLowerCase();
              if (tag === "strong") {
                pdf.setFont("helvetica", "bold");
              } else if (tag === "em") {
                pdf.setFont("helvetica", "italic");
              } else if (tag === "h1") {
                pdf.setFontSize(16);
                pdf.setFont("helvetica", "bold");
              } else if (tag === "h2") {
                pdf.setFontSize(14);
                pdf.setFont("helvetica", "bold");
              } else if (tag === "li") {
                pdf.text("• ", 10 + depth * 5, yOffset);
              } else if (tag === "img") {
                const src = node.src;
                if (src.startsWith("data:image")) {
                  const imgWidth = 100;
                  const imgHeight = (node.height * imgWidth) / node.width || 100 * (3 / 4);
                  if (yOffset + imgHeight > 270) {
                    pdf.addPage();
                    yOffset = 10;
                  }
                  pdf.addImage(
                    src,
                    src.split(";")[0].split(":")[1].split("/")[1].toUpperCase(),
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
                return;
              }

              for (const child of node.childNodes) {
                await processNode(child, tag === "ul" || tag === "ol" ? depth + 1 : depth);
              }

              if (tag === "p" || tag === "li" || tag.match(/^h[1-6]$/)) {
                yOffset += 5;
              }
            }
          };

          for (const child of doc.body.childNodes) {
            await processNode(child);
          }

          if (i < files.length - 1) {
            pdf.addPage();
          }

          totalProgress += 100 / files.length;
          setProgress(totalProgress);
        } catch (err) {
          setStatus(`Error processing ${files[i].name}: ${err.message}`);
          return;
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
    <div className="bg-white min-h-screen p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-xl w-full text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-6">Advanced Word to PDF Converter</h1>
        <input
          type="file"
          id="docInput"
          accept=".docx"
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
                {item.error ? <p className="text-red-500">Error: {item.error}</p> : <p>{item.text}</p>}
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
