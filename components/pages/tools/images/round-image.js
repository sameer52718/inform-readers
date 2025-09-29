"use client";

import React, { useState, useRef } from "react";

const MakeRoundImage = () => {
  const [imageFile, setImageFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setDownloadUrl("");
    setError("");
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
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Failed to load image"));
        image.src = URL.createObjectURL(imageFile);
      });

      const size = Math.min(img.width, img.height);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = size;
      canvas.height = size;

      ctx.clearRect(0, 0, size, size);
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();

      ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);

      const dataUrl = canvas.toDataURL("image/png");
      setDownloadUrl(dataUrl);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className=" bg-gray-50 text-white py-12 flex justify-center items-center px-4">
      <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-red-500 text-center">Make Round Image</h1>

        <div>
          <label className="block text-sm text-gray-700  font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-red-50 file:text-red-700
              hover:file:bg-red-100
              "
          />
        </div>

        <button
          onClick={handleProcess}
          className="w-full py-2 px-4 font-semibold rounded-md text-white bg-red-500 hover:bg-red-600"
        >
          Make Round
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <canvas ref={canvasRef} className="w-full border border-gray-600 rounded-md" />

        {downloadUrl && (
          <div className="text-center mt-4">
            <a href={downloadUrl} download="round_image.png" className="text-red-500 hover:underline">
              Download Round Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeRoundImage;
