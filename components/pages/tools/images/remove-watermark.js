"use client";

import React, { useState, useRef, useEffect } from "react";

const RemoveWatermark = () => {
  const [image, setImage] = useState(null);
  const [watermarkX, setWatermarkX] = useState("");
  const [watermarkY, setWatermarkY] = useState("");
  const [watermarkWidth, setWatermarkWidth] = useState("");
  const [watermarkHeight, setWatermarkHeight] = useState("");
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
    console.log("processing");

    const x = parseInt(watermarkX) || 0;
    const y = parseInt(watermarkY) || 0;
    const width = parseInt(watermarkWidth) || 100;
    const height = parseInt(watermarkHeight) || 100;

    if (x < 0 || y < 0 || width < 1 || height < 1) {
      setError("Please enter valid watermark coordinates and dimensions");
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

      for (let dy = y; dy < y + height && dy < img.height; dy++) {
        for (let dx = x; dx < x + width && dx < img.width; dx++) {
          const i = (dy * img.width + dx) * 4;
          let r = 0,
            g = 0,
            b = 0,
            count = 0;
          for (let ny = -1; ny <= 1; ny++) {
            for (let nx = -1; nx <= 1; nx++) {
              const nxPos = dx + nx;
              const nyPos = dy + ny;
              if (
                nxPos >= 0 &&
                nxPos < img.width &&
                nyPos >= 0 &&
                nyPos < img.height &&
                !(nxPos >= x && nxPos < x + width && nyPos >= y && nyPos < y + height)
              ) {
                const ni = (nyPos * img.width + nxPos) * 4;
                r += data[ni];
                g += data[ni + 1];
                b += data[ni + 2];
                count++;
              }
            }
          }
          data[i] = count ? r / count : data[i];
          data[i + 1] = count ? g / count : data[i + 1];
          data[i + 2] = count ? b / count : data[i + 2];
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      setResult(
        <a href={dataUrl} download="no_watermark_image.png" className="text-red-600 hover:underline">
          Download Image
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
      <div className="max-w-7xl mx-auto  px-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Remove Watermark</h1>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Watermark X (px)</label>
              <input
                type="number"
                value={watermarkX}
                onChange={(e) => setWatermarkX(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Watermark Y (px)</label>
              <input
                type="number"
                value={watermarkY}
                onChange={(e) => setWatermarkY(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Watermark Width (px)</label>
              <input
                type="number"
                value={watermarkWidth}
                onChange={(e) => setWatermarkWidth(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Watermark Height (px)</label>
              <input
                type="number"
                value={watermarkHeight}
                onChange={(e) => setWatermarkHeight(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Remove Watermark
          </button>
        </form>
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        <canvas ref={canvasRef} className="hidden" />
        {result && <div className="text-center mt-4">{result}</div>}
      </div>
    </div>
  );
};

export default RemoveWatermark;
