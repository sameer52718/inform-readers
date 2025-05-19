"use client";

import React, { useState, useRef, useEffect } from "react";

const ImageHistogram = () => {
  const [image, setImage] = useState(null);
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

      const histogram = { r: new Array(256).fill(0), g: new Array(256).fill(0), b: new Array(256).fill(0) };
      for (let i = 0; i < data.length; i += 4) {
        histogram.r[data[i]]++;
        histogram.g[data[i + 1]]++;
        histogram.b[data[i + 2]]++;
      }

      const histogramCanvas = canvasRef.current;
      histogramCanvas.width = 256;
      histogramCanvas.height = 150;
      const hCtx = histogramCanvas.getContext("2d");
      hCtx.fillStyle = "#4a5568"; // Gray background
      hCtx.fillRect(0, 0, 256, 150);

      const maxCount = Math.max(...Object.values(histogram).flat());
      for (let i = 0; i < 256; i++) {
        hCtx.fillStyle = "red";
        hCtx.fillRect(i, 150 - (histogram.r[i] / maxCount) * 150, 1, (histogram.r[i] / maxCount) * 150);
        hCtx.fillStyle = "green";
        hCtx.fillRect(i, 150 - (histogram.g[i] / maxCount) * 150, 1, (histogram.g[i] / maxCount) * 150);
        hCtx.fillStyle = "red";
        hCtx.fillRect(i, 150 - (histogram.b[i] / maxCount) * 150, 1, (histogram.b[i] / maxCount) * 150);
      }

      const dataUrl = histogramCanvas.toDataURL("image/png");
      setResult(
        <a href={dataUrl} download="histogram.png" className="text-red-600 hover:underline">
          Download Histogram
        </a>
      );
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (image) {
      processImage();
    }
  }, [image]);

  const handleSubmit = (e) => {
    e.preventDefault();
    processImage();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Image Histogram</h1>
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
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Show Histogram
          </button>
        </form>
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        <canvas ref={canvasRef} className="mx-auto mt-4" />
        {result && <div className="text-center mt-4">{result}</div>}
      </div>
    </div>
  );
};

export default ImageHistogram;
