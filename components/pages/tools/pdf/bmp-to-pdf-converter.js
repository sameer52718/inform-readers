"use client";
import { useState, useRef } from "react";
import { jsPDF } from "jspdf";

export default function Home() {
  const [images, setImages] = useState([]);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [status, setStatus] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages([]);
    setStatus("");
    setPreviewSrc(null);

    if (files.length > 0) {
      const firstFile = files[0];
      setPreviewSrc(URL.createObjectURL(firstFile));
      setStatus(`${files.length} image(s) selected`);

      const imagePromises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((imageData) => {
        setImages(imageData);
      });
    } else {
      setStatus("No images selected");
    }
  };

  const convertToPDF = () => {
    if (images.length === 0) {
      setStatus("Please select at least one BMP image");
      return;
    }

    const pdf = new jsPDF();
    let yOffset = 10;
    let processedImages = 0;

    images.forEach((imgData, index) => {
      if (index > 0) {
        pdf.addPage();
        yOffset = 10;
      }

      const img = new Image();
      img.src = imgData;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgWidth = 190; // A4 width minus margins
        const imgHeight = (img.height * imgWidth) / img.width;
        pdf.addImage(imgData, "BMP", 10, yOffset, imgWidth, imgHeight);

        processedImages++;
        if (processedImages === images.length) {
          pdf.save("converted.pdf");
          setStatus("PDF downloaded successfully!");
        }
      };
    });
  };

  return (
    <>
      <div className="bg-white min-h-screen flex justify-center items-center p-4">
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">BMP to PDF Converter</h1>
          <input
            type="file"
            accept="image/bmp"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block w-full my-4 text-gray-700"
          />
          {previewSrc && <img src={previewSrc} alt="Image Preview" className="max-w-full my-4" />}
          <button
            onClick={convertToPDF}
            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 text-base font-medium"
          >
            Convert to PDF
          </button>
          {status && <div className="mt-4 text-gray-700">{status}</div>}
        </div>
      </div>
      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
        }
        @media (max-width: 640px) {
          .max-w-md {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
