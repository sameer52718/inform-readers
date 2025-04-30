import React, { createContext, useState, ReactNode, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance"; // Adjust path if needed

const defaultVideoInfo = {
  id: "",
  title: "Sample YouTube Video",
  channel: "Channel Name",
  duration: "10:30",
  thumbnail:
    "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  format: "MP4 - 720p",
  videoUrl: "", // New field to store actual download URL
};

export const VideoDownloadContext = createContext({
  isProcessing: false,
  currentUrl: null,
  videoInfo: defaultVideoInfo,
  startDownload: (url) => {},
  resetDownload: () => {},
});

export const VideoDownloadProvider = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [videoInfo, setVideoInfo] = useState(defaultVideoInfo);

  const startDownload = useCallback(async (url) => {
    try {
      setIsProcessing(true);
      setCurrentUrl(url);

      const { data } = await axiosInstance.get("/website/youtube", {
        params: { url },
      });

      // Update videoInfo with videoUrl from response
      setVideoInfo((prev) => ({
        ...prev,
        videoUrl: data.videoUrl || "", // fallback to empty string if not present
      }));
    } catch (error) {
      console.error("Download error:", error);
    }
  }, []);

  const resetDownload = useCallback(() => {
    setIsProcessing(false);
    setCurrentUrl(null);
    setVideoInfo(defaultVideoInfo);
  }, []);

  return (
    <VideoDownloadContext.Provider
      value={{
        isProcessing,
        currentUrl,
        videoInfo,
        startDownload,
        resetDownload,
        setIsProcessing,
      }}
    >
      {children}
    </VideoDownloadContext.Provider>
  );
};
