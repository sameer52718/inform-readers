// app/components/VideoDownloadContext.js
"use client";
import React, { createContext, useState, useCallback } from "react";
import axios from "axios";

const defaultVideoInfo = {
  id: "",
  title: "Sample Video",
  channel: "Channel Name",
  duration: "10:30",
  thumbnail:
    "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  format: "MP4 - 720p",
  videoUrl: "",
};

export const VideoDownloadContext = createContext({
  isProcessing: false,
  currentUrl: null,
  videoInfo: defaultVideoInfo,
  platform: "",
  startDownload: () => {},
  resetDownload: () => {},
});

export const VideoDownloadProvider = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [videoInfo, setVideoInfo] = useState(defaultVideoInfo);
  const [platform, setPlatform] = useState("");

  const detectPlatform = (url) => {
    if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
    if (/facebook\.com/.test(url)) return "facebook";
    if (/instagram\.com/.test(url)) return "instagram";
    if (/tiktok\.com/.test(url)) return "tiktok";
    return "";
  };

  const startDownload = useCallback(async (url, expectedPlatform) => {
    try {
      setIsProcessing(true);
      setCurrentUrl(url);

      const detectedPlatform = detectPlatform(url);
      if (detectedPlatform !== expectedPlatform) {
        throw new Error(`Please enter a valid ${expectedPlatform} URL`);
      }
      setPlatform(detectedPlatform);

      const response = await axios.get("https://downloader.informreaders.com/tools/download_video", {
        params: {
          platform: detectedPlatform,
          video_url: url,
        },
      });

      const { data } = response;
      setVideoInfo((prev) => ({
        ...prev,
        videoUrl: data.video_url || "",
        title: data.title || "Sample Video",
        channel: data.channel || "Unknown Channel",
        thumbnail: data.thumbnail || defaultVideoInfo.thumbnail,
        duration: data.duration || "Unknown",
        format: data.format || "MP4 - 720p",
      }));
    } catch (error) {
      console.error("Download error:", error);
      setIsProcessing(false);
      throw error;
    }
  }, []);

  const resetDownload = useCallback(() => {
    setIsProcessing(false);
    setCurrentUrl(null);
    setVideoInfo(defaultVideoInfo);
    setPlatform("");
  }, []);

  return (
    <VideoDownloadContext.Provider
      value={{
        isProcessing,
        currentUrl,
        videoInfo,
        platform,
        startDownload,
        resetDownload,
      }}
    >
      {children}
    </VideoDownloadContext.Provider>
  );
};