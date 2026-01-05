import { VideoDownloadProvider } from "@/context/VideoDownloadContext";
import DownloaderForm from "../components/DownloaderForm";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";

// Dynamic Metadata for TikTok Video Downloader Page
export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(
    `/downloaders/tiktok-video-downloader/`,
    host
  );

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
                <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">
                  TikTok Video Downloader
                </h1>
                <p className="text-xl mb-8">
                  Download videos from TikTok quickly and easily. Just paste the
                  TikTok URL and download!
                </p>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumb items={breadcrumbItems} />
          <DownloaderForm platform="tiktok" />
          <section className="mt-12 space-y-10 text-gray-800">
            {/* Tool Overview */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">
                About TikTok Video Downloader
              </h2>
              <p>
                Enables users to obtain and save video content that is publicly
                available on TikTok.
              </p>
            </div>

            {/* Supported & Unsupported Content */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Supported Content</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Publicly accessible TikTok short-form videos</li>
                <li>
                  User-generated videos with sounds, effects, and text overlays
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-5 mb-2">
                Unsupported Content
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Private videos</li>
                <li>For You Page content requiring login</li>
                <li>Paid or restricted content</li>
                <li>Live streams and interactive posts</li>
              </ul>
            </div>

            {/* Quality & Formats */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Video & Audio Formats
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">MP4 Video</h4>
                  <p>
                    Videos are downloaded in the highest resolution available
                    (up to 1080p), without exceeding the original upload
                    quality.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg">MP3 Audio</h4>
                  <p>
                    If supported, audio is extracted from the video and
                    converted to MP3. Quality depends on the original TikTok
                    audio track.
                  </p>
                </div>
              </div>
            </div>

            {/* Watermark Info */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Watermark Handling</h3>
              <p>
                Some downloads may include or exclude the TikTok watermark.
                Watermark removal depends on TikTok platform limitations and
                tool capabilities.
              </p>
            </div>

            {/* Failure Reasons */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Why a Download May Fail
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Video is private or deleted</li>
                <li>Regional or geo-blocking restrictions</li>
                <li>TikTok platform or API changes</li>
                <li>Network or server issues</li>
                <li>Live or interactive content</li>
              </ul>
            </div>

            {/* Responsible Use */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Responsible Use Notice
              </h3>
              <p className="mb-2">
                Downloaded videos remain the intellectual property of their
                original creators.
              </p>
              <p className="text-sm text-gray-600">
                Unauthorized downloading, redistribution, or commercial use may
                violate TikTok’s Terms of Service.
              </p>
            </div>
          </section>
        </main>
      </div>
    </VideoDownloadProvider>
  );
}
