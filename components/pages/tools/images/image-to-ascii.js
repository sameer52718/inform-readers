"use client";

import React, { useState, useRef } from "react";

const ImageToAscii = () => {
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState(80);
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

    const w = parseInt(width) || 80;
    if (w < 10 || w > 200) {
      setError("Please enter a valid width (10-200)");
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
      canvas.width = w;
      canvas.height = Math.round(w * aspectRatio);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const chars = "@#S%?*+;:,.";
      let ascii = "";
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
          ascii += chars[chars.length - 1 - charIndex];
        }
        ascii += "\n";
      }

      const blob = new Blob([ascii], { type: "text/plain" });
      const downloadUrl = URL.createObjectURL(blob);
      setResult(
        <div>
          <pre className="bg-gray-200 text-gray-900 p-2 rounded-md max-h-52 overflow-y-auto text-xs whitespace-pre-wrap">
            {ascii}
          </pre>
          <a href={downloadUrl} download="ascii_art.txt" className="text-red-600 hover:underline">
            Download ASCII Art
          </a>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Image to ASCII</h1>
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
              <label className="block text-sm font-medium text-gray-700">ASCII Width (chars)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min="10"
                max="200"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Convert to ASCII
            </button>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <canvas ref={canvasRef} className="hidden" />
          {result && <div className="text-center mt-4">{result}</div>}
        </div>
      </div>
    </div>
  );
};

export default ImageToAscii;
