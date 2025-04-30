"use client";
import React, { useContext, useEffect, useState } from "react";
import { VideoDownloadProvider, VideoDownloadContext } from "@/context/VideoDownloadContext";
import { Search, Loader2, CheckCircle, XCircle, Clock, Download } from "lucide-react";
import { motion } from "framer-motion";
import handleError from "@/lib/handleError";

const DownloadProcess = () => {
  const { videoInfo, resetDownload, setIsProcessing } = useContext(VideoDownloadContext);
  const [steps, setSteps] = useState([
    { id: "validation", label: "Validating URL", status: "processing" },
    { id: "fetching", label: "Fetching video info", status: "pending" },
    { id: "processing", label: "Processing video", status: "pending" },
    { id: "downloading", label: "Preparing download", status: "pending" },
  ]);
  const [countdown, setCountdown] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    const updateStepStatus = (stepId, status) => {
      setSteps((currentSteps) =>
        currentSteps.map((step) => (step.id === stepId ? { ...step, status } : step))
      );
    };

    const simulateProcess = async () => {
      await new Promise((r) => setTimeout(r, 1500));
      updateStepStatus("validation", "completed");

      updateStepStatus("fetching", "processing");
      await new Promise((r) => setTimeout(r, 2000));
      updateStepStatus("fetching", "completed");

      updateStepStatus("processing", "processing");
      await new Promise((r) => setTimeout(r, 2000));
      updateStepStatus("processing", "completed");

      updateStepStatus("downloading", "processing");
      await new Promise((r) => setTimeout(r, 1500));
      updateStepStatus("downloading", "completed");
      // setIsProcessing(false);
      setCountdown(5);
    };

    simulateProcess();
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      setDownloadReady(true);
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const getStepIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-gray-400" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="py-4 max-w-md mx-auto">
      <div className="space-y-4 mb-6">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center">
            <div className="mr-3">{getStepIcon(step.status)}</div>
            <div>
              <div className="font-medium">{step.label}</div>
              {step.id === "downloading" && step.status === "completed" && !downloadReady && (
                <p className="text-sm text-gray-600">Download will be ready in {countdown}s...</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {downloadReady ? (
        <div className="text-center space-y-4">
          <p className="text-green-700 font-medium">Your download is ready!</p>
          <a
            href={videoInfo.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <Download className="h-5 w-5" />
            Click here to download
          </a>
          <button onClick={resetDownload} className="text-sm text-gray-600 hover:underline mt-2">
            Start New Download
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button onClick={resetDownload} className="text-sm text-gray-600 hover:underline">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
const DownloaderForm = () => {
  const [url, setUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");
  // const [isProcessing, setIsProcessing] = useState(false);

  const { isProcessing, startDownload } = useContext(VideoDownloadContext);

  const validateYoutubeUrl = (url) => {
    // Basic YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setValidationError("");
      setIsValidating(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isValid = validateYoutubeUrl(url);
      if (!isValid) {
        setValidationError("Please enter a valid YouTube URL");
        setIsValidating(false);
        return;
      }
      startDownload(url);
      setIsValidating(false);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {!isProcessing ? (
        <>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`w-full p-4 pr-12 border ${
                  validationError ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                placeholder="Paste YouTube URL here..."
                disabled={isValidating}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                disabled={isValidating || !url}
              >
                {isValidating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              </button>
            </div>
            {validationError && <p className="text-red-500 mt-2 text-sm">{validationError}</p>}
          </form>

          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <div className="text-sm text-gray-600">Popular formats:</div>
            <button className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
              MP4 - 720p
            </button>
            <button className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
              MP4 - 1080p
            </button>
            <button className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
              MP3 - 320kbps
            </button>
            <button className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
              MP3 - 128kbps
            </button>
          </div>
        </>
      ) : (
        <DownloadProcess />
      )}
    </div>
  );
};

const YoutubeDownloader = () => {
  return (
    <VideoDownloadProvider>
      <div className="flex flex-col min-h-screen">
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl text-white md:text-5xl font-bold mb-6">YouTube Video Downloader</h1>
                <p className="text-xl text-white mb-8">
                  Download your favorite YouTube videos quickly and easily. Just paste the URL, select
                  quality, and download!
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <DownloaderForm />
        </main>
      </div>
    </VideoDownloadProvider>
  );
};

export default YoutubeDownloader;
