"use client";

import React, { useState, useRef } from "react";
import heic2any from "heic2any";

const HeicToJpgPng = () => {
  const [image, setImage] = useState(null);
  const [format, setFormat] = useState("jpeg");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setError("");
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!image) {
      setError("Please upload a HEIC image");
      return;
    }

    try {
      const blob = await heic2any({ blob: image, toType: `image/${format}` });

      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Failed to load converted image"));
        i.src = URL.createObjectURL(blob);
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL(`image/${format}`);
      setResult(
        <a href={dataUrl} download={`converted_image.${format}`} className="text-red-600 hover:underline">
          Download {format.toUpperCase()} Image
        </a>
      );
    } catch (err) {
      console.error(err);
      setError("Error converting image");
    }
  };

  return (
    <div className=" bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">HEIC to JPG/PNG</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload HEIC Image</label>
              <input
                type="file"
                accept=".heic"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Output Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 bg-white text-gray-700 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Convert
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

export default HeicToJpgPng;
