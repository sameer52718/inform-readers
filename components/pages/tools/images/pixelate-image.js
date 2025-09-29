"use client";

import React, { useState, useRef } from "react";

const PixelateImage = () => {
  const [pixelSize, setPixelSize] = useState(10);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setError("");
    setDownloadUrl("");
  };

  const handlePixelSizeChange = (e) => {
    setPixelSize(Number(e.target.value));
  };

  const handleProcess = async () => {
    setError("");
    setDownloadUrl("");
    if (!imageFile) {
      setError("Please upload an image");
      return;
    }
    if (pixelSize <= 0) {
      setError("Please enter a valid pixel size");
      return;
    }

    try {
      const img = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(imageFile);
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.imageSmoothingEnabled = false;

      // First draw small, then upscale
      ctx.drawImage(img, 0, 0, img.width / pixelSize, img.height / pixelSize);
      ctx.drawImage(canvas, 0, 0, img.width / pixelSize, img.height / pixelSize, 0, 0, img.width, img.height);

      const dataUrl = canvas.toDataURL("image/png");
      setDownloadUrl(dataUrl);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className=" bg-gray-50 py-12 flex justify-center items-center px-4">
      <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-red-500 text-center">Pixelate Image</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-red-50 file:text-red-700
              hover:file:bg-red-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pixel Size</label>
          <input
            type="number"
            min="1"
            value={pixelSize}
            onChange={handlePixelSizeChange}
            className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <button
          onClick={handleProcess}
          className="w-full py-2 px-4 font-semibold rounded-md text-white bg-red-500 hover:bg-red-600"
        >
          Pixelate
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <canvas ref={canvasRef} className="w-full border border-gray-300 rounded-md" />

        {downloadUrl && (
          <div className="text-center mt-4">
            <a href={downloadUrl} download="pixelated_image.png" className="text-red-500 hover:underline">
              Download Pixelated Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PixelateImage;
