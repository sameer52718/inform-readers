"use client";

import React, { useRef, useState } from "react";

const ResizeImage = () => {
  const canvasRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setError("");
    setDownloadUrl("");
  };

  const handleResize = async () => {
    setError("");
    setDownloadUrl("");

    if (!imageFile) {
      setError("Please upload an image");
      return;
    }
    if (width <= 0 || height <= 0) {
      setError("Please enter valid width and height");
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
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/png");
      setDownloadUrl(dataUrl);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className=" bg-gray-50 py-12 flex justify-center items-center px-4">
      <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-red-500 text-center">Resize Image</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-red-50 file:text-red-700
              hover:file:bg-red-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
          <input
            type="number"
            min="1"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
          <input
            type="number"
            min="1"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <button
          onClick={handleResize}
          className="w-full py-2 px-4 font-semibold rounded-md text-white bg-red-500 hover:bg-red-600"
        >
          Resize
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <canvas ref={canvasRef} className="w-full border border-gray-300 rounded-md" />

        {downloadUrl && (
          <div className="text-center mt-4">
            <a href={downloadUrl} download="resized_image.png" className="text-red-500 hover:underline">
              Download Resized Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResizeImage;
