"use client";

import React, { useState, useRef } from "react";

const CollageMaker = () => {
  const [images, setImages] = useState([]);
  const [cols, setCols] = useState(2);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
    setError("");
    setResult(null);
  };

  const processImages = async () => {
    if (!images || images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    const columns = parseInt(cols) || 2;
    if (columns <= 0) {
      setError("Please enter a valid number of columns");
      return;
    }

    try {
      const loadedImages = await Promise.all(
        images.map(
          (file) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error("Failed to load image"));
              img.src = URL.createObjectਮ;
              URL.createObjectURL(file);
            })
        )
      );

      const rows = Math.ceil(loadedImages.length / columns);
      const maxWidth = Math.max(...loadedImages.map((img) => img.width));
      const maxHeight = Math.max(...loadedImages.map((img) => img.height));

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = maxWidth * columns;
      canvas.height = maxHeight * rows;

      loadedImages.forEach((img, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        ctx.drawImage(img, col * maxWidth, row * maxHeight, maxWidth, maxHeight);
      });

      const dataUrl = canvas.toDataURL("image/png");
      setResult(
        <a href={dataUrl} download="collage.png" className="text-red-600 hover:underline">
          Download Collage
        </a>
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processImages();
  };

  return (
    <div className=" bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Collage Maker</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="input-group">
              <label className="block text-sm font-medium text-gray-700">Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>
            <div className="controls">
              <label className="block text-sm font-medium text-gray-700">Columns</label>
              <input
                type="number"
                value={cols}
                onChange={(e) => setCols(e.target.value)}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Create Collage
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

export default CollageMaker;
