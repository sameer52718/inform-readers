"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const pdfjsLib = dynamic(() => import("pdfjs-dist"), { ssr: false });
const docx = dynamic(() => import("docx"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("pdfjs-dist").then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
      });
    }
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPdfDoc(null);

    if (selectedFile && selectedFile.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = function () {
        const typedarray = new Uint8Array(this.result);
        pdfjsLib
          .getDocument(typedarray)
          .promise.then((pdf) => {
            setPdfDoc(pdf);
          })
          .catch((err) => {
            alert("Error loading PDF: " + err.message);
          });
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const convertToWord = async () => {
    if (!pdfDoc) {
      alert("Please upload a PDF first.");
      return;
    }

    setIsLoading(true);

    try {
      let fullText = "";
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n\n";
      }

      const { Document, Packer, Paragraph } = docx;
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: fullText,
                spacing: { after: 300 },
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "converted.docx";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      alert("Error converting to Word: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-10 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-5">PDF to Word Converter</h1>
        <input
          type="file"
          id="pdf-upload"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 mb-4"
        />
        <button
          onClick={convertToWord}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Convert to Word
        </button>
        {isLoading && <div className="mt-5 font-bold text-red-500">Processing...</div>}
        <div id="output" />
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
