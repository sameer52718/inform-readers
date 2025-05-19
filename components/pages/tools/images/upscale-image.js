"use client";

import React, { useState, useRef, useEffect } from "react";

const UpscaleImage = () => {
  const [image, setImage] = useState(null);
  const [scaleFactor, setScaleFactor] = useState(2); // Default to 2 as per the logic
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setError("");
    setResult(null);
  };

  const processImage = async () => {
    if (!image) {
      setError("Please upload an image");
      return;
    }

    const scale = parseInt(scaleFactor) || 2;
    if (scale < 1 || scale > 4) {
      setError("Please enter a valid scale factor (1-4)");
      return;
    }

    try {
      const img = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(image);
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.imageSmoothingEnabled = false; // Nearest-neighbor interpolation
      ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);

      const dataUrl = canvas.toDataURL("image/png");
      setResult(
        <a href={dataUrl} download="upscaled_image.png" className="text-blue-600 hover:underline">
          Download Upscaled Image
        </a>
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processImage();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Upscale Image</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Scale Factor (1-4)</label>
            <input
              type="number"
              min="1"
              max="4"
              value={scaleFactor}
              onChange={(e) => setScaleFactor(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upscale Image
          </button>
        </form>
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        <canvas ref={canvasRef} className="hidden" />
        {result && <div className="text-center mt-4">{result}</div>}
      </div>
    </div>
  );
};

export default UpscaleImage;
