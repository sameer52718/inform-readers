"use client";

import React, { useState } from "react";
import EXIF from "exif-js";

const ViewMetadata = () => {
  const [imageFile, setImageFile] = useState(null);
  const [metadata, setMetadata] = useState("");
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setMetadata("");
    setError("");
  };

  const handleProcess = () => {
    setMetadata("");
    setError("");
    if (!imageFile) {
      setError("Please upload an image");
      return;
    }

    try {
      EXIF.getData(imageFile, function () {
        const allMetaData = EXIF.getAllTags(this);
        if (Object.keys(allMetaData).length === 0) {
          setMetadata("No metadata found");
        } else {
          setMetadata(JSON.stringify(allMetaData, null, 2));
        }
      });
    } catch (err) {
      setError("Error reading metadata");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-white flex justify-center items-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl text-red-400 font-bold text-center mb-6">View Metadata</h1>

        <div className="mb-4">
          <label className="block text-sm  text-gray-700 mb-1">Upload Image</label>
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

        <button onClick={handleProcess} className="w-full p-2 bg-red-500 hover:bg-red-600 font-bold rounded">
          View Metadata
        </button>

        <textarea
          readOnly
          value={metadata}
          className="w-full text-gray-700 mt-4 p-2 bg-white rounded  min-h-[100px]"
        />

        {error && <div className="text-red-400 mt-2 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default ViewMetadata;
