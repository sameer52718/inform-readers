"use client"
import { VideoDownloadProvider } from "@/context/VideoDownloadContext";
import DownloaderForm from "../components/DownloaderForm";
import { motion } from "framer-motion";

export default function TikTokDownloader() {
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
                <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">TikTok Video Downloader</h1>
                <p className="text-xl mb-8">
                  Download videos from TikTok quickly and easily. Just paste the TikTok URL and download!
                </p>
              </motion.div>
            </div>
          </div>
        </div>
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <DownloaderForm platform="tiktok" />
        </main>
      </div>
    </VideoDownloadProvider>
  );
}