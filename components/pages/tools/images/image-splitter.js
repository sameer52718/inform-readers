"use client";

import React, { useRef, useState } from "react";

const ImageSplitterGrid = () => {
  const [image, setImage] = useState(null);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [error, setError] = useState("");
  const [tiles, setTiles] = useState([]);
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setError("");
    setTiles([]);
  };

  const handleSplit = async (e) => {
    e.preventDefault();
    setError("");
    setTiles([]);

    if (!image) {
      setError("Please upload an image");
      return;
    }

    if (rows <= 0 || cols <= 0) {
      setError("Please enter valid row and column values");
      return;
    }

    try {
      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Failed to load image"));
        i.src = URL.createObjectURL(image);
      });

      const tileWidth = img.width / cols;
      const tileHeight = img.height / rows;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const generatedTiles = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          canvas.width = tileWidth;
          canvas.height = tileHeight;
          ctx.clearRect(0, 0, tileWidth, tileHeight);
          ctx.drawImage(
            img,
            c * tileWidth,
            r * tileHeight,
            tileWidth,
            tileHeight,
            0,
            0,
            tileWidth,
            tileHeight
          );
          const dataUrl = canvas.toDataURL("image/png");
          generatedTiles.push({
            url: dataUrl,
            name: `tile_${r}_${c}.png`,
            label: `Download Tile ${r + 1}x${c + 1}`,
          });
        }
      }

      setTiles(generatedTiles);
    } catch (err) {
      console.error(err);
      setError("Error splitting image");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">Image Splitter (Grid)</h1>
          <form onSubmit={handleSplit} className="space-y-6">
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
                <label className="block text-sm font-medium text-gray-700">Rows</label>
                <input
                  type="number"
                  min="1"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Columns</label>
                <input
                  type="number"
                  min="1"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Split Image
            </button>
          </form>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <canvas ref={canvasRef} style={{ display: "none" }} />

          {tiles.length > 0 && (
            <div className="mt-6 space-y-2 text-center">
              {tiles.map((tile, idx) => (
                <a
                  key={idx}
                  href={tile.url}
                  download={tile.name}
                  className="block text-red-600 hover:underline"
                >
                  {tile.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSplitterGrid;
