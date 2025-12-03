import { VideoDownloadProvider } from "@/context/VideoDownloadContext";
import DownloaderForm from "../components/DownloaderForm";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";

// Dynamic Metadata for TikTok Video Downloader Page
export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/downloaders/tiktok-video-downloader/`, host);

  const title = "TikTok Video Downloader – Free & Fast Online Tool";
  const description =
    "Download TikTok videos quickly and easily with our free online TikTok downloader. Just paste the TikTok video URL and download in seconds.";

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical.toString(),
      type: "website",
      images: [
        {
          url: `https://${host}/website/assets/images/logo/logo.png`,
          width: 1200,
          height: 630,
          alt: "TikTok Video Downloader",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://${host}/website/assets/images/logo/logo.png`],
    },
  };
}

export default function TikTokDownloader() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Downloaders", href: "/downloaders" },
    { label: "Tiktok Video Downloader" },
  ];

  return (
    <VideoDownloadProvider>
      <div className="flex flex-col min-h-screen">
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div>
                <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">TikTok Video Downloader</h1>
                <p className="text-xl mb-8">
                  Download videos from TikTok quickly and easily. Just paste the TikTok URL and download!
                </p>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumb items={breadcrumbItems} />
          <DownloaderForm platform="tiktok" />
        </main>
      </div>
    </VideoDownloadProvider>
  );
}
