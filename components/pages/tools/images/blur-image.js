"use client";

import React, { useState, useRef, useEffect } from "react";

const BlurImage = () => {
  const [image, setImage] = useState(null);
  const [blurRadius, setBlurRadius] = useState(5); // Default to 5 as per the logic
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const tempCanvasRef = useRef(null);

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

    const radius = parseInt(blurRadius) || 5;
    if (radius < 1 || radius > 20) {
      setError("Please enter a valid blur radius (1-20)");
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

      const tempCanvas = tempCanvasRef.current;
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.drawImage(img, 0, 0);

      for (let i = 0; i < radius; i++) {
        tempCtx.globalAlpha = 0.2;
        tempCtx.drawImage(canvas, -1, 0);
        tempCtx.drawImage(canvas, 1, 0);
        tempCtx.drawImage(canvas, 0, -1);
        tempCtx.drawImage(canvas, 0, 1);
        ctx.drawImage(tempCanvas, 0, 0);
      }

      const dataUrl = canvas.toDataURL("image/png");
      setResult(
        <a href={dataUrl} download="blurred_image.png" className="text-red-600 hover:underline">
          Download Blurred Image
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
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Blur Image</h1>
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
            <label className="block text-sm font-medium text-gray-700">Blur Radius (1-20)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={blurRadius}
              onChange={(e) => setBlurRadius(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Blur
          </button>
        </form>
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={tempCanvasRef} className="hidden" />
        {result && <div className="text-center mt-4">{result}</div>}
      </div>
    </div>
  );
};

export default BlurImage;
