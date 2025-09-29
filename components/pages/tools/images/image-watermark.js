"use client";

import React, { useState, useRef } from "react";

const ImageWatermark = () => {
  const [image, setImage] = useState(null);
  const [watermark, setWatermark] = useState(null);
  const [xPos, setXPos] = useState(10);
  const [yPos, setYPos] = useState(10);
  const [opacity, setOpacity] = useState(0.5);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setError("");
    setResult(null);
  };

  const handleWatermarkChange = (e) => {
    setWatermark(e.target.files[0]);
    setError("");
    setResult(null);
  };

  const processImage = async () => {
    if (!image || !watermark) {
      setError("Please upload both an image and a watermark");
      return;
    }

    const x = parseInt(xPos) || 10;
    const y = parseInt(yPos) || 10;
    const op = parseFloat(opacity) || 0.5;

    if (op < 0 || op > 1) {
      setError("Please enter a valid opacity (0-1)");
      return;
    }

    try {
      const img = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(image);
      });

      const wmark = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load watermark"));
        img.src = URL.createObjectURL(watermark);
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = op;
      ctx.drawImage(wmark, x, y);

      const dataUrl = canvas.toDataURL("image/png");
      setResult(
        <a href={dataUrl} download="watermarked_image.png" className="text-red-600 hover:underline">
          Download Watermarked Image
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
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Image Watermark</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="input-group">
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
              <label className="block text-sm font-medium text-gray-700 mt-4">Upload Watermark Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleWatermarkChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>
            <div className="controls grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">X Position (px)</label>
                <input
                  type="number"
                  value={xPos}
                  onChange={(e) => setXPos(e.target.value)}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Y Position (px)</label>
                <input
                  type="number"
                  value={yPos}
                  onChange={(e) => setYPos(e.target.value)}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Opacity (0-1)</label>
                <input
                  type="number"
                  value={opacity}
                  onChange={(e) => setOpacity(e.target.value)}
                  min="0"
                  max="1"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Add Watermark
            </button>
          </form>
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          <canvas ref={canvasRef} className="w-full mt-4 border border-gray-300" />
          {result && <div className="text-center mt-4">{result}</div>}
        </div>
      </div>
    </div>
  );
};

export default ImageWatermark;
