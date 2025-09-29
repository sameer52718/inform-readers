"use client";

import React, { useState, useRef } from "react";

const ImageBrightnessContrast = () => {
  const [image, setImage] = useState(null);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
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

    const b = parseInt(brightness) || 0;
    const c = parseInt(contrast) || 0;

    if (b < -100 || b > 100 || c < -100 || c > 100) {
      setError("Brightness and Contrast must be between -100 and 100");
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
      const contrastFactor = (259 * (c + 255)) / (255 * (259 - c));

      for (let i = 0; i < data.length; i += 4) {
        data[i] = contrastFactor * (data[i] - 128) + 128 + b; // Red
        data[i + 1] = contrastFactor * (data[i + 1] - 128) + 128 + b; // Green
        data[i + 2] = contrastFactor * (data[i + 2] - 128) + 128 + b; // Blue
        data[i] = Math.max(0, Math.min(255, data[i]));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
      }

      ctx.putImageData(imageData, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      setResult(
        <a href={dataUrl} download="adjusted_image.png" className="text-red-600 hover:underline">
          Download Adjusted Image
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
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Adjust Brightness/Contrast</h1>
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
                <label className="block text-sm font-medium text-gray-700">Brightness (-100 to 100)</label>
                <input
                  type="number"
                  value={brightness}
                  onChange={(e) => setBrightness(e.target.value)}
                  min="-100"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contrast (-100 to 100)</label>
                <input
                  type="number"
                  value={contrast}
                  onChange={(e) => setContrast(e.target.value)}
                  min="-100"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Adjust
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

export default ImageBrightnessContrast;
