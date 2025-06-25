"use client";
import { Share2 } from "lucide-react";
import React from "react";

const ShareButton = ({ data }) => {
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.postalCode.code} - ${data.postalCode.area} | Postal Code Info`,
          text: `Explore postal code ${data.postalCode.code} in ${data.postalCode.area}, ${data.postalCode.state}, ${data.postalCode.countryId.name}.`,
          url: typeof window !== "undefined" ? window.location.href : "",
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      toast.error("Web Share API is not supported in this browser. Use the social links to share.");
    }
  };

  return (
    <button
      className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200"
      onClick={handleNativeShare}
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
};

export default ShareButton;
