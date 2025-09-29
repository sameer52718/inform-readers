"use client";

import React, { useState } from "react";

const ImageToSvg = () => {
  const [image, setImage] = useState(null);
  const [threshold, setThreshold] = useState(128);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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

    const thresh = parseInt(threshold) || 128;
    if (thresh < 0 || thresh > 255) {
      setError("Please enter a valid threshold (0-255)");
      return;
    }

    try {
      const img = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(image);
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      let svg = `<svg width="${img.width}" height="${img.height}" xmlns="http://www.w3.org/2000/svg">`;
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const i = (y * img.width + x) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness > thresh) {
            svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="white"/>`;
          }
        }
      }
      svg += "</svg>";

      const blob = new Blob([svg], { type: "image/svg+xml" });
      const dataUrl = URL.createObjectURL(blob);
      setResult(
        <a href={dataUrl} download="image.svg" className="text-red-600 hover:underline">
          Download SVG
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
    <div className=" bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Image to SVG</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Threshold (0-255)</label>
            <input
              type="number"
              min="0"
              max="255"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Convert to SVG
          </button>
        </form>
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        {result && <div className="text-center mt-4">{result}</div>}
      </div>
    </div>
  );
};

export default ImageToSvg;
