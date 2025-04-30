"use client";
import React, { useContext, useEffect, useState } from "react";
import { VideoDownloadProvider, VideoDownloadContext } from "@/context/VideoDownloadContext";
import { Search, Loader2, CheckCircle, XCircle, Clock, Download } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";
const RecentDownloads = () => {
  const { downloadHistory } = useContext(VideoDownloadContext);

  if (downloadHistory.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center mb-4">
        <Clock className="mr-2 text-gray-600" />
        <h2 className="text-xl font-semibold">Recent Downloads</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {downloadHistory.map((video) => (
            <div
              key={video.id}
              className="flex border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="w-24 h-24 flex-shrink-0">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 p-3">
                <h3 className="font-medium text-sm mb-1 line-clamp-1">{video.title}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  {video.duration} • {video.format}
                </p>

                <button className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors">
                  <Download className="h-3 w-3" />
                  Download again
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DownloadProcess = () => {
  const { currentUrl, videoInfo, downloadComplete, resetDownload } = useContext(VideoDownloadContext);
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

    // Simulate the download process
    const simulateProcess = async () => {
      // Step 1: Validate URL (already started)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      updateStepStatus("validation", "completed");

      // Step 2: Fetch video info
      updateStepStatus("fetching", "processing");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      updateStepStatus("fetching", "completed");

      // Step 3: Process video
      updateStepStatus("processing", "processing");
      await new Promise((resolve) => setTimeout(resolve, 2500));
      updateStepStatus("processing", "completed");

      // Step 4: Prepare download
      updateStepStatus("downloading", "processing");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      updateStepStatus("downloading", "completed");

      // Start countdown
      setCountdown(5);
    };

    simulateProcess();
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      setDownloadReady(true);
      downloadComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, downloadComplete]);

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

  const handleResetDownload = () => {
    resetDownload();
  };

  return (
    <div className="py-4">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-full max-w-md overflow-hidden rounded-lg">
          <img src={videoInfo.thumbnail} alt={videoInfo.title} className="w-full object-cover aspect-video" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <h3 className="font-semibold truncate max-w-xs">{videoInfo.title}</h3>
              <p className="text-sm opacity-80">
                {videoInfo.duration} • {videoInfo.channel}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center">
            <div className="mr-3">{getStepIcon(step.status)}</div>
            <div className="flex-1">
              <div className="font-medium">{step.label}</div>
              {step.id === "downloading" && step.status === "completed" && !downloadReady && (
                <div className="text-sm text-gray-600">Download will be ready in {countdown}s...</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {downloadReady ? (
        <div className="flex flex-col items-center">
          <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-lg text-center w-full">
            <p className="font-medium">Your download is ready!</p>
            <p className="text-sm">Click the button below to download</p>
          </div>

          <div className="flex gap-4">
            <a
              href="#download-link"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              onClick={(e) => {
                e.preventDefault();
                alert("Download started! (This is a simulation)");
              }}
            >
              <Download className="h-5 w-5" />
              Download MP4 (720p)
            </a>

            <button
              onClick={handleResetDownload}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              New Download
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={handleResetDownload}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
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
  const { isProcessing, startDownload } = useContext(VideoDownloadContext);

  const validateYoutubeUrl = (url) => {
    // Basic YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axiosInstance.get("/website/youtube", { params: { url } });

    // // Reset states
    // setValidationError("");
    // setIsValidating(true);

    // // Simulate validation delay
    // setTimeout(() => {
    //   const isValid = validateYoutubeUrl(url);

    //   if (!isValid) {
    //     setValidationError("Please enter a valid YouTube URL");
    //     setIsValidating(false);
    //     return;
    //   }

    //   setIsValidating(false);
    //   startDownload(url);
    // }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {!isProcessing ? (
        <>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
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
          <RecentDownloads />
        </main>
      </div>
    </VideoDownloadProvider>
  );
};

export default YoutubeDownloader;
