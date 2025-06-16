// app/components/DownloaderForm.js
"use client";
import React, { useContext, useState } from "react";
import { VideoDownloadContext } from "@/context/VideoDownloadContext";
import { Search, Loader2 } from "lucide-react";
import handleError from "@/lib/handleError";
import DownloadProcess from "./DownloadProcess";

const DownloaderForm = ({ platform }) => {
    const [url, setUrl] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState("");
    const { isProcessing, startDownload } = useContext(VideoDownloadContext);

    const validateUrl = (url) => {
        const platformRegex = {
            youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
            facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/,
            instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/,
            tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/,
        };
        return platformRegex[platform].test(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setValidationError("");
            setIsValidating(true);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const isValid = validateUrl(url);
            if (!isValid) {
                setValidationError(`Please enter a valid ${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`);
                setIsValidating(false);
                return;
            }
            await startDownload(url, platform);
            setIsValidating(false);
        } catch (error) {
            handleError(error);
            setValidationError(error.message || "An error occurred");
            setIsValidating(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {!isProcessing ? (
                <div>
                    <div className="relative">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className={`w-full p-4 pr-12 border ${validationError ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                            placeholder={`Paste ${platform.charAt(0).toUpperCase() + platform.slice(1)} URL here...`}
                            disabled={isValidating}
                        />
                        <button
                            onClick={handleSubmit}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                            disabled={isValidating || !url}
                        >
                            {isValidating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                        </button>
                    </div>
                    {validationError && <p className="text-red-500 mt-2 text-sm">{validationError}</p>}
                </div>
            ) : (
                <DownloadProcess />
            )}
        </div>
    );
};

export default DownloaderForm;