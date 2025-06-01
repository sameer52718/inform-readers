"use client";

import React, { useState, useRef } from "react";

const ImageNoiseReduction = () => {
  const [image, setImage] = useState(null);
  const [filterSize, setFilterSize] = useState(3);
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

    const size = parseInt(filterSize) || 3;
    if (size !== 3 && size !== 5) {
      setError("Please enter a valid filter size (3 or 5)");
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
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      const newData = new Uint8ClampedArray(data.length);
      const offset = Math.floor(size / 2);

      for (let y = offset; y < img.height - offset; y++) {
        for (let x = offset; x < img.width - offset; x++) {
          let r = 0,
            g = 0,
            b = 0,
            count = 0;
          for (let dy = -offset; dy <= offset; dy++) {
            for (let dx = -offset; dx <= offset; dx++) {
              const i = ((y + dy) * img.width + (x + dx)) * 4;
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              count++;
            }
          }
          const i = (y * img.width + x) * 4;
          newData[i] = r / count;
          newData[i + 1] = g / count;
          newData[i + 2] = b / count;
          newData[i + 3] = data[i + 3];
        }
      }

      ctx.putImageData(new ImageData(newData, img.width, img.height), 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      setResult(
        <a href={dataUrl} download="noise_reduced_image.png" className="text-red-600 hover:underline">
          Download Noise Reduced Image
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
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Image Noise Reduction</h1>
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
              <label className="block text-sm font-medium text-gray-700">Filter Size (3 or 5)</label>
              <input
                type="number"
                value={filterSize}
                onChange={(e) => setFilterSize(e.target.value)}
                min="3"
                max="5"
                step="2"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Reduce Noise
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

export default ImageNoiseReduction;
