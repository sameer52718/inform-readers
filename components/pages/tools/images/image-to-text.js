"use client";

import React, { useState } from "react";
import Tesseract from "tesseract.js";

const ImageToTextOCR = () => {
  const [image, setImage] = useState(null);
  const [resultText, setResultText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setResultText("");
    setError("");
  };

  const handleExtractText = async () => {
    setError("");
    setResultText("");

    if (!image) {
      setError("Please upload an image");
      return;
    }

    try {
      setLoading(true);
      const { data } = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log("OCR progress:", m),
      });
      setResultText(data.text);
    } catch (err) {
      setError("Error extracting text");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex justify-center items-center px-4">
      <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Image to Text (OCR)</h1>

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
              hover:file:bg-red-100
              "
          />
        </div>

        <button
          onClick={handleExtractText}
          disabled={loading}
          className={`w-full py-2 px-4 font-semibold rounded-md text-white 
            ${loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}
          `}
        >
          {loading ? "Extracting..." : "Extract Text"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <textarea
          readOnly
          value={resultText}
          placeholder="Extracted text will appear here..."
          className="w-full min-h-[150px] rounded-md border border-gray-300 p-3 text-gray-700 resize-none"
        />
      </div>
    </div>
  );
};

export default ImageToTextOCR;
