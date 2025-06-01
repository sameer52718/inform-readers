"use client";

import React, { useState, useRef } from "react";

const CompressImage = () => {
  const [image, setImage] = useState(null);
  const [maxSize, setMaxSize] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setError("");
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!image) {
      setError("Please upload an image");
      return;
    }

    if (!maxSize || maxSize <= 0) {
      setError("Please enter a valid max size");
      return;
    }

    try {
      const compressedFile = await imageCompression(image, {
        maxSizeMB: parseFloat(maxSize),
      });

      const img = await new Promise((resolve, reject) => {
        const imgEl = new Image();
        imgEl.onload = () => resolve(imgEl);
        imgEl.onerror = () => reject(new Error("Failed to load compressed image"));
        imgEl.src = URL.createObjectURL(compressedFile);
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/jpeg");
      setResult(
        <a href={dataUrl} download="compressed_image.jpg" className="text-red-600 hover:underline">
          Download Compressed Image
        </a>
      );
    } catch (err) {
      setError("Error compressing image");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Compress Image</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="input-group">
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>
            <div className="controls">
              <label className="block text-sm font-medium text-gray-700">Max Size (MB)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 bg-white shadow-sm text-gray-700 focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Compress
            </button>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <canvas ref={canvasRef} className="w-full mt-4 border border-gray-300" />
          {result && <div className="text-center mt-4">{result}</div>}
        </div>
      </div>
    </div>
  );
};

export default CompressImage;
