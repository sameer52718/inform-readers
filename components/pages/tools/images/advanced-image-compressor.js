"use client";

import React, { useState, useRef } from "react";

const ImageCompressor = () => {
  const [image, setImage] = useState(null);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1024);
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

    const q = parseFloat(quality) || 0.8;
    const mw = parseInt(maxWidth) || 1024;

    if (q < 0.1 || q > 1) {
      setError("Please enter a valid quality (0.1-1)");
      return;
    }
    if (mw < 100) {
      setError("Please enter a valid max width (>=100)");
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
      const aspectRatio = img.height / img.width;
      const newWidth = Math.min(img.width, mw);
      const newHeight = newWidth * aspectRatio;
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const dataUrl = canvas.toDataURL("image/jpeg", q);
      setResult(
        <a href={dataUrl} download="compressed_image.jpg" className="text-red-600 hover:underline">
          Download Compressed Image
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
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Advanced Image Compressor</h1>
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
            <div className="controls grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quality (0.1-1)</label>
                <input
                  type="number"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  min="0.1"
                  max="1"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Width (px)</label>
                <input
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  min="100"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Compress Image
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

export default ImageCompressor;
