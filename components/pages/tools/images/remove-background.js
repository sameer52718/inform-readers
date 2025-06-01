"use client";

import React, { useState, useRef } from "react";

const RemoveBackground = () => {
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setError("");
    setDownloadUrl("");
  };

  const handleProcess = async () => {
    setError("");
    setDownloadUrl("");

    if (!imageFile) {
      setError("Please upload an image");
      return;
    }

    try {
      const img = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(imageFile);
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2];
        if (g > 100 && r < 100 && b < 100) {
          data[i + 3] = 0; // make green pixels transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      setDownloadUrl(dataUrl);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex justify-center items-center px-4">
      <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-red-500 text-center">Remove Background</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image (Green Background)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />
        </div>

        <button
          onClick={handleProcess}
          className="w-full py-2 px-4 font-semibold rounded-md text-white bg-red-500 hover:bg-red-600"
        >
          Remove Background
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <canvas ref={canvasRef} className="w-full border border-gray-300 rounded-md" />

        {downloadUrl && (
          <div className="text-center mt-4">
            <a href={downloadUrl} download="no_background_image.png" className="text-red-500 hover:underline">
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
