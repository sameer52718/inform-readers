"use client";
import { Share2 } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

/**
 * Reusable ShareButton component
 *
 * Props:
 * - title: string (title of the shared content)
 * - text: string (description of the shared content)
 * - url: string (optional; defaults to current window URL)
 * - className: string (optional; to override styling)
 */
const ShareButton = ({ title, text, url, className }) => {
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: url || (typeof window !== "undefined" ? window.location.href : ""),
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      toast?.error?.("Web Share API is not supported in this browser. Use the social links to share.");
    }
  };

  return (
    <button
      className={`flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200 ${
        className || ""
      }`}
      onClick={handleNativeShare}
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
};

export default ShareButton;
