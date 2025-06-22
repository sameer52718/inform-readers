"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { createElement } from "react";
import { Youtube, Facebook, Instagram, Music } from "lucide-react";

const iconMap = {
  Youtube,
  Facebook,
  Instagram,
  Music, // Placeholder for TikTok
};

const ToolCard = ({ name, description, href, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center mb-4">
        {iconMap[icon] && createElement(iconMap[icon], { className: "h-8 w-8 text-red-600 mr-3" })}
        <h2 className="text-xl font-semibold">{name}</h2>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Go to Downloader
      </Link>
    </motion.div>
  );
};

const tools = [
  {
    name: "YouTube Downloader",
    description: "Download videos from YouTube quickly and easily by pasting the video URL.",
    href: "/video-downloader/youtube",
    icon: "Youtube",
  },
  {
    name: "Facebook Downloader",
    description: "Save videos from Facebook with a simple URL paste.",
    href: "/video-downloader/facebook",
    icon: "Facebook",
  },
  {
    name: "Instagram Downloader",
    description: "Download Instagram videos and reels effortlessly.",
    href: "/video-downloader/instagram",
    icon: "Instagram",
  },
  {
    name: "TikTok Downloader",
    description: "Grab TikTok videos in seconds using the video URL.",
    href: "/video-downloader/tiktok",
    icon: "Music", // Placeholder, as lucide-react may not have a TikTok icon
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">Video Downloader Tools</h1>
            <p className="text-xl mb-8">
              Choose a platform to download videos quickly and easily. Paste the URL and get started!
            </p>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </main>
    </div>
  );
}