import React, { createContext, useState, ReactNode, useCallback } from "react";

const defaultVideoInfo = {
  id: "",
  title: "Sample YouTube Video",
  channel: "Channel Name",
  duration: "10:30",
  thumbnail:
    "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  format: "MP4 - 720p",
};

export const VideoDownloadContext = createContext({
  isProcessing: false,
  currentUrl: null,
  videoInfo: defaultVideoInfo,
  downloadHistory: [],
  startDownload: () => {},
  downloadComplete: () => {},
  resetDownload: () => {},
});

export const VideoDownloadProvider = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [downloadHistory, setDownloadHistory] = useState([]);

  // Generate a mock video info based on URL
  const generateMockVideoInfo = (url) => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const thumbnails = [
      "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ];

    const titles = [
      "How to Master React in 2025",
      "The Ultimate TypeScript Tutorial",
      "Building Modern Web Applications",
      "Frontend Development Crash Course",
      "Web Design Principles for Developers",
    ];

    const channels = [
      "Tech Masters",
      "Code Chronicles",
      "Web Dev Simplified",
      "Programming with Pro",
      "JS Wizards",
    ];

    const durations = ["10:28", "15:42", "8:15", "22:36", "5:59"];
    const formats = ["MP4 - 720p", "MP4 - 1080p", "MP3 - 320kbps"];

    return {
      id: randomId,
      title: titles[Math.floor(Math.random() * titles.length)],
      channel: channels[Math.floor(Math.random() * channels.length)],
      duration: durations[Math.floor(Math.random() * durations.length)],
      thumbnail: thumbnails[Math.floor(Math.random() * thumbnails.length)],
      format: formats[Math.floor(Math.random() * formats.length)],
    };
  };

  const [videoInfo, setVideoInfo] = useState(defaultVideoInfo);

  const startDownload = useCallback((url) => {
    setIsProcessing(true);
    setCurrentUrl(url);

    // Generate mock video info for the current URL
    const mockInfo = generateMockVideoInfo(url);
    setVideoInfo(mockInfo);
  }, []);

  const downloadComplete = useCallback(() => {
    if (currentUrl && videoInfo.id) {
      setDownloadHistory((prev) => [videoInfo, ...prev.slice(0, 4)]);
    }
  }, [currentUrl, videoInfo]);

  const resetDownload = useCallback(() => {
    setIsProcessing(false);
    setCurrentUrl(null);
  }, []);

  return (
    <VideoDownloadContext.Provider
      value={{
        isProcessing,
        currentUrl,
        videoInfo,
        downloadHistory,
        startDownload,
        downloadComplete,
        resetDownload,
      }}
    >
      {children}
    </VideoDownloadContext.Provider>
  );
};
