"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const jsPDF = dynamic(() => import("jspdf").then((mod) => mod.jsPDF), { ssr: false });

export default function Home() {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setImages([]);
    setStatus("");

    if (selectedFiles.length > 0) {
      setStatus(`${selectedFiles.length} image(s) selected`);
      const newImages = [];
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target.result);
          if (newImages.length === selectedFiles.length) {
            setImages(newImages);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setStatus("No images selected");
    }
  };

  const convertToPDF = async () => {
    if (images.length === 0) {
      setStatus("Please select at least one PNG image");
      return;
    }

    try {
      const pdf = new jsPDF();
      let yOffset = 10;

      for (let index = 0; index < images.length; index++) {
        if (index > 0) {
          pdf.addPage();
          yOffset = 10;
        }

        const imgData = images[index];
        const img = new Image();
        img.src = imgData;

        await new Promise((resolve) => {
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imgWidth = 190; // A4 width minus margins
            const imgHeight = (img.height * imgWidth) / img.width;
            pdf.addImage(imgData, "PNG", 10, yOffset, imgWidth, imgHeight);
            resolve();
          };
        });

        if (index === images.length - 1) {
          pdf.save("converted.pdf");
          setStatus("PDF downloaded successfully!");
        }
      }
    } catch (err) {
      setStatus("Error converting to PDF. Check console for details.");
      console.error("Conversion error:", err);
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-6">PNG to PDF Converter</h1>
        <input
          type="file"
          id="imageInput"
          accept="image/png"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 mb-6"
        />
        {files.length > 0 && (
          <img
            src={URL.createObjectURL(files[0])}
            alt="Image Preview"
            className="max-w-full my-4 rounded-lg"
          />
        )}
        <button
          onClick={convertToPDF}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Convert to PDF
        </button>
        {status && <div className="mt-4 text-gray-600">{status}</div>}
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
